"use strict";
cc._RF.push(module, '3134bYWcHhLNaJx76EQTuip', 'srmjChildCreateRoom');
// script/ui/uiGame/srmj/srmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var sdlymjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');

        var gaoji = this.GetIdxsByKey("gaoji");
        var fangjian = this.GetIdxsByKey("fangjian");
        var kexuanwanfa = this.GetIdxsByKey("kexuanwanfa");

        sendPack = {
            "xianShi": xianShi,
            "jiesan": jiesan,
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,
            "gaoji": gaoji,
            "fangjian": fangjian,
            "kexuanwanfa": kexuanwanfa
        };
        return sendPack;
    },
    GetIdxsByKey: function GetIdxsByKey(key) {
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
            if (toggleIndex == 0) {
                var _toggle = this.Toggles['kexuanwanfa'][1];

                _toggle.getChildByName('checkmark').active = false;
                this.UpdateLabelColor(_toggle.parent);
                this.UpdateTogglesLabel(_toggle.parent);
            } else if (toggleIndex == 1) {
                var _toggle2 = this.Toggles['kexuanwanfa'][0];

                _toggle2.getChildByName('checkmark').active = false;
                this.UpdateLabelColor(_toggle2.parent);
                this.UpdateTogglesLabel(_toggle2.parent);
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

module.exports = sdlymjChildCreateRoom;

cc._RF.pop();