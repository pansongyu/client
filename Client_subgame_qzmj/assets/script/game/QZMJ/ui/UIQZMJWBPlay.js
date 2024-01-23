var app = require("qzmj_app");
cc.Class({
	extends: require(app.subGameName + "_BaseMaJiangForm"),

	properties: {
		backCardSpriteFrame01: cc.SpriteFrame,
		backCardSpriteFrame02: cc.SpriteFrame,

		nd_out01: cc.Prefab,
		nd_out02: cc.Prefab,
		nd_out03: cc.Prefab,
		nd_out04: cc.Prefab,

		SaiZi1: cc.SpriteFrame,
		SaiZi2: cc.SpriteFrame,
		SaiZi3: cc.SpriteFrame,
		SaiZi4: cc.SpriteFrame,
		SaiZi5: cc.SpriteFrame,
		SaiZi6: cc.SpriteFrame,

		headPrefab: cc.Prefab,

		card01Prefab: cc.Prefab,
		card02Prefab: cc.Prefab,
		card03Prefab: cc.Prefab,
		card04Prefab: cc.Prefab,

		lb_shpf: [cc.Label],

		giftPrefabs: [cc.Prefab],

		bg_charging: cc.SpriteFrame,  //充电图标
		bg_electricity: cc.SpriteFrame,  //电量状态
		icon_signal: [cc.SpriteFrame],     //信号图标

		UIInvitation: cc.Prefab,
	},
	OnCreateInit: function () {
		//获取properties属性
		this.invitationNode = cc.instantiate(this.UIInvitation);
		this.node.addChild(this.invitationNode);
		this.InitControlNode();
		this.RoomSet = app[app.subGameName.toUpperCase() + "RoomSet"]();
		this.RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
		this.InitBase();
		this.RegBaseEvent();
		this.LoadAllImages();
	},
	//获取控件节点
	InitControlNode: function () {
		this.btn_ready = this.GetWndNode("sp_ready/btn_ready");
		this.btn_weixin = this.GetWndNode("sp_ready/btn_weixin");
		this.btn_roomkey = this.GetWndNode("sp_ready/btn_roomkey");
		this.btn_exit = this.node.getChildByName("btn_exit");
		this.sp_leftnum = this.node.getChildByName("sp_leftnum");
		this.nd_dice = this.node.getChildByName("nd_dice");
		this.lbnum = this.sp_leftnum.getChildByName("lbnum").getComponent(cc.Label);
		this.labelRoomId = this.GetWndNode("roomInfo/imgRoomIdDi/labelRoomId").getComponent(cc.Label);
		this.labelWanfa = this.GetWndNode("bg/labelWanfa").getComponent(cc.Label);
		// this.labelJu = this.GetWndNode("roomInfo/labelJu").getComponent(cc.Label);
		this.labeljunode = this.GetWndNode("sp_leftnum/label");
		this.lbjunum = this.GetWndComponent("sp_leftnum/label/lbjunum", cc.Label);
		this.roomInfo = this.node.getChildByName("roomInfo");
		this.bg_jinpai = this.node.getChildByName("bg_jinpai");
		this.touzi1 = this.nd_dice.getChildByName("touzi01").getComponent(cc.Sprite);
		this.touzi2 = this.nd_dice.getChildByName("touzi02").getComponent(cc.Sprite);
		this.sp_middle = this.node.getChildByName("sp_middle");
		this.seat01 = this.sp_middle.getChildByName("seat01").getComponent(cc.Animation);
		this.seat02 = this.sp_middle.getChildByName("seat02").getComponent(cc.Animation);
		this.seat03 = this.sp_middle.getChildByName("seat03").getComponent(cc.Animation);
		this.seat04 = this.sp_middle.getChildByName("seat04").getComponent(cc.Animation);
		this.kaijin1 = this.node.getChildByName("jin1");
		this.kaijin2 = this.node.getChildByName("jin2");
		this.headNode = this.GetWndNode("headNodes/headNode");
		this.cardNodes = this.node.getChildByName("cardNodes");
		this.headPosNode = this.GetWndNode("headNodes/headPos");
		this.time = this.node.getChildByName("time").getComponent(cc.Label);
		this.btn_voice = this.node.getChildByName("right").getChildByName("btn_voice");
		this.giftNode = this.node.getChildByName("giftNode");
		this.now_time = this.GetWndComponent("right_top/now_time", cc.Label);
		this.sp_piaofen = this.node.getChildByName("sp_piaofen");
		this.lb_tsy = this.node.getChildByName("lb_tsy").getComponent(cc.Label);
	},

	OnShow: function () {
		//确保该玩家还在该房间内，否则强制退出房间
		this.CheckInRoom();
		this.btn_voice.active = this.IsShowVoice();
		this.CheckUpdateNotice();
		this.BackTime = 0;
		this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIChooseChi");
		let is3DShow = this.LocalDataManager.GetConfigProperty("SysSetting", app.subGameName + "_is3DShow");
		if (is3DShow == 0) {
			this.FormManager.ShowForm("game/" + app.subGameName.toUpperCase() + "/ui/UI" + app.subGameName.toUpperCase() + "2DPlay");
			this.CloseForm();
			return;
		}
		this.sp_piaofen.active = false;
		this.lb_tsy.string = "";
		for (let i = 0; i < 4; i++) {
			this.lb_shpf[i].string = "";
		}
		// this.labelJu.node.active = false;
		this.labeljunode.active = false;
		this.room = this.RoomMgr.GetEnterRoom();
		let RoomPosMgr = this.room.GetRoomPosMgr();
		//初始化邀请在线好友的数据
		let roomID = this.RoomMgr.GetEnterRoomID();
		this.roomCfg = this.RoomMgr.GetEnterRoom().GetRoomConfig();
		if (this.roomCfg.clubId > 0 || this.roomCfg.unionId > 0) {
			this.invitationNode.active = true;
			this.invitationNode.getComponent(this.invitationNode.name).InitData(this.roomCfg.clubId, this.roomCfg.unionId, roomID);
		} else {
			this.invitationNode.active = false;
		}
		this.InitAllCards();
		this.InitAllHead();
		this.InitAllNdOut();
		this.CloseAllActionHelp();
		let room = this.room;
		this.ShowMiddleSeatName(room);
		this.EffectActionState = this.NoAction;
		this.HideAllChild();
		this.ShowAllZhuanNum();
		this.StopPlayPosActionHelp();
		let SceneManager = app[app.subGameName + "_SceneManager"]();
		if (!room) {
			this.ErrLog("OnShow not enter room");
			return
		}
		let state = room.GetRoomProperty("state");
		this.playerNum = room.GetRoomConfigByProperty("playerNum");
		//如果是初始化
		let GameBackMusic = this.LocalDataManager.GetConfigProperty("SysSetting", "GameBackMusic");
		SceneManager.PlayMusic(GameBackMusic);

		if (state == this.ShareDefine.RoomState_Init) {
			this.OnRoomInit(room);
		}
		else if (state == this.ShareDefine.RoomState_Playing) {
			let clientPos = RoomPosMgr.GetClientPos();
			let isAuto = room.GetRoomDataInfo()['posList'][clientPos].trusteeship;
			if (isAuto) {
				app[app.subGameName + "_GameManager"]().SetAutoPlayIng(true);
				app[app.subGameName + "_FormManager"]().ShowForm(app.subGameName + "_UIAutoPlay");
			}
			let dissolveInfo = room.GetRoomProperty('dissolve');
			if (typeof(dissolveInfo) != "undefined") {
				if (dissolveInfo) {
					let posAgreeList = dissolveInfo.posAgreeList;
					if (0 != posAgreeList.length) {
						this.FormManager.ShowForm(app.subGameName + "_UIMessage02");
					}
				}
			}
			this.OnRoomPlaying(room);
		}
		else if (state == this.ShareDefine.RoomState_End) {
			this.OnRoomEnd(room);
		}
		else {
			this.ErrLog("OnShow:%s error", state);
		}
		//显示房间信息
		this.ShowRoomData();
		let dissolve = room.GetRoomProperty("dissolve");
		let endSec = dissolve["endSec"];
		if (endSec) {
			this.FormManager.ShowForm(app.subGameName + "_UIMessage02");
		}
		let changePlayerNum = room.GetRoomProperty("changePlayerNum");
		let endSec2 = changePlayerNum["endSec"];
		if (endSec2) {
			this.FormManager.ShowForm(app.subGameName + "_UIMessage03");
		}
		app[app.subGameName + "Client"].OnEvent('Head_PosUpdate', {});
		this.unschedule(this.ShowTime);
		this.time.string = '';
		this.ShuaXining = false;
		this.CheckGpsIsOpen();
		//电量信号
		if (cc.sys.isNative) {
			app[app.subGameName + "Client"].RegEvent("EvtBatteryLevel", this.OnEvent_BatteryLevel, this);
			app[app.subGameName + "_NativeManager"]().CallToNative("registerReceiver", []);
		}
		app[app.subGameName + "Client"].RegEvent("EvtSpeedTest", this.OnEvent_SpeedTest, this);
	},
	InitAllHead: function InitAllHead() {
		let players = this.room.GetRoomProperty('posList');
		let childs = this.headPosNode.children;
		let selfID = app[app.subGameName + "_HeroManager"]().GetHeroProperty("pid");
		let uiPosIndex = 1;
		this.playersCount = players.length;
		for (var i = 0; i < players.length; i++) {
			let head = cc.instantiate(this.headPrefab);
			let headScript = head.getComponent(head.name);
			let point = {};
			let showPos = this.Pos2Show(i);
			this.headNode.addChild(head);
			point = {x: childs[showPos - 1].x, y: childs[showPos - 1].y};
			headScript.Init(showPos, players[i].pos, point);
		}
	},
	ShowAllZhuanNum: function () {
		for (let pos = 0; pos < this.playerNum; pos++) {
			this.ShowPosZhuangNum(pos, "Not");
		}
	},
	ShowPosZhuangNum: function (pos, zhuangNum) {
		let head = app[app.subGameName + "_HeadManager"]().GetComponentByPos(pos);
		if (!head) {
			return;
		}
		head.ShowZhuangNum(zhuangNum);
	},
	ShowLianZhuangNum: function (room) {
		let roomSet = room.GetRoomSet();
		let dPos = roomSet.GetRoomSetProperty("dPos");
		let setPosList = roomSet.GetRoomSetProperty("setPosList");
		for (let i = 0; i < setPosList.length; i++) {
			let posInfo = setPosList[i];
			let posID = posInfo["posID"];
			let lianZhuangNum = posInfo["lianZhuangNum"];
			if (dPos == posID) {
				this.ShowPosZhuangNum(posID, lianZhuangNum);
			} else {
				this.ShowPosZhuangNum(posID, "Not");
			}
		}
	},
	ShowWinLostForm: function () {
		this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIMJKeHu");
		this.FormManager.ShowForm("game/base/ui/majiang/" + app.subGameName + "_UIMJWBWinLost", this.setEnd);
	},
	//房间解散
	Event_DissolveRoom: function (event) {

		let argDict = event;
		let ownnerForce = argDict["ownnerForce"];

		//未开启房间游戏时才会触发
		if (ownnerForce) {
			let room = this.RoomMgr.GetEnterRoom();
			//如果是房主主动接撒直接退出
			if (room && room.IsClientIsOwner()) {
				this.Client.ExitGame();
			}
			else {
				this.SetWaitForConfirm('OwnnerForceRoom', this.ShareDefine.ConfirmOK);
			}
		}
		else if (event.dissolveNoticeType == 1) {
			this.SetWaitForConfirm('SportsPointDissolveRoom', this.ShareDefine.ConfirmOK, [event.msg]);
		} else if (event.dissolveNoticeType == 3) {
			this.SetWaitForConfirm('MSG_BeDissolve', this.ShareDefine.ConfirmOK, [event.msg]);
		}
		else {
			let state = this.RoomMgr.GetEnterRoom().GetRoomProperty("state");
			let setState = this.RoomSet.GetRoomSetProperty("state");
			//如果没有打完一局不会下发roomend,直接显示2次弹框
			if (state != this.ShareDefine.RoomState_End) {
				this.SetWaitForConfirm('DissolveRoom', this.ShareDefine.ConfirmOK);
				this.FormManager.CloseForm(app.subGameName + "_UIMessage02");
			}
			//如果有roomend数据显示 结果界面
			else {

				this.FormManager.CloseForm(app.subGameName + "_UIMessage02");
				if (setState == this.ShareDefine.SetState_Init) {
					this.FormManager.ShowForm("game/base/ui/majiang/" + app.subGameName + "_UIMJWBResultDetail", false, false, true);
				}
			}

		}
	},
	//继续游戏
	Event_PosContinueGame: function (event) {
		let serverPack = event;
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("Event_PosContinueGame not enter room");
			return
		}
		let RoomPosMgr = room.GetRoomPosMgr();
		let clientPos = RoomPosMgr.GetClientPos();
		if (serverPack["pos"] != clientPos) {
			let clientPlayerInfo = RoomPosMgr.GetPlayerInfoByPos(clientPos);
			//如果玩家已经继续了,需要渲染其他人的状态
			if (!clientPlayerInfo["gameReady"]) {
				return
			}
		} else {
			this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIMJWBWinLost");
			this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIMJWBKeHu");
			this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIMJWBResultDetail");
		}
		this.OnRoomPlaying(room);
		this.ShowPlayerReady(room);
		for (let posID = 0; posID < this.playersCount; posID++) {
			let formObj = this.GetCardComponentByPos(this.Pos2Show(posID));
			if (!formObj) {
				this.ErrLog("Event_PosContinueGame not find:%s", formName);
				continue
			}
			formObj.OnSetInit(room)
		}
		app[app.subGameName + "Client"].OnEvent("Head_PosReadyChg", serverPack);
	},
	//房间结束
	OnRoomEnd: function (room) {
		this.ShowAllSeatCard(room, {});
		this.ShowAllOutCard(room);

		this.ShowMiddleSeatName(room);
		this.ShowLianZhuangNum(room);

		this.HidePlayerReady();

		this.ShowSaiZi([1, 1]);

		//如果onShow的时候已经是End状态显示
		this.FormManager.ShowForm("game/base/ui/majiang/" + app.subGameName + "_UIMJWBResultDetail");
	},
	//显示中间方位名
	ShowMiddleSeatName: function (room) {
		let clientPos = room.GetRoomPosMgr().GetClientPos();
		let playerCount = room.GetRoomPosMgr().GetRoomPlayerCount();
		if (playerCount == 4) {
			if (clientPos == this.ShareDefine.Pos_East) {
				this.ShowImage("UIPlay_WB_East0_1", "UIPlay_WB_East0_2", "UIPlay_WB_South3_1", "UIPlay_WB_South3_2", "UIPlay_WB_West2_1", "UIPlay_WB_West2_2", "UIPlay_WB_North1_1", "UIPlay_WB_North1_2");
			}
			else if (clientPos == this.ShareDefine.Pos_South) {
				this.ShowImage("UIPlay_WB_South0_1", "UIPlay_WB_South0_2", "UIPlay_WB_West3_1", "UIPlay_WB_West3_2", "UIPlay_WB_North2_1", "UIPlay_WB_North2_2", "UIPlay_WB_East1_1", "UIPlay_WB_East1_2");
			}
			else if (clientPos == this.ShareDefine.Pos_West) {
				this.ShowImage("UIPlay_WB_West0_1", "UIPlay_WB_West0_2", "UIPlay_WB_North3_1", "UIPlay_WB_North3_2", "UIPlay_WB_East2_1", "UIPlay_WB_East2_2", "UIPlay_WB_South1_1", "UIPlay_WB_South1_2");
			}
			else if (clientPos == this.ShareDefine.Pos_North) {
				this.ShowImage("UIPlay_WB_North0_1", "UIPlay_WB_North0_2", "UIPlay_WB_East3_1", "UIPlay_WB_East3_2", "UIPlay_WB_South2_1", "UIPlay_WB_South2_2", "UIPlay_WB_West1_1", "UIPlay_WB_West1_2");
			}
			else {
				this.ErrLog("clientPos:%s error", clientPos);
			}
		} else if (playerCount == 3) {
			if (clientPos == 0) {//东南西北
				this.ShowImage("UIPlay_WB_East0_1", "UIPlay_WB_East0_2", "UIPlay_WB_South3_1", "UIPlay_WB_South3_2", "UIPlay_WB_West2_1", "UIPlay_WB_West2_2", "UIPlay_WB_North1_1", "UIPlay_WB_North1_2");
			}
			else if (clientPos == 1) {//南北西东
				this.ShowImage("UIPlay_WB_South0_1", "UIPlay_WB_South0_2", "UIPlay_WB_North3_1", "UIPlay_WB_North3_2", "UIPlay_WB_West2_1", "UIPlay_WB_West2_2", "UIPlay_WB_East1_1", "UIPlay_WB_East1_2");
			}
			else if (clientPos == 2) {//北东西南
				this.ShowImage("UIPlay_WB_North0_1", "UIPlay_WB_North0_2", "UIPlay_WB_East3_1", "UIPlay_WB_East3_2", "UIPlay_WB_West2_1", "UIPlay_WB_West2_2", "UIPlay_WB_South1_1", "UIPlay_WB_South1_2");
			}
			else {
				this.ErrLog("clientPos:%s error", clientPos);
			}
		} else {
			if (clientPos == 0)
				this.ShowImage("UIPlay_WB_East0_1", "UIPlay_WB_East0_2", "UIPlay_WB_South3_1", "UIPlay_WB_South3_2", "UIPlay_WB_West2_1", "UIPlay_WB_West2_2", "UIPlay_WB_North1_1", "UIPlay_WB_North1_2");
			else
				this.ShowImage("UIPlay_WB_West0_1", "UIPlay_WB_West0_2", "UIPlay_WB_North3_1", "UIPlay_WB_North3_2", "UIPlay_WB_East2_1", "UIPlay_WB_East2_2", "UIPlay_WB_South1_1", "UIPlay_WB_South1_2");
		}
	},
	OnEvent_BatteryLevel: function (event) {
		let power = event['Level'];
		let status = event['status'];
		let rate = power / 100;
		let bg_power = this.GetWndNode("right_top/bg_power");
		if (status == 2) {
			//充电中
			bg_power.getChildByName("bar").active = false;
			bg_power.getComponent(cc.Sprite).spriteFrame = this.bg_charging;
		} else {
			bg_power.getChildByName("bar").active = true;
			bg_power.getComponent(cc.Sprite).spriteFrame = this.bg_electricity;
			bg_power.getComponent(cc.ProgressBar).progress = rate;
		}
	},
	OnEvent_SpeedTest: function (event) {
		let YanCi = event['yanci'];
		let signal = this.node.getChildByName('right_top').getChildByName('signal');
		if (YanCi < 100) {
			signal.getChildByName('lb_signal').getComponent(cc.Label).string = YanCi + 'ms';
			signal.getChildByName('lb_signal').color = cc.color(144, 227, 83);
			signal.getChildByName('bg_signal').getComponent(cc.Sprite).spriteFrame = this.icon_signal[3];
		} else if (YanCi < 300) {
			signal.getChildByName('lb_signal').getComponent(cc.Label).string = YanCi + 'ms';
			signal.getChildByName('lb_signal').color = cc.color(144, 227, 83);
			signal.getChildByName('bg_signal').getComponent(cc.Sprite).spriteFrame = this.icon_signal[2];
		} else if (YanCi < 600) {
			signal.getChildByName('lb_signal').getComponent(cc.Label).string = YanCi + 'ms';
			signal.getChildByName('lb_signal').color = cc.color(213, 203, 43);
			signal.getChildByName('bg_signal').getComponent(cc.Sprite).spriteFrame = this.icon_signal[1];
		} else if (YanCi < 1000) {
			signal.getChildByName('lb_signal').getComponent(cc.Label).string = YanCi + 'ms';
			signal.getChildByName('lb_signal').color = cc.color(254, 173, 80);
			signal.getChildByName('bg_signal').getComponent(cc.Sprite).spriteFrame = this.icon_signal[1];
		} else if (YanCi < 5000) {
			signal.getChildByName('lb_signal').getComponent(cc.Label).string = Math.floor(YanCi / 1000) + 's';
			signal.getChildByName('lb_signal').color = cc.color(234, 49, 60);
			signal.getChildByName('bg_signal').getComponent(cc.Sprite).spriteFrame = this.icon_signal[1];
		} else {
			signal.getChildByName('lb_signal').getComponent(cc.Label).string = '>5s';
			signal.getChildByName('lb_signal').color = cc.color(234, 49, 60);
			signal.getChildByName('bg_signal').getComponent(cc.Sprite).spriteFrame = this.icon_signal[0];
		}
	},
	ShowPosOutCard: function (pos) {
		let seatWndName = this.ComTool.StringAddNumSuffix("sp_seat", pos + 1, 2);
		let seatNode = this.GetWndNode(seatWndName);
		if (!seatNode) {
			this.ErrLog("ShowPosOutCard not find (%s)", seatWndName);
			return
		}
		let nd_outNode = seatNode.getChildByName("nd_out");
		let UIPlay_Out = nd_outNode.getComponent(app.subGameName + "_UIMJPlay_Out");
		UIPlay_Out.ShowAllOutCard();
		//显示搭牌
		// let da_outNode = seatNode.getChildByName("da_out");
		// let UIDa_Out = da_outNode.getComponent(app.subGameName+"_UIMJPlay_Out");
		// UIDa_Out.ShowDaCard();
		//显示花牌
		let hua_outNode = seatNode.getChildByName("hua");
		let hua_Out = hua_outNode.getComponent(app.subGameName + "_UIMJPlay_Out");
		hua_Out.ShowHuaCard();
	},
	HideAllOutCard: function () {
		//遍历4个座位
		for (let index = 0; index < this.ShareDefine.MJRoomJoinCount; index++) {
			let seatWndName = this.ComTool.StringAddNumSuffix("sp_seat", index + 1, 2);
			let seatNode = this.GetWndNode(seatWndName);
			if (!seatNode) {
				this.ErrLog("HideAllOutCard not find (%s)", seatWndName);
				continue
			}
			let nd_outNode = seatNode.getChildByName("nd_out");
			let UIPlay_Out = nd_outNode.getComponent(app.subGameName + "_UIMJPlay_Out");
			UIPlay_Out.HideAllChild();

			// let da_outNode = seatNode.getChildByName("da_out");
			// let UIDa_Out = da_outNode.getComponent(app.subGameName+"_UIMJPlay_Out");
			// UIDa_Out.HideAllChild();
			//隐藏花牌
			let hua_outNode = seatNode.getChildByName("hua");
			let hua_Out = hua_outNode.getComponent(app.subGameName + "_UIMJPlay_Out");
			hua_Out.HideAllChild();
		}
	},
	Init3RenNdOut: function (pos, childNum) {
		let is3DShow = this.LocalDataManager.GetConfigProperty("SysSetting", app.subGameName + "_is3DShow");
		this.hua_demo = this.node.getChildByName('hua_demo');
		this.nd_out01 = this.node.getChildByName('nd_out01');
		this.nd_out02 = this.node.getChildByName('nd_out02');
		this.nd_out03 = this.node.getChildByName('nd_out03');
		this.nd_out04 = this.node.getChildByName('nd_out04');
		let nd_outLineNum = 4;//总共4排
		let nd_outChild = false;
		let wndName = this.ComTool.StringAddNumSuffix("sp_seat", pos, 2);
		let nd_outNode = this.GetWndNode(wndName + '/nd_out');
		//初始化花
		let hua_node = this.GetWndNode(wndName + '/hua');
		hua_node.removeAllChildren();
		for (let i = 1; i <= 8; i++) {
			let hua_child = cc.instantiate(this.hua_demo);
			hua_child.name = "hua" + i;
			hua_child.active = true;
			hua_node.addChild(hua_child);
		}
		if (pos == 1) {
			for (let i = 1; i <= nd_outLineNum; i++) {
				let nd_outNodeChild = nd_outNode.getChildByName('out' + i);
				nd_outNodeChild.removeAllChildren();
				nd_outNodeChild.x = 0;
				if (i != 1) {
					childNum = 11;
					nd_outNodeChild.x = nd_outNode.getChildByName('out' + i).x + 115;
				}
				for (let j = 1; j <= childNum; j++) {
					nd_outChild = cc.instantiate(this.nd_out01);
					nd_outChild.name = "pai" + j;
					nd_outChild.active = 1;
					nd_outNodeChild.addChild(nd_outChild, j);

				}
			}
		} else if (pos == 2) {
			for (let i = 1; i <= nd_outLineNum; i++) {
				let nd_outNodeChild = nd_outNode.getChildByName('out' + i);
				nd_outNodeChild.removeAllChildren();
				nd_outNodeChild.y = 0;
				/*if (i != 1) {
					childNum=11;
					nd_outNodeChild.y=nd_outNode.getChildByName('out'+i).y+92;
				}*/
				childNum = 11;
				nd_outNodeChild.y = nd_outNode.getChildByName('out' + i).y + 92;
				for (let j = 1; j <= childNum; j++) {
					nd_outChild = cc.instantiate(this.nd_out02);
					nd_outChild.name = "pai" + j;
					nd_outChild.x = nd_outChild.x - (j - 1) * 2;
					nd_outChild.active = 1;
					nd_outNodeChild.addChild(nd_outChild, Math.abs(j - 12));
				}
			}
		} else if (pos == 3) {
			for (let i = 1; i <= nd_outLineNum; i++) {
				let nd_outNodeChild = nd_outNode.getChildByName('out' + i);
				nd_outNodeChild.removeAllChildren();
				nd_outNodeChild.x = 0;
				/*if (i != 1) {
					childNum=11; 
					nd_outNodeChild.x=nd_outNode.getChildByName('out'+i).x-107;
				}*/
				childNum = 11;
				nd_outNodeChild.x = nd_outNode.getChildByName('out' + i).x - 107;
				for (let j = 1; j <= childNum; j++) {
					nd_outChild = cc.instantiate(this.nd_out03);
					nd_outChild.name = "pai" + Math.abs(j - (childNum + 1));
					nd_outChild.active = 1;
					nd_outNodeChild.addChild(nd_outChild, j);
				}
			}
		} else if (pos == 4) {
			for (let i = 1; i <= nd_outLineNum; i++) {
				let nd_outNodeChild = nd_outNode.getChildByName('out' + i);
				nd_outNodeChild.removeAllChildren();
				nd_outNodeChild.y = 0;
				/*if (i != 1) {
					childNum=11;
					nd_outNodeChild.y=nd_outNode.getChildByName('out'+i).y-91;
				}*/
				childNum = 11;
				// nd_outNodeChild.y=nd_outNode.getChildByName('out'+i).y-91;
				nd_outNodeChild.y = nd_outNode.getChildByName('out' + i).y;
				for (let j = 1; j <= childNum; j++) {
					nd_outChild = cc.instantiate(this.nd_out04);
					nd_outChild.name = "pai" + j;
					nd_outChild.x = nd_outChild.x - (j - 1) * 3;
					nd_outChild.active = 1;
					nd_outNodeChild.addChild(nd_outChild, j);
				}
			}
		}
	},
	InitNdOut: function (pos, childNum) {
		let is3DShow = this.LocalDataManager.GetConfigProperty("SysSetting", app.subGameName + "_is3DShow");
		this.hua_demo = this.node.getChildByName('hua_demo');
		this.nd_out01 = this.node.getChildByName('nd_out01');
		this.nd_out02 = this.node.getChildByName('nd_out02');
		this.nd_out03 = this.node.getChildByName('nd_out03');
		this.nd_out04 = this.node.getChildByName('nd_out04');
		let nd_outLineNum = 4;//总共4排
		let nd_outChild = false;
		let wndName = this.ComTool.StringAddNumSuffix("sp_seat", pos, 2);
		let nd_outNode = this.GetWndNode(wndName + '/nd_out');
		//初始化花
		let hua_node = this.GetWndNode(wndName + '/hua');
		hua_node.removeAllChildren();
		for (let i = 1; i <= 8; i++) {
			let hua_child = cc.instantiate(this.hua_demo);
			hua_child.name = "hua" + i;
			hua_child.active = true;
			hua_node.addChild(hua_child);
		}
		if (pos == 1) {
			for (let i = 1; i <= nd_outLineNum; i++) {
				let nd_outNodeChild = nd_outNode.getChildByName('out' + i);
				nd_outNodeChild.removeAllChildren();
				nd_outNodeChild.x = 0;
				/*if(i==4 && childNum==6){
					childNum=11;  //第4牌，需要11个蹲牌
					if(is3DShow==1){
						nd_outNodeChild.x=nd_outNode.getChildByName('out3').x+115;
					}else{
						nd_outNodeChild.x=nd_outNode.getChildByName('out3').x+97;
					}
				}*/
				if (i == 4) {
					childNum = 11;
					nd_outNodeChild.x = nd_outNode.getChildByName('out' + i).x + 115;
				}
				for (let j = 1; j <= childNum; j++) {
					nd_outChild = cc.instantiate(this.nd_out01);
					nd_outChild.name = "pai" + j;
					nd_outChild.active = 1;
					nd_outNodeChild.addChild(nd_outChild, j);

				}
			}
		} else if (pos == 2) {
			for (let i = 1; i <= nd_outLineNum; i++) {
				let nd_outNodeChild = nd_outNode.getChildByName('out' + i);
				nd_outNodeChild.removeAllChildren();
				nd_outNodeChild.y = 0;
				/*if(i==4 && childNum==6){
					childNum=11;  //第4牌，需要11个蹲牌
					if(is3DShow==1){
						nd_outNodeChild.y=nd_outNode.getChildByName('out3').y+92;
					}else{
						nd_outNodeChild.y=nd_outNode.getChildByName('out3').y+72;
					}
				}*/
				if (i == 4) {
					childNum = 11;
					nd_outNodeChild.y = nd_outNode.getChildByName('out' + i).y + 92;
				}
				for (let j = 1; j <= childNum; j++) {
					nd_outChild = cc.instantiate(this.nd_out02);
					nd_outChild.name = "pai" + j;
					nd_outChild.x = nd_outChild.x - (j - 1) * 2;
					nd_outChild.active = 1;
					nd_outNodeChild.addChild(nd_outChild, Math.abs(j - 12));
				}
			}
		} else if (pos == 3) {
			for (let i = 1; i <= nd_outLineNum; i++) {
				let nd_outNodeChild = nd_outNode.getChildByName('out' + i);
				nd_outNodeChild.removeAllChildren();
				nd_outNodeChild.x = 0;
				/*if(i==4 && childNum==6){
					childNum=11;  //第4牌，需要11个蹲牌
					if(is3DShow==1){
						nd_outNodeChild.x=nd_outNode.getChildByName('out3').x-107;
					}else{
						nd_outNodeChild.x=nd_outNode.getChildByName('out3').x-86;
					}
				}*/
				if (i == 4) {
					childNum = 11;
					nd_outNodeChild.x = nd_outNode.getChildByName('out' + i).x - 107;
				}
				for (let j = 1; j <= childNum; j++) {
					nd_outChild = cc.instantiate(this.nd_out03);
					nd_outChild.name = "pai" + Math.abs(j - (childNum + 1));
					nd_outChild.active = 1;
					nd_outNodeChild.addChild(nd_outChild, j);
				}
			}
		} else if (pos == 4) {
			for (let i = 1; i <= nd_outLineNum; i++) {
				let nd_outNodeChild = nd_outNode.getChildByName('out' + i);
				nd_outNodeChild.removeAllChildren();
				nd_outNodeChild.y = 0;
				/*if(i==4 && childNum==6){
					childNum=11;  //第4牌，需要11个蹲牌
					if(is3DShow==1){
						nd_outNodeChild.y=nd_outNode.getChildByName('out3').y-91;
					}else{
						nd_outNodeChild.y=nd_outNode.getChildByName('out3').y-72;
					}
				}*/
				if (i == 4) {
					childNum = 11;
					nd_outNodeChild.y = nd_outNode.getChildByName('out' + i).y - 91;
				}
				for (let j = 1; j <= childNum; j++) {
					nd_outChild = cc.instantiate(this.nd_out04);
					nd_outChild.name = "pai" + j;
					nd_outChild.x = nd_outChild.x - (j - 1) * 3;
					nd_outChild.active = 1;
					nd_outNodeChild.addChild(nd_outChild, j);
				}
			}
		}
	},
	DeleteAllNdOut: function () {
		let players = this.RoomMgr.GetEnterRoom().GetRoomProperty('posList');
		this.playersCount = players.length;
		for (let i = 0; i < players.length; i++) {
			let showpos = this.Pos2Show(i);
			let wndName = this.ComTool.StringAddNumSuffix("sp_seat", showpos, 2);
			let nd_outNode = this.GetWndNode(wndName + '/nd_out');
			for (let j = 1; j <= 3; j++) {
				nd_outNode.getChildByName('out' + j).removeAllChildren();
			}

			// let da_outNode = this.GetWndNode(wndName+'/da_out');
			// da_outNode.removeAllChildren();
			let hua_node = this.GetWndNode(wndName + '/hua');
			hua_node.removeAllChildren();
		}
	},
	DelNode: function () {
		this.DeleteFormAllEffect();
		this.diceAnimation.stop();
		this.headNode.removeAllChildren();
		this.DeleteAllNdOut();
		this.cardNodes.getChildByName('card01').removeAllChildren();
		this.cardNodes.getChildByName('card02').removeAllChildren();
		this.cardNodes.getChildByName('card03').removeAllChildren();
		this.cardNodes.getChildByName('card04').removeAllChildren();
		this.node.getChildByName('sp_seat01').getChildByName('nd_out').getComponent(app.subGameName + "_UIMJPlay_Out").SetEffectNull();
		this.node.getChildByName('sp_seat02').getChildByName('nd_out').getComponent(app.subGameName + "_UIMJPlay_Out").SetEffectNull();
		this.node.getChildByName('sp_seat03').getChildByName('nd_out').getComponent(app.subGameName + "_UIMJPlay_Out").SetEffectNull();
		this.node.getChildByName('sp_seat04').getChildByName('nd_out').getComponent(app.subGameName + "_UIMJPlay_Out").SetEffectNull();

		// this.node.getChildByName('sp_seat01').getChildByName('da_out').getComponent(app.subGameName+"_UIMJPlay_Out").SetEffectNull();
		// this.node.getChildByName('sp_seat02').getChildByName('da_out').getComponent(app.subGameName+"_UIMJPlay_Out").SetEffectNull();
		// this.node.getChildByName('sp_seat03').getChildByName('da_out').getComponent(app.subGameName+"_UIMJPlay_Out").SetEffectNull();
		// this.node.getChildByName('sp_seat04').getChildByName('da_out').getComponent(app.subGameName+"_UIMJPlay_Out").SetEffectNull();
	},

	//摸牌
	Event_PosGetCard: function (event) {
		this.HideAllSeeCard();
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("Event_PosGetCard not enter room");
			return
		}
		let argDict = event;
		if (argDict) {
			let pos = argDict["pos"];
			let isNormal = argDict["isNormal"];
			let isBaiDa = argDict["isBaiDa"];
			if (isBaiDa == true) {
				//BaiDaMesage
				/*let roomPosMgr = room.GetRoomPosMgr();
				let PlayerInfo=roomPosMgr.GetPlayerInfoByPos(pos);
				app[app.subGameName+"_SysNotifyManager"]().ShowSysMsg("BaiDaMesage", [PlayerInfo["name"]]);*/
				this.PosEffect(this.Pos2Show(pos), 'guanerda');
			}
			let formObj = this.GetCardComponentByPos(this.Pos2Show(pos));
			if (!formObj) {
				this.ErrLog("Event_PosGetCard not find:%s", pos);
				return
			}
			formObj.OnPosGetCard();
			let leftCount = this.leftPaiNodeList.length;
			if (!leftCount) {
				this.ErrLog("Event_PosGetCard leftPaiNodeList.length not card left:", argDict);
				return
			}
			if (isNormal) {
				this.leftPaiNodeList.shift();
			} else {
				//从后面pop掉一张
				this.leftPaiNodeList.pop();
			}
			//刷新用户shoucard
			let clientSetPos = room.GetClientPlayerSetPos();
			if (!clientSetPos) {
				this.ErrLog("PosgetCard GetClientPlayerSetPos fail");
				return
			}
			this.ShowLeftCardCount(room);
			app[app.subGameName + "Client"].OnEvent('Head_UpdateDa', {});
		}
	},
	LoadAllImages: function () {
		let i = 11;
		for (; i <= 58; i++) {
			let imageName = ["CardShow", i].join("");
			let imageInfo = this.IntegrateImage[imageName];
			if (!imageInfo) {
				continue;
			}
			if (app['majiang_' + imageName]) {
				continue;
			}
			let imagePath = imageInfo["FilePath"];
			let that = this;
			app[app.subGameName + "_ControlManager"]().CreateLoadPromise(imagePath, cc.SpriteFrame)
				.then(function (spriteFrame) {
					if (!spriteFrame) {
						that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
						return
					}
					//记录精灵图片对象
					app['majiang_' + imageName] = spriteFrame;
				})
				.catch(function (error) {
					that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
				})
		}
	},
	ShowRoomData: function () {
		let room = this.RoomMgr.GetEnterRoom();
		let setID = room.GetRoomProperty("setID");
		if (setID == 0) {
			//    this.btn_exit.active=true;
		} else {
			//    this.btn_exit.active=false;
		}
		if (app[app.subGameName + "_ShareDefine"]().isCoinRoom) {
			this.node.getChildByName('btn_change').active = false;
			this.roomInfo.active = false;
			return;
		} else {
			this.roomInfo.active = true;
			if (setID == 0) {
				this.node.getChildByName('btn_change').active = this.isChangeRen();
			} else {
				this.node.getChildByName('btn_change').active = false;
				this.FormManager.CloseForm(app.subGameName + "_UIMessage03");
			}
		}
		let current = room.GetRoomConfigByProperty("setCount");
		this.roomInfo.active = true;
		this.labelRoomId.string = "房间号：" + room.GetRoomProperty("key");
		let playerAll = room.GetRoomPosMgr().GetRoomAllPlayerInfo();
		let playerAllList = Object.keys(playerAll);
		let joinPlayerCount = playerAllList.length;
		if (current == 311) {
			// let total = joinPlayerCount * 2;
			// let left = total - setID;
			// this.labelJu.string = "剩:" + left + "庄";
			// this.labelJu.string = "1课:100分";
			this.SetWndProperty("sp_leftnum/ju", "text", "1课:100分");
			this.labeljunode.active = false;
		} else {
			// this.labelJu.string = app.i18n.t("UIMarkJuShu", {"Current": setID, "Total": current});
			// this.lbjunum.string = app.i18n.t("UIMarkJuShu", {"Current": setID, "Total": current});
			this.lbjunum.string = setID;
			this.labeljunode.active = true;
		}
		if (setID > 0) {
			// this.labelJu.node.active = true;
			if (current == 311) {
				this.labeljunode.active = false;
			} else {
				this.labeljunode.active = true;
			}
		}
		this.labelWanfa.string = this.WanFa();
		this.labelWanfa.node.active = false
	},
	//一局开始
	Event_SetStart: function (event) {
		// this.labelJu.node.active = true;
		this.labeljunode.active = true;
		this.ShowRoomData();
		this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIMJWinLost");
		this.HidePlayerReady();
		this.OnSetStart();
	},
	ShowJin: function () {
		this.kaijin1.active = 0;
		this.kaijin2.active = 0;
		let jin1 = this.RoomSet.get_jin1();
		let jin2 = this.RoomSet.get_jinJin();
		let btnNode = this.GetWndNode("bg_jinpai");
		let btnNode2 = this.GetWndNode("bg_benjin");
		let that = this;
		if (jin1 == 0) {
			btnNode.active = false;
			let wndSprite = btnNode.getChildByName('card').getComponent(cc.Sprite);
			wndSprite.spriteFrame = '';
		} else {
			btnNode.active = true;
			let cardType = Math.floor(jin1 / 100);
			let imageName = ["CardShow", cardType].join("");
			let imageInfo = this.IntegrateImage[imageName];
			if (imageInfo) {
				let imagePath = imageInfo["FilePath"];

				app[app.subGameName + "_ControlManager"]().CreateLoadPromise(imagePath, cc.SpriteFrame)
					.then(function (spriteFrame) {
						if (!spriteFrame) {
							that.ErrLog("JinShow(%s) load spriteFrame fail", imagePath);
							return;
						}
						btnNode.getChildByName('card').color = cc.color(255, 255, 0);
						let wndSprite = btnNode.getChildByName('card').getComponent(cc.Sprite);
						wndSprite.spriteFrame = spriteFrame;
					})
					.catch(function (error) {
						that.ErrLog("JinShow(%s) error:%s", imagePath, error.stack);
					})
			}
			else {
				this.ErrLog('failed load imageName%s', imageName, cardType);
				return;
			}
		}
		if (jin2 == 0) {
			btnNode2.active = false;
			let wndSprite2 = btnNode2.getChildByName('card').getComponent(cc.Sprite);
			wndSprite2.spriteFrame = '';
		} else {
			btnNode2.active = true;
			let cardType2 = Math.floor(jin2 / 100);
			let imageName2 = ["CardShow", cardType2].join("");
			let imageInfo2 = this.IntegrateImage[imageName2];
			if (imageInfo2) {
				let imagePath2 = imageInfo2["FilePath"];
				app[app.subGameName + "_ControlManager"]().CreateLoadPromise(imagePath2, cc.SpriteFrame)
					.then(function (spriteFrame) {
						if (!spriteFrame) {
							that.ErrLog("JinShow(%s) load spriteFrame fail", imagePath2);
							return;
						}
						btnNode2.getChildByName('card').color = cc.color(255, 255, 0);
						let wndSprite2 = btnNode2.getChildByName('card').getComponent(cc.Sprite);
						wndSprite2.spriteFrame = spriteFrame;
					})
					.catch(function (error) {
						that.ErrLog("JinShow(%s) error:%s", imagePath2, error.stack);
					})
			}
			else {
				this.ErrLog('failed load imageName%s', imageName2, cardType2);
				return;
			}
		}
	},
});