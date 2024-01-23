"use strict";
cc._RF.push(module, 'fjsszf77-9e26-4e6c-963e-a986ed4e2dfc', 'fjssz_UIAutoPlay');
// script/ui/fjssz_UIAutoPlay.js

"use strict";

var app = require("fjssz_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
        lb_notice: cc.Node
    },

    // use this for initialization
    OnCreateInit: function OnCreateInit() {},
    OnShow: function OnShow() {
        var gameName = app.subGameName;
        if (gameName.indexOf("mj") > -1) {
            this.lb_notice.active = true;
        } else {
            this.lb_notice.active = false;
        }
        app[app.subGameName + "Client"].OnEvent("Card01AutoPlay", []);
    },
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_cancel' == btnName) {
            app[app.subGameName + "_GameManager"]().CancelAutoPlay();
            this.CloseForm();
        }
    }
});

cc._RF.pop();