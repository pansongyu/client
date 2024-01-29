(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/fjssz_UIRoomTest.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b7e43SCAS1C4ar2LbL0rels', 'fjssz_UIRoomTest', __filename);
// script/ui/fjssz_UIRoomTest.js

"use strict";

var app = require("fjssz_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {},
    OnCreateInit: function OnCreateInit(cards) {},
    OnShow: function OnShow(cards) {
        var c = [];
        for (var i = 0; i < cards.length; i++) {
            var element = cards[i];
            c.push(element.key);
        }
        cards = c;
        this.cards = cards;
        cards.sort();
        this.totalNum = 0;
        this.cardMap = {};
        for (var _i = 0; _i < cards.length; _i++) {
            var _element = this.GetValue(cards[_i]);
            if (!_element) continue;
            if (!this.cardMap[_element]) {
                this.cardMap[_element] = [];
            }
            this.cardMap[_element].push(cards[_i]);
        }
        cc.log(this.cardMap);

        var model = this.node.getChildByName("model");
        var bg = this.node.getChildByName("bg");
        for (var _i2 = 0; _i2 < bg.children.length; _i2++) {
            var _element2 = bg.children[_i2];
            _element2.destroy();
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
        var or = parseInt(v.substring(0, 4));
        v = or;
        if (!v) v = 0;
        v = v % 16;
        if (or > 0x40) {
            return 14;
        }
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

        //        ["方块",      "草花" ，   "红桃" , "黑桃" ]
        // 1: (4) ["0x0e" 14, "0x1e" 30, "0x2e" 46, "0x3e" 62]
        // 2: (3) ["0x02" 2, "0x12" 18, "0x22" 34]
        // 3: (3) ["0x03" 3, "0x13" 19, "0x23" 35]
        // 4: (3) ["0x04" 4, "0x14" 20， "0x24" 36]
        // 5: (3) ["0x05" 5, "0x15" 21, "0x25" 37] 
        // 6: (3) ["0x06" 6, "0x16" 22, "0x26" 38]
        // 7: (3) ["0x07" 7, "0x17" 23, "0x27" 39]
        // 8: (3) ["0x08" 8, "0x18" 24, "0x28" 40]
        // 9: (3) ["0x09" 9, "0x19" 25, "0x29" 41]
        // 10: (4) ["0x0a" 10, "0x1a" 26, "0x2a" 42, "0x3a"58]
        // 11: (4) ["0x0b" 11, "0x1b" 27, "0x2b" 43, "0x3b"59]
        // 12: (4) ["0x0c" 12, "0x1c" 28, "0x2c" 44, "0x3c" 60]
        // 13: (4) ["0x0d" 13, "0x1d" 29, "0x2d" 45, "0x3d" 61]
        // 14: (8) ["0x42" 66, "0x43" 67, "0x44" 68, "0x45" 69, "0x46" 70, "0x47" 71, "0x48" 72 , "0x49" 73]
        var bg = this.node.getChildByName("bg");

        var test = []
        // [0x3e,0x2d,0x1d,0x3b,0x25,0x05,0x24,0x43,0x3c,0x45,0x17,0x47,0x42]
        //  [0x3e,0x12,0x22,0x25,0x08,0x09,0x1b,0x3b,0x2c,0x3c,0x42,0x43,0x45]
        [(0x2e, 0x1e, 0x13, 0x24, 0x06, 0x16, 0x27, 0x0a, 0x3a, 0x0b, 0x0c, 0x42, 0x44)];
        for (var i = 0; i < bg.children.length; i++) {
            var element = bg.children[i].name;
            if (!this.cardMap[element] || this.cardMap[element].length == 0) continue;
            var num = parseInt(bg.children[i].getChildByName("num").getComponent(cc.Label).string);
            for (var index = 0; index < Math.min(num, this.cardMap[element].length); index++) {
                test.push(parseInt(this.cardMap[element][index]));
            }
        }
        if (test.length != 13) {
            app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("请选择13张牌");
            return;
        }
        var RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
        if (!RoomMgr) return;
        var roomID = RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
        if (!roomID) return;
        var that = this;
        // 传9988 设置测试牌
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
        if (this.totalNum >= 13) return;
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
        //# sourceMappingURL=fjssz_UIRoomTest.js.map
        