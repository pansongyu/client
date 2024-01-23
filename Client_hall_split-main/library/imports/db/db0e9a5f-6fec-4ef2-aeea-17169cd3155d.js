"use strict";
cc._RF.push(module, 'db0e9pfb+xO8q7qFxac0xVd', 'srmj_detail_child');
// script/ui/uiGame/srmj/srmj_detail_child.js

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

		// jiesuan.getChildByName('huTypes').getChildByName('dianpao').getChildByName('num').getComponent(cc.Label).string = huData.dianPaoPoint;
		// jiesuan.getChildByName('huTypes').getChildByName('jiepao').getChildByName('num').getComponent(cc.Label).string = huData.jiePaoPoint;
		// jiesuan.getChildByName('huTypes').getChildByName('diangang').getChildByName('num').getComponent(cc.Label).string = huData.dianGangPoint;
		// jiesuan.getChildByName('huTypes').getChildByName('jiegang').getChildByName('num').getComponent(cc.Label).string = huData.jieGangPoint;

		jiesuan.getChildByName('huTypes').getChildByName('zimo').getChildByName('num').getComponent(cc.Label).string = huData.ziMoPoint;
		jiesuan.getChildByName('huTypes').getChildByName('mingGang').getChildByName('num').getComponent(cc.Label).string = huData.mingGangPoint;
		jiesuan.getChildByName('huTypes').getChildByName('anGang').getChildByName('num').getComponent(cc.Label).string = huData.anGangPoint;

		jiesuan.getChildByName('huTypes').getChildByName('buGang').getChildByName('num').getComponent(cc.Label).string = huData.buGangPoint;
		jiesuan.getChildByName('huTypes').getChildByName('siBao').getChildByName('num').getComponent(cc.Label).string = huData.siBao;
		jiesuan.getChildByName('huTypes').getChildByName('feiBao').getChildByName('num').getComponent(cc.Label).string = huData.feiBao;
	}

});

cc._RF.pop();