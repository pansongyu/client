/*
 * 	ComTool.js
 * 	工具函数管理器模块
 *
 *	author:hongdian
 *	date:2014-10-28
 *	version:1.0
 *
 * 修改时间 修改人 修改内容:
 *
 */

var app = require('app');

var RoomCfgManager = app.BaseClass.extend({
    /**
     * 构造函数
     */
    Init:function(){
        this.JS_Name = "RoomCfgManager";
        // this.PDKDefine = app.PDKDefine();
        this.gameCreateCfg = app.SysDataManager().GetTableDict("gameCreate");
    },

    GetRoomData:function(gameType,cfg){//gameType大写
        let roomData = {};
        if(0 == cfg.paymentRoomCardType)
            roomData.payMethod = '房主支付';
        else if(1 == cfg.paymentRoomCardType)
            roomData.payMethod = '平分支付';
        else if(2 == cfg.paymentRoomCardType)
            roomData.payMethod = '大赢家支付';
        let idx = app.ShareDefine().GametTypeNameDict[gameType];
        roomData.bigName0 = app.ShareDefine().GametTypeID2Name[idx];//汉字
        roomData.bigName1 = app.ShareDefine().GametTypeID2PinYin[idx];
        roomData.smallName0 = '';//汉字
        roomData.smallName1 = '';
        if('nn' == roomData.bigName1){
            if(0 == cfg.sign){
                roomData.smallName0 = '自由拼十';
                roomData.smallName1 = 'zyqz_nn';
            }
            else if(1 == cfg.sign){
                roomData.smallName0 = '拼十上庄';
                roomData.smallName1 = 'nnsz_nn';
            }
            else if(2 == cfg.sign){
                roomData.smallName0 = '固定庄家';
                roomData.smallName1 = 'gdzj_nn';
            }
            else if(3 == cfg.sign){
                roomData.smallName0 = '通比拼十';
                roomData.smallName1 = 'tbnn_nn';
            }
            else if(4 == cfg.sign){
                roomData.smallName0 = '明牌抢庄';
                roomData.smallName1 = 'mpqz_nn';
            }
            else if(5 == cfg.sign){
                roomData.smallName0 = '轮庄拼十';
                roomData.smallName1 = 'lz_nn';
            }
        }
        else if('sg' == roomData.bigName1){
            if(0 == cfg.sign){
                roomData.smallName0 = '自由三公';
                roomData.smallName1 = 'zyqz_sg';
            }
            else if(1 == cfg.sign){
                roomData.smallName0 = '三公上庄';
                roomData.smallName1 = 'sgsz_sg';
            }
            else if(2 == cfg.sign){
                roomData.smallName0 = '固定庄家';
                roomData.smallName1 = 'gdzj_sg';
            }
            else if(3 == cfg.sign){
                roomData.smallName0 = '通比三公';
                roomData.smallName1 = 'tb_sg';
            }
            else if(4 == cfg.sign){
                roomData.smallName0 = '加倍抢庄';
                roomData.smallName1 = 'mpqz_sg';
            }
        }
        else if('sss' == roomData.bigName1){
            if(1 == cfg.sign){
                roomData.smallName0 = '庄家十三水';//'庄家扑克';
                roomData.smallName1 = 'sss_zz';
            }
            else if(2 == cfg.sign){
                roomData.smallName0 = '十三水';//'多人扑克';
                roomData.smallName1 = 'sss_dr';
            }
        }
        else if('pdk' == roomData.bigName1){
            if(1 == cfg.sign){
                roomData.smallName0 = '跑得快';
                roomData.smallName1 = 'pdk';
            }
            else if(2 == cfg.sign){
                roomData.smallName0 = '跑得快';
                roomData.smallName1 = 'pdk';
            }
        }
        return roomData;
    },
    GetGameName:function(gameType,bAddBigName = false){//gameType小写
        
        let type=typeof(gameType);
        if(type== 'number'){
            gameType=app.ShareDefine().GametTypeID2PinYin[gameType];
        }
        let bigType = gameType.toUpperCase();
        let idx = app.ShareDefine().GametTypeNameDict[bigType];
        if(undefined != idx)
            return app.ShareDefine().GametTypeID2Name[idx];//汉字
        else{
            if('zyqz_nn' == gameType){
                if(bAddBigName)
                    return '拼十-自由拼十';
                else
                    return '自由拼十';
            }
            else if('nnsz_nn' == gameType){
                if(bAddBigName)
                    return '拼十-拼十上庄';
                else
                    return '拼十上庄';
            }
            else if('gdzj_nn' == gameType){
                if(bAddBigName)
                    return '拼十-固定庄家';
                else
                    return '固定庄家';
            }
            else if('tbnn_nn' == gameType){
                if(bAddBigName)
                    return '拼十-通比拼十';
                else
                    return '通比拼十';
            }
            else if('mpqz_nn' == gameType){
                if(bAddBigName)
                    return '拼十-明牌抢庄';
                else
                    return '明牌抢庄';
            }
            else if('lz_nn' == gameType){
                if(bAddBigName)
                    return '拼十-轮庄拼十';
                else
                    return '轮庄拼十';
            }
            else if('zyqz_sg' == gameType){
                if(bAddBigName)
                    return '三公-自由三公';
                else
                    return '自由三公';
            }
            else if('sgsz_sg' == gameType){
                if(bAddBigName)
                    return '三公-三公上庄';
                else
                    return '三公上庄';
            }
            else if('gdzj_sg' == gameType){
                if(bAddBigName)
                    return '三公-固定庄家';
                else
                    return '固定庄家';
            }
            else if('tb_sg' == gameType){
                if(bAddBigName)
                    return '三公-通比三公';
                else
                    return '通比三公';
            }
            else if('mpqz_sg' == gameType){
                if(bAddBigName)
                    return '三公-加倍抢庄';
                else
                    return '加倍抢庄';
            }
            else if('sss_zz' == gameType)
                return '庄家十三水';//'庄家扑克';
            else if('sss_dr' == gameType)
                return '十三水';//'多人扑克';
            else if('pdk_jd' == gameType)
                return '跑得快';
            else if('pdk_lyfj' == gameType)
                return '跑得快';
            else
                return '';
        }
    },
    GetAllNameByList:function(types){
        let tempList = [];
        for(let i=0;i<types.length;i++){
            let idx = types[i];
            let data = {};
            data.hanzi = app.ShareDefine().GametTypeID2Name[idx];
            data.pinyin = app.ShareDefine().GametTypeID2PinYin[idx];
            if('nn' == data.pinyin){
                data.hanzi = '拼十-自由拼十';
                data.pinyin = 'zyqz_nn';
                tempList.push(data);
                let data1 = {};
                data1.hanzi = '拼十-拼十上庄';
                data1.pinyin = 'nnsz_nn';
                tempList.push(data1);
                let data2 = {};
                data2.hanzi = '拼十-固定庄家';
                data2.pinyin = 'gdzj_nn';
                tempList.push(data2);
                let data3 = {};
                data3.hanzi = '拼十-通比拼十';
                data3.pinyin = 'tbnn_nn';
                tempList.push(data3);
                let data4 = {};
                data4.hanzi = '拼十-明牌抢庄';
                data4.pinyin = 'mpqz_nn';
                tempList.push(data4);
                let data5 = {};
                data5.hanzi = '拼十-轮庄拼十';
                data5.pinyin = 'lz_nn';
                tempList.push(data5);
            }
            else if('sg' == data.pinyin){
                data.hanzi = '三公-自由三公';
                data.pinyin = 'zyqz_sg';
                tempList.push(data);
                let data1 = {};
                data1.hanzi = '三公-三公上庄';
                data1.pinyin = 'sgsz_sg';
                tempList.push(data1);
                let data2 = {};
                data2.hanzi = '三公-固定庄家';
                data2.pinyin = 'gdzj_sg';
                tempList.push(data2);
                let data3 = {};
                data3.hanzi = '三公-通比三公';
                data3.pinyin = 'tb_sg';
                tempList.push(data3);
                let data4 = {};
                data4.hanzi = '三公-加倍抢庄';
                data4.pinyin = 'mpqz_sg';
                tempList.push(data4);
            }
            else if('sss' == data.pinyin){
                data.hanzi = '庄家十三水';//'庄家扑克';
                data.pinyin = 'sss_zz';
                tempList.push(data);
                let data1 = {};
                data1.hanzi = '十三水';//'多人扑克';
                data1.pinyin = 'sss_dr';
                tempList.push(data1);
            }
            else
                tempList.push(data);
        }
        return tempList;
    },
    WanFa:function(gameType,cfg){//gameType大写
        let type=typeof(gameType);
        if(type== 'number'){
            gameType=app.ShareDefine().GametTypeID2PinYin[gameType];
        }
        gameType=gameType.toUpperCase();
        let wanfaStr = '';
        let zhadansuanfaCount = -1;
        let isWuZha = false;
        let nameData = this.GetRoomData(gameType,cfg);
        gameType = '' != nameData.smallName1 ? nameData.smallName1 : nameData.bigName1;
        for(let key in this.gameCreateCfg){
            let gameName = this.gameCreateCfg[key].GameName;
            let isWanFa = this.gameCreateCfg[key].isWanFa;
            if(gameType == gameName && 1 == isWanFa){
                let dataKey = this.gameCreateCfg[key].Key;
                let value = cfg[dataKey];
                if(dataKey == "kexuanwanfa"){
                    if(gameType == 'pdk' || gameType == 'jtpdk' || gameType == 'gapdk' || gameType == 'japdk' ||gameType == 'jxndpdk' || gameType == 'yxpdk' || gameType == 'ygpdk' || gameType == 'xgpdk' || gameType == 'hhpdk' || gameType == 'yzpdk' || gameType == 'xyxxpdk'){
                        if(value.indexOf(29) > -1){
                            isWuZha = true;
                        }
                    }
                }
                if(dataKey == "zhadansuanfa"){
                    if(isWuZha){
                        continue;
                    }
                    zhadansuanfaCount = value;
                }
                if(dataKey == "zhadanfenshu" && zhadansuanfaCount == 2 && isWuZha){
                    continue;
                }
                // if(dataKey == "zhadansuanfa"){
                //     if(gameType == 'hnpdk'){
                //         if(dataKey == "zhadansuanfa"){
                //             zhadansuanfaCount = value;
                //         }
                //         if(dataKey == "zhadanfenshu" && zhadansuanfaCount == 2){
                //             continue;
                //         }
                //     }
                // }
                let ToggleType = this.gameCreateCfg[key].ToggleType;
                let ToggleDesc = this.gameCreateCfg[key].ToggleDesc.split(',');
                if(0 == ToggleType){
                    if(value >= ToggleDesc.length)
                        continue;
                    //单选
                    let str = '';
                    str = ToggleDesc[value];
                    if('zjh' == gameType && ('dingzhu' == dataKey || 'dizhu' == dataKey)){
                        let baseDiZhus = [1,2,5,10];
                        let dizhuIdx = cfg['dizhu'];
                        let dizhu = baseDiZhus[dizhuIdx];
                        let dingzhu = 0;
                        if(0 == value)
                            dingzhu = dizhu * 5;
                        else
                            dingzhu = dizhu * 10;
                        dizhu = dizhu * cfg['baseMark'];
                        dingzhu = dingzhu * cfg['baseMark'];
                        
                        if('dingzhu' == dataKey)
                            str = dingzhu.toString() + '分';
                        else
                            str = dizhu.toString() + '分';
                    }else if(("pxzzmj" == gameType || "hzmj" == gameType || "pxpdk" == gameType) && dataKey == "suanFen" && value == 1){
                        str = str + cfg["suanFenNum"];
                    }
                    if(typeof(str)=="undefined"){
                        continue;
                    }
                    if (wanfaStr == ''){
                        wanfaStr = str;
                    } else {
                        wanfaStr = wanfaStr + "，" + str;
                    }
                }else if(1 == ToggleType){
                    
                    //多选
                    if(typeof(value)=="undefined"){
                        continue;
                    }
                    for(let j = 0; j < value.length;j++){
                        let str = '';
                        if(dataKey=="kexuanwanfa"){
                            if(gameType == 'pypdk' || gameType == 'xyxxpdk' || gameType == 'ygpdk' || gameType == 'hhpdk' || gameType == 'pxpdk' || gameType == 'yzpdk'){
                                if(value[j] == 15 || value[j] == 18){
                                    continue;
                                }
                            }else if (gameType == 'lppdk' || gameType == 'pdk' || gameType == 'gapdk' || gameType == 'japdk'|| gameType == 'yxpdk' ) {
                                if (value[j] == 14 || value[j] == 15 || value[j] == 18) {
                                    continue;
                                }
                            }else if (gameType == 'gspdk') {
                                if (value[j] == 4 || value[j] == 13 || value[j] == 14 || value[j] == 15 || value[j] == 18) {
                                    continue;
                                }
                            }else if (gameType == 'jtpdk' || gameType == 'tzpdk' || gameType == 'xcpdk') {
                                if (value[j] == 13 || value[j] == 14 || value[j] == 15 || value[j] == 18) {
                                    continue;
                                }
                            }else if (gameType == 'hcpdk') {
                                if (value[j] == 13) {
                                    continue;
                                }
                            }
                            if(gameType == 'pypdk'){
                                if(value[j] == 11){
                                    str = ToggleDesc[3];
                                }
                                else if(value[j] == 22){
                                    str = ToggleDesc[4];
                                }
                                else if(value[j] == 23){
                                    str = ToggleDesc[5];
                                }
                                else if(value[j] == 24){
                                    str = ToggleDesc[6];
                                }
                                else if(value[j] == 25){
                                    str = ToggleDesc[7];
                                }
                                else if(value[j] == 26){
                                    str = ToggleDesc[8];
                                }
                                else if(value[j] == 27){
                                    str = ToggleDesc[9];
                                }
                                else{
                                    str = ToggleDesc[value[j]];
                                }
                            }else if (gameType == 'gspdk') {
                                if (value[j] == 11) {
                                    str = ToggleDesc[0];
                                } else if (value[j] == 22) {
                                    str = ToggleDesc[1];
                                } else if (value[j] == 26) {
                                    str = ToggleDesc[2];
                                } else if (value[j] == 28) {
                                    str = ToggleDesc[3];
                                } else {
                                    str = ToggleDesc[value[j]];
                                }
                            }else if (gameType == 'hcpdk') {
                                if (value[j] == 11) {
                                    str = ToggleDesc[0];
                                } else if (value[j] == 22) {
                                    str = ToggleDesc[1];
                                } else if (value[j] == 26) {
                                    str = ToggleDesc[2];
                                } else if (value[j] == 28) {
                                    str = ToggleDesc[3];
                                } else if (value[j] == 2) {
                                    str = ToggleDesc[4];
                                } else if (value[j] == 31) {
                                    str = ToggleDesc[5];
                                } else {
                                    str = ToggleDesc[value[j]];
                                }
                            }else if(gameType == 'ygpdk' || gameType == 'xgpdk' || gameType == 'yzpdk'){
                                if(value[j] == 14){
                                    continue;
                                }
                                if (value[j] == 11) {
                                    str = ToggleDesc[3];
                                } else if (value[j] == 22) {
                                    str = ToggleDesc[4];
                                } else if (value[j] == 23) {
                                    str = ToggleDesc[5];
                                } else if (value[j] == 24) {
                                    str = ToggleDesc[6];
                                } else if (value[j] == 25) {
                                    str = ToggleDesc[7];
                                } else if (value[j] == 26) {
                                    str = ToggleDesc[8];
                                } else if (value[j] == 27) {
                                    str = ToggleDesc[9];
                                } else if (value[j] == 28) {
                                    str = ToggleDesc[10];
                                } else if (value[j] == 29) {
                                    str = ToggleDesc[11];
                                } else if (value[j] == 4) {
                                    str = ToggleDesc[12];
                                } else if (value[j] == 30) {
                                    str = ToggleDesc[13];
                                } else if (value[j] == 31) {
                                    str = ToggleDesc[14];
                                } else {
                                    str = ToggleDesc[value[j]];
                                }
                            }else if(gameType == 'pdk' || gameType == 'gapdk' || gameType == 'japdk' || gameType == 'yxpdk'){
                                if(value[j] == 14){
                                    continue;
                                }
                                if (value[j] == 11) {
                                    str = ToggleDesc[3];
                                } else if (value[j] == 22) {
                                    str = ToggleDesc[4];
                                } else if (value[j] == 23) {
                                    str = ToggleDesc[5];
                                } else if (value[j] == 24) {
                                    str = ToggleDesc[6];
                                } else if (value[j] == 25) {
                                    str = ToggleDesc[7];
                                } else if (value[j] == 26) {
                                    str = ToggleDesc[8];
                                } else if (value[j] == 27) {
                                    str = ToggleDesc[9];
                                } else if (value[j] == 28) {
                                    str = ToggleDesc[10];
                                } else if (value[j] == 29) {
                                    str = ToggleDesc[11];
                                } else if (value[j] == 4) {
                                    str = ToggleDesc[12];
                                } else if (value[j] == 30) {
                                    str = ToggleDesc[13];
                                } else if (value[j] == 31) {
                                    str = ToggleDesc[14];
                                } else if (value[j] == 32) {
                                    str = ToggleDesc[15];
                                } else if (value[j] == 33) {
                                    str = ToggleDesc[16];
                                } else {
                                    str = ToggleDesc[value[j]];
                                }
                            }else if(gameType == 'jtpdk'){
                                if(value[j] == 14){
                                    continue;
                                }
                                if (value[j] == 11) {
                                    str = ToggleDesc[3];
                                } else if (value[j] == 22) {
                                    str = ToggleDesc[4];
                                } else if (value[j] == 23) {
                                    str = ToggleDesc[5];
                                } else if (value[j] == 24) {
                                    str = ToggleDesc[6];
                                } else if (value[j] == 25) {
                                    str = ToggleDesc[7];
                                } else if (value[j] == 26) {
                                    str = ToggleDesc[8];
                                } else if (value[j] == 27) {
                                    str = ToggleDesc[9];
                                } else if (value[j] == 28) {
                                    str = ToggleDesc[10];
                                } else if (value[j] == 29) {
                                    str = ToggleDesc[11];
                                } else if (value[j] == 4) {
                                    str = ToggleDesc[12];
                                } else if (value[j] == 30) {
                                    str = ToggleDesc[13];
                                } else if (value[j] == 31) {
                                    str = ToggleDesc[14];
                                } else if (value[j] == 32) {
                                    str = ToggleDesc[15];
                                } else if (value[j] == 33) {
                                    str = ToggleDesc[16];
                                } else if (value[j] == 34) {
                                    str = ToggleDesc[17];
                                } else {
                                    str = ToggleDesc[value[j]];
                                }
                            }else if(gameType == 'tzpdk'){
                                if (value[j] == 1) {
                                    str = ToggleDesc[0];
                                } else if (value[j] == 34) {
                                    str = ToggleDesc[1];
                                } else if (value[j] == 35) {
                                    str = ToggleDesc[2];
                                } else if (value[j] == 2) {
                                    str = ToggleDesc[3];
                                } else if (value[j] == 11) {
                                    str = ToggleDesc[4];
                                } else if (value[j] == 22) {
                                    str = ToggleDesc[5];
                                } else if (value[j] == 23) {
                                    str = ToggleDesc[6];
                                } else if (value[j] == 26) {
                                    str = ToggleDesc[7];
                                } else if (value[j] == 27) {
                                    str = ToggleDesc[8];
                                } else if (value[j] == 29) {
                                    str = ToggleDesc[9];
                                } else if (value[j] == 4) {
                                    str = ToggleDesc[10];
                                } else if (value[j] == 30) {
                                    str = ToggleDesc[11];
                                } else if (value[j] == 31) {
                                    str = ToggleDesc[12];
                                } else if (value[j] == 32) {
                                    str = ToggleDesc[13];
                                } else if (value[j] == 33) {
                                    str = ToggleDesc[14];
                                } else if (value[j] == 36) {
                                    str = ToggleDesc[15];
                                } else {
                                    str = ToggleDesc[value[j]];
                                }
                            }else if(gameType == 'jxndpdk'){
                                if(value[j] == 14){
                                    continue;
                                }
                                if (value[j] == 2) {
                                    str = ToggleDesc[0];
                                } else if (value[j] == 11) {
                                    str = ToggleDesc[1];
                                } else if (value[j] == 22) {
                                    str = ToggleDesc[2];
                                } else if (value[j] == 23) {
                                    str = ToggleDesc[3];
                                } else if (value[j] == 24) {
                                    str = ToggleDesc[4];
                                } else if (value[j] == 26) {
                                    str = ToggleDesc[5];
                                } else if (value[j] == 27) {
                                    str = ToggleDesc[6];
                                } else if (value[j] == 28) {
                                    str = ToggleDesc[7];
                                } else if (value[j] == 29) {
                                    str = ToggleDesc[8];
                                } else if (value[j] == 4) {
                                    str = ToggleDesc[9];
                                } else if (value[j] == 30) {
                                    str = ToggleDesc[10];
                                } else if (value[j] == 31) {
                                    str = ToggleDesc[11];
                                } else if (value[j] == 32) {
                                    str = ToggleDesc[12];
                                } else {
                                    str = ToggleDesc[value[j]];
                                }
                            }else if(gameType == 'xyxxpdk'){
                                if(value[j] == 14){
                                    continue;
                                }
                                if (value[j] == 11) {
                                    str = ToggleDesc[3];
                                }  else if (value[j] == 14) {
                                    str = "";//三带1
                                } else if (value[j] == 15) {
                                    str = "";//三带2
                                } else if (value[j] == 22) {
                                    str = ToggleDesc[4];
                                } else if (value[j] == 23) {
                                    str = ToggleDesc[5];
                                } else if (value[j] == 24) {
                                    str = ToggleDesc[6];
                                } else if (value[j] == 25) {
                                    str = ToggleDesc[7];
                                } else if (value[j] == 26) {
                                    str = ToggleDesc[8];
                                } else if (value[j] == 27) {
                                    str = ToggleDesc[9];
                                } else if (value[j] == 28) {
                                    str = ToggleDesc[10];
                                } /*else if (value[j] == 29) {
                                    str = ToggleDesc[11];
                                } */else if (value[j] == 4) {
                                    str = ToggleDesc[11];
                                } else if (value[j] == 30) {
                                    str = ToggleDesc[12];
                                } else if (value[j] == 31) {
                                    str = ToggleDesc[13];
                                } else if (value[j] == 32) {
                                    str = ToggleDesc[14];
                                } else if (value[j] == 33) {
                                    str = ToggleDesc[15];
                                } else {
                                    str = ToggleDesc[value[j]];
                                }
                            }else if(gameType == 'hhpdk'){
                                if(value[j] == 14){
                                    continue;
                                }
                                if (value[j] == 11) {
                                    str = ToggleDesc[3];
                                } else if (value[j] == 22) {
                                    str = ToggleDesc[4];
                                } else if (value[j] == 23) {
                                    str = ToggleDesc[5];
                                } else if (value[j] == 24) {
                                    str = ToggleDesc[6];
                                } else if (value[j] == 25) {
                                    str = ToggleDesc[7];
                                } else if (value[j] == 26) {
                                    str = ToggleDesc[8];
                                } else if (value[j] == 27) {
                                    continue
                                } else if (value[j] == 28) {
                                    str = ToggleDesc[9];
                                } else if (value[j] == 29) {
                                    str = ToggleDesc[10];
                                } else if (value[j] == 4) {
                                    str = ToggleDesc[11];
                                } else if (value[j] == 30) {
                                    str = ToggleDesc[12];
                                } else if (value[j] == 31) {
                                    str = ToggleDesc[13];
                                } else if (value[j] == 32) {
                                    str = ToggleDesc[14];
                                } else if (value[j] == 33) {
                                    str = ToggleDesc[15];
                                } else {
                                    str = ToggleDesc[value[j]];
                                }
                            }
                            else if(gameType == 'pxpdk'){
                                if(value[j] == 14){
                                    continue;
                                }
                                if (value[j] == 11) {
                                    str = ToggleDesc[3];
                                } else if (value[j] == 22) {
                                    str = ToggleDesc[4];
                                } else if (value[j] == 23) {
                                    str = ToggleDesc[5];
                                } else if (value[j] == 24) {
                                    str = ToggleDesc[6];
                                } else if (value[j] == 25) {
                                    str = ToggleDesc[7];
                                } else if (value[j] == 26) {
                                    str = ToggleDesc[8];
                                } else if (value[j] == 27) {
                                    str = ToggleDesc[9];
                                }  else if (value[j] == 4) {
                                    str = ToggleDesc[10];
                                } else {
                                    str = ToggleDesc[value[j]];
                                }
                            }
                            else if (gameType == 'hnpdk') {
                                if (value[j] == 30) {
                                    str = ToggleDesc[0];
                                } else if (value[j] == 24) {
                                    str = ToggleDesc[1];
                                } else if (value[j] == 29) {
                                    str = ToggleDesc[2];
                                } else if (value[j] == 25) {
                                    str = ToggleDesc[3];
                                } else if (value[j] == 26) {
                                    str = ToggleDesc[4];
                                } else if (value[j] == 11) {
                                    str = ToggleDesc[5];
                                } else if (value[j] == 28) {
                                    str = ToggleDesc[6];
                                } else if (value[j] == 14) {
                                    str = ToggleDesc[7];
                                } else if (value[j] == 15) {
                                    str = ToggleDesc[8];
                                } else if (value[j] == 31) {
                                    str = ToggleDesc[9];
                                } else if (value[j] == 16) {
                                    str = ToggleDesc[10];
                                } else if (value[j] == 17) {
                                    str = ToggleDesc[11];
                                } else if (value[j] == 18) {
                                    str = ToggleDesc[12];
                                } else if (value[j] == 27) {
                                    str = ToggleDesc[13];
                                } else {
                                    str = ToggleDesc[value[j]];
                                }
                            }
                            else if(gameType == 'lppdk'){
                                if(value[j] == 14){
                                    continue;
                                }
                                if (value[j] == 11) {
                                    str = ToggleDesc[3];
                                } else if (value[j] == 22) {
                                    str = ToggleDesc[4];
                                } else if (value[j] == 23) {
                                    str = ToggleDesc[5];
                                } else if (value[j] == 24) {
                                    str = ToggleDesc[6];
                                } else if (value[j] == 25) {
                                    str = ToggleDesc[7];
                                } else if (value[j] == 26) {
                                    str = ToggleDesc[8];
                                } else if (value[j] == 27) {
                                    str = ToggleDesc[9];
                                } else if (value[j] == 28) {
                                    str = ToggleDesc[10];
                                } else if (value[j] == 29) {
                                    str = ToggleDesc[11];
                                } else if (value[j] == 4) {
                                    str = ToggleDesc[12];
                                } else if (value[j] == 30) {
                                    str = ToggleDesc[13];
                                } else if (value[j] == 31) {
                                    str = ToggleDesc[14];
                                } else if (value[j] == 32) {
                                    str = ToggleDesc[15];
                                } else {
                                    str = ToggleDesc[value[j]];
                                }

                            }else if(gameType == 'xcpdk'){
                                if (value[j] == 2) {
                                    str = ToggleDesc[1];
                                } else if (value[j] == 22) {
                                    str = ToggleDesc[4];
                                } else if (value[j] == 23) {
                                    str = ToggleDesc[5];
                                } else if (value[j] == 24) {
                                    str = ToggleDesc[6];
                                } else if (value[j] == 25) {
                                    str = ToggleDesc[7];
                                } else if (value[j] == 26) {
                                    str = ToggleDesc[8];
                                } else if (value[j] == 27) {
                                    str = ToggleDesc[9];
                                } else if (value[j] == 28) {
                                    str = ToggleDesc[10];
                                } else if (value[j] == 29) {
                                    str = ToggleDesc[11];
                                } else if (value[j] == 4) {
                                    str = ToggleDesc[12];
                                } else if (value[j] == 30) {
                                    str = ToggleDesc[13];
                                } else if (value[j] == 31) {
                                    str = ToggleDesc[14];
                                } else if (value[j] == 32) {
                                    str = ToggleDesc[15];
                                } else {
                                    str = ToggleDesc[value[j]];
                                }
                            }else{
                                str = ToggleDesc[value[j]];
                            }
                        }else{
                            str = ToggleDesc[value[j]];
                        }


                        if(typeof(str)=="undefined"){
                            continue;
                        }
                        if(wanfaStr == ''){
                            wanfaStr = str;
                        }else{
                            if('' != str){
                                wanfaStr = wanfaStr + "," + str;
                            }
                        }
                    }
                }
            }
        }
        return wanfaStr;
    },
    //跑得快龙岩伏击可选玩法，服务端下发的玩法id转成客户端对应的玩法id
    //因为龙岩伏击和经典在一个模块，两个玩法对于的id不一样，需要转义
    PDKLYFJServerIdToClientId:function(gameType, serverId){
        if (gameType == 'pdk_lyfj') {
            // if (serverId == this.PDKDefine.SEVER_SHOWCARDNUM) {
            //     return this.PDKDefine.LYFJSHOWCARDNUM;
            // }else if (serverId == this.PDKDefine.SEVER_DOUBLEBOOM) {
            //     return this.PDKDefine.LYFJDOUBLEBOOM;
            // }else if (serverId == this.PDKDefine.SEVER_AAA) {
            //     return -1;
            // }else if (serverId == this.PDKDefine.SEVER_DAI32) {
            //     return -1;
            // }else if (serverId == this.PDKDefine.SEVER_DAI43) {
            //     return -1;
            // }else{
            //     return serverId;
            // }
            return serverId;
        }else{
            return serverId;
        }
    },
});

var g_RoomCfgManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
    if(!g_RoomCfgManager){
        g_RoomCfgManager = new RoomCfgManager();
    }
    return g_RoomCfgManager;
}