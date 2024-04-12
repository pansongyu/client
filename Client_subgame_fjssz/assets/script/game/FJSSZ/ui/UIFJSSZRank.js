/*
    UICard01
*/
var app = require("fjssz_app");
cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {
		cardPrefab: cc.Prefab,
		icon_mapai: cc.SpriteFrame,
		prefab_specialtype: cc.Prefab,
		icon_quick: [cc.SpriteFrame],
	},

	OnCreateInit: function () {
		this.ZorderLv = this.ZorderLv6;
		this.card = this.GetWndNode("handLiPai/card");
		let nodeDun = this.GetWndNode("handLiPai/nodeDun");
		for (let i = 0; i < 13; i++) {
			this["btnDun" + (i + 1)] = nodeDun.getChildByName("btnDun" + (i + 1));
			this["btnDun" + (i + 1)].isOneClick = false;
			this["btnDun" + (i + 1)].isTwoClick = false;
		}
		let autoNodeDun = this.GetWndNode("autoLiPai/bga_dun");
		for (let i = 0; i < 13; i++) {
			this["autoBtnDun" + (i + 1)] = autoNodeDun.getChildByName("btnDun" + (i + 1));
		}
		this.node_btn_select = this.GetWndNode("handLiPai/node_btn_select");
		this.check_duizi = this.node_btn_select.getChildByName("check_duizi");
		this.check_liangdui = this.node_btn_select.getChildByName("check_liangdui");
		this.check_santiao = this.node_btn_select.getChildByName("check_santiao");
		this.check_shunzi = this.node_btn_select.getChildByName("check_shunzi");
		this.check_tonghua = this.node_btn_select.getChildByName("check_tonghua");
		this.check_hulu = this.node_btn_select.getChildByName("check_hulu");
		this.check_zhadang = this.node_btn_select.getChildByName("check_zhadang");
		this.check_tonghuashun = this.node_btn_select.getChildByName("check_tonghuashun");
		this.check_wutong = this.node_btn_select.getChildByName("check_wutong");
		this.check_liutong = this.node_btn_select.getChildByName("check_liutong");
		this.check_wugui = this.node_btn_select.getChildByName("check_wugui");
		this.node_btn_unSelect = this.GetWndNode("handLiPai/node_btn_unSelect");
		this.no_duizi = this.node_btn_unSelect.getChildByName("no_duizi");
		this.no_liangdui = this.node_btn_unSelect.getChildByName("no_liangdui");
		this.no_santiao = this.node_btn_unSelect.getChildByName("no_santiao");
		this.no_shunzi = this.node_btn_unSelect.getChildByName("no_shunzi");
		this.no_tonghua = this.node_btn_unSelect.getChildByName("no_tonghua");
		this.no_hulu = this.node_btn_unSelect.getChildByName("no_hulu");
		this.no_zhadang = this.node_btn_unSelect.getChildByName("no_zhadang");
		this.no_tonghuashun = this.node_btn_unSelect.getChildByName("no_tonghuashun");
		this.no_wutong = this.node_btn_unSelect.getChildByName("no_wutong");
		this.no_liutong = this.node_btn_unSelect.getChildByName("no_liutong");
		this.no_wugui = this.node_btn_unSelect.getChildByName("no_wugui");
		this.btnCloseDun1 = this.GetWndComponent("handLiPai/nodeDun/btnCloseDun1", cc.Button);
		this.btnCloseDun2 = this.GetWndComponent("handLiPai/nodeDun/btnCloseDun2", cc.Button);
		this.btnCloseDun3 = this.GetWndComponent("handLiPai/nodeDun/btnCloseDun3", cc.Button);
		this.quickScroll = this.GetWndComponent("autoLiPai/select/quick", cc.ScrollView);
		this.btnOK = this.GetWndNode("handLiPai/btnOK");
		this.btnCancel = this.GetWndNode("handLiPai/btnCancel");
		this.sph_clock = this.GetWndNode("handLiPai/sph_clock");
		this.lbh_count = this.GetWndNode("handLiPai/sph_clock/lbh_count");
		this.spa_clock = this.GetWndNode("autoLiPai/spa_clock");
		this.lba_count = this.GetWndNode("autoLiPai/spa_clock/lba_count");
		this.lb_cardType1 = this.GetWndNode("handLiPai/bg_dun/lb_cardType1");
		this.lb_cardType2 = this.GetWndNode("handLiPai/bg_dun/lb_cardType2");
		this.lb_cardType3 = this.GetWndNode("handLiPai/bg_dun/lb_cardType3");
		// this.lb_ren = this.GetWndComponent("sp_clock/lbl_ren", cc.Label);
		this.autoLiPai = this.node.getChildByName("autoLiPai");
		this.handLiPai = this.node.getChildByName("handLiPai");


		this.RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
		this.RoomSet = app[app.subGameName.toUpperCase() + "RoomSet"]();
		this.SetPos = app[app.subGameName.toUpperCase() + "SetPos"]();
		this.RoomPosMgr = app[app.subGameName.toUpperCase() + "RoomPosMgr"]();
		this.LogicRank = app[app.subGameName.toUpperCase() + "LogicRank"]();
		this.LogicGame = app[app.subGameName.toUpperCase() + "LogicGame"]();
		this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
		this.SysDataManager = app[app.subGameName + "_SysDataManager"]();
		this.PokerCard = app[app.subGameName + "_PokerCard"]();
		this.guize = 0;
		this.trusteeshipTime = this.SysDataManager.GetTableDict("trusteeshipTime");
		this.RegEvent("EVT_DUN_UPDATE", this.ShowAllPlayerCard);
		this.RegEvent("FJSSZ_EVT_Card_Ready", this.Event_ShowNoReady);
		cc.game.on(cc.game.EVENT_SHOW, this.OnEventShow.bind(this));
		this.isBtnHide(false);

		for (let idx = 1; idx <= 13; idx++) {
			let path1 = "";
			let node = null;
			let card = null;
			if (idx < 14) {
				let path1 = "handLiPai/nodeDun/btnDun" + idx.toString();
				let node = this.GetWndNode(path1);
				let card = cc.instantiate(this.cardPrefab);
				node.addChild(card);

				let path2 = "autoLiPai/bga_dun/btnDun" + idx.toString();
				let node2 = this.GetWndNode(path2);
				let card2 = cc.instantiate(this.cardPrefab);
				card2.active = false;
				node2.addChild(card2);
			}

			path1 = "handLiPai/card/btn_" + idx.toString();
			node = this.GetWndNode(path1);
			card = cc.instantiate(this.cardPrefab);
			card.active = false
			node.addChild(card);
		}
		this.specialType = {
			84: "三顺子",
			85: "三顺子",
			86: "三同花",
			87: "三同花",
			88: "六对半",
			89: "六对半",
			90: "六对半",
			91: "五对三条",
			92: "凑一色",
			93: "全小",
			94: "全大",
			95: "三同花顺",
			96: "十二皇族",
			97: "四套三条",
			98: "三分天下",
			99: "一条龙",
			100: "至尊清龙"
		};
	},

	//--------------显示函数-----------------
	OnShow: function () {
		let room = this.RoomMgr.GetEnterRoom();
		let roomID = this.RoomMgr.GetEnterRoomID();
		this.clientPos = this.RoomPosMgr.GetClientPos();
		let self = this;
		app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".CFJSSZPlayerCardReadyInfo", {
			"roomID": roomID,
			"posIdx": this.clientPos
		}, function (success) {
			console.log("RANK OnShow",success)
			if (success == true) {
				//玩家已经理好牌了
				self.CloseForm();
			} else {
				//玩家没离开，开启理排
				self.OnShowData();
			}
		}, function (error) {
			//数据异常了，关闭界面
			self.CloseForm();
		});
		this.wangpai = room.GetRoomConfigByProperty("wangpai");
		this.sign = room.GetRoomConfigByProperty("sign");
		this.LogicGame.SetSign(this.sign, this.wangpai);
		//test
		let node = this.node.getChildByName("clearList");
		node.active = false;
		let wangPaiNum = this.LogicGame.wangPaiNum;
		if (this.sign == 2) {
			node.active = true;
			node.getComponent(cc.Label).string = "软鬼" + "\n" /*+ "王牌数量：" + wangPaiNum*/;
		} else if (this.sign == 3) {
			if (wangPaiNum > 0) {
				node.active = true;
				node.getComponent(cc.Label).string = "软鬼" + "\n" + "王牌数量：" + wangPaiNum;
			}
		}
		this.node.opacity = 0
		cc.tween(this.node).delay(0.15).to(0.01,{opacity:255}).start()
	},
	OnShowData: function () {
		let room = this.RoomMgr.GetEnterRoom();
		let roomID = this.RoomMgr.GetEnterRoomID();
		this.clientPos = this.RoomPosMgr.GetClientPos();
		/*
		* 单击进行扑克牌互换，双击进行上牌或者下牌
		* */
		this.btnDunToDun = {
			btnDun1: "DUN1",
			btnDun2: "DUN1",
			btnDun3: "DUN1",

			btnDun4: "DUN2",
			btnDun5: "DUN2",
			btnDun6: "DUN2",
			btnDun7: "DUN2",
			btnDun8: "DUN2",

			btnDun9: "DUN3",
			btnDun10: "DUN3",
			btnDun11: "DUN3",
			btnDun12: "DUN3",
			btnDun13: "DUN3",
		};
		this.btnDunToDunNum = {
			btnDun1: 0,
			btnDun2: 1,
			btnDun3: 2,

			btnDun4: 0,
			btnDun5: 1,
			btnDun6: 2,
			btnDun7: 3,
			btnDun8: 4,

			btnDun9: 0,
			btnDun10: 1,
			btnDun11: 2,
			btnDun12: 3,
			btnDun13: 4,
		};
		//手动理牌后手动换牌
		this.clickDunDict = {};
		for (let i = 0; i < 13; i++) {
			this["btnDun" + (i + 1)].clickNum = 0;
			this.clickDunDict["btnDun" + (i + 1)] = [];
			this.clickDunDict["btnDun" + (i + 1)].push(this.btnDunToDun["btnDun" + (i + 1)], this.btnDunToDunNum["btnDun" + (i + 1)], this["btnDun" + (i + 1)], false);
		}
		//自动理牌后手动换牌
		this.clickAutoDunDict = {};
		for (let i = 0; i < 13; i++) {
			this["autoBtnDun" + (i + 1)].clickNum = 0;
			this.clickAutoDunDict["btnDun" + (i + 1)] = [];
			this.clickAutoDunDict["btnDun" + (i + 1)].push(this.btnDunToDun["btnDun" + (i + 1)], this.btnDunToDunNum["btnDun" + (i + 1)], this["autoBtnDun" + (i + 1)], false);
		}
		this.handLiPai.active = true;
		this.autoLiPai.active = false;
		this.countDown = 0;
		this.allTime = 0;


		this.setStartTime = room.GetRoomSet().GetRoomSetProperty("setStartTime");
		this.setCurrentTime = room.GetRoomSet().GetRoomSetProperty("setCurrentTime");
		let totalTime = parseInt(parseInt(this.setCurrentTime - this.setStartTime) / 1000);
		this.guize = room.GetRoomConfigByProperty("xianShi");
		this.countDown = this.trusteeshipTime["8501"].ClientTime / 1000;
		if (this.guize == 1) {
			this.countDown = 60;
			this.allTime = 60;
		} else if (this.guize == 2) {
			this.countDown = 90;
			this.allTime = 90;
		} else if (this.guize == 3) {
			this.countDown = 120;
			this.allTime = 120;
		}
		this.countDown -= totalTime;
		if (this.countDown < 30) {
			this.countDown = 30; //断线重连了，让客户还有最后30秒的机会选牌
			this.allTime = 30;
		}

		//@todo 是否关掉自动理牌按钮
		let kexuanwanfa = room.GetRoomConfigByProperty("kexuanwanfa");
		if (kexuanwanfa.length > 0) {
			if (kexuanwanfa.indexOf(3) > -1) {
				this.SetWndProperty("handLiPai/btnAutoLiPai", "active", false);
			} else {
				this.SetWndProperty("handLiPai/btnAutoLiPai", "active", true);
			}
		}
		/*let downList = this.LogicRank.getDunListByType("DOWN");
		let dataList = app[app.subGameName.toUpperCase() + "LogicGame"]().GetAllCardType(downList);
		if (0 == dataList.length) {
			this.SetWndProperty("handLiPai/btnAutoLiPai", "active", false);
		} else {
			this.SetWndProperty("handLiPai/btnAutoLiPai", "active", true);
		}*/

		this.FormManager.CloseForm(app.subGameName + "_UISetting02");
		this.FormManager.CloseForm(app.subGameName + "_UIUserInfo");
		this.FormManager.CloseForm(app.subGameName + "_UIChat");
		this.SetStartInit();
		if (this.guize != 0) {
			this.sph_clock.active = true;
			this.lbh_count.active = true;
			this.sph_clock.getComponent(cc.ProgressBar).totalLength = this.countDown / this.allTime;
			this.lbh_count.getComponent(cc.Label).string = (this.countDown).toString();
			this.spa_clock.getComponent(cc.ProgressBar).totalLength = this.countDown / this.allTime;
			this.lba_count.getComponent(cc.Label).string = (this.countDown).toString();
			this.schedule(this.CallEverySecond, 1);
		} else {
			this.unschedule(this.CallEverySecond);
			this.sph_clock.active = false;
			this.lbh_count.active = false;
			this.countDown = 0;
			this.sph_clock.getComponent(cc.ProgressBar).totalLength = 0;
			this.lbh_count.getComponent(cc.Label).string = "";
			this.spa_clock.getComponent(cc.ProgressBar).totalLength = 0;
			this.lba_count.getComponent(cc.Label).string = "";
		}
		// this.DealCardEffect();
		//智能提示牌蹲
		this.lb_cardType1.active = false;
		this.lb_cardType2.active = false;
		this.lb_cardType3.active = false;

		this.ChangeDun = "";
		this.ChangeCard = "";
		this.Event_ShowNoReady();
		this.ShowAllPlayerCard();
		this.OnEventShow()
	},
	Event_ShowNoReady: function () {
		let room = this.RoomMgr.GetEnterRoom();
		let noReadyNum = room.GetRoomPosMgr().GetNoReadyNum();
		console.log("已理好牌的玩家 Event_ShowNoReady", noReadyNum);
		// this.lb_ren.string = noReadyNum;
	},
	InitCardPos: function () {
		this.ChooseCardAddOffY = 45;
		// this.InitBtnCardPosY = -30;
		this.InitBtnCardPosY = 0;
		this.cardSpcedX = 0;//卡牌间的距离
		this.fristCardX = 0;
		this.startIndex = -1;
		this.endIndex = -1;
		let touchSprite = this.GetWndNode("handLiPai/touchSprite");
		// touchSprite.on(cc.Node.EventType.TOUCH_START, this.OnTouch, this);	
		// touchSprite.on(cc.Node.EventType.TOUCH_END, this.OnTouch, this);

		touchSprite.on(cc.Node.EventType.TOUCH_START, this.OnTouchStart, this);
		touchSprite.on(cc.Node.EventType.TOUCH_MOVE, this.OnTouchMove, this);
		touchSprite.on(cc.Node.EventType.TOUCH_END, this.OnTouchEnd, this);
		touchSprite.on(cc.Node.EventType.TOUCH_CANCEL, this.OnTouchCancel, this);

		let lastX = -1;
		for (let card_index = 1; card_index <= this.cardCount; card_index++) {
			let btnNode = this.GetWndNode("handLiPai/card/btn_" + card_index);
			if (btnNode) {
				btnNode.isMoveEnter = false;
				if (1 == card_index)
					this.fristCardX = btnNode.x;
				if (2 == card_index) {
					this.cardSpcedX = btnNode.x - lastX;
					if (this.cardSpcedX < 0)
						this.cardSpcedX = -(this.cardSpcedX);
				}
				lastX = btnNode.x;
			}
		}
	},

	OnTouchStart: function (event) {
		let card = this.card;
		let moveX = event.target.convertToNodeSpaceAR(event.touch.getLocation()).x;
		//let downList = this.LogicRank.getDunListByType("DOWN");
		for (let i = 0; i < card.children.length; i++) {
			if (card.children[i].name.startsWith("btn")) {
				let minX = card.children[i].x - card.children[i].width / 2;
				let maxX = minX + this.cardSpcedX;
				if (moveX >= minX && moveX < maxX) {
					this.startIndex = i;
					card.children[i].getChildByName("cardPrefab").getChildByName("bg_black").active = true;
					break;
				}
			}
		}
	},

	OnTouchMove: function (event) {
		let card = this.card;
		let moveX = event.target.convertToNodeSpaceAR(event.touch.getLocation()).x;
		//let downList = this.LogicRank.getDunListByType("DOWN");
		for (let i = 0; i < card.children.length; i++) {
			if (card.children[i].name.startsWith("btn")) {
				let minX = card.children[i].x - card.children[i].width / 2;
				let maxX = minX + this.cardSpcedX;
				if (moveX >= minX && moveX < maxX) {
					this.moveIndex = i;
					break;
				}
			}
		}
		if (this.startIndex > this.moveIndex) {//从右往左
			for (let i = this.startIndex; i >= this.moveIndex; i--) {
				if (card.children[i].name.startsWith("btn")) {
					card.children[i].getChildByName("cardPrefab").getChildByName("bg_black").active = true;
				}
			}
		} else {//从左往右
			for (let i = this.startIndex; i <= this.moveIndex; i++) {
				if (card.children[i].name.startsWith("btn")) {
					card.children[i].getChildByName("cardPrefab").getChildByName("bg_black").active = true;
				}
			}
		}
	},

	OnTouchEnd: function (event) {
		let card = this.card;
		let moveX = event.target.convertToNodeSpaceAR(event.touch.getLocation()).x;
		//let downList = this.LogicRank.getDunListByType("DOWN");
		for (let i = 0; i < card.children.length; i++) {
			if (card.children[i].name.startsWith("btn")) {
				card.children[i].getChildByName("cardPrefab").getChildByName("bg_black").active = false;
				if (isEnd) continue;
				let isEnd = false;
				let minX = card.children[i].x - card.children[i].width / 2;
				let maxX = minX + this.cardSpcedX;
				if (moveX >= minX && moveX < maxX) {
					this.endIndex = i;
					isEnd = true;
					//break;
				}
			}
		}

		for (let j = 0; j < card.children.length; j++) {
			if (this.startIndex > this.endIndex) {//右往左
				if (j <= this.startIndex && j >= this.endIndex && card.children[j].children[0].active)
					this.Click_card(card.children[j].name, card.children[j]);
			}
			else if (this.startIndex < this.endIndex) {//左往右
				if (j >= this.startIndex && j <= this.endIndex && card.children[j].children[0].active)
					this.Click_card(card.children[j].name, card.children[j]);
			}
			else {
				if (j == this.endIndex && card.children[j].children[0].active) {
					this.Click_card(card.children[j].name, card.children[j]);
					break;
				}
			}
		}
	},

	OnTouchCancel: function (event) {
		let card = this.card;
		for (let i = 0; i < card.children.length; i++) {
			if (card.children[i].name.startsWith("btn")) {
				card.children[i].getChildByName("cardPrefab").getChildByName("bg_black").active = false;
			}
		}
	},

	// OnTouch:function(event){
	// 	if("touchstart" == event.type || "touchend" == event.type){
	// 		let card = this.card;
	// 		let moveX = event.target.convertToNodeSpaceAR(event.touch.getLocation()).x;
	// 		let downList = this.LogicRank.getDunListByType("DOWN");
	// 		for(let i = 0;i<card.children.length;i++){
	// 			if(card.children[i].name.startsWith("btn")){
	// 				let minX = card.children[i].x - card.children[i].width/2;
	// 				let maxX = minX + this.cardSpcedX;
	// 				if(13==i || 1 == downList.length)
	// 					maxX = minX + card.children[i].width;
	// 				if(moveX >= minX && moveX < maxX){
	// 					if("touchstart" == event.type)
	// 						this.startIndex = i;
	// 					else{
	// 						this.endIndex = i;
	// 						for(let j = 0;j<card.children.length;j++){
	// 							if(this.startIndex > this.endIndex){//右往左
	// 								if(j <= this.startIndex && j >= this.endIndex && card.children[j].children[0].active)
	// 									this.Click_card(card.children[j].name,card.children[j]);
	// 							}
	// 							else if(this.startIndex < this.endIndex){//左往右
	// 								if(j >= this.startIndex && j <= this.endIndex && card.children[j].children[0].active)
	// 									this.Click_card(card.children[j].name,card.children[j]);
	// 							}
	// 							else{
	// 								if(j == this.endIndex && card.children[j].children[0].active){
	// 									this.Click_card(card.children[j].name,card.children[j]);
	// 									break;
	// 								}
	// 							}
	// 						}
	// 					}
	// 					break;
	// 				}
	// 			}
	// 		}
	// 	}
	// },

	OnReload: function () {
		console.log("OnReload");
	},
	//隐藏发送和取消按钮
	isBtnHide: function (show) {
		this.btnOK.active = show;
		// this.btnCancel.active = show;
		this.btnCancel.active = false;
	},

	//回合开始的初始化
	SetStartInit: function () {
		this.card.active = 1;
		this.LogicRank.InitDunState();
		if (this.LogicRank.GetIsSixteen()) {
			this.card.children[this.card.children.length - 1].active = true;
			this.card.children[this.card.children.length - 2].active = true;
			this.card.children[this.card.children.length - 3].active = true;
			this.card.getComponent(cc.Layout).spacingX = -15;
			this.cardCount = 16;
		} else {
			this.card.children[this.card.children.length - 1].active = false;
			this.card.children[this.card.children.length - 2].active = false;
			this.card.children[this.card.children.length - 3].active = false;
			this.card.getComponent(cc.Layout).spacingX = 5;
			this.cardCount = 13;
		}
		this.NoticeSpecial();
		this.InitCardPos();
		// this.ClearNodeSprite();
		this.ClearAutoNodeSprite();
		this.disabledBtn();
		this.ChangeDun = "";
		this.ChangeCard = "";
	},

	OnSetEnd: function () {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			console.error("OnSetEnd not enter room");
			return
		}
	},

	NoticeSpecial: function () {
	

		let setPosList = this.RoomSet.GetRoomSetProperty("setPosList");
		let special_btn = this.GetWndNode("handLiPai/special_btn");//加载一行
		special_btn.removeAllChildren();
	
		for (let i = 0; i < setPosList.length; i++) {
			let setPos = setPosList[i];
			let posID = setPos["posID"];
			if (this.clientPos == posID) {
				let special = setPos["special"];
				if (JSON.stringify(special) != "{}") {
					let pathWnd1 = "handLiPai/special_btn/";
					let len = Object.keys(special).length;
					this.CreateSpecialTypeNode(len, special);
					this.SysNotifyManager.ShowSysMsg("MSG_SPACIAL_CARD");
					for (let key in special) {
						let pathWnd = pathWnd1 + key;
						let specialNode = this.GetWndNode(pathWnd);
						this.SetWndProperty(pathWnd, "active", true);
						specialNode["specialData"] = special[key];
					}
				}
			}
		}
	},
	CreateSpecialTypeNode: function (len, special) {
		let special_btn = this.GetWndNode("handLiPai/special_btn");//加载一行
		let cardType = {
			84: "三顺子",
			85: "三顺子",
			86: "三同花",
			87: "三同花",
			88: "六对半",
			89: "六对半",
			90: "六对半",
			91: "五对三条",
			92: "凑一色",
			93: "全小",
			94: "全大",
			95: "三同花顺",
			96: "十二皇族",
			97: "四套三条",
			98: "三分天下",
			99: "一条龙",
			100: "至尊清龙"
		};
		for (let key in special) {
			let cardNode = cc.instantiate(this.prefab_specialtype);
			special_btn.addChild(cardNode);
			cardNode.children[0].getComponent(cc.Label).string = cardType[key];
			cardNode.name = key + "";
			key = parseInt(key);
			cardNode.active = true;
			cardNode.on("click", () => {
				console.log("cardNode.on(\"click\"", cardNode, cardNode["specialData"]);
				this.LogicRank.SendRankList(cardNode["specialData"], key);
			});
		}
	},
	ClearNodeSprite: function () {
		for (let card_index = 1; card_index <= this.cardCount; card_index++) {
			let btnNode = this.GetWndNode("handLiPai/card/btn_" + card_index);
			if (!btnNode) {
				console.error("ClearNodeSprite not find:%s", btnNode);
				continue;
			}
			btnNode.active = false;
			btnNode.y = this.InitBtnCardPosY;
			let cardNode = btnNode.getChildByName("cardPrefab");
			cardNode.active = false;
			btnNode.zIndex = card_index
		}

		//墩位
		for (let idx = 1; idx <= 13; idx++) {
			let btnNode = this.GetWndNode("handLiPai/nodeDun/btnDun" + idx);
			if (!btnNode) {
				console.error("ClearNodeSprite not find:%s", "btnDun" + idx);
				continue;
			}

			let cardNode = btnNode.getChildByName("cardPrefab");
			cardNode.active = 0;
		}
	},
	ClearAutoNodeSprite: function () {
		//墩位
		for (let idx = 1; idx <= 13; idx++) {
			let cardNode = this.GetWndNode("autoLiPai/bga_dun/btnDun" + idx + "/cardPrefab");
			cardNode.active = false;
		}
	},

	TipBaiPai: function () {
		let downList = this.LogicRank.getDunListByType("DOWN");
		if (downList.length < 13) {
			downList = this.SetPos.GetSetPosProperty("shouCard");
		}
		this.DataList = app[app.subGameName.toUpperCase() + "LogicGame"]().GetAllCardType(downList);
		let layout = this.GetWndNode("autoLiPai/select/quick/view/content");
		for (let i = 0; i < layout.children.length; i++) {
			let node = layout.children[i];
			node.getChildByName("img_auto").getComponent(cc.Sprite).spriteFrame = this.icon_quick[0];
			node.active = false;
		}
		if (this.DataList.length == 0) {
			this.WaitForConfirm("MSG_NOTPAI", [], [], this.ShareDefine.ConfirmOK);
		}
		for (let j = 0; j < this.DataList.length; j++) {
			let node = layout.getChildByName("btn_quick" + (j + 1));
			if (this.DataList[j].length == 0) {
				node.active = false;
				continue;
			}
			node.active = true;
			let cardType1 = this.DataList[j][0].cardType;
			let cardType2 = this.DataList[j][1].cardType;
			let cardType3 = this.DataList[j][2].cardType;
			node.getChildByName("lb3").getComponent(cc.Label).string = this.cardType2Name(cardType1);
			node.getChildByName("lb2").getComponent(cc.Label).string = this.cardType2Name(cardType2);
			node.getChildByName("lb1").getComponent(cc.Label).string = this.cardType2Name(cardType3);
			if (0 == j) {
				node.getChildByName("img_auto").getComponent(cc.Sprite).spriteFrame = this.icon_quick[1];
				this.QuickSetAutoDun(j);
			}
		}
		this.quickScroll.scrollToLeft();
	},
	cardType2Name: function (cardType) {
		if (cardType == this.LogicGame.CARD_TYPE_WUGUI) {
			return "五鬼";
		} else if (cardType == this.LogicGame.CARD_TYPE_LIUTONG) {
			return "六同";
		} else if (cardType == this.LogicGame.CARD_TYPE_WUTONG) {
			return "五同";
		} else if (cardType == this.LogicGame.CARD_TYPE_TONGHUASHUN) {
			return "同花顺";
		} else if (cardType == this.LogicGame.CARD_TYPE_ZHADAN) {
			return "铁支";
		} else if (cardType == this.LogicGame.CARD_TYPE_ZHADAN_SANGUI) {
			return "叁贵";
		} else if (cardType == this.LogicGame.CARD_TYPE_ZHADAN_SHUANGWANGCHONGTOU) {
			return "爽枉充投";
		} else if (cardType == this.LogicGame.CARD_TYPE_ZHADAN_CHONGZHA) {
			return "充扎";
		} else if (cardType == this.LogicGame.CARD_TYPE_HULU) {
			return "葫芦";
		} else if (cardType == this.LogicGame.CARD_TYPE_TONGHUA) {
			return "同花";
		} else if (cardType == this.LogicGame.CARD_TYPE_SHUNZI) {
			return "顺子";
		} else if (cardType == this.LogicGame.CARD_TYPE_SANTIAO) {
			return "三条";
		} else if (cardType == this.LogicGame.CARD_TYPE_LIANGDUI) {
			return "两对";
		} else if (cardType == this.LogicGame.CARD_TYPE_DUIZI) {
			return "对子";
		}
		return "乌隆";
	},
	OnEventShow: function () {
		let self = this;
		let f = function(){
			let totalTime = parseInt(parseInt(self.setCurrentTime - self.setStartTime) / 1000);
			if (self.guize == 0) {
				self.countDown = 0;
			} else if (self.guize == 1) {
				self.countDown = 60;
			} else if (self.guize == 2) {
				self.countDown = 90;
			} else if (self.guize == 3) {
				self.countDown = 120;
			}
			self.countDown -= totalTime;
		}
		app[app.subGameName + "_NetManager"]().SendPack("base.CServerTime", {}, function (event) {
			self.setCurrentTime = event.serverTimeMsec;
			f()
		},(event)=>{
			self.setCurrentTime = self.setStartTime;
			f()
		});

		if (this.countDown <= 0 && this.lbh_count && cc.isValid(this.lbh_count)) {
			this.lbh_count.getComponent(cc.Label).string = "0";
			this.sph_clock.getComponent(cc.ProgressBar).totalLength = 0 / this.allTime;
			this.lba_count.getComponent(cc.Label).string = "0";
			this.spa_clock.getComponent(cc.ProgressBar).totalLength = 0 / this.allTime;
		}
	},

	CallEverySecond: function () {
		this.countDown--;
		if (this.countDown <= 0) {
			this.unschedule(this.CallEverySecond);
			this.countDown = 0
		}
		this.lbh_count.getComponent(cc.Label).string = (this.countDown).toString();
		this.sph_clock.getComponent(cc.ProgressBar).totalLength = this.countDown / this.allTime;
		this.lba_count.getComponent(cc.Label).string = (this.countDown).toString();
		this.spa_clock.getComponent(cc.ProgressBar).totalLength = this.countDown / this.allTime;
		if (this.countDown == 20) {
			if (this.ShareDefine.isCoinRoom) {
				app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('MSG_COUNT_NOTICE');
			}
		}
	},

	ShowAllPlayerCard: function () {
		this.lb_cardType1.active = false;
		this.lb_cardType2.active = false;
		this.lb_cardType3.active = false;
		this.ClearNodeSprite();
		let downList = this.LogicRank.getDunListByType("DOWN");
		for (let index = 0; index < downList.length; index++) {
			let cardType = downList[index];
			let btnNode = this.GetWndNode("handLiPai/card/btn_" + (index + 1));
			if (!btnNode) {
				console.error("ShowAllPlayerCard not find:%s", btnNode);
				continue;
			}
			btnNode.active = true;
			//位置
			btnNode.y = this.InitBtnCardPosY;
			let bSelected = this.LogicRank.CheckSelected(cardType);
			if (bSelected) {
				btnNode.y += this.ChooseCardAddOffY;
			}
			this.ShowCard(cardType, btnNode.getChildByName("cardPrefab"));
		}

		//墩位
		for (let dunType = 1; dunType <= 3; dunType++) {
			let dunList = this.LogicRank.getDunListByType("DUN" + dunType);
			let dunStartIdx = 0;
			this.GetCardType("DUN" + dunType);
			if (2 == dunType) {
				dunStartIdx = 3;
			}
			if (3 == dunType) {
				dunStartIdx = 8;
			}
			for (let idx = 0; idx < dunList.length; idx++) {
				let dunIdx = dunStartIdx + idx + 1;
				let btnNode = this.GetWndNode("handLiPai/nodeDun/btnDun" + dunIdx);
				if (!btnNode) {
					console.error("ShowAllPlayerCard not find:%s", "btnDun" + dunIdx);
					continue;
				}
				this.ShowCard(dunList[idx], btnNode.getChildByName("cardPrefab"));
			}
		}
		this.InitCardOpacity();
	},
	ShowAllPlayerAutoCard: function () {
		this.lb_cardType1.active = false;
		this.lb_cardType2.active = false;
		this.lb_cardType3.active = false;
		this.ClearAutoNodeSprite();

		//墩位
		for (let dunType = 1; dunType <= 3; dunType++) {
			let dunList = this.LogicRank.getDunListByType("DUN" + dunType);
			console.log("自动理牌换牌界面渲染手牌", dunList);
			let dunStartIdx = 0;
			// this.GetAutoCardType("DUN" + dunType);
			if (2 == dunType) {
				dunStartIdx = 3;
			}
			if (3 == dunType) {
				dunStartIdx = 8;
			}
			for (let idx = 0; idx < dunList.length; idx++) {
				let dunIdx = dunStartIdx + idx + 1;
				let btnNode = this.GetWndNode("autoLiPai/bga_dun/btnDun" + dunIdx);
				this.ShowCard(dunList[idx], btnNode.getChildByName("cardPrefab"));
			}
		}
		for (let i = 1; i <= 13; i++) {
			this.GetWndNode("autoLiPai/bga_dun/btnDun" + i.toString()).opacity = 255;
		}
	},
	InitCardOpacity: function () {
		//初始化透明度
		for (let i = 1; i <= 13; i++) {
			this.GetWndNode("handLiPai/nodeDun/btnDun" + i.toString()).opacity = 255;
		}
	},
	//发牌效果
	DealCardEffect: function () {
		let self = this;
		let downList = this.LogicRank.getDunListByType("DOWN");
		console.log('downList', downList);
		for (let cardIdx = 1; cardIdx <= this.cardCount; cardIdx++) {
			let btnNode = this.GetWndNode("handLiPai/card/btn_" + cardIdx);
			if (!btnNode) {
				console.error("DealCardEffect not find:%s", btnNode);
				continue
			}
			btnNode.active = 1;
			this.ShowCard(downList[cardIdx - 1], btnNode.getChildByName("cardPrefab"));
			btnNode.active = true;
		}
	},

	ShowCard: function (cardType, btnNode) {
		let newPoker = this.PokerCard.SubCardValue(cardType);
		this.PokerCard.GetPokeCard(newPoker, btnNode);

		btnNode.getChildByName("poker_back").active = false;
		btnNode.active = true
		cc.tween(btnNode).delay(0.1).to(0.01,{opacity:255}).start()
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) return;

		let child = btnNode.getChildByName("icon_mapai");
		let kexuanwanfa = room.GetRoomConfigByProperty("kexuanwanfa");
		if (kexuanwanfa.length > 0) {
			if (kexuanwanfa.indexOf(0) > -1) {
				let maPaiValue = room.GetRoomSet().GetRoomSetProperty("mapai");
				if (newPoker == maPaiValue) {
					child.active = true;
				} else {
					child.active = false;
				}
			} else {
				child.active = false;
			}
		}
	},
	disabledBtn: function () {
		let shouCardList = this.LogicRank.getDunListByType("DOWN");
		// console.log("disabledBtn", shouCardList);
		if (!shouCardList.length) {
			this.isBtnHide(true);
			this.node_btn_select.active = false;
			this.node_btn_unSelect.active = false;
		} else if (this.LogicRank.GetIsSixteen() && shouCardList.length <= 3) {
			this.isBtnHide(true);
			this.node_btn_select.active = false;
			this.node_btn_unSelect.active = false;
		} else {
			this.isBtnHide(false);
			this.node_btn_select.active = true;
			this.node_btn_unSelect.active = true;
			let isShowDuiZiBtn = app[app.subGameName.toUpperCase() + "LogicGame"]().IsShowDuiZiBtn(shouCardList);
			let liangdui = app[app.subGameName.toUpperCase() + "LogicGame"]().GetLiangDuiEX(shouCardList);
			let isShowSanTiaoBtn = app[app.subGameName.toUpperCase() + "LogicGame"]().IsShowSanTiaoBtn(shouCardList);
			let shunzi = app[app.subGameName.toUpperCase() + "LogicGame"]().GetShunzi(shouCardList);
			let hulu = app[app.subGameName.toUpperCase() + "LogicGame"]().GetHulu(shouCardList);
			let tonghua = app[app.subGameName.toUpperCase() + "LogicGame"]().GetTonghua(shouCardList);
			let zhadan = app[app.subGameName.toUpperCase() + "LogicGame"]().GetZhaDan(shouCardList);
			let tonghuashun = app[app.subGameName.toUpperCase() + "LogicGame"]().GetTongHuaShunEx(shouCardList);
			let wutong = app[app.subGameName.toUpperCase() + "LogicGame"]().GetWuTong(shouCardList);
			let liutong = app[app.subGameName.toUpperCase() + "LogicGame"]().GetLiuTongs(shouCardList);
			let wugui = app[app.subGameName.toUpperCase() + "LogicGame"]().GetWuGuis(shouCardList);


			//显示对子按钮
			this.check_duizi.active = isShowDuiZiBtn;
			this.no_duizi.active = !isShowDuiZiBtn;

			if (!liangdui.length) {
				this.check_liangdui.active = false;
				this.no_liangdui.active = true;
			} else {
				if (liangdui.length == 2) {
					let bRet = this.LogicGame.CheckSameValue(liangdui[0], liangdui[1]);
					if (bRet) {
						this.check_liangdui.active = false;
						this.no_liangdui.active = true;
					} else {
						this.check_liangdui.active = true;
						this.no_liangdui.active = false;
					}
				} else {
					this.check_liangdui.active = true;
					this.no_liangdui.active = false;
				}
			}
			//显示三条按钮
			this.check_santiao.active = isShowSanTiaoBtn;
			this.no_santiao.active = !isShowSanTiaoBtn;

			if (!shunzi.length) {
				this.check_shunzi.active = false;
				this.no_shunzi.active = true;
			} else {
				this.check_shunzi.active = true;
				this.no_shunzi.active = false;
			}
			if (!tonghua.length) {
				this.check_tonghua.active = false;
				this.no_tonghua.active = true;
			} else {
				this.check_tonghua.active = true;
				this.no_tonghua.active = false;
			}
			if (!hulu.length) {
				this.check_hulu.active = false;
				this.no_hulu.active = true;
			} else {
				this.check_hulu.active = true;
				this.no_hulu.active = false;
			}
			if (!zhadan.length) {
				this.check_zhadang.active = false;
				this.no_zhadang.active = true;
			} else {
				this.check_zhadang.active = true;
				this.no_zhadang.active = false;
			}
			if (!tonghuashun.length) {
				this.check_tonghuashun.active = false;
				this.no_tonghuashun.active = true;
			} else {
				this.check_tonghuashun.active = true;
				this.no_tonghuashun.active = false;
			}
			if (!wutong.length) {
				this.check_wutong.active = false;
				this.no_wutong.active = true;
			} else {
				this.check_wutong.active = true;
				this.no_wutong.active = false;
			}
			if (!liutong.length) {
				this.check_liutong.active = false;
				this.no_liutong.active = true;
			} else {
				this.check_liutong.active = true;
				this.no_liutong.active = false;
			}
			if (!wugui.length) {
				this.check_wugui.active = false;
				this.no_wugui.active = true;
			} else {
				this.check_wugui.active = true;
				this.no_wugui.active = false;
			}
		}
	},

	reSortCards: function () {
		let pokers = this.LogicRank.getDunListByType('DOWN');
		let sortCards = this.LogicGame.GetSortCards(pokers);
		if (sortCards && sortCards.length) {
			this.LogicRank.pushDownCards(sortCards);
		}
	},
	GetCardType: function (dun) {
		let len = this.LogicRank.GetDunLength(dun);
		let typNode = {};
		let bShow = false;
		if (dun == "DUN1" && len == 3) {
			typNode = this.GetWndNode("handLiPai/bg_dun/lb_cardType1");
			typNode.active = true;
			bShow = true;
		} else if (dun == "DUN2" && len == 5) {
			typNode = this.GetWndNode("handLiPai/bg_dun/lb_cardType2");
			typNode.active = true;
			bShow = true;
		} else if (dun == "DUN3" && len == 5) {
			typNode = this.GetWndNode("handLiPai/bg_dun/lb_cardType3");
			typNode.active = true;
			bShow = true;
		}

		if (bShow) {
			let dunList = this.LogicRank.getDunListByType(dun);
			let type = this.LogicGame.CheckCardType(dunList);
			if (type == this.LogicGame.CARD_TYPE_DUIZI) {
				typNode.getComponent(cc.Label).string = "对子";
			} else if (type == this.LogicGame.CARD_TYPE_LIANGDUI) {
				typNode.getComponent(cc.Label).string = "两对";
			} else if (type == this.LogicGame.CARD_TYPE_SANTIAO) {
				typNode.getComponent(cc.Label).string = "三条";
			} else if (type == this.LogicGame.CARD_TYPE_SHUNZI) {
				typNode.getComponent(cc.Label).string = "顺子";
			} else if (type == this.LogicGame.CARD_TYPE_TONGHUA) {
				typNode.getComponent(cc.Label).string = "同花";
			} else if (type == this.LogicGame.CARD_TYPE_YIDUITONGHUA) {
				// typNode.getComponent(cc.Label).string = "一对同花";
				typNode.getComponent(cc.Label).string = "同花";
			} else if (type == this.LogicGame.CARD_TYPE_LIANGDUITONGHUA) {
				// typNode.getComponent(cc.Label).string = "两对同花";
				typNode.getComponent(cc.Label).string = "同花";
			} else if (type == this.LogicGame.CARD_TYPE_HULU) {
				typNode.getComponent(cc.Label).string = "葫芦";
			} else if (type == this.LogicGame.CARD_TYPE_ZHADAN_SANGUI) {
				typNode.getComponent(cc.Label).string = "叁贵";
			} else if (type == this.LogicGame.CARD_TYPE_ZHADAN_SHUANGWANGCHONGTOU) {
				typNode.getComponent(cc.Label).string = "爽枉充投";
			} else if (type == this.LogicGame.CARD_TYPE_ZHADAN_CHONGZHA) {
				typNode.getComponent(cc.Label).string = "充扎";
			} else if (type == this.LogicGame.CARD_TYPE_ZHADAN) {
				typNode.getComponent(cc.Label).string = "铁支";
			} else if (type == this.LogicGame.CARD_TYPE_TONGHUASHUN) {
				typNode.getComponent(cc.Label).string = "同花顺";
			} else if (type == this.LogicGame.CARD_TYPE_WUTONG) {
				typNode.getComponent(cc.Label).string = "五同";
			} else if (type == this.LogicGame.CARD_TYPE_LIUTONG) {
				typNode.getComponent(cc.Label).string = "六同";
			} else if (type == this.LogicGame.CARD_TYPE_WUGUI) {
				typNode.getComponent(cc.Label).string = "五鬼";
			} else if (type == this.LogicGame.CARD_TYPE_WULONG) {
				typNode.getComponent(cc.Label).string = "乌隆";
			}
		}
	},
	GetAutoCardType: function (dun, cardType) {
		let len = this.LogicRank.GetDunLength(dun);
		let typNode = {};
		let bShow = false;
		if (dun == "DUN1" && len == 3) {
			typNode = this.GetWndNode("autoLiPai/cardType/cardType1");
			typNode.getComponent(cc.Label).string = this.cardType2Name(cardType);
			typNode.active = true;
			bShow = true;
		} else if (dun == "DUN2" && len == 5) {
			typNode = this.GetWndNode("autoLiPai/cardType/cardType2");
			typNode.getComponent(cc.Label).string = this.cardType2Name(cardType);
			typNode.active = true;
			bShow = true;
		} else if (dun == "DUN3" && len == 5) {
			typNode = this.GetWndNode("autoLiPai/cardType/cardType3");
			typNode.getComponent(cc.Label).string = this.cardType2Name(cardType);
			typNode.active = true;
			bShow = true;
		}
		console.log("自动理牌", dun, this.cardType2Name(cardType));
	},
	SetChangeCard: function (dun, index) {
		if (this.ChangeDun) {
			if (this.ChangeDun == dun && this.ChangeCard == index) {
				return;
			}
			let card1 = this.LogicRank.GetDunCard(this.ChangeDun, this.ChangeCard);
			let card2 = this.LogicRank.GetDunCard(dun, index);
			this.LogicRank.SetDunCard(this.ChangeDun, this.ChangeCard, card2);
			this.LogicRank.SetDunCard(dun, index, card1);
			this.ChangeDun = '';
			this.ChangeCard = '';
			this.ShowAllPlayerCard();
		} else {
			this.ChangeDun = dun;
			this.ChangeCard = index;
		}
	},
	ChongZhiPai: function (dunStr, idx, btnDunName, clickNum) {
		let clickDunDict = this.clickDunDict;
		if (this.autoLiPai.active) {
			clickDunDict = this.clickAutoDunDict;
		}
		for (let key in clickDunDict) {
			if (key == btnDunName) {
				clickDunDict[btnDunName][0] = dunStr;
				clickDunDict[btnDunName][1] = idx;
				clickDunDict[btnDunName][2].clickNum = clickNum;
				clickDunDict[btnDunName][3] = true;
			} else {
				clickDunDict[key][2].clickNum = 0;
				clickDunDict[key][2].children[0].y = 0;
				clickDunDict[key][3] = false;
			}
		}
	},
	PaiDunHuHuanPai: function (btnName) {
		//牌墩上的牌互换,牌墩上的牌已放满检查是否倒水提示
		let clickDunDict = this.clickDunDict;
		if (this.autoLiPai.active) {
			clickDunDict = this.clickAutoDunDict;
		}
		for (let key in clickDunDict) {
			if (clickDunDict[key][3]) {
				if (key == btnName) {
					break;
				}

				console.log(clickDunDict);
				let dunStr = this.btnDunToDun[key];
				let idx = clickDunDict[key][1];
				let dun = this.LogicRank.getDunListByType(dunStr);
				let dunCard = this.LogicRank.GetDunCard(dunStr, idx);
				let benDunStr = this.btnDunToDun[btnName];
				let benIdx = clickDunDict[btnName][1];
				let benDun = this.LogicRank.getDunListByType(benDunStr);
				let benDunCard = this.LogicRank.GetDunCard(benDunStr, benIdx);
				if (dunCard) {
					if (benDunCard) {
						dun.splice(idx, 1);
						dun.splice(idx, 0, benDunCard);
						benDun.splice(benIdx, 1);
						benDun.splice(benIdx, 0, dunCard);
						console.log(dun, benDun);
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.ChongZhiPai("", "", "", 0);
						return true;
					} else {
						dun.splice(idx, 1);
						benDun.splice(benIdx, 1);
						benDun.splice(benIdx, 0, dunCard);
						console.log(dun, benDun);
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.ChongZhiPai("", "", "", 0);
						return true;
					}
				}
			}
		}
	},
	AutoPaiDunHuHuanPai: function (btnName) {
		//牌墩上的牌互换,牌墩上的牌已放满检查是否倒水提示
		let clickDunDict = this.clickAutoDunDict;
		for (let key in clickDunDict) {
			if (clickDunDict[key][3]) {
				if (key == btnName) {
					break;
				}

				console.log(clickDunDict);
				let dunStr = this.btnDunToDun[key];
				let idx = clickDunDict[key][1];
				let dun = this.LogicRank.getDunListByType(dunStr);
				let hdun = this.ComTool.DeepCopy(dun);
				let dunCard = this.LogicRank.GetDunCard(dunStr, idx);
				let benDunStr = this.btnDunToDun[btnName];
				let benIdx = clickDunDict[btnName][1];
				let benDun = this.LogicRank.getDunListByType(benDunStr);
				let hbenDun = this.ComTool.DeepCopy(benDun);
				let benDunCard = this.LogicRank.GetDunCard(benDunStr, benIdx);
				if (dunCard) {
					if (benDunCard) {
						dun.splice(idx, 1);
						dun.splice(idx, 0, benDunCard);
						benDun.splice(benIdx, 1);
						benDun.splice(benIdx, 0, dunCard);
						console.log(dun, benDun);
						let isDaoShui = this.CheckAutoHuanPaiDaoShui();
						if (!isDaoShui) {
							this.LogicRank.SetDunListByType(dunStr, dun);
							this.LogicRank.SetDunListByType(benDunStr, benDun);
							this.ShowAllPlayerAutoCard();
							this.GetAutoCardTypeByHuHuan(dunStr, dun, benDunStr, benDun);
							this.ChongZhiPai("", "", "", 0);
							return true;
						} else {
							//换牌之后倒水了要把牌换恢复回来
							dun = hdun;
							benDun = hbenDun;
							this.LogicRank.SetDunListByType(dunStr, dun);
							this.LogicRank.SetDunListByType(benDunStr, benDun);
							this.ShowAllPlayerAutoCard();
							this.ChongZhiPai("", "", "", 0);
							return false;
						}
					} else {
						dun.splice(idx, 1);
						benDun.splice(benIdx, 1);
						benDun.splice(benIdx, 0, dunCard);
						console.log(dun, benDun);
						let isDaoShui = this.CheckAutoHuanPaiDaoShui();
						if (!isDaoShui) {
							this.LogicRank.SetDunListByType(dunStr, dun);
							this.LogicRank.SetDunListByType(benDunStr, benDun);
							this.ShowAllPlayerAutoCard();
							this.GetAutoCardTypeByHuHuan(dunStr, dun, benDunStr, benDun);
							this.ChongZhiPai("", "", "", 0);
							return true;
						} else {
							dun = hdun;
							benDun = hbenDun;
							this.LogicRank.SetDunListByType(dunStr, dun);
							this.LogicRank.SetDunListByType(benDunStr, benDun);
							this.ShowAllPlayerAutoCard();
							this.ChongZhiPai("", "", "", 0);
							return false;
						}
					}
				}
			}
		}
	},
	GetAutoCardTypeByHuHuan: function (dunStr, dun, benDunStr, benDun) {
		let dunType = this.LogicGame.CheckCardType(dun);
		let benDunType = this.LogicGame.CheckCardType(benDun);
		this.GetAutoCardType(dunStr, dunType);
		this.GetAutoCardType(benDunStr, benDunType);
	},
	CheckAutoHuanPaiDaoShui: function () {
		let isDaoShui = false;
		console.log(" ddddMSG_CARD_DAOSHUI")
		if (this.LogicRank.CheckDaoShui("DUN3") == 0) {
			this.SysNotifyManager.ShowSysMsg("MSG_CARD_DAOSHUI");
			isDaoShui = true
		}
		if (this.LogicRank.CheckDaoShui('DUN2') == 0) {
			this.SysNotifyManager.ShowSysMsg("MSG_CARD_DAOSHUI");
			isDaoShui = true
		}
		if (this.LogicRank.CheckDaoShui('DUN1') == 0) {
			this.SysNotifyManager.ShowSysMsg("MSG_CARD_DAOSHUI");
			isDaoShui = true
		}
		return isDaoShui;
	},
	ClearAutoCardDown: function () {
		for (let key in this.clickAutoDunDict) {
			this.clickAutoDunDict[key][2].clickNum = 0;
			this.clickAutoDunDict[key][2].children[0].y = 0;
			this.clickAutoDunDict[key][3] = false;
		}
	},
	//---------点击触发---------------------
	OnClick: function (btnName, btnNode) {
		// console.log("btnName", btnName);
		if (btnName.startsWith("btn_quick")) {
			let layout = this.GetWndNode("autoLiPai/select/quick/view/content");
			for (let i = 0; i < layout.children.length; i++) {
				let node = layout.children[i];
				node.getChildByName("img_auto").getComponent(cc.Sprite).spriteFrame = this.icon_quick[0];
			}
			let quickID = btnName.replace("btn_quick", "");
			btnNode.getChildByName("img_auto").getComponent(cc.Sprite).spriteFrame = this.icon_quick[1];
			this.QuickSetAutoDun(quickID);
		} else if (btnName.startsWith("btn_")) {
			this.Click_card(btnName, btnNode);
		} else if (btnName == "handLiPai") {
			if (this.handLiPai.active) {
				this.LogicRank.clearSelectedCards();
			}
		} else if (btnName == "check_duizi") {
			this.LogicRank.CheckDuiZi();
		} else if (btnName == "check_liangdui") {
			this.LogicRank.CheckLiangDui();
		} else if (btnName == "check_santiao") {
			this.LogicRank.CheckSanTiao();
		} else if (btnName == "check_shunzi") {
			this.LogicRank.CheckShunzi();
		} else if (btnName == "check_tonghua") {
			this.LogicRank.CheckTonghua();
		} else if (btnName == "check_hulu") {
			this.LogicRank.CheckHulu();
		} else if (btnName.startsWith("check_zhadang")) {
			this.LogicRank.CheckZhaDang();
		} else if (btnName == "check_tonghuashun") {
			this.LogicRank.CheckTongHuaShun();
		} else if (btnName == "check_wutong") {
			this.LogicRank.CheckWuTong();
		} else if (btnName == "check_liutong") {
			this.LogicRank.CheckLiuTong();
		} else if (btnName == "check_wugui") {
			this.LogicRank.CheckWuGui();
		} else if (btnName == "check_special") {
			this.LogicRank.SetSpecialCard();
			this.LogicRank.SendRankList();
			// this.CloseForm();
		} else if (btnName == "btnCloseDun1") {
			if (this.LogicRank.getDunListByType('DUN1').length) {
				this.LogicRank.ClearDun('DUN1', true);
				this.reSortCards();
				this.disabledBtn();
			}
			this.ChongZhiPai("", "", btnName, 0);
		} else if (btnName == "btnCloseDun2") {
			if (this.LogicRank.getDunListByType('DUN2').length) {
				this.LogicRank.ClearDun('DUN2', true);
				this.reSortCards();
				this.disabledBtn();
			}
			this.ChongZhiPai("", "", btnName, 0);
		} else if (btnName == "btnCloseDun3") {
			if (this.LogicRank.getDunListByType('DUN3').length) {
				this.LogicRank.ClearDun('DUN3', true);
				this.reSortCards();
				this.disabledBtn();
			}
			this.ChongZhiPai("", "", btnName, 0);
		} else if (btnName == "btnOK") {
			this.Click_SendRankList();
		} else if (btnName == "btnCancel") {
			this.LogicRank.ClearDun('DUN1', true);
			this.LogicRank.ClearDun('DUN2', true);
			this.LogicRank.ClearDun('DUN3', true);
			this.lb_cardType1.active = false;
			this.lb_cardType2.active = false;
			this.lb_cardType3.active = false;
			this.reSortCards();
			this.disabledBtn();

		} else if (btnName == "btnCardtype") {
			this.FormManager.ShowOrCloseForm("game/FJSSZ/UIFJSSZ_CardType");
		} else if (btnName == "BtnDownCards") {
			this.LogicRank.clearSelectedCards();
		} else if (btnName == "btnFirst") {
			this.LogicRank.SetDun('DUN1');
			this.disabledBtn();
		} else if (btnName == "btnSecond") {
			this.LogicRank.SetDun('DUN2');
			this.disabledBtn();
		} else if (btnName == "btnThird") {
			this.LogicRank.SetDun('DUN3');
			this.disabledBtn();
		} else if (btnName == "btnHandLiPai") {
			this.Click_btn_handLiPai();
		} else if (btnName == "btnAutoLiPai") {
			this.LogicRank.ClearDun("DUN1", false);
			this.LogicRank.ClearDun("DUN2", false);
			this.LogicRank.ClearDun("DUN3", false);
			//智能提示牌蹲
			this.TipBaiPai();
			this.handLiPai.active = false;
			this.autoLiPai.active = !this.handLiPai.active;
			this.ClearAutoCardDown();
			// this.ClearAutoNodeSprite();
		} else if (this.handLiPai.active) {
			if (btnName == "btnDun1") {
				let isOk = this.PaiDunHuHuanPai(btnName);
				if (isOk) {
					return;
				}

				btnNode.clickNum++;
				this.ChongZhiPai("DUN1", 0, btnName, btnNode.clickNum);
				let haveCard = btnNode.children[0].active;
				let selectedLength = this.LogicRank.GetDunLength("SELECTED");
				//没有选择牌并且牌墩上没牌就直接上牌
				if (haveCard) {//牌墩上有牌手牌有选择牌就互换
					btnNode.children[0].y = 20;
					if (selectedLength == 1) {
						//进行牌的更换
						this.LogicRank.ClearOneCard("DUN1", 0);//
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.clickDunDict[btnName][2].clickNum = 0;
						this.clickDunDict[btnName][2].children[0].y = 0;
						this.clickDunDict[btnName][3] = false;
					} else {
						if (this.clickDunDict[btnName][2].clickNum == 2) {
							this.LogicRank.ClearOneCard('DUN1', 0);
							this.LogicRank.AutoSetDun();
							this.reSortCards();
							this.disabledBtn();
							this.clickDunDict[btnName][2].clickNum = 0;
							this.clickDunDict[btnName][2].children[0].y = 0;
							this.clickDunDict[btnName][3] = false;
						}
					}
				} else {
					btnNode.children[0].y = 0;
					if (selectedLength > 0) {
						this.LogicRank.ClearOneCard('DUN1', 0);
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.clickDunDict[btnName][2].clickNum = 0;
						this.clickDunDict[btnName][2].children[0].y = 0;
						this.clickDunDict[btnName][3] = false;
					}
				}
			} else if (btnName == "btnDun2") {
				/*if (this.LogicRank.GetDunCard('DUN1', 1)) {
					btnNode.opacity = 180;
					this.SetChangeCard('DUN1', 1);
				} else {
					this.LogicRank.ClearOneCard('DUN1', 1);
					this.LogicRank.AutoSetDun();
					this.reSortCards();
					this.disabledBtn();
				}*/
				let isOk = this.PaiDunHuHuanPai(btnName);
				if (isOk) {
					return;
				}

				btnNode.clickNum++;
				this.ChongZhiPai("DUN1", 1, btnName, btnNode.clickNum);
				let haveCard = btnNode.children[0].active;
				let selectedLength = this.LogicRank.GetDunLength("SELECTED");
				//没有选择牌并且牌墩上没牌就直接上牌
				if (haveCard) {//牌墩上有牌手牌有选择牌就互换
					btnNode.children[0].y = 20;
					if (selectedLength == 1) {
						//进行牌的更换
						this.LogicRank.ClearOneCard("DUN1", 1);
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.clickDunDict[btnName][2].clickNum = 0;
						this.clickDunDict[btnName][2].children[0].y = 0;
						this.clickDunDict[btnName][3] = false;
					} else {
						if (this.clickDunDict[btnName][2].clickNum == 2) {
							this.LogicRank.ClearOneCard("DUN1", 1);
							this.LogicRank.AutoSetDun();
							this.reSortCards();
							this.disabledBtn();
							this.clickDunDict[btnName][2].clickNum = 0;
							this.clickDunDict[btnName][2].children[0].y = 0;
							this.clickDunDict[btnName][3] = false;
						}
					}
				} else {
					btnNode.children[0].y = 0;
					if (selectedLength > 0) {
						this.LogicRank.ClearOneCard("DUN1", 1);
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.clickDunDict[btnName][2].clickNum = 0;
						this.clickDunDict[btnName][2].children[0].y = 0;
						this.clickDunDict[btnName][3] = false;
					}
				}
			} else if (btnName == "btnDun3") {
				/*if (this.LogicRank.GetDunCard('DUN1', 2)) {
					btnNode.opacity = 180;
					this.SetChangeCard('DUN1', 2);
				} else {
					this.LogicRank.ClearOneCard('DUN1', 2);
					this.LogicRank.AutoSetDun();
					this.reSortCards();
					this.disabledBtn();
				}*/
				let isOk = this.PaiDunHuHuanPai(btnName);
				if (isOk) {
					return;
				}

				btnNode.clickNum++;
				this.ChongZhiPai("DUN1", 2, btnName, btnNode.clickNum);
				let haveCard = btnNode.children[0].active;
				let selectedLength = this.LogicRank.GetDunLength("SELECTED");
				//没有选择牌并且牌墩上没牌就直接上牌
				if (haveCard) {//牌墩上有牌手牌有选择牌就互换
					btnNode.children[0].y = 20;
					if (selectedLength == 1) {
						//进行牌的更换
						this.LogicRank.ClearOneCard("DUN1", 2);
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.clickDunDict[btnName][2].clickNum = 0;
						this.clickDunDict[btnName][2].children[0].y = 0;
						this.clickDunDict[btnName][3] = false;
					} else {
						if (this.clickDunDict[btnName][2].clickNum == 2) {
							this.LogicRank.ClearOneCard("DUN1", 2);
							this.LogicRank.AutoSetDun();
							this.reSortCards();
							this.disabledBtn();
							this.clickDunDict[btnName][2].clickNum = 0;
							this.clickDunDict[btnName][2].children[0].y = 0;
							this.clickDunDict[btnName][3] = false;
						}
					}
				} else {
					btnNode.children[0].y = 0;
					if (selectedLength > 0) {
						this.LogicRank.ClearOneCard("DUN1", 2);
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.clickDunDict[btnName][2].clickNum = 0;
						this.clickDunDict[btnName][2].children[0].y = 0;
						this.clickDunDict[btnName][3] = false;
					}
				}
			} else if (btnName == "btnDun4") {
				/*if (this.LogicRank.GetDunCard('DUN2', 0)) {
					btnNode.opacity = 180;
					this.SetChangeCard('DUN2', 0);
				} else {
					this.LogicRank.ClearOneCard('DUN2', 0);
					this.LogicRank.AutoSetDun();
					this.reSortCards();
					this.disabledBtn();
				}*/
				let isOk = this.PaiDunHuHuanPai(btnName);
				if (isOk) {
					return;
				}

				btnNode.clickNum++;
				this.ChongZhiPai("DUN2", 0, btnName, btnNode.clickNum);
				let haveCard = btnNode.children[0].active;
				let selectedLength = this.LogicRank.GetDunLength("SELECTED");
				//没有选择牌并且牌墩上没牌就直接上牌
				if (haveCard) {//牌墩上有牌手牌有选择牌就互换
					btnNode.children[0].y = 20;
					if (selectedLength == 1) {
						//进行牌的更换
						this.LogicRank.ClearOneCard("DUN2", 0);//
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.clickDunDict[btnName][2].clickNum = 0;
						this.clickDunDict[btnName][2].children[0].y = 0;
						this.clickDunDict[btnName][3] = false;
					} else {
						if (this.clickDunDict[btnName][2].clickNum == 2) {
							this.LogicRank.ClearOneCard('DUN2', 0);
							this.LogicRank.AutoSetDun();
							this.reSortCards();
							this.disabledBtn();
							this.clickDunDict[btnName][2].clickNum = 0;
							this.clickDunDict[btnName][2].children[0].y = 0;
							this.clickDunDict[btnName][3] = false;
						}
					}
				} else {
					btnNode.children[0].y = 0;
					if (selectedLength > 0) {
						this.LogicRank.ClearOneCard('DUN2', 0);
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.clickDunDict[btnName][2].clickNum = 0;
						this.clickDunDict[btnName][2].children[0].y = 0;
						this.clickDunDict[btnName][3] = false;
					}
				}
			} else if (btnName == "btnDun5") {
				/*if (this.LogicRank.GetDunCard('DUN2', 1)) {
					btnNode.opacity = 180;
					this.SetChangeCard('DUN2', 1);
				} else {
					this.LogicRank.ClearOneCard('DUN2', 1);
					this.LogicRank.AutoSetDun();
					this.reSortCards();
					this.disabledBtn();
				}*/
				let isOk = this.PaiDunHuHuanPai(btnName);
				if (isOk) {
					return;
				}

				btnNode.clickNum++;
				this.ChongZhiPai("DUN2", 1, btnName, btnNode.clickNum);
				let haveCard = btnNode.children[0].active;
				let selectedLength = this.LogicRank.GetDunLength("SELECTED");
				//没有选择牌并且牌墩上没牌就直接上牌
				if (haveCard) {//牌墩上有牌手牌有选择牌就互换
					btnNode.children[0].y = 20;
					if (selectedLength == 1) {
						//进行牌的更换
						this.LogicRank.ClearOneCard("DUN2", 1);//
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.clickDunDict[btnName][2].clickNum = 0;
						this.clickDunDict[btnName][2].children[0].y = 0;
						this.clickDunDict[btnName][3] = false;
					} else {
						if (this.clickDunDict[btnName][2].clickNum == 2) {
							this.LogicRank.ClearOneCard('DUN2', 1);
							this.LogicRank.AutoSetDun();
							this.reSortCards();
							this.disabledBtn();
							this.clickDunDict[btnName][2].clickNum = 0;
							this.clickDunDict[btnName][2].children[0].y = 0;
							this.clickDunDict[btnName][3] = false;
						}
					}
				} else {
					btnNode.children[0].y = 0;
					if (selectedLength > 0) {
						this.LogicRank.ClearOneCard('DUN2', 1);
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.clickDunDict[btnName][2].clickNum = 0;
						this.clickDunDict[btnName][2].children[0].y = 0;
						this.clickDunDict[btnName][3] = false;
					}
				}
			} else if (btnName == "btnDun6") {
				/*if (this.LogicRank.GetDunCard('DUN2', 2)) {
					btnNode.opacity = 180;
					this.SetChangeCard('DUN2', 2);
				} else {
					this.LogicRank.ClearOneCard('DUN2', 2);
					this.LogicRank.AutoSetDun();
					this.reSortCards();
					this.disabledBtn();
				}*/
				let isOk = this.PaiDunHuHuanPai(btnName);
				if (isOk) {
					return;
				}

				btnNode.clickNum++;
				this.ChongZhiPai("DUN2", 2, btnName, btnNode.clickNum);
				let haveCard = btnNode.children[0].active;
				let selectedLength = this.LogicRank.GetDunLength("SELECTED");
				//没有选择牌并且牌墩上没牌就直接上牌
				if (haveCard) {//牌墩上有牌手牌有选择牌就互换
					btnNode.children[0].y = 20;
					if (selectedLength == 1) {
						//进行牌的更换
						this.LogicRank.ClearOneCard("DUN2", 2);//
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.clickDunDict[btnName][2].clickNum = 0;
						this.clickDunDict[btnName][2].children[0].y = 0;
						this.clickDunDict[btnName][3] = false;
					} else {
						if (this.clickDunDict[btnName][2].clickNum == 2) {
							this.LogicRank.ClearOneCard('DUN2', 2);
							this.LogicRank.AutoSetDun();
							this.reSortCards();
							this.disabledBtn();
							this.clickDunDict[btnName][2].clickNum = 0;
							this.clickDunDict[btnName][2].children[0].y = 0;
							this.clickDunDict[btnName][3] = false;
						}
					}
				} else {
					btnNode.children[0].y = 0;
					if (selectedLength > 0) {
						this.LogicRank.ClearOneCard('DUN2', 2);
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.clickDunDict[btnName][2].clickNum = 0;
						this.clickDunDict[btnName][2].children[0].y = 0;
						this.clickDunDict[btnName][3] = false;
					}
				}
			} else if (btnName == "btnDun7") {
				/*if (this.LogicRank.GetDunCard('DUN2', 3)) {
					btnNode.opacity = 180;
					this.SetChangeCard('DUN2', 3);
				} else {
					this.LogicRank.ClearOneCard('DUN2', 3);
					this.LogicRank.AutoSetDun();
					this.reSortCards();
					this.disabledBtn();
				}*/
				let isOk = this.PaiDunHuHuanPai(btnName);
				if (isOk) {
					return;
				}

				btnNode.clickNum++;
				this.ChongZhiPai("DUN2", 3, btnName, btnNode.clickNum);
				let haveCard = btnNode.children[0].active;
				let selectedLength = this.LogicRank.GetDunLength("SELECTED");
				//没有选择牌并且牌墩上没牌就直接上牌
				if (haveCard) {//牌墩上有牌手牌有选择牌就互换
					btnNode.children[0].y = 20;
					if (selectedLength == 1) {
						//进行牌的更换
						this.LogicRank.ClearOneCard("DUN2", 3);//
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.clickDunDict[btnName][2].clickNum = 0;
						this.clickDunDict[btnName][2].children[0].y = 0;
						this.clickDunDict[btnName][3] = false;
					} else {
						if (this.clickDunDict[btnName][2].clickNum == 2) {
							this.LogicRank.ClearOneCard('DUN2', 3);
							this.LogicRank.AutoSetDun();
							this.reSortCards();
							this.disabledBtn();
							this.clickDunDict[btnName][2].clickNum = 0;
							this.clickDunDict[btnName][2].children[0].y = 0;
							this.clickDunDict[btnName][3] = false;
						}
					}
				} else {
					btnNode.children[0].y = 0;
					if (selectedLength > 0) {
						this.LogicRank.ClearOneCard('DUN2', 3);
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.clickDunDict[btnName][2].clickNum = 0;
						this.clickDunDict[btnName][2].children[0].y = 0;
						this.clickDunDict[btnName][3] = false;
					}
				}
			} else if (btnName == "btnDun8") {
				/*if (this.LogicRank.GetDunCard('DUN2', 4)) {
					btnNode.opacity = 180;
					this.SetChangeCard('DUN2', 4);
				} else {
					this.LogicRank.ClearOneCard('DUN2', 4);
					this.LogicRank.AutoSetDun();
					this.reSortCards();
					this.disabledBtn();
				}*/
				let isOk = this.PaiDunHuHuanPai(btnName);
				if (isOk) {
					return;
				}

				btnNode.clickNum++;
				this.ChongZhiPai("DUN2", 4, btnName, btnNode.clickNum);
				let haveCard = btnNode.children[0].active;
				let selectedLength = this.LogicRank.GetDunLength("SELECTED");
				//没有选择牌并且牌墩上没牌就直接上牌
				if (haveCard) {//牌墩上有牌手牌有选择牌就互换
					btnNode.children[0].y = 20;
					if (selectedLength == 1) {
						//进行牌的更换
						this.LogicRank.ClearOneCard("DUN2", 4);//
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.clickDunDict[btnName][2].clickNum = 0;
						this.clickDunDict[btnName][2].children[0].y = 0;
						this.clickDunDict[btnName][3] = false;
					} else {
						if (this.clickDunDict[btnName][2].clickNum == 2) {
							this.LogicRank.ClearOneCard('DUN2', 4);
							this.LogicRank.AutoSetDun();
							this.reSortCards();
							this.disabledBtn();
							this.clickDunDict[btnName][2].clickNum = 0;
							this.clickDunDict[btnName][2].children[0].y = 0;
							this.clickDunDict[btnName][3] = false;
						}
					}
				} else {
					btnNode.children[0].y = 0;
					if (selectedLength > 0) {
						this.LogicRank.ClearOneCard('DUN2', 4);
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.clickDunDict[btnName][2].clickNum = 0;
						this.clickDunDict[btnName][2].children[0].y = 0;
						this.clickDunDict[btnName][3] = false;
					}
				}
			} else if (btnName == "btnDun9") {
				/*if (this.LogicRank.GetDunCard('DUN3', 0)) {
					btnNode.opacity = 180;
					this.SetChangeCard('DUN3', 0);
				} else {
					this.LogicRank.ClearOneCard('DUN3', 0);
					this.LogicRank.AutoSetDun();
					this.reSortCards();
					this.disabledBtn();
				}*/
				//牌墩上的牌互换
				for (let key in this.clickDunDict) {
					if (this.clickDunDict[key][3]) {
						console.log(this.clickDunDict);
						if (key == btnName) {
							break;
						}
					}
				}
				let isOk = this.PaiDunHuHuanPai(btnName);
				if (isOk) {
					return;
				}

				btnNode.clickNum++;
				this.ChongZhiPai("DUN3", 0, btnName, btnNode.clickNum);
				let haveCard = btnNode.children[0].active;
				let selectedLength = this.LogicRank.GetDunLength("SELECTED");
				//没有选择牌并且牌墩上没牌就直接上牌
				if (haveCard) {//牌墩上有牌手牌有选择牌就互换
					btnNode.children[0].y = 20;
					if (selectedLength == 1) {
						//进行牌的更换
						this.LogicRank.ClearOneCard("DUN3", 0);//
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.clickDunDict[btnName][2].clickNum = 0;
						this.clickDunDict[btnName][2].children[0].y = 0;
						this.clickDunDict[btnName][3] = false;
					} else {
						if (this.clickDunDict[btnName][2].clickNum == 2) {
							this.LogicRank.ClearOneCard('DUN3', 0);
							this.LogicRank.AutoSetDun();
							this.reSortCards();
							this.disabledBtn();
							this.clickDunDict[btnName][2].clickNum = 0;
							this.clickDunDict[btnName][2].children[0].y = 0;
							this.clickDunDict[btnName][3] = false;
						}
					}
				} else {
					btnNode.children[0].y = 0;
					if (selectedLength > 0) {
						this.LogicRank.ClearOneCard('DUN3', 0);
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.clickDunDict[btnName][2].clickNum = 0;
						this.clickDunDict[btnName][2].children[0].y = 0;
						this.clickDunDict[btnName][3] = false;
					}
				}
			} else if (btnName == "btnDun10") {
				/*if (this.LogicRank.GetDunCard('DUN3', 1)) {
					btnNode.opacity = 180;
					this.SetChangeCard('DUN3', 1);
				} else {
					this.LogicRank.ClearOneCard('DUN3', 1);
					this.LogicRank.AutoSetDun();
					this.reSortCards();
					this.disabledBtn();
				}*/
				let isOk = this.PaiDunHuHuanPai(btnName);
				if (isOk) {
					return;
				}

				btnNode.clickNum++;
				this.ChongZhiPai("DUN3", 1, btnName, btnNode.clickNum);
				let haveCard = btnNode.children[0].active;
				let selectedLength = this.LogicRank.GetDunLength("SELECTED");
				//没有选择牌并且牌墩上没牌就直接上牌
				if (haveCard) {//牌墩上有牌手牌有选择牌就互换
					btnNode.children[0].y = 20;
					if (selectedLength == 1) {
						//进行牌的更换
						this.LogicRank.ClearOneCard("DUN3", 1);//
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.clickDunDict[btnName][2].clickNum = 0;
						this.clickDunDict[btnName][2].children[0].y = 0;
						this.clickDunDict[btnName][3] = false;
					} else {
						if (this.clickDunDict[btnName][2].clickNum == 2) {
							this.LogicRank.ClearOneCard('DUN3', 1);
							this.LogicRank.AutoSetDun();
							this.reSortCards();
							this.disabledBtn();
							this.clickDunDict[btnName][2].clickNum = 0;
							this.clickDunDict[btnName][2].children[0].y = 0;
							this.clickDunDict[btnName][3] = false;
						}
					}
				} else {
					btnNode.children[0].y = 0;
					if (selectedLength > 0) {
						this.LogicRank.ClearOneCard('DUN3', 1);
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.clickDunDict[btnName][2].clickNum = 0;
						this.clickDunDict[btnName][2].children[0].y = 0;
						this.clickDunDict[btnName][3] = false;
					}
				}
			} else if (btnName == "btnDun11") {
				/*if (this.LogicRank.GetDunCard('DUN3', 2)) {
					btnNode.opacity = 180;
					this.SetChangeCard('DUN3', 2);
				} else {
					this.LogicRank.ClearOneCard('DUN3', 2);
					this.LogicRank.AutoSetDun();
					this.reSortCards();
					this.disabledBtn();
				}*/
				let isOk = this.PaiDunHuHuanPai(btnName);
				if (isOk) {
					return;
				}

				btnNode.clickNum++;
				this.ChongZhiPai("DUN3", 2, btnName, btnNode.clickNum);
				let haveCard = btnNode.children[0].active;
				let selectedLength = this.LogicRank.GetDunLength("SELECTED");
				//没有选择牌并且牌墩上没牌就直接上牌
				if (haveCard) {//牌墩上有牌手牌有选择牌就互换
					btnNode.children[0].y = 20;
					if (selectedLength == 1) {
						//进行牌的更换
						this.LogicRank.ClearOneCard("DUN3", 2);//
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.clickDunDict[btnName][2].clickNum = 0;
						this.clickDunDict[btnName][2].children[0].y = 0;
						this.clickDunDict[btnName][3] = false;
					} else {
						if (this.clickDunDict[btnName][2].clickNum == 2) {
							this.LogicRank.ClearOneCard('DUN3', 2);
							this.LogicRank.AutoSetDun();
							this.reSortCards();
							this.disabledBtn();
							this.clickDunDict[btnName][2].clickNum = 0;
							this.clickDunDict[btnName][2].children[0].y = 0;
							this.clickDunDict[btnName][3] = false;
						}
					}
				} else {
					btnNode.children[0].y = 0;
					if (selectedLength > 0) {
						this.LogicRank.ClearOneCard('DUN3', 2);
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.clickDunDict[btnName][2].clickNum = 0;
						this.clickDunDict[btnName][2].children[0].y = 0;
						this.clickDunDict[btnName][3] = false;
					}
				}
			} else if (btnName == "btnDun12") {
				/*if (this.LogicRank.GetDunCard('DUN3', 3)) {
					btnNode.opacity = 180;
					this.SetChangeCard('DUN3', 3);
				} else {
					this.LogicRank.ClearOneCard('DUN3', 3);
					this.LogicRank.AutoSetDun();
					this.reSortCards();
					this.disabledBtn();
				}*/
				let isOk = this.PaiDunHuHuanPai(btnName);
				if (isOk) {
					return;
				}

				btnNode.clickNum++;
				this.ChongZhiPai("DUN3", 3, btnName, btnNode.clickNum);
				let haveCard = btnNode.children[0].active;
				let selectedLength = this.LogicRank.GetDunLength("SELECTED");
				//没有选择牌并且牌墩上没牌就直接上牌
				if (haveCard) {//牌墩上有牌手牌有选择牌就互换
					btnNode.children[0].y = 20;
					if (selectedLength == 1) {
						//进行牌的更换
						this.LogicRank.ClearOneCard("DUN3", 3);//
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.clickDunDict[btnName][2].clickNum = 0;
						this.clickDunDict[btnName][2].children[0].y = 0;
						this.clickDunDict[btnName][3] = false;
					} else {
						if (this.clickDunDict[btnName][2].clickNum == 2) {
							this.LogicRank.ClearOneCard('DUN3', 3);
							this.LogicRank.AutoSetDun();
							this.reSortCards();
							this.disabledBtn();
							this.clickDunDict[btnName][2].clickNum = 0;
							this.clickDunDict[btnName][2].children[0].y = 0;
							this.clickDunDict[btnName][3] = false;
						}
					}
				} else {
					btnNode.children[0].y = 0;
					if (selectedLength > 0) {
						this.LogicRank.ClearOneCard('DUN3', 3);
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.clickDunDict[btnName][2].clickNum = 0;
						this.clickDunDict[btnName][2].children[0].y = 0;
						this.clickDunDict[btnName][3] = false;
					}
				}
			} else if (btnName == "btnDun13") {
				/*if (this.LogicRank.GetDunCard('DUN3', 4)) {
					btnNode.opacity = 180;
					this.SetChangeCard('DUN3', 4);
				} else {
					this.LogicRank.ClearOneCard('DUN3', 4);
					this.LogicRank.AutoSetDun();
					this.reSortCards();
					this.disabledBtn();
				}*/
				let isOk = this.PaiDunHuHuanPai(btnName);
				if (isOk) {
					return;
				}

				btnNode.clickNum++;
				this.ChongZhiPai("DUN3", 4, btnName, btnNode.clickNum);
				let haveCard = btnNode.children[0].active;
				let selectedLength = this.LogicRank.GetDunLength("SELECTED");
				//没有选择牌并且牌墩上没牌就直接上牌
				if (haveCard) {//牌墩上有牌手牌有选择牌就互换
					btnNode.children[0].y = 20;
					if (selectedLength == 1) {
						//进行牌的更换
						this.LogicRank.ClearOneCard("DUN3", 4);//
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.clickDunDict[btnName][2].clickNum = 0;
						this.clickDunDict[btnName][2].children[0].y = 0;
						this.clickDunDict[btnName][3] = false;
					} else {
						if (this.clickDunDict[btnName][2].clickNum == 2) {
							this.LogicRank.ClearOneCard('DUN3', 4);
							this.LogicRank.AutoSetDun();
							this.reSortCards();
							this.disabledBtn();
							this.clickDunDict[btnName][2].clickNum = 0;
							this.clickDunDict[btnName][2].children[0].y = 0;
							this.clickDunDict[btnName][3] = false;
						}
					}
				} else {
					btnNode.children[0].y = 0;
					if (selectedLength > 0) {
						this.LogicRank.ClearOneCard('DUN3', 4);
						this.LogicRank.AutoSetDun();
						this.reSortCards();
						this.disabledBtn();
						this.clickDunDict[btnName][2].clickNum = 0;
						this.clickDunDict[btnName][2].children[0].y = 0;
						this.clickDunDict[btnName][3] = false;
					}
				}
			}
		} else if (this.autoLiPai.active) {
			if (btnName.startsWith("btnDun")) {
				let layout = this.GetWndNode("autoLiPai/select/quick/view/content");
				for (let i = 0; i < layout.children.length; i++) {
					let node = layout.children[i];
					node.getChildByName("img_auto").getComponent(cc.Sprite).spriteFrame = this.icon_quick[0];
				}
				let isOk = this.AutoPaiDunHuHuanPai(btnName);
				if (isOk) {
					return;
				} else if (isOk == false) {
					return;
				}
				btnNode.clickNum++;
				let dunName = this.btnDunToDun[btnName];
				let dunIdx = this.btnDunToDunNum[btnName];
				this.ChongZhiPai(dunName, dunIdx, btnName, btnNode.clickNum);
				btnNode.children[0].y = 20;
				if (this.clickAutoDunDict[btnName][2].clickNum == 2) {
					this.clickAutoDunDict[btnName][2].clickNum = 0;
					this.clickAutoDunDict[btnName][2].children[0].y = 0;
					this.clickAutoDunDict[btnName][3] = false;
				}
			}
		} else {
			console.error("btnName:%s not find", btnName);
		}
	},
	Click_btn_handLiPai: function () {
		this.autoLiPai.active = false;
		this.handLiPai.active = !this.autoLiPai.active;
		// this.ClearNodeSprite();
		this.LogicRank.ClearDun("DUN1", true);
		this.LogicRank.ClearDun("DUN2", true);
		this.LogicRank.ClearDun("DUN3", true);
		this.lb_cardType1.active = false;
		this.lb_cardType2.active = false;
		this.lb_cardType3.active = false;
		this.reSortCards();
		this.disabledBtn();
	},
	QuickSetDun: function (quickID) {
		if (this.LogicRank.getDunListByType('DUN1').length) {
			this.LogicRank.ClearDun('DUN1', true);
		}
		if (this.LogicRank.getDunListByType('DUN2').length) {
			this.LogicRank.ClearDun('DUN2', true);
		}
		if (this.LogicRank.getDunListByType('DUN3').length) {
			this.LogicRank.ClearDun('DUN3', true);
		}
		this.reSortCards();
		let key = parseInt(quickID) - 1;
		if (key < 0) {
			key = 0;
		}
		let dun3 = this.DataList[key][0].cardList;
		let dun2 = this.DataList[key][1].cardList;
		let dun1 = this.DataList[key][2].cardList;
		this.LogicRank.SetDunEx('DUN3', dun3);
		this.LogicRank.SetDunEx('DUN2', dun2);
		this.LogicRank.SetDunEx('DUN1', dun1);
		this.ShowAllPlayerCard();
		this.disabledBtn();
	},
	QuickSetAutoDun: function (quickID) {
		if (this.LogicRank.getDunListByType("DUN1").length) {
			this.LogicRank.ClearDun("DUN1", false);
		}
		if (this.LogicRank.getDunListByType("DUN2").length) {
			this.LogicRank.ClearDun("DUN2", false);
		}
		if (this.LogicRank.getDunListByType("DUN3").length) {
			this.LogicRank.ClearDun("DUN3", false);
		}
		// this.reSortCards();
		let key = parseInt(quickID) - 1;
		if (key < 0) {
			key = 0;
		}
		let dun3 = this.DataList[key][0].cardList;
		let dun2 = this.DataList[key][1].cardList;
		let dun1 = this.DataList[key][2].cardList;

		let cardType3 = this.DataList[key][0].cardType;
		let cardType2 = this.DataList[key][1].cardType;
		let cardType1 = this.DataList[key][2].cardType;
		this.LogicRank.SetDunEx("DUN3", dun3);
		this.LogicRank.SetDunEx("DUN2", dun2);
		this.LogicRank.SetDunEx("DUN1", dun1);
		this.GetAutoCardType("DUN1", cardType1);
		this.GetAutoCardType("DUN2", cardType2);
		this.GetAutoCardType("DUN3", cardType3);
		this.ShowAllPlayerAutoCard();
	},
	Click_card: function (btnName, clickNode) {
		console.log(btnName);
		clickNode.getChildByName("cardPrefab").getChildByName("bg_black").active = false;
		let reg = new RegExp("btn_", "g");
		if (btnName.indexOf("btn_") != -1) {
			var result = btnName.replace(reg, "");
			btnName = result;
		}
		let cardIdx = btnName.toString();

		if (clickNode.y == this.InitBtnCardPosY) {
			this.LogicRank.SetCardSelected(cardIdx);
			this.HuHuanPai();
		} else {
			this.LogicRank.DeleteCardSelected(cardIdx);
		}
	},
	HuHuanPai: function () {
		for (let key in this.clickDunDict) {
			if (this.clickDunDict[key][3]) {
				this.LogicRank.ClearOneCard(this.clickDunDict[key][0], this.clickDunDict[key][1]);
				this.LogicRank.AutoSetDun();
				this.reSortCards();
				this.disabledBtn();
			}
			this.clickDunDict[key][2].clickNum = 0;
			this.clickDunDict[key][2].children[0].y = 0;
			this.clickDunDict[key][3] = false;
		}
	},
	Click_SendRankList: function () {
		let bAllRanked = this.LogicRank.CheckAllRanked();
		if (bAllRanked) {
			this.LogicRank.SendRankList();
			// this.CloseForm();
		} else {
			app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("SSS_NOT_ALL_RANKED");
		}

	},

	Click_Dun: function (btnName, clickNode) {
		this.LogicRank.SetDun(btnName.toUpperCase());
	},

	//-----------2次确认框回调--------------
	OnConFirm: function (clickType, msgID, backArgList) {
		if (clickType != "Sure") {
			return
		}
		if ("MSG_NOTPAI" == msgID) {
			this.Click_btn_handLiPai();
		}
	},
	OnTest:function(){
		console.log('点击了测试按钮');
        let RoomMgr = app[app.subGameName.toUpperCase()+"RoomMgr"]();
        if(!RoomMgr) return;
		let roomID = RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
        if(!roomID) return
        this.SendChat(5, 999, roomID, "test",(msg)=>{
            console.log(msg)
            if(msg.code == "Success")
            {   
                let cards = JSON.parse(msg.msg)
                let FormManager = app[app.subGameName + "_FormManager"]();
                FormManager.ShowForm(app.subGameName + '_UIRoomTest', cards);
            }
        });
    },
	SendChat:function (type, quickID, roomID, content,success) {
		app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "Chat", 
        {"type":type, "quickID":quickID, "targetID":roomID, "content":content}, success);
	},
});
