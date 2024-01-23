"use strict";
cc._RF.push(module, '6fa28RD1iNITpRkh9+Gt/zE', 'gsddzChildCreateRoom');
// script/ui/uiGame/gsddz/gsddzChildCreateRoom.js

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
        var dizhufengding = this.GetIdxByKey('dizhufengding');
        // let quedingdizhu = this.GetIdxByKey('quedingdizhu');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var sandai = [];
        for (var i = 0; i < this.Toggles['sandai'].length; i++) {
            if (this.Toggles['sandai'][i].getChildByName('checkmark').active) {
                sandai.push(i);
            }
        }
        var sidai = [];
        for (var _i = 0; _i < this.Toggles['sidai'].length; _i++) {
            if (this.Toggles['sidai'][_i].getChildByName('checkmark').active) {
                sidai.push(_i);
            }
        }
        var kexuanwanfa = [];
        for (var _i2 = 0; _i2 < this.Toggles['kexuanwanfa'].length; _i2++) {
            if (this.Toggles['kexuanwanfa'][_i2].getChildByName('checkmark').active) {
                kexuanwanfa.push(_i2);
            }
        }
        var gaoji = [];
        for (var _i3 = 0; _i3 < this.Toggles['gaoji'].length; _i3++) {
            if (this.Toggles['gaoji'][_i3].getChildByName('checkmark').active) {
                gaoji.push(_i3);
            }
        }
        var fangjian = [];
        for (var _i4 = 0; _i4 < this.Toggles['fangjian'].length; _i4++) {
            if (this.Toggles['fangjian'][_i4].getChildByName('checkmark').active) {
                fangjian.push(_i4);
            }
        }
        sendPack = {
            "setCount": setCount,
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "paymentRoomCardType": isSpiltRoomCard,
            "dizhufengding": dizhufengding,
            // "quedingdizhu":quedingdizhu,
            "gaoji": gaoji,
            "xianShi": xianShi,
            "jiesan": jiesan,
            "kexuanwanfa": kexuanwanfa,
            "sandai": sandai,
            "sidai": sidai,
            "fangjian": fangjian
        };
        return sendPack;
    }
});

module.exports = ddzChildCreateRoom;

cc._RF.pop();