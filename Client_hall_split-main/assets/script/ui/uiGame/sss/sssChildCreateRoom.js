/*
创建房间子界面
 */
var app = require("app");

var sssChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

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
        } else if('zhuangjiaguize' == key){
            if(toggleIndex==0){
                app.SysNotifyManager().ShowSysMsg('房主坐庄暂时不能选择，我们将尽快修复');
                return;
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
    },
    //需要自己重写
    CreateSendPack:function(renshu, setCount, isSpiltRoomCard){
        let sendPack = {};
        let sss_kexuanwanfa=[];
            for(let i=0;i<this.Toggles['kexuanwanfa'].length;i++){
                if(this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active){
                    sss_kexuanwanfa.push(i);
                }
            }
            let fangjian=[];
            for(let i=0;i<this.Toggles['fangjian'].length;i++){
                if(this.Toggles['fangjian'][i].getChildByName('checkmark').active){
                    fangjian.push(i);
                }
            }
            let sss_zhuangjiaguize = -1;
            let sign = 0;
            let huase = [];
            let daqiang = -1;
            let difen = -1;
            let guize=-1;
            let paixingfenshu=-1;
            if("sss_zz" == this.gameType){
                sign = 1;
                sss_zhuangjiaguize = this.GetIdxByKey('zhuangjiaguize');
            }
            else if("sss_dr" == this.gameType){
                sign = 2;
            }
            //打枪倍数
            daqiang = this.GetIdxByKey('daqiang');
            //底分
            difen = this.GetIdxByKey('difen');
            //限时
            guize = this.GetIdxByKey('guize');
            //牌型分数
            paixingfenshu = this.GetIdxByKey('paixingfenshu');
            let jiesan = this.GetIdxByKey('jiesan');
            let gaoji=[];
            for(let i=0;i<this.Toggles['gaoji'].length;i++){
                if(this.Toggles['gaoji'][i].getChildByName('checkmark').active){
                    gaoji.push(i);
                }
            }
            //自由扑克
            sendPack = {
                "playerMinNum":renshu[0],
                "playerNum":renshu[1],
                "sign": sign,
                "setCount": setCount,
                "paymentRoomCardType": isSpiltRoomCard,
                "kexuanwanfa": sss_kexuanwanfa,
                "fangjian": fangjian,
                "zhuangjiaguize": sss_zhuangjiaguize,
                "daqiang": daqiang,
                "difen": difen,
                "guize": guize,
                "jiesan": jiesan,
                "gaoji":gaoji,
                "paixingfenshu": paixingfenshu,
            };
        return sendPack;
    },
});

module.exports = sssChildCreateRoom;