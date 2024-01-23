"use strict";
cc._RF.push(module, 'b861ax+fnNJrpkaotfM85cn', 'xl2vs2mjChildCreateRoom');
// script/ui/uiGame/xl2vs2mj/xl2vs2mjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var jsnyzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    // CreateSendPack -start-
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var fengDing = this.GetIdxByKey('fengDing');
        var zimo = this.GetIdxByKey('zimo');
        var diangang = this.GetIdxByKey('diangang');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var duiwushuying = this.GetIdxByKey('duiwushuying');
        var lianmai = this.GetIdxByKey('lianmai');
        var fangjian = this.GetIdxsByKey('fangjian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "fengDing": fengDing,
            "zimo": zimo,
            "diangang": diangang,
            "kexuanwanfa": kexuanwanfa,
            "duiwushuying": duiwushuying,
            "lianmai": lianmai,
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

module.exports = jsnyzmjChildCreateRoom;

cc._RF.pop();