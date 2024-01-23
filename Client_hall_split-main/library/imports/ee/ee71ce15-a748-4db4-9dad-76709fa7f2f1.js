"use strict";
cc._RF.push(module, 'ee71c4Vp0hNtJ2tdnCfp/Lx', 'UILingJiang');
// script/ui/UILingJiang.js

"use strict";

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        toggle1: cc.Toggle,
        toggle2: cc.Toggle,
        demo_club_name: cc.Node,
        btn_qinyouquan: cc.Node,
        layout: cc.Node,
        mark: cc.Node
    },

    //初始化
    OnCreateInit: function OnCreateInit() {
        this.ShareDefine = app.ShareDefine();
        this.NetManager = app.NetManager();
    },

    //---------显示函数--------------------

    OnShow: function OnShow() {
        this.toggle1.isChecked = true;
        this.btn_qinyouquan.getChildByName('lb_name').getComponent(cc.Label).string = '请选择哪个亲友圈';
        this.btn_qinyouquan.getChildByName('lb_name').clubId = 0;
        this.mark.active = false;
    },

    //---------点击函数---------------------

    OnClick: function OnClick(btnName, btnNode) {
        var clubId = 0;
        if (btnName == "btnSure") {
            if (this.toggle1.isChecked == true) {
                clubId = 0;
            } else {
                clubId = this.btn_qinyouquan.getChildByName('lb_name').clubId;
            }
            var that = this;
            this.NetManager.SendPack("game.CPlayerReceiveShare", { clubId: clubId }, function (success) {
                if (clubId > 0) {
                    app.SysNotifyManager().ShowSysMsg("分享成功获取5张圈卡");
                } else {
                    app.SysNotifyManager().ShowSysMsg("分享成功获取2个钻石");
                }
            }, function (error) {
                app.SysNotifyManager().ShowSysMsg("您今日已经领取过");
            });
            this.CloseForm();
        } else if (btnName == "btn_qinyouquan" || btnName == "btn_xuanze") {
            var clublist = app.ClubManager().GetClubData();
            if (clublist.length > 0) {
                //this.layout.removeAllChildren();
                this.DestroyAllChildren(this.layout);
                this.mark.active = true;
                for (var i = 0; i < clublist.length; i++) {
                    var club = cc.instantiate(this.demo_club_name);
                    club.name = "club_select_" + clublist[i].id;
                    club.clubName = clublist[i].name;
                    club.clubId = clublist[i].id;
                    club.getComponent(cc.Label).string = clublist[i].name;
                    club.active = true;
                    this.layout.addChild(club);
                }
            }
        } else if (btnName.startsWith("club_select_")) {
            this.btn_qinyouquan.getChildByName('lb_name').getComponent(cc.Label).string = btnNode.clubName;
            this.btn_qinyouquan.getChildByName('lb_name').clubId = btnNode.clubId;
            this.mark.active = false;
        } else {
            this.ErrLog("OnClick:%s not find", btnName);
        }
    }

});

cc._RF.pop();