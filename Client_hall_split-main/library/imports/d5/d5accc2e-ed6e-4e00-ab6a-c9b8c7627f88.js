"use strict";
cc._RF.push(module, 'd5accwu7W5OAKtqybjHYn+I', 'gymjChildCreateRoom');
// script/ui/uiGame/gymj/gymjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var gymjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var difen = this.GetIdxByKey("difen");
		var huashu = this.GetIdxByKey("huashu");
		var wanfa = this.GetIdxByKey("wanfa");
		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');
		var kexuanwanfa = [];
		for (var i = 0; i < this.Toggles['kexuanwanfa'].length; i++) {
			if (this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active) {
				kexuanwanfa.push(i);
			}
		}
		var fangjian = [];
		for (var _i = 0; _i < this.Toggles['fangjian'].length; _i++) {
			if (this.Toggles['fangjian'][_i].getChildByName('checkmark').active) {
				fangjian.push(_i);
			}
		}
		var gaoji = [];
		for (var _i2 = 0; _i2 < this.Toggles['gaoji'].length; _i2++) {
			if (this.Toggles['gaoji'][_i2].getChildByName('checkmark').active) {
				gaoji.push(_i2);
			}
		}
		sendPack = {
			"kexuanwanfa": kexuanwanfa,
			"fangjian": fangjian,
			"gaoji": gaoji,
			"difen": difen,
			"huashu": huashu,
			"wanfa": wanfa,
			"jiesan": jiesan,
			"xianShi": xianShi,
			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard
		};
		return sendPack;
	}
});

module.exports = gymjChildCreateRoom;

cc._RF.pop();