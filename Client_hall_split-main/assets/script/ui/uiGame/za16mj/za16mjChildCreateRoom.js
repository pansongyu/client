/*
创建房间子界面
 */
var app = require("app");

var zjmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
    //需要自己重写
    CreateSendPack:function(renshu, setCount, isSpiltRoomCard){
        let sendPack = {};
        let xianShi = this.GetIdxByKey('xianShi');
        let jiesan = this.GetIdxByKey('jiesan');
        let fangjian=[];
        let chatai = this.GetIdxByKey('chatai');
        let chipai = this.GetIdxByKey('chipai');
        let gaoji=[];
        for(let i=0;i<this.Toggles['fangjian'].length;i++){
            if(this.Toggles['fangjian'][i].getChildByName('checkmark').active){
                fangjian.push(i);
            }
        }
        let kexuanwanfa=[];
        for(let i=0;i<this.Toggles['kexuanwanfa'].length;i++){
            if(this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active){
                kexuanwanfa.push(i);
            }
        }
        for(let i=0;i<this.Toggles['gaoji'].length;i++){
            if(this.Toggles['gaoji'][i].getChildByName('checkmark').active){
                gaoji.push(i);
            }
        }
        sendPack = {
                    "xianShi":xianShi,
                    "jiesan":jiesan,
                    "chatai":chatai,
                    "chipai":chipai,
                    "fangjian":fangjian,
                    //房间默认配置（人数局数支付）
                    "playerMinNum":renshu[0],
                    "playerNum":renshu[1],
                    "setCount":setCount,
                    "paymentRoomCardType":isSpiltRoomCard,
                    "kexuanwanfa":kexuanwanfa,
                    "gaoji":gaoji,
                    
        };
        return sendPack;
    },
});

module.exports = zjmjChildCreateRoom;