(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/fjssz_UILogin.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fjssz04f-1f9e-4f2b-9449-a25eac6e6ea7', 'fjssz_UILogin', __filename);
// script/ui/fjssz_UILogin.js

"use strict";

/*
    UILogin 登陆界面
*/
var app = require("fjssz_app");

cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {},

	//初始化
	OnCreateInit: function OnCreateInit() {
		this.gameName = app["subGameName"];

		this.EditBoxAccount = this.node.getChildByName("EditBoxAccount").getComponent(cc.EditBox);
		this.EditBoxPsw = this.node.getChildByName("EditBoxPsw").getComponent(cc.EditBox);
		this.HeroAccountManager = app[this.gameName + "_HeroAccountManager"]();
		this.ShareDefine = app[this.gameName + "_ShareDefine"]();

		this.RegEvent("CodeError", this.Event_CodeError);
		this.RegEvent("ConnectFail", this.Event_ConnectFail);

		this.isToken = 0;
	},

	//登录错误码
	Event_CodeError: function Event_CodeError(event) {
		var argDict = event;
		var code = argDict["Code"];
		if (code == this.ShareDefine.KickOut_AccountTokenError) {
			this.EditBoxPsw.string = "";
		} else if (code == this.ShareDefine.KickOut_ServerClose) {
			this.WaitForConfirm("Code_10016", [], [], this.ShareDefine.ConfirmYN);
		}
	},

	//连接服务器失败
	Event_ConnectFail: function Event_ConnectFail(event) {
		this.UpdateAccessPoint();
		var argDict = event;
		if (!argDict['bCloseByLogout']) this.ShowSysMsg("Net_ConnectFail");
	},

	//--------------------显示函数----------------

	OnShow: function OnShow() {

		this.ShowAccountInfo();
	},

	//显示账号信息
	ShowAccountInfo: function ShowAccountInfo() {
		var accountList = this.HeroAccountManager.GetLocalAccountList();
		var count = accountList.length;

		var account = "";
		var token = "";

		if (count) {
			account = accountList[count - 1];
			token = this.HeroAccountManager.GetAccountToken(account);
			this.isToken = 1;
		}

		this.EditBoxAccount.string = account;
		this.EditBoxPsw.string = token;
	},

	//---------点击函数---------------------

	OnClick: function OnClick(btnName, btnNode) {

		if (btnName == "btnLogin") {
			this.Click_btnLogin();
		} else if (btnName == "btnReg") {
			this.Click_btnReg();
		} else {
			console.error("OnClick:%s not find", btnName);
		}
	},

	//点击登陆
	Click_btnLogin: function Click_btnLogin() {
		var charAccount = this.EditBoxAccount.string;
		if (!charAccount) {
			this.ShowSysMsg("AccountLogin_NotInputAccount");
			return;
		}
		var psw = this.EditBoxPsw.string;
		if (!psw) {
			this.ShowSysMsg("AccountLogin_NotInputPsw");
			return;
		}

		//如果密码等于token为token登录
		if (this.isToken) {
			psw = this.HeroAccountManager.GetAccountToken(charAccount);
		}

		//账号密码登陆
		this.HeroAccountManager.AccountLogin(charAccount, psw, this.isToken);
	},

	//点击注册
	Click_btnReg: function Click_btnReg() {
		this.HeroAccountManager.OneKeyRegAccount();
	},

	OnEditBoxBegin: function OnEditBoxBegin(sender) {

		//如果点击了密码输入,则清除token标示
		if (sender == this.EditBoxPsw) {
			this.isToken = 0;
			sender.string = "";
		}
	},
	UpdateAccessPoint: function UpdateAccessPoint() {
		this.HeroAccountManager.ChangeAccessPoint();
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
        //# sourceMappingURL=fjssz_UILogin.js.map
        