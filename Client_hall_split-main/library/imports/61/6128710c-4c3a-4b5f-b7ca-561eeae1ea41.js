"use strict";
cc._RF.push(module, '61287EMTDpLX7fKVh7q4epB', 'cp_winlost_child');
// script/ui/uiGame/cp/cp_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
		NodeHuType: cc.Node,
		max_cardPrefab: cc.Prefab,
		SpriteMale: cc.SpriteFrame,
		SpriteFeMale: cc.SpriteFrame,
		kongge: cc.Node
	},

	// use this for initialization
	OnLoad: function OnLoad() {
		this.PokerCard = app.PokerCard();
		this.ComTool = app.ComTool();
		this.ShareDefine = app.ShareDefine();
		this.IntegrateImage = app.SysDataManager().GetTableDict("IntegrateImage");
		this.showGangNum = 1;
	},
	ShowPlayerData: function ShowPlayerData(setEnd, playerAll, index) {
		console.log("setEnd", setEnd);
		var jin1 = setEnd.jin;
		var jin2 = 0;
		if (setEnd.jin2 > 0) {
			jin2 = setEnd.jin2;
		}
		var dPos = setEnd.dPos;
		var posResultList = setEnd["posResultList"];
		var posHuArray = new Array();
		var posCount = posResultList.length;
		for (var i = 0; i < posCount; i++) {
			var posInfo = posResultList[i];
			var pos = posInfo["pos"];
			var posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
			posHuArray[pos] = posHuType;
		}
		var PlayerInfo = playerAll[index];
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
		var weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
		weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
	},
	UpdatePlayData: function UpdatePlayData(PlayerNode, HuList, PlayerInfo) {
		this.jiesuan = this.GetWndNode("layoutall/layoutlist/jiesuan");
		this.hutypelayout = this.GetWndNode("layoutall/layoutlist/hutypelayout");
		this.node.getChildByName("showcard").removeAllChildren();
		this.hutypelayout.removeAllChildren();
		this.ShowPlayerRecord(PlayerNode, HuList);
		// this.ShowPlayerHuType(HuList);
		this.ShowPlayerInfo(PlayerNode.getChildByName("user_info"), PlayerInfo);
		// this.ShowPlayerCPGCard(PlayerNode.getChildByName("showcard"), HuList["publicCardList"]);
		// this.ShowPlayerShowCard(PlayerNode.getChildByName("showcard"), HuList["shouCard"]);
		// this.ShowPlayerHuCard(PlayerNode.getChildByName("showcard"), HuList["handCard"]);
		// this.ShowPlayerHuCard(PlayerNode.getChildByName("showcard"), HuList["huCard"]);
		// this.ShowPlayerJieSuan(HuList);
		this.ShowBaiPaiList(PlayerNode, HuList["baiPaiList"]);
		this.ShowHuType(PlayerNode, HuList["huType"]);
		this.ShowFanShu(PlayerNode, HuList["fanShu"]);
	},

	ShowBaiPaiList: function ShowBaiPaiList(playerNode, baiPaiList) {
		var baiPaiNodeList = playerNode.getChildByName("baiPaiList");
		var baiPaiItem = playerNode.getChildByName("baiPaiItem");
		baiPaiNodeList.removeAllChildren();

		for (var i = 0; i < baiPaiList.length; i++) {
			var cardId = baiPaiList[i];
			var node = cc.instantiate(baiPaiItem);
			baiPaiNodeList.addChild(node);
			node.active = true;
			node.cardId = cardId;
			this.GetSelfPokeCard(cardId, node);
		}
		playerNode.getChildByName("lb_baiPaiCount").getComponent(cc.Label).string = "摆牌：" + baiPaiList.length + "张";
	},

	GetSelfPokeCard: function GetSelfPokeCard(poker, cardNode) {
		var isHu = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

		if (0 == poker) {
			return;
		}
		cardNode.active = true;
		var type = Math.floor(poker / 100);
		var iconSp = cardNode.getComponent(cc.Sprite);
		// iconSp.spriteFrame = this.selfPokerDict[type];

		cc.loader.loadRes("ui/uiGame/cp/self/" + type, cc.SpriteFrame, function (err, spriteFrame) {
			if (err) {
				cc.error(err);
				return;
			}
			iconSp.spriteFrame = spriteFrame;
		});
	},

	ShowHuType: function ShowHuType(playerNode, huType) {
		playerNode.getChildByName("img_hu").active = huType == "ZiMo";
	},

	ShowFanShu: function ShowFanShu(playerNode, fanShu) {
		playerNode.getChildByName("lb_fanShu").getComponent(cc.Label).string = fanShu + "番";
	},

	ShowPlayerRecord: function ShowPlayerRecord(ShowNode, huInfo) {
		var fanNum = huInfo["fanNum"];
		ShowNode.getChildByName("record").getComponent("cc.Label").string = fanNum + "番";
		var point = ShowNode.getChildByName("point");
		point.active = true;
		if (huInfo["point"] > 0) {
			point.getComponent("cc.Label").string = "+" + huInfo["point"];
		} else {
			point.getComponent("cc.Label").string = huInfo["point"];
		}
		// let hudian = ShowNode.getChildByName("hudian");
		// hudian.active = true;
		// if (huInfo["huDian"] > 0) {
		// 	hudian.getComponent("cc.Label").string = "+" + huInfo["huDian"] + "点";
		// } else {
		// 	hudian.getComponent("cc.Label").string = huInfo["huDian"] + "点";
		// }
		var roompoint = ShowNode.getChildByName("roompoint");
		roompoint.active = true;
		if (huInfo["roomPoint"] > 0) {
			roompoint.getComponent("cc.Label").string = "总分：+" + huInfo["roomPoint"];
		} else {
			roompoint.getComponent("cc.Label").string = "总分：" + huInfo["roomPoint"];
		}
		//显示竞技点
		if (typeof huInfo["sportsPoint"] != "undefined") {
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
	ShowPlayerInfo: function ShowPlayerInfo(ShowNode, PlayerInfo) {
		ShowNode.getChildByName("lable_name").getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"], PlayerInfo["name"]);
		ShowNode.getChildByName("label_id").getComponent("cc.Label").string = this.ComTool.GetPid(PlayerInfo["pid"]);
		ShowNode.getChildByName("img_xiao").active = PlayerInfo["xiaoJiaFlag"];
		/*if (PlayerInfo["piaoHua"] == 1) {
  	ShowNode.getChildByName("btn_p").active = true;
  	ShowNode.getChildByName("btn_bp").active = false;
  } else if (PlayerInfo["piaoHua"] == 0) {
  	ShowNode.getChildByName("btn_p").active = false;
  	ShowNode.getChildByName("btn_bp").active = true;
  } else if (PlayerInfo["piaoHua"] == -1) {
  	ShowNode.getChildByName("btn_p").active = false;
  	ShowNode.getChildByName("btn_bp").active = false;
  }*/
		ShowNode.getChildByName("btn_p").active = false;
		ShowNode.getChildByName("btn_bp").active = false;
		if (PlayerInfo["sex"] == this.ShareDefine.HeroSex_Boy) {
			ShowNode.getChildByName("sex").getComponent(cc.Sprite).SpriteFrame = this.SpriteMale;
		} else if (PlayerInfo["sex"] == this.ShareDefine.HeroSex_Girl) {
			ShowNode.getChildByName("sex").getComponent(cc.Sprite).SpriteFrame = this.SpriteFeMale;
		}
	},
	ShowPlayerJieSuan: function ShowPlayerJieSuan(huInfoAll) {
		for (var i = 0; i < this.jiesuan.children.length; i++) {
			this.jiesuan.children[i].active = false;
		}
		var huType = huInfoAll["huType"];
		if ("QGH" == huType) {
			huType = "JiePao";
		}
		if (huType != "NotHu") {
			this.jiesuan.getChildByName(huType).active = true;
		}
		if (huType == "PingHu") {
			this.jiesuan.getChildByName("Hu").active = false;
		}
	},
	ShowPlayerHuType: function ShowPlayerHuType(huInfoAll) {
		var huTypeMap = huInfoAll["endPoint"]["huTypeMap"];
		var huTypeMapStr = {
			ErShiSiTuoHong: "龙胡",
			ShiTuoHong: "十坨红",
			TuoTuoHong: "坨坨红",
			TuoTuoHei: "坨坨黑",
			HeiLong: "黑龙",
			TianHu: "天胡",
			XiaoHu: "小胡",
			SiZhang: "四张",
			ChongTianFan: "冲番牌",
			BaoJiao: "报叫",
			ChiPiao: "吃飘"
		};
		for (var key in huTypeMap) {
			var huNode = cc.instantiate(this.NodeHuType);
			var huTypeStr = huTypeMapStr[key];
			var huTypePoint = huTypeMap[key];
			if (key == "XiaoHu" || key == "ChiPiao") {
				huTypePoint = "";
			}
			huNode.getComponent(cc.Label).string = huTypeStr + huTypePoint;
			this.hutypelayout.addChild(huNode);
		}
	},
	ShowPlayerShowCard: function ShowPlayerShowCard(ShowNode, cardIDList) {
		var shouCard = this.SortShouCard(cardIDList);
		var cardListNode = ShowNode;
		for (var i = 0; i < shouCard.length; i++) {
			for (var j = 0; j < shouCard[i].length; j++) {
				var cardValue = shouCard[i][j];
				var cardNode = cc.instantiate(this.max_cardPrefab);
				this.ShowCard(cardValue, cardNode);
				cardListNode.addChild(cardNode);
			}
			var kongge = cc.instantiate(this.kongge);
			cardListNode.addChild(kongge);
		}
	},
	ShowPlayerCPGCard: function ShowPlayerCPGCard(ShowNode, cardIDList) {
		var cardListNode = ShowNode;
		cardListNode.removeAllChildren();
		for (var i = 0; i < cardIDList.length; i++) {
			//[[1,2],[4,5]]
			var cardArr = cardIDList[i];
			var cardList = cardArr.slice(3, cardArr.length);
			for (var j = 0; j < cardList.length; j++) {
				var cardNode = cc.instantiate(this.max_cardPrefab);
				var cardValue = cardList[j];
				this.ShowCard(cardValue, cardNode);
				cardListNode.addChild(cardNode);
			}
			var kongge = cc.instantiate(this.kongge);
			cardListNode.addChild(kongge);
		}
	},
	ShowPlayerHuCard: function ShowPlayerHuCard(ShowNode, handCard) {
		if (handCard == 0) {
			return;
		}
		var cardListNode = ShowNode;
		var cardNode = cc.instantiate(this.max_cardPrefab);
		this.ShowCard(handCard, cardNode, true);
		cardListNode.addChild(cardNode);
		this.jiesuan.getChildByName("Hu").active = true;
	},
	//显示poker牌
	ShowCard: function ShowCard(cardType, cardNode) {
		var isHu = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

		this.GetPokeCard(cardType, cardNode, isHu);
		cardNode.active = true;
		cardNode.getChildByName("poker_back").active = false;
	},
	GetPokeCard: function GetPokeCard(poker, cardNode) {
		var isHu = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

		if (0 == poker) {
			return;
		}
		var type1 = Math.floor(poker / 100);
		var iconSp = cardNode.getChildByName("icon").getComponent(cc.Sprite);
		cardNode.getChildByName("img_hupai").active = isHu;
		iconSp.spriteFrame = this.PokerCard.aycp_pokerDict[type1];
	},
	//获取牌值
	GetCardValue: function GetCardValue(poker) {
		poker = Math.floor(poker / 100);
		return poker & this.LOGIC_MASK_VALUE;
	},
	GetWndNode: function GetWndNode(wndPath) {
		var wndNode = cc.find(wndPath, this.node);
		if (!wndNode) {
			this.ErrLog("GetWndNode(%s) not find", wndPath);
			return;
		}
		return wndNode;
	},
	SortShouCard: function SortShouCard(shouCard) {
		var _this = this;

		if (shouCard[0] == 0) {
			console.error("没有手牌", shouCard);
			return;
		}
		//4行7竖
		//第一排从小到大排序
		//第二排可以凑14点的开始排，多出4行另取一竖，往后继续叠加
		//找出相同的牌值为1组
		var pokers = this.GetMonyPais(shouCard);
		for (var i = 0; i < pokers.length; i++) {
			pokers[i].sort(function (a, b) {
				return _this.GetCardValue(a) - _this.GetCardValue(b);
			});
		}

		var allResults = [];
		var useDanPai = [];
		//1、单张和多组牌组成14张
		//多张和多组牌组成14张  4张和4张

		for (var l = 0; l < pokers.length; l++) {
			for (var _i = l + 1; _i < pokers.length; _i++) {
				var value = this.GetCardValue(pokers[l][0]);
				var target = this.GetCardValue(pokers[_i][0]);
				if (value + target == 14) {
					if (useDanPai.indexOf(pokers[l][0]) > -1 || useDanPai.indexOf(pokers[_i][0]) > -1) {
						console.error("已经在使用过的数组中了");
						continue;
					}
					allResults.push(pokers[l].concat(pokers[_i]));
					useDanPai = [].concat(useDanPai, pokers[l], pokers[_i]);
				}
			}
		}
		//没有用过剩余的牌从小到大排序
		for (var _i2 = 0; _i2 < pokers.length; _i2++) {
			for (var j = 0; j < pokers[_i2].length; j++) {
				if (useDanPai.indexOf(pokers[_i2][j]) < 0) {
					allResults.push(pokers[_i2]);
					break;
				}
			}
		}
		allResults.sort(function (a, b) {
			return _this.GetCardValue(a[0]) - _this.GetCardValue(b[0]);
		});
		//将超过4张的那组牌进行分离
		var cAllResults = [];
		for (var _i3 = 0; _i3 < allResults.length; _i3++) {
			var cards = allResults[_i3];
			if (cards.length <= 4) {
				cAllResults.push(allResults[_i3]);
			} else {
				// > 4
				var chai = [];
				var chai1 = [];
				var chai2 = [];
				for (var _i4 = 0; _i4 < cards.length; _i4++) {
					if (_i4 < 4) {
						chai1.push(cards[_i4]);
					} else {
						chai2.push(cards[_i4]);
					}
				}
				chai.push(chai1, chai2);
				chai.sort(function (a, b) {
					return _this.GetCardValue(a[0]) - _this.GetCardValue(b[0]);
				});
				for (var _j = 0; _j < chai.length; _j++) {
					cAllResults.push(chai[_j]);
				}
			}
		}
		console.log("3整理后的手牌", cAllResults, allResults, useDanPai);
		return cAllResults;
	},
	GetMonyPais: function GetMonyPais(shouCard) {
		var cards = [];
		for (var i = 0; i < shouCard.length; i++) {
			var poker = shouCard[i];
			var pokers = this.GetSameValue(shouCard, poker);
			var bInList4 = this.CheckPokerInListEx(cards, poker);
			if (!bInList4) {
				this.PushTipCard(cards, pokers, pokers.length);
			}
		}
		console.log("获取相同的牌值的数组", cards);
		return cards;
	},
	//获取同一牌值
	GetSameValue: function GetSameValue(pokers, tagCard) {
		var sameValueList = [];
		var tagCardValue = this.GetCardValue(tagCard);
		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			var pokerValue = this.GetCardValue(poker);

			if (tagCardValue == pokerValue) {
				sameValueList[sameValueList.length] = poker;
			}
		}
		return sameValueList;
	},
	CheckPokerInListEx: function CheckPokerInListEx(list, tagCard) {
		if (list.length == 0) {
			return false;
		}
		var bInList = false;
		for (var i = 0; i < list.length; i++) {
			var item = list[i];
			var cardValue = this.GetCardValue(item[0]);
			var tagValue = this.GetCardValue(tagCard);

			if (cardValue == tagValue) {
				bInList = true;
			}
		}
		return bInList;
	},
	PushTipCard: function PushTipCard(pokers, samePoker, len) {
		var temp = [];
		samePoker.reverse();
		for (var i = 0; i < len; i++) {
			temp.push(samePoker[i]);
		}
		pokers.push(temp);
	}
});

cc._RF.pop();