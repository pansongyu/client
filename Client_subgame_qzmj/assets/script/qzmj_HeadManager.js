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
var app = require("qzmj_app");

/**
 * 类构造
 */
var qzmj_HeadManager = app.BaseClass.extend({

    /**
     * 初始化
     */
    Init:function(){
        this.JS_Name = app["subGameName"] + "_HeadManager";
        this.LocalDataManager=app.LocalDataManager();
        this.OnReload();
    },

    OnReload:function(){
        this.headInfos = [];
        let MaxPlayerNum = app[app.subGameName+"_ShareDefine"]().MaxPlayerNum;
        for(let i=0;i<MaxPlayerNum;i++){
            this.headInfos.push(null);
        }
    },
    SetHeadInfo:function(pos,headNode){
        let MaxPlayerNum = app[app.subGameName+"_ShareDefine"]().MaxPlayerNum;
        if(pos >= MaxPlayerNum || pos < 0)
            return;

        this.headInfos[pos] = headNode;
    },
    GetComponentByPos:function(pos){
        let is3DShow=this.LocalDataManager.GetConfigProperty("SysSetting", app.subGameName+"_is3DShow");
        let MaxPlayerNum = app[app.subGameName+"_ShareDefine"]().MaxPlayerNum;
        if(pos >= MaxPlayerNum || pos < 0){
            return null;
        }
        let component=null;
        if(is3DShow==2){
             component = this.headInfos[pos].getComponent(app.subGameName + '_UIWBHead');
        }else{
             component = this.headInfos[pos].getComponent(app.subGameName + '_UIPublicHead');
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


var g_qzmj_HeadManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
    if(!g_qzmj_HeadManager)
        g_qzmj_HeadManager = new qzmj_HeadManager();
    return g_qzmj_HeadManager;

}
