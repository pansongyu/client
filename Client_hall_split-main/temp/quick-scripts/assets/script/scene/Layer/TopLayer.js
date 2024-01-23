(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/scene/Layer/TopLayer.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd1a31jdFq9LOqmWScFetLrL', 'TopLayer', __filename);
// script/scene/Layer/TopLayer.js

"use strict";

/*
 场景模态置顶层
 */
var app = require("app");

cc.Class({
	extends: require("BaseComponent"),

	properties: {},

	OnCreate: function OnCreate(sceneType) {
		this.JS_Name = [sceneType, "TopLayer"].join("_");

		//TopLv相关延迟多少毫秒显示
		this.ModalDelayTick = 1500;
		this.showModalTick = 0;
		this.showModalEventType = "";

		//等待通信特效
		this.waitNetEffectNode = app.Client.GetGlobalEffectNode("WaitNet");
		if (this.waitNetEffectNode) {
			this.node.addChild(this.waitNetEffectNode);
		}
		//创建默认关闭状态
		this.OnCloseModalLayer();
	},

	OnBeforeExitScene: function OnBeforeExitScene() {
		if (this.waitNetEffectNode) {
			app.Client.PushGlobalEffectNode(this.waitNetEffectNode);
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
				} else {
					this.ErrLog("waitNetEffectNode not find");
				}
				break;
			case "CreateForm":
				if (this.waitNetEffectNode) {
					this.waitNetEffectNode.active = true;
				} else {
					this.ErrLog("waitNetEffectNode not find");
				}
				break;

			default:
				this.ErrLog("OnShowModalLayerEffect(%s) error", this.showModalEventType);
				break;
		}
	},

	OnTopEvent: function OnTopEvent(eventType) {
		//console.log('OnTopEvent EventType' + eventType);
		switch (eventType) {
			case "ReceiveNet":
				if (app.Client.reConnectTip.active) {
					console.log("收到消息，关闭断线重连提示");
					app.Client.CloseReConnectTip();
				}
				this.OnCloseModalLayer();
				this.isOpenNet = false;
				this.showModalEventType = "";
				// if(app.Client.bStartReConnect)
				break;
			case "OpenNet":
				this.OnShowModalLayer();
				this.isOpenNet = true;
				this.showModalEventType = eventType;
				break;
			case "StartReConnect":
				app.Client.StartReConnect();
				this.node.active = true;
				break;
			case "CreateForm":
				if (this.isOpenNet) {
					this.Log("CreateForm 等待通信结束");
				} else {
					this.OnShowModalLayer();
					this.showModalEventType = eventType;
				}
				break;

			case "CreateFormEnd":
				if (this.isOpenNet) {
					this.Log("CreateFormEnd 等待通信结束");
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
				// this.ErrLog("OnTopEvent(%s) error", eventType);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=TopLayer.js.map
        