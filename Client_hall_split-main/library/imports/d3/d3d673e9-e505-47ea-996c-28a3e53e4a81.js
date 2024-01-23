"use strict";
cc._RF.push(module, 'd3d67Pp5QVH6plsKKPlPkqB', 'aypdk_winlost_child');
// script/ui/uiGame/aypdk/aypdk_winlost_child.js

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
      // //倍数默认1

      //剩余牌数
      this.node.getChildByName("lb_paishu").active = true;
      var paishu = this.node.getChildByName("lb_paishu").getComponent(cc.Label);
      paishu.string = player.surplusCardList[index];
   }
});

cc._RF.pop();