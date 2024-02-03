(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/pdk_UIXiuXPublic_Record.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'babceJUrLlEn7uT2YBvW+8R', 'pdk_UIXiuXPublic_Record', __filename);
// script/ui/pdk_UIXiuXPublic_Record.js

"use strict";

var app = require("pdk_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
        room_Id: cc.Label,
        end_Time: cc.Label,
        lb_jushu: cc.Label,
        lb_room_info: cc.Label,
        layout: cc.Node,
        continueBtnNode: cc.Node,
        exitRoomBtnNode: cc.Node,
        exitBtnNode: cc.Node,
        goSecondBtnNode: cc.Node,

        wolaikaijuBtnNode: cc.Node,
        pingfenkaijuBtnNode: cc.Node,
        dayingjiakaijuBtnNode: cc.Node,

        btn_sharemore: cc.Node,
        sharemore: cc.Node,

        icon_dissolveSpr: [cc.SpriteFrame],

        prefab1: cc.Prefab
    },

    OnCreateInit: function OnCreateInit() {
        this.PokerModle = app[app.subGameName + "_PokerCard"]();
        this.SDKManager = app[app.subGameName + "_SDKManager"]();
        this.RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
        this.fristFrame = this.node.getChildByName('fristFrame');
        this.fristScorll = this.fristFrame.getChildByName('ScrollView').getComponent(cc.ScrollView);

        this.btn_continue = this.GetWndNode("fristFrame/btn_lists/btn_continue");
        this.topLabels = [];
        this.bottomLabels = [];
        this.pdkStartX = -366;
        this.pdkDistance = 247;
        this.redColor = new cc.Color(181, 104, 48);
        this.greenColor = new cc.Color(59, 138, 133);
        this.RegEvent("GameRecord", this.Event_GameRecord);
        this.RegEvent("EVT_CloseDetail", this.CloseForm, this);
        this.RegEvent("OnCopyTextNtf", this.OnEvt_CopyTextNtf);
        this.RegEvent("NewVersion", this.Event_NewVersion, this);
    },
    Event_NewVersion: function Event_NewVersion() {
        this.isNewVersion = true;
    },
    OnEvt_CopyTextNtf: function OnEvt_CopyTextNtf(event) {
        if (0 == event.code) this.ShowSysMsg("手动去微信分享：已复制" + event.msg);else this.ShowSysMsg("复制房号失败");
    },
    OnShow: function OnShow() {
        var needShowIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;

        this.isNewVersion = false;
        app[app.subGameName + "_HotUpdateMgr"]().CheckUpdate(); //检测客户端是否有新版本
        if (app[app.subGameName + "_FormManager"]().IsFormShow("game/" + app.subGameName.toUpperCase() + "/UI" + app.subGameName.toUpperCase() + "_ResultXY")) {
            app[app.subGameName + "_FormManager"]().CloseForm("game/" + app.subGameName.toUpperCase() + "/UI" + app.subGameName.toUpperCase() + "_ResultXY");
        }
        this.HideAllBtn();
        this.fristFrame.active = false;
        this.PlayerName = [];
        this.clubId = 0;
        var setID = 0;
        var endSec = '';
        var roomKey = '';
        var roomID = 0;
        if (!this.RoomMgr) {
            this.CloseForm();
            return;
        }
        this.room = this.RoomMgr.GetEnterRoom();
        if (!this.room) {
            this.CloseForm();
            return;
        }
        var roomEnd = this.room.GetRoomProperty("roomEnd");
        if (!roomEnd) {
            this.CloseForm();
            return;
        }
        var record = roomEnd["record"];
        setID = record["setCnt"];
        endSec = record['endSec'];
        this.ShareShortRoomID = this.room.GetRoomProperty("key");
        this.ShareLongRoomID = this.room.GetRoomProperty("roomID");
        roomKey = "房间号:" + this.ShareShortRoomID;
        this.fristData = record['recordPosInfosList'];
        if (!this.room.GetGameRecord()) {
            this.RoomMgr.sendEveryGameRecord(roomID);
        }
        var roomCfg = this.room.GetRoomConfig();
        this.clubId = roomCfg.clubId;
        this.room_Id.string = roomKey;
        this.lb_jushu.string = app.i18n.t("UIWanFa_setCount", { "setCount": setID });
        this.end_Time.string = this.ComTool.GetDateYearMonthDayHourMinuteString(endSec);
        this.lb_room_info.string = this.WanFa();
        this.UpdateFristFrame();

        //初始化分享
        this.sharemore.active = false;
    },
    UpdateFristFrame: function UpdateFristFrame() {
        this.btn_continue.active = false;
        this.fristScorll.stopAutoScroll();
        this.layout.removeAllChildren();
        var dataCount = 0;
        for (var i = 0; i < this.fristData.length; i++) {
            if (0 != this.fristData[i].pid) dataCount++;
        }
        var usePrefabIndex = 1;
        if (dataCount > 4) usePrefabIndex = 2;
        //先找出大赢家
        var bigBang = -1;
        //console.log();
        var lastPoint = this.fristData[0].point;
        for (var _i = 0; _i < this.fristData.length; _i++) {
            if (this.fristData[_i].pid <= 0) continue;
            if (lastPoint < this.fristData[_i].point) {
                bigBang = _i;
                lastPoint = this.fristData[_i].point;
            }
        }
        if (0 != this.fristData[0].point && -1 == bigBang) bigBang = 0;
        var showTipIndex = 1;
        var node = null;
        var nodeObjs = {};
        for (var _i2 = 0; _i2 < this.fristData.length; _i2++) {
            var allNum = this.fristData[_i2].winCount + this.fristData[_i2].loseCount + this.fristData[_i2].flatCount;
            if (this.fristData[_i2].pid <= 0 || 0 == allNum) {
                continue;
            }
            node = cc.instantiate(this.prefab1);
            showTipIndex = 1;

            this.GetFristPrefabAllNode(node, nodeObjs);
            if (_i2 >= showTipIndex) nodeObjs.topTitle.active = false;
            if (bigBang == _i2 || lastPoint == this.fristData[_i2].point) nodeObjs.iconWin.active = true;else nodeObjs.iconWin.active = false;

            this.SetUserInfo(nodeObjs.userInfo, this.fristData[_i2].pid);
            this.SetScore(nodeObjs, _i2);
            this.layout.addChild(node);
        }

        this.exitRoomBtnNode.active = true;
        this.goSecondBtnNode.active = false;
        if (!app[app.subGameName + "_ShareDefine"]().isCoinRoom) {
            var roomCfg = this.room.GetRoomConfig();
            if (0 == this.clubId && roomCfg.createType == 1) {
                /*this.wolaikaijuBtnNode.active=true;
                this.pingfenkaijuBtnNode.active=true;
                this.dayingjiakaijuBtnNode.active=true;*/
                this.wolaikaijuBtnNode.active = false;
                this.pingfenkaijuBtnNode.active = false;
                this.dayingjiakaijuBtnNode.active = false;
            }
            if (this.clubId != 0) {
                this.btn_continue.active = true;
            }
        } else {
            this.continueBtnNode.active = true;
        }
        this.fristFrame.active = true;
    },
    GetFristPrefabAllNode: function GetFristPrefabAllNode(curNode, nodeObjs) {
        nodeObjs.topTitle = curNode.getChildByName('topTitle');
        nodeObjs.userInfo = curNode.getChildByName('user_info');
        nodeObjs.winNum = curNode.getChildByName('lb_win_num');
        nodeObjs.loseNum = curNode.getChildByName('lb_lose_num');
        nodeObjs.sheng = curNode.getChildByName('jiesuan').getChildByName("lb_sheng").getChildByName("num");
        nodeObjs.zhadan = curNode.getChildByName('jiesuan').getChildByName("lb_zhadan").getChildByName("num");
        nodeObjs.maxFen = curNode.getChildByName('jiesuan').getChildByName("lb_maxFen").getChildByName("num");
        nodeObjs.tip_sportsPoint = curNode.getChildByName('tip_sportsPoint');
        nodeObjs.lb_sportsPoint = curNode.getChildByName('lb_sportsPoint');
        nodeObjs.dissolve = curNode.getChildByName('icon_dissolve');
        nodeObjs.iconWin = curNode.getChildByName('icon_win');
    },
    SetUserInfo: function SetUserInfo(userInfoNode, pid) {
        var player = null;
        var ownerID = 0;
        player = this.room.GetRoomPosMgr().GetPlayerInfoByPid(pid);
        ownerID = this.room.GetRoomProperty("ownerID");
        // if(!player){
        //     this.ErrLog('SetUserInfo Error this.playerList.length = ' + this.playerList.length);
        //     return;
        // }
        var playerName = "";
        playerName = player["name"];
        this.PlayerName.push(playerName);
        if (playerName.length > 4) {
            playerName = playerName.substring(0, 4) + '...';
        }
        userInfoNode.getChildByName("lable_name").getComponent(cc.Label).string = playerName;

        userInfoNode.getChildByName("label_id").getComponent(cc.Label).string = "ID:" + this.ComTool.GetPid(pid);
        var wechatSprite = userInfoNode.getChildByName("head_img").getComponent(app.subGameName + "_WeChatHeadImage");
        wechatSprite.OnLoad();
        wechatSprite.ShowHeroHead(pid);

        //判断房主是谁
        var fangzhu = userInfoNode.getChildByName("fangzhu");
        if (ownerID == player.pid) fangzhu.active = true;else fangzhu.active = false;
    },
    SetScore: function SetScore(nodeObjs, dataIndex) {
        var data = this.fristData[dataIndex];
        if (data.point > 0) {
            nodeObjs.winNum.active = true;
            nodeObjs.loseNum.active = false;
            nodeObjs.winNum.getComponent(cc.Label).string = '+' + data.point;
        } else {
            nodeObjs.winNum.active = false;
            nodeObjs.loseNum.active = true;
            nodeObjs.loseNum.getComponent(cc.Label).string = data.point;
        }

        nodeObjs.sheng.getComponent(cc.Label).string = data.winCount + "胜" + data.loseCount + "负";
        nodeObjs.zhadan.getComponent(cc.Label).string = data.outBombSize;
        nodeObjs.maxFen.getComponent(cc.Label).string = data.setMaxPoint;

        //显示是否解散（-1:正常结束,0:未操作,1:同意操作,2:拒绝操作,3:发起者）
        if (typeof data.dissolveState == "undefined" || data.dissolveState == -1) {
            nodeObjs.dissolve.active = false;
        } else {
            nodeObjs.dissolve.active = true;
            nodeObjs.dissolve.getComponent(cc.Sprite).spriteFrame = this.icon_dissolveSpr[data.dissolveState];
        }

        //比赛分消耗
        if (typeof data.sportsPoint != "undefined") {
            if (data.sportsPoint > 0) {
                nodeObjs.lb_sportsPoint.active = true;
                nodeObjs.lb_sportsPoint.getComponent(cc.Label).string = "+" + data.sportsPoint;
            } else {
                nodeObjs.lb_sportsPoint.active = true;
                nodeObjs.lb_sportsPoint.getComponent(cc.Label).string = data.sportsPoint;
            }
            // nodeObjs.topTitle.getChildByName("sportsPoint").active = true;
            nodeObjs.tip_sportsPoint.active = true;
        } else {
            // nodeObjs.topTitle.getChildByName("sportsPoint").active = false;
            nodeObjs.tip_sportsPoint.active = false;
            nodeObjs.lb_sportsPoint.active = false;
        }
    },
    Event_GameRecord: function Event_GameRecord(serverPack) {
        this.recordList = serverPack.pSetRoomRecords;
        if (!this.needShowSecond) return;
    },

    //-----------------回调函数------------------

    //---------点击函数---------------------
    OnPokerDataBtnClick: function OnPokerDataBtnClick(event) {
        var node = event.target;
        var parent = node.parent;
        var cardNode = parent.getChildByName('cardNode');
        if (cardNode.active) {
            node.rotation = 0;
            parent.height = parent.height - cardNode.height;
            cardNode.active = false;
        } else {
            node.rotation = 180;
            parent.height = parent.height + cardNode.height;
            cardNode.active = true;
        }
    },
    HideAllBtn: function HideAllBtn() {
        this.exitBtnNode.active = false;
        this.exitRoomBtnNode.active = false;
        this.goSecondBtnNode.active = false;
        this.wolaikaijuBtnNode.active = false;
        this.pingfenkaijuBtnNode.active = false;
        this.dayingjiakaijuBtnNode.active = false;
        this.continueBtnNode.active = false;
    },
    OnClick: function OnClick(btnName, btnNode) {
        //继续房间使用
        var room = app[app.subGameName.toUpperCase() + "Room"]();
        var roomCfg = {};
        if (room) {
            roomCfg = room.GetRoomConfig();
            roomCfg.isContinue = true;
        }
        //继续房间使用

        if ('btn_close' == btnName) {
            this.CloseForm();
        } else if ('btn_goScend' == btnName) {
            this.needShowSecond = true;
        } else if (btnName == "btn_share") {
            this.Click_btn_Share();
        } else if (btnName == "btn_ddshare") {
            this.Click_btn_DDShare();
        } else if (btnName == "btn_xlshare") {
            this.Click_btn_XLShare();
        } else if (btnName == "btn_sharemore") {
            this.Click_btn_ShareMore();
        } else if (btnName == "btn_sharelink") {
            this.Click_btn_Sharelink();
        } else if (btnName == "btn_closeshare") {
            this.sharemore.active = false;
        } else if ('btn_continueGoldRoom' == btnName) {
            app[app.subGameName + "_NetManager"]().SendPack('game.CGoldRoom', { practiceId: app[app.subGameName + "_ShareDefine"]().practiceId }, this.OnSuccess.bind(this), this.OnEnterRoomFailed.bind(this));
            this.CloseForm();
        } else if ('btn_exitRoom' == btnName || 'btn_exit' == btnName) {
            app[app.subGameName + "Client"].ExitGame();
        } else if ('btn_exit' == btnName) {
            this.CloseForm();
        } else if (btnName == "btn_pingfenkaiju") {
            if (this.isNewVersion == true) {
                app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("游戏有新版本更新，请返回大厅");
                return;
            }
            roomCfg.paymentRoomCardType = 1;
            app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "CreateRoom", roomCfg, function () {}, this.FailCreate.bind(this));
        } else if (btnName == "btn_wolaikaiju") {
            if (this.isNewVersion == true) {
                app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("游戏有新版本更新，请返回大厅");
                return;
            }
            roomCfg.paymentRoomCardType = 0;
            app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "CreateRoom", roomCfg, function () {}, this.FailCreate.bind(this));
        } else if (btnName == "btn_dayingjiakaiju") {
            if (this.isNewVersion == true) {
                app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("游戏有新版本更新，请返回大厅");
                return;
            }
            roomCfg.paymentRoomCardType = 2;
            app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "CreateRoom", roomCfg, function () {}, this.FailCreate.bind(this));
        } else if (btnName == "btn_continue") {
            if (this.isNewVersion == true) {
                app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("游戏有新版本更新，请返回大厅");
                return;
            }
            var self = this;
            app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ContinueEnterRoom", {}, function (event) {
                self.CloseForm();
                app[app.subGameName + "_FormManager"]().CloseForm("game/" + app.subGameName.toUpperCase() + "/UI" + app.subGameName.toUpperCase() + "_ResultXY");
                app[app.subGameName + "_NetManager"]().SendPack("game.C1101GetRoomID", {});
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
            this.ErrLog("OnClick(%s) not find btnName", btnName);
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
    Click_btn_Sharelink: function Click_btn_Sharelink() {
        var packName = cc.sys.localStorage.getItem("packName");
        if (!packName) {
            packName = "";
        }
        var title = '房号：' + this.ShareShortRoomID + ' 互动中';
        var desc = '[' + this.PlayerName.join('] [') + ']';
        var weChatAppShareUrl = app[app.subGameName + "Client"].GetClientConfigProperty("ChatRoomUrl") + this.ShareLongRoomID;
        this.SDKManager.Share(title, desc, weChatAppShareUrl, "0");
    },

    FailCreate: function FailCreate(serverPack) {
        if (serverPack['Msg'].indexOf('RoomCard need roomCard') > -1) {
            var desc = app[app.subGameName + "_SysNotifyManager"]().GetSysMsgContentByMsgID("MSG_NotRoomCard");
            app[app.subGameName + "_ConfirmManager"]().SetWaitForConfirmForm(this.OnConFirm.bind(this), "goBuyCard", []);
            app[app.subGameName + "_FormManager"]().ShowForm(app.subGameName + "_UIMessage", null, this.ShareDefine.ConfirmBuyGoTo, 0, 0, desc);
            return;
        } else {
            this.ErrLog("FailCreate Room Msg:(%s)", serverPack.Msg);
        }
    },
    OnSuccess: function OnSuccess(serverPack) {
        console.log('OnSuccess serverPack', serverPack);
        var roomID = serverPack.roomID;
        app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "GetRoomInfo", { "roomID": roomID });
        this.CloseForm();
        // app[app.subGameName+"_ShareDefine"]().practiceId = this.practiceId;
    },

    OnEnterRoomFailed: function OnEnterRoomFailed(serverPack) {
        app[app.subGameName + "Client"].ExitGame();
        console.log('OnEnterRoomFailed serverPack', serverPack);
    },
    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {
        if (clickType != "Sure") {
            return;
        }
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
        //# sourceMappingURL=pdk_UIXiuXPublic_Record.js.map
        