"use strict";
cc._RF.push(module, '52f29Ue/OFMzbSouZGqT9oW', 'ysdzChildCreateRoom');
// script/ui/uiGame/ysdz/ysdzChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var ysdzChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var xianShi = this.GetIdxByKey('xianShi');
		var gaoji = [];
		for (var i = 0; i < this.Toggles['gaoji'].length; i++) {
			if (this.Toggles['gaoji'][i].getChildByName('checkmark').active) {
				gaoji.push(i);
			}
		}
		var fangjian = [];
		for (var _i = 0; _i < this.Toggles["fangjian"].length; _i++) {
			if (this.Toggles["fangjian"][_i].getChildByName("checkmark").active) {
				fangjian.push(_i);
			}
		}
		var jiesan = this.GetIdxByKey("jiesan");
		var kexuanwanfa = [];
		for (var _i2 = 0; _i2 < this.Toggles["kexuanwanfa"].length; _i2++) {
			if (this.Toggles["kexuanwanfa"][_i2].getChildByName("checkmark").active) {
				kexuanwanfa.push(_i2);
			}
		}
		var wanfa = this.GetIdxByKey('wanfa');
		var difen = this.GetIdxByKey('difen');

		var kaiJiangs = [];
		for (var _i3 = 0; _i3 < this.Toggles['kaiJiangs'].length; _i3++) {
			if (this.Toggles['kaiJiangs'][_i3].getChildByName('checkmark').active) {
				kaiJiangs.push(_i3);
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
			"wanfa": wanfa,
			"kaiJiangs": kaiJiangs,
			"sign": 0
		};
		return sendPack;
	}
});

module.exports = ysdzChildCreateRoom;

cc._RF.pop();