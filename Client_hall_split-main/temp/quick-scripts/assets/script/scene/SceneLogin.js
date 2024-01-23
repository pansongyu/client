(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/scene/SceneLogin.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c9dd9Cl2tFEO6xk0+6Ool1s', 'SceneLogin', __filename);
// script/scene/SceneLogin.js

"use strict";

/*
 登陆场景
 */

var app = require("app");

cc.Class({
	extends: require("BaseScene"),

	properties: {
		LabelRes: cc.Label
	},

	//----------回掉函数------------------
	OnCreate: function OnCreate() {

		this.FormManager = app.FormManager();
		this.ShareDefine = app.ShareDefine();
		this.WeChatManager = app.WeChatManager();
		this.HeroAccountManager = app.HeroAccountManager();
		this.SDKManager = app.SDKManager();

		if (this.LabelRes) {
			this.LabelRes.string = app.ShareDefine().ClientVersion;
		}
	},

	//进入场景
	OnSwithSceneEnd: function OnSwithSceneEnd() {
		console.log("come in OnSwithSceneEnd");

		//如果是h5sdk直接登录
		if (this.SDKManager.IsH5AccountSDK()) {
			console.log("OnSwithSceneEnd IsH5AccountSDK");
			//直接调用登录服务器
			this.SDKManager.LoginBySDK();
			//重置微信分享文本,因为有可能被修改成分享房间的连接文本
			this.WeChatManager.InitGameWeChatShare();
		}
		//如果是appsdk 显示授权界面
		else if (this.SDKManager.IsAppAccountSDK()) {
				console.log("OnSwithSceneEnd 2 this.SDKManager.CheckLoginBySDK():%s", this.SDKManager.CheckLoginBySDK());
				if (this.SDKManager.CheckLoginBySDK()) {
					this.SDKManager.LoginBySDK();
				} else {
					// this.FormManager.ShowForm("UILogin01");
				}

				if (app.SDKManager().CheckIsAppCheck()) {
					this.FormManager.ShowForm("UILogin02");
				} else {
					this.FormManager.ShowForm("UILogin01");
				}
			}
			//否则公司内部账号登录界面
			else {
					console.log("OnSwithSceneEnd 公司内部账号登录界面");
					if (app.SDKManager().CheckIsAppCheck()) {
						this.FormManager.ShowForm("UILogin02");
					} else {
						this.FormManager.ShowForm("UILogin");
						//this.FormManager.ShowForm("UILogin01");	
					}
				}
	},

	OnTouchEnd: function OnTouchEnd(event) {}
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
        //# sourceMappingURL=SceneLogin.js.map
        