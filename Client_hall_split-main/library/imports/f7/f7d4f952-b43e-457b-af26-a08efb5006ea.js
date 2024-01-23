"use strict";
cc._RF.push(module, 'f7d4flStD5Fe68moI77UAbq', 'pyzhwChildCreateRoom');
// script/ui/uiGame/pyzhw/pyzhwChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var sssChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var xianShi = this.GetIdxByKey('xianShi');
		var fangjian = [];
		for (var i = 0; i < this.Toggles['fangjian'].length; i++) {
			if (this.Toggles['fangjian'][i].getChildByName('checkmark').active) {
				fangjian.push(i);
			}
		}
		var kexuanwanfa = [];
		for (var _i = 0; _i < this.Toggles['kexuanwanfa'].length; _i++) {
			if (this.Toggles['kexuanwanfa'][_i].getChildByName('checkmark').active) {
				kexuanwanfa.push(_i);
			}
		}
		var gaoji = [];
		for (var _i2 = 0; _i2 < this.Toggles['gaoji'].length; _i2++) {
			if (this.Toggles['gaoji'][_i2].getChildByName('checkmark').active) {
				gaoji.push(_i2);
			}
		}
		var jiesan = this.GetIdxByKey("jiesan");
		sendPack = {
			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard,
			"fangjian": fangjian,
			"xianShi": xianShi,
			"gaoji": gaoji,
			"kexuanwanfa": kexuanwanfa,
			"jiesan": jiesan,
			"sign": 0
		};
		return sendPack;
	}
});

module.exports = sssChildCreateRoom;

cc._RF.pop();