/*
创建房间子界面
 */
var app = require("app");

var nnChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
		let sendPack = {};
		let difen = -1;
		let jushu = -1;
		let fangfei = -1;
		let fanbeiguize = -1;
		let teshupaixing = [];
		let gaojixuanxiang = [];
		let isXianJiaTuiZhu = -1;
		let zuidaqiangzhuang = -1;
		let shangzhuangfenshu = -1;
		let kexuanwanfa = [];
		let isKeptOutAfterStartGame = true;
		let sign = 0;

		for (let i = 0; i < this.Toggles['kexuanwanfa'].length; i++) {
			if (this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active) {
				kexuanwanfa.push(i);
			}
		}
		let gaoji = [];
		for (let i = 0; i < this.Toggles['gaoji'].length; i++) {
			if (this.Toggles['gaoji'][i].getChildByName('checkmark').active) {
				gaoji.push(i);
			}
		}
		for (let i = 0; i < this.Toggles['teshupaixing'].length; i++) {
			if (this.Toggles['teshupaixing'][i].getChildByName('checkmark').active) {
				teshupaixing.push(i);
			}
		}
		for (let i = 0; i < this.Toggles['gaojixuanxiang'].length; i++) {
			if (this.Toggles['gaojixuanxiang'][i].getChildByName('checkmark').active) {
				gaojixuanxiang.push(i);
			}
		}
		isKeptOutAfterStartGame = this.Toggles["gaojixuanxiang"][0].getChildByName("checkmark").active;
		let jiesan = this.GetIdxByKey("jiesan");
		difen = this.GetIdxByKey("difen");
		jushu = this.GetIdxByKey("jushu");
		fangfei = this.GetIdxByKey("fangfei");
		fanbeiguize = this.GetIdxByKey("fanbeiguize");
		isXianJiaTuiZhu = this.GetIdxByKey("isXianJiaTuiZhu");
		if ("nnsz_nn" == this.gameType) {//双十上庄 闲家推注
			sign = 1;
		}
		if ("lz_nn" == this.gameType) {//轮庄双十
			sign = 5;
		}
		if ("tbnn_nn" == this.gameType) {//通比 闲家推注
			isXianJiaTuiZhu = -1;
			sign = 3;
		}
		if ("mpqz_nn" == this.gameType) {//明牌抢庄 最大抢庄
			zuidaqiangzhuang = this.GetIdxByKey("zuidaqiangzhuang");
			sign = 4;
		}
		if ("gdzj_nn" == this.gameType) {//固定庄家 上庄分数
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
			"sign": sign,
		};
		return sendPack;
	},
});

module.exports = nnChildCreateRoom;