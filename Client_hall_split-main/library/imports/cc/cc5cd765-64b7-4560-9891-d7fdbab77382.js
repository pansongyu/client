"use strict";
cc._RF.push(module, 'cc5cddlZLdFYJiR1/26t3OC', 'glppChildCreateRoom');
// script/ui/uiGame/glpp/glppChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var lkwskChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},

	// CreateSendPack -start-
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var moshi = this.GetIdxByKey('moshi');
		var wanfa = this.GetIdxByKey('wanfa');
		var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
		var fangjian = this.GetIdxsByKey('fangjian');
		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');
		var gaoji = this.GetIdxsByKey('gaoji');

		sendPack = {
			"moshi": moshi,
			"wanfa": wanfa,
			"kexuanwanfa": kexuanwanfa,
			"fangjian": fangjian,
			"xianShi": xianShi,
			"jiesan": jiesan,
			"gaoji": gaoji,

			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard

		};
		return sendPack;
	}
});

module.exports = lkwskChildCreateRoom;

cc._RF.pop();