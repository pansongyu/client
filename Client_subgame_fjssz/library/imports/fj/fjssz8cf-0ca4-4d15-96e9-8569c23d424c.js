"use strict";
cc._RF.push(module, 'fjssz8cf-0ca4-4d15-96e9-8569c23d424c', 'FJSSZRoomSet');
// script/game/FJSSZ/RoomLogic/FJSSZRoomSet.js

"use strict";

/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDM Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package FJSSZRoomSet.js
 *  @todo: 自由扑克房间
 *
 *  @author hongdian
 *  @date 2014-10-30 16:04
 *  @version 1.0
 *
 *  修改时间 修改人 修改内容
 *  -------------------------------------------------------------------------------
 *
 */
var app = require("fjssz_app");

/**
 * 类构造
 */
var FJSSZRoomSet = app.BaseClass.extend({

	/**
  * 初始化
  */
	Init: function Init() {

		this.JS_Name = "FJSSZRoomSet";

		this.ComTool = app[app.subGameName + "_ComTool"]();
		this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
		this.FJSSZSetPos = app[app.subGameName.toUpperCase() + "SetPos"]();

		this.OnReload();
		this.Log("Init");
	},

	OnReload: function OnReload() {
		this.dataInfo = {};
	},

	InitSetInfo: function InitSetInfo(setInfo) {
		var setPosList = setInfo["setPosList"];
		for (var i = 0; i < setPosList.length; i++) {
			this.FJSSZSetPos.OnInitSetPos(setPosList[i]);
		}
		var setEnd = setInfo["setEnd"];
		this.dataInfo = setInfo;
		if (this.dataInfo["state"] == "FJSSZ_GAME_STATUS_RESULT") {
			this.GetSortOutSetEnd(this.dataInfo["rankingResults"]);
		}
	},

	//-----------------------回调函数-----------------------------
	OnInitRoomSetData: function OnInitRoomSetData(setInfo) {
		this.InitSetInfo(setInfo);
		var state = this.dataInfo["state"];

		if (this.ShareDefine.SetStateStringDict.hasOwnProperty(state)) {
			this.dataInfo["state"] = this.ShareDefine.SetStateStringDict[state];
		} else {
			console.error("OnInitRoomSetData state:%s not find", state);
		}
		this.Log("OnInitRoomSetData:", this.dataInfo);
	},

	OnPosLeave: function OnPosLeave(pos) {},
	OnPosContinueGame: function OnPosContinueGame(pos) {
		if (app[app.subGameName.toUpperCase() + "RoomPosMgr"]().GetClientPos() == pos) {
			this.dataInfo["state"] = this.ShareDefine.SetState_Init;
		}
	},
	OnSetZhuangJia: function OnSetZhuangJia(opPos, beiShu) {
		this.dataInfo["opPos"] = opPos;
		this.dataInfo["beiShu"] = beiShu;
	},
	OnSetStart: function OnSetStart(setInfo) {
		this.InitSetInfo(setInfo);
		this.dataInfo["state"] = this.ShareDefine.SetState_Playing;
	},
	OnChangeStatus: function OnChangeStatus(setInfo) {
		this.dataInfo["state"] = this.ShareDefine.SetStateStringDict[setInfo["state"]];
	},

	OnSetEnd: function OnSetEnd(setEnd) {
		this.dataInfo["setEnd"] = setEnd;
		this.dataInfo["state"] = this.ShareDefine.SetState_End;
		this.Log("OnSetEnd:", this.dataInfo);
	},
	GetSortOutSetEnd: function GetSortOutSetEnd(serverPack) {
		var sRankingResult = serverPack;
		//每蹲牌型
		var pCard1 = sRankingResult["pCard1"];
		var pCard2 = sRankingResult["pCard2"];
		var pCard3 = sRankingResult["pCard3"];

		//每蹲得分
		var pCardResult1 = sRankingResult["pCardResult1"];
		var pCardResult2 = sRankingResult["pCardResult2"];
		var pCardResult3 = sRankingResult["pCardResult3"];

		//总分
		// let playerResults = sRankingResult["playerResults"];
		var playerResults = sRankingResult["posResultList"];

		//墩牌
		var rankeds = sRankingResult["rankeds"];

		//牌分
		var simPlayerResult = sRankingResult["simPlayerResult"];

		// let specialResult = sRankingResult["specialResult"];
		var specialResult = sRankingResult["specialResults"];

		for (var i = 0; i < pCard1.length; i++) {
			var card = pCard1[i];
			card["shui"] = pCardResult1[i]["shui"];
			card["baseShui"] = pCardResult1[i]["baseShui"];
			card["extraShui"] = pCardResult1[i]["extraShui"];
			card["protoShui"] = pCardResult1[i]["protoShui"];
			card["cards"] = rankeds[i]["dunPos"]["first"];
			card["isSpecial"] = rankeds[i]["isSpecial"];
		}
		this.SetRoomProperty("pCard1", pCard1);
		for (var j = 0; j < pCard2.length; j++) {
			var _card = pCard2[j];
			_card["shui"] = pCardResult2[j]["shui"];
			_card["baseShui"] = pCardResult2[j]["baseShui"];
			_card["extraShui"] = pCardResult2[j]["extraShui"];
			_card["protoShui"] = pCardResult2[j]["protoShui"];
			_card["cards"] = rankeds[j]["dunPos"]["second"];
			_card["isSpecial"] = rankeds[j]["isSpecial"];
		}
		this.SetRoomProperty("pCard2", pCard2);
		for (var k = 0; k < pCard3.length; k++) {
			var _card2 = pCard3[k];
			_card2["shui"] = pCardResult3[k]["shui"];
			_card2["baseShui"] = pCardResult3[k]["baseShui"];
			_card2["extraShui"] = pCardResult3[k]["extraShui"];
			_card2["protoShui"] = pCardResult3[k]["protoShui"];
			_card2["cards"] = rankeds[k]["dunPos"]["third"];
			_card2["isSpecial"] = rankeds[k]["isSpecial"];
		}
		this.SetRoomProperty("pCard3", pCard3);

		var rewardsDict = {};
		for (var l = 0; l < playerResults.length; l++) {
			var playerResult = playerResults[l];
			var posIdx = playerResult["posIdx"];
			/*let rewards = playerResult["rewards"];
   let score = playerResult["score"];
   let allScore = playerResult["allScore"];
   let roomScore = playerResult["roomScore"];*/
			var shui = playerResult["shui"];
			var sportsPoint = playerResult["sportsPoint"];
			var special = rankeds[l]["special"];
			var isSpecial = rankeds[l]["isSpecial"];
			var simShui = simPlayerResult[l]["shui"];
			var specialShui = specialResult[l]["shui"];
			if (!rewardsDict[posIdx]) {
				rewardsDict[posIdx] = [];
			}
			/*rewardsDict[posIdx]["rewards"] = rewards;
   rewardsDict[posIdx]["score"] = score;
   rewardsDict[posIdx]["allScore"] = allScore;
   rewardsDict[posIdx]["roomScore"] = roomScore;*/
			rewardsDict[posIdx]["shui"] = shui;
			rewardsDict[posIdx]["simShui"] = simShui;
			rewardsDict[posIdx]["specialShui"] = specialShui;
			rewardsDict[posIdx]["special"] = special;
			rewardsDict[posIdx]["isSpecial"] = isSpecial;
			rewardsDict[posIdx]["sportsPoint"] = sportsPoint;
		}
		for (var m = 0; m < rankeds.length; m++) {
			var ranker = rankeds[m];
			var dunPos = ranker["dunPos"];
			var _posIdx = ranker["posIdx"];
			rewardsDict[_posIdx]["dunPos"] = dunPos;
		}
		this.SetRoomProperty("rewardsDict", rewardsDict);
	},
	OnResult: function OnResult(serverPack) {
		this.dataInfo["resultInfo"] = serverPack;
		var sRankingResult = serverPack["sRankingResult"];
		this.GetSortOutSetEnd(sRankingResult);
	},

	//----------------获取接口--------------------

	//获取set属性值
	GetRoomSetProperty: function GetRoomSetProperty(property) {
		if (!this.dataInfo.hasOwnProperty(property)) {
			console.error("GetSetProperty(%s) not find", property);
			return;
		}
		return this.dataInfo[property];
	},
	SetRoomProperty: function SetRoomProperty(key, data) {
		this.dataInfo[key] = data;
	},
	GetRoomSetInfo: function GetRoomSetInfo() {
		return this.dataInfo;
	}

});

var g_FJSSZRoomSet = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_FJSSZRoomSet) g_FJSSZRoomSet = new FJSSZRoomSet();
	return g_FJSSZRoomSet;
};

cc._RF.pop();