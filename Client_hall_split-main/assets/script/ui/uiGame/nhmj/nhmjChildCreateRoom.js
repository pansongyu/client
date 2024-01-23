/*
创建房间子界面
 */
var app = require("app");

var xymjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
        let sendPack = {};
		let diFen = this.GetIdxByKey("diFen");
        let zhuangJia = this.GetIdxByKey("zhuangJia");
        let xianShi = this.GetIdxByKey("xianShi");
        let jiesan = this.GetIdxByKey("jiesan");
		let gaoji = [];
		for (let i = 0; i < this.Toggles["gaoji"].length; i++) {
			if (this.Toggles["gaoji"][i].getChildByName("checkmark").active) {
				gaoji.push(i);
			}
		}
		let kexuanwanfa = [];
		for (let i = 0; i < this.Toggles["kexuanwanfa"].length; i++) {
			if (this.Toggles["kexuanwanfa"][i].getChildByName("checkmark").active) {
				kexuanwanfa.push(i);
			}
		}
        let fangjian = [];
        for (let i = 0; i < this.Toggles["fangjian"].length; i++) {
            if (this.Toggles["fangjian"][i].getChildByName("checkmark").active) {
                fangjian.push(i);
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
			"gaoji": gaoji,
		};
		return sendPack;
	},
});



module.exports = xymjChildCreateRoom;