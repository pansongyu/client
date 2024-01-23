"use strict";
cc._RF.push(module, '84a28oI3zJOyoMeHjjRxsiQ', 'yymjChildCreateRoom');
// script/ui/uiGame/yymj/yymjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var qymjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},

    // CreateSendPack -start-
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var zhuaniao = this.GetIdxByKey('zhuaniao');
        var fengDing = this.GetIdxByKey('fengDing');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');

        var yiziqiaoxi = -1;
        if (kexuanwanfa.indexOf(3) > -1) {
            yiziqiaoxi = this.GetIdxByKey('yiziqiaoxi');
        }

        var fangjian = this.GetIdxsByKey('fangjian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "zhuaniao": zhuaniao,
            "fengDing": fengDing,
            "kexuanwanfa": kexuanwanfa,
            "yiziqiaoxi": yiziqiaoxi,
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
            if (toggleIndex == 7) {
                var mark = needClearList[7].getChildByName('checkmark').active;
                if (!mark) {
                    if (this.Toggles['renshu'][0].getChildByName('checkmark').active == false) {
                        app.SysNotifyManager().ShowSysMsg("仅二人场可选必中鸟", [], 3);
                        return;
                    }
                }
            }
            if (toggleIndex == 6) {
                var _mark = needClearList[6].getChildByName('checkmark').active;
                if (!_mark) {
                    if (this.Toggles['zhuaniao'][2].getChildByName('checkmark').active == false) {
                        app.SysNotifyManager().ShowSysMsg("抓2鸟才能选海底胡鸟牌", [], 3);
                        return;
                    }
                }
            }
            if (toggleIndex == 5) {
                var _mark2 = needClearList[5].getChildByName('checkmark').active;
                if (!_mark2) {
                    if (needClearList[4].getChildByName('checkmark').active == false) {
                        app.SysNotifyManager().ShowSysMsg("一条龙才能勾选一条龙可接炮", [], 3);
                        return;
                    }
                }
            }
            if (toggleIndex == 4) {
                var _mark3 = needClearList[4].getChildByName('checkmark').active;
                if (_mark3) {
                    needClearList[5].getChildByName('checkmark').active = false;
                    this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
                }
            }
        }
        // else if ('xiapao' == key) {
        //     if (toggleIndex == 5 && !needClearList[toggleIndex].getChildByName('checkmark').active) {
        //         this.Toggles['zuigaopaoshu'][0].parent.active = true;
        //     } else {
        //         this.Toggles['zuigaopaoshu'][0].parent.active = false;
        //     }
        // }

        if (toggles.getComponent(cc.Toggle)) {
            //复选框
            needShowIndexList = [];
            for (var i = 0; i < needClearList.length; i++) {
                var _mark4 = needClearList[i].getChildByName('checkmark').active;
                //如果复选框为勾选状态并且点击的复选框不是该复选框，则继续保持勾选状态
                if (_mark4 && i != toggleIndex) {
                    needShowIndexList.push(i);
                }
                //如果复选框为未勾选状态并且点击的复选框是该复选框，则切换为勾选状态
                else if (!_mark4 && i == toggleIndex) {
                        needShowIndexList.push(i);
                    }
            }
        }
        this.ClearToggleCheck(needClearList, needShowIndexList);
        this.UpdateLabelColor(toggles, 'fangfei' == key ? true : false);
        this.UpdateOnClickToggle();
    },

    OnUpdateTogglesLabel: function OnUpdateTogglesLabel(TogglesNode) {
        var isResetPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        if (this.Toggles['yiziqiaoxi']) {
            this.Toggles['yiziqiaoxi'][0].parent.active = this.Toggles['kexuanwanfa'][3].getChildByName('checkmark').active;
        }
    }

});

module.exports = qymjChildCreateRoom;

cc._RF.pop();