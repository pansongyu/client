/*
 场景UI层
 */
var app = require("app");

cc.Class({
	extends: require("BaseComponent"),

	properties: {
	},

	OnCreate: function (sceneType) {
		this.JS_Name = [sceneType, "UILayer"].join("_");
	},


});
