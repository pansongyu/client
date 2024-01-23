"use strict";
cc._RF.push(module, 'c41122TUjtOa6bAvD6+3fsM', 'tcmjChildCreateRoom');
// script/ui/uiGame/tcmj/tcmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	OnShow: function OnShow() {
		this.zpmjToggleIndex = -1;
	},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var lazi = this.GetIdxByKey("lazi");
		var jiesan = this.GetIdxByKey("jiesan");
		var xianShi = this.GetIdxByKey("xianShi");
		var beishu = this.GetIdxByKey('beishu');
		var bangangtou = this.GetIdxByKey("bangangtou");

		/*let fangjian = [];
  for (let i = 0; i < this.Toggles['fangjian'].length; i++) {
  if (this.Toggles['fangjian'][i].getChildByName('checkmark').active) {
  fangjian.push(i);
  }
  }*/
		var kexuanwanfa = [];
		for (var i = 0; i < this.Toggles['kexuanwanfa'].length; i++) {
			if (this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active) {
				kexuanwanfa.push(i);
			}
		}
		var gaoji = [];
		for (var _i = 0; _i < this.Toggles['gaoji'].length; _i++) {
			if (this.Toggles['gaoji'][_i].getChildByName('checkmark').active) {
				gaoji.push(_i);
			}
		}
		sendPack = {
			"lazi": lazi,
			"beishu": beishu,
			"jiesan": jiesan,
			"bangangtou": bangangtou,
			"xianShi": xianShi,
			// "fangjian": fangjian,
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