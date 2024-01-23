(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/UIVideo.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'de6c6mLLXBPcpYxhJ2zNoJK', 'UIVideo', __filename);
// script/ui/UIVideo.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        UIVideo_Child: cc.Prefab,
        UIVideo_Child02: cc.Prefab
    },

    OnCreateInit: function OnCreateInit() {
        this.RoomRecordManager = app.RoomRecordManager();

        this.RoomID = 0;

        this.loopScrollView = this.getComponent("LoopScrollView");
        this.RegEvent("RoomRecordDetail", this.Event_RoomRecordDetail);
        this.RegEvent("RoomAllRecord", this.Event_RoomAllRecord);
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
    Event_RoomAllRecord: function Event_RoomAllRecord(event) {
        this.ShowUIVideoChild();
    },

    Event_RoomRecordDetail: function Event_RoomRecordDetail(event) {
        var roomID = event.detail["roomID"];
        this.ShowRoomRecordDetail(roomID);
    },
    ShowRoomRecordDetail: function ShowRoomRecordDetail(roomID) {
        this.ClearAllChildComponentByName("UIVideo_Child");

        this.SetRoomID(roomID);
        var roomRecordList = this.RoomRecordManager.GetRoomRecordDetail(roomID);
        var RoomRecordKeyList = Object.keys(roomRecordList);
        this.loopScrollView.InitScrollData("UIVideo_Child02", this.UIVideo_Child02, RoomRecordKeyList);
    },
    SetRoomID: function SetRoomID(roomID) {
        this.RoomID = roomID;
    },
    GetRoomID: function GetRoomID() {
        return this.RoomID;
    },
    OnShow: function OnShow() {
        this.RoomRecordManager.RequestRoomAllRecord();
        this.ShowFastCount();
        this.ShowRoomCard();
        this.ShowHero_NameOrID();

        this.ShowUIVideoChild();
    },
    ShowUIVideoChild: function ShowUIVideoChild() {
        this.ClearAllChildComponentByName("UIVideo_Child02");
        var roomAllRecordList = this.RoomRecordManager.GetRoomAllRecord();
        var roomAllRecordKeyList = Object.keys(roomAllRecordList);

        this.loopScrollView.InitScrollData("UIVideo_Child", this.UIVideo_Child, roomAllRecordKeyList);
    },
    ShowFastCount: function ShowFastCount() {
        var fastCard = app.HeroManager().GetHeroProperty("fastCard");
        this.SetWndProperty("UITitle/sp_info/juan/lb_juannum", "text", fastCard);
    },
    ShowRoomCard: function ShowRoomCard() {
        var heroRoomCard = app.HeroManager().GetHeroProperty("roomCard");
        this.SetWndProperty("UITitle/sp_info/fang/lb_fangnum", "text", heroRoomCard);
    },
    ShowHero_NameOrID: function ShowHero_NameOrID() {
        var heroID = app.HeroManager().GetHeroProperty("pid");
        var heroName = app.HeroManager().GetHeroProperty("name");
        this.SetWndProperty("UITitle/sp_info/lb_name", "text", this.ComTool.GetBeiZhuName(heroID, heroName));
        this.SetWndProperty("UITitle/sp_info/lb_id", "text", app.i18n.t("UIMain_PIDText", { "pid": this.ComTool.GetPid(heroID) }));
    },

    //-----------------回调函数------------------

    //---------点击函数---------------------
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_buy") {
            var clientConfig = app.Client.GetClientConfig();
            this.FormManager.ShowForm("UIStore");
        } else if (btnName == "btn_bendi") {
            this.ShowSysMsg("UIVideoChildSeeVideotape");
        } else if (btnName == "btn_taren") {
            this.ShowSysMsg("UIVideoChildSeeVideotape");
        } else if (btnName == "btn_back") {
            var childComponent = this.GetAllChildComponentByName("UIVideo_Child02");
            if (childComponent[0]) {
                this.ShowUIVideoChild();
            } else {
                this.CloseForm();
            }
        } else {
            this.ErrLog("OnClick(%s) not find btnName", btnName);
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
        //# sourceMappingURL=UIVideo.js.map
        