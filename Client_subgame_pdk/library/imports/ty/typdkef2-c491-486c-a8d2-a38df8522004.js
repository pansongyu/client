"use strict";
cc._RF.push(module, 'typdkef2-c491-486c-a8d2-a38df8522004', 'pdk_SceneLogin');
// script/scene/pdk_SceneLogin.js

"use strict";

/*
 登陆场景
 */

var app = require("pdk_app");

cc.Class({
	extends: require(app.subGameName + "_BaseScene"),

	properties: {},

	//----------回掉函数------------------
	OnCreate: function OnCreate() {},

	//进入场景
	OnSwithSceneEnd: function OnSwithSceneEnd() {
		console.log("come in OnSwithSceneEnd");
		app[app.subGameName + "_FormManager"]().ShowForm(app.subGameName + "_UILogin");
	},

	OnTouchEnd: function OnTouchEnd(event) {}
});

cc._RF.pop();