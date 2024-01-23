"use strict";
cc._RF.push(module, '0ed20Pe3l9HD6VrGyYiHDIS', 'chmj_winlost_child');
// script/ui/uiGame/chmj/chmj_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
   extends: require("BaseMJ_winlost_child"),

   properties: {},

   // use this for initialization
   OnLoad: function OnLoad() {
      this.ComTool = app.ComTool();
      this.ShareDefine = app.ShareDefine();
   },
   LabelName: function LabelName(huType) {
      var LabelArray = {
         DPPH: "点炮平胡",
         DPYD: "点炮压挡",
         ZMPH: "自摸平胡",
         ZMYD: "自摸压挡",
         Gang: "杠",
         AnGang: "暗杠",
         PiaoZi: "漂子",
         Point: "底分",
         //
         PingHu: "平胡",
         YaDang: "压挡",
         Fa4: "发财",
         PPHu: "对对胡",
         Long: "一条龙",
         SYZhi: "十一支",
         SiHuo: "四活",
         DuanDui: "断对",
         HDLY: "海底捞月",
         BQRen: "不求人",
         GSKH: "杠上开花",
         QuanQiuR: "全求人",
         QingDi: "清底",
         KZYa: "枯枝压",
         HYS: "混一色",
         QYS: "清一色",
         TianHu: "天胡"
      };

      return LabelArray[huType];
   }
   // LabelName:function(huType){
   //     let LabelArray=[];
   //     LabelArray["Hua"]="花番";
   //     LabelArray["ZiMo"]="自摸";
   //     LabelArray["JieGang"]="接杠";
   //     LabelArray["AnGang"]="暗杠";
   //     LabelArray["Gang"]="补杠";
   //     LabelArray["GSKH"]="杠上开花";
   //     LabelArray["QGHu"]="抢杠胡";
   //     LabelArray["Hua"]="花数";
   //     LabelArray["SanJinDao"]="三金倒";
   //     LabelArray["DanYou"]="单游";
   //     LabelArray["ShuangYou"]="双游";
   //     LabelArray["SanYou"]="三游";
   //     LabelArray["SiJinDao"]="四金倒";
   //     LabelArray["WuJinDao"]="五金倒";
   //     LabelArray["LiuJinDao"]="六金倒";
   //     LabelArray["QiangJin"]="抢金";
   //     LabelArray["ShiSanYao"]="十三幺";
   //     LabelArray["DDHu"]="对对胡";
   //     LabelArray["TianHu"]="天胡";
   //     LabelArray["FenBing"]="分饼";
   //     return LabelArray[huType];
   // },
});

cc._RF.pop();