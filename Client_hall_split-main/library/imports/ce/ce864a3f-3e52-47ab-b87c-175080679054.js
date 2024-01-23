"use strict";
cc._RF.push(module, 'ce864o/PlJHq7h8F1CAZ5BU', 'sj_winlost_child');
// script/ui/uiGame/sj/sj_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
	extends: require("BasePoker_winlost_child"),

	properties: {},

	// use this for initialization
	OnLoad: function OnLoad() {},
	ShowSpecData: function ShowSpecData(setEnd, playerAll, index) {
		console.log("单局结算", setEnd, playerAll, index);
		var player = setEnd.posResultList[index];

		//阵营
		var lb_zhenying = this.node.getChildByName("contentLayout").getChildByName("lb_zhenying");
		lb_zhenying.active = true;
		var zhenying = lb_zhenying.getComponent(cc.Label);
		var jiPaiSteps = -1;
		if (player.isZhuang) {
			zhenying.string = "红方";
			jiPaiSteps = setEnd["zhuValue"];
		} else {
			zhenying.string = "蓝方";
			jiPaiSteps = setEnd["duiJiaZhuValue"];
		}

		//底分
		var lb_jipai = this.node.getChildByName("contentLayout").getChildByName("lb_jipai");
		lb_jipai.active = true;
		var jipai = lb_jipai.getComponent(cc.Label);
		jipai.string = jiPaiSteps;
	}
});

cc._RF.pop();