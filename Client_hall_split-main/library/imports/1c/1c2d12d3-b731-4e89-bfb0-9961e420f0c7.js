"use strict";
cc._RF.push(module, '1c2d1LTtzFOib+wmWHkIPDH', 'PlayerRoomManager');
// script/dbmanager/PlayerRoom/PlayerRoomManager.js

"use strict";

/*
 玩家房间信息
 */
var app = require('app');

var PlayerRoomManager = app.DBBaseClass.extend({

	Init: function Init() {
		this.JS_Name = "PlayerRoomManager";

		this.NetManager = app.NetManager();
		//推送
		this.NetManager.RegNetPack("S1106_RoomInfo", this.OnPack_RoomInfo, this);

		this.Log("Init");
	},

	//切换账号
	InitReload: function InitReload() {

		//{
		//	//收到牌品评价列表
		//	"koubeiList":[1,1,1,1,1,1],
		//	//好评
		//	"evaGood":0,
		//	//差评
		//	"evaBad":0,
		//	//快速出牌
		//	"fastOut":0,
		//	//中途离开
		//	"midLeave":0,
		//}
		this.dataInfo = {
			"evaBad": 0,
			"evaGood": 0,
			"fastOut": 0,
			"koubeiList": [0, 0, 0, 0, 0, 0, 0, 0],
			"midLeave": 0
		};
	},

	//------------封包函数------------------
	//初始化成功
	OnInitData: function OnInitData(roomInfo) {
		this.dataInfo = roomInfo;
		app.Client.OnEvent("InitPlayerRoom", {});
	},

	//初始化失败
	OnFailInitData: function OnFailInitData(failInfo) {
		this.ErrLog("failInfo:", failInfo);
	},

	//服务器推送初始化
	OnPack_RoomInfo: function OnPack_RoomInfo(serverPack) {
		this.OnSuccessInitDBData(serverPack);
	},

	//-------------设置接口---------------------
	SetPlayerRoomProperty: function SetPlayerRoomProperty(property, value) {
		if (!this.dataInfo.hasOwnProperty(property)) {
			this.ErrLog("SetPlayerRoomProperty not find:%s", property);
			return;
		}
		this.dataInfo[property] = value;
	},
	//--------------获取接口------------------------
	GetPlayerRoomProperty: function GetPlayerRoomProperty(property) {

		this.AutoInitDataPack();

		if (!this.dataInfo.hasOwnProperty(property)) {
			this.ErrLog("GetPlayerRoomProperty not find:%s", property);
			return;
		}
		return this.dataInfo[property];
	},

	//---------------发包接口------------------------
	//自动初始化管理器数据封包
	AutoInitDataPack: function AutoInitDataPack() {
		//发送初始化DB数据
		this.LoadInitDB("game.C1106RoomInfo", {});
	}
});

var g_PlayerRoomManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_PlayerRoomManager) {
		g_PlayerRoomManager = new PlayerRoomManager();
	}
	return g_PlayerRoomManager;
};

cc._RF.pop();