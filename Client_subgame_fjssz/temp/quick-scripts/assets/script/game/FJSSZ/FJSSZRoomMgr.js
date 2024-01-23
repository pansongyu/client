(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/game/FJSSZ/FJSSZRoomMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fjssz953-e450-4c23-9b49-10e0e30348f3', 'FJSSZRoomMgr', __filename);
// script/game/FJSSZ/FJSSZRoomMgr.js

"use strict";

/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDM Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package FJSSZRoomMgr.js
 *  @todo: 自由扑克麻将
 *
 *  @date 2014-10-30 16:04
 *  @version 1.0
 *
 *  修改时间 修改人 修改内容
 *  -------------------------------------------------------------------------------
 *
 */
var app = require("fjssz_app");

/**
 * 类构造
 */
var FJSSZRoomMgr = app.BaseClass.extend({

	/**
  * 初始化
  */
	Init: function Init() {
		this.gameName = app["subGameName"];
		this.JS_Name = this.gameName.toUpperCase() + "RoomMgr";

		this.ComTool = app[this.gameName + "_ComTool"]();
		this.ShareDefine = app[this.gameName + "_ShareDefine"]();
		this.NetManager = app[this.gameName + "_NetManager"]();
		this.SysNotifyManager = app[this.gameName + "_SysNotifyManager"]();

		this.Room = app[this.gameName.toUpperCase() + "Room"]();
		this.RoomPosMgr = app[this.gameName.toUpperCase() + "RoomPosMgr"]();

		this.NetManager.RegNetPack(this.gameName + ".C" + this.gameName.toUpperCase() + "CreateRoom", this.OnPack_CreateRoom, this);
		this.NetManager.RegNetPack(this.gameName + ".C" + this.gameName.toUpperCase() + "GetRoomInfo", this.OnPack_GetRoomInfo, this);
		this.NetManager.RegNetPack(this.gameName + ".C" + this.gameName.toUpperCase() + "RoomRecord", this.OnPack_RoomRecord, this);

		//notify
		this.NetManager.RegNetPack("S" + this.gameName.toUpperCase() + "_CardReadyChg", this.OnPack_CardReadyChg, this);
		this.NetManager.RegNetPack("S" + this.gameName.toUpperCase() + "_ChangeStatus", this.OnPack_ChangeStatus, this);
		this.NetManager.RegNetPack("S" + this.gameName.toUpperCase() + "_SetStart", this.OnPack_SetStart, this);
		this.NetManager.RegNetPack("S" + this.gameName.toUpperCase() + "_SetEnd", this.OnPack_SetEnd, this);
		this.NetManager.RegNetPack("S" + this.gameName.toUpperCase() + "_RoomEnd", this.OnPack_RoomEnd, this);
		this.NetManager.RegNetPack("S" + this.gameName.toUpperCase() + "_RoomStart", this.OnPack_RoomStart, this);
		this.NetManager.RegNetPack("S" + this.gameName.toUpperCase() + "_PosUpdate", this.OnPack_PosUpdate, this);
		this.NetManager.RegNetPack("S" + this.gameName.toUpperCase() + "_reward", this.OnPack_Reward, this);
		this.NetManager.RegNetPack("S" + this.gameName.toUpperCase() + "_Result", this.OnPack_RankingResult, this);
		this.NetManager.RegNetPack("S" + this.gameName.toUpperCase() + "_BeiShuSelect", this.OnPack_BeiShuSelect, this);
		this.NetManager.RegNetPack("S" + this.gameName.toUpperCase() + "_YaZhuBeiShu", this.OnPack_YaZhuBeiShu, this);
		this.NetManager.RegNetPack("S" + this.gameName.toUpperCase() + "_SetZhuangJia", this.OnPack_ZJBeiShu, this);
		this.NetManager.RegNetPack("S" + this.gameName.toUpperCase() + "_QiangZhuangBeiShu", this.OnPack_QiangZhuangBeiShu, this);
		this.NetManager.RegNetPack("S" + this.gameName.toUpperCase() + "_Chatmessage", this.OnPack_ChatMessage, this);

		//竞技点通知
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
	OnReload: function OnReload() {
		this.enterRoomID = 0;
		//获取启动客户端进入的房间KEY
		this.loginEnterRoomKey = 0;

		this.Room.OnReload();
	},

	OnSwithSceneEnd: function OnSwithSceneEnd(sceneType) {
		//如果退出房间场景了,清除数据
		if (sceneType != "fightScene") {
			this.OnReload();
		}
	},

	//----------------------收包接口-----------------------------
	//创建房间完成
	OnPack_CreateRoom: function OnPack_CreateRoom(serverPack) {
		var agrs = Object.keys(serverPack);
		if (0 == agrs.length) //亲友圈会回空包
			return;
		if (serverPack.createType == 2) {
			app[app.subGameName + "_FormManager"]().ShowForm('UIDaiKai');
			app[app.subGameName + "_FormManager"]().CloseForm('UICreatRoom');
		} else {
			this.SendGetRoomInfo(serverPack.roomID);
		}
	},
	//获取到房间完整信息
	OnPack_GetRoomInfo: function OnPack_GetRoomInfo(serverPack) {
		console.log("获取到房间完整信息 OnPack_GetRoomInfo", serverPack["key"], serverPack);
		if (serverPack["NotFind_Player"]) {
			this.SysNotifyManager.ShowSysMsg("PLAYER_NOT_ROOM");
			app[app.subGameName + "Client"].ExitGame();
			return;
		} else if (serverPack["NotFind_Room"]) {
			this.SysNotifyManager.ShowSysMsg("Room_NotFindRoom");
			app[app.subGameName + "Client"].ExitGame();
			return;
		}

		this.enterRoomID = serverPack["roomID"];
		this.clubId = serverPack["cfg"]["clubId"];
		this.unionId = serverPack["cfg"]["unionId"];
		this.Room.OnInitRoomData(serverPack);
		this.Room.OnTotalScoreFromLogin(serverPack.posList);
		this.Room.OnDissolve(serverPack.dissolve);
		for (var idx = 0; idx < serverPack.posList.length - this.ShareDefine.LookCount; idx++) {
			var playerInfo = serverPack.posList[idx];
			if (app[app.subGameName + "_HeroManager"]().GetHeroID() == playerInfo.pid) {
				app[app.subGameName + "_GameManager"]().SetAutoPlayIng(playerInfo.trusteeship);
			}
		}
		//进入打牌场景
		if (app[app.subGameName + "_SceneManager"]().GetSceneType() != "gdyScene") {
			app[app.subGameName + "_SceneManager"]().LoadScene(app.subGameName + "Scene");
		} else {
			app[app.subGameName + "_FormManager"]().ShowForm("game/" + app.subGameName.toUpperCase() + "/UILSPlay");
		}
	},
	//--------------notify-----------------

	//倍数选择通知
	OnPack_BeiShuSelect: function OnPack_BeiShuSelect(serverPack) {
		console.log("倍数选择通知 OnPack_BeiShuSelect", serverPack);
		app[app.subGameName + "Client"].OnEvent(this.gameName.toUpperCase() + "_BeiShu", serverPack);
	},

	//通知玩家谁抢到庄了 多少倍	
	OnPack_ZJBeiShu: function OnPack_ZJBeiShu(serverPack) {
		console.log("通知玩家谁抢到庄了 OnPack_ZJBeiShu", serverPack);
		this.Room.OnZhuangJia(serverPack["posID"], serverPack["beiShu"]);
		app[app.subGameName + "Client"].OnEvent(this.gameName.toUpperCase() + "_ZJBeiShu", serverPack);
	},
	//通知玩家谁加了多少倍
	OnPack_YaZhuBeiShu: function OnPack_YaZhuBeiShu(serverPack) {
		console.log("通知玩家谁加了多少倍 OnPack_YaZhuBeiShu", serverPack);
		app[app.subGameName + "Client"].OnEvent(this.gameName.toUpperCase() + "_YaZhuBeiShu", serverPack);
	},
	//通知玩家谁抢庄了 多少倍
	OnPack_QiangZhuangBeiShu: function OnPack_QiangZhuangBeiShu(serverPack) {
		console.log("通知玩家谁抢庄了 OnPack_QiangZhuangBeiShu", serverPack);
		this.Room.OnZhuangJia(serverPack["posID"], serverPack["beiShu"]);
		app[app.subGameName + "Client"].OnEvent(this.gameName.toUpperCase() + "_QiangZhuangBeiShu", serverPack);
	},

	//set开始
	OnPack_SetStart: function OnPack_SetStart(serverPack) {
		var roomID = serverPack["roomID"];
		var setInfo = serverPack["setInfo"];
		this.Room.OnSetStart(setInfo);
		app[app.subGameName + "Client"].OnEvent("FJSSZSetStart", serverPack);
	},

	//set结束
	OnPack_SetEnd: function OnPack_SetEnd(serverPack) {
		var roomID = serverPack["roomID"];
		var setEnd = serverPack["setState"];
		this.Room.OnSetEnd(setEnd);
		app[app.subGameName + "Client"].OnEvent("FJSSZSetEnd", serverPack);
	},

	//房间开始
	OnPack_RoomStart: function OnPack_RoomStart(serverPack) {
		console.error("OnPack_RoomStart:", serverPack);
		app[app.subGameName + "Client"].OnEvent("RoomStart", {});
	},
	//位置变化通知
	OnPack_PosUpdate: function OnPack_PosUpdate(serverPack) {
		console.log("位置变化通知 OnPack_PosUpdate", serverPack);
		if (this.enterRoomID == serverPack["roomID"]) {
			this.RoomPosMgr.OnInitRoomPosData(serverPack["posList"]);
			this.Room.SetRoomProperty("posList", serverPack["posList"]);
			app[app.subGameName + "Client"].OnEvent("FJSSZ_AllPosUpdate", serverPack["posList"]);
		}
	},
	//房间结束
	OnPack_RoomEnd: function OnPack_RoomEnd(serverPack) {
		this.Room.OnRoomEnd(serverPack);
	},

	//获取对局记录信息
	OnPack_RoomRecord: function OnPack_RoomRecord(serverPack) {
		var records = serverPack["records"];
		this.Room.RoomRecord(records);
		app[app.subGameName + "Client"].OnEvent("RoomRecord", records);
	},
	//收到玩家打赏
	OnPack_Reward: function OnPack_Reward(serverPack) {
		app[app.subGameName + "Client"].OnEvent("Reward", serverPack);
	},

	OnPack_CardReadyChg: function OnPack_CardReadyChg(serverPack) {
		console.log("CardReadyChg", serverPack);
		this.Room.OnPosCardReady(serverPack);
		app[app.subGameName + "Client"].OnEvent(this.gameName.toUpperCase() + "_EVT_Card_Ready", serverPack);
	},
	OnPack_ChangeStatus: function OnPack_ChangeStatus(serverPack) {
		console.log("改变玩家游戏状态", serverPack);
		this.Room.OnChangeStatus(serverPack);
		app[app.subGameName + "Client"].OnEvent("ChangeStatus", serverPack);
		/*var serverPack = {
  	"roomID": 710300000001437,
  	"setID": 1,
  	"state": "FJSSZ_GAME_STATUS_CONFIRMBanker",
  	"posList": [{
  		"posID": 1,
  		"shouCard": ["0x2d", "0x3b", "0x3a", "0x39", "0x05", "0x24", "0x33", "0x32", "0x3e", "0x19", "0x23", "0x34", "0x2c"],
  		"special": {},
  		"showEightCard": ["0x2d", "0x3b", "0x3a", "0x39", "0x05", "0x24", "0x33", "0x32"]
  	}, {
  		"posID": 0,
  		"shouCard": ["0x1c", "0x2b", "0x09", "0x27", "0x36", "0x35", "0x25", "0x04", "0x1a", "0x02", "0x12", "0x17", "0x26"],
  		"special": {},
  		"showEightCard": ["0x1c", "0x2b", "0x09", "0x27", "0x36", "0x35", "0x25", "0x04"]
  	}]
  };*/
	},
	//开始比牌
	OnPack_RankingResult: function OnPack_RankingResult(serverPack) {
		console.log("开始比牌 OnPack_RankingResult", serverPack);
		this.Room.OnResult(serverPack);
		app[app.subGameName + "Client"].OnEvent("RankingResult");
	},

	OnPack_ChatMessage: function OnPack_ChatMessage(serverPack) {
		app[app.subGameName + "Client"].OnEvent("ChatMessage", serverPack);
	},
	//竞技点不足时通知
	OnPack_SportsPointNotEnough: function OnPack_SportsPointNotEnough(serverPack) {
		app[app.subGameName + "Client"].OnEvent("SportsPointNotEnough", serverPack);
	},
	OnPack_SportsPointEnough: function OnPack_SportsPointEnough(serverPack) {
		app[app.subGameName + "Client"].OnEvent("SportsPointEnough", serverPack);
	},
	//玩家的竞技点在游戏外被改变通知
	OnPack_SportsPointChange: function OnPack_SportsPointChange(serverPack) {
		this.Room.OnSportsPointChange(serverPack);
		app[app.subGameName + "Client"].OnEvent("RoomSportsPointChange", serverPack);
	},
	//---------------------获取接口------------------------------
	GetEnterRoomID: function GetEnterRoomID() {
		return this.enterRoomID;
	},

	GetEnterRoom: function GetEnterRoom() {
		if (!this.enterRoomID) {
			console.error("GetEnterRoom not enterRoom");
			return;
		}
		return this.Room;
	},
	//-----------------------发包函数-----------------------------


	//登录获取当前进入的房间ID
	SendGetCurRoomID: function SendGetCurRoomID() {
		this.NetManager.SendPack("game.C1101GetRoomID", {});
	},

	//给玩家点赞封包
	SendEvaKouBei: function SendEvaKouBei(roomID, pos, targetPos, kouBeiType) {
		this.NetManager.SendPack("game.C1103EvaKouBei", {
			"roomID": roomID,
			"pos": pos,
			"targetPos": targetPos,
			"kouBeiType": kouBeiType
		});
	},

	//发送创建房间
	SendCreateRoom: function SendCreateRoom(sendPack) {
		this.NetManager.SendPack(this.gameName + ".C" + this.gameName.toUpperCase() + "CreateRoom", sendPack, function (data) {
			console.log("发送创建房间成功", data);
		}, function (error) {
			console.log("发送创建房间失败", error);
		});
	},

	//获取房间信息
	SendGetRoomInfo: function SendGetRoomInfo(roomID, callback) {
		this.NetManager.SendPack(this.gameName + ".C" + this.gameName.toUpperCase() + "GetRoomInfo", { "roomID": roomID }, callback);
	},

	//解散房间
	SendDissolveRoom: function SendDissolveRoom(roomID) {
		this.NetManager.SendPack(this.gameName + ".C" + this.gameName.toUpperCase() + "DissolveRoom", { "roomID": roomID });
	},

	//位置发送准备状态
	SendReady: function SendReady(roomID, posIndex) {
		this.NetManager.SendPack(this.gameName + ".C" + this.gameName.toUpperCase() + "ReadyRoom", {
			"roomID": roomID,
			"posIndex": posIndex
		});
	},

	//发送取消准备状态
	SendUnReady: function SendUnReady(roomID, posIndex) {
		this.NetManager.SendPack(this.gameName + ".C" + this.gameName.toUpperCase() + "UnReadyRoom", {
			"roomID": roomID,
			"posIndex": posIndex
		});
	},

	//房主T人
	SendKickPosIndex: function SendKickPosIndex(roomID, posIndex) {
		this.NetManager.SendPack(this.gameName + ".C" + this.gameName.toUpperCase() + "KickRoom", {
			"roomID": roomID,
			"posIndex": posIndex
		});
	},

	//开始游戏
	SendStartRoomGame: function SendStartRoomGame(roomID) {
		console.log('SendStartRoomGame roomID', roomID);
		this.NetManager.SendPack(this.gameName + ".C" + this.gameName.toUpperCase() + "StartGame", { "roomID": roomID });
	},

	//发送继续游戏
	SendContinueGame: function SendContinueGame(roomID) {
		this.NetManager.SendPack(this.gameName + ".C" + this.gameName.toUpperCase() + "ContinueGame", { "roomID": roomID });
	},

	//发送同意解散房间
	SendDissolveRoomAgree: function SendDissolveRoomAgree(roomID) {
		this.NetManager.SendPack(this.gameName + ".C" + this.gameName.toUpperCase() + "DissolveRoomAgree", { "roomID": roomID });
	},

	//发送拒绝解散房间
	SendDissolveRoomRefuse: function SendDissolveRoomRefuse(roomID) {
		this.NetManager.SendPack(this.gameName + ".C" + this.gameName.toUpperCase() + "DissolveRoomRefuse", { "roomID": roomID });
	},

	//发送位置执行指令
	SendPosAction: function SendPosAction(cardID, opType) {

		if (!this.enterRoomID) {
			console.error("SendPosAction not enterRoomID");
			return;
		}
		var roomID = this.enterRoomID;

		var roomSet = this.GetEnterRoom().GetRoomSet();
		if (!roomSet) {
			console.error("SendPosAction not find roomSet");
			return;
		}
		var setID = roomSet.GetRoomSetProperty("setID");
		var setRound = roomSet.GetRoomSetProperty("setRound");
		if (!setRound) {
			console.error("SendPosAction not find setRound");
			return;
		}
		var roundID = setRound["waitID"];

		var sendPack = {
			"roomID": roomID,
			"setID": setID,
			"roundID": roundID,
			"cardID": cardID,
			"opType": opType
		};
		this.NetManager.SendPack(this.gameName + ".C" + this.gameName.toUpperCase() + "OpCard", sendPack);
	},

	//退出房间
	SendExitRoom: function SendExitRoom(roomID, pos) {
		this.NetManager.SendPack(this.gameName + ".C" + this.gameName.toUpperCase() + "ExitRoom", {
			"roomID": roomID,
			"posIndex": pos
		});
	},

	//请求对局记录封包
	SendRoomRecord: function SendRoomRecord(roomID) {
		this.NetManager.SendPack(this.gameName + ".C" + this.gameName.toUpperCase() + "RoomRecord", { "roomID": roomID });
	},

	//发送打赏玩家封包
	SendPlayerReward: function SendPlayerReward(roomID) {
		this.NetManager.SendPack(this.gameName + ".C" + this.gameName.toUpperCase() + "Reward", { "roomID": roomID });
	},
	//获取每一局的玩家记录
	sendEveryGameRecord: function sendEveryGameRecord(roomID) {
		this.NetManager.SendPack("game.CPlayerSetRoomRecord", { "roomID": roomID });
	},
	SendBeiShu: function SendBeiShu(roomID, pos, beishu) {
		this.NetManager.SendPack(this.gameName + ".C" + this.gameName.toUpperCase() + "RoomBeiShu", {
			"roomID": roomID,
			"posIndex": pos,
			"beishu": beishu
		});
	},
	SendEndRoom: function SendEndRoom(roomID) {
		this.NetManager.SendPack(this.gameName + ".C" + this.gameName.toUpperCase() + "EndRoom", { "roomID": roomID });
	},
	//切换座位
	SendSelectPosRoom: function SendSelectPosRoom(roomID, posID) {
		this.NetManager.SendPack(this.gameName + ".C" + this.gameName.toUpperCase() + "SelectPosRoom", {
			"roomID": roomID,
			"posID": posID
		});
	},
	//站起
	SendStand: function SendStand(roomID, posID) {
		this.NetManager.SendPack(this.gameName + ".C" + this.gameName.toUpperCase() + "Stand", {
			"roomID": roomID,
			"posID": posID
		});
	},
	//坐下
	SendSit: function SendSit(roomID, posID) {
		this.NetManager.SendPack(this.gameName + ".C" + this.gameName.toUpperCase() + "Sit", {
			"roomID": roomID,
			"posID": posID
		});
	},
	//抢庄
	SendQiangZhuang: function SendQiangZhuang(beishu) {
		this.NetManager.SendPack(this.gameName + ".C" + this.gameName.toUpperCase() + "QiangZhuang", {
			"roomID": this.enterRoomID,
			"beishu": beishu
		});
	},
	//加倍
	SendConfirmBeiShu: function SendConfirmBeiShu(beishu) {
		this.NetManager.SendPack(this.gameName + ".C" + this.gameName.toUpperCase() + "ConfirmBeiShu", {
			"roomID": this.enterRoomID,
			"beishu": beishu
		});
	}
});

var g_FJSSZRoomMgr = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_FJSSZRoomMgr) g_FJSSZRoomMgr = new FJSSZRoomMgr();
	return g_FJSSZRoomMgr;
};

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=FJSSZRoomMgr.js.map
        