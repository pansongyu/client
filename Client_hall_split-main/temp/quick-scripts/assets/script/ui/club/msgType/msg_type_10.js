(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/msgType/msg_type_10.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '65390uQYgFA0q3VEIbaHlSp', 'msg_type_10', __filename);
// script/ui/club/msgType/msg_type_10.js

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

        this.node.getChildByName("lb_execValue").getComponent(cc.Label).string = data.preValue;

        this.node.getChildByName("lb_value").getComponent(cc.Label).string = data.curValue;

        var jianTouNode = this.node.getChildByName("btn_jtcheng1");
        var msgTypeStr = "";
        if (data.execType == 40) {
            msgTypeStr = "推广员预警值";
            jianTouNode.getChildByName("lb_opType").getComponent(cc.Label).string = "关闭";
            this.node.getChildByName("lb_value").getComponent(cc.Label).string = "无";
        } else if (data.execType == 41) {
            msgTypeStr = "推广员预警值";
            jianTouNode.getChildByName("lb_opType").getComponent(cc.Label).string = "修改";
        } else if (data.execType == 46) {
            msgTypeStr = "个人预警值";
            jianTouNode.getChildByName("lb_opType").getComponent(cc.Label).string = "关闭";
            this.node.getChildByName("lb_value").getComponent(cc.Label).string = "无";
        } else if (data.execType == 47) {
            msgTypeStr = "个人预警值";
            jianTouNode.getChildByName("lb_opType").getComponent(cc.Label).string = "修改";
        } else {
            console.log("请确认是否是推广员预警值消息：" + data.execType);
        }
        this.node.getChildByName("btn_lv").getChildByName("lb_msgType").getComponent(cc.Label).string = msgTypeStr;
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
        //# sourceMappingURL=msg_type_10.js.map
        