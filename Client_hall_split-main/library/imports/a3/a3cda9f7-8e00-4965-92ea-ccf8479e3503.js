"use strict";
cc._RF.push(module, 'a3cdan3jgBJZZLqzPhHnjUD', 'gastChildCreateRoom');
// script/ui/uiGame/gast/gastChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var gawskChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var difen = this.GetIdxByKey('difen');
        var baopai = this.GetIdxByKey('baopai');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var fangjian = this.GetIdxsByKey('fangjian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "difen": difen,
            "baopai": baopai,
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
            if (key == "renshu") {
                if (toggleIndex == 0) {
                    this.Toggles['kexuanwanfa'][2].getChildByName("checkmark").active = false;
                    this.Toggles['kexuanwanfa'][3].getChildByName("checkmark").active = false;
                } else if (toggleIndex == 1) {
                    this.Toggles['kexuanwanfa'][3].getChildByName("checkmark").active = false;
                }
                this.UpdateLabelColor(this.Toggles['kexuanwanfa'][2].parent);
                this.UpdateLabelColor(this.Toggles['kexuanwanfa'][3].parent);
            }
            this.UpdateLabelColor(toggles);
            this.UpdateTogglesLabel(toggles, false);
            return;
        } else if ('kexuanwanfa' == key) {
            if (toggleIndex == 0) {
                if (this.Toggles["kexuanwanfa"][1].getChildByName("checkmark").active == true && this.Toggles["kexuanwanfa"][0].getChildByName("checkmark").active == false) {
                    app.SysNotifyManager().ShowSysMsg("勾选了癞子可作王，不能选不加癞子");
                    return;
                }
            }
            if (toggleIndex == 1) {
                if (this.Toggles["kexuanwanfa"][0].getChildByName("checkmark").active == true && this.Toggles["kexuanwanfa"][1].getChildByName("checkmark").active == false) {
                    app.SysNotifyManager().ShowSysMsg("勾选了不加癞子，不能选癞子可作王");
                    return;
                }
            }
            if (toggleIndex == 4) {
                if ((this.Toggles["kexuanwanfa"][5].getChildByName("checkmark").active == true || this.Toggles["kexuanwanfa"][6].getChildByName("checkmark").active == true) && this.Toggles["kexuanwanfa"][4].getChildByName("checkmark").active == false) {
                    app.SysNotifyManager().ShowSysMsg("勾选了解散算奖或者霸王奖翻倍，不能选炸弹不算奖");
                    return;
                }
            }
            if (toggleIndex == 5) {
                if (this.Toggles["kexuanwanfa"][4].getChildByName("checkmark").active == true && this.Toggles["kexuanwanfa"][5].getChildByName("checkmark").active == false) {
                    app.SysNotifyManager().ShowSysMsg("勾选了炸弹不算奖，不能选解散算奖");
                    return;
                }
            }
            if (toggleIndex == 6) {
                if (this.Toggles["kexuanwanfa"][4].getChildByName("checkmark").active == true && this.Toggles["kexuanwanfa"][6].getChildByName("checkmark").active == false) {
                    app.SysNotifyManager().ShowSysMsg("勾选了炸弹不算奖，不能选霸王奖翻倍");
                    return;
                }
            }
            if (toggleIndex == 2 && this.Toggles['renshu'][0].getChildByName('checkmark').active) {
                app.SysNotifyManager().ShowSysMsg("二人场不可选可包牌", [], 3);
                return;
            }
            if (toggleIndex == 3 && !this.Toggles['renshu'][2].getChildByName('checkmark').active) {
                app.SysNotifyManager().ShowSysMsg("仅四人场可选可叫牌", [], 3);
                return;
            }
        } else if ('fangjian' == key) {
            if (this.Toggles['fangjian'][1].getChildByName('checkmark').active && toggleIndex == 6) {
                this.Toggles['fangjian'][1].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][1].parent);
            } else if (this.Toggles['fangjian'][6].getChildByName('checkmark').active && toggleIndex == 1) {
                this.Toggles['fangjian'][6].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][6].parent);
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

module.exports = gawskChildCreateRoom;

cc._RF.pop();