"use strict";
cc._RF.push(module, '8525bfyC5JMDIxsBZq+p6w4', 'zgdssChildCreateRoom');
// script/ui/uiGame/zgdss/zgdssChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var zgcpChildCreateRoom = cc.Class({
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

		var fanshushangxian = this.GetIdxByKey("fanshushangxian");
		var chaofanjiadi = this.GetIdxByKey("chaofanjiadi");
		var laizishuliang = this.GetIdxByKey("laizishuliang");
		var jiesan = this.GetIdxByKey("jiesan");
		var kexuanwanfa = [];
		for (var _i = 0; _i < this.Toggles["kexuanwanfa"].length; _i++) {
			if (this.Toggles["kexuanwanfa"][_i].getChildByName("checkmark").active) {
				kexuanwanfa.push(_i);
			}
		}
		var fangjian = [];
		for (var _i2 = 0; _i2 < this.Toggles['fangjian'].length; _i2++) {
			if (this.Toggles['fangjian'][_i2].getChildByName('checkmark').active) {
				fangjian.push(_i2);
			}
		}
		sendPack = {
			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"laizishuliang": laizishuliang,
			"paymentRoomCardType": isSpiltRoomCard,
			"fanshushangxian": fanshushangxian,
			"chaofanjiadi": chaofanjiadi,
			"xianShi": xianShi,
			"kexuanwanfa": kexuanwanfa,
			"fangjian": fangjian,
			"gaoji": gaoji,
			"jiesan": jiesan,
			"sign": 0
		};
		return sendPack;
	}
});

module.exports = zgcpChildCreateRoom;

cc._RF.pop();