/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDM Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package SSSSetPos.js
 *  @todo: 自由扑克房间
 *
 *
 *  修改时间 修改人 修改内容
 *  -------------------------------------------------------------------------------
 *
 */
var app = require("fjssz_app");

/**
 * 类构造
 */
var SSSSetPos = app.BaseClass.extend({

	/**
	 * 初始化
	 */
	Init:function(){

		this.JS_Name = "SSSSetPos";

		this.ComTool = app[app.subGameName+"_ComTool"]();
		this.ShareDefine = app[app.subGameName+"_ShareDefine"]();
		this.OnReload();
		this.Log("Init");
	},

	OnReload:function(){
		this.dataInfo = {};
	},

	//-----------------------回调函数-----------------------------
	//开局初始化
	OnInitSetPos:function(setPosInfo){
		this.OnReload();
		this.dataInfo = setPosInfo;
	},

	//继续游戏需要清除之前的手牌记录
	OnPosContinueGame:function(){
		this.OnReload();
	},

	//----------------获取接口----------------------
	//获取位置信息
	GetSetPosInfo:function(){
		return this.dataInfo;
	},

	//获取属性值
	GetSetPosProperty:function(property){
		if(!this.dataInfo.hasOwnProperty(property)){
			console.error("GetSetPosProperty(%s) error", property);
			return
		}
		let shuxing = this.dataInfo[property];
		return this.dataInfo[property];
	},

})

var g_SSSSetPos = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
	if(!g_SSSSetPos)
		g_SSSSetPos = new SSSSetPos();
	return g_SSSSetPos;

}
