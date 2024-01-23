(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/sdk/XLAppManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c0774wh6RhBTYnEWWSYaR2x', 'XLAppManager', __filename);
// script/sdk/XLAppManager.js

"use strict";

/**
 * Created by guoliangxuan on 2017/3/16.
 */
/**
 * XLAppManager.js 闲聊appSDK.
 */
var app = require('app');

var XLAppManager = app.BaseClass.extend({
    Init: function Init() {
        this.JS_Name = "XLAppManager";
        this.ShareDefine = app.ShareDefine();
        this.HeroAccountManager = app.HeroAccountManager();
        this.NetManager = app.NetManager();
        this.LocalDataManager = app.LocalDataManager();
        this.ComTool = app.ComTool();
        this.dataInfo = {};
    },

    OnReload: function OnReload() {},

    //------------调用接口---------------
    //微信授权
    Login: function Login() {
        //如果本地缓存了accessToken
        var XlOpenID = this.LocalDataManager.GetConfigProperty("Account", "XlOpenID");
        if (XlOpenID) {
            this.SendLoginByXLAuthorization(XlOpenID);
        } else {
            app.NativeManager().CallToNative("OnXLLogin", []);
        }
    },

    //检查登录是否是短线重登
    CheckLoginBySDK: function CheckLoginBySDK() {
        //如果本地缓存了accessToken
        var accessTokenInfo = this.LocalDataManager.GetConfigProperty("Account", "XLAccessTokenInfo");
        var sdkToken = "";
        var sdkAccountID = 0;
        //直接登录服务器
        if (accessTokenInfo) {
            sdkToken = accessTokenInfo["SDKToken"];
            sdkAccountID = accessTokenInfo["AccountID"];
        }

        if (sdkAccountID && sdkToken) {
            this.ErrLog("CheckLoginBySDK sdkaccountid and sdktoken have");
            return true;
        }
        this.ErrLog("CheckLoginBySDK sdkaccountid and sdktoken not have");
        return false;
    },
    //----------------获取接口------------------------

    GetSDKProperty: function GetSDKProperty(property) {
        if (!this.dataInfo.hasOwnProperty(property)) {
            this.ErrLog("GetSDKProperty not find property:%s", property);
            return;
        }
        return this.dataInfo[property];
    },

    GetSDK: function GetSDK() {
        return {};
    },

    //--------------回调接口-----------------------------

    //闲聊登录
    OnNativeNotifyXLLogin: function OnNativeNotifyXLLogin(dataDict) {
        var errCode = dataDict["ErrCode"];

        //0:成功
        //-1:普通错误类型,
        //-2:用户点击取消并返回
        //-3:发送失败
        //-4:授权失败

        if (errCode == 0) {
            this.dataInfo = dataDict;
            var code = this.dataInfo["Code"];
            if (!code) {
                this.ErrLog("SendLoginByXLAuthorization not find Code:", this.dataInfo);
                this.HeroAccountManager.IsDoLogining(false);
                return;
            }
            this.GetXlUserInfo(code);
            //this.SendLoginByXLAuthorization(code);
        } else if (errCode == -2) {
            this.SysLog("OnNativeNotifyWXLogin Cancel");
            setTimeout(function () {
                app.SysNotifyManager().ShowSysMsg("CodeErrorMsg", ["闲聊授权失败"]);
            }, 100);

            this.HeroAccountManager.IsDoLogining(false);
        } else {
            this.ErrLog("OnNativeNotifyWXLogin dataDict:", dataDict);
            setTimeout(function () {
                app.SysNotifyManager().ShowSysMsg("CodeErrorMsg", ["闲聊授权失败"]);
            }, 100);

            this.HeroAccountManager.IsDoLogining(false);
        }
    },

    GetXlUserInfo: function GetXlUserInfo(code) {
        console.log("闲聊登录获取玩家信息:code==" + code);
        //获取access Url
        this.GetOpenIDUrl = "http://code.qicaiqh.com/qinghuaiXL.php?code=" + code;
        this.SendHttpRequest(this.GetOpenIDUrl, "", "GET", {});
    },

    SendHttpRequest: function SendHttpRequest(serverUrl, argString, requestType, sendPack) {
        // app.NetRequest().SendHttpRequest(serverUrl, argString, requestType, sendPack, 2000, 
        //     this.OnReceiveHttpPack.bind(this), 
        //     this.OnConnectHttpFail.bind(this),
        //     null,
        //     this.OnConnectHttpFail.bind(this),
        // );
        var url = [serverUrl, argString].join("");

        var dataStr = JSON.stringify(sendPack);

        //每次都实例化一个，否则会引起请求结束，实例被释放了
        var httpRequest = new XMLHttpRequest();

        httpRequest.timeout = 2000;

        httpRequest.open(requestType, url, true);
        //服务器json解码
        httpRequest.setRequestHeader("Content-Type", "application/json");
        var that = this;
        httpRequest.onerror = function () {
            that.ErrLog("httpRequest.error:%s", url);
            that.OnConnectHttpFail(serverUrl, httpRequest.readyState, httpRequest.status);
        };
        httpRequest.ontimeout = function () {};
        httpRequest.onreadystatechange = function () {
            //执行成功
            if (httpRequest.status == 200) {
                if (httpRequest.readyState == 4) {
                    that.OnReceiveHttpPack(serverUrl, httpRequest.responseText);
                }
            } else {
                that.OnConnectHttpFail(serverUrl, httpRequest.readyState, httpRequest.status);
                that.ErrLog("onreadystatechange(%s,%s)", httpRequest.readyState, httpRequest.status);
            }
        };
        httpRequest.send(dataStr);
    },
    OnReceiveHttpPack: function OnReceiveHttpPack(serverUrl, httpResText) {
        try {
            console.log("xllogin OnReceiveHttpPack = " + httpResText);
            var serverPack = JSON.parse(httpResText);
            if (serverPack["err_code"] == 0) {
                var openID = serverPack['data']['openId'];
                this.SendLoginByXLAuthorization(openID);
            }
        } catch (error) {}
    },
    OnConnectHttpFail: function OnConnectHttpFail(serverUrl, readyState, status) {},

    //----------------发包接口------------------------
    //发送授权登录
    SendLoginByXLAuthorization: function SendLoginByXLAuthorization(XlOpenID) {
        //openID发送给服务端
        var that = this;
        app['XlOpenID'] = XlOpenID;
        this.NetManager.SendPack("base.C1008LoginXL", { "xlUnionid": XlOpenID }, function (success) {
            app['XlOpenID'] = "";
            app.ServerTimeManager().InitLoginData(success);
            app.WorldInfoManager().InitLoginData(success);
            that.NetManager.SendPack("base.C1006RoleLogin", { "accountID": success.accountID }, function (success2) {
                that.LocalDataManager.SetConfigProperty("Account", "XlOpenID", XlOpenID);
                //自动登录大厅
            }, function (error) {});
        }, function (error) {
            that.LocalDataManager.SetConfigProperty("Account", "XlOpenID", "");
        });
    }
});

var g_XLAppManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
    if (!g_XLAppManager) {
        g_XLAppManager = new XLAppManager();
    }
    return g_XLAppManager;
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
        //# sourceMappingURL=XLAppManager.js.map
        