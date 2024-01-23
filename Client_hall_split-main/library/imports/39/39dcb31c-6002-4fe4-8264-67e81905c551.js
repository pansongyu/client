"use strict";
cc._RF.push(module, '39dcbMcYAJP5IJkZ+gZBcVR', 'UIRecordAll_Child');
// script/ui/uiChild/UIRecordAll_Child.js

"use strict";

/*
 UIGMTool_Child2 GM工具子界面
 */
var app = require("app");
var SubgameManager = require('SubgameManager');
cc.Class({
	extends: require("BaseChildForm"),

	properties: {
		//    touxiang:cc.Node,
		//    info:cc.Node,

	},

	//创建界面回掉
	OnCreateInit: function OnCreateInit() {
		this.FormManager = app.FormManager();
		this.ShareDefine = app.ShareDefine();
		this.HeroManager = app.HeroManager();
		this.heroName = this.HeroManager.GetHeroProperty("name");
		if (this.heroName.length > 9) this.heroName = this.heroName.substring(0, 9);
		this.heroId = this.HeroManager.GetHeroProperty("pid");
		this.WeChatManager = app.WeChatManager();
		this.ComTool = app.ComTool();
		this.RoomID = 0;
		this.datainfo = false;
		this.record = false;
		this.playerList = false;
		this.gameType = 0;
	},

	InitShowInfo: function InitShowInfo() {
		var recodelist = app['recodelist'];
		var userData = this.GetFormProperty("UserData");
		this.record = recodelist[userData];
		this.clubId = 0;
		this.unionId = this.record.unionId;
		var uiRecordNode = this.node.parent.parent.parent.parent;
		if (uiRecordNode) {
			var com = uiRecordNode.getComponent(uiRecordNode.name);
			this.clubId = com.clubId;
		}
		this.SetPlayerInfo(userData, this.record);
	},
	//显示
	OnShow: function OnShow() {
		this.InitShowInfo();
	},
	SetPlayerInfo: function SetPlayerInfo(key, record) {
		this.SetWndProperty("lb_chengji_lost", "active", false);
		this.SetWndProperty("lb_chengji_win", "active", false);
		var endTime = this.ComTool.GetDateYearMonthDayHourMinuteString(record.endTime);
		var endTimeList = endTime.split(" ");
		this.SetWndProperty("lb_date", "text", endTimeList[0]);
		this.SetWndProperty("lb_time", "text", endTimeList[1]);
		this.SetWndProperty("bg_ju/lb_ju", "text", parseInt(key) + 1);
		if (0 == this.clubId) this.SetWndProperty("lb_username", "text", this.heroName);else this.SetWndProperty("lb_username", "text", this.heroName);
		this.gameType = record.gameType;
		console.log("SetPlayerInfo this.gameType:", this.gameType);
		var gamename = this.ShareDefine.GametTypeID2Name[this.gameType];

		console.log("SetPlayerInfo gamename:", gamename);
		var ju = record.setCount + "局";
		if (record.setCount == 100) {
			//厦门麻将1考服务端下发100局
			ju = '1考';
		} else if (record.setCount == 201) {
			//福鼎麻将1考服务端下发201局
			ju = '1拷';
		} else if (record.setCount == 40) {
			ju = '打捆40分';
		} else if (record.setCount == 50) {
			ju = '打捆50分';
		} else if (record.setCount > 100 && record.setCount < 200) {
			//保定易县麻将
			ju = record.setCount % 100 + '圈';
		} else if (record.setCount == 310) {
			//南安麻将1课服务端下发310局
			ju = '1课:10分';
		} else if (record.setCount == 311) {
			//泉州麻将1课服务端下发310局
			ju = '1课:100分';
		} else if (record.setCount == 312) {
			//衢州麻将局麻服务端下发312局
			ju = '局麻';
		}
		if (this.gameType == 57) {
			// 巢湖麻将
			if (record.setCount == 30 || record.setCount == 50 || record.setCount == 100) {
				ju = record.setCount + '锅';
			}
		} else if (record.setCount == 401 && this.gameType == this.ShareDefine.GameType_JXFZGP) {
			//江西抚州关牌服务端下发401局
			ju = '1次';
		} else if (record.setCount >= 400 && this.gameType == this.ShareDefine.GameType_GD) {
			//掼蛋服务端下发408，410，414局
			ju = '1次';
			var setCount = record.setCount % 400;
			if (setCount == 14) {
				ju = "过A";
			} else {
				ju = "过" + setCount;
			}
		} else if (record.setCount >= 400 && this.gameType == this.ShareDefine.GameType_WHMJ) {
			var _setCount = record.setCount % 400;
			ju = _setCount + "底";
		} else if (record.setCount >= 600 && this.gameType == this.ShareDefine.GameType_MASMJ) {
			var _setCount2 = record.setCount % 600;
			ju = _setCount2 + "倒";
		} else if (this.gameType == 205) {
			// 株洲牛十别
			if (record.setCount == 501) {
				ju = '千分局';
			}
		} else if (record.setCount == 501 && this.gameType == this.ShareDefine.GameType_GLWSK) {
			ju = "";
		}
		var renshu = record.playerNum + "人场";
		this.SetWndProperty("lb_gameinfo", "text", gamename + "  " + ju + "  " + renshu);
		this.SetWndProperty("lb_roomid", "text", record.roomKey);
		this.datainfo = this.Str2Json(record.dataJsonRes);
		this.playerList = this.Str2Json(record.playerList);
		console.log("SetPlayerInfo record.playerList：", record.playerList);
		console.log("SetPlayerInfo this.playerList：", this.playerList);
		//读取玩家头像
		var heroImageUrlDict = {};
		for (var i = 0; i < this.playerList.length; i++) {
			var pid = this.playerList[i]["pid"];
			var headImageUrl = this.playerList[i]["iconUrl"];
			if (pid && headImageUrl) {
				this.WeChatManager.InitHeroHeadImage(pid, headImageUrl);
			}
		}
		//this.WeChatManager.InitHeroHeadImageByDict(heroImageUrlDict);
		if (this.datainfo) {
			this.RoomID = this.datainfo.roomId;
			var point = 0;
			if (this.datainfo.resultsList) {
				point = this.GetRecord(this.heroId, this.datainfo.resultsList);
			} else {
				point = this.GetRecord(this.heroId, this.datainfo.countRecords);
			}
			if (point > 0) {
				this.SetWndProperty("lb_chengji_win", "text", '+' + point);
				this.SetWndProperty("lb_chengji_win", "active", true);
			} else {
				this.SetWndProperty("lb_chengji_lost", "text", point);
				this.SetWndProperty("lb_chengji_lost", "active", true);
			}
			//比赛分
			if (this.unionId > 0) {
				var sportsPoint = 0;
				this.SetWndProperty("sportsPoint", "active", true);
				this.SetWndProperty("lb_sportsPoint", "active", true);
				if (this.datainfo.resultsList) {
					sportsPoint = this.GetSportsPoint(this.heroId, this.datainfo.resultsList);
				} else {
					sportsPoint = this.GetSportsPoint(this.heroId, this.datainfo.countRecords);
				}
				if (sportsPoint > 0) {
					this.SetWndProperty("lb_sportsPoint", "text", '+' + sportsPoint);
				} else {
					this.SetWndProperty("lb_sportsPoint", "text", sportsPoint);
				}
			} else {
				this.SetWndProperty("sportsPoint", "active", false);
				this.SetWndProperty("lb_sportsPoint", "active", false);
			}
		}
	},
	OnClick_ShowMore: function OnClick_ShowMore() {
		if (this.ShareDefine.GameType_PYZHW == this.gameType) {
			var smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			var path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
			this.FormManager.ShowForm(path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_BP == this.gameType) {
			var _smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			var _path = "ui/uiGame/" + _smallName + "/UIRecordAllResult_" + _smallName;
			this.FormManager.ShowForm(_path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_CDP == this.gameType) {
			var _smallName2 = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			var _path2 = "ui/uiGame/" + _smallName2 + "/UIRecordAllResult_" + _smallName2;
			this.FormManager.ShowForm(_path2, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_GZMJ == this.gameType) {
			var _smallName3 = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			var _path3 = "ui/uiGame/" + _smallName3 + "/UIRecordAllResult_" + _smallName3;
			this.FormManager.ShowForm(_path3, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_DCTS == this.gameType) {
			var _smallName4 = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			var _path4 = "ui/uiGame/" + _smallName4 + "/UIRecordAllResult_" + _smallName4;
			this.FormManager.ShowForm(_path4, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_JDZTS == this.gameType) {
			var _smallName5 = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			var _path5 = "ui/uiGame/" + _smallName5 + "/UIRecordAllResult_" + _smallName5;
			this.FormManager.ShowForm(_path5, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_DD == this.gameType) {
			var _smallName6 = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			var _path6 = "ui/uiGame/" + _smallName6 + "/UIRecordAllResult_" + _smallName6;
			this.FormManager.ShowForm(_path6, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_JAWZ == this.gameType) {
			var _smallName7 = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			var _path7 = "ui/uiGame/" + _smallName7 + "/UIRecordAllResult_" + _smallName7;
			this.FormManager.ShowForm(_path7, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_THBBZ == this.gameType) {
			var _smallName8 = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			var _path8 = "ui/uiGame/" + _smallName8 + "/UIRecordAllResult_" + _smallName8;
			this.FormManager.ShowForm(_path8, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_GYZJMJ == this.gameType) {
			var _smallName9 = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			var _path9 = "ui/uiGame/" + _smallName9 + "/UIRecordAllResult_" + _smallName9;
			this.FormManager.ShowForm(_path9, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_GSMJ == this.gameType) {
			var _smallName10 = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			var _path10 = "ui/uiGame/" + _smallName10 + "/UIRecordAllResult_" + _smallName10;
			this.FormManager.ShowForm(_path10, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_LPTS == this.gameType) {
			var _smallName11 = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			var _path11 = "ui/uiGame/" + _smallName11 + "/UIRecordAllResult_" + _smallName11;
			this.FormManager.ShowForm(_path11, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_GLWSK == this.gameType) {
			var _smallName12 = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			var _path12 = "ui/uiGame/" + _smallName12 + "/UIRecordAllResult_" + _smallName12;
			this.FormManager.ShowForm(_path12, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_ZGQZMJ == this.gameType) {
			var _smallName13 = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			var _path13 = "ui/uiGame/" + _smallName13 + "/UIRecordAllResult_" + _smallName13;
			this.FormManager.ShowForm(_path13, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_ASMJ == this.gameType) {
			var _smallName14 = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			var _path14 = "ui/uiGame/" + _smallName14 + "/UIRecordAllResult_" + _smallName14;
			this.FormManager.ShowForm(_path14, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_WXZMMJ == this.gameType) {
			var _smallName15 = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			var _path15 = "ui/uiGame/" + _smallName15 + "/UIRecordAllResult_" + _smallName15;
			this.FormManager.ShowForm(_path15, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_CP == this.gameType) {
			var _smallName16 = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			var _path16 = "ui/uiGame/" + _smallName16 + "/UIRecordAllResult_" + _smallName16;
			this.FormManager.ShowForm(_path16, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_JXYZ == this.gameType) {
			var _smallName17 = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			var _path17 = "ui/uiGame/" + _smallName17 + "/UIRecordAllResult_" + _smallName17;
			this.FormManager.ShowForm(_path17, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_YCFXMJ == this.gameType) {
			var _smallName18 = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			var _path18 = "ui/uiGame/" + _smallName18 + "/UIRecordAllResult_" + _smallName18;
			this.FormManager.ShowForm(_path18, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_PY == this.gameType) {
			var _smallName19 = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			var _path19 = "ui/uiGame/" + _smallName19 + "/UIRecordAllResult_" + _smallName19;
			this.FormManager.ShowForm(_path19, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_KLMJ == this.gameType) {
			var _smallName20 = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			var _path20 = "ui/uiGame/" + _smallName20 + "/UIRecordAllResult_" + _smallName20;
			this.FormManager.ShowForm(_path20, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_QWWES == this.gameType) {
			var _smallName21 = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			var _path21 = "ui/uiGame/" + _smallName21 + "/UIRecordAllResult_" + _smallName21;
			this.FormManager.ShowForm(_path21, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_SGLK == this.gameType) {
			var _smallName22 = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			var _path22 = "ui/uiGame/" + _smallName22 + "/UIRecordAllResult_" + _smallName22;
			this.FormManager.ShowForm(_path22, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_SSE == this.gameType) {
			var _smallName23 = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			var _path23 = "ui/uiGame/" + _smallName23 + "/UIRecordAllResult_" + _smallName23;
			this.FormManager.ShowForm(_path23, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_XSDQ == this.gameType) {
			var _smallName24 = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			var _path24 = "ui/uiGame/" + _smallName24 + "/UIRecordAllResult_" + _smallName24;
			this.FormManager.ShowForm(_path24, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_JYESSZ == this.gameType) {
			var _smallName25 = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			var _path25 = "ui/uiGame/" + _smallName25 + "/UIRecordAllResult_" + _smallName25;
			this.FormManager.ShowForm(_path25, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		this.FormManager.ShowForm("UIRecordAllResult", this.record.roomId, this.playerList, this.gameType, this.unionId, this.record.roomKey);
	},
	OnClick_ShowAll: function OnClick_ShowAll() {
		if (this.datainfo) {
			if (this.ShareDefine.GameType_GLWSK == this.gameType) {
				var smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
				var path = "ui/uiGame/" + smallName + "/UIResultAllDetail_" + smallName;
				this.FormManager.ShowForm(path, this.datainfo, this.playerList, this.gameType, this.unionId);
				return;
			}
			if (this.ShareDefine.GameType_ZGQZMJ == this.gameType) {
				var _smallName26 = this.ShareDefine.GametTypeID2PinYin[this.gameType];
				var _path26 = "ui/uiGame/" + _smallName26 + "/UIResultAllDetail_" + _smallName26;
				this.FormManager.ShowForm(_path26, this.datainfo, this.playerList, this.gameType, this.unionId);
				return;
			}
			this.FormManager.ShowForm("UIResultAllDetail", this.datainfo, this.playerList, this.gameType, this.unionId);
		} else {
			console.log("服务端数据异常");
		}
	},
	GetRecord: function GetRecord(pid, resultsList) {
		var count = resultsList.length;
		for (var i = 0; i < count; i++) {
			if (resultsList[i]['pid'] == pid) {
				var point = resultsList[i]['point'];
				//四支刀专用
				if (this.gameType == this.ShareDefine.GameType_SZD) {
					point = resultsList[i]['resultPoint'];
				}
				if (point) {
					return point;
				}
				var sumPoint = resultsList[i]['sumPoint'];
				if (sumPoint) {
					return sumPoint;
				}
				return 0;
			}
		}
		return 0;
	},
	GetSportsPoint: function GetSportsPoint(pid, resultsList) {
		var count = resultsList.length;
		for (var i = 0; i < count; i++) {
			if (resultsList[i]['pid'] == pid) {
				var sportsPoint = resultsList[i]['sportsPoint'];
				if (sportsPoint) {
					return sportsPoint;
				}
			}
		}
		return 0;
	},
	Str2Json: function Str2Json(jsondata) {
		if (jsondata === "") {
			return false;
		}
		var json = JSON.parse(jsondata);
		return json;
	}

	//-------------点击函数-------------

});

cc._RF.pop();