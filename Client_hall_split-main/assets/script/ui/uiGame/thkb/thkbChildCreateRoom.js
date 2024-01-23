/*
 创建房间子界面
 */
var app = require("app");

var ctwskChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
        let sendPack = {};
        let youximoshi = this.GetIdxByKey('youximoshi');
        let kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        let fangjian = this.GetIdxsByKey('fangjian');
        let xianShi = this.GetIdxByKey('xianShi');
        let jiesan = this.GetIdxByKey('jiesan');
        let gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "youximoshi": youximoshi,
            "kexuanwanfa": kexuanwanfa,
            "fangjian": fangjian,
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
    UpdateOnClickToggle: function () {
        if (this.Toggles["kexuanwanfa"]) {
            if (this.Toggles["youximoshi"][0].getChildByName("checkmark").active) {
                this.Toggles["kexuanwanfa"][0].active = true;
                this.Toggles["kexuanwanfa"][1].active = false;
            } else {
                this.Toggles["kexuanwanfa"][0].active = false;
                this.Toggles["kexuanwanfa"][1].active = true;
            }
            if (typeof (this.unionData) != "undefined" && this.unionData != null) {
                if (this.unionData.unionId > 0) {
                    this.Toggles["kexuanwanfa"][4].active = true;
                    this.Toggles["kexuanwanfa"][5].active = true;
                }
            } else {
                this.Toggles["kexuanwanfa"][4].active = false;
                this.Toggles["kexuanwanfa"][5].active = false;
            }
        }
        console.log("this.clubData", this.clubData, this.unionData);
    },
    AdjustSendPack: function (sendPack) {
        if (sendPack.youximoshi == 0) {
            this.RemoveMultiSelect(sendPack, "kexuanwanfa", 1);
        }
        if (sendPack.youximoshi == 1) {
            this.RemoveMultiSelect(sendPack, "kexuanwanfa", 0);
        }
        return sendPack;
    }

});

module.exports = ctwskChildCreateRoom;