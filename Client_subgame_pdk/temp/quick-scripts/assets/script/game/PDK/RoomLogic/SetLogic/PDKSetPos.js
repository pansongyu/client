(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/game/PDK/RoomLogic/SetLogic/PDKSetPos.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'typdkc5a-0a5f-4562-8ed6-3edbc73ab1b6', 'PDKSetPos', __filename);
// script/game/PDK/RoomLogic/SetLogic/PDKSetPos.js

"use strict";

/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDM Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package PDKSetPos.js
 *  @todo: 自由扑克房间
 *
 *
 *  修改时间 修改人 修改内容
 *  -------------------------------------------------------------------------------
 *
 */
var app = require('pdk_app');

/**
 * 类构造
 */
var PDKSetPos = app.BaseClass.extend({

	/**
  * 初始化
  */
	Init: function Init() {

		this.JS_Name = app.subGameName.toUpperCase() + "SetPos";

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
		console.log("OnInitSetPos:", this.dataInfo);
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
			this.ErrLog("GetSetPosProperty(%s) error", property);
			return;
		}
		var shuxing = this.dataInfo[property];
		return this.dataInfo[property];
	}

});

var g_PDKSetPos = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_PDKSetPos) g_PDKSetPos = new PDKSetPos();
	return g_PDKSetPos;
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
        //# sourceMappingURL=PDKSetPos.js.map
        