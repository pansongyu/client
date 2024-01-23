(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club_2/UIUnionManager_2.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a6381lVYkRAurfzUu1SsYtb', 'UIUnionManager_2', __filename);
// script/ui/club_2/UIUnionManager_2.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("UIUnionManager"),

    properties: {},

    UpdateLeftBtn: function UpdateLeftBtn() {
        var btn_Setting = this.node.getChildByName("left").getChildByName("btn_Setting");
        var btn_Data = this.node.getChildByName("left").getChildByName("btn_Data");
        var btn_Member = this.node.getChildByName("left").getChildByName("btn_Member");
        var btn_Wanfa = this.node.getChildByName("left").getChildByName("btn_Wanfa");
        var btn_Message = this.node.getChildByName("left").getChildByName("btn_Message");
        var btn_MemberCheck = this.node.getChildByName("left").getChildByName("btn_MemberCheck");
        var btn_RaceRank = this.node.getChildByName("left").getChildByName("btn_RaceRank");
        var btn_ForbidTable = this.node.getChildByName("left").getChildByName("btn_ForbidTable");
        var btn_RaceRankZhongzhi = this.node.getChildByName("left").getChildByName("btn_RaceRankZhongzhi");
        btn_RaceRankZhongzhi.active = false; //仅盟主有
        var btn_Management = this.node.getChildByName("left").getChildByName("btn_Management");
        var btn_ForbidGame = this.node.getChildByName("left").getChildByName("btn_ForbidGame");
        var btn_SetSkinType = this.node.getChildByName("left").getChildByName("btn_SetSkinType");
        if (this.myisminister == app.ClubManager().Club_MINISTER_MGRSS) {
            //赛事管理
            btn_Setting.active = true;
            btn_Data.active = true;
            btn_Member.active = true;
            btn_Wanfa.active = true;
            btn_Message.active = true;
            btn_MemberCheck.active = true;
            btn_ForbidTable.active = true;
            btn_Management.active = true;
            btn_ForbidGame.active = true;
            btn_SetSkinType.active = true;
        } else if (this.unionPostType == app.ClubManager().UNION_GENERAL) {
            //普通成员
            btn_Setting.active = false;
            btn_Data.active = false;
            btn_Member.active = false;
            btn_Wanfa.active = true;
            btn_Message.active = false;
            if (this.myisminister != app.ClubManager().Club_MINISTER_GENERAL) {
                btn_MemberCheck.active = true;
            } else {
                btn_MemberCheck.active = false;
            }
            btn_ForbidTable.active = false;
            btn_Management.active = false;
            btn_ForbidGame.active = false;
            btn_SetSkinType.active = false;
        } else if (this.unionPostType == app.ClubManager().UNION_CLUB) {
            //亲友圈创建者
            btn_Setting.active = true;
            btn_Data.active = false;
            btn_Member.active = false;
            btn_Wanfa.active = true;
            btn_Message.active = true;
            btn_MemberCheck.active = true;
            btn_ForbidTable.active = false;
            btn_Management.active = false;
            btn_ForbidGame.active = false;
            btn_SetSkinType.active = false;
        } else if (this.unionPostType == app.ClubManager().UNION_MANAGE) {
            //赛事管理
            btn_Setting.active = true;
            btn_Data.active = true;
            btn_Member.active = true;
            btn_Wanfa.active = true;
            btn_Message.active = true;
            btn_MemberCheck.active = true;
            btn_ForbidTable.active = true;
            btn_Management.active = true;
            btn_ForbidGame.active = true;
            btn_SetSkinType.active = true;
        } else if (this.unionPostType == app.ClubManager().UNION_CREATE) {
            //赛事创建者
            btn_Setting.active = true;
            btn_Data.active = true;
            btn_Member.active = true;
            btn_Wanfa.active = true;
            btn_Message.active = true;
            btn_MemberCheck.active = true;
            btn_ForbidTable.active = true;
            btn_Management.active = true;
            btn_ForbidGame.active = true;
            btn_SetSkinType.active = true;
            btn_RaceRankZhongzhi.active = true;
        }
        //赛事数据暂时放后台统计
        btn_Data.active = false;
        btn_RaceRank.active = false;
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
        //# sourceMappingURL=UIUnionManager_2.js.map
        