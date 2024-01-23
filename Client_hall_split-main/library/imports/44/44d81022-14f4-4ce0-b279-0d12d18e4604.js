"use strict";
cc._RF.push(module, '44d81AiFPRM4LJ5DRLRjkYE', 'ctpkChildCreateRoom');
// script/ui/uiGame/ctpk/ctpkChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var lkwskChildCreateRoom = cc.Class({
  extends: require("BaseChildCreateRoom"),

  properties: {},

  // CreateSendPack -start-
  CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
    var sendPack = {};
    var difen = this.GetIdxByKey('difen');
    var fangjian = this.GetIdxsByKey('fangjian');
    var xianShi = this.GetIdxByKey('xianShi');
    var jiesan = this.GetIdxByKey('jiesan');
    var gaoji = this.GetIdxsByKey('gaoji');

    sendPack = {
      "difen": difen,
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

module.exports = lkwskChildCreateRoom;

cc._RF.pop();