"use strict";
cc._RF.push(module, '67861ihy7dND4OXwwgRNL3P', 'msg_type_8');
// script/ui/club/msgType/msg_type_8.js

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
            execNameStr = app.ComTool().GetBeiZhuName(data.execPid, data.execName) + "(ID:" + data.execPid + ")";
        }
        this.node.getChildByName("lb_execUserName").getComponent(cc.Label).string = execNameStr;

        var nameStr = "";
        if (typeof data.name != "undefined" && typeof data.pid != "undefined") {
            nameStr = app.ComTool().GetBeiZhuName(data.pid, data.name) + "(ID:" + data.pid + ")";
        }
        this.node.getChildByName("lb_userName").getComponent(cc.Label).string = nameStr;

        var msgTypeStr = "";
        if (data.execType == 3) {
            msgTypeStr = "分成修改";
            this.node.getChildByName("lb_execValue").getComponent(cc.Label).string = data.curValue;
            this.node.getChildByName("lb_value").getComponent(cc.Label).string = data.value;
            this.node.getChildByName("btn_jtcheng1").active = true;
        } else if (data.execType == 48) {
            msgTypeStr = "预留值修改";
            this.node.getChildByName("lb_execValue").getComponent(cc.Label).string = "";
            this.node.getChildByName("lb_value").getComponent(cc.Label).string = "";
            this.node.getChildByName("btn_jtcheng1").active = true;
        } else if (data.execType == 49) {
            msgTypeStr = "区间分成";
            this.node.getChildByName("lb_execValue").getComponent(cc.Label).string = "";
            this.node.getChildByName("lb_value").getComponent(cc.Label).string = "";
            this.node.getChildByName("btn_jtcheng1").active = false;
        } else {
            console.log("请确认是否是分成消息：" + data.execType);
        }
        this.node.getChildByName("btn_lv").getChildByName("lb_msgType").getComponent(cc.Label).string = msgTypeStr;
    }
});

cc._RF.pop();