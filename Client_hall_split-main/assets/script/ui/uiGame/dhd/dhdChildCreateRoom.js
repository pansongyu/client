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
		let wanfa = this.GetIdxByKey('wanfa');
		let fenzhi = this.GetIdxByKey('fenzhi');
		let xianShi = this.GetIdxByKey('xianShi');
		let jiesan = this.GetIdxByKey('jiesan');
		let gaoji = [];
		for (let i = 0; i < this.Toggles["gaoji"].length; i++) {
			if (this.Toggles["gaoji"][i].getChildByName("checkmark").active) {
				gaoji.push(i);
			}
		}
		let kexuanwanfa = [];
		for (let i = 0; i < this.Toggles["kexuanwanfa"].length; i++) {
			if (this.Toggles["kexuanwanfa"][i].getChildByName("checkmark").active) {
				kexuanwanfa.push(i);
			}
		}
		let fangjian = [];
		for (let i = 0; i < this.Toggles["fangjian"].length; i++) {
			if (this.Toggles["fangjian"][i].getChildByName("checkmark").active) {
				fangjian.push(i);
			}
		}
		sendPack = {
			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard,
			"wanfa": wanfa,
			"fenzhi": fenzhi,
			"xianShi": xianShi,
			"jiesan": jiesan,
			"kexuanwanfa": kexuanwanfa,
			"gaoji": gaoji,
			"fangjian": fangjian,
		};
		return sendPack;
	},
});


module.exports = fzmjChildCreateRoom;