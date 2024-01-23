/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
    //需要自己重写
    CreateSendPack:function(renshu, setCount, isSpiltRoomCard){
        let sendPack = {};
        let difen = this.GetIdxByKey('difen');
        let xianShi = this.GetIdxByKey('xianShi');
        let jiesan = this.GetIdxByKey('jiesan');
        let fzmj_kexuanwanfa=[];
        for(let i=0;i<this.Toggles['kexuanwanfa'].length;i++){
            if(this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active){
                fzmj_kexuanwanfa.push(i);
            }
        }
        sendPack = {
                    "playerMinNum":renshu[0],
                    "playerNum":renshu[1],
                    "setCount":setCount,
                    "paymentRoomCardType":isSpiltRoomCard,
                    "difen":difen,
                    "kexuanwanfa":fzmj_kexuanwanfa,
                    "xianShi":xianShi,
                    "jiesan":jiesan,
        };
        return sendPack;
    },
});

module.exports = fzmjChildCreateRoom;