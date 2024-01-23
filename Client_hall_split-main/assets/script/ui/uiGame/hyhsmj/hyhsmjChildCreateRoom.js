/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
    //需要自己重写
    CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
        let sendPack = {};
        //单选
        let zhuaniao = this.GetIdxByKey("zhuaniao");
        let quezhang = this.GetIdxByKey("quezhang");
        let jiesan = this.GetIdxByKey("jiesan");
        let xianShi = this.GetIdxByKey("xianShi");

        //多选
        let kexuanwanfa = this.GetIdxsByKey("kexuanwanfa");
        let fangjian = this.GetIdxsByKey("fangjian");
        let gaoji = this.GetIdxsByKey("gaoji");

        sendPack = {
            "zhuaniao": zhuaniao,
            "quezhang": quezhang,
            "jiesan": jiesan,
            "xianShi": xianShi,

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

module.exports = fzmjChildCreateRoom;