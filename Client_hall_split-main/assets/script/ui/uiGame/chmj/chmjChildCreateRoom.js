/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

    properties: {},
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
        let sign = this.GetIdxByKey('sign');    // 模式
        needCostData = this.getCostDataBySign(needCostData, sign+1)
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
                if(item =='kexuanwanfa' && "pdk_lyfj" ==  this.gameType){
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
        if (this.gameType == "sss_zz" || this.gameType == "sss_dr") {
            realGameType = "sss";
        }
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
        
        // if(!cc.sys.isNative){
        //     let self = this;
        //     app.NetManager().SendPack("room.CBaseCreateRoom", sendPack, function(event){
        //         app.SysNotifyManager().ShowSysMsg("创建房间成功",[],3);
        //     }, function(event){
        //         app.SysNotifyManager().ShowSysMsg("创建房间失败",[],3);
        //     });
        // }
        
    },

    getCostDataBySign: function (needCostData, sign) {
        let newNeedCostData = [];
        for (let idx = 0; idx < needCostData.length; idx++) {
            const data = needCostData[idx];
            if(data.Sign == sign){
                newNeedCostData.push(data);
            }            
        }
        return newNeedCostData;
    },
	//需要自己重写
	CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
		let sendPack = {};
        let jiesan = this.GetIdxByKey('jiesan');
        let xianShi = this.GetIdxByKey('xianShi');
        let piaozi = this.GetIdxByKey('piaozi');  // 漂子
        let sign = this.GetIdxByKey('sign');    // 模式

        let fangjian=[];
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
                    "playerMinNum":renshu[0],
                    "playerNum":renshu[1],
                    "setCount":setCount,
                    "paymentRoomCardType":isSpiltRoomCard,
                    "fangjian":fangjian,
                    "gaoji":gaoji,
                    "kexuanwanfa":kexuanwanfa,
                    "piaozi":piaozi,
                    "sign":sign+1,      
                    // "xianShi":xianShi,
                    // "beishu": beishu,
                    // "jiesan":jiesan,
                    // "playerMinNum":renshu[0],
                    // "playerNum":renshu[1],
                    // "setCount":setCount,
                    // "paymentRoomCardType":isSpiltRoomCard,
                    // "fangjian":fangjian,
                    // "gaoji":gaoji,
                    // "kexuanwanfa":kexuanwanfa,
                    // "wanfa":isAutoZiMo,
        };
        console.error(sendPack)
		return sendPack;
    },

    getDefaultSign:function () {
        //尝试获取缓存
        let clubId = 0;
        let roomKey = '0';
        let unionId = 0;
        let unionRoomKey = '0';
        let sign = null;
        if(this.clubData){
            clubId = this.clubData.clubId;
            roomKey = this.clubData.gameIndex;
            sign = this.GetLocalConfig("sign",roomKey,unionId,unionRoomKey);
        }
        //第一次创建俱乐部房间没有roomKey为0
        if(!sign)
            sign = this.GetLocalConfig("sign",clubId,roomKey,unionId,unionRoomKey);

        if(!!sign && typeof(sign) != "undefined"){
            return sign;
        }

        for (const keyFlag in this.gameCreateConfig) {
            if (this.gameCreateConfig.hasOwnProperty(keyFlag)) {
                const data = this.gameCreateConfig[keyFlag];
                if("sign" == data["Key"]) {
                    return data["ShowIndexs"];  // "1", "2" -> "锅子,局数"
                }
            }
        }
    },
    UpdateTogglesLabel: function (TogglesNode, isRefreshJushu = true) {
        let curKey = TogglesNode.name.substring(('Toggles_').length, TogglesNode.name.length);
        let reg = /\/s/g;
        let defaultSign = this.getDefaultSign(); // "1", "2" -> "锅子,局数"
        for (let key in this.gameCreateConfig) {
            if (this.gameType == this.gameCreateConfig[key].GameName) {
                if (curKey == this.gameCreateConfig[key].Key) {
                    let AAfangfeiDatas = [];
                    let WinfangfeiDatas = [];
                    let FangZhufangfeiDatas = [];
                    let clubGuanLiFangFeiDatas = [];
                    let clubWinFangFeiDatas = [];
                    let clubAAFangFeiDatas = [];
                    let unionGuanliFangFeiDatas = [];
                    let title = this.gameCreateConfig[key].Title.replace(reg, ' ');
                    TogglesNode.getChildByName('title').getComponent(cc.Label).string = title;
                    let descList = [];
                    if ('jushu' != curKey) {//局数读roomcost
                        descList = this.gameCreateConfig[key].ToggleDesc.split(',');
                        if (this.clubData && 'fangfei' == curKey) {
                            descList = ['管理付'];
                        } else if (this.unionData && 'fangfei' == curKey) {
                            descList = ['盟主付'];
                        }
                        if (descList.length != TogglesNode.children.length - 2) {//减去标题和帮助按钮
                            this.ErrLog('gameCreate config ToggleDesc and Toggle count error');
                            break;
                        }
                    }
                    let jushuIndex = -1;
                    let renshuIndex = -1;
                    let renshu = [];//0表示读房主支付配置
                    if ('renshu' == curKey || 'fangfei' == curKey || 'jushu' == curKey) {

                        let publicCosts = this.getCostData(renshu);
                        let sign = this.GetIdxByKey('sign');    // 模式
                        // publicCosts = this.getCostDataBySign(publicCosts, sign+1)

                        if (this.Toggles['renshu'])
                            renshu = this.getCurSelectRenShu();

                        let SpiltCosts = this.getCostData(renshu);
                        // SpiltCosts = this.getCostDataBySign(SpiltCosts, sign+1)
                        let curCostData = null;
                        if (0 == renshu.length) {
                            curCostData = publicCosts;
                        }
                        else {
                            curCostData = SpiltCosts;
                        }
                        if (this.Toggles['jushu']) {
                            this.curCostData = curCostData;
                            jushuIndex = 0;
                            for (let i = 0; i < this.Toggles['jushu'].length; i++) {
                                let mark = this.Toggles['jushu'][i].getChildByName('checkmark').active;
                                if (mark) {
                                    jushuIndex = i;
                                    break;
                                }
                                jushuIndex++;
                            }
                            if (isRefreshJushu == true) {
                                let idx = 0;
                                for (let i = 0; i < curCostData.length; i++) {
                                    this.curCostData = curCostData;
                                    if (curCostData[i].Sign == defaultSign) {
                                        let signStr = defaultSign == 1 ? "锅" : "局";
                                        this.Toggles['jushu'][idx].getChildByName('label').getComponent(cc.Label).string = this.curCostData[i].SetCount + signStr;
                                        idx++;
                                    }
                                }
                            }
                        }
                        if (this.Toggles['fangfei'] && -1 != jushuIndex) {
                            if (jushuIndex < publicCosts.length) {
                                AAfangfeiDatas.push(publicCosts[jushuIndex].AaCostCount);
                                WinfangfeiDatas.push(publicCosts[jushuIndex].WinCostCount);
                                FangZhufangfeiDatas.push(publicCosts[jushuIndex].CostCount);

                                clubGuanLiFangFeiDatas.push(publicCosts[jushuIndex].ClubCostCount);
                                clubWinFangFeiDatas.push(publicCosts[jushuIndex].ClubWinCostCount);
                                clubAAFangFeiDatas.push(publicCosts[jushuIndex].ClubAaCostCount);
                                //赛事房费
                                unionGuanliFangFeiDatas.push(publicCosts[jushuIndex].UnionCostCount);
                            }
                            if (jushuIndex < SpiltCosts.length) {
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
                    if ('jushu' != curKey) {
                        let descInde = 0;
                        for (let i = 0; i < TogglesNode.children.length; i++) {
                            if (TogglesNode.children[i].name.startsWith('Toggle')) {
                                TogglesNode.children[i].getChildByName('label').getComponent(cc.Label).string = descList[descInde];
                                descInde++;
                            }
                        }
                    }

                    if (0 != AAfangfeiDatas.length) {
                        let needCount = AAfangfeiDatas[AAfangfeiDatas.length - 1];
                        let ffNodes = this.Toggles['fangfei'];
                        let hasHideNode = false;
                        let spacing = this.gameCreateConfig[key].Spacing.toString().split(',');
                        for (let s = 0; s < ffNodes.length; s++) {
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
                            if (this.clubData == null && this.unionData == null) {
                                if (0 == s) {
                                    if (this.disCount == -1) {
                                        needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + FangZhufangfeiDatas[FangZhufangfeiDatas.length - 1];
                                    } else {
                                        disCost = Math.ceil(this.disCount * FangZhufangfeiDatas[FangZhufangfeiDatas.length - 1]);
                                        if (disCost == 0) {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
                                        } else {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
                                        }
                                    }
                                }
                                else if (1 == s) {
                                    if (this.disCount == -1) {
                                        needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + AAfangfeiDatas[AAfangfeiDatas.length - 1];
                                    } else {
                                        disCost = Math.ceil(this.disCount * AAfangfeiDatas[AAfangfeiDatas.length - 1]);
                                        if (disCost == 0) {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
                                        } else {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
                                        }
                                    }
                                }
                                else {
                                    if (this.disCount == -1) {
                                        needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + WinfangfeiDatas[WinfangfeiDatas.length - 1];
                                    } else {
                                        disCost = Math.ceil(this.disCount * WinfangfeiDatas[WinfangfeiDatas.length - 1]);
                                        if (disCost == 0) {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
                                        } else {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
                                        }
                                    }
                                }
                            } else if (this.clubData == null && this.unionData != null) {
                                if (0 == s) {
                                    if (this.disCount == -1) {
                                        needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + unionGuanliFangFeiDatas[unionGuanliFangFeiDatas.length - 1];
                                    } else {
                                        disCost = Math.ceil(this.disCount * unionGuanliFangFeiDatas[unionGuanliFangFeiDatas.length - 1]);
                                        if (disCost == 0) {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
                                        } else {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
                                        }
                                    }
                                }
                            } else {
                                if (0 == s) {
                                    if (this.disCount == -1) {
                                        needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + clubGuanLiFangFeiDatas[clubGuanLiFangFeiDatas.length - 1];
                                    } else {
                                        disCost = Math.ceil(this.disCount * clubGuanLiFangFeiDatas[clubGuanLiFangFeiDatas.length - 1]);
                                        if (disCost == 0) {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
                                        } else {
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
                if (ToggleDesc == "30秒未准备自动踢出房间") {
                    if (!this.clubData && !this.unionData) {
                        this.Toggles["gaoji"][i].active = false;
                        this.Toggles["gaoji"][i].getChildByName("checkmark").active = false;//隐藏高级30秒被踢，ps：注释防止缓存
                        break;
                    } else {
                        this.Toggles["gaoji"][i].active = true;
                        //this.Toggles["gaoji"][i].getChildByName("checkmark").active = true;//隐藏高级30秒被踢，ps：注释防止缓存
                        break;
                    }
                }
            }
        } else if (this.Toggles["kexuanwanfa"]) {
            for (let i = 0; i < this.Toggles["kexuanwanfa"].length; i++) {
                let ToggleDesc = this.Toggles["kexuanwanfa"][i].getChildByName("label").getComponent(cc.Label).string;
                if (ToggleDesc == "比赛分不能低于0") {
                    if (!this.clubData && !this.unionData) {
                        this.Toggles["kexuanwanfa"][i].active = false;
                        this.Toggles["kexuanwanfa"][i].getChildByName("checkmark").active = false;//隐藏高级30秒被踢，ps：注释防止缓存
                        break;
                    } else {
                        this.Toggles["kexuanwanfa"][i].active = true;
                        //this.Toggles["gaoji"][i].getChildByName("checkmark").active = true;//隐藏高级30秒被踢，ps：注释防止缓存
                        break;
                    }
                }
            }
        }
    },
    // UpdateTogglesLabel:function (TogglesNode, isRefreshJushu = true) {
    //     let curKey = TogglesNode.name.substring(('Toggles_').length,TogglesNode.name.length);
    //     let reg = /\/s/g;
    //     let defaultSign = this.getDefaultSign(); // "1", "2" -> "锅子,局数"
    //     for(let key in this.gameCreateConfig){
    //         if(this.gameType == this.gameCreateConfig[key].GameName){
    //             if(curKey == this.gameCreateConfig[key].Key){
    //                 let AAfangfeiDatas = [];
    //                 let WinfangfeiDatas = [];
    //                 let FangZhufangfeiDatas = [];
    //                 let clubFangFeiDatas=[];
    //                 let clubWinFangFeiDatas=[];
    //                 let title = this.gameCreateConfig[key].Title.replace(reg, ' ');
    //                 TogglesNode.getChildByName('title').getComponent(cc.Label).string = title;
    //                 let descList = [];
    //                 if('jushu' != curKey){//局数读roomcost
    //                     descList = this.gameCreateConfig[key].ToggleDesc.split(',');
    //                     if(this.clubData && 'fangfei' == curKey){
    //                         descList = ['管理付'];
    //                     }else if(this.unionData && 'fangfei' == curKey){
    //                         descList = ['盟主付'];
    //                     }
    //                     if(descList.length != TogglesNode.children.length -2){//减去标题和帮助按钮
    //                         this.ErrLog('gameCreate config ToggleDesc and Toggle count error');
    //                         break;
    //                     }
    //                 }
    //                 let jushuIndex = -1;
    //                 let renshuIndex = -1;
    //                 let renshu = [];//0表示读房主支付配置

    //                 if('renshu' == curKey || 'fangfei' == curKey || 'jushu' == curKey){
                        
    //                     let publicCosts = this.getCostData(renshu);
    //                     let sign = this.GetIdxByKey('sign');    // 模式
    //                     // publicCosts = this.getCostDataBySign(publicCosts, sign+1)

    //                     if(this.Toggles['renshu'])
    //                         renshu = this.getCurSelectRenShu();

    //                     let SpiltCosts = this.getCostData(renshu);
    //                     // SpiltCosts = this.getCostDataBySign(SpiltCosts, sign+1)
                        
    //                     let curCostData = null;
    //                     if(0 == renshu.length){
    //                         curCostData = publicCosts;
    //                     }
    //                     else{
    //                         curCostData = SpiltCosts;
    //                     }

    //                     if(this.Toggles['jushu']){
    //                         this.curCostData = curCostData;
    //                         jushuIndex = 0;
    //                         for(let i=0;i<this.Toggles['jushu'].length;i++){
    //                             let mark = this.Toggles['jushu'][i].getChildByName('checkmark').active;
    //                             if(mark){
    //                                 jushuIndex = i;
    //                                 break;
    //                             }
    //                             jushuIndex++;
    //                         }
    //                         if(isRefreshJushu == true){
    //                             let idx = 0;
    //                             for(let i=0; i<curCostData.length; i++){
    //                                 this.curCostData = curCostData;
    //                                 if (curCostData[i].Sign == defaultSign) {
    //                                     let signStr = defaultSign == 1 ? "锅" : "局";
    //                                     this.Toggles['jushu'][idx].getChildByName('label').getComponent(cc.Label).string = this.curCostData[i].SetCount + signStr;
    //                                     idx++;
    //                                 }
    //                             }
    //                         }
    //                     }
                        
    //                     if(this.Toggles['fangfei'] && -1 != jushuIndex){
    //                         if(jushuIndex < publicCosts.length){
    //                             AAfangfeiDatas.push(publicCosts[jushuIndex].AaCostCount);
    //                             WinfangfeiDatas.push(publicCosts[jushuIndex].WinCostCount);
    //                             FangZhufangfeiDatas.push(publicCosts[jushuIndex].CostCount);

    //                             clubFangFeiDatas.push(publicCosts[jushuIndex].ClubCount);
    //                             clubWinFangFeiDatas.push(publicCosts[jushuIndex].ClubWinCostCount);
    //                         }
    //                         if(jushuIndex < SpiltCosts.length){
    //                             AAfangfeiDatas.push(SpiltCosts[jushuIndex].AaCostCount);
    //                             WinfangfeiDatas.push(SpiltCosts[jushuIndex].WinCostCount);
    //                             FangZhufangfeiDatas.push(SpiltCosts[jushuIndex].CostCount);

    //                             clubFangFeiDatas.push(SpiltCosts[jushuIndex].ClubCount);
    //                             clubWinFangFeiDatas.push(SpiltCosts[jushuIndex].ClubWinCostCount);
    //                         }
    //                     }
    //                 }
    //                 if('jushu' != curKey){
    //                     let descInde = 0;
    //                     for(let i=0;i<TogglesNode.children.length;i++){
    //                         if(TogglesNode.children[i].name.startsWith('Toggle')){
    //                             TogglesNode.children[i].getChildByName('label').getComponent(cc.Label).string = descList[descInde];
    //                             descInde++;
    //                         }
    //                     }
    //                 }

    //                 if(0 != AAfangfeiDatas.length){
    //                     let ffNodes = this.Toggles['fangfei'];
    //                     for(let s=0;s<ffNodes.length;s++){
    //                         let needNode = ffNodes[s].getChildByName('fangfeiNode');
    //                         needNode.active = true;
    //                         let disCost = -1;
    //                         if(this.clubData==null && this.unionData == null){
    //                             if(0 == s){
    //                                 if (this.disCount == -1) {
    //                                     needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + FangZhufangfeiDatas[FangZhufangfeiDatas.length - 1];
    //                                 }else{
    //                                    disCost = Math.ceil(this.disCount * FangZhufangfeiDatas[FangZhufangfeiDatas.length - 1]);
    //                                     if (disCost == 0) {
    //                                         needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
    //                                     }else{
    //                                         needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
    //                                     } 
    //                                 }
    //                             }
    //                             else if(1 == s){
    //                                 if (this.disCount == -1) {
    //                                     needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + AAfangfeiDatas[AAfangfeiDatas.length - 1];
    //                                 }else{
    //                                    disCost = Math.ceil(this.disCount * AAfangfeiDatas[AAfangfeiDatas.length - 1]);
    //                                     if (disCost == 0) {
    //                                         needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
    //                                     }else{
    //                                         needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
    //                                     } 
    //                                 }
    //                             }
    //                             else{
    //                                 if (this.disCount == -1) {
    //                                     needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + WinfangfeiDatas[WinfangfeiDatas.length - 1];
    //                                 }else{
    //                                    disCost = Math.ceil(this.disCount * WinfangfeiDatas[WinfangfeiDatas.length - 1]);
    //                                     if (disCost == 0) {
    //                                         needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
    //                                     }else{
    //                                         needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
    //                                     } 
    //                                 }
    //                             }
    //                         }else if (this.clubData==null && this.unionData != null){
    //                             if(0 == s){
    //                                 if (this.disCount == -1) {
    //                                     needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + unionGuanliFangFeiDatas[unionGuanliFangFeiDatas.length - 1];
    //                                 }else{
    //                                    disCost = Math.ceil(this.disCount * unionGuanliFangFeiDatas[unionGuanliFangFeiDatas.length - 1]);
    //                                     if (disCost == 0) {
    //                                         needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
    //                                     }else{
    //                                         needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
    //                                     } 
    //                                 }
    //                             }
    //                         }else{
    //                             if(0 == s){
    //                                 if (this.disCount == -1) {
    //                                     needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + clubGuanLiFangFeiDatas[clubGuanLiFangFeiDatas.length - 1];
    //                                 }else{
    //                                    disCost = Math.ceil(this.disCount * clubGuanLiFangFeiDatas[clubGuanLiFangFeiDatas.length - 1]);
    //                                     if (disCost == 0) {
    //                                         needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
    //                                     }else{
    //                                         needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
    //                                     } 
    //                                 }
    //                             }
    //                             // else if(1==s){
    //                             //     needNode.getChildByName('icon').active=false;
    //                             //     needNode.getChildByName('icon_qk').active=true;
    //                             //     needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + clubAAFangFeiDatas[clubAAFangFeiDatas.length - 1];
    //                             //     needNode.getChildByName('needNum').clubWinnerPayConsume = clubAAFangFeiDatas[clubAAFangFeiDatas.length - 1];
    //                             //     ffNodes[s].getChildByName('editbox').active=false;
    //                             // }else{
    //                             //     needNode.getChildByName('icon').active=false;
    //                             //     needNode.getChildByName('icon_qk').active=true;
    //                             //     needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + clubWinFangFeiDatas[clubWinFangFeiDatas.length - 1];
    //                             //     needNode.getChildByName('needNum').clubWinnerPayConsume = clubWinFangFeiDatas[clubWinFangFeiDatas.length - 1];
    //                             //     ffNodes[s].getChildByName('editbox').active=false;
    //                             // }
    //                         } 
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // },
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
			return;
		}else if('sign' == key){
            if ('chmj' == this.gameType) {
                let idx = 0;
                for(let i=0; i<this.curCostData.length; i++){
                    if (this.curCostData[i].Sign == (toggleIndex + 1)) {
                        let signStr = (toggleIndex + 1) == 1 ? "锅" : "局";
                        this.Toggles['jushu'][idx].getChildByName('label').getComponent(cc.Label).string = this.curCostData[i].SetCount + signStr;
                        idx++;
                    }
                }
            }
        }
		else if('kexuanwanfa' == key){
            // let quanzimo = this.Toggles['wanfa'][1].getChildByName('checkmark').active;
            // if (quanzimo && toggleIndex == 0) {
            //     app.SysNotifyManager().ShowSysMsg("全自摸不能选择有金必游",[],3);
            //     return;
            // }
        }else if ('beishu' == key) {
            // let quanzimo = this.Toggles['wanfa'][1].getChildByName('checkmark').active;
            // if (quanzimo) {
            //     if (0 == toggleIndex) return;
            //     app.SysNotifyManager().ShowSysMsg("全自摸只能选择四倍",[],3);
            //     return;
            // }
        }else if ('wanfa' == key) {
            if (1 == toggleIndex) {//全自摸倍数默认为最低倍
                this.ClearToggleCheck(this.Toggles['beishu'], [0]);
                this.UpdateLabelColor(this.Toggles['beishu'][0].parent);
                //全自摸不能游金必游
                this.ClearToggleCheck(this.Toggles['kexuanwanfa']);
                this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
            }
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
	},
});

module.exports = fzmjChildCreateRoom;