/*
创建房间子界面
 */
var app = require("app");

var sssChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
		let sendPack = {};
		let xianShi = this.GetIdxByKey('xianShi');
		let gaoji = [];
		for (let i = 0; i < this.Toggles['gaoji'].length; i++) {
			if (this.Toggles['gaoji'][i].getChildByName('checkmark').active) {
				gaoji.push(i);
			}
		}
		let huludaoshu = this.GetIdxByKey("huludaoshu");
		let teshupaixing = this.GetIdxByKey("teshupaixing");
		let jiesan = this.GetIdxByKey("jiesan");
		let kexuanwanfa = [];
		for (let i = 0; i < this.Toggles["kexuanwanfa"].length; i++) {
			if (this.Toggles["kexuanwanfa"][i].getChildByName("checkmark").active) {
				kexuanwanfa.push(i);
			}
		}
		sendPack = {
			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard,
			"huludaoshu": huludaoshu,
			"teshupaixing": teshupaixing,
			"xianShi": xianShi,
			"kexuanwanfa": kexuanwanfa,
			"gaoji": gaoji,
			"jiesan": jiesan,
			"sign": 0,
		};
		return sendPack;
	},
});

module.exports = sssChildCreateRoom;