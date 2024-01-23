"use strict";
cc._RF.push(module, '395d4pebANHsqYuXwU356RK', 'zjhzmjChildCreateRoom');
// script/ui/uiGame/zjhzmj/zjhzmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var thgjmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var caishen = this.GetIdxByKey('caishen');
        var chengbao = this.GetIdxByKey('chengbao');
        var laoshu = this.GetIdxByKey('laoshu');
        var duocaijiafan = this.GetIdxByKey('duocaijiafan');

        var fengding = this.GetIdxByKey('fengding');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var fangjian = this.GetIdxsByKey('fangjian');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "caishen": caishen,
            "chengbao": chengbao,
            "laoshu": laoshu,
            "duocaijiafan": duocaijiafan,

            "fengding": fengding,
            "xianShi": xianShi,
            "jiesan": jiesan,
            "kexuanwanfa": kexuanwanfa,
            "fangjian": fangjian,
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
        } else if ('laoshu' == key) {
            if (toggleIndex == 2) {
                if (this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active) {
                    this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active = false;
                    this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
                }
            } else {
                if (this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active) {
                    this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active = false;
                    this.UpdateLabelColor(this.Toggles['kexuanwanfa'][1].parent);
                }
            }
        } else if ('kexuanwanfa' == key) {
            if (toggleIndex == 0 && !needClearList[0].getChildByName('checkmark').active) {
                if (this.Toggles['laoshu'][2].getChildByName('checkmark').active) {
                    app.SysNotifyManager().ShowSysMsg("掷牢数：勾选“一牢”或“二牢”后，才可勾选");
                    return;
                }
            }
            if (toggleIndex == 1 && !needClearList[1].getChildByName('checkmark').active) {
                if (!this.Toggles['laoshu'][2].getChildByName('checkmark').active) {
                    app.SysNotifyManager().ShowSysMsg("自摸胡：勾选“三牢”后，才可勾选");
                    return;
                }
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

    // 多选
    GetIdxsByKey: function GetIdxsByKey(key) {
        var arr = [];
        for (var i = 0; i < this.Toggles[key].length; i++) {
            if (this.Toggles[key][i].getChildByName('checkmark').active) {
                arr.push(i);
            }
        }
        return arr;
    },
    AdjustSendPack: function AdjustSendPack(sendPack) {
        //     不可吃，仅二人、三人场可选；
        return sendPack;
    }
});

module.exports = thgjmjChildCreateRoom;

cc._RF.pop();