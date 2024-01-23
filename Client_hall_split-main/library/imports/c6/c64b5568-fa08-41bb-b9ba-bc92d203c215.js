"use strict";
cc._RF.push(module, 'c64b5Vo+ghBu7m6vJLSA8IV', 'AnimationEvent');
// script/ui/uiEffect/AnimationEvent.js

"use strict";

/*
 动画节点关键帧回调接收
 */

cc.Class({
	extends: require("BaseComponent"),

	properties: {
		EventNode: cc.Node
	},

	// use this for initialization
	OnLoad: function OnLoad() {
		this.JS_Name = this.node.name + "_AnimationEvent";
	},

	OnModelAnimationEvent: function OnModelAnimationEvent() {
		var argList = Array.prototype.slice.call(arguments);
		if (this.EventNode) {
			this.EventNode.emit("OnAnimationEvent", { "Node": this.node, "ArgList": argList });
		}
	}
});

cc._RF.pop();