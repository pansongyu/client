"use strict";
cc._RF.push(module, 'b3d4djrOjRNRKUG5RAVPl+p', 'WeChatAppManager');
// script/sdk/WeChatAppManager.js

"use strict";

/**
 * Created by guoliangxuan on 2017/3/16.
 */
/**
 * WeChatAppManager.js 微信appSDK.
 */
var app = require('app');

var WeChatAppManager = app.BaseClass.extend({
	Init: function Init() {
		this.JS_Name = "WeChatAppManager";

		this.ShareDefine = app.ShareDefine();
		this.HeroAccountManager = app.HeroAccountManager();
		this.NetManager = app.NetManager();
		this.LocalDataManager = app.LocalDataManager();
		this.ComTool = app.ComTool();

		this.dataInfo = {};

		//this.OnReload();
	},

	OnReload: function OnReload() {},

	//---------------接收函数-------------------
	//收到预订单信息
	ReceivePrepayOrder: function ReceivePrepayOrder(serverPack) {
		var prepayOrderInfo = serverPack["PrepayOrderInfo"];

		var argDict = prepayOrderInfo["ArgDict"];
		var argList = [];
		try {
			argList = [{ "Name": "OrderJson", "Value": JSON.stringify(argDict) }];
		} catch (error) {
			this.ErrLog("ReceivePrepayOrder error:%s", error.stack);
			return;
		}
		if (app.SDKManager().CheckIsAppCheck()) {
			app.NativeManager().CallToNative("BuyAppStoreShop", [{ "Name": "BuyType", "Value": prepayOrderInfo.ProductID - 1 }]);
		} else {
			app.NativeManager().CallToNative("OnWeChatPay", argList);
		}
	},

	//------------调用接口---------------
	//微信授权
	Login: function Login() {

		//如果本地缓存了accessToken
		var accessTokenInfo = this.LocalDataManager.GetConfigProperty("Account", "AccessTokenInfo");
		var sdkToken = "";
		var sdkAccountID = 0;
		//直接登录服务器
		if (accessTokenInfo) {
			sdkToken = accessTokenInfo["SDKToken"];
			sdkAccountID = accessTokenInfo["AccountID"];
		}

		if (sdkAccountID && sdkToken) {
			//使用上次的授权缓存token
			console.log("缓存了token，直接验证");
			console.log("WeChatAppManager Login: ", sdkAccountID);
			this.SendLoginByWeChatAuthorization(sdkToken, sdkAccountID);
		} else {
			console.log("本地无微信token缓存,需要请求微信");
			app.NativeManager().CallToNative("OnWeChatLogin", []);
		}
	},

	//检查登录是否是短线重登
	CheckLoginBySDK: function CheckLoginBySDK() {
		//如果本地缓存了accessToken
		var accessTokenInfo = this.LocalDataManager.GetConfigProperty("Account", "AccessTokenInfo");
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
	ShareText: function ShareText(title, flag) {
		var argList = [{ "Name": "Text", "Value": title }, { "Name": "Flag", "Value": flag }];
		app.NativeManager().CallToNative("OnWeChatShareText", argList);
	},
	//微信分享
	Share: function Share(title, description, urlStr, flag, argDict) {
		if (!argDict) {
			argDict = {};
		}
		var argList = [{ "Name": "Title", "Value": title }, { "Name": "Description", "Value": description }, { "Name": "URL", "Value": urlStr }, { "Name": "Type", "Value": flag }];
		app.NativeManager().CallToNative("OnWeChatShare", argList);
	},

	ShareImage: function ShareImage(imagePath, flag) {
		var argList = [{ "Name": "ImagePath", "Value": imagePath }, { "Name": "Type", "Value": flag }];
		//app.NativeManager().CallToNative("OnWeChatShare", argList);
		app.NativeManager().CallToNative("OnWeChatShareImage", argList);
	},

	//全屏分享(0:分享到微信好友，1：分享到微信朋友圈 shareType：字符串)
	ShareScreen: function ShareScreen(shareType) {
		//this.SysLog("ShareScreen  00000");
		//默认发给朋友
		if (!shareType) {
			shareType = "0";
		}

		if (!cc.sys.isNative) {
			this.ErrLog("ShareScreen not native");
			return;
		}
		var filePath = this.Capture();
		if (filePath != "") {
			this.ShareImage(filePath, shareType);
		}
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

	//微信登录
	OnNativeNotifyWXLogin: function OnNativeNotifyWXLogin(dataDict) {
		var errCode = dataDict["ErrCode"];

		//0:成功
		//-1:普通错误类型,
		//-2:用户点击取消并返回
		//-3:发送失败
		//-4:授权失败
		//-5:微信不支持

		if (errCode == 0) {
			this.dataInfo = dataDict;
			var code = this.dataInfo["Code"];
			if (!code) {
				this.ErrLog("SendLoginByWeChatAuthorization not find Code:", this.dataInfo);
				this.HeroAccountManager.IsDoLogining(false);
				return;
			}
			console.log("授权了新token，直接验证");
			this.SendLoginByWeChatAuthorization(code, 0);
		} else if (errCode == -2) {
			this.SysLog("OnNativeNotifyWXLogin Cancel");
			setTimeout(function () {
				app.SysNotifyManager().ShowSysMsg("CodeErrorMsg", ["微信授权失败"]);
			}, 100);

			this.HeroAccountManager.IsDoLogining(false);
		} else {
			this.ErrLog("OnNativeNotifyWXLogin dataDict:", dataDict);
			setTimeout(function () {
				app.SysNotifyManager().ShowSysMsg("CodeErrorMsg", ["微信授权失败"]);
			}, 100);

			this.HeroAccountManager.IsDoLogining(false);
		}
	},

	//微信分享
	OnNativeNotifyWXShare: function OnNativeNotifyWXShare(dataDict) {
		console.log("OnNativeNotifyWXShare:", dataDict);
		this.SysLog("OnNativeNotifyWXShare dataDict:" + dataDict);
		var errCode = dataDict["ErrCode"];
		//0:分享成功
		//-1:普通错误类型,
		//-2:用户点击取消并返回
		//-3:发送失败,
		//-4:授权失败,
		//-5:微信不支持,
		this.SysLog("OnNativeNotifyWXShare errCode:" + errCode);
		if (errCode == 0) {
			//this.SysLog("OnNativeNotifyWXShare Request:CPlayerReceiveShare");
			//app.NetManager().SendPack("game.CPlayerReceiveShare",{});
			app.FormManager().CloseForm('game/base/ui/majiang/UIMJSharePaiXingMax');
			var isShow = app.FormManager().IsFormShow('game/base/ui/majiang/UIMJSharePaiXingMini');
			this.SysLog("OnNativeNotifyWXShare UIMJSharePaiXingMini isShow:" + isShow);
			if (isShow) {
				this.SysLog("OnNativeNotifyWXShare UIMJSharePaiXingMini Event_ShareSuccess");
				app.FormManager().GetFormComponentByFormName("game/base/ui/majiang/UIMJSharePaiXingMini").Event_ShareSuccess(false);
				return;
			}
			app.Client.OnEvent("ShareSuccess", "");
			app.Client.OnEvent("ChouJiangShareSuccess", "");
		}
		//用户点击取消并返回
		else if (errCode == -2) {
				this.SysLog("OnNativeNotifyWXShare Cancel");
			} else {
				this.ErrLog("OnNativeNotifyWXShare:", dataDict);
				app.SysNotifyManager().ShowSysMsg("CodeErrorMsg", ["微信分享失败:" + errCode]);
			}
	},

	//微信支付
	OnNativeNotifyWXPay: function OnNativeNotifyWXPay(dataDict) {

		var errCode = dataDict["ErrCode"];
		//0:支付成功
		if (errCode == 0) {} else if (errCode == -2) {
			this.SysLog("OnNativeNotifyWXPay Cancel");
		} else {
			this.ErrLog("OnNativeNotifyWXPay:", dataDict);
			app.SysNotifyManager().ShowSysMsg("CodeErrorMsg", ["支付失败:" + errCode]);
		}
	},

	//----------------发包接口------------------------
	//发送授权登录
	SendLoginByWeChatAuthorization: function SendLoginByWeChatAuthorization(token, sdkAccountID) {
		console.log("开始发送授权登录");
		var mpID = app.Client.GetClientConfigProperty("MPID");
		if (!mpID) {
			this.ErrLog("SendLoginByWeChatAuthorization not find MPID");
			return;
		}
		console.log("WeChatAppManager SendLoginByWeChatAuthorization 11111111111111");
		this.HeroAccountManager.LoginAccountBySDK(this.ShareDefine.SDKType_WeChatApp, token, mpID, sdkAccountID);
	},

	//截屏保存方法
	Capture: function Capture() {
		var node = new cc.Node();
		node.parent = cc.director.getScene();
		var camera = node.addComponent(cc.Camera);

		node.x = cc.winSize.width / 2;
		node.y = cc.winSize.height / 2;

		// 设置你想要的截图内容的 cullingMask
		camera.cullingMask = 0xffffffff;

		// 新建一个 RenderTexture，并且设置 camera 的 targetTexture 为新建的 RenderTexture，这样 camera 的内容将会渲染到新建的 RenderTexture 中。
		var texture = new cc.RenderTexture();
		var gl = cc.game._renderContext;
		// 如果截图内容中不包含 Mask 组件，可以不用传递第三个参数 gl.STENCIL_INDEX8
		texture.initWithSize(cc.winSize.width, cc.winSize.height, gl.STENCIL_INDEX8);
		camera.targetTexture = texture;

		// 渲染一次摄像机，即更新一次内容到 RenderTexture 中
		camera.render();

		// 这样我们就能从 RenderTexture 中获取到数据了
		var data = texture.readPixels();

		//以下代码将截图后默认倒置的图片回正
		var width = Math.floor(cc.winSize.width);
		var height = Math.floor(cc.winSize.height);
		console.log("width === " + width + ",height === " + height);
		var picData = new Uint8Array(width * height * 4);
		var rowBytes = width * 4;
		for (var row = 0; row < height; row++) {
			var srow = height - 1 - row;
			var start = Math.floor(srow * width * 4);
			var reStart = row * width * 4;
			// save the piexls data
			for (var i = 0; i < rowBytes; i++) {
				picData[reStart + i] = data[start + i];
			}
		}
		// 接下来就可以对这些数据进行操作了
		if (CC_JSB) {
			var name = Math.floor(Date.now()) + '.png';
			var filePath = jsb.fileUtils.getWritablePath() + name;
			var success = jsb.saveImageData(picData, width, height, filePath);
			node.destroy();
			if (success) {
				console.log("ShareScreen imagePath=%s", filePath);
				return filePath;
			} else {
				console.log("save image data failed!");
				return "";
			}
		}
	}
});

var g_WeChatAppManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_WeChatAppManager) {
		g_WeChatAppManager = new WeChatAppManager();
	}
	return g_WeChatAppManager;
};

cc._RF.pop();