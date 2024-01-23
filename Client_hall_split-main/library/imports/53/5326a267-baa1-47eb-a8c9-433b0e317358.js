"use strict";
cc._RF.push(module, '5326aJnuqFH66jJQzsOMXNY', 'fjyxmj_detail_child');
// script/ui/uiGame/fjyxmj/fjyxmj_detail_child.js

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
    jiesuan.getChildByName('top').getChildByName('lb_gang').getComponent(cc.Label).string = huData.gangCount;
    jiesuan.getChildByName('top').getChildByName('lb_danyou').getComponent(cc.Label).string = huData.danYouPoint;
    jiesuan.getChildByName('top').getChildByName('lb_shuangyou').getComponent(cc.Label).string = huData.shuangYouPoint;
    jiesuan.getChildByName('top').getChildByName('lb_sanyou').getComponent(cc.Label).string = huData.sanYouPoint;
  }
});

cc._RF.pop();