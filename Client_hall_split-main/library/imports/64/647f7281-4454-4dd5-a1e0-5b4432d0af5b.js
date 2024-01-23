"use strict";
cc._RF.push(module, '647f7KBRFRN1aHgW0Qy0K9b', 'xyhcmjChildCreateRoom');
// script/ui/uiGame/xyhcmj/xyhcmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var bzqzmjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var difen = this.GetIdxByKey('difen');
		var shuangzui = this.GetIdxsByKey('shuangzui');
		var zimo = this.GetIdxByKey('zimo');
		var zhuangjia = this.GetIdxByKey('zhuangjia');
		var dianpao = this.GetIdxByKey('dianpao');
		var fengDing = this.GetIdxByKey('fengDing');
		var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
		var fangjian = this.GetIdxsByKey('fangjian');
		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');
		var gaoji = this.GetIdxsByKey('gaoji');

		sendPack = {
			"difen": difen,
			"shuangzui": shuangzui,
			"zimo": zimo,
			"zhuangjia": zhuangjia,
			"dianpao": dianpao,
			"fengDing": fengDing,
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
	},
	AdjustSendPack: function AdjustSendPack(sendPack) {
		return sendPack;
	}
});

module.exports = bzqzmjChildCreateRoom;

cc._RF.pop();