/*
 场景UI层
 */
var app = require("pdk_app");

cc.Class({
	extends: cc.Component,

	properties: {
	},

	OnCreate: function (sceneType) {
		this.JS_Name = [sceneType, "UILayer"].join("_");
	},


});
