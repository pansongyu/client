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
        
        let hupai=this.GetIdxByKey('hupai');
        let fengDing=this.GetIdxByKey('fengDing');
        let shaozhuang=this.GetIdxByKey('shaozhuang');
        let dihu=this.GetIdxByKey('dihu');
        let yougangyouhu=this.GetIdxByKey('yougangyouhu');
        let bangyipao=this.GetIdxByKey('bangyipao');
        let maima=this.GetIdxByKey('maima');
        let mapai=this.GetIdxByKey('mapai');
        // let kexuanwanfa=this.GetIdxsByKey('kexuanwanfa');
        let fangjian=this.GetIdxsByKey('fangjian');
        let xianShi=this.GetIdxByKey('xianShi');
        let jiesan=this.GetIdxByKey('jiesan');
        let gaoji=this.GetIdxsByKey('gaoji');


        if (maima == 0) {
            // this.RemoveMultiSelect(sendPack, "kexuanwanfa", 4);
            mapai = -1;
        }
        if (parseInt(renshu[0]) == 2) {
            // this.RemoveMultiSelect(sendPack, "kexuanwanfa", 4);
            shaozhuang = -1;
        }

        sendPack = {
            
            "hupai":hupai,
            "fengDing":fengDing,
            "shaozhuang":shaozhuang,
            "dihu":dihu,
            "yougangyouhu":yougangyouhu,
            "bangyipao":bangyipao,
            "maima":maima,
            "mapai":mapai,
            // "kexuanwanfa":kexuanwanfa,
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
        if (this.Toggles['mapai']) {
            if(this.Toggles['maima'][0].getChildByName("checkmark").active){
                this.Toggles['mapai'][0].parent.active = false;
            }else{
                this.Toggles['mapai'][0].parent.active = true;
            }
        }
        if (this.Toggles['shaozhuang']) {
            if(this.Toggles['renshu'][0].getChildByName("checkmark").active){
                this.Toggles['shaozhuang'][0].parent.active = false;
            }else{
                this.Toggles['shaozhuang'][0].parent.active = true;
            }
        }
    },
});

module.exports = fzmjChildCreateRoom;