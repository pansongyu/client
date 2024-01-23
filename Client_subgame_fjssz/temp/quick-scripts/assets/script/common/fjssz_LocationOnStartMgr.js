(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/common/fjssz_LocationOnStartMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fjssz781-aa71-4b49-8660-e3b09a2f9c42', 'fjssz_LocationOnStartMgr', __filename);
// script/common/fjssz_LocationOnStartMgr.js

"use strict";

/**
 * 定位服务类
 */
var app = require("fjssz_app");

var sss_LocationOnStartMgr = app.BaseClass.extend({
    extends: cc.Component,

    properties: {},

    Init: function Init() {
        this.Log(app.subGameName + "_LocationOnStartMgr Init");
        this.JS_Name = app["subGameName"] + "_LocationOnStartMgr";
        this.GetLocation_Success = 0; //获取位置成功
        this.GetLocation_Error = 1; //获取位置失败
        this.isSendAddress = false; //是否已经发送位置,3秒内只能发一次
    },
    //发送请求玩家定位服务
    SendGetLocation: function SendGetLocation(isGetError) {
        //启动5秒不发送机制
        if (this.isSendAddress == true) {
            return;
        }
        this.isSendAddress = true;
        var that = this;
        setTimeout(function () {
            that.isSendAddress = false;
        }, 5000);
        app[app.subGameName + "_NetManager"]().SendPack("game.CGetLocationEx", { "Address": this.MyAddress, "Latitude": this.MyLatitudeEx, "Longitude": this.MyLongitudeEx, "isGetError": isGetError });
    },
    //获取定位
    OnGetLocationCallBack: function OnGetLocationCallBack(serverPack) {
        var isGetError = false;
        this.MyAddress = '';
        if (serverPack["state"] == this.GetLocation_Error) {
            isGetError = true;
            this.MyAddress = "";
            this.MyLatitudeEx = 0;
            this.MyLongitudeEx = 0;
            this.SendGetLocation(isGetError);
            // 高德定位失败, 调用百度定位。
            console.log(">>>>>>>>>>_NativeNotify\uFF1A baiduMap start location\uFF01");
            this.GetLocationForBaiduMap();
            return;
        }
        this.MyLatitudeEx = serverPack["Latitude"];
        this.MyLongitudeEx = serverPack["Longitude"];
        this.MyAddress = serverPack["City"] + serverPack["District"] + serverPack["Street"];
        this.SendGetLocation(isGetError);
    },

    //获取定位
    OnGetLocation: function OnGetLocation() {
        if (!cc.sys.isNative) {
            this.SendDefaultLocation();
            return;
        } else {
            //手机调用gprs调用上去
            app[app.subGameName + "_NativeManager"]().CallToNative("GetLocation", []);
        }
    },

    // 默认定位
    SendDefaultLocation: function SendDefaultLocation() {
        var num1 = Math.floor(Math.random() * 10 + 1);
        var num2 = Math.floor(Math.random() * 10 + 1);
        //网页测试随机发送定位上去
        var isGetError = false;
        if (num1 > 9) {
            //    isGetError = true;
        }
        this.MyAddress = "福建省厦门市思明区软件园二期望海路35号";
        this.MyLatitudeEx = 24.48591905381944 + num1;
        this.MyLongitudeEx = 118.1971853298611 - num2;
        this.SendGetLocation(isGetError);
    },

    // ================= 百度地图 ==========================
    //百度地图获取定位
    GetLocationForBaiduMap: function GetLocationForBaiduMap() {
        if (!cc.sys.isNative) {
            this.SendDefaultLocation();
            return;
        } else {
            //手机调用gprs调用上去
            app[app.subGameName + "_NativeManager"]().CallToNative("GetLocationForBaiduMap", []);
        }
    },

    // 百度地图获取定位结果
    OnGetLocationForBaiduMapCallBack: function OnGetLocationForBaiduMapCallBack(serverPack) {
        app[app.subGameName + "_NativeManager"]().CallToNative("StopLocationForBaiduMap", []); // 停止定位。

        var isGetError = false;
        this.MyAddress = '';

        if (serverPack["state"] == this.GetLocation_Error) {
            isGetError = true;
            this.MyAddress = "";
            this.MyLatitudeEx = 0;
            this.MyLongitudeEx = 0;
            this.SendGetLocation(isGetError);
            return;
        }
        this.MyLatitudeEx = serverPack["Latitude"];
        this.MyLongitudeEx = serverPack["Longitude"];
        this.MyAddress = serverPack["City"] + serverPack["District"] + serverPack["Street"];
        this.SendGetLocation(isGetError);
    }

});

var g_sss_LocationOnStartMgr = null;
/**
...
*/
exports.GetModel = function () {
    if (!g_sss_LocationOnStartMgr) {
        g_sss_LocationOnStartMgr = new sss_LocationOnStartMgr();
    }
    return g_sss_LocationOnStartMgr;
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
        //# sourceMappingURL=fjssz_LocationOnStartMgr.js.map
        