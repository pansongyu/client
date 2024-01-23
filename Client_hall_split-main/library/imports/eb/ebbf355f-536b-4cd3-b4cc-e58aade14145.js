"use strict";
cc._RF.push(module, 'ebbf3VfU2tM07TM5Yqt4UFF', 'UIRecord_Child');
// script/ui/uiChild/UIRecord_Child.js

"use strict";

/*
 UIGMTool_Child2 GM工具子界面
 */

cc.Class({
    extends: require("BaseChildForm"),

    properties: {
        lb_jushu: cc.Label,
        layout: cc.Node
    },

    //创建界面回掉
    OnCreateInit: function OnCreateInit() {
        // this.HZRoomMgr = app.HZRoomMgr();
        // this.HZRoom = this.HZRoomMgr.GetEnterRoom();
        // this.HZRoomPosMgr = this.HZRoom.GetRoomPosMgr();
    },

    InitShowInfo: function InitShowInfo() {
        this.clientPosHuType.node.active = 0;
        this.clientPosZhongMa.node.active = 0;

        this.clientDownPosHuType.node.active = 0;
        this.clientDownPosZhongMa.node.active = 0;

        this.clientFacePosHuType.node.active = 0;
        this.clientFacePosZhongMa.node.active = 0;

        this.clientUpPosHuType.node.active = 0;
        this.clientUpPosZhongMa.node.active = 0;
    },
    //显示
    OnShow: function OnShow() {
        // this.InitShowInfo();

        // let userData = this.GetFormProperty("UserData");
        // this.jushu.string = userData;

        // let roomKey = this.HZRoom.GetRoomProperty("key");
        // this.lb_paijuid.string = app.i18n.t("roomKey",{"roomKey": roomKey});

        // let roomRecord = this.HZRoomMgr.GetEnterRoom().GetRoomRecord();
        // let everyGameKeys = Object.keys(roomRecord);
        // let everyGame = roomRecord[everyGameKeys[userData]];

        // this.lb_paijushijian.string = this.ComTool.GetDateYearMonthDayHourMinuteString(everyGame["endTime"]);

        // let posHuList = everyGame["posHuList"];
        // let posHuListKeys = Object.keys(posHuList);
        // for(let i = 0; i < posHuListKeys.length; i++ ){
        //     let player = posHuList[posHuListKeys[i]];
        //     let playerPos = player["pos"];
        //     let playerIntegral = player["point"] > 0 ? ["+",player["point"]].join("") : player["point"];
        //     let playerHuType = player["huType"];
        //     let playerZhongMa = player["zhongMa"];
        //     this.SetPlayerInfo(playerPos, playerIntegral, playerHuType, playerZhongMa);
        // }

        //清空分数
        for (var i = 0; i < this.layout.children.length; i++) {
            var node = this.layout.children[i];
            node.getComponent(cc.Label).string = '';
        }

        var userData = this.GetFormProperty("UserData");
        this.lb_jushu.string = (parseInt(userData) + 1).toString();

        app.RecordData().SetEveryGame(userData);

        var posHuList = app.RecordData().GetEveryGameProperty("posHuList");
        var pResults = app.RecordData().GetEveryGameProperty("pResults");
        if (posHuList) {
            var posHuListKeys = Object.keys(posHuList);
            for (var _i = 0; _i < posHuListKeys.length; _i++) {
                var player = posHuList[posHuListKeys[_i]];
                var path = 'layout/lb_score' + (_i + 1).toString();
                var _node = this.GetWndNode(path);
                _node.getComponent(cc.Label).string = player["point"] > 0 ? ["+", player["point"]].join("") : player["point"];
            }
        } else if (pResults) {
            pResults.sort(function (a, b) {
                return a.posIdx - b.posIdx;
            });
            for (var _i2 = 0; _i2 < pResults.length; _i2++) {
                var _player = pResults[_i2];
                var _path = 'layout/lb_score' + (_i2 + 1).toString();
                var _node2 = this.GetWndNode(_path);
                _node2.getComponent(cc.Label).string = _player["shui"] > 0 ? ["+", _player["shui"]].join("") : _player["shui"];
            }
        }
    },
    SetPlayerInfo: function SetPlayerInfo(playerPos, playerIntegral, playerHuType, playerZhongMa) {
        var clientPos = this.HZRoomPosMgr.GetClientPos();
        var clientDownPos = this.HZRoomPosMgr.GetClientDownPos();
        var clientFacePos = this.HZRoomPosMgr.GetClientFacePos();
        var clientUpPos = this.HZRoomPosMgr.GetClientUpPos();
        var huTypeString = "";
        if (playerHuType == this.ShareDefine.HuType_ZiMo) {
            huTypeString = app.i18n.t("ZiMo");
        } else if (playerHuType == this.ShareDefine.HuType_QGH) {
            huTypeString = app.i18n.t("QiangGangHu");
        } else if (playerHuType == this.ShareDefine.HuType_FHZ) {
            huTypeString = app.i18n.t("SiHongZhong");
        } else if (playerHuType == this.ShareDefine.HuType_NotHu) {
            huTypeString = "";
        }
        var zhongMaString = "";
        if (playerZhongMa) {
            zhongMaString = app.i18n.t("ZhongMa", { "ZhongMa": playerZhongMa });
        }
        if (playerPos == clientPos) {
            this.clientPosIntegral.string = app.i18n.t("Integral", { "Integral": playerIntegral });
            this.clientPosHuType.node.active = 1;
            this.clientPosZhongMa.node.active = 1;
            this.clientPosHuType.string = huTypeString;
            this.clientPosZhongMa.string = zhongMaString;
        } else if (playerPos == clientDownPos) {
            this.clientDownPosIntegral.string = app.i18n.t("Integral", { "Integral": playerIntegral });
            this.clientDownPosHuType.node.active = 1;
            this.clientDownPosZhongMa.node.active = 1;
            this.clientDownPosHuType.string = huTypeString;
            this.clientDownPosZhongMa.string = zhongMaString;
        } else if (playerPos == clientFacePos) {
            this.clientFacePosIntegral.string = app.i18n.t("Integral", { "Integral": playerIntegral });
            this.clientFacePosHuType.node.active = 1;
            this.clientFacePosZhongMa.node.active = 1;
            this.clientFacePosHuType.string = huTypeString;
            this.clientFacePosZhongMa.string = zhongMaString;
        } else if (playerPos == clientUpPos) {
            this.clientUpPosIntegral.string = app.i18n.t("Integral", { "Integral": playerIntegral });
            this.clientUpPosHuType.node.active = 1;
            this.clientUpPosZhongMa.node.active = 1;
            this.clientUpPosHuType.string = huTypeString;
            this.clientUpPosZhongMa.string = zhongMaString;
        }
    },
    //-------------点击函数-------------

    OnClick: function OnClick(btnName, btnNode) {}

});

cc._RF.pop();