/*
 * 	NativeManager.js
 * 	移动端接口管理器
 *
 *	author:hongdian
 *	date:2014-10-28
 *	version:1.0
 *
 * 修改时间 修改人 修改内容:
 *
 * change: "2014-10-28 20:24" hongdian 同步C++
 *
 */
var app = require("app");
/**
 * 类构造
 */
window.hall_NativeNotify = {
    //native平台回调
    OnNativeNotify: function (eventType, eventDataString) {
        try {
            console.log("hall_NativeNotify OnNativeNotify eventType:" + eventType + ",eventDataString:" + eventDataString);
            // this.ErrLog("OnNativeNotify eventType:%s, eventDataString:%s",eventType, eventDataString);
            let dataDict = JSON.parse(eventDataString);
            if (dataDict["subGameName"] != "hall") {
                return;
            }
            if (eventType == "wechat") { //微信登录
                app.WeChatAppManager().OnNativeNotifyWXLogin(dataDict);
            } else if (eventType == "XLLogin") {  //闲聊登录
                app.XLAppManager().OnNativeNotifyXLLogin(dataDict);
            }
            else if (eventType == "OnLineSDKLogin") {  // line 登录
                app.LineAppManager().OnNativeNotifyLineLogin(dataDict);
            }
            else if (eventType == "OnFacebookSDKLogin") {  // Facebook 登录
                app.FacebookAppManager().OnNativeNotifyFacebookLogin(dataDict);
            }
            else if (eventType == "OnFacebookUserInfo") {  // Facebook 用户信息
                app.FacebookAppManager().OnNativeNotifyFacebookUserInfo(dataDict);
            }
            else if (eventType == "wechatShare") {  //微信分享
                app.WeChatAppManager().OnNativeNotifyWXShare(dataDict);
            } else if (eventType == "wechatPay") { //微信支付
                app.WeChatAppManager().OnNativeNotifyWXPay(dataDict);
            } else if (eventType == "onBatteryLevel") { //电量回掉
                app.Client.OnEvent("EvtBatteryLevel", { "Level": dataDict["Level"], "status": dataDict["status"] });
            } else if (eventType == "apkProess") { //下载apk进度
                app.Client.OnEvent("LoadApkProess", { "progress": dataDict["proess"] });
            } else if (eventType == "download") { //下载
                app.DownLoadMgr().OnDownLoadEvent(dataDict);
            } else if (eventType == "palyAudioFinsh") { //播放完成
                app.Client.OnEvent("palyAudioFinsh", {});
            } else if (eventType == "AudioError") {//录音失败
                app.Client.OnEvent("AudioError", {});
            } else if (eventType == "AudioStopError") {//录音失败
                app.Client.OnEvent("AudioStopError", {});
            } else if (eventType == "MedioRecordError") {//播放失败
                app.Client.OnEvent("MedioRecordError", {});
            } else if (eventType == "wellPrepared") {//准备录音
                app.Client.OnEvent("wellPrepared", {});
            } else if (eventType == "RecordAudioFinsh") { //录音完成
                app.Client.OnEvent("RECORDAUDIOFINSH", {});
            } else if (eventType == "GETLOCATION") { //获取定位
                app.LocationOnStartMgr().OnGetLocationCallBack(dataDict);
            } else if (eventType == "OnGetLocationForBaiduMapCallBack") { //获取百度定位结果
                app.LocationOnStartMgr().OnGetLocationForBaiduMapCallBack(dataDict);
            } else if (eventType == "copyText") { //获取定位
                app.Client.OnEvent("OnCopyTextNtf", dataDict);
            } else if (eventType == "getClipboardText") { //获取剪切板数据
                app.Client.OnEvent("OnGetClipboardTextNtf", dataDict);
            } else if (eventType == "DDShare") {
                app.Client.OnEvent("OnDDShare", dataDict);
            } else if (eventType == "XLShare") {
                app.Client.OnEvent("OnXLShare", dataDict);
            } else if (eventType == "OnUploadImageCallBack") {
                app.Client.OnEvent("OnUploadImage", dataDict);
            } else if (eventType == "CheckMicPermission") {
                app.Client.OnEvent("CheckMicPermission", dataDict);
            }
            else {
                // this.ErrLog("OnNativeNotify not find eventType:%s", eventType);
                console.log("hall_NativeNotify OnNativeNotify not find eventType: " + eventType);
            }
        }
        catch (error) {
            if (eventType == 'wechatShare') {
                //还是给分享成功回调
                app.WeChatAppManager().OnNativeNotifyWXShare({ "ErrCode": 0 });
            } else {
                // this.ErrLog("OnNativeNotify(%s,%s) error(%s), error.stack:%s", eventType, eventDataString, error, error.stack);
                console.log("hall_NativeNotify OnNativeNotify error: " + eventType);
            }
        }
    },
}