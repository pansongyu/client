(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/UIMessageJoin.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '751a0RAmgRN2Ks39jinPxTP', 'UIMessageJoin', __filename);
// script/ui/UIMessageJoin.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        lb_message: cc.Label
    },

    //初始化
    OnCreateInit: function OnCreateInit() {
        this.ShareDefine = app.ShareDefine();
    },

    //---------显示函数--------------------

    OnShow: function OnShow(serverPack) {
        this.RoomKey = serverPack.roomKey;
        var name = serverPack.name;
        var type = serverPack.continueType;
        var typeName = "";
        if (type == 0) {
            typeName = "房主付";
        } else if (type == 1) {
            typeName = "平分";
        } else if (type == 2) {
            typeName = "大赢家";
        }
        this.lb_message.string = name + " 选择 " + typeName + " 续局，是否加入该房间？";
    },

    //---------点击函数---------------------

    OnClick: function OnClick(btnName, eventData) {
        if (btnName == "btnSure") {
            var self = this;
            app.NetManager().SendPack("room.CBaseGetGameType", { "roomKey": this.RoomKey }, function (event) {
                var gameType = event;
                var name = app.ShareDefine().GametTypeID2PinYin[gameType];
                app.Client.JoinRoomCheckSubGame(name, self.RoomKey);
            }, function (event) {});
        } else if (btnName == "btnCancel") {
            this.CloseForm();
        } else {
            this.ErrLog("OnClick:%s not find", btnName);
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
        //# sourceMappingURL=UIMessageJoin.js.map
        