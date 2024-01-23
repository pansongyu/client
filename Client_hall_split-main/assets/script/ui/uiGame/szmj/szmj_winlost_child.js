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
	UpdatePlayData: function (PlayerNode, HuList, PlayerInfo, jin1 = 0, jin2 = 0, maList, zhongMaList) {
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
		this.ShowPlayerFanCard(PlayerNode.getChildByName("fanpai"), maList, zhongMaList);
	},
	ShowPlayerRecord: function (ShowNode, huInfo) {
		let absNum = Math.abs(huInfo["point"]);
		if (absNum > 10000) {
			let shortNum = (absNum / 10000).toFixed(2);
			if (huInfo["point"] > 0) {
				ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '+' + shortNum + "万";
			} else {
				ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '-' + shortNum + "万";
			}
		} else {
			if (huInfo["point"] > 0) {
				ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '+' + huInfo["point"];
			} else {
				ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = huInfo["point"];
			}
		}
		//显示比赛分
		if (typeof (huInfo.sportsPointTemp) != "undefined") {
			ShowNode.getChildByName('tip_sportspoint').active = true;
			if (huInfo.sportsPointTemp > 0) {
				ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string =  "+" + huInfo.sportsPointTemp;
			} else {
				ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string =  huInfo.sportsPointTemp;
			}
		}else if (typeof (huInfo.sportsPoint) != "undefined") {
			ShowNode.getChildByName('tip_sportspoint').active = true;
			if (huInfo.sportsPoint > 0) {
				ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string =  "+" + huInfo.sportsPoint;
			} else {
				ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string =  huInfo.sportsPoint;
			}
		}else{
			ShowNode.getChildByName('tip_sportspoint').active = false;
		}
	},
	LabelName: function (huType) {
		let LabelArray = {
			DiHua: "底花",
			QGH: "抢杠胡",
			DaMenQing: "大门清",
			XiaoMenQing: "小门清",
			Hua: "花牌",
			QiDui: "七对",
			HHQiDui: "豪华七对",
			ShuangHHQiDui: "双豪华七对",
			SanHHQiDui: "三豪华七对",
			TianHu: "天胡",
			DiHu: "地胡",
			PPH: "对对胡",
			QYS: "清一色",
			HYS: "混一色",
			HDLY: "海底捞月",
			DDC: "大吊车",
			WBD: "无百搭",
			DBD: "吊百搭",
			GSKH: "杠上开花",
			FANPAI: "翻牌",
			BaoZi: "豹子",
			DiLing: "滴零",
		};
		return LabelArray[huType];
	},
	ShowPlayerData: function (setEnd, playerAll, index) {
		console.log("单局结算数据", setEnd, playerAll, index);
		let jin1 = setEnd.jin;
		let jin2 = 0;
		if (setEnd.jin2 > 0) {
			jin2 = setEnd.jin2;
		}
		let dPos = setEnd.dPos;
		let posResultList = setEnd["posResultList"];
		let posHuArray = new Array();
		let posCount = posResultList.length;
		for (let i = 0; i < posCount; i++) {
			let posInfo = posResultList[i];
			let pos = posInfo["pos"];
			let posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
			posHuArray[pos] = posHuType;
		}
		let PlayerInfo = playerAll[index];
		this.node.active = true;
		this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, setEnd.maList, setEnd.zhongMaList);
		let huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
		this.ShowPlayerHuImg(huNode, posResultList[index]['huType']);

		if (dPos === index) {
			this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
		} else {
			this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
		}
		this.node.getChildByName("user_info").getChildByName("ting").active = posResultList[index]["isBaoTing"];
		//显示头像，如果头像UI
		if (PlayerInfo["pid"] && PlayerInfo["iconUrl"]) {
			app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"], PlayerInfo["iconUrl"]);
		}
		let weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
		weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
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
		for (let huType in huTypeMap) {
			let huPoint = huTypeMap[huType];
			if (huType == "DiFen") {
				difen.string = this.LabelName(huType) + huPoint;
			} else if (huType == "LianZhuang") {
				lianZhuang.string = this.LabelName(huType) + huPoint;
			} else if (huType == "PiaoFen") {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), "插" + huPoint + "盘");
			} else {
				// this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint + "番");
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
			}
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
	ShowPlayerFanCard: function (fanpai, maList, zhongMaList) {
		if (maList.length <= 0) {
			fanpai.opacity = 0;
			return;
		}
		fanpai.opacity = 255;
		let UICard_ShowCard = fanpai.getComponent("UIMJCard_ShowHua");
		UICard_ShowCard.ShowSZMJFanCardList(maList, zhongMaList);
	},
});
