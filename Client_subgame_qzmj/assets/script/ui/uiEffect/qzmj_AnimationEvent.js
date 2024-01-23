/*
 动画节点关键帧回调接收
 */

cc.Class({
	extends: cc.Component,

	properties: {
		EventNode:cc.Node,
	},

	// use this for initialization
	onLoad: function () {
		this.JS_Name = this.node.name + "_AnimationEvent";

	},

	OnModelAnimationEvent:function(){
		var argList = Array.prototype.slice.call(arguments)
		if(this.EventNode){
			this.EventNode.emit("OnAnimationEvent", {"Node":this.node,"ArgList":argList});
		}
	},
});
