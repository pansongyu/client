/*
创建房间子界面
 */
var app = require("app");

var aypdkChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
    //创建房间
    Click_btn_create:function(createType){
        this.FormManager.CloseForm("UIMessageTip");
        let isSpiltRoomCard = this.GetIdxByKey('fangfei');
        let renshu = [];
        if(isSpiltRoomCard){
            renshu = this.getCurSelectRenShu();
        }
        renshu = this.getCurSelectRenShu();//发给服务器人数用选的
        let needCostData = this.getCostData(renshu);
        if(!needCostData){
            this.ErrLog('Click_btn_create Not CostData');
            return null;
        }
        let hasRoomCard = app.HeroManager().GetHeroProperty("roomCard");

        let jushuIndex = this.GetIdxByKey('jushu');
        if(-1 == jushuIndex || jushuIndex >= needCostData.length){
            this.ErrLog('Click_btn_create error -1 == jushuIndex || jushuIndex >= needCostData.length');
            return null;
        }
        let costCoun = 0;
        if (isSpiltRoomCard == 0) {
            //房主付
            costCoun = needCostData[jushuIndex].CostCount;
        }else if (isSpiltRoomCard == 1) {
            //AA付
            costCoun = needCostData[jushuIndex].AaCostCount;
        }else if (isSpiltRoomCard == 2) {
            //大赢家付
            costCoun = needCostData[jushuIndex].WinCostCount;
        }
        // if(this.clubData==null){
        //     if(hasRoomCard < costCoun){//金币不足
        //         let desc = app.SysNotifyManager().GetSysMsgContentByMsgID("MSG_NotRoomCard");
        //         app.ConfirmManager().SetWaitForConfirmForm(this.OnConFirm.bind(this), "goBuyCard", []);
        //         app.FormManager().ShowForm("UIMessage", null, app.ShareDefine().ConfirmBuyGoTo, 0, 0, desc)
        //         return null;
        //     }
        // }
        let setCount = needCostData[jushuIndex].SetCount;
        let sendPack = this.CreateSendPack(renshu, setCount, isSpiltRoomCard);
        //把人数，局数，房费索引传给服务端用作修改房间显示当前配置用
        let jushu = this.GetIdxByKey('jushu');
        sendPack.jushu = jushu;
        let renshuIndex = this.GetIdxByKey('renshu');
        sendPack.renshu = renshuIndex;
        let fangfei = this.GetIdxByKey('fangfei');
        sendPack.fangfei = fangfei;
        //记录到本地缓存
        if (this.unionData == null || this.unionData.cfgData == null) {
            for(var item in sendPack) {
                let configData=sendPack[item];
                let dataType=typeof(configData);
                if(dataType=='object'){
                    let linshi2='0';
                    for(let i=0;i<configData.length;i++){
                        if(i==0){
                            linshi2=configData[0]+1;
                        }else{
                            linshi2=linshi2+','+(configData[i]+1);
                        }
                    }
                    configData=linshi2;
                }else{
                    if(item=='playerNum'){
                        item='renshu';
                    }else if(item=='setCount'){
                        item='jushu';
                    }else if(item=='paymentRoomCardType'){
                        item='fangfei';
                    }else if(item=='cardNum'){
                        item='shoupai';
                    }else if(item=='resultCalc'){
                        item='jiesuan';
                    }else if(item=='maxAddDouble'){
                        item='fengdingbeishu';
                    }
                    configData=this.GetIdxByKey(item)+1;
                }
                let clubId = 0;
                let roomKey = '0';
                let unionId = 0;
                let unionRoomKey = "0";
                if(this.clubData){
                    clubId = this.clubData.clubId;
                    roomKey = this.clubData.gameIndex;
                }
                if (this.unionData) {
                    unionId = this.unionData.unionId;
                    unionRoomKey = this.unionData.roomKey;
                }
                if(item =='kexuanwanfa'){
                    let configData2=[];
                    for(let i=0;i<this.Toggles['kexuanwanfa'].length;i++){
                        let isCheck = this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active;
                        if(isCheck){
                            configData2.push(i+1);
                        }
                    }
                    //本地保存必须是字符串（真机上不支持别的类型）
                    let localStr='1';
                    for(let i=0;i<configData2.length;i++){
                        if(i == 0){
                            localStr = configData2[0].toString();
                        }else{
                            localStr = localStr + ',' + configData2[i];
                        }
                    }
                    this.SetLocalConfig(item,localStr,clubId,roomKey,unionId,unionRoomKey);
                }else{
                    this.SetLocalConfig(item,configData,clubId,roomKey,unionId,unionRoomKey);
                }
            }
        }
        

        if(1 == createType || 3 == createType){
            if(this.clubData){
                sendPack.clubId = this.clubData.clubId;
                sendPack.gameIndex = this.clubData.gameIndex;
                if(this.clubData!=null){
                    if(isSpiltRoomCard == 0){
                        this.clubWinnerPayConsume=0;
                    }else if(isSpiltRoomCard == 1){
                        let default1=this.Toggles['fangfei'][1].getChildByName('fangfeiNode').getChildByName('needNum').clubWinnerPayConsume;
                        let new1=parseInt(this.Toggles['fangfei'][1].getChildByName('editbox').getComponent(cc.EditBox).string);
                        if(new1>0 && new1>default1){
                            this.clubWinnerPayConsume=new1;
                        }else{
                            this.clubWinnerPayConsume=default1;
                        }
                    }else if(isSpiltRoomCard == 2){
                        let default2=this.Toggles['fangfei'][2].getChildByName('fangfeiNode').getChildByName('needNum').clubWinnerPayConsume;
                        let new2=parseInt(this.Toggles['fangfei'][2].getChildByName('editbox').getComponent(cc.EditBox).string);
                        if(new2>0 && new2>default2){
                            this.clubWinnerPayConsume=new2;
                        }else{
                            this.clubWinnerPayConsume=default2;
                        }
                    }
                }else{
                    this.clubWinnerPayConsume=0;
                }
                sendPack.clubWinnerPayConsume=this.clubWinnerPayConsume;
                if(this.clubWinnerPayConsume>0){
                    sendPack.clubCostType=1;
                }else{
                    sendPack.clubCostType=0;
                }
                createType = 3;
            }
        }
        sendPack.createType=createType;
        let realGameType = this.gameType
        let gameId = app.ShareDefine().GametTypeNameDict[realGameType.toUpperCase()];
        sendPack.gameType = gameId;
        app.Client.SetGameType(realGameType);
        this.LocalDataManager.SetConfigProperty("SysSetting", "LastGameType",this.gameType);
        if (this.unionData) {
            let tempObj = {
                "realGameType":realGameType,
                "sendPack":sendPack
            }
            return tempObj;
        }else{
            app.Client.CreateRoomCheckSubGame(realGameType, sendPack);
        }
        
    },
    //需要自己重写
    CreateSendPack:function(renshu, setCount, isSpiltRoomCard){
        let sendPack = {};
        let kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        let fangjian = this.GetIdxsByKey('fangjian');
        let xianShi = this.GetIdxByKey('xianShi');
        let jiesan = this.GetIdxByKey('jiesan');
        let gaoji = this.GetIdxsByKey('gaoji');


        let sanren = this.GetIdxByKey('sanren');

        if(renshu[1]!=3){
            sanren=-1;
        }


        let fengDing = this.GetIdxByKey('fengDing');
        let zhadan = this.GetIdxByKey('zhadan');
        let zhadansuanfen = this.GetIdxByKey('zhadansuanfen');
        if(zhadan==1){
            zhadansuanfen=-1;
        }
        let ruanying = this.GetIdxByKey('ruanying');

        sendPack = {
            "sanren": sanren,
            "fengDing":fengDing,
            "zhadan":zhadan,
            "zhadansuanfen":zhadansuanfen,
            "ruanying":ruanying,

            "kexuanwanfa": kexuanwanfa,
            "fangjian": fangjian,
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
            this.UpdateTogglesLabel(toggles,false);
            return;
        }
        else if('kexuanwanfa' == key){
            // //每局先出黑桃3和首局先出黑桃3不能同时选择
            // if(this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active && toggleIndex == 1){
            //     this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active = false;
            //     this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
            // }
            // else if(this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active && toggleIndex == 0){
            //     this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active = false;
            //     this.UpdateLabelColor(this.Toggles['kexuanwanfa'][1].parent);
            // }
            // //每局先出黑桃3和首局先出黑桃3必须选择一项
            // if(this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active && toggleIndex == 0){
            //     return;
            // }
            // if(this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active && toggleIndex == 1){
            //     return;
            // }
        }
        else if('chupai' == key){
            if(2 == toggleIndex){
                //随机出牌去掉黑桃三必出
                this.ClearToggleCheck(this.Toggles['heitaosanbichu'],[1]);
                this.UpdateLabelColor(this.Toggles['heitaosanbichu'][1].parent);
            }
        }else if('heitaosanbichu' == key){
            if(this.Toggles['chupai'][2].getChildByName('checkmark').active==true && toggleIndex==0){
                 app.SysNotifyManager().ShowSysMsg("每局随机出牌黑桃3不必出",[],3);
                return;
            }
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
        this.UpdateOnClickToggle();
    },
    UpdateOnClickToggle:function(){
        if (this.Toggles["zhadan"] && this.Toggles["zhadansuanfen"]) {
            this.Toggles["zhadansuanfen"][0].parent.active=this.Toggles["zhadan"][0].getChildByName("checkmark").active;
        }

        if(this.Toggles["sanren"]){
            this.Toggles["sanren"][0].parent.active=this.Toggles["renshu"][1].getChildByName("checkmark").active;
        }
    },
});

module.exports = aypdkChildCreateRoom;