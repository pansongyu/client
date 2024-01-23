"use strict";
cc._RF.push(module, '291c11wU4xFu6lrlgOYcVML', 'dhdChildCreateRoom');
// script/ui/uiGame/dhd/dhdChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var wanfa = this.GetIdxByKey('wanfa');
		var fenzhi = this.GetIdxByKey('fenzhi');
		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');
		var gaoji = [];
		for (var i = 0; i < this.Toggles["gaoji"].length; i++) {
			if (this.Toggles["gaoji"][i].getChildByName("checkmark").active) {
				gaoji.push(i);
			}
		}
		var kexuanwanfa = [];
		for (var _i = 0; _i < this.Toggles["kexuanwanfa"].length; _i++) {
			if (this.Toggles["kexuanwanfa"][_i].getChildByName("checkmark").active) {
				kexuanwanfa.push(_i);
			}
		}
		var fangjian = [];
		for (var _i2 = 0; _i2 < this.Toggles["fangjian"].length; _i2++) {
			if (this.Toggles["fangjian"][_i2].getChildByName("checkmark").active) {
				fangjian.push(_i2);
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
			"fangjian": fangjian
		};
		return sendPack;
	}
});

module.exports = fzmjChildCreateRoom;

cc._RF.pop();