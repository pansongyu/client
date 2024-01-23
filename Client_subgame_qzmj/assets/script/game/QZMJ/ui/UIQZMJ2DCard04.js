/*
    UICard04
*/
var app = require("qzmj_app");
cc.Class({
	extends: require(app.subGameName + "_BaseMaJiangCard04Form"),

	properties: {
		sp_in: cc.Prefab,
		empty: cc.Prefab,
		card: cc.Node,
		downcard: cc.Node,
		BackCardSpriteFrame: cc.SpriteFrame,
	},
	Init: function () {
		this.InitBaseData();
		this.InitCardNode();
		this.RoomMgr = app[app.subGameName.toUpperCase()+"RoomMgr"]();
		//this.RoomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
		this.allCardNodeList = [];
		this.HideAllChild();
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("OnShow not enter room");
			return;
		}
		let state = room.GetRoomProperty("state");
		//如果是初始化
		if (state == this.ShareDefine.RoomState_Init) {
			this.OnRoomInit(room);
		} else if (state == this.ShareDefine.RoomState_Playing) {
			this.OnRoomPlaying(room);
		} else if (state == this.ShareDefine.RoomState_End) {
			this.OnRoomEnd(room);
		} else {
			this.ErrLog("OnShow:%s error", state);
		}
	},
	/*
13根牌
 */
	InitCardNode: function () {
		// this.LocalDataManager.SetConfigProperty("SysSetting", "is3DShow", 0);
		//初始化手牌
		let cardLayOut = this.card.getComponent(cc.Layout);
		cardLayOut.spacingY = -45;
		for (let i = 1; i <= this.ShareDefine[app.subGameName.toUpperCase()+"RoomDealPerPosCardCount"]; i++) {
			let btn_node = cc.instantiate(this.sp_in);
			btn_node.width = 30;
			btn_node.height = 70;
			btn_node.name = this.ComTool.StringAddNumSuffix("card", i, 2);
			// btn_node.zIndex = Math.abs(i - (this.ShareDefine[app.subGameName.toUpperCase() + "RoomDealPerPosCardCount"] + 2));
			this.card.addChild(btn_node);
			// btn_node.getChildByName("da").active = false;
		}
		let empty = cc.instantiate(this.empty);
		this.card.addChild(empty);
		let sp_in = cc.instantiate(this.sp_in);
		sp_in.name = "sp_in";
		this.card.addChild(sp_in);
		//初始化吃牌
		for (let i = 2; i <= 5; i++) {
			let down_node = cc.instantiate(this.downcard.getChildByName('down01'));
			down_node.name = this.ComTool.StringAddNumSuffix("down", i, 2);
			this.downcard.addChild(down_node);
		}
	},
	//显示下家所有手牌
	ShowAllPlayerCard: function (room) {
		let roomPosMgr = room.GetRoomPosMgr();
		let UpPos = roomPosMgr.GetClientUpPos();
		this.card.active = true;
		let roomSet = room.GetRoomSet();
		let setPos = roomSet.GetSetPosByPos(UpPos);
		let shouCardList = setPos.GetSetPosProperty("shouCard");
		let count = shouCardList.length;
		//显示玩家手牌
		let cardLayOut = this.card.getComponent(cc.Layout);
		cardLayOut.spacingY = -45;
		for (let index = 0; index < count; index++) {
			let wndPath = this.ComTool.StringAddNumSuffix("card/card", index + 1, 2);
			let wndNode = this.GetWndNode(wndPath);
			if (!wndNode) {
				this.ErrLog("ShowAllPlayerCard(%s) not find", wndPath);
				continue;
			}
			wndNode.active = true;
			// wndNode.getChildByName("da").active = false;
			wndNode.width = 30;
			wndNode.height = 70;
			if (shouCardList[index] > 0) {
				this.LiangPai(wndNode, shouCardList[index]);
			} else {
				let wndSprite = wndNode.getComponent(cc.Sprite);
				wndSprite.spriteFrame = this.BackCardSpriteFrame;
			}
		}

		//隐藏玩家已经打出的牌
		for (let card_index = count + 1; card_index <= this.ShareDefine[app.subGameName.toUpperCase()+"RoomDealPerPosCardCount"]; card_index++) {
			let wndPath = this.ComTool.StringAddNumSuffix("card/card", card_index, 2);
			let wndNode = this.GetWndNode(wndPath);
			if (!wndNode) {
				this.ErrLog("ShowAllPlayerCard(%s) not find", wndPath);
				continue;
			}
			wndNode.active = false;
		}
	},
	ShowDownAllCard: function (setEnd) {
		let room = this.RoomMgr.GetEnterRoom();
		let roomSet = room.GetRoomSet();
		let imageString = "OutCard2D_Up_";
		if (setEnd == false) {
			setEnd = roomSet.GetRoomSetProperty("setEnd");
		}
		let posResultList = setEnd["posResultList"];
		if (typeof(posResultList) == "undefined") {
			return;
		}
		var jin1 = roomSet.get_jin1();
		var jin2 = roomSet.get_jin2();
		let RoomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
		let UpPos = RoomPosMgr.GetClientUpPos();

		let shouCardList = posResultList[UpPos].shouCard;
		let count = shouCardList.length;
		//显示玩家手牌
		let cardLayOut = this.card.getComponent(cc.Layout);
		cardLayOut.spacingY = -13;
		for (let index = 0; index < count; index++) {
			let wndPath = this.ComTool.StringAddNumSuffix("card/card", index + 1, 2);
			let wndNode = this.GetWndNode(wndPath);
			if (!wndNode) {
				this.ErrLog("ShowDownAllCard(%s) not find", wndPath);
				continue;
			}
			wndNode.active = true;
			wndNode.width = 56.7;
			wndNode.height = 46.9;
			this.ShowMaJiang(wndNode, shouCardList[index], jin1, jin2, imageString);
		}
		//隐藏玩家已经打出的牌
		for (let card_index = count + 1; card_index <= this.ShareDefine[app.subGameName.toUpperCase() + "RoomDealPerPosCardCount"]; card_index++) {
			let wndPath = this.ComTool.StringAddNumSuffix("card/card", card_index, 2);
			let wndNode = this.GetWndNode(wndPath);
			if (!wndNode) {
				this.ErrLog("ShowDownAllCard(%s) not find", wndPath);
				continue;
			}
			wndNode.active = false;
		}

		//显示手牌
		let handCard = posResultList[UpPos].handCard;
		let sp_inCard = this.card.getChildByName("sp_in");
		if (handCard <= 0) {
			// this.sp_in.getComponent(cc.Sprite).spriteFrame = '';
			sp_inCard.getComponent(cc.Sprite).spriteFrame = '';
		} else {
			sp_inCard.width = 56.7;
			sp_inCard.height = 46.9;
			// this.ShowMaJiang(this.sp_in, handCard, jin1, jin2, imageString);
			this.ShowMaJiang(sp_inCard, handCard, jin1, jin2, imageString);
		}
	},
	ShowMaJiang:function(childNode,cardID,jin1,jin2,imageString){
		let room=this.RoomMgr.GetEnterRoom();
		let roomSet = room.GetRoomSet();
		if(cardID>0 && (Math.floor(cardID/100)==Math.floor(jin1/100) || Math.floor(cardID/100)==Math.floor(jin2/100))){
			childNode.color=cc.color(255,255,0);
			// childNode.getChildByName("da").active = true;
		}else{
			childNode.color=cc.color(255,255,255);
			// childNode.getChildByName("da").active = false;
		}
		let childSprite = childNode.getComponent(cc.Sprite);
		if(!childSprite){
			this.ErrLog("ShowMaJiang(%s) not find cc.Sprite", childNode.name);
			return
		}
		//取卡牌ID的前2位
		let imageName = [imageString, Math.floor(cardID/100)].join("");
		let imageInfo = this.IntegrateImage[imageName];
		if(!imageInfo){
			this.ErrLog("ShowMaJiang IntegrateImage.txt not find:%s", imageName);
			return
		}
		let imagePath = imageInfo["FilePath"];
		let that = this;
		app[app.subGameName+"_ControlManager"]().CreateLoadPromise(imagePath, cc.SpriteFrame)
			.then(function(spriteFrame){
				if(!spriteFrame){
					that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
					return
				}
				//记录精灵图片对象
				childSprite.spriteFrame = spriteFrame;
			})
			.catch(function(error){
				that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
			});
	},
	LiangPai: function (childNode, cardID, imageString) {
		let room = this.RoomMgr.GetEnterRoom();
		let roomSet = room.GetRoomSet();
		let childSprite = childNode.getComponent(cc.Sprite);
		if (!childSprite) {
			this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
			return;
		}
		var jin1 = roomSet.get_jin1();
		if (Math.floor(cardID / 100) == Math.floor(jin1 / 100)) {
			childNode.color = cc.color(255, 255, 0);
		} else {
			childNode.color = cc.color(255, 255, 255);
		}
		//取卡牌ID的前2位
		let imageName = [imageString, Math.floor(cardID / 100)].join("");
		let imageInfo = this.IntegrateImage[imageName];
		if (!imageInfo) {
			// this.ErrLog("fuck ShowImage IntegrateImage.txt not find:%s", imageName);
			return;
		}
		let imagePath = imageInfo["FilePath"];
		let that = this;
		app[app.subGameName+"_ControlManager"]().CreateLoadPromise(imagePath, cc.SpriteFrame)
			.then(function (spriteFrame) {
				if (!spriteFrame) {
					that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
					return
				}
				//记录精灵图片对象
				childSprite.spriteFrame = spriteFrame;
			})
			.catch(function (error) {
				that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
			});
	},
	ShowHandCard: function (room) {
		let roomPosMgr = room.GetRoomPosMgr();
		let roomSet = room.GetRoomSet();
		let upPos = roomPosMgr.GetClientUpPos();
		let setPos = roomSet.GetSetPosByPos(upPos);
		let handCard = setPos.GetSetPosProperty("handCard");
		//进牌位
		let sp_inCard = this.card.getChildByName("sp_in");
		sp_inCard.active = true;
		let sp_inSprite = sp_inCard.getComponent(cc.Sprite);
		sp_inCard.color = cc.color(255, 255, 255);
		if (handCard <= 0) {
			sp_inSprite.spriteFrame = null;
		}
		else {
			if (handCard == 5000) {
				sp_inCard.width = 30;
				sp_inCard.height = 70;
				sp_inSprite.spriteFrame = this.BackCardSpriteFrame;
			} else {
				this.LiangPai(sp_inCard, handCard);
			}
		}
	},
	OnPosGetCard: function () {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("OnPosGetCard not enter room");
			return
		}
		this.ShowHandCard(room);
		this.ShowAllPlayerCard(room);
	},
});
