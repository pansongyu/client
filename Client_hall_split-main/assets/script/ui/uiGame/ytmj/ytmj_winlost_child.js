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
	ShowPlayerHuImg: function (huNode, huTypeName) {
		/*huLbIcon
		*  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
		*  13：双游，14：天胡，15：五金，16：自摸 17:接炮
		*/
		let huType = this.ShareDefine.HuTypeStringDict[huTypeName];
		if (typeof(huType) == "undefined") {
			huNode.getComponent(cc.Label).string = '';
		} else if (huType == this.ShareDefine.HuType_DianPao) {
			huNode.getComponent(cc.Label).string = '点泡';
		} else if (huType == this.ShareDefine.HuType_JiePao) {
			huNode.getComponent(cc.Label).string = '接炮';
		} else if (huType == this.ShareDefine.HuType_ZiMo) {
			huNode.getComponent(cc.Label).string = '自摸';
		} else if (huType == this.ShareDefine.HuType_QGH) {
			huNode.getComponent(cc.Label).string = '抢杠胡';
		} else {
			huNode.getComponent(cc.Label).string = '';
		}
	},
	LabelName: function (huType) {
		let huTypeDict = {
			Gang: "杠",
			AnGang: "暗杠",
			JieGang: "接杠",
			FeiLong: "四宝飞龙",
			FeiBao: "飞宝",
			PingHu: "平胡",
			PPHu: "碰碰胡",
			ZYS: "字一色",
			QYS: "清一色",
			HYS: "混一色",
			SSL: "十三烂",
			QSSL: "七星十三烂",
			DDHu: "七小对",
			HDDHu: "豪华七小对",
			CHDDHu: "超豪华七小对",
			CCHDDHu: "超级豪华七小对",
			DiHu: "地胡",
			TianHu: "天胡",
			GSKH: "杠上开花",
			QGH: "抢杠胡",
			GSP: "杠上炮",
			DouBao: "兜宝",
			FaBao: "罚宝",
			DD: "单吊"
		};
		return huTypeDict[huType];
	},
	ShowPlayerShowCard: function (ShowNode, cardIDList, handCard, jin1, jin2) {
		console.log("ShowPlayerShowCard", cardIDList, handCard, jin1, jin2);
		ShowNode.active = 1;
		let UICard_ShowCard = ShowNode.getComponent("ytmj_UIMJCard_ShowCard");
		UICard_ShowCard.ShowDownCard(cardIDList, handCard, jin1, jin2);
	},
	ShowPlayerDownCard: function (ShowNode, publishcard, jin1, jin2) {
		ShowNode.active = 1;
		let UICard_DownCard = ShowNode.getComponent("ytmj_UIMJCard_Down");
		UICard_DownCard.ShowDownCard(publishcard, jin1, jin2);
	},
});
