/*
创建房间子界面
 */
var app = require("app");

var hamjChildCreateRoom = cc.Class({

    extends: require("BaseChildCreateRoom"),

    properties: {

    },

    // CreateSendPack -start-
    CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
        let sendPack = {};
        let zhuaniao = this.GetIdxByKey('zhuaniao');
        let kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        let kechui = this.GetIdxByKey('kechui');
        let shuaitouzi = this.GetIdxByKey('shuaitouzi');
        let fangjian = this.GetIdxsByKey('fangjian');
        let xianShi = this.GetIdxByKey('xianShi');
        let jiesan = this.GetIdxByKey('jiesan');
        let gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "zhuaniao": zhuaniao,
            "kexuanwanfa": kexuanwanfa,
            "kechui": kechui,
            "shuaitouzi": shuaitouzi,
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
    // CreateSendPack -end-

	AdjustSendPack: function (sendPack) {
		if (sendPack.kexuanwanfa.indexOf(0) == -1) {	// 可锤
			this.RemoveRadioSelect(sendPack, "kechui");
		}
		if (sendPack.kexuanwanfa.indexOf(1) == -1) {	// 甩骰子
			this.RemoveRadioSelect(sendPack, "shuaitouzi");
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
            // 	可锤：自由锤,铁锤；
            // 	单选，默认自由锤；
            // 	可选玩法中勾选“可锤”，才能选择该玩法，否则隐藏；
            if (toggleIndex == 0) {
                if (this.Toggles["kexuanwanfa"][0].getChildByName("checkmark").active) { // 可/s/s/s/s/s/s锤
                    this.Toggles["kechui"][0].parent.active = false;
                } else {
                    this.Toggles["kechui"][0].parent.active = true;
                }
            }

            // 	甩骰子：3分,6分,9分；
            // 	单选，默认3分；
            // 	可选玩法中勾选“甩骰子”，才能选择该玩法，否则隐藏；	
            if (toggleIndex == 1) {
                if (this.Toggles["kexuanwanfa"][1].getChildByName("checkmark").active) { // 甩/s/s骰/s/s/s子
                    this.Toggles["shuaitouzi"][0].parent.active = false;
                } else {
                    this.Toggles["shuaitouzi"][0].parent.active = true;
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
    },

    OnUpdateTogglesLabel: function (TogglesNode, isResetPos = true) {
        // 	可锤：自由锤,铁锤；
        // 	单选，默认自由锤；
        // 	可选玩法中勾选“可锤”，才能选择该玩法，否则隐藏；
        if (this.Toggles["kechui"]) {
            if (this.Toggles["kexuanwanfa"][0].getChildByName("checkmark").active) { // 可/s/s/s/s/s/s锤
                this.Toggles["kechui"][0].parent.active = true;
            } else {
                this.Toggles["kechui"][0].parent.active = false;
            }
        }

        // 	甩骰子：3分,6分,9分；
        // 	单选，默认3分；
        // 	可选玩法中勾选“甩骰子”，才能选择该玩法，否则隐藏；		
        if (this.Toggles["shuaitouzi"]) {
            if (this.Toggles["kexuanwanfa"][1].getChildByName("checkmark").active) { // 甩/s/s骰/s/s/s子
                this.Toggles["shuaitouzi"][0].parent.active = true;
            } else {
                this.Toggles["shuaitouzi"][0].parent.active = false;
            }
        }
    },

});

module.exports = hamjChildCreateRoom;