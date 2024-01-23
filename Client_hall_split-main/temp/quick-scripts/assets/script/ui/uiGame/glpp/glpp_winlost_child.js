(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/glpp/glpp_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '53870u0snxFurje2eih/zjd', 'glpp_winlost_child', __filename);
// script/ui/uiGame/glpp/glpp_winlost_child.js

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
        app["glpp_PokerCard"] = require("glpp_PokerCard").GetModel;
        this.ComTool = app.ComTool();
        this.ShareDefine = app.ShareDefine();
        this.PokerCard = app.glpp_PokerCard();
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
        this.ShowPlayerHuImg(huNode, posResultList[index]['huType']);

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

        this.node.getChildByName('record').getChildByName('lb_shuying').getComponent(cc.Label).string = "" + posEndList.point;
        // this.node.getChildByName('record').getChildByName('lb_shouCardSize').getComponent(cc.Label).string = "" + posEndList.shouCardSize;
        // this.node.getChildByName('record').getChildByName('lb_loseSize').getComponent(cc.Label).string = "" + posEndList.loseSize;
        // fennode.getChildByName('lb_roompoint').getComponent(cc.Label).string = "" + posEndList.roomPoint;

        //显示全大全小
        var quandaquanxiao = posEndList.quanDaQuanXiao;
        var daXiaoStr = "";
        if (quandaquanxiao == 0) {
            daXiaoStr = "全大";
        } else if (quandaquanxiao == 1) {
            daXiaoStr = "全小";
        }
        this.node.getChildByName('record').getChildByName('lb_quandaquanxiao').getComponent(cc.Label).string = daXiaoStr;
        //显示头游
        // let str = '';
        // //输赢分
        // str += '炸弹分:'
        // str += this.onPlusScore(posEndList["zhaDanFen"]) + '  ';

        //赏数
        /*str += '输赢分:';
        str += this.onPlusScore(posEndList.winLosePoint) + '  ';*/

        // str += '总分:';
        // str += this.onPlusScore(posEndList.point) + '  ';

        // this.lb1.string = str;

        if (typeof posEndList.sportsPoint != "undefined") {
            this.lbSportsPoint.string = '比赛分:' + posEndList.sportsPoint;
        } else {
            this.lbSportsPoint.string = '';
        }

        var shouCardNodes = this.node.getChildByName('shouCardNodes');
        var demo_handCard = this.node.getChildByName('demo_handCard');
        shouCardNodes.removeAllChildren();

        var shouCard = posEndList.shouCard;
        for (var idx = 0; idx < shouCard.length; idx++) {
            var cardValue = shouCard[idx];
            // let cardNode = cc.instantiate(this.prefab_card);
            var cardNode = cc.instantiate(demo_handCard);
            cardNode.name = "handCard" + idx;
            cardNode.active = true;
            shouCardNodes.addChild(cardNode);
            this.ShowCard(cardValue, cardNode, 0, true, false, false, false);
        }
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
        //# sourceMappingURL=glpp_winlost_child.js.map
        