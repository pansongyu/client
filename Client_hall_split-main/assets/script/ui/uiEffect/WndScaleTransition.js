/*
 WndScaleTransition 数字label渐变
 */

cc.Class({
	extends: require("BaseComponent"),

	properties: {
		transTime:0.1,

		backEvents: {
			default: [],
			type: cc.Component.EventHandler,
		}
	},

	// use this for initialization
	onLoad: function () {
		this.JS_Name = this.node.name + "_WndScaleTransition";
		this.startScale = this.node.getScale();
	},

	SetWndScale:function(endScale, posID){
		this.node.stopActionByTag(55555);
		this.node.WndUserData = posID;

		var action = cc.sequence(
			cc.scaleTo(this.transTime, endScale),
			cc.scaleTo(this.transTime, this.startScale),
			cc.callFunc(this.OnScaleEnd, this)
		);

		action.setTag(55555);
		this.node.runAction(action);
	},

	OnScaleEnd:function(sender){

		cc.Component.EventHandler.emitEvents(this.backEvents, sender.WndUserData);
	},
});
