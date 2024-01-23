/*
创建房间子界面
 */
var app = require("app");

var jxncmjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
		let sendPack = {};
		let jiangmaxuanze = this.GetIdxByKey("jiangmaxuanze");
		let jiangma = this.GetIdxByKey("jiangma");
		let jiesan = this.GetIdxByKey("jiesan");
		let xianShi = this.GetIdxByKey("xianShi");
		let fangjian = [];
		for (let i = 0; i < this.Toggles['fangjian'].length; i++) {
			if (this.Toggles['fangjian'][i].getChildByName('checkmark').active) {
				fangjian.push(i);
			}
		}
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
		if (jiangmaxuanze != 1 && kexuanwanfa.indexOf(5)>=0) {
			kexuanwanfa.splice(kexuanwanfa.indexOf(5), 1)
		}
		if (jiangmaxuanze == 2) {
			jiangma = -1
		}
		sendPack = {
			"jiangmaxuanze": jiangmaxuanze,
			"jiangma": jiangma,
			"jiesan": jiesan,
			"xianShi": xianShi,
			"fangjian": fangjian,
			//房间默认配置（人数局数支付）
			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard,
			"gaoji": gaoji,
			"kexuanwanfa": kexuanwanfa,
		};
		return sendPack;
	},
	OnShow: function () {
		this.UpdateOnClickToggle()
    },
	UpdateOnClickToggle: function () {
		if (this.Toggles['jiangmaxuanze'][1].getChildByName("checkmark").active == true) {
			this.Toggles['kexuanwanfa'][5].active = true
		}
		else{
			this.Toggles['kexuanwanfa'][5].active = false
		}
		if(this.Toggles['jiangmaxuanze'][2].getChildByName("checkmark").active == true){
			this.Toggles['jiangma'][0].parent.active = false
		 }
		 else{
			 this.Toggles['jiangma'][0].parent.active = true
		 }	
    },
	OnToggleClick: function (event) {
		this.FormManager.CloseForm(app.subGameName + "_UIMessageTip");
		let toggles = event.target.parent;
		let toggle = event.target;
		let key = toggles.name.substring(('Toggles_').length, toggles.name.length);
		let toggleIndex = parseInt(toggle.name.substring(('Toggle').length, toggle.name.length)) - 1;
		let needClearList = [];
		let needShowIndexList = [];
		needClearList = this.Toggles[key];
		needShowIndexList.push(toggleIndex);
		if ('jushu' == key || 'renshu' == key || 'fangfei' == key) {
			this.ClearToggleCheck(needClearList, needShowIndexList);
			this.UpdateLabelColor(toggles);
			this.UpdateTogglesLabel(toggles);
			return;
		}
		else if ('kexuanwanfa' == key) {
			if(toggleIndex == 0 ){
				this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active = false
			}
		} else if ('jiangmaxuanze' == key) {
			if(toggleIndex==2){
			   this.Toggles['jiangma'][0].parent.active = false
			}
			else{
				this.Toggles['jiangma'][0].parent.active = true
			}
			this.Toggles['kexuanwanfa'][5].active = toggleIndex==1
		}
		if (toggles.getComponent(cc.Toggle)) {//复选框
			needShowIndexList = [];
			for (let i = 0; i < needClearList.length; i++) {
				let mark = needClearList[i].getChildByName('checkmark').active;
				//如果复选框为勾选状态并且点击的复选框不是该复选框，则继续保持勾选状态
				if (mark && i != toggleIndex) {
					needShowIndexList.push(i);
				}
				//如果复选框为未勾选状态并且点击的复选框是该复选框，则切换为勾选状态
				else if (!mark && i == toggleIndex) {
					needShowIndexList.push(i);
				}
			}
		}
		this.ClearToggleCheck(needClearList, needShowIndexList);
		this.UpdateLabelColor(toggles, 'fangfei' == key ? true : false);
	}
});


module.exports = jxncmjChildCreateRoom;