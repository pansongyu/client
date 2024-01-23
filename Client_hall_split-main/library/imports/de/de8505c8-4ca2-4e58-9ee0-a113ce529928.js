"use strict";
cc._RF.push(module, 'de850XITKJOWJ7goRPOUpko', 'ytmjChildCreateRoom');
// script/ui/uiGame/ytmj/ytmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var fengDing = this.GetIdxByKey("fengDing");
		var xianShi = this.GetIdxByKey("xianShi");
		var gaoji = [];
		for (var i = 0; i < this.Toggles['gaoji'].length; i++) {
			if (this.Toggles['gaoji'][i].getChildByName('checkmark').active) {
				gaoji.push(i);
			}
		}
		sendPack = {
			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"fengDing": fengDing,
			"xianShi": xianShi,
			"gaoji": gaoji,
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard
		};
		return sendPack;
	}

});

module.exports = fzmjChildCreateRoom;

cc._RF.pop();