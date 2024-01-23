(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/dbmanager/PlayerFamily/PlayerFamilyManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '12689ukcdhCFKVjoXFUvD+a', 'PlayerFamilyManager', __filename);
// script/dbmanager/PlayerFamily/PlayerFamilyManager.js

"use strict";

/*
 PlayerFamilyManager 玩家工会ID管理器
 */
var app = require('app');

var PlayerFamilyManager = app.BaseClass.extend({

	Init: function Init() {
		this.JS_Name = "PlayerFamilyManager";

		this.NetManager = app.NetManager();

		this.OnReload();

		this.NetManager.RegNetPack("family.C2119InitPlayerFamily", this.OnPack_InitPlayerFamily, this);

		//服务器推送
		this.NetManager.RegNetPack("S2119_InitPlayerFamily", this.OnPack_PlayerFamilyInfo, this);

		this.Log("Init");
	},

	//切换账号
	OnReload: function OnReload() {

		//{
		//	"familyID":1000,
		//	...
		//}
		this.dataInfo = {};
	},

	//-----------事件回调----------------
	OnPack_InitPlayerFamily: function OnPack_InitPlayerFamily(serverPack) {
		this.OnPack_PlayerFamilyInfo(serverPack);
		app.Client.OnEvent("InitPlayerFamily", {});
	},

	//------------封包函数------------------
	OnPack_PlayerFamilyInfo: function OnPack_PlayerFamilyInfo(serverPack) {

		//初始化玩家工会字典
		this.dataInfo = serverPack;

		var familyID = this.GetPlayerFamilyProperty("familyID");
		//如果工会ID变化,申请工会数据
		if (familyID) {
			app.FamilyManager().SendGetFamilyInfo();
		} else {
			app.FamilyManager().ClearFamilyInfo();
		}

		app.Client.OnEvent("PlayerFamilyInfo", {});
	},

	//-------------设置接口---------------------
	SetPlayerFamilyProperty: function SetPlayerFamilyProperty(property, value) {
		if (!this.dataInfo.hasOwnProperty(property)) {
			this.ErrLog("SetPlayerFamilyProperty not find:%s", property);
			return;
		}
		this.dataInfo[property] = value;
	},
	//--------------获取接口------------------------
	GetPlayerFamilyProperty: function GetPlayerFamilyProperty(property) {
		if (!this.dataInfo.hasOwnProperty(property)) {
			this.ErrLog("GetPlayerFamilyProperty not find:%s", property);
			return;
		}
		return this.dataInfo[property];
	},

	GetFamilyDataInfo: function GetFamilyDataInfo() {
		return this.dataInfo;
	},

	//---------------发包接口------------------------
	//发送请求初始化管理器数据
	SendJoinFamily: function SendJoinFamily(familyID) {
		this.NetManager.SendPack("family.C2116JoinFamily", { "familyID": familyID });
	},

	//发送请求玩家工会数据
	SendInitPlayerFamily: function SendInitPlayerFamily() {
		this.NetManager.SendPack("family.C2119InitPlayerFamily", {});
	}

});

var g_PlayerFamilyManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_PlayerFamilyManager) {
		g_PlayerFamilyManager = new PlayerFamilyManager();
	}
	return g_PlayerFamilyManager;
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
        //# sourceMappingURL=PlayerFamilyManager.js.map
        