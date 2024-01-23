/*
 * 	PlayerHelpManager.js
 * 	新手引导
 *
 *	author:hongdian
 *	date:2014-10-28
 *	version:1.0
 *
 * 修改时间 修改人 修改内容:
 *
 *
 */

var app = require('app');

/*
 * 类方法定义
 */
var PlayerHelpManager = app.BaseClass.extend({

	/**
	 * 初始化
	 */
	Init:function(){
        this.JS_Name = "PlayerHelpManager";

        this.ComTool = app.ComTool();
        this.SysDataManager = app.SysDataManager();
        this.HeroManager = app.HeroManager();
        this.NetManager = app.NetManager();
        this.ShareDefine = app.ShareDefine();
        this.HelpEvent = {};//this.SysDataManager.GetTableDict("HelpEvent");
        this.EventClickInfo = {};//this.SysDataManager.GetTableDict("EventClickInfo");
        this.EventTalkInfo = {};//this.SysDataManager.GetTableDict("EventTalkInfo");

        this.FirstEventID = 0;
        this.DBEventIDList = [];

		this.allEventIDList = [];
        this.isCloseEvent = 1;

		this.OnReload();

        this.InitData();

        app.Client.RegEvent("HeroProperty", this.OnEvent_HeroProperty, this);
        app.Client.RegEvent("PlayerLoginOK", this.OnEvent_PlayerLoginOK, this);

    },

    InitData:function(){
        let eventIDList = Object.keys(this.HelpEvent);
        eventIDList.SortList();
        let count = eventIDList.length;

        let waitEventID = 0;


        for(let index=0; index<count; index++){
            let eventID = eventIDList[index];

            //初始化等待事件开头ID
            if(!waitEventID){
                waitEventID = eventID
            }
            let eventInfo = this.HelpEvent[eventID];

	        let eventTalkIDList = eventInfo["EventTalkIDList"];
	        let eventClickID = eventInfo["EventClickID"];

            if(eventClickID){
                if(!this.EventClickInfo[eventClickID]){
                    this.ErrLog("eventID(%s) EventClickInfo.txt (%s) not find", eventID, eventClickID);
                    continue
                }
            }
	        if(eventTalkIDList){
		        let talkCount = eventTalkIDList.length;
		        for(let talkIndex=0; talkIndex<talkCount; talkIndex++){
			        let talkID = eventTalkIDList[talkIndex];
			        if(!this.EventTalkInfo.hasOwnProperty(talkID)){
				        this.ErrLog("EventTalkInfo.txt not find:%s", talkID);
			        }
		        }
	        }

	        this.allEventIDList.push(eventID);

            //不是通关塔层过滤
            if(this.HelpEvent[eventID]["ConditionType"] != "PassMaxTowerLv"){
	            continue
            }
            if(this.DBEventIDList.InArray(eventID)){
                this.ErrLog("InitData DBEventIDList have find:%s", eventID);
                continue
            }
            this.DBEventIDList.push(eventID);
        }

	    this.DBEventIDList.SortList();
	    this.allEventIDList.SortList();

	    if(this.allEventIDList.length){
		    this.FirstEventID = this.allEventIDList[0];
	    }
	    else{
		    this.FirstEventID = 0;
	    }
    },

    OnReload:function(){
        this.eventID = 0;
        this.waitEventID = 0;
    },

    SetIsCloseEvent:function(){
        this.isCloseEvent = !this.isCloseEvent
    },

    GetIsCloseEvent:function(){
        return this.isCloseEvent
    },

    GetNowEventID:function(){
        return this.eventID
    },

    //---------------回调函数--------------
    //玩家属性变化
    OnEvent_HeroProperty:function(event){
        //let argDict = event.detail;
        //
        //let value = argDict["Value"];
        //let property = argDict["Property"];
        //if(property == "PassMaxTowerLv"){
        //    this.OnPassMaxTowerLv(value);
        //}
    },

    //玩家登陆完成
    OnEvent_PlayerLoginOK:function(event){

        if(this.isCloseEvent){
            this.eventID = 0;
            return
        }

	    let argDict = event.detail;
	    //如果是新建角色登录
	    if(argDict["IsNewPlayer"]){
		    this.eventID = this.FirstEventID;
	    }
	    else{
		    //非新建角色登录,需要初始化一次玩家引导事件ID
		    let findEventID = 0;
		    let heroDBEventID = this.HeroManager.GetHeroProperty("eventID");

		    let dbEventCount = this.DBEventIDList.length;

		    //查找下一个可以被执行的DB事件
		    for(let index=0; index<dbEventCount; index++){
			    let dbEventID = this.DBEventIDList[index];
			    if(dbEventID > heroDBEventID){
				    findEventID = dbEventID;
				    break
			    }
		    }
		    //如果没有找到记录事件ID对应的事件(查找第一个大于dbEventID事件)
		    this.Log("OnEvent_PlayerLoginOK heroDBEventID:%s find next EventID:%s", heroDBEventID, findEventID);
		    if(findEventID){
			    this.eventID = findEventID;
		    }
		    //没有找到事件ID,可能已经是最大引导了
		    else{
			    this.Log("findEventID:%s error", findEventID);
			    this.eventID = 0;
		    }
	    }

        this.Log("OnEvent_PlayerLoginOK(%s)", this.eventID);
    },

    //战斗主界面显示完成
    OnUIFightTowerShowEnd:function(){
	    this.Log("OnUIFightTowerShowEnd(%s)", this.eventID);

        if(!this.eventID){
            return
        }

	    let helpEvent = this.HelpEvent[this.eventID];
	    let conditionType = helpEvent["ConditionType"]

	    //如果是第一个引导事件,直接运行
	    if(this.eventID == this.FirstEventID){
		    this.RunEvent(this.eventID);
	    }
	    //如果是通关事件,调用通关接口
	    else if(conditionType == "PassMaxTowerLv"){
	    }

    },

    //-------------条件判断接口--------------

    OnPassMaxTowerLv:function(passMaxTowerLv){

	    let helpEvent = this.HelpEvent[this.eventID];
	    if(!helpEvent){
		    return
	    }
	    if(helpEvent["ConditionType"] != "PassMaxTowerLv"){
		    return
	    }
	    if(passMaxTowerLv < helpEvent["ConditionValue"]){
		    return
	    }
	    this.Log("OnPassMaxTowerLv(%s):%s", passMaxTowerLv, this.eventID);

        this.RunEvent(this.eventID);
    },

    //新塔层激活
    OnTowerLvActive:function(towerLv){
	    let helpEvent = this.HelpEvent[this.eventID];
	    if(!helpEvent){
		    return
	    }
	    if(helpEvent["ConditionType"] != "TowerLvActive"){
		    return
	    }
	    if(towerLv != helpEvent["ConditionValue"]){
		    return
	    }
	    this.Log("OnTowerLvActive(%s):%s", towerLv, this.eventID);

	    this.RunEvent(this.eventID);
    },

    //新BOSS塔层激活
    OnTowerBossActive:function(bossTowerLv){
	    let helpEvent = this.HelpEvent[this.eventID];
	    if(!helpEvent){
		    return
	    }
	    if(helpEvent["ConditionType"] != "TowerBossActive"){
		    return
	    }
	    if(bossTowerLv != helpEvent["ConditionValue"]){
		    return
	    }
	    this.Log("OnTowerBossActive(%s):%s", bossTowerLv, this.eventID);

	    this.RunEvent(this.eventID);
    },

    //塔层BOSS被杀死
    OnTowerBossDie:function(bossTowerLv){
	    let helpEvent = this.HelpEvent[this.eventID];
	    if(!helpEvent){
		    return
	    }
	    if(helpEvent["ConditionType"] != "TowerBossDie"){
		    return
	    }
	    if(bossTowerLv != helpEvent["ConditionValue"]){
		    return
	    }
	    this.Log("OnTowerBossDie(%s):%s", bossTowerLv, this.eventID);

	    this.RunEvent(this.eventID);

        let eventTalkIDList = helpEvent["EventTalkIDList"];
        //如果有对话,需要暂停
        if(eventTalkIDList.length){
            return true
        }

        return false
    },

	//进入场景
	OnSwithSceneEnd:function(sceneType){
		//没有等待引导事件
		if(!this.eventID){
			return
		}

		let conditionType = this.HelpEvent[this.eventID]["ConditionType"];
		let conditionValue = this.HelpEvent[this.eventID]["ConditionValue"];
		if(conditionType != "EnterScene"){
			return
		}
		this.Log("OnSwithSceneEnd(%s):%s", sceneType, this.eventID);
		if(conditionValue != sceneType){
			return
		}
		this.RunEvent(this.eventID);
	},

    //--------------触发函数------------------

	//执行事件
    RunEvent:function(eventID){

        this.Log("RunEvent(%s)", eventID);
        let eventInfo = this.HelpEvent[eventID];
        if(!eventInfo){
            this.ErrLog("RunEvent(%s) HelpEvent.txt not find", eventID);
            return
        }

        //可能空事件也需要记录DB
        if(this.DBEventIDList.InArray(eventID)){
            this.SendRecordEventID(eventID);
        }

        //记录当前执行的事件ID
        this.eventID = eventID;
	    this.waitEventID = 0;

        let eventTalkIDList = eventInfo["EventTalkIDList"];
        let eventClickID = eventInfo["EventClickID"];
        let eventName = eventInfo["EventName"];
        let conditionValue = eventInfo["ConditionValue"];

        this.Log("eventID(%s) eventClickID(%s) eventTalkIDList:", eventID, eventClickID, eventTalkIDList);

        //打开对话界面,需要深拷贝,UIChatMsg会执行删除掉列表元素
        if(eventTalkIDList.length){
	        this.waitEventID = eventID;
            app.FormManager().ShowForm("UIChatMsg", eventID, this.ComTool.DeepCopy(eventTalkIDList));

	        let sceneType = app.SceneManager().GetSceneType();
	        if(sceneType == "bossScene"){
		        app.FightControl_Boss().EventTalkPauseTowerFight();
	        }
	        else if(sceneType == "mainScene"){
		        app.FightControl_Tower().EventTalkPauseTowerFight();
	        }
	        else{
		        this.ErrLog("RunEvent sceneType:%s error", sceneType);
	        }
        }

        //打开引导点击置顶层
        else if(eventClickID){
	        this.waitEventID = eventID;
            let eventNode = this.GetClickEventNode(eventClickID);
            if(eventNode){
                app.SceneManager().ShowHelp(eventID, eventNode);
            }
        }
        //如果没有对话和点击事件,则触发后续事件
        else{
            if(eventName){
                app.Client.OnEvent("HelpEvent", {"EventName":eventName, "ConditionValue":conditionValue});
            }

            this.TriggerNextEvent(eventID);
        }
    },

    //触发后续事件ID
    TriggerNextEvent:function(oldEventID){

        let eventInfo = this.HelpEvent[oldEventID];
        if(!eventInfo){
            this.ErrLog("TriggerNextEvent(%s) HelpEvent.txt not find", oldEventID);
            return
        }

	    let index = this.allEventIDList.IndexOf(oldEventID);
        let nextEventID = this.allEventIDList[index + 1];
        //没有后续引导
        if(!nextEventID){
	        this.eventID = 0;
            return
        }

        let nextEventInfo = this.HelpEvent[nextEventID];
        if(!nextEventInfo){
            this.ErrLog("TriggerNextEvent HelpEvent.txt (%s) not find", nextEventID);
            return
        }
        this.Log("TriggerNextEvent(%s) -> (%s)", oldEventID, nextEventID);

        let conditionType = nextEventInfo["ConditionType"];
	    this.eventID = nextEventID;

        if(conditionType == "PassMaxTowerLv"){
        }
        else if(conditionType == "TowerLvActive"){
        }
        else if(conditionType == "TowerBossActive"){
        }
        else if(conditionType == "EnterScene"){
	        let sceneType = app.SceneManager().GetSceneType();
	        this.OnSwithSceneEnd(sceneType);
        }
        //不需要条件触发
        else if(!conditionType){
            this.RunEvent(nextEventID);
        }
        else{
            this.Log("TriggerNextEvent(%s) conditionType:%s not allow", nextEventID, conditionType);
        }
    },

	//-----------------等待执行后续事件--------------------------

    //引导控件被点击了
    OnClickEventButton:function(eventID){

        if(eventID != this.waitEventID){
            this.ErrLog("OnClickEventButton(%s) != (%s)(%s)", eventID, this.waitEventID, this.eventID);
            return
        }
        let eventInfo = this.HelpEvent[this.waitEventID];
        let eventName = eventInfo["EventName"];
        let conditionValue = eventInfo["ConditionValue"];
        if(eventName){
            app.Client.OnEvent("HelpEvent", {"EventName":eventName, "ConditionValue":conditionValue});
        }
        this.Log("OnClickEventButton(%s) %s", eventID, this.eventID);

        this.TriggerNextEvent(this.waitEventID);
    },

    //引导对话播放结束
    OnTalkEnd:function(eventID){

	    let sceneType = app.SceneManager().GetSceneType();
	    if(sceneType == "bossScene"){
		    app.FightControl_Boss().EndEventTalkContinueTowerFight();
	    }
	    else if(sceneType == "mainScene"){
		    app.FightControl_Tower().EndEventTalkContinueTowerFight();
	    }
	    else{
		    this.ErrLog("OnTalkEnd sceneType:%s error", sceneType);
	    }

        if(eventID != this.waitEventID){
            this.ErrLog("OnTalkEnd(%s) != (%s)(%s)", eventID, this.waitEventID, this.eventID);
            return
        }
        let eventInfo = this.HelpEvent[this.waitEventID];

        let eventName = eventInfo["EventName"];
        let conditionValue = eventInfo["ConditionValue"];
        if(eventName){
            app.Client.OnEvent("HelpEvent", {"EventName":eventName, "ConditionValue":conditionValue});
        }

        this.Log("OnTalkEnd(%s)(%s)", eventID, this.eventID);

        this.TriggerNextEvent(this.waitEventID);
    },

    //界面显示
    OnFormShow:function(formName){
        //没有等待引导事件
        if(!this.waitEventID){
            return
        }
        let helpEvent = this.HelpEvent[this.waitEventID];
        if(!helpEvent){
            this.ErrLog("OnFormShow HelpEvent.txt not find:%s", this.waitEventID);
            return
        }
        let eventClickID = helpEvent["EventClickID"];
        let conditionType = helpEvent["ConditionType"];
        let conditionValue = helpEvent["ConditionValue"];
        //没有等待点击事件
        if(!eventClickID){
            return
        }
        let eventClickInfo = this.EventClickInfo[eventClickID];
        if(!eventClickInfo){
            this.ErrLog("(%s) OnFormShow not find(%s)", this.waitEventID, eventClickID);
            return
        }
        if(formName != eventClickInfo["FormName"]){
            return
        }

	    this.Log("OnFormShow(%s):%s,%s", formName, this.eventID, this.waitEventID);

        //如果是BOSS层激活,需要判断BOSS层是否被激活,否则隐藏状态下不能加特效
        if(conditionType == "TowerBossActive"){
        }

        let eventNode = this.GetClickEventNode(eventClickID);
        if(eventNode){
            //如果界面背身是打开状态,有可能重复触发点击事件 
            //因为在RunEvent已经立即触发点击事件置顶了,进入场景默认打开界面会重新触发onshow
            app.SceneManager().ShowHelp(this.waitEventID, eventNode);
        }
    },

    //-------------获取接口-----------------
    //获取点击事件ID的node对象
    GetClickEventNode:function(clickID){
        let eventClickInfo = this.EventClickInfo[clickID];
        if(!eventClickInfo){
            this.ErrLog("GetClickEventNode(%s) not find", clickID);
            return 
        }

        let formName = eventClickInfo["FormName"];
        let childFormName = eventClickInfo["ChildFormName"];
        let viewChildFormName = eventClickInfo["ViewChildFormName"];
        let childIndex = eventClickInfo["ChildIndex"];
        let buttonPath = eventClickInfo["ButtonPath"];

        let formComponent = app.FormManager().GetFormComponentByFormName(formName);
        if(!formComponent){
            this.Log("GetClickEventNode(%s) not create", formName);
            return
        }

        if(childFormName){
            let allChildFormList = formComponent.GetAllChildComponentByName(childFormName);
            let childCount = allChildFormList.length;
            if(childCount != 1){
                this.ErrLog("GetClickEventNode(%s) childFormName:%s,:%s error", clickID, childFormName, childCount);
                return
            }
            formComponent = allChildFormList[0];
        }

        if(viewChildFormName){
            formComponent = formComponent.GetChildComponentByChildIndex(viewChildFormName, childIndex);
            if(!formComponent){
                this.ErrLog("GetClickEventNode(%s) viewChildFormName:%s,:%s error", clickID, viewChildFormName, childIndex)
                return
            }
        }

        let eventButtonNode = cc.find(buttonPath, formComponent.node);
        if(!eventButtonNode){
            this.ErrLog("GetClickEventNode(%s) not find (%s) node", formName, buttonPath);
            return
        }
        let button = eventButtonNode.getComponent(cc.Button);
        if(!button){
            this.ErrLog("GetClickEventNode(%s,%s) not find cc.Button", formName, buttonPath);
            return
        }
        return eventButtonNode
    },
	
    //-----------发包接口------------------
    //发送记录事件ID
    SendRecordEventID:function(eventID){
    },

})

var g_PlayerHelpManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
    if(g_PlayerHelpManager){
        return g_PlayerHelpManager
    }
    g_PlayerHelpManager = new PlayerHelpManager();
    return g_PlayerHelpManager;
}