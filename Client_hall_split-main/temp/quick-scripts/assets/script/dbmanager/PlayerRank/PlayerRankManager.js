(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/dbmanager/PlayerRank/PlayerRankManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e66eafqsSNIBYsNWcm6ZTNQ', 'PlayerRankManager', __filename);
// script/dbmanager/PlayerRank/PlayerRankManager.js

"use strict";

/*
    玩家排行榜模块
*/
var app = require('app');

var PlayerRankManager = app.BaseClass.extend({

	Init: function Init() {
		this.JS_Name = "PlayerRankManager";

		this.NetManager = app.NetManager();
		this.ShareDefine = app.ShareDefine();

		this.NetManager.RegNetPack("rank.C2227InitRankInfo", this.OnPack_InitRankInfo, this);

		this.OnReload();

		this.Log("Init");
	},

	//切换账号
	OnReload: function OnReload() {
		//玩家胜局排版数据
		this.playerWinSetRankInfo = {};
		//玩家战绩积分排行
		this.playerIntegralRankInfo = {};

		this.isLoadWinSetRank = false;
		this.isLoadIntegralRank = false;

		//我的排名
		this.myWinSetRankID = 0;
		//我的排名
		this.myIntegralRankID = 0;
	},

	//------------封包函数------------------

	//服务器推送初始化
	OnPack_InitRankInfo: function OnPack_InitRankInfo(serverPack) {

		var rankType = serverPack["rankType"];
		var rankPlayerInfoList = serverPack["rankPlayerInfoList"];
		var count = rankPlayerInfoList.length;

		var clientHeroID = app.HeroManager().GetHeroID();

		var rankInfo = {};
		var clientRankID = 0;

		var heroImageDict = {};

		for (var index = 0; index < count; index++) {
			var rankPlayerInfo = rankPlayerInfoList[index];
			rankInfo[rankPlayerInfo["rankID"]] = rankPlayerInfo;
			var pid = rankPlayerInfo["pid"];
			if (clientHeroID == pid) {
				clientRankID = rankPlayerInfo["rankID"];
			}
			heroImageDict[pid] = rankPlayerInfo["headImageUrl"];
		}

		if (rankType == this.ShareDefine.RankType_WinSetCount) {
			this.playerWinSetRankInfo = rankInfo;
			this.myWinSetRankID = clientRankID;
			this.isLoadWinSetRank = true;
		} else if (rankType == this.ShareDefine.RankType_Integral) {
			this.playerIntegralRankInfo = rankInfo;
			this.myIntegralRankID = clientRankID;
			this.isLoadIntegralRank = true;
		} else {
			this.ErrLog("OnInitData not find:%s", rankType);
			return;
		}

		app.WeChatManager().InitHeroHeadImageByDict(heroImageDict);

		app.Client.OnEvent("InitPlayerRank", { "RankType": rankType });
	},

	//--------------获取接口------------------------
	//获取玩家的胜局排行字典
	GetPlayerWinSetRankInfo: function GetPlayerWinSetRankInfo() {
		this.SendInitRankInfo(this.ShareDefine.RankType_WinSetCount);
		return this.playerWinSetRankInfo;
	},

	//获取客户端自身胜局排名
	GetMyWinSetRankID: function GetMyWinSetRankID() {
		return this.myWinSetRankID;
	},

	//获取玩家的积分排行字典
	GetPlayerIntegralRankInfo: function GetPlayerIntegralRankInfo() {
		this.SendInitRankInfo(this.ShareDefine.RankType_Integral);
		return this.playerIntegralRankInfo;
	},

	//获取客户端自身积分排名
	GetMyIntegralRankID: function GetMyIntegralRankID() {
		return this.myIntegralRankID;
	},

	//---------------发包接口------------------------
	//自动初始化管理器数据封包
	SendInitRankInfo: function SendInitRankInfo(rankType) {

		if (rankType == this.ShareDefine.RankType_WinSetCount) {
			//如果请求的数据已经初始化过了
			if (this.isLoadWinSetRank) {
				return;
			}
		} else if (rankType == this.ShareDefine.RankType_Integral) {
			//如果请求的数据已经初始化过了
			if (this.isLoadIntegralRank) {
				return;
			}
		}
		this.NetManager.SendPack("rank.C2227InitRankInfo", { "rankType": rankType });
	}
});

var g_PlayerRankManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_PlayerRankManager) {
		g_PlayerRankManager = new PlayerRankManager();
	}
	return g_PlayerRankManager;
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
        //# sourceMappingURL=PlayerRankManager.js.map
        