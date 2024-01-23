"use strict";
cc._RF.push(module, '8ab15CofGZKnJMWaf/6nqOE', 'dle_winlost_child');
// script/ui/uiGame/dle/dle_winlost_child.js

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

    //抓分
    var lb_sheng2 = this.node.getChildByName("contentLayout").getChildByName("lb_sheng2");
    lb_sheng2.active = true;
    var sheng2 = lb_sheng2.getComponent(cc.Label);
    sheng2.string = player.twoRestNum;
  }
});

cc._RF.pop();