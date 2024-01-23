/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
	},

	// use this for initialization
	OnLoad: function () {
		this.ComTool = app.ComTool();
		this.ShareDefine = app.ShareDefine();
	},

	ShowPlayerData: function (setEnd, playerAll, index) {
		let jin1 = setEnd.jin;
		let jin2 = 0;
		if (setEnd.jin2 > 0) {
			jin2 = setEnd.jin2;
		}
		let dPos = setEnd.dPos;
		let posResultList = setEnd["posResultList"];
		let posHuArray = new Array();
		this.posCount = posResultList.length;
		for (let i = 0; i < this.posCount; i++) {
			let posInfo = posResultList[i];
			let pos = posInfo["pos"];
			let posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
			posHuArray[pos] = posHuType;
		}
		let PlayerInfo = playerAll[index];
		this.node.active = true;
		let maiMaList = setEnd["maiMaList"] || [];
		this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, maiMaList);
		let huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
		this.ShowPlayerHuImg(huNode, posResultList[index]['huType'], posResultList[index].isJiePao, setEnd["saiZiList"]);
		this.lb_winListNum = this.node.getChildByName('jiesuan').getChildByName("scoreDetails").getChildByName('lb_winListNum').getComponent(cc.Label);
		this.lb_winListNum.string = posResultList[index]["winList"].join("");

		this.node.getChildByName("user_info").getChildByName("lb_posOrder").getComponent(cc.Label).string = index + 1;
		this.node.getChildByName("user_info").getChildByName("img_bao").active = posResultList[index].isTing;

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

	ShowPlayerHuImg: function (huNode, huTypeName, saiZiList) {
		/*huLbIcon
		*  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
		*  13：双游，14：天胡，15：五金，16：自摸 17:接炮
		*/
		this.huStringMap = {};
		this.huStringMap["HuOne"] = "接炮1";
		this.huStringMap["HuTwo"] = "接炮2";
		this.huStringMap["HuThree"] = "接炮3";
		this.huStringMap["HuFour"] = "接炮4";
		this.huStringMap["HuFive"] = "接炮5";
		this.huStringMap["ZiMoOne"] = "自摸1";
		this.huStringMap["ZiMoTwo"] = "自摸2";
		this.huStringMap["ZiMoThree"] = "自摸3";
		this.huStringMap["ZiMoFour"] = "自摸4";
		this.huStringMap["ZiMoFive"] = "自摸5";
		this.huStringMap["ChaJiao"] = "查叫";
		this.huStringMap["ChaGuanSi"] = "关死";

		if (Object.hasOwnProperty.call(this.huStringMap, huTypeName)) {
			huNode.getComponent(cc.Label).string = this.huStringMap[huTypeName];
			this.img_bzfb = this.node.getChildByName("img_bzfb");
			this.img_bzfb.active = saiZiList[0] == saiZiList[1];
		} else {
			huNode.getComponent(cc.Label).string = '';
			this.img_bzfb = this.node.getChildByName("img_bzfb");
			this.img_bzfb.active = false;
		}


		// let huType = this.ShareDefine.HuTypeStringDict[huTypeName];
		// if (typeof (huType) == "undefined") {
		//     huNode.getComponent(cc.Label).string = '';
		// } else if (huType == this.ShareDefine.HuType_DianPao) {
		//     huNode.getComponent(cc.Label).string = '点泡';
		// } else if (huType == this.ShareDefine.HuType_JiePao) {
		//     huNode.getComponent(cc.Label).string = '接炮';
		// } else if (huType == this.ShareDefine.HuType_ZiMo) {
		//     huNode.getComponent(cc.Label).string = '自摸';
		// } else if (huType == this.ShareDefine.HuType_QGH) {
		//     huNode.getComponent(cc.Label).string = '抢杠胡';
		// } else {
		//     huNode.getComponent(cc.Label).string = '';
		// }
	},

	ShowPlayerDownCard: function (ShowNode, publishcard, jin1 = 0, jin2 = 0) {
		ShowNode.active = 1;
		let UICard_DownCard = ShowNode.getComponent("UIMJCard_Down");
		UICard_DownCard.ShowDownCardBySCNJMJ(publishcard, "EatCard_Self_", this.HuList["gangMap"], this.HuList);
	},

	ShowOtherScore: function () {
		// let huTypeMap = this.posResultInfo["huTypeMap"];
		// if (typeof (huTypeMap) == "undefined") {
		// 	huTypeMap = this.posResultInfo["endPoint"]["huTypeMap"];
		// }
		// this.scores = this.node.getChildByName("scores");
		// this.scores.getChildByName("lb_MaiMa").getComponent(cc.Label).string = "马分" + huTypeMap["MaiMa"];
		// this.scores.getChildByName("lb_Gang").getComponent(cc.Label).string = "杠分" + huTypeMap["Gang"];
		// this.scores.getChildByName("lb_huPoint").getComponent(cc.Label).string = "胡分" + huTypeMap["HuPoint"];
	},

	UpdatePlayData: function (PlayerNode, HuList, PlayerInfo, jin1 = 0, jin2 = 0, maPaiLst = null) {
		this.HuList = HuList;
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
		this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo, HuList);
		this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
		this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
		this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'), HuList.huaList);
		this.posResultInfo = HuList;
		// this.ShowOtherScore();
		this.ShowHuBaoPosList(this.posResultInfo["huBaoPosList"]);
	},
	// 互包
	ShowHuBaoPosList: function (huBaoPosList) {
		// let cfg = {};
		// cfg[EnumType.EnumRelativePosType.EnumRelativePos_SELF] = "本";
		// cfg[EnumType.EnumRelativePosType.EnumRelativePos_XIA] = "下";
		// cfg[EnumType.EnumRelativePosType.EnumRelativePos_DUI] = "对";
		// cfg[EnumType.EnumRelativePosType.EnumRelativePos_SHANG] = "上";

		// let huBaoList = this.node.getChildByName("huBaoList");
		// huBaoList.removeAllChildren();
		// let lb_huBao = this.node.getChildByName("lb_huBao");

		// this.playerCount = this.endInfo["posResultList"].length;
		// let clientPos = this.RoomPosMgr.GetClientPos();
		// for (let i = 0; i < huBaoPosList.length; i++) {
		// 	let posId = huBaoPosList[i];
		// 	let relativePos = this.RelativePosValue(clientPos, posId, this.playerCount);
		// 	let str = "互包" + cfg[relativePos] + "家";
		// 	let node = cc.instantiate(lb_huBao);
		// 	node.active = true;
		// 	node.getComponent(cc.Label).string = str;
		// 	huBaoList.addChild(node);
		// }
	},

	ShowPlayerJieSuan: function (ShowNode, huInfoAll) {
		// let huInfo = huInfoAll['endPoint'].huTypeMap;
		let huInfo = huInfoAll["huTypeMap"];
		if (typeof (huInfo) == "undefined") {
			huInfo = huInfoAll["endPoint"]["huTypeMap"];
		}
		for (let huType in huInfo) {
			if (huType == "MaiMa" || huType == "Gang" || huType == "HuPoint") {
				continue;
			}
			let huPoint = huInfo[huType];
			this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + "： " + huPoint);
			console.log("ShowPlayerJieSuan", huType, huPoint);
		}
	},

	RelativePosValue: function (referencePos, posId, playerCount) {
		let downPos = -1;	//下家
		let facePos = -1;	//对家
		let upPos = -1;		//上家
		if (playerCount == 2) {
			facePos = referencePos == 0 ? 1 : 0;
		} else if (playerCount == 3) {
			upPos = (referencePos + playerCount - 1) % playerCount;
			downPos = (referencePos + 1) % playerCount;
		} else {
			upPos = (referencePos + playerCount - 1) % playerCount;
			downPos = (referencePos + 1) % playerCount;
			facePos = (referencePos + 2) % playerCount;
		}
		if (posId == referencePos) return EnumType.EnumRelativePosType.EnumRelativePos_SELF;
		if (posId == downPos) return EnumType.EnumRelativePosType.EnumRelativePos_XIA;
		if (posId == facePos) return EnumType.EnumRelativePosType.EnumRelativePos_DUI;
		if (posId == upPos) return EnumType.EnumRelativePosType.EnumRelativePos_SHANG;

		return EnumType.EnumRelativePosType.EnumRelativePos_NONE;
	},

	LabelName: function (huType) {
		let LabelArray = this.GetHuTypeDict();
		return LabelArray[huType];
	},

	// GetHuTypeDict -start-
	GetHuTypeDict: function () {
		let huTypeDict = {};
		huTypeDict["GSKH"] = "杠上开花";
		huTypeDict["GSP"] = "杠上炮";
		huTypeDict["PPH"] = "对对胡";
		huTypeDict["PPH"] = "对对胡";
		huTypeDict["DiHu"] = "地胡";
		huTypeDict["QDHu"] = "七对";
		huTypeDict["HDDHu"] = "龙七对";
		huTypeDict["TianHu"] = "天胡";
		huTypeDict["QYS"] = "清一色";
		huTypeDict["YiBanGao"] = "一般高";
		huTypeDict["KaErTiao"] = "卡二条";
		huTypeDict["HaiDiPao"] = "海底炮";
		huTypeDict["HDLY"] = "海底捞月";
		huTypeDict["PingHu"] = "平胡";
		huTypeDict["BaoJiao"] = "报叫";
		huTypeDict["Gen"] = "根";
		huTypeDict["Gang"] = "杠";
		huTypeDict["TianHu"] = "天胡";
		huTypeDict["QGH"] = "抢杠胡";

		return huTypeDict;
	},
	// GetHuTypeDict -end-

	
});
