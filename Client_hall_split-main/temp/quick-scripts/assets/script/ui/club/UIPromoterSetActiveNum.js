(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIPromoterSetActiveNum.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '33e51MAEYFJW4zNctwh6SlF', 'UIPromoterSetActiveNum', __filename);
// script/ui/club/UIPromoterSetActiveNum.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {},

    OnCreateInit: function OnCreateInit() {},
    OnShow: function OnShow(data, clubId) {
        this.data = data;
        this.clubId = clubId;
        var lb_TargetActive = this.node.getChildByName("lb_TargetActive").getComponent(cc.RichText);
        lb_TargetActive.string = "<color=#705d52>因系统异常修改</c><color=#f8772c>" + data.name.substr(0, 8) + "（ID:" + data.pid + "）" + "</color><color=#705d52>的活跃度</c>";
        var lb_curActiveNum = this.node.getChildByName("lb_curActiveNum").getComponent(cc.Label);
        lb_curActiveNum.string = "该玩家当前拥有活跃度：" + data.curActiveValue;
        //初始化比赛分输入框
        this.node.getChildByName("ActiveEditBox").getComponent(cc.EditBox).string = "";
    },
    OnClick: function OnClick(btnName, btnNode) {
        var percentStr = this.node.getChildByName("ActiveEditBox").getComponent(cc.EditBox).string;
        var percentFloat = parseFloat(percentStr);
        if (btnName == "btn_Add") {
            if (percentFloat > 0) {
                var sendPack = {};
                sendPack.pid = this.data.pid;
                sendPack.clubId = this.clubId;
                sendPack.type = 0;
                sendPack.value = parseFloat(percentStr);
                this.SendPointPack(sendPack);
            } else {
                app.SysNotifyManager().ShowSysMsg("请输入大于0的纯数字", [], 3);
            }
        } else if (btnName == "btn_Del") {
            if (percentFloat > 0 && percentFloat <= this.data.curActiveValue) {
                var _sendPack = {};
                _sendPack.pid = this.data.pid;
                _sendPack.clubId = this.clubId;
                _sendPack.type = 1;
                _sendPack.value = parseFloat(percentStr);
                this.SendPointPack(_sendPack);
            } else {
                app.SysNotifyManager().ShowSysMsg("请输入小于该玩家所拥有活跃度的纯数字", [], 3);
            }
        } else if (btnName == "btn_close") {
            this.CloseForm();
        } else {
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    },
    SendPointPack: function SendPointPack(sendPack) {
        var self = this;
        app.NetManager().SendPack("club.CClubPromotionActive", sendPack, function (serverPack) {
            app.FormManager().GetFormComponentByFormName("ui/club/UIPromoterManager").ClickLeftBtn("btn_PromoterList");
            app.SysNotifyManager().ShowSysMsg("成功设置活跃度", [], 3);
            self.CloseForm();
        }, function () {
            // app.SysNotifyManager().ShowSysMsg("设置比赛分失败",[],3);
        });
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
        //# sourceMappingURL=UIPromoterSetActiveNum.js.map
        