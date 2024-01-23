"use strict";
cc._RF.push(module, 'b4cb53U/qZPS5Ht2pzEE8bs', 'hnmjChildCreateRoom');
// script/ui/uiGame/hnmj/hnmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    OnShow: function OnShow() {
        this.zpmjToggleIndex = -1;
    },
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var fengDing = this.GetIdxByKey('fengDing');
        var wanfa = this.GetIdxByKey('wanfa');
        var laizi = this.GetIdxByKey('laizi');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var fangjian = this.GetIdxsByKey('fangjian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "fengDing": fengDing,
            "wanfa": wanfa,
            "laizi": laizi,
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
        if ('renshu' == key) {
            // if(toggleIndex != 2){
            //     this.Toggles["jiesuan"][0].getChildByName("checkmark").active = false;
            //     this.Toggles["jiesuan"][1].getChildByName("checkmark").active = true;
            //     this.UpdateLabelColor(this.Toggles["jiesuan"][0].parent);
            // }
        }
        if ('jushu' == key || 'renshu' == key || 'fangfei' == key) {
            this.ClearToggleCheck(needClearList, needShowIndexList);
            this.UpdateLabelColor(toggles);
            this.UpdateTogglesLabel(toggles, false);
            return;
        } else if ('kexuanwanfa' == key) {
            if (toggleIndex == 10) {
                var mark = needClearList[7].getChildByName('checkmark').active;
                var mark2 = this.Toggles['wanfa'][1].getChildByName('checkmark').active;
                if (mark || mark2) {
                    app.SysNotifyManager().ShowSysMsg("勾选无番或无字牌，不能勾选叫令");
                    return;
                }
            }
            if (toggleIndex == 6) {
                var _mark = needClearList[2].getChildByName('checkmark').active;
                if (!_mark) {
                    app.SysNotifyManager().ShowSysMsg("勾选上嘎才能勾选自由上嘎");
                    return;
                }
            }

            if (!this.Toggles['kexuanwanfa'][7].getChildByName('checkmark').active && toggleIndex == 7) {
                this.Toggles['kexuanwanfa'][10].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['kexuanwanfa'][10].parent);
            }
            if (this.Toggles['kexuanwanfa'][2].getChildByName('checkmark').active && toggleIndex == 2) {
                this.Toggles['kexuanwanfa'][6].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['kexuanwanfa'][6].parent);
            }
        } else if ('wanfa' == key) {
            if (toggleIndex == 1) {
                this.Toggles['kexuanwanfa'][10].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['kexuanwanfa'][10].parent);
            }
        }
        // else if ('jiesuan' == key) {
        //     if(toggleIndex == 0){
        //         this.Toggles["renshu"][0].getChildByName("checkmark").active = false;
        //         this.Toggles["renshu"][1].getChildByName("checkmark").active = false;
        //         this.Toggles["renshu"][2].getChildByName("checkmark").active = true;
        //         this.UpdateLabelColor(this.Toggles["renshu"][0].parent);
        //         this.UpdateTogglesLabel(this.Toggles["renshu"][0].parent, false);
        //     }
        // }
        if (toggles.getComponent(cc.Toggle)) {
            //复选框
            needShowIndexList = [];
            for (var i = 0; i < needClearList.length; i++) {
                var _mark2 = needClearList[i].getChildByName('checkmark').active;
                //如果复选框为勾选状态并且点击的复选框不是该复选框，则继续保持勾选状态
                if (_mark2 && i != toggleIndex) {
                    needShowIndexList.push(i);
                }
                //如果复选框为未勾选状态并且点击的复选框是该复选框，则切换为勾选状态
                else if (!_mark2 && i == toggleIndex) {
                        needShowIndexList.push(i);
                    }
            }
        }
        this.ClearToggleCheck(needClearList, needShowIndexList);
        this.UpdateLabelColor(toggles, 'fangfei' == key ? true : false);
    }
});

module.exports = fzmjChildCreateRoom;

cc._RF.pop();