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
    	let moshi=this.GetIdxByKey('moshi');
        let shuaipai=this.GetIdxByKey('shuaipai');
        let gangpai=this.GetIdxByKey('gangpai');
        let kexuanwanfa=this.GetIdxsByKey('kexuanwanfa');
        let fangjian=this.GetIdxsByKey('fangjian');
        let xianShi=this.GetIdxByKey('xianShi');
        let jiesan=this.GetIdxByKey('jiesan');
        let gaoji=this.GetIdxsByKey('gaoji');

        sendPack = {
            "moshi":moshi,
            "shuaipai":shuaipai,
            "gangpai":gangpai,
            "kexuanwanfa":kexuanwanfa,
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
        }else if ('kexuanwanfa' == key) {
           if(toggleIndex == 4){
                let mark4 = needClearList[4].getChildByName('checkmark').active;
                if(!mark4){
                    let mark1 = needClearList[0].getChildByName('checkmark').active;
                    if(!mark1){
                        app.SysNotifyManager().ShowSysMsg("小鸡满天飞仅中发白玩法可选", [], 3);
                        return;
                    }
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
    UpdateOnClickToggle:function(){
        if(this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active==false){
            this.Toggles['kexuanwanfa'][4].getChildByName('checkmark').active=false;
            this.UpdateLabelColor(this.Toggles['kexuanwanfa'][3].parent);
        }
    },
    OnUpdateTogglesLabel: function (TogglesNode, isResetPos = true) {
        // if (this.Toggles["kexuanwanfa"]) {
        //     if (this.Toggles["kexuanwanfa"][1].getChildByName("checkmark").active) {
        //         this.Toggles["kexuanwanfa"][2].active = true;
        //     } else {
        //         this.Toggles["kexuanwanfa"][2].active = false;
        //     }
        // }
    },


});

module.exports = qymjChildCreateRoom;