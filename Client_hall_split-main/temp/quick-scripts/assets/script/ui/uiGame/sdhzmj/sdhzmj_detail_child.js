(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/sdhzmj/sdhzmj_detail_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f9275bWzYpOb6GFD5akn32K', 'sdhzmj_detail_child', __filename);
// script/ui/uiGame/sdhzmj/sdhzmj_detail_child.js

"use strict";

/*

 */

var app = require("app");

cc.Class({
	extends: require("BaseMJ_detail_child"),

	properties: {},

	// use this for initialization
	OnLoad: function OnLoad() {},

	huTypesShow: function huTypesShow(jiesuan, huData) {
		// jiesuan.getChildByName('huTypes').getChildByName('zimo').getChildByName('num').getComponent(cc.Label).string = huData.ziMoPoint + '';
		// jiesuan.getChildByName('huTypes').getChildByName('jiepao').getChildByName('num').getComponent(cc.Label).string = huData.jiePaoPoint + '';
		// jiesuan.getChildByName('huTypes').getChildByName('dianpao').getChildByName('num').getComponent(cc.Label).string = huData.dianPaoPoint + '';

		jiesuan.getChildByName('huTypes').getChildByName('hufen').getChildByName('num').getComponent(cc.Label).string = huData.resultPoint + '';
		jiesuan.getChildByName('huTypes').getChildByName('gangfen').getChildByName('num').getComponent(cc.Label).string = huData.gangPoint + '';
		jiesuan.getChildByName('huTypes').getChildByName('facaifen').getChildByName('num').getComponent(cc.Label).string = huData.faCaiPoint + '';
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
        //# sourceMappingURL=sdhzmj_detail_child.js.map
        