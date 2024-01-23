(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIClubPlayerRecord.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '80fe8rmrpNKTJD0r/RjD0u7', 'UIClubPlayerRecord', __filename);
// script/ui/club/UIClubPlayerRecord.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        layout: cc.Node
    },

    //初始化
    OnCreateInit: function OnCreateInit() {},

    //---------显示函数--------------------

    OnShow: function OnShow(clubId) {
        var unionId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        this.type = 0; //默认显示今天的数据
        this.unionId = unionId;
        this.clubId = clubId;
        if (this.unionId > 0) {
            this.node.getChildByName("bg").getChildByName("tip_shuying").getComponent(cc.Label).string = "比赛分";
        } else {
            this.node.getChildByName("bg").getChildByName("tip_shuying").getComponent(cc.Label).string = "输赢分";
        }
        this.InitLeft();
        this.InitLeftLb();
        this.GetData();
    },
    GetData: function GetData() {
        this.DestroyAllChildren(this.layout);
        var self = this;
        app.NetManager().SendPack("club.CClubPlayerRecord", { "clubId": this.clubId, "unionId": this.unionId, "getType": this.type }, function (serverPack) {
            self.ShowData(serverPack);
        }, function () {});

        app.NetManager().SendPack("club.CClubPlayerRecordCount", { "clubId": this.clubId, "unionId": this.unionId, "getType": this.type }, function (serverPack) {
            self.node.getChildByName("lb_jushu").getComponent(cc.Label).string = "对局数：" + serverPack.size;
            self.node.getChildByName("lb_dayingjia").getComponent(cc.Label).string = "大赢家：" + serverPack.winner;
            if (self.unionId > 0) {
                self.node.getChildByName("lb_shuyingfen").getComponent(cc.Label).string = "比赛分：" + serverPack.sumPoint;
            } else {
                self.node.getChildByName("lb_shuyingfen").getComponent(cc.Label).string = "输赢分：" + serverPack.sumPoint;
            }
        }, function () {});
    },
    OnClose: function OnClose() {
        this.DestroyAllChildren(this.layout);
        this.node.getChildByName("lb_jushu").getComponent(cc.Label).string = "对局数：";
        this.node.getChildByName("lb_dayingjia").getComponent(cc.Label).string = "大赢家：";
        this.node.getChildByName("lb_shuyingfen").getComponent(cc.Label).string = "";
    },
    ShowData: function ShowData(data) {
        var demo = this.node.getChildByName("demo");
        for (var i = 0; i < data.length; i++) {
            var child = cc.instantiate(demo);
            if (i % 2 == 1) {
                child.getChildByName("bg").active = false;
            }
            child.getChildByName("lb_jushu").getComponent(cc.Label).string = data[i].size;
            child.getChildByName("lb_dayingjia").getComponent(cc.Label).string = data[i].winner;
            child.getChildByName("lb_shuyingfen").getComponent(cc.Label).string = data[i].sumPoint;
            child.getChildByName("lb_game").getComponent(cc.Label).string = this.GameId2Name(data[i].gameId);
            child.active = true;
            this.layout.addChild(child);
        }
    },
    GameId2Name: function GameId2Name(gameId) {
        return this.ShareDefine.GametTypeID2Name[gameId];
    },
    InitLeft: function InitLeft() {
        var tab = this.node.getChildByName("tab");
        for (var i = 0; i < tab.children.length; i++) {
            tab.children[i].getChildByName('off').active = i != this.type;
            tab.children[i].getChildByName('on').active = i == this.type;
        }
    },
    InitLeftLb: function InitLeftLb() {
        var tab = this.node.getChildByName("tab");
        for (var i = 0; i < tab.children.length; i++) {
            if (i <= 2) {
                continue; //今天，昨天，前天
            }
            var lb = this.getDay(i);
            tab.children[i].getChildByName("on").getChildByName("lb").getComponent(cc.Label).string = lb;
            tab.children[i].getChildByName("off").getChildByName("lb").getComponent(cc.Label).string = lb;
        }
    },
    getDay: function getDay(day) {
        var today = new Date();
        var targetday_milliseconds = today.getTime() - 1000 * 60 * 60 * 24 * day;
        today.setTime(targetday_milliseconds); //注意，这行是关键代码
        var tYear = today.getFullYear();
        var tMonth = today.getMonth();
        var tDate = today.getDate();
        tMonth = this.doHandleMonth(tMonth + 1);
        tDate = this.doHandleMonth(tDate);
        return tMonth + "月" + tDate + "日";
    },
    doHandleMonth: function doHandleMonth(month) {
        return month;
    },
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_close' == btnName) {
            this.CloseForm();
        } else if (btnName.startsWith("btn_tian")) {
            this.type = parseInt(btnName.replace("btn_tian", ''));
            this.GetData();
            this.InitLeft();
        } else {
            this.ErrLog("OnClick:%s not find", btnName);
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
        //# sourceMappingURL=UIClubPlayerRecord.js.map
        