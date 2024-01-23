var app = require("fjssz_app");

var PokerCard = app.BaseClass.extend({

	/**
	 * 构造函数
	 */
	Init: function () {
		this.JS_Name = "PokerCard";
		this.pokerDict = {};
		this.LOGIC_MASK_COLOR = 0xF0;
		this.LOGIC_MASK_VALUE = 0x0F;

		this.LOGIC_MASK_XIAOWANG = 16;
		this.LOGIC_MASK_DAWANG = 17;
		this.NNConst_BeiShu = [[0, 1, 1, 1, 1, 1, 1, 2, 2, 3, 4, 5, 6, 8], [0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 5, 6, 8]];//牌型倍数
		this.LoadAllPokerRes();
	},

	SubCardValue: function (poker) {
		let temp = "";
		if (poker.length > 4) {
			temp = poker;
			temp = temp.substring(0, temp.length - 1);
		} else {
			temp = poker;
		}
		return temp;
	},

	GetPokeCard: function (poker, cardNode, isShowIcon1 = true, isShowLandowner = false, hideBg = false, isRazz = false, isPartnerCard = false) {
		if (0 == poker) {
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
			num = "red_" + cardValue;
		} else if (cardColor == 16) {
			type = "bg_club1_";
			type1 = type + 1;
			type2 = type + 2;
			num = "black_" + cardValue;
		} else if (cardColor == 32) {
			type = "bg_heart1_";
			type1 = type + 1;
			type2 = type + 2;
			num = "red_" + cardValue;
		} else if (cardColor == 48) {
			type = "bg_spade1_";
			type1 = type + 1;
			type2 = type + 2;
			num = "black_" + cardValue;
		} else if (cardColor == 64) {//双数小鬼   0x42-0x4e
			numNode.active = false;//2,3,4,5,6,7,8,9,a
			if (cardValue % 2 == 0) {//双数小鬼
				type2 = "icon_small_king_01";
				type1 = "icon_small_king";
			} else if (cardValue % 2 == 1) {//单数大鬼
				type2 = "icon_big_king_01";
				type1 = "icon_big_king";
			}
		}
		let numSp = cardNode.getChildByName("num").getComponent(cc.Sprite);
		let iconSp = cardNode.getChildByName("icon").getComponent(cc.Sprite);
		let icon1_Sp = cardNode.getChildByName("icon_1").getComponent(cc.Sprite);
		numSp.spriteFrame = this.pokerDict[num];
		iconSp.spriteFrame = this.pokerDict[type1];
		icon1_Sp.spriteFrame = this.pokerDict[type2];
		if (hideBg) {
			cardNode.getChildByName("poker_back").active = false;
		}
		for (let index = 0; index < cardNode.children.length; index++) {
			const element = cardNode.children[index];
			if (element.name == "icon_mapai" || element.name == "bg_poker") {
				element.zIndex = 0
			}
			else if (element.name == "poker_back" || element.name == "tag") {
				element.zIndex = 3
			}
			else{
				element.zIndex = 2
			}
		}

		icon1_Sp.type = cc.Sprite.Type.SIMPLE
		iconSp.type = cc.Sprite.Type.SIMPLE
		icon1_Sp.sizeMode = cc.Sprite.SizeMode.RAW
		iconSp.sizeMode = cc.Sprite.SizeMode.RAW
		if (cardColor == 64) {
			icon1_Sp.node.scale = 0.7
			icon1_Sp.node.y = 12
			icon1_Sp.node.x = -35
			iconSp.node.scale = 0.56
			iconSp.node.y = 3
			iconSp.node.x = 15
		}
		else{
			icon1_Sp.node.scale = 0.5
			icon1_Sp.node.y = 26
			icon1_Sp.node.x = -38
			iconSp.node.scale = 0.5
			iconSp.node.y = -25
			iconSp.node.x = 17
			if (cardValue == 10) {
				numSp.node.width = 28
			}
			else{
				numSp.node.width = 22
			}
		}
	},
	LoadAllPokerRes: function () {
		let self = this;
		if (!this.pokerDict) {
			return;
		}
		cc.loader.loadResDir("texture/new_poker", cc.SpriteFrame, function (err, assets) {
			if (err) {
				cc.error(err);
				return;
			}
			for (let i = 0; i < assets.length; i++) {
				self.pokerDict[assets[i]._name] = assets[i];
			}
		});
	},
	//获取牌值
	GetCardValue: function (poker) {
		return poker & this.LOGIC_MASK_VALUE;
	},

	//获取花色
	GetCardColor: function (poker) {
		while (poker >= 256) {
			poker -= 256;
		}
		let color = poker & this.LOGIC_MASK_COLOR;
		return color;
	},
});

var g_PokerCard = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_PokerCard) {
		g_PokerCard = new PokerCard();
	}
	return g_PokerCard;
};