(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/game/FJSSZ/ui/UILSResultOne.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8931c7cbz1JFa8nVvpP/jXp', 'UILSResultOne', __filename);
// script/game/FJSSZ/ui/UILSResultOne.js

"use strict";

var app = require("fjssz_app");
cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {
		pre_result: cc.Node,
		frame: cc.SpriteFrame
	},

	OnCreateInit: function OnCreateInit() {
		this.gameName = app["subGameName"];
		this.ZorderLv = this.ZorderLv6;
		this.layout = this.GetWndNode("playerAll");
		this.btn_continue = this.GetWndNode("btnList/btn_continue");

		this.RoomMgr = app[this.gameName.toUpperCase() + "RoomMgr"]();
		this.Room = app[this.gameName.toUpperCase() + "Room"]();
		this.FormManager = app[this.gameName + "_FormManager"]();
		this.ComTool = app[this.gameName + "_ComTool"]();
		this.NetManager = app[this.gameName + "_NetManager"]();
		this.HeroManager = app[this.gameName + "_HeroManager"]();
		this.SDKManager = app[this.gameName + "_SDKManager"]();
		this.RegEvent("NewVersion", this.Event_NewVersion, this);
	},
	Event_NewVersion: function Event_NewVersion() {
		this.isNewVersion = true;
	},

	OnShow: function OnShow() {
		this.isNewVersion = false;
		if (!this.RoomMgr.GetEnterRoom().GetRoomProperty("resultInfo")) {
			this.CloseForm();
			return;
		}
		var roomEnd = this.RoomMgr.GetEnterRoom().GetRoomProperty("resultInfo").sRankingResult;
		if (!roomEnd) {
			this.CloseForm();
			return;
		}
		app[app.subGameName + "_HotUpdateMgr"]().CheckUpdate(); //检测客户端是否有新版本
		this.roomCfg = this.RoomMgr.GetEnterRoom().GetRoomConfig();
		this.playerNameList = [];
		var recordPosInfosList = roomEnd["posResultList"];
		this.AddPosInfoPre(recordPosInfosList);
		this.ShowPlayerInfo(recordPosInfosList, roomEnd.rankeds, roomEnd.pCard1, roomEnd.pCard2, roomEnd.pCard3);

		var time = this.node.getChildByName("clock").getChildByName("time");
		time.getComponent(cc.Label).string = "10";
		this.unscheduleAllCallbacks();
		this.schedule(this.timer.bind(this), 1, 10, 1.0);
		if (app.playuissz) {
			app.playuissz.needDelayDiss = false;
		}
	},
	timer: function timer() {
		var time = this.node.getChildByName("clock").getChildByName("time");
		var d = parseInt(time.getComponent(cc.Label).string);
		d--;
		if (d < 0) {
			this.unscheduleAllCallbacks();
			d = 0;
			this.OnClick("btn_continue", this.btn_continue);
		}
		time.getComponent(cc.Label).string = d.toString();
	},

	AddPosInfoPre: function AddPosInfoPre(recordPosInfosList) {
		this.layout.removeAllChildren();
		var playerNum = recordPosInfosList.length;
		for (var i = 0; i < playerNum; i++) {
			var playerNode = cc.instantiate(this.pre_result);
			playerNode.name = "resultDetail" + i;
			playerNode.active = false;
			this.layout.addChild(playerNode);
		}
		this.pre_result.active = false;
	},
	ShowSelf: function ShowSelf(point) {
		if (point >= 0) {
			this.node.getChildByName("bg").active = true;
			this.node.getChildByName("bg1").active = false;
		} else {
			this.node.getChildByName("bg1").active = true;
			this.node.getChildByName("bg").active = false;
		}
	},
	ShowPlayerInfo: function ShowPlayerInfo(recordPosInfosList, rankeds, pCard1, pCard2, pCard3) {
		var playerNum = recordPosInfosList.length;
		var RoomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
		var ClientPos = RoomPosMgr.GetClientPos();
		var minPos = -1;
		var minScore = 111110;
		for (var i = 0; i < playerNum; i++) {
			var posInfo = recordPosInfosList[i];
			var point = posInfo["point"];
			var player = RoomPosMgr.GetPlayerInfoByPos(posInfo["posIdx"]);
			if (posInfo["posIdx"] == ClientPos) {
				this.ShowSelf(point);
			} else {
				this.GetWndNode("playerAll/resultDetail" + i).getComponent(cc.Sprite).spriteFrame = this.frame;
			}
			if (point < minScore) {
				minScore = point;
				minPos = posInfo["posIdx"];
			}
			var name = player["name"].substring(0, 9);
			var pid = player["pid"];
			var sportsPoint = posInfo["sportsPoint"];
			var path = "playerAll/resultDetail" + i + "/user";
			this.SetWndProperty(path + "/name", "text", name);
			this.SetWndProperty(path + "/id", "text", "ID:" + this.ComTool.GetPid(pid));
			point = Math.floor(point * 100) / 100;
			sportsPoint = Math.floor(sportsPoint * 100) / 100;
			if (point >= 0) {
				this.SetWndProperty(path + "/score_win", "active", true);
				this.SetWndProperty(path + "/score_lose", "active", false);
				this.SetWndProperty(path + "/score_win", "text", "+" + point);
			} else {
				this.SetWndProperty(path + "/score_lose", "active", true);
				this.SetWndProperty(path + "/score_win", "active", false);
				this.SetWndProperty(path + "/score_lose", "text", point);
			}
			//竞技点
			//如果是联盟的房间显示继续游戏按钮
			if (0 != this.roomCfg.unionId) {
				this.SetWndProperty(path + "/score_win", "active", false);
				this.SetWndProperty(path + "/score_lose", "active", false);
				this.SetWndProperty(path + "/img_bsf", "active", true);
				if (posInfo["sportsPoint"] >= 0) {
					this.SetWndProperty(path + "/img_bsf/lb_sportsPoint_win", "active", true);
					this.SetWndProperty(path + "/img_bsf/lb_sportsPoint_lose", "active", false);
					this.SetWndProperty(path + "/img_bsf/lb_sportsPoint_win", "text", "+" + sportsPoint.toFixed(2));
				} else {
					this.SetWndProperty(path + "/img_bsf/lb_sportsPoint_win", "active", false);
					this.SetWndProperty(path + "/img_bsf/lb_sportsPoint_lose", "active", true);
					this.SetWndProperty(path + "/img_bsf/lb_sportsPoint_lose", "text", sportsPoint.toFixed(2));
				}
			} else {
				this.SetWndProperty(path + "/img_bsf", "active", false);
			}

			var headCom = this.GetWndComponent(path + "/head", this.gameName + "_WeChatHeadImage");
			headCom.onLoad();
			headCom.ShowHeroHead(pid);
			this.layout.children[i].active = true;
			this.playerNameList.push(name);

			var dunCard = this.node.getChildByName("playerAll").getChildByName("resultDetail" + i).getChildByName("UILSDunCards");
			dunCard.getComponent("UILSDunCards").resetAngle();
			var cards = [];
			for (var index = 0; index < rankeds.length; index++) {
				if (rankeds[index].posIdx == posInfo["posIdx"]) {
					var dunPos = rankeds[index].dunPos;
					cards = dunPos.first.concat(dunPos.second).concat(dunPos.third);
					if (rankeds[index].isSpecial && rankeds[index].special > 0) {
						app.playuissz.SetSpecailProperty(dunCard.getChildByName("img_special").getChildByName("special"), rankeds[index].special);
					}
					break;
				}
			}
			for (var _index = 0; _index < pCard2.length; _index++) {
				if (pCard2[_index].isSpecial) continue;
				if (pCard2[_index].posIdx == posInfo["posIdx"]) {
					dunCard.getComponent("UILSDunCards").showCardType(1, pCard2[_index].card);
				}
			}
			for (var _index2 = 0; _index2 < pCard1.length; _index2++) {
				if (pCard1[_index2].isSpecial) continue;
				if (pCard1[_index2].posIdx == posInfo["posIdx"]) {
					dunCard.getComponent("UILSDunCards").showCardType(0, pCard1[_index2].card);
				}
			}
			for (var _index3 = 0; _index3 < pCard3.length; _index3++) {
				if (pCard3[_index3].isSpecial) continue;
				if (pCard3[_index3].posIdx == posInfo["posIdx"]) {
					dunCard.getComponent("UILSDunCards").showCardType(2, pCard3[_index3].card);
				}
			}
			for (var _i = 1; _i <= 13; _i++) {
				var node = dunCard.getChildByName("dun_card" + _i);
				app.playuissz.ShowResultCard(cards[_i - 1] || 0, node);
			}
		}
		this.node.getChildByName("btnList").getChildByName("btn_qiepai").active = ClientPos == minPos;
	},
	//-----------------回调函数------------------

	//---------点击函数---------------------
	OnClick: function OnClick(btnName, btnNode) {
		cc.log(btnName);
		if (btnName == "btn_close" || btnName == "btn_exit") {
			this.OnClick_Close();
		} else if (btnName == "btn_continue") {
			if (app.playuissz) {
				app.playuissz.Click_btn_goon();
			}
			this.OnClick_Close();
		} else if (btnName == "btn_qiepai") {
			cc.log("切牌");
			if (app.playuissz) {
				app.playuissz.Click_btn_goon();
				app.playuissz.Click_btn_qiepai();
			}
			this.OnClick_Close();
		} else {
			console.error("OnClick(%s) not find btnName", btnName);
		}
	}
});

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
        //# sourceMappingURL=UILSResultOne.js.map
        