"use strict";
cc._RF.push(module, '33452LU7PxMAKuOnmHZ94F2', 'UIForbidUserList');
// script/ui/club/UIForbidUserList.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        memberlist_scrollView: cc.ScrollView,
        memberlist_layout: cc.Node,
        memberlist_demo: cc.Node
    },

    //初始化
    OnCreateInit: function OnCreateInit() {
        this.WeChatManager = app.WeChatManager();
    },
    //---------显示函数--------------------

    OnShow: function OnShow(clubId, groupingId) {
        var unionId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        this.clubId = clubId;
        this.groupingId = groupingId;
        this.unionId = unionId;
        this.memberlist_demo.active = false;
        if (this.unionId > 0) {
            this.node.getChildByName("btn_addByPid").active = true;
        } else {
            this.node.getChildByName("btn_addByPid").active = true;
        }
        this.GetMemberList();
    },
    GetMemberList: function GetMemberList() {
        var self = this;
        if (this.unionId > 0) {
            app.NetManager().SendPack('union.CUnionGroupingMemberList', { 'unionId': this.unionId, 'clubId': this.clubId, "groupingId": this.groupingId }, function (serverPack) {
                self.player = serverPack;
                self.ShowMemberList();
            }, function (error) {});
        } else {
            app.NetManager().SendPack('club.CClubGroupingMemberList', { 'clubId': this.clubId, "groupingId": this.groupingId }, function (serverPack) {
                self.player = serverPack;
                self.ShowMemberList();
            }, function (error) {});
        }
    },
    ShowMemberList: function ShowMemberList() {
        this.DestroyAllChildren(this.memberlist_layout);
        for (var i = 0; i < this.player.length; i++) {
            var player = this.player[i].player;
            var isBan = this.player[i].isBan;

            var nodePrefab = cc.instantiate(this.memberlist_demo);
            nodePrefab.active = true;
            this.memberlist_layout.addChild(nodePrefab);

            nodePrefab.pid = player.pid;
            nodePrefab.clubId = this.clubId;
            nodePrefab.groupingId = this.groupingId;

            nodePrefab.getChildByName('name').getComponent(cc.Label).string = this.ComTool.GetBeiZhuName(player.pid, player.name);
            nodePrefab.getChildByName('id').getComponent(cc.Label).string = app.i18n.t("UIMain_PIDText", { "pid": this.ComTool.GetPid(player.pid) });
            var WeChatHeadImage = nodePrefab.getChildByName('head').getComponent("WeChatHeadImage");
            //用户头像创建
            var heroID = player["pid"];
            var headImageUrl = player["iconUrl"];
            if (heroID && headImageUrl) {
                this.WeChatManager.InitHeroHeadImage(heroID, headImageUrl);
            }
            WeChatHeadImage.OnLoad();
            WeChatHeadImage.ShowHeroHead(heroID, headImageUrl);
            if (isBan == true || typeof isBan == "undefined") {
                nodePrefab.getChildByName('btn_add').active = false;
                nodePrefab.getChildByName('btn_del').active = true;
            } else {
                nodePrefab.getChildByName('btn_add').active = true;
                nodePrefab.getChildByName('btn_del').active = false;
            }
        }
    },
    //---------点击函数---------------------
    ReShowData: function ReShowData() {
        if (this.FormManager.IsFormShow("ui/club/UIClubForbid")) {
            this.FormManager.GetFormComponentByFormName("ui/club/UIClubForbid").ShowForbid();
        }
        app.Client.OnEvent('OnUnionForbidReShow', null);
    },
    OnClick: function OnClick(btnName, btnNode) {
        var self = this;
        if ('btn_close' == btnName) {
            this.CloseForm();
        } else if ('btn_add' == btnName) {
            if (this.unionId == 0) {
                app.NetManager().SendPack('club.CClubGroupingPidAdd', { 'clubId': btnNode.parent.clubId, "groupingId": btnNode.parent.groupingId, "pid": btnNode.parent.pid }, function (serverPack) {
                    var parent = btnNode.parent;
                    parent.getChildByName('btn_del').active = true;
                    parent.getChildByName('btn_add').active = false;
                    self.ReShowData();
                }, function (error) {});
            }
        } else if ('btn_del' == btnName) {
            if (this.unionId == 0) {
                app.NetManager().SendPack('club.CClubGroupingPidRemove', { 'clubId': btnNode.parent.clubId, "groupingId": btnNode.parent.groupingId, "pid": btnNode.parent.pid }, function (serverPack) {
                    var parent = btnNode.parent;
                    parent.getChildByName('btn_del').active = false;
                    parent.getChildByName('btn_add').active = true;
                    self.ReShowData();
                }, function (error) {});
            } else {
                app.NetManager().SendPack('union.CUnionGroupingPidRemove', { 'unionId': this.unionId, 'clubId': btnNode.parent.clubId, "groupingId": btnNode.parent.groupingId, "pid": btnNode.parent.pid }, function (serverPack) {
                    var parent = btnNode.parent;
                    parent.removeFromParent();
                    parent.destroy();
                    self.ReShowData();
                }, function (error) {});
            }
        } else if ('btn_addByPid' == btnName) {
            app.FormManager().ShowForm('ui/club/UIForbidAddUser', this.unionId, this.clubId, this.groupingId);
        } else {
            this.ErrLog("OnClick:%s not find", btnName);
        }
    }
});

cc._RF.pop();