(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/game/PDK/UIPDK_XiuXPlay.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ce3dd95CBBPsYg/rOqbOWtx', 'UIPDK_XiuXPlay', __filename);
// script/game/PDK/UIPDK_XiuXPlay.js

"use strict";

var app = require("pdk_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
        btn_ready: cc.Node,
        btn_weixin: cc.Node,
        btn_cancel: cc.Node,
        btn_go: cc.Node,
        btn_exit: cc.Node,
        btn_quit: cc.Node,
        btn_fzfh: cc.Node,
        btn_jifen: cc.Node,
        handCards: cc.Node,
        allCards: cc.Node,
        gameBtn: cc.Node,
        btn_tip: cc.Node,
        btn_pass: cc.Node,
        btn_outCard: cc.Node,
        gameMultiple: cc.Node,
        btn_robDoor: cc.Node,
        btn_notRobDoor: cc.Node,
        btn_openCard: cc.Node,
        boom_Ani: cc.Node,
        lianDui_Ani: cc.Node,
        plane_Ani: cc.Node,
        dragon_Ani: cc.Node,

        labelRoomId: cc.Label, //特殊处理的房间信息显示
        labeiWanfa: cc.Label,
        lb_jushu: cc.Label,
        roomInfo: cc.Node,

        headPrefab: cc.Prefab,
        cardPrefab: cc.Prefab,
        bsPrefab: cc.Prefab,

        giftPrefabs: [cc.Prefab],
        giftNode: cc.Node,

        btn_voice: cc.Node,
        btn_chat: cc.Node,
        btn_auto: cc.Node,

        btn_change: cc.Node,

        bg_electricity: [cc.SpriteFrame],
        bg_wifi: [cc.SpriteFrame],

        UIInvitation: cc.Prefab,
        resVersion: cc.Label
    },

    OnCreateInit: function OnCreateInit() {
        this.RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
        this.Room = app[app.subGameName.toUpperCase() + "Room"]();
        this.HeroManager = app[app.subGameName + "_HeroManager"]();
        this.FormManager = app[app.subGameName + "_FormManager"]();
        this.SceneManager = app[app.subGameName + "_SceneManager"]();
        this.UtilsWord = app[app.subGameName + "_UtilsWord"]();
        this.PokerCard = app[app.subGameName + "_PokerCard"]();
        this.RoomPosMgr = app[app.subGameName.toUpperCase() + "RoomPosMgr"]();
        this.RoomSet = app[app.subGameName.toUpperCase() + "RoomSet"]();
        this.LogicPDKGame = app["Logic" + app.subGameName.toUpperCase() + "Game"]();
        this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
        this.Define = app[app.subGameName.toUpperCase() + "Define"]();
        this.RegEvent("OnCopyTextNtf", this.OnEvt_CopyTextNtf, this);
        this.invitationNode = cc.instantiate(this.UIInvitation);
        this.node.addChild(this.invitationNode);

        //UI
        this.bg_power = this.node.getChildByName("roomInfo").getChildByName("bg_power");
        this.bg_signal = this.node.getChildByName("roomInfo").getChildByName("signal").getChildByName("bg_signal");
        this.nowtime = this.node.getChildByName("roomInfo").getChildByName("nowtime");
        //是否第一次进入
        this.isFirstEnter = true;

        //公共消息
        this.RegEvent(app.subGameName.toUpperCase() + "_PosContinueGame", this.Event_PosContinueGame);
        this.RegEvent(app.subGameName.toUpperCase() + "_DissolveRoom", this.Event_DissolveRoom);
        this.RegEvent(app.subGameName.toUpperCase() + "_StartVoteDissolve", this.Event_StartVoteDissolve); //发起房间结算投票
        this.RegEvent(app.subGameName.toUpperCase() + "_ChangePlayerNum", this.Event_ChangePlayerNum); //发起房间修改人数
        this.RegEvent(app.subGameName.toUpperCase() + "_PosLeave", this.Event_PosLeave);
        this.RegEvent(app.subGameName.toUpperCase() + "_PosUpdate", this.Event_PosUpdate);
        this.RegEvent(app.subGameName.toUpperCase() + "_PosReadyChg", this.Event_PosReadyChg);

        //游戏消息
        this.RegEvent(app.subGameName.toUpperCase() + "SetStart", this.Event_SetStart);
        this.RegEvent(app.subGameName.toUpperCase() + "SetEnd", this.Event_SetEnd);
        this.RegEvent('ExitRoomSuccess', this.Event_ExitRoomSuccess);
        this.RegEvent("RoomEnd", this.Event_RoomEnd);
        this.RegEvent("SPlayer_Trusteeship", this.OnPack_AutoStart);
        this.RegEvent("ChatMessage", this.Event_ChatMessage);
        this.RegEvent("HandCard", this.Event_ShowHandCard);
        this.RegEvent("OpCard", this.Event_OpCard);
        this.RegEvent("ChangeStatus", this.Event_ChangeStatus);
        this.RegEvent("AddDouble", this.Event_AddDouble);
        this.RegEvent("OpenCard", this.Event_OpenCard);
        this.RegEvent("RobClose", this.Event_RobClose);
        this.RegEvent('CodeError', this.Event_CodeError);
        this.RegEvent('GameGift', this.Event_GameGift, this);
        this.RegEvent('StopTime', this.Event_StopTime, this);

        //比赛分不足时通知
        this.RegEvent("SportsPointEnough", this.Event_SportsPointEnough);
        this.RegEvent("SportsPointNotEnough", this.Event_SportsPointNotEnough);

        //比赛分门槛不足时通知
        this.RegEvent("SportsPointThresholdEnough", this.Event_SportsPointThresholdEnough);
        this.RegEvent("SportsPointThresholdNotEnough", this.Event_SportsPointThresholdNotEnough);

        this.Left = [false, true, false, false];

        this.cardSpcedX = 0;

        this.btn_voice.on("touchstart", this.Event_TouchStart, this);
        this.btn_voice.on("touchend", this.Event_TouchEnd, this);
        this.btn_voice.on("touchcancel", this.Event_TouchEnd, this);

        this.handCards.on(cc.Node.EventType.TOUCH_START, this.OnTouchStart, this);
        this.handCards.on(cc.Node.EventType.TOUCH_MOVE, this.OnTouchMove, this);
        this.handCards.on(cc.Node.EventType.TOUCH_END, this.OnTouchEnd, this);
        this.handCards.on(cc.Node.EventType.TOUCH_CANCEL, this.OnTouchCancel, this);

        this.boom_Ani.getComponent(cc.Animation).on('finished', this.OnAniBoomFinished, this);
        this.plane_Ani.getComponent(cc.Animation).on('finished', this.OnAniPlaneFinished, this);
        this.dragon_Ani.getComponent(cc.Animation).on('finished', this.OnAniDragonFinished, this);
        for (var i = 0; i < 4; i++) {
            var ShutDow_Ani = this.GetWndNode("sp_seat0" + i + "/ShutDow_Ani");
            ShutDow_Ani.getComponent(cc.Animation).on('finished', this.OnAniShutDowFinished, this);
        }
        if (cc.sys.isNative) {
            app[app.subGameName + "Client"].RegEvent("EvtBatteryLevel", this.OnEvent_BatteryLevel, this);
        }
        app[app.subGameName + "Client"].RegEvent("EvtSpeedTest", this.OnEvent_SpeedTest, this);
        this.InitData();
        this.AddCardPrefab();

        cc.game.on(cc.game.EVENT_HIDE, this.OnEventHide.bind(this));
        cc.game.on(cc.game.EVENT_SHOW, this.OnEventShow.bind(this));
    },
    OnEvt_CopyTextNtf: function OnEvt_CopyTextNtf(event) {
        if (0 == event.code) this.ShowSysMsg("已复制：" + event.msg);else this.ShowSysMsg("房间号复制失败");
    },
    Event_SportsPointEnough: function Event_SportsPointEnough(event) {
        var msg = event.msg;
        this.SetWaitForConfirm("SportsPointEnough", this.ShareDefine.ConfirmOK, [msg]);
    },
    Event_SportsPointNotEnough: function Event_SportsPointNotEnough(event) {
        var msg = event.msg;
        this.ShowSysMsg("比赛分不足房间自动解散");
        // this.SetWaitForConfirm("SportsPointNotEnough",this.ShareDefine.ConfirmYN, []);
    },

    Event_SportsPointThresholdEnough: function Event_SportsPointThresholdEnough(event) {
        var msg = event.msg;
        this.SetWaitForConfirm("SportsPointThresholdEnough", this.ShareDefine.ConfirmOK, [msg]);
    },
    Event_SportsPointThresholdNotEnough: function Event_SportsPointThresholdNotEnough(event) {
        var msg = event.msg;
        // this.ShowSysMsg("您得比赛分门槛不足，请联系赛事管理");
        this.SetWaitForConfirm("SportsPointThresholdNotEnough", this.ShareDefine.ConfirmOK, []);
    },
    //停止房间倒计时
    Event_StopTime: function Event_StopTime(event) {
        this.HideClientUseTime();
    },
    InitData: function InitData() {
        //所有的牌索引
        this.allCardIdx = 0;
        //自己手牌索引
        this.hanCardIdx = 0;
        //其他玩家手牌索引
        this.player1Idx = 0;
        this.player2Idx = 0;
        this.player3Idx = 0;
        //黑桃3牌索引
        this.card3Idx = 0;

        this.firstTurn = false;

        this.tipCount = 0;

        this.lastCircleEnd = false;

        this.openCardInfo = {};

        this.notUp = false;

        this.isBackGround = false;
        this.BackTime = 5; //oncreate不捕获
        var that = this;
        // cc.game.on(cc.game.EVENT_HIDE, function(event){
        //     if(!that.isBackGround){
        //         that.isBackGround = true;
        //         app[app.subGameName+"_SoundManager"]().StopAllSound();
        //         console.log("切换后台");
        //     }
        // });
        // cc.game.on(cc.game.EVENT_SHOW, function(event){
        //     // if(that.BackTime>3){
        //     //     return;
        //     // }
        //     if(that.isBackGround){
        //         console.log("切换前台"); 
        //         that.isBackGround = false;
        //         let GameBackMusic=that.LocalDataManager.GetConfigProperty("SysSetting","GameBackMusic");
        //         app[app.subGameName+"_SceneManager"]().PlayMusic(GameBackMusic);
        //         // that.BackTime=that.BackTime+1;
        //         app[app.subGameName+"_LocationOnStartMgr"]().OnGetLocation();
        //     }
        // });
    },

    OnAniBoomFinished: function OnAniBoomFinished(event) {
        this.boom_Ani.active = false;
    },
    OnAniPlaneFinished: function OnAniPlaneFinished(event) {
        this.plane_Ani.active = false;
    },
    OnAniDragonFinished: function OnAniDragonFinished(event) {
        this.dragon_Ani.active = false;
    },
    OnAniShutDowFinished: function OnAniShutDowFinished(event) {
        for (var i = 0; i < 4; i++) {
            var ShutDow_Ani = this.GetWndNode("sp_seat0" + i + "/ShutDow_Ani");
            ShutDow_Ani.active = false;
        }
    },

    ShowAllCard: function ShowAllCard() {
        return;
        /*this.allCards.active = true;
        let cardNum = this.Room.GetRoomConfigByProperty("shoupai");
        if(cardNum == 0){
            cardNum = this.Define.MidHandCard;
        }
        else if(cardNum == 1){
            cardNum = this.Define.MidHandCardEx;
        }
        else{
            cardNum = this.Define.MaxHandCard;
        }
        let playerNum = this.Room.GetRoomConfigByProperty("playerNum");
        let allCardNum = playerNum*cardNum;
        let xPos = -512;
        let yPos = 0;
        for(let i = 0; i < allCardNum; i++){
            let card = this.allCards.children[i];
            card.getChildByName("poker_back").active = true;
            card.active = true;
            if(i == 48){
                xPos = -512;
            }
            if(i > 47){
                card.y = -31.5;
                card.x = xPos;
            }
            else{
                card.y = 0;
                card.x = xPos;
            }
            xPos += 22;
        }*/
    },

    AddCardPrefab: function AddCardPrefab() {
        //发牌的牌墩
        /* this.allCards.active = false;
         for(let i = 0; i < this.Define.MaxTableCard; i++){
             let card = cc.instantiate(this.cardPrefab);
             this.allCards.addChild(card);
             card.active = false;
             card.name = "card_" + (i+1).toString();
         }*/

        //玩家手牌
        this.handCards.active = false;
        for (var i = 0; i < this.Define.MaxHandCard; i++) {
            var card = cc.instantiate(this.cardPrefab);
            card.active = false;
            card.name = "card_" + (i + 1).toString();
            this.handCards.addChild(card);
        }

        //玩家打出去的牌
        for (var _i = 0; _i < this.Define.MaxPlayer; _i++) {
            var outCardList = this.node.getChildByName("outCardList" + _i);
            outCardList.active = false;
            for (var j = 0; j < this.Define.MaxHandCard; j++) {
                var _card = cc.instantiate(this.cardPrefab);
                _card.active = false;
                _card.name = "card_" + (_i + 1).toString();
                outCardList.addChild(_card);
            }
        }

        //玩家明牌的牌
        for (var _i2 = 1; _i2 < this.Define.MaxPlayer; _i2++) {
            var openCardList = this.node.getChildByName("openCardList" + _i2);
            openCardList.active = false;
            for (var _j = 0; _j < this.Define.MaxHandCard; _j++) {
                var _card2 = cc.instantiate(this.cardPrefab);
                _card2.active = false;
                _card2.name = "card_" + (_i2 + 1).toString();
                openCardList.addChild(_card2);
            }
        }
    },

    Event_ShowHandCard: function Event_ShowHandCard() {
        this.handCards.active = true;
        var downList = this.LogicPDKGame.GetHandCard();
        for (var i = 0; i < this.handCards.children.length; i++) {
            var cardValue = downList[i];
            var cardNode = this.handCards.children[i];
            cardNode.y = 0;
            if (cardValue) {
                var bSelected = this.LogicPDKGame.CheckSelected(cardValue);
                if (bSelected) {
                    cardNode.y += this.Define.MaxRisePosY;
                }
                var isLastCard = false;
                if (i == downList.length - 1) {
                    isLastCard = true;
                }
                this.ShowCard(cardValue, cardNode, isLastCard);
            } else {
                cardNode.active = false;
            }
        }
        this.canOutCard();
    },

    ChangeCardNum: function ChangeCardNum(dataPos, len) {
        var uiPos = this.RoomPosMgr.GetUIPosByDataPos(dataPos);
        if (uiPos == 0) return;
        var card = this.GetWndNode("sp_seat0" + uiPos + "/card");
        var cardNum = this.GetWndNode("sp_seat0" + uiPos + "/cardNum");
        if (!this.Room.GetRoomWanfa(this.Define.SEVER_SHOWCARDNUM)) {
            // if(!true){//默认显示
            cardNum.active = false;
        } else {
            cardNum.active = true;
        }
        var totalNum = len;
        cardNum.getComponent(cc.Label).string = totalNum.toString() + '';
        if (!card.getChildByName("poker_back").active) {
            card.getChildByName("poker_back").active = true;
        }
        this.ShowWarningByPos(dataPos, totalNum);

        return totalNum;
    },

    ShowWarningByPos: function ShowWarningByPos(dataPos, len) {
        if (this.RoomPosMgr.GetClientPos() == dataPos) return;
        var uiPos = this.RoomPosMgr.GetUIPosByDataPos(dataPos);
        var warning = this.GetWndNode("sp_seat0" + uiPos + "/warning");
        //只有剩一张牌才显示警告动画
        if (len <= 1 && len > 0) {
            warning.active = true;
            warning.getComponent(cc.Animation).play("warning");
        } else {
            warning.active = false;
            warning.getComponent(cc.Animation).stop("warning");
        }
    },

    SetSeat01OutCardPos: function SetSeat01OutCardPos(dataPos, len) {
        var uiPos = this.RoomPosMgr.GetUIPosByDataPos(dataPos);
        if (uiPos != 3) return;

        var node = this.node.getChildByName("outCardList3");
        var posX = 575 - 25 * len;
        node.x = posX;
    },

    SetAniPos: function SetAniPos(dataPos) {
        var uiPos = this.RoomPosMgr.GetUIPosByDataPos(dataPos);
        if (uiPos == 1) {
            this.boom_Ani.setPosition(cc.v2(232, 64));
        } else {
            var outCardList = this.node.getChildByName("outCardList" + uiPos);
            this.boom_Ani.setPosition(cc.v2(outCardList.x, outCardList.y));
        }
    },

    PlayCardSound: function PlayCardSound(pos, opCardType, cardList, circleEnd) {
        var sex = this.GetPlayerSex(pos);
        if (this.lastCircleEnd) {
            if (opCardType == 2) {
                var value = this.LogicPDKGame.GetCardValue(cardList[0]);
                this.SoundManager.PlaySound(sex + "One_" + value);
            } else if (opCardType == 3) {
                var _value = this.LogicPDKGame.GetCardValue(cardList[0]);
                this.SoundManager.PlaySound(sex + "Double_" + _value);
            } else if (opCardType == 4) {
                this.SoundManager.PlaySound(sex + "Series");
            } else if (opCardType == 5) {
                this.SoundManager.PlaySound(sex + "Three");
            } else if (opCardType == 6) {
                this.SoundManager.PlaySound(sex + "ThreeAndOne");
            } else if (opCardType == 7) {
                this.SoundManager.PlaySound(sex + "ThreeAndTwo");
            } else if (opCardType == 8) {
                this.SoundManager.PlaySound(sex + "FourAndOne");
            } else if (opCardType == 9) {
                this.SoundManager.PlaySound(sex + "FourAndTwo");
            } else if (opCardType == 10) {
                this.SoundManager.PlaySound(sex + "FourAndThree");
            } else if (opCardType == 12 || opCardType == 13) {
                this.SoundManager.PlaySound(sex + "Plane");
            } else if (opCardType == 14) {
                this.SoundManager.PlaySound(sex + "SeriesTwo");
            }
        } else {
            if (opCardType == 1) {
                var randomNum = Math.floor(Math.random() * 3 + 1);
                this.SoundManager.PlaySound(sex + "Not_" + randomNum);
            } else if (opCardType == 11) {
                this.SoundManager.PlaySound(sex + "Boom");
            } else {
                var _randomNum = Math.floor(Math.random() * 3 + 1);
                this.SoundManager.PlaySound(sex + "Bigger_" + _randomNum);
            }
        }

        this.lastCircleEnd = circleEnd;
    },

    Event_GameGift: function Event_GameGift(event) {
        var self = this;
        var argDict = event;
        var sendPos = argDict['sendPos'];
        var recivePos = argDict['recivePos'];
        var productId = argDict['productId'];
        var sendHead = app[app.subGameName + "_HeadManager"]().GetComponentByPos(sendPos);
        var reciveHead = app[app.subGameName + "_HeadManager"]().GetComponentByPos(recivePos);
        var giftIdx = productId - 1;
        var tempNode = cc.instantiate(this.giftPrefabs[giftIdx]);
        var ani = tempNode.getComponent(cc.Animation);
        // tempNode.tag = giftIdx;
        tempNode.name = ani.defaultClip.name;
        tempNode.bMove = true;
        ani.on('finished', this.OnGiftAniEnd, this);
        var vec1 = sendHead.node.convertToWorldSpaceAR(cc.v2(0, 0));
        var vec2 = reciveHead.node.convertToWorldSpaceAR(cc.v2(0, 0));
        vec1 = this.giftNode.convertToNodeSpaceAR(vec1);
        vec2 = this.giftNode.convertToNodeSpaceAR(vec2);
        tempNode.x = vec1.x;
        tempNode.y = vec1.y;
        this.giftNode.addChild(tempNode);
        var action = cc.sequence(cc.moveTo(0.3, vec2), cc.callFunc(self.GiftMoveEnd, self));
        tempNode.runAction(action);
    },

    GiftMoveEnd: function GiftMoveEnd(sender, useData) {
        sender.getComponent(cc.Animation).play();
        sender.bMove = false;
        //播放音效
        app[app.subGameName + "_SoundManager"]().PlaySound('mofa_' + sender.name);
    },

    OnGiftAniEnd: function OnGiftAniEnd(event) {
        var nodes = this.giftNode.children;
        for (var i = nodes.length; i > 0; i--) {
            if (event) {
                var aniState = nodes[i - 1].getComponent(cc.Animation).getAnimationState(nodes[i - 1].name);
                if (aniState.isPlaying) continue;
                if (!nodes[i - 1].bMove) nodes[i - 1].removeFromParent();
            } else nodes[i - 1].removeFromParent();
        }
    },

    //检测出牌玩家是否离开中
    CheckOpCardPosIsLeave: function CheckOpCardPosIsLeave(pos) {
        var opPosInfo = this.RoomPosMgr.GetPlayerInfoByPos(pos);
        var roomID = this.RoomMgr.GetEnterRoomID();
        if (opPosInfo.isShowLeave) {
            app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ShowLeave", {
                "roomID": roomID,
                "isShowLeave": false
            });
        }
    },

    Event_OpCard: function Event_OpCard(event) {
        console.log("OpCard信息 == ", event);
        var data = event;
        this.firstTurn = false;
        this.notUp = false;
        this.gameBtn.active = false;
        this.tipCount = 0;
        var time = this.GetClockTime();
        var runWaitSec = data.runWaitSec;
        var secTotal = data.secTotal;
        this.HideClientUseTime();

        this.LogicPDKGame.SortCardByMax(data.cardList);

        //检测出牌玩家是否离开中
        this.CheckOpCardPosIsLeave(data.pos);

        //储存刷新玩家手牌
        this.RoomSet.SetHandCard(data.pos, data.privateList);
        //先清理之前打出去的牌或者玩家的状态
        this.ClearPlayerTable(data.pos);

        if (data.turnEnd) {
            this.LogicPDKGame.ClearCardData();
        }
        //储存刷新Setinfo状态
        this.RoomSet.SetRoomSetProperty("isFirstOp", data.isFirstOp);
        //刷新手牌
        this.Event_ShowHandCard();

        this.ChangeCardNum(data.pos, data.privateList.length);
        this.HideClockByPos(data.pos);
        this.LogicPDKGame.SetCardData(data.opCardType, data.cardList);
        this.ShowOutCard(data.pos, data.cardList, data.opCardType);
        this.SetSeat01OutCardPos(data.pos, data.cardList.length);
        this.DeleteOpenCardList(data.pos, data.cardList);

        //音效
        this.PlayCardSound(data.pos, data.opCardType, data.cardList, data.turnEnd);

        //显示动画特效
        if (data.opCardType == 4) {
            //一条龙
            if (this.LogicPDKGame.CheckDragon()) {
                this.dragon_Ani.active = true;
                this.dragon_Ani.getComponent(cc.Animation).play("dragon");
            }
        } else if (data.opCardType == 14) {//连对
            // this.lianDui_Ani.active = true;
            // this.lianDui_Ani.getComponent(cc.Animation).play("liandui");
        } else if (data.opCardType == 11) {
            //炸弹
            this.boom_Ani.active = true;
            this.SetAniPos(data.pos);
            this.boom_Ani.getComponent(cc.Animation).play("zhadan");
        } else if (data.opCardType == 12 || data.opCardType == 13) {
            this.plane_Ani.active = true;
            this.plane_Ani.getComponent(cc.Animation).play("feiji");
        }

        if (data.pos == this.RoomPosMgr.GetClientPos()) {
            //如果是自动出牌，判断一下是否打开UIAutoPlay
            if (data.isFlash == true) {
                app[app.subGameName + "_FormManager"]().ShowForm(app.subGameName + "_UIAutoPlay", data.dataSecTotal);
            }
            //如果是自动出牌，判断一下是否打开UIAutoPlay
            this.LogicPDKGame.OutPokerCard(data.privateList);
            this.ClearForbiddenTouch();
        }
        //检测是否是当前游戏已经结束
        if (data.isSetEnd) {
            return;
        }

        if (data.nextPos == this.RoomPosMgr.GetClientPos()) {
            //判断剩余手牌是否能一次出完并且没有炸弹，如果可以，直接出
            if (!this.LogicPDKGame.IsHaveBoom()) {
                var opCardType = this.LogicPDKGame.GetCardType(false);
                console.log("所有手牌组成一个牌型：" + opCardType);
                if (opCardType > 0) {
                    var isOut = false;
                    if (data.turnEnd) {
                        isOut = true;
                    } else {
                        var tipArray = this.LogicPDKGame.GetTipCard();
                        if (tipArray.length > 0) {
                            var myHangCard = this.LogicPDKGame.GetHandCard();
                            for (var i = 0; i < tipArray.length; i++) {
                                //发给服务端的消息
                                if (tipArray[i].length == myHangCard.length) {
                                    isOut = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (isOut == true) {
                        var serverPack = {};
                        var roomID = this.RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
                        serverPack.roomID = roomID;
                        var pos = this.RoomPosMgr.GetClientPos();
                        serverPack.pos = pos;
                        var self = this;
                        this.scheduleOnce(function () {
                            self.ClientOpCardByType(opCardType, serverPack, false);
                        }, 1.0);
                        return;
                    }
                }
            }
            if (data.turnEnd) {
                this.ShowBtnOutCard();
            } else {
                var array = this.LogicPDKGame.GetTipCard();
                if (!array.length) {
                    if (this.isAutoPass()) {
                        // this.ShowSysMsg(app.subGameName.toUpperCase()+"_PASS");
                        time = this.Define.MinTickTime;
                    } else {
                        this.ForbiddenTouch(array);
                        this.ShowBtnPass();
                    }
                } else {
                    //是否是必出玩法
                    this.ForbiddenTouch(array);
                    if (this.Room.GetRoomWanfa(this.Define.SEVER_BMUST)) {
                        this.ShowAllGameBtn();
                    } else {
                        this.ShowBtnTipAndOutCard();
                    }
                    if (array.length == 1) {
                        this.Click_btn_tip();
                    }
                }
            }
            //是否执行房间限时时间
            this.GetUICardComponentByPos(data.nextPos).ShowUseTime(secTotal);
            this.GetUICardComponentByPos(data.nextPos).SetTimeOpen(true);
        }

        this.StartTickTime(data.nextPos, runWaitSec, time);
    },

    isCanChoose: function isCanChoose() {
        for (var i = 0; i < this.handCards.children.length; i++) {
            if (this.handCards.children[i].y > 0) {
                return false;
            }
        }
        return true;
    },
    ForbiddenTouch: function ForbiddenTouch(pokerList) {
        this.ClearForbiddenTouch();

        var downList = this.LogicPDKGame.GetHandCard();
        if (pokerList.length) {
            var cardType = this.LogicPDKGame.GetLastCardType();
            if (cardType == 6 || cardType == 7 || cardType == 8 || cardType == 9 || cardType == 10 || cardType == 12 || cardType == 13) {
                if (!this.LogicPDKGame.CheckOnlyBoom(pokerList)) {
                    return;
                }
            }
            var lastValue = 0;
            for (var i = downList.length - 1; i >= 0; i--) {
                var poker = downList[i];
                var cardValue = this.LogicPDKGame.GetCardValue(poker);
                this.handCards.children[i].y = 0;

                if (lastValue == cardValue) {
                    if (this.handCards.children[i + 1].touchTag) {
                        this.handCards.children[i].touchTag = true;
                        this.handCards.children[i].getChildByName('bg_black').active = true;
                    } else {
                        this.handCards.children[i].touchTag = false;
                        this.handCards.children[i].getChildByName('bg_black').active = false;
                    }
                    continue;
                }

                var isHas = false;
                for (var j = 0; j < pokerList.length; j++) {
                    var list = pokerList[j];
                    if (list.indexOf(poker) != -1) {
                        isHas = true;
                        break;
                    }
                }

                if (isHas) {
                    this.handCards.children[i].touchTag = false;
                    this.handCards.children[i].getChildByName('bg_black').active = false;
                } else {
                    this.handCards.children[i].touchTag = true;
                    this.handCards.children[i].getChildByName('bg_black').active = true;
                    //                   this.handCards.children[i].addComponent(cc.Button);
                }
                lastValue = cardValue;
            }
        }
        // else{
        //     for(let i = 0; i < downList.length; i++){
        //         this.handCards.children[i].y = 0;
        //         this.handCards.children[i].touchTag = true;
        //         this.handCards.children[i].getChildByName('bg_black').active = true;
        //         this.handCards.children[i].addComponent(cc.Button);
        //     }
        // }
    },

    ClearForbiddenTouch: function ClearForbiddenTouch() {
        this.LogicPDKGame.ChangeSelectCard([]);
        var downList = this.LogicPDKGame.GetHandCard();
        for (var i = 0; i < downList.length; i++) {
            this.handCards.children[i].y = 0;
            this.handCards.children[i].touchTag = false;
            this.handCards.children[i].getChildByName('bg_black').active = false;
            //           this.handCards.children[i].removeComponent(cc.Button);
        }
    },

    DeleteOpenCardList: function DeleteOpenCardList(dataPos, cardList) {
        if (!this.Room.GetRoomWanfa(this.Define.SEVER_MINGCARD)) return;
        if (dataPos == this.RoomPosMgr.GetClientPos()) return;

        if (this.openCardInfo[dataPos]) {
            var openCardList = this.openCardInfo[dataPos];
            for (var i = 0; i < cardList.length; i++) {
                var value = cardList[i];
                var pos = openCardList.indexOf(value);
                if (pos != -1) {
                    openCardList.splice(pos, 1);
                }
            }

            this.ShowOpenCard(dataPos, openCardList);
        }
    },

    Event_ChangeStatus: function Event_ChangeStatus(event) {
        var opPos = this.RoomSet.GetRoomSetProperty("opPos");
        this.robSuccess = false; //event.isRobCloseSuccess;s
        if (this.Room.GetRoomWanfa(this.Define.SEVER_ROBDOOR)) {
            // if(event.isRobCloseSuccess){
            //     let player = this.RoomPosMgr.GetPlayerInfoByPos(opPos);
            //     app[app.subGameName+"_SysNotifyManager"]().ShowSysMsg(app.subGameName.toUpperCase()+'_SEVER_ROBDOOR',[player.name]);
            // }
            this.btn_robDoor.active = false;
            this.btn_notRobDoor.active = false;
            this.HideClockByPos(this.RoomPosMgr.GetClientPos());
        }
        if (this.Room.GetRoomWanfa( /*this.Define.DOUBLE*/-1)) {
            this.gameMultiple.active = false;
        }
        this.StartGame(opPos);
    },

    Event_AddDouble: function Event_AddDouble(event) {
        var data = event;
        if (data.addDouble != 0) {
            this.ShowAddDouble(data.pos, data.addDouble);
        }

        if (data.pos == this.RoomPosMgr.GetClientPos()) {
            this.gameMultiple.active = false;
            this.btn_robDoor.x = 0;
            if (data.addDouble == 0) {
                this.ShowSysMsg(app.subGameName.toUpperCase() + "_NOTDOUBLE");
            } else {
                this.ShowSysMsg(app.subGameName.toUpperCase() + "_ADDDOUBLE");
            }
        }
    },

    Event_OpenCard: function Event_OpenCard(event) {
        var data = event;
        var sex = this.GetPlayerSex(data.pos);
        // this.SoundManager.PlaySound(sex + "ShowCard");//去除明牌音效
        if (data.OpenCard == 0) return;
        this.openCardInfo[data.pos] = data.cardList;
        this.ShowOpenCard(data.pos, data.cardList);
        if (data.pos == this.RoomPosMgr.GetClientPos()) {
            this.btn_openCard.active = false;
            var state = this.RoomSet.GetRoomSetProperty("state");
            if (state != this.ShareDefine.SetState_End) {
                this.ShowSysMsg(app.subGameName.toUpperCase() + "_OPENCARD");
            }
        }
    },

    Event_RobClose: function Event_RobClose(event) {
        var data = event;
        if (data.pos == this.RoomPosMgr.GetClientPos()) {
            this.ShowSysMsg(app.subGameName.toUpperCase() + "_ROOBCLOSE");
            this.btn_robDoor.active = false;
            this.btn_notRobDoor.active = false;
            this.gameMultiple.x = 0;
        }
    },

    ShowOpenCard: function ShowOpenCard(dataPos, cardList) {
        var uiPos = this.RoomPosMgr.GetUIPosByDataPos(dataPos);
        if (uiPos == 0) return;
        this.LogicPDKGame.SortCardByMax(cardList);
        var openCardList = this.node.getChildByName("openCardList" + uiPos);
        openCardList.active = true;
        for (var i = 0; i < openCardList.children.length; i++) {
            var cardNode = openCardList.children[i];
            var value = cardList[i];
            var isLastCard = false;
            if (i == cardList.length - 1) {
                isLastCard = true;
            }
            if (value) {
                this.ShowCard(value, cardNode, isLastCard);
            } else {
                cardNode.active = false;
            }
        }
    },

    HideAllOpenCard: function HideAllOpenCard() {
        for (var i = 1; i < this.Define.MaxPlayer; i++) {
            var openCardList = this.node.getChildByName("openCardList" + i);
            openCardList.active = false;
        }
    },

    ShowAddDouble: function ShowAddDouble(dataPos, addDouble) {
        // let uiPos = this.RoomPosMgr.GetUIPosByDataPos(dataPos);
        // let path = "sp_seat0" + uiPos + "/head" + "/XiuXUIPublicHead" + uiPos + "/otherNode";
        // let node = this.GetWndNode(path);
        // node.active = true;
        // node.getChildByName("bsPrefab").active = true;
        // node.getChildByName("bsPrefab").getComponent(cc.Label).string = "x"+addDouble;
    },

    ShowOutCard: function ShowOutCard(dataPos, cardList, opCardType) {
        var uiPos = this.RoomPosMgr.GetUIPosByDataPos(dataPos);
        if (!cardList.length) {
            var pass = this.GetWndNode("sp_seat0" + uiPos + "/pass");
            pass.active = true;
            return;
        }
        if ([4, 6, 7, 8, 9, 10, 12, 14].includes(opCardType)) {
            var typeNode = cc.find("outCardList" + uiPos + "_cardType", this.node);
            typeNode.getComponent(cc.Animation).play("card_type" + opCardType);
        }
        var outCardNodeList = this.node.getChildByName("outCardList" + uiPos);
        outCardNodeList.active = true;
        for (var i = 0; i < outCardNodeList.children.length; i++) {
            var cardNode = outCardNodeList.children[i];
            var value = cardList[i];
            var isLastCard = false;
            if (i == cardList.length - 1) {
                isLastCard = true;
            }
            if (value) {
                this.ShowCard(value, cardNode, isLastCard);
            } else {
                cardNode.active = false;
            }
        }
    },

    HideAllOutCard: function HideAllOutCard() {
        for (var i = 0; i < this.Define.MaxPlayer; i++) {
            var outCard = this.node.getChildByName("outCardList" + i);
            outCard.active = false;
        }
    },

    HideAllPass: function HideAllPass() {
        for (var i = 0; i < this.Define.MaxPlayer; i++) {
            var pass = this.GetWndNode("sp_seat0" + i + "/pass");
            pass.active = false;
        }
    },

    HideAllClock: function HideAllClock() {
        for (var i = 0; i < this.Define.MaxPlayer; i++) {
            var clock = this.GetWndNode("sp_seat0" + i + "/clock");
            clock.active = false;
        }
    },

    HideAllWarning: function HideAllWarning() {
        for (var i = 1; i < this.Define.MaxPlayer; i++) {
            var warning = this.GetWndNode("sp_seat0" + i + "/warning");
            warning.getComponent(cc.Animation).stop("warning");
            warning.active = false;
        }
    },
    HideChild: function HideChild(node) {
        for (var i = 0; i < node.children.length; i++) {
            var child = node.children[i];
            child.active = false;
        }
    },
    HideAllHandCard: function HideAllHandCard() {
        //获取是16张玩法还是15张玩法
        var shoupai = this.Room.GetRoomShouPai();
        for (var i = 0; i < this.handCards.children.length; i++) {
            var child = this.handCards.children[i];
            if (i + 1 > shoupai) {
                child.active = false;
            } else {
                this.HideChild(child);
                child.active = true;
            }
        }
        this.handCards.active = false;
    },

    /*HideAllHandCard:function(){
        this.handCards.active = false;
        for(let i = 0; i < this.handCards.children.length; i++){
            let child = this.handCards.children[i];
            child.active = false;
        }
    },*/

    HideAllCardNum: function HideAllCardNum() {
        for (var i = 1; i < this.Define.MaxPlayer; i++) {
            var card = this.GetWndNode("sp_seat0" + i + "/card");
            card.active = false;
            var cardNum = this.GetWndNode("sp_seat0" + i + "/cardNum");
            cardNum.active = false;
            var poker_back = this.GetWndNode("sp_seat0" + i + "/card/poker_back");
            poker_back.active = true;
        }
    },

    HideClockByPos: function HideClockByPos(dataPos) {
        var uiPos = this.RoomPosMgr.GetUIPosByDataPos(dataPos);
        var clock = this.GetWndNode("sp_seat0" + uiPos + "/clock");
        clock.active = false;
    },

    ClearPlayerTable: function ClearPlayerTable(dataPos) {
        var uiPos = this.RoomPosMgr.GetUIPosByDataPos(dataPos);
        var outCardList = this.GetWndNode("outCardList" + uiPos);
        for (var i = 0; i < outCardList.children.length; i++) {
            var child = outCardList.children[i];
            if (child.active) {
                child.active = false;
            }
        }

        // let pass = this.GetWndNode("sp_seat0"+uiPos+"/pass");
        // pass.active = false;
    },
    ClearPlayerState: function ClearPlayerState(dataPos) {
        var uiPos = this.RoomPosMgr.GetUIPosByDataPos(dataPos);
        var pass = this.GetWndNode("sp_seat0" + uiPos + "/pass");
        pass.active = false;
    },

    //开始倒计时
    StartTickTime: function StartTickTime(dataPos) {
        var runWaitSec = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var second = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.Define.MaxTickTime;


        //先清理之前打出去的牌或者玩家的状态 -- 重写一个不出状态
        this.ClearPlayerState(dataPos);
        //是不是自己要不起
        if (second == this.Define.MinTickTime && dataPos == this.RoomPosMgr.GetClientPos()) {
            this.notUp = true;
            //淮滨跑得快，要不起速度加快，秒过 ----张泽新，2019.12.04修改
            this.Click_btn_pass();
            return;
        }
        //当客户端玩家只剩一张牌的时候，自动进入托管（能大直接出牌）
        if (!this.notUp && dataPos == this.RoomPosMgr.GetClientPos()) {
            var clientCards = this.LogicPDKGame.GetHandCard();
            var opCardType = this.LogicPDKGame.GetLastCardType();
            if (opCardType > 0 && clientCards.length == 1) {
                var array = this.LogicPDKGame.GetTipCard();
                if (array.length) {
                    this.LogicPDKGame.ChangeSelectCard(clientCards);
                    this.Event_ShowHandCard();
                    this.Click_btn_outCard();
                }
                return;
            } else if (opCardType == 0 && clientCards.length == 1) {
                //剩下最后一根牌，并且轮到自己出牌
                this.LogicPDKGame.ChangeSelectCard(clientCards);
                this.Event_ShowHandCard();
                this.scheduleOnce(function () {
                    this.Click_btn_outCard();
                }, 1);
            }
        }
        this.tick = second - runWaitSec;
        if (this.tick <= 0) {
            return;
        }
        var uiPos = this.RoomPosMgr.GetUIPosByDataPos(dataPos);
        this.clock = this.GetWndNode("sp_seat0" + uiPos + "/clock");
        if (dataPos == this.RoomPosMgr.GetClientPos() && second == 0) {
            this.clock.active = false;
        } else {
            this.clock.active = true;
        }
        this.clock.getChildByName("num").getComponent(cc.Label).string = this.tick;
        this.unschedule(this.CallEverySecond);
        this.schedule(this.CallEverySecond, 1);
    },

    //每一秒进入
    CallEverySecond: function CallEverySecond() {
        //this.SoundManager.PlaySound("timeUp");
        this.tick--;
        this.clock.getChildByName("num").getComponent(cc.Label).string = this.tick;
        if (this.tick <= 0) {
            this.unschedule(this.CallEverySecond);
            this.clock.active = false;
            if (this.notUp) {
                this.Click_btn_pass();
            }
        }
    },

    //显示提示和出牌按钮
    ShowBtnTipAndOutCard: function ShowBtnTipAndOutCard() {
        this.gameBtn.active = true;
        this.btn_tip.x = -120;
        this.btn_tip.active = true;
        // this.btn_pass.getChildByName("icon").getComponent(cc.Label).string = '不要';
        this.btn_outCard.x = 120;
        this.btn_outCard.active = true;
        this.btn_pass.active = false;
        this.node.getChildByName("img_pass").active = false;
        // this.btn_tip.getComponent(cc.Button).interactable = true;
        this.btn_outCard.getComponent(cc.Button).interactable = false;
        // this.btn_pass.getComponent(cc.Button).interactable = false;
        this.canOutCard();
    },
    //显示所有按钮
    ShowAllGameBtn: function ShowAllGameBtn() {
        this.gameBtn.active = true;
        this.btn_pass.x = -230;
        this.btn_pass.active = true;
        this.btn_tip.x = 0;
        this.btn_tip.active = true;
        // this.btn_pass.getChildByName("icon").getComponent(cc.Label).string = '不要';
        this.btn_outCard.x = 230;
        this.btn_outCard.active = true;
        this.node.getChildByName("img_pass").active = false;
        //new
        // this.btn_tip.getComponent(cc.Button).interactable = true;
        this.btn_outCard.getComponent(cc.Button).interactable = false;
        // this.btn_pass.getComponent(cc.Button).interactable = true;
    },

    HideAllGameBtn: function HideAllGameBtn() {
        this.gameBtn.active = false;
        this.btn_pass.active = false;
        this.btn_tip.active = false;
        this.btn_outCard.active = false;
        this.node.getChildByName("img_pass").active = false;
    },

    HideAllBsNode: function HideAllBsNode() {
        // let room = this.RoomMgr.GetEnterRoom();
        // let posList = room.GetRoomProperty("posList");
        // for(let idx = 0; idx < posList.length; idx++){
        //     let uiPos = this.RoomPosMgr.GetUIPosByDataPos(posList[idx].pos);
        //     let path = "sp_seat0" + uiPos + "/head" + "/XiuXUIPublicHead" + uiPos;
        //     let headNode = this.GetWndNode(path);
        //     headNode.getChildByName("otherNode").active = false;
        // }
    },

    //只显示出牌按钮
    ShowBtnOutCard: function ShowBtnOutCard() {
        this.gameBtn.active = true;
        this.btn_pass.active = false;
        this.btn_tip.active = false;
        this.btn_outCard.x = 0;
        this.btn_outCard.active = true;
        this.node.getChildByName("img_pass").active = false;
        // this.btn_tip.getComponent(cc.Button).interactable = true;
        this.btn_outCard.getComponent(cc.Button).interactable = false;
        // this.btn_pass.getComponent(cc.Button).interactable = false;
        this.canOutCard();
    },
    //只显示不要按钮
    ShowBtnPass: function ShowBtnPass() {
        this.gameBtn.active = true;
        this.btn_pass.x = 0;
        this.btn_pass.active = true;
        // this.btn_pass.getChildByName("icon").getComponent(cc.Label).string = '要不起';
        this.btn_tip.active = false;
        this.btn_outCard.active = false;
        this.node.getChildByName("img_pass").active = true;
    },

    StartGame: function StartGame(opPos) {
        //检查玩家手牌
        this.CheckShouPai();
        var firstOpCard = this.RoomSet.GetRoomSetProperty("firstOpCard");
        this.lastCircleEnd = this.RoomSet.GetRoomSetProperty("isFirstOp");

        //是否显示黑桃3
        var uiPos = this.RoomPosMgr.GetUIPosByDataPos(opPos);
        if (uiPos != 0 && !this.robSuccess) {
            var poker_back = this.GetWndNode("sp_seat0" + uiPos + "/card/poker_back");
            poker_back.active = false;
            this.ShowCard(firstOpCard, poker_back.parent, true);
        }

        var secTotal = this.RoomSet.GetSecTotal();
        if (opPos == this.RoomPosMgr.GetClientPos()) {
            if (this.Room.GetRoomWanfa(this.Define.SEVER_FIRST3) && !this.robSuccess) {
                this.ShowBtnTipAndOutCard();
            } else {
                this.ShowBtnOutCard();
            }
            //是否执行房间限时时间
            this.GetUICardComponentByPos(this.RoomPosMgr.GetClientPos()).ShowUseTime(secTotal);
            this.GetUICardComponentByPos(this.RoomPosMgr.GetClientPos()).SetTimeOpen(true);
        } else {
            this.GetUICardComponentByPos(this.RoomPosMgr.GetClientPos()).ShowUseTime(secTotal);
        }
        var time = this.GetClockTime();
        var runWaitSec = this.RoomSet.GetRoomSetProperty("runWaitSec");
        this.StartTickTime(opPos, runWaitSec, time);
    },

    ChooseDouble: function ChooseDouble() {
        var runWaitSec = this.RoomSet.GetRoomSetProperty("runWaitSec");
        //this.allCards.active = false;
        if (this.Room.GetRoomWanfa(this.Define.SEVER_MINGCARD)) {
            this.btn_openCard.active = false;
        }

        //是否有加倍玩法
        if (this.Room.GetRoomWanfa( /*this.Define.DOUBLE*/-1)) {
            this.gameMultiple.active = true;
            this.gameMultiple.x = 0;
        }
        //是否有抢关门玩法
        if (this.Room.GetRoomWanfa(this.Define.SEVER_ROBDOOR)) {
            this.btn_robDoor.active = true;
            this.btn_robDoor.x = 90;
            this.btn_notRobDoor.active = true;
            this.btn_notRobDoor.x = -90;
        }

        if (this.Room.GetRoomWanfa( /*this.Define.DOUBLE*/-1) && this.Room.GetRoomWanfa(this.Define.SEVER_ROBDOOR)) {
            this.gameMultiple.x = -75;
            this.btn_robDoor.x = 385;
        }

        if (this.Room.GetRoomWanfa( /*this.Define.DOUBLE*/-1) || this.Room.GetRoomWanfa(this.Define.SEVER_ROBDOOR)) {
            this.StartTickTime(this.RoomPosMgr.GetClientPos(), runWaitSec, 15);
        }
    },
    CheckShouPai: function CheckShouPai() {
        var clientCards = this.LogicPDKGame.GetHandCard();
        var count = 0;
        for (var i = 0; i < clientCards.length; i++) {
            if (clientCards[i] > 0) {
                count++;
            }
        }
        if (count < 15) {
            //手牌不可能小于15张
            this.ReInRoom();
            return;
        }
    },
    FaPaiFinish: function FaPaiFinish() {
        this.RoomMgr.SendFaPaiFinish(this.RoomPosMgr.GetClientPos());
        //检查手牌长度
        this.CheckShouPai();
    },
    SortCardByMax: function SortCardByMax(pokers) {
        var self = this;
        pokers.sort(function (a, b) {
            //return (b&0x0F) - (a&0x0F);
            return self.GetCardValue(b) - self.GetCardValue(a);
        });
    },
    //获取牌值
    GetCardValue: function GetCardValue(poker) {
        var realPoker = 0;
        if (poker > 500) {
            realPoker = poker - 500;
        } else {
            realPoker = poker;
        }
        return realPoker & 0x0F;
    },
    //发牌动作
    FaPaiAction: function FaPaiAction(dataPos) {
        var _this = this;

        var handCards = this.RoomSet.GetHandCard();
        this.SortCardByMax(handCards);
        var uiPos = this.RoomPosMgr.GetUIPosByDataPos(dataPos);
        this.handCards.active = true;
        var baseTime = 0;

        var _loop = function _loop(i) {
            var cardValue = handCards[i];
            var cardNode = _this.handCards.getChildByName("card_" + (i + 1).toString());
            baseTime = baseTime + 0.03;
            _this.scheduleOnce(function () {
                cardNode.active = true;
                if (i == handCards.length - 1) {
                    this.ShowCard(cardValue, cardNode, true);
                } else {
                    this.ShowCard(cardValue, cardNode, false);
                }
            }, baseTime);
            if (i == handCards.length - 1) {
                baseTime = baseTime + 0.3; //发牌结束事件
                _this.scheduleOnce(function () {
                    this.FaPaiFinish();
                }, baseTime);
            }
        };

        for (var i = 0; i < handCards.length; i++) {
            _loop(i);
        }
    },
    //显示poker牌
    ShowCard: function ShowCard(cardType, cardNode, isLastCard) {
        var realValue = 0;
        if (cardType > 500) {
            realValue = cardType - 500;
        } else {
            realValue = cardType;
        }
        // if (!isLastCard) {
        //     cardNode.getChildByName('icon_1').active = false;
        // }else{
        //     cardNode.getChildByName('icon_1').active = true;
        // }
        this.PokerCard.GetPokeCard(realValue, cardNode, isLastCard);
        cardNode.active = true;
        cardNode.getChildByName("poker_back").active = false;
        var clientPos = this.RoomPosMgr.GetClientPos();
        var setInfo = this.RoomSet.GetRoomSetInfo();
        if (this.Room.GetRoomWanfa(this.Define.SEVER_FANGZUOBI)) {
            if (setInfo.isFirstOp) {
                if (setInfo.opPos != clientPos) {
                    cardNode.getChildByName("poker_back").active = true;
                }
            }
        }
        cardNode.getChildByName("bg_poker").active = true;
        cardNode.getChildByName("num").active = true;
        cardNode.getChildByName("icon").active = true;
        var room = this.RoomMgr.GetEnterRoom();
        if (!room || !cardNode.getChildByName("tag")) return;
        var kexuanwanfa = room.GetRoomConfigByProperty('kexuanwanfa');
        if (!kexuanwanfa || !kexuanwanfa.length) return;
        cardNode.getChildByName("tag").active = realValue == 0x2A && kexuanwanfa.indexOf(24) > -1;
    },

    AddCardAction: function AddCardAction(dataPos) {
        var uiPos = this.RoomPosMgr.GetUIPosByDataPos(dataPos);
        var wndNode = this.GetWndNode("sp_seat0" + uiPos + "/cardNum");
        if (uiPos == 1) {
            this.player1Idx++;
            wndNode.getComponent(cc.Label).string = this.player1Idx + '';
        } else if (uiPos == 2) {
            this.player2Idx++;
            wndNode.getComponent(cc.Label).string = this.player2Idx + '';
        } else if (uiPos == 3) {
            this.player3Idx++;
            wndNode.getComponent(cc.Label).string = this.player3Idx + '';
        }
    },

    ///////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////牌触摸
    OnTouchStart: function OnTouchStart(event) {
        this.isChoose = this.isCanChoose();
        this.moveIndex = -1;
        this.lastMoveIndex = -1;
        var moveX = event.target.convertToNodeSpaceAR(event.touch.getLocation()).x;
        var downList = this.LogicPDKGame.GetHandCard();
        for (var i = 0; i < this.handCards.children.length; i++) {
            if (this.handCards.children[i].name.startsWith("card")) {
                var minX = this.handCards.children[i].x - this.handCards.children[i].width / 2;
                var maxX = minX + this.cardSpcedX;
                if (i == downList.length - 1) maxX = minX + this.handCards.children[i].width;
                if (moveX >= minX && moveX < maxX) {
                    this.startIndex = i;
                    this.handCards.children[i].getChildByName("bg_black").active = true;
                    break;
                }
            }
        }
    },

    OnTouchMove: function OnTouchMove(event) {
        var moveX = event.target.convertToNodeSpaceAR(event.touch.getLocation()).x;
        for (var i = 0; i < this.handCards.children.length; i++) {
            if (this.handCards.children[i].name.startsWith("card")) {
                if (this.handCards.children[i].touchTag == false || typeof this.handCards.children[i].touchTag == "undefined") {
                    this.handCards.children[i].getChildByName("bg_black").active = false;
                }
                var minX = this.handCards.children[i].x - this.handCards.children[i].width / 2;
                var maxX = minX + this.cardSpcedX;
                if (moveX >= minX && moveX < maxX) {
                    if (this.moveIndex >= 0 && this.moveIndex != i) {
                        this.lastMoveIndex = this.moveIndex;
                    }
                    this.moveIndex = i;
                    break;
                }
            }
        }
        if (this.lastMoveIndex == -1 || this.moveIndex == -1) {
            return;
        }
        if (this.startIndex > this.moveIndex) {
            //从右往左
            console.log("从右往左");
            for (var _i3 = this.startIndex; _i3 >= this.moveIndex; _i3--) {
                if (this.handCards.children[_i3].name.startsWith("card")) {
                    if (this.handCards.children[_i3].touchTag) {
                        continue;
                    }
                    this.handCards.children[_i3].getChildByName("bg_black").active = true;
                }
            }
        } else {
            //从左往右
            if (this.lastMoveIndex > this.moveIndex) {
                if (this.handCards.children[this.lastMoveIndex].name.startsWith("card")) {
                    if (!this.handCards.children[this.lastMoveIndex].touchTag) {
                        this.handCards.children[this.lastMoveIndex].getChildByName("bg_black").active = false;
                    }
                }
            }
            for (var _i4 = this.startIndex; _i4 <= this.moveIndex; _i4++) {
                if (this.handCards.children[_i4].name.startsWith("card")) {
                    if (this.handCards.children[_i4].touchTag) {
                        continue;
                    }
                    this.handCards.children[_i4].getChildByName("bg_black").active = true;
                }
            }
        }
    },

    OnTouchEnd: function OnTouchEnd(event) {
        var moveX = event.target.convertToNodeSpaceAR(event.touch.getLocation()).x;
        var downList = this.LogicPDKGame.GetHandCard();
        for (var i = 0; i < this.handCards.children.length; i++) {
            if (this.handCards.children[i].name.startsWith("card")) {
                if (this.handCards.children[i].touchTag) {
                    this.handCards.children[i].getChildByName("bg_black").active = true;
                } else {
                    this.handCards.children[i].getChildByName("bg_black").active = false;
                }
                if (isEnd) continue;
                var isEnd = false;
                var minX = this.handCards.children[i].x - this.handCards.children[i].width / 2;
                var maxX = minX + this.cardSpcedX;
                if (i == downList.length - 1) maxX = minX + this.handCards.children[i].width;
                if (moveX >= minX && moveX < maxX) {
                    this.endIndex = i;
                    isEnd = true;
                }
            }
        }

        if (this.startIndex == this.endIndex) {
            if (this.handCards.children[this.endIndex].active && !this.handCards.children[this.endIndex].touchTag) {
                this.Click_card(this.handCards.children[this.endIndex]);
            }
        } else {
            if (this.startIndex > this.endIndex) {
                //从右往左
                for (var _i5 = this.startIndex; _i5 >= this.endIndex; _i5--) {
                    if (this.handCards.children[_i5].touchTag) continue;
                    if (this.handCards.children[_i5].active) this.Click_card(this.handCards.children[_i5]);
                }
            } else {
                //从左往右
                for (var _i6 = this.startIndex; _i6 <= this.endIndex; _i6++) {
                    if (this.handCards.children[_i6].touchTag) continue;
                    if (this.handCards.children[_i6].active) this.Click_card(this.handCards.children[_i6]);
                }
            }
        }
        if (this.isChoose == true) {
            var cardArray = this.LogicPDKGame.GetTipCardSlCard();
            if (cardArray.length > 0) {
                this.LogicPDKGame.ChangeSelectCard(cardArray[0]);
                this.Event_ShowHandCard();
            }
        }
        this.canOutCard();
    },

    OnTouchCancel: function OnTouchCancel(event) {
        // for (let i = 0; i < this.handCards.children.length; i++) {
        //     if (this.handCards.children[i].name.startsWith("card")) {
        //         if (this.handCards.children[i].touchTag)
        //             continue
        //         this.handCards.children[i].getChildByName("bg_black").active = false;
        //     }
        // }
        this.endIndex = -1;
        var moveX = event.target.convertToNodeSpaceAR(event.touch.getLocation()).x;
        var downList = this.LogicPDKGame.GetHandCard();
        for (var i = 0; i < this.handCards.children.length; i++) {
            if (this.handCards.children[i].name.startsWith("card")) {
                if (this.handCards.children[i].touchTag) {
                    this.handCards.children[i].getChildByName("bg_black").active = true;
                } else {
                    this.handCards.children[i].getChildByName("bg_black").active = false;
                }
                if (isEnd) continue;
                var isEnd = false;
                var minX = this.handCards.children[i].x - this.handCards.children[i].width / 2;
                var maxX = minX + this.cardSpcedX;
                if (i == downList.length - 1) maxX = minX + this.handCards.children[i].width;
                if (moveX >= minX && moveX < maxX) {
                    this.endIndex = i;
                    isEnd = true;
                }
            }
        }
        if (this.endIndex == -1) {
            if (moveX < 0) {
                this.endIndex = 0;
            } else {
                this.endIndex = this.handCards.children.length - 1;
            }
        }
        if (this.startIndex == this.endIndex) {
            if (this.handCards.children[this.endIndex].active && !this.handCards.children[this.endIndex].touchTag) {
                this.Click_card(this.handCards.children[this.endIndex]);
            }
        } else {
            if (this.startIndex > this.endIndex) {
                //从右往左
                for (var _i7 = this.startIndex; _i7 >= this.endIndex; _i7--) {
                    if (this.handCards.children[_i7].touchTag) continue;
                    if (this.handCards.children[_i7].active) this.Click_card(this.handCards.children[_i7]);
                }
            } else {
                //从左往右
                for (var _i8 = this.startIndex; _i8 <= this.endIndex; _i8++) {
                    if (this.handCards.children[_i8].touchTag) continue;
                    if (this.handCards.children[_i8].active) this.Click_card(this.handCards.children[_i8]);
                }
            }
        }
        if (this.isChoose == true) {
            var cardArray = this.LogicPDKGame.GetTipCardSlCard();
            if (cardArray.length > 0) {
                this.LogicPDKGame.ChangeSelectCard(cardArray[0]);
                this.Event_ShowHandCard();
            }
        }
        this.canOutCard();
    },
    canOutCard: function canOutCard() {
        var cardList = this.LogicPDKGame.GetSelectCard();
        var checkCount = 0;
        for (var i = 0; i < this.handCards.children.length; i++) {
            var _cardNode = this.handCards.children[i];
            if (_cardNode.active == true && _cardNode.y == this.Define.MaxRisePosY) {
                checkCount++;
            }
        }

        if (cardList.length != checkCount) {
            //选中的牌跟存储的牌不一样，
            this.ReInRoom();
            return;
        }

        var opCardType = this.LogicPDKGame.GetCardType();
        console.log('选择的牌型为', opCardType);
        if (opCardType > 0) {
            //TODO:此处判断待优化
            // if (!cc.find('img_mask_pk', this.node).active) {
            this.btn_outCard.getComponent(cc.Button).interactable = true;
            return;
            // } else {
            //     console.log('没有大过上家的牌标志');
            // }
        }
        this.btn_outCard.getComponent(cc.Button).interactable = false;
    },
    Click_card: function Click_card(clickNode) {
        var name = "";
        name = clickNode.name;
        var cardIdx = name.substring(5, name.length);
        if (clickNode.y == 0) {
            clickNode.y = this.Define.MaxRisePosY;
            this.LogicPDKGame.SetCardSelected(parseInt(cardIdx));
        } else {
            clickNode.y = 0;
            this.LogicPDKGame.DeleteCardSelected(parseInt(cardIdx));
        }
    },

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////

    //添加头像
    AddHead: function AddHead() {
        this.ClearHead();
        //初始化加入头像 如果已经有加入了头像 显示出来
        var posList = this.RoomMgr.GetEnterRoom().GetRoomProperty("posList");
        var playerCount = posList.length;
        for (var idx = 0; idx < posList.length; idx++) {
            var uiPos = this.RoomPosMgr.GetUIPosByDataPos(posList[idx].pos);
            var path = "sp_seat0" + uiPos.toString() + "/head";
            var node = this.GetWndNode(path);
            if (!node.getChildByName("XiuXUIPublicHead" + uiPos)) {
                var head = cc.instantiate(this.headPrefab);
                node.addChild(head);

                //加入倍数
                // let bsNode = cc.instantiate(this.bsPrefab);
                // bsNode.active = false;
                // let other = head.getChildByName("otherNode");
                // other.active = false;
                // other.y = 70;
                // other.addChild(bsNode);

                var headScript = head.getComponent(app.subGameName + "_XiuXUIPublicHead");
                headScript.Init(uiPos, posList[idx].pos, cc.v2(0, 0), this.Left[uiPos]);
            } else {
                var headNode = node.getChildByName("XiuXUIPublicHead" + uiPos);
                // headNode.getChildByName("otherNode").active = false;
                // headNode.getChildByName("otherNode").getChildByName("bsPrefab").active = false;
                var _headScript = headNode.getComponent(app.subGameName + "_XiuXUIPublicHead");
                _headScript.Init(uiPos, posList[idx].pos, cc.v2(0, 0), this.Left[uiPos]);
            }
        }
    },

    ClearHead: function ClearHead() {
        for (var idx = 0; idx < this.Define.MaxPlayer; idx++) {
            var path = "sp_seat0" + idx + "/head" + "/XiuXUIPublicHead" + idx;
            var node = this.GetWndNode(path);
            if (node) {
                var headScript = node.getComponent(app.subGameName + "_XiuXUIPublicHead");
                headScript.OnClose();
            }
        }
    },

    OnClose: function OnClose() {
        this.HideAll();
        this.ClearHead();
        this.unscheduleAllCallbacks();
    },

    InitGameStateCommon: function InitGameStateCommon() {
        var setInfo = this.RoomSet.GetRoomSetInfo();
        //得到玩家自己的手牌
        this.handCards.active = true;
        this.LogicPDKGame.InitHandCard();
        this.Event_ShowHandCard();
        var playerAll = this.RoomPosMgr.GetRoomAllPlayerInfo();
        var playerAllList = Object.keys(playerAll);
        for (var i = 0; i < playerAllList.length; i++) {
            var player = playerAll[playerAllList[i]];
            for (var j = 0; j < setInfo.posInfo.length; j++) {
                var info = setInfo.posInfo[j];
                if (player.pid == info.pid) {
                    this.InitCardNum(player.pos, info.cards.length);
                    this.ShowWarningByPos(player.pos, info.cards.length);
                    if (info.addDouble > 0) {
                        this.ShowAddDouble(player.pos, info.addDouble - 1);
                    }
                    if (info.openCard == 1) {
                        this.openCardInfo[player.pos] = info.cards;
                        this.ShowOpenCard(player.pos, info.cards);
                    }
                }
            }
        }
    },

    OnShow: function OnShow() {
        this.node.getChildByName("tip_exit_node").active = false;
        if (cc.sys.isNative) {
            this.resVersion.string = "resV" + app[app.subGameName + "_HotUpdateMgr"]().getLocalVersion();
        } else {
            this.resVersion.string = '';
        }
        if (app[app.subGameName + "_ShareDefine"]().isCoinRoom || !cc.sys.isNative) {
            this.btn_voice.active = false;
        } else {
            if (this.IsShowVoice()) {
                this.btn_voice.active = true;
            } else {
                this.btn_voice.active = false;
            }
        }
        this.CheckUpdateNotice();
        this.btn_chat.active = this.IsShowChat();
        var roomID = this.RoomMgr.GetEnterRoomID();
        //初始化邀请在线好友的数据
        this.roomCfg = this.Room.GetRoomConfig();
        if (this.roomCfg.clubId > 0 || this.roomCfg.unionId > 0) {
            this.invitationNode.active = false;
            this.invitationNode.getComponent(this.invitationNode.name).InitData(this.roomCfg.clubId, this.roomCfg.unionId, roomID);
        } else {
            this.invitationNode.active = false;
        }
        app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "GetRoomID", {}, function (event) {
            if (event.roomID <= 0 || event.roomID != roomID) {
                app[app.subGameName + "Client"].ExitGame();
            }
        }, function (error) {
            app[app.subGameName + "Client"].ExitGame();
        });
        this.isChoose = false;
        this.AddHead();
        this.HideAll();
        this.unscheduleAllCallbacks();
        this.LocalDataManager.SetConfigProperty("SysSetting", "GameBackMusic", "gameBackGround");
        var GameBackMusic = this.LocalDataManager.GetConfigProperty("SysSetting", "GameBackMusic");
        this.SceneManager.PlayMusic(GameBackMusic);
        this.SceneManager.StopSceneMusic();
        this.InitData();
        this.ClearForbiddenTouch();
        //设置牌间距
        var aw = cc.find('Canvas').width;
        var ah = cc.find('Canvas').height;
        var srcWH = 1360 / 760;
        var curWH = aw / ah;
        var destScale = curWH / srcWH;
        var unDestScale = srcWH / curWH;
        //
        var spaceX = -85 * unDestScale;
        this.handCards.getComponent(cc.Layout).spacingX = spaceX;

        var cardNodeWidth = this.cardPrefab.data.width;
        this.cardSpcedX = cardNodeWidth + spaceX;

        var state = this.RoomSet.GetRoomSetProperty("state");
        var disslove = this.Room.GetRoomProperty("dissolve");
        var roomState = this.Room.GetRoomProperty("state");
        var setID = this.Room.GetRoomProperty("setID");
        var current = this.Room.GetRoomConfigByProperty("setCount");
        var fangjian = this.Room.GetRoomConfigByProperty("fangjian");
        if (setID == 0) {
            this.btn_jifen.active = false;
        } else {
            this.btn_jifen.active = true;
        }

        //显示房间信息
        this.labeiWanfa.string = this.WanFa();
        if (app[app.subGameName + "_ShareDefine"]().isCoinRoom) {
            this.roomInfo.active = false;
        } else {
            this.roomInfo.active = true;
            this.labelRoomId.string = "房号：" + this.Room.GetRoomProperty("key");
            this.lb_jushu.string = "第" + setID + "/" + current + "局";
        }

        var playerAll = this.Room.GetRoomPosMgr().GetRoomAllPlayerInfo();
        var playerAllList = Object.keys(playerAll);
        var joinPlayerCount = playerAllList.length;
        if (fangjian.length == 0) {
            this.btn_change.active = false;
        } else {
            if (setID == 0 && joinPlayerCount == 3) {
                this.btn_change.active = true;
            } else {
                this.btn_change.active = false;
            }
        }
        if (typeof disslove != "undefined") {
            if (disslove) {
                var posAgreeList = disslove.posAgreeList;
                if (0 != posAgreeList.length) {
                    this.FormManager.ShowForm(app.subGameName + "_UIMessage02");
                }
            }
        }

        if (roomState != this.ShareDefine.RoomState_Init) {
            var setInfo = this.RoomSet.GetRoomSetInfo();
            //如果有玩家托管  显示托管图标
            var posList = this.Room.GetRoomProperty("posList");
            for (var i = 0; i < posList.length; i++) {
                var data = posList[i];
                var pos = data['pos'];
                var isAuto = data['trusteeship'];
                if (isAuto) {
                    var headScript = this.GetUICardComponentByPos(pos);
                    headScript.ShowAutoIcon(isAuto);
                }
                if (pos == this.RoomPosMgr.GetClientPos() && isAuto) {
                    var secTotal = this.RoomSet.GetSecTotal();
                    this.FormManager.ShowForm(app.subGameName + "_UIAutoPlay", secTotal);
                }
            }
            //分数
            // this.RoomPosMgr.OnPoint(setInfo.posInfo, true);
            this.UpdatePlayerScore();
            //发牌阶段
            if (state == this.ShareDefine.SetState_Init) {
                this.InitGameStateCommon();
                this.ChooseDouble();
            } else if (state == this.ShareDefine.SetState_Playing) {
                this.InitGameStateCommon();
                this.HideClientUseTime();
                //显示已用房间限时时间
                this.ShowUseTimeByInfo();
                this.LogicPDKGame.SetCardData(setInfo.opType, setInfo.cardList);
                //显示当前操作位和上家出的牌
                var time = this.GetClockTime();
                var runWaitSec = setInfo.runWaitSec;
                this.lastCircleEnd = setInfo.isFirstOp;
                this.firstTurn = setInfo.isFirstOp;
                if (setInfo.opPos == this.RoomPosMgr.GetClientPos()) {
                    //是否执行房间限时时间
                    this.ScheduleTime(setInfo.opPos);
                    if (setInfo.isFirstOp) {
                        if (this.Room.GetRoomWanfa(this.Define.SEVER_FIRST3)) {
                            this.ShowBtnTipAndOutCard();
                        } else {
                            this.ShowBtnOutCard();
                        }
                    } else {
                        if (setInfo.opType == 0) {
                            this.ShowBtnOutCard();
                        } else {
                            var array = this.LogicPDKGame.GetTipCard();
                            this.ForbiddenTouch(array);
                            if (!array.length) {
                                if (this.isAutoPass()) {
                                    // this.ShowSysMsg(app.subGameName.toUpperCase()+"_PASS");
                                    time = this.Define.MinTickTime;
                                } else {
                                    this.ShowBtnPass();
                                }
                            } else {
                                //是否是必出玩法
                                if (this.Room.GetRoomWanfa(this.Define.SEVER_BMUST)) {
                                    this.ShowAllGameBtn();
                                } else {
                                    this.ShowBtnTipAndOutCard();
                                }
                                if (array.length == 1) {
                                    this.Click_btn_tip();
                                }
                            }
                        }
                    }
                } else {
                    var firstOpCard = this.RoomSet.GetRoomSetProperty("firstOpCard");
                    //是否显示黑桃3
                    var uiPos = this.RoomPosMgr.GetUIPosByDataPos(setInfo.opPos);
                    if (setInfo.isFirstOp) {
                        //&& setInfo.robCloseVic.pos == -1
                        var poker_back = this.GetWndNode("sp_seat0" + uiPos + "/card/poker_back");
                        poker_back.active = false;
                        this.ShowCard(firstOpCard, poker_back.parent, true);
                    }
                }
                this.ShowOutCard(setInfo.lastOpPos, setInfo.cardList, setInfo.opType);
                this.SetSeat01OutCardPos(setInfo.lastOpPos, setInfo.cardList.length);
                this.StartTickTime(setInfo.opPos, runWaitSec, time);
            } else if (state == this.ShareDefine.SetState_End) {
                //如果玩家已经准备则不显示结算界面
                var clientPos = this.RoomPosMgr.GetClientPos();
                var clientPlayerInfo = this.RoomPosMgr.GetPlayerInfoByPos(clientPos);
                if (clientPlayerInfo["gameReady"]) {
                    this.RefreshRoomShow();
                    return;
                }
                var setEnd = this.RoomSet.GetRoomSetProperty("setEnd");
                this.FormManager.ShowForm("game/" + app.subGameName.toUpperCase() + "/UI" + app.subGameName.toUpperCase() + "_ResultXY", setEnd);
            }
        } else {
            this.RefreshRoomShow();
        }
        /* //显示房间信息
         if(app[app.subGameName+"_ShareDefine"]().isCoinRoom){
             this.roomInfo.active = false;
         }else{
             this.roomInfo.active = true;
             this.labelRoomId.string = "房间号："+room.GetRoomProperty("key");
             this.labeiWanfa.string = this.WanFa();
         }*/
    },
    isAutoPass: function isAutoPass() {
        var room = this.RoomMgr.GetEnterRoom();
        var kexuanwanfa = room.GetRoomConfigByProperty('kexuanwanfa');
        if (kexuanwanfa.length > 0) {
            if (kexuanwanfa.indexOf(26) > -1) {
                return false;
            }
        }
        return true;
    },
    isAutoReady: function isAutoReady() {
        var room = this.RoomMgr.GetEnterRoom();
        var kexuanwanfa = room.GetRoomConfigByProperty('kexuanwanfa');
        if (kexuanwanfa.length > 0) {
            if (kexuanwanfa.indexOf(27) > -1) {
                return false;
            }
        }
        return true;
    },
    IsShowVoice: function IsShowVoice() {
        var room = this.RoomMgr.GetEnterRoom();
        var gaoji = room.GetRoomConfigByProperty('gaoji');
        if (gaoji.length > 0) {
            if (gaoji.indexOf(5) > -1) {
                return false;
            }
        }
        return true;
    },
    IsShowChat: function IsShowChat() {
        var room = this.RoomMgr.GetEnterRoom();
        var gaoji = room.GetRoomConfigByProperty('gaoji');
        if (gaoji.length > 0) {
            if (gaoji.indexOf(6) > -1) {
                return false;
            }
        }
        return true;
    },
    InitCardNum: function InitCardNum(pos, count) {
        if (this.RoomPosMgr.GetClientPos() == pos) return;
        var uiPos = this.RoomPosMgr.GetUIPosByDataPos(pos);
        var card = this.GetWndNode("sp_seat0" + uiPos + "/card");
        card.active = true;
        var cardNum = this.GetWndNode("sp_seat0" + uiPos + "/cardNum");
        cardNum.active = true;
        cardNum.active = false;
        cardNum.getComponent(cc.Label).string = count.toString() + '';
        if (this.Room.GetRoomWanfa(this.Define.SEVER_SHOWCARDNUM)) {
            // if(true){//默认显示
            cardNum.active = true;
        }
    },
    GetClockTime: function GetClockTime() {
        var second = 0;
        var xianshi = this.Room.GetRoomXianShi();
        if (xianshi == 0) {
            second = 60;
        } else if (xianshi == 1) {
            second = 180;
        } else if (xianshi == 2) {
            second = 300;
        } else if (xianshi == 3) {
            second = 60;
        } else if (xianshi == 4) {
            second = 30;
        } else if (xianshi == 5) {
            second = 15;
        }
        return second;
    },
    ReInRoom: function ReInRoom(room) {
        var roomID = this.RoomMgr.GetEnterRoomID();
        this.RoomMgr.SendGetRoomInfo(roomID);
    },
    ////////////////////////////////show///////////////////////////////////////////
    RefreshRoomShow: function RefreshRoomShow() {
        var room = this.RoomMgr.GetEnterRoom();
        this.ShowPlayerReady(room);
    },

    HideAllZhunBeiLabel: function HideAllZhunBeiLabel() {
        var playerAll = this.RoomPosMgr.GetRoomAllPlayerInfo();
        var playerAllList = Object.keys(playerAll);
        for (var i = 0; i < playerAllList.length; i++) {
            var player = playerAll[playerAllList[i]];
            var uiPos = this.RoomPosMgr.GetUIPosByDataPos(player.pos);
            var path = "sp_seat0" + uiPos + "/head" + "/XiuXUIPublicHead" + uiPos;
            var headNode = this.GetWndNode(path);
            if (!headNode || typeof headNode == "undefined") continue;
            var headScript = headNode.getComponent(app.subGameName + "_XiuXUIPublicHead");
            headScript.setReady(false);
        }
    },

    ShowOrHideZhunbei: function ShowOrHideZhunbei(pos, isShow) {
        var headScript = this.GetUICardComponentByPos(pos);
        headScript.setReady(isShow);
    },

    HidePlayerAllBtn: function HidePlayerAllBtn() {
        this.btn_ready.active = false;
        this.btn_weixin.active = false;
        this.btn_fzfh.active = false;
        this.btn_cancel.active = false;
        this.btn_go.active = false;
        this.btn_quit.active = false;
        this.invitationNode.active = false;
    },

    HideAll: function HideAll() {
        this.HideAllZhunBeiLabel();
        this.HidePlayerAllBtn();
        this.HideAllClock();
        this.HideAllHandCard();
        this.HideAllPass();
        this.HideAllWarning();
        this.HideAllCardNum();
        this.HideAllOutCard();
        this.HideAllGameBtn();
        this.HideAllBsNode();
        this.HideAllOpenCard();
        this.btn_robDoor.active = false;
        this.btn_notRobDoor.active = false;
        this.btn_openCard.active = false;
    },

    HideAllAni: function HideAllAni() {
        this.plane_Ani.active = false;
        this.boom_Ani.active = false;
        this.dragon_Ani.active = false;
    },

    OnClickForm: function OnClickForm() {
        //        this.FormManager.CloseForm(app.subGameName+"_UIChat");
    },

    OnClick: function OnClick(btnName, btnNode) {
        console.log('btnName', btnName, btnNode);
        var roomID = this.Room.GetRoomProperty("roomID");
        var pos = this.RoomPosMgr.GetClientPos();
        var state = this.RoomSet.GetRoomSetProperty("state");
        if (btnName == "btn_go") {
            this.Click_btn_go();
        } else if (btnName == "btn_ready") {
            this.Click_btn_ready();
        } else if (btnName == "btn_cancel") {
            this.Click_btn_cancel();
        } else if (btnName == "btn_weixin") {
            this.Click_btn_weixin();
        } else if (btnName == "bg") {
            //            this.FormManager.CloseForm(app.subGameName+"_UIChat");
        } else if (btnName == "btn_pass") {
            this.Click_btn_pass();
        } else if (btnName == "btn_tip") {
            this.Click_btn_tip();
        } else if (btnName == "btn_outCard") {
            this.Click_btn_outCard();
        } else if (btnName == "btn_1") {
            this.RoomMgr.SendAddDouble(roomID, pos, 0);
        } else if (btnName == "btn_2") {
            this.RoomMgr.SendAddDouble(roomID, pos, 1);
        } else if (btnName == "btn_3") {
            this.RoomMgr.SendAddDouble(roomID, pos, 2);
        } else if (btnName == "btn_5") {
            this.RoomMgr.SendAddDouble(roomID, pos, 5);
        } else if (btnName == "btn_robDoor") {
            this.RoomMgr.SendRoobDoor(roomID, pos, 1);
        } else if (btnName == "btn_notRobDoor") {
            this.RoomMgr.SendRoobDoor(roomID, pos, 0);
        } else if (btnName == "btn_openCard") {
            this.RoomMgr.SendOpenCard(roomID, pos, 1);
        } else if (btnName == "btn_quit" || btnName == "btn_exit") {
            //提示退出房间还是查看大厅
            var room = this.RoomMgr.GetEnterRoom();
            var roomCfg = room.GetRoomConfig();
            if (roomCfg.clubId != 0) {
                this.node.getChildByName("tip_exit_node").zIndex = 100;
                this.node.getChildByName("tip_exit_node").active = true;
            } else {
                this.Click_btn_jiesan();
            }
        } else if (btnName == "btn_jifen") {
            this.Click_btn_jifen();
        } else if (btnName == "btn_close_tip") {
            this.node.getChildByName("tip_exit_node").active = false;
        } else if (btnName == "btn_exit_room") {
            this.Click_btn_jiesan();
        } else if (btnName == "btn_go_hall") {
            app[app.subGameName + "Client"].ExitGame(null, '0');
        } else if (btnName == "btn_shuaxin") {
            this.ReInRoom();
        } else if (btnName == "btn_gps") {
            var PlayerCount = this.RoomPosMgr.GetRoomPlayerCount();
            if (PlayerCount <= 2) {
                app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('MSG_GPS_LOST_PLAYER');
                return;
            }
            if (this.FormManager.IsFormShow(app.subGameName + "_UIGPSLoation")) {
                this.FormManager.CloseForm(app.subGameName + "_UIGPSLoation");
            } else {
                this.FormManager.ShowForm(app.subGameName + "_UIGPSLoation");
            }
        } else if (btnName == "btn_voice") {} else if (btnName == "btn_chat") {
            this.FormManager.ShowForm(app.subGameName + "_UIChat");
        } else if (btnName == "btn_auto") {
            app[app.subGameName + "_GameManager"]().SendAutoStart();
        } else if (btnName == "btn_setting") {
            this.FormManager.ShowForm(app.subGameName + "_UISetting02");
        } else if (btnName == "btn_change") {
            this.Click_btn_change();
        } else if (btnName == "btn_fzfh") {
            var str = "房间号：" + this.RoomMgr.GetEnterRoom().GetRoomProperty("key");
            this.Click_btn_fzkl(str);
        } else if (btnName == "btn_wanfa") {
            this.ShowSysMsg(this.WanFa());
        } else if (btnName == "touming") {
            if (state == this.ShareDefine.SetState_Playing) {
                //手牌回落
                this.LogicPDKGame.ChangeSelectCard([]);
                this.Event_ShowHandCard();
            }
        } else {
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    },
    Event_CodeError: function Event_CodeError(event) {
        var argDict = event;
        var data = argDict["Result"];
        if (data.Msg == "hei tao san bi chu") {
            this.ShowSysMsg("黑桃三先出");
        } else if (argDict.Code == this.ShareDefine.OpCard_Error) {
            //出牌后手牌出错
            this.ReInRoom();
        } else if (argDict.Code == this.ShareDefine.SportsPointNotEnough) {
            this.ShowSysMsg("比赛分不足房间自动解散");
            // this.SetWaitForConfirm("SportsPointNotEnough",this.ShareDefine.ConfirmYN, []);
        } else if (argDict.Code == this.ShareDefine.ApplyDissolve) {
            this.ShowSysMsg("申请解散次数已达上限");
        } else if (argDict.Code == this.ShareDefine.NotAllow) {
            if (this.FormManager.IsFormShow("game/" + app.subGameName.toUpperCase() + "/UI" + app.subGameName.toUpperCase() + "_ResultXY")) {
                this.FormManager.CloseForm("game/" + app.subGameName.toUpperCase() + "/UI" + app.subGameName.toUpperCase() + "_ResultXY");
            }
        }
    },
    Click_btn_jifen: function Click_btn_jifen() {
        var self = this;
        var roomID = this.RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
        app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "RoomXRecord", {
            "roomID": roomID
        }, function (success) {
            self.FormManager.ShowForm("game/" + app.subGameName.toUpperCase() + "/" + app.subGameName + "_UIRoomRecord", success);
        }, function (event) {});
    },
    Click_btn_jiesan: function Click_btn_jiesan() {
        var room = this.RoomMgr.GetEnterRoom();
        if (!room) {
            this.ErrLog("Click_btn_jiesan not enter room");
            return;
        }
        var roomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
        if (app[app.subGameName + "_ShareDefine"]().isCoinRoom) {
            //Event_ExitRoomSuccess 都有做退出处理
            //Event_CodeError
            // let needArg = roomPosMgr.GetClientPos();
            // let roomID = this.RoomMgr.GetEnterRoomID();
            // app[app.subGameName + "_GameManager"]().SendExitRoom(roomID, needArg);
            // app[app.subGameName + "_FormManager"]().AddDefaultFormName(app.subGameName+"UIPractice");
            app[app.subGameName + "Client"].ExitGame();
            return;
        }

        var state = room.GetRoomProperty("state");
        if (state == this.ShareDefine.RoomState_End) {
            //直接退出到大厅
            app[app.subGameName + "Client"].ExitGame();
            return;
        }
        var ClientPos = roomPosMgr.GetClientPos();
        var player = roomPosMgr.GetPlayerInfoByPos(ClientPos);
        if (!player) return;
        var posName = player.name;
        var roomID = this.RoomMgr.GetEnterRoomID();
        if (state == this.ShareDefine.RoomState_Playing) {
            var jiesan = room.GetRoomConfigByProperty('jiesan');
            if (jiesan == 4) {
                this.ShowSysMsg("房间不可以解散");
                return;
            }
            // app[app.subGameName+"_GameManager"]().SendDissolveRoom(roomID, posName);
            app[app.subGameName + "_ConfirmManager"]().SetWaitForConfirmForm(this.OnConFirm.bind(this), 'MSG_GAME_DissolveRoom', []);
            app[app.subGameName + "_ConfirmManager"]().ShowConfirm(this.ShareDefine.Confirm, 'MSG_GAME_DissolveRoom', []);
            return;
        }

        var msgID = '';

        var roomCfg = room.GetRoomConfig();
        if (roomCfg.createType == 2 || roomCfg.clubId != 0) {
            msgID = 'UIMoreTuiChuFangJian';
        } else {
            if (room.IsClientIsCreater()) {
                msgID = 'PlayerLeaveRoom';
            } else {
                msgID = 'UIMoreTuiChuFangJian';
            }
        }

        app[app.subGameName + "_ConfirmManager"]().SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, []);
        app[app.subGameName + "_ConfirmManager"]().ShowConfirm(this.ShareDefine.Confirm, msgID, []);
    },
    //切换人数
    Click_btn_change: function Click_btn_change() {
        var roomID = this.RoomMgr.GetEnterRoomID();
        var that = this;
        app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ChangePlayerNum", {
            "roomID": roomID
        }, function (success) {}, function (error) {
            var msg = error.Msg;
            that.ShowSysMsg(msg);
        });
    },

    Click_btn_tip: function Click_btn_tip() {
        //是否要先出黑桃3
        var array = this.LogicPDKGame.GetTipCard();
        if (this.firstTurn && this.Room.GetRoomWanfa(this.Define.SEVER_FIRST3) && !this.robSuccess) {
            var firstOpCard = this.RoomSet.GetRoomSetProperty("firstOpCard");
            var value = this.LogicPDKGame.GetCardValue(firstOpCard);
            this.ShowSysMsg(app.subGameName.toUpperCase() + "_3FIRST", [value]);
        }

        if (array.length) {
            if (this.tipCount >= array.length) {
                this.tipCount = 0;
            }
            this.LogicPDKGame.ChangeSelectCard(array[this.tipCount]);
            this.Event_ShowHandCard();
            this.tipCount++;
        }
        this.canOutCard();
    },

    Click_btn_pass: function Click_btn_pass() {
        var serverPack = {};
        var roomID = this.RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
        serverPack.roomID = roomID;
        var pos = this.RoomPosMgr.GetClientPos();
        serverPack.pos = pos;
        serverPack.opCardType = 1;
        serverPack.cardList = [];
        this.RoomMgr.SendOpCard(serverPack);
        this.node.getChildByName("img_pass").active = false;
    },

    IsDownPosSingleCard: function IsDownPosSingleCard() {
        var totalNum = -1;
        var playerNum = this.RoomPosMgr.GetPosCount();
        if (playerNum == 2) {
            totalNum = this.GetDownPosCardNum('downPos');
            if (totalNum == 1) {
                return true;
            }
        } else if (playerNum == 3) {
            totalNum = this.GetDownPosCardNum('downPos');
            if (totalNum == 1) {
                return true;
            } else if (totalNum == 0) {
                totalNum = this.GetDownPosCardNum('upPos');
                if (totalNum == 1) {
                    return true;
                }
            }
        } else if (playerNum == 4) {
            totalNum = this.GetDownPosCardNum('downPos');
            if (totalNum == 1) {
                return true;
            } else if (totalNum == 0) {
                totalNum = this.GetDownPosCardNum('facePos');
                if (totalNum == 1) {
                    return true;
                } else if (totalNum == 0) {
                    totalNum = this.GetDownPosCardNum('upPos');
                    if (totalNum == 1) {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    GetDownPosCardNum: function GetDownPosCardNum(posTag) {
        var clientPos = -1;
        var uiPos = -1;
        if (posTag == 'downPos') {
            clientPos = this.RoomPosMgr.GetClientDownPos();
        } else if (posTag == 'facePos') {
            clientPos = this.RoomPosMgr.GetClientFacePos();
        } else if (posTag == 'upPos') {
            clientPos = this.RoomPosMgr.GetClientUpPos();
        }
        uiPos = this.RoomPosMgr.GetUIPosByDataPos(clientPos);
        var cardNode = this.GetWndNode("sp_seat0" + uiPos + "/cardNum");
        return parseInt(cardNode.getComponent(cc.Label).string);
    },

    Click_btn_outCard: function Click_btn_outCard() {
        console.log("点击打牌按钮");
        //发给服务端的消息
        var serverPack = {};
        var roomID = this.RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
        serverPack.roomID = roomID;
        var pos = this.RoomPosMgr.GetClientPos();
        serverPack.pos = pos;
        var opCardType = this.LogicPDKGame.GetCardType();
        console.log("获取打牌的牌型：", opCardType);
        this.ClientOpCardByType(opCardType, serverPack);
    },

    ClientOpCardByType: function ClientOpCardByType(opCardType, serverPack) {
        var isSelectCard = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        if (opCardType > 0) {
            serverPack.opCardType = opCardType;
            var cardList = [];
            if (isSelectCard) {
                cardList = this.LogicPDKGame.GetSelectCard();
            } else {
                cardList = this.LogicPDKGame.GetHandCard();
            }
            //下家如果只有一张单牌 必须从最大牌出
            if (this.IsDownPosSingleCard()) {
                if (opCardType == 2) {
                    var handeCardList = this.LogicPDKGame.GetHandCard();
                    var aValue = this.LogicPDKGame.GetCardValue(handeCardList[0]);
                    var bValue = this.LogicPDKGame.GetCardValue(cardList[0]);
                    if (bValue != aValue) {
                        this.ShowSysMsg(app.subGameName.toUpperCase() + "_BAODAN");
                        return;
                    }
                }
            }
            var firstOpCard = this.RoomSet.GetRoomSetProperty("firstOpCard");
            //获取当前局数
            var setID = this.RoomMgr.GetEnterRoom().GetRoomProperty("setID");
            //如果抢关门成功首轮可以不出黑桃3
            if (!this.robSuccess) {
                //是否每局先出黑桃3
                if (this.Room.GetRoomWanfa(this.Define.SEVER_FIRST3) && this.firstTurn) {
                    if (cardList.indexOf(firstOpCard) == -1 && !this.Room.GetRoomWanfa(this.Define.SEVER_FIRST3NOCHU3)) {
                        this.ShowSysMsg("MSG_CANT_OUT");
                        this.ReInRoom();
                        return;
                    }
                }
                //是否首局先出黑桃3
                else if (this.Room.GetRoomWanfa(this.Define.SEVER_SHOUJUFIRST3) && this.firstTurn && setID == 1) {
                        if (cardList.indexOf(firstOpCard) == -1 && !this.Room.GetRoomWanfa(this.Define.SEVER_FIRST3NOCHU3)) {
                            this.ShowSysMsg("MSG_CANT_OUT");
                            this.ReInRoom();
                            return;
                        }
                    }
            }

            if (!this.Room.GetRoomWanfa(this.Define.SEVER_BMUSTBOMB)) {
                //检测出的牌是否有包含炸弹拆开的
                if (this.LogicPDKGame.IsDismantleBoom()) {
                    this.ShowSysMsg(app.subGameName.toUpperCase() + "_ZDBUCHAI_ERROR");
                    return;
                }
            }
            this.LogicPDKGame.TransformValueToS(cardList);
            //出牌前判断是否重值或多牌
            if (!this.CheckSelCardListInHandCard(cardList)) {
                app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("请重新选牌", [], 3);
                this.ReInRoom();
                return;
            }
            if (!this.CheckSelCardListOrCardList(cardList) && isSelectCard == true) {
                app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("选牌有误，请重新选择", [], 3);
                //手牌回落
                this.LogicPDKGame.ChangeSelectCard([]);
                this.Event_ShowHandCard();
                return;
            }
            serverPack.cardList = cardList;
            serverPack.daiNum = this.LogicPDKGame.GetDaiNum();
            console.log("打出去的牌类型 ==" + serverPack.opCardType);
            this.RoomMgr.SendOpCard(serverPack);
        } else {
            this.ShowSysMsg("MSG_CANT_OUT");
            this.ReInRoom();
        }
    },

    Click_btn_ready: function Click_btn_ready() {
        var room = this.RoomMgr.GetEnterRoom();
        if (!room) {
            this.ErrLog("Click_btn_ready not enter room");
            return;
        }
        var roomID = room.GetRoomProperty("roomID");
        var clientPos = room.GetRoomPosMgr().GetClientPos();
        console.log('roomID', roomID, clientPos);
        app[app.subGameName + "_GameManager"]().SendReady(roomID, clientPos);
    },

    Click_btn_cancel: function Click_btn_cancel() {
        var room = this.RoomMgr.GetEnterRoom();
        if (!room) {
            this.ErrLog("Click_btn_cancel not enter room");
            return;
        }
        var roomID = room.GetRoomProperty("roomID");
        var clientPos = room.GetRoomPosMgr().GetClientPos();
        app[app.subGameName + "_GameManager"]().SendUnReady(roomID, clientPos);
    },

    Click_btn_go: function Click_btn_go() {
        // let roomID = this.RoomMgr.GetEnterRoomID();
        // this.RoomMgr.SendStartRoomGame(roomID);
    },

    //////////////////////////////////////////////////////////////////////////
    Event_PosReadyChg: function Event_PosReadyChg(event) {
        this.RefreshRoomShow();
        var serverPack = event;
        app[app.subGameName + "Client"].OnEvent("Head_PosReadyChg", serverPack);
    },

    Event_RoomEnd: function Event_RoomEnd(event) {
        // this.FormManager.ShowForm(app.subGameName+"_UIXiuXPublic_Record");
        // this.HideAll();
    },

    OnPack_AutoStart: function OnPack_AutoStart(event) {},

    //一局开始
    Event_SetStart: function Event_SetStart(event) {
        this.FormManager.CloseForm(app.subGameName + "_UILPPublic_Record");
        this.FormManager.CloseForm(app.subGameName + "_UIPublic_Record");
        this.FormManager.CloseForm(app.subGameName + "_UIXiuXPublic_Record");
        this.FormManager.CloseForm("game/" + app.subGameName.toUpperCase() + "/UI" + app.subGameName.toUpperCase() + "_ResultXY");
        app[app.subGameName + "Client"].OnEvent("SetStart");
        this.firstTurn = true;
        this.LogicPDKGame.InitHandCard();
        this.ClearForbiddenTouch();
        this.allCardIdx = 0;
        this.hanCardIdx = 0;
        this.player1Idx = 0;
        this.player2Idx = 0;
        this.player3Idx = 0;
        this.openCardInfo = {};
        this.HideAll();
        //隐藏切换人数
        this.btn_change.active = false;
        //显示需要发的牌
        this.ShowAllCard();
        var posInfo = event["setInfo"].posInfo;
        //从房主开始发牌
        // let ownerID = this.RoomMgr.GetEnterRoom().GetRoomProperty("ownerID");
        var playerAll = this.RoomPosMgr.GetRoomAllPlayerInfo();
        var playerAllList = Object.keys(playerAll);
        for (var i = 0; i < playerAllList.length; i++) {
            var player = playerAll[playerAllList[i]];
            // if(ownerID == player.pid){
            //     owner = player;
            // }
            var cardsCount = posInfo[i].cards.length;
            this.InitCardNum(player.pos, cardsCount);
        }
        if (this.Room.GetRoomWanfa(this.Define.SEVER_MINGCARD)) {
            this.btn_openCard.active = true;
        }

        var ClientPos = this.RoomPosMgr.GetClientPos();
        this.FaPaiAction(ClientPos);
        this.SetRoomData();
    },
    //更新局数
    SetRoomData: function SetRoomData() {
        var setID = this.Room.GetRoomProperty("setID");
        var current = this.Room.GetRoomConfigByProperty("setCount");
        this.lb_jushu.string = "局数：" + setID + "/" + current;
        if (setID > 0) {
            this.btn_exit.active = false;
            this.btn_jifen.active = true;
        } else {
            this.btn_exit.active = true;
            this.btn_jifen.active = false;
        }
    },
    //-----------------回调函数------------------------
    Event_ChatMessage: function Event_ChatMessage(event) {
        var argDict = event;
        var senderPid = argDict["senderPid"];
        var quickID = parseInt(argDict["quickID"]);
        var content = argDict["content"];

        var playerList = this.RoomMgr.GetEnterRoom().GetRoomPosMgr().GetRoomAllPlayerInfo();
        var playerListKey = Object.keys(playerList);
        var initiatorPos = "";
        for (var i = 0; i < playerListKey.length; i++) {
            var player = playerList[playerListKey[i]];
            var pid = player["pid"];
            if (senderPid == pid) {
                initiatorPos = parseInt(i);
            }
        }
        var playerSex = this.InitHeroSex(initiatorPos);
        var soundName = "";
        var path = "";
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
                    this.ErrLog("Event_chatmessage not find(%s)", quickID);
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
                case 116:
                    path = "face16Action";
                    break;
                case 117:
                    path = "face17Action";
                    break;
                case 118:
                    path = "face18Action";
                    break;
                case 119:
                    path = "face19Action";
                    break;
                case 120:
                    path = "face20Action";
                    break;
                default:
                    this.ErrLog("Event_chatmessage not find(%s)", quickID);
            }
        }
        this.SoundManager.PlaySound(soundName);

        var roomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();

        //敏感词汇替换
        content = this.UtilsWord.CheckContentDirty(content);
        var headScript = this.GetUICardComponentByPos(initiatorPos);
        if (content == "") {
            headScript.ShowFaceContent(path);
        } else {
            headScript.ShowChatContent(content);
        }
    },

    //特效播放结束
    OnEffectEnd: function OnEffectEnd(wndPath, effectName) {},

    InitHeroSex: function InitHeroSex(pos) {
        var RoomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
        var player = RoomPosMgr.GetPlayerInfoByPos(pos);
        var Sex = player["sex"];
        var playerSex = "";
        if (Sex == this.ShareDefine.HeroSex_Boy) {
            playerSex = "boy";
        } else if (Sex == this.ShareDefine.HeroSex_Girl) {
            playerSex = "girl";
        }
        return playerSex;
    },
    //继续游戏
    Event_PosContinueGame: function Event_PosContinueGame(event) {
        // this.HideAll();
        this.HideAllPass();
        var argDict = event;
        var room = this.RoomMgr.GetEnterRoom();
        if (!room) {
            this.ErrLog("Event_PosContinueGame not enter room");
            return;
        }
        var RoomPosMgr = room.GetRoomPosMgr();
        var clientPos = RoomPosMgr.GetClientPos();
        if (argDict["pos"] != clientPos) {
            var clientPlayerInfo = RoomPosMgr.GetPlayerInfoByPos(clientPos);
            // //如果玩家已经继续了,需要渲染其他人的状态
            if (!clientPlayerInfo["gameReady"]) {
                return;
            }
        } else {
            //如果是自己准备就清理界面
            this.FormManager.CloseForm("game/" + app.subGameName.toUpperCase() + "/UI" + app.subGameName.toUpperCase() + "_ResultXY");
        }
        this.RefreshRoomShow();
    },

    //位置更新
    Event_PosUpdate: function Event_PosUpdate(event) {
        var serverPack = event;
        app[app.subGameName + "Client"].OnEvent('Head_PosUpdate', serverPack);
        this.RefreshRoomShow();
    },

    //位置离开
    Event_PosLeave: function Event_PosLeave(event) {
        var room = this.RoomMgr.GetEnterRoom();
        if (!room) {
            this.ErrLog("Event_PosLeave not enter room");
            return;
        }

        var serverPack = event;
        var pos = serverPack["pos"];

        app[app.subGameName + "Client"].OnEvent('Head_PosLeave', serverPack);

        var clientPos = room.GetRoomPosMgr().GetClientPos();
        //如果是客户端玩家并且是被T了
        if (serverPack["beKick"] && clientPos == pos) {
            if (serverPack["kickOutTYpe"] == 2) {
                this.SetWaitForConfirm('MSG_BeKick', this.ShareDefine.ConfirmOK, [serverPack.msg]);
            } else if (serverPack["kickOutTYpe"] == 3) {
                this.SetWaitForConfirm('MSG_BeKick', this.ShareDefine.ConfirmOK, ["由于长时间未准备，您已被请出房间"]);
            } else {
                this.SetWaitForConfirm('UIPlay_BeKick', this.ShareDefine.ConfirmOK);
            }
        }
        //如果是客户端自己，返回大厅
        if (!serverPack["beKick"] && clientPos == pos) {
            app[app.subGameName + "Client"].ExitGame();
        }
        this.RefreshRoomShow();
    },
    Event_ExitRoomSuccess: function Event_ExitRoomSuccess(event) {
        app[app.subGameName + "Client"].ExitGame();
    },

    HideClientUseTime: function HideClientUseTime() {
        var clientPos = this.RoomPosMgr.GetClientPos();
        var headScript = this.GetUICardComponentByPos(clientPos);
        headScript.SetTimeOpen(false);
    },
    //限时已用房间限时时间(显示静态)
    ShowUseTime: function ShowUseTime(room) {
        var clientPos = this.RoomPosMgr.GetClientPos();
        var secTotal = this.RoomSet.GetSecTotal();
        var headScript = this.GetUICardComponentByPos(clientPos);
        headScript.ShowUseTime(secTotal);
    },

    //重新渲染界面后找服务端要实时时间
    ShowUseTimeByInfo: function ShowUseTimeByInfo(room) {
        var self = this;
        var roomID = this.RoomMgr.GetEnterRoomID();
        var clientPos = this.RoomPosMgr.GetClientPos();
        app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "GetTime", { "roomID": roomID, "pos": clientPos }, function (event) {
            var headScript = self.GetUICardComponentByPos(clientPos);
            headScript.ShowUseTime(event.secTotal);
        }, function (event) {});
    },

    ScheduleTime: function ScheduleTime(pos) {
        var self = this;
        var roomID = this.RoomMgr.GetEnterRoomID();
        var clientPos = this.RoomPosMgr.GetClientPos();
        app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "GetTime", { "roomID": roomID, "pos": clientPos }, function (event) {
            var headScript = self.GetUICardComponentByPos(pos);
            headScript.ShowUseTime(event.secTotal);
            headScript.SetTimeOpen(true);
        }, function (event) {});
    },

    //一局结束
    Event_SetEnd: function Event_SetEnd(event) {
        console.log("一局结束", event);
        this.unschedule(this.CallEverySecond);
        this.HideClientUseTime();
        //判断是否被关门
        var setEnd = this.RoomSet.GetRoomSetProperty("setEnd");
        for (var i = 0; i < setEnd.beShutDowList.length; i++) {
            //龙岩伏击没有反关门
            if (setEnd.beShutDowList[i] && i != setEnd.firstOpPos) {
                var uiPos = this.RoomPosMgr.GetUIPosByDataPos(i);
                var ShutDow_Ani = this.GetWndNode("sp_seat0" + uiPos + "/ShutDow_Ani");
                ShutDow_Ani.active = true;
                ShutDow_Ani.getComponent(cc.Animation).play("guanmen");
            }
        }

        this.UpdatePlayerScore();
        //刷新比赛分
        this.UpdatePlayerSportsPoint(event);
        //发送明牌消息
        var roomID = this.Room.GetRoomProperty("roomID");
        var clientPos = this.RoomPosMgr.GetClientPos();
        this.RoomMgr.SendOpenCard(roomID, clientPos, 1);

        var self = this;
        this.scheduleOnce(function () {
            self.FormManager.ShowForm("game/" + app.subGameName.toUpperCase() + "/UI" + app.subGameName.toUpperCase() + "_ResultXY", setEnd);
        }, 2.0);
    },

    //房间解散
    Event_DissolveRoom: function Event_DissolveRoom(event) {

        var argDict = event;
        var ownnerForce = argDict["ownnerForce"];

        //未开启房间游戏时才会触发
        if (ownnerForce) {
            var room = this.RoomMgr.GetEnterRoom();
            //如果是房主主动接撒直接退出
            if (room && room.IsClientIsOwner()) {
                app[app.subGameName + "Client"].ExitGame();
            } else {
                this.SetWaitForConfirm('OwnnerForceRoom', this.ShareDefine.ConfirmOK);
            }
        } else if (event.dissolveNoticeType == 1) {
            this.SetWaitForConfirm('SportsPointDissolveRoom', this.ShareDefine.ConfirmOK, [event.msg]);
        } else if (event.dissolveNoticeType == 3) {
            this.SetWaitForConfirm('MSG_BeDissolve', this.ShareDefine.ConfirmOK, [event.msg]);
        } else {
            var state = this.RoomMgr.GetEnterRoom().GetRoomProperty("state");
            //如果没有打完一局不会下发roomend,直接显示2次弹框
            if (state != this.ShareDefine.RoomState_End) {
                this.SetWaitForConfirm('DissolveRoom', this.ShareDefine.ConfirmOK);
                this.FormManager.CloseForm(app.subGameName + "_UIMessage02");
            }
            //如果有roomend数据显示 结果界面
            else {
                    this.FormManager.CloseForm(app.subGameName + "_UIMessage02");
                    this.FormManager.ShowForm(app.subGameName + "_UIXiuXPublic_Record");
                }
        }
    },

    //收到解散房间
    Event_StartVoteDissolve: function Event_StartVoteDissolve(event) {
        this.FormManager.ShowForm(app.subGameName + "_UIMessage02");
    },
    //收到切换人数房间
    Event_ChangePlayerNum: function Event_ChangePlayerNum(event) {
        this.FormManager.ShowForm(app.subGameName + "_UIMessage03");
    },

    UpdatePlayerScore: function UpdatePlayerScore() {
        var room = this.RoomMgr.GetEnterRoom();
        var posList = room.GetRoomProperty("posList");
        for (var idx = 0; idx < posList.length; idx++) {
            var uiPos = this.RoomPosMgr.GetUIPosByDataPos(posList[idx].pos);
            var path = "sp_seat0" + uiPos + "/head" + "/XiuXUIPublicHead" + uiPos;
            var headNode = this.GetWndNode(path);
            var headScript = headNode.getComponent(app.subGameName + "_XiuXUIPublicHead");
            headScript.UpDateLabJiFen();
        }
    },
    UpdatePlayerSportsPoint: function UpdatePlayerSportsPoint(event) {
        var room = this.RoomMgr.GetEnterRoom();
        var posList = room.GetRoomProperty("posList");
        for (var idx = 0; idx < posList.length; idx++) {
            var uiPos = this.RoomPosMgr.GetUIPosByDataPos(posList[idx].pos);
            var path = "sp_seat0" + uiPos + "/head" + "/XiuXUIPublicHead" + uiPos;
            var headNode = this.GetWndNode(path);
            var headScript = headNode.getComponent(app.subGameName + "_XiuXUIPublicHead");
            headScript.UpDateLabSportsPoint();
        }
    },

    GetUICardComponentByPos: function GetUICardComponentByPos(pos) {
        var room = this.RoomMgr.GetEnterRoom();
        if (!room) {
            this.ErrLog("GetUICardComponentByPos not enter room");
            return;
        }

        var posList = room.GetRoomProperty("posList");
        for (var idx = 0; idx < posList.length; idx++) {
            if (pos == posList[idx].pos) {
                var uiPos = this.RoomPosMgr.GetUIPosByDataPos(posList[idx].pos);
                var path = "sp_seat0" + uiPos + "/head" + "/XiuXUIPublicHead" + uiPos;
                var headNode = this.GetWndNode(path);
                var headScript = headNode.getComponent(app.subGameName + "_XiuXUIPublicHead");
                return headScript;
            }
        }
    },
    //显示玩家准备状态
    ShowPlayerReady: function ShowPlayerReady(room) {
        if (!room) {
            this.ErrLog("Event_ShowReadyOrNoReady not enter room");
            return;
        }
        var roomSetID = room.GetRoomProperty("setID");
        var ReadyState = "";
        if (roomSetID > 0) {
            ReadyState = "gameReady";
        } else {
            ReadyState = "roomReady";
        }

        this.SetPlayerReadyInfo(ReadyState);
    },

    //隐藏玩家准备按钮
    HidePlayerReady: function HidePlayerReady() {
        this.btn_ready.active = 0;
        this.btn_weixin.active = 0;
        this.btn_fzfh.active = false;
        this.btn_go.active = 0;
        this.btn_quit.active = false;
        this.invitationNode.active = false;
    },
    HideClientReady: function HideClientReady() {
        this.btn_ready.active = false;
        this.btn_weixin.active = false;
        this.btn_fzfh.active = false;
        this.btn_go.active = false;
        this.btn_quit.active = false;
        this.invitationNode.active = false;
    },
    IsClientReady: function IsClientReady(ReadyState) {
        var roomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
        var clientPos = roomPosMgr.GetClientPos();
        var playerAll = roomPosMgr.GetRoomAllPlayerInfo();
        var playerAllList = Object.keys(playerAll);
        for (var i = 0; i < playerAllList.length; i++) {
            var player = playerAll[playerAllList[i]];
            var isClientReady = player[ReadyState];
            if (player["pos"] == clientPos) {
                return isClientReady;
                break;
            }
        }
    },
    JoinPlayerFinish: function JoinPlayerFinish() {
        var roomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
        var playerAll = roomPosMgr.GetRoomAllPlayerInfo();
        var playerAllList = Object.keys(playerAll);
        var tempNum = 0;
        for (var j = 0; j < playerAllList.length; j++) {
            var player = playerAll[playerAllList[j]];
            if (player.pid > 0) {
                tempNum++;
            }
        }
        if (tempNum == playerAllList.length) {
            return true;
        }
        return false;
    },
    SetPlayerReadyInfo: function SetPlayerReadyInfo(ReadyState) {
        if (ReadyState == "gameReady") {
            //第二局
            this.HideClientReady();
        } else if (ReadyState == "roomReady") {
            //第一局
            if (this.JoinPlayerFinish() && this.IsClientReady(ReadyState) == false) {
                //人数加满，本家没准备
                this.ShowPlayerOk();
            } else if (this.JoinPlayerFinish() && this.IsClientReady(ReadyState) == true) {
                //人数加满，本家准备
                this.HideClientReady();
            } else {
                //人数未满
                this.ShowPlayerYaoQing();
            }
        }
    },
    ShowPlayerYaoQing: function ShowPlayerYaoQing() {
        this.btn_ready.active = 0;
        this.btn_weixin.active = 1;
        this.btn_fzfh.active = 1;
        this.btn_quit.active = true;
        this.btn_go.active = 0;
        if (this.roomCfg.clubId > 0 || this.roomCfg.unionId > 0) {
            this.invitationNode.active = false;
        } else {
            this.invitationNode.active = false;
        }
    },
    ShowPlayerOk: function ShowPlayerOk() {
        if (this.isAutoReady() == true) {
            this.btn_ready.active = 0;
            this.Click_btn_ready();
        } else {
            this.btn_ready.active = 1;
        }

        this.btn_weixin.active = 0;
        this.btn_fzfh.active = false;
        this.btn_go.active = 0;
        this.btn_quit.active = false;
        this.invitationNode.active = false;
    },

    GetPlayerSex: function GetPlayerSex(pos) {
        var playerSex = "";
        var player = this.RoomPosMgr.GetPlayerInfoByPos(pos);
        var Sex = player["sex"];
        if (Sex == this.ShareDefine.HeroSex_Boy) {
            playerSex = "b";
        } else if (Sex == this.ShareDefine.HeroSex_Girl) {
            playerSex = "g";
        }
        return playerSex;
    },

    //设置手牌缩放大小
    SetHandCardScale: function SetHandCardScale(scale) {
        this.handCards.scale = scale;
    },

    /**
     * 2次确认点击回调
     */
    SetWaitForConfirm: function SetWaitForConfirm(msgID, type) {
        var msgArg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var cbArg = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

        var ConfirmManager = app[app.subGameName + "_ConfirmManager"]();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
        ConfirmManager.ShowConfirm(type, msgID, msgArg);
    },
    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {
        var ClientPos = this.RoomPosMgr.GetClientPos();
        var player = this.RoomPosMgr.GetPlayerInfoByPos(ClientPos);
        var posName = player.name;
        var roomID = this.RoomMgr.GetEnterRoomID();
        if (clickType != "Sure") {
            if (msgID == "SportsPointNotEnough") {
                var _roomID = this.RoomMgr.GetEnterRoomID();
                app[app.subGameName + "_GameManager"]().SendDissolveRoom(_roomID);
            }
            return;
        }
        if (msgID == "UIPlay_BeKick") {
            app[app.subGameName + "Client"].ExitGame();
        } else if ('MSG_Room_Change' == msgID) {
            var _roomID2 = this.RoomMgr.GetEnterRoomID();
            var that = this;
            app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ChangePlayerNum", {
                "roomID": _roomID2
            }, function (success) {}, function (error) {
                var msg = error.Msg;
                that.ShowSysMsg(msg);
            });
        } else if (msgID == "MSG_BeKick" || msgID == "MSG_BeDissolve") {
            app[app.subGameName + "Client"].ExitGame();
        } else if (msgID == "OwnnerForceRoom") {
            app[app.subGameName + "Client"].ExitGame();
        } else if (msgID == "MSG_Room_EXIT") {
            this.Click_btn_jiesan();
        } else if (msgID == "DissolveRoom") {
            app[app.subGameName + "Client"].ExitGame();
        } else if (msgID == "SportsPointThresholdEnough" || msgID == "SportsPointThresholdNotEnough") {
            app[app.subGameName + "Client"].ExitGame();
        } else if (msgID == "SportsPointDissolveRoom") {
            this.FormManager.ShowForm(app.subGameName + "_UIXiuXPublic_Record");
        } else if (msgID == "PlayerLeaveRoom") {
            var _roomID3 = this.RoomMgr.GetEnterRoomID();
            app[app.subGameName + "_GameManager"]().SendDissolveRoom(_roomID3);
        } else if (msgID == "UIMoreTuiChuFangJian") {
            var roomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
            var _ClientPos = roomPosMgr.GetClientPos();
            var _player = roomPosMgr.GetPlayerInfoByPos(_ClientPos);
            if (!_player) return;
            var _posName = _player.name;
            var _roomID4 = this.RoomMgr.GetEnterRoomID();
            var state = this.Room.GetRoomProperty("state");
            if (state == this.ShareDefine.RoomState_Playing && _player.isPlaying) {
                app[app.subGameName + "_GameManager"]().SendDissolveRoom(_roomID4, _posName);
                return;
            }
            //房主不能退出房间，只能解散
            if (this.RoomMgr.GetEnterRoom().IsClientIsOwner()) {
                app[app.subGameName + "_GameManager"]().SendDissolveRoom(_roomID4, _posName);
                return;
            }
            app[app.subGameName + "_GameManager"]().SendExitRoom(_roomID4, _ClientPos);
        } else if (msgID == "MSG_GAME_DissolveRoom") {
            app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID, posName);
        } else {
            this.ErrLog("OnConFirm msgID:%s error", msgID);
        }
    },

    Event_TouchStart: function Event_TouchStart(event) {
        // this.SysLog("Event_TouchStart");
        if (!this.IsShowVoice()) {
            this.ShowSysMsg("禁止语音");
            return;
        }
        app[app.subGameName + "_AudioManager"]().startRecord();
    },
    Event_TouchEnd: function Event_TouchEnd(event) {
        // this.SysLog("Event_TouchEnd"); 
        this.FormManager.CloseForm(app.subGameName + "_UIAudio");
        app[app.subGameName + "_AudioManager"]().setTouchEnd(true);
        app[app.subGameName + "_AudioManager"]().stopRecord();
    },

    OnEventShow: function OnEventShow() {
        if (!this.RoomMgr || typeof this.RoomMgr == "undefined") {
            return;
        }
        var curTime = new Date().getTime();
        var lostHearTime = cc.sys.isNative ? 30000 : 3000000;
        if (this.outGameTime && curTime > this.outGameTime + lostHearTime) {
            // app[app.subGameName + "Client"].lastHearTime = 0;
            this.outGameTime = 0;
            if (app[app.subGameName + "_NetWork"]().isConnectIng) {
                //ios的可能websoket不会主动断开
                console.log("后台切回来，先断开连接");
                app[app.subGameName + "_NetManager"]().Disconnect();
            }
            if (!app[app.subGameName + "Client"].bStartReConnect) {
                console.log("后台切回来，发起断线重连");
                app[app.subGameName + "Client"].StartReConnect();
                app[app.subGameName + "_NetWork"]().ReConnectByTipSureBtn();
            }
        } else {
            var roomID = this.RoomMgr.GetEnterRoomID();
            app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ShowLeave", {
                "roomID": roomID,
                "isShowLeave": false
            });
        }
        app[app.subGameName + "Client"].scheduleOnce(function () {
            app[app.subGameName + "Client"].StartTimer();
        }, 2);
    },

    OnEventHide: function OnEventHide() {
        console.log("从游戏内切换后台");
        this.outGameTime = new Date().getTime();
        var roomID = this.RoomMgr.GetEnterRoomID();
        app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ShowLeave", {
            "roomID": roomID,
            "isShowLeave": true
        });
        app[app.subGameName + "Client"].StopTimer();
    },

    //判断选择的牌是否玩家手里的牌
    CheckSelCardListInHandCard: function CheckSelCardListInHandCard(selCardList) {
        var handCardListTemp = [];
        for (var i = 0; i < this.LogicPDKGame.handCardList.length; i++) {
            handCardListTemp.push(this.LogicPDKGame.handCardList[i]);
        }
        for (var _i9 = 0; _i9 < selCardList.length; _i9++) {
            if (handCardListTemp.indexOf(selCardList[_i9]) >= 0) {
                handCardListTemp.Remove(selCardList[_i9]);
            } else {
                return false;
            }
        }
        return true;
    },
    // 判断弹起的牌是否跟发送服务端的出牌list一致
    CheckSelCardListOrCardList: function CheckSelCardListOrCardList(selCardList) {
        var selHandCardsList = [];
        for (var i = 0; i < this.handCards.children.length; i++) {
            if (this.handCards.children[i].y > 0) {
                var name = this.handCards.children[i].name;
                var cardIdx = name.substring(5, name.length);
                selHandCardsList.push(this.LogicPDKGame.handCardList[cardIdx - 1]);
            }
        }
        for (var _i10 = 0; _i10 < selCardList.length; _i10++) {
            if (selHandCardsList.indexOf(selCardList[_i10]) >= 0) {
                selHandCardsList.Remove(selCardList[_i10]);
            } else {
                return false;
            }
        }
        if (selHandCardsList.length == 0) {
            return true;
        }
        return false;
    },

    //电量显示
    OnEvent_BatteryLevel: function OnEvent_BatteryLevel(event) {
        var power = event['Level'];
        if (power <= 20) {
            this.bg_power.getComponent(cc.Sprite).spriteFrame = this.bg_electricity[0];
        } else if (power <= 70) {
            this.bg_power.getComponent(cc.Sprite).spriteFrame = this.bg_electricity[1];
        } else {
            this.bg_power.getComponent(cc.Sprite).spriteFrame = this.bg_electricity[2];
        }
    },
    //延迟显示
    OnEvent_SpeedTest: function OnEvent_SpeedTest(event) {
        var YanCi = event['yanci'];
        if (YanCi < 100) {
            this.bg_signal.getComponent(cc.Sprite).spriteFrame = this.bg_wifi[0];
        } else if (YanCi < 300) {
            this.bg_signal.getComponent(cc.Sprite).spriteFrame = this.bg_wifi[1];
        } else if (YanCi < 600) {
            this.bg_signal.getComponent(cc.Sprite).spriteFrame = this.bg_wifi[2];
        } else {
            this.bg_signal.getComponent(cc.Sprite).spriteFrame = this.bg_wifi[3];
        }
    },
    update: function update(dt) {
        var DateNow = new Date();
        var Hours = DateNow.getHours();
        var Minutes = DateNow.getMinutes();
        var Seconds = DateNow.getSeconds();

        Hours = app[app.subGameName + "_ComTool"]().StringAddNumSuffix("", Hours, 2);
        Minutes = app[app.subGameName + "_ComTool"]().StringAddNumSuffix("", Minutes, 2);
        Seconds = app[app.subGameName + "_ComTool"]().StringAddNumSuffix("", Seconds, 2);

        //显示系统时间
        this.nowtime.getComponent(cc.Label).string = Hours + ":" + Minutes + ":" + Seconds;
        // this.nowtime.getComponent(cc.Label).string = app[app.subGameName + "_ComTool"]().GetNowDateTimeStr();
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
        //# sourceMappingURL=UIPDK_XiuXPlay.js.map
        