/*
创建房间子界面
 */
var app = require("app");

var thgjmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
    //需要自己重写
    CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
        let sendPack = {};
        let wanfa = this.GetIdxByKey('wanfa');
        let moshi = this.GetIdxByKey('moshi');
        let qihu = this.GetIdxByKey('qihu');
        let fengDing = this.GetIdxByKey('fengDing');
        let xianShi = this.GetIdxByKey('xianShi');
        let jiesan = this.GetIdxByKey('jiesan');
        let kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        let fangjian = this.GetIdxsByKey('fangjian');
        let gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "wanfa": wanfa,
            "moshi": moshi,
            "qihu": qihu,
            "fengDing": fengDing,
            "xianShi": xianShi,
            "jiesan": jiesan,
            "kexuanwanfa": kexuanwanfa,
            "fangjian": fangjian,
            "gaoji": gaoji,

            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,

        }
        return sendPack;
    },

    // 多选
    GetIdxsByKey: function (key) {
        let arr = [];
        for (let i = 0; i < this.Toggles[key].length; i++) {
            if (this.Toggles[key][i].getChildByName('checkmark').active) {
                arr.push(i);
            }
        }
        return arr;
    },
});

module.exports = thgjmjChildCreateRoom;