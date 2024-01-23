(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/aydss/aydss_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'dfd0fTySy1Op4XGoeXrAmuc', 'aydss_winlost_child', __filename);
// script/ui/uiGame/aydss/aydss_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
		CPGPrefab: cc.Node,
		NodeHuType: cc.Node,
		max_cardPrefab: cc.Prefab,
		SpriteMale: cc.SpriteFrame,
		SpriteFeMale: cc.SpriteFrame
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
		this.node.getChildByName("showcard").getChildByName("cardlist").removeAllChildren();
		this.hutypelayout.removeAllChildren();
		this.CPGPrefab.getChildByName("layout").getComponent(cc.Layout).spacingX = -90;
		this.ShowPlayerRecord(PlayerNode.getChildByName("record"), HuList);
		this.ShowPlayerJieSuan(HuList);
		this.ShowPlayerHuType(HuList);
		this.ShowPlayerInfo(PlayerNode.getChildByName("user_info"), PlayerInfo);
		this.ShowPlayerShowCard(PlayerNode.getChildByName("showcard"), HuList["shouCard"]);
		this.ShowPlayerCPGCard(PlayerNode.getChildByName("showcard"), HuList["publicCardList"]);
		this.ShowPlayerHuCard(PlayerNode.getChildByName("showcard"), HuList["handCard"]);
	},
	ShowPlayerRecord: function ShowPlayerRecord(ShowNode, huInfo) {
		var fanNum = huInfo["endPoint"]["fanNum"];
		ShowNode.active = true;
		if (huInfo["point"] > 0) {
			ShowNode.getComponent("cc.Label").string = fanNum + "番  " + "+" + huInfo["point"];
		} else {
			ShowNode.getComponent("cc.Label").string = fanNum + "番  " + huInfo["point"];
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
	},
	ShowPlayerHuType: function ShowPlayerHuType(huInfoAll) {
		var huTypeMap = huInfoAll["endPoint"]["huTypeMap"];
		var huTypeMapStr = {
			Hu: "平胡",
			Zhuang: "庄番",
			DDHu: "对对胡",
			LongQiDui: "龙七对",
			FullRed: "全红",
			FullBlack: "全黑",
			TianHu: "天胡",
			DiHu: "地胡",
			QGH: "抢杠胡",
			Peng: "碰番",
			Gui: "鬼番",
			Gang: "杠番",
			JieGang: "接杠番",
			AnGang: "暗杠番",
			CHZMJF: "扯后自摸加番",
			BaoJiao: "爆叫",
			Piao: "飘"
		};
		for (var key in huTypeMap) {
			var huNode = cc.instantiate(this.NodeHuType);
			var huTypeStr = huTypeMapStr[key];
			var huTypePoint = huTypeMap[key];
			huNode.children[0].getComponent(cc.Label).string = huTypeStr /* + huTypePoint*/;
			this.hutypelayout.addChild(huNode);
		}
	},
	ShowPlayerShowCard: function ShowPlayerShowCard(ShowNode, cardIDList) {
		var sortCard = this.SortShouCard(cardIDList);
		var cardListNode = ShowNode.getChildByName("cardlist");
		cardListNode.removeAllChildren();
		for (var i = 0; i < sortCard.length; i++) {
			var cardValue = sortCard[i];
			var CPGPrefab = cc.instantiate(this.CPGPrefab);
			var cardNode = cc.instantiate(this.max_cardPrefab);
			CPGPrefab.getChildByName("layout").addChild(cardNode);
			this.ShowCard(cardValue, cardNode);
			cardListNode.addChild(CPGPrefab);
		}
	},
	ShowPlayerCPGCard: function ShowPlayerCPGCard(ShowNode, cardIDList) {
		var cardListNode = ShowNode.getChildByName("cardlist");
		for (var i = 0; i < cardIDList.length; i++) {
			//[[1,2],[4,5]]
			var CPGPrefab = cc.instantiate(this.CPGPrefab);
			var cardArr = cardIDList[i];
			var cardList = cardArr.slice(3, cardArr.length);
			for (var j = 0; j < cardList.length; j++) {
				var cardNode = cc.instantiate(this.max_cardPrefab);
				var cardValue = cardList[j];
				CPGPrefab.getChildByName("layout").addChild(cardNode);
				if (cardList.length - 1 >= j) {
					if (j == 0) {
						cardNode.y = 20;
					} else if (j == 2) {
						cardNode.y = -20;
					} else if (j == 3) {
						cardNode.y = -40;
					}
				}
				if (cardList.length == 1) {
					cardNode.y = 0;
				}
				this.ShowCard(cardValue, cardNode);
			}
			cardListNode.addChild(CPGPrefab);
		}
	},
	ShowPlayerHuCard: function ShowPlayerHuCard(ShowNode, handCard) {
		if (handCard == 0) {
			this.node.getComponent(cc.Sprite).spriteFrame = "";
			return;
		}
		var cardListNode = ShowNode.getChildByName("cardlist");
		var CPGPrefab = cc.instantiate(this.CPGPrefab);
		var cardNode = cc.instantiate(this.max_cardPrefab);
		CPGPrefab.getChildByName("layout").addChild(cardNode);
		this.ShowCard(handCard, cardNode, true);
		cardListNode.addChild(CPGPrefab);
		this.jiesuan.getChildByName("Hu").active = true;
	},
	//显示poker牌
	ShowCard: function ShowCard(cardType, cardNode) {
		var isHu = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

		this.GetPokeCard(cardType, cardNode, isHu);
		cardNode.active = true;
		cardNode.getChildByName("poker_back").active = false;
	},
	GetPokeCard: function GetPokeCard(poker, cardNode, isHu) {
		if (0 == poker) {
			return;
		}
		var type = "";
		var type1 = "";
		var type2 = "";
		var num = "";
		var cardColor = this.GetCardColor(poker);
		var cardValue = this.GetCardValue(poker);
		var numNode = cardNode.getChildByName("num");
		numNode.active = true;
		if (cardValue == 1) {
			cardValue = 14;
		}
		if (cardColor == 0) {
			//方块
			type = "bg_diamond1_";
			type1 = type + 1;
			type2 = type + 2;
			// if (cardValue > 10) {
			if (cardValue > 10 && cardValue < 14) {
				type1 = "";
				type2 = "bg_diamond_" + cardValue;
				// type2 = "bg_red_" + cardValue;
			}
			num = "red_" + cardValue;
		} else if (cardColor == 16) {
			//桃花
			type = "bg_club1_";
			type1 = type + 1;
			type2 = type + 2;
			// if (cardValue > 10) {
			if (cardValue > 10 && cardValue < 14) {
				type1 = "";
				type2 = "bg_club_" + cardValue;
				// type2 = "bg_blue_" + cardValue;
			}
			num = "black_" + cardValue;
		} else if (cardColor == 32) {
			//红心
			type = "bg_heart1_";
			type1 = type + 1;
			type2 = type + 2;
			// if (cardValue > 10) {
			if (cardValue > 10 && cardValue < 14) {
				type1 = "";
				type2 = "bg_heart_" + cardValue;
				// type2 = "bg_red_" + cardValue;
			}
			num = "red_" + cardValue;
		} else if (cardColor == 48) {
			//桃心
			type = "bg_spade1_";
			type1 = type + 1;
			type2 = type + 2;
			// if (cardValue > 10) {
			if (cardValue > 10 && cardValue < 14) {
				type1 = "";
				type2 = "bg_spade_" + cardValue;
				// type2 = "bg_blue_" + cardValue;
			}
			num = "black_" + cardValue;
		} else if (cardColor == 64) {
			numNode.active = false;
			if (cardValue % 2 == 1) {
				type1 = "icon_small_king_01";
				type2 = "icon_small_king";
			} else if (cardValue % 2 == 0) {
				type1 = "icon_big_king_01";
				type2 = "icon_big_king";
			}
		}
		var numSp = cardNode.getChildByName("num").getComponent(cc.Sprite);
		var iconSp = cardNode.getChildByName("icon").getComponent(cc.Sprite);
		var icon1_Sp = cardNode.getChildByName("icon_1").getComponent(cc.Sprite);
		cardNode.getChildByName("img_hupai").active = isHu;
		numSp.spriteFrame = this.PokerCard.pokerDict[num];
		iconSp.spriteFrame = this.PokerCard.pokerDict[type1];
		icon1_Sp.spriteFrame = this.PokerCard.pokerDict[type2];
	},
	//获取牌值
	GetCardValue: function GetCardValue(poker) {
		return poker & this.PokerCard.LOGIC_MASK_VALUE;
	},

	//获取花色
	GetCardColor: function GetCardColor(poker) {
		while (poker >= 256) {
			poker -= 256;
		}
		var color = poker & this.PokerCard.LOGIC_MASK_COLOR;
		return color;
	},
	GetWndNode: function GetWndNode(wndPath) {
		var wndNode = cc.find(wndPath, this.node);
		if (!wndNode) {
			this.ErrLog("GetWndNode(%s) not find", wndPath);
			return;
		}
		return wndNode;
	},
	/*
 鬼牌排序在最左侧；
 有多张相同点数的牌，按照张数排序，张数多的排序在左；
 单牌可以组成十四点的放置在一起；
 多个组成十四点的牌，则按组成十四点的牌中点数大的牌在左侧；
 无法组成十四点的单牌，按照牌的点数从大到小排序；
 同点数的牌按花色排序：黑桃、红桃、梅花、方块；*/
	SortShouCard: function SortShouCard(cardIDList) {
		var GuiPai = [];
		var NewPai = [];
		var DanPai = [];
		var _t = this;
		var countList = [];
		if (cardIDList[0] == 0) {
			return cardIDList;
		}
		for (var i = 0; i < cardIDList.length; i++) {
			var cardColor = this.GetCardColor(cardIDList[i]);
			var cardValue = this.GetCardValue(cardIDList[i]);
			if ("64" == cardColor) {
				GuiPai.push(cardIDList[i]);
			} else {
				NewPai.push(cardIDList[i]);
				if (countList[cardValue]) {
					countList[cardValue]["num"]++;
				} else {
					countList[cardValue] = [];
					countList[cardValue]["num"] = 1;
					countList[cardValue]["cardValue"] = cardValue;
					countList[cardValue]["poker"] = cardIDList[i];
				}
			}
		}
		//先添加鬼牌在最左边start
		GuiPai.sort(function (a, b) {
			return (b & 0x0F) - (a & 0x0F);
		});
		var Sortpokers = [];
		for (var _i = 0; _i < GuiPai.length; _i++) {
			Sortpokers.push(GuiPai[_i]);
		}
		//先添加鬼牌在最左边finish
		countList.sort(function (a, b) {
			if (b.num == a.num) {
				return b.cardValue - a.cardValue;
			}
			return b.num - a.num;
		});

		NewPai.sort(function (a, b) {
			var avalue = _t.PokerCard.GetCardValue(a);
			var bvalue = _t.PokerCard.GetCardValue(b);
			if (avalue == bvalue) {
				var aColor = _t.PokerCard.GetCardColor(a);
				var bColor = _t.PokerCard.GetCardColor(b);
				return bColor - aColor;
			} else {
				return (b & 0x0F) - (a & 0x0F);
			}
		});
		for (var j = 0; j < countList.length; j++) {
			if (countList[j]) {
				var cardNum = countList[j]["num"]; // 0,3 1,1
				if (cardNum > 1) {
					for (var k = 0; k < NewPai.length; k++) {
						var NewPaiVal = this.GetCardValue(NewPai[k]);
						var countVal = countList[j]["cardValue"];
						if (NewPaiVal == countVal) {
							Sortpokers.push(NewPai[k]);
						}
					}
				} else if (cardNum == 1) {
					DanPai.push(countList[j]["poker"]);
				}
			}
		}

		var result = [];
		var allResult = [];
		var allResultCount = [];
		DanPai.sort(function (a, b) {
			return b.cardValue - a.cardValue;
		});
		var copyDanPai = this.ComTool.DeepCopy(DanPai);
		for (var l = 0; l < copyDanPai.length; l++) {
			for (var _i2 = l + 1; _i2 < copyDanPai.length; _i2++) {
				var value = this.GetCardValue(copyDanPai[l]);
				var target = this.GetCardValue(copyDanPai[_i2]);
				if (value + target == 14) {
					allResult.push([copyDanPai[l], copyDanPai[_i2]]);
				}
			}
		}
		for (var _i3 = 0; _i3 < allResult.length; _i3++) {
			for (var _j = 0; _j < allResult[_i3].length; _j++) {
				allResultCount.push(allResult[_i3][_j]);
			}
		}
		for (var _i4 = 0; _i4 < copyDanPai.length; _i4++) {
			if (allResultCount.indexOf(copyDanPai[_i4]) < 0) {
				result.push(copyDanPai[_i4]);
			}
		}

		console.log("forEach", result, allResult, allResultCount);
		for (var m = 0; m < allResult.length; m++) {
			for (var n = 0; n < allResult[m].length; n++) {
				var poker = allResult[m][n];
				Sortpokers.push(poker);
			}
		}
		for (var o = 0; o < result.length; o++) {
			Sortpokers.push(result[o]);
		}
		return Sortpokers;
	}
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=aydss_winlost_child.js.map
        