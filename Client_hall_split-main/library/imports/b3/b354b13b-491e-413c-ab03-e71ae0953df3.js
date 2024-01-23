"use strict";
cc._RF.push(module, 'b354bE7SR5BPKsD5xrglT3z', 'UIUserSelfBaoMingFei');
// script/ui/club/UIUserSelfBaoMingFei.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {},

    OnCreateInit: function OnCreateInit() {},
    OnShow: function OnShow(data) {
        this.data = data;
        if (data.shareType == 1) {
            //固定值
            this.node.getChildByName("PercentEditBox2").getComponent(cc.EditBox).string = data.shareFixedValue;
            this.node.getChildByName("PercentEditBox").getComponent(cc.EditBox).string = "";
        } else if (data.shareType == 0) {
            //初始化比赛分输入框
            this.node.getChildByName("PercentEditBox").getComponent(cc.EditBox).string = data.shareValue;
            this.node.getChildByName("PercentEditBox2").getComponent(cc.EditBox).string = "";
        } else if (data.shareType == 2) {
            //区间
            this.node.getChildByName("PercentEditBox").getComponent(cc.EditBox).string = "";
            this.node.getChildByName("PercentEditBox2").getComponent(cc.EditBox).string = "";
        }
        this.InitShareType(data.shareType);
    },
    InitShareType: function InitShareType(shareType) {
        var ToggleContainer = this.node.getChildByName("ToggleContainer");
        if (shareType == 1) {
            ToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = false;
            ToggleContainer.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = true;
            ToggleContainer.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = false;
        } else if (shareType == 0) {
            ToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true;
            ToggleContainer.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = false;
            ToggleContainer.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = false;
        } else if (shareType == 2) {
            ToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = false;
            ToggleContainer.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = false;
            ToggleContainer.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = true;
        }
    },
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_sure") {
            this.CloseForm();
        } else if (btnName == "btn_detail_value") {
            var data = {};
            data.opClubId = app.ClubManager().GetUnionSendPackHead().clubId;
            data.opPid = this.data.pid;
            data.shareFixedValue = this.data.shareFixedValue;
            app.FormManager().ShowForm("ui/club/UIUserSetBaoMingFeiDetail", data, 1, true);
            this.CloseForm();
        } else if (btnName == "btn_detail_percent") {
            var _data = {};
            _data.opClubId = app.ClubManager().GetUnionSendPackHead().clubId;
            _data.opPid = this.data.pid;
            _data.shareValue = this.data.shareValue;
            app.FormManager().ShowForm("ui/club/UIUserSetBaoMingFeiDetail", _data, 0, true);
            this.CloseForm();
        } else if (btnName == "btn_detail_section") {
            var _data2 = {};
            _data2.opClubId = app.ClubManager().GetUnionSendPackHead().clubId;
            _data2.opPid = this.data.pid;
            _data2.unionFlag = 0;
            _data2.shareValue = this.data.shareValue;
            app.FormManager().ShowForm("ui/club/UIUserSetSection", _data2, true);
            this.CloseForm();
        } else if (btnName == "btn_close") {
            this.CloseForm();
        } else {
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    }

});

cc._RF.pop();