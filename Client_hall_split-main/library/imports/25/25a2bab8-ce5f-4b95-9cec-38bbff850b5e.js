"use strict";
cc._RF.push(module, '25a2bq4zl9LlZzsOLv/hQte', 'msg_type_14');
// script/ui/club/msgType/msg_type_14.js

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

        var NameStr = "";
        if (typeof data.name != "undefined" && typeof data.pid != "undefined") {
            NameStr = app.ComTool().GetBeiZhuName(data.pid, data.name) + "(ID:" + data.pid + ")";
        }
        this.node.getChildByName("lb_UserName").getComponent(cc.Label).string = NameStr;

        this.node.getChildByName("lb_execValue").getComponent(cc.Label).string = data.preValue;

        this.node.getChildByName("lb_value").getComponent(cc.Label).string = data.curValue;

        var jianTouNode = this.node.getChildByName("btn_jtcheng1");
        var msgTypeStr = "";
        if (data.execType == 1016) {
            //生存积分关闭
            msgTypeStr = "生存积分";
            jianTouNode.getChildByName("lb_opType").getComponent(cc.Label).string = "关闭";
        } else if (data.execType == 1017) {
            msgTypeStr = "生存积分"; //生存积分开启
            jianTouNode.getChildByName("lb_opType").getComponent(cc.Label).string = "开启";
            this.node.getChildByName("lb_execValue").getComponent(cc.Label).string = "无";
        } else if (data.execType == 1018) {
            msgTypeStr = "生存积分"; //生存积分变换
            jianTouNode.getChildByName("lb_opType").getComponent(cc.Label).string = "修改";
        } else if (data.execType == 1019) {
            msgTypeStr = "淘汰分";
            jianTouNode.getChildByName("lb_opType").getComponent(cc.Label).string = "修改";
        } else {
            console.log("请确认是否是生存积分消息：" + data.execType);
        }
        this.node.getChildByName("btn_lv").getChildByName("lb_msgType").getComponent(cc.Label).string = msgTypeStr;
    }
});

cc._RF.pop();