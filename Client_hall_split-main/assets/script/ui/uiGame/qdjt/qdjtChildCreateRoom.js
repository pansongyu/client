/*
 创建房间子界面
 */
var app = require("app");

var ctwskChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
        let sendPack = {};
        let kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        let fangjian = this.GetIdxsByKey('fangjian');
        let xianShi = this.GetIdxByKey('xianShi');
        let jiesan = this.GetIdxByKey('jiesan');
        let gaoji = this.GetIdxsByKey('gaoji');



        let chongguan = this.GetIdxByKey('chongguan');
        let moshi = this.GetIdxByKey('moshi');

        sendPack = {
            "chongguan":chongguan,
            "moshi":moshi,
            "kexuanwanfa": kexuanwanfa,
            "fangjian": fangjian,
            "xianShi": xianShi,
            "jiesan": jiesan,
            "gaoji": gaoji,

            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,

        }
        return sendPack;
    },
    OnToggleClick: function (event) {
        this.FormManager.CloseForm("UIMessageTip");
        let toggles = event.target.parent;
        let toggle = event.target;
        let key = toggles.name.substring(('Toggles_').length, toggles.name.length);
        let toggleIndex = parseInt(toggle.name.substring(('Toggle').length, toggle.name.length)) - 1;
        let needClearList = [];
        let needShowIndexList = [];
        needClearList = this.Toggles[key];
        needShowIndexList.push(toggleIndex);
        if ('renshu' == key) {
            /*if (toggleIndex == 0 || toggleIndex == 1) {
                this.Toggles['kexuanwanfa'][6].getChildByName('checkmark').active = true;
                this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['kexuanwanfa'][1].parent);
            }
            if (toggleIndex == 0) {
                this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['kexuanwanfa'][1].parent);
            }*/
        }
        if ('jushu' == key || 'renshu' == key || 'fangfei' == key) {
            this.ClearToggleCheck(needClearList, needShowIndexList);
            this.UpdateLabelColor(toggles);
            this.UpdateTogglesLabel(toggles, false);
            this.UpdateOnClickToggle();
            return;
        } else if ('kexuanwanfa' == key) {
            if (this.Toggles['moshi'][2].getChildByName('checkmark').active==false) {
                 if (toggleIndex == 0 && this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active==false) {
                     app.SysNotifyManager().ShowSysMsg.ShowSysMsg("比奖模式才能全托",[],3);
                     return;
                 }
             }

        }else if ('moshi'==key) {
            if (this.Toggles['renshu'][0].getChildByName('checkmark').active) {
                if (toggleIndex == 0 && this.Toggles['moshi'][0].getChildByName('checkmark').active==false) {
                    app.SysNotifyManager().ShowSysMsg("2人场不能选择可包牌",[],3);
                    return;
                }
            }
            if (this.Toggles['moshi'][1].getChildByName('checkmark').active==false) {
                if (toggleIndex == 1 && this.Toggles['renshu'][2].getChildByName('checkmark').active==false) {
                    app.SysNotifyManager().ShowSysMsg("4人场才能选择硬打",[],3);
                    return;
                }
            }
            if (this.Toggles['moshi'][1].getChildByName('checkmark').active==false) {
                if (toggleIndex == 3 && this.Toggles['renshu'][2].getChildByName('checkmark').active==false) {
                    app.SysNotifyManager().ShowSysMsg("4人场才能选择硬打可选包牌",[],3);
                    return;
                }
            }
        }
        if (toggles.getComponent(cc.Toggle)) {//复选框
            needShowIndexList = [];
            for (let i = 0; i < needClearList.length; i++) {
                let mark = needClearList[i].getChildByName('checkmark').active;
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
    AdjustSendPack: function (sendPack) {
        /*if (sendPack.playerNum == 2) {
            this.RemoveMultiSelect(sendPack, "kexuanwanfa", 1);
        }
        if (sendPack.playerNum == 2 || sendPack.playerNum == 3) {
            if (sendPack.kexuanwanfa.indexOf(6) < 0) {
                sendPack.kexuanwanfa.push(6);
            }
        }*/
        return sendPack;
    },
    UpdateOnClickToggle: function () {
        if (this.Toggles['moshi'][1].getChildByName('checkmark').active==true && this.Toggles['renshu'][2].getChildByName('checkmark').active==false) {
            this.Toggles['moshi'][0].getChildByName('checkmark').active=false;
            this.Toggles['moshi'][1].getChildByName('checkmark').active=false;
            this.Toggles['moshi'][2].getChildByName('checkmark').active=true;
            this.Toggles['moshi'][3].getChildByName('checkmark').active=false;
            this.UpdateLabelColor(this.Toggles['moshi'][2].parent);
        }
        if (this.Toggles['moshi'][3].getChildByName('checkmark').active==true && this.Toggles['renshu'][2].getChildByName('checkmark').active==false) {
            this.Toggles['moshi'][0].getChildByName('checkmark').active=false;
            this.Toggles['moshi'][1].getChildByName('checkmark').active=false;
            this.Toggles['moshi'][2].getChildByName('checkmark').active=true;
            this.Toggles['moshi'][3].getChildByName('checkmark').active=false;
            this.UpdateLabelColor(this.Toggles['moshi'][2].parent);
        }
        if (this.Toggles['renshu'][0].getChildByName('checkmark').active==true) {
            this.Toggles['moshi'][0].getChildByName('checkmark').active=false;
            this.Toggles['moshi'][1].getChildByName('checkmark').active=false;
            this.Toggles['moshi'][2].getChildByName('checkmark').active=true;
            this.Toggles['moshi'][3].getChildByName('checkmark').active=false;
            this.UpdateLabelColor(this.Toggles['moshi'][2].parent);
        }
    },
});

module.exports = ctwskChildCreateRoom;