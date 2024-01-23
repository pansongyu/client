"use strict";
cc._RF.push(module, '385d70haiVNv51ylWcicYtX', 'dleChildCreateRoom');
// script/ui/uiGame/dle/dleChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var fddzChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var paizhi = this.GetIdxByKey('paizhi');
        var paishu = this.GetIdxByKey('paishu');

        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var kexuanwanfa = [];
        var gaoji = [];

        for (var i = 0; i < this.Toggles['kexuanwanfa'].length; i++) {
            var isCheck = this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active;
            if (isCheck) {
                if (this.Toggles['kexuanwanfa'][i].serverIdx) {
                    kexuanwanfa.push(this.Toggles['kexuanwanfa'][i].serverIdx);
                } else {
                    kexuanwanfa.push(i);
                }
            }
        }
        for (var _i = 0; _i < this.Toggles['gaoji'].length; _i++) {
            if (this.Toggles['gaoji'][_i].getChildByName('checkmark').active) {
                gaoji.push(_i);
            }
        }
        sendPack = {
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,
            "paizhi": paizhi,
            "paishu": paishu,
            "jiesan": jiesan,
            "xianShi": xianShi,
            "kexuanwanfa": kexuanwanfa,
            "gaoji": gaoji
        };
        return sendPack;
    }
});

module.exports = fddzChildCreateRoom;

cc._RF.pop();