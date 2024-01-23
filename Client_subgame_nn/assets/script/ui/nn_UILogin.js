/*
    UILogin 登陆界面
*/
var app = require("nn_app");

cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {},

    //初始化
    OnCreateInit:function(){
    	this.ZorderLv = 6;
    	this.EditBoxAccount = this.GetWndComponent("EditBoxAccount", cc.EditBox);
    	this.EditBoxPsw = this.GetWndComponent("EditBoxPsw", cc.EditBox);
        this.HeroAccountManager = app[app.subGameName + "_HeroAccountManager"]();
        this.ShareDefine = app[app.subGameName + "_ShareDefine"]();

	    this.RegEvent("CodeError", this.Event_CodeError);
        this.RegEvent("ConnectFail", this.Event_ConnectFail);

        this.isToken = 0;
    },

	//登录错误码
	Event_CodeError:function(event){
		let argDict = event;
		let code = argDict["Code"];
		if(code == this.ShareDefine.KickOut_AccountTokenError){
			this.EditBoxPsw.string = "";
		}
		else if(code == this.ShareDefine.KickOut_ServerClose){
			this.WaitForConfirm("Code_10016", [], [], this.ShareDefine.ConfirmYN)
		}
	},

	//连接服务器失败
	Event_ConnectFail:function(event){
        this.UpdateAccessPoint();
        let argDict = event;
		if(!argDict['bCloseByLogout'])
			this.ShowSysMsg("Net_ConnectFail");
    },

	//--------------------显示函数----------------

    OnShow:function(){

        this.ShowAccountInfo();
    },

    //显示账号信息
    ShowAccountInfo:function(){
        let accountList = this.HeroAccountManager.GetLocalAccountList();
        let count = accountList.length;

        let account = "";
        let token = "";

        if(count){
            account = accountList[count-1];
            token = this.HeroAccountManager.GetAccountToken(account);
	        this.isToken = 1;
        }

        this.EditBoxAccount.string = account;
        this.EditBoxPsw.string = token;

    },

    //---------点击函数---------------------

    OnClick:function(btnName, btnNode){

        if(btnName == "btnLogin"){
            this.Click_btnLogin();
        }
        else if(btnName == "btnReg"){
            this.Click_btnReg();
        }
        else{
            console.error("OnClick:%s not find", btnName);
        }
    },

    //点击登陆
    Click_btnLogin:function(){
        let charAccount = this.EditBoxAccount.string;
        if(!charAccount){
            this.ShowSysMsg("AccountLogin_NotInputAccount")
            return
        }
        let psw = this.EditBoxPsw.string;
        if(!psw){
            this.ShowSysMsg("AccountLogin_NotInputPsw")
            return
        }

        //如果密码等于token为token登录
        if(this.isToken){
		    psw = this.HeroAccountManager.GetAccountToken(charAccount);
        }

        //账号密码登陆
        this.HeroAccountManager.AccountLogin(charAccount, psw, this.isToken);

    },

    //点击注册
    Click_btnReg:function(){
        this.HeroAccountManager.OneKeyRegAccount();
    },

    OnEditBoxBegin:function(sender){

	    //如果点击了密码输入,则清除token标示
	    if(sender == this.EditBoxPsw){
		    this.isToken = 0;
		    sender.string = "";
	    }
    },
    UpdateAccessPoint:function(){
        app[app.subGameName + "_HeroAccountManager"]().ChangeAccessPoint();
    },
});
