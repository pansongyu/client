(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/scene/SceneClub.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a9e02zUR0FGLIFhHPcY6dir', 'SceneClub', __filename);
// script/scene/SceneClub.js

"use strict";

/*
    打牌场景
*/

var app = require("app");

cc.Class({
    extends: require("BaseScene"),

    properties: {},

    //------回掉函数-------------------
    OnCreate: function OnCreate() {
        this.lastShowTime = 0;
        this.lastHideTime = 0;
        this.FormManager = app.FormManager();
        this.ClubManager = app.ClubManager();
    },

    //进入场景
    OnSwithSceneEnd: function OnSwithSceneEnd() {},
    //显示动态设置的默认界面
    OnShowDefaultForm: function OnShowDefaultForm() {
        this.FormManager.ShowForm("ui/club/UIClub");
        //this.FormManager.ShowForm("ui/club/UIClubCreateRoom");
        var formNameList = this.FormManager.GetDefaultFormNameList();
        var count = formNameList.length;
        if (count) {
            for (var index = 0; index < count; index++) {
                this.FormManager.ShowForm(formNameList[index]);
            }
            this.FormManager.ClearDefaultFormNameList();
        }
    },
    OnEventShow: function OnEventShow(bReConnect) {
        var curTime = new Date().getTime();
        if (curTime > this.lastShowTime + 1000) {
            //后台切回来有可能调用两次BUG
            this.lastShowTime = curTime;
            app.Client.OnEvent('OnEventShow', { 'bReConnect': bReConnect });
        }
    },
    OnEventHide: function OnEventHide() {
        var curTime = new Date().getTime();
        if (curTime > this.lastHideTime + 1000) {
            //后台切回来有可能调用两次BUG
            this.lastHideTime = curTime;
            app.Client.OnEvent('OnEventHide', {});
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
        //# sourceMappingURL=SceneClub.js.map
        