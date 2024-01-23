var app = require("fjssz_app");
cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {},
	OnCreateInit: function () {
		this.ZorderLv = 5;
		this.contentNode = this.GetWndNode("gameScrollView/view/content");

		this.practiceConfig = app[app.subGameName + "_SysDataManager"]().GetTableDict("practice");
		this.GameManager = app[app.subGameName + "_GameManager"]();
		this.FormManager = app[app.subGameName + "_FormManager"]();
		this.NetManager = app[app.subGameName + "_NetManager"]();
		this.playerNumList = [];
		this.practiceId = 0;
		this.RegEvent("GetCurRoomID", this.Event_GetCurRoomID, this);
		this.RegEvent("CodeError", this.Event_CodeError, this);
	},
	//-----------------显示函数------------------
	OnShow: function () {
		this.gameType = app.subGameName;
		app[app.subGameName + "Client"].SetGameType('');
		this.curRoomID = 0;
		this.curGameTypeStr = "";
		this.GameManager.SetGetRoomIDByUI(true);
		this.NetManager.SendPack("game.C1101GetRoomID", {});
		this.GameManager.SetAutoPlayIng(false);
		this.FormManager.CloseForm("UIAutoPlay");
		this.FormManager.ShowForm(app.subGameName + "_UITop", app.subGameName + "_UIPractice", true, false, true);
		this.sendGameType();
	},
	sendGameType: function () {
		let sendPack = {
			'gameType': this.gameType
		};
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "GoldList", sendPack, this.OnSuccessInitData.bind(this));
	},
	OnSuccessInitData: function (serverPack) {
		//获取服务端传过来的数据
		let list = serverPack.gameLists;
		if (this.playerNumList && this.playerNumList.length) {
			this.playerNumList.splice(0, this.playerNumList.length);
		}
		for (let idx = 0; idx < list.length; idx++) {
			this.playerNumList.push(list[idx]);
		}
		this.UpdatePractice();
	},
	UpdatePractice: function () {
		let refreshList = [];
		for (let key in this.practiceConfig) {
			if (this.gameType == this.practiceConfig[key]['gameType'])
				refreshList.push(this.practiceConfig[key]);
		}
		for (let i = 0; i < refreshList.length; i++) {
			if (i > 3) {
				break;
			}
			let childNode = this.contentNode.children[i];
			let baseNum = refreshList[i]['baseMark'];
			let baseMark = '';
			if (baseMark >= 10000)
				baseMark = (baseNum / 10000).toFixed(1) + '万';
			else if (baseMark > 1000)
				baseMark = (baseNum / 1000).toFixed(1) + '千';
			else
				baseMark = baseNum.toString();
			childNode.getChildByName('lb_difen').getComponent(cc.Label).string = "底分:" + baseMark;
			if (this.playerNumList.length) {
				childNode.getChildByName('lb_renshu').getComponent(cc.Label).string = (this.playerNumList[i].playerNum).toString() + '人';
			}
			let min = refreshList[i]['min'];
			let max = refreshList[i]['max'];
			let needStr = '';
			if (0 == max) {
				if (min < 1000)
					needStr = min.toString();
				else if (min >= 10000)
					needStr = parseInt(min / 10000).toString() + '万以上';
				else
					needStr = parseInt(min / 1000).toString() + '千以上';
			} else {
				if (min < 1000)
					needStr = min.toString() + '-';
				else if (min >= 10000)
					needStr = parseInt(min / 10000).toString() + '万-';
				else
					needStr = parseInt(min / 1000).toString() + '千-';

				if (max < 1000)
					needStr += max.toString();
				else if (max >= 10000)
					needStr += parseInt(max / 10000).toString() + '万';
				else
					needStr += parseInt(max / 1000).toString() + '千';
			}
			childNode.getChildByName('lb_zhunru').getComponent(cc.Label).string = "准入:" + needStr;
		}
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
		let code = codeInfo["Code"];
		if (code == this.ShareDefine.NotFind_Room) {
			app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('DissolveRoom');
			this.curRoomID = 0;
			this.curGameTypeStr = '';
		} else if (code == this.ShareDefine.NotEnoughCoin) {
			this.WaitForConfirm("MSG_NOTROOMCOIN", [], [], this.ShareDefine.Confirm);
		}
		else if (code == this.ShareDefine.MuchCoin) {
			this.WaitForConfirm("MSG_TOOMUCHCOIN", [], [], this.ShareDefine.ConfirmOK);
		}
	},
	OnClose: function () {
	},
	//---------点击函数---------------------
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
		} else if ('MSG_NOTROOMCOIN' == msgID) {
			if (!cc.sys.isNative) return;
			let testData = {action: "showForm", fromName: "UIStore"};
			cc.sys.localStorage.setItem("switchGameData", JSON.stringify(testData));
			this.NetManager.SendPack("base.C1110UUID", {"gameName": "hall"}, function (event) {
				//如果是游戏切换需要释放内存，重新加载
				app[app.subGameName + "Client"].RemoveClientManager();
				app.LocalDataManager().SetConfigProperty("Account", "uuid", event);
				let gamePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + "ALLGame/fjssz";
				window.require(gamePath + "/src/dating.js");
			}, function (error) {
				console.log("获取uuid失败");
			});
		} else if ('MSG_CLUB_RoomCard_Not_Enough' == msgID) {
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
	GetCfgByGameName: function (gameName) {
		let cfgList = [];
		for (let key in this.practiceConfig) {
			if (gameName == this.practiceConfig[key].gameType)
				cfgList.push(this.practiceConfig[key]);
		}
		return cfgList;
	},
	sendPracticeId: function () {
		var argList = Array.prototype.slice.call(arguments);
		let idx = 0;
		if (typeof argList[0] == 'string') {
			idx = Math.floor(argList[0].substring(('item').length));
		}
		else if (typeof argList[0] == 'number') {
			idx = argList[0];
		}
		this.practiceId = idx;

		let sendPack = {
			practiceId: idx
		};
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "GoldRoom", sendPack, this.OnSuccess.bind(this), this.OnEnterRoomFailed.bind(this));
	},
	OnClick: function (btnName, btnNode) {
		let needCfgList = [];
		if ('btn_xsc' == btnName) {
			needCfgList = this.GetCfgByGameName(this.gameType);
			this.sendPracticeId(needCfgList[0].id);
		} else if ('btn_cjc' == btnName) {
			needCfgList = this.GetCfgByGameName(this.gameType);
			this.sendPracticeId(needCfgList[1].id);
		} else if ('btn_zjc' == btnName) {
			needCfgList = this.GetCfgByGameName(this.gameType);
			this.sendPracticeId(needCfgList[2].id);
		} else if ('btn_gjc' == btnName) {
			needCfgList = this.GetCfgByGameName(this.gameType);
			this.sendPracticeId(needCfgList[3].id);
		} else if ('btn_go' == btnName) {
			let gold = app[app.subGameName + "_HeroManager"]().GetHeroProperty('gold');
			needCfgList = this.GetCfgByGameName(this.gameType);
			if (0 == needCfgList.length) {
				console.error('needCfgList Error curGameName :' + this.gameType);
				return;
			}
			if (gold < needCfgList[0].min) {
				this.WaitForConfirm("MSG_NOTROOMCOIN", [], [], this.ShareDefine.Confirm);
				return;
			}
			let needId = -1;
			for (let i = 0; i < needCfgList.length; i++) {
				if (gold >= needCfgList[i].min &&
					(gold <= needCfgList[i].max || 0 == needCfgList[i].max)) {
					needId = needCfgList[i].id;
					break;
				}
			}
			if (-1 == needId) {
				console.error('CfgError needId = -1');
				return;
			}
			this.sendPracticeId(needId);
		} else {
			console.error("OnClick(%s) not find", btnName);
		}

	},

	OnSuccess: function (serverPack) {
		console.log('OnSuccess serverPack', serverPack);
		let roomID = serverPack.roomID;
		this.NetManager.SendPack('sss.CSSSGetRoomInfo', {"roomID": roomID});
		app[app.subGameName+"_ShareDefine"]().practiceId = this.practiceId;
	},

	OnEnterRoomFailed: function (serverPack) {
		console.log('OnEnterRoomFailed serverPack', serverPack);
	},
});