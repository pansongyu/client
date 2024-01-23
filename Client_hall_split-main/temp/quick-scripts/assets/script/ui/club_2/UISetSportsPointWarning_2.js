(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club_2/UISetSportsPointWarning_2.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '671c0FgQZNKkbQDUTKe/oEd', 'UISetSportsPointWarning_2', __filename);
// script/ui/club_2/UISetSportsPointWarning_2.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("UISetSportsPointWarning"),

    properties: {},

    OnShow: function OnShow(data) {
        this.data = data;
        var lb_tip = this.node.getChildByName("lb_tip").getComponent(cc.Label);
        if (typeof data.isPersonal != "undefined" && data.isPersonal) {
            //个人的
            lb_tip.string = "设置预警值后，该玩家【" + data.name + "】比赛分低于预警值将无法游戏";
        } else {
            //赛事的
            lb_tip.string = "设置生存积分后，该亲友圈【" + data.name + "(" + data.clubSign + ")" + "】内所有玩家的“最终积分”总和低于生存积分要求时，该亲友圈内所有玩家将禁止游戏。";
        }
        this.node.getChildByName("PercentEditBox").getComponent(cc.EditBox).string = this.data.alivePoint;
        this.InitShareType(data.alivePointStatus);
        this.isChange = false;
    },
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_sure") {
            //生存积分
            var alivePointStatus = this.GetShareType();
            var percentStr = this.node.getChildByName("PercentEditBox").getComponent(cc.EditBox).string;
            if (percentStr > 0) {
                app.SysNotifyManager().ShowSysMsg("只能输入小于等于0的数字", [], 3);
                return;
            }
            if (app.ComTool().StrIsNum(percentStr)) {
                var sendPack = app.ClubManager().GetUnionSendPackHead();
                if (typeof this.data.isPersonal != "undefined" && this.data.isPersonal) {
                    //个人的
                    sendPack.pid = this.data.pid;
                    sendPack.value = parseFloat(percentStr);
                    sendPack.alivePointStatus = alivePointStatus;
                    var self = this;
                    app.NetManager().SendPack("club.CClubAlivePointChange", sendPack, function (serverPack) {
                        app.SysNotifyManager().ShowSysMsg("成功设置生存积分", [], 3);
                        self.CloseForm();
                    }, function () {
                        app.SysNotifyManager().ShowSysMsg("设置生存积分失败", [], 3);
                    });
                } else if (typeof this.data.clubId == "undefined") {
                    sendPack.pid = this.data.pid;
                    sendPack.value = parseFloat(percentStr);
                    sendPack.alivePointStatus = alivePointStatus;
                    var _self = this;
                    app.NetManager().SendPack("club.CClubSportsPointWarningChange", sendPack, function (serverPack) {
                        app.SysNotifyManager().ShowSysMsg("成功设置生存积分", [], 3);
                        _self.CloseForm();
                    }, function () {
                        app.SysNotifyManager().ShowSysMsg("设置生存积分失败", [], 3);
                    });
                } else {
                    sendPack.opClubId = this.data.clubId;
                    sendPack.opPid = this.data.createId;
                    sendPack.value = parseFloat(percentStr);
                    sendPack.alivePointStatus = alivePointStatus;
                    var _self2 = this;
                    app.NetManager().SendPack("union.CUnionAlivePointChange", sendPack, function (serverPack) {
                        app.SysNotifyManager().ShowSysMsg("成功设置生存积分", [], 3);
                        _self2.CloseForm();
                    }, function () {
                        app.SysNotifyManager().ShowSysMsg("设置生存积分失败", [], 3);
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
        //# sourceMappingURL=UISetSportsPointWarning_2.js.map
        