"use strict";
cc._RF.push(module, '574efA6V+FJBp3i7q3YlVxx', 'lsmj_detail_child');
// script/ui/uiGame/lsmj/lsmj_detail_child.js

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
		// jiesuan.getChildByName('huTypes').getChildByName('angang').getChildByName('num').getComponent(cc.Label).string = huData.anGangPoint;
		// jiesuan.getChildByName('huTypes').getChildByName('zhigang').getChildByName('num').getComponent(cc.Label).string = huData.mingGangPoint;
		// jiesuan.getChildByName('huTypes').getChildByName('penggang').getChildByName('num').getComponent(cc.Label).string = huData.buGangPoint;
	}

});

cc._RF.pop();