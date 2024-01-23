"use strict";
cc._RF.push(module, '54030eP2kFDS6vShjYoykbF', 'UIExchange');
// script/ui/UIExchange.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {},

    OnCreateInit: function OnCreateInit() {},

    OnShow: function OnShow() {
        this.ShowFastCount();
    },
    ShowFastCount: function ShowFastCount() {
        var heroFastCount = app.HeroManager().GetHeroProperty("fastCard");
        this.SetWndProperty("sp_exchange/sp_me/lb_num", "text", heroFastCount);
    },
    //---------点击函数---------------------
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_01") {
            this.Log("5元话费充值卡");
        } else if (btnName == "btn_02") {
            this.Log("10元话费充值卡");
        } else if (btnName == "btn_03") {
            this.Log("50M流量充值卡");
        } else {
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    }
});

cc._RF.pop();