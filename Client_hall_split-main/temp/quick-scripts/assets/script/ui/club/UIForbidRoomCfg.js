(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIForbidRoomCfg.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1b245eOLA9IsayRIBNl13cz', 'UIForbidRoomCfg', __filename);
// script/ui/club/UIForbidRoomCfg.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {},

    OnCreateInit: function OnCreateInit() {
        this.selectAllToggle = this.node.getChildByName("topNode").getChildByName("selectAllToggle");
    },

    OnShow: function OnShow(clubId, pid) {
        var cfgScrollView = this.node.getChildByName("cfgScrollView");
        var content = cfgScrollView.getChildByName("view").getChildByName("content");
        cfgScrollView.getComponent(cc.ScrollView).scrollToTop();
        content.removeAllChildren();

        this.clubId = clubId;
        var unionSendPackHead = app.ClubManager().GetUnionSendPackHead();
        if (unionSendPackHead.unionId > 0) {
            this.isOpClub = false;
        } else {
            this.isOpClub = true;
        }
        this.pid = parseInt(pid);
        this.curPage = 1;
        this.showCurEnd = true;
        this.showAllEnd = true;
        this.showDataEnd = false;
        this.GetDataList(true);
    },
    GetDataList: function GetDataList() {
        var isRefresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var sendPack = {};
        sendPack.opPid = this.pid;
        var self = this;
        if (this.isOpClub) {
            sendPack.clubId = this.clubId;
            app.NetManager().SendPack("club.CClubBanRoomConigList", sendPack, function (serverPack) {
                self.UpdateScrollView(serverPack, isRefresh);
            }, function () {
                app.SysNotifyManager().ShowSysMsg("获取列表失败", [], 3);
            });
        } else {
            sendPack.opClubId = this.clubId;
            var unionSendPackHead = app.ClubManager().GetUnionSendPackHead();
            sendPack.unionId = unionSendPackHead.unionId;
            sendPack.clubId = unionSendPackHead.clubId;
            app.NetManager().SendPack("union.CUnionBanRoomConigList", sendPack, function (serverPack) {
                self.UpdateScrollView(serverPack, isRefresh);
            }, function () {
                app.SysNotifyManager().ShowSysMsg("获取列表失败", [], 3);
            });
        }
    },
    UpdateScrollView: function UpdateScrollView(serverPack, isRefresh) {
        this.showDataEnd = false;
        var cfgScrollView = this.node.getChildByName("cfgScrollView");
        var content = cfgScrollView.getChildByName("view").getChildByName("content");
        if (isRefresh) {
            cfgScrollView.getComponent(cc.ScrollView).scrollToTop();
            content.removeAllChildren();
        }
        var demo = this.node.getChildByName("demo");
        demo.active = false;

        if (serverPack.isAll == 1) {
            this.selectAllToggle.getComponent(cc.Toggle).isChecked = true;
        } else {
            this.selectAllToggle.getComponent(cc.Toggle).isChecked = false;
        }
        var unionBanRoomConfigBOList = serverPack.unionBanRoomConfigBOList;
        for (var i = 0; i < unionBanRoomConfigBOList.length; i++) {
            var child = cc.instantiate(demo);
            var cfgObj = JSON.parse(unionBanRoomConfigBOList[i].dataJsonCfg);
            var gameType = app.ShareDefine().GametTypeID2PinYin[unionBanRoomConfigBOList[i].gameId];
            var wanfa = app.RoomCfgManager().WanFa(gameType, cfgObj);
            child.wanfa = wanfa;
            wanfa += "  " + this.GetUnionCfg(cfgObj);
            child.unionCfg = this.GetUnionCfg(cfgObj);
            if (wanfa.length > 16) {
                wanfa = wanfa.substring(0, 16) + '...';
            }
            var roomName = unionBanRoomConfigBOList[i].roomName;
            if (roomName == "") {
                roomName = app.ShareDefine().GametTypeID2Name[unionBanRoomConfigBOList[i].gameId];
            }
            child.getChildByName("img_bj").getChildByName("lb_roomName").getComponent(cc.Label).string = roomName;
            child.getChildByName("img_bj").getChildByName("lb_roomCfg").getComponent(cc.Label).string = wanfa;
            if (unionBanRoomConfigBOList[i].isBan == 1) {
                child.getChildByName("selectToggle").getComponent(cc.Toggle).isChecked = true;
            } else {
                child.getChildByName("selectToggle").getComponent(cc.Toggle).isChecked = false;
            }

            child.configId = unionBanRoomConfigBOList[i].configId;
            child.active = true;
            content.addChild(child);
        }
        this.showDataEnd = true;
    },
    GetUnionCfg: function GetUnionCfg(cfgObj) {
        var PLDecStr = "";
        PLDecStr += "房间比赛分门槛：" + cfgObj.roomSportsThreshold;
        PLDecStr += "，比赛分倍数：" + cfgObj.sportsDouble;
        if (typeof cfgObj.prizePool == "undefined") {
            cfgObj.prizePool = 0;
        }
        PLDecStr += "，赛事成本：" + cfgObj.prizePool;
        PLDecStr += "，房间比赛分消耗：";
        if (cfgObj.roomSportsType == 0) {
            if (typeof cfgObj.bigWinnerConsumeList == "undefined" || cfgObj.bigWinnerConsumeList.length <= 0) {
                PLDecStr += "大赢家赢比赛分>=" + cfgObj.geWinnerPoint + "时，消耗" + cfgObj.roomSportsBigWinnerConsume;
            } else {
                for (var i = 0; i < cfgObj.bigWinnerConsumeList.length; i++) {
                    PLDecStr += "大赢家赢比赛分>" + cfgObj.bigWinnerConsumeList[i].winScore + "时，消耗比赛分" + cfgObj.bigWinnerConsumeList[i].sportsPoint;
                    if (i < cfgObj.bigWinnerConsumeList.length - 1) {
                        PLDecStr += "，";
                    }
                }
            }
            if (cfgObj.twoMode) {
                PLDecStr += "；每人付" + cfgObj.roomSportsEveryoneConsume;
            }
        } else {
            PLDecStr += "每人付" + cfgObj.roomSportsEveryoneConsume;
        }
        if (cfgObj.dianbo && parseInt(cfgObj.dianbo)) {
            PLDecStr += "，携带分" + cfgObj.dianbo;
        } else PLDecStr += "，比赛分低于" + cfgObj.autoDismiss + "自动解散";
        return PLDecStr;
    },
    OnClickSelectAllToggle: function OnClickSelectAllToggle(event) {
        if (!this.showDataEnd) return;
        if (!this.showCurEnd) return;
        this.showAllEnd = false;
        var cfgScrollView = this.node.getChildByName("cfgScrollView");
        var content = cfgScrollView.getChildByName("view").getChildByName("content");
        if (this.selectAllToggle.getComponent(cc.Toggle).isChecked) {
            for (var i = 0; i < content.children.length; i++) {
                content.children[i].getChildByName("selectToggle").getComponent(cc.Toggle).isChecked = true;
            }
        } else {
            for (var _i = 0; _i < content.children.length; _i++) {
                content.children[_i].getChildByName("selectToggle").getComponent(cc.Toggle).isChecked = false;
            }
        }
        this.showAllEnd = true;
    },
    OnClickSelectToggle: function OnClickSelectToggle(event) {
        if (!this.showDataEnd) return;
        if (!this.showAllEnd) return;
        this.showCurEnd = false;
        var cfgScrollView = this.node.getChildByName("cfgScrollView");
        var content = cfgScrollView.getChildByName("view").getChildByName("content");
        var isSelectAll = true;
        for (var i = 0; i < content.children.length; i++) {
            if (!content.children[i].getChildByName("selectToggle").getComponent(cc.Toggle).isChecked) {
                isSelectAll = false;
            }
        }
        this.selectAllToggle.getComponent(cc.Toggle).isChecked = isSelectAll;
        this.showCurEnd = true;
    },
    GetCurSelectForbidList: function GetCurSelectForbidList() {
        var cfgScrollView = this.node.getChildByName("cfgScrollView");
        var content = cfgScrollView.getChildByName("view").getChildByName("content");
        var configIdList = [];
        for (var i = 0; i < content.children.length; i++) {
            if (content.children[i].getChildByName("selectToggle").getComponent(cc.Toggle).isChecked) {
                configIdList.push(content.children[i].configId);
            }
        }
        return configIdList;
    },
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_cancel") {
            this.CloseForm();
        } else if (btnName == "btn_sure") {
            var sendPack = {};
            sendPack.opClubId = this.clubId;
            sendPack.opPid = this.pid;
            sendPack.configIdList = this.GetCurSelectForbidList();
            if (this.selectAllToggle.getComponent(cc.Toggle).isChecked) {
                sendPack.isAll = 1;
            } else {
                sendPack.isAll = 0;
            }
            var self = this;
            if (this.isOpClub) {
                sendPack.clubId = this.clubId;
                app.NetManager().SendPack("club.CClubBanRoomConigOp", sendPack, function (serverPack) {
                    app.SysNotifyManager().ShowSysMsg("禁止游戏成功", [], 3);
                    self.CloseForm();
                }, function () {});
            } else {
                sendPack.opClubId = this.clubId;
                var unionSendPackHead = app.ClubManager().GetUnionSendPackHead();
                sendPack.unionId = unionSendPackHead.unionId;
                sendPack.clubId = unionSendPackHead.clubId;
                app.NetManager().SendPack("union.CUnionBanRoomConigOp", sendPack, function (serverPack) {
                    app.SysNotifyManager().ShowSysMsg("禁止游戏成功", [], 3);
                    self.CloseForm();
                }, function () {});
            }
        } else if (btnName == "lb_roomCfg") {
            var wanfaStr = btnNode.parent.parent.wanfa;
            var unionCfgStr = btnNode.parent.parent.unionCfg;
            app.FormManager().ShowForm("ui/club/UIUnionRoomCfgMsg", wanfaStr, unionCfgStr);
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
        //# sourceMappingURL=UIForbidRoomCfg.js.map
        