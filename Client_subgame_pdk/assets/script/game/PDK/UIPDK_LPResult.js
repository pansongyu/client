var app = require("pdk_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
        btn_share: cc.Node,
        btn_exit: cc.Node,
        btn_continue: cc.Node,
        sp_winLose: cc.Node,
        win: cc.SpriteFrame,
        lose: cc.SpriteFrame,
        playerList: cc.Node,

        room_Id: cc.Label,
        huifang: cc.Label,
        lb_jushu: cc.Label,
        end_Time: cc.Label,
        room_info: cc.Label,
        room_Double: cc.Label,
        room_MaxDouble: cc.Label,

        btn_sharemore: cc.Node,
        sharemore: cc.Node,
    },

    OnCreateInit: function () {
        this.RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
        this.Room = app[app.subGameName.toUpperCase() + "Room"]();
        this.RoomPosMgr = app[app.subGameName.toUpperCase() + "RoomPosMgr"]();
        this.SoundManager = app[app.subGameName + "_SoundManager"]();
        this.HeroManager = app[app.subGameName + "_HeroManager"]();
        this.RoomSet = app[app.subGameName.toUpperCase() + "RoomSet"]();
        this.ComTool = app[app.subGameName + "_ComTool"]();
        this.SDKManager = app[app.subGameName + "_SDKManager"]();
        this.Define = app[app.subGameName.toUpperCase() + "Define"]();

        this.bigWinner = 0;
    },

    ShowGameResult: function () {
        let room = this.RoomMgr.GetEnterRoom();
        if (!room) {
            this.ErrLog("Event_PosContinueGame not enter room");
            return
        }
        if (!app[app.subGameName + "_ShareDefine"]().isCoinRoom) {
            this.btn_exit.active = false;
        } else {
            this.btn_exit.active = true;
        }

        let setEnd = this.RoomSet.GetRoomSetProperty("setEnd");
        let allPlayer = this.RoomPosMgr.GetRoomAllPlayerInfo();
        let key = this.RoomMgr.GetEnterRoom().GetRoomProperty("key");
        let setId = this.RoomMgr.GetEnterRoom().GetRoomProperty("setID");
        let time = 0;
        let isReconnect = false;
        let pointList = [];
        if (!setEnd) {
            setEnd = {};
            setEnd.posInfo = this.RoomSet.GetRoomSetInfo().posInfo;
            // setEnd.robCloseVic = this.RoomSet.GetRoomSetInfo().robCloseVic;
            // setEnd.reverseRobCloseVic = this.RoomSet.GetRoomSetInfo().reverseRobCloseVic;
            setEnd.roomDoubleList = this.RoomSet.GetRoomSetInfo().roomDoubleList;
            setEnd.firstOpPos = this.RoomSet.GetRoomSetInfo().firstOpPos;
            setId = this.RoomSet.GetRoomSetInfo().setID;
            time = this.RoomSet.GetRoomSetInfo().startTime;
            isReconnect = true;
            for (let i = 0; i < setEnd.posInfo.length; i++) {
                pointList.push(setEnd.posInfo[i].point);
            }
        } else {
            time = setEnd.startTime;
            for (let i = 0; i < setEnd.pointList.length; i++) {
                pointList.push(setEnd.pointList[i]);
            }
        }

        pointList.sort(function (a, b) {
            return b - a;
        });

        this.bigWinner = pointList[0];

        this.ShowResultNormal(allPlayer, setEnd, isReconnect);

        this.room_Id.string = "房间号:" + key;
        this.huifang.string = "回放码:" + setEnd.playBackCode;
        let current = room.GetRoomConfigByProperty("setCount");
        this.lb_jushu.string = app.i18n.t("UIWanFa_setCount", {"current": current, "setCount": setId});
        let sec = Math.round(time / 1000);
        this.end_Time.string = this.ComTool.GetDateYearMonthDayHourMinuteString(sec);
        //房间玩法
        this.room_info.string = this.WanFa();
        //房间倍数
        let temp = '';
        temp = "房间炸弹数:" + setEnd.roomDoubleList;
        this.room_Double.string = temp;
        //房间最大倍数
        this.room_MaxDouble.string = "最大炸弹数:" + this.GetMaxAddDouble();
    },

    GetMaxAddDouble: function () {
        let maxAddDouble = this.Room.GetRoomConfigByProperty('maxAddDouble');
        if (maxAddDouble == 0) {
            return '无限制';
        } else if (maxAddDouble == 1) {
            return '5';
        } else if (maxAddDouble == 2) {
            return '10';
        } else if (maxAddDouble == 3) {
            return '20';
        }
    },

    HideBigWinner: function () {
        for (let i = 1; i < 5; i++) {
            let node = this.GetWndNode("playerList/player" + i + "/icon_win");
            node.active = false;
        }
    },

    HideOwner: function () {
        for (let i = 1; i < 5; i++) {
            let node = this.GetWndNode("playerList/player" + i + "/user_info/fangzhu");
            node.active = false;
        }
    },

    GetCardNum: function () {
        let cardNum = this.Room.GetRoomConfigByProperty("shoupai");
        if (cardNum == 0) {
            //15张牌
            cardNum = this.Define.MidHandCard;
        } else if (cardNum == 1) {
            //16张牌
            cardNum = this.Define.MidHandCardEx;
        } else {
            //24张牌
            cardNum = this.Define.MaxHandCard;
        }

        return cardNum;
    },


    ShowResultNormal: function (allPlayer, setEnd, isReconnect) {
        let playerList = [];//pointList 得分
        for (let idx in allPlayer) {
            playerList.push(allPlayer[idx]);
        }
        //先排序一下
        playerList.sort(function (a, b) {
            return a.pos - b.pos;
        });

        let lastCard = this.GetCardNum();

        let playerNum = playerList.length;

        for (let i = 0; i < playerList.length; i++) {
            let player = playerList[i];

            let path = "playerList/player" + (i + 1).toString();
            let playerNode = this.GetWndNode(path);
            playerNode.active = true;

            if (player.pid == this.RoomMgr.GetEnterRoom().GetRoomProperty("ownerID")) {
                playerNode.getChildByName("user_info").getChildByName("fangzhu").active = true;
            }
            let point = 0;
            if (isReconnect) {
                point = setEnd.posInfo[i].point;
            } else {
                point = setEnd.pointList[i];
            }
            let sportsPoint = 0;
            if (isReconnect) {
                if (typeof (setEnd.posInfo[i].sportsPoint) != "undefined") {
                    if (setEnd.posInfo[i].sportsPoint > 0) {
                        sportsPoint = "+" + setEnd.posInfo[i].sportsPoint;
                    } else {
                        sportsPoint = setEnd.posInfo[i].sportsPoint;
                    }
                }
            } else {
                if (typeof (setEnd.sportsPointList) != "undefined" && typeof (setEnd.sportsPointList[i]) != "undefined") {
                    if (setEnd.sportsPointList[i] > 0) {
                        sportsPoint = "+" + setEnd.sportsPointList[i];
                    } else {
                        sportsPoint = setEnd.sportsPointList[i];
                    }
                }
            }

            //显示胜利或失败图片和音效 
            if (player.pos == this.RoomPosMgr.GetClientPos()) {
                if (point > 0) {
                    this.SoundManager.PlaySound("win");
                    this.sp_winLose.getComponent(cc.Sprite).spriteFrame = this.win;
                    this.SoundManager.PlaySound(app.subGameName + "Result_Win");
                } else {
                    this.SoundManager.PlaySound("fail");
                    this.sp_winLose.getComponent(cc.Sprite).spriteFrame = this.lose;
                    this.SoundManager.PlaySound(app.subGameName + "Result_Lose");
                }
            }

            //玩家分数
            let winNode = playerNode.getChildByName("lb_win_num");
            let loseNode = playerNode.getChildByName("lb_lose_num");
            winNode.active = false;
            loseNode.active = false;

            //新 玩家当局分数
            let winLoseCurPoint = cc.find('newLayer/img_bjf/lb_bjf', playerNode);

            //大赢家
            if (point == this.bigWinner) {
                playerNode.getChildByName("icon_win").active = true;
            }

            if (point > 0) {
                winLoseCurPoint.getComponent(cc.Label).string = "+" + point;
            } else {
                winLoseCurPoint.getComponent(cc.Label).string = point;
            }

            let playerPoint = player.point;
            if (playerPoint > 0) {
                winNode.active = true;
                winNode.getComponent(cc.Label).string = "+" + playerPoint;
            } else {
                loseNode.active = true;
                loseNode.getComponent(cc.Label).string = playerPoint;
            }

            //比赛分消耗
            let lb_sportsPoint = playerNode.getChildByName("lb_sportsPoint");
            let roomCfg = this.Room.GetRoomConfig();
            if (roomCfg.unionId > 0 && sportsPoint) {
                if (sportsPoint > 0) {
                    lb_sportsPoint.getComponent(cc.Label).string = sportsPoint;
                } else {
                    lb_sportsPoint.getComponent(cc.Label).string = sportsPoint;
                }
                lb_sportsPoint.active = true;
            } else {
                lb_sportsPoint.active = false;
            }

            //倍数
            playerNode.getChildByName("lb_beiShu").active = true;
            let beishu = playerNode.getChildByName("lb_beiShu").getComponent(cc.Label);
            let boomNumber = cc.find('newLayer/img_zdf/lb_boom_num', playerNode).getComponent(cc.Label);

            let number = 0;

            if (isReconnect) {
                number = setEnd.posInfo[i].addDouble;
            } else {
                for (let j = 0; j < setEnd.doubleList.length; j++) {
                    if (player.pos == setEnd.doubleList[j].pos) {
                        number = setEnd.doubleList[j].num;
                        break;
                    }
                }
            }

            number <= 0 ? beishu.string = 0 : beishu.string = number;
            boomNumber.string = beishu.string;

            //显示抢关门或者反关门成功失败
            let icon_qgm_win = playerNode.getChildByName("icon_qgm_win");
            let icon_qgm_lose = playerNode.getChildByName("icon_qgm_lose");
            let icon_bfgm = playerNode.getChildByName("icon_bfgm");
            let icon_bgm = playerNode.getChildByName("icon_bgm");
            icon_qgm_win.active = false;
            icon_qgm_lose.active = false;
            icon_bfgm.active = false;
            icon_bgm.active = false;

            //剩余手牌
            playerNode.getChildByName("lb_cardNum1").getComponent(cc.Label).string = "0";
            playerNode.getChildByName("lb_cardNum2").getComponent(cc.Label).string = "0";
            playerNode.getChildByName("lb_cardNum3").getComponent(cc.Label).string = "0";

            if (isReconnect) {
                for (let j = 0; j < setEnd.posInfo[i].surplusCardList.length; j++) {
                    playerNode.getChildByName("lb_cardNum" + (j + 1)).active = true;
                    let cardNum = playerNode.getChildByName("lb_cardNum" + (j + 1)).getComponent(cc.Label);
                    cardNum.string = setEnd.posInfo[i].surplusCardList[j];
                }
                if (setEnd.posInfo[i].beShutDow && i == setEnd.firstOpPos) {
                } else if (setEnd.posInfo[i].beShutDow) {
                    //lb_guanmen.getComponent(cc.Label).string = "被关门";
                    icon_bgm.active = true;
                }

            } else {
                for (let j = 0; j < setEnd.surplusCardList.length; j++) {
                    playerNode.getChildByName("lb_cardNum" + (j + 1)).active = true;
                    let cardNum = playerNode.getChildByName("lb_cardNum" + (j + 1)).getComponent(cc.Label);
                    cardNum.string = setEnd.surplusCardList[j][i];
                }
                if (setEnd.beShutDowList[i] && i == setEnd.firstOpPos) {
                } else if (setEnd.beShutDowList[i]) {
                    icon_bgm.active = true;
                }
            }

            let head = playerNode.getChildByName("user_info").getChildByName("head_img").getComponent(app.subGameName + "_WeChatHeadImage");
            head.ShowHeroHead(player.pid);
            //玩家名字
            let playerName = "";
            playerName = player.name;
            if (playerName.length > app[app.subGameName + "_ShareDefine"]().SubNameLen) {
                playerName = playerName.substring(0, app[app.subGameName + "_ShareDefine"]().SubNameLen) + '...';
            }
            let name = playerNode.getChildByName("user_info").getChildByName("lable_name").getComponent(cc.Label);
            name.string = playerName;

            let id = playerNode.getChildByName("user_info").getChildByName("label_id").getComponent(cc.Label);
            id.string = this.ComTool.GetPid(player["pid"]);
        }
    },

    OnShow: function () {
        this.FormManager.CloseForm(app.subGameName + "_UIChat");
        let juShu = this.Room.GetRoomConfig().setCount;
        let setID = this.RoomMgr.GetEnterRoom().GetRoomProperty("setID");
        if (setID >= juShu && !app[app.subGameName + "_ShareDefine"]().isCoinRoom) {
            this.isEnd = true;
            this.btn_continue.getChildByName("icon").getComponent(cc.Label).string = "总结算";
        } else {
            this.isEnd = false;
            this.btn_continue.getChildByName("icon").getComponent(cc.Label).string = "继续";
        }
        this.HideBigWinner();
        this.HideOwner();
        for (let i = 0; i < this.playerList.children.length; i++) {
            let child = this.playerList.children[i];
            child.active = false;
        }
        this.ShowGameResult();
        //初始化分享
        this.sharemore.active = false;
    },

    OnClick: function (btnName, btnNode) {
        if (btnName == "btn_jixu") {
            if (!this.isEnd) {
                if (app[app.subGameName + "_ShareDefine"]().isCoinRoom) {
                    app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "GoldRoom", {practiceId: app[app.subGameName + "_ShareDefine"]().practiceId}, this.OnSuccess.bind(this), this.OnEnterRoomFailed.bind(this));
                } else {
                    let room = this.RoomMgr.GetEnterRoom();
                    if (!room) {
                        this.ErrLog("Click_btn_ready not enter room");
                        return
                    }
                    let roomID = room.GetRoomProperty("roomID");
                    app[app.subGameName + "_GameManager"]().SendContinueGame(roomID);
                }
            } else {
                this.FormManager.ShowForm(app.subGameName + "_UILPPublic_Record");
                this.CloseForm();
            }

        } else if (btnName == "btn_share") {
            this.Click_btn_Share();
            this.sharemore.active = false;
        } else if (btnName == "btn_ddshare") {
            this.Click_btn_DDShare();
            this.sharemore.active = false;
        } else if (btnName == "btn_xlshare") {
            this.Click_btn_XLShare();
            this.sharemore.active = false;
        } else if (btnName == "btn_sharemore") {
            this.Click_btn_ShareMore();
        } else if (btnName == "btn_closeshare") {
            this.sharemore.active = false;
        } else if (btnName == "btn_out") {
            app[app.subGameName + "_FormManager"]().AddDefaultFormName(app.subGameName + "_UIPractice");
            app[app.subGameName + "Client"].ExitGame();
        } else if (btnName == "btn_xipai") {
            let room = this.SSSRoomMgr.GetEnterRoom();
            if (!room) return;
            let roomID = room.GetRoomProperty("roomID");
            let self = this;
            app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "RommXiPai", {"roomID": roomID});
        }
    },
    Click_btn_Share: function () {
        this.sharemore.active = false;
        this.SDKManager.ShareScreen();
    },
    Click_btn_DDShare: function () {
        this.sharemore.active = false;
        this.SDKManager.ShareScreenDD();
    },
    Click_btn_XLShare: function () {
        this.sharemore.active = false;
        this.SDKManager.ShareScreenXL();
    },
    Click_btn_ShareMore: function () {
        let active = this.sharemore.active;
        if (active == true) {
            this.sharemore.active = false;
        } else {
            this.sharemore.active = true;
        }
    },
    OnSuccess: function (serverPack) {
        let roomID = serverPack.roomID;
        app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "GetRoomInfo", {"roomID": roomID});
        this.CloseForm();
    },

    OnEnterRoomFailed: function (serverPack) {
        app[app.subGameName + "Client"].ExitGame();
    },
});
