"use strict";
cc._RF.push(module, '441b5lde8hB3JzmfxEWQM1v', 'fjsss_winlost_child');
// script/ui/uiGame/fjsss/fjsss_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
	extends: require("BasePoker_winlost_child"),

	properties: {
		cardPrefab: cc.Prefab
	},

	// use this for initialization
	OnLoad: function OnLoad() {
		this.LOGIC_MASK_COLOR = 0xF0;
		this.LOGIC_MASK_VALUE = 0x0F;
		this.PokerCard = app.PokerCard();
		this.Type = { //CardType
			0: "乌隆",
			1: "对子",
			2: "两对",
			3: "三条",
			4: "充扎",
			5: "爽枉充投",
			6: "叁贵",
			7: "顺子",
			8: "同花",
			9: "一对同花",
			10: "两对同花",
			11: "葫芦",
			12: "铁支",
			13: "同花顺",
			14: "五同",
			15: "六同",
			16: "五鬼",

			84: "三顺子",
			85: "三同花",
			86: "六对半",
			87: "三顺子",
			88: "三同花",
			89: "六对半",
			90: "六对半",
			91: "四套三条",
			92: "三分天下",
			93: "三同花顺",
			94: "一条龙",
			100: "至尊清龙"
		};
		console.log("pokercard", this.PokerCard);
	},
	ShowSpecData: function ShowSpecData(setEnd, playerAll, index) {
		//console.log("单局结算数据", setEnd, playerAll, index);
		var player = setEnd.posResultList[index];
		//倍数
		//this.node.getChildByName("lb_beiShu").active = true;
		//let beishu = this.node.getChildByName("lb_beiShu").getComponent(cc.Label);

		//beishu.string = player.doubleNum;

		//底分
		this.node.getChildByName("lb_difen").active = true;
		var difen = this.node.getChildByName("lb_difen").getComponent(cc.Label);
		difen.string = player.baseMark;

		//显示底牌
		var cardNode = this.node.getChildByName("card");
		var rankeds = setEnd.rankeds[index];
		console.log("服务端传过来的数据", setEnd.rankeds);

		//倍数
		var beishu = rankeds["beiShu"];
		this.node.getChildByName("lb_beiShu").active = true;
		this.node.getChildByName("lb_beiShu").getComponent(cc.Label).string = beishu;

		var dunPos = rankeds.dunPos;
		var special = rankeds.special;
		var specialNode = cardNode.getChildByName("special_card");
		var mapai = setEnd.mapai["key"];
		console.log("马牌：", setEnd.mapai["key"]);
		specialNode.active = false;
		specialNode.children[0].getComponent(cc.Label).string = "";
		if (special != -1) {
			//显示特殊牌型
			specialNode.active = true;
			specialNode.children[0].getComponent(cc.Label).string = this.Type[special];
		}

		cardNode.getChildByName("zhuangjia").active = setEnd.zjid == player.pid;

		var allCards = dunPos.first.concat(dunPos.second, dunPos.third);
		for (var j = 0; j < cardNode.children.length; j++) {
			var child = cardNode.children[j];
			if (child.name == "zhuangjia" || child.name == "beishu" || child.name == "special_card") {
				continue;
			}
			if (!child.getChildByName("cardPrefab")) {
				var card = cc.instantiate(this.cardPrefab);
				child.addChild(card);
				this.ShowCard(allCards[j], card, mapai);
			} else {
				var _card = child.getChildByName("cardPrefab");
				this.ShowCard(allCards[j], _card, mapai);
			}
		}
	},
	ShowCard: function ShowCard(cardType, node, mapai) {
		var isMapai = cardType == mapai ? true : false;

		var newPoker = this.PokerCard.SubCardValue(cardType);

		// console.log("是马牌");
		console.log(cardType);
		console.log(newPoker);

		this.GetPokeCard(newPoker, node, isMapai);
		node.getChildByName("poker_back").active = false;
	},
	GetPokeCard: function GetPokeCard(poker, cardNode, isMapai) {
		var isShowIcon1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
		var isShowLandowner = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
		var hideBg = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
		var isRazz = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
		var isPartnerCard = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;

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
		if (cardColor == 0) {
			type = "bg_diamond1_";
			type1 = type + 1;
			type2 = type + 2;
			// if (cardValue > 10) {
			if (cardValue > 10 && cardValue < 14) {
				type2 = "bg_red_" + cardValue;
				// type1 = "";
				// type2 = "bg_diamond_" + cardValue;
			}
			num = "red_" + cardValue;
		} else if (cardColor == 16) {
			type = "bg_club1_";
			type1 = type + 1;
			type2 = type + 2;
			// if (cardValue > 10) {
			if (cardValue > 10 && cardValue < 14) {
				type2 = "bg_blue_" + cardValue;
				// type1 = "";
				// type2 = "bg_club_" + cardValue;
			}
			num = "black_" + cardValue;
		} else if (cardColor == 32) {
			type = "bg_heart1_";
			type1 = type + 1;
			type2 = type + 2;
			// if (cardValue > 10) {
			if (cardValue > 10 && cardValue < 14) {
				type2 = "bg_red_" + cardValue;
				// type1 = "";
				// type2 = "bg_heart_" + cardValue;
			}
			num = "red_" + cardValue;
		} else if (cardColor == 48) {
			type = "bg_spade1_";
			type1 = type + 1;
			type2 = type + 2;
			// if (cardValue > 10) {
			if (cardValue > 10 && cardValue < 14) {
				type2 = "bg_blue_" + cardValue;
				// type1 = "";
				// type2 = "bg_spade_" + cardValue;
			}
			num = "black_" + cardValue;
		} else if (cardColor == 64) {
			//双数小鬼   0x42-0x4e
			numNode.active = false; //2,3,4,5,6,7,8,9,a
			if (cardValue % 2 == 0) {
				//双数小鬼
				type1 = "icon_small_king_01";
				type2 = "icon_small_king";
			} else if (cardValue % 2 == 1) {
				//单数大鬼
				type1 = "icon_big_king_01";
				type2 = "icon_big_king";
			}
		}
		var numSp = cardNode.getChildByName("num").getComponent(cc.Sprite);
		var iconSp = cardNode.getChildByName("icon").getComponent(cc.Sprite);
		var icon1_Sp = cardNode.getChildByName("icon_1").getComponent(cc.Sprite);
		/*numSp.spriteFrame = this.pokerAtlas.getSpriteFrame(num);
  iconSp.spriteFrame = this.pokerAtlas.getSpriteFrame(type1);
  icon1_Sp.spriteFrame = this.pokerAtlas.getSpriteFrame(type2);*/
		numSp.spriteFrame = this.PokerCard.pokerDict[num];
		iconSp.spriteFrame = this.PokerCard.pokerDict[type1];
		icon1_Sp.spriteFrame = this.PokerCard.pokerDict[type2];
		if (hideBg) {
			cardNode.getChildByName("poker_back").active = false;
		}
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
	}
});

cc._RF.pop();