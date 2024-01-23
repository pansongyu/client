"use strict";
cc._RF.push(module, 'ba439Q6SFtO8LMXzSeL83v5', 'UIClubHeHuoShuoMing');
// script/ui/club/UIClubHeHuoShuoMing.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
  extends: require("BaseForm"),

  properties: {},

  //初始化
  OnCreateInit: function OnCreateInit() {},

  //---------显示函数--------------------

  OnShow: function OnShow() {},

  //---------点击函数---------------------

  OnClick: function OnClick(btnName, eventData) {

    if (btnName == "btn_close") {
      this.CloseForm();
    } else {
      this.ErrLog("OnClick:%s not find", btnName);
    }
  }

});

cc._RF.pop();