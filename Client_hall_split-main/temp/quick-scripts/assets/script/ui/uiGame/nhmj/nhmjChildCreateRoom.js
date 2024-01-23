(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/nhmj/nhmjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'cab100rn79O1bK+VmA6ErYW', 'nhmjChildCreateRoom', __filename);
// script/ui/uiGame/nhmj/nhmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var xymjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var diFen = this.GetIdxByKey("diFen");
		var zhuangJia = this.GetIdxByKey("zhuangJia");
		var xianShi = this.GetIdxByKey("xianShi");
		var jiesan = this.GetIdxByKey("jiesan");
		var gaoji = [];
		for (var i = 0; i < this.Toggles["gaoji"].length; i++) {
			if (this.Toggles["gaoji"][i].getChildByName("checkmark").active) {
				gaoji.push(i);
			}
		}
		var kexuanwanfa = [];
		for (var _i = 0; _i < this.Toggles["kexuanwanfa"].length; _i++) {
			if (this.Toggles["kexuanwanfa"][_i].getChildByName("checkmark").active) {
				kexuanwanfa.push(_i);
			}
		}
		var fangjian = [];
		for (var _i2 = 0; _i2 < this.Toggles["fangjian"].length; _i2++) {
			if (this.Toggles["fangjian"][_i2].getChildByName("checkmark").active) {
				fangjian.push(_i2);
			}
		}
		sendPack = {
			"diFen": diFen,
			"zhuangJia": zhuangJia,
			"xianShi": xianShi,
			"jiesan": jiesan,
			"kexuanwanfa": kexuanwanfa,
			"fangjian": fangjian,
			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard,
			"gaoji": gaoji
		};
		return sendPack;
	}
});

module.exports = xymjChildCreateRoom;

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
        //# sourceMappingURL=nhmjChildCreateRoom.js.map
        