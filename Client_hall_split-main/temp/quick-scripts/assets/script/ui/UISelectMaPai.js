(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/UISelectMaPai.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ae68av6n4dBsrggbSXQGw3G', 'UISelectMaPai', __filename);
// script/ui/UISelectMaPai.js

"use strict";

var _cc$Class;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var app = require("app");

cc.Class((_cc$Class = {
	extends: require("BaseForm"),

	properties: {},
	OnCreateInit: function OnCreateInit() {},

	OnShow: function OnShow(callback, maPai) {
		this.LOGIC_MASK_COLOR = 0xF0;
		this.LOGIC_MASK_VALUE = 0x0F;
		this.PokerCard = app.PokerCard();
		this.callback = callback;
		this.maPai = maPai;
		var layout = this.node.getChildByName("bg_create").getChildByName("layout");
		var card = this.node.getChildByName("bg_create").getChildByName("card");
		layout.destroyAllChildren();
		for (var i = 3; i >= 0; i--) {
			for (var index = 2; index <= 14; index++) {
				var n = cc.instantiate(card);
				n.active = true;
				n.parent = layout;
				this.ShowCard(i * 16 + index, n);
				n.name = "" + (i * 16 + index);
				if (this.maPai == i * 16 + index) {
					this.OnClick(n.name, n);
				}
			}
		}
		this.UpdateTxt();
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
	ShowCard: function ShowCard(cardType, node) {
		var newPoker = this.PokerCard.SubCardValue(cardType);
		this.GetPokeCard(newPoker, node);
	},
	GetPokeCard: function GetPokeCard(poker, cardNode) {
		var isShowIcon1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
		var isShowLandowner = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
		var hideBg = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
		var isRazz = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
		var isPartnerCard = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;

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
		numSp.spriteFrame = this.PokerCard.pokerDict[num];
		iconSp.spriteFrame = this.PokerCard.pokerDict[type1];
		icon1_Sp.spriteFrame = this.PokerCard.pokerDict[type2];
	}
}, _defineProperty(_cc$Class, "GetCardValue", function GetCardValue(poker) {
	return poker & this.PokerCard.LOGIC_MASK_VALUE;
}), _defineProperty(_cc$Class, "OnClick", function OnClick(btnName, btnNode) {
	for (var index = 0; index < btnNode.parent.children.length; index++) {
		var element = btnNode.parent.children[index];
		element.getChildByName("bg_poker").color = cc.color(255, 255, 255);
	}
	btnNode.getChildByName("bg_poker").color = cc.color(200, 200, 0);
	this.maPai = Number(btnName);
	this.UpdateTxt();
}), _defineProperty(_cc$Class, "OnSure", function OnSure() {
	if (!this.maPai) {
		app.SysNotifyManager().ShowSysMsg("请选择一个马牌", [], 3);
		return;
	}
	if (this.callback) {
		this.callback(this.maPai);
	}
	this.CloseForm();
}), _defineProperty(_cc$Class, "UpdateTxt", function UpdateTxt() {
	var lb = this.node.getChildByName("bg_create").getChildByName("tip").getComponent(cc.Label);
	if (!this.maPai) {
		lb.string = "当前马牌：未选择";
		return;
	}
	var colors = { 0: "方块", 1: "梅花", 2: "红桃", 3: "黑桃" };
	var values = { 11: "J", 12: "Q", 13: "K", 14: "A" };
	var name = "当前马牌：" + (colors[Math.floor(this.maPai / 16)] || "") + (values[this.maPai % 16] || this.maPai % 16);
	lb.string = name;
}), _cc$Class));

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
        //# sourceMappingURL=UISelectMaPai.js.map
        