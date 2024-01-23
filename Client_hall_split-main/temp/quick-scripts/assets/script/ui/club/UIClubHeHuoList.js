(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIClubHeHuoList.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5b8e7DztypNiaBIjq9pM6mg', 'UIClubHeHuoList', __filename);
// script/ui/club/UIClubHeHuoList.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        hehuoist_scrollView: cc.ScrollView,
        hehuolist_layout: cc.Node,
        hehuolist_demo: cc.Node
    },

    //初始化
    OnCreateInit: function OnCreateInit() {},

    //---------显示函数--------------------

    OnShow: function OnShow(clubId) {
        this.clubId = clubId;
        this.hehuolist_demo.active = false;
        this.ShowHeHuoList();
    },
    ShowHeHuoList: function ShowHeHuoList() {
        var self = this;
        //this.hehuolist_layout.removeAllChildren();
        this.DestroyAllChildren(this.hehuolist_layout);
        app.NetManager().SendPack('club.CClubPartnerInfoList', { 'clubId': this.clubId }, function (serverPack) {
            for (var i = 0; i < serverPack.length; i++) {
                var node = cc.instantiate(self.hehuolist_demo);
                node.active = true;
                self.hehuolist_layout.addChild(node);
                var data = serverPack[i];
                var heroID = data.player["pid"];
                var headImageUrl = data.player["iconUrl"];
                node.getChildByName('name').getComponent(cc.Label).string = self.ComTool.GetBeiZhuName(heroID, data.player.name);
                node.getChildByName('id').getComponent(cc.Label).string = app.i18n.t("UIMain_PIDText", { "pid": self.ComTool.GetPid(heroID) });
                node.heroID = heroID;
                var WeChatHeadImage = node.getChildByName('head').getComponent("WeChatHeadImage");
                //用户头像创建
                if (heroID && headImageUrl) {
                    app.WeChatManager().InitHeroHeadImage(heroID, headImageUrl);
                }
                WeChatHeadImage.OnLoad();
                WeChatHeadImage.ShowHeroHead(heroID, headImageUrl);
                //显示玩家数
                node.getChildByName('num').getComponent(cc.Label).string = data.number;

                node.getChildByName('btn_hehuo_renming').pid = heroID;
                node.getChildByName('btn_hehuo_xieren').pid = heroID;
                node.getChildByName('btn_hehuo_shanchu').pid = heroID;
                node.getChildByName('btn_hehuo_xiashu').pid = heroID;
                if (data.partner == 0) {
                    node.getChildByName('btn_hehuo_renming').active = true;
                    node.getChildByName('btn_hehuo_xieren').active = false;
                } else if (data.partner == 1) {
                    node.getChildByName('btn_hehuo_renming').active = false;
                    node.getChildByName('btn_hehuo_xieren').active = true;
                }
            }
        }, function (error) {});
    },
    RefreshRenMing: function RefreshRenMing(btnNode) {
        if (btnNode.name == "btn_hehuo_xieren") {
            btnNode.active = false;
            btnNode.parent.getChildByName('btn_hehuo_renming').active = true;
        } else {
            btnNode.active = false;
            btnNode.parent.getChildByName('btn_hehuo_xieren').active = true;
        }
    },
    //---------点击函数---------------------
    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    SetWaitForConfirm: function SetWaitForConfirm(msgID, type) {
        var msgArg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var cbArg = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

        var ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
        ConfirmManager.ShowConfirm(type, msgID, msgArg);
    },
    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {
        if (clickType != "Sure") {
            return;
        }
    },
    //---------点击函数---------------------

    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_close' == btnName) {
            this.CloseForm();
        } else if ('btn_hehuo_xieren' == btnName) {
            app.NetManager().SendPack('club.CClubPartnerCancel', { 'clubId': this.clubId, "pid": btnNode.pid });
            this.RefreshRenMing(btnNode);
        } else if ('btn_hehuo_renming' == btnName) {
            app.NetManager().SendPack('club.CClubPartnerAppoint', { 'clubId': this.clubId, "pid": btnNode.pid });
            this.RefreshRenMing(btnNode);
        } else if ('btn_hehuo_shanchu' == btnName) {
            var self = this;
            app.NetManager().SendPack('club.CClubPartnerDelete', { 'clubId': this.clubId, "pid": btnNode.pid }, function (serverPack) {
                btnNode.parent.destroy();
            }, function (error) {
                self.ShowSysMsg('合伙人玩家数为1才能删除');
            });
        } else if ('btn_hehuo_xiashu' == btnName) {
            app.FormManager().ShowForm('ui/club/UIClubHeHuoXiaShuList', this.clubId, btnNode.pid);
        } else if ('btn_hehuo_add' == btnName) {
            app.FormManager().ShowForm('ui/club/UIClubHeHuoAdd', this.clubId);
        } else if ('btn_hehuo_yeji' == btnName) {
            this.CloseForm();
            app.FormManager().ShowForm('ui/club/UIClubHeHuoYeJiList', this.clubId);
        } else if ('btn_hehuo_shuoming' == btnName) {
            app.FormManager().ShowForm('ui/club/UIClubHeHuoShuoMing');
        } else {
            this.ErrLog("OnClick:%s not find", btnName);
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
        //# sourceMappingURL=UIClubHeHuoList.js.map
        