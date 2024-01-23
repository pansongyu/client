"use strict";
cc._RF.push(module, '678fb7wkG1EMKely8oPHufW', 'symjChildCreateRoom');
// script/ui/uiGame/symj/symjChildCreateRoom.js

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
        var piaoHua = this.GetIdxByKey('piaoHua');
        var xianShi = this.GetIdxByKey("xianShi");
        var jiesan = this.GetIdxByKey("jiesan");

        var kexuanwanfa = [];
        for (var i = 0; i < this.Toggles['kexuanwanfa'].length; i++) {
            if (this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active) {
                kexuanwanfa.push(i);
            }
        }
        var fangjian = [];
        for (var _i = 0; _i < this.Toggles['fangjian'].length; _i++) {
            if (this.Toggles['fangjian'][_i].getChildByName('checkmark').active) {
                fangjian.push(_i);
            }
        }
        var gaoji = [];
        for (var _i2 = 0; _i2 < this.Toggles['gaoji'].length; _i2++) {
            if (this.Toggles['gaoji'][_i2].getChildByName('checkmark').active) {
                gaoji.push(_i2);
            }
        }

        sendPack = {
            "xianShi": xianShi,
            "jiesan": jiesan,
            "fangjian": fangjian,
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,
            "gaoji": gaoji,
            "kexuanwanfa": kexuanwanfa,
            "piaoHua": piaoHua
        };
        return sendPack;
    }
});

module.exports = fzmjChildCreateRoom;

cc._RF.pop();