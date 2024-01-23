(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIPromoterSetActiveReport.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e0eca7lAv9KvJL6nTTYi14l', 'UIPromoterSetActiveReport', __filename);
// script/ui/club/UIPromoterSetActiveReport.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {},

    OnCreateInit: function OnCreateInit() {},
    OnShow: function OnShow(clubId, pid) {
        this.clubId = clubId;
        this.pid = pid;
        this.GetScorePercentList(true);
    },
    GetScorePercentList: function GetScorePercentList(isRefresh) {
        var sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.pid = this.pid;
        var self = this;
        app.NetManager().SendPack("club.CClubPromotionActiveReportForm", sendPack, function (serverPack) {
            self.UpdateScrollView(serverPack, isRefresh);
        }, function () {
            app.SysNotifyManager().ShowSysMsg("获取房间活跃计算列表失败", [], 3);
        });
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
            child.getChildByName("lb_active").getComponent(cc.Label).string = serverPack[i].value;
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
        //# sourceMappingURL=UIPromoterSetActiveReport.js.map
        