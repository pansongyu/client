(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/sdh/sdh_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '259dcy+6N1Pl6ltCJHYrEN+', 'sdh_winlost_child', __filename);
// script/ui/uiGame/sdh/sdh_winlost_child.js

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

    ShowPlayerHuImg: function ShowPlayerHuImg(huNode, huTypeName) {
        /*huLbIcon
        *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
        *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
        */
        var huType = this.ShareDefine.HuTypeStringDict[huTypeName];
        if (typeof huType == "undefined") {
            huNode.getComponent(cc.Label).string = '';
        } else if (huType == this.ShareDefine.HuType_DianPao) {
            huNode.getComponent(cc.Label).string = '点泡';
        } else if (huType == this.ShareDefine.HuType_JiePao) {
            huNode.getComponent(cc.Label).string = '接炮';
        } else if (huType == this.ShareDefine.HuType_ZiMo) {
            huNode.getComponent(cc.Label).string = '自摸';
        } else if (huType == this.ShareDefine.HuType_QGH) {
            huNode.getComponent(cc.Label).string = '抢杠胡';
        } else {
            huNode.getComponent(cc.Label).string = '';
        }
    },

    onPlusScore: function onPlusScore(s) {
        if (s > 0) {
            return '+' + s;
        }
        return s;
    },


    ShowPlayerData: function ShowPlayerData(setEnd, playerAll, index) {
        console.log('包王单局战绩数据', setEnd, playerAll, index);
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
        var huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
        // this.ShowPlayerHuImg(huNode, posResultList[index]['huType']);

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

        //
        var posEndList = posResultList[index];

        //显示头游
        // let str = '';
        //输赢分
        // str += '输赢分:'
        // str += this.onPlusScore(posEndList.baseScore) + '  ';

        // //赏数
        // str += '赏数:';
        // str += this.onPlusScore(posEndList.rewardCount) + '  ';

        // //赏分
        // str += '赏分:';
        // str += this.onPlusScore(posEndList.rewardScore) + '  ';
        //得分
        // str += '得分:';
        // str += this.onPlusScore(posEndList.point) + '  ';
        // this.lb1.string = str;

        // if (posEndList.sportsPoint) {
        //     this.lbSportsPoint.string = '比赛分:' + posEndList.sportsPoint;
        // }

        //
        // if (posEndList.totalPoint > 0) {
        //     PlayerNode.getChildByName('lb_zdf').getComponent(cc.Label).string = "+" + posEndList.totalPoint;
        // } else {
        //     PlayerNode.getChildByName('lb_zdf').getComponent(cc.Label).string = posEndList.totalPoint;
        // }

        //显示牌
        // let prizeCardList = [];
        // let zhaDanLayOut = this.node.getChildByName('zhadan');
        // zhaDanLayOut.removeAllChildren();
        // console.log('当前显示的玩家是', posEndList);
        // let prizeCard = posEndList.bompList;//[cardList:{}]
        // for (let l = 0; l < prizeCard.length; l++) {
        //     prizeCardList.push(prizeCard[l]["cardList"]);
        //     this.createZhaDanNode(zhaDanLayOut, l);
        // }

        // for (let j = 0; j < zhaDanLayOut.children.length; j++) {
        //     let paiNode = zhaDanLayOut.getChildByName('zhadan' + j);
        //     if (prizeCardList[j]) {
        //         let zhashu = prizeCardList[j].length;
        //         let pailist = prizeCardList[j];
        //         paiNode.getChildByName('lb_num').getComponent(cc.Label).string = 'x' + zhashu;
        //         let num = zhashu;
        //         this.createCardNode(paiNode, num);
        //         for (let k = 0; k < num; k++) {
        //             let cardNode = paiNode.getChildByName('layout').getChildByName('handCard' + (k + 1));
        //             let cardValue = pailist[k];
        //             if (cardValue) {
        //                 if (k + 1 == pailist.length) {
        //                     this.ShowCard(cardValue, cardNode, true);
        //                 } else {
        //                     this.ShowCard(cardValue, cardNode, false);
        //                 }
        //                 cardNode.active = true;
        //             } else {
        //                 cardNode.active = false;
        //             }

        //         }
        //         paiNode.active = true;
        //     } else {
        //         paiNode.active = false;
        //     }

        // }
    },

    ShowCard: function ShowCard(cardType, cardNode, isShowIcon1) {
        cardNode.active = true;
        var realValue = 0;
        if (cardType > 500) {
            realValue = cardType - 500;
        } else {
            realValue = cardType;
        }
        cardNode.active = true;
        if (cardType == 0) {
            cardNode.getChildByName("poker_back").active = true;
            return;
        } else {
            cardNode.getChildByName("poker_back").active = false;
        }
        this.PokerCard.GetPokeCard(realValue, cardNode, {}, isShowIcon1);
    },

    createCardNode: function createCardNode(paiNode, num) {
        var layOutNode = paiNode.getChildByName('layout');
        layOutNode.removeAllChildren();
        for (var i = 1; i < num + 1; i++) {
            var card = cc.instantiate(this.prefab_card); //this# two
            card.name = "handCard" + i;
            layOutNode.addChild(card);
        }
    },

    createZhaDanNode: function createZhaDanNode(zhaDanLayOut, num) {
        //
        var card = cc.instantiate(this.prefab_zhadan); //this# one
        card.name = "zhadan" + num;
        zhaDanLayOut.addChild(card);
    },

    LabelName: function LabelName(huType) {
        var huTypeDict = {
            QDHu: "七对胡",
            Gang: "杠",
            JieGang: "接杠",
            QYS: "清一色",
            Long: "一条龙",
            HunYou: "混悠",
            AnGang: "暗杠",
            Hu: "胡"
        };
        return huTypeDict[huType];
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
        //# sourceMappingURL=sdh_winlost_child.js.map
        