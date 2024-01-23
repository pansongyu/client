(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/msgType/msg_type_5.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '58f34z9xJZEnJryvAfjJENA', 'msg_type_5', __filename);
// script/ui/club/msgType/msg_type_5.js

"use strict";

var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {},
    InitData: function InitData(data) {
        var timeStr = app.ComTool().GetDateYearMonthDayHourMinuteString(data.execTime);
        this.node.getChildByName("lb_time").getComponent(cc.Label).string = timeStr;
        var roomKey = "";
        if (typeof data.roomKey != "undefined") {
            roomKey = "房间号：" + data.roomKey;
        }
        this.node.getChildByName("lb_roomKey").getComponent(cc.Label).string = roomKey;
        var msgTypeStr = "";
        if (data.execType == 120) {
            msgTypeStr = "对局获得";
        } else if (data.execType == 121) {
            msgTypeStr = "对局失去";
        } else {
            console.log("请确认是否是输赢比赛分消息：" + data.execType);
        }
        this.node.getChildByName("btn_lv").getChildByName("lb_msgType").getComponent(cc.Label).string = msgTypeStr;

        this.node.getChildByName("lb_value").getComponent(cc.Label).string = data.value;
        if (data.value >= 0) {
            this.node.getChildByName("lb_value").color = new cc.Color(55, 155, 32);
        } else {
            this.node.getChildByName("lb_value").color = new cc.Color(248, 57, 57);
        }
        this.node.getChildByName("lb_curValue").getComponent(cc.Label).string = data.curValue;
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
        //# sourceMappingURL=msg_type_5.js.map
        