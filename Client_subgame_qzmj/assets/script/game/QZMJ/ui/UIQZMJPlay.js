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

        lb_shpf:[cc.Label],

		giftPrefabs:[cc.Prefab],
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
		this.labelJu = this.GetWndNode("roomInfo/labelJu").getComponent(cc.Label);
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
		this.now_time = this.node.getChildByName("now_time").getComponent(cc.Label);
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
		} else if (is3DShow == 2) {
			this.FormManager.ShowForm("game/" + app.subGameName.toUpperCase() + "/ui/UI" + app.subGameName.toUpperCase() + "WBPlay");
			this.CloseForm();
			return;
		}
		this.sp_piaofen.active = false;
        this.lb_tsy.string = "";
        for (let i = 0; i < 4; i++) {
            this.lb_shpf[i].string = "";
        }
		this.labelJu.node.active = false;
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
		this.StopPlayPosActionHelp();
		let SceneManager = app[app.subGameName + "_SceneManager"]();
		if (!room) {
			this.ErrLog("OnShow not enter room");
			return
		}
		let state = room.GetRoomProperty("state");
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
			 this.labelJu.string ="1课:100分";

		} else {
			this.labelJu.string = app.i18n.t("UIMarkJuShu", {"Current": setID, "Total": current});
		}
		if (setID > 0) {
			this.labelJu.node.active = true;
		}
		this.labelWanfa.string = this.WanFa();
		this.labelWanfa.node.active = false
	},
	//一局开始
	Event_SetStart: function (event) {
		this.labelJu.node.active = true;
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
	openTest:function(){
		let that = this
		app[app.subGameName + "_NetManager"]().SendPack("game.CPlayerDebug",{},function(success){
			that.FormManager.ShowForm(app.subGameName+"_UIChat");
        },function(error){
            cc.log("失败",error)
        });
	}
});