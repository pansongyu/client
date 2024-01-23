"use strict";
cc._RF.push(module, '97c9eukPXRKdbZp35tWmbjn', 'lskjjmj_detail_child');
// script/ui/uiGame/lskjjmj/lskjjmj_detail_child.js

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
		jiesuan.getChildByName('huTypes').getChildByName('winNum').getChildByName('num').getComponent(cc.Label).string = huData.huCnt;
		jiesuan.getChildByName('huTypes').getChildByName('zimo').getChildByName('num').getComponent(cc.Label).string = huData.ziMoPoint;
		jiesuan.getChildByName('huTypes').getChildByName('angang').getChildByName('num').getComponent(cc.Label).string = huData.anGangPoint;
		// jiesuan.getChildByName('huTypes').getChildByName('baipai').getChildByName('num').getComponent(cc.Label).string = huData.mingBaiNum;
	}

});

cc._RF.pop();