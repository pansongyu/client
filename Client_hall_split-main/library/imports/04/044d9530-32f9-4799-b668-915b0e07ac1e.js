"use strict";
cc._RF.push(module, '044d9UwMvlHmbZokVsOB6we', 'msg_type_9');
// script/ui/club/msgType/msg_type_9.js

"use strict";

var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {},
    InitData: function InitData(data) {
        var timeStr = app.ComTool().GetDateYearMonthDayHourMinuteString(data.execTime);
        this.node.getChildByName("lb_time").getComponent(cc.Label).string = timeStr;
        var execNameStr = "";
        if (typeof data.execName != "undefined" && typeof data.execPid != "undefined") {
            execNameStr = app.ComTool().GetBeiZhuName(data.pid, data.execName) + "(ID:" + data.execPid + ")";
        }
        this.node.getChildByName("lb_execUserName").getComponent(cc.Label).string = execNameStr;

        this.node.getChildByName("lb_value").getComponent(cc.Label).string = data.execPidValue;
        if (data.execPidValue >= 0) {
            this.node.getChildByName("lb_value").color = new cc.Color(55, 155, 32);
        } else {
            this.node.getChildByName("lb_value").color = new cc.Color(248, 57, 57);
        }
        this.node.getChildByName("lb_curValue").getComponent(cc.Label).string = data.execPidCurValue;
    }
});

cc._RF.pop();