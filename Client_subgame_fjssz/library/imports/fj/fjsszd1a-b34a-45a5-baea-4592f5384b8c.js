"use strict";
cc._RF.push(module, 'fjsszd1a-b34a-45a5-baea-4592f5384b8c', 'fjssz_app');
// script/fjssz_app.js

'use strict';

/*
    客户端公共require模块
*/

require('JSBaseModule');
var BaseClass = require('BaseClass');
var bluebird = require("bluebird");
var i18n = require("i18n");
var MD5Tool = require("MD5Tool");

//不需要创建单例的API
var apiDict = {
	"BaseClass": BaseClass["BaseClass"],
	"DBBaseClass": BaseClass["DBBaseClass"],
	"bluebird": bluebird,
	"i18n": i18n,
	"MD5": MD5Tool
};

module.exports = apiDict;

//子游戏名称
var subGameName = "fjssz";

module.exports.subGameName = subGameName;

//需要创建单例的API
var NeedCreateList = [
//define
subGameName.toLowerCase() + "_ShareDefine", subGameName.toLowerCase() + "_ComTool", "LocalDataManager", subGameName.toLowerCase() + "_UtilsWord",

//基础模块
subGameName.toLowerCase() + "_SysDataManager", subGameName.toLowerCase() + "_SysNotifyManager", subGameName.toLowerCase() + "_ConfirmManager", subGameName.toLowerCase() + "_ControlManager", subGameName.toLowerCase() + "_HttpPack", subGameName.toLowerCase() + "_NetRequest", subGameName.toLowerCase() + "_NetWork", subGameName.toLowerCase() + "_NetManager", subGameName.toLowerCase() + "_SDKManager", subGameName.toLowerCase() + "_WeChatManager", subGameName.toLowerCase() + "_WeChatAppManager", subGameName.toLowerCase() + "_DownLoadMgr", subGameName.toLowerCase() + "_LocationOnStartMgr", subGameName.toLowerCase() + "_HotUpdateMgr",

//资源模块
subGameName.toLowerCase() + "_SceneManager", subGameName.toLowerCase() + "_FormManager", subGameName.toLowerCase() + "_EffectManager", subGameName.toLowerCase() + "_SoundManager", subGameName.toLowerCase() + "_AudioManager", subGameName.toLowerCase() + "_HeadManager",
//数据管理器
subGameName.toLowerCase() + "_ServerTimeManager", subGameName.toLowerCase() + "_HeroAccountManager", subGameName.toLowerCase() + "_HeroManager", subGameName.toLowerCase() + "_NativeManager",

//-----汇总数据管理器----
subGameName.toLowerCase() + "_GameManager",

//-----牌局相关-------
subGameName.toUpperCase() + "Define", subGameName.toLowerCase() + "_PokerCard", subGameName.toUpperCase() + "RoomMgr", subGameName.toUpperCase() + "Room", subGameName.toUpperCase() + "RoomSet", subGameName.toUpperCase() + "RoomPosMgr", subGameName.toUpperCase() + "SetPos", subGameName.toUpperCase() + "LogicGame", subGameName.toUpperCase() + "LogicRank"];

module.exports.NeedCreateList = NeedCreateList;

cc._RF.pop();