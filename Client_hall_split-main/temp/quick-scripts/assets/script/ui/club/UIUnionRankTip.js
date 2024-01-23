(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIUnionRankTip.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '78d6129dTVH07DmEqbOvS6v', 'UIUnionRankTip', __filename);
// script/ui/club/UIUnionRankTip.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {},

    OnCreateInit: function OnCreateInit() {},

    OnShow: function OnShow(unionName, unionRankingItem) {
        var lb_unionName = this.node.getChildByName("lb_unionName").getComponent(cc.RichText);
        lb_unionName.string = "<color=#705d52>您所参与的</c><color=#53a632>" + unionName.substr(0, 8) + "</color><color=#705d52>，已开始新一轮的比赛</c>";
        var lb_rank = this.node.getChildByName("lb_rank").getComponent(cc.RichText);
        if (unionRankingItem == null || typeof unionRankingItem == "undefined" || unionRankingItem.rankingId <= 0) {
            lb_rank.string = "<color=#705d52>您在上一轮的比赛排名：</c><color=#e76b20>未上榜</color>";
            this.node.getChildByName("img_zs").active = false;
            this.node.getChildByName("img_ld").active = false;
            this.node.getChildByName("lb_reward").getComponent(cc.Label).string = "";
            this.node.getChildByName("lb_rewardNum").getComponent(cc.Label).string = "";
        } else {
            lb_rank.string = "<color=#705d52>您在上一轮的比赛排名：</c><color=#e76b20>" + unionRankingItem.rankingId + "</color>";
            this.node.getChildByName("lb_reward").getComponent(cc.Label).string = "恭喜您获得";
            if (unionRankingItem.prizeType == 1) {
                this.node.getChildByName("img_zs").active = false;
                this.node.getChildByName("img_ld").active = true;
                this.node.getChildByName("lb_rewardNum").getComponent(cc.Label).string = "x" + unionRankingItem.value;
            } else if (unionRankingItem.prizeType == 2) {
                this.node.getChildByName("img_zs").active = true;
                this.node.getChildByName("img_ld").active = false;
                this.node.getChildByName("lb_rewardNum").getComponent(cc.Label).string = "x" + unionRankingItem.value;
            } else {
                this.node.getChildByName("img_zs").active = false;
                this.node.getChildByName("img_ld").active = false;
                this.node.getChildByName("lb_rewardNum").getComponent(cc.Label).string = "";
            }
        }
        var sendPack = app.ClubManager().GetUnionSendPackHead();
        app.NetManager().SendPack("union.CUnionGetRankingInfo", sendPack);
    },
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_close") {
            this.CloseForm();
        } else {
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
        //# sourceMappingURL=UIUnionRankTip.js.map
        