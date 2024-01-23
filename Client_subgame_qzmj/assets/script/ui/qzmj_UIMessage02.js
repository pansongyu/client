/*
 UIMessage 模态消息界面
 */

var app = require("qzmj_app");

cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
    },

    //初始化
    OnCreateInit:function(){
    	this.ZorderLv = 9;
    	this.lb_time = this.GetWndNode("image01/TimeMessage/lb_time").getComponent(cc.Label);
    	this.LabelMessage = this.GetWndNode("image01/LabelMessage").getComponent(cc.Label);
    	this.playerNodes = this.node.getChildByName("playerNode").children;
	    this.btnCancel = this.node.getChildByName("btnCancel").getComponent(cc.Button);
	    this.btnSure = this.node.getChildByName("btnSure").getComponent(cc.Button);

        this.RegEvent("PosDealVote", this.Event_PosDealVote, this);
        this.RegEvent("CodeError", this.Event_CodeError, this);
    },

    //---------显示函数--------------------

    OnShow:function () {
        this.RoomMgr =app[app.subGameName.toUpperCase()+"RoomMgr"]();
        this.RoomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();

        let room = this.RoomMgr.GetEnterRoom();
        if(room.IsClientIsOwner()){
            this.btnCancel.interactable = 0;
            this.btnSure.interactable = 0;
        }
        this.ShowPosAgree(room);
        let dissolveInfo = room.GetRoomProperty("dissolve");
        let createPos = dissolveInfo["createPos"];
        let roomPosMgr = room.GetRoomPosMgr();
        let posName = roomPosMgr.GetPlayerInfoByPos(createPos).name;
        let LabelMessage = app.i18n.t("DissolutiontText",{"Name": posName});
        this.LabelMessage.string = LabelMessage;
        this.endSec = room.GetRoomProperty("dissolve")["endSec"];
        let timeString = app[app.subGameName+"_ServerTimeManager"]().GetCDTimeStringBySec(this.endSec, this.ShareDefine.ShowSecondSec);
        this.lb_time.string = timeString;

        this.updateTime = new Date().getTime();
    },
    ShowPosAgree:function (room) {
        let roomPosMgr = room.GetRoomPosMgr();
        let dissolveInfo = room.GetRoomProperty("dissolve");
        let posAgreeList = dissolveInfo["posAgreeList"];
        let allPlayers = roomPosMgr.GetRoomAllPlayerInfo();
        let createPos = dissolveInfo["createPos"];
        let clientPos = roomPosMgr.GetClientPos();
        let playingList = [];
        for(let idx in allPlayers){
            playingList.push(allPlayers[idx]);
        }
        let canClick = true;
        for(let i=0;i<this.playerNodes.length;i++){
            this.playerNodes[i].active = false;
            this.playerNodes[i].getChildByName('icon_jujue').active = false;
            this.playerNodes[i].getChildByName('icon_tongyi').active = false;
            if(i < playingList.length && playingList[i].pid){
                let nameLabel = this.playerNodes[i].getChildByName('name').getComponent(cc.Label);
                nameLabel.string = playingList[i].name;
                //0未表态 1支持 2拒绝
                if(0 == posAgreeList[i]){

                }
                else if(1 == posAgreeList[i]){
                    this.playerNodes[i].getChildByName('icon_tongyi').active = true;
                    if(i == clientPos)
                        canClick = false;
                }
                else{
                    this.playerNodes[i].getChildByName('icon_jujue').active = true;
                    this.CloseForm();
                    if(i == clientPos)
                        canClick = false;
                }
                
                this.playerNodes[i].active = true;
            }
        }
        if(createPos == clientPos)
            canClick = false;
        this.Show_btnCancel_btnSure(canClick);
    },
    Show_btnCancel_btnSure:function(canClick){
        if(canClick){
            this.btnCancel.interactable = 1;
            this.btnCancel.enableAutoGrayEffect = 0;
            this.btnSure.interactable = 1;
            this.btnSure.enableAutoGrayEffect = 0;
        }
        else{
            this.btnCancel.interactable = 0;
            this.btnCancel.enableAutoGrayEffect = 1;
            this.btnSure.interactable = 0;
            this.btnSure.enableAutoGrayEffect = 1;
        }
    },
    //---------回调函数--------------------
    Event_CodeError:function(event){
        let argDict = event;
        let code = argDict["Code"];
        if(code == this.ShareDefine.NotExistRoom){
            try{
                this.CloseForm();
            }
            catch(error){
                
            }
        }
    },
    //收到同意/拒绝解散房间
    Event_PosDealVote:function(event){
        let room = this.RoomMgr.GetEnterRoom();
        let argDict = event;
        let posAgreeList = argDict["posAgreeList"];
        let createPos = argDict["createPos"];
        let clientPos = room.GetRoomPosMgr().GetClientPos();
        for(let i = 0; i < posAgreeList.length; i++){
            if(posAgreeList[i] == 2){//0未表态 1支持 2拒绝
                this.FormManager.CloseForm(app.subGameName + "_UIMessage02");
                let Name = this.RoomMgr.GetEnterRoom().GetRoomPosMgr().GetPlayerInfoByPos(i)["name"];
                room.ClearDissolve();
                this.ShowSysMsg("PlayersRefusedToDisband",[Name]);
                return;
            }
            else if(posAgreeList[i] == 1){
                this.playerNodes[i].getChildByName('icon_tongyi').active = true;
            }
            else{

            }
        }
    },
 
    //---------刷新函数--------------------
    OnUpdate:function () {
        if(this.endSec){
            let time = new Date().getTime();
            if( time < this.updateTime){
                let timeString = app[app.subGameName+"_ServerTimeManager"]().GetCDTimeStringBySec(this.endSec, this.ShareDefine.ShowSecondSec);
                let num = parseInt(timeString);
                if(!num){
                    this.CloseForm();
                    return;
                }
                this.lb_time.string = timeString;
            }
            else{
                this.updateTime += 500;
            }
        }
    },

    //---------点击函数---------------------
    OnClick:function(btnName, btnNode){
        let room = this.RoomMgr.GetEnterRoom();
        let roomID = this.RoomMgr.GetEnterRoomID();
        if(btnName == "btnCancel"){
           // this.RoomMgr.SendDissolveRoomRefuse(roomID);
            app[app.subGameName + "_GameManager"]().SendDissolveRoomRefuse(roomID);
            this.Show_btnCancel_btnSure(false);
        }
        else if(btnName == "btnSure"){
            //this.RoomMgr.SendDissolveRoomAgree(roomID);
            app[app.subGameName + "_GameManager"]().SendDissolveRoomAgree(roomID);
            this.Show_btnCancel_btnSure(false);
        }
    },

});
