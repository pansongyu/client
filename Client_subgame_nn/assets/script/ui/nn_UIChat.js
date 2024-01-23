var app = require("nn_app");
cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {
		lb_font: cc.Font,
	},

	OnCreateInit: function () {
		this.ZorderLv = 7;
		this.layout_face = this.node.getChildByName("layout_face");
		this.scr_chat = this.node.getChildByName("scr_chat");
		this.scr_typing = this.node.getChildByName("scr_typing");
		this.typing_kuang = this.node.getChildByName("label_chat");
		this.btn_send = this.node.getChildByName("btn_send");
		this.EditBox = this.GetWndNode("label_chat/edt_box").getComponent(cc.EditBox);
		this.layout_chat = this.GetWndNode("scr_chat/view/layout_chat");
		this.sp_face = this.GetWndNode("btn_face/sp_face");
		this.sp_chat = this.GetWndNode("btn_chat/sp_chat");
		this.sp_typing = this.GetWndNode("btn_typing/sp_typing");
		this.layout_record = this.GetWndNode("scr_typing/view/layout_typing");
		this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
	},

	OnShow: function () {
		this.RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
		let roomID = this.RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
		this.EditBox.string = "";

		//this.scr_chat.active = false;
		this.scr_chat.active = true;
		this.scr_typing.active = false;
		this.layout_face.active = true;
		this.sp_face.active = true;
		this.sp_chat.active = false;
		this.sp_typing.active = false;
		//this.typing_kuang.active = false;
		//this.btn_send.active = false;
		this.typing_kuang.active = true;
		this.btn_send.active = true;
		let fyArr = ["不要吵了，专心玩游戏吧", "不要走，决战到天亮", "很高兴见到各位", "各位不好意思，我要离开一会",
			"跟你合作真是太愉快了", "快点吧，我等到花儿都要谢了", "你的牌打的太好了", "你是MM还是GG", "我们交个朋友吧",
			"下次再玩吧，我要走了", "再见了，我会想念大家的", "又断线了，网络怎么这么差"];
		let language = this.LocalDataManager.GetConfigProperty("SysSetting", app.subGameName + "_Language");
		if (language == this.ShareDefine.Mandarin) {
			for (let idx = 0; idx < this.layout_chat.children.length; idx++) {
				let node = this.layout_chat.children[idx];
				let content = "";
				let isShow = true;
				switch (idx) {
					case 0:
						content = app.i18n.t("UIVoiceStringBieChao");
						break;
					case 1:
						content = app.i18n.t("UIVoiceStringBieZou");
						break;
					case 2:
						content = app.i18n.t("UIVoiceStringZhaoHu");
						break;
					case 3:
						content = app.i18n.t("UIVoiceStringZanLi");
						break;
					case 4:
						content = app.i18n.t("UIVoiceStringZanShang");
						break;
					case 5:
						content = app.i18n.t("UIVoiceStringCuiCu");
						break;
					case 6:
						content = app.i18n.t("UIVoiceStringKuaJiang");
						break;
					case 7:
						content = app.i18n.t("UIVoiceStringDaShang");
						break;
					case 8:
						content = app.i18n.t("UIVoiceStringLiKai");
						break;
					case 9:
						content = app.i18n.t("UIVoiceStringYanChi");
						break;
					default:
						isShow = false;
						console.error("Event_chatmessage not find(%s)", idx);
				}
				node.active = isShow;
				node.getChildByName("lb_chat").getComponent(cc.Label).string = content;
			}
		} else if (language == this.ShareDefine.Dialect) {
			for (let idx = 0; idx < this.layout_chat.children.length; idx++) {
				let node = this.layout_chat.children[idx];
				let content = "";
				let isShow = true;
				switch (idx) {
					case 0:
						content = fyArr[idx];
						break;
					case 1:
						content = fyArr[idx];
						break;
					case 2:
						content = fyArr[idx];
						break;
					case 3:
						content = fyArr[idx];
						break;
					case 4:
						content = fyArr[idx];
						break;
					case 5:
						content = fyArr[idx];
						break;
					case 6:
						content = fyArr[idx];
						break;
					case 7:
						content = fyArr[idx];
						break;
					case 8:
						content = fyArr[idx];
						break;
					case 9:
						content = fyArr[idx];
						break;
					case 10:
						content = fyArr[idx];
						break;
					case 11:
						content = fyArr[idx];
						break;
					default:
						isShow = false;
						console.error("Event_chatmessage not find(%s)", idx);
				}
				node.active = isShow;
				node.getChildByName("lb_chat").getComponent(cc.Label).string = content;
			}
		}

	},


	//-----------------回调函数------------------

	//---------点击函数---------------------
	OnClickForm: function () {
		//   this.CloseForm();
	},

	OnClick: function (btnName, btnNode) {
		if (btnName == "btn_send") {
			this.Click_btn_send();
		}
		else if (btnName == "btn_face") {
			this.Click_btn_face();
		}
		else if (btnName == "btn_chat") {
			this.Click_btn_chat();
		}
		else if (btnName == "btn_typing") {
			this.Click_btn_typing();
		}
		else if (btnName == "btn_close") {
			this.CloseForm();
		}
		else if (btnName.startsWith("btn_")) {
			this.Click_Btn(btnName);
		}
		else {
			console.error("OnClick(%s) not find btnName", btnName);
		}
	},
	Click_btn_face: function () {
		this.scr_chat.active = false;
		this.scr_typing.active = false;
		this.layout_face.active = true;
		this.sp_face.active = true;
		this.sp_chat.active = false;
		this.sp_typing.active = false;
		this.typing_kuang.active = false;
		this.btn_send.active = false;
	},
	Click_btn_chat: function () {
		this.layout_face.active = false;
		this.scr_chat.active = true;
		this.scr_typing.active = false;
		this.sp_face.active = false;
		this.sp_chat.active = true;
		this.sp_typing.active = false;
		this.typing_kuang.active = false;
		this.btn_send.active = false;
	},
	Click_btn_typing: function () {
		this.layout_face.active = false;
		this.scr_chat.active = false;
		this.scr_typing.active = true;
		this.sp_face.active = false;
		this.sp_chat.active = false;
		this.sp_typing.active = true;
		this.typing_kuang.active = true;
		this.btn_send.active = true;
		let roomID = this.RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
		app[app.subGameName + "_NetManager"]().SendPack("game.SChatMessageHandler", {"roomID": roomID}, this.GetChatMessageRecord.bind(this));
	},
	Click_btn_send: function () {
		let content = this.EditBox.string;
		if (!content || "" == content) return;
		let roomID = this.RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
		app[app.subGameName + "_GameManager"]().SendChat(5, 0, roomID, content);
		this.EditBox.string = "";
		this.CloseForm();
	},
	Click_Btn: function (btnName) {
		let quickID = 0;
		if (btnName.startsWith("btn_face")) {
			quickID = parseInt(btnName.substring(btnName.length - 3));
		}
		else if (btnName.startsWith("btn_chat")) {
			quickID = parseInt(btnName.substring(btnName.length - 2));
		}
		let roomID = this.RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
		let content = "";

		app[app.subGameName + "_GameManager"]().SendChat(5, quickID, roomID, content);

		this.CloseForm();
	},

	GetChatMessageRecord: function (serverPack) {
		this.layout_record.removeAllChildren();
		let list = serverPack;

		if (!list.length) return;

		for (let idx = 0; idx < list.length; idx++) {
			let data = list[idx];
			if (data.content == "") continue;
			let node = new cc.Node();
			node.anchorX = 0;
			let label = node.addComponent(cc.Label);
			label.fontSize = 30;
			label.lineHeight = 35;
			label.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
			label.enableWrapText = true;
			label.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
			let string = data.senderName + ":" + data.content;
			label.string = string;
			node.width = this.layout_record.width;
			node.color = cc.color(82, 98, 69);
			label.font = this.lb_font;
			this.layout_record.addChild(node);
		}

		//this.scr_typing.getComponent(cc.ScrollView).scrollToBottom(2.0);
	},

});