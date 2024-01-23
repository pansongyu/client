(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/UICustomerService.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'dee85mklV9NIYhgzWpG3LkJ', 'UICustomerService', __filename);
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
        //# sourceMappingURL=UICustomerService.js.map
        