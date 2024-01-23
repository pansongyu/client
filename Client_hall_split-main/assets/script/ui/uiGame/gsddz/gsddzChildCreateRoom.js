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
        let dizhufengding = this.GetIdxByKey('dizhufengding');
        // let quedingdizhu = this.GetIdxByKey('quedingdizhu');
        let xianShi = this.GetIdxByKey('xianShi');
        let jiesan = this.GetIdxByKey('jiesan');
        let sandai = [];
        for (let i = 0; i < this.Toggles['sandai'].length; i++) {
            if (this.Toggles['sandai'][i].getChildByName('checkmark').active) {
                sandai.push(i);
            }
        }
        let sidai = [];
        for (let i = 0; i < this.Toggles['sidai'].length; i++) {
            if (this.Toggles['sidai'][i].getChildByName('checkmark').active) {
                sidai.push(i);
            }
        }
        let kexuanwanfa = [];
        for (let i = 0; i < this.Toggles['kexuanwanfa'].length; i++) {
            if (this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active) {
                kexuanwanfa.push(i);
            }
        }
        let gaoji=[];
        for(let i=0;i<this.Toggles['gaoji'].length;i++){
            if(this.Toggles['gaoji'][i].getChildByName('checkmark').active){
                gaoji.push(i);
            }
        }
        let fangjian = [];
        for (let i = 0; i < this.Toggles['fangjian'].length; i++) {
            if (this.Toggles['fangjian'][i].getChildByName('checkmark').active) {
                fangjian.push(i);
            }
        }
        sendPack = {
            "setCount":setCount,
            "playerMinNum":renshu[0],
            "playerNum":renshu[1],
            "paymentRoomCardType":isSpiltRoomCard,
            "dizhufengding":dizhufengding,
            // "quedingdizhu":quedingdizhu,
            "gaoji":gaoji,
            "xianShi":xianShi,
            "jiesan":jiesan,
            "kexuanwanfa":kexuanwanfa,
            "sandai":sandai,
            "sidai":sidai,
            "fangjian": fangjian,
        };
        return sendPack;
    },
});

module.exports = ddzChildCreateRoom;