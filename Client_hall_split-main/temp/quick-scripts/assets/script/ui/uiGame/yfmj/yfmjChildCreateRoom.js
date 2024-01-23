(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/yfmj/yfmjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '77955wiXrhH9bb0mVR1ezB6', 'yfmjChildCreateRoom', __filename);
// script/ui/uiGame/yfmj/yfmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var jsnyzmjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},

	// 需要自己重写
	// CreateSendPack -start-
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var zhuangjia = this.GetIdxByKey('zhuangjia');
		var zhigang = this.GetIdxByKey('zhigang');
		var dihu = this.GetIdxByKey('dihu');
		var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
		var piaoshangxian = this.GetIdxByKey('piaoshangxian');
		var fangjian = this.GetIdxsByKey('fangjian');
		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');
		var gaoji = this.GetIdxsByKey('gaoji');

		sendPack = {
			"zhuangjia": zhuangjia,
			"zhigang": zhigang,
			"dihu": dihu,
			"kexuanwanfa": kexuanwanfa,
			"piaoshangxian": piaoshangxian,
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
	// CreateSendPack -end-

	AdjustSendPack: function AdjustSendPack(sendPack) {
		if (sendPack.kexuanwanfa.indexOf(1) === -1) {
			this.RemoveRadioSelect(sendPack, "piaoshangxian");
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
			if ('renshu' == key) {
				// 	二人场，隐藏“跟庄”玩法。
				if (toggleIndex == 0) {
					this.Toggles["kexuanwanfa"][7].active = false;
				} else {
					this.Toggles["kexuanwanfa"][7].active = true;
				}
			}
			this.ClearToggleCheck(needClearList, needShowIndexList);
			this.UpdateLabelColor(toggles);
			this.UpdateTogglesLabel(toggles, false);
			return;
		} else if ('kexuanwanfa' == key) {
			// 	未勾选“买”玩法时，隐藏“庄家必买”。
			if (toggleIndex == 0) {
				if (!this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active) {
					this.Toggles['kexuanwanfa'][5].active = true;
				} else {
					this.Toggles['kexuanwanfa'][5].active = false;
				}
			}
			if (toggleIndex == 1) {
				if (!this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active) {
					this.Toggles['piaoshangxian'][0].parent.active = true;
				} else {
					this.Toggles['piaoshangxian'][0].parent.active = false;
				}
			}
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
			// if (this.Toggles['fangjian'][3].getChildByName('checkmark').active && toggleIndex == 5) {
			// 	this.Toggles['fangjian'][3].getChildByName('checkmark').active = false;
			// 	this.UpdateLabelColor(this.Toggles['fangjian'][3].parent);
			// } else if (this.Toggles['fangjian'][5].getChildByName('checkmark').active && toggleIndex == 3) {
			// 	this.Toggles['fangjian'][5].getChildByName('checkmark').active = false;
			// 	this.UpdateLabelColor(this.Toggles['fangjian'][5].parent);
			// }

			// if (this.Toggles['fangjian'][2].getChildByName('checkmark').active && toggleIndex == 4) {
			// 	this.Toggles['fangjian'][2].getChildByName('checkmark').active = false;
			// 	this.UpdateLabelColor(this.Toggles['fangjian'][2].parent);
			// } else if (this.Toggles['fangjian'][4].getChildByName('checkmark').active && toggleIndex == 2) {
			// 	this.Toggles['fangjian'][4].getChildByName('checkmark').active = false;
			// 	this.UpdateLabelColor(this.Toggles['fangjian'][4].parent);
			// }

			// 小局托管解散, 托管2小局解散",
			if (this.Toggles['fangjian'][2].getChildByName('checkmark').active && toggleIndex == 3) {
				this.Toggles['fangjian'][2].getChildByName('checkmark').active = false;
				this.UpdateLabelColor(this.Toggles['fangjian'][2].parent);
			} else if (this.Toggles['fangjian'][3].getChildByName('checkmark').active && toggleIndex == 2) {
				this.Toggles['fangjian'][3].getChildByName('checkmark').active = false;
				this.UpdateLabelColor(this.Toggles['fangjian'][3].parent);
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

	OnUpdateTogglesLabel: function OnUpdateTogglesLabel(TogglesNode) {
		var isResetPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

		// 	未勾选“买”玩法时，隐藏“庄家必买”。
		if (this.Toggles["kexuanwanfa"]) {
			if (!this.Toggles["kexuanwanfa"][0].getChildByName("checkmark").active) {
				this.Toggles["kexuanwanfa"][5].active = false;
			} else {
				this.Toggles["kexuanwanfa"][5].active = true;
			}
		}

		// 	二人场，隐藏“跟庄”玩法。
		if (this.Toggles["renshu"] && this.Toggles["kexuanwanfa"]) {
			if (this.Toggles["renshu"][0].getChildByName("checkmark").active) {
				this.Toggles["kexuanwanfa"][7].active = false;
			} else {
				this.Toggles["kexuanwanfa"][7].active = true;
			}
		}

		if (this.Toggles["kexuanwanfa"] && this.Toggles["piaoshangxian"]) {
			if (this.Toggles["kexuanwanfa"][1].getChildByName("checkmark").active) {
				this.Toggles["piaoshangxian"][0].parent.active = true;
			} else {
				this.Toggles["piaoshangxian"][0].parent.active = false;
			}
		}
	}

});

module.exports = jsnyzmjChildCreateRoom;

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
        //# sourceMappingURL=yfmjChildCreateRoom.js.map
        