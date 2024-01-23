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
	Init: function () {

		this.JS_Name = "FJSSZRoomSet";

		this.ComTool = app[app.subGameName + "_ComTool"]();
		this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
		this.FJSSZSetPos = app[app.subGameName.toUpperCase() + "SetPos"]();

		this.OnReload();
		this.Log("Init");

	},

	OnReload: function () {
		this.dataInfo = {};
	},

	InitSetInfo: function (setInfo) {
		let setPosList = setInfo["setPosList"];
		for (let i = 0; i < setPosList.length; i++) {
			this.FJSSZSetPos.OnInitSetPos(setPosList[i]);
		}
		let setEnd = setInfo["setEnd"];
		this.dataInfo = setInfo;
		if (this.dataInfo["state"] == "FJSSZ_GAME_STATUS_RESULT") {
			this.GetSortOutSetEnd(this.dataInfo["rankingResults"]);
		}
	},


	//-----------------------回调函数-----------------------------
	OnInitRoomSetData: function (setInfo) {
		this.InitSetInfo(setInfo);
		let state = this.dataInfo["state"];

		if (this.ShareDefine.SetStateStringDict.hasOwnProperty(state)) {
			this.dataInfo["state"] = this.ShareDefine.SetStateStringDict[state];
		}
		else {
			console.error("OnInitRoomSetData state:%s not find", state);
		}
		this.Log("OnInitRoomSetData:", this.dataInfo);
	},

	OnPosLeave: function (pos) {

	},
	OnPosContinueGame: function (pos) {
		if (app[app.subGameName.toUpperCase() + "RoomPosMgr"]().GetClientPos() == pos) {
			this.dataInfo["state"] = this.ShareDefine.SetState_Init;
		}
	},
	OnSetZhuangJia: function (opPos, beiShu) {
		this.dataInfo["opPos"] = opPos;
		this.dataInfo["beiShu"] = beiShu;
	},
	OnSetStart: function (setInfo) {
		this.InitSetInfo(setInfo);
		this.dataInfo["state"] = this.ShareDefine.SetState_Playing;
	},
	OnChangeStatus: function (setInfo) {
		this.dataInfo["state"] = this.ShareDefine.SetStateStringDict[setInfo["state"]];
	},

	OnSetEnd: function (setEnd) {
		this.dataInfo["setEnd"] = setEnd;
		this.dataInfo["state"] = this.ShareDefine.SetState_End;
		this.Log("OnSetEnd:", this.dataInfo);
	},
	GetSortOutSetEnd: function (serverPack) {
		let sRankingResult = serverPack;
		//每蹲牌型
		let pCard1 = sRankingResult["pCard1"];
		let pCard2 = sRankingResult["pCard2"];
		let pCard3 = sRankingResult["pCard3"];

		//每蹲得分
		let pCardResult1 = sRankingResult["pCardResult1"];
		let pCardResult2 = sRankingResult["pCardResult2"];
		let pCardResult3 = sRankingResult["pCardResult3"];

		//总分
		// let playerResults = sRankingResult["playerResults"];
		let playerResults = sRankingResult["posResultList"];

		//墩牌
		let rankeds = sRankingResult["rankeds"];

		//牌分
		let simPlayerResult = sRankingResult["simPlayerResult"];

		// let specialResult = sRankingResult["specialResult"];
		let specialResult = sRankingResult["specialResults"];


		for (let i = 0; i < pCard1.length; i++) {
			let card = pCard1[i];
			card["shui"] = pCardResult1[i]["shui"];
			card["baseShui"] = pCardResult1[i]["baseShui"];
			card["extraShui"] = pCardResult1[i]["extraShui"];
			card["protoShui"] = pCardResult1[i]["protoShui"];
			card["cards"] = rankeds[i]["dunPos"]["first"];
			card["isSpecial"] = rankeds[i]["isSpecial"];

		}
		this.SetRoomProperty("pCard1", pCard1);
		for (let j = 0; j < pCard2.length; j++) {
			let card = pCard2[j];
			card["shui"] = pCardResult2[j]["shui"];
			card["baseShui"] = pCardResult2[j]["baseShui"];
			card["extraShui"] = pCardResult2[j]["extraShui"];
			card["protoShui"] = pCardResult2[j]["protoShui"];
			card["cards"] = rankeds[j]["dunPos"]["second"];
			card["isSpecial"] = rankeds[j]["isSpecial"];
		}
		this.SetRoomProperty("pCard2", pCard2);
		for (let k = 0; k < pCard3.length; k++) {
			let card = pCard3[k];
			card["shui"] = pCardResult3[k]["shui"];
			card["baseShui"] = pCardResult3[k]["baseShui"];
			card["extraShui"] = pCardResult3[k]["extraShui"];
			card["protoShui"] = pCardResult3[k]["protoShui"];
			card["cards"] = rankeds[k]["dunPos"]["third"];
			card["isSpecial"] = rankeds[k]["isSpecial"];
		}
		this.SetRoomProperty("pCard3", pCard3);

		let rewardsDict = {};
		for (let l = 0; l < playerResults.length; l++) {
			let playerResult = playerResults[l];
			let posIdx = playerResult["posIdx"];
			/*let rewards = playerResult["rewards"];
			let score = playerResult["score"];
			let allScore = playerResult["allScore"];
			let roomScore = playerResult["roomScore"];*/
			let shui = playerResult["shui"];
			let sportsPoint = playerResult["sportsPoint"];
			let special = rankeds[l]["special"];
			let isSpecial = rankeds[l]["isSpecial"];
			let simShui = simPlayerResult[l]["shui"];
			let specialShui = specialResult[l]["shui"];
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
		for (let m = 0; m < rankeds.length; m++) {
			let ranker = rankeds[m];
			let dunPos = ranker["dunPos"];
			let posIdx = ranker["posIdx"];
			rewardsDict[posIdx]["dunPos"] = dunPos;
		}
		this.SetRoomProperty("rewardsDict", rewardsDict);
	},
	OnResult: function (serverPack) {
		this.dataInfo["resultInfo"] = serverPack;
		let sRankingResult = serverPack["sRankingResult"];
		this.GetSortOutSetEnd(sRankingResult);
	},

	//----------------获取接口--------------------

	//获取set属性值
	GetRoomSetProperty: function (property) {
		if (!this.dataInfo.hasOwnProperty(property)) {
			console.error("GetSetProperty(%s) not find", property);
			return
		}
		return this.dataInfo[property];
	},
	SetRoomProperty:function(key, data){
		this.dataInfo[key] = data;
	},
	GetRoomSetInfo: function () {
		return this.dataInfo
	},

});

var g_FJSSZRoomSet = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_FJSSZRoomSet)
		g_FJSSZRoomSet = new FJSSZRoomSet();
	return g_FJSSZRoomSet;
};
