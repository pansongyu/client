var app = require("pdk_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
        btn_ready: cc.Node,
        btn_weixin: cc.Node,
        btn_cancel: cc.Node,
        btn_go: cc.Node,
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
        lianDui_Ani: cc.Node,
        boom_Ani: cc.Node,
        plane_Ani: cc.Node,
        dragon_Ani: cc.Node,

        labelRoomId: cc.Label, //特殊处理的房间信息显示
        labeiWanfa: cc.Label,
        lb_jushu: cc.Label,
        roomInfo: cc.Node,
        lb_time: cc.Label,
        lb_dianLiang: cc.Label,
        pro_dianLiang: cc.ProgressBar,

        headPrefab: cc.Prefab,
        cardPrefab: cc.Prefab,
        bsPrefab: cc.Prefab,

        giftPrefabs: [cc.Prefab],
        giftNode: cc.Node,

        btn_voice: cc.Node,
        btn_chat: cc.Node,

        btn_change: cc.Node,

        gameBg: [cc.SpriteFrame],
        gameLogo: [cc.SpriteFrame],
        logoNode: cc.Node,
        BgNode: cc.Node,

        UIInvitation: cc.Prefab,
        resVersion: cc.Label,
    },

    OnCreateInit: function() {
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

        this.btn_voice.on("touchstart", this.Event_TouchStart, this)
        this.btn_voice.on("touchend", this.Event_TouchEnd, this)
        this.btn_voice.on("touchcancel", this.Event_TouchEnd, this)

        this.handCards.on(cc.Node.EventType.TOUCH_START, this.OnTouchStart, this);
        this.handCards.on(cc.Node.EventType.TOUCH_MOVE, this.OnTouchMove, this);
        this.handCards.on(cc.Node.EventType.TOUCH_END, this.OnTouchEnd, this);
        this.handCards.on(cc.Node.EventType.TOUCH_CANCEL, this.OnTouchCancel, this);

        this.boom_Ani.getComponent(cc.Animation).on('finished', this.OnAniBoomFinished, this);
        this.plane_Ani.getComponent(cc.Animation).on('finished', this.OnAniPlaneFinished, this);
        this.dragon_Ani.getComponent(cc.Animation).on('finished', this.OnAniDragonFinished, this);
        for (var i = 0; i < 4; i++) {
            let ShutDow_Ani = this.GetWndNode("sp_seat0" + i + "/ShutDow_Ani");
            ShutDow_Ani.getComponent(cc.Animation).on('finished', this.OnAniShutDowFinished, this);
        }

        this.InitData();
        this.AddCardPrefab();

        this.invitationNode = cc.instantiate(this.UIInvitation);
        this.node.addChild(this.invitationNode);

        cc.game.on(cc.game.EVENT_HIDE, this.OnEventHide.bind(this));
        cc.game.on(cc.game.EVENT_SHOW, this.OnEventShow.bind(this));
    },
    Event_SportsPointEnough: function(event) {
        let msg = event.msg;
        this.SetWaitForConfirm("SportsPointEnough", this.ShareDefine.ConfirmOK, [msg]);
    },
    Event_SportsPointNotEnough: function(event) {
        let msg = event.msg;
        this.ShowSysMsg("比赛分不足房间自动解散");
        // this.SetWaitForConfirm("SportsPointNotEnough", this.ShareDefine.ConfirmYN, []);
    },

    Event_SportsPointThresholdEnough: function(event) {
        let msg = event.msg;
        this.SetWaitForConfirm("SportsPointThresholdEnough", this.ShareDefine.ConfirmOK, [msg]);
    },
    Event_SportsPointThresholdNotEnough: function(event) {
        let msg = event.msg;
        // this.ShowSysMsg("您得比赛分门槛不足，请联系赛事管理");
        this.SetWaitForConfirm("SportsPointThresholdNotEnough", this.ShareDefine.ConfirmOK, []);
    },
    //停止房间倒计时
    Event_StopTime: function(event){
        this.HideClientUseTime();
    },

    
    InitData: function() {
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
        let that = this;

    },

    OnAniBoomFinished: function(event) {
        this.boom_Ani.active = false;
    },
    OnAniPlaneFinished: function(event) {
        this.plane_Ani.active = false;
    },
    OnAniDragonFinished: function(event) {
        this.dragon_Ani.active = false;
    },
    OnAniShutDowFinished: function(event) {
        for (var i = 0; i < 4; i++) {
            let ShutDow_Ani = this.GetWndNode("sp_seat0" + i + "/ShutDow_Ani");
            ShutDow_Ani.active = false;
        }
    },

    ShowAllCard: function() {
        return;
        /*this.allCards.active = true;
        let cardNum = this.Room.GetRoomConfigByProperty("shoupai");
        if (cardNum == 0) {
            cardNum = this.Define.MidHandCard;
        } else if (cardNum == 1) {
            cardNum = this.Define.MidHandCardEx;
        } else {
            cardNum = this.Define.MaxHandCard;
        }
        let playerNum = this.Room.GetRoomConfigByProperty("playerNum");
        let allCardNum = playerNum * cardNum;
        let xPos = -512;
        let yPos = 0;
        for (let i = 0; i < allCardNum; i++) {
            let card = this.allCards.children[i];
            card.getChildByName("poker_back").active = true;
            card.active = true;
            if (i == 48) {
                xPos = -512;
            }
            if (i > 47) {
                card.y = -31.5;
                card.x = xPos;
            } else {
                card.y = 0;
                card.x = xPos;
            }
            xPos += 22;
        }*/
    },

    AddCardPrefab: function() {
        //发牌的牌墩
        /*this.allCards.active = false;
        for (let i = 0; i < this.Define.MaxTableCard; i++) {
            let card = cc.instantiate(this.cardPrefab);
            this.allCards.addChild(card);
            card.active = false;
            card.name = "card_" + (i + 1).toString();
        }*/

        //玩家手牌
        this.handCards.active = false;
        for (let i = 0; i < this.Define.MaxHandCard; i++) {
            let card = cc.instantiate(this.cardPrefab);
            card.active = false;
            card.name = "card_" + (i + 1).toString();
            this.handCards.addChild(card);
        }

        //玩家打出去的牌
        for (let i = 0; i < this.Define.MaxPlayer; i++) {
            let outCardList = this.node.getChildByName("outCardList" + i);
            outCardList.active = false;
            let typeNode = cc.find(`outCardList${i}_cardType`, this.node);
            typeNode.getComponent(cc.Sprite).spriteFrame = null;
            for (let j = 0; j < this.Define.MaxHandCard; j++) {
                let card = cc.instantiate(this.cardPrefab);
                card.active = false;
                card.name = "card_" + (i + 1).toString();
                outCardList.addChild(card);
            }
        }

        //玩家明牌的牌
        for (let i = 1; i < this.Define.MaxPlayer; i++) {
            let openCardList = this.node.getChildByName("openCardList" + i);
            openCardList.active = false;
            for (let j = 0; j < this.Define.MaxHandCard; j++) {
                let card = cc.instantiate(this.cardPrefab);
                card.active = false;
                card.name = "card_" + (i + 1).toString();
                openCardList.addChild(card);
            }
        }
    },

    Event_ShowHandCard: function() {
        this.handCards.active = true;
        let downList = this.LogicPDKGame.GetHandCard();
        for (let i = 0; i < this.handCards.children.length; i++) {
            let cardValue = downList[i];
            let cardNode = this.handCards.children[i];
            cardNode.y = 0;
            if (cardValue) {
                let bSelected = this.LogicPDKGame.CheckSelected(cardValue);
                if (bSelected) {
                    cardNode.y += this.Define.MaxRisePosY;
                }
                let isLastCard = false;
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

    ChangeCardNum: function(dataPos, len) {
        let uiPos = this.RoomPosMgr.GetUIPosByDataPos(dataPos);
        if (uiPos == 0) return;
        let card = this.GetWndNode("sp_seat0" + uiPos + "/card");
        let cardNum = this.GetWndNode("sp_seat0" + uiPos + "/cardNum");
        if (!this.Room.GetRoomWanfa(this.Define.SEVER_SHOWCARDNUM)) {
            // if(!true){//默认显示
            cardNum.active = false;
        } else {
            cardNum.active = true;
        }
        let totalNum = len;
        cardNum.getComponent(cc.Label).string = totalNum.toString() + '';
        if (!card.getChildByName("poker_back").active) {
            card.getChildByName("poker_back").active = true;
        }
        this.ShowWarningByPos(dataPos, totalNum);

        return totalNum;
    },

    ShowWarningByPos: function(dataPos, len) {
        if (this.RoomPosMgr.GetClientPos() == dataPos) return;
        let uiPos = this.RoomPosMgr.GetUIPosByDataPos(dataPos);
        let warning = this.GetWndNode("sp_seat0" + uiPos + "/warning");
        //只有剩一张牌才显示警告动画
        if (len == 1) {
            warning.active = true;
            warning.getComponent(cc.Animation).play("warning");
        } else {
            warning.active = false;
            warning.getComponent(cc.Animation).stop("warning");
        }
    },

    SetSeat01OutCardPos: function(dataPos, len) {
        let uiPos = this.RoomPosMgr.GetUIPosByDataPos(dataPos);
        if (uiPos != 3) return;

        let node = this.node.getChildByName("outCardList3");
        let posX = 575 - 25 * len;
        node.x = posX;
    },

    SetAniPos: function(dataPos) {
        let uiPos = this.RoomPosMgr.GetUIPosByDataPos(dataPos);
        if (uiPos == 1) {
            this.boom_Ani.setPosition(cc.v2(232, 64));
        } else {
            let outCardList = this.node.getChildByName("outCardList" + uiPos);
            this.boom_Ani.setPosition(cc.v2(outCardList.x, outCardList.y));
        }
    },

    PlayCardSound: function(pos, opCardType, cardList, circleEnd) {
        let sex = this.GetPlayerSex(pos);
        if (this.lastCircleEnd) {
            if (opCardType == 2) {
                let value = this.LogicPDKGame.GetCardValue(cardList[0]);
                this.SoundManager.PlaySound(sex + "One_" + value);
            } else if (opCardType == 3) {
                let value = this.LogicPDKGame.GetCardValue(cardList[0]);
                this.SoundManager.PlaySound(sex + "Double_" + value);
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
                let randomNum = Math.floor(Math.random() * 3 + 1);
                this.SoundManager.PlaySound(sex + "Not_" + randomNum);
            } else if (opCardType == 11) {
                this.SoundManager.PlaySound(sex + "Boom");
            } else {
                let randomNum = Math.floor(Math.random() * 3 + 1);
                this.SoundManager.PlaySound(sex + "Bigger_" + randomNum);
            }
        }

        this.lastCircleEnd = circleEnd;
    },

    Event_GameGift: function(event) {
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

    GiftMoveEnd: function(sender, useData) {
        sender.getComponent(cc.Animation).play();
        sender.bMove = false;
        //播放音效
        app[app.subGameName + "_SoundManager"]().PlaySound('mofa_' + sender.name);
    },

    OnGiftAniEnd: function(event) {
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

    //检测出牌玩家是否离开中
    CheckOpCardPosIsLeave:function(pos){
        let opPosInfo = this.RoomPosMgr.GetPlayerInfoByPos(pos);
        let roomID = this.RoomMgr.GetEnterRoomID();
        if(opPosInfo.isShowLeave){
            app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ShowLeave", {
                "roomID": roomID,
                "isShowLeave": false
            });
        }
    },

    Event_OpCard: function(event) {
        let data = event;
        this.firstTurn = false;
        this.notUp = false;
        this.gameBtn.active = false;
        this.tipCount = 0;
        let time = this.GetClockTime();
        let runWaitSec = data.runWaitSec;
        let secTotal = data.secTotal;
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
        } else if (data.opCardType == 14) { //连对
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
                let opCardType = this.LogicPDKGame.GetCardType(false);
                console.log("所有手牌组成一个牌型：" + opCardType);
                if (opCardType > 0) {
                    let isOut = false;
                    if (data.turnEnd) {
                        isOut = true;
                    } else {
                        let tipArray = this.LogicPDKGame.GetTipCard();
                        if (tipArray.length > 0) {
                            let myHangCard = this.LogicPDKGame.GetHandCard();
                            for (let i = 0; i < tipArray.length; i++) {
                                //发给服务端的消息
                                if (tipArray[i].length == myHangCard.length) {
                                    isOut = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (isOut == true) {
                        let serverPack = {};
                        let roomID = this.RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
                        serverPack.roomID = roomID;
                        let pos = this.RoomPosMgr.GetClientPos();
                        serverPack.pos = pos;
                        let self = this;
                        this.scheduleOnce(function() {
                            self.ClientOpCardByType(opCardType, serverPack, false);
                        }, 1.0);
                        return;
                    }
                }
            }
            if (data.turnEnd) {
                this.ShowBtnTipAndOutCard();
            } else {
                let array = this.LogicPDKGame.GetTipCard();
                if (!array.length) {
                    if (this.isAutoPass()) {
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

    isCanChoose: function() {
        for (let i = 0; i < this.handCards.children.length; i++) {
            if (this.handCards.children[i].y > 0) {
                return false;
            }
        }
        return true;
    },
    ForbiddenTouch: function(pokerList) {
        this.ClearForbiddenTouch();

        let downList = this.LogicPDKGame.GetHandCard();
        if (pokerList.length >= 0) {
            let cardType = this.LogicPDKGame.GetLastCardType();
            if (cardType == 6 || cardType == 7 || cardType == 8 || cardType == 9 || cardType == 10 ||
                cardType == 12 || cardType == 13) {
                if (!this.LogicPDKGame.CheckOnlyBoom(pokerList)) {
                    return;
                }
            }
            let lastValue = 0;
            for (let i = downList.length - 1; i >= 0; i--) {
                let poker = downList[i];
                let cardValue = this.LogicPDKGame.GetCardValue(poker);
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

                let isHas = false;
                for (let j = 0; j < pokerList.length; j++) {
                    let list = pokerList[j];
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

    ClearForbiddenTouch: function() {
        this.LogicPDKGame.ChangeSelectCard([]);
        let downList = this.LogicPDKGame.GetHandCard();
        for (let i = 0; i < downList.length; i++) {
            this.handCards.children[i].y = 0;
            this.handCards.children[i].touchTag = false;
            this.handCards.children[i].getChildByName('bg_black').active = false;
            //           this.handCards.children[i].removeComponent(cc.Button);
        }
    },

    DeleteOpenCardList: function(dataPos, cardList) {
        if (!this.Room.GetRoomWanfa(this.Define.SEVER_MINGCARD)) return;
        if (dataPos == this.RoomPosMgr.GetClientPos()) return;

        if (this.openCardInfo[dataPos]) {
            let openCardList = this.openCardInfo[dataPos];
            for (let i = 0; i < cardList.length; i++) {
                let value = cardList[i];
                let pos = openCardList.indexOf(value);
                if (pos != -1) {
                    openCardList.splice(pos, 1);
                }
            }

            this.ShowOpenCard(dataPos, openCardList);
        }
    },

    Event_ChangeStatus: function(event) {
        let opPos = this.RoomSet.GetRoomSetProperty("opPos");
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
        if (this.Room.GetRoomWanfa( /*this.Define.DOUBLE*/ -1)) {
            this.gameMultiple.active = false;
        }
        this.StartGame(opPos);
    },

    Event_AddDouble: function(event) {
        let data = event;
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

    Event_OpenCard: function(event) {
        let data = event;
        let sex = this.GetPlayerSex(data.pos);
        // this.SoundManager.PlaySound(sex + "ShowCard");//去除明牌音效
        if (data.OpenCard == 0) return;
        this.openCardInfo[data.pos] = data.cardList;
        this.ShowOpenCard(data.pos, data.cardList);
        if (data.pos == this.RoomPosMgr.GetClientPos()) {
            this.btn_openCard.active = false;
            let state = this.RoomSet.GetRoomSetProperty("state");
            if (state != this.ShareDefine.SetState_End) {
                this.ShowSysMsg(app.subGameName.toUpperCase() + "_OPENCARD");
            }
        }
    },

    Event_RobClose: function(event) {
        let data = event;
        if (data.pos == this.RoomPosMgr.GetClientPos()) {
            this.ShowSysMsg(app.subGameName.toUpperCase() + "_ROOBCLOSE");
            this.btn_robDoor.active = false;
            this.btn_notRobDoor.active = false;
            this.gameMultiple.x = 0;
        }
    },

    ShowOpenCard: function(dataPos, cardList) {
        let uiPos = this.RoomPosMgr.GetUIPosByDataPos(dataPos);
        if (uiPos == 0) return;
        this.LogicPDKGame.SortCardByMax(cardList);
        let openCardList = this.node.getChildByName("openCardList" + uiPos);
        openCardList.active = true;
        for (let i = 0; i < openCardList.children.length; i++) {
            let cardNode = openCardList.children[i];
            let value = cardList[i];
            let isLastCard = false;
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

    HideAllOpenCard: function() {
        for (let i = 1; i < this.Define.MaxPlayer; i++) {
            let openCardList = this.node.getChildByName("openCardList" + i);
            openCardList.active = false;
        }
    },

    ShowAddDouble: function(dataPos, addDouble) {},

    ShowOutCard: function(dataPos, cardList, opCardType) {
        let uiPos = this.RoomPosMgr.GetUIPosByDataPos(dataPos);
        //
        if (!cardList.length) {
            let pass = this.GetWndNode("sp_seat0" + uiPos + "/pass");
            pass.active = true;
            pass.getComponent(cc.Animation).play();
            return;
        }
        if ([4, 6, 7, 8, 9, 10, 12, 14].includes(opCardType)) {
            let typeNode = cc.find(`outCardList${uiPos}_cardType`, this.node);
            typeNode.getComponent(cc.Animation).play(`card_type${opCardType}`);
        }
        let outCardNodeList = this.node.getChildByName("outCardList" + uiPos);
        console.warn(uiPos, '出牌节点位置', outCardNodeList.getPosition());
        outCardNodeList.active = true;
        for (let i = 0; i < outCardNodeList.children.length; i++) {
            let cardNode = outCardNodeList.children[i];
            let value = cardList[i];
            let isLastCard = false;
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

    HideAllOutCard: function() {
        for (let i = 0; i < this.Define.MaxPlayer; i++) {
            let outCard = this.node.getChildByName("outCardList" + i);
            let typeNode = cc.find(`outCardList${i}_cardType`, this.node);
            typeNode.getComponent(cc.Sprite).spriteFrame = null;
            outCard.active = false;
        }
    },

    HideAllPass: function() {
        for (let i = 0; i < this.Define.MaxPlayer; i++) {
            let pass = this.GetWndNode("sp_seat0" + i + "/pass");
            pass.active = false;
        }
    },

    HideAllClock: function() {
        for (let i = 0; i < this.Define.MaxPlayer; i++) {
            let clock = this.GetWndNode("sp_seat0" + i + "/clock");
            clock.active = false;
        }
    },

    HideAllWarning: function() {
        for (let i = 1; i < this.Define.MaxPlayer; i++) {
            let warning = this.GetWndNode("sp_seat0" + i + "/warning");
            warning.getComponent(cc.Animation).stop("warning");
            warning.active = false;
        }
    },
    HideChild: function(node) {
        for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i];
            child.active = false;
        }
    },
    HideAllHandCard: function() {
        //获取是16张玩法还是15张玩法
        let shoupai = this.Room.GetRoomShouPai();
        for (let i = 0; i < this.handCards.children.length; i++) {
            let child = this.handCards.children[i];
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

    HideAllCardNum: function() {
        for (let i = 1; i < this.Define.MaxPlayer; i++) {
            let card = this.GetWndNode("sp_seat0" + i + "/card");
            card.active = false;
            let cardNum = this.GetWndNode("sp_seat0" + i + "/cardNum");
            cardNum.active = false;
            let poker_back = this.GetWndNode("sp_seat0" + i + "/card/poker_back");
            poker_back.active = true;
        }
    },

    HideClockByPos: function(dataPos) {
        let uiPos = this.RoomPosMgr.GetUIPosByDataPos(dataPos);
        let clock = this.GetWndNode("sp_seat0" + uiPos + "/clock");
        clock.active = false;
        //
        if (uiPos == 0) {
            cc.find('img_mask_pk', this.node).active = false;
        }
    },

    ClearPlayerTable: function(dataPos) {
        let uiPos = this.RoomPosMgr.GetUIPosByDataPos(dataPos);
        let outCardList = this.GetWndNode("outCardList" + uiPos);
        for (let i = 0; i < outCardList.children.length; i++) {
            let child = outCardList.children[i];
            if (child.active) {
                child.active = false;
            }
        }

        // let pass = this.GetWndNode("sp_seat0" + uiPos + "/pass");
        // pass.active = false;
        // let typeNode = cc.find(`outCardList${uiPos}_cardType`, this.node);
        // typeNode.getComponent(cc.Sprite).spriteFrame = null;
    },

    ClearPlayerState: function(dataPos) {
        let uiPos = this.RoomPosMgr.GetUIPosByDataPos(dataPos);

        let pass = this.GetWndNode("sp_seat0" + uiPos + "/pass");
        pass.active = false;
        let typeNode = cc.find(`outCardList${uiPos}_cardType`, this.node);
        typeNode.getComponent(cc.Sprite).spriteFrame = null;
    },
    //开始倒计时
    StartTickTime: function(dataPos, runWaitSec = 0, second = this.Define.MaxTickTime) {

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
            let clientCards = this.LogicPDKGame.GetHandCard();
            let opCardType = this.LogicPDKGame.GetLastCardType();
            if (opCardType > 0 && clientCards.length == 1) {
                let array = this.LogicPDKGame.GetTipCard();
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
                this.scheduleOnce(function() {
                    this.Click_btn_outCard();
                }, 1);
            }
        }
        this.tick = second - runWaitSec;
        if(this.tick <= 0){
            return
        }
        let uiPos = this.RoomPosMgr.GetUIPosByDataPos(dataPos);
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
    CallEverySecond: function() {
        //this.SoundManager.PlaySound("timeUp");
        this.tick--;
        this.clock.getChildByName("num").getComponent(cc.Label).string = this.tick;
        if (this.tick <= 0) {
            this.unschedule(this.CallEverySecond);
            this.clock.active = false;
            if (this.notUp) {
                this.Click_btn_pass();
            }
        } else if (this.tick <= 3) {
            this.clock.getComponent(cc.Animation).play();
        }
    },

    //显示提示和出牌按钮
    ShowBtnTipAndOutCard: function() {
        this.ShowAllGameBtn();
        this.btn_tip.getComponent(cc.Button).interactable = true;
        this.btn_outCard.getComponent(cc.Button).interactable = false;
        this.btn_pass.getComponent(cc.Button).interactable = false;
        this.canOutCard();
        return;
        //old
        this.gameBtn.active = true;
        this.btn_tip.x = -120;
        this.btn_tip.active = true;
        // this.btn_pass.getChildByName("icon").getComponent(cc.Label).string = '不要';
        this.btn_outCard.x = 120;
        this.btn_outCard.active = true;
        this.btn_pass.active = false;
        //
    },
    //显示所有按钮
    ShowAllGameBtn: function() {
        this.gameBtn.active = true;
        this.btn_pass.x = -252;
        this.btn_pass.active = true;
        this.btn_tip.x = 0;
        this.btn_tip.active = true;
        // this.btn_pass.getChildByName("icon").getComponent(cc.Label).string = '不要';
        this.btn_outCard.x = 252;
        this.btn_outCard.active = true;
        //new
        this.btn_tip.getComponent(cc.Button).interactable = true;
        this.btn_outCard.getComponent(cc.Button).interactable = false;
        this.btn_pass.getComponent(cc.Button).interactable = true;
        //没有牌大过上家
        cc.find('img_mask_pk', this.node).active = false;
    },

    HideAllGameBtn: function() {
        this.gameBtn.active = false;
        this.btn_pass.active = false;
        this.btn_tip.active = false;
        this.btn_outCard.active = false;
        //没有牌大过上家
        cc.find('img_mask_pk', this.node).active = false;
    },

    HideAllBsNode: function() {},

    //只显示出牌按钮
    ShowBtnOutCard: function() {
        this.ShowAllGameBtn();
        this.btn_tip.getComponent(cc.Button).interactable = false;
        this.btn_outCard.getComponent(cc.Button).interactable = false;
        this.btn_pass.getComponent(cc.Button).interactable = false;
        this.canOutCard();
        return;
        //old
        this.gameBtn.active = true;
        this.btn_pass.active = false;
        this.btn_tip.active = false;
        this.btn_outCard.x = 0;
        this.btn_outCard.active = true;
    },
    //只显示不要按钮
    ShowBtnPass: function() {
        this.ShowAllGameBtn();
        this.btn_tip.getComponent(cc.Button).interactable = false;
        this.btn_outCard.getComponent(cc.Button).interactable = false;
        this.btn_pass.getComponent(cc.Button).interactable = true;
        //没有牌大过上家
        cc.find('img_mask_pk', this.node).active = true;
        return;
        //old
        this.gameBtn.active = true;
        this.btn_pass.x = 0;
        this.btn_pass.active = true;
        // this.btn_pass.getChildByName("icon").getComponent(cc.Label).string = '要不起';
        this.btn_tip.active = false;
        this.btn_outCard.active = false;
    },

    StartGame: function(opPos) {
        //检查玩家手牌start
        this.CheckShouPai();
        let firstOpCard = this.RoomSet.GetRoomSetProperty("firstOpCard");
        this.lastCircleEnd = this.RoomSet.GetRoomSetProperty("isFirstOp");
        //是否显示黑桃3
        let uiPos = this.RoomPosMgr.GetUIPosByDataPos(opPos);
        if (uiPos != 0 && !this.robSuccess) {
            // let poker_back = this.GetWndNode("sp_seat0" + uiPos + "/card/poker_back");
            // poker_back.active = false;
            // this.ShowCard(firstOpCard, poker_back.parent, true);
        }

        let secTotal= this.RoomSet.GetSecTotal();
        if (opPos == this.RoomPosMgr.GetClientPos()) {
            if (this.Room.GetRoomWanfa(this.Define.SEVER_FIRST3) && !this.robSuccess) {
                this.ShowBtnTipAndOutCard();
            } else {
                this.ShowBtnTipAndOutCard();
            }
            
             //是否执行房间限时时间
            this.GetUICardComponentByPos(this.RoomPosMgr.GetClientPos()).ShowUseTime(secTotal);
            this.GetUICardComponentByPos(this.RoomPosMgr.GetClientPos()).SetTimeOpen(true);
        }else{
            this.GetUICardComponentByPos(this.RoomPosMgr.GetClientPos()).ShowUseTime(secTotal);
        }
        let time = this.GetClockTime();
        let runWaitSec = this.RoomSet.GetRoomSetProperty("runWaitSec");
        this.StartTickTime(opPos, runWaitSec, time);
        //方块3去处
        this.fk3GoWhere();
    },

    ChooseDouble: function() {
        let runWaitSec = this.RoomSet.GetRoomSetProperty("runWaitSec");
        //this.allCards.active = false;
        if (this.Room.GetRoomWanfa(this.Define.SEVER_MINGCARD)) {
            this.btn_openCard.active = false;
        }

        //是否有加倍玩法
        if (this.Room.GetRoomWanfa( /*this.Define.DOUBLE*/ -1)) {
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

        if (this.Room.GetRoomWanfa( /*this.Define.DOUBLE*/ -1) && this.Room.GetRoomWanfa(this.Define.SEVER_ROBDOOR)) {
            this.gameMultiple.x = -75;
            this.btn_robDoor.x = 385;
        }

        if (this.Room.GetRoomWanfa( /*this.Define.DOUBLE*/ -1) || this.Room.GetRoomWanfa(this.Define.SEVER_ROBDOOR)) {
            this.StartTickTime(this.RoomPosMgr.GetClientPos(), runWaitSec, 15);
        }
    },

    isFk3: function() {
        //是否每局先出黑桃3
        if (this.Room.GetRoomWanfa(this.Define.SEVER_FIRST3) && this.firstTurn) {
            return true;
        }
        //是否首局先出黑桃3
        let roomSetID = this.Room.GetRoomProperty("setID");
        if (this.Room.GetRoomWanfa(this.Define.SEVER_SHOUJUFIRST3) && this.firstTurn && roomSetID == 1) {
            return true;
        }
        return false;
    },

    fk3Start: function() {
        if (!this.isFk3()) return;
        this.fk3.active = true;
        this.fk3.setPosition(0, -60);
        this.fk3.setScale(0.7);
        this.fk3.getComponent(cc.Animation).play('fk3');
    },

    fk3MoveOver: function() {
        if (!this.isFk3()) return;
        let dataPos = this.RoomSet.GetRoomSetProperty("opPos");
        let uiPos = this.RoomPosMgr.GetUIPosByDataPos(dataPos);
        cc.find(`sp_seat0${uiPos}/img_wxc`, this.node).getComponent(cc.Animation).play();
        //
        this.fk3.active = false;
    },

    fk3GoWhere: function() {
        if (!this.isFk3()) return;
        this.fk3.getComponent(cc.Animation).stop();
        let dataPos = this.RoomSet.GetRoomSetProperty("opPos");
        let uiPos = this.RoomPosMgr.GetUIPosByDataPos(dataPos);
        let playerNode = cc.find(`sp_seat0${uiPos}`, this.node);
        let playerHead = cc.find('head', playerNode);
        let movePos = cc.v2(playerNode.x + playerHead.x, playerNode.y + playerHead.y);
        let moveAction = cc.moveTo(0.15, movePos);
        let scaleAction = cc.scaleTo(0.15, 0.2);
        let spawnAction = cc.spawn(moveAction, scaleAction);
        let self = this;
        let action = cc.sequence(
            spawnAction,
            cc.callFunc(self.fk3MoveOver, self)
        );
        this.fk3.runAction(action);
    },
    CheckShouPai: function() {
        let clientCards = this.LogicPDKGame.GetHandCard();
        let count = 0;
        for (let i = 0; i < clientCards.length; i++) {
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
    FaPaiFinish: function() {
        this.RoomMgr.SendFaPaiFinish(this.RoomPosMgr.GetClientPos());
        //检查手牌长度
        this.CheckShouPai();
    },
    SortCardByMax: function(pokers) {
        let self = this;
        pokers.sort(function(a, b) {
            //return (b&0x0F) - (a&0x0F);
            return self.GetCardValue(b) - self.GetCardValue(a);
        });
    },
    //获取牌值
    GetCardValue: function(poker) {
        let realPoker = 0;
        if (poker > 500) {
            realPoker = poker - 500;
        } else {
            realPoker = poker;
        }
        return realPoker & 0x0F;
    },
    //发牌动作
    FaPaiAction: function(dataPos) {
        let handCards = this.RoomSet.GetHandCard();
        this.SortCardByMax(handCards);
        let uiPos = this.RoomPosMgr.GetUIPosByDataPos(dataPos);
        this.handCards.active = true;
        let baseTime = 0;
        for (let i = 0; i < handCards.length; i++) {
            let cardValue = handCards[i];
            let cardNode = this.handCards.getChildByName("card_" + (i + 1).toString());
            baseTime = baseTime + 0.03;
            this.scheduleOnce(function() {
                cardNode.active = true;
                this.ShowCard(cardValue, cardNode, true);
            }, baseTime);
            if (i == handCards.length - 1) {
                baseTime = baseTime + 0.3; //发牌结束事件
                this.scheduleOnce(function() {
                    this.FaPaiFinish();
                }, baseTime);
            }
        }
    },
    //显示poker牌
    ShowCard: function(cardType, cardNode, isLastCard) {
        let realValue = 0;
        if (cardType > 500) {
            realValue = cardType - 500;
        } else {
            realValue = cardType;
        }
        this.PokerCard.GetPokeCard(realValue, cardNode, isLastCard, undefined, undefined, undefined, undefined, true);
        cardNode.active = true;
        cardNode.getChildByName("poker_back").active = false;
        let clientPos = this.RoomPosMgr.GetClientPos();
        let setInfo = this.RoomSet.GetRoomSetInfo();
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
        let room = this.RoomMgr.GetEnterRoom();
        if(!room || !cardNode.getChildByName("tag")) return
        let kexuanwanfa = room.GetRoomConfigByProperty('kexuanwanfa');
        if(!kexuanwanfa || !kexuanwanfa.length) return
        cardNode.getChildByName("tag").active = (realValue == 0x2A && kexuanwanfa.indexOf(24) > -1)
    },

    AddCardAction: function(dataPos) {
        let uiPos = this.RoomPosMgr.GetUIPosByDataPos(dataPos);
        let wndNode = this.GetWndNode("sp_seat0" + uiPos + "/cardNum");
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
    OnTouchStart: function(event) {
        this.isChoose = this.isCanChoose();
        this.moveIndex = -1;
        this.lastMoveIndex = -1;
        let moveX = event.target.convertToNodeSpaceAR(event.touch.getLocation()).x;
        let downList = this.LogicPDKGame.GetHandCard();
        for (let i = 0; i < this.handCards.children.length; i++) {
            if (this.handCards.children[i].name.startsWith("card")) {
                let minX = this.handCards.children[i].x - this.handCards.children[i].width / 2;
                let maxX = minX + this.cardSpcedX;
                if (i == downList.length - 1)
                    maxX = minX + this.handCards.children[i].width;
                if (moveX >= minX && moveX < maxX) {
                    this.startIndex = i;
                    this.handCards.children[i].getChildByName("bg_black").active = true;
                    break;
                }
            }
        }
    },

    OnTouchMove: function(event) {
        let moveX = event.target.convertToNodeSpaceAR(event.touch.getLocation()).x;
        for (let i = 0; i < this.handCards.children.length; i++) {
            if (this.handCards.children[i].name.startsWith("card")) {
                if (this.handCards.children[i].touchTag == false || typeof(this.handCards.children[i].touchTag) == "undefined") {
                    this.handCards.children[i].getChildByName("bg_black").active = false;
                }

                let minX = this.handCards.children[i].x - this.handCards.children[i].width / 2;
                let maxX = minX + this.cardSpcedX;
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
        if (this.startIndex > this.moveIndex) { //从右往左
            console.log("从右往左");
            for (let i = this.startIndex; i >= this.moveIndex; i--) {
                if (this.handCards.children[i].name.startsWith("card")) {
                    if (this.handCards.children[i].touchTag) {
                        continue;
                    }
                    this.handCards.children[i].getChildByName("bg_black").active = true;
                }
            }
        } else { //从左往右
            if (this.lastMoveIndex > this.moveIndex) {
                if (this.handCards.children[this.lastMoveIndex].name.startsWith("card")) {
                    if (!this.handCards.children[this.lastMoveIndex].touchTag) {
                        this.handCards.children[this.lastMoveIndex].getChildByName("bg_black").active = false;
                    }
                }
            }
            for (let i = this.startIndex; i <= this.moveIndex; i++) {
                if (this.handCards.children[i].name.startsWith("card")) {
                    if (this.handCards.children[i].touchTag) {
                        continue;
                    }
                    this.handCards.children[i].getChildByName("bg_black").active = true;
                }
            }
        }
    },

    OnTouchEnd: function(event) {

        let moveX = event.target.convertToNodeSpaceAR(event.touch.getLocation()).x;
        let downList = this.LogicPDKGame.GetHandCard();
        for (let i = 0; i < this.handCards.children.length; i++) {
            if (this.handCards.children[i].name.startsWith("card")) {
                if (this.handCards.children[i].touchTag) {
                    this.handCards.children[i].getChildByName("bg_black").active = true;
                } else {
                    this.handCards.children[i].getChildByName("bg_black").active = false;
                }
                if (isEnd) continue;
                let isEnd = false;
                let minX = this.handCards.children[i].x - this.handCards.children[i].width / 2;
                let maxX = minX + this.cardSpcedX;
                if (i == downList.length - 1)
                    maxX = minX + this.handCards.children[i].width;
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
            if (this.startIndex > this.endIndex) { //从右往左
                for (let i = this.startIndex; i >= this.endIndex; i--) {
                    if (this.handCards.children[i].touchTag)
                        continue
                    if (this.handCards.children[i].active)
                        this.Click_card(this.handCards.children[i]);
                }
            } else { //从左往右
                for (let i = this.startIndex; i <= this.endIndex; i++) {
                    if (this.handCards.children[i].touchTag)
                        continue
                    if (this.handCards.children[i].active)
                        this.Click_card(this.handCards.children[i]);
                }
            }
        }
        if (this.isChoose == true) {
            let cardArray = this.LogicPDKGame.GetTipCardSlCard();
            if (cardArray.length > 0) {
                this.LogicPDKGame.ChangeSelectCard(cardArray[0]);
                this.Event_ShowHandCard();
            }
        }
        this.canOutCard();
    },

    OnTouchCancel: function(event) {
        // for (let i = 0; i < this.handCards.children.length; i++) {
        //     if (this.handCards.children[i].name.startsWith("card")) {
        //         if (this.handCards.children[i].touchTag)
        //             continue
        //         this.handCards.children[i].getChildByName("bg_black").active = false;
        //     }
        // }
        this.endIndex = -1;
        let moveX = event.target.convertToNodeSpaceAR(event.touch.getLocation()).x;
        let downList = this.LogicPDKGame.GetHandCard();
        for (let i = 0; i < this.handCards.children.length; i++) {
            if (this.handCards.children[i].name.startsWith("card")) {
                if (this.handCards.children[i].touchTag) {
                    this.handCards.children[i].getChildByName("bg_black").active = true;
                } else {
                    this.handCards.children[i].getChildByName("bg_black").active = false;
                }
                if (isEnd) continue;
                let isEnd = false;
                let minX = this.handCards.children[i].x - this.handCards.children[i].width / 2;
                let maxX = minX + this.cardSpcedX;
                if (i == downList.length - 1)
                    maxX = minX + this.handCards.children[i].width;
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
            if (this.startIndex > this.endIndex) { //从右往左
                for (let i = this.startIndex; i >= this.endIndex; i--) {
                    if (this.handCards.children[i].touchTag)
                        continue
                    if (this.handCards.children[i].active)
                        this.Click_card(this.handCards.children[i]);
                }
            } else { //从左往右
                for (let i = this.startIndex; i <= this.endIndex; i++) {
                    if (this.handCards.children[i].touchTag)
                        continue
                    if (this.handCards.children[i].active)
                        this.Click_card(this.handCards.children[i]);
                }
            }
        }
        if (this.isChoose == true) {
            let cardArray = this.LogicPDKGame.GetTipCardSlCard();
            if (cardArray.length > 0) {
                this.LogicPDKGame.ChangeSelectCard(cardArray[0]);
                this.Event_ShowHandCard();
            }
        }
        this.canOutCard();
    },

    canOutCard: function() {
        let cardList = this.LogicPDKGame.GetSelectCard();
        let checkCount = 0;
        for (let i = 0; i < this.handCards.children.length; i++) {
            let cardNode = this.handCards.children[i];
            if (cardNode.active == true && cardNode.y == this.Define.MaxRisePosY) {
                checkCount++;
            }
        }

        if (cardList.length != checkCount) {
            //选中的牌跟存储的牌不一样，
            this.ReInRoom();
            return;
        }

        let opCardType = this.LogicPDKGame.GetCardType();
        console.log('选择的牌型为', opCardType);
        if (opCardType > 0) {
            //TODO:此处判断待优化
            if (!cc.find('img_mask_pk', this.node).active) {
                this.btn_outCard.getComponent(cc.Button).interactable = true;
                return;
            } else {
                console.log('没有大过上家的牌标志');
            }
        }
        this.btn_outCard.getComponent(cc.Button).interactable = false;
    },

    Click_card: function(clickNode) {
        let name = "";
        name = clickNode.name;
        let cardIdx = name.substring(5, name.length);
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
    AddHead: function() {
        this.ClearHead();
        //初始化加入头像 如果已经有加入了头像 显示出来
        let posList = this.RoomMgr.GetEnterRoom().GetRoomProperty("posList");
        let playerCount = posList.length;
        for (let idx = 0; idx < posList.length; idx++) {
            let uiPos = this.RoomPosMgr.GetUIPosByDataPos(posList[idx].pos);
            let path = "sp_seat0" + uiPos.toString() + "/head";
            let node = this.GetWndNode(path);
            if (!node.getChildByName("LPUIPublicHead" + uiPos)) {
                let head = cc.instantiate(this.headPrefab);
                node.addChild(head);
                let headScript = head.getComponent(app.subGameName + "_LPUIPublicHead");
                headScript.Init(uiPos, posList[idx].pos, cc.v2(0, 0), this.Left[uiPos]);
            } else {
                let headNode = node.getChildByName("LPUIPublicHead" + uiPos);
                let headScript = headNode.getComponent(app.subGameName + "_LPUIPublicHead");
                headScript.Init(uiPos, posList[idx].pos, cc.v2(0, 0), this.Left[uiPos]);
            }
        }
    },

    ClearHead: function() {
        for (let idx = 0; idx < this.Define.MaxPlayer; idx++) {
            let path = "sp_seat0" + idx + "/head" + "/LPUIPublicHead" + idx;
            let node = this.GetWndNode(path);
            if (node) {
                let headScript = node.getComponent(app.subGameName + "_LPUIPublicHead");
                headScript.OnClose();
            }
            if (idx > 0) {
                let seat = cc.find(`sp_seat0${idx}`, this.node);
                seat.getChildByName('card').active = false;
                seat.getChildByName('cardNum').active = false;
                seat.getChildByName('clock').active = false;
                seat.getChildByName('pass').active = false;
                let head = cc.find(`sp_seat0${idx}/head`, this.node);
                head.removeAllChildren();
            }
        }
    },

    OnClose: function() {
        this.HideAll();
        this.ClearHead();
        this.unscheduleAllCallbacks();
    },

    InitGameStateCommon: function() {
        let setInfo = this.RoomSet.GetRoomSetInfo();
        //得到玩家自己的手牌
        this.handCards.active = true;
        this.LogicPDKGame.InitHandCard();
        this.Event_ShowHandCard();
        let playerAll = this.RoomPosMgr.GetRoomAllPlayerInfo();
        let playerAllList = Object.keys(playerAll);
        for (var i = 0; i < playerAllList.length; i++) {
            let player = playerAll[playerAllList[i]];
            for (let j = 0; j < setInfo.posInfo.length; j++) {
                let info = setInfo.posInfo[j];
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

    OnShow: function() {
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
        //初始化邀请在线好友的数据
        let roomID = this.RoomMgr.GetEnterRoomID();
        this.roomCfg = this.Room.GetRoomConfig();
        if (this.roomCfg.clubId > 0 || this.roomCfg.unionId > 0) {
            this.invitationNode.active = true;
            this.invitationNode.getComponent(this.invitationNode.name).InitData(this.roomCfg.clubId, this.roomCfg.unionId, roomID);
        } else {
            this.invitationNode.active = false;
        }

        this.btn_look_wanfa = cc.find('btn_look_wanfa', this.node);
        this.fk3 = cc.find('fk3', this.node);
        this.fk3.active = false;
        app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "GetRoomID", {}, function(event) {
            if (event.roomID <= 0 || event.roomID != roomID) {
                app[app.subGameName + "Client"].ExitGame();
            }
        }, function(error) {
            app[app.subGameName + "Client"].ExitGame();
        });
        let GameBg = this.LocalDataManager.GetConfigProperty("SysSetting", app.subGameName + "_GameBg");
        this.ChangeBg(GameBg);
        this.AddHead();
        this.HideAll();
        this.unscheduleAllCallbacks();
        this.LocalDataManager.SetConfigProperty("SysSetting","GameBackMusic","gameBackGround");
        let GameBackMusic=this.LocalDataManager.GetConfigProperty("SysSetting","GameBackMusic");
        this.SceneManager.PlayMusic(GameBackMusic);
        this.SceneManager.StopSceneMusic();
        this.InitData();
        this.ClearForbiddenTouch();
        //设置牌间距
        let aw = cc.find('Canvas').width;
        let ah = cc.find('Canvas').height;
        const srcWH = 1360 / 760;
        let curWH = aw / ah;
        let destScale = curWH / srcWH;
        let unDestScale = srcWH / curWH;
        //
        let spaceX = -85 * unDestScale;
        this.handCards.getComponent(cc.Layout).spacingX = spaceX;

        let cardNodeWidth = this.cardPrefab.data.width;
        this.cardSpcedX = cardNodeWidth + spaceX;

        let state = this.RoomSet.GetRoomSetProperty("state");
        let disslove = this.Room.GetRoomProperty("dissolve");
        let roomState = this.Room.GetRoomProperty("state");
        let setID = this.Room.GetRoomProperty("setID");
        let current = this.Room.GetRoomConfigByProperty("setCount");
        let fangjian = this.Room.GetRoomConfigByProperty("fangjian");

        //显示房间信息
        this.labeiWanfa.string = this.WanFa(undefined, 1);
        if (app[app.subGameName + "_ShareDefine"]().isCoinRoom) {
            this.roomInfo.active = false;
        } else {
            this.roomInfo.active = true;
            this.labelRoomId.string = "房号：" + this.Room.GetRoomProperty("key");
            this.lb_jushu.string = "局数：" + setID + "/" + current;
        }

        //显示时间和电量
        this.schedule(() => {
            const dateE = new Date();
            const dian = cc.sys.getBatteryLevel();
            let hours = dateE.getHours();
            let minutes = dateE.getMinutes();
            this.lb_time.string = `${hours < 10 ? ('0' + hours) : hours}:${minutes < 10 ? ('0' + minutes) : minutes}`;
            this.lb_dianLiang.string = Math.floor(dian * 100) + '%';
            this.pro_dianLiang.progress = dian;
        }, 1);

        let playerAll = this.Room.GetRoomPosMgr().GetRoomAllPlayerInfo();
        let playerAllList = Object.keys(playerAll);
        let joinPlayerCount = playerAllList.length;
        if (fangjian.length == 0) {
            this.btn_change.active = false;
        } else {
            if (setID == 0 && joinPlayerCount == 3) {
                this.btn_change.active = true;
            } else {
                this.btn_change.active = false;
            }
        }
        if (typeof(disslove) != "undefined") {
            if (disslove) {
                let posAgreeList = disslove.posAgreeList;
                if (0 != posAgreeList.length) {
                    this.FormManager.ShowForm(app.subGameName + "_UIMessage02");
                }
            }
        }

        if (roomState != this.ShareDefine.RoomState_Init) {
            this.btn_look_wanfa.active = false;
            let setInfo = this.RoomSet.GetRoomSetInfo();
            //如果有玩家托管  显示托管图标
            let posList = this.Room.GetRoomProperty("posList");

            for (let i = 0; i < posList.length; i++) {
                let data = posList[i];
                let pos = data['pos'];
                let isAuto = data['trusteeship'];
                if (isAuto) {
                    let headScript = this.GetUICardComponentByPos(pos);
                    headScript.ShowAutoIcon(isAuto);
                }
                if (pos == this.RoomPosMgr.GetClientPos() && isAuto) {
                    let secTotal= this.RoomSet.GetSecTotal()
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
                let time = this.GetClockTime();
                let runWaitSec = setInfo.runWaitSec;
                this.lastCircleEnd = setInfo.isFirstOp;
                this.firstTurn = setInfo.isFirstOp;
                if (setInfo.opPos == this.RoomPosMgr.GetClientPos()) {
                    //是否执行房间限时时间
                     this.ScheduleTime(setInfo.opPos);
                    if (setInfo.isFirstOp) {
                        if (this.Room.GetRoomWanfa(this.Define.SEVER_FIRST3)) {
                            this.ShowBtnTipAndOutCard();
                        } else {
                            this.ShowBtnTipAndOutCard();
                        }
                    } else {
                        if (setInfo.opType == 0) {
                            this.ShowBtnTipAndOutCard();
                        } else {
                            let array = this.LogicPDKGame.GetTipCard();
                            this.ForbiddenTouch(array);
                            if (!array.length) {
                                if (this.isAutoPass()) {
                                    // this.ShowSysMsg(app.subGameName.toUpperCase() + "_PASS");
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
                    let firstOpCard = this.RoomSet.GetRoomSetProperty("firstOpCard");
                    //是否显示黑桃3
                    let uiPos = this.RoomPosMgr.GetUIPosByDataPos(setInfo.opPos);
                    if (setInfo.isFirstOp) { //&& setInfo.robCloseVic.pos == -1
                        // let poker_back = this.GetWndNode("sp_seat0" + uiPos + "/card/poker_back");
                        // poker_back.active = false;
                        // this.ShowCard(firstOpCard, poker_back.parent, true);
                    }
                }
                this.ShowOutCard(setInfo.lastOpPos, setInfo.cardList, setInfo.opType);
                this.SetSeat01OutCardPos(setInfo.lastOpPos, setInfo.cardList.length);
                this.StartTickTime(setInfo.opPos, runWaitSec, time);
            } else if (state == this.ShareDefine.SetState_End) {
                //如果玩家已经准备则不显示结算界面
                let clientPos = this.RoomPosMgr.GetClientPos();
                let clientPlayerInfo = this.RoomPosMgr.GetPlayerInfoByPos(clientPos);
                if (clientPlayerInfo["gameReady"]) {
                    this.RefreshRoomShow();
                    return;
                }
                let setEnd = this.RoomSet.GetRoomSetProperty("setEnd");
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
             this.labelRoomId.string = "房号："+room.GetRoomProperty("key");
             this.labeiWanfa.string = this.WanFa();
         }*/

    },

    //老版皮肤
    onShowGame1: function() {
        this.labeiWanfa.node.color = cc.color(40, 82, 109);
    },

    //新增皮肤
    onShowGame2: function() {

    },

    ChangeBg: function(GameBgID) {
        GameBgID = parseInt(GameBgID) - 1;
        this.GameBg = GameBgID;
        if (GameBgID) {
            this.onShowGame2();
        } else {
            this.onShowGame1();
        }
    },
    isZhaDanKeCai: function() {
        if (this.Room.GetRoomWanfa(this.Define.SEVER_BMUSTBOMB)) {
            return true;
        }
        return false;
    },
    isAutoPass: function() {
        let room = this.RoomMgr.GetEnterRoom();
        let kexuanwanfa = room.GetRoomConfigByProperty('kexuanwanfa');
        if (kexuanwanfa.length > 0) {
            if (kexuanwanfa.indexOf(26) > -1) {
                return false;
            }
        }
        return true;
    },
    isAutoReady: function() {
        let room = this.RoomMgr.GetEnterRoom();
        let kexuanwanfa = room.GetRoomConfigByProperty('kexuanwanfa');
        if (kexuanwanfa.length > 0) {
            if (kexuanwanfa.indexOf(27) > -1) {
                return false;
            }
        }
        return true;
    },
    IsShowVoice: function() {
        let room = this.RoomMgr.GetEnterRoom();
        let gaoji = room.GetRoomConfigByProperty('gaoji');
        if (gaoji.length > 0) {
            if (gaoji.indexOf(5) > -1) {
                return false;
            }
        }
        return true;
    },
    IsShowChat: function() {
        let room = this.RoomMgr.GetEnterRoom();
        let gaoji = room.GetRoomConfigByProperty('gaoji');
        if (gaoji.length > 0) {
            if (gaoji.indexOf(6) > -1) {
                return false;
            }
        }
        return true;
    },
    InitCardNum: function(pos, count) {
        if (this.RoomPosMgr.GetClientPos() == pos) return;
        let uiPos = this.RoomPosMgr.GetUIPosByDataPos(pos);
        let card = this.GetWndNode("sp_seat0" + uiPos + "/card");
        card.active = true;
        let cardNum = this.GetWndNode("sp_seat0" + uiPos + "/cardNum");
        cardNum.active = true;
        cardNum.active = false;
        cardNum.getComponent(cc.Label).string = count.toString() + '';
        if (this.Room.GetRoomWanfa(this.Define.SEVER_SHOWCARDNUM)) {
            // if(true){//默认显示
            cardNum.active = true;
        }
    },
    GetClockTime: function() {
        let second = 0;
        let xianshi = this.Room.GetRoomXianShi();
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
    ReInRoom: function(room) {
        let roomID = this.RoomMgr.GetEnterRoomID();
        this.RoomMgr.SendGetRoomInfo(roomID);
    },
    ////////////////////////////////show///////////////////////////////////////////
    RefreshRoomShow: function() {
        let room = this.RoomMgr.GetEnterRoom();
        this.ShowPlayerReady(room);
    },

    HideAllZhunBeiLabel: function() {
        let playerAll = this.RoomPosMgr.GetRoomAllPlayerInfo();
        let playerAllList = Object.keys(playerAll);
        for (var i = 0; i < playerAllList.length; i++) {
            let player = playerAll[playerAllList[i]];
            let uiPos = this.RoomPosMgr.GetUIPosByDataPos(player.pos);
            let path = "sp_seat0" + uiPos + "/head" + "/LPUIPublicHead" + uiPos;
            let headNode = this.GetWndNode(path);
            if (!headNode || typeof(headNode) == "undefined") continue;
            let headScript = headNode.getComponent(app.subGameName + "_LPUIPublicHead");
            headScript.setReady(false);
        }
    },

    ShowOrHideZhunbei: function(pos, isShow) {
        let headScript = this.GetUICardComponentByPos(pos);
        headScript.setReady(isShow);
    },

    HidePlayerAllBtn: function() {
        this.btn_ready.active = false;
        this.btn_weixin.active = false;
        this.btn_cancel.active = false;
        this.btn_go.active = false;
        this.invitationNode.active = false;
    },

    HideAllMessage: function() {
        if (this.messageLayer == null) {
            this.messageLayer = cc.find('messageLayer', this.node);
        }
        for (let i = 0; i < this.messageLayer.childrenCount; i++) {
            this.messageLayer.children[i].active = false;
        }
    },

    showHideMessageOfChildrenName: function(childrenName, isShow) {
        if (this.messageLayer == null) {
            this.messageLayer = cc.find('messageLayer', this.node);
        }
        cc.find(childrenName, this.messageLayer).active = isShow;
        if (isShow) {
            cc.find(childrenName, this.messageLayer).getComponent(cc.Animation).stop();
            cc.find(childrenName, this.messageLayer).getComponent(cc.Animation).play();
        }
    },

    HideAll: function() {
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
        this.HideAllMessage();
        this.btn_robDoor.active = false;
        this.btn_notRobDoor.active = false;
        this.btn_openCard.active = false;
    },

    HideAllAni: function() {
        this.plane_Ani.active = false;
        this.boom_Ani.active = false;
        this.dragon_Ani.active = false;
    },

    OnClickForm: function() {
        //        this.FormManager.CloseForm(app.subGameName+"_UIChat");
    },

    OnClick: function(btnName, btnNode) {
        console.log('btnName', btnName, btnNode);
        let roomID = this.Room.GetRoomProperty("roomID");
        let pos = this.RoomPosMgr.GetClientPos();
        let state = this.RoomSet.GetRoomSetProperty("state");
        if (btnName == "btn_go") {
            this.Click_btn_go();
        } else if (btnName == 'btn_look_wanfa' || btnName == 'btn_wanfa_looked' || btnName == 'imgRoomIdDi') {
            cc.find('btn_wanfa_looked', this.node).active = !cc.find('btn_wanfa_looked', this.node).active;
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
        } else if (btnName == "btn_jsfj" || btnName == "btn_exit") {
            //提示退出房间还是查看大厅
            let room = this.RoomMgr.GetEnterRoom();
            let roomCfg = room.GetRoomConfig();
            if (roomCfg.clubId != 0) {
                this.node.getChildByName("tip_exit_node").zIndex = 100;
                this.node.getChildByName("tip_exit_node").active = true;
            } else {
                this.Click_btn_jiesan();
            }
        } else if (btnName == "btn_close_tip") {
            this.node.getChildByName("tip_exit_node").active = false;
        } else if (btnName == "btn_exit_room") {
            this.Click_btn_jiesan();
        } else if (btnName == "btn_go_hall") {
            app[app.subGameName + "Client"].ExitGame(null, '0');
        } else if (btnName == "btn_shuaxin") {
            this.ReInRoom();
        } else if (btnName == "btn_gps") {
            let PlayerCount = this.RoomPosMgr.GetRoomPlayerCount();
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
        } else if (btnName == "btn_setting") {
            this.FormManager.ShowForm(app.subGameName + "_UISetting02");
        } else if (btnName == "btn_change") {
            this.Click_btn_change();
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
    Event_CodeError: function(event) {
        let argDict = event;
        let data = argDict["Result"];
        if (data.Msg == "hei tao san bi chu") {
            this.ShowSysMsg("黑桃三先出");
        } else if(argDict.Code == this.ShareDefine.OpCard_Error){
            //出牌后手牌出错
            this.ReInRoom();
        } else if (argDict.Code == this.ShareDefine.SportsPointNotEnough) {
            this.ShowSysMsg("比赛分不足房间自动解散");
            // this.SetWaitForConfirm("SportsPointNotEnough", this.ShareDefine.ConfirmYN, []);
        } else if (argDict.Code == this.ShareDefine.ApplyDissolve) {
            this.ShowSysMsg("申请解散次数已达上限");
        } else if (argDict.Code == this.ShareDefine.NotAllow) {
            if (this.FormManager.IsFormShow("game/" + app.subGameName.toUpperCase() + "/UI" + app.subGameName.toUpperCase() + "_ResultXY")) {
                this.FormManager.CloseForm("game/" + app.subGameName.toUpperCase() + "/UI" + app.subGameName.toUpperCase() + "_ResultXY");
            }
        }
    },
    Click_btn_jiesan: function() {
        let room = this.RoomMgr.GetEnterRoom();
        if (!room) {
            this.ErrLog("Click_btn_jiesan not enter room");
            return
        }
        let roomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
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

        let state = room.GetRoomProperty("state");
        if (state == this.ShareDefine.RoomState_End) {
            //直接退出到大厅
            app[app.subGameName + "Client"].ExitGame();
            return
        }
        let ClientPos = roomPosMgr.GetClientPos();
        let player = roomPosMgr.GetPlayerInfoByPos(ClientPos);
        if (!player)
            return;
        let posName = player.name;
        let roomID = this.RoomMgr.GetEnterRoomID();
        if (state == this.ShareDefine.RoomState_Playing) {
            let jiesan = room.GetRoomConfigByProperty('jiesan');
            if (jiesan == 4) {
                this.ShowSysMsg("房间不可以解散");
                return;
            }
            // app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID, posName);
            app[app.subGameName + "_ConfirmManager"]().SetWaitForConfirmForm(this.OnConFirm.bind(this), 'MSG_GAME_DissolveRoom', []);
            app[app.subGameName + "_ConfirmManager"]().ShowConfirm(this.ShareDefine.Confirm, 'MSG_GAME_DissolveRoom', []);
            return
        }

        let msgID = '';

        let roomCfg = room.GetRoomConfig();
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
    Click_btn_change: function() {
        let roomID = this.RoomMgr.GetEnterRoomID();
        let that = this;
        app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ChangePlayerNum", {
                "roomID": roomID
            }, function(success) {

            },
            function(error) {
                let msg = error.Msg;
                that.ShowSysMsg(msg);
            });
    },

    Click_btn_tip: function() {
        //是否要先出黑桃3
        let array = this.LogicPDKGame.GetTipCard();
        if (this.firstTurn && this.Room.GetRoomWanfa(this.Define.SEVER_FIRST3) && !this.robSuccess) {
            let firstOpCard = this.RoomSet.GetRoomSetProperty("firstOpCard");
            let value = this.LogicPDKGame.GetCardValue(firstOpCard);
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

    Click_btn_pass: function() {
        let serverPack = {};
        let roomID = this.RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
        serverPack.roomID = roomID;
        let pos = this.RoomPosMgr.GetClientPos();
        serverPack.pos = pos;
        serverPack.opCardType = 1;
        serverPack.cardList = [];
        this.RoomMgr.SendOpCard(serverPack);
    },

    IsDownPosSingleCard: function() {
        let totalNum = -1;
        let playerNum = this.RoomPosMgr.GetPosCount();
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

    GetDownPosCardNum: function(posTag) {
        let clientPos = -1;
        let uiPos = -1;
        if (posTag == 'downPos') {
            clientPos = this.RoomPosMgr.GetClientDownPos();
        } else if (posTag == 'facePos') {
            clientPos = this.RoomPosMgr.GetClientFacePos();
        } else if (posTag == 'upPos') {
            clientPos = this.RoomPosMgr.GetClientUpPos();
        }
        uiPos = this.RoomPosMgr.GetUIPosByDataPos(clientPos);
        let cardNode = this.GetWndNode("sp_seat0" + uiPos + "/cardNum");
        return parseInt(cardNode.getComponent(cc.Label).string);
    },

    Click_btn_outCard: function() {
        console.log("点击打牌按钮");
        //发给服务端的消息
        let serverPack = {};
        let roomID = this.RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
        serverPack.roomID = roomID;
        let pos = this.RoomPosMgr.GetClientPos();
        serverPack.pos = pos;
        let opCardType = this.LogicPDKGame.GetCardType();
        console.log("获取打牌的牌型：" + opCardType, serverPack);
        this.ClientOpCardByType(opCardType, serverPack);
    },

    hideImg_ts_db: function() {
        this.showHideMessageOfChildrenName('img_ts_bd', false);
    },

    ClientOpCardByType: function(opCardType, serverPack, isSelectCard = true) {
        if (opCardType > 0) {
            serverPack.opCardType = opCardType;
            let cardList = [];
            if (isSelectCard) {
                cardList = this.LogicPDKGame.GetSelectCard();
            } else {
                cardList = this.LogicPDKGame.GetHandCard();
            }
            //下家如果只有一张单牌 必须从最大牌出
            if (this.IsDownPosSingleCard()) {
                if (opCardType == 2) {
                    let handeCardList = this.LogicPDKGame.GetHandCard();
                    let aValue = this.LogicPDKGame.GetCardValue(handeCardList[0]);
                    let bValue = this.LogicPDKGame.GetCardValue(cardList[0]);
                    if (bValue != aValue) {
                        // this.ShowSysMsg(app.subGameName.toUpperCase() + "_BAODAN");
                        this.showHideMessageOfChildrenName('img_ts_bd', true);
                        this.unschedule(this.hideImg_ts_db);
                        this.scheduleOnce(this.hideImg_ts_db.bind(this), 2);
                        return;
                    }
                }
            }
            let firstOpCard = this.RoomSet.GetRoomSetProperty("firstOpCard");
            //获取当前局数
            let setID = this.RoomMgr.GetEnterRoom().GetRoomProperty("setID");
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

            if (!this.CheckSelCardListInHandCard(cardList)) {
                app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("请重新选牌", [], 3);
                this.ReInRoom();
                return;
            }
            if (!this.CheckSelCardListOrCardList(cardList) && isSelectCard == true) {
                console.log("CheckSelCardListOrCardList ==", cardList);
                app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("选牌有误，请重新选择", [], 3);
                //手牌回落
                this.LogicPDKGame.ChangeSelectCard([]);
                this.Event_ShowHandCard();
                return;
            }
            serverPack.cardList = cardList;
            serverPack.daiNum = this.LogicPDKGame.GetDaiNum();
            console.log("打出去的牌类型 ==" + serverPack.opCardType, serverPack);
            if (this.outCardPackageVerification(serverPack)) {
                this.RoomMgr.SendOpCard(serverPack);
            } else {
                this.ShowSysMsg('MSG_CANT_OUT');
                this.ReInRoom();
            }
        } else {
            this.ShowSysMsg("MSG_CANT_OUT");
            this.ReInRoom();
        }
    },

    Click_btn_ready: function() {
        let room = this.RoomMgr.GetEnterRoom();
        if (!room) {
            this.ErrLog("Click_btn_ready not enter room");
            return
        }
        let roomID = room.GetRoomProperty("roomID");
        let clientPos = room.GetRoomPosMgr().GetClientPos();
        console.log('roomID', roomID, clientPos);
        app[app.subGameName + "_GameManager"]().SendReady(roomID, clientPos);
    },

    Click_btn_cancel: function() {
        let room = this.RoomMgr.GetEnterRoom();
        if (!room) {
            this.ErrLog("Click_btn_cancel not enter room");
            return
        }
        let roomID = room.GetRoomProperty("roomID");
        let clientPos = room.GetRoomPosMgr().GetClientPos();
        app[app.subGameName + "_GameManager"]().SendUnReady(roomID, clientPos);
    },

    Click_btn_go: function() {
        // let roomID = this.RoomMgr.GetEnterRoomID();
        // this.RoomMgr.SendStartRoomGame(roomID);
    },

    //////////////////////////////////////////////////////////////////////////
    Event_PosReadyChg: function(event) {
        this.RefreshRoomShow();
        let serverPack = event;
        app[app.subGameName + "Client"].OnEvent("Head_PosReadyChg", serverPack);
    },

    Event_RoomEnd: function(event) {
        // this.HideAll();
    },

    OnPack_AutoStart: function(event) {

    },

    //一局开始event
    Event_SetStart: function(event) {
        this.FormManager.CloseForm(app.subGameName + "_UILPPublic_Record");
        this.FormManager.CloseForm(app.subGameName + "_UIPublic_Record");
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
        //从房主开始发牌
        this.fk3Start();
        this.btn_look_wanfa.active = false;
        // let ownerID = this.RoomMgr.GetEnterRoom().GetRoomProperty("ownerID");
        let posInfo = event["setInfo"].posInfo;
        let playerAll = this.RoomPosMgr.GetRoomAllPlayerInfo();
        let playerAllList = Object.keys(playerAll);
        for (var i = 0; i < playerAllList.length; i++) {
            let player = playerAll[playerAllList[i]];
            // if(ownerID == player.pid){
            //     owner = player;
            // }
            let cardsCount = posInfo[i].cards.length;
            this.InitCardNum(player.pos, cardsCount);
        }
        if (this.Room.GetRoomWanfa(this.Define.SEVER_MINGCARD)) {
            this.btn_openCard.active = true;
        }

        let ClientPos = this.RoomPosMgr.GetClientPos();
        this.FaPaiAction(ClientPos);
        this.SetRoomData();
    },
    //更新局数
    SetRoomData: function() {
        let setID = this.Room.GetRoomProperty("setID");
        let current = this.Room.GetRoomConfigByProperty("setCount");
        this.lb_jushu.string = "局数：" + setID + "/" + current;
    },
    //-----------------回调函数------------------------
    Event_ChatMessage: function(event) {
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

        let roomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();

        //敏感词汇替换
        content = this.UtilsWord.CheckContentDirty(content);
        let headScript = this.GetUICardComponentByPos(initiatorPos);
        if (content == "") {
            headScript.ShowFaceContent(path);
        } else {
            headScript.ShowChatContent(content);
        }
    },

    //特效播放结束
    OnEffectEnd: function(wndPath, effectName) {


    },

    InitHeroSex: function(pos) {
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
    Event_PosContinueGame: function(event) {
        // this.HideAll();
        this.HideAllWarning();
        let argDict = event;
        let room = this.RoomMgr.GetEnterRoom();
        if (!room) {
            this.ErrLog("Event_PosContinueGame not enter room");
            return
        }
        let RoomPosMgr = room.GetRoomPosMgr();
        let clientPos = RoomPosMgr.GetClientPos();
        if (argDict["pos"] != clientPos) {
            let clientPlayerInfo = RoomPosMgr.GetPlayerInfoByPos(clientPos);
            // //如果玩家已经继续了,需要渲染其他人的状态
            if (!clientPlayerInfo["gameReady"]) {
                return;
            }
        } else { //如果是自己准备就清理界面
            this.FormManager.CloseForm("game/" + app.subGameName.toUpperCase() + "/UI" + app.subGameName.toUpperCase() + "_ResultXY");
        }
        this.RefreshRoomShow();
    },

    //位置更新
    Event_PosUpdate: function(event) {
        let serverPack = event;
        app[app.subGameName + "Client"].OnEvent('Head_PosUpdate', serverPack);
        this.RefreshRoomShow();
    },

    //位置离开
    Event_PosLeave: function(event) {
        let room = this.RoomMgr.GetEnterRoom();
        if (!room) {
            this.ErrLog("Event_PosLeave not enter room");
            return
        }

        let serverPack = event;
        let pos = serverPack["pos"];

        app[app.subGameName + "Client"].OnEvent('Head_PosLeave', serverPack);

        let clientPos = room.GetRoomPosMgr().GetClientPos();
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
    Event_ExitRoomSuccess: function(event) {
        app[app.subGameName + "Client"].ExitGame();
    },

    HideClientUseTime: function(){
        let clientPos = this.RoomPosMgr.GetClientPos();
        let headScript = this.GetUICardComponentByPos(clientPos);
        headScript.SetTimeOpen(false);
    },
    //限时已用房间限时时间(显示静态)
    ShowUseTime: function(room){
        let clientPos = this.RoomPosMgr.GetClientPos();
        let secTotal = this.RoomSet.GetSecTotal();
        let headScript = this.GetUICardComponentByPos(clientPos);
        headScript.ShowUseTime(secTotal);
    },
    //重新渲染界面后找服务端要实时时间
    ShowUseTimeByInfo: function(room){
        let self = this;
        let roomID = this.RoomMgr.GetEnterRoomID();
        let clientPos = this.RoomPosMgr.GetClientPos();
        app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "GetTime", {"roomID": roomID, "pos": clientPos}, function (event) {
            let headScript = self.GetUICardComponentByPos(clientPos);
            headScript.ShowUseTime(event.secTotal);
        }, function (event) {});
    },
    ScheduleTime: function(pos){
        let self = this;
        let roomID = this.RoomMgr.GetEnterRoomID();
        let clientPos = this.RoomPosMgr.GetClientPos();
        app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "GetTime", {"roomID": roomID, "pos": clientPos}, function (event) {
            let headScript = self.GetUICardComponentByPos(pos);
            headScript.ShowUseTime(event.secTotal);
            headScript.SetTimeOpen(true);
        }, function (event) {});
    },

    //一局结束
    Event_SetEnd: function(event) {
        this.unschedule(this.CallEverySecond);
        this.HideClientUseTime();
        //判断是否被关门
        let setEnd = this.RoomSet.GetRoomSetProperty("setEnd");
        for (let i = 0; i < setEnd.beShutDowList.length; i++) {
            //龙岩伏击没有反关门
            if (setEnd.beShutDowList[i] && i != setEnd.firstOpPos) {
                let uiPos = this.RoomPosMgr.GetUIPosByDataPos(i);
                let ShutDow_Ani = this.GetWndNode("sp_seat0" + uiPos + "/ShutDow_Ani");
                ShutDow_Ani.active = true;
                ShutDow_Ani.getComponent(cc.Animation).play("guanmen");
            }
        }

        this.UpdatePlayerScore();
        //刷新比赛分
        this.UpdatePlayerSportsPoint(event);
        //发送明牌消息
        let roomID = this.Room.GetRoomProperty("roomID");
        let clientPos = this.RoomPosMgr.GetClientPos();
        this.RoomMgr.SendOpenCard(roomID, clientPos, 1);

        let self = this;
        this.scheduleOnce(function() {
            self.FormManager.ShowForm("game/" + app.subGameName.toUpperCase() + "/UI" + app.subGameName.toUpperCase() + "_ResultXY", setEnd);
        }, 2.0);
    },

    //房间解散
    Event_DissolveRoom: function(event) {

        let argDict = event;
        let ownnerForce = argDict["ownnerForce"];

        //未开启房间游戏时才会触发
        if (ownnerForce) {
            let room = this.RoomMgr.GetEnterRoom();
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
            let state = this.RoomMgr.GetEnterRoom().GetRoomProperty("state");
            //如果没有打完一局不会下发roomend,直接显示2次弹框
            if (state != this.ShareDefine.RoomState_End) {
                this.SetWaitForConfirm('DissolveRoom', this.ShareDefine.ConfirmOK);
                this.FormManager.CloseForm(app.subGameName + "_UIMessage02");
            }
            //如果有roomend数据显示 结果界面
            else {
                this.FormManager.CloseForm(app.subGameName + "_UIMessage02");
                this.FormManager.ShowForm(app.subGameName + "_UILPPublic_Record");
            }

        }
    },

    //收到解散房间
    Event_StartVoteDissolve: function(event) {
        this.FormManager.ShowForm(app.subGameName + "_UIMessage02");
    },
    //收到切换人数房间
    Event_ChangePlayerNum: function(event) {
        this.FormManager.ShowForm(app.subGameName + "_UIMessage03");
    },

    UpdatePlayerScore: function() {
        let room = this.RoomMgr.GetEnterRoom();
        let posList = room.GetRoomProperty("posList");
        for (let idx = 0; idx < posList.length; idx++) {
            let uiPos = this.RoomPosMgr.GetUIPosByDataPos(posList[idx].pos);
            let path = "sp_seat0" + uiPos + "/head" + "/LPUIPublicHead" + uiPos;
            let headNode = this.GetWndNode(path);
            if (headNode == null) continue;
            let headScript = headNode.getComponent(app.subGameName + "_LPUIPublicHead");
            headScript.UpDateLabJiFen();
        }
    },
    UpdatePlayerSportsPoint: function(event) {
        let room = this.RoomMgr.GetEnterRoom();
        let posList = room.GetRoomProperty("posList");
        for (let idx = 0; idx < posList.length; idx++) {
            let uiPos = this.RoomPosMgr.GetUIPosByDataPos(posList[idx].pos);
            let path = "sp_seat0" + uiPos + "/head" + "/LPUIPublicHead" + uiPos;
            let headNode = this.GetWndNode(path);
            let headScript = headNode.getComponent(app.subGameName + "_LPUIPublicHead");
            headScript.UpDateLabSportsPoint();
        }
    },

    GetUICardComponentByPos: function(pos) {
        let room = this.RoomMgr.GetEnterRoom();
        if (!room) {
            this.ErrLog("GetUICardComponentByPos not enter room");
            return
        }

        let posList = room.GetRoomProperty("posList");
        for (let idx = 0; idx < posList.length; idx++) {
            if (pos == posList[idx].pos) {
                let uiPos = this.RoomPosMgr.GetUIPosByDataPos(posList[idx].pos);
                let path = "sp_seat0" + uiPos + "/head" + "/LPUIPublicHead" + uiPos;
                let headNode = this.GetWndNode(path);
                if (headNode == null) continue;
                let headScript = headNode.getComponent(app.subGameName + "_LPUIPublicHead");
                return headScript;
            }
        }
    },
    //显示玩家准备状态
    ShowPlayerReady: function(room) {
        if (!room) {
            this.ErrLog("Event_ShowReadyOrNoReady not enter room");
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
    //隐藏玩家准备按钮
    HidePlayerReady: function() {
        this.btn_ready.active = 0;
        this.btn_weixin.active = 0;
        this.btn_go.active = 0;
        this.invitationNode.active = false;
    },
    HideClientReady: function() {
        this.btn_ready.active = false;
        this.btn_weixin.active = false;
        this.btn_go.active = false;
        this.invitationNode.active = false;

    },
    IsClientReady: function(ReadyState) {
        let roomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
        let clientPos = roomPosMgr.GetClientPos();
        let playerAll = roomPosMgr.GetRoomAllPlayerInfo();
        let playerAllList = Object.keys(playerAll);
        for (let i = 0; i < playerAllList.length; i++) {
            let player = playerAll[playerAllList[i]];
            let isClientReady = player[ReadyState];
            if (player["pos"] == clientPos) {
                return isClientReady;
                break;
            }
        }

    },
    JoinPlayerFinish: function() {
        let roomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
        let playerAll = roomPosMgr.GetRoomAllPlayerInfo();
        let playerAllList = Object.keys(playerAll);
        var tempNum = 0;
        for (let j = 0; j < playerAllList.length; j++) {
            let player = playerAll[playerAllList[j]];
            if (player.pid > 0) {
                tempNum++;
            }
        }
        if (tempNum == playerAllList.length) {
            return true;
        }
        return false;
    },
    SetPlayerReadyInfo: function(ReadyState) {
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
    ShowPlayerYaoQing: function() {
        this.btn_ready.active = 0;
        this.btn_weixin.active = 1;
        this.btn_go.active = 0;
        if (this.roomCfg.clubId > 0 || this.roomCfg.unionId > 0) {
            this.invitationNode.active = true;
        } else {
            this.invitationNode.active = false;
        }
    },
    ShowPlayerOk: function() {
        if (this.isAutoReady() == true) {
            this.btn_ready.active = 0;
            this.Click_btn_ready();
        } else {
            this.btn_ready.active = 1;
        }

        this.btn_weixin.active = 0;
        this.btn_go.active = 0;
        this.invitationNode.active = false;
    },
    GetPlayerSex: function(pos) {
        let playerSex = "";
        let player = this.RoomPosMgr.GetPlayerInfoByPos(pos);
        let Sex = player["sex"];
        if (Sex == this.ShareDefine.HeroSex_Boy) {
            playerSex = "b";
        } else if (Sex == this.ShareDefine.HeroSex_Girl) {
            playerSex = "g";
        }
        return playerSex;
    },

    //设置手牌缩放大小
    SetHandCardScale: function(scale) {
        this.handCards.scale = scale;
    },

    /**
     * 2次确认点击回调
     */
    SetWaitForConfirm: function(msgID, type, msgArg = [], cbArg = []) {
        let ConfirmManager = app[app.subGameName + "_ConfirmManager"]();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
        ConfirmManager.ShowConfirm(type, msgID, msgArg);
    },
    OnConFirm: function(clickType, msgID, backArgList) {
        let ClientPos = this.RoomPosMgr.GetClientPos();
        let player = this.RoomPosMgr.GetPlayerInfoByPos(ClientPos);
        let posName = player.name;
        let roomID = this.RoomMgr.GetEnterRoomID();
        if (clickType != "Sure") {
            if (msgID == "SportsPointNotEnough") {
                let roomID = this.RoomMgr.GetEnterRoomID();
                app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID);
            }
            return
        }
        if (msgID == "UIPlay_BeKick") {
            app[app.subGameName + "Client"].ExitGame();
        } else if ('MSG_Room_Change' == msgID) {
            let roomID = this.RoomMgr.GetEnterRoomID();
            let that = this;
            app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ChangePlayerNum", {
                    "roomID": roomID
                }, function(success) {

                },
                function(error) {
                    let msg = error.Msg;
                    that.ShowSysMsg(msg);
                });
        } else if (msgID == "MSG_BeKick" || msgID == "MSG_BeDissolve") {
            app[app.subGameName + "Client"].ExitGame();
        } else if (msgID == "OwnnerForceRoom") {
            app[app.subGameName + "Client"].ExitGame();
        } else if (msgID == "SportsPointThresholdEnough" || msgID == "SportsPointThresholdNotEnough") {
            app[app.subGameName + "Client"].ExitGame();
        } else if (msgID == "MSG_Room_EXIT") {
            this.Click_btn_jiesan();
        } else if (msgID == "DissolveRoom") {
            app[app.subGameName + "Client"].ExitGame();
        } else if (msgID == "SportsPointDissolveRoom") {
            this.FormManager.ShowForm(app.subGameName + "_UILPPublic_Record");
        } else if (msgID == "PlayerLeaveRoom") {
            let roomID = this.RoomMgr.GetEnterRoomID();
            app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID);
        } else if (msgID == "UIMoreTuiChuFangJian") {
            let roomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
            let ClientPos = roomPosMgr.GetClientPos();
            let player = roomPosMgr.GetPlayerInfoByPos(ClientPos);
            if (!player)
                return;
            let posName = player.name;
            let roomID = this.RoomMgr.GetEnterRoomID();
            let state = this.Room.GetRoomProperty("state");
            if (state == this.ShareDefine.RoomState_Playing && player.isPlaying) {
                app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID, posName);
                return
            }
            //房主不能退出房间，只能解散
            if (this.RoomMgr.GetEnterRoom().IsClientIsOwner()) {
                app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID, posName);
                return
            }
            app[app.subGameName + "_GameManager"]().SendExitRoom(roomID, ClientPos);
        } else if (msgID == "MSG_GAME_DissolveRoom") {
            app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID, posName);
        } else {
            this.ErrLog("OnConFirm msgID:%s error", msgID);
        }
    },

    Event_TouchStart: function(event) {
        // this.SysLog("Event_TouchStart");
        if (!this.IsShowVoice()) {
            this.ShowSysMsg("禁止语音");
            return;
        }
        app[app.subGameName + "_AudioManager"]().startRecord();

    },
    Event_TouchEnd: function(event) {
        // this.SysLog("Event_TouchEnd"); 
        this.FormManager.CloseForm(app.subGameName + "_UIAudio");
        app[app.subGameName + "_AudioManager"]().setTouchEnd(true);
        app[app.subGameName + "_AudioManager"]().stopRecord();
    },

    OnEventShow: function() {
        let curTime = new Date().getTime();
        let lostHearTime = app[app.subGameName + "Client"].LostHearTime;
        if (this.outGameTime && curTime > this.outGameTime + 30000) {
            // app[app.subGameName + "Client"].lastHearTime = 0;
            this.outGameTime = 0;
            if (app[app.subGameName + "_NetWork"]().isConnectIng) { //ios的可能websoket不会主动断开
                console.log("后台切回来，先断开连接");
                app[app.subGameName + "_NetManager"]().Disconnect();
            }
            if (!app[app.subGameName + "Client"].bStartReConnect) {
                console.log("后台切回来，发起断线重连");
                app[app.subGameName + "Client"].StartReConnect();
                app[app.subGameName + "_NetWork"]().ReConnectByTipSureBtn();
            }
        } else {
            let roomID = this.RoomMgr.GetEnterRoomID();
            app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ShowLeave", {
                "roomID": roomID,
                "isShowLeave": false
            });

        }
        app[app.subGameName + "Client"].scheduleOnce(function() {
            app[app.subGameName + "Client"].StartTimer();
        }, 2);
    },

    OnEventHide: function() {
        console.log("从游戏内切换后台");
        this.outGameTime = new Date().getTime();
        let roomID = this.RoomMgr.GetEnterRoomID();
        app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ShowLeave", {
            "roomID": roomID,
            "isShowLeave": true
        });
        app[app.subGameName + "Client"].StopTimer();
    },
    //判断选择的牌是否玩家手里的牌
    CheckSelCardListInHandCard: function(selCardList) {
        let handCardListTemp = [];
        for (let i = 0; i < this.LogicPDKGame.handCardList.length; i++) {
            handCardListTemp.push(this.LogicPDKGame.handCardList[i]);
        }
        for (let i = 0; i < selCardList.length; i++) {
            if (handCardListTemp.indexOf(selCardList[i]) >= 0) {
                handCardListTemp.Remove(selCardList[i]);
            } else {
                return false;
            }
        }
        return true;
    },
    // 判断弹起的牌是否跟发送服务端的出牌list一致
    CheckSelCardListOrCardList: function(selCardList) {
        let selHandCardsList = [];
        for (let i = 0; i < this.handCards.children.length; i++) {
            if (this.handCards.children[i].y > 0) {
                let name = this.handCards.children[i].name;
                let cardIdx = name.substring(5, name.length);
                selHandCardsList.push(this.LogicPDKGame.handCardList[cardIdx - 1]);
            }
        }
        for (let i = 0; i < selCardList.length; i++) {
            if (selHandCardsList.indexOf(selCardList[i]) >= 0) {
                selHandCardsList.Remove(selCardList[i]);
            } else {
                return false;
            }
        }
        if (selHandCardsList.length == 0) {
            return true;
        }
        return false;
    },

});