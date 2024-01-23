(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/common/ResManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ffa4dk/KFROQoBaYhVe6GOi', 'ResManager', __filename);
// script/common/ResManager.js

"use strict";

/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDM Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package SSSRoom.js
 *  @todo: 十三支房间
 *
 *  @version 1.0
 *
 *  修改时间 修改人 修改内容
 *  -------------------------------------------------------------------------------
 *
 */
var app = require("app");

/**
 * 类构造
 */
var zass_ResManager = app.BaseClass.extend({

    /**
     * 初始化
     */
    Init: function Init() {
        this.JS_Name = "ResManager";
    },
    //-----------------------回调函数-----------------------------
    //预加载
    PreSetMJSpriteFrame: function PreSetMJSpriteFrame(filePath, cardId) {
        if (app['sspCard_' + cardId]) {
            return;
        }
        var fileName = filePath + cardId;
        var that = this;
        app.ControlManager().CreateLoadPromise(fileName, cc.SpriteFrame).then(function (spriteFrame) {
            app['sspCard_' + cardId] = spriteFrame;
        }).catch(function (error) {
            that.ErrLog("OpenPoker(%s) error:%s", cardId, error.stack);
        });
    },
    //设置精灵贴图
    SetMJSpriteFrameToNode: function SetMJSpriteFrameToNode(filePath, cardId, node) {
        var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function (argList) {};

        if (app['sspCard_' + cardId]) {
            if (node != null) {
                node.getComponent(cc.Sprite).spriteFrame = app['sspCard_' + cardId];
            }
            callback(app['sspCard_' + cardId]);
            return;
        }
        var fileName = filePath + cardId;
        var that = this;
        app.ControlManager().CreateLoadPromise(fileName, cc.SpriteFrame).then(function (spriteFrame) {
            app['sspCard_' + cardId] = spriteFrame;
            if (node != null) {
                node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            }
            callback(spriteFrame);
        }).catch(function (error) {
            that.ErrLog("OpenPoker(%s) error:%s", cardId, error.stack);
        });
    }
});

var g_zass_ResManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
    if (!g_zass_ResManager) g_zass_ResManager = new zass_ResManager();
    return g_zass_ResManager;
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
        //# sourceMappingURL=ResManager.js.map
        