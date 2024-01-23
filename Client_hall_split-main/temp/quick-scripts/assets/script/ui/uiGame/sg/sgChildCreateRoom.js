(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/sg/sgChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9da28vAwudG360vfi5J7wCp', 'sgChildCreateRoom', __filename);
// script/ui/uiGame/sg/sgChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var sgChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var zuidaqiangzhuang = -1;
		var shangzhuangfenshu = -1;
		var sign = 0;

		var difen = this.GetIdxByKey("difen");
		var jushu = this.GetIdxByKey("jushu");
		var fangfei = this.GetIdxByKey("fangfei"); // 支/s/s/s/s/s/s付：
		var fanbeiguize = this.GetIdxByKey("fanbeiguize"); // 翻倍规则：
		var isXianJiaTuiZhu = this.GetIdxByKey("isXianJiaTuiZhu"); // 闲家推注：
		var fangjian = this.GetIdxsByKey("fangjian"); // 闲家推注：
		var xianShi = this.GetIdxByKey("xianShi"); // 限时操作：
		var jiesan = this.GetIdxByKey("jiesan");
		var gaojixuanxiang = this.GetIdxsByKey("gaojixuanxiang"); // 游戏设置：
		var gaoji = this.GetIdxsByKey("gaoji");

		this.SG_ZYQZ = 0; //自由抢庄
		this.SG_SGSZ = 1; //三公上庄
		this.SG_GDZJ = 2; //固定庄家
		this.SG_TBSG = 3; //通比三公
		this.SG_MPQZ = 4; //明牌抢庄

		var signCfg = {};
		signCfg["zyqz_sg"] = this.SG_ZYQZ; // 自由抢庄
		signCfg["sgsz_sg"] = this.SG_SGSZ; // 三公上庄
		signCfg["gdzj_sg"] = this.SG_GDZJ; // 固定庄家
		signCfg["tb_sg"] = this.SG_TBSG; // 通比三公
		signCfg["mpqz_sg"] = this.SG_MPQZ; // 明牌抢庄

		if (signCfg.hasOwnProperty(this.gameType)) {
			sign = signCfg[this.gameType];
		} else {
			console.error("\u73A9\u6CD5\u7C7B\u578B sign = " + sign + " \u4E0D\u5B58\u5728\uFF01");
		}

		if ("mpqz_sg" == this.gameType) {
			//明牌抢庄 最大抢庄
			zuidaqiangzhuang = this.GetIdxByKey("zuidaqiangzhuang");
		}
		if ("gdzj_sg" == this.gameType) {
			//固定庄家 上庄分数
			shangzhuangfenshu = this.GetIdxByKey("shangzhuangfenshu");
		}

		sendPack = {
			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard,
			"jiesan": jiesan,
			"gaoji": gaoji,
			"isXianJiaTuiZhu": isXianJiaTuiZhu,
			"difen": difen,
			"fangjian": fangjian,
			"jushu": jushu,
			"fangfei": fangfei,
			"fanbeiguize": fanbeiguize,
			// "teshupaixing": teshupaixing,
			"gaojixuanxiang": gaojixuanxiang,
			"zuidaqiangzhuang": zuidaqiangzhuang,
			"shangzhuangfenshu": shangzhuangfenshu,
			"xianShi": xianShi,
			"sign": sign
		};
		return sendPack;
	},

	// 多选
	GetIdxsByKey: function GetIdxsByKey(key) {
		var ret = [];
		for (var i = 0; i < this.Toggles[key].length; i++) {
			if (this.Toggles[key][i].getChildByName('checkmark').active) {
				ret.push(i);
			}
		}
		return ret;
	}
});

module.exports = sgChildCreateRoom;

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
        //# sourceMappingURL=sgChildCreateRoom.js.map
        