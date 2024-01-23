"use strict";
cc._RF.push(module, 'f8019KcIY5AW6kR5MYzAWqe', 'ddz_winlost_child');
// script/ui/uiGame/ddz/ddz_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
    extends: require("BasePoker_winlost_child"),

    properties: {},

    // use this for initialization
    OnLoad: function OnLoad() {},
    ShowSpecData: function ShowSpecData(setEnd, playerAll, index) {
        var player = setEnd.posResultList[index];

        //地主标识
        if (player.isLandowner) {
            this.node.getChildByName("user_info").getChildByName("icon_dzm").active = true;
        } else {
            this.node.getChildByName("user_info").getChildByName("icon_dzm").active = false;
        }
        //倍数
        this.node.getChildByName("lb_beiShu").active = true;
        var beishu = this.node.getChildByName("lb_beiShu").getComponent(cc.Label);

        beishu.string = player.doubleNum;

        //底分
        this.node.getChildByName("lb_difen").active = true;
        var difen = this.node.getChildByName("lb_difen").getComponent(cc.Label);
        difen.string = player.baseMark;

        //显示春天或者反春天
        var icon_robClose = this.node.getChildByName("icon_robClose");
        icon_robClose.active = true;

        if (player.robClose == -1) {
            icon_robClose.getComponent(cc.Sprite).spriteFrame = this.icon_fct;
        } else if (player.robClose == 1) {
            icon_robClose.getComponent(cc.Sprite).spriteFrame = this.icon_ct;
        } else {
            icon_robClose.active = false;
        }
    }
});

cc._RF.pop();