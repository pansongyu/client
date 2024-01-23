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
		this.IntegrateImage = app.SysDataManager().GetTableDict("IntegrateImage");
		this.ShareDefine = app.ShareDefine();
	},
	ShowPlayerData: function (setEnd, playerAll, index) {
		let jin1 = setEnd.jin;
		let jin2 = 0;
		if (setEnd.jin2 > 0) {
			jin2 = setEnd.jin2;
		}
		let dPos = -1;
		let posResultList = setEnd["posResultList"];
		let posHuArray = new Array();
		this.posCount = posResultList.length;
		for (let i = 0; i < this.posCount; i++) {
			let posInfo = posResultList[i];
			let pos = posInfo["pos"];
			let posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
			posHuArray[pos] = posHuType;
			if (posHuType != this.ShareDefine.HuType_NotHu && posHuType != this.ShareDefine.HuType_DianPao) {
				dPos = pos;
			}
		}
		let PlayerInfo = playerAll[index];
		this.node.active = true;
		let maList = setEnd["zhongList"] || [];
		let zhongMaList = setEnd["zhongMaList"] || [];
		this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, maList, zhongMaList, posResultList, dPos);
		let huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
		this.ShowPlayerHuImg(huNode, posResultList[index]['huType'], posResultList[index].isJiePao);

		if (dPos === index) {
			this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
		} else {
			this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
		}
		// this.ShowHeadKuang(index, dPos);
		//显示头像，如果头像UI
		if (PlayerInfo["pid"] && PlayerInfo["iconUrl"]) {
			app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"], PlayerInfo["iconUrl"]);
		}
		let weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
		weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
	},
	UpdatePlayData: function (PlayerNode, HuList, PlayerInfo, jin1 = 0, jin2 = 0, maList, zhongMaList, posResultList, dPos) {
		this.showLabelNum = 1;
		this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
		this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
		this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
		this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo);
		this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
		this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
		this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacardscrollView'), HuList.huaList);
		this.ShowPlayerNiaoPai(PlayerNode.getChildByName('zhongma'), maList, zhongMaList, HuList, posResultList, dPos);
	},
	ShowPlayerDownCard: function (ShowNode, publishcard, jin1 = 0, jin2 = 0) {
		ShowNode.active = 1;
		let UICard_DownCard = ShowNode.getComponent("UIMJCard_Down");
		UICard_DownCard.ShowDownCardByLKMJ(publishcard);
	},
	ShowPlayerHuaCard: function (huacardscrollView, hualist) {
		/*huacardscrollView.active = true;
		// if (hualist.length > 0) {
		//     this.huaNum.active = true;
		//     this.huaNum.getComponent(cc.Label).string = hualist.length + "个";
		// }
		// else {
		//     this.huaNum.active = false;
		//     this.huaNum.getComponent(cc.Label).string = "";
		// }
		let view = huacardscrollView.getChildByName("view");
		let ShowNode = view.getChildByName("huacard");
		let UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowHua");
		UICard_ShowCard.ShowHuaList(hualist);*/
	},
	ShowPlayerNiaoPai: function (ShowNode, maList, zhongMaList, huInfo, posResultList, dPos) {
		let pos = huInfo["pos"];
		// let zhongList = huInfo["zhongList"];
		ShowNode.opacity = 0;
		let cardlayout = ShowNode.getChildByName("cardlayout");
		for (let i = 0; i < cardlayout.children.length; i++) {
			cardlayout.children[i].opacity = 0;
			cardlayout.children[i].color = cc.color(255, 255, 255);
		}
		if (maList.length == 0) {
			console.error("ShowPlayerNiaoPai", maList);
			return;
		}
		// huType = this.ShareDefine.HuTypeStringDict[huType];
		//没胡得人不显示
		if (dPos != pos) {
			return;
		}
		ShowNode.opacity = 255;
		for (let i = 0; i < maList.length; i++) {
			let cardType = maList[i];
			let node = cardlayout.children[i];
			if (!node) {
				node = cc.instantiate(cardlayout.children[0]);
				node.color = cc.color(255, 255, 255);
				cardlayout.addChild(node);
			}
			node.opacity = 255;
			this.ShowImage(node, "EatCard_Self_", cardType);
			if (zhongMaList.indexOf(cardType) > -1) {
				node.color = cc.color(255, 255, 0);
			}
		}
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
				ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = "+" + huInfo.sportsPointTemp;
			} else {
				ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = huInfo.sportsPointTemp;
			}
		} else if (typeof (huInfo.sportsPoint) != "undefined") {
			ShowNode.getChildByName('tip_sportspoint').active = true;
			if (huInfo.sportsPoint > 0) {
				ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = "+" + huInfo.sportsPoint;
			} else {
				ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = huInfo.sportsPoint;
			}
		} else {
			ShowNode.getChildByName('tip_sportspoint').active = false;
		}
		//显示杠分
		let gangFen = huInfo["huPaiPoint"];
		if (gangFen > 0) {
			gangFen = "+" + gangFen;
		}
		//显示胡牌分
		let huPaiFen = huInfo["daiHuPoint"];
		if (huPaiFen > -1) {
			huPaiFen = "+" + huPaiFen;
		}
		//显示带摸分
		let daiMoFen = huInfo["qianPiaoPoint"];
		if (daiMoFen > -1) {
			daiMoFen = "+" + daiMoFen;
		}
		let houPiaoPoint = huInfo["houPiaoPoint"];
		if (houPiaoPoint > -1) {
			houPiaoPoint = "+" + houPiaoPoint;
		}
		// ShowNode.getChildByName("recordstr").active = true;
		// ShowNode.getChildByName("recordstr").getComponent("cc.Label").string = "胡牌：" + huPaiFen + "    " + "逮胡：" + gangFen + "    " + "前漂：" + daiMoFen + "    " + "后漂：" + houPiaoPoint;
	},
	ShowPlayerHuImg: function (huNode, huTypeName, isTing) {
		/*huLbIcon
		*  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
		*  13：双游，14：天胡，15：五金，16：自摸 17:接炮
		*/
		let huType = this.ShareDefine.HuTypeStringDict[huTypeName];
		//默认颜色描边
		huNode.color = new cc.Color(252, 236, 117);
		huNode.getComponent(cc.LabelOutline).color = new cc.Color(163, 61, 8);
		huNode.getComponent(cc.LabelOutline).Width = 2;
		if (typeof (huType) == "undefined") {
			huNode.getComponent(cc.Label).string = '';
		} else if (huType == this.ShareDefine.HuType_DianPao) {
			huNode.getComponent(cc.Label).string = '点炮';
			huNode.color = new cc.Color(192, 221, 245);
			huNode.getComponent(cc.LabelOutline).color = new cc.Color(31, 55, 127);
			huNode.getComponent(cc.LabelOutline).Width = 2;
			// if (isTing) {
			// 	huNode.getComponent(cc.Label).string = "报听点炮";
			// 	huNode.color = new cc.Color(192, 221, 245);
			// 	huNode.getComponent(cc.LabelOutline).color = new cc.Color(31, 55, 127);
			// 	huNode.getComponent(cc.LabelOutline).Width = 4;
			// }
		} else if (huType == this.ShareDefine.HuType_JiePao) {
			huNode.getComponent(cc.Label).string = '接炮';
		} else if (huType == this.ShareDefine.HuType_ZiMo) {
			huNode.getComponent(cc.Label).string = '自摸';
		} else if (huType == this.ShareDefine.HuType_QGH) {
			huNode.getComponent(cc.Label).string = '抢杠胡';
		} else if (huType == this.ShareDefine.HuType_GSKH) {
			huNode.getComponent(cc.Label).string = '杠开';
		} else {
			huNode.getComponent(cc.Label).string = '';
		}
	},
	ShowPlayerJieSuan: function (ShowNode, huInfoAll) {
		let huInfo = huInfoAll["huTypeMap"];
		// let huInfo = huInfoAll['endPoint']["huTypeMap"] || huInfoAll["huTypeMap"];
		// this.ClearLabelShow(ShowNode.getChildByName('label_lists'));
		for (let huType in huInfo) {
			let huPoint = huInfo[huType];
			if (this.IsShowMulti2(huType) || this.IsShowNum(huType)) {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "x" + huPoint);
				// this.ShowLabelName(ShowNode.getChildByName("label_lists"), huTypeDict[huType] + "*2");
			} else if (this.IsShowNum(huType)) {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), huTypeDict[huType]);
			} else {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
			}
			console.log("ShowPlayerJieSuan", huType, huPoint);
		}
	},
	//分数
	IsShowScore: function (huType) {
		let multi2 = [];
		let isShow = multi2.indexOf(huType) != -1;
		return isShow;
	},
	//个数
	IsShowNum: function (huType) {
		let multi2 = [];
		let isShow = multi2.indexOf(huType) != -1;
		return isShow;
	},
	//倍数
	IsShowMulti2: function (huType) {
		let multi2 = [
			"YeShu",  //
		];
		let isShow = multi2.indexOf(huType) != -1;
		return isShow;
	},
	LabelName: function (huType) {
		let huTypeDict = {};
		huTypeDict["Hu"] = "胡";
		huTypeDict["SanJinYou"] = "三金游";
		huTypeDict["DanYou"] = "单游";
		huTypeDict["SanJinDao"] = "三金倒";
		huTypeDict["TianHu"] = "天胡";
		huTypeDict["QiangJin"] = "枪金";
		huTypeDict["PingHu"] = "平胡";
		huTypeDict["QGH"] = "抢杠胡";
		huTypeDict["JieGang"] = "接杠";
		huTypeDict["AnGang"] = "暗杠";
		huTypeDict["Gang"] = "补杠";
		huTypeDict["DiFen"] = "底分";
		huTypeDict["LianZhuang"] = "连庄";
		huTypeDict["SanJinYou"] = "三金游";
		return huTypeDict[huType];
	},
});
