var app = require("app");
cc.Class({
    extends: require("BaseForm"),
    properties: {
    },

    OnCreateInit: function () {
       this.FormManager=app.FormManager();
       this.NetManager=app.NetManager();
       this.RegEvent("ShareSuccess", this.Event_ShareSuccess, this);
       this.ShareType=-1;
    },
    OnShow: function () {
       
    },
    Event_ShareSuccess:function(event){
        if(this.ShareType==1){
            let that=this;
            this.NetManager.SendPack("game.CPlayerReceiveShare",{},function(success){
                app.SysNotifyManager().ShowSysMsg("分享成功获取2个钻石");
                that.CloseForm();
            },function(error){
                app.SysNotifyManager().ShowSysMsg("您今日已经领取过钻石");
            });
        }
    },
    OnClick:function(btnName, btnNode){
        if('btn_share' == btnName){
            let title = app.Client.GetClientConfigProperty("WeChatShareTitle");
            let desc = app.Client.GetClientConfigProperty("WeChatShareDesc");
            let weChatAppShareUrl = app.Client.GetClientConfigProperty("WeChatAppShareUrl");
            let heroID = app.HeroManager().GetHeroProperty("pid");
            let cityId=app.HeroManager().GetHeroProperty("cityId");
            weChatAppShareUrl = weChatAppShareUrl+heroID+"&cityid="+cityId;;
            console.log("Click_btn_weixin:",title);
            console.log("Click_btn_weixin:",desc);
            console.log("Click_btn_weixin:",weChatAppShareUrl);
            this.ShareType=1;
            app.FormManager().ShowForm("UIShareImg");
        }
    },
});
