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
		let fengDing=this.GetIdxByKey('fengDing');
		let wanfa=this.GetIdxByKey('wanfa');
		let kexuanwanfa=this.GetIdxsByKey('kexuanwanfa');
		let fangjian=this.GetIdxsByKey('fangjian');
		let xianShi=this.GetIdxByKey('xianShi');
		let jiesan=this.GetIdxByKey('jiesan');
		let gaoji=this.GetIdxsByKey('gaoji');

    	sendPack = {
			"fengDing":fengDing,
			"wanfa":wanfa,
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
		} else if ('kexuanwanfa' == key) {
			//勾选“不带风”，则“翻扣挂”不能勾选；
			if(toggleIndex == 7 && needClearList[1].getChildByName("checkmark").active){
				// this.ShowSysMsg(勾选“不带风”，则“翻扣挂”不能勾选);
		    	return	
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
		//同时勾选“大小七对只自摸胡”和“平胡只自摸胡”时，不可勾选“可抢杠胡”；
		//勾选 “平胡只自摸胡”同时没有勾选“有大小七对”时，也不可勾选 “可抢杠胡”；
		if(this.Toggles["kexuanwanfa"]){
			if(this.Toggles["kexuanwanfa"][1].getChildByName("checkmark").active){
				this.Toggles['kexuanwanfa'][7].getChildByName("checkmark").active = false;
				this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
				//置灰
				if(this.Toggles['kexuanwanfa'][7].getChildByName("label")){
					this.Toggles['kexuanwanfa'][7].getChildByName("label").color = cc.color(180, 180, 180);
				}
			}else{
				this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
			}
		}
	},
});

module.exports = bzqzmjChildCreateRoom;