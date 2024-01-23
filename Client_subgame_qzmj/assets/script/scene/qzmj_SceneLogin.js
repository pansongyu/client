/*
 登陆场景
 */

var app = require("qzmj_app");

cc.Class({
	extends: require(app.subGameName + "_BaseScene"),

	properties: {},

	//----------回掉函数------------------
	OnCreate: function () {

	},


	//进入场景
	OnSwithSceneEnd: function () {
		console.log("come in OnSwithSceneEnd");
		app[app.subGameName + "_FormManager"]().ShowForm(app.subGameName + "_UILogin");
	},

	OnTouchEnd: function (event) {

	},
});
