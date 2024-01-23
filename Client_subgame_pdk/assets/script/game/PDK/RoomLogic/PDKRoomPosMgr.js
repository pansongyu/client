/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDM Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package SSSRoomPosMgr.js
 *  @todo: 拼罗松房间
 *
 *  @author hongdian
 *  @date 2014-10-30 16:04
 *  @version 1.0
 *
 *  修改时间 修改人 修改内容
 *  -------------------------------------------------------------------------------
 *
 */
var app = require('pdk_app');

/**
 * 类构造
 */
var PDKRoomPosMgr = app.BaseClass.extend({

    /**
     * 初始化
     */
    Init: function () {

        this.JS_Name = app.subGameName.toUpperCase() + "RoomPosMgr";

        this.ComTool = app[app.subGameName + "_ComTool"]();
        this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
        this.WeChatManager = app[app.subGameName + "_WeChatManager"]();

        // S2228_LostConnect
        this.OnReload();

        this.Log("Init");


    },

    OnReload: function () {

        this.dataInfo = {};

        this.clientPos = -1;
        this.downPos = -1;
        this.upPos = -1;
        this.facePos = -1;
        this.posCount = -1;
    },


    //-----------------------回调函数-----------------------------
    OnInitRoomPosData: function (roomPosInfoList) {
        this.dataInfo = {};

        this.clientPos = -1;
        this.downPos = -1;
        this.upPos = -1;
        this.facePos = -1;
        this.posCount = -1;
        let heroImageUrlDict = {};
        let heroID = app[app.subGameName + "_HeroManager"]().GetHeroID();
        this.posCount = roomPosInfoList.length;

        for (let index = 0; index < this.posCount; index++) {
            let roomPosInfo = roomPosInfoList[index];
            let pos = roomPosInfo["pos"];
            this.dataInfo[pos] = roomPosInfo;

            let pid = roomPosInfo["pid"];
            let headImageUrl = roomPosInfo["headImageUrl"];
            if (pid == heroID) {
                this.clientPos = pos;
            }
            if (pid && headImageUrl) {
                heroImageUrlDict[pid] = headImageUrl;
            }
        }

        this.WeChatManager.InitHeroHeadImageByDict(heroImageUrlDict);
        // if(this.clientPos < 0){
        // 	this.ErrLog("OnInitRoomPosData clientPos not find");
        // }
        // else{
        // 	let posNum = 4;
        // 	if(this.posCount != 2){
        // 		this.upPos = (this.clientPos + posNum - 1)%posNum;
        // 		this.downPos = (this.clientPos + 1)%posNum;
        // 		this.facePos = (this.clientPos + 2)%posNum;

        // 	}
        // 	else
        // 		this.facePos = this.clientPos == 0 ? 1 : 0;

        // 	this.Log("upPos(%s) clientPos(%s) downPos(%s) facePos(%s)", this.upPos, this.clientPos, this.downPos, this.facePos);
        // }

        this.upPos = (this.clientPos + this.posCount - 1) % this.posCount;
        this.downPos = (this.clientPos + 1) % this.posCount;
        this.facePos = (this.clientPos + 2) % this.posCount;

        this.Log("OnInitRoomPosData:", this.dataInfo)
    },
    //获取房间有几个玩家
    GetRoomPlayerCount: function () {
        return this.posCount;
    },
    UpdateOwnerID: function (ownerID) {
        this.dataInfo['ownerID'] = ownerID;
    },

    OnPosLeave: function (pos) {
        let playerInfo = this.dataInfo[pos];
        if (!playerInfo) {
            this.ErrLog("OnPosLeave not find:%s", pos);
            return
        }
        playerInfo["pid"] = 0;
        playerInfo["name"] = 0;
        playerInfo["roomReady"] = false;
        playerInfo["gameReady"] = false;
        playerInfo["giveUpGame"] = 0;
        playerInfo["point"] = 0;
        playerInfo["realPoint"] = 0;
        playerInfo["flashCnt"] = 0;
        playerInfo["paiPin"] = 0;
        playerInfo["up"] = 0;
        playerInfo["down"] = 0;
    },


    //座位信息更新
    OnPosUpdate: function (pos, posInfo) {
        let playerInfo = this.dataInfo[pos];
        if (!playerInfo) {
            this.Log("OnPosUpdate not find:%s", pos);
            return false
        }
        this.dataInfo[pos] = posInfo;

        let heroID = posInfo["pid"];
        let headImageUrl = posInfo["headImageUrl"];
        if (heroID && headImageUrl) {
            this.WeChatManager.InitHeroHeadImage(heroID, headImageUrl);
        }

        return true
    },

    OnPosIsReady: function (pos, isReady) {
        let playerInfo = this.dataInfo[pos];
        if (!playerInfo) {
            this.Log("onPosTotalJifen not find:%s", pos);
            return false
        }
        playerInfo.isCardReady = isReady;

    },

    //开局准备
    OnPosReadyChg: function (pos, roomReady) {
        let playerInfo = this.dataInfo[pos];
        if (!playerInfo) {
            this.Log("OnPosReadyChg not find:%s", pos);
            return false
        }
        playerInfo["roomReady"] = roomReady;

        return true
    },

    //准备下一句
    OnPosContinueGame: function (pos) {
        let playerInfo = this.dataInfo[pos];
        if (!playerInfo) {
            this.ErrLog("OnPosContinueGame not find:%s", pos);
            return
        }
        playerInfo["gameReady"] = true;
    },

    OnSetEnd: function (setEnd) {
        //清除准备状态
        for (let pos in this.dataInfo) {
            let playerInfo = this.dataInfo[pos];
            playerInfo["gameReady"] = false;
            playerInfo["point"] += setEnd.pointList[pos];
            if (setEnd.lostCardList) {
                playerInfo["loseCardCount"] = setEnd.lostCardList[pos]
            }
            this.dataInfo[pos]['point'] = playerInfo["point"];
            //比赛分
            if (typeof (playerInfo.sportsPoint) != "undefined") {
                let sp = parseFloat(playerInfo["sportsPoint"]).toFixed(2);
                let addSp = parseFloat(setEnd.sportsPointList[pos]).toFixed(2);
                let totalSp = parseFloat(sp) + parseFloat(addSp);
                //保留小数点后面两位
                playerInfo["sportsPoint"] = totalSp.toFixed(2);
                this.dataInfo[pos]['sportsPoint'] = totalSp.toFixed(2);


                let real = parseFloat(playerInfo["realPoint"]).toFixed(2);
                let addReal = parseFloat(setEnd.sportsPointList[pos]).toFixed(2);
                let totalReal = parseFloat(real) + parseFloat(addReal);
                playerInfo["realPoint"] = totalReal.toFixed(2);
            }
        }
        // this.OnPoint(setEnd.pointList);
    },
    //更新积分，如果是断线重连不需要增加分数，直接同步服务端的分数就好
    // OnPoint:function(pointList, isReconnect = false){
    // 	for(let pos in this.dataInfo){
    // 		let playerInfo = this.dataInfo[pos];
    // 		if(isReconnect){
    // 			playerInfo["point"] = pointList[pos].point;
    // 		}
    // 		else{
    // 			playerInfo["point"] += pointList[pos];
    // 		}
    // 	}
    // },
    OnSportsPointChange: function (serverPack) {
        //同步更新比赛分
        for (let pos in this.dataInfo) {
            let playerInfo = this.dataInfo[pos];
            if (pos == serverPack.posId &&
                playerInfo.pid == serverPack.pid) {
                let sp = parseFloat(playerInfo["sportsPoint"]).toFixed(2);
                let addSp = parseFloat(serverPack.sportsPoint).toFixed(2);
                let totalSp = parseFloat(sp) + parseFloat(addSp);
                //保留小数点后面两位
                playerInfo["sportsPoint"] = totalSp.toFixed(2);
                this.dataInfo[pos]['sportsPoint'] = totalSp.toFixed(2);
            }
        }
    },
    //-------------------------获取接口---------------------
    //获取客户端玩家准备状态
    GetPlayerReadyState: function (roomSetID) {
        let ReadyState = "";
        if (roomSetID > 0) {
            ReadyState = "gameReady";
        } else {
            ReadyState = "roomReady";
        }
        return this.GetPlayerInfoByPos(this.clientPos)[ReadyState];
    },

    //设置玩家离线状态
    SetPlayerOfflineState: function (pos, isLostConnect, isShowLeave) {
        if (!this.dataInfo.hasOwnProperty(pos)) {
            this.ErrLog("SetPlayerOfflineState not find:%s", pos);
            return
        }
        this.dataInfo[pos]["isLostConnect"] = isLostConnect;
        this.dataInfo[pos]["isShowLeave"] = isShowLeave;
    },

    //获取房间所有玩家信息
    GetRoomAllPlayerInfo: function () {
        return this.dataInfo
    },

    GetPlayerInfoByPid: function (pid) {
        for (let i in this.dataInfo) {
            if (pid == this.dataInfo[i].pid)
                return this.dataInfo[i];
        }
        return null;
    },

    //获取房间指定位置玩家信息
    GetPlayerInfoByPos: function (pos) {
        if (!this.dataInfo.hasOwnProperty(pos)) {
            this.ErrLog("GetPlayerInfoByPos(%s) not find", pos);
            return
        }
        return this.dataInfo[pos];
    },

    //获取客户端玩家的座位
    GetClientPos: function () {
        return this.clientPos
    },

    //获取客户端玩家的上家位置ID
    GetClientUpPos: function () {
        return this.upPos
    },

    //获取客户端玩家下家位置ID
    GetClientDownPos: function () {
        return this.downPos
    },

    //获取客户端玩家对家位置ID
    GetClientFacePos: function () {
        return this.facePos
    },

    //获取开设房间位置的数量
    GetPosCount: function () {
        return this.posCount;
    },

    //服务端位置转客户端位置
    GetUIPosByDataPos: function (dataPos) {
        let playerCount = this.posCount;
        let uiPos = (dataPos + (playerCount - this.clientPos)) % playerCount;
        //如果是三人场，是使用0,3,1位置
        //如果是两人场并且是sy版本，是使用0,3位置
        let gameScene = app.LocalDataManager().GetConfigProperty("SysSetting", app.subGameName + "_GameBg");
        if (playerCount == 3) {
            switch (uiPos) {
                case 1:
                    uiPos = 3;
                    break;
                case 2:
                    uiPos = 2;
                    break;
                default:
                    break;
            }
        }else if (playerCount == 2 && gameScene == 3) {
            switch (uiPos) {
                case 1:
                    uiPos = 3;
                    break;
                default:
                    break;
            }
        }

        return uiPos;
    }
})


var g_PDKRoomPosMgr = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
    if (!g_PDKRoomPosMgr)
        g_PDKRoomPosMgr = new PDKRoomPosMgr();
    return g_PDKRoomPosMgr;

}
