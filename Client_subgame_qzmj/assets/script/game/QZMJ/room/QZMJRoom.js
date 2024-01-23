/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDM Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package QZMJRoom.js
 *  @todo: 龙岩麻将房间
 *
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
var QZMJRoom = app.BaseClass.extend({

	/**
	 * 初始化
	 */
	Init: function () {

		this.JS_Name = "QZMJRoom";

		this.ComTool = app[app.subGameName + "_ComTool"]();
		this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
		this.HeroManager = app[app.subGameName + "_HeroManager"]();

		this.RoomPosMgr = app[app.subGameName.toUpperCase() + "RoomPosMgr"]();
		this.MJRoomSet = app[app.subGameName.toUpperCase() + "RoomSet"]();
		this.SysDataManager = app[app.subGameName + "_SysDataManager"]();

		this.PropertyInfo = this.SysDataManager.GetTableDict("PropertyInfo");

		this.OnReload();

		this.Log("Init");

	},

	OnReload: function () {

		//{
		//	"roomID":1,
		//	"key":"123456",
		//	"createSec":nowSec,
		//	"state":roomState,
		//	"setID":0,
		//	"roomEnd":{},
		//	"dissolve":{"endSec":0,"createPos":0,"posAgreeList":[]},
		//}
		this.dataInfo = {};

		//{
		//	"setCount":4,
		//}
		this.roomConfig = {};

		this.roomRecord = {};

		this.RoomPosMgr.OnReload();
		this.MJRoomSet.OnReload();
	},

	//-----------------------回调函数-----------------------------
	//登录初始化房间数据
	OnInitRoomData: function (serverPack) {
		this.RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();

		let room = this.RoomMgr.GetEnterRoom();
		serverPack["state"] = this.ShareDefine.RoomStateStringDict[serverPack["state"]];

		if (serverPack.prizeType == 'Gold') {
			app[app.subGameName + "_ShareDefine"]().isCoinRoom = true;
		}
		else if (serverPack.prizeType == 'RoomCard') {
			app[app.subGameName + "_ShareDefine"]().isCoinRoom = false;
		}

		let cfg = serverPack["cfg"];
		this.roomConfig = cfg;

		let roomPosInfoList = serverPack["posList"] || [];
		this.RoomPosMgr.OnInitRoomPosData(roomPosInfoList);

		let setInfo = serverPack["set"];
		this.MJRoomSet.OnInitRoomSetData(setInfo);
		//初始化金

		//其余信息存放到dataInfo
		this.dataInfo = serverPack;
		this.Log("roomConfig:", this.roomConfig);
		this.Log("dataInfo:", this.dataInfo);
	},
	/*
	*战绩兼容扑克
	 */
	SetGameRecord: function (bget) {

	},
	//位置离开
	OnPosLeave: function (pos) {
		this.RoomPosMgr.OnPosLeave(pos);
		this.MJRoomSet.OnPosLeave(pos);
	},
	UpdateOwnerID: function (ownerID) {
		this.dataInfo['ownerID'] = ownerID;
	},
	//继续游戏
	OnPosContinueGame: function (pos) {
		this.RoomPosMgr.OnPosContinueGame(pos);
		this.MJRoomSet.OnPosContinueGame(pos);
	},

	OnSetWaiting:function(setWaiting){
		this.dataInfo["state"] = this.ShareDefine.RoomState_Playing;
		this.dataInfo["setID"] = setWaiting["setID"];
	},

	//set开始
	OnSetStart: function (setInfo) {
		this.dataInfo["state"] = this.ShareDefine.RoomState_Playing;
		this.dataInfo["setID"] = setInfo["setID"];
		this.GetRoomSet().OnSetStart(setInfo);
	},
	UpdateEndSec: function (endSec) {
		this.dataInfo["dissolve"]["endSec"] = endSec;
	},
	//set结束
	OnSetEnd: function (setEnd) {
		this.MJRoomSet.OnSetEnd(setEnd);
		this.RoomPosMgr.OnSetEnd(setEnd);
	},

	//房间结束
	OnRoomEnd: function (roomEnd) {
		this.dataInfo["state"] = this.ShareDefine.RoomState_End;
		this.dataInfo["roomEnd"] = roomEnd;
	},

	//开始解散房间
	OnStartVoteDissolve: function (createPos, endSec) {
		let posAgreeList = [];
		for (let index = 0; index < this.ShareDefine[app.subGameName.toUpperCase() + "RoomJoinCount"]; index++) {
			if (index == createPos) {
				posAgreeList.push(1);
			}
			else {
				posAgreeList.push(0);
			}
		}
		let dissolveInfo = {"endSec": endSec, "createPos": createPos, "posAgreeList": posAgreeList};
		this.dataInfo["dissolve"] = dissolveInfo;
		return dissolveInfo;
	},
	//人数修改
	OnStartChangePlaeryDissolve: function (createPos, playerNum, endSec) {
		let posAgreeList = [];
		for (let index = 0; index < this.ShareDefine[app.subGameName.toUpperCase() + "RoomJoinCount"]; index++) {
			if (index == createPos) {
				posAgreeList.push(1);
			}
			else {
				posAgreeList.push(0);
			}
		}
		let dissolveInfo = {"endSec": endSec, "createPos": createPos, "posAgreeList": posAgreeList};
		this.dataInfo["changePlayerNum"] = dissolveInfo;
		return dissolveInfo;
	},

	//位置同意拒绝更新
	ChangePlayerNumAgree: function (pos, agreeDissolve) {
		let dissolveInfo = this.dataInfo["changePlayerNum"];
		let posAgreeList = dissolveInfo["posAgreeList"];
		if (!posAgreeList) {
			this.ErrLog("OnChangeDealVote not find posAgreeList:", this.dataInfo);
			return
		}
		if (pos >= posAgreeList.length) {
			this.ErrLog("OnChangeDealVote(%s,%s):", pos, agreeDissolve, posAgreeList);
			return
		}
		if (agreeDissolve) {
			posAgreeList[pos] = 1;
		}
		else {
			posAgreeList[pos] = 2;
		}
		return dissolveInfo
	},
	//位置同意拒绝更新
	OnPosDealVote: function (pos, agreeDissolve) {

		let dissolveInfo = this.dataInfo["dissolve"];
		let posAgreeList = dissolveInfo["posAgreeList"];
		if (!posAgreeList) {
			this.ErrLog("OnPosDealVote not find posAgreeList:", this.dataInfo);
			return
		}

		if (pos >= posAgreeList.length) {
			this.ErrLog("OnPosDealVote(%s,%s):", pos, agreeDissolve, posAgreeList);
			return
		}

		if (agreeDissolve) {
			posAgreeList[pos] = 1;
		}
		else {
			posAgreeList[pos] = 2;
		}
		return dissolveInfo
	},
	//更新房间内的对局记录信息
	RoomRecord: function (serverPack) {
		this.roomRecord = {};
		this.roomRecord = serverPack;
	},
	OnSportsPointChange: function (serverPack) {
		this.RoomPosMgr.OnSportsPointChange(serverPack);
	},
	//更新Room datainfo数据
	UpdataInfo: function (serverPack) {
		this.GetRoomPosMgr().OnPosOpCard(serverPack);
		return this.GetRoomSet().OnPosOpCard(serverPack)
	},
	//---------------------设置函数---------------------
	//删除已经打出的卡牌
	OnDeleteOutCard: function (cardID) {
		//如果是不是在牌局进行中
		if (this.dataInfo["state"] != this.ShareDefine.RoomState_Playing) {
			this.ErrLog("OnDeleteOutCard not RoomState_Playing");
			return -1;
		}
		return this.GetRoomSet().OnDeleteOutCard(cardID);
	},

	//---------------------获取函数---------------------
	//获取对局记录信息
	GetRoomRecord: function () {
		return this.roomRecord;
	},
	//获取房间信息
	GetRoomDataInfo: function () {
		return this.dataInfo;
	},
	//获取创建房间信息b
	GetRoomProperty: function (property) {
		if (!this.dataInfo.hasOwnProperty(property)) {
			this.ErrLog("GetRoomProperty not find:%s", property);
			return
		}
		return this.dataInfo[property];
	},
	ClearDissolve: function () {
		this.dataInfo['dissolve'] = '';
	},
	ClearchangePlayerNum: function () {
		this.dataInfo['changePlayerNum'] = '';
	},
	//获取房间配置信息
	GetRoomConfig: function () {
		return this.roomConfig
	},

	//获取房间配置信息
	GetRoomConfigByProperty: function (property) {
		if (!this.roomConfig.hasOwnProperty(property)) {
			this.ErrLog("GetRoomConfigByProperty not find:%s", property);
			return
		}
		return this.roomConfig[property];
	},

	GetRoomSet: function () {
		let setID = this.dataInfo["setID"];
		if (!setID) {
			this.ErrLog("GetSet not start set");
			return
		}
		return this.MJRoomSet
	},

	GetRoomPosMgr: function () {
		return this.RoomPosMgr
	},
	//客户端玩家是否是开房人
	IsClientIsCreater: function () {
		let heroID = this.HeroManager.GetHeroID();
		if (heroID == this.dataInfo["ownerID"]) {
			return true
		}
		return false
	},
	//客户端玩家是否是房主
	IsClientIsOwner: function () {
		let heroID = this.HeroManager.GetHeroID();
		if (heroID == this.dataInfo["ownerID"]) {
			return true
		}
		return false
	},

	//获取指定位置闪电出牌结束时间
	GetActionEndTick: function (pos) {
		//不是牌局进行中
		if (this.dataInfo["state"] != this.ShareDefine.RoomState_Playing) {
			this.ErrLog("GetActionEndTick not RoomState_Playing");
			return 0
		}

		let setRound = this.GetRoomSet().GetRoomSetProperty("setRound");
		if (!setRound) {
			return 0
		}
		let startWaitSec = setRound["startWaitSec"];
		let endTick = startWaitSec * 1000 + this.PropertyInfo[app.subGameName.toUpperCase() + "Room_WaitTick"];

		let opPosList = setRound["opPosList"];
		let count = opPosList.length;
		for (let index = 0; index < count; index++) {
			let opInfo = opPosList[index];

			//如果查询位置当前需要执行动作
			if (opInfo["waitOpPos"] == pos) {
				return endTick
			}
		}
		return 0
	},


	//获取玩家setPos对象
	GetClientPlayerSetPos: function () {

		let pos = this.RoomPosMgr.GetClientPos();
		if (pos < 0) {
			this.ErrLog("GetClientPlayerSetPos not enter room");
			return
		}
		let setPos = this.MJRoomSet.GetSetPosByPos(pos);
		if (!setPos) {
			return
		}
		return setPos
	},

	//获取客户端玩家信息
	GetClientPlayerInfo: function () {
		let pos = this.RoomPosMgr.GetClientPos();
		if (pos < 0) {
			this.ErrLog("GetClientPlayerInfo not enter room");
			return
		}
		let playerInfo = this.RoomPosMgr.GetPlayerInfoByPos(pos);
		if (!playerInfo) {
			this.ErrLog("GetClientPlayerInfo(%s) not find playerInfo", pos);
			return
		}
		return playerInfo
	},
})


var g_QZMJRoom = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_QZMJRoom)
		g_QZMJRoom = new QZMJRoom();
	return g_QZMJRoom;

}
