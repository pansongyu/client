"use strict";
cc._RF.push(module, 'd47a6tpAi1EhaNL4iCMFWBe', 'jxmj_detail_child');
// script/ui/uiGame/jxmj/jxmj_detail_child.js

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
		jiesuan.getChildByName('huTypes').getChildByName('qiangGang').getChildByName('num').getComponent(cc.Label).string = huData.qiangGangCount;
		// jiesuan.getChildByName('huTypes').getChildByName('jiepao').getChildByName('num').getComponent(cc.Label).string = huData.jiePaoPoint;
		// jiesuan.getChildByName('huTypes').getChildByName('dianpao').getChildByName('num').getComponent(cc.Label).string = huData.dianPaoPoint;
		// jiesuan.getChildByName('huTypes').getChildByName('point').getChildByName('num').getComponent(cc.Label).string = huData.point;
	}

});

cc._RF.pop();