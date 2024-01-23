/*
    场景基类接口
*/
var app = require("app");

cc.Class({
    extends: require("BaseComponent"),

    properties: {
	    BackgroundLayer:cc.Prefab,
	    SceneEffectLayer:cc.Prefab,
	    UILayer:cc.Prefab,
	    GuideLayer:cc.Prefab,
	    TopLayer:cc.Prefab,
    },

    //--------------回掉函数----------------
    // 加载创建
    OnLoad: function () {

	    let SceneManager = app.SceneManager();
        this.LocalDataManager = app.LocalDataManager();
	    //获取当前的地图ID
        let sceneType = SceneManager.GetSceneType();
        this.sceneType = sceneType;
        this.JS_Name = sceneType;

	    this.SoundManager = app.SoundManager();
	    this.SysDataManager = app.SysDataManager();
	    this.ShareDefine = app.ShareDefine();

	    this.SceneInfo = this.SysDataManager.GetTableDict("SceneInfo");

	    this.LayerLv_Background = 0;
	    this.LayerLv_ModelShadow = 1;
	    this.LayerLv_Model = 2;
	    this.LayerLv_ModelHP = 3;
	    this.LayerLv_SceneEffect = 4;
	    this.LayerLv_UI = 5;
	    this.LayerLv_Guide = 6;
	    this.LayerLv_Top = 7;
	    this.LayerLv_Debug = 8;

        this.node.on("touchstart", this.OnTouchStart, this);
        this.node.on("touchmove", this.OnTouchMove, this);
        this.node.on("touchend", this.OnTouchEnd, this);
        this.node.on("touchcancel", this.OnTouchCancel, this);

        this.node.on("SpriteModelMoveToEnd", this.OnSpriteModelMoveToEnd, this);
        this.node.on("SpriteModelBeHitEnd", this.OnSpriteModelBeHitEnd, this);

	    //--------------创建场景层--------------
	    this.InitLayer();

        this.ShowMap();

        this.OnCreate();
    },

	//初始化场景层相关
	InitLayer:function(){

		this.BackgroundLayerComponent = null;
		this.SceneEffectLayerNodeComponent = null;
		this.TopLayerNodeComponent = null;
		this.GuideLayerNodeComponent = null;

		this.ModelShadowLayerNode = null;
		this.ModelLayerNode = null;
		this.ModelHPLayerNode = null;

		this.UILayerNode = null;

		//-----------可选层---------------
		//需要显示场景背景是创建的层
		if(this.BackgroundLayer){
			let backgroundLayerNode = cc.instantiate(this.BackgroundLayer);
			this.node.addChild(backgroundLayerNode, this.LayerLv_Background);
			this.BackgroundLayerComponent = backgroundLayerNode.getComponent("BackgroundLayer");
			this.BackgroundLayerComponent.OnCreate(this.sceneType);
		}

		//需要创建场景模型是才需要的层 如果存在ModelLayer 如果不需要显示阴影和HP允许ModelShadowLayer，ModelHPLayer不存在
		if(this.ModelLayer){
			this.ModelLayerNode = cc.instantiate(this.ModelLayer);
			this.node.addChild(this.ModelLayerNode, this.LayerLv_Model);
			this.ModelLayerNode.getComponent("ModelLayer").OnCreate(this.sceneType);
		}

		if(this.ModelShadowLayer){
			this.ModelShadowLayerNode = cc.instantiate(this.ModelShadowLayer);
			this.node.addChild(this.ModelShadowLayerNode, this.LayerLv_ModelShadow);
			this.ModelShadowLayerNode.getComponent("ModelShadowLayer").OnCreate(this.sceneType);
		}

		if(this.ModelHPLayer){
			this.ModelHPLayerNode = cc.instantiate(this.ModelHPLayer);
			this.node.addChild(this.ModelHPLayerNode, this.LayerLv_ModelHP);
			this.ModelHPLayerNode.getComponent("ModelHPLayer").OnCreate(this.sceneType);
		}

		//需要播放场景特效是创建的层
		if(this.SceneEffectLayer){
			let sceneEffectLayerNode = cc.instantiate(this.SceneEffectLayer);
			this.node.addChild(sceneEffectLayerNode, this.LayerLv_SceneEffect);
			this.SceneEffectLayerNodeComponent = sceneEffectLayerNode.getComponent("SceneEffectLayer");
			this.SceneEffectLayerNodeComponent.OnCreate(this.sceneType);
		}

		//新手引导层
		if(this.GuideLayer){
			let guideLayerNode = cc.instantiate(this.GuideLayer);
			this.node.addChild(guideLayerNode, this.LayerLv_Guide);
			this.GuideLayerNodeComponent = guideLayerNode.getComponent("GuideLayer");
			this.GuideLayerNodeComponent.OnCreate(this.sceneType);
		}

		//----------以下是必须存在的层-----------------

		//场景UI层
		if(this.UILayer){
			this.UILayerNode = cc.instantiate(this.UILayer);
			this.node.addChild(this.UILayerNode, this.LayerLv_UI);
			this.UILayerNode.getComponent("UILayer").OnCreate(this.sceneType);
		}
		else{
			this.ErrLog("InitLayer not find UILayer");
		}

		//置顶模态层
		if(this.TopLayer){
			let topLayerNode = cc.instantiate(this.TopLayer);
			this.node.addChild(topLayerNode, this.LayerLv_Top);
			this.TopLayerNodeComponent = topLayerNode.getComponent("TopLayer");
			this.TopLayerNodeComponent.OnCreate(this.sceneType);
		}
		else{
			this.ErrLog("InitLayer not find TopLayer");
		}

		this.debugModel = null;
		let debugModel = app.Client.GetDebugModel();
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

    //场景模型移动结束回掉
    OnSpriteModelMoveToEnd:function(event){

    },

    //模型被击移动结束
    OnSpriteModelBeHitEnd:function(event){
    },

    //每帧回掉
    update: function (dt) {
        try {
	        let nowTick = Date.now();
	        if(this.GuideLayerNodeComponent){
		        this.GuideLayerNodeComponent.OnUpdate(nowTick);
	        }

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

	    if(this.GuideLayerNodeComponent){
		    this.GuideLayerNodeComponent.OnBeforeExitScene();
	    }
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

    //--------------新手引导-------------------
    
    //显示新手引导控件
    ShowHelp:function(eventID, eventNode){
	    if(!this.GuideLayerNodeComponent){
		    this.ErrLog("ShowHelp(%s) error", eventID);
		    return
	    }
	    this.GuideLayerNodeComponent.ShowHelp(eventID, eventNode);
    },

    //--------------操作函数------------------
    //显示地图背景图
    ShowMap:function(){
	    // let mapID = app.SceneManager().GetMapID();
	    // if(!mapID){
		   //  return
	    // }
	    // if(!this.BackgroundLayerComponent){
		   //  this.ErrLog("ShowMap not find BackgroundLayerComponent");
		   //  return
	    // }
	    // this.BackgroundLayerComponent.ShowMap(mapID);
    },

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


    //--------------模型相关-----------------

    //创建场景精灵模型
    CreateSceneSpriteModel:function(modelName, imageName, modelRes, pos, userData=0, isShowHead=1, isShowShadow=1, zOrlderLv=0){

    },

    //创建界面精灵模型
    CreateSceneSpriteModelByImagePath:function(modelName, imagePath, modelRes, pos, userData=0, isShowHead=1, isShowShadow=1, zOrlderLv=0, fileNameList=[]){

    },

    //创建模型完成回调
    OnCreateSceneSpriteModelEnd:function(modelName, imageName, modelRes, userData, pos, modelComponent, zOrlderLv){
        
    },

    DeleteSceneSpriteModel:function(modelName){

    },

    //获取模型父类
    GetModelParent:function(imageName, modelRes, userData){

	    if(!this.ModelLayerNode){
		    this.ErrLog("GetModelParent(%s) not ModelLayerNode", imageName)
		    return
	    }
        //如果创建的是没有贴图的模型
        //TODO:模型预制自身包含图片 需要获取图片名字创建一个父类
        if(!imageName){
            return this.ModelLayerNode;
        }

        let parent = this.ModelLayerNode.getChildByName(imageName);
        if(!parent){
            this.Log("创建模型父类(%s)", imageName);
            parent = new cc.Node(imageName);
            this.ModelLayerNode.addChild(parent);
        }

        return parent

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
