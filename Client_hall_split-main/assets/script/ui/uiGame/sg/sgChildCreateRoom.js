/*
创建房间子界面
 */
var app = require("app");

var sgChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
		let sendPack = {};
		let zuidaqiangzhuang = -1;
		let shangzhuangfenshu = -1;
		let sign = 0;

		let difen = this.GetIdxByKey("difen");
		let jushu = this.GetIdxByKey("jushu");
		let fangfei = this.GetIdxByKey("fangfei");			// 支/s/s/s/s/s/s付：
		let fanbeiguize = this.GetIdxByKey("fanbeiguize"); // 翻倍规则：
		let isXianJiaTuiZhu = this.GetIdxByKey("isXianJiaTuiZhu");// 闲家推注：
		let fangjian = this.GetIdxsByKey("fangjian");// 闲家推注：
		let xianShi = this.GetIdxByKey("xianShi");// 限时操作：
		let jiesan = this.GetIdxByKey("jiesan");
		let gaojixuanxiang = this.GetIdxsByKey("gaojixuanxiang"); // 游戏设置：
		let gaoji = this.GetIdxsByKey("gaoji");

		this.SG_ZYQZ = 0; //自由抢庄
		this.SG_SGSZ = 1; //三公上庄
		this.SG_GDZJ = 2; //固定庄家
		this.SG_TBSG = 3; //通比三公
		this.SG_MPQZ = 4; //明牌抢庄

		let signCfg = {};
		signCfg["zyqz_sg"] = this.SG_ZYQZ;	// 自由抢庄
		signCfg["sgsz_sg"] = this.SG_SGSZ;	// 三公上庄
		signCfg["gdzj_sg"] = this.SG_GDZJ;	// 固定庄家
		signCfg["tb_sg"] = this.SG_TBSG;	// 通比三公
		signCfg["mpqz_sg"] = this.SG_MPQZ;	// 明牌抢庄

		if (signCfg.hasOwnProperty(this.gameType)) {
			sign = signCfg[this.gameType];
		} else {
			console.error(`玩法类型 sign = ${sign} 不存在！`);
		}

		if ("mpqz_sg" == this.gameType) {//明牌抢庄 最大抢庄
			zuidaqiangzhuang = this.GetIdxByKey("zuidaqiangzhuang");
		}
		if ("gdzj_sg" == this.gameType) {//固定庄家 上庄分数
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
			"sign": sign,
		};
		return sendPack;
	},

	// 多选
	GetIdxsByKey: function (key) {
		let ret = [];
		for (let i = 0; i < this.Toggles[key].length; i++) {
			if (this.Toggles[key][i].getChildByName('checkmark').active) {
				ret.push(i);
			}
		}
		return ret;
	},
});

module.exports = sgChildCreateRoom;