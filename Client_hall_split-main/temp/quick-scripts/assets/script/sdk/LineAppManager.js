(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/sdk/LineAppManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '92e32av7sdIHKvt5i9xSKuJ', 'LineAppManager', __filename);
// script/sdk/LineAppManager.js

"use strict";

/*
	  LineAppManager.js   类似微信的聊天软件sdk
 */
var app = require('app');

var LineAppManager = app.BaseClass.extend({

	Init: function Init() {
		this.JS_Name = "LineAppManager";

		this.ShareDefine = app.ShareDefine();
		this.SysDataManager = app.SysDataManager();
		this.HeroAccountManager = app.HeroAccountManager();
		this.NetManager = app.NetManager();
		this.ControlManager = app.ControlManager();
		this.HeroManager = app.HeroManager();
		this.SysNotifyManager = app.SysNotifyManager();
		this.LocalDataManager = app.LocalDataManager();

		// app.Client.RegEvent("PlayerLoginOK", this.OnEvent_LinePlayerLoginOK, this);

		this.dataInfo = {};

		//玩家第3方头像spriteFrame缓存字典
		//{heroID:{"HeadImageUrl":"XX","SpriteFrame":null}}
		// this.heroHeadSpriteFrame = {};

		this.Log("Init");
	},

	OnReload: function OnReload() {
		//这里不能reload，不然会导致登录不了，故直接return
		return;
	},

	GetSDKProperty: function GetSDKProperty(property) {
		if (!this.dataInfo.hasOwnProperty(property)) {
			this.ErrLog("GetSDKProperty not find property:%s", property);
			return;
		}

		return this.dataInfo[property];
	},

	//---------------授权接口--------------------

	// Line授权
	Login: function Login() {
		// 如果本地缓存了accessToken
		var accessTokenInfo = this.LocalDataManager.GetConfigProperty("Account", "AccessTokenInfo");
		var accessToken = "";
		var sdkAccountID = 0;
		var AccountType = 0;
		// 直接登录服务器
		if (accessTokenInfo) {
			sdkAccountID = accessTokenInfo["userId"];
			accessToken = accessTokenInfo["accessToken"];
			AccountType = accessTokenInfo["AccountType"];
		}
		this.dataInfo = accessTokenInfo;
		if (sdkAccountID && AccountType == this.ShareDefine.SDKType_LineApp) {
			//使用上次的授权缓存token
			console.log("Line login 缓存了token，直接验证");
			this.SendLoginByLine(accessTokenInfo, accessToken, 0);
		} else {
			app.NativeManager().CallToNative("OnLineLogin", []);
		}
	},

	// line 登录
	OnNativeNotifyLineLogin: function OnNativeNotifyLineLogin(dataInfo) {
		console.log("OnNativeNotifyLineLogin dataInfo: ", dataInfo);
		var accessTokenInfo = {
			headImgUrl: dataInfo["headImgUrl"],
			nickName: dataInfo["nickName"],
			userId: dataInfo["userId"],
			accessToken: dataInfo["accessToken"]
		};

		this.dataInfo = accessTokenInfo;
		this.SendLoginByLine(accessTokenInfo, dataInfo["accessToken"], 0);
	},

	// 发送授权登录
	SendLoginByLine: function SendLoginByLine(accessTokenInfo, accessToken, sdkAccountID) {
		console.error("line login 开始发送授权登录");
		this.HeroAccountManager.LoginAccountBySDK(this.ShareDefine.SDKType_LineApp, accessToken, accessTokenInfo, sdkAccountID);
	}

});

var g_LineAppManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_LineAppManager) {
		g_LineAppManager = new LineAppManager();
	}
	return g_LineAppManager;
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
        //# sourceMappingURL=LineAppManager.js.map
        