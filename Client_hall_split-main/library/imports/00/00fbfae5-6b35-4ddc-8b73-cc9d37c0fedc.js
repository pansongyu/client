"use strict";
cc._RF.push(module, '00fbfrlazVN3ItzzJ03wP7c', 'jsnyzmjChildCreateRoom');
// script/ui/uiGame/jsnyzmj/jsnyzmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var jsnyzmjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var difen = this.GetIdxByKey('difen');
		var liupai = this.GetIdxByKey('liupai');
		var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
		var fangjian = this.GetIdxsByKey('fangjian');
		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');
		var gaoji = this.GetIdxsByKey('gaoji');
		sendPack = {
			"difen": difen,
			"liupai": liupai,
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

module.exports = jsnyzmjChildCreateRoom;

cc._RF.pop();