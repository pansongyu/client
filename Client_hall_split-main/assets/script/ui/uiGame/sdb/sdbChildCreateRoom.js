/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
        let sendPack = {};
        let zhuangjia = this.GetIdxByKey('zhuangjia');
        let jiesan = this.GetIdxByKey('jiesan');
        let xianShi = this.GetIdxByKey('xianShi');
        let gaoji = [];
        for (let i = 0; i < this.Toggles['gaoji'].length; i++) {
            if (this.Toggles['gaoji'][i].getChildByName('checkmark').active) {
                gaoji.push(i);
            }
        }
        let fangjian = [];
        for (let i = 0; i < this.Toggles["fangjian"].length; i++) {
            if (this.Toggles["fangjian"][i].getChildByName("checkmark").active) {
                fangjian.push(i);
            }
        }
        let kexuanwanfa = [];
        for (let i = 0; i < this.Toggles["kexuanwanfa"].length; i++) {
            if (this.Toggles["kexuanwanfa"][i].getChildByName("checkmark").active) {
                kexuanwanfa.push(i);
            }
        }
        sendPack = {
            setCount: setCount,
            zhuangjia: zhuangjia,   //int       连庄,轮庄
            playerNum: renshu[1],               //int       最大人数
            playerMinNum: renshu[0],                        //int       最小人数
            kexuanwanfa: kexuanwanfa,               //list      可选玩法(0：超时弃牌1：头家反带2：允许中途加入，3：头家闷吃)
            gaoji: gaoji,                           //list      高级选项(同IP不可进,同位置不可进,禁止使用道具)
            jiesan: jiesan,
            xianShi: xianShi,
            fangjian: fangjian,
            paymentRoomCardType: isSpiltRoomCard,
        };
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
        if ('jushu' == key || 'renshu' == key || 'fangfei' == key) {
            this.ClearToggleCheck(needClearList, needShowIndexList);
            this.UpdateLabelColor(toggles);
            this.UpdateTogglesLabel(toggles, false);
            return;
        } else if ('kexuanwanfa' == key) {
            // if(this.Toggles['zhuaniao'][0].getChildByName('checkmark').active==true && toggleIndex==4){
            //     //红中赖子
            //     app.SysNotifyManager().ShowSysMsg("按庄家中鸟不能勾选红中癞子玩法");
            //     return;
            // }
        }else if('fangjian' == key){
            if (this.Toggles['fangjian'][1].getChildByName('checkmark').active && toggleIndex == 3) {
                this.Toggles['fangjian'][1].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][1].parent);
            } else if (this.Toggles['fangjian'][3].getChildByName('checkmark').active && toggleIndex == 1) {
                this.Toggles['fangjian'][3].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][3].parent);
            }

            if (this.Toggles['fangjian'][2].getChildByName('checkmark').active && toggleIndex == 4) {
                this.Toggles['fangjian'][2].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][2].parent);
            } else if (this.Toggles['fangjian'][4].getChildByName('checkmark').active && toggleIndex == 2) {
                this.Toggles['fangjian'][4].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][4].parent);
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

module.exports = fzmjChildCreateRoom;