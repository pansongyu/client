(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/zass/zass_detail_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '399ffacfeVMWq660qaK9rqr', 'zass_detail_child', __filename);
// script/ui/uiGame/zass/zass_detail_child.js

"use strict";

/*

 */

var app = require("app");

cc.Class({
  extends: require("BaseMJ_detail_child"),

  properties: {},

  // use this for initialization
  OnLoad: function OnLoad() {},
  huTypesShow: function huTypesShow(jiesuan, huData) {
    jiesuan.getChildByName('top').getChildByName('lb_hupai').getComponent(cc.Label).string = huData.winNum;
    jiesuan.getChildByName('top').getChildByName('lb_shibai').getComponent(cc.Label).string = huData.lostNum;
    jiesuan.getChildByName('top').getChildByName('lb_liuju').getComponent(cc.Label).string = huData.pingNum;
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
        //# sourceMappingURL=zass_detail_child.js.map
        