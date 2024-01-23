/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
    extends: require("BaseMJ_winlost_child"),

    properties: {
        icon_identity: [cc.SpriteFrame],
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

    onPlusScore(s) {
        if (s > 0) {
            return '+' + s;
        }
        return s;
    },

    UpdatePlayData: function (PlayerNode, HuList, PlayerInfo, jin1 = 0, jin2 = 0, maPaiLst = null) {
        this.HuList = HuList;
        this.showLabelNum = 1;
        this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo, HuList);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
        this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'), HuList.huaList);
    },
    ShowPlayerRecord: function(ShowNode, huInfo) {
        let absNum = Math.abs(huInfo["point"]);
        ShowNode.getChildByName('lb_record_win').active = false;
        ShowNode.getChildByName('lb_record_lost').active = false;
        if (absNum > 10000) {
            let shortNum = (absNum / 10000).toFixed(2);
            if (huInfo["point"] > 0) {
                ShowNode.getChildByName('lb_record_win').getComponent("cc.Label").string = '+' + shortNum + "万";
                ShowNode.getChildByName('lb_record_win').active = true;
            } else {
                ShowNode.getChildByName('lb_record_lost').getComponent("cc.Label").string = '-' + shortNum + "万";
                ShowNode.getChildByName('lb_record_lost').active = true;
            }
        } else {
            if (huInfo["point"] > 0) {
                ShowNode.getChildByName('lb_record_win').getComponent("cc.Label").string = '+' + huInfo["point"];
                ShowNode.getChildByName('lb_record_win').active = true;
            } else {
                ShowNode.getChildByName('lb_record_lost').getComponent("cc.Label").string = huInfo["point"];
                ShowNode.getChildByName('lb_record_lost').active = true;
            }
        }
        //显示比赛分
        if (typeof(huInfo.sportsPoint) != "undefined") {
            ShowNode.getChildByName('lb_sportspoint').active = true;
            if (huInfo.sportsPoint > 0) {
                ShowNode.getChildByName('lb_sportspoint').getComponent("cc.Label").string = "比赛分:+" + huInfo.sportsPoint;
            } else {
                ShowNode.getChildByName('lb_sportspoint').getComponent("cc.Label").string = "比赛分:" + huInfo.sportsPoint;
            }
        } else {
            ShowNode.getChildByName('lb_sportspoint').active = false;;
        }
    },
    ShowPlayerData: function (setEnd, playerAll, index) {
        console.log('包王单局战绩数据', setEnd, playerAll, index);
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
        //显示头像，如果头像UI
        if (PlayerInfo["pid"] && PlayerInfo["iconUrl"]) {
            app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"], PlayerInfo["iconUrl"]);
        }
        let weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);

        //
        let posEndList = posResultList[index];
        //显示身份
        let playerType = posEndList.playerType; //身份  0为默认值
        let playerCount = -1;
        if (playerType == "NOT") {
            playerCount = 0;
        } else if (playerType == "NongMin") {
            playerCount = 1;
        } else if (playerType == "DiZhu") {
            playerCount = 2;
        } else if (playerType == "DaDiZhu") {
            playerCount = 3;
        } else {
            playerCount = -1;
        }
        if (playerCount > -1) {
            this.node.getChildByName("user_info").getChildByName("identity").getComponent(cc.Sprite).spriteFrame = this.icon_identity[playerCount];
        } else {
            this.node.getChildByName("user_info").getChildByName("identity").getComponent(cc.Sprite).spriteFrame = '';
        }
        //显示游数
        let endType = posEndList.endType; //游数  0为默认值
        let finishOrder = "";
        if (endType == "ONE") {
            finishOrder = "头游";
        } else if (endType == "TWO") {
            finishOrder = "二游";
        } else if (endType == "THREE") {
            finishOrder = "三游";
        } else if (endType == "FOUR") {
            finishOrder = "末游";
        } else {
            finishOrder = "";
        }
        this.node.getChildByName("user_info").getChildByName("you").getComponent(cc.Label).string = finishOrder;
        

        //牌型奖
        let layout = this.node.getChildByName('jiesuan').getChildByName('layout')
        for (let i = 0; i < layout.children.length; i++) {
            layout.children[i].active = false;
        }

        //四条双鬼
        let paiXingJiangLiMap = posEndList.paiXingJiangLiMap;
        for(let key in paiXingJiangLiMap){
            if(key == "SiTiao"){
                layout.getChildByName("sitiao").active = true;
                layout.getChildByName("sitiao").getComponent(cc.Label).string = "四条x" + paiXingJiangLiMap[key];
            }else if(key == "ShuangGui"){
                layout.getChildByName("shuanggui").active = true;
                layout.getChildByName("shuanggui").getComponent(cc.Label).string = "双鬼x" + paiXingJiangLiMap[key];
            }
        }
    }
});
