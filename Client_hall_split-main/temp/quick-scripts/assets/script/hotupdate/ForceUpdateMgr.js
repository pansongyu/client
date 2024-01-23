(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/hotupdate/ForceUpdateMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fbf9ez4zwFNp6Wh14boj99A', 'ForceUpdateMgr', __filename);
// script/hotupdate/ForceUpdateMgr.js

'use strict';

//强制更新
var app = require('app');
var ForceUpdateMgr = app.BaseClass.extend({
    // use this for initialization
    Init: function Init() {
        this.CONFIRM_SHOW_TIME = 5;
        this.ShareDefine = app.ShareDefine();
        console.log('ForceUpdateMgr Init');
    },

    //获取本地版本
    Check: function Check() {
        if (cc.sys.isNative) {
            app.HotUpdateMgr().Init();
            app.HotUpdateMgr().CheckUpdate();
        }
    },

    Update: function Update() {
        console.log("发现新版本，强制重启更新");
        // cc.audioEngine.stopAll();
        // cc.game.restart();
        // cc.game.end();
        var msgID = "MSG_FORCE_UPDATE";
        var ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, []);
        ConfirmManager.ShowConfirm(app.ShareDefine().Confirm, msgID, []);
    },

    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {
        if (clickType != "Sure") {
            return;
        }
        if (msgID == "MSG_FORCE_UPDATE") {
            cc.game.end();
        }
    }

});

var g_ForceUpdateMgr = null;

exports.GetModel = function () {
    if (!g_ForceUpdateMgr) g_ForceUpdateMgr = new ForceUpdateMgr();
    return g_ForceUpdateMgr;
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
        //# sourceMappingURL=ForceUpdateMgr.js.map
        