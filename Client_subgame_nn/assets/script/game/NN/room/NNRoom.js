/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDM Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package LZMJRoom.js
 *  @todo: 龙岩麻将房间
 *
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
var LZMJRoom = app.BaseClass.extend({

	/**
	 * 初始化
	 */
	Init: function () {

		this.JS_Name = app["subGameName"] + "Room";

		this.ComTool = app[app.subGameName + "_ComTool"]();
		this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
		this.HeroManager = app[app.subGameName + "_HeroManager"]();

		this.SysDataManager = app[app.subGameName + "_SysDataManager"]();

		this.PropertyInfo = this.SysDataManager.GetTableDict("PropertyInfo");

		this.RoomPosMgr = app[app.subGameName.toUpperCase() + "RoomPosMgr"]();

		this.OnReload();

		//console.log("Init");

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

	},
	ClearDissolve: function () {
		this.dataInfo['dissolve'] = '';
	},
	ClearchangePlayerNum: function () {
		this.dataInfo['changePlayerNum'] = '';
	},
	//-------------	----------回调函数-----------------------------
	//登录初始化房间数据
	OnInitRoomData: function (serverPack) {
		this[app.subGameName.toUpperCase() + "RoomMgr"] = app[app.subGameName.toUpperCase() + "RoomMgr"]();

		let room = this[app.subGameName.toUpperCase() + "RoomMgr"].GetEnterRoom();
		serverPack["state"] = this.ShareDefine.RoomStateStringDict[serverPack["state"]];

		if (serverPack.prizeType == 'Gold') {
			app[app.subGameName + "_ShareDefine"]().isCoinRoom = true;
		} else if (serverPack.prizeType == 'RoomCard') {
			app[app.subGameName + "_ShareDefine"]().isCoinRoom = false;
		}

		let cfg = serverPack["cfg"];
		this.roomConfig = cfg;
		//其余信息存放到dataInfo
	
		this.dataInfo = serverPack;
		this.dataInfo["setEnd"] = serverPack["set"]["setEnd"];
		this.dataInfo['set'].stateInfo = this.dataInfo['set'];
		cc.log("房间信息初始化",this.dataInfo);
		let roomPosInfoList = serverPack["posList"] || [];
		this.RoomPosMgr.OnInitRoomPosData(roomPosInfoList);

		
		this.isGetGR = false;
	},

	//位置离开
	OnPosLeave: function (pos) {
		if (this.dataInfo.hasOwnProperty("posList")) {
			this.dataInfo["posList"][pos].pid = 0;
		}
	},
	UpdateOwnerID: function (ownerID) {
		this.dataInfo['ownerID'] = ownerID;
	},
	//玩家离线
	SetPlayerOfflineState: function (pos, isLostConnect) {
		if (this.dataInfo.hasOwnProperty("posList"))
			this.dataInfo["posList"][pos].isLostConnect = isLostConnect;
	},
	OnPosReadyChg: function (pos, ready) {
		if (this.dataInfo.hasOwnProperty("posList")) {
			let state = this.GetRoomProperty("state");
			if (0 == state) {
				this.dataInfo["posList"][pos].roomReady = ready;
			} else {
				this.dataInfo["posList"][pos].gameReady = ready;
			}
			return true;
		}
		return false;
	},
	//继续游戏
	OnPosContinueGame: function (pos) {
		if (this.dataInfo.hasOwnProperty("posList")) {
			this.dataInfo["posList"][pos].gameReady = true;
		}
	},
	UpdateEndSec: function (endSec) {
		this.dataInfo["dissolve"]["endSec"] = endSec;
	},
	//set开始
	OnSetStart: function (setInfo) {
		this.dataInfo["state"] = this.ShareDefine.RoomState_Playing;
		this.dataInfo["setID"] = setInfo["setID"];
		this.dataInfo["set"] = setInfo;
		this.dataInfo["set"].stateInfo = setInfo;
		let posList = this.dataInfo["posList"];
		for (let i = 0; i < posList.length; i++) {
			posList[i].gameReady = false;
		}
	},
	//房间阶段
	OnStatusChange: function (stateInfo) {
		this.dataInfo["set"].stateInfo = stateInfo;
		this.dataInfo["set"].state = stateInfo.state;
	},
	//set结束
	OnSetEnd: function (serverPack) {
		this.dataInfo["set"].state = serverPack["setStatus"];
		this.dataInfo["setEnd"] = serverPack;
		let cards = this.dataInfo["setEnd"].cards;
		let posInfo = this.dataInfo["set"].posInfo;
		for (let i = 0; i < 10; i++) {//十人局
			this.dataInfo["posList"][i].point += serverPack.pointList[i];
			posInfo[i].cards = cards[i];

			let playerInfo = this.dataInfo["posList"][i];
			//比赛分
			if (typeof(playerInfo.sportsPoint)!="undefined") {
				let sp = parseFloat(playerInfo["sportsPoint"]).toFixed(2);
				let addSp = parseFloat(serverPack.sportsPointList[i]).toFixed(2);
				let totalSp = parseFloat(sp) + parseFloat(addSp);
				//保留小数点后面两位
				// playerInfo["sportsPoint"] = totalSp.toFixed(2);
				this.dataInfo["posList"][i]["sportsPoint"] = totalSp.toFixed(2);

				let real = parseFloat(playerInfo["realPoint"]).toFixed(2);
				let addReal = parseFloat(serverPack.sportsPointList[i]).toFixed(2);
				let totalReal = parseFloat(real) + parseFloat(addReal);
				// playerInfo["realPoint"] = totalReal.toFixed(2);
				this.dataInfo["posList"][i]["realPoint"] = totalSp.toFixed(2);
			}
		}
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
			console.error("OnChangeDealVote not find posAgreeList:", this.dataInfo);
			return
		}
		if (pos >= posAgreeList.length) {
			console.error("OnChangeDealVote(%s,%s):", pos, agreeDissolve, posAgreeList);
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
	//房间结束
	OnRoomEnd: function (roomEnd) {
		this.dataInfo["state"] = this.ShareDefine.RoomState_End;
		this.dataInfo["roomEnd"] = roomEnd;
	},

	//开始解散房间
	OnStartVoteDissolve: function (createPos, endSec) {
		let posAgreeList = [];
		for (let index = 0; index < this.dataInfo["posList"].length; index++) {
			if (index == createPos) {
				posAgreeList.push(1);
			} else {
				posAgreeList.push(0);
			}
		}
		let dissolveInfo = {"endSec": endSec, "createPos": createPos, "posAgreeList": posAgreeList};
		this.dataInfo["dissolve"] = dissolveInfo;
		return dissolveInfo;
	},

	//位置同意拒绝更新
	OnPosDealVote: function (pos, agreeDissolve) {

		let dissolveInfo = this.dataInfo["dissolve"];
		let posAgreeList = dissolveInfo["posAgreeList"];
		if (!posAgreeList) {
			console.error("OnPosDealVote not find posAgreeList:", this.dataInfo);
			return
		}

		if (pos >= posAgreeList.length) {
			console.error("OnPosDealVote(%s,%s):", pos, agreeDissolve, posAgreeList);
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
	//更新Room datainfo数据
	OnPosUpdate: function (pos, posInfo) {
		cc.log("更新Room datainfo数据");
	
		

		if (posInfo) {
			let heroID = posInfo["pid"];
			let headImageUrl = posInfo["headImageUrl"];
			if (heroID && headImageUrl)
				app[app.subGameName + "_WeChatManager"]().InitHeroHeadImage(heroID, headImageUrl);
		}
		if (this.dataInfo.hasOwnProperty("posList")) {
			let tempInfo = this.GetPlayerInfoByPid(posInfo['pid']);
			if(tempInfo != null){
			    let	temppos = tempInfo["pos"]; 
				if(temppos == pos) {
					this.dataInfo["posList"][pos] = posInfo;
				}else {//位置不相等
				
					this.dataInfo["posList"][temppos]  = {"pos": temppos, "accountID": 0, "pid": 0};

					this.dataInfo["posList"][pos] = posInfo;

				}


			}else {
				this.dataInfo["posList"][pos] = posInfo;
			}
		
		cc.log(this.dataInfo);
			return true;
		}
		return false;
	},
		//更新房间信息
	SetRoomProperty: function (property, data) {
		if (!this.dataInfo.hasOwnProperty(property)) {
			console.error("SetRoomProperty not find:%", property);
			return;
		}
		this.dataInfo[property] = data;
	}
	,
	OnDissolve: function (dissolve) {
		this.dataInfo["dissolve"] = dissolve;
	},
	SetGameStateTime: function (dt) {
		this.dataInfo['set'].startTime = dt;
	},
	SetSelfLookPoker: function () {
		let slefPos = this.GetClientPos();
		if (-1 == slefPos) {
			return;
		}
		this.dataInfo["set"].posInfo[slefPos].checkCard = true;
	},
	SetOpenPoker: function (pos) {
		this.dataInfo["set"].posInfo[pos].openCard = true;
	},
	SetCallBacker: function (pos, value) {
		let needList = this.dataInfo["set"].callbackerList;
		let data = {
			"pos": pos,
			"num": value
		};
		needList.push(data);
	},
	SetAddBet: function (pos, addBet) {
		let posInfo = this.dataInfo["set"].posInfo;
		posInfo[pos].addBet = addBet;
	},
	GetUIPosByPos: function (pos, useClockwise = false) {
		//useClockwise UI按顺时针还是逆时针走(数据固定从0 +1)
		let selfPos = this.GetClientPos();
		if (pos == selfPos)
			return 0;

		let maxUINum = 10;
		if (pos < selfPos) {
			if (useClockwise) {
				return selfPos - pos;
			} else {
				return maxUINum - (selfPos - pos);
			}
		} else {
			if (useClockwise) {
				return maxUINum - (pos - selfPos);
			} else {
				return pos - selfPos;
			}
		}
	},
	GetGameStateTime: function () {
		return this.dataInfo["set"].startTime;
	},
	GetRoomPlayerCount: function () {
		return this.dataInfo["posList"].length;
	},
	OnSportsPointChange: function (serverPack) {
		//同步更新比赛分
		for (let i = 0; i < this.dataInfo["posList"].length; i++) {
			let playerInfo = this.dataInfo["posList"][i];
			if (pos == serverPack.posId &&
				playerInfo.pid == serverPack.pid) {
				let sp = parseFloat(playerInfo["sportsPoint"]).toFixed(2);
				let addSp = parseFloat(serverPack.sportsPoint).toFixed(2);
				let totalSp = parseFloat(sp) + parseFloat(addSp);
				//保留小数点后面两位
				playerInfo["sportsPoint"] = totalSp.toFixed(2);
				this.dataInfo["posList"][i]["sportsPoint"] = totalSp.toFixed(2);
			}
		}
	},
	//更新Room datainfo数据
	UpdataInfo: function (serverPack) {
		this.GetRoomPosMgr().OnPosOpCard(serverPack);
		return this.GetRoomSet().OnPosOpCard(serverPack)
	},
	//---------------------设置函数---------------------
	GetAllPlayPoker: function () {
		let pokers = [];
		let posInfo = this.dataInfo["set"].posInfo;
		for (let i = 0; i < posInfo.length; i++) {
			pokers.push(posInfo[i].cards);
		}
		return pokers;
	},
	GetPlayPokerByPos: function (pos) {
		let posInfo = this.dataInfo["set"].posInfo;
		for (let i = 0; i < posInfo.length; i++) {
			if (pos == i) {
				return posInfo[i].cards;
			}
		}
	},
	//删除已经打出的卡牌
	OnDeleteOutCard: function (cardID) {
		//如果是不是在牌局进行中
		if (this.dataInfo["state"] != this.ShareDefine.RoomState_Playing) {
			console.error("OnDeleteOutCard not RoomState_Playing");
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
			console.error("GetRoomProperty not find:%s", property);
			return
		}
		return this.dataInfo[property];
	},

	//获取房间配置信息
	GetRoomConfig: function () {
		return this.roomConfig
	},

	//获取房间配置信息
	GetRoomConfigByProperty: function (property) {
		if (!this.roomConfig.hasOwnProperty(property)) {
			console.error("GetRoomConfigByProperty not find:%s", property);
			return
		}
		return this.roomConfig[property];
	},
	//获取玩家当前局数据
	GetCurGamePlayerData: function (pos) {
		let posInfo = this.dataInfo["set"].posInfo;
		if (pos >= 0 && pos < posInfo.length) {
			return posInfo[pos];
		}
	},
	GetCurGameAllPlayerData: function () {
		return this.dataInfo["set"].posInfo;
	},
	GetRoomSet: function () {
		return null;
	},

	GetRoomPosMgr: function () {
		return this.RoomPosMgr;
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
			console.error("GetActionEndTick not RoomState_Playing");
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
				return endTick;
			}
		}
		return 0
	},

	//获取客户端玩家信息
	GetClientPlayerInfo: function () {
		let posList = this.dataInfo["posList"];
		let heroID = this.HeroManager.GetHeroID();
		for (let i = 0; i < posList.length; i++) {
			if (heroID == posList[i].pid) {
				return posList[i];
			}
		}
		return null
	},
	GetPlayerInfoByPid: function (pid) {
		let posList = this.dataInfo["posList"];
		for (let i = 0; i < posList.length; i++) {
			if (pid == posList[i].pid) {
				return posList[i];
			}
		}
		return null;
	},
	GetPlayerInfoByPos: function (pos) {
		let player = null;
		let posList = this.dataInfo["posList"];
		for (let i = 0; i < posList.length; i++) {
			if (pos == posList[i].pos)
				return posList[i];
		}
		return player;
	},
	GetClientPos: function () {
		let posList = this.dataInfo["posList"];
		let heroID = this.HeroManager.GetHeroID();
		for (let i = 0; i < posList.length; i++) {
			if (heroID == posList[i].pid) {
				return i;
			}
		}
		return -1;
	},
	GetRoomAllPlayerInfo: function () {
		return this.dataInfo["posList"];
	},
	/*
*战绩兼容扑克
 */
	SetGameRecord: function (bget) {
		this.isGetGR = bget;
	},
	GetGameRecord: function () {
		return this.isGetGR;
	},
});


var g_LZMJRoom = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_LZMJRoom)
		g_LZMJRoom = new LZMJRoom();
	return g_LZMJRoom;

}
