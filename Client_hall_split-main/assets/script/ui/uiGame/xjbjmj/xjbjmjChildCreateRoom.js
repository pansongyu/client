/*
创建房间子界面
 */
var app = require("app");

var xjbjmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
    //需要自己重写
    CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
        let sendPack = {};
        let fengDing = this.GetIdxByKey('fengDing');
        let dingjing = this.GetIdxByKey('dingjing');
        let louhu = this.GetIdxByKey('louhu');
        let kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        let fangjian = this.GetIdxsByKey('fangjian');
        let xianShi = this.GetIdxByKey('xianShi');
        let jiesan = this.GetIdxByKey('jiesan');
        let gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "fengDing": fengDing,
            "dingjing": dingjing,
            "louhu": louhu,
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
        //选项置灰
        if (this.Toggles["kexuanwanfa"]) {
            this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
            if (!this.Toggles["renshu"][2].getChildByName("checkmark").active) {
                this.Toggles['kexuanwanfa'][1].getChildByName("checkmark").active = false;
                //置灰
                if (this.Toggles['kexuanwanfa'][1].getChildByName("label")) {
                    this.Toggles['kexuanwanfa'][1].getChildByName("label").color = cc.color(180, 180, 180);
                }
            } else {
                //恢复
                if (this.Toggles['kexuanwanfa'][1].getChildByName("label")) {
                    this.Toggles['kexuanwanfa'][1].getChildByName("label").color = cc.color(158, 49, 16);
                }
            }
            if (typeof (this.unionData) != "undefined" && this.unionData != null) {
                if (this.unionData.unionId > 0) {
                    this.Toggles["kexuanwanfa"][8].active = true;
                    this.Toggles["kexuanwanfa"][9].active = true;
                }
            } else {
                this.Toggles["kexuanwanfa"][8].active = false;
                this.Toggles["kexuanwanfa"][9].active = false;
            }
        }
    },
});

module.exports = xjbjmjChildCreateRoom;