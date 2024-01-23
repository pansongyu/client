"use strict";
cc._RF.push(module, '816533oewdGb6+rF9ogSA1N', 'zgz_winlost_child');
// script/ui/uiGame/zgz/zgz_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
    extends: require("BaseComponent"),

    properties: {
        img_endType: [cc.SpriteFrame]
    },

    // use this for initialization
    OnLoad: function OnLoad() {},
    ShowPlayerData: function ShowPlayerData(setEnd, playerAll, index) {
        var player = setEnd.posResultList[index];

        var point = player.point;
        this.ranksType = -1;
        var posResultList = setEnd["posResultList"];
        var myPid = app["HeroManager"]().GetHeroProperty("pid");
        for (var i = 0; i < posResultList.length; i++) {
            var posResult = posResultList[i];
            var pid = posResult["pid"];
            var ranksType = posResult["ranksType"];
            if (myPid == pid) {
                this.ranksType = ranksType;
                break;
            }
        }
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

        //倍数
        this.node.getChildByName("lb_beiShu").active = true;
        var beishu = this.node.getChildByName("lb_beiShu").getComponent(cc.Label);
        beishu.string = setEnd["beiShu"];
        //游数
        var youNumDict = {
            "ONE": 1,
            "TWO": 2,
            "THREE": 3,
            "FOUR": 4,
            "FIVE": 5,
            "SIX": 6
        };
        this.node.getChildByName("img_endType").active = true;
        var img_endType = this.node.getChildByName("img_endType").getComponent(cc.Sprite);
        img_endType.spriteFrame = this.img_endType[youNumDict[player["endType"]]];

        this.node.getChildByName("img_huoban").active = false;
        if (this.ranksType == player.ranksType) {
            this.node.getChildByName("img_huoban").active = true;
        }

        var playerInfo = null;
        for (var _i = 0; _i < playerAll.length; _i++) {
            if (player.pid == playerAll[_i].pid) {
                playerInfo = playerAll[_i];
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