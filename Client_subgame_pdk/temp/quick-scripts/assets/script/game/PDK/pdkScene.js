(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/game/PDK/pdkScene.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'typdk33c-bef8-48dd-886c-dc068c10d8ce', 'pdkScene', __filename);
// script/game/PDK/pdkScene.js

"use strict";

/*
    打牌场景
*/

var app = require("pdk_app");

cc.Class({
    extends: require(app.subGameName + "_BaseScene"),
    properties: {},

    //------回掉函数-------------------
    OnCreate: function OnCreate() {},

    //进入场景
    OnSwithSceneEnd: function OnSwithSceneEnd() {},
    OnTest: function OnTest() {
        var RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
        if (!RoomMgr) return;
        var roomID = RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
        if (!roomID) return;
        this.SendChat(5, 999, roomID, "test", function (msg) {
            console.log(msg);
            if (msg.code == "Success") {
                var cards = JSON.parse(msg.msg);
                var FormManager = app[app.subGameName + "_FormManager"]();
                FormManager.ShowForm(app.subGameName + '_UIRoomTest', cards);
            }
        });
    },
    SendChat: function SendChat(type, quickID, roomID, content, success) {
        app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "Chat", { "type": type, "quickID": quickID, "targetID": roomID, "content": content }, success);
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
        //# sourceMappingURL=pdkScene.js.map
        