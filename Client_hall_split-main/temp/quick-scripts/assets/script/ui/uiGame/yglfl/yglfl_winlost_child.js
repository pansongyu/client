(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/yglfl/yglfl_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0098by1JodOwbaDiJ1TW3Nh', 'yglfl_winlost_child', __filename);
// script/ui/uiGame/yglfl/yglfl_winlost_child.js

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

        //阵营
        var lb_zhenying = this.node.getChildByName("contentLayout").getChildByName("lb_zhenying");
        lb_zhenying.active = true;
        var zhenying = lb_zhenying.getComponent(cc.Label);
        if (player.ranksType == 1) {
            zhenying.string = "红方";
        } else if (player.ranksType == 2) {
            zhenying.string = "蓝方";
        } else {
            zhenying.string = "";
        }

        var contentLayout = this.node.getChildByName("contentLayout");
        //奖分
        contentLayout.getChildByName("lb_jiangligenshu").getComponent(cc.Label).string = player.rewardRootNum;
        //输赢分
        contentLayout.getChildByName("lb_jiangfen").getComponent(cc.Label).string = player.rewardScore;
        //得分
        contentLayout.getChildByName("lb_defen").getComponent(cc.Label).string = player.baseScore;
        //罚分
        contentLayout.getChildByName("lb_fafen").getComponent(cc.Label).string = player.faScore;
        //总得分
        contentLayout.getChildByName("lb_zongdefen").getComponent(cc.Label).string = player.point;
        if (player.faScore == 0) {
            contentLayout.getChildByName("lb_defen").active = true;
            contentLayout.getChildByName("lb_fafen").active = false;
        } else {
            contentLayout.getChildByName("lb_defen").active = false;
            contentLayout.getChildByName("lb_fafen").active = true;
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
        //# sourceMappingURL=yglfl_winlost_child.js.map
        