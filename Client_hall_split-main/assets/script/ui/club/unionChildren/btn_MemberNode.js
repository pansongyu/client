var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {
        unSelectSprite:cc.SpriteFrame,
        selectSprite:cc.SpriteFrame,
    },
    onLoad:function(){
        this.ComTool=app.ComTool();
        app.Client.RegEvent("OnUnionMemberInfoChange", this.Event_UnionMemberInfoChange, this);

    	// let memberScrollView = this.node.getChildByName("memberScrollView").getComponent(cc.ScrollView);
     //    memberScrollView.node.on('scroll-to-bottom',this.GetNextPage,this);
    },
    InitData:function (clubId, unionId, unionPostType, myisminister, unionName, unionSign) {
        this.clubId = clubId;
        this.unionId = unionId;
        this.unionName = unionName;
        this.unionSign = unionSign;
        this.unionPostType = unionPostType;
        this.curPage = 1;
        this.lastPage = 1;
        this.queryStr = "";
        this.node.getChildByName("searchEditBox").getComponent(cc.EditBox).string = "";
        //刷新页数
        let lb_page = this.node.getChildByName("page").getChildByName("lb_page");
        lb_page.getComponent(cc.Label).string = this.curPage;
        this.GetPalyerList(true);
        let self = this;
        let sendOnlinePack = app.ClubManager().GetUnionSendPackHead();
        app.NetManager().SendPack("union.CUnionOnlinePlayerCount",sendOnlinePack, function(serverPack){
            self.node.getChildByName("lb_OnlineCount").getComponent(cc.Label).string = "当前赛事在线人数："+serverPack+"人";
        }, function(){
            app.SysNotifyManager().ShowSysMsg("获取在线人数失败",[],3);
        });

        if(app.ClubManager().GetUnionTypeByLastClubData()==1){
            app.NetManager().SendPack("Union.CUnionCountInfoByZhongZhi",sendOnlinePack, function(serverPack){
                self.node.getChildByName("tip").getComponent(cc.Label).string="联赛活跃积分:"+serverPack.prizePool+"、成员总积分:"+serverPack.unionAllMemberPointTotal+"、房卡消耗:"+serverPack.consumeValue+"、最终积分总和:"+serverPack.finalAllMemberPointTotal;
            }, function(){
                app.SysNotifyManager().ShowSysMsg("获取在线人数失败",[],3);
            });
        }

    },
    GetPalyerList:function(isRefresh=false){
        let sendPack = app.ClubManager().GetUnionSendPackHead();
        sendPack.pageNum = this.curPage;
        sendPack.query = app.ComTool().GetBeiZhuID(this.queryStr);
        let self = this;
        app.NetManager().SendPack("union.CUnionMemberList",sendPack, function(serverPack){
            if (serverPack.length > 0) {
                self.UpdateScrollView(serverPack,isRefresh);
                //刷新页数
                let lb_page = self.node.getChildByName("page").getChildByName("lb_page");
                lb_page.getComponent(cc.Label).string = self.curPage;
            }else{
                self.curPage = self.lastPage;
            }
        }, function(){
            app.SysNotifyManager().ShowSysMsg("获取成员列表失败",[],3);
        });
    },
    GetNextPage:function(){
    	this.curPage++;
    	this.GetPalyerList(false);
    },
    UpdateScrollView:function(serverPack, isRefresh){
    	let memberScrollView = this.node.getChildByName("memberScrollView");
    	let content = memberScrollView.getChildByName("view").getChildByName("content");
    	if (isRefresh) {
    		memberScrollView.getComponent(cc.ScrollView).scrollToTop();
    		content.removeAllChildren();
    	}
    	let demo = this.node.getChildByName("demo");
    	demo.active = false;
    	for (let i = 0; i < serverPack.length; i++) {
            //先判断下是否已经存在,对于有可能从前面插入数据的需要差重
            let isExist = false;
            for (let j = 0; j < content.children.length; j++) {
                if (content.children[j].clubId == serverPack[i].clubId) {
                    isExist = true;
                    break;
                }
            }
            if (isExist) continue;
    		let child = cc.instantiate(demo);
    		let controlNode = child.getChildByName("controlNode");
    		if(this.unionPostType == app.ClubManager().UNION_MANAGE){//赛事管理
	            controlNode.getChildByName("btn_delClub").active = true;
	            controlNode.getChildByName("btn_setManager").active = false;
	            controlNode.getChildByName("btn_cancelManager").active = false;
                controlNode.getChildByName("btn_sportsPointWarning").active = false;
	        }else if(this.unionPostType == app.ClubManager().UNION_CREATE){//赛事创建者
	            if (serverPack[i].unionPostType == app.ClubManager().UNION_MANAGE) {
	            	controlNode.getChildByName("btn_setManager").active = false;
	            	controlNode.getChildByName("btn_cancelManager").active = true;
	            }else{
	            	controlNode.getChildByName("btn_setManager").active = true;
	            	controlNode.getChildByName("btn_cancelManager").active = false;
	            }
                controlNode.getChildByName("btn_sportsPointWarning").active = true;
	        }
	        child.clubId = serverPack[i].clubId;
	        child.unionPostType = serverPack[i].unionPostType;
	        child.playerData = serverPack[i];
            //可以操作自己，不能操作创建者
            if(child.playerData.createId==app.HeroManager().GetHeroProperty("pid")){
                //child.getChildByName("btn_control").active = true;
                if(app.ClubManager().GetUnionTypeByLastClubData()==1){
                    child.getChildByName("btn_control").active = true;//赛事创建者要显示一个生存积分
                    controlNode.getChildByName("btn_delClub").active = false;
                    controlNode.getChildByName("btn_setPL").active = true;
                    controlNode.getChildByName("btn_setScore").active = true;
                    controlNode.getChildByName("btn_setManager").active = false;
                    controlNode.getChildByName("btn_cancelManager").active = false;
                    controlNode.getChildByName("btn_clubMember").active = false;
                    controlNode.getChildByName("btn_clubReport").active = false;
                    controlNode.getChildByName("btn_sportsPointWarning").active = true;
                }else{
                    child.getChildByName("btn_control").active = false;
                }
            }else if (child.clubId == this.clubId || child.unionPostType == app.ClubManager().UNION_CREATE) {
                //不能操作创建者
                if(app.ClubManager().GetUnionTypeByLastClubData()==1){
                    child.getChildByName("btn_control").active = true;//赛事创建者要显示一个生存积分
                    controlNode.getChildByName("btn_delClub").active = false;
                    controlNode.getChildByName("btn_setPL").active = false;
                    controlNode.getChildByName("btn_setScore").active = true;
                    controlNode.getChildByName("btn_setManager").active = false;
                    controlNode.getChildByName("btn_cancelManager").active = false;
                    controlNode.getChildByName("btn_clubMember").active = false;
                    controlNode.getChildByName("btn_clubReport").active = false;
                    controlNode.getChildByName("btn_sportsPointWarning").active = true;
                }else{
                    child.getChildByName("btn_control").active = false;
                }
                
            }else{
                child.getChildByName("btn_control").active = true;
            }
            let clubNameTemp = serverPack[i].clubName;
            if (clubNameTemp.length >= 4) {
                clubNameTemp = serverPack[i].clubName.substr(0,4) + "...";
            }
	        child.getChildByName("lb_clubName").getComponent(cc.Label).string = clubNameTemp;
	        child.getChildByName("lb_clubId").getComponent(cc.Label).string = "ID:"+serverPack[i].clubSign;
            let createNameTemp = serverPack[i].createName;
            if (createNameTemp.length >= 4) {
                createNameTemp = serverPack[i].createName.substr(0,4) + "...";
            }
	        child.getChildByName("lb_clubCreatorName").getComponent(cc.Label).string = this.ComTool.GetBeiZhuName(serverPack[i].createId,createNameTemp);
	        child.getChildByName("lb_clubCreatorId").getComponent(cc.Label).string = "ID:"+serverPack[i].createId;

            if(app.ClubManager().GetUnionTypeByLastClubData()==1){
                if(typeof(serverPack[i].alivePoint) == "undefined"){
                    child.getChildByName("lb_clubCreatorPL").getComponent(cc.Label).string ="无";
                }else{
                    child.getChildByName("lb_clubCreatorPL").getComponent(cc.Label).string = serverPack[i].alivePoint;
                }
                child.getChildByName("lb_sumSportsPoint").getComponent(cc.Label).string = serverPack[i].zhongZhiTotalPoint;
                child.getChildByName("lb_sumTaoTaiPoint").getComponent(cc.Label).string = serverPack[i].zhongZhiEliminatePointSum;
            }else{
                child.getChildByName("lb_clubCreatorPL").getComponent(cc.Label).string = serverPack[i].sportsPoint;
                child.getChildByName("lb_sumSportsPoint").getComponent(cc.Label).string = serverPack[i].sumSportsPoint;
            }


            if(serverPack[i].shareType==1){
                child.getChildByName("lb_scorePercent").getComponent(cc.Label).string = serverPack[i].shareFixedValue;
            }else if(serverPack[i].shareType==0){
                child.getChildByName("lb_scorePercent").getComponent(cc.Label).string = serverPack[i].shareValue+"%";
            }else if(serverPack[i].shareType==2){
                child.getChildByName("lb_scorePercent").getComponent(cc.Label).string = "区间";
            }
	        //child.getChildByName("lb_scorePercent").getComponent(cc.Label).string = serverPack[i].scorePercent;

	        child.getChildByName("lb_score").getComponent(cc.Label).string = serverPack[i].scorePoint;
	        child.getChildByName("lb_clubMemberNum").getComponent(cc.Label).string = serverPack[i].number;
    		child.active = true;
    		content.addChild(child);
    	}
    },
    Event_UnionMemberInfoChange:function(serverPack){
        let memberScrollView = this.node.getChildByName("memberScrollView");
        let content = memberScrollView.getChildByName("view").getChildByName("content");
        let allUserNode = content.children;
        for (let i = 0; i < allUserNode.length; i++) {
            if (serverPack.unionId == this.unionId && 
                serverPack.clubId == allUserNode[i].playerData.clubId && 
                serverPack.pid == allUserNode[i].playerData.createId) {
                allUserNode[i].playerData.sportsPoint = serverPack.sportsPoint;

                allUserNode[i].playerData.shareType = serverPack.shareType;
                allUserNode[i].playerData.shareFixedValue = serverPack.shareFixedValue;
                allUserNode[i].playerData.shareValue = serverPack.shareValue;
                //allUserNode[i].playerData.scorePercent = serverPack.scorePercent;

                allUserNode[i].getChildByName("lb_clubCreatorPL").getComponent(cc.Label).string = serverPack.sportsPoint;
                if(serverPack.shareType==1){
                    allUserNode[i].getChildByName("lb_scorePercent").getComponent(cc.Label).string = serverPack.shareFixedValue;
                }else if(serverPack.shareType==0){
                    allUserNode[i].getChildByName("lb_scorePercent").getComponent(cc.Label).string = serverPack.shareValue+"%";
                }else if(serverPack.shareType==2){
                    allUserNode[i].getChildByName("lb_scorePercent").getComponent(cc.Label).string = "区间";
                }
                ///allUserNode[i].getChildByName("lb_scorePercent").getComponent(cc.Label).string = serverPack.scorePercent;
                break;
            }
        }
    },
    //控件点击回调
    OnClick_BtnWnd:function(eventTouch, eventData){
        try{
            app.SoundManager().PlaySound("BtnClick");
            let btnNode = eventTouch.currentTarget;
            let btnName = btnNode.name;
            this.OnClick(btnName, btnNode);
        }
        catch (error){
            console.log("OnClick_BtnWnd:"+error.stack);
        }
    },
    OnClick:function(btnName, btnNode){
    	if('btn_next'==btnName){
            this.lastPage = this.curPage;
            this.curPage++;
            this.GetPalyerList(true);
        }
        else if('btn_last'==btnName){
            if(this.curPage<=1){
                return;
            }
            this.lastPage = this.curPage;
            this.curPage--;
            this.GetPalyerList(true);
        }else if('btn_addMember'==btnName){
            app.FormManager().ShowForm("ui/club/UIUnionYaoQing");
        }else if(btnName=="btn_ShowBtn" || btnName=="btn_control"){

            if(app.ClubManager().GetUnionTypeByLastClubData()==0){
                //普通打开UI，中至的要弹出下拉
                if(btnNode.parent.playerData.createId==app.HeroManager().GetHeroProperty("pid")){
                    //显示操作设置分数
                    let playerData = btnNode.parent.playerData;
                    let data = {"name":playerData.createName,
                        "pid":app.ComTool().GetPid(playerData.createId),
                        "opClubId":playerData.clubId,
                        "shareType":playerData.shareType,
                        "shareFixedValue":playerData.shareFixedValue,
                        "shareValue":playerData.shareValue,
                    }
                    app.FormManager().ShowForm("ui/club/UIUserSetPercent",data);
                    return;
                }
            }
            //自己不能操作自己，不能操作创建者
            if(app.ClubManager().GetUnionTypeByLastClubData()==0){
            	if (btnNode.parent.clubId == this.clubId || btnNode.parent.unionPostType == app.ClubManager().UNION_CREATE) {
            		return;
            	}
                //管理不能操作管理
                if (btnNode.parent.unionPostType == app.ClubManager().UNION_MANAGE &&  this.unionPostType == app.ClubManager().UNION_MANAGE) {
                    return;
                }

            }
            let allUserNode = btnNode.parent.parent.children;
            let controlNode = btnNode.parent.getChildByName("controlNode");
            for (let i = 0; i < allUserNode.length; i++) {
                let userControlNode = allUserNode[i].getChildByName("controlNode");
                if (userControlNode && controlNode != userControlNode) {
                    userControlNode.active = false;
                    userControlNode.parent.getComponent(cc.Sprite).spriteFrame=this.unSelectSprite;
                    userControlNode.parent.height = 70;
                }
            }
            controlNode.active = !controlNode.active;
            if (controlNode.active) {
                btnNode.parent.getComponent(cc.Sprite).spriteFrame=this.selectSprite;
                btnNode.parent.height = 170;
            }else{
                btnNode.parent.getComponent(cc.Sprite).spriteFrame=this.unSelectSprite;
                btnNode.parent.height = 70;
            }
        }else if('btn_search'==btnName){
        	this.queryStr = btnNode.parent.getComponent(cc.EditBox).string;
            this.curPage = 1;
            this.lastPage = 1;
        	this.GetPalyerList(true);
        }else if('btn_delClub'==btnName){
            let playerData = btnNode.parent.parent.playerData;
            this.SetWaitForConfirm("MSG_UNION_DEL_MEMBER",app.ShareDefine().ConfirmYN,[playerData.clubName],[btnNode]);
        }else if('btn_setPL'==btnName){
        	let clubData = app.ClubManager().GetClubDataByClubID(this.clubId);
            if (!clubData) {
                return;
            }

            let playerData = btnNode.parent.parent.playerData;
            let sendPack = {};
            sendPack.clubId = playerData.clubId;
            sendPack.opPid = playerData.createId;
            sendPack.exeClubId = this.clubId;
            let self = this;
            app.NetManager().SendPack("club.CClubMemberSportsPointInfo",sendPack, function(serverPack){
                let playerData = btnNode.parent.parent.playerData;
                let data = {"name":playerData.createName,
                    "pid":app.ComTool().GetPid(playerData.createId),
                    "opClubId":playerData.clubId,
                    "targetPL":serverPack.sportsPoint,
                    "owerPL":serverPack.allowSportsPoint,
                    "myisminister":app.ClubManager().Club_MINISTER_CREATER,
                }
                if(app.ClubManager().GetUnionTypeByLastClubData()==1){
                    app.FormManager().ShowForm("ui/club_2/UIUserSetPL_2",data);
                }else{
                    app.FormManager().ShowForm("ui/club/UIUserSetPL",data);
                }
                //app.FormManager().ShowForm("ui/club/UIUserSetPL",data);
            }, function(){

            });
        }else if('btn_setScore'==btnName){
        	let playerData = btnNode.parent.parent.playerData;
            let data = {"name":playerData.createName,
                "pid":app.ComTool().GetPid(playerData.createId),
                "opClubId":playerData.clubId,
                
                "shareType":playerData.shareType,
                "shareFixedValue":playerData.shareFixedValue,
                "shareValue":playerData.shareValue,
            }
        	app.FormManager().ShowForm("ui/club/UIUserSetPercent",data);
        }else if('btn_setManager'==btnName){
        	let playerData = btnNode.parent.parent.playerData;
            let sendPack = app.ClubManager().GetUnionSendPackHead();
            sendPack.opClubId = playerData.clubId;
            sendPack.opPid = playerData.createId;
            sendPack.value = 1;
            let self = this;
            app.NetManager().SendPack("union.CUnionPostTypeUpdate",sendPack, function(serverPack){
                btnNode.active = false;
                btnNode.parent.getChildByName("btn_cancelManager").active = true;
                app.SysNotifyManager().ShowSysMsg("成功设为副裁判",[],3);
            }, function(){
                app.SysNotifyManager().ShowSysMsg("设为副裁判失败",[],3);
            });
        }else if('btn_cancelManager'==btnName){
        	let playerData = btnNode.parent.parent.playerData;
            let sendPack = app.ClubManager().GetUnionSendPackHead();
            sendPack.opClubId = playerData.clubId;
            sendPack.opPid = playerData.createId;
            sendPack.value = 0;
            let self = this;
            app.NetManager().SendPack("union.CUnionPostTypeUpdate",sendPack, function(serverPack){
                btnNode.active = false;
                btnNode.parent.getChildByName("btn_setManager").active = true;
                app.SysNotifyManager().ShowSysMsg("成功取消副裁判",[],3);
            }, function(){
                app.SysNotifyManager().ShowSysMsg("取消副裁判失败",[],3);
            });
        }else if('btn_clubMember'==btnName){
            let playerData = btnNode.parent.parent.playerData;
            if(app.ClubManager().GetUnionTypeByLastClubData()==1){
                app.FormManager().ShowForm("ui/club_2/UIUnionClubUserList_2",this.clubId, playerData.clubId, this.unionId, this.unionName, this.unionSign);
            }else{
                app.FormManager().ShowForm("ui/club/UIUnionClubUserList",this.clubId, playerData.clubId, this.unionId, this.unionName, this.unionSign);
            }

        }else if('btn_clubReport'==btnName){
            let playerData = btnNode.parent.parent.playerData;
            if(app.ClubManager().GetUnionTypeByLastClubData()==1){
                app.FormManager().ShowForm("ui/club_2/UIUnionClubReport_2", playerData.clubId, playerData.createId);
            }else{
                app.FormManager().ShowForm("ui/club/UIUnionClubReport", playerData.clubId, playerData.createId);
            }
        }else if('btn_sportsPointWarning'==btnName){

            let playerData = btnNode.parent.parent.playerData;
            let sendPack = app.ClubManager().GetUnionSendPackHead();
            sendPack.opClubId = playerData.clubId;
            sendPack.opPid = playerData.createId;
            let packName="union.CUnionSportsPointWaningInfo";
            if(app.ClubManager().GetUnionTypeByLastClubData()==1){
                packName="union.CUnionAlivePointInfo";
            }
            app.NetManager().SendPack(packName,sendPack, function(serverPack){
                serverPack.createId = playerData.createId;
               if(app.ClubManager().GetUnionTypeByLastClubData()==1){
                   app.FormManager().ShowForm("ui/club_2/UISetSportsPointWarning_2",serverPack);
               }else{
                  app.FormManager().ShowForm("ui/club/UISetSportsPointWarning",serverPack);
               }
               

            }, function(){

            });

        }else if('btn_scoreDetail'==btnName){
            let playerData = btnNode.parent.playerData;
            if(app.ClubManager().GetUnionTypeByLastClubData()==1){
                app.FormManager().ShowForm("ui/club_2/UIUnionClubReport_2", playerData.clubId, playerData.createId);
            }else{
                app.FormManager().ShowForm("ui/club/UIUnionClubReport", playerData.clubId, playerData.createId);
            }
        }
    },
    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    SetWaitForConfirm:function(msgID,type,msgArgs=[],cbArgs=[]){
        let ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArgs);
        ConfirmManager.ShowConfirm(type, msgID, msgArgs);
    },
    OnConFirm:function(clickType, msgID, cbArgs){
        if('Sure' != clickType){
            return;
        }
        if ('MSG_UNION_DEL_MEMBER' == msgID) {
            let btnNode = cbArgs[0];
            let playerData = btnNode.parent.parent.playerData;
            let sendPack = app.ClubManager().GetUnionSendPackHead();
            sendPack.opClubId = playerData.clubId;
            sendPack.opPid = playerData.createId;
            let self = this;
            app.NetManager().SendPack("union.CUnionRemoveMember",sendPack, function(serverPack){
                btnNode.parent.parent.removeFromParent();
                btnNode.parent.parent.destroy();
                app.SysNotifyManager().ShowSysMsg("成功移除",[],3);
            }, function(){
                app.SysNotifyManager().ShowSysMsg("移除失败",[],3);
            });
        }
    },
});