"use strict";
cc._RF.push(module, '8606dm4qVJHF6N3WUpDCkdQ', 'hnyjmjChildCreateRoom');
// script/ui/uiGame/hnyjmj/hnyjmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};

        var fengDing = this.GetIdxByKey('fengDing');
        var zhuaniao = this.GetIdxByKey('zhuaniao');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var fangjian = this.GetIdxsByKey('fangjian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {

            "fengDing": fengDing,
            "zhuaniao": zhuaniao,
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

module.exports = fzmjChildCreateRoom;

cc._RF.pop();