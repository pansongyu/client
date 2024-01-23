(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/UIMessageTip.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'bf67afluahJvqUjTz34ZWZb', 'UIMessageTip', __filename);
// script/ui/UIMessageTip.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        lb_info: cc.Label

    },

    OnCreateInit: function OnCreateInit() {
        this.SysNotifyManager = app.SysNotifyManager();
    },

    OnShow: function OnShow(msgID) {
        this.ShowLabelString(msgID);
    },
    ShowLabelString: function ShowLabelString(msgID) {
        var desc = this.SysNotifyManager.GetSysMsgContentByMsgID(msgID);
        var reg = /\/n/g;
        desc = desc.replace(reg, "\n");
        reg = /\/t/g;
        desc = desc.replace(reg, "\t");
        this.lb_info.string = desc;
    },

    GetMsgWndSize: function GetMsgWndSize() {
        return this.lb_info.node.getContentSize();
    },
    //-----------------回调函数------------------

    //---------点击函数---------------------
    OnClick: function OnClick(btnName, btnNode) {}

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
        //# sourceMappingURL=UIMessageTip.js.map
        