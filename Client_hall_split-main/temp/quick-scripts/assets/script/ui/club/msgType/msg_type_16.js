(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/msgType/msg_type_16.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e6b21o6TvpGlrs2i4lnHhdd', 'msg_type_16', __filename);
// script/ui/club/msgType/msg_type_16.js

"use strict";

var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {},
    InitData: function InitData(data) {
        var timeStr = app.ComTool().GetDateYearMonthDayHourMinuteString(data.execTime);
        this.node.getChildByName("lb_time").getComponent(cc.Label).string = timeStr;
        var execNameStr = "";
        if (typeof data.msg != "undefined" && typeof data.roomKey != "undefined") {
            execNameStr = app.ComTool().GetBeiZhuName(data.roomKey, data.msg) + "(ID:" + data.roomKey + ")";
        }
        this.node.getChildByName("lb_execUserName").getComponent(cc.Label).string = execNameStr;

        var NameStr = "";
        if (typeof data.name != "undefined" && typeof data.pid != "undefined") {
            NameStr = app.ComTool().GetBeiZhuName(data.pid, data.name) + "(ID:" + data.pid + ")";
        }
        this.node.getChildByName("lb_UserName").getComponent(cc.Label).string = NameStr;

        var oldNameStr = "";
        if (typeof data.execName != "undefined" && typeof data.execPid != "undefined") {
            oldNameStr = app.ComTool().GetBeiZhuName(data.execPid, data.execName) + "(ID:" + data.execPid + ")";
        }
        this.node.getChildByName("lb_old").getComponent(cc.Label).string = oldNameStr;

        var newNameStr = "";
        if (typeof data.pidCurValue != "undefined" && typeof data.pidPreValue != "undefined") {
            newNameStr = app.ComTool().GetBeiZhuName(data.pidPreValue, data.pidCurValue) + "(ID:" + data.pidPreValue + ")";
        }
        this.node.getChildByName("lb_new").getComponent(cc.Label).string = newNameStr;
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
        //# sourceMappingURL=msg_type_16.js.map
        