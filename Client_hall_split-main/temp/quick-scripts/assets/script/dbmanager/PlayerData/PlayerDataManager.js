(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/dbmanager/PlayerData/PlayerDataManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '21a9b20BmZITaYlXekc0Uad', 'PlayerDataManager', __filename);
// script/dbmanager/PlayerData/PlayerDataManager.js

"use strict";

/*
    玩家汇总数据管理器
 */
var app = require('app');

var PlayerDataManager = app.BaseClass.extend({

    Init: function Init() {
        this.JS_Name = "PlayerDataManager";
        if (this.SwitchGameData == null) {
            this.SwitchGameData = [];
        }
    },

    SetSwitchGameData: function SetSwitchGameData(data) {
        this.SwitchGameData.push(data);
    },

    GetSwitchGameData: function GetSwitchGameData() {
        return this.SwitchGameData;
    },

    ClearSwitchGameData: function ClearSwitchGameData() {
        this.SwitchGameData = [];
    }
});

var g_PlayerDataManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
    if (!g_PlayerDataManager) {
        g_PlayerDataManager = new PlayerDataManager();
    }
    return g_PlayerDataManager;
};

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
        //# sourceMappingURL=PlayerDataManager.js.map
        