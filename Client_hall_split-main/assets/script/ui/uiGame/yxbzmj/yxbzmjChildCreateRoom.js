/*
创建房间子界面
 */
var app = require("app");

var yxbzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
    //需要自己重写
    CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
        let sendPack = {};
        let difen = this.GetIdxByKey('difen');
        let xianShi = this.GetIdxByKey('xianShi');
        let jiesan = this.GetIdxByKey('jiesan');
        let kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        let fangjian = this.GetIdxsByKey('fangjian');
        let gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "difen": difen,
            "xianShi": xianShi,
            "jiesan": jiesan,
            "kexuanwanfa": kexuanwanfa,
            "fangjian": fangjian,
            "gaoji": gaoji,

            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,

        };
        return sendPack;
    },
});

module.exports = yxbzmjChildCreateRoom;