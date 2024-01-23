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
        let difen = this.GetIdxByKey('difen');
        let dizhufengding = this.GetIdxByKey('dizhufengding');
        let quedingdizhu = this.GetIdxByKey('quedingdizhu');
        let zhadan = this.GetIdxByKey('zhadan');
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
        let jiabei = [];
        for (let i = 0; i < this.Toggles['jiabei'].length; i++) {
            if (this.Toggles['jiabei'][i].getChildByName('checkmark').active) {
                jiabei.push(i);
            }
        }
        let kexuanwanfa = [];
        for (let i = 0; i < this.Toggles['kexuanwanfa'].length; i++) {
            if (this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active) {
                kexuanwanfa.push(i);
            }
        }
        let fangjian=[];
        for(let i=0;i<this.Toggles['fangjian'].length;i++){
            if(this.Toggles['fangjian'][i].getChildByName('checkmark').active){
                fangjian.push(i);
            }
        }
        let gaoji=[];
        for(let i=0;i<this.Toggles['gaoji'].length;i++){
            if(this.Toggles['gaoji'][i].getChildByName('checkmark').active){
                gaoji.push(i);
            }
        }
        sendPack = {
            "setCount":setCount,
            "playerMinNum":renshu[0],
            "playerNum":renshu[1],
            "paymentRoomCardType":isSpiltRoomCard,
            "difen":difen,
            "dizhufengding":dizhufengding,
            "quedingdizhu":quedingdizhu,
            "zhadan":zhadan,
            "fangjian":fangjian,
            "gaoji":gaoji,
            "xianShi":xianShi,
            "jiesan":jiesan,
            "jiabei":jiabei,
            "kexuanwanfa":kexuanwanfa,
            "sandai":sandai,
            "sidai":sidai,
        };
        return sendPack;
    },
});

module.exports = ddzChildCreateRoom;