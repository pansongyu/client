"use strict";
cc._RF.push(module, '868fcO8e7hEaYjbrZyx84qN', 'UIClubNone');
// script/ui/club/UIClubNone.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        layout: cc.Node,
        demo: cc.Node,

        clubname: cc.EditBox,
        clubfangka: cc.EditBox
    },
    OnCreateInit: function OnCreateInit() {},
    //-----------------显示函数------------------
    OnShow: function OnShow() {},
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_create' == btnName) {
            this.allSelectCityData = app.HeroManager().GetCurSelectCityData();
            var heroRoomCard = app.HeroManager().GetHeroProperty("roomCard");
            var limit = app.Config ? app.Config.clubCreateNum : 100;
            if (heroRoomCard >= limit) {
                app.FormManager().ShowForm('ui/club/UIClubCreate', this.allSelectCityData[0].selcetId);
            } else {
                app.SysNotifyManager().ShowSysMsg('钻石不足' + limit + '，无法创建亲友圈');
            }
        } else if ('btn_join' == btnName) {
            this.FormManager.ShowForm('ui/club/UIJoinClub');
        } else if ('btn_close' == btnName) {
            this.CloseForm();
        }
    }
});

cc._RF.pop();