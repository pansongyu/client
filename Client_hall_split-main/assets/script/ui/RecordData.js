var app = require("app");

var RecordData = app.BaseClass.extend({

  
    Init:function(){
        this.JS_Name = "RecordData";
        console.log("init");
        this.OnReload();
    },

    OnReload:function(){

    },

    GetRoom:function(){
        
    },

    GetPlayerList:function(){
        let Room = this.GetRoom();
        let RoomPosMgr = Room.GetRoomPosMgr();
        if(RoomPosMgr)
            this.playerList = RoomPosMgr.GetRoomAllPlayerInfo();
        else
            this.playerList = Room.GetRoomProperty('posList');
        return this.playerList;
    },

    GetEveryGameKeys:function(){
        let Room = this.GetRoom();
        this.roomRecord = Room.GetRoomRecord();
        this.everyGameKeys = Object.keys(this.roomRecord);
        return this.everyGameKeys;
    },

    SetEveryGame:function(userdata){
        this.everyGame = this.roomRecord[this.everyGameKeys[userdata]];
    },

    GetEveryGameProperty:function(property){
        if(this.everyGame.hasOwnProperty(property)){
            return this.everyGame[property];
        }
        else{
            return false;
        }
    },

});

var g_RecordData = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
    if(!g_RecordData){
        g_RecordData = new RecordData();
    }
    return g_RecordData;

}
