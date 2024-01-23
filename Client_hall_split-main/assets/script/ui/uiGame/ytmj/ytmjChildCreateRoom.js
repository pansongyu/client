/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
		let sendPack = {};
		let fengDing = this.GetIdxByKey("fengDing");
		let xianShi = this.GetIdxByKey("xianShi");
		let gaoji=[];
		for(let i=0;i<this.Toggles['gaoji'].length;i++){
			if(this.Toggles['gaoji'][i].getChildByName('checkmark').active){
				gaoji.push(i);
			}
		}
		sendPack = {
			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"fengDing": fengDing,
			"xianShi": xianShi,
			"gaoji": gaoji,
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard,
		};
		return sendPack;
	},

});

module.exports = fzmjChildCreateRoom;