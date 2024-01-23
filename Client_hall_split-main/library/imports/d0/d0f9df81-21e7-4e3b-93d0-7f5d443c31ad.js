"use strict";
cc._RF.push(module, 'd0f9d+BIedOO5PQf11EPDGt', 'UIPromoterAllReport');
// script/ui/club/UIPromoterAllReport.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {},

    OnCreateInit: function OnCreateInit() {},
    OnShow: function OnShow(clubId) {
        var pid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        this.clubId = clubId;
        this.pid = pid;
        this.GetScorePercentList(true);
    },
    GetScorePercentList: function GetScorePercentList(isRefresh) {
        var sendPack = {};
        sendPack.clubId = this.clubId;
        if (this.pid > 0) {
            sendPack.pid = this.pid;
        }
        var self = this;
        app.NetManager().SendPack("club.CClubPromotionLevelReportForm", sendPack, function (serverPack) {
            self.UpdateScrollView(serverPack, isRefresh);
        }, function () {});
    },
    UpdateScrollView: function UpdateScrollView(serverPack, isRefresh) {
        var roomScrollView = this.node.getChildByName("mark");
        var content = roomScrollView.getChildByName("layout");
        if (isRefresh) {
            roomScrollView.getComponent(cc.ScrollView).scrollToTop();
            //content.removeAllChildren();
            this.DestroyAllChildren(content);
        }
        var demo = this.node.getChildByName("demo");
        demo.active = false;
        for (var i = 0; i < serverPack.length; i++) {
            var child = cc.instantiate(demo);
            child.getChildByName("lb_date").getComponent(cc.Label).string = serverPack[i].dateTime;
            child.getChildByName("lb_jushu").getComponent(cc.Label).string = serverPack[i].setCount;
            child.getChildByName("lb_dayingjia").getComponent(cc.Label).string = serverPack[i].winner;
            //child.getChildByName("lb_scorePoint").getComponent(cc.Label).string = serverPack[i].scorePoint;
            child.getChildByName("lb_costZuan").getComponent(cc.Label).string = serverPack[i].consume;
            child.getChildByName("lb_costSP").getComponent(cc.Label).string = serverPack[i].entryFee;
            child.getChildByName("lb_winlostSP").getComponent(cc.Label).string = serverPack[i].sportsPointConsume;
            child.getChildByName("lb_sumScore").getComponent(cc.Label).string = serverPack[i].sumSportsPoint;
            child.getChildByName("lb_sumTable").getComponent(cc.Label).string = serverPack[i].table;
            child.active = true;
            content.addChild(child);
        }
    },
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_close") {
            this.CloseForm();
        } else {
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    }

});

cc._RF.pop();