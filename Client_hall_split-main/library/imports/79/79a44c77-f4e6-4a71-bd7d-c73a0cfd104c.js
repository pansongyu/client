"use strict";
cc._RF.push(module, '79a44x39OZKcb19xzoM/RBM', 'msg_type_12');
// script/ui/club/msgType/msg_type_12.js

"use strict";

var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {},
    InitData: function InitData(data) {
        var timeStr = app.ComTool().GetDateYearMonthDayHourMinuteString(data.execTime);
        this.node.getChildByName("lb_time").getComponent(cc.Label).string = timeStr;
        var nameStr = "";
        if (typeof data.name != "undefined" && typeof data.pid != "undefined") {
            nameStr = app.ComTool().GetBeiZhuName(data.pid, data.name) + "(ID:" + data.pid + ")";
        }
        this.node.getChildByName("lb_userName").getComponent(cc.Label).string = nameStr;
        var sectionStr = "(" + data.preValue + "," + data.curValue + "]";
        if (data.execType == 50) {
            this.node.getChildByName("lb_1").getComponent(cc.Label).string = "被修改人";
            this.node.getChildByName("lb_2").getComponent(cc.Label).string = sectionStr + "，分配给自己";
        } else if (data.execType == 51) {
            this.node.getChildByName("lb_1").getComponent(cc.Label).string = sectionStr + "，可分配值";
        } else {
            console.log("请确认是否是分成消息：" + data.execType);
        }
        this.node.getChildByName("lb_execValue").getComponent(cc.Label).string = data.pidPreValue;
        this.node.getChildByName("lb_value").getComponent(cc.Label).string = data.pidCurValue;
    }
});

cc._RF.pop();