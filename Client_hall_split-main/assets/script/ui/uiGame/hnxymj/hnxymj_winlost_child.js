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
	ShowPlayerData: function (setEnd, playerAll, index) {
		let jin1 = setEnd.jin1;
		let jin2 = setEnd.jin2;
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
		this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2);
		let huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
		this.ShowPlayerHuImg(huNode, posResultList[index]['huType']);

		if (dPos === index) {
			this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
		} else {
			this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
		}
		//显示头像，如果头像UI
		if (PlayerInfo["pid"] && PlayerInfo["iconUrl"]) {
			app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"], PlayerInfo["iconUrl"]);
		}
		let weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
		weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
	},
	UpdatePlayData: function (PlayerNode, HuList, PlayerInfo, jin1 = 0, jin2 = 0, maPaiLst = null) {
		this.showLabelNum = 1;
		this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
		//显示比赛分
		if (typeof (HuList.sportsPointTemp) != "undefined") {
			if (HuList.sportsPointTemp > 0) {
				this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：+" + HuList.sportsPointTemp);
			} else {
				this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：" + HuList.sportsPointTemp);
			}
		} else if (typeof (HuList.sportsPoint) != "undefined") {
			if (HuList.sportsPoint > 0) {
				this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：+" + HuList.sportsPoint);
			} else {
				this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：" + HuList.sportsPoint);
			}
		}
		this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
		this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
		this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo);
		this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, HuList.allKanList, jin1, jin2);
		this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.allKanList, HuList.handCard, jin1, jin2);
		this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'), HuList.huaList);
	},
	ShowPlayerDownCard: function (ShowNode, publishcard, allKanList = []) {
		ShowNode.active = 1;
		let UICard_DownCard = ShowNode.getComponent("UIMJCard_Down");
		UICard_DownCard.ShowDownCardByHnxymj(publishcard, allKanList, "EatCard_Self_");
	},
	ShowPlayerShowCard: function (ShowNode, cardIDList, allKanList = [], handCard, jin1, jin2) {
		ShowNode.active = 1;
		let UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowCard");
		UICard_ShowCard.ShowShouCardByHnxymj(cardIDList, allKanList, handCard, "EatCard_Self_", jin1, jin2);
	},
	LabelName: function (huType) {
		let huTypeDict = {
			Hu: "胡",
			QYS: "清一色",
			QD: "七对",
			PQ: "牌钱",
			XP: "小跑",
			XMQ: "小门清",
			DMQ: "大门清",
			BZ: "八张",
			SZ: "十张",
			JZ: "夹子",
			DY: "独赢",
			DM: "断门",
			XQQ: "小清缺",
			DQQ: "大清缺",
			LSF: "乱三风",
			ZW: "中五",
			LL: "连六",
			SQY: "三七赢",
			SQJ: "三七将",
			JZZ: "九张涨",
			YTL: "一条龙",
			KP: "坎牌",
			GSKH: "杠上开花",
		};
		return huTypeDict[huType];
	},
	ShowPlayerJieSuan: function (ShowNode, huInfoAll) {
		let huInfo = huInfoAll['endPoint'].huTypeMap;
		for (let huType in huInfo) {
			let huPoint = huInfo[huType];
			if (huType == "QYS" || huType == "QD" || huType == "GSKH") {
				huPoint = huPoint + "X 2";
			}
			this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + huPoint);
			console.log("ShowPlayerJieSuan", huType, huPoint);
		}
	},
	ShowLabelName: function (jiesuan, labelText) {
		if (this.showLabelNum > 16) {
			return;
		}
		jiesuan.getChildByName("label_" + this.showLabelNum.toString()).getComponent(cc.Label).string = labelText;
		this.showLabelNum = this.showLabelNum + 1;
	},
	ClearLabelShow: function (jiesuan) {
		for (let i = 1; i <= 16; i++) {
			jiesuan.getChildByName("label_" + i.toString()).getComponent(cc.Label).string = '';
		}
	},
});
