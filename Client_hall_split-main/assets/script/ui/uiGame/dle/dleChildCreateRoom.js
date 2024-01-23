/*
创建房间子界面
 */
var app = require("app");

var fddzChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
		let sendPack = {};
		let paizhi = this.GetIdxByKey('paizhi');
        let paishu = this.GetIdxByKey('paishu');

        let xianShi = this.GetIdxByKey('xianShi');
        let jiesan = this.GetIdxByKey('jiesan');
        let kexuanwanfa = [];
        let gaoji=[];
       
        for(let i=0;i<this.Toggles['kexuanwanfa'].length;i++){
            let isCheck = this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active;
            if(isCheck){
                if(this.Toggles['kexuanwanfa'][i].serverIdx){
                    kexuanwanfa.push(this.Toggles['kexuanwanfa'][i].serverIdx);
                }
                else{
                    kexuanwanfa.push(i);
                }
            }
        }
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
            "paizhi":paizhi,
            "paishu":paishu,
            "jiesan":jiesan,
            "xianShi":xianShi,
            "kexuanwanfa":kexuanwanfa,
            "gaoji":gaoji,
        };
		return sendPack;
	},
});

module.exports = fddzChildCreateRoom;