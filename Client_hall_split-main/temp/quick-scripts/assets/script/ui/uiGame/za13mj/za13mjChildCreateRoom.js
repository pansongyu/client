(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/za13mj/za13mjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '97477d087JOxLoMXqgZ3TLB', 'za13mjChildCreateRoom', __filename);
// script/ui/uiGame/za13mj/za13mjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var zjmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var mashu = this.GetIdxByKey('mashu');
        var difen = this.GetIdxByKey('difen');
        var fangjian = [];
        var gaoji = [];
        var kexuanwanfa = [];
        for (var i = 0; i < this.Toggles['kexuanwanfa'].length; i++) {
            if (this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active) {
                kexuanwanfa.push(i);
            }
        }
        for (var _i = 0; _i < this.Toggles['fangjian'].length; _i++) {
            if (this.Toggles['fangjian'][_i].getChildByName('checkmark').active) {
                fangjian.push(_i);
            }
        }
        for (var _i2 = 0; _i2 < this.Toggles['gaoji'].length; _i2++) {
            if (this.Toggles['gaoji'][_i2].getChildByName('checkmark').active) {
                gaoji.push(_i2);
            }
        }
        sendPack = {
            "xianShi": xianShi,
            "jiesan": jiesan,
            "fangjian": fangjian,
            "mashu": mashu,
            "difen": difen,
            //房间默认配置（人数局数支付）
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "kexuanwanfa": kexuanwanfa,
            "paymentRoomCardType": isSpiltRoomCard,
            "gaoji": gaoji
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
            if (toggleIndex == 0) {
                this.Toggles['mashu'][0].parent.active = !this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active;
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

module.exports = zjmjChildCreateRoom;

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
        //# sourceMappingURL=za13mjChildCreateRoom.js.map
        