/*
创建房间子界面
 */
var app = require("app");

var gycpChildCreateRoom = cc.Class({
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
		let fengding = this.GetIdxByKey("fengding");
		let dianpao = this.GetIdxByKey("dianpao");
		let dangjia = this.GetIdxByKey("dangjia");
		// let fanfan = this.GetIdxByKey("fanfan");
		let zuozhuang = this.GetIdxByKey("zuozhuang");
		let jiesan = this.GetIdxByKey("jiesan");
		let kexuanwanfa = [];
		for (let i = 0; i < this.Toggles["kexuanwanfa"].length; i++) {
			if (this.Toggles["kexuanwanfa"][i].getChildByName("checkmark").active) {
				kexuanwanfa.push(i);
			}
		}
		let fangjian = [];
		for (let i = 0; i < this.Toggles['fangjian'].length; i++) {
			if (this.Toggles['fangjian'][i].getChildByName('checkmark').active) {
				fangjian.push(i);
			}
		}
		sendPack = {
			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard,
			"fengding": fengding,
			"dianpao": dianpao,
			"dangjia": dangjia,
			// "fanfan": fanfan,
			"zuozhuang": zuozhuang,
			"xianShi": xianShi,
			"kexuanwanfa": kexuanwanfa,
			"fangjian": fangjian,
			"gaoji": gaoji,
			"jiesan": jiesan,
			"sign": 0,
		};
		return sendPack;
	},
});


module.exports = gycpChildCreateRoom;