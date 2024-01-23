(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/yszmj/yszmjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a34581k0U9AApjndbrenktm', 'yszmjChildCreateRoom', __filename);
// script/ui/uiGame/yszmj/yszmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var thgjmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var fangjian = this.GetIdxsByKey('fangjian');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "xianShi": xianShi,
            "jiesan": jiesan,
            "kexuanwanfa": kexuanwanfa,
            "fangjian": fangjian,
            "gaoji": gaoji,

            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard

        };
        return sendPack;
    },

    // 多选
    GetIdxsByKey: function GetIdxsByKey(key) {
        var arr = [];
        for (var i = 0; i < this.Toggles[key].length; i++) {
            if (this.Toggles[key][i].getChildByName('checkmark').active) {
                arr.push(i);
            }
        }
        return arr;
    },
    AdjustSendPack: function AdjustSendPack(sendPack) {
        //     不可吃，仅二人、三人场可选；
        return sendPack;
    }
});

module.exports = thgjmjChildCreateRoom;

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
        //# sourceMappingURL=yszmjChildCreateRoom.js.map
        