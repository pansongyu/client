(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/hnsymj/hnsymjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9933ewesX1PIbLRT7E1aVIs', 'hnsymjChildCreateRoom', __filename);
// script/ui/uiGame/hnsymj/hnsymjChildCreateRoom.js

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

		var kechui = this.GetIdxByKey('kechui');
		var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
		var fangjian = this.GetIdxsByKey('fangjian');
		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');
		var gaoji = this.GetIdxsByKey('gaoji');

		sendPack = {

			"kechui": kechui,
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
		if (sendPack.kexuanwanfa.indexOf(2) == -1) {
			sendPack.kechui = -1;
		}
		return sendPack;
	},
	UpdateOnClickToggle: function UpdateOnClickToggle() {
		if (this.Toggles['kechui']) {
			if (!this.Toggles['kexuanwanfa'][2].getChildByName("checkmark").active) {
				this.Toggles['kechui'][0].parent.active = false;
			} else {
				this.Toggles['kechui'][0].parent.active = true;
			}
		}
	}
});

module.exports = bzqzmjChildCreateRoom;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=hnsymjChildCreateRoom.js.map
        