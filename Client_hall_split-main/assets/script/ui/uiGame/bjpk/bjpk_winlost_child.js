/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BasePoker_winlost_child"),

	properties: {
		cardPrefab: cc.Prefab,
		icon_specialtype: [cc.SpriteFrame],
		prefab_specialtype: cc.Prefab,
	},

	// use this for initialization
	OnLoad: function () {
		this.LOGIC_MASK_COLOR = 0xF0;
		this.LOGIC_MASK_VALUE = 0x0F;
		this.PokerCard = app.PokerCard();
		console.log("pokercard", this.PokerCard)

	},
	ShowSpecData: function (setEnd, playerAll, index) {
		console.log("单局结算数据", setEnd, playerAll, index);
		this.CreateSpecialTypeNode();
		let player = setEnd.posResultList[index];
		//倍数
		//this.node.getChildByName("lb_beiShu").active = true;
		//let beishu = this.node.getChildByName("lb_beiShu").getComponent(cc.Label);

		//beishu.string = player.doubleNum;
		let point = player["allScore"];
		//玩家分数
		let winNode = this.node.getChildByName("lb_win_num");
		let loseNode = this.node.getChildByName("lb_lose_num");
		winNode.active = false;
		loseNode.active = false;

		if (point > 0) {
			winNode.active = true;
			winNode.getComponent(cc.Label).string = "+" + point;
		}
		else {
			loseNode.active = true;
			loseNode.getComponent(cc.Label).string = point;
		}
		//底分
		this.node.getChildByName("lb_difen").active = false;
		/*let difen = this.node.getChildByName("lb_difen").getComponent(cc.Label);
		difen.string = player.baseMark;*/
		this.ShowQiPai(false);

		//显示底牌
		let cardNode = this.node.getChildByName("card");
		let rankeds = setEnd.rankeds[index];
		console.log("服务端传过来的数据", setEnd.rankeds);
		let dunPos = rankeds["dunPos"];
		let special = rankeds["special"];
		let specialName = rankeds["specialName"];
		let specialNode = cardNode.getChildByName("special_card");
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
		let allCards = dunPos.first.concat(dunPos.second, dunPos.third);
		if (allCards.length == 0) {
			allCards = [0, 0, 0, 0, 0, 0, 0, 0, 0];
			this.ShowQiPai(true);
		}
		let rewards = player["rewards"];
		if (rewards.length > 0) {
			this.ShowSpecialType(rewards);
		}
		for (let j = 0; j < cardNode.children.length; j++) {
			let child = cardNode.children[j];
			if (child.name == "zhuangjia" ||
				child.name == "beishu" ||
				child.name == "special_card") {
				continue;
			}
			if (!child.getChildByName("cardPrefab")) {
				let card = cc.instantiate(this.cardPrefab);
				child.addChild(card);
				this.ShowCard(allCards[j], card);
			} else {
				let card = child.getChildByName("cardPrefab");
				this.ShowCard(allCards[j], card);
			}
		}
	},
	ShowCard: function (cardType, node) {
		// let newPoker = this.PokerCard.SubCardValue(cardType);
		this.GetPokeCard(cardType, node);
		if (cardType == 0) {
			node.getChildByName("poker_back").active = true;
		} else {
			node.getChildByName("poker_back").active = false;
		}
	},
	ShowQiPai: function (isQiPai) {
		this.node.getChildByName("img_qp").active = isQiPai;
	},
	ShowSpecialType: function (rewards) {
		for (let i = 0; i < rewards.length; i++) {
			let reward = rewards[i];
			this.node.getChildByName("cardtypelayout").getChildByName(reward + "").active = true;
		}
	},
	CreateSpecialTypeNode: function () {
		let cardtypelayout = this.node.getChildByName("cardtypelayout");
		cardtypelayout.removeAllChildren();
		let name = 20;
		for (let j = 0; j < 13; j++) {
			let cardNode = cc.instantiate(this.prefab_specialtype);
			cardNode.name = name + "";
			cardNode.getComponent(cc.Sprite).spriteFrame = this.icon_specialtype[j];
			cardtypelayout.addChild(cardNode);
			cardNode.active = false;
			name++;
		}
	},
	GetPokeCard: function (poker, cardNode, isShowIcon1 = true, isShowLandowner = false, hideBg = false) {
		if (0 == poker) {
			cardNode.getChildByName("poker_back").active = true;
			return;
		}
		let type = "";
		let type1 = "";
		let type2 = "";
		let num = "";
		let cardColor = this.GetCardColor(poker);
		let cardValue = this.GetCardValue(poker);
		let numNode = cardNode.getChildByName("num");
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
		} else if (cardColor == 64) {//双数小鬼   0x42-0x4e
			numNode.active = false;//2,3,4,5,6,7,8,9,a
			if (cardValue % 2 == 0) {//双数小鬼
				type1 = "icon_small_king_01";
				type2 = "icon_small_king";
			} else if (cardValue % 2 == 1) {//单数大鬼
				type1 = "icon_big_king_01";
				type2 = "icon_big_king";
			}
		}
		let numSp = cardNode.getChildByName("num").getComponent(cc.Sprite);
		let iconSp = cardNode.getChildByName("icon").getComponent(cc.Sprite);
		let icon1_Sp = cardNode.getChildByName("icon_1").getComponent(cc.Sprite);
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
	GetCardValue: function (poker) {
		return poker & this.PokerCard.LOGIC_MASK_VALUE;
	},

	//获取花色
	GetCardColor: function (poker) {
		while (poker >= 256) {
			poker -= 256;
		}
		let color = poker & this.PokerCard.LOGIC_MASK_COLOR;
		return color;
	},
});