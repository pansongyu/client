(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIClubHeHuoZhanJiList.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '280c3Rgqb5HjK1aVfJ1YP35', 'UIClubHeHuoZhanJiList', __filename);
// script/ui/club/UIClubHeHuoZhanJiList.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        hehuozhanjilist_scrollView: cc.ScrollView,
        hehuozhanjilist_layout: cc.Node,
        hehuozhanjilist_demo: cc.Node,

        btn_zhanji_today: cc.Node,
        btn_zhanji_yesterday: cc.Node,
        btn_zhanji_santian: cc.Node,
        btn_zhanji_sanshitian: cc.Node,
        btn_zhanji_more: cc.Node,

        jiantouSprite: [cc.SpriteFrame]
    },

    //初始化
    OnCreateInit: function OnCreateInit() {},

    //---------显示函数--------------------

    OnShow: function OnShow(clubId, heroID) {
        var hehuozhanjiType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        this.clubId = clubId;
        this.hehuozhanji_page = 1;
        this.hehuozhanji_type = hehuozhanjiType;
        this.hehuozhanji_heroID = heroID;
        this.hehuozhanjilist_demo.active = false;
        this.btn_zhanji_today.active = false;
        this.btn_zhanji_yesterday.active = false;
        this.btn_zhanji_santian.active = false;
        this.btn_zhanji_sanshitian.active = false;
        this.ShowHeHuoZhanJiList();
    },
    ShowBtn: function ShowBtn() {
        this.btn_zhanji_today.active = false;
        this.btn_zhanji_yesterday.active = false;
        this.btn_zhanji_santian.active = false;
        this.btn_zhanji_sanshitian.active = false;
        var btnLable = this.btn_zhanji_more.getChildByName("label").getComponent(cc.Label);
        if (this.hehuozhanji_type == 0) {
            btnLable.string = "今  天";
        } else if (this.hehuozhanji_type == 1) {
            btnLable.string = "昨  天";
        } else if (this.hehuozhanji_type == 2) {
            btnLable.string = "近三天";
        } else if (this.hehuozhanji_type == 3) {
            btnLable.string = "近三十天";
        }
    },
    ShowHeHuoZhanJiList: function ShowHeHuoZhanJiList() {
        var isneedRemove = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        var self = this;
        this.ShowBtn();
        app.NetManager().SendPack('club.CClubPartnerAloneCount', { 'clubId': this.clubId, "getType": this.hehuozhanji_type, "partnerPid": this.hehuozhanji_heroID }, function (serverPack) {
            var zhanjiBottom = self.node.getChildByName('bottom');

            zhanjiBottom.getChildByName('lb_renshu').getComponent(cc.Label).string = "总人数" + serverPack.sumPartner + "/" + serverPack.sumPlayer;
            zhanjiBottom.getChildByName('lb_yingjia').getComponent(cc.Label).string = "大赢家：" + serverPack.winnerPartner + "/" + serverPack.sumWinner + "(" + self.BaiFenBi(serverPack.winnerPartner, serverPack.sumWinner) + ")";
            zhanjiBottom.getChildByName('lb_jushu').getComponent(cc.Label).string = "总参与局数：" + serverPack.setPartner + "/" + serverPack.sumSet + "(" + self.BaiFenBi(serverPack.setPartner, serverPack.sumSet) + ")";
        }, function (error) {});
        if (isneedRemove) {
            //this.hehuozhanjilist_layout.removeAllChildren(); 
            this.DestroyAllChildren(this.hehuozhanjilist_layout);
        }

        app.NetManager().SendPack('club.CClubPartnerAloneRecord', { 'clubId': this.clubId, "getType": this.hehuozhanji_type, "partnerPid": this.hehuozhanji_heroID, "pageNum": this.hehuozhanji_page }, function (serverPack) {
            //self.hehuozhanjilist_layout.removeAllChildren(); 
            self.DestroyAllChildren(self.hehuozhanjilist_layout);
            self.node.getChildByName('bottom').getChildByName('page').getChildByName('lb').getComponent(cc.Label).string = self.hehuozhanji_page;
            for (var i = 0; i < serverPack.length; i++) {
                var node = cc.instantiate(self.hehuozhanjilist_demo);
                node.active = true;
                self.hehuozhanjilist_layout.addChild(node);

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
                //参与局数
                node.getChildByName('lb_canyu').getComponent(cc.Label).string = data.sumSet;
                //参与局数
                node.getChildByName('lb_yingjia').getComponent(cc.Label).string = data.sumWinner;
                node.getChildByName('btn_hehuo_zhanji').heroID = heroID;
                node.getChildByName('btn_hehuo_zhanji').Userdata = data;
            }
        }, function (error) {});
    },
    BaiFenBi: function BaiFenBi(have, all) {
        if (have > 0) {
            return Math.floor(have * 100 / all) + "%";
        }
        return '暂无';
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
        } else if ('btn_zhanji_today' == btnName) {
            this.hehuozhanji_page = 1;
            this.hehuozhanji_type = 0;
            this.ShowHeHuoZhanJiList();
        } else if ('btn_zhanji_yesterday' == btnName) {
            this.hehuozhanji_page = 1;
            this.hehuozhanji_type = 1;
            this.ShowHeHuoZhanJiList();
        } else if ('btn_zhanji_santian' == btnName) {
            this.hehuozhanji_page = 1;
            this.hehuozhanji_type = 2;
            this.ShowHeHuoZhanJiList();
        } else if ('btn_zhanji_sanshitian' == btnName) {
            this.hehuozhanji_page = 1;
            this.hehuozhanji_type = 3;
            this.ShowHeHuoZhanJiList();
        } else if ('btn_zhanji_more' == btnName) {
            this.btn_zhanji_today.active = !this.btn_zhanji_today.active;
            this.btn_zhanji_yesterday.active = !this.btn_zhanji_yesterday.active;
            this.btn_zhanji_santian.active = !this.btn_zhanji_santian.active;
            this.btn_zhanji_sanshitian.active = !this.btn_zhanji_sanshitian.active;
            var img_jiantou = this.btn_zhanji_more.getChildByName("img_jiantou").getComponent(cc.Sprite);
            if (this.btn_zhanji_today.active) {
                img_jiantou.spriteFrame = this.jiantouSprite[1];
            } else {
                img_jiantou.spriteFrame = this.jiantouSprite[0];
            }
        } else if ('btn_zhanji_last' == btnName) {
            if (this.hehuozhanji_page > 1) {
                this.hehuozhanji_page = this.hehuozhanji_page - 1;
                this.ShowHeHuoZhanJiList(false);
            }
        } else if ('btn_zhanji_next' == btnName) {
            this.hehuozhanji_page = this.hehuozhanji_page + 1;
            this.ShowHeHuoZhanJiList(false);
        } else if (btnName == "btn_hehuo_yaoqing") {
            this.FormManager.ShowForm("ui/club/UIYaoQing", this.clubId, this.hehuozhanji_heroID);
        } else if (btnName == "btn_hehuo_xiashu") {
            app.FormManager().ShowForm('ui/club/UIClubHeHuoXiaShuList', this.clubId, this.hehuozhanji_heroID);
        } else if ('btn_hehuo_zhanji' == btnName) {
            //显示玩家具体战绩
            var self = this;
            app.NetManager().SendPack('club.CClubPartnerPersonalCount', { 'clubId': this.clubId, "getType": this.hehuozhanji_type, "partnerPid": this.hehuozhanji_heroID, "pid": btnNode.Userdata.player["pid"] }, function (serverPack) {
                self.FormManager.ShowForm('ui/club/UIClubHeHuoRecordUser', self.clubId, serverPack, self.hehuozhanji_heroID, self.hehuozhanji_type);
            }, function (error) {});
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
        //# sourceMappingURL=UIClubHeHuoZhanJiList.js.map
        