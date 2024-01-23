/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDM Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package QZMJRoomMgr.js
 *  @todo: 龙岩麻将麻将
 *
 *  @date 2014-10-30 16:04
 *  @version 1.0
 *
 *  修改时间 修改人 修改内容
 *  -------------------------------------------------------------------------------
 *
 */
var app = require("qzmj_app");

/**
 * 类构造
 */
var QZMJRoomMgr = app.BaseClass.extend({

	/**
	 * 初始化
	 */
	Init: function () {

		this.JS_Name = app.subGameName.toUpperCase() + "RoomMgr";

		this.ComTool = app[app.subGameName + "_ComTool"]();
		this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
		this.NetManager = app[app.subGameName + "_NetManager"]();
		this.FormManager = app[app.subGameName + "_FormManager"]();
		this.SysNotifyManager = app[app.subGameName + "_SysNotifyManager"]();

		this.Room = app[app.subGameName.toUpperCase() + "Room"]();
		this.RoomSet = app[app.subGameName.toUpperCase() + "RoomSet"]();
		this.RoomPosMgr = app[app.subGameName.toUpperCase() + "RoomPosMgr"]();
		this.LocalDataManager = app.LocalDataManager();
		this.NetManager.RegNetPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "CreateRoom", this.OnPack_CreateRoom, this);
		this.NetManager.RegNetPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "GetRoomInfo", this.OnPack_GetRoomInfo, this);
		this.NetManager.RegNetPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "RoomRecord", this.OnPack_RoomRecord, this);

		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_CardReadyChg", this.OnPack_CardReadyChg, this);

		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_SetStart", this.OnPack_SetStart, this);
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_SetEnd", this.OnPack_SetEnd, this);

		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_StartRound", this.OnPack_StartRound, this);
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_Jin", this.OnPack_Jin, this);
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_PosGetCard", this.OnPack_PosGetCard, this);
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_PosOpCard", this.OnPack_PosOpCard, this);

		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_RoomEnd", this.OnPack_RoomEnd, this);
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_RoomStart", this.OnPack_RoomStart, this);
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_reward", this.OnPack_Reward, this);
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_Applique", this.OnPack_Applique, this);
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_SQOpCard", this.OnPack_SQOpCard, this);
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_SetPosCard", this.OnPack_SetPosCard, this);

		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_Promptly", this.OnPack_Promptly, this);

		// this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_PiaoFen", this.OnPack_PiaoFen, this);

		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_ChangeStatus", this.OnPack_ChangeStatus, this);

		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_Chatmessage", this.OnPack_ChatMessage, this);

		//比赛分通知
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_SportsPointNotEnough", this.OnPack_SportsPointNotEnough, this);
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_SportsPointEnough", this.OnPack_SportsPointEnough, this);
		this.NetManager.RegNetPack("SRoom_SportsPointChange", this.OnPack_SportsPointChange, this);

		this.HeroManager = app[app.subGameName + "_HeroManager"]();

		this.OnReload();

		this.Log("Init");

	},

	/**
	 * 重登
	 */
	OnReload: function () {
		this.enterRoomID = 0;
		//获取启动客户端进入的房间KEY
		this.loginEnterRoomKey = 0;

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
		let agrs = Object.keys(serverPack);
		if (0 == agrs.length)//俱乐部会回空包
			return;
		if (serverPack.createType == 2) {
			app[app.subGameName + "_FormManager"]().ShowForm('UIDaiKai');
			app[app.subGameName + "_FormManager"]().CloseForm('UICreatRoom');
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
		}
		else if (serverPack["NotFind_Room"]) {
			app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('Room_NotFindRoom');
			app[app.subGameName + "Client"].ExitGame();
			return;
		}


		this.enterRoomID = serverPack["roomID"];
		this.clubId = serverPack["cfg"]["clubId"];
		this.unionId = serverPack["cfg"]["unionId"];
		this.Room.OnInitRoomData(serverPack);
		//进入打牌场景
		app[app.subGameName + "_SceneManager"]().LoadScene(app.subGameName + "Scene");
		if (app[app.subGameName + "_SceneManager"]().GetSceneType() != app.subGameName + "Scene") {
			app[app.subGameName + "_SceneManager"]().LoadScene(app.subGameName + "Scene");
		} else {
			let lastIs3DShow = app.LocalDataManager().GetConfigProperty("SysSetting", app.subGameName + "_is3DShow");
			if (lastIs3DShow == 1) {
				app[app.subGameName + "_FormManager"]().ShowForm("game/" + app.subGameName.toUpperCase() + "/ui/UI" + app.subGameName.toUpperCase() + "Play");
			} else if (lastIs3DShow == 2) {
				app[app.subGameName + "_FormManager"]().ShowForm("game/" + app.subGameName.toUpperCase() + "/ui/UI" + app.subGameName.toUpperCase() + "WBPlay");
			} else if (lastIs3DShow == 0) {
				app[app.subGameName + "_FormManager"]().ShowForm("game/" + app.subGameName.toUpperCase() + "/ui/UI" + app.subGameName.toUpperCase() + "2DPlay");
			}
		}
	},
	//--------------notify-----------------

	//set开始
	OnPack_SetStart: function (serverPack) {
		console.log("set开始 OnPack_SetStart", serverPack);
		let roomID = serverPack["roomID"];
		let setInfo = serverPack["setInfo"];
		this.Room.OnSetStart(setInfo);
		app[app.subGameName + "Client"].OnEvent(app.subGameName.toUpperCase() + "_SetStart", serverPack);
		app[app.subGameName + "Client"].OnEvent("SetStart", serverPack);
	},

	//set结束
	OnPack_SetEnd: function (serverPack) {
		console.log("set结束 OnPack_SetEnd", serverPack);
		let roomID = serverPack["roomID"];
		let setEnd = serverPack["setEnd"];
		this.Room.OnSetEnd(setEnd);
		app[app.subGameName + "Client"].OnEvent(app.subGameName.toUpperCase() + "_SetEnd", serverPack);
	},

	//开金
	OnPack_Jin: function (serverPack) {
		console.log("开金", serverPack);
		let roomID = serverPack["roomID"];
		let jin = serverPack["jin"];
		app[app.subGameName + "Client"].OnEvent(app.subGameName.toUpperCase() + "_Jin", serverPack);
	},

	//round开始
	OnPack_StartRound: function (serverPack) {
		console.log("round开始 OnPack_StartRound", serverPack);
		let roomID = serverPack["roomID"];
		let setRound = serverPack["room_SetWait"];
		this.Room.GetRoomSet().OnStartRound(setRound);
		app[app.subGameName + "Client"].OnEvent(app.subGameName.toUpperCase() + "_StartRound", serverPack);
	},

	//位置抓牌
	OnPack_PosGetCard: function (serverPack) {
		console.log("位置抓牌 OnPack_PosGetCard", serverPack);
		let roomID = serverPack["roomID"];
		let pos = serverPack["pos"];
		let normalMoCnt = serverPack["normalMoCnt"];
		let gangMoCnt = serverPack["gangMoCnt"];
		let setPos = serverPack["set_Pos"];
		let roomSet = this.Room.GetRoomSet();
		let oldNormalMoCnt = roomSet.GetRoomSetProperty("normalMoCnt");
		let oldGangMoCnt = roomSet.GetRoomSetProperty("gangMoCnt");
		let isNormal = true;
		if (normalMoCnt > oldNormalMoCnt) {
			isNormal = true;
		}
		else if (gangMoCnt > oldGangMoCnt) {
			isNormal = false;
		}
		else {
			this.ErrLog("OnPack_PosGetCard(%s,%s) old(%s,%s)", normalMoCnt, gangMoCnt, oldNormalMoCnt, oldGangMoCnt);
		}
		if (roomSet.OnPosGetCard(pos, setPos, normalMoCnt, gangMoCnt)) {
			serverPack["isNormal"] = isNormal;
			app[app.subGameName + "Client"].OnEvent(app.subGameName.toUpperCase() + "_PosGetCard", serverPack);
		}
		else {
			this.ErrLog("OnPack_PosGetCard:", serverPack);
		}

	},

	//位置执行动作通知
	OnPack_PosOpCard: function (serverPack) {
		console.log("位置执行动作通知 OnPack_PosOpCard", serverPack);
		let roomID = serverPack["roomID"];
		if (this.Room.UpdataInfo(serverPack)) {
			app[app.subGameName + "Client"].OnEvent(app.subGameName.toUpperCase() + "_PosOpCard", serverPack);
		}
		else {
			this.ErrLog("OnPack_PosOpCard serverPack:", serverPack);
		}
	},
	//更新玩家分数
	OnPack_Promptly: function (serverPack) {
		let roomID = serverPack["roomID"];
		let setPosList = serverPack["playerPosInfoList"];
		this.RoomPosMgr.UpdatePoint(setPosList);
		app[app.subGameName + "Client"].OnEvent(app.subGameName.toUpperCase() + "_Promptly", serverPack);
	},
	OnPack_ChangeStatus: function (serverPack) {
		this.Room.OnSetWaiting(serverPack);
		let state = this.ShareDefine.SetStateStringDict[serverPack["state"]];
		this.RoomSet.SetState(state);
		let dPos = serverPack.dPos;
		this.RoomSet.UpdateDPos(dPos);
		app[app.subGameName + "Client"].OnEvent(app.subGameName.toUpperCase() + "_ChangeStatus", serverPack);
	},

	// OnPack_PiaoFen:function(serverPack){
 //    	app[app.subGameName + "Client"].OnEvent(app.subGameName.toUpperCase() + "_PiaoFen", serverPack);
 //    },
	OnPack_ChatMessage: function (serverPack) {
		app[app.subGameName + "Client"].OnEvent("ChatMessage", serverPack);
	},

	//更新用户手牌
	OnPack_SetPosCard: function (serverPack) {
		console.log("更新用户手牌 OnPack_SetPosCard", serverPack);
		let roomID = serverPack["roomID"];
		let setPosList = serverPack["setPosList"];
		this.RoomSet.InitSetPosList(setPosList);
		app[app.subGameName + "Client"].OnEvent(app.subGameName.toUpperCase() + "_SetPosCard", serverPack);
	},

	//位置补花
	OnPack_Applique: function (serverPack) {
		let roomID = serverPack["roomID"];
		if (this.Room.UpdataInfo(serverPack)) {
			app[app.subGameName + "Client"].OnEvent(app.subGameName.toUpperCase() + "_Applique", serverPack);
		}
		else {
			this.ErrLog("OnPack_Applique serverPack:", serverPack);
		}
	},

	//抢金三金倒
	OnPack_SQOpCard: function (serverPack) {
		let roomID = serverPack["roomID"];
		let setRound = serverPack["room_SetWait"];
		this.Room.GetRoomSet().OnStartRound(setRound);
		app[app.subGameName + "Client"].OnEvent(app.subGameName.toUpperCase() + "_SQOpCard", serverPack);
	},

	//房间开始
	OnPack_RoomStart: function (serverPack) {
		this.ErrLog("OnPack_RoomStart:", serverPack);
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
		app[app.subGameName + "Client"].OnEvent("RoomEnd", serverPack);
	},

	//获取对局记录信息
	OnPack_RoomRecord: function (serverPack) {
		let records = serverPack["records"];
		let everyGameKeys = Object.keys(records);
		for (let i = 0; i < everyGameKeys.length; i++) {
			let everyGame = records[everyGameKeys[i]];
			let posResultList = everyGame["posResultList"];
			let posResultListKeys = Object.keys(posResultList);
			for (let j = 0; j < posResultListKeys.length; j++) {
				let player = posResultList[posResultListKeys[j]];
				let huType = player["huType"];
				player["huType"] = this.ShareDefine.HuTypeStringDict[huType];
			}
		}

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
			this.ErrLog("GetEnterRoom not enterRoom");
			return
		}
		return this.Room
	},

	//删除打出的卡牌
	DeleteOutCard: function (cardID) {
		let findPos = this.Room.OnDeleteOutCard(cardID);
		//如果找到需要删除的卡牌
		if (findPos != -1) {
			app[app.subGameName + "Client"].OnEvent(app.subGameName.toUpperCase() + "_DeleteOutCard", {"pos": findPos});
		}
	},

	//-----------------------发包函数-----------------------------


	//登录获取当前进入的房间ID
	SendGetCurRoomID: function () {
		this.NetManager.SendPack("game.C1101GetRoomID", {});
	},

	//发送创建房间
	SendCreateRoom: function (sendPack) {
		console.log("发送创建房间参数", sendPack);
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "CreateRoom", sendPack, function (success) {
			console.log("创建房间成功");
		}, function (error) {
			console.log("创建房间失败", error);
		});
	},
	//获取房间信息
	SendGetRoomInfo: function (roomID, callback) {
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "GetRoomInfo", {"roomID": roomID}, function (success) {

		}, function (error) {
			app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('Room_NotFindRoom');
			app[app.subGameName + "Client"].ExitGame();
			return;
		});
	},

	//开始游戏
	SendStartRoomGame: function (roomID) {
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "StartGame", {"roomID": roomID});
	},

	//发送继续游戏
	SendContinueGame: function (roomID) {
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "BaseContinueGame", {"roomID": roomID});
	},


	//发送位置执行指令
	SendPosAction: function (cardID, opType) {
		if (!this.enterRoomID) {
			this.ErrLog("SendPosAction not enterRoomID");
			return
		}
		let roomID = this.enterRoomID;

		let roomSet = this.GetEnterRoom().GetRoomSet();
		if (!roomSet) {
			this.ErrLog("SendPosAction not find roomSet");
			return
		}
		let setID = roomSet.GetRoomSetProperty("setID");
		let setRound = roomSet.GetRoomSetProperty("setRound");
		if (!setRound) {
			this.ErrLog("SendPosAction not find setRound");
			return
		}
		let roundID = setRound["waitID"];
		let sendPack = {
			"roomID": roomID,
			"setID": setID,
			"roundID": roundID,
			"cardID": cardID,
			"opType": opType,
		};
		this.NetManager.SendPack(app.subGameName.toUpperCase() + ".C" + app.subGameName.toUpperCase() + "OpCard", sendPack, (data) => {
			console.log("打牌成功", data);
			this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIMJHuPai");
			let is3DShow = this.LocalDataManager.GetConfigProperty("SysSetting", app.subGameName + "_is3DShow");
			if (opType == this.ShareDefine.OpType_Out) {
				if (is3DShow == 1) {
					this.FormManager.GetFormComponentByFormName("game/" + app.subGameName.toUpperCase() + "/ui/UI" + app.subGameName.toUpperCase() + "Play").Pre_OutCard(cardID);
				} else if (is3DShow == 0) {
					this.FormManager.GetFormComponentByFormName("game/" + app.subGameName.toUpperCase() + "/ui/UI" + app.subGameName.toUpperCase() + "2DPlay").Pre_OutCard(cardID);
				} else {
					this.FormManager.GetFormComponentByFormName("game/" + app.subGameName.toUpperCase() + "/ui/UI" + app.subGameName.toUpperCase() + "WBPlay").Pre_OutCard(cardID);
				}
			}
		}, (error) => {
			console.log("打牌失败", error)
		});
	},
	//不抢金不三金倒
	SendSqPass: function (cardID, opType) {
		if (!this.enterRoomID) {
			this.ErrLog("SendSqPass not enterRoomID");
			return
		}
		let roomID = this.enterRoomID;

		let roomSet = this.GetEnterRoom().GetRoomSet();
		if (!roomSet) {
			this.ErrLog("SendSqPass not find roomSet");
			return
		}
		let setID = roomSet.GetRoomSetProperty("setID");
		let setRound = roomSet.GetRoomSetProperty("setRound");
		if (!setRound) {
			this.ErrLog("SendSqPass not find setRound");
			return
		}
		let roundID = setRound["waitID"];
		let sendPack = {
			"roomID": roomID,
			"setID": setID,
			"roundID": roundID,
			"cardID": cardID,
			"opType": opType,
		};
		this.NetManager.SendPack(app.subGameName.toUpperCase() + ".C" + app.subGameName.toUpperCase() + "SQOpCard", sendPack);
	},
	//退出房间
	SendExitRoom: function (roomID, pos) {
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ExitRoom", {
			"roomID": roomID,
			"posIndex": pos
		});
	},
	//请求对局记录封包
	SendRoomRecord: function (roomID) {
		this.NetManager.SendPack(app.subGameName.toUpperCase() + ".C" + app.subGameName.toUpperCase() + "RoomRecord", {"roomID": roomID});
	},
	//请求飘分封包
	SendPiaoFen:function (piaoFen) {
		if(!this.enterRoomID){
			this.ErrLog("SendPiaoFen not enterRoomID");
			return
		}
		let roomID = this.enterRoomID;
        this.NetManager.SendPack(app.subGameName.toUpperCase() + ".C" + app.subGameName.toUpperCase() + "PiaoFen", {"roomID":roomID, "piaoFen":piaoFen});
    },

})


var g_QZMJRoomMgr = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_QZMJRoomMgr)
		g_QZMJRoomMgr = new QZMJRoomMgr();
	return g_QZMJRoomMgr;

}
