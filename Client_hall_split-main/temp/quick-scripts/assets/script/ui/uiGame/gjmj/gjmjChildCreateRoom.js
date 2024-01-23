(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/gjmj/gjmjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4c238R1GvdGH5XaXr4bHieJ', 'gjmjChildCreateRoom', __filename);
// script/ui/uiGame/gjmj/gjmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var hamjChildCreateRoom = cc.Class({

    extends: require("BaseChildCreateRoom"),

    properties: {},

    // CreateSendPack -start-
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var hupai = this.GetIdxByKey('hupai');
        var difen = this.GetIdxByKey('difen');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var fangjian = this.GetIdxsByKey('fangjian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "hupai": hupai,
            "difen": difen,
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
        if (sendPack.kexuanwanfa.indexOf(0) == -1) {
            // 可锤
            this.RemoveRadioSelect(sendPack, "kechui");
        }
        if (sendPack.kexuanwanfa.indexOf(1) == -1) {
            // 甩骰子
            this.RemoveRadioSelect(sendPack, "shuaitouzi");
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
            this.ClearToggleCheck(needClearList, needShowIndexList);
            this.UpdateLabelColor(toggles);
            this.UpdateTogglesLabel(toggles, false);
            return;
        } else if ('kexuanwanfa' == key) {
            // if(this.Toggles['zhuaniao'][0].getChildByName('checkmark').active==true && toggleIndex==4){
            //     //红中赖子
            //     app.SysNotifyManager().ShowSysMsg("按庄家中鸟不能勾选红中癞子玩法");
            //     return;
            // }
            // 	可锤：自由锤,铁锤；
            // 	单选，默认自由锤；
            // 	可选玩法中勾选“可锤”，才能选择该玩法，否则隐藏；
            // if (toggleIndex == 0) {
            //     if (this.Toggles["kexuanwanfa"][0].getChildByName("checkmark").active) { // 可/s/s/s/s/s/s锤
            //         this.Toggles["kechui"][0].parent.active = false;
            //     } else {
            //         this.Toggles["kechui"][0].parent.active = true;
            //     }
            // }

            // // 	甩骰子：3分,6分,9分；
            // // 	单选，默认3分；
            // // 	可选玩法中勾选“甩骰子”，才能选择该玩法，否则隐藏；	
            // if (toggleIndex == 1) {
            //     if (this.Toggles["kexuanwanfa"][1].getChildByName("checkmark").active) { // 甩/s/s骰/s/s/s子
            //         this.Toggles["shuaitouzi"][0].parent.active = false;
            //     } else {
            //         this.Toggles["shuaitouzi"][0].parent.active = true;
            //     }
            // }
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
    },

    OnUpdateTogglesLabel: function OnUpdateTogglesLabel(TogglesNode) {
        // 	可锤：自由锤,铁锤；
        // 	单选，默认自由锤；
        // 	可选玩法中勾选“可锤”，才能选择该玩法，否则隐藏；
        // if (this.Toggles["kechui"]) {
        //     if (this.Toggles["kexuanwanfa"][0].getChildByName("checkmark").active) { // 可/s/s/s/s/s/s锤
        //         this.Toggles["kechui"][0].parent.active = true;
        //     } else {
        //         this.Toggles["kechui"][0].parent.active = false;
        //     }
        // }

        // // 	甩骰子：3分,6分,9分；
        // // 	单选，默认3分；
        // // 	可选玩法中勾选“甩骰子”，才能选择该玩法，否则隐藏；		
        // if (this.Toggles["shuaitouzi"]) {
        //     if (this.Toggles["kexuanwanfa"][1].getChildByName("checkmark").active) { // 甩/s/s骰/s/s/s子
        //         this.Toggles["shuaitouzi"][0].parent.active = true;
        //     } else {
        //         this.Toggles["shuaitouzi"][0].parent.active = false;
        //     }
        // }

        var isResetPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    }

});

module.exports = hamjChildCreateRoom;

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
        //# sourceMappingURL=gjmjChildCreateRoom.js.map
        