/*
创建房间子界面
 */
var app = require("app");

var ysdzChildCreateRoom = cc.Class({
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
		let fangjian = [];
		for (let i = 0; i < this.Toggles["fangjian"].length; i++) {
			if (this.Toggles["fangjian"][i].getChildByName("checkmark").active) {
				fangjian.push(i);
			}
		}
		let jiesan = this.GetIdxByKey("jiesan");
		let kexuanwanfa = [];
		for (let i = 0; i < this.Toggles["kexuanwanfa"].length; i++) {
			if (this.Toggles["kexuanwanfa"][i].getChildByName("checkmark").active) {
				kexuanwanfa.push(i);
			}
		}
		let wanfa = this.GetIdxByKey('wanfa');
		let difen = this.GetIdxByKey('difen');

		let kaiJiangs=[];
		for(let i=0;i<this.Toggles['kaiJiangs'].length;i++){
			if(this.Toggles['kaiJiangs'][i].getChildByName('checkmark').active){
				kaiJiangs.push(i);
			}
		}
		sendPack = {
			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard,
			"xianShi": xianShi,
			"kexuanwanfa": kexuanwanfa,
			"fangjian": fangjian,
			"gaoji": gaoji,
			"jiesan": jiesan,
			"difen": difen,
			"wanfa":wanfa,
			"kaiJiangs":kaiJiangs,
			"sign": 0,
		};
		return sendPack;
	},
});

module.exports = ysdzChildCreateRoom;