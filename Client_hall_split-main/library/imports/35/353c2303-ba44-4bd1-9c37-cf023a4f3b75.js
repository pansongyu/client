"use strict";
cc._RF.push(module, '353c2MDukRL0Zw3zwI6Tzt1', 'gzmjChildCreateRoom');
// script/ui/uiGame/gzmj/gzmjChildCreateRoom.js

"use strict";

/*
 创建房间子界面
 */
var app = require("app");

var gzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var wanfa = this.GetIdxByKey('wanfa');
        var jiaozui = this.GetIdxByKey('jiaozui');
        var pinghu = this.GetIdxByKey('pinghu');
        var chujingjiangli = this.GetIdxByKey('chujingjiangli');
        var hupaidifen = this.GetIdxByKey('hupaidifen');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var fangjian = this.GetIdxsByKey('fangjian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');
        sendPack = {
            "wanfa": wanfa,
            "jiaozui": jiaozui,
            "pinghu": pinghu,
            "chujingjiangli": chujingjiangli,
            "hupaidifen": hupaidifen,
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
            this.UpdateLabelColor(toggles);
            this.UpdateTogglesLabel(toggles, false);
            return;
        } else if ("fangjian" == key) {
            if (toggleIndex == 2) {
                this.Toggles["fangjian"][4].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles["fangjian"][0].parent);
            } else if (toggleIndex == 4) {
                this.Toggles["fangjian"][2].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles["fangjian"][0].parent);
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
    }
});

module.exports = gzmjChildCreateRoom;

cc._RF.pop();