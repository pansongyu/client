"use strict";
cc._RF.push(module, 'fe96eTfnrtMG7kajmq7jmiP', 'HeroAccountManager');
// script/dbmanager/HeroAccount/HeroAccountManager.js

"use strict";

/*
    玩家账号数据管理器
*/
var app = require('app');

var HeroAccountManager = app.BaseClass.extend({

    Init: function Init() {
        this.JS_Name = "HeroAccountManager";

        this.NetManager = app.NetManager();
        this.LocalDataManager = app.LocalDataManager();
        this.ShareDefine = app.ShareDefine();
        this.SysNotifyManager = app.SysNotifyManager();
        this.SysDataManager = app.SysDataManager();

        this.NetManager.RegHttpNetPack(0x0000, this.OnHttpPack_AccountLogin, this);
        this.NetManager.RegHttpNetPack(0x0005, this.OnHttpPack_RegAccountResult, this);
        this.NetManager.RegHttpNetPack(0x0006, this.OnHttpPack_ChangeAccountPswResult, this);

        app.Client.RegEvent("CodeError", this.Event_CodeError, this);
        app.Client.RegEvent("ConnectFail", this.Event_ConnectFail, this);
        app.Client.RegEvent("ConnectHttpFail", this.Event_ConnectHttpFail, this);
        app.Client.RegEvent("ConnectSuccess", this.Event_ConnectSuccess, this);
        console.log("大厅注册事件监听");

        //密码正则表达式(长度5~11之间,只能包含字符,数字和下划线)
        this.PswReg = /^(\w){5,11}$/;
        //账号正则表达式(字符开头,长度5~16之间,只能包含字符,数字和下划线)
        this.AccountReg = /^[a-zA-Z]\w{4,15}$/;

        //账号首字符正则表达式(首字符字母)
        this.AccountFirstStrReg = /^[a-zA-z]/;

        this.OnReload();

        //本地缓存账号密码字典 {account:psw}
        this.localAccountDict = {};
        //登陆账号顺序列表 晚登陆的在后面
        this.logInAccountList = [];

        this.InitLocalAccount();
        this.lastChangeTime = 0;
        this.Log("Init");
    },

    //切换账号
    OnReload: function OnReload() {
        this.SysLog("OnReload");
        this.IsDoLogining(false);
        this.dataInfo = {};
    },

    Event_CodeError: function Event_CodeError(event) {
        var codeInfo = event;
        //如果是授权失败,过期了,重新授权
        if (codeInfo["Code"] == this.ShareDefine.KickOut_AccountAuthorizationFail) {
            var accountType = app.Client.GetClientConfigProperty("AccountType");
            if (accountType == this.ShareDefine.SDKType_WeChat) {
                //微信浏览器登录情况
                var gameLoadUrl = app.Client.GetClientConfigProperty("GameLoadUrl");
                window.location.href = gameLoadUrl;
            }
            this.LocalDataManager.SetConfigProperty("Account", "AccessTokenInfo", {});

            this.SysLog("Event_CodeError uilogin01 is show:%d", app.FormManager().IsFormShow("UILogin01"));
            if (app.FormManager().IsFormShow("UILogin01") == false) {
                app.FormManager().IsFormShow("UILogin01");
            }
        }
        if (codeInfo["Code"] == this.ShareDefine.KickOut_MobileAuthorizationFail) {
            this.LocalDataManager.SetConfigProperty("Account", "AccountMobile", {});
            app.SysNotifyManager().ShowSysMsg("短信验证已过期或出错", [], 3);
            if (app.FormManager().IsFormShow("UILogin01") == false) {
                app.FormManager().IsFormShow("UILogin01");
            }
        }
        //密码错误等异常,需要清除登录标示
        this.IsDoLogining(false);
    },
    //连接服务器失败
    Event_ConnectFail: function Event_ConnectFail(event) {
        console.log("大厅连接服务器失败");
        this.IsDoLogining(false);
        this.UpdateAccessPoint();
    },

    Event_ConnectHttpFail: function Event_ConnectHttpFail(event) {
        this.IsDoLogining(false);
        this.UpdateAccessPoint();
    },
    UpdateAccessPoint: function UpdateAccessPoint() {
        var now = new Date().getTime();
        if (now - this.lastChangeTime < 5000) {
            return;
        }
        this.lastChangeTime = now;
        this.ChangeAccessPoint();
        app.NetManager().InitServerAddress();
    },
    ChangeAccessPoint: function ChangeAccessPoint() {
        if (!cc.sys.isNative) {
            return; //浏览器不用切换节点
        }
        var AccessPoint = app.LocalDataManager().GetConfigProperty("Account", "AccessPoint");
        if (AccessPoint == 0) {
            app.LocalDataManager().SetConfigProperty("Account", "AccessPoint", 1);
        } else if (AccessPoint == 1) {
            app.LocalDataManager().SetConfigProperty("Account", "AccessPoint", 2);
        } else if (AccessPoint == 2) {
            app.LocalDataManager().SetConfigProperty("Account", "AccessPoint", 3);
        } else if (AccessPoint == 3) {
            app.LocalDataManager().SetConfigProperty("Account", "AccessPoint", 0);
        }
    },
    //---------------------本地账号逻辑-----------------

    //解析本地缓存账号记录
    InitLocalAccount: function InitLocalAccount() {
        var accountDict = this.LocalDataManager.GetConfigProperty("Account", "AccountDict");
        var accountList = this.LocalDataManager.GetConfigProperty("Account", "AccountList");

        this.logInAccountList = accountList;

        for (var charAccount in accountDict) {
            if (this.logInAccountList.InArray(charAccount, true)) {
                this.localAccountDict[charAccount] = accountDict[charAccount];
            } else {
                this.ErrLog("InitLocalAccount logInAccountList not find :%s", charAccount);
            }
        }
    },

    /**
     * 增加本地缓存账号
     * @param account
     * @param psw
     */
    AddNewAccountList: function AddNewAccountList(account, token) {

        if (this.logInAccountList.InArray(account)) {
            this.logInAccountList.Remove(account);
            this.logInAccountList.push(account);
        } else {
            this.logInAccountList.push(account);
        }

        this.localAccountDict[account] = token;

        this.SavePlayerAccount();
    },

    /**
     * 删除本地账号
     * @param account
     */
    DeleteLocalAccount: function DeleteLocalAccount(account) {

        if (this.logInAccountList.InArray(account)) {
            this.logInAccountList.Remove(account);
        }
        delete this.localAccountDict[account];

        this.SavePlayerAccount();
    },

    /**
     * 清除本地所有账号
     * @param account
     */
    DeleteAllLocalAccount: function DeleteAllLocalAccount() {
        this.localAccountDict = {};
        this.logInAccountList = [];
        this.SavePlayerAccount();
    },

    /**
     * 保存账号数据
     */
    SavePlayerAccount: function SavePlayerAccount() {
        this.LocalDataManager.SetConfigProperty("Account", "AccountDict", this.localAccountDict);
        this.LocalDataManager.SetConfigProperty("Account", "AccountList", this.logInAccountList);
    },

    /**
     * 获取账号密码
     * @param account
     */
    GetAccountToken: function GetAccountToken(account) {
        if (!this.localAccountDict.hasOwnProperty(account)) {
            this.Log("GetAccountToken not find:%s", account);
            return "";
        }
        return this.localAccountDict[account];
    },

    /**
     * 获取缓存账号列表
     */
    GetLocalAccountList: function GetLocalAccountList() {
        return this.logInAccountList;
    },

    GetAccountProperty: function GetAccountProperty(property) {
        if (!this.dataInfo.hasOwnProperty(property)) {
            this.ErrLog("GetAccountProperty not find:%s", property);
            return;
        }
        return this.dataInfo[property];
    },

    SetAccountProperty: function SetAccountProperty(property, value) {
        console.log("SetAccountProperty property:" + property + ",value:" + value);
        this.dataInfo[property] = value;
    },

    //获取账号属性
    GetAccountInfo: function GetAccountInfo() {
        return this.dataInfo;
    },

    /**
     * 检测账号是否合法
     */
    CheckCanUseAccount: function CheckCanUseAccount(account) {
        return this.AccountReg.test(account);
    },

    /**
     * 检测密码合法
     * @param psw
     */
    CheckCanUsePassWord: function CheckCanUsePassWord(psw) {
        return this.PswReg.test(psw);
    },

    CheckAccountFirstStr: function CheckAccountFirstStr(account) {
        return this.AccountFirstStrReg.test(account);
    },

    //---------------------事件回掉函数-----------------

    //连接服务器成功
    Event_ConnectSuccess: function Event_ConnectSuccess(event) {
        console.log("连接服务器成功");
        app.NetWork().isReconnecting = false;
        app.NetWork().isConnectIng = true;
        if (!this.dataInfo["AccountID"]) {
            this.ErrLog("Event_ConnectSuccess not dataInfo");
            this.IsDoLogining(false);
            //本地开发项目跳过登录，请求一个游客账号
            if (!cc.sys.isNative) {
                //                this.NetManager.SendPack("base.C1111RoleReLogin", {"accountID":0, "uuid":0, "gameName":"hall"});
            } else {
                var accountID = this.LocalDataManager.GetConfigProperty("Account", "AccountID");
                var uuid = this.LocalDataManager.GetConfigProperty("Account", "uuid");
                console.log("base.C1111RoleReLogin uuid:" + uuid);
                // let isSendSuccess = false;
                this.NetManager.SendPack("base.C1111RoleReLogin", { "accountID": accountID, "uuid": uuid, "gameName": "hall" }, function (event) {
                    // isSendSuccess = true;
                }, function (event) {
                    // isSendSuccess = true;
                });
                this.dataInfo["AccountID"] = accountID;
                // //如果2秒后还是在reload场景，则说明没发送成功再发送一遍
                // let self = this;
                // this.scheduleOnce(function(){
                //     if (!isSendSuccess) {
                //         console.log("发送C1111RoleReLogin失败，重新发送");
                //         self.NetManager.SendPack("base.C1111RoleReLogin", {"accountID":accountID, "uuid":uuid, "gameName":"hall"});
                //     }else{
                //         console.log("发送C1111RoleReLogin成功");
                //     }
                // },2);
            }
            return;
        }
        //如果是重连
        // if(app.HeroManager().GetHeroID()){
        //     let accountID = this.dataInfo["AccountID"];
        //     let version = "1.0.1";
        //     let reloginSign = this.dataInfo["reloginSign"];
        //     let signString = "accountID=" + accountID.toString() + "&version=" + version + "&" + reloginSign.toString();
        //     let sign = app.MD5.hex_md5(signString);
        //     this.NetManager.SendReConnect("base.C1008Login", {"accountID":accountID, "version":version, "sign":sign});
        // }
        var serverID = app.Client.GetClientConfigProperty("ServerID");
        var isMobile = 0;
        if (this.dataInfo["isMobile"] == 1) {
            isMobile = 1;
        } else {
            this.dataInfo["isMobile"] = 0;
        }
        var sendPack = {
            "accountID": this.dataInfo["AccountID"],
            "openid": this.dataInfo["Openid"],
            "unionid": this.dataInfo["Unionid"],
            "token": this.dataInfo["Token"],
            "nickName": this.dataInfo["NickName"],
            "sex": this.dataInfo["Sex"],
            "headImageUrl": this.dataInfo["HeadImageUrl"],
            "isMobile": isMobile,
            "serverID": serverID,
            "version": this.ShareDefine.ClientVersion
        };

        //如果是重连
        if (app.HeroManager().GetHeroID()) {
            // this.SysLog("C1004Login 1:",JSON.stringify(sendPack));
            // this.NetManager.SendReConnect("base.C1004Login", sendPack);
            var _accountID = this.dataInfo["AccountID"];
            // let uuid = this.LocalDataManager.GetConfigProperty("Account", "uuid");
            var version = "1.0.1";
            var reloginSign = this.dataInfo["reloginSign"];
            // console.log("reloginSign ==== " + reloginSign);
            if (typeof _accountID == "undefined") {
                console.log("未取到accountID...");
                app.Client.LoadLogin();
                return;
            }
            if (typeof reloginSign == "undefined") {
                console.log("未取到reloginSign...");
                app.Client.LoadLogin();
                return;
            }
            var signString = "accountID=" + _accountID.toString() + "&version=" + version + "&" + reloginSign.toString();
            console.log("signString === " + signString);
            var sign = app.MD5.hex_md5(signString);
            this.NetManager.SendReConnect("base.C1008Login", { "accountID": _accountID, "version": version, "sign": sign });
        } else {
            //登录过程完成
            this.IsDoLogining(false);
            //发送登陆token到connector
            this.SysLog("C1004Login 2:", JSON.stringify(sendPack));
            console.log("登录过程完成:", JSON.stringify(sendPack));
            this.NetManager.SendPack("base.C1004Login", sendPack);
        }
    },

    //注册账号结果
    OnHttpPack_RegAccountResult: function OnHttpPack_RegAccountResult(serverPack) {
        var result = serverPack.Result;
        if (result == 1) {
            this.SysNotifyManager.ShowSysMsg("Account_RegAccountFind");
        }
        this.IsDoLogining(false);
    },

    //修改密码结果
    OnHttpPack_ChangeAccountPswResult: function OnHttpPack_ChangeAccountPswResult(serverPack) {
        this.dataInfo["CharAccountPsw"] = serverPack.Psw;

        this.SysNotifyManager.ShowSysMsg("Account_ChangeAccountPswSuccess");
    },

    //账号服务器登录账号回复
    OnHttpPack_AccountLogin: function OnHttpPack_AccountLogin(serverPack) {
        this.SysLog("OnHttpPack_AccountLogin serverPack:%s", JSON.stringify(serverPack));
        this.dataInfo = serverPack;

        //每次登陆都覆盖缓存的sdkToken(客户端只记录一个玩家登陆token)
        var sdkToken = this.dataInfo["SDKToken"];
        var accountType = this.dataInfo["AccountType"];
        var accountID = this.dataInfo["AccountID"];

        var accessTokenInfo = {};
        //如果是微信APP,sdk授权登录
        if (sdkToken && accountType == this.ShareDefine.SDKType_WeChatApp) {
            accessTokenInfo = {
                "SDKToken": sdkToken,
                "AccountType": accountType,
                "AccountID": accountID
            };
        }
        if (sdkToken && accountType == this.ShareDefine.SDKType_LineApp) {
            accessTokenInfo = {
                "SDKToken": sdkToken,
                "AccountType": accountType,
                "AccountID": accountID,
                "headImgUrl": this.dataInfo["HeadImageUrl"],
                "nickName": this.dataInfo["NickName"],
                "userId": this.dataInfo["Unionid"],
                "accessToken": this.dataInfo["SDKToken"]
            };
        }
        if (sdkToken && accountType == this.ShareDefine.SDKType_FacebookApp) {
            accessTokenInfo = {
                "SDKToken": sdkToken,
                "AccountType": accountType,
                "AccountID": accountID,
                "headImgUrl": this.dataInfo["HeadImageUrl"],
                "nickName": this.dataInfo["NickName"],
                "userId": this.dataInfo["Unionid"],
                "accessToken": this.dataInfo["SDKToken"]
            };
        }
        this.ErrLog("OnHttpPack_AccountLogin sdkToken:%s, accessTokenInfo:%s", sdkToken, JSON.stringify(accessTokenInfo));
        this.LocalDataManager.SetConfigProperty("Account", "AccessTokenInfo", accessTokenInfo);
        this.LocalDataManager.SetConfigProperty("Account", "AccountID", accountID);

        //如果是公司内部账号,需要保存账号记录
        if (accountType == this.ShareDefine.SDKType_Company) {
            this.AddNewAccountList(this.dataInfo["CharAccount"], this.dataInfo["Token"]);
        }

        this.NetManager.InitConnectServer();
    },

    //----------------------操作函数--------------------

    //账号密码连接
    AccountLogin: function AccountLogin(charAccount, psw, isToken) {

        if (this.isDoLogin) {
            this.ErrLog("AccountLogin(%s,%s) is doing login", charAccount, psw);
            return;
        }
        this.IsDoLogining(true);

        var sendPack = this.NetManager.GetHttpSendPack(0xFF03);
        sendPack.CharAccount = charAccount;
        sendPack.CharAccountPsw = psw;
        sendPack.IsToken = isToken;
        this.NetManager.SendHttpPack(sendPack);
    },

    //一键注册账号密码
    OneKeyRegAccount: function OneKeyRegAccount() {

        if (this.isDoLogin) {
            this.ErrLog("OneKeyRegAccount is doing login");
            return;
        }
        this.IsDoLogining(true);

        var sendPack = this.NetManager.GetHttpSendPack(0xFF00);
        this.NetManager.SendHttpPack(sendPack);
    },

    SendRegAccount: function SendRegAccount(charAccount, accountPsw) {
        if (this.isDoLogin) {
            this.ErrLog("SendRegAccount is doing login");
            return;
        }
        this.IsDoLogining(true);

        var sendPack = this.NetManager.GetHttpSendPack(0xFF07);
        sendPack.CharAccount = charAccount;
        sendPack.Psw = accountPsw;
        this.NetManager.SendHttpPack(sendPack);
    },

    SendChangeAccountPsw: function SendChangeAccountPsw(accountID, oldPsw, newPsw) {
        var sendPack = this.NetManager.GetHttpSendPack(0xFF08);
        sendPack.AccountID = accountID;
        sendPack.OldPsw = oldPsw;
        sendPack.NewPsw = newPsw;
        this.NetManager.SendHttpPack(sendPack);
    },

    //sdk授权登录
    //sdkType:sdk类型
    //token:授权code
    //mpID:使用到的对应第3方标示(公众号)
    LoginAccountBySDK: function LoginAccountBySDK(sdkType, token, mpID, sdkAccountID) {
        console.log("LoginAccountBySDK");
        if (this.isDoLogin) {
            this.ErrLog("LoginAccountBySDK is doing (%s,%s) login", sdkType, token);
            this.IsDoLogining(false);
            var that = this;
            setTimeout(function () {
                console.log("LoginAccountBySDK 0123456");
                that.IsDoLogining(false);
            }, 50);
            return;
        }
        this.IsDoLogining(true);

        console.log("LoginAccountBySDK sdkType: ", sdkType);
        console.log("LoginAccountBySDK token: ", token);
        console.log("LoginAccountBySDK mpID: ", mpID);
        console.log("LoginAccountBySDK sdkAccountID: ", sdkAccountID);

        if (!sdkAccountID) {
            sdkAccountID = 0;
        }
        var sendPack = this.NetManager.GetHttpSendPack(0xFF02);
        sendPack.SDKType = sdkType;
        sendPack.Token = token;
        sendPack.UserData = mpID;
        sendPack.SDKAccountID = sdkAccountID;

        // sendPack.SDKType = 6;
        // sendPack.Token = "EAAK56cTRIkcBABIKc0bdwd2CgyrA0Bi9kUDiSr3jMpZAIVJrfm9AJCB014ArHdWRwIZCa32maKfZAQFj2kvZAvV3pdZCyJ8pcQVmG3Qwor78nVrnqEeZBbruKWmZCbr8ZBqlW1yUdjSoTWGhkVZC8rWZCZAyJK5IBXP54i8OXdd4xk59OGOUWsg4w5hL9lTowxCOSbHnPILMvTphZBXWKQ9lNsaq6M51oqVCYvoKYBiR0P0HI4fV88WJsZAcS";
        // sendPack.UserData = {
        //     "headImgUrl": "https://scontent-nrt1-1.xx.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=1-3&_nc_sid=12b3be&_nc_ohc=4sHVVQlGkU0AX-pVZXF&_nc_ht=scontent-nrt1-1.xx&tp=27&oh=3f7fe0619f9d1e1bc88852fd8e9b805b&oe=60DD4438",
        //     "userId": "123926876510672",
        //     "nickName": "Jun Huang",
        // };
        // sendPack.SDKAccountID = sdkAccountID;

        this.NetManager.SendHttpPack(sendPack);
    },
    LoginAccountByMobile: function LoginAccountByMobile(mobile, token, sdkAccountID) {
        console.log("LoginAccountByMobile");
        if (this.isDoLogin) {
            this.IsDoLogining(false);
            var that = this;
            setTimeout(function () {
                that.IsDoLogining(false);
            }, 50);
            return;
        }
        this.IsDoLogining(true);
        if (!sdkAccountID) {
            sdkAccountID = 0;
        }
        var sendPack = this.NetManager.GetHttpSendPack(0xFF02);
        sendPack.SDKType = 4;
        sendPack.Token = token;
        sendPack.UserData = mobile;
        sendPack.SDKAccountID = sdkAccountID;
        this.NetManager.SendHttpPack(sendPack);
    },

    //设置是否是在登录
    IsDoLogining: function IsDoLogining(state) {
        this.SysLog("IsDoLogining state:%s", state);
        this.isDoLogin = state;
        if (state) {
            app.Client.OnEvent("ChangeBtnState", { "state": 1 });
        } else {
            app.Client.OnEvent("ChangeBtnState", { "state": 0 });
        }
    }
});

var g_HeroAccountManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
    if (!g_HeroAccountManager) {
        g_HeroAccountManager = new HeroAccountManager();
    }
    return g_HeroAccountManager;
};

cc._RF.pop();