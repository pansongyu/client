"use strict";
cc._RF.push(module, '30cd6o68QRH9oGKGxFAmwcd', 'UIClubPromoterAdd');
// script/ui/club/UIClubPromoterAdd.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        editbox: cc.EditBox
    },

    OnCreateInit: function OnCreateInit() {
        this.WeChatManager = app.WeChatManager();
        this.NetManager = app.NetManager();
    },
    //--------------显示函数-----------------
    OnShow: function OnShow(clubId) {
        this.clubId = clubId;
        this.node.getChildByName('user').active = false;
        this.node.getChildByName('btn_hehuo_add').active = false;
        this.node.getChildByName('btn_hehuo_yaoqing').active = false;
    },
    ShowUser: function ShowUser(data) {
        var usernode = this.node.getChildByName('user');
        usernode.active = true;
        var heroID = data.player["pid"];
        usernode.heroID = heroID;
        var headImageUrl = data.player["iconUrl"];
        usernode.getChildByName('name').getComponent(cc.Label).string = this.ComTool.GetBeiZhuName(heroID, data.player.name);
        usernode.getChildByName('id').getComponent(cc.Label).string = app.i18n.t("UIMain_PIDText", { "pid": this.ComTool.GetPid(heroID) });
        var WeChatHeadImage = usernode.getChildByName('head').getComponent("WeChatHeadImage");
        //用户头像创建
        if (heroID && headImageUrl) {
            this.WeChatManager.InitHeroHeadImage(heroID, headImageUrl);
        }
        WeChatHeadImage.OnLoad();
        WeChatHeadImage.ShowHeroHead(heroID, headImageUrl);

        if (data.sign == true) {
            this.node.getChildByName('btn_hehuo_add').active = true;
            this.node.getChildByName('btn_hehuo_yaoqing').active = false;
        } else {
            this.node.getChildByName('btn_hehuo_add').active = false;
            this.node.getChildByName('btn_hehuo_yaoqing').active = true;
        }
    },
    click_btn_search: function click_btn_search() {
        var shuru = this.ComTool.GetBeiZhuID(this.editbox.string);
        if (isNaN(parseInt(shuru)) || !app.ComTool().StrIsNumInt(shuru)) {
            app.SysNotifyManager().ShowSysMsg("请输入纯数字的玩家id", [], 3);
            return;
        }
        var self = this;
        app.NetManager().SendPack('club.CClubPromotionPidInfo', { 'clubId': this.clubId, "pid": shuru }, function (serverPack) {
            self.ShowUser(serverPack);
        }, function (error) {});
    },
    click_btn_add: function click_btn_add() {
        var sendPack = {
            "clubId": this.clubId,
            "pid": this.node.getChildByName('user').heroID
        };
        var that = this;
        this.NetManager.SendPack("club.CClubPromotionPidAdd", sendPack, function (success) {
            that.FormManager.GetFormComponentByFormName("ui/club/UIPromoterManager").ClickLeftBtn("btn_PromoterList");
            that.ShowSysMsg("操作成功");
        }, function (error) {
            that.ShowSysMsg("已邀请或未找到该玩家或同赛事不同亲友圈不能重复拉人或距离退出该亲友圈不到10分钟");
        });
    },
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_close' == btnName) {
            this.CloseForm();
        } else if ('btn_search' == btnName) {
            this.click_btn_search();
        } else if ('btn_hehuo_yaoqing' == btnName) {
            this.click_btn_add();
            //this.click_btn_yaoqing();
        } else if ('btn_hehuo_add' == btnName) {
            this.click_btn_add();
        }
    },

    OnClose: function OnClose() {}
});

cc._RF.pop();