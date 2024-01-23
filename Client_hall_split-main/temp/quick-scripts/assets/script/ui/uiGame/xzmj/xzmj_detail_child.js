(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/xzmj/xzmj_detail_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'bc094WbzrFDCrESMhe3wSnX', 'xzmj_detail_child', __filename);
// script/ui/uiGame/xzmj/xzmj_detail_child.js

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

		jiesuan.getChildByName('huTypes').getChildByName('zimo').getChildByName('num').getComponent(cc.Label).string = huData.ziMoPoint;
		jiesuan.getChildByName('huTypes').getChildByName('jiepao').getChildByName('num').getComponent(cc.Label).string = huData.jiePaoPoint;
		jiesuan.getChildByName('huTypes').getChildByName('dianpao').getChildByName('num').getComponent(cc.Label).string = huData.dianPaoPoint;

		// jiesuan.getChildByName('huTypes').getChildByName('diangang').getChildByName('num').getComponent(cc.Label).string = huData.dianGangPoint;
		// jiesuan.getChildByName('huTypes').getChildByName('minggang').getChildByName('num').getComponent(cc.Label).string = huData.mingGangPoint;
		// jiesuan.getChildByName('huTypes').getChildByName('angang').getChildByName('num').getComponent(cc.Label).string = huData.anGangPoint;
		// jiesuan.getChildByName('huTypes').getChildByName('jiegang').getChildByName('num').getComponent(cc.Label).string = huData.jieGangPoint;
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
        //# sourceMappingURL=xzmj_detail_child.js.map
        