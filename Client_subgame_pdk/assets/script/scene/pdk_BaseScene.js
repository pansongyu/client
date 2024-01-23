/*
    场景基类接口
*/
var app = require("pdk_app");

cc.Class({
    extends: cc.Component,

    properties: {
	    BackgroundLayer:cc.Prefab,
	    SceneEffectLayer:cc.Prefab,
	    UILayer:cc.Prefab,
	    TopLayer:cc.Prefab,
    },

    //--------------回掉函数----------------
    // 加载创建
    onLoad: function () {

	    let SceneManager = app[app.subGameName + "_SceneManager"]();
        this.LocalDataManager = app.LocalDataManager();
	    //获取当前的地图ID
        let sceneType = SceneManager.GetSceneType();
        this.sceneType = sceneType;
        this.JS_Name = sceneType;

	    this.SoundManager = app[app.subGameName + "_SoundManager"]();
	    this.SysDataManager = app[app.subGameName + "_SysDataManager"]();
	    this.ShareDefine = app[app.subGameName + "_ShareDefine"]();

	    this.SceneInfo = this.SysDataManager.GetTableDict("SceneInfo");

	    this.LayerLv_Background = 0;
	    this.LayerLv_SceneEffect = 4;
	    this.LayerLv_UI = 5;
	    this.LayerLv_Top = 7;
	    this.LayerLv_Debug = 8;

        this.node.on("touchstart", this.OnTouchStart, this);
        this.node.on("touchmove", this.OnTouchMove, this);
        this.node.on("touchend", this.OnTouchEnd, this);
        this.node.on("touchcancel", this.OnTouchCancel, this);

	    //--------------创建场景层--------------
	    this.InitLayer();

        this.OnCreate();
    },

	//初始化场景层相关
	InitLayer:function(){

		this.BackgroundLayerComponent = null;
		this.SceneEffectLayerNodeComponent = null;
		this.TopLayerNodeComponent = null;

		this.UILayerNode = null;

		//-----------可选层---------------
		//需要显示场景背景是创建的层
		if(this.BackgroundLayer){
			let backgroundLayerNode = cc.instantiate(this.BackgroundLayer);
			this.node.addChild(backgroundLayerNode, this.LayerLv_Background);
			this.BackgroundLayerComponent = backgroundLayerNode.getComponent(app.subGameName + "_BackgroundLayer");
			this.BackgroundLayerComponent.OnCreate(this.sceneType);
		}

		//需要播放场景特效是创建的层
		if(this.SceneEffectLayer){
			let sceneEffectLayerNode = cc.instantiate(this.SceneEffectLayer);
			this.node.addChild(sceneEffectLayerNode, this.LayerLv_SceneEffect);
			this.SceneEffectLayerNodeComponent = sceneEffectLayerNode.getComponent(app.subGameName + "_SceneEffectLayer");
			this.SceneEffectLayerNodeComponent.OnCreate(this.sceneType);
		}

		//----------以下是必须存在的层-----------------

		//场景UI层
		if(this.UILayer){
			this.UILayerNode = cc.instantiate(this.UILayer);
			this.node.addChild(this.UILayerNode, this.LayerLv_UI);
			this.UILayerNode.getComponent(app.subGameName + "_UILayer").OnCreate(this.sceneType);
		}
		else{
			this.ErrLog("InitLayer not find UILayer");
		}

		//置顶模态层
		if(this.TopLayer){
			let topLayerNode = cc.instantiate(this.TopLayer);
			this.node.addChild(topLayerNode, this.LayerLv_Top);
			this.TopLayerNodeComponent = topLayerNode.getComponent(app.subGameName + "_TopLayer");
			this.TopLayerNodeComponent.OnCreate(this.sceneType);
		}
		else{
			this.ErrLog("InitLayer not find TopLayer");
		}

		this.debugModel = null;
		let debugModel = app[app.subGameName + "Client"].GetDebugModel();
		if(debugModel){
			this.node.addChild(debugModel.node, this.LayerLv_Top);
			this.debugModel = debugModel;
		}

	},

    //-------------点击事件--------------
    OnTouchStart:function(event){
    },

    OnTouchMove:function(event){
    },

    OnTouchEnd:function(event){
    },

    OnTouchCancel:function(event){
    },

    //每帧回掉
    update: function (dt) {
        try {
	        let nowTick = Date.now();

	        if(this.debugModel){
		        this.debugModel.OnUpdate(dt);
	        }

	        this.TopLayerNodeComponent.OnUpdate(nowTick);

            this.OnUpdate(dt);
        }
        catch(error){
		    this.ErrLog("update：%s", error.stack);
        }

    },

    //100毫秒毁掉
    OnBaseTimer:function(passSecond){
        this.OnTimer(passSecond)
    },

    //场景准备退出前
    OnBeforeExitScene:function(){

	    if(this.SceneEffectLayerNodeComponent){
		    this.SceneEffectLayerNodeComponent.OnBeforeExitScene();
	    }

	    //退出场景移除debug
	    if(this.debugModel){
			this.node.removeChild(this.debugModel.node);
		    this.debugModel = null;
	    }

	    this.TopLayerNodeComponent.OnBeforeExitScene();
    },

    //进入场景
    OnSwithSceneEnd:function(){
    },

	//显示动态设置的默认界面
	OnShowDefaultForm:function(){

	},

    //应用切入后台
    OnEventHide:function(){
    },

    //应用显示
    OnEventShow:function(){
    },

	//-----------置顶模态层--------------
	//显示顶层特效
	OnTopEvent:function(eventType){
		this.TopLayerNodeComponent.OnTopEvent(eventType);
	},

    //--------------操作函数------------------

	//场景震动
	OnShakeScene:function(){
		let rightDeltaPos = cc.v2(6,0);
		let leftDeltaPos = cc.v2(-6,0);

		let action = cc.sequence(
									cc.moveBy(0.025,cc.v2(3,0)),
									cc.moveBy(0.025,leftDeltaPos),
									cc.moveBy(0.025,rightDeltaPos),
									cc.moveBy(0.025,cc.v2(-3,0))
								);

		this.UILayerNode.runAction(action);

		if(this.BackgroundLayerComponent){
			let cloneAction = action.clone();
			this.BackgroundLayerComponent.node.runAction(cloneAction);
		}
	},

    //---------------特效相关---------------------

    //创建场景特效
    AddSceneEffect:function(effectName, effectRes, repeatCount=0, userData=0){
	    return this.SceneEffectLayerNodeComponent.AddSceneEffect(effectName, effectRes, repeatCount, userData);
    },

    DeleteSceneEffect:function(modelComponent){
	    this.SceneEffectLayerNodeComponent.DeleteSceneEffect(modelComponent);
    },

    //--------------子类重载-----------------
    OnCreate:function(){

    },

    //每帧回掉
    OnUpdate:function(dt){
        
    },

    OnTimer:function(passSecond){

    },
    //切换账号
    OnReload:function(){

    },
});
