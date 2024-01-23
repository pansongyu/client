/*
创建房间子界面
 */
var app = require("app");

var lnjzmjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
		let sendPack = {};
		let moshi = this.GetIdxByKey('moshi');
		let laizi = this.GetIdxByKey('laizi');
		let kexuanwanfa1 = this.GetIdxsByKey('kexuanwanfa1');
		let kexuanwanfa2 = this.GetIdxsByKey('kexuanwanfa2');
		let fangjian = this.GetIdxsByKey('fangjian');
		let xianShi = this.GetIdxByKey('xianShi');
		let jiesan = this.GetIdxByKey('jiesan');
		let gaoji = this.GetIdxsByKey('gaoji');

		sendPack = {
			"moshi": moshi,
			"laizi": laizi,
			"kexuanwanfa1": kexuanwanfa1,
			"kexuanwanfa2": kexuanwanfa2,
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
	OnToggleClick: function (event) {
		this.FormManager.CloseForm("UIMessageTip");
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
			this.UpdateTogglesLabel(toggles, false);
			return;
		} else if ('kexuanwanfa' == key) {
			// if('sss_dr' == this.gameType || 'sss_zz' == this.gameType){
			//     if(toggleIndex == 0){
			//         this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active = false;
			//         this.UpdateLabelColor(this.Toggles['kexuanwanfa'][1].parent);
			//     }
			//     else if(toggleIndex == 1){
			//         this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active = false;
			//         this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
			//     }
			// }
		} else if ("fangjian" == key) {
			// 小局托管解散,解散次数不超过5次,
			// 托管2小局解散,解散次数不超过3次",
			if (this.Toggles['fangjian'][2].getChildByName('checkmark').active && toggleIndex == 4) {
				this.Toggles['fangjian'][2].getChildByName('checkmark').active = false;
				this.UpdateLabelColor(this.Toggles['fangjian'][2].parent);
			} else if (this.Toggles['fangjian'][4].getChildByName('checkmark').active && toggleIndex == 2) {
				this.Toggles['fangjian'][4].getChildByName('checkmark').active = false;
				this.UpdateLabelColor(this.Toggles['fangjian'][4].parent);
			}
			if (this.Toggles['fangjian'][3].getChildByName('checkmark').active && toggleIndex == 5) {
				this.Toggles['fangjian'][3].getChildByName('checkmark').active = false;
				this.UpdateLabelColor(this.Toggles['fangjian'][3].parent);
			} else if (this.Toggles['fangjian'][5].getChildByName('checkmark').active && toggleIndex == 3) {
				this.Toggles['fangjian'][5].getChildByName('checkmark').active = false;
				this.UpdateLabelColor(this.Toggles['fangjian'][5].parent);
			}
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
		this.UpdateOnClickToggle();
	},
	UpdateOnClickToggle: function () {
		//选项置灰
		if (this.Toggles["laizi"]) {
			if (this.Toggles["moshi"][0].getChildByName("checkmark").active) {
				this.Toggles['laizi'][0].parent.active = false;
			} else {
				this.Toggles['laizi'][0].parent.active = true;
			}
		}
		if (this.Toggles["kexuanwanfa1"]) {
			this.UpdateLabelColor(this.Toggles['kexuanwanfa1'][0].parent);
			if (this.Toggles["moshi"][0].getChildByName("checkmark").active) {
				this.Toggles['kexuanwanfa1'][0].getChildByName("checkmark").active = false;
				this.Toggles['kexuanwanfa1'][1].getChildByName("checkmark").active = false;
				this.Toggles['kexuanwanfa1'][2].getChildByName("checkmark").active = false;
				this.Toggles['kexuanwanfa1'][3].getChildByName("checkmark").active = false;
				this.Toggles['kexuanwanfa1'][4].getChildByName("checkmark").active = false;
				//置灰
				if (this.Toggles['kexuanwanfa1'][0].getChildByName("label")) {
					this.Toggles['kexuanwanfa1'][0].getChildByName("label").color = cc.color(180, 180, 180);
				}
				if (this.Toggles['kexuanwanfa1'][1].getChildByName("label")) {
					this.Toggles['kexuanwanfa1'][1].getChildByName("label").color = cc.color(180, 180, 180);
				}
				if (this.Toggles['kexuanwanfa1'][2].getChildByName("label")) {
					this.Toggles['kexuanwanfa1'][2].getChildByName("label").color = cc.color(180, 180, 180);
				}
				if (this.Toggles['kexuanwanfa1'][3].getChildByName("label")) {
					this.Toggles['kexuanwanfa1'][3].getChildByName("label").color = cc.color(180, 180, 180);
				}
				if (this.Toggles['kexuanwanfa1'][4].getChildByName("label")) {
					this.Toggles['kexuanwanfa1'][4].getChildByName("label").color = cc.color(180, 180, 180);
				}
			} else {
				//恢复
				if (this.Toggles['kexuanwanfa1'][0].getChildByName("label")) {
					this.Toggles['kexuanwanfa1'][0].getChildByName("label").color = cc.color(158, 49, 16);
				}
				if (this.Toggles['kexuanwanfa1'][1].getChildByName("label")) {
					this.Toggles['kexuanwanfa1'][1].getChildByName("label").color = cc.color(158, 49, 16);
				}
				if (this.Toggles['kexuanwanfa1'][2].getChildByName("label")) {
					this.Toggles['kexuanwanfa1'][2].getChildByName("label").color = cc.color(158, 49, 16);
				}
				if (this.Toggles['kexuanwanfa1'][3].getChildByName("label")) {
					// this.Toggles['kexuanwanfa1'][3].getChildByName("label").color = cc.color(158, 49, 16);
				}
				if (this.Toggles['kexuanwanfa1'][4].getChildByName("label")) {
					this.Toggles['kexuanwanfa1'][4].getChildByName("label").color = cc.color(158, 49, 16);
				}
			}
		}
		if (this.Toggles["kexuanwanfa2"]) {
			this.UpdateLabelColor(this.Toggles['kexuanwanfa2'][0].parent);
			if (this.Toggles["moshi"][1].getChildByName("checkmark").active) {
				this.Toggles['kexuanwanfa2'][0].getChildByName("checkmark").active = false;
				this.Toggles['kexuanwanfa2'][1].getChildByName("checkmark").active = false;
				this.Toggles['kexuanwanfa2'][2].getChildByName("checkmark").active = false;
				this.Toggles['kexuanwanfa2'][3].getChildByName("checkmark").active = false;
				this.Toggles['kexuanwanfa2'][4].getChildByName("checkmark").active = false;
				this.Toggles['kexuanwanfa2'][5].getChildByName("checkmark").active = false;
				//置灰
				if (this.Toggles['kexuanwanfa2'][0].getChildByName("label")) {
					this.Toggles['kexuanwanfa2'][0].getChildByName("label").color = cc.color(180, 180, 180);
				}
				if (this.Toggles['kexuanwanfa2'][1].getChildByName("label")) {
					this.Toggles['kexuanwanfa2'][1].getChildByName("label").color = cc.color(180, 180, 180);
				}
				if (this.Toggles['kexuanwanfa2'][2].getChildByName("label")) {
					this.Toggles['kexuanwanfa2'][2].getChildByName("label").color = cc.color(180, 180, 180);
				}
				if (this.Toggles['kexuanwanfa2'][3].getChildByName("label")) {
					this.Toggles['kexuanwanfa2'][3].getChildByName("label").color = cc.color(180, 180, 180);
				}
				if (this.Toggles['kexuanwanfa2'][4].getChildByName("label")) {
					this.Toggles['kexuanwanfa2'][4].getChildByName("label").color = cc.color(180, 180, 180);
				}
				if (this.Toggles['kexuanwanfa2'][5].getChildByName("label")) {
					this.Toggles['kexuanwanfa2'][5].getChildByName("label").color = cc.color(180, 180, 180);
				}
			} else {
				//恢复
				if (this.Toggles['kexuanwanfa2'][0].getChildByName("label")) {
					this.Toggles['kexuanwanfa2'][0].getChildByName("label").color = cc.color(158, 49, 16);
				}
				if (this.Toggles['kexuanwanfa2'][1].getChildByName("label")) {
					this.Toggles['kexuanwanfa2'][1].getChildByName("label").color = cc.color(158, 49, 16);
				}
				if (this.Toggles['kexuanwanfa2'][2].getChildByName("label")) {
					this.Toggles['kexuanwanfa2'][2].getChildByName("label").color = cc.color(158, 49, 16);
				}
				if (this.Toggles['kexuanwanfa2'][3].getChildByName("label")) {
					this.Toggles['kexuanwanfa2'][3].getChildByName("label").color = cc.color(158, 49, 16);
				}
				if (this.Toggles['kexuanwanfa2'][4].getChildByName("label")) {
					this.Toggles['kexuanwanfa2'][4].getChildByName("label").color = cc.color(158, 49, 16);
				}
				if (this.Toggles['kexuanwanfa2'][5].getChildByName("label")) {
					this.Toggles['kexuanwanfa2'][5].getChildByName("label").color = cc.color(158, 49, 16);
				}
			}
		}
	},
	AdjustSendPack: function (sendPack) {
		if (sendPack.moshi == 0) {
			this.RemoveRadioSelect(sendPack, "laizi");
		}
		return sendPack;
	},
});

module.exports = lnjzmjChildCreateRoom;