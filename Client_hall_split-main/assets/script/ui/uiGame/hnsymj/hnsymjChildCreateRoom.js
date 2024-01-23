/*
创建房间子界面
 */
var app = require("app");

var bzqzmjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function(renshu, setCount, isSpiltRoomCard) {
		let sendPack = {};
		
		let kechui=this.GetIdxByKey('kechui');
		let kexuanwanfa=this.GetIdxsByKey('kexuanwanfa');
		let fangjian=this.GetIdxsByKey('fangjian');
		let xianShi=this.GetIdxByKey('xianShi');
		let jiesan=this.GetIdxByKey('jiesan');
		let gaoji=this.GetIdxsByKey('gaoji');
		
    	sendPack = {
			
			"kechui":kechui,
			"kexuanwanfa":kexuanwanfa,
			"fangjian":fangjian,
			"xianShi":xianShi,
			"jiesan":jiesan,
			"gaoji":gaoji,

        	"playerMinNum": renshu[0],
        	"playerNum": renshu[1],
        	"setCount": setCount,
        	"paymentRoomCardType": isSpiltRoomCard,

    	}
    	return sendPack;
	},
	AdjustSendPack: function (sendPack) {
		if(sendPack.kexuanwanfa.indexOf(2) == -1){
			sendPack.kechui = -1;
		}
		return sendPack;
    },
    UpdateOnClickToggle: function () {
		if (this.Toggles['kechui']) {
			if(!this.Toggles['kexuanwanfa'][2].getChildByName("checkmark").active){
				this.Toggles['kechui'][0].parent.active = false;
			}else{
				this.Toggles['kechui'][0].parent.active = true;
			}
		}
	},
});

module.exports = bzqzmjChildCreateRoom;