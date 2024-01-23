"use strict";
cc._RF.push(module, 'dee85mklV9NIYhgzWpG3LkJ', 'UICustomerService');
// script/ui/UICustomerService.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {},
    //---------点击函数---------------------
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn") {} else {
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    }
});

cc._RF.pop();