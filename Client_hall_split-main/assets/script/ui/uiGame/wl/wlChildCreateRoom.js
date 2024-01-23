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
            let tongse = this.GetIdxByKey('tongse');
            let shunjiang = this.GetIdxByKey('shunjiang');
            let fapai = this.GetIdxByKey('fapai');
            let beilv = this.GetIdxByKey('beilv');
            let sudu = this.GetIdxByKey('sudu');
            let wujiang = this.GetIdxByKey('wujiang');
            let wanfa = this.GetIdxByKey('wanfa');
            //let fengDing=this.GetIdxByKey('fengDing');

            let jiesan = this.GetIdxByKey('jiesan');
            let xianShi = this.GetIdxByKey('xianShi');
            let gaoji=[];
            for(let i=0;i<this.Toggles['gaoji'].length;i++){
                if(this.Toggles['gaoji'][i].getChildByName('checkmark').active){
                    gaoji.push(i);
                }
            }
            let kexuanwanfa=[];
            for(let i=0;i<this.Toggles['kexuanwanfa'].length;i++){
                if(this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active){
                    kexuanwanfa.push(i);
                }
            }
            sendPack = {
                        "playerMinNum":renshu[0],
                        "playerNum":renshu[1],
                        "setCount":setCount,
                        "paymentRoomCardType":isSpiltRoomCard,

                        "tongse":tongse,
                        "shunjiang":shunjiang,
                        "fapai":fapai,
                        "beilv":beilv,
                        "sudu":sudu,
                        "wujiang":wujiang,
                        "wanfa":wanfa,
                        //"fengDing":fengDing,

                        "kexuanwanfa":kexuanwanfa,
                        "xianShi":xianShi,
                        "jiesan":jiesan,
                        "gaoji":gaoji,
            };
            return sendPack;
    },
});

module.exports = sssChildCreateRoom;