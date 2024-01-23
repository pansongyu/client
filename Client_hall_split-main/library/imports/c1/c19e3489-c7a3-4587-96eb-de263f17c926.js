"use strict";
cc._RF.push(module, 'c19e3SJx6NFh5br3iY/F8km', 'xyzb_winlost_child');
// script/ui/uiGame/xyzb/xyzb_winlost_child.js

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
        if (player.ranksType == 1) {
            zhenying.string = "红方";
        } else if (player.ranksType == 2) {
            zhenying.string = "蓝方";
        }

        var contentLayout = this.node.getChildByName("contentLayout");
        //奖分
        contentLayout.getChildByName("lb_jiangfen").getComponent(cc.Label).string = player.prizePoint;
        //输赢分
        contentLayout.getChildByName("lb_shuyingfen").getComponent(cc.Label).string = player.basePoint;
        //得分
        contentLayout.getChildByName("lb_defen").getComponent(cc.Label).string = player.point;
        //总得分
        contentLayout.getChildByName("lb_zongdefen").getComponent(cc.Label).string = player.roomPoint;
    }
});

cc._RF.pop();