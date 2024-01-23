/*
 BaseChildForm 子界面基类(又界面控制创建和销毁,一般是BaseForm的子界面,或者BaseChildForm的子界面(可以无限嵌套下去))
 */
var app = require("qzmj_app");
var BaseMaJiangCard03Form = cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	InitCardNode: function () {
		//初始化手牌
		console.log("初始化手牌", this.ShareDefine[this.GameTyepStringUp() + "RoomDealPerPosCardCount"]);
		for (let i = 1; i <= this.ShareDefine[this.GameTyepStringUp() + "RoomDealPerPosCardCount"]; i++) {
			let btn_node = cc.instantiate(this.sp_in);
			btn_node.name = this.ComTool.StringAddNumSuffix("card", Math.abs(i - (this.ShareDefine[this.GameTyepStringUp() + "RoomDealPerPosCardCount"] + 1)), 2);
			this.card.addChild(btn_node);
		}
		//初始化吃牌
		for (let i = 2; i <= 5; i++) {
			let down_node = cc.instantiate(this.downcard.getChildByName('down01'));
			down_node.name = this.ComTool.StringAddNumSuffix("down", i, 2);
			this.downcard.addChild(down_node);
		}
	},
	HideAllChild: function () {
		this.sp_in.active = 0;
		this.card.active = 0;
		this.downcard.active = 0;
		this.HideSeeCard();
	},
	HideSeeCard: function () {
	},
	//-----------------回调函数------------------------
	//set初始化
	OnSetInit: function () {
		this.HideAllChild();
	},
	//局开始 对家发牌初始化
	OnSetStart: function () {
		this.HideSeeCard();
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("OnSetStart not enter room");
			return
		}
		this.card.active = 1;
		this.allCardNodeList = [];
		//遍历14张牌,因为是发牌阶段只能设置spriteFrame清空不能把节点隐藏,因为layout会自动缩放排版
		for (let card_index = 1; card_index <= this.ShareDefine[this.GameTyepStringUp() + "RoomDealPerPosCardCount"]; card_index++) {
			let wndPath = this.ComTool.StringAddNumSuffix("card/card", card_index, 2);
			let wndNode = this.GetWndNode(wndPath);
			wndNode.color = cc.color(255, 255, 255);
			if (!wndNode) {
				this.ErrLog("OnSetStart not find:%s", wndPath);
				continue
			}
			let wndSprite = this.GetWndComponent(wndPath, cc.Sprite);
			wndSprite.spriteFrame = null;
			this.allCardNodeList.push(wndSprite);
			wndNode.active = 1;
		}

		//进牌位
		this.sp_in.active = 1;
		let sp_inSprite = this.sp_in.getComponent(cc.Sprite);
		sp_inSprite.spriteFrame = null;
	},
	//set结束
	OnSetEnd: function (setEnd) {
		this.ShowDownAllCard(setEnd);
	},
	//对家摸到一张牌
	OnPosGetCard: function () {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("OnPosGetCard not enter room");
			return
		}
		this.ShowHandCard(room);
	},

	//下家出牌动作结束
	OnPosActionEnd: function () {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("OnPosActionEnd not enter room");
			return
		}
		this.ShowAllPlayerCard(room);
		this.ShowHandCard(room);
		this.ShowDownCard(room);
	},
	//房间初始化
	OnRoomInit: function (room) {
		this.HideAllChild();
	},
	ShowAllPlayerCard: function () {
		return;
	},
	ShowSeeCard: function () {
		return;
	},
	//房间开始牌局
	OnRoomPlaying: function (room) {
		let roomSet = room.GetRoomSet();
		let setState = roomSet.GetRoomSetProperty("state");

		this.HideAllChild();

		if (setState == this.ShareDefine.SetState_Init) {

		}
		else if (setState == this.ShareDefine.SetState_Playing) {
			this.ShowAllPlayerCard(room);
			this.ShowHandCard(room);
			this.ShowDownCard(room);
		}
		else {
			/* let roomSetID = room.GetRoomProperty("setID");
			 let playerReadyState = this.RoomMgr.GetEnterRoom().GetRoomPosMgr().GetPlayerReadyState(roomSetID);
			 if(!playerReadyState){
				 this.ShowDownCard(room);
				 this.ShowDownAllCard(room);
			 }*/
		}
	},
	//显示本家吃到的卡牌
	ShowDownCard: function () {
		this.downcard.active = 1;
		let UICard_Down = this.downcard.getComponent(app.subGameName + "_UIMJCard_Down");
		UICard_Down.ShowAllOutEatCard();
	},
	ShowDownAllCard: function (setEnd) {
		let room = this.RoomMgr.GetEnterRoom();
		let roomSet = room.GetRoomSet();
		let imageString = "EatCard_Self_";
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
				continue
			}
			wndNode.active = 1;
			this.ShowMaJiang(wndNode, shouCardList[index], jin1, jin2, imageString);
		}

		//隐藏玩家已经打出的牌
		for (let card_index = count + 1; card_index <= this.ShareDefine[this.GameTyepStringUp() + "RoomDealPerPosCardCount"]; card_index++) {
			let wndPath = this.ComTool.StringAddNumSuffix("card/card", card_index, 2);
			let wndNode = this.GetWndNode(wndPath);
			if (!wndNode) {
				this.ErrLog("ShowDownAllCard(%s) not find", wndPath);
				continue
			}
			wndNode.active = 0;
		}

		//显示手牌
		let handCard = posResultList[facePos].handCard;
		if (handCard <= 0) {
			this.sp_in.getComponent(cc.Sprite).spriteFrame = '';
		}
		else {
			this.ShowMaJiang(this.sp_in, handCard, jin1, jin2, imageString);
		}
	},
	ShowMaJiang: function (childNode, cardID, jin1, jin2, imageString) {
		/*let BaseWidth=30;
		let BaseHeight=45;*/
		let room = this.RoomMgr.GetEnterRoom()
		let roomSet = room.GetRoomSet();
		if (cardID > 0 && (Math.floor(cardID / 100) == Math.floor(jin1 / 100) || Math.floor(cardID / 100) == Math.floor(jin2 / 100))) {
			childNode.color = cc.color(255, 255, 0);
		} else {
			childNode.color = cc.color(255, 255, 255);
		}
		let childSprite = childNode.getComponent(cc.Sprite);
		if (!childSprite) {
			this.ErrLog("ShowMaJiang(%s) not find cc.Sprite", childNode.name);
			return
		}
		//取卡牌ID的前2位
		let imageName = [imageString, Math.floor(cardID / 100)].join("");
		let imageInfo = this.IntegrateImage[imageName];
		if (!imageInfo) {
			this.ErrLog("ShowMaJiang IntegrateImage.txt not find:%s", imageName);
			return
		}
		let imagePath = imageInfo["FilePath"];
		let that = this;
		app[app.subGameName + "_ControlManager"]().CreateLoadPromise(imagePath, cc.SpriteFrame)
			.then(function (spriteFrame) {
				if (!spriteFrame) {
					that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
					return
				}
				//记录精灵图片对象
				childSprite.spriteFrame = spriteFrame;
				/*childNode.width=BaseWidth;
				childNode.height=BaseHeight;*/
			})
			.catch(function (error) {
				that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
			});
	},
	//房间结束
	OnRoomEnd: function (room) {
		this.HideAllChild();
	},

	OnUpdate: function () {
	},

	//开卡效果
	OpenCardEffect: function (cardIDList) {
		let count = cardIDList.length;

		for (let index = 0; index < count; index++) {
			let wndSprite = this.allCardNodeList.shift();
			if (!wndSprite) {
				this.ErrLog("OpenCardEffect allCardNodeList(%s) index(%s) not find cardNode", this.allCardNodeList.length, index, cardIDList);
				continue
			}
			wndSprite.spriteFrame = this.BackCardSpriteFrame;
		}
	},
	ShowSeeCard: function () {
		return;
	},
	//显示玩家手牌
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
		}
		else {
			sp_inSprite.spriteFrame = this.BackCardSpriteFrame;
			//看看是否有人13幺明查
			let seePosList = room.GetRoomProperty('set').seePosList;
			if (seePosList) {
				if (0 != seePosList.length) {
					this.ShowSeeCard(handCard);
				}
			}
		}
	},
});
module.exports = BaseMaJiangCard03Form;


