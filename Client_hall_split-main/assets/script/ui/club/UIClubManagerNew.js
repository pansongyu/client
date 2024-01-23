/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        btn_outclub:cc.Node,
        btn_dissolveclub:cc.Node,
        btn_diamond:cc.Node,
    },

    //初始化
    OnCreateInit:function(){

    },

    //---------显示函数--------------------
    OnShow:function(clubId,unionId,myisminister){
        this.clubId = clubId;
        this.unionId=unionId;
        this.myisminister = myisminister;
        if (this.myisminister == app.ClubManager().Club_MINISTER_CREATER) {
            this.btn_outclub.active = false;
            this.btn_dissolveclub.active = true;
            this.btn_diamond.active = unionId==0;
        }else{
            this.btn_outclub.active = true;
            this.btn_dissolveclub.active = false;
            this.btn_diamond.active = false;
        }
    },
    //---------点击函数---------------------
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
            return
        }
        if('MSG_CLUB_DissolveRoom' == msgID){
            //this.FormManager.ShowForm('ui/club/UIClubDissolve',this.clubId,this.myisminister);
            //app.ClubManager().SendCloseClub(this.clubId);
            //this.FormManager.CloseFormReal('ui/club/UIClubMain');
        }else if('MSG_CLUB_EXIT' == msgID){
            app.ClubManager().SendPlayerStateChange(this.clubId,app.HeroManager().GetHeroProperty("pid"),app.ClubManager().Enum_Leave);
            this.FormManager.CloseFormReal('ui/club/UIClubMain');
        }
        this.CloseForm();
    },
    //---------点击函数---------------------

	OnClick:function(btnName, btnNode){
		if('btn_close'==btnName){
        	this.CloseForm();
        }else if('btn_outclub'==btnName){
            this.SetWaitForConfirm('MSG_CLUB_EXIT',this.ShareDefine.Confirm,[],[]);
        }else if('btn_dissolveclub'==btnName){
            this.FormManager.ShowForm('ui/club/UIClubDissolve',this.clubId,0,1);
            this.CloseForm();
            //this.SetWaitForConfirm('MSG_CLUB_DissolveRoom',this.ShareDefine.Confirm,[],[]);
        }else if('btn_diamond'==btnName){
            this.FormManager.ShowForm('ui/club/UIClubDiamond',this.clubId,this.unionId);
            this.CloseForm();
            //this.SetWaitForConfirm('MSG_CLUB_DissolveRoom',this.ShareDefine.Confirm,[],[]);
        }else{
			this.ErrLog("OnClick:%s not find", btnName);
		}
	},
});
