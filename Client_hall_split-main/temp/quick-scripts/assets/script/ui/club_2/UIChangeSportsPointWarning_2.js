(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club_2/UIChangeSportsPointWarning_2.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '482088PGzdIgbxNc7EJ7huM', 'UIChangeSportsPointWarning_2', __filename);
// script/ui/club_2/UIChangeSportsPointWarning_2.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {},
    OnShow: function OnShow(data) {
        this.data = data;
        var lb_tip = this.node.getChildByName("lb_tip").getComponent(cc.Label);
        var lb_taotaifen = this.node.getChildByName("lb_taotaifen").getComponent(cc.Label);
        lb_taotaifen.string = this.data.eliminatePoint;
        lb_taotaifen.node.active = true;
        this.node.getChildByName("PercentEditBox").getComponent(cc.EditBox).string = this.data.eliminatePoint;
        if (typeof data.isPersonal != "undefined" && data.isPersonal) {
            if (typeof data.pidList != "undefined") {
                //批量修改
                lb_taotaifen.node.active = false;
                this.node.getChildByName("PercentEditBox").getComponent(cc.EditBox).string = "";
                lb_tip.string = "确定修改【" + data.pidList.length + "个玩家" + "】的淘汰分吗？\n（个人比赛分低于淘汰分时禁止游戏）";
            } else {
                //个人的
                lb_tip.string = "确定修改【" + data.name + "(" + data.pid + ")" + "】的淘汰分吗？\n（个人比赛分低于淘汰分时禁止游戏）";
            }
        } else {
            //赛事的
            lb_tip.string = "确定修改【" + data.name + "(" + data.pid + ")" + "】的淘汰分吗？\n（个人比赛分低于淘汰分时禁止游戏）";
        }
        this.isChange = false;
    },
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_sure") {
            //淘汰分
            var percentStr = this.node.getChildByName("PercentEditBox").getComponent(cc.EditBox).string;
            if (percentStr > 0) {
                app.SysNotifyManager().ShowSysMsg("只能输入小于等于0的数字", [], 3);
                return;
            }
            if (app.ComTool().StrIsNum(percentStr)) {
                var sendPack = {};
                if (typeof this.data.pidList != "undefined") {
                    sendPack.clubId = this.data.clubId;
                    sendPack.pidList = this.data.pidList;
                    sendPack.value = parseFloat(percentStr);
                    var self = this;
                    app.NetManager().SendPack("club.CClubEliminatePointChangeMulti", sendPack, function (serverPack) {
                        app.SysNotifyManager().ShowSysMsg("成功设置淘汰分", [], 3);
                        app.Client.OnEvent('UpdateChangeAliveNodeData', {});
                        self.CloseForm();
                    }, function () {
                        app.SysNotifyManager().ShowSysMsg("设置淘汰分失败", [], 3);
                    });
                } else {
                    sendPack.clubId = this.data.clubId;
                    sendPack.pid = this.data.pid;
                    sendPack.value = parseFloat(percentStr);
                    var _self = this;
                    app.NetManager().SendPack("club.CClubEliminatePointChange", sendPack, function (serverPack) {
                        app.SysNotifyManager().ShowSysMsg("成功设置淘汰分", [], 3);
                        app.Client.OnEvent('UpdateChangeAliveNodeData', {});
                        _self.CloseForm();
                    }, function () {
                        app.SysNotifyManager().ShowSysMsg("设置淘汰分失败", [], 3);
                    });
                }
            } else {
                app.SysNotifyManager().ShowSysMsg("请输入纯数字", [], 3);
            }
        } else if (btnName == "btn_close") {
            this.CloseForm();
        } else {
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    },
    OnEditBoxEnd: function OnEditBoxEnd(event) {
        var percentStr = event.node.getComponent(cc.EditBox).string;
        if (app.ComTool().StrIsNum(percentStr)) {
            var value = parseFloat(percentStr);
            if (value > 0) {
                event.node.getComponent(cc.EditBox).string = "-" + event.node.getComponent(cc.EditBox).string;
            }
        } else {
            event.node.getComponent(cc.EditBox).string = "";
            app.SysNotifyManager().ShowSysMsg("请输入纯数字", [], 3);
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
        //# sourceMappingURL=UIChangeSportsPointWarning_2.js.map
        