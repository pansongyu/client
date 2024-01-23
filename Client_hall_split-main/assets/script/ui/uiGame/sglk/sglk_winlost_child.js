/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
    extends: require("BaseMJ_winlost_child"),

    properties: {
        prefab_shang: cc.Prefab,
        prefab_card: cc.Prefab,
        you: cc.Label,
    },

    // use this for initialization
    OnLoad: function () {
        app["ctwsk_PokerCard"] = require("ctwsk_PokerCard").GetModel;
        this.ComTool = app.ComTool();
        this.ShareDefine = app.ShareDefine();
        this.PokerCard = app.ctwsk_PokerCard();
    },
    ShowPlayerJieSuan() {

    },
    ShowPlayerRecord: function () {

    },
    ShowPlayerShowCard: function () {

    },
    ShowPlayerDownCard: function () {

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
        let weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);


        //
        let posEndList = posResultList[index];
        //显示伙伴
        // let partnerPos = posResultList[dPos].partnerPos;
        // if(partnerPos == posEndList.pos){
        //     this.node.getChildByName("user_info").getChildByName("huoban").active = true;
        // }else{
        //     this.node.getChildByName("user_info").getChildByName("huoban").active = false;
        // }
        //显示头游
        let endType = posEndList.endType;//游数  0为默认值
        if(endType=="ONE"){
            this.you.string="头游";
        }/*else if(endType=="TWO"){
            this.you.string="二游";
        }else if(endType=="THREE"){
            this.you.string="三游";
        }else if(endType=="FOUR"){
            this.you.string="";
        }*/else{
            this.you.string="";
        }

        let record = this.node.getChildByName("record");
        //显示得分
        //赏分
        //record.getChildByName('lb_shangfen').getComponent(cc.Label).string = posEndList.totalShangNum;
        if(posEndList.prizePoint>0){
            record.getChildByName('lb_taoshangfen').getComponent(cc.Label).string = "+" + posEndList.prizePoint;
        }else{
            record.getChildByName('lb_taoshangfen').getComponent(cc.Label).string = posEndList.prizePoint;
        }
        if(posEndList.winLosePoint>0){
            record.getChildByName('lb_shuying').getComponent(cc.Label).string = "+" + posEndList.winLosePoint;
        }else{
            record.getChildByName('lb_shuying').getComponent(cc.Label).string = posEndList.winLosePoint;
        }
        if(posEndList.point>0){
            record.getChildByName('lb_point').getComponent(cc.Label).string = "+" + posEndList.point;
        }else{
            record.getChildByName('lb_point').getComponent(cc.Label).string = posEndList.point;
        }
        //比赛分
        if (typeof(posEndList.sportsPoint)!="undefined") {
            if(posEndList.sportsPoint > 0){
                record.getChildByName('lb_sportsPoint').getComponent(cc.Label).string = "+" + posEndList.sportsPoint;
            }else{
                record.getChildByName('lb_sportsPoint').getComponent(cc.Label).string = posEndList.sportsPoint;
            }
        }else{
             record.getChildByName('lb_sportsPoint').getComponent(cc.Label).string = '';
        }

        //
        // if (posEndList.totalPoint > 0) {
        //     PlayerNode.getChildByName('lb_zdf').getComponent(cc.Label).string = "+" + posEndList.totalPoint;
        // } else {
        //     PlayerNode.getChildByName('lb_zdf').getComponent(cc.Label).string = posEndList.totalPoint;
        // }

        //显示牌
        let prizeCardList = [];
        let shangScrollView = this.node.getChildByName('scrollview');
        let layout = shangScrollView.getChildByName('layout');
        layout.removeAllChildren();
        console.log('当前显示的玩家是', posEndList);
        let bombPrizeList = [];
        let numStr = "";
        if(!setEnd.biShangFlag){
            bombPrizeList = posEndList.bombPrizeList;//[cardList:{}]
            
        }else{
            bombPrizeList = posEndList.biJiangList;//[cardList:{}]
        }
        for (let l = 0; l < bombPrizeList.length; l++) {
            let shangLayOut = cc.instantiate(this.prefab_shang);
            layout.addChild(shangLayOut);
            let cardList = bombPrizeList[l];
            numStr = "x" + cardList.length;
            if(setEnd.biShangFlag){
                cardList = bombPrizeList[l].cardList;
                numStr = bombPrizeList[l].prize + "奖";
            }
            shangLayOut.getChildByName("num").getComponent(cc.Label).string = numStr;
            for (var z = 0; z < cardList.length; z++) {
                let cardNode = cc.instantiate(this.prefab_card);
                let cardValue = cardList[z];
                this.ShowCard(cardValue, cardNode, 0, true, false, false, false);
                shangLayOut.getChildByName("layout").addChild(cardNode);
            }
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
