(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/llfymj/llfymjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b4c9c6ytHFHZrFyg0zbalV4', 'llfymjChildCreateRoom', __filename);
// script/ui/uiGame/llfymj/llfymjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var llfymjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var wanfa = this.GetIdxByKey('wanfa');
		var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
		var fangjian = this.GetIdxsByKey('fangjian');
		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');
		var gaoji = this.GetIdxsByKey('gaoji');
		sendPack = {
			"wanfa": wanfa,
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

module.exports = llfymjChildCreateRoom;

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
        //# sourceMappingURL=llfymjChildCreateRoom.js.map
        