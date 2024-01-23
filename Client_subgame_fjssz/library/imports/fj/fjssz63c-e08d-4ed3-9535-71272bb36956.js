"use strict";
cc._RF.push(module, 'fjssz63c-e08d-4ed3-9535-71272bb36956', 'fjssz_UIMessage02');
// script/ui/fjssz_UIMessage02.js

"use strict";

/*
 UIMessage 模态消息界面
 */

var app = require("fjssz_app");

cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {},

	//初始化
	OnCreateInit: function OnCreateInit() {
		this.gameName = app["subGameName"];
		this.ZorderLv = 9;
		this.lb_time = this.GetWndNode("image01/TimeMessage/lb_time").getComponent(cc.Label);
		this.LabelMessage = this.GetWndNode("image01/LabelMessage").getComponent(cc.Label);
		this.playerNodes = this.node.getChildByName("playerNode").children;
		this.btnCancel = this.node.getChildByName("btnCancel").getComponent(cc.Button);
		this.btnSure = this.node.getChildByName("btnSure").getComponent(cc.Button);

		this.ShareDefine = app[this.gameName.toLowerCase() + "_ShareDefine"]();
		this.RegEvent("PosDealVote", this.Event_PosDealVote);
		this.RegEvent("CodeError", this.Event_CodeError);
	},

	//---------显示函数--------------------

	OnShow: function OnShow() {
		this.RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
		this.RoomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();

		var room = this.RoomMgr.GetEnterRoom();
		if (room.IsClientIsOwner()) {
			this.btnCancel.interactable = 0;
			this.btnSure.interactable = 0;
		}
		this.ShowPosAgree(room);
		var dissolveInfo = room.GetRoomProperty("dissolve");
		var createPos = dissolveInfo["createPos"];
		var roomPosMgr = room.GetRoomPosMgr();
		var posName = roomPosMgr.GetPlayerInfoByPos(createPos).name;
		var LabelMessage = app.i18n.t("DissolutiontText", { "Name": posName });
		this.LabelMessage.string = LabelMessage;
		this.endSec = room.GetRoomProperty("dissolve")["endSec"];
		var timeString = app[app.subGameName + "_ServerTimeManager"]().GetCDTimeStringBySec(this.endSec, this.ShareDefine.ShowSecondSec);
		this.lb_time.string = timeString;
		this.updateTime = new Date().getTime();
		console.log("UIMessage02", dissolveInfo, LabelMessage);
	},
	ShowPosAgree: function ShowPosAgree(room) {
		var roomPosMgr = room.GetRoomPosMgr();
		var dissolveInfo = room.GetRoomProperty("dissolve");
		var posAgreeList = dissolveInfo["posAgreeList"];
		var allPlayers = roomPosMgr.GetRoomAllPlayerInfo();
		var createPos = dissolveInfo["createPos"];
		var clientPos = roomPosMgr.GetClientPos();
		var playingList = [];
		for (var idx in allPlayers) {
			if (allPlayers[idx].isPlaying) {
				playingList.push(allPlayers[idx]);
			}
		}
		var canClick = true;
		for (var i = 0; i < this.playerNodes.length; i++) {
			this.playerNodes[i].active = false;
			this.playerNodes[i].getChildByName('icon_jujue').active = false;
			this.playerNodes[i].getChildByName('icon_tongyi').active = false;
			if (i < playingList.length && playingList[i].pid) {
				var nameLabel = this.playerNodes[i].getChildByName('name').getComponent(cc.Label);
				nameLabel.string = playingList[i].name;
				//0未表态 1支持 2拒绝
				if (0 == posAgreeList[i]) {} else if (1 == posAgreeList[i]) {
					this.playerNodes[i].getChildByName('icon_tongyi').active = true;
					if (i == clientPos) canClick = false;
				} else {
					this.playerNodes[i].getChildByName('icon_jujue').active = true;
					this.CloseForm();
					if (i == clientPos) canClick = false;
				}

				this.playerNodes[i].active = true;
			}
		}
		if (createPos == clientPos) {
			canClick = false;
		}
		this.Show_btnCancel_btnSure(canClick);
		console.log("ShowPosAgree", playingList);
	},
	Show_btnCancel_btnSure: function Show_btnCancel_btnSure(canClick) {
		if (canClick) {
			this.btnCancel.interactable = 1;
			this.btnCancel.enableAutoGrayEffect = 0;
			this.btnSure.interactable = 1;
			this.btnSure.enableAutoGrayEffect = 0;
		} else {
			this.btnCancel.interactable = 0;
			this.btnCancel.enableAutoGrayEffect = 1;
			this.btnSure.interactable = 0;
			this.btnSure.enableAutoGrayEffect = 1;
		}
	},
	//---------回调函数--------------------
	Event_CodeError: function Event_CodeError(event) {
		var argDict = event;
		var code = argDict["Code"];
		if (code == this.ShareDefine.NotExistRoom) {
			try {
				this.CloseForm();
			} catch (error) {}
		}
	},
	//收到同意/拒绝解散房间
	Event_PosDealVote: function Event_PosDealVote(event) {
		var room = this.RoomMgr.GetEnterRoom();
		var argDict = event;
		var posAgreeList = argDict["posAgreeList"];
		var createPos = argDict["createPos"];
		var clientPos = room.GetRoomPosMgr().GetClientPos();
		for (var i = 0; i < posAgreeList.length; i++) {
			if (posAgreeList[i] == 2) {
				//0未表态 1支持 2拒绝
				this.FormManager.CloseForm(app.subGameName + "_UIMessage02");
				var Name = this.RoomMgr.GetEnterRoom().GetRoomPosMgr().GetPlayerInfoByPos(i)["name"];
				room.ClearDissolve();
				this.ShowSysMsg("PlayersRefusedToDisband", [Name]);
				return;
			} else if (posAgreeList[i] == 1) {
				this.playerNodes[i].getChildByName('icon_tongyi').active = true;
			} else {}
		}
	},

	//---------刷新函数--------------------
	OnUpdate: function OnUpdate() {
		if (this.endSec) {
			var time = new Date().getTime();
			if (time < this.updateTime) {
				var timeString = app[app.subGameName + "_ServerTimeManager"]().GetCDTimeStringBySec(this.endSec, this.ShareDefine.ShowSecondSec);
				var num = parseInt(timeString);
				if (!num) {
					this.CloseForm();
					return;
				}
				this.lb_time.string = timeString;
			} else {
				this.updateTime += 500;
			}
		}
	},

	//---------点击函数---------------------
	OnClick: function OnClick(btnName, btnNode) {
		var room = this.RoomMgr.GetEnterRoom();
		var roomID = this.RoomMgr.GetEnterRoomID();
		if (btnName == "btnCancel") {
			// this.RoomMgr.SendDissolveRoomRefuse(roomID);
			app[app.subGameName + "_GameManager"]().SendDissolveRoomRefuse(roomID);
			this.Show_btnCancel_btnSure(false);
		} else if (btnName == "btnSure") {
			//this.RoomMgr.SendDissolveRoomAgree(roomID);
			app[app.subGameName + "_GameManager"]().SendDissolveRoomAgree(roomID);
			this.Show_btnCancel_btnSure(false);
		}
	}

});

cc._RF.pop();