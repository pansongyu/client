(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/pdk_UIRoomTest.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b7e43SCAS1C4ar2LbL0rels', 'pdk_UIRoomTest', __filename);
// script/ui/pdk_UIRoomTest.js

"use strict";

var app = require("pdk_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {},
    OnCreateInit: function OnCreateInit(cards) {},
    OnShow: function OnShow(cards) {
        this.cards = cards;
        this.totalNum = 0;
        this.cardMap = {};
        for (var i = 0; i < cards.length; i++) {
            var element = this.GetValue(cards[i]);
            if (!element) continue;
            if (!this.cardMap[element]) {
                this.cardMap[element] = [];
            }
            this.cardMap[element].push(cards[i]);
        }
        var model = this.node.getChildByName("model");
        var bg = this.node.getChildByName("bg");
        for (var _i = 0; _i < bg.children.length; _i++) {
            var _element = bg.children[_i];
            _element.destroy();
        }
        for (var key in this.cardMap) {
            if (!Object.hasOwnProperty.call(this.cardMap, key)) continue;
            var item = cc.instantiate(model);
            item.parent = bg;
            item.active = true;
            var name = this.GetName(key);
            item.getChildByName("poker").getChildByName("Label").getComponent(cc.Label).string = name;
            item.name = key;
        }
        model.active = false;
    },
    GetValue: function GetValue(v) {
        if (!v) v = 0;
        v = v % 16;
        if (v == 14) {
            return 1;
        }
        if (v == 15) {
            return 2;
        }
        return v;
    },
    GetName: function GetName(v) {
        if (!v) return "";
        var names = ["扑克A", "扑克2", "扑克3", "扑克4", "扑克5", "扑克6", "扑克7", "扑克8", "扑克9", "扑克10", "扑克J", "扑克Q", "扑克K", "小鬼", "大鬼"];
        return names[v - 1] || "";
    },
    Sure: function Sure() {
        var _this = this;

        var bg = this.node.getChildByName("bg");
        var test = [];
        for (var i = 0; i < bg.children.length; i++) {
            var element = bg.children[i].name;
            if (!this.cardMap[element] || this.cardMap[element].length == 0) continue;
            var num = parseInt(bg.children[i].getChildByName("num").getComponent(cc.Label).string);
            for (var index = 0; index < Math.min(num, this.cardMap[element].length); index++) {
                test.push(this.cardMap[element][index]);
            }
        }
        var RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
        if (!RoomMgr) return;
        var roomID = RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
        if (!roomID) return;
        var that = this;
        this.SendChat(5, 9988, roomID, JSON.stringify(test), function (msg) {
            console.log(msg);
            if (msg.code == "Success") {
                _this.ShowSysMsg(msg.msg);
                that.CloseForm();
            }
        });
        console.log(test);
    },
    Add: function Add(event) {
        var bg = this.node.getChildByName("bg");
        var key = event.target.parent.name;
        var num = parseInt(bg.getChildByName(key).getChildByName("num").getComponent(cc.Label).string);
        num++;
        if (this.totalNum >= 16) return;
        if (num > this.cardMap[key].length) {
            num = this.cardMap[key].length;
        } else {
            this.totalNum++;
        }
        bg.getChildByName(key).getChildByName("num").getComponent(cc.Label).string = num;
    },
    Del: function Del(event) {
        var bg = this.node.getChildByName("bg");
        var key = event.target.parent.name;
        var num = parseInt(bg.getChildByName(key).getChildByName("num").getComponent(cc.Label).string);
        num--;
        if (num < 0) {
            num = 0;
        } else {
            this.totalNum--;
        }
        bg.getChildByName(key).getChildByName("num").getComponent(cc.Label).string = num;
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
        //# sourceMappingURL=pdk_UIRoomTest.js.map
        