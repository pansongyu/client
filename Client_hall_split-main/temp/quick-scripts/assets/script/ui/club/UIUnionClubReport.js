(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIUnionClubReport.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '181falV7gdKx6emJG1D1SyV', 'UIUnionClubReport', __filename);
// script/ui/club/UIUnionClubReport.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {},

    OnCreateInit: function OnCreateInit() {},
    OnShow: function OnShow(clubId, pid) {
        this.opClubId = clubId;
        this.opPid = pid;
        this.GetScorePercentList(true);
    },
    GetScorePercentList: function GetScorePercentList(isRefresh) {
        var sendPack = app.ClubManager().GetUnionSendPackHead();
        sendPack.opClubId = this.opClubId;
        sendPack.opPid = this.opPid;
        var self = this;
        app.NetManager().SendPack("union.CUnionClubReportForm", sendPack, function (serverPack) {
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
            child.getChildByName("lb_wanjiashu").getComponent(cc.Label).string = serverPack[i].sizePlayer;
            child.getChildByName("lb_jushu").getComponent(cc.Label).string = serverPack[i].setCount;
            child.getChildByName("lb_baomingfei").getComponent(cc.Label).string = serverPack[i].entryFee;
            child.getChildByName("lb_fencheng").getComponent(cc.Label).string = serverPack[i].shareValue;
            child.getChildByName("lb_huoyuedu").getComponent(cc.Label).string = serverPack[i].scorePoint;
            child.getChildByName("lb_costZS").getComponent(cc.Label).string = serverPack[i].consume;
            child.getChildByName("lb_winlostSP").getComponent(cc.Label).string = serverPack[i].sportsPointConsume;
            child.getChildByName("lb_singleSP").getComponent(cc.Label).string = serverPack[i].personalSportsPoint;
            child.getChildByName("lb_sumScore").getComponent(cc.Label).string = serverPack[i].sumSportsPoint;
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
        //# sourceMappingURL=UIUnionClubReport.js.map
        