"use strict";
cc._RF.push(module, '77e82m5BsNDHKM1GkGELHxY', 'UIUnionTip');
// script/ui/club/UIUnionTip.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {},

    OnCreateInit: function OnCreateInit() {},

    OnShow: function OnShow(unionId, unionName, ownerClubName, clubName) {
        this.unionId = unionId;
        var isNoTip = cc.sys.localStorage.getItem(this.unionId + "_NoTipUnion");
        if (parseInt(isNoTip) == 1) {
            this.node.getChildByName("NoTipToggle").getComponent(cc.Toggle).isChecked = true;
        } else {
            this.node.getChildByName("NoTipToggle").getComponent(cc.Toggle).isChecked = false;
        }
        this.node.getChildByName("lb_unionName").getComponent(cc.Label).string = ownerClubName;
        this.node.getChildByName("lb_clubName").getComponent(cc.Label).string = clubName;
        this.node.getChildByName("lb_title").getComponent(cc.Label).string = "当前亲友圈管理已将亲友圈加入“" + unionName + "”赛事";
    },
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_close") {
            var isChecked = this.node.getChildByName("NoTipToggle").getComponent(cc.Toggle).isChecked;
            if (isChecked) {
                cc.sys.localStorage.setItem(this.unionId + "_NoTipUnion", 1);
            } else {
                cc.sys.localStorage.setItem(this.unionId + "_NoTipUnion", 0);
            }
            this.CloseForm();
        } else {
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    }

});

cc._RF.pop();