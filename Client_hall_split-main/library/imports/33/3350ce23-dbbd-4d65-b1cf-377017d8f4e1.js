"use strict";
cc._RF.push(module, '3350c4j271NZbHPN3AX2PTh', 'sd_winlost_child');
// script/ui/uiGame/sd/sd_winlost_child.js

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

        this.node.getChildByName("lb_zhadanfen").active = true;
        var lb_zhadanfen = this.node.getChildByName("lb_zhadanfen").getComponent(cc.Label);
        lb_zhadanfen.string = player.zhaDanFen;
        //剩余牌数
        if (player.shouCard.length > 0) {
            this.node.getChildByName("lb_paishu").active = true;
            var paishu = this.node.getChildByName("lb_paishu").getComponent(cc.Label);
            paishu.string = player.shouCard.length;
        } else {
            this.node.getChildByName("lb_paishu").active = false;
        }
    }
});

cc._RF.pop();