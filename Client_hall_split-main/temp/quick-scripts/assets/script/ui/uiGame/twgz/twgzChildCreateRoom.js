(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/twgz/twgzChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '450c6JaI8hIypbt8fp60ywW', 'twgzChildCreateRoom', __filename);
// script/ui/uiGame/twgz/twgzChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var twgzChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var wanfa = this.GetIdxByKey('wanfa');
		var siren = this.GetIdxByKey('siren');
		var shouchu = this.GetIdxByKey('shouchu');
		var liangpai = this.GetIdxByKey('liangpai');
		var hongtaoliangpai = this.GetIdxByKey('hongtaoliangpai');
		var hongtaofenzhi = this.GetIdxByKey('hongtaofenzhi');
		var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
		var fangjian = this.GetIdxsByKey('fangjian');
		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');
		var gaoji = this.GetIdxsByKey('gaoji');

		sendPack = {
			"wanfa": wanfa,
			"siren": siren,
			"shouchu": shouchu,
			"liangpai": liangpai,
			"hongtaoliangpai": hongtaoliangpai,
			"hongtaofenzhi": hongtaofenzhi,
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
			return;
		} else if ('kexuanwanfa' == key) {
			// if(toggleIndex == 0 && this.Toggles["renshu"][0].getChildByName("checkmark").active){
			// 	this.ShowSysMsg("三人场必选“去掉6”");
			// 	return;
			// }
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
		if ('fangjian' == key) {
			if (toggleIndex == 2) {
				if (this.Toggles["fangjian"][3].getChildByName("checkmark").active) {
					app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("玩法重复");
					this.Toggles['fangjian'][2].getChildByName('checkmark').active = false;
					this.UpdateLabelColor(this.Toggles['fangjian'][3].parent);
				}
			}
			if (toggleIndex == 3) {
				if (this.Toggles["fangjian"][2].getChildByName("checkmark").active) {
					app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("玩法重复");
					this.Toggles['fangjian'][3].getChildByName('checkmark').active = false;
					this.UpdateLabelColor(this.Toggles['fangjian'][2].parent);
				}
			}
		}
		this.UpdateLabelColor(toggles, 'fangfei' == key ? true : false);
		this.UpdateOnClickToggle();
	},
	UpdateOnClickToggle: function UpdateOnClickToggle() {
		if (this.Toggles["fangjian"]) {
			this.Toggles["fangjian"][0].active = false;
		}
		if (this.Toggles["wanfa"]) {
			if (this.Toggles["renshu"][0].getChildByName("checkmark").active) {
				this.Toggles["wanfa"][0].parent.active = false;
			} else {
				this.Toggles["wanfa"][0].parent.active = true;
			}
		}
		if (this.Toggles["siren"]) {
			if (this.Toggles["renshu"][0].getChildByName("checkmark").active) {
				this.Toggles["siren"][0].parent.active = false;
			} else {
				this.Toggles["siren"][0].parent.active = true;
				if (this.Toggles["wanfa"][0].getChildByName("checkmark").active) {
					this.Toggles["siren"][0].active = true;
				} else {
					if (this.Toggles["siren"][0].getChildByName("checkmark").active) {
						this.Toggles["siren"][1].getChildByName("checkmark").active = this.Toggles["siren"][0].getChildByName("checkmark").active;
						this.Toggles["siren"][0].getChildByName("checkmark").active = false;
					}
					this.Toggles["siren"][0].active = false;
					this.Toggles["siren"][1].active = true;
					this.Toggles["siren"][2].active = true;
				}
			}
		}
		if (this.Toggles["shouchu"]) {
			if (this.Toggles["renshu"][0].getChildByName("checkmark").active) {
				this.Toggles["shouchu"][0].active = true;
				this.Toggles["shouchu"][1].active = true;
				this.Toggles["shouchu"][2].active = true;
				this.Toggles["shouchu"][3].active = true;
			} else {
				if (this.Toggles["wanfa"][0].getChildByName("checkmark").active) {
					this.Toggles["shouchu"][0].active = true;
					this.Toggles["shouchu"][1].active = true;
					this.Toggles["shouchu"][2].active = true;
					this.Toggles["shouchu"][3].active = true;
				} else if (this.Toggles["wanfa"][1].getChildByName("checkmark").active) {
					var toggles = this.Toggles["shouchu"][0].parent;
					var key = toggles.name.substring('Toggles_'.length, toggles.name.length);
					this.ClearToggleCheck(this.Toggles["shouchu"], [4]);
					this.UpdateLabelColor(toggles, "fangfei" == key ? true : false);
					this.Toggles["shouchu"][0].active = false;
					this.Toggles["shouchu"][1].active = false;
					this.Toggles["shouchu"][2].active = false;
					this.Toggles["shouchu"][3].active = false;
					this.Toggles["shouchu"][4].active = true;
				}
			}
		}
		if (this.Toggles["liangpai"]) {
			if (this.Toggles["siren"][0].getChildByName("checkmark").active) {
				this.Toggles["liangpai"][0].parent.active = false;
			} else {
				this.Toggles["liangpai"][0].parent.active = true;
			}
			if (this.Toggles["renshu"][0].getChildByName("checkmark").active) {
				this.Toggles["liangpai"][0].parent.active = true;
			}
		}
		if (this.Toggles["hongtaoliangpai"]) {
			if (this.Toggles["liangpai"][1].getChildByName("checkmark").active) {
				this.Toggles["hongtaoliangpai"][0].parent.active = false;
			} else {
				this.Toggles["hongtaoliangpai"][0].parent.active = true;
			}
		}
		if (this.Toggles["kexuanwanfa"]) {
			if (this.Toggles["renshu"][0].getChildByName("checkmark").active) {
				this.Toggles["kexuanwanfa"][0].active = false;
			} else {
				this.Toggles["kexuanwanfa"][0].active = true;
			}
			if (this.Toggles["siren"][0].getChildByName("checkmark").active) {
				this.Toggles["kexuanwanfa"][1].active = false;
				this.Toggles["kexuanwanfa"][2].active = false;
			} else {
				this.Toggles["kexuanwanfa"][1].active = true;
				if (this.Toggles["liangpai"][1].getChildByName("checkmark").active || this.Toggles["liangpai"][2].getChildByName("checkmark").active) {
					this.Toggles["kexuanwanfa"][2].active = false;
				} else {
					this.Toggles["kexuanwanfa"][2].active = true;
				}
			}
		}
	},
	AdjustSendPack: function AdjustSendPack(sendPack) {
		if (sendPack.playerNum == 2) {
			this.RemoveRadioSelect(sendPack, "siren");
			this.RemoveMultiSelect(sendPack, "kexuanwanfa", 0);
			sendPack.wanfa = 0;
		}
		if (sendPack.playerNum == 4) {
			this.RemoveRadioSelect(sendPack, "shouchu");
		}
		if (sendPack.liangpai == 1 || sendPack.liangpai == 2) {
			this.RemoveMultiSelect(sendPack, "kexuanwanfa", 2);
		}
		if (sendPack.liangpai == 1) {
			this.RemoveRadioSelect(sendPack, "hongtaoliangpai");
		}
		if (sendPack.siren == 0) {
			this.RemoveRadioSelect(sendPack, "liangpai");
		}

		return sendPack;
	}
});

module.exports = twgzChildCreateRoom;

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
        //# sourceMappingURL=twgzChildCreateRoom.js.map
        