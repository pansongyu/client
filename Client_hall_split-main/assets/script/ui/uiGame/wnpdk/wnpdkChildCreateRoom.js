/*
创建房间子界面
 */
var app = require("app");

var ddzChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
    //需要自己重写
    CreateSendPack:function(renshu, setCount, isSpiltRoomCard){
        let sendPack = {};
        let shoupai = this.GetIdxByKey('shoupai');
        let jiesuan = this.GetIdxByKey('jiesuan');
        let xianShi = this.GetIdxByKey('xianShi');
        let wnpdk_jiesan = this.GetIdxByKey('jiesan');
        let kexuanwanfa = [];
        let maxAddDouble = 0;
        let zhadansuanfa = 0;
        let zhadanfenshu = 0;
        for(let i=0;i<this.Toggles['kexuanwanfa'].length;i++){
            let isCheck = this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active;
            if(isCheck){
                if(this.Toggles['kexuanwanfa'][i].serverIdx){
                    kexuanwanfa.push(this.Toggles['kexuanwanfa'][i].serverIdx);
                }
                else{
                    kexuanwanfa.push(i);
                }
            }
        }
        let wnpdk_gaoji=[];
        for(let i=0;i<this.Toggles['gaoji'].length;i++){
            if(this.Toggles['gaoji'][i].getChildByName('checkmark').active){
                wnpdk_gaoji.push(i);
            }
        }
        sendPack = {
            "playerMinNum":renshu[0],
            "playerNum":renshu[1],
            "setCount":setCount,
            "gaoji":wnpdk_gaoji,
            "jiesan":wnpdk_jiesan,
            "xianShi":xianShi,
            "paymentRoomCardType":isSpiltRoomCard,
            "shoupai":shoupai,//跑得快牌型     0-15张牌  1-16张牌
            "resultCalc":jiesuan,
            "kexuanwanfa":kexuanwanfa,
            "zhadansuanfa":zhadansuanfa,
            "zhadanfenshu":zhadanfenshu,
            "score":0,
            "maxAddDouble":maxAddDouble,
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
            //每局先出黑桃3和首局先出黑桃3不能同时选择
            if(this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active && toggleIndex == 1){
                this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
            }
            else if(this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active && toggleIndex == 0){
                this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['kexuanwanfa'][1].parent);
            }
            //每局先出黑桃3和首局先出黑桃3必须选择一项
            if(this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active && toggleIndex == 0){
                return;
            }
            if(this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active && toggleIndex == 1){
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
});

module.exports = ddzChildCreateRoom;