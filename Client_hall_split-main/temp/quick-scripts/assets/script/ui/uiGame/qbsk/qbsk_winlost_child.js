(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/qbsk/qbsk_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '79c59LA0SdP2p0SNeyYy4VE', 'qbsk_winlost_child', __filename);
// script/ui/uiGame/qbsk/qbsk_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
    extends: require("BaseComponent"),

    properties: {
        icon_you: [cc.SpriteFrame]
    },

    // use this for initialization
    OnLoad: function OnLoad() {},
    ShowPlayerData: function ShowPlayerData(setEnd, playerAll, index) {
        var player = setEnd.posResultList[index];

        var point = player.point;

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
            this.node.getChildByName('you').getComponent(cc.Sprite).spriteFrame = this.icon_you[finishOrder - 1];
        } else {
            this.node.getChildByName('you').getComponent(cc.Sprite).spriteFrame = "";
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
        this.node.getChildByName("lb_beiShu").getComponent(cc.Label).string = player.beiShu;

        //贡献分
        var symbol = player.gongXianPoint > 0 ? "+" : "";
        this.node.getChildByName("lb_gongXian").getComponent(cc.Label).string = symbol + player.gongXianPoint;

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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=qbsk_winlost_child.js.map
        