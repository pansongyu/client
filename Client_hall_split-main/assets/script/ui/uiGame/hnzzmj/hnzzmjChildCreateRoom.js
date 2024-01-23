/*
创建房间子界面
 */
var app = require("app");

var hnzzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
    //需要自己重写
    CreateSendPack:function(renshu, setCount, isSpiltRoomCard){
        let sendPack = {};
            let xianShi = this.GetIdxByKey('xianShi');
            let jiesan = this.GetIdxByKey('jiesan');
            let hufa = this.GetIdxByKey('hufa');
            let pao = this.GetIdxByKey("pao");
            let gudingpao = this.GetIdxByKey("gudingpao");
            let fangjian=[];
            let fengDing = this.GetIdxByKey('fengDing');
            let huPai = this.GetIdxByKey('huPai');
            let kexuanwanfa=[];
            let gaoji=[];
            for(let i=0;i<this.Toggles['fangjian'].length;i++){
                if(this.Toggles['fangjian'][i].getChildByName('checkmark').active){
                    fangjian.push(i);
                }
            }
            for(let i=0;i<this.Toggles['kexuanwanfa'].length;i++){
                if(this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active){
                    kexuanwanfa.push(i);
                }
            }
            for(let i=0;i<this.Toggles['gaoji'].length;i++){
                if(this.Toggles['gaoji'][i].getChildByName('checkmark').active){
                    gaoji.push(i);
                }
            }
            sendPack = {
                        "xianShi":xianShi,
                        "jiesan":jiesan,
                        "hufa":hufa,
                        "pao":pao,
                        "gudingpao":gudingpao,
                        "fangjian":fangjian,
                        "fengDing": fengDing,
                        "huPai": huPai,
                        //房间默认配置（人数局数支付）
                        "playerMinNum":renshu[0],
                        "playerNum":renshu[1],
                        "setCount":setCount,
                        "paymentRoomCardType":isSpiltRoomCard,
                        "gaoji":gaoji,
                        "kexuanwanfa":kexuanwanfa,
                        
            };
        return sendPack;
    },
    OnToggleClick:function(event){
        this.FormManager.CloseForm(app.subGameName + "_UIMessageTip");
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
            this.UpdateTogglesLabel(toggles);
            return;
        }
        else if('pao' == key){
            if(toggleIndex <2){
                this.ClearToggleCheck(this.Toggles['gudingpao'],[]);
                this.UpdateLabelColor(this.Toggles['gudingpao'][0].parent);
            }else{
                this.ClearToggleCheck(this.Toggles['gudingpao'],[1]);
                this.UpdateLabelColor(this.Toggles['gudingpao'][1].parent);
            }

        }
        else if('gudingpao' == key){
            if(this.Toggles['pao'][2].getChildByName('checkmark').active==false){
                app.SysNotifyManager().ShowSysMsg("固定跑玩法才能选", [], 3);
                return;
            }

        }
        else if('kexuanwanfa' == key){
            // if(toggleIndex <2){
            //    this.ClearToggleCheck(this.Toggles['fengding'],[1]);
            //    this.UpdateLabelColor(this.Toggles['fengding'][1].parent);
            // }
        }else if('fengding' == key){
            // if(toggleIndex==0){
            //    if(this.Toggles['kexuanwanfa'][2].getChildByName('checkmark').active ==false){
            //         this.ShowSysMsg('梓埠清混才能选择封顶');
            //         return;
            //    }
            // }
        }
        else{

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
});

module.exports = hnzzmjChildCreateRoom;