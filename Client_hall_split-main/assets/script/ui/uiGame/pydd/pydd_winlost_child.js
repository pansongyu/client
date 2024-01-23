/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
    extends: require("BaseMJ_winlost_child"),

    properties: {
        prefab_zhadan: cc.Prefab,
        prefab_card: cc.Prefab,
        you: cc.Label,
        lb1: cc.Label,
        lbSportsPoint: cc.Label,
    },

    // use this for initialization
    OnLoad: function () {
        app["ygwsk_PokerCard"] = require("ygwsk_PokerCard").GetModel;
        this.ComTool = app.ComTool();
        this.ShareDefine = app.ShareDefine();
        this.PokerCard = app.ygwsk_PokerCard();
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
        let yingBaoPos = setEnd["yingBaoPos"];
        let posResultList = setEnd["posResultList"];
        let posHuArray = new Array();
        let posCount = posResultList.length;
        this.myRanksType = -1;
        let myPid = app.HeroManager().GetHeroID();
        for (let i = 0; i < posCount; i++) {
            let posInfo = posResultList[i];
            let pos = posInfo["pos"];
            let pid = posInfo["pid"];
            let ranksType = posInfo["ranksType"];
            let posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
            posHuArray[pos] = posHuType;
            if (myPid == pid) {
                this.myRanksType = ranksType;
            }
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
        if (this.myRanksType == PlayerInfo["ranksType"]) {
            this.node.getChildByName("user_info").getChildByName("img_huo").active = true;
        } else {
            this.node.getChildByName("user_info").getChildByName("img_huo").active = false;
        }
        //显示头像，如果头像UI
        if (PlayerInfo["pid"] && PlayerInfo["iconUrl"]) {
            app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"], PlayerInfo["iconUrl"]);
        }
        let weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);


        //
        let posEndList = posResultList[index];

        //硬包、素包、反包标识
        this.node.getChildByName("user_info").getChildByName('img_yb').active = yingBaoPos == index;

        this.node.getChildByName("user_info").getChildByName('img_maima').active = posEndList.piaoHua;

        //显示头游
        let endType = posEndList.endType;//游数  0为默认值
        if(endType=="ONE"){
            this.you.string="头游";
        }else if(endType=="TWO"){
            this.you.string="二游";
        }else if(endType=="THREE"){
            this.you.string="三游";
        }else if(endType=="FOUR"){
            this.you.string="末游";
        }else{
            this.you.string="";
        }

        let str = '';
        //输赢分
        str += '奖分:'
        str += this.onPlusScore(posEndList.prizePoint) + '  ';


        str += '捡分:';
        str += this.onPlusScore(posEndList.k510Point) + '  ';


        // str += '奖分:';
        // str += this.onPlusScore(posEndList.prizePoint) + '  ';

        
        // str += '买马:';
        // str += this.onPlusScore(posEndList.piaoFen) + '  ';

        //赏数
        // str += '输赢分:';
        // str += this.onPlusScore(posEndList.winLosePoint) + '  ';

        str += '总分:';
        str += this.onPlusScore(posEndList.point) + '  ';

        this.lb1.string = str;

        if (typeof(posEndList.sportsPoint)!="undefined") {
            this.lbSportsPoint.string = '比赛分:' + posEndList.sportsPoint;
        }else{
            this.lbSportsPoint.string = '';
        }

        //
        // if (posEndList.totalPoint > 0) {
        //     PlayerNode.getChildByName('lb_zdf').getComponent(cc.Label).string = "+" + posEndList.totalPoint;
        // } else {
        //     PlayerNode.getChildByName('lb_zdf').getComponent(cc.Label).string = posEndList.totalPoint;
        // }

        // 显示牌
        let zhaDanLayOut = this.node.getChildByName('zhadan');
        zhaDanLayOut.removeAllChildren();
        console.log('当前显示的玩家是', posEndList);

        let dingPrizeList = posEndList.dingPrizeList;
        // dingPrizeList = [
        // 	[0x103, 0x103, 0x103, 0x104, 0x104, 0x104],
        // 	[0x104, 0x104, 0x104],
        // 	[0x105, 0x105, 0x105],
        // 	[0x105, 0x105, 0x105],
        // 	[0x106, 0x106, 0x106],
        // ];

        for (let i = 0; i < dingPrizeList.length; i++) {
            let dingCardList = dingPrizeList[i];
            let cardNodes = cc.instantiate(this.prefab_zhadan);
            zhaDanLayOut.addChild(cardNodes);
            cardNodes.active = true;

            for (let j = 0; j < dingCardList.length; j++) {
                let poker = dingCardList[j];
                let cardNode = cc.instantiate(this.prefab_card);
                cardNodes.addChild(cardNode);
                cardNode.active = true;
                this.ShowCard(poker, cardNode, 0, true, false, false, false);
            }
        }


        // let prizeCard = posEndList.prizeCardList;//[cardList:{}]
        // let prizeCard = [];
        // let prizeInfos = posEndList.prizeInfos;//[cardList:{},isBeiMie:true]
        // if (prizeInfos.length > 0) {
        //     for (let i = 0; i < prizeInfos.length; i++) {
        //         let prizeInfo = prizeInfos[i];
        //         let cardList = prizeInfo["cardList"];
        //         let isBeiMie = prizeInfo["isBeiMie"];
        //         let carNum = cardList.length;
        //         let array = [].concat(carNum,isBeiMie,cardList);
        //         prizeCard.push(array);
        //     }
        // }
        // for (let l = 0; l < prizeCard.length; l++) {
        //     prizeCardList.push(prizeCard[l]);
        //     this.createZhaDanNode(zhaDanLayOut, l);
        // }

        // for (let j = 0; j < zhaDanLayOut.children.length; j++) {
        //     let paiNode = zhaDanLayOut.getChildByName('zhadan' + j);
        //     if (prizeCardList[j]) {
        //         // let pailist = prizeCardList[j].slice(2,prizeCardList[j].length);
        //         let zhashu = prizeCardList[j][0];
        //         // paiNode.getChildByName('lb_num').getComponent(cc.Label).string = 'x' + zhashu;
        //         let pailist = prizeCardList[j].slice(1, prizeCardList[j].length);
        //         let num = zhashu;
        //         this.createCardNode(paiNode, pailist.length);
        //         for (let k = 0; k < pailist.length; k++) {
        //             let cardNode = paiNode.getChildByName('layout').getChildByName('handCard' + (k + 1));
        //             let cardValue = pailist[k];
        //             if (cardValue) {
        //                     let cardRealValue = this.PokerCard.GetCardValue(cardValue);
        //                     let isRazz=false;
        //                     if(cardRealValue==19){
        //                         isRazz=true;
        //                         cardValue=pailist[0];  //换成癞子显示
        //                     }
        //                     // if (k + 1 == pailist.length) {
        //                     //     this.ShowCard(cardValue, cardNode,num, true, false, false, isRazz);
        //                     // } else {
        //                     //     this.ShowCard(cardValue, cardNode,0, false, false, false, isRazz);
        //                     // }
        //                     this.ShowCard(cardValue, cardNode,0, false, false, false, isRazz);
        //                     cardNode.active = true;
        //             } else {
        //                     cardNode.active = false;
        //             }

        //         }
        //         paiNode.active = true;
        //     } else {
        //         paiNode.active = false;
        //     }

        // }
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
            Gang: "杠",
            JieGang: "接杠",
            QYS: "清一色",
            Long: "一条龙",
            HunYou: "混悠",
            AnGang: "暗杠",
            Hu: "胡",
        };
        return huTypeDict[huType];
    },
});
