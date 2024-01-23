"use strict";
cc._RF.push(module, '17724RGXhJIwI3EEMjq8I0L', 'fddz_winlost_child');
// script/ui/uiGame/fddz/fddz_winlost_child.js

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
              if (player.isRed) {
                     zhenying.string = "红方";
              } else {
                     zhenying.string = "蓝方";
              }

              //名次
              var lb_mingci = this.node.getChildByName("contentLayout").getChildByName("lb_mingci");
              lb_mingci.active = true;
              var difen = lb_mingci.getComponent(cc.Label);
              difen.string = "";
              if (player.finishOrder > 0) {
                     difen.string = player.finishOrder;
              }

              //奖分
              var lb_jiangfen = this.node.getChildByName("contentLayout").getChildByName("lb_jiangfen");
              lb_jiangfen.active = true;
              var jiangfen = lb_jiangfen.getComponent(cc.Label);
              jiangfen.string = player.rewardScore;

              //抓分
              var lb_zhuafen = this.node.getChildByName("contentLayout").getChildByName("lb_zhuafen");
              lb_zhuafen.active = true;
              var renjiang = lb_zhuafen.getComponent(cc.Label);
              renjiang.string = player.score;
       }
});

cc._RF.pop();