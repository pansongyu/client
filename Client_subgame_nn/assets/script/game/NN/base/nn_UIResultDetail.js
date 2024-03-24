var app = require("nn_app");
cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {
		prefab1: cc.Prefab,
		prefab2: cc.Prefab,
		prefab8: cc.Prefab,
		pokerNNPrefab: cc.Prefab,
	},

	OnCreateInit: function () {

		this.room_Id = this.GetWndComponent("RoomInfo/roomID", cc.Label);
		this.end_Time = this.GetWndComponent("RoomInfo/endTime", cc.Label);
		this.lb_jushu = this.GetWndComponent("RoomInfo/jushu", cc.Label);
		this.fristLayout = this.GetWndNode("fristFrame/ScrollView/layout");
		this.secondLayout = this.GetWndNode("scendFrame/ScrollView/layout");
		this.btn_continue = this.GetWndNode("fristFrame/btn_lists/btn_continue");
		this.exitRoomBtnNode = this.GetWndNode("fristFrame/btn_lists/btn_exitRoom");
		this.exitBtnNode = this.GetWndNode("fristFrame/btn_lists/btn_exit");
		this.goSecondBtnNode = this.GetWndNode("fristFrame/btn_goScend");
		this.PokerModle = app[app.subGameName + "_PokerCard"]();
		this.RoomMgr = app[this.GameTyepStringUp() + "RoomMgr"]();
		this.fristFrame = this.node.getChildByName('fristFrame');
		this.secondFrame = this.node.getChildByName('scendFrame');
		this.fristScorll = this.fristFrame.getChildByName('ScrollView').getComponent(cc.ScrollView);
		this.secondScorll = this.secondFrame.getChildByName('ScrollView').getComponent(cc.ScrollView);
		this.topLabels = [];
		this.bottomLabels = [];
		this.nnStartX = -500;
		this.nnDistance = 110;
		let topNode = this.secondFrame.getChildByName('topLabels');
		let bottomNode = this.secondFrame.getChildByName('bottomLabels');
		for (let i = 0; i < 10; i++) {
			let strName = 'label' + i;
			let labelNode = topNode.getChildByName(strName);
			this.topLabels.push(labelNode);
			labelNode = bottomNode.getChildByName(strName);
			this.bottomLabels.push(labelNode);
		}

		this.redColor = new cc.Color(181, 104, 48);
		this.greenColor = new cc.Color(59, 138, 133);
		this.RegEvent("GameRecord", this.Event_GameRecord);
		this.RegEvent("EVT_CloseDetail", this.CloseForm, this);
		this.RegEvent("RoomEnd", this.Event_RoomEnd, this);
		this.RegEvent("NewVersion", this.Event_NewVersion, this);
	},
	Event_NewVersion: function () {
		this.isNewVersion = true;
	},

	Event_RoomEnd: function () {
		if (this.prizeType == "RoomCard") {//房间结束普通场
			this.bottom.getChildByName('btn_jixu').active = false;
			this.bottom.getChildByName('btn_back').active = true;
			this.bottom.getChildByName('btn_share').active = true;
		} else {
			this.bottom.getChildByName('btn_jixu').active = true;
			this.bottom.getChildByName('btn_back').active = true;
			this.bottom.getChildByName('btn_share').active = true;
		}
	},

	OnShow: function (datainfo = null, playerList = null, needShowIndex = -1) {
		this.isNewVersion = false;
		app[app.subGameName + "_HotUpdateMgr"]().CheckUpdate(); //检测客户端是否有新版本
		this.isClubRoom = false;
		this.HideAllBtn();
		this.needShowSecond = false;//控制点击数据未到处理
		this.fristFrame.active = false;
		this.secondFrame.active = false;
		this.btn_continue.getChildByName('more').active = false;

		this.playerList = null;
		this.datainfo = null;
		this.dataByZhanJi = false;
		this.clubID = 0;
		let setID = 0;
		let endSec = '';
		let roomKey = '';
		let roomID = 0;
		this.prizeType = this.RoomMgr.GetEnterRoom().GetRoomProperty("prizeType");
		if (-1 != needShowIndex) {
			this.dataByZhanJi = true;
			this.playerList = playerList;
			this.datainfo = datainfo;
			setID = datainfo.setId;
			endSec = datainfo.endTime;
			roomKey = "房间号:" + datainfo.key;
			roomID = datainfo.roomId;
			if (1 == needShowIndex)
				this.fristData = datainfo.countRecords;
			else {
				this.needShowSecond = true;
				app[app.subGameName + "_NetManager"]().SendPack("game.CPlayerSetRoomRecord", {"roomID": roomID});
			}
		} else {
			if (!this.RoomMgr) {
				this.CloseForm();
				return
			}
			this.room = this.RoomMgr.GetEnterRoom();
			if (!this.room) {
				this.CloseForm();
				return
			}
			let roomEnd = this.room.GetRoomProperty("roomEnd");
			if (!roomEnd) {
				this.CloseForm();
				return
			}
			let record = roomEnd["record"];
			setID = record["setCnt"];
			roomID = record["roomID"];
			endSec = record['endSec'];
			roomKey = "房间号:" + this.room.GetRoomProperty("key");
			this.fristData = record['recordPosInfosList'];
			let roomCfg = this.room.GetRoomConfig();
			this.clubID = roomCfg.clubID;
		}
		this.room_Id.string = roomKey;
		this.lb_jushu.string = app.i18n.t("UIWanFa_setCount", {"setCount": setID});
		this.end_Time.string = this.ComTool.GetDateYearMonthDayHourMinuteString(endSec);
		this.needShowSecond = true;
		app[app.subGameName + "_NetManager"]().SendPack("game.CPlayerSetRoomRecord", {"roomID": roomID});
		if (-1 == needShowIndex || 1 == needShowIndex) {
			this.UpdateFristFrame();
		} else {
			this.UpdateScendFrame();
		}
		//如果是亲友圈的房间或者联盟的房间显示继续游戏按钮
		let roomCfg = this.room.GetRoomConfig();
		if (0 != roomCfg.clubId) {
			this.isClubRoom = true;
		}
		this.btn_continue.active = roomCfg.unionId > 0;
	},
	HideSecondLabel: function () {
		for (let i = 0; i < 10; i++) {
			this.topLabels[i].getComponent(cc.Label).string = '';
			this.bottomLabels[i].getComponent(cc.Label).string = '';
		}
	},
	UpdateFristFrame: function () {
		this.fristScorll.stopAutoScroll();
		this.secondScorll.stopAutoScroll();
		this.fristLayout.removeAllChildren();
		let dataCount = 0;
		for (let i = 0; i < this.fristData.length; i++) {
			if (0 != this.fristData[i].pid)
				dataCount++
		}
		let usePrefabIndex = 1;
		if (dataCount > 4) {
			usePrefabIndex = 2;
		}
		//先找出大赢家
		let bigBang = -1;
		//console.log();
		let lastPoint = this.fristData[0].point;
		for (let i = 0; i < this.fristData.length; i++) {
			if (this.fristData[i].pid <= 0)
				continue;
			if (lastPoint < this.fristData[i].point) {
				bigBang = i;
				lastPoint = this.fristData[i].point;
			}
		}
		if (0 != this.fristData[0].point && -1 == bigBang) {
			bigBang = 0;
		}
		let showTipIndex = 1;
		let node = null;
		let nodeObjs = {};
		for (let i = 0; i < this.fristData.length; i++) {
			let allNum = this.fristData[i].winCount + this.fristData[i].loseCount + this.fristData[i].flatCount;
			if (this.fristData[i].pid <= 0 || 0 == allNum) {
				continue;
			}
			if (1 == usePrefabIndex) {
				node = cc.instantiate(this.prefab1);
				showTipIndex = 1;
			} else {
				node = cc.instantiate(this.prefab2);
				showTipIndex = 2;
			}
			this.GetFristPrefabAllNode(node, nodeObjs);
			if (i >= showTipIndex)
				nodeObjs.topTitle.active = false;
			if (bigBang == i || lastPoint == this.fristData[i].point) {
				nodeObjs.iconWin.active = true;
			} else {
				nodeObjs.iconWin.active = false;
			}

			this.SetUserInfo(nodeObjs.userInfo, this.fristData[i].pid);
			this.SetScore(nodeObjs, i);
			this.SetSportPoint(nodeObjs, i);
			this.fristLayout.addChild(node);
		}
		if (this.dataByZhanJi) {
			this.exitBtnNode.active = true;
		} else {
			this.exitRoomBtnNode.active = true;
			this.goSecondBtnNode.active = true;
			if (!app[app.subGameName + "_ShareDefine"]().isCoinRoom) {
			} else {
				let roomCfg = this.room.GetRoomConfig();
				this.btn_continue.active = roomCfg.unionId > 0;
			}
		}
		this.fristFrame.active = true;
		this.secondFrame.active = false;
	},
	GetFristPrefabAllNode: function (curNode, nodeObjs) {
		nodeObjs.topTitle = curNode.getChildByName('topTitle');
		nodeObjs.userInfo = curNode.getChildByName('user_info');
		nodeObjs.winNum = curNode.getChildByName('lb_win_num');
		nodeObjs.loseNum = curNode.getChildByName('lb_lose_num');
		nodeObjs.win = curNode.getChildByName('lb_win');
		nodeObjs.lose = curNode.getChildByName('lb_lose');
		nodeObjs.ping = curNode.getChildByName('lb_ping');
		nodeObjs.iconWin = curNode.getChildByName('icon_win');
		nodeObjs.lb_sportsPoint = curNode.getChildByName('lb_sportsPoint');
	},
	SetUserInfo: function (userInfoNode, pid) {
		let player = null;
		let ownerID = 0;
		if (this.dataByZhanJi) {
			for (let i = 0; i < this.playerList.length; i++) {
				if (pid == this.playerList[i].pid) {
					player = this.playerList[i];
					break;
				}
			}
			ownerID = this.datainfo.ownerID;
		} else {
			player = this.room.GetPlayerInfoByPid(pid);
			ownerID = this.room.GetRoomProperty("ownerID");
		}
		if (!player) {
			console.error('SetUserInfo Error this.playerList.length = ' + this.playerList.length);
			return;
		}
		let playerName = "";
		playerName = player["name"];
		if (playerName.length > 4) {
			playerName = playerName.substring(0, 4) + '...';
		}
		userInfoNode.getChildByName("lable_name").getComponent(cc.Label).string = playerName;
		userInfoNode.getChildByName("label_id").getComponent(cc.Label).string = this.ComTool.GetPid(pid);
		let wechatSprite = userInfoNode.getChildByName("head_img").getComponent(app.subGameName + "_WeChatHeadImage");
		wechatSprite.onLoad();
		wechatSprite.ShowHeroHead(pid);

		//判断房主是谁
		let fangzhu = userInfoNode.getChildByName("fangzhu");
		if (ownerID == player.pid) {
			fangzhu.active = true;
		} else {
			fangzhu.active = false;
		}
	},
	SetScore: function (nodeObjs, dataIndex) {
		let data = this.fristData[dataIndex];
		if (data.point > 0) {
			nodeObjs.winNum.active = true;
			nodeObjs.loseNum.active = false;
			if (data.point > 10000) {
				let needNum = data.point / 10000;
				needNum = needNum.toFixed(1);
				nodeObjs.winNum.getComponent(cc.Label).string = '+' + needNum + '万';
			} else {
				nodeObjs.winNum.getComponent(cc.Label).string = '+' + data.point;
			}
		} else {
			nodeObjs.winNum.active = false;
			nodeObjs.loseNum.active = true;
			if (data.point < -10000) {
				let needNum = data.point / 10000;
				needNum = needNum.toFixed(1);
				nodeObjs.loseNum.getComponent(cc.Label).string = '' + needNum + '万';
			} else {
				nodeObjs.loseNum.getComponent(cc.Label).string = data.point;
			}
		}

		nodeObjs.win.getComponent(cc.Label).string = data.winCount;
		nodeObjs.lose.getComponent(cc.Label).string = data.loseCount;
		nodeObjs.ping.getComponent(cc.Label).string = data.flatCount;
	},

	SetSportPoint: function (nodeObjs, dataIndex) {
		let data = this.fristData[dataIndex];
		let sportsPoint = data["sportsPoint"];
		let lb_sportsPoint = nodeObjs.lb_sportsPoint;
		console.log("总结算渲染数据", data);
		if (typeof (sportsPoint) != "undefined") {
			if (sportsPoint > 0) {
				lb_sportsPoint.getComponent(cc.Label).string = "+" + sportsPoint;
			} else {
				lb_sportsPoint.getComponent(cc.Label).string = "" + sportsPoint;
			}
			lb_sportsPoint.parent.getChildByName("topTitle").getChildByName("sport").active = true;
			lb_sportsPoint.active = true;
		} else {
			lb_sportsPoint.active = false;
			lb_sportsPoint.parent.getChildByName("topTitle").getChildByName("sport").active = false;
		}
	},
	UpdateScendFrame: function () {
		if (!this.recordList)
			return;

		for (let i = 0; i < this.topLabels.length; i++) {
			this.topLabels[i].active = false;
			this.bottomLabels[i].active = false;
		}

		this.fristScorll.stopAutoScroll();
		this.secondScorll.stopAutoScroll();
		this.secondLayout.removeAllChildren();
		this.HideSecondLabel();
		let allPlayer = [];
		if (this.dataByZhanJi) {
			allPlayer = this.playerList;
		} else {
			allPlayer = this.room.GetRoomProperty("posList");
		}
		let allScore = [];
		for (let i = 0; i < allPlayer.length; i++) {
			let scoreData = {};
			scoreData.point = 0;
			scoreData.isPlaying = false;
			allScore.push(scoreData);
		}
		let startX = this.nnStartX;
		let distance = this.nnDistance;
		let lastUIPos = 0;
		for (let i = 0; i < this.recordList.length; i++) {
			let data = eval('(' + this.recordList[i].dataJsonRes + ')');
			let node = cc.instantiate(this.prefab8);
			node.name = "item" + (i + 1);
			let btn_down = node.getChildByName("btn_down");
			if (btn_down) {
				btn_down.on("click", this.OnPokerDataBtnClick, this);
			}
			node.getChildByName("jushu").getComponent(cc.Label).string = (i + 1).toString();
			let cardNode = node.getChildByName("cardNode");
			lastUIPos = 0;
			for (let j = 0; j < data.posResultList.length; j++) {
				let scoreNode = node.getChildByName("label" + j);
				let scoreLabel = scoreNode.getComponent(cc.Label);
				scoreLabel.string = "";
				let forLength = data.posResultList[j].cardList.length;
				if (data.posResultList[j].pid && forLength > 0) {
					let needIndex = -1;
					for (let s = 0; s < allPlayer.length; s++) {
						if (allPlayer[s].pid == data.posResultList[j].pid) {
							needIndex = s;
							break;
						}
					}
					if (-1 == needIndex || !data.posResultList[j].isPlaying) {
						continue;
					}

					scoreNode = node.getChildByName("label" + lastUIPos);
					scoreNode.x = startX + lastUIPos * distance;
					scoreLabel = scoreNode.getComponent(cc.Label);

					this.topLabels[lastUIPos].active = true;
					this.topLabels[lastUIPos].x = startX + lastUIPos * distance;
					this.topLabels[lastUIPos].getComponent(cc.Label).string = allPlayer[needIndex].name;
					allScore[needIndex].isPlaying = true;
					allScore[needIndex].point += data.posResultList[j].point;
					let pokerNode = cardNode.getChildByName('pos' + lastUIPos);
					pokerNode.x = startX + lastUIPos * distance;
					let allPoker = null;
					//暂时只有牛牛用这类
					let typeData = null;
					let curCards = data.posResultList[j].cardList;
					allPoker = cc.instantiate(this.pokerNNPrefab);
					allPoker.scale = 0.9
					typeData = app[app.subGameName + "_PokerCard"]().GetNNPokerTypeStr(data.posResultList[j].crawType);
					if (allPoker) {
						//isCallBacker     addBet
						let betNode = allPoker.getChildByName("bet");
						let bankerNode = allPoker.getChildByName("banker");
						let setLabel = null;
						if (data.posResultList[j].isCallBacker) {
							betNode.active = false;
							bankerNode.active = true;
							setLabel = bankerNode.getChildByName("label").getComponent(cc.Label);
							setLabel.string = "x" + data.posResultList[j].callBackerNum;
						} else {
							betNode.active = true;
							bankerNode.active = false;
							setLabel = betNode.getChildByName("label").getComponent(cc.Label);
							setLabel.string = data.posResultList[j].addBet;
						}
						for (let p = 0; p < forLength; p++) {
							let poker = allPoker.getChildByName("card" + p);
							let pokerValue = data.posResultList[j].cardList[p];
							app[app.subGameName + "_PokerCard"]().GetPokeCard(pokerValue, poker, true);
						}
						let typeLabel = allPoker.getChildByName("bg_niu").getChildByName("label");
						typeLabel.getComponent(cc.Label).string = typeData.typeStr;
						allPoker.active = true;
						pokerNode.addChild(allPoker);
					}
					if (data.posResultList[j].point > 0) {
						scoreLabel.string = "+" + data.posResultList[j].point;
						scoreNode.color = this.redColor;
					} else {
						scoreLabel.string = data.posResultList[j].point;
						scoreNode.color = this.greenColor;
					}
					lastUIPos++;
				}
			}
			if (cardNode) {
				cardNode.active = false;
			}
			this.secondLayout.addChild(node);
		}
		lastUIPos = 0;
		for (let i = 0; i < allScore.length; i++) {
			this.bottomLabels[lastUIPos].active = true;
			this.bottomLabels[lastUIPos].x = startX + lastUIPos * distance;
			if (allScore[i].isPlaying) {
				if (allScore[i].point > 0) {
					this.bottomLabels[lastUIPos].getComponent(cc.Label).string = "+" + allScore[i].point;
					this.bottomLabels[lastUIPos].color = this.redColor;
				} else {
					this.bottomLabels[lastUIPos].getComponent(cc.Label).string = allScore[i].point;
					this.bottomLabels[lastUIPos].color = this.greenColor;
				}
				lastUIPos++;
			} else {
				this.bottomLabels[i].getComponent(cc.Label).string = '';
			}
		}

		this.fristFrame.active = false;
		this.secondFrame.active = true;
	},
	Event_GameRecord: function (serverPack) {
		this.recordList = serverPack.pSetRoomRecords;
		if (!this.needShowSecond)
			return;

		// this.UpdateScendFrame();
	},


	//-----------------回调函数------------------

	//---------点击函数---------------------
	OnPokerDataBtnClick: function (event) {
		let node = event.node;
		let parent = node.parent;
		let cardNode = parent.getChildByName('cardNode');
		if (cardNode.active) {
			node.angle = 0;
			parent.height = parent.height - cardNode.height;
			cardNode.active = false;
		} else {
			node.angle = 180;
			parent.height = parent.height + cardNode.height;
			cardNode.active = true;
		}
	},
	HideAllBtn: function () {
		this.exitBtnNode.active = false;
		this.exitRoomBtnNode.active = false;
		this.goSecondBtnNode.active = false;
		this.btn_continue.active = false;
	},
	OnClick: function (btnName, btnNode) {
		//继续房间使用
		let room = app[app.subGameName.toUpperCase() + "Room"]();
		let roomCfg = {};
		if (room) {
			roomCfg = room.GetRoomConfig();
			roomCfg.isContinue = true;
		}
		//继续房间使用

		if ('btn_close' == btnName) {
			if (!this.dataByZhanJi) {
				this.secondFrame.active = false;
				this.fristFrame.active = true;
			}
			else
				this.CloseForm();
		}
		else if ('btn_goScend' == btnName) {
			/*if (!this.room.GetGameRecord())
				this.needShowSecond = true;
			else {
				this.UpdateScendFrame();
			}*/
			this.UpdateScendFrame();
		}
		else if ('btn_share' == btnName) {
			this.SDKManager.ShareScreen();
		}
		else if ("btn_continue" == btnName) {
			cc.log("点击继续按钮");
			if (this.isNewVersion == true) {
				app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("游戏有新版本更新，请返回大厅");
				return;
			}
			if (this.isClubRoom == true) {
				let self = this;
				//继续游戏初始化界面
				cc.log("初始化界面");
				// app["UI"+app.subGameName.toUpperCase()+"Play"]()。
				self.CloseForm();
				app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ContinueEnterRoom", {}, function (event) {
				
					 app[app.subGameName + "_NetManager"]().SendPack("game.C1101GetRoomID", {});

				
					cc.log("关闭战绩界面");
					// self.CloseCurAllFrom();
				}, function (event) {
					if (event.Msg == "UNION_BACK_OFF_PLAYING") {
						app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("您已申请退赛，当前无法进行比赛，请取消退赛申请或联系赛事举办方");
					} else if (event.Msg == "UNION_APPLY_REMATCH_PLAYING") {
						app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("您的比赛分不足，已被淘汰，将被禁止参与赛事游戏，如要重新参与比赛，请联系举办方处理");
					} else if (event.Msg == "UNION_STATE_STOP") {
						app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("赛事已停用，无法加入房间，请联系赛事举办方");
					} else if (event.Msg == "ROOM_GAME_SERVER_CHANGE") {
						console.log("切换服务器");
					} else if (event.Code == 12) {
						console.log("游戏维护");
					} else if (event.Msg == "WarningSport_RoomJoinner") {
						app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("您所在的推广员队伍或上级队伍比赛分低于预警值，无法加入比赛，请联系管理");
					} else if (event.Msg == "CLUB_SPORT_POINT_WARN") {
						app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("您所在的亲友圈比赛分低于预警值，无法加入比赛，请联系管理");
					} else {
						app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("无法继续游戏，请联系赛事举办方");
					}
				});
			} else {
				btnNode.getChildByName('more').active = true;
			}
		}
		else if ('btn_exitRoom' == btnName) {
			app[app.subGameName + "Client"].ExitGame();
		} else if ('btn_exit' == btnName) {
			this.CloseForm();
		} /*else if (btnName == "btn_pingfenkaiju") {
			roomCfg.paymentRoomCardType = 1;
			app[app.subGameName + "_NetManager"]().SendPack("nn.CNNCreateRoom", roomCfg, function () {
			}, this.FailCreate.bind(this));
		} else if (btnName == "btn_wolaikaiju") {
			roomCfg.paymentRoomCardType = 0;
			app[app.subGameName + "_NetManager"]().SendPack("nn.CNNCreateRoom", roomCfg, function () {
			}, this.FailCreate.bind(this));
		} else if (btnName == "btn_dayingjiakaiju") {
			roomCfg.paymentRoomCardType = 2;
			app[app.subGameName + "_NetManager"]().SendPack("nn.CNNCreateRoom", roomCfg, function () {
			}, this.FailCreate.bind(this));
		} */
		else if (btnName == "btn_wolaixuju") {
			this.RoomXuJu(0);
		}
		else if (btnName == "btn_pingfenxuju") {
			this.RoomXuJu(1);
		}
		else if (btnName == "btn_dayingjiaxuju") {
			this.RoomXuJu(2);
		} else {
			console.error("OnClick(%s) not find btnName", btnName);
		}
	},
	RoomXuJu: function (type) {
		if (this.isNewVersion == true) {
			app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("游戏有新版本更新，请返回大厅");
			return;
		}
		let self = this;
		app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ContinueRoom", {
			"roomID": this.ShareLongRoomID,
			"continueType": type
		}, function (event) {
			let roomID = event.roomID;
			//关闭游戏主场景。重新进入
			self.FormManager.CloseForm("game/NN/ui/UINNPlay");
			app[app.subGameName.toUpperCase() + "RoomMgr"]().SendGetRoomInfo(roomID);
			self.CloseForm();
		}, function (event) {
			if (event.Object_IsNull == 412) {
				app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("该房间已经解散");
			} else if (event.NotAllow == 103) {
				app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("该房间已续局");
			} else {
				app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("续局游戏失败...");
			}

		});
	},
	FailCreate: function (serverPack) {
		if (serverPack['Msg'].indexOf('RoomCard need roomCard') > -1) {
			let desc = app[app.subGameName + "_SysNotifyManager"]().GetSysMsgContentByMsgID("MSG_NotRoomCard");
			app.ConfirmManager().SetWaitForConfirmForm(this.OnConFirm.bind(this), "goBuyCard", []);
			app.FormManager().ShowForm("UIMessage", null, this.ShareDefine.ConfirmBuyGoTo, 0, 0, desc)
			return;
		} else {
			console.error("FailCreate Room Msg:(%s)", serverPack.Msg);
		}
	},
	OnSuccess: function (serverPack) {
		console.log('OnSuccess serverPack', serverPack);
		let roomID = serverPack.roomID;
		app[app.subGameName + "_NetManager"]().SendPack('nn.CNNGetRoomInfo', {"roomID": roomID});
		this.CloseForm();
		// app[app.subGameName + "_ShareDefine"]().practiceId = this.practiceId;
	},

	OnEnterRoomFailed: function (serverPack) {
		console.error('OnEnterRoomFailed serverPack', serverPack);
		app[app.subGameName + "Client"].ExitGame();
	},
	OnConFirm: function (clickType, msgID, backArgList) {
		if (clickType != "Sure") {
			return
		}
		if ("goBuyCard" == msgID) {
			let clientConfig = app.Client.GetClientConfig();
			if (app.PackDefine.APPLE_CHECK == clientConfig["appPackType"]) return
			this.FormManager.ShowForm("UIStore");
			return;
		}
	},
});