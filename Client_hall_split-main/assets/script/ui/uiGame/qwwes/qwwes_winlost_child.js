/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
    extends: require("BaseMJ_winlost_child"),

    properties: {
        prefab_zhadan: cc.Prefab,
        prefab_card: cc.Prefab,
        lb1: cc.Label,
        lbSportsPoint: cc.Label,
        you_icon: [cc.SpriteFrame],
    },

    // use this for initialization
    OnLoad: function () {
        app["gz_PokerCard"] = require("gz_PokerCard").GetModel;
        this.ComTool = app.ComTool();
        this.ShareDefine = app.ShareDefine();
        this.PokerCard = app.gz_PokerCard();
    },
    ShowPlayerJieSuan() {

    },
    ShowPlayerHuaCard() {

    },
    ShowPlayerHuImg: function (huNode, huTypeName) {
        /*huLbIcon
         *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
         *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
         */
        let huType = this.ShareDefine.HuTypeStringDict[huTypeName];
        if (typeof (huType) == "undefined") {
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

    onPlusScore(s) {
        if (s > 0) {
            return '+' + s;
        }
        return s;
    },

    ShowPlayerData: function (setEnd, playerAll, index) {
        let myPid = app.HeroManager().GetHeroProperty("pid");
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

        let jin1 = setEnd.jin1;
        let jin2 = setEnd.jin2;
        let dPos = setEnd.dPos;
        let posResultList = setEnd["posResultList"];
        let posHuArray = new Array();
        let posCount = posResultList.length;
        for (let i = 0; i < posCount; i++) {
            let posInfo = posResultList[i];
            let pos = posInfo["pos"];
            let posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
            posHuArray[pos] = posHuType;
        }
        let PlayerInfo = playerAll[index];
        this.node.active = true;
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2);
        let huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
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
        let weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);

        //
        let posEndList = posResultList[index];
        let isShowPartner = posEndList.isShowPartner;
        this.node.getChildByName("img_di").active = !isShowPartner;
        this.node.getChildByName("img_you").active = isShowPartner;

        let endType = posEndList["endType"];
        let endTypeNode = this.node.getChildByName("img_youCount");
        this.ShowYou(endTypeNode, endType);

        //显示头游
        let str = '';

        str += '吃分:';
        str += this.onPlusScore(posEndList["k510Point"]) + '  ';

        str += '总战绩:';
        str += this.onPlusScore(posEndList.roomPoint) + '  ';

        this.lb1.string = str;

        if (typeof (posEndList.sportsPoint) != "undefined") {
            this.lbSportsPoint.string = '比赛分:' + posEndList.sportsPoint;
        } else {
            this.lbSportsPoint.string = '';
        }
    },
    ShowYou: function (node, endType) {
        let youDict = {
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
    ShowCard: function (cardType, cardNode, sameCardNum, isLastCard, isShowLandowner = false, hideBg = false, isRazz = false) {
        cardNode.active = true;
        if (cardType == 0) {
            cardNode.getChildByName("poker_back").active = true;
            return;
        } else {
            cardNode.getChildByName("poker_back").active = false;
        }
        this.PokerCard.GetPokeCard(cardType, cardNode, sameCardNum, isLastCard, isShowLandowner, hideBg, isRazz);

    },

    createCardNode: function (paiNode, num) {
        let layOutNode = paiNode.getChildByName('layout');
        layOutNode.removeAllChildren();
        for (let i = 1; i < num + 1; i++) {
            let card = cc.instantiate(this.prefab_card);//this# two
            card.name = "handCard" + i;
            layOutNode.addChild(card);
        }
    },

    createZhaDanNode: function (zhaDanLayOut, num) {
        //
        let card = cc.instantiate(this.prefab_zhadan);//this# one
        card.name = "zhadan" + num;
        zhaDanLayOut.addChild(card);
    },

    LabelName: function (huType) {
        let huTypeDict = {
            QDHu: "七对胡",
        };
        return huTypeDict[huType];
    },
});
