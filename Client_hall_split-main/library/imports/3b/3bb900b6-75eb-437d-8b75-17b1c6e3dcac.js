"use strict";
cc._RF.push(module, '3bb90C2detDfYt1F7HG49ys', 'UIMessageLostConnect');
// script/ui/UIMessageLostConnect.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
  extends: require("BaseForm"),

  properties: {},

  //初始化
  OnCreateInit: function OnCreateInit() {
    this.ShareDefine = app.ShareDefine();
  },

  //---------显示函数--------------------

  OnShow: function OnShow() {},

  OnClose: function OnClose() {},

  //---------点击函数---------------------

  OnClick: function OnClick(btnName, eventData) {
    if (btnName == "btnSure") {
      app.Client.LogOutGame(1);
      this.CloseForm();
    } else {
      this.ErrLog("OnClick:%s not find", btnName);
    }
  }

});

cc._RF.pop();