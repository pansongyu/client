"use strict";
cc._RF.push(module, '996ffDihzJP+6FaW8m6BmpS', 'FacebookAppManager');
// script/sdk/FacebookAppManager.js

"use strict";

/*
	FacebookAppManager.js   类似微信的聊天软件sdk
 */
var app = require('app');

var FacebookAppManager = app.BaseClass.extend({

	Init: function Init() {
		this.JS_Name = "FacebookAppManager";

		this.ShareDefine = app.ShareDefine();
		this.SysDataManager = app.SysDataManager();
		this.HeroAccountManager = app.HeroAccountManager();
		this.NetManager = app.NetManager();
		this.ControlManager = app.ControlManager();
		this.HeroManager = app.HeroManager();
		this.SysNotifyManager = app.SysNotifyManager();
		this.LocalDataManager = app.LocalDataManager();

		this.dataInfo = {};

		this.Log("Init");
	},

	// Facebook授权
	Login: function Login() {
		app.NativeManager().CallToNative("OnFacebookLogin", []);
		// 如果本地缓存了accessToken
		// let accessTokenInfo = this.LocalDataManager.GetConfigProperty("Account", "AccessTokenInfo");
		// let accessToken = "";
		// let sdkAccountID = 0;
		// let AccountType = 0;
		// // 直接登录服务器
		// if (accessTokenInfo) {
		// 	sdkAccountID = accessTokenInfo["userId"];
		// 	accessToken = accessTokenInfo["accessToken"];
		// 	AccountType = accessTokenInfo["AccountType"];
		// }
		// this.dataInfo = accessTokenInfo;
		// if (sdkAccountID && AccountType == this.ShareDefine.SDKType_FacebookApp) {
		// 	//使用上次的授权缓存token
		// 	console.log("Facebook login 缓存了token，直接验证");
		// 	this.SendLoginByFacebook(accessTokenInfo, accessToken, 0);
		// }
		// else {
		// 	app.NativeManager().CallToNative("OnFacebookLogin", []);
		// }
	},

	// Facebook 登录
	OnNativeNotifyFacebookLogin: function OnNativeNotifyFacebookLogin(dataInfo) {
		console.log("OnNativeNotifyFacebookLogin dataInfo: ", dataInfo);
		// let accessTokenInfo = {
		// 	headImgUrl: dataInfo["headImgUrl"],
		// 	nickName: dataInfo["nickName"],
		// 	userId: dataInfo["userId"],
		// 	accessToken: dataInfo["accessToken"],
		// }

		// this.dataInfo = accessTokenInfo;
		// this.SendLoginByFacebook(accessTokenInfo, dataInfo["accessToken"], 0);
	},

	// Facebook 用户信息
	OnNativeNotifyFacebookUserInfo: function OnNativeNotifyFacebookUserInfo() {
		console.log("OnNativeNotifyFacebookUserInfo dataInfo: ", dataInfo);
		var accessTokenInfo = {
			headImgUrl: dataInfo["headImgUrl"],
			nickName: dataInfo["nickName"],
			userId: dataInfo["userId"],
			accessToken: dataInfo["accessToken"]
		};

		this.dataInfo = accessTokenInfo;
		this.SendLoginByFacebook(accessTokenInfo, dataInfo["accessToken"], 0);
	},

	// 发送授权登录
	SendLoginByFacebook: function SendLoginByFacebook(accessTokenInfo, accessToken, sdkAccountID) {
		console.log("Facebook login 开始发送授权登录");
		this.HeroAccountManager.LoginAccountBySDK(this.ShareDefine.SDKType_FacebookApp, accessToken, accessTokenInfo, sdkAccountID);
	}

});

var g_FacebookAppManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_FacebookAppManager) {
		g_FacebookAppManager = new FacebookAppManager();
	}
	return g_FacebookAppManager;
};

cc._RF.pop();