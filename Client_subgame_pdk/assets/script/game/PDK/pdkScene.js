/*
    打牌场景
*/

var app = require("pdk_app");

cc.Class({
    extends: require(app.subGameName + "_BaseScene"),
    properties: {
        
    },

    //------回掉函数-------------------
    OnCreate:function(){
    },

    //进入场景
    OnSwithSceneEnd:function(){
    },
    OnTest:function(){
        let RoomMgr = app[app.subGameName.toUpperCase()+"RoomMgr"]();
        if(!RoomMgr) return;
		let roomID = RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
        if(!roomID) return
        this.SendChat(5, 999, roomID, "test",(msg)=>{
            console.log(msg)
            if(msg.code == "Success")
            {   
                let cards = JSON.parse(msg.msg)
                let FormManager = app[app.subGameName + "_FormManager"]();
                FormManager.ShowForm(app.subGameName + '_UIRoomTest', cards);
            }
        });
    },
    SendChat:function (type, quickID, roomID, content,success) {
		app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "Chat", 
        {"type":type, "quickID":quickID, "targetID":roomID, "content":content}, success);
	},
});
