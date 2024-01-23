(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/fcsj/fcsjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a8a12SkhyJPNJQyMJ4whr27', 'fcsjChildCreateRoom', __filename);
// script/ui/uiGame/fcsj/fcsjChildCreateRoom.js

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
        var difen = this.GetIdxByKey('difen');
        var shoupaishuliang = this.GetIdxByKey('shoupaishuliang');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var fangjian = this.GetIdxsByKey('fangjian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "difen": difen,
            "shoupaishuliang": shoupaishuliang,
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
        if ('renshu' == key) {
            if (toggleIndex == 0 || toggleIndex == 1) {
                this.Toggles['kexuanwanfa'][6].getChildByName('checkmark').active = true;
                this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['kexuanwanfa'][1].parent);
            }
            if (toggleIndex == 0) {
                this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['kexuanwanfa'][1].parent);
            }
        }
        if ('jushu' == key || 'renshu' == key || 'fangfei' == key) {
            this.ClearToggleCheck(needClearList, needShowIndexList);
            this.UpdateLabelColor(toggles);
            this.UpdateTogglesLabel(toggles, false);
            return;
        } else if ('kexuanwanfa' == key) {
            var bujiaobian = this.Toggles["kexuanwanfa"][6].getChildByName('checkmark').active;
            if (bujiaobian == true) {
                if (toggleIndex == 1 && this.Toggles['renshu'][0].getChildByName('checkmark').active) {
                    app["SysNotifyManager"]().ShowSysMsg('二人不能玩可包牌');
                    return;
                }
                /*if (toggleIndex == 1) {
                 app["SysNotifyManager"]().ShowSysMsg("不叫边玩法不能勾选可包牌");
                 return;
                 }*/
                if (toggleIndex == 3) {
                    app["SysNotifyManager"]().ShowSysMsg("不叫边玩法不能勾选不可暗包");
                    return;
                }
                if (toggleIndex == 4) {
                    app["SysNotifyManager"]().ShowSysMsg("不叫边玩法不能勾选自动边叫");
                    return;
                }
                if (toggleIndex == 6 && (this.Toggles['renshu'][0].getChildByName('checkmark').active || this.Toggles['renshu'][1].getChildByName('checkmark').active)) {
                    app["SysNotifyManager"]().ShowSysMsg('二三人只能玩不叫边');
                    return;
                }
            }
            /*if (this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active) {
             if (toggleIndex == 6) {
             app["SysNotifyManager"]().ShowSysMsg("可包牌玩法不能勾选不叫边");
             return;
             }
             }*/
            if (this.Toggles['kexuanwanfa'][3].getChildByName('checkmark').active) {
                if (toggleIndex == 6) {
                    app["SysNotifyManager"]().ShowSysMsg("不可暗包玩法不能勾选不叫边");
                    return;
                }
            }
            if (this.Toggles['kexuanwanfa'][4].getChildByName('checkmark').active) {
                if (toggleIndex == 6) {
                    app["SysNotifyManager"]().ShowSysMsg("自动边叫玩法不能勾选不叫边");
                    return;
                }
            }

            if (this.Toggles['kexuanwanfa'][8].getChildByName('checkmark').active == false) {
                if (toggleIndex == 9) {
                    app["SysNotifyManager"]().ShowSysMsg("勾选只比奖玩法才可选全托");
                    return;
                }
            }
            if (toggleIndex == 8 && this.Toggles['kexuanwanfa'][8].getChildByName('checkmark').active) {
                this.Toggles['kexuanwanfa'][9].getChildByName('checkmark').active = false;
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
    },
    AdjustSendPack: function AdjustSendPack(sendPack) {
        if (sendPack.playerNum == 2) {
            this.RemoveMultiSelect(sendPack, "kexuanwanfa", 1);
        }
        if (sendPack.playerNum == 2 || sendPack.playerNum == 3) {
            if (sendPack.kexuanwanfa.indexOf(6) < 0) {
                sendPack.kexuanwanfa.push(6);
            }
        }
        return sendPack;
    },
    UpdateOnClickToggle: function UpdateOnClickToggle() {
        if (this.Toggles["kexuanwanfa"]) {
            if (this.Toggles["renshu"][0].getChildByName("checkmark").active || this.Toggles["renshu"][1].getChildByName("checkmark").active) {
                this.Toggles["kexuanwanfa"][3].active = false;
                this.Toggles["kexuanwanfa"][4].active = false;
            } else {
                this.Toggles["kexuanwanfa"][3].active = true;
                this.Toggles["kexuanwanfa"][4].active = true;
            }
            if (this.Toggles["renshu"][1].getChildByName("checkmark").active || this.Toggles["renshu"][2].getChildByName("checkmark").active) {
                this.Toggles["kexuanwanfa"][1].active = true;
                this.Toggles["kexuanwanfa"][1].getChildByName("checkmark").active = true;
            } else {
                this.Toggles["kexuanwanfa"][1].getChildByName("checkmark").active = false;
            }
            this.Toggles["kexuanwanfa"][0].getChildByName("checkmark").active = true;
            this.Toggles["kexuanwanfa"][5].getChildByName("checkmark").active = true;
        }
    }
});

module.exports = ctwskChildCreateRoom;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=fcsjChildCreateRoom.js.map
        