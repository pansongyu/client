"use strict";
cc._RF.push(module, '93af9sdHptCqqd5W9Zcvwtb', 'UIPromoterPowerOp');
// script/ui/club/UIPromoterPowerOp.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {},

    //初始化
    OnCreateInit: function OnCreateInit() {
        this.kickingToggleContainer = this.node.getChildByName("kickingNode").getChildByName("kickingToggleContainer");
        this.modifyValueToggleContainer = this.node.getChildByName("modifyValueNode").getChildByName("modifyValueToggleContainer");
        this.inviteToggleContainer = this.node.getChildByName("inviteNode").getChildByName("inviteToggleContainer");
        this.showShareToggleContainer = this.node.getChildByName("showShareNode").getChildByName("showShareToggleContainer");
    },

    //---------显示函数--------------------
    OnShow: function OnShow(clubId, pid, kicking, modifyValue, showShare, invite) {
        this.clubId = clubId;
        this.pid = pid;
        if (kicking == 0) {
            this.kickingToggleContainer.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = true;
        } else {
            this.kickingToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true;
        }
        if (modifyValue == 0) {
            this.modifyValueToggleContainer.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = true;
        } else {
            this.modifyValueToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true;
        }
        if (showShare == 0) {
            this.showShareToggleContainer.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = true;
        } else {
            this.showShareToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true;
        }
        if (invite == 0) {
            this.inviteToggleContainer.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = true;
        } else {
            this.inviteToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true;
        }
    },
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_close' == btnName) {
            this.CloseForm();
        } else if ('btn_sure' == btnName) {
            var self = this;
            var sendPack = {};
            sendPack.clubId = this.clubId;
            sendPack.pid = this.pid;
            if (this.kickingToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked) {
                sendPack.kicking = 1;
            } else {
                sendPack.kicking = 0;
            }
            if (this.modifyValueToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked) {
                sendPack.modifyValue = 1;
            } else {
                sendPack.modifyValue = 0;
            }
            if (this.inviteToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked) {
                sendPack.invite = 1;
            } else {
                sendPack.invite = 0;
            }
            if (this.showShareToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked) {
                sendPack.showShare = 1;
            } else {
                sendPack.showShare = 0;
            }
            app.NetManager().SendPack("club.CClubPromotionLevelPowerOp", sendPack, function (serverPack) {
                app.SysNotifyManager().ShowSysMsg("修改成功，请重新打开推广员界面，刷新权限");
                self.CloseForm();
            }, function () {
                //app.SysNotifyManager().ShowSysMsg("从属修改失败");
            });
        } else {
            this.ErrLog("OnClick:%s not find", btnName);
        }
    }
});

cc._RF.pop();