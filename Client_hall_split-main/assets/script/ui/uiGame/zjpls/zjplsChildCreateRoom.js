/*
创建房间子界面
 */
var app = require("app");

var sssChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
    //需要自己重写
    CreateSendPack:function(renshu, setCount, isSpiltRoomCard){
            let sendPack = {};
            let daqiang = this.GetIdxByKey('daqiang');
            let difen = this.GetIdxByKey('difen');
            let xianShi = this.GetIdxByKey('xianShi');
            let jiesan = this.GetIdxByKey('jiesan');
            let wanfa = this.GetIdxByKey('wanfa');
            let gaoji=[];
            for(let i=0;i<this.Toggles['gaoji'].length;i++){
                if(this.Toggles['gaoji'][i].getChildByName('checkmark').active){
                    gaoji.push(i);
                }
            }
            sendPack = {
                "playerMinNum":renshu[0],
                "playerNum":renshu[1],
                "setCount":setCount,
                "paymentRoomCardType":isSpiltRoomCard,
                "wanfa": wanfa,
                "daqiang": daqiang,
                "difen": difen,
                "xianShi": xianShi,
                "gaoji":gaoji,
                "jiesan": jiesan,
                "sign":0,
            };
        return sendPack;
    },
});

module.exports = sssChildCreateRoom;