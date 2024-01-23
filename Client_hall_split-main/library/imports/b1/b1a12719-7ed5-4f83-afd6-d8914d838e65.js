"use strict";
cc._RF.push(module, 'b1a12cZftVPg6/W2JFNg45l', 'qdmj_winlost_child');
// script/ui/uiGame/qdmj/qdmj_winlost_child.js

"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {},
	// use this for initialization
	OnLoad: function OnLoad() {
		this.ComTool = app.ComTool();
		this.ShareDefine = app.ShareDefine();
	},
	LabelName: function LabelName(huType) {
		var _LabelArray;

		var LabelArray = (_LabelArray = {
			QGH: "抢杠胡",
			ZiMo: "自摸",
			QDHu: "抢杠胡",
			ShouZhuaYi: "手把一",
			GSKH: "杠上开花",
			QYS: "清一色",
			HYS: "混一色",
			QLHu: "清龙",
			SanAnKe: "三暗刻",
			BQRen: "不求人",
			HDLY: "海底捞月",
			HDDHu: "豪华七对",
			DanTing: "扣听",
			TianHu: "天胡",
			DiHu: "地胡",
			TIAN_GANG: "天杠"
		}, _defineProperty(_LabelArray, "QDHu", "七对胡"), _defineProperty(_LabelArray, "JiePao", "接炮"), _defineProperty(_LabelArray, "AnGang", "暗杠"), _defineProperty(_LabelArray, "HUHUANG_ZHUANG", "荒庄"), _defineProperty(_LabelArray, "DianPao", "点炮"), _defineProperty(_LabelArray, "DianGang", "点杠"), _defineProperty(_LabelArray, "DDHu", "对对胡"), _defineProperty(_LabelArray, "Gang", "明杠"), _LabelArray);
		return LabelArray[huType];
	}
});

cc._RF.pop();