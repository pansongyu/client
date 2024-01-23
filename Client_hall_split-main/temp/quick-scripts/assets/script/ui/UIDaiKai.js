(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/UIDaiKai.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '247b6Y08UBIQaCgoyxNeCpZ', 'UIDaiKai', __filename);
// script/ui/UIDaiKai.js

"use strict";

/*
小傅最新修改 2017-10-13 
 */
var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        UIDaiKai_Child: cc.Prefab,
        Scrollow: cc.Node
    },

    OnCreateInit: function OnCreateInit() {
        this.FormManager = app.FormManager();
        this.ComTool = app.ComTool();
        this.loopScrollView = this.getComponent("LoopScrollView");
        this.NetManager = app.NetManager();
        this.HeroManager = app.HeroManager();
        this.heroID = app.HeroManager().GetHeroProperty("pid");
    },
    OnShow: function OnShow() {
        //获取带开放记录
        this.loopScrollView.InitScrollData("UIDaiKai_Child", this.UIDaiKai_Child, []);
        this.NetManager.SendPack("helproom.CHelpRoomGetList", { type: 1 }, this.OnPack_HelpRoomList.bind(this), this.OnPack_HelpRoomListFail.bind(this));
    },
    OnPack_HelpRoomList: function OnPack_HelpRoomList(serverPack) {
        if (serverPack.hasOwnProperty('helpRoomList')) {
            var helpRoomList = serverPack.helpRoomList;
            app['helpRoomList'] = helpRoomList;
            var everyGameKeys = Object.keys(helpRoomList);
            this.ScrollViewData(everyGameKeys);
            console.log("everyGameKeys :", everyGameKeys);
        } else {
            //this.Scrollow.removeAllChildren();
            this.DestroyAllChildren(this.Scrollow);
            return;
        }
    },
    OnPack_HelpRoomListFail: function OnPack_HelpRoomListFail(serverPack) {
        app['helpRoomList'] = false;
        //this.Scrollow.removeAllChildren();
        this.DestroyAllChildren(this.Scrollow);
        return;
    },
    ScrollViewData: function ScrollViewData(everyGameKeys) {
        this.loopScrollView.InitScrollData("UIDaiKai_Child", this.UIDaiKai_Child, everyGameKeys);
    },
    InitGameBtnList: function InitGameBtnList(serverPack) {
        this.FormManager.ShowForm("UICreatRoom", serverPack, this.gameName);
    },
    OnClose: function OnClose() {
        this.NetManager.SendPack("helproom.CHelpRoomSession", { type: 2 });
        //this.Scrollow.removeAllChildren();
        this.DestroyAllChildren(this.Scrollow);
    },
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_close") {
            this.CloseForm();
        } else if (btnName == "btn_daikaifang") {
            //打开代开放UI
            app.NetManager().SendPack('family.CPlayerGameList', {}, this.InitGameBtnList.bind(this), this.InitGameBtnList.bind(this));
            this.FormManager.CloseForm('UIDaiKai');
        } else if (btnName == 'btn_jilu') {
            //打开代开放记录
            this.FormManager.ShowForm("UIDaiKaiLog");
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
        //# sourceMappingURL=UIDaiKai.js.map
        