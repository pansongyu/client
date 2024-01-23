"use strict";
cc._RF.push(module, '4eaa1Dz7kZPH5G2GyOd66s6', 'UIRaceSpecial');
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