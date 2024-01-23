(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/download/DownLoadMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '393c0AUAl1FCY1AOYjN9HD7', 'DownLoadMgr', __filename);
// script/download/DownLoadMgr.js

"use strict";

/*
    下载管理类
 */
var app = require("app");

var DownLoadstate = function DownLoadstate() {
    //下载事件
    this.DwonLoadState_Finish = 0; //下载完成
    this.DwonLoadState_Error = 1; //下载失败
    this.DwonLoadState_Progress = 2; //下载进度
};

var DownLoadMgr = app.BaseClass.extend({
    extends: cc.Component,

    properties: {},

    Init: function Init() {
        this.Log("DownLoadMgr Init");
        this.JS_Name = "DownLoadMgr";

        this.serverUrl = null;
        this.loaclPath = null;
        this.fileName = null;
        this.downloadType = null;
        this.count = 0;

        //下载事件
        //this.DwonLoadState_Finish       = 0;//下载完成
        //this.DwonLoadState_Error        = 1;//下载失败
        //this.DwonLoadState_Progress     = 2;//下载进度
    },

    //1秒回掉
    OnTimer: function OnTimer(passSecond) {
        this.SysLog("OnTimer passSecond:%s,this.count:%s", passSecond, this.count);
        app.SysNotifyManager().ShowSysMsg("MSG_DOWNLOAD_ERROR");
        this.count++;
        this.SysLog("OnTimer 11111 passSecond:%s,this.count:%s", passSecond, this.count);
        // if(this.count > 3){
        //     let msgID = "Net_ReconnectConnectFail";
        //     let ConfirmManager = app.ConfirmManager();
        //     ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, []);
        //     ConfirmManager.ShowConfirm(app.ShareDefine().ConfirmOK, msgID, [])

        //     cc.Director.getInstance().getScheduler().unschedule(this.OnTimer, this);
        //     return;
        // }
        this.DownFile(this.serverUrl, this.loaclPath, this.fileName, this.downloadType);
        cc.Director.getInstance().getScheduler().unschedule(this.OnTimer, this);
    },

    //确认框点击
    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {
        if (clickType != "Sure") {
            return;
        }

        //如果是尝试继续重连
        if (msgID == "Net_ReconnectConnectFail") {
            this.DownFile(this.serverUrl, this.loaclPath, this.fileName, this.downloadType);
        } else {
            this.ErrLog("OnConFirm:%s", msgID);
        }
    },

    //下载文件  filename 没有值是设置为deleteString
    DownFile: function DownFile(serverUrl, localPath, fileName, downloadType) {
        this.SysLog("DownFile serverUrl:%s, loaclPath:%s, fileName:%s,  downloadType:%s", serverUrl, localPath, fileName, downloadType);
        if (serverUrl == null || localPath == null || downloadType == null) {
            this.ErrLog("DownFile serverUrl == null || localPath == null || downloadType == null");
            return;
        }
        this.serverUrl = serverUrl;
        this.loaclPath = localPath;
        this.fileName = fileName;
        this.downloadType = downloadType;
        this.SysLog("DownFile  111");
        //this.count = 0
        var argList = [{ "Name": "urls", "Value": serverUrl }, { "Name": "fileName", "Value": fileName }, { "Name": "savePath", "Value": localPath }, { "Name": "downloadType", "Value": downloadType }];
        var value = app.NativeManager().CallToNative("downLoadFile", argList);
    },

    //下载完成
    OnDownFileFinish: function OnDownFileFinish(serverPack) {
        this.SysLog("DownFileFinish downloadType=%s", serverPack["downloadType"]);
        app.Client.OnEvent(serverPack["downloadType"], serverPack);

        this.serverUrl = null;
        this.loaclPath = null;
        this.fileName = null;
        this.downloadType = null;
        this.count = 0;
    },

    //下载失败
    OnDownFileError: function OnDownFileError(serverPack) {
        this.SysLog("DownFileError 0000  downloadType=%s", serverPack["downloadType"]);
        app.Client.OnEvent(serverPack["downloadType"], serverPack);

        if (!cc.Director.getInstance().getScheduler().isScheduled(this.OnTimer, this)) {
            this.SysLog("DownFileError 1111  downloadType=%s", serverPack["downloadType"]);
            cc.Director.getInstance().getScheduler().schedule(this.OnTimer, this, 3.0);
        }
    },

    //下载进度
    OnDownFileProgress: function OnDownFileProgress(serverPack) {
        this.SysLog("OnDownFileProgress downloadType=%s", serverPack["downloadType"]);
        //app.Client.OnEvent(serverPack["downloadType"], {"progress": serverPack["proess"]});
        app.Client.OnEvent(serverPack["downloadType"], serverPack);
    },

    //下载事件
    OnDownLoadEvent: function OnDownLoadEvent(serverPack) {
        this.SysLog("OnDownLoadEvent state=%s, downloadType=%s", serverPack["state"], serverPack["downloadType"]);
        //this.SysLog("OnDownLoadEvent this.DwonLoadState_Finish:%s, this.DwonLoadState_Error:%s", DownLoadMgr.DwonLoadState_Finish, DownLoadMgr.DwonLoadState_Error);
        if (serverPack["state"] == DownLoadMgr.DwonLoadState_Finish) {
            this.OnDownFileFinish(serverPack);
        } else if (serverPack["state"] == DownLoadMgr.DwonLoadState_Error) {
            this.OnDownFileError(serverPack);
        } else if (serverPack["state"] == DownLoadMgr.DwonLoadState_Progress) {
            this.OnDownFileProgress(serverPack);
        }
    },

    //获取失败标识
    GetDownLoadStateError: function GetDownLoadStateError() {
        return DownLoadMgr.DwonLoadState_Error;
    },
    //获取成功标识
    GetDownLoadStateFinish: function GetDownLoadStateFinish() {
        return DownLoadMgr.DwonLoadState_Finish;
    },
    //获取进度标识
    GetDownLoadStateProgress: function GetDownLoadStateProgress() {
        return DownLoadMgr.DwonLoadState_Progress;
    }
});

DownLoadstate.apply(DownLoadMgr, []);

var g_DownLoadMgr = null;
/**
...
*/
exports.GetModel = function () {
    if (!g_DownLoadMgr) {
        g_DownLoadMgr = new DownLoadMgr();
    }
    return g_DownLoadMgr;
};

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
        //# sourceMappingURL=DownLoadMgr.js.map
        