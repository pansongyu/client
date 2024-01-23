/*
创建房间子界面
 */
var app = require("app");

var zxChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
    //需要自己重写
	CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
		let sendPack = {};
		let difen=this.GetIdxByKey('difen');
		let laizi=this.GetIdxByKey('laizi');
		let xuanpiao=this.GetIdxByKey('xuanpiao');
		let fangjian=this.GetIdxsByKey('fangjian');
		let kexuanwanfa=this.GetIdxsByKey('kexuanwanfa');
		let xianShi=this.GetIdxByKey('xianShi');
		let jiesan=this.GetIdxByKey('jiesan');
		let gaoji=this.GetIdxsByKey('gaoji');

		sendPack = {
			"difen":difen,
			"laizi":laizi,
			"xuanpiao":xuanpiao,
			"fangjian":fangjian,
			"kexuanwanfa":kexuanwanfa,
			"xianShi":xianShi,
			"jiesan":jiesan,
			"gaoji":gaoji,

			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard

		}
		return sendPack;
	},

    UpdateOnClickToggle: function() {
        /*if (this.Toggles["wanfa"]) {
            if (this.Toggles["renshu"][2].getChildByName("checkmark").active) {
                this.Toggles["wanfa"][0].parent.active = false;
            } else {
                this.Toggles["wanfa"][0].parent.active = true;
            }
        }*/
    },
});

module.exports = zxChildCreateRoom;