"use strict";
cc._RF.push(module, '28d3aoeP6FFRamJIcShc8Ro', 'fzmjChildCreateRoom');
// script/ui/uiGame/fzmj/fzmjChildCreateRoom.js

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
        var difen = this.GetIdxByKey('difen');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var fzmj_kexuanwanfa = [];
        for (var i = 0; i < this.Toggles['kexuanwanfa'].length; i++) {
            if (this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active) {
                fzmj_kexuanwanfa.push(i);
            }
        }
        sendPack = {
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,
            "difen": difen,
            "kexuanwanfa": fzmj_kexuanwanfa,
            "xianShi": xianShi,
            "jiesan": jiesan
        };
        return sendPack;
    }
});

module.exports = fzmjChildCreateRoom;

cc._RF.pop();