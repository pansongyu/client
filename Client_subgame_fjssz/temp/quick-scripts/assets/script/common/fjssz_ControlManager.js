(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/common/fjssz_ControlManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fjsszb98-f1f2-4ee4-95c9-85cbdde67904', 'fjssz_ControlManager', __filename);
// script/common/fjssz_ControlManager.js

"use strict";

/*
    控制器管理器
*/
var app = require("fjssz_app");

var sss_ControlManager = app.BaseClass.extend({

    Init: function Init() {
        this.JS_Name = app["subGameName"] + "_ControlManager";

        cc.game.on(cc.game.EVENT_HIDE, this.OnEventHide.bind(this));
        cc.game.on(cc.game.EVENT_SHOW, this.OnEventShow.bind(this));

        this.catchDataDict = {};
    },

    //--------------回掉函数---------------
    //应用切入后台
    OnEventHide: function OnEventHide() {
        app[app.subGameName + "Client"].OnEventHide();
    },

    //应用显示
    OnEventShow: function OnEventShow() {
        app[app.subGameName + "Client"].OnEventShow();
    },

    //---------------加载资源-----------------

    //创建异步下载资源对象
    CreateLoadPromise: function CreateLoadPromise(resPath) {
        var resType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

        var that = this;
        //如果已经加载
        if (this.catchDataDict.hasOwnProperty(resPath)) {
            var loadData = this.catchDataDict[resPath];
            return app.bluebird.resolve(loadData);
        }

        // let gamePath = jsb.fileUtils.getSearchPaths() + "resources/" + resPath;

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
        cc.game.off(cc.game.EVENT_HIDE, this.OnEventHide.bind(this));
        cc.game.off(cc.game.EVENT_SHOW, this.OnEventShow.bind(this));
    }
});

var g_sss_ControlManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
    if (!g_sss_ControlManager) {
        g_sss_ControlManager = new sss_ControlManager();
    }
    return g_sss_ControlManager;
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
        //# sourceMappingURL=fjssz_ControlManager.js.map
        