var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        lb_hupaizongcishu:cc.Label,
        lb_time:cc.Label,
        lb_roomID:cc.Label,
        player1Name:cc.Label,
        btn_head1:cc.Node,
        player1ShanDian:cc.Label,
        player1JiFen:cc.Label,
        player1FangZhu:cc.Node,

        player2Name:cc.Label,
        btn_head2:cc.Node,
        player2ShanDian:cc.Label,
        player2JiFen:cc.Label,
        player2FangZhu:cc.Node,

        player3Name:cc.Label,
        btn_head3:cc.Node,
        player3ShanDian:cc.Label,
        player3JiFen:cc.Label,
        player3FangZhu:cc.Node,

        player4Name:cc.Label,
        btn_head4:cc.Node,
        player4ShanDian:cc.Label,
        player4JiFen:cc.Label,
        player4FangZhu:cc.Node,

        player1DaYingJia:cc.Node,
        player2DaYingJia:cc.Node,
        player3DaYingJia:cc.Node,
        player4DaYingJia:cc.Node,

        plyaer1Sprite:cc.Node,
        plyaer2Sprite:cc.Node,
        plyaer3Sprite:cc.Node,
        plyaer4Sprite:cc.Node,

        lb_room:cc.Node,
    },

    OnCreateInit: function () {
       
        this.RegEvent("CodeError", this.Event_CodeError);

    },
    GetCurrentTime:function(){
        var date = new Date();
        var seperator1 = "/";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes();
        return currentdate;
    },
    InitPlayerInfo:function () {
        this.lb_hupaizongcishu.string = "";

        this.player1Name.string = "";
        this.player1ShanDian.string = "";
        this.player1JiFen.string = "";
        this.player1FangZhu.active = 0;
        this.player1DaYingJia.active = 0;

        this.player2Name.string = "";
        this.player2ShanDian.string = "";
        this.player2JiFen.string = "";
        this.player2FangZhu.active = 0;
        this.player2DaYingJia.active = 0;

        this.player3Name.string = "";
        this.player3ShanDian.string = "";
        this.player3JiFen.string = "";
        this.player3FangZhu.active = 0;
        this.player3DaYingJia.active = 0;

        this.player4Name.string = "";
        this.player4ShanDian.string = "";
        this.player4JiFen.string = "";
        this.player4FangZhu.active = 0;
        this.player4DaYingJia.active = 0;
    },
    OnShow: function () {
        var GamePlayManager = require('GamePlayManager');
		this.RoomMgr =GamePlayManager.RoomMrg(GamePlayManager.playgame);
        
        let room = this.RoomMgr.GetEnterRoom();

        this.ComTool = app.ComTool();
        this.HeroManager = app.HeroManager();

        this.WeChatHeadImage1 = this.btn_head1.getComponent("WeChatHeadImage");
        this.WeChatHeadImage2 = this.btn_head2.getComponent("WeChatHeadImage");
        this.WeChatHeadImage3 = this.btn_head3.getComponent("WeChatHeadImage");
        this.WeChatHeadImage4 = this.btn_head4.getComponent("WeChatHeadImage");


        this.playerDaYingJiaList = [this.player1DaYingJia,this.player2DaYingJia,this.player3DaYingJia,this.player4DaYingJia];
        //显示时间
        this.lb_time.string=this.GetCurrentTime();
        //获取房间号
        let roomKey = room.GetRoomProperty("key");
        console.log("RoomDateInfo:",room.GetRoomDataInfo);
        this.lb_roomID.string = roomKey;
        
        
        
        
        this.data = {
                        "boolean":"",
                        "pos":"",
                    };
        this.Remember = null;


        this.InitPlayerInfo();

        this.SetPlayerInfo();

        this.ShowDaYingJia(room);

        if(app.ShareDefine().isCoinRoom){
            this.lb_room.active = false;
            this.player1FangZhu.active = false;
            this.player2FangZhu.active = false;
            this.player3FangZhu.active = false;
            this.player4FangZhu.active = false;
        }
    },
    SetPlayerInfo:function () {
        let room = this.RoomMgr.GetEnterRoom();
        if(!room) return;
        let roomEnd = room.GetRoomProperty("roomEnd");
        let record = roomEnd["record"];

        let clientPos = room.GetRoomPosMgr().GetClientPos();
        let clientDownPos = room.GetRoomPosMgr().GetClientDownPos();
        let clientFacePos = room.GetRoomPosMgr().GetClientFacePos();
        let clientUpPos = room.GetRoomPosMgr().GetClientUpPos();

        let playerList = record["players"];
        let fastCntList = record["fastCnt"];
        let pointList = record["point"];

        let clientPosPlayer = playerList[clientPos];
        let huCardNum = record["huCnt"][clientPos];
        if(huCardNum){
            this.lb_hupaizongcishu.string = huCardNum;
        }
        else{
            this.lb_hupaizongcishu.string = 0;
        }

        if(clientPosPlayer)
        {

            this.plyaer1Sprite.active = 1;


            let clientPosfastCnt = fastCntList[clientPos];
            let clientPosPoint = pointList[clientPos];
            let clientPosPlayerPath = "sp_player01/touxiang/sp_info/lb_name";
            this.SetPlayerPosInfo(clientPosPlayer, clientPosfastCnt, clientPosPoint, clientPosPlayerPath, this.player1ShanDian, this.player1JiFen, this.WeChatHeadImage1);
        }
        else{
            this.plyaer1Sprite.active = 0;
        }


        let clientDownPosPlayer = playerList[clientDownPos];
        if(clientDownPosPlayer)
        {
            this.plyaer2Sprite.active = 1;

            let clientDownPosfastCnt = fastCntList[clientDownPos];
            let clientDownPosPoint = pointList[clientDownPos];
            let clientDownPosPlayerPath = "sp_player02/touxiang/sp_info/lb_name";
            this.SetPlayerPosInfo(clientDownPosPlayer, clientDownPosfastCnt, clientDownPosPoint, clientDownPosPlayerPath, this.player2ShanDian, this.player2JiFen, this.WeChatHeadImage2);

        }
        else {
            this.plyaer2Sprite.active = 0;
        }

        let clientFacePosPlayer = playerList[clientFacePos];
        if(clientFacePosPlayer)
        {
            this.plyaer3Sprite.active = 1;

            let clientFacePosfastCnt = fastCntList[clientFacePos];
            let clientFacePosPoint = pointList[clientFacePos];
            let clientFacePosPlayerPath = "sp_player03/touxiang/sp_info/lb_name";
            this.SetPlayerPosInfo(clientFacePosPlayer, clientFacePosfastCnt, clientFacePosPoint, clientFacePosPlayerPath, this.player3ShanDian, this.player3JiFen, this.WeChatHeadImage3);

        }
        else{
            this.plyaer3Sprite.active = 0;
        }

        let clientUpPosPlayer = playerList[clientUpPos];
        if(clientUpPosPlayer)
        {
            this.plyaer4Sprite.active = 1;

            let clientUpPosfastCnt = fastCntList[clientUpPos];
            let clientUpPosPoint = pointList[clientUpPos];
            let clientUpPosPlayerPath = "sp_player04/touxiang/sp_info/lb_name";
            this.SetPlayerPosInfo(clientUpPosPlayer, clientUpPosfastCnt, clientUpPosPoint, clientUpPosPlayerPath, this.player4ShanDian, this.player4JiFen, this.WeChatHeadImage4);

        }
        else{
            this.plyaer4Sprite.active = 0;
        }

    },
    SetPlayerPosInfo:function (player, fastCnt, point, playerHeadPath, playerShanDian, playerJiFen, WeChatHeadImage) {
        let clientPosPlayerName = player["name"];
        this.GetWndComponent(playerHeadPath, cc.Label).string = clientPosPlayerName;

        let shanDianNum = fastCnt;
        playerShanDian.string = shanDianNum;

        let jiFenNum = point > 0 ? ["+",point].join("") : point;
        playerJiFen.string = jiFenNum;

        let pid = player["pid"];
        WeChatHeadImage.ShowHeroHead(pid);
    },
    ShowDaYingJia:function (room) {
        let clientPos = room.GetRoomPosMgr().GetClientPos();
        let clientDownPos = room.GetRoomPosMgr().GetClientDownPos();
        let clientFacePos = room.GetRoomPosMgr().GetClientFacePos();
        let clientUpPos = room.GetRoomPosMgr().GetClientUpPos();

        let roomEnd = room.GetRoomProperty("roomEnd");
        let record = roomEnd["record"];
        let playerPointList = record["point"];
        let point = this.ComTool.ListMaxNum(playerPointList);
        let count = playerPointList.length;
        for(let i = 0; i < count; i++){
            if(point == playerPointList[i]){
                if(i == clientPos){
                    this.playerDaYingJiaList[0].active = 1;
                }
                else if(i == clientDownPos){
                    this.playerDaYingJiaList[1].active = 1;
                }
                else if(i == clientFacePos){
                    this.playerDaYingJiaList[2].active = 1;
                }
                else if(i == clientUpPos){
                    this.playerDaYingJiaList[3].active = 1;
                }
            }
        }

        let ownerID = room.GetRoomProperty("ownerID");

        let playerList = record["players"];
        let playerListKey = Object.keys(playerList);
        let ownerPos = "";
        for(let i = 0; i < count; i++){
            let player = playerList[playerListKey[i]];
            if(!player) continue;
            if(player["pid"] == ownerID){
                ownerPos = i;
            }
        }
        if(ownerPos == clientPos){
            this.player1FangZhu.active = 1;
        }
        else if(ownerPos == clientDownPos){
            this.player2FangZhu.active = 1;
        }
        else if(ownerPos == clientFacePos){
            this.player3FangZhu.active = 1;
        }
        else if(ownerPos == clientUpPos){
            this.player4FangZhu.active = 1;
        }

    },

    
    OnClick:function(btnName, btnNode){
        if(btnName == "btn_xuanyao"){
	        this.FormManager.ShowForm("UIShare");
        }
        else if(btnName == "btn_fanhui"){
	        app.SceneManager().LoadScene("mainScene");
        }
        else if(btnName == "btn_jixu"){
	    //    this.FormManager.AddDefaultFormName("UICreatRoom");
            if(app.ShareDefine().isCoinRoom){
                app.NetManager().SendPack('game.CGoldRoom', {practiceId:app.ShareDefine().practiceId}, this.OnSuccess.bind(this),this.OnEnterRoomFailed.bind(this));
            }
            else{
                app.SceneManager().LoadScene("mainScene");
            }
        }
        else{
            this.ErrLog("OnClick not find btnName(%s)", btnName);
        }
    },

    OnSuccess:function(serverPack){
        let roomID = serverPack.roomID;
        app.NetManager().SendPack('lymj.CLYMJGetRoomInfo', {"roomID":roomID});
    },
    OnEnterRoomFailed:function(serverPack){
        app.SceneManager().LoadScene("mainScene");
    },
    Event_CodeError:function(event){
        let argDict = event.detail;
        let code = argDict["Code"];
        if(code == app.ShareDefine().NotEnoughCoin){
            this.WaitForConfirm("MSG_NOTROOMCOIN", [], [], this.ShareDefine.Confirm);
        }
        else if(code == app.ShareDefine().MuchCoin){
            this.WaitForConfirm("MSG_TOOMUCHCOIN", [], [], this.ShareDefine.ConfirmOK);
        }
    },

    //-----------2次确认框回调--------------
    OnConFirm:function(clickType, msgID, backArgList){
        if(clickType != "Sure"){
            return
        }
        if(msgID == "RewardWholePlayer"){
            let roomCard = this.HeroManager.GetHeroProperty("roomCard");
            if(roomCard >= 3){
                let roomID = this.RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
                this.RoomMgr.SendPlayerReward(roomID);
            }
            else{
                this.ShowSysMsg("WarnFastCardNotEnough");
            }
        }
        else if(msgID == "MSG_NOTROOMCOIN"){
            this.CloseForm();
            app.FormManager().AddDefaultFormName("UIStore");
            app.SceneManager().LoadScene("mainScene");
        }
        else if("MSG_TOOMUCHCOIN" == msgID){
            app.FormManager().AddDefaultFormName("UIPractice");
            app.SceneManager().LoadScene("mainScene");
        }
    },
   
});
