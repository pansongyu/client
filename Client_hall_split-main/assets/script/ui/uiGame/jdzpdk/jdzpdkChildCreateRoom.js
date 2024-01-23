/*
创建房间子界面
 */
var app = require("app");

var pypdkChildCreateRoom = cc.Class({
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
        let shoupai = this.GetIdxByKey('shoupai');
        let zhadansuanfa = this.GetIdxByKey('zhadansuanfa');
        let xianShi = this.GetIdxByKey('xianShi');
        let jiesan = this.GetIdxByKey('jiesan');
        let kexuanwanfa = [];
        let fangjian = [];
        kexuanwanfa.push(4); //固定3A炸
        kexuanwanfa.push(14);//固定3带1
        kexuanwanfa.push(15);//固定3带2
        kexuanwanfa.push(18);//固定4带3
        
        for (let i = 0; i < this.Toggles['kexuanwanfa'].length; i++) {
            let isCheck = this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active;
            if (isCheck) {
                if (this.Toggles['kexuanwanfa'][i].serverIdx) {
                    kexuanwanfa.push(this.Toggles['kexuanwanfa'][i].serverIdx);
                }else {
                    kexuanwanfa.push(i);
                }
            }
        }
        for(let i=0;i<this.Toggles['fangjian'].length;i++){
            if(this.Toggles['fangjian'][i].getChildByName('checkmark').active){
                fangjian.push(i);
            }
        }
        sendPack = {
            "playerMinNum":renshu[0],
            "playerNum":renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,
            "shoupai":shoupai,//跑得快牌型     0-15张牌  1-16张牌
            "zhadansuanfa":zhadansuanfa,
            "jiesan":jiesan,
            "xianShi":xianShi,
            "kexuanwanfa":kexuanwanfa,
            "fangjian":fangjian,
        };
        //通用高级
        let gaoji = [];
        for (let i = 0; i < this.Toggles['gaoji'].length; i++) {
            if (this.Toggles['gaoji'][i].getChildByName('checkmark').active) {
                gaoji.push(i);
            }
        }
        sendPack.gaoji = gaoji;
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
    UpdateTogglesLabel:function (TogglesNode, isResetPos=true) {
        let curKey = TogglesNode.name.substring(('Toggles_').length,TogglesNode.name.length);
        let reg = /\/s/g;
        for(let key in this.gameCreateConfig){
            if(this.gameType == this.gameCreateConfig[key].GameName){
                if(curKey == this.gameCreateConfig[key].Key){
                    let AAfangfeiDatas = [];
                    let WinfangfeiDatas = [];
                    let FangZhufangfeiDatas = [];
                    let clubGuanLiFangFeiDatas=[];
                    let clubWinFangFeiDatas=[];
                    let clubAAFangFeiDatas=[];
                    let unionGuanliFangFeiDatas=[];
                    let title = this.gameCreateConfig[key].Title.replace(reg, ' ');
                    TogglesNode.getChildByName('title').getComponent(cc.Label).string = title;
                    let descList = [];
                    if('jushu' != curKey){//局数读roomcost
                        descList = this.gameCreateConfig[key].ToggleDesc.split(',');
                        if(this.clubData && 'fangfei' == curKey){
                            descList = ['管理付'];
                        }else if(this.unionData && 'fangfei' == curKey){
                            descList = ['盟主付'];
                        }
                        if(descList.length != TogglesNode.children.length -2){//减去标题和帮助按钮
                            this.ErrLog('gameCreate config ToggleDesc and Toggle count error');
                            break;
                        }
                    }
                    let jushuIndex = -1;
                    let renshuIndex = -1;
                    let renshu = [];//0表示读房主支付配置
                    if('renshu' == curKey || 'fangfei' == curKey || 'jushu' == curKey){
                        
                        let publicCosts = this.getCostData(renshu);

                        if(this.Toggles['renshu'])
                            renshu = this.getCurSelectRenShu();

                        let SpiltCosts = this.getCostData(renshu);
                        let curCostData = null;
                        if(0 == renshu.length){
                            curCostData = publicCosts;
                        }
                        else{
                            curCostData = SpiltCosts;
                        }
                        if(this.Toggles['jushu']){
                            jushuIndex = 0;
                            for(let i=0;i<this.Toggles['jushu'].length;i++){
                                let mark = this.Toggles['jushu'][i].getChildByName('checkmark').active;
                                if(mark){
                                    jushuIndex = i;
                                    break;
                                }
                                jushuIndex++;
                            }
                            for(let i=0; i<curCostData.length; i++){
                                this.Toggles['jushu'][i].getChildByName('label').getComponent(cc.Label).string = curCostData[i].SetCount + '局';
                            }
                        }
                        if(this.Toggles['fangfei'] && -1 != jushuIndex){
                            if(jushuIndex < publicCosts.length){
                                AAfangfeiDatas.push(publicCosts[jushuIndex].AaCostCount);
                                WinfangfeiDatas.push(publicCosts[jushuIndex].WinCostCount);
                                FangZhufangfeiDatas.push(publicCosts[jushuIndex].CostCount);

                                clubGuanLiFangFeiDatas.push(publicCosts[jushuIndex].ClubCostCount);
                                clubWinFangFeiDatas.push(publicCosts[jushuIndex].ClubWinCostCount);
                                clubAAFangFeiDatas.push(publicCosts[jushuIndex].ClubAaCostCount);
                                //赛事房费
                                unionGuanliFangFeiDatas.push(publicCosts[jushuIndex].UnionCostCount);
                            }
                            if(jushuIndex < SpiltCosts.length){
                                AAfangfeiDatas.push(SpiltCosts[jushuIndex].AaCostCount);
                                WinfangfeiDatas.push(SpiltCosts[jushuIndex].WinCostCount);
                                FangZhufangfeiDatas.push(SpiltCosts[jushuIndex].CostCount);

                                clubGuanLiFangFeiDatas.push(SpiltCosts[jushuIndex].ClubCostCount);
                                clubWinFangFeiDatas.push(SpiltCosts[jushuIndex].ClubWinCostCount);
                                clubAAFangFeiDatas.push(SpiltCosts[jushuIndex].ClubAaCostCount);
                                //赛事房费
                                unionGuanliFangFeiDatas.push(SpiltCosts[jushuIndex].UnionCostCount);
                            }
                        }
                    }
                    if('jushu' != curKey){
                        let descInde = 0;
                        for(let i=0;i<TogglesNode.children.length;i++){
                            if(TogglesNode.children[i].name.startsWith('Toggle')){
                                TogglesNode.children[i].getChildByName('label').getComponent(cc.Label).string = descList[descInde];
                                descInde++;
                            }
                        }
                    }
                    if("kexuanwanfa" == curKey){
                        this.Toggles['kexuanwanfa'][3].serverIdx = 11;
                        this.Toggles['kexuanwanfa'][4].serverIdx = 22;
                        this.Toggles['kexuanwanfa'][5].serverIdx = 23;
                        this.Toggles['kexuanwanfa'][6].serverIdx = 24;
                        this.Toggles['kexuanwanfa'][7].serverIdx = 25;
                        this.Toggles['kexuanwanfa'][8].serverIdx = 26;
                        this.Toggles['kexuanwanfa'][9].serverIdx = 27;
                    }

                    if(0 != AAfangfeiDatas.length){
                        let needCount = AAfangfeiDatas[AAfangfeiDatas.length - 1];
                        let ffNodes = this.Toggles['fangfei'];
                        let hasHideNode = false;
                        let spacing = this.gameCreateConfig[key].Spacing.toString().split(',');
                        for(let s=0;s<ffNodes.length;s++){
                            let needNode = ffNodes[s].getChildByName('fangfeiNode');
                            needNode.active = true;
                            if (hasHideNode && !needNode.parent.isFirstNode && isResetPos) {
                                needNode.parent.x = needNode.parent.x - spacing[s] - 80;
                                hasHideNode = false;
                            }
                            //如果房费配的是0，则隐藏
                            if (needCount <= 0 && 1 == s) {
                                needNode.parent.active = false;
                                hasHideNode = true;
                                continue;
                            }
                            let disCost = -1;
                            if(this.clubData==null && this.unionData == null){
                                if(0 == s){
                                    if (this.disCount == -1) {
                                        needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + FangZhufangfeiDatas[FangZhufangfeiDatas.length - 1];
                                    }else{
                                       disCost = Math.ceil(this.disCount * FangZhufangfeiDatas[FangZhufangfeiDatas.length - 1]);
                                        if (disCost == 0) {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
                                        }else{
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
                                        } 
                                    }
                                }
                                else if(1 == s){
                                    if (this.disCount == -1) {
                                        needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + AAfangfeiDatas[AAfangfeiDatas.length - 1];
                                    }else{
                                       disCost = Math.ceil(this.disCount * AAfangfeiDatas[AAfangfeiDatas.length - 1]);
                                        if (disCost == 0) {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
                                        }else{
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
                                        } 
                                    }
                                }
                                else{
                                    if (this.disCount == -1) {
                                        needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + WinfangfeiDatas[WinfangfeiDatas.length - 1];
                                    }else{
                                       disCost = Math.ceil(this.disCount * WinfangfeiDatas[WinfangfeiDatas.length - 1]);
                                        if (disCost == 0) {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
                                        }else{
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
                                        } 
                                    }
                                }
                            }else if (this.clubData==null && this.unionData != null){
                                if(0 == s){
                                    if (this.disCount == -1) {
                                        needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + unionGuanliFangFeiDatas[unionGuanliFangFeiDatas.length - 1];
                                    }else{
                                       disCost = Math.ceil(this.disCount * unionGuanliFangFeiDatas[unionGuanliFangFeiDatas.length - 1]);
                                        if (disCost == 0) {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
                                        }else{
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
                                        } 
                                    }
                                }
                            }else{
                                if(0 == s){
                                    if (this.disCount == -1) {
                                        needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + clubGuanLiFangFeiDatas[clubGuanLiFangFeiDatas.length - 1];
                                    }else{
                                       disCost = Math.ceil(this.disCount * clubGuanLiFangFeiDatas[clubGuanLiFangFeiDatas.length - 1]);
                                        if (disCost == 0) {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
                                        }else{
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
                                        } 
                                    }
                                }
                                // else if(1==s){
                                //     needNode.getChildByName('icon').active=false;
                                //     needNode.getChildByName('icon_qk').active=true;
                                //     needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + clubAAFangFeiDatas[clubAAFangFeiDatas.length - 1];
                                //     needNode.getChildByName('needNum').clubWinnerPayConsume = clubAAFangFeiDatas[clubAAFangFeiDatas.length - 1];
                                //     ffNodes[s].getChildByName('editbox').active=false;
                                // }else{
                                //     needNode.getChildByName('icon').active=false;
                                //     needNode.getChildByName('icon_qk').active=true;
                                //     needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + clubWinFangFeiDatas[clubWinFangFeiDatas.length - 1];
                                //     needNode.getChildByName('needNum').clubWinnerPayConsume = clubWinFangFeiDatas[clubWinFangFeiDatas.length - 1];
                                //     ffNodes[s].getChildByName('editbox').active=false;
                                // }
                            } 
                        }
                    }
                }
            }
        }
        if (this.Toggles["gaoji"]) {
            for (let i = 0; i < this.Toggles["gaoji"].length; i++) {
                let ToggleDesc = this.Toggles["gaoji"][i].getChildByName("label").getComponent(cc.Label).string;
                if(ToggleDesc == "30秒未准备自动踢出房间"){
                    if(!this.clubData && !this.unionData){
                        this.Toggles["gaoji"][i].active = false;
                        this.Toggles["gaoji"][i].getChildByName("checkmark").active = false;//隐藏高级30秒被踢，ps：注释防止缓存
                        break;
                    }else{
                        this.Toggles["gaoji"][i].active = true;
                        //this.Toggles["gaoji"][i].getChildByName("checkmark").active = true;//隐藏高级30秒被踢，ps：注释防止缓存
                        break;
                    }
                    
                }
            }
        }
    },
    RefreshAllToggles:function(gameType){
        this.gameType = gameType;
        this.Toggles = {};
        this.scroll_Right.stopAutoScroll();
        //this.node_RightLayout.removeAllChildren();
        this.DestroyAllChildren(this.node_RightLayout);
        let isHideZhadanfenshu = false;

        let helpIndex = 1;//01是总帮助
        for(let key in this.gameCreateConfig){
            if(this.gameType == this.gameCreateConfig[key].GameName){
                let node = null;
                let dataKey = this.gameCreateConfig[key].Key;
                let toggleCount = this.gameCreateConfig[key].ToggleCount;
                let AtRows = this.gameCreateConfig[key].AtRow.toString().split(',');
                let spacing = this.gameCreateConfig[key].Spacing.toString().split(',');
                if(this.clubData && 'fangfei' == dataKey){
                    toggleCount = 1;  //一个管理付，一个大赢家付
                    AtRows=[1];
                }else if(this.unionData && 'fangfei' == dataKey){
                    toggleCount = 1;  //一个盟主付`
                    AtRows=[1];
                }
                node = cc.instantiate(this.prefab_Toggles);
                node.active = true;
                //需要判断添更加多的Toggle
                let addCount = toggleCount - 1;
                if(addCount < 0)
                    this.ErrLog('gameCreate Config ToggleCount error');
                else{
                    for(let i=2;i<=toggleCount;i++){
                        let prefabNode = node.getChildByName('Toggle1');
                        let newNode = cc.instantiate(prefabNode);
                        newNode.name = 'Toggle' + i;
                        node.addChild(newNode);
                    }
                }
                
                node.name = 'Toggles_' + dataKey;
                node.x = 10;
                let nodeHelp = node.getChildByName('btn_help');
                nodeHelp.active = false;
                if(this.gameCreateConfig[key].IsShowHelp){
                    nodeHelp.name = 'btn_help0' + helpIndex;
                    nodeHelp.on('click',this.OnHelpBtnClick,this);
                    nodeHelp.active = true;
                    helpIndex++;
                }


                if(!this.Toggles[dataKey])
                    this.Toggles[dataKey] = [];

                let fristPos = {x:0,y:0};
                let lastPos = {x:0,y:0};
                for(let i=1; i<=toggleCount; i++){
                    let curNode = node.getChildByName('Toggle' + i);
                    curNode.isFirstNode = false;
                    if(curNode){
                        //位置宽高设置下
                        //记录下第一个的位置方便换行
                        if(1 == i){
                            fristPos.x = curNode.x;
                            fristPos.y = curNode.y;
                            lastPos.x = curNode.x;
                            lastPos.y = curNode.y;
                            curNode.isFirstNode = true;
                        }
                        else if(1 < i){//第1个以后都是新增的
                            if(AtRows[i-2] != AtRows[i-1]){
                                curNode.x = fristPos.x;
                                curNode.y = lastPos.y - curNode.height - this.rightPrefabSpacing;
                                node.height = node.height + curNode.height + this.rightPrefabSpacing;
                                curNode.isFirstNode = true;
                            }
                            else{
                                // if ('fangfei' == dataKey) {
                                //     //房费节点比较长，需要再位移一点
                                //     curNode.x = lastPos.x + this.addPrefabWidth + 80;
                                // }else{
                                //     curNode.x = lastPos.x + this.addPrefabWidth;
                                // }
                                curNode.x = lastPos.x + parseInt(spacing[i-1]);
                                curNode.y = lastPos.y;
                            }
                        }
                        lastPos.x = curNode.x;
                        lastPos.y = curNode.y;
                        
                        curNode.on(cc.Node.EventType.TOUCH_START,this.OnToggleClick,this);
                        let checkNode = curNode.getChildByName('checkmark');
                        //默认不勾选
                        checkNode.active = false;
                        let icon_selectBg = curNode.getChildByName('icon_selectBg');
                        let showList = this.gameCreateConfig[key].ShowIndexs.toString().split(',');
                        //尝试获取缓存
                        let clubId = 0;
                        let roomKey = '0';
                        let unionId = 0;
                        let unionRoomKey = '0';
                        let linshi = null;
                        if(this.clubData){
                            clubId = this.clubData.clubId;
                            roomKey = this.clubData.gameIndex;
                            linshi = this.GetLocalConfig(this.gameCreateConfig[key].Key,clubId,roomKey,unionId,unionRoomKey);
                        }
                        //如果cfg没有的话，就是新建房间，才读本地
                        if(this.unionData != null && this.unionData.cfgData == null){
                            clubId = this.unionData.clubId;
                            unionId = this.unionData.unionId;
                            unionRoomKey = this.unionData.roomKey;
                            linshi = this.GetLocalConfig(this.gameCreateConfig[key].Key,clubId,roomKey,unionId,unionRoomKey);
                        }
                        //如果cfg没有的话，就是新建房间，才读本地
                        if(this.unionData == null || this.unionData.cfgData == null){
                            //第一次创建俱乐部房间没有roomKey为0
                            if(!linshi)
                                linshi = this.GetLocalConfig(this.gameCreateConfig[key].Key,clubId,'0',unionId,unionRoomKey);
                            if(linshi){
                                let linshiList = linshi.split(',');
                                for(let j=0;j<linshiList.length;j++){//缓存可能出BUG(配置删除了按钮数量)
                                    if(parseInt(linshiList[j]) > toggleCount){
                                        linshiList = ['1'];
                                        break;
                                    }
                                }
                                showList=linshiList;
                            }
                        }else{
                            let cfgDataList = this.unionData.cfgData.bRoomConfigure[dataKey];
                            if(typeof(cfgDataList) == "object"){
                                showList=[];
                                for(let j=0;j<cfgDataList.length;j++){
                                    //索引要加1
                                    let realIndex = cfgDataList[j] + 1;
                                    showList.push(realIndex);
                                }
                            }else if(typeof(cfgDataList) == "number"){
                                //单选，就一个数字，加入数组
                                let showListTemp = [];
                                //索引要加1
                                showListTemp.push(cfgDataList + 1);
                                showList=showListTemp;
                            }
                        }
                        
                        if(this.clubData && 'fangfei' == dataKey)
                            showList = [1];
                        if(this.unionData && 'fangfei' == dataKey)
                            showList = [1];
                        
                        //尝试获取缓存
                        if(0 == this.gameCreateConfig[key].ToggleType && 1 != showList.length)
                            this.ErrLog('gameCreate Config ToggleType and ShowIndexs error');

                        if(1 == this.gameCreateConfig[key].ToggleType){//多选的图片设置下(不放上面是因为路径)
                            let imgPath = 'texture/ui/createRoom/icon_checkin02';
                            node.addComponent(cc.Toggle);
                            this.SetNodeImageByFilePath(checkNode,imgPath);
                            this.SetNodeImageByFilePath(icon_selectBg, 'texture/ui/createRoom/icon_check02');
                        }

                        for(let j=0;j<showList.length;j++){
                            let count = 0;
                            //判断是否亲友圈
                            if(this.unionData == null || this.unionData.cfgData == null){
                                count = parseInt(showList[j]);
                            }else{
                                count = this.serverIdxToIndex(parseInt(showList[j]));
                            }
                            // let count = parseInt(showList[j]);
                            if(i == count){
                                checkNode.active = true;
                                break;
                            }
                            else{
                                checkNode.active = false;
                            }
                        }
                        this.Toggles[dataKey].push(curNode);
                    }
                }
                this.UpdateTogglesLabel(node);
                this.UpdateLabelColor(node);
                this.node_RightLayout.addChild(node);
                let line=this.scroll_Right.node.getChildByName('line');
                let addline=cc.instantiate(line);
                addline.active=true;
                this.node_RightLayout.addChild(addline);
            }
        }
        this.setHelpBtnPos();
        this.scroll_Right.scrollToTop();
        //如果可以滚动，显示滚动提示节点
        if (this.node_RightLayout.height > this.scroll_Right.node.height) {
            this.scrollTip.active = true;
        }else{
            this.scrollTip.active = false;
        }
    },
    serverIdxToIndex:function(count){
        if(count == 12){
            count = 4;
        }else if(count == 23){
            count = 5;
        }else if(count == 24){
            count = 6;
        }else if(count == 25){
            count = 7;
        }else if(count == 26){
            count = 8;
        }else if(count == 27){
            count = 9;
        }else if(count == 28){
            count = 10;
        }
        return count;
    },
});

module.exports = pypdkChildCreateRoom;