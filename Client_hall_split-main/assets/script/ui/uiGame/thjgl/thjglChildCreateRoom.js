/*
创建房间子界面
 */
var app = require("app");

var ddzChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
    //需要自己重写
    CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
        let sendPack = {};
        let difen = this.GetIdxByKey('difen');
        let chupaishunxu = this.GetIdxByKey('chupaishunxu');
        let sandai = this.GetIdxsByKey('sandai');
        let sidai = this.GetIdxsByKey('sidai');
        let fangjian = this.GetIdxsByKey('fangjian');
        let kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        let xianShi = this.GetIdxByKey('xianShi');
        let jiesan = this.GetIdxByKey('jiesan');
        let gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "difen": difen,
            "chupaishunxu": chupaishunxu,
            "sidai": sidai,
            "sandai": sandai,
            "fangjian": fangjian,
            "kexuanwanfa": kexuanwanfa,
            "xianShi": xianShi,
            "jiesan": jiesan,
            "gaoji": gaoji,

            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,

        }
        return sendPack;
    },
    AdjustSendPack: function (sendPack) {
        // 勾选“每局红四处”玩法，才能勾选“必带红四”
        if (sendPack.chupaishunxu != 0) {
            this.RemoveMultiSelect(sendPack, "kexuanwanfa", 0);
        }
        return sendPack;
    },
    UpdateOnClickToggle: function () {
        if (this.Toggles["kexuanwanfa"]) {
            if (this.Toggles["chupaishunxu"][0].getChildByName('checkmark').active) {
                this.Toggles["kexuanwanfa"][0].parent.active = true;
            } else {
                this.Toggles["kexuanwanfa"][0].parent.active = false;
            }
        }
    },
});

module.exports = ddzChildCreateRoom;