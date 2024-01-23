(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/wzqsmj/wzqsmjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fed2cZX2+VP3rml+/WhALT4', 'wzqsmjChildCreateRoom', __filename);
// script/ui/uiGame/wzqsmj/wzqsmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var jsnyzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var piaoHua = this.GetIdxByKey('piaoHua');
        var piaohuaxuanze = this.GetIdxByKey('piaohuaxuanze');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var fangjian = this.GetIdxsByKey('fangjian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

        if (piaoHua != 1) {
            piaohuaxuanze = -1;
        }

        sendPack = {
            "piaoHua": piaoHua,
            "piaohuaxuanze": piaohuaxuanze,
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
        } else if ("fangjian" == key) {
            // 小局托管解散,解散次数不超过5次,
            // 托管2小局解散,解散次数不超过3次",
            if (this.Toggles['fangjian'][2].getChildByName('checkmark').active && toggleIndex == 3) {
                this.Toggles['fangjian'][2].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][2].parent);
            } else if (this.Toggles['fangjian'][3].getChildByName('checkmark').active && toggleIndex == 2) {
                this.Toggles['fangjian'][3].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][3].parent);
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

    UpdateOnClickToggle: function UpdateOnClickToggle() {
        if (this.Toggles["piaohuaxuanze"]) {
            if (this.Toggles["piaoHua"][1].getChildByName("checkmark").active) {
                this.Toggles['piaohuaxuanze'][0].parent.active = true;
            } else {
                this.Toggles['piaohuaxuanze'][0].parent.active = false;
            }
        }
        // if(this.Toggles["kexuanwanfa"]){
        //     this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
        //     if(this.Toggles["wanfa"][1].getChildByName("checkmark").active){
        //         this.Toggles['kexuanwanfa'][0].getChildByName("checkmark").active = false;
        //         //置灰
        //         if(this.Toggles['kexuanwanfa'][0].getChildByName("label")){
        //             this.Toggles['kexuanwanfa'][0].getChildByName("label").color = cc.color(180, 180, 180);
        //         }
        //     }else{
        //         //恢复
        //         if(this.Toggles['kexuanwanfa'][0].getChildByName("label")){
        //             this.Toggles['kexuanwanfa'][0].getChildByName("label").color = cc.color(158, 49, 16);
        //         }
        //     }
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
        //# sourceMappingURL=wzqsmjChildCreateRoom.js.map
        