"use strict";
cc._RF.push(module, '25834wFSHxHM69Bzzw8amx3', 'btn_RaceRankNode');
// script/ui/club/unionChildren/btn_RaceRankNode.js

"use strict";

var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {
        imgRank: [cc.SpriteFrame]
    },
    onLoad: function onLoad() {
        this.ComTool = app.ComTool();
        // let rankScrollView = this.node.getChildByName("rankScrollView").getComponent(cc.ScrollView);
        //    rankScrollView.node.on('scroll-to-bottom',this.GetNextPage,this);
    },
    InitData: function InitData(clubId, unionId, unionPostType) {
        this.clubId = clubId;
        this.unionId = unionId;
        this.unionPostType = unionPostType;
        // this.curPage = 1;
        this.curType = 0;
        var btn_default = this.node.getChildByName("topBtnNode").getChildByName("btn_lastRank");
        this.OnClick(btn_default.name, btn_default);
    },
    ClickTopBtn: function ClickTopBtn(clickName) {
        var topBtnNode = this.node.getChildByName("topBtnNode");
        var allTopBtn = [];
        for (var i = 0; i < topBtnNode.children.length; i++) {
            allTopBtn.push(topBtnNode.children[i]);
        }
        for (var _i = 0; _i < allTopBtn.length; _i++) {
            if (allTopBtn[_i].name == clickName) {
                allTopBtn[_i].getChildByName("img_off").active = false;
                allTopBtn[_i].getChildByName("lb_off").active = false;
                allTopBtn[_i].getChildByName("img_on").active = true;
                allTopBtn[_i].getChildByName("lb_on").active = true;
            } else {
                allTopBtn[_i].getChildByName("img_off").active = true;
                allTopBtn[_i].getChildByName("lb_off").active = true;
                allTopBtn[_i].getChildByName("img_on").active = false;
                allTopBtn[_i].getChildByName("lb_on").active = false;
            }
        }
    },
    // GetNextPage:function(){
    // 	this.curPage++;
    // 	let sendPack = app.ClubManager().GetUnionSendPackHead();
    // 	sendPack.pageNum = this.curPage;
    // 	sendPack.type = this.curType;
    //     let self = this;
    //     app.NetManager().SendPack("union.CUnionRankingList",sendPack, function(serverPack){
    //         self.UpdateScrollView(serverPack, false);
    //     }, function(){
    //         app.SysNotifyManager().ShowSysMsg("获取列表失败",[],3);
    //     });
    // },
    UpdateScrollView: function UpdateScrollView(serverPack, isRefresh) {
        var rankScrollView = this.node.getChildByName("rankScrollView");
        var content = rankScrollView.getChildByName("view").getChildByName("content");
        if (isRefresh) {
            rankScrollView.getComponent(cc.ScrollView).scrollToTop();
            content.removeAllChildren();
        }

        var lb_userRank = this.node.getChildByName("lb_userRank").getComponent(cc.Label);
        if (serverPack.curRankingId) {
            lb_userRank.string = "我的排名：" + serverPack.curRankingId;
        } else {
            lb_userRank.string = "我的排名：未上榜";
        }
        var demo = this.node.getChildByName("demo");
        demo.active = false;
        for (var i = 0; i < serverPack.unionMatchItemList.length; i++) {
            var matchItem = serverPack.unionMatchItemList[i];
            var child = cc.instantiate(demo);
            if (i % 2 == 0) {
                child.getChildByName("img_tiaowen01").active = true;
            } else {
                child.getChildByName("img_tiaowen01").active = false;
            }
            if (matchItem.rankingId > 3) {
                child.getChildByName("img_rank").active = false;
                child.getChildByName("lb_rank").getComponent(cc.Label).string = matchItem.rankingId;
            } else {
                child.getChildByName("img_rank").getComponent(cc.Sprite).spriteFrame = this.imgRank[matchItem.rankingId - 1];
                child.getChildByName("img_rank").active = true;
                child.getChildByName("lb_rank").getComponent(cc.Label).string = "";
            }
            child.getChildByName("lb_userName").getComponent(cc.Label).string = this.ComTool.GetBeiZhuName(matchItem.pid, matchItem.name);
            child.getChildByName("lb_userPid").getComponent(cc.Label).string = matchItem.pid;
            child.getChildByName("lb_clubId").getComponent(cc.Label).string = matchItem.clubSign;
            child.getChildByName("lb_clubName").getComponent(cc.Label).string = matchItem.clubName;
            child.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = matchItem.sportsPoint;
            child.active = true;
            content.addChild(child);
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
        if ('btn_lastRank' == btnName) {
            this.ClickTopBtn(btnName);
            this.curType = 1;
            // this.curPage = 1;
            var sendPack = app.ClubManager().GetUnionSendPackHead();
            // sendPack.pageNum = this.curPage;
            sendPack.type = this.curType;
            var self = this;
            app.NetManager().SendPack("union.CUnionRankingList", sendPack, function (serverPack) {
                self.UpdateScrollView(serverPack, true);
            }, function () {
                app.SysNotifyManager().ShowSysMsg("获取列表失败", [], 3);
            });
        } else if ('btn_curRank' == btnName) {
            this.ClickTopBtn(btnName);
            this.curType = 0;
            // this.curPage = 1;
            var _sendPack = app.ClubManager().GetUnionSendPackHead();
            // sendPack.pageNum = this.curPage;
            _sendPack.type = this.curType;
            var _self = this;
            app.NetManager().SendPack("union.CUnionRankingList", _sendPack, function (serverPack) {
                _self.UpdateScrollView(serverPack, true);
            }, function () {
                app.SysNotifyManager().ShowSysMsg("获取列表失败", [], 3);
            });
        }
    }
});

cc._RF.pop();