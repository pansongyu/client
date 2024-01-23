/*
创建房间子界面
 */
var app = require("app");

var cqcpChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
		let sendPack = {};
		let difen = this.GetIdxByKey('difen');
		let renshu1 = this.GetIdxByKey('renshu');
		let fengDing = this.GetIdxByKey('fengDing');
		let moshi = this.GetIdxByKey('moshi');
		let kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
		let fangjian = this.GetIdxsByKey('fangjian');
		let xianShi = this.GetIdxByKey('xianShi');
		let jiesan = this.GetIdxByKey('jiesan');
		let gaoji = this.GetIdxsByKey('gaoji');

		sendPack = {
			"difen": difen,
			"fengDing": fengDing,
			"moshi": moshi,
			"kexuanwanfa": kexuanwanfa,
			"fangjian": fangjian,
			"xianShi": xianShi,
			"jiesan": jiesan,
			"gaoji": gaoji,
			"renshu": renshu1,

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
			this.UpdateOnClickToggle();
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
		// 仅4人场可选，3人场隐藏；
		if (this.Toggles["fengDing"]) {
			if (this.Toggles["renshu"][0].getChildByName("checkmark").active) {
				this.Toggles["fengDing"][0].parent.active = false;
			} else {
				this.Toggles["fengDing"][0].parent.active = true;
			}
		}
	},
	AdjustSendPack: function (sendPack) {
		// 3人场，不能勾选10副
		if (sendPack.playerNum != 4) {
			this.RemoveRadioSelect(sendPack, "fengDing");
		}
		return sendPack;
	},
});

module.exports = cqcpChildCreateRoom;