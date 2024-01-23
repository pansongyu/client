var app = require("qzmj_app");
cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {},
	OnCreateInit: function () {
		this.SDKManager = app[app.subGameName + "_SDKManager"]();
	},
	ShareWX: function () {
		if (this.sharetype == 0) {
			this.node.active = false;
			this.SDKManager.ShareScreen('0');
		} else {
			this.SDKManager.Share(this.title, this.gamedesc, this.weChatAppShareUrl, "0");
		}

	},
	ShareDD: function () {
		if (this.sharetype == 0) {
			this.node.active = false;
			this.SDKManager.ShareScreenDD();
		} else {
			this.SDKManager.ShareDD(this.title, this.gamedesc, this.weChatAppShareUrl);
		}

	},
	ShareMW: function () {
		if (this.sharetype == 0) {
			this.node.active = false;
			this.SDKManager.ShareScreenMW();
		} else {
			this.SDKManager.ShareMW(this.title, this.gamedesc, this.weChatAppShareUrl);
		}
	},
	/*
	 * 0:图片分享，1:链接分享
	 */
	OnShow: function (sharetype = 0, roomID = null, title = null, gamedesc = null, weChatAppShareUrl = null) {
		this.node.active = true;
		this.sharetype = sharetype;
		this.roomID = roomID;
		this.title = title;
		this.gamedesc = gamedesc;
		this.weChatAppShareUrl = weChatAppShareUrl;
	},
	//---------点击函数---------------------
	OnClick: function (btnName, btnNode) {
		if (!btnName) {
			this.ErrLog("UIJoin Buttn OnClick(%s) not find btnName", btnName);
		}
		else if (btnName === "btn_close") {
			this.CloseForm();
		} else if (btnName == "btn_wx") {
			this.ShareWX();
			this.CloseForm();
		} else if (btnName == "btn_dd") {
			this.ShareDD();
			this.CloseForm();
		} else if (btnName == "btn_mw") {
			this.ShareMW();
			this.CloseForm();
		}
	},
});
