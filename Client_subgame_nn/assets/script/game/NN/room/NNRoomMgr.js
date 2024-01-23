/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDM Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package LZMJRoomMgr.js
 *  @todo: 龙岩麻将麻将
 *
 *  @date 2014-10-30 16:04
 *  @version 1.0
 *
 *  修改时间 修改人 修改内容
 *  -------------------------------------------------------------------------------
 *
 */
var app = require("nn_app");

/**
 * 类构造
 */
var LZMJRoomMgr = app.BaseClass.extend({

	/**
	 * 初始化
	 */
	Init: function () {

		this.JS_Name = app["subGameName"] + "RoomMgr";

		this.ComTool = app[app.subGameName + "_ComTool"]();
		this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
		this.NetManager = app[app.subGameName + "_NetManager"]();
		this.FormManager = app[app.subGameName + "_FormManager"]();
		this.SysNotifyManager = app[app.subGameName + "_SysNotifyManager"]();
		this.LocalDataManager = app.LocalDataManager();

		this.Room = app[app.subGameName.toUpperCase() + "Room"]();

		this.NetManager.RegNetPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "CreateRoom", this.OnPack_CreateRoom, this);
		this.NetManager.RegNetPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "GetRoomInfo", this.OnPack_GetRoomInfo, this);
		this.NetManager.RegNetPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "RoomRecord", this.OnPack_RoomRecord, this);

		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_CardReadyChg", this.OnPack_CardReadyChg, this);

		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_SetStart", this.OnPack_SetStart, this);
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_StatusChange", this.OnPack_StatusChange, this);
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_SetEnd", this.OnPack_SetEnd, this);
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_OpenCard", this.OnPack_OpenCard, this);
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_AddBet", this.OnPack_AddBet, this);
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_CallBacker", this.OnPack_CallBacker, this);

		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_StartRound", this.OnPack_StartRound, this);
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_PosOpCard", this.OnPack_PosOpCard, this);

		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_RoomEnd", this.OnPack_RoomEnd, this);
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_RoomStart", this.OnPack_RoomStart, this);
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_reward", this.OnPack_Reward, this);
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_SetPosCard", this.OnPack_SetPosCard, this);
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_Chatmessage", this.OnPack_ChatMessage, this);

		//比赛分通知
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_SportsPointNotEnough", this.OnPack_SportsPointNotEnough, this);
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_SportsPointEnough", this.OnPack_SportsPointEnough, this);
		this.NetManager.RegNetPack("SRoom_SportsPointChange", this.OnPack_SportsPointChange, this);

		this.HeroManager = app[app.subGameName + "_HeroManager"]();

		this.OnReload();

		//console.log("Init");

	},

	/**
	 * 重登
	 */
	OnReload: function () {
		this.enterRoomID = 0;
		//获取启动客户端进入的房间KEY
		console.loginEnterRoomKey = 0;

		this.Room.OnReload();
	},

	OnSwithSceneEnd: function (sceneType) {

		//如果退出房间场景了,清除数据
		if (sceneType != "fightScene") {
			this.OnReload();
		}
	},
	CheckOnEvent: function (serverPack) {
		if (serverPack["roomID"] == this.enterRoomID) {
			return true;
		}
		return false;
	},
	//----------------------收包接口-----------------------------


	//创建房间完成
	OnPack_CreateRoom: function (serverPack) {
		console.log("创建房间完成 OnPack_CreateRoom", serverPack);
		let agrs = Object.keys(serverPack);
		if (0 == agrs.length) {//俱乐部会回空包
			return;
		}
		if (serverPack.createType == 2) {
			app.FormManager().ShowForm('UIDaiKai');
			app.FormManager().CloseForm('UICreatRoom');
		} else {
			this.SendGetRoomInfo(serverPack.roomID);
		}
	},


	//获取到房间完整信息
	OnPack_GetRoomInfo: function (serverPack) {
		console.log("获取到房间完整信息 OnPack_GetRoomInfo", serverPack);
		if (serverPack["NotFind_Player"]) {
			app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('PLAYER_NOT_ROOM');
			app[app.subGameName + "Client"].ExitGame();
			return;
		} else if (serverPack["NotFind_Room"]) {
			app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('Room_NotFindRoom');
			app[app.subGameName + "Client"].ExitGame();
			return;
		}


		this.enterRoomID = serverPack["roomID"];
		this.clubId = serverPack["cfg"]["clubId"];
		this.unionId = serverPack["cfg"]["unionId"];
		this.Room.OnInitRoomData(serverPack);
		this.Room.OnDissolve(serverPack.dissolve);
		//进入打牌场景
		if (app[app.subGameName + "_SceneManager"]().GetSceneType() != app.subGameName + "Scene") {
			app[app.subGameName + "_SceneManager"]().LoadScene(app.subGameName + "Scene");
		} else {
			app[app.subGameName + "_FormManager"]().ShowForm("game/" + app.subGameName.toUpperCase() + "/ui/UI" + app.subGameName.toUpperCase() + "Play");
		}
	},
	//--------------notify-----------------


	//set开始
	OnPack_SetStart: function (serverPack) {
		console.log("set开始 OnPack_SetStart", serverPack);
		let roomID = serverPack["roomID"];
		let setInfo = serverPack["setInfo"];
		this.Room.OnSetStart(setInfo);
		this.Room.SetGameStateTime(setInfo.startTime);
		// app[app.subGameName + "Client"].OnEvent(app.subGameName.toUpperCase() + "_SetStart", serverPack);
		app[app.subGameName + "Client"].OnEvent("SetStart", serverPack);
	},
	OnPack_StatusChange: function (serverPack) {
		console.log("状态改变 OnPack_StatusChange", serverPack);
		this.Room.OnStatusChange(serverPack);
		this.Room.SetGameStateTime(serverPack.startTime);
		app[app.subGameName + "Client"].OnEvent("NN_StatusChange", serverPack);
	},

	//set结束
	OnPack_SetEnd: function (serverPack) {
		console.log("set结束 OnPack_SetEnd", serverPack);
		this.Room.OnSetEnd(serverPack);
		this.Room.SetGameStateTime(serverPack.startTime);
		app[app.subGameName + "Client"].OnEvent("SetEnd", serverPack);
	},
	//有玩家亮牌
	OnPack_OpenCard: function (serverPack) {
		console.log("有玩家亮牌 OnPack_OpenCard", serverPack);
		let pos = serverPack["pos"];
		this.Room.SetOpenPoker(pos);
		app[app.subGameName + "Client"].OnEvent("NN_OpenCard", serverPack);
	},
	//玩家下注
	OnPack_AddBet: function (serverPack) {
		console.log("玩家下注 OnPack_AddBet", serverPack);
		let pos = serverPack["pos"];
		let addBet = serverPack["addBet"];
		this.Room.SetAddBet(pos, addBet);
		app[app.subGameName + "Client"].OnEvent("NN_AddBet", serverPack);
	},
	//抢庄家
	OnPack_CallBacker: function (serverPack) {
		console.log("OnPack_CallBacker", serverPack);
		let pos = serverPack["pos"];
		let callBackerNum = serverPack["callBackerNum"];
		this.Room.SetCallBacker(pos, callBackerNum);
		app[app.subGameName + "Client"].OnEvent("NN_CallBacker", serverPack);
	},
	//round开始
	OnPack_StartRound: function (serverPack) {
		console.log("round开始 OnPack_StartRound", serverPack);
		let roomID = serverPack["roomID"];
		let setRound = serverPack["room_SetWait"];
		this.Room.GetRoomSet().OnStartRound(setRound);
		app[app.subGameName + "Client"].OnEvent(app.subGameName.toUpperCase() + "_StartRound", serverPack);
	},

	//位置执行动作通知
	OnPack_PosOpCard: function (serverPack) {
		let roomID = serverPack["roomID"];
		if (this.Room.UpdataInfo(serverPack)) {
			app[app.subGameName + "Client"].OnEvent(app.subGameName.toUpperCase() + "_PosOpCard", serverPack);
		} else {
			console.error("OnPack_PosOpCard serverPack:", serverPack);
		}
	},
	//更新用户手牌
	OnPack_SetPosCard: function (serverPack) {
		let roomID = serverPack["roomID"];
		let setPosList = serverPack["setPosList"];
		this[app.subGameName.toUpperCase() + "RoomSet"].InitSetPosList(setPosList);
		app[app.subGameName + "Client"].OnEvent(app.subGameName.toUpperCase() + "_SetPosCard", serverPack);
	},
	//局内消息表情
	OnPack_ChatMessage: function (serverPack) {
		app[app.subGameName + "Client"].OnEvent("ChatMessage", serverPack);
	},

	//房间开始
	OnPack_RoomStart: function (serverPack) {
		console.log("房间开始 OnPack_RoomStart", serverPack);
		console.error("OnPack_RoomStart:", serverPack);
		app[app.subGameName + "Client"].OnEvent("RoomStart", {});
	},
	//比赛分不足时通知
	OnPack_SportsPointNotEnough: function (serverPack) {
		app[app.subGameName + "Client"].OnEvent("SportsPointNotEnough", serverPack);
	},
	OnPack_SportsPointEnough: function (serverPack) {
		app[app.subGameName + "Client"].OnEvent("SportsPointEnough", serverPack);
	},
	//玩家的比赛分在游戏外被改变通知
	OnPack_SportsPointChange: function (serverPack) {
		this.Room.OnSportsPointChange(serverPack);
		app[app.subGameName + "Client"].OnEvent("RoomSportsPointChange", serverPack);
	},
	//房间结束
	OnPack_RoomEnd: function (serverPack) {
		this.Room.OnRoomEnd(serverPack);
		app[app.subGameName + "Client"].OnEvent("NN_RoomEnd", serverPack);
	},

	//获取对局记录信息
	OnPack_RoomRecord: function (serverPack) {
		let records = serverPack["records"];
		this.Room.RoomRecord(records);
		app[app.subGameName + "Client"].OnEvent("RoomRecord", records);
	},
	//收到玩家打赏
	OnPack_Reward: function (serverPack) {
		app[app.subGameName + "Client"].OnEvent("Reward", serverPack);
	},


	OnPack_CardReadyChg: function (serverPack) {
		app[app.subGameName + "Client"].OnEvent(app.subGameName.toUpperCase() + "_EVT_Card_Ready");
	},


	//---------------------获取接口------------------------------
	GetEnterRoomID: function () {
		return this.enterRoomID
	},

	GetEnterRoom: function () {
		if (!this.enterRoomID) {
			console.error("GetEnterRoom not enterRoom");
			return;
		}
		return this.Room;
	},

	//-----------------------发包函数-----------------------------


	//登录获取当前进入的房间ID
	SendGetCurRoomID: function () {
		this.NetManager.SendPack("game.C1101GetRoomID", {});
	},

	//发送创建房间
	SendCreateRoom: function (sendPack) {
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "CreateRoom", sendPack, (success) => {
			console.log("创建房间成功", success);
		}, (error) => {
			console.log("创建房间失败", error, sendPack);
		});
	},
	//获取房间信息
	SendGetRoomInfo: function (roomID, callback) {
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "GetRoomInfo", {"roomID": roomID}, callback);
	},

	//开始游戏
	SendStartRoomGame: function (roomID) {
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "StartGame", {"roomID": roomID}, (success) => {
		// this.NetManager.SendPack("room.CBaseStartGame", {"roomID": roomID}, (success) => {
			console.log("开始游戏", success);
		}, (error) => {
			console.log("开始游戏", error, roomID);
		});
	},

	//发送继续游戏
	SendContinueGame: function (roomID) {
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ContinueGame", {"roomID": roomID}, (success) => {
			console.log("发送继续游戏", success);
		}, (error) => {
			console.log("发送继续游戏", error, roomID);
		});
	},
	//发送等待继续游戏时间
	SendTimeOutContinue: function () {
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "TimeOutContinue", {"roomID": this.enterRoomID});
	},
	//抢庄
	SendLootBanker: function (roomID, pos, num) {
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "CallBacker", {
			"roomID": roomID,
			"pos": pos,
			"callBackerNum": num
		}, (success) => {
			console.log("抢庄", success);
		}, (error) => {
			console.log("抢庄", error, roomID, pos, num);
		});
	},
	//取消抢庄
	SendCancelBanker: function (roomID, pos) {
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "Shimosho", {
			"roomID": roomID,
			"pos": pos
		}, (success) => {
			console.log("取消抢庄", success);
		}, (error) => {
			console.log("取消抢庄", error, roomID, pos);
		});
	},
	//查看自己的牌
	SendLookPoker: function (roomID, pos) {
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "CheckCard", {
			"roomID": roomID,
			"pos": pos
		}, (success) => {
			console.log("查看自己的牌", success);
		}, (error) => {
			console.log("查看自己的牌", error, roomID, pos);
		});
	},
	//亮牌
	SendShowPoker: function (roomID, pos) {
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "OpenCard", {
			"roomID": roomID,
			"pos": pos,
			"isSelectCard": false,
			"cardList": []
		}, (success) => {
			console.log("查看自己的牌", success);
		}, (error) => {
			console.log("查看自己的牌", error, roomID, pos);
		});
	},
	//下注
	SendBet: function (roomID, pos, score) {
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "AddBet", {
			"roomID": roomID,
			"pos": pos,
			"addBet": score
		}, (success) => {
			console.log("下注", success);
		}, (error) => {
			console.log("下注", error, roomID, pos, score);
		});
	},
	//退出房间
	SendExitRoom: function (roomID, pos) {
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ExitRoom", {
			"roomID": roomID,
			"posIndex": pos
		}, (success) => {
			console.log("退出房间", success);
		}, (error) => {
			console.log("退出房间", error, roomID, pos);
		});
	},

	//请求对局记录封包
	SendRoomRecord: function (roomID) {
		this.NetManager.SendPack(app.subGameName.toUpperCase() + ".C" + app.subGameName.toUpperCase() + "RoomRecord", {"roomID": roomID}, (success) => {
			console.log("请求对局记录封包", success);
		}, (error) => {
			console.log("请求对局记录封包", error, roomID);
		});
	},
});


var g_LZMJRoomMgr = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_LZMJRoomMgr)
		g_LZMJRoomMgr = new LZMJRoomMgr();
	return g_LZMJRoomMgr;

}
