"use strict";
cc._RF.push(module, 'fjssza2a-f66e-49f7-92e0-6db533ae1fb6', 'fjssz_WeChatManager');
// script/sdk/fjssz_WeChatManager.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 WeChatManager.js 微信sdk
 */
var app = require("fjssz_app");

var sss_WeChatManager = app.BaseClass.extend({

	Init: function Init() {
		this.JS_Name = app.subGameName + "_WeChatManager";

		this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
		this.SysDataManager = app[app.subGameName + "_SysDataManager"]();
		this.HeroAccountManager = app[app.subGameName + "_HeroAccountManager"]();
		this.NetManager = app[app.subGameName + "_NetManager"]();
		this.ControlManager = app[app.subGameName + "_ControlManager"]();
		this.HeroManager = app[app.subGameName + "_HeroManager"]();
		this.SysNotifyManager = app[app.subGameName + "_SysNotifyManager"]();

		//如果存在全局sdk对象
		this.wx = window.wx;
		this.sdk = null;

		this.NetManager.RegHttpNetPack(0x0003, this.OnHttpPack_IsSubscribeWeChatMPResult, this);
		this.NetManager.RegHttpNetPack(0x0004, this.OnHttpPack_RequestWeChatSDKInitSignResult, this);
		this.NetManager.RegHttpNetPack(0x0007, this.OnHttpPack_HeadImagePathInfo, this);

		app[app.subGameName + "Client"].RegEvent("PlayerLoginOK", this.OnEvent_PlayerLoginOK, this);

		this.dataInfo = {};

		//玩家第3方头像spriteFrame缓存字典
		//{heroID:{"HeadImageUrl":"XX","SpriteFrame":null}}
		this.heroHeadSpriteFrame = {};

		//this.OnReload();

		this.Log("Init");
	},

	OnReload: function OnReload() {
		//这里不能reload，不然会导致登录不了，故直接return
		return;
		this.dataInfo["code"] = null;
	},

	//授权参数初始化
	InitWeChatSDKParameter: function InitWeChatSDKParameter(dataInfo) {
		var code = dataInfo["code"];
		//使用公众号登录授权启动没有携带code
		if (!code) {
			console.error("InitWeChatSDKParameter dataInfo not find code", dataInfo);
			return;
		}
		this.dataInfo = dataInfo;
	},

	//是否已经关注公众号
	OnHttpPack_IsSubscribeWeChatMPResult: function OnHttpPack_IsSubscribeWeChatMPResult(serverPack) {
		this.dataInfo["IsSubscribe"] = serverPack.IsSubscribe;
		app[app.subGameName + "Client"].OnEvent("IsSubscribeWeChatMPResult", serverPack);
	},

	//申请微信sdk初始化签名
	OnHttpPack_RequestWeChatSDKInitSignResult: function OnHttpPack_RequestWeChatSDKInitSignResult(serverPack) {
		console.log("OnHttpPack_RequestWeChatSDKInitSignResult :", serverPack);
		if (!this.wx) {
			console.error("OnHttpPack_RequestWeChatSDKInitSignResult not find wx");
			return;
		}
		var signature = serverPack.Signature;
		if (!signature) {
			console.error("OnHttpPack_RequestWeChatSDKInitSignResult not find Signature :", serverPack);
			return;
		}

		this.wx.config({
			"debug": false,
			"appId": serverPack.AppId,
			"timestamp": serverPack.Timestamp,
			"nonceStr": serverPack.NonceStr,
			"signature": signature,
			"jsApiList": ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone", "getNetworkType", "chooseWXPay"]
		});
		this.wx.ready(this.OnWeChatReady.bind(this));
		this.wx.error(this.OnWeChatError.bind(this));
	},

	//初始化成功
	OnWeChatReady: function OnWeChatReady() {
		console.log("XiaoFu InitWeiXinShare OnWeChatReady2");
		this.sdk = this.wx;
		var room = app[app.subGameName.toUpperCase() + "Room"]();
		var roomKey = room.GetRoomProperty("key"); //房间号
		if (roomKey) {
			this.InitRoomWeChatShare();
		} else {
			this.InitGameWeChatShare();
		}
	},

	OnWeChatError: function OnWeChatError(result) {
		console.error("OnWeChatError :", result);
		app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("CodeErrorMsg", ["公众号签名初始化失败"]);
	},

	//----------------分享接口------------------------
	InitGameWeChatShare: function InitGameWeChatShare() {
		if (!this.sdk) {
			return;
		}
		var clientConfig = app[app.subGameName + "Client"].GetClientConfig();
		this.SetWeChatShareDataInfo(clientConfig["WeChatShareTitle"], clientConfig["WeChatShareDesc"]);
	},
	BeginShare: function BeginShare(roomKey, title, desc) {
		var weChatShareImageUrl = app[app.subGameName + "Client"].GetClientConfigProperty("WeChatShareImageUrl");
		var link = "https://www.qp355.com/room" + roomKey;
		var shareInfo = {
			title: title,
			desc: desc,
			link: link,
			imgUrl: weChatShareImageUrl,
			type: "link",
			dataUrl: "",
			success: this.ShareSuccess.bind(this),
			cancel: this.ShareCancel.bind(this)
		};
		this.sdk.onMenuShareTimeline(shareInfo);
		this.sdk.onMenuShareAppMessage(shareInfo);
		this.sdk.onMenuShareQQ(shareInfo);
		this.sdk.onMenuShareWeibo(shareInfo);
		this.sdk.onMenuShareQZone(shareInfo);
	},
	//微信分享获取短域名并且启动分享
	SuccessTcnUrl: function SuccessTcnUrl(serverPack) {
		console.log("SuccessTcnUrl serverPack:", serverPack);
		if (typeof serverPack.requestUrl == "undefined") {
			return;
		}
		var jsonStr = serverPack.requestUrl;
		jsonStr = jsonStr.replace('[', '');
		jsonStr = jsonStr.replace(']', '');
		var ShareUrl = eval('(' + jsonStr + ')');
		var url_short = ShareUrl.url_short;
		var weChatShareImageUrl = app[app.subGameName + "Client"].GetClientConfigProperty("WeChatShareImageUrl");
		var shareInfo = {
			title: this.ShareTitle,
			desc: this.ShareDesc,
			link: url_short,
			imgUrl: weChatShareImageUrl,
			type: "link",
			dataUrl: "",
			success: this.ShareSuccess.bind(this),
			cancel: this.ShareCancel.bind(this)
		};
		this.sdk.onMenuShareTimeline(shareInfo);
		this.sdk.onMenuShareAppMessage(shareInfo);
		this.sdk.onMenuShareQQ(shareInfo);
		this.sdk.onMenuShareWeibo(shareInfo);
		this.sdk.onMenuShareQZone(shareInfo);
	},
	//微信分享获取短域名失败分享
	FailTcnUrl: function FailTcnUrl(event) {},
	//房间微信分享
	InitRoomWeChatShare: function InitRoomWeChatShare() {
		if (!this.sdk) {
			return;
		}
		var room = app[app.subGameName.toUpperCase() + "Room"]();
		var WeChatShare = this.WeChatShare(app.subGameName);
		var title = null;
		if (WeChatShare['special']) {
			title = WeChatShare['special'];
		} else {
			title = WeChatShare['title'];
		}
		var desc = WeChatShare['desc'];
		var setCount = room.GetRoomConfigByProperty("setCount"); //多少局
		var roomKey = room.GetRoomProperty("key"); //房间号

		var allPlayerInfo = room.GetRoomProperty('posList');
		var joinPlayerCount = allPlayerInfo.length; //几人场
		var nowJoin = 0;

		for (var i = 0; i < joinPlayerCount; i++) {
			if (allPlayerInfo[i].pid > 0) nowJoin++;
		}
		title = title.replace('{房间号}', roomKey);
		title = title.replace('{几局}', setCount);
		var gamedesc = "";
		gamedesc = joinPlayerCount + "人场";
		var autoCardIdx = room.GetRoomConfigByProperty("paymentRoomCardType");
		if (0 == autoCardIdx) gamedesc = gamedesc + ",房主出卡";else if (1 == autoCardIdx) gamedesc = gamedesc + ",平分房卡";else gamedesc = gamedesc + ",大赢家出卡";
		var que = joinPlayerCount - nowJoin;
		gamedesc += "," + nowJoin + "缺" + que;
		var teshuwanfan = this.WanFa();
		if (teshuwanfan) {
			gamedesc += "," + teshuwanfan;
		}
		//let text=title+"\n"+gamedesc;
		this.BeginShare(room.GetRoomProperty("key"), title, gamedesc);
	},
	WanFa: function WanFa() {
		this.gameCreateConfig = this.SysDataManager.GetTableDict("gameCreate");
		var playGame = app.subGameName;
		if (playGame == '') {
			return false;
		}
		var room = app[app.subGameName.toUpperCase() + "Room"]();
		var wanfa = '';
		for (var key in this.gameCreateConfig) {
			if (playGame == this.gameCreateConfig[key].GameName && this.gameCreateConfig[key].isWanFa == 1) {
				var dataKey = this.gameCreateConfig[key].Key;
				var value = room.GetRoomConfigByProperty(dataKey);
				var ToggleType = this.gameCreateConfig[key].ToggleType;
				var ToggleDesc = this.gameCreateConfig[key].ToggleDesc.split(',');
				if (ToggleType == 0) {
					//单选
					var str = '';
					str = ToggleDesc[value];
					if ('zjh' == gameType && ('dingzhu' == dataKey || 'dizhu' == dataKey)) {
						var baseDiZhus = [1, 2, 5, 10];
						var dizhuIdx = room.GetRoomConfigByProperty('dizhu');
						var dizhu = baseDiZhus[dizhuIdx];
						var dingzhu = 0;
						if (0 == value) dingzhu = dizhu * 5;else dingzhu = dizhu * 10;
						dizhu = dizhu * room.GetRoomConfigByProperty('baseMark');
						dingzhu = dingzhu * room.GetRoomConfigByProperty('baseMark');

						if ('dingzhu' == dataKey) str = dingzhu.toString() + '分';else str = dizhu.toString() + '分';
					}
					if (wanfa == '') {
						wanfa = str;
					} else {
						wanfa = wanfa + "，" + str;
					}
				} else if (ToggleType == 1) {
					//多选
					for (var j = 0; j < value.length; j++) {
						if (wanfa == '') {
							wanfa = ToggleDesc[value[j]];
						} else {
							wanfa = wanfa + "，" + ToggleDesc[value[j]];
						}
					}
				}
			}
		}
		return wanfa;
	},

	//设置微信预分享数据
	SetWeChatShareDataInfo: function SetWeChatShareDataInfo(title, desc, argDict) {
		if (!this.sdk) {
			this.Log("SetWeChatShareDataInfo not init sdk");
			return;
		}
		var gameLoadUrl = app[app.subGameName + "Client"].GetClientConfigProperty("GameLoadUrl");
		var weChatShareImageUrl = app[app.subGameName + "Client"].GetClientConfigProperty("WeChatShareImageUrl");

		//如果没有传递参数字典
		if (!argDict) {
			argDict = {};
		}

		var gameID = app[app.subGameName + "Client"].GetClientConfigProperty("GameID");
		if (!gameID) {
			console.error("SetWeChatShareDataInfo not find GameID");
			return;
		}
		var mpID = app[app.subGameName + "Client"].GetClientConfigProperty("MPID");
		if (!mpID) {
			console.error("SetWeChatShareDataInfo not find MPID");
			return;
		}

		//添加启动标示参数
		argDict["ddmchannel"] = "wechat";
		argDict["ddmgameid"] = gameID;
		argDict["ddmmp"] = mpID;
		//分享携带推广ID
		argDict["popularizeID"] = this.HeroManager.GetHeroID();

		gameLoadUrl += this.GetUrlStr(argDict);

		var shareInfo = {
			title: title,
			desc: desc,
			link: gameLoadUrl,
			imgUrl: weChatShareImageUrl,
			type: "link",
			dataUrl: "",
			success: this.ShareSuccess.bind(this),
			cancel: this.ShareCancel.bind(this)
		};

		this.sdk.onMenuShareTimeline(shareInfo);
		this.sdk.onMenuShareAppMessage(shareInfo);
		this.sdk.onMenuShareQQ(shareInfo);
		this.sdk.onMenuShareWeibo(shareInfo);
		this.sdk.onMenuShareQZone(shareInfo);
	},

	GetUrlStr: function GetUrlStr(dataDict) {

		if (!dataDict) {
			return "";
		}

		var argList = Object.keys(dataDict);
		argList.sort();
		var count = argList.length;

		var urlSendStr = '?';
		for (var index = 0; index < count; index++) {
			var key = argList[index];
			urlSendStr += key + '=' + dataDict[key] + '&';
		}
		//去掉最后一个&
		urlSendStr = urlSendStr.substring(0, urlSendStr.length - 1);

		return urlSendStr;
	},

	//分享成功
	ShareSuccess: function ShareSuccess() {},

	//取消分享
	ShareCancel: function ShareCancel() {},

	GetSDK: function GetSDK() {
		return this.sdk;
	},

	GetSDKProperty: function GetSDKProperty(property) {
		if (!this.dataInfo.hasOwnProperty(property)) {
			console.error("GetSDKProperty not find property:%s", property);
			return;
		}

		return this.dataInfo[property];
	},
	//---------------微信头像-------------------------

	//玩家登陆完成
	OnEvent_PlayerLoginOK: function OnEvent_PlayerLoginOK() {
		var heroID = this.HeroManager.GetHeroID();
		var headImageUrl = this.HeroManager.GetHeroProperty("headImageUrl");
		//初始化第3方玩家头像贴图
		this.InitHeroHeadImage(heroID, headImageUrl);
	},

	//------------头像贴图初始化-------------
	//通过玩家ID初始化玩家头像
	InitHeroHeadImage: function InitHeroHeadImage(heroID, headImageUrl) {
		if (!headImageUrl) {
			return;
		}
		var headSpriteFrameInfo = this.heroHeadSpriteFrame.SetDefault(heroID, {});
		//如果缓存的url地址没有变化,并且已经存在spriteFrame对象了,则不用申请贴图数据
		if (headSpriteFrameInfo["HeadImageUrl"] == headImageUrl && headSpriteFrameInfo["SpriteFrame"]) {
			return;
		}
		headSpriteFrameInfo["HeadImageUrl"] = headImageUrl;
		headSpriteFrameInfo["SpriteFrame"] = null;

		var headInfo = {};
		headInfo[heroID] = headImageUrl;

		this.SendHttpLoadHeadImage(headInfo);
	},

	//通过字典初始化玩家头像
	InitHeroHeadImageByDict: function InitHeroHeadImageByDict(heroHeadInfo) {
		var headInfo = {};

		for (var heroID in heroHeadInfo) {
			var headImageUrl = heroHeadInfo[heroID];
			if (!headImageUrl) {
				continue;
			}
			var headSpriteFrameInfo = this.heroHeadSpriteFrame.SetDefault(heroID, {});
			//如果缓存的url地址没有变化,并且已经存在spriteFrame对象了,则不用申请贴图数据
			if (headSpriteFrameInfo["HeadImageUrl"] == headImageUrl && headSpriteFrameInfo["SpriteFrame"]) {
				continue;
			}
			headSpriteFrameInfo["HeadImageUrl"] = headImageUrl;
			headSpriteFrameInfo["SpriteFrame"] = null;
			headInfo[heroID] = headImageUrl;
		}

		if (Object.keys(headInfo).length) {
			this.SendHttpLoadHeadImage(headInfo);
		}
	},

	//发送封包请求
	SendHttpLoadHeadImage: function SendHttpLoadHeadImage(headInfo) {

		var gameID = app[app.subGameName + "Client"].GetClientConfigProperty("GameID");
		var sendPack = this.NetManager.GetHttpSendPack(0xFF09);
		sendPack.HeadInfo = headInfo;
		sendPack.GameID = gameID;
		this.NetManager.SendHttpPack(sendPack);
	},

	//接收到资源服务器下载资源回复
	OnHttpPack_HeadImagePathInfo: function OnHttpPack_HeadImagePathInfo(serverPack) {
		// this.SysLog("OnHttpPack_HeadImagePathInfo serverPack:", serverPack);
		var resServerUrl = this.NetManager.GetResServerHttpAddress();
		if (!resServerUrl) {
			console.error("OnHttpPack_HeadImagePathInfo(%s,%s) not resServerUrl");
			return;
		}
		var bluebirdList = [];
		var headPathInfo = serverPack["HeadPathInfo"];
		for (var heroID in headPathInfo) {
			bluebirdList.push(this.CreateSpriteFrame(resServerUrl, heroID, headPathInfo[heroID]));
		}

		var that = this;

		app.bluebird.all(bluebirdList).then(function (heroIDList) {
			app[app.subGameName + "Client"].OnEvent("RefreshHeadImageSprite", { "HeroIDList": heroIDList });
		}).catch(function (error) {
			that.ErrLog("OnHttpPack_HeadImagePathInfo:%s", error.stack);
		});
	},

	//创建头像贴图对象
	CreateSpriteFrame: function CreateSpriteFrame(resServerUrl, heroID, headPath) {
		var that = this;

		var targetPath = [resServerUrl, headPath].join("/");

		return this.ControlManager.CreateLoadPromiseByUrl(targetPath).then(function (texture) {
			if (texture instanceof cc.Texture2D) {
				var spriteFrame = new cc.SpriteFrame(texture);
				var headSpriteFrameInfo = that.heroHeadSpriteFrame.SetDefault(heroID, {});
				headSpriteFrameInfo["SpriteFrame"] = spriteFrame;
				return heroID;
			} else {
				that.ErrLog("texture not Texture2D");
			}
		}).catch(function (error) {
			that.ErrLog("OnHttpPack_HeadImagePathInfo error:%s", error.stack);
		});
	},

	//获取指定玩家的第3方头像贴图对象
	GetHeroHeadSpriteFrame: function GetHeroHeadSpriteFrame(heroID) {
		var headSpriteFrameInfo = this.heroHeadSpriteFrame[heroID];
		if (!headSpriteFrameInfo) {
			return;
		}
		return headSpriteFrameInfo["SpriteFrame"];
	},

	//---------------------订单接口---------------------
	//收到预订单信息
	ReceivePrepayOrder: function ReceivePrepayOrder(serverPack) {
		var prepayOrderInfo = serverPack["PrepayOrderInfo"];

		var argDict = prepayOrderInfo["ArgDict"];

		argDict["success"] = this.OnPayResult.bind(this);
		this.sdk.chooseWXPay(argDict);
	},

	//接收到扫描支付回调
	ReceivePrepayQRCodeOrder: function ReceivePrepayQRCodeOrder(serverPack) {
		var code_url = serverPack["Code_url"];

		var orderServerIP = app[app.subGameName + "Client"].GetClientConfigProperty("OrderServerIP");
		var orderServerPort = app[app.subGameName + "Client"].GetClientConfigProperty("OrderServerPort");

		code_url = ["http://", orderServerIP, ":", orderServerPort, "/", code_url].join("");

		//打开扫描支付页面
		cc.sys.openURL(code_url);
	},

	//支付结果通知
	OnPayResult: function OnPayResult(resultInfo) {

		// this.SysLog("OnPayResult:", resultInfo);

		//{
		//	"errMsg":"chooseWXPay:ok"
		//}
		if (resultInfo["errMsg"] == "chooseWXPay:ok") {
			console.log("支付成功");
		} else {
			console.log("支付失败");
			app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("CodeErrorMsg", ["微信公众号支付失败:" + JSON.stringify(resultInfo)]);
		}
	},

	//---------------授权接口--------------------
	//微信授权
	Login: function Login() {
		var token = this.dataInfo["code"];
		if (!token) {
			console.error("Login dataInfo not find code :", this.dataInfo);
			return;
		}

		var mpID = app[app.subGameName + "Client"].GetClientConfigProperty("MPID");
		if (!mpID) {
			console.error("Login not find MPID");
			return;
		}
		this.HeroAccountManager.LoginAccountBySDK(this.ShareDefine.SDKType_WeChat, token, mpID);
	},

	//检查登录是否是短线重登
	CheckLoginBySDK: function CheckLoginBySDK() {
		var token = this.dataInfo["code"];
		if (!token) {
			console.error("Login dataInfo not find code :", this.dataInfo);
			return false;
		}

		var mpID = app[app.subGameName + "Client"].GetClientConfigProperty("MPID");
		if (!mpID) {
			console.error("Login not find MPID");
			return false;
		}
		return true;
	},

	//----------------发包接口------------------------

	//发送请求微信公众号sdk签名
	SendRequestWeChatSDKIntSign: function SendRequestWeChatSDKIntSign() {

		var mpID = app[app.subGameName + "Client"].GetClientConfigProperty("MPID");
		//没有配置公众号,不需要分享功能
		if (!mpID) {
			this.Log("SendRequestWeChatSDKIntSign not mpID");
			return;
		}

		//native版本不需要请求签名,H5才需要
		if (cc.sys.isNative) {
			return;
		}

		//如果网页没有加载wxSDK
		if (!this.wx) {
			console.error("SendRequestWeChatSDKIntSign not find wx");
			return;
		}
		var url = window.location.href.split('#')[0];
		if (!url) {
			console.error("SendRequestWeChatSDKIntSign  window.location.href:%s", window.location.href);
			return;
		}

		var sendPack = this.NetManager.GetHttpSendPack(0xFF06);
		sendPack.MPID = mpID;
		sendPack.Url = url;
		this.NetManager.SendHttpPack(sendPack);
	},

	//是否已经关注公众号
	SendIsSubscribeWeChatMP: function SendIsSubscribeWeChatMP() {

		var mpID = app[app.subGameName + "Client"].GetClientConfigProperty("MPID");
		//没有配置公众号,不需要验证是否关注公众号
		if (!mpID) {
			console.error("SendIsSubscribeWeChatMP not find MPID");
			return;
		}

		var accountID = this.HeroAccountManager.GetAccountProperty("AccountID");
		var sendPack = this.NetManager.GetHttpSendPack(0xFF05);
		sendPack.AccountID = accountID;
		sendPack.MPID = mpID;
		this.NetManager.SendHttpPack(sendPack);
	},

	WeChatShare: function WeChatShare(playgame) {
		var gameCfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		var type = typeof playgame === "undefined" ? "undefined" : _typeof(playgame);
		if (type == 'number') {
			playgame = app[app.subGameName + "_ShareDefine"]().GametTypeID2PinYin[playgame];
		}
		var WeChatShare = new Array();
		var gameId = app[app.subGameName + "_ShareDefine"]().GametTypeNameDict[playgame.toUpperCase()];
		var gamename = app[app.subGameName + "_ShareDefine"]().GametTypeID2Name[gameId];
		var special = '';
		if (playgame) {
			special = app[app.subGameName + "Client"].GetClientConfigProperty("RoomShare" + playgame.toUpperCase());
		}
		var title = '';
		var desc = '';
		if (playgame) {
			title = app[app.subGameName + "Client"].GetClientConfigProperty("WeChatShareRoomTitle");
			title = title.replace('{游戏名}', gamename);
			desc = app[app.subGameName + "Client"].GetClientConfigProperty("WeChatShareRoomDesc");
			desc = desc.replace('{游戏名}', gamename);
		} else {
			title = app[app.subGameName + "Client"].GetClientConfigProperty("WeChatShareTitle");
			desc = app[app.subGameName + "Client"].GetClientConfigProperty("WeChatShareDesc");
		}
		var weChatAppShareUrl = app[app.subGameName + "Client"].GetClientConfigProperty("WeChatAppShareUrl");
		var ShortShareUrl = app[app.subGameName + "Client"].GetClientConfigProperty("ShortShareUrl");
		//获取HeroID
		this.ComTool = app[app.subGameName + "_ComTool"]();
		this.HeroManager = app[app.subGameName + "_HeroManager"]();
		var heroID = app[app.subGameName + "_HeroManager"]().GetHeroProperty("pid");
		var ShortHeroID = this.ComTool.GetPid(heroID);
		WeChatShare['title'] = title;
		WeChatShare['desc'] = desc;
		WeChatShare['special'] = special;
		WeChatShare['url'] = weChatAppShareUrl + "/" + ShortHeroID + "/";
		console.log("WeXinShare WeChatShare:", WeChatShare);
		return WeChatShare;
	}
});

var g_sss_WeChatManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_sss_WeChatManager) {
		g_sss_WeChatManager = new sss_WeChatManager();
	}
	return g_sss_WeChatManager;
};

cc._RF.pop();