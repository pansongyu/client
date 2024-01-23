(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/nn/nn_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2977e92c7xIJotgP+b3An4j', 'nn_winlost_child', __filename);
// script/ui/uiGame/nn/nn_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
	extends: require("BasePoker_winlost_child"),

	properties: {
		cardPrefab: cc.Prefab,
		sp_cardBack: [cc.SpriteFrame]
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
		console.log("单局结算数据", setEnd, playerAll, index);
		var player = setEnd.posResultList[index];
		//倍数
		//this.node.getChildByName("lb_beiShu").active = true;
		//let beishu = this.node.getChildByName("lb_beiShu").getComponent(cc.Label);

		//beishu.string = player.doubleNum;

		//底分
		this.node.getChildByName("lb_difen").active = false;
		// let difen = this.node.getChildByName("lb_difen").getComponent(cc.Label);
		// difen.string = player.baseMark;


		//显示底牌
		var cardNode = this.node.getChildByName("card");
		cardNode.active = false;
		for (var i = 0; i < cardNode.children.length; i++) {
			cardNode.children[i].active = false;
		}
		var lb_point_win = this.node.getChildByName("lb_win_num");
		var lb_point_lose = this.node.getChildByName("lb_lose_num");
		this.GetLabelByNode(lb_point_win).string = "";
		this.GetLabelByNode(lb_point_lose).string = "";
		this.node.getChildByName("user_info").getChildByName("fangzhu").active = player["isOwner"];
		// let isQiPai = player["isQiPai"];
		// this.node.getChildByName("jiegou").active = player["isJieGuo"];
		// if (isQiPai) {
		// 	let qiPai = -4;
		// 	let cardList = [];
		// 	for (let i = 0; i < player["privateCards"].length; i++) {
		// 		cardList.push(0);
		// 	}
		// 	this.ShowPrivateCards(cardList, isQiPai);
		// 	this.ShowChipValue(qiPai);
		// } else {
		this.ShowPrivateCards(player["cardList"]);
		// this.ShowChipValue(player["value"], player["isShowValue"]);
		var info = this.GetNNPokerTypeStr(player["crawType"]);
		this.node.getChildByName("cardType").getComponent(cc.Label).string = info.typeStr;
		// }

		this.ShowPointValue(player["point"]);
		/*//比赛分消耗
  console.log("比赛分消耗", player);
  let lb_sportsPoint = this.node.getChildByName("lb_sportsPointTitle").getChildByName("lb_sportsPoint");
  if (typeof(player["sportsPoint"]) != "undefined") {
  	if (sportsPoint > 0) {
  		lb_sportsPoint.getComponent(cc.Label).string = "比赛分:+" + sportsPoint;
  	} else {
  		lb_sportsPoint.getComponent(cc.Label).string = "比赛分:" + sportsPoint;
  	}
  	lb_sportsPoint.active = true;
  } else {
  	lb_sportsPoint.active = false;
  }*/
	},
	GetNNPokerTypeStr: function GetNNPokerTypeStr(curDataType) {
		curDataType = parseInt(curDataType);
		var data = {};
		data.typeStr = "";

		if (0 == curDataType) {
			//没牛
			data.typeStr = "无马";
		} else if (curDataType >= 1 && curDataType < 10) {
			//牛1到牛9
			data.typeStr = '牛';
			switch (curDataType) {
				case 1:
					data.typeStr += '一';
					break;
				case 2:
					data.typeStr += '二';
					break;
				case 3:
					data.typeStr += '三';
					break;
				case 4:
					data.typeStr += '四';
					break;
				case 5:
					data.typeStr += '五';
					break;
				case 6:
					data.typeStr += '六';
					break;
				case 7:
					data.typeStr += '七';
					break;
				case 8:
					data.typeStr += '八';
					break;
				case 9:
					data.typeStr += '九';
					break;
			}
		} else if (10 == curDataType) {
			data.typeStr = '羊羊';
		} else if (101 == curDataType) {
			data.typeStr = '';
		} else if (102 == curDataType) {
			data.typeStr = '';
		} else if (103 == curDataType) {
			data.typeStr = "伍花羊";
		} else if (104 == curDataType) {
			data.typeStr = "炸弹羊";
		} else if (105 == curDataType) {
			data.typeStr = "伍小羊";
		}
		return data;
	},
	ShowPrivateCards: function ShowPrivateCards(privateCards, isQiPai) {
		var cardList = this.node.getChildByName("card");
		cardList.active = true;
		for (var i = 0; i < privateCards.length; i++) {
			var cardValue = privateCards[i];
			var cardNode = cardList.children[i];
			cardNode.active = true;
			if (i + 1 == privateCards.length) {
				this.ShowCard(cardValue, cardNode, true, isQiPai);
			} else {
				this.ShowCard(cardValue, cardNode, false, isQiPai);
			}
		}
	},
	ShowChipValue: function ShowChipValue(value, isShowValue) {
		var lb_dianShu = this.node.getChildByName("lb_dianshu");
		var dianShu = "";
		if (isShowValue) {
			if (value == 0) {
				dianShu = "";
			}
			if (value > 0) {
				dianShu = value + "点";
			}
			if (value == -3) {
				dianShu = "大小王";
			}
			if (value == -2) {
				dianShu = "炸弹";
			}
			if (value == -1) {
				dianShu = "三条";
			}
		} else {
			dianShu = "";
			if (value == -4) {
				dianShu = "弃牌";
			}
		}
		this.GetLabelByNode(lb_dianShu).string = dianShu;
	},
	ShowPointValue: function ShowPointValue(setPoint) {
		var lb_point_win = this.node.getChildByName("lb_win_num");
		var lb_point_lose = this.node.getChildByName("lb_lose_num");
		if (setPoint > 0) {
			this.GetLabelByNode(lb_point_win).string = "+" + setPoint;
			lb_point_win.active = true;
			lb_point_lose.active = false;
		} else {
			this.GetLabelByNode(lb_point_lose).string = "+" + setPoint;
			lb_point_lose.active = true;
			lb_point_win.active = false;
		}
	},
	ShowCard: function ShowCard(cardType, node, isShowIcon1, isQiPai) {
		var newPoker = this.PokerCard.SubCardValue(cardType);
		this.GetPokeCard(newPoker, node, isShowIcon1);
		var poker_back = node.getChildByName("poker_back");
		poker_back.active = false;
		if (newPoker == 0) {
			var cardBack = this.sp_cardBack[0]; //默认蓝色的
			if (isQiPai) {
				cardBack = this.sp_cardBack[1]; //弃牌灰色的
			}
			poker_back.getComponent(cc.Sprite).spriteFrame = cardBack;
			poker_back.active = true;
		} else {
			poker_back.active = false;
		}
	},
	GetLabelByNode: function GetLabelByNode(node) {
		var label = node.getComponent(cc.Label);
		return label;
	},
	GetPokeCard: function GetPokeCard(poker, cardNode) {
		var hideBg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

		if (0 == poker) return;
		var type = "";
		var type_2 = "";
		var num = "";
		var cardColor = -1;
		var cardValue = -1;
		var isRed = true;

		cardColor = this.GetCardColor(poker);
		cardValue = this.GetCardValue(poker);

		if (cardColor != 64) {
			var numNode = cardNode.getChildByName("num");
			// if(0.5 == cardNode.anchorX && 0.5 == cardNode.anchorY){
			//     numNode.x = -35;
			//     numNode.y = 55;
			// }

			if (1 == cardValue) //服务端发过来的可能是1
				cardValue = 14;else if (15 == cardValue) //跑得快服务端发过来15转为2
				cardValue = 2;

			if (cardColor == 0) {
				type = 'bg_diamond1_1';
				type_2 = 'bg_diamond1_2';
				isRed = true;
			} else if (cardColor == 16) {
				type = 'bg_club1_1';
				type_2 = 'bg_club1_2';
				isRed = false;
			} else if (cardColor == 32) {
				type = 'bg_heart1_1';
				type_2 = 'bg_heart1_2';
				isRed = true;
			} else if (cardColor == 48) {
				type = 'bg_spade1_1';
				type_2 = 'bg_spade1_2';
				isRed = false;
			}

			// if(cardValue == 11){
			//     type = type + "_11";
			// }
			// else if(cardValue == 12){
			//     type = type + "_12";
			// }
			// else if(cardValue == 13){
			//     type = type + "_13";
			// }

			if (isRed) {
				num = "red_" + cardValue.toString();
			} else {
				num = "black_" + cardValue.toString();
			}
		} else {
			var _numNode = cardNode.getChildByName("num");
			_numNode.x = -44;
			_numNode.y = 37;
			//大王
			if (cardValue == 1) {
				type = "icon_big_king";
				num = "icon_big_king_01";
			}
			//小王
			else if (cardValue == 2) {
					type = "icon_small_king";
					num = "icon_small_king_01";
				}
		}

		var numSp = cardNode.getChildByName("num").getComponent(cc.Sprite);
		var iconSp = cardNode.getChildByName("icon").getComponent(cc.Sprite);
		var icon1_Sp = cardNode.getChildByName("icon_1").getComponent(cc.Sprite);
		numSp.spriteFrame = this.PokerCard.pokerDict[num];
		iconSp.spriteFrame = this.PokerCard.pokerDict[type];
		icon1_Sp.spriteFrame = this.PokerCard.pokerDict[type_2];
		if (hideBg) cardNode.getChildByName("poker_back").active = false;
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
        //# sourceMappingURL=nn_winlost_child.js.map
        