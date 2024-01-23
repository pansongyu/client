(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/sgmj/sgmjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '04f52ipkUNGzJ069OyyEBbS', 'sgmjChildCreateRoom', __filename);
// script/ui/uiGame/sgmj/sgmjChildCreateRoom.js

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
		var mapai = this.GetIdxByKey("mapai");
		var jiesan = this.GetIdxByKey("jiesan");
		var xianShi = this.GetIdxByKey("xianShi");
		var fangjian = [];
		for (var i = 0; i < this.Toggles['fangjian'].length; i++) {
			if (this.Toggles['fangjian'][i].getChildByName('checkmark').active) {
				fangjian.push(i);
			}
		}
		var kexuanwanfa = [];
		for (var _i = 0; _i < this.Toggles['kexuanwanfa'].length; _i++) {
			if (this.Toggles['kexuanwanfa'][_i].getChildByName('checkmark').active) {
				kexuanwanfa.push(_i);
			}
		}
		var gaoji = [];
		for (var _i2 = 0; _i2 < this.Toggles['gaoji'].length; _i2++) {
			if (this.Toggles['gaoji'][_i2].getChildByName('checkmark').active) {
				gaoji.push(_i2);
			}
		}
		sendPack = {
			"mapai": mapai,
			"jiesan": jiesan,
			"xianShi": xianShi,
			"fangjian": fangjian,
			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard,
			"gaoji": gaoji,
			"kexuanwanfa": kexuanwanfa
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
			if (toggleIndex == 19 && needClearList[23].getChildByName('checkmark').active) {
				app.SysNotifyManager().ShowSysMsg("已勾选不可鸡胡时，不可取消庄家不可鸡胡");
				return;
			} else if (toggleIndex == 23 && !needClearList[toggleIndex].getChildByName('checkmark').active) {
				needClearList[19].getChildByName('checkmark').active = true;
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
		this.UpdateToggleXuanZhong(toggleIndex);
		this.UpdateLabelColor(toggles, 'fangfei' == key ? true : false);
	},
	UpdateToggleXuanZhong: function UpdateToggleXuanZhong(toggleIndex) {
		if (toggleIndex == 24) {
			if (this.Toggles['kexuanwanfa'][24].getChildByName('checkmark').active == false) {
				if (this.Toggles['kexuanwanfa'][25].getChildByName('checkmark').active == true) {
					this.Toggles['kexuanwanfa'][20].getChildByName('checkmark').active = true;
					this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
				}
			}
			if (this.Toggles['kexuanwanfa'][24].getChildByName('checkmark').active == true) {
				this.Toggles['kexuanwanfa'][20].getChildByName('checkmark').active = false;
				this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
			}
		}
		if (toggleIndex == 20) {
			if (this.Toggles['kexuanwanfa'][20].getChildByName('checkmark').active == true) {
				this.Toggles['kexuanwanfa'][24].getChildByName('checkmark').active = false;
				this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
			}
			if (this.Toggles['kexuanwanfa'][20].getChildByName('checkmark').active == false) {
				this.Toggles['kexuanwanfa'][25].getChildByName('checkmark').active = false;
				this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
			}
		}
		if (toggleIndex == 25) {
			if (this.Toggles['kexuanwanfa'][25].getChildByName('checkmark').active == true) {
				if (this.Toggles['kexuanwanfa'][24].getChildByName('checkmark').active == false) {
					this.Toggles['kexuanwanfa'][20].getChildByName('checkmark').active = true;
				}
				this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
			}
		}
	}
});

module.exports = fzmjChildCreateRoom;

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
        //# sourceMappingURL=sgmjChildCreateRoom.js.map
        