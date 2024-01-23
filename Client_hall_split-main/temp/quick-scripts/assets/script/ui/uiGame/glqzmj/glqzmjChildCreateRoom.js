(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/glqzmj/glqzmjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7f850lDtY5EprpOjSwGADqz', 'glqzmjChildCreateRoom', __filename);
// script/ui/uiGame/glqzmj/glqzmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var qymjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},

    // CreateSendPack -start-
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var fanxing = this.GetIdxsByKey('fanxing');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var fangjian = this.GetIdxsByKey('fangjian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "fanxing": fanxing,
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
            this.ClearToggleCheck(needClearList, needShowIndexList);
            this.UpdateLabelColor(toggles);
            this.UpdateTogglesLabel(toggles, false);
            return;
        } else if ('fanxing' == key) {
            if (toggleIndex == 3) {
                if (this.Toggles['fanxing'][3].getChildByName('checkmark').active == false) {
                    if (this.Toggles['fanxing'][0].getChildByName('checkmark').active == false && this.Toggles['fanxing'][1].getChildByName('checkmark').active == false && this.Toggles['fanxing'][0].getChildByName('checkmark').active == false) {
                        this.ShowSysMsg("上醒中醒下醒未勾选，不能勾选四醒重翻");
                        return;
                    }
                }
            }
        } else if ('kexuanwanfa' == key) {}
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
        // if (toggleIndex == 1 && this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active) {
        // 	this.Toggles['kexuanwanfa'][2].active = false;
        // } else {
        // 	this.Toggles['kexuanwanfa'][2].active = true;
        // }

        // else if ('xiapao' == key) {
        //     if (toggleIndex == 5 && !needClearList[toggleIndex].getChildByName('checkmark').active) {
        //         this.Toggles['zuigaopaoshu'][0].parent.active = true;
        //     } else {
        //         this.Toggles['zuigaopaoshu'][0].parent.active = false;
        //     }
        // }

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
        if (this.Toggles['fanxing'][0].getChildByName('checkmark').active == false && this.Toggles['fanxing'][1].getChildByName('checkmark').active == false && this.Toggles['fanxing'][2].getChildByName('checkmark').active == false) {
            this.Toggles['fanxing'][3].getChildByName('checkmark').active = false;
            this.UpdateLabelColor(this.Toggles['fanxing'][3].parent);
        }
    },
    OnUpdateTogglesLabel: function OnUpdateTogglesLabel(TogglesNode) {
        // if (this.Toggles["kexuanwanfa"]) {
        //     if (this.Toggles["kexuanwanfa"][1].getChildByName("checkmark").active) {
        //         this.Toggles["kexuanwanfa"][2].active = true;
        //     } else {
        //         this.Toggles["kexuanwanfa"][2].active = false;
        //     }
        // }

        var isResetPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    }

});

module.exports = qymjChildCreateRoom;

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
        //# sourceMappingURL=glqzmjChildCreateRoom.js.map
        