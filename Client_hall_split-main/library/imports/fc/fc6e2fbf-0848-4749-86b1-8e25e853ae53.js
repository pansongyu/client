"use strict";
cc._RF.push(module, 'fc6e2+/CEhHSYaxjiXoU65T', 'UICaseSprots');
// script/ui/club/UICaseSprots.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {},

    OnCreateInit: function OnCreateInit() {},
    OnShow: function OnShow(data, clubId) {
        this.data = data;
        this.clubId = clubId;
        this.node.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = this.data.sportsPoint;
        this.node.getChildByName("lb_CaseSports").getComponent(cc.Label).string = this.data.caseSportsPoint;
        //初始化比赛分输入框
        this.node.getChildByName("PLEditBox").getComponent(cc.EditBox).string = "";
    },
    OnClick: function OnClick(btnName, btnNode) {
        var percentStr = this.node.getChildByName("PLEditBox").getComponent(cc.EditBox).string;
        var percentFloat = parseFloat(percentStr);
        if (btnName == "btn_Add") {
            if (percentFloat > 0 && percentFloat <= this.data.sportsPoint) {
                var sendPack = {};
                var packName = "club.CClubGetCaseSprotsChange";
                sendPack.clubId = this.clubId;
                sendPack.type = 0;
                sendPack.value = parseFloat(percentStr);
                this.SetWaitForConfirm("CaseSprotsChange_Add", app.ShareDefine().ConfirmYN, [], [packName, sendPack], "确认转入" + parseFloat(percentStr) + "比赛分到保险箱");
            } else {
                app.SysNotifyManager().ShowSysMsg("请输入小于自己所拥有比赛分的纯数字", [], 3);
            }
        } else if (btnName == "btn_Del") {
            if (percentFloat > 0 && percentFloat <= this.data.caseSportsPoint) {
                var _sendPack = {};
                var _packName = "club.CClubGetCaseSprotsChange";
                _sendPack.clubId = this.clubId;
                _sendPack.type = 1;
                _sendPack.value = parseFloat(percentStr);
                this.SetWaitForConfirm("CaseSprotsChange_Del", app.ShareDefine().ConfirmYN, [], [_packName, _sendPack], "确认从保险箱转出" + parseFloat(percentStr) + "比赛分");
            } else {
                app.SysNotifyManager().ShowSysMsg("请输入小于该玩家所拥有保险箱内比赛分的纯数字", [], 3);
            }
        } else if (btnName == "btn_close") {
            this.CloseForm();
        } else {
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    },
    SendPointPack: function SendPointPack(packName, sendPack) {
        var self = this;
        app.NetManager().SendPack(packName, sendPack, function (serverPack) {
            app.SysNotifyManager().ShowSysMsg("成功操作保险箱", [], 3);
            self.CloseForm();
        }, function () {
            // app.SysNotifyManager().ShowSysMsg("设置比赛分失败",[],3);
        });
    },

    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    SetWaitForConfirm: function SetWaitForConfirm(msgID, type) {
        var msgArg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var cbArg = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
        var content = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
        var lbSure = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "";
        var lbCancle = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "";

        var ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
        ConfirmManager.ShowConfirm(type, msgID, msgArg, content, lbSure, lbCancle);
    },
    OnConFirm: function OnConFirm(clickType, msgID, cbArgs) {
        if (clickType != "Sure") {
            return;
        }
        if (msgID == "CaseSprotsChange_Add") {
            this.SendPointPack(cbArgs[0], cbArgs[1]);
        } else if (msgID == "CaseSprotsChange_Del") {
            this.SendPointPack(cbArgs[0], cbArgs[1]);
        }
    }
});

cc._RF.pop();