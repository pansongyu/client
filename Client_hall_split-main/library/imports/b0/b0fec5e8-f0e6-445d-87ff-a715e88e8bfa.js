"use strict";
cc._RF.push(module, 'b0fecXo8OZEXYf/pxXojov6', 'bxmdChildCreateRoom');
// script/ui/uiGame/bxmd/bxmdChildCreateRoom.js

"use strict";

/*
 创建房间子界面
 */
var app = require("app");

var bxmdChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),
    properties: {},
    // CreateSendPack -start-
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var paishu = this.GetIdxByKey('paishu');
        var difen = this.GetIdxByKey('difen');
        var guodi = this.GetIdxByKey('guodi');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var fangjian = this.GetIdxsByKey('fangjian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "paishu": paishu,
            "difen": difen,
            "guodi": guodi,
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
    // CreateSendPack -end-
    AdjustSendPack: function AdjustSendPack(sendPack) {
        // n 不可吃：仅限2人场可选，勾选后，不能吃牌；
        if (sendPack.playerNum == 2) {
            this.RemoveMultiSelect(sendPack, "kexuanwanfa", 0);
        }
        return sendPack;
    },
    UpdateOnClickToggle: function UpdateOnClickToggle() {
        if (this.Toggles["kexuanwanfa"]) {
            if (this.Toggles["paishu"][0].getChildByName("checkmark").active) {
                // 2副牌
                this.Toggles["kexuanwanfa"][0].parent.active = false;
            } else {
                this.Toggles["kexuanwanfa"][0].parent.active = true;
            }
        }
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
        if ('fangjian' == key) {
            if (toggleIndex == 2) {
                if (this.Toggles["fangjian"][4].getChildByName("checkmark").active) {
                    app.SysNotifyManager().ShowSysMsg("玩法重复");
                    this.Toggles['fangjian'][2].getChildByName('checkmark').active = false;
                    this.UpdateLabelColor(this.Toggles['fangjian'][1].parent);
                }
            }
            if (toggleIndex == 3) {
                if (this.Toggles["fangjian"][5].getChildByName("checkmark").active) {
                    app.SysNotifyManager().ShowSysMsg("玩法重复");
                    this.Toggles['fangjian'][3].getChildByName('checkmark').active = false;
                    this.UpdateLabelColor(this.Toggles['fangjian'][1].parent);
                }
            }
            if (toggleIndex == 4) {
                if (this.Toggles["fangjian"][2].getChildByName("checkmark").active) {
                    app.SysNotifyManager().ShowSysMsg("玩法重复");
                    this.Toggles['fangjian'][4].getChildByName('checkmark').active = false;
                    this.UpdateLabelColor(this.Toggles['fangjian'][1].parent);
                }
            }
            if (toggleIndex == 5) {
                if (this.Toggles["fangjian"][3].getChildByName("checkmark").active) {
                    app.SysNotifyManager().ShowSysMsg("玩法重复");
                    this.Toggles['fangjian'][5].getChildByName('checkmark').active = false;
                    this.UpdateLabelColor(this.Toggles['fangjian'][1].parent);
                }
            }
        }
        this.UpdateLabelColor(toggles, 'fangfei' == key ? true : false);
        this.UpdateOnClickToggle();
    }
});

module.exports = bxmdChildCreateRoom;

cc._RF.pop();