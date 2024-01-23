/*
创建房间子界面
 */
var app = require("app");

var zymjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
	// CreateSendPack -start-
    CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
        let sendPack = {};
        let huansanzhang=this.GetIdxByKey('huansanzhang');
        let kexuanwanfa=this.GetIdxsByKey('kexuanwanfa');
        let fangjian=this.GetIdxsByKey('fangjian');
        let xianShi=this.GetIdxByKey('xianShi');
        let jiesan=this.GetIdxByKey('jiesan');
        let gaoji=this.GetIdxsByKey('gaoji');

        sendPack = {
            "huansanzhang":huansanzhang,
            "kexuanwanfa":kexuanwanfa,
            "fangjian":fangjian,
            "xianShi":xianShi,
            "jiesan":jiesan,
            "gaoji":gaoji,

            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,

        }
        return sendPack;
    },
	// CreateSendPack -end-
});

module.exports = zymjChildCreateRoom;