"use strict";
cc._RF.push(module, 'fjssz465-3dd0-44e3-b361-051f99fe9c96', 'LocalDataManager');
// script/common/LocalDataManager.js

"use strict";

/*
    本地数据库管理器
*/
var app = require("fjssz_app");

var LocalDataManager = app.BaseClass.extend({

	Init: function Init() {
		this.JS_Name = "LocalDataManager";

		//暂时只有一个区
		this.linkServer = "Server01";

		//通用属性初始化字典
		this.InitDataDict = {
			"SysSetting": {
				"MainBackMusic": 'MainScene',
				"GameBackMusic": 'gameBackGround',
				"BackMusic": 1,
				"SpSound": 1,
				"BackVolume": 1,
				"SpVolume": 1,
				"IsShowChat": 1,
				"IsPlayVideo": 1,
				"TuiGuangUrl": '',
				"Language": 1,
				"IsAudio": 1,
				"QianDao": 0,
				"fjssz_is3DShow": 1,
				"Date": -1,
				"LastGameType": ''
			},
			"Account": {
				"AccountDict": {},
				"AccountList": [],
				"AccountActive": 0,
				"AccessPoint": 0,
				"AccessTokenInfo": {},
				"AccountID": 0,
				"uuid": 0
			},
			"DebugInfo": {
				"GateServerInfo": {},
				"AccountServerInfo": {},
				"OrderServerInfo": {},
				"GameServerInfo": {},
				"ResServerInfo": {}
			}
		};

		//玩家个人属性初始化字典
		this.PlayerInitData = {
			"EventIDList": [],
			"OrderDict": {}
		};
		//创建房间字典				    

		this.InitConfig();

		// this.Log("Init");
	},

	//切换账号
	OnReload: function OnReload() {},

	/**
  * 初始化配置
  */
	InitConfig: function InitConfig() {

		for (var configName in this.InitDataDict) {
			var optionData = this.InitDataDict[configName];
			for (var option in optionData) {
				if (this.HaveConfigProperty(configName, option)) {
					continue;
				}
				this.SetConfigProperty(configName, option, optionData[option]);
			}
		}
	},

	/**
  * 初始化配置
  */
	PlayerLogin: function PlayerLogin(heroID) {

		heroID = heroID.toString();

		//初始化
		if (!this.HaveConfigProperty(heroID, this.linkServer)) {
			this.SetConfigProperty(heroID, this.linkServer, {});
		}

		var playerDataDict = this.GetConfigProperty(heroID, this.linkServer);
		//初始化失败
		if (!playerDataDict) {
			console.error("PlayerLogin(%s) fail", heroID);
			return;
		}

		for (var property in this.PlayerInitData) {
			if (!playerDataDict.hasOwnProperty(property)) {
				playerDataDict[property] = this.PlayerInitData[property];
			}
		}
		this.SetConfigProperty(heroID, this.linkServer, playerDataDict);
	},

	//--------------------------获取接口----------------------------------
	/**
  * 获取配置值
  * @param configName
  * @param option
  * @param value
  */
	SetConfigProperty: function SetConfigProperty(configName, option, value) {

		var canUse = cc.sys.localStorage.CanUse;

		var configInfo = {};
		if (canUse) {
			configInfo = cc.sys.localStorage.getItem(configName);
			if (configInfo) {
				configInfo = JSON.parse(configInfo);
			}
			//如果没有初始化
			else {
					configInfo = {};
				}

			configInfo[option] = value;

			//如果多开客户端，会出现数据不能被保存，因为底层只接受一个数据连接请求
			cc.sys.localStorage.setItem(configName, JSON.stringify(configInfo));
		} else {
			configInfo = this.InitDataDict[configName];
			if (!configInfo) {
				console.error("SetConfigProperty not find(%s)", configName);
				return false;
			}
			configInfo[option] = value;
		}

		return true;
	},

	/**
  * 获取玩家登录服务器本地数据
  * @param configName
  * @param option
  */
	SetPlayerConfigProperty: function SetPlayerConfigProperty(heroID, option, value) {
		heroID = heroID.toString();

		var canUse = cc.sys.localStorage.CanUse;
		if (canUse) {

			var configInfo = cc.sys.localStorage.getItem(heroID);
			if (configInfo) {
				configInfo = JSON.parse(configInfo);
			} else {
				configInfo = {};
			}

			//如果没有服务器数据,则初始化
			if (!configInfo.hasOwnProperty(this.linkServer)) {
				configInfo[this.linkServer] = {};
			}

			var serverDataDict = configInfo[this.linkServer];
			serverDataDict[option] = value;

			//如果多开客户端，会出现数据不能被保存，因为底层只接受一个数据连接请求
			cc.sys.localStorage.setItem(heroID, JSON.stringify(configInfo));
		} else {
			this.PlayerInitData[option] = value;
		}

		return true;
	},

	//--------------------------设置接口----------------------------------
	/**
  * 设置配置值
  * @param configName
  * @param option
  */
	GetConfigProperty: function GetConfigProperty(configName, option) {
		configName = configName.toString();

		var canUse = cc.sys.localStorage.CanUse;

		var configInfo = {};
		if (canUse) {
			configInfo = cc.sys.localStorage.getItem(configName);
			if (configInfo) {
				configInfo = JSON.parse(configInfo);
			}
		}
		//可能运行环境没有支持localStorage,则取默认字典数据
		else {
				configInfo = this.InitDataDict[configName];
				console.error("GetConfigProperty fail, configName:%s option:%s is not find", configName, option);
			}

		if (!configInfo) {
			console.error("GetConfigProperty(%s,%s)", configName, option);
			return;
		}

		if (!configInfo.hasOwnProperty(option)) {
			console.error("GetConfigProperty fail, not find the option:%s", option);
			return;
		}

		return configInfo[option];
	},

	/**
  * 获取玩家登录服务器本地数据
  * @param configName
  * @param option
  */
	GetPlayerConfigProperty: function GetPlayerConfigProperty(heroID, option) {

		heroID = heroID.toString();
		var canUse = cc.sys.localStorage.CanUse;
		var serverDataDict = {};

		if (canUse) {
			var configInfo = cc.sys.localStorage.getItem(heroID);
			if (configInfo) {
				configInfo = JSON.parse(configInfo);
				if (!configInfo.hasOwnProperty(this.linkServer)) {
					console.error("GetPlayerConfigProperty(%s) fail, not find the linkServer:%s", heroID, this.linkServer);
					return;
				}
				serverDataDict = configInfo[this.linkServer];
			}
		} else {
			serverDataDict = this.PlayerInitData;
			console.error("GetPlayerConfigProperty fail, heroID:%s option:%s is not find", heroID, option);
		}

		if (!serverDataDict.hasOwnProperty(option)) {
			console.error("GetPlayerConfigProperty(%s,%s) not find %s", heroID, this.linkServer, option);
			return;
		}

		return serverDataDict[option];
	},

	//--------------------------判断接口----------------------------------
	/**
  * 判断是否存在配置值
  * @param configName
  * @param option
  */
	HaveConfigProperty: function HaveConfigProperty(configName, option) {

		var configInfo = cc.sys.localStorage.getItem(configName);
		if (!configInfo) {
			return false;
		}
		configInfo = JSON.parse(configInfo);
		if (!configInfo.hasOwnProperty(option)) {
			return false;
		}
		return true;
	},

	HavePlayerConfigProperty: function HavePlayerConfigProperty(heroID, option) {

		heroID = heroID.toString();
		var configInfo = cc.sys.localStorage.getItem(heroID);
		if (!configInfo) {
			return false;
		}
		configInfo = JSON.parse(configInfo);
		if (!configInfo.hasOwnProperty(this.linkServer)) {
			return false;
		}
		var serverDataDict = configInfo[this.linkServer];

		return serverDataDict.hasOwnProperty(option);
	},

	//--------------------------操作接口----------------------------------
	/**
  * 删除配置值
  * @param configName
  * @param option
  */
	Remove: function Remove(configName) {
		cc.sys.localStorage.removeItem(configName);
	}

});

var g_LocalDataManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_LocalDataManager) {
		g_LocalDataManager = new LocalDataManager();
	}
	return g_LocalDataManager;
};

cc._RF.pop();