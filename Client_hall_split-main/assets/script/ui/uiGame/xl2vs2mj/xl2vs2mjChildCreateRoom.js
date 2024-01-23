/*
创建房间子界面
 */
var app = require("app");

var jsnyzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
	// CreateSendPack -start-
	CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
    	let sendPack = {};
    	let fengDing = this.GetIdxByKey('fengDing');
    	let zimo = this.GetIdxByKey('zimo');
    	let diangang = this.GetIdxByKey('diangang');
    	let kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
    	let duiwushuying = this.GetIdxByKey('duiwushuying');
    	let lianmai = this.GetIdxByKey('lianmai');
    	let fangjian = this.GetIdxsByKey('fangjian');
    	let xianShi = this.GetIdxByKey('xianShi');
    	let jiesan = this.GetIdxByKey('jiesan');
    	let gaoji = this.GetIdxsByKey('gaoji');

    	sendPack = {
        	"fengDing": fengDing,
        	"zimo": zimo,
        	"diangang": diangang,
        	"kexuanwanfa": kexuanwanfa,
        	"duiwushuying": duiwushuying,
        	"lianmai": lianmai,
        	"fangjian": fangjian,
        	"xianShi": xianShi,
        	"jiesan": jiesan,
        	"gaoji": gaoji,

        	"playerMinNum": renshu[0],
        	"playerNum": renshu[1],
        	"setCount": setCount,
        	"paymentRoomCardType": isSpiltRoomCard,

    	}
    	return sendPack;
	},
	// CreateSendPack -end-
	
});

module.exports = jsnyzmjChildCreateRoom;