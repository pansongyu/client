/*
创建房间子界面
 */
var app = require("app");

var zjjhmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
    //需要自己重写
    CreateSendPack:function(renshu, setCount, isSpiltRoomCard){
        let sendPack = {};
        let jiesan = this.GetIdxByKey("jiesan");
        let xianShi = this.GetIdxByKey("xianShi");
        let difen = this.GetIdxByKey("difen");
        let wanfa = this.GetIdxByKey("wanfa");
        let fangjian = [];
        for (let i = 0; i < this.Toggles['fangjian'].length; i++) {
            if (this.Toggles['fangjian'][i].getChildByName('checkmark').active) {
                fangjian.push(i);
            }
        }
        let gaoji = [];
        for (let i = 0; i < this.Toggles['gaoji'].length; i++) {
            if (this.Toggles['gaoji'][i].getChildByName('checkmark').active) {
                gaoji.push(i);
            }
        }
        sendPack = {
            "jiesan": jiesan,
            "xianShi": xianShi,
            "fangjian": fangjian,
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,
            "gaoji": gaoji,
            "difen":difen,
            "wanfa":wanfa,
        };
        return sendPack;
    },
});

module.exports = zjjhmjChildCreateRoom;