"use strict";
cc._RF.push(module, 'ddcf7ZisT9NbZeDUzNhJPeH', 'jxfzmjChildCreateRoom');
// script/ui/uiGame/jxfzmj/jxfzmjChildCreateRoom.js

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
		var hupai = this.GetIdxByKey("hupai");
		var shaozhuang = this.GetIdxByKey("shaozhuang");
		var fengDing = this.GetIdxByKey('fengDing');
		var jiangmaxuanze = this.GetIdxByKey("jiangmaxuanze");
		var jiangma = this.GetIdxByKey("jiangma");
		var jiesan = this.GetIdxByKey("jiesan");
		var xianShi = this.GetIdxByKey("xianShi");
		var fangjian = [];
		for (var i = 0; i < this.Toggles['fangjian'].length; i++) {
			if (this.Toggles['fangjian'][i].getChildByName('checkmark').active) {
				fangjian.push(i);
			}
		}
		var kexuanwanfa = [];
		for (var _i = 0; _i < this.Toggles['kexuanwanfa'].length; _i++) {
			if (this.Toggles['kexuanwanfa'][_i].getChildByName('checkmark').active) {
				kexuanwanfa.push(_i);
			}
		}
		var gaoji = [];
		for (var _i2 = 0; _i2 < this.Toggles['gaoji'].length; _i2++) {
			if (this.Toggles['gaoji'][_i2].getChildByName('checkmark').active) {
				gaoji.push(_i2);
			}
		}
		sendPack = {
			"hupai": hupai,
			"shaozhuang": shaozhuang,
			"fengDing": fengDing,
			"jiangmaxuanze": jiangmaxuanze,
			"jiangma": jiangma,
			"jiesan": jiesan,
			"xianShi": xianShi,
			"fangjian": fangjian,
			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard,
			"gaoji": gaoji,
			"kexuanwanfa": kexuanwanfa
		};
		return sendPack;
	}
});

module.exports = fzmjChildCreateRoom;

cc._RF.pop();