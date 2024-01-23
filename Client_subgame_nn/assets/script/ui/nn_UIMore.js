var app = require("nn_app");
cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {},

	OnCreateInit: function () {
		this.ZorderLv = 7;
		this.gongnengbeijing = this.node.getChildByName("gongnengbeijing");
		this.btn_autoplay = this.GetWndNode("layout/btn_autoPlay");
		this.btn_shezhi = this.GetWndNode("layout/btn_shezhi");
		this.btn_jiesan = this.GetWndNode("layout/btn_jiesan");
		this.btn_moreshou = this.node.getChildByName("btn_moreshou");
		this.btn_information = this.GetWndNode("room_data/btn_information");
		this.now_time = this.GetWndComponent("now_time", cc.Label);
		this.room_data = this.node.getChildByName("room_data");

		this.ComTool = app[app.subGameName + "_ComTool"]();
		this.RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
		this.btn_autoplay.active = false;
		this.btn_shezhi.active = false;
		this.btn_jiesan.active = false;
		this.gongnengbeijing.active = false;

		this.RegEvent("SetStart", this.Event_SetStart);
		this.RegEvent("SSSSetStart", this.Event_SetStart);
		this.RegEvent("PDKSetStart", this.Event_SetStart);
		this.RegEvent("LYMJ_SetStart", this.Event_SetStart);
		this.RegEvent('ExitRoomSuccess', this.Event_ExitRoomSuccess);
		this.RegEvent('CodeError', this.Event_CodeError);
	},
	OnShow: function () {
		this.roomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
		this.btn_moreshou.anglesX = 0;
		this.SimulateOnClick("btn_moreshou");
		this.SetRoomData();
		if (app[app.subGameName + "_ShareDefine"]().isCoinRoom) {
			this.room_data.active = false;
		} else {
			this.room_data.active = true;
			// if('zjh' == this.playgame)
			// 	this.btn_information.active = false;
			// else
			// 	this.btn_information.active = true;
		}
	},
	//-----------------回调函数------------------
	Event_ExitRoomSuccess: function (event) {
		app[app.subGameName + "Client"].ExitGame();
	},
	Event_CodeError: function (event) {
		let argDict = event;
		let code = argDict["Code"];
		if (code == app[app.subGameName + "_ShareDefine"]().NotExistRoom) {
			this.FormManager.ClearDefaultFormNameList();
			app[app.subGameName + "Client"].ExitGame();
		}
		else if (!app[app.subGameName + "_ShareDefine"]().isCoinRoom && code == this.ShareDefine.ExitROOM_ERROR)
			this.FormManager.ClearDefaultFormNameList();
		else if (app[app.subGameName + "_ShareDefine"]().isCoinRoom && code == this.ShareDefine.ExitROOM_ERROR)
			app[app.subGameName + "Client"].ExitGame();
		else if (code == this.ShareDefine.ErrorNotRoomCardByXiPai)
			app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("SSS_XIPAI_FAILED");
		else if (code == this.ShareDefine.SportsPointNotEnough) {
			// this.SetWaitForConfirm("SportsPointNotEnough", this.ShareDefine.ConfirmYN, []);
			this.ShowSysMsg("比赛分不足房间自动解散");
		} else if (code == this.ShareDefine.NotAllow) {
			console.error("Event_CodeError - code", code);
		}
	},
	Event_SetStart: function (event) {
		this.SetRoomData();
		this.btn_autoplay.active = false;
	},


	SetRoomData: function () {
		let room = this.RoomMgr.GetEnterRoom();
		let roomCfg = room.GetRoomConfig();
		let current = room.GetRoomConfigByProperty("setCount");
		let setID = room.GetRoomProperty("setID");
		console.log("SetRoomData current:", current);
		console.log("SetRoomData setID:", setID);
		this.room_data.getChildByName('label1').getComponent("cc.Label").string = app.i18n.t("UIMarkJuShu", {
			"Current": setID,
			"Total": current
		});
		this.room_data.getChildByName('label2').getComponent("cc.Label").string = "房间号：" + room.GetRoomProperty("key");
		let joinPlayerCount = 0;
		let playerAll = this.roomPosMgr.GetRoomAllPlayerInfo();
		let playerAllList = Object.keys(playerAll);
		joinPlayerCount = playerAllList.length;

		let label0 = this.room_data.getChildByName('label0');
		label0.getComponent("cc.Label").string = joinPlayerCount + '人场';
		let label3 = this.room_data.getChildByName('label3');
		label3.active = false;
		if ('nn' == this.playgame) {
			let str = '庄位：';
			if (0 == roomCfg.sign)
				str += '自由牛牛';
			else if (1 == roomCfg.sign)
				str += '牛牛上庄';
			else if (2 == roomCfg.sign)
				str += '固定庄家';
			else if (3 == roomCfg.sign)
				str += '通比牛牛';
			else if (4 == roomCfg.sign)
				str += '明牌抢庄';
			else if (5 == roomCfg.sign)
				str += '轮庄牛牛';
			if (2 == roomCfg.sign && 0 != roomCfg.score) {
				let score = 0;
				if (1 == roomCfg.score)
					score = 100;
				else if (2 == roomCfg.score)
					score = 150;
				else
					score = 200;
				label3.getComponent(cc.Label).string = '底分：' + score;
				label3.active = true;
			}
			label0.getComponent("cc.Label").string = str;
		}
	},

	//---------点击函数---------------------
	OnClick: function (btnName, btnNode) {
		if (btnName == "btn_moreshou") {
			this.Click_btn_moreshou();
		}
		else if (btnName == "btn_shezhi") {
			this.Click_btn_shezhi();
		}
		else if (btnName == "btn_jiesan") {
			this.Click_btn_jiesan();
		}
		else if (btnName == "btn_information") {
			console.log("info");
			this.FormManager.ShowForm(app.subGameName + "_UIRoomInfo");
		}
		else if (btnName == "btn_autoPlay") {
			this.Click_btn_moreshou();
			if (app[app.subGameName + "_GameManager"]().IsFristPlay()) {
				this.Click_btn_autoplay();
			} else {
				app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('MSG_CAN_NOT_AUTOPLAY');
			}
		}
		else {
			console.error("OnClick(%s) not find", btnName);
		}
	},

	Click_btn_moreshou: function () {
		if (0 == this.btn_moreshou.anglesX) {
			this.gongnengbeijing.active = false;
			this.btn_shezhi.active = false;
			this.btn_jiesan.active = false;
			this.btn_autoplay.active = false;
			this.btn_moreshou.anglesX = 180;
		} else {
			this.gongnengbeijing.active = true;
			this.btn_shezhi.active = true;
			this.btn_jiesan.active = true;
			this.btn_moreshou.anglesX = 0;
			this.btn_autoplay.active = true;
		}
	},

	Click_btn_shezhi: function () {
		this.FormManager.ShowForm(app.subGameName + "_UISetting02");
	},
	Click_btn_autoplay: function () {
		app[app.subGameName + "_GameManager"]().SendAutoStart();
	},
	Click_btn_jiesan: function () {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			console.error("Click_btn_jiesan not enter room");
			return
		}

		if (app[app.subGameName + "_ShareDefine"]().isCoinRoom) {
			//Event_ExitRoomSuccess 都有做退出处理
			//Event_CodeError
			app[app.subGameName + "Client"].ExitGame();
			return;
		}

		let state = room.GetRoomProperty("state");
		if (state == this.ShareDefine.RoomState_End) {
			//直接退出到大厅
			app[app.subGameName + "Client"].ExitGame();
			return;
		}
		let ClientPos = this.roomPosMgr.GetClientPos();
		let player = this.roomPosMgr.GetPlayerInfoByPos(ClientPos);
		if (!player)
			return;
		let posName = player.name;
		let roomID = this.RoomMgr.GetEnterRoomID();
		if (state == this.ShareDefine.RoomState_Playing) {
			app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID, posName);
			return
		}

		let msgID = '';

		let roomCfg = room.GetRoomConfig();
		if (roomCfg.createType == 2 || roomCfg.clubID != 0) {
			msgID = 'UIMoreTuiChuFangJian';
		} else {
			if (room.IsClientIsCreater()) {
				msgID = 'PlayerLeaveRoom';
			}
			else {
				msgID = 'UIMoreTuiChuFangJian';
			}
		}

		app[app.subGameName + "_ConfirmManager"]().SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, []);
		app[app.subGameName + "_ConfirmManager"]().ShowConfirm(this.ShareDefine.Confirm, msgID, []);
	},
	/**
	 * 2次确认点击回调
	 * @param curEventType
	 * @param curArgList
	 */
	OnConFirm: function (clickType, msgID, backArgList) {
		let room = this.RoomMgr.GetEnterRoom();
		if (clickType != "Sure") {
			if (msgID == "SportsPointNotEnough") {
				let roomID = this.RoomMgr.GetEnterRoomID();
				app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID);
			}
			return
		}
		if (msgID == "PlayerLeaveRoom") {
			let roomID = this.RoomMgr.GetEnterRoomID();
			app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID);
		} else if (msgID == "UIPlay_BeKick") {
			app[app.subGameName + "Client"].ExitGame();
		}
		else if (msgID == "OwnnerForceRoom") {
			app[app.subGameName + "Client"].ExitGame();
		}
		else if (msgID == "DissolveRoom") {
			//特殊处理，需要显示单局结算，不能退出
			app[app.subGameName + "Client"].ExitGame();
		}
		else if (msgID == "SportsPointNotEnough") {

		}
		else if (msgID == "MSG_BeKick" || msgID == "MSG_BeDissolve") {
			app[app.subGameName + "Client"].ExitGame();
		}
		else if (msgID == "UIMoreTuiChuFangJian") {
			let roomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
			let ClientPos = roomPosMgr.GetClientPos();
			let player = roomPosMgr.GetPlayerInfoByPos(ClientPos);
			if (!player) {
				return;
			}
			let posName = player.name;
			let roomID = this.RoomMgr.GetEnterRoomID();
			let state = room.GetRoomProperty("state");
			if (state == this.ShareDefine.RoomState_Playing) {
				app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID, posName);
				return
			}
			//房主不能退出房间，只能解散
			if (this.RoomMgr.GetEnterRoom().IsClientIsOwner()) {
				app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID, posName);
				return
			}
			app[app.subGameName + "_GameManager"]().SendExitRoom(roomID, ClientPos);
		}
	},
	OnUpdate: function () {
		//更新系统时间
		var DateNow = new Date();
		let Hours = DateNow.getHours();
		let Minutes = DateNow.getMinutes();
		Hours = this.ComTool.StringAddNumSuffix("", Hours, 2);
		Minutes = this.ComTool.StringAddNumSuffix("", Minutes, 2);
		this.now_time.string = Hours + ":" + Minutes;
	},
});