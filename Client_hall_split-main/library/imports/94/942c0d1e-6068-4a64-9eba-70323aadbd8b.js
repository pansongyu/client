"use strict";
cc._RF.push(module, '942c00eYGhKZJ66cDI6rb2L', 'zymjChildCreateRoom');
// script/ui/uiGame/zymj/zymjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var zymjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    // CreateSendPack -start-
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var huansanzhang = this.GetIdxByKey('huansanzhang');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var fangjian = this.GetIdxsByKey('fangjian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "huansanzhang": huansanzhang,
            "kexuanwanfa": kexuanwanfa,
            "fangjian": fangjian,
            "xianShi": xianShi,
            "jiesan": jiesan,
            "gaoji": gaoji,

            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard

        };
        return sendPack;
    }
    // CreateSendPack -end-
});

module.exports = zymjChildCreateRoom;

cc._RF.pop();