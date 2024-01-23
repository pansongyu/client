(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/hnzzmj/hnzzmjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '83c14C/169AvoC7I/97F3rK', 'hnzzmjChildCreateRoom', __filename);
// script/ui/uiGame/hnzzmj/hnzzmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var hnzzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var hufa = this.GetIdxByKey('hufa');
        var pao = this.GetIdxByKey("pao");
        var gudingpao = this.GetIdxByKey("gudingpao");
        var fangjian = [];
        var fengDing = this.GetIdxByKey('fengDing');
        var huPai = this.GetIdxByKey('huPai');
        var kexuanwanfa = [];
        var gaoji = [];
        for (var i = 0; i < this.Toggles['fangjian'].length; i++) {
            if (this.Toggles['fangjian'][i].getChildByName('checkmark').active) {
                fangjian.push(i);
            }
        }
        for (var _i = 0; _i < this.Toggles['kexuanwanfa'].length; _i++) {
            if (this.Toggles['kexuanwanfa'][_i].getChildByName('checkmark').active) {
                kexuanwanfa.push(_i);
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
            "hufa": hufa,
            "pao": pao,
            "gudingpao": gudingpao,
            "fangjian": fangjian,
            "fengDing": fengDing,
            "huPai": huPai,
            //房间默认配置（人数局数支付）
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
            return;
        } else if ('pao' == key) {
            if (toggleIndex < 2) {
                this.ClearToggleCheck(this.Toggles['gudingpao'], []);
                this.UpdateLabelColor(this.Toggles['gudingpao'][0].parent);
            } else {
                this.ClearToggleCheck(this.Toggles['gudingpao'], [1]);
                this.UpdateLabelColor(this.Toggles['gudingpao'][1].parent);
            }
        } else if ('gudingpao' == key) {
            if (this.Toggles['pao'][2].getChildByName('checkmark').active == false) {
                app.SysNotifyManager().ShowSysMsg("固定跑玩法才能选", [], 3);
                return;
            }
        } else if ('kexuanwanfa' == key) {
            // if(toggleIndex <2){
            //    this.ClearToggleCheck(this.Toggles['fengding'],[1]);
            //    this.UpdateLabelColor(this.Toggles['fengding'][1].parent);
            // }
        } else if ('fengding' == key) {
            // if(toggleIndex==0){
            //    if(this.Toggles['kexuanwanfa'][2].getChildByName('checkmark').active ==false){
            //         this.ShowSysMsg('梓埠清混才能选择封顶');
            //         return;
            //    }
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
        this.UpdateLabelColor(toggles, 'fangfei' == key ? true : false);
    }
});

module.exports = hnzzmjChildCreateRoom;

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
        //# sourceMappingURL=hnzzmjChildCreateRoom.js.map
        