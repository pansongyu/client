"use strict";
cc._RF.push(module, '695eb0oVPhKXorKBP23GYZD', 'lhmj_detail_child');
// script/ui/uiGame/lhmj/lhmj_detail_child.js

"use strict";

/*

 */

var app = require("app");

cc.Class({
  extends: require("BaseMJ_detail_child"),

  properties: {},

  // use this for initialization
  OnLoad: function OnLoad() {},
  huTypesShow: function huTypesShow(jiesuan, huData) {
    // jiesuan.getChildByName('top').getChildByName('lb_angang').getComponent(cc.Label).string=huData.anGangPoint;
    // jiesuan.getChildByName('top').getChildByName('lb_minggang').getComponent(cc.Label).string=huData.mingGangPoint;
    jiesuan.getChildByName('top').getChildByName('lb_zimo').getComponent(cc.Label).string = huData.ziMoPoint;
    jiesuan.getChildByName('top').getChildByName('lb_hupao').getComponent(cc.Label).string = huData.jiePaoPoint;
    jiesuan.getChildByName('top').getChildByName('lb_dianpao').getComponent(cc.Label).string = huData.dianPaoPoint;
  }
});

cc._RF.pop();