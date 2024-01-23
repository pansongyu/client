/*
创建房间子界面
 */
var app = require("app");

var a3pkChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},

    // CreateSendPack -start-
    CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
        let sendPack = {};
        let kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        let difen = this.GetIdxByKey('difen');
        let fangjian = this.GetIdxsByKey('fangjian');
        let xianShi = this.GetIdxByKey('xianShi');
        let jiesan = this.GetIdxByKey('jiesan');
        let gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "kexuanwanfa": kexuanwanfa,
            "difen": difen,
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
            if (key == "renshu") {
				if (toggleIndex == 1) {	// 6人
					this.Toggles["kexuanwanfa"][1].active = false;
					this.Toggles["kexuanwanfa"][2].active = false;
					this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
				}
			}
            this.ClearToggleCheck(needClearList, needShowIndexList);
            this.UpdateLabelColor(toggles);
            this.UpdateTogglesLabel(toggles, false);

            return;
        } else if ('kexuanwanfa' == key) {

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


    /**
     * 单选
     */
    GetIdxByKey: function (key) {
        if (!this.Toggles[key]) {
            return -1;
        }

        for (let i = 0; i < this.Toggles[key].length; i++) {
            let mark = this.Toggles[key][i].getChildByName('checkmark').active;
            if (this.Toggles[key][i].active && mark) {
                return i;
            }
        }
    },
    /**
     * 多选
     */
    GetIdxsByKey: function (key) {
        if (!this.Toggles[key]) {
            return [];
        }

        let arr = [];
        for (let i = 0; i < this.Toggles[key].length; i++) {
            if (this.Toggles[key][i].active && this.Toggles[key][i].getChildByName('checkmark').active) {
                arr.push(i);
            }
        }
        return arr;
    },

    OnUpdateTogglesLabel: function (TogglesNode, isResetPos = true) {
		if (this.Toggles["fangjian"] && this.Toggles["fafen"]) {
			if (!this.Toggles["fafen"][4].getChildByName("checkmark").active) {
				this.Toggles["fangjian"][0].active = false;
				this.UpdateLabelColor(this.Toggles['fangjian'][0].parent);
			} else {
				this.Toggles["fangjian"][0].active = true;
			}
		}
		if (this.Toggles["fafen"]) {
			if (this.Toggles["kexuanwanfa"][2].getChildByName("checkmark").active) {
				this.Toggles["fafen"][0].parent.active = false;
				this.Toggles["fangjian"][0].active = true;
			} else {
				this.Toggles["fafen"][0].parent.active = true;
				if (!this.Toggles["fafen"][4].getChildByName("checkmark").active) {
					this.Toggles["fangjian"][0].active = false;
				}
			}
		}

		if (this.Toggles["kexuanwanfa"]) {
			if (this.Toggles["renshu"][0].getChildByName("checkmark").active) {	// 4人
				this.Toggles["kexuanwanfa"][1].active = true;
				this.Toggles["kexuanwanfa"][2].active = true;
			} else {
				this.Toggles["kexuanwanfa"][1].active = false;
				this.Toggles["kexuanwanfa"][2].active = false;
			}
		}
    },

});

module.exports = a3pkChildCreateRoom;