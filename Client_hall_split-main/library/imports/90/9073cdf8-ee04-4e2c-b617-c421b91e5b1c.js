"use strict";
cc._RF.push(module, '9073c347gROLLYXxCG5Hlsc', 'stmj_detail_child');
// script/ui/uiGame/stmj/stmj_detail_child.js

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