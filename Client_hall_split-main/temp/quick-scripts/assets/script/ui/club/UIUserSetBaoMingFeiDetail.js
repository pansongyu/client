(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIUserSetBaoMingFeiDetail.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd6231w+3oFDY6iywXWqGTCi', 'UIUserSetBaoMingFeiDetail', __filename);
// script/ui/club/UIUserSetBaoMingFeiDetail.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {},

    OnCreateInit: function OnCreateInit() {
        var roomScrollView = this.node.getChildByName("mark").getComponent(cc.ScrollView);
        roomScrollView.node.on('scroll-to-bottom', this.GetNextPage, this);

        this.RegEvent("OnClubFixedShareChangeMulti", this.Event_ClubFixedShareChangeMulti, this);
    },
    OnShow: function OnShow(data, type) {
        var isShowSelf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        this.data = data;
        this.isShowSelf = isShowSelf;
        this.curPage = 1;
        this.type = type;
        if (type == 1) {
            this.shareFixedValue = data.shareFixedValue;
            this.shareValue = 0;
        } else if (type == 0) {
            this.shareValue = data.shareValue;
            this.shareFixedValue = 0;
        }
        if (this.isShowSelf) {
            this.node.getChildByName("btn_reservedValue").active = false;
            this.node.getChildByName("top").getChildByName("tip_pl").active = false;
        } else {
            if (type == 1) {
                this.node.getChildByName("btn_reservedValue").active = true;
            } else {
                this.node.getChildByName("btn_reservedValue").active = false;
            }
            this.node.getChildByName("top").getChildByName("tip_pl").active = true;
        }
        this.GetScorePercentList(true);
    },
    GetNextPage: function GetNextPage() {
        // this.curPage++;
        // this.GetScorePercentList(false);
    },
    GetScorePercentList: function GetScorePercentList(isRefresh) {
        var sendPack = {};
        sendPack.clubId = this.data.opClubId;
        sendPack.pid = this.data.opPid;
        sendPack.pageNum = this.curPage;
        sendPack.type = this.type;
        var self = this;
        if (this.isShowSelf) {
            app.NetManager().SendPack("club.CClubPromotionShareChangeListSelfInfo", sendPack, function (serverPack) {
                self.UpdateScrollView(serverPack, isRefresh);
            }, function () {
                app.SysNotifyManager().ShowSysMsg("获取房间活跃计算列表失败", [], 3);
            });
        } else {
            app.NetManager().SendPack("club.CClubPromotionShareChangeList", sendPack, function (serverPack) {
                self.UpdateScrollView(serverPack, isRefresh);
            }, function () {
                app.SysNotifyManager().ShowSysMsg("获取房间活跃计算列表失败", [], 3);
            });
        }
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
            if (this.isShowSelf) {
                child.getChildByName("scorePercentEditBox").active = false;
            } else {
                child.getChildByName("scorePercentEditBox").active = true;
                if (serverPack[i].changeFlag == true) {
                    child.getChildByName("scorePercentEditBox").getComponent(cc.EditBox).string = serverPack[i].value.toString();
                } else {
                    if (this.type == 1) {
                        child.getChildByName("scorePercentEditBox").getComponent(cc.EditBox).string = this.shareFixedValue;
                    } else if (this.type == 0) {
                        child.getChildByName("scorePercentEditBox").getComponent(cc.EditBox).string = this.shareValue;
                    }
                }
            }

            //可分配
            if (serverPack[i].type == 0) {
                child.getChildByName("lb_allowValue").getComponent(cc.Label).string = serverPack[i].allowValue + "%";
            } else {
                child.getChildByName("lb_allowValue").getComponent(cc.Label).string = serverPack[i].allowValue;
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
                temp.value = parseFloat(scorePercentStr);
                list.push(temp);
            } else {
                app.SysNotifyManager().ShowSysMsg("活跃计算值请输入大于等于0的数字", [], 3);
                return [];
            }
        }
        return list;
    },
    Event_ClubFixedShareChangeMulti: function Event_ClubFixedShareChangeMulti(event) {
        this.UpdateScrollView(event, true);
    },
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_save") {
            if (this.isShowSelf) {
                this.CloseForm();
                return;
            }
            var sendPack = {};
            sendPack.clubId = this.data.opClubId;
            sendPack.pid = this.data.opPid;
            sendPack.type = this.type;
            sendPack.promotionCalcActiveItemList = this.GetAllRoomListCfg();
            if (sendPack.promotionCalcActiveItemList.length == 0) {
                return;
            }
            var self = this;
            app.NetManager().SendPack("club.CClubPromotionShareChangeBatch", sendPack, function (serverPack) {
                app.SysNotifyManager().ShowSysMsg("保存成功", [], 3);
                self.CloseForm();
            }, function () {
                app.SysNotifyManager().ShowSysMsg("保存失败", [], 3);
            });
        } else if (btnName == "btn_reservedValue") {
            var _sendPack = {};
            _sendPack.clubId = this.data.opClubId;
            _sendPack.pid = this.data.opPid;
            var promotionCalcActiveItemList = this.GetAllRoomListCfg();
            var _self = this;
            app.NetManager().SendPack("club.CClubReservedValueInfo", _sendPack, function (serverPack) {
                serverPack.promotionCalcActiveItemList = promotionCalcActiveItemList;
                serverPack.clubId = _self.data.opClubId;
                serverPack.pid = _self.data.opPid;
                serverPack.type = _self.type;
                app.FormManager().ShowForm("ui/club/UIUserSetReservedBaoMingFei", serverPack);
            }, function () {});
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
        //# sourceMappingURL=UIUserSetBaoMingFeiDetail.js.map
        