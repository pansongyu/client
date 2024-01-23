"use strict";
cc._RF.push(module, 'ab1dbvIbR1I0YwCr/kRHEr5', 'UIChouJiangShare');
// script/ui/UIChouJiangShare.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {

        qian: cc.Node,
        ledou: cc.Node,
        fangka: cc.Node,

        lb_fangka: cc.Label,
        lb_qian: cc.Label,
        lb_ledou: cc.Label,

        touxiang: cc.Node,

        erweima: cc.Node

    },

    //初始化
    OnCreateInit: function OnCreateInit() {
        this.SDKManager = app.SDKManager();
        this.WeChatHeadImage = this.touxiang.getChildByName('head_img').getComponent("WeChatHeadImage");
    },
    Event_ChouJiangShareSuccess: function Event_ChouJiangShareSuccess() {
        app.FormManager().CloseForm("UIAudio");
    },
    //---------显示函数--------------------
    ShowOneJiangLi: function ShowOneJiangLi(type, num, luckSpr) {
        if (type == 2) {
            //钻石
            this.fangka.active = true;
            this.fangka.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = luckSpr;
            this.lb_fangka.string = 'X' + num;
        } else if (type == 1) {
            //乐豆
            this.ledou.active = true;
            this.ledou.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = luckSpr;
            this.lb_ledou.string = 'X' + num;
        } else if (type == 8) {
            //话钱
            this.qian.active = true;
            this.qian.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = luckSpr;
            this.lb_qian.string = num + '元';
        }
    },
    OnShow: function OnShow(shareObj, shareType) {
        this.fangka.active = false;
        this.ledou.active = false;
        this.qian.active = false;
        this.shareType = shareType;
        if (shareObj.qian > 0) {
            this.ShowOneJiangLi(8, shareObj.qian, shareObj.qianSpr);
        }
        if (shareObj.fangka > 0) {
            this.ShowOneJiangLi(2, shareObj.fangka, shareObj.fangkaSpr);
        }
        if (shareObj.ledou) {
            this.ShowOneJiangLi(1, shareObj.ledou, shareObj.ledouSpr);
        }

        var that = this;
        var heroID = app.HeroManager().GetHeroProperty("pid");
        var shareUrl = "http://fb.qicaiqh.com/" + this.ComTool.GetPid(heroID) + "/";
        var imgUrl = "http://fb.qicaiqh.com/makeQRcode.php?url=" + shareUrl;
        cc.loader.load({ url: imgUrl, type: 'png' }, function (err, texture) {
            if (texture instanceof cc.Texture2D) {
                var frame = new cc.SpriteFrame(texture);
                that.erweima.getComponent(cc.Sprite).spriteFrame = frame;
            } else {
                that.ErrLog("texture not Texture2D");
            }
        });

        var heroName = app.HeroManager().GetHeroProperty("name");
        this.touxiang.getChildByName('lb_name').getComponent(cc.Label).string = heroName;
        this.WeChatHeadImage.OnLoad();
        WeChatHeadImage.ShowHeroHead(heroID);
        this.scheduleOnce(this.ShareScreen, 1);
    },
    ShareScreen: function ShareScreen() {
        if (this.shareType == 1) {
            this.SDKManager.ShareScreen('1');
        } else if (this.shareType == 2) {
            this.SDKManager.ShareScreenDD();
        } else if (this.shareType == 3) {
            this.SDKManager.ShareScreenMW();
        }

        this.scheduleOnce(this.CloseForm, 3.5);
    }
});

cc._RF.pop();