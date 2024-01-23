(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/UITanChuang.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e575fYQKudIIbZW/8LDCeSb', 'UITanChuang', __filename);
// script/ui/UITanChuang.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),
    properties: {},

    OnCreateInit: function OnCreateInit() {
        this.FormManager = app.FormManager();
        this.NetManager = app.NetManager();
        this.RegEvent("ShareSuccess", this.Event_ShareSuccess, this);
        this.ShareType = -1;
    },
    OnShow: function OnShow() {},
    Event_ShareSuccess: function Event_ShareSuccess(event) {
        if (this.ShareType == 1) {
            var that = this;
            this.NetManager.SendPack("game.CPlayerReceiveShare", {}, function (success) {
                app.SysNotifyManager().ShowSysMsg("分享成功获取2个钻石");
                that.CloseForm();
            }, function (error) {
                app.SysNotifyManager().ShowSysMsg("您今日已经领取过钻石");
            });
        }
    },
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_share' == btnName) {
            var title = app.Client.GetClientConfigProperty("WeChatShareTitle");
            var desc = app.Client.GetClientConfigProperty("WeChatShareDesc");
            var weChatAppShareUrl = app.Client.GetClientConfigProperty("WeChatAppShareUrl");
            var heroID = app.HeroManager().GetHeroProperty("pid");
            var cityId = app.HeroManager().GetHeroProperty("cityId");
            weChatAppShareUrl = weChatAppShareUrl + heroID + "&cityid=" + cityId;;
            console.log("Click_btn_weixin:", title);
            console.log("Click_btn_weixin:", desc);
            console.log("Click_btn_weixin:", weChatAppShareUrl);
            this.ShareType = 1;
            app.FormManager().ShowForm("UIShareImg");
        }
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=UITanChuang.js.map
        