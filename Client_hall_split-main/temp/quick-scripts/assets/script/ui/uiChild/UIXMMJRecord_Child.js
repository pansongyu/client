(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiChild/UIXMMJRecord_Child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f6a20khmsBDU5QiOAYqDPnw', 'UIXMMJRecord_Child', __filename);
// script/ui/uiChild/UIXMMJRecord_Child.js

"use strict";

/*
 UIGMTool_Child2 GM工具子界面
 */

cc.Class({
    extends: require("BaseChildForm"),

    properties: {
        jushu: cc.Label,
        lb_paijuid: cc.Label,
        lb_paijushijian: cc.Label,

        clientPosHuType: cc.Label,
        clientPosIntegral: cc.Label,

        clientDownPosHuType: cc.Label,
        clientDownPosIntegral: cc.Label,

        clientFacePosHuType: cc.Label,
        clientFacePosIntegral: cc.Label,

        clientUpPosHuType: cc.Label,
        clientUpPosIntegral: cc.Label,

        bg2: cc.Node,
        bg3: cc.Node,
        bg4: cc.Node

    },

    //创建界面回掉
    OnCreateInit: function OnCreateInit() {
        this.LYMJRoomMgr = app.LYMJRoomMgr();
        this.LYMJRoom = this.LYMJRoomMgr.GetEnterRoom();
        this.LYMJRoomPosMgr = this.LYMJRoom.GetRoomPosMgr();

        //玩家列表
        this.playerList = [];
    },

    InitShowInfo: function InitShowInfo() {
        this.playerList = [];
        var clientPos = this.LYMJRoomPosMgr.GetClientPos();
        var clientDownPos = this.LYMJRoomPosMgr.GetClientDownPos();
        var clientFacePos = this.LYMJRoomPosMgr.GetClientFacePos();
        var clientUpPos = this.LYMJRoomPosMgr.GetClientUpPos();

        var ClientPlayer = this.LYMJRoomPosMgr.GetPlayerInfoByPos(clientPos);
        if (ClientPlayer) {
            this.playerList.push(ClientPlayer);
        }

        var DownPlayer = this.LYMJRoomPosMgr.GetPlayerInfoByPos(clientDownPos);
        if (DownPlayer) {
            this.playerList.push(DownPlayer);
        }

        var FacePlayer = this.LYMJRoomPosMgr.GetPlayerInfoByPos(clientFacePos);
        if (FacePlayer) {
            this.playerList.push(FacePlayer);
        }

        var UpPlayer = this.LYMJRoomPosMgr.GetPlayerInfoByPos(clientUpPos);
        if (UpPlayer) {
            this.playerList.push(UpPlayer);
        }

        for (var i = 2; i <= this.ShareDefine.LYMJRoomJoinCount; i++) {
            var activeValue = this.playerList.length == i ? 1 : 0;
            var bgStr = "bg" + i;
            var bg = this.node.getChildByName(bgStr);
            if (bg) bg.active = activeValue;
        }
    },
    //显示
    OnShow: function OnShow() {
        this.InitShowInfo();

        var bgStr = "bg" + this.playerList.length;
        var bg = this.node.getChildByName(bgStr);

        var userData = this.GetFormProperty("UserData");
        var jushu = bg.getChildByName("lb_jushu").getComponent(cc.Label);
        console.log("UILYMJRecore_Child jushu userData:", userData);
        jushu.string = parseInt(userData) + 1;

        var roomKey = this.LYMJRoom.GetRoomProperty("key");
        var lb_paijuid = bg.getChildByName("lb_paijuid").getComponent(cc.Label);
        lb_paijuid.string = app.i18n.t("roomKey", { "roomKey": roomKey });

        var roomRecord = this.LYMJRoomMgr.GetEnterRoom().GetRoomRecord();
        var everyGameKeys = Object.keys(roomRecord);
        var everyGame = roomRecord[everyGameKeys[userData]];

        var lb_paijushijian = lb_paijuid.node.getChildByName("lb_id").getComponent(cc.Label);
        lb_paijushijian.string = this.ComTool.GetDateYearMonthDayHourMinuteString(everyGame["endTime"]);

        var posHuList = everyGame["posHuList"];
        var posHuListKeys = Object.keys(posHuList);
        for (var i = 0; i < this.playerList.length; i++) {
            var playerInfo = this.playerList[i];
            var player = posHuList[playerInfo["pos"]];
            var playerPos = player["pos"];
            var playerIntegral = player["point"] > 0 ? ["+", player["point"]].join("") : player["point"];
            var playerHuType = player["huType"];
            this.SetPlayerInfo(i, playerIntegral, playerHuType);
        }
    },
    SetPlayerInfo: function SetPlayerInfo(playerPos, playerIntegral, playerHuType) {

        var huTypeString = "";

        if (playerHuType == this.ShareDefine.HuType_ZiMo) {
            huTypeString = app.i18n.t("ZiMo");
        } else if (playerHuType == this.ShareDefine.HuType_QGH) {
            huTypeString = app.i18n.t("QiangGangHu");
        } else if (playerHuType == this.ShareDefine.HuType_SanJinDao) {
            huTypeString = app.i18n.t("SanJinDao");
        } else if (playerHuType == this.ShareDefine.HuType_DanYou) {
            huTypeString = app.i18n.t("DanYou");
        } else if (playerHuType == this.ShareDefine.HuType_ShuangYou) {
            huTypeString = app.i18n.t("ShuangYou");
        } else if (playerHuType == this.ShareDefine.HuType_SanYou) {
            huTypeString = app.i18n.t("SanYou");
        } else if (playerHuType == this.ShareDefine.HuType_QiangJin) {
            huTypeString = app.i18n.t("QiangJin");
        } else if (playerHuType == this.ShareDefine.HuType_SiJinDao) {
            huTypeString = app.i18n.t("SiJinDao");
        } else if (playerHuType == this.ShareDefine.HuType_WuJinDao) {
            huTypeString = app.i18n.t("WuJinDao");
        } else if (playerHuType == this.ShareDefine.HuType_LiuJinDao) {
            huTypeString = app.i18n.t("LiuJinDao");
        } else if (playerHuType == this.ShareDefine.HuType_ShiSanYao) {
            huTypeString = app.i18n.t("ShiSanYao");
        } else if (playerHuType == this.ShareDefine.HuType_NotHu) {
            huTypeString = "";
        }

        var bgStr = "bg" + this.playerList.length;
        var bg = this.node.getChildByName(bgStr);

        var lb_chengjiStr = "lb_chengji0" + (playerPos + 1);
        var lb_chengji = bg.getChildByName(lb_chengjiStr).getComponent(cc.Label);
        lb_chengji.string = app.i18n.t("Integral", { "Integral": playerIntegral });

        var lb_hupai = lb_chengji.node.getChildByName("lb_hupai").getComponent(cc.Label);
        lb_hupai.string = huTypeString;
        lb_hupai.node.active = 1;
    }

    //-------------点击函数-------------

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
        //# sourceMappingURL=UIXMMJRecord_Child.js.map
        