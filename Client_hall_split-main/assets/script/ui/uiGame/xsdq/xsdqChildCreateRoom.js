/*
创建房间子界面
 */
var app = require("app");

var sjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {

	},

	// CreateSendPack -start-
	CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
		let sendPack = {};
		let wurenjiaozhu = this.GetIdxByKey('wurenjiaozhu');
		let duiwu = this.GetIdxByKey('duiwu');
		let kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
		let fangjian = this.GetIdxsByKey('fangjian');
		let xianShi = this.GetIdxByKey('xianShi');
		let jiesan = this.GetIdxByKey('jiesan');
		let gaoji = this.GetIdxsByKey('gaoji');

		sendPack = {
			"wurenjiaozhu": wurenjiaozhu,
			"duiwu": duiwu,
			"kexuanwanfa": kexuanwanfa,
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
	// CreateSendPack -end-


});

module.exports = sjChildCreateRoom;