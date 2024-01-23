"use strict";
cc._RF.push(module, 'fjssz304-44a1-40d6-ac62-78abf996805a', 'UIFJSSZ_ResultTotal');
// script/game/FJSSZ/ui/UIFJSSZ_ResultTotal.js

"use strict";

var app = require("fjssz_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
        room_Id: cc.Label,
        end_Time: cc.Label,
        lb_jushu: cc.Label,
        resultPrefab01: cc.Prefab,
        resultPrefab02: cc.Prefab,
        layout_player: cc.Node
    },

    OnCreateInit: function OnCreateInit() {
        this.SSSRoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
        this.SSSRoom = app[app.subGameName.toUpperCase() + "Room"]();
        this.SSSRoomPosMgr = app[app.subGameName.toUpperCase() + "RoomPosMgr"]();
        this.ComTool = app[app.subGameName + "_ComTool"]();
        this.HeroManager = app[app.subGameName + "_HeroManager"]();
        this.SDKManager = app[app.subGameName + "_SDKManager"]();
        this.isZhanJi = false;
        this.RegEvent("EVT_CloseDetail", this.CloseForm, this);
    },

    ChangeLayoutType: function ChangeLayoutType(playerlist) {
        this.layout_player.removeAllChildren();
        this.playerCount = playerlist.length;
        if (this.playerCount < 5) {
            this.layout_player.type = cc.Layout.Type.VERTICAL;
        } else {
            this.layout_player.type = cc.Layout.Type.GRID;
        }
    },

    OnShow: function OnShow() {
        var basedata = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var playerlist = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


        app[app.subGameName + "_FormManager"]().CloseForm("UISSS_Result01");

        //假如有托管界面，则关闭
        if (app[app.subGameName + "_GameManager"]().IsAutoPlayIng()) {
            app[app.subGameName + "_GameManager"]().SetAutoPlayIng(false);
            app[app.subGameName + "_FormManager"]().CloseForm("UIAutoPlay");
        }
        if (basedata) {
            this.ChangeLayoutType(playerlist);
            this.SetWndProperty("btn_detail", "active", false);
            this.SetWndProperty("btn_lists/btn_out", "active", false);
            this.SetWndProperty("btn_lists/btn_close", "active", true);
            this.SetWndProperty("btn_lists/btn_pingfenkaiju", "active", false);
            this.SetWndProperty("btn_lists/btn_wolaikaiju", "active", false);
            this.SetWndProperty("btn_lists/btn_dayingjiakaiju", "active", false);
            this.isZhanJi = true;
            this.SetPlayerInfo2(basedata, playerlist);
        } else {
            var room = this.SSSRoomMgr.GetEnterRoom();
            var roomID = room.GetRoomProperty("roomID");
            this.SSSRoomMgr.SendEndRoom(roomID);

            this.SetWndProperty("btn_detail", "active", true);
            this.SetWndProperty("btn_lists/btn_close", "active", false);
            this.SetWndProperty("btn_lists/btn_out", "active", true);
            this.SetWndProperty("btn_lists/btn_pingfenkaiju", "active", false);
            this.SetWndProperty("btn_lists/btn_wolaikaiju", "active", false);
            this.SetWndProperty("btn_lists/btn_dayingjiakaiju", "active", false);
            this.isZhanJi = false;
            this.SetPlayerInfo();
        }
        if (this.ShareDefine.isCoinRoom) {
            //练习场关闭下局开始
            this.SetWndProperty("btn_lists/btn_pingfenkaiju", "active", false);
            this.SetWndProperty("btn_lists/btn_wolaikaiju", "active", false);
            this.SetWndProperty("btn_lists/btn_dayingjiakaiju", "active", false);
        }
    },
    SetPlayerInfo2: function SetPlayerInfo2(basedata, playerList) {
        console.log("SetPlayerInfo2 basedata:", basedata);
        console.log("SetPlayerInfo2 playerList:", playerList);
        this.room_Id.string = "房间号:" + basedata.key;
        var setID = basedata["setId"];
        var ownerID = basedata["ownerID"];
        this.lb_jushu.string = app.i18n.t("UIWanFa_setCount", { "setCount": setID });
        this.end_Time.string = this.ComTool.GetDateYearMonthDayHourMinuteString(basedata['endTime']);

        //let playerList = record["players"];
        var pointList = basedata["countRecords"];

        for (var idx = 0; idx < playerList.length; idx++) {
            var playerNode = null;
            if (this.playerCount > 4) {
                playerNode = cc.instantiate(this.resultPrefab02);
                playerNode.name = "player" + idx;
                playerNode.getChildByName("topTitle").active = false;
                this.layout_player.addChild(playerNode);
                if (idx == 0 || idx == 1) {
                    playerNode.getChildByName("topTitle").active = true;
                }
            } else {
                playerNode = cc.instantiate(this.resultPrefab01);
                playerNode.name = "player" + idx;
                playerNode.getChildByName("topTitle").active = false;
                this.layout_player.addChild(playerNode);
                if (idx == 0) {
                    playerNode.getChildByName("topTitle").active = true;
                }
            }

            var player = playerList[idx];
            var name = player["name"];

            playerNode.getChildByName("user_info").getChildByName("lable_name").getComponent(cc.Label).string = name;

            var pid = player["pid"];
            playerNode.getChildByName("user_info").getChildByName("label_id").getComponent(cc.Label).string = this.ComTool.GetPid(pid);
            playerNode.getChildByName("user_info").getChildByName("head_img").getComponent(app.subGameName + "_WeChatHeadImage").ShowHeroHead(pid);

            //判断房主是谁
            var _ownerID = this.SSSRoom.GetRoomProperty("ownerID");
            if (_ownerID == player.pid) {
                playerNode.getChildByName("user_info").getChildByName("fangzhu").active = true;
            }

            //显示数据
            for (var i = 0; i < pointList.length; i++) {
                var point = pointList[i];
                if (player.pid == point.pid) {
                    if (point.sumPoint >= 0) {
                        playerNode.getChildByName("lb_win_num").active = true;
                        playerNode.getChildByName("lb_win_num").getComponent(cc.Label).string = "+" + point.sumPoint;
                        playerNode.getChildByName("lb_lose_num").active = false;
                    } else {
                        playerNode.getChildByName("lb_lose_num").active = true;
                        playerNode.getChildByName("lb_lose_num").getComponent(cc.Label).string = point.sumPoint;
                        playerNode.getChildByName("lb_win_num").active = false;
                    }

                    playerNode.getChildByName("lb_win").getComponent(cc.Label).string = point.win;
                    playerNode.getChildByName("lb_lose").getComponent(cc.Label).string = point.transport;
                    playerNode.getChildByName("lb_ping").getComponent(cc.Label).string = point.flat;

                    if (point.bigWinner) {
                        playerNode.getChildByName("icon_win").active = true;
                    }
                    break;
                }
            }
        }
    },

    SetPlayerInfo: function SetPlayerInfo() {
        var room = this.SSSRoomMgr.GetEnterRoom();
        var roomEnd = room.GetRoomProperty("roomEnd");
        var record = roomEnd["record"];

        this.room_Id.string = "房间号:" + record['key'];
        var setID = record["setCnt"];
        this.lb_jushu.string = app.i18n.t("UIWanFa_setCount", { "setCount": setID });
        this.end_Time.string = this.ComTool.GetDateYearMonthDayHourMinuteString(record['endSec']);

        var playerList = record["players"];
        var pointList = record["recordPosInfosList"];

        this.ChangeLayoutType(playerList);

        for (var idx = 0; idx < playerList.length; idx++) {

            var playerNode = null;
            if (this.playerCount > 4) {
                playerNode = cc.instantiate(this.resultPrefab02);
                playerNode.name = "player" + idx;
                playerNode.getChildByName("topTitle").active = false;
                this.layout_player.addChild(playerNode);
                if (idx == 0 || idx == 1) {
                    playerNode.getChildByName("topTitle").active = true;
                }
            } else {
                playerNode = cc.instantiate(this.resultPrefab01);
                playerNode.name = "player" + idx;
                playerNode.getChildByName("topTitle").active = false;
                this.layout_player.addChild(playerNode);
                if (idx == 0) {
                    playerNode.getChildByName("topTitle").active = true;
                }
            }

            var player = playerList[idx];
            var name = player["name"];

            playerNode.getChildByName("user_info").getChildByName("lable_name").getComponent(cc.Label).string = name;

            var pid = player["pid"];
            playerNode.getChildByName("user_info").getChildByName("label_id").getComponent(cc.Label).string = this.ComTool.GetPid(pid);
            playerNode.getChildByName("user_info").getChildByName("head_img").getComponent(app.subGameName + "_WeChatHeadImage").ShowHeroHead(pid);

            //判断房主是谁
            var ownerID = this.SSSRoom.GetRoomProperty("ownerID");
            if (ownerID == player.pid) {
                playerNode.getChildByName("user_info").getChildByName("fangzhu").active = true;
            }

            //显示数据
            for (var i = 0; i < pointList.length; i++) {
                var point = pointList[i];
                if (player.pid == point.pid) {
                    if (point.sumPoint >= 0) {
                        playerNode.getChildByName("lb_win_num").active = true;
                        playerNode.getChildByName("lb_win_num").getComponent(cc.Label).string = "+" + point.point;
                        playerNode.getChildByName("lb_lose_num").active = false;
                    } else {
                        playerNode.getChildByName("lb_lose_num").active = true;
                        playerNode.getChildByName("lb_lose_num").getComponent(cc.Label).string = point.point;
                        playerNode.getChildByName("lb_win_num").active = false;
                    }

                    playerNode.getChildByName("lb_win").getComponent(cc.Label).string = point.winCount;
                    playerNode.getChildByName("lb_lose").getComponent(cc.Label).string = point.loseCount;
                    playerNode.getChildByName("lb_ping").getComponent(cc.Label).string = point.flatCount;

                    if (point.bigWinner) {
                        playerNode.getChildByName("icon_win").active = true;
                    }
                    break;
                }
            }
        }
    },

    OnClick: function OnClick(btnName, btnNode) {
        var room = app[app.subGameName.toUpperCase() + "Room"]();
        var roomCfg = {};
        if (room && this.isZhanJi == false) {
            roomCfg = room.GetRoomConfig();
            roomCfg.isContinue = true;
        }
        if (btnName == "btn_share") {
            this.SDKManager.ShareScreen();
        } else if (btnName == "btn_out") {
            app[app.subGameName + "Client"].ExitGame();
        } else if (btnName == "btn_detail") {
            app[app.subGameName + "_FormManager"]().ShowForm("game/SSS/UISSS_Record");
        } else if (btnName == "btn_close") {
            this.CloseForm();
        } else if (btnName == "btn_pingfenkaiju") {
            roomCfg.paymentRoomCardType = 1;
            app[app.subGameName + "_NetManager"]().SendPack("sss.CSSSCreateRoom", roomCfg, function () {}, this.FailCreate.bind(this));
        } else if (btnName == "btn_wolaikaiju") {
            roomCfg.paymentRoomCardType = 0;
            app[app.subGameName + "_NetManager"]().SendPack("sss.CSSSCreateRoom", roomCfg, function () {}, this.FailCreate.bind(this));
        } else if (btnName == "btn_dayingjiakaiju") {
            roomCfg.paymentRoomCardType = 2;
            app[app.subGameName + "_NetManager"]().SendPack("sss.CSSSCreateRoom", roomCfg, function () {}, this.FailCreate.bind(this));
        } else {
            console.error("OnClick not find btnName(%s)", btnName);
        }
    },
    FailCreate: function FailCreate(serverPack) {
        if (serverPack['Msg'].indexOf('RoomCard need roomCard') > -1) {
            var desc = app[app.subGameName + "_SysNotifyManager"]().GetSysMsgContentByMsgID("MSG_NotRoomCard");
            app[app.subGameName + "_ConfirmManager"]().SetWaitForConfirmForm(this.OnConFirm.bind(this), "goBuyCard", []);
            app[app.subGameName + "_FormManager"]().ShowForm("UIMessage", null, this.ShareDefine.ConfirmBuyGoTo, 0, 0, desc);
            return;
        } else {
            console.error("FailCreate Room Msg:(%s)", serverPack.Msg);
        }
    },
    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {
        if (clickType != "Sure") {
            return;
        }
        if ("goBuyCard" == msgID) {
            var clientConfig = app[app.subGameName + "Client"].GetClientConfig();
            if (app.PackDefine.APPLE_CHECK == clientConfig["appPackType"]) return;
            app[app.subGameName + "_FormManager"]().ShowForm("UIStore");
            return;
        }
    }
});

cc._RF.pop();