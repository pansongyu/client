"use strict";
cc._RF.push(module, 'ec29aHtmi5P6J03UEALSawO', 'btn_ForbidTableNode');
// script/ui/club/unionChildren/btn_ForbidTableNode.js

'use strict';

var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {},
    onLoad: function onLoad() {
        this.ComTool = app.ComTool();
        app.Client.RegEvent('OnUnionForbidReShow', this.Event_UnionForbidReShow, this);
        // let forbidScrollView = this.node.getChildByName("forbidScrollView").getComponent(cc.ScrollView);
        //    forbidScrollView.node.on('scroll-to-bottom',this.GetNextPage,this);
    },
    Event_UnionForbidReShow: function Event_UnionForbidReShow() {
        this.GetUnionForbidList(true);
    },
    InitData: function InitData(clubId, unionId, unionPostType) {
        this.clubId = clubId;
        this.unionId = unionId;
        this.unionPostType = unionPostType;
        // this.curPage = 1;
        this.GetUnionForbidList(true);
    },
    // GetNextPage:function(){
    // 	this.curPage++;
    // 	this.GetUnionForbidList(false);
    // },
    GetUnionForbidList: function GetUnionForbidList(isRefresh) {
        var pidOne = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var pidTwo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

        var sendPack = app.ClubManager().GetUnionSendPackHead();
        // sendPack.pageNum = this.curPage;
        sendPack.pidOne = pidOne;
        sendPack.pidTwo = pidTwo;
        var self = this;
        app.NetManager().SendPack("union.CUnionGroupingList", sendPack, function (serverPack) {
            self.UpdateScrollView(serverPack, isRefresh);
        }, function () {
            app.SysNotifyManager().ShowSysMsg("获取列表失败", [], 3);
        });
    },

    UpdateScrollView: function UpdateScrollView(serverPack, isRefresh) {
        var forbidScrollView = this.node.getChildByName("forbidScrollView");
        var content = forbidScrollView.getChildByName("view").getChildByName("content");
        if (isRefresh) {
            forbidScrollView.getComponent(cc.ScrollView).scrollToTop();
            content.removeAllChildren();
        }
        var demo = this.node.getChildByName("demo");
        demo.active = false;
        for (var i = 0; i < serverPack.length; i++) {
            var nodePrefab = cc.instantiate(demo);
            nodePrefab.name = "forbid_" + serverPack[i].groupingId;
            nodePrefab.getChildByName('renshu').getChildByName('lb').getComponent(cc.Label).string = i + 1 + "限制人数：" + serverPack[i].groupingSize + "斜15";
            nodePrefab.groupingId = serverPack[i].groupingId;
            nodePrefab.getChildByName('layout').getChildByName('user1').active = false;
            nodePrefab.getChildByName('layout').getChildByName('user2').active = false;
            nodePrefab.getChildByName('layout').getChildByName('btn_set_forbit').groupingId = serverPack[i].groupingId;

            nodePrefab.getChildByName('btn_set_forbit').groupingId = serverPack[i].groupingId;
            nodePrefab.getChildByName('btn_del_forbit').groupingId = serverPack[i].groupingId;

            nodePrefab.active = true;
            for (var j = 0; j < serverPack[i].playerList.length; j++) {
                var usernode = nodePrefab.getChildByName('layout').getChildByName('user' + (j + 1));
                usernode.active = true;
                var heroID = serverPack[i].playerList[j]["pid"];
                var headImageUrl = serverPack[i].playerList[j]["iconUrl"];

                usernode.getChildByName('name').getComponent(cc.Label).string = this.ComTool.GetBeiZhuName(heroID, serverPack[i].playerList[j].name);

                usernode.getChildByName('id').getComponent(cc.Label).string = app.i18n.t("UIMain_PIDText", { "pid": app.ComTool().GetPid(heroID) });
                var WeChatHeadImage = usernode.getChildByName('head').getChildByName('img').getComponent("WeChatHeadImage");
                WeChatHeadImage.OnLoad();
                //用户头像创建
                if (heroID && headImageUrl) {
                    app.WeChatManager().InitHeroHeadImage(heroID, headImageUrl);
                }
                usernode.getChildByName('btn_forbit_del_user').pid = heroID;
                usernode.getChildByName('btn_forbit_del_user').groupingId = serverPack[i].groupingId;
                WeChatHeadImage.ShowHeroHead(heroID, headImageUrl);
            }
            content.addChild(nodePrefab);
        }
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
        var self = this;
        var sendPack = app.ClubManager().GetUnionSendPackHead();
        if ('btn_addForbid' == btnName) {
            app.NetManager().SendPack("union.CUnionGroupingAdd", sendPack, function (serverPack) {
                self.GetUnionForbidList(true);
            }, function () {});
        } else if ('btn_del_forbit' == btnName) {
            sendPack.groupingId = btnNode.groupingId;
            app.NetManager().SendPack('union.CUnionGroupingRemove', sendPack, function (serverPack) {
                self.GetUnionForbidList(true);
            }, function () {});
        } else if ('btn_forbit_del_user' == btnName) {
            sendPack.groupingId = btnNode.groupingId;
            sendPack.pid = btnNode.pid;
            app.NetManager().SendPack('union.CUnionGroupingPidRemove', sendPack, function (serverPack) {
                self.GetUnionForbidList(true);
            }, function () {});
        } else if ('btn_set_forbit' == btnName) {
            app.FormManager().ShowForm('ui/club/UIForbidUserList', this.clubId, btnNode.groupingId, this.unionId);
        } else if ('btn_ForbidSearch' == btnName) {
            var pid1 = this.node.getChildByName("EditBoxForbid1").getComponent(cc.EditBox).string;
            var pid2 = this.node.getChildByName("EditBoxForbid2").getComponent(cc.EditBox).string;
            if (pid1 != '' || pid2 != '') {
                this.GetUnionForbidList(true, pid1, pid2);
            }
        }
    }
});

cc._RF.pop();