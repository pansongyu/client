var app = require("nn_app");
cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {
		cardPrefab: cc.Prefab,
		scorePrefab: cc.Prefab,
		headPrefab: cc.Prefab,
		giftPrefabs: [cc.Prefab],
		UIInvitation: cc.Prefab,
	},
	OnCreateInit: function () {
		this.InitEvent();
		this.ZorderLv = 6;
		this.btnGroups = [];

		this.UtilsWord = app[app.subGameName + "_UtilsWord"]();
		this.PokerModle = app[app.subGameName + "_PokerCard"]();
		this.Room = app[app.subGameName.toUpperCase() + "Room"]();
		this.RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
		this.serverTime = app[app.subGameName + "_ServerTimeManager"]().GetServerTimeData();
		this.stateStartTime = 0;//游戏阶段开始的服务器时间
		this.isPlayIngEnter = true;//中途加入(用于控制动画等同步)
		this.bUpdateTip = false;
		this.randHeadList = [];//随机庄家位置列表
		this.startRandBanker = false;
		this.isRandBacker = false;
		this.isShowAllResultIng = false;//动画结束后才调用总结算有可能没收到包处理
		this.lastRandBankerTime = 0;

		this.RoomState = {
			"Init": 0,
			"Play": 1,
			"End": 2
		};
		this.gameState = {
			DealPokerOne: 0,//发牌1
			LootBanker: 1, //抢庄
			SureBanker: 2,//确认庄家
			Bet: 3, //下注
			DealPokerSecond: 4, //发牌2
			Result: 5, //结算
		};

		this.invitationNode = cc.instantiate(this.UIInvitation);
		this.node.addChild(this.invitationNode);

		this.giftNode = this.node.getChildByName("giftNode");
		this.pokerFrame = this.node.getChildByName("pokerFrame");
		this.pokerTypeFrame = this.node.getChildByName("pokerTypeFrame");
		this.scoreFrame = this.node.getChildByName("scoreFrame");
		this.selfCard = this.GetWndNode("selfCard/pos");
		this.tipLabel = this.GetWndComponent("bg_tips/label", cc.Label);
		this.randBankerNode = this.GetWndNode("headNodes/icon_random");
		this.btnFrame = this.node.getChildByName("btnFrame");
		this.startAni = this.node.getChildByName("startAniNode");
		this.hasNiuTipNode = this.node.getChildByName("icon_tip");
		for (let i = 0; i < this.btnFrame.children.length; i++) {
			this.btnGroups.push(this.btnFrame.children[i]);
		}
		this.InitCommon();


	},
	//--------------显示函数-----------------
	OnShow: function () {
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
		this.CheckUpdateNotice();
		this.FormManager.ShowForm(app.subGameName + "_UIMore");
		this.FormManager.ShowForm(app.subGameName + "_UIVoice");
		this.FormManager.ShowForm(app.subGameName + "_UIMark");

		this.tipLabel.string = "等待其他玩家";
		this.tipLabel.node.parent.active = true;
		this.appIsHide = false;
		this.isConnect = true;
		this.bUpdateTip = false;
		this.bCompareIng = false;
		this.isDealPokerEnd = false;
		this.isShowAllResultIng = false;
		this.RoomCfg = this.Room.GetRoomConfig();
		this.clientPos = this.Room.GetClientPos();

		if (this.RoomCfg.clubId > 0 || this.RoomCfg.unionId > 0) {
		//	this.invitationNode.active = true;
			this.invitationNode.getComponent(this.invitationNode.name).InitData(this.RoomCfg.clubId, this.RoomCfg.unionId, roomID);
		} else {
			this.invitationNode.active = false;
		}
		if (0 == this.RoomCfg.sign) {
			this.gameName = "zyqz_nn";
		} else if (1 == this.RoomCfg.sign) {
			this.gameName = "nnsz_nn";
		} else if (2 == this.RoomCfg.sign) {
			this.gameName = "gdzj_nn";
		} else if (3 == this.RoomCfg.sign) {
			this.gameName = "tbnn_nn";
		} else if (4 == this.RoomCfg.sign) {
			this.gameName = "mpqz_nn";
		} else if (5 == this.RoomCfg.sign) {
			this.gameName = "lz_nn";
		}

	     cc.log("初始化头像");
		 this.InitAllHead();

		this.RefreshHead(-1);
		this.UpdateRoomInfo();
		app[app.subGameName + "Client"].OnEvent("Head_PosUpdate", {});
		//Head_PosUpdate不会刷新双十庄家因为动画完才刷出庄家图标
		app[app.subGameName + "Client"].OnEvent("Head_UpdateBacker", {"bShow": true});

		let disslove = this.Room.GetRoomProperty("dissolve");
		if (disslove.endSec != 0) {
			this.FormManager.ShowForm(app.subGameName + "_UIMessage02");
		}

		/*//获取用户推广Url
		this.GetTuiGuangUrl();*/
		this.OnGiftAniEnd(null); //清理表情
	},
	InitCommon: function () {
	
		this.isConnect = false;//断网了不处理之前来的任何消息(卡的时候出现)
		this.appIsHide = false;//判断是否在后台
		this.niuNumLabels = [];
		this.selectCards = [];
		this.niuBtns = [];//有牛没牛按钮
		this.initPos = -300;
		this.outPos = -260;
		for (let i = 0; i < this.btnGroups.length; i++) {
			if (2 == i) {
				for (let j = 0; j < 4; j++) {
					let childName = 'label' + j;
					let labelNode = this.btnGroups[i].getChildByName(childName);
					this.niuNumLabels.push(labelNode);
				}
				this.niuBtns.push(this.btnGroups[i].getChildByName("btn_youniu"));
				this.niuBtns.push(this.btnGroups[i].getChildByName("btn_meiniu"));
			}
			this.btnGroups[i].active = false;
		}

		this.pokers = [];
		this.pokerTypes = [];
		this.scores = [];//ui结算分数
		this.pokersPos = [
			[0, -330],
			[755, -290],
			[755, -30],
			[755, 220],
			[390, 300],
			[0, 300],
			[-390, 300],
			[-790, 220],
			[-790, -30],
			[-790, -290]
		];//不用坐标转换有BUG写死

		this.isDealPokerEnd = false;
		this.randBankerNode.active = false;
		this.hasNiuTipNode.active = false;
		this.startAni.active = false;
		this.startAni.getComponent(cc.Animation).on("finished", this.OnStartFinished, this);

		this.tipLabel.string = "等待其他玩家";
		this.tipLabel.node.parent.active = true;

		for (let i = 1; i <= 10; i++) {
			let posName = 'pos' + i;
			let posNode = this.pokerFrame.getChildByName(posName);
			posNode.active = false;
			this.pokers.push(posNode);
			posNode = this.pokerTypeFrame.getChildByName(posName);
			posNode.active = false;
			this.pokerTypes.push(posNode);
			posNode = this.scoreFrame.getChildByName(posName);
			posNode.active = false;
			this.scores.push(posNode);
		}
		//牌面初始化
		let players = this.Room.GetRoomAllPlayerInfo();
		for (let i = 0; i < players.length; i++) {
			for (let j = 0; j < 5; j++) {
				let cardNode = cc.instantiate(this.cardPrefab);
				cardNode.name = "card" + j;
				cardNode.x = 0;
				cardNode.y = 0;
				this.pokers[i].addChild(cardNode);
			}
		}
		//自己能划动的牌那边初始化
		for (let j = 0; j < 5; j++) {
			let cardNode = cc.instantiate(this.cardPrefab);
			cardNode.name = "card" + j;
			cardNode.x = 0;
			cardNode.y = 0;
			cardNode.addComponent(cc.Button);
			cardNode.on("click", this.OnCardClick, this);
			this.selfCard.addChild(cardNode);
		}
		// cc.log("初始化头像");
		// this.InitAllHead();
	},
	InitEvent: function () {
		//基础网络包
		this.RegEvent("NN_PosContinueGame", this.Event_PosContinueGame);
		this.RegEvent("NN_PosReadyChg", this.Event_PosReadyChg);
		this.RegEvent("NN_PosUpdate", this.Event_PosUpdate);
		this.RegEvent(app.subGameName.toUpperCase() + "_AllPosUpdate", this.Event_AllPosUpdate, this);
		this.RegEvent("NN_PosLeave", this.Event_PosLeave);
		this.RegEvent("NN_DissolveRoom", this.Event_DissolveRoom);//房间解散
		this.RegEvent("NN_StartVoteDissolve", this.Event_StartVoteDissolve);//发起房间结算投票
		//this.RegEvent("PosDealVote", this.Event_UpdateDissolve);//发起房间结算投票

		//游戏逻辑包
		this.RegEvent("SetStart", this.Event_SetStart);//游戏开始
		this.RegEvent("NN_StatusChange", this.Event_StatusChange);//阶段通知
		this.RegEvent("SetEnd", this.Event_SetEnd);//结算
		this.RegEvent("NN_OpenCard", this.Event_OpenCard);//玩家亮牌通知
		this.RegEvent("NN_AddBet", this.Event_AddBet);//玩家下注通知
		this.RegEvent("NN_RoomEnd", this.Event_RoomEnd);//房间结束
		this.RegEvent("NN_CallBacker", this.Event_CallBacker);//玩家抢庄通知

		this.RegEvent("GameGift", this.Event_GameGift, this);
		this.RegEvent("ChatMessage", this.Event_ChatMessage);
		this.RegEvent("OnEventShow", this.OnEventShow);
		this.RegEvent("OnEventHide", this.OnEventHide);
		this.RegEvent('RubPokerEnd', this.OnRubPokerEnd);

		this.RegEvent('Event_XiPai', this.OnXiPaiNtf);
		//竞技点不足时通知
		this.RegEvent("SportsPointEnough", this.Event_SportsPointEnough);
		this.RegEvent("SportsPointNotEnough", this.Event_SportsPointNotEnough);
	},
	InitAllHead: function () {
		this.headNode = this.GetWndNode("headNodes/headNode");
		this.headPosNode = this.GetWndNode("headNodes/headPos");

		let posNodes = this.headPosNode.children;
		let players = this.Room.GetRoomAllPlayerInfo();
	
		cc.log(players);
		cc.log(this.headNode);

		 let heads = this.headNode.children;
		if(heads.length > 0) {
			for (let i = 0; i < heads.length; i++) {
			
				let node = heads[i];
				node.active = false;
			}
	
		}
	
		for (let i = 0; i < players.length; i++) {
			let point = {x: posNodes[i].x, y: posNodes[i].y};
			let head = cc.instantiate(this.headPrefab);
			let otherNode = head.getChildByName('otherNode');
			let scoreNode = cc.instantiate(this.scorePrefab);
			scoreNode.name = 'otherInfo';
			scoreNode.x = -2;
			scoreNode.y = -70;
			scoreNode.getChildByName('score').active = false;
			scoreNode.getChildByName('other').active = false;
			otherNode.addChild(scoreNode);
			head.active = true;
			let headScript = head.getComponent(app.subGameName + "_UIPublicHead");
			headScript.Init(i, -1, point);
			this.headNode.addChild(head);
		}
	},
	clearHead: function () {
		let heads = this.headNode.children;
		for (let i = 0; i < heads.length; i++) {
			
			let node = heads[i];
			node.active = false;
		}
	},

	RefreshHead: function (pos) {
		cc.log("当前位置:",pos)
		let needUpdateReady = false;
		let roomState = this.Room.GetRoomProperty("state");
		if (roomState == this.RoomState.Init) {
			needUpdateReady = true;
		} else if (roomState == this.RoomState.Play) {
			let gameState = this.Room.GetRoomProperty("set").state;
			if (gameState == this.gameState.End) {
				needUpdateReady = true;
			}
		}

		let players = this.Room.GetRoomAllPlayerInfo();
		cc.log("所有玩家信息",players);
		let selfID = app[app.subGameName + "_HeroManager"]().GetHeroProperty("pid");
		let posNodes = this.headPosNode.children;
		let heads = this.headNode.children;
		for (let i = 0; i < players.length; i++) {

			if (players[i].pid <= 0) {
			    // cc.log("清除上一局多余头像");
			    // heads[i].active = false;
			//	heads[i].getComponent(app.subGameName + "_UIPublicHead").OnClose();
				continue;
			}

			if (-1 != pos && i != pos) {

				continue;
			}
			cc.log("当前位置:",pos)
			cc.log("当前玩家下标:",i)
			app[app.subGameName + "_WeChatManager"]().InitHeroHeadImage(players[i].pid, players[i].headImageUrl);
			let headScript = null;
			let point = {x: 0, y: 0};
			if (selfID == players[i].pid) {
				cc.log("id相等，设置自己的的位置");
				headScript = heads[0].getComponent(app.subGameName + "_UIPublicHead");
				headScript.Init(0, i, point, -1, false);
			} else {
				let uiPos = this.Room.GetUIPosByPos(i);
				cc.log("id不相等，设置新的位置");
				headScript = heads[uiPos].getComponent(app.subGameName + "_UIPublicHead");
				if (3 == uiPos || 4 == uiPos || 5 == uiPos) {
					headScript.Init(uiPos, i, point, -1, false, true);
				} else {
					headScript.Init(uiPos, i, point, -1, false);
				}
			}
			if (needUpdateReady) {
				headScript.setReady(players[i].roomReady);
			}
		}
	},
	HideAll: function () {
		for (let i = 0; i < this.btnGroups.length; i++)
			this.btnGroups[i].active = false;

		for (let i = 0; i < 10; i++) {
			this.pokerTypes[i].active = false;
			this.scores[i].active = false;
		}

		// this.tipLabel.string = '';
		// this.tipLabel.node.parent.active = false;
		if ("mpqz_nn" != this.gameName) {
			this.selfCard.active = false;
			for (let i = 0; i < 10; i++)
				this.pokers[i].active = false;
		} else {
			let roomState = this.Room.GetRoomProperty("state");
			if (roomState == this.RoomState.Play) {
				this.invitationNode.active = false;
				let gameState = this.Room.GetRoomProperty("set").state;
				if (gameState == this.gameState.DealPokerOne
					|| gameState == this.gameState.Result) {//发第一次牌才隐藏
					this.selfCard.active = false;
					this.pokers[0].active = false;
				}
			} else {
				this.selfCard.active = false;
				for (let i = 0; i < 10; i++)
					this.pokers[i].active = false;
			}
		}
		this.randBankerNode.active = false;
		this.hasNiuTipNode.active = false;
	},
	OnStartFinished: function (event) {
		this.startAni.active = false;
	},
	update: function (dt) {
		if (this.bUpdateTip) {
			this.UpdateTipState();
		}
		if (this.startRandBanker) {
			let nowTick = new Date().getTime();
			if (nowTick > this.lastRandBankerTime + 200) {
				this.lastRandBankerTime = nowTick;
				if (this.isRandBacker) {
					if (this.lastRandIndex >= this.randHeadList.length)
						this.lastRandIndex = 0;
					let headChilds = this.headNode.children;
					this.randBankerNode.x = headChilds[this.randHeadList[this.lastRandIndex]].x;
					this.randBankerNode.y = headChilds[this.randHeadList[this.lastRandIndex]].y;
					this.randBankerNode.active = true;
					this.lastRandIndex++;
				} else {
					let headChilds = this.headNode.children;
					this.randBankerNode.x = headChilds[this.randHeadList[0]].x;
					this.randBankerNode.y = headChilds[this.randHeadList[0]].y;
					this.randBankerNode.active = !this.randBankerNode.active;
				}
			}
		}
	},

	UpdateRoomInfo: function (updateState = -1) {
		if (!this.isConnect || this.appIsHide) {
			return;
		}
		let roomState = this.Room.GetRoomProperty("state");
		if (roomState != this.RoomState.End) {
			this.HideAll();
		}

		if (this.isPlayIngEnter) {
			this.stateStartTime = this.Room.GetGameStateTime();
		}

		if (roomState == this.RoomState.Init) {
			this.ShowPlayerReady();
		} else if (roomState == this.RoomState.Play) {
			this.invitationNode.active = false;
			let gameState = this.Room.GetRoomProperty("set").state;
			console.log("RoomInfo gameState", gameState, "update", updateState);
			if (this.isPlayIngEnter) {
				this.ResetAllPokerToCenter();
				this.PlayingEnterHandle(gameState);
				console.log("RoomInfo 2 gameState", gameState, "update", updateState);
				return;
			}

			console.log("RoomInfo 3 gameState", gameState, "update", updateState);
			if (gameState == this.gameState.DealPokerOne) {//发牌1
				this.UpdateDealPoker(updateState, gameState);
			} else if (gameState == this.gameState.LootBanker) {//抢庄
				this.UpdateLootBanker();
			} else if (gameState == this.gameState.SureBanker) {//确认庄家
				this.UpdateSureBanker(updateState);
			} else if (gameState == this.gameState.Bet) {//下注推注
				console.log("下注推注");
				//this.randBankerNode.active = false;
				if (0 == updateState) {//固定庄家从setStart那边
					this.UpdateSureBanker(updateState);
				}
				this.UpdateBet(updateState);
			} else if (gameState == this.gameState.DealPokerSecond) {//发牌2
				if (this.isPlayIngEnter) {
					this.isDealPokerEnd = true;
				} else {
					this.isDealPokerEnd = false;
				}
				this.UpdateDealPoker(updateState, gameState);
			} else if (gameState == this.gameState.Result) {//结算
				this.UpdateComparePoker();
				// 刷新玩家头像积分和比赛分
				let players = this.Room.GetRoomAllPlayerInfo();
				let heads = this.headNode.children;
				for (let i = 0; i < players.length; i++) {
					if (players[i].pid <= 0) {
						continue;
					}
					let uiPos = this.Room.GetUIPosByPos(i);
					let headScript = heads[uiPos].getComponent(app.subGameName + "_UIPublicHead");
					headScript.UpDateLabJiFen();
					headScript.UpDateLabSportsPoint();
				}
			}
			// let timeStr = this.ComTool.GetDateYearMonthDayHourMinuteString(this.stateStartTime);
			// console.error(timeStr);
			this.bUpdateTip = true;
		} else {
			//房间结束总结算放在比牌完后显示
			if (!this.bCompareIng && !this.isShowAllResultIng) {
				// this.UpdateAllResult();
			}
		}
	},
	GetShowPokerList: function (setNum, dealValue, setValue) {
		let showList = [dealValue, dealValue, dealValue, dealValue, dealValue];
		for (let i = 0; i < setNum; i++) {
			showList[i] = setValue;
		}
		return showList;
	},
	PlayingEnterHandle: function (gameState) {
		this.isDealPokerEnd = true;
		this.bUpdateTip = true;
		let dealNum = 5;
		if ("mpqz_nn" == this.gameName) {
			if (gameState == this.gameState.DealPokerOne) {
				dealNum = 4;
			} else if (gameState == this.gameState.DealPokerSecond) {
				dealNum = 1;
			}
		}
		//把所有牌位置先弄好
		this.ResetAllPokerToPosByDeal(dealNum);

		let needShowSelfIndex = [false, false, false, false, false];//显示第几张
		let needShowSelfBg = [true, true, true, true, true];//是否显示背景

		let needShowPokers = [false, false, false, false, false, false, false, false];
		let needShowPokersIndex = [];
		for (let i = 0; i < 10; i++) {
			let data = {};
			data.showList = [false, false, false, false, false];
			data.showBgList = [true, true, true, true, true];
			needShowPokersIndex.push(data);
		}

		//先取出所有ui位置
		let selfPos = this.Room.GetClientPos();
		let allPlayerData = this.Room.GetCurGameAllPlayerData();
		let uiPos = 0;
		let posDataList = [];
		posDataList.push({"dataPos": selfPos, "uiPos": 0});//自己的先加进去
		let selfIsPlayIng = allPlayerData[selfPos].isPlaying;
		this.selfCard.active = selfIsPlayIng;
		for (let i = 0; i < allPlayerData.length; i++) {
			if (i != selfPos) {
				uiPos = this.Room.GetUIPosByPos(i);
				posDataList.push({"dataPos": i, "uiPos": uiPos});
			}
		}

		let endPosNeedScale = true;//最后一张牌是否缩放回来
		for (let i = 0; i < allPlayerData.length; i++) {
			if (allPlayerData[i].isPlaying) {
				for (let j = 0; j < posDataList.length; j++) {
					if (i == posDataList[j].dataPos) {
						uiPos = posDataList[j].uiPos;
						if (0 != allPlayerData[i].addBet) {
							let heads = this.headNode.children;
							let otherInfo = heads[uiPos].getChildByName("otherNode").getChildByName("otherInfo");
							otherInfo.active = true;
							let other = otherInfo.getChildByName("other");
							other.active = false;
							let score = otherInfo.getChildByName("score");
							score.active = true;
							let scoreLabel = score.getChildByName("label").getComponent(cc.Label);
							scoreLabel.string = allPlayerData[i].addBet;
						}
						break;
					}
				}

				let isLookPoker = allPlayerData[i].checkCard;
				let isShowPoker = allPlayerData[i].openCard;
				if (gameState == this.gameState.DealPokerOne
					|| gameState == this.gameState.LootBanker
					|| gameState == this.gameState.SureBanker
					|| gameState == this.gameState.Bet) {//抢庄
					if ("mpqz_nn" == this.gameName) {
						//最后一张放中间
						endPosNeedScale = false;
						if (0 == uiPos) {
							needShowSelfIndex = this.GetShowPokerList(5, false, true);
							needShowSelfBg = this.GetShowPokerList(4, true, false);
						} else {
							needShowPokers[uiPos] = true;
							needShowPokersIndex[uiPos].showList = this.GetShowPokerList(5, false, true);
						}
					} else {
						this.ResetAllPokerToCenter();
					}
				} else if (gameState == this.gameState.DealPokerSecond) {//发牌2
					if (0 == uiPos) {
						if (isLookPoker) {//看过牌
							needShowSelfIndex = this.GetShowPokerList(5, false, true);
							needShowSelfBg = this.GetShowPokerList(5, true, false);
						} else {//什么都没操作过
							needShowSelfIndex = this.GetShowPokerList(5, false, true);
							if ("mpqz_nn" == this.gameName) {
								needShowSelfBg = this.GetShowPokerList(4, true, false);
							} else {
								needShowSelfBg = this.GetShowPokerList(5, true, true);
							}
						}
					}
					if (0 == uiPos) {
						continue;
					}
					needShowPokers[uiPos] = true;
					needShowPokersIndex[uiPos].showList = this.GetShowPokerList(5, false, true);
					needShowPokersIndex[uiPos].showBgList = this.GetShowPokerList(5, false, true);
				} else if (gameState == this.gameState.Result) {//结算
					needShowPokers[uiPos] = true;
					needShowPokersIndex[uiPos].showList = this.GetShowPokerList(5, false, true);
					needShowPokersIndex[uiPos].showBgList = this.GetShowPokerList(5, true, false);
				}
			}
		}
		//按钮设置下
		let selfData = allPlayerData[selfPos];
		let isLookPoker = selfData.checkCard;
		let isShowPoker = selfData.openCard;
		if (selfIsPlayIng) {
			if (gameState == this.gameState.DealPokerOne) {//发牌1
				//没有按钮操作
			} else if (gameState == this.gameState.LootBanker) {//抢庄
				this.UpdateLootBanker();
			} else if (gameState == this.gameState.SureBanker) {//确认庄家
				app[app.subGameName + "Client"].OnEvent("Head_UpdateBacker", {"bShow": true});
			} else if (gameState == this.gameState.Bet) {//下注推注
				this.UpdateBet(0);
			}
			else if (gameState == this.gameState.DealPokerSecond) {//发牌2
				if (!isLookPoker) {
					this.ShowGroup1(true);
				} else if (!isShowPoker) {
					this.ShowGroup2(true);
				}
			} else if (gameState == this.gameState.Result) {
				// this.UpdateComparePoker();
			}
		}
		//不管自己有没有玩都要显示结算
		if (gameState == this.gameState.Result) {
			this.UpdateComparePoker();
		}


		if (!endPosNeedScale) {
			this.ResetAllPokerToCenter(true);
		}
		let pokers = null;
		if (selfIsPlayIng) {
			this.selfCard.active = true;
			pokers = this.selfCard.children;
			for (let i = 0; i < 5; i++) {
				//这里缩放回来(如果不是mpqz_nn会ResetAllPokerToCenter缩放到0.5)
				pokers[i].scaleX = 1;
				pokers[i].scaleY = 1;
				if (4 == i && !endPosNeedScale) {
					pokers[i].scaleX = 0.7;
					pokers[i].scaleY = 0.7;
				}
				pokers[i].active = needShowSelfIndex[i];
				pokers[i].getChildByName("poker_back").active = needShowSelfBg[i];
			}
		}
		for (let i = 0; i < 10; i++) {
			pokers = this.pokers[i];
			pokers.active = needShowPokers[i];
			let cards = pokers.children;
			for (let j = 0; j < 5; j++) {
				cards[j].active = needShowPokersIndex[i].showList[j];
				cards[j].getChildByName("poker_back").active = needShowPokersIndex[i].showBgList[j];
			}
		}
	},
	UpdateLootBanker: function () {
		if (!this.PlayerIsPlayIng(this.Room.GetClientPos())) {
			return;
		}
		let selfPos = this.Room.GetClientPos();
		if (this.isPlayIngEnter) {
			let LootBankers = this.Room.GetRoomProperty("set").callbackerList;
			for (let i = 0; i < LootBankers.length; i++) {
				if (LootBankers[i].pos == selfPos) {//中途进入操作过抢庄
					return;
				}
			}
		}

		if ("zyqz_nn" == this.gameName) {
			this.btnGroups[3].active = true;
		} else if ("mpqz_nn" == this.gameName) {
			console.log("mpqz_nn显示抢庄操作按钮", this.RoomCfg);
			let selectIndex = this.RoomCfg.zuidaqiangzhuang;
			let childs = this.btnGroups[4].children;
			let showNum = 0;
			for (let i = 0; i < childs.length; i++) {
				if (i <= selectIndex + 1) {
					childs[i].active = true;
					showNum++;
				} else {
					childs[i].active = false;
				}
			}
			if (2 == showNum) {//layout排版有BUG
				childs[0].x = -71;
				childs[1].x = 71;
			} else if (3 == showNum) {
				childs[0].x = -142;
				childs[1].x = 0;
				childs[2].x = 142;
			} else if (4 == showNum) {
				childs[0].x = -213;
				childs[1].x = -71;
				childs[2].x = 71;
				childs[3].x = 213;
			} else if (5 == showNum) {
				childs[0].x = -284;
				childs[1].x = -142;
				childs[2].x = 0;
				childs[3].x = 142;
				childs[4].x = 284;
			}
			this.btnGroups[4].active = true;
		} else {
			console.error('LootBanker state error');
		}
	},
	UpdateSureBanker: function (updateState) {
		console.log("播放动画确认庄家");
		this.randHeadList = [];
		let selfPos = this.Room.GetClientPos();
		let allPlayerData = this.Room.GetCurGameAllPlayerData();
		let stateInfo = this.Room.GetRoomProperty("set").stateInfo;
		let backerDataPos = stateInfo.backerPos;
		let isRandBackerPos = stateInfo.isRandBackerPos;

		//console.error('backerDataPos ' + backerDataPos);
		let backerUIPos = 0;
		let callbackerList = stateInfo.callbackerList;
		let hasCallBacker = false;//是否有人抢庄
		let callBackerNum = 1;
		let maxNum = 0;
		let maxBetPosList = [];


		let callNum = 0;//服务端规则是无人抢默认一个抢的num=1,点了不抢的按钮num=0
		//先找出最大下注是多少
		for (let i = 0; i < callbackerList.length; i++) {
			if (callbackerList[i].num > maxNum) {
				maxNum = callbackerList[i].num;
			}

			if (callbackerList[i].num > 0) {//判断有没有人抢庄和谁是庄家
				callNum++;
				if (callbackerList[i].pos == backerDataPos) {
					callBackerNum = callbackerList[i].num;
				}
			}
		}
		if (callNum > 1) {
			hasCallBacker = true;
		}
		//先找出最大下注的人有哪几个
		for (let i = 0; i < callbackerList.length; i++) {
			if (callbackerList[i].num == maxNum)
				maxBetPosList.push(callbackerList[i].pos);
		}

		for (let i = 0; i < allPlayerData.length; i++) {
			if (allPlayerData[i].isPlaying) {
				let uiPos = this.Room.GetUIPosByPos(i);
				if (i == backerDataPos) {
					backerUIPos = uiPos;
				}

				if (!hasCallBacker && isRandBackerPos) {
					this.randHeadList.push(uiPos);
					continue;
				}

				for (let j = 0; j < maxBetPosList.length; j++) {
					if (i == maxBetPosList[j]) {
						this.randHeadList.push(uiPos);
						break;
					}
				}
			}
		}

		//开始播动画
		this.isRandBacker = isRandBackerPos;
		this.startRandBanker = true;
		this.lastRandIndex = 0;
		this.lastRandBankerTime = new Date().getTime();
		let self = this;
		let headChilds = this.headNode.children;
		setTimeout(function () {
			self.startRandBanker = false;
			setTimeout(function () {
				self.randBankerNode.x = headChilds[backerUIPos].x;
				self.randBankerNode.y = headChilds[backerUIPos].y;
				self.randBankerNode.active = true;
				self.SoundManager.PlaySound("nnSureBanker");
				app[app.subGameName + "Client"].OnEvent("Head_UpdateBacker", {"bShow": true});
				let otherInfo = headChilds[backerUIPos].getChildByName("otherNode").getChildByName("otherInfo");
				otherInfo.active = true;
				let other = otherInfo.getChildByName("other");
				let str = callBackerNum + "倍";
				other.getChildByName("label").getComponent(cc.Label).string = str;
				other.active = true;
				let score = otherInfo.getChildByName("score");
				score.active = false;
			}, 500);
		}, 3000);
	},
	UpdateBet: function (updateState) {
		if ("tbnn_nn" == this.gameName) {//通比牛牛不显示下注
			return;
		}
		if (!this.PlayerIsPlayIng(this.Room.GetClientPos())) {
			return;
		}

		let data = this.Room.GetRoomProperty("set").stateInfo;
		let backerPos = data.backerPos;
		let selfPos = this.Room.GetClientPos();
		// let selectIndex = this.RoomCfg.endPoints;
		let selectIndex = this.RoomCfg.difen;
		if (0 == updateState || this.isPlayIngEnter) {
			app[app.subGameName + "Client"].OnEvent("Head_UpdateBacker", {"bShow": true});
		}

		// console.error(' selfPos ' + selfPos + ' backerPos ' + backerPos);
		if (backerPos == selfPos) {//庄家不能下注
			return;
		}

		let maxBet = data.maxBet;
		let baseNum = 1;
		if (0 == selectIndex) {
			baseNum = 1;
		} else if (1 == selectIndex) {
			baseNum = 2;
		} else {
			baseNum = 4;
		}

		let labelNode = null;
		this.btnGroups[5].children[0].name = "btn_bet" + baseNum;
		labelNode = this.btnGroups[5].children[0].getChildByName("label");
		labelNode.getComponent(cc.Label).string = baseNum;
		this.btnGroups[5].children[1].name = "btn_bet" + (baseNum * 2);
		labelNode = this.btnGroups[5].children[1].getChildByName("label");
		labelNode.getComponent(cc.Label).string = baseNum * 2;
		this.btnGroups[5].children[0].active = true;
		this.btnGroups[5].children[1].active = true;
		this.btnGroups[5].children[2].active = false;
		if (maxBet) {//推注
			this.btnGroups[5].children[2].name = "btn_bet" + maxBet;
			labelNode = this.btnGroups[5].children[2].getChildByName("label");
			labelNode.getComponent(cc.Label).string = maxBet;
			this.btnGroups[5].children[0].x = -150;
			this.btnGroups[5].children[1].x = 0;
			this.btnGroups[5].children[2].x = 150;
			this.btnGroups[5].children[2].active = true;
		} else {
			this.btnGroups[5].children[0].x = -80;
			this.btnGroups[5].children[1].x = 80;
		}

		let selfInfo = this.Room.GetCurGamePlayerData(selfPos);
		if (0 != selfInfo.addBet) {//有下注信息
			this.btnGroups[5].active = false;
		} else {
			this.btnGroups[5].active = true;
		}
	},
	UpdateDealPoker: function (updateState, gameState) {
		//明牌抢庄在开始游戏的时候发过了4张
		let dealNum = 5;
		if ("mpqz_nn" == this.gameName) {
			if (gameState == this.gameState.DealPokerOne) {
				dealNum = 4;
			} else if (gameState == this.gameState.DealPokerSecond) {
				dealNum = 1;
			}
		}

		// if(!this.isLoadPokerEnd)
		//     this.LoadAllPoker();

		let selfPos = this.Room.GetClientPos();
		let allPlayerData = this.Room.GetCurGameAllPlayerData();
		let playIngNum = 0;
		let dealUIList = [];
		let uiPos = 1;
		//算出要发多少张牌和要发的位置
		for (let i = 0; i < allPlayerData.length; i++) {
			let isPlaying = allPlayerData[i].isPlaying;
			if (!isPlaying || 0 == allPlayerData[i].pid) {
				continue;
			}
			let data = {};
			data.dataPos = i;
			data.uiPos = this.Room.GetUIPosByPos(i);
			dealUIList.push(data);
			playIngNum++;
		}
		//开始发牌
		let curIndex = 0;
		let curPokerNum = 0;
		let needDealAllNum = playIngNum * dealNum;//总共发多少张牌
		let delayTime = 0;
		let speed = 0.0
		for (let i = 0; i < needDealAllNum; i++) {
			let dataPos = dealUIList[curIndex].dataPos;
			let isLookPoker = allPlayerData[dataPos].checkCard;
			let isShowPoker = allPlayerData[dataPos].openCard;
			let uiPos = dealUIList[curIndex].uiPos;
			if (1 == dealNum) {
				curPokerNum = 4;
			}
			let pokerName = "card" + curPokerNum;
			let pokersNode = null;
			if (0 == uiPos) {
				pokersNode = this.selfCard;
			} else {
				pokersNode = this.pokers[uiPos];
			}
			let curPoker = pokersNode.getChildByName(pokerName);//第几张牌
			curPoker.stopAllActions();
			pokersNode.active = true;
			curPoker.active = true;
			let goX = 0;
			if (0 == uiPos) {
				goX = -224 + curPokerNum * 87;
				this.PokerRunAni(curPoker, 1, delayTime, speed, cc.v2(goX, -300), dealNum);
			} else {
				goX = this.pokersPos[uiPos][0] - 87 + curPokerNum * 49;
				let goY = this.pokersPos[uiPos][1];
				this.PokerRunAni(curPoker, 0, delayTime, speed, cc.v2(goX, goY), dealNum);
			}
			curIndex++;
			delayTime += speed;
			if (curIndex >= dealUIList.length) {
				curIndex = 0;
				curPokerNum++;
			}
		}
	},
	UpdateComparePoker: function () {
		//显示所有的牌
		this.LoadAllPoker();

		this.bCompareIng = true;
		this.btnGroups[2].active = false;

		this.FormManager.CloseForm("game/" + app.subGameName.toUpperCase() + "/base/" + app.subGameName + "_UIRubPoker");
		this.selfCard.active = false;
		let setEnd = {};
		let allPlayerData = this.Room.GetCurGameAllPlayerData();
		let setEndData = this.Room.GetRoomProperty("setEnd");
		if (setEndData) {
			setEnd = setEndData;
		} else {
			setEnd.crawTypeList = [];
			setEnd.pointList = [];
		}
		let selfPos = this.Room.GetClientPos();
		let uiPos = 0;
		let needShowPos = [];
		let lastTime = 1;
		for (let i = 0; i < allPlayerData.length; i++) {
			if (!setEndData) {
				setEnd.crawTypeList.push(allPlayerData[i].crawType);
				setEnd.pointList.push(allPlayerData[i].point);
			}
			if (allPlayerData[i].isPlaying) {
				let data = {};
				data.dataPos = i;
				data.pokerType = setEnd.crawTypeList[i];
				data.uiPos = this.Room.GetUIPosByPos(i);
				needShowPos.push(data);
			}
		}
		//排序下根据牌型大小
		needShowPos.sort(this.sortFunByPokerType);

		let playerScores = setEnd.pointList;
		this.curEndScores = setEnd.pointList;//用于播放声音
		let self = this;
		let needPlusTime = 1000;
		if (self.isPlayIngEnter) {
			needPlusTime = 1;
		}
		for (let i = 0; i < needShowPos.length; i++) {
			(function (showIndex, needShowPos) {
				setTimeout(function () {
					let gameState = self.Room.GetRoomProperty("set").state;
					if (gameState != self.gameState.Result) {
						self.bCompareIng = false;
						return;
					}
					let pokers = self.pokers[needShowPos[showIndex].uiPos].children;
					self.pokers[needShowPos[showIndex].uiPos].active = true;
					for (let j = 0; j < pokers.length; j++) {
						pokers[j].stopAllActions();
						pokers[j].scaleX = 1;
						pokers[j].scaleY = 1;
						pokers[j].angle = 0;
						pokers[j].getChildByName("poker_back").active = false;
						pokers[j].active = true;
					}

					//显示分数
					let pokerScore = self.scores[needShowPos[showIndex].uiPos];
					let curScore = playerScores[needShowPos[showIndex].dataPos];
					let subLabel = pokerScore.getChildByName("subLabel");
					let plusLabel = pokerScore.getChildByName("plusLabel");
					subLabel.x = 0;
					plusLabel.x = 0;
					subLabel.getComponent(cc.Label).string = "";
					plusLabel.getComponent(cc.Label).string = "";
					if (curScore > 0) {
						plusLabel.getComponent(cc.Label).string = "+" + curScore;
					} else if (curScore < 0) {
						subLabel.getComponent(cc.Label).string = curScore;
					} else {
						subLabel.getComponent(cc.Label).string = 0;
					}

					pokerScore.active = true;
					pokerScore.getChildByName("subLabel").getComponent(cc.Animation).play();
					pokerScore.getChildByName("plusLabel").getComponent(cc.Animation).play();

					//显示牌型
					let pokerType = self.pokerTypes[needShowPos[showIndex].uiPos];
					let curDataType = needShowPos[showIndex].pokerType;
					let typeData = self.PokerModle.GetNNPokerTypeStr(curDataType);
					let curCards = self.pokers[needShowPos[showIndex].uiPos].children;
					let point = self.pokersPos[needShowPos[showIndex].uiPos];
					if (0 != curDataType) {//有牛牌的位置拆开
						subLabel.x = -20;
						plusLabel.x = -20;
						for (let j = 0; j < curCards.length; j++) {
							if (j < 3) {
								curCards[j].x = point[0] - 87 + j * 49;
							} else {
								curCards[j].x = point[0] + 87 + (j - 3) * 49;
							}
							curCards[j].y = point[1];
						}
					} else {
						for (let j = 0; j < curCards.length; j++) {
							curCards[j].x = point[0] - 87 + j * 49;
							curCards[j].y = point[1];
						}
					}

					pokerType.getChildByName("bg").active = typeData.isBigCard;
					pokerType.getChildByName("type").getComponent(cc.Label).string = typeData.typeStr;
					pokerType.getChildByName("red_beishu").getComponent(cc.Label).string = "";
					pokerType.getChildByName("green_beishu").getComponent(cc.Label).string = "";
					if (0 != typeData.beiShu) {
						if (typeData.beiShu < 2) {
							pokerType.getChildByName("green_beishu").getComponent(cc.Label).string = "x" + typeData.beiShu;
						} else {
							pokerType.getChildByName("red_beishu").getComponent(cc.Label).string = "x" + typeData.beiShu;
						}
						pokerType.getChildByName("type").x = 5;
					} else {
						pokerType.getChildByName("type").x = 70;
					}
					pokerType.active = true;

					if (!self.isPlayIngEnter) {
						let soundName = "";
						let sex = self.GetPlayerSex(needShowPos[showIndex].dataPos);
						if (sex == self.ShareDefine.HeroSex_Boy) {
							soundName = "nnMCardType" + curDataType;
						} else {
							soundName = "nnGCardType" + curDataType;
						}
						self.SoundManager.PlaySound(soundName);
					}
					if (showIndex == needShowPos.length - 1) {
						let roomState = self.Room.GetRoomProperty("state");
						if (roomState == self.RoomState.End) {
							self.isShowAllResultIng = true;
							setTimeout(function () {
								self.UpdateAllResult();
							}, 2000);
						} else {
							self.bCompareIng = false;
							self.UpdateCurGameEnd(!self.isPlayIngEnter);
						}
					}
				}, lastTime);
				lastTime += needPlusTime;
			}(i, needShowPos));
		}
	},
	sortFunByPokerType: function (a, b) {
		return a.pokerType - b.pokerType;
	},
	UpdateCurGameEnd: function (bPlaySound = true) {
		let btn_continue = this.btnGroups[6].getChildByName("btn_continue");
		let btn_xiazhuang = this.btnGroups[6].getChildByName("btn_xiazhuang");
		btn_continue.active = true;
		btn_xiazhuang.active = false;
		btn_continue.x = 0;
		if ("gdzj_nn" == this.gameName) {//固定庄家类要判断下3局以后能下庄
			let playNum = this.Room.GetRoomProperty("setID");
			let cfgScore = this.RoomCfg.shangzhuangfenshu;
			if (0 != cfgScore && playNum >= 3) {
				let ownerID = this.Room.GetRoomProperty("ownerID");
				let selfID = app[app.subGameName + "_HeroManager"]().GetHeroProperty("pid");
				if (ownerID == selfID) {
					//显示准备和下庄
					btn_xiazhuang.active = true;
					btn_continue.x = -100;
				}
			}
		}
		let selfPos = this.Room.GetClientPos();
		if (app[app.subGameName + "_ShareDefine"]().isCoinRoom) {
			this.btnGroups[6].active = false;
		} else {
			let gameReady = this.Room.GetRoomProperty("posList")[selfPos].gameReady;
			this.btnGroups[6].active = !gameReady;
			if (gameReady) {
				let heads = this.headNode.children;
				let headScript = heads[0].getComponent(app.subGameName + "_UIPublicHead");
				headScript.setReady(gameReady);
			}
		}
		if (bPlaySound) {
			let isPlaying = this.PlayerIsPlayIng(selfPos);
			if (this.curEndScores && isPlaying) {
				let selfScore = this.curEndScores[selfPos];
				let soundName = "";
				if (selfScore > 0) {
					soundName = "Result_Win";
				} else if (selfScore < 0) {
					soundName = "Result_Lose";
				} else {
					soundName = "Result_Ping";
				}
				this.SoundManager.PlaySound(soundName);
				this.curEndScores = null;
			}
		}
	},
	UpdateAllResult: function () {
		this.FormManager.ShowForm("game/" + app.subGameName.toUpperCase() + "/base/" + app.subGameName + "_UIResultDetail");
	},
	UpdateTipState: function () {
		//this.stateStartTime
		let gameState = this.Room.GetRoomProperty("set").state;
		this.serverTime = app[app.subGameName + "_ServerTimeManager"]().GetServerTimeData();
		let str = "等待其他玩家";
		let bShow = true;
		let remainTime = 0;
		let bTimeOut = false;
		if (this.serverTime > this.stateStartTime) {
			remainTime = this.serverTime - this.stateStartTime;
			cc.log("服务器给的时间：",remainTime);
		}

		if (gameState == this.gameState.DealPokerOne) {
			if (2000 > remainTime) {
				remainTime = 2000 - remainTime;
				str = "发牌中...";
				// cc.log("发牌中，时间：",remainTime);
			} else {
				bTimeOut = true;
			}
		} else if (gameState == this.gameState.LootBanker) {
			if (6000 > remainTime) {
				remainTime = 6000 - remainTime;
				str = "等待抢庄 " + parseInt(remainTime / 1000) + " 秒";
			} else {
				bTimeOut = true;
			}
		} else if (gameState == this.gameState.SureBanker) {
			if (5000 > remainTime) {
				remainTime = 5000 - remainTime;
				str = "等待确认庄家 " + parseInt(remainTime / 1000) + " 秒";
			} else {
				bTimeOut = true;
			}
		} else if (gameState == this.gameState.Bet) {
			if (5000 > remainTime) {
				remainTime = 5000 - remainTime;
				str = "闲家下注中 " + parseInt(remainTime / 1000) + " 秒";
			} else {
				bTimeOut = true;
			}
		} else if (gameState == this.gameState.DealPokerSecond) {
			if (10000 > remainTime) {
				remainTime = 10000 - remainTime;
				if (!this.isDealPokerEnd) {
					str = "发牌中...";
					cc.log("二次发牌中，时间：",remainTime);
				} else {
					str = "亮牌中...";
				}
			} else {
				bTimeOut = true;
			}
		} else if (gameState == this.gameState.Result) {//结算
			if (10000 > remainTime) {
				remainTime = 10000 - remainTime;
				str = "结算中 " + parseInt(remainTime / 1000) + " 秒";
			} else {
				bTimeOut = true;
			}
		}
		this.tipLabel.string = str;
		this.tipLabel.node.parent.active = bShow;
		if (bTimeOut) {
			this.bUpdateTip = false;
			this.SoundManager.PlaySound("nnTimeOut");
			this.tipLabel.node.parent.active = false;
		}
	},

	PokerRunAni: function (wndNode, type, delayTime, needTime, Pos, dealNum) {
		let action = null;
		if (0 == type) {
			action = cc.sequence(
				cc.delayTime(delayTime),
				cc.spawn(cc.moveTo(needTime, Pos),
					cc.rotateBy(needTime, 720)
				),
				cc.callFunc(this.OnRunActionEnd, this, [type, dealNum])
			);
		} else if (1 == type) {
			action = cc.sequence(
				cc.delayTime(delayTime),
				cc.spawn(cc.moveTo(needTime, Pos),
					cc.rotateBy(needTime, 720),
					cc.scaleTo(needTime, 1, 1),
				),
				cc.callFunc(this.OnRunActionEnd, this, [type, dealNum])
			);
		} else {
			console.error("PokerRunAni error");
			return;
		}
		wndNode.angle = 0;
		wndNode.runAction(action);
	},
	OnRunActionEnd: function (sender, useData) {
		this.SoundManager.PlaySound("nnFaPai");
		sender.angle = 0;
		if (0 == useData[0]) {

		} else if (1 == useData[0]) {//自己的牌
			let num = sender.name.substring(('card').length, sender.name.length)
			let curPokerNum = parseInt(num);
			let dealNum = useData[1];
			if (4 == dealNum) {//明牌抢庄的为发4张
				sender.getChildByName("poker_back").active = false;
				return;
			}
			if (1 == dealNum || curPokerNum == (dealNum - 1)) {//发完了
				let slefPos = this.Room.GetClientPos();
				let selfData = this.Room.GetCurGamePlayerData(slefPos);
				let isLookPoker = selfData.checkCard;
				let isShowPoker = selfData.openCard;
				if (!isLookPoker) {
					this.ShowGroup1(true);
				} else if (!isShowPoker) {
					this.ShowGroup2(true);
				}
				this.isDealPokerEnd = true;
			}
		}
	},
	PlayerIsPlayIng: function (pos) {
		let playerData = this.Room.GetCurGamePlayerData(pos);
		return playerData.isPlaying;
	},
	//显示玩家准备状态
	ShowPlayerReady: function () {
		let room = this.Room;
		if (!room) {
			return
		}
		let roomSetID = room.GetRoomProperty("setID");
		let ReadyState = "";
		if (roomSetID > 0) {
			ReadyState = "gameReady";
		} else {
			ReadyState = "roomReady";
		}
		this.CheckStartState(ReadyState);
	},
	CheckStartState: function (ReadyState) {
		let roomState = this.Room.GetRoomProperty("state");
		if (roomState == this.RoomState.Play) {
			return;
		}
		if (ReadyState == "gameReady") {
			//第二局
			this.HideClientReady();
		} else if (ReadyState == "roomReady") {
			//第一局
			if (this.JoinPlayerFinish() && this.IsClientReady(ReadyState) == false) {
				//人数加满，本家没准备
				this.ShowPlayerOk();
			} else if (this.JoinPlayerFinish() && this.IsClientReady(ReadyState) == true) {
				//人数加满，在房间的都准备了
				this.HideClientReady(ReadyState);
			} else if (!this.JoinAllPlayerFinish()) {
				//人数未满
				this.ShowPlayerYaoQing();
			}
		}
	},
	HideClientReady: function (ReadyState) {
		this.btnGroups[0].active = true;
		this.btnGroups[0].getChildByName("btn_ready").active = false;
		let playerAllList = this.Room.GetRoomAllPlayerInfo();
		let ownerID = this.Room.GetRoomProperty("ownerID");
		let tempNum = 0;
		let readyNum = 0;
		for (let i = 0; i < playerAllList.length; i++) {
			let player = playerAllList[i];
			if (player.pid > 0) {
				tempNum++;
			}
			if (player[ReadyState]) {
				readyNum++;
			}
			if (tempNum == readyNum) {
				if (player["pos"] == this.clientPos) {
					if (player["pid"] == ownerID) {
						this.btnGroups[0].getChildByName("btn_go").active = true;
					} else {
						this.btnGroups[0].getChildByName("btn_go").active = false;
					}
					break;
				}
			}
		}
	},
	JoinAllPlayerFinish: function () {
		let playerAllList = this.Room.GetRoomAllPlayerInfo();
		let tempNum = 0;
		for (let j = 0; j < playerAllList.length; j++) {
			let player = playerAllList[j];
			if (player.pid > 0) {
				tempNum++;
			}
		}
		if (tempNum == playerAllList.length) {
			return true;
		}
		return false;
	},
	JoinPlayerFinish: function () {
		let playerAllList = this.Room.GetRoomAllPlayerInfo();
		var tempNum = 0;
		for (let j = 0; j < playerAllList.length; j++) {
			let player = playerAllList[j];
			if (player.pid > 0) {
				tempNum++;
			}
		}
		// if (tempNum == playerAllList.length) {
		if (tempNum > 1) {
			return true;
		}
		return false;
	},
	IsClientReady: function (ReadyState) {
		let playerAllList = this.Room.GetRoomAllPlayerInfo();
		for (let i = 0; i < playerAllList.length; i++) {
			let player = playerAllList[i];
			let isClientReady = player[ReadyState];
			if (player["pos"] == this.clientPos) {
				return isClientReady;
				break;
			}
		}
	},
	ShowPlayerOk: function () {
		this.btnGroups[0].active = true;
		this.btnGroups[0].getChildByName("btn_go").active = false;
		if (this.IsAutoReady()) {
			//自动准备玩法
			this.btnGroups[0].getChildByName("btn_ready").active = false;
			this.Click_btn_ready();
		} else {
			//手动准备玩法
			this.btnGroups[0].getChildByName("btn_ready").active = true;
		}
	},
	ShowPlayerYaoQing: function () {
		this.btnGroups[0].active = true;
		this.btnGroups[0].getChildByName("btn_go").active = false;
		this.btnGroups[0].getChildByName("btn_ready").active = false;
		this.btnGroups[0].getChildByName("btn_invitation").active = true;
		if (this.RoomCfg.clubId > 0 || this.RoomCfg.unionId > 0) {
			// this.invitationNode.active = true;
		} else {
			this.invitationNode.active = false;
		}
	},
	//-----------------回调函数------------------------
	OnXiPaiNtf: function (event) {

	},
	Event_SportsPointEnough: function (event) {
		let msg = event.msg;
		this.SetWaitForConfirm("SportsPointEnough", this.ShareDefine.ConfirmOK, [msg]);
	},
	Event_SportsPointNotEnough: function (event) {
		let msg = event.msg;
		// this.SetWaitForConfirm("SportsPointNotEnough", this.ShareDefine.ConfirmYN, []);
		this.ShowSysMsg("比赛分不足房间自动解散");
	},
	OnRubPokerEnd: function (event) {
		let gameState = this.Room.GetRoomProperty("set").state;
		if (gameState != this.gameState.Result) {
			this.Click_btn_lookPoker();
		} else {
			this.ShowGroup2(false);
		}
	},
	OnEventShow: function (event) {
		let argDict = event;
		let bReConnect = argDict["bReConnect"];
		if (bReConnect) {//断网重连后阻止游戏状态事件
			this.isConnect = false;
		}

		this.appIsHide = false;
		this.isPlayIngEnter = true;
		this.UpdateRoomInfo();
		app[app.subGameName + "Client"].OnEvent("Head_PosUpdate", {});
	},
	OnEventHide: function (event) {
		this.appIsHide = true;
		this.isPlayIngEnter = true;
	},
	Event_GameGift: function (event) {
		let self = this;
		let argDict = event;
		let sendPos = argDict["sendPos"];
		let recivePos = argDict["recivePos"];
		let productId = argDict["productId"];
		let sendHead = app[app.subGameName + "_HeadManager"]().GetComponentByPos(sendPos);
		let reciveHead = app[app.subGameName + "_HeadManager"]().GetComponentByPos(recivePos);
		let giftIdx = productId - 1;
		let tempNode = cc.instantiate(this.giftPrefabs[giftIdx]);
		let ani = tempNode.getComponent(cc.Animation);
		// tempNode.tag = giftIdx;
		tempNode.name = ani.defaultClip.name;
		tempNode.bMove = true;
		ani.on('finished', this.OnGiftAniEnd, this);
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
		app[app.subGameName + "_SoundManager"]().PlaySound("mofa_" + sender.name);
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
	Event_ChatMessage: function (event) {
		let argDict = event;
		let senderPid = argDict["senderPid"];
		let quickID = parseInt(argDict["quickID"]);
		let content = argDict["content"];

		let playerList = this.Room.GetRoomProperty('posList');
		let initiatorPos = -1;
		for (let i = 0; i < playerList.length; i++) {
			let player = playerList[i];
			let pid = player["pid"];
			if (senderPid == pid) {
				initiatorPos = i;
			}
		}
		let headChilds = this.headNode.children;
		let headScript = null;
		for (let i = 0; i < headChilds.length; i++) {
			headScript = headChilds[i].getComponent(app.subGameName + "_UIPublicHead");
			if (headScript.playerPos == playerList[initiatorPos].pos)
				break;

			headScript = null;
		}
		let playerSex = this.InitHeroSex(initiatorPos);
		let chatData = app[app.subGameName + "_ChatManager"]().GetBaseByQuickId(quickID, playerSex, content);
		let soundName = chatData.soundName;
		let path = chatData.path;
		content = chatData.content;

		console.log("PlaySoune soundName:", soundName);
		this.SoundManager.PlaySound(soundName);
		app.Client.GetClientConfigProperty("newQuanZhou");
		//敏感词汇替换
		content = this.UtilsWord.CheckContentDirty(content);

		if (headScript) {
			if (content == "") {
				headScript.ShowFaceContent(path);
			} else {
				headScript.ShowChatContent(content);
			}
		}
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
			if (state != this.ShareDefine.RoomState_End) {
				this.SetWaitForConfirm("DissolveRoom", this.ShareDefine.ConfirmOK);
				this.FormManager.CloseForm(app.subGameName + "_UIMessage02");
			}
			//如果有roomend数据显示 结果界面
			else {
				this.FormManager.CloseForm(app.subGameName + "_UIMessage02");
				let roomEnd = this.Room.GetRoomProperty("roomEnd");
				if (roomEnd) {
					this.FormManager.ShowForm("game/" + app.subGameName.toUpperCase() + "/base/" + app.subGameName + "_UIResultDetail", roomEnd, true);
				}
			}

		}
	},
	//收到解散房间
	Event_StartVoteDissolve: function (event) {
		this.FormManager.ShowForm(app.subGameName + "_UIMessage02");
	},
	//投票更新
	Event_UpdateDissolve: function (event) {

	},

	//准备
	Event_PosReadyChg: function (event) {
		cc.log("收到准备通知");
		let serverPack = event;
		let pos = serverPack["pos"];
		let selfPos = this.Room.GetClientPos();
		let ownerID = this.Room.GetRoomProperty("ownerID");
		let selfID = app[app.subGameName + "_HeroManager"]().GetHeroProperty("pid");
		if (pos == selfPos) {
			this.btnGroups[0].getChildByName("btn_ready").active = false;
		}
		//this.btnGroups[0].active = false;
		this.ShowPlayerReady();
		app[app.subGameName + "Client"].OnEvent("Head_PosReadyChg", serverPack);
	},
	//继续游戏
	Event_PosContinueGame: function (event) {
		cc.log("收到准备通知");
		let serverPack = event;
		let pos = serverPack["pos"];
		let selfPos = this.Room.GetClientPos();
		if (selfPos == pos) {
			this.btnGroups[6].active = false;
		}
		app[app.subGameName + "Client"].OnEvent("PosContine",serverPack);
	},
	//位置更新
	Event_PosUpdate: function (event) {
		cc.log("位置更新")
		let serverPack = event["posInfo"];
		let pos = serverPack["pos"];
		let pid = serverPack["pid"];
		//中途加入只刷 头像
		this.RefreshHead(pos);
		this.ShowPlayerReady();
	},
		//所有位置位置更新
	Event_AllPosUpdate: function (event) {
		cc.log("重新初始化头像");
		this.InitAllHead();

	   this.RefreshHead(-1);
	   this.UpdateRoomInfo();
	   app[app.subGameName + "Client"].OnEvent("Head_PosUpdate", {});
	   //Head_PosUpdate不会刷新双十庄家因为动画完才刷出庄家图标
	   app[app.subGameName + "Client"].OnEvent("Head_UpdateBacker", {"bShow": true});
		// this.AddHead();
		// this.clientPos = parseInt(this.RoomPosMgr.GetClientPos());
		// let room = this.RoomMgr.GetEnterRoom();
		// let roomState = room.GetRoomProperty("state");
		// let state = this.RoomSet.GetRoomSetProperty("state");
		// if (this.ShareDefine.RoomState_Playing == roomState ||
		// 	this.ShareDefine.SetState_Hog == state ||
		// 	this.ShareDefine.SetState_AddDouble == state ||
		// 	this.ShareDefine.SetState_Playing == state) {
		// 	this.btn_ready.active = false;
		// }
		// let roomSetID = this.Room.GetRoomProperty("setID");
		// let serverPack = event;
		// serverPack["isShowNode"] = roomSetID > 0;
		// app[app.subGameName + "Client"].OnEvent("Head_PosUpdate", serverPack);
		// this.updateLookInfo()
	},
	Event_PosLeave: function (event) {
		let serverPack = event;
		let pos = serverPack["pos"];
		//如果是客户端玩家并且是被T了
		if (serverPack["beKick"] && this.clientPos == pos) {
			if (serverPack["kickOutTYpe"] == 2) {
				this.SetWaitForConfirm("MSG_BeKick", this.ShareDefine.ConfirmOK, [serverPack.msg]);
			} else if (serverPack["kickOutTYpe"] == 3) {
				this.SetWaitForConfirm("MSG_BeKick", this.ShareDefine.ConfirmOK, ["由于长时间未准备，您已被请出房间"]);
			} else {
				this.SetWaitForConfirm("UIPlay_BeKick", this.ShareDefine.ConfirmOK);
			}
			return;
		}
		this.ShowPlayerReady();
		app[app.subGameName + "Client"].OnEvent("Head_PosLeave", serverPack);
		/*let ownerID = this.Room.GetRoomProperty("ownerID");
		let selfID = app[app.subGameName + "_HeroManager"]().GetHeroProperty("pid");*/
	},
	//一局开始
	Event_SetStart: function (event) {
		this.invitationNode.active = false;
		this.selectCards = [];
		let serverPack = event;
		this.stateStartTime = serverPack["setInfo"].startTime;
		if (this.appIsHide) {
			return;
		}
		app[app.subGameName + "Client"].OnEvent("Head_UpdateBacker", {'bShow': false});
		this.isPlayIngEnter = false;
		this.startAni.active = true;
		this.startAni.getComponent(cc.Animation).play();
		//把牌先显示在中间位置方便播放动画
		this.ResetAllPokerToCenter();
		this.HideAll();

		let heads = this.headNode.children;
		for (let i = 0; i < heads.length; i++) {
			let otherInfo = heads[i].getChildByName('otherNode').getChildByName('otherInfo');
			otherInfo.getChildByName('score').active = false;
			otherInfo.getChildByName('other').active = false;
		}

		this.UpdateRoomInfo(0);
	},
	Event_StatusChange: function (event) {
		let serverPack = event;
		this.stateStartTime = serverPack.startTime;
		if (this.appIsHide) {
			return;
		}
		this.isPlayIngEnter = false;
		this.UpdateRoomInfo(1);
	},
	//局结束
	Event_SetEnd: function (event) {
		let serverPack = event;
		this.stateStartTime = serverPack.startTime;
		if (this.appIsHide) {
			return;
		}
		this.isPlayIngEnter = false;
		this.UpdateRoomInfo(2);
		this.isLoadPokerEnd = false;
	},
	//房间结束
	Event_RoomEnd: function (event) {
		if (this.appIsHide) {
			return;
		}
		this.UpdateRoomInfo();
	},
	//有玩家亮牌通知
	Event_OpenCard: function (event) {
		/*let data = event;
		if(data.OpenCard == 0) return;
		let sex = this.GetPlayerSex(data.pos);
		let pathStr = this.XYZBDefine.SoundPath + "game_" + sex + "/";
		let uiPos = this.XYZBRoomPosMgr.GetUIPosByDataPos(data.pos);
		let state = this.XYZBRoomSet.GetRoomSetProperty("setStatus");
		this.ShowOpenCard(data.pos, data.cardList);
		this.openCardInfo[data.pos] = data.cardList;*/
	},
	Event_CallBacker: function (event) {
		if (this.appIsHide) {
			return;
		}
		let serverPack = event;
		let pos = serverPack.pos;
		let callBackerNum = serverPack.callBackerNum;
		let sex = this.GetPlayerSex(pos);
		let soundName = '';
		if (sex == this.ShareDefine.HeroSex_Boy) {
			if (0 == callBackerNum) {
				soundName = 'nnMBuQiang';
			} else {
				soundName = 'nnMQiangZhuang';
			}
		} else {
			if (0 == callBackerNum) {
				soundName = 'nnGBuQiang';
			} else {
				soundName = 'nnGQiangZhuang';
			}
		}
		this.SoundManager.PlaySound(soundName);
		let str = "";
		if (0 == callBackerNum) {
			str = "不抢";
		} else {
			str = "抢庄X" + callBackerNum;
		}
		let uiPos = this.Room.GetUIPosByPos(pos);
		let headChilds = this.headNode.children;
		let otherInfo = headChilds[uiPos].getChildByName("otherNode").getChildByName("otherInfo");
		otherInfo.active = true;
		let score = otherInfo.getChildByName("score");
		score.active = false;
		let other = otherInfo.getChildByName("other");
		other.getChildByName("label").getComponent(cc.Label).string = str;
		other.active = true;
	},
	//有玩家下注通知
	Event_AddBet: function (event) {
		if (this.appIsHide) {
			return;
		}
		let serverPack = event;
		let pos = serverPack.pos;
		let addBet = serverPack.addBet;
		let stateInfo = this.Room.GetRoomProperty('set').stateInfo;
		let bankerPos = stateInfo.backerPos;
		//console.error('bankerPos '+bankerPos+' packPos '+pos);
		if (bankerPos == pos)
			return;

		let sex = this.GetPlayerSex(pos);
		let soundName = '';
		if (sex == this.ShareDefine.HeroSex_Boy)
			soundName = 'nnMJiaBei';
		else
			soundName = 'nnGJiaBei';

		this.SoundManager.PlaySound(soundName);

		let betPos = this.Room.GetUIPosByPos(pos);
		let heads = this.headNode.children;
		let otherInfo = heads[betPos].getChildByName('otherNode').getChildByName('otherInfo');
		otherInfo.active = true;
		let score = otherInfo.getChildByName('score');
		score.active = true;
		let other = otherInfo.getChildByName('other');
		other.active = false;
		let scoreLabel = score.getChildByName('label').getComponent(cc.Label);
		scoreLabel.string = addBet;
	},
	LoadAllPoker: function () {
		let selfPos = this.Room.GetClientPos();
		let allPokers = this.Room.GetAllPlayPoker();
		let allPlayer = this.Room.GetRoomProperty('posList');
		let sortPokers = [];
		for (let i = 0; i < allPokers.length; i++) {
			if (allPlayer[i].pid) {
				let sortList = this.PokerModle.NNPokerSort(allPokers[i]);
				sortPokers.push(sortList);
			}
			else
				sortPokers.push([]);
		}
		// allPokers = sortPokers;
		let uiIndex = 1;
		let selfChilds = null;
		for (let i = 0; i < allPlayer.length; i++) {
			if (allPlayer[i].pid) {
				let childs = null;
				if (i == selfPos) {
					childs = this.pokers[0].children;
					selfChilds = this.selfCard.children;
				}
				else {
					uiIndex = this.Room.GetUIPosByPos(i);
					childs = this.pokers[uiIndex].children;
				}
				for (let j = 0; j < sortPokers[i].length; j++) {
					this.PokerModle.GetPokeCard(sortPokers[i][j], childs[j]);
					if (selfChilds)
						this.PokerModle.GetPokeCard(allPokers[i][j], selfChilds[j]);
				}
				selfChilds = null;
			}
		}
		this.isLoadPokerEnd = true;
	},
	ResetAllPokerToPosByDeal: function (dealNum) {
		if (1 == dealNum || 5 == dealNum) {
			this.ResetPokerToPos(-1, []);
			for (let i = 0; i < this.pokers.length; i++)
				this.ResetPokerToPos(i, []);
		}
		else if (4 == dealNum) {
			this.ResetPokerToPos(-1, [0, 1, 2, 3]);
			for (let i = 0; i < this.pokers.length; i++)
				this.ResetPokerToPos(i, [0, 1, 2, 3]);
		}
	},
	ResetPokerToPos: function (pokerIndex, resetList) {
		if (0 == resetList.length || 0 == pokerIndex)
			resetList = [0, 1, 2, 3, 4];

		let pokersNode = null;
		if (-1 == pokerIndex)
			pokersNode = this.selfCard;
		else
			pokersNode = this.pokers[pokerIndex];

		let pokers = pokersNode.children;
		let startX = 0;
		let spead = 0;
		let needY = 0;
		if (-1 == pokerIndex) {
			startX = -224;
			spead = 87;
			needY = -300;
		}
		else {
			spead = 49;
			startX = this.pokersPos[pokerIndex][0] - 87;
			needY = this.pokersPos[pokerIndex][1];
		}

		for (let i = 0; i < resetList.length; i++) {
			pokers[i].x = startX + i * spead;
			pokers[i].y = needY;
		}
	},
	ResetAllPokerToCenter: function (onlyLastOne = false) {
		let slefPos = this.Room.GetClientPos();
		let selfChilds = null;
		let childs = null;
		for (let i = 0; i < this.pokers.length; i++) {
			selfChilds = null;
			if (0 == i) {
				selfChilds = this.selfCard.children;
			}
			childs = this.pokers[i].children;
			let startX = this.pokersPos[i][0] - 87;
			for (let j = 0; j < 5; j++) {
				childs[j].stopAllActions();
				if (onlyLastOne && j < 4) {
					if (0 == i) {
						childs[j].angle = 0;
						childs[j].x = startX + j * 54;
						childs[j].y = this.pokersPos[0][1];
					}
					continue;
				}
				if (0 == i) {
					selfChilds[j].stopAllActions();
					selfChilds[j].scaleX = 0.7;
					selfChilds[j].scaleY = 0.7;
					selfChilds[j].x = 0;
					selfChilds[j].y = 0;
					selfChilds[j].angle = 0;
					selfChilds[j].getChildByName('poker_back').active = true;
					childs[j].x = startX + j * 54;
					childs[j].y = this.pokersPos[0][1];
				} else {
					childs[j].x = 0;
					childs[j].y = 0;
				}
				childs[j].angle = 0;
				childs[j].getChildByName('poker_back').active = true;
			}
		}
		this.LoadAllPoker();
	},
	InitHeroSex: function (pos) {
		let player = this.Room.GetPlayerInfoByPos(pos);
		let Sex = player["sex"];
		let playerSex = "";
		if (Sex == this.ShareDefine.HeroSex_Boy) {
			playerSex = "boy";
		} else if (Sex == this.ShareDefine.HeroSex_Girl) {
			playerSex = "girl";
		}
		return playerSex;
	},
	GetPlayerSex: function (pos) {
		let player = this.Room.GetPlayerInfoByPos(pos);
		return player["sex"];
	},
	ShowGroup1: function (bShow) {
		console.log("需要置灰搓牌按钮", bShow, this.RoomCfg["gaojixuanxiang"]);
		this.btnGroups[1].active = bShow;
		if (bShow) {
			let btn_cuopai = this.btnGroups[1].getChildByName('btn_cuopai');
			if (this.RoomCfg.gaojixuanxiang.indexOf(1) > -1) {//禁止搓牌
				btn_cuopai.getComponent(cc.Button).interactable = false;
			} else {
				btn_cuopai.getComponent(cc.Button).interactable = true;
			}
		}
	},
	ShowGroup2: function (bShow) {
		this.btnGroups[2].active = bShow;
		if (bShow) {
			this.niuBtns[0].active = false;
			this.niuBtns[1].active = true;
			for (let i = 0; i < 4; i++) {
				this.niuNumLabels[i].getComponent(cc.Label).string = 0;
			}
		}
	},
	UpdateNiuLable: function () {
		//先清理
		for (let i = 0; i < this.niuNumLabels.length; i++) {
			this.niuNumLabels[i].getComponent(cc.Label).string = 0;
		}

		let selfPos = this.Room.GetClientPos();
		let selfPokers = this.Room.GetPlayPokerByPos(selfPos);
		let allNum = 0;
		for (let i = 0; i < this.selectCards.length; i++) {
			let curValue = this.PokerModle.GetCardValue(selfPokers[this.selectCards[i]]);
			if (curValue > 10) {
				curValue = 10;
			}

			allNum += curValue;
			this.niuNumLabels[i].getComponent(cc.Label).string = curValue;
		}
		this.niuNumLabels[3].getComponent(cc.Label).string = allNum;

		if (3 == this.selectCards.length && 0 != allNum && 0 == allNum % 10) {
			this.niuBtns[0].active = true;
			this.niuBtns[1].active = false;
		} else {
			this.niuBtns[0].active = false;
			this.niuBtns[1].active = true;
		}
	},
	//-----------获取接口--------------

	//---------点击函数---------------------
	OnCardClick: function (event) {
		let target = event;
		let targetY = parseInt(target.node.y);
		if (!this.btnGroups[2].active) {
			return;
		}
		//let back = target.getChildByName('poker_back');
		// if(back.active || (targetY != this.initPos && targetY != this.outPos))
		//     return;
		let btnName = event.node.name;
		let clickIndex = btnName.substr(("card").length);
		clickIndex = parseInt(clickIndex);
		if (targetY == this.initPos) {
			if (this.selectCards.length >= 3) {
				return;
			}
			target.y = this.outPos;
			this.selectCards.push(clickIndex);
		} else if (targetY == this.outPos) {
			for (let i = 0; i < this.selectCards.length; i++) {
				if (clickIndex == this.selectCards[i]) {
					this.selectCards.splice(i, 1);
					break;
				}
			}
			target.y = this.initPos;
		}
		this.UpdateNiuLable();
	},
	/**
	 * 2次确认点击回调
	 * @param curEventType
	 * @param curArgList
	 */
	SetWaitForConfirm: function (msgID, type, msgArg = [], cbArg = []) {
		let ConfirmManager = app[app.subGameName + "_ConfirmManager"]();
		ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
		ConfirmManager.ShowConfirm(type, msgID, msgArg);
	},
	OnConFirm: function (clickType, msgID, backArgList) {
		if (clickType != "Sure") {
			if (msgID == "SportsPointNotEnough") {
				let roomID = this.RoomMgr.GetEnterRoomID();
				app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID);
			}
			return;
		}
		if (msgID == "UIPlay_BeKick") {
			app[app.subGameName + "Client"].ExitGame();
		} else if (msgID == "OwnnerForceRoom") {
			app[app.subGameName + "Client"].ExitGame();
		} else if (msgID == "DissolveRoom") {
			let roomSetID = this.Room.GetRoomProperty("setID");
			/*if (roomSetID > 1) {
				return;
			}*/
			app[app.subGameName + "Client"].ExitGame();
		} else if (msgID == "MSG_BeKick" || msgID == "MSG_BeDissolve") {
			app[app.subGameName + "Client"].ExitGame();
		} else if (msgID == "PlayerLeaveRoom") {
			let roomID = this.RoomMgr.GetEnterRoomID();
			this.GameManager.SendDissolveRoom(roomID);
		} else if (msgID == "UIMoreTuiChuFangJian") {
			let player = this.RoomMgr.GetEnterRoom().GetRoomPosMgr().GetPlayerInfoByPos(this.clientPos);
			if (!player) {
				return;
			}
			let posName = player.name;
			let roomID = this.RoomMgr.GetEnterRoomID();
			let state = this.Room.GetRoomProperty("state");
			if (state == this.ShareDefine.RoomState_Playing) {
				this.GameManager.SendDissolveRoom(roomID, posName);
				return;
			}
			this.GameManager.SendExitRoom(roomID, this.clientPos);
		} else {
			this.ErrLog("OnConFirm msgID:%s error", msgID);
		}
	},

	OnClick: function (btnName, btnNode) {
		if ('btn_go' == btnName) {
			this.Click_btn_go();
		} else if ('btn_continue' == btnName) {
			this.Click_btn_continue();
		} else if ('btn_ready' == btnName) {
			this.Click_btn_ready();
		} else if ('btn_invitation' == btnName) {
			this.Click_btn_weixin();
		} else if ('btn_xiazhuang' == btnName) {
			this.SetWaitForConfirm('CancelBanker', this.ShareDefine.Confirm);
		} else if ('btn_cuopai' == btnName) {
			let selfPos = this.Room.GetClientPos();
			let selfPokers = this.Room.GetPlayPokerByPos(selfPos);
			if ('mpqz_nn' != this.gameName) {
				this.FormManager.ShowForm("game/" + app.subGameName.toUpperCase() + "/base/" + app.subGameName + "_UIRubPoker", 0, selfPokers);
			} else {
				this.FormManager.ShowForm("game/" + app.subGameName.toUpperCase() + "/base/" + app.subGameName + "_UIRubPoker", 1, selfPokers);
			}
		} else if ('btn_kanpai' == btnName) {
			this.Click_btn_lookPoker();
		}
		else if ('btn_youniu' == btnName) {
			this.Click_btn_showPoker();
		}
		else if ('btn_meiniu' == btnName) {
			let selfPos = this.Room.GetClientPos();
			let selfPokers = this.Room.GetPlayPokerByPos(selfPos);
			// if (this.PokerModle.CheckNiuEx(selfPokers)) {
			// 	this.hasNiuTipNode.stopAllActions();
			// 	this.hasNiuTipNode.opacity = 255;

			// 	this.hasNiuTipNode.active = true;
			// 	let self = this;
			// 	let action = cc.sequence(
			// 		cc.fadeOut(2.0),
			// 		cc.callFunc(function () {
			// 			self.hasNiuTipNode.opacity = 255;
			// 			self.hasNiuTipNode.active = false;
			// 		})
			// 	);
			// 	this.hasNiuTipNode.runAction(action);
			// }
			// else
			this.Click_btn_showPoker();
		}
		else if ('btn_buqiang' == btnName) {
			this.Click_btn_lootLootBanker(0);
		}
		else if ('btn_qiangzhuang' == btnName) {
			this.Click_btn_lootLootBanker(1);
		}
		else if (btnName.startsWith('btn_qiang')) {//抢庄
			let curType = btnName.substring(('btn_qiang').length, btnName.length);
			let num = parseInt(curType);
			this.Click_btn_lootLootBanker(num);
		}
		else if (btnName.startsWith('btn_bet')) {//下注
			let curType = btnName.substring(('btn_bet').length, btnName.length);
			let score = parseInt(curType);
			this.Click_btn_bet(score);
		}
		else if ('btn_xipai' == btnName) {
			let roomID = this.Room.GetRoomProperty("roomID");
			app[app.subGameName + "_GameManager"]().SendXiPai(roomID);
		}
		else {
			console.error("OnClick(%s) not find", btnName);
		}
	},
	Click_btn_go: function () {
		console.log("Click LYMJ btn go");
		let SceneManager = app[app.subGameName + "_SceneManager"]();
		let roomID = this.RoomMgr.GetEnterRoomID();
		this.RoomMgr.SendStartRoomGame(roomID);
		SceneManager.PlayMusic("RoomStart");
	},

	Click_btn_ready: function () {
		let roomID = this.Room.GetRoomProperty("roomID");
		let clientPos = this.Room.GetClientPos();
		app[app.subGameName + "_GameManager"]().SendReady(roomID, clientPos);
	},
	Click_btn_continue: function () {
		let gameState = this.Room.GetRoomProperty('set').state;
		if (gameState != this.gameState.Result) {
			return
		}
		let roomID = this.Room.GetRoomProperty("roomID");
		app[app.subGameName + "_GameManager"]().SendContinueGame(roomID);
	},
	Click_btn_lookPoker: function () {
		let roomID = this.Room.GetRoomProperty("roomID");
		let clientPos = this.Room.GetClientPos();
		this.ShowGroup1(false);
		let selfPokers = this.selfCard.children;
		let curShowNum = 0;
		for (let i = 0; i < selfPokers.length; i++) {
			if (selfPokers[i].active) {
				curShowNum++;
				selfPokers[i].getChildByName("poker_back").active = false;
			}
		}
		if (5 == curShowNum) {
			this.ShowGroup2(true);
		}

		this.Room.SetSelfLookPoker();
		this.RoomMgr.SendLookPoker(roomID, clientPos);
	},
	Click_btn_showPoker: function () {
		let roomID = this.Room.GetRoomProperty("roomID");
		let clientPos = this.Room.GetClientPos();
		let selfPokers = this.selfCard.children;
		for (let i = 0; i < selfPokers.length; i++)
			selfPokers[i].y = this.initPos;

		this.ShowGroup2(false);
		this.RoomMgr.SendShowPoker(roomID, clientPos);
	},
	Click_btn_bet: function (score) {
		this.btnGroups[5].active = false;
		let roomID = this.Room.GetRoomProperty("roomID");
		let clientPos = this.Room.GetClientPos();
		this.RoomMgr.SendBet(roomID, clientPos, score);
	},
	Click_btn_lootLootBanker: function (num) {
		this.btnGroups[3].active = false;
		this.btnGroups[4].active = false;
		let roomID = this.Room.GetRoomProperty("roomID");
		let clientPos = this.Room.GetClientPos();
		this.RoomMgr.SendLootBanker(roomID, clientPos, num);
	},

	OnClose: function () {
		this.isConnect = false;
		this.isPlayIngEnter = true;
		this.isDealPokerEnd = false;
		this.isShowAllResultIng = false;
		let heads = this.headNode.children;
		for (let i = 0; i < heads.length; i++) {
			heads[i].getComponent(app.subGameName + "_UIPublicHead").OnClose();
		}
	},
	// 语音按钮显示
	ShowVoiceBtnLogic: function () {
		if (app[app.subGameName + "_ShareDefine"]().isCoinRoom || !cc.sys.isNative) {
			this.btn_voice.active = false;
		} else {
			this.btn_voice.active = this.IsShowVoice();
		}
	},
	// 语音按钮显示
	ShowChatBtnLogic: function () {
		if (app[app.subGameName + "_ShareDefine"]().isCoinRoom || !cc.sys.isNative) {
			this.btn_voice.active = false;
		} else {
			this.btn_voice.active = this.IsShowChat();
		}
	},

	// 语音触摸回调
	Event_TouchStart: function (event) {
		if (!this.IsShowVoice()) {
			this.ShowSysMsg("禁止语音");
			return;
		}
		app[app.subGameName + "_AudioManager"]().startRecord();
	},

	Event_TouchEnd: function (event) {
		this.FormManager.CloseForm(app.subGameName + "_UIAudio");
		app[app.subGameName + "_AudioManager"]().setTouchEnd(true);
		app[app.subGameName + "_AudioManager"]().stopRecord();
	},
	IsShowVoice: function () {
		let room = this.RoomMgr.GetEnterRoom();
		let gaoji = room.GetRoomConfigByProperty('gaoji');
		if (gaoji.length > 0) {
			if (gaoji.indexOf(5) > -1) {
				return false;
			}
		}
		return true;
	},
	// 聊天
	IsShowChat: function () {
		let room = this.RoomMgr.GetEnterRoom();
		let gaoji = room.GetRoomConfigByProperty("gaoji");
		if (gaoji.length > 0) {
			if (gaoji.indexOf(6) > -1) {
				return false;
			}
		}
		return true;
	},
	// 自动准备
	IsAutoReady: function () {
		let room = this.RoomMgr.GetEnterRoom();
		let fangjian = room.GetRoomConfigByProperty("kexuanwanfa");
		if (fangjian.length > 0) {
			if (fangjian.indexOf(0) > -1) {
				return true;
			}
		}
		return false;
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
});