/*
    控制器管理器
*/
var app = require('app');

var ControlManager = app.BaseClass.extend({

    Init: function () {
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
    OnEventHide: function () {
        console.log("OnEventHide");
        console.log("WebSocket OnEventHide");
        app.Client.OnEventHide();
    },

    //应用显示
    OnEventShow: function () {
        console.log("OnEventShow");
        console.log("WebSocket OnEventShow");

        if (this.CheckVpnUsed()) {
            return;
        }

        app.Client.OnEventShow();
    },

    IsOpenVpn: function () {
        return false;
        
        if (!this.isAndroid) {
            return false;
        }

        if (!this.IsEnableCheckVpn()) {
            console.log("未启用VPN检测");
            return false;
        }

        let isOpenVpn = app.NativeManager().CallToNative("CheckVpnUsed", [], "Boolean");
        if (isOpenVpn) {
            console.log("检测到VPN为开启状态");
        }
        return isOpenVpn;
    },

    IsEnableCheckVpn: function () {
        let clientConfig = app.Client.GetClientConfig();
        if (!clientConfig) {
            return false;
        }

        let value = clientConfig["isEnableCheckVpn"];
        if ("false" == value) return false;
        if ("true" == value) return true;
        
        return false;
    },

    CheckVpnUsed: function (clickCb = null) {
        if (this.IsOpenVpn()) {
            app.NetManager().Disconnect();
            this.SetWaitForConfirm('DNS中断', this.ShareDefine.ConfirmOK, [], ["WEBSOCKET_DISCONNECT_VPN_CHECK"], "", clickCb);
            return true;
        }
        return false;
    },

    SetWaitForConfirm: function (msgID, type, msgArg = [], cbArg = [], content = "", clickCb) {
        let ConfirmManager = app.ConfirmManager();
        if (!!clickCb) {
            console.log("clickCb", clickCb)
            ConfirmManager.SetWaitForConfirmForm(() => {
                console.log("VPN 断连后，需要重新建立连接 clickCb");
                this.CheckVpnUsed();
                clickCb();
            }, msgID, cbArg);
        } else {
            ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
        }
        ConfirmManager.ShowConfirm(type, msgID, msgArg, content);
    },

    OnConFirm: function (clickType, msgID, backArgList) {
        if (clickType != "WEBSOCKET_DISCONNECT_VPN_CHECK") {
            console.log("VPN 断连后，需要重新建立连接 OnConFirm");
            app.NetWork().ReConnect();
            this.CheckVpnUsed();
        }
    },

    //---------------加载资源-----------------

    //创建异步下载资源对象
    CreateLoadPromise: function (resPath, resType = "") {
        this.Log("CreateLoadPromise failed resPath(%s) resType(%s)", resPath, resType);

        let that = this;
        //如果已经加载
        if (this.catchDataDict.hasOwnProperty(resPath)) {
            let loadData = this.catchDataDict[resPath];
            return app.bluebird.resolve(loadData)
        }
        //创建异步函数
        let promisefunc = function (resolve, reject) {
            //加载资源

            cc.loader.loadRes(resPath, resType, function (error, loadData) {
                if (error) {
                    reject(error);
                    that.ErrLog("CreateLoadPromise failed resPath(%s) resType(%s), error:%s", resPath, resType, error.stack);
                    that.ErrLog("CreateLoadPromise loadData(%s)", loadData);

                    return
                }
                that.catchDataDict[resPath] = loadData;

                resolve(loadData);
            })
        };
        //返回异步对象
        return new app.bluebird(promisefunc);
    },

    //加载JSON文件 cc.url.raw('resources/json/' + jsonFileName + ".json");
    CreateLoadPromiseByUrl: function (resPath) {
        let that = this;

        //创建异步函数
        let promisefunc = function (resolve, reject) {
            //加载资源
            cc.loader.load(resPath, function (error, loadData) {

                if (error) {
                    reject(error);
                    return
                }

                resolve(loadData);
            })
        };
        //返回异步对象
        return new app.bluebird(promisefunc);
    },

    //创建异步下载文件夹所有文件对象
    CreateLoadDirPromise: function (resPath, resType = "") {
        //创建异步函数
        let promisefunc = function (resolve, reject) {
            //加载资源
            cc.loader.loadResAll(resPath, resType, function (error, loadDataList) {

                if (error) {
                    reject(error);
                    return
                }

                resolve(loadDataList);
            })
        };
        //返回异步对象
        return new app.bluebird(promisefunc);
    },

    //---------------释放资源-----------------
    ReleaseAllRes: function () {
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
    },
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
}