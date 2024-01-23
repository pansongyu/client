/*
创建房间子界面
 */
var app = require("app");

var wxlsChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
		let sendPack = {};
		let huludaoshu=this.GetIdxByKey('huludaoshu');
		let teshupaixing=this.GetIdxByKey('teshupaixing');
		let kexuanwanfa=this.GetIdxsByKey('kexuanwanfa');
		let daqiang=this.GetIdxByKey('daqiang');
		let fangjian=this.GetIdxsByKey('fangjian');
		let xianShi=this.GetIdxByKey('xianShi');
		let jiesan=this.GetIdxByKey('jiesan');
		let gaoji=this.GetIdxsByKey('gaoji');

		sendPack = {
			"huludaoshu":huludaoshu,
			"teshupaixing":teshupaixing,
			"kexuanwanfa":kexuanwanfa,
			"daqiang":daqiang,
			"fangjian":fangjian,
			"xianShi":xianShi,
			"jiesan":jiesan,
			"gaoji":gaoji,

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
		if ('fangjian' == key) {
			if (toggleIndex == 1) {
				if (this.Toggles["fangjian"][3].getChildByName("checkmark").active) {
					app.SysNotifyManager().ShowSysMsg("玩法重复");
					this.Toggles['fangjian'][1].getChildByName('checkmark').active = false;
					this.UpdateLabelColor(this.Toggles['fangjian'][1].parent);
				}
			}
			if (toggleIndex == 2) {
				if (this.Toggles["fangjian"][4].getChildByName("checkmark").active) {
					app.SysNotifyManager().ShowSysMsg("玩法重复");
					this.Toggles['fangjian'][2].getChildByName('checkmark').active = false;
					this.UpdateLabelColor(this.Toggles['fangjian'][1].parent);
				}
			}
			if (toggleIndex == 3) {
				if (this.Toggles["fangjian"][1].getChildByName("checkmark").active) {
					app.SysNotifyManager().ShowSysMsg("玩法重复");
					this.Toggles['fangjian'][3].getChildByName('checkmark').active = false;
					this.UpdateLabelColor(this.Toggles['fangjian'][1].parent);
				}
			}
			if (toggleIndex == 4) {
				if (this.Toggles["fangjian"][2].getChildByName("checkmark").active) {
					app.SysNotifyManager().ShowSysMsg("玩法重复");
					this.Toggles['fangjian'][4].getChildByName('checkmark').active = false;
					this.UpdateLabelColor(this.Toggles['fangjian'][1].parent);
				}
			}

		}
		this.UpdateLabelColor(toggles, 'fangfei' == key ? true : false);
		this.UpdateOnClickToggle();
	}
});

module.exports = wxlsChildCreateRoom;