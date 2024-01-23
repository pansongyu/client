"use strict";
cc._RF.push(module, 'a0384K58gBI/4Fy2lkuicXC', 'dkgmjChildCreateRoom');
// script/ui/uiGame/dkgmj/dkgmjChildCreateRoom.js

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
		var fengDing = this.GetIdxByKey('fengDing');
		var zimo = this.GetIdxByKey('zimo');
		var diangang = this.GetIdxByKey('diangang');
		var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
		var fangjian = this.GetIdxsByKey('fangjian');
		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');
		var gaoji = this.GetIdxsByKey('gaoji');

		sendPack = {
			"fengDing": fengDing,
			"zimo": zimo,
			"diangang": diangang,
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