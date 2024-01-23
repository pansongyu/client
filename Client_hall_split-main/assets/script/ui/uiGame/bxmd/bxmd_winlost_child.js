/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
    extends: require("BasePoker_winlost_child"),

    properties: {},

    // use this for initialization
    OnLoad: function () {

    },
    ShowSpecData: function (setEnd, playerAll, index) {
        this.node.getChildByName("img_huo").active = false;
        this.node.getChildByName("img_sl").active = false;
        this.node.getChildByName("img_sb").active = false;
        this.node.getChildByName("lb_lose_num").active = true;
        this.node.getChildByName("lb_win_num").active = true;
        this.node.getChildByName("lb_lose_num").getComponent(cc.Label).string = "";
        this.node.getChildByName("lb_win_num").getComponent(cc.Label).string = "";
        console.log("ShowSpecData", setEnd, playerAll, index);
        let posResultList = setEnd["posResultList"];
        let endPos = posResultList[index];
        let endType = endPos["endType"];
        let state = endPos["state"];
        let k510Point = endPos["k510Point"];
        let xiPoint = endPos["xiPoint"];
        let totalPoint = endPos["totalPoint"];
        let ranksType = endPos["ranksType"];
        let danZhuaPoint = endPos["danZhuaPoint"];
        let tiPoint = endPos["tiPoint"];
        let winLosePoint = endPos["winLosePoint"];
        let youshuDict = {
            "NOT": "",
            "ONE": "一游",
            "TWO": "二游",
            "THREE": "三游",
            "FOUR": "四游"
        };
        let zhuaStrz = "双抓";
        let zhuaStry = "双抓";
        if (danZhuaPoint == 20) {
            zhuaStrz = "单抓";
        }
        this.node.getChildByName("lb_youshu").getComponent(cc.Label).string = youshuDict[endType];
        this.node.getChildByName("lb_zhuafen").getComponent(cc.Label).string = "抓分:" + k510Point;
        this.node.getChildByName("lb_xifen").getComponent(cc.Label).string = "喜分:" + xiPoint;
        this.node.getChildByName("lb_duiwufen").getComponent(cc.Label).string = "队伍得分:" + totalPoint;
        if (ranksType == 1) {
            this.node.getChildByName("lb_beizhuafen").getComponent(cc.Label).string = "被" + zhuaStrz + danZhuaPoint;
            this.node.getChildByName("img_huo").active = true;
        } else if (ranksType == 2) {
            this.node.getChildByName("lb_beizhuafen").getComponent(cc.Label).string = zhuaStry + danZhuaPoint;
        }
        this.node.getChildByName("lb_tifen").getComponent(cc.Label).string = "剔分:" + tiPoint;
        if (state == "WIN") {
            this.node.getChildByName("img_sl").active = true;
        } else if (state == "LOSE") {
            this.node.getChildByName("img_sb").active = true;
        }
        if (winLosePoint > 0) {
            this.node.getChildByName("lb_win_num").getComponent(cc.Label).string = "+" + winLosePoint;
        } else {
            this.node.getChildByName("lb_lose_num").getComponent(cc.Label).string = winLosePoint;
        }
    },
});
