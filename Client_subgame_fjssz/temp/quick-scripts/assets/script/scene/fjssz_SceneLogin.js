(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/scene/fjssz_SceneLogin.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fjsszef2-c491-486c-a8d2-a38df8522004', 'fjssz_SceneLogin', __filename);
// script/scene/fjssz_SceneLogin.js

"use strict";

/*
 登陆场景
 */

var app = require("fjssz_app");

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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=fjssz_SceneLogin.js.map
        