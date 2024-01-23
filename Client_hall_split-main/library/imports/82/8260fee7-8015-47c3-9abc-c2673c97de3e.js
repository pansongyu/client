"use strict";
cc._RF.push(module, '8260f7ngBVHw5q8wmc8l94+', 'UIClubAddCaptain_2');
// script/ui/club_2/UIClubAddCaptain_2.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        chazhaoEditBox: cc.EditBox
    },

    OnCreateInit: function OnCreateInit() {
        this.rankScrollView = this.node.getChildByName("rankScrollView");
        this.rankScrollView.getComponent(cc.ScrollView).node.on('scroll-to-bottom', this.GetNextPage, this);
    },
    OnShow: function OnShow(clubId) {
        this.opClubId = clubId;
        this.curPage = 1;
        this.GetUnionDynamicItemList(true);
    },
    GetPage: function GetPage() {
        this.curPage++;
        this.GetUnionDynamicItemList(false);
    },
    GetUnionDynamicItemList: function GetUnionDynamicItemList(isRefresh) {
        var sendPack = {};
        sendPack.clubId = this.opClubId;
        sendPack.query = this.chazhaoEditBox.string;
        sendPack.pageNum = this.curPage;
        var self = this;
        app.NetManager().SendPack("club.CClubAddCaptainZhongZhi", sendPack, function (serverPack) {
            self.UpdateScrollView(serverPack, isRefresh);
        }, function () {});
    },
    UpdateScrollView: function UpdateScrollView(serverPack, isRefresh) {
        var roomScrollView = this.node.getChildByName("mark");
        var content = this.rankScrollView.getChildByName("view").getChildByName("content");
        if (isRefresh) {
            this.rankScrollView.getComponent(cc.ScrollView).scrollToTop();
            this.DestroyAllChildren(content);
        }
        var demo = this.node.getChildByName("demo");
        demo.active = false;
        for (var i = 0; i < serverPack.length; i++) {
            var child = cc.instantiate(demo);
            if (i % 2 == 0) {
                child.getComponent(cc.Sprite).enabled = false;
            } else {
                child.getComponent(cc.Sprite).enabled = true;
            }
            child.shortPlayer = serverPack[i].shortPlayer;
            child.getChildByName("lb_name").getComponent(cc.Label).string = serverPack[i].shortPlayer.name;
            child.getChildByName("lb_id").getComponent(cc.Label).string = serverPack[i].shortPlayer.pid;
            child.getChildByName("lb_minister").getComponent(cc.Label).string = this.GetMinisterStr(serverPack[i].minister);
            child.getChildByName("lb_upPlayerName").getComponent(cc.Label).string = serverPack[i].upPlayerName;
            child.active = true;
            content.addChild(child);
        }
    },
    // //**是否是管理,不是为null,是为1，2为创建者
    GetMinisterStr: function GetMinisterStr(minister) {
        if (minister == 1) {
            return "管理员";
        } else if (minister == 2) {
            return "创建者";
        } else {
            return "成员";
        }
    },
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_close") {
            this.CloseForm();
        } else if ("btn_search" == btnName) {
            this.curPage = 1;
            this.GetUnionDynamicItemList(true);
        } else if ("btn_addCaptain" == btnName) {
            this.curPage = 1;
            var sendPack = {};
            sendPack.clubId = this.opClubId;
            sendPack.pid = btnNode.parent.shortPlayer.pid;
            sendPack.pageNum = this.curPage;
            var self = this;
            app.NetManager().SendPack("Club.CClubAddCaptionOpZhongZhi", sendPack, function (serverPack) {
                self.GetUnionDynamicItemList(true);
                app.Client.OnEvent('UpdateZhanDuiNodeData', {});
            }, function () {});
        } else {
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    }

});

cc._RF.pop();