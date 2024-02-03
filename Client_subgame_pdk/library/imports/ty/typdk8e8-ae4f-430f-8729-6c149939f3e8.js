"use strict";
cc._RF.push(module, 'typdk8e8-ae4f-430f-8729-6c149939f3e8', 'pdk_UIPublicHead');
// script/game/PDK/pdk_UIPublicHead.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var app = require("pdk_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
        touxiang: cc.Node,
        sp_chatdi_left: cc.Node,
        sp_chatdi_right: cc.Node,
        sp_chatdi_leftBottom: cc.Node,
        sp_chatdi_rightBottom: cc.Node,
        sp_audio_left: cc.Node,
        sp_audio_right: cc.Node,
        sp_lixian: cc.Node,
        sp_likai: cc.Node,
        btn_out: cc.Node,

        zhuangjia: cc.Node,
        fangzhu: cc.Node,

        lb_name: cc.Label,
        lb_jifen: cc.Label,
        btn_head: cc.Node,
        icon_auto: cc.Node,
        face_ani: cc.Node,
        icon_ready: cc.Node,
        bg_box: cc.Node

    },

    Init: function Init(uiPos, dataPos, point) {
        var isLeft = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : -1;
        var bResetPoint = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
        var useBottomChat = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

        this.uiPos = uiPos;
        this.playerPos = dataPos;
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
        if (-1 == this.playerPos) {
            this.node.active = false;
            return;
        }
        if (!this.bIsInitBaseEnd) {
            this.bIsInitBaseEnd = true;
            this.InitBaseData();
        }

        this.node.active = true;
        this.RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
        this.RoomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
        this.WeChatHeadImage = this.btn_head.getComponent(app.subGameName + "_WeChatHeadImage");
        app[app.subGameName + "Client"].RegEvent("SetStart", this.Event_SetStart, this);
        app[app.subGameName + "Client"].RegEvent("PosContine", this.Event_PosContine, this);
        app[app.subGameName + "Client"].RegEvent("PlayerOffline", this.Event_PlayerOffline, this);
        app[app.subGameName + "Client"].RegEvent("SPlayer_Trusteeship", this.OnPack_AutoStart, this);
        app[app.subGameName + "Client"].RegEvent("Head_PosReadyChg", this.Event_PosReadyChg, this);
        app[app.subGameName + "Client"].RegEvent("Head_PosUpdate", this.Event_PosPosUpdate, this);
        app[app.subGameName + "Client"].RegEvent("Head_PosLeave", this.Event_PosLeave, this);
        app[app.subGameName + "Client"].RegEvent("Head_UpdateBacker", this.Event_UpdateBacker, this);
        app[app.subGameName + "Client"].RegEvent("Head_AudioNtf", this.Event_AudioNtf, this);
        app[app.subGameName + "Client"].RegEvent("RoomSportsPointChange", this.Event_SportsPointChange, this);
        //获取控件
        this.lb_SportsPoint = this.node.getChildByName("touxiang").getChildByName("sp_info").getChildByName("lb_SportsPoint");

        this.useTimeNode = this.GetWndNode("touxiang/useTimeNode");
        this.lb_useTime = this.GetWndNode("touxiang/useTimeNode/lb_useTime").getComponent(cc.Label);

        this.HideAllChild();
        this.left = { x: -99, y: 0 };
        this.right = { x: 99, y: 0 };
        this.node.name = 'UIPublicHead' + this.uiPos;
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

    IsRoomXianShi: function IsRoomXianShi() {
        var fangjianxianshi = this.RoomMgr.GetEnterRoom().GetRoomConfigByProperty("fangjianxianshi");
        if (fangjianxianshi == 0) {
            return false;
        }
        return true;
    },
    GetRoomXianShiTime: function GetRoomXianShiTime() {
        var fangjianxianshi = this.RoomMgr.GetEnterRoom().GetRoomConfigByProperty("fangjianxianshi");
        var roomXianShiObj = { 1: 8, 2: 10, 3: 12, 4: 15, 5: 20 };
        return roomXianShiObj[fangjianxianshi] * 60; //分钟转换秒数
    },

    ShowUseTime: function ShowUseTime(useTime) {
        this.useTimeNode.active = this.IsRoomXianShi();
        if (this.IsRoomXianShi()) {
            if (useTime > this.GetRoomXianShiTime()) {
                useTime = this.GetRoomXianShiTime();
            }
            this.useTime = useTime;
            this.lb_useTime.string = this.useTime + "s";
        }
    },
    ShowTimeUpdate: function ShowTimeUpdate(dt) {
        this.useTime += dt;
        var dataTime = Math.floor(this.useTime);
        if (dataTime > this.GetRoomXianShiTime()) {
            console.log("定时器终止时间：", new Date().getTime(), this.useTime);
            dataTime = this.GetRoomXianShiTime();
            this.timeOpen = false;
        }
        this.lb_useTime.string = dataTime + "s";
    },

    SetTimeOpen: function SetTimeOpen(isOpen) {
        this.timeOpen = isOpen;
    },

    setReady: function setReady(isShow) {
        this.icon_ready.active = isShow;
    },
    HideAllChild: function HideAllChild() {
        this.touxiang.active = 0;
        this.sp_chatdi_left.active = 0;
        this.sp_chatdi_right.active = 0;
        this.sp_chatdi_leftBottom.active = 0;
        this.sp_chatdi_rightBottom.active = 0;
        this.sp_audio_left.active = 0;
        this.sp_audio_right.active = 0;
        this.icon_ready.active = 0;
        this.btn_out.active = 0;
        this.icon_auto.active = 0;
        this.zhuangjia.active = 0;
        this.lb_jifen.string = "";
        this.lb_SportsPoint.active = false;
        this.fangzhu.active = false;
        this.sp_lixian.active = false;
        this.sp_likai.active = false;
        this.bg_box.active = false;
        this.useTimeNode.active = false;
        this.timeOpen = false;
        var others = this.node.getChildByName('otherNode').children;
        for (var i = 0; i < others.length; i++) {
            others[i].active = false;
        }
    },
    //-----------------回调函数------------------------
    Event_PosReadyChg: function Event_PosReadyChg(event) {
        var serverPack = event;
        var pos = serverPack["pos"];
        var isReady = serverPack["isReady"];
        if (app[app.subGameName + "_ShareDefine"]().isCoinRoom) {
            //练习场OK 手势图标不显示
            this.btn_out.active = 0;
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
    },

    Event_PosLeave: function Event_PosLeave(event) {
        var serverPack = event;
        var pos = serverPack["pos"];
        if (pos == this.playerPos) this.HideAllChild();
    },

    Event_SetStart: function Event_SetStart(event) {
        if (-1 == this.playerPos) return;
        this.UpdatePlayerInfo();
    },
    Event_PosContine: function Event_PosContine(event) {
        if (-1 == this.playerPos) return;
        if (this.playerPos == event.pos) {
            this.icon_ready.active = true;
        }
    },
    Event_PlayerOffline: function Event_PlayerOffline(event) {
        if (-1 == this.playerPos) return;
        this.UpdatePlayerInfo();
    },

    OnPack_AutoStart: function OnPack_AutoStart(event) {
        if (-1 == this.playerPos) return;
        var serverPack = event;
        var roomID = serverPack["roomID"];
        var pos = serverPack["pos"];
        var isAuto = serverPack["trusteeship"];
        var pid = serverPack["pid"];
        var heroID = app[app.subGameName + "_HeroManager"]().GetHeroProperty("pid");

        var roomPosMg = this.roomMrg.GetEnterRoom().GetRoomPosMgr();
        var allPlayers = roomPosMg.GetRoomAllPlayerInfo();
        allPlayers[pos].trusteeship = isAuto;
        if (pid == allPlayers[this.playerPos].pid) this.icon_auto.active = isAuto;
    },

    //本家显示出牌动作
    OnShowPosActionHelp: function OnShowPosActionHelp() {
        if (-1 == this.playerPos) return;
        this.AddWndEffect("touxiang/btn_headkuang", "touxiangkuangtexiao", "touxiangkuangtexiao");
    },

    //--------------刷新函数-----------------
    OnUpdate: function OnUpdate(dt) {
        if (this.timeOpen) {
            this.ShowTimeUpdate(dt);
        }
        if (-1 == this.playerPos) return;
        var time = new Date().getTime();
        if (this.time) {
            if (this.time < time) {
                this.sp_chatdi_left.active = 0;
                this.sp_chatdi_right.active = 0;
                this.sp_chatdi_leftBottom.active = 0;
                this.sp_chatdi_rightBottom.active = 0;
                return;
            }
            if (!this.useBottomChat) {
                if (this.useLeftChat) {
                    this.sp_chatdi_left.active = 1;
                } else {
                    this.sp_chatdi_right.active = 1;
                }
            } else {
                if (this.useLeftChat) {
                    this.sp_chatdi_leftBottom.active = 1;
                } else {
                    this.sp_chatdi_rightBottom.active = 1;
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
        if (!this.useBottomChat) msgNode = this.msgNode;else msgNode = this.bottomMsgNode;
        var lb_chat = msgNode.getComponent(cc.Label);
        lb_chat.overflow = cc.Label.Overflow.NONE;
        lb_chat.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
        lb_chat.verticalAlign = cc.Label.VerticalAlign.CENTER;
        lb_chat.fontSize = 20;
        lb_chat.lineHeight = 25;
        lb_chat.string = content;
        var width = this.msgNode.width;
        var newWidth = width + 80;
        if (width >= 280) {
            newWidth = 360;
            lb_chat.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
            msgNode.width = 280;
        }
        if (!this.useBottomChat) {
            this.sp_chatdi_leftBottom.active = 0;
            this.sp_chatdi_rightBottom.active = 0;
            if (this.useLeftChat) {
                this.sp_chatdi_left.active = 1;
                this.sp_chatdi_right.active = 0;
                this.sp_chatdi_left.width = newWidth;
            } else {
                this.sp_chatdi_left.active = 0;
                this.sp_chatdi_right.active = 1;
                this.sp_chatdi_right.width = newWidth;
            }
        } else {
            this.sp_chatdi_left.active = 0;
            this.sp_chatdi_right.active = 0;
            if (this.useLeftChat) {
                this.sp_chatdi_leftBottom.active = 1;
                this.sp_chatdi_rightBottom.active = 0;
                this.sp_chatdi_leftBottom.width = newWidth;
            } else {
                this.sp_chatdi_leftBottom.active = 0;
                this.sp_chatdi_rightBottom.active = 1;
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
            this.sp_audio_left.active = 1;
            this.sp_audio_right.active = 0;
            this.AudioAnimation = this.sp_audio_left.getComponent(cc.Animation);
        } else {
            this.sp_audio_left.active = 0;
            this.sp_audio_right.active = 1;
            this.AudioAnimation = this.sp_audio_right.getComponent(cc.Animation);
        }

        this.AudioAnimation.stop();
        this.AudioAnimation.play("UIAudioPlay");
    },

    CloseAudioContent: function CloseAudioContent() {
        if (this.AudioAnimation) this.AudioAnimation.stop();

        this.sp_audio_left.active = 0;
        this.sp_audio_right.active = 0;
    },

    OnClose: function OnClose() {
        this.HideAllChild();
        this.lb_jifen.string = "";
        this.lb_SportsPoint.active = false;
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
            this.icon_ready.x = this.left.x;
            this.icon_ready.y = this.left.y;
            this.icon_auto.x = this.left.x + 23;
            this.icon_auto.y = this.left.y - 36;
        } else {
            this.useLeftAudio = false;
            this.useLeftChat = false;
            this.icon_ready.x = this.right.x;
            this.icon_ready.y = this.right.y;
            this.icon_auto.x = this.right.x - 23;
            this.icon_auto.y = this.right.y - 36;
        }
    },
    Event_AudioNtf: function Event_AudioNtf(event) {
        var serverPack = event;
        var bShow = serverPack["bShow"];
        var pos = serverPack["pos"];
        console.log('Event_AudioNtf bShow ' + bShow + ' pos ' + pos);
        if (bShow) {
            if (pos != this.playerPos) return;
            this.ShowAudioContent();
        } else this.CloseAudioContent();
    },
    Event_UpdateBacker: function Event_UpdateBacker(event) {
        if (-1 == this.playerPos) return;
        var data = event;
        if (data.bShow) this.UpdateBacker();else this.zhuangjia.active = false;
    },
    UpdateBacker: function UpdateBacker() {
        var room = this.roomMrg.GetEnterRoom();
        var state = room.GetRoomProperty("state");
        this.bg_box.active = false;
        if (state == this.ShareDefine.RoomState_Init) {
            this.zhuangjia.active = false;
        } else {
            var roomSet = room.GetRoomSet();
            var dPos = -1;
            if (roomSet) {
                if (roomSet.GetRoomSetInfo().hasOwnProperty('backerPos')) {
                    dPos = roomSet.GetRoomSetProperty("backerPos");
                } else {
                    dPos = roomSet.dataInfo.dPos;
                }
            } else {
                if (room.GetRoomProperty('set').stateInfo) dPos = room.GetRoomProperty('set').stateInfo.backerPos;else dPos = room.GetRoomProperty('set').backerPos;
            }
            var isDPos = false;
            if (dPos == this.playerPos) {
                isDPos = true;
                this.bg_box.active = true;
            }
            //是否庄
            this.zhuangjia.active = isDPos;
        }
    },
    //显示本家玩家信息
    UpdatePlayerInfo: function UpdatePlayerInfo() {
        this.roomMrg = app[app.subGameName.toUpperCase() + "RoomMgr"]();
        var room = this.roomMrg.GetEnterRoom();
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
            this.ErrLog('UIPublicHead this.playerPos >= playerLength');
            return;
        }
        this.playerInfo = allPlayerInfo[this.playerPos];
        //如果没有有玩家坐下
        if (!this.playerInfo || 0 == this.playerInfo.pid) {
            console.log("没有有玩家坐下");
            this.HideAllChild();
            return;
        }
        //准备按钮更新,区分啃爹的金币场
        if (setState == this.ShareDefine.SetState_Playing || setState == this.ShareDefine.SetState_Waiting || setState == this.ShareDefine.SetState_WaitingEx) {
            //游戏进行中，OK按钮关闭
            this.icon_ready.active = false;
        } else {
            if (app[app.subGameName + "_ShareDefine"]().isCoinRoom) {
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
        var room = this.roomMrg.GetEnterRoom();
        var state = room.GetRoomProperty("state");
        if (state != this.ShareDefine.RoomState_Init) return;
        if (room.IsClientIsCreater() == false && room.IsClientIsOwner() == false) {
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
        this.touxiang.active = 1;
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

        if (app[app.subGameName + "_ShareDefine"]().isCoinRoom) {
            this.fangzhu.active = false;
            this.btn_out.active = false;
        } else {
            this.fangzhu.active = iscreateID;
        }

        //是否离线
        if (this.playerInfo.isLostConnect) this.sp_lixian.active = 1;else this.sp_lixian.active = 0;
        //是否离开
        if (this.playerInfo.isShowLeave && !this.playerInfo.isLostConnect) this.sp_likai.active = 1;else this.sp_likai.active = 0;
        //积分
        this.UpDateLabJiFen();
        //比赛分
        if (typeof this.playerInfo['sportsPoint'] != "undefined") {
            this.UpDateLabSportsPoint();
        } else {
            this.lb_SportsPoint.active = false;
        }

        //名字
        this.lb_name.string = this.playerInfo.name;
    },
    UpDateLabJiFen: function UpDateLabJiFen() {
        var playerIntegral = 0;
        var playerRealpoint = 0;
        this.roomCfg = this.RoomMgr.GetEnterRoom().GetRoomConfig();
        if (this.playerInfo) {
            playerIntegral = this.playerInfo.point;
            playerRealpoint = this.playerInfo.realPoint;
        }
        if (_typeof(this.roomCfg.unionId) != undefined && this.roomCfg.unionId > 0) {
            this.lb_jifen.string = playerRealpoint;
            var dianbo = this.RoomMgr.GetEnterRoom().GetRoomConfigByProperty("dianbo");
            if (dianbo > 0 && "loseCardCount" in this.playerInfo) {
                this.lb_jifen.string = this.playerInfo.loseCardCount + "/70张";
            }
        } else {
            this.lb_jifen.string = playerIntegral;
        }
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
        if (this.playerInfo && typeof this.playerInfo['sportsPoint'] != "undefined") {
            sportsPoint = this.playerInfo.sportsPoint;
            var clientPos = this.RoomMgr.GetEnterRoom().GetRoomPosMgr().GetClientPos();
            if (clientPos == this.playerInfo.pos) {
                sportsPoint = this.playerInfo.sportsPoint;
                this.lb_SportsPoint.getComponent(cc.Label).string = sportsPoint;
                this.lb_SportsPoint.active = true;
            } else {
                this.lb_SportsPoint.getComponent(cc.Label).string = "";
                this.lb_SportsPoint.active = false;
            }
        }
    },
    //---------点击函数---------------------
    //---------点击函数---------------------
    OnClick: function OnClick(btnName, btnNode) {
        console.log("onclick btnName:", btnName);
        if (btnName == "btn_head") {
            this.Click_btn_head();
        } else if (btnName == "btn_out") {
            this.Click_btn_out();
        } else {
            this.ErrLog("OnClick btnName:%s error", btnName);
        }
    },

    Click_btn_head: function Click_btn_head() {
        this.FormManager.ShowForm(app.subGameName + "_UIUserInfo", this.playerPos);
    },

    Click_btn_out: function Click_btn_out() {
        var room = this.RoomMgr.GetEnterRoom();
        var state = room.GetRoomProperty("state");
        if (state == this.ShareDefine.RoomState_Playing || state == this.ShareDefine.RoomState_Playing) {
            app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg(app.subGameName.toUpperCase() + "_CANNOT_KICK");
        } else {
            var roomID = this.RoomMgr.GetEnterRoomID();
            app[app.subGameName + "_GameManager"]().SendKickPosIndex(roomID, this.playerPos);
        }
    }

});

cc._RF.pop();