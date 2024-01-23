/*
创建房间子界面
 */
var app = require("app");

var sjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
		let sendPack = {};
		let xianShi = this.GetIdxByKey('xianShi');
		let moshi = this.GetIdxByKey('moshi');
		let zhupaixuanze = this.GetIdxByKey('zhupaixuanze');
		let shuyingfengding = this.GetIdxByKey('shuyingfengding');
		let gaoji = [];
		for (let i = 0; i < this.Toggles['gaoji'].length; i++) {
			if (this.Toggles['gaoji'][i].getChildByName('checkmark').active) {
				gaoji.push(i);
			}
		}
		let kexuanwanfa = [];
		for (let i = 0; i < this.Toggles['kexuanwanfa'].length; i++) {
			if (this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active) {
				kexuanwanfa.push(i);
			}
		}
		let fangjian = [];
		for (let i = 0; i < this.Toggles['fangjian'].length; i++) {
			if (this.Toggles['fangjian'][i].getChildByName('checkmark').active) {
				fangjian.push(i);
			}
		}
		let jiesan = this.GetIdxByKey("jiesan");
		sendPack = {
			"moshi": moshi,
			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard,
			"xianShi": xianShi,
			"zhupaixuanze": zhupaixuanze,
			"shuyingfengding": shuyingfengding,
			"gaoji": gaoji,
			"kexuanwanfa": kexuanwanfa,
			"fangjian": fangjian,
			"jiesan": jiesan,
			"sign": 0,
		};
		return sendPack;
	},
});

module.exports = sjChildCreateRoom;