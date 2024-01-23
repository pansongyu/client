"use strict";
cc._RF.push(module, '9818aq7ichLO6efYNsBk/CH', 'hbwhmjChildCreateRoom');
// script/ui/uiGame/hbwhmj/hbwhmjChildCreateRoom.js

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
        var wanfa = this.GetIdxByKey('wanfa');
        var moshi = this.GetIdxByKey('moshi');
        var qihu = this.GetIdxByKey('qihu');
        var fengDing = this.GetIdxByKey('fengDing');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var fangjian = this.GetIdxsByKey('fangjian');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "wanfa": wanfa,
            "moshi": moshi,
            "qihu": qihu,
            "fengDing": fengDing,
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
    }
});

module.exports = thgjmjChildCreateRoom;

cc._RF.pop();