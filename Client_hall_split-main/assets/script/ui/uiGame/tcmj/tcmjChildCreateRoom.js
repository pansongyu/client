/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
    OnShow:function(){
        this.zpmjToggleIndex = -1;
    },  
    //需要自己重写
    CreateSendPack:function(renshu, setCount, isSpiltRoomCard){
        let sendPack = {};
	    let lazi = this.GetIdxByKey("lazi");
	    let jiesan = this.GetIdxByKey("jiesan");
	    let xianShi = this.GetIdxByKey("xianShi");
	    let beishu = this.GetIdxByKey('beishu');
	    let bangangtou = this.GetIdxByKey("bangangtou");

	    /*let fangjian = [];
		for (let i = 0; i < this.Toggles['fangjian'].length; i++) {
			if (this.Toggles['fangjian'][i].getChildByName('checkmark').active) {
				fangjian.push(i);
			}
		}*/
	    let kexuanwanfa = [];
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
	    sendPack = {
		    "lazi": lazi,
		    "beishu": beishu,
		    "jiesan": jiesan,
		    "bangangtou": bangangtou,
		    "xianShi": xianShi,
		    // "fangjian": fangjian,
		    "playerMinNum": renshu[0],
		    "playerNum": renshu[1],
		    "setCount": setCount,
		    "paymentRoomCardType": isSpiltRoomCard,
		    "gaoji": gaoji,
		    "kexuanwanfa": kexuanwanfa,
	    };
        return sendPack;
    },
});

module.exports = fzmjChildCreateRoom;