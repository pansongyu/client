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
	OnCreateInit: function () {
		this.FormManager = app.FormManager();
		this.ShareDefine = app.ShareDefine();
		this.HeroManager = app.HeroManager();
		this.heroName = this.HeroManager.GetHeroProperty("name");
		if (this.heroName.length > 9)
			this.heroName = this.heroName.substring(0, 9);
		this.heroId = this.HeroManager.GetHeroProperty("pid");
		this.WeChatManager = app.WeChatManager();
		this.ComTool = app.ComTool();
		this.RoomID = 0;
		this.datainfo = false;
		this.record = false;
		this.playerList = false;
		this.gameType = 0;
	},

	InitShowInfo: function () {
		let recodelist = app['recodelist'];
		let userData = this.GetFormProperty("UserData");
		this.record = recodelist[userData];
		this.clubId = 0;
		this.unionId = this.record.unionId;
		let uiRecordNode = this.node.parent.parent.parent.parent;
		if (uiRecordNode) {
			let com = uiRecordNode.getComponent(uiRecordNode.name);
			this.clubId = com.clubId;
		}
		this.SetPlayerInfo(userData, this.record);
	},
	//显示
	OnShow: function () {
		this.InitShowInfo();
	},
	SetPlayerInfo: function (key, record) {
		this.SetWndProperty("lb_chengji_lost", "active", false);
		this.SetWndProperty("lb_chengji_win", "active", false);
		let endTime = this.ComTool.GetDateYearMonthDayHourMinuteString(record.endTime);
		let endTimeList = endTime.split(" ");
		this.SetWndProperty("lb_date", "text", endTimeList[0]);
		this.SetWndProperty("lb_time", "text", endTimeList[1]);
		this.SetWndProperty("bg_ju/lb_ju", "text", parseInt(key) + 1);
		if (0 == this.clubId)
			this.SetWndProperty("lb_username", "text", this.heroName);
		else
			this.SetWndProperty("lb_username", "text", this.heroName);
		this.gameType = record.gameType;
		console.log("SetPlayerInfo this.gameType:", this.gameType);
		let gamename = this.ShareDefine.GametTypeID2Name[this.gameType];

		console.log("SetPlayerInfo gamename:", gamename);
		let ju = record.setCount + "局";
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
		if (this.gameType == 57) { // 巢湖麻将
			if (record.setCount == 30 || record.setCount == 50 || record.setCount == 100) {
				ju = record.setCount + '锅';
			}
		} else if (record.setCount == 401 && this.gameType == this.ShareDefine.GameType_JXFZGP) {
			//江西抚州关牌服务端下发401局
			ju = '1次';
		} else if (record.setCount >= 400 && this.gameType == this.ShareDefine.GameType_GD) {
			//掼蛋服务端下发408，410，414局
			ju = '1次';
			let setCount = record.setCount % 400;
			if (setCount == 14) {
				ju = "过A";
			} else {
				ju = "过" + setCount;
			}
		} else if (record.setCount >= 400 && this.gameType == this.ShareDefine.GameType_WHMJ) {
			let setCount = record.setCount % 400;
			ju = setCount + "底";
		} else if (record.setCount >= 600 && this.gameType == this.ShareDefine.GameType_MASMJ) {
			let setCount = record.setCount % 600;
			ju = setCount + "倒";
		} else if (this.gameType == 205) { // 株洲牛十别
			if (record.setCount == 501) {
				ju = '千分局';
			}
		}
		else if (record.setCount == 501 && this.gameType == this.ShareDefine.GameType_GLWSK) {
			ju = "";
		}
		let renshu = record.playerNum + "人场";
		this.SetWndProperty("lb_gameinfo", "text", gamename + "  " + ju + "  " + renshu);
		this.SetWndProperty("lb_roomid", "text", record.roomKey);
		this.datainfo = this.Str2Json(record.dataJsonRes);
		this.playerList = this.Str2Json(record.playerList);
		console.log("SetPlayerInfo record.playerList：", record.playerList);
		console.log("SetPlayerInfo this.playerList：", this.playerList);
		//读取玩家头像
		let heroImageUrlDict = {};
		for (let i = 0; i < this.playerList.length; i++) {
			let pid = this.playerList[i]["pid"];
			let headImageUrl = this.playerList[i]["iconUrl"];
			if (pid && headImageUrl) {
				this.WeChatManager.InitHeroHeadImage(pid, headImageUrl);
			}
		}
		//this.WeChatManager.InitHeroHeadImageByDict(heroImageUrlDict);
		if (this.datainfo) {
			this.RoomID = this.datainfo.roomId;
			let point = 0;
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
				let sportsPoint = 0;
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
	OnClick_ShowMore: function () {
		if (this.ShareDefine.GameType_PYZHW == this.gameType) {
			let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
			this.FormManager.ShowForm(path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_BP == this.gameType) {
			let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
			this.FormManager.ShowForm(path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_CDP == this.gameType) {
			let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
			this.FormManager.ShowForm(path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_GZMJ == this.gameType) {
			let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
			this.FormManager.ShowForm(path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_DCTS == this.gameType) {
			let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
			this.FormManager.ShowForm(path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_JDZTS == this.gameType) {
			let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
			this.FormManager.ShowForm(path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_DD == this.gameType) {
			let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
			this.FormManager.ShowForm(path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_JAWZ == this.gameType) {
			let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
			this.FormManager.ShowForm(path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_THBBZ == this.gameType) {
			let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
			this.FormManager.ShowForm(path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_GYZJMJ == this.gameType) {
			let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
			this.FormManager.ShowForm(path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_GSMJ == this.gameType) {
			let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
			this.FormManager.ShowForm(path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_LPTS == this.gameType) {
			let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
			this.FormManager.ShowForm(path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_GLWSK == this.gameType) {
			let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
			this.FormManager.ShowForm(path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_ZGQZMJ == this.gameType) {
			let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
			this.FormManager.ShowForm(path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_ASMJ == this.gameType) {
			let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
			this.FormManager.ShowForm(path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_WXZMMJ == this.gameType) {
			let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
			this.FormManager.ShowForm(path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_CP == this.gameType) {
			let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
			this.FormManager.ShowForm(path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_JXYZ == this.gameType) {
			let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
			this.FormManager.ShowForm(path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_YCFXMJ == this.gameType) {
			let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
			this.FormManager.ShowForm(path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_PY == this.gameType) {
			let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
			this.FormManager.ShowForm(path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_KLMJ == this.gameType) {
			let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
			this.FormManager.ShowForm(path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_QWWES == this.gameType) {
			let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
			this.FormManager.ShowForm(path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_SGLK == this.gameType) {
			let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
			this.FormManager.ShowForm(path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_SSE == this.gameType) {
			let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
			this.FormManager.ShowForm(path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_XSDQ == this.gameType) {
			let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
			this.FormManager.ShowForm(path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		if (this.ShareDefine.GameType_JYESSZ == this.gameType) {
			let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
			let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
			this.FormManager.ShowForm(path, this.record.roomId, this.playerList, this.gameType, this.unionId);
			return;
		}
		this.FormManager.ShowForm("UIRecordAllResult", this.record.roomId, this.playerList, this.gameType, this.unionId, this.record.roomKey);
	},
	OnClick_ShowAll: function () {
		if (this.datainfo) {
			if (this.ShareDefine.GameType_GLWSK == this.gameType) {
				let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
				let path = "ui/uiGame/" + smallName + "/UIResultAllDetail_" + smallName;
				this.FormManager.ShowForm(path, this.datainfo, this.playerList, this.gameType, this.unionId);
				return;
			}
			if (this.ShareDefine.GameType_ZGQZMJ == this.gameType) {
				let smallName = this.ShareDefine.GametTypeID2PinYin[this.gameType];
				let path = "ui/uiGame/" + smallName + "/UIResultAllDetail_" + smallName;
				this.FormManager.ShowForm(path, this.datainfo, this.playerList, this.gameType, this.unionId);
				return;
			}
			this.FormManager.ShowForm("UIResultAllDetail", this.datainfo, this.playerList, this.gameType, this.unionId);
		} else {
			console.log("服务端数据异常");
		}
	},
	GetRecord: function (pid, resultsList) {
		let count = resultsList.length;
		for (let i = 0; i < count; i++) {
			if (resultsList[i]['pid'] == pid) {
				let point = resultsList[i]['point'];
				//四支刀专用
				if(this.gameType == this.ShareDefine.GameType_SZD){
					point = resultsList[i]['resultPoint'];
				}
				if (point) {
					return point;
				}
				let sumPoint = resultsList[i]['sumPoint'];
				if (sumPoint) {
					return sumPoint;
				}
				return 0;
			}
		}
		return 0;
	},
	GetSportsPoint: function (pid, resultsList) {
		let count = resultsList.length;
		for (let i = 0; i < count; i++) {
			if (resultsList[i]['pid'] == pid) {
				let sportsPoint = resultsList[i]['sportsPoint'];
				if (sportsPoint) {
					return sportsPoint;
				}
			}
		}
		return 0;
	},
	Str2Json: function (jsondata) {
		if (jsondata === "") {
			return false;
		}
		var json = JSON.parse(jsondata);
		return json;
	},

	//-------------点击函数-------------

});