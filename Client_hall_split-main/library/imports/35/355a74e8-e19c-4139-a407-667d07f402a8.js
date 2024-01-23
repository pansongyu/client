"use strict";
cc._RF.push(module, '355a7To4ZxBOaQHZn0H9AKo', 'btn_ForbidGameNode');
// script/ui/club/unionChildren/btn_ForbidGameNode.js

"use strict";

var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {},
    onLoad: function onLoad() {
        this.ComTool = app.ComTool();
        app.Client.RegEvent("OnUnionForbidGameReShow", this.Event_UnionForbidGameReShow, this);
    },
    InitData: function InitData(clubId, unionId) {
        this.clubId = clubId;
        this.unionId = unionId;
        this.curPage = 1;
        this.lastPage = 1;
        this.queryStr = "";
        this.node.getChildByName("searchEditBox").getComponent(cc.EditBox).string = "";
        //刷新页数
        var lb_page = this.node.getChildByName("page").getChildByName("lb_page");
        lb_page.getComponent(cc.Label).string = this.curPage;
        this.GetPalyerList(true);
    },
    GetPalyerList: function GetPalyerList() {
        var isRefresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var sendPack = app.ClubManager().GetUnionSendPackHead();
        sendPack.pageNum = this.curPage;
        sendPack.query = app.ComTool().GetBeiZhuID(this.queryStr);
        var self = this;
        app.NetManager().SendPack("union.CUnionBanGamePlayerList", sendPack, function (serverPack) {
            if (serverPack.length > 0) {
                self.UpdateScrollView(serverPack, isRefresh);
                //刷新页数
                var lb_page = self.node.getChildByName("page").getChildByName("lb_page");
                lb_page.getComponent(cc.Label).string = self.curPage;
            } else {
                self.curPage = self.lastPage;
            }
        }, function () {
            app.SysNotifyManager().ShowSysMsg("获取禁止游戏成员列表失败", [], 3);
        });
    },
    GetNextPage: function GetNextPage() {
        this.curPage++;
        this.GetPalyerList(false);
    },
    UpdateScrollView: function UpdateScrollView(serverPack, isRefresh) {
        var memberScrollView = this.node.getChildByName("memberScrollView");
        var content = memberScrollView.getChildByName("view").getChildByName("content");
        if (isRefresh) {
            memberScrollView.getComponent(cc.ScrollView).scrollToTop();
            content.removeAllChildren();
        }
        var demo = this.node.getChildByName("demo");
        demo.active = false;
        for (var i = 0; i < serverPack.length; i++) {
            //先判断下是否已经存在,对于有可能从前面插入数据的需要差重
            var isExist = false;
            for (var j = 0; j < content.children.length; j++) {
                if (content.children[j].pid == serverPack[i].pid) {
                    isExist = true;
                    break;
                }
            }
            if (isExist) continue;
            var child = cc.instantiate(demo);
            child.pid = serverPack[i].pid;
            child.playerData = serverPack[i];
            var userNameTemp = serverPack[i].name;
            if (userNameTemp.length >= 4) {
                userNameTemp = serverPack[i].name.substr(0, 8) + "...";
            }
            child.getChildByName("lb_userName").getComponent(cc.Label).string = userNameTemp;
            child.getChildByName("lb_userId").getComponent(cc.Label).string = serverPack[i].pid;
            var headImageUrl = serverPack[i].headImageUrl;
            if (headImageUrl) {
                app.WeChatManager().InitHeroHeadImage(serverPack[i].pid, headImageUrl);
                var WeChatHeadImage = child.getChildByName('head').getComponent("WeChatHeadImage");
                WeChatHeadImage.OnLoad();
                WeChatHeadImage.ShowHeroHead(serverPack[i].pid, headImageUrl);
            }

            child.active = true;
            content.addChild(child);
        }
    },
    Event_UnionForbidGameReShow: function Event_UnionForbidGameReShow(serverPack) {
        this.curPage = 1;
        this.queryStr = "";
        this.node.getChildByName("searchEditBox").getComponent(cc.EditBox).string = "";
        //刷新页数
        var lb_page = this.node.getChildByName("page").getChildByName("lb_page");
        lb_page.getComponent(cc.Label).string = this.curPage;
        this.GetPalyerList(true);
    },
    //控件点击回调
    OnClick_BtnWnd: function OnClick_BtnWnd(eventTouch, eventData) {
        try {
            app.SoundManager().PlaySound("BtnClick");
            var btnNode = eventTouch.currentTarget;
            var btnName = btnNode.name;
            this.OnClick(btnName, btnNode);
        } catch (error) {
            console.log("OnClick_BtnWnd:" + error.stack);
        }
    },
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_next' == btnName) {
            this.lastPage = this.curPage;
            this.curPage++;
            this.GetPalyerList(true);
        } else if ('btn_last' == btnName) {
            if (this.curPage <= 1) {
                return;
            }
            this.lastPage = this.curPage;
            this.curPage--;
            this.GetPalyerList(true);
        } else if ('btn_addMember' == btnName) {
            app.FormManager().ShowForm("ui/club/UIForbidGameAddUser", this.unionId, this.clubId);
        } else if ('btn_search' == btnName) {
            this.queryStr = btnNode.parent.getComponent(cc.EditBox).string;
            this.curPage = 1;
            this.lastPage = 1;
            this.GetPalyerList(true);
        } else if ('btn_cancelForbid' == btnName) {
            var playerData = btnNode.parent.playerData;
            var sendPack = app.ClubManager().GetUnionSendPackHead();
            sendPack.pid = playerData.pid;
            var self = this;
            app.NetManager().SendPack("union.CUnionBanGamePlayerDelete", sendPack, function (serverPack) {
                var memberScrollView = self.node.getChildByName("memberScrollView");
                var content = memberScrollView.getChildByName("view").getChildByName("content");
                memberScrollView.getComponent(cc.ScrollView).scrollToTop();
                content.removeAllChildren();
                self.GetPalyerList(true);
                app.SysNotifyManager().ShowSysMsg("成功取消禁止游戏", [], 3);
            }, function () {
                app.SysNotifyManager().ShowSysMsg("取消禁止游戏失败", [], 3);
            });
        }
    },
    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    SetWaitForConfirm: function SetWaitForConfirm(msgID, type) {
        var msgArgs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var cbArgs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

        var ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArgs);
        ConfirmManager.ShowConfirm(type, msgID, msgArgs);
    },
    OnConFirm: function OnConFirm(clickType, msgID, cbArgs) {
        if ('Sure' != clickType) {
            return;
        }
    }
});

cc._RF.pop();