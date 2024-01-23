(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/nn/nnChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1e0dflSCxBG8b9YzIdXcZ/i', 'nnChildCreateRoom', __filename);
// script/ui/uiGame/nn/nnChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var nnChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var difen = -1;
		var jushu = -1;
		var fangfei = -1;
		var fanbeiguize = -1;
		var teshupaixing = [];
		var gaojixuanxiang = [];
		var isXianJiaTuiZhu = -1;
		var zuidaqiangzhuang = -1;
		var shangzhuangfenshu = -1;
		var kexuanwanfa = [];
		var isKeptOutAfterStartGame = true;
		var sign = 0;

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
		for (var _i2 = 0; _i2 < this.Toggles['teshupaixing'].length; _i2++) {
			if (this.Toggles['teshupaixing'][_i2].getChildByName('checkmark').active) {
				teshupaixing.push(_i2);
			}
		}
		for (var _i3 = 0; _i3 < this.Toggles['gaojixuanxiang'].length; _i3++) {
			if (this.Toggles['gaojixuanxiang'][_i3].getChildByName('checkmark').active) {
				gaojixuanxiang.push(_i3);
			}
		}
		isKeptOutAfterStartGame = this.Toggles["gaojixuanxiang"][0].getChildByName("checkmark").active;
		var jiesan = this.GetIdxByKey("jiesan");
		difen = this.GetIdxByKey("difen");
		jushu = this.GetIdxByKey("jushu");
		fangfei = this.GetIdxByKey("fangfei");
		fanbeiguize = this.GetIdxByKey("fanbeiguize");
		isXianJiaTuiZhu = this.GetIdxByKey("isXianJiaTuiZhu");
		if ("nnsz_nn" == this.gameType) {
			//双十上庄 闲家推注
			sign = 1;
		}
		if ("lz_nn" == this.gameType) {
			//轮庄双十
			sign = 5;
		}
		if ("tbnn_nn" == this.gameType) {
			//通比 闲家推注
			isXianJiaTuiZhu = -1;
			sign = 3;
		}
		if ("mpqz_nn" == this.gameType) {
			//明牌抢庄 最大抢庄
			zuidaqiangzhuang = this.GetIdxByKey("zuidaqiangzhuang");
			sign = 4;
		}
		if ("gdzj_nn" == this.gameType) {
			//固定庄家 上庄分数
			shangzhuangfenshu = this.GetIdxByKey("shangzhuangfenshu");
			sign = 2;
		}

		sendPack = {
			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard,
			"kexuanwanfa": kexuanwanfa,
			"jiesan": jiesan,
			"gaoji": gaoji,
			"isXianJiaTuiZhu": isXianJiaTuiZhu,
			"difen": difen,
			"jushu": jushu,
			"fangfei": fangfei,
			"fanbeiguize": fanbeiguize,
			"teshupaixing": teshupaixing,
			"gaojixuanxiang": gaojixuanxiang,
			"zuidaqiangzhuang": zuidaqiangzhuang,
			"shangzhuangfenshu": shangzhuangfenshu,
			"isKeptOutAfterStartGame": isKeptOutAfterStartGame,
			"sign": sign
		};
		return sendPack;
	}
});

module.exports = nnChildCreateRoom;

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
        //# sourceMappingURL=nnChildCreateRoom.js.map
        