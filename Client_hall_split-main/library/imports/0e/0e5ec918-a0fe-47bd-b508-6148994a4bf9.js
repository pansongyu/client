"use strict";
cc._RF.push(module, '0e5eckYoP5HvbUIYUiZSkv5', 'UILogin01');
// script/ui/UILogin01.js

"use strict";

/*
    UILogin01 登陆界面
*/
var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        btnLogin: cc.Button,
        btnLoginxl: cc.Button,
        toggle_agrgee: cc.Toggle,
        btn_userAgree: cc.Button,
        btnMobile: cc.Button,
        mobile: cc.Node,
        logo: cc.Node,
        logoSprite: [cc.SpriteFrame]
    },

    OnCreateInit: function OnCreateInit() {
        this.NetManager = app.NetManager();
        this.NetWork = app.NetWork();
        this.SDKManager = app.SDKManager();
        this.LocalDataManager = app.LocalDataManager();
        this.RegEvent("CodeError", this.Event_CodeError);
        this.RegEvent("DoLogin", this.Event_DoLogin);
        this.RegEvent("ConnectFail", this.Event_ConnectFail);
        this.RegEvent("ChangeBtnState", this.Event_ChangeBtnState);
        this.NetManager = app.NetManager();
        var httpPath = app.Client.GetClientConfigProperty("WebSiteUrl");
        if (httpPath[httpPath.length - 1] == "/") {
            httpPath = httpPath.substring(0, httpPath.length - 1);
        }
        httpPath = httpPath + "/index.php?module=Api&action=Config";
        app.NetRequest().SendHttpRequestGet(httpPath, "", {}, 15000, function (serverUrl, responseText, httpRequest) {
            var data = JSON.parse(responseText);
            app.Config = data.data;
        });
    },
    //登录错误码
    Event_CodeError: function Event_CodeError(event) {
        var argDict = event;
        var code = argDict["Code"];
        if (code == this.ShareDefine.KickOut_ServerClose) {
            this.WaitForConfirm("Code_10016", [], [], this.ShareDefine.ConfirmYN);
        } else if (code == 5122) {
            //没有绑定闲聊登录，调用微信登录
            app.SysNotifyManager().ShowSysMsg("该账号未绑定闲聊", [], 3);
            this.SDKManager.LoginBySDK();
        } else if (code == 5123) {
            // app.SysNotifyManager().ShowSysMsg("闲聊登录失败",[],3);
        } else if (code = 5124) {//存在闲聊
            // app.SysNotifyManager().ShowSysMsg("闲聊登录失败",[],3);
        }
    },

    //连接服务器失败
    Event_ConnectFail: function Event_ConnectFail(event) {
        this.UpdateAccessPoint();
        // let argDict = event;
        // if(!argDict['bCloseByLogout'])
        // this.ShowSysMsg("Net_ConnectFail");
        app.Client.OnEvent("ChangeBtnState", { "state": 0 });
        //关闭模态层
        app.Client.OnEvent("ModalLayer", "ReceiveNet");
    },

    //设置登录按钮的可点击状态
    Event_ChangeBtnState: function Event_ChangeBtnState(event) {
        var BtnState = event["state"];
        this.SysLog("Event_ChangeBtnState BtnState:%s", BtnState);
        if (BtnState == 1) {
            this.btnLogin.interactable = 0;
            this.btnLogin.enableAutoGrayEffect = 1;
            this.btnLoginxl.interactable = 0;
            this.btnLoginxl.enableAutoGrayEffect = 1;
        } else {
            this.btnLogin.interactable = 1;
            this.btnLogin.enableAutoGrayEffect = 0;
            this.btnLoginxl.interactable = 1;
            this.btnLoginxl.enableAutoGrayEffect = 0;
            //关闭模态层
            app.Client.OnEvent("ModalLayer", "ReceiveNet");
        }
    },
    OnShow: function OnShow() {
        this.ChangeLogo();
        this.ShowWeiXinLogin();
        this.ShowLoginWayBtn();
        this.toggle_agrgee.isChecked = true;
    },
    ShowWeiXinLogin: function ShowWeiXinLogin() {
        this.mobile.active = false;
        this.btnLogin.node.active = true;
        // this.btnMobile.node.active=true;
    },

    ShowLoginWayBtn: function ShowLoginWayBtn() {
        // let isAndroid = app.ComTool().IsAndroid();
        // if(isAndroid) {
        var appName = cc.sys.localStorage.getItem('appName');
        var isShowLineLoginBtn = appName == "baodao";

        this.node.getChildByName("btn_login").active = !isShowLineLoginBtn;
        this.node.getChildByName("btn_login_line").active = isShowLineLoginBtn;
        // } else {
        //     this.node.getChildByName("btn_login").active = true;
        //     this.node.getChildByName("btn_login_line").active = false;
        // }
    },

    WeiXinLogin: function WeiXinLogin() {
        app.Client.OnEvent("ChangeBtnState", { "state": 1 });
        this.SDKManager.LoginBySDK();
        var OnTimer = function OnTimer(passSecond) {
            app.HeroAccountManager().IsDoLogining(false);
        };
        this.scheduleOnce(OnTimer, 5.0);
    },
    //初始化连接
    InitConnectServer: function InitConnectServer() {
        //初始化连接服务器
        if (this.NetWork.Connected() == false) {
            app.Client.OnEvent("ModalLayer", "OpenNet");
            var clientConfig = app.Client.GetClientConfig();
            this.gameServerIP = clientConfig["GameServerIP"];
            this.gameServerPort = clientConfig["GameServerPort"];
            var CheckUrl = "http://" + this.gameServerIP + ":88/myip.php";
            this.SendHttpRequest(CheckUrl, "", "GET", {});
        }
    },
    SendHttpRequest: function SendHttpRequest(serverUrl, argString, requestType, sendPack) {
        if (app.ControlManager().IsOpenVpn()) {
            return;
        }
        // app.NetRequest().SendHttpRequest(serverUrl, argString, requestType, sendPack, 3000, 
        //     (serverUrl, responseText)=>{ // success
        //         app.Client.OnEvent("ModalLayer", "ReceiveNet");
        //         that.OnReceiveHttpPack(serverUrl, responseText);
        //     }, 
        //     (serverUrl, readyState, status)=>{ // fail

        //     },
        //     (serverUrl, readyState, status)=>{ // timeout
        //         app.Client.OnEvent("ModalLayer", "ReceiveNet");
        //         app.HeroAccountManager().UpdateAccessPoint();
        //     }, 
        //     (serverUrl, readyState, status)=>{ // error
        //         app.Client.OnEvent("ModalLayer", "ReceiveNet");
        //         app.HeroAccountManager().UpdateAccessPoint();
        //     }
        // );

        var url = [serverUrl, argString].join("");
        var dataStr = JSON.stringify(sendPack);
        //每次都实例化一个，否则会引起请求结束，实例被释放了
        var timeOut = false;
        var httpRequest = new XMLHttpRequest();
        httpRequest.timeout = 3000;
        httpRequest.open(requestType, url, true);
        //服务器json解码
        //httpRequest.setRequestHeader("Content-Type", "application/json");
        var that = this;
        httpRequest.onerror = function () {
            that.ErrLog("httpRequest.error:%s", url);
            app.Client.OnEvent("ModalLayer", "ReceiveNet");
            app.HeroAccountManager().UpdateAccessPoint();
            //that.InitConnectServer();
        };
        httpRequest.ontimeout = function () {
            timeOut = true;
            app.Client.OnEvent("ModalLayer", "ReceiveNet");
            app.HeroAccountManager().UpdateAccessPoint();
            //that.InitConnectServer();
        };
        httpRequest.onreadystatechange = function () {
            //执行成功
            // that.ErrLog("httpRequest.status:%s", httpRequest.status);
            // that.ErrLog("httpRequest.readyState:%s", httpRequest.readyState);
            if (httpRequest.status == 200) {
                if (httpRequest.readyState == 4) {
                    app.Client.OnEvent("ModalLayer", "ReceiveNet");
                    that.OnReceiveHttpPack(serverUrl, httpRequest.responseText);
                    // if(that.NetWork.Connected()==false){
                    // 	console.log("服务器还没连接...");
                    // 	that.NetWork.InitWebSocket(that.gameServerIP, that.gameServerPort, that.OnWebSocketEvent.bind(that), that.OnConnectSuccess.bind(that));
                    // }else{
                    // 	console.log("服务器已经连接成功...");
                    // }
                }
            }
        };
        httpRequest.send(dataStr);
    },
    onclickTemp: function onclickTemp() {
        if (app.Config && app.Config.visitor) {
            this.FormManager.ShowForm("UILogin03");
            this.CloseForm();
        }
    },
    //服务器连接成功
    OnConnectSuccess: function OnConnectSuccess(isReconnecting) {
        //关闭模态层
        app.Client.OnEvent("ModalLayer", "ReceiveNet");
        // app.Client.OnEvent("ConnectSuccess", {"ServerName":"GameServer", "IsReconnecting":isReconnecting});
        //闲聊登录
        var XlOpenID = this.LocalDataManager.GetConfigProperty("Account", "XlOpenID");
        if (XlOpenID) {
            app.XLAppManager().SendLoginByXLAuthorization(XlOpenID);
        } else {
            //尝试微信登录
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
                app.WeChatAppManager().SendLoginByWeChatAuthorization(sdkToken, sdkAccountID);
            }
        }
    },
    OnReceiveHttpPack: function OnReceiveHttpPack(serverUrl, httpResText) {
        try {
            var serverPack = JSON.parse(httpResText);
            if (serverPack["code"] == 0) {
                if (this.yanzhengUrl == serverUrl) {
                    var btn_yzm = this.mobile.getChildByName('btn_yzm');
                    btn_yzm.active = false;
                    this.lb_times = 60;
                    this.schedule(this.ShowYanZhengMaTime, 1);
                    this.scheduleOnce(function () {
                        btn_yzm.active = true;
                        this.lb_times = 0;
                    }, 60);
                } else if (this.checkCodeUrl == serverUrl) {
                    //let that=this;
                    //this.SDKManager.LoginByMobile(this.phoneNo,this.phoneNo);
                    /*//提交手机号码给服务端
                    this.NetManager.SendPack("game.CPlayerPhone",{"phone":this.phoneNo},function(success){
                        that.HideNode('phone');
                    },function(error){
                        
                    });*/
                }
            } else {
                this.ShowSysMsg(serverPack.msg);
            }
        } catch (error) {}
    },
    OnConnectHttpFail: function OnConnectHttpFail(serverUrl, readyState, status) {},
    ShowYanZhengMaTime: function ShowYanZhengMaTime() {
        var lb_time = this.mobile.getChildByName('lb_yzm').getComponent(cc.Label);
        this.lb_times = this.lb_times - 1;
        if (this.lb_times <= 0) {
            this.unschedule(this.ShowYanZhengMaTime);
            lb_time.string = "";
            return;
        }
        lb_time.string = this.lb_times + "秒后可再发送";
    },
    Event_DoLogin: function Event_DoLogin() {
        this.WeiXinLogin();
    },
    btn_login_duanxin: function btn_login_duanxin() {
        var phone = this.mobile.getChildByName('edit_phone').getComponent(cc.EditBox).string;
        if (!phone) {
            this.ShowSysMsg('请填写手机号码');
            return;
        }
        var checkPhone = this.checkPhone(phone);
        if (checkPhone == false) {
            this.ShowSysMsg('电话号码有误');
            return;
        }
        var code = this.mobile.getChildByName('edit_yzm').getComponent(cc.EditBox).string;
        if (!code) {
            this.ShowSysMsg('请填写验证码');
            return;
        }
        this.SDKManager.LoginByMobile(phone, code);
        //本地缓存一下
        this.LocalDataManager.SetConfigProperty("Account", "AccountMobile", { "SDKToken": code, "mobile": phone });
    },
    //websocket事件回掉
    OnWebSocketEvent: function OnWebSocketEvent(eventName, arg) {
        app.Client.OnEvent("ModalLayer", "ReceiveNet");
        this.NetManager.OnWebSocketEvent(eventName, arg);
    },
    //---------点击函数---------------------

    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_login") {
            if (!this.toggle_agrgee.isChecked) {
                this.ShowSysMsg("MSG_NOT_USER_AGREE");
                return;
            }
            this.WeiXinLogin();
        } else if (btnName == "btn_login_line") {
            if (!cc.sys.isNative) {
                return;
            }
            if (!this.toggle_agrgee.isChecked) {
                this.ShowSysMsg("MSG_NOT_USER_AGREE");
                return;
            }
            app.Client.OnEvent("ChangeBtnState", { "state": 1 });
            this.SDKManager.LoginByLineSDK();
            var OnTimer = function OnTimer(passSecond) {
                //app.Client.OnEvent("ChangeBtnState", {"state":0});
                app.HeroAccountManager().IsDoLogining(false);
            };
            this.scheduleOnce(OnTimer, 5.0);
        } else if (btnName == "btn_login_facebook") {
            if (!cc.sys.isNative) {
                return;
            }
            if (!this.toggle_agrgee.isChecked) {
                this.ShowSysMsg("MSG_NOT_USER_AGREE");
                return;
            }
            app.Client.OnEvent("ChangeBtnState", { "state": 1 });
            this.SDKManager.LoginByFacebookSDK();
            var OnTimer = function OnTimer(passSecond) {
                //app.Client.OnEvent("ChangeBtnState", {"state":0});
                app.HeroAccountManager().IsDoLogining(false);
            };
            this.scheduleOnce(OnTimer, 5.0);
        } else if (btnName == "btn_login_xl") {
            if (!cc.sys.isNative) {
                // let code="770b90b81d6fadc19a60ba2a8907805e";
                // let dataDict=[];
                // dataDict['ErrCode']=0;
                // dataDict['Code']=code;
                // app.XLAppManager().OnNativeNotifyXLLogin(dataDict);

                return;
            }
            if (!this.toggle_agrgee.isChecked) {
                this.ShowSysMsg("MSG_NOT_USER_AGREE");
                return;
            }
            app.Client.OnEvent("ChangeBtnState", { "state": 1 });
            this.SDKManager.LoginByXLSDK();
            var OnTimer = function OnTimer(passSecond) {
                //app.Client.OnEvent("ChangeBtnState", {"state":0});
                app.HeroAccountManager().IsDoLogining(false);
            };
            this.scheduleOnce(OnTimer, 5.0);
        } else if (btnName == "btn_mobile") {
            this.btnLogin.node.active = false;
            this.btnMobile.node.active = false;
            this.mobile.active = true;
            var accessTokenInfo = this.LocalDataManager.GetConfigProperty("Account", "AccountMobile");
            if (accessTokenInfo) {
                var sdkToken = accessTokenInfo["SDKToken"];
                var mobile = accessTokenInfo["mobile"];
                //let sdkAccountID = accessTokenInfo["AccountID"];
                this.SDKManager.LoginByMobile(mobile, sdkToken);
            }
        } else if (btnName == "btn_back") {
            //this.NetManager.Disconnect();
            this.btnLogin.node.active = true;
            this.btnMobile.node.active = true;
            this.mobile.active = false;
        } else if (btnName == "btn_yzm") {
            this.click_btn_yzm();
        } else if (btnName == "btn_login_duanxin") {
            this.btn_login_duanxin();
        } else if (btnName == 'btn_user_agree') {
            this.FormManager.ShowForm("UIFuWuTiaoKuan");
        } else if ('btn_facebookShareLink' == btnName) {
            // 调试分享
            var title = app.Client.GetClientConfigProperty("WeChatShareTitle");
            var desc = app.Client.GetClientConfigProperty("WeChatShareDesc");
            var weChatAppShareUrl = app.Client.GetClientConfigProperty("WeChatAppShareUrl");
            console.log("Click_btn_facebook: cfg weChatAppShareUrl: ", weChatAppShareUrl);
            var heroID = app.HeroManager().GetHeroProperty("pid");
            console.log("Click_btn_facebook: heroID: ", heroID);
            var cityId = app.HeroManager().GetHeroProperty("cityId");
            weChatAppShareUrl = weChatAppShareUrl + heroID + "&cityid=" + cityId;
            console.log("Click_btn_facebook:", title);
            console.log("Click_btn_facebook:", desc);
            console.log("Click_btn_facebook:", weChatAppShareUrl);

            this.SDKManager.ShareFacebookLink(title, desc, weChatAppShareUrl);
        } else if ('btn_facebookShareImage' == btnName) {
            // 调试分享            
            this.SDKManager.ShareFacebookImage();
        } else {
            this.ErrLog("OnClick not find:%s", btnName);
        }
    },
    UpdateAccessPoint: function UpdateAccessPoint() {
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
    checkPhone: function checkPhone(phone) {
        if (!/^1[3456789]\d{9}$/.test(phone)) {
            //不是国内
        } else {
            return 1;
        }
        if (!/^09\d{8}$/.test(phone)) {
            //不是台湾
        } else {
            return 2;
        }
        if (!/^00886\d{9}$/.test(phone)) {
            //不是台湾
        } else {
            return 3;
        }
        return false;
    },
    click_btn_yzm: function click_btn_yzm() {
        var phone = this.mobile.getChildByName('edit_phone').getComponent(cc.EditBox).string;
        if (!phone) {
            this.ShowSysMsg('请填写手机号码');
            return;
        }
        var checkPhone = this.checkPhone(phone);
        if (checkPhone == false) {
            this.ShowSysMsg('电话号码有误');
            return;
        }
        var sms_temple = "SMS_154085055";
        if (checkPhone == 2) {
            //台湾手机
            sms_temple = "SMS_194050862";
            //00886
            phone = "00886" + phone.substr(1);
        }
        if (checkPhone == 3) {
            //台湾手机
            sms_temple = "SMS_194050862";
        }
        this.yanzhengUrl = "http://code.qicaiqh.com/SendCode";
        var SendPack = {

            "mobile": phone,
            "sms_temple": sms_temple
        };
        this.SendHttpRequest(this.yanzhengUrl, "?mobile=" + phone + "&sms_temple=" + sms_temple, "GET", {});
    }
});

cc._RF.pop();