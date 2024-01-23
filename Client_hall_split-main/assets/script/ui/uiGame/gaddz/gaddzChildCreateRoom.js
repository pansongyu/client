/*
创建房间子界面
 */
var app = require("app");

var ddzChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
    //需要自己重写
    CreateSendPack:function(renshu, setCount, isSpiltRoomCard){
        let sendPack = {};
        let fengDing = this.GetIdxByKey('fengDing');
        let zhadan = this.GetIdxByKey('zhadan');
        let chuntian = this.GetIdxsByKey('chuntian');
        let xianShi = this.GetIdxByKey('xianShi');
        let jiesan = this.GetIdxByKey('jiesan');
        let fangjian = this.GetIdxsByKey('fangjian');
        let gaoji = this.GetIdxsByKey('gaoji');


        sendPack = {
            "setCount":setCount,
            "playerMinNum":renshu[0],
            "playerNum":renshu[1],
            "paymentRoomCardType":isSpiltRoomCard,
            "fangjian":fangjian,
            "gaoji":gaoji,
            "xianShi":xianShi,
            "jiesan":jiesan,
            "zhadan":zhadan,
            "chuntian":chuntian,
            "fengDing":fengDing,
        };
        return sendPack;
    },
});

module.exports = ddzChildCreateRoom;