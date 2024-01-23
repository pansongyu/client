"use strict";
cc._RF.push(module, '70f52pUYzZO9LbKNoz9ZBtQ', 'UIClubRoomWanFa');
// script/ui/club/UIClubRoomWanFa.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {},

    OnCreateInit: function OnCreateInit() {
        this.ComTool = app.ComTool();
    },
    OnShow: function OnShow(roomData) {
        this.gameType = roomData.gameId;
        this.node.getChildByName("lb_roomname").getComponent(cc.Label).string = roomData.roomName;
        this.node.getChildByName("lb_wanfa").getComponent(cc.Label).string = this.GetWanFa(roomData.roomCfg);
    },
    GetWanFa: function GetWanFa(gameCfg) {
        return app.RoomCfgManager().WanFa(this.gameType, gameCfg);
    },
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_close' == btnName) {
            this.CloseForm();
        }
    }

});

cc._RF.pop();