"use strict";
cc._RF.push(module, '5c443St05xNtqhbq5VPmd3i', 'UIFJSSZHead');
// script/game/FJSSZ/UIFJSSZHead.js

"use strict";

var app = require("fjssz_app");
cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {
		lb_font: cc.Font,
		sp_head: [cc.SpriteFrame],
		sp_playState: [cc.SpriteFrame] //0,整理中 1，比牌中 2，抢庄 3，不抢
	},

	Init: function Init(uiPos, dataPos, point) {
		var isLeft = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : -1;
		var bResetPoint = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
		var useBottomChat = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
		var isShowNode = arguments[6];
		var pid = arguments[7];

		this.uiPos = uiPos;
		this.playerPos = dataPos;
		this.unionId = 0;
		if (bResetPoint) {
			this.node.x = point.x;
			this.node.y = point.y;
			if (isLeft == -1) {
				if (point.x > 0) {
					this.isLeft = true;
				} else {
					this.isLeft = false;
				}
			} else {
				if (isLeft) {
					this.isLeft = true;
				} else {
					this.isLeft = false;
				}
			}
		}
		this.playerInfo = null;
		if (!this.bIsInitBaseEnd) {
			this.bIsInitBaseEnd = true;
			this.InitBaseData();
		}
		if (pid > 0) {
			this.node.active = true;
		} else {
			this.node.active = false;
		}
		if (isShowNode) {
			//第二局
			if (pid > 0) {
				this.node.active = true;
			} else {
				this.node.active = false;
			}
		} else {
			this.node.active = true;
		}
		this.ZorderLv = 6;
		this.touxiang = this.node.getChildByName("touxiang");
		this.sp_chatdi_left = this.node.getChildByName("sp_chatdi_left");
		this.sp_chatdi_right = this.node.getChildByName("sp_chatdi_right");
		this.sp_chatdi_leftBottom = this.node.getChildByName("sp_chatdi_leftBottom");
		this.sp_chatdi_rightBottom = this.node.getChildByName("sp_chatdi_rightBottom");
		this.sp_audio_left = this.node.getChildByName("sp_audio_left");
		this.sp_audio_right = this.node.getChildByName("sp_audio_right");
		this.btn_out = this.node.getChildByName("btn_out");
		this.icon_auto = this.node.getChildByName("icon_auto");
		this.face_ani = this.node.getChildByName("face_ani");
		this.icon_ready = this.node.getChildByName("icon_ready");
		this.sp_lixian = this.touxiang.getChildByName("sp_lixian");
		this.sp_likai = this.touxiang.getChildByName("sp_likai");
		this.zhuangjia = this.touxiang.getChildByName("zhuangjia");
		this.fangzhu = this.touxiang.getChildByName("fangzhu");
		this.btn_head = this.touxiang.getChildByName("btn_head");
		this.bg_box = this.touxiang.getChildByName("bg_box");
		this.sp_state = this.touxiang.getChildByName("sp_state");
		this.sp_xiangkuang = this.touxiang.getChildByName("sp_xiangkuang");
		this.lb_name = this.GetWndComponent("touxiang/sp_info/lb_name", cc.Label);
		this.lb_jifen = this.GetWndComponent("touxiang/sp_info/lb_jifen", cc.Label);
		this.lb_id = this.GetWndComponent("touxiang/sp_info/lb_id", cc.Label);

		this.RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
		this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
		this.WeChatHeadImage = this.btn_head.getComponent(app.subGameName + "_WeChatHeadImage");
		app[app.subGameName + "Client"].RegEvent("SetStart", this.Event_SetStart, this);
		app[app.subGameName + "Client"].RegEvent("PosContine", this.Event_PosContine, this);
		app[app.subGameName + "Client"].RegEvent("PlayerOffline", this.Event_PlayerOffline, this);
		// app[app.subGameName + "Client"].RegEvent("SPlayer_Trusteeship", this.OnPack_AutoStart, this);
		app[app.subGameName + "Client"].RegEvent("Head_PosReadyChg", this.Event_PosReadyChg, this);
		app[app.subGameName + "Client"].RegEvent("Head_PosUpdate", this.Event_PosPosUpdate, this);
		app[app.subGameName + "Client"].RegEvent("Head_PosLeave", this.Event_PosLeave, this);
		app[app.subGameName + "Client"].RegEvent("Head_UpdateBacker", this.Event_UpdateBacker, this);
		app[app.subGameName + "Client"].RegEvent("Head_AudioNtf", this.Event_AudioNtf, this);
		app[app.subGameName + "Client"].RegEvent("RoomSportsPointChange", this.Event_SportsPointChange, this);
		//获取控件
		this.lb_SportsPoint = this.node.getChildByName("touxiang").getChildByName("sp_info").getChildByName("lb_SportsPoint");

		this.unionId = this.RoomMgr.GetEnterRoom().GetRoomConfigByProperty("unionId");
		this.HideAllChild();
		this.left = { x: -99, y: 0 };
		this.right = { x: 99, y: 0 };
		this.SetItemPos(this.isLeft);

		this.useBottomChat = useBottomChat;
		this.sp_chatdi_left.removeAllChildren();
		this.sp_chatdi_right.removeAllChildren();
		this.sp_chatdi_leftBottom.removeAllChildren();
		this.sp_chatdi_rightBottom.removeAllChildren();
		this.msgNode = new cc.Node();
		this.msgNode.name = "chat_msg";
		this.msgNode.addComponent(cc.Label);
		this.msgNode.x = 51;
		this.msgNode.y = 0;
		this.msgNode.color = new cc.Color(90, 76, 79);
		this.msgNode.width = 280;
		this.bottomMsgNode = null;
		if (this.isLeft) {
			this.msgNode.scaleX = -1;
			this.msgNode.scaleY = -1;
			this.msgNode.anchorX = 1;
			this.msgNode.anchorY = 0.5;
			this.sp_chatdi_left.addChild(this.msgNode);
			this.bottomMsgNode = cc.instantiate(this.msgNode);
			this.sp_chatdi_leftBottom.addChild(this.bottomMsgNode);
		} else {
			this.msgNode.anchorX = 0;
			this.msgNode.anchorY = 0.5;
			this.sp_chatdi_right.addChild(this.msgNode);
			this.bottomMsgNode = cc.instantiate(this.msgNode);
			this.sp_chatdi_rightBottom.addChild(this.bottomMsgNode);
		}

		this.DeleteWndEffect("touxiang/btn_headkuang", "touxiangkuangtexiao");
		this.UpdatePlayerInfo();
		this.face_ani.getComponent(cc.Animation).on('finished', this.onFinished.bind(this), this);
		this.time = -1;
		app[app.subGameName + "_HeadManager"]().SetHeadInfo(dataPos, this.node);
	},
	onFinished: function onFinished() {
		this.face_ani.active = false;
	},

	setReady: function setReady(isShow) {
		this.icon_ready.active = isShow;
		if (isShow) {
			this.sp_state.getComponent(cc.Sprite).spriteFrame = "";
		}
	},
	HideAllChild: function HideAllChild() {
		this.touxiang.active = true;
		this.btn_head.getComponent(cc.Sprite).spriteFrame = this.sp_head[2];
		this.sp_xiangkuang.active = false;
		this.sp_chatdi_left.active = false;
		this.sp_chatdi_right.active = false;
		this.sp_chatdi_leftBottom.active = false;
		this.sp_chatdi_rightBottom.active = false;
		this.sp_audio_left.active = false;
		this.sp_audio_right.active = false;
		this.icon_ready.active = false;
		this.btn_out.active = false;
		this.icon_auto.active = false;
		this.zhuangjia.active = false;
		this.lb_jifen.string = "";
		this.lb_name.string = "";
		this.lb_id.string = "";
		this.fangzhu.active = false;
		this.sp_lixian.active = false;
		this.sp_likai.active = false;
		// this.bg_box.active = false;
		this.sp_state.getComponent(cc.Sprite).spriteFrame = "";
		var others = this.node.getChildByName("otherNode").children;
		for (var i = 0; i < others.length; i++) {
			others[i].active = false;
		}
		this.lb_SportsPoint.active = false;
	},
	//-----------------回调函数------------------------
	Event_PosReadyChg: function Event_PosReadyChg(event) {
		var serverPack = event;
		var pos = serverPack["pos"];
		var isReady = serverPack["isReady"];
		if (this.ShareDefine.isCoinRoom) {
			//练习场OK 手势图标不显示
			this.btn_out.active = false;
		} else {
			if (pos == this.playerPos) {
				if (isReady == true) {
					this.icon_ready.active = true;
				} else {
					this.icon_ready.active = false;
				}
			}
		}
	},

	Event_PosPosUpdate: function Event_PosPosUpdate(event) {
		this.UpdatePlayerInfo();
		if (event["isShowNode"]) {
			if (this.playerInfo && this.playerInfo["pid"] > 0) {
				this.node.active = true;
			} else {
				this.node.active = false;
			}
		}
	},

	Event_PosLeave: function Event_PosLeave(event) {
		var serverPack = event;
		var pos = serverPack["pos"];
		if (pos == this.playerPos) {
			this.HideAllChild();
		}
		if (event["isShowNode"]) {
			if (this.playerInfo && this.playerInfo["pid"] > 0) {
				this.node.active = true;
			} else {
				this.node.active = false;
			}
		}
	},

	Event_SetStart: function Event_SetStart(event) {
		if (this.playerInfo && this.playerInfo["pid"] > 0) {
			this.UpdatePlayerInfo();
			return;
		}
		this.node.active = false;
	},
	Event_PosContine: function Event_PosContine(event) {
		if (-1 == this.playerPos) {
			return;
		}
		if (this.playerPos == event.pos) {
			this.icon_ready.active = true;
		}
	},
	Event_PlayerOffline: function Event_PlayerOffline(event) {
		if (-1 == this.playerPos) {
			return;
		}
		this.UpdatePlayerInfo();
	},

	OnPack_AutoStart: function OnPack_AutoStart(event) {
		if (-1 == this.playerPos) {
			return;
		}
		var serverPack = event;
		var roomID = serverPack["roomID"];
		var pos = serverPack["pos"];
		var isAuto = serverPack["trusteeship"];
		var pid = serverPack["pid"];
		var roomPosMg = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
		var allPlayers = roomPosMg.GetRoomAllPlayerInfo();
		allPlayers[pos].trusteeship = isAuto;
		if (pid == allPlayers[this.playerPos].pid) {
			this.icon_auto.active = isAuto;
		}
	},

	//本家显示出牌动作
	OnShowPosActionHelp: function OnShowPosActionHelp() {
		if (-1 == this.playerPos) {
			return;
		}
		this.AddWndEffect("touxiang/btn_headkuang", "touxiangkuangtexiao", "touxiangkuangtexiao");
	},

	//--------------刷新函数-----------------
	OnUpdate: function OnUpdate() {
		if (-1 == this.playerPos) {
			return;
		}
		var time = new Date().getTime();
		if (this.time) {
			if (this.time < time) {
				this.sp_chatdi_left.active = false;
				this.sp_chatdi_right.active = false;
				this.sp_chatdi_leftBottom.active = false;
				this.sp_chatdi_rightBottom.active = false;
				return;
			}
			if (!this.useBottomChat) {
				if (this.useLeftChat) {
					this.sp_chatdi_left.active = true;
				} else {
					this.sp_chatdi_right.active = true;
				}
			} else {
				if (this.useLeftChat) {
					this.sp_chatdi_leftBottom.active = true;
				} else {
					this.sp_chatdi_rightBottom.active = true;
				}
			}
		}
	},

	//本家动作结束回调
	OnClosePosActionHelp: function OnClosePosActionHelp() {
		this.DeleteWndEffect("touxiang/btn_headkuang", "touxiangkuangtexiao");
	},

	ShowChatContent: function ShowChatContent(content) {
		var msgNode = null;
		if (!this.useBottomChat) {
			msgNode = this.msgNode;
		} else {
			msgNode = this.bottomMsgNode;
		}
		var lb_chat = msgNode.getComponent(cc.Label);
		lb_chat.overflow = cc.Label.Overflow.NONE;
		lb_chat.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
		lb_chat.verticalAlign = cc.Label.VerticalAlign.CENTER;
		lb_chat.fontSize = 20;
		lb_chat.lineHeight = 25;
		lb_chat.font = this.lb_font;
		lb_chat.string = content;
		var width = this.msgNode.width;
		var newWidth = width + 80;
		if (width >= 280) {
			newWidth = 360;
			lb_chat.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
			msgNode.width = 280;
		}
		if (!this.useBottomChat) {
			this.sp_chatdi_leftBottom.active = false;
			this.sp_chatdi_rightBottom.active = false;
			if (this.useLeftChat) {
				this.sp_chatdi_left.active = true;
				this.sp_chatdi_right.active = false;
				this.sp_chatdi_left.width = newWidth;
			} else {
				this.sp_chatdi_left.active = false;
				this.sp_chatdi_right.active = true;
				this.sp_chatdi_right.width = newWidth;
			}
		} else {
			this.sp_chatdi_left.active = false;
			this.sp_chatdi_right.active = false;
			if (this.useLeftChat) {
				this.sp_chatdi_leftBottom.active = true;
				this.sp_chatdi_rightBottom.active = false;
				this.sp_chatdi_leftBottom.width = newWidth;
			} else {
				this.sp_chatdi_leftBottom.active = false;
				this.sp_chatdi_rightBottom.active = true;
				this.sp_chatdi_rightBottom.width = newWidth;
			}
		}
		this.time = new Date().getTime() + 4000;
	},
	ShowFaceContent: function ShowFaceContent(path) {
		this.face_ani.active = true;
		var animState = this.face_ani.getComponent(cc.Animation).play(path);
		animState.repeatCount = 3;
	},

	ShowAutoIcon: function ShowAutoIcon(isAuto) {
		this.icon_auto.active = isAuto;
	},

	ShowAudioContent: function ShowAudioContent() {
		if (this.useLeftAudio) {
			this.sp_audio_left.active = true;
			this.sp_audio_right.active = false;
			this.AudioAnimation = this.sp_audio_left.getComponent(cc.Animation);
		} else {
			this.sp_audio_left.active = false;
			this.sp_audio_right.active = true;
			this.AudioAnimation = this.sp_audio_right.getComponent(cc.Animation);
		}

		this.AudioAnimation.stop();
		this.AudioAnimation.play("UIAudioPlay");
	},

	CloseAudioContent: function CloseAudioContent() {
		if (this.AudioAnimation) this.AudioAnimation.stop();

		this.sp_audio_left.active = false;
		this.sp_audio_right.active = false;
	},

	OnClose: function OnClose() {
		this.HideAllChild();
		this.lb_jifen.string = "";
		this.fangzhu.active = false;
		this.uiPos = -1;
		this.playerPos = -1;
		this.playerInfo = null;
		app[app.subGameName + "Client"].UnRegTargetEvent(this);
	},
	SetItemPos: function SetItemPos(isLeft) {
		if (isLeft) {
			this.useLeftAudio = true;
			this.useLeftChat = true;
			/*this.icon_ready.x = this.left.x;
   this.icon_ready.y = this.left.y;*/
			this.icon_auto.x = this.left.x + 39;
			this.icon_auto.y = this.left.y - 36;
		} else {
			this.useLeftAudio = false;
			this.useLeftChat = false;
			/*this.icon_ready.x = this.right.x;
   this.icon_ready.y = this.right.y;*/
			this.icon_auto.x = this.right.x - 39;
			this.icon_auto.y = this.right.y - 36;
		}
	},
	Event_AudioNtf: function Event_AudioNtf(event) {
		var serverPack = event;
		var bShow = serverPack["bShow"];
		var pos = serverPack["pos"];
		console.log('Event_AudioNtf bShow ' + bShow + ' pos ' + pos);
		if (bShow) {
			if (pos != this.playerPos) {
				return;
			}
			this.ShowAudioContent();
		} else {
			this.CloseAudioContent();
		}
	},
	Event_UpdateBacker: function Event_UpdateBacker(event) {
		if (-1 == this.playerPos) return;
		var data = event;
		if (data.bShow) {
			this.UpdateBacker();
		} else {
			this.zhuangjia.active = false;
		}
	},
	UpdateBacker: function UpdateBacker() {
		var room = this.RoomMgr.GetEnterRoom();
		var state = room.GetRoomProperty("state");
		// this.bg_box.active = false;
		if (state == this.ShareDefine.RoomState_Init) {
			this.zhuangjia.active = false;
		} else {
			var roomSet = room.GetRoomSet();
			var dPos = -1;
			if (roomSet) {
				if (roomSet.GetRoomSetInfo().hasOwnProperty("backerPos")) {
					dPos = roomSet.GetRoomSetProperty("backerPos");
				} else {
					dPos = roomSet.dataInfo.dPos;
				}
			} else {
				if (room.GetRoomProperty("set").stateInfo) dPos = room.GetRoomProperty("set").stateInfo.backerPos;else dPos = room.GetRoomProperty("set").backerPos;
			}
			var isDPos = false;
			if (dPos == this.playerPos) {
				isDPos = true;
				// this.bg_box.active = true;
			}
			//是否庄
			this.zhuangjia.active = isDPos;
		}
	},
	ShowOrHideZhuangJia: function ShowOrHideZhuangJia(isShow) {
		this.zhuangjia.active = isShow;
	},
	//显示本家玩家信息
	UpdatePlayerInfo: function UpdatePlayerInfo() {
		var room = this.RoomMgr.GetEnterRoom();
		var state = room.GetRoomProperty("state");
		var setState = 0;
		if (state == this.ShareDefine.RoomState_Playing || state == this.ShareDefine.RoomState_Waiting || state == this.ShareDefine.RoomState_WaitingEx) {
			//房间启动了，获取游戏是否在进行
			setState = room.GetRoomSet().GetRoomSetProperty("state");
		}
		var allPlayerInfo = null;
		var playerLength = 0;
		allPlayerInfo = room.GetRoomPosMgr().GetRoomAllPlayerInfo();
		playerLength = allPlayerInfo.length;
		if (this.playerPos >= playerLength) {
			console.error('UIPublicHead this.playerPos >= playerLength');
			return;
		}
		this.playerInfo = allPlayerInfo[this.playerPos];
		//如果没有有玩家坐下
		if (!this.playerInfo || 0 == this.playerInfo.pid) {
			this.HideAllChild();
			return;
		}
		this.sp_xiangkuang.active = true;
		if (0 == this.uiPos) {
			this.sp_xiangkuang.getComponent(cc.Sprite).spriteFrame = this.sp_head[this.uiPos];
		} else {
			this.sp_xiangkuang.getComponent(cc.Sprite).spriteFrame = this.sp_head[1];
		}
		this.sp_xiangkuang.getComponent(cc.Sprite).interactable = false;
		//准备按钮更新,区分啃爹的金币场
		if (setState == this.ShareDefine.SetState_Playing || setState == this.ShareDefine.SetState_Waiting || setState == this.ShareDefine.SetState_WaitingEx) {
			//游戏进行中，OK按钮关闭
			this.icon_ready.active = false;
		} else {
			if (this.ShareDefine.isCoinRoom) {
				this.icon_ready.active = true;
			} else {
				if (state == this.ShareDefine.RoomState_Init) {
					if (this.playerInfo.roomReady) {
						this.icon_ready.active = true;
					} else {
						this.icon_ready.active = false;
					}
				} else {
					if (this.playerInfo.gameReady) {
						this.icon_ready.active = true;
					} else {
						this.icon_ready.active = false;
					}
				}
			}
		}
		//隐藏踢出房间按钮
		if (state != this.ShareDefine.RoomState_Init) {
			this.btn_out.active = false;
		}

		//提示控件隐藏
		this.ShowPlayerBaseInfo(room);
		//庄家
		this.UpdateBacker();
	},
	ShowBtnOut: function ShowBtnOut() {
		var room = this.RoomMgr.GetEnterRoom();
		var state = room.GetRoomProperty("state");
		if (state != this.ShareDefine.RoomState_Init) return;
		if (room.IsClientIsCreater() == false) {
			this.btn_out.active = false;
			return;
		}
		if (this.playerInfo.pid == this.createID) {
			this.btn_out.active = false;
		} else {
			this.btn_out.active = true;
		}
	},
	HideBtnOut: function HideBtnOut() {
		this.btn_out.active = false;
	},
	//获取位置玩家头像基础信息
	ShowPlayerBaseInfo: function ShowPlayerBaseInfo(room) {
		this.touxiang.active = true;
		//有玩家坐下才需要显示玩家头像
		var pid = this.playerInfo.pid;
		if (pid) {
			this.WeChatHeadImage.ShowHeroHead(pid);
		}

		//显示是否房主
		var createID = room.GetRoomProperty("ownerID");
		var iscreateID = false;
		this.createID = createID;
		this.HideBtnOut();
		if (this.playerInfo.pid == createID) {
			iscreateID = true;
		} else {
			this.ShowBtnOut();
		}

		if (this.ShareDefine.isCoinRoom) {
			this.fangzhu.active = false;
			this.btn_out.active = false;
		} else {
			this.fangzhu.active = iscreateID;
		}

		//是否离线
		if (this.playerInfo.isLostConnect) {
			this.sp_lixian.active = true;
		} else {
			this.sp_lixian.active = false;
		}
		//是否离开
		if (this.playerInfo.isShowLeave && !this.playerInfo.isLostConnect) {
			this.sp_likai.active = true;
		} else {
			this.sp_likai.active = false;
		}
		//积分
		this.UpDateLabJiFen();
		//竞技点
		if (typeof this.playerInfo.sportsPoint != "undefined") {
			this.UpDateLabSportsPoint();
		} else {
			this.lb_SportsPoint.active = false;
		}
		//名字
		this.lb_name.string = this.playerInfo.name;
		// this.lb_id.string = "ID:" + this.playerInfo.accountID;
		this.lb_id.string = "ID:" + this.playerInfo.pid;
	},
	//头像下的积分
	UpDateLabJiFen: function UpDateLabJiFen() {
		var playerIntegral = 0;
		if (this.playerInfo) {
			// if (typeof(this.playerInfo.sportsPoint) != "undefined") {
			// 	playerIntegral = this.playerInfo.sportsPoint;
			// } else {
			// 	playerIntegral = this.playerInfo.point;
			// }
			playerIntegral = this.playerInfo.point;
		}
		var unionId = this.RoomMgr.GetEnterRoom().GetRoomConfigByProperty("unionId");
		var dianbo = this.RoomMgr.GetEnterRoom().GetRoomConfigByProperty("dianbo");
		var beishu = this.RoomMgr.GetEnterRoom().GetRoomConfigByProperty("beishu");
		if (!beishu) {
			beishu = 1;
		}
		if (dianbo && unionId > 0) {
			playerIntegral = dianbo + playerIntegral;
		}
		this.lb_jifen.string = playerIntegral;
	},
	ShowPlayStateByQZ: function ShowPlayStateByQZ(beishu) {
		//2，抢庄 3，不抢
		if (beishu > 0) {
			//抢庄
			this.sp_state.getComponent(cc.Sprite).spriteFrame = this.sp_playState[2];
		} else {
			//不抢
			this.sp_state.getComponent(cc.Sprite).spriteFrame = this.sp_playState[3];
		}
	},
	ShowPlayState: function ShowPlayState(state) {
		//0整理中, 1比牌中
		if (state >= 0) {
			this.sp_state.getComponent(cc.Sprite).spriteFrame = this.sp_playState[state];
			return;
		}
		this.sp_state.getComponent(cc.Sprite).spriteFrame = state;
	},
	Event_SportsPointChange: function Event_SportsPointChange(event) {
		var roomID = this.RoomMgr.GetEnterRoomID();
		var pos = this.playerInfo.pos;
		var pid = this.playerInfo.pid;
		if (event.roomID != roomID || event.posId != pos || event.pid != pid) {
			return;
		}
		this.UpDateLabSportsPoint();
	},
	UpDateLabSportsPoint: function UpDateLabSportsPoint() {
		var sportsPoint = 0;
		this.unionId = this.RoomMgr.GetEnterRoom().GetRoomConfigByProperty("unionId");
		if (this.playerInfo && typeof this.playerInfo["sportsPoint"] != "undefined" && this.unionId > 0) {
			sportsPoint = this.playerInfo.sportsPoint;
			this.lb_SportsPoint.getComponent(cc.Label).string = sportsPoint;
			// this.lb_SportsPoint.active = true;
		}
	},
	//---------点击函数---------------------
	OnClick: function OnClick(btnName, btnNode) {
		if (btnName == "btn_head") {
			if (this.playerInfo["pid"] > 0) {
				this.Click_btn_head();
			} else {
				var room = this.RoomMgr.GetEnterRoom();
				var state = room.GetRoomProperty("state");
				if (state != this.ShareDefine.RoomState_Playing) {}
				//进行换座
				var roomID = this.RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
				this.RoomMgr.SendSelectPosRoom(roomID, this.playerPos);
			}
		} else if (btnName == "btn_out") {
			this.Click_btn_out();
		} else {
			console.error("OnClick btnName:%s error", btnName);
		}
	},

	Click_btn_head: function Click_btn_head() {
		this.FormManager.ShowForm(app.subGameName + "_UIUserInfo", this.playerPos);
	},

	Click_btn_out: function Click_btn_out() {
		var room = this.RoomMgr.GetEnterRoom();
		var state = room.GetRoomProperty("state");
		if (state == this.ShareDefine.RoomState_Playing || state == this.ShareDefine.RoomState_Playing) {
			app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("SSS_CANNOT_KICK");
		} else {
			var roomID = this.RoomMgr.GetEnterRoomID();
			app[app.subGameName + "_GameManager"]().SendKickPosIndex(roomID, this.playerPos);
		}
	}
});

cc._RF.pop();