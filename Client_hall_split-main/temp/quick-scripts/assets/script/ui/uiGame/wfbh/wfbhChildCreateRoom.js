(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/wfbh/wfbhChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6303aJXdptNZLWgVCxrpKKr', 'wfbhChildCreateRoom', __filename);
// script/ui/uiGame/wfbh/wfbhChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var a3pkChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},

    // CreateSendPack -start-
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var difen = this.GetIdxByKey('difen');
        var wanfa = this.GetIdxByKey('wanfa');
        var paixingdaxiao = this.GetIdxByKey('paixingdaxiao');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var fangjian = this.GetIdxsByKey('fangjian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "difen": difen,
            "wanfa": wanfa,
            "paixingdaxiao": paixingdaxiao,
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
            if (key == "renshu") {
                if (toggleIndex == 1) {
                    // 6人
                    this.Toggles["kexuanwanfa"][1].active = false;
                    this.Toggles["kexuanwanfa"][2].active = false;
                    this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
                }
            }
            this.ClearToggleCheck(needClearList, needShowIndexList);
            this.UpdateLabelColor(toggles);
            this.UpdateTogglesLabel(toggles, false);

            return;
        } else if ('kexuanwanfa' == key) {}
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
    },

    /**
     * 单选
     */
    GetIdxByKey: function GetIdxByKey(key) {
        if (!this.Toggles[key]) {
            return -1;
        }

        for (var i = 0; i < this.Toggles[key].length; i++) {
            var mark = this.Toggles[key][i].getChildByName('checkmark').active;
            if (this.Toggles[key][i].active && mark) {
                return i;
            }
        }
    },
    /**
     * 多选
     */
    GetIdxsByKey: function GetIdxsByKey(key) {
        if (!this.Toggles[key]) {
            return [];
        }

        var arr = [];
        for (var i = 0; i < this.Toggles[key].length; i++) {
            if (this.Toggles[key][i].active && this.Toggles[key][i].getChildByName('checkmark').active) {
                arr.push(i);
            }
        }
        return arr;
    },

    OnUpdateTogglesLabel: function OnUpdateTogglesLabel(TogglesNode) {
        // if (this.Toggles["fangjian"] && this.Toggles["fafen"]) {
        // 	if (!this.Toggles["fafen"][4].getChildByName("checkmark").active) {
        // 		this.Toggles["fangjian"][0].active = false;
        // 		this.UpdateLabelColor(this.Toggles['fangjian'][0].parent);
        // 	} else {
        // 		this.Toggles["fangjian"][0].active = true;
        // 	}
        // }
        // if (this.Toggles["fafen"]) {
        // 	if (this.Toggles["kexuanwanfa"][2].getChildByName("checkmark").active) {
        // 		this.Toggles["fafen"][0].parent.active = false;
        // 		this.Toggles["fangjian"][0].active = true;
        // 	} else {
        // 		this.Toggles["fafen"][0].parent.active = true;
        // 		if (!this.Toggles["fafen"][4].getChildByName("checkmark").active) {
        // 			this.Toggles["fangjian"][0].active = false;
        // 		}
        // 	}
        // }

        // if (this.Toggles["kexuanwanfa"]) {
        // 	if (this.Toggles["renshu"][0].getChildByName("checkmark").active) {	// 4人
        // 		this.Toggles["kexuanwanfa"][1].active = true;
        // 		this.Toggles["kexuanwanfa"][2].active = true;
        // 	} else {
        // 		this.Toggles["kexuanwanfa"][1].active = false;
        // 		this.Toggles["kexuanwanfa"][2].active = false;
        // 	}
        // }

        var isResetPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    }

});

module.exports = a3pkChildCreateRoom;

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
        //# sourceMappingURL=wfbhChildCreateRoom.js.map
        