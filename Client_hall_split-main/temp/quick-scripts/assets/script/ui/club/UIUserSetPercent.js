(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIUserSetPercent.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '63c483l8RxNmIy8sZvyiz48', 'UIUserSetPercent', __filename);
// script/ui/club/UIUserSetPercent.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {},

    OnCreateInit: function OnCreateInit() {},
    OnShow: function OnShow(data) {
        this.data = data;
        var lb_TargetPercent = this.node.getChildByName("lb_TargetPercent").getComponent(cc.RichText);
        lb_TargetPercent.string = "<color=#705d52>修改</c><color=#f8772c>" + data.name.substr(0, 9) + "（ID:" + data.pid + "）" + "</color><color=#705d52>的活跃计算值</c>";
        var lb_curPercent = this.node.getChildByName("lb_curPercent").getComponent(cc.Label);
        if (data.shareType == 1) {
            //固定值
            lb_curPercent.string = "该玩家当前活跃计算值：" + data.shareFixedValue;
            this.node.getChildByName("PercentEditBox").getComponent(cc.EditBox).string = data.shareFixedValue;
            this.node.getChildByName("PercentEditBox2").getComponent(cc.EditBox).string = "";
            this.node.getChildByName("btn_detail_value").active = true;
            this.node.getChildByName("btn_detail_percent").active = false;
            this.node.getChildByName("btn_detail_section").active = false;
        } else if (data.shareType == 0) {
            lb_curPercent.string = "该玩家当前活跃计算值：" + data.shareValue + "%";
            this.node.getChildByName("PercentEditBox").getComponent(cc.EditBox).string = "";
            this.node.getChildByName("PercentEditBox2").getComponent(cc.EditBox).string = data.shareValue;
            this.node.getChildByName("btn_detail_value").active = false;
            this.node.getChildByName("btn_detail_percent").active = true;
            this.node.getChildByName("btn_detail_section").active = false;
        } else {
            lb_curPercent.string = "";
            this.node.getChildByName("PercentEditBox").getComponent(cc.EditBox).string = "";
            this.node.getChildByName("PercentEditBox2").getComponent(cc.EditBox).string = "";
            this.node.getChildByName("btn_detail_value").active = false;
            this.node.getChildByName("btn_detail_percent").active = false;
            this.node.getChildByName("btn_detail_section").active = true;
        }
        this.InitShareType(data.shareType);
        //初始化比赛分输入框
        this.isChange = false;
    },
    SetIsChange: function SetIsChange() {
        this.isChange = true;
        var ToggleContainer = this.node.getChildByName("ToggleContainer");
        var updateShareType = ToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked;
        var updateShareType_3 = ToggleContainer.getChildByName("toggle3").getComponent(cc.Toggle).isChecked;
        if (updateShareType) {
            this.node.getChildByName("btn_detail_value").active = true;
            this.node.getChildByName("btn_detail_percent").active = false;
            this.node.getChildByName("btn_detail_section").active = false;
        } else if (updateShareType_3) {
            this.node.getChildByName("btn_detail_value").active = false;
            this.node.getChildByName("btn_detail_percent").active = false;
            this.node.getChildByName("btn_detail_section").active = true;
        } else {
            this.node.getChildByName("btn_detail_value").active = false;
            this.node.getChildByName("btn_detail_percent").active = true;
            this.node.getChildByName("btn_detail_section").active = false;
        }
    },
    SetNotChange: function SetNotChange() {
        this.isChange = true;
    },
    InitShareType: function InitShareType(shareType) {
        var ToggleContainer = this.node.getChildByName("ToggleContainer");
        if (shareType == 0) {
            ToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = false;
            ToggleContainer.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = true;
            ToggleContainer.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = false;
        } else if (shareType == 1) {
            ToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true;
            ToggleContainer.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = false;
            ToggleContainer.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = false;
        } else {
            ToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = false;
            ToggleContainer.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = false;
            ToggleContainer.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = true;
        }
    },
    GetShareType: function GetShareType() {
        var ToggleContainer = this.node.getChildByName("ToggleContainer");
        var toggle1 = ToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked;
        var toggle3 = ToggleContainer.getChildByName("toggle3").getComponent(cc.Toggle).isChecked;
        if (toggle1) {
            return 1;
        } else if (toggle3) {
            return 2;
        }
        return 0;
    },
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_sure") {
            //固定值
            var shareType = this.GetShareType();
            var percentStr = -1;
            if (shareType == 1) {
                //固定值
                percentStr = this.node.getChildByName("PercentEditBox").getComponent(cc.EditBox).string;
            } else if (shareType == 0) {
                //百分比
                percentStr = this.node.getChildByName("PercentEditBox2").getComponent(cc.EditBox).string;
                if (percentStr > 100) {
                    app.SysNotifyManager().ShowSysMsg("请输入小于100的数字", [], 3);
                    return;
                }
            } else {
                //区间
                percentStr = 0;
            }
            if (parseFloat(percentStr) >= 0) {
                this.SetWaitForConfirm('SureChangePercent', this.ShareDefine.ConfirmYN, [], [percentStr, shareType], "切换分成方式将导致分支下所有推广员的分成方式一起改变，需要重新设置，确认是否切换");
                // let sendPack = app.ClubManager().GetUnionSendPackHead();
                // sendPack.opClubId = this.data.opClubId;
                // sendPack.opPid = this.data.pid;
                // sendPack.value = parseFloat(percentStr);
                // sendPack.shareType = shareType;
                // let self = this;
                // app.NetManager().SendPack("union.CUnionPromotionShareInfo",sendPack, function(serverPack){
                //     app.SysNotifyManager().ShowSysMsg("成功设置活跃计算值",[],3);
                //     self.CloseForm();
                // }, function(){
                //     app.SysNotifyManager().ShowSysMsg("设置活跃计算值失败",[],3);
                // });
            } else {
                app.SysNotifyManager().ShowSysMsg("请输入纯数字", [], 3);
            }
        } else if (btnName == "btn_detail_value") {
            var data = {};
            data.opClubId = this.data.opClubId;
            data.opPid = this.data.pid;
            data.shareFixedValue = this.data.shareFixedValue;
            app.FormManager().ShowForm("ui/club/UIUserSetPercentDetail", data, 1);
            this.CloseForm();
        } else if (btnName == "btn_detail_percent") {
            var _data = {};
            _data.opClubId = this.data.opClubId;
            _data.opPid = this.data.pid;
            _data.shareValue = this.data.shareValue;
            app.FormManager().ShowForm("ui/club/UIUserSetPercentDetail", _data, 0);
            this.CloseForm();
        } else if (btnName == "btn_detail_section") {
            var _data2 = {};
            _data2.opClubId = this.data.opClubId;
            _data2.opPid = this.data.pid;
            _data2.unionFlag = 1;
            _data2.shareValue = this.data.shareValue;
            app.FormManager().ShowForm("ui/club/UIUserSetSection", _data2);
            this.CloseForm();
        } else if (btnName == "btn_close") {
            if (this.isChange == false) {
                this.CloseForm();
            } else {
                this.SetWaitForConfirm('SaveLeft', this.ShareDefine.ConfirmYN, [], [], "退出将不保存修改，确认退出？");
            }
        } else {
            this.ErrLog("OnClick(%s) not find", btnName);
        }
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
        if (msgID == "SaveLeft") {
            this.CloseForm();
        } else if (msgID == "SureChangePercent") {
            var sendPack = app.ClubManager().GetUnionSendPackHead();
            sendPack.opClubId = this.data.opClubId;
            sendPack.opPid = this.data.pid;
            sendPack.value = parseFloat(backArgList[0]);
            sendPack.shareType = backArgList[1];
            var self = this;
            app.NetManager().SendPack("union.CUnionPromotionShareInfo", sendPack, function (serverPack) {
                app.SysNotifyManager().ShowSysMsg("成功设置活跃计算值", [], 3);
                self.CloseForm();
            }, function () {
                app.SysNotifyManager().ShowSysMsg("设置活跃计算值失败", [], 3);
            });
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
        //# sourceMappingURL=UIUserSetPercent.js.map
        