(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIClubHeHuoShuoMing.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ba439Q6SFtO8LMXzSeL83v5', 'UIClubHeHuoShuoMing', __filename);
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
        //# sourceMappingURL=UIClubHeHuoShuoMing.js.map
        