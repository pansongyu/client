"use strict";
cc._RF.push(module, 'typdk009-fd7e-42be-9f7f-3c88ff05532c', 'pdk_TopLayer');
// script/scene/Layer/pdk_TopLayer.js

"use strict";

/*
 场景模态置顶层
 */
var app = require("pdk_app");

cc.Class({
	extends: require(app.subGameName + "_BaseComponent"),

	properties: {},

	OnCreate: function OnCreate(sceneType) {
		this.JS_Name = [sceneType, "TopLayer"].join("_");

		//TopLv相关延迟多少毫秒显示
		this.ModalDelayTick = 500;
		this.showModalTick = 0;
		this.showModalEventType = "";

		//等待通信特效
		this.waitNetEffectNode = app[app.subGameName + "Client"].GetGlobalEffectNode("WaitNet");
		if (this.waitNetEffectNode) {
			this.node.addChild(this.waitNetEffectNode);
		}
		//创建默认关闭状态
		this.OnCloseModalLayer();
	},

	OnBeforeExitScene: function OnBeforeExitScene() {
		if (this.waitNetEffectNode) {
			app[app.subGameName + "Client"].PushGlobalEffectNode(this.waitNetEffectNode);
			this.waitNetEffectNode = null;
		}
	},

	OnUpdate: function OnUpdate(nowTick) {
		if (this.showModalTick && this.showModalTick <= nowTick) {
			this.OnShowModalLayerEffect();
		}
	},

	//显示特效
	OnShowModalLayerEffect: function OnShowModalLayerEffect() {
		//清空显示事件
		this.showModalTick = 0;

		switch (this.showModalEventType) {

			case "OpenNet":
				if (this.waitNetEffectNode) {
					this.waitNetEffectNode.active = true;
				}
				break;
			case "CreateForm":
				if (this.waitNetEffectNode) {
					this.waitNetEffectNode.active = true;
				}
				break;

			default:
				console.log("OnShowModalLayerEffect error:" + this.showModalEventType);
				break;
		}
	},

	OnTopEvent: function OnTopEvent(eventType) {
		//console.log('OnTopEvent EventType' + eventType);
		switch (eventType) {

			case "ReceiveNet":
				if (app[app.subGameName + "Client"].reConnectTip.active) {
					console.log("收到消息，关闭断线重连提示");
					app[app.subGameName + "Client"].CloseReConnectTip();
				}
				this.OnCloseModalLayer();
				this.isOpenNet = false;
				this.showModalEventType = "";
				// if(app[app.subGameName + "Client"].bStartReConnect)
				// 	app[app.subGameName + "Client"].CloseReConnectTip();
				break;

			case "OpenNet":
				this.OnShowModalLayer();
				this.isOpenNet = true;
				this.showModalEventType = eventType;
				break;
			case "StartReConnect":
				app[app.subGameName + "Client"].StartReConnect();
				this.node.active = true;
				break;
			case "CreateForm":
				if (this.isOpenNet) {
					console.log("CreateForm 等待通信结束");
				} else {
					this.OnShowModalLayer();
					this.showModalEventType = eventType;
				}
				break;

			case "CreateFormEnd":
				if (this.isOpenNet) {
					console.log("CreateFormEnd 等待通信结束");
				} else {
					this.showModalEventType = "";
					this.OnCloseModalLayer();
				}
				break;

			case "Close":
				this.showModalEventType = "";
				this.OnCloseModalLayer();
				break;

			default:
				this.ErrLog("OnTopEvent(%s) error", eventType);
				break;
		}
	},

	//显示模态层提示
	OnShowModalLayer: function OnShowModalLayer() {
		this.node.active = true;
		//注册显示事件的Tick
		this.showModalTick = Date.now() + this.ModalDelayTick;
		if (this.waitNetEffectNode) {
			this.waitNetEffectNode.active = false;
		}
	},

	//关闭场景模态层
	OnCloseModalLayer: function OnCloseModalLayer() {
		this.node.active = false;
		//清空显示事件
		this.showModalTick = 0;
		if (this.waitNetEffectNode) {
			this.waitNetEffectNode.active = false;
		}
	}

});

cc._RF.pop();