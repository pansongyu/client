"use strict";
cc._RF.push(module, 'cb297CMjRtNNazrgSI/lAia', 'ControlManager');
// script/common/ControlManager.js

"use strict";

/*
    控制器管理器
*/
var app = require('app');

var ControlManager = app.BaseClass.extend({

    Init: function Init() {
        this.JS_Name = "ControlManager";

        cc.game.on(cc.game.EVENT_HIDE, this.OnEventHide.bind(this));
        cc.game.on(cc.game.EVENT_SHOW, this.OnEventShow.bind(this));
        this.ShareDefine = app.ShareDefine();
        this.isAndroid = app.ComTool().IsAndroid();
        this.catchDataDict = {};

        this.Log("Init");
    },

    //--------------回掉函数---------------
    //应用切入后台
    OnEventHide: function OnEventHide() {
        console.log("OnEventHide");
        console.log("WebSocket OnEventHide");
        app.Client.OnEventHide();
    },

    //应用显示
    OnEventShow: function OnEventShow() {
        console.log("OnEventShow");
        console.log("WebSocket OnEventShow");

        if (this.CheckVpnUsed()) {
            return;
        }

        app.Client.OnEventShow();
    },

    IsOpenVpn: function IsOpenVpn() {
        return false;

        if (!this.isAndroid) {
            return false;
        }

        if (!this.IsEnableCheckVpn()) {
            console.log("未启用VPN检测");
            return false;
        }

        var isOpenVpn = app.NativeManager().CallToNative("CheckVpnUsed", [], "Boolean");
        if (isOpenVpn) {
            console.log("检测到VPN为开启状态");
        }
        return isOpenVpn;
    },

    IsEnableCheckVpn: function IsEnableCheckVpn() {
        var clientConfig = app.Client.GetClientConfig();
        if (!clientConfig) {
            return false;
        }

        var value = clientConfig["isEnableCheckVpn"];
        if ("false" == value) return false;
        if ("true" == value) return true;

        return false;
    },

    CheckVpnUsed: function CheckVpnUsed() {
        var clickCb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        if (this.IsOpenVpn()) {
            app.NetManager().Disconnect();
            this.SetWaitForConfirm('DNS中断', this.ShareDefine.ConfirmOK, [], ["WEBSOCKET_DISCONNECT_VPN_CHECK"], "", clickCb);
            return true;
        }
        return false;
    },

    SetWaitForConfirm: function SetWaitForConfirm(msgID, type) {
        var msgArg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var cbArg = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

        var _this = this;

        var content = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
        var clickCb = arguments[5];

        var ConfirmManager = app.ConfirmManager();
        if (!!clickCb) {
            console.log("clickCb", clickCb);
            ConfirmManager.SetWaitForConfirmForm(function () {
                console.log("VPN 断连后，需要重新建立连接 clickCb");
                _this.CheckVpnUsed();
                clickCb();
            }, msgID, cbArg);
        } else {
            ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
        }
        ConfirmManager.ShowConfirm(type, msgID, msgArg, content);
    },

    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {
        if (clickType != "WEBSOCKET_DISCONNECT_VPN_CHECK") {
            console.log("VPN 断连后，需要重新建立连接 OnConFirm");
            app.NetWork().ReConnect();
            this.CheckVpnUsed();
        }
    },

    //---------------加载资源-----------------

    //创建异步下载资源对象
    CreateLoadPromise: function CreateLoadPromise(resPath) {
        var resType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

        this.Log("CreateLoadPromise failed resPath(%s) resType(%s)", resPath, resType);

        var that = this;
        //如果已经加载
        if (this.catchDataDict.hasOwnProperty(resPath)) {
            var loadData = this.catchDataDict[resPath];
            return app.bluebird.resolve(loadData);
        }
        //创建异步函数
        var promisefunc = function promisefunc(resolve, reject) {
            //加载资源

            cc.loader.loadRes(resPath, resType, function (error, loadData) {
                if (error) {
                    reject(error);
                    that.ErrLog("CreateLoadPromise failed resPath(%s) resType(%s), error:%s", resPath, resType, error.stack);
                    that.ErrLog("CreateLoadPromise loadData(%s)", loadData);

                    return;
                }
                that.catchDataDict[resPath] = loadData;

                resolve(loadData);
            });
        };
        //返回异步对象
        return new app.bluebird(promisefunc);
    },

    //加载JSON文件 cc.url.raw('resources/json/' + jsonFileName + ".json");
    CreateLoadPromiseByUrl: function CreateLoadPromiseByUrl(resPath) {
        var that = this;

        //创建异步函数
        var promisefunc = function promisefunc(resolve, reject) {
            //加载资源
            cc.loader.load(resPath, function (error, loadData) {

                if (error) {
                    reject(error);
                    return;
                }

                resolve(loadData);
            });
        };
        //返回异步对象
        return new app.bluebird(promisefunc);
    },

    //创建异步下载文件夹所有文件对象
    CreateLoadDirPromise: function CreateLoadDirPromise(resPath) {
        var resType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

        //创建异步函数
        var promisefunc = function promisefunc(resolve, reject) {
            //加载资源
            cc.loader.loadResAll(resPath, resType, function (error, loadDataList) {

                if (error) {
                    reject(error);
                    return;
                }

                resolve(loadDataList);
            });
        };
        //返回异步对象
        return new app.bluebird(promisefunc);
    },

    //---------------释放资源-----------------
    ReleaseAllRes: function ReleaseAllRes() {
        for (var key in this.catchDataDict) {
            console.log("ReleaseAllRes key:" + key);
            if (key.indexOf("jsonData") > -1) {
                //只释放配表资源
                cc.loader.releaseRes(key);
            }
        }
        this.catchDataDict = {};
        cc.game.off(cc.game.EVENT_HIDE);
        cc.game.off(cc.game.EVENT_SHOW);
    }
});

var g_ControlManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
    if (!g_ControlManager) {
        g_ControlManager = new ControlManager();
    }
    return g_ControlManager;
};

cc._RF.pop();