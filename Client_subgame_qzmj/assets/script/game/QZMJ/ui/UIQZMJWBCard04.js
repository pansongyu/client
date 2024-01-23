var app = require("qzmj_app");
cc.Class({
	extends: require(app.subGameName + "_BaseMaJiangCard04Form"),

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
	ShowAllPlayerCard:function(room){
		let roomPosMgr = room.GetRoomPosMgr();
		let upPos = roomPosMgr.GetClientUpPos();
		this.card.active = 1;
		let roomSet = room.GetRoomSet();
		let setPos = roomSet.GetSetPosByPos(upPos);
		if(typeof(setPos) == "undefined"){
			this.card.active = 0;
			return
		}
		let shouCardList = setPos.GetSetPosProperty("shouCard");
		let count = shouCardList.length;

		for(let index=0; index < count; index++){
			let wndPath = this.ComTool.StringAddNumSuffix("card/card", index + 1, 2);
			let wndNode = this.GetWndNode(wndPath);
			if(!wndNode){
				// this.ErrLog("ShowAllPlayerCard not find:%s", wndPath);
				continue
			}
			wndNode.active = 1;
			let wndSprite = this.GetWndComponent(wndPath, cc.Sprite);
			wndSprite.spriteFrame = this.BackCardSpriteFrame;
		}

		//遍历玩家其他手牌
		for(let card_index=count+1; card_index <= this.ShareDefine[app.subGameName.toUpperCase()+"RoomDealPerPosCardCount"]; card_index++){
			let wndPath = this.ComTool.StringAddNumSuffix("card/card", card_index, 2);
			let wndNode = this.GetWndNode(wndPath);
			if(!wndNode){
				// this.ErrLog("ShowAllPlayerCard not find:%s", wndPath);
				continue
			}
			wndNode.active = 0;
		}
	},
});