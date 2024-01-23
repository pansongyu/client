"use strict";
cc._RF.push(module, 'b1ea62VOK1OOJyUcfMAP1t1', 'cxxzmjChildCreateRoom');
// script/ui/uiGame/cxxzmj/cxxzmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var jsnyzmjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},

	// 需要自己重写
	// CreateSendPack -start-
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var wanfa = this.GetIdxByKey('wanfa');
		var fangjian = this.GetIdxsByKey('fangjian');
		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');
		var gaoji = this.GetIdxsByKey('gaoji');

		sendPack = {
			"wanfa": wanfa,
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

module.exports = jsnyzmjChildCreateRoom;

cc._RF.pop();