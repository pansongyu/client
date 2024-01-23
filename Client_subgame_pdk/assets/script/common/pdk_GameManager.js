/*
 GameManager 游戏管理
 */
var app = require("pdk_app");

var pdk_GameManager = app.BaseClass.extend({

	Init:function(){
		this.JS_Name = app.subGameName + "_GameManager";

		this.NetManager = app[app.subGameName + "_NetManager"]();
		this.ShareDefine = app[app.subGameName + "_ShareDefine"]();


		this.NetManager.RegNetPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "EnterRoom", this.OnPack_EnterRoom, this);
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_Trusteeship", this.OnPack_AutoStart, this);
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_Address", this.OnPack_PlayerAddress, this);
		//2017.8.8  消息抽出来走公共
		//继续游戏
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_PosContinueGame", this.OnPack_PosContinueGame, this); 
		//解散房间
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_Dissolve", this.OnPack_DissolveRoom, this); 
		//解散投票
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_StartVoteDissolve", this.OnPack_StartVoteDissolve, this);


		//修改人数投票
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_ChangePlayerNum", this.OnPack_ChangePlayerNum, this);
		//修改人数投票同意
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_ChangePlayerNumAgree", this.OnPack_ChangePlayerNumAgree, this); 
		//房间修改人数
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_ChangeRoomNum", this.OnPack_ChangeRoomNum, this); 

		//玩家准备
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_PosReadyChg", this.OnPack_PosReadyChg, this);
		//玩家离开
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_PosLeave", this.OnPack_PosLeave, this); 
		//玩家位置更新
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_PosUpdate", this.OnPack_PosUpdate, this);  
		//玩家掉线
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_LostConnect", this.OnPack_LostConnect, this);

		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_PosDealVote", this.OnPack_PosDealVote, this); 
		//所有对局记录
		this.NetManager.RegNetPack("game.CPlayerSetRoomRecord", this.OnPack_EveryGameRecord, this);

		this.NetManager.RegNetPack("game.C1101GetRoomID", this.OnPack_LoginGetCurRoomID, this);
		//洗牌
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_XiPai",this.OnPack_XiPai,this);
		//赠送礼物
		this.NetManager.RegNetPack("S" + app.subGameName.toUpperCase() + "_SendGift",this.OnPack_Gitf,this);

		this.NetManager.RegNetPack("MqResponseBo",this.OnPack_MqResponseBo,this);

		this.NetManager.RegNetPack("SRoom_ContinueRoomInfo",this.OnPack_ContinueRoomInfo,this);
		
		this.bIsAutoPlayIng = false;

		this.bGetRoomIDByUI = false;
		this.xiPaiList = [];
		this.OnReload();
	},

	OnPack_ContinueRoomInfo:function(serverPack){
		app[app.subGameName + "_FormManager"]().ShowForm(app.subGameName + '_UIMessageJoin',serverPack);
	},

	
	OnPack_MqResponseBo:function(event){
		let code=event.result.code;
		if(code==0){
			let serverPack=event.result.data;
            app[app.subGameName + "Client"].clientConfig.GameServerIP=serverPack.gameTypeUrl.gameServerIP;
            app[app.subGameName + "Client"].clientConfig.GameServerPort=serverPack.gameTypeUrl.gameServerPort;
            app[app.subGameName+"_NetWork"]().isReconnecting=true;  //标记为正在重新连接，让发送消息堆积多发送队列
            app[app.subGameName.toUpperCase()+"RoomMgr"]().SendGetRoomInfo(serverPack.roomID); //加入获取消息到队列
            //关闭游戏的UI
            app[app.subGameName + "_FormManager"]().CloseForm("game/"+app.subGameName.toUpperCase()+"/UI"+app.subGameName.toUpperCase()+"_Play");
            app[app.subGameName + "_FormManager"]().CloseForm("game/"+app.subGameName.toUpperCase()+"/UI"+app.subGameName.toUpperCase()+"_LPPlay");
            app[app.subGameName + "_FormManager"]().CloseForm("game/"+app.subGameName.toUpperCase()+"/UI"+app.subGameName.toUpperCase()+"_SYPlay");
            app[app.subGameName + "_FormManager"]().CloseForm(app.subGameName+"_UIPublic_Record");
            app[app.subGameName + "_FormManager"]().CloseForm(app.subGameName+"_UILPPublic_Record");
            //关闭游戏的UI
            app[app.subGameName+"_NetWork"]().Disconnect(true);			//断开连接
            app[app.subGameName+"_NetWork"]().UpdateAccessPoint();   //更新连接节点
            app[app.subGameName+"_NetWork"]().Connect();			//发起重新连接服务器
    	}
	},


	SetGetRoomIDByUI:function(bGet){
		this.bGetRoomIDByUI = bGet;
	},
	//发送聊天封包
	SendChat:function (type, quickID, roomID, content) {
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "Chat", {"type":type, "quickID":quickID, "targetID":roomID, "content":content});
	},
	//切换账号
	OnReload:function(){
	},

	//------------封包函数------------------
	OnPack_PlayerAddress:function(serverPack){
		app[app.subGameName + "Client"].OnEvent("EVT_PlayerAddress", serverPack);
	},

	SetPlayGame:function(serverPack){
		let gameType = serverPack['gameType'];
		let custom = serverPack['custom'];
	},
	NowRoom:function(){
		return app[app.subGameName.toUpperCase()+"Room"]();
	},
	//位置继续游戏
	OnPack_PosContinueGame:function(serverPack){
		let roomID = serverPack["roomID"];
		let pos = serverPack["pos"];
		this.NowRoom().OnPosContinueGame(pos);
		app[app.subGameName + "Client"].OnEvent(app.subGameName.toUpperCase()+"_PosContinueGame", serverPack);
		//公共头像触发
		app[app.subGameName + "Client"].OnEvent("PosContine", serverPack);
	},
	//解散房间
	OnPack_DissolveRoom:function(serverPack){
		let roomID = serverPack["roomID"];
		let ownnerForce = serverPack["ownnerForce"];
		app[app.subGameName + "Client"].OnEvent(app.subGameName.toUpperCase()+"_DissolveRoom", serverPack);
	},
	//接收到解散请求
	OnPack_StartVoteDissolve:function(serverPack){
		let roomID = serverPack["roomID"];
		let createPos = serverPack["createPos"];
		let endSec = serverPack["endSec"];
		let dissolveInfo = this.NowRoom().OnStartVoteDissolve(createPos, endSec);
		app[app.subGameName + "Client"].OnEvent(app.subGameName.toUpperCase()+"_StartVoteDissolve", dissolveInfo);
	},
	//接收人数修改请求
	OnPack_ChangePlayerNum:function(serverPack){
		let roomID = serverPack["roomID"];
		let createPos = serverPack["createPos"];
		let endSec = serverPack["endSec"];
		let playerNum=serverPack.playerNum;
		let dissolveInfo = this.NowRoom().OnStartChangePlaeryDissolve(createPos,playerNum,endSec);
		app[app.subGameName + "Client"].OnEvent(app.subGameName.toUpperCase()+"_ChangePlayerNum", dissolveInfo);
	},


	//位置是否准备
	OnPack_PosReadyChg:function(serverPack){
		let roomID = serverPack["roomID"];
		let pos = serverPack["pos"];
		let isReady = serverPack["isReady"];
		if(this.NowRoom().GetRoomPosMgr().OnPosReadyChg(pos, isReady)){
			app[app.subGameName + "Client"].OnEvent(app.subGameName.toUpperCase()+"_PosReadyChg", serverPack);
		}
		else{
			// this.Log("OnPack_PosReadyChg:", serverPack);
		}
	},
	//位置离开房间
	OnPack_PosLeave:function(serverPack){
		let roomID = serverPack["roomID"];
		let pos = serverPack["pos"];
		let room = this.NowRoom();
		let ownerID=serverPack["ownerID"];
		let selfPos = -1;
		if(room){
			selfPos = room.GetRoomPosMgr().GetClientPos();
			room.OnPosLeave(pos);
			if(ownerID>0){
				room.UpdateOwnerID(ownerID);
			}
		}
		app[app.subGameName + "Client"].OnEvent(app.subGameName.toUpperCase()+"_PosLeave", serverPack);
		if(pos == selfPos && !serverPack["beKick"]){
            app[app.subGameName + "Client"].OnEvent('ExitRoomSuccess', serverPack);
        }
	},
	//更新座位信息
	OnPack_PosUpdate:function(serverPack){
		let roomID = serverPack["roomID"];
		let pos = serverPack["pos"];
		let posInfo = serverPack["posInfo"];
		this.SetPlayGame(serverPack);
		if(this.NowRoom().GetRoomPosMgr().OnPosUpdate(pos, posInfo)){
			app[app.subGameName + "Client"].OnEvent(app.subGameName.toUpperCase()+"_PosUpdate", serverPack);
		}
		else{
			this.Log("OnPack_PosUpdate:", serverPack);
		}

	},
	//有玩家掉线
    OnPack_LostConnect:function (serverPack) {
		let isLostConnect = serverPack["isLostConnect"];
		let isShowLeave = serverPack["isShowLeave"];
		let pid = serverPack["pid"];
		let RoomPosMgr = this.NowRoom().GetRoomPosMgr();
		let roomPosMgrInfo = RoomPosMgr.GetRoomAllPlayerInfo();
		let roomPosMgrInfoKeyList = Object.keys(roomPosMgrInfo);
		let count = roomPosMgrInfoKeyList.length;
		for(let i = 0; i < count; i++){
			let posID = roomPosMgrInfoKeyList[i];
			let player = roomPosMgrInfo[posID];
			if(pid == player["pid"]){
                RoomPosMgr.SetPlayerOfflineState(posID, isLostConnect, isShowLeave);
				break
			}
		}
        app[app.subGameName + "Client"].OnEvent("PlayerOffline", serverPack);
    },
    //位置更新解散
	OnPack_PosDealVote:function(serverPack){
		let roomID = serverPack["roomID"];
		let pos = serverPack["pos"];
		let agreeDissolve = serverPack["agreeDissolve"];
		let dissolveInfo = this.NowRoom().OnPosDealVote(pos, agreeDissolve);
		app[app.subGameName + "Client"].OnEvent("PosDealVote", dissolveInfo);
	},


	 //位置更新解散
	OnPack_ChangePlayerNumAgree:function(serverPack){
		let roomID = serverPack["roomID"];
		let pos = serverPack["pos"];
		let agreeDissolve = serverPack["agreeChange"];
		let dissolveInfo = this.NowRoom().ChangePlayerNumAgree(pos, agreeDissolve);
		app[app.subGameName + "Client"].OnEvent("PosChangePlayerDealVote", dissolveInfo);
	},

	OnPack_ChangeRoomNum:function(serverPack){
		app[app.subGameName + "_FormManager"]().CloseForm(app.subGameName + "_UIMessage03");
		this.OnPack_EnterRoom(serverPack);
	},

	//房间key查找完成
	OnPack_EnterRoom:function(serverPack){
		let roomID = serverPack.roomID;
	    app[app.subGameName + "Client"].SetGameType(app.subGameName);
		app[app.subGameName.toUpperCase()+"RoomMgr"]().SendGetRoomInfo(roomID);
	},
	//获取所有对局记录
    OnPack_EveryGameRecord:function(serverPack){
    	let nowroom=this.NowRoom();
    	if(nowroom){
    		nowroom.SetGameRecord(true);
    	}
        app[app.subGameName + "Client"].OnEvent("GameRecord", serverPack);
    },
    OnPack_LoginGetCurRoomID:function(serverPack){
    	if(!this.bGetRoomIDByUI)
    		app[app.subGameName + "Client"].OnEvent("LoginGetCurRoomID", serverPack);
    	else
    		app[app.subGameName + "Client"].OnEvent("GetCurRoomID", serverPack);

    	this.bGetRoomIDByUI = false;
    },
    //洗牌
    OnPack_XiPai:function(serverPack){
		let nowroom=this.NowRoom();
		let playerAll = nowroom.GetRoomPosMgr().GetRoomAllPlayerInfo();
		let playerAllList= Object.keys(playerAll);
        var playerInfo = null;
        for(var i=0;i<playerAllList.length;i++){
			playerInfo = playerAll[playerAllList[i]];
			if(playerInfo.pid == serverPack.pid){
				this.xiPaiList.push(playerInfo.name);
				// app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg(app.subGameName.toUpperCase()+'_XIPAI_SUCCESS',[playerInfo.name]);
				if(app[app.subGameName + "_HeroManager"]().GetHeroProperty("pid") == serverPack.pid){
					app[app.subGameName + "Client"].OnEvent("Event_XiPai", serverPack);
				}
				break;
			}
		}
		let cType = serverPack.cType;
		if('PK' == cType){	
			app[app.subGameName + "_FormManager"]().ShowForm('game/'+app.subGameName.toUpperCase()+'/'+app.subGameName+'_UIXiPai');
		}
		else{
			app[app.subGameName + "_FormManager"]().ShowForm('game/base/ui/majiang/UIMJXiPai');
		}
	},
	OnPack_Gitf:function(serverPack){
		app[app.subGameName + "Client"].OnEvent("GameGift", serverPack);
	},
	//--------------获取接口------------------------
	GetXiPaiList:function(){
		return this.xiPaiList;
	},
	RemoveOneXiPaiPlayer:function(){
		if(0==this.xiPaiList.length)
			return;
		this.xiPaiList.splice(0,1);
	},
	//---------------发包接口------------------------
	//进入房间
	SendEnterRoom:function(roomKey){
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "EnterRoom", {"roomKey":roomKey,"posID":-1});
	},
	IsFristPlay:function(){
		let RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
		let state = RoomMgr.GetEnterRoom().GetRoomProperty("state");
		return state != 0 ? true : false;
	},
	
	IsAutoPlayIng:function(){
		return this.bIsAutoPlayIng;
	},
	SetAutoPlayIng:function(bValue){
		this.bIsAutoPlayIng = bValue;
	},
	OnPack_AutoStart:function(serverPack){
		app[app.subGameName + "Client"].OnEvent('SPlayer_Trusteeship', serverPack);
        let roomID = serverPack["roomID"];
        let pos = serverPack["pos"];
        let isAuto = serverPack["trusteeship"];
        let pid = serverPack["pid"];
        let heroID = app[app.subGameName + "_HeroManager"]().GetHeroProperty("pid");
        console.log("===============托管时间=================", serverPack.secTotal + "秒");

        let RoomMgr = app[app.subGameName.toUpperCase()+"RoomMgr"]();
        let RoomPosMgr = RoomMgr.GetEnterRoom().GetRoomPosMgr();
        if(pos == RoomPosMgr.GetClientPos() && heroID == pid){
            if(!isAuto){
                this.bIsAutoPlayIng = false;
                app[app.subGameName + "_FormManager"]().CloseForm(app.subGameName + "_UIAutoPlay");
            }
            else{
            	if(this.ShareDefine.isCoinRoom && app[app.subGameName + "_SceneManager"]().GetSceneType() == app.subGameName + "MainScene"){
                	app[app.subGameName + "_FormManager"]().CloseForm(app.subGameName + "_UIAutoPlay");
                	this.bIsAutoPlayIng = false;
            	}
            	else{
            		this.bIsAutoPlayIng = true;
            		app[app.subGameName + "_FormManager"]().ShowForm(app.subGameName + "_UIAutoPlay", serverPack.secTotal);
            	}
            }
        }
    },
	CancelAutoPlay:function(){
		this.bIsAutoPlayIng = false;
        let RoomMgr = app[app.subGameName.toUpperCase()+"RoomMgr"]();
        let room = RoomMgr.GetEnterRoom();
        let roomID = room.GetRoomProperty("roomID");
        let key = room.GetRoomProperty("key");
        let heroID = app[app.subGameName + "_HeroManager"]().GetHeroProperty("pid");
        let sendPack = {
            roomID: roomID,
            trusteeship :false,
            key:key,
            pid:heroID
        }
        app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "Trusteeship", sendPack);
	},
	SendAutoStart:function(){
		this.bIsAutoPlayIng = true;
        let RoomMgr = app[app.subGameName.toUpperCase()+"RoomMgr"]();
        let room = RoomMgr.GetEnterRoom();
        let roomID = room.GetRoomProperty("roomID");
        let key = room.GetRoomProperty("key");
        let heroID = app[app.subGameName + "_HeroManager"]().GetHeroProperty("pid");
        let sendPack = {
            roomID: roomID,
            trusteeship :true,
            key:key,
            pid:heroID
        }
        app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "Trusteeship", sendPack);
    },

    //游戏公用消息
    //登录获取当前进入的房间ID
	SendGetCurRoomID:function(){
		this.NetManager.SendPack("game.C1101GetRoomID", {});
	},
    //发送继续游戏
	SendContinueGame:function(roomID){
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ContinueGame", {"roomID":roomID});
	},
	//解散房间
	SendDissolveRoom:function(roomID){
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "DissolveRoom", {"roomID":roomID});
	},
	//发送同意解散房间
	SendDissolveRoomAgree:function(roomID){
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "DissolveRoomAgree", {"roomID":roomID});
	},

	//发送拒绝解散房间
	SendDissolveRoomRefuse:function(roomID){
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "DissolveRoomRefuse", {"roomID":roomID});
	},


	//发送同意修改人数
	SendChangePlayerAgree:function(roomID){
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ChangePlayerNumAgree", {"roomID":roomID,"agree":1});
	},

	//发送拒绝修改人数
	SendChangePlayerRefuse:function(roomID){
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ChangePlayerNumAgree", {"roomID":roomID,"agree":2});
	},


	//退出房间
	SendExitRoom:function(roomID, pos){
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ExitRoom", {"roomID":roomID, "posIndex":pos});
	},
	//位置发送准备状态
	SendReady:function(roomID, posIndex){
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ReadyRoom", {"roomID":roomID, "posIndex":posIndex});
	},

	//发送取消准备状态
	SendUnReady:function(roomID, posIndex){
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "UnReadyRoom", {"roomID":roomID, "posIndex":posIndex});
	},

	//房主T人
    SendKickPosIndex:function(roomID, posIndex){
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "KickRoom", {"roomID":roomID, "posIndex":posIndex});
	},

	//洗牌
	SendXiPai:function(roomID){
		this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "RoomXiPai", {"roomID":roomID});
	},
});


var g_pdk_GameManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
	if(!g_pdk_GameManager){
		g_pdk_GameManager = new pdk_GameManager();
	}
	return g_pdk_GameManager;
}