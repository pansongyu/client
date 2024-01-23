/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDM Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package WorldInfoManager.js
 *  @todo: 全服数据
 *
 *  @author hongdian
 *  @date 2014-10-30 16:04
 *  @version 1.0
 *
 *  修改时间 修改人 修改内容
 *  -------------------------------------------------------------------------------
 *
 */
var app = require('app');

/**
 * 类构造
 */
var WorldInfoManager = app.BaseClass.extend({

	/**
	 * 初始化
	 */
	Init:function(){

		this.JS_Name = "WorldInfoManager";

		this.ComTool = app.ComTool();
		this.ShareDefine = app.ShareDefine();

		this.OnReload();
		this.Log("create WorldInfoManager");
	},

	OnReload:function(){
		this.dataInfo = {};
	},

	//-----------------------回调函数-----------------------------
	InitLoginData:function(serverPack){

		this.dataInfo["defaultFamilyID"] = serverPack["defaultFamilyID"];
		this.dataInfo["firstStartTime"] = serverPack["firstStartTime"];
	},

	//-----------------------获取函数-----------------------------

	//获取属性值
	GetWorldInfoProperty:function(property){
		if(!this.dataInfo.hasOwnProperty(property)){
			this.ErrLog("GetWorldInfoProperty:%s", property);
			return
		}
		return this.dataInfo[property];
	},
	

})


var g_WorldInfoManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
	if(!g_WorldInfoManager)
		g_WorldInfoManager = new WorldInfoManager();
	return g_WorldInfoManager;

}
