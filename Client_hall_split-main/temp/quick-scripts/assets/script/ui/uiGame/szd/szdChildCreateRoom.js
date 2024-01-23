(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/szd/szdChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a9f06MgcB1MXaJ8ekGTzFWm', 'szdChildCreateRoom', __filename);
// script/ui/uiGame/szd/szdChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var zdChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var difen = this.GetIdxByKey('difen');
        var shangxian = this.GetIdxByKey('shangxian');
        var yongpai = this.GetIdxByKey('yongpai');
        var duizi = this.GetIdxByKey('duizi');
        var bipai = this.GetIdxByKey('bipai');
        var maipai = this.GetIdxByKey('maipai');

        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var fangjian = this.GetIdxsByKey('fangjian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "difen": difen,
            "shangxian": shangxian,
            "yongpai": yongpai,
            "duizi": duizi,
            "bipai": bipai,
            "maipai": maipai,

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
            this.UpdateOnClickToggle();
            return;
        } else if ('kexuanwanfa' == key) {
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
        } else if ("fangjian" == key) {
            // 小局托管解散,解散次数不超过5次,
            // 托管2小局解散,解散次数不超过3次",
            if (this.Toggles['fangjian'][3].getChildByName('checkmark').active && toggleIndex == 5) {
                this.Toggles['fangjian'][3].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][3].parent);
            } else if (this.Toggles['fangjian'][5].getChildByName('checkmark').active && toggleIndex == 3) {
                this.Toggles['fangjian'][5].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][5].parent);
            }

            if (this.Toggles['fangjian'][2].getChildByName('checkmark').active && toggleIndex == 4) {
                this.Toggles['fangjian'][2].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][2].parent);
            } else if (this.Toggles['fangjian'][4].getChildByName('checkmark').active && toggleIndex == 2) {
                this.Toggles['fangjian'][4].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][4].parent);
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
        // if(this.Toggles["kexuanwanfa"]){
        //     this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
        //     if(this.Toggles["renshu"][2].getChildByName("checkmark").active){
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
        // if (this.Toggles["zhadanfengding"]) {
        //     if (this.Toggles["kongzha"][0].getChildByName("checkmark").active) {
        //         this.Toggles['zhadanfengding'][0].parent.active = false;
        //     } else {
        //         this.Toggles['zhadanfengding'][0].parent.active = true;
        //     }
        // }
        //置灰
        this.Toggles['fangjian'][0].getChildByName("checkmark").active = false;
        if (this.Toggles['fangjian'][0].getChildByName("label")) {
            this.Toggles['fangjian'][0].getChildByName("label").color = cc.color(180, 180, 180);
        }
        this.Toggles['fangjian'][2].getChildByName("checkmark").active = false;
        if (this.Toggles['fangjian'][2].getChildByName("label")) {
            this.Toggles['fangjian'][2].getChildByName("label").color = cc.color(180, 180, 180);
        }
        this.Toggles['fangjian'][3].getChildByName("checkmark").active = false;
        if (this.Toggles['fangjian'][3].getChildByName("label")) {
            this.Toggles['fangjian'][3].getChildByName("label").color = cc.color(180, 180, 180);
        }
        this.Toggles['fangjian'][4].getChildByName("checkmark").active = false;
        if (this.Toggles['fangjian'][4].getChildByName("label")) {
            this.Toggles['fangjian'][4].getChildByName("label").color = cc.color(180, 180, 180);
        }
        this.Toggles['fangjian'][5].getChildByName("checkmark").active = false;
        if (this.Toggles['fangjian'][5].getChildByName("label")) {
            this.Toggles['fangjian'][5].getChildByName("label").color = cc.color(180, 180, 180);
        }
        this.Toggles['jiesan'][0].getChildByName("checkmark").active = false;
        if (this.Toggles['jiesan'][0].getChildByName("label")) {
            this.Toggles['jiesan'][0].getChildByName("label").color = cc.color(180, 180, 180);
        }
        this.Toggles['jiesan'][1].getChildByName("checkmark").active = false;
        if (this.Toggles['jiesan'][1].getChildByName("label")) {
            this.Toggles['jiesan'][1].getChildByName("label").color = cc.color(180, 180, 180);
        }
        this.Toggles['jiesan'][2].getChildByName("checkmark").active = false;
        if (this.Toggles['jiesan'][2].getChildByName("label")) {
            this.Toggles['jiesan'][2].getChildByName("label").color = cc.color(180, 180, 180);
        }
        this.Toggles['jiesan'][3].getChildByName("checkmark").active = false;
        if (this.Toggles['jiesan'][3].getChildByName("label")) {
            this.Toggles['jiesan'][3].getChildByName("label").color = cc.color(180, 180, 180);
        }
        this.Toggles['jiesan'][4].getChildByName("checkmark").active = true;
        if (this.Toggles['jiesan'][4].getChildByName("label")) {
            this.Toggles['jiesan'][4].getChildByName("label").color = cc.color(158, 49, 16);
        }
    }
});

module.exports = zdChildCreateRoom;

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
        //# sourceMappingURL=szdChildCreateRoom.js.map
        