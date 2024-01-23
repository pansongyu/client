(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIUnionRoomCfgMsg.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'bc43fS5gVlEVpT5uD5+rVua', 'UIUnionRoomCfgMsg', __filename);
// script/ui/club/UIUnionRoomCfgMsg.js

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

    OnShow: function OnShow(wanfaStr, unionCfgStr) {
        this.node.getChildByName("wanfa_1").getComponent(cc.Label).string = wanfaStr;
        this.node.getChildByName("wanfa_2").getComponent(cc.Label).string = unionCfgStr;
    },

    OnClose: function OnClose() {},

    //---------点击函数---------------------

    OnClick: function OnClick(btnName, eventData) {
        if (btnName == "btnSure") {
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
        //# sourceMappingURL=UIUnionRoomCfgMsg.js.map
        