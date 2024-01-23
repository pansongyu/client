var app = require("nn_app");
cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {},
	OnCreateInit: function () {
		this.ZorderLv = 6;
		this.resVersion = this.GetWndComponent("top/resVersion", cc.Label);
		this.practiceConfig = app[app.subGameName + "_SysDataManager"]().GetTableDict("practice");
		this.FormManager = app[app.subGameName + "_FormManager"]();
		this.RegEvent("GetCurRoomID", this.Event_GetCurRoomID, this);
		this.RegEvent("CodeError", this.Event_CodeError, this);
	},
	//-----------------显示函数------------------
	OnShow: function () {
		app[app.subGameName + "Client"].SetGameType('');
		this.curRoomID = 0;
		this.curGameTypeStr = '';
		app[app.subGameName + "_GameManager"]().SetGetRoomIDByUI(true);
		app[app.subGameName + "_NetManager"]().SendPack("game.C1101GetRoomID", {});

		if (cc.sys.isNative) {
			this.resVersion.string = "resV" + app[app.subGameName + "_HotUpdateMgr"]().getLocalVersion();
		} else {
			this.resVersion.string = '';
		}
		this.FormManager.ShowForm(app.subGameName + "_UITop", app.subGameName + "_UIMain", true, false, true);
		this.FormManager.ShowForm(app.subGameName + "_UINoticeBar");
		app[app.subGameName + "_GameManager"]().SetAutoPlayIng(false);
		this.FormManager.CloseForm(app.subGameName + "_UIAutoPlay");
		//返回大厅检测下是否有需要处理的数据
		let allSwitchGameData = [];
		let switchGameData = cc.sys.localStorage.getItem("switchGameData");
		if (switchGameData != "") {
			allSwitchGameData.push(JSON.parse(switchGameData));
		}
		for (let i = 0; i < allSwitchGameData.length; i++) {
			if (!allSwitchGameData[i]) continue;
			console.log("allSwitchGameData[i].action");
			let action = allSwitchGameData[i].action;
			switch (action) {
				case 'showForm':
					this.FormManager.ShowForm(allSwitchGameData[i].fromName);
					break;
				case 'showVideo':

					break;
				default:
					console.log('未知动作: ' + action);
					break;
			}
		}
		cc.sys.localStorage.setItem("switchGameData", "");
		let gameType = app[app.subGameName + "_ShareDefine"]().GametTypeNameDict[app.subGameName.toUpperCase()];
		let gameName = app[app.subGameName + "_ShareDefine"]().GametTypeID2Name[gameType];
		this.SetWndProperty("top/img_symid_up/img_wzmj", "text", gameName);
	},

	Event_GetCurRoomID: function (event) {
		let serverPack = event;
		this.curRoomID = serverPack.roomID;
		if (0 != this.curRoomID) {
			this.curGameTypeStr = serverPack.gameType.toLowerCase();
		}
	},
	Event_CodeError: function (event) {
		let codeInfo = event;
		if (codeInfo["Code"] == this.ShareDefine.NotFind_Room) {
			app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('DissolveRoom');
			this.curRoomID = 0;
			this.curGameTypeStr = '';
		}
	},
	OnClose: function () {
	},
	//---------点击函数---------------------
	InitGameBtnList: function (serverPack) {
		this.FormManager.ShowForm("UICreatRoom", serverPack, this.gameName);
	},
	SetWaitForConfirm: function (msgID, type, msgArg = [], cbArg = []) {
		let ConfirmManager = app[app.subGameName + "_ConfirmManager"]();
		ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
		ConfirmManager.ShowConfirm(type, msgID, msgArg);
	},
	OnConFirm: function (clickType, msgID, backArgList) {
		if (clickType != "Sure") {
			return
		}
		if ('MSG_GO_ROOM' == msgID) {
			this.Click_btn_goRoom();
		}
		else if ('MSG_CLUB_RoomCard_Not_Enough' == msgID) {
			let clubId = backArgList[0];
			for (let i = 0; i < this.clubCardNtfs.length; i++) {
				if (this.clubCardNtfs[i].clubId == clubId) {
					this.clubCardNtfs.splice(i, 1);
					break;
				}
			}
			if (0 != this.clubCardNtfs.length) {
				let data = this.clubCardNtfs[0];
				setTimeout(function () {
					app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('MSG_CLUB_RoomCard_Not_Enough', [data.clubName, data.roomcardattention]);
				}, 200);
			}
		}
	},
	OnClick: function (btnName, btnNode) {
		if ('btn_create' == btnName) {
			if (0 != this.curRoomID) {
				this.SetWaitForConfirm('MSG_GO_ROOM', this.ShareDefine.Confirm, [this.curGameTypeStr]);
				return;
			}
			this.gameName = "zyqz_nn";
			this.FormManager.ShowForm(app.subGameName + "_UICreatRoom", null, this.gameName);
		} else if ('btn_lxc' == btnName) {
			if (0 != this.curRoomID) {
				this.SetWaitForConfirm('MSG_GO_ROOM', this.ShareDefine.Confirm, [this.curGameTypeStr]);
				return;
			}
			this.FormManager.ShowForm(app.subGameName + "_UIPractice");
		}
		else if ('btn_join' == btnName) {
			if (0 != this.curRoomID) {
				this.SetWaitForConfirm('MSG_GO_ROOM', this.ShareDefine.Confirm, [this.curGameTypeStr]);
				return;
			}
			this.FormManager.ShowForm(app.subGameName + "_UIJoin");
		}
		else if ('btn_exit' == btnName) {
			if (!cc.sys.isNative) return;
			app[app.subGameName + "_NetManager"]().SendPack("base.C1110UUID", {"gameName": "hall"}, function (event) {
				//如果是游戏切换需要释放内存，重新加载
				app[app.subGameName + "Client"].RemoveClientManager();
				app.LocalDataManager().SetConfigProperty("Account", "uuid", event);
				let gamePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + "ALLGame/" + app.subGameName;
				window.require(gamePath + "/src/dating.js");
			}, function (error) {
				console.log("获取uuid失败");
			});
		}
		else if ('btn_race' == btnName) {
			this.ShowSysMsg("功能暂未开放，尽情期待！");
			// let videoData = {action:"showVideo", backCode:736438};
			// cc.sys.localStorage.setItem("switchGameData", JSON.stringify(videoData));
			// app[app.subGameName + "_SceneManager"]().LoadScene(app.subGameName + "VideoScene");
		} else if ('btn_replay' == btnName) {
			let editBox = this.GetWndNode("main/replay/replayEditBox").getComponent(cc.EditBox);
			let backCode = parseInt(editBox.string);
			let videoData = {action: "showVideo", backCode: backCode};
			cc.sys.localStorage.setItem("switchGameData", JSON.stringify(videoData));
			app[app.subGameName + "_SceneManager"]().LoadScene(app.subGameName + "VideoScene");
		}
		else {
			console.error("OnClick(%s) not find",btnName);
		}

	},

	Click_btn_goRoom: function () {
		app[app.subGameName + "Client"].SetGameType(this.curGameTypeStr);
		let event = {};
		event = {};
		event.roomID = this.curRoomID;
		app[app.subGameName + "Client"].OnEvent_LoginGetCurRoomID(event);
	},
});