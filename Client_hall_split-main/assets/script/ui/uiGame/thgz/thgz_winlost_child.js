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
        lbSportsPoint: cc.Label
    },

    // use this for initialization
    OnLoad: function () {
        app["thgz_PokerCard"] = require("thgz_PokerCard").GetModel;
        this.ComTool = app.ComTool();
        this.ShareDefine = app.ShareDefine();
        this.PokerCard = app.thgz_PokerCard();
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

        //显示头游
        let str = '';
        //输赢分
        str += '捡分:';
        str += this.onPlusScore(posEndList["count510KPoint"]) + '  ';

        //赏数
        str += '奖分:';
        str += this.onPlusScore(posEndList["prizePoint"]) + '  ';

        //赏数
        str += '奖数:';
        let wuJiangFlag = posEndList["wuJiangFlag"];
        let boomRewardTotal = posEndList["boomRewardTotal"];
        if (wuJiangFlag) {
            str += "无奖+ " + boomRewardTotal + "奖";
        } else {
            let minBoomRewardTotal = posEndList["minBoomRewardTotal"];
            let subOne = posEndList["subOne"];
            let subTwo = posEndList["subTwo"];
            str += boomRewardTotal + "(" + subOne + "-" + subTwo + ")" + '  ';
        }

        str += '总分:';
        str += this.onPlusScore(posEndList.point) + '  ';

        this.lb1.string = str;

        if (typeof(posEndList.sportsPoint) != "undefined") {
            this.lbSportsPoint.string = '比赛分:' + posEndList.sportsPoint;
        } else {
            this.lbSportsPoint.string = '';
        }

        //
        // if (posEndList.totalPoint > 0) {
        //     PlayerNode.getChildByName('lb_zdf').getComponent(cc.Label).string = "+" + posEndList.totalPoint;
        // } else {
        //     PlayerNode.getChildByName('lb_zdf').getComponent(cc.Label).string = posEndList.totalPoint;
        // }

        //显示牌
        /*let prizeCardList = [];
         let zhaDanLayOut = this.node.getChildByName('zhadan');
         zhaDanLayOut.removeAllChildren();
         console.log('当前显示的玩家是', posEndList);
         let prizeCard = posEndList.prizeCardList;//[cardList:{}]
         for (let l = 0; l < prizeCard.length; l++) {
         prizeCardList.push(prizeCard[l]);
         this.createZhaDanNode(zhaDanLayOut, l);
         }

         for (let j = 0; j < zhaDanLayOut.children.length; j++) {
         let paiNode = zhaDanLayOut.getChildByName('zhadan' + j);
         if (prizeCardList[j]) {
         let pailist = prizeCardList[j].slice(2,prizeCardList[j].length);
         let zhashu = pailist.length;
         paiNode.getChildByName('lb_num').getComponent(cc.Label).string = 'x' + zhashu;
         let num = zhashu;
         this.createCardNode(paiNode, num);
         for (let k = 0; k < num; k++) {
         let cardNode = paiNode.getChildByName('layout').getChildByName('handCard' + (k + 1));
         let cardValue = pailist[k];
         if (cardValue) {
         let cardRealValue = this.PokerCard.GetCardValue(cardValue);
         let isRazz=false;
         if(cardRealValue==19){
         isRazz=true;
         cardValue=pailist[0];  //换成癞子显示
         }
         if (k + 1 == pailist.length) {
         this.ShowCard(cardValue, cardNode,num, true, false, false, isRazz);
         } else {
         this.ShowCard(cardValue, cardNode,0, false, false, false, isRazz);
         }
         cardNode.active = true;
         } else {
         cardNode.active = false;
         }

         }
         paiNode.active = true;
         } else {
         paiNode.active = false;
         }

         }*/
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
