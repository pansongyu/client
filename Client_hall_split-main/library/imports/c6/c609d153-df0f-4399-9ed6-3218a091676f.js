"use strict";
cc._RF.push(module, 'c609dFT3w9DmZ7WMhigkWdv', 'UIUserSetPL');
// script/ui/club/UIUserSetPL.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        unionTitle: cc.SpriteFrame,
        clubTitle: cc.SpriteFrame
    },

    OnCreateInit: function OnCreateInit() {},
    OnShow: function OnShow(data) {
        var isUnion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var isPromoter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        this.data = data;
        this.isUnion = isUnion;
        this.isPromoter = isPromoter;
        var lb_TargetPL = this.node.getChildByName("lb_TargetPL").getComponent(cc.RichText);
        if (this.data.myisminister > 0) {
            this.node.getChildByName("btn_Add").getChildByName("lb_btnName").getComponent(cc.Label).string = "增 加";
            this.node.getChildByName("btn_Del").getChildByName("lb_btnName").getComponent(cc.Label).string = "退 赛";
            this.node.getChildByName("lb_tip_1").active = true;
            this.node.getChildByName("btn_help").active = false;
            this.node.getChildByName("img_title").getComponent(cc.Sprite).spriteFrame = this.unionTitle;
            lb_TargetPL.string = "<color=#705d52>授权</c><color=#f8772c>" + this.ComTool.GetBeiZhuName(data.pid, data.name, 9) + "（ID:" + data.pid + "）" + "</color><color=#705d52>可裁判的比赛分</c>";
        } else {
            this.node.getChildByName("btn_Add").getChildByName("lb_btnName").getComponent(cc.Label).string = "补 偿";
            this.node.getChildByName("btn_Del").getChildByName("lb_btnName").getComponent(cc.Label).string = "退 赛";
            this.node.getChildByName("lb_tip_1").active = false;
            this.node.getChildByName("btn_help").active = true;
            this.node.getChildByName("img_title").getComponent(cc.Sprite).spriteFrame = this.clubTitle;
            lb_TargetPL.string = "<color=#705d52>因异常修改</c><color=#f8772c>" + this.ComTool.GetBeiZhuName(data.pid, data.name, 9) + "（ID:" + data.pid + "）" + "</color><color=#705d52>的比赛分</c>";
        }
        var lb_curPL = this.node.getChildByName("lb_curPL").getComponent(cc.Label);
        lb_curPL.string = "该玩家当前拥有比赛分：" + data.targetPL;
        var lb_owerPL = this.node.getChildByName("lb_owerPL").getComponent(cc.Label);
        lb_owerPL.string = "您当前可操作比赛分：" + data.owerPL;
        //初始化比赛分输入框
        this.node.getChildByName("PLEditBox").getComponent(cc.EditBox).string = "";

        this.tuisaiPoint = data.targetPL;
    },
    UpdateCurPL: function UpdateCurPL(targetPL) {
        var lb_curPL = this.node.getChildByName("lb_curPL").getComponent(cc.Label);
        lb_curPL.string = "该玩家当前拥有比赛分：" + targetPL;
        this.tuisaiPoint = targetPL;
    },
    OnClick: function OnClick(btnName, btnNode) {
        var percentStr = this.node.getChildByName("PLEditBox").getComponent(cc.EditBox).string;
        var percentFloat = parseFloat(percentStr);
        this.node.getChildByName("PLEditBox").getComponent(cc.EditBox).string = ""; //防止二次点击，每次点击都清空输入框
        if (btnName == "btn_Add") {
            if (percentFloat <= this.data.owerPL) {
                var sendPack = {};
                var packName = "";
                if (this.isUnion && !this.isPromoter) {
                    sendPack = app.ClubManager().GetUnionSendPackHead();
                    sendPack.opClubId = this.data.opClubId;
                    packName = "union.CUnionSportsPointUpdate";
                } else if (!this.isUnion && this.isPromoter) {
                    sendPack.clubId = this.data.targetClubId;
                    packName = "club.CClubSubordinateLevelSportsPointUpdate";
                } else {
                    sendPack.clubId = app.ClubManager().GetUnionSendPackHead().clubId;
                    packName = "club.CClubSportsPointUpdate";
                }
                sendPack.opPid = this.data.pid;
                sendPack.type = 0;
                sendPack.value = parseFloat(percentStr);
                this.SendPointPack(packName, sendPack);
            } else {
                app.SysNotifyManager().ShowSysMsg("请输入小于自己可操作比赛分的纯数字", [], 3);
            }
        } else if (btnName == "btn_Del") {
            app.FormManager().ShowForm("ui/club/UIUserOutRace", this.data, this.isUnion, this.isPromoter, percentStr);
            // this.SetWaitForConfirm('FORCE_OUT_UNION',this.ShareDefine.Confirm,[],[this.data.targetPL], "玩家身上拥有"+this.data.targetPL+"竞技点值，是否将玩家竞技清零并退赛");
            // if (percentFloat > 0 && percentFloat <= this.data.targetPL) {
            //     let sendPack = {};
            //     let packName = "";
            //     if (this.isUnion && !this.isPromoter) {
            //         sendPack = app.ClubManager().GetUnionSendPackHead();
            //         sendPack.opClubId = this.data.opClubId;
            //         packName = "union.CUnionSportsPointUpdate";
            //     }else if (!this.isUnion && this.isPromoter) {
            //         sendPack.clubId = this.data.targetClubId;
            //         packName = "club.CClubSubordinateLevelSportsPointUpdate";
            //     }else{
            //         sendPack.clubId = app.ClubManager().GetUnionSendPackHead().clubId;
            //         packName = "club.CClubSportsPointUpdate";
            //     }
            //     sendPack.opPid = this.data.pid;
            //     sendPack.type = 1;
            //     sendPack.value = parseFloat(percentStr);
            //     this.SendPointPack(packName, sendPack);
            // }else{
            //     app.SysNotifyManager().ShowSysMsg("请输入大于该玩家所拥有比赛分的纯数字",[],3);
            // }
        } else if (btnName == "btn_tuisai") {
            var _sendPack = {};
            var _packName = "";
            if (this.isUnion && !this.isPromoter) {
                _sendPack = app.ClubManager().GetUnionSendPackHead();
                _sendPack.opClubId = this.data.opClubId;
                _packName = "union.CUnionSportsPointUpdate";
            } else if (!this.isUnion && this.isPromoter) {
                _sendPack.clubId = this.data.targetClubId;
                _packName = "club.CClubSubordinateLevelSportsPointUpdate";
            } else {
                _sendPack.clubId = app.ClubManager().GetUnionSendPackHead().clubId;
                _packName = "club.CClubSportsPointUpdate";
            }
            _sendPack.opPid = this.data.pid;
            if (this.tuisaiPoint > 0) {
                _sendPack.type = 1;
            } else {
                _sendPack.type = 0;
            }
            _sendPack.value = Math.abs(this.tuisaiPoint);
            this.SendPointPack(_packName, _sendPack);
        } else if (btnName == "btn_close") {
            this.CloseForm();
        } else if (btnName == "btn_help") {
            this.node.getChildByName("helpNode").active = !this.node.getChildByName("helpNode").active;
        } else {
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    },
    SendPointPack: function SendPointPack(packName, sendPack) {
        var self = this;
        app.NetManager().SendPack(packName, sendPack, function (serverPack) {
            if (serverPack.type == 0) {
                app.SysNotifyManager().ShowSysMsg("成功设置比赛分", [], 3);
            } else {
                app.SysNotifyManager().ShowSysMsg("玩家退赛成功，已将玩家" + serverPack.value + "竞技点值 清零并退赛");
            }

            var lb_curPL = self.node.getChildByName("lb_curPL").getComponent(cc.Label);
            lb_curPL.string = "该玩家当前拥有比赛分：" + serverPack.changedValue;
            if (self.isPromoter) {
                self.CloseForm();
                var newPath = 'ui/club/UIPromoterAllManager';
                if (app.ClubManager().GetUnionTypeByLastClubData() == 1) {
                    newPath = 'ui/club_2/UIPromoterAllManager_2';
                }
                self.FormManager.GetFormComponentByFormName(newPath).GetPromoterList(true);
            }
        }, function () {
            // app.SysNotifyManager().ShowSysMsg("设置比赛分失败",[],3);
        });
    },
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
    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {
        if (clickType != "Sure") {
            return;
        }
        if (msgID == "FORCE_OUT_UNION") {
            var sendPack = {};
            var packName = "";
            if (this.isUnion && !this.isPromoter) {
                sendPack = app.ClubManager().GetUnionSendPackHead();
                sendPack.opClubId = this.data.opClubId;
                packName = "union.CUnionSportsPointUpdate";
            } else if (!this.isUnion && this.isPromoter) {
                sendPack.clubId = this.data.targetClubId;
                packName = "club.CClubSubordinateLevelSportsPointUpdate";
            } else {
                sendPack.clubId = app.ClubManager().GetUnionSendPackHead().clubId;
                packName = "club.CClubSportsPointUpdate";
            }
            sendPack.opPid = this.data.pid;
            sendPack.type = 1;
            sendPack.value = backArgList[0];
            this.SendPointPack(packName, sendPack);
        }
    }
});

cc._RF.pop();