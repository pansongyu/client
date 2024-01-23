(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club_2/unionChild_2/btn_RaceManageZhongzhiNode.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '065f8SXI8BES6QacFL7cwBm', 'btn_RaceManageZhongzhiNode', __filename);
// script/ui/club_2/unionChild_2/btn_RaceManageZhongzhiNode.js

"use strict";

var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {},
    onLoad: function onLoad() {},
    InitData: function InitData(clubId, unionId, unionPostType, myisminister, unionName, unionSign, levelPromotion) {
        this.clubId = clubId;
        this.unionId = unionId;
        this.unionPostType = unionPostType;
        this.myisminister = myisminister;
        this.unionName = unionName;
        this.unionSign = unionSign;
        this.levelPromotion = levelPromotion;
        if (this.unionPostType == app.ClubManager().UNION_GENERAL && this.levelPromotion > 0) {
            //普通成员
            this.node.getChildByName("topToggleContainer").getChildByName("toggle2").active = false;
            this.node.getChildByName("topToggleContainer").getChildByName("toggle3").active = false;
        } else {
            this.node.getChildByName("topToggleContainer").getChildByName("toggle2").active = true;
            this.node.getChildByName("topToggleContainer").getChildByName("toggle3").active = true;
        }
        var defaultToggle = this.node.getChildByName("topToggleContainer").getChildByName("toggle1");
        this.node.getChildByName("topToggleContainer").getChildByName("toggle2").getComponent(cc.Toggle).isChecked = true;
        defaultToggle.getComponent(cc.Toggle).isChecked = true; //先关闭再打开才能出发事件
    },
    //控件点击回调
    OnClick_BtnWnd: function OnClick_BtnWnd(eventTouch, eventData) {
        try {
            app.SoundManager().PlaySound("BtnClick");
            var btnNode = eventTouch.currentTarget;
            var btnName = btnNode.name;
            this.OnClick(btnName, btnNode);
        } catch (error) {
            console.log("OnClick_BtnWnd:" + error.stack);
        }
    },
    OnClick: function OnClick(btnName, btnNode) {},
    OnClickToggle_1: function OnClickToggle_1(target) {
        if (this.unionPostType == app.ClubManager().UNION_GENERAL && this.levelPromotion > 0) {
            //普通成员
            this.node.getChildByName("zhanduiNode").active = false;
            this.node.getChildByName("zhanduiDetailNode").active = true;
            var sendPack = {};
            sendPack.clubId = this.clubId;
            var sendPackName = "club.CClubGetZhongZhiLevel";
            var self = this;
            app.NetManager().SendPack(sendPackName, sendPack, function (serverPack) {
                self.node.getChildByName("zhanduiDetailNode").getComponent("zhanduiDetailNode").InitData(self.clubId, self.unionId, app.HeroManager().GetHeroProperty("pid"), serverPack.levelZhongZhi, self.levelPromotion, self.unionPostType);
            }, function () {});
        } else {
            this.node.getChildByName("zhanduiNode").active = true;
            this.node.getChildByName("zhanduiDetailNode").active = false;
        }
        this.node.getChildByName("memberExamineNode").active = false;
        this.node.getChildByName("changeAliveNode").active = false;
        this.node.getChildByName("zhanduiNode").getComponent("zhanduiNode").InitData(this.clubId, this.unionId, this.unionPostType, this.levelPromotion);
    },
    OnClickToggle_2: function OnClickToggle_2(target) {
        this.node.getChildByName("zhanduiNode").active = false;
        this.node.getChildByName("zhanduiDetailNode").active = false;
        this.node.getChildByName("memberExamineNode").active = false;
        this.node.getChildByName("changeAliveNode").active = true;
        this.node.getChildByName("changeAliveNode").getComponent("changeAliveNode").InitData(this.clubId, this.unionId, this.unionPostType, this.myisminister, this.unionName, this.unionSign);
    },
    OnClickToggle_3: function OnClickToggle_3(target) {
        this.node.getChildByName("zhanduiNode").active = false;
        this.node.getChildByName("zhanduiDetailNode").active = false;
        this.node.getChildByName("changeAliveNode").active = false;
        this.node.getChildByName("memberExamineNode").active = true;
        this.node.getChildByName("memberExamineNode").getComponent("memberExamineNode").InitData(this.clubId, this.unionId, this.unionPostType, this.myisminister, this.unionName, this.unionSign);
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
        //# sourceMappingURL=btn_RaceManageZhongzhiNode.js.map
        