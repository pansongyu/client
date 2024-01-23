/*
    UICard03
*/
var app = require("qzmj_app");
cc.Class({
	extends: require(app.subGameName + "_BaseMaJiangCard03Form"),

	properties: {
		sp_in: cc.Node,
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
	InitCardNode: function () {
		//初始化手牌
		for (let i = 1; i <= this.ShareDefine[this.GameTyepStringUp() + "RoomDealPerPosCardCount"]; i++) {
			let btn_node = cc.instantiate(this.sp_in);
			btn_node.name = this.ComTool.StringAddNumSuffix("card", Math.abs(i - (this.ShareDefine[this.GameTyepStringUp() + "RoomDealPerPosCardCount"] + 1)), 2);
			this.card.addChild(btn_node);
			// btn_node.getChildByName("da").active = false;
		}
		//初始化吃牌
		for (let i = 2; i <= 5; i++) {
			let down_node = cc.instantiate(this.downcard.getChildByName('down01'));
			down_node.name = this.ComTool.StringAddNumSuffix("down", i, 2);
			this.downcard.addChild(down_node);
		}
	},
	//显示玩家所有手牌
	ShowAllPlayerCard: function (room) {
		let roomPosMgr = room.GetRoomPosMgr();
		let facePos = roomPosMgr.GetClientFacePos();
		this.card.active = true;
		let roomSet = room.GetRoomSet();
		let setPos = roomSet.GetSetPosByPos(facePos);
		if (typeof(setPos) == "undefined") {
			this.card.active = false;
			return;
		}
		let shouCardList = setPos.GetSetPosProperty("shouCard");
		let count = shouCardList.length;

		for (let index = 0; index < count; index++) {
			let wndPath = this.ComTool.StringAddNumSuffix("card/card", index + 1, 2);
			let wndNode = this.GetWndNode(wndPath);
			if (!wndNode) {
				this.ErrLog("ShowAllPlayerCard not find:%s", wndPath);
				continue;
			}
			wndNode.active = true;
			// wndNode.getChildByName("da").active = false;
			if (shouCardList[index] > 0) {
				this.LiangPai(wndNode, shouCardList[index]);
			} else {
				let wndSprite = wndNode.getComponent(cc.Sprite);
				wndSprite.spriteFrame = this.BackCardSpriteFrame;
			}
		}

		//遍历玩家其他手牌
		for (let card_index = count + 1; card_index <= this.ShareDefine[app.subGameName.toUpperCase()+ "RoomDealPerPosCardCount"]; card_index++) {
			let wndPath = this.ComTool.StringAddNumSuffix("card/card", card_index, 2);
			let wndNode = this.GetWndNode(wndPath);
			if (!wndNode) {
				this.ErrLog("ShowAllPlayerCard not find:%s", wndPath);
				continue;
			}
			wndNode.active = false;
		}
	},
	ShowDownAllCard: function (setEnd) {
		let room = this.RoomMgr.GetEnterRoom();
		let roomSet = room.GetRoomSet();
		let imageString = "OutCard2D_Self_";
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
		let facePos = RoomPosMgr.GetClientFacePos();
		let shouCardList = posResultList[facePos].shouCard;
		let count = shouCardList.length;
		//显示玩家手牌
		for (let index = 0; index < count; index++) {
			let wndPath = this.ComTool.StringAddNumSuffix("card/card", index + 1, 2);
			let wndNode = this.GetWndNode(wndPath);
			if (!wndNode) {
				this.ErrLog("ShowDownAllCard(%s) not find", wndPath);
				continue;
			}
			wndNode.active = true;
			this.ShowMaJiang(wndNode, shouCardList[index], jin1, jin2, imageString);
		}

		//隐藏玩家已经打出的牌
		for (let card_index = count + 1; card_index <= this.ShareDefine[this.GameTyepStringUp() + "RoomDealPerPosCardCount"]; card_index++) {
			let wndPath = this.ComTool.StringAddNumSuffix("card/card", card_index, 2);
			let wndNode = this.GetWndNode(wndPath);
			if (!wndNode) {
				this.ErrLog("ShowDownAllCard(%s) not find", wndPath);
				continue;
			}
			wndNode.active = false;
		}

		//显示手牌
		let handCard = posResultList[facePos].handCard;
		if (handCard <= 0) {
			this.sp_in.getComponent(cc.Sprite).spriteFrame = '';
		} else {
			this.ShowMaJiang(this.sp_in, handCard, jin1, jin2, imageString);
		}
	},
	ShowMaJiang:function(childNode,cardID,jin1,jin2,imageString){
		/*let BaseWidth=30;
		let BaseHeight=45;*/
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
				/*childNode.width=BaseWidth;
				childNode.height=BaseHeight;*/
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
			return
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
			return
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
		let facePos = roomPosMgr.GetClientFacePos();
		let setPos = roomSet.GetSetPosByPos(facePos);
		let handCard = setPos.GetSetPosProperty("handCard");
		//进牌位
		this.sp_in.active = 1;
		let sp_inSprite = this.sp_in.getComponent(cc.Sprite);
		this.sp_in.color = cc.color(255, 255, 255);
		if (handCard <= 0) {
			sp_inSprite.spriteFrame = null;
		} else {
			if (handCard == 5000) {
				sp_inSprite.spriteFrame = this.BackCardSpriteFrame;
			} else {
				this.LiangPai(this.sp_in, handCard);
			}
		}
	},
	//对家摸到一张牌
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
