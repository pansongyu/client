(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/sd/sd_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3350c4j271NZbHPN3AX2PTh', 'sd_winlost_child', __filename);
// script/ui/uiGame/sd/sd_winlost_child.js

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

        this.node.getChildByName("lb_zhadanfen").active = true;
        var lb_zhadanfen = this.node.getChildByName("lb_zhadanfen").getComponent(cc.Label);
        lb_zhadanfen.string = player.zhaDanFen;
        //剩余牌数
        if (player.shouCard.length > 0) {
            this.node.getChildByName("lb_paishu").active = true;
            var paishu = this.node.getChildByName("lb_paishu").getComponent(cc.Label);
            paishu.string = player.shouCard.length;
        } else {
            this.node.getChildByName("lb_paishu").active = false;
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
        //# sourceMappingURL=sd_winlost_child.js.map
        