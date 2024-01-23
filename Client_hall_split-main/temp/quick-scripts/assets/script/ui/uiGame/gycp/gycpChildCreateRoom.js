(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/gycp/gycpChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e02b6AjBvtCipI7Ikk02A75', 'gycpChildCreateRoom', __filename);
// script/ui/uiGame/gycp/gycpChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var gycpChildCreateRoom = cc.Class({
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
		var fengding = this.GetIdxByKey("fengding");
		var dianpao = this.GetIdxByKey("dianpao");
		var dangjia = this.GetIdxByKey("dangjia");
		// let fanfan = this.GetIdxByKey("fanfan");
		var zuozhuang = this.GetIdxByKey("zuozhuang");
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
			"paymentRoomCardType": isSpiltRoomCard,
			"fengding": fengding,
			"dianpao": dianpao,
			"dangjia": dangjia,
			// "fanfan": fanfan,
			"zuozhuang": zuozhuang,
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

module.exports = gycpChildCreateRoom;

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
        //# sourceMappingURL=gycpChildCreateRoom.js.map
        