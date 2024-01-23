/*
    UICard02
*/
var app = require("qzmj_app");
cc.Class({
	extends: require(app.subGameName + "_BaseMaJiangCard02Form"),

	properties: {
		sp_in:cc.Node,
		card:cc.Node,
		downcard:cc.Node,
		BackCardSpriteFrame:cc.SpriteFrame,
	},
	Init: function () {
		this.InitBaseData();
		this.InitCardNode();
		this.RoomMgr = app[app.subGameName.toUpperCase()+"RoomMgr"]();
		//this.RoomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
		this.allCardNodeList = [];
		this.HideAllChild();
		let room = this.RoomMgr.GetEnterRoom();
		if(!room){
			this.ErrLog("OnShow not enter room");
			return
		}
		let state = room.GetRoomProperty("state");
		//如果是初始化
		if(state == this.ShareDefine.RoomState_Init){
			this.OnRoomInit(room);
		}
		else if(state == this.ShareDefine.RoomState_Playing){
			this.OnRoomPlaying(room);
		}
		else if(state == this.ShareDefine.RoomState_End){
			this.OnRoomEnd(room);
		}
		else{
			this.ErrLog("OnShow:%s error",state);
		}
	},
	//显示下家所有手牌
	ShowAllPlayerCard:function(room){
		let roomPosMgr = room.GetRoomPosMgr();
		let downPos = roomPosMgr.GetClientDownPos();
		this.card.active = 1;
		let roomSet = room.GetRoomSet();
		let setPos = roomSet.GetSetPosByPos(downPos);
		let shouCardList = setPos.GetSetPosProperty("shouCard");
		let count = shouCardList.length;
		//显示玩家手牌
		for(let index=0; index < count; index++){
			let wndPath = this.ComTool.StringAddNumSuffix("card/card", index + 1, 2);
			let wndNode = this.GetWndNode(wndPath);
			if(!wndNode){
				this.ErrLog("ShowAllPlayerCard(%s) not find", wndPath);
				continue
			}
			wndNode.active = 1;
			let wndSprite = wndNode.getComponent(cc.Sprite);
			wndSprite.spriteFrame = this.BackCardSpriteFrame;
		}
		//隐藏玩家已经打出的牌
		for(let card_index=count+1; card_index <= this.ShareDefine[app.subGameName.toUpperCase()+"RoomDealPerPosCardCount"]; card_index++){
			let wndPath = this.ComTool.StringAddNumSuffix("card/card", card_index, 2);
			let wndNode = this.GetWndNode(wndPath);
			if(!wndNode){
				this.ErrLog("ShowAllPlayerCard(%s) not find", wndPath);
				continue
			}
			wndNode.active = 0;
		}
	},

});
