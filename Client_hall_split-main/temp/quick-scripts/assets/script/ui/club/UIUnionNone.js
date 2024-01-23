(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIUnionNone.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3b3c4T0ozVNTrFVL89Rq+1e', 'UIUnionNone', __filename);
// script/ui/club/UIUnionNone.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {},
    OnCreateInit: function OnCreateInit() {},
    //-----------------显示函数------------------
    OnShow: function OnShow(clubId) {
        this.clubId = clubId;
    },
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_create' == btnName) {
            var self = this;
            app.NetManager().SendPack("family.CPlayerCheckFamilyOwner", {}, function (success) {
                if (success.power > 0) {
                    app.FormManager().ShowForm('ui/club/UIUnionCreate', self.clubId);
                } else {
                    app.SysNotifyManager().ShowSysMsg("请联系客服申请创建赛事资格");
                }
            }, function (error) {
                app.SysNotifyManager().ShowSysMsg("赛事未开放");
            });
        } else if ('btn_join' == btnName) {
            app.FormManager().ShowForm('ui/club/UIJoinUnion', this.clubId);
        } else if ('btn_close' == btnName) {
            this.CloseForm();
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
        //# sourceMappingURL=UIUnionNone.js.map
        