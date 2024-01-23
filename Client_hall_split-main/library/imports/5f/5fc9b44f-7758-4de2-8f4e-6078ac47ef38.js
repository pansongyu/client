"use strict";
cc._RF.push(module, '5fc9bRPd1hN4o9OYHisR+84', 'ststmjChildCreateRoom');
// script/ui/uiGame/ststmj/ststmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var ststmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var zimo = this.GetIdxByKey('zimo');
        var tingyong = this.GetIdxByKey('tingyong');
        var fengDing = this.GetIdxByKey('fengDing');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var fangjian = this.GetIdxsByKey('fangjian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "zimo": zimo,
            "tingyong": tingyong,
            "fengDing": fengDing,
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
});

module.exports = ststmjChildCreateRoom;

cc._RF.pop();