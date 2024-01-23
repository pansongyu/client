"use strict";
cc._RF.push(module, '74001ZtxPBDjqDBnI2wYDp4', 'UIPromoterSM');
// script/ui/club/UIPromoterSM.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {},

    OnCreateInit: function OnCreateInit() {},

    OnShow: function OnShow() {},
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_close") {
            this.CloseForm();
        } else {
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    }

});

cc._RF.pop();