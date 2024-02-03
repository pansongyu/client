(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/game/PDK/UIPDK_Result.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'typdkb45-dc01-4600-abdc-03148f4b6375', 'UIPDK_Result', __filename);
// script/game/PDK/UIPDK_Result.js

"use strict";

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
        room_Double: cc.Label,
        room_MaxDouble: cc.Label,

        btn_sharemore: cc.Node,
        sharemore: cc.Node
    },

    OnCreateInit: function OnCreateInit() {
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

    ShowGameResult: function ShowGameResult() {
        var room = this.RoomMgr.GetEnterRoom();
        if (!room) {
            this.ErrLog("Event_PosContinueGame not enter room");
            return;
        }
        if (!app[app.subGameName + "_ShareDefine"]().isCoinRoom) {
            this.btn_exit.active = false;
        } else {
            this.btn_exit.active = true;
        }

        var setEnd = this.RoomSet.GetRoomSetProperty("setEnd");
        var allPlayer = this.RoomPosMgr.GetRoomAllPlayerInfo();
        var key = this.RoomMgr.GetEnterRoom().GetRoomProperty("key");
        var setId = this.RoomMgr.GetEnterRoom().GetRoomProperty("setID");
        var time = 0;
        var isReconnect = false;
        var pointList = [];
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
            for (var i = 0; i < setEnd.posInfo.length; i++) {
                pointList.push(setEnd.posInfo[i].point);
            }
        } else {
            time = setEnd.startTime;
            for (var _i = 0; _i < setEnd.pointList.length; _i++) {
                pointList.push(setEnd.pointList[_i]);
            }
        }

        pointList.sort(function (a, b) {
            return b - a;
        });

        this.bigWinner = pointList[0];

        this.ShowResultNormal(allPlayer, setEnd, isReconnect);

        this.room_Id.string = "房间号:" + key;
        this.huifang.string = "回放码:" + setEnd.playBackCode;
        var current = room.GetRoomConfigByProperty("setCount");
        this.lb_jushu.string = app.i18n.t("UIWanFa_setCount", { "current": current, "setCount": setId });
        var sec = Math.round(time / 1000);
        this.end_Time.string = this.ComTool.GetDateYearMonthDayHourMinuteString(sec);
        //房间倍数
        var temp = '';
        temp = "房间炸弹数:" + setEnd.roomDoubleList;
        this.room_Double.string = temp;
        //房间最大倍数
        this.room_MaxDouble.string = "最大炸弹数:" + this.GetMaxAddDouble();
    },

    GetMaxAddDouble: function GetMaxAddDouble() {
        var maxAddDouble = this.Room.GetRoomConfigByProperty('maxAddDouble');
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

    HideBigWinner: function HideBigWinner() {
        for (var i = 1; i < 5; i++) {
            var node = this.GetWndNode("playerList/player" + i + "/icon_win");
            node.active = false;
        }
    },

    HideOwner: function HideOwner() {
        for (var i = 1; i < 5; i++) {
            var node = this.GetWndNode("playerList/player" + i + "/user_info/fangzhu");
            node.active = false;
        }
    },

    GetCardNum: function GetCardNum() {
        var cardNum = this.Room.GetRoomConfigByProperty("shoupai");
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

    ShowResultNormal: function ShowResultNormal(allPlayer, setEnd, isReconnect) {
        var playerList = [];
        for (var idx in allPlayer) {
            playerList.push(allPlayer[idx]);
        }
        //先排序一下
        playerList.sort(function (a, b) {
            return a.pos - b.pos;
        });

        var lastCard = this.GetCardNum();

        var playerNum = playerList.length;

        for (var i = 0; i < playerList.length; i++) {
            var player = playerList[i];

            var path = "playerList/player" + (i + 1).toString();
            var playerNode = this.GetWndNode(path);
            playerNode.active = true;

            if (player.pid == this.RoomMgr.GetEnterRoom().GetRoomProperty("ownerID")) {
                playerNode.getChildByName("user_info").getChildByName("fangzhu").active = true;
            }
            var point = 0;
            if (isReconnect) {
                point = setEnd.posInfo[i].point;
            } else {
                point = setEnd.pointList[i];
            }
            var sportsPoint = 0;
            if (isReconnect) {
                if (typeof setEnd.posInfo[i].sportsPoint != "undefined") {
                    if (setEnd.posInfo[i].sportsPoint > 0) {
                        sportsPoint = "+" + setEnd.posInfo[i].sportsPoint;
                    } else {
                        sportsPoint = setEnd.posInfo[i].sportsPoint;
                    }
                }
            } else {
                if (typeof setEnd.sportsPointList != "undefined" && typeof setEnd.sportsPointList[i] != "undefined") {
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
            var winNode = playerNode.getChildByName("lb_win_num");
            var loseNode = playerNode.getChildByName("lb_lose_num");
            winNode.active = false;
            loseNode.active = false;

            //大赢家
            if (point == this.bigWinner) {
                playerNode.getChildByName("icon_win").active = true;
            }

            if (point > 0) {
                winNode.active = true;
                winNode.getComponent(cc.Label).string = "+" + point;
            } else {
                loseNode.active = true;
                loseNode.getComponent(cc.Label).string = point;
            }

            //比赛分消耗
            var lb_sportsPoint = playerNode.getChildByName("lb_sportsPoint");
            var roomCfg = this.Room.GetRoomConfig();
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
            var beishu = playerNode.getChildByName("lb_beiShu").getComponent(cc.Label);

            var number = 0;

            if (isReconnect) {
                number = setEnd.posInfo[i].addDouble;
            } else {
                for (var j = 0; j < setEnd.doubleList.length; j++) {
                    if (player.pos == setEnd.doubleList[j].pos) {
                        number = setEnd.doubleList[j].num;
                        break;
                    }
                }
            }

            number <= 0 ? beishu.string = 0 : beishu.string = number;

            //显示抢关门或者反关门成功失败
            var icon_qgm_win = playerNode.getChildByName("icon_qgm_win");
            var icon_qgm_lose = playerNode.getChildByName("icon_qgm_lose");
            var icon_bfgm = playerNode.getChildByName("icon_bfgm");
            var icon_bgm = playerNode.getChildByName("icon_bgm");
            icon_qgm_win.active = false;
            icon_qgm_lose.active = false;
            icon_bfgm.active = false;
            icon_bgm.active = false;

            // let robCloseVic = setEnd.robCloseVic;
            // let reverseRobCloseVic = setEnd.reverseRobCloseVic;

            // if(robCloseVic.pos == player.pos && robCloseVic.pos != -1){
            //     if(setEnd.robCloseVic.num == 1){
            //         icon_qgm_win.active = true;
            //     }
            //     else{
            //         icon_qgm_lose.active = true;
            //     }
            // }

            //剩余手牌
            playerNode.getChildByName("lb_cardNum1").getComponent(cc.Label).string = "0";
            playerNode.getChildByName("lb_cardNum2").getComponent(cc.Label).string = "0";
            playerNode.getChildByName("lb_cardNum3").getComponent(cc.Label).string = "0";
            //血战到底
            // if(this.Room.GetRoomWanfa(this.Define.SEVER_FIGHTEND)){
            //     playerNode.getChildByName("lb_last2").active = false;
            //     playerNode.getChildByName("lb_last3").active = false;
            //     playerNode.getChildByName("lb_cardNum2").active = false;
            //     playerNode.getChildByName("lb_cardNum3").active = false;

            //     if(playerNum >= 3){
            //         playerNode.getChildByName("lb_last2").active = true;
            //         playerNode.getChildByName("lb_cardNum2").active = true;
            //         if(playerNum >= 4){
            //             playerNode.getChildByName("lb_last3").active = true;
            //             playerNode.getChildByName("lb_cardNum3").active = true;
            //         }
            //     }
            // }

            if (isReconnect) {
                for (var _j = 0; _j < setEnd.posInfo[i].surplusCardList.length; _j++) {
                    playerNode.getChildByName("lb_cardNum" + (_j + 1)).active = true;
                    var cardNum = playerNode.getChildByName("lb_cardNum" + (_j + 1)).getComponent(cc.Label);
                    cardNum.string = setEnd.posInfo[i].surplusCardList[_j];
                }
                if (setEnd.posInfo[i].beShutDow && i == setEnd.firstOpPos) {
                    //lb_guanmen.getComponent(cc.Label).string = "被反关门";
                    //icon_bfgm.active = true;
                    // if(robCloseVic.pos == setEnd.firstOpPos && robCloseVic.num != 1){
                    //     //lb_guanmen.getComponent(cc.Label).string = "抢关门失败且被反关门";
                    // }
                } else if (setEnd.posInfo[i].beShutDow) {
                    //lb_guanmen.getComponent(cc.Label).string = "被关门";
                    icon_bgm.active = true;
                }
            } else {
                for (var _j2 = 0; _j2 < setEnd.surplusCardList.length; _j2++) {
                    playerNode.getChildByName("lb_cardNum" + (_j2 + 1)).active = true;
                    var _cardNum = playerNode.getChildByName("lb_cardNum" + (_j2 + 1)).getComponent(cc.Label);
                    _cardNum.string = setEnd.surplusCardList[_j2][i];
                }
                if (setEnd.beShutDowList[i] && i == setEnd.firstOpPos) {
                    //lb_guanmen.getComponent(cc.Label).string = "被反关门";
                    //icon_bfgm.active = true;
                    // if(robCloseVic.pos == setEnd.firstOpPos && robCloseVic.num != 1){
                    //     //lb_guanmen.getComponent(cc.Label).string = "抢关门失败且被反关门";
                    // }
                } else if (setEnd.beShutDowList[i]) {
                    //lb_guanmen.getComponent(cc.Label).string = "被关门";
                    icon_bgm.active = true;
                }
            }

            var head = playerNode.getChildByName("user_info").getChildByName("head_img").getComponent(app.subGameName + "_WeChatHeadImage");
            head.ShowHeroHead(player.pid);
            //玩家名字
            var playerName = "";
            playerName = player.name;
            if (playerName.length > app[app.subGameName + "_ShareDefine"]().SubNameLen) {
                playerName = playerName.substring(0, app[app.subGameName + "_ShareDefine"]().SubNameLen) + '...';
            }
            var name = playerNode.getChildByName("user_info").getChildByName("lable_name").getComponent(cc.Label);
            name.string = playerName;

            var id = playerNode.getChildByName("user_info").getChildByName("label_id").getComponent(cc.Label);
            id.string = this.ComTool.GetPid(player["pid"]);
        }
    },

    OnShow: function OnShow() {
        this.FormManager.CloseForm(app.subGameName + "_UIChat");
        this.RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
        var roomEnd = this.RoomMgr.GetEnterRoom().GetRoomProperty("roomEnd");
        if (!roomEnd) {
            //延迟自动继续
            this.RoomMgr.SendTimeOutContinue();
        }
        var juShu = this.Room.GetRoomConfig().setCount;
        var setID = this.RoomMgr.GetEnterRoom().GetRoomProperty("setID");
        if (setID >= juShu && !app[app.subGameName + "_ShareDefine"]().isCoinRoom) {
            this.isEnd = true;
            this.btn_continue.getChildByName("icon").getComponent(cc.Label).string = "总结算";
        } else {
            this.isEnd = false;
            this.btn_continue.getChildByName("icon").getComponent(cc.Label).string = "继续";
        }
        this.HideBigWinner();
        this.HideOwner();
        for (var i = 0; i < this.playerList.children.length; i++) {
            var child = this.playerList.children[i];
            child.active = false;
        }
        this.ShowGameResult();
        //初始化分享
        this.sharemore.active = false;
    },

    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_jixu") {
            if (!this.isEnd) {
                if (app[app.subGameName + "_ShareDefine"]().isCoinRoom) {
                    app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "GoldRoom", { practiceId: app[app.subGameName + "_ShareDefine"]().practiceId }, this.OnSuccess.bind(this), this.OnEnterRoomFailed.bind(this));
                } else {
                    var room = this.RoomMgr.GetEnterRoom();
                    if (!room) {
                        this.ErrLog("Click_btn_ready not enter room");
                        return;
                    }
                    var roomID = room.GetRoomProperty("roomID");
                    app[app.subGameName + "_GameManager"]().SendContinueGame(roomID);
                }
            } else {
                this.FormManager.ShowForm(app.subGameName + "_UIPublic_Record");
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
            var _room = this.SSSRoomMgr.GetEnterRoom();
            if (!_room) return;
            var _roomID = _room.GetRoomProperty("roomID");
            var self = this;
            app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "RommXiPai", { "roomID": _roomID });
        }
    },
    Click_btn_Share: function Click_btn_Share() {
        this.sharemore.active = false;
        this.SDKManager.ShareScreen();
    },
    Click_btn_DDShare: function Click_btn_DDShare() {
        this.sharemore.active = false;
        this.SDKManager.ShareScreenDD();
    },
    Click_btn_XLShare: function Click_btn_XLShare() {
        this.sharemore.active = false;
        this.SDKManager.ShareScreenXL();
    },
    Click_btn_ShareMore: function Click_btn_ShareMore() {
        var active = this.sharemore.active;
        if (active == true) {
            this.sharemore.active = false;
        } else {
            this.sharemore.active = true;
        }
    },
    OnSuccess: function OnSuccess(serverPack) {
        var roomID = serverPack.roomID;
        app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "GetRoomInfo", { "roomID": roomID });
        this.CloseForm();
    },

    OnEnterRoomFailed: function OnEnterRoomFailed(serverPack) {
        app[app.subGameName + "Client"].ExitGame();
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
        //# sourceMappingURL=UIPDK_Result.js.map
        