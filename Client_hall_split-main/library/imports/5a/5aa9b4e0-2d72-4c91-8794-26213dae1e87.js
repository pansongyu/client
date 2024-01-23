"use strict";
cc._RF.push(module, '5aa9bTgLXJMkYeUJiE9rh6H', 'UIForbidAddUser');
// script/ui/club/UIForbidAddUser.js

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

    OnShow: function OnShow(unionId, clubId, groupingId) {
        this.unionId = unionId;
        this.clubId = clubId;
        this.groupingId = groupingId;
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
        if (this.unionId > 0) {
            app.NetManager().SendPack('union.CUnionGroupingPidFind', { 'unionId': this.unionId, 'clubId': this.clubId, "pid": shuru }, function (serverPack) {
                self.ShowUser(serverPack);
            }, function (error) {});
        } else {
            app.NetManager().SendPack('club.CClubGroupingPidFind', { 'clubId': this.clubId, "pid": shuru }, function (serverPack) {
                self.ShowUser(serverPack);
            }, function (error) {});
        }
    },
    Click_btn_add: function Click_btn_add() {
        if (this.EditBoxID.string == '') {
            return;
        }
        var that = this;
        var sendPack = {
            "clubId": this.clubId,
            "groupingId": this.groupingId,
            "pid": this.EditBoxID.string
        };
        if (this.unionId > 0) {
            sendPack.unionId = this.unionId;
            this.NetManager.SendPack("union.CUnionGroupingPidAdd", sendPack, function (success) {
                that.btn_add.active = false;
                that.ShowSysMsg("添加成功");
                app.Client.OnEvent('OnUnionForbidReShow', null);
                if (app.FormManager().IsFormShow("ui/club/UIForbidUserList")) {
                    app.FormManager().GetFormComponentByFormName("ui/club/UIForbidUserList").GetMemberList();
                }
            }, function (error) {});
        } else {
            this.NetManager.SendPack("club.CClubGroupingPidAdd", sendPack, function (success) {
                that.btn_add.active = false;
                that.ShowSysMsg("添加成功");
                if (app.FormManager().IsFormShow("ui/club/UIForbidUserList")) {
                    app.FormManager().GetFormComponentByFormName("ui/club/UIForbidUserList").GetMemberList();
                }
                if (app.FormManager().IsFormShow("ui/club/UIClubForbid")) {
                    app.FormManager().GetFormComponentByFormName("ui/club/UIClubForbid").ShowForbid();
                }
            }, function (error) {});
        }
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