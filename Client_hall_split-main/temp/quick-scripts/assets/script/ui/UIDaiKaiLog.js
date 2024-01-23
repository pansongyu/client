(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/UIDaiKaiLog.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '23e44j3h+hHtbQ8Czze70b3', 'UIDaiKaiLog', __filename);
// script/ui/UIDaiKaiLog.js

"use strict";

/*
小傅最新修改 2017-10-13 
 */
var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        UIDaiKaiLog_Child: cc.Prefab,
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
        this.NetManager.SendPack("helproom.CHelpRoomGetList", { type: 2 }, this.OnPack_HelpRoomList.bind(this), this.OnPack_HelpRoomListFail.bind(this));
    },
    OnPack_CPlayerRoomRecord: function OnPack_CPlayerRoomRecord(serverPack) {
        if (serverPack.hasOwnProperty('helpRoomList')) {
            var helpRoomList = serverPack.helpRoomList;
            app['helpRoomList'] = helpRoomList;
            var everyGameKeys = Object.keys(helpRoomList);
            this.ScrollViewData(everyGameKeys);
        } else {
            //this.Scrollow.removeAllChildren();
            this.DestroyAllChildren(this.Scrollow);
            return;
        }
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
        //this.Scrollow.removeAllChildren();
        this.DestroyAllChildren(this.Scrollow);
        return;
    },
    OnPack_CPlayerRoomRecordFail: function OnPack_CPlayerRoomRecordFail(serverPack) {
        //this.Scrollow.removeAllChildren();
        this.DestroyAllChildren(this.Scrollow);
        return;
    },
    ScrollViewData: function ScrollViewData(everyGameKeys) {
        this.loopScrollView.InitScrollData("UIDaiKaiLog_Child", this.UIDaiKaiLog_Child, everyGameKeys);
    },
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_close") {
            this.CloseForm();
        } else if (btnName == 'btn_list') {
            //打开代开放记录
            this.FormManager.ShowForm("UIDaiKai");
            this.FormManager.CloseForm('UIDaiKaiLog');
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
        //# sourceMappingURL=UIDaiKaiLog.js.map
        