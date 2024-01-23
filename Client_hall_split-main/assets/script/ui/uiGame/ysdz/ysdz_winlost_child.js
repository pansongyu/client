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
    },

    // use this for initialization
    OnLoad: function () {
        this.ComTool = app.ComTool();
        this.ShareDefine = app.ShareDefine();
        this.PokerCard = app.PokerCard();
    },
    ShowPlayerJieSuan() {

    },
    ShowPlayerHuaCard() {

    },
    ShowPlayerShowCard() {

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

        if (dPos === index) {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
        } else {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
        }
        let ranksType = posResultList[index]["ranksType"];
        this.node.getChildByName("user_info").getChildByName("huo").active = ranksType == 2;
        //显示头像，如果头像UI
        if (PlayerInfo["pid"] && PlayerInfo["iconUrl"]) {
            app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"], PlayerInfo["iconUrl"]);
        }
        let weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);


        //
        let posEndList = posResultList[index];
        let youShuDict = {
            "ONE": "头游",
            "TWO": "二游",
            "THREE": "三游",
            "NOT": "",
        };

        //显示头游
        let str = '';
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
        let zhaDanLayOut = this.node.getChildByName("zhadan");
        //显示废王
        let wasteKings = posEndList.fineCardList;
        let cardDemo = this.node.getChildByName("card1");
        for (let i = 0; i < zhaDanLayOut.children.length; i++) {
            let childName = zhaDanLayOut.children[i]["name"];
            if (childName.startsWith("card")) {
                zhaDanLayOut.children[i].active = false;
            }
        }
        for (let i = 0; i < wasteKings.length; i++) {
            let cardNode = zhaDanLayOut.getChildByName("card" + (i + 1));
            if (!cardNode) {
                cardNode = cc.instantiate(cardDemo);
                zhaDanLayOut.addChild(cardNode);
                cardNode.name = "card" + (i + 1);
            }
            if (wasteKings[i]) {
                let cardValue = wasteKings[i];
                this.ShowCard(cardValue, cardNode, true);
            } else {
                cardNode.active = false;
            }
        }


        for (let i = 0; i < zhaDanLayOut.children.length; i++) {
            let childName = zhaDanLayOut.children[i]["name"];
            if (childName.startsWith("zhadan")) {
                zhaDanLayOut.children[i].active = false;
            }
        }
        console.log('当前显示的玩家是', posEndList);
        let prizeCardList = posEndList.prizeCardList;//[cardList:{}]
        for (let j = 0; j < prizeCardList.length; j++) {
            let paiNode = zhaDanLayOut.getChildByName("zhadan" + (j + 1));
            if (!paiNode) {
                paiNode = cc.instantiate(this.prefab_zhadan);
                zhaDanLayOut.addChild(paiNode);
                paiNode.name = "zhadan" + (j + 1);
                paiNode.active = true;
            }
            if (prizeCardList[j]) {
                // let zhashu = prizeCardList[j].length;
                let zhashu = prizeCardList[j].slice(1, 2);
                // let pailist = prizeCardList[j];
                let pailist = prizeCardList[j].slice(3);
                paiNode.getChildByName('lb_num').getComponent(cc.Label).string = 'x' + zhashu;
                let num = pailist.length;
                this.createCardNode(paiNode, num);
                for (let k = 0; k < num; k++) {
                    let cardNode = paiNode.getChildByName('layout').getChildByName('handCard' + (k + 1));
                    let cardValue = pailist[k];
                    if (cardValue) {
                        if (k + 1 == pailist.length) {
                            this.ShowCard(cardValue, cardNode, true);
                        } else {
                            this.ShowCard(cardValue, cardNode, false);
                        }
                        cardNode.active = true;
                    } else {
                        cardNode.active = false;
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

    ShowCard: function (cardType, cardNode, isShowIcon1) {
        cardNode.active = true;
        let realValue = 0;
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

    createCardNode: function (paiNode, num) {
        let layOutNode = paiNode.getChildByName('layout');
        layOutNode.removeAllChildren();
        for (let i = 1; i < num + 1; i++) {
            let card = cc.instantiate(this.prefab_card);//this# two
            card.name = "handCard" + i;
            card.active = true;
            layOutNode.addChild(card);
        }
        layOutNode.getComponent(cc.Layout).updateLayout();
    },
});
