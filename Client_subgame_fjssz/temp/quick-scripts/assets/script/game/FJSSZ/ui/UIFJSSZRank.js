(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/game/FJSSZ/ui/UIFJSSZRank.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c73beLTK7FFtrh/YGCYfSP0', 'UIFJSSZRank', __filename);
// script/game/FJSSZ/ui/UIFJSSZRank.js

"use strict";

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
		icon_quick: [cc.SpriteFrame]
	},

	OnCreateInit: function OnCreateInit() {
		this.ZorderLv = this.ZorderLv6;
		this.card = this.GetWndNode("handLiPai/card");
		var nodeDun = this.GetWndNode("handLiPai/nodeDun");
		for (var i = 0; i < 13; i++) {
			this["btnDun" + (i + 1)] = nodeDun.getChildByName("btnDun" + (i + 1));
			this["btnDun" + (i + 1)].isOneClick = false;
			this["btnDun" + (i + 1)].isTwoClick = false;
		}
		var autoNodeDun = this.GetWndNode("autoLiPai/bga_dun");
		for (var _i = 0; _i < 13; _i++) {
			this["autoBtnDun" + (_i + 1)] = autoNodeDun.getChildByName("btnDun" + (_i + 1));
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

		for (var idx = 1; idx <= 13; idx++) {
			var path1 = "";
			var node = null;
			var card = null;
			if (idx < 14) {
				var _path = "handLiPai/nodeDun/btnDun" + idx.toString();
				var _node = this.GetWndNode(_path);
				var _card = cc.instantiate(this.cardPrefab);
				_node.addChild(_card);

				var path2 = "autoLiPai/bga_dun/btnDun" + idx.toString();
				var node2 = this.GetWndNode(path2);
				var card2 = cc.instantiate(this.cardPrefab);
				card2.active = false;
				node2.addChild(card2);
			}

			path1 = "handLiPai/card/btn_" + idx.toString();
			node = this.GetWndNode(path1);
			card = cc.instantiate(this.cardPrefab);
			card.active = false;
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
	OnShow: function OnShow() {
		var room = this.RoomMgr.GetEnterRoom();
		var roomID = this.RoomMgr.GetEnterRoomID();
		this.clientPos = this.RoomPosMgr.GetClientPos();
		var self = this;
		app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".CFJSSZPlayerCardReadyInfo", {
			"roomID": roomID,
			"posIdx": this.clientPos
		}, function (success) {
			console.log("RANK OnShow", success);
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
		var node = this.node.getChildByName("clearList");
		node.active = false;
		var wangPaiNum = this.LogicGame.wangPaiNum;
		if (this.sign == 2) {
			node.active = true;
			node.getComponent(cc.Label).string = "软鬼" + "\n" /*+ "王牌数量：" + wangPaiNum*/;
		} else if (this.sign == 3) {
			if (wangPaiNum > 0) {
				node.active = true;
				node.getComponent(cc.Label).string = "软鬼" + "\n" + "王牌数量：" + wangPaiNum;
			}
		}
		this.node.opacity = 0;
		cc.tween(this.node).delay(0.15).to(0.01, { opacity: 255 }).start();
	},
	OnShowData: function OnShowData() {
		var room = this.RoomMgr.GetEnterRoom();
		var roomID = this.RoomMgr.GetEnterRoomID();
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
			btnDun13: "DUN3"
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
			btnDun13: 4
		};
		//手动理牌后手动换牌
		this.clickDunDict = {};
		for (var i = 0; i < 13; i++) {
			this["btnDun" + (i + 1)].clickNum = 0;
			this.clickDunDict["btnDun" + (i + 1)] = [];
			this.clickDunDict["btnDun" + (i + 1)].push(this.btnDunToDun["btnDun" + (i + 1)], this.btnDunToDunNum["btnDun" + (i + 1)], this["btnDun" + (i + 1)], false);
		}
		//自动理牌后手动换牌
		this.clickAutoDunDict = {};
		for (var _i2 = 0; _i2 < 13; _i2++) {
			this["autoBtnDun" + (_i2 + 1)].clickNum = 0;
			this.clickAutoDunDict["btnDun" + (_i2 + 1)] = [];
			this.clickAutoDunDict["btnDun" + (_i2 + 1)].push(this.btnDunToDun["btnDun" + (_i2 + 1)], this.btnDunToDunNum["btnDun" + (_i2 + 1)], this["autoBtnDun" + (_i2 + 1)], false);
		}
		this.handLiPai.active = true;
		this.autoLiPai.active = false;
		this.countDown = 0;
		this.allTime = 0;

		this.setStartTime = room.GetRoomSet().GetRoomSetProperty("setStartTime");
		this.setCurrentTime = room.GetRoomSet().GetRoomSetProperty("setCurrentTime");
		var totalTime = parseInt(parseInt(this.setCurrentTime - this.setStartTime) / 1000);
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
		var kexuanwanfa = room.GetRoomConfigByProperty("kexuanwanfa");
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
			this.lbh_count.getComponent(cc.Label).string = this.countDown.toString();
			this.spa_clock.getComponent(cc.ProgressBar).totalLength = this.countDown / this.allTime;
			this.lba_count.getComponent(cc.Label).string = this.countDown.toString();
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
		this.OnEventShow();
	},
	Event_ShowNoReady: function Event_ShowNoReady() {
		var room = this.RoomMgr.GetEnterRoom();
		var noReadyNum = room.GetRoomPosMgr().GetNoReadyNum();
		console.log("已理好牌的玩家 Event_ShowNoReady", noReadyNum);
		// this.lb_ren.string = noReadyNum;
	},
	InitCardPos: function InitCardPos() {
		this.ChooseCardAddOffY = 45;
		// this.InitBtnCardPosY = -30;
		this.InitBtnCardPosY = 0;
		this.cardSpcedX = 0; //卡牌间的距离
		this.fristCardX = 0;
		this.startIndex = -1;
		this.endIndex = -1;
		var touchSprite = this.GetWndNode("handLiPai/touchSprite");
		// touchSprite.on(cc.Node.EventType.TOUCH_START, this.OnTouch, this);	
		// touchSprite.on(cc.Node.EventType.TOUCH_END, this.OnTouch, this);

		touchSprite.on(cc.Node.EventType.TOUCH_START, this.OnTouchStart, this);
		touchSprite.on(cc.Node.EventType.TOUCH_MOVE, this.OnTouchMove, this);
		touchSprite.on(cc.Node.EventType.TOUCH_END, this.OnTouchEnd, this);
		touchSprite.on(cc.Node.EventType.TOUCH_CANCEL, this.OnTouchCancel, this);

		var lastX = -1;
		for (var card_index = 1; card_index <= this.cardCount; card_index++) {
			var btnNode = this.GetWndNode("handLiPai/card/btn_" + card_index);
			if (btnNode) {
				btnNode.isMoveEnter = false;
				if (1 == card_index) this.fristCardX = btnNode.x;
				if (2 == card_index) {
					this.cardSpcedX = btnNode.x - lastX;
					if (this.cardSpcedX < 0) this.cardSpcedX = -this.cardSpcedX;
				}
				lastX = btnNode.x;
			}
		}
	},

	OnTouchStart: function OnTouchStart(event) {
		var card = this.card;
		var moveX = event.target.convertToNodeSpaceAR(event.touch.getLocation()).x;
		//let downList = this.LogicRank.getDunListByType("DOWN");
		for (var i = 0; i < card.children.length; i++) {
			if (card.children[i].name.startsWith("btn")) {
				var minX = card.children[i].x - card.children[i].width / 2;
				var maxX = minX + this.cardSpcedX;
				if (moveX >= minX && moveX < maxX) {
					this.startIndex = i;
					card.children[i].getChildByName("cardPrefab").getChildByName("bg_black").active = true;
					break;
				}
			}
		}
	},

	OnTouchMove: function OnTouchMove(event) {
		var card = this.card;
		var moveX = event.target.convertToNodeSpaceAR(event.touch.getLocation()).x;
		//let downList = this.LogicRank.getDunListByType("DOWN");
		for (var i = 0; i < card.children.length; i++) {
			if (card.children[i].name.startsWith("btn")) {
				var minX = card.children[i].x - card.children[i].width / 2;
				var maxX = minX + this.cardSpcedX;
				if (moveX >= minX && moveX < maxX) {
					this.moveIndex = i;
					break;
				}
			}
		}
		if (this.startIndex > this.moveIndex) {
			//从右往左
			for (var _i3 = this.startIndex; _i3 >= this.moveIndex; _i3--) {
				if (card.children[_i3].name.startsWith("btn")) {
					card.children[_i3].getChildByName("cardPrefab").getChildByName("bg_black").active = true;
				}
			}
		} else {
			//从左往右
			for (var _i4 = this.startIndex; _i4 <= this.moveIndex; _i4++) {
				if (card.children[_i4].name.startsWith("btn")) {
					card.children[_i4].getChildByName("cardPrefab").getChildByName("bg_black").active = true;
				}
			}
		}
	},

	OnTouchEnd: function OnTouchEnd(event) {
		var card = this.card;
		var moveX = event.target.convertToNodeSpaceAR(event.touch.getLocation()).x;
		//let downList = this.LogicRank.getDunListByType("DOWN");
		for (var i = 0; i < card.children.length; i++) {
			if (card.children[i].name.startsWith("btn")) {
				card.children[i].getChildByName("cardPrefab").getChildByName("bg_black").active = false;
				if (isEnd) continue;
				var isEnd = false;
				var minX = card.children[i].x - card.children[i].width / 2;
				var maxX = minX + this.cardSpcedX;
				if (moveX >= minX && moveX < maxX) {
					this.endIndex = i;
					isEnd = true;
					//break;
				}
			}
		}

		for (var j = 0; j < card.children.length; j++) {
			if (this.startIndex > this.endIndex) {
				//右往左
				if (j <= this.startIndex && j >= this.endIndex && card.children[j].children[0].active) this.Click_card(card.children[j].name, card.children[j]);
			} else if (this.startIndex < this.endIndex) {
				//左往右
				if (j >= this.startIndex && j <= this.endIndex && card.children[j].children[0].active) this.Click_card(card.children[j].name, card.children[j]);
			} else {
				if (j == this.endIndex && card.children[j].children[0].active) {
					this.Click_card(card.children[j].name, card.children[j]);
					break;
				}
			}
		}
	},

	OnTouchCancel: function OnTouchCancel(event) {
		var card = this.card;
		for (var i = 0; i < card.children.length; i++) {
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

	OnReload: function OnReload() {
		console.log("OnReload");
	},
	//隐藏发送和取消按钮
	isBtnHide: function isBtnHide(show) {
		this.btnOK.active = show;
		// this.btnCancel.active = show;
		this.btnCancel.active = false;
	},

	//回合开始的初始化
	SetStartInit: function SetStartInit() {
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

	OnSetEnd: function OnSetEnd() {
		var room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			console.error("OnSetEnd not enter room");
			return;
		}
	},

	NoticeSpecial: function NoticeSpecial() {
		var setPosList = this.RoomSet.GetRoomSetProperty("setPosList");
		var special_btn = this.GetWndNode("handLiPai/special_btn"); //加载一行
		special_btn.removeAllChildren();
		for (var i = 0; i < setPosList.length; i++) {
			var setPos = setPosList[i];
			var posID = setPos["posID"];
			if (this.clientPos == posID) {
				var special = setPos["special"];
				if (JSON.stringify(special) != "{}") {
					var pathWnd1 = "handLiPai/special_btn/";
					var len = Object.keys(special).length;
					this.CreateSpecialTypeNode(len, special);
					for (var key in special) {
						var pathWnd = pathWnd1 + key;
						var specialNode = this.GetWndNode(pathWnd);
						this.SetWndProperty(pathWnd, "active", true);
						specialNode["specialData"] = special[key];
					}
				}
			}
		}
	},
	CreateSpecialTypeNode: function CreateSpecialTypeNode(len, special) {
		var _this = this;

		var special_btn = this.GetWndNode("handLiPai/special_btn"); //加载一行
		var cardType = {
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

		var _loop = function _loop(_key) {
			var cardNode = cc.instantiate(_this.prefab_specialtype);
			special_btn.addChild(cardNode);
			cardNode.children[0].getComponent(cc.Label).string = cardType[_key];
			cardNode.name = _key + "";
			_key = parseInt(_key);
			cardNode.active = true;
			cardNode.on("click", function () {
				console.log("cardNode.on(\"click\"", cardNode, cardNode["specialData"]);
				_this.LogicRank.SendRankList(cardNode["specialData"], _key);
			});
			key = _key;
		};

		for (var key in special) {
			_loop(key);
		}
	},
	ClearNodeSprite: function ClearNodeSprite() {
		for (var card_index = 1; card_index <= this.cardCount; card_index++) {
			var btnNode = this.GetWndNode("handLiPai/card/btn_" + card_index);
			if (!btnNode) {
				console.error("ClearNodeSprite not find:%s", btnNode);
				continue;
			}
			btnNode.active = false;
			btnNode.y = this.InitBtnCardPosY;
			var _cardNode = btnNode.getChildByName("cardPrefab");
			_cardNode.active = false;
			btnNode.zIndex = card_index;
		}

		//墩位
		for (var idx = 1; idx <= 13; idx++) {
			var _btnNode = this.GetWndNode("handLiPai/nodeDun/btnDun" + idx);
			if (!_btnNode) {
				console.error("ClearNodeSprite not find:%s", "btnDun" + idx);
				continue;
			}

			var _cardNode2 = _btnNode.getChildByName("cardPrefab");
			_cardNode2.active = 0;
		}
	},
	ClearAutoNodeSprite: function ClearAutoNodeSprite() {
		//墩位
		for (var idx = 1; idx <= 13; idx++) {
			var _cardNode3 = this.GetWndNode("autoLiPai/bga_dun/btnDun" + idx + "/cardPrefab");
			_cardNode3.active = false;
		}
	},

	TipBaiPai: function TipBaiPai() {
		var downList = this.LogicRank.getDunListByType("DOWN");
		if (downList.length < 13) {
			downList = this.SetPos.GetSetPosProperty("shouCard");
		}
		this.DataList = app[app.subGameName.toUpperCase() + "LogicGame"]().GetAllCardType(downList);
		var layout = this.GetWndNode("autoLiPai/select/quick/view/content");
		for (var i = 0; i < layout.children.length; i++) {
			var node = layout.children[i];
			node.getChildByName("img_auto").getComponent(cc.Sprite).spriteFrame = this.icon_quick[0];
			node.active = false;
		}
		if (this.DataList.length == 0) {
			this.WaitForConfirm("MSG_NOTPAI", [], [], this.ShareDefine.ConfirmOK);
		}
		for (var j = 0; j < this.DataList.length; j++) {
			var _node2 = layout.getChildByName("btn_quick" + (j + 1));
			if (this.DataList[j].length == 0) {
				_node2.active = false;
				continue;
			}
			_node2.active = true;
			var cardType1 = this.DataList[j][0].cardType;
			var cardType2 = this.DataList[j][1].cardType;
			var cardType3 = this.DataList[j][2].cardType;
			_node2.getChildByName("lb3").getComponent(cc.Label).string = this.cardType2Name(cardType1);
			_node2.getChildByName("lb2").getComponent(cc.Label).string = this.cardType2Name(cardType2);
			_node2.getChildByName("lb1").getComponent(cc.Label).string = this.cardType2Name(cardType3);
			if (0 == j) {
				_node2.getChildByName("img_auto").getComponent(cc.Sprite).spriteFrame = this.icon_quick[1];
				this.QuickSetAutoDun(j);
			}
		}
		this.quickScroll.scrollToLeft();
	},
	cardType2Name: function cardType2Name(cardType) {
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
	OnEventShow: function OnEventShow() {
		var self = this;
		var f = function f() {
			var totalTime = parseInt(parseInt(self.setCurrentTime - self.setStartTime) / 1000);
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
		};
		app[app.subGameName + "_NetManager"]().SendPack("base.CServerTime", {}, function (event) {
			self.setCurrentTime = event.serverTimeMsec;
			f();
		}, function (event) {
			self.setCurrentTime = self.setStartTime;
			f();
		});

		if (this.countDown <= 0 && this.lbh_count && cc.isValid(this.lbh_count)) {
			this.lbh_count.getComponent(cc.Label).string = "0";
			this.sph_clock.getComponent(cc.ProgressBar).totalLength = 0 / this.allTime;
			this.lba_count.getComponent(cc.Label).string = "0";
			this.spa_clock.getComponent(cc.ProgressBar).totalLength = 0 / this.allTime;
		}
	},

	CallEverySecond: function CallEverySecond() {
		this.countDown--;
		if (this.countDown <= 0) {
			this.unschedule(this.CallEverySecond);
			this.countDown = 0;
		}
		this.lbh_count.getComponent(cc.Label).string = this.countDown.toString();
		this.sph_clock.getComponent(cc.ProgressBar).totalLength = this.countDown / this.allTime;
		this.lba_count.getComponent(cc.Label).string = this.countDown.toString();
		this.spa_clock.getComponent(cc.ProgressBar).totalLength = this.countDown / this.allTime;
		if (this.countDown == 20) {
			if (this.ShareDefine.isCoinRoom) {
				app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('MSG_COUNT_NOTICE');
			}
		}
	},

	ShowAllPlayerCard: function ShowAllPlayerCard() {
		this.lb_cardType1.active = false;
		this.lb_cardType2.active = false;
		this.lb_cardType3.active = false;
		this.ClearNodeSprite();
		var downList = this.LogicRank.getDunListByType("DOWN");
		for (var index = 0; index < downList.length; index++) {
			var cardType = downList[index];
			var btnNode = this.GetWndNode("handLiPai/card/btn_" + (index + 1));
			if (!btnNode) {
				console.error("ShowAllPlayerCard not find:%s", btnNode);
				continue;
			}
			btnNode.active = true;
			//位置
			btnNode.y = this.InitBtnCardPosY;
			var bSelected = this.LogicRank.CheckSelected(cardType);
			if (bSelected) {
				btnNode.y += this.ChooseCardAddOffY;
			}
			this.ShowCard(cardType, btnNode.getChildByName("cardPrefab"));
		}

		//墩位
		for (var dunType = 1; dunType <= 3; dunType++) {
			var dunList = this.LogicRank.getDunListByType("DUN" + dunType);
			var dunStartIdx = 0;
			this.GetCardType("DUN" + dunType);
			if (2 == dunType) {
				dunStartIdx = 3;
			}
			if (3 == dunType) {
				dunStartIdx = 8;
			}
			for (var idx = 0; idx < dunList.length; idx++) {
				var dunIdx = dunStartIdx + idx + 1;
				var _btnNode2 = this.GetWndNode("handLiPai/nodeDun/btnDun" + dunIdx);
				if (!_btnNode2) {
					console.error("ShowAllPlayerCard not find:%s", "btnDun" + dunIdx);
					continue;
				}
				this.ShowCard(dunList[idx], _btnNode2.getChildByName("cardPrefab"));
			}
		}
		this.InitCardOpacity();
	},
	ShowAllPlayerAutoCard: function ShowAllPlayerAutoCard() {
		this.lb_cardType1.active = false;
		this.lb_cardType2.active = false;
		this.lb_cardType3.active = false;
		this.ClearAutoNodeSprite();

		//墩位
		for (var dunType = 1; dunType <= 3; dunType++) {
			var dunList = this.LogicRank.getDunListByType("DUN" + dunType);
			console.log("自动理牌换牌界面渲染手牌", dunList);
			var dunStartIdx = 0;
			// this.GetAutoCardType("DUN" + dunType);
			if (2 == dunType) {
				dunStartIdx = 3;
			}
			if (3 == dunType) {
				dunStartIdx = 8;
			}
			for (var idx = 0; idx < dunList.length; idx++) {
				var dunIdx = dunStartIdx + idx + 1;
				var btnNode = this.GetWndNode("autoLiPai/bga_dun/btnDun" + dunIdx);
				this.ShowCard(dunList[idx], btnNode.getChildByName("cardPrefab"));
			}
		}
		for (var i = 1; i <= 13; i++) {
			this.GetWndNode("autoLiPai/bga_dun/btnDun" + i.toString()).opacity = 255;
		}
	},
	InitCardOpacity: function InitCardOpacity() {
		//初始化透明度
		for (var i = 1; i <= 13; i++) {
			this.GetWndNode("handLiPai/nodeDun/btnDun" + i.toString()).opacity = 255;
		}
	},
	//发牌效果
	DealCardEffect: function DealCardEffect() {
		var self = this;
		var downList = this.LogicRank.getDunListByType("DOWN");
		console.log('downList', downList);
		for (var cardIdx = 1; cardIdx <= this.cardCount; cardIdx++) {
			var btnNode = this.GetWndNode("handLiPai/card/btn_" + cardIdx);
			if (!btnNode) {
				console.error("DealCardEffect not find:%s", btnNode);
				continue;
			}
			btnNode.active = 1;
			this.ShowCard(downList[cardIdx - 1], btnNode.getChildByName("cardPrefab"));
			btnNode.active = true;
		}
	},

	ShowCard: function ShowCard(cardType, btnNode) {
		var newPoker = this.PokerCard.SubCardValue(cardType);
		this.PokerCard.GetPokeCard(newPoker, btnNode);

		btnNode.getChildByName("poker_back").active = false;
		btnNode.active = true;
		cc.tween(btnNode).delay(0.1).to(0.01, { opacity: 255 }).start();
		var room = this.RoomMgr.GetEnterRoom();
		if (!room) return;

		var child = btnNode.getChildByName("icon_mapai");
		var kexuanwanfa = room.GetRoomConfigByProperty("kexuanwanfa");
		if (kexuanwanfa.length > 0) {
			if (kexuanwanfa.indexOf(0) > -1) {
				var maPaiValue = room.GetRoomSet().GetRoomSetProperty("mapai");
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
	disabledBtn: function disabledBtn() {
		var shouCardList = this.LogicRank.getDunListByType("DOWN");
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
			var isShowDuiZiBtn = app[app.subGameName.toUpperCase() + "LogicGame"]().IsShowDuiZiBtn(shouCardList);
			var liangdui = app[app.subGameName.toUpperCase() + "LogicGame"]().GetLiangDuiEX(shouCardList);
			var isShowSanTiaoBtn = app[app.subGameName.toUpperCase() + "LogicGame"]().IsShowSanTiaoBtn(shouCardList);
			var shunzi = app[app.subGameName.toUpperCase() + "LogicGame"]().GetShunzi(shouCardList);
			var hulu = app[app.subGameName.toUpperCase() + "LogicGame"]().GetHulu(shouCardList);
			var tonghua = app[app.subGameName.toUpperCase() + "LogicGame"]().GetTonghua(shouCardList);
			var zhadan = app[app.subGameName.toUpperCase() + "LogicGame"]().GetZhaDan(shouCardList);
			var tonghuashun = app[app.subGameName.toUpperCase() + "LogicGame"]().GetTongHuaShunEx(shouCardList);
			var wutong = app[app.subGameName.toUpperCase() + "LogicGame"]().GetWuTong(shouCardList);
			var liutong = app[app.subGameName.toUpperCase() + "LogicGame"]().GetLiuTongs(shouCardList);
			var wugui = app[app.subGameName.toUpperCase() + "LogicGame"]().GetWuGuis(shouCardList);

			//显示对子按钮
			this.check_duizi.active = isShowDuiZiBtn;
			this.no_duizi.active = !isShowDuiZiBtn;

			if (!liangdui.length) {
				this.check_liangdui.active = false;
				this.no_liangdui.active = true;
			} else {
				if (liangdui.length == 2) {
					var bRet = this.LogicGame.CheckSameValue(liangdui[0], liangdui[1]);
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

	reSortCards: function reSortCards() {
		var pokers = this.LogicRank.getDunListByType('DOWN');
		var sortCards = this.LogicGame.GetSortCards(pokers);
		if (sortCards && sortCards.length) {
			this.LogicRank.pushDownCards(sortCards);
		}
	},
	GetCardType: function GetCardType(dun) {
		var len = this.LogicRank.GetDunLength(dun);
		var typNode = {};
		var bShow = false;
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
			var dunList = this.LogicRank.getDunListByType(dun);
			var type = this.LogicGame.CheckCardType(dunList);
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
	GetAutoCardType: function GetAutoCardType(dun, cardType) {
		var len = this.LogicRank.GetDunLength(dun);
		var typNode = {};
		var bShow = false;
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
	SetChangeCard: function SetChangeCard(dun, index) {
		if (this.ChangeDun) {
			if (this.ChangeDun == dun && this.ChangeCard == index) {
				return;
			}
			var card1 = this.LogicRank.GetDunCard(this.ChangeDun, this.ChangeCard);
			var card2 = this.LogicRank.GetDunCard(dun, index);
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
	ChongZhiPai: function ChongZhiPai(dunStr, idx, btnDunName, clickNum) {
		var clickDunDict = this.clickDunDict;
		if (this.autoLiPai.active) {
			clickDunDict = this.clickAutoDunDict;
		}
		for (var _key2 in clickDunDict) {
			if (_key2 == btnDunName) {
				clickDunDict[btnDunName][0] = dunStr;
				clickDunDict[btnDunName][1] = idx;
				clickDunDict[btnDunName][2].clickNum = clickNum;
				clickDunDict[btnDunName][3] = true;
			} else {
				clickDunDict[_key2][2].clickNum = 0;
				clickDunDict[_key2][2].children[0].y = 0;
				clickDunDict[_key2][3] = false;
			}
		}
	},
	PaiDunHuHuanPai: function PaiDunHuHuanPai(btnName) {
		//牌墩上的牌互换,牌墩上的牌已放满检查是否倒水提示
		var clickDunDict = this.clickDunDict;
		if (this.autoLiPai.active) {
			clickDunDict = this.clickAutoDunDict;
		}
		for (var _key3 in clickDunDict) {
			if (clickDunDict[_key3][3]) {
				if (_key3 == btnName) {
					break;
				}

				console.log(clickDunDict);
				var dunStr = this.btnDunToDun[_key3];
				var idx = clickDunDict[_key3][1];
				var dun = this.LogicRank.getDunListByType(dunStr);
				var dunCard = this.LogicRank.GetDunCard(dunStr, idx);
				var benDunStr = this.btnDunToDun[btnName];
				var benIdx = clickDunDict[btnName][1];
				var benDun = this.LogicRank.getDunListByType(benDunStr);
				var benDunCard = this.LogicRank.GetDunCard(benDunStr, benIdx);
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
	AutoPaiDunHuHuanPai: function AutoPaiDunHuHuanPai(btnName) {
		//牌墩上的牌互换,牌墩上的牌已放满检查是否倒水提示
		var clickDunDict = this.clickAutoDunDict;
		for (var _key4 in clickDunDict) {
			if (clickDunDict[_key4][3]) {
				if (_key4 == btnName) {
					break;
				}

				console.log(clickDunDict);
				var dunStr = this.btnDunToDun[_key4];
				var idx = clickDunDict[_key4][1];
				var dun = this.LogicRank.getDunListByType(dunStr);
				var hdun = this.ComTool.DeepCopy(dun);
				var dunCard = this.LogicRank.GetDunCard(dunStr, idx);
				var benDunStr = this.btnDunToDun[btnName];
				var benIdx = clickDunDict[btnName][1];
				var benDun = this.LogicRank.getDunListByType(benDunStr);
				var hbenDun = this.ComTool.DeepCopy(benDun);
				var benDunCard = this.LogicRank.GetDunCard(benDunStr, benIdx);
				if (dunCard) {
					if (benDunCard) {
						dun.splice(idx, 1);
						dun.splice(idx, 0, benDunCard);
						benDun.splice(benIdx, 1);
						benDun.splice(benIdx, 0, dunCard);
						console.log(dun, benDun);
						var isDaoShui = this.CheckAutoHuanPaiDaoShui();
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
						var _isDaoShui = this.CheckAutoHuanPaiDaoShui();
						if (!_isDaoShui) {
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
	GetAutoCardTypeByHuHuan: function GetAutoCardTypeByHuHuan(dunStr, dun, benDunStr, benDun) {
		var dunType = this.LogicGame.CheckCardType(dun);
		var benDunType = this.LogicGame.CheckCardType(benDun);
		this.GetAutoCardType(dunStr, dunType);
		this.GetAutoCardType(benDunStr, benDunType);
	},
	CheckAutoHuanPaiDaoShui: function CheckAutoHuanPaiDaoShui() {
		var isDaoShui = false;
		console.log(" ddddMSG_CARD_DAOSHUI");
		if (this.LogicRank.CheckDaoShui("DUN3") == 0) {
			this.SysNotifyManager.ShowSysMsg("MSG_CARD_DAOSHUI");
			isDaoShui = true;
		}
		if (this.LogicRank.CheckDaoShui('DUN2') == 0) {
			this.SysNotifyManager.ShowSysMsg("MSG_CARD_DAOSHUI");
			isDaoShui = true;
		}
		if (this.LogicRank.CheckDaoShui('DUN1') == 0) {
			this.SysNotifyManager.ShowSysMsg("MSG_CARD_DAOSHUI");
			isDaoShui = true;
		}
		return isDaoShui;
	},
	ClearAutoCardDown: function ClearAutoCardDown() {
		for (var _key5 in this.clickAutoDunDict) {
			this.clickAutoDunDict[_key5][2].clickNum = 0;
			this.clickAutoDunDict[_key5][2].children[0].y = 0;
			this.clickAutoDunDict[_key5][3] = false;
		}
	},
	//---------点击触发---------------------
	OnClick: function OnClick(btnName, btnNode) {
		// console.log("btnName", btnName);
		if (btnName.startsWith("btn_quick")) {
			var layout = this.GetWndNode("autoLiPai/select/quick/view/content");
			for (var i = 0; i < layout.children.length; i++) {
				var node = layout.children[i];
				node.getChildByName("img_auto").getComponent(cc.Sprite).spriteFrame = this.icon_quick[0];
			}
			var quickID = btnName.replace("btn_quick", "");
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
				var isOk = this.PaiDunHuHuanPai(btnName);
				if (isOk) {
					return;
				}

				btnNode.clickNum++;
				this.ChongZhiPai("DUN1", 0, btnName, btnNode.clickNum);
				var haveCard = btnNode.children[0].active;
				var selectedLength = this.LogicRank.GetDunLength("SELECTED");
				//没有选择牌并且牌墩上没牌就直接上牌
				if (haveCard) {
					//牌墩上有牌手牌有选择牌就互换
					btnNode.children[0].y = 20;
					if (selectedLength == 1) {
						//进行牌的更换
						this.LogicRank.ClearOneCard("DUN1", 0); //
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
				var _isOk = this.PaiDunHuHuanPai(btnName);
				if (_isOk) {
					return;
				}

				btnNode.clickNum++;
				this.ChongZhiPai("DUN1", 1, btnName, btnNode.clickNum);
				var _haveCard = btnNode.children[0].active;
				var _selectedLength = this.LogicRank.GetDunLength("SELECTED");
				//没有选择牌并且牌墩上没牌就直接上牌
				if (_haveCard) {
					//牌墩上有牌手牌有选择牌就互换
					btnNode.children[0].y = 20;
					if (_selectedLength == 1) {
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
					if (_selectedLength > 0) {
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
				var _isOk2 = this.PaiDunHuHuanPai(btnName);
				if (_isOk2) {
					return;
				}

				btnNode.clickNum++;
				this.ChongZhiPai("DUN1", 2, btnName, btnNode.clickNum);
				var _haveCard2 = btnNode.children[0].active;
				var _selectedLength2 = this.LogicRank.GetDunLength("SELECTED");
				//没有选择牌并且牌墩上没牌就直接上牌
				if (_haveCard2) {
					//牌墩上有牌手牌有选择牌就互换
					btnNode.children[0].y = 20;
					if (_selectedLength2 == 1) {
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
					if (_selectedLength2 > 0) {
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
				var _isOk3 = this.PaiDunHuHuanPai(btnName);
				if (_isOk3) {
					return;
				}

				btnNode.clickNum++;
				this.ChongZhiPai("DUN2", 0, btnName, btnNode.clickNum);
				var _haveCard3 = btnNode.children[0].active;
				var _selectedLength3 = this.LogicRank.GetDunLength("SELECTED");
				//没有选择牌并且牌墩上没牌就直接上牌
				if (_haveCard3) {
					//牌墩上有牌手牌有选择牌就互换
					btnNode.children[0].y = 20;
					if (_selectedLength3 == 1) {
						//进行牌的更换
						this.LogicRank.ClearOneCard("DUN2", 0); //
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
					if (_selectedLength3 > 0) {
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
				var _isOk4 = this.PaiDunHuHuanPai(btnName);
				if (_isOk4) {
					return;
				}

				btnNode.clickNum++;
				this.ChongZhiPai("DUN2", 1, btnName, btnNode.clickNum);
				var _haveCard4 = btnNode.children[0].active;
				var _selectedLength4 = this.LogicRank.GetDunLength("SELECTED");
				//没有选择牌并且牌墩上没牌就直接上牌
				if (_haveCard4) {
					//牌墩上有牌手牌有选择牌就互换
					btnNode.children[0].y = 20;
					if (_selectedLength4 == 1) {
						//进行牌的更换
						this.LogicRank.ClearOneCard("DUN2", 1); //
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
					if (_selectedLength4 > 0) {
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
				var _isOk5 = this.PaiDunHuHuanPai(btnName);
				if (_isOk5) {
					return;
				}

				btnNode.clickNum++;
				this.ChongZhiPai("DUN2", 2, btnName, btnNode.clickNum);
				var _haveCard5 = btnNode.children[0].active;
				var _selectedLength5 = this.LogicRank.GetDunLength("SELECTED");
				//没有选择牌并且牌墩上没牌就直接上牌
				if (_haveCard5) {
					//牌墩上有牌手牌有选择牌就互换
					btnNode.children[0].y = 20;
					if (_selectedLength5 == 1) {
						//进行牌的更换
						this.LogicRank.ClearOneCard("DUN2", 2); //
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
					if (_selectedLength5 > 0) {
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
				var _isOk6 = this.PaiDunHuHuanPai(btnName);
				if (_isOk6) {
					return;
				}

				btnNode.clickNum++;
				this.ChongZhiPai("DUN2", 3, btnName, btnNode.clickNum);
				var _haveCard6 = btnNode.children[0].active;
				var _selectedLength6 = this.LogicRank.GetDunLength("SELECTED");
				//没有选择牌并且牌墩上没牌就直接上牌
				if (_haveCard6) {
					//牌墩上有牌手牌有选择牌就互换
					btnNode.children[0].y = 20;
					if (_selectedLength6 == 1) {
						//进行牌的更换
						this.LogicRank.ClearOneCard("DUN2", 3); //
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
					if (_selectedLength6 > 0) {
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
				var _isOk7 = this.PaiDunHuHuanPai(btnName);
				if (_isOk7) {
					return;
				}

				btnNode.clickNum++;
				this.ChongZhiPai("DUN2", 4, btnName, btnNode.clickNum);
				var _haveCard7 = btnNode.children[0].active;
				var _selectedLength7 = this.LogicRank.GetDunLength("SELECTED");
				//没有选择牌并且牌墩上没牌就直接上牌
				if (_haveCard7) {
					//牌墩上有牌手牌有选择牌就互换
					btnNode.children[0].y = 20;
					if (_selectedLength7 == 1) {
						//进行牌的更换
						this.LogicRank.ClearOneCard("DUN2", 4); //
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
					if (_selectedLength7 > 0) {
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
				for (var _key6 in this.clickDunDict) {
					if (this.clickDunDict[_key6][3]) {
						console.log(this.clickDunDict);
						if (_key6 == btnName) {
							break;
						}
					}
				}
				var _isOk8 = this.PaiDunHuHuanPai(btnName);
				if (_isOk8) {
					return;
				}

				btnNode.clickNum++;
				this.ChongZhiPai("DUN3", 0, btnName, btnNode.clickNum);
				var _haveCard8 = btnNode.children[0].active;
				var _selectedLength8 = this.LogicRank.GetDunLength("SELECTED");
				//没有选择牌并且牌墩上没牌就直接上牌
				if (_haveCard8) {
					//牌墩上有牌手牌有选择牌就互换
					btnNode.children[0].y = 20;
					if (_selectedLength8 == 1) {
						//进行牌的更换
						this.LogicRank.ClearOneCard("DUN3", 0); //
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
					if (_selectedLength8 > 0) {
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
				var _isOk9 = this.PaiDunHuHuanPai(btnName);
				if (_isOk9) {
					return;
				}

				btnNode.clickNum++;
				this.ChongZhiPai("DUN3", 1, btnName, btnNode.clickNum);
				var _haveCard9 = btnNode.children[0].active;
				var _selectedLength9 = this.LogicRank.GetDunLength("SELECTED");
				//没有选择牌并且牌墩上没牌就直接上牌
				if (_haveCard9) {
					//牌墩上有牌手牌有选择牌就互换
					btnNode.children[0].y = 20;
					if (_selectedLength9 == 1) {
						//进行牌的更换
						this.LogicRank.ClearOneCard("DUN3", 1); //
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
					if (_selectedLength9 > 0) {
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
				var _isOk10 = this.PaiDunHuHuanPai(btnName);
				if (_isOk10) {
					return;
				}

				btnNode.clickNum++;
				this.ChongZhiPai("DUN3", 2, btnName, btnNode.clickNum);
				var _haveCard10 = btnNode.children[0].active;
				var _selectedLength10 = this.LogicRank.GetDunLength("SELECTED");
				//没有选择牌并且牌墩上没牌就直接上牌
				if (_haveCard10) {
					//牌墩上有牌手牌有选择牌就互换
					btnNode.children[0].y = 20;
					if (_selectedLength10 == 1) {
						//进行牌的更换
						this.LogicRank.ClearOneCard("DUN3", 2); //
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
					if (_selectedLength10 > 0) {
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
				var _isOk11 = this.PaiDunHuHuanPai(btnName);
				if (_isOk11) {
					return;
				}

				btnNode.clickNum++;
				this.ChongZhiPai("DUN3", 3, btnName, btnNode.clickNum);
				var _haveCard11 = btnNode.children[0].active;
				var _selectedLength11 = this.LogicRank.GetDunLength("SELECTED");
				//没有选择牌并且牌墩上没牌就直接上牌
				if (_haveCard11) {
					//牌墩上有牌手牌有选择牌就互换
					btnNode.children[0].y = 20;
					if (_selectedLength11 == 1) {
						//进行牌的更换
						this.LogicRank.ClearOneCard("DUN3", 3); //
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
					if (_selectedLength11 > 0) {
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
				var _isOk12 = this.PaiDunHuHuanPai(btnName);
				if (_isOk12) {
					return;
				}

				btnNode.clickNum++;
				this.ChongZhiPai("DUN3", 4, btnName, btnNode.clickNum);
				var _haveCard12 = btnNode.children[0].active;
				var _selectedLength12 = this.LogicRank.GetDunLength("SELECTED");
				//没有选择牌并且牌墩上没牌就直接上牌
				if (_haveCard12) {
					//牌墩上有牌手牌有选择牌就互换
					btnNode.children[0].y = 20;
					if (_selectedLength12 == 1) {
						//进行牌的更换
						this.LogicRank.ClearOneCard("DUN3", 4); //
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
					if (_selectedLength12 > 0) {
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
				var _layout = this.GetWndNode("autoLiPai/select/quick/view/content");
				for (var _i5 = 0; _i5 < _layout.children.length; _i5++) {
					var _node3 = _layout.children[_i5];
					_node3.getChildByName("img_auto").getComponent(cc.Sprite).spriteFrame = this.icon_quick[0];
				}
				var _isOk13 = this.AutoPaiDunHuHuanPai(btnName);
				if (_isOk13) {
					return;
				} else if (_isOk13 == false) {
					return;
				}
				btnNode.clickNum++;
				var dunName = this.btnDunToDun[btnName];
				var dunIdx = this.btnDunToDunNum[btnName];
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
	Click_btn_handLiPai: function Click_btn_handLiPai() {
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
	QuickSetDun: function QuickSetDun(quickID) {
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
		var key = parseInt(quickID) - 1;
		if (key < 0) {
			key = 0;
		}
		var dun3 = this.DataList[key][0].cardList;
		var dun2 = this.DataList[key][1].cardList;
		var dun1 = this.DataList[key][2].cardList;
		this.LogicRank.SetDunEx('DUN3', dun3);
		this.LogicRank.SetDunEx('DUN2', dun2);
		this.LogicRank.SetDunEx('DUN1', dun1);
		this.ShowAllPlayerCard();
		this.disabledBtn();
	},
	QuickSetAutoDun: function QuickSetAutoDun(quickID) {
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
		var key = parseInt(quickID) - 1;
		if (key < 0) {
			key = 0;
		}
		var dun3 = this.DataList[key][0].cardList;
		var dun2 = this.DataList[key][1].cardList;
		var dun1 = this.DataList[key][2].cardList;

		var cardType3 = this.DataList[key][0].cardType;
		var cardType2 = this.DataList[key][1].cardType;
		var cardType1 = this.DataList[key][2].cardType;
		this.LogicRank.SetDunEx("DUN3", dun3);
		this.LogicRank.SetDunEx("DUN2", dun2);
		this.LogicRank.SetDunEx("DUN1", dun1);
		this.GetAutoCardType("DUN1", cardType1);
		this.GetAutoCardType("DUN2", cardType2);
		this.GetAutoCardType("DUN3", cardType3);
		this.ShowAllPlayerAutoCard();
	},
	Click_card: function Click_card(btnName, clickNode) {
		console.log(btnName);
		clickNode.getChildByName("cardPrefab").getChildByName("bg_black").active = false;
		var reg = new RegExp("btn_", "g");
		if (btnName.indexOf("btn_") != -1) {
			var result = btnName.replace(reg, "");
			btnName = result;
		}
		var cardIdx = btnName.toString();

		if (clickNode.y == this.InitBtnCardPosY) {
			this.LogicRank.SetCardSelected(cardIdx);
			this.HuHuanPai();
		} else {
			this.LogicRank.DeleteCardSelected(cardIdx);
		}
	},
	HuHuanPai: function HuHuanPai() {
		for (var _key7 in this.clickDunDict) {
			if (this.clickDunDict[_key7][3]) {
				this.LogicRank.ClearOneCard(this.clickDunDict[_key7][0], this.clickDunDict[_key7][1]);
				this.LogicRank.AutoSetDun();
				this.reSortCards();
				this.disabledBtn();
			}
			this.clickDunDict[_key7][2].clickNum = 0;
			this.clickDunDict[_key7][2].children[0].y = 0;
			this.clickDunDict[_key7][3] = false;
		}
	},
	Click_SendRankList: function Click_SendRankList() {
		var bAllRanked = this.LogicRank.CheckAllRanked();
		if (bAllRanked) {
			this.LogicRank.SendRankList();
			// this.CloseForm();
		} else {
			app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("SSS_NOT_ALL_RANKED");
		}
	},

	Click_Dun: function Click_Dun(btnName, clickNode) {
		this.LogicRank.SetDun(btnName.toUpperCase());
	},

	//-----------2次确认框回调--------------
	OnConFirm: function OnConFirm(clickType, msgID, backArgList) {
		if (clickType != "Sure") {
			return;
		}
		if ("MSG_NOTPAI" == msgID) {
			this.Click_btn_handLiPai();
		}
	},
	OnTest: function OnTest() {
		console.log('点击了测试按钮');
		var RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
		if (!RoomMgr) return;
		var roomID = RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
		if (!roomID) return;
		this.SendChat(5, 999, roomID, "test", function (msg) {
			console.log(msg);
			if (msg.code == "Success") {
				var cards = JSON.parse(msg.msg);
				var FormManager = app[app.subGameName + "_FormManager"]();
				FormManager.ShowForm(app.subGameName + '_UIRoomTest', cards);
			}
		});
	},
	SendChat: function SendChat(type, quickID, roomID, content, success) {
		app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "Chat", { "type": type, "quickID": quickID, "targetID": roomID, "content": content }, success);
	}
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=UIFJSSZRank.js.map
        