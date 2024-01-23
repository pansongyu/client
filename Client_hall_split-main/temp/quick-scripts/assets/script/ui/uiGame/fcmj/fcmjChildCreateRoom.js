(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/fcmj/fcmjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c9311ZoRq5KxpE1n+TIKV72', 'fcmjChildCreateRoom', __filename);
// script/ui/uiGame/fcmj/fcmjChildCreateRoom.js

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
		var wanfa = this.GetIdxByKey('wanfa');
		var qishouwufeng = this.GetIdxByKey('qishouwufeng');

		var kexuanwanfa = [];

		if (wanfa == 0) {
			for (var i = 0; i < this.Toggles['kexuanwanfa'].length; i++) {
				if (this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active) {
					kexuanwanfa.push(i);
				}
			}
		} else if (wanfa == 1) {
			for (var _i = 0; _i < this.Toggles['kexuanwanfa'].length; _i++) {
				if (this.Toggles['kexuanwanfa'][_i].getChildByName('checkmark').active) {
					if (_i != 3 && _i != 4) {
						kexuanwanfa.push(_i);
					}
				}
			}
		}

		var fangjian = this.GetIdxsByKey('fangjian');
		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');
		var gaoji = this.GetIdxsByKey('gaoji');

		sendPack = {
			"wanfa": wanfa,
			"qishouwufeng": qishouwufeng,
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
		} else if ('qishouwufeng' == key) {
			if (this.Toggles["wanfa"][2].getChildByName("checkmark").active || this.Toggles["wanfa"][3].getChildByName("checkmark").active) {

				if (toggleIndex == 0 || toggleIndex == 1) {
					app.SysNotifyManager().ShowSysMsg("市区、白土玩法不能勾选无风50、100垒");
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
		if (this.Toggles["wanfa"]) {
			if (this.Toggles["wanfa"][2].getChildByName("checkmark").active || this.Toggles["wanfa"][3].getChildByName("checkmark").active) {
				this.Toggles["qishouwufeng"][2].getChildByName("checkmark").active = true;
				this.Toggles["qishouwufeng"][0].getChildByName("checkmark").active = false;
				this.Toggles["qishouwufeng"][1].getChildByName("checkmark").active = false;
				this.UpdateLabelColor(this.Toggles['qishouwufeng'][0].parent);
			}

			//勾选“不冒烟”，隐藏起手单风不奖垒,七缺二不奖垒；kexuanwanfa:3,4
			if (this.Toggles["wanfa"][1].getChildByName("checkmark").active) {
				this.Toggles["kexuanwanfa"][3].active = false;
				this.Toggles["kexuanwanfa"][4].active = false;
			} else {
				this.Toggles["kexuanwanfa"][3].active = true;
				this.Toggles["kexuanwanfa"][4].active = true;
			}

			if (this.Toggles["wanfa"][2].getChildByName("checkmark").active || this.Toggles["wanfa"][3].getChildByName("checkmark").active) {
				this.Toggles["kexuanwanfa"][4].parent.active = false;
			} else {
				this.Toggles["kexuanwanfa"][4].parent.active = true;
			}
		}
		if (this.Toggles["kexuanwanfa"]) {
			this.Toggles["kexuanwanfa"][2].getChildByName("checkmark").active = true;
			this.Toggles["kexuanwanfa"][3].getChildByName("checkmark").active = true;
			this.Toggles["kexuanwanfa"][5].getChildByName("checkmark").active = true;
			this.Toggles["kexuanwanfa"][6].getChildByName("checkmark").active = true;
		}
	}
});

module.exports = bzqzmjChildCreateRoom;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=fcmjChildCreateRoom.js.map
        