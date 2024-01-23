"use strict";
cc._RF.push(module, 'acc39WXHYNO+7YF8/C6qyUF', 'tgwskChildCreateRoom');
// script/ui/uiGame/tgwsk/tgwskChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var ygwskChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var maima = this.GetIdxByKey('maima');
		var shuanggu = this.GetIdxByKey('shuanggu');
		var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
		var lianmai = this.GetIdxByKey('lianmai');
		var fangjian = this.GetIdxsByKey('fangjian');
		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');
		var gaoji = this.GetIdxsByKey('gaoji');

		sendPack = {
			"maima": maima,
			"shuanggu": shuanggu,
			"kexuanwanfa": kexuanwanfa,
			"lianmai": lianmai,
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
		if (sendPack.playerNum != "4") {
			sendPack.daiban = [];
		}
		return sendPack;
	},

	OnToggleClick: function OnToggleClick(event) {
		this.FormManager.CloseForm(app.subGameName + "_UIMessageTip");
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
			this.UpdateTogglesLabel(toggles);
			this.UpdateOnClickToggle();
		} else if ("fangjian" == key) {
			// 小局托管解散,解散次数不超过5次,
			// 托管2小局解散,解散次数不超过3次",
			if (this.Toggles['fangjian'][3].getChildByName('checkmark').active && toggleIndex == 5) {
				this.Toggles['fangjian'][3].getChildByName('checkmark').active = false;
				this.UpdateLabelColor(this.Toggles['fangjian'][3].parent);
			} else if (this.Toggles['fangjian'][5].getChildByName('checkmark').active && toggleIndex == 3) {
				this.Toggles['fangjian'][5].getChildByName('checkmark').active = false;
				this.UpdateLabelColor(this.Toggles['fangjian'][5].parent);
			}
		} else {}
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
		//选项置灰
		// if(this.Toggles["kexuanwanfa"]){
		//     this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
		//     if(!this.Toggles["kexuanwanfa"][7].getChildByName("checkmark").active){
		//         this.Toggles['kexuanwanfa'][8].getChildByName("checkmark").active = false;
		//         //置灰
		//         if(this.Toggles['kexuanwanfa'][8].getChildByName("label")){
		//             this.Toggles['kexuanwanfa'][8].getChildByName("label").color = cc.color(180, 180, 180);
		//         }
		//     }else{
		//         //恢复
		//         if(this.Toggles['kexuanwanfa'][8].getChildByName("label")){
		//             this.Toggles['kexuanwanfa'][8].getChildByName("label").color = cc.color(158, 49, 16);
		//         }
		//     }
		// }

	}

});

module.exports = ygwskChildCreateRoom;

cc._RF.pop();