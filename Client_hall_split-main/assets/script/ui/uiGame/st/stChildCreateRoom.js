/*
创建房间子界面
 */
var app = require("app");

var a3pkChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
		let sendPack = {};
			let xianShi = this.GetIdxByKey('xianShi');
            let jiesan = this.GetIdxByKey('jiesan');
            let gaoji = [];
            for (let i = 0; i < this.Toggles['gaoji'].length; i++) {
                if (this.Toggles['gaoji'][i].getChildByName('checkmark').active) {
                    gaoji.push(i);
                }
            }
            let fangjian = [];
            for (let i = 0; i < this.Toggles['fangjian'].length; i++) {
                if (this.Toggles['fangjian'][i].getChildByName('checkmark').active) {
                    fangjian.push(i);
                }
            }
            let kexuanwanfa = [];
            for (let i = 0; i < this.Toggles['kexuanwanfa'].length; i++) {
                if (this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active) {
                    kexuanwanfa.push(i);
                }
            }

            let wanfa=this.GetIdxByKey('wanfa');
            let difen = this.GetIdxByKey('difen');
            

            sendPack = {
                "wanfa":wanfa,
                "difen":difen,
                "playerMinNum": renshu[0],
                "playerNum": renshu[1],
                "setCount": setCount,
                "paymentRoomCardType": isSpiltRoomCard,
                "xianShi": xianShi,
                "jiesan": jiesan,
                "gaoji": gaoji,
                "fangjian":fangjian,
                "kexuanwanfa":kexuanwanfa,
            };
		return sendPack;
	},
	 OnToggleClick:function(event){
        this.FormManager.CloseForm("UIMessageTip");
        let toggles = event.target.parent;
        let toggle = event.target;
        let key = toggles.name.substring(('Toggles_').length,toggles.name.length);
        let toggleIndex = parseInt(toggle.name.substring(('Toggle').length,toggle.name.length)) - 1;
        let needClearList = [];
        let needShowIndexList = [];
        needClearList = this.Toggles[key];
        needShowIndexList.push(toggleIndex);
        if('jushu' == key || 'renshu' == key || 'fangfei' == key){
            this.ClearToggleCheck(needClearList,needShowIndexList);
            this.UpdateLabelColor(toggles);
            this.UpdateTogglesLabel(toggles, false);
            
            return;
        } else if('kexuanwanfa' == key){
           if(toggleIndex==2){
                if(this.Toggles["kexuanwanfa"][2].getChildByName("checkmark").active==false && this.Toggles["wanfa"][1].getChildByName("checkmark").active==true){
                    app.SysNotifyManager().ShowSysMsg("癞子玩法不能勾选墩可拆", [], 3);
                    return;
                }
            }
            if(toggleIndex==1){
                if(this.Toggles["kexuanwanfa"][1].getChildByName("checkmark").active==false && this.Toggles["wanfa"][0].getChildByName("checkmark").active==true){
                    app.SysNotifyManager().ShowSysMsg("经典玩法不能勾选同色王加档", [], 3);
                    return;
                }
            }
        }
        if(toggles.getComponent(cc.Toggle)){//复选框
            needShowIndexList = [];
            for(let i=0;i<needClearList.length;i++){
                let mark = needClearList[i].getChildByName('checkmark').active;
                //如果复选框为勾选状态并且点击的复选框不是该复选框，则继续保持勾选状态
                if(mark && i != toggleIndex){
                    needShowIndexList.push(i);
                }
                //如果复选框为未勾选状态并且点击的复选框是该复选框，则切换为勾选状态
                else if(!mark && i == toggleIndex){
                    needShowIndexList.push(i);
                }
            }
        }
        this.ClearToggleCheck(needClearList,needShowIndexList);
        this.UpdateLabelColor(toggles,'fangfei' == key ? true : false);
        this.UpdateOnClickToggle();
    },

	UpdateOnClickToggle:function(){
        //子类重写
        if  (this.Toggles["kexuanwanfa"]) {
            if (this.Toggles["wanfa"][0].getChildByName("checkmark").active==true) {
                this.Toggles["kexuanwanfa"][1].getChildByName("checkmark").active=false;
                this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
            }
            if (this.Toggles["wanfa"][1].getChildByName("checkmark").active==true) {
                this.Toggles["kexuanwanfa"][2].getChildByName("checkmark").active=false;
                this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
            }
        }
    },


	
});

module.exports = a3pkChildCreateRoom;