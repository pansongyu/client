/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
		let sendPack = {};
		let difen = this.GetIdxByKey('difen');
        let xianShi = this.GetIdxByKey('xianShi');
        let jiesan = this.GetIdxByKey('jiesan');
        let fengDing = this.GetIdxByKey('fengDing');
        let kexuanwanfa=[];
        for(let i=0;i<this.Toggles['kexuanwanfa'].length;i++){
            if(this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active){
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
            "kexuanwanfa":kexuanwanfa,
            "fangjian":fangjian,
            "gaoji":gaoji,
            "difen":difen,
            "jiesan":jiesan,
            "fengDing":fengDing,
            "xianShi":xianShi,
            "playerMinNum":renshu[0],
            "playerNum":renshu[1],
            "setCount":setCount,
            "paymentRoomCardType":isSpiltRoomCard,
        };
		return sendPack;
	},
});


module.exports = fzmjChildCreateRoom;