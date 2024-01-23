/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
    //需要自己重写
    CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
        let sendPack = {};
        let zhuangjia = this.GetIdxByKey('zhuangjia');
        let liangpai = this.GetIdxByKey('liangpai');
        let dinghu = this.GetIdxByKey('dinghu');
        let kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        let fangjian = this.GetIdxsByKey('fangjian');
        let xianShi = this.GetIdxByKey('xianShi');
        let jiesan = this.GetIdxByKey('jiesan');
        let gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "zhuangjia": zhuangjia,
            "liangpai": liangpai,
            "dinghu": dinghu,
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
    AdjustSendPack: function (sendPack) {
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
            this.UpdateOnClickToggle();
            return;
        } else if ('kexuanwanfa' == key) {
            // if('sss_dr' == this.gameType || 'sss_zz' == this.gameType){
            //     if(toggleIndex == 0){
            //         this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active = false;
            //         this.UpdateLabelColor(this.Toggles['kexuanwanfa'][1].parent);
            //     }
            //     else if(toggleIndex == 1){
            //         this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active = false;
            //         this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
            //     }
            // }
        } else if('fangjian' == key){
            //每局先出黑桃3和首局先出黑桃3不能同时选择
            if (this.Toggles['fangjian'][0].getChildByName('checkmark').active && toggleIndex == 1) {
                this.Toggles['fangjian'][0].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][0].parent);
            } else if (this.Toggles['fangjian'][1].getChildByName('checkmark').active && toggleIndex == 0) {
                this.Toggles['fangjian'][1].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][1].parent);
            }

            if (this.Toggles['fangjian'][4].getChildByName('checkmark').active && toggleIndex == 5) {
                this.Toggles['fangjian'][4].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][4].parent);
            } else if (this.Toggles['fangjian'][5].getChildByName('checkmark').active && toggleIndex == 4) {
                this.Toggles['fangjian'][5].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][5].parent);
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
    UpdateOnClickToggle:function(){
        // if(this.Toggles["kexuanwanfa"]){
        //     this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
        //     if(!this.Toggles["kexuanwanfa"][0].getChildByName("checkmark").active){
        //         this.Toggles['kexuanwanfa'][1].getChildByName("checkmark").active = false;
        //         //置灰
        //         if(this.Toggles['kexuanwanfa'][1].getChildByName("label")){
        //             this.Toggles['kexuanwanfa'][1].getChildByName("label").color = cc.color(180, 180, 180);
        //         }
        //     }else{
        //         //恢复
        //         if(this.Toggles['kexuanwanfa'][1].getChildByName("label")){
        //             this.Toggles['kexuanwanfa'][1].getChildByName("label").color = cc.color(158, 49, 16);
        //         }
        //     }
        // }
    },
});

module.exports = fzmjChildCreateRoom;