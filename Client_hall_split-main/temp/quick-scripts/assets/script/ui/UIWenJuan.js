(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/UIWenJuan.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b374aaoxMFMbrPiIGSnJsic', 'UIWenJuan', __filename);
// script/ui/UIWenJuan.js

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

    OnShow: function OnShow(httpurl) {
        this.httpurl = httpurl;
    },

    //---------点击函数---------------------

    OnClick: function OnClick(btnName, eventData) {
        if (btnName == "btnSure") {
            cc.sys.openURL(this.httpurl);
        } else if (btnName == "btn_close") {
            this.CloseForm();
        } else {
            this.ErrLog("OnClick:%s not find", btnName);
        }
    },

    /**
     * 点击确定
     */
    AfterOnClick: function AfterOnClick(eventType) {

        this.CloseForm();

        this.ConfirmManager.OnConFirmResult(eventType);

        // 如果还有消息则继续显示
        if (this.msgInfoList.length) {
            this.ShowMsgInfo();
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
        //# sourceMappingURL=UIWenJuan.js.map
        