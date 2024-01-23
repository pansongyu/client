(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiEffect/WndScaleTransition.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5e978gMInlHSZqcoceM4UrF', 'WndScaleTransition', __filename);
// script/ui/uiEffect/WndScaleTransition.js

"use strict";

/*
 WndScaleTransition 数字label渐变
 */

cc.Class({
	extends: require("BaseComponent"),

	properties: {
		transTime: 0.1,

		backEvents: {
			default: [],
			type: cc.Component.EventHandler
		}
	},

	// use this for initialization
	onLoad: function onLoad() {
		this.JS_Name = this.node.name + "_WndScaleTransition";
		this.startScale = this.node.getScale();
	},

	SetWndScale: function SetWndScale(endScale, posID) {
		this.node.stopActionByTag(55555);
		this.node.WndUserData = posID;

		var action = cc.sequence(cc.scaleTo(this.transTime, endScale), cc.scaleTo(this.transTime, this.startScale), cc.callFunc(this.OnScaleEnd, this));

		action.setTag(55555);
		this.node.runAction(action);
	},

	OnScaleEnd: function OnScaleEnd(sender) {

		cc.Component.EventHandler.emitEvents(this.backEvents, sender.WndUserData);
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
        //# sourceMappingURL=WndScaleTransition.js.map
        