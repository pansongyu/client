/*
创建房间子界面
 */
var app = require("app");

var lkwskChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},

	// CreateSendPack -start-
	CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
    	let sendPack = {};
    	let difen = this.GetIdxByKey('difen');
    	let fangjian = this.GetIdxsByKey('fangjian');
    	let xianShi = this.GetIdxByKey('xianShi');
    	let jiesan = this.GetIdxByKey('jiesan');
    	let gaoji = this.GetIdxsByKey('gaoji');

    	sendPack = {
        	"difen": difen,
        	"fangjian": fangjian,
        	"xianShi": xianShi,
        	"jiesan": jiesan,
        	"gaoji": gaoji,

        	"playerMinNum": renshu[0],
        	"playerNum": renshu[1],
        	"setCount": setCount,
        	"paymentRoomCardType": isSpiltRoomCard,

    	}
    	return sendPack;
	},
	
});

module.exports = lkwskChildCreateRoom;