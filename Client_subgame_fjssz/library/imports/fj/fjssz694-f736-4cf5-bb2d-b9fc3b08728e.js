"use strict";
cc._RF.push(module, 'fjssz694-f736-4cf5-bb2d-b9fc3b08728e', 'FJSSZLogicRank');
// script/game/FJSSZ/GameLogic/FJSSZLogicRank.js

"use strict";

var app = require("fjssz_app");

var FJSSZLogicRank = app.BaseClass.extend({

	Init: function Init() {
		this.JS_Name = "FJSSZLogicRank";
		this.dunTypes = ["DOWN", "SELECTED", "DUN1", "DUN2", "DUN3"];
		this.ComTool = app[app.subGameName + "_ComTool"]();
		this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
		this.HeroManager = app[app.subGameName + "_HeroManager"]();
		this.HUA_LEN = 4;
		this.RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
		this.RoomSet = app[app.subGameName.toUpperCase() + "RoomSet"]();
		this.RoomPosMgr = app[app.subGameName.toUpperCase() + "RoomPosMgr"]();
		this.LogicGame = app[app.subGameName.toUpperCase() + "LogicGame"]();
		this.SetPos = app[app.subGameName.toUpperCase() + "SetPos"]();
		this.NetManager = app[app.subGameName + "_NetManager"]();
		this.SysNotifyManager = app[app.subGameName + "_SysNotifyManager"]();

		this.InitCount();
		this.lastShouCard = [];
		this.cardStateList = [];
		for (var idx = 0; idx < this.dunTypes.length; idx++) {
			var state = this.dunTypes[idx];
			this.cardStateList[state] = [];
		}
		this.Log("Init");
	},

	InitDunState: function InitDunState() {
		var shouCardList = this.SetPos.GetSetPosProperty("shouCard");
		this.LogicGame.SortCardByMax(shouCardList);
		this.specialType = this.SetPos.GetSetPosProperty("special");
		this.isSpecial = false;

		if (shouCardList.length > 13) {
			this.isSixteen = true;
		} else {
			this.isSixteen = false;
		}

		//如果和上一把牌相同，重新获取getRoomInfo
		if (this.lastShouCard.length) {
			var count = 0;
			for (var i = 0; i < shouCardList.length; i++) {
				var card = shouCardList[i];
				if (this.lastShouCard.indexOf(card) != -1) {
					count++;
				}
			}
			if (count == 13) {
				var roomID = this.RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
				this.RoomMgr.SendGetRoomInfo(roomID);
				this.lastShouCard = [];
				return;
			}
		}
		this.lastShouCard = shouCardList;
		cc.log("FJSSZLogicRank 初始化");
		this.cardStateList["DOWN"] = [];
		for (var idx = 0; idx < shouCardList.length; idx++) {
			this.cardStateList["DOWN"][idx] = shouCardList[idx];
		}

		this.cardStateList["DUN1"] = [];
		this.cardStateList["DUN2"] = [];
		this.cardStateList["DUN3"] = [];
		this.cardStateList["SELECTED"] = [];
		cc.log("FJSSZLogicRank 初始化完成");
		this.InitCount();
	},

	GetIsSixteen: function GetIsSixteen() {
		return this.isSixteen;
	},

	InitCount: function InitCount() {
		this.duiziCount = 0;
		this.liangduiCount = 0;
		this.santiaoCount = 0;
		this.shunziCount = 0;
		this.tonghuaCount = 0;
		this.huluCount = 0;
		this.zhadanCount = 0;
		this.tonghuaCount = 0;
		this.tonghuaShunCount = 0;
		this.wutongCount = 0;
	},

	GetSpecialType: function GetSpecialType() {
		return this.specialType;
	},

	SetSpecialCard: function SetSpecialCard() {
		this.isSpecial = true;
	},

	GetDunLength: function GetDunLength(dun) {
		return this.cardStateList[dun].length;
	},

	getDunListByType: function getDunListByType(type) {
		return this.cardStateList[type];
	},
	SetDunListByType: function SetDunListByType(type, list) {
		this.cardStateList[type] = list;
	},

	clearSelectedCards: function clearSelectedCards() {
		if (this.cardStateList["SELECTED"].length) {
			this.cardStateList["SELECTED"] = [];
			app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
		}
	},

	SetCardSelected: function SetCardSelected(cardIdx) {
		//查询
		var cardType = this.cardStateList["DOWN"][cardIdx - 1];
		var pos = this.cardStateList["SELECTED"].indexOf(cardType);
		if (pos) {
			console.log("CheckDuiZi this.cardStateList[SELECTED]", this.cardStateList["SELECTED"]);
			this.cardStateList["SELECTED"].push(cardType);
			app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
		} else {
			this.Log("can not find cardtype %d", cardType);
		}
	},

	DeleteCardSelected: function DeleteCardSelected(cardIdx) {
		var cardType = this.cardStateList["DOWN"][cardIdx - 1];
		var pos = this.cardStateList["SELECTED"].indexOf(cardType);
		if (pos > -1) {
			this.cardStateList["SELECTED"].splice(pos, 1);
			app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
		}
	},

	CheckDaoShui: function CheckDaoShui(dun) {
		var tempSelectCards = [];
		var DaoShui = 0; //倒水
		var NotDaoShui = 1; //没倒水
		//前端不判断倒水了，让服务端来判断
		return 1;

		for (var i = 0; i < this.cardStateList[dun].length; i++) {
			tempSelectCards.push(this.cardStateList[dun][i]);
		}

		for (var _i = 0; _i < this.cardStateList["SELECTED"].length; _i++) {
			tempSelectCards.push(this.cardStateList["SELECTED"][_i]);
			if (dun == "DUN1" && _i == 2) {
				break;
			} else if ((dun == "DUN2" || dun == "DUN3") && _i == 4) {
				break;
			}
		}

		if (dun == "DUN1" && tempSelectCards.length != 3) {
			return NotDaoShui;
		} else if (dun == "DUN1" && tempSelectCards.length == 3) {
			if (this.cardStateList["DUN2"].length != 5 && this.cardStateList["DUN3"].length != 5) {
				return NotDaoShui;
			}
		}

		if (dun == "DUN2" && tempSelectCards.length != 5) {
			return NotDaoShui;
		} else if (dun == "DUN2" && tempSelectCards.length == 5) {
			if (this.cardStateList["DUN3"].length != 5 && this.cardStateList["DUN1"].length != 3) {
				return NotDaoShui;
			}
		}

		if (dun == "DUN3" && tempSelectCards.length != 5) {
			return NotDaoShui;
		}

		if (dun == "DUN1") {
			if (this.cardStateList["DUN2"].length == 0 && this.cardStateList["DUN3"].length == 0) {
				return NotDaoShui;
			}

			if (this.cardStateList["DUN2"].length == 5) {
				//dun1 与 dun2 相比
				if (this.LogicGame.CheckCardBigOrSmall(tempSelectCards, this.cardStateList["DUN2"]) == 0) {
					return DaoShui;
				}
			}
			if (this.cardStateList["DUN3"].length == 5) {
				// dun1 与 dun3 相比
				if (this.LogicGame.CheckCardBigOrSmall(tempSelectCards, this.cardStateList["DUN3"]) == 0) {
					return DaoShui;
				}
			}
		} else if (dun == "DUN2") {
			if (this.cardStateList["DUN3"].length == 0 && this.cardStateList["DUN1"].length == 0) {
				return NotDaoShui;
			}

			if (this.cardStateList["DUN1"].length == 3) {
				if (this.LogicGame.CheckCardBigOrSmall(this.cardStateList["DUN1"], tempSelectCards) == 0) {
					return DaoShui;
				}
			}
			if (this.cardStateList["DUN3"].length == 5) {
				if (this.LogicGame.CheckCardBigOrSmall(tempSelectCards, this.cardStateList["DUN3"]) == 0) {
					return DaoShui;
				}
			}
		} else if (dun == "DUN3") {
			console.log("开始判断墩3");
			if (this.cardStateList["DUN1"].length == 0 && this.cardStateList["DUN2"].length == 0) {
				return NotDaoShui;
			}

			if (this.cardStateList["DUN1"].length == 3) {
				if (this.LogicGame.CheckCardBigOrSmall(this.cardStateList["DUN1"], tempSelectCards) == 0) {
					return DaoShui;
				}
			}
			if (this.cardStateList["DUN2"].length == 5) {

				console.log("开始判断墩3，并且是5张");
				if (this.LogicGame.CheckCardBigOrSmall(this.cardStateList["DUN2"], tempSelectCards) == 0) {
					return DaoShui;
				}
			}
		}
		return NotDaoShui;
	},
	AutoSetDun: function AutoSetDun() {
		if (this.isSixteen) {
			return;
		}
		if (this.cardStateList["DUN1"].length == 3 && this.cardStateList["DUN2"].length == 5 || this.cardStateList["DUN1"].length == 3 && this.cardStateList["DUN3"].length == 5 || this.cardStateList["DUN2"].length == 5 && this.cardStateList["DUN3"].length == 5) {
			var downList = [];
			downList = this.cardStateList["DOWN"];
			this.cardStateList["DOWN"] = [];
			this.clearSelectedCards();

			if (this.cardStateList["DUN1"].length < 3) {
				for (var idx = 0; idx < downList.length; idx++) {
					this.cardStateList["DUN1"].push(downList[idx]);
				}
			} else if (this.cardStateList["DUN2"].length < 5) {
				for (var _idx = 0; _idx < downList.length; _idx++) {
					this.cardStateList["DUN2"].push(downList[_idx]);
				}
			} else if (this.cardStateList["DUN3"].length < 5) {
				for (var _idx2 = 0; _idx2 < downList.length; _idx2++) {
					this.cardStateList["DUN3"].push(downList[_idx2]);
				}
			}

			if (this.CheckDaoShui("DUN3") == 0) {
				this.ClearDun("DUN3", false);
				this.SysNotifyManager.ShowSysMsg("MSG_CARD_DAOSHUI2");
				this.cardStateList["DUN3"] = this.cardStateList["DUN2"].slice();
				this.cardStateList["DUN2"] = this.cardStateList["DOWN"].slice();
				this.cardStateList["DOWN"] = [];
				this.cardStateList["SELECTED"] = [];
			} else if (this.CheckDaoShui('DUN2') == 0) {
				this.SysNotifyManager.ShowSysMsg("MSG_CARD_DAOSHUI");
				this.cardStateList["SELECTED"] = [];
				this.ClearDun("DUN2", false);
			} else if (this.CheckDaoShui('DUN1') == 0) {
				this.SysNotifyManager.ShowSysMsg("MSG_CARD_DAOSHUI");
				this.cardStateList["SELECTED"] = [];
				this.ClearDun("DUN1", false);
			}
			app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
		}
	},

	SetDun: function SetDun(dun) {
		//未选中或墩位已满
		if (this.cardStateList["SELECTED"] == []) {
			return;
		}

		if (this.CheckDaoShui(dun) == 0) {
			this.SysNotifyManager.ShowSysMsg("MSG_CARD_DAOSHUI");
			this.cardStateList["SELECTED"] = [];
			this.ClearDun(dun, true);
			app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
			return;
		}

		for (var i = 0; i < this.cardStateList["SELECTED"].length; i++) {
			//选中的太多了
			if (dun == "DUN1" && this.cardStateList[dun].length >= 3) {
				continue;
			}
			if (dun == "DUN2" && this.cardStateList[dun].length >= 5) {
				continue;
			}
			if (dun == "DUN3" && this.cardStateList[dun].length >= 5) {
				continue;
			}

			var selectCardType = this.cardStateList["SELECTED"][i];
			var dunPos = this.cardStateList[dun].indexOf(selectCardType);
			var downPos = this.cardStateList["DOWN"].indexOf(selectCardType);

			if (dunPos == -1 && downPos > -1) {
				this.cardStateList["DOWN"].splice(downPos, 1);
				this.cardStateList[dun].push(selectCardType);
			}
		}

		this.cardStateList["SELECTED"] = [];
		app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
	},

	pushDownCards: function pushDownCards(pokers) {
		this.cardStateList["DOWN"] = [];
		for (var idx = 0; idx < pokers.length; idx++) {
			var card = pokers[idx].cardX16;
			this.cardStateList["DOWN"].push(card);
		}
		app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
	},

	ClearDun: function ClearDun(dun, trigger) {
		for (var i = 0; i < this.cardStateList[dun].length; i++) {
			var cardType = this.cardStateList[dun][i];
			var downPos = this.cardStateList["DOWN"].indexOf(cardType);
			if (-1 == downPos) {
				this.cardStateList["DOWN"].push(cardType);
			} else {
				//少牌的时候需要把牌找回来
				console.error("failed to clear because down has this cardType %s", cardType);
			}
		}
		this.cardStateList[dun] = [];
		if (this.cardStateList["DUN1"].length == 0 && this.cardStateList["DUN2"].length == 0 && this.cardStateList["DUN3"].length == 0) {
			if (this.cardStateList["DOWN"].length < 13) {
				this.cardStateList["DOWN"] = this.SetPos.GetSetPosProperty("shouCard");
				console.log("最新手牌", this.cardStateList["DOWN"]);
			}
		}
		if (trigger) {
			app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
		}
	},

	ClearOneCard: function ClearOneCard(dun, idx) {

		//如果该位置上没牌
		console.log("SELECTED数组 + ", this.cardStateList);
		if (!this.cardStateList[dun][idx]) {
			//牌墩上没牌
			if (this.cardStateList["SELECTED"].length) {
				//就把选择的牌放到牌墩上
				this.SetDun(dun);
			} else {
				return;
			}
		} else {
			//牌墩上有牌。
			if (this.cardStateList["SELECTED"].length == 1) {
				//选择了一张牌
				//先把牌墩上的牌放到手牌中。
				var cardType = this.cardStateList[dun][idx];
				var downPos = this.cardStateList["DOWN"].indexOf(cardType);
				if (-1 == downPos) {
					for (var i = 0; i < this.cardStateList[dun].length; i++) {
						if (cardType == this.cardStateList[dun][i]) {
							this.cardStateList[dun].splice(i, 1);
						}
					}
					this.cardStateList["DOWN"].push(cardType);
				} else {
					console.error("failed to clear because down has this cardType %s", cardType);
				}
				//再把选择的牌放到牌墩上
				this.SetDun(dun);
			} else {
				//牌墩上有牌没有被选中的牌。
				var _cardType = this.cardStateList[dun][idx];
				var _downPos = this.cardStateList["DOWN"].indexOf(_cardType);
				if (-1 == _downPos) {
					for (var _i2 = 0; _i2 < this.cardStateList[dun].length; _i2++) {
						if (_cardType == this.cardStateList[dun][_i2]) {
							this.cardStateList[dun].splice(_i2, 1);
						}
					}
					this.cardStateList["DOWN"].push(_cardType);
				} else {
					console.error("failed to clear because down has this cardType %s", _cardType);
				}
			}
		}
		app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
	},
	GetDunCard: function GetDunCard(dun, idx) {
		if (!this.cardStateList[dun][idx]) {
			return false;
		} else {
			return this.cardStateList[dun][idx];
		}
	},
	CheckAllRanked: function CheckAllRanked() {
		var bAllRanked = true;
		if (this.isSixteen) {
			if (this.cardStateList["DOWN"].length > 3) {
				bAllRanked = false;
			}
		} else {
			if (this.cardStateList["DOWN"].length > 0) {
				bAllRanked = false;
			}
		}
		return bAllRanked;
	},

	CheckSelected: function CheckSelected(cardType) {
		// console.log("SELECTED数组 + ", this.cardStateList["SELECTED"]);
		var downPos = this.cardStateList["SELECTED"].indexOf(cardType);
		if (-1 == downPos) {
			return false;
		}
		return true;
	},
	SendRankList: function SendRankList() {
		var dun = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		var special = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

		var room = this.RoomMgr.GetEnterRoom();
		var roomID = room.GetRoomProperty("roomID");
		var pid = this.HeroManager.GetHeroProperty("pid");
		var posIdx = this.RoomPosMgr.GetClientPos();

		var sendPack = {
			roomID: roomID, //房间id
			pid: pid, //玩家id
			posIdx: posIdx, //玩家位置
			isSpecial: this.isSpecial,
			special: special,
			dunPos: {
				first: this.cardStateList["DUN1"],
				second: this.cardStateList["DUN2"],
				third: this.cardStateList["DUN3"]
			}
		};
		if (JSON.stringify(dun) != "{}" && special != -1) {
			sendPack["dunPos"]["first"] = dun["first"];
			sendPack["dunPos"]["second"] = dun["second"];
			sendPack["dunPos"]["third"] = dun["third"];
			sendPack["special"] = parseInt(special);
			sendPack["isSpecial"] = true;
		}
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "Ranked", sendPack, function (data) {
			console.log("提交整理好的牌", data);
		}, function (error) {
			console.log("整理好的牌提交失败", error);
			app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("摆牌有误请重新摆牌,请重新摆牌");
		});
	},

	CheckDuiZi: function CheckDuiZi() {
		this.cardStateList["SELECTED"] = [];
		var downList = this.cardStateList["DOWN"];
		var duizis = this.LogicGame.GetDuiZi(downList);

		if (duizis.length > 0) {
			var duizi = [];

			if (this.duiziCount >= duizis.length) {
				this.duiziCount = 0;
			}

			if (1 == duizis.length) {
				duizi = duizis[0];
			} else {
				duizi = duizis[this.duiziCount];
			}
			this.duiziCount++;
			this.cardStateList["SELECTED"] = duizi;
			app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
		}
	},

	CheckLiangDui: function CheckLiangDui() {
		this.cardStateList["SELECTED"] = [];
		var downList = this.cardStateList["DOWN"];
		var duizis = this.LogicGame.GetLiangDuiEX(downList);
		if (this.liangduiCount >= duizis.length) {
			this.liangduiCount = 0;
		}

		if (duizis.length >= 1) {
			var firstDui = duizis[this.liangduiCount];
			this.liangduiCount++;
			if (this.liangduiCount >= duizis.length) {
				this.liangduiCount = 0;
			}

			var liangdui = firstDui;
			this.cardStateList["SELECTED"] = liangdui;
		}
		if (this.cardStateList["SELECTED"].length < 4) {
			//对子数量不足
			console.log("this.cardStateList[SELECTED]", this.cardStateList["SELECTED"]);
			this.SysNotifyManager.ShowSysMsg("SSS_DUIZI_NOT_ENOUGH");
			return;
		}
		app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
	},

	CheckSanTiao: function CheckSanTiao() {
		this.cardStateList["SELECTED"] = [];
		var downList = this.cardStateList["DOWN"];
		var santiaos = this.LogicGame.GetSanTiao(downList);

		if (santiaos.length) {
			var santiao = [];
			if (1 == santiaos.length) {
				santiao = santiaos[0];
			} else {
				santiao = santiaos[this.santiaoCount];
			}
			this.santiaoCount++;
			if (this.santiaoCount >= santiaos.length) {
				this.santiaoCount = 0;
			}
			this.cardStateList["SELECTED"] = santiao;
		} else {
			this.SysNotifyManager.ShowSysMsg("SSS_SANTIAO_NOT_ENOUGH");
		}
		app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
	},

	CheckShunzi: function CheckShunzi() {
		this.cardStateList["SELECTED"] = [];
		var shunzis = [];
		var downList = this.cardStateList["DOWN"];
		shunzis = this.LogicGame.GetShunzi(downList);
		if (shunzis.length) {
			var shunzi = [];
			if (this.shunziCount >= shunzis.length) {
				this.shunziCount = 0;
			}

			if (1 == shunzis.length) {
				shunzi = shunzis[0];
			} else {
				shunzi = shunzis[this.shunziCount];
			}
			this.shunziCount++;
			this.cardStateList["SELECTED"] = shunzi;
			app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
		} else {
			this.SysNotifyManager.ShowSysMsg("SSS_SHUNZI_NOT_ENOUGH");
			app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
		}
	},

	CheckTonghua: function CheckTonghua() {
		this.cardStateList["SELECTED"] = [];
		var downList = this.cardStateList["DOWN"];
		var tonghuas = this.LogicGame.GetTonghua(downList);

		if (tonghuas.length) {
			var tonghua = [];

			if (this.tonghuaCount >= tonghuas.length) {
				this.tonghuaCount = 0;
			}

			if (1 == tonghuas.length) {
				tonghua = tonghuas[0];
			} else {
				tonghua = tonghuas[this.tonghuaCount];
			}
			this.tonghuaCount++;
			this.cardStateList["SELECTED"] = tonghua;
			app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
		}
	},

	CheckHulu: function CheckHulu() {
		this.cardStateList["SELECTED"] = [];
		var downList = this.cardStateList["DOWN"];
		var hulus = this.LogicGame.GetHuluEx(downList);
		this.huluCount++;
		if (this.huluCount >= hulus.length) {
			this.huluCount = 0;
		}
		this.cardStateList["SELECTED"] = hulus[this.huluCount];
		app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
	},

	CheckZhaDang: function CheckZhaDang() {
		this.cardStateList["SELECTED"] = [];
		var downList = this.cardStateList["DOWN"];
		var zhadangs = this.LogicGame.GetZhaDan(downList);

		if (zhadangs.length > 0) {
			var zhadan = [];

			if (this.zhadanCount >= zhadangs.length) this.zhadanCount = 0;

			if (1 == zhadangs.length) {
				zhadan = zhadangs[0];
			} else {
				zhadan = zhadangs[this.zhadanCount];
			}
			this.zhadanCount++;

			this.cardStateList["SELECTED"] = zhadan;
			app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
		} else {
			this.SysNotifyManager.ShowSysMsg("SSS_ZHADAN_NOT_ENOUGH");
			app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
		}
	},

	CheckTongHuaShun: function CheckTongHuaShun() {
		this.cardStateList["SELECTED"] = [];
		var downList = this.cardStateList["DOWN"];
		var tonghuaShuns = this.LogicGame.GetTongHuaShunEx(downList);

		if (tonghuaShuns.length) {
			var tonghuashun = [];

			if (this.tonghuaShunCount >= tonghuaShuns.length) this.tonghuaShunCount = 0;

			if (1 == tonghuaShuns.length) {
				tonghuashun = tonghuaShuns[0];
			} else {
				tonghuashun = tonghuaShuns[this.tonghuaShunCount];
			}
			this.tonghuaShunCount++;

			this.cardStateList["SELECTED"] = tonghuashun;
			app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
		} else {
			this.SysNotifyManager.ShowSysMsg("SSS_TONGHUASHUN_NOT_ENOUGH");
			app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
		}
	},

	CheckWuTong: function CheckWuTong() {
		this.cardStateList["SELECTED"] = [];
		var downList = this.cardStateList["DOWN"];
		var wutongs = this.LogicGame.GetWuTong(downList);

		if (wutongs.length) {
			var wutong = [];

			if (this.wutongCount >= wutongs.length) {
				this.wutongCount = 0;
			}

			if (1 == wutongs.length) {
				wutong = wutongs[0];
			} else {
				wutong = wutongs[this.wutongCount];
			}
			this.wutongCount++;
			this.cardStateList["SELECTED"] = wutong;
			app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
		} else {
			//this.SysNotifyManager.ShowSysMsg("SSS_TONGHUASHUN_NOT_ENOUGH");
			//app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
			// console.log('没有五同');
		}
	},
	CheckLiuTong: function CheckLiuTong() {
		this.cardStateList["SELECTED"] = [];
		var downList = this.cardStateList["DOWN"];
		var liutongs = this.LogicGame.GetLiuTongs(downList);

		if (liutongs.length) {
			var liutong = [];

			if (this.wutongCount >= liutongs.length) {
				this.wutongCount = 0;
			}

			if (1 == liutongs.length) {
				liutong = liutongs[0];
			} else {
				liutong = liutongs[this.wutongCount];
			}
			this.wutongCount++;
			this.cardStateList["SELECTED"] = liutong;
			app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
		} else {
			//this.SysNotifyManager.ShowSysMsg("SSS_TONGHUASHUN_NOT_ENOUGH");
			//app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
			// console.log('没有五同');
		}
	},
	CheckWuGui: function CheckWuGui() {
		this.cardStateList["SELECTED"] = [];
		var downList = this.cardStateList["DOWN"];
		var wuguis = this.LogicGame.GetWuGuis(downList);

		if (wuguis.length) {
			var wugui = [];

			if (this.wutongCount >= wuguis.length) {
				this.wutongCount = 0;
			}

			if (1 == wuguis.length) {
				wugui = wuguis[0];
			} else {
				wugui = wuguis[this.wutongCount];
			}
			this.wutongCount++;
			this.cardStateList["SELECTED"] = wugui;
			app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
		} else {
			//this.SysNotifyManager.ShowSysMsg("SSS_TONGHUASHUN_NOT_ENOUGH");
			//app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
			// console.log('没有五同');
		}
	},
	SetDunEx: function SetDunEx(dun, catlist) {
		this.cardStateList["SELECTED"] = catlist;
		for (var i = 0; i < this.cardStateList["SELECTED"].length; i++) {

			//选中的太多了
			if (dun == "DUN1" && this.cardStateList[dun].length >= 3) {
				continue;
			}
			if (dun == "DUN2" && this.cardStateList[dun].length >= 5) {
				continue;
			}
			if (dun == "DUN3" && this.cardStateList[dun].length >= 5) {
				continue;
			}

			var selectCardType = this.cardStateList["SELECTED"][i];
			var dunPos = this.cardStateList[dun].indexOf(selectCardType);
			var downPos = this.cardStateList["DOWN"].indexOf(selectCardType);

			if (dunPos == -1 && downPos > -1) {
				this.cardStateList["DOWN"].splice(downPos, 1);
				this.cardStateList[dun].push(selectCardType);
			}
		}
		this.cardStateList["SELECTED"] = [];
	}

});

var g_FJSSZLogicRank = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_FJSSZLogicRank) {
		g_FJSSZLogicRank = new FJSSZLogicRank();
	}
	return g_FJSSZLogicRank;
};

cc._RF.pop();