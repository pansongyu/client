"use strict";
cc._RF.push(module, 'bdc20bucn5KHY0fvBPAFK6D', 'zjplsChildCreateRoom');
// script/ui/uiGame/zjpls/zjplsChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var sssChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var daqiang = this.GetIdxByKey('daqiang');
        var difen = this.GetIdxByKey('difen');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var wanfa = this.GetIdxByKey('wanfa');
        var gaoji = [];
        for (var i = 0; i < this.Toggles['gaoji'].length; i++) {
            if (this.Toggles['gaoji'][i].getChildByName('checkmark').active) {
                gaoji.push(i);
            }
        }
        sendPack = {
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,
            "wanfa": wanfa,
            "daqiang": daqiang,
            "difen": difen,
            "xianShi": xianShi,
            "gaoji": gaoji,
            "jiesan": jiesan,
            "sign": 0
        };
        return sendPack;
    }
});

module.exports = sssChildCreateRoom;

cc._RF.pop();