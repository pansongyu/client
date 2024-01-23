"use strict";
cc._RF.push(module, '58d511hDHNEEKpVpQYWpeue', 'jsycmjChildCreateRoom');
// script/ui/uiGame/jsycmj/jsycmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var wzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var wanfa = this.GetIdxByKey("wanfa");
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        // let kexuanwanfa=[];
        // for(let i=0;i<this.Toggles['kexuanwanfa'].length;i++){
        //     if(this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active){
        //         kexuanwanfa.push(i);
        //     }
        // }
        var fangjian = [];
        for (var i = 0; i < this.Toggles['fangjian'].length; i++) {
            if (this.Toggles['fangjian'][i].getChildByName('checkmark').active) {
                fangjian.push(i);
            }
        }
        var gaoji = [];
        for (var _i = 0; _i < this.Toggles['gaoji'].length; _i++) {
            if (this.Toggles['gaoji'][_i].getChildByName('checkmark').active) {
                gaoji.push(_i);
            }
        }
        sendPack = {
            // "kexuanwanfa":kexuanwanfa,
            "fangjian": fangjian,
            "gaoji": gaoji,
            "wanfa": wanfa,
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,
            "xianShi": xianShi,
            "jiesan": jiesan
        };
        return sendPack;
    }
});

module.exports = wzmjChildCreateRoom;

cc._RF.pop();