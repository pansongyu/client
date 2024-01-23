var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {

    },

    OnCreateInit: function () {

    },
    OnShow: function (data) {
        this.data = data;
        let lb_tip = this.node.getChildByName("lb_tip").getComponent(cc.Label);
        if (typeof(data.isPersonal) != "undefined" && data.isPersonal) {
            //个人的
             lb_tip.string = "设置预警值后，该玩家【"+data.name+"】比赛分低于预警值将无法游戏";
        }else if (typeof(data.clubId) == "undefined") {
            //推广员的
            lb_tip.string = "设置预警值后，该推广员（含分支下所有玩家）的总比塞分低于预警值，则该推广员及分支下所有玩家将被禁止游戏";
        }else{
            //赛事的
            lb_tip.string = "设置预警值后，该亲友圈【"+data.name+"("+data.clubSign+")"+"】内所有玩家的总比赛分低于预警值，则该亲友圈的玩家将被禁止游戏";
        }
        this.node.getChildByName("PercentEditBox").getComponent(cc.EditBox).string =this.data.sportsPointWarning;
        this.InitShareType(data.warnStatus);
        //初始化比赛分输入框
        this.isChange=false;
    },
    SetIsChange:function(){
        this.isChange=true;
    },
    SetNotChange:function(){
        this.isChange=true;
    },
    InitShareType:function(warnStatus){
        let ToggleContainer=this.node.getChildByName("ToggleContainer");
        if(warnStatus==0){
            ToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked=false;
            ToggleContainer.getChildByName("toggle2").getComponent(cc.Toggle).isChecked=true;
        }else{
            ToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked=true;
            ToggleContainer.getChildByName("toggle2").getComponent(cc.Toggle).isChecked=false;
        }
    },
    GetShareType:function(){
        let ToggleContainer=this.node.getChildByName("ToggleContainer");
        let toggle1=ToggleContainer.getChildByName("toggle2").getComponent(cc.Toggle).isChecked;
        if(toggle1){
            return 0;
        }
        return 1;
    },
    OnClick:function(btnName, btnNode){
        if(btnName == "btn_sure"){
            //预警值
            let warnStatus=this.GetShareType();
            let percentStr =this.node.getChildByName("PercentEditBox").getComponent(cc.EditBox).string;
            
            if (app.ComTool().StrIsNum(percentStr)) {
                let sendPack = app.ClubManager().GetUnionSendPackHead();
                if (typeof(this.data.isPersonal) != "undefined" && this.data.isPersonal) {
                    //个人的
                    sendPack.pid = this.data.pid;
                    sendPack.value = parseFloat(percentStr);
                    sendPack.warnStatus=warnStatus;
                    let self = this;
                    app.NetManager().SendPack("club.CClubPersonalSportsPointWarningChange",sendPack, function(serverPack){
                        app.SysNotifyManager().ShowSysMsg("成功设置预警值",[],3);
                        self.CloseForm();
                    }, function(){
                        app.SysNotifyManager().ShowSysMsg("设置预警值失败",[],3);
                    });
                }else if (typeof(this.data.clubId) == "undefined") {
                    sendPack.pid = this.data.pid;
                    sendPack.value = parseFloat(percentStr);
                    sendPack.warnStatus=warnStatus;
                    let self = this;
                    app.NetManager().SendPack("club.CClubSportsPointWarningChange",sendPack, function(serverPack){
                        app.SysNotifyManager().ShowSysMsg("成功设置预警值",[],3);
                        self.CloseForm();
                    }, function(){
                        app.SysNotifyManager().ShowSysMsg("设置预警值失败",[],3);
                    });
                }else{
                    sendPack.opClubId = this.data.clubId;
                    sendPack.opPid = this.data.createId;
                    sendPack.value = parseFloat(percentStr);
                    sendPack.warnStatus=warnStatus;
                    let self = this;
                    app.NetManager().SendPack("union.CUnionSportsPointWarningChange",sendPack, function(serverPack){
                        app.SysNotifyManager().ShowSysMsg("成功设置预警值",[],3);
                        self.CloseForm();
                    }, function(){
                        app.SysNotifyManager().ShowSysMsg("设置预警值失败",[],3);
                    });
                }
            }else{
                app.SysNotifyManager().ShowSysMsg("请输入纯数字",[],3);
            }
        }else if(btnName == "btn_close"){
            this.CloseForm();
        }else{
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    },

});
