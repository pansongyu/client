var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {

    },
    OnCreateInit: function () {

    },

    OnShow: function (callback, maPai) {
		this.LOGIC_MASK_COLOR = 0xF0;
		this.LOGIC_MASK_VALUE = 0x0F;
		this.PokerCard = app.PokerCard();
        this.callback = callback
        this.maPai = maPai
        var layout = this.node.getChildByName("bg_create").getChildByName("layout")
        const card = this.node.getChildByName("bg_create").getChildByName("card")
        layout.destroyAllChildren()
        for (let i = 3; i >= 0; i--) {
            for (let index = 2; index <= 14; index++) {
                let n = cc.instantiate(card)
                n.active = true
                n.parent = layout
                this.ShowCard(i*16+index, n);
                n.name = "" + (i*16+index)
                if (this.maPai == i*16+index) {
                    this.OnClick(n.name, n)
                }
            }
        }
        this.UpdateTxt()
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
    ShowCard: function (cardType, node) {
		let newPoker = this.PokerCard.SubCardValue(cardType);
		this.GetPokeCard(newPoker, node);
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
		numSp.spriteFrame = this.PokerCard.pokerDict[num];
		iconSp.spriteFrame = this.PokerCard.pokerDict[type1];
		icon1_Sp.spriteFrame = this.PokerCard.pokerDict[type2];
	},
	//获取牌值
	GetCardValue: function (poker) {
		return poker & this.PokerCard.LOGIC_MASK_VALUE;
	},

    OnClick: function (btnName, btnNode) {
        for (let index = 0; index < btnNode.parent.children.length; index++) {
            const element = btnNode.parent.children[index];
            element.getChildByName("bg_poker").color = cc.color(255,255,255)
        }
        btnNode.getChildByName("bg_poker").color = cc.color(200,200,0)
        this.maPai = Number(btnName)
        this.UpdateTxt()
    },
    OnSure : function () {
        if (!this.maPai) {
            app.SysNotifyManager().ShowSysMsg("请选择一个马牌", [], 3);
            return
        }
        if (this.callback) {
            this.callback(this.maPai)
        }
        this.CloseForm()
    },
    UpdateTxt : function () {
        let lb = this.node.getChildByName("bg_create").getChildByName("tip").getComponent(cc.Label)
        if (!this.maPai) {
            lb.string = "当前马牌：未选择"
            return
        }
        let colors = {0:"方块", 1:"梅花", 2:"红桃",3:"黑桃"}
        let values = {11:"J", 12:"Q", 13:"K", 14:"A"}
        let name = "当前马牌：" + (colors[Math.floor(this.maPai/16)] || "") + (values[this.maPai%16] || this.maPai%16)
        lb.string = name
    },
});
