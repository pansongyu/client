(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/scene/SceneMain.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5ad432YcAZD9b/8KxZxewOT', 'SceneMain', __filename);
// script/scene/SceneMain.js

"use strict";

/*
    主场景
*/

var app = require("app");

cc.Class({
    extends: require("BaseScene"),

    properties: {},

    //------回掉函数-------------------
    OnCreate: function OnCreate() {
        this.FormManager = app.FormManager();
        this.HeroManager = app.HeroManager();
        this.PlayerFamilyManager = app.PlayerFamilyManager();
    },

    //进入场景
    OnSwithSceneEnd: function OnSwithSceneEnd() {},

    //显示动态设置的默认界面
    OnShowDefaultForm: function OnShowDefaultForm() {
        var heroFamilyID = this.GetHeroFamilyID();
        this.FormManager.ShowForm("UINewMain", heroFamilyID);
        var formNameList = this.FormManager.GetDefaultFormNameList();
        var count = formNameList.length;
        for (var index = 0; index < count; index++) {
            console.log('ShowDefaultForm === ' + formNameList[index]);
            this.FormManager.ShowForm(formNameList[index]);
        }
        this.FormManager.ClearDefaultFormNameList();
    },
    GetHeroFamilyID: function GetHeroFamilyID() {
        return this.PlayerFamilyManager.GetPlayerFamilyProperty("familyID");;
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
        //# sourceMappingURL=SceneMain.js.map
        