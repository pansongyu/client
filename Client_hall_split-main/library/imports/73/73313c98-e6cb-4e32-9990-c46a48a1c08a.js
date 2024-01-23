"use strict";
cc._RF.push(module, '73313yY5stOMpmQxGpIocCK', 'UIForbidGameAddUser');
// script/ui/club/UIForbidGameAddUser.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        EditBoxID: cc.EditBox,
        btn_add: cc.Node
    },

    OnCreateInit: function OnCreateInit() {
        this.WeChatManager = app.WeChatManager();
        this.NetManager = app.NetManager();
    },

    OnShow: function OnShow(unionId, clubId) {
        this.unionId = unionId;
        this.clubId = clubId;
        this.EditBoxID.string = '';
        this.btn_add.active = false;
        this.node.getChildByName('user').active = false;
    },
    ShowUser: function ShowUser(player) {
        var usernode = this.node.getChildByName('user');
        usernode.active = true;
        var heroID = player["pid"];
        usernode.heroID = heroID;
        var headImageUrl = player["iconUrl"];
        usernode.getChildByName('name').getComponent(cc.Label).string = this.ComTool.GetBeiZhuName(heroID, player.name);
        usernode.getChildByName('id').getComponent(cc.Label).string = app.i18n.t("UIMain_PIDText", { "pid": this.ComTool.GetPid(heroID) });
        var WeChatHeadImage = usernode.getChildByName('head').getComponent("WeChatHeadImage");
        //用户头像创建
        if (heroID && headImageUrl) {
            this.WeChatManager.InitHeroHeadImage(heroID, headImageUrl);
        }
        WeChatHeadImage.OnLoad();
        WeChatHeadImage.ShowHeroHead(heroID, headImageUrl);
        this.btn_add.active = true;
    },
    click_btn_search: function click_btn_search() {
        var shuru = this.ComTool.GetBeiZhuID(this.EditBoxID.string);
        if (isNaN(parseInt(shuru)) || !app.ComTool().StrIsNum(shuru)) {
            app.SysNotifyManager().ShowSysMsg("请输入纯数字的玩家id", [], 3);
            return;
        }
        var self = this;
        app.NetManager().SendPack('union.CUnionFindPidInfo', { "pid": shuru }, function (serverPack) {
            self.ShowUser(serverPack.player);
        }, function (error) {});
    },
    Click_btn_add: function Click_btn_add() {
        if (this.EditBoxID.string == '') {
            return;
        }
        var that = this;
        var sendPack = {
            "unionId": this.unionId,
            "clubId": this.clubId,
            "pid": this.EditBoxID.string
        };
        sendPack.unionId = this.unionId;
        this.NetManager.SendPack("union.CUnionBanGamePlayerAdd", sendPack, function (success) {
            that.btn_add.active = false;
            that.ShowSysMsg("添加成功");
            app.Client.OnEvent('OnUnionForbidGameReShow', null);
        }, function (error) {});
    },
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_add") {
            this.Click_btn_add();
        } else if (btnName == "btn_search") {
            this.click_btn_search();
        } else if (btnName == "btn_close") {
            this.CloseForm();
        } else {
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    }

});

cc._RF.pop();