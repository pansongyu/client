"use strict";
cc._RF.push(module, 'typdk12a-3e05-41e6-b895-84a771beaa21', 'PDKRoomMgr');
// script/game/PDK/PDKRoomMgr.js

"use strict";

/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDM Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package SSSRoomMgr.js
 *  @todo: 拼罗松麻将
 *
 *  @date 2014-10-30 16:04
 *  @version 1.0
 *
 *  修改时间 修改人 修改内容
 *  -------------------------------------------------------------------------------
 *
 */
var app = require('pdk_app');

/**
 * 类构造
 */
var PDKRoomMgr = app.BaseClass.extend({

    /**
     * 初始化
     */
    Init: function Init() {

        this.JS_Name = app.subGameName.toUpperCase() + "RoomMgr";

        this.ComTool = app[app.subGameName + "_ComTool"]();
        this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
        this.NetManager = app[app.subGameName + "_NetManager"]();
        this.SysNotifyManager = app[app.subGameName + "_SysNotifyManager"]();

        this.Room = app[app.subGameName.toUpperCase() + "Room"]();

        this.NetManager.RegNetPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "CreateRoom", this.OnPack_CreateRoom, this);
        this.NetManager.RegNetPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "GetRoomInfo", this.OnPack_GetRoomInfo, this);
        this.NetManager.RegNetPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "RoomRecord", this.OnPack_RoomRecord, this);

        //notify
        this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_SetStart", this.OnPack_SetStart, this);
        this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_SetEnd", this.OnPack_SetEnd, this);

        this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_RoomEnd", this.OnPack_RoomEnd, this);
        this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_RoomStart", this.OnPack_RoomStart, this);
        this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_OpCard", this.OnPack_OpCard, this);
        this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_ChangeStatus", this.OnPack_ChangeStatus, this);
        this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_AddDouble", this.OnPack_AddDouble, this);
        this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_OpenCard", this.OnPack_OpenCard, this);
        this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_RobClose", this.OnPack_RobClose, this);
        this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_Chatmessage", this.OnPack_ChatMessage, this);
        this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_StopTime", this.OnPack_StopTime, this);

        //比赛分通知
        this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_SportsPointNotEnough", this.OnPack_SportsPointNotEnough, this);
        this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_SportsPointEnough", this.OnPack_SportsPointEnough, this);

        //比赛分门槛通知
        this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_SportsPointThresholdNotEnough", this.OnPack_SportsPointThresholdNotEnough, this);
        this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_SportsPointThresholdEnough", this.OnPack_SportsPointThresholdEnough, this);

        this.NetManager.RegNetPack("SRoom_SportsPointChange", this.OnPack_SportsPointChange, this);

        this.HeroManager = app[app.subGameName + "_HeroManager"]();

        this.OnReload();

        this.Log("Init");
    },

    /**
     * 重登
     */
    OnReload: function OnReload() {
        this.enterRoomID = 0;
        //获取启动客户端进入的房间KEY
        this.loginEnterRoomKey = 0;

        this.Room.OnReload();
    },

    OnSwithSceneEnd: function OnSwithSceneEnd(sceneType) {

        //如果退出房间场景了,清除数据
        if (sceneType != "fightScene") {
            this.OnReload();
        }
    },

    //----------------------收包接口-----------------------------
    //创建房间完成
    OnPack_CreateRoom: function OnPack_CreateRoom(serverPack) {
        var agrs = Object.keys(serverPack);
        if (0 == agrs.length) //俱乐部会回空包
            return;
        if (serverPack.createType == 2) {
            app[app.subGameName + "_FormManager"]().ShowForm('UIDaiKai');
            app[app.subGameName + "_FormManager"]().CloseForm('UICreatRoom');
        } else {
            this.SendGetRoomInfo(serverPack.roomID);
        }
    },

    //获取到房间完整信息
    OnPack_GetRoomInfo: function OnPack_GetRoomInfo(serverPack) {

        if (serverPack["NotFind_Player"]) {
            app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('PLAYER_NOT_ROOM');
            app[app.subGameName + "Client"].ExitGame();
            return;
        } else if (serverPack["NotFind_Room"]) {
            app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('Room_NotFindRoom');
            app[app.subGameName + "Client"].ExitGame();
            return;
        }

        this.enterRoomID = serverPack["roomID"];
        this.clubId = serverPack["cfg"]["clubId"];
        this.unionId = serverPack["cfg"]["unionId"];
        this.Room.OnInitRoomData(serverPack);
        //进入打牌场景
        if (app[app.subGameName + "_SceneManager"]().GetSceneType() != "pdkScene") {
            console.warn('进入打牌场景1');
            app[app.subGameName + "_SceneManager"]().LoadScene("pdkScene");
        } else {
            var gameScene = app.LocalDataManager().GetConfigProperty("SysSetting", app.subGameName + "_GameBg");
            console.warn('进入打牌场景2xxxxxxxxxxxxxxxx', gameScene);
            if (gameScene == 1) {
                app[app.subGameName + "_FormManager"]().ShowForm('game/PDK/UIPDK_Play');
            } else if (gameScene == 2) {
                app[app.subGameName + "_FormManager"]().ShowForm('game/PDK/UIPDK_LPPlay');
            } else if (gameScene == 3) {
                app[app.subGameName + "_FormManager"]().ShowForm('game/PDK/UIPDK_SYPlay');
            } else if (gameScene == 4) {
                app[app.subGameName + "_FormManager"]().ShowForm('game/PDK/UIPDK_XiuXPlay');
            }
        }
        //获取断线重连后发送离开结束给服务端
        // this.scheduleOnce(this.SendPackPosShowLeave, 0.5);
    },

    //发送玩家离开状态给服务端
    SendPackPosShowLeave: function SendPackPosShowLeave() {
        var roomID = this.GetEnterRoomID();
        app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ShowLeave", {
            "roomID": roomID,
            "isShowLeave": false
        });
    },
    //--------------notify-----------------
    //set开始
    OnPack_SetStart: function OnPack_SetStart(serverPack) {
        var roomID = serverPack["roomID"];
        var setInfo = serverPack["setInfo"];
        this.Room.OnSetStart(setInfo);
        app[app.subGameName + "Client"].OnEvent(app.subGameName.toUpperCase() + "SetStart", serverPack);
    },

    //set结束
    OnPack_SetEnd: function OnPack_SetEnd(serverPack) {
        this.Room.OnSetEnd(serverPack);
        app[app.subGameName + "Client"].OnEvent(app.subGameName.toUpperCase() + "SetEnd", serverPack);
    },

    //房间开始
    OnPack_RoomStart: function OnPack_RoomStart(serverPack) {
        this.ErrLog("OnPack_RoomStart:", serverPack);
        app[app.subGameName + "Client"].OnEvent("RoomStart", {});
    },

    OnPack_OpCard: function OnPack_OpCard(serverPack) {
        console.log("serverPack ==" + serverPack);
        app[app.subGameName + "Client"].OnEvent("OpCard", serverPack);
    },

    OnPack_ChangeStatus: function OnPack_ChangeStatus(serverPack) {
        console.log("改变玩家出牌位置和游戏状态");
        this.Room.OnPlaying(serverPack);
        app[app.subGameName + "Client"].OnEvent("ChangeStatus", serverPack);
    },

    OnPack_AddDouble: function OnPack_AddDouble(serverPack) {
        console.log("显示玩家倍数");
        app[app.subGameName + "Client"].OnEvent("AddDouble", serverPack);
    },

    OnPack_OpenCard: function OnPack_OpenCard(serverPack) {
        app[app.subGameName + "Client"].OnEvent("OpenCard", serverPack);
    },

    OnPack_RobClose: function OnPack_RobClose(serverPack) {
        app[app.subGameName + "Client"].OnEvent("RobClose", serverPack);
    },

    OnPack_ChatMessage: function OnPack_ChatMessage(serverPack) {
        app[app.subGameName + "Client"].OnEvent("ChatMessage", serverPack);
    },
    //比赛分不足时通知
    OnPack_SportsPointNotEnough: function OnPack_SportsPointNotEnough(serverPack) {
        app[app.subGameName + "Client"].OnEvent("SportsPointNotEnough", serverPack);
    },
    OnPack_SportsPointEnough: function OnPack_SportsPointEnough(serverPack) {
        app[app.subGameName + "Client"].OnEvent("SportsPointEnough", serverPack);
    },
    //比赛分门槛不足时通知
    OnPack_SportsPointThresholdNotEnough: function OnPack_SportsPointThresholdNotEnough(serverPack) {
        app[app.subGameName + "Client"].OnEvent("SportsPointThresholdNotEnough", serverPack);
    },
    OnPack_SportsPointThresholdEnough: function OnPack_SportsPointThresholdEnough(serverPack) {
        app[app.subGameName + "Client"].OnEvent("SportsPointThresholdEnough", serverPack);
    },
    //玩家的比赛分在游戏外被改变通知
    OnPack_SportsPointChange: function OnPack_SportsPointChange(serverPack) {
        this.Room.OnSportsPointChange(serverPack);
        app[app.subGameName + "Client"].OnEvent("RoomSportsPointChange", serverPack);
    },
    //房间结束
    OnPack_RoomEnd: function OnPack_RoomEnd(serverPack) {
        this.Room.OnRoomEnd(serverPack);
        app[app.subGameName + "Client"].OnEvent("RoomEnd", serverPack);
    },

    //获取对局记录信息
    OnPack_RoomRecord: function OnPack_RoomRecord(serverPack) {
        var records = serverPack["records"];
        this.Room.RoomRecord(records);
        app[app.subGameName + "Client"].OnEvent("RoomRecord", records);
    },

    OnPack_StopTime: function OnPack_StopTime(serverPack) {
        console.log("OnPack_StopTime ==" + serverPack);
        app[app.subGameName + "Client"].OnEvent("StopTime", serverPack);
    },

    //---------------------获取接口------------------------------
    GetEnterRoomID: function GetEnterRoomID() {
        return this.enterRoomID;
    },

    GetEnterRoom: function GetEnterRoom() {
        if (!this.enterRoomID) {
            this.ErrLog("GetEnterRoom not enterRoom");
            return;
        }
        return this.Room;
    },
    //-----------------------发包函数-----------------------------


    //登录获取当前进入的房间ID
    SendGetCurRoomID: function SendGetCurRoomID() {
        this.NetManager.SendPack("game.C1101GetRoomID", {});
    },

    //发送创建房间
    SendCreateRoom: function SendCreateRoom(sendPack) {
        this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "CreateRoom", sendPack);
    },

    //获取房间信息
    SendGetRoomInfo: function SendGetRoomInfo(roomID, callback, errorCb) {
        this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "GetRoomInfo", { "roomID": roomID }, function (success) {
            console.log("获取房间信息成功", success);
            callback && callback();
        }, function (error) {
            console.log("获取房间信息失败", error, roomID);
            errorCb && errorCb(error, roomID);
            app[app.subGameName + "Client"].ExitGame();
        });
    },

    //解散房间
    SendDissolveRoom: function SendDissolveRoom(roomID) {
        this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "DissolveRoom", { "roomID": roomID });
    },

    //位置发送准备状态
    SendReady: function SendReady(roomID, posIndex) {
        this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ReadyRoom", {
            "roomID": roomID,
            "posIndex": posIndex
        });
    },

    //发送取消准备状态
    SendUnReady: function SendUnReady(roomID, posIndex) {
        this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "UnReadyRoom", {
            "roomID": roomID,
            "posIndex": posIndex
        });
    },

    //房主T人
    SendKickPosIndex: function SendKickPosIndex(roomID, posIndex) {
        this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "KickRoom", {
            "roomID": roomID,
            "posIndex": posIndex
        });
    },

    //开始游戏
    SendStartRoomGame: function SendStartRoomGame(roomID) {
        console.log('SendStartRoomGame roomID', roomID);
        this.NetManager.SendPack("room.CBaseStartGame", { "roomID": roomID });
    },
    //发送等待继续游戏时间
    SendTimeOutContinue: function SendTimeOutContinue() {
        this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "TimeOutContinue", { "roomID": this.enterRoomID });
    },
    //发送继续游戏
    SendContinueGame: function SendContinueGame(roomID) {
        this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ContinueGame", { "roomID": roomID });
    },

    //发送同意解散房间
    SendDissolveRoomAgree: function SendDissolveRoomAgree(roomID) {
        this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "DissolveRoomAgree", { "roomID": roomID });
    },

    //发送拒绝解散房间
    SendDissolveRoomRefuse: function SendDissolveRoomRefuse(roomID) {
        this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "DissolveRoomRefuse", { "roomID": roomID });
    },

    //退出房间
    SendExitRoom: function SendExitRoom(roomID, pos) {
        this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ExitRoom", {
            "roomID": roomID,
            "posIndex": pos
        });
    },

    //请求对局记录封包
    SendRoomRecord: function SendRoomRecord(roomID) {
        this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "RoomRecord", { "roomID": roomID });
    },

    //获取每一局的玩家记录
    sendEveryGameRecord: function sendEveryGameRecord(roomID) {
        this.NetManager.SendPack("game.CPlayerSetRoomRecord", { "roomID": roomID });
    },

    SendEndRoom: function SendEndRoom(roomID) {
        this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "EndRoom", { "roomID": roomID });
    },

    SendOpCard: function SendOpCard(sendPack) {
        this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "OpCard", sendPack, function (data) {
            console.log(data);
        }, function (error) {
            console.log("打牌错误", error);
        });
    },

    SendAddDouble: function SendAddDouble(roomID, pos, addDouble) {
        this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "AddDouble", {
            "roomID": roomID,
            "pos": pos,
            "addDouble": addDouble
        });
    },

    SendRoobDoor: function SendRoobDoor(roomID, pos, isRob) {
        this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "RobClose", {
            "roomID": roomID,
            "pos": pos,
            "robClose": isRob
        });
    },
    SendFaPaiFinish: function SendFaPaiFinish(pos) {
        if (!this.enterRoomID) {
            return;
        }
        var roomID = this.enterRoomID;
        var sendPack = {
            "roomID": roomID,
            "pos": pos
        };
        this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "FaPaiJieShu", sendPack);
    },
    SendOpenCard: function SendOpenCard(roomID, pos, isOpen) {
        this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "OpenCard", {
            "roomID": roomID,
            "pos": pos,
            "OpenCard": isOpen
        });
    }
});

var g_PDKRoomMgr = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
    if (!g_PDKRoomMgr) g_PDKRoomMgr = new PDKRoomMgr();
    return g_PDKRoomMgr;
};

cc._RF.pop();