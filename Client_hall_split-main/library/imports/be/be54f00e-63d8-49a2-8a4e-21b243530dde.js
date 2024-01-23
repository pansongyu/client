"use strict";
cc._RF.push(module, 'be54fAOY9hJoopOIbJDUw3e', 'gcbgmjChildCreateRoom');
// script/ui/uiGame/gcbgmj/gcbgmjChildCreateRoom.js

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
		var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
		var daxiaoqidui = this.GetIdxByKey('daxiaoqidui');
		var pinghu = this.GetIdxByKey('pinghu');
		var yipaoduoxiang = this.GetIdxByKey('yipaoduoxiang');
		var fangjian = this.GetIdxsByKey('fangjian');
		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');
		var gaoji = this.GetIdxsByKey('gaoji');

		sendPack = {
			"kexuanwanfa": kexuanwanfa,
			"daxiaoqidui": daxiaoqidui,
			"pinghu": pinghu,
			"yipaoduoxiang": yipaoduoxiang,
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
		// 仅4人场有跟风分，局内立即结算；
		if (sendPack.kexuanwanfa.indexOf(0) == -1) {
			// this.RemoveMultiSelect(sendPack, "kexuanwanfa", 4);
			sendPack.daxiaoqidui = -1;
		}
		if (sendPack.daxiaoqidui != 1 && sendPack.pinghu != 1) {
			sendPack.yipaoduoxiang = -1;
		}
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
			//"同时勾选“大小七对只自摸胡”和“平胡只自摸胡”时，不可勾选“可抢杠胡”"
			if (toggleIndex == 1 && !needClearList[toggleIndex].getChildByName("checkmark").active) {
				if (this.Toggles["daxiaoqidui"][0].getChildByName("checkmark").active && this.Toggles["pinghu"][0].getChildByName("checkmark").active || !needClearList[0].getChildByName("checkmark").active) {
					return;
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
		//勾选“有大小七对”时，才有该玩法可选，没勾选时需隐藏；
		if (this.Toggles["daxiaoqidui"]) {
			if (this.Toggles["kexuanwanfa"][0].getChildByName("checkmark").active) {
				this.Toggles['daxiaoqidui'][0].parent.active = true;
			} else {
				this.Toggles['daxiaoqidui'][0].parent.active = false;
			}
		}
		//选“大小七对可炮胡”和“平胡可炮胡”中任意时，才可勾选该玩法，否则隐藏不可选；
		if (this.Toggles["yipaoduoxiang"]) {
			if (this.Toggles["daxiaoqidui"][1].getChildByName("checkmark").active || this.Toggles["pinghu"][1].getChildByName("checkmark").active) {
				this.Toggles['yipaoduoxiang'][0].parent.active = true;
			} else {
				this.Toggles['yipaoduoxiang'][0].parent.active = false;
			}
		}
		//同时勾选“大小七对只自摸胡”和“平胡只自摸胡”时，不可勾选“可抢杠胡”；
		//勾选 “平胡只自摸胡”同时没有勾选“有大小七对”时，也不可勾选 “可抢杠胡”；
		if (this.Toggles["kexuanwanfa"]) {
			if (!this.Toggles["kexuanwanfa"][1].getChildByName("checkmark").active) {
				if (!this.Toggles["kexuanwanfa"][0].getChildByName("checkmark").active || this.Toggles["daxiaoqidui"][0].getChildByName("checkmark").active && this.Toggles["pinghu"][0].getChildByName("checkmark").active) {
					this.Toggles['kexuanwanfa'][1].getChildByName("checkmark").active = false;
					this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
					//置灰
					if (this.Toggles['kexuanwanfa'][1].getChildByName("label")) {
						this.Toggles['kexuanwanfa'][1].getChildByName("label").color = cc.color(180, 180, 180);
					}
				} else {
					this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
				}
			} else {
				this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
			}
		}
	}
});

module.exports = bzqzmjChildCreateRoom;

cc._RF.pop();