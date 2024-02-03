"use strict";
cc._RF.push(module, '106c3zzFuJBBrf46vlt6LuB', 'pdk_UIInvitation');
// script/game/PDK/pdk_UIInvitation.js

"use strict";

/*
 UIMessage 模态消息界面
 */

var app = require("pdk_app");

cc.Class({
    extends: cc.Component,

    properties: {},

    //初始化
    onLoad: function onLoad() {
        this.invitationNode = this.node.getChildByName("invitationNode");
        this.userLayout = this.invitationNode.getChildByName("img_bjl").getChildByName("scrollview").getChildByName("userLayout");
        var messageScrollView = this.invitationNode.getChildByName("img_bjl").getChildByName("scrollview").getComponent(cc.ScrollView);
        messageScrollView.node.on('scroll-to-bottom', this.GetNextPage, this);
        this.clubId = 0;
        this.unionId = 0;
        this.roomID = 0;
        this.curPage = 1;
    },
    //---------显示函数--------------------
    InitData: function InitData(clubId, unionId, roomID) {
        this.invitationNode.getChildByName("img_bjl").getChildByName("scrollview").getComponent(cc.ScrollView).scrollToTop();
        this.invitationNode.active = false;
        this.curPage = 1;
        this.clubId = clubId;
        this.unionId = unionId;
        this.roomID = roomID;
    },
    GetNextPage: function GetNextPage() {
        this.curPage = this.curPage + 1;
        this.GetPlayerData();
    },
    GetPlayerData: function GetPlayerData() {
        var sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.unionId = this.unionId;
        sendPack.pageNum = this.curPage;
        sendPack.roomID = this.roomID;
        sendPack.size = 18;
        var self = this;
        if (this.curPage == 1) {
            this.userLayout.removeAllChildren();
            this.invitationNode.getChildByName("img_bjl").getChildByName("scrollview").getComponent(cc.ScrollView).scrollToTop();
        }
        app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + '.C' + app.subGameName.toUpperCase() + 'RoomInvitationList', sendPack, function (serverPack) {
            self.ShowPlayerData(serverPack);
        }, function (error) {});
    },
    ShowPlayerData: function ShowPlayerData(serverPack) {
        if (this.curPage == 1) {
            this.invitationNode.getChildByName("img_bjl").getChildByName("scrollview").getComponent(cc.ScrollView).scrollToTop();
        }
        var demo = this.invitationNode.getChildByName("img_bjl").getChildByName("demo");
        for (var i = 0; i < serverPack.length; i++) {
            var userNode = cc.instantiate(demo);
            userNode.name = "user" + (i + 1);
            this.userLayout.addChild(userNode);
            var userName = serverPack[i]["name"];
            if (userName.length >= 6) {
                userName = userName.substring(0, 6) + "...";
            }
            userNode.getChildByName("lb_name").getComponent(cc.Label).string = userName;
            var heroID = serverPack[i]["pid"];
            var idStr = app[app.subGameName + "_ComTool"]().ReplacePosToStr(heroID.toString(), 2, 5, "****");
            userNode.getChildByName("lb_id").getComponent(cc.Label).string = idStr;
            //用户头像创建
            var headImageUrl = serverPack[i]["iconUrl"];
            if (heroID && headImageUrl) {
                app[app.subGameName + "_WeChatManager"]().InitHeroHeadImage(heroID, headImageUrl);
            }
            var weChatHeadImage = userNode.getChildByName('head').getComponent(app.subGameName + "_WeChatHeadImage");
            weChatHeadImage.onLoad();
            weChatHeadImage.ShowHeroHead(heroID);
            userNode.getChildByName("btn_invitation").getComponent(cc.Button).interactable = true;
            userNode.userData = serverPack[i];
            userNode.active = true;
        }
    },
    //控件点击回调
    OnClick_BtnWnd: function OnClick_BtnWnd(eventTouch, eventData) {
        try {
            app[app.subGameName + "_SoundManager"]().PlaySound("BtnClick");
            var btnNode = eventTouch.currentTarget;
            var btnName = btnNode.name;
            this.OnClick(btnName, btnNode);
        } catch (error) {
            console.log("OnClick_BtnWnd:" + error.stack);
        }
    },
    //---------点击函数---------------------
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_close") {
            this.userLayout.removeAllChildren();
            this.invitationNode.getChildByName("img_bjl").getChildByName("scrollview").getComponent(cc.ScrollView).scrollToTop();
            this.invitationNode.active = false;
        } else if (btnName == "btn_reGet") {
            this.curPage = 1;
            this.GetPlayerData();
        } else if (btnName == "btn_invitation") {
            var clickUserData = btnNode.parent.userData;
            var sendPack = {};
            sendPack.clubId = this.clubId;
            sendPack.unionId = this.unionId;
            sendPack.pid = clickUserData.pid;
            sendPack.roomID = this.roomID;
            var self = this;
            app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + '.C' + app.subGameName.toUpperCase() + 'RoomInvitationOperation', sendPack, function (serverPack) {
                btnNode.getComponent(cc.Button).interactable = false;
            });
        } else if (btnName == "btn_invitationOnline") {
            if (this.roomID == 0) {
                return;
            }
            this.curPage = 1;
            this.GetPlayerData();
            this.invitationNode.active = true;
        }
    }

});

cc._RF.pop();