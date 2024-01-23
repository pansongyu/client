var app = require("fjssz_app");
cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {},

	OnCreateInit: function () {
		this.gameName = app["subGameName"];
		this.ZorderLv = this.ZorderLv6;
		this.lb_roomkey = this.GetWndComponent("lb_roomkey", cc.Label);
		this.lb_jushu = this.GetWndComponent("lb_roomkey", cc.Label);
		this.btn_record = this.node.getChildByName("btn_record");
		this.btn_gps = this.node.getChildByName("btn_gps");

		this.RoomMgr = app[this.gameName.toUpperCase() + "RoomMgr"]();
		this.RegEvent("SSSSetStart", this.Event_SetStart);
		this.RegEvent("RoomRecord", this.Event_RoomRecord);
	},
	OnShow: function () {
		if (app[this.gameName + "_ShareDefine"]().isCoinRoom) {
			this.btn_record.active = false;
			this.btn_gps.active = false;
		} else {
			this.btn_record.active = true;
			this.btn_gps.active = false;
		}
		this.ShowGamesNumber();
	},
	ShowGamesNumber: function () {
		let room = this.RoomMgr.GetEnterRoom();
		this.lb_roomkey.string = room.GetRoomProperty("key");
		let current = room.GetRoomConfigByProperty("setCount");
		let setID = room.GetRoomProperty("setID");
		this.lb_jushu.string = app.i18n.t("UIMarkJuShu", {"Current": setID, "Total": current});
	},
	//---------回调函数-------------------
	Event_SetStart: function (event) {
		this.ShowGamesNumber();
	},
	Event_RoomRecord: function (event) {
		app[this.gameName + "_FormManager"]().ShowForm(this.gameName + "UIRecord");
	},
	//---------点击函数---------------------
	OnClick: function (btnName, btnNode) {
		if (btnName == "btn_record") {
			let roomID = this.RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
			this.RoomMgr.SendRoomRecord(roomID);
		} else if (btnName == "btn_gps") {
			this.OnBtn_GPS_Click();
		} else if (btnName == "btn_help") {
			app[app.subGameName + "_FormManager"]().ShowForm(this.gameName+"UIGameHelp");
		} else {
			console.error("OnClick not find%s", btnName);
		}
	},

	//GPS按钮点击
	OnBtn_GPS_Click: function () {
		let playerNum = 2;
		if (playerNum <= 2) {
			app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('MSG_GPS_LOST_PLAYER');
			return;
		}
		if (this.FormManager.IsFormShow("UIGPS")) {
			this.FormManager.CloseForm("UIGPS");
		} else {
			this.FormManager.ShowForm("UIGPS");
		}
	},


});
