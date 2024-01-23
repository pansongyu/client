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
        app["glpp_PokerCard"] = require("glpp_PokerCard").GetModel;
        this.ComTool = app.ComTool();
        this.ShareDefine = app.ShareDefine();
        this.PokerCard = app.glpp_PokerCard();
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

        this.node.getChildByName('record').getChildByName('lb_shuying').getComponent(cc.Label).string = "" + posEndList.point;
        // this.node.getChildByName('record').getChildByName('lb_shouCardSize').getComponent(cc.Label).string = "" + posEndList.shouCardSize;
        // this.node.getChildByName('record').getChildByName('lb_loseSize').getComponent(cc.Label).string = "" + posEndList.loseSize;
        // fennode.getChildByName('lb_roompoint').getComponent(cc.Label).string = "" + posEndList.roomPoint;

        //显示全大全小
        let quandaquanxiao =  posEndList.quanDaQuanXiao;
        let daXiaoStr = "";
        if(quandaquanxiao == 0){
            daXiaoStr = "全大";
        }else if(quandaquanxiao == 1){
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

        if (typeof(posEndList.sportsPoint)!="undefined") {
            this.lbSportsPoint.string = '比赛分:' + posEndList.sportsPoint;
        }else{
             this.lbSportsPoint.string = '';
        }

        let shouCardNodes = this.node.getChildByName('shouCardNodes');
        let demo_handCard = this.node.getChildByName('demo_handCard');
        shouCardNodes.removeAllChildren();

        let shouCard = posEndList.shouCard;
        for (let idx = 0; idx < shouCard.length; idx++) {
            let cardValue = shouCard[idx];
            // let cardNode = cc.instantiate(this.prefab_card);
            let cardNode = cc.instantiate(demo_handCard);
            cardNode.name = "handCard" + idx;
            cardNode.active = true;
            shouCardNodes.addChild(cardNode);
            this.ShowCard(cardValue, cardNode, 0, true, false, false, false);
        }
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
