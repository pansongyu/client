(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/dhd/dhd_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '429fap9CM9JNYdth3eJ1j9s', 'dhd_winlost_child', __filename);
// script/ui/uiGame/dhd/dhd_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
		GoCardPrefab: cc.Prefab,
		cardPrefab: cc.Prefab,
		SpriteMale: cc.SpriteFrame,
		SpriteFeMale: cc.SpriteFrame
	},

	// use this for initialization
	OnLoad: function OnLoad() {
		this.PokerCard = app.PokerCard();
		this.ComTool = app.ComTool();
		this.ShareDefine = app.ShareDefine();
		this.IntegrateImage = app.SysDataManager().GetTableDict("IntegrateImage");
	},
	ShowPlayerData: function ShowPlayerData(setEnd, playerAll, index) {
		console.log("单局结算数据", setEnd, playerAll, index);
		var dPos = setEnd.dPos;
		var posResultList = setEnd["posResultList"];
		var PlayerInfo = playerAll[index];
		this.node.active = true;
		this.UpdatePlayData(this.node, posResultList[index], PlayerInfo);

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
		this.ShowPlayerRecord(PlayerNode.getChildByName("record"), HuList);
		this.ShowPlayerInfo(PlayerNode.getChildByName("user_info"), PlayerInfo);
		this.ShowPlayerShowCard(PlayerNode.getChildByName("showcard"), HuList);
	},
	ShowPlayerRecord: function ShowPlayerRecord(ShowNode, huInfo) {
		ShowNode.active = true;
		//显示桌面分
		if (huInfo["tableScore"] > 0) {
			ShowNode.getChildByName("lb_point").getComponent("cc.Label").string = "桌面分:+" + huInfo["tableScore"];
		} else {
			ShowNode.getChildByName("lb_point").getComponent("cc.Label").string = huInfo["tableScore"];
		}
		if (huInfo["point"] > 0) {
			ShowNode.getChildByName("lb_point").getComponent("cc.Label").string = "+" + huInfo["point"];
			ShowNode.getChildByName("lb_point").color = cc.color(19, 111, 20);
		} else {
			ShowNode.getChildByName("lb_point").getComponent("cc.Label").string = huInfo["point"];
			ShowNode.getChildByName("lb_point").color = cc.color(213, 68, 67);
		}
		//显示竞技点
		if (typeof huInfo["sportsPoint"] != "undefined") {
			if (huInfo["sportsPoint"] > 0) {
				ShowNode.getChildByName("lb_SportsPoint").getComponent(cc.Label).string = "比赛分：+" + huInfo["sportsPoint"];
			} else {
				ShowNode.getChildByName("lb_SportsPoint").getComponent(cc.Label).string = "比赛分：" + huInfo["sportsPoint"];
			}
			ShowNode.getChildByName("lb_SportsPoint").active = true;
		} else {
			ShowNode.getChildByName("lb_SportsPoint").getComponent(cc.Label).string = "";
			ShowNode.getChildByName("lb_SportsPoint").active = false;
		}
	},
	ShowPlayerInfo: function ShowPlayerInfo(ShowNode, PlayerInfo) {
		ShowNode.getChildByName("lable_name").getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"], PlayerInfo["name"]);
		ShowNode.getChildByName("label_id").getComponent("cc.Label").string = "ID:" + this.ComTool.GetPid(PlayerInfo["pid"]);

		// if (PlayerInfo["sex"] == this.ShareDefine.HeroSex_Boy) {
		// 	ShowNode.getChildByName("sex").getComponent(cc.Sprite).SpriteFrame = this.SpriteMale;
		// } else if (PlayerInfo["sex"] == this.ShareDefine.HeroSex_Girl) {
		// 	ShowNode.getChildByName("sex").getComponent(cc.Sprite).SpriteFrame = this.SpriteFeMale;
		// }
	},
	ShowPlayerShowCard: function ShowPlayerShowCard(ShowNode, huInfo) {
		var publicCardList = huInfo["publicCardList"];
		var publicCardNode = ShowNode.getChildByName("publicCardNode");
		publicCardNode.removeAllChildren();
		if (!publicCardList.length) {
			publicCardNode.width = 0;
			publicCardNode.getComponent(cc.Layout).updateLayout();
		}

		//渲染扣到的牌
		for (var i = 0; i < publicCardList.length; i++) {
			var goCardNode = cc.instantiate(this.GoCardPrefab);
			var cardIDList = publicCardList[i];
			for (var j = 0; j < cardIDList.length; j++) {
				var cardNode = cc.instantiate(this.cardPrefab);
				var value = cardIDList[j];
				this.ShowMiniCard(value, cardNode);
				cardNode.active = true;
				goCardNode.getChildByName("layout").addChild(cardNode);
			}
			publicCardNode.addChild(goCardNode);
		}

		//渲染剩余手牌
		var shouCardList = huInfo["shouCard"];
		var shouCardNode = ShowNode.getChildByName("shouCardNode");
		shouCardNode.removeAllChildren();
		if (!shouCardNode.length) {
			shouCardNode.width = 0;
			shouCardNode.getComponent(cc.Layout).updateLayout();
		}
		for (var _i = 0; _i < shouCardList.length; _i++) {
			var _cardNode = cc.instantiate(this.cardPrefab);
			var _value = shouCardList[_i];
			this.ShowMiniCard(_value, _cardNode, true);
			_cardNode.active = true;
			shouCardNode.addChild(_cardNode);
		}
		ShowNode.getComponent(cc.Layout).updateLayout();
	},
	//显示poker牌
	ShowMiniCard: function ShowMiniCard(cardType, cardNode) {
		var isBlack = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

		this.PokerCard.GetMiniPokeCard(cardType, cardNode);
		cardNode.active = true;
		cardNode.getChildByName("bg_black").active = isBlack;
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
        //# sourceMappingURL=dhd_winlost_child.js.map
        