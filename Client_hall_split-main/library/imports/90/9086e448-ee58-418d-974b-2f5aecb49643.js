"use strict";
cc._RF.push(module, '9086eRI7lhBjZdLL1rstJZD', 'xygsmjChildCreateRoom');
// script/ui/uiGame/xygsmj/xygsmjChildCreateRoom.js

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
		var difen = this.GetIdxByKey('difen');
		var hupai = this.GetIdxByKey('hupai');
		var fengpai = this.GetIdxByKey('fengpai');
		var sanfeng = this.GetIdxByKey('sanfeng');
		var liuju = this.GetIdxByKey('liuju');
		var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
		var fangjian = this.GetIdxsByKey('fangjian');
		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');
		var gaoji = this.GetIdxsByKey('gaoji');
		if (fengpai == 1) {
			sanfeng = -1;
		}
		sendPack = {
			"difen": difen,
			"hupai": hupai,
			"fengpai": fengpai,
			"sanfeng": sanfeng,
			"liuju": liuju,
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
	AdjustSendPack: function AdjustSendPack(sendPack) {
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
		} else if ("fengpai" == key) {
			if (toggleIndex == 1) {
				this.Toggles['sanfeng'][0].parent.active = false;
			} else {
				this.Toggles['sanfeng'][0].parent.active = true;
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
		if (this.Toggles["sanfeng"]) {
			if (this.Toggles["fengpai"][0].getChildByName('checkmark').active) {
				this.Toggles["sanfeng"][0].parent.active = true;
			} else {
				this.Toggles["sanfeng"][0].parent.active = false;
			}
		}
	}
});

module.exports = bzqzmjChildCreateRoom;

cc._RF.pop();