"use strict";
cc._RF.push(module, 'typdk35f-31c7-46ac-a2e0-b0816af88c54', 'pdk_UILayer');
// script/scene/Layer/pdk_UILayer.js

"use strict";

/*
 场景UI层
 */
var app = require("pdk_app");

cc.Class({
	extends: cc.Component,

	properties: {},

	OnCreate: function OnCreate(sceneType) {
		this.JS_Name = [sceneType, "UILayer"].join("_");
	}

});

cc._RF.pop();