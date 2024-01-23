(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/sss/sss_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ba852+cr3FHcai/v4ai0+tu', 'sss_winlost_child', __filename);
// script/ui/uiGame/sss/sss_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
    extends: require("BasePoker_winlost_child"),

    properties: {},

    // use this for initialization
    OnLoad: function OnLoad() {
        this.LOGIC_MASK_COLOR = 0xF0;
        this.LOGIC_MASK_VALUE = 0x0F;
        this.PokerCard = app.PokerCard();
    },
    ShowSpecData: function ShowSpecData(setEnd, playerAll, index) {
        var player = setEnd.posResultList[index];
        //倍数
        this.node.getChildByName("lb_beiShu").active = true;
        var beishu = this.node.getChildByName("lb_beiShu").getComponent(cc.Label);

        beishu.string = player.doubleNum;

        //底分
        this.node.getChildByName("lb_difen").active = true;
        var difen = this.node.getChildByName("lb_difen").getComponent(cc.Label);
        difen.string = player.baseMark;
        var cardNode = this.node.getChildByName("cardList");
        if (setEnd.rankeds[index]) {
            var dunPos = setEnd.rankeds[index]["dunPos"];
            var dunPai1 = cardNode.getChildByName("dunPai1");
            for (var i = 0; i < dunPai1.children.length; i++) {
                var card = dunPai1.children[i];
                this.ShowCard(dunPos["first"][i], card);
            }
            var dunPai2 = cardNode.getChildByName("dunPai2");
            for (var _i = 0; _i < dunPai2.children.length; _i++) {
                var _card = dunPai2.children[_i];
                this.ShowCard(dunPos["second"][_i], _card);
            }
            var dunPai3 = cardNode.getChildByName("dunPai3");
            for (var _i2 = 0; _i2 < dunPai3.children.length; _i2++) {
                var _card2 = dunPai3.children[_i2];
                this.ShowCard(dunPos["third"][_i2], _card2);
            }
            dunPai1.active = true;
            dunPai2.active = true;
            dunPai3.active = true;
        } else {
            var _dunPai = cardNode.getChildByName("dunPai1");
            _dunPai.active = false;
            var _dunPai2 = cardNode.getChildByName("dunPai2");
            _dunPai2.active = false;
            var _dunPai3 = cardNode.getChildByName("dunPai3");
            _dunPai3.active = false;
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
        var newPoker = this.PokerCard.SubCardValue(poker);
        if (newPoker == '0x41') {
            return 99;
        } else if (newPoker == '0x42') {
            return 100;
        }
        return newPoker & this.LOGIC_MASK_VALUE;
    },

    //获取花色
    GetCardColor: function GetCardColor(poker) {
        var newPoker = this.PokerCard.SubCardValue(poker);
        return newPoker & this.LOGIC_MASK_COLOR;
    },
    SubCardValue: function SubCardValue(poker) {
        var temp = "";
        if (poker.length > 4) {
            temp = poker;
            temp = temp.substring(0, temp.length - 1);
        } else {
            temp = poker;
        }

        return temp;
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
        //# sourceMappingURL=sss_winlost_child.js.map
        