(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/sj/sjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3b5b42sIxxBf7fHvJEaL55d', 'sjChildCreateRoom', __filename);
// script/ui/uiGame/sj/sjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var sjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var xianShi = this.GetIdxByKey('xianShi');
		var moshi = this.GetIdxByKey('moshi');
		var zhupaixuanze = this.GetIdxByKey('zhupaixuanze');
		var shuyingfengding = this.GetIdxByKey('shuyingfengding');
		var gaoji = [];
		for (var i = 0; i < this.Toggles['gaoji'].length; i++) {
			if (this.Toggles['gaoji'][i].getChildByName('checkmark').active) {
				gaoji.push(i);
			}
		}
		var kexuanwanfa = [];
		for (var _i = 0; _i < this.Toggles['kexuanwanfa'].length; _i++) {
			if (this.Toggles['kexuanwanfa'][_i].getChildByName('checkmark').active) {
				kexuanwanfa.push(_i);
			}
		}
		var fangjian = [];
		for (var _i2 = 0; _i2 < this.Toggles['fangjian'].length; _i2++) {
			if (this.Toggles['fangjian'][_i2].getChildByName('checkmark').active) {
				fangjian.push(_i2);
			}
		}
		var jiesan = this.GetIdxByKey("jiesan");
		sendPack = {
			"moshi": moshi,
			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard,
			"xianShi": xianShi,
			"zhupaixuanze": zhupaixuanze,
			"shuyingfengding": shuyingfengding,
			"gaoji": gaoji,
			"kexuanwanfa": kexuanwanfa,
			"fangjian": fangjian,
			"jiesan": jiesan,
			"sign": 0
		};
		return sendPack;
	}
});

module.exports = sjChildCreateRoom;

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
        //# sourceMappingURL=sjChildCreateRoom.js.map
        