(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/dle/dle_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8ab15CofGZKnJMWaf/6nqOE', 'dle_winlost_child', __filename);
// script/ui/uiGame/dle/dle_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
  extends: require("BasePoker_winlost_child"),

  properties: {},

  // use this for initialization
  OnLoad: function OnLoad() {},
  ShowSpecData: function ShowSpecData(setEnd, playerAll, index) {
    var player = setEnd.posResultList[index];

    //抓分
    var lb_sheng2 = this.node.getChildByName("contentLayout").getChildByName("lb_sheng2");
    lb_sheng2.active = true;
    var sheng2 = lb_sheng2.getComponent(cc.Label);
    sheng2.string = player.twoRestNum;
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
        //# sourceMappingURL=dle_winlost_child.js.map
        