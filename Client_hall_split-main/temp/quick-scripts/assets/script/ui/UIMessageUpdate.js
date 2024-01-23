(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/UIMessageUpdate.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd5f66rwXHlGBIqUr++r0q/s', 'UIMessageUpdate', __filename);
// script/ui/UIMessageUpdate.js

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

    OnShow: function OnShow(url) {
        this.url = url;
    },

    //---------点击函数---------------------

    OnClick: function OnClick(btnName, eventData) {

        if (btnName == "btnSure") {
            cc.sys.openURL(this.url);
            this.CloseForm();
        } else if (btnName == "btn_close") {
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
        //# sourceMappingURL=UIMessageUpdate.js.map
        