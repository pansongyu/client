"use strict";
cc._RF.push(module, '5d937BbqmVDhp3gD07Be4ZN', 'UIPlayerInfo');
// script/ui/UIPlayerInfo.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        sp_paipindiLabel: cc.Label,
        sp_haopingdiLabel: cc.Label,
        sp_chapingdiLabel: cc.Label,
        sp_chupaidiLabel: cc.Label,
        sp_zhongtulikaiLabel: cc.Label,
        heroName: cc.Label,
        heroID: cc.Label,
        heroFastCount: cc.Label,
        heroRoomCard: cc.Label
    },

    OnCreateInit: function OnCreateInit() {
        this.PlayerRoomManager = app.PlayerRoomManager();
        this.ComTool = app.ComTool();
        this.RegEvent("InitPlayerRoom", this.Event_InitPlayerRoom);
        this.RegEvent("HeroProperty", this.Event_HeroProperty);
    },
    Event_HeroProperty: function Event_HeroProperty(event) {
        var argDict = event.detail;

        if (argDict["Property"] == "fastCard") {
            this.ShowFastCount();
        } else if (argDict["Property"] == "roomCard") {
            this.ShowRoomCard();
        }
    },
    Event_InitPlayerRoom: function Event_InitPlayerRoom() {
        this.Show_PaiYouKouBei();
        var chuPai = this.Show_KuaiSuChuPai();
        var liKai = this.Show_ZhongTuLiKai();
        var haoPingNumber = this.Show_HaoPing();
        var chaPingNumber = this.Show_ChaPing();
        this.Show_PaiPin(haoPingNumber, chaPingNumber, chuPai, liKai);
    },

    OnShow: function OnShow() {
        this.ShowHero_NameOrID();
        this.ShowFastCount();
        this.ShowRoomCard();

        this.Show_PaiYouKouBei();

        var chuPai = this.Show_KuaiSuChuPai();
        var liKai = this.Show_ZhongTuLiKai();
        var haoPingNumber = this.Show_HaoPing();
        var chaPingNumber = this.Show_ChaPing();

        this.Show_PaiPin(haoPingNumber, chaPingNumber, chuPai, liKai);
    },
    ShowHero_NameOrID: function ShowHero_NameOrID() {

        var heroID = app.HeroManager().GetHeroProperty("pid");
        var heroName = app.HeroManager().GetHeroProperty("name");
        this.heroName.string = this.ComTool.GetBeiZhuName(heroID, heroName, 9);
        this.heroID.string = app.i18n.t("UIMain_PIDText", { "pid": this.ComTool.GetPid(heroID) });
    },
    ShowFastCount: function ShowFastCount() {
        var fastCard = app.HeroManager().GetHeroProperty("fastCard");
        this.heroFastCount.string = fastCard;
    },
    ShowRoomCard: function ShowRoomCard() {

        var heroRoomCard = app.HeroManager().GetHeroProperty("roomCard");
        this.heroRoomCard.string = heroRoomCard;
    },
    Show_PaiYouKouBei: function Show_PaiYouKouBei() {
        var kouBei = this.PlayerRoomManager.GetPlayerRoomProperty("koubeiList");
        for (var i = kouBei.length; i > 0; i--) {
            var kouBeiPath = this.ComTool.StringAddNumSuffix("UIInfo/sp_koubei/nd_koubei/sp_koubei", i, 2);
            var kouBeiStringPath = [kouBeiPath, "lb_num"].join("/");
            var kouBeiString = this.GetWndComponent(kouBeiStringPath, cc.Label);
            kouBeiString.string = kouBei[i - 1];
        }
    },
    Show_PaiPin: function Show_PaiPin(haoPingNumber, chaPingNumber, chuPai, liKai) {
        this.Log(haoPingNumber, chaPingNumber, chuPai, liKai);
        this.sp_paipindiLabel.string = haoPingNumber * 100 - chaPingNumber * 100 + chuPai - liKai * 50;
    },
    Show_HaoPing: function Show_HaoPing() {
        var kouBei = this.PlayerRoomManager.GetPlayerRoomProperty("koubeiList");
        var haoPingNumber = 0;
        for (var i = 0; i < kouBei.length; i++) {
            if (i < 4) {
                haoPingNumber += kouBei[i];
            }
        }
        this.sp_haopingdiLabel.string = haoPingNumber;

        return haoPingNumber;
    },

    Show_ChaPing: function Show_ChaPing() {
        var kouBei = this.PlayerRoomManager.GetPlayerRoomProperty("koubeiList");
        var chaPingNumber = 0;
        for (var i = 4; i < kouBei.length; i++) {
            chaPingNumber += kouBei[i];
        }
        // this.chaPing = this.PlayerRoomManager.GetPlayerRoomProperty("evaBad");
        this.sp_chapingdiLabel.string = chaPingNumber;

        return chaPingNumber;
    },
    Show_KuaiSuChuPai: function Show_KuaiSuChuPai() {
        var chuPai = this.PlayerRoomManager.GetPlayerRoomProperty("fastOut");
        this.sp_chupaidiLabel.string = chuPai;

        return chuPai;
    },
    Show_ZhongTuLiKai: function Show_ZhongTuLiKai() {
        var liKai = this.PlayerRoomManager.GetPlayerRoomProperty("midLeave");
        this.sp_zhongtulikaiLabel.string = liKai;

        return liKai;
    },
    //---------点击函数---------------------
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_buy") {
            var clientConfig = app.Client.GetClientConfig();
            this.FormManager.ShowForm("UIStore");
        } else if (btnName == "btn_back") {
            var that = this;
            this.FormManager.ShowForm("UINewMain").then(function () {
                that.CloseForm();
            }).catch(function (error) {
                that.ErrLog("error:%s", error.stack);
            });
        }
    }

});

cc._RF.pop();