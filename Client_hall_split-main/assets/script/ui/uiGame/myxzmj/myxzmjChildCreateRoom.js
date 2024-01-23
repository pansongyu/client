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
    //房数检测
    CheckFangshu: function () {
        if(this.Toggles["fangshu"]==undefined)
        {
            return;
        }

        let renshu = this.getCurSelectRenShu();//发给服务器人数用选的
        if(renshu[1]==2)
        {
            this.Toggles["fangshu"][0].active = false;//3房
            this.Toggles["fangshu"][1].active = true;//2房
            this.Toggles["fangshu"][2].active = true;//1房
            this.Toggles["fangshu"][1].x = this.Toggles["fangshu"][0].x
            this.Toggles["fangshu"][2].x = this.Toggles["fangshu"][0].x + 200
            let event = {};
            event.target = this.Toggles['fangshu'][1];
            this.OnToggleClick(event);
        }
        else if(renshu[1]==3)
        {
            this.Toggles["fangshu"][0].active = true;//3房
            this.Toggles["fangshu"][1].active = true;//2房
            this.Toggles["fangshu"][2].active = false;//1房
            this.Toggles["fangshu"][1].x = this.Toggles["fangshu"][0].x + 200
            this.Toggles["fangshu"][2].x = this.Toggles["fangshu"][0].x + 400
            let event = {};
            event.target = this.Toggles['fangshu'][1];
            this.OnToggleClick(event);
        }
        else if(renshu[1]==4)
        {
            this.Toggles["fangshu"][0].active = true;//3房
            this.Toggles["fangshu"][1].active = false;//2房
            this.Toggles["fangshu"][2].active = false;//1房
            
            let event = {};
            event.target = this.Toggles['fangshu'][0];
            this.OnToggleClick(event);
        }
    },
});

module.exports = fzmjChildCreateRoom;