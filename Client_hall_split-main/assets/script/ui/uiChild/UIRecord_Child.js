/*
 UIGMTool_Child2 GM工具子界面
 */

cc.Class({
    extends: require("BaseChildForm"),

    properties: {
        lb_jushu:cc.Label,
        layout:cc.Node,
    },

    //创建界面回掉
    OnCreateInit:function(){
        // this.HZRoomMgr = app.HZRoomMgr();
        // this.HZRoom = this.HZRoomMgr.GetEnterRoom();
        // this.HZRoomPosMgr = this.HZRoom.GetRoomPosMgr();
    },

    InitShowInfo:function () {
        this.clientPosHuType.node.active = 0;
        this.clientPosZhongMa.node.active = 0;

        this.clientDownPosHuType.node.active = 0;
        this.clientDownPosZhongMa.node.active = 0;

        this.clientFacePosHuType.node.active = 0;
        this.clientFacePosZhongMa.node.active = 0;

        this.clientUpPosHuType.node.active = 0;
        this.clientUpPosZhongMa.node.active = 0;
    },
    //显示
    OnShow:function(){
        // this.InitShowInfo();

        // let userData = this.GetFormProperty("UserData");
        // this.jushu.string = userData;

        // let roomKey = this.HZRoom.GetRoomProperty("key");
        // this.lb_paijuid.string = app.i18n.t("roomKey",{"roomKey": roomKey});

        // let roomRecord = this.HZRoomMgr.GetEnterRoom().GetRoomRecord();
        // let everyGameKeys = Object.keys(roomRecord);
        // let everyGame = roomRecord[everyGameKeys[userData]];

        // this.lb_paijushijian.string = this.ComTool.GetDateYearMonthDayHourMinuteString(everyGame["endTime"]);

        // let posHuList = everyGame["posHuList"];
        // let posHuListKeys = Object.keys(posHuList);
        // for(let i = 0; i < posHuListKeys.length; i++ ){
        //     let player = posHuList[posHuListKeys[i]];
        //     let playerPos = player["pos"];
        //     let playerIntegral = player["point"] > 0 ? ["+",player["point"]].join("") : player["point"];
        //     let playerHuType = player["huType"];
        //     let playerZhongMa = player["zhongMa"];
        //     this.SetPlayerInfo(playerPos, playerIntegral, playerHuType, playerZhongMa);
        // }

        //清空分数
        for(let i = 0; i < this.layout.children.length; i++){
            let node = this.layout.children[i];
            node.getComponent(cc.Label).string = '';
        }

        let userData = this.GetFormProperty("UserData");
        this.lb_jushu.string = (parseInt(userData)+1).toString();

        app.RecordData().SetEveryGame(userData);
        
        let posHuList = app.RecordData().GetEveryGameProperty("posHuList");
        let pResults = app.RecordData().GetEveryGameProperty("pResults");
        if(posHuList){
            let posHuListKeys = Object.keys(posHuList);
            for(let i = 0; i < posHuListKeys.length; i++ ){
                let player = posHuList[posHuListKeys[i]];
                let path = 'layout/lb_score' + (i+1).toString();
                let node = this.GetWndNode(path);
                node.getComponent(cc.Label).string = player["point"] > 0 ? ["+",player["point"]].join("") : player["point"];
            }
        }else if(pResults){
            pResults.sort(function(a, b){
                return a.posIdx - b.posIdx;
            });
            for(let i = 0; i < pResults.length; i++ ){
                let player = pResults[i];
                let path = 'layout/lb_score' + (i+1).toString();
                let node = this.GetWndNode(path);
                node.getComponent(cc.Label).string = player["shui"] > 0 ? ["+",player["shui"]].join("") : player["shui"];
            }
        }

    },
    SetPlayerInfo:function (playerPos, playerIntegral, playerHuType, playerZhongMa) {
        let clientPos = this.HZRoomPosMgr.GetClientPos();
        let clientDownPos = this.HZRoomPosMgr.GetClientDownPos();
        let clientFacePos = this.HZRoomPosMgr.GetClientFacePos();
        let clientUpPos = this.HZRoomPosMgr.GetClientUpPos();
        let huTypeString = "";
        if(playerHuType == this.ShareDefine.HuType_ZiMo){
            huTypeString = app.i18n.t("ZiMo");
        }
        else if(playerHuType == this.ShareDefine.HuType_QGH){
            huTypeString = app.i18n.t("QiangGangHu");
        }
        else if(playerHuType == this.ShareDefine.HuType_FHZ){
            huTypeString = app.i18n.t("SiHongZhong");
        }
        else if(playerHuType == this.ShareDefine.HuType_NotHu){
            huTypeString = "";
        }
        let zhongMaString = "";
        if(playerZhongMa){
            zhongMaString = app.i18n.t("ZhongMa",{"ZhongMa":playerZhongMa});
        }
        if(playerPos == clientPos){
            this.clientPosIntegral.string = app.i18n.t("Integral",{"Integral":playerIntegral});
            this.clientPosHuType.node.active = 1;
            this.clientPosZhongMa.node.active = 1;
            this.clientPosHuType.string = huTypeString;
            this.clientPosZhongMa.string = zhongMaString;
        }
        else if(playerPos == clientDownPos){
            this.clientDownPosIntegral.string = app.i18n.t("Integral",{"Integral":playerIntegral});
            this.clientDownPosHuType.node.active = 1;
            this.clientDownPosZhongMa.node.active = 1;
            this.clientDownPosHuType.string = huTypeString;
            this.clientDownPosZhongMa.string = zhongMaString;
        }
        else if(playerPos == clientFacePos){
            this.clientFacePosIntegral.string = app.i18n.t("Integral",{"Integral":playerIntegral});
            this.clientFacePosHuType.node.active = 1;
            this.clientFacePosZhongMa.node.active = 1;
            this.clientFacePosHuType.string = huTypeString;
            this.clientFacePosZhongMa.string = zhongMaString;
        }
        else if(playerPos == clientUpPos){
            this.clientUpPosIntegral.string = app.i18n.t("Integral",{"Integral":playerIntegral});
            this.clientUpPosHuType.node.active = 1;
            this.clientUpPosZhongMa.node.active = 1;
            this.clientUpPosHuType.string = huTypeString;
            this.clientUpPosZhongMa.string = zhongMaString;
        }
    },
    //-------------点击函数-------------

    OnClick:function(btnName, btnNode){
        
       
    },

});