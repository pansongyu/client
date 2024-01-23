"use strict";
cc._RF.push(module, '77335hgt+BMiY5jQP/QnfwN', 'msg_type_15');
// script/ui/club/msgType/msg_type_15.js

"use strict";

var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {},
    InitData: function InitData(data) {
        var timeStr = app.ComTool().GetDateYearMonthDayHourMinuteString(data.execTime);
        this.node.getChildByName("lb_time").getComponent(cc.Label).string = timeStr;
        var execClubNameStr = "";
        var execClubSignStr = "";

        var execNameStr = "";
        var execIdStr = "";
        if (typeof data.msg != "undefined" && typeof data.roomKey != "undefined") {
            execNameStr = app.ComTool().GetBeiZhuName(data.pid, data.msg);
            execIdStr = "ID:" + data.roomKey;
        }
        this.node.getChildByName("lb_execUserName").getComponent(cc.Label).string = execNameStr;
        this.node.getChildByName("lb_execUserId").getComponent(cc.Label).string = execIdStr;

        var userNameStr = "";
        var userIdStr = "";
        if (typeof data.name != "undefined" && typeof data.pid != "undefined") {
            userNameStr = app.ComTool().GetBeiZhuName(data.pid, data.name);
            userIdStr = "ID:" + data.pid;
        }
        this.node.getChildByName("lb_userName").getComponent(cc.Label).string = userNameStr;
        this.node.getChildByName("lb_userId").getComponent(cc.Label).string = userIdStr;
        //类型变化
        if (data.execType == 1022) {
            this.node.getChildByName("btn_jtcheng1").getChildByName("lb_opType").getComponent(cc.Label).string = "踢出";
            this.node.getChildByName("btn_lv").getChildByName("lb_msgType").getComponent(cc.Label).string = "踢出亲友圈";
        } else if (data.execType == 1023) {
            this.node.getChildByName("btn_jtcheng1").getChildByName("lb_opType").getComponent(cc.Label).string = "加入";
            this.node.getChildByName("btn_lv").getChildByName("lb_msgType").getComponent(cc.Label).string = "加入亲友圈";
        }
    }
});

cc._RF.pop();