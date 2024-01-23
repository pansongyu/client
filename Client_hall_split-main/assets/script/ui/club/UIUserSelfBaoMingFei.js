var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {

    },

    OnCreateInit: function () {

    },
    OnShow: function (data) {
        this.data = data;
        if(data.shareType==1){
            //固定值
            this.node.getChildByName("PercentEditBox2").getComponent(cc.EditBox).string =  data.shareFixedValue;
            this.node.getChildByName("PercentEditBox").getComponent(cc.EditBox).string ="";
        }else if(data.shareType==0){
            //初始化比赛分输入框
            this.node.getChildByName("PercentEditBox").getComponent(cc.EditBox).string = data.shareValue;
            this.node.getChildByName("PercentEditBox2").getComponent(cc.EditBox).string ="";
        }else if(data.shareType==2){
            //区间
            this.node.getChildByName("PercentEditBox").getComponent(cc.EditBox).string = "";
            this.node.getChildByName("PercentEditBox2").getComponent(cc.EditBox).string ="";
        }
        this.InitShareType(data.shareType);
    },
    InitShareType:function(shareType){
        let ToggleContainer=this.node.getChildByName("ToggleContainer");
        if(shareType==1){
            ToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked=false;
            ToggleContainer.getChildByName("toggle2").getComponent(cc.Toggle).isChecked=true;
            ToggleContainer.getChildByName("toggle3").getComponent(cc.Toggle).isChecked=false;
        }else if(shareType==0){
            ToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked=true;
            ToggleContainer.getChildByName("toggle2").getComponent(cc.Toggle).isChecked=false;
            ToggleContainer.getChildByName("toggle3").getComponent(cc.Toggle).isChecked=false;
        }else if(shareType==2){
            ToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked=false;
            ToggleContainer.getChildByName("toggle2").getComponent(cc.Toggle).isChecked=false;
            ToggleContainer.getChildByName("toggle3").getComponent(cc.Toggle).isChecked=true;
        }
    },
    OnClick:function(btnName, btnNode){
        if(btnName == "btn_sure"){
            this.CloseForm();
        }else if(btnName == "btn_detail_value"){
            let data = {};
            data.opClubId = app.ClubManager().GetUnionSendPackHead().clubId;
            data.opPid = this.data.pid;
            data.shareFixedValue=this.data.shareFixedValue;
            app.FormManager().ShowForm("ui/club/UIUserSetBaoMingFeiDetail",data, 1, true);
            this.CloseForm();
        }else if(btnName == "btn_detail_percent"){
            let data = {};
            data.opClubId = app.ClubManager().GetUnionSendPackHead().clubId;
            data.opPid = this.data.pid;
            data.shareValue=this.data.shareValue;
            app.FormManager().ShowForm("ui/club/UIUserSetBaoMingFeiDetail",data, 0, true);
            this.CloseForm();
        }else if(btnName == "btn_detail_section"){
            let data = {};
            data.opClubId = app.ClubManager().GetUnionSendPackHead().clubId;
            data.opPid = this.data.pid;
            data.unionFlag = 0;
            data.shareValue=this.data.shareValue;
            app.FormManager().ShowForm("ui/club/UIUserSetSection",data, true);
            this.CloseForm();
        }else if(btnName == "btn_close"){
            this.CloseForm();
        }else{
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    },

});
