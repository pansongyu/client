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
        let fengDing = this.GetIdxByKey("fengDing");
        let fanxing = this.GetIdxByKey("fanxing");
        let chajiao = this.GetIdxByKey("chajiao");
        let zimojiangli = this.GetIdxByKey("zimojiangli");
        let dianganghua = this.GetIdxByKey("dianganghua");
        let piaofen = this.GetIdxByKey("piaofen");
        let huanpai = this.GetIdxByKey("huanpai");

        let jiesan = this.GetIdxByKey("jiesan");
        let xianShi = this.GetIdxByKey("xianShi");

        let kexuanwanfa = this.GetIdxsByKey("kexuanwanfa");
        let fangjian = this.GetIdxsByKey("fangjian");
        let gaoji = this.GetIdxsByKey("gaoji");

        let fangshu=this.GetIdxByKey('fangshu');

        fangshu = 3-fangshu;//因为房数的按钮顺序是 3房(0)、2房(1)、1房(2)，所以需要处理一下，告诉服务器1是1房，2是2房，3是3房

        sendPack = {
            "fengDing": fengDing,
            "fanxing": fanxing,
            "chajiao": chajiao,
            "zimojiangli": zimojiangli,
            "dianganghua": dianganghua,
            "piaofen": piaofen,
            "huanpai": huanpai,

            "jiesan": jiesan,
            "xianShi": xianShi,

            "kexuanwanfa": kexuanwanfa,
            "fangjian": fangjian,
            "gaoji": gaoji,

            "fangshu":fangshu,

            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,
        };

        return sendPack;
    },
    AdjustSendPack: function (sendPack) {
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

            if('renshu' == key)
            {
                this.CheckFangshu();
            }

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
        } else if('fangjian' == key){
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
       
    },
});

module.exports = fzmjChildCreateRoom;