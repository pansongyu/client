"use strict";
cc._RF.push(module, 'fjssz95d-b908-4928-b323-b7a9c417b9e1', 'fjssz_BaseScene');
// script/scene/fjssz_BaseScene.js

"use strict";

/*
    场景基类接口
*/
var app = require("fjssz_app");

cc.Class({
	extends: cc.Component,

	properties: {
		BackgroundLayer: cc.Prefab,
		SceneEffectLayer: cc.Prefab,
		UILayer: cc.Prefab,
		TopLayer: cc.Prefab
	},

	//--------------回掉函数----------------
	// 加载创建
	onLoad: function onLoad() {

		var SceneManager = app[app.subGameName + "_SceneManager"]();
		this.LocalDataManager = app.LocalDataManager();
		//获取当前的地图ID
		var sceneType = SceneManager.GetSceneType();
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
	InitLayer: function InitLayer() {

		this.BackgroundLayerComponent = null;
		this.SceneEffectLayerNodeComponent = null;
		this.TopLayerNodeComponent = null;

		this.UILayerNode = null;

		//-----------可选层---------------
		//需要显示场景背景是创建的层
		if (this.BackgroundLayer) {
			var backgroundLayerNode = cc.instantiate(this.BackgroundLayer);
			this.node.addChild(backgroundLayerNode, this.LayerLv_Background);
			this.BackgroundLayerComponent = backgroundLayerNode.getComponent(app.subGameName + "_BackgroundLayer");
			this.BackgroundLayerComponent.OnCreate(this.sceneType);
		}

		//需要播放场景特效是创建的层
		if (this.SceneEffectLayer) {
			var sceneEffectLayerNode = cc.instantiate(this.SceneEffectLayer);
			this.node.addChild(sceneEffectLayerNode, this.LayerLv_SceneEffect);
			this.SceneEffectLayerNodeComponent = sceneEffectLayerNode.getComponent(app.subGameName + "_SceneEffectLayer");
			this.SceneEffectLayerNodeComponent.OnCreate(this.sceneType);
		}

		//----------以下是必须存在的层-----------------

		//场景UI层
		if (this.UILayer) {
			this.UILayerNode = cc.instantiate(this.UILayer);
			this.node.addChild(this.UILayerNode, this.LayerLv_UI);
			this.UILayerNode.getComponent(app.subGameName + "_UILayer").OnCreate(this.sceneType);
		} else {
			console.error("InitLayer not find UILayer");
		}

		//置顶模态层
		if (this.TopLayer) {
			var topLayerNode = cc.instantiate(this.TopLayer);
			this.node.addChild(topLayerNode, this.LayerLv_Top);
			this.TopLayerNodeComponent = topLayerNode.getComponent(app.subGameName + "_TopLayer");
			this.TopLayerNodeComponent.OnCreate(this.sceneType);
		} else {
			console.error("InitLayer not find TopLayer");
		}

		this.debugModel = null;
		var debugModel = app[app.subGameName + "Client"].GetDebugModel();
		if (debugModel) {
			this.node.addChild(debugModel.node, this.LayerLv_Top);
			this.debugModel = debugModel;
		}
	},

	//-------------点击事件--------------
	OnTouchStart: function OnTouchStart(event) {},

	OnTouchMove: function OnTouchMove(event) {},

	OnTouchEnd: function OnTouchEnd(event) {},

	OnTouchCancel: function OnTouchCancel(event) {},

	//每帧回掉
	update: function update(dt) {
		try {
			var nowTick = Date.now();

			if (this.debugModel) {
				this.debugModel.OnUpdate(dt);
			}

			this.TopLayerNodeComponent.OnUpdate(nowTick);

			this.OnUpdate(dt);
		} catch (error) {
			console.error("update：%s", error.stack);
		}
	},

	//100毫秒毁掉
	OnBaseTimer: function OnBaseTimer(passSecond) {
		this.OnTimer(passSecond);
	},

	//场景准备退出前
	OnBeforeExitScene: function OnBeforeExitScene() {

		if (this.SceneEffectLayerNodeComponent) {
			this.SceneEffectLayerNodeComponent.OnBeforeExitScene();
		}

		//退出场景移除debug
		if (this.debugModel) {
			this.node.removeChild(this.debugModel.node);
			this.debugModel = null;
		}

		this.TopLayerNodeComponent.OnBeforeExitScene();
	},

	//进入场景
	OnSwithSceneEnd: function OnSwithSceneEnd() {},

	//显示动态设置的默认界面
	OnShowDefaultForm: function OnShowDefaultForm() {},

	//应用切入后台
	OnEventHide: function OnEventHide() {},

	//应用显示
	OnEventShow: function OnEventShow() {},

	//-----------置顶模态层--------------
	//显示顶层特效
	OnTopEvent: function OnTopEvent(eventType) {
		this.TopLayerNodeComponent.OnTopEvent(eventType);
	},

	//--------------操作函数------------------

	//场景震动
	OnShakeScene: function OnShakeScene() {
		var rightDeltaPos = cc.v2(6, 0);
		var leftDeltaPos = cc.v2(-6, 0);

		var action = cc.sequence(cc.moveBy(0.025, cc.v2(3, 0)), cc.moveBy(0.025, leftDeltaPos), cc.moveBy(0.025, rightDeltaPos), cc.moveBy(0.025, cc.v2(-3, 0)));

		this.UILayerNode.runAction(action);

		if (this.BackgroundLayerComponent) {
			var cloneAction = action.clone();
			this.BackgroundLayerComponent.node.runAction(cloneAction);
		}
	},

	//---------------特效相关---------------------

	//创建场景特效
	AddSceneEffect: function AddSceneEffect(effectName, effectRes) {
		var repeatCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var userData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

		return this.SceneEffectLayerNodeComponent.AddSceneEffect(effectName, effectRes, repeatCount, userData);
	},

	DeleteSceneEffect: function DeleteSceneEffect(modelComponent) {
		this.SceneEffectLayerNodeComponent.DeleteSceneEffect(modelComponent);
	},

	//--------------子类重载-----------------
	OnCreate: function OnCreate() {},

	//每帧回掉
	OnUpdate: function OnUpdate(dt) {},

	OnTimer: function OnTimer(passSecond) {},
	//切换账号
	OnReload: function OnReload() {}
});

cc._RF.pop();