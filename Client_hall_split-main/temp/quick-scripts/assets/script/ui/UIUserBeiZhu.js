(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/UIUserBeiZhu.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5d71fLSIJhInaFXKaawIsXk', 'UIUserBeiZhu', __filename);
// script/ui/UIUserBeiZhu.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        sp_head: cc.Sprite,
        label_name: cc.Label,
        label_id: cc.Label,
        editBox: cc.EditBox
    },

    OnCreateInit: function OnCreateInit() {
        this.ComTool = app.ComTool();
    },

    OnShow: function OnShow(clubID, playerInfo) {
        this.clubID = clubID;
        this.label_name.string = playerInfo["name"];
        this.label_id.string = "ID:" + this.ComTool.GetPid(playerInfo["pid"]);
        var WeChatHeadImage = this.sp_head.getComponent("WeChatHeadImage");
        WeChatHeadImage.ShowHeroHead(playerInfo["pid"]);
        this.remarkID = playerInfo["pid"];
        //获取备注名字
        var BeiZhu = this.ComTool.GetBeiZhu();
        var beiZhuName = "";
        for (var i = 0; i < BeiZhu.length; i++) {
            if (BeiZhu[i].id == playerInfo["pid"]) {
                beiZhuName = BeiZhu[i].name;
                break;
            }
        }

        if (beiZhuName) {
            this.editBox.string = beiZhuName;
        } else {
            this.editBox.string = "";
        }
    },

    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_close' == btnName) {
            this.CloseForm();
        } else if ("btn_save") {
            var beiZhuName = this.editBox.string;
            if (beiZhuName == "") {
                app.SysNotifyManager().ShowSysMsg('备注名不能为空');
            }
            var self = this;
            app.NetManager().SendPack("club.CClubChangePlayerRemarkName", { 'clubId': this.clubID, "remarkID": this.remarkID, "remarkName": beiZhuName }, function (success) {
                app.Client.OnEvent('ChangeBeiZhu', { "pid": self.remarkID, "name": beiZhuName });
                self.ComTool.UpdateBeiZhu(self.remarkID, beiZhuName);
            }, function (error) {
                app.SysNotifyManager().ShowSysMsg('备注失败，请稍后重试');
            });
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
        //# sourceMappingURL=UIUserBeiZhu.js.map
        