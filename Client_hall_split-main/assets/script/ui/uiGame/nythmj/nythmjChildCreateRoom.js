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
		let difen=this.GetIdxByKey('difen');
		let hufa=this.GetIdxByKey('hufa');
		let piaofen=this.GetIdxByKey('piaofen');
		let kexuanwanfa=this.GetIdxsByKey('kexuanwanfa');
		let fangjian=this.GetIdxsByKey('fangjian');
		let xianShi=this.GetIdxByKey('xianShi');
		let jiesan=this.GetIdxByKey('jiesan');
		let gaoji=this.GetIdxsByKey('gaoji');

    	sendPack = {
			"difen":difen,
			"hufa":hufa,
			"piaofen":piaofen,
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
		return sendPack;
    },
});

module.exports = bzqzmjChildCreateRoom;