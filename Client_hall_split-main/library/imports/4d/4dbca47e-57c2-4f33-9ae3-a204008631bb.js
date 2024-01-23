"use strict";
cc._RF.push(module, '4dbcaR+V8JPM5rjogQAhjG7', 'dzmjChildCreateRoom');
// script/ui/uiGame/dzmj/dzmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var dzmjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var hufan = this.GetIdxByKey('hufan');
		var yipaoduoxiang = this.GetIdxByKey('yipaoduoxiang');
		var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
		var fangjian = this.GetIdxsByKey('fangjian');
		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');
		var gaoji = this.GetIdxsByKey('gaoji');
		sendPack = {
			"hufan": hufan,
			"yipaoduoxiang": yipaoduoxiang,
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

module.exports = dzmjChildCreateRoom;

cc._RF.pop();