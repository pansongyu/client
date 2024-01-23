/*
创建房间子界面
 */
var app = require("app");

var npmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
    //需要自己重写
    CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
        let sendPack = {};
        let xianShi = this.GetIdxByKey('xianShi');
        let jiesan = this.GetIdxByKey('jiesan');
        let qianggangwanf = this.GetIdxByKey('qianggangwanf');
        let dianpaowanfa = this.GetIdxByKey('dianpaowanfa');

        let gaoji = this.GetIdxsByKey("gaoji");
        let fangjian = this.GetIdxsByKey("fangjian");
        let kexuanwanfa = this.GetIdxsByKey("kexuanwanfa");

        sendPack = {
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,

            "dianpaowanfa": dianpaowanfa,
            "qianggangwanf": qianggangwanf,
            "kexuanwanfa": kexuanwanfa,
            "fangjian": fangjian,
            "xianShi": xianShi,
            "jiesan": jiesan,
            "gaoji": gaoji,
        };
        return sendPack;
    },
    GetIdxsByKey: function (key) {
        let arr = [];
        for (let i = 0; i < this.Toggles[key].length; i++) {
            if (this.Toggles[key][i].getChildByName('checkmark').active) {
                arr.push(i);
            }
        }
        return arr;
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
        if ('jushu' == key || 'renshu' == key || 'fangfei' == key) {
            this.ClearToggleCheck(needClearList, needShowIndexList);
            this.UpdateLabelColor(toggles);
            this.UpdateTogglesLabel(toggles, false);

            let renshu4 = this.Toggles['renshu'][2].getChildByName('checkmark').active;  // 4人局
            if ('renshu' == key && !renshu4) {
                let fenBingIdx = 3;
                let toggle = this.Toggles['kexuanwanfa'][fenBingIdx];
                toggle.getChildByName('checkmark').active = false;
                this.UpdateLabelColor(toggle.parent);
                this.UpdateTogglesLabel(toggle.parent);
            }
            return;
        } else if ('kexuanwanfa' == key) {
            // if(this.Toggles['zhuaniao'][0].getChildByName('checkmark').active==true && toggleIndex==4){
            //     //红中赖子
            //     app.SysNotifyManager().ShowSysMsg("按庄家中鸟不能勾选红中癞子玩法");
            //     return;
            // }
            let renshu4 = this.Toggles['renshu'][2].getChildByName('checkmark').active;  // 4人局
            if (!renshu4 && 3 == toggleIndex) {
                app.SysNotifyManager().ShowSysMsg("只有当人数为4人时才可选择该设定哦!");
                return;
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
    },
});

module.exports = npmjChildCreateRoom;