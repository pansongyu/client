(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club_2/UIUserSetPL_2.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a2c432NSeVCmr1P+T52pYFE', 'UIUserSetPL_2', __filename);
// script/ui/club_2/UIUserSetPL_2.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("UIUserSetPL"),
    properties: {},
    OnShow: function OnShow(data) {
        var isUnion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var isPromoter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        this.data = data;
        this.isUnion = isUnion;
        this.isPromoter = isPromoter;
        var lb_TargetPL = this.node.getChildByName("lb_TargetPL").getComponent(cc.RichText);
        lb_TargetPL.string = "<color=#705d52>因裁判重置</c><color=#f8772c>" + this.ComTool.GetBeiZhuName(data.pid, data.name, 9) + "（ID:" + data.pid + "）" + "</color><color=#705d52>的比赛分</c>";
        var lb_curPL = this.node.getChildByName("lb_curPL").getComponent(cc.Label);
        lb_curPL.string = "该玩家当前拥有比赛分：" + data.targetPL;
        this.tuisaiPoint = data.targetPL;
    },
    OnClick: function OnClick(btnName, btnNode) {

        if (btnName == "btn_tuisai") {
            var sendPack = {};
            var packName = "";
            if (this.isUnion && !this.isPromoter) {
                sendPack = app.ClubManager().GetUnionSendPackHead();
                sendPack.opClubId = this.data.opClubId;
                packName = "union.CUnionSportsPointUpdate";
            } else if (!this.isUnion && this.isPromoter) {
                sendPack.clubId = this.data.targetClubId;
                packName = "club.CClubSubordinateLevelSportsPointUpdate";
            } else {
                sendPack.clubId = app.ClubManager().GetUnionSendPackHead().clubId;
                packName = "club.CClubSportsPointUpdate";
            }
            sendPack.opPid = this.data.pid;
            if (this.tuisaiPoint > 0) {
                sendPack.type = 1;
            } else {
                sendPack.type = 0;
            }
            sendPack.value = Math.abs(this.tuisaiPoint);
            this.SendPointPack(packName, sendPack);
        } else if (btnName == "btn_close") {
            this.CloseForm();
        } else if (btnName == "btn_help") {
            this.node.getChildByName("helpNode").active = !this.node.getChildByName("helpNode").active;
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
        //# sourceMappingURL=UIUserSetPL_2.js.map
        