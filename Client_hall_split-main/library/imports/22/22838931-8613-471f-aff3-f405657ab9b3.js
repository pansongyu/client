"use strict";
cc._RF.push(module, '22838kxhhNHH6/z9AVlermz', 'tjmj_detail_child');
// script/ui/uiGame/tjmj/tjmj_detail_child.js

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
		jiesuan.getChildByName('huTypes').getChildByName('dianpao').getChildByName('num').getComponent(cc.Label).string = huData.dianPaoPoint;
		jiesuan.getChildByName('huTypes').getChildByName('hupai').getChildByName('num').getComponent(cc.Label).string = huData.huCnt;
		jiesuan.getChildByName('huTypes').getChildByName('jiepao').getChildByName('num').getComponent(cc.Label).string = huData.jiePaoPoint;
		// jiesuan.getChildByName('huTypes').getChildByName('baipai').getChildByName('num').getComponent(cc.Label).string = huData.mingBaiNum;
	}

});

cc._RF.pop();