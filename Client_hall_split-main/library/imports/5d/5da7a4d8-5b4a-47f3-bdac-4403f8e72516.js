"use strict";
cc._RF.push(module, '5da7aTYW0pH872sRAP45yUW', 'wnpdk_detail_child');
// script/ui/uiGame/wnpdk/wnpdk_detail_child.js

"use strict";

/*

 */

var app = require("app");

cc.Class({
    extends: require("BaseComponent"),

    properties: {},

    // use this for initialization
    OnLoad: function OnLoad() {},
    ShowPlayerData: function ShowPlayerData(resultsList, playerAll, idx) {
        var data = resultsList[idx];
        var userInfo = this.node.getChildByName("user_info");
        if (userInfo) {
            userInfo.getChildByName("mask").getChildByName("head_img").getComponent("WeChatHeadImage").ShowHeroHead(data.pid);
            userInfo.getChildByName("label_id").getComponent(cc.Label).string = "ID:" + app.ComTool().GetPid(data.pid);
            for (var index in playerAll) {
                var player = playerAll[index];
                if (player.pid == data.pid) {
                    userInfo.getChildByName("lable_name").getComponent(cc.Label).string = player.name;
                    break;
                }
            }
        }
        this.node.getChildByName("lb_win").getComponent(cc.Label).string = data.winCount;
        this.node.getChildByName("lb_lose").getComponent(cc.Label).string = data.loseCount;
        if (data.point >= 0) {
            this.node.getChildByName("lb_win_num").getComponent(cc.Label).string = "+" + data.point;
            this.node.getChildByName("lb_win_num").active = true;
            this.node.getChildByName("lb_lose_num").active = false;
        } else {
            this.node.getChildByName("lb_lose_num").getComponent(cc.Label).string = data.point;
            this.node.getChildByName("lb_win_num").active = false;
            this.node.getChildByName("lb_lose_num").active = true;
        }
        //比赛分
        if (typeof data.sportsPoint != "undefined") {
            this.node.getChildByName("lb_sportsPoint").active = true;
            if (data.sportsPoint > 0) {
                this.node.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = "+" + data.sportsPoint;
            } else {
                this.node.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = data.sportsPoint;
            }
        } else {
            this.node.getChildByName("lb_sportsPoint").active = false;
        }
    }
});

cc._RF.pop();