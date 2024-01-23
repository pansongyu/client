"use strict";
cc._RF.push(module, '669726C0W5PTqlQtScDmii9', 'lhgmmjChildCreateRoom');
// script/ui/uiGame/lhgmmj/lhgmmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var lhgmmjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var louhu = this.GetIdxByKey('louhu');
		var maima = this.GetIdxByKey('maima');
		var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
		var fangjian = this.GetIdxsByKey('fangjian');
		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');
		var gaoji = this.GetIdxsByKey('gaoji');

		sendPack = {
			"louhu": louhu,
			"maima": maima,
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

module.exports = lhgmmjChildCreateRoom;

cc._RF.pop();