(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/UIBangDingTuiGuang.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6ac7dZV1cRI9pR1hdTnoVgF', 'UIBangDingTuiGuang', __filename);
// script/ui/UIBangDingTuiGuang.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        editbox_ID: cc.EditBox,
        tip: cc.Label,
        btn_bangding: cc.Node
    },

    OnCreateInit: function OnCreateInit() {
        this.ComTool = app.ComTool();
        this.FormManager = app.FormManager();
        this.NetManager = app.NetManager();
        //       this.NetManager.RegNetPack("game.CPlayerReceiveShare", this.OnPack_ReceiveShare, this);
        this.HeroManager = app.HeroManager();
        this.heroID = app.HeroManager().GetHeroProperty("pid");
    },

    OnShow: function OnShow() {
        this.NetManager.SendPack('family.PlayerBindingFamily', { pidStr: '', familyEnum: 1 }, this.OnPack_ShowBangDing.bind(this), this.OnPack_ShowBangDingFail.bind(this));
    },
    OnPack_ShowBangDing: function OnPack_ShowBangDing(serverPack) {
        this.tip.node.active = true;
        this.node.getChildByName('bg').getChildByName('label').active = false;
        this.node.getChildByName('bg').getChildByName('zuanshi').active = false;
        this.tip.string = '您已经成功绑定';
        this.tip.node.getChildByName("tip1").getComponent(cc.Label).string = "代理号是：" + serverPack.playerBindingFamily.familyId;
        this.tip.node.getChildByName("tip2").getComponent(cc.Label).string = "代理昵称是：" + serverPack.playerBindingFamily.familyName;
        this.editbox_ID.node.active = false;
        this.btn_bangding.active = false;

        var familyId = serverPack.playerBindingFamily.familyId;
        if (familyId) {
            app.PlayerFamilyManager().SetPlayerFamilyProperty('familyID', familyId);
        }
    },
    OnPack_ShowBangDingFail: function OnPack_ShowBangDingFail(serverPack) {
        this.tip.node.active = false;
        this.editbox_ID.node.active = true;
        this.btn_bangding.active = true;
    },
    CheckBangDing: function CheckBangDing() {
        var bangdingID = this.editbox_ID.string;
        if (bangdingID < 10000) {
            return;
        }
        //请求服务器查看绑定信息
        this.NetManager.SendPack('family.PlayerBindingFamily', { pidStr: bangdingID, familyEnum: 3 }, this.OnPack_PlayerBindingFamily.bind(this), this.OnPack_PlayerBindingFamilyFail.bind(this));
    },

    OnPack_PlayerBindingFamily: function OnPack_PlayerBindingFamily(serverPack) {
        app.SysNotifyManager().ShowSysMsg('MSG_BangDing_Success');
        this.OnPack_ShowBangDing(serverPack);
    },

    OnPack_PlayerBindingFamilyFail: function OnPack_PlayerBindingFamilyFail(serverPack) {
        var bangdingID = this.editbox_ID.string;
        app.SysNotifyManager().ShowSysMsg('MSG_BangDing_Error1', [bangdingID]);
    },
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_close") {
            this.CloseForm();
        } else if (btnName == 'btn_bangding') {
            this.CheckBangDing();
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
        //# sourceMappingURL=UIBangDingTuiGuang.js.map
        