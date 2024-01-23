/*
创建房间子界面
 */
var app = require("app");

var zjmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
    //需要自己重写
    CreateSendPack:function(renshu, setCount, isSpiltRoomCard){
        let sendPack = {};
        let jiesan = this.GetIdxByKey("jiesan");
        let xianShi = this.GetIdxByKey("xianShi");
        let moshi = this.GetIdxByKey("moshi");
        let diFen = this.GetIdxByKey("diFen");
        let fengDing = this.GetIdxByKey("fengDing");
        let wanfa = this.GetIdxByKey('wanfa');
        
        // let wanfa = [];
        // for (let i = 0; i < this.Toggles['wanfa'].length; i++) {
        //     if (this.Toggles['wanfa'][i].getChildByName('checkmark').active) {
        //         wanfa.push(i);
        //     }
        // }
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
        let gaoji = [];
        for (let i = 0; i < this.Toggles['gaoji'].length; i++) {
            if (this.Toggles['gaoji'][i].getChildByName('checkmark').active) {
                gaoji.push(i);
            }
        }
        sendPack = {
            "setCount": setCount,
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "paymentRoomCardType": isSpiltRoomCard,
            "fangjian": fangjian,
            "moshi": moshi,
            "diFen": diFen,
            "fengDing": fengDing,
            "jiesan": jiesan,
            "xianShi": xianShi,
            "gaoji": gaoji,
            "wanfa":wanfa,
            "kexuanwanfa": kexuanwanfa,
            // "jiesan": jiesan,
            // "xianShi": xianShi,
            // "fangjian": fangjian,
            // "playerMinNum": renshu[0],
            // "playerNum": renshu[1],
            // "setCount": setCount,
            // "paymentRoomCardType": isSpiltRoomCard,
            // "gaoji": gaoji,
            // "wanfa":wanfa,
            // "kexuanwanfa": kexuanwanfa,
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
            if('hbyxmj' == this.gameType){
                let moshiToggles = this.Toggles["moshi"];
                if(moshiToggles[0].getChildByName('checkmark').active) {    // 经典模式
                    if(toggleIndex == 3 || toggleIndex == 4) {
                        app.SysNotifyManager().ShowSysMsg("未勾选258模式时，不可选择乱将和碰碰胡");
                        return;
                    }
                }else if(moshiToggles[1].getChildByName('checkmark').active){ //258模式
                    if(toggleIndex == 3) { // 乱将
                        this.kexuanwanfa_luanJiang = true;
                    }else if(toggleIndex == 4){	//碰碰胡
                        this.kexuanwanfa_PengPengHu = true;
                    }
                }
            }
        } else if ('moshi' == key) {  // 模式
			let kexuanwanfaToggles = this.Toggles["kexuanwanfa"];
			if(toggleIndex == 0){ //经典模式(没有乱将、碰碰胡规则)
				this.kexuanwanfa_luanJiang = kexuanwanfaToggles[3].getChildByName('checkmark').active;   // 乱将
				this.kexuanwanfa_PengPengHu = kexuanwanfaToggles[4].getChildByName('checkmark').active;	// 碰碰胡
				kexuanwanfaToggles[3].getChildByName('checkmark').active = false;
				kexuanwanfaToggles[4].getChildByName('checkmark').active = false;
			}else if(toggleIndex == 1){ //258模式
				if(-1 != this.kexuanwanfa_luanJiang){
					kexuanwanfaToggles[3].getChildByName('checkmark').active = this.kexuanwanfa_luanJiang;
				}
				if(-1 != this.kexuanwanfa_PengPengHu){
					kexuanwanfaToggles[4].getChildByName('checkmark').active = this.kexuanwanfa_PengPengHu;
				}
            }
		} else {

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
        this.UpdateLabelColor(this.Toggles["kexuanwanfa"][3].parent);
		this.UpdateLabelColor(this.Toggles["kexuanwanfa"][4].parent);
    },
});

module.exports = zjmjChildCreateRoom;