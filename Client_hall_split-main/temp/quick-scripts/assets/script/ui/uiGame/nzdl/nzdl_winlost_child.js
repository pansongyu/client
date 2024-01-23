(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/nzdl/nzdl_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2f47abGGYxNb67cn4D03F9w', 'nzdl_winlost_child', __filename);
// script/ui/uiGame/nzdl/nzdl_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
		cardPrefab: cc.Prefab,
		content: cc.Node,
		chutian: cc.Node,
		zhuangJia: cc.Node,
		lb_difen: cc.Label,
		lb_loufen: cc.Label,
		lbSportsPoint: cc.Label,
		sp_chunTian: [cc.SpriteFrame]
	},

	// use this for initialization
	OnLoad: function OnLoad() {
		app["nzdl_PokerCard"] = require("nzdl_PokerCard").GetModel;
		this.ComTool = app.ComTool();
		this.ShareDefine = app.ShareDefine();
		this.PokerCard = app.nzdl_PokerCard();
	},
	ShowPlayerJieSuan: function ShowPlayerJieSuan() {},
	ShowPlayerHuaCard: function ShowPlayerHuaCard() {},

	ShowPlayerHuImg: function ShowPlayerHuImg(huNode, huTypeName) {},

	onPlusScore: function onPlusScore(s) {
		if (s > 0) {
			return '+' + s;
		}
		return s;
	},

	ShowPlayerData: function ShowPlayerData(setEnd, playerAll, index) {
		console.log("ShowPlayerData", setEnd, playerAll, index);
		var dPos = setEnd["dPos"];
		var louFen = setEnd["louFen"];
		var diFen = setEnd["diFen"];
		var posResultList = setEnd["posResultList"];
		var posResult = posResultList[index];
		this.ShowPlayerItem(posResult);
		this.zhuangJia.active = dPos;
		this.lb_difen.string = "底分：" + diFen;
		this.lb_loufen.string = "搂分：" + louFen;
		if (typeof posResult.sportsPoint != "undefined") {
			this.lbSportsPoint.string = '比赛分:' + posResult.sportsPoint;
		} else {
			this.lbSportsPoint.string = '';
		}
		if (dPos === index) {
			this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
		} else {
			this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
		}
		var PlayerInfo = playerAll[index];
		//显示头像，如果头像UI
		if (PlayerInfo["pid"] && PlayerInfo["iconUrl"]) {
			app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"], PlayerInfo["iconUrl"]);
		}
		var weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
		weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
		this.UpdatePlayData(this.node, posResultList[index], PlayerInfo);
	},
	ShowPlayerItem: function ShowPlayerItem(posResult) {
		var publicCardList = posResult["publicCardList"];
		var shouCard = posResult["shouCard"];
		var chunTian = posResult["chunTian"];
		var fanChunTian = posResult["fanChunTian"];
		this.ShowPlayerCard(publicCardList, shouCard);
		this.ShowChuntian(chunTian, fanChunTian);
	},
	ShowPlayerCard: function ShowPlayerCard(publicCardList, shouCard) {
		var paiLayOut = this.content;
		paiLayOut.removeAllChildren();
		var kong = new cc.Node();
		kong.width = 170;
		kong.heig = 172;
		var cardNum = 0;
		var list = [];
		for (var i = 0; i < publicCardList.length; i++) {
			var cardList = publicCardList[i];
			for (var j = 0; j < cardList.length; j++) {
				var card = cardList[j];
				list.push(card);
				cardNum++;
				if (j == cardList.length - 1) {
					list.push(0);
					cardNum++;
				}
			}
		}
		for (var _i = 0; _i < list.length; _i++) {
			var cardType = list[_i];
			var paiNode = paiLayOut.children[_i];
			if (cardType > 0) {
				if (!paiNode) {
					paiNode = cc.instantiate(this.cardPrefab);
					paiLayOut.addChild(paiNode);
				}
				this.ShowCard(cardType, paiNode);
			} else {
				var kongNode = cc.instantiate(kong);
				paiLayOut.addChild(kongNode);
			}
		}
		for (var k = cardNum; k < cardNum + shouCard.length; k++) {
			var _paiNode = paiLayOut.children[k];
			if (!_paiNode) {
				_paiNode = cc.instantiate(this.cardPrefab);
				paiLayOut.addChild(_paiNode);
			}
			var _cardType = shouCard[k - cardNum];
			this.ShowCard(_cardType, _paiNode, 0, true);
		}
	},
	ShowChuntian: function ShowChuntian(chunTian, fanChunTian) {
		var index = -1;
		if (chunTian) {
			index = 0;
		} else if (fanChunTian) {
			index = 1;
		}
		this.chutian.getComponent(cc.Sprite).spriteFrame = this.sp_chunTian[index];
	},
	ShowCard: function ShowCard(cardType, cardNode, sameCardNum, isLastCard) {
		var isShowLandowner = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
		var hideBg = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
		var isRazz = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;

		cardNode.active = true;
		if (cardType == 0) {
			cardNode.getChildByName("poker_back").active = true;
			return;
		} else {
			cardNode.getChildByName("poker_back").active = false;
		}
		this.PokerCard.GetPokeCard(cardType, cardNode, sameCardNum, isLastCard, isShowLandowner, hideBg, isRazz);
	},
	ClearLabelShow: function ClearLabelShow() {}
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
        //# sourceMappingURL=nzdl_winlost_child.js.map
        