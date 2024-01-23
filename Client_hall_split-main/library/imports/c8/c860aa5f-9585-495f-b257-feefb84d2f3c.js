"use strict";
cc._RF.push(module, 'c860apflYVJX7JX/u+4TS88', 'qwwes_winlost_child');
// script/ui/uiGame/qwwes/qwwes_winlost_child.js

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
        lbSportsPoint: cc.Label,
        you_icon: [cc.SpriteFrame]
    },

    // use this for initialization
    OnLoad: function OnLoad() {
        app["gz_PokerCard"] = require("gz_PokerCard").GetModel;
        this.ComTool = app.ComTool();
        this.ShareDefine = app.ShareDefine();
        this.PokerCard = app.gz_PokerCard();
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
        var myPid = app.HeroManager().GetHeroProperty("pid");
        this.posResultList = setEnd["posResultList"];

        // let clientPos = -1;
        // let partnerPosList = [];
        // let enemyPosList = [];
        // for (let i = 0; i < this.posResultList.length; i++) {
        //     let posResultInfo = this.posResultList[i];
        //     let pid = posResultInfo["pid"];
        //     if (myPid == pid) {
        //         clientPos = posResultInfo["pos"];
        //         partnerPosList = posResultInfo.partnerPosList;
        //         partnerPosList.push(clientPos);
        //         enemyPosList = posResultInfo.enemyPosList;
        //         break;
        //     }
        // }

        // for (let i = 0; i < this.posResultList.length; i++) {
        //     let posResultInfo = this.posResultList[i];
        //     let pos = posResultInfo.pos;
        //     if (partnerPosList.indexOf(pos) > -1) {
        //         posResultInfo["isShowPartner"] = true;
        //     }
        //     else {
        //         posResultInfo["isShowPartner"] = false;
        //     }
        // }

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
        var isShowPartner = posEndList.isShowPartner;
        this.node.getChildByName("img_di").active = !isShowPartner;
        this.node.getChildByName("img_you").active = isShowPartner;

        var endType = posEndList["endType"];
        var endTypeNode = this.node.getChildByName("img_youCount");
        this.ShowYou(endTypeNode, endType);

        //显示头游
        var str = '';

        str += '吃分:';
        str += this.onPlusScore(posEndList["k510Point"]) + '  ';

        str += '总战绩:';
        str += this.onPlusScore(posEndList.roomPoint) + '  ';

        this.lb1.string = str;

        if (typeof posEndList.sportsPoint != "undefined") {
            this.lbSportsPoint.string = '比赛分:' + posEndList.sportsPoint;
        } else {
            this.lbSportsPoint.string = '';
        }
    },
    ShowYou: function ShowYou(node, endType) {
        var youDict = {
            NOT: -1,
            ONE: 0,
            TWO: 1,
            THREE: 2,
            FOUR: 3,
            FIVE: 4,
            SIX: 5
        };
        node.getComponent(cc.Sprite).spriteFrame = this.you_icon[youDict[endType]] || this.you_icon[5];
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
            QDHu: "七对胡"
        };
        return huTypeDict[huType];
    }
});

cc._RF.pop();