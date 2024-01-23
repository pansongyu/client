/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
    //需要自己重写
    CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
        let sendPack = {};
        
        let guipai=this.GetIdxByKey('guipai');
        let shagui=this.GetIdxByKey('shagui');
        let guipaijiafen=this.GetIdxByKey('guipaijiafen');
        let ewaifenshu=this.GetIdxByKey('ewaifenshu');
        let jiabei=this.GetIdxByKey('jiabei');
        let kexuanwanfa=this.GetIdxsByKey('kexuanwanfa');
        let fangjian=this.GetIdxsByKey('fangjian');
        let xianShi=this.GetIdxByKey('xianShi');
        let jiesan=this.GetIdxByKey('jiesan');
        let gaoji=this.GetIdxsByKey('gaoji');

        sendPack = {
            
            "guipai":guipai,
            "shagui":shagui,
            "guipaijiafen":guipaijiafen,
            "ewaifenshu":ewaifenshu,
            "jiabei":jiabei,
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
        if(sendPack.shagui < 3){
            sendPack.guipaijiafen = -1;
        }
        if(parseInt(sendPack.playerMinNum) != 2){
            sendPack.ewaifenshu = -1;
            sendPack.jiabei = -1;
        }else{
            if(sendPack.ewaifenshu != 1){
                sendPack.jiabei = -1;
            }
        }
        return sendPack;
    },

    GetIdxsByKey: function (key) {
        if (!this.Toggles[key]) {
            return [];
        }

        let arr = [];
        for (let i = 0; i < this.Toggles[key].length; i++) {
            if (this.Toggles[key][i].getChildByName('checkmark').active) {
                arr.push(i);
            }
        }
        return arr;
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
            return;
        } else if ('kexuanwanfa' == key) {
            
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
    UpdateOnClickToggle:function(){
        if (this.Toggles['guipaijiafen']) {
            if(this.Toggles['shagui'][3].getChildByName("checkmark").active || this.Toggles['shagui'][4].getChildByName("checkmark").active){
                this.Toggles['guipaijiafen'][0].parent.active = true;
            }else{
                this.Toggles['guipaijiafen'][0].parent.active = false;
            }
        }
        if (this.Toggles['ewaifenshu']) {
            if(this.Toggles['renshu'][0].getChildByName("checkmark").active){
                this.Toggles['ewaifenshu'][0].parent.active = true;
            }else{
                this.Toggles['ewaifenshu'][0].parent.active = false;
            }
        }
        if (this.Toggles['jiabei']) {
            if(this.Toggles['renshu'][0].getChildByName("checkmark").active){
                if(this.Toggles['ewaifenshu'][1].getChildByName("checkmark").active){
                    this.Toggles['jiabei'][0].parent.active = true;
                }else{
                    this.Toggles['jiabei'][0].parent.active = false;
                }
            }else{
                this.Toggles['jiabei'][0].parent.active = false;
            }
        }
    },
});

module.exports = fzmjChildCreateRoom;