"use strict";
cc._RF.push(module, 'a1bb3i6Sw5NS4ZnujEF4LnI', 'ClientManager');
// script/ClientManager.js

'use strict';

/*
    客户端初始化管理类(该组件节点不会被释放)
*/

var app = require("app");
var SubgameManager = require('SubgameManager');
require('hall_NativeNotify');
cc.Class({

	extends: require("BaseComponent"),

	properties: {
		globalEffect: cc.Node,
		reConnectTip: cc.Node
	},
	// 加载JS主入口
	OnLoad: function OnLoad() {
		console.log("-----大厅 ClientManager OnLoad-----");

		this.JS_Name = "ClientManager";

		this.logSecond = 0;
		this.allGameIdFormServer = [];
		//是否需要写log
		this.isWriteLog = cc.sys.isNative;

		//保证客户端管理器不被释放
		cc.game.addPersistRootNode(this.node);

		this.StartTimer();

		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.OnKeyDown, this);

		//把Client存放到App上
		app["Client"] = this;

		//枚举管理器
		var ShareDefineModel = require("ShareDefine").GetModel;
		app["ShareDefine"] = ShareDefineModel;
		this.ShareDefine = ShareDefineModel();

		//HootManager模块等级最高
		var HootManagerModel = require("HootManager").GetModel;
		app["HootManager"] = HootManagerModel;
		this.HootManager = HootManagerModel();

		//注册log模块
		var LogManagerModel = require("LogManager").GetModel;
		app["LogManager"] = LogManagerModel;
		this.LogManager = LogManagerModel();

		//工具模块
		var ComToolModel = require("ComTool").GetModel;
		app["ComTool"] = ComToolModel;
		this.ComTool = ComToolModel();

		//加载控制器
		var ControlManagerModel = require("ControlManager").GetModel;
		app["ControlManager"] = ControlManagerModel;
		this.ControlManager = ControlManagerModel();
		this.ControlManager.Init();

		//检测是否可以使用localStorage,有的浏览器没有
		var localStorage = cc.sys.localStorage;
		localStorage.setItem("testStorage", "1");
		var testData = localStorage.getItem("testStorage");
		if (testData) {
			cc.sys.localStorage.CanUse = 1;
			localStorage.removeItem("testStorage");
		} else {
			cc.sys.localStorage.CanUse = 0;
			this.ErrLog("cant use sys.localStorage");
		}

		//本地数据管理器
		var LocalDataManagerModel = require("LocalDataManager").GetModel;
		app["LocalDataManager"] = LocalDataManagerModel;
		this.LocalDataManager = LocalDataManagerModel();

		//js调用native平台接口管理器(启动需要获取客户端app启动携带参数)
		var NativeManagerModel = require("NativeManager").GetModel;
		app["NativeManager"] = NativeManagerModel;
		this.NativeManager = NativeManagerModel();

		//客户端初始化
		this.clientState = this.ShareDefine.State_Prepare;

		//定时器下次执行时间
		this.nextTick = 0;

		//心跳
		this.lastHearTime = 0;
		this.LostHearTime = 0;
		this.isFirstLogin = true;
		this.debugModel = null;
		//启动携带参数
		this.startUpInfo = {};

		//客户端配置字典
		this.clientConfig = {};

		this.gameType = -1;
		//检测是否正在进游戏，2秒检测一次，防止用户重复点击导致检测更新失败
		this.tryEnterGame = false;

		this.InitLaunchParameter();

		//this.loadapkpro = 0.0f;
		//重连计时
		this.lastReConnectTime = 0;
		this.reConnectUseTime = 0;
		this.bStartReConnect = false;
		this.reConnectLable = this.reConnectTip.getChildByName('sp_info').getChildByName('lb_info').getComponent(cc.Label);
		this.RegAllEvent();
		var version = cc.sys.localStorage.getItem('version');
		if (version == null || typeof version == "undefined") {
			version = app.NativeManager().CallToNative("getVersion", [], "String");
			cc.sys.localStorage.setItem('version', version);
		}
		if (version) {
			app["version"] = version;
		}

		this.gameInfo = {};
	},

	//debug初始化
	InitDebug: function InitDebug(isDebug) {

		if (isDebug) {
			this.LogManager.IsOpenLog(true);
			this.ShareDefine.IsDevelopment = 1;
			try {
				if (this.debugPrefab && !this.debugModel) {
					var debugNode = cc.instantiate(this.debugPrefab);
					this.debugModel = debugNode.getComponent("DebugLayer");
					this.debugModel.OnCreate();
				}
			} catch (error) {
				this.ErrLog("create debug error:%s", error.stack);
				this.debugModel = null;
			}
		} else {
			this.LogManager.IsOpenLog(false);
			this.ShareDefine.IsDevelopment = 0;
		}
	},

	//启动参数
	InitLaunchParameter: function InitLaunchParameter() {
		var para = "";

		//如果是native版本获取应用启动携带参数
		if (cc.sys.isNative) {
			para = app.NativeManager().CallToNative("GetQuery", [], "String");
			if (!para) {
				para = "";
			}
		}
		//如果是H5版本
		else {
				//浏览器信息
				//let navigator = window.navigator;
				//let userAgent = navigator.userAgent;
				var href = window.location.href;
				var index = href.indexOf("?");
				if (index > -1) {
					//"?ddmchannel=dangle&ddmgameid=p1&appId=50059&cpToken=6aacddfec66b4ba2a1728b235d2c5716"
					para = href.substr(index + 1);
				}
			}

		var paraList = [];
		if (para.length) {
			paraList = para.split("&");
		}
		var count = paraList.length;

		for (var _index = 0; _index < count; _index++) {
			var paraInfo = paraList[_index];
			var paraDataList = paraInfo.split("=");
			if (paraDataList.length != 2) {
				this.ErrLog("InitLaunchParameter paraInfo:%s error", paraInfo);
				continue;
			}
			this.startUpInfo[paraDataList[0]] = paraDataList[1];
		}

		this.SysLog("InitLaunchParameter:", this.startUpInfo);
	},

	//-----------------封包函数-------------------------
	OnPack_LuckDrawReceive: function OnPack_LuckDrawReceive(serverPack) {
		this.OnEvent("OnChouJiangLingQu", serverPack);
	},
	//心跳包
	OnPack_HeartBeat: function OnPack_HeartBeat(serverPack) {
		this.lastHearTime = new Date().getTime();
		this.LostHearTime = new Date().getTime();
		console.log("OnPack_HeartBeat:" + this.lastHearTime);
		if (serverPack.bBeatFlag) {
			app.NetManager().SendPack("heartBeat.CHeartBeatHandler", {
				"strBeatMessage": "",
				"lBeatTime": this.lastHearTime,
				"bBeatFlag": true
			}, this.SpeedTest.bind(this), this.SpeedTest.bind(this));
		}
	},
	//网速检测
	SpeedTest: function SpeedTest(serverPack) {
		var yanci = new Date().getTime() - this.lastHearTime;
		this.OnEvent("EvtSpeedTest", { "yanci": yanci });
	},
	//从子游戏切换回大厅，重新登录
	OnPack_RoleTest: function OnPack_RoleTest(serverPack) {
		console.log("发送重新登录请求...");
		app.HeroAccountManager().SetAccountProperty("reloginSign", serverPack["sign"]);
		app.NetManager().SendPack("base.C1006RoleLogin", { "accountID": serverPack["accountID"] });
		this.RunSwitchGameAction();
		this.RunRecordAction();
		app.SceneManager().LoadScene("mainScene");
	},
	RunSwitchGameAction: function RunSwitchGameAction() {
		console.log("RunSwitchGameAction 111");
		//返回大厅检测下是否有需要处理的数据
		// let allSwitchGameData = app.PlayerDataManager().GetSwitchGameData();
		var allSwitchGameData = [];
		var switchGameData = cc.sys.localStorage.getItem("switchGameData");
		if (switchGameData != "") {
			allSwitchGameData.push(JSON.parse(switchGameData));
		}
		for (var i = 0; i < allSwitchGameData.length; i++) {
			if (!allSwitchGameData[i]) return;
			var action = allSwitchGameData[i].action;
			switch (action) {
				case 'showForm':
					app.FormManager().ShowForm(allSwitchGameData[i].fromName);
					break;
				case 'openClub':
					// app.FormManager().AddDefaultFormName("ui/club/UIClubMain");
					var lastClubData = app.ClubManager().GetLastClubData();
					if (lastClubData != null) {
						var sendPack = {};
						sendPack.clubId = lastClubData.club_data.id;
						app.NetManager().SendPack("union.CUnionGetSkinInfo", sendPack, function (serverPack) {
							// app.ClubManager().AddDefaultClubFrom(serverPack.skinType);
							app.ClubManager().ShowClubFrom(serverPack.skinType);
						}, function () {});
					}
					break;
				default:
					console.log('未知动作: ' + action);
					break;
			}
		}
		app.PlayerDataManager().ClearSwitchGameData();
		cc.sys.localStorage.setItem("switchGameData", "");
	},
	RunRecordAction: function RunRecordAction() {
		var allSwitchGameData = [];
		var switchRecord = cc.sys.localStorage.getItem("switchRecord");
		if (switchRecord != "") {
			allSwitchGameData.push(JSON.parse(switchRecord));
		}
		for (var i = 0; i < allSwitchGameData.length; i++) {
			if (!allSwitchGameData[i]) return;
			var action = allSwitchGameData[i].action;
			switch (action) {
				case 'OpenUIRecordAllResult':
					var gameType = allSwitchGameData[i].gameType;
					if (gameType == this.ShareDefine.GameType_GZMJ) {
						var gameTypeStr = this.ShareDefine.GametTypeID2PinYin[gameType];
						app.FormManager().ShowForm("UIRecordAllResult_" + gameTypeStr, allSwitchGameData[i].roomId, allSwitchGameData[i].playerAll, allSwitchGameData[i].gameType, allSwitchGameData[i].unionId, allSwitchGameData[i].roomKey, allSwitchGameData[i].page);
					} else if (gameType == this.ShareDefine.GameType_CP) {
						var _gameTypeStr = this.ShareDefine.GametTypeID2PinYin[gameType];
						app.FormManager().ShowForm("ui/uiGame/cp/UIRecordAllResult_cp", allSwitchGameData[i].roomId, allSwitchGameData[i].playerAll, allSwitchGameData[i].gameType, allSwitchGameData[i].unionId, allSwitchGameData[i].roomKey, allSwitchGameData[i].page);
					} else {
						app.FormManager().ShowForm("UIRecordAllResult", allSwitchGameData[i].roomId, allSwitchGameData[i].playerAll, allSwitchGameData[i].gameType, allSwitchGameData[i].unionId, allSwitchGameData[i].roomKey, allSwitchGameData[i].page);
					}
					break;
				default:
					console.log('未知动作: ' + action);
					break;
			}
		}
		cc.sys.localStorage.setItem("switchRecord", "");
	},
	//1:账号登录成功
	OnPack_BaseLogin: function OnPack_BaseLogin(serverPack) {
		console.log("账号登录成功");
		var HeroAccountManager = app.HeroAccountManager();
		var accountID = HeroAccountManager.GetAccountProperty("AccountID");
		var nickName = HeroAccountManager.GetAccountProperty("NickName");
		var headImageUrl = HeroAccountManager.GetAccountProperty("HeadImageUrl");
		var sex = HeroAccountManager.GetAccountProperty("Sex");
		var isMobile = HeroAccountManager.GetAccountProperty("isMobile");

		app.ServerTimeManager().InitLoginData(serverPack);
		app.WorldInfoManager().InitLoginData(serverPack);

		var NetManager = app.NetManager();

		//连接已经建立,初始化连接的玩家账号ID
		NetManager.InitConnectAccountID(accountID);
		//如果客户端已经有玩家数据了,为重连回包,不需要发送登录封包,只需要同步一次玩家属性,因为有可能变化了属性
		if (app.HeroManager().GetHeroID()) {
			console.log("玩家数据已经存在");
			this.SysLog("OnPack_BaseLogin have find heroID not send login");
			NetManager.SendPack("base.C1005PlayerInfo", {});
		} else {
			if (serverPack["isNeedCreateRole"]) {
				console.log("创建新角色");
				NetManager.SendPack("base.C1001CreateRole", {
					"nickName": nickName,
					"sex": sex,
					"headImageUrl": headImageUrl,
					"accountID": accountID,
					"isMobile": isMobile
				});
			} else {
				console.log("登录已有账号");
				NetManager.SendPack("base.C1006RoleLogin", { "accountID": accountID });
			}
		}
		//获取游戏列表
		// this.GetAllGameIdFromServer();
	},

	//2:玩家登陆初始化
	OnPack_OnHeroLogin: function OnPack_OnHeroLogin(serverPack) {

		try {
			var heroID = serverPack["pid"];
			this.gameType = serverPack["currentGameType"];
			app.HeroAccountManager().SetAccountProperty("reloginSign", serverPack["sign"]);
			app.HeroManager().InitLoginData(heroID, serverPack);
			this.GetAllGameIdFromServer();
			//初始化实时语音
			console.log("初始化实时语音");
			var argList = [{ "Name": "pid", "Value": heroID.toString() }];
			app.NativeManager().CallToNative("OnGVInit", argList);
			//请求玩家工会数据
			app.PlayerFamilyManager().SendInitPlayerFamily();
		} catch (error) {
			this.ErrLog("OnPack_OnHeroLogin(%s):%s", serverPack, error.stack);
			this.clientState = this.ShareDefine.State_LoginPackFail;
			app.SysNotifyManager().ShowSysMsg("Code_Login_PackFail");
		}
	},

	OnPack_PlayerInfo: function OnPack_PlayerInfo(serverPack) {
		try {
			var heroID = serverPack["pid"];
			app.HeroAccountManager().SetAccountProperty("reloginSign", serverPack["sign"]);
			app.HeroManager().InitLoginData(heroID, serverPack);
			this.GetAllGameIdFromServer();
		} catch (error) {
			this.ErrLog("OnPack_PlayerInfo(%s):%s", serverPack, error.stack);
		}
	},

	//3:请求玩家工会数据
	OnEvent_InitPlayerFamily: function OnEvent_InitPlayerFamily(event) {
		//请求玩家进入的房间ID
		app.GameManager().SendGetCurRoomID();
	},
	SetGameType: function SetGameType(typeStr) {
		if ('hzmj' == typeStr) this.gameType = 0;else if ('sss' == typeStr) this.gameType = 1;else if ('lymj' == typeStr) this.gameType = 2;else if ('xmmj' == typeStr) this.gameType = 3;else if ('nn' == typeStr) this.gameType = 4;else if ('fzmj' == typeStr) this.gameType = 5;else if ('qzmj' == typeStr) this.gameType = 6;else if ('pdk' == typeStr) this.gameType = 7;else if ('zzmj' == typeStr) this.gameType = 8;else if ('zjh' == typeStr) this.gameType = 9;else if ('ptmj' == typeStr) this.gameType = 10;else if ('ndmj' == typeStr) this.gameType = 11;else if ('smmj' == typeStr) this.gameType = 12;else if ('npmj' == typeStr) this.gameType = 13;else if ('npgzmj' == typeStr) this.gameType = 21;else if ('xymj' == typeStr) this.gameType = 14;else if ('ssmj' == typeStr) this.gameType = 15;else if ('namj' == typeStr) this.gameType = 16;else if ('pt13mj' == typeStr) this.gameType = 17;else if ('sg' == typeStr) this.gameType = 18;else if ('zjjhmj' == typeStr) this.gameType = 22;else if ('hbyxmj' == typeStr) this.gameType = 23;else if ('xyzb' == typeStr) this.gameType = 33;else if ('wsk' == typeStr) this.gameType = 41;else if ('pxcn' == typeStr) this.gameType = 34;else if ('zjmj' == typeStr) this.gameType = 35;else if ('wzmj' == typeStr) this.gameType = 40;else if ('ycmj' == typeStr) this.gameType = 42;else if ('ddz' == typeStr) this.gameType = 30;else if ('gdy' == typeStr) this.gameType = 26;else this.gameType = -1;
	},
	//4:登录获取玩家当前参与的房间ID
	OnEvent_LoginGetCurRoomID: function OnEvent_LoginGetCurRoomID(event) {
		var serverPack = event;
		var roomID = serverPack.roomID;
		console.log("登录获取玩家当前参与的房间ID:" + roomID);
		if ('practiceId' in serverPack) app.ShareDefine().practiceId = serverPack.practiceId;
		if (roomID == 0) {
			//如果启动参数传递房间号，则尝试进入房间
			if (this.startUpInfo['room_id']) {
				var roomKey = this.startUpInfo['room_id'];
				return;
			}
			this.OnStartEnterGame("enterMain");
			return;
		}
		var that = this;
		this.OnStartEnterGame("enterMain");
	},
	OnEvent_ConnectSuccess: function OnEvent_ConnectSuccess(event) {
		var serverPack = event;
		var bIsReconnect = serverPack['IsReconnecting'];
		if (bIsReconnect) {
			app.NetManager().SendPack("game.CGetGameStatus", {});
		}
	},
	Event_CodeError: function Event_CodeError(event) {
		var code = event["Code"];
		var msg = event["Result"]["Msg"];
		if (code == 5021) {
			var cityId = parseInt(msg);
			var selectCityConfig = app.SysDataManager().GetTableDict("selectCity");
			var cityInfo = selectCityConfig[cityId];
			if (cityInfo) {
				this.SetWaitForConfirm('RESELECT_CITY', this.ShareDefine.Confirm, [], [cityId], "该游戏是在[" + cityInfo.Name + "]，是否切换到该城市后再加入房间");
			}
		}
	},

	OnCheckMicPermission: function OnCheckMicPermission(dataDict) {
		var errStr = dataDict["ErrStr"];
		var switchGameDataStr = dataDict["Data"];
		var nameAndStatus = errStr.split(',');
		var name = nameAndStatus[0];
		var status = nameAndStatus[1];
		console.log("status === " + status);
		if (status == "open") {
			var switchGameData = null;
			if (switchGameDataStr != "") {
				switchGameData = JSON.parse(switchGameDataStr);
			}
			if (name != "" && name != "createRoom") {
				this.StartEnterGame(name, switchGameData);
			}
			if (name == "createRoom") {
				console.log("------------OnMicPermissionOpen-----------");
				this.OnEvent("OnMicPermissionOpen", {});
			}
		} else {
			app.FormManager().CloseForm('UIDownLoadGame');
			this.SetWaitForConfirm('MSG_CLOSE_MICPERMISSION', this.ShareDefine.Confirm, [], [], "您未开启语音权限，请前往打开");
		}
	},
	//断线重连状态同步
	OnPack_GetGameStatus: function OnPack_GetGameStatus(serverPack) {
		var isPlayingGame = serverPack['isPlayingGame'];
		this.gameType = serverPack['gameType'];
		var roomID = serverPack['roomID'];
		if (isPlayingGame) {
			//游戏中
			var event = {};
			event = {};
			event.roomID = roomID;
			this.OnEvent_LoginGetCurRoomID(event);
		} else {
			//跳转大厅
			var SceneManager = app.SceneManager();
			var sceneType = SceneManager.GetSceneType();
			//如果已经在登录场景则不切换
			if ('mainScene' != sceneType) app.SceneManager().LoadScene("mainScene");
		}
	},
	//开始进入游戏
	OnStartEnterGame: function OnStartEnterGame(eventName) {
		this.clientState = this.ShareDefine.State_Logined;

		if (eventName == "enterMain") {
			//进入主场景
			console.log("进入主场景");
			if (app.SceneManager().GetSceneType() != "mainScene") {
				app.SceneManager().LoadScene("mainScene");
			}
		}

		this.OnEvent("PlayerLoginOK", {});
	},

	//被ti
	OnPack_Kickout: function OnPack_Kickout(serverPack) {
		var kickOutType = serverPack["type"];

		if (kickOutType == 2) {
			this.LogOutGame(-1);
		} else {
			this.ErrLog("OnPack_Kickout kickOutType:%s not find", kickOutType);
		}
	},

	//提醒玩家在线时长
	OnPack_Online: function OnPack_Online(serverPack) {
		app.SysNotifyManager().ShowSysMsg("MSG_TIME_ONLINE", [serverPack.onlineHour]);
	},

	//-----------------回调函数-------------------------

	//首次进入主场景回调
	OnFirstEnterMainScene: function OnFirstEnterMainScene() {},

	//native平台回调(已经弃用，单独写了一个脚本hall_NativeNotify)
	// OnNativeNotify:function(eventType, eventDataString){
	//        try {
	//        	this.ErrLog("OnNativeNotify eventType:%s, eventDataString:%s",eventType, eventDataString);
	//            let dataDict = JSON.parse(eventDataString);
	//            if (eventType == "wechat") { //微信登录
	//             app.WeChatAppManager().OnNativeNotifyWXLogin(dataDict);
	//            }else if (eventType == "wechatShare") {  //微信分享
	//                app.WeChatAppManager().OnNativeNotifyWXShare(dataDict);
	//            }else if (eventType == "wechatPay") { //微信支付
	//                app.WeChatAppManager().OnNativeNotifyWXPay(dataDict);
	//            }else if (eventType == "onBatteryLevel") { //电量回掉
	//                this.OnEvent("EvtBatteryLevel",{"Level": dataDict["Level"], "status":dataDict["status"]});
	//            }else if (eventType == "apkProess") { //下载apk进度
	//                this.OnEvent("LoadApkProess", {"progress": dataDict["proess"]});
	//            }else if (eventType == "download") { //下载
	//            	app.DownLoadMgr().OnDownLoadEvent(dataDict);
	//            }else if (eventType == "palyAudioFinsh") { //播放完成
	//            	this.OnEvent("palyAudioFinsh", {});
	//            }else if (eventType == "AudioError") {//录音失败
	//            	this.OnEvent("AudioError", {});
	// 		}else if (eventType == "AudioStopError") {//录音失败
	//            	this.OnEvent("AudioStopError", {});
	//            }else if (eventType == "MedioRecordError") {//播放失败
	//            	this.OnEvent("MedioRecordError", {});
	//            }else if (eventType == "wellPrepared") {//准备录音
	//            	this.OnEvent("wellPrepared", {});
	//            }else if (eventType == "RecordAudioFinsh") { //录音完成
	//            	this.OnEvent("RECORDAUDIOFINSH", {});
	//            }else if (eventType == "GETLOCATION") { //获取定位
	//            	app.LocationOnStartMgr().OnGetLocationCallBack(dataDict);
	//            }else if (eventType == "copyText") { //获取定位
	//            	this.OnEvent("OnCopyTextNtf", dataDict);
	//            }else if (eventType == "DDShare") {
	//            	this.OnEvent("OnDDShare", dataDict);
	//            }else if (eventType == "XLShare") {
	//            	this.OnEvent("OnXLShare", dataDict);
	//            }else{
	//             this.ErrLog("OnNativeNotify not find eventType:%s", eventType);
	//            }
	//        }
	//        catch(error) {
	//            if(eventType=='wechatShare'){
	//        		//还是给分享成功回调
	//            	app.WeChatAppManager().OnNativeNotifyWXShare({"ErrCode":0});
	//        	}else{
	//            	this.ErrLog("OnNativeNotify(%s,%s) error(%s), error.stack:%s", eventType, eventDataString, error, error.stack);
	//        	}
	//        }
	// },


	// 每帧回掉
	update: function update(dt) {

		//if(this.clientState < this.ShareDefine.State_WaitLogin){
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
	OnTimer: function OnTimer(passSecond) {
		try {
			if (this.isWriteLog) {
				this.logSecond += passSecond;
				//500毫秒输出一次log
				if (this.logSecond >= 0.5) {
					this.LogManager.OutPutLog();
					this.logSecond = 0;
				}
			}
			if (this.clientState < this.ShareDefine.State_WaitLogin) {
				console.log("当前游戏在 clientState:State_WaitLogin");
				return;
			}
			//判断下服务器是否连上，如果连上关闭tip
			if (app.NetWork().isConnectIng && this.reConnectTip.active) {
				this.CloseReConnectTip();
			}
			app.SceneManager().OnTimer(passSecond);

			//完整登录才能调用
			if (this.clientState == this.ShareDefine.State_Logined) {
				var curTime = new Date().getTime();

				if (this.lastHearTime && curTime > this.lastHearTime + 23000) {
					this.ErrLog('NetWork Disconnect By Heart');
					this.lastHearTime = 0;
					if (app.NetWork().isConnectIng) //ios的可能websoket不会主动断开
						app.NetManager().Disconnect();

					if (!this.bStartReConnect) {
						this.StartReConnect();
						app.NetWork().ReConnectByTipSureBtn();
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
		} catch (error) {
			this.ErrLog("OnTimer:%s", error.stack);
		}
	},

	OnEventHide: function OnEventHide() {
		var curRunGame = cc.sys.localStorage.getItem("curRunGame");
		if (curRunGame != "hall") {
			console.log("当前游戏在 " + curRunGame + ",无需监听OnEventShow事件");
			return;
		}
		this.StopTimer();
		if (this.clientState < this.ShareDefine.State_WaitLogin) {
			console.log("当前游戏在 clientState:State_WaitLogin");
			return;
		}

		try {
			app.SceneManager().OnEventHide();
		} catch (error) {
			this.ErrLog("OnEventHide error:%s", error.stack);
		}
	},

	UpdateHearTime: function UpdateHearTime() {
		this.lastHearTime = new Date().getTime();
	},
	StartTimer: function StartTimer() {
		this.schedule(this.OnTimer, 1);
	},
	StopTimer: function StopTimer() {
		this.unschedule(this.OnTimer);
	},
	OnEventShow: function OnEventShow() {
		var isNeedReconnectVpn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		console.log("OnEventShow");
		var curRunGame = cc.sys.localStorage.getItem("curRunGame");
		if (curRunGame != "hall") {
			console.log("当前游戏在 " + curRunGame + ",无需监听OnEventShow事件");
			return;
		}
		this.StopTimer();
		// console.log("后台切回来大厅 1");
		if (this.clientState < this.ShareDefine.State_WaitLogin) {
			console.log("OnEventShow 当前游戏在 clientState:State_WaitLogin");
			return;
		}
		//如果在登录场景，不重连，避免授权登录失败
		if (app.SceneManager().GetSceneType() == "loginScene") {
			console.log("OnEventShow loginScene");
			return;
		}
		// console.log("后台切回来大厅 2");
		try {
			var curTime = new Date().getTime();
			console.log("LostHearTime == " + this.LostHearTime + ",curTime == " + curTime);
			if (isNeedReconnectVpn || this.LostHearTime && curTime > this.LostHearTime + 15000) {
				this.lastHearTime = 0;
				// console.log("后台切回来大厅 3");
				if (app.NetWork().isConnectIng) {
					//ios的可能websoket不会主动断开
					console.log("后台切回来，先断开连接");
					app.NetManager().Disconnect();
				}
				if (!this.bStartReConnect) {
					console.log("后台切回来，发起断线重连");
					this.StartReConnect();
					app.NetWork().ReConnectByTipSureBtn();
				}
			}
			app.SceneManager().OnEventShow(this.bStartReConnect);
			this.scheduleOnce(function () {
				this.StartTimer();
			}, 2);
			// console.log("后台切回来大厅 4");
		} catch (error) {
			this.ErrLog("OnEventShow error:%s", error.stack);
		}
	},

	//初始化客户端访问路径和app版本号
	OnInitClientData: function OnInitClientData(clientPath, appVersion) {
		this.clientState = this.ShareDefine.State_InitSuccess;
	},
	ShareDefineGame: function ShareDefineGame(allGames) {
		if (!allGames || allGames.length == 0) return;
		this.ShareDefine.GametTypeNameDict = {};
		this.ShareDefine.GametTypeID2Name = {};
		this.ShareDefine.GametTypeID2PinYin = {};
		for (var key in allGames) {
			var game = allGames[key];
			this.ShareDefine.GametTypeNameDict[game.Name.toUpperCase()] = game.Id;
			this.ShareDefine.GametTypeID2Name[game.Id] = game.Name_1;
			this.ShareDefine.GametTypeID2PinYin[game.Id] = game.Name;
		}
	},
	//客户端初始化成功回调
	OnInitClientFinish: function OnInitClientFinish(allTableDataDict, clientConfig) {
		// this.SysLog("OnInitClientFinish clientConfig:", JSON.stringify(clientConfig));
		// console.log("OnInitClientFinish allTableDataDict == " + JSON.stringify(allTableDataDict));
		this.ShareDefineGame(allTableDataDict.gametype.Data.json);
		try {
			this.clientConfig = clientConfig;
			this.RefreshClientConfig();

			if (this.debugModel) {
				this.debugModel.OnInitClientFinish();
			} else {
				var debug = this.clientConfig["debug"];

				//如果服务器下发debug
				if (debug && this.CheckDebugSign(debug)) {
					this.InitDebug(true);
					this.debugModel.OnInitClientFinish();
				}
			}

			if (this.clientState != this.ShareDefine.State_InitSuccess) {
				this.ErrLog("OnInitClientFinish 初始化异常");
				return;
			}

			if (!this.InitModel()) {
				this.ErrLog("OnInitClientFinish InitModel fail");
				return;
			}

			if (!this.InitTable(allTableDataDict)) {
				this.ErrLog("OnInitClientFinish InitTable fail");
				return;
			}

			//初始化客户端所有管理器
			if (!this.InitManager()) {
				this.ErrLog("OnInitClientFinish InitManager fail");
				return;
			}

			//强制CG一次,否则内存一直会占用不释放
			//cc.sys.garbageCollect();

			//输出运行环境信息
			cc.sys.dump();

			this.SysLog("browserType:%s,%s,%s", cc.sys.browserType, cc.sys.os, cc.sys.isNative);
		} catch (e) {
			this.ErrLog("InitUpdateFinish:%s", e.stack);
		}
	},

	LoadLogin: function LoadLogin() {
		this.ClientLoginProcess();
		app.WeChatManager().SendRequestWeChatSDKIntSign();
	},

	//刷新客户端启动配置字典
	RefreshClientConfig: function RefreshClientConfig() {
		var dbGameServerInfo = this.LocalDataManager.GetConfigProperty("DebugInfo", "GameServerInfo");
		var dbAccountServerInfo = this.LocalDataManager.GetConfigProperty("DebugInfo", "AccountServerInfo");
		var dbOrderServerInfo = this.LocalDataManager.GetConfigProperty("DebugInfo", "OrderServerInfo");
		var dbResServerInfo = this.LocalDataManager.GetConfigProperty("DebugInfo", "ResServerInfo");

		if (dbGameServerInfo) {
			var gameServerIP = dbGameServerInfo["GameServerIP"];
			var gameServerPort = dbGameServerInfo["GameServerPort"];

			if (gameServerIP && gameServerPort) {
				this.clientConfig["GameServerIP"] = gameServerIP;
				this.clientConfig["GameServerPort"] = gameServerPort;
				this.SysLog("OnInitClientFinish Use LocalData GameServer(%s:%s)", gameServerIP, gameServerPort);
			}
		}

		if (dbAccountServerInfo) {
			var accountServerIP = dbAccountServerInfo["AccountServerIP"];
			var accountServerPort = dbAccountServerInfo["AccountServerPort"];

			if (accountServerIP && accountServerPort) {
				this.clientConfig["AccountServerIP"] = accountServerIP;
				this.clientConfig["AccountServerPort"] = accountServerPort;
				this.SysLog("OnInitClientFinish Use LocalData AccountServer(%s:%s)", accountServerIP, accountServerPort);
			}
		}

		if (dbOrderServerInfo) {
			var orderServerIP = dbOrderServerInfo["OrderServerIP"];
			var orderServerPort = dbOrderServerInfo["OrderServerPort"];

			if (orderServerIP && orderServerPort) {
				this.clientConfig["OrderServerIP"] = orderServerIP;
				this.clientConfig["OrderServerPort"] = orderServerPort;
				this.SysLog("OnInitClientFinish Use LocalData OrderServer(%s:%s)", orderServerIP, orderServerPort);
			}
		}

		if (dbResServerInfo) {
			var resServerIP = dbResServerInfo["ResServerIP"];
			var resServerPort = dbResServerInfo["ResServerPort"];

			if (resServerIP && resServerPort) {
				this.clientConfig["ResServerIP"] = resServerIP;
				this.clientConfig["ResServerPort"] = resServerPort;
				this.SysLog("OnInitClientFinish Use LocalData ResServer(%s:%s)", resServerIP, resServerPort);
			}
		}

		//如果是H5连接启动,使用的账号和支付方式，需要重置一次
		//H5使用的账号授权SDK和支付SDK 又配置的连接携带的参数决定,不是由配置决定
		//公众号标示也有启动参数决定,不是由配置决定
		console.log("RefreshClientConfig cc.sys.isNative", cc.sys.isNative);
		if (cc.sys.isNative) {
			//判断使用SDK授权,支付SDK,枚举是否存在
			var accountType = this.clientConfig["AccountType"];
			var orderType = this.clientConfig["OrderType"];
			if (!this.ShareDefine.AccountSDKTypeNameDict.hasOwnProperty(accountType)) {
				console.log("AccountSDKTypeNameDict not find :%s", accountType);
				this.clientConfig["AccountType"] = this.ShareDefine.SDKType_Company;
			}

			if (!this.ShareDefine.OrderSDKTypeNameDict.hasOwnProperty(orderType)) {
				console.log("OrderSDKTypeNameDict not find :%s", orderType);
				this.clientConfig["OrderType"] = this.ShareDefine.OrderType_Company;
			}
		} else {

			var ddmchannel = this.startUpInfo["ddmchannel"];
			var ddmmp = this.startUpInfo["ddmmp"];

			this.clientConfig["Channel"] = ddmchannel;

			if (ddmchannel == "website") {
				this.clientConfig["AccountType"] = this.ShareDefine.SDKType_Company;
				this.clientConfig["OrderType"] = this.ShareDefine.OrderType_Company;
				this.clientConfig["MPID"] = "";
			} else if (ddmchannel == "wechat") {
				this.clientConfig["AccountType"] = this.ShareDefine.SDKType_WeChat;
				this.clientConfig["OrderType"] = this.ShareDefine.OrderType_Wechat;
				this.clientConfig["MPID"] = ddmmp;
			}
			//可能是本机调试启动
			else if (!this.startUpInfo.hasOwnProperty("ddmchannel")) {
					console.log("webdebug ddmchannel:%s ", ddmchannel);
					this.clientConfig["AccountType"] = this.ShareDefine.SDKType_Company;
					this.clientConfig["OrderType"] = this.ShareDefine.OrderType_Company;
					this.clientConfig["MPID"] = "";
				} else {
					this.ErrLog("ddmchannel:%s error", ddmchannel);
					this.clientConfig["AccountType"] = this.ShareDefine.SDKType_Company;
					this.clientConfig["OrderType"] = this.ShareDefine.OrderType_Company;
					this.clientConfig["MPID"] = "";
				}
		}
	},

	//初始化模块
	InitModel: function InitModel() {
		var modelName = "";
		try {
			var NeedCreateList = app.NeedCreateList;
			var count = NeedCreateList.length;
			for (var index = 0; index < count; index++) {
				modelName = NeedCreateList[index];
				//设置所有单例引用接口到app
				app[modelName] = require(modelName).GetModel;
			}
		} catch (error) {
			this.ErrLog("OnLoad require(%s) error:%s", modelName, error.stack);
			return false;
		}

		return true;
	},

	//初始化表数据
	InitTable: function InitTable(allTableDataDict) {

		var SysDataManager = app.SysDataManager();

		var allTableNameList = Object.keys(allTableDataDict);
		var count = allTableNameList.length;
		for (var index = 0; index < count; index++) {
			var tableName = allTableNameList[index];
			var tableInfo = allTableDataDict[tableName];
			SysDataManager.OnLoadTableEnd(tableName, tableInfo["KeyNameList"], tableInfo["Data"]);
		}

		return true;
	},

	//初始化管理器
	InitManager: function InitManager() {
		console.log("ClietManage InitManager");
		//实例化所有单例管理器
		var NeedCreateList = app.NeedCreateList;
		var count = NeedCreateList.length;

		var modelName = "";
		try {
			for (var index = 0; index < count; index++) {
				modelName = NeedCreateList[index];
				require(modelName).GetModel();
			}
		} catch (error) {
			this.ErrLog("InitManager(%s) error:%s", modelName, error.stack);
			return false;
		}
		//追加调试全局入口
		// if(window){
		// 	window["app"] = app;
		// 	window["t"] = app.TestManager();
		// }

		var NetManager = app.NetManager();
		var startUrl = "";
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

		// this.RegEvent("InitPlayerFamily", this.OnEvent_InitPlayerFamily, this);
		// this.RegEvent("LoginGetCurRoomID", this.OnEvent_LoginGetCurRoomID, this);

		// //断线重连成功通知
		// app.Client.RegEvent("ConnectSuccess", this.OnEvent_ConnectSuccess, this);
		//初始化管理器完成调用一次sdk初始化接口(h5游戏客户端需要初始化携带的sdk参数:token)
		// console.log("InitManager this.startUpInfo:", this.startUpInfo);
		app.SDKManager().InitSDKParameter(this.startUpInfo);

		return true;
	},

	RegAllEvent: function RegAllEvent() {
		this.RegEvent("InitPlayerFamily", this.OnEvent_InitPlayerFamily, this);
		this.RegEvent("LoginGetCurRoomID", this.OnEvent_LoginGetCurRoomID, this);

		//断线重连成功通知
		this.RegEvent("ConnectSuccess", this.OnEvent_ConnectSuccess, this);
		//事件
		this.RegEvent("CodeError", this.Event_CodeError, this);
		this.RegEvent("CheckMicPermission", this.OnCheckMicPermission, this);
	},

	//---------------------客户端事件分发接口-----------------------------
	//客户端封包事件
	OnEvent: function OnEvent(eventName, argDict) {
		if (argDict) {
			this.Log("OnEvent(%s):", eventName, argDict);
		} else {
			this.Log("OnEvent(%s)", eventName);
		}
		if (!this.node) {
			return;
		}

		try {
			var curRunGame = cc.sys.localStorage.getItem("curRunGame");
			if (curRunGame != "hall") {
				console.log("当前游戏在 " + curRunGame + ",无需分发事件");
				return;
			}
			this.node.emit(eventName, argDict);
		} catch (error) {
			this.ErrLog("大厅事件分发 OnEvent:%s", error.stack);
		}
	},
	OnEvent_SPlayerContinue: function OnEvent_SPlayerContinue(serverPack) {
		var roomKey = serverPack.roomKey;
		var userName = serverPack.shortPlayer.name;
		var paymentRoomCardType = serverPack.paymentRoomCardType;
		app.FormManager().ShowForm('UIJoinMessage', roomKey, userName, paymentRoomCardType);
	},

	//注册封包事件
	RegEvent: function RegEvent(eventName, func, target) {
		if (!this.node) {
			//节点已经被销毁了
			return;
		}
		if (!func || !target) {
			this.ErrLog("eventName:%s error", eventName);
			return;
		}
		this.node.on(eventName, func, target);
	},

	//取消注册封包事件
	UnRegTargetEvent: function UnRegTargetEvent(target) {
		var eventName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
		var func = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

		if (!this.node) {
			//节点已经被销毁了
			return;
		}
		//如果有制定注销事件
		if (eventName && func) {
			this.node.off(eventName, func, target);
		} else {
			this.node.targetOff(target);
		}
	},

	//键盘按下
	OnKeyDown: function OnKeyDown(event) {
		var keyCode = event.keyCode;
		switch (keyCode) {
			case cc.macro.KEY.back:
				{
					var msgID = "MSG_EXIT_GAME";
					var ConfirmManager = app.ConfirmManager();
					ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, []);
					ConfirmManager.ShowConfirm(this.ShareDefine.Confirm, msgID, []);
					break;
				}
		}
		this.OnEvent("OnKeyDown", { "KeyCode": keyCode });
	},
	//----------------逻辑函数----------------------
	//客户端是否登录封包完成
	IsClientLoginOK: function IsClientLoginOK() {
		return this.clientState == this.ShareDefine.State_Logined;
	},

	SetClientState: function SetClientState(clientState) {
		this.clientState = clientState;
	},

	//退出游戏到登录界面
	LogOutGame: function LogOutGame() {
		var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

		console.log('LogOutGame');
		if (-1 == code) {} else if (-2 == code) {
			app.SysNotifyManager().ShowSysMsg("Kick_ByServer");
		}
		this.SysLog("LogOutGame  00000 app.NetWork().isConnectIng:%s ", app.NetWork().isConnectIng);
		//断开连接
		if (app.NetWork().isConnectIng) {
			//不用Connected()底层websocket有BUG
			this.SysLog("LogOutGame 1111");
			app.NetManager().Disconnect(true);
		}
		app.LocalDataManager().SetConfigProperty("Account", "AccessTokenInfo", {});
		app.LocalDataManager().SetConfigProperty("Account", "XlOpenID", "");
		this.ClientLoginProcess();
	},

	/**
  * 退到客户端登录场景,客户端初始化s
  */
	ClientLoginProcess: function ClientLoginProcess() {

		var SceneManager = app.SceneManager();

		var sceneType = SceneManager.GetSceneType();
		//如果已经在登录场景则不切换
		if (sceneType == "loginScene") {
			//重新加载下登录场景，防止还未登录就卡死的
			this.ClearClientData();
			SceneManager.LoadScene("loginScene");
			if (!SceneManager.GetSceneComponent()) {
				this.WarnLog("ClientLoginProcess not sceneName");
				return;
			}
			SceneManager.GetSceneComponent().OnTopEvent("Close");
		}
		//如果不在登录场景，则切换到登录场景，
		else {
				this.ClearClientData();
				SceneManager.LoadScene("loginScene");
			}
	},

	//清理管理器数据
	ClearClientData: function ClearClientData() {
		this.SysLog("ClearClientData");
		app.LocalDataManager().OnReload();
		//----客户端基础管理器---
		app.NetManager().OnReload();
		app.SceneManager().OnReload();
		app.SDKManager().OnReload();
		app.TalkingDataManager().OnReload();

		app.ChatManager().OnReload();

		//----数据管理器-------
		app.WorldInfoManager().OnReload();
		app.FamilyManager().OnReload();

		app.HeroAccountManager().OnReload();
		app.HeroManager().OnReload();
		app.NoticeManager().OnReload();

		app.GameManager().OnReload();
		app.PlayerRankManager().OnReload();

		app.PlayerFamilyManager().OnReload();

		app.PlayerRoomManager().OnReload();
		app.RoomRecordManager().OnReload();

		this.clientState = this.ShareDefine.State_WaitLogin;
	},

	//检测Debug签名
	CheckDebugSign: function CheckDebugSign(debugSign) {
		//生成签名
		var argDict = {
			"gameID": "p7",
			"gameType": "h5",
			"nonceStr": "18320c805fb57d88805d3918cdd1b2a3"
		};
		var argKeyList = Object.keys(argDict);
		argKeyList.sort();
		var keyCount = argKeyList.length;
		var signString = "";
		for (var index = 0; index < keyCount; index++) {
			var keyName = argKeyList[index];
			signString += [keyName, "=", argDict[keyName], "&"].join("");
		}
		signString += "ddmh5.com";
		var sign = app.MD5.hex_md5(signString);
		if (sign == debugSign) {
			return true;
		}
		return false;
	},

	//--------------全局缓存---------------

	//获取全局缓存的bebug节点
	GetDebugModel: function GetDebugModel() {
		return this.debugModel;
	},
	MultiPoint: function MultiPoint(serverIP) {
		if (serverIP == "") {
			return "";
		}
		if (!cc.sys.isNative) {
			return serverIP;
		}
		if (app.Client.GetClientConfigProperty("IsGaoFang") == 0) {
			//不接入高防
			return serverIP;
		}
		var AccessPoint = app.LocalDataManager().GetConfigProperty("Account", "AccessPoint");
		if (AccessPoint > 0) {
			if (AccessPoint == 1) {
				return 'line1.' + serverIP;
			} else if (AccessPoint == 2) {
				return 'line2.' + serverIP;
			} else if (AccessPoint == 3) {
				return 'line3.' + serverIP;
			}
		}

		var AccountActive = app.LocalDataManager().GetConfigProperty("Account", "AccountActive");
		//如果该城市有独立节点，则调用本城市自己的节点
		var myCityID = cc.sys.localStorage.getItem("myCityID");
		if (myCityID) {
			var CityPoints = app.Client.GetClientConfigProperty("CityPoints");
			if (CityPoints) {
				var CityPointsList = CityPoints.split(',');
				if (CityPointsList.indexOf(myCityID) > -1) {
					//用户选择的城市有配置独立的节点
					if (AccountActive > 10) {
						return 'h' + myCityID + '.' + serverIP; //活跃用户
					} else {
						return 'c' + myCityID + '.' + serverIP; //普通用户
					}
				}
			}
		}
		if (AccountActive > 100) {
			serverIP = 'a100.' + serverIP;
		} else if (AccountActive > 50) {
			serverIP = 'i50.' + serverIP;
		} else if (AccountActive > 10) {
			serverIP = 'x10.' + serverIP;
		}

		return serverIP;
	},
	//获取客户端启动配置
	GetClientConfig: function GetClientConfig() {
		var clientConfig = [];
		var mt = ["GateServerIP", "GameServerIP", "AccountServerIP", "OrderServerIP", "ResServerIP"];
		for (var key in this.clientConfig) {
			if (mt.InArray(key)) {
				clientConfig[key] = this.MultiPoint(this.clientConfig[key]);
			} else {
				clientConfig[key] = this.clientConfig[key];
			}
		}
		return clientConfig;
	},
	GetAppName: function GetAppName() {
		return "xinhua";
	},
	//获取客户端启动配置属性值
	GetClientConfigProperty: function GetClientConfigProperty(property) {
		var mt = ["GateServerIP", "GameServerIP", "AccountServerIP", "OrderServerIP", "ResServerIP"];
		if (this.clientConfig.hasOwnProperty(property)) {
			if (mt.InArray(property)) {
				return this.MultiPoint(this.clientConfig[property]);
			} else {
				//"WeChatAppShareUrl",如果是宝岛棋牌，换分享地址
				if (property != "WeChatAppShareUrl") {
					return this.clientConfig[property];
				} else {
					return this.clientConfig["WeChatAppShareUrl"];
				}
			}
		} else {
			this.ErrLog("GetClientConfigProperty not find :%s", property);
			return 0;
		}
	},

	//获取启动属性值
	GetStartUpProperty: function GetStartUpProperty(property) {
		if (!this.startUpInfo.hasOwnProperty(property)) {
			return;
		}
		return this.startUpInfo[property];
	},

	GetGlobalEffectNode: function GetGlobalEffectNode(effectName) {
		if (!this.node) {
			//节点已经被销毁了
			return;
		}
		if (this.node == null) {
			console.log("ClietManage 节点已经被销毁了");
			return;
		}
		if (this.node.getChildByName('globalEffect') == null) {
			console.log("globalEffect 节点已经被销毁了");
			return;
		}
		var effectNode = this.node.getChildByName('globalEffect').getChildByName(effectName);
		if (!effectNode) {
			this.ErrLog("GetGlobalEffectNode(%s) not find", effectName);
			return;
		}
		effectNode.removeFromParent(false);
		return effectNode;
	},
	StartReConnect: function StartReConnect() {
		if (this.bStartReConnect) return;
		this.bStartReConnect = true;
		// this.reConnectUseTime = 0;
		// this.reConnectLable.string = '连接失败,重新加载中(1秒)...';
		// this.lastReConnectTime = new Date().getTime();
		// this.reConnectTip.active = true;
	},
	CloseReConnectTip: function CloseReConnectTip() {
		this.bStartReConnect = false;
		this.lastReConnectTime = 0;
		this.reConnectUseTime = 0;
		this.reConnectLable.string = '';
		this.reConnectTip.active = false;
	},
	PushGlobalEffectNode: function PushGlobalEffectNode(effectNode) {
		if (!this.node) {
			//节点已经被销毁了
			return;
		}
		effectNode.removeFromParent(false);
		this.node.getChildByName('globalEffect').addChild(effectNode);
	},

	GetIsFirstLogin: function GetIsFirstLogin() {
		return this.isFirstLogin;
	},

	SetFirstLogin: function SetFirstLogin() {
		this.isFirstLogin = false;
	},

	//取消常驻节点，以便重新加载游戏
	RemoveClientManager: function RemoveClientManager() {
		cc.game.removePersistRootNode(this.node);
		//清理已经加载的界面
		app.FormManager().loadFormDict = {};
		app.FormManager().showFormDict = {};
		app.FormManager().createingFormDict = {};
		app.FormManager().formWndShowInfo = {};
		app.FormManager().defaultFormNameList = [];
		//清理已经加载的缓存
		app.Client.ControlManager.ReleaseAllRes();
		//清除注册事件
		// this.UnRegTargetEvent(this);
		//取消注册所有的net注册事件
		// app.NetManager().UnRegAllNetPack();
		//       let baseForm = require("BaseForm");
		// baseForm._eventFuncDict = {};
		this.destroy();
		this.node.destroy();
	},

	//进入子游戏
	EnterSubGame: function EnterSubGame(name) {
		var switchGameData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
		var roomKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

		//如果是游戏切换需要释放内存，重新加载
		if (!cc.sys.isNative) return;
		if (name == "sss_zz" || name == "sss_dr") {
			name = "sss";
		}
		if (roomKey > 0) {
			var self = this;
			app.NetManager().SendPack("room.CBaseGetRoomCfg", { "roomKey": roomKey }, function (event) {
				console.log("roomCfg === " + JSON.stringify(event));
				if (event.lianmai == 2) {
					var switchGameDataStr = "";
					if (switchGameData != null) {
						switchGameDataStr = JSON.stringify(switchGameData);
					}
					app.NativeManager().CallToNative("CheckMicPermission", [{
						"Name": "name",
						"Value": name
					}, { "Name": "switchGameData", "Value": switchGameDataStr }]);
				} else {
					self.StartEnterGame(name, switchGameData);
				}
			}, function (error) {
				console.log("获取房间配置失败");
			});
		} else {
			this.StartEnterGame(name, switchGameData);
		}
	},

	StartEnterGame: function StartEnterGame(name) {
		var switchGameData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		if (switchGameData != null) {
			// let testData = {action:"showForm", fromName:"UIStore"};
			cc.sys.localStorage.setItem("switchGameData", JSON.stringify(switchGameData));
		}
		var that = this;
		this.RemoveClientManager();
		//切换GameServer节点再进入游戏
		console.log("EnterSubGame name:" + name);
		var gamtTypeID = app.ShareDefine().GametTypeNameDict[name.toUpperCase()];
		var successFunc = function successFunc(success) {
			var localConfig = cc.sys.localStorage.getItem("localConfig");
			var clientConfig = JSON.parse(localConfig);
			if (success.isStart == false) {
				app.SysNotifyManager().ShowSysMsg("游戏维护中，请稍后重试", [], 3);
				return;
			}
			clientConfig["GameServerIP"] = success.gameServerIP;
			clientConfig["GameServerPort"] = success.gameServerPort;
			//刷新GameServerIp给子游戏
			cc.sys.localStorage.setItem("localConfig", JSON.stringify(clientConfig));
			app.SoundManager().StopAllSound();
			app.NetManager().SendPack("base.C1110UUID", { "gameName": name }, function (event) {
				app.LocalDataManager().SetConfigProperty("Account", "uuid", event);
				//停止场景音乐
				app.SoundManager().StopAllSound();
				if (app.NetWork().isConnectIng) {
					console.log("获取uuid成功，断开连接");
					app.NetManager().Disconnect(true);
				}
				SubgameManager.enterSubgame(name);
			}, function (error) {
				console.log("获取uuid失败");
			});
		};
		var failFunc = function failFunc(error) {
			app.SysNotifyManager().ShowSysMsg("游戏地址获取失败", [], 3);
		};
		if (that.gameInfo && that.gameInfo[gamtTypeID] && that.gameInfo[gamtTypeID]["gameServerIP"]) {
			successFunc(that.gameInfo[gamtTypeID]);
		} else {
			app.NetManager().SendPack("room.CBaseGameTypeUrl", { "gametype": gamtTypeID }, successFunc, failFunc);
		}
	},

	//检测下子游戏是否下载或者有新版本
	ChangeRoomCheckSubGame: function ChangeRoomCheckSubGame(gameName, roomKey) {
		var clubId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var haveEnterFunction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
		var password = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";

		var self = this;
		if (!cc.sys.isNative) {
			if (haveEnterFunction) {
				haveEnterFunction();
				return;
			}
			app.NetManager().SendPack("room.CBaseChangeRoom", {
				"roomKey": roomKey,
				"posID": -1,
				"password": password,
				"clubId": clubId
			}, function (event) {
				app.SysNotifyManager().ShowSysMsg("换房间成功", [], 3);
			}, function (event) {});
			return;
		}
		if (gameName == "sss_zz" || gameName == "sss_dr") {
			gameName = "sss";
		}
		if (self.tryEnterGame) {
			console.log("正在检测更新...");
			return;
		}
		self.tryEnterGame = true;
		//延迟2秒再次检测是否更新
		this.scheduleOnce(function () {
			self.tryEnterGame = false;
		}, 2);
		//判断子游戏有没有下载
		if (SubgameManager.isSubgameDownLoad(gameName)) {
			//已下载，判断是否需要更新
			SubgameManager.needUpdateSubgame(gameName, function (success) {
				if (success) {
					//子游戏需要更新;
					app.FormManager().ShowForm("UIDownLoadGame", gameName, roomKey, null, 0, 0, false, clubId, undefined, haveEnterFunction, true, password);
				} else {
					if (haveEnterFunction) {
						haveEnterFunction();
						return;
					}
					//子游戏不需要更新;
					app.NetManager().SendPack("room.CBaseChangeRoom", {
						"roomKey": roomKey,
						"posID": -1,
						"password": password,
						"clubId": clubId
					}, function (event) {
						app.SysNotifyManager().ShowSysMsg("换房间成功", [], 3);
					}, function (event) {});
				}
			}, function () {
				console.log("JoinRoomCheckSubGame 子游戏更新失败");
				//下载失败如果已经下载了游戏，直接进。热更服有可能被攻击
				if (haveEnterFunction) {
					haveEnterFunction();
					return;
				}
				app.NetManager().SendPack("room.CBaseChangeRoom", {
					"roomKey": roomKey,
					"posID": -1,
					"password": password,
					"clubId": clubId
				}, function (event) {
					app.SysNotifyManager().ShowSysMsg("换房间成功", [], 3);
				}, function (event) {});
				// app.SysNotifyManager().ShowSysMsg("游戏检测更新失败，建议重启游戏再进");
			});
		} else {
			//未下载
			app.FormManager().ShowForm("UIDownLoadGame", gameName, roomKey, null, 0, 0, false, clubId, undefined, haveEnterFunction, true, password);
		}
	},
	//检测下子游戏是否下载或者有新版本
	JoinRoomCheckSubGame: function JoinRoomCheckSubGame(gameName, roomKey) {
		var clubId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var haveEnterFunction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
		var password = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
		var existQuickJoin = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

		var mainComponent = app.FormManager().GetFormComponentByFormName("UINewMain");
		if (mainComponent && 0 != mainComponent.curRoomID) {
			var curGameType = app.ShareDefine().GametTypeNameDict[mainComponent.curGameTypeStr.toUpperCase()];
			var msgID = "MSG_GO_ROOM";
			var ConfirmManager = app.ConfirmManager();
			ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, [mainComponent.curGameTypeStr]);
			ConfirmManager.ShowConfirm(this.ShareDefine.Confirm, msgID, [app.ShareDefine().GametTypeID2Name[curGameType]]);
			return;
		}
		var self = this;
		if (!cc.sys.isNative) {
			if (haveEnterFunction) {
				haveEnterFunction();
				return;
			}
			app.NetManager().SendPack("room.CBaseEnterRoom", {
				"roomKey": roomKey,
				"posID": -1,
				"password": password,
				"clubId": clubId,
				"existQuickJoin": existQuickJoin
			}, function (event) {
				//app.SysNotifyManager().ShowSysMsg("加入房间成功", [], 3);
			}, function (event) {});
			return;
		}
		if (gameName == "sss_zz" || gameName == "sss_dr") {
			gameName = "sss";
		}
		if (self.tryEnterGame) {
			console.log("正在检测更新...");
			return;
		}
		self.tryEnterGame = true;
		//延迟2秒再次检测是否更新
		this.scheduleOnce(function () {
			self.tryEnterGame = false;
		}, 2);
		//判断子游戏有没有下载
		if (SubgameManager.isSubgameDownLoad(gameName)) {
			//已下载，判断是否需要更新
			SubgameManager.needUpdateSubgame(gameName, function (success) {
				if (success) {
					//子游戏需要更新;
					app.FormManager().ShowForm("UIDownLoadGame", gameName, roomKey, null, 0, 0, false, clubId, undefined, haveEnterFunction, password, existQuickJoin);
				} else {
					if (haveEnterFunction) {
						haveEnterFunction();
						return;
					}
					//子游戏不需要更新;
					app.NetManager().SendPack("room.CBaseEnterRoom", {
						"roomKey": roomKey,
						"posID": -1,
						"password": password,
						"existQuickJoin": existQuickJoin,
						"clubId": clubId
					}, function (event) {
						///app.SysNotifyManager().ShowSysMsg("加入房间成功", [], 3);
					}, function (event) {});
				}
			}, function () {
				console.log("JoinRoomCheckSubGame 子游戏更新失败");
				//下载失败如果已经下载了游戏，直接进。热更服有可能被攻击
				if (haveEnterFunction) {
					haveEnterFunction();
					return;
				}
				app.NetManager().SendPack("room.CBaseEnterRoom", {
					"roomKey": roomKey,
					"posID": -1,
					"password": password,
					"existQuickJoin": existQuickJoin,
					"clubId": clubId
				}, function (event) {
					//app.SysNotifyManager().ShowSysMsg("加入房间成功", [], 3);
				}, function (event) {});
				// app.SysNotifyManager().ShowSysMsg("游戏检测更新失败，建议重启游戏再进");
			});
		} else {
			//未下载
			app.FormManager().ShowForm("UIDownLoadGame", gameName, roomKey, null, 0, 0, false, clubId, undefined, haveEnterFunction, password, existQuickJoin);
		}
	},
	//检测下子游戏是否下载或者有新版本
	PracticeRoomCheckSubGame: function PracticeRoomCheckSubGame(gameName, practiceId) {
		if (!cc.sys.isNative) return;
		var self = this;
		if (gameName == "sss_zz" || gameName == "sss_dr") {
			gameName = "sss";
		}
		if (self.tryEnterGame) {
			console.log("正在检测更新...");
			return;
		}
		self.tryEnterGame = true;
		//延迟2秒再次检测是否更新
		this.scheduleOnce(function () {
			self.tryEnterGame = false;
		}, 2);
		//判断子游戏有没有下载
		if (SubgameManager.isSubgameDownLoad(gameName)) {
			//已下载，判断是否需要更新
			SubgameManager.needUpdateSubgame(gameName, function (success) {
				if (success) {
					//子游戏需要更新;
					app.FormManager().ShowForm("UIDownLoadGame", gameName, 0, null, 0, practiceId);
				} else {
					//子游戏不需要更新;
					app.NetManager().SendPack("room.CBaseGoldRoom", { "practiceId": practiceId }, function (event) {
						var gameType = event.gameType;
						var name = app.ShareDefine().GametTypeID2PinYin[gameType];
						self.EnterSubGame(name, null, 0);
					}, function (event) {
						console.log("进入房间失败...");
					});
				}
			}, function () {
				console.log("子游戏更新失败");
				//下载失败如果已经下载了游戏，直接进。热更服有可能被攻击
				app.NetManager().SendPack("room.CBaseGoldRoom", { "practiceId": practiceId }, function (event) {
					var gameType = event.gameType;
					var name = app.ShareDefine().GametTypeID2PinYin[gameType];
					self.EnterSubGame(name, null, 0);
				}, function (event) {
					console.log("进入房间失败...");
				});
				// app.SysNotifyManager().ShowSysMsg("游戏检测更新失败，建议重启游戏再进");
			});
		} else {
			//未下载
			app.FormManager().ShowForm("UIDownLoadGame", gameName, 0, null, 0, practiceId);
		}
	},
	//检测下子游戏是否下载或者有新版本
	CreateRoomCheckSubGame: function CreateRoomCheckSubGame(gameName, sendPack) {
		if (gameName == "sss_zz" || gameName == "sss_dr") {
			gameName = "sss";
		}
		if (sendPack.gaoji && app.Client.GetClientConfigProperty("dianbo")) {
			if (sendPack.gaoji.indexOf(5) < 0) {
				sendPack.gaoji.push(5);
			}
			if (sendPack.gaoji.indexOf(6) < 0) {
				sendPack.gaoji.push(6);
			}
		}
		if (!cc.sys.isNative) {
			if (sendPack.clubId && sendPack.clubId != 0) {
				app.NetManager().SendPack("club.CClubCreateRoom", sendPack, function (event) {
					console.log("创建房间成功");
				}, function (event) {
					console.log("创建房间失败");
				});
			} else {
				app.NetManager().SendPack("room.CBaseCreateRoom", sendPack, function (event) {
					app.SysNotifyManager().ShowSysMsg("创建房间成功", [], 3);
				}, function (event) {
					app.SysNotifyManager().ShowSysMsg("创建房间失败", [], 3);
				});
			}
			return;
		}
		var self = this;
		if (self.tryEnterGame) {
			console.log("正在检测更新...");
			return;
		}
		self.tryEnterGame = true;
		//延迟2秒再次检测是否更新
		this.scheduleOnce(function () {
			self.tryEnterGame = false;
		}, 2);
		//判断子游戏有没有下载
		if (SubgameManager.isSubgameDownLoad(gameName)) {
			//已下载，判断是否需要更新
			SubgameManager.needUpdateSubgame(gameName, function (success) {
				if (success) {
					//子游戏需要更新;
					app.FormManager().ShowForm("UIDownLoadGame", gameName, 0, sendPack);
				} else {
					//子游戏不需要更新;
					console.log("子游戏不需要更新");
					if (sendPack.clubId && sendPack.clubId != 0) {
						app.NetManager().SendPack("club.CClubCreateRoom", sendPack, function (event) {
							console.log("创建房间成功");
						}, function (event) {
							console.log("亲友圈创建房间失败");
						});
					} else {
						app.NetManager().SendPack("room.CBaseCreateRoom", sendPack, function (event) {
							console.log("创建房间成功");
						}, function (event) {
							console.log("创建房间失败");
							app.SysNotifyManager().ShowSysMsg("创建房间失败", [], 3);
						});
					}
				}
			}, function () {
				console.log("子游戏更新失败");
				//下载失败如果已经下载了游戏，直接进。热更服有可能被攻击
				if (sendPack.clubId && sendPack.clubId != 0) {
					app.NetManager().SendPack("club.CClubCreateRoom", sendPack, function (event) {
						console.log("创建房间成功");
					}, function (event) {
						console.log("亲友圈创建房间失败");
					});
				} else {
					app.NetManager().SendPack("room.CBaseCreateRoom", sendPack, function (event) {
						console.log("创建房间成功");
					}, function (event) {
						app.SysNotifyManager().ShowSysMsg("创建房间失败", [], 3);
					});
				}
				// app.SysNotifyManager().ShowSysMsg("游戏检测更新失败，建议重启游戏再进");
			});
		} else {
			//未下载
			app.FormManager().ShowForm("UIDownLoadGame", gameName, 0, sendPack);
		}
	},

	//检测下子游戏是否下载或者有新版本
	VideoCheckSubGame: function VideoCheckSubGame(gameName, playBackCode) {
		if (!cc.sys.isNative) return;
		var self = this;
		if (gameName == "sss_zz" || gameName == "sss_dr") {
			gameName = "sss";
		}
		if (self.tryEnterGame) {
			console.log("正在检测更新...");
			return;
		}
		self.tryEnterGame = true;
		//延迟2秒再次检测是否更新
		this.scheduleOnce(function () {
			self.tryEnterGame = false;
		}, 2);
		//判断子游戏有没有下载
		if (SubgameManager.isSubgameDownLoad(gameName)) {
			//已下载，判断是否需要更新
			SubgameManager.needUpdateSubgame(gameName, function (success) {
				if (success) {
					//子游戏需要更新;
					app.FormManager().ShowForm("UIDownLoadGame", gameName, 0, null, playBackCode);
				} else {
					//子游戏不需要更新;
					var videoData = { action: "showVideo", backCode: playBackCode };
					self.EnterSubGame(gameName, videoData);
				}
			}, function () {
				console.log("子游戏更新失败");
				//下载失败如果已经下载了游戏，直接进。热更服有可能被攻击
				var videoData = { action: "showVideo", backCode: playBackCode };
				self.EnterSubGame(gameName, videoData);
				//app.SysNotifyManager().ShowSysMsg("游戏检测更新失败，建议重启游戏再进");
			});
		} else {
			//未下载
			app.FormManager().ShowForm("UIDownLoadGame", gameName, 0, null, playBackCode);
		}
	},

	//获取所有游戏id，并且根据最近玩的和已下载的排序
	GetAllGameIdFromServer: function GetAllGameIdFromServer() {
		var isNeedOnEvent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		var allSelectCityData = app.HeroManager().GetCurSelectCityData();
		if (allSelectCityData.length == 0) {
			//没有选择城市
			// app.FormManager().ShowForm("UISelectCity");
			// return this.allGameIdFormServer;
			console.log("没有选择城市");
		} else {
			var selectId = allSelectCityData[0]['selcetId'];
			var selectCityConfig = app.SysDataManager().GetTableDict("selectCity");
			if (selectCityConfig[selectId]["Type"] != 3) {
				app.SysNotifyManager().ShowSysMsg("需指定县级市，才能进入游戏");
				app.FormManager().ShowForm("UISelectCity");
				return;
			}
			var self = this;
			//根据选择的城市向服务端请求所有游戏
			app.NetManager().SendPack("room.CBaseGameIdList", { "selectCityId": selectId }, function (event) {
				self.allGameIdFormServer = event.split(",");
				if (isNeedOnEvent) {
					var curGameList = self.GetAllGameId();
					var argDict = {
						"gameList": curGameList
					};
					self.OnEvent("ShowGameListByLocation", argDict);
				}
			}, function (event) {
				console.log("获取游戏id失败");
			});
		}
	},

	GetAllGameId: function GetAllGameId() {
		var _this = this;

		var isGetAllGame = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		if (this.allGameIdFormServer == null) {
			//如果服务端下发游戏列表未取到
			this.GetAllGameIdFromServer(true);
			return [];
		}
		var allGameIdFormtemp = [];
		for (var i = 0; i < this.allGameIdFormServer.length; i++) {
			allGameIdFormtemp.push(this.allGameIdFormServer[i]);
		}
		console.log("allGameIdFormServer: " + JSON.stringify(this.allGameIdFormServer));
		if (!cc.sys.isNative || isGetAllGame) {
			return allGameIdFormtemp;
		}

		var allGameId = [];
		var latelyGameType = cc.sys.localStorage.getItem("latelyGameType");
		if (latelyGameType && typeof latelyGameType == "string") {
			var latelyGameId = app.ShareDefine().GametTypeNameDict[latelyGameType.toUpperCase()];
			var index = allGameIdFormtemp.indexOf(latelyGameId);
			if (index > -1) {
				allGameId.unshift(latelyGameId);
			}
		}
		for (var _i = 0; _i < allGameIdFormtemp.length; _i++) {
			if (!cc.sys.isNative) break;
			var gameName = app.ShareDefine().GametTypeID2PinYin[allGameIdFormtemp[_i]];
			if (allGameId.indexOf(allGameIdFormtemp[_i]) > -1) {
				//已经在列表了
				continue;
			}
			if (SubgameManager.isSubgameDownLoad(gameName)) {
				allGameId.unshift(allGameIdFormtemp[_i]);
			} else {
				allGameId.push(allGameIdFormtemp[_i]);
			}
		}
		var that = this;

		var _loop = function _loop(_i2) {
			var gameId = Number(allGameId[_i2]);
			if (!_this.gameInfo[gameId]) {
				_this.gameInfo[gameId] = {};
			}
			if (!_this.gameInfo[gameId]["gameServerIP"]) {
				app.NetManager().SendPack("room.CBaseGameTypeUrl", { "gametype": gameId }, function (success) {
					that.gameInfo[gameId]["isStart"] = success.isStart;
					that.gameInfo[gameId]["gameServerIP"] = success.gameServerIP;
					that.gameInfo[gameId]["gameServerPort"] = success.gameServerPort;
				}, function () {});
			}
		};

		for (var _i2 = 0; _i2 < allGameId.length; _i2++) {
			_loop(_i2);
		}
		return allGameId;
	},

	onDestroy: function onDestroy() {
		// console.log("游戏切换时应该销毁");
	},

	SetWaitForConfirm: function SetWaitForConfirm(msgID, type) {
		var msgArg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
		var cbArg = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
		var content = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
		var lbSure = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "";
		var lbCancle = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "";

		var ConfirmManager = app.ConfirmManager();
		ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
		ConfirmManager.ShowConfirm(type, msgID, msgArg, content, lbSure, lbCancle);
	},
	/**
  * 2次确认点击回调
  * @param curEventType
  * @param curArgList
  */
	OnConFirm: function OnConFirm(clickType, msgID, backArgList) {
		if (clickType != "Sure") {
			return;
		}
		if (msgID == "RESELECT_CITY") {
			var self = this;
			var selectCityConfig = app.SysDataManager().GetTableDict("selectCity");
			if (selectCityConfig[backArgList[0]]["Type"] != 3) {
				this.ShowSysMsg("需指定县级市，才能进入游戏");
				app.FormManager().ShowForm("UISelectCity");
				return;
			}
			//根据选择的城市向服务端请求所有游戏
			app.NetManager().SendPack("room.CBaseGameIdList", { "selectCityId": backArgList[0] }, function (event) {
				self.allGameIdFormServer = event.split(",");
				var curGameList = self.GetAllGameId();
				var argDict = {
					"gameList": curGameList
				};
				self.OnEvent("ShowGameListByLocation", argDict);
			}, function (event) {
				console.log("获取游戏id失败");
			});
		} else if ('MSG_EXIT_GAME' == msgID) {
			cc.game.end();
		} else if ("MSG_GO_ROOM" == msgID) {
			app.Client.SetGameType(backArgList[0]);
			app.FormManager().ShowForm("UIDownLoadGame", backArgList[0], 0, null, 0, 0, true);
		} else if ("MSG_CLOSE_MICPERMISSION" == msgID) {
			if (cc.sys.isNative) {
				app.NativeManager().CallToNative("ApplicationsSetting", []);
			}
		}
	}
});

cc._RF.pop();