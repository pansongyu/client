(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/yxls/yxlsChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3ccc4n3t1xFhLoHUw7N0ZWm', 'yxlsChildCreateRoom', __filename);
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
        //# sourceMappingURL=yxlsChildCreateRoom.js.map
        