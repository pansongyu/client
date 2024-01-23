"use strict";
cc._RF.push(module, 'ef0fb8xsN5E15/T3KqmOhkw', 'lnmjChildCreateRoom');
// script/ui/uiGame/lnmj/lnmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var bzqzmjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var maima = this.GetIdxByKey('maima');
		var mashu = this.GetIdxByKey('mashu');
		var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
		var fangjian = this.GetIdxsByKey('fangjian');
		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');
		var gaoji = this.GetIdxsByKey('gaoji');

		if (maima == 2) {
			mashu = -1;
		}

		sendPack = {
			"maima": maima,
			"mashu": mashu,
			"kexuanwanfa": kexuanwanfa,
			"fangjian": fangjian,
			"xianShi": xianShi,
			"jiesan": jiesan,
			"gaoji": gaoji,

			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard

		};
		return sendPack;
	},
	OnToggleClick: function OnToggleClick(event) {
		this.FormManager.CloseForm("UIMessageTip");
		var toggles = event.target.parent;
		var toggle = event.target;
		var key = toggles.name.substring('Toggles_'.length, toggles.name.length);
		var toggleIndex = parseInt(toggle.name.substring('Toggle'.length, toggle.name.length)) - 1;
		var needClearList = [];
		var needShowIndexList = [];
		needClearList = this.Toggles[key];
		needShowIndexList.push(toggleIndex);
		if ('jushu' == key || 'renshu' == key || 'fangfei' == key) {
			this.ClearToggleCheck(needClearList, needShowIndexList);
			this.UpdateLabelColor(toggles);
			this.UpdateTogglesLabel(toggles, false);
			return;
		} else if ('kexuanwanfa' == key) {
			if (this.Toggles['maima'][2].getChildByName('checkmark').active && toggleIndex == 1) {
				app.SysNotifyManager().ShowSysMsg("一码全中玩法下无法勾选无宝胡多奖两码");
				return;
			}
		} else if ('maima' == key) {
			if (toggleIndex == 2) {
				if (this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active) {
					this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active = false;
					this.UpdateLabelColor(this.Toggles['kexuanwanfa'][1].parent);
				}
			}
		}
		if (toggles.getComponent(cc.Toggle)) {
			//复选框
			needShowIndexList = [];
			for (var i = 0; i < needClearList.length; i++) {
				var mark = needClearList[i].getChildByName('checkmark').active;
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
	UpdateOnClickToggle: function UpdateOnClickToggle() {
		if (this.Toggles["mashu"]) {
			if (this.Toggles["maima"][2].getChildByName("checkmark").active) {
				this.Toggles['mashu'][0].parent.active = false;
			} else {
				this.Toggles['mashu'][0].parent.active = true;
			}
		}
	}
});

module.exports = bzqzmjChildCreateRoom;

cc._RF.pop();