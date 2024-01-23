"use strict";
cc._RF.push(module, 'cece5zcMTNJfZwV99BG8qQY', 'gdczmjChildCreateRoom');
// script/ui/uiGame/gdczmj/gdczmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var jsnyzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var fengDing = this.GetIdxByKey('fengDing');
        var hupai = this.GetIdxByKey('hupai');
        var beishu = this.GetIdxByKey('beishu');
        var guipai = this.GetIdxByKey('guipai');
        var maima = this.GetIdxByKey('maima');
        var jiangma = this.GetIdxByKey('jiangma');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var fangjian = this.GetIdxsByKey('fangjian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "fengDing": fengDing,
            "hupai": hupai,
            "beishu": beishu,
            "guipai": guipai,
            "maima": maima,
            "jiangma": jiangma,
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
            this.UpdateOnClickToggle();
            return;
        } else if ("fangjian" == key) {
            // 小局托管解散,解散次数不超过5次,
            // 托管2小局解散,解散次数不超过3次",
            if (this.Toggles['fangjian'][3].getChildByName('checkmark').active && toggleIndex == 5) {
                this.Toggles['fangjian'][3].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][3].parent);
            } else if (this.Toggles['fangjian'][5].getChildByName('checkmark').active && toggleIndex == 3) {
                this.Toggles['fangjian'][5].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][5].parent);
            }

            if (this.Toggles['fangjian'][2].getChildByName('checkmark').active && toggleIndex == 4) {
                this.Toggles['fangjian'][2].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][2].parent);
            } else if (this.Toggles['fangjian'][4].getChildByName('checkmark').active && toggleIndex == 2) {
                this.Toggles['fangjian'][4].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][4].parent);
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
    UpdateOnClickToggle: function UpdateOnClickToggle() {
        if (this.Toggles["kexuanwanfa"]) {
            //仅2人场不可选“跟庄1分”；
            this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
            if (this.Toggles["renshu"][0].getChildByName("checkmark").active) {
                this.Toggles['kexuanwanfa'][2].getChildByName("checkmark").active = false;
                //置灰
                if (this.Toggles['kexuanwanfa'][2].getChildByName("label")) {
                    this.Toggles['kexuanwanfa'][2].getChildByName("label").color = cc.color(180, 180, 180);
                }
            } else {
                //恢复
                if (this.Toggles['kexuanwanfa'][2].getChildByName("label")) {
                    this.Toggles['kexuanwanfa'][2].getChildByName("label").color = cc.color(158, 49, 16);
                }
            }

            //勾选“白板做鬼,红中做鬼,翻鬼”其中一个才可勾选“无鬼加倍”和“四鬼胡牌”；
            if (this.Toggles["guipai"][0].getChildByName("checkmark").active) {
                this.Toggles['kexuanwanfa'][8].getChildByName("checkmark").active = false;
                this.Toggles['kexuanwanfa'][9].getChildByName("checkmark").active = false;
                //置灰
                if (this.Toggles['kexuanwanfa'][8].getChildByName("label")) {
                    this.Toggles['kexuanwanfa'][8].getChildByName("label").color = cc.color(180, 180, 180);
                }
                //置灰
                if (this.Toggles['kexuanwanfa'][9].getChildByName("label")) {
                    this.Toggles['kexuanwanfa'][9].getChildByName("label").color = cc.color(180, 180, 180);
                }
            } else {
                //恢复
                if (this.Toggles['kexuanwanfa'][8].getChildByName("label")) {
                    this.Toggles['kexuanwanfa'][8].getChildByName("label").color = cc.color(158, 49, 16);
                }
                //恢复
                if (this.Toggles['kexuanwanfa'][9].getChildByName("label")) {
                    this.Toggles['kexuanwanfa'][9].getChildByName("label").color = cc.color(158, 49, 16);
                }
            }
        }

        if (this.Toggles["beishu"]) {
            if (this.Toggles["hupai"][1].getChildByName("checkmark").active) {
                this.Toggles['beishu'][0].parent.active = false;
                //勾选“小胡（鸡胡1倍其他2倍）”，不可勾选“大胡相乘”；
                if (this.Toggles["kexuanwanfa"]) {
                    this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
                    this.Toggles['kexuanwanfa'][7].getChildByName("checkmark").active = false;
                    //置灰
                    if (this.Toggles['kexuanwanfa'][7].getChildByName("label")) {
                        this.Toggles['kexuanwanfa'][7].getChildByName("label").color = cc.color(180, 180, 180);
                    }
                }
            } else {
                this.Toggles['beishu'][0].parent.active = true;
                //勾选“小胡（鸡胡1倍其他2倍）”，不可勾选“大胡相乘”；
                if (this.Toggles["kexuanwanfa"]) {
                    if (this.Toggles["beishu"][0].getChildByName("checkmark").active) {
                        this.Toggles['kexuanwanfa'][7].getChildByName("checkmark").active = false;
                        //置灰
                        if (this.Toggles['kexuanwanfa'][7].getChildByName("label")) {
                            this.Toggles['kexuanwanfa'][7].getChildByName("label").color = cc.color(180, 180, 180);
                        }
                    } else {
                        //恢复
                        if (this.Toggles['kexuanwanfa'][7].getChildByName("label")) {
                            this.Toggles['kexuanwanfa'][7].getChildByName("label").color = cc.color(158, 49, 16);
                        }
                    }
                }
            }
        }
    }
});

module.exports = jsnyzmjChildCreateRoom;

cc._RF.pop();