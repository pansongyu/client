"use strict";
cc._RF.push(module, '2647fU+Xo5ELbOax7slYkUM', 'htmj_detail_child');
// script/ui/uiGame/htmj/htmj_detail_child.js

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
    jiesuan.getChildByName('top').getChildByName('lb_dahu').getComponent(cc.Label).string = huData.daHuPoint;
    jiesuan.getChildByName('top').getChildByName('lb_xiaohu').getComponent(cc.Label).string = huData.xiaoHuPoint;
  }
});

cc._RF.pop();