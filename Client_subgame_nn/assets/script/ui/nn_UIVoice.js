var app = require("nn_app");
cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {
	},

	OnCreateInit: function () {
		this.ZorderLv = 7;
		this.btn_chat = this.node.getChildByName("btn_chat");
		this.btn_voice = this.node.getChildByName("btn_voice");
		this.Room = app[app.subGameName.toUpperCase() + "Room"]();
		this.btn_voice.on("touchstart", this.Event_TouchStart, this);
		this.btn_voice.on("touchend", this.Event_TouchEnd, this);
		this.btn_voice.on("touchcancel", this.Event_TouchEnd, this);
	},

	OnShow: function () {
		this.ShowVoiceBtnLogic();
		this.btn_chat.active = this.IsShowChat();
	},

	// 语音按钮显示
	ShowVoiceBtnLogic: function () {
		this.btn_voice.active = this.IsShowVoice();
	},

	IsShowVoice: function () {
		this.RoomCfg = this.Room.GetRoomConfig();
		let gaoji = this.RoomCfg["gaoji"];
		if (gaoji.length > 0) {
			if (gaoji.indexOf(5) > -1) {
				return false;
			}
		}
		return true;
	},

	// 聊天
	IsShowChat: function () {
		this.RoomCfg = this.Room.GetRoomConfig();
		let gaoji = this.RoomCfg["gaoji"];
		if (gaoji.length > 0) {
			if (gaoji.indexOf(6) > -1) {
				return false;
			}
		}
		return true;
	},
	OnClose: function () {
		app[app.subGameName + "_AudioManager"]().OnDestory();
	},


	//-----------------回调函数------------------
	Event_TouchStart: function (event) {
		app[app.subGameName + "_AudioManager"]().startRecord();

	},
	Event_TouchEnd: function (event) {
		this.FormManager.CloseForm("UIAudio");
		app[app.subGameName + "_AudioManager"]().setTouchEnd(true);
		app[app.subGameName + "_AudioManager"]().stopRecord();
	},

	//---------点击函数---------------------
	OnClick: function (btnName, btnNode) {
		if (btnName == "btn_chat") {
			this.FormManager.ShowForm(app.subGameName + "_UIChat");
		} else if (btnName == "btn_voice") {

		} else {
			console.error("OnClick(%s) not find btnName", btnName);
		}
	},

});