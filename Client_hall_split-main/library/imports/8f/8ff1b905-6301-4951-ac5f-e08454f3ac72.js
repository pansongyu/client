"use strict";
cc._RF.push(module, '8ff1bkFYwFJUaxf4IRU86xy', 'hbmjChildCreateRoom');
// script/ui/uiGame/hbmj/hbmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var xianShi = this.GetIdxByKey("xianShi");
		var wanfa = this.GetIdxByKey("wanfa");
		var kexuanwanfa = [];
		var gaoji = [];
		for (var i = 0; i < this.Toggles["kexuanwanfa"].length; i++) {
			if (this.Toggles["kexuanwanfa"][i].getChildByName("checkmark").active) {
				kexuanwanfa.push(i);
			}
		}
		for (var _i = 0; _i < this.Toggles['gaoji'].length; _i++) {
			if (this.Toggles['gaoji'][_i].getChildByName('checkmark').active) {
				gaoji.push(_i);
			}
		}
		sendPack = {
			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"xianShi": xianShi,
			"wanfa": wanfa,
			"kexuanwanfa": kexuanwanfa,
			"gaoji": gaoji,
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
		}
		// else if('kexuanwanfa' == key){
		//     if(toggleIndex <2){
		//        this.ClearToggleCheck(this.Toggles['fengding'],[1]);
		//        this.UpdateLabelColor(this.Toggles['fengding'][1].parent);
		//     }
		// }else if('fengding' == key){
		//     if(toggleIndex==0){
		//        if(this.Toggles['kexuanwanfa'][2].getChildByName('checkmark').active ==false){
		//             this.ShowSysMsg('梓埠清混才能选择封顶');
		//             return;
		//        }
		//     }
		// }
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

module.exports = fzmjChildCreateRoom;

cc._RF.pop();