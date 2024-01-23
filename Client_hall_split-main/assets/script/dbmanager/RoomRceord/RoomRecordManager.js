
var app = require('app');

var RoomRecordManager = app.BaseClass.extend({

    Init:function () {
        this.JS_Name = "RoomRecordManager";

        this.NetManager = app.NetManager();
        this.ComTool = app.ComTool();

        this.NetManager.RegNetPack("hzmj.C2114RoomAllRecord", this.OnPack_RoomAllRecord, this);
        this.NetManager.RegNetPack("hzmj.C2115RoomRecordDetail", this.OnPack_RoomRecordDetail, this);

    },
    OnReload:function(){
        //客户端玩家参与所有对局记录本地缓存
        // roomID:{
        //     0:Object,
        //     endSec:1490862765,
        //     fastCnt:{
        //                 0:0,
        //                 1:0,
        //                 2:0,
        //                 3:0
        //             },
        //     huCnt:{
        //                 0:0,
        //                 1:0,
        //                 2:0,
        //                 3:0
        //             },
        //     players:{
        //                 0:{
        //                     icon:0,
        //                     iconUrl:"http://wx.qlogo.cn/mmopen/ajNVdqHZLLDDPzIfvLZSbDPunaD2ZuTLtibZ9BXmvOmE7AFeyUQQme04YNpT7Pmx2Y92UJnQkFrIbeMMGrRgebg/0",
        //                     name:"游客_10739",
        //                     pid:1008600000001211
        //                      },
        //                 1:Object,
        //                 2:Object,
        //                 3:Object
        //     },
        //     point:{
        //                 0:0
        //                 1:0
        //                 2:0
        //                 3:0
        //             },
        //     roomID:1008600000000008,
        //     setCnt:4
        // }
        this.roomAllRecord = {};
        //客户端玩家参与所有对局的小局记录本地缓存
        this.roomAllRecordDetail = {};
    },
    //-------------事件回调函数---------------
    OnPack_RoomAllRecord:function (serverPack) {
        let count = serverPack.length;
        let roomAllRecord = {};
        for(let i = 0; i < count; i++){
            let roomRecord = serverPack[i];
            let roomID = roomRecord["roomID"];
            roomAllRecord[roomID] = roomRecord;
        }

        let allRecordRoomIDArray = Object.keys(roomAllRecord);

        //获取本地缓存数据key列表
        let localAllRecordRoomIDArray = Object.keys(this.roomAllRecord);

        if(allRecordRoomIDArray.length != localAllRecordRoomIDArray.length){
            this.roomAllRecord = roomAllRecord;
            app.Client.OnEvent("RoomAllRecord", {});
        }

    },
    OnPack_RoomRecordDetail:function (serverPack) {
        let roomRecordDetail = {};
        let records = serverPack["records"];
        let count = records.length;
        let roomID = 0;
        for(let i = 0; i < count; i++){
            let roomRecord = records[i];
            roomID = roomRecord["roomID"];
            let key = roomRecord["setID"];
            roomRecordDetail[key] = roomRecord;
        }

        if(!roomID){
            this.ErrLog("OnPack_RoomRecordDetail");
            return
        }
        this.roomAllRecordDetail[roomID] = roomRecordDetail;

        app.Client.OnEvent("RoomRecordDetail", {"roomID":roomID});
    },
    //----------获取函数---------------
    //获取客户端玩家参与的所有对局记录
    GetRoomAllRecord:function () {
        return this.roomAllRecord;
    },

    GetRoomRecord:function (roomID) {
        if(this.roomAllRecord.hasOwnProperty(roomID)){
            return this.roomAllRecord[roomID];
        }
        else{
            this.ErrLog("GetRoomRecord not find roomID:%s", roomID);
        }
    },

    //获取客户端玩家参与指定局的小局记录
    GetRoomRecordDetail:function (roomID) {
        if(this.roomAllRecordDetail.hasOwnProperty(roomID)){
            return this.roomAllRecordDetail[roomID];
        }
        else{
            this.SendRoomRecordDetail(roomID);
            return {}
        }
    },

    //-------------发送请求封包-----------------
    //请求对局记录小局信息
    SendRoomRecordDetail:function(roomID){
        this.NetManager.SendPack("hzmj.C2115RoomRecordDetail", {"roomID":roomID});
    },
    //请求客户端玩家参与的所有对局记录
    RequestRoomAllRecord:function(){
        this.NetManager.SendPack("hzmj.C2114RoomAllRecord", {});
    },
});

var g_RoomRecordManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
    if(!g_RoomRecordManager){
        g_RoomRecordManager = new RoomRecordManager();
    }
    return g_RoomRecordManager;
}
