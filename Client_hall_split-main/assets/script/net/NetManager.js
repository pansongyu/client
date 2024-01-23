/*
	网络通信管理器
*/
var app = require('app');
var emitter = require('emitter');

var NetManager = app.BaseClass.extend({

	Init: function () {
		this.JS_Name = "NetManager";

		this.emitter = new emitter();
		this.ShareDefine = app.ShareDefine();
		this.SysDataManager = app.SysDataManager();
		this.NetWork = app.NetWork();
		this.httpRequest = app.NetRequest();
		this.ComTool = app.ComTool();


		this.NewSysMsg = this.SysDataManager.GetTableDict("NewSysMsg");

		//h5客户端启动url
		this.H5ClientStartUrl = "";

		this.InitServerAddress();

		this.InitHttpPack();

		this.RegNetPack("game.C1105GMPack", this.OnPack_GMPack, this);

		this.RetryTime = 0;
		this.Log("Init");
	},

	//切换账号
	OnReload: function () {
		this.NetWork.OnReload();
	},

	//初始化连接
	InitConnectAccountID: function (accountID) {
		this.NetWork.InitConnectInfo(accountID);
	},

	//初始化连接的服务器地址
	InitServerAddress: function () {

		let clientConfig = app.Client.GetClientConfig();

		this.AccountServerUrl = ['http://', clientConfig["AccountServerIP"], ":", clientConfig["AccountServerPort"], "/ClientPack"].join("");

		//this.AccountServerUrlHttps = ['https://', clientConfig["AccountServerIP"], ":", clientConfig["AccountServerPort"].toString()+'0', "/ClientPack"].join("");


		this.OrderServerUrl = ['http://', clientConfig["OrderServerIP"], ":", clientConfig["OrderServerPort"], "/ClientPack"].join("");

		this.ResServerUrl = ['http://', clientConfig["ResServerIP"], ":", clientConfig["ResServerPort"], "/ClientPack"].join("");

		let gateServerInfo = app["GateServerInfo"];

		this.SysLog("GateServer(%s:%s)", gateServerInfo["GateServerIP"], gateServerInfo["GateServerPort"], "b-g");
		this.SysLog("AccountServer(%s)", this.AccountServerUrl, "b-g");
		this.SysLog("OrderServer(%s)", this.OrderServerUrl, "b-g");
		this.SysLog("ResServerUrl(%s)", this.ResServerUrl, "b-g");
		this.SysLog("Server(%s:%s)", clientConfig["GameServerIP"], clientConfig["GameServerPort"], "b-g");
	},

	//设置首次连接服务器IP
	SetGateServerAddress: function (gateServerIP, gateServerPort) {
		if (!gateServerIP || !gateServerPort) {
			this.ErrLog("SetGateServerAddress(%s,%s) error", gateServerIP, gateServerPort);
			return
		}
		//更新内存
		let gateServerInfo = app["GateServerInfo"];
		gateServerInfo["GateServerIP"] = gateServerIP;
		gateServerInfo["GateServerPort"] = gateServerPort;

		this.SysLog("SetGateServerAddress(%s:%s)", gateServerIP, gateServerPort);

		//修改本地数据库
		app.LocalDataManager().GetConfigProperty("DebugInfo", "GateServerInfo", gateServerInfo);

		app.Client.OnEvent("OnGateServerChangeIP", null);
	},

	//设置服务器连接IP地址
	SetServerAddress: function (gameServerIP, gameServerPort) {

		if (!gameServerIP || !gameServerPort) {
			this.ErrLog("SetServerAddress(%s,%s) error", gameServerIP, gameServerPort);
			return
		}
		this.SysLog("SetServerAddress:%s:%s", gameServerIP, gameServerPort);

		//保存到本地数据库
		let LocalDataManager = app.LocalDataManager();
		let dbGameServerInfo = {
			"GameServerIP": gameServerIP,
			"GameServerPort": gameServerPort,
		}
		LocalDataManager.SetConfigProperty("DebugInfo", "GameServerInfo", dbGameServerInfo);

		//修改内存中缓存的字典
		app.Client.RefreshClientConfig()

		app.Client.OnEvent("OnChangeIP", null);
	},
	SetAccountAddress: function (accountServerIP, serverServerPort) {
		if (!accountServerIP || !serverServerPort) {
			this.ErrLog("SetAccountAddress(%s,%s) error", accountServerIP, serverServerPort);
			return
		}
		this.AccountServerUrl = ['http://', accountServerIP, ":", serverServerPort, "/ClientPack"].join("");
		//this.AccountServerUrlHttps = ['https://', accountServerIP, ":", serverServerPort.toString()+'0', "/ClientPack"].join("");
		this.SysLog("SetAccountAddress:%s", this.AccountServerUrl);

		//保存到本地数据库
		let LocalDataManager = app.LocalDataManager();
		let dbAccountServerInfo = {
			"AccountServerIP": accountServerIP,
			"AccountServerPort": serverServerPort,
		}
		LocalDataManager.SetConfigProperty("DebugInfo", "AccountServerInfo", dbAccountServerInfo);

		//修改内存中缓存的字典
		app.Client.RefreshClientConfig()

		app.Client.OnEvent("OnChangeIP", null);
	},
	SetResAddress: function (resServerIP, serverServerPort) {
		if (!resServerIP || !serverServerPort) {
			this.ErrLog("SetResAddress(%s,%s) error", resServerIP, serverServerPort);
			return
		}
		this.ResServerUrl = ['http://', resServerIP, ":", serverServerPort, "/ClientPack"].join("");
		this.SysLog("SetResAddress:%s", this.ResServerUrl);

		//保存到本地数据库
		let LocalDataManager = app.LocalDataManager();
		let dbResServerInfo = {
			"ResServerIP": resServerIP,
			"ResServerPort": serverServerPort,
		}
		LocalDataManager.SetConfigProperty("DebugInfo", "ResServerInfo", dbResServerInfo);

		//修改内存中缓存的字典
		app.Client.RefreshClientConfig()

		app.Client.OnEvent("OnChangeIP", null);
	},
	SetOrderAddress: function (orderServerIP, serverServerPort) {
		if (!orderServerIP || !serverServerPort) {
			this.ErrLog("SetOrderAddress(%s,%s) error", orderServerIP, serverServerPort);
			return
		}
		this.OrderServerUrl = ['http://', orderServerIP, ":", serverServerPort, "/ClientPack"].join("");
		this.SysLog("SetOrderAddress:%s", this.OrderServerUrl);

		//保存到本地数据库
		let LocalDataManager = app.LocalDataManager();
		let dbOrderServerInfo = {
			"OrderServerIP": orderServerIP,
			"OrderServerPort": serverServerPort,
		}
		LocalDataManager.SetConfigProperty("DebugInfo", "OrderServerInfo", dbOrderServerInfo);

		//修改内存中缓存的字典
		app.Client.RefreshClientConfig()

		app.Client.OnEvent("OnChangeIP", null);
	},


	//设置资源服务器地址
	SetH5ClientStartUrl: function (h5ClientStartUrl) {
		this.H5ClientStartUrl = h5ClientStartUrl;
		this.SysLog("SetH5ClientStartUrl:%s", this.H5ClientStartUrl)
	},


	//初始化http封包
	InitHttpPack: function () {
		//输出发送封包字典
		// {
		//     0xFF00:packName
		// }
		this.sendHttpPackDict = {};

		//封包发送到那个服务器
		// {
		//     0xFF00:account,
		// }
		this.packReceiveServerTypeDict = {};

		let ClientHttpPackDict = app.HttpPack().ClientHttpPackDict;

		for (let packHeadName in ClientHttpPackDict) {
			let headNameList = packHeadName.split(".");
			if (headNameList.length != 3) {
				this.ErrLog("InitHttpPack ClientHttpPackDict packHeadName:%s error", packHeadName);
				continue
			}
			let headInt = Math.floor(headNameList[1]);

			if (this.sendHttpPackDict.hasOwnProperty(headInt)) {
				this.ErrLog("InitHttpPack sendHttpPackDict have find(%s) headInt", packHeadName);
				continue
			}
			this.sendHttpPackDict[headInt] = ClientHttpPackDict[packHeadName];

			this.packReceiveServerTypeDict[headInt] = headNameList[2];
		}
	},

	//初始化连接
	InitConnectServer: function () {
		app.Client.OnEvent("ModalLayer", "OpenNet");

		let clientConfig = app.Client.GetClientConfig();

		let gameServerIP = clientConfig["GameServerIP"];
		let gameServerPort = clientConfig["GameServerPort"];
		console.log("大厅开始连接服务器");
		//初始化连接服务器
		this.NetWork.InitWebSocket(gameServerIP, gameServerPort, this.OnWebSocketEvent.bind(this), this.OnConnectSuccess.bind(this));

	},


	/**
	 * 获取url字符串格式
	 * @param dataDict
	 * @returns {String}
	 */
	GetUrlStr: function (dataDict) {

		if (!dataDict) {
			return ""
		}
		var urlSendStr = '?';
		for (var key in dataDict) {
			urlSendStr += key + '=' + dataDict[key] + '&';
		}
		//去掉最后一个&
		urlSendStr = urlSendStr.substring(0, urlSendStr.length - 1);

		return urlSendStr;
	},

	//获取http请求发送的封包
	GetHttpSendPack: function (head) {
		if (!this.sendHttpPackDict.hasOwnProperty(head)) {
			this.ErrLog("GetHttpSendPack sendHttpPackDict not find:%s", head);
			return
		}
		return { "Head": head }
	},

	//获取http封包发送的目的地地址
	GetHttpSendPackUrl: function (head) {
		let serverType = this.packReceiveServerTypeDict[head];
		if (!serverType) {
			this.ErrLog("GetHttpSendPackUrl(%s) not find", head);
			return
		}

		let url = "";
		switch (serverType) {
			case "account":
				url = this.AccountServerUrl;
				break
			case "order":
				url = this.OrderServerUrl;
				break
			case "res":
				url = this.ResServerUrl;
				break
			default:
				this.ErrLog("GetHttpSendPackUrl serverType:%s error", serverType);
				break
		}

		return url
	},

	//获取客户端启动后的html地址串
	GetH5ClientStartUrl: function () {
		return this.H5ClientStartUrl
	},

	//获取客户端资源服务器HTTP地址
	GetResServerHttpAddress: function () {
		let clientConfig = app.Client.GetClientConfig();
		return ['http://', clientConfig["ResServerIP"], ":", clientConfig["ResServerPort"]].join("");
	},

	//-------------websocket请求------------------
	//系统自主发送重连请求
	SendReConnect: function (eventName, sendPack) {
		app.Client.OnEvent("ModalLayer", "OpenNet");
		this.NetWork.RequestReConnect(eventName, sendPack)
	},
	//向服务器发起请求
	SendPack: function (eventName, sendPack, callback = (data) => {
		console.log("服务端返回成功", data)
	}, errorCallback = (data) => {
		console.log("服务端返回失败", data)
	}) {
		if (app.ControlManager().IsOpenVpn()) {
            return;
        }
		if (eventName != "heartBeat.CHeartBeatHandler") {
			console.log("向服务器发起请求", eventName, JSON.stringify(sendPack));
		}
		//开启模态层
		app.Client.OnEvent("ModalLayer", "OpenNet");
		this.NetWork.Request(eventName, sendPack, callback, errorCallback);
	},
	//向服务器发起请求,不触发网络
	SendPackOnly: function (eventName, sendPack, callback = null, errorCallback = null) {
		this.NetWork.Request(eventName, sendPack, callback, errorCallback);
	},
	//通知服务器得封包数据
	NotifyPack: function (eventName, sendPack) {
		this.NetWork.Notify(eventName, sendPack);
	},

	//注册封包事件(需要字符串封包头,才可以避免RegHttpNetPack相同封包头注册事件区分)
	RegNetPack: function (head, func, target) {
		head = head.toLocaleLowerCase();
		let valueType = Object.prototype.toString.call(head).slice("[object ".length, -1);
		if (valueType != "String") {
			this.ErrLog("RegNetPack need String head");
			return
		}

		if (!func || !target) {
			this.ErrLog("RegNetPack head:%s error", head);
			return
		}

		this.emitter.on(head, func, target);
	},

	//取消封包注册
	UnRegNetPack: function (eventName, func) {
		this.emitter.off(eventName, func);
	},

	//取消所有封包注册
	UnRegAllNetPack: function () {
		this.emitter.removeAllListeners();
	},

	//服务器连接成功
	OnConnectSuccess: function (isReconnecting) {
		//关闭模态层
		app.Client.OnEvent("ModalLayer", "ReceiveNet");
		app.Client.OnEvent("ConnectSuccess", { "ServerName": "GameServer", "IsReconnecting": isReconnecting });
	},
	//websocket事件回掉
	OnWebSocketEvent: function (eventName, arg) {
		// console.log("大厅 OnWebSocketEvent 回调");
		//关闭模态层
		app.Client.OnEvent("ModalLayer", "ReceiveNet");

		switch (eventName) {
			case "OnError":
				this.SysLog("连接超时");
				app.Client.OnEvent("ConnectFail", { "ServerName": "GameServer", "EventType": "OnError" });
				break

			case "Reconnectd":
				this.SysLog("重连失败");
				app.Client.OnEvent("ModalLayer", "StartReConnect");
				this.NetWork.ReConnect();
				break

			case "OnClose":
				this.SysLog("断开连接");
				app.Client.OnEvent("ConnectFail", {
					"bCloseByLogout": arg[0],
					"ServerName": "GameServer",
					"EventType": "OnClose"
				});
				break

			case "OnKick":
				this.ErrLog("被T(%s)", arg["reason"]);
				app.SysNotifyManager().ShowSysMsg("Kick_ByServer");
				break

			case "OnReceive":
				this.OnReceive(arg[0], arg[1]);
				break

			case "OnCodeError":
				this.OnCodeError(arg[0], arg[1], arg[2]);
				break

			case "OnGMReceive":
				this.OnGMReceive(arg[0], arg[1]);
				break

			default:
				this.ErrLog("OnWebSocketEvent(%s):", eventName, arg);
				break
		}
	},

	OnConFirm: function (clickType, msgID, backArgList) {
		if (clickType != "Sure") {
			return
		}
		if ("goBuyCard" == msgID) {
			let clientConfig = app.Client.GetClientConfig();
			if (app.PackDefine.APPLE_CHECK == clientConfig["appPackType"]) return
			app.FormManager().ShowForm("UIStore");
			app.FormManager().CloseForm("UIJoin");
			app.FormManager().CloseForm("UIChouJiang");
			return;
		} else if ("MSG_OPEN_GPS" == msgID) {
			if (cc.sys.isNative) {
				app.NativeManager().CallToNative("gpsSetting", []);
			}
			return;
		}
	},

	//封包事件回掉
	OnReceive: function (routeName, receivePack) {
		if (routeName != "splayerheartbeat" && routeName != "heartbeat.cheartbeathandler") {
			console.log("封包事件回掉", routeName, JSON.stringify(receivePack));
		}
		try {
			this.emitter.emit(routeName, receivePack);
		}
		catch (error) {
			this.ErrLog("OnReceive:%s", error.stack);
			this.ErrLog("OnReceive routeName :%s, receivePack:%s", routeName, JSON.stringify(receivePack));
		}
	},

	//封包事件失败回掉
	OnCodeError: function (eventName, code, resultInfo) {
		console.log("OnCodeError(%s) (%s) (%s):", eventName, code, JSON.stringify(resultInfo));

		let codeMsg = ["Code", code].join("_");
		//如果是错误提示类型,根据提示码提示,直接提示
		if (code == this.ShareDefine.ErrorSysMsg) {
			app.SysNotifyManager().ShowSysMsg(resultInfo["Msg"]);
		}
		// else if(code == this.ShareDefine.NotAllow){
		// 	app.SysNotifyManager().ShowSysMsg('MSG_SERVICE_NOTALLOW');
		// }
		else if (code == 5024) {
			app.SysNotifyManager().ShowSysMsg(resultInfo["Msg"]);
		}
		else if (code == 105) {
			app.SysNotifyManager().ShowSysMsg("城市未开放");
		}
		else if (code == 304) {
			app.SysNotifyManager().ShowSysMsg("房间已经开始了");
		}
		else if (code == 12) {
			app.SysNotifyManager().ShowSysMsg(resultInfo["Msg"]);
		}
		else if (code == 5118) {
			app.SysNotifyManager().ShowSysMsg("错误验证码");
		}
		else if (code == 5116) {
			app.SysNotifyManager().ShowSysMsg("错误手机号");
		}
		else if (code == 5119) {
			app.Client.OnEvent("DoLogin", {});
		}
		else if (code == 6051) {
			app.SysNotifyManager().ShowSysMsg("修改后新上级推广员分成比例低于当前玩家比例，无法修改，请先修改玩家或新上级推广员的比例，使新上级推广员分成大于玩家分成");
		}
		else if (code == this.ShareDefine.InOtherRoomPlay) {
			app.SysNotifyManager().ShowSysMsg('MSG_IN_OTHER_ROOM_PLAY');
		}
		else if (code == 11) {
			app.SysNotifyManager().ShowSysMsg('网络连接失败，请联系客服');
		}
		else if (code == 6006) {
			//resultInfo
			app.SysNotifyManager().ShowSysMsg(resultInfo["Msg"]);
		} else if (code == 6017) {
			app.SysNotifyManager().ShowSysMsg('您被禁止该亲友圈游戏');
		}

		else if (code == 6052) {
			app.SysNotifyManager().ShowSysMsg('当前有人正在修改归属，请稍后再试');
		}

		else if (code == this.ShareDefine.CLUB_NOT_CREATE) {
			app.SysNotifyManager().ShowSysMsg('不是亲友圈创造者');
		}
		else if (code == this.ShareDefine.CLUB_NOT_PROMOTION) {
			app.SysNotifyManager().ShowSysMsg('不是推广员');
		}
		else if (code == this.ShareDefine.CLUB_NOT_EXIST_MEMBER_INFO) {
			app.SysNotifyManager().ShowSysMsg('亲友圈不存在成员信息');
		}
		else if (code == this.ShareDefine.CLUB_MEMBER_PROMOTION_BELONG) {
			app.SysNotifyManager().ShowSysMsg('修改归属的时候不能切换到原来的归属或者下线');
		}
		else if (code == this.ShareDefine.CLUB_MEMBER_PROMOTION_LEVEL_SHARE_LOWER) {
			app.SysNotifyManager().ShowSysMsg('当前分支下的下级推广员分成存在百分比形式，无法设置分成为固定值，请先修改');
		}
		else if (code == this.ShareDefine.CLUB_MEMBER_PROMOTION_LEVEL_SHARE_UP) {
			app.SysNotifyManager().ShowSysMsg('上级推广员分成为固定值，无法设置为百分比');
		}

		else if (code == this.ShareDefine.Maintain) {
			let finishttime = resultInfo["Msg"];
			app.SysNotifyManager().ShowSysMsg('服务器维护中,预计结束时间：' + app.ComTool().GetDateYearMonthDayHourMinuteString(finishttime));
		}
		else if (code == this.ShareDefine.ErrorNotRoomCard) {//房卡不足
			let desc = app.SysNotifyManager().GetSysMsgContentByMsgID("MSG_NotRoomCard");
			app.ConfirmManager().SetWaitForConfirmForm(this.OnConFirm.bind(this), "goBuyCard", []);
			app.FormManager().ShowForm("UIMessage", null, this.ShareDefine.ConfirmBuyGoTo, 0, 0, desc)
		}
		else if (code == 911) {//房卡不足
			let cityId = resultInfo["Msg"];
			let selectCityConfig = app.SysDataManager().GetTableDict("selectCity");
			let cityName = selectCityConfig[cityId]["Name"];
			app.SysNotifyManager().ShowSysMsg('圈主或者主办方[' + cityName + "]钻石不足");
			//   	let desc = "当前["+cityName+"]钻石不足，请前往购买";
			// app.ConfirmManager().SetWaitForConfirmForm(this.OnConFirm.bind(this), "goBuyCard", []);
			//   	app.FormManager().ShowForm("UIMessage", null, this.ShareDefine.ConfirmBuyGoTo, 0, 0,desc)
		}
		else if (code == this.ShareDefine.ErrorMaxRoom) {
			app.SysNotifyManager().ShowSysMsg('可以创建的房间数量不足');
		}

		else if (code == this.ShareDefine.NoPower_RoomJoinner) {
			app.SysNotifyManager().ShowSysMsg('您当前处于退出申请中，不能加入该游戏');
		}

		else if (code == this.ShareDefine.CLUB_PLAYER_EXIT_IN_OTHER_UNION) {
			app.SysNotifyManager().ShowSysMsg('已邀请或未找到该玩家或同赛事不同亲友圈不能重复拉人或距离退出该亲友圈不到10分钟');
		}


		else if (code == this.ShareDefine.EXIST_SAME_IP) {
			//app.SysNotifyManager().ShowSysMsg('MSG_SERVICE_NOTALLOW');
			app.SysNotifyManager().ShowSysMsg('拥有相同IP');
		} else if (code == this.ShareDefine.POSITIONING_NOT_ON) {
			app.FormManager().ShowForm("UIMessageGps");
		} else if (code == this.ShareDefine.APART_LOCATION) {
			app.SysNotifyManager().ShowSysMsg('您和房间内的玩家距离过近，禁止进入本房间');
		}

		else if (code == this.ShareDefine.ErrorNotQuanCard) {//圈币不足
			app.SysNotifyManager().ShowSysMsg('圈卡不足，请前往亲友圈商城购买圈卡');
			app.ClubManager().GetClubFormComponent().OnClick('btn_addRoomCard', null);
		}
		else if (code == 11034) {//登陆过期,请重新登录
			app.LocalDataManager().SetConfigProperty("Account", "AccessTokenInfo", {});//清除本地账号缓存
			app.SysNotifyManager().ShowSysMsg("登陆过期,请重新登录");
		}
		//如果有配置系统提示码,则提示错误提示码对应的文本
		else if (this.NewSysMsg.hasOwnProperty(codeMsg)) {

			let errorMsg = resultInfo["Msg"];
			//开发模式有 提示文本的话 显示错误文本
			if (this.ShareDefine.IsDevelopment && errorMsg) {
				app.SysNotifyManager().ShowSysMsg("CodeErrorMsg", [errorMsg]);
			}
			//如果不是开发模式,弹通用的系统提示
			else {
				app.SysNotifyManager().ShowSysMsg(codeMsg);
			}
		}
		//如果配置表没有配置的错误码
		else {
			//如果是不需要提示的,不配置也不需要显示的系统提示码
			if (this.ShareDefine.NoShowSysMsgCodeList.InArray(code)) {

			}
			//没有配置,是开发模式弹框
			else if (this.ShareDefine.IsDevelopment) {
				app.SysNotifyManager().ShowSysMsg("CodeErrorMsg", [resultInfo["Msg"]]);
			}
		}
		app.Client.OnEvent("CodeError", { "Code": code, "EventName": eventName, "Result": resultInfo });
	},

	//接受到GM命令汇报
	OnGMReceive: function (eventName, argDict) {
		app.Client.OnEvent("ReceiveGM", argDict);
	},

	//------------------http请求--------------------------------

	//注册http封包事件(需要整形封包头,才可以避免RegNetPack相同封包头注册事件区分)
	RegHttpNetPack: function (head, func, target) {
		let valueType = Object.prototype.toString.call(head).slice("[object ".length, -1);
		if (valueType != "Number") {
			this.ErrLog("RegNetPack need Int head");
			return
		}
		head = head.toString();
		this.emitter.on(head, func, target);
	},

	UnRegHttpNetPack: function (head, func) {
		let valueType = Object.prototype.toString.call(head).slice("[object ".length, -1);
		if (valueType != "Number") {
			this.ErrLog("UnRegHttpNetPack need Int head");
			return
		}
		head = head.toString();
		this.emitter.off(head, func);
	},

	//发送HTTP请求
	SendHttpPack: function (sendPack) {
		//    	console.log("sendPack Head:"+sendPack.Head);
		let serverUrl = this.GetHttpSendPackUrl(sendPack.Head);
		if (!serverUrl) {
			this.ErrLog("SendHttpPack(%s) not find serverUrl", sendPack);
			return
		}
		//开启模态层
		app.Client.OnEvent("ModalLayer", "OpenNet");
		let argDict = { "Sign": "ddcat" };
		let argString = this.GetUrlStr(argDict);

		if (this.IsDevelopment()) {
			this.NetLog("[SendHttp](%s):", serverUrl, sendPack, "b-g");
		}
		this.sendPack = sendPack;
		this.httpRequest.SendHttpRequest(serverUrl, argString, "POST", sendPack);
	},

	//发送HTTPS请求
	/*SendHttpsPack:function(){
		let sendPack=this.sendPack;
		let serverUrl=this.AccountServerUrlHttps;
		if(!serverUrl){
			this.ErrLog("SendHttpPacks(%s) not find serverUrl", sendPack);
			return
		}
		//开启模态层
		app.Client.OnEvent("ModalLayer", "OpenNet");
		let argDict = {"Sign":"ddcat"};
		let argString = this.GetUrlStr(argDict);

		if(this.IsDevelopment()){
			this.NetLog("[SendHttps](%s):", serverUrl, sendPack, "b-g");
		}

		this.httpRequest.SendHttpRequest(serverUrl, argString, "POST", sendPack);
	},
*/
	//接受到http请求回复
	OnReceiveHttpPack: function (serverUrl, httpResText) {
		//关闭模态层
		app.Client.OnEvent("ModalLayer", "ReceiveNet");

		var receivePack = JSON.parse(httpResText);
		if (this.IsDevelopment()) {
			this.NetLog("[RecvHttp]:", receivePack, "b-gb");
		}

		if (receivePack.hasOwnProperty("code")) {
			this.ErrLog("OnReceiveHttpPack HttpCode:", receivePack);

			let eventName = "HttpRequestCode";
			if (serverUrl == this.AccountServerUrl) {
				eventName = "AccountServerCode";
				this.OnCodeError(eventName, receivePack["code"], receivePack);
			}
			else if (serverUrl == this.ResServerUrl) {
				eventName = "ResServerCode";
				this.OnCodeError(eventName, receivePack["code"], receivePack);
			}
			else {
				this.ErrLog("OnReceiveHttpPack serverUrl(%s) error", serverUrl);
			}
		}
		else {
			try {
				//转化封包头为字符串 分发事件
				let head = receivePack.Head.toString();
				this.emitter.emit(head, receivePack);
			}
			catch (error) {
				this.ErrLog("OnReceiveHttpPack(%s) error", httpResText);
				return
			}
		}
	},
	/**
	 * 请求连接失败
	 */
	OnConnectHttpFail: function (serverUrl, readyState, status) {
		this.ErrLog("HttpConnectFail(%s, %s,%s)", serverUrl, readyState, status);

		//关闭模态层
		app.Client.OnEvent("ModalLayer", "ReceiveNet");

		if (serverUrl == this.AccountServerUrl) {
			//app.SysNotifyManager().ShowSysMsg("Code_10010");
			//app.Client.OnEvent("ConnectHttpFail", {"ServerName":"AccountServer"});
			//http请求失败，尝试用https请求
			//this.SendHttpsPack();
			if (this.RetryTime == 9) {
				app.SysNotifyManager().ShowSysMsg("Code_10010");
				app.Client.OnEvent("ConnectHttpFail", { "ServerName": "AccountServer" });
				return;
			}
			//换节点
			app.HeroAccountManager().UpdateAccessPoint();
			this.InitServerAddress();
			this.SendHttpPack(this.sendPack);
			this.RetryTime = this.RetryTime + 1;
		} else if (serverUrl == this.AccountServerUrlHttps) {
			/*if(this.RetryTime==5){
				app.SysNotifyManager().ShowSysMsg("Code_10010");
				app.Client.OnEvent("ConnectHttpFail", {"ServerName":"AccountServer"});
				return;
			}
			//换节点
			app.HeroAccountManager().UpdateAccessPoint();
			this.InitServerAddress();
			this.SendHttpPack(this.sendPack);
			this.RetryTime=this.RetryTime+1;*/
		}
		else {
			this.ErrLog("OnConnectHttpFail serverUrl:%s error", serverUrl);
		}
	},

	//------------操作函数-----------------------------

	//下线
	Disconnect: function (byLogout = false) {
		this.NetWork.Disconnect(byLogout);
	},

	SendGMPack: function (cmdString) {
		let sendPack = { "cmdString": cmdString };
		this.SendPack("game.C1105GMPack", sendPack)
	},

	OnPack_GMPack: function (serverPack) {
		app.Client.OnEvent("GMPack", serverPack);
	},

});

var g_NetManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_NetManager) {
		g_NetManager = new NetManager();
	}
	return g_NetManager;
}