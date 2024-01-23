(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/wxls/wxlsChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6307ajmqPdCu4AiiA4QDQKW', 'wxlsChildCreateRoom', __filename);
// script/ui/uiGame/wxls/wxlsChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var wxlsChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var huludaoshu = this.GetIdxByKey('huludaoshu');
		var teshupaixing = this.GetIdxByKey('teshupaixing');
		var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
		var daqiang = this.GetIdxByKey('daqiang');
		var fangjian = this.GetIdxsByKey('fangjian');
		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');
		var gaoji = this.GetIdxsByKey('gaoji');

		sendPack = {
			"huludaoshu": huludaoshu,
			"teshupaixing": teshupaixing,
			"kexuanwanfa": kexuanwanfa,
			"daqiang": daqiang,
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
		if ('fangjian' == key) {
			if (toggleIndex == 1) {
				if (this.Toggles["fangjian"][3].getChildByName("checkmark").active) {
					app.SysNotifyManager().ShowSysMsg("玩法重复");
					this.Toggles['fangjian'][1].getChildByName('checkmark').active = false;
					this.UpdateLabelColor(this.Toggles['fangjian'][1].parent);
				}
			}
			if (toggleIndex == 2) {
				if (this.Toggles["fangjian"][4].getChildByName("checkmark").active) {
					app.SysNotifyManager().ShowSysMsg("玩法重复");
					this.Toggles['fangjian'][2].getChildByName('checkmark').active = false;
					this.UpdateLabelColor(this.Toggles['fangjian'][1].parent);
				}
			}
			if (toggleIndex == 3) {
				if (this.Toggles["fangjian"][1].getChildByName("checkmark").active) {
					app.SysNotifyManager().ShowSysMsg("玩法重复");
					this.Toggles['fangjian'][3].getChildByName('checkmark').active = false;
					this.UpdateLabelColor(this.Toggles['fangjian'][1].parent);
				}
			}
			if (toggleIndex == 4) {
				if (this.Toggles["fangjian"][2].getChildByName("checkmark").active) {
					app.SysNotifyManager().ShowSysMsg("玩法重复");
					this.Toggles['fangjian'][4].getChildByName('checkmark').active = false;
					this.UpdateLabelColor(this.Toggles['fangjian'][1].parent);
				}
			}
		}
		this.UpdateLabelColor(toggles, 'fangfei' == key ? true : false);
		this.UpdateOnClickToggle();
	}
});

module.exports = wxlsChildCreateRoom;

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
        //# sourceMappingURL=wxlsChildCreateRoom.js.map
        