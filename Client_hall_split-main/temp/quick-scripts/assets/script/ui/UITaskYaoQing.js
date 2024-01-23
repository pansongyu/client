(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/UITaskYaoQing.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7d33dnI1GVM1Ja5qmOIrtZL', 'UITaskYaoQing', __filename);
// script/ui/UITaskYaoQing.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),
    properties: {
        layout: cc.Node,
        demo: cc.Node,
        renshu: cc.Label,
        chongzhi: cc.Label
    },
    OnCreateInit: function OnCreateInit() {
        this.ComTool = app.ComTool();
    },
    OnShow: function OnShow() {
        app.FormManager().ShowForm('UITop', "UITaskYaoQing");
        this.demo.active = false;
        this.pageNum = 1;
        this.maxPage = 1;
        this.ShowPagePlayer();
    },
    ShowPagePlayer: function ShowPagePlayer() {
        var that = this;
        app.NetManager().SendPack('game.CPlayerReceiveList', { 'pageNum': this.pageNum }, function (serverPack) {
            //that.layout.removeAllChildren();
            that.DestroyAllChildren(that.layout);
            that.InitPlayer(serverPack);
        }, function (serverPack) {
            that.ShowSysMsg("推广数据获取失败，请稍后重试");
        });
    },
    InitPlayer: function InitPlayer(serverPack) {
        var refererReceiveItems = serverPack.refererReceiveItems;
        var totalPrice = serverPack.totalPrice;
        var totalNumber = serverPack.totalNumber;
        this.renshu.string = totalNumber;
        this.maxPage = Math.ceil(totalNumber / 10);
        if (this.maxPage == 0) {
            this.maxPage = 1;
        }
        this.chongzhi.string = totalPrice;
        //显示玩家
        for (var i = 0; i < refererReceiveItems.length; i++) {
            var nodePrefab = cc.instantiate(this.demo);
            nodePrefab.getChildByName('name').getComponent(cc.Label).string = refererReceiveItems[i].name.substr(0, 7);
            nodePrefab.getChildByName('date').getComponent(cc.Label).string = this.ComTool.GetDateYearMonthDayHourMinuteString(refererReceiveItems[i].inviteTime);;
            if (refererReceiveItems[i].state == 0) {
                nodePrefab.getChildByName('state').getComponent(cc.Label).string = '局数不够';
            } else {
                nodePrefab.getChildByName('state').color = new cc.Color(0, 134, 13);
                nodePrefab.getChildByName('state').getComponent(cc.Label).string = '邀请成功';
            }
            nodePrefab.getChildByName('num').getComponent(cc.Label).string = refererReceiveItems[i].price;
            nodePrefab.active = true;
            this.layout.addChild(nodePrefab);
        }
    },
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_yaoqing' == btnName) {
            // this.FormManager.ShowForm('UIShare');
            //直接链接分享
            var title = app.Client.GetClientConfigProperty("WeChatShareTitle");
            var desc = app.Client.GetClientConfigProperty("WeChatShareDesc");
            var weChatAppShareUrl = app.Client.GetClientConfigProperty("WeChatAppShareUrl");
            var heroID = app.HeroManager().GetHeroProperty("pid");
            var cityId = app.HeroManager().GetHeroProperty("cityId");
            weChatAppShareUrl = weChatAppShareUrl + heroID + "&cityid=" + cityId;
            console.log("Click_btn_weixin:", title);
            console.log("Click_btn_weixin:", desc);
            console.log("Click_btn_weixin:", weChatAppShareUrl);
            this.ShareType = 0;
            this.SDKManager.Share(title, desc, weChatAppShareUrl, "0");
        }
    },
    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {
        if (clickType != "Sure") {
            return;
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
        //# sourceMappingURL=UITaskYaoQing.js.map
        