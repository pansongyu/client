/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },

	// CreateSendPack -start-
	CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
    	let sendPack = {};
		let kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
		let jiafan = this.GetIdxsByKey('jiafan');
		let fanbei = this.GetIdxsByKey('fanbei');
		let paishu = this.GetIdxsByKey('paishu');
		let gangpaisuanfen = this.GetIdxByKey('gangpaisuanfen');
		let fangjian = this.GetIdxsByKey('fangjian');
		let qiangganghu = this.GetIdxByKey('qiangganghu');
		let paohufen = this.GetIdxByKey('paohufen');
		let zimofen = this.GetIdxByKey('zimofen');
		let xianShi = this.GetIdxByKey('xianShi');
		let jiesan = this.GetIdxByKey('jiesan');
		let gaoji = this.GetIdxsByKey('gaoji');

    	sendPack = {
			"kexuanwanfa": kexuanwanfa,
			"jiafan": jiafan,
			"fanbei": fanbei,
			"paishu": paishu,
			"gangpaisuanfen": gangpaisuanfen,
			"fangjian": fangjian,
			"qiangganghu": qiangganghu,
			"paohufen": paohufen,
			"zimofen": zimofen,
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
        // if (sendPack.shagui < 3) {
        //     sendPack.guipaijiafen = -1;
        // }
        // if (parseInt(sendPack.playerMinNum) != 2) {
        //     sendPack.ewaifenshu = -1;
        //     sendPack.jiabei = -1;
        // } else {
        //     if (sendPack.ewaifenshu != 1) {
        //         sendPack.jiabei = -1;
        //     }
        // }
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

        if ('jushu' == key || 'renshu' == key || 'fangfei' == key || "zhuaniaomoshi" == key) {
            this.ClearToggleCheck(needClearList, needShowIndexList);
            this.UpdateLabelColor(toggles);
            this.UpdateTogglesLabel(toggles, false);
            this.UpdateOnClickToggle();

            // 	3人场玩法时，“缺一”不可选；
            if ('renshu' == key) {
                if (toggleIndex == 1) {
                    this.Toggles['jiafan'][2].active = false;
                } else {
                    this.Toggles['jiafan'][2].active = true;
                }

                // 	3人场“去字牌”不可选；
                // 	4人场“去万牌”不可选；
                if (toggleIndex == 1) {
                    this.Toggles['paishu'][0].active = true;
                    // this.Toggles['paishu'][1].active = false;
                } else if (toggleIndex == 2) {
                    this.Toggles['paishu'][0].active = false;
                    this.Toggles['paishu'][1].active = true;
                } else {
                    this.Toggles['paishu'][0].active = true;
                    this.Toggles['paishu'][1].active = true;
                }
            }
            return;
        } else if ('kexuanwanfa' == key) {
            // 	勾选“不可点炮”，不能勾选“一炮多响”；
            if (toggleIndex == 1 && this.Toggles['kexuanwanfa'][2].getChildByName('checkmark').active) {
                this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active = false;
                app.SysNotifyManager().ShowSysMsg("勾选不可点炮，不能勾选一炮多响");
                return;
            }
            if (toggleIndex == 2 && this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active) {
                app.SysNotifyManager().ShowSysMsg("勾选不可点炮，不能勾选一炮多响");
                return;
            }
        } else if ("fangjian" == key) {

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
        // 	3人场玩法时，“缺一”不可选；
        if (this.Toggles["jiafan"]) {
            if (this.Toggles["renshu"][1].getChildByName("checkmark").active) {
                this.Toggles["jiafan"][2].active = false;
            } else {
                this.Toggles["jiafan"][2].active = true;
            }
        }

        // 	3人场“去字牌”不可选；
        // 	4人场“去万牌”不可选；
        if (this.Toggles["paishu"]) {
            if (this.Toggles["renshu"][1].getChildByName("checkmark").active) {
                this.Toggles['paishu'][0].active = true;
                // this.Toggles['paishu'][1].active = false;
            } else if (this.Toggles["renshu"][2].getChildByName("checkmark").active) {
                this.Toggles['paishu'][0].active = false;
                this.Toggles['paishu'][1].active = true;
            } else {
                this.Toggles['paishu'][0].active = true;
                this.Toggles['paishu'][1].active = true;
            }
        }
    },

    UpdateOnClickToggle: function () {
        // if (this.Toggles['guipaijiafen']) {
        //     if(this.Toggles['shagui'][3].getChildByName("checkmark").active || this.Toggles['shagui'][4].getChildByName("checkmark").active){
        //         this.Toggles['guipaijiafen'][0].parent.active = true;
        //     }else{
        //         this.Toggles['guipaijiafen'][0].parent.active = false;
        //     }
        // }
        // if (this.Toggles['ewaifenshu']) {
        //     if(this.Toggles['renshu'][0].getChildByName("checkmark").active){
        //         this.Toggles['ewaifenshu'][0].parent.active = true;
        //     }else{
        //         this.Toggles['ewaifenshu'][0].parent.active = false;
        //     }
        // }
        // if (this.Toggles['jiabei']) {
        //     if(this.Toggles['renshu'][0].getChildByName("checkmark").active){
        //         if(this.Toggles['ewaifenshu'][1].getChildByName("checkmark").active){
        //             this.Toggles['jiabei'][0].parent.active = true;
        //         }else{
        //             this.Toggles['jiabei'][0].parent.active = false;
        //         }
        //     }else{
        //         this.Toggles['jiabei'][0].parent.active = false;
        //     }
        // }
    },


});

module.exports = fzmjChildCreateRoom;