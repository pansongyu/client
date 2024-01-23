"use strict";
cc._RF.push(module, '1879drx1H5Ot74wo6m2wQDx', 'GameManager');
// script/dbmanager/Game/GameManager.js

"use strict";

/*
 GameManager 游戏管理
 */
var app = require('app');

var GameManager = app.BaseClass.extend({

	Init: function Init() {
		this.JS_Name = "GameManager";

		this.NetManager = app.NetManager();
		this.ShareDefine = app.ShareDefine();

		// this.NetManager.RegNetPack("room.CBaseEnterRoom", this.OnPack_EnterRoom, this);
		this.NetManager.RegNetPack("SPlayer_Address", this.OnPack_PlayerAddress, this);
		// //2017.8.8  消息抽出来走公共
		// //继续游戏
		// this.NetManager.RegNetPack("SBase_PosContinueGame", this.OnPack_PosContinueGame, this); 
		// //解散房间
		// this.NetManager.RegNetPack("SBase_Dissolve", this.OnPack_DissolveRoom, this); 
		// //解散投票
		// this.NetManager.RegNetPack("SBase_StartVoteDissolve", this.OnPack_StartVoteDissolve, this);


		// //修改人数投票
		// this.NetManager.RegNetPack("SBase_ChangePlayerNum", this.OnPack_ChangePlayerNum, this);
		// //修改人数投票同意
		// this.NetManager.RegNetPack("SBase_ChangePlayerNumAgree", this.OnPack_ChangePlayerNumAgree, this); 
		// //房间修改人数
		// this.NetManager.RegNetPack("SBase_ChangeRoomNum", this.OnPack_ChangeRoomNum, this); 

		// //玩家准备
		// this.NetManager.RegNetPack("SBase_PosReadyChg", this.OnPack_PosReadyChg, this);
		// //玩家离开
		// this.NetManager.RegNetPack("SBase_PosLeave", this.OnPack_PosLeave, this); 
		// //玩家位置更新
		// this.NetManager.RegNetPack("SBase_PosUpdate", this.OnPack_PosUpdate, this);  
		// //玩家掉线
		// this.NetManager.RegNetPack("SBase_LostConnect", this.OnPack_LostConnect, this);

		// this.NetManager.RegNetPack("SBase_PosDealVote", this.OnPack_PosDealVote, this); 
		// //所有对局记录
		// this.NetManager.RegNetPack("game.CPlayerSetRoomRecord", this.OnPack_EveryGameRecord, this);

		this.NetManager.RegNetPack("game.C1101GetRoomID", this.OnPack_LoginGetCurRoomID, this);
		this.NetManager.RegNetPack("SRoom_ContinueRoomInfo", this.OnPack_ContinueRoomInfo, this);
		this.NetManager.RegNetPack("SBase_RoomCrammed", this.OnPack_RoomCrammed, this);

		//普通房间创建房间改成异步
		this.NetManager.RegNetPack("MqResponseBo", this.OnPack_MqResponseBo, this);
		// //洗牌
		// this.NetManager.RegNetPack("SPlayer_XiPai",this.OnPack_XiPai,this);
		// //赠送礼物
		// this.NetManager.RegNetPack("SPlayer_SendGift",this.OnPack_Gitf,this);


		this.bIsAutoPlayIng = false;

		this.bGetRoomIDByUI = false;
		this.xiPaiList = [];
		this.OnReload();

		this.Log("Init");
	},
	SetGetRoomIDByUI: function SetGetRoomIDByUI(bGet) {
		this.bGetRoomIDByUI = bGet;
	},
	//发送聊天封包
	SendChat: function SendChat(type, quickID, roomID, content) {
		this.NetManager.SendPack("game.C1104Chat", { "type": type, "quickID": quickID, "targetID": roomID, "content": content });
	},
	//切换账号
	OnReload: function OnReload() {},
	OnPack_MqResponseBo: function OnPack_MqResponseBo(event) {
		var code = event.result.code;
		if (code == 0) {
			var serverPack = event.result.data;
			var gameType = serverPack.gameType;
			console.log("OnPack_MqResponseBo serverPack:" + JSON.stringify(serverPack));
			console.log("OnPack_MqResponseBo gameType:" + gameType);
			var name = app.ShareDefine().GametTypeID2PinYin[gameType];
			console.log("OnPack_MqResponseBo name:" + name);
			app.Client.EnterSubGame(name, null, serverPack.roomKey);
		} else if (code == 903) {
			var desc = app.SysNotifyManager().GetSysMsgContentByMsgID("MSG_NotRoomCard");
			app.ConfirmManager().SetWaitForConfirmForm(this.OnConFirm.bind(this), "goBuyCard", []);
			app.FormManager().ShowForm("UIMessage", null, this.ShareDefine.ConfirmBuyGoTo, 0, 0, desc);
		} else if (code == 5021) {
			var cityId = parseInt(event.result.msg);
			var selectCityConfig = app.SysDataManager().GetTableDict("selectCity");
			var cityInfo = selectCityConfig[cityId];
			if (cityInfo) {
				this.SetWaitForConfirm('RESELECT_CITY', this.ShareDefine.Confirm, [], [cityId], "该游戏是在[" + cityInfo.Name + "]，是否切换到该城市后再加入房间");
			}
		} else {
			if (code == 5023) {
				var dataDict = JSON.parse(event.result.msg);
				app.SysNotifyManager().ShowSysMsg('密码错误或已失效,请重新输入', [], 3);
				localStorage.setItem("password_" + dataDict.clubId + "_" + dataDict.tagId, "");
			} else if (code == 5024) {
				app.SysNotifyManager().ShowSysMsg("您所在的推广员队伍或上级队伍比赛分低于预警值，无法加入比赛，请联系管理");
			} else if (code == 5027) {
				app.SysNotifyManager().ShowSysMsg("当前赛事正在更换赛事主裁判，暂停游戏，请稍后再试！预计半小时");
			} else if (code == 5133) {
				app.SysNotifyManager().ShowSysMsg("您所在的亲友圈比赛分低于预警值，无法加入比赛，请联系管理");
			} else if (code == 6117) {
				app.SysNotifyManager().ShowSysMsg("您已被禁止游戏", [], 3);
			} else if (code == 911) {
				app.SysNotifyManager().ShowSysMsg("房卡不足", [], 3);
			} else if (code == 5126) {
				app.FormManager().ShowForm("UIMessageGps");
			} else if (code == 304) {
				app.SysNotifyManager().ShowSysMsg("房间已经开始了", [], 3);
			} else if (code == 301) {
				app.SysNotifyManager().ShowSysMsg("没找到这个房间", [], 3);
				if (app.FormManager().GetFormComponentByFormName("UINewMain")) {
					app.FormManager().GetFormComponentByFormName("UINewMain").Event_OutRoom();
				}
			} else {
				app.SysNotifyManager().ShowSysMsg(event.result.msg, [], 3);
			}
		}
	},
	//------------封包函数------------------
	OnPack_PlayerAddress: function OnPack_PlayerAddress(serverPack) {
		app.Client.OnEvent("EVT_PlayerAddress", serverPack);
	},

	SetPlayGame: function SetPlayGame(serverPack) {
		var gameType = serverPack['gameType'];
		var custom = serverPack['custom'];
	},
	NowRoom: function NowRoom() {},
	OnPack_RoomCrammed: function OnPack_RoomCrammed(serverPack) {
		this.gameId = serverPack.gameId;
		this.roomID = serverPack.roomID;
		var gameName = app.ShareDefine().GametTypeID2Name[this.gameId];
		if (typeof serverPack.roomName != "undefined") {
			if (serverPack.roomName != "") {
				gameName = serverPack.roomName;
			}
		}
		this.SetWaitForConfirm('MSG_CLUB_ROOMCRAMMED', this.ShareDefine.Confirm, [gameName], []);
	},
	/**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
	SetWaitForConfirm: function SetWaitForConfirm(msgID, type) {
		var msgArg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
		var cbArg = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

		var ConfirmManager = app.ConfirmManager();
		ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
		ConfirmManager.ShowConfirm(type, msgID, msgArg);
	},
	OnConFirm: function OnConFirm(clickType, msgID, backArgList) {
		if (clickType != "Sure") {
			if ('MSG_CLUB_ROOMCRAMMED' == msgID) {
				//退出房间
				var gamePY = app.ShareDefine().GametTypeID2PinYin[this.gameId];
				app.NetManager().SendPack("room.CBaseExitRoom", { "roomID": this.roomID }, function (success) {
					//正常退出房间，通知大厅跟亲友圈首页
					app.Client.OnEvent("OutRoom", {});
				}, function (error) {});
			}
			return;
		}
		if (msgID == "RESELECT_CITY") {
			var self = this;
			var selectCityConfig = app.SysDataManager().GetTableDict("selectCity");
			if (selectCityConfig[backArgList[0]]["Type"] != 3) {
				this.ShowSysMsg("需指定县级市，才能进入游戏");
				app.FormManager().ShowForm("UISelectCity");
				return;
			}
			//根据选择的城市向服务端请求所有游戏
			app.NetManager().SendPack("room.CBaseGameIdList", { "selectCityId": backArgList[0] }, function (event) {
				self.allGameIdFormServer = event.split(",");
				var curGameList = self.GetAllGameId();
				var argDict = {
					"gameList": curGameList
				};
				self.OnEvent("ShowGameListByLocation", argDict);
			}, function (event) {
				console.log("获取游戏id失败");
			});
		} else if ("goBuyCard" == msgID) {
			var clientConfig = app.Client.GetClientConfig();
			if (app.PackDefine.APPLE_CHECK == clientConfig["appPackType"]) return;
			app.FormManager().ShowForm("UIStore");
			app.FormManager().CloseForm("UIJoin");
			app.FormManager().CloseForm("UIChouJiang");
			return;
		} else if ('MSG_CLUB_ROOMCRAMMED' == msgID) {
			var curGameTypeStr = app.ShareDefine().GametTypeID2PinYin[this.gameId];
			app.Client.SetGameType(curGameTypeStr);
			app.FormManager().ShowForm("UIDownLoadGame", curGameTypeStr, 0, null, 0, 0, true);
		}
	},
	OnPack_ContinueRoomInfo: function OnPack_ContinueRoomInfo(serverPack) {
		app.FormManager().ShowForm('UIMessageJoin', serverPack);
	},
	//位置继续游戏
	OnPack_PosContinueGame: function OnPack_PosContinueGame(serverPack) {
		var roomID = serverPack["roomID"];
		var pos = serverPack["pos"];
		var gameTypeString = serverPack.gameType;
		this.NowRoom().OnPosContinueGame(pos);
		app.Client.OnEvent(gameTypeString + "_PosContinueGame", serverPack);
		//公共头像触发
		app.Client.OnEvent("PosContine", serverPack);
	},
	//解散房间
	OnPack_DissolveRoom: function OnPack_DissolveRoom(serverPack) {
		var roomID = serverPack["roomID"];
		var ownnerForce = serverPack["ownnerForce"];
		var gameTypeString = serverPack.gameType;
		app.Client.OnEvent(gameTypeString + "_DissolveRoom", serverPack);
	},
	//接收到解散请求
	OnPack_StartVoteDissolve: function OnPack_StartVoteDissolve(serverPack) {
		var roomID = serverPack["roomID"];
		var createPos = serverPack["createPos"];
		var endSec = serverPack["endSec"];
		var gameTypeString = serverPack.gameType;
		var dissolveInfo = this.NowRoom().OnStartVoteDissolve(createPos, endSec);
		app.Client.OnEvent(gameTypeString + "_StartVoteDissolve", dissolveInfo);
	},
	//接收人数修改请求
	OnPack_ChangePlayerNum: function OnPack_ChangePlayerNum(serverPack) {
		var roomID = serverPack["roomID"];
		var createPos = serverPack["createPos"];
		var endSec = serverPack["endSec"];
		var gameTypeString = serverPack.gameType;
		var playerNum = serverPack.playerNum;
		var dissolveInfo = this.NowRoom().OnStartChangePlaeryDissolve(createPos, playerNum, endSec);
		app.Client.OnEvent(gameTypeString + "_ChangePlayerNum", dissolveInfo);
	},

	//位置是否准备
	OnPack_PosReadyChg: function OnPack_PosReadyChg(serverPack) {
		var roomID = serverPack["roomID"];
		var pos = serverPack["pos"];
		var isReady = serverPack["isReady"];
		var gameTypeString = serverPack.gameType;
		if (this.NowRoom().GetRoomPosMgr().OnPosReadyChg(pos, isReady)) {
			app.Client.OnEvent(gameTypeString + "_PosReadyChg", serverPack);
		} else {
			this.Log("OnPack_PosReadyChg:", serverPack);
		}
	},
	//位置离开房间
	OnPack_PosLeave: function OnPack_PosLeave(serverPack) {
		var roomID = serverPack["roomID"];
		var pos = serverPack["pos"];
		var room = this.NowRoom();
		var ownerID = serverPack["ownerID"];
		var selfPos = -1;
		if (room) {
			selfPos = room.GetRoomPosMgr().GetClientPos();
			room.OnPosLeave(pos);
			if (ownerID > 0) {
				room.UpdateOwnerID(ownerID);
			}
		}
		var gameTypeString = serverPack.gameType;
		app.Client.OnEvent(gameTypeString + "_PosLeave", serverPack);
		if (pos == selfPos) app.Client.OnEvent('ExitRoomSuccess', serverPack);
	},
	//更新座位信息
	OnPack_PosUpdate: function OnPack_PosUpdate(serverPack) {
		var roomID = serverPack["roomID"];
		var pos = serverPack["pos"];
		var posInfo = serverPack["posInfo"];
		this.SetPlayGame(serverPack);
		var gameTypeString = serverPack.gameType;
		if (this.NowRoom().GetRoomPosMgr().OnPosUpdate(pos, posInfo)) {
			app.Client.OnEvent(gameTypeString + "_PosUpdate", serverPack);
		} else {
			this.Log("OnPack_PosUpdate:", serverPack);
		}
	},
	//有玩家掉线
	OnPack_LostConnect: function OnPack_LostConnect(serverPack) {
		var isLostConnect = serverPack["isLostConnect"];
		var pid = serverPack["pid"];
		var RoomPosMgr = this.NowRoom().GetRoomPosMgr();
		var roomPosMgrInfo = RoomPosMgr.GetRoomAllPlayerInfo();
		var roomPosMgrInfoKeyList = Object.keys(roomPosMgrInfo);
		var count = roomPosMgrInfoKeyList.length;
		for (var i = 0; i < count; i++) {
			var posID = roomPosMgrInfoKeyList[i];
			var player = roomPosMgrInfo[posID];
			if (pid == player["pid"]) {
				RoomPosMgr.SetPlayerOfflineState(posID, isLostConnect);
				break;
			}
		}
		app.Client.OnEvent("PlayerOffline", serverPack);
	},
	//位置更新解散
	OnPack_PosDealVote: function OnPack_PosDealVote(serverPack) {
		var roomID = serverPack["roomID"];
		var pos = serverPack["pos"];
		var agreeDissolve = serverPack["agreeDissolve"];
		var dissolveInfo = this.NowRoom().OnPosDealVote(pos, agreeDissolve);
		var gameTypeString = serverPack.gameType;
		app.Client.OnEvent("PosDealVote", dissolveInfo);
	},

	//位置更新解散
	OnPack_ChangePlayerNumAgree: function OnPack_ChangePlayerNumAgree(serverPack) {
		var roomID = serverPack["roomID"];
		var pos = serverPack["pos"];
		var agreeDissolve = serverPack["agreeChange"];
		var dissolveInfo = this.NowRoom().ChangePlayerNumAgree(pos, agreeDissolve);
		var gameTypeString = serverPack.gameType;
		app.Client.OnEvent("PosChangePlayerDealVote", dissolveInfo);
	},

	OnPack_ChangeRoomNum: function OnPack_ChangeRoomNum(serverPack) {
		this.OnPack_EnterRoom(serverPack);
	},

	//房间key查找完成
	OnPack_EnterRoom: function OnPack_EnterRoom(serverPack) {
		//let familyID = serverPack.familyID;
		var roomID = serverPack.roomID;
		var gameTypeString = serverPack.gameType;
		var gameType = this.ShareDefine.GametTypeNameDict[gameTypeString];
	},
	//获取所有对局记录
	// OnPack_EveryGameRecord:function(serverPack){
	// 	let nowroom=this.NowRoom();
	// 	if(nowroom){
	// 		nowroom.SetGameRecord(true);
	// 	}
	//     app.Client.OnEvent("GameRecord", serverPack);
	// },
	OnPack_LoginGetCurRoomID: function OnPack_LoginGetCurRoomID(serverPack) {
		if (!this.bGetRoomIDByUI) {
			app.Client.OnEvent("LoginGetCurRoomID", serverPack);
		} else {
			app.Client.OnEvent("GetCurRoomID", serverPack);
		}

		this.bGetRoomIDByUI = false;
	},
	//洗牌
	OnPack_XiPai: function OnPack_XiPai(serverPack) {
		var nowroom = this.NowRoom();
		var playerAll = nowroom.GetRoomPosMgr().GetRoomAllPlayerInfo();
		var playerAllList = Object.keys(playerAll);
		var playerInfo = null;
		for (var i = 0; i < playerAllList.length; i++) {
			playerInfo = playerAll[playerAllList[i]];
			if (playerInfo.pid == serverPack.pid) {
				this.xiPaiList.push(playerInfo.name);
				// app.SysNotifyManager().ShowSysMsg('SSS_XIPAI_SUCCESS',[playerInfo.name]);
				if (app.HeroManager().GetHeroProperty("pid") == serverPack.pid) {
					app.Client.OnEvent("Event_XiPai", serverPack);
				}
				break;
			}
		}
		var cType = serverPack.cType;
		if ('PK' == cType) {
			app.FormManager().ShowForm('UIXiPai');
		} else {
			app.FormManager().ShowForm('game/base/ui/majiang/UIMJXiPai');
		}
	},
	OnPack_Gitf: function OnPack_Gitf(serverPack) {
		app.Client.OnEvent("GameGift", serverPack);
	},
	//--------------获取接口------------------------
	GetXiPaiList: function GetXiPaiList() {
		return this.xiPaiList;
	},
	RemoveOneXiPaiPlayer: function RemoveOneXiPaiPlayer() {
		if (0 == this.xiPaiList.length) return;
		this.xiPaiList.splice(0, 1);
	},
	//---------------发包接口------------------------
	//进入房间
	SendEnterRoom: function SendEnterRoom(roomKey) {
		this.NetManager.SendPack("room.CBaseEnterRoom", { "roomKey": roomKey, "posID": -1 });
	},
	IsFristPlay: function IsFristPlay() {},

	IsAutoPlayIng: function IsAutoPlayIng() {
		return this.bIsAutoPlayIng;
	},
	SetAutoPlayIng: function SetAutoPlayIng(bValue) {
		this.bIsAutoPlayIng = bValue;
	},

	//游戏公用消息
	//登录获取当前进入的房间ID
	SendGetCurRoomID: function SendGetCurRoomID() {
		this.NetManager.SendPack("game.C1101GetRoomID", {});
	},
	//发送继续游戏
	SendContinueGame: function SendContinueGame(roomID) {
		this.NetManager.SendPack("room.CBaseContinueGame", { "roomID": roomID });
	},
	//解散房间
	SendDissolveRoom: function SendDissolveRoom(roomID) {
		this.NetManager.SendPack("room.CBaseDissolveRoom", { "roomID": roomID });
	},
	//发送同意解散房间
	SendDissolveRoomAgree: function SendDissolveRoomAgree(roomID) {
		this.NetManager.SendPack("room.CBaseDissolveRoomAgree", { "roomID": roomID });
	},

	//发送拒绝解散房间
	SendDissolveRoomRefuse: function SendDissolveRoomRefuse(roomID) {
		this.NetManager.SendPack("room.CBaseDissolveRoomRefuse", { "roomID": roomID });
	},

	//发送同意修改人数
	SendChangePlayerAgree: function SendChangePlayerAgree(roomID) {
		this.NetManager.SendPack("room.CBaseChangePlayerNumAgree", { "roomID": roomID, "agree": 1 });
	},

	//发送拒绝修改人数
	SendChangePlayerRefuse: function SendChangePlayerRefuse(roomID) {
		this.NetManager.SendPack("room.CBaseChangePlayerNumAgree", { "roomID": roomID, "agree": 2 });
	},

	//退出房间
	SendExitRoom: function SendExitRoom(roomID, pos) {
		this.NetManager.SendPack("room.CBaseExitRoom", { "roomID": roomID, "posIndex": pos });
	},
	//位置发送准备状态
	SendReady: function SendReady(roomID, posIndex) {
		this.NetManager.SendPack("room.CBaseReadyRoom", { "roomID": roomID, "posIndex": posIndex });
	},

	//发送取消准备状态
	SendUnReady: function SendUnReady(roomID, posIndex) {
		this.NetManager.SendPack("room.CBaseUnReadyRoom", { "roomID": roomID, "posIndex": posIndex });
	},

	//房主T人
	SendKickPosIndex: function SendKickPosIndex(roomID, posIndex) {
		this.NetManager.SendPack("room.CBaseKickRoom", { "roomID": roomID, "posIndex": posIndex });
	},

	//洗牌
	SendXiPai: function SendXiPai(roomID) {
		this.NetManager.SendPack("room.CBaseRoomXiPai", { "roomID": roomID });
	}
});

var g_GameManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_GameManager) {
		g_GameManager = new GameManager();
	}
	return g_GameManager;
};

cc._RF.pop();