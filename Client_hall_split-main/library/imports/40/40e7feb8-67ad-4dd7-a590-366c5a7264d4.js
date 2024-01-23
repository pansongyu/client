"use strict";
cc._RF.push(module, '40e7f64Z61N16WQNmxacmTU', 'zkmj_detail_child');
// script/ui/uiGame/zkmj/zkmj_detail_child.js

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
    jiesuan.getChildByName('top').getChildByName('lb_angang').getComponent(cc.Label).string = huData.anGangPoint;
    jiesuan.getChildByName('top').getChildByName('lb_minggang').getComponent(cc.Label).string = huData.mingGangPoint;
    jiesuan.getChildByName('top').getChildByName('lb_zimo').getComponent(cc.Label).string = huData.ziMoPoint;
  }
});

cc._RF.pop();