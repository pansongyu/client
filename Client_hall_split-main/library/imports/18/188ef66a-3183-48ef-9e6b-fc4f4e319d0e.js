"use strict";
cc._RF.push(module, '188efZqMYNI755r/E9OMZ0O', 'bjpkChildCreateRoom');
// script/ui/uiGame/bjpk/bjpkChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var bjpkChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');
		var wanfa = this.GetIdxByKey('wanfa');
		var paixing = [];
		for (var i = 0; i < this.Toggles['paixing'].length; i++) {
			if (this.Toggles['paixing'][i].getChildByName('checkmark').active) {
				paixing.push(i);
			}
		}
		var kexuanwanfa = [];
		for (var _i = 0; _i < this.Toggles['kexuanwanfa'].length; _i++) {
			if (this.Toggles['kexuanwanfa'][_i].getChildByName('checkmark').active) {
				kexuanwanfa.push(_i);
			}
		}
		var fangjian = [];
		for (var _i2 = 0; _i2 < this.Toggles['fangjian'].length; _i2++) {
			if (this.Toggles['fangjian'][_i2].getChildByName('checkmark').active) {
				fangjian.push(_i2);
			}
		}
		var gaoji = [];
		for (var _i3 = 0; _i3 < this.Toggles['gaoji'].length; _i3++) {
			if (this.Toggles['gaoji'][_i3].getChildByName('checkmark').active) {
				gaoji.push(_i3);
			}
		}

		sendPack = {
			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard,
			"xianShi": xianShi,
			"fangjian": fangjian,
			"kexuanwanfa": kexuanwanfa,
			'wanfa': wanfa,
			'paixing': paixing,
			"gaoji": gaoji,
			"jiesan": jiesan
		};
		return sendPack;
	}
});

module.exports = bjpkChildCreateRoom;

cc._RF.pop();