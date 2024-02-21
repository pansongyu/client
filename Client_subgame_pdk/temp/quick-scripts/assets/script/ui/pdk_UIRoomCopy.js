(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/pdk_UIRoomCopy.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'typdk00b-1e1d-4370-a125-c072c25df2e9', 'pdk_UIRoomCopy', __filename);
// script/ui/pdk_UIRoomCopy.js

"use strict";

var app = require("pdk_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {},
    OnCreateInit: function OnCreateInit() {
        this.RegEvent("OnCopyTextNtf", this.OnEvt_CopyTextNtf);
        this.RegEvent("OnDDShare", this.OnEvt_DDShare);
        this.RegEvent("OnXLShare", this.OnEvt_XLShare);
        this.SDKManager = app[app.subGameName + "_SDKManager"]();
    },
    OnShow: function OnShow(roomID, title, gamedesc, weChatAppShareUrl) {
        this.roomID = roomID;
        this.title = title;
        this.gamedesc = gamedesc;
        this.weChatAppShareUrl = weChatAppShareUrl;
    },
    OnEvt_CopyTextNtf: function OnEvt_CopyTextNtf(event) {
        if (0 == event.code) this.ShowSysMsg("已复制：" + event.msg);else this.ShowSysMsg("复制房号失败");
    },
    OnEvt_DDShare: function OnEvt_DDShare(event) {
        /*if(0 == event.ErrCode){
            this.ShowSysMsg("钉钉分享成功");
        }else if(2 == event.ErrCode){
            this.ShowSysMsg("取消钉钉分享");
        }else{
            if(event.ErrStr=='Canceled By User.'){
                this.ShowSysMsg("取消钉钉分享");
            }else{
                this.ShowSysMsg("钉钉分享失败："+event.ErrStr);
            }
            
        }*/
    },
    OnEvt_XLShare: function OnEvt_XLShare(event) {
        //"ErrCode": 0, //安卓返回值 0成功 -2取消  -4发送失败  -5没有安装 iOS返回值：0成功 1用户取消 3发送错误  4未知错误
        /*if(0 == event.ErrCode){
            this.ShowSysMsg("闲聊分享成功");
        }else if(-2 == event.ErrCode || 1 == event.ErrCode){
            this.ShowSysMsg("取消闲聊分享");
        }else if(-4 == event.ErrCode || 3 == event.ErrCode){
            this.ShowSysMsg("闲聊分享发送错误");
        }else{
            this.ShowSysMsg("闲聊分享失败");
        }*/
    },
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_wx") {
            this.ShareWX();
            this.CloseForm();
        } else if (btnName == "btn_dd") {
            this.ShareDD();
            this.CloseForm();
        } else if (btnName == "btn_xl") {
            this.ShareXL();
            this.CloseForm();
        } else {
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    },
    ShareWX: function ShareWX() {
        this.SDKManager.Share(this.title, this.gamedesc, this.weChatAppShareUrl, "0");
    },
    ShareDD: function ShareDD() {
        this.SDKManager.ShareDD(this.title, this.gamedesc, this.weChatAppShareUrl);
    },
    ShareXL: function ShareXL() {
        this.SDKManager.ShareXL(this.title, this.gamedesc, this.weChatAppShareUrl);
    },
    CopyRoomKey: function CopyRoomKey() {
        var str = "房号：" + this.roomID;
        if (cc.sys.isNative) {
            var argList = [{ "Name": "msg", "Value": str.toString() }];
            var promisefunc = function promisefunc(resolve, reject) {
                app[app.subGameName + "_NativeManager"]().CallToNative("copyText", argList);
            };
            return new app.bluebird(promisefunc);
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
        //# sourceMappingURL=pdk_UIRoomCopy.js.map
        