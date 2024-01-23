(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/hylymj/hylymjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'df392Vd4txNaLSI0NT+DF3q', 'hylymjChildCreateRoom', __filename);
// script/ui/uiGame/hylymj/hylymjChildCreateRoom.js

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

        var guipai = this.GetIdxByKey('guipai');
        var shagui = this.GetIdxByKey('shagui');
        var guipaijiafen = this.GetIdxByKey('guipaijiafen');
        var ewaifenshu = this.GetIdxByKey('ewaifenshu');
        var jiabei = this.GetIdxByKey('jiabei');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var fangjian = this.GetIdxsByKey('fangjian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {

            "guipai": guipai,
            "shagui": shagui,
            "guipaijiafen": guipaijiafen,
            "ewaifenshu": ewaifenshu,
            "jiabei": jiabei,
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
    AdjustSendPack: function AdjustSendPack(sendPack) {
        if (sendPack.shagui < 3) {
            sendPack.guipaijiafen = -1;
        }
        if (parseInt(sendPack.playerMinNum) != 2) {
            sendPack.ewaifenshu = -1;
            sendPack.jiabei = -1;
        } else {
            if (sendPack.ewaifenshu != 1) {
                sendPack.jiabei = -1;
            }
        }
        return sendPack;
    },

    GetIdxsByKey: function GetIdxsByKey(key) {
        if (!this.Toggles[key]) {
            return [];
        }

        var arr = [];
        for (var i = 0; i < this.Toggles[key].length; i++) {
            if (this.Toggles[key][i].getChildByName('checkmark').active) {
                arr.push(i);
            }
        }
        return arr;
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

        if ('jushu' == key || 'renshu' == key || 'fangfei' == key || "zhuaniaomoshi" == key) {
            this.ClearToggleCheck(needClearList, needShowIndexList);
            this.UpdateLabelColor(toggles);
            this.UpdateTogglesLabel(toggles, false);
            this.UpdateOnClickToggle();
            return;
        } else if ('kexuanwanfa' == key) {} else if ("fangjian" == key) {}
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
        if (this.Toggles['guipaijiafen']) {
            if (this.Toggles['shagui'][3].getChildByName("checkmark").active || this.Toggles['shagui'][4].getChildByName("checkmark").active) {
                this.Toggles['guipaijiafen'][0].parent.active = true;
            } else {
                this.Toggles['guipaijiafen'][0].parent.active = false;
            }
        }
        if (this.Toggles['ewaifenshu']) {
            if (this.Toggles['renshu'][0].getChildByName("checkmark").active) {
                this.Toggles['ewaifenshu'][0].parent.active = true;
            } else {
                this.Toggles['ewaifenshu'][0].parent.active = false;
            }
        }
        if (this.Toggles['jiabei']) {
            if (this.Toggles['renshu'][0].getChildByName("checkmark").active) {
                if (this.Toggles['ewaifenshu'][1].getChildByName("checkmark").active) {
                    this.Toggles['jiabei'][0].parent.active = true;
                } else {
                    this.Toggles['jiabei'][0].parent.active = false;
                }
            } else {
                this.Toggles['jiabei'][0].parent.active = false;
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
        //# sourceMappingURL=hylymjChildCreateRoom.js.map
        