var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {

    },

    OnCreateInit: function () {

    },
    /*
    let data = {
                    "name":playerData.name,
                    "pid":app.ComTool().GetPid(playerData.pid),
                    "shareValue":serverPack.shareValue,
                    "shareFixedValue":serverPack.shareFixedValue,
                    "doShareValue":serverPack.doShareValue,
                    "shareType":serverPack.shareType,
                }
    */
    OnShow: function (data) {
        this.data = data;
        let lb_TargetPercent = this.node.getChildByName("lb_TargetPercent").getComponent(cc.RichText);
        lb_TargetPercent.string = "<color=#705d52>修改</c><color=#f8772c>" + data.name.substr(0,9) + "（ID:" + data.pid + "）" + "</color><color=#705d52>的报名费分成</c>";
        let lb_curPercent = this.node.getChildByName("lb_curPercent").getComponent(cc.Label);
        let lb_maxPercent = this.node.getChildByName("lb_maxPercent").getComponent(cc.Label);
        let lb_maxValue = this.node.getChildByName("lb_maxValue").getComponent(cc.Label);

        lb_maxPercent.string = "最高:" + data.doShareValue+"%,最小:"+data.minShareValue+"%";

        lb_maxValue.string = "最大:" + data.doShareFixedValue+",最小:"+data.minShareFixedValue+"";
        if(data.shareType==1){
            //固定值
            lb_curPercent.string = "该玩家当前报名费分成：" + data.shareFixedValue;
            this.node.getChildByName("PercentEditBox2").getComponent(cc.EditBox).string =  data.shareFixedValue;
            this.node.getChildByName("PercentEditBox").getComponent(cc.EditBox).string ="";
        }else{
            //最高可设置分成：10%
            this.maxValue=data.doShareValue;
            this.minValue=data.minShareValue;
            
            lb_curPercent.string = "该玩家当前报名费分成：" + data.shareValue+"%";
            //初始化比赛分输入框
            this.node.getChildByName("PercentEditBox").getComponent(cc.EditBox).string = data.shareValue;
            this.node.getChildByName("PercentEditBox2").getComponent(cc.EditBox).string ="";
        }
        this.InitShareType(data.shareType);
        //初始化比赛分输入框
        this.isChange=false;
    },
    SetIsChange:function(){
        this.isChange=true;
    },
    SetNotChange:function(){
        this.isChange=true;
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
        }else {
            ToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked=false;
            ToggleContainer.getChildByName("toggle2").getComponent(cc.Toggle).isChecked=false;
            ToggleContainer.getChildByName("toggle3").getComponent(cc.Toggle).isChecked=true;
        }
    },
    GetShareType:function(){
        let ToggleContainer=this.node.getChildByName("ToggleContainer");
        let toggle1=ToggleContainer.getChildByName("toggle2").getComponent(cc.Toggle).isChecked;
        let toggle3=ToggleContainer.getChildByName("toggle3").getComponent(cc.Toggle).isChecked;
        if(toggle1){
            return 1;
        }else if (toggle3) {
        	return 2;
        }
        return 0;
    },
    OnClick:function(btnName, btnNode){
        if(btnName == "btn_sure"){
                //固定值
                let shareType=this.GetShareType();
                let percentStr =-1;
                if(shareType==1){
                    //固定值
                    percentStr = this.node.getChildByName("PercentEditBox2").getComponent(cc.EditBox).string;
                    
                    if(parseFloat(percentStr)>this.data.doShareFixedValue){
                        app.SysNotifyManager().ShowSysMsg("输入值不能大于"+this.data.doShareFixedValue,[],3);
                        return;
                    }
                    if(parseFloat(percentStr)<this.data.minShareFixedValue){
                        app.SysNotifyManager().ShowSysMsg("输入值不能小于"+this.data.minShareFixedValue,[],3);
                        return;
                    }
                }else if(shareType==0){
                    //百分比
                    percentStr = this.node.getChildByName("PercentEditBox").getComponent(cc.EditBox).string;
                    if(percentStr>100){
                        app.SysNotifyManager().ShowSysMsg("请输入小于100的数字",[],3);
                        return;
                    }
                    if(parseFloat(percentStr)>this.maxValue){
                        app.SysNotifyManager().ShowSysMsg("输入值不能大于"+this.maxValue,[],3);
                        return;
                    }
                    if(parseFloat(percentStr)<this.minValue){
                        app.SysNotifyManager().ShowSysMsg("输入值不能小于"+this.minValue,[],3);
                        return;
                    }
                }else{
                    //区间
                    percentStr = 0;
                }
                if (parseFloat(percentStr) >= 0) {
                    let sendPack = app.ClubManager().GetUnionSendPackHead();
                    sendPack.pid = this.data.pid;
                    sendPack.value = parseFloat(percentStr);
                    sendPack.type=shareType;
                    let self = this;
                    app.NetManager().SendPack("club.CClubPromotionShareChange",sendPack, function(serverPack){
                        app.SysNotifyManager().ShowSysMsg("成功设置报名费分成",[],3);
                        //触发刷新上层
                        app.Client.OnEvent('UpdateBaoMingFeiFenCheng', serverPack);
                        self.CloseForm();
                    }, function(){
                        // app.SysNotifyManager().ShowSysMsg("设置报名费分成失败",[],3);
                    });


                }else{
                    app.SysNotifyManager().ShowSysMsg("请输入纯数字",[],3);
                }
        }else if(btnName == "btn_detail_value"){
            let data = {};
            data.opClubId = app.ClubManager().GetUnionSendPackHead().clubId;
            data.opPid = this.data.pid;
            data.shareFixedValue=this.data.shareFixedValue;
            app.FormManager().ShowForm("ui/club/UIUserSetBaoMingFeiDetail",data, 1);
            this.CloseForm();
        }else if(btnName == "btn_detail_percent"){
            let data = {};
            data.opClubId = app.ClubManager().GetUnionSendPackHead().clubId;
            data.opPid = this.data.pid;
            data.shareValue=this.data.shareValue;
            app.FormManager().ShowForm("ui/club/UIUserSetBaoMingFeiDetail",data, 0);
            this.CloseForm();
        }else if(btnName == "btn_detail_section"){
            let data = {};
            data.opClubId = app.ClubManager().GetUnionSendPackHead().clubId;
            data.opPid = this.data.pid;
            data.unionFlag = 0;
            data.shareValue=this.data.shareValue;
            app.FormManager().ShowForm("ui/club/UIUserSetSection",data);
            this.CloseForm();
        }else if(btnName == "btn_close"){
            this.CloseForm();
        }else{
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    },

});
