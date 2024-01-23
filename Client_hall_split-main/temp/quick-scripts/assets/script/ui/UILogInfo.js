(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/UILogInfo.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd3d67/txXlAraRG1NM9B2QF', 'UILogInfo', __filename);
// script/ui/UILogInfo.js

"use strict";

/*
    UILogInfo log信息界面
*/
var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        TextLabel: cc.Label
    },

    //初始化
    OnCreateInit: function OnCreateInit() {
        this.LogManager = app.Client.LogManager;

        //一次最多取多少条信息显示
        this.MaxLogCount = 50;
    },

    OnShow: function OnShow() {
        var msgList = this.LogManager.GetLogMsgList(this.MaxLogCount);
        var count = msgList.length;

        var logTypeList = this.InitPrintLogType();

        var messageList = null;
        var index = 0;
        var message = 0;
        var logType = 0;
        var logId = 0;

        var allContent = "";
        for (index = 0; index < count; index++) {
            messageList = msgList[index];
            message = messageList[0];
            logType = messageList[1];
            if (logTypeList.indexOf(logType) != -1) {
                logId = messageList[2];
                allContent += ["[", logId, "]", message, "\n"].join("");
            }
        }

        this.TextLabel.string = allContent;
    },

    InitPrintLogType: function InitPrintLogType() {
        var logTypeList = [];
        var log = this.GetWndComponent("log", cc.Toggle).isChecked;
        var error = this.GetWndComponent("error", cc.Toggle).isChecked;
        var sys = this.GetWndComponent("sys", cc.Toggle).isChecked;
        var warn = this.GetWndComponent("warn", cc.Toggle).isChecked;
        if (log) {
            logTypeList.push("log");
        }
        if (error) {
            logTypeList.push("error");
        }
        if (sys) {
            logTypeList.push("info");
        }
        if (warn) {
            logTypeList.push("warn");
        }
        return logTypeList;
    },
    //-------------回掉函数----------------

    //---------点击函数---------------------

    OnClick: function OnClick(btnName, eventData) {
        this.Log(btnName);
        if (btnName == "btn_clear") {
            this.Click_btn_clear();
        } else if (btnName == "log" || btnName == "error" || btnName == "sys" || btnName == "warn") {
            this.OnShow();
        } else {
            this.ErrLog("OnClick:%s not find", btnName);
        }
    },

    Click_btn_clear: function Click_btn_clear() {
        this.ClearShowLog();
    },

    ClearShowLog: function ClearShowLog() {
        this.OnShow();
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
        //# sourceMappingURL=UILogInfo.js.map
        