"use strict";
cc._RF.push(module, '3ccc4n3t1xFhLoHUw7N0ZWm', 'yxlsChildCreateRoom');
// script/ui/uiGame/yxls/yxlsChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var sssChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var xianShi = this.GetIdxByKey('xianShi');
		var gaoji = [];
		for (var i = 0; i < this.Toggles['gaoji'].length; i++) {
			if (this.Toggles['gaoji'][i].getChildByName('checkmark').active) {
				gaoji.push(i);
			}
		}
		var huludaoshu = this.GetIdxByKey("huludaoshu");
		var teshupaixing = this.GetIdxByKey("teshupaixing");
		var jiesan = this.GetIdxByKey("jiesan");
		var kexuanwanfa = [];
		for (var _i = 0; _i < this.Toggles["kexuanwanfa"].length; _i++) {
			if (this.Toggles["kexuanwanfa"][_i].getChildByName("checkmark").active) {
				kexuanwanfa.push(_i);
			}
		}
		sendPack = {
			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard,
			"huludaoshu": huludaoshu,
			"teshupaixing": teshupaixing,
			"xianShi": xianShi,
			"kexuanwanfa": kexuanwanfa,
			"gaoji": gaoji,
			"jiesan": jiesan,
			"sign": 0
		};
		return sendPack;
	}
});

module.exports = sssChildCreateRoom;

cc._RF.pop();