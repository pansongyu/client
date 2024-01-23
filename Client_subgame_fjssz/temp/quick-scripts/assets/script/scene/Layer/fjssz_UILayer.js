(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/scene/Layer/fjssz_UILayer.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fjssz35f-31c7-46ac-a2e0-b0816af88c54', 'fjssz_UILayer', __filename);
// script/scene/Layer/fjssz_UILayer.js

"use strict";

/*
 场景UI层
 */
var app = require("fjssz_app");

cc.Class({
	extends: cc.Component,

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
        //# sourceMappingURL=fjssz_UILayer.js.map
        