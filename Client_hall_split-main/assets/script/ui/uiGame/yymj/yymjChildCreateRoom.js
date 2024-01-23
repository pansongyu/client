/*
创建房间子界面
 */
var app = require("app");

var qymjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },

    // CreateSendPack -start-
    CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
        let sendPack = {};
        let zhuaniao=this.GetIdxByKey('zhuaniao');
        let fengDing=this.GetIdxByKey('fengDing');
        let kexuanwanfa=this.GetIdxsByKey('kexuanwanfa');

        let yiziqiaoxi=-1;
        if(kexuanwanfa.indexOf(3)>-1){
            yiziqiaoxi=this.GetIdxByKey('yiziqiaoxi');
        }

        let fangjian=this.GetIdxsByKey('fangjian');
        let xianShi=this.GetIdxByKey('xianShi');
        let jiesan=this.GetIdxByKey('jiesan');
        let gaoji=this.GetIdxsByKey('gaoji');

        sendPack = {
            "zhuaniao":zhuaniao,
            "fengDing":fengDing,
            "kexuanwanfa":kexuanwanfa,
            "yiziqiaoxi":yiziqiaoxi,
            "fangjian":fangjian,
            "xianShi":xianShi,
            "jiesan":jiesan,
            "gaoji":gaoji,

            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,

        }
        return sendPack;
    },
    // CreateSendPack -end-

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
            return;
        } else if ('kexuanwanfa' == key) {
            if(toggleIndex == 7){
                let mark = needClearList[7].getChildByName('checkmark').active;
                if(!mark){
                    if(this.Toggles['renshu'][0].getChildByName('checkmark').active==false){
                        app.SysNotifyManager().ShowSysMsg("仅二人场可选必中鸟", [], 3);
                        return;
                    }
                }
            }
            if(toggleIndex == 6){
                let mark = needClearList[6].getChildByName('checkmark').active;
                if(!mark){
                    if(this.Toggles['zhuaniao'][2].getChildByName('checkmark').active==false){
                        app.SysNotifyManager().ShowSysMsg("抓2鸟才能选海底胡鸟牌", [], 3);
                        return;
                    }
                }
            }
            if(toggleIndex == 5){
                let mark = needClearList[5].getChildByName('checkmark').active;
                if(!mark){
                    if(needClearList[4].getChildByName('checkmark').active==false){
                        app.SysNotifyManager().ShowSysMsg("一条龙才能勾选一条龙可接炮", [], 3);
                        return;
                    }
                }
            }
            if(toggleIndex == 4){
                let mark = needClearList[4].getChildByName('checkmark').active;
                if(mark){
                    needClearList[5].getChildByName('checkmark').active=false;
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

    OnUpdateTogglesLabel: function (TogglesNode, isResetPos = true) {
        if(this.Toggles['yiziqiaoxi']){
            this.Toggles['yiziqiaoxi'][0].parent.active=this.Toggles['kexuanwanfa'][3].getChildByName('checkmark').active;
        }
    },


});

module.exports = qymjChildCreateRoom;