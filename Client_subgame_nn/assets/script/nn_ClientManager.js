/*
    客户端初始化管理类(该组件节点不会被释放，只有切换小游戏才会释放)
*/

var app = require("nn_app");
require(app.subGameName + "_NativeNotify");
var nn_ClientManager = cc.Class({

	extends: require(app.subGameName + "_BaseComponent"),

	properties: {
		globalEffect: cc.Node,
		reConnectTip: cc.Node,
	},
	// 加载JS主入口
	onLoad: function () {
		console.log(app.subGameName + " ----- ClientManager onLoad-----");
		this.JS_Name = app["subGameName"] + "_ClientManager";

		console.logSecond = 0;
		//是否需要写log
		this.isWriteLog = cc.sys.isNative;

		//保证客户端管理器不被释放
		cc.game.addPersistRootNode(this.node);

		this.StartTimer();

		this.schedule(this.OnTimer, 0.1);

		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.OnKeyDown, this);

		//把Client存放到App上
		app[app.subGameName + "Client"] = this;

		//枚举管理器
		let ShareDefineModel = require(app.subGameName + "_ShareDefine").GetModel;
		app[app.subGameName + "_ShareDefine"] = ShareDefineModel;
		this[app.subGameName + "_ShareDefine"] = ShareDefineModel();

		//工具模块
		let ComToolModel = require(app.subGameName + "_ComTool").GetModel;
		app[app.subGameName + "_ComTool"] = ComToolModel;
		this[app.subGameName + "_ComTool"] = ComToolModel();

		//加载控制器
		let ControlManagerModel = require(app.subGameName + "_ControlManager").GetModel;
		app[app.subGameName + "_ControlManager"] = ControlManagerModel;
		this[app.subGameName + "_ControlManager"] = ControlManagerModel();

		//检测是否可以使用localStorage,有的浏览器没有
		var localStorage = cc.sys.localStorage;
		localStorage.setItem("testStorage", "1");
		var testData = localStorage.getItem("testStorage");
		if (testData) {
			cc.sys.localStorage.CanUse = 1;
			localStorage.removeItem("testStorage");
		}
		else {
			cc.sys.localStorage.CanUse = 0;
			console.error("cant use sys.localStorage");
		}

		//本地数据管理器
		let LocalDataManagerModel = require("LocalDataManager").GetModel;
		app["LocalDataManager"] = LocalDataManagerModel;
		this.LocalDataManager = LocalDataManagerModel();

		//js调用native平台接口管理器(启动需要获取客户端app启动携带参数)
		let NativeManagerModel = require(app.subGameName + "_NativeManager").GetModel;
		app[app.subGameName + "_NativeManager"] = NativeManagerModel;
		this.NativeManager = NativeManagerModel();

		//客户端初始化
		this.clientState = this[app.subGameName + "_ShareDefine"].State_Prepare;

		//定时器下次执行时间
		this.nextTick = 0;

		//心跳
		this.lastHearTime = 0;
		this.LostHearTime = 0;
		this.isFirstLogin = true;
		this.debugModel = null;
		//重连计时
		this.lastReConnectTime = 0;
		this.reConnectUseTime = 0;
		this.bStartReConnect = false;
		this.reConnectLable = this.reConnectTip.getChildByName('sp_info').getChildByName('lb_info').getComponent(cc.Label);
		//启动携带参数
		this.startUpInfo = {};

		//客户端配置字典
		this.clientConfig = {};

		this.gameType = -1;

		this.InitLaunchParameter();

		//this.loadapkpro = 0.0f;
		//
		this.isAllReadyRelogin = false;
	},

	//debug初始化
	InitDebug: function (isDebug) {

		if (isDebug) {
			// console.logManager.IsOpenLog(true);
			this[app.subGameName + "_ShareDefine"].IsDevelopment = 1;
			try {
				if (this.debugPrefab && !this.debugModel) {
					let debugNode = cc.instantiate(this.debugPrefab);
					this.debugModel = debugNode.getComponent("DebugLayer");
					this.debugModel.OnCreate()
				}
			}
			catch (error) {
				console.error("create debug error:%s", error.stack);
				this.debugModel = null;
			}
		}
		else {
			// console.logManager.IsOpenLog(false);
			this[app.subGameName + "_ShareDefine"].IsDevelopment = 0;
		}

	},

	//启动参数
	InitLaunchParameter: function () {
		let para = "";

		//如果是native版本获取应用启动携带参数
		if (cc.sys.isNative) {
			para = app[app.subGameName + "_NativeManager"]().CallToNative("GetQuery", [], "String");
			if (!para) {
				para = "";
			}
		}
		//如果是H5版本
		else {
			//浏览器信息
			//let navigator = window.navigator;
			//let userAgent = navigator.userAgent;
			let href = window.location.href;
			let index = href.indexOf("?");
			if (index > -1) {
				//"?ddmchannel=dangle&ddmgameid=p1&appId=50059&cpToken=6aacddfec66b4ba2a1728b235d2c5716"
				para = href.substr(index + 1);
			}
		}

		let paraList = [];
		if (para.length) {
			paraList = para.split("&");
		}
		let count = paraList.length;

		for (let index = 0; index < count; index++) {
			let paraInfo = paraList[index];
			let paraDataList = paraInfo.split("=");
			if (paraDataList.length != 2) {
				console.error("InitLaunchParameter paraInfo:%s error", paraInfo);
				continue
			}
			this.startUpInfo[paraDataList[0]] = paraDataList[1];
		}
	},

	//-----------------封包函数-------------------------
	OnPack_LuckDrawReceive: function (serverPack) {
		this.OnEvent("OnChouJiangLingQu", serverPack);
	},
	//心跳包
	OnPack_HeartBeat: function (serverPack) {
		this.lastHearTime = new Date().getTime();
		this.LostHearTime = new Date().getTime();
		if (serverPack.bBeatFlag) {
			app[app.subGameName + "_NetManager"]().SendPack("heartBeat.CHeartBeatHandler", {
				"strBeatMessage": "",
				"lBeatTime": this.lastHearTime,
				"bBeatFlag": true
			}, this.SpeedTest.bind(this), this.SpeedTest.bind(this));
		}
	},
	//网速检测
	SpeedTest: function (serverPack) {
		this.isFaXinTiao = false;
		let yanci = new Date().getTime() - this.lastHearTime;
		this.OnEvent("EvtSpeedTest", {"yanci": yanci});
	},
	//1:账号登录成功
	OnPack_BaseLogin: function (serverPack) {
		console.log("账号登录成功");
		let HeroAccountManager = app[app.subGameName + "_HeroAccountManager"]();
		let accountID = HeroAccountManager.GetAccountProperty("AccountID");
		let nickName = HeroAccountManager.GetAccountProperty("NickName");
		let headImageUrl = HeroAccountManager.GetAccountProperty("HeadImageUrl");
		let sex = HeroAccountManager.GetAccountProperty("Sex");

		app[app.subGameName + "_ServerTimeManager"]().InitLoginData(serverPack);

		let NetManager = app[app.subGameName + "_NetManager"]();

		//连接已经建立,初始化连接的玩家账号ID
		NetManager.InitConnectAccountID(accountID);

		//如果客户端已经有玩家数据了,为重连回包,不需要发送登录封包,只需要同步一次玩家属性,因为有可能变化了属性
		if (app[app.subGameName + "_HeroManager"]().GetHeroID()) {
			console.log("玩家数据已经存在");
			NetManager.SendPack("base.C1005PlayerInfo", {});
		}
		else {
			if (serverPack["isNeedCreateRole"]) {
				console.log("创建新角色");
				NetManager.SendPack("base.C1001CreateRole", {
					"nickName": nickName,
					"sex": sex,
					"headImageUrl": headImageUrl,
					"accountID": accountID
				});
			}
			else {
				console.log("登录已有账号");
				NetManager.SendPack("base.C1006RoleLogin", {"accountID": accountID});
			}
		}

	},
	//服务端随机下发一个游客账号，直接登录就可以
	OnPack_RoleTest: function (serverPack) {
		console.log("发送重新登录请求...");
		app[app.subGameName + "_HeroAccountManager"]().SetAccountProperty("reloginSign", serverPack["sign"]);
		app[app.subGameName + "_NetManager"]().SendPack("base.C1006RoleLogin", {"accountID": serverPack["accountID"]});
	},

	//2:玩家登陆初始化
	OnPack_OnHeroLogin: function (serverPack) {

		try {
			if (this.isAllReadyRelogin) {
				console.log("已经初始化玩家数据，重复初始化导致报错...");
				return;
			}
			this.isAllReadyRelogin = true;
			console.log("初始化玩家数据...");
			let heroID = serverPack["pid"];
			this.gameType = serverPack["currentGameType"];

			app[app.subGameName + "_HeroManager"]().InitLoginData(heroID, serverPack);
			app[app.subGameName + "_ServerTimeManager"]().InitLoginData(serverPack);
			app[app.subGameName + "_HeroAccountManager"]().SetAccountProperty("AccountID", serverPack["accountID"]);
			this.clientState = this[app.subGameName + "_ShareDefine"].State_Logined;
		}
		catch (error) {
			console.error("OnPack_OnHeroLogin(%s):%s", serverPack, error.stack);
			this.clientState = this[app.subGameName + "_ShareDefine"].State_LoginPackFail;
			app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("Code_Login_PackFail");
		}
	},

	OnPack_PlayerInfo: function (serverPack) {
		try {
			let heroID = serverPack["pid"];
			app[app.subGameName + "_HeroManager"]().InitLoginData(heroID, serverPack);
		}
		catch (error) {
			console.error("OnPack_PlayerInfo(%s):%s", serverPack, error.stack);
		}
	},

	//3:请求玩家工会数据
	OnEvent_InitPlayerFamily: function (event) {
		//请求玩家进入的房间ID
		app[app.subGameName + "_GameManager"]().SendGetCurRoomID();
	},
	SetGameType: function (typeStr) {
		if (app.subGameName == typeStr)
			this.gameType = 40;
		else
			this.gameType = -1;
	},
	//4:登录获取玩家当前参与的房间ID
	OnEvent_LoginGetCurRoomID: function (event) {
		let serverPack = event;
		let roomID = serverPack.roomID;
		console.log("登录获取玩家当前参与的房间ID:" + roomID);
		//返回大厅检测下是否有需要处理的数据
		let allSwitchGameData = [];
		let switchGameData = cc.sys.localStorage.getItem("switchGameData");
		if (switchGameData != "") {
			allSwitchGameData.push(JSON.parse(switchGameData));
		}
		let isShowVideo = false;
		for (let i = 0; i < allSwitchGameData.length; i++) {
			if (!allSwitchGameData[i].action) continue;
			console.log("allSwitchGameData[i].action", serverPack);
			let action = allSwitchGameData[i].action;
			switch (action) {
				case 'showForm':
					this.FormManager.ShowForm(allSwitchGameData[i].fromName);
					break;
				case 'showVideo':
					isShowVideo = true;
					app[app.subGameName + "_SceneManager"]().LoadScene(app.subGameName + "VideoScene");
					break;
				default:
					console.log('未知动作: ' + action);
					break;
			}
		}
		if (isShowVideo) {
			//正在播放回放
			return;
		}

		if ('practiceId' in serverPack)
			app[app.subGameName + "_ShareDefine"]().practiceId = serverPack.practiceId;
		if (roomID == 0) {
			//如果启动参数传递房间号，则尝试进入房间
			if (this.startUpInfo['room_id']) {
				let roomKey = this.startUpInfo['room_id'];
				let that = this;
				app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "EnterRoom", {
					"roomKey": roomKey,
					"posID": -1
				}, function () {
				}, function (event) {
					that.OnStartEnterGame("enterMain");
				});
				return;
			}
			this.OnStartEnterGame("enterMain");
			return;
		}
		let that = this;
		//进入万载麻将房间
		app[app.subGameName.toUpperCase() + "RoomMgr"]().SendGetRoomInfo(roomID, function () {
			that.OnStartEnterGame("enterRoom");
		});
	},
	OnEvent_ConnectSuccess: function (event) {
		let serverPack = event;
		let bIsReconnect = serverPack['IsReconnecting'];
		if (bIsReconnect) {
			app[app.subGameName + "_NetManager"]().SendPack("game.CGetGameStatus", {});
		}
	},
	//断线重连状态同步
	OnPack_GetGameStatus: function (serverPack) {
		let isPlayingGame = serverPack['isPlayingGame'];
		this.gameType = serverPack['gameType'];
		let roomID = serverPack['roomID'];
		if (isPlayingGame) {//游戏中
			let event = {};
			event = {};
			event.roomID = roomID;
			this.OnEvent_LoginGetCurRoomID(event);
		}
		else {//跳转大厅
			let SceneManager = app[app.subGameName + "_SceneManager"]();
			let sceneType = SceneManager.GetSceneType();
			//如果已经在登录场景则不切换
			if ((app.subGameName + 'MainScene') != sceneType)
				this.ExitGame();
		}
	},
	OnEvent_ReloadHeroData: function (event) {
		if (cc.sys.isNative) {
			app[app.subGameName + "_NetManager"]().SendPack("game.C1101GetRoomID", {});
		} else {
			this.ExitGame();
		}
	},
	//开始进入游戏
	OnStartEnterGame: function (eventName) {
		this.clientState = this[app.subGameName + "_ShareDefine"].State_Logined;

		if (eventName == "enterMain") {
			//进入主场景
			console.log("进入主场景");
			this.ExitGame();
		}

		this.OnEvent("PlayerLoginOK", {});
	},

	//被ti
	OnPack_Kickout: function (serverPack) {
		let kickOutType = serverPack["type"];

		if (kickOutType == 2) {
			this.LogOutGame(-1);
		}
		else {
			console.error("OnPack_Kickout kickOutType:%s not find", kickOutType);
		}
	},

	//提醒玩家在线时长
	OnPack_Online: function (serverPack) {
		app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("MSG_TIME_ONLINE", [serverPack.onlineHour]);
	},

	//-----------------回调函数-------------------------


	//native平台回调
	OnNativeNotify: function (eventType, eventDataString) {
		try {
			let dataDict = JSON.parse(eventDataString);
			if (eventType == "wechat") { //微信登录
				app[app.subGameName + "_WeChatAppManager"]().OnNativeNotifyWXLogin(dataDict);
			} else if (eventType == "wechatShare") {  //微信分享
				app[app.subGameName + "_WeChatAppManager"]().OnNativeNotifyWXShare(dataDict);
			} else if (eventType == "wechatPay") { //微信支付
				app[app.subGameName + "_WeChatAppManager"]().OnNativeNotifyWXPay(dataDict);
			} else if (eventType == "onBatteryLevel") { //电量回掉
				this.OnEvent("EvtBatteryLevel", {"Level": dataDict["Level"], "status": dataDict["status"]});
			} else if (eventType == "apkProess") { //下载apk进度
				this.OnEvent("LoadApkProess", {"progress": dataDict["proess"]});
			} else if (eventType == "download") { //下载
				app[app.subGameName + "_DownLoadMgr"]().OnDownLoadEvent(dataDict);
			} else if (eventType == "palyAudioFinsh") { //播放完成
				this.OnEvent("palyAudioFinsh", {});
			} else if (eventType == "AudioError") {//录音失败
				this.OnEvent("AudioError", {});
			} else if (eventType == "AudioStopError") {//录音失败
				this.OnEvent("AudioStopError", {});
			} else if (eventType == "MedioRecordError") {//播放失败
				this.OnEvent("MedioRecordError", {});
			} else if (eventType == "wellPrepared") {//准备录音
				this.OnEvent("wellPrepared", {});
			} else if (eventType == "RecordAudioFinsh") { //录音完成
				this.OnEvent("RECORDAUDIOFINSH", {});
			} else if (eventType == "GETLOCATION") { //获取定位
				app[app.subGameName + "_LocationOnStartMgr"]().OnGetLocationCallBack(dataDict);
			} else if (eventType == "copyText") { //获取定位
				this.OnEvent("OnCopyTextNtf", dataDict);
			} else if (eventType == "DDShare") {
				this.OnEvent("OnDDShare", dataDict);
			} else if (eventType == "XLShare") {
				this.OnEvent("OnXLShare", dataDict);
			} else {
				console.error("OnNativeNotify not find eventType:%s", eventType);
			}
		}
		catch (error) {
			if (eventType == 'wechatShare') {
				//还是给分享成功回调
				app[app.subGameName + "_WeChatAppManager"]().OnNativeNotifyWXShare({"ErrCode": 0});
			} else {
				console.error("OnNativeNotify(%s,%s) error(%s), error.stack:%s", eventType, eventDataString, error, error.stack);
			}
		}
	},


	// 每帧回掉
	update: function (dt) {

		//if(this.clientState < this[app.subGameName + "_ShareDefine"].State_WaitLogin){
		//	return
		//}
		//
		//let nowTick = new Date().getTime();
		//
		//if(nowTick >= this.nextTick){
		//	this.nextTick = nowTick + 1000;
		//}
	},

	//100毫秒回掉
	OnTimer: function (passSecond) {
		try {
			if (this.isWriteLog) {
				console.logSecond += passSecond;
				//500毫秒输出一次log
				if (console.logSecond >= 0.5) {
					// console.logManager.OutPutLog();
					console.logSecond = 0
				}
			}
			if (this.clientState < this[app.subGameName + "_ShareDefine"].State_WaitLogin) {
				return
			}

			app[app.subGameName + "_SceneManager"]().OnTimer(passSecond);

			//完整登录才能调用
			if (this.clientState == this[app.subGameName + "_ShareDefine"].State_Logined) {
				let curTime = new Date().getTime();

				if (this.lastHearTime && curTime > this.lastHearTime + 23000) {
					console.error('NetWork Disconnect By Heart');
					this.lastHearTime = 0;
					if (app[app.subGameName + "_NetWork"]().isConnectIng)//ios的可能websoket不会主动断开
						app[app.subGameName + "_NetManager"]().Disconnect();

					if (!this.bStartReConnect) {
						this.StartReConnect();
						app[app.subGameName + "_NetWork"]().ReConnectByTipSureBtn();
					}
				}
				if (this.bStartReConnect) {
					if (this.lastReConnectTime && curTime > this.lastReConnectTime + 1000) {
						this.lastReConnectTime = curTime;
						this.reConnectUseTime++;
						this.reConnectLable.string = '连接失败,重新加载中(' + this.reConnectUseTime + '秒)' + '...';
					}
				}
			}
		}
		catch (error) {
			console.error("OnTimer:%s", error.stack);
		}
	},

	StartTimer: function () {
		this.schedule(this.OnTimer, 1);
	},
	StopTimer: function () {
		this.unschedule(this.OnTimer);
	},

	OnEventHide: function () {
		let curRunGame = cc.sys.localStorage.getItem("curRunGame");
		if (curRunGame != app.subGameName) {
			console.log("当前游戏在 " + curRunGame + ",无需监听OnEventHide事件");
			return;
		}
		this.StopTimer();
		if (this.clientState < this[app.subGameName + "_ShareDefine"].State_WaitLogin) {
			return
		}

		try {
			app[app.subGameName + "_SceneManager"]().OnEventHide();
		}
		catch (error) {
			console.error("OnEventHide error:%s", error.stack);
		}
	},

	OnEventShow: function () {
		let curRunGame = cc.sys.localStorage.getItem("curRunGame");
		if (curRunGame != app.subGameName) {
			console.log("当前游戏在 " + curRunGame + ",无需监听OnEventShow事件");
			return;
		}
		this.StopTimer();
		if (this.clientState < this[app.subGameName + "_ShareDefine"].State_WaitLogin) {
			return
		}
		try {
			let curTime = new Date().getTime();
			console.log("LostHearTime == " + this.LostHearTime + ",curTime == " + curTime);
			if (this.LostHearTime && curTime > this.LostHearTime + 55000) {
				this.lastHearTime = 0;
				// console.log("后台切回来大厅 3");
				if (app[app.subGameName + "_NetWork"]().isConnectIng) {//ios的可能websoket不会主动断开
					console.log("后台切回来，先断开连接");
					app[app.subGameName + "_NetManager"]().Disconnect();
				}
				if (!this.bStartReConnect) {
					console.log("后台切回来，发起断线重连");
					this.StartReConnect();
					app[app.subGameName + "_NetWork"]().ReConnectByTipSureBtn();
				}
			}
			app[app.subGameName + "_SceneManager"]().OnEventShow(this.bStartReConnect);
			this.scheduleOnce(function () {
				this.StartTimer();
			}, 2);
		}
		catch (error) {
			console.error("OnEventShow error:%s", error.stack);
		}
	},

	//初始化客户端访问路径和app版本号
	OnInitClientData: function (clientPath, appVersion) {
		this.clientState = this[app.subGameName + "_ShareDefine"].State_InitSuccess;
	},

	//客户端初始化成功回调
	OnInitClientFinish: function (allTableDataDict, clientConfig) {
		try {
			this.clientConfig = clientConfig;

			console.log("ClietManage clientConfig:", this.clientConfig);
			this.RefreshClientConfig();

			if (this.debugModel) {
				this.debugModel.OnInitClientFinish();
			}
			else {
				let debug = this.clientConfig["debug"];

				//如果服务器下发debug
				if (debug && this.CheckDebugSign(debug)) {
					this.InitDebug(true);
					this.debugModel.OnInitClientFinish();
				}
			}

			if (this.clientState != this[app.subGameName + "_ShareDefine"].State_InitSuccess) {
				console.log("OnInitClientFinish 初始化异常");
				return
			}

			if (!this.InitModel()) {
				console.log("OnInitClientFinish InitModel fail");
				return
			}

			if (!this.InitTable(allTableDataDict)) {
				console.log("OnInitClientFinish InitTable fail");
				return
			}

			//初始化客户端所有管理器
			if (!this.InitManager()) {
				console.log("OnInitClientFinish InitManager fail");
				return
			}

			//强制CG一次,否则内存一直会占用不释放
			// cc.sys.garbageCollect();

			//输出运行环境信息
			cc.sys.dump();

		}
		catch (e) {
			console.error("InitUpdateFinish:%s", e.stack);
		}
	},

	LoadLogin: function () {
		this.ClientLoginProcess();
		app[app.subGameName + "_WeChatManager"]().SendRequestWeChatSDKIntSign();
	},

	//刷新客户端启动配置字典
	RefreshClientConfig: function () {
		console.log("ClientManageer this.clientConfig:", this.clientConfig);
		let dbGameServerInfo = this.LocalDataManager.GetConfigProperty("DebugInfo", "GameServerInfo");
		let dbAccountServerInfo = this.LocalDataManager.GetConfigProperty("DebugInfo", "AccountServerInfo");
		let dbOrderServerInfo = this.LocalDataManager.GetConfigProperty("DebugInfo", "OrderServerInfo");
		let dbResServerInfo = this.LocalDataManager.GetConfigProperty("DebugInfo", "ResServerInfo");

		if (dbGameServerInfo) {
			let gameServerIP = dbGameServerInfo["GameServerIP"];
			let gameServerPort = dbGameServerInfo["GameServerPort"];

			if (gameServerIP && gameServerPort) {
				this.clientConfig["GameServerIP"] = gameServerIP;
				this.clientConfig["GameServerPort"] = gameServerPort;
			}
		}

		if (dbAccountServerInfo) {
			let accountServerIP = dbAccountServerInfo["AccountServerIP"];
			let accountServerPort = dbAccountServerInfo["AccountServerPort"];

			if (accountServerIP && accountServerPort) {
				this.clientConfig["AccountServerIP"] = accountServerIP;
				this.clientConfig["AccountServerPort"] = accountServerPort;
			}
		}

		if (dbOrderServerInfo) {
			let orderServerIP = dbOrderServerInfo["OrderServerIP"];
			let orderServerPort = dbOrderServerInfo["OrderServerPort"];

			if (orderServerIP && orderServerPort) {
				this.clientConfig["OrderServerIP"] = orderServerIP;
				this.clientConfig["OrderServerPort"] = orderServerPort;
			}
		}

		if (dbResServerInfo) {
			let resServerIP = dbResServerInfo["ResServerIP"];
			let resServerPort = dbResServerInfo["ResServerPort"];

			if (resServerIP && resServerPort) {
				this.clientConfig["ResServerIP"] = resServerIP;
				this.clientConfig["ResServerPort"] = resServerPort;
			}
		}

		//如果是H5连接启动,使用的账号和支付方式，需要重置一次
		//H5使用的账号授权SDK和支付SDK 又配置的连接携带的参数决定,不是由配置决定
		//公众号标示也有启动参数决定,不是由配置决定
		console.log("RefreshClientConfig cc.sys.isNative", cc.sys.isNative);
		if (cc.sys.isNative) {
			//判断使用SDK授权,支付SDK,枚举是否存在
			let accountType = this.clientConfig["AccountType"];
			let orderType = this.clientConfig["OrderType"];
			if (!this[app.subGameName + "_ShareDefine"].AccountSDKTypeNameDict.hasOwnProperty(accountType)) {
				console.log("AccountSDKTypeNameDict not find :%s", accountType);
				this.clientConfig["AccountType"] = this[app.subGameName + "_ShareDefine"].SDKType_Company;
			}

			if (!this[app.subGameName + "_ShareDefine"].OrderSDKTypeNameDict.hasOwnProperty(orderType)) {
				console.log("OrderSDKTypeNameDict not find :%s", orderType);
				this.clientConfig["OrderType"] = this[app.subGameName + "_ShareDefine"].OrderType_Company;
			}
		}
		else {

			let ddmchannel = this.startUpInfo["ddmchannel"];
			let ddmmp = this.startUpInfo["ddmmp"];

			this.clientConfig["Channel"] = ddmchannel;

			if (ddmchannel == "website") {
				this.clientConfig["AccountType"] = this[app.subGameName + "_ShareDefine"].SDKType_Company;
				this.clientConfig["OrderType"] = this[app.subGameName + "_ShareDefine"].OrderType_Company;
				this.clientConfig["MPID"] = "";
			}
			else if (ddmchannel == "wechat") {
				this.clientConfig["AccountType"] = this[app.subGameName + "_ShareDefine"].SDKType_WeChat;
				this.clientConfig["OrderType"] = this[app.subGameName + "_ShareDefine"].OrderType_Wechat;
				this.clientConfig["MPID"] = ddmmp;
			}
			//可能是本机调试启动
			else if (!this.startUpInfo.hasOwnProperty("ddmchannel")) {
				console.log("webdebug ddmchannel:%s ", ddmchannel);
				this.clientConfig["AccountType"] = this[app.subGameName + "_ShareDefine"].SDKType_Company;
				this.clientConfig["OrderType"] = this[app.subGameName + "_ShareDefine"].OrderType_Company;
				this.clientConfig["MPID"] = "";
			}
			else {
				console.error("ddmchannel:%s error", ddmchannel);
				this.clientConfig["AccountType"] = this[app.subGameName + "_ShareDefine"].SDKType_Company;
				this.clientConfig["OrderType"] = this[app.subGameName + "_ShareDefine"].OrderType_Company;
				this.clientConfig["MPID"] = "";
			}
		}

	},

	//初始化模块
	InitModel: function () {
		let modelName = "";
		try {
			let NeedCreateList = app.NeedCreateList;
			let count = NeedCreateList.length;
			for (let index = 0; index < count; index++) {
				modelName = NeedCreateList[index];
				//设置所有单例引用接口到app
				app[modelName] = require(modelName).GetModel;
			}
		}
		catch (error) {
			console.error("OnLoad require(%s) error:%s", modelName, error.stack);
			return false
		}

		return true;
	},

	//初始化表数据
	InitTable: function (allTableDataDict) {

		let SysDataManager = app[app.subGameName + "_SysDataManager"]();

		let allTableNameList = Object.keys(allTableDataDict);
		let count = allTableNameList.length;
		for (let index = 0; index < count; index++) {
			let tableName = allTableNameList[index];
			let tableInfo = allTableDataDict[tableName];
			SysDataManager.OnLoadTableEnd(tableName, tableInfo["KeyNameList"], tableInfo["Data"]);
		}

		return true
	},

	//初始化管理器
	InitManager: function () {

		//实例化所有单例管理器
		let NeedCreateList = app.NeedCreateList;
		let count = NeedCreateList.length;

		let modelName = "";
		try {
			for (let index = 0; index < count; index++) {
				console.log(app.subGameName + " InitManager", modelName)
				modelName = NeedCreateList[index];
				require(modelName).GetModel()
			}
		}
		catch (error) {
			console.error("InitManager(%s) error:%s", modelName, error.stack);
			return false
		}
		//追加调试全局入口
		if (window) {
			window["app"] = app;
		}

		let NetManager = app[app.subGameName + "_NetManager"]();
		let startUrl = "";
		//初始化资源服务器地址
		if (window.location) {
			startUrl = window.location.origin;
		}
		NetManager.SetH5ClientStartUrl(startUrl);

		//封包注册
		//封包事件注册

		//心跳
		NetManager.RegNetPack("SPlayerHeartBeat", this.OnPack_HeartBeat, this);
		NetManager.RegNetPack("base.C1111RoleReLogin", this.OnPack_RoleTest, this);
		NetManager.RegNetPack("base.C1004Login", this.OnPack_BaseLogin, this);
		NetManager.RegNetPack("base.C1006RoleLogin", this.OnPack_OnHeroLogin, this);
		NetManager.RegNetPack("base.C1001CreateRole", this.OnPack_OnHeroLogin, this);
		NetManager.RegNetPack("base.C1005PlayerInfo", this.OnPack_PlayerInfo, this);
		NetManager.RegNetPack("kickout", this.OnPack_Kickout, this);
		NetManager.RegNetPack("SPlayer_OnlineTime", this.OnPack_Online, this);
		//断线重连状态
		NetManager.RegNetPack("game.CGetGameStatus", this.OnPack_GetGameStatus, this);
		//玩家点击继续
		NetManager.RegNetPack("SPlayer_Continue", this.OnEvent_SPlayerContinue, this);
		//抽奖奖品领取通知
		NetManager.RegNetPack("SPlayer_LuckDrawReceive", this.OnPack_LuckDrawReceive, this);

		this.RegEvent("InitPlayerFamily", this.OnEvent_InitPlayerFamily, this);
		this.RegEvent("LoginGetCurRoomID", this.OnEvent_LoginGetCurRoomID, this);
		//链接服务器成功并且重新初始化玩家数据
		app[app.subGameName + "Client"].RegEvent("ReloadHeroData", this.OnEvent_ReloadHeroData, this);
		//断线重连成功通知
		app[app.subGameName + "Client"].RegEvent(app.subGameName + "_ConnectSuccess", this.OnEvent_ConnectSuccess, this);
		//初始化管理器完成调用一次sdk初始化接口(h5游戏客户端需要初始化携带的sdk参数:token)
		console.log("InitManager this.startUpInfo:", this.startUpInfo);
		app[app.subGameName + "_SDKManager"]().InitSDKParameter(this.startUpInfo);

		return true;

	},

	//---------------------客户端事件分发接口-----------------------------
	//客户端封包事件
	OnEvent: function (eventName, argDict) {
		// if(argDict){
		// console.log("客户端事件分发 OnEvent:" + eventName + "," + argDict);
		// }
		// else{
		//     console.log("客户端事件分发 OnEvent:" + eventName);
		// }

		try {
			let curRunGame = cc.sys.localStorage.getItem("curRunGame");
			if (curRunGame != app.subGameName) {
				console.log("当前游戏在 " + curRunGame + ",无需分发事件");
				return
			}
			this.node.emit(eventName, argDict);
		}
		catch (error) {
			console.error("子游戏事件分发 OnEvent:%s", error.stack);
		}
	},
	OnEvent_SPlayerContinue: function (serverPack) {
		let roomKey = serverPack.roomKey;
		let userName = serverPack.shortPlayer.name;
		let paymentRoomCardType = serverPack.paymentRoomCardType;
		app[app.subGameName + "_FormManager"]().ShowForm('UIJoinMessage', roomKey, userName, paymentRoomCardType);
	},

	//注册封包事件
	RegEvent: function (eventName, func, target) {
		if (!func || !target) {
			console.error("eventName:%s error", eventName);
			return
		}
		this.node.on(eventName, func, target);
	},

	//取消注册封包事件
	UnRegTargetEvent: function (target, eventName = "", func = "") {
		if (!this.node) {
			//节点已经被销毁了
			return;
		}
		//如果有制定注销事件
		if (eventName && func) {
			this.node.off(eventName, func, target);
		}
		else {
			this.node.targetOff(target);
		}
	},

	//键盘按下
	OnKeyDown: function (event) {
		let keyCode = event.keyCode;
		switch (keyCode) {
			case cc.KEY.back: {
				let msgID = "MSG_EXIT_GAME";
				let ConfirmManager = app[app.subGameName + "_ConfirmManager"]();
				ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, []);
				ConfirmManager.ShowConfirm(this[app.subGameName + "_ShareDefine"].Confirm, msgID, []);
				break;
			}
		}
		this.OnEvent("OnKeyDown", {"KeyCode": keyCode});
	},
	OnConFirm: function (clickType, msgID, backArgList) {
		if ('Sure' == clickType) {
			if ('MSG_EXIT_GAME' == msgID)
				cc.game.end();
		}
	},
	//----------------逻辑函数----------------------
	//客户端是否登录封包完成
	IsClientLoginOK: function () {
		return this.clientState == this[app.subGameName + "_ShareDefine"].State_Logined;
	},

	SetClientState: function (clientState) {
		this.clientState = clientState;
	},

	//退出游戏到登录界面
	LogOutGame: function (code = 0) {
		console.log('LogOutGame');
		if (-1 == code) {

		} else if (-2 == code) {
			app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("Kick_ByServer");
		}
		
		app.LocalDataManager().SetConfigProperty("Account", "AccessTokenInfo", {});
		this.ClientLoginProcess();
	},

	/**
	 * 退到客户端登录场景,客户端初始化s
	 */
	ClientLoginProcess: function () {

		let SceneManager = app[app.subGameName + "_SceneManager"]();

		let sceneType = SceneManager.GetSceneType();

		//如果已经在登录场景则不切换
		if (sceneType == "loginScene") {
			if (!SceneManager.GetSceneComponent()) {
				console.warn("ClientLoginProcess not sceneName");
				return
			}
			SceneManager.GetSceneComponent().OnTopEvent("Close");
		}
		//如果不在登录场景，则切换到登录场景，
		else {

			this.ClearClientData();
			SceneManager.LoadScene(app.subGameName + "LoginScene");
		}

	},

	//清理管理器数据
	ClearClientData: function () {
		app.LocalDataManager().OnReload();
		//----客户端基础管理器---
		app[app.subGameName + "_NetManager"]().OnReload();
		app[app.subGameName + "_SceneManager"]().OnReload();
		app[app.subGameName + "_SDKManager"]().OnReload();

		//----数据管理器-------
		app[app.subGameName + "_HeroManager"]().OnReload();

		app[app.subGameName + "_GameManager"]().OnReload();


		this.clientState = this[app.subGameName + "_ShareDefine"].State_WaitLogin;
	},


	//检测Debug签名
	CheckDebugSign: function (debugSign) {
		//生成签名
		let argDict = {
			"gameID": "p7",
			"gameType": "h5",
			"nonceStr": "18320c805fb57d88805d3918cdd1b2a3",
		};
		let argKeyList = Object.keys(argDict);
		argKeyList.sort();
		let keyCount = argKeyList.length;
		let signString = "";
		for (let index = 0; index < keyCount; index++) {
			let keyName = argKeyList[index];
			signString += [keyName, "=", argDict[keyName], "&"].join("");
		}
		signString += "ddmh5.com";
		let sign = app.MD5.hex_md5(signString);
		if (sign == debugSign) {
			return true
		}
		return false
	},

	//--------------全局缓存---------------

	//获取全局缓存的bebug节点
	GetDebugModel: function () {
		return this.debugModel;
	},
	MultiPoint:function(serverIP){
		if(serverIP==""){
			return "";
		}
		if(app[app.subGameName + "Client"].GetClientConfigProperty("IsGaoFang")==0){
			//不接入高防
			return serverIP;
		}
		let AccessPoint=app.LocalDataManager().GetConfigProperty("Account", "AccessPoint");
		if(AccessPoint>0){
			if(AccessPoint==1){
				return 'line1.'+serverIP;
			}else if(AccessPoint==2){
				return 'line2.'+serverIP;
			}else if(AccessPoint==3){
				return 'line3.'+serverIP;
			}
		}

		let AccountActive = app.LocalDataManager().GetConfigProperty("Account", "AccountActive");
		//如果该城市有独立节点，则调用本城市自己的节点
		let myCityID = cc.sys.localStorage.getItem("myCityID");
		if(myCityID){
			let CityPoints=app[app.subGameName + "Client"].GetClientConfigProperty("CityPoints");
			if(CityPoints){
				let CityPointsList=CityPoints.split(',');
				if(CityPointsList.indexOf(myCityID)>-1){
					//用户选择的城市有配置独立的节点
					if(AccountActive>10){
						return 'h'+myCityID+'.'+serverIP; //活跃用户
					}else{
						return 'c'+myCityID+'.'+serverIP; //普通用户
					}
				}
			}
		}
		if(AccountActive>100){
			serverIP='a100.'+serverIP;
		}else if(AccountActive>50){
			serverIP='i50.'+serverIP;
		}else if(AccountActive>10){
			serverIP='x10.'+serverIP;
		}


		return serverIP;
	},
	//获取客户端启动配置
	GetClientConfig: function () {
		let clientConfig = [];
		let mt = ["GateServerIP", "GameServerIP", "AccountServerIP", "OrderServerIP", "ResServerIP"];
		for (var key in this.clientConfig) {
			if (mt.InArray(key)) {
				clientConfig[key] = this.MultiPoint(this.clientConfig[key]);
			} else {
				clientConfig[key] = this.clientConfig[key];
			}
		}
		return clientConfig;
	},

	//获取客户端启动配置属性值
	GetClientConfigProperty: function (property) {
		let mt = ["GateServerIP", "GameServerIP", "AccountServerIP", "OrderServerIP", "ResServerIP"];
		if (this.clientConfig.hasOwnProperty(property)) {
			if (mt.InArray(property)) {
				return this.MultiPoint(this.clientConfig[property]);
			} else {
				return this.clientConfig[property];
			}
		}
		else {
			console.error("GetClientConfigProperty not find :%s", property);
			return 0
		}
	},

	//获取启动属性值
	GetStartUpProperty: function (property) {
		if (!this.startUpInfo.hasOwnProperty(property)) {
			return
		}
		return this.startUpInfo[property];
	},

	GetGlobalEffectNode: function (effectName) {
		let effectNode = this.node.getChildByName('globalEffect').getChildByName(effectName);
		if (!effectNode) {
			console.error("GetGlobalEffectNode(%s) not find", effectName);
			return
		}
		effectNode.removeFromParent(false);
		return effectNode
	},

	PushGlobalEffectNode: function (effectNode) {
		effectNode.removeFromParent(false);
		this.node.getChildByName('globalEffect').addChild(effectNode);
	},

	GetIsFirstLogin: function () {
		return this.isFirstLogin
	},

	SetFirstLogin: function () {
		this.isFirstLogin = false;
	},

	StartReConnect: function () {
		if (this.bStartReConnect)
			return;
		this.bStartReConnect = true;
		this.reConnectUseTime = 0;
		this.reConnectLable.string = '连接失败,重新加载中(1秒)...';
		this.lastReConnectTime = new Date().getTime();
		this.reConnectTip.active = true;
	},
	CloseReConnectTip: function () {
		this.bStartReConnect = false;
		this.lastReConnectTime = 0;
		this.reConnectUseTime = 0;
		this.reConnectLable.string = '';
		this.reConnectTip.active = false;
	},

	//取消常驻节点，以便重新加载游戏
	RemoveClientManager: function () {
		cc.game.removePersistRootNode(this.node);
		//清理已经加载的界面
		app[app.subGameName + "_FormManager"]().loadFormDict = {};
		app[app.subGameName + "_FormManager"]().showFormDict = {};
		app[app.subGameName + "_FormManager"]().createingFormDict = {};
		app[app.subGameName + "_FormManager"]().formWndShowInfo = {};
		app[app.subGameName + "_FormManager"]().defaultFormNameList = [];
		//释放已经加载的资源
		this[app.subGameName + "_ControlManager"].ReleaseAllRes();
		//清除注册事件
		this.UnRegTargetEvent(this);
		// app[app.subGameName + "_NetManager"]().UnAllRegNetPack();
		let baseForm = require(app.subGameName + "_BaseForm");
		baseForm._eventFuncDict = {};
		this.node.destroy();
	},
	
	isInGame:function(){
		let curRunGame = cc.sys.localStorage.getItem("curRunGame");
        if (curRunGame!= app.subGameName) {
        	return false;
        }
        return true;
	},
	ExitGame:function(switchGameData = null) {
		cc.game.off(cc.game.EVENT_HIDE);
		cc.game.off(cc.game.EVENT_SHOW);
		console.trace("退出游戏")
		if (!cc.sys.isNative) {
			app[app.subGameName + "_SceneManager"]().LoadScene(app.subGameName + "MainScene");
			return;
		}
		//联盟/亲友圈房间返回联盟/亲友圈房间列表
		let roomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
		if (roomMgr) {
			if (roomMgr.clubId > 0 || roomMgr.unionId > 0) {
				switchGameData = {action: "openClub"};
			}
		}
		if (switchGameData != null) {
			// let testData = {action:"showForm", fromName:"UIStore"};
			cc.sys.localStorage.setItem("switchGameData", JSON.stringify(switchGameData));
		}
		//如果是游戏切换需要释放内存，重新加载
		this.RemoveClientManager();
		let curRunHall = cc.sys.localStorage.getItem("curRunHall");
		app[app.subGameName + "_NetManager"]().SendPack("base.C1110UUID", {"gameName": "hall"}, function (event) {
			app.LocalDataManager().SetConfigProperty("Account", "uuid", event);
			//停止场景音乐
			app[app.subGameName + "_SoundManager"]().StopAllSound();
			//主动断开socket连接，服务端会将玩家踢出
			if (app[app.subGameName + "_NetWork"]().isConnectIng) {
				console.log("获取uuid成功，断开连接");
				app[app.subGameName + "_NetManager"]().Disconnect(true);
			}
			let gamePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + "ALLGame/" + app.subGameName;
			window.require(gamePath + "/src/hall.js");
		}, function (error) {
			console.log("获取uuid失败");
		});
	},
});

module.exports = nn_ClientManager;