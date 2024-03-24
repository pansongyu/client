/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDM Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package LZMJRoomPosMgr.js
 *  @todo: 龙岩麻将房间
 *
 *  @author hongdian
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
var LZMJRoomPosMgr = app.BaseClass.extend({

	/**
	 * 初始化
	 */
	Init: function () {

		this.JS_Name = app["subGameName"] + "RoomPosMgr";

		this.ComTool = app[app.subGameName + "_ComTool"]();
		this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
		this.WeChatManager = app[app.subGameName + "_WeChatManager"]();

		// S2228_LostConnect
		this.OnReload();

		//console.log("Init");


	},

	OnReload: function () {
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

		this.clientPos = -1;
		this.downPos = -1;
		this.upPos = -1;
		this.facePos = -1;
	},


	//-----------------------回调函数-----------------------------
	OnInitRoomPosData: function (roomPosInfoList) {
		this.dataInfo = {};
		
		this.clientPos = -1;
		this.downPos = -1;
		this.upPos = -1;
		this.facePos = -1;

		let heroImageUrlDict = {};
		let heroID = app[app.subGameName + "_HeroManager"]().GetHeroID();
		let count = roomPosInfoList.length;
		cc.log("房间信息初始化");
		for (let index = 0; index < count; index++) {
			let roomPosInfo = roomPosInfoList[index];
			let pos = roomPosInfo["pos"];
			this.dataInfo[pos] = roomPosInfo;


			let pid = roomPosInfo["pid"];
			let headImageUrl = roomPosInfo["headImageUrl"];
			if (pid == heroID) {
				this.clientPos = pos;
			}
			if (pid && headImageUrl) {
				heroImageUrlDict[pid] = headImageUrl;
				app[app.subGameName + "_WeChatManager"]().InitHeroHeadImage(pid, headImageUrl);
			}
	
		}

		//this.WeChatManager.InitHeroHeadImageByDict(heroImageUrlDict);
		// if (this.clientPos < 0) {
		// 	console.error("OnInitRoomPosData clientPos not find");
		// }
		// else {
		// 	let posCount = 4;
		// 	if (count == 2) {
		// 		this.facePos = this.clientPos == 0 ? 1 : 0;
		// 	} else if (count == 3) {
		// 		this.upPos = (this.clientPos + posCount - 1) % posCount;
		// 		this.downPos = (this.clientPos + 1) % posCount;
		// 		this.facePos = (this.clientPos + 2) % posCount;
		// 		//三人麻将，有一家是空的
		// 		if (this.clientPos == 0) {
		// 			this.upPos = -1;
		// 		}
		// 		if (this.clientPos == 1) {
		// 			this.facePos = -1;
		// 		}
		// 		if (this.clientPos == 2) {
		// 			this.downPos = -1;
		// 		}
		// 	} else {
		// 		this.upPos = (this.clientPos + posCount - 1) % posCount;
		// 		this.downPos = (this.clientPos + 1) % posCount;
		// 		this.facePos = (this.clientPos + 2) % posCount;
		// 	}
		// 	console.log("upPos(%s) clientPos(%s) downPos(%s) facePos(%s)", this.upPos, this.clientPos, this.downPos, this.facePos);
		// }

		console.log("OnInitRoomPosData:", this.dataInfo)
	},

	OnPosLeave: function (pos) {
		let playerInfo = this.dataInfo[pos];
		if (!playerInfo) {
			console.error("OnPosLeave not find:%s", pos);
			return
		}
		playerInfo["isLostConnect"] = 0;
		playerInfo["pid"] = 0;
		playerInfo["name"] = 0;
		playerInfo["roomReady"] = false;
		playerInfo["gameReady"] = false;
		playerInfo["isPosReady"] = false;
		playerInfo["giveUpGame"] = 0;
		playerInfo["point"] = 0;
		playerInfo["realPoint"] = 0;
		playerInfo["flashCnt"] = 0;
		playerInfo["paiPin"] = 0;
		playerInfo["up"] = 0;
		playerInfo["down"] = 0;
	},
	GetPosReady: function (pos) {
		return this.dataInfo[pos]["isPosReady"];
	},
	OnPosOpCard: function (serverPack) {
		let isFlash = serverPack["isFlash"];
		let pos = serverPack["pos"];
		/*let falshCnt = this.dataInfo[pos]["flashCnt"];
		if (isFlash) {
			falshCnt++;
			this.dataInfo[pos]["flashCnt"] = falshCnt;
		}*/
	},
	//座位信息更新
	OnPosUpdate: function (pos, posInfo) {
		let playerInfo = this.dataInfo[pos];
		cc.log("原始座位信息");
		cc.log(this.dataInfo);

		if (!playerInfo) {
			console.log("OnPosUpdate not find:%s", pos);
			return false
		}

		this.dataInfo[pos] = posInfo;
		let heroID = posInfo["pid"];
		let headImageUrl = posInfo["headImageUrl"];
		if (heroID && headImageUrl) {
			app[app.subGameName + "_WeChatManager"]().InitHeroHeadImage(heroID, headImageUrl);
		}

		return true
	},
	SetPosReady: function (pos, isPosReady) {
		this.dataInfo[pos]["isPosReady"] = isPosReady;
		return true
	},
	//开局准备
	OnPosReadyChg: function (pos, roomReady) {
		let playerInfo = this.dataInfo[pos];
		if (!playerInfo) {
			console.log("OnPosReadyChg not find:%s", pos);
			return false
		}
		playerInfo["roomReady"] = roomReady;

		return true
	},

	//准备下一句
	OnPosContinueGame: function (pos) {
		let playerInfo = this.dataInfo[pos];
		if (!playerInfo) {
			console.error("OnPosContinueGame not find:%s", pos);
			return
		}
		playerInfo["gameReady"] = true;
	},

	OnSetEnd:function(setEnd){
		let pointList = setEnd["pointList"];
		let sportsPointList = setEnd["sportsPointList"];
		//清除准备状态
		for(let pos in this.dataInfo){
			let playerInfo = this.dataInfo[pos];
			pos = parseInt(pos);
			playerInfo["point"] += pointList[parseInt(pos)];
			playerInfo["gameReady"] = false;
			this.dataInfo[pos]['point']=playerInfo["point"];
			//比赛分
			if (typeof(playerInfo.sportsPoint)!="undefined") {
				let sp = parseFloat(playerInfo["sportsPoint"]).toFixed(2);
				let addSp = parseFloat(setEnd.sportsPointList[pos]).toFixed(2);
				let totalSp = parseFloat(sp) + parseFloat(addSp);
				//保留小数点后面两位
				playerInfo["sportsPoint"] = totalSp.toFixed(2);
				this.dataInfo[pos]['sportsPoint'] = totalSp.toFixed(2);

				let real = parseFloat(playerInfo["realPoint"]).toFixed(2);
				let addReal = parseFloat(setEnd.sportsPointList[pos]).toFixed(2);
				let totalReal = parseFloat(real) + parseFloat(addReal);
				playerInfo["realPoint"] = totalReal.toFixed(2);
			}
		}
	},
	OnSportsPointChange: function (serverPack) {
		//同步更新比赛分
		for (let pos in this.dataInfo) {
			let playerInfo = this.dataInfo[pos];
			if (pos == serverPack.posId &&
				playerInfo.pid == serverPack.pid) {
				let sp = parseFloat(playerInfo["sportsPoint"]).toFixed(2);
				let addSp = parseFloat(serverPack.sportsPoint).toFixed(2);
				let totalSp = parseFloat(sp) + parseFloat(addSp);
				//保留小数点后面两位
				playerInfo["sportsPoint"] = totalSp.toFixed(2);
				this.dataInfo[pos]['sportsPoint'] = totalSp.toFixed(2);
			}
		}
	},

	//-------------------------获取接口---------------------
	//获取客户端玩家准备状态
	GetPlayerReadyState: function (roomSetID) {
		let ReadyState = "";
		if (roomSetID > 0) {
			ReadyState = "gameReady";
		}
		else {
			ReadyState = "roomReady";
		}
		return this.GetPlayerInfoByPos(this.clientPos)[ReadyState];
	},

	//设置玩家离线状态
	SetPlayerOfflineState: function (pos, isLostConnect, isShowLeave) {
		if (!this.dataInfo.hasOwnProperty(pos)) {
			console.error("SetPlayerOfflineState not find:%s", pos);
			return
		}
		this.dataInfo[pos]["isLostConnect"] = isLostConnect;
		this.dataInfo[pos]["isShowLeave"] = isShowLeave;
	},

	// //获取房间所有玩家信息
	GetRoomAllPlayerInfo: function () {
		return this.dataInfo
	},
	//获取房间有几个玩家
	GetRoomPlayerCount: function () {
		let count = 0;
		if (this.clientPos > -1) {
			count++;
		}
		if (this.downPos > -1) {
			count++;
		}
		if (this.upPos > -1) {
			count++;
		}
		if (this.facePos > -1) {
			count++;
		}
		return count;
	},
	//获取房间指定位置玩家信息
	GetPlayerInfoByPos: function (pos) {
		if (!this.dataInfo.hasOwnProperty(pos)) {
			console.error("GetPlayerInfoByPos(%s) not find", pos);
			return
		}
		return this.dataInfo[pos];
	},

	//获取客户端玩家的座位
	GetClientPos: function () {
		return this.clientPos
	},

	//获取客户端玩家的上家位置ID
	GetClientUpPos: function () {
		return this.upPos
	},

	//获取客户端玩家下家位置ID
	GetClientDownPos: function () {
		return this.downPos
	},

	//获取客户端玩家对家位置ID
	GetClientFacePos: function () {
		return this.facePos
	},

	GetUIPosByDataPos: function (dataPos) {
		let player = this.GetPlayerInfoByPos(dataPos);
		if (!player || !player["pid"]) {
			return -1;
		}
		let clientPos = this.GetClientPos();
		let downPos = this.GetClientDownPos();
		let facePos = this.GetClientFacePos();
		let upPos = this.GetClientUpPos();
		if (player["pos"] == clientPos)
			return 1;
		else if (player["pos"] == downPos)
			return 2;
		else if (player["pos"] == facePos)
			return 3;
		else if (player["pos"] == upPos)
			return 4;
		else
			return -1;
	}

})


var g_LZMJRoomPosMgr = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_LZMJRoomPosMgr)
		g_LZMJRoomPosMgr = new LZMJRoomPosMgr();
	return g_LZMJRoomPosMgr;

}
