/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        LabelMessage:cc.RichText,
        lb_wanfa:cc.Label,
        lb_roomname:cc.Label,
        toggle_yaoqing:cc.Node,
    },

    //初始化
    OnCreateInit:function(){
        this.commonColor = "<color=#705d52>";
        this.clubNameColor = "<color=#daa235>";
        this.playerNameColor = "<color=#f8772c>";
        this.gameNameColor = "<color=#639349>";
        this.allInvitation = [];
        this.invitationData = null;
    },

    //---------显示函数--------------------

    OnShow:function(Data){
        this.allInvitation.push(Data);
        this.ShowMsgInfo();
    },

    ShowMsgInfo:function(){
        if (this.allInvitation.length <= 0) {
            this.CloseForm();
            return;
        }
        this.invitationData = this.allInvitation[0];
        this.allInvitation.splice(0, 1);
        if (this.invitationData == null) {
            this.CloseForm();
            return;
        }
        let gameName = app.ShareDefine().GametTypeID2Name[this.invitationData.gameId];
        let invitationStr = ""+this.clubNameColor+this.invitationData.name+this.commonColor+"的成员"+this.playerNameColor+this.invitationData.playerName+this.commonColor+"邀请您参与"+this.gameNameColor+gameName;
        this.LabelMessage.string = invitationStr;
        let gameType = app.ShareDefine().GametTypeID2PinYin[this.invitationData.gameId];
        let wanfaStr = app.RoomCfgManager().WanFa(gameType,this.invitationData.baseCreateRoom);
        this.lb_wanfa.string = wanfaStr;
        //显示房间名字
        if(typeof(this.invitationData["baseCreateRoom"]['roomName'])!="undefined"){
            this.lb_roomname.string=this.invitationData["baseCreateRoom"]['roomName'];
        }else{
            this.lb_roomname.string="";
        }
    },

    OnClose:function(){

    },
    click_toggle_jujue:function(){
            let check=this.toggle_yaoqing.getComponent(cc.Toggle).isChecked;
            if(check==false){
                //已经是不接受邀请
                app.NetManager().SendPack('club.CClubChangePlayerInvite',{type:0},function(serverPack){
                },function(error){
                    console.error(error);
                });
            }else{
                app.NetManager().SendPack('club.CClubChangePlayerInvite',{type:1},function(serverPack){
                },function(error){
                    console.error(error);
                });
                 /*this.SetWaitForConfirm(
                    'MSG_CLUB_YaoQing',
                    this.ShareDefine.Confirm,
                    [],
                    [],
                );*/
            }
    },
    //---------点击函数---------------------
	OnClick:function(btnName, eventData){
		if(btnName == "btnSure"){
            let gameType = app.ShareDefine().GametTypeID2PinYin[this.invitationData.gameId];
            app.Client.JoinRoomCheckSubGame(gameType, this.invitationData.roomKey, this.invitationData.clubId);
            this.allInvitation = [];
            this.invitationData = null;
            this.CloseForm();
		}else if(btnName == "btnCancel"){
            if (this.allInvitation.length > 0) {
                this.ShowMsgInfo();
                return;
            }
            this.invitationData = null;
            this.CloseForm();
		}else if(btnName == "btn_close"){
            if (this.allInvitation.length > 0) {
                this.ShowMsgInfo();
                return;
            }
            this.invitationData = null;
            this.CloseForm();
        }else{
			this.ErrLog("OnClick:%s not find", btnName);
		}
	},
    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    SetWaitForConfirm:function(msgID,type,msgArg=[],cbArg=[]){
        let ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
        ConfirmManager.ShowConfirm(type, msgID, msgArg);
    },
    OnConFirm:function(clickType, msgID, backArgList){
        if(clickType != "Sure"){
            this.toggle_yaoqing.getComponent(cc.Toggle).isChecked=false;
            return
        }
        let self = this;
        if('MSG_CLUB_YaoQing' == msgID){
            app.NetManager().SendPack('club.CClubChangePlayerInvite',{type:1},function(serverPack){
            },function(error){
                 console.error(error);
            });
        }
    },
});
