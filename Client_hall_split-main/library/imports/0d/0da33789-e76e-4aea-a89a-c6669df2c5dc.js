"use strict";
cc._RF.push(module, '0da33eJ525K6qiaxmad8sXc', 'sqmjChildCreateRoom');
// script/ui/uiGame/sqmj/sqmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
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
        } else if ('guize' == key) {
            if (toggleIndex == 8) {
                var mark = this.Toggles['angang'][2].getChildByName('checkmark').active;
                if (mark) {
                    app.SysNotifyManager().ShowSysMsg("暗杠不锁玩法不能选择暗杠翻倍", [], 3);
                    return;
                }
            }
            //自摸胡和点炮大包不能同时选择
            // if(this.Toggles['kexuanwanfa'][2].getChildByName('checkmark').active && toggleIndex == 3){
            //     this.Toggles['kexuanwanfa'][2].getChildByName('checkmark').active = false;
            //     this.UpdateLabelColor(this.Toggles['kexuanwanfa'][2].parent);
            // }
            // else if(this.Toggles['kexuanwanfa'][3].getChildByName('checkmark').active && toggleIndex == 2){
            //     this.Toggles['kexuanwanfa'][3].getChildByName('checkmark').active = false;
            //     this.UpdateLabelColor(this.Toggles['kexuanwanfa'][3].parent);
            // }
        } else if ('angang' == key) {
            if (this.Toggles['guize'][8].getChildByName('checkmark').active) {
                this.Toggles['guize'][8].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['guize'][8].parent);
            }
        }
        if (toggles.getComponent(cc.Toggle)) {
            //复选框
            needShowIndexList = [];
            for (var i = 0; i < needClearList.length; i++) {
                var _mark = needClearList[i].getChildByName('checkmark').active;
                //如果复选框为勾选状态并且点击的复选框不是该复选框，则继续保持勾选状态
                if (_mark && i != toggleIndex) {
                    needShowIndexList.push(i);
                }
                //如果复选框为未勾选状态并且点击的复选框是该复选框，则切换为勾选状态
                else if (!_mark && i == toggleIndex) {
                        needShowIndexList.push(i);
                    }
            }
        }
        this.ClearToggleCheck(needClearList, needShowIndexList);
        this.UpdateLabelColor(toggles, 'fangfei' == key ? true : false);
    },
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');

        var wanfa = this.GetIdxByKey('wanfa');
        var angang = this.GetIdxByKey('angang');
        var guize = [];
        for (var i = 0; i < this.Toggles['guize'].length; i++) {
            if (this.Toggles['guize'][i].getChildByName('checkmark').active) {
                guize.push(i);
            }
        }

        var fangjian = [];
        for (var _i = 0; _i < this.Toggles['fangjian'].length; _i++) {
            if (this.Toggles['fangjian'][_i].getChildByName('checkmark').active) {
                fangjian.push(_i);
            }
        }
        var gaoji = [];
        for (var _i2 = 0; _i2 < this.Toggles['gaoji'].length; _i2++) {
            if (this.Toggles['gaoji'][_i2].getChildByName('checkmark').active) {
                gaoji.push(_i2);
            }
        }
        sendPack = {
            "wanfa": wanfa,
            "angang": angang,
            "guize": guize,
            "fangjian": fangjian,
            "gaoji": gaoji,
            "jiesan": jiesan,
            "xianShi": xianShi,
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard
        };
        return sendPack;
    }
});

module.exports = fzmjChildCreateRoom;

cc._RF.pop();