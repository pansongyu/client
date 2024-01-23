"use strict";
cc._RF.push(module, 'cab8cwehnJFcYrzQklGyky9', 'bjpk_winlost_child');
// script/ui/uiGame/bjpk/bjpk_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
	extends: require("BasePoker_winlost_child"),

	properties: {
		cardPrefab: cc.Prefab,
		icon_specialtype: [cc.SpriteFrame],
		prefab_specialtype: cc.Prefab
	},

	// use this for initialization
	OnLoad: function OnLoad() {
		this.LOGIC_MASK_COLOR = 0xF0;
		this.LOGIC_MASK_VALUE = 0x0F;
		this.PokerCard = app.PokerCard();
		console.log("pokercard", this.PokerCard);
	},
	ShowSpecData: function ShowSpecData(setEnd, playerAll, index) {
		console.log("单局结算数据", setEnd, playerAll, index);
		this.CreateSpecialTypeNode();
		var player = setEnd.posResultList[index];
		//倍数
		//this.node.getChildByName("lb_beiShu").active = true;
		//let beishu = this.node.getChildByName("lb_beiShu").getComponent(cc.Label);

		//beishu.string = player.doubleNum;
		var point = player["allScore"];
		//玩家分数
		var winNode = this.node.getChildByName("lb_win_num");
		var loseNode = this.node.getChildByName("lb_lose_num");
		winNode.active = false;
		loseNode.active = false;

		if (point > 0) {
			winNode.active = true;
			winNode.getComponent(cc.Label).string = "+" + point;
		} else {
			loseNode.active = true;
			loseNode.getComponent(cc.Label).string = point;
		}
		//底分
		this.node.getChildByName("lb_difen").active = false;
		/*let difen = this.node.getChildByName("lb_difen").getComponent(cc.Label);
  difen.string = player.baseMark;*/
		this.ShowQiPai(false);

		//显示底牌
		var cardNode = this.node.getChildByName("card");
		var rankeds = setEnd.rankeds[index];
		console.log("服务端传过来的数据", setEnd.rankeds);
		var dunPos = rankeds["dunPos"];
		var special = rankeds["special"];
		var specialName = rankeds["specialName"];
		var specialNode = cardNode.getChildByName("special_card");
		specialNode.active = false;
		specialNode.getComponent(cc.Sprite).spriteFrame = "";
		/*if (special != -1) {
  	//显示特殊牌型
  	specialNode.getComponent(cc.Sprite).spriteFrame = "";
  	specialNode.active = true;
  }
  if (specialName) {
  	specialNode.getComponent(cc.Sprite).spriteFrame = "";
  	specialNode.active = true;
  }*/

		if (setEnd.zjid == player.pid) {
			cardNode.getChildByName("zhuangjia").active = true;
		}
		var allCards = dunPos.first.concat(dunPos.second, dunPos.third);
		if (allCards.length == 0) {
			allCards = [0, 0, 0, 0, 0, 0, 0, 0, 0];
			this.ShowQiPai(true);
		}
		var rewards = player["rewards"];
		if (rewards.length > 0) {
			this.ShowSpecialType(rewards);
		}
		for (var j = 0; j < cardNode.children.length; j++) {
			var child = cardNode.children[j];
			if (child.name == "zhuangjia" || child.name == "beishu" || child.name == "special_card") {
				continue;
			}
			if (!child.getChildByName("cardPrefab")) {
				var card = cc.instantiate(this.cardPrefab);
				child.addChild(card);
				this.ShowCard(allCards[j], card);
			} else {
				var _card = child.getChildByName("cardPrefab");
				this.ShowCard(allCards[j], _card);
			}
		}
	},
	ShowCard: function ShowCard(cardType, node) {
		// let newPoker = this.PokerCard.SubCardValue(cardType);
		this.GetPokeCard(cardType, node);
		if (cardType == 0) {
			node.getChildByName("poker_back").active = true;
		} else {
			node.getChildByName("poker_back").active = false;
		}
	},
	ShowQiPai: function ShowQiPai(isQiPai) {
		this.node.getChildByName("img_qp").active = isQiPai;
	},
	ShowSpecialType: function ShowSpecialType(rewards) {
		for (var i = 0; i < rewards.length; i++) {
			var reward = rewards[i];
			this.node.getChildByName("cardtypelayout").getChildByName(reward + "").active = true;
		}
	},
	CreateSpecialTypeNode: function CreateSpecialTypeNode() {
		var cardtypelayout = this.node.getChildByName("cardtypelayout");
		cardtypelayout.removeAllChildren();
		var name = 20;
		for (var j = 0; j < 13; j++) {
			var cardNode = cc.instantiate(this.prefab_specialtype);
			cardNode.name = name + "";
			cardNode.getComponent(cc.Sprite).spriteFrame = this.icon_specialtype[j];
			cardtypelayout.addChild(cardNode);
			cardNode.active = false;
			name++;
		}
	},
	GetPokeCard: function GetPokeCard(poker, cardNode) {
		var isShowIcon1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
		var isShowLandowner = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
		var hideBg = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

		if (0 == poker) {
			cardNode.getChildByName("poker_back").active = true;
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