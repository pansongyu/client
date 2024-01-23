"use strict";
cc._RF.push(module, 'd2c56nqRL1HyYy4IsJpoUju', 'FamilyManager');
// script/dbmanager/Family/FamilyManager.js

"use strict";

/*
 FamilyManager 工会管理器
 */
var app = require('app');

var FamilyManager = app.BaseClass.extend({

	Init: function Init() {
		this.JS_Name = "FamilyManager";

		this.NetManager = app.NetManager();

		this.OnReload();

		this.NetManager.RegNetPack("family.C2117InitFamily", this.OnPack_InitData, this);

		//评论初始化工会最佳留言
		//this.NetManager.RegNetPack("family.C2118AddFamilyContent", this.OnPack_FamilyContent, this);
		//this.NetManager.RegNetPack("family.C2121InitFamilyContent", this.OnPack_FamilyContent, this);

		//服务器推送
		this.NetManager.RegNetPack("S2120_FamilyNewBest", this.OnPack_FamilyNewBest, this);

		this.Log("Init");
	},

	//切换账号
	OnReload: function OnReload() {

		//{
		//	"familyID":1000,
		//	"createTime":1000,
		//	...
		//}
		this.dataInfo = {};
		this.familyContentInfo = {};

		this.messageList = [];
		this.thumbsUpList = [];
	},

	//清除工会数据
	ClearFamilyInfo: function ClearFamilyInfo() {
		this.OnReload();
	},

	//------------封包函数------------------
	OnPack_InitData: function OnPack_InitData(serverPack) {

		var publicCardListString = serverPack["yDayPublicCardListString"];

		var publicCardList = [];

		if (publicCardListString) {
			try {
				publicCardList = JSON.parse(publicCardListString);
			} catch (error) {
				this.ErrLog("OnPack_InitData error:%s", error.stack);
				publicCardList = [];
			}
		}

		serverPack["yDayPublicCardList"] = publicCardList;
		this.dataInfo = serverPack;

		var pid = serverPack["yDayPid"];
		var headImageUrl = serverPack["yDayHeadImageUrl"];
		app.WeChatManager().InitHeroHeadImage(pid, headImageUrl);

		//收到工会信息请求工会最佳留言
		this.SendRequestFamilyContent();

		app.Client.OnEvent("GetFamilyInfo", {});
	},

	OnPack_FamilyContent: function OnPack_FamilyContent(serverPack) {
		var messageInfoList = serverPack["messageInfoList"];
		this.messageList = [];
		this.thumbsUpList = [];
		this.familyContentInfo = {};
		var headImageDict = {};
		if (messageInfoList !== "") {
			var count = messageInfoList.length;
			for (var i = 0; i < count; i++) {
				var messageInfo = messageInfoList[i];
				var text = messageInfo["content"];
				var pid = messageInfo["pid"];
				var headImageUrl = messageInfo["headImageUrl"];
				if (text) {
					this.messageList.push(pid);
				} else {
					this.thumbsUpList.push(pid);
				}

				this.familyContentInfo[messageInfo["keyID"]] = messageInfo;

				headImageDict[pid] = headImageUrl;
			}
		}
		app.WeChatManager().InitHeroHeadImageByDict(headImageDict);

		app.Client.OnEvent("FamilyContent", {});
	},

	OnPack_FamilyNewBest: function OnPack_FamilyNewBest(serverPack) {
		if (this.dataInfo["familyID"] != serverPack["familyID"]) {
			this.ErrLog("OnPack_FamilyNewBest familyID error:", serverPack);
			return;
		}
		//清空留言
		this.familyContentInfo = {};
		this.messageList = [];
		this.thumbsUpList = [];

		var publicCardListString = serverPack["yDayPublicCardListString"];
		var publicCardList = [];
		if (publicCardListString) {
			try {
				publicCardList = JSON.parse(publicCardListString);
			} catch (error) {
				this.ErrLog("OnPack_FamilyNewBest error:%s", error.stack);
				publicCardList = [];
			}
		}
		serverPack["yDayPublicCardList"] = publicCardList;

		this.dataInfo.Update(serverPack);

		var pid = serverPack["yDayPid"];
		var headImageUrl = serverPack["yDayHeadImageUrl"];
		app.WeChatManager().InitHeroHeadImage(pid, headImageUrl);

		app.Client.OnEvent("FamilyNewBest", {});
	},

	//-------------设置接口---------------------
	SetFamilyProperty: function SetFamilyProperty(property, value) {
		if (!this.dataInfo.hasOwnProperty(property)) {
			this.ErrLog("SetFamilyProperty not find:%s", property);
			return;
		}
		this.dataInfo[property] = value;
	},
	//--------------获取接口------------------------
	//获取点赞玩家人数
	HavePlayerClickLikeNumber: function HavePlayerClickLikeNumber() {
		return this.thumbsUpList.length;
	},

	HavePlayerClickLike: function HavePlayerClickLike(playerID) {
		return this.thumbsUpList.InArray(playerID);
	},

	HavePlayerMessage: function HavePlayerMessage(playerID) {
		return this.messageList.InArray(playerID);
	},
	GetFamilyProperty: function GetFamilyProperty(property) {
		if (!this.dataInfo.hasOwnProperty(property)) {
			this.ErrLog("GetFamilyProperty not find:%s", property);
			return;
		}
		return this.dataInfo[property];
	},
	GetFamilyDataInfo: function GetFamilyDataInfo() {
		return this.dataInfo;
	},

	//获取工会留言
	GetFamilyContentInfo: function GetFamilyContentInfo() {
		return this.familyContentInfo;
	},

	//---------------发包接口------------------------


	//获取工会数据
	SendGetFamilyInfo: function SendGetFamilyInfo() {
		//this.NetManager.SendPack("family.C2117InitFamily", {});
	},

	SendRequestFamilyContent: function SendRequestFamilyContent() {
		this.NetManager.SendPack("family.C2121InitFamilyContent", {});
	},

	//发送留言
	SendAddFamilyContent: function SendAddFamilyContent(likeID, content) {
		this.NetManager.SendPack("family.C2118AddFamilyContent", { "likeID": likeID, "content": content });
	}

});

var g_FamilyManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_FamilyManager) {
		g_FamilyManager = new FamilyManager();
	}
	return g_FamilyManager;
};

cc._RF.pop();