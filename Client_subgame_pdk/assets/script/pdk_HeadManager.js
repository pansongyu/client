/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDM Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package YXPDKRoom.js
 *  @todo: 十三支房间
 *
 *  @version 1.0
 *
 *  修改时间 修改人 修改内容
 *  -------------------------------------------------------------------------------
 *
 */
var app = require("pdk_app");

/**
 * 类构造
 */
var pdk_HeadManager = app.BaseClass.extend({

    /**
     * 初始化
     */
    Init:function(){
        this.JS_Name = app.subGameName + "_HeadManager";

        this.OnReload();
    },

    OnReload:function(){
        this.headInfos = [];
        let MaxPlayerNum = app[app.subGameName + "_ShareDefine"]().MaxPlayerNum;
        for(let i=0;i<MaxPlayerNum;i++){
            this.headInfos.push(null);
        }
    },
    SetHeadInfo:function(pos,headNode){
        let MaxPlayerNum = app[app.subGameName + "_ShareDefine"]().MaxPlayerNum;
        if(pos >= MaxPlayerNum || pos < 0)
            return;

        this.headInfos[pos] = headNode;
    },
    GetComponentByPos:function(pos){
        let MaxPlayerNum = app[app.subGameName + "_ShareDefine"]().MaxPlayerNum;
        if(pos >= MaxPlayerNum || pos < 0)
            return null;

        let component = this.headInfos[pos].getComponent(app.subGameName + '_UIPublicHead');
        if(!component){
            component = this.headInfos[pos].getComponent(app.subGameName + '_LPUIPublicHead');
        }
        if(!component){
            component = this.headInfos[pos].getComponent(app.subGameName + '_SYUIPublicHead');
        }
        if(!component){
            component = this.headInfos[pos].getComponent(app.subGameName + '_XiuXUIPublicHead');
        }
        if(component)
            return component;
        return null;
    },
    GetAllHeadInfo:function(){
        return this.headInfos;
    },
    //-----------------------回调函数-----------------------------
    
})


var g_pdk_HeadManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
    if(!g_pdk_HeadManager)
        g_pdk_HeadManager = new pdk_HeadManager();
    return g_pdk_HeadManager;

}
