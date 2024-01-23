/*
    sdk管理器
*/
var app = require("pdk_app");

var pdk_SDKManager = app.BaseClass.extend({

    Init:function(){
    	this.JS_Name = app.subGameName + "_SDKManager";

    	this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
        this.SysDataManager = app[app.subGameName + "_SysDataManager"]();
        this.HeroManager = app[app.subGameName + "_HeroManager"]();
        this.ServerTimeManager = app[app.subGameName + "_ServerTimeManager"]();
        this.NetManager = app[app.subGameName + "_NetManager"]();
        this.HeroAccountManager = app[app.subGameName + "_HeroAccountManager"]();
        this.LocalDataManager = app.LocalDataManager();
        this.WeChatManager = app[app.subGameName + "_WeChatManager"]();
		this.WeChatAppManager = app[app.subGameName + "_WeChatAppManager"]();
        this.ComTool = app[app.subGameName + "_ComTool"]();

	    this.NetManager.RegHttpNetPack(0x0008, this.OnHttpPack_PrepayOrderInfo, this);

		//this.OnReload();

    	this.Log("Init");
    },

	OnReload:function(){
		let accountSDKManager = this.GetAccountSDK();
		if(!accountSDKManager){
			this.ErrLog("OnReload not find sdk");
			return
		}
		return accountSDKManager.OnReload();
	},

	//收到预订单服务器信息
	OnHttpPack_PrepayOrderInfo:function(serverPack){
		let isSuccess = serverPack.IsSuccess;
		if(!isSuccess){
			app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("Order_PrepayOrderFail");
			return
		}

		let prepayOrderInfo = serverPack.PrepayOrderInfo;
		let orderID = serverPack.OrderID;
		let appID = prepayOrderInfo.ProductID;
		let itemType = prepayOrderInfo.ItemType;
		let orderType = prepayOrderInfo.OrderType;

		let DiamondStore = this.SysDataManager.GetTableDict("DiamondStore");
		let diamondStore = DiamondStore[appID];
		if(!diamondStore){
			this.ErrLog("Pay DiamondStore.txt not find:%s", appID);
			return
		}
		let appPrice = diamondStore["AppPrice"];

		// app.TalkingDataManager().RecordStartPay(orderID, itemType, appID, appPrice);

		if(orderType == this.ShareDefine.OrderType_Wechat){
			this.WeChatManager.ReceivePrepayOrder(serverPack);
		}
		else if(orderType == this.ShareDefine.OrderType_QRCode){
			this.WeChatManager.ReceivePrepayQRCodeOrder(serverPack);
		}
		else if(orderType == this.ShareDefine.OrderType_WechatApp){
			this.WeChatAppManager.ReceivePrepayOrder(serverPack);
		}else if(orderType == 6){
			this.WeChatAppManager.ReceivePrepayOrder(serverPack);
		}
		else{
			this.ErrLog("OnHttpPack_PrepayOrderInfo orderType:%s error", orderType);
		}
	},

	//初始化sdk参数H5启动携带参数
    InitSDKParameter:function(dataInfo){

	    let accountType = app[app.subGameName + "Client"].GetClientConfigProperty("AccountType");

    	
	    //微信登录
	    if(accountType == this.ShareDefine.SDKType_WeChat){
			this.WeChatManager.InitWeChatSDKParameter(dataInfo);
	    }
	    //官网登录
	    else if(accountType == this.ShareDefine.SDKType_Company){

	    }
	    //微信app授权
	    else if(accountType == this.ShareDefine.SDKType_WeChatApp){
	    }
	    else{
			// this.SysLog("InitSDKParameter(%s):", accountType, dataInfo);
	    }
    },

	//H5sdk
	IsH5AccountSDK:function(){

		let accountType = app[app.subGameName + "Client"].GetClientConfigProperty("AccountType");

		//如果是微信公众授权,需要判断是否是微信浏览器
		if(accountType == this.ShareDefine.SDKType_WeChat) {
			if (this.ComTool.IsWeChatBrowser()) {
				return true
			}
			else{
				return false
			}
		}

		if(this.ShareDefine.H5AccountSDKTypeList.InArray(accountType)){
			return true
		}
		return false
	},

	//appsdk
	IsAppAccountSDK:function(){
		let accountType = app[app.subGameName + "Client"].GetClientConfigProperty("AccountType");
		if(this.ShareDefine.AppAccountSDKTypeList.InArray(accountType)){
			return true
		}
		return false
	},

	GetAccountSDK:function(){
		let accountType = app[app.subGameName + "Client"].GetClientConfigProperty("AccountType");
		if(accountType == this.ShareDefine.SDKType_WeChat){
			return this.WeChatManager
		}
		else if(accountType == this.ShareDefine.SDKType_WeChatApp) {
			return this.WeChatAppManager;
		}
		else{
			this.ErrLog("accountSDKType:%s", accountType);
			return
		}
	},

	GetOrderSDK:function(){
		let orderType = app[app.subGameName + "Client"].GetClientConfigProperty("OrderType");

		if(orderType == this.ShareDefine.OrderType_Wechat){
			return this.WeChatManager;
		}
		else if(orderType == this.ShareDefine.OrderType_QRCode){
			return this.WeChatManager;
		}
		else if(orderType == this.ShareDefine.OrderType_WechatApp){
			return this.WeChatAppManager
		}
		else {
			this.ErrLog("GetOrderSDK:%s", orderType);
			return null
		}
	},

	//支付入口
    Pay:function(appID){
		if (this.CheckIsAppCheck()) {
			this.SendCreatePrePayOrder("Diamond", appID);
			return;
    	}
		let orderSdkManager = this.GetOrderSDK();
        if(!orderSdkManager){
            this.ErrLog("pay not orderSdkManager");
            return
        }

		if(!orderSdkManager.GetSDK()){
			this.ErrLog("pay not sdk");
			return
		}

		this.SendCreatePrePayOrder("Diamond", appID);

    },

	//登录授权
	LoginBySDK:function(){
		let accountSDKManager = this.GetAccountSDK();
		if(!accountSDKManager){
			this.ErrLog("LoginBySDK not find sdk");
			return
		}
		accountSDKManager.Login();
	},

	//检查登录是否是短线重登
	CheckLoginBySDK:function(){
		let accountSDKManager = this.GetAccountSDK();
		if(!accountSDKManager){
			this.ErrLog("CheckLoginBySDK not find sdk");
			return false;
		}
		return accountSDKManager.CheckLoginBySDK();
	},
	ShareText:function(title,flag){
		let accountType = app[app.subGameName + "Client"].GetClientConfigProperty("AccountType");
		if(accountType == this.ShareDefine.SDKType_WeChatApp){
			this.WeChatAppManager.ShareText(title,flag);
		}else if(accountType == this.ShareDefine.SDKType_WeChat){
			app[app.subGameName + "_FormManager"]().ShowForm("UIMessageWeiXinShare");
		}
		else{
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
	Share:function(title, description, url, flag, argDict){
		let accountType = app[app.subGameName + "Client"].GetClientConfigProperty("AccountType");
		if(accountType == this.ShareDefine.SDKType_WeChatApp){
			this.WeChatAppManager.Share(title, description, url, flag, argDict);
		}else if(accountType == this.ShareDefine.SDKType_WeChat){
			app[app.subGameName + "_FormManager"]().ShowForm("UIMessageWeiXinShare");
		}
		else{
			this.ErrLog("Share not find SDKType_WeChatApp");
		}

	},
	ShareDD:function(title,description,urlStr){
		let argList = [{"Name":"title","Value":title},{"Name":"description","Value":description},{"Name":"urlStr","Value":urlStr}];
		app[app.subGameName + "_NativeManager"]().CallToNative("OnDDWeChatShare", argList);
	},
	ShareXL:function(title,description,urlStr){
		let argList = [{"Name":"Title","Value":title},{"Name":"description","Value":description},{"Name":"urlStr","Value":urlStr},{"Name":"roomID","Value":'roomID'},{"Name":"roomToken","Value":"roomToken"}];
		app[app.subGameName + "_NativeManager"]().CallToNative("OnXLShare", argList);
	},
	ShareLineLink:function(title,description,urlStr){
		let argList = [{"Name":"Title","Value":title},{"Name":"description","Value":description},{"Name":"urlStr","Value":urlStr}];
		app[app.subGameName + "_NativeManager"]().CallToNative("OnLineShareLink", argList);
	},
	ShareLineText:function(title,description){
		let argList = [{"Name":"Title","Value":title},{"Name":"description","Value":description}];
		app[app.subGameName + "_NativeManager"]().CallToNative("OnLineShareText", argList);
	},
	//微信全屏分享
	ShareScreen:function(flag){
		let accountType = app[app.subGameName + "Client"].GetClientConfigProperty("AccountType");
		if(accountType == this.ShareDefine.SDKType_WeChatApp){
			this.WeChatAppManager.ShareScreen(flag);
		}else if(accountType == this.ShareDefine.SDKType_WeChat){
			app[app.subGameName + "_FormManager"]().ShowForm("UIMessageWeiXinShare");
		}
		else{
			this.ErrLog("Share not find SDKType_WeChatApp");
		}
	},
	ShareScreenDD:function(){
		let filePath = this.WeChatAppManager.Capture();
        if (filePath != "") {
        	this.ShareImageDD(filePath);
        }
	},
	ShareImageDD:function(imagePath){
		let argList = [{"Name":"imagePath","Value":imagePath}];
		app[app.subGameName + "_NativeManager"]().CallToNative("OnDDWeChatShareImage", argList);
	},
	ShareScreenXL:function(){
		let filePath = this.WeChatAppManager.Capture();
        if (filePath != "") {
        	this.ShareImageXL(filePath);
        }
	},
	ShareImageXL:function(imagePath){
		let argList = [{"Name":"ImagePath","Value":imagePath}];
		app[app.subGameName + "_NativeManager"]().CallToNative("OnXLShareImage", argList);
	},



	//----------------发包接口------------------------
	//发送创建预付订单申请
	SendCreatePrePayOrder:function(itemType, appID){
		let heroID = this.HeroManager.GetHeroID();
		if(!heroID){
			this.ErrLog("SendCreatePrePayOrder not heroID");
			return
		}

		let openid = this.HeroAccountManager.GetAccountProperty("Openid");
		let accountID = this.HeroManager.GetHeroProperty("accountID");
		let sendPack = this.NetManager.GetHttpSendPack(0xFF0A);

		let DiamondStore = this.SysDataManager.GetTableDict("DiamondStore");
		if(!DiamondStore.hasOwnProperty(appID)){
			this.ErrLog("SendCreatePrePayOrder DiamondStore.txt not find %s", appID);
			return
		}
		let appPrice = DiamondStore[appID]["AppPrice"] * 100;

		let gameID = app[app.subGameName + "Client"].GetClientConfigProperty("GameID");
		let mpID = app[app.subGameName + "Client"].GetClientConfigProperty("MPID");
		let orderType = app[app.subGameName + "Client"].GetClientConfigProperty("OrderType");
		let serverID = app[app.subGameName + "Client"].GetClientConfigProperty("ServerID");

		if(!mpID){
			this.ErrLog("SendCreatePrePayOrder not find MPID");
			return
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

		this.NetManager.SendHttpPack(sendPack)
	},


	//是否是苹果送检版本
	CheckIsAppCheck:function(){
		let flag = false;
		let clientConfig = app[app.subGameName + "Client"].GetClientConfig();
		//let checkVersion = app[app.subGameName + "_ComTool"]().IsIOS() ? app[app.subGameName + "_NativeManager"]().CallToNative("checkVersion", []) : false;
		let checkVersion = false;
		//let localVersion = app[app.subGameName + "_ComTool"]().IsIOS() ? app[app.subGameName + "_NativeManager"]().CallToNative("getVersion", [], "String") : "";
		let localVersion = '';
		let appPackType = false;		// this.SysLog("app.PackDefine.APPLE_CHECK:%s,clientConfig[appPackType]:%s", app.PackDefine().APPLE_CHECK , clientConfig["appPackType"]);
		// this.SysLog("checkVersion:%s, appPackType:%s， clientConfig[appPackType]:%s,", checkVersion, appPackType, clientConfig["appPackType"]);
		// this.SysLog("appCheckVersion:%s",JSON.stringify( app[app.subGameName + "Client"].GetClientConfig()));
		// this.SysLog("appCheckVersion:%s, localVersion:%s", app[app.subGameName + "Client"].GetClientConfigProperty("appCheckVersion"), localVersion);
		
		if (app[app.subGameName + "_ComTool"]().IsIOS() && appPackType &&   app[app.subGameName + "Client"].GetClientConfigProperty("appCheckVersion") == localVersion)  {
			flag = true;
		}
		return flag;
	},
});

var g_pdk_SDKManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
    if(!g_pdk_SDKManager){
        g_pdk_SDKManager = new pdk_SDKManager();
    }
    return g_pdk_SDKManager;
}