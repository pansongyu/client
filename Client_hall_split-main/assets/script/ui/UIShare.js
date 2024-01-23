var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {

    },
    OnCreateInit: function () {
        this.NetManager = app.NetManager();
        this.RegEvent("ShareSuccess", this.Event_ShareSuccess, this);
        this.ShareType = -1;

        this.btn_py = this.GetWndNode("bg_create/btn_py");//微信分享
        this.btn_pyq = this.GetWndNode("bg_create/btn_pyq"); // 朋友圈
        this.btn_lineShareLink = this.GetWndNode("bg_create/btn_lineShareLink"); // line 分享 宝岛 大联盟棋牌
        // 分享按钮
        this.ShowShareBtn();
    },

    OnShow: function () {
        // this.NetManager.SendPack("game.CPlayerRebate",{},function(success){},function(error){
        //     app.SysNotifyManager().ShowSysMsg("系统数据获取出错，请稍后重试");
        // });
    },

    ShowShareBtn: function () {
        let appName = this.GetAppName();
        let isShowLineShare = appName == "baodao";
        
        this.btn_py.active = !isShowLineShare;
        this.btn_pyq.active = !isShowLineShare;
        
        this.btn_lineShareLink.active = isShowLineShare;
    },

    Event_ShareSuccess: function (event) {
        if (this.ShareType == 1) {
            let that = this;
            this.NetManager.SendPack("game.CPlayerReceiveShare", {}, function (success) {
                app.SysNotifyManager().ShowSysMsg("分享成功获取2个钻石");
            }, function (error) {
                app.SysNotifyManager().ShowSysMsg("您今日已经领取过钻石");
            });
        }
    },

    OnClick: function (btnName, btnNode) {
        if ('btn_py' == btnName) {
            let title = app.Client.GetClientConfigProperty("WeChatShareTitle");
            let desc = app.Client.GetClientConfigProperty("WeChatShareDesc");
            let weChatAppShareUrl = app.Client.GetClientConfigProperty("WeChatAppShareUrl");
            let heroID = app.HeroManager().GetHeroProperty("pid");
            let cityId = app.HeroManager().GetHeroProperty("cityId");
            weChatAppShareUrl = weChatAppShareUrl + heroID + "&cityid=" + cityId;
            if (app.Config.share && app.Config.share.length > 3) {
                weChatAppShareUrl = app.Config.share
            }
            this.ShareType = 0;
            this.SDKManager.Share(title, desc, weChatAppShareUrl, "0");
        }
        else if ('btn_pyq' == btnName) {
            let title = app.Client.GetClientConfigProperty("WeChatShareTitle");
            let desc = app.Client.GetClientConfigProperty("WeChatShareDesc");
            let weChatAppShareUrl = app.Client.GetClientConfigProperty("WeChatAppShareUrl");
            let heroID = app.HeroManager().GetHeroProperty("pid");
            let cityId = app.HeroManager().GetHeroProperty("cityId");
            weChatAppShareUrl = weChatAppShareUrl + heroID + "&cityid=" + cityId;
            if (app.Config.share && app.Config.share.length > 3) {
                weChatAppShareUrl = app.Config.share
            }
            this.ShareType = 1;
            // app.FormManager().ShowForm("UIShareImg");
            this.SDKManager.Share(title, desc, weChatAppShareUrl, "1");
        }
        else if ('btn_lineShareLink' == btnName) {
            let title = app.Client.GetClientConfigProperty("WeChatShareTitle");
            let desc = app.Client.GetClientConfigProperty("WeChatShareDesc");
            let weChatAppShareUrl = app.Client.GetClientConfigProperty("WeChatAppShareUrl");
            console.log("Click_btn_line: cfg weChatAppShareUrl: ", weChatAppShareUrl);
            let heroID = app.HeroManager().GetHeroProperty("pid");
            console.log("Click_btn_line: heroID: ", heroID);
            let cityId = app.HeroManager().GetHeroProperty("cityId");
            weChatAppShareUrl = weChatAppShareUrl + heroID + "&cityid=" + cityId;
            console.log("Click_btn_line:", title);
            console.log("Click_btn_line:", desc);
            console.log("Click_btn_line:", weChatAppShareUrl);

            this.SDKManager.ShareLineLink(title, desc, weChatAppShareUrl);
        }
        else if ('btn_lineShareImage' == btnName) {
            // this.SDKManager.ShareScreenLine(); // 目前没用到
        }
        else if ('btn_facebookShareLink' == btnName) {
            let title = app.Client.GetClientConfigProperty("WeChatShareTitle");
            let desc = app.Client.GetClientConfigProperty("WeChatShareDesc");
            let weChatAppShareUrl = app.Client.GetClientConfigProperty("WeChatAppShareUrl");
            console.log("Click_btn_facebook: cfg weChatAppShareUrl: ", weChatAppShareUrl);
            let heroID = app.HeroManager().GetHeroProperty("pid");
            console.log("Click_btn_facebook: heroID: ", heroID);
            let cityId = app.HeroManager().GetHeroProperty("cityId");
            weChatAppShareUrl = weChatAppShareUrl + heroID + "&cityid=" + cityId;
            console.log("Click_btn_facebook:", title);
            console.log("Click_btn_facebook:", desc);
            console.log("Click_btn_facebook:", weChatAppShareUrl);
            
            this.SDKManager.ShareFacebookLink(title, desc, weChatAppShareUrl);
        }
        else if ('btn_facebookShareImage' == btnName) {// 调试分享            
            this.SDKManager.ShareFacebookImage();
        }

    },
    // update (dt) {},
});
