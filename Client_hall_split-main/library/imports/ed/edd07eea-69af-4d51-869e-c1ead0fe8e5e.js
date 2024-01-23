"use strict";
cc._RF.push(module, 'edd077qaa9NUYaewerQ/o5e', 'px6gtChildCreateRoom');
// script/ui/uiGame/px6gt/px6gtChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var px6gtChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var zhadanjiangli = this.GetIdxByKey('zhadanjiangli');
		var suanjiangguize = this.GetIdxByKey('suanjiangguize');
		var lianmai = this.GetIdxByKey('lianmai');
		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');
		var gaoji = [];
		for (var i = 0; i < this.Toggles['gaoji'].length; i++) {
			if (this.Toggles['gaoji'][i].getChildByName('checkmark').active) {
				gaoji.push(i);
			}
		}
		var fangjian = [];
		for (var _i = 0; _i < this.Toggles['fangjian'].length; _i++) {
			if (this.Toggles['fangjian'][_i].getChildByName('checkmark').active) {
				fangjian.push(_i);
			}
		}
		var kexuanwanfa = [];
		for (var _i2 = 0; _i2 < this.Toggles['kexuanwanfa'].length; _i2++) {
			if (this.Toggles['kexuanwanfa'][_i2].getChildByName('checkmark').active) {
				kexuanwanfa.push(_i2);
			}
		}
		sendPack = {
			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard,
			"zhadanjiangli": zhadanjiangli,
			"suanjiangguize": suanjiangguize,
			"lianmai": lianmai,
			"xianShi": xianShi,
			"jiesan": jiesan,
			"gaoji": gaoji,
			"kexuanwanfa": kexuanwanfa,
			"fangjian": fangjian
		};
		return sendPack;
	},
	UpdateOnClickToggle: function UpdateOnClickToggle() {
		//选项置灰
		if (this.Toggles["kexuanwanfa"]) {
			this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
			if (!this.Toggles["suanjiangguize"][0].getChildByName("checkmark").active) {
				this.Toggles['kexuanwanfa'][4].getChildByName("checkmark").active = false;
				//置灰
				if (this.Toggles['kexuanwanfa'][4].getChildByName("label")) {
					this.Toggles['kexuanwanfa'][4].getChildByName("label").color = cc.color(180, 180, 180);
				}
			} else {
				//恢复
				if (this.Toggles['kexuanwanfa'][4].getChildByName("label")) {
					this.Toggles['kexuanwanfa'][4].getChildByName("label").color = cc.color(158, 49, 16);
				}
			}
		}
	}
});

module.exports = px6gtChildCreateRoom;

cc._RF.pop();