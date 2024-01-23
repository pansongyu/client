var app = require("qzmj_app");
cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {
		roomID: cc.Node,
		jushu: cc.Node,
		endTime: cc.Node,

		btn_close: cc.Node,
		btn_sharelink: cc.Node,

		btn_share: cc.Node,
		btn_ddshare: cc.Node,
		btn_cnshare: cc.Node,
		btn_mwshare: cc.Node,

		btn_sharemore: cc.Node,

		btn_exit: cc.Node,

		btn_pingfenkaiju: cc.Node,
		btn_wolaikaiju: cc.Node,
		btn_dayingjiakaiju: cc.Node,

		SpriteMale: cc.SpriteFrame,
		SpriteFeMale: cc.SpriteFrame,
	},

	OnCreateInit: function () {
		this.FormManager = app[app.subGameName + "_FormManager"]();
		this.ComTool = app[app.subGameName + "_ComTool"]();
		this.SDKManager = app[app.subGameName + "_SDKManager"]();
		this.RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
		this.isZhanJi = false;
		this.InitPlayer();
		this.btn_continue = this.GetWndNode("btn_lists/btn_continue");
		this.RegEvent("CodeError", this.Event_CodeError, this);
		this.RegEvent("EVT_CloseDetail", this.CloseForm, this);
		this.RegEvent("NewVersion", this.Event_NewVersion, this);
	},
	Event_NewVersion:function(){
        this.isNewVersion=true;
    },
	Event_CodeError: function (event) {
		let codeInfo = event;
		if (codeInfo["Code"] == this.ShareDefine.NotFind_Room) {
			app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('DissolveRoom');
		}
	},
	InitPlayer: function () {
		let layout_player = this.GetWndNode('layout_player');
		this.player1 = this.GetWndNode('layout_player/player1');
		for (let i = 2; i <= this.ShareDefine.MJRoomJoinCount; i++) {
			let addPlayer = cc.instantiate(this.player1);
			addPlayer.name = "player" + i;
			layout_player.addChild(addPlayer);
		}
		this.player2 = this.GetWndNode('layout_player/player2');
		this.player3 = this.GetWndNode('layout_player/player3');
		this.player4 = this.GetWndNode('layout_player/player4');
	},
	//-----------回调函数------------------

	OnShow: function (basedata = false, playerlist = false, exitBtn = false) {
		this.isNewVersion=false;
        app[app.subGameName+"_HotUpdateMgr"]().CheckUpdate(); //检测客户端是否有新版本
		this.PlayerName = [];
		this.btn_continue.active = false;
		if (exitBtn) {
			this.btn_close.active = false;
			this.btn_exit.active = true;
			/*this.btn_pingfenkaiju.active=true;
			this.btn_wolaikaiju.active=true;
			this.btn_dayingjiakaiju.active=true;*/
			this.isZhanJi = false;
		} else {
			this.btn_close.active = true;
			this.btn_exit.active = false;
			/*this.btn_pingfenkaiju.active=false;
			this.btn_wolaikaiju.active=false;
			this.btn_dayingjiakaiju.active=false;*/
			this.isZhanJi = true;
		}
		if (this.ShareDefine.isCoinRoom) {
			//练习场关闭下局开始
			/*this.btn_pingfenkaiju.active=false;
			this.btn_wolaikaiju.active=false;
			this.btn_dayingjiakaiju.active=true;*/
		}
		this.player1.active = false;
		this.player2.active = false;
		this.player3.active = false;
		this.player4.active = false;
		let roomID = 0;
		let time = 0;
		let setID = 0;
		let playerAll = false;
		let resultsList = false;
		if (basedata === false) {
			let roomEnd = this.RoomMgr.GetEnterRoom().GetRoomProperty("roomEnd");
			let roomEndResult = roomEnd.sRoomEndResult;
			roomID = roomEndResult["key"];
			this.ShareShortRoomID = roomID;
			this.ShareLongRoomID = roomEndResult["roomId"];
			setID = roomEndResult["setId"];
			time = roomEndResult["endTime"];
			playerAll = this.RoomMgr.GetEnterRoom().GetRoomPosMgr().GetRoomAllPlayerInfo();
			resultsList = roomEndResult["resultsList"];
			//如果是代开放，不显示续局
			let roomCfg = this.RoomMgr.GetEnterRoom().GetRoomConfig();
			if (roomCfg.createType == 2 || 0 != roomCfg.clubID) {
				/*this.btn_pingfenkaiju.active=false;
				this.btn_wolaikaiju.active=false;
				this.btn_dayingjiakaiju.active=false;*/
			}
			//如果是亲友圈的房间或者联盟的房间显示继续游戏按钮
			if (0 != roomCfg.clubId) {
				this.btn_continue.active = true;
			}

		} else {
			roomID = basedata.key;
			this.ShareShortRoomID = roomID;
			this.ShareLongRoomID = basedata.roomId;
			resultsList = basedata.resultsList;
			time = basedata.endTime;
			setID = basedata.setId;
			playerAll = playerlist;
		}
		this.roomID.getComponent(cc.Label).string = "房间号:" + roomID;
		if (setID == 102) {
			this.jushu.getComponent(cc.Label).string = "共2圈";
		} else {
			this.jushu.getComponent(cc.Label).string = app.i18n.t("UIWanFa_setCount", {"setCount": setID});
		}
		this.endTime.getComponent(cc.Label).string = this.ComTool.GetDateYearMonthDayHourMinuteString(time);

		let maxPoint = 0;
		let maxDianPao = 0;
		for (let idx = 0; idx < resultsList.length; idx++) {
			let data = resultsList[idx];
			let player = this.GetWndNode("layout_player/" + "player" + (idx + 1).toString());
			player.active = true;
			if (data.point > maxPoint) {
				maxPoint = data.point;
			}
			if (data.dianPaoPoint > maxDianPao) {
				maxDianPao = data.dianPaoPoint;
			}
			let userInfo = this.GetWndNode("layout_player/" + "player" + (idx + 1).toString() + "/user_info");
			if (userInfo) {
				userInfo.getChildByName("head_img").getComponent(app.subGameName + "_WeChatHeadImage").ShowHeroHead(data.pid);
				userInfo.getChildByName("label_id").getComponent(cc.Label).string = this.ComTool.GetPid(data.pid);
				for (let index in playerAll) {
					let player = playerAll[index];
					if (player.pid == data.pid) {
						userInfo.getChildByName("lable_name").getComponent(cc.Label).string = player.name;
						this.PlayerName.push(player.name);
						if (player.sex == this.ShareDefine.HeroSex_Boy) {
							userInfo.getChildByName("sex").getComponent(cc.Sprite).SpriteFrame = this.SpriteMale;
						} else if (player.sex == this.ShareDefine.HeroSex_Girl) {
							userInfo.getChildByName("sex").getComponent(cc.Sprite).SpriteFrame = this.SpriteFeMale;
						}
						break;
					}
				}
			}

			let jiesuan = this.GetWndNode("layout_player/" + "player" + (idx + 1).toString() + "/jiesuan");
			let show = 1;
			let showLabel = false;
			if (jiesuan) {
				this.huTypesShow(jiesuan.getChildByName('layout'), data);
				if (data.point >= 0) {
					jiesuan.getChildByName("lb_win").active = true;
					jiesuan.getChildByName("lb_lost").active = false;
					jiesuan.getChildByName("lb_win").getComponent(cc.Label).string = '+' + data.point;
				} else {
					jiesuan.getChildByName("lb_win").active = false;
					jiesuan.getChildByName("lb_lost").active = true;
					jiesuan.getChildByName("lb_lost").getComponent(cc.Label).string = data.point;
				}
				//比赛分
				if (typeof(data.sportsPoint) != "undefined") {
					if (data.sportsPoint > 0) {
						jiesuan.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = '比赛分：+' + data.sportsPoint;
					} else {
						jiesuan.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = '比赛分：' + data.sportsPoint;
					}
				} else {
					jiesuan.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = "";
				}
			}
		}
		//显示大赢家图标
		for (let idx = 0; idx < resultsList.length; idx++) {
			let data = resultsList[idx];
			let player = this.GetWndNode("layout_player/" + "player" + (idx + 1).toString());

			if (data.point >= maxPoint) {
				player.getChildByName('icon_win').active = true;
			} else {
				player.getChildByName('icon_win').active = false;
			}
		}
		//初始化分享
		if (app['CheckReward']) {
			app[app.subGameName + "_FormManager"]().ShowForm('UIHongBao', app['CheckReward']);
			app['CheckReward'] = null;
		}
	},
	huTypesShow: function (jiesuan, huData) {
		//点炮次数
		let dianPaoPoint = huData["dianPaoPoint"];
		//接炮次数
		let jiePaoPoint = huData["jiePaoPoint"];
		//自摸次数
		let ziMoPoint = huData["ziMoPoint"];

		//胡牌次数
		let huCnt = huData["huCnt"];
		//单游次数
		let danYouPoint = huData["danYouPoint"];
		//双游次数
		let shuangYouPoint = huData["shuangYouPoint"];
		//三游次数
		let sanYouPoint = huData["sanYouPoint"];

		jiesuan.getChildByName('dianpao').getChildByName('num').getComponent(cc.Label).string = dianPaoPoint + '次';
		jiesuan.getChildByName('jiepao').getChildByName('num').getComponent(cc.Label).string = jiePaoPoint + '次';
		jiesuan.getChildByName('zimo').getChildByName('num').getComponent(cc.Label).string = ziMoPoint + '次';
		// jiesuan.getChildByName('hu').getChildByName('num').getComponent(cc.Label).string = huCnt + '次';
		// jiesuan.getChildByName('danyou').getChildByName('num').getComponent(cc.Label).string =danYouPoint + '次';
		// jiesuan.getChildByName('shuangyou').getChildByName('num').getComponent(cc.Label).string = shuangYouPoint + '次';
		// jiesuan.getChildByName('sanyou').getChildByName('num').getComponent(cc.Label).string = sanYouPoint + '次';
	},
	//---------设置接口---------------

	//---------点击函数---------------------
	OnClick: function (btnName, btnNode) {
		//继续房间使用
		let room = this.RoomMgr.GetEnterRoom();
		let roomCfg = {};
		if (room && this.isZhanJi == false) {
			roomCfg = room.GetRoomConfig();
			roomCfg.isContinue = true;
		}
		//继续房间使用
		if (btnName == "btn_ddshare") {
			this.Click_btn_DDShare();
		} else if (btnName == "btn_cnshare") {
			this.Click_btn_CNShare();
		} else if (btnName == "btn_mwshare") {
			this.Click_btn_MWShare();
		} else if (btnName == "btn_sharemore") {
			this.FormManager.ShowForm(app.subGameName + "_UIShare");
		} else if (btnName == "btn_sharelink") {
			this.Click_btn_Sharelink();
		} else if (btnName == "btn_exit") {
			app[app.subGameName + "Client"].ExitGame();
		} else if (btnName == "btn_pingfenkaiju") {
			if(this.isNewVersion==true){
                app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("游戏有新版本更新，请返回大厅");
                return;
            }
			roomCfg.paymentRoomCardType = 1;
			app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "CreateRoom", roomCfg, function () {
			}, this.FailCreate.bind(this));
		} else if (btnName == "btn_wolaikaiju") {
			if(this.isNewVersion==true){
                app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("游戏有新版本更新，请返回大厅");
                return;
            }
			roomCfg.paymentRoomCardType = 0;
			app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "CreateRoom", roomCfg, function () {
			}, this.FailCreate.bind(this));
		} else if (btnName == "btn_dayingjiakaiju") {
			if(this.isNewVersion==true){
                app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("游戏有新版本更新，请返回大厅");
                return;
            }
			roomCfg.paymentRoomCardType = 2;
			app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "CreateRoom", roomCfg, function () {
			}, this.FailCreate.bind(this));
		} else if (btnName == "btn_continue") {
			if(this.isNewVersion==true){
                app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("游戏有新版本更新，请返回大厅");
                return;
            }
			let self = this;
			app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ContinueEnterRoom", {}, function (event) {
				self.CloseForm();
				app[app.subGameName + "_NetManager"]().SendPack("game.C1101GetRoomID", {});
			}, function (event) {
				if (event.Msg == "UNION_BACK_OFF_PLAYING") {
                    app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("您已申请退赛，当前无法进行比赛，请取消退赛申请或联系赛事举办方");
                }else if (event.Msg == "UNION_APPLY_REMATCH_PLAYING") {
                    app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("您的比赛分不足，已被淘汰，将被禁止参与赛事游戏，如要重新参与比赛，请联系举办方处理");
                }else if (event.Msg == "UNION_STATE_STOP") {
                    app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("赛事已停用，无法加入房间，请联系赛事举办方");
                }else if(event.Msg=="ROOM_GAME_SERVER_CHANGE"){
                    console.log("切换服务器");
                }else if(event.Code==12){
                    console.log("游戏维护");
                }else if(event.Msg=="WarningSport_RoomJoinner"){
					app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("您所在的推广员队伍或上级队伍比赛分低于预警值，无法加入比赛，请联系管理");
				}else if(event.Msg=="CLUB_SPORT_POINT_WARN"){
					app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("您所在的亲友圈比赛分低于预警值，无法加入比赛，请联系管理");
                }else{
                    app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("无法继续游戏，请联系赛事举办方");
                }
			});
		} else if (btnName == "btn_close") {
			this.CloseForm();
		} else {
			this.ErrLog("OnClick not find btnName", btnName);
		}
	},
	FailCreate: function (serverPack) {
		if (serverPack['Msg'].indexOf('RoomCard need roomCard') > -1) {
			let desc = app[app.subGameName + "_SysNotifyManager"]().GetSysMsgContentByMsgID("MSG_NotRoomCard");
			app[app.subGameName + "_ConfirmManager"]().SetWaitForConfirmForm(this.OnConFirm.bind(this), "goBuyCard", []);
			app[app.subGameName + "_FormManager"]().ShowForm(app.subGameName + "_UIMessage", null, this.ShareDefine.ConfirmBuyGoTo, 0, 0, desc)
			return;
		} else {
			this.ErrLog("FailCreate Room Msg:(%s)", serverPack.Msg);
		}
	},
	OnConFirm: function (clickType, msgID, backArgList) {
		if (clickType != "Sure") {
			return
		}
		if ("goBuyCard" == msgID) {
			let clientConfig = app[app.subGameName + "Client"].GetClientConfig();
			if (app.PackDefine.APPLE_CHECK == clientConfig["appPackType"]) return
			app[app.subGameName + "_FormManager"]().ShowForm("UIStore");
			return;
		}
	},
});
