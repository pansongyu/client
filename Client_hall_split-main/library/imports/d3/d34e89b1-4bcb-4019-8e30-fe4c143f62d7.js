"use strict";
cc._RF.push(module, 'd34e8mxS8tAGY4w/kwUP2LX', 'lymjChildCreateRoom');
// script/ui/uiGame/lymj/lymjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var isAutoZiMo = this.GetIdxByKey('wanfa');
        var beishu = this.GetIdxByKey('beishu');
        var jiesan = this.GetIdxByKey('jiesan');
        var xianShi = this.GetIdxByKey('xianShi');
        var fangjian = [];
        var kexuanwanfa = [];
        var gaoji = [];
        for (var i = 0; i < this.Toggles['fangjian'].length; i++) {
            if (this.Toggles['fangjian'][i].getChildByName('checkmark').active) {
                fangjian.push(i);
            }
        }
        for (var _i = 0; _i < this.Toggles['kexuanwanfa'].length; _i++) {
            if (this.Toggles['kexuanwanfa'][_i].getChildByName('checkmark').active) {
                kexuanwanfa.push(_i);
            }
        }
        for (var _i2 = 0; _i2 < this.Toggles['gaoji'].length; _i2++) {
            if (this.Toggles['gaoji'][_i2].getChildByName('checkmark').active) {
                gaoji.push(_i2);
            }
        }
        sendPack = {
            "xianShi": xianShi,
            "beishu": beishu,
            "jiesan": jiesan,
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,
            "fangjian": fangjian,
            "gaoji": gaoji,
            "kexuanwanfa": kexuanwanfa,
            "wanfa": isAutoZiMo
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
        } else if ('kexuanwanfa' == key) {
            var quanzimo = this.Toggles['wanfa'][1].getChildByName('checkmark').active;
            if (quanzimo && toggleIndex == 0) {
                app.SysNotifyManager().ShowSysMsg("全自摸不能选择有金必游", [], 3);
                return;
            }
        } else if ('beishu' == key) {
            var _quanzimo = this.Toggles['wanfa'][1].getChildByName('checkmark').active;
            if (_quanzimo) {
                if (0 == toggleIndex) return;
                app.SysNotifyManager().ShowSysMsg("全自摸只能选择四倍", [], 3);
                return;
            }
        } else if ('wanfa' == key) {
            if (1 == toggleIndex) {
                //全自摸倍数默认为最低倍
                this.ClearToggleCheck(this.Toggles['beishu'], [0]);
                this.UpdateLabelColor(this.Toggles['beishu'][0].parent);
                //全自摸不能游金必游
                this.ClearToggleCheck(this.Toggles['kexuanwanfa']);
                this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
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

module.exports = fzmjChildCreateRoom;

cc._RF.pop();