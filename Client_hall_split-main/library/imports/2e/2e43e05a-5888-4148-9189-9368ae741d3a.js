"use strict";
cc._RF.push(module, '2e43eBaWIhBSJGJk2iudB06', 'pxcnChildCreateRoom');
// script/ui/uiGame/pxcn/pxcnChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var sssChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var yazhu = this.GetIdxByKey("yazhu");
		var zhadao = this.GetIdxByKey("zhadao");
		var paixing = this.GetIdxByKey("paixing");
		var xianShi = this.GetIdxByKey("xianShi");
		var jiesan = this.GetIdxByKey("jiesan");
		var gaoji = [];
		for (var i = 0; i < this.Toggles["gaoji"].length; i++) {
			if (this.Toggles["gaoji"][i].getChildByName("checkmark").active) {
				gaoji.push(i);
			}
		}
		var kexuanwanfa = [];
		for (var _i = 0; _i < this.Toggles["kexuanwanfa"].length; _i++) {
			if (this.Toggles["kexuanwanfa"][_i].getChildByName("checkmark").active) {
				kexuanwanfa.push(_i);
			}
		}
		var languowanfa = [];
		for (var _i2 = 0; _i2 < this.Toggles["languowanfa"].length; _i2++) {
			if (this.Toggles["languowanfa"][_i2].getChildByName("checkmark").active) {
				languowanfa.push(_i2);
			}
		}
		sendPack = {
			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard,
			"yazhu": yazhu,
			"zhadao": zhadao,
			"paixing": paixing,
			"xianShi": xianShi,
			"jiesan": jiesan,
			"gaoji": gaoji,
			"kexuanwanfa": kexuanwanfa,
			"languowanfa": languowanfa,
			"sign": 0
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
		} else if ("kexuanwanfa" == key) {
			var islanguo = this.Toggles["kexuanwanfa"][0].getChildByName("checkmark").active;
			if (0 == toggleIndex) {
				if (islanguo == true) {
					this.ClearToggleCheck(this.Toggles["languowanfa"]);
					this.UpdateLabelColor(this.Toggles["languowanfa"][0].parent);
				}
			}
		} else if ("languowanfa" == key) {
			var is_languo = this.Toggles["kexuanwanfa"][0].getChildByName("checkmark").active;
			if (toggleIndex > -1 && is_languo == false) {
				app.SysNotifyManager().ShowSysMsg("必须选择烂锅玩法");
				return;
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
	}
});

module.exports = sssChildCreateRoom;

cc._RF.pop();