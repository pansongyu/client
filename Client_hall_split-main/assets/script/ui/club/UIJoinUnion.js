var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        numLabels:[cc.Label],
    },

    OnCreateInit: function () {
        this.InitCommon();
        this.InitEvent();
    },
    InitCommon:function(){
        this.labelString = [];
    },
    InitEvent:function(){
        //基础网络包
        this.RegEvent("OnReqJoinNtf", this.Event_ReqJoinNtf);
    },
    
    Event_ReqJoinNtf:function(event){
        let state = event.joinStatus;
        let notFind = app.ClubManager().Enum_JoinClub_NotFind;
        let clubFull = app.ClubManager().Enum_JoinClub_ClubFull;
        let numMax = app.ClubManager().Enum_JoinClub_NumMax;
        let inList = app.ClubManager().Enum_JoinClub_InList;
        let joinIng = app.ClubManager().Enum_JoinClub_JoinIng;
        let existClub = app.ClubManager().Enum_JoinClub_ExistClub;
        if(state == notFind){
            this.ShowSysMsg("MSG_CLUB_JOIN_NotFind");
        }
        else if(state == clubFull){
            this.ShowSysMsg("MSG_CLUB_JOIN_ClubFull");
        }
        else if(state == numMax){
            this.ShowSysMsg("MSG_CLUB_JOIN_NumMax");
        }
        else if(state == inList){
            this.ShowSysMsg("MSG_CLUB_JOIN_InList");
        }
        else if(state == joinIng){
            this.ShowSysMsg("MSG_CLUB_JOIN_JoinIng");
            this.Click_btn_reset();
        }
        else if(state == existClub){
            this.ShowSysMsg("MSG_CLUB_JOIN_ExistClub");
            this.Click_btn_reset();
        }
    },
    //--------------显示函数-----------------
    OnShow: function (clubId) {
        this.clubId = clubId;
        this.Click_btn_reset();
    },
    
    
    OnEventShow:function(event){
        let argDict = event.detail;
        let bReConnect = argDict["bReConnect"];

    },
    OnEventHide:function(event){

    },
    //---------点击函数---------------------
    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    SetWaitForConfirm:function(msgID,type){
        let ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, []);
        ConfirmManager.ShowConfirm(type, msgID, []);
    },
    OnConFirm:function(clickType, msgID, backArgList){
        if(clickType != "Sure"){
            return
        }
       
    },
    OnClick:function(btnName, btnNode){
        if('btn_Join' == btnName){
           this.Click_btn_Join();
        }
        else if('btn_return' == btnName){
           this.Click_btn_return();
        }
        else if('btn_reset' == btnName){
            this.Click_btn_reset();
        }
        else if('btn_clear' == btnName){
            this.Click_btn_clear();
        }
        else if(btnName.startsWith('btn_num')){
            let str = btnName.substring(btnName.length - 1);
            this.Click_btn_Num(str);
        }
    },
    Click_btn_Join:function(){
        if(6 != this.labelString.length){
            app.SysNotifyManager().ShowSysMsg('MSG_CLUB_JOIN_NotFind');
            return;
        }
        let str = this.labelString.join('');
        let unionSign = parseInt(str);
        let sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.unionSign = unionSign;
        let self = this;
        app.NetManager().SendPack("union.CUnionJoin",sendPack, function(serverPack){
            if (serverPack == 1) {
                app.SysNotifyManager().ShowSysMsg("申请加入成功",[],3);
            }else{
                //直接加入不需要申请
                app.SysNotifyManager().ShowSysMsg("加入成功",[],3);
                if (app.FormManager().GetFormComponentByFormName("ui/club/UIUnionNone")) {
                    app.FormManager().GetFormComponentByFormName("ui/club/UIUnionNone").CloseForm();
                }
                if (app.ClubManager().GetClubFormComponent()) {
                    app.ClubManager().GetClubFormComponent().OnShow();
                }
            }
            self.CloseForm();
        }, function(){
            app.SysNotifyManager().ShowSysMsg("加入失败",[],3);
        });
    },
    Click_btn_return:function(){
        this.CloseForm();
    },
    Click_btn_reset:function(){
        for(let i=0;i<this.numLabels.length;i++)
            this.numLabels[i].string = '';
        
        this.labelString = [];
    },
    Click_btn_clear:function(){
        if(0 == this.labelString.length){
            return
        }
        this.numLabels[this.labelString.length-1].string = '';
        this.labelString.pop();
    },
    Click_btn_Num:function(str){
        if(6 <= this.labelString.length)
            return;

        this.labelString.push(str);
        this.numLabels[this.labelString.length-1].string = str;
    },
    
    OnClose:function(){
        
    },
});