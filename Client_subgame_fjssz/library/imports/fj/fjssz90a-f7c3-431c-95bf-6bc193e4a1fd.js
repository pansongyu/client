"use strict";
cc._RF.push(module, 'fjssz90a-f7c3-431c-95bf-6bc193e4a1fd', 'fjssz_SceneEffectLayer');
// script/scene/Layer/fjssz_SceneEffectLayer.js

"use strict";

/*
 场景特效层
 */
var app = require("fjssz_app");

cc.Class({
	extends: cc.Component,

	properties: {},

	OnCreate: function OnCreate(sceneType) {
		this.JS_Name = [sceneType, "SceneEffectLayer"].join("_");

		//场景特效字典
		this.effectDict = {};

		this.EffectManager = app[app.subGameName + "_EffectManager"]();

		this.node.on("EffectAnimationEnd", this.Event_EffectAnimationEnd, this);
	},

	//--------回调函数-----------------
	Event_EffectAnimationEnd: function Event_EffectAnimationEnd(event) {
		var modelComponent = event["Model"];
		//let animationName = event["AnimationName"];
		//特效播放结束删除掉
		this.DeleteSceneEffect(modelComponent);
	},

	//------------特效相关-----------------------

	//创建场景特效
	AddSceneEffect: function AddSceneEffect(effectName, effectRes) {
		var repeatCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var userData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;


		var that = this;

		return this.EffectManager.CreateEffectByEffectRes(effectName, effectRes, userData).then(function (effectComponent) {
			return that.OnCreateEffectEnd(effectName, effectComponent, repeatCount);
		}).catch(function (error) {
			that.ErrLog("AddSceneEffect(%s, %s,%s):%s", effectName, effectRes, userData, error.stack);
		});
	},

	//创建特效成功回调
	OnCreateEffectEnd: function OnCreateEffectEnd(effectName, effectComponent, repeatCount) {
		if (!effectComponent) {
			console.error("OnCreateEffectEnd(%s) fail", effectName);
			return;
		}

		if (this.effectDict.hasOwnProperty(effectName)) {
			this.Log("OnCreateEffectEnd effectDict have find:%s", effectName);
			return;
		}

		effectComponent.AddModelToParent(this.node, this.node);

		var animationState = effectComponent.ShowEffect();
		if (!animationState) {
			console.error("OnCreateEffectEnd ShowEffect fail");
			return;
		}
		//如果是0代表循环播放
		if (repeatCount) {
			animationState.wrapMode = cc.WrapMode.Default;
			animationState.repeatCount = repeatCount;
		} else {
			//需要注意的是，修改wrapMode时，会重置time以及repeatCount
			animationState.wrapMode = cc.WrapMode.Loop;
		}

		this.effectDict[effectName] = effectComponent;

		return effectComponent;
	},

	//删除特效
	DeleteSceneEffect: function DeleteSceneEffect(modelComponent) {
		var effectName = modelComponent.GetModelProperty("EffectName");
		delete this.effectDict[effectName];
		this.EffectManager.DeleteEffect(modelComponent);
	},

	//场景准备退出前
	OnBeforeExitScene: function OnBeforeExitScene() {
		this.EffectManager.DeleteEffectByDict(this.effectDict);
		this.effectDict = {};
	}
});

cc._RF.pop();