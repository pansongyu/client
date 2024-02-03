(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/game/PDK/RoomLogic/PDKRoomSet.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'typdk9b1-6d19-4d10-adee-e8b454afeed9', 'PDKRoomSet', __filename);
// script/game/PDK/RoomLogic/PDKRoomSet.js

"use strict";

/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDM Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package SSSRoomSet.js
 *  @todo: 拼罗松房间
 *
 *  @author hongdian
 *  @date 2014-10-30 16:04
 *  @version 1.0
 *
 *  修改时间 修改人 修改内容
 *  -------------------------------------------------------------------------------
 *
 */
var app = require('pdk_app');

/**
 * 类构造
 */
var PDKRoomSet = app.BaseClass.extend({

	/**
  * 初始化
  */
	Init: function Init() {

		this.JS_Name = app.subGameName.toUpperCase() + "RoomSet";

		this.ComTool = app[app.subGameName + "_ComTool"]();
		this.ShareDefine = app[app.subGameName + "_ShareDefine"]();

		this.OnReload();
		this.Log("Init");
	},

	OnReload: function OnReload() {
		this.dataInfo = {};
	},

	InitSetInfo: function InitSetInfo(setInfo) {
		console.log('InitSetInfo', setInfo);

		this.dataInfo = setInfo;
	},

	//-----------------------回调函数-----------------------------
	OnInitRoomSetData: function OnInitRoomSetData(setInfo) {
		this.InitSetInfo(setInfo);
		var state = this.dataInfo["state"];

		if (this.ShareDefine.SetStateStringDict.hasOwnProperty(state)) {
			this.dataInfo["state"] = this.ShareDefine.SetStateStringDict[state];
		} else {
			this.ErrLog("OnInitRoomSetData state:%s not find", state);
		}
		this.Log("OnInitRoomSetData:", this.dataInfo);
	},

	OnSetStart: function OnSetStart(setInfo) {
		this.InitSetInfo(setInfo);
		this.dataInfo["state"] = this.ShareDefine.SetState_Init;
	},

	OnSetPlaying: function OnSetPlaying(opPos) {
		this.dataInfo["opPos"] = opPos;
		this.dataInfo["state"] = this.ShareDefine.SetState_Playing;
	},

	OnSetEnd: function OnSetEnd(setEnd) {
		this.dataInfo["setEnd"] = setEnd;
		this.dataInfo["state"] = this.ShareDefine.SetState_End;
		this.Log("OnSetEnd:", this.dataInfo);
	},
	SetHandCard: function SetHandCard(pos, cardList) {
		var posInfo = this.dataInfo["posInfo"];
		posInfo[pos].cards = cardList;
	},
	SetRoomSetProperty: function SetRoomSetProperty(key, value) {
		this.dataInfo[key] = value;
	},

	//----------------获取接口--------------------

	//获取set属性值
	GetRoomSetProperty: function GetRoomSetProperty(property) {
		if (!this.dataInfo.hasOwnProperty(property)) {
			this.ErrLog("GetSetProperty(%s) not find", property);
			return;
		}
		return this.dataInfo[property];
	},

	GetRoomSetInfo: function GetRoomSetInfo() {
		return this.dataInfo;
	},

	GetHandCard: function GetHandCard() {
		var posInfo = this.dataInfo["posInfo"];
		for (var i = 0; i < posInfo.length; i++) {
			if (posInfo[i].pid == app[app.subGameName + "_HeroManager"]().GetHeroProperty("pid")) {
				return posInfo[i].cards;
			}
		}
	},

	GetSecTotal: function GetSecTotal() {
		var posInfo = this.dataInfo["posInfo"];
		for (var i = 0; i < posInfo.length; i++) {
			if (posInfo[i].pid == app[app.subGameName + "_HeroManager"]().GetHeroProperty("pid")) {
				return posInfo[i].secTotal;
			}
		}
	}

});

var g_PDKRoomSet = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_PDKRoomSet) g_PDKRoomSet = new PDKRoomSet();
	return g_PDKRoomSet;
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
        //# sourceMappingURL=PDKRoomSet.js.map
        