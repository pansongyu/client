"use strict";
cc._RF.push(module, 'fjssz4b2-accc-4eaa-ae07-9d9c649ba7e4', 'FJSSZRoomPosMgr');
// script/game/FJSSZ/RoomLogic/FJSSZRoomPosMgr.js

"use strict";

/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDM Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package FJSSZRoomPosMgr.js
 *  @todo: 自由扑克房间
 *
 *  @author hongdian
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
var FJSSZRoomPosMgr = app.BaseClass.extend({

	/**
  * 初始化
  */
	Init: function Init() {

		this.JS_Name = "FJSSZRoomPosMgr";

		this.ComTool = app[app.subGameName + "_ComTool"]();
		this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
		this.WeChatManager = app[app.subGameName + "_WeChatManager"]();

		// S2228_LostConnect
		this.OnReload();

		this.Log("Init");
	},

	OnReload: function OnReload() {
		//{
		//	1:{
		//		"pos":pos,
		//		"pid":pid,//pid=0未有玩家坐下
		//		"name":name,
		//		"roomReady":false,
		//		"gameReady":false,
		//		"giveUpGame":0,
		//		"point":100,
		//		"flashCnt":10,
		//		"paiPin":100,
		//		"up":10,
		//		"down":10
		// 		"isLostConnect":false
		// },
		//}
		this.dataInfo = {};

		this.clientPos = 0;
		this.downPos = -1;
		this.upPos = -1;
		this.facePos = -1;
		this.fivePos = -1;
		this.sixPos = -1;
		this.sevenPos = -1;
		this.eightPos = -1;
		this.posCount = -1;
		this.posId = -1;
		this.isLook = false;
	},

	//-----------------------回调函数-----------------------------
	OnInitRoomPosData: function OnInitRoomPosData(roomPosInfoList) {
		this.dataInfo = {};

		this.clientPos = 0;
		this.downPos = -1;
		this.upPos = -1;
		this.facePos = -1;
		this.fivePos = -1;
		this.sixPos = -1;
		this.sevenPos = -1;
		this.eightPos = -1;
		this.posCount = -1;
		this.realPosCount = 0;
		this.isLook = false;
		this.posId = -1;
		var heroImageUrlDict = {};
		var heroID = app[app.subGameName + "_HeroManager"]().GetHeroID();
		this.posCount = roomPosInfoList.length - this.ShareDefine.LookCount;
		for (var index = 0; index < roomPosInfoList.length; index++) {
			var roomPosInfo = roomPosInfoList[index];
			var pid = roomPosInfo["pid"];
			if (pid == heroID) {
				this.isLook = roomPosInfo.isLook;
				this.posId = roomPosInfo.pos;
			}
		}
		for (var _index = 0; _index < this.posCount; _index++) {
			var _roomPosInfo = roomPosInfoList[_index];
			var _pos = _roomPosInfo["pos"];
			this.dataInfo[_pos] = _roomPosInfo;

			var _pid = _roomPosInfo["pid"];
			var headImageUrl = _roomPosInfo["headImageUrl"];
			if (_pid == heroID) {
				this.clientPos = _pos;
			}
			if (_pid && headImageUrl) {
				heroImageUrlDict[_pid] = headImageUrl;
				this.realPosCount++;
			}
			if (_pid == 0) {
				_roomPosInfo["roomReady"] = false;
			}
		}

		this.WeChatManager.InitHeroHeadImageByDict(heroImageUrlDict);
		this.Log("OnInitRoomPosData:", this.dataInfo);
	},
	//获取房间有几个玩家
	GetRoomPlayerCount: function GetRoomPlayerCount() {
		return this.posCount;
	},

	OnPosLeave: function OnPosLeave(pos) {
		var playerInfo = this.dataInfo[pos];
		if (!playerInfo) {
			console.error("OnPosLeave not find:%s", pos);
			return;
		}
		playerInfo["pid"] = 0;
		playerInfo["name"] = 0;
		playerInfo["roomReady"] = false;
		playerInfo["gameReady"] = false;
		playerInfo["giveUpGame"] = 0;
		playerInfo["point"] = 0;
		playerInfo["flashCnt"] = 0;
		playerInfo["paiPin"] = 0;
		playerInfo["up"] = 0;
		playerInfo["down"] = 0;
	},
	OnSetStart: function OnSetStart(posInfo) {
		for (var i = 0; i < posInfo.length; i++) {
			var data = posInfo[i];
			for (var idx in this.dataInfo) {
				if (data.pid == this.dataInfo[idx].pid) {
					this.dataInfo[idx].isPlaying = data.isPlaying;
					break;
				}
			}
		}
	},
	OnChangeStatus: function OnChangeStatus(posInfo) {
		for (var i = 0; i < posInfo["posList"].length; i++) {
			var data = posInfo["posList"][i];
			for (var idx in this.dataInfo) {
				if (data.pid == this.dataInfo[idx].pid) {
					this.dataInfo[idx].isPlaying = data.isPlaying;
					break;
				}
			}
		}
	},
	OnPosOpCard: function OnPosOpCard(serverPack) {
		var isFlash = serverPack["isFlash"];
		var pos = serverPack["pos"];
		var falshCnt = this.dataInfo[pos]["flashCnt"];
		if (isFlash) {
			falshCnt++;
			this.dataInfo[pos]["flashCnt"] = falshCnt;
		}
	},
	//座位信息更新
	OnPosUpdate: function OnPosUpdate(pos, posInfo) {
		var playerInfo = this.dataInfo[pos];
		if (!playerInfo) {
			this.Log("OnPosUpdate not find:%s", pos);
			return true;
		}
		this.dataInfo[pos] = posInfo;

		var heroID = posInfo["pid"];
		var headImageUrl = posInfo["headImageUrl"];
		if (heroID && headImageUrl) {
			this.WeChatManager.InitHeroHeadImage(heroID, headImageUrl);
		}
		var heroID2 = app[app.subGameName + "_HeroManager"]().GetHeroID();
		if (heroID2 == heroID) {
			this.isLook = posInfo.isLook;
		}
		return true;
	},

	//每局积分更新
	onPosJifen: function onPosJifen(player) {

		var playerInfo = this.dataInfo[player.posIdx];
		if (!playerInfo) {
			this.Log("OnPosUpdate not find:%s", pos);
			return false;
		}
		playerInfo.point += player.shui;
	},
	//每局竞技点更新
	onPosSportsPoint: function onPosSportsPoint(player) {
		var playerInfo = this.dataInfo[player.posIdx];
		if (!playerInfo) {
			this.Log("OnPosUpdate not find:%s", posIdx);
			return false;
		}
		playerInfo.sportsPoint += player.sportsPoint;
	},

	onPosTotalJifen: function onPosTotalJifen(posList) {
		for (var idx = 0; idx < posList.length; idx++) {
			var player = posList[idx];
			var playerInfo = this.dataInfo[player.pos];
			if (!playerInfo) {
				this.Log("onPosTotalJifen not find:%s", player.pos);
				return false;
			}
			playerInfo.point = player.point;
		}
	},

	OnPosIsReady: function OnPosIsReady(pos, isReady) {
		var playerInfo = this.dataInfo[pos];
		if (!playerInfo) {
			this.Log("onPosTotalJifen not find:%s", pos);
			return false;
		}
		playerInfo.isCardReady = isReady;
	},

	//重置cardReady
	reSetCardReady: function reSetCardReady() {
		for (var idx in this.dataInfo) {
			var player = this.dataInfo[idx];
			player.isCardReady = false;
		}
	},

	//开局准备
	OnPosReadyChg: function OnPosReadyChg(pos, roomReady) {
		var playerInfo = this.dataInfo[pos];
		if (!playerInfo) {
			this.Log("OnPosReadyChg not find:%s", pos);
			return false;
		}
		playerInfo["roomReady"] = roomReady;
		return true;
	},
	GetNoReadyNum: function GetNoReadyNum() {
		var i = 0;
		var j = 0;
		for (var idx in this.dataInfo) {
			var player = this.dataInfo[idx];
			if (player.isCardReady == true) {
				i++;
			}
			j++;
		}
		return j - i;
	},
	//准备下一句
	OnPosContinueGame: function OnPosContinueGame(pos) {
		var playerInfo = this.dataInfo[pos];
		if (!playerInfo) {
			console.error("OnPosContinueGame not find:%s", pos);
			return;
		}
		playerInfo["gameReady"] = true;
	},

	OnSetEnd: function OnSetEnd(setEnd) {
		//let posHuList = setEnd["posHuList"];
		//清除准备状态
		for (var _pos2 in this.dataInfo) {
			var playerInfo = this.dataInfo[_pos2];
			//playerInfo["point"] += posHuList[pos]["point"];
			playerInfo["gameReady"] = false;
		}
	},
	OnSportsPointChange: function OnSportsPointChange(serverPack) {
		//同步更新竞技点
		console.log("同步更新竞技点", serverPack);
		for (var _pos3 in this.dataInfo) {
			var playerInfo = this.dataInfo[_pos3];
			if (_pos3 == serverPack.posId && playerInfo.pid == serverPack.pid) {
				var sp = parseFloat(playerInfo["sportsPoint"]).toFixed(2);
				var addSp = parseFloat(serverPack.sportsPoint).toFixed(2);
				var totalSp = parseFloat(sp) + parseFloat(addSp);
				//保留小数点后面两位
				playerInfo["sportsPoint"] = totalSp.toFixed(2);
				this.dataInfo[_pos3]['sportsPoint'] = totalSp.toFixed(2);
			}
		}
	},
	//-------------------------获取接口---------------------
	//获取客户端玩家准备状态
	GetPlayerReadyState: function GetPlayerReadyState(roomSetID) {
		var ReadyState = "";
		if (roomSetID > 0) {
			ReadyState = "gameReady";
		} else {
			ReadyState = "roomReady";
		}
		return this.GetPlayerInfoByPos(this.clientPos)[ReadyState];
	},

	//设置玩家离线状态
	SetPlayerOfflineState: function SetPlayerOfflineState(pos, isLostConnect, isShowLeave) {
		if (!this.dataInfo.hasOwnProperty(pos)) {
			console.error("SetPlayerOfflineState not find:%s", pos);
			return;
		}
		this.dataInfo[pos]["isLostConnect"] = isLostConnect;
		this.dataInfo[pos]["isShowLeave"] = isShowLeave;
	},

	//获取房间所有玩家信息
	GetRoomAllPlayerInfo: function GetRoomAllPlayerInfo() {
		return this.dataInfo;
	},

	GetPlayerInfoByPid: function GetPlayerInfoByPid(pid) {
		for (var i in this.dataInfo) {
			if (pid == this.dataInfo[i].pid) return this.dataInfo[i];
		}
		return null;
	},

	//获取房间指定位置玩家信息
	GetPlayerInfoByPos: function GetPlayerInfoByPos(pos) {
		if (!this.dataInfo.hasOwnProperty(pos)) {
			console.error("GetPlayerInfoByPos(%s) not find", pos);
			return;
		}
		return this.dataInfo[pos];
	},
	//获取客户端玩家的座位
	GetIsLook: function GetIsLook() {
		return this.isLook;
	},
	//获取客户端玩家的座位
	GetClientPos: function GetClientPos() {
		return this.clientPos;
	},

	//获取客户端玩家的上家位置ID
	GetClientUpPos: function GetClientUpPos() {
		return this.upPos;
	},

	//获取客户端玩家下家位置ID
	GetClientDownPos: function GetClientDownPos() {
		return this.downPos;
	},

	//获取客户端玩家对家位置ID
	GetClientFacePos: function GetClientFacePos() {
		return this.facePos;
	},
	//获取客户端玩家位置ID
	GetClientFivePos: function GetClientFivePos() {
		return this.fivePos;
	},
	//获取客户端玩家位置ID
	GetClientSixPos: function GetClientSixPos() {
		return this.sixPos;
	},
	//获取客户端玩家位置ID
	GetClientSevenPos: function GetClientSevenPos() {
		return this.sevenPos;
	},
	//获取客户端玩家位置ID
	GetClientEightPos: function GetClientEightPos() {
		return this.eightPos;
	},

	//获取开设房间位置的数量
	GetPosCount: function GetPosCount() {
		return this.posCount;
	},

	//服务端位置转客户端位置
	GetUIPosByDataPos: function GetUIPosByDataPos(dataPos, realPosCount) {
		//realPosCoun
		var back = this.clientPos;
		if (this.clientPos >= this.posCount || this.clientPos == -1) {
			this.clientPos = 0;
		}
		if (2 == this.posCount) {
			//0,4
			this.fivePos = this.clientPos == 0 ? 1 : 0;
		}if (3 == this.posCount) {
			//0,3,5,6
			this.sevenPos = (this.clientPos + this.posCount - 1) % this.posCount;
			this.fivePos = (this.clientPos + 1) % this.posCount;
		} else if (4 == this.posCount) {
			//0,3,5,6
			this.sevenPos = (this.clientPos + this.posCount - 1) % this.posCount;
			this.upPos = (this.clientPos + 1) % this.posCount;
			this.sixPos = (this.clientPos + 2) % this.posCount;
		} else if (5 == this.posCount) {
			//0,3,4,5,6
			this.sevenPos = (this.clientPos + this.posCount - 1) % this.posCount;
			this.upPos = (this.clientPos + 1) % this.posCount;
			this.fivePos = (this.clientPos + 2) % this.posCount;
			this.sixPos = (this.clientPos + 3) % this.posCount;
		} else if (6 == this.posCount) {
			this.sevenPos = (this.clientPos + this.posCount - 1) % this.posCount;
			this.downPos = (this.clientPos + 1) % this.posCount;
			this.upPos = (this.clientPos + 2) % this.posCount;
			this.fivePos = (this.clientPos + 3) % this.posCount;
			this.sixPos = (this.clientPos + 4) % this.posCount;
		} else if (7 == this.posCount) {
			this.sevenPos = (this.clientPos + this.posCount - 1) % this.posCount;
			this.downPos = (this.clientPos + 1) % this.posCount;
			this.facePos = (this.clientPos + 2) % this.posCount;
			this.upPos = (this.clientPos + 3) % this.posCount;
			this.fivePos = (this.clientPos + 4) % this.posCount;
			this.sixPos = (this.clientPos + 5) % this.posCount;
		} else if (8 == this.posCount) {
			this.eightPos = (this.clientPos + this.posCount - 1) % this.posCount; //7
			this.downPos = (this.clientPos + 1) % this.posCount; //1
			this.facePos = (this.clientPos + 2) % this.posCount; //2
			this.upPos = (this.clientPos + 3) % this.posCount; //3
			this.fivePos = (this.clientPos + 4) % this.posCount; //4
			this.sixPos = (this.clientPos + 5) % this.posCount; //5
			this.sevenPos = (this.clientPos + 6) % this.posCount; //6
		}

		if (dataPos == this.clientPos) {
			this.clientPos = back;
			return 0;
		}
		this.clientPos = back;
		if (dataPos == this.downPos) {
			return 1;
		} else if (dataPos == this.facePos) {
			return 2;
		} else if (dataPos == this.upPos) {
			return 3;
		} else if (dataPos == this.fivePos) {
			return 4;
		} else if (dataPos == this.sixPos) {
			return 5;
		} else if (dataPos == this.sevenPos) {
			return 6;
		} else if (dataPos == this.eightPos) {
			return 7;
		}
	}
});

var g_FJSSZRoomPosMgr = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_FJSSZRoomPosMgr) g_FJSSZRoomPosMgr = new FJSSZRoomPosMgr();
	return g_FJSSZRoomPosMgr;
};

cc._RF.pop();