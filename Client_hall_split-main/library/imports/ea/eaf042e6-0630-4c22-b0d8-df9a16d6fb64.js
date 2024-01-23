"use strict";
cc._RF.push(module, 'eaf04LmBjBMIrDY35oW1vtk', 'yjnxmj_detail_child');
// script/ui/uiGame/yjnxmj/yjnxmj_detail_child.js

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
		jiesuan.getChildByName('top').getChildByName('lb_dianpao').getComponent(cc.Label).string = huData.dianPaoPoint;
		jiesuan.getChildByName('top').getChildByName('lb_jiepao').getComponent(cc.Label).string = huData.jiePaoPoint;
		jiesuan.getChildByName('top').getChildByName('lb_zimo').getComponent(cc.Label).string = huData.ziMoPoint;

		jiesuan.getChildByName('top').getChildByName('anGangPoint').getComponent(cc.Label).string = huData.anGangPoint;
		jiesuan.getChildByName('top').getChildByName('gangPoint').getComponent(cc.Label).string = huData.mingGangPoint;
	}
});

cc._RF.pop();