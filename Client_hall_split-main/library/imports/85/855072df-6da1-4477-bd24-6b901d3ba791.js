"use strict";
cc._RF.push(module, '85507LfbaFEd70ka5AdO6eR', 'UILayer');
// script/scene/Layer/UILayer.js

"use strict";

/*
 场景UI层
 */
var app = require("app");

cc.Class({
	extends: require("BaseComponent"),

	properties: {},

	OnCreate: function OnCreate(sceneType) {
		this.JS_Name = [sceneType, "UILayer"].join("_");
	}

});

cc._RF.pop();