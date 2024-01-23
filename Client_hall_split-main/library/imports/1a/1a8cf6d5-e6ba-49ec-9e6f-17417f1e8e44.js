"use strict";
cc._RF.push(module, '1a8cfbV5rpJ7J5vF0F/Ho5E', 'gdy_winlost_child');
// script/ui/uiGame/gdy/gdy_winlost_child.js

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

        //倍数
        this.node.getChildByName("lb_beiShu").active = true;
        var beishu = this.node.getChildByName("lb_beiShu").getComponent(cc.Label);

        beishu.string = player.springPoint;

        //底分
        this.node.getChildByName("lb_difen").active = true;
        var difen = this.node.getChildByName("lb_difen").getComponent(cc.Label);
        difen.string = player.privateCardSize;
    }
});

cc._RF.pop();