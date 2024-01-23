"use strict";
cc._RF.push(module, 'fjsszc5a-0a5f-4562-8ed6-3edbc73ab1b6', 'FJSSZSetPos');
// script/game/FJSSZ/RoomLogic/SetLogic/FJSSZSetPos.js

"use strict";

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
	Init: function Init() {

		this.JS_Name = "SSSSetPos";

		this.ComTool = app[app.subGameName + "_ComTool"]();
		this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
		this.OnReload();
		this.Log("Init");
	},

	OnReload: function OnReload() {
		this.dataInfo = {};
	},

	//-----------------------回调函数-----------------------------
	//开局初始化
	OnInitSetPos: function OnInitSetPos(setPosInfo) {
		this.OnReload();
		this.dataInfo = setPosInfo;
	},

	//继续游戏需要清除之前的手牌记录
	OnPosContinueGame: function OnPosContinueGame() {
		this.OnReload();
	},

	//----------------获取接口----------------------
	//获取位置信息
	GetSetPosInfo: function GetSetPosInfo() {
		return this.dataInfo;
	},

	//获取属性值
	GetSetPosProperty: function GetSetPosProperty(property) {
		if (!this.dataInfo.hasOwnProperty(property)) {
			console.error("GetSetPosProperty(%s) error", property);
			return;
		}
		var shuxing = this.dataInfo[property];
		return this.dataInfo[property];
	}

});

var g_SSSSetPos = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_SSSSetPos) g_SSSSetPos = new SSSSetPos();
	return g_SSSSetPos;
};

cc._RF.pop();