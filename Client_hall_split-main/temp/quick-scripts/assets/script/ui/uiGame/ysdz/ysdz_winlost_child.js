(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/ysdz/ysdz_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f9157VwAkFPVonzOg9aR2DX', 'ysdz_winlost_child', __filename);
// script/ui/uiGame/ysdz/ysdz_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
    extends: require("BaseMJ_winlost_child"),

    properties: {
        prefab_zhadan: cc.Prefab,
        prefab_card: cc.Prefab,
        lb1: cc.Label,
        lbSportsPoint: cc.Label
    },

    // use this for initialization
    OnLoad: function OnLoad() {
        this.ComTool = app.ComTool();
        this.ShareDefine = app.ShareDefine();
        this.PokerCard = app.PokerCard();
    },
    ShowPlayerJieSuan: function ShowPlayerJieSuan() {},
    ShowPlayerHuaCard: function ShowPlayerHuaCard() {},
    ShowPlayerShowCard: function ShowPlayerShowCard() {},
    onPlusScore: function onPlusScore(s) {
        if (s > 0) {
            return '+' + s;
        }
        return s;
    },


    ShowPlayerData: function ShowPlayerData(setEnd, playerAll, index) {
        var jin1 = setEnd.jin1;
        var jin2 = setEnd.jin2;
        var dPos = setEnd.dPos;
        var posResultList = setEnd["posResultList"];
        var posHuArray = new Array();
        var posCount = posResultList.length;
        for (var i = 0; i < posCount; i++) {
            var posInfo = posResultList[i];
            var pos = posInfo["pos"];
            var posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
            posHuArray[pos] = posHuType;
        }
        var PlayerInfo = playerAll[index];
        this.node.active = true;
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2);

        if (dPos === index) {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
        } else {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
        }
        var ranksType = posResultList[index]["ranksType"];
        this.node.getChildByName("user_info").getChildByName("huo").active = ranksType == 2;
        //显示头像，如果头像UI
        if (PlayerInfo["pid"] && PlayerInfo["iconUrl"]) {
            app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"], PlayerInfo["iconUrl"]);
        }
        var weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);

        //
        var posEndList = posResultList[index];
        var youShuDict = {
            "ONE": "头游",
            "TWO": "二游",
            "THREE": "三游",
            "NOT": ""
        };

        //显示头游
        var str = '';
        str += youShuDict[posEndList.endPosType] + '   ';
        //输赢分
        str += "奖分:";
        str += this.onPlusScore(posEndList.prizePoint) + '  ';

        //赏数
        str += "罚分:";
        str += this.onPlusScore(posEndList.finePoint) + '  ';

        //赏分
        str += "输赢分:";
        str += this.onPlusScore(posEndList.setPoint) + '  ';
        //得分
        str += '得分:';
        str += this.onPlusScore(posEndList.scorePoint) + '  ';
        //总得分
        str += '总得分:';
        str += this.onPlusScore(posEndList.point) + '  ';
        this.lb1.string = str;

        if (posEndList.sportsPoint) {
            this.lbSportsPoint.string = '比赛分:' + posEndList.sportsPoint;
        } else {
            this.lbSportsPoint.string = "";
        }

        //
        // if (posEndList.totalPoint > 0) {
        //     PlayerNode.getChildByName('lb_zdf').getComponent(cc.Label).string = "+" + posEndList.totalPoint;
        // } else {
        //     PlayerNode.getChildByName('lb_zdf').getComponent(cc.Label).string = posEndList.totalPoint;
        // }


        //显示牌
        var zhaDanLayOut = this.node.getChildByName("zhadan");
        //显示废王
        var wasteKings = posEndList.fineCardList;
        var cardDemo = this.node.getChildByName("card1");
        for (var _i = 0; _i < zhaDanLayOut.children.length; _i++) {
            var childName = zhaDanLayOut.children[_i]["name"];
            if (childName.startsWith("card")) {
                zhaDanLayOut.children[_i].active = false;
            }
        }
        for (var _i2 = 0; _i2 < wasteKings.length; _i2++) {
            var cardNode = zhaDanLayOut.getChildByName("card" + (_i2 + 1));
            if (!cardNode) {
                cardNode = cc.instantiate(cardDemo);
                zhaDanLayOut.addChild(cardNode);
                cardNode.name = "card" + (_i2 + 1);
            }
            if (wasteKings[_i2]) {
                var cardValue = wasteKings[_i2];
                this.ShowCard(cardValue, cardNode, true);
            } else {
                cardNode.active = false;
            }
        }

        for (var _i3 = 0; _i3 < zhaDanLayOut.children.length; _i3++) {
            var _childName = zhaDanLayOut.children[_i3]["name"];
            if (_childName.startsWith("zhadan")) {
                zhaDanLayOut.children[_i3].active = false;
            }
        }
        console.log('当前显示的玩家是', posEndList);
        var prizeCardList = posEndList.prizeCardList; //[cardList:{}]
        for (var j = 0; j < prizeCardList.length; j++) {
            var paiNode = zhaDanLayOut.getChildByName("zhadan" + (j + 1));
            if (!paiNode) {
                paiNode = cc.instantiate(this.prefab_zhadan);
                zhaDanLayOut.addChild(paiNode);
                paiNode.name = "zhadan" + (j + 1);
                paiNode.active = true;
            }
            if (prizeCardList[j]) {
                // let zhashu = prizeCardList[j].length;
                var zhashu = prizeCardList[j].slice(1, 2);
                // let pailist = prizeCardList[j];
                var pailist = prizeCardList[j].slice(3);
                paiNode.getChildByName('lb_num').getComponent(cc.Label).string = 'x' + zhashu;
                var num = pailist.length;
                this.createCardNode(paiNode, num);
                for (var k = 0; k < num; k++) {
                    var _cardNode = paiNode.getChildByName('layout').getChildByName('handCard' + (k + 1));
                    var _cardValue = pailist[k];
                    if (_cardValue) {
                        if (k + 1 == pailist.length) {
                            this.ShowCard(_cardValue, _cardNode, true);
                        } else {
                            this.ShowCard(_cardValue, _cardNode, false);
                        }
                        _cardNode.active = true;
                    } else {
                        _cardNode.active = false;
                    }
                }
                paiNode.active = true;
                paiNode.getChildByName("layout").getComponent(cc.Layout).updateLayout();
                paiNode.width = paiNode.getChildByName("layout").width;
            } else {
                paiNode.active = false;
            }
        }
    },

    ShowCard: function ShowCard(cardType, cardNode, isShowIcon1) {
        cardNode.active = true;
        var realValue = 0;
        if (cardType > 500) {
            realValue = cardType - 500;
        } else {
            realValue = cardType;
        }
        if (cardType == 0) {
            cardNode.getChildByName("poker_back").active = true;
            return;
        } else {
            cardNode.getChildByName("poker_back").active = false;
        }
        this.PokerCard.GetYSDZPokeCard(realValue, cardNode, {}, isShowIcon1);
        // this.PokerCard.GetYSDZPokeCard(cardType, cardNode, {}, isShowIcon1);
    },

    createCardNode: function createCardNode(paiNode, num) {
        var layOutNode = paiNode.getChildByName('layout');
        layOutNode.removeAllChildren();
        for (var i = 1; i < num + 1; i++) {
            var card = cc.instantiate(this.prefab_card); //this# two
            card.name = "handCard" + i;
            card.active = true;
            layOutNode.addChild(card);
        }
        layOutNode.getComponent(cc.Layout).updateLayout();
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
        //# sourceMappingURL=ysdz_winlost_child.js.map
        