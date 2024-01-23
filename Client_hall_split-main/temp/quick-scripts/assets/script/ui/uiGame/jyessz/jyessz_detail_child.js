(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/jyessz/jyessz_detail_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '75520RkUYVEN5X1505nrTjL', 'jyessz_detail_child', __filename);
// script/ui/uiGame/jyessz/jyessz_detail_child.js

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
		// let huPaiCount = huData.huTypes.length - huData.jiePaoPoint;
		jiesuan.getChildByName('huTypes').getChildByName('hupai').getChildByName('num').getComponent(cc.Label).string = huData.huCnt + '';
		jiesuan.getChildByName('huTypes').getChildByName('dianpao').getChildByName('num').getComponent(cc.Label).string = huData.dianPaoPoint + '';
		jiesuan.getChildByName('huTypes').getChildByName('minggang').getChildByName('num').getComponent(cc.Label).string = huData.gangPoint + '';
		jiesuan.getChildByName('huTypes').getChildByName('angang').getChildByName('num').getComponent(cc.Label).string = huData.anGangPoint + '';
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
        //# sourceMappingURL=jyessz_detail_child.js.map
        