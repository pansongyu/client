/*
创建房间子界面
 */
var app = require("app");

var px6gtChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
		let sendPack = {};
		let zhadanjiangli = this.GetIdxByKey('zhadanjiangli');
		let suanjiangguize = this.GetIdxByKey('suanjiangguize');
		let lianmai = this.GetIdxByKey('lianmai');
		let xianShi = this.GetIdxByKey('xianShi');
		let jiesan = this.GetIdxByKey('jiesan');
		let gaoji = [];
		for (let i = 0; i < this.Toggles['gaoji'].length; i++) {
			if (this.Toggles['gaoji'][i].getChildByName('checkmark').active) {
				gaoji.push(i);
			}
		}
		let fangjian=[];
		for(let i=0;i<this.Toggles['fangjian'].length;i++){
			if(this.Toggles['fangjian'][i].getChildByName('checkmark').active){
				fangjian.push(i);
			}
		}
		let kexuanwanfa = [];
		for (let i = 0; i < this.Toggles['kexuanwanfa'].length; i++) {
			if (this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active) {
				kexuanwanfa.push(i);
			}
		}
		sendPack = {
			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard,
			"zhadanjiangli": zhadanjiangli,
			"suanjiangguize": suanjiangguize,
			"lianmai": lianmai,
			"xianShi": xianShi,
			"jiesan": jiesan,
			"gaoji": gaoji,
			"kexuanwanfa": kexuanwanfa,
			"fangjian": fangjian,
		};
		return sendPack;
	},
	UpdateOnClickToggle: function () {
		//选项置灰
		if (this.Toggles["kexuanwanfa"]) {
			this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
			if (!this.Toggles["suanjiangguize"][0].getChildByName("checkmark").active) {
				this.Toggles['kexuanwanfa'][4].getChildByName("checkmark").active = false;
				//置灰
				if (this.Toggles['kexuanwanfa'][4].getChildByName("label")) {
					this.Toggles['kexuanwanfa'][4].getChildByName("label").color = cc.color(180, 180, 180);
				}
			} else {
				//恢复
				if (this.Toggles['kexuanwanfa'][4].getChildByName("label")) {
					this.Toggles['kexuanwanfa'][4].getChildByName("label").color = cc.color(158, 49, 16);
				}
			}
		}
	},
});

module.exports = px6gtChildCreateRoom;