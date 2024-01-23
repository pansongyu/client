"use strict";
cc._RF.push(module, 'aec50rs2yRO+6NVySrS1ZBp', 'ddChildCreateRoom');
// script/ui/uiGame/dd/ddChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var ctwskChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var xianShi = this.GetIdxByKey("xianShi");
        var jiesan = this.GetIdxByKey("jiesan");

        var kexuanwanfa = [];
        for (var i = 0; i < this.Toggles['kexuanwanfa'].length; i++) {
            if (this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active) {
                kexuanwanfa.push(i);
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

        var dadu = this.GetIdxByKey("dadu");
        var wanfa = this.GetIdxByKey("wanfa");

        sendPack = {
            "xianShi": xianShi,
            "jiesan": jiesan,
            "fangjian": fangjian,
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,
            "gaoji": gaoji,
            "kexuanwanfa": kexuanwanfa,
            "dadu": dadu,
            "wanfa": wanfa
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
            if (toggleIndex == 0) {
                if (this.Toggles['renshu'][0].getChildByName('checkmark').active == false) {
                    this.Toggles['kexuanwanfa'][2].getChildByName('checkmark').active = false;
                    this.Toggles['kexuanwanfa'][3].getChildByName('checkmark').active = false;
                    this.UpdateLabelColor(this.Toggles["kexuanwanfa"][0].parent);
                }
            }
            if (toggleIndex == 1) {
                if (this.Toggles['renshu'][1].getChildByName('checkmark').active == false) {
                    this.Toggles['kexuanwanfa'][3].getChildByName('checkmark').active = false;
                    this.UpdateLabelColor(this.Toggles["kexuanwanfa"][0].parent);
                }
            }
        }
        if ('wanfa' == key) {
            if (toggleIndex == 1) {
                if (this.Toggles['wanfa'][1].getChildByName('checkmark').active == false) {
                    this.Toggles['kexuanwanfa'][7].getChildByName('checkmark').active = false;
                    this.UpdateLabelColor(this.Toggles["kexuanwanfa"][0].parent);
                }
            }
        }
        if ('jushu' == key || 'renshu' == key || 'fangfei' == key) {
            this.ClearToggleCheck(needClearList, needShowIndexList);
            this.UpdateLabelColor(toggles);
            this.UpdateTogglesLabel(toggles, false);

            return;
        } else if ('kexuanwanfa' == key) {
            if (toggleIndex == 2) {
                //霸奖不能2人场
                if (this.Toggles['renshu'][0].getChildByName('checkmark').active == true && this.Toggles['kexuanwanfa'][2].getChildByName('checkmark').active == false) {
                    app.SysNotifyManager().ShowSysMsg("霸奖2人场不能选择");
                    return;
                }
            }
            if (toggleIndex == 3) {
                //霸奖不能2人场
                if (this.Toggles['renshu'][2].getChildByName('checkmark').active == false && this.Toggles['kexuanwanfa'][3].getChildByName('checkmark').active == false) {
                    app.SysNotifyManager().ShowSysMsg("原炸2人场3人场不能选择");
                    return;
                }
            }

            if (toggleIndex == 7) {
                //霸奖不能2人场
                if (this.Toggles['wanfa'][0].getChildByName('checkmark').active == false && this.Toggles['kexuanwanfa'][7].getChildByName('checkmark').active == false) {
                    app.SysNotifyManager().ShowSysMsg("全开玩法双王才能算炸弹");
                    return;
                }
            }
        } else if ('fangjian' == key) {}
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

module.exports = ctwskChildCreateRoom;

cc._RF.pop();