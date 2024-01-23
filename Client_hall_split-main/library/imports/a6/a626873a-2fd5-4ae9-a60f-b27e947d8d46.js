"use strict";
cc._RF.push(module, 'a6268c6L9VK6aYPsn6UfY1G', 'RecordData');
// script/ui/RecordData.js

"use strict";

var app = require("app");

var RecordData = app.BaseClass.extend({

    Init: function Init() {
        this.JS_Name = "RecordData";
        console.log("init");
        this.OnReload();
    },

    OnReload: function OnReload() {},

    GetRoom: function GetRoom() {},

    GetPlayerList: function GetPlayerList() {
        var Room = this.GetRoom();
        var RoomPosMgr = Room.GetRoomPosMgr();
        if (RoomPosMgr) this.playerList = RoomPosMgr.GetRoomAllPlayerInfo();else this.playerList = Room.GetRoomProperty('posList');
        return this.playerList;
    },

    GetEveryGameKeys: function GetEveryGameKeys() {
        var Room = this.GetRoom();
        this.roomRecord = Room.GetRoomRecord();
        this.everyGameKeys = Object.keys(this.roomRecord);
        return this.everyGameKeys;
    },

    SetEveryGame: function SetEveryGame(userdata) {
        this.everyGame = this.roomRecord[this.everyGameKeys[userdata]];
    },

    GetEveryGameProperty: function GetEveryGameProperty(property) {
        if (this.everyGame.hasOwnProperty(property)) {
            return this.everyGame[property];
        } else {
            return false;
        }
    }

});

var g_RecordData = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
    if (!g_RecordData) {
        g_RecordData = new RecordData();
    }
    return g_RecordData;
};

cc._RF.pop();