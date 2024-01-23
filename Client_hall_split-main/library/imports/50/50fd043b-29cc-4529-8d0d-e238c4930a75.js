"use strict";
cc._RF.push(module, '50fd0Q7KcxFKY0N4jjEkwp1', 'SDKManager');
// script/sdk/SDKManager.js

"use strict";

/*
	sdk管理器
*/
var app = require('app');

var SDKManager = app.BaseClass.extend({

	Init: function Init() {
		this.JS_Name = "SDKManager";

		this.ShareDefine = app.ShareDefine();
		this.SysDataManager = app.SysDataManager();
		this.HeroManager = app.HeroManager();
		this.ServerTimeManager = app.ServerTimeManager();
		this.NetManager = app.NetManager();
		this.HeroAccountManager = app.HeroAccountManager();
		this.LocalDataManager = app.LocalDataManager();
		this.WeChatManager = app.WeChatManager();
		this.WeChatAppManager = app.WeChatAppManager();
		this.ComTool = app.ComTool();

		this.NetManager.RegHttpNetPack(0x0008, this.OnHttpPack_PrepayOrderInfo, this);

		//this.OnReload();

		this.Log("Init");
	},

	OnReload: function OnReload() {
		var accountSDKManager = this.GetAccountSDK();
		if (!accountSDKManager) {
			this.ErrLog("OnReload not find sdk");
			return;
		}
		return accountSDKManager.OnReload();
	},

	//收到预订单服务器信息
	OnHttpPack_PrepayOrderInfo: function OnHttpPack_PrepayOrderInfo(serverPack) {
		var isSuccess = serverPack.IsSuccess;
		if (!isSuccess) {
			app.SysNotifyManager().ShowSysMsg("Order_PrepayOrderFail");
			return;
		}

		var prepayOrderInfo = serverPack.PrepayOrderInfo;
		var orderID = serverPack.OrderID;
		var appID = prepayOrderInfo.ProductID;
		var itemType = prepayOrderInfo.ItemType;
		var orderType = prepayOrderInfo.OrderType;

		var DiamondStore = this.SysDataManager.GetTableDict("DiamondStore");
		var diamondStore = DiamondStore[appID];
		if (!diamondStore) {
			this.ErrLog("Pay DiamondStore.txt not find:%s", appID);
			return;
		}
		var appPrice = diamondStore["AppPrice"];

		app.TalkingDataManager().RecordStartPay(orderID, itemType, appID, appPrice);

		if (orderType == this.ShareDefine.OrderType_Wechat) {
			this.WeChatManager.ReceivePrepayOrder(serverPack);
		} else if (orderType == this.ShareDefine.OrderType_QRCode) {
			this.WeChatManager.ReceivePrepayQRCodeOrder(serverPack);
		} else if (orderType == this.ShareDefine.OrderType_WechatApp) {
			this.WeChatAppManager.ReceivePrepayOrder(serverPack);
		} else if (orderType == 6) {
			this.WeChatAppManager.ReceivePrepayOrder(serverPack);
		} else {
			this.ErrLog("OnHttpPack_PrepayOrderInfo orderType:%s error", orderType);
		}
	},

	//初始化sdk参数H5启动携带参数
	InitSDKParameter: function InitSDKParameter(dataInfo) {

		var accountType = app.Client.GetClientConfigProperty("AccountType");

		//微信登录
		if (accountType == this.ShareDefine.SDKType_WeChat) {
			this.WeChatManager.InitWeChatSDKParameter(dataInfo);
		}
		//官网登录
		else if (accountType == this.ShareDefine.SDKType_Company) {}
			//微信app授权
			else if (accountType == this.ShareDefine.SDKType_WeChatApp) {}
				//手机授权
				else if (accountType == this.ShareDefine.SDKType_Mobile) {} else {
						this.SysLog("InitSDKParameter(%s):", accountType, dataInfo);
					}
	},

	//H5sdk
	IsH5AccountSDK: function IsH5AccountSDK() {

		var accountType = app.Client.GetClientConfigProperty("AccountType");

		//如果是微信公众授权,需要判断是否是微信浏览器
		if (accountType == this.ShareDefine.SDKType_WeChat) {
			if (this.ComTool.IsWeChatBrowser()) {
				return true;
			} else {
				return false;
			}
		}

		if (this.ShareDefine.H5AccountSDKTypeList.InArray(accountType)) {
			return true;
		}
		return false;
	},

	//appsdk
	IsAppAccountSDK: function IsAppAccountSDK() {
		var accountType = app.Client.GetClientConfigProperty("AccountType");
		if (this.ShareDefine.AppAccountSDKTypeList.InArray(accountType)) {
			return true;
		}
		return false;
	},

	GetAccountSDK: function GetAccountSDK() {
		var accountType = app.Client.GetClientConfigProperty("AccountType");
		if (accountType == this.ShareDefine.SDKType_WeChat) {
			return this.WeChatManager;
		} else if (accountType == this.ShareDefine.SDKType_WeChatApp) {
			return this.WeChatAppManager;
		} else {
			this.ErrLog("accountSDKType:%s", accountType);
			return;
		}
	},

	GetOrderSDK: function GetOrderSDK() {
		var orderType = app.Client.GetClientConfigProperty("OrderType");

		if (orderType == this.ShareDefine.OrderType_Wechat) {
			return this.WeChatManager;
		} else if (orderType == this.ShareDefine.OrderType_QRCode) {
			return this.WeChatManager;
		} else if (orderType == this.ShareDefine.OrderType_WechatApp) {
			return this.WeChatAppManager;
		} else {
			this.ErrLog("GetOrderSDK:%s", orderType);
			return null;
		}
	},

	//支付入口
	Pay: function Pay(appID) {
		if (this.CheckIsAppCheck()) {
			this.SendCreatePrePayOrder("Diamond", appID);
			return;
		}
		var orderSdkManager = this.GetOrderSDK();
		if (!orderSdkManager) {
			this.ErrLog("pay not orderSdkManager");
			return;
		}

		if (!orderSdkManager.GetSDK()) {
			this.ErrLog("pay not sdk");
			return;
		}

		this.SendCreatePrePayOrder("Diamond", appID);
	},

	//登录授权
	LoginBySDK: function LoginBySDK() {
		var accountSDKManager = this.GetAccountSDK();
		if (!accountSDKManager) {
			this.ErrLog("LoginBySDK not find sdk");
			return;
		}

		accountSDKManager.Login();
	},
	//闲聊授权登录
	LoginByXLSDK: function LoginByXLSDK() {
		app.XLAppManager().Login();
	},

	// Line 授权登录
	LoginByLineSDK: function LoginByLineSDK() {
		app.LineAppManager().Login();
	},

	// facebook 授权登录
	LoginByFacebookSDK: function LoginByFacebookSDK() {
		app.FacebookAppManager().Login();
	},

	LoginByMobile: function LoginByMobile(mobile, code) {
		app.HeroAccountManager().LoginAccountByMobile(mobile, code, 0);
	},

	//检查登录是否是短线重登
	CheckLoginBySDK: function CheckLoginBySDK() {
		var accountSDKManager = this.GetAccountSDK();
		if (!accountSDKManager) {
			this.ErrLog("CheckLoginBySDK not find sdk");
			return false;
		}
		return accountSDKManager.CheckLoginBySDK();
	},
	ShareText: function ShareText(title, flag) {
		var accountType = app.Client.GetClientConfigProperty("AccountType");
		if (accountType == this.ShareDefine.SDKType_WeChatApp) {
			this.WeChatAppManager.ShareText(title, flag);
		} else if (accountType == this.ShareDefine.SDKType_WeChat) {
			app.FormManager().ShowForm("UIMessageWeiXinShare");
		} else {
			this.ErrLog("Share not find SDKType_WeChatApp");
		}
	},
	//吊起微信APP分享
	//title:分享的标题
	//description:分享的描述
	//argDict:分享携带的参数字典("ShareRoomKey":11111)
	//url:分享携带的点击跳转地址
	//flag:native分享是需要指定"0":朋友,"1":朋友圈
	//
	Share: function Share(title, description, url, flag, argDict) {
		var accountType = app.Client.GetClientConfigProperty("AccountType");
		if (accountType == this.ShareDefine.SDKType_WeChatApp) {
			this.WeChatAppManager.Share(title, description, url, flag, argDict);
		} else if (accountType == this.ShareDefine.SDKType_WeChat) {
			app.FormManager().ShowForm("UIMessageWeiXinShare");
		} else {
			this.ErrLog("Share not find SDKType_WeChatApp");
		}
	},
	ShareDD: function ShareDD(title, description, urlStr) {
		var argList = [{ "Name": "title", "Value": title }, { "Name": "description", "Value": description }, { "Name": "urlStr", "Value": urlStr }];
		app.NativeManager().CallToNative("OnDDWeChatShare", argList);
	},
	ShareXL: function ShareXL(title, description, urlStr) {
		var argList = [{ "Name": "Title", "Value": title }, { "Name": "description", "Value": description }, { "Name": "urlStr", "Value": urlStr }, { "Name": "roomID", "Value": 'roomID' }, { "Name": "roomToken", "Value": "roomToken" }];
		app.NativeManager().CallToNative("OnXLShare", argList);
	},
	ShareMW: function ShareMW(title, description, urlStr) {
		var argList = [{ "Name": "Title", "Value": title }, { "Name": "description", "Value": description }, { "Name": "urlStr", "Value": urlStr }, { "Name": "roomID", "Value": 'roomID' }, { "Name": "roomToken", "Value": "roomToken" }];
		app.NativeManager().CallToNative("OnMWShare", argList);
	},

	// line 
	ShareLineLink: function ShareLineLink(title, description, urlStr) {
		var argList = [{ "Name": "Title", "Value": title }, { "Name": "description", "Value": description }, { "Name": "urlStr", "Value": urlStr }];
		app.NativeManager().CallToNative("OnLineShareLink", argList);
	},

	ShareLineText: function ShareLineText(title, description) {
		var argList = [{ "Name": "Title", "Value": title }, { "Name": "description", "Value": description }];
		app.NativeManager().CallToNative("OnLineShareText", argList);
	},

	// facebook
	ShareFacebookLink: function ShareFacebookLink(title, description, urlStr) {
		var argList = [{ "Name": "Title", "Value": title }, { "Name": "description", "Value": description }, { "Name": "urlStr", "Value": urlStr }];
		app.NativeManager().CallToNative("OnFacebookShareLink", argList);
	},

	/**
     * 手机震动抖动效果
     * @param {*} time ms 默认震动两秒
        app.SDKManager().VibrationEffect(time);
     * 
     */
	VibrationEffect: function VibrationEffect(time) {
		time = time || 2000;
		var argList = [{ "Name": "time", "Value": time }];
		app.NativeManager().CallToNative("OnVibrationEffect", argList);
	},

	/**
     * 停止手机震动抖动效果
     */
	StopVibrationEffect: function StopVibrationEffect() {
		app.NativeManager().CallToNative("OnStopVibrationEffect");
	},

	//微信全屏分享
	ShareScreen: function ShareScreen(flag) {
		var accountType = app.Client.GetClientConfigProperty("AccountType");
		if (accountType == this.ShareDefine.SDKType_WeChatApp) {
			this.WeChatAppManager.ShareScreen(flag);
		} else if (accountType == this.ShareDefine.SDKType_WeChat) {
			app.FormManager().ShowForm("UIMessageWeiXinShare");
		} else {
			this.ErrLog("Share not find SDKType_WeChatApp");
		}
	},
	ShareScreenDD: function ShareScreenDD() {
		var filePath = this.WeChatAppManager.Capture();
		if (filePath != "") {
			this.ShareImageDD(filePath);
		}
	},
	ShareImageDD: function ShareImageDD(imagePath) {
		var argList = [{ "Name": "imagePath", "Value": imagePath }];
		app.NativeManager().CallToNative("OnDDWeChatShareImage", argList);
	},
	ShareScreenXL: function ShareScreenXL() {
		var filePath = this.WeChatAppManager.Capture();
		if (filePath != "") {
			this.ShareImageXL(filePath);
		}
	},
	ShareImageXL: function ShareImageXL(imagePath) {
		var argList = [{ "Name": "ImagePath", "Value": imagePath }];
		app.NativeManager().CallToNative("OnXLShareImage", argList);
	},
	ShareScreenMW: function ShareScreenMW() {
		var filePath = this.WeChatAppManager.Capture();
		if (filePath != "") {
			this.ShareImageMW(filePath);
		}
	},

	ShareImageMW: function ShareImageMW(imagePath) {
		var argList = [{ "Name": "ImagePath", "Value": imagePath }];
		app.NativeManager().CallToNative("OnMWShareImage", argList);
	},

	ShareScreenLine: function ShareScreenLine() {
		var filePath = this.WeChatAppManager.Capture();
		if (filePath != "") {
			this.ShareImageLine(filePath);
		}
	},

	ShareImageLine: function ShareImageLine(imagePath) {
		var argList = [{ "Name": "ImagePath", "Value": imagePath }];
		app.NativeManager().CallToNative("OnLineShareImage", argList);
	},

	ShareFacebookImage: function ShareFacebookImage() {
		var imagePath = this.WeChatAppManager.Capture();
		if (imagePath != "") {
			var argList = [{ "Name": "ImagePath", "Value": imagePath }];
			app.NativeManager().CallToNative("OnFacebookShareImage", argList);
		}
	},

	//----------------发包接口------------------------
	//发送创建预付订单申请
	SendCreatePrePayOrder: function SendCreatePrePayOrder(itemType, appID) {
		var heroID = this.HeroManager.GetHeroID();
		if (!heroID) {
			this.ErrLog("SendCreatePrePayOrder not heroID");
			return;
		}

		var openid = this.HeroAccountManager.GetAccountProperty("Openid");
		var accountID = this.HeroManager.GetHeroProperty("accountID");
		var sendPack = this.NetManager.GetHttpSendPack(0xFF0A);

		var DiamondStore = this.SysDataManager.GetTableDict("DiamondStore");
		if (!DiamondStore.hasOwnProperty(appID)) {
			this.ErrLog("SendCreatePrePayOrder DiamondStore.txt not find %s", appID);
			return;
		}
		var appPrice = DiamondStore[appID]["AppPrice"] * 100;

		var gameID = app.Client.GetClientConfigProperty("GameID");
		var mpID = app.Client.GetClientConfigProperty("MPID");
		var orderType = app.Client.GetClientConfigProperty("OrderType");
		var serverID = app.Client.GetClientConfigProperty("ServerID");

		if (!mpID) {
			this.ErrLog("SendCreatePrePayOrder not find MPID");
			return;
		}

		if (this.CheckIsAppCheck()) {
			orderType = 6;
		}

		sendPack["ServerName"] = gameID;
		sendPack["ServerID"] = serverID;
		sendPack["HeroID"] = heroID;
		sendPack["AccountID"] = accountID;
		sendPack["ItemType"] = itemType;
		sendPack["ProductID"] = Math.floor(appID);
		sendPack["AppPrice"] = appPrice;
		sendPack["OrderType"] = orderType;
		sendPack["MPID"] = mpID;
		sendPack["Openid"] = openid;

		//console.log('SendCreatePrePayOrder pack', JSON.stringify(sendPack));

		this.NetManager.SendHttpPack(sendPack);
	},

	//是否是苹果送检版本
	CheckIsAppCheck: function CheckIsAppCheck() {
		var flag = false;
		var clientConfig = app.Client.GetClientConfig();
		//let checkVersion = app.ComTool().IsIOS() ? app.NativeManager().CallToNative("checkVersion", []) : false;
		var checkVersion = false;
		//let localVersion = app.ComTool().IsIOS() ? app.NativeManager().CallToNative("getVersion", [], "String") : "";
		var localVersion = '';
		var appPackType = app.PackDefine().APPLE_CHECK == clientConfig["appPackType"];
		// this.SysLog("app.PackDefine.APPLE_CHECK:%s,clientConfig[appPackType]:%s", app.PackDefine().APPLE_CHECK , clientConfig["appPackType"]);
		// this.SysLog("checkVersion:%s, appPackType:%s， clientConfig[appPackType]:%s,", checkVersion, appPackType, clientConfig["appPackType"]);
		// this.SysLog("appCheckVersion:%s",JSON.stringify( app.Client.GetClientConfig()));
		// this.SysLog("appCheckVersion:%s, localVersion:%s", app.Client.GetClientConfigProperty("appCheckVersion"), localVersion);

		if (app.ComTool().IsIOS() && appPackType && app.Client.GetClientConfigProperty("appCheckVersion") == localVersion) {
			flag = true;
		}
		return flag;
	}
});

var g_SDKManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_SDKManager) {
		g_SDKManager = new SDKManager();
	}
	return g_SDKManager;
};

cc._RF.pop();