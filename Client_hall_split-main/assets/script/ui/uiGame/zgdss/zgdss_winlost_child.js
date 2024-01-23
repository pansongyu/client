/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
		NodeHuType: cc.Node,
		max_cardPrefab: cc.Prefab,
		SpriteMale: cc.SpriteFrame,
		SpriteFeMale: cc.SpriteFrame,
		kongge: cc.Node,
	},

	// use this for initialization
	OnLoad: function () {
		this.ComTool = app.ComTool();
		this.ShareDefine = app.ShareDefine();
		this.PokerCard = app.zgdss_PokerCard();
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
		let posCount = posResultList.length;
		for (let i = 0; i < posCount; i++) {
			let posInfo = posResultList[i];
			let pos = posInfo["pos"];
			let posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
			posHuArray[pos] = posHuType;
		}
		let PlayerInfo = playerAll[index];
		PlayerInfo["xiaoJiaFlag"] = posResultList[index]["xiaoJiaFlag"];
		this.node.active = true;
		this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, setEnd.maPaiLst);

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
	UpdatePlayData: function (PlayerNode, HuList, PlayerInfo) {
		this.jiesuan = this.GetWndNode("layoutall/layoutlist/jiesuan");
		this.hutypelayout = this.GetWndNode("layoutall/layoutlist/hutypelayout");
		this.node.getChildByName("pengchi").removeAllChildren();
		this.node.getChildByName("shoucard").removeAllChildren();
		this.node.getChildByName("handcard").removeAllChildren();
		this.hutypelayout.removeAllChildren();
		this.ShowPlayerRecord(PlayerNode, HuList);
		// this.ShowPlayerHuType(HuList);
		this.ShowPlayerInfo(PlayerNode.getChildByName("user_info"), PlayerInfo);
		this.ShowPlayerCPGCard(PlayerNode.getChildByName("pengchi"), HuList["publicCardList"]);
		this.ShowPlayerShowCard(PlayerNode.getChildByName("shoucard"), HuList["shouCard"]);
		this.ShowPlayerHuCard(PlayerNode.getChildByName("handcard"), HuList["handCard"]);
		this.ShowPlayerJieSuan(HuList);
	},
	ShowPlayerRecord: function (ShowNode, huInfo) {
		/*let fanNum = huInfo["fanNum"];
		ShowNode.getChildByName("record").getComponent("cc.Label").string = fanNum + "番";*/
		let point = ShowNode.getChildByName("point");
		point.active = true;
		if (huInfo["point"] > 0) {
			point.getComponent("cc.Label").string = "+" + huInfo["point"];
		} else {
			point.getComponent("cc.Label").string = huInfo["point"];
		}
		/*let hudian = ShowNode.getChildByName("hudian");
		hudian.active = true;
		if (huInfo["huDian"] > 0) {
			hudian.getComponent("cc.Label").string = "+" + huInfo["huDian"] + "点";
		} else {
			hudian.getComponent("cc.Label").string = huInfo["huDian"] + "点";
		}*/
		let roompoint = ShowNode.getChildByName("roompoint");
		roompoint.active = true;
		if (huInfo["roomPoint"] > 0) {
			roompoint.getComponent("cc.Label").string = "总分：+" + huInfo["roomPoint"];
		} else {
			roompoint.getComponent("cc.Label").string = "总分：" + huInfo["roomPoint"];
		}
		//显示竞技点
		if (typeof(huInfo["sportsPoint"]) != "undefined") {
			if (huInfo["sportsPoint"] > 0) {
				this.node.getChildByName("lb_SportsPoint").getComponent(cc.Label).string = "比赛分：+" + huInfo["sportsPoint"];
			} else {
				this.node.getChildByName("lb_SportsPoint").getComponent(cc.Label).string = "比赛分：" + huInfo["sportsPoint"];
			}
			this.node.getChildByName("lb_SportsPoint").active = true;
		} else {
			this.node.getChildByName("lb_SportsPoint").getComponent(cc.Label).string = "";
			this.node.getChildByName("lb_SportsPoint").active = false;
		}
	},
	ShowPlayerInfo: function (ShowNode, PlayerInfo) {
		ShowNode.getChildByName("lable_name").getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"], PlayerInfo["name"]);
		ShowNode.getChildByName("label_id").getComponent("cc.Label").string = this.ComTool.GetPid(PlayerInfo["pid"]);
		ShowNode.getChildByName("img_xiao").active = PlayerInfo["xiaoJiaFlag"];
		if (PlayerInfo["piaoHua"] == 1) {
			ShowNode.getChildByName("btn_p").active = true;
			ShowNode.getChildByName("btn_bp").active = false;
		} else if (PlayerInfo["piaoHua"] == 0) {
			ShowNode.getChildByName("btn_p").active = false;
			ShowNode.getChildByName("btn_bp").active = true;
		} else if (PlayerInfo["piaoHua"] == -1) {
			ShowNode.getChildByName("btn_p").active = false;
			ShowNode.getChildByName("btn_bp").active = false;
		}

		if (PlayerInfo["sex"] == this.ShareDefine.HeroSex_Boy) {
			ShowNode.getChildByName("sex").getComponent(cc.Sprite).SpriteFrame = this.SpriteMale;
		} else if (PlayerInfo["sex"] == this.ShareDefine.HeroSex_Girl) {
			ShowNode.getChildByName("sex").getComponent(cc.Sprite).SpriteFrame = this.SpriteFeMale;
		}
	},
	ShowPlayerJieSuan: function (huInfoAll) {
		for (let i = 0; i < this.jiesuan.children.length; i++) {
			this.jiesuan.children[i].active = false;
		}
		let huType = huInfoAll["huType"];
		if ("QGH" == huType) {
			huType = "JiePao"
		}
		if (huType != "NotHu") {
			this.jiesuan.getChildByName(huType).active = true;
		}
		if (huType == "PingHu") {
			this.jiesuan.getChildByName("Hu").active = false;
		}
	},
	ShowPlayerHuType: function (huInfoAll) {
		let huTypeMap = huInfoAll["endPoint"]["huTypeMap"];
		let huTypeMapStr = {
			SanZhang: "三张",
			BaPai: "巴牌",
			BeiShaBao: "被杀报",
			XiaoJia: "小家",
			BaoJiao: "报叫",
			TianHu: "天胡",
			DiHu: "地胡",
			DiFen: "底分",
		};
		for (let key in huTypeMap) {
			let huNode = cc.instantiate(this.NodeHuType);
			let huTypeStr = huTypeMapStr[key];
			let huTypePoint = huTypeMap[key];
			huNode.getComponent(cc.Label).string = huTypeStr + huTypePoint;
			this.hutypelayout.addChild(huNode);
		}
	},
	ShowPlayerShowCard: function (ShowNode, cardIDList) {
		let shouCard = cardIDList;
		let cardListNode = ShowNode;
		for (let i = 0; i < shouCard.length; i++) {
			let cardValue =shouCard[i];
			let cardNode = cc.instantiate(this.max_cardPrefab);
			this.ShowCard(cardValue, cardNode);
			cardListNode.addChild(cardNode);
		}
	},
	ShowPlayerCPGCard: function (ShowNode, cardIDList) {
		let cardListNode = ShowNode;
		cardListNode.removeAllChildren();
		for (let i = 0; i < cardIDList.length; i++) {//[[1,2],[4,5]]
			let cardArr = cardIDList[i];
			let cardList = cardArr.slice(3, cardArr.length);
			for (let j = 0; j < cardList.length; j++) {
				let cardNode = cc.instantiate(this.max_cardPrefab);
				let cardValue = cardList[j];
				this.ShowCard(cardValue, cardNode);
				cardListNode.addChild(cardNode);
			}
			let kongge = cc.instantiate(this.kongge);
			cardListNode.addChild(kongge);
		}
	},
	ShowPlayerHuCard: function (ShowNode, handCard) {
		if (handCard == 0) {
			return;
		}
		let cardListNode = ShowNode;
		let cardNode = cc.instantiate(this.max_cardPrefab);
		this.ShowCard(handCard, cardNode, true);
		cardListNode.addChild(cardNode);
		this.jiesuan.getChildByName("Hu").active = true;
	},
	//显示poker牌
	ShowCard: function (cardType, cardNode, isHu = false) {
		cardNode.active = true;
		this.GetPokeCard(cardType, cardNode, isHu);
		//cardNode.getChildByName("poker_back").active = false;
	},
	GetPokeCard: function (poker, cardNode, isHu = false) {
		if (0 == poker) {
			return;
		}
		this.PokerCard.GetPokeCardMini(poker, cardNode,isHu);
	},
	//获取牌值
	GetCardValue: function (poker) {
		poker = Math.floor(poker / 100);
		return poker & this.LOGIC_MASK_VALUE;
	},
	GetWndNode: function (wndPath) {
		let wndNode = cc.find(wndPath, this.node);
		if (!wndNode) {
			this.ErrLog("GetWndNode(%s) not find", wndPath);
			return;
		}
		return wndNode;
	},
	SortShouCard: function (shouCard) {
		if (shouCard[0] == 0) {
			console.error("没有手牌", shouCard);
			return;
		}
		//4行7竖
		//第一排从小到大排序
		//第二排可以凑14点的开始排，多出4行另取一竖，往后继续叠加
		//找出相同的牌值为1组
		let pokers = this.GetMonyPais(shouCard);
		for (let i = 0; i < pokers.length; i++) {
			pokers[i].sort((a, b) => {
				return this.GetCardValue(a) - this.GetCardValue(b);
			});
		}

		let allResults = [];
		let useDanPai = [];
		//1、单张和多组牌组成14张
		//多张和多组牌组成14张  4张和4张

		for (let l = 0; l < pokers.length; l++) {
			for (let i = l + 1; i < pokers.length; i++) {
				let value = this.GetCardValue(pokers[l][0]);
				let target = this.GetCardValue(pokers[i][0]);
				if (value + target == 14) {
					if (useDanPai.indexOf(pokers[l][0]) > -1 || useDanPai.indexOf(pokers[i][0]) > -1) {
						console.error("已经在使用过的数组中了");
						continue;
					}
					allResults.push(pokers[l].concat(pokers[i]));
					useDanPai = [].concat(useDanPai, pokers[l], pokers[i]);
				}
			}
		}
		//没有用过剩余的牌从小到大排序
		for (let i = 0; i < pokers.length; i++) {
			for (let j = 0; j < pokers[i].length; j++) {
				if (useDanPai.indexOf(pokers[i][j]) < 0) {
					allResults.push(pokers[i]);
					break;
				}
			}
		}
		allResults.sort((a, b) => {
			return this.GetCardValue(a[0]) - this.GetCardValue(b[0]);
		});
		//将超过4张的那组牌进行分离
		let cAllResults = [];
		for (let i = 0; i < allResults.length; i++) {
			let cards = allResults[i];
			if (cards.length <= 4) {
				cAllResults.push(allResults[i]);
			} else {// > 4
				let chai = [];
				let chai1 = [];
				let chai2 = [];
				for (let i = 0; i < cards.length; i++) {
					if (i < 4) {
						chai1.push(cards[i]);
					} else {
						chai2.push(cards[i]);
					}
				}
				chai.push(chai1, chai2);
				chai.sort((a, b) => {
					return this.GetCardValue(a[0]) - this.GetCardValue(b[0]);
				});
				for (let j = 0; j < chai.length; j++) {
					cAllResults.push(chai[j]);
				}
			}
		}
		console.log("3整理后的手牌", cAllResults, allResults, useDanPai);
		return cAllResults;
	},
	GetMonyPais: function (shouCard) {
		let cards = [];
		for (let i = 0; i < shouCard.length; i++) {
			let poker = shouCard[i];
			let pokers = this.GetSameValue(shouCard, poker);
			let bInList4 = this.CheckPokerInListEx(cards, poker);
			if (!bInList4) {
				this.PushTipCard(cards, pokers, pokers.length);
			}
		}
		console.log("获取相同的牌值的数组", cards);
		return cards;
	},
	//获取同一牌值
	GetSameValue: function (pokers, tagCard) {
		let sameValueList = [];
		let tagCardValue = this.GetCardValue(tagCard);
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			let pokerValue = this.GetCardValue(poker);

			if (tagCardValue == pokerValue) {
				sameValueList[sameValueList.length] = poker;
			}
		}
		return sameValueList
	},
	CheckPokerInListEx: function (list, tagCard) {
		if (list.length == 0) {
			return false;
		}
		let bInList = false;
		for (let i = 0; i < list.length; i++) {
			let item = list[i];
			let cardValue = this.GetCardValue(item[0]);
			let tagValue = this.GetCardValue(tagCard);

			if (cardValue == tagValue) {
				bInList = true;
			}
		}
		return bInList;
	},
	PushTipCard: function (pokers, samePoker, len) {
		let temp = [];
		samePoker.reverse();
		for (let i = 0; i < len; i++) {
			temp.push(samePoker[i]);
		}
		pokers.push(temp);
	},
});