(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/UIMessageLostConnect.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3bb90C2detDfYt1F7HG49ys', 'UIMessageLostConnect', __filename);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=UIMessageLostConnect.js.map
        