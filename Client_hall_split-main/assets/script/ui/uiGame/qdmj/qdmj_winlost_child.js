/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {},
	// use this for initialization
	OnLoad: function () {
		this.ComTool = app.ComTool();
		this.ShareDefine = app.ShareDefine();
	},
	LabelName: function (huType) {
		let LabelArray = {
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
			TIAN_GANG: "天杠",
			QDHu: "七对胡",
			JiePao: "接炮",
			AnGang: "暗杠",
			HUHUANG_ZHUANG: "荒庄",
			DianPao: "点炮",
			DianGang: "点杠",
			DDHu: "对对胡",
			Gang: "明杠",
		};
		return LabelArray[huType];
	},
});
