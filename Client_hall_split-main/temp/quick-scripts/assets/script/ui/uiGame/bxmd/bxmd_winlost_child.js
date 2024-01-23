(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/bxmd/bxmd_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1ca8aMho/VC6Ko+t01dIS9q', 'bxmd_winlost_child', __filename);
// script/ui/uiGame/bxmd/bxmd_winlost_child.js

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
        this.node.getChildByName("img_huo").active = false;
        this.node.getChildByName("img_sl").active = false;
        this.node.getChildByName("img_sb").active = false;
        this.node.getChildByName("lb_lose_num").active = true;
        this.node.getChildByName("lb_win_num").active = true;
        this.node.getChildByName("lb_lose_num").getComponent(cc.Label).string = "";
        this.node.getChildByName("lb_win_num").getComponent(cc.Label).string = "";
        console.log("ShowSpecData", setEnd, playerAll, index);
        var posResultList = setEnd["posResultList"];
        var endPos = posResultList[index];
        var endType = endPos["endType"];
        var state = endPos["state"];
        var k510Point = endPos["k510Point"];
        var xiPoint = endPos["xiPoint"];
        var totalPoint = endPos["totalPoint"];
        var ranksType = endPos["ranksType"];
        var danZhuaPoint = endPos["danZhuaPoint"];
        var tiPoint = endPos["tiPoint"];
        var winLosePoint = endPos["winLosePoint"];
        var youshuDict = {
            "NOT": "",
            "ONE": "一游",
            "TWO": "二游",
            "THREE": "三游",
            "FOUR": "四游"
        };
        var zhuaStrz = "双抓";
        var zhuaStry = "双抓";
        if (danZhuaPoint == 20) {
            zhuaStrz = "单抓";
        }
        this.node.getChildByName("lb_youshu").getComponent(cc.Label).string = youshuDict[endType];
        this.node.getChildByName("lb_zhuafen").getComponent(cc.Label).string = "抓分:" + k510Point;
        this.node.getChildByName("lb_xifen").getComponent(cc.Label).string = "喜分:" + xiPoint;
        this.node.getChildByName("lb_duiwufen").getComponent(cc.Label).string = "队伍得分:" + totalPoint;
        if (ranksType == 1) {
            this.node.getChildByName("lb_beizhuafen").getComponent(cc.Label).string = "被" + zhuaStrz + danZhuaPoint;
            this.node.getChildByName("img_huo").active = true;
        } else if (ranksType == 2) {
            this.node.getChildByName("lb_beizhuafen").getComponent(cc.Label).string = zhuaStry + danZhuaPoint;
        }
        this.node.getChildByName("lb_tifen").getComponent(cc.Label).string = "剔分:" + tiPoint;
        if (state == "WIN") {
            this.node.getChildByName("img_sl").active = true;
        } else if (state == "LOSE") {
            this.node.getChildByName("img_sb").active = true;
        }
        if (winLosePoint > 0) {
            this.node.getChildByName("lb_win_num").getComponent(cc.Label).string = "+" + winLosePoint;
        } else {
            this.node.getChildByName("lb_lose_num").getComponent(cc.Label).string = winLosePoint;
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
        //# sourceMappingURL=bxmd_winlost_child.js.map
        