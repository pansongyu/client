(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/UIRaceSpecial.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4eaa1Dz7kZPH5G2GyOd66s6', 'UIRaceSpecial', __filename);
// script/ui/UIRaceSpecial.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        right_child: cc.Prefab,
        node_rightLayout: cc.Node
    },
    OnCreateInit: function OnCreateInit() {},
    OnShow: function OnShow() {
        app.FormManager().CloseForm('UINewMain');
        app.FormManager().ShowForm('UIEconomy', 'UIRaceSpecial');
    },
    OnClick: function OnClick(btnName, btnNode) {},
    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {}
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
        //# sourceMappingURL=UIRaceSpecial.js.map
        