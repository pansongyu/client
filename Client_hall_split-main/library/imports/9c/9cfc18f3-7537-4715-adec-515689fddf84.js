"use strict";
cc._RF.push(module, '9cfc1jzdTdHFa3sUVaJ/d+E', 'px6gt_winlost_child');
// script/ui/uiGame/px6gt/px6gt_winlost_child.js

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
        //阵营
        var lb_zhenying = this.node.getChildByName("contentLayout").getChildByName("lb_zhenying");
        lb_zhenying.active = true;
        var zhenying = lb_zhenying.getComponent(cc.Label);
        if (player.isRed) {
            zhenying.string = "红方";
        } else {
            zhenying.string = "蓝方";
        }

        //底分
        var lb_difen = this.node.getChildByName("contentLayout").getChildByName("lb_difen");
        lb_difen.active = true;
        var difen = lb_difen.getComponent(cc.Label);
        difen.string = player.baseScore;

        //奖分
        var lb_jiangfen = this.node.getChildByName("contentLayout").getChildByName("lb_jiangfen");
        lb_jiangfen.active = true;
        var jiangfen = lb_jiangfen.getComponent(cc.Label);
        jiangfen.string = player.rewardScore;

        //认奖分
        var lb_renjiang = this.node.getChildByName("contentLayout").getChildByName("lb_renjiang");
        lb_renjiang.active = true;
        var renjiang = lb_renjiang.getComponent(cc.Label);
        renjiang.string = player.renJiang;

        //臭庄
        var lb_chouzhuang = this.node.getChildByName("contentLayout").getChildByName("lb_chouzhuang");
        lb_chouzhuang.active = true;
        var chouzhuang = lb_chouzhuang.getComponent(cc.Label);
        chouzhuang.string = player.chouZhuang;
    }
});

cc._RF.pop();