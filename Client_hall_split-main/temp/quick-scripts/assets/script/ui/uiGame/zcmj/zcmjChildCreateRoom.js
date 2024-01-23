(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/zcmj/zcmjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1adc7Dy9eVN47OLOzJF97sd', 'zcmjChildCreateRoom', __filename);
// script/ui/uiGame/zcmj/zcmjChildCreateRoom.js

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
        var hupaifangshi = this.GetIdxByKey('hupaifangshi');
        var tingpai = this.GetIdxByKey('tingpai');
        var wanfa = this.GetIdxByKey('wanfa');
        var quemen = this.GetIdxByKey('quemen');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var jiazui = this.GetIdxsByKey('jiazui');
        var fangjian = this.GetIdxsByKey('fangjian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "hupaifangshi": hupaifangshi,
            "tingpai": tingpai,
            "wanfa": wanfa,
            "quemen": quemen,
            "kexuanwanfa": kexuanwanfa,
            "jiazui": jiazui,
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
        // if (sendPack.kexuanwanfa.indexOf(0) == -1) {	// 可锤
        // 	this.RemoveRadioSelect(sendPack, "kechui");
        // }
        // if (sendPack.kexuanwanfa.indexOf(1) == -1) {	// 甩骰子
        // 	this.RemoveRadioSelect(sendPack, "shuaitouzi");
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
            // // 	可锤：自由锤,铁锤；
            // // 	单选，默认自由锤；
            // // 	可选玩法中勾选“可锤”，才能选择该玩法，否则隐藏；
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

            // 	勾选“下跑”才能勾选“杠跑”；
            if (toggleIndex == 1) {
                // 下跑
                if (!this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active) {
                    this.Toggles['kexuanwanfa'][3].active = true;
                } else {
                    this.Toggles['kexuanwanfa'][3].active = false;
                }
            }
        } else if ('quemen' == key) {
            // 	勾选“活缺缺门”才能勾选“不报听”；
            if (toggleIndex == 1) {
                // 活缺缺门
                if (this.Toggles['tingpai'][0].getChildByName('checkmark').active) {
                    var noBaoTingToggle = this.Toggles['tingpai'][0];
                    noBaoTingToggle.getChildByName('checkmark').active = false;
                    this.UpdateLabelColor(noBaoTingToggle.parent);
                    this.UpdateTogglesLabel(noBaoTingToggle.parent);

                    var mingTingToggle = this.Toggles['tingpai'][1];
                    mingTingToggle.getChildByName('checkmark').active = true;
                    this.UpdateLabelColor(mingTingToggle.parent);
                    this.UpdateTogglesLabel(mingTingToggle.parent);

                    // let noBaoTingToggle2 = this.Toggles['tingpai'][2];
                    // noBaoTingToggle2.getChildByName('checkmark').active = false;
                    // this.UpdateLabelColor(noBaoTingToggle2.parent);
                    // this.UpdateTogglesLabel(noBaoTingToggle2.parent);
                }

                this.Toggles['tingpai'][0].active = true;
                this.Toggles['kexuanwanfa'][5].active = true;
            } else {

                if (this.Toggles['tingpai'][0].getChildByName('checkmark').active) {
                    var _mingTingToggle = this.Toggles['tingpai'][1];
                    _mingTingToggle.getChildByName('checkmark').active = true;
                    this.UpdateLabelColor(_mingTingToggle.parent);
                    this.UpdateTogglesLabel(_mingTingToggle.parent);
                }

                this.Toggles['tingpai'][0].active = false;
                this.Toggles['kexuanwanfa'][5].active = false;
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
    },

    OnUpdateTogglesLabel: function OnUpdateTogglesLabel(TogglesNode) {
        var isResetPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        // 	勾选“活缺缺门”才能勾选“不报听”；
        if (this.Toggles["tingpai"]) {
            if (this.Toggles["quemen"] && this.Toggles["quemen"][1] && this.Toggles["quemen"][1].getChildByName("checkmark").active) {
                this.Toggles["tingpai"][0].active = true;
            } else {
                this.Toggles["tingpai"][0].active = false;
            }
        }

        // 	勾选“活缺缺门”才能勾选“亮四打一”；
        if (this.Toggles["kexuanwanfa"]) {
            if (this.Toggles["quemen"] && this.Toggles["quemen"][1] && this.Toggles["quemen"][1].getChildByName("checkmark").active) {
                this.Toggles["kexuanwanfa"][5].active = true;
            } else {
                this.Toggles["kexuanwanfa"][5].active = false;
            }
        }

        // 	勾选“下跑”才能勾选“杠跑”；
        if (this.Toggles["kexuanwanfa"]) {
            if (this.Toggles["kexuanwanfa"] && this.Toggles["kexuanwanfa"][1] && this.Toggles["kexuanwanfa"][1].getChildByName("checkmark").active) {
                this.Toggles["kexuanwanfa"][3].active = true;
            } else {
                this.Toggles["kexuanwanfa"][3].active = false;
            }
        }
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
        //# sourceMappingURL=zcmjChildCreateRoom.js.map
        