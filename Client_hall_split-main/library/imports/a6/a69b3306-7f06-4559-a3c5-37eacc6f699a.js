"use strict";
cc._RF.push(module, 'a69b3MGfwZFWaPFN+rMb2ma', 'xjbjmjChildCreateRoom');
// script/ui/uiGame/xjbjmj/xjbjmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var xjbjmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var fengDing = this.GetIdxByKey('fengDing');
        var dingjing = this.GetIdxByKey('dingjing');
        var louhu = this.GetIdxByKey('louhu');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var fangjian = this.GetIdxsByKey('fangjian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

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
            "paymentRoomCardType": isSpiltRoomCard

        };
        return sendPack;
    },
    UpdateOnClickToggle: function UpdateOnClickToggle() {
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
            if (typeof this.unionData != "undefined" && this.unionData != null) {
                if (this.unionData.unionId > 0) {
                    this.Toggles["kexuanwanfa"][8].active = true;
                    this.Toggles["kexuanwanfa"][9].active = true;
                }
            } else {
                this.Toggles["kexuanwanfa"][8].active = false;
                this.Toggles["kexuanwanfa"][9].active = false;
            }
        }
    }
});

module.exports = xjbjmjChildCreateRoom;

cc._RF.pop();