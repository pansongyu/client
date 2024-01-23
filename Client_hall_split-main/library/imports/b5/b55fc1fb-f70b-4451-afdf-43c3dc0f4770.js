"use strict";
cc._RF.push(module, 'b55fcH79wtEUa/fQ8PcD0dw', 'jxhs_winlost_child');
// script/ui/uiGame/jxhs/jxhs_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
    extends: require("BasePoker_winlost_child"),

    properties: {
        dudiyou_icon: [cc.SpriteFrame],
        icon_you: [cc.SpriteFrame]
    },

    // use this for initialization
    OnLoad: function OnLoad() {},
    ShowPlayerData: function ShowPlayerData(setEnd, playerAll, index) {
        var player = setEnd.posResultList[index];

        var point = player.point;
        var roomPoint = player.roomPoint;
        var ranksScore = player.ranksScore;

        var dPos = setEnd.dPos;

        //显示庄
        this.node.getChildByName("user_info").getChildByName("zhuangjia").active = player.pos == dPos;

        //玩家分数
        var winNode = this.node.getChildByName("lb_win_num");
        var loseNode = this.node.getChildByName("lb_lose_num");
        winNode.active = false;
        loseNode.active = false;

        if (point > 0) {
            winNode.active = true;
            winNode.getComponent(cc.Label).string = "+" + point;
        } else {
            loseNode.active = true;
            loseNode.getComponent(cc.Label).string = point;
        }
        if (ranksScore > 0) {
            this.node.getChildByName("user_info").getChildByName("bg_win").active = true;
            this.node.getChildByName("user_info").getChildByName("bg_lost").active = false;
        } else if (ranksScore < 0) {
            this.node.getChildByName("user_info").getChildByName("bg_win").active = false;
            this.node.getChildByName("user_info").getChildByName("bg_lost").active = true;
        } else {
            this.node.getChildByName("user_info").getChildByName("bg_win").active = false;
            this.node.getChildByName("user_info").getChildByName("bg_lost").active = false;
        }

        //显示游数
        var endType = player.endType; //游数  0为默认值
        var finishOrder = 0;
        if (endType == "ONE") {
            finishOrder = 1;
        } else if (endType == "TWO") {
            finishOrder = 2;
        } else if (endType == "THREE") {
            finishOrder = 3;
        } else if (endType == "FOUR") {
            finishOrder = 4;
        } else {
            finishOrder = -1;
        }
        if (finishOrder > 0) {
            this.node.getChildByName("user_info").getChildByName('you').getComponent(cc.Sprite).spriteFrame = this.icon_you[finishOrder - 1];
        } else {
            this.node.getChildByName("user_info").getChildByName('you').getComponent(cc.Sprite).spriteFrame = "";
        }

        //显示敌友
        var ranksType = player.ranksType;
        if (ranksType == 0) {
            this.node.getChildByName("user_info").getChildByName('img_du').getComponent(cc.Sprite).spriteFrame = "";
        } else {
            this.node.getChildByName("user_info").getChildByName('img_du').getComponent(cc.Sprite).spriteFrame = this.dudiyou_icon[ranksType - 1];
        }

        var liangRedTenList = player.liangRedTenList;
        this.node.getChildByName("user_info").getChildByName('img_liang').active = liangRedTenList.length;
        //亮牌翻倍
        this.node.getChildByName("user_info").getChildByName('lb_fanbei').active = player.isFan;

        //房间分
        var lb_roomPoint = this.node.getChildByName("lb_roomPoint");
        if (roomPoint > 0) {
            lb_roomPoint.getComponent(cc.Label).string = "+" + roomPoint;
        } else {
            lb_roomPoint.getComponent(cc.Label).string = roomPoint;
        }
        //比赛分
        var lb_sportsPointTitle = this.node.getChildByName("lb_sportsPointTitle");
        if (player.sportsPoint) {
            if (player.sportsPoint > 0) {
                lb_sportsPointTitle.active = true;
                lb_sportsPointTitle.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = "+" + player.sportsPoint;
            } else {
                lb_sportsPointTitle.active = true;
                lb_sportsPointTitle.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = player.sportsPoint;
            }
        } else {
            lb_sportsPointTitle.active = false;
        }

        var playerInfo = null;
        for (var i = 0; i < playerAll.length; i++) {
            if (player.pid == playerAll[i].pid) {
                playerInfo = playerAll[i];
                break;
            }
        }

        var head = this.node.getChildByName("user_info").getChildByName("mask").getChildByName("head_img").getComponent("WeChatHeadImage");
        head.ShowHeroHead(playerInfo.pid);
        //玩家名字
        var playerName = "";
        playerName = playerInfo.name;
        if (playerName.length > 6) {
            playerName = playerName.substring(0, 6) + '...';
        }
        var name = this.node.getChildByName("user_info").getChildByName("lable_name").getComponent(cc.Label);
        name.string = playerName;

        var id = this.node.getChildByName("user_info").getChildByName("label_id").getComponent(cc.Label);
        id.string = "ID:" + app.ComTool().GetPid(playerInfo["pid"]);
    }
});

cc._RF.pop();