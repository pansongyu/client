/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDM Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package LZMJRoomSet.js
 *  @todo: 龙岩麻将房间
 *
 *  @author hongdian
 *  @date 2014-10-30 16:04
 *  @version 1.0
 *
 *  修改时间 修改人 修改内容
 *  -------------------------------------------------------------------------------
 *
 */
var app = require("nn_app");

/**
 * 类构造
 */
var LZMJRoomSet = app.BaseClass.extend({

	/**
	 * 初始化
	 */
	Init:function(){

		this.JS_Name = app["subGameName"] + "RoomSet";

		this.ComTool = app[app.subGameName + "_ComTool"]();
		this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
		this.allSetPosDict = {};
		this.cacheSetPosDict = {};
		for(let posID = 0; posID < this.ShareDefine[app.subGameName.toUpperCase() + "RoomJoinCount"]; posID++){
			this.cacheSetPosDict[posID] = app[app.subGameName.toUpperCase()+"SetPos"]();
		}
		this.OnReload();

		//console.log("Init");

	},
	get_jin1:function(){
	    return this.dataInfo.jin;
	},
	get_jin2:function(){
		if(this.dataInfo['jin2']){
			return this.dataInfo.jin2;
		}
		return 0;
	},
    set_jin1:function(cardID){
      this.dataInfo['jin']=cardID;
    },
    set_jin2:function(cardID){
       this.dataInfo['jin2']=cardID;
    },
	set_jinjin: function (cardID) {
		this.dataInfo["jinJin"] = cardID;
	},
	OnReload:function(){
		for(let posID in this.allSetPosDict){
			let setPos = this.allSetPosDict[posID];
			setPos.OnReload();
			this.cacheSetPosDict[posID] = setPos
		}
		this.allSetPosDict = {};

		//{
		//	"setID":0,
		//	"dPos":0,
		//	"startPaiPos":0,
		//	"startPaiDun":0,
		//	"waitReciveCard":0,
		//	"state":0,
		//	"setEnd":{"posHuList":posHuList,"maCardList":maCardList,"zhongMa":0},
		//}
		this.dataInfo = {};

	},
	SetState:function(state){
		this.dataInfo['state']=state;
	},
	InitSetInfo:function(setInfo){
		for(let posID in this.allSetPosDict){
			let setPos = this.allSetPosDict[posID];
			setPos.OnReload();
			this.cacheSetPosDict[posID] = setPos
		}
		this.allSetPosDict = {};
		let setPosList = setInfo["setPosList"]||[];
		let count = setPosList.length;

		for(let index=0; index < count; index++){
			let setPosInfo = setPosList[index];
			let posID = setPosInfo["posID"];
			//获取缓存的setPos对象
			let setPos = this.cacheSetPosDict[posID];
			delete this.cacheSetPosDict[posID];
			if(!setPos){
				console.error("OnInitRoomSetData cacheSetPosDict not find:%s",posID);
				setPos = app[app.subGameName.toUpperCase()+"SetPos"]();
			}
			setPos.OnInitSetPos(setPosInfo);
			this.allSetPosDict[posID] = setPos
		}
		if(setInfo['setRound']){
			this.OnStartRound(setInfo['setRound']);
		}
		let setEnd = setInfo["setEnd"];
		this.dataInfo = setInfo;
		if(setEnd){
			if(setEnd['endTime']>0){
			    this.OnSetEnd(setEnd);
			}
		}
	},
	InitSetPosList:function(setPosList){
		let count = setPosList.length;
		for(let posID in this.allSetPosDict){
			let setPos = this.allSetPosDict[posID];
			setPos.OnReload();
			this.cacheSetPosDict[posID] = setPos
		}
		this.allSetPosDict = {};
		for(let index=0; index < count; index++){
			let setPosInfo = setPosList[index];
			let posID = setPosInfo["posID"];

			//获取缓存的setPos对象
			let setPos = this.cacheSetPosDict[posID];
			delete this.cacheSetPosDict[posID];
			if(!setPos){
				console.error("OnInitRoomSetData cacheSetPosDict not find:%s",posID);
				setPos = app[app.subGameName.toUpperCase()+"SetPos"]();
			}
			setPos.OnInitSetPos(setPosInfo);
			this.allSetPosDict[posID] = setPos
		}
	},


	//-----------------------回调函数-----------------------------
	OnInitRoomSetData:function(setInfo){
		this.InitSetInfo(setInfo);
		let state = this.dataInfo["state"];
		if(this.ShareDefine.SetStateStringDict.hasOwnProperty(state)){
			this.dataInfo["state"] = this.ShareDefine.SetStateStringDict[state];
		}
		else{
			console.error("OnInitRoomSetData state:%s not find", state);
		}
	},

	OnPosLeave:function(pos){
		let setPos = this.allSetPosDict[pos];
		//可能未开局没有allSetPosDict数据
		if(!setPos){
			console.log("OnPosLeave(%s) not find", pos);
			return
		}
		delete this.allSetPosDict[pos];
		this.cacheSetPosDict[pos] = setPos;
	},

	OnPosContinueGame:function(){
		this.dataInfo["state"] = this.ShareDefine.SetState_Init;
		for(let pos in this.allSetPosDict){
			this.allSetPosDict[pos].OnPosContinueGame();
		}
	},

	OnSetStart:function(setInfo){
		this.InitSetInfo(setInfo);
		this.dataInfo["state"] = this.ShareDefine.SetState_Playing;
	},

	OnSetEnd:function(setEnd){
		let posResultList = setEnd["posResultList"];
		let count = posResultList.length;
		for(let index=0; index<count; index++){
			let posInfo = posResultList[index];
			let huType = posInfo["huType"];
			posInfo["huType"] = this.ShareDefine.HuTypeStringDict[huType];
		}
		this.dataInfo["setEnd"] = setEnd;
		this.dataInfo["state"] = this.ShareDefine.SetState_End;
	},

	OnStartRound:function(setRound){

		let waitID = setRound["waitID"];
		let startWaitSec = setRound["startWaitSec"];
		let opPosList = setRound["opPosList"];

		let count = opPosList.length;
		for(let index=0; index<count; index++){
			let roundPos = opPosList[index];
			let opList = roundPos["opList"];
			roundPos["opType"] = this.ShareDefine.OpTypeStringDict[roundPos["opType"]];
			let opCount = opList.length;
			let newOpList = [];
			for(let index_op=0; index_op<opCount; index_op++){
				newOpList.push(this.ShareDefine.OpTypeStringDict[opList[index_op]]);
			}
			roundPos["opList"] = newOpList;
		}
		this.dataInfo["setRound"] = setRound;
	},

	//指定位置获取卡牌
	OnPosGetCard:function(pos, setPosInfo, normalMoCnt, gangMoCnt){
		let setPos = this.allSetPosDict[pos];
		if(!setPos){
			console.error("OnPosGetCard not find(%s)", pos);
			return false
		}
		this.dataInfo["normalMoCnt"] = normalMoCnt;
		this.dataInfo["gangMoCnt"] = gangMoCnt;

		return setPos.OnPosGetCard(setPosInfo);
	},
    SetRoomSetProperty:function(key,value){
         this.dataInfo[key] = value;
    },
	//指定位置出牌后
	OnPosOpCard:function(serverPack){
		let pos = serverPack["pos"];
		let setPosInfo = serverPack["set_Pos"];
		let opType = serverPack["opType"];
		let opCard = serverPack["opCard"];

		let setPos = this.allSetPosDict[pos];
		if(!setPos){
			console.error("OnPosOpCard not find(%s)", pos);
			return false
		}

		opType = this.ShareDefine.OpTypeStringDict[opType];
		serverPack["opType"] = opType;

		//更新当前等待接收的卡牌
		this.dataInfo["waitReciveCard"] = opCard;

		console.log("dataInfo:", this.dataInfo);

		return setPos.OnPosOpCard(setPosInfo);
	},
	//打牌预先处理
	PreSetShouCard:function(pos,cardID){
		let setPos = this.allSetPosDict[pos];
		let shouCard = setPos.GetSetPosProperty("shouCard");
		let handCard = setPos.GetSetPosProperty("handCard");
		let jin1 = this.get_jin1();
		let jin2 = this.get_jin2();
		let kexuanwanfa = app[app.subGameName.toUpperCase()+"Room"]().GetRoomConfigByProperty("kexuanwanfa");
		if (handCard > 0 && handCard == cardID) {
			setPos.SetDataInfo('handCard', 0);
		} else {
			shouCard.Remove(cardID);
			if (handCard > 0) {
				shouCard.push(handCard);
				setPos.SetDataInfo('handCard', 0);
				let newShouCard = [];
				let newShouCard2 = [];
				let oldShouCard = [];
				let count = 0;
				//先抽出金
				count = shouCard.length;
				for (let i = 0; i < count; i++) {
					oldShouCard.push(shouCard[i]);//shoucard存临时数组
				}
				for (let i = 0; i < count; i++) {
					// if (Math.floor(shouCard[i] / 100) == Math.floor(jin1 / 100) ||
					// 	Math.floor(shouCard[i] / 100) == Math.floor(jin2 / 100)) {
					// 	newShouCard.push(shouCard[i]);
					// 	oldShouCard.Remove(shouCard[i]);
					// }

					//红中为癞子
					if (kexuanwanfa.indexOf(2) > -1 && Math.floor(shouCard[i] / 100)==45) {
						newShouCard.push(shouCard[i]);
						oldShouCard.Remove(shouCard[i]);
					}
				}
				oldShouCard.SortList();
				count = oldShouCard.length;
				for (let i = 0; i < count; i++) {
					newShouCard.push(oldShouCard[i]);
				}
				setPos.SetDataInfo('shouCard', newShouCard);
			}
		}
	},
	//删除掉已经打出去的牌
	OnDeleteOutCard:function(cardID){
		let findPos = -1;

		for(let pos in this.allSetPosDict){
			let setPos = this.allSetPosDict[pos];
			let outCard = setPos.GetSetPosProperty("outCard");
			//如果找到需要删除的卡牌
			if(outCard.InArray(cardID)){
				outCard.Remove(cardID);
				findPos = pos;
				break
			}
		}

		return findPos
	},

	//添加打出去的牌
	OnAddOutCard:function(pos,cardID){
		let setPos = this.allSetPosDict[pos];
		let outCard = setPos.GetSetPosProperty("outCard");
		//如果找到需要删除的卡牌
		if(outCard.InArray(cardID)){
			return false;
		}else{
			outCard.push(cardID);
			return true;
		}
	},


	//----------------获取接口--------------------

	//获取set属性值
	GetRoomSetProperty:function(property){
		if(!this.dataInfo.hasOwnProperty(property)){
			console.error("GetSetProperty(%s) not find", property);
			return
		}
		return this.dataInfo[property];
	},

	GetRoomSetInfo:function(){
		return this.dataInfo
	},
	unLock:function(pos){
		let setPos = this.allSetPosDict[pos];
		setPos.SetDataInfo('isLock',false);
	},
	GetSetPosByPos:function(pos){
	    if(pos==-1){
	        return
	    }
		let setPos = this.allSetPosDict[pos];
		if(!setPos){
			console.error("GetSetPosByPos not find:%s", pos);
			return
		}
		return setPos
	},

	//获取指定类型的卡牌剩余未出数量
	GetHuCardTypeInfo:function(selfPos){

		let outCardIDList = [];
		let selfSetPos = this.allSetPosDict[selfPos];
		if(!selfSetPos){
			console.error("GetHuCardLeftInfo not find selfPos:%s", selfPos);
			return {}
		}

		for(var pos in this.allSetPosDict){
			let setPos = this.allSetPosDict[pos];

			//如果是本家,需要加上手卡
			if(selfPos == pos){
				outCardIDList = outCardIDList.concat(setPos.GetSetPosProperty("shouCard"));
				let handCard = setPos.GetSetPosProperty("handCard");
				if(handCard > 0){
					outCardIDList.push(handCard);
				}
			}
			//加上打出去的牌
			outCardIDList = outCardIDList.concat(setPos.GetSetPosProperty("outCard"));

			//加上吃到的牌
			let publicCardList = setPos.GetSetPosProperty("publicCardList");
			let publicCount = publicCardList.length;
			for(let index=0; index<publicCount; index++){
				let publicInfoList = publicCardList[index];
				let cardIDList = publicInfoList.slice(3, publicInfoList.length);
				outCardIDList = outCardIDList.concat(cardIDList);
			}
		}

		outCardIDList.SortList();

		let allCardTypeDict = {};
		let allCount = outCardIDList.length;
		for(let index=0; index<allCount; index++){
			let cardID = outCardIDList[index];
			let cardType = Math.floor(cardID/100);

			if(allCardTypeDict.hasOwnProperty(cardType)){
				allCardTypeDict[cardType] += 1;
			}
			else{
				allCardTypeDict[cardType] = 1;
			}
		}

		let huCardTypeInfo = {};
		let huCardTypeList = selfSetPos.GetSetPosProperty("huCard");
		let count = huCardTypeList.length;
		for(var index=0; index<count; index++){
			let cardType = huCardTypeList[index];
			let leftCount = 4;
			if(allCardTypeDict.hasOwnProperty(cardType)){
				leftCount = 4 - allCardTypeDict[cardType];
			}
			huCardTypeInfo[cardType] = leftCount;
		}

		console.log("huCardTypeInfo:", huCardTypeInfo);
		return huCardTypeInfo
	},
	//获取指定类型的卡牌剩余未出数量
	GetLeftCardTypeInfo:function(selfPos){
		let outCardIDList = [];
		let selfSetPos = this.allSetPosDict[selfPos];
		if(!selfSetPos){
			console.error("GetHuCardLeftInfo not find selfPos:%s", selfPos);
			return {}
		}

		for(var pos in this.allSetPosDict){
			let setPos = this.allSetPosDict[pos];

			//如果是本家,需要加上手卡
			if(selfPos == pos){
				outCardIDList = outCardIDList.concat(setPos.GetSetPosProperty("shouCard"));
				let handCard = setPos.GetSetPosProperty("handCard");
				if(handCard > 0){
					outCardIDList.push(handCard);
				}
			}
			//加上打出去的牌
			outCardIDList = outCardIDList.concat(setPos.GetSetPosProperty("outCard"));

			//加上吃到的牌
			let publicCardList = setPos.GetSetPosProperty("publicCardList");
			let publicCount = publicCardList.length;
			for(let index=0; index<publicCount; index++){
				let publicInfoList = publicCardList[index];
				let cardIDList = publicInfoList.slice(3, publicInfoList.length);
				outCardIDList = outCardIDList.concat(cardIDList);
			}
		}

		outCardIDList.SortList();

		let allCardTypeDict = {};
		let allCount = outCardIDList.length;
		for(let index=0; index<allCount; index++){
			let cardID = outCardIDList[index];
			let cardType = Math.floor(cardID/100);

			if(allCardTypeDict.hasOwnProperty(cardType)){
				allCardTypeDict[cardType] += 1;
			}
			else{
				allCardTypeDict[cardType] = 1;
			}
		}
		return allCardTypeDict;
	},
})


var g_LZMJRoomSet = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
	if(!g_LZMJRoomSet)
		g_LZMJRoomSet = new LZMJRoomSet();
	return g_LZMJRoomSet;

}
