(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIPromoterSetActiveDetail.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'cc932UKcotFJ442BVOTcL/K', 'UIPromoterSetActiveDetail', __filename);
// script/ui/club/UIPromoterSetActiveDetail.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {},

    OnCreateInit: function OnCreateInit() {
        var roomScrollView = this.node.getChildByName("mark").getComponent(cc.ScrollView);
        roomScrollView.node.on('scroll-to-bottom', this.GetNextPage, this);
    },
    OnShow: function OnShow(data, clubId) {
        this.data = data;
        this.clubId = clubId;
        this.curPage = 1;
        this.GetScorePercentList(true);
    },
    GetNextPage: function GetNextPage() {
        this.curPage++;
        this.GetScorePercentList(false);
    },
    GetScorePercentList: function GetScorePercentList(isRefresh) {
        var sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.pid = this.data.pid;
        sendPack.pageNum = this.curPage;
        var self = this;
        app.NetManager().SendPack("club.CClubPromotionCalcActiveList", sendPack, function (serverPack) {
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
            //先判断下是否已经存在
            var isExist = false;
            for (var j = 0; j < content.children.length; j++) {
                if (content.children[j].configId == serverPack[i].configId) {
                    isExist = true;
                    break;
                }
            }
            if (isExist) continue;
            var child = cc.instantiate(demo);
            child.configId = serverPack[i].configId;
            child.configInfo = serverPack[i];
            var roomNameStr = serverPack[i].configName;
            if (typeof roomNameStr == "undefined" || roomNameStr == "") {
                roomNameStr = app.ShareDefine().GametTypeID2Name[serverPack[i].gameId];
            }
            child.getChildByName("lb_roomName").getComponent(cc.Label).string = roomNameStr;
            child.getChildByName("lb_roomCount").getComponent(cc.Label).string = serverPack[i].size;
            child.getChildByName("scorePercentEditBox").getComponent(cc.EditBox).string = serverPack[i].value.toString();
            child.active = true;
            content.addChild(child);
        }
    },
    GetAllRoomListCfg: function GetAllRoomListCfg() {
        var roomScrollView = this.node.getChildByName("mark");
        var content = roomScrollView.getChildByName("layout");
        var list = [];
        for (var i = 0; i < content.children.length; i++) {
            var temp = {};
            temp.configId = content.children[i].configId;
            var scorePercentStr = content.children[i].getChildByName("scorePercentEditBox").getComponent(cc.EditBox).string;
            if (content.children[i].configInfo.value == parseFloat(scorePercentStr)) {
                //没有修改不用上传
                continue;
            }
            if (!isNaN(parseFloat(scorePercentStr)) && app.ComTool().StrIsNum(scorePercentStr) && parseFloat(scorePercentStr) >= 0) {
                temp.value = parseFloat(scorePercentStr);
                list.push(temp);
            } else {
                app.SysNotifyManager().ShowSysMsg("活跃计算值请输入大于等于0的数字", [], 3);
                return [];
            }
        }
        return list;
    },
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_save") {
            var sendPack = {};
            sendPack.clubId = this.clubId;
            sendPack.pid = this.data.pid;
            sendPack.promotionCalcActiveItemList = this.GetAllRoomListCfg();
            if (sendPack.promotionCalcActiveItemList.length == 0) {
                return;
            }
            var self = this;
            app.NetManager().SendPack("club.CClubPromotionCalcActiveBatch", sendPack, function (serverPack) {
                app.FormManager().GetFormComponentByFormName("ui/club/UIPromoterManager").ClickLeftBtn("btn_PromoterList");
                app.SysNotifyManager().ShowSysMsg("保存成功", [], 3);
                self.CloseForm();
            }, function () {
                // app.SysNotifyManager().ShowSysMsg("保存失败",[],3);
            });
        } else if (btnName == "btn_cancel") {
            this.CloseForm();
        } else if (btnName == "btn_close") {
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
        //# sourceMappingURL=UIPromoterSetActiveDetail.js.map
        