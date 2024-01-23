"use strict";
cc._RF.push(module, '88a9eEh/ixFyreivNShtAPp', 'zznsb_winlost_child');
// script/ui/uiGame/zznsb/zznsb_winlost_child.js

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
        app["rcwsk_PokerCard"] = require("rcwsk_PokerCard").GetModel;
        this.ComTool = app.ComTool();
        this.ShareDefine = app.ShareDefine();
        this.PokerCard = app.rcwsk_PokerCard();
    },
    ShowPlayerJieSuan: function ShowPlayerJieSuan() {},
    ShowPlayerHuaCard: function ShowPlayerHuaCard() {},

    ShowPlayerHuImg: function ShowPlayerHuImg(huNode, huTypeName) {},

    onPlusScore: function onPlusScore(s) {
        if (s > 0) {
            return '+' + s;
        }
        return s;
    },


    ShowPlayerData: function ShowPlayerData(setEnd, playerAll, index) {
        var posResultList = setEnd["posResultList"];
        var posEnd = posResultList[index];
        var PlayerNode = this.node;
        var pos = posEnd.pos;
        var playerInfo = playerAll[index];
        //显示玩家姓名
        if (posEnd.ranksType == 1) {
            PlayerNode.getChildByName('lb_rank').getComponent(cc.Label).string = "红方";
        } else {
            PlayerNode.getChildByName('lb_rank').getComponent(cc.Label).string = "蓝方";
        }
        PlayerNode.getChildByName('lb_name').getComponent(cc.Label).string = playerInfo["name"];
        PlayerNode.getChildByName('lb_id').getComponent(cc.Label).string = 'ID:' + this.ComTool.GetPid(playerInfo["pid"]);
        //头像  .children[0] 圆形遮罩
        var WeChatHeadImage = PlayerNode.getChildByName('head').getComponent("WeChatHeadImage");
        WeChatHeadImage.ShowHeroHead(playerInfo["pid"]);
        //显示头游
        var endType = posEnd.endType; //游数  0为默认值
        var finishOrder = 0;
        if (endType == "ONE") {
            PlayerNode.getChildByName('lb_you').getComponent(cc.Label).string = "一游";
        } else if (endType == "TWO") {
            PlayerNode.getChildByName('lb_you').getComponent(cc.Label).string = "二游";
        } else if (endType == "THREE") {
            PlayerNode.getChildByName('lb_you').getComponent(cc.Label).string = "三游";
        } else if (endType == "FOUR") {
            PlayerNode.getChildByName('lb_you').getComponent(cc.Label).string = "四游";
        } else {
            PlayerNode.getChildByName('lb_you').getComponent(cc.Label).string = "";
        }
        //显示得分
        //赏分
        PlayerNode.getChildByName('lb_shaoZhuangPoint').getComponent(cc.Label).string = posEnd.shaoZhuangPoint;
        PlayerNode.getChildByName('lb_mingCiFen').getComponent(cc.Label).string = posEnd.mingCiFen;
        PlayerNode.getChildByName('lb_chifen').getComponent(cc.Label).string = posEnd.chiFenPoint;
        PlayerNode.getChildByName('lb_touYouPoint').getComponent(cc.Label).string = posEnd.touYouPoint;
        PlayerNode.getChildByName('lb_roompoint').getComponent(cc.Label).string = posEnd.zongPoint;

        if (posEnd.pid == app.HeroManager().GetHeroID()) {
            PlayerNode.getChildByName('ziji').active = true;
        } else {
            PlayerNode.getChildByName('ziji').active = false;
        }
        //比赛分消耗
        var sportsPoint = posEnd["sportsPoint"];
        var lb_sportsPoint = PlayerNode.getChildByName("lb_sportsPoint");
        if (typeof sportsPoint != "undefined") {
            if (sportsPoint > 0) {
                lb_sportsPoint.getComponent(cc.Label).string = "+" + sportsPoint;
            } else {
                lb_sportsPoint.getComponent(cc.Label).string = "" + sportsPoint;
            }
            lb_sportsPoint.active = true;
        } else {
            lb_sportsPoint.active = false;
        }
        PlayerNode.active = true;
    }

});

cc._RF.pop();