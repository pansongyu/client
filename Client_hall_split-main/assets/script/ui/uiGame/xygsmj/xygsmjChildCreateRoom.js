/*
创建房间子界面
 */
var app = require("app");

var bzqzmjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function(renshu, setCount, isSpiltRoomCard) {
		let sendPack = {};
		let difen=this.GetIdxByKey('difen');
		let hupai=this.GetIdxByKey('hupai');
		let fengpai=this.GetIdxByKey('fengpai');
		let sanfeng=this.GetIdxByKey('sanfeng');
		let liuju=this.GetIdxByKey('liuju');
		let kexuanwanfa=this.GetIdxsByKey('kexuanwanfa');
		let fangjian=this.GetIdxsByKey('fangjian');
		let xianShi=this.GetIdxByKey('xianShi');
		let jiesan=this.GetIdxByKey('jiesan');
		let gaoji=this.GetIdxsByKey('gaoji');
		if (fengpai == 1) {
			sanfeng = -1;
		}
    	sendPack = {
			"difen":difen,
			"hupai":hupai,
			"fengpai":fengpai,
			"sanfeng":sanfeng,
			"liuju":liuju,
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
	AdjustSendPack: function (sendPack) {
		return sendPack;
    },
	OnToggleClick: function(event) {
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
		}
		else if ("fengpai" == key) {
			if (toggleIndex == 1) {
				this.Toggles['sanfeng'][0].parent.active = false;
			}else{
				this.Toggles['sanfeng'][0].parent.active = true;
			}
		}
		if (toggles.getComponent(cc.Toggle)) { //复选框
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
	UpdateOnClickToggle: function() {
		if (this.Toggles["sanfeng"]) {
			if (this.Toggles["fengpai"][0].getChildByName('checkmark').active) {
				this.Toggles["sanfeng"][0].parent.active = true;
			} else {
				this.Toggles["sanfeng"][0].parent.active = false;
			}
		}
	},
});

module.exports = bzqzmjChildCreateRoom;