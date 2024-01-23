(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/tamj/tamjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '83c98ue6dtDVpXOMsQtSGV2', 'tamjChildCreateRoom', __filename);
// script/ui/uiGame/tamj/tamjChildCreateRoom.js

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
		var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
		var fangjian = this.GetIdxsByKey('fangjian');
		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');
		var gaoji = this.GetIdxsByKey('gaoji');

		sendPack = {
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
	// CreateSendPack -end-

	AdjustSendPack: function AdjustSendPack(sendPack) {
		// if (sendPack.kexuanwanfa.indexOf(1) === -1) {
		// 	this.RemoveRadioSelect(sendPack, "piaoshangxian");
		// }

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

		// if ('renshu' == key) {
		// 	// 	2人场不可选“一炮多响”；
		// 	// 	2/3人场不可选“跟庄”；
		// 	if (toggleIndex == 0) {//两人
		// 		this.Toggles["kexuanwanfa"][9].active = false;
		// 		this.Toggles["kexuanwanfa"][12].active = false;
		// 	}
		// 	else {
		// 		this.Toggles["kexuanwanfa"][9].active = true;
		// 		this.Toggles["kexuanwanfa"][12].active = true;
		// 		if (toggleIndex == 1) {// 三人
		// 			this.Toggles["kexuanwanfa"][9].active = false;
		// 		}
		// 	}
		// }

		if ('jushu' == key || 'renshu' == key || 'fangfei' == key) {
			// if ('renshu' == key) {
			// 	// 	二人场，隐藏“跟庄”玩法。
			// 	if (toggleIndex == 0) {
			// 		this.Toggles["kexuanwanfa"][7].active = false;
			// 	} else {
			// 		this.Toggles["kexuanwanfa"][7].active = true;
			// 	}
			// }
			this.ClearToggleCheck(needClearList, needShowIndexList);
			this.UpdateLabelColor(toggles);
			this.UpdateTogglesLabel(toggles, false);
			if ('renshu' == key) {
				if (toggleIndex == 2) {
					this.Toggles['kexuanwanfa'][6].active = true;
				} else {
					this.Toggles['kexuanwanfa'][6].active = false;
				}
			}
			return;
		} else if ('kexuanwanfa' == key) {
			// 	未勾选“买”玩法时，隐藏“庄家必买”。
			// if (toggleIndex == 0) {
			// 	if (!this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active) {
			// 		this.Toggles['kexuanwanfa'][5].active = true;
			// 	} else {
			// 		this.Toggles['kexuanwanfa'][5].active = false;
			// 	}
			// }
			// if (toggleIndex == 1) {
			// 	if (!this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active) {
			// 		this.Toggles['piaoshangxian'][0].parent.active = true;
			// 	} else {
			// 		this.Toggles['piaoshangxian'][0].parent.active = false;
			// 	}
			// }
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
			// 13，14
			// 	勾选“杠随胡走”则必须勾选“荒庄荒杠”，勾选“荒庄荒杠”可以不勾选“杠随胡走”；
			if (toggleIndex == 14) {
				if (!this.Toggles['kexuanwanfa'][14].getChildByName('checkmark').active) {
					this.Toggles['kexuanwanfa'][13].getChildByName('checkmark').active = true;
					this.UpdateLabelColor(this.Toggles['kexuanwanfa'][13].parent);
				}
			}

			if (toggleIndex == 13) {
				if (this.Toggles['kexuanwanfa'][13].getChildByName('checkmark').active) {
					this.Toggles['kexuanwanfa'][14].getChildByName('checkmark').active = false;
					this.UpdateLabelColor(this.Toggles['kexuanwanfa'][14].parent);
				}
			}
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

			// // 小局托管解散, 托管2小局解散",
			// if (this.Toggles['fangjian'][2].getChildByName('checkmark').active && toggleIndex == 3) {
			// 	this.Toggles['fangjian'][2].getChildByName('checkmark').active = false;
			// 	this.UpdateLabelColor(this.Toggles['fangjian'][2].parent);
			// } else if (this.Toggles['fangjian'][3].getChildByName('checkmark').active && toggleIndex == 2) {
			// 	this.Toggles['fangjian'][3].getChildByName('checkmark').active = false;
			// 	this.UpdateLabelColor(this.Toggles['fangjian'][3].parent);
			// }
			// 	自动准备和小局10秒自动准备不可同时勾选。
			// 	托管2小局解散和小局托管解散不可同时勾选；
			// if (this.Toggles['fangjian'][0].getChildByName('checkmark').active && toggleIndex == 1) {
			// 	this.Toggles['fangjian'][0].getChildByName('checkmark').active = false;
			// 	this.UpdateLabelColor(this.Toggles['fangjian'][0].parent);
			// } else if (this.Toggles['fangjian'][1].getChildByName('checkmark').active && toggleIndex == 0) {
			// 	this.Toggles['fangjian'][1].getChildByName('checkmark').active = false;
			// 	this.UpdateLabelColor(this.Toggles['fangjian'][1].parent);
			// }

			// if (this.Toggles['fangjian'][4].getChildByName('checkmark').active && toggleIndex == 5) {
			// 	this.Toggles['fangjian'][4].getChildByName('checkmark').active = false;
			// 	this.UpdateLabelColor(this.Toggles['fangjian'][4].parent);
			// } else if (this.Toggles['fangjian'][5].getChildByName('checkmark').active && toggleIndex == 4) {
			// 	this.Toggles['fangjian'][5].getChildByName('checkmark').active = false;
			// 	this.UpdateLabelColor(this.Toggles['fangjian'][5].parent);
			// }

			// 小局托管解散,解散次数不超过5次,
			// 托管2小局解散,解散次数不超过3次",
			if (this.Toggles['fangjian'][3].getChildByName('checkmark').active && toggleIndex == 5) {
				this.Toggles['fangjian'][3].getChildByName('checkmark').active = false;
				this.UpdateLabelColor(this.Toggles['fangjian'][3].parent);
			} else if (this.Toggles['fangjian'][5].getChildByName('checkmark').active && toggleIndex == 3) {
				this.Toggles['fangjian'][5].getChildByName('checkmark').active = false;
				this.UpdateLabelColor(this.Toggles['fangjian'][5].parent);
			}

			if (this.Toggles['fangjian'][2].getChildByName('checkmark').active && toggleIndex == 4) {
				this.Toggles['fangjian'][2].getChildByName('checkmark').active = false;
				this.UpdateLabelColor(this.Toggles['fangjian'][2].parent);
			} else if (this.Toggles['fangjian'][4].getChildByName('checkmark').active && toggleIndex == 2) {
				this.Toggles['fangjian'][4].getChildByName('checkmark').active = false;
				this.UpdateLabelColor(this.Toggles['fangjian'][4].parent);
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

		// 	“跟庄”仅4人场才可勾选；
		if (this.Toggles["kexuanwanfa"]) {
			if (this.Toggles["renshu"][2].getChildByName("checkmark").active) {
				this.Toggles["kexuanwanfa"][6].active = true;
			} else {
				this.Toggles["kexuanwanfa"][6].active = false;
			}

			if (this.Toggles["kexuanwanfa"][14].getChildByName("checkmark").active) {
				this.Toggles["kexuanwanfa"][13].getChildByName("checkmark").active = true;
			}
			if (!this.Toggles["kexuanwanfa"][13].getChildByName("checkmark").active) {
				this.Toggles["kexuanwanfa"][14].getChildByName("checkmark").active = false;
			}
		}
		// 	2人场不可选“一炮多响”；
		// 	2/3人场不可选“跟庄”；
		// if (this.Toggles["kexuanwanfa"]) {
		// 	if (this.Toggles["renshu"] && this.Toggles["renshu"][0].getChildByName("checkmark").active) {
		// 		this.Toggles["kexuanwanfa"][9].active = false;
		// 		this.Toggles["kexuanwanfa"][12].active = false;
		// 	} else {
		// 		this.Toggles["kexuanwanfa"][9].active = true;
		// 		this.Toggles["kexuanwanfa"][12].active = true;
		// 		if (this.Toggles["renshu"] && this.Toggles["renshu"][1].getChildByName("checkmark").active) {
		// 			this.Toggles["kexuanwanfa"][9].active = false;
		// 		}
		// 	}
		// }
		// // 	未勾选“买”玩法时，隐藏“庄家必买”。
		// if (this.Toggles["kexuanwanfa"]) {
		// 	if (!this.Toggles["kexuanwanfa"][0].getChildByName("checkmark").active) {
		// 		this.Toggles["kexuanwanfa"][5].active = false;
		// 	} else {
		// 		this.Toggles["kexuanwanfa"][5].active = true;
		// 	}
		// }

		// // 	二人场，隐藏“跟庄”玩法。
		// if (this.Toggles["renshu"] && this.Toggles["kexuanwanfa"]) {
		// 	if (this.Toggles["renshu"][0].getChildByName("checkmark").active) {
		// 		this.Toggles["kexuanwanfa"][7].active = false;
		// 	} else {
		// 		this.Toggles["kexuanwanfa"][7].active = true;
		// 	}
		// }

		// if (this.Toggles["kexuanwanfa"] && this.Toggles["piaoshangxian"]) {
		// 	if (this.Toggles["kexuanwanfa"][1].getChildByName("checkmark").active) {
		// 		this.Toggles["piaoshangxian"][0].parent.active = true;
		// 	} else {
		// 		this.Toggles["piaoshangxian"][0].parent.active = false;
		// 	}
		// }
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
        //# sourceMappingURL=tamjChildCreateRoom.js.map
        