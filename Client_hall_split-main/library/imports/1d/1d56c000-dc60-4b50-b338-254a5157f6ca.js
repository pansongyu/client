"use strict";
cc._RF.push(module, '1d56cAA3GBLULM4JUpRV/bK', 'sxmj_detail_child');
// script/ui/uiGame/sxmj/sxmj_detail_child.js

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
    jiesuan.getChildByName('top').getChildByName('lb_dianpao').getComponent(cc.Label).string = huData.dianPaoPoint;
    jiesuan.getChildByName('top').getChildByName('lb_jiepao').getComponent(cc.Label).string = huData.jiePaoPoint;
    jiesuan.getChildByName('top').getChildByName('lb_zimo').getComponent(cc.Label).string = huData.ziMoPoint;
  }
});

cc._RF.pop();