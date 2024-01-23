/*
 场景UI层
 */
var app = require("qzmj_app");

cc.Class({
	extends: cc.Component,

	properties: {
	},

	OnCreate: function (sceneType) {
		this.JS_Name = [sceneType, "UILayer"].join("_");
	},


});
