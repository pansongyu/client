var app = require("fjssz_app");
cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {
		cardEffectPrefab: cc.Prefab,
		dunCardsPrefab: cc.Prefab,
		beiShuPrefab: cc.Prefab,

		hole_img: cc.SpriteFrame,
		headPrefab: cc.Prefab,
		icon_mapai: cc.SpriteFrame,
		sp_playState: [cc.SpriteFrame],//0,抢庄 1，押注 2，比牌 3,开始比牌

		giftPrefabs: [cc.Prefab]
	},

	OnCreateInit: function () {
		this.ZorderLv = this.ZorderLv6;
		this.btn_ready = this.node.getChildByName("btn_ready");
		this.btn_goon = this.node.getChildByName("btn_goon");
		this.btn_cancel = this.node.getChildByName("btn_cancel");
		this.btn_go = this.node.getChildByName("btn_go");
		this.cardTypeBtn = this.node.getChildByName("cardTypeBtn");
		this.curBg = this.node.getChildByName("bg");
		this.fireAnimation = this.node.getChildByName("openFire");
		this.fourAnimation = this.node.getChildByName("fourBag");
		this.startAnimation = this.node.getChildByName("start_ani");
		this.vsAnimation = this.node.getChildByName("vs_ani");
		this.xpAnimation = this.node.getChildByName("xipai");
		this.sp_faPai = this.node.getChildByName("sp_faPai");
		this.sp_state = this.node.getChildByName("sp_playState");
		this.maPai = this.node.getChildByName("maPai");
		this.bg_BeiShu = this.node.getChildByName("bg_Multiple");
		this.bg_tips = this.node.getChildByName("bg_tips");
		this.bankerList = this.node.getChildByName("bankerList");
		this.addDouble = this.node.getChildByName("addDouble");
		this.btn_color = this.node.getChildByName("btn_color");
		this.btn_size = this.node.getChildByName("btn_size");
		this.roomInfo = this.node.getChildByName("roomInfo");
		this.giftNode = this.node.getChildByName("giftNode");
		this.btn_voice = this.node.getChildByName("btn_voice");

		app.subGameName = app["subGameName"];
		this.Room = app[app.subGameName.toUpperCase() + "Room"]();
		this.RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
		this.RoomSet = app[app.subGameName.toUpperCase() + "RoomSet"]();
		this.RoomPosMgr = app[app.subGameName.toUpperCase() + "RoomPosMgr"]();
		this.LogicGame = app["FJSSZLogicGame"]();
		this.LogicRank = app["FJSSZLogicRank"]();
		this.HeroManager = app[app.subGameName + "_HeroManager"]();
		this.SceneManager = app[app.subGameName + "_SceneManager"]();
		this.UtilsWord = app[app.subGameName + "_UtilsWord"]();
		this.PokerCard = app[app.subGameName + "_PokerCard"]();
		app.playuissz = this

		this.isFirstEnter = true;
		//初始化状态  10000+5000
		this.DealCard_InitState = 0;
		//拿牌3次每次2蹲
		this.DealCard_GetCardState = 1;
		//摸牌一人一张
		this.DealCard_MoCardState = 2;
		//本家整理牌
		this.DealCard_AlignCardState = 3;
		this.dealCardState = this.DealCard_InitState;
		this.targetPos = 0;

		//公共消息
		this.RegEvent(app.subGameName.toUpperCase() + "_PosContinueGame", this.Event_PosContinueGame, this);//继续
		this.RegEvent(app.subGameName.toUpperCase() + "_DissolveRoom", this.Event_DissolveRoom, this);//解散房间
		this.RegEvent(app.subGameName.toUpperCase() + "_StartVoteDissolve", this.Event_StartVoteDissolve, this);//发起房间结算投票
		this.RegEvent(app.subGameName.toUpperCase() + "_ChangePlayerNum", this.Event_ChangePlayerNum, this);//发起房间修改人数
		this.RegEvent(app.subGameName.toUpperCase() + "_PosReadyChg", this.Event_PosReadyChg, this);//玩家准备
		this.RegEvent(app.subGameName.toUpperCase() + "_PosLeave", this.Event_PosLeave, this);//玩家离开
		this.RegEvent(app.subGameName.toUpperCase() + "_PosUpdate", this.Event_PosUpdate, this);//玩家更新
		this.RegEvent(app.subGameName.toUpperCase() + "_AllPosUpdate", this.Event_AllPosUpdate, this);

		//游戏消息
		this.RegEvent(app.subGameName.toUpperCase() + "SetStart", this.Event_SetStart, this);//游戏开始
		this.RegEvent(app.subGameName.toUpperCase() + "SetEnd", this.Event_SetEnd, this);//游戏结束
		this.RegEvent("ChangeStatus", this.Event_ChangeStatus, this);
		this.RegEvent("RankingResult", this.Event_RankingResult, this);//游戏结束
		this.RegEvent(app.subGameName.toUpperCase() + "_EVT_Card_Ready", this.Event_Card_Read);//牌理好
		this.RegEvent("RoomEnd", this.Event_RoomEnd, this);//房间结束
		this.RegEvent("SPlayer_Trusteeship", this.OnPack_AutoStart, this);//自己托管
		this.RegEvent("ChatMessage", this.Event_ChatMessage);//常用聊天语
		this.RegEvent(app.subGameName.toUpperCase() + "_BeiShu", this.Event_Beishu, this);
		this.RegEvent(app.subGameName.toUpperCase() + "_YaZhuBeiShu", this.Event_YaZhuBeiShu, this);
		this.RegEvent(app.subGameName.toUpperCase() + "_ZJBeiShu", this.Event_ZJBeishu, this);
		this.RegEvent(app.subGameName.toUpperCase() + "_QiangZhuangBeiShu", this.Event_QiangZhuangBeiShu, this);
		// this.RegEvent(app.subGameName.toUpperCase() + "_UIAutoPlay", this.Event_UIAutoPlay, this);
		//竞技点不足时通知
		this.RegEvent("SportsPointEnough", this.Event_SportsPointEnough, this);
		this.RegEvent("SportsPointNotEnough", this.Event_SportsPointNotEnough, this);
		this.RegEvent("CodeError", this.Event_CodeError, this);

		this.RegEvent('GameGift', this.Event_GameGift);
		cc.game.on(cc.game.EVENT_SHOW, this.OnEventShow.bind(this));
		cc.game.on(cc.game.EVENT_HIDE, this.OnEventHide.bind(this));
		this.btn_voice.on("touchstart", this.Event_TouchStart, this);
		this.btn_voice.on("touchend", this.Event_TouchEnd, this);
		this.btn_voice.on("touchcancel", this.Event_TouchEnd, this);

		this.fireAnimation.getComponent(sp.Skeleton).setCompleteListener(this.onFireFinished.bind(this));
		this.fourAnimation.getComponent(sp.Skeleton).setCompleteListener(this.onFourFinished.bind(this));
		this.startAnimation.getComponent(sp.Skeleton).setCompleteListener(this.onStartFinished.bind(this));
		this.vsAnimation.getComponent(sp.Skeleton).setCompleteListener(this.onVsFinished.bind(this));
		this.xpAnimation.getComponent(sp.Skeleton).setCompleteListener(this.onXiPaiFinished.bind(this));

		this.signString = ["硬鬼", "软鬼", "软鬼"];
		this.Type = {//CardType
			0: "乌隆",
			1: "对子",
			2: "两对",
			3: "三条",
			4: "充扎",
			5: "爽枉充投",
			6: "叁贵",
			7: "顺子",
			8: "同花",
			9: "同花",
			10: "同花",
			11: "葫芦",
			12: "铁支",
			13: "同花顺",
			14: "五同",
			15: "六同",
			16: "五鬼",

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
		this.Left = [false, true, true, false, true, true, true, false];
		this.ChangeBg()
		this.AddHeadPrefab();
	},
	ChangeBg : function(){
		let is3DShow = this.LocalDataManager.GetConfigProperty("SysSetting", app.subGameName + "_is3DShow");
		if (is3DShow) {
			this.node.getChildByName("bg").active = false
			this.node.getChildByName("bg1").active = true
		}
		else {
			this.node.getChildByName("bg1").active = false
			this.node.getChildByName("bg").active = true
		}
	},
	OnShow: function () {
		if (!cc.isValid(this.node)) {
			return
		}
		this.node.getChildByName("tip_exit_node").active = false;
		//确保该玩家还在该房间内，否则强制退出房间
		let roomID = this.RoomMgr.GetEnterRoomID();
		app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "GetRoomID", {}, function (event) {
			if (event.roomID <= 0 || event.roomID != roomID) {
				app[app.subGameName + "Client"].ExitGame();
			}
		}, function (error) {
			app[app.subGameName + "Client"].ExitGame();
			console.log(error);
		});
		let is3DShow = this.LocalDataManager.GetConfigProperty("SysSetting", app.subGameName + "_is3DShow");
		if (is3DShow == 0) {
			// this.FormManager.ShowForm("game/" + app.subGameName.toUpperCase() + "/UI" + app.subGameName.toUpperCase() + "LSPlay");
			// this.CloseForm();
			// return;
		}

		this.SceneManager.PlayMusic("17RoomWaitStart");
		this.unscheduleAllCallbacks();
		this.CheckUpdateNotice();
		this.SceneManager.PlayMusic("gameBackMusic");
		this.playerMinNum = this.Room.GetRoomConfigByProperty("playerMinNum");
		this.playerNum = this.Room.GetRoomConfigByProperty("playerNum");
		this.clientPos = parseInt(this.RoomPosMgr.GetClientPos());
		this.unionId = this.Room.GetRoomConfigByProperty("unionId");
		this.moshi = this.Room.GetRoomConfigByProperty("moshi");
		this.sign = this.Room.GetRoomConfigByProperty("sign");
		this.wangpai = this.Room.GetRoomConfigByProperty("wangpai");
		this.jiesan = this.Room.GetRoomConfigByProperty("jiesan");
		this.AddHead();
		this.addCard();
		this.HideAll();
		this.RefreshRoomShow();
		this.LogicGame.SetSign(this.sign, this.wangpai);
		this.QZposList = [];
		this.JZposList = [];
		let room = this.RoomMgr.GetEnterRoom();
		let state = this.RoomSet.GetRoomSetProperty("state");
		let roomState = room.GetRoomProperty("state");
		let disslove = room.GetRoomProperty("dissolve");
		let maPaiValue = this.RoomSet.GetRoomSetProperty("mapai");
		let backerPos = this.RoomSet.GetRoomSetProperty("backerPos");
		let beishu = this.RoomSet.GetRoomSetProperty("beishu");
		//@todo 是否允许跳过比牌
		this.kexuanwanfa = room.GetRoomConfigByProperty("kexuanwanfa");
		if (maPaiValue) {
			this.maPai.active = true;
			let child = this.maPai.getChildByName("card");
			this.ShowResultCard(maPaiValue, child);
		} else {
			this.maPai.active = false;
		}

		if (disslove.endSec != 0) {
			//如果有人发起解散消息
			this.FormManager.ShowForm(app.subGameName + "_UIMessage02");
		}
		let roomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
		let clientPos = parseInt(roomPosMgr.GetClientPos());
		this.UpdatePlayerScore();
		//显示房间信息
		this.ShowRoomData();
		this.FormManager.CloseForm("UIWaitForm");
		//如果有人托管，显示托管图标
		if (this.ShareDefine.RoomState_Init == roomState) {//房间初始状态
			console.log("房间初始状态时 游戏状态", state);
		} else if (this.ShareDefine.RoomState_Playing == roomState) {
			let isAuto = room.GetRoomDataInfo()["posList"][clientPos]["trusteeship"];
			if (isAuto) {
				app[app.subGameName + "_GameManager"]().SetAutoPlayIng(true);
				app[app.subGameName + "_FormManager"]().ShowForm(app.subGameName + "_UIAutoPlay");
			}
			this.btn_ready.active = false;
			this.addDouble.active = false;
			this.bankerList.active = false;
			this.btn_color.active = false;
			this.btn_size.active = false;
			let posList = this.RoomSet.GetRoomSetProperty("posInfo");
			let setPosList = this.RoomSet.GetRoomSetProperty("setPosList");
			console.log("房间play状态时 游戏状态", state);
			let allPlayer = this.RoomPosMgr.GetRoomAllPlayerInfo();
			let myPosInfo = this.RoomPosMgr.GetPlayerInfoByPos(this.clientPos);
			if (this.ShareDefine.SetState_Hog == state) {//抢庄状态
				//显示抢庄按钮 判断抢过庄就等待别人
				this.ShowConfirmBanker(posList, setPosList);
				if (!myPosInfo["isPlaying"]) {
					this.addDouble.active = false;
					this.bankerList.active = false;
					this.btn_color.active = false;
					this.btn_size.active = false;
					this.sp_state.getComponent(cc.Sprite).spriteFrame = "";
				}
			} else if (this.ShareDefine.SetState_AddDouble == state) {//加倍状态
				//显示加倍按钮 判断加倍过就等待别人
				this.ShowConfirmAddDouble(posList, setPosList);
				if (!myPosInfo["isPlaying"]) {
					this.addDouble.active = false;
					this.bankerList.active = false;
					this.btn_color.active = false;
					this.btn_size.active = false;
					this.sp_state.getComponent(cc.Sprite).spriteFrame = "";
				}
			} else if (this.ShareDefine.SetState_Playing == state) {//理牌界面
				//显示理牌界面， 理过牌就显示等待其他玩家理牌提示
				//如果已经摆好牌 则显示游戏主界面 没有显示摆牌界面

				for (var idx in allPlayer) {
					let playerInfo = allPlayer[idx];
					let pos = playerInfo["pos"];
					let uiPos = this.RoomPosMgr.GetUIPosByDataPos(pos);
					if (playerInfo.name == "" || !playerInfo.isPlaying) {
						this.GetWndNode("sp_seat0" + uiPos + "/seat_dun").active = false;
						this.GetWndNode("sp_seat0" + uiPos + "/sp_card").active = false;
						continue;
					}
					if (playerInfo.isCardReady) {
						let dunNode = this.GetWndNode("sp_seat0" + uiPos + "/seat_dun");
						dunNode.active = true;
						let img_special = dunNode.getChildByName("UILSDunCards").getChildByName("img_special");
						img_special.active = false;
						//todo: 显示具体牌值
						//todo: 显示等待比牌
						//todo: 头像显示比牌中
						this.ShowPosPlayState(pos, 1);
						if (this.clientPos == pos) {
							this.sp_state.getComponent(cc.Sprite).spriteFrame = this.sp_playState[2];
							//显示自己的手牌
							this.HidePlayerAllBtn();
						}
					} else {
						let path = "sp_seat0" + uiPos.toString() + "/sp_card";
						let node = this.GetWndNode(path);
						node.active = true;
						let cards = this.GetWndNode(path + "/UILSCardEffect");
						this.SelectAni("cardEffect");
						let pid = playerInfo["pid"];
						if (pid > 0) {
							cards.active = true;
						} else {
							cards.active = false;
						}
						for (let i = 0; i < cards.children.length - 1; i++) {
							cards.children[i].getChildByName("poker_back").active = true;
						}
						cards.children[cards.children.length - 1].active = true;
						this.ShowPosPlayState(pos, 0);
					}
					if (!playerInfo.isCardReady && playerInfo.pid == this.HeroManager.GetHeroID()) {
						let self = this;
						app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".CFJSSZPlayerCardReadyInfo", {
							"roomID": roomID,
							"posIdx": this.clientPos
						}, function (success) {
							if (success == true) {
								//玩家已经离好牌了,断网重连
								self.RoomMgr.SendGetRoomInfo(roomID);
								self.CloseForm();
							} else {
								//玩家没离开，开启理排
								self.FormManager.ShowForm("game/" + app.subGameName.toUpperCase() + "/UIFJSSZRank");
							}
						}, function (error) {
							//数据异常了，关闭界面
						});
					}
				}
			} else if (this.ShareDefine.SetState_End == state) {//结束阶段
				this.OnShowGameEndForm();
			}
			for (let idx in allPlayer) {
				let playerInfo = allPlayer[idx];
				let pos = playerInfo["pos"];
				let uiPos = this.RoomPosMgr.GetUIPosByDataPos(pos);
				let pid = playerInfo["pid"];
				if (pid > 0) {
					this.GetWndProperty("sp_seat0" + uiPos + "/head", "active", true);
				} else {
					this.GetWndProperty("sp_seat0" + uiPos + "/head", "active", false);
				}
			}
		} else if (this.ShareDefine.RoomState_End == roomState) {
			console.log("房间结束状态时 游戏状态", state);
		} else if (this.ShareDefine.RoomState_Waiting == roomState) {
			console.log("房间等待状态时 游戏状态", state);
		} else if (this.ShareDefine.RoomState_WaitingEx == roomState) {
			console.log("房间等待EX状态时 游戏状态", state);
		}
		this.updateLookInfo()
		this.startClock()
	},
	Event_ChangeStatus: function (event) {
		let myPosInfo = this.RoomPosMgr.GetPlayerInfoByPos(this.clientPos);
		if (!myPosInfo["isPlaying"]) {
			return;
		}
		this.ShowRoomData();
		this.HideAll();
		this.InitHead();
		console.log("状态改变 Event_ChangeStatus", event);
		let posList = event["posList"];
		if (event.state == "FJSSZ_GAME_STATUS_DEAL") {
			console.log("发牌阶段...");
		} else if (event.state == "FJSSZ_GAME_STATUS_CONFIRMBanker") {
			console.log("抢庄阶段...");
			this.QZposList = posList;
			if (this.moshi == 1) {
				this.PlayStartAnimation();
			}
		} else if (event.state == "FJSSZ_GAME_STATUS_ADDDOUBLE") {
			console.log("加倍阶段...");
			let posList = event["posList"];
			this.JZposList = posList;
			if (this.moshi == 2) {
				this.PlayStartAnimation();
			} else {
				this.ShowConfirmAddDouble(this.JZposList, []);
			}
		} else if (event.state == "FJSSZ_GAME_STATUS_PLAYING") {
			console.log("打牌阶段...");
		} else if (event.state == "FJSSZ_GAME_STATUS_RESULT") {
			console.log("打牌结束阶段...");
		}
	},
	PlayStartAnimation: function () {
		this.needDelayDiss = false
		this.startAnimation.active = true;
		this.startAnimation.getComponent(sp.Skeleton).setAnimation(0,"animation", false);
		this.startClock()
	},
	OnEventShow: function () {
		this.hideTime = this.hideTime || 0
		if (Date.now() - this.hideTime > 5000) {
			this.OnShow()
			return
		}
		this.startClock()
	},
	OnEventHide: function () {
		this.hideTime = Date.now()
	},
	startClock(){
		if(!this.RoomMgr) return
		let room = this.RoomMgr.GetEnterRoom();
		if(!room || !room.GetRoomSet()) return
		this.setStartTime = room.GetRoomSet().GetRoomSetProperty("setStartTime");
		this.setCurrentTime = room.GetRoomSet().GetRoomSetProperty("setCurrentTime");
		let roomState = room.GetRoomProperty("state");
		this.unschedule(this.timer)
		if (this.ShareDefine.RoomState_Playing != roomState) {
			this.node.getChildByName("clock").active = false
			return
		}
		let guize = room.GetRoomConfigByProperty("xianShi");
		let self = this
		let f = ()=>{
			this.node.getChildByName("clock").active = false
			this.unschedule(this.timer)
			this.countDown = 0
			if (guize == 1) {
				this.countDown = 60;
			} else if (guize == 2) {
				this.countDown = 90;
			} else if (guize == 3) {
				this.countDown = 120;
			}
			let totalTime = parseInt(parseInt(self.setCurrentTime - self.setStartTime) / 1000);
			this.countDown -= totalTime
			cc.log("开始定时器", this.countDown, totalTime)
			if (this.countDown > 0) {
				this.node.getChildByName("clock").active = true
				this.unschedule(this.timer)
				let  time = this.node.getChildByName("clock").getChildByName("time")
				time.getComponent(cc.Label).string = this.countDown.toString()
				this.schedule(this.timer, 1,  this.countDown, 1.0)
			}
		}
		app[app.subGameName + "_NetManager"]().SendPack("base.CServerTime", {}, function (event) {
			self.setCurrentTime = event.serverTimeMsec;
			f()
		},(event)=>{
			self.setCurrentTime = self.setStartTime;
			f()
		});
	},
	timer(){
		let time = this.node.getChildByName("clock").getChildByName("time")
		let d = parseInt(time.getComponent(cc.Label).string)
		d--
		if(d < 0){
			this.unschedule(this.timer)
			d = 0
			this.node.getChildByName("clock").active = false
		}
		time.getComponent(cc.Label).string = d.toString()
	},
	onStartFinished: function (event) {
		let SpEnt =  this.startAnimation.getComponent(sp.Skeleton).setAnimation(0,"animation",false);
		SpEnt.animationStart = SpEnt.animationEnd;
		if (this.moshi == 2) {
			this.startAnimation.active = false;
			// this.sp_faPai.active = true;
			// this.SelectAni("faPai");
			this.SoundManager.PlaySound("sssFapai");
			this.ShowConfirmAddDouble(this.JZposList, []);
		} else if (this.moshi == 1) {
			this.startAnimation.active = false;
			// this.sp_faPai.active = true;
			// this.SelectAni("faPai");
			this.SoundManager.PlaySound("sssFapai");
			this.ShowConfirmBanker(this.QZposList, []);
		} else {//通比
			// this.startAnimation.getComponent(cc.Animation).stop("start");
			this.startAnimation.active = false;
			this.sp_faPai.active = true;
			this.SelectAni("faPai");
			this.SoundManager.PlaySound("sssFapai");
			let self = this;
			this.scheduleOnce(function () {
				self.sp_faPai.active = false;
				self.SelectAni("cardEffect");
				if (!this.bAuto) {
					if (this.RoomSet.GetRoomSetProperty("isPlaying")) {
						let allPlayer = this.RoomPosMgr.GetRoomAllPlayerInfo();
						for (let key in allPlayer) {
							let playerInfo = allPlayer[key];
							let pos = playerInfo["pos"];
							let isPlaying = playerInfo["isPlaying"];
							let uiPos = this.RoomPosMgr.GetUIPosByDataPos(pos);
							if (!isPlaying) {
								let path = "sp_seat0" + uiPos + "/sp_card";
								let node = this.GetWndNode(path);
								node.active = false;
							}
						}
						self.FormManager.ShowForm("game/" + app.subGameName.toUpperCase() + "/UIFJSSZRank");
						this.ShowPosPlayState(this.clientPos, 1);
					}
				}
			}, 0.36);
		}
	},
	ShowConfirmBanker: function (posList, myInfo) {
		this.sp_state.getComponent(cc.Sprite).spriteFrame = this.sp_playState[0];
		if (!myInfo.length) {
			this.bankerList.active = true;
			this.btn_color.active = true;
			this.btn_size.active = true;
			for (let idx = 0; idx < posList.length-this.ShareDefine.LookCount; idx++) {
				let pos = posList[idx]["posID"];
				// let pid = posList[idx]["pid"];
				let uiPos = this.RoomPosMgr.GetUIPosByDataPos(pos);
				let path = "sp_seat0" + uiPos.toString() + "/sp_card";
				let node = this.GetWndNode(path);
				node.active = true;
				let cards = this.GetWndNode(path + "/UILSCardEffect");
				cards.active = true;
				for (let i = 0; i < cards.children.length - 1; i++) {
					cards.children[i].getChildByName("poker_back").active = true;
				}
				cards.children[cards.children.length - 1].active = false;
				if (this.clientPos == pos) {//渲染自己八张手牌
					let showEightCard = posList[idx]["showEightCard"];
					for (let j = 0; j < showEightCard.length; j++) {
						let index = j + 5;
						this.ShowResultCard(showEightCard[j], cards.children[index]);
					}
				}
			}
		} else {
			for (let idx = 0; idx < posList.length-this.ShareDefine.LookCount; idx++) {
				let pos = posList[idx]["posID"];
				let pid = posList[idx]["pid"];
				let uiPos = this.RoomPosMgr.GetUIPosByDataPos(pos);
				let path = "sp_seat0" + uiPos.toString() + "/sp_card";
				let node = this.GetWndNode(path);
				node.active = true;
				let cards = this.GetWndNode(path + "/UILSCardEffect");
				if (pid > 0) {
					cards.active = true;
				} else {
					cards.active = false;
				}
				for (let i = 0; i < cards.children.length - 1; i++) {
					cards.children[i].getChildByName("poker_back").active = true;
				}
				cards.children[cards.children.length - 1].active = false;
				let qiangZhuangBeiShu = posList[idx]["qiangZhuangBeiShu"];
				if (qiangZhuangBeiShu == -1) {
					if (this.clientPos == pos) {
						this.bankerList.active = true;
						this.btn_color.active = true;
						this.btn_size.active = true;
						let showEightCard = myInfo[0]["showEightCard"];
						for (let j = 0; j < showEightCard.length; j++) {
							let index = j + 5;
							this.ShowResultCard(showEightCard[j], cards.children[index]);
						}
					}
				} else {
					this.ShowZJBeiShu(pos, qiangZhuangBeiShu);
				}
			}
		}
	},
	ShowConfirmAddDouble: function (posList, myInfo) {
		this.sp_state.getComponent(cc.Sprite).spriteFrame = this.sp_playState[1];
		if (!myInfo.length) {
			if (this.moshi == 1) {
				let opPos = this.RoomSet.GetRoomSetProperty("opPos");
				if (this.clientPos != opPos) {
					this.addDouble.active = true;
					this.btn_color.active = true;
					this.btn_size.active = true;
				}
			} else {
				this.sp_state.getComponent(cc.Sprite).spriteFrame = "";
				this.addDouble.active = true;
				this.btn_color.active = true;
				this.btn_size.active = true;
			}

			for (let idx = 0; idx < posList.length-this.ShareDefine.LookCount; idx++) {
				let pos = posList[idx]["posID"];
				let uiPos = this.RoomPosMgr.GetUIPosByDataPos(pos);
				let path = "sp_seat0" + uiPos.toString() + "/sp_card";
				let node = this.GetWndNode(path);
				node.active = true;
				let cards = this.GetWndNode(path + "/UILSCardEffect");
				cards.active = true;
				for (let i = 0; i < cards.children.length - 1; i++) {
					cards.children[i].getChildByName("poker_back").active = true;
				}
				cards.children[cards.children.length - 1].active = false;
				if (this.clientPos == pos) {//渲染自己八张手牌
					let showEightCard = posList[idx]["showEightCard"];
					for (let j = 0; j < showEightCard.length; j++) {
						let index = j + 5;
						this.ShowResultCard(showEightCard[j], cards.children[index]);
					}
				}
			}
		} else {
			if (this.moshi == 1) {
				this.sp_state.getComponent(cc.Sprite).spriteFrame = this.sp_playState[1];
			} else {
				this.sp_state.getComponent(cc.Sprite).spriteFrame = "";
			}
			for (let idx = 0; idx < posList.length-this.ShareDefine.LookCount; idx++) {
				let pos = posList[idx]["posID"];
				let uiPos = this.RoomPosMgr.GetUIPosByDataPos(pos);
				let path = "sp_seat0" + uiPos.toString() + "/sp_card";
				let node = this.GetWndNode(path);
				node.active = true;
				let cards = this.GetWndNode(path + "/UILSCardEffect");
				let pid = posList[idx]["pid"];
				if (pid > 0) {
					cards.active = true;
				} else {
					cards.active = false;
				}
				for (let i = 0; i < cards.children.length - 1; i++) {
					cards.children[i].getChildByName("poker_back").active = true;
				}
				cards.children[cards.children.length - 1].active = false;
				if (this.clientPos == pos) {
					let showEightCard = myInfo[0]["showEightCard"];
					for (let j = 0; j < showEightCard.length; j++) {
						let index = j + 5;
						this.ShowResultCard(showEightCard[j], cards.children[index]);
					}
				}
				let yaZhuBeiShu = posList[idx]["yaZhuBeiShu"];
				let qiangZhuangBeiShu = posList[idx]["qiangZhuangBeiShu"];
				if (qiangZhuangBeiShu == -1) {
					if (this.clientPos == pos) {
						this.addDouble.active = true;
						this.btn_color.active = true;
						this.btn_size.active = true;
					}
				} else {
					this.ShowZJBeiShu(pos, qiangZhuangBeiShu, true);
				}
			}
		}
	},
	SortConfirmBanker: function (posList, myInfo, isSize) {
		if (!myInfo.length) {
			for (let idx = 0; idx < posList.length-this.ShareDefine.LookCount; idx++) {
				let pos = posList[idx]["posID"];
				let uiPos = this.RoomPosMgr.GetUIPosByDataPos(pos);
				let path = "sp_seat0" + uiPos.toString() + "/sp_card";
				let node = this.GetWndNode(path);
				node.active = true;
				let cards = this.GetWndNode(path + "/UILSCardEffect");
				cards.active = true;
				if (this.clientPos == pos) {//渲染自己八张手牌
					let showEightCard = posList[idx]["showEightCard"];
					if (isSize) {
						this.LogicGame.SortBySize(showEightCard);
					} else {
						showEightCard = this.LogicGame.SortByColor(showEightCard);
					}
					for (let j = 0; j < showEightCard.length; j++) {
						let index = j + 5;
						this.ShowResultCard(showEightCard[j], cards.children[index]);
					}
				}
			}
		} else {
			let path = "sp_seat00/sp_card";
			let node = this.GetWndNode(path);
			node.active = true;
			let cards = this.GetWndNode(path + "/UILSCardEffect");
			let showEightCard = myInfo[0]["showEightCard"];
			if (isSize) {
				this.LogicGame.SortBySize(showEightCard);
			} else {
				showEightCard = this.LogicGame.SortByColor(showEightCard);
			}
			for (let j = 0; j < showEightCard.length; j++) {
				let index = j + 5;
				this.ShowResultCard(showEightCard[j], cards.children[index]);
			}
		}
	},
	SortConfirmAddDouble: function (posList, myInfo, isSize) {
		if (!myInfo.length) {
			for (let idx = 0; idx < posList.length-this.ShareDefine.LookCount; idx++) {
				let pos = posList[idx]["posID"];
				let uiPos = this.RoomPosMgr.GetUIPosByDataPos(pos);
				let path = "sp_seat0" + uiPos.toString() + "/sp_card";
				let node = this.GetWndNode(path);
				node.active = true;
				let cards = this.GetWndNode(path + "/UILSCardEffect");
				cards.active = true;
				if (this.clientPos == pos) {//渲染自己八张手牌
					let showEightCard = posList[idx]["showEightCard"];
					if (isSize) {
						this.LogicGame.SortBySize(showEightCard);
					} else {
						showEightCard = this.LogicGame.SortByColor(showEightCard);
					}
					for (let j = 0; j < showEightCard.length; j++) {
						let index = j + 5;
						this.ShowResultCard(showEightCard[j], cards.children[index]);
					}
				}
			}
		} else {
			let path = "sp_seat00/sp_card";
			let node = this.GetWndNode(path);
			node.active = true;
			let cards = this.GetWndNode(path + "/UILSCardEffect");
			let showEightCard = myInfo[0]["showEightCard"];
			if (isSize) {
				this.LogicGame.SortBySize(showEightCard);
			} else {
				showEightCard = this.LogicGame.SortByColor(showEightCard);
			}
			for (let j = 0; j < showEightCard.length; j++) {
				let index = j + 5;
				this.ShowResultCard(showEightCard[j], cards.children[index]);
			}
		}
	},
	ShowRoomData: function () {
		//显示房间信息
		if (app[app.subGameName + "_ShareDefine"]().isCoinRoom) {
			this.roomInfo.active = false;
			return;
		}
		let room = this.RoomMgr.GetEnterRoom();
		let current = room.GetRoomConfigByProperty("setCount");
		let setID = room.GetRoomProperty("setID");
		this.roomInfo.active = true;
		let playerAll = room.GetRoomPosMgr().GetRoomAllPlayerInfo();
		let playerAllList = Object.keys(playerAll);
		let joinPlayerCount = playerAllList.length;
		if (this.playerMinNum == this.playerNum) {
			joinPlayerCount = this.playerNum;
		} else {
			joinPlayerCount = this.playerMinNum + "-" + this.playerNum;
		}
		for (let i = 0; i < this.roomInfo.children.length; i++) {
			if (this.roomInfo.children[i].active) {
				this.roomInfo.children[i].destroy()
			}
		}
		let sign = room.GetRoomConfigByProperty("sign");
		let wanfaStr = this.WanFa();
		let wanfaArr = wanfaStr.split(",");
		let wp = room.GetRoomConfigByProperty("wangpai");
		let signS = this.signString.slice()
		for (let i = 0; i < this.signString.length; i++) {
			signS[i] = wp + "王" + this.signString[i];
		}
		let dianbo = room.GetRoomConfigByProperty("dianbo");
		let unionId = room.GetRoomConfigByProperty("unionId");
		if (dianbo > 0 && unionId > 0) {
			wanfaArr.push("固定携带："+dianbo)
		}
		wanfaArr = [signS[sign - 1]].concat(wanfaArr)
		wanfaArr = [setID + "/" + current + "局"].concat(wanfaArr)
		wanfaArr = ["房号:"+room.GetRoomProperty("key")].concat(wanfaArr)
		for (let i = 0; i < wanfaArr.length; i++) {
			let wanfa = cc.instantiate(this.roomInfo.getChildByName("demo"));
			wanfa.getChildByName("lb").getComponent(cc.Label).string = wanfaArr[i];
			wanfa.active = true
			this.roomInfo.addChild(wanfa);
		}
		if (setID == 0) {
		} else {
			this.FormManager.CloseForm(app.subGameName + "_UIMessage03");
		}
	},
	isChangeRen: function () {
		let room = this.RoomMgr.GetEnterRoom();
		let playerAll = this.RoomPosMgr.GetRoomAllPlayerInfo();
		let playerAllList = Object.keys(playerAll);
		let joinPlayerCount = playerAllList.length;
		if (joinPlayerCount <= 2) {
			return false;
		}
		let fangjian = room.GetRoomConfigByProperty("fangjian");
		if (fangjian.length > 0) {
			if (fangjian.indexOf(0) > -1) {
				return true;
			}
		}
		return false;
	},

	addCard: function () {
		let posList = this.RoomMgr.GetEnterRoom().GetRoomProperty("posList");
		for (let index = 0; index < posList.length-this.ShareDefine.LookCount; index++) {
			let uiPos = this.RoomPosMgr.GetUIPosByDataPos(posList[index].pos);
			let wndNode = this.GetWndNode("sp_seat0" + uiPos);
			//加入墩牌
			if (!wndNode.getChildByName("seat_dun").getChildByName("UILSDunCards")) {
				let dunCard = cc.instantiate(this.dunCardsPrefab);
				wndNode.getChildByName("seat_dun").addChild(dunCard);
			}

			//加入牌特效
			if (!wndNode.getChildByName("sp_card").getChildByName("UILSCardEffect")) {
				let cardEffect = cc.instantiate(this.cardEffectPrefab);
				wndNode.getChildByName("sp_card").addChild(cardEffect);
			}
		}
	},
	AddHeadPrefab: function () {
		let sitPath = "sp_seat0";
		for (let idx = 0; idx < 8; idx++) {
			let sitHead = cc.instantiate(this.headPrefab);
			sitHead.name = "UI" + app.subGameName.toUpperCase() + "Head";
			let sitNode = this.GetWndNode(sitPath + idx + "/head");
			sitNode.addChild(sitHead);
			sitHead.active = false;
			//加入倍数节点 UIFJSSZHead中隐藏
			let bsNode = cc.instantiate(this.beiShuPrefab);
			bsNode.name = "bsPrefab";
			sitHead.getChildByName("otherNode").addChild(bsNode);
			sitHead.getChildByName("otherNode").getChildByName("bsPrefab").active = false;
			sitHead.getChildByName("otherNode").getChildByName("bsPrefab").y = -110;
		}
	},

	AddHead: function () {
		this.clearHead();
		//初始化加入头像 如果已经有加入了头像 显示出来
		let posList = this.RoomMgr.GetEnterRoom().GetRoomProperty("posList");
		let playerCount = posList.length-this.ShareDefine.LookCount;
		let roomSetID = this.Room.GetRoomProperty("setID");
		for (let idx = 0; idx < playerCount; idx++) {
			let pos = posList[idx]["pos"];
			let pid = posList[idx]["pid"];
			let uiPos = this.RoomPosMgr.GetUIPosByDataPos(pos);
			let headScript = this.GetUICardComponentByPos(pos);
			let isLeft = this.Left[uiPos];
			headScript.node.active = true;
			headScript.Init(uiPos, posList[idx].pos, cc.v2(0, 0), isLeft, null, null, roomSetID > 0, pid);
		}
	},
	InitHead: function () {
		this.clearHead();
		//初始化加入头像 如果已经有加入了头像 显示出来
		let posList = this.RoomMgr.GetEnterRoom().GetRoomProperty("posList");
		let playerCount = posList.length-this.ShareDefine.LookCount;
		for (let idx = 0; idx < playerCount; idx++) {
			let pos = posList[idx]["pos"];
			let pid = posList[idx]["pid"];
			let uiPos = this.RoomPosMgr.GetUIPosByDataPos(pos);
			let headScript = this.GetUICardComponentByPos(pos);
			let isLeft = this.Left[uiPos];
			headScript.node.active = true;
			headScript.Init(uiPos, posList[idx].pos, cc.v2(0, 0), isLeft, null, null, true, pid);
		}
	},
	OnShowGameEndForm: function (isRoomEnd = false, thanCard = null) {
		this.HideZJBeiShu();
		//如果玩家已经准备则不显示结算界面
		let clientPlayerInfo = this.RoomPosMgr.GetPlayerInfoByPos(this.clientPos);
		if (clientPlayerInfo["gameReady"]) {
			//显示准备图片
			this.btn_goon.active = false;
		} else {
			this.btn_goon.active = true;
		}
		//显示玩家所有的牌
		let rankingResults = this.RoomMgr.GetEnterRoom().GetRoomProperty("rankingResults");
		let pCard1 = this.RoomSet.GetRoomSetProperty("pCard1");
		let pCard2 = this.RoomSet.GetRoomSetProperty("pCard2");
		let pCard3 = this.RoomSet.GetRoomSetProperty("pCard3");
		let cardList = [pCard1, pCard2, pCard3];
		let rankeds = null;
		let playerResults = null;
		if (isRoomEnd) {
			rankeds = thanCard["rankeds"];
			playerResults = thanCard["posResultList"];
		} else {
			rankeds = rankingResults["rankeds"];
			playerResults = rankingResults["posResultList"];
		}
		let rewardsDict = this.RoomSet.GetRoomSetProperty("rewardsDict");
		for (let posIdx in rewardsDict) {
			let posInfo = rewardsDict[posIdx];
			let isSpecial = posInfo["isSpecial"];
			let uiPos = this.RoomPosMgr.GetUIPosByDataPos(posIdx);
			let pathWnd = "sp_seat0" + uiPos + "/seat_dun";
			this.SetWndProperty(pathWnd, "active", true);
			let dunNode = this.GetWndNode("sp_seat0" + uiPos + "/seat_dun/UILSDunCards");
			dunNode.active = true;
			let img_special = dunNode.getChildByName("img_special");
			img_special.active = false;
			if (isSpecial) {
				let dunPos = posInfo["dunPos"];
				img_special.active = true;
				let spacialNum = posInfo["special"];
				this.SetSpecailProperty(img_special.children[0],spacialNum)
				//音效
				// console.log("播放特殊牌音效", this.Type[spacialNum]);
				// let sex = this.InitHeroSex(posIdx);
				// let soundName = sex + "17CardType" + spacialNum;
				// this.SoundManager.PlaySound(soundName);
				let cards = this.GetDunCardsByServerDunPos(dunPos);
				for (let j = 0; j < cards.length; j++) {
					dunNode.children[j].angle = 0
					this.ShowResultCard(cards[j], dunNode.children[j]);
				}
			}
			let scoreNode = this.GetScoreNode(uiPos, 4);
			let sportsPointNode = this.GetScoreNode(uiPos, 6);
			if (this.unionId > 0) {
				//显示竞技点
				sportsPointNode.active = true;
				scoreNode.active = false
				let sportsPoint = posInfo["sportsPoint"];
				if (sportsPoint > 0) {
					sportsPointNode.children[0].active = true;
					sportsPointNode.children[1].active = false;
					this.showLabel(sportsPointNode.children[0], sportsPoint);
				} else {
					sportsPointNode.children[0].active = false;
					sportsPointNode.children[1].active = true;
					this.showLabel(sportsPointNode.children[1], sportsPoint);
				}
			} else {
				sportsPointNode.active = false;
			}
			// let specialShui = posInfo["specialShui"];
			// let specialShui = posInfo["simShui"];
			let specialShui = posInfo["shui"];
			scoreNode.active = true;
			if (specialShui > 0) {
				scoreNode.getChildByName("win").active = true;
				scoreNode.getChildByName("lost").active = false;
				scoreNode = scoreNode.getChildByName("win");
			} else {
				scoreNode.getChildByName("win").active = false;
				scoreNode.getChildByName("lost").active = true;
				scoreNode = scoreNode.getChildByName("lost");
			}
			if (this.unionId > 0){
				this.GetScoreNode(uiPos, 4).active = false
			}
			this.showLabel(scoreNode, specialShui);
		}
		for (let i = 0; i < cardList.length; i++) {
			for (let j = 0; j < cardList[i].length; j++) {
				let dunCard = cardList[i][j];
				let posIdx = dunCard["posIdx"];
				let cards = dunCard["cards"];
				let baseShui = dunCard["baseShui"];
				let extraShui = dunCard["extraShui"];
				baseShui += extraShui
				baseShui = dunCard["protoShui"];
				let isSpecial = dunCard["isSpecial"];
				let uiPos = this.RoomPosMgr.GetUIPosByDataPos(posIdx);
				let dunCardsNode = this.GetWndNode("sp_seat0" + uiPos + "/seat_dun/UILSDunCards");
				if (!isSpecial) {
					if (i == 0) {
						for (let k = 0; k < cards.length; k++) {//0-2
							this.ShowResultCard(cards[k], dunCardsNode.getChildByName("dun_card" + (k+1)));
							dunCardsNode.getChildByName("dun_card" + (k+1)).angle = 0
							dunCardsNode.getComponent("UILSDunCards").showCardType(0,dunCard.card)
						}
						let scoreNode = this.GetScoreNode(uiPos, 1);
						scoreNode.active = true;
						if (baseShui > 0) {
							scoreNode.getChildByName("score_win").active = true;
							scoreNode.getChildByName("score_lose").active = false;
							this.showLabel(scoreNode.getChildByName("score_win"), baseShui);
						} else {
							scoreNode.getChildByName("score_win").active = false;
							scoreNode.getChildByName("score_lose").active = true;
							this.showLabel(scoreNode.getChildByName("score_lose"), baseShui);
						}
					} else if (i == 1) {
						for (let k = 0; k < cards.length; k++) {//3-7
							this.ShowResultCard(cards[k], dunCardsNode.getChildByName("dun_card" + (k + 4)));
							dunCardsNode.getChildByName("dun_card" + (k+4)).angle = 0
							dunCardsNode.getComponent("UILSDunCards").showCardType(1,dunCard.card)
						}
						let scoreNode = this.GetScoreNode(uiPos, 2);
						scoreNode.active = true;
						if (baseShui > 0) {
							scoreNode.getChildByName("score_win").active = true;
							scoreNode.getChildByName("score_lose").active = false;
							this.showLabel(scoreNode.getChildByName("score_win"), baseShui);
						} else {
							scoreNode.getChildByName("score_win").active = false;
							scoreNode.getChildByName("score_lose").active = true;
							this.showLabel(scoreNode.getChildByName("score_lose"), baseShui);
						}
					} else if (i == 2) {
						for (let k = 0; k < cards.length; k++) {//8-12
							this.ShowResultCard(cards[k], dunCardsNode.getChildByName("dun_card" + (k + 9)));
							dunCardsNode.getChildByName("dun_card" + (k+9)).angle = 0
							dunCardsNode.getComponent("UILSDunCards").showCardType(2,dunCard.card)
						}
						let scoreNode = this.GetScoreNode(uiPos, 3);
						scoreNode.active = true;
						if (baseShui > 0) {
							scoreNode.getChildByName("score_win").active = true;
							scoreNode.getChildByName("score_lose").active = false;
							this.showLabel(scoreNode.getChildByName("score_win"), baseShui);
						} else {
							scoreNode.getChildByName("score_win").active = false;
							scoreNode.getChildByName("score_lose").active = true;
							this.showLabel(scoreNode.getChildByName("score_lose"), baseShui);
						}
					}
				}
			}
		}
		for (let index = 0; index < 8; index++) {
			let dunCardsNode = this.GetWndNode("sp_seat0" + index + "/seat_dun/UILSDunCards");
			if(!dunCardsNode) continue
			for (let i = 0; i < 13; i++) {
				let node = dunCardsNode.getChildByName("dun_card" + i)
				if(!node) continue
				node.zIndex = i
			}
		}
		this.FormManager.ShowForm("game/" + app.subGameName.toUpperCase() + "/UILSResultOne");
	},
	onFireFinished: function (event) {
		this.fireAnimation.active = false;
	},

	onFourFinished: function (event) {
		this.fourAnimation.active = false;
		let SpEnt =  this.fourAnimation.getComponent(sp.Skeleton).setAnimation(0,"qld",false);
		SpEnt.animationStart = SpEnt.animationEnd;
	},
	onXiPaiFinished: function (event) {
		let SpEnt =  this.xpAnimation.getComponent(sp.Skeleton).setAnimation(0,"animation",false);
		SpEnt.animationStart = SpEnt.animationEnd;
		this.xpAnimation.active = false;
		this.Event_SetStart2()
	},
	onVsFinished: function (event) {
		let SpEnt =  this.vsAnimation.getComponent(sp.Skeleton).setAnimation(0,"animation",false);
		SpEnt.animationStart = SpEnt.animationEnd;
		this.vsAnimation.active = false;
		let state = this.RoomSet.GetRoomSetProperty("state");
		if (this.ShareDefine.SetState_End != state) {
			return;
		}
		this.node.getChildByName("clock").active = false
		this.unschedule(this.timer)
		this.thanCardResult();
	},

	SelectAni: function (str) {
		let playerAll = this.RoomPosMgr.GetRoomAllPlayerInfo();
		let playerAllList = Object.keys(playerAll);
		var playerInfo = null;
		for (var i = 0; i < playerAllList.length; i++) {
			playerInfo = playerAll[playerAllList[i]];
			if (playerInfo.name == "") {
				continue;
			}
			let uiPos = this.RoomPosMgr.GetUIPosByDataPos(parseInt(playerAllList[i]));

			if (!playerInfo.isCardReady) {
				let path = "sp_seat0" + uiPos.toString() + "/sp_card";
				let node = this.GetWndNode(path);
				node.active = true;
				let cards = this.GetWndNode(path + "/UILSCardEffect");
				if (str == "faPai") {
					cards.getComponent(cc.Animation).play("faPai");
				} else if (str == "cardEffect") {
					cards.getComponent(cc.Animation).play("cardEffect");
					cards.getChildByName("sp_arrange").active = true;
				}
				let pid = playerInfo["pid"];
				if (pid > 0) {
					cards.active = true;
				} else {
					cards.active = false;
				}
				for (let i = 0; i < cards.children.length - 1; i++) {
					cards.children[i].getChildByName("poker_back").active = true;
				}
				cards.children[cards.children.length - 1].active = true;
			} else {
				let dunNode = this.GetWndNode("sp_seat0" + uiPos + "/seat_dun/UILSDunCards");
				dunNode.active = true;
				if (playerInfo.pos == this.clientPos) {
					this.sp_faPai.active = false;
				}
			}
		}
	},

	clearHead: function () {
		let headCom = "UI" + app.subGameName.toUpperCase() + "Head";
		for (let idx = 0; idx < 8; idx++) {
			let path = "sp_seat0" + idx + "/head/" + headCom;
			let node = this.GetWndNode(path);
			node.active = false;
		}
	},

	OnClose: function () {
		this.unscheduleAllCallbacks();
		this.clearHead();
	},

////////////////////////////////show///////////////////////////////////////////
	RefreshRoomShow: function () {
		let room = this.RoomMgr.GetEnterRoom();
		this.ShowPlayerReady(room);
	},

	HideDunCard: function () {
		for (let idx = 0; idx < 8; idx++) {
			let path = "sp_seat0" + idx + "/seat_dun";
			let dunCards = this.GetWndNode(path);
			dunCards.active = 0;
		}
	},

	HideCard: function () {
		for (let idx = 0; idx < 8; idx++) {
			let sp_card = this.GetWndNode("sp_seat0" + idx + "/sp_card");
			sp_card.active = false;
		}
	},

	HideAllZhunBeiLabel: function () {
		let playerAll = this.RoomPosMgr.GetRoomAllPlayerInfo();
		let playerAllList = Object.keys(playerAll);
		for (let i = 0; i < playerAllList.length; i++) {
			let player = playerAll[playerAllList[i]];
			let pid = player["pid"];
			if (pid > 0) {
				let pos = player["pos"];
				let headScript = this.GetUICardComponentByPos(pos);
				if(!headScript) continue
				headScript.setReady(false);
			}
		}
	},

	ShowOrHideZhunbei: function (pos, isShow) {
		let headScript = this.GetUICardComponentByPos(pos);
		if(!headScript) return
		headScript.setReady(isShow);
	},

	HidePlayerAllBtn: function () {
		this.btn_ready.active = false;
		this.btn_goon.active = false;
		this.btn_cancel.active = false;
		this.btn_go.active = false;
		this.node.getChildByName("btn_stand").active = false;
	},
	HideAll: function () {
		this.HideDunCard();
		this.HideCard();
		this.HideAllZhunBeiLabel();
		this.HidePlayerAllBtn();
		//this.HideDunRewadAll();
		this.HideAllScoreNode();
		this.HideAllCardTypeNode();
		this.HideAllHoles();
		//this.HideZJBeiShu();
		this.sp_faPai.active = false;
		this.bg_BeiShu.active = false;
		this.bg_tips.active = false;
		this.bankerList.active = false;
		this.addDouble.active = false;
		this.btn_color.active = false;
		this.btn_size.active = false;
		this.sp_state.getComponent(cc.Sprite).spriteFrame = "";
	},

	HideAllHoles: function () {
		//隐藏所有的洞
		for (let idx = 0; idx < 8; idx++) {
			let node = this.GetWndNode("sp_seat0" + idx + "/holes");
			if (node.children.length) {
				node.removeAllChildren();
			}
		}
	},

	HideAllScoreNode: function () {
		for (let i = 0; i < 8; i++) {
			let path = "sp_seat0" + i + "/score";
			let node = this.GetWndNode(path);
			if (node) {
				for (let j = 0; j < node.children.length; j++) {
					let child = node.children[j];
					child.active = false;
				}
			}
		}
	},

	GetScoreNode: function (uiPos, tag) {
		let path = "sp_seat0" + uiPos + "/score/" + tag;
		let node = this.GetWndNode(path);
		if (tag == 6) {
			let path2 = "sp_seat0" + uiPos + "/score/4";
			let node2 = this.GetWndNode(path2);
			node.x = node2.x
			node.y = node2.y
			node.anchorX = 1
			for (let index = 0; index < node.children.length; index++) {
				const element = node.children[index];
				element.x = 5
			}
		}
		return node;
	},

	HideAllCardTypeNode: function () {
		for (let i = 0; i < 8; i++) {
			let path = "sp_seat0" + i + "/allNode/cardType";
			let node = this.GetWndNode(path);
			node.active = false;
		}
	},

	GetCardTypeNode: function (uiPos) {
		let path = "sp_seat0" + uiPos + "/allNode/cardType";
		let aniNode = this.GetWndNode(path);
		return aniNode;
	},

	ClearAllReadState: function () {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			console.error("ClearAllReadState not enter room");
			return
		}
		let RoomPosMgr = room.GetRoomPosMgr();
		RoomPosMgr.OnSetEnd(null);
	},

	QiangZhuang: function (idx) {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			console.error("ClearAllReadState not enter room");
			return
		}
		let roomID = room.GetRoomProperty("roomID");
		let pos = this.RoomPosMgr.GetClientPos();
		this.RoomMgr.SendBeiShu(roomID, pos, idx);
		this.bg_BeiShu.active = false;
		this.bg_tips.active = false;
	},

	OnClick: function (btnName, btnNode) {
		if (btnName == "btn_go") {
			this.Click_btn_go();
		} else if (btnName == "btn_ready") {
			//准备时隐藏观战
			// this.node.getChildByName("btn_stand").active = false;
			this.Click_btn_ready();
			console.log("准备");
		
		} else if (btnName == "btn_cancel") {
			this.Click_btn_cancel();
		}else if (btnName == "btn_size") {//大小排序
			let state = this.RoomSet.GetRoomSetProperty("state");
			let posList = [];
			if (this.QZposList.length > 0) {
				posList = this.QZposList;
			} else if (this.JZposList.length > 0) {
				posList = this.JZposList;
			} else {
				posList = this.RoomSet.GetRoomSetProperty("posInfo");
			}
			let setPosList = this.RoomSet.GetRoomSetProperty("setPosList");
			console.log("房间play状态时 游戏状态", state);
			if (this.ShareDefine.SetState_Hog == state) {//抢庄状态
				//显示抢庄按钮 判断抢过庄就等待别人
				this.SortConfirmBanker(posList, setPosList, true);
			} else if (this.ShareDefine.SetState_AddDouble == state) {//加倍状态
				//显示加倍按钮 判断加倍过就等待别人
				this.SortConfirmAddDouble(posList, setPosList, true);
			}
		} else if (btnName == "btn_color") {//花色排序
			let state = this.RoomSet.GetRoomSetProperty("state");
			let posList = [];
			if (this.QZposList.length > 0) {
				posList = this.QZposList;
			} else if (this.JZposList.length > 0) {
				posList = this.JZposList;
			} else {
				posList = this.RoomSet.GetRoomSetProperty("posInfo");
			}
			let setPosList = this.RoomSet.GetRoomSetProperty("setPosList");
			console.log("房间play状态时 游戏状态", state);
			if (this.ShareDefine.SetState_Hog == state) {//抢庄状态
				//显示抢庄按钮 判断抢过庄就等待别人
				this.SortConfirmBanker(posList, setPosList, false);
			} else if (this.ShareDefine.SetState_AddDouble == state) {//加倍状态
				//显示加倍按钮 判断加倍过就等待别人
				this.SortConfirmAddDouble(posList, setPosList, false);
			}
		} else if (btnName == "cardTypeBtn") {
			this.FormManager.ShowOrCloseForm("game/SSS/UISSS_CardType");
		} else if (btnName == "bg") {
			this.FormManager.CloseForm("game/SSS/UISSS_CardType");
//            this.FormManager.CloseForm("UIChat");
		} else if (btnName == "btn_buqiang") {
			this.QiangZhuang(0);
		} else if (btnName == "btn_qiang2") {
			this.QiangZhuang(2);
		} else if (btnName == "btn_qiang3") {
			this.QiangZhuang(3);
		} else if (btnName == "btn_qiang4") {
			this.QiangZhuang(4);
		}
		else if (btnName == "btn_jsfj" || btnName == "btn_exit") {
			//提示退出房间还是查看大厅
			let room = this.RoomMgr.GetEnterRoom();
			let roomCfg = room.GetRoomConfig();
			if (roomCfg.clubId != 0) {
				this.node.getChildByName("tip_exit_node").zIndex = 100;
				this.node.getChildByName("tip_exit_node").active = true;
			} else {
				this.Click_btn_jiesan();
			}
		}

		else if (btnName == "btn_close_tip") {
			this.node.getChildByName("tip_exit_node").active = false;
		}
		else if (btnName == "btn_exit_room") {
			this.Click_btn_jiesan();
		}
		else if (btnName == "btn_go_hall") {
			app[app.subGameName + "Client"].ExitGame(null, '0');
		}


		else if (btnName == "btn_voice") {

		} else if (btnName == "btn_chat") {
			this.FormManager.ShowForm(app.subGameName + "_UIChat");
		} else if (btnName == "btn_setting") {
			this.FormManager.ShowForm(app.subGameName + "_UISetting02");
		} else if (btnName == "btn_goon") {
			this.Click_btn_goon();
		} else if (btnName.startsWith("btn_banker")) {//抢庄按钮
			this.Click_btn_banker(btnName);
		} else if (btnName.startsWith("btn_double")) {//加倍按钮
			this.Click_btn_addDouble(btnName);
		}else if (btnName == "btn_guize") {//打开显示规则
			this.FormManager.ShowForm("game/" + app.subGameName.toUpperCase() + "/UILSGameHelp");
		} else if (btnName == "btn_refresh") {//跳过比牌
			let state = this.RoomSet.GetRoomSetProperty("state");
			if (this.ShareDefine.SetState_End != state){
				app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('当前不是比牌状态', 2);
				return
			}
			this.unscheduleAllCallbacks()
			let thanCard = this.RoomMgr.GetEnterRoom().GetRoomProperty("resultInfo");
			if (!thanCard || !thanCard["sRankingResult"]) {
				return
			}
			this.OnShowGameEndForm(true, thanCard["sRankingResult"]);
		} else if (btnName == "btn_sit") {//坐下
			console.log("坐下");
			// this.node.getChildByName("btn_stand").active = false;
			let roomID = this.RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
			let me = this.RoomPosMgr.GetPlayerInfoByPid(this.HeroManager.GetHeroID())
			this.lastPos = me ? me.pos : -1
			this.RoomMgr.SendSelectPosRoom(roomID, -1);
		} else if (btnName == "btn_stand") {//站起
			console.log("观战");
			let roomID = this.RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
			let me = this.RoomPosMgr.GetPlayerInfoByPid(this.HeroManager.GetHeroID())
			this.lastPos = me ? me.pos : -1
			this.RoomMgr.SendSelectPosRoom(roomID, -2);
		}else {
			console.error("OnClick(%s) not find", btnName);
		}
	},

	Click_btn_ready: function () {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			console.error("Click_btn_ready not enter room");
			return
		}
		let roomID = room.GetRoomProperty("roomID");
		let clientPos = room.GetRoomPosMgr().GetClientPos();
		console.log('发送准备给服务端roomID', roomID, clientPos);
		
		this.node.getChildByName("btn_stand").active = false
		app[app.subGameName + "_GameManager"]().SendReady(roomID, clientPos);
	},
	Click_btn_cancel: function () {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			console.error("Click_btn_cancel not enter room");
			return
		}
		let roomID = room.GetRoomProperty("roomID");
		let clientPos = room.GetRoomPosMgr().GetClientPos();
		app[app.subGameName + "_GameManager"]().SendUnReady(roomID, clientPos);
	},

	Click_btn_go: function () {
		//let SceneManager = app[app.subGameName + "_SceneManager"]();
		let roomID = this.RoomMgr.GetEnterRoomID();
		this.RoomMgr.SendStartRoomGame(roomID);

		//SceneManager.PlayMusic("RoomStart");
	},
	//////////////////////////////////////////////////////////////////////////
	Event_Card_Read: function (event) {
		let allPlayer = this.RoomPosMgr.GetRoomAllPlayerInfo();
		for (let key in allPlayer) {
			let playerInfo = allPlayer[key];
			let pos = playerInfo["pos"];
			let isPlaying = playerInfo["isPlaying"];
			let uiPos = this.RoomPosMgr.GetUIPosByDataPos(pos);
			if (!isPlaying) {
				let path = "sp_seat0" + uiPos + "/sp_card";
				let node = this.GetWndNode(path);
				node.active = false;
			}
		}
		let isReady = event["isReady"];
		let pos = event["pos"];
		let isSpecial = event["isSpecial"];
		let uiPos = this.RoomPosMgr.GetUIPosByDataPos(pos);
		this.ClearAllReadState();
		if (isReady) {
			let pathWnd = "sp_seat0" + uiPos + "/seat_dun";
			this.SetWndProperty(pathWnd, "active", true);
			let dunNode = this.GetWndNode(pathWnd + "/UILSDunCards");
			dunNode.active = true;
			let img_special = dunNode.getChildByName("img_special");
			img_special.active = false;
			if (isSpecial) {
				img_special.active = true;
				this.SetSpecailProperty(img_special.children[0], 999);
			}
			dunNode.getComponent("UILSDunCards").startAni()
			for (let j = 0; j < dunNode.children.length; j++) {
				if(dunNode.children[j].getChildByName("poker_back")){
					dunNode.children[j].getChildByName("poker_back").active = true;
				}
			}
			if (pos == this.clientPos) {
				this.FormManager.CloseForm("game/" + app.subGameName.toUpperCase() + "/UIFJSSZRank");
				this.sp_state.getComponent(cc.Sprite).spriteFrame = this.sp_playState[2];
				this.HidePlayerAllBtn();
			}
			this.ShowPosPlayState(pos, 1);
			let path = "sp_seat0" + uiPos + "/sp_card";
			let node = this.GetWndNode(path);
			node.active = false;
			this.HideAllZhunBeiLabel();
		}
	},
	GetDownListCard: function (first, second, third) {
		let dun1 = [];
		let dun2 = [];
		let dun3 = [];
		if (first.length == 0) {
			let DUN1 = this.LogicRank.getDunListByType("DUN1");
			if (DUN1.length == 0) {
				let cardList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				return cardList;
			} else {
				dun1 = DUN1;
				dun2 = this.LogicRank.getDunListByType("DUN2");
				dun3 = this.LogicRank.getDunListByType("DUN3");
			}
		} else {
			dun1 = first;
			dun2 = second;
			dun3 = third;
		}

		let downListCard = [];
		let sort1 = dun1;
		this.LogicGame.SortCardByMax(dun1);
		let sort2 = dun2;
		this.LogicGame.SortCardByMax(dun2);
		let sort3 = dun3;
		this.LogicGame.SortCardByMax(dun3);
		for (let i = 0; i < sort1.length; i++) {
			downListCard.push(sort1[i]);
		}
		for (let j = 0; j < sort2.length; j++) {
			downListCard.push(sort2[j]);
		}
		for (let k = 0; k < sort3.length; k++) {
			downListCard.push(sort3[k]);
		}
		return downListCard;
	},
	Event_PosReadyChg: function (event) {
		this.RefreshRoomShow();
	},

	Event_RoomEnd: function (event) {
		console.log("显示总战绩");
		this.ShowDanJuForm();
		this.HideAll();
	},
	ShowDanJuForm: function () {
		let room = this.RoomMgr.GetEnterRoom();
		let roomEnd = room.GetRoomProperty("roomEnd");
		if (!roomEnd)  return
		let record = roomEnd["record"];
		let players = record["players"];
		let recordPosInfosList = record["recordPosInfosList"];
		let ownerID = room.GetRoomProperty("ownerID");
		for (let i = 0; i < recordPosInfosList.length; i++) {
			let recordPosInfos = recordPosInfosList[i];
			let player = players[i];
			if (recordPosInfos["pid"] == player["pid"]) {
				recordPosInfos["name"] = player["name"];
				recordPosInfos["id"] = player["accountID"];
			}
			if (ownerID == recordPosInfos["pid"]) {
				recordPosInfos["isFangZhu"] = true;
			} else {
				recordPosInfos["isFangZhu"] = false;
			}
		}
		//找出大赢家
		recordPosInfosList.sort((a, b) => {
			return b.point - a.point;
		});
		let max = recordPosInfosList[0].point;
		for (let j = 0; j < recordPosInfosList.length; j++) {
			if (max <= recordPosInfosList[j].point) {
				recordPosInfosList[j]["isWin"] = true;
			} else {
				recordPosInfosList[j]["isWin"] = false;
			}
		}
		this.FormManager.ShowForm("game/" + app.subGameName.toUpperCase() + "/UILSResultDetail", record);
	},
	OnPack_AutoStart: function (event) {
		let serverPack = event;
		let roomID = serverPack["roomID"];
		let pos = serverPack["pos"];
		let isAuto = serverPack["trusteeship"];
		if (pos == this.RoomPosMgr.GetClientPos()) {
			if (isAuto) {
				app[app.subGameName + "_GameManager"]().SetAutoPlayIng(true);
				// app[app.subGameName + "_FormManager"]().ShowForm(app.subGameName + "_UIAutoPlay");
			}
		}
		let headScript = this.GetUICardComponentByPos(pos);
		headScript.ShowAutoIcon(isAuto);
	},
	Event_SetStart: function (event) {
		console.log("游戏开始", JSON.stringify(event))
		let maPaiValue = this.RoomSet.GetRoomSetProperty("mapai");
		let room = this.RoomMgr.GetEnterRoom();
		this.kexuanwanfa = room.GetRoomConfigByProperty("kexuanwanfa");
		if (maPaiValue) {
			this.maPai.active = true;
			let child = this.maPai.getChildByName("card");
			this.ShowResultCard(maPaiValue, child);
		}
		if (event && event.setInfo && event.setInfo.isXiPai) {
			this.xpAnimation.active = true;
			this.xpAnimation.getComponent(sp.Skeleton).setAnimation(0,"animation",false);
			this.SoundManager.PlaySound("sssQiePai");
		}
		else{
			this.Event_SetStart2(event)
		}
	},
	//一局开始
	Event_SetStart2: function (event) {
		this.ShowRoomData();
		app[app.subGameName + "Client"].OnEvent("SetStart");
		this.bAuto = app[app.subGameName + "_GameManager"]().IsAutoPlayIng();
		this.HideAll();
		let room = this.RoomMgr.GetEnterRoom();
		//重置发牌动画
		let posList = room.GetRoomProperty("posList");
		for (let idx = 0; idx < posList.length-this.ShareDefine.LookCount; idx++) {
			let isPlaying = posList[idx]["isPlaying"];
			if (!isPlaying) {
				continue;
			}
			let pos = posList[idx]["pos"];
			let uiPos = this.RoomPosMgr.GetUIPosByDataPos(pos);
			let path = "sp_seat0" + uiPos.toString() + "/sp_card";
			let node = this.GetWndNode(path);
			node.active = true;
			let cards = this.GetWndNode(path + "/UILSCardEffect");
			let pid = posList[idx]["pid"];
			if (pid > 0) {
				cards.active = true;
				this.GetWndProperty("sp_seat0" + uiPos + "/head", "active", true);
			} else {
				cards.active = false;
				this.GetWndProperty("sp_seat0" + uiPos + "/head", "active", false);
			}
			for (let i = 0; i < cards.children.length - 1; i++) {
				cards.children[i].getChildByName("poker_back").active = true;
			}
			cards.children[cards.children.length - 1].active = false;
			let img_special = this.GetWndNode("sp_seat0" + uiPos + "/seat_dun/UILSDunCards/img_special");
			img_special.active = false;
			this.ShowPosPlayState(pos, 0);
		}

		if (0 == this.moshi) {
			this.PlayStartAnimation();
		} else {
			let self = this;
			this.scheduleOnce(function () {
				self.sp_faPai.active = false;
				self.SelectAni("cardEffect");
				if (!this.bAuto) {
					if (this.RoomSet.GetRoomSetProperty("isPlaying")) {
						let allPlayer = this.RoomPosMgr.GetRoomAllPlayerInfo();
						for (let key in allPlayer) {
							let playerInfo = allPlayer[key];
							let pos = playerInfo["pos"];
							let isPlaying = playerInfo["isPlaying"];
							let uiPos = this.RoomPosMgr.GetUIPosByDataPos(pos);
							if (!isPlaying) {
								let path = "sp_seat0" + uiPos + "/sp_card";
								let node = this.GetWndNode(path);
								node.active = false;
							}
						}
						self.FormManager.ShowForm("game/" + app.subGameName.toUpperCase() + "/UIFJSSZRank");
						this.ShowPosPlayState(this.clientPos, 1);
					}
				}
			}, 0.36);
		}
	},

	Event_Beishu: function (event) {
		console.log("Event_Beishu", event);
		this.HidePlayerAllBtn();
		//如果托管，默认为不抢
		if (app[app.subGameName + "_GameManager"]().IsAutoPlayIng()) {
			this.QiangZhuang(0);
			return;
		}
		this.bg_BeiShu.active = true;
		this.bg_tips.active = true;
		this.count = 10;
		this.bg_tips.getChildByName("label").getComponent(cc.Label).string = this.count;
		this.schedule(this.timeCallback, 1);
	},

	timeCallback: function () {
		this.count--;
		this.bg_tips.getChildByName("label").getComponent(cc.Label).string = this.count;
		if (this.count <= 0) {
			this.unschedule(this.timeCallback);
			this.bg_BeiShu.active = false;
			this.bg_tips.active = false;
		}
	},

	Event_ZJBeishu: function (event) {
		console.log("显示庄家 Event_ZJBeishu", event);
		this.HideZJBeiShu();
		this.HideAllPlayState();
		let data = event;
		let pos = data["posID"];
		let beiShu = data["beiShu"];
		let player = this.RoomPosMgr.GetPlayerInfoByPos(pos);
		app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('SSS_QIANGZHUANG_BEISHU', [player["name"], beiShu]);
		this.ShowZJBeiShu(pos, beiShu, true);
		this.ShowOrHidePosZhuangJia(pos, true);
		if (pos == this.clientPos) {
			this.bg_BeiShu.active = false;
			this.bg_tips.active = false;
		}
	},
	//显示加倍倍数
	Event_YaZhuBeiShu: function (event) {
		console.log("显示加倍倍数 Event_YaZhuBeiShu", event);
		let data = event;
		let pos = data["posID"];
		let beiShu = data["beiShu"];
		this.ShowZJBeiShu(pos, beiShu, true);
	},
	Event_QiangZhuangBeiShu: function (event) {
		console.log("Event_QiangZhuangBeiShu", event);
		let data = event;
		let pos = data["posID"];
		let beiShu = data["beiShu"];
		this.ShowZJBeiShu(pos, beiShu);
		if (pos == this.clientPos) {
			this.bg_BeiShu.active = false;
			this.bg_tips.active = false;
		}
	},
	Event_CodeError: function (event) {
		let argDict = event;
		let code = argDict["Code"];
		if (code == this.ShareDefine.SportsPointNotEnough) {
			this.SetWaitForConfirm("SportsPointNotEnough", this.ShareDefine.ConfirmYN, []);
		} else if (code == this.ShareDefine.NotAllow) {

		}
	},
	Event_SportsPointEnough: function (event) {
		let msg = event.msg;
		this.poChanMsg = msg
		// this.SetWaitForConfirm("SportsPointEnough", this.ShareDefine.ConfirmOK, [msg]);
	},
	Event_SportsPointNotEnough: function (event) {
		let msg = event.msg;
		// this.SetWaitForConfirm("SportsPointNotEnough", this.ShareDefine.ConfirmYN, []);
	},
	Event_UIAutoPlay: function (event) {
		app[app.subGameName + "_GameManager"]().SetAutoPlayIng(true);
		app[app.subGameName + "_FormManager"]().ShowForm(app.subGameName + "_UIAutoPlay");
	},

	HideZJBeiShu: function () {
		let playerAll = this.RoomPosMgr.GetRoomAllPlayerInfo();
		let playerAllList = Object.keys(playerAll);
		var playerInfo = null;
		for (var i = 0; i < playerAllList.length; i++) {
			playerInfo = playerAll[playerAllList[i]];
			let uiPos = this.RoomPosMgr.GetUIPosByDataPos(playerInfo["pos"]);
			let otherNode = this.GetWndNode("sp_seat0" + uiPos + "/head/UI" + app.subGameName.toUpperCase() + "Head/otherNode/bsPrefab");
			if (otherNode) {
				otherNode.active = false;
			}
		}
	},
	HideAllPlayState: function () {
		for (let i = 0; i < 8; i++) {
			let path = "sp_seat0" + i + "/head/UI" + app.subGameName.toUpperCase() + "Head/";
			let stateNode = this.GetWndNode(path + "touxiang/sp_state");
			stateNode.getComponent(cc.Sprite).spriteFrame = "";
		}
	},

	ShowZJBeiShu: function (pos, beishu, isShowIcon = false) {//是否显示抢庄图标
		if (pos > -1) {
			if (!isShowIcon) {
				this.ShowPosPlayStateByQZ(pos, beishu);
			}
			if (beishu > 0) {
				let uiPos = this.RoomPosMgr.GetUIPosByDataPos(pos);
				let otherNode = this.GetWndNode("sp_seat0" + uiPos + "/head/UI" + app.subGameName.toUpperCase() + "Head/otherNode/bsPrefab");
				otherNode.active = true;
				otherNode.getComponent(cc.Label).string = beishu + "倍";
			}
		}
	},
	ShowOrHidePosZhuangJia: function (pos, isShow) {
		let headScript = this.GetUICardComponentByPos(pos);
		if (!headScript) return
		headScript.ShowOrHideZhuangJia(isShow);
	},
	ShowPosPlayStateByQZ: function (pos, beishu) {
		let headScript = this.GetUICardComponentByPos(pos);
		if (!headScript) return
		headScript.ShowPlayStateByQZ(beishu);
	},
	ShowPosPlayState: function (pos, state) {
		let headScript = this.GetUICardComponentByPos(pos);
		if (!headScript) return
		headScript.ShowPlayState(state);
	},
	//-----------------回调函数------------------------
	Event_ChatMessage: function (event) {
		let argDict = event;
		let senderPid = argDict["senderPid"];
		let quickID = parseInt(argDict["quickID"]);
		let content = argDict["content"];

		let playerList = this.RoomMgr.GetEnterRoom().GetRoomPosMgr().GetRoomAllPlayerInfo();
		let playerListKey = Object.keys(playerList);
		let initiatorPos = "";
		for (let i = 0; i < playerListKey.length; i++) {
			let player = playerList[playerListKey[i]];
			let pid = player["pid"];
			if (senderPid == pid) {
				initiatorPos = parseInt(i);
			}
		}
		let playerSex = this.InitHeroSex(initiatorPos);
		let soundName = "";
		let path = "";
		if (quickID < 101) {
			switch (quickID) {
				case 1:
					content = app.i18n.t("UIVoiceStringBieChao");
					soundName = [playerSex, "_FastVoice_1"].join("");
					break;
				case 2:
					content = app.i18n.t("UIVoiceStringBieZou");
					soundName = [playerSex, "_FastVoice_2"].join("");
					break;
				case 3:
					content = app.i18n.t("UIVoiceStringZhaoHu");
					soundName = [playerSex, "_FastVoice_3"].join("");
					break;
				case 4:
					content = app.i18n.t("UIVoiceStringZanLi");
					soundName = [playerSex, "_FastVoice_4"].join("");
					break;
				case 5:
					content = app.i18n.t("UIVoiceStringZanShang");
					soundName = [playerSex, "_FastVoice_5"].join("");
					break;
				case 6:
					content = app.i18n.t("UIVoiceStringCuiCu");
					soundName = [playerSex, "_FastVoice_6"].join("");
					break;
				case 7:
					content = app.i18n.t("UIVoiceStringKuaJiang");
					soundName = [playerSex, "_FastVoice_7"].join("");
					break;
				case 8:
					content = app.i18n.t("UIVoiceStringDaShang");
					soundName = [playerSex, "_FastVoice_8"].join("");
					break;
				case 9:
					content = app.i18n.t("UIVoiceStringLiKai");
					soundName = [playerSex, "_FastVoice_9"].join("");
					break;
				case 10:
					content = app.i18n.t("UIVoiceStringYanChi");
					soundName = [playerSex, "_FastVoice_10"].join("");
					break;
				default:
					console.error("Event_chatmessage not find(%s)", quickID);
			}
		} else {
			switch (quickID) {
				case 101:
					path = "face1Action";
					break;
				case 102:
					path = "face2Action";
					break;
				case 103:
					path = "face3Action";
					break;
				case 104:
					path = "face4Action";
					break;
				case 105:
					path = "face5Action";
					break;
				case 106:
					path = "face6Action";
					break;
				case 107:
					path = "face7Action";
					break;
				case 108:
					path = "face8Action";
					break;
				case 109:
					path = "face9Action";
					break;
				case 110:
					path = "face10Action";
					break;
				case 111:
					path = "face11Action";
					break;
				case 112:
					path = "face12Action";
					break;
				case 113:
					path = "face13Action";
					break;
				case 114:
					path = "face14Action";
					break;
				case 115:
					path = "face15Action";
					break;
				default:
					console.error("Event_chatmessage not find(%s)", quickID);
			}
		}
		this.SoundManager.PlaySound(soundName);
		//敏感词汇替换
		content = this.UtilsWord.CheckContentDirty(content);
		let headScript = this.GetUICardComponentByPos(initiatorPos);
		if (content == "") {
			headScript.ShowFaceContent(path);
		} else {
			headScript.ShowChatContent(content);
		}
	},

	InitHeroSex: function (pos) {
		let RoomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
		let player = RoomPosMgr.GetPlayerInfoByPos(pos);
		let Sex = player["sex"];
		let playerSex = "";
		if (Sex == this.ShareDefine.HeroSex_Boy) {
			playerSex = "boy";
		} else if (Sex == this.ShareDefine.HeroSex_Girl) {
			playerSex = "girl";
		}
		return playerSex;
	},
	//继续游戏
	Event_PosContinueGame: function (event) {
		let argDict = event;
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			console.error("Event_PosContinueGame not enter room");
			return
		}
		this.ShowPosPlayState(argDict["pos"], "");
		let RoomPosMgr = room.GetRoomPosMgr();
		let clientPos = RoomPosMgr.GetClientPos();
		if (argDict["pos"] != clientPos) {
			let clientPlayerInfo = RoomPosMgr.GetPlayerInfoByPos(clientPos);
			// //如果玩家已经继续了,需要渲染其他人的状态
			if (!clientPlayerInfo["gameReady"]) {
				return;
			}
		} else {//如果是自己准备就清理界面
			this.HidePlayerAllBtn();
		}
	},

	//位置更新
	Event_PosUpdate: function (event) {
		let roomSetID = this.Room.GetRoomProperty("setID");
		let serverPack = event;
		serverPack["isShowNode"] = roomSetID > 0;
		app[app.subGameName + "Client"].OnEvent("Head_PosUpdate", serverPack);
		let room = this.RoomMgr.GetEnterRoom();
		let roomState = room.GetRoomProperty("state");
		if (this.ShareDefine.RoomState_Playing == roomState) {
			this.btn_ready.active = false;
		}
		console.log("位置更新", roomState, this.ShareDefine["Room"]);

		this.updateLookInfo()
		if (event.posInfo.pid == this.HeroManager.GetHeroID() && this.lastPos != event.posInfo.pos) {
			this.OnShow()
		}
		this.RefreshRoomShow();
	},
	//所有位置位置更新
	Event_AllPosUpdate: function (event) {
		this.AddHead();
		this.clientPos = parseInt(this.RoomPosMgr.GetClientPos());
		let room = this.RoomMgr.GetEnterRoom();
		let roomState = room.GetRoomProperty("state");
		let state = this.RoomSet.GetRoomSetProperty("state");
		if (this.ShareDefine.RoomState_Playing == roomState ||
			this.ShareDefine.SetState_Hog == state ||
			this.ShareDefine.SetState_AddDouble == state ||
			this.ShareDefine.SetState_Playing == state) {
			this.btn_ready.active = false;
		}
		let roomSetID = this.Room.GetRoomProperty("setID");
		let serverPack = event;
		serverPack["isShowNode"] = roomSetID > 0;
		app[app.subGameName + "Client"].OnEvent("Head_PosUpdate", serverPack);
		this.updateLookInfo()
	},
	//位置离开
	Event_PosLeave: function (event) {
		// this.ShowWeiXinYaoQing();
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			console.error("Event_PosLeave not enter room");
			return;
		}
		let roomSetID = this.Room.GetRoomProperty("setID");
		let serverPack = event;
		serverPack["isShowNode"] = roomSetID > 0;
		let pos = serverPack["pos"];
		//如果是客户端自己，返回大厅
		let roomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
		let pos2 = roomPosMgr.posId
		if (!serverPack["beKick"] && (this.clientPos == pos || pos2 == pos)) {
			app[app.subGameName + "Client"].ExitGame();
			return;
		}

		app[app.subGameName + "Client"].OnEvent("Head_PosLeave", serverPack);
		//如果是客户端玩家并且是被T了
		if (serverPack["beKick"] && (this.clientPos == pos || pos2 == pos)) {
			if (serverPack["kickOutTYpe"] == 2) {
				this.SetWaitForConfirm("MSG_BeKick", this.ShareDefine.ConfirmOK, [serverPack["msg"]]);
			} else {
				this.SetWaitForConfirm("UIPlay_BeKick", this.ShareDefine.ConfirmOK);
			}
		}

		this.RefreshRoomShow();
		let roomState = room.GetRoomProperty("state");
		if (this.ShareDefine.RoomState_Playing == roomState) {
			this.btn_ready.active = false;
		}
		console.log("位置离开", roomState, this.ShareDefine["Room"]);
	},

	//局结束
	Event_SetEnd: function (event) {
		console.log("局结束 Event_SetEnd", event);
	},

	//房间解散
	Event_DissolveRoom: function (event) {

		let argDict = event;
		let ownnerForce = argDict["ownnerForce"];
		if (this.needDelayDiss && this.unionId && this.unionId > 0) {
			this.cacheMessage = event
			return
		}
		//未开启房间游戏时才会触发
		if (ownnerForce) {
			let room = this.RoomMgr.GetEnterRoom();
			//如果是房主主动接撒直接退出
			if (room && room.IsClientIsOwner()) {
				app[app.subGameName + "Client"].ExitGame();
			} else {
				this.SetWaitForConfirm("OwnnerForceRoom", this.ShareDefine.ConfirmOK);
			}
		} else if (event.dissolveNoticeType == 1) {
			this.SetWaitForConfirm('SportsPointDissolveRoom', this.ShareDefine.ConfirmOK, [event.msg]);
		} else if (event.dissolveNoticeType == 3) {
			this.SetWaitForConfirm('MSG_BeDissolve', this.ShareDefine.ConfirmOK, [event.msg]);
		} else {
			let state = this.RoomMgr.GetEnterRoom().GetRoomProperty("state");
			//如果没有打完一局不会下发roomend,直接显示2次弹框
			if (state != this.ShareDefine.SetState_End) {
				this.SetWaitForConfirm("DissolveRoom", this.ShareDefine.ConfirmOK);
				this.FormManager.CloseForm(app.subGameName + "_UIMessage02");
			}
			//如果有roomend数据显示 结果界面
			else {
				//抢庄押注时解散房间
				this.ShowDanJuForm();
				this.FormManager.CloseForm(app.subGameName + "_UIMessage02");
				this.FormManager.CloseForm("game/" + app.subGameName.toUpperCase() + "/UIFJSSZRank");
			}
		}
	},

	//收到解散房间
	Event_StartVoteDissolve: function (event) {
		this.FormManager.ShowForm(app.subGameName + "_UIMessage02");
		//this.HideAll();
	},
	//收到却换人数
	Event_ChangePlayerNum: function (event) {
		this.FormManager.ShowForm(app.subGameName + "_UIMessage03");
		this.FormManager.CloseForm(app.subGameName + "_UIMessage");
	},
	//比牌处理
	Event_RankingResult: function (event) {
		let playerSex = this.InitHeroSex(this.clientPos);
		let soundName = playerSex + "17StartBiPai";
		this.SoundManager.PlaySound(soundName);
		this.sp_state.getComponent(cc.Sprite).spriteFrame = "";
		this.vsAnimation.active = true;
		this.vsAnimation.getComponent(sp.Skeleton).setAnimation(0,"animation",false);
		this.needDelayDiss = true
		for (let i = 0; i < 8; i++) {
			let path = "sp_seat0" + i + "/seat_dun/UILSDunCards";
			let dunCards = this.GetWndNode(path);
			if(!dunCards) continue;
			dunCards.getComponent("UILSDunCards").stopWaitAnim()
		}
		this.unschedule(this.timer)
		this.node.getChildByName("clock").active = false
	},
	thanCardResult: function () {
		let thanCard = this.RoomMgr.GetEnterRoom().GetRoomProperty("resultInfo");
		let rankeds = thanCard.sRankingResult.rankeds;      //所有人的牌

		let spacialCard = thanCard.sRankingResult.specialPockerCard; //特殊牌型

		if (this.kexuanwanfa.length > 0) {
			if (this.kexuanwanfa.indexOf(2) > -1) {
				this.OnShowGameEndForm(true, thanCard["sRankingResult"]);
				return;
			}
			//八个人
			if (rankeds.length == 8) {
				if (spacialCard.length < 7) {
					this.ShowResultNormal(thanCard.sRankingResult, true);
				} else {
					this.ShowResultSpacial(thanCard.sRankingResult);
				}
			}
			//七个人
			else if (rankeds.length == 7) {
				if (spacialCard.length < 6) {
					this.ShowResultNormal(thanCard.sRankingResult, true);
				} else {
					this.ShowResultSpacial(thanCard.sRankingResult);
				}
			}
			//六个人
			else if (rankeds.length == 6) {
				if (spacialCard.length < 5) {
					this.ShowResultNormal(thanCard.sRankingResult, true);
				} else {
					this.ShowResultSpacial(thanCard.sRankingResult);
				}
			}
			//五个人
			else if (rankeds.length == 5) {
				if (spacialCard.length < 4) {
					this.ShowResultNormal(thanCard.sRankingResult, true);
				} else {
					this.ShowResultSpacial(thanCard.sRankingResult);
				}
			}
			//四个人
			else if (rankeds.length == 4) {
				if (spacialCard.length < 3) {
					this.ShowResultNormal(thanCard.sRankingResult, true);
				} else {
					this.ShowResultSpacial(thanCard.sRankingResult);
				}
			}
			//三个人
			else if (rankeds.length == 3) {
				if (spacialCard.length < 2) {
					this.ShowResultNormal(thanCard.sRankingResult, false);
				} else {
					this.ShowResultSpacial(thanCard.sRankingResult);
				}
			}
			//俩个人
			else if (rankeds.length == 2) {
				if (spacialCard.length) {
					this.ShowResultSpacial(thanCard.sRankingResult);
				} else {
					this.ShowResultNormal(thanCard.sRankingResult, false);
				}
			}
		} else {
			//八个人
			if (rankeds.length == 8) {
				if (spacialCard.length < 7) {
					this.ShowResultNormal(thanCard.sRankingResult, true);
				} else {
					this.ShowResultSpacial(thanCard.sRankingResult);
				}
			}
			//七个人
			else if (rankeds.length == 7) {
				if (spacialCard.length < 6) {
					this.ShowResultNormal(thanCard.sRankingResult, true);
				} else {
					this.ShowResultSpacial(thanCard.sRankingResult);
				}
			}
			//六个人
			else if (rankeds.length == 6) {
				if (spacialCard.length < 5) {
					this.ShowResultNormal(thanCard.sRankingResult, true);
				} else {
					this.ShowResultSpacial(thanCard.sRankingResult);
				}
			}
			//五个人
			else if (rankeds.length == 5) {
				if (spacialCard.length < 4) {
					this.ShowResultNormal(thanCard.sRankingResult, true);
				} else {
					this.ShowResultSpacial(thanCard.sRankingResult);
				}
			}
			//四个人
			else if (rankeds.length == 4) {
				if (spacialCard.length < 3) {
					this.ShowResultNormal(thanCard.sRankingResult, true);
				} else {
					this.ShowResultSpacial(thanCard.sRankingResult);
				}
			}
			//三个人
			else if (rankeds.length == 3) {
				if (spacialCard.length < 2) {
					this.ShowResultNormal(thanCard.sRankingResult, false);
				} else {
					this.ShowResultSpacial(thanCard.sRankingResult);
				}
			}
			//俩个人
			else if (rankeds.length == 2) {
				if (spacialCard.length) {
					this.ShowResultSpacial(thanCard.sRankingResult);
				} else {
					this.ShowResultNormal(thanCard.sRankingResult, false);
				}
			}
		}
	},

	sortFun: function (a, b) {
		return a.posIdx - b.posIdx;
	},

	sortFunByShui: function (a, b) {
		if ("protoShui" in a && "protoShui" in b) {
			return a.protoShui - b.protoShui;
		}
		return a.shui - b.shui;
	},

	sortFunByCardType: function (a, b) {
		return a.card - b.card;
	},
	ShowResultNormal: function (sRankingResult, isQuick) {

		//显示自己的分数
		if (this.RoomSet.GetRoomSetProperty("isPlaying")) {
		}
		let cardResult1 = sRankingResult.pCardResult1; //第一墩比较结果
		let cardResult2 = sRankingResult.pCardResult2; //第二墩比较结果
		let cardResult3 = sRankingResult.pCardResult3; //第三墩比较结果
		if (cardResult1 && cardResult1.length) {
			cardResult1.sort(this.sortFunByShui);
		}
		if (cardResult2 && cardResult2.length) {
			cardResult2.sort(this.sortFunByShui);
		}
		if (cardResult3 && cardResult3.length) {
			cardResult3.sort(this.sortFunByShui);
		}
		let cardType1 = sRankingResult.pCard1;      //牌型1
		let cardType2 = sRankingResult.pCard2;      //牌型2
		let cardType3 = sRankingResult.pCard3;      //牌型3

		let spacialCard = sRankingResult.specialPockerCard; //特殊牌型

		let gunFire = sRankingResult.killRankins;    //打枪

		let simPlayerResult = sRankingResult.simPlayerResult; //前三墩比牌结果

		let fourbagger = sRankingResult.fourbagger; //全垒打

		let simResults = sRankingResult.simResults; //前三墩结果加打枪结果和全垒打结果

		let rankeds = sRankingResult.rankeds;      //所有人的牌

		let playerResults = sRankingResult.posResultList; //所有比牌总结果

		let list1 = [];
		let list2 = [];
		let list3 = [];
		if (sRankingResult.zjid != 0) {
			cardType1.sort(this.sortFunByCardType);
			cardType2.sort(this.sortFunByCardType);
			cardType3.sort(this.sortFunByCardType);
			let zhuangjia = {};
			let func = function (list, cardType) {
				for (let i = 0; i < cardType.length; i++) {
					if (cardType[i].pid == sRankingResult.zjid) {
						zhuangjia = cardType[i];
						continue;
					}
					list.push(cardType[i]);
				}
			};
			//将庄家放到最后开牌
			func(list1, cardType1);
			list1.push(zhuangjia);
			func(list2, cardType2);
			list2.push(zhuangjia);
			func(list3, cardType3);
			list3.push(zhuangjia);
		} else {
			list1 = cardResult1;
			list2 = cardResult2;
			list3 = cardResult3;
		}

		let timer = 0;
		let self = this;
		for (let playerIdx = 0; playerIdx < list1.length; playerIdx++) {
			//如果当前玩家是特殊牌 继续显示牌背
			let isSpacial = false;
			for (let idx = 0; idx < spacialCard.length; idx++) {
				if (spacialCard[idx].posIdx == list1[playerIdx].posIdx) {
					isSpacial = true;
					//如果自己为特殊牌 不显示分数
				}
			}
			if (isSpacial) {
				continue;
			}

			timer += 0.55;
			//开始第一墩的比牌
			this.scheduleOnce(function () {
				//to do
				let uiPos = self.RoomPosMgr.GetUIPosByDataPos(list1[playerIdx].posIdx);    //玩家位置

				let path = "sp_seat0" + uiPos + "/seat_dun/UILSDunCards";
				let dunCards = self.GetWndNode(path);

				let playerDunInfo = {};
				for (let idx = 0; idx < rankeds.length; idx++) {
					if (rankeds[idx].posIdx == list1[playerIdx].posIdx) {
						playerDunInfo = rankeds[idx].dunPos;
						break;
					}
				}

				//第一墩
				for (let cardIdx = 1; cardIdx < 4; cardIdx++) {
					//获取牌型
					let cardType = playerDunInfo.first[cardIdx - 1];
					let child = dunCards.getChildByName("dun_card" + cardIdx);
					self.ShowResultCard(cardType,child)
				}
				dunCards.getComponent("UILSDunCards").fanPaiAction(0)
				//显示牌型
				for (let idx = 0; idx < cardType1.length; idx++) {
					if (cardType1[idx].posIdx == list1[playerIdx].posIdx) {
						let aniNode = this.GetCardTypeNode(uiPos);
						aniNode.active = 1;
						aniNode.getChildByName("num").getComponent(cc.Label).string = self.Type[(cardType1[idx].card).toString()];
						//音效
						let pos = list1[playerIdx]["posIdx"];
						let sex = self.InitHeroSex(pos);
						let soundName = sex + "17CardType" + cardType1[idx]["card"];
						self.SoundManager.PlaySound(soundName);
						aniNode.getComponent(cc.Animation).play();
						console.log("第一墩牌", list1[playerIdx], cardType1[idx]["card"], self.Type[(cardType1[idx]["card"])], cardType1[idx]["cards"]);
						dunCards.getComponent("UILSDunCards").showCardType(0, cardType1[idx]["card"])
						break;
					}
				}
				for (let idx = 0; idx < cardResult1.length; idx++) {
					if (cardResult1[idx].posIdx == list1[playerIdx].posIdx) {
						//显示分数
						let scoreNode = this.GetScoreNode(uiPos, 1);
						scoreNode.active = true;
						let baseShui = cardResult1[idx]["baseShui"];
						let extraShui = cardResult1[idx]["extraShui"];
						baseShui += extraShui
						baseShui = cardResult1[idx]["protoShui"];
						if (baseShui > 0) {
							scoreNode.getChildByName("score_win").active = true;
							scoreNode.getChildByName("score_lose").active = false;
							self.showLabel(scoreNode.getChildByName("score_win"), baseShui);
						} else {
							scoreNode.getChildByName("score_win").active = false;
							scoreNode.getChildByName("score_lose").active = true;
							self.showLabel(scoreNode.getChildByName("score_lose"), baseShui);
						}
						break;
					}
				}
			}, timer);
		}

		for (let playerIdx = 0; playerIdx < list2.length; playerIdx++) {
			//如果当前玩家是特殊牌 继续显示牌背
			let isSpacial = false;
			for (let idx = 0; idx < spacialCard.length; idx++) {
				if (spacialCard[idx].posIdx == list2[playerIdx].posIdx) {
					isSpacial = true;
				}
			}
			if (isSpacial) {
				continue;
			}

			timer += 0.55;
			//开始第二墩比牌
			this.scheduleOnce(function () {
				//to do
				let uiPos = self.RoomPosMgr.GetUIPosByDataPos(list2[playerIdx].posIdx);    //玩家位置

				let path = "sp_seat0" + uiPos + "/seat_dun/UILSDunCards";
				let dunCards = self.GetWndNode(path);

				let playerDunInfo = {};
				for (let idx = 0; idx < rankeds.length; idx++) {
					if (rankeds[idx].posIdx == list2[playerIdx].posIdx) {
						playerDunInfo = rankeds[idx].dunPos;
						break;
					}
				}

				//第二墩
				for (let cardIdx = 4; cardIdx < 9; cardIdx++) {
					//获取牌型
					let cardType = playerDunInfo.second[cardIdx - 4];
					let child = dunCards.getChildByName("dun_card" + cardIdx);
					self.ShowResultCard(cardType,child)
				}
				dunCards.getComponent("UILSDunCards").fanPaiAction(1)
				//显示牌型
				for (let idx = 0; idx < cardType2.length; idx++) {
					if (cardType2[idx].posIdx == list2[playerIdx].posIdx) {
						let aniNode = this.GetCardTypeNode(uiPos);
						aniNode.active = 1;
						aniNode.getChildByName("num").getComponent(cc.Label).string = self.Type[(cardType2[idx].card).toString()];
						//音效
						let pos = list2[playerIdx]["posIdx"];
						let sex = self.InitHeroSex(pos);
						let soundName = sex + "17CardType" + cardType2[idx]["card"];
						self.SoundManager.PlaySound(soundName);
						aniNode.getComponent(cc.Animation).play();
						console.log("第二墩牌", list2[playerIdx], cardType2[idx]["card"], self.Type[(cardType2[idx]["card"])], cardType2[idx]["cards"]);
						dunCards.getComponent("UILSDunCards").showCardType(1, cardType2[idx]["card"])
						break;
					}
				}
				for (let idx = 0; idx < cardResult2.length; idx++) {
					if (cardResult2[idx].posIdx == list2[playerIdx].posIdx) {
						//显示分数
						let scoreNode = this.GetScoreNode(uiPos, 2);
						scoreNode.active = true;
						let baseShui = cardResult2[idx]["baseShui"];
						let extraShui = cardResult2[idx]["extraShui"];
						baseShui += extraShui
						baseShui = cardResult2[idx]["protoShui"];
						if (baseShui > 0) {
							scoreNode.getChildByName("score_win").active = true;
							scoreNode.getChildByName("score_lose").active = false;
							self.showLabel(scoreNode.getChildByName("score_win"), baseShui);
						} else {
							scoreNode.getChildByName("score_win").active = false;
							scoreNode.getChildByName("score_lose").active = true;
							self.showLabel(scoreNode.getChildByName("score_lose"), baseShui);
						}
						break;
					}
				}
			}, timer);

		}
		for (let playerIdx = 0; playerIdx < list3.length; playerIdx++) {
			//如果当前玩家是特殊牌 继续显示牌背
			let isSpacial = false;
			for (let idx = 0; idx < spacialCard.length; idx++) {
				if (spacialCard[idx].posIdx == list3[playerIdx].posIdx) {
					isSpacial = true;
				}
			}
			if (isSpacial) {
				continue;
			}

			timer += 0.55;
			//开始第三墩比牌
			this.scheduleOnce(function () {
				//to do
				let uiPos = self.RoomPosMgr.GetUIPosByDataPos(list3[playerIdx].posIdx);    //玩家位置

				let path = "sp_seat0" + uiPos + "/seat_dun/UILSDunCards";
				let dunCards = self.GetWndNode(path);

				let playerDunInfo = {};
				for (let idx = 0; idx < rankeds.length; idx++) {
					if (rankeds[idx].posIdx == list3[playerIdx].posIdx) {
						playerDunInfo = rankeds[idx].dunPos;
						break;
					}
				}
				//第三墩
				for (let cardIdx = 9; cardIdx < 14; cardIdx++) {
					//获取牌型
					let cardType = playerDunInfo.third[cardIdx - 9];
					let child = dunCards.getChildByName("dun_card" + cardIdx);
					self.ShowResultCard(cardType,child)
				}
				dunCards.getComponent("UILSDunCards").fanPaiAction(2)
				//显示牌型
				for (let idx = 0; idx < cardType3.length; idx++) {
					if (cardType3[idx].posIdx == list3[playerIdx].posIdx) {
						let aniNode = this.GetCardTypeNode(uiPos);
						aniNode.active = 1;
						aniNode.getChildByName("num").getComponent(cc.Label).string = self.Type[(cardType3[idx].card).toString()];
						aniNode.getComponent(cc.Animation).play();
						//音效
						let pos = list3[playerIdx]["posIdx"];
						let sex = self.InitHeroSex(pos);
						let soundName = sex + "17CardType" + cardType3[idx]["card"];
						self.SoundManager.PlaySound(soundName);
						console.log("第三墩牌", list3[playerIdx], cardType3[idx]["card"], self.Type[(cardType3[idx]["card"])], cardType3[idx]["cards"]);
						dunCards.getComponent("UILSDunCards").showCardType(2, cardType3[idx]["card"])
						break;
					}
				}
				for (let idx = 0; idx < cardResult3.length; idx++) {
					if (cardResult3[idx].posIdx == list3[playerIdx].posIdx) {
						//显示分数
						let scoreNode = this.GetScoreNode(uiPos, 3);
						scoreNode.active = true;
						let baseShui = cardResult3[idx]["baseShui"];
						let extraShui = cardResult3[idx]["extraShui"];
						baseShui += extraShui
						baseShui = cardResult3[idx]["protoShui"];
						if (baseShui > 0) {
							scoreNode.getChildByName("score_win").active = true;
							scoreNode.getChildByName("score_lose").active = false;
							self.showLabel(scoreNode.getChildByName("score_win"), baseShui);
						} else {
							scoreNode.getChildByName("score_win").active = false;
							scoreNode.getChildByName("score_lose").active = true;
							self.showLabel(scoreNode.getChildByName("score_lose"), baseShui);
						}
						break;
					}
				}
			}, timer);
		}

		//打枪
		if (gunFire.length) {
			timer += 1;
			this.scheduleOnce(function () {
				// 需要开始打枪音效
				// let sex = self.InitHeroSex(gunFire[this.clientPos]["key"]);
				// self.SoundManager.PlaySound(sex + "17Shoot");
				self.SoundManager.PlaySound("boy17Shoot");
			}, timer);
			for (let idx = 0; idx < gunFire.length; idx++) {
				timer += 1;
				this.scheduleOnce(function () {
					self.delayAnimation(gunFire[idx]);
				}, timer);
			}
		}
		if (fourbagger) {
			timer += 1;
			this.scheduleOnce(function () {
				self.SoundManager.PlaySound("boy17QuanLeiDa");
			}, timer);
			timer += 1;
			this.scheduleOnce(function () {
				self.fourAnimation.active = true;
				self.fourAnimation.getComponent(sp.Skeleton).setAnimation(0, "qld", false);
				self.SoundManager.PlaySound("sssBaoZha");
			}, timer);
		}

		//特殊牌
		if (spacialCard.length) {
			timer += 1;
			this.scheduleOnce(function () {
				//to do
				for (let spacialIdx = 0; spacialIdx < spacialCard.length; spacialIdx++) {
					let uiPos = self.RoomPosMgr.GetUIPosByDataPos(spacialCard[spacialIdx].posIdx);

					let path = "sp_seat0" + uiPos + "/seat_dun/UILSDunCards";
					let dunCards = self.GetWndNode(path);

					let playerDunInfo = {};
					for (let idx = 0; idx < rankeds.length; idx++) {
						if (spacialCard[spacialIdx].posIdx == rankeds[idx].posIdx) {
							playerDunInfo = rankeds[idx].dunPos;
							break;
						}
					}
					self.showAllCard(playerDunInfo, dunCards);
					//显示特殊牌型label
					dunCards.getChildByName("img_special").active = true;
					self.SetSpecailProperty(self.GetWndNode(path + "/img_special/special"), spacialCard[spacialIdx].card);
					console.log("播放特殊牌型2",self.Type[(spacialCard[spacialIdx].card).toString()],spacialCard[spacialIdx].card)
					var filePath = "game/special/" + spacialCard[spacialIdx].card
					cc.loader.loadRes(filePath, cc.Prefab, function (error, clip) {
						if (error) {
							return
						}
						let node = cc.instantiate(clip)
						self.node.addChild(node)
						node.getComponent(sp.Skeleton).setCompleteListener(()=>{
							if (node && cc.isValid(node)) {
								node.destroy()
							}
						})
					})
					if (spacialCard[spacialIdx].pid == self.HeroManager.GetHeroID()) {
						//音效
						let pos = spacialCard[spacialIdx]["posIdx"];
						let sex = self.InitHeroSex(pos);
						let soundName = sex + "17CardType" + spacialCard[spacialIdx]["card"];
						self.SoundManager.PlaySound(soundName);
					}
				}
			}, timer);
		}

		//显示总分
		timer += 0.5;
		this.scheduleOnce(() => {
			for (let idx = 0; idx < playerResults.length; idx++) {
				let simPlayer = playerResults[idx];
				let shui = simPlayer["shui"];
				let sportsPoint = simPlayer["sportsPoint"];
				let pos = simPlayer["posIdx"];
				let uiPos = this.RoomPosMgr.GetUIPosByDataPos(pos);    //玩家位置
				//显示总分数
				let scoreNode = this.GetScoreNode(uiPos, 4);
				scoreNode.active = true;
				if (shui > 0) {
					scoreNode.getChildByName("win").active = true;
					scoreNode.getChildByName("lost").active = false;
					scoreNode = scoreNode.getChildByName("win");
				} else {
					scoreNode.getChildByName("win").active = false;
					scoreNode.getChildByName("lost").active = true;
					scoreNode = scoreNode.getChildByName("lost");
				}
				this.showLabel(scoreNode, shui);
				let sportsPointNode = this.GetScoreNode(uiPos, 6);
				if (this.unionId > 0) {
					//显示竞技点
					this.GetScoreNode(uiPos, 4).active = false
					sportsPointNode.active = true;
					if (sportsPoint > 0) {
						sportsPointNode.children[0].active = true;
						sportsPointNode.children[1].active = false;
						this.showLabel(sportsPointNode.children[0], sportsPoint);
					} else {
						sportsPointNode.children[0].active = false;
						sportsPointNode.children[1].active = true;
						this.showLabel(sportsPointNode.children[1], sportsPoint);
					}
				} else {
					sportsPointNode.active = false;
				}
				if (playerResults.length - 1 == idx) {
					break;
				}
			}
		}, timer);

		//显示结算界面
		timer += 2;
		this.scheduleOnce(function () {
			self.UpdatePlayerScore();
			self.ShowResultFrom();
		}, timer);
	},
	GetDunCardsByServerDunPos: function (dunPos) {
		let cards = [];
		for (let key in dunPos) {
			let cardList = dunPos[key];
			for (let i = 0; i < cardList.length; i++) {
				cards.push(cardList[i]);
			}
		}
		return cards;
	},
	ShowResultSpacial: function (sRankingResult) {
		let cardResult1 = sRankingResult.pCardResult1; //第一墩比较结果
		let cardResult2 = sRankingResult.pCardResult2; //第二墩比较结果
		let cardResult3 = sRankingResult.pCardResult3; //第三墩比较结果

		let cardType1 = sRankingResult.pCard1;      //牌型1
		let cardType2 = sRankingResult.pCard2;      //牌型2
		let cardType3 = sRankingResult.pCard3;      //牌型3

		let spacialCard = sRankingResult.specialPockerCard; //特殊牌型

		let gunFire = sRankingResult.killRankins;    //打枪

		let simPlayerResult = sRankingResult.simPlayerResult; //前三墩比牌结果

		let fourbagger = sRankingResult.fourbagger; //全垒打

		let simResults = sRankingResult.simResults; //前三墩结果加打枪结果和全垒打结果

		let rankeds = sRankingResult.rankeds;      //所有人的牌

		let playerResults = sRankingResult.posResultList; //所有比牌总结果

		let self = this;
		//如果三位玩家或以上有特殊牌类型，则显示所有玩家的牌
		this.scheduleOnce(function () {
			//to do
			for (let playerIdx = 0; playerIdx < rankeds.length; playerIdx++) {
				let uiPos = self.RoomPosMgr.GetUIPosByDataPos(rankeds[playerIdx].posIdx);
				let path = "sp_seat0" + uiPos + "/seat_dun/UILSDunCards";
				let dunCards = self.GetWndNode(path);
				let playerDunInfo = rankeds[playerIdx].dunPos;
				self.showAllCard(playerDunInfo, dunCards);
				//显示特殊牌型label
				for (let idx = 0; idx < spacialCard.length; idx++) {
					if (rankeds[playerIdx].posIdx == spacialCard[idx].posIdx) {
						if(spacialCard[idx].isSpacial) continue
						dunCards.getChildByName("img_special").active = true;
						self.SetSpecailProperty(self.GetWndNode(path + "/img_special/special"), spacialCard[idx].card);
						spacialCard[idx].isSpacial = true;
						var filePath = "game/special/" + spacialCard[idx].card
						cc.loader.loadRes(filePath, cc.Prefab, function (error, clip) {
							if (error) {
								return
							}
							let node = cc.instantiate(clip)
							self.node.addChild(node)
							node.getComponent(sp.Skeleton).setCompleteListener(()=>{
								if (node && cc.isValid(node)) {
									node.destroy()
								}
							})
						})
						break;
					}
				}

				if (spacialCard[playerIdx]) {
					//音效
					let pos = spacialCard[playerIdx]["posIdx"];
					let sex = self.InitHeroSex(pos);
					let soundName = sex + "17CardType" + spacialCard[playerIdx]["card"];
					self.SoundManager.PlaySound(soundName);
				}
			}
		}, 1);
		//显示总分
		this.scheduleOnce(() => {
			for (let idx = 0; idx < playerResults.length; idx++) {
				let simPlayer = playerResults[idx];
				let shui = simPlayer["shui"];
				let sportsPoint = simPlayer["sportsPoint"];
				let pos = simPlayer["posIdx"];
				let uiPos = this.RoomPosMgr.GetUIPosByDataPos(pos);    //玩家位置
				//显示总分数
				let scoreNode = this.GetScoreNode(uiPos, 4);
				scoreNode.active = true;
				if (shui > 0) {
					scoreNode.getChildByName("win").active = true;
					scoreNode.getChildByName("lost").active = false;
					scoreNode = scoreNode.getChildByName("win");
				} else {
					scoreNode.getChildByName("win").active = false;
					scoreNode.getChildByName("lost").active = true;
					scoreNode = scoreNode.getChildByName("lost");
				}
				this.showLabel(scoreNode, shui);
				if (this.unionId > 0) {
					//显示竞技点
					this.GetScoreNode(uiPos, 4).active = false;
					let sportsPointNode = this.GetScoreNode(uiPos, 6);
					sportsPointNode.active = true;
					if (sportsPoint > 0) {
						sportsPointNode.children[0].active = true;
						sportsPointNode.children[1].active = false;
						this.showLabel(sportsPointNode.children[0], sportsPoint);
					} else {
						sportsPointNode.children[0].active = false;
						sportsPointNode.children[1].active = true;
						this.showLabel(sportsPointNode.children[1], sportsPoint);
					}
				}
				if (playerResults.length - 1 == idx) {
					break;
				}
			}
		}, 0.5);

		//显示结算界面
		this.scheduleOnce(function () {
			self.UpdatePlayerScore();
			self.ShowResultFrom();
		}, 3);
	},

	UpdatePlayerScore: function () {
		let room = this.RoomMgr.GetEnterRoom();
		let posList = room.GetRoomProperty("posList");
		let headCom = "UI" + app.subGameName.toUpperCase() + "Head";
		for (let idx = 0; idx < posList.length-this.ShareDefine.LookCount; idx++) {
			if (posList[idx]["pid"] > 0) {
				let uiPos = this.RoomPosMgr.GetUIPosByDataPos(posList[idx].pos);
				let path = "sp_seat0" + uiPos + "/head/" + headCom;
				let headNode = this.GetWndNode(path);
				let headScript = headNode.getComponent(headCom);
				headScript.UpDateLabJiFen();
				if (this.unionId > 0) {
					headScript.UpDateLabSportsPoint();
				}
			}
		}
	},

	ShowResultFrom: function () {
		this.HideZJBeiShu();
		let juShu = app[app.subGameName.toUpperCase() + "Room"]().GetRoomConfig().setCount;
		let setID = this.RoomMgr.GetEnterRoom().GetRoomProperty("setID");
		if (setID >= juShu && !this.ShareDefine.isCoinRoom) {
			this.btn_goon.active = false;
			this.FormManager.ShowForm("game/" + app.subGameName.toUpperCase() + "/UILSResultOne");
		} else {
			this.btn_goon.active = true;
			this.FormManager.ShowForm("game/" + app.subGameName.toUpperCase() + "/UILSResultOne");
		}

		//经纬说自己不准备也要看不到别人准备
		let room = this.RoomMgr.GetEnterRoom();
		let RoomPosMgr = room.GetRoomPosMgr();
		let clientPos = RoomPosMgr.GetClientPos();
		let clientPlayerInfo = RoomPosMgr.GetPlayerInfoByPos(clientPos);
		if (clientPlayerInfo["gameReady"]) {
			this.RefreshRoomShow();
		}
	},

	showLabel: function (nodeLabel, string) {
		nodeLabel.active = true;
		if (string >= 0) {
			nodeLabel.getComponent(cc.Label).string = "+" + string;
		} else {
			nodeLabel.getComponent(cc.Label).string = string;
		}
	},

	showAllCard: function (playerDunInfo, dunCards) {

		for (let cardIdx = 1; cardIdx < 14; cardIdx++) {
			if (cardIdx >= 1 && cardIdx < 4) {
				let cardType = playerDunInfo.first[cardIdx - 1];
				let child = dunCards.getChildByName("dun_card" + cardIdx);
				this.ShowResultCard(cardType, child);
				child.angle = 0
			} else if (cardIdx >= 4 && cardIdx < 9) {
				let cardType = playerDunInfo.second[cardIdx - 4];
				let child = dunCards.getChildByName("dun_card" + cardIdx);
				this.ShowResultCard(cardType, child);
				child.angle = 0
			} else {
				let cardType = playerDunInfo.third[cardIdx - 9];
				let child = dunCards.getChildByName("dun_card" + cardIdx);
				this.ShowResultCard(cardType, child);
				child.angle = 0
			}
		}
	},

	//获取打枪旋转角度
	getAngle: function (_x1, _y1, _x2, _y2) {
		let xx = _x2 - _x1;
		let yy = _y2 - _y1;

		let _tan = Math.abs(yy / xx);
		let angle_temp = 180 / Math.PI * Math.atan(_tan);
		console.log("初始角度 = ", _x1, _y1, _x2, _y2, xx,yy);
		let PI = 180;
		if (xx == 0) {
			angle_temp = PI / 2;
		}

		if (xx < 0.0 && yy >= 0.0) {
			console.log("111")
			angle_temp = PI - angle_temp;
		} else if (xx >= 0.0 && yy >= 0.0) {
			console.log("222")
			angle_temp = angle_temp;
		}else if (xx < 0.0 && yy < 0.0) {
			console.log("333")
			angle_temp = PI + angle_temp;
		} else if (xx >= 0.0 && yy < 0.0) {
			console.log("444")
			angle_temp = PI * 2.0 - angle_temp;
		}
		angle_temp -= 90
		console.log("最终角度 = ", angle_temp);

		return angle_temp
	},

	delayAnimation: function (gunFire) {
		//枪手位置
		let posIdx = this.RoomPosMgr.GetUIPosByDataPos(gunFire.key);
		let x1 = -1;
		let y1 = -1;
		if (-1 != posIdx) {
			let path = "sp_seat0" + posIdx;
			let node = this.node.getChildByName(path);
			let head = node.getChildByName("head")
			let world = node.convertToWorldSpaceAR(head.getPosition())
			let local = this.fireAnimation.parent.convertToNodeSpaceAR(world)
			x1 = local.x;
			y1 = local.y;
			this.fireAnimation.x = x1;
			this.fireAnimation.y = y1;
			this.fireAnimation.active = true;
		}

		//目标位置
		let pos = this.RoomPosMgr.GetUIPosByDataPos(gunFire.to);
		let targetPath = "sp_seat0" + pos;
		let targetNode = this.node.getChildByName(targetPath);
		let head = targetNode.getChildByName("head")
		let world = targetNode.convertToWorldSpaceAR(head.getPosition())
		let local = this.fireAnimation.parent.convertToNodeSpaceAR(world)
		let x2 = local.x;
		let y2 = local.y;
		//计算手枪旋转角度
		let ang = this.getAngle(x1, y1, x2, y2);
		this.fireAnimation.angle = ang;

		let state = this.fireAnimation.getComponent(sp.Skeleton).setAnimation(0, "animation", true);
		state.repeatCount = 3;
		//播放打枪动画,一共三枪
		let self = this;
		let sex = self.InitHeroSex(gunFire.key);
		let soundName = sex + "17BoBoBo";
		self.SoundManager.PlaySound(soundName);
		this.scheduleOnce(function () {
			if(!self || !cc.isValid(self)) return
			//随机位置显示洞
			let node = cc.instantiate(self.node.getChildByName("dankong"));
			node.active =  true
			node.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
			let minx = -50;
			let maxx = 50;
			let miny = -40;
			let maxy = 40;
			let x = parseInt(Math.random() * (maxx - minx + 1) + minx, 10);
			let y = parseInt(Math.random() * (maxy - miny + 1) + miny, 10);
			node.setPosition(cc.v2(x, y));
			node.scale = 0.6
			let holes = self.GetWndNode("sp_seat0" + pos + "/holes");
			if (holes) {
				holes.addChild(node);
			}
			holes.zIndex = 10000
			cc.tween(node).delay(2.3).call(()=>{
				if(!node || !cc.isValid(node)) return
				let SpEnt =  node.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
				SpEnt.animationStart = SpEnt.animationEnd;
			}).start()
		});
	},

	ShowResultCard: function (cardType, node) {

		let newPoker = this.PokerCard.SubCardValue(cardType);
		this.PokerCard.GetPokeCard(newPoker, node);

		node.getChildByName("poker_back").active = false;
		node.getChildByName("icon_mapai").active = false;

		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			return;
		}
		let kexuanwanfa = room.GetRoomConfigByProperty("kexuanwanfa");
		if (kexuanwanfa.length > 0) {
			if (kexuanwanfa.indexOf(0) > -1) {
				let maPaiValue = this.RoomSet.GetRoomSetProperty("mapai");
				if (newPoker == maPaiValue) {
					node.getChildByName("icon_mapai").active = true;
				} else {
					node.getChildByName("icon_mapai").active = false;
				}
			} else {
				node.getChildByName("icon_mapai").active = false;
			}
		}
	},

	GetUICardComponentByPos: function (pos) {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			console.error("GetUICardComponentByPos not enter room");
			return;
		}

		let headCom = "UI" + app.subGameName.toUpperCase() + "Head";
		let posList = room.GetRoomProperty("posList");
		for (let idx = 0; idx < posList.length-this.ShareDefine.LookCount; idx++) {
			if (pos == posList[idx].pos) {
				let uiPos = this.RoomPosMgr.GetUIPosByDataPos(posList[idx].pos);
				let path = "sp_seat0" + uiPos + "/head/" + headCom;
				let headNode = this.GetWndNode(path);
				if(!headNode) continue
				let headScript = headNode.getComponent(headCom);
				return headScript;
			}
		}
	},
	//显示玩家准备状态
	ShowPlayerReady: function (room) {
		if (!room) {
			console.error("Event_ShowReadyOrNoReady not enter room");
			return
		}
		let roomSetID = room.GetRoomProperty("setID");
		let ReadyState = "";
		if (roomSetID > 0) {
			ReadyState = "gameReady";
		} else {
			ReadyState = "roomReady";
		}

		this.SetPlayerReadyInfo(ReadyState);
	},
	SetPlayerReadyInfo: function (ReadyState) {
		let roomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
		let clientPos = roomPosMgr.GetClientPos();
		let playerAll = roomPosMgr.GetRoomAllPlayerInfo();
		let playerAllList = Object.keys(playerAll);
		let isAllReady = false;
		//判断下所有玩家是否都准备
		if (ReadyState == "roomReady") {
			let curReadyNum = 0;
			let tempNum = 0;
			for (let j = 0; j < playerAllList.length; j++) {
				let readyPlayer = playerAll[playerAllList[j]];
				if (readyPlayer[ReadyState] && readyPlayer["pid"] > 0) {
					curReadyNum++;
				}
				if (readyPlayer["name"] != "" && readyPlayer["pid"] > 0) {
					tempNum++;
				}
			}
			if (this.playerMinNum != this.playerNum && this.playerMinNum <= curReadyNum) {
				isAllReady = true;
			}
			if (tempNum != curReadyNum) {
				isAllReady = false;
			}
			//tempNum == curReadyNum &&
		}
		this.btn_go.active = false;
		for (let key in playerAll) {
			let player = playerAll[key];
			if (player["pid"] > 0) {
				let pos = player["pos"];
				let isReady = player[ReadyState];
				this.ShowOrHideZhunbei(pos, isReady);
				if (clientPos == pos) {//自己
					this.btn_ready.active = !isReady;
					if (ReadyState == "roomReady" && isAllReady) {
						if (this.Room.IsClientIsCreater()) {
							this.btn_go.active = true;
						}
					}
				}
			}
		}
	},

	/**
	 * 2次确认点击回调
	 */
	SetWaitForConfirm: function (msgID, type, msgArg = [], cbArg = []) {
		let ConfirmManager = app[app.subGameName + "_ConfirmManager"]();
		ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, msgArg);
		ConfirmManager.ShowConfirm(type, msgID, msgArg);
	},

	Click_btn_jiesan: function () {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			console.error("Click_btn_jiesan not enter room");
			return
		}
		let roomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
		if (app[app.subGameName + "_ShareDefine"]().isCoinRoom) {
			//Event_ExitRoomSuccess 都有做退出处理
			//Event_CodeError
			// let needArg = roomPosMgr.GetClientPos();
			// let roomID = this.RoomMgr.GetEnterRoomID();
			// app[app.subGameName + "_GameManager"]().SendExitRoom(roomID, needArg);
			// app[app.subGameName + "_FormManager"]().AddDefaultFormName("UIPractice");
			console.log("coinRoom房间");
			app[app.subGameName + "Client"].ExitGame();
			return;
		}

		let state = room.GetRoomProperty("state");
		if (state == this.ShareDefine.RoomState_End) {
			//直接退出到大厅
			console.log("游戏结束", state);
			this.ShowDanJuForm();
			return;
		}

		let ClientPos = roomPosMgr.GetClientPos();
		let player = roomPosMgr.GetPlayerInfoByPos(ClientPos);
		if (!player) {
			return;
		}
		if(this.RoomPosMgr.GetIsLook()){
			let msgID = "UIMoreTuiChuFangJian";
			app[app.subGameName + "_ConfirmManager"]().SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, []);
			app[app.subGameName + "_ConfirmManager"]().ShowConfirm(this.ShareDefine.Confirm, msgID, []);
			return
		}
		let posName = player.name;
		let roomID = this.RoomMgr.GetEnterRoomID();
		let setState = this.RoomSet.GetRoomSetProperty("state");
		if (setState == this.ShareDefine.SetState_Hog && player.isPlaying) {//抢庄中
			if (this.jiesan == 2) {
				app[app.subGameName + "_FormManager"]().ShowForm(app.subGameName + "_UIMessage", null, this.ShareDefine.ConfirmOK, 0, 0, "此房间不可解散");
				return;
			}
			app[app.subGameName + "_ConfirmManager"]().SetWaitForConfirmForm((clickType) => {
				if (clickType == "Sure") {
					app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID);
				}
			}, "", []);
			app[app.subGameName + "_ConfirmManager"]().ShowConfirm(this.ShareDefine.Confirm, "", "是否要解散房间");
			return;
		}
		if (setState == this.ShareDefine.SetState_AddDouble && player.isPlaying) {//加倍中
			if (this.jiesan == 2) {
				app[app.subGameName + "_FormManager"]().ShowForm(app.subGameName + "_UIMessage", null, this.ShareDefine.ConfirmOK, 0, 0, "此房间不可解散");
				return;
			}
			app[app.subGameName + "_ConfirmManager"]().SetWaitForConfirmForm((clickType) => {
				if (clickType == "Sure") {
					app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID);
				}
			}, "", []);
			app[app.subGameName + "_ConfirmManager"]().ShowConfirm(this.ShareDefine.Confirm, "", "是否要解散房间");
			return;
		}
		if (setState == this.ShareDefine.SetState_Playing && player.isPlaying) {//比牌中
			if (this.jiesan == 2) {
				app[app.subGameName + "_FormManager"]().ShowForm(app.subGameName + "_UIMessage", null, this.ShareDefine.ConfirmOK, 0, 0, "此房间不可解散");
				return;
			}
			app[app.subGameName + "_ConfirmManager"]().SetWaitForConfirmForm((clickType) => {
				if (clickType == "Sure") {
					app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID);
				}
			}, "", []);
			app[app.subGameName + "_ConfirmManager"]().ShowConfirm(this.ShareDefine.Confirm, "", "是否要解散房间");
			return;
		}
		if (setState == this.ShareDefine.SetState_End && player.isPlaying) {//比牌中
			if (this.jiesan == 2) {
				app[app.subGameName + "_FormManager"]().ShowForm(app.subGameName + "_UIMessage", null, this.ShareDefine.ConfirmOK, 0, 0, "此房间不可解散");
				return;
			}
			app[app.subGameName + "_ConfirmManager"]().SetWaitForConfirmForm((clickType) => {
				if (clickType == "Sure") {
					app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID);
				}
			}, "", []);
			app[app.subGameName + "_ConfirmManager"]().ShowConfirm(this.ShareDefine.Confirm, "", "是否要解散房间");
			return;
		}
		let msgID = "";

		let roomCfg = room.GetRoomConfig();
		if (roomCfg.createType == 2 || roomCfg.clubId != 0) {
			msgID = "UIMoreTuiChuFangJian";
		} else {
			if (room.IsClientIsCreater()) {
				msgID = "PlayerLeaveRoom";
			} else {
				msgID = "UIMoreTuiChuFangJian";
			}
		}
		app[app.subGameName + "_ConfirmManager"]().SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, []);
		app[app.subGameName + "_ConfirmManager"]().ShowConfirm(this.ShareDefine.Confirm, msgID, []);
	},
	Click_btn_goon: function () {
		if (app[app.subGameName + "_ShareDefine"]().isCoinRoom) {
			app[app.subGameName + "_NetManager"]().SendPack("game.CGoldRoom", {practiceId: app[app.subGameName + "_ShareDefine"]().practiceId}, this.OnSuccess.bind(this), this.OnEnterRoomFailed.bind(this));
		} else {
			let room = this.RoomMgr.GetEnterRoom();
			let state = room.GetRoomProperty("state");
			if (state == this.ShareDefine.RoomState_End) {
				this.ShowDanJuForm();
				return;
			}
			if(this.RoomPosMgr.GetIsLook()){
				return
			}
			let roomID = room.GetRoomProperty("roomID");
			app[app.subGameName + "_GameManager"]().SendContinueGame(roomID);
		}
	},
	Click_btn_qiepai: function () {
		let room = this.RoomMgr.GetEnterRoom();
		let state = room.GetRoomProperty("state");
		if (state == this.ShareDefine.RoomState_End) {
			this.ShowDanJuForm();
			return;
		}
		cc.log("发送切牌")
		let roomID = room.GetRoomProperty("roomID");
		app[app.subGameName + "_GameManager"]().SendQiePai(roomID);
	},
	Click_btn_baipai: function () {
		let room = this.RoomMgr.GetEnterRoom();
		let state = room.GetRoomProperty("state");
		if (state == this.ShareDefine.RoomState_End) {
			return;
		}
		cc.log("发送摆牌")
		let roomID = room.GetRoomProperty("roomID");
		let self = this;
		app[app.subGameName + "_GameManager"]().SendBaiPai(roomID,(err, data)=>{
			console.log("查询")
			self.LogicRank.Init()
			self.FormManager.ShowForm("game/" + app.subGameName.toUpperCase() + "/UIFJSSZRank");
		});
	},
	Click_btn_banker: function (btnName) {
		let bankerBSNum = parseInt(btnName.substring(10, btnName.length));
		this.RoomMgr.SendQiangZhuang(bankerBSNum);
		this.bankerList.active = false;
	},
	Click_btn_addDouble: function (btnName) {
		let bankerBSNum = parseInt(btnName.substring(10, btnName.length));
		this.RoomMgr.SendConfirmBeiShu(bankerBSNum);
		this.addDouble.active = false;
	},
	/**
	 * 2次确认点击回调
	 * @param curEventType
	 * @param curArgList
	 */
	OnConFirm: function (clickType, msgID, backArgList) {
		let room = this.RoomMgr.GetEnterRoom();
		cc.log("OnConFirm",msgID)
		if (clickType != "Sure") {
			if (msgID == "SportsPointNotEnough") {
				let roomID = this.RoomMgr.GetEnterRoomID();
				app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID);
			}
			return;
		}
		if (msgID == "PlayerLeaveRoom") {
			let roomID = this.RoomMgr.GetEnterRoomID();
			app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID);
		} else if (msgID == "UIPlay_BeKick") {
			console.log("UIPlay_BeKick");
			app[app.subGameName + "Client"].ExitGame();
		} else if (msgID == "OwnnerForceRoom") {
			console.log("OwnnerForceRoom");
			app[app.subGameName + "Client"].ExitGame();
		} else if (msgID == "DissolveRoom") {
			console.log("DissolveRoom");
			let roomSetID = this.Room.GetRoomProperty("setID");
			if (roomSetID > 0) {
				this.ShowDanJuForm();
				return;
			}
			app[app.subGameName + "Client"].ExitGame();
		} else if (msgID == "MSG_BeKick" || msgID == "MSG_BeDissolve") {
			console.log("MSG_BeKick MSG_BeDissolve");
			app[app.subGameName + "Client"].ExitGame();
		} else if (msgID == "UIMoreTuiChuFangJian") {
			if(this.RoomPosMgr.GetIsLook()){
				let roomID = this.RoomMgr.GetEnterRoomID();
				let roomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
				let pos = roomPosMgr.posId
				app[app.subGameName + "_GameManager"]().SendExitRoom(roomID, pos);
				return
			}
			let roomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
			let ClientPos = roomPosMgr.GetClientPos();
			let player = roomPosMgr.GetPlayerInfoByPos(ClientPos);
			if (!player)
				return;
			let posName = player.name;
			let roomID = this.RoomMgr.GetEnterRoomID();
			let state = room.GetRoomProperty("state");
			if (state == this.ShareDefine.SetState_Hog && player.isPlaying) {//抢庄中
				app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID, posName);
				return;
			}
			if (state == this.ShareDefine.SetState_AddDouble && player.isPlaying) {//加倍中
				app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID, posName);
				return;
			}
			if (state == this.ShareDefine.SetState_Playing && player.isPlaying) {//比牌中
				app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID, posName);
				return;
			}
			if (state == this.ShareDefine.SetState_End && player.isPlaying) {//比牌中
				app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID, posName);
				return;
			}
			//房主不能退出房间，只能解散
			if (this.RoomMgr.GetEnterRoom().IsClientIsOwner()) {
				app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID, posName);
				return
			}
			app[app.subGameName + "_GameManager"]().SendExitRoom(roomID, ClientPos);
		} else if ("MSG_Room_Change" == msgID) {
			let roomID = this.RoomMgr.GetEnterRoomID();
			let that = this;
			app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ChangePlayerNum", {"roomID": roomID}, function (success) {
			}, function (error) {
				let msg = error.Msg;
				that.ShowSysMsg(msg);
			});
		}
	},


	Event_GameGift: function (event) {
		let self = this;
		let argDict = event;
		let sendPos = argDict['sendPos'];
		let recivePos = argDict['recivePos'];
		let productId = argDict['productId'];
		let sendHead = app[app.subGameName + "_HeadManager"]().GetComponentByPos(sendPos);
		let reciveHead = app[app.subGameName + "_HeadManager"]().GetComponentByPos(recivePos);
		let giftIdx = productId - 1;
		let tempNode = cc.instantiate(this.giftPrefabs[giftIdx]);
		let ani = tempNode.getComponent(cc.Animation);
		// tempNode.tag = giftIdx;
		tempNode.name = ani.defaultClip.name;
		tempNode.bMove = true;
		ani.on("finished", this.OnGiftAniEnd, this);
		let vec1 = sendHead.node.convertToWorldSpaceAR(cc.v2(0, 0));
		let vec2 = reciveHead.node.convertToWorldSpaceAR(cc.v2(0, 0));
		vec1 = this.giftNode.convertToNodeSpaceAR(vec1);
		vec2 = this.giftNode.convertToNodeSpaceAR(vec2);
		tempNode.x = vec1.x;
		tempNode.y = vec1.y;
		this.giftNode.addChild(tempNode);
		let action = cc.sequence(
			cc.moveTo(0.3, vec2),
			cc.callFunc(self.GiftMoveEnd, self)
		);
		tempNode.runAction(action);
	},
	GiftMoveEnd: function (sender, useData) {
		sender.getComponent(cc.Animation).play();
		sender.bMove = false;
		//播放音效
		app[app.subGameName + "_SoundManager"]().PlaySound('mofa_' + sender.name);
	},
	OnGiftAniEnd: function (event) {
		let nodes = this.giftNode.children;
		for (let i = nodes.length; i > 0; i--) {
			if (event) {
				let aniState = nodes[i - 1].getComponent(cc.Animation).getAnimationState(nodes[i - 1].name);
				if (aniState.isPlaying)
					continue;
				if (!nodes[i - 1].bMove)
					nodes[i - 1].removeFromParent();
			} else
				nodes[i - 1].removeFromParent();
		}
	},

	Event_TouchStart: function (event) {
		app[app.subGameName + "_AudioManager"]().startRecord();

	},
	Event_TouchEnd: function (event) {
		this.FormManager.CloseForm(app.subGameName + "_UIAudio");
		app[app.subGameName + "_AudioManager"]().setTouchEnd(true);
		app[app.subGameName + "_AudioManager"]().stopRecord();
	},
	OnTest:function(){
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
	
	SetSpecailProperty:function (node, cardType) {
		if(!node) return
		cc.log("SetSpecailProperty", node, cardType)
		cc.loader.loadRes("texture/game/ls/play/type"+cardType, cc.SpriteFrame, function (err, assets) {
			if (err) {
				cc.error(err);
				return;
			}
			node.parent.zIndex = 10000
			node.scale = 0.6
			node.getComponent(cc.Sprite).spriteFrame = assets
		});
	},
	updateLookInfo(){

		this.node.getChildByName("btn_sit").active = this.RoomPosMgr.GetIsLook()
		// this.node.getChildByName("btn_stand").active = !this.RoomPosMgr.GetIsLook()
		if (this.Room.IsClientIsCreater()) {
			this.node.getChildByName("btn_stand").active = false
		}
		let room = this.RoomMgr.GetEnterRoom();
		if (this.node.getChildByName("btn_stand").active) {
			let heroID = app[app.subGameName + "_HeroManager"]().GetHeroID();
			let pl = this.RoomPosMgr.GetPlayerInfoByPid(heroID)
			if (pl && pl.isPlaying) {
				this.node.getChildByName("btn_stand").active = false
			}
		}
		if(this.RoomPosMgr.GetIsLook()){
			this.btn_goon.active = false
			this.btn_ready.active = false
		
		}else {

		}
		this.node.getChildByName("btn_sit").zIndex = 1
	},
	update(){
		this.updateLookInfo()
		for (let uiPos = 0; uiPos < 8; uiPos++) {
			if(this.GetWndNode("sp_seat0" + uiPos + "/seat_dun").active == true){
				this.GetWndNode("sp_seat0" + uiPos + "/sp_card").active = false;
			}
		}
	}
});