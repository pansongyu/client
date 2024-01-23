/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
		huaNum: cc.Node,
	},

	// use this for initialization
	OnLoad: function () {
		this.ComTool = app.ComTool();
		this.ShareDefine = app.ShareDefine();
	},
	UpdatePlayData: function (PlayerNode, HuList, PlayerInfo, jin1 = 0, jin2 = 0, maPaiLst = null) {
		this.showLabelNum = 1;
		this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
		//显示竞技点
		if (typeof(HuList.sportsPoint) != "undefined") {
			if (HuList.sportsPoint > 0) {
				this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：+" + HuList.sportsPoint);
			} else {
				this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：" + HuList.sportsPoint);
			}
		}
		this.huaNum.active = false;
		this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
		this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
		this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo);
		this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList);
		this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
		// this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'),HuList.huaList);
		this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacardscrollView'), HuList.huaList);
	},
	LabelName: function (huType) {
		let LabelArray = {
			Gang: "杠分",
			PingHu: "普通胡",
			HuDuJia: "胡独夹",
			CaiDiao: "财吊",
			QGHu: "抢杠胡",
			MingGSKH: "明杠上开花",
			AnGSKH: "暗杠上开花",
			MingGangBao: "明杠爆",
			AnGangBao: "暗杠爆",
			SiCaiShen: "四财神",
			QD: "七对子",
			HHQD: "豪华七对",
			ShuangHHQD: "二豪华七对",
			SanHHQD: "三豪华七对",
			CaiDiaoQD: "七对子",
			CaiDiaoHHQD: "豪华七对",
			CaiDiaoShuangHHQD: "二豪华七对",
			CaiDiaoSanHHQD: "三豪华七对",
			DiHu: "普通地胡",
			DiHuQD: "七对子地胡",
			DiHuHHQD: "豪华七对地胡",
			DiHuShuangHHQD: "二豪华七对地胡",
			DiHuSanHHQD: "三豪华七对地胡",
			CaiDiaoDiHuQD: "七对子地胡",
			CaiDiaoDiHuHHQD: "豪华七对地胡",
			CaiDiaoDiHuShuangHHQD: "二豪华七对地胡",
			CaiDiaoDiHuSanHHQD: "三豪华七对地胡",
			TianHu: "普通天胡",
			TianHuQD: "七对子天胡",
			TianHuHHQD: "豪华七对天胡",
			TianHuShuangHHQD: "二豪华七对天胡",
			TianHuSanHHQD: "三豪华七对天胡",
			CaiDiaoTianHuQD: "七对子天胡",
			CaiDiaoTianHuHHQD: "豪华七对天胡",
			CaiDiaoTianHuShuangHHQD: "二豪华七对天胡",
			CaiDiaoTianHuSanHHQD: "三豪华七对天胡",
			CaiPiao: "财飘",
			ShuangCaiPiao: "双财飘",
			SanCaiPiao: "三财飘",
			GenPai: "跟牌"
		};
		return LabelArray[huType];
	},
	ShowPlayerJieSuan: function (ShowNode, huInfoAll) {
		let huInfo = false;
		if (huInfoAll['endPoint']) {
			huInfo = huInfoAll['endPoint'];
		} else {
			huInfo = huInfoAll;
		}
		let lianZhuang = ShowNode.getChildByName('lianzhuang').getComponent(cc.Label);
		let zhuang = ShowNode.getChildByName('zhuang').getComponent(cc.Label);
		let difen = ShowNode.getChildByName('difen').getComponent(cc.Label);
		lianZhuang.string = "";
		zhuang.string = "";
		difen.string = "";
		ShowNode.getChildByName('huawin').getComponent(cc.Label).string = "";
		let huTypeMap = huInfo["huTypeMap"];
		/*for (let huType in huTypeMap) {
			let huPoint = huTypeMap[huType];
			if (huType == "DiFen") {
				difen.string = this.LabelName(huType) + huPoint;
			} else if (huType == "LianZhuang") {
				lianZhuang.string = this.LabelName(huType) + huPoint;
			} else if (huType == "PiaoFen") {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), "插" + huPoint + "盘");
			} else {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint + "番");
			}
		}*/
		for (let huType in huTypeMap) {
			let huPoint = huTypeMap[huType];
			this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
		}
	},
	ShowPlayerHuaCard: function (huacardscrollView, hualist) {
		huacardscrollView.active = true;
		if (hualist.length > 0) {
			this.huaNum.active = true;
			this.huaNum.getComponent(cc.Label).string = hualist.length + "个";
		} else {
			this.huaNum.active = false;
			this.huaNum.getComponent(cc.Label).string = "";
		}
		let view = huacardscrollView.getChildByName("view");
		let ShowNode = view.getChildByName("huacard");
		let UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowHua");

		UICard_ShowCard.Show20HuaList(hualist);

	},
});
