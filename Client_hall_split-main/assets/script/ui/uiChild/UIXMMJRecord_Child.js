/*
 UIGMTool_Child2 GM工具子界面
 */

cc.Class({
    extends: require("BaseChildForm"),

    properties: {
        jushu:cc.Label,
        lb_paijuid:cc.Label,
        lb_paijushijian:cc.Label,

        clientPosHuType:cc.Label,
        clientPosIntegral:cc.Label,

        clientDownPosHuType:cc.Label,
        clientDownPosIntegral:cc.Label,

        clientFacePosHuType:cc.Label,
        clientFacePosIntegral:cc.Label,

        clientUpPosHuType:cc.Label,
        clientUpPosIntegral:cc.Label,

        bg2:cc.Node,
        bg3:cc.Node,
        bg4:cc.Node,

    },

    //创建界面回掉
    OnCreateInit:function(){
        this.LYMJRoomMgr = app.LYMJRoomMgr();
        this.LYMJRoom = this.LYMJRoomMgr.GetEnterRoom();
        this.LYMJRoomPosMgr = this.LYMJRoom.GetRoomPosMgr();

        //玩家列表
        this.playerList = []
    },

    InitShowInfo:function () {
        this.playerList = []
        let clientPos = this.LYMJRoomPosMgr.GetClientPos();
        let clientDownPos = this.LYMJRoomPosMgr.GetClientDownPos();
        let clientFacePos = this.LYMJRoomPosMgr.GetClientFacePos();
        let clientUpPos = this.LYMJRoomPosMgr.GetClientUpPos();

        let ClientPlayer = this.LYMJRoomPosMgr.GetPlayerInfoByPos(clientPos);
        if(ClientPlayer)
        {
            this.playerList.push(ClientPlayer);
        }

        let DownPlayer = this.LYMJRoomPosMgr.GetPlayerInfoByPos(clientDownPos);
        if(DownPlayer)
        {
            this.playerList.push(DownPlayer);
        }

        let FacePlayer = this.LYMJRoomPosMgr.GetPlayerInfoByPos(clientFacePos);
        if(FacePlayer)
        {
            this.playerList.push(FacePlayer);
        }

        let UpPlayer = this.LYMJRoomPosMgr.GetPlayerInfoByPos(clientUpPos);
        if(UpPlayer)
        {
            this.playerList.push(UpPlayer);
        }

        for(let i = 2; i <= this.ShareDefine.LYMJRoomJoinCount; i++)
        {
            let activeValue  = this.playerList.length == i ? 1 : 0;
            let bgStr = "bg"+i;
            let bg = this.node.getChildByName(bgStr);
            if(bg) bg.active = activeValue;
        }
    },
    //显示
    OnShow:function(){
        this.InitShowInfo();

        let bgStr = "bg"+this.playerList.length;
        let bg = this.node.getChildByName(bgStr);

        let userData = this.GetFormProperty("UserData");
        let jushu = bg.getChildByName("lb_jushu").getComponent(cc.Label);
        console.log("UILYMJRecore_Child jushu userData:",userData);
        jushu.string = parseInt(userData)+1;

        let roomKey = this.LYMJRoom.GetRoomProperty("key");
        let lb_paijuid = bg.getChildByName("lb_paijuid").getComponent(cc.Label);
        lb_paijuid.string = app.i18n.t("roomKey",{"roomKey": roomKey});

        let roomRecord = this.LYMJRoomMgr.GetEnterRoom().GetRoomRecord();
        let everyGameKeys = Object.keys(roomRecord);
        let everyGame = roomRecord[everyGameKeys[userData]];

        let lb_paijushijian = lb_paijuid.node.getChildByName("lb_id").getComponent(cc.Label);
        lb_paijushijian.string = this.ComTool.GetDateYearMonthDayHourMinuteString(everyGame["endTime"]);

        let posHuList = everyGame["posHuList"];
        let posHuListKeys = Object.keys(posHuList);
        for(let i = 0; i < this.playerList.length; i++ ){
            let playerInfo = this.playerList[i]
            let player = posHuList[playerInfo["pos"]];
            let playerPos = player["pos"];
            let playerIntegral = player["point"] > 0 ? ["+",player["point"]].join("") : player["point"];
            let playerHuType = player["huType"];
            this.SetPlayerInfo(i, playerIntegral, playerHuType);
        }
    },
    SetPlayerInfo:function (playerPos, playerIntegral, playerHuType) {
        
        let huTypeString = "";
        
        
        if(playerHuType == this.ShareDefine.HuType_ZiMo){
            huTypeString = app.i18n.t("ZiMo");
        }
        else if(playerHuType == this.ShareDefine.HuType_QGH){
            huTypeString = app.i18n.t("QiangGangHu");
        }
        else if(playerHuType == this.ShareDefine.HuType_SanJinDao){
            huTypeString = app.i18n.t("SanJinDao");
        }else if(playerHuType == this.ShareDefine.HuType_DanYou){
            huTypeString = app.i18n.t("DanYou");
        }else if(playerHuType == this.ShareDefine.HuType_ShuangYou){
            huTypeString = app.i18n.t("ShuangYou");
        }else if(playerHuType == this.ShareDefine.HuType_SanYou){
            huTypeString = app.i18n.t("SanYou");
        }else if(playerHuType == this.ShareDefine.HuType_QiangJin){
            huTypeString = app.i18n.t("QiangJin");
        }else if(playerHuType == this.ShareDefine.HuType_SiJinDao){
            huTypeString = app.i18n.t("SiJinDao");
        }else if(playerHuType == this.ShareDefine.HuType_WuJinDao){
            huTypeString = app.i18n.t("WuJinDao");
        }else if(playerHuType == this.ShareDefine.HuType_LiuJinDao){
            huTypeString = app.i18n.t("LiuJinDao");
        }
        else if(playerHuType == this.ShareDefine.HuType_ShiSanYao){
            huTypeString = app.i18n.t("ShiSanYao");
        }
        else if(playerHuType == this.ShareDefine.HuType_NotHu){
            huTypeString = "";
        }
        
        let bgStr = "bg"+this.playerList.length;
        let bg = this.node.getChildByName(bgStr);

        let lb_chengjiStr = "lb_chengji0"+(playerPos+1);
        let lb_chengji = bg.getChildByName(lb_chengjiStr).getComponent(cc.Label);
        lb_chengji.string = app.i18n.t("Integral",{"Integral":playerIntegral});

        let lb_hupai = lb_chengji.node.getChildByName("lb_hupai").getComponent(cc.Label);
        lb_hupai.string = huTypeString;
        lb_hupai.node.active = 1;
    },

    //-------------点击函数-------------

});