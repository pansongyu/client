"use strict";
cc._RF.push(module, '38e8dOMMzxOBZnHbuTsPV13', 'UILogin');
// script/ui/UILogin.js

"use strict";

/*
    UILogin 登陆界面
*/
var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        EditBoxAccount: cc.EditBox,
        EditBoxPsw: cc.EditBox

    },

    //初始化
    OnCreateInit: function OnCreateInit() {
        this.HeroAccountManager = app.HeroAccountManager();
        this.ShareDefine = app.ShareDefine();

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
        if (cc.sys.isNative) {
            app.FormManager().ShowForm("UILogin01");
            this.CloseForm();
            return;
        }
        var httpPath = app.Client.GetClientConfigProperty("WebSiteUrl");
        if (httpPath[httpPath.length - 1] == "/") {
            httpPath = httpPath.substring(0, httpPath.length - 1);
        }
        httpPath = httpPath + "/index.php?module=Api&action=Config";
        app.NetRequest().SendHttpRequestGet(httpPath, "", {}, 15000, function (serverUrl, responseText, httpRequest) {
            var data = JSON.parse(responseText);
            app.Config = data.data;
        });
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
            //token = this.HeroAccountManager.GetAccountToken(account);
            //this.isToken = 1;
        }

        this.EditBoxAccount.string = account;
        this.EditBoxPsw.string = '123456';
    },

    //---------点击函数---------------------

    OnClick: function OnClick(btnName, btnNode) {
        // this.HeroAccountManager.LoginAccountBySDK();
        if (btnName == "btnLogin") {
            this.Click_btnLogin();
        } else if (btnName == "btnReg") {
            this.Click_btnReg();
        } else {
            this.ErrLog("OnClick:%s not find", btnName);
        }
    },

    //点击登陆
    Click_btnLogin: function Click_btnLogin() {
        var charAccount = this.EditBoxAccount.string;
        if (!charAccount) {
            this.ShowSysMsg("AccountLogin_NotInputAccount");
            return;
        }
        var psw = '123456';
        if (!psw) {
            this.ShowSysMsg("AccountLogin_NotInputPsw");
            return;
        }

        //如果密码等于token为token登录
        /*if(this.isToken){
        psw = this.HeroAccountManager.GetAccountToken(charAccount);
        }*/

        //账号密码登陆
        this.HeroAccountManager.AccountLogin(charAccount, psw, this.isToken);
    },

    //点击注册
    Click_btnReg: function Click_btnReg() {
        this.HeroAccountManager.OneKeyRegAccount();
    },

    OnEditBoxBegin: function OnEditBoxBegin(sender) {

        //如果点击了密码输入,则清除token标示
        /*if(sender == this.EditBoxPsw){
         this.isToken = 0;
         sender.string = "";
        }*/
    },

    //2次确认回调
    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {

        if (clickType != "Sure") {
            return;
        }
        if (msgID == "Code_10016") {
            var QQQunLink = app.Client.GetClientConfigProperty("QQQunLink");
            cc.sys.openURL(QQQunLink);
        }
    },
    UpdateAccessPoint: function UpdateAccessPoint() {
        app.HeroAccountManager().ChangeAccessPoint();
    }
});

cc._RF.pop();