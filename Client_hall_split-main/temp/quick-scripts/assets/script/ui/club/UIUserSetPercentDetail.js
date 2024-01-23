(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIUserSetPercentDetail.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '64a5fi4S7pO5a+IEgTYhaEH', 'UIUserSetPercentDetail', __filename);
// script/ui/club/UIUserSetPercentDetail.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {},

    OnCreateInit: function OnCreateInit() {
        var roomScrollView = this.node.getChildByName("mark").getComponent(cc.ScrollView);
        roomScrollView.node.on('scroll-to-bottom', this.GetNextPage, this);
    },
    OnShow: function OnShow(data, type) {
        this.data = data;
        this.curPage = 1;
        this.type = type;
        if (type == 1) {
            this.shareFixedValue = data.shareFixedValue;
            this.shareValue = 0;
        } else if (type == 0) {
            this.shareValue = data.shareValue;
            this.shareFixedValue = 0;
        }
        this.GetScorePercentList(true);
    },
    GetNextPage: function GetNextPage() {
        this.curPage++;
        this.GetScorePercentList(false);
    },
    GetScorePercentList: function GetScorePercentList(isRefresh) {
        var sendPack = app.ClubManager().GetUnionSendPackHead();
        sendPack.opClubId = this.data.opClubId;
        sendPack.opPid = this.data.opPid;
        sendPack.pageNum = this.curPage;
        sendPack.type = this.type;
        var self = this;
        app.NetManager().SendPack("union.CUnionScorePercentList", sendPack, function (serverPack) {
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
            child.getChildByName("lb_roomName").getComponent(cc.Label).string = serverPack[i].configName;
            child.getChildByName("lb_roomCount").getComponent(cc.Label).string = serverPack[i].size;
            if (serverPack[i].changeFlag == true) {
                child.getChildByName("scorePercentEditBox").getComponent(cc.EditBox).string = serverPack[i].scorePercent.toString();
            } else {
                if (this.type == 1) {
                    child.getChildByName("scorePercentEditBox").getComponent(cc.EditBox).string = this.shareFixedValue;
                } else if (this.type == 0) {
                    child.getChildByName("scorePercentEditBox").getComponent(cc.EditBox).string = this.shareValue;
                }
            }

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
            if (content.children[i].configInfo.scorePercent == parseFloat(scorePercentStr)) {
                //没有修改不用上传
                continue;
            }
            if (parseFloat(scorePercentStr) != null && parseFloat(scorePercentStr) >= 0) {
                temp.scorePercent = parseFloat(scorePercentStr);
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
            var sendPack = app.ClubManager().GetUnionSendPackHead();
            sendPack.opClubId = this.data.opClubId;
            sendPack.opPid = this.data.opPid;
            sendPack.type = this.type;
            sendPack.unionScorePercentItemList = this.GetAllRoomListCfg();
            if (sendPack.unionScorePercentItemList.length == 0) {
                return;
            }
            var self = this;
            app.NetManager().SendPack("union.CUnionScorePercentBatchUpdate", sendPack, function (serverPack) {
                app.SysNotifyManager().ShowSysMsg("保存成功", [], 3);
                self.CloseForm();
            }, function () {
                app.SysNotifyManager().ShowSysMsg("保存失败", [], 3);
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
        //# sourceMappingURL=UIUserSetPercentDetail.js.map
        