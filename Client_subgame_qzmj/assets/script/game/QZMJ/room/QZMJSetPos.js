/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDM Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package QZMJSetPos.js
 *  @todo: 龙岩麻将房间
 *
 *
 *  修改时间 修改人 修改内容
 *  -------------------------------------------------------------------------------
 *
 */
var app = require("qzmj_app");

/**
 * 类构造
 */
var QZMJSetPos = app.BaseClass.extend({

	/**
	 * 初始化
	 */
	Init:function(){

		this.JS_Name = "QZMJSetPos";

		this.ComTool = app[app.subGameName+"_ComTool"]();
		this.ShareDefine = app[app.subGameName+"_ShareDefine"]();

		this.OnReload();
		this.Log("Init");

	},

	OnReload:function(){
		this.dataInfo = {
							isLock:false,
							buChuList:[],
							posID:0,
							handCard:0,
							shouCard:[],
							outCard:[],
							publicCardList:[],
							huCard:[],
							huaList:[],
						};
	},

	//-----------------------回调函数-----------------------------
	//开局初始化
	OnInitSetPos:function(setPosInfo){
		this.dataInfo = setPosInfo;
		this.Log("OnInitSetPos:", this.dataInfo);
	},

	//抓到一张牌
	OnPosGetCard:function(setPosInfo){
		this.dataInfo = setPosInfo;
		this.Log("OnPosGetCard:", this.dataInfo);
		return true;
	},

	//打出一张牌后
	OnPosOpCard:function(setPosInfo){
		this.dataInfo = setPosInfo;
		this.Log("OnPosOpCard:", this.dataInfo);
		return true;
	},

	//继续游戏需要清除之前的手牌记录
	OnPosContinueGame:function(){
		this.dataInfo["isLock"] = false;
		this.dataInfo["posID"] = 0;
		this.dataInfo["buChuList"] = [];
		this.dataInfo["handCard"] = 0;
		this.dataInfo["huaList"] = [];
		this.dataInfo["shouCard"] = [];
		this.dataInfo["outCard"] = [];
		this.dataInfo["publicCardList"] = [];
		this.dataInfo["huCard"] = [];
	},

	//----------------获取接口----------------------
	//获取位置信息
	GetSetPosInfo:function(){
		return this.dataInfo
	},

	//获取属性值
	GetSetPosProperty:function(property){
		if(!this.dataInfo.hasOwnProperty(property)){
			this.ErrLog("GetSetPosProperty(%s) error", property);
			return
		}
		return this.dataInfo[property];
	},
	SetDataInfo:function(key,value){
		this.dataInfo[key]=value;
	},

})


/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
	return new QZMJSetPos();

}
