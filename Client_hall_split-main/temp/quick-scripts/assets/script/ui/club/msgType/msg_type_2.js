(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/msgType/msg_type_2.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '510ff9PiXRANLG1BwllRgZe', 'msg_type_2', __filename);
// script/ui/club/msgType/msg_type_2.js

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
        if (typeof data.execClubName != "undefined" && typeof data.execClubSign != "undefined") {
            execClubNameStr = "圈:" + data.execClubName;
            execClubSignStr = "ID:" + data.execClubSign;
        }
        this.node.getChildByName("lb_execClubName").getComponent(cc.Label).string = execClubNameStr;
        this.node.getChildByName("lb_execClubId").getComponent(cc.Label).string = execClubSignStr;

        var execNameStr = "";
        var execIdStr = "";
        if (typeof data.execName != "undefined" && typeof data.execPid != "undefined") {
            execNameStr = app.ComTool().GetBeiZhuName(data.pid, data.execName);
            execIdStr = "ID:" + data.execPid;
        }
        if (data.execType == 1020) {
            execNameStr = app.ComTool().GetBeiZhuName(data.pid, data.msg);
            execIdStr = "ID:" + data.roomKey; //跨级异常的ID跟名字服务端定的字段
        }
        this.node.getChildByName("lb_execUserName").getComponent(cc.Label).string = execNameStr;
        this.node.getChildByName("lb_execUserId").getComponent(cc.Label).string = execIdStr;

        this.node.getChildByName("lb_execValue").getComponent(cc.Label).string = data.execPidValue;
        if (data.execPidValue >= 0) {
            this.node.getChildByName("lb_execValue").color = new cc.Color(55, 155, 32);
        } else {
            this.node.getChildByName("lb_execValue").color = new cc.Color(248, 57, 57);
        }
        //如果不是自己隱藏剩余的数据
        var selfPid = app.HeroManager().GetHeroProperty("pid");
        if (data.execPid == selfPid) {
            this.node.getChildByName("img_sheng").active = true;
            this.node.getChildByName("lb_execCurValue").getComponent(cc.Label).string = data.execPidCurValue;
        } else {
            this.node.getChildByName("img_sheng").active = false;
            this.node.getChildByName("lb_execCurValue").getComponent(cc.Label).string = "";
        }

        var clubNameStr = "";
        var clubSignStr = "";
        if (typeof data.clubName != "undefined" && typeof data.clubSign != "undefined") {
            clubNameStr = "圈:" + data.clubName;
            clubSignStr = "ID:" + data.clubSign;
        }
        this.node.getChildByName("lb_clubName").getComponent(cc.Label).string = clubNameStr;
        this.node.getChildByName("lb_clubId").getComponent(cc.Label).string = clubSignStr;

        var userNameStr = "";
        var userIdStr = "";
        if (typeof data.name != "undefined" && typeof data.pid != "undefined") {
            userNameStr = app.ComTool().GetBeiZhuName(data.pid, data.name);
            userIdStr = "ID:" + data.pid; //跨级异常的ID跟名字服务端定的字段
        }
        if (data.execType == 1020) {
            userNameStr = app.ComTool().GetBeiZhuName(data.pidPreValue, data.execPidPreValue);
            userIdStr = "ID:" + data.pidPreValue;
        }
        this.node.getChildByName("lb_userName").getComponent(cc.Label).string = userNameStr;
        this.node.getChildByName("lb_userId").getComponent(cc.Label).string = userIdStr;

        this.node.getChildByName("lb_value").getComponent(cc.Label).string = data.pidValue;
        if (data.pidValue >= 0) {
            this.node.getChildByName("lb_value").color = new cc.Color(55, 155, 32);
        } else {
            this.node.getChildByName("lb_value").color = new cc.Color(248, 57, 57);
        }
        this.node.getChildByName("lb_curValue").getComponent(cc.Label).string = data.pidCurValue;

        //类型变化
        if (data.execType == 1020) {
            this.node.getChildByName("btn_lv").getChildByName("lb_msgType").getComponent(cc.Label).string = "跨级补偿";
        } else {
            this.node.getChildByName("btn_lv").getChildByName("lb_msgType").getComponent(cc.Label).string = "授权增加";
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
        //# sourceMappingURL=msg_type_2.js.map
        