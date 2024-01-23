"use strict";
cc._RF.push(module, 'd94d5MCr35OsbVOy+beoaOg', 'zjmjChildCreateRoom');
// script/ui/uiGame/zjmj/zjmjChildCreateRoom.js

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
        var zjmj_moshi = this.GetIdxByKey('moShi');
        var zjmj_beishu = this.GetIdxByKey('beiShu');
        var zjmj_xianshi = this.GetIdxByKey('xianShi');
        var zjmj_fengding = this.GetIdxByKey('fengDing');
        var zjmj_huDa = this.GetIdxByKey('huDa');
        var zjmj_moban = this.GetIdxByKey('moban');
        var zjmj_jiesan = this.GetIdxByKey('jiesan');
        var zjmj_kexuanwanfa = [];
        for (var i = 0; i < this.Toggles['kexuanwanfa'].length; i++) {
            if (this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active) {
                zjmj_kexuanwanfa.push(i);
            }
        }
        var gaoji = [];
        for (var _i = 0; _i < this.Toggles['gaoji'].length; _i++) {
            if (this.Toggles['gaoji'][_i].getChildByName('checkmark').active) {
                gaoji.push(_i);
            }
        }
        sendPack = {
            "moShi": zjmj_moshi,
            "beiShu": zjmj_beishu,
            "jiesan": zjmj_jiesan,
            "xianShi": zjmj_xianshi,
            "fengDing": zjmj_fengding,
            "kexuanwanfa": zjmj_kexuanwanfa,
            "huDa": zjmj_huDa,
            "moban": zjmj_moban,
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "gaoji": gaoji,
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
            this.UpdateTogglesLabel(toggles);
            if ('renshu' == key) {
                if (0 == toggleIndex || 1 == toggleIndex) {
                    this.ClearToggleCheck(this.Toggles['fengDing'], [0]);
                    this.UpdateLabelColor(this.Toggles['fengDing'][0].parent);
                }
                if (toggleIndex != 2) {
                    //不是4人
                    this.ClearToggleCheck(this.Toggles['moShi'], [1]);
                    this.UpdateLabelColor(this.Toggles['moShi'][1].parent);
                }
            }
            return;
        } else if ('moShi' == key) {
            if (this.Toggles['renshu'][2].getChildByName('checkmark').active == false && toggleIndex == 2) {
                app.SysNotifyManager().ShowSysMsg("4人才能选择翻倍玩法");
                return;
            }
        } else if ('fengDing' == key) {
            var zjmj_renshu = this.Toggles['renshu'][2].getChildByName('checkmark').active;
            if (!zjmj_renshu && toggleIndex == 1) {
                app.SysNotifyManager().ShowSysMsg("4人才能进园子");
                return;
            }
        } else if ('kexuanwanfa' == key) {} else {}
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