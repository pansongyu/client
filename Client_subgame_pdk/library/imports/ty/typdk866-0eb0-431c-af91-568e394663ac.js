"use strict";
cc._RF.push(module, 'typdk866-0eb0-431c-af91-568e394663ac', 'PDKRoom');
// script/game/PDK/PDKRoom.js

"use strict";

/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDM Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package SSSRoom.js
 *  @todo: 拼罗松房间
 *
 *  @version 1.0
 *
 *  修改时间 修改人 修改内容
 *  -------------------------------------------------------------------------------
 *
 */
var app = require('pdk_app');

/**
 * 类构造
 */
var PDKRoom = app.BaseClass.extend({

	/**
  * 初始化
  */
	Init: function Init() {

		this.JS_Name = app.subGameName.toUpperCase() + "Room";

		this.ComTool = app[app.subGameName + "_ComTool"]();
		this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
		this.HeroManager = app[app.subGameName + "_HeroManager"]();

		this.RoomPosMgr = app[app.subGameName.toUpperCase() + "RoomPosMgr"]();
		this.RoomSet = app[app.subGameName.toUpperCase() + "RoomSet"]();
		this.SysDataManager = app[app.subGameName + "_SysDataManager"]();

		this.PropertyInfo = this.SysDataManager.GetTableDict("PropertyInfo");

		this.OnReload();

		this.Log("Init");
	},

	OnReload: function OnReload() {

		this.dataInfo = {};

		this.roomConfig = {};

		this.roomRecord = {};
	},

	//-----------------------回调函数-----------------------------
	//登录初始化房间数据
	OnInitRoomData: function OnInitRoomData(serverPack) {

		serverPack["state"] = this.ShareDefine.RoomStateStringDict[serverPack["state"]];

		if (serverPack.prizeType == 'Gold') {
			app[app.subGameName + "_ShareDefine"]().isCoinRoom = true;
		} else if (serverPack.prizeType == 'RoomCard') {
			app[app.subGameName + "_ShareDefine"]().isCoinRoom = false;
		}

		var cfg = serverPack["cfg"];
		this.roomConfig = cfg;

		var roomPosInfoList = serverPack["posList"] || [];
		console.log('roomPosInfoList', roomPosInfoList);
		this.RoomPosMgr.OnInitRoomPosData(roomPosInfoList);

		var setInfo = serverPack["set"];
		this.RoomSet.OnInitRoomSetData(setInfo);

		//其余信息存放到dataInfo
		this.dataInfo = serverPack;

		this.isGetGR = false;
		this.Log("roomConfig:", this.roomConfig);
		this.Log("dataInfo:", this.dataInfo);
	},

	//位置离开
	OnPosLeave: function OnPosLeave(pos) {
		this.RoomPosMgr.OnPosLeave(pos);
	},
	UpdateOwnerID: function UpdateOwnerID(ownerID) {
		this.dataInfo['ownerID'] = ownerID;
	},
	//继续游戏
	OnPosContinueGame: function OnPosContinueGame(pos) {
		this.RoomPosMgr.OnPosContinueGame(pos);
	},

	//set开始
	OnSetStart: function OnSetStart(setInfo) {
		this.dataInfo["state"] = this.ShareDefine.RoomState_Playing;
		this.dataInfo["setID"] = setInfo["setID"];
		this.GetRoomSet().OnSetStart(setInfo);
	},

	//set结束
	OnSetEnd: function OnSetEnd(setEnd) {
		this.RoomSet.OnSetEnd(setEnd);
		this.RoomPosMgr.OnSetEnd(setEnd);
	},

	//房间结束
	OnRoomEnd: function OnRoomEnd(roomEnd) {
		this.dataInfo["state"] = this.ShareDefine.RoomState_End;
		this.dataInfo["roomEnd"] = roomEnd;
	},

	//位置同意拒绝更新
	ChangePlayerNumAgree: function ChangePlayerNumAgree(pos, agreeDissolve) {
		var dissolveInfo = this.dataInfo["changePlayerNum"];
		var posAgreeList = dissolveInfo["posAgreeList"];
		if (!posAgreeList) {
			this.ErrLog("OnChangeDealVote not find posAgreeList:", this.dataInfo);
			return;
		}
		if (pos >= posAgreeList.length) {
			this.ErrLog("OnChangeDealVote(%s,%s):", pos, agreeDissolve, posAgreeList);
			return;
		}
		if (agreeDissolve) {
			posAgreeList[pos] = 1;
		} else {
			posAgreeList[pos] = 2;
		}
		return dissolveInfo;
	},
	//人数修改
	OnStartChangePlaeryDissolve: function OnStartChangePlaeryDissolve(createPos, playerNum, endSec) {
		var posAgreeList = [];
		for (var index = 0; index < 3; index++) {
			if (index == createPos) {
				posAgreeList.push(1);
			} else {
				posAgreeList.push(0);
			}
		}
		var dissolveInfo = { "endSec": endSec, "createPos": createPos, "posAgreeList": posAgreeList };
		this.dataInfo["changePlayerNum"] = dissolveInfo;
		return dissolveInfo;
	},

	//位置更新解散
	OnPack_ChangePlayerNumAgree: function OnPack_ChangePlayerNumAgree(serverPack) {
		var roomID = serverPack["roomID"];
		var pos = serverPack["pos"];
		var agreeDissolve = serverPack["agreeChange"];
		var dissolveInfo = this.NowRoom().ChangePlayerNumAgree(pos, agreeDissolve);
		app[app.subGameName + "Client"].OnEvent("PosChangePlayerDealVote", dissolveInfo);
	},

	//开始解散房间
	OnStartVoteDissolve: function OnStartVoteDissolve(createPos, endSec) {
		var posAgreeList = [];

		for (var index = 0; index < 10; index++) {
			console.log("createPos:" + createPos + ",index:" + index);
			if (index == createPos) {
				posAgreeList.push(1);
			} else {
				posAgreeList.push(0);
			}
		}
		var dissolveInfo = { "endSec": endSec, "createPos": createPos, "posAgreeList": posAgreeList };
		this.dataInfo["dissolve"] = dissolveInfo;
		return dissolveInfo;
	},
	UpdateEndSec: function UpdateEndSec(endSec) {
		this.dataInfo["dissolve"]["endSec"] = endSec;
	},
	//位置同意拒绝更新
	OnPosDealVote: function OnPosDealVote(pos, agreeDissolve) {

		var dissolveInfo = this.dataInfo["dissolve"];
		var posAgreeList = dissolveInfo["posAgreeList"];
		if (!posAgreeList) {
			this.ErrLog("OnPosDealVote not find posAgreeList:", this.dataInfo);
			return;
		}

		if (pos >= posAgreeList.length) {
			this.ErrLog("OnPosDealVote(%s,%s):", pos, agreeDissolve, posAgreeList);
			return;
		}

		if (agreeDissolve) {
			posAgreeList[pos] = 1;
		} else {
			posAgreeList[pos] = 2;
		}
		return dissolveInfo;
	},
	//更新房间内的对局记录信息
	RoomRecord: function RoomRecord(serverPack) {
		this.roomRecord = {};
		this.roomRecord = serverPack;
	},
	OnSportsPointChange: function OnSportsPointChange(serverPack) {
		this.RoomPosMgr.OnSportsPointChange(serverPack);
	},
	//---------------------设置函数---------------------
	OnDissolve: function OnDissolve(dissolve) {
		this.dataInfo["dissolve"] = dissolve;
	},
	GetRoomXianShi: function GetRoomXianShi() {
		return this.roomConfig["xianShi"];
	},
	OnPlaying: function OnPlaying(serverPack) {
		//改变玩家出牌位置
		var opPos = serverPack.opPos;
		this.RoomSet.OnSetPlaying(opPos);
	},

	//---------------------获取函数---------------------
	//获取对局记录信息
	GetRoomRecord: function GetRoomRecord() {
		return this.roomRecord;
	},

	//获取房间信息
	GetRoomDataInfo: function GetRoomDataInfo() {
		return this.dataInfo;
	},
	//获取创建房间信息b
	GetRoomProperty: function GetRoomProperty(property) {
		if (!this.dataInfo.hasOwnProperty(property)) {
			this.ErrLog("GetRoomProperty not find:%s", property);
			return;
		}
		return this.dataInfo[property];
	},
	ClearDissolve: function ClearDissolve() {
		this.dataInfo['dissolve'] = '';
	},
	//获取房间配置信息
	GetRoomConfig: function GetRoomConfig() {
		return this.roomConfig;
	},

	//获取房间配置信息
	GetRoomConfigByProperty: function GetRoomConfigByProperty(property) {
		if (!this.roomConfig.hasOwnProperty(property)) {
			this.ErrLog("GetRoomConfigByProperty not find:%s", property);
			return;
		}
		return this.roomConfig[property];
	},

	GetRoomSet: function GetRoomSet() {
		var setID = this.dataInfo["setID"];
		if (!setID) {
			this.ErrLog("GetSet not start set");
			return;
		}
		return this.RoomSet;
	},

	GetRoomPosMgr: function GetRoomPosMgr() {
		return this.RoomPosMgr;
	},
	//客户端玩家是否是开房人
	IsClientIsCreater: function IsClientIsCreater() {
		var heroID = this.HeroManager.GetHeroID();
		if (heroID == this.dataInfo["createID"]) {
			return true;
		}
		return false;
	},
	//客户端玩家是否是房主
	IsClientIsOwner: function IsClientIsOwner() {
		var heroID = this.HeroManager.GetHeroID();
		if (heroID == this.dataInfo["ownerID"]) {
			return true;
		}
		return false;
	},

	SetGameRecord: function SetGameRecord(bget) {
		this.isGetGR = bget;
	},

	GetGameRecord: function GetGameRecord() {
		return this.isGetGR;
	},

	//获取玩家setPos对象
	GetClientPlayerSetPos: function GetClientPlayerSetPos() {

		var pos = this.RoomPosMgr.GetClientPos();
		if (pos < 0) {
			this.ErrLog("GetClientPlayerSetPos not enter room");
			return;
		}
		var setPos = this.RoomSet.GetSetPosByPos(pos);
		if (!setPos) {
			this.ErrLog("GetClientPlayerSetPos(%s) not find setPos", pos);
			return;
		}
		return setPos;
	},

	//获取客户端玩家信息
	GetClientPlayerInfo: function GetClientPlayerInfo() {
		var pos = this.RoomPosMgr.GetClientPos();
		if (pos < 0) {
			this.ErrLog("GetClientPlayerInfo not enter room");
			return;
		}
		var playerInfo = this.RoomPosMgr.GetPlayerInfoByPos(pos);
		if (!playerInfo) {
			this.ErrLog("GetClientPlayerInfo(%s) not find playerInfo", pos);
			return;
		}
		return playerInfo;
	},
	GetRoomShouPai: function GetRoomShouPai() {
		if (this.roomConfig["shoupai"] == 0) {
			return 15;
		}
		return 16;
	},
	GetRoomWanfa: function GetRoomWanfa(wanfa) {
		if (this.roomConfig["kexuanwanfa"].indexOf(wanfa) != -1) {
			return true;
		}
		return false;
	},
	GetRoomSiDai: function GetRoomSiDai(value) {
		if (this.roomConfig["sidai"].indexOf(value) != -1) {
			return true;
		}
		return false;
	}
});

var g_PDKRoom = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_PDKRoom) g_PDKRoom = new PDKRoom();
	return g_PDKRoom;
};

cc._RF.pop();