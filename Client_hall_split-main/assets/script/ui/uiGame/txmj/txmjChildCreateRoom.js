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
    	let fengpai = this.GetIdxByKey('fengpai');
    	let hupai = this.GetIdxByKey('hupai');
    	let xiapao = this.GetIdxByKey('xiapao');
    	let gudingpao = this.GetIdxByKey('gudingpao');
    	let baoting = this.GetIdxByKey('baoting');
    	let jiafen = this.GetIdxsByKey('jiafen');
    	let kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
    	let fangjian = this.GetIdxsByKey('fangjian');
    	let xianShi = this.GetIdxByKey('xianShi');
    	let jiesan = this.GetIdxByKey('jiesan');
    	let gaoji = this.GetIdxsByKey('gaoji');

    	sendPack = {
        	"fengpai": fengpai,
        	"hupai": hupai,
        	"xiapao": xiapao,
        	"gudingpao": gudingpao,
        	"baoting": baoting,
        	"jiafen": jiafen,
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
	// CreateSendPack -end-

	AdjustSendPack: function (sendPack) {
		// 奖马勾选“无马”，则不能勾选“马跟杠”和“10倍听牌可接炮”；
		// if (sendPack.jiangma == 0) {
		// 	this.RemoveMultiSelect(sendPack, "kexuanwanfa", 0);
		// 	this.RemoveMultiSelect(sendPack, "kexuanwanfa", 10);
		// }
		// // 勾选“可接炮胡”，则不能勾选“抢杠胡3倍”；
		// if (sendPack.kexuanwanfa.indexOf(1) > -1) {
		// 	this.RemoveMultiSelect(sendPack, "kexuanwanfa", 6);
		// }
		// if (toggleIndex == 2 && !needClearList[toggleIndex].getChildByName('checkmark').active) {
		// 	this.Toggles['kexuanwanfa'][0].active = true;
		// } else {
		// 	this.Toggles['kexuanwanfa'][0].active = false;
		// }

		if (sendPack.xiapao == 2) {
			this.RemoveMultiSelect(sendPack, "kexuanwanfa", 0);
		}
		if (sendPack.xiapao != 3) {
			this.RemoveRadioSelect(sendPack, "gudingpao");
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
        }
		else if ('xiapao' == key) {
			if (toggleIndex == 3 && !needClearList[toggleIndex].getChildByName('checkmark').active) {
				this.Toggles['gudingpao'][0].parent.active = true;
			} else {
				this.Toggles['gudingpao'][0].parent.active = false;
			}
			if (toggleIndex == 2 && !needClearList[toggleIndex].getChildByName('checkmark').active) {
				this.Toggles['kexuanwanfa'][0].active = false;
			} else {
				this.Toggles['kexuanwanfa'][0].active = true;
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

	OnUpdateTogglesLabel: function (TogglesNode, isResetPos = true) {
		if (this.Toggles["gudingpao"]) {
			if (this.Toggles["xiapao"][3].getChildByName("checkmark").active) {
				this.Toggles["gudingpao"][0].parent.active = true;
			} else {
				this.Toggles["gudingpao"][0].parent.active = false;
			}
		}

		if (this.Toggles["kexuanwanfa"]) {
			if (this.Toggles["xiapao"][2].getChildByName("checkmark").active) {
				this.Toggles["kexuanwanfa"][0].active = false;
			} else {
				this.Toggles["kexuanwanfa"][0].active = true;
			}
		}
    },


});

module.exports = qymjChildCreateRoom;