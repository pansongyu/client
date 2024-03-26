"use strict";
cc._RF.push(module, '147f8+iGw1CeZPEjPE94DgQ', 'UILSResultDetail');
// script/game/FJSSZ/ui/UILSResultDetail.js

"use strict";

var app = require("fjssz_app");
cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {
		pre_result: cc.Prefab,
		frame: cc.SpriteFrame
	},

	OnCreateInit: function OnCreateInit() {
		this.gameName = app["subGameName"];
		this.ZorderLv = this.ZorderLv6;

		this.room_Id = this.GetWndComponent("roomInfo/fanghao", cc.Label);
		this.end_Time = this.GetWndComponent("roomInfo/time", cc.Label);
		this.lb_jushu = this.GetWndComponent("roomInfo/jushu", cc.Label);
		this.layout = this.GetWndNode("playerAll");
		this.erweima = this.GetWndNode("bg/erweima");
		this.sportsPoint1 = this.GetWndNode("bg/SportsPoint1");
		this.sportsPoint2 = this.GetWndNode("bg/SportsPoint2");
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

	OnShow: function OnShow(roomEnd) {
		this.isNewVersion = false;
		app[app.subGameName + "_HotUpdateMgr"]().CheckUpdate(); //检测客户端是否有新版本
		console.log("总结算", roomEnd);
		this.roomCfg = this.RoomMgr.GetEnterRoom().GetRoomConfig();
		this.playerNameList = [];
		var jushu = roomEnd["setCnt"];
		var endSec = roomEnd["endSec"];
		var roomID = roomEnd["roomID"];
		var recordPosInfosList = roomEnd["recordPosInfosList"];
		this.AddPosInfoPre(recordPosInfosList);
		var roomKey = this.Room.GetRoomProperty("key");
		this.shareShortRoomID = roomKey;
		this.shareLongRoomID = roomID;

		this.room_Id.string = "房号：" + roomKey;
		this.lb_jushu.string = "局数：" + jushu;
		this.end_Time.string = this.ComTool.GetNowDateMonthDayHoursMinutesString(endSec);
		this.ShowPlayerInfo(recordPosInfosList);
		this.ShowErWeiMa();
		this.btn_continue.active = false;
		//如果是代开放，不显示续局
		if (this.roomCfg.createType == 2 || 0 != this.roomCfg.clubId) {}
		/*this.btn_pingfenkaiju.active=false;
  this.btn_wolaikaiju.active=false;
  this.btn_dayingjiakaiju.active=false;*/

		//如果是亲友圈的房间或者联盟的房间显示继续游戏按钮
		if (0 != this.roomCfg.clubId) {
			this.btn_continue.active = true;
		}
		this.FormManager.CloseForm(app.subGameName + "_UIMessage02");
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
	},
	ShowPlayerInfo: function ShowPlayerInfo(recordPosInfosList) {
		var playerNum = recordPosInfosList.length;
		var RoomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
		var room = this.RoomMgr.GetEnterRoom();
		var dianbo = room.GetRoomConfigByProperty("dianbo");
		var unionId = room.GetRoomConfigByProperty("unionId");
		var ClientPos = RoomPosMgr.GetClientPos();
		var poChanMsg = app.playuissz.poChanMsg || "";
		for (var i = 0; i < playerNum; i++) {
			var posInfo = recordPosInfosList[i];
			var isFangZhu = posInfo["isFangZhu"];
			var loseCount = posInfo["loseCount"];
			var point = posInfo["point"];
			var name = posInfo["name"].substring(0, 9);
			var winCount = posInfo["winCount"];
			var pid = posInfo["pid"];
			if (posInfo["posId"] != ClientPos) {
				this.GetWndNode("playerAll/resultDetail" + i).getComponent(cc.Sprite).spriteFrame = this.frame;
			}
			var sportsPoint = posInfo["sportsPoint"];
			var path = "playerAll/resultDetail" + i;
			this.SetWndProperty(path + "/name", "text", name);
			this.SetWndProperty(path + "/win", "text", winCount);
			this.SetWndProperty(path + "/lose", "text", loseCount);
			this.SetWndProperty(path + "/big", "active", posInfo["bigWinner"]);
			this.SetWndProperty(path + "/pc", "active", poChanMsg.indexOf("@" + name) >= 0 && point <= 0);
			this.SetWndProperty(path + "/id", "text", "ID:" + this.ComTool.GetPid(pid));
			this.SetWndProperty(path + "/img_zf", "active", true);
			if (dianbo > 0 && unionId > 0 && point + dianbo <= 0) {
				this.SetWndProperty(path + "/pc", "active", true);
			}
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
				this.SetWndProperty(path + "/img_zf", "active", false);

				this.sportsPoint1.active = true;
				this.sportsPoint2.active = true;
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
				this.sportsPoint1.active = false;
				this.sportsPoint2.active = false;
				this.SetWndProperty(path + "/img_bsf", "active", false);
			}

			var headCom = this.GetWndComponent(path + "/head", this.gameName + "_WeChatHeadImage");
			headCom.onLoad();
			headCom.ShowHeroHead(pid);
			this.layout.children[i].active = true;
			this.layout.children[i].getChildByName("img_fz").active = isFangZhu;
			this.SetWndProperty("roomInfo/fangzhu", "text", "");
			this.playerNameList.push(name);
		}
	},

	ShowErWeiMa: function ShowErWeiMa() {
		var heroID = app[app.subGameName + "_HeroManager"]().GetHeroProperty("pid");
		var shareUrl = "http://qh.qp355.com/" + this.ComTool.GetPid(heroID) + "/";
		var imgUrl = "http://www.qp355.com/makeQRcode.php?url=" + shareUrl;
		var that = this;

		cc.loader.load({ url: imgUrl, type: "png" }, function (err, texture) {
			if (texture instanceof cc.Texture2D) {
				var frame = new cc.SpriteFrame(texture);
				that.erweima.getComponent(cc.Sprite).spriteFrame = frame;
			} else {
				that.ErrLog("texture not Texture2D");
			}
		});
	},

	//-----------------回调函数------------------

	//---------点击函数---------------------
	OnClick: function OnClick(btnName, btnNode) {
		var _this = this;

		if (btnName == "btn_close" || btnName == "btn_exit") {
			app[this.gameName + "Client"].ExitGame();
		} else if (btnName == "btn_share") {
			this.FormManager.ShowForm(app.subGameName + "_Share");
		} else if (btnName == "btn_sharelink") {
			this.Click_btn_Sharelink();
		} else if (btnName == "btn_continue") {
			if (this.isNewVersion == true) {
				app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("游戏有新版本更新，请返回大厅");
				return;
			}
			app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ContinueEnterRoom", {}, function () {
				_this.CloseForm();
				app[app.subGameName + "_NetManager"]().SendPack("game.C1101GetRoomID", {});
			}, function (event) {
				if (event.Msg == "UNION_BACK_OFF_PLAYING") {
					app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("您已申请退赛，当前无法进行比赛，请取消退赛申请或联系赛事举办方");
				} else if (event.Msg == "UNION_APPLY_REMATCH_PLAYING") {
					app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("您的比赛分不足，已被淘汰，将被禁止参与赛事游戏，如要重新参与比赛，请联系举办方处理");
				} else if (event.Msg == "UNION_STATE_STOP") {
					app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("赛事已停用，无法加入房间，请联系赛事举办方");
				} else if (event.Msg == "ROOM_GAME_SERVER_CHANGE") {
					console.log("切换服务器");
				} else if (event.Code == 12) {
					console.log("游戏维护");
				} else if (event.Msg == "WarningSport_RoomJoinner") {
					app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("您所在的推广员队伍或上级队伍比赛分低于预警值，无法加入比赛，请联系管理");
				} else if (event.Msg == "CLUB_SPORT_POINT_WARN") {
					app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("您所在的亲友圈比赛分低于预警值，无法加入比赛，请联系管理");
				} else {
					app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("无法继续游戏，请联系赛事举办方");
				}
			});
		} else {
			console.error("OnClick(%s) not find btnName", btnName);
		}
	}
});

cc._RF.pop();