"use strict";
cc._RF.push(module, 'df11aBaLcVJpYdrORLqHmDt', 'TestManager');
// script/lib/TestManager.js

"use strict";

/*
 * 	TestManager.js
 * 	测试
 *
 *	author:cyh
 *	date:2017-01-09
 *	version:1.0
 *
 * 修改时间 修改人 修改内容:
 *
 *
 */
var app = require('app');

/*
 * 类方法定义
 */
var TestManager = app.BaseClass.extend({

	/**
  *  初始化
  */
	Init: function Init() {
		this.JS_Name = "TestManager";
		this.ShareDefine = app.ShareDefine();
		this.ComTool = app.ComTool();
	},

	//是否发布模式
	IsRelease: function IsRelease() {
		if (this.ShareDefine.IsDevelopment) {
			return false;
		}
		return true;
	},

	//发送GM命令
	gm: function gm(cmdString) {
		app.NetManager().SendGMPack(cmdString);
	},

	setstart: function setstart() {

		var serverPack = {
			"roomID": 151676,
			"setInfo": {
				"dPos": 0,
				"gangMoCnt": 0,
				"leftMa": 2,
				"normalMoCnt": 52,
				"saizi": [6, 1],
				"setEnd": { "maCardList": [], "posHuList": [], "zhongMa": 0 },
				"setID": 1,
				"setPosList": [{
					"handCard": -1,
					"huCard": [],
					"outCard": [],
					"posID": 0,
					"publicCardList": [],
					"shouCard": [1501, 1702, 1901, 2302, 2502, 2504, 2901, 2902, 3101, 3104, 3304, 3803, 3903]
				}, {
					"handCard": -1,
					"huCard": [],
					"outCard": [],
					"posID": 0,
					"publicCardList": [],
					"shouCard": [4502, 1102, 1302, 1303, 1404, 1601, 1701, 2204, 2404, 3404, 3604, 3901, 3904]
				}, {
					"handCard": -1,
					"huCard": [],
					"outCard": [],
					"posID": 0,
					"publicCardList": [],
					"shouCard": [1403, 1703, 1801, 1803, 1804, 2304, 2402, 2604, 2703, 2801, 2803, 2903, 3201]
				}, {
					"handCard": -1,
					"huCard": [],
					"outCard": [],
					"posID": 0,
					"publicCardList": [],
					"shouCard": [4504, 1203, 1301, 1504, 1704, 1902, 2202, 2503, 2702, 3401, 3501, 3502, 3703]
				}],
				"setRound": {
					"opPosList": [{ "opCard": 0, "opList": ["Out"], "opType": 8, "waitOpPos": 0 }],
					"startWaitSec": 1489644417,
					"waitID": 1
				},
				"startPaiDun": 1,
				"startPaiPos": 2,
				"state": "Init",
				"waitReciveCard": 0
			}
		};
		app.LYMJRoomMgr().OnPack_SetStart(serverPack);
	},

	//牌局结束
	setend: function setend() {

		var RoomMgr = app.LYMJRoomMgr();
		var room = RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("setend 没有进入房间");
			return;
		}
		var roomPosMgr = room.GetRoomPosMgr();
		var allPlayerInfo = roomPosMgr.GetRoomAllPlayerInfo();

		var posHuList = [];
		for (var pos in allPlayerInfo) {
			var playerInfo = allPlayerInfo[pos];
			var pid = playerInfo["pid"];
			if (!pid) {
				this.ErrLog("pos:%s not player", pos);
			}
			var HuType = "NotHu";
			if (pos == 1) {
				HuType = "QGH";
			}
			if (pos == 2) {
				HuType = "QGH";
			}
			posHuList.push({
				"pos": pos,
				"huType": HuType,
				"point": this.ComTool.RandInt(-400, 1000),
				"flashCnt": this.ComTool.RandInt(0, 10),
				"shouCard": [],
				"handCard": 0,
				"zhongMa": 100,
				"maCardList": [2101, 1101, 2201, 2501, 2901]
			});
		}

		var setEnd = {
			"posHuList": posHuList
		};
		app.LYMJRoomMgr().OnPack_SetEnd({ "roomID": 0, "setEnd": setEnd });
	},

	//房间结束
	roomend: function roomend() {

		var HZRoomMgr = app.HZRoomMgr();
		var room = HZRoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("roomend 没有进入房间");
			return;
		}

		var roomPosMgr = room.GetRoomPosMgr();
		var allPlayerInfo = roomPosMgr.GetRoomAllPlayerInfo();

		var posInfo = {};
		for (var pos in allPlayerInfo) {
			var playerInfo = allPlayerInfo[pos];
			var pid = playerInfo["pid"];
			if (!pid) {
				this.ErrLog("pos:%s not player", pos);
			}

			posInfo[pos] = {
				"name": playerInfo["name"],
				"pid": playerInfo["pid"],
				"headImageUrl": playerInfo["headImageUrl"],
				"huCnt": this.ComTool.RandInt(0, 10),
				"zhongMaCnt": this.ComTool.RandInt(0, 10),
				"flashCnt": this.ComTool.RandInt(0, 50),
				"point": this.ComTool.RandInt(0, 1000)
			};
		}

		var roomEnd = {
			//房间胡的总次数
			"record": {
				"endSec": 1490234194,
				"fastCnt": [0, 0, 0, 0],
				"players": posInfo,
				"point": [0, 1, 2, 3],
				"huAllCnt": [0, 0, 0, 0]
			}
		};
		app.HZRoomMgr().OnPack_RoomEnd(roomEnd);
	},

	//发起解散
	StartVoteDissolve: function StartVoteDissolve(startPos) {
		//默认0位置发起
		if (!startPos) {
			startPos = 0;
		}

		var endSec = Math.floor(Date.now() / 1000 + 90);
		var serverPack = {
			"roomID": 0,
			"createPos": startPos,
			"endSec": endSec
		};
		app.HZRoomMgr().OnPack_StartVoteDissolve(serverPack);
	},

	//位置更新是否同意解散
	PosDealVote: function PosDealVote(pos, agreeDissolve) {

		if (!pos) {
			pos = 0;
		}
		if (!agreeDissolve) {
			agreeDissolve = 0;
		}

		var serverPack = {
			"roomID": 0,
			"pos": pos,
			"agreeDissolve": agreeDissolve
		};
		app.HZRoomMgr().OnPack_PosDealVote(serverPack);
	}
});

var g_TestManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_TestManager) {
		g_TestManager = new TestManager();
	}
	return g_TestManager;
};

cc._RF.pop();