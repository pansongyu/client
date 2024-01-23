(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/game/FJSSZ/FJSSZRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fjsszda1-f474-4b4e-84e8-5c59302d7de5', 'FJSSZRoom', __filename);
// script/game/FJSSZ/FJSSZRoom.js

"use strict";

/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDM Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package FJSSZRoom.js
 *  @todo: 自由扑克房间
 *
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
var FJSSZRoom = app.BaseClass.extend({

	/**
  * 初始化
  */
	Init: function Init() {

		this.JS_Name = "FJSSZRoom";

		this.ComTool = app[app.subGameName + "_ComTool"]();
		this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
		this.HeroManager = app[app.subGameName + "_HeroManager"]();
		this.RoomSet = app[app.subGameName.toUpperCase() + "RoomSet"]();
		this.RoomPosMgr = app[app.subGameName.toUpperCase() + "RoomPosMgr"]();
		this.SysDataManager = app[app.subGameName + "_SysDataManager"]();
		this.OnReload();

		this.Log("Init");
	},

	OnReload: function OnReload() {
		this.dataInfo = {};
		this.roomConfig = {};
		this.roomRecord = {};
		this.RoomPosMgr.OnReload();
		this.RoomSet.OnReload();
	},
	ClearDissolve: function ClearDissolve() {
		this.dataInfo["dissolve"] = "";
	},
	ClearchangePlayerNum: function ClearchangePlayerNum() {
		this.dataInfo["changePlayerNum"] = "";
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
		this.RoomPosMgr.OnInitRoomPosData(roomPosInfoList);

		var setInfo = serverPack["set"];
		setInfo["rankingResults"] = serverPack["rankingResults"];
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
		this.RoomSet.OnPosLeave(pos);
	},
	UpdateOwnerID: function UpdateOwnerID(ownerID) {
		this.dataInfo['ownerID'] = ownerID;
	},
	//继续游戏
	OnPosContinueGame: function OnPosContinueGame(pos) {
		this.RoomPosMgr.OnPosContinueGame(pos);
		this.RoomSet.OnPosContinueGame(pos);
	},
	OnZhuangJia: function OnZhuangJia(opPos, beiShu) {
		this.RoomSet.OnSetZhuangJia(opPos, beiShu);
	},
	//set开始
	OnSetStart: function OnSetStart(setInfo) {
		this.dataInfo["state"] = this.ShareDefine.RoomState_Playing;
		this.dataInfo["setID"] = setInfo["setID"];
		this.GetRoomSet().OnSetStart(setInfo);
		this.GetRoomPosMgr().OnSetStart(setInfo["posInfo"]);
	},
	//游戏状态改变
	OnChangeStatus: function OnChangeStatus(setInfo) {
		this.dataInfo["state"] = this.ShareDefine.SetStateStringDict[setInfo["state"]];
		this.dataInfo["setID"] = setInfo["setID"];
		this.GetRoomSet().OnChangeStatus(setInfo);
		this.GetRoomPosMgr().OnChangeStatus(setInfo);
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

	//位置同意拒绝更新
	OnPosDealVote: function OnPosDealVote(pos, agreeDissolve) {

		var dissolveInfo = this.dataInfo["dissolve"];
		"";
		var posAgreeList = dissolveInfo["posAgreeList"];
		if (!posAgreeList) {
			console.error("OnPosDealVote not find posAgreeList:", this.dataInfo);
			return;
		}

		if (pos >= posAgreeList.length) {
			console.error("OnPosDealVote(%s,%s):", pos, agreeDissolve, posAgreeList);
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

	//更新玩家是否摆好牌
	OnPosCardReady: function OnPosCardReady(serverPack) {
		this.GetRoomPosMgr().OnPosIsReady(serverPack.pos, serverPack.isReady);
		if (serverPack.pos == this.RoomPosMgr.GetClientPos() && serverPack.ranked && serverPack.isReady) {
			this.GetRoomSet().SetRoomProperty("ranked", serverPack.ranked);
		}
	},
	//---------------------设置函数---------------------
	//保存当前局所有比牌信息
	OnResult: function OnResult(serverPack) {
		this.GetRoomSet().OnResult(serverPack);
		this.dataInfo["resultInfo"] = serverPack;
		var playerList = serverPack.sRankingResult.posResultList;
		for (var idx = 0; idx < playerList.length; idx++) {
			var player = playerList[idx];
			this.RoomPosMgr.onPosJifen(player);
			this.RoomPosMgr.onPosSportsPoint(player);
		}
		this.RoomPosMgr.reSetCardReady();
	},
	OnTotalScoreFromLogin: function OnTotalScoreFromLogin(posList) {

		this.RoomPosMgr.onPosTotalJifen(posList);
	},
	OnDissolve: function OnDissolve(dissolve) {
		this.dataInfo["dissolve"] = dissolve;
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
			console.error("GetRoomProperty not find:%s", property);
			return;
		}
		return this.dataInfo[property];
	},

	//获取房间配置信息
	GetRoomConfig: function GetRoomConfig() {
		return this.roomConfig;
	},

	//获取房间配置信息
	GetRoomConfigByProperty: function GetRoomConfigByProperty(property) {
		if (!this.roomConfig.hasOwnProperty(property)) {
			console.error("GetRoomConfigByProperty not find:%s", property);
			return;
		}
		return this.roomConfig[property];
	},
	OnSportsPointChange: function OnSportsPointChange(serverPack) {
		this.RoomPosMgr.OnSportsPointChange(serverPack);
	},
	GetRoomSet: function GetRoomSet() {
		var setID = this.dataInfo["setID"];
		if (!setID) {
			console.error("GetSet not start set");
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
		if (heroID == this.dataInfo["ownerID"]) {
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
			console.error("GetClientPlayerSetPos not enter room");
			return;
		}
		var setPos = this.RoomSet.GetSetPosByPos(pos);
		if (!setPos) {
			console.error("GetClientPlayerSetPos(%s) not find setPos", pos);
			return;
		}
		return setPos;
	},
	//更新房间信息
	SetRoomProperty: function SetRoomProperty(property, data) {
		if (!this.dataInfo.hasOwnProperty(property)) {
			console.error("SetRoomProperty not find:%", property);
			return;
		}
		this.dataInfo[property] = data;
	},
	//获取客户端玩家信息
	GetClientPlayerInfo: function GetClientPlayerInfo() {
		var pos = this.RoomPosMgr.GetClientPos();
		if (pos < 0) {
			console.error("GetClientPlayerInfo not enter room");
			return;
		}
		var playerInfo = this.RoomPosMgr.GetPlayerInfoByPos(pos);
		if (!playerInfo) {
			console.error("GetClientPlayerInfo(%s) not find playerInfo", pos);
			return;
		}
		return playerInfo;
	},
	//人数修改
	OnStartChangePlaeryDissolve: function OnStartChangePlaeryDissolve(createPos, playerNum, endSec) {
		var posAgreeList = [];
		for (var index = 0; index < 8; index++) {
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
	//位置同意拒绝更新
	ChangePlayerNumAgree: function ChangePlayerNumAgree(pos, agreeDissolve) {
		var dissolveInfo = this.dataInfo["changePlayerNum"] || { posAgreeList: [0, 0, 0, 0, 0, 0, 0, 0] };
		var posAgreeList = dissolveInfo["posAgreeList"];
		if (!posAgreeList) {
			console.error("OnChangeDealVote not find posAgreeList:", this.dataInfo);
			return false;
		}
		if (pos >= posAgreeList.length) {
			console.error("OnChangeDealVote(%s,%s):", pos, agreeDissolve, posAgreeList);
			return false;
		}
		if (agreeDissolve) {
			posAgreeList[pos] = 1;
		} else {
			posAgreeList[pos] = 2;
		}
		return dissolveInfo;
	}
});

var g_FJSSZRoom = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_FJSSZRoom) g_FJSSZRoom = new FJSSZRoom();
	return g_FJSSZRoom;
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
        //# sourceMappingURL=FJSSZRoom.js.map
        