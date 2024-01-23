(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/dbmanager/World/WorldInfoManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3f6a1zQY5lGCZnPkwVA/6qN', 'WorldInfoManager', __filename);
// script/dbmanager/World/WorldInfoManager.js

"use strict";

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
	Init: function Init() {

		this.JS_Name = "WorldInfoManager";

		this.ComTool = app.ComTool();
		this.ShareDefine = app.ShareDefine();

		this.OnReload();
		this.Log("create WorldInfoManager");
	},

	OnReload: function OnReload() {
		this.dataInfo = {};
	},

	//-----------------------回调函数-----------------------------
	InitLoginData: function InitLoginData(serverPack) {

		this.dataInfo["defaultFamilyID"] = serverPack["defaultFamilyID"];
		this.dataInfo["firstStartTime"] = serverPack["firstStartTime"];
	},

	//-----------------------获取函数-----------------------------

	//获取属性值
	GetWorldInfoProperty: function GetWorldInfoProperty(property) {
		if (!this.dataInfo.hasOwnProperty(property)) {
			this.ErrLog("GetWorldInfoProperty:%s", property);
			return;
		}
		return this.dataInfo[property];
	}

});

var g_WorldInfoManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_WorldInfoManager) g_WorldInfoManager = new WorldInfoManager();
	return g_WorldInfoManager;
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
        //# sourceMappingURL=WorldInfoManager.js.map
        