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
		if (typeof (huType) == "undefined") {
			huNode.getComponent(cc.Label).string = '';
		} else if (huType == this.ShareDefine.HuType_DianPao) {
			huNode.getComponent(cc.Label).string = '点泡';
		} else if (huType == this.ShareDefine.HuType_JiePao) {
			huNode.getComponent(cc.Label).string = '接炮';
		} else if (huType == this.ShareDefine.HuType_ZiMo) {
			huNode.getComponent(cc.Label).string = '自摸';
		} else {
			huNode.getComponent(cc.Label).string = '';
		}
	},
	ShowPlayerJieSuan: function (ShowNode, huInfoAll) {
		ShowNode.getChildByName("paofen").getComponent(cc.Label).string = "";
		let piaofen = huInfoAll["piaoFen"];
		if (piaofen > -1) {
			ShowNode.getChildByName("paofen").getComponent(cc.Label).string = "跑：+" + piaofen;
		}
		let huInfo = huInfoAll['endPoint'].huTypeMap;
		for (let huType in huInfo) {
			let huPoint = huInfo[huType];
			if (huPoint != 0) {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
			} else {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType));
			}
			/*if (this.IsShowMulti2(huType)) {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "*2");
			} else {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
			}*/
			console.log("ShowPlayerJieSuan", huType);
		}
	},

	IsShowMulti2: function (huType) {
		let multi2 = [];
		let isShow = multi2.indexOf(huType) != -1;
		return isShow;
	},

	LabelName: function (huType) {
		let huTypeDict = {
			GSKH: "杠上花",
			QDHu: "七对",
			DianGang: "点杠",
			AnGang: "暗杠",
			Gang: "续杠",
			JieGang: "直杠",
			Zhuang: "庄加底",
			GangPao: "杠跑",
			QiDuiJiaBei: "七对加倍",
			GSHJiaBei: "杠上花加倍",
			ZiMoJiaBei: "自摸加倍",
			PaoFen: "跑分",
			DianPeng: "点碰"
		};
		if (!huTypeDict.hasOwnProperty(huType)) {
			console.error("huType = " + huType + "is not exist");
		}

		return huTypeDict[huType];
	},
});
