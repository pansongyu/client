/*
创建房间子界面
 */
var app = require("app");

var tzkzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
    //需要自己重写
    CreateSendPack:function(renshu, setCount, isSpiltRoomCard){
        let sendPack = {};
	    let jiesuan = this.GetIdxByKey("jiesuan");
	    let wanfa = this.GetIdxByKey("wanfa");
	    let fengDing = this.GetIdxByKey("fengDing");
	    let jiesan = this.GetIdxByKey("jiesan");
	    let xianShi = this.GetIdxByKey("xianShi");

	    let kexuanwanfa = [];
	    for (let i = 0; i < this.Toggles['kexuanwanfa'].length; i++) {
		    if (this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active) {
			    kexuanwanfa.push(i);
		    }
	    }
	    let fangjian = [];
	    for (let i = 0; i < this.Toggles['fangjian'].length; i++) {
		    if (this.Toggles['fangjian'][i].getChildByName('checkmark').active) {
			    fangjian.push(i);
		    }
	    }
	    let gaoji = [];
	    for (let i = 0; i < this.Toggles['gaoji'].length; i++) {
		    if (this.Toggles['gaoji'][i].getChildByName('checkmark').active) {
			    gaoji.push(i);
		    }
	    }
	    sendPack = {
		    "fengDing": fengDing,
		    "jiesuan": jiesuan,
		    "wanfa": wanfa,
		    "jiesan": jiesan,
		    "xianShi": xianShi,
		    "fangjian": fangjian,
		    "playerMinNum": renshu[0],
		    "playerNum": renshu[1],
		    "setCount": setCount,
		    "paymentRoomCardType": isSpiltRoomCard,
		    "gaoji": gaoji,
		    "kexuanwanfa": kexuanwanfa,
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
	UpdateOnClickToggle: function () {
		if (this.Toggles["kexuanwanfa"]) {
			if (this.Toggles["renshu"][2].getChildByName("checkmark").active) {
				this.Toggles["kexuanwanfa"][5].active = false;
			} else {
				this.Toggles["kexuanwanfa"][5].active = true;
			}
		}
	},
	AdjustSendPack: function (sendPack) {
		if (sendPack.playerNum == 4) {
			this.RemoveMultiSelect(sendPack, "kexuanwanfa", 5);
		}
		return sendPack;
	},
});

module.exports = tzkzmjChildCreateRoom;