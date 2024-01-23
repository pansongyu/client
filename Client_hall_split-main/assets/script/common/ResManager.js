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
    Init:function(){
        this.JS_Name = "ResManager";
    },
    //-----------------------回调函数-----------------------------
    //预加载
    PreSetMJSpriteFrame:function(filePath,cardId){
        if (app['sspCard_' + cardId]) {
            return;
        }
        let fileName = filePath + cardId;
        let that = this;
        app.ControlManager().CreateLoadPromise(fileName, cc.SpriteFrame).then(function (spriteFrame) {
            app['sspCard_' + cardId] = spriteFrame;
        }).catch(function (error) {
            that.ErrLog("OpenPoker(%s) error:%s", cardId, error.stack);
        })
    },
    //设置精灵贴图
    SetMJSpriteFrameToNode:function(filePath,cardId, node, callback = function(argList){}){
        if (app['sspCard_' + cardId]) {
            if(node != null){
                node.getComponent(cc.Sprite).spriteFrame = app['sspCard_' + cardId];
            }
            callback(app['sspCard_' + cardId]);
            return
        }
        let fileName = filePath + cardId;
        let that = this;
        app.ControlManager().CreateLoadPromise(fileName, cc.SpriteFrame).then(function (spriteFrame) {
            app['sspCard_' + cardId] = spriteFrame;
            if(node != null){
                node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            }
            callback(spriteFrame);
        }).catch(function (error) {
            that.ErrLog("OpenPoker(%s) error:%s", cardId, error.stack);
        })
    },
})


var g_zass_ResManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
    if(!g_zass_ResManager)
        g_zass_ResManager = new zass_ResManager();
    return g_zass_ResManager;

}

