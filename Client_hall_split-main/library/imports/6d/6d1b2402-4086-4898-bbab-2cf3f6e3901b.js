"use strict";
cc._RF.push(module, '6d1b2QCQIZImLurLPP245Ab', 'gd_winlost_child');
// script/ui/uiGame/gd/gd_winlost_child.js

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
        var jiPaiSteps = -1;
        if (player.isRed) {
            zhenying.string = "红方";
            jiPaiSteps = player["redSteps"];
        } else {
            zhenying.string = "蓝方";
            jiPaiSteps = player["blueSteps"];
        }

        //底分
        var lb_jipai = this.node.getChildByName("contentLayout").getChildByName("lb_jipai");
        lb_jipai.active = true;
        var jipai = lb_jipai.getComponent(cc.Label);
        jipai.string = jiPaiSteps;
    }
});

cc._RF.pop();