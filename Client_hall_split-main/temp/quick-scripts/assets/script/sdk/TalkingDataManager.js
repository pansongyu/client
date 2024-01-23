(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/sdk/TalkingDataManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e756eWuX4ZO5KWXgyBCAF4e', 'TalkingDataManager', __filename);
// script/sdk/TalkingDataManager.js

"use strict";

/*
 TalkingDataManager.js 统计数据管理器
 */
var app = require('app');

var TalkingDataManager = app.BaseClass.extend({

	Init: function Init() {
		this.JS_Name = "TalkingDataManager";

		this.ShareDefine = app.ShareDefine();

		app.Client.RegEvent("PlayerLoginOK", this.OnEvent_PlayerLoginOK, this);
		app.Client.RegEvent("HeroProperty", this.OnEvent_HeroProperty, this);

		//如果存在全局sdk对象
		this.sdk = window.TDGA;

		this.OnReload();
		this.Log("Init");
	},

	OnReload: function OnReload() {},

	OnEvent_PlayerLoginOK: function OnEvent_PlayerLoginOK() {
		var accountInfo = app.HeroAccountManager().GetAccountInfo();
		var heroInfo = app.HeroManager().GetHeroInfo();
		var heroID = app.HeroManager().GetHeroID();
		this.RecordAccount(accountInfo["AccountID"], accountInfo["AccountType"], heroID, heroInfo["lv"]);
	},

	OnEvent_HeroProperty: function OnEvent_HeroProperty(event) {
		var argDict = event;
		var property = argDict["Property"];
		if (property == "lv") {
			this.RecordHeroLv(argDict["Value"]);
		}
	},

	//记录登录的玩家账号数据
	RecordAccount: function RecordAccount(accountID, accountType, heroID, heroLv) {
		if (!this.sdk) {
			return;
		}

		var channel = app.Client.GetClientConfigProperty("Channel");

		this.sdk.Account({
			//必须使用heroID作为唯一ID,因为orderServer没有accountID数据
			"accountId": heroID,
			"level": heroLv,
			"gameServer": channel,
			"accountType ": accountType,
			"age": 1,
			"accountName": accountID,
			"gender": 1
		});
	},

	//记录玩家等级
	RecordHeroLv: function RecordHeroLv(heroLv) {
		if (!this.sdk) {
			return;
		}
		this.sdk.Account.setLevel(heroLv);
	},

	//记录发起付费
	RecordStartPay: function RecordStartPay(orderID, apptype, appID, appPrice) {
		if (!this.sdk) {
			return;
		}
		var channel = app.Client.GetClientConfigProperty("Channel");

		this.sdk.onChargeRequest({
			"orderId": orderID,
			"iapId": [apptype, appID].join("_"),
			"appID": appID,
			"currencyType": "CNY",
			"virtualCurrencyAmount": appPrice,
			"paymentType": channel
		});
	},

	RecordEndPay: function RecordEndPay(orderID, apptype, appID, appPrice) {
		if (!this.sdk) {
			return;
		}
		var channel = app.Client.GetClientConfigProperty("Channel");

		this.sdk.onChargeSuccess({
			"orderId": orderID,
			"iapId": [apptype, appID].join("_"),
			"appID": appID,
			"currencyType": "CNY",
			"virtualCurrencyAmount": appPrice,
			"paymentType": channel
		});
	},

	//记录赠送获得的钻石
	RecordDiamondReward: function RecordDiamondReward(diamond, reason) {
		if (!this.sdk) {
			return;
		}
		this.sdk.onReward(diamond, reason);
	},

	//记录塔层开始
	RecordStartTowerLv: function RecordStartTowerLv(towerLv) {
		if (!this.sdk) {
			return;
		}
		this.sdk.onMissionBegin(towerLv);
	},
	//记录塔层通关结束
	RecordEndTowerLv: function RecordEndTowerLv(towerLv) {
		if (!this.sdk) {
			return;
		}
		this.sdk.onMissionCompleted(towerLv);
	},

	RecordEndFailTowerLv: function RecordEndFailTowerLv(towerLv) {
		if (!this.sdk) {
			return;
		}
		this.sdk.onMissionFailed(towerLv, "FightBossFail");
	}

});

var g_TalkingDataManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_TalkingDataManager) {
		g_TalkingDataManager = new TalkingDataManager();
	}
	return g_TalkingDataManager;
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
        //# sourceMappingURL=TalkingDataManager.js.map
        