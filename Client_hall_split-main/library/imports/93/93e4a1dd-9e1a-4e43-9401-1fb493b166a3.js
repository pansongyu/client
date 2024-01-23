"use strict";
cc._RF.push(module, '93e4aHdnhpOQ5QBH7STsWaj', 'qzcsmjChildCreateRoom');
// script/ui/uiGame/qzcsmj/qzcsmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var qzcsmjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var difen = this.GetIdxByKey('difen');
		var caipiao = this.GetIdxByKey('caipiao');
		var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
		var fangjian = this.GetIdxsByKey('fangjian');
		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');
		var gaoji = this.GetIdxsByKey('gaoji');
		sendPack = {
			"difen": difen,
			"caipiao": caipiao,
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

module.exports = qzcsmjChildCreateRoom;

cc._RF.pop();