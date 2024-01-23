"use strict";
cc._RF.push(module, '8b339RKS+JFWr+wm49QEKZh', 'gaddzChildCreateRoom');
// script/ui/uiGame/gaddz/gaddzChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var ddzChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var fengDing = this.GetIdxByKey('fengDing');
        var zhadan = this.GetIdxByKey('zhadan');
        var chuntian = this.GetIdxsByKey('chuntian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var fangjian = this.GetIdxsByKey('fangjian');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "setCount": setCount,
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "paymentRoomCardType": isSpiltRoomCard,
            "fangjian": fangjian,
            "gaoji": gaoji,
            "xianShi": xianShi,
            "jiesan": jiesan,
            "zhadan": zhadan,
            "chuntian": chuntian,
            "fengDing": fengDing
        };
        return sendPack;
    }
});

module.exports = ddzChildCreateRoom;

cc._RF.pop();