(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/zjpls/zjpls_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '84749Fm62lKg6aQD8mgLrEF', 'zjpls_winlost_child', __filename);
// script/ui/uiGame/zjpls/zjpls_winlost_child.js

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
    },
    ShowSpecData: function ShowSpecData(setEnd, playerAll, index) {
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
        var cardNode = this.node.getChildByName('card');
        var rankeds = setEnd.rankeds[index];
        var dunPos = rankeds.dunPos;
        var special = rankeds.special;
        if (special != -1) {
            //显示特殊牌型
            var specialNode = cardNode.getChildByName('special_card');
            specialNode.active = true;
            var imagePath = "texture/game/zjpls/special/" + special;
            //加载图片精灵
            var that = this;
            cc.loader.loadRes(imagePath, cc.SpriteFrame, function (error, spriteFrame) {
                if (error) {
                    that.ErrLog("ShowMap imagePath(%s) loader error:%s", imagePath, error);
                    return;
                }
                specialNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }

        if (setEnd.zjid == player.pid) {
            cardNode.getChildByName('zhuangjia').active = true;
        }
        var allCards = [];
        if (special == 85 || special == 95) {
            var pokers = dunPos.first.concat(dunPos.second, dunPos.third);
            var tonghuas = this.SanTongHua(pokers);
            for (var i = 0; i < tonghuas.length; i++) {
                for (var j = 0; j < tonghuas[i].length; j++) {
                    allCards.push(tonghuas[i][j]);
                }
            }
        } else {
            allCards = dunPos.first.concat(dunPos.second, dunPos.third);
        }
        for (var _j = 0; _j < cardNode.children.length; _j++) {
            var child = cardNode.children[_j];
            if (child.name == 'zhuangjia' || child.name == 'beishu' || child.name == 'special_card') {
                continue;
            }
            if (!child.getChildByName("cardPrefab")) {
                var card = cc.instantiate(this.cardPrefab);
                child.addChild(card);
                this.ShowCard(allCards[_j], card);
            } else {
                var _card = child.getChildByName("cardPrefab");
                this.ShowCard(allCards[_j], _card);
            }
        }
    },
    ShowCard: function ShowCard(cardType, node) {
        var newPoker = this.PokerCard.SubCardValue(cardType);
        this.PokerCard.GetPokeCard(newPoker, node);
        node.getChildByName("poker_back").active = false;
    },

    SanTongHua: function SanTongHua(pokers) {
        var gui = this.GetGuiPai(pokers);
        var tonghuas = [];
        for (var i = 0; i < pokers.length; i++) {
            var poker = pokers[i];
            if (gui.indexOf(poker) != -1) continue;
            var tonghua = this.GetSameColor(pokers, poker);
            var bInList = this.CheckPokerInList(tonghuas, poker);
            if (tonghua.length >= 5 && !bInList) {
                tonghuas[tonghuas.length] = tonghua;
            } else if (tonghua.length < 5 && !bInList) {
                tonghuas[tonghuas.length] = tonghua;
            }
        }

        tonghuas.sort(function (a, b) {
            return a.length - b.length;
        });

        var JoinGuiPia = function JoinGuiPia(tonghua, gui, len) {
            if (tonghua.length == len) return;
            for (var _i = 0; _i < gui.length; _i++) {
                if (gui[_i] == 'undefined') continue;
                tonghua.push(gui[_i]);
                gui[_i] = 'undefined';
                if (tonghua.length == len) {
                    break;
                }
            }
        };

        if (gui.length) {
            JoinGuiPia(tonghuas[0], gui, 3);
            JoinGuiPia(tonghuas[1], gui, 5);
            JoinGuiPia(tonghuas[2], gui, 5);
        }

        return tonghuas;
    },
    GetGuiPai: function GetGuiPai(pokers) {
        var guipai = [];
        for (var i = 0; i < pokers.length; i++) {
            var poker = pokers[i];
            var newPoker = this.PokerCard.SubCardValue(poker);
            var ten = parseInt(newPoker, 16);
            if (ten >= 65) {
                guipai.push(poker);
            }
        }
        return guipai;
    },

    //获取同一花色
    GetSameColor: function GetSameColor(pokers, tagCard) {
        var sameColorList = [];
        for (var i = 0; i < pokers.length; i++) {
            var poker = pokers[i];
            var pokerColor = this.GetCardColor(poker);
            var tagCardColor = this.GetCardColor(tagCard);

            if (pokerColor == tagCardColor) {
                sameColorList[sameColorList.length] = poker;
            }
        }
        return sameColorList;
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
    CheckPokerInList: function CheckPokerInList(list, tagCard) {
        if (list.length == 0) return false;

        var bInList = false;
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var pos = item.indexOf(tagCard);

            if (pos >= 0) {
                bInList = true;
            }
        }
        return bInList;
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
        //# sourceMappingURL=zjpls_winlost_child.js.map
        