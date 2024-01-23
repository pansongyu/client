"use strict";
cc._RF.push(module, 'ac096avYGpCHIamH5BPlBoZ', 'xsdqChildCreateRoom');
// script/ui/uiGame/xsdq/xsdqChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var sjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},

	// CreateSendPack -start-
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var wurenjiaozhu = this.GetIdxByKey('wurenjiaozhu');
		var duiwu = this.GetIdxByKey('duiwu');
		var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
		var fangjian = this.GetIdxsByKey('fangjian');
		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');
		var gaoji = this.GetIdxsByKey('gaoji');

		sendPack = {
			"wurenjiaozhu": wurenjiaozhu,
			"duiwu": duiwu,
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
	// CreateSendPack -end-


});

module.exports = sjChildCreateRoom;

cc._RF.pop();