(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/px3gt/px3gtChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '03bc1cX4+RIA60O5g1YW5i0', 'px3gtChildCreateRoom', __filename);
// script/ui/uiGame/px3gt/px3gtChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var px3gtChildCreateRoom = cc.Class({
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
	}
});

module.exports = px3gtChildCreateRoom;

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
        //# sourceMappingURL=px3gtChildCreateRoom.js.map
        