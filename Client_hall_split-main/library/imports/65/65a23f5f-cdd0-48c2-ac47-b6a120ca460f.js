"use strict";
cc._RF.push(module, '65a239fzdBIwqxHtqEgykYP', 'UIShare');
// script/ui/UIShare.js

"use strict";

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {},
    OnCreateInit: function OnCreateInit() {
        this.NetManager = app.NetManager();
        this.RegEvent("ShareSuccess", this.Event_ShareSuccess, this);
        this.ShareType = -1;

        this.btn_py = this.GetWndNode("bg_create/btn_py"); //微信分享
        this.btn_pyq = this.GetWndNode("bg_create/btn_pyq"); // 朋友圈
        this.btn_lineShareLink = this.GetWndNode("bg_create/btn_lineShareLink"); // line 分享 宝岛 大联盟棋牌
        // 分享按钮
        this.ShowShareBtn();
    },

    OnShow: function OnShow() {
        // this.NetManager.SendPack("game.CPlayerRebate",{},function(success){},function(error){
        //     app.SysNotifyManager().ShowSysMsg("系统数据获取出错，请稍后重试");
        // });
    },

    ShowShareBtn: function ShowShareBtn() {
        var appName = this.GetAppName();
        var isShowLineShare = appName == "baodao";

        this.btn_py.active = !isShowLineShare;
        this.btn_pyq.active = !isShowLineShare;

        this.btn_lineShareLink.active = isShowLineShare;
    },

    Event_ShareSuccess: function Event_ShareSuccess(event) {
        if (this.ShareType == 1) {
            var that = this;
            this.NetManager.SendPack("game.CPlayerReceiveShare", {}, function (success) {
                app.SysNotifyManager().ShowSysMsg("分享成功获取2个钻石");
            }, function (error) {
                app.SysNotifyManager().ShowSysMsg("您今日已经领取过钻石");
            });
        }
    },

    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_py' == btnName) {
            var title = app.Client.GetClientConfigProperty("WeChatShareTitle");
            var desc = app.Client.GetClientConfigProperty("WeChatShareDesc");
            var weChatAppShareUrl = app.Client.GetClientConfigProperty("WeChatAppShareUrl");
            var heroID = app.HeroManager().GetHeroProperty("pid");
            var cityId = app.HeroManager().GetHeroProperty("cityId");
            weChatAppShareUrl = weChatAppShareUrl + heroID + "&cityid=" + cityId;
            if (app.Config.share && app.Config.share.length > 3) {
                weChatAppShareUrl = app.Config.share;
            }
            this.ShareType = 0;
            this.SDKManager.Share(title, desc, weChatAppShareUrl, "0");
        } else if ('btn_pyq' == btnName) {
            var _title = app.Client.GetClientConfigProperty("WeChatShareTitle");
            var _desc = app.Client.GetClientConfigProperty("WeChatShareDesc");
            var _weChatAppShareUrl = app.Client.GetClientConfigProperty("WeChatAppShareUrl");
            var _heroID = app.HeroManager().GetHeroProperty("pid");
            var _cityId = app.HeroManager().GetHeroProperty("cityId");
            _weChatAppShareUrl = _weChatAppShareUrl + _heroID + "&cityid=" + _cityId;
            if (app.Config.share && app.Config.share.length > 3) {
                _weChatAppShareUrl = app.Config.share;
            }
            this.ShareType = 1;
            // app.FormManager().ShowForm("UIShareImg");
            this.SDKManager.Share(_title, _desc, _weChatAppShareUrl, "1");
        } else if ('btn_lineShareLink' == btnName) {
            var _title2 = app.Client.GetClientConfigProperty("WeChatShareTitle");
            var _desc2 = app.Client.GetClientConfigProperty("WeChatShareDesc");
            var _weChatAppShareUrl2 = app.Client.GetClientConfigProperty("WeChatAppShareUrl");
            console.log("Click_btn_line: cfg weChatAppShareUrl: ", _weChatAppShareUrl2);
            var _heroID2 = app.HeroManager().GetHeroProperty("pid");
            console.log("Click_btn_line: heroID: ", _heroID2);
            var _cityId2 = app.HeroManager().GetHeroProperty("cityId");
            _weChatAppShareUrl2 = _weChatAppShareUrl2 + _heroID2 + "&cityid=" + _cityId2;
            console.log("Click_btn_line:", _title2);
            console.log("Click_btn_line:", _desc2);
            console.log("Click_btn_line:", _weChatAppShareUrl2);

            this.SDKManager.ShareLineLink(_title2, _desc2, _weChatAppShareUrl2);
        } else if ('btn_lineShareImage' == btnName) {
            // this.SDKManager.ShareScreenLine(); // 目前没用到
        } else if ('btn_facebookShareLink' == btnName) {
            var _title3 = app.Client.GetClientConfigProperty("WeChatShareTitle");
            var _desc3 = app.Client.GetClientConfigProperty("WeChatShareDesc");
            var _weChatAppShareUrl3 = app.Client.GetClientConfigProperty("WeChatAppShareUrl");
            console.log("Click_btn_facebook: cfg weChatAppShareUrl: ", _weChatAppShareUrl3);
            var _heroID3 = app.HeroManager().GetHeroProperty("pid");
            console.log("Click_btn_facebook: heroID: ", _heroID3);
            var _cityId3 = app.HeroManager().GetHeroProperty("cityId");
            _weChatAppShareUrl3 = _weChatAppShareUrl3 + _heroID3 + "&cityid=" + _cityId3;
            console.log("Click_btn_facebook:", _title3);
            console.log("Click_btn_facebook:", _desc3);
            console.log("Click_btn_facebook:", _weChatAppShareUrl3);

            this.SDKManager.ShareFacebookLink(_title3, _desc3, _weChatAppShareUrl3);
        } else if ('btn_facebookShareImage' == btnName) {
            // 调试分享            
            this.SDKManager.ShareFacebookImage();
        }
    }
    // update (dt) {},
});

cc._RF.pop();