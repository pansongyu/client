(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/scene/Layer/UILayer.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '85507LfbaFEd70ka5AdO6eR', 'UILayer', __filename);
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
        //# sourceMappingURL=UILayer.js.map
        