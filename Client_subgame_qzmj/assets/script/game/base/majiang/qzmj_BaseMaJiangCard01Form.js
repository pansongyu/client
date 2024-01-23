/*
 BaseChildForm 子界面基类(又界面控制创建和销毁,一般是BaseForm的子界面,或者BaseChildForm的子界面(可以无限嵌套下去))
 */

var app = require("qzmj_app");


var BaseMaJiangCard01Form = cc.Class({

	extends: require(app.subGameName + "_BaseForm"),

	OnReload: function () {
		this.chooseNode = null;
		this.allCardNodeList = [];
		this.actionWndNameList = [];
	},
	InitCardNode: function () {
		//初始化手牌
		console.log("初始化手牌", this.ShareDefine[this.GameTyepStringUp() + "RoomDealPerPosCardCount"]);
		for (let i = 1; i <= this.ShareDefine[this.GameTyepStringUp() + "RoomDealPerPosCardCount"]; i++) {
			let btn_node = cc.instantiate(this.btn_in);
			btn_node.name = this.ComTool.StringAddNumSuffix("btn_", i, 2);
			this.card.addChild(btn_node, Math.abs(i - (this.ShareDefine[this.GameTyepStringUp() + "RoomDealPerPosCardCount"] + 1)));
		}
		//初始化吃牌
		for (let i = 2; i <= 5; i++) {
			let down_node = cc.instantiate(this.downcard.getChildByName('down01'));
			down_node.name = this.ComTool.StringAddNumSuffix("down", i, 2);
			this.downcard.addChild(down_node);
		}
	},
	GetTingList: function () {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("GetTingList not enter room");
			return []
		}
		let roomSet = room.GetRoomSet();
		if (!roomSet) {
			this.ErrLog("GetTingList not roomSet");
			return []
		}
		let setRound = roomSet.GetRoomSetProperty("setRound");
		let opPosList = setRound["opPosList"];
		//如果当前客户端玩家杆的类型
		let posCount = opPosList.length;
		let clientPos = room.GetRoomPosMgr().GetClientPos();
		let tingCardMap = {};
		for (let index_pos = 0; index_pos < posCount; index_pos++) {
			let actionInfo = opPosList[index_pos];
			let waitOpPos = actionInfo["waitOpPos"];
			if (clientPos != waitOpPos) {
				continue
			}
			tingCardMap = actionInfo["tingCardMap"];
		}
		let tinglist = [];
		for (let key in tingCardMap) {
			tinglist.push(key);
		}
		return tinglist;
	},
	//获取本家听牌
	GetBuChuList: function () {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("GetTingCardMap not enter room");
			return []
		}
		let roomSet = room.GetRoomSet();
		if (!roomSet) {
			this.ErrLog("GetTingCardMap not roomSet");
			return []
		}
		let setRound = roomSet.GetRoomSetProperty("setRound");
		let opPosList = setRound["opPosList"];
		//如果当前客户端玩家杆的类型
		let posCount = opPosList.length;
		let clientPos = room.GetRoomPosMgr().GetClientPos();
		let buChuList = [];
		for (let index_pos = 0; index_pos < posCount; index_pos++) {
			let actionInfo = opPosList[index_pos];
			let waitOpPos = actionInfo["waitOpPos"];
			if (clientPos != waitOpPos) {
				continue
			}
			if (actionInfo["buChuList"]) {
				buChuList = actionInfo["buChuList"];
			}
		}
		return buChuList;
	},
	//获取本家听牌
	GetTingCardMap: function () {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("GetTingCardMap not enter room");
			return []
		}
		let roomSet = room.GetRoomSet();
		if (!roomSet) {
			this.ErrLog("GetTingCardMap not roomSet");
			return []
		}
		let setRound = roomSet.GetRoomSetProperty("setRound");
		let opPosList = setRound["opPosList"];
		//如果当前客户端玩家杆的类型
		let posCount = opPosList.length;
		let clientPos = room.GetRoomPosMgr().GetClientPos();
		let tingCardMap = [];
		for (let index_pos = 0; index_pos < posCount; index_pos++) {
			let actionInfo = opPosList[index_pos];
			let waitOpPos = actionInfo["waitOpPos"];
			if (clientPos != waitOpPos) {
				continue
			}
			if (actionInfo["tingCardMap"]) {
				tingCardMap = actionInfo["tingCardMap"];
			}
		}
		return tingCardMap;
	},
	HideAllChild: function () {
		this.btn_in.active = 0;
		this.card.active = 0;
		this.SwitchTouch(false);
		this.downcard.active = 0;
		this.sp_tishi.active = 0;
	},
	//显示玩家所有手牌
	ShowAllPlayerCard: function (room) {
		var jin1 = this.RoomSet.get_jin1();
		var jin2 = this.RoomSet.get_jin2();
		this.card.active = 1;
		this.SwitchTouch(true);
		let setPos = room.GetClientPlayerSetPos();
		let shouCardList = setPos.GetSetPosProperty("shouCard");
		// let daList=setPos.GetSetPosProperty("daList");

		let count = shouCardList.length;
		for (let index = 0; index < count; index++) {
			let cardID = shouCardList[index];
			let btnPath = this.ComTool.StringAddNumSuffix("card/btn_", index + 1, 2);
			let btnNode = this.GetWndNode(btnPath);
			if (!btnNode) {
				this.ErrLog("ShowAllPlayerCard not find:%s", btnPath);
				continue
			}
			btnNode.active = 1;
			btnNode.y = this.InitBtnCardPosY;
			let cardNode = btnNode.getChildByName("card");
			btnNode.getChildByName('tip').active = false;
			let showcardnode = cardNode.getComponent(app.subGameName + "_UIMJCard01_Card");
			showcardnode.ShowCard(cardID, jin1, jin2);
			//显示头搭二搭被搭
			// let daNode = btnNode.getChildByName("da");
			// let dacardnode=daNode.getComponent(app.subGameName+"_UIMJCard01_Card");
			// dacardnode.ShowDa(cardID,daList);
			//显示头搭二搭被搭
		}
		//隐藏其他已经打出去的牌贴图
		for (let card_index = count + 1; card_index <= this.ShareDefine[this.GameTyepStringUp() + "RoomDealPerPosCardCount"]; card_index++) {
			let btnPath = this.ComTool.StringAddNumSuffix("card/btn_", card_index, 2);
			let btnNode = this.GetWndNode(btnPath);
			if (!btnNode) {
				this.ErrLog("ShowAllPlayerCard not find:%s", btnPath);
				continue
			}
			btnNode.active = 0;
			btnNode.y = this.InitBtnCardPosY;
		}
	},

	//-----------------回调函数------------------------
	//set初始化
	OnSetInit: function () {
		let room = this.RoomMgr.GetEnterRoom();
		this.OnRoomPlaying(room);
	},
	//set开始 本家初始化发牌列表
	OnSetStart: function () {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("OnSetStart not enter room");
			return
		}
		this.card.active = 1;
		this.SwitchTouch(true);
		this.allCardNodeList = [];
		//遍历所有牌位置,发牌阶段只能设置控件spriteFrame=null,不能隐藏节点
		for (let card_index = 1; card_index <= this.ShareDefine[this.GameTyepStringUp() + "RoomDealPerPosCardCount"]; card_index++) {
			let btnPath = this.ComTool.StringAddNumSuffix("card/btn_", card_index, 2);
			let btnNode = this.GetWndNode(btnPath);
			if (!btnNode) {
				this.ErrLog("OnSetStart not find:%s", btnPath);
				continue
			}
			btnNode.active = 1;
			btnNode.color = cc.color(255, 255, 255);
			btnNode.getChildByName("tip").active = false;
			btnNode.y = this.InitBtnCardPosY;
			let cardNode = btnNode.getChildByName("card");
			//清除控件的贴图
			let wndSprite = cardNode.getComponent(cc.Sprite);
			wndSprite.spriteFrame = null;
			//this.allCardNodeList.push(cardNode);
		}
		//进牌位
		this.btn_in.active = 1;
		this.btn_in.y = this.InitBtnCardPosY;
		this.btn_in.getChildByName("card").getComponent(cc.Sprite).spriteFrame = "";
		this.chooseNode = null;

	},
	AutoPlay: function () {
		let room = this.RoomMgr.GetEnterRoom();
		this.unlockcard(room);
	},
	//set结束
	OnSetEnd: function (setEnd) {
		this.ShowDownAllCard(setEnd);
	},
	//本家摸进一张牌
	OnPosGetCard: function () {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("OnPosGetCard not enter room");
			return
		}
		this.ShowHandCard(room);
		//摸到牌关闭提示
		this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIMJKeHu");
	},
	//本家出牌动作结束
	OnPosActionEnd: function () {

		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("OnPosActionEnd not enter room");
			return
		}

		if (this.chooseNode) {
			//隐藏打出去的牌节点
			this.chooseNode.active = 0;
			this.chooseNode = null;
		}

		this.ShowAllPlayerCard(room);
		this.ShowHandCard(room);
		this.ShowDownCard(room);

		//判断是否可以听牌了
		let setPos = room.GetClientPlayerSetPos();
		let huCard = setPos.GetSetPosProperty("huCard");
		let shouCard = setPos.GetSetPosProperty("shouCard");
		let haveCount = shouCard.length;
		let handCard = setPos.GetSetPosProperty("handCard");
		if (handCard > 0) {
			haveCount += 1;
		}
		if (huCard.length) {
			this.FormManager.ShowForm("game/base/ui/majiang/" + app.subGameName + "_UIMJKeHu");
		}
		else {
			this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIMJKeHu");
		}
	},
	PengCardUp: function (room) {
		let LastOpCard = this.GetLastOpCard();
		let setPos = room.GetClientPlayerSetPos();
		let shouCardList = setPos.GetSetPosProperty("shouCard");
		let count = shouCardList.length;
		for (let index = 0; index < count; index++) {
			let cardID = shouCardList[index];
			let btnPath = this.ComTool.StringAddNumSuffix("card/btn_", index + 1, 2);
			let btnNode = this.GetWndNode(btnPath);
			if (!btnNode) {
				this.ErrLog("ShowAllPlayerCard not find:%s", btnPath);
				continue
			}
			if (Math.floor(LastOpCard / 100) != Math.floor(cardID / 100)) {
				btnNode.y = this.InitBtnCardPosY;
			} else {
				btnNode.y = this.PenCardAddOffY;
			}
		}
	},
	//获取本家当前吃牌列表
	GetOpChiList: function () {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("GetOpTypeList not enter room");
			return []
		}
		let roomSet = room.GetRoomSet();
		if (!roomSet) {
			this.ErrLog("GetOpTypeList not roomSet");
			return []
		}
		let setRound = roomSet.GetRoomSetProperty("setRound");
		let opPosList = setRound["opPosList"];
		//如果当前客户端玩家杆的类型
		let posCount = opPosList.length;
		let clientPos = room.GetRoomPosMgr().GetClientPos();
		let chiList = [];
		for (let index_pos = 0; index_pos < posCount; index_pos++) {
			let actionInfo = opPosList[index_pos];
			let waitOpPos = actionInfo["waitOpPos"];
			if (clientPos != waitOpPos) {
				continue
			}
			chiList = actionInfo["chiList"];
		}
		return chiList
	},
	ChiCardUp: function (room) {
		let UpCardType = new Array();
		let UpCardList = new Array();
		let chiList = this.GetOpChiList();
		//获取上家打的最后一张牌
		let OutCardID = this.GetLastOpCard();
		for (let index = 0; index < chiList.length; index++) {
			UpCardType[Math.floor(chiList[index][0] / 100)] = 1;
			UpCardType[Math.floor(chiList[index][1] / 100)] = 1;
			UpCardType[Math.floor(chiList[index][2] / 100)] = 1;
		}
		let LastOpCard = this.GetLastOpCard();
		let setPos = room.GetClientPlayerSetPos();
		let shouCardList = setPos.GetSetPosProperty("shouCard");
		let count = shouCardList.length;
		for (let index = 0; index < count; index++) {
			let cardID = shouCardList[index];
			let btnPath = this.ComTool.StringAddNumSuffix("card/btn_", index + 1, 2);
			let btnNode = this.GetWndNode(btnPath);
			if (!btnNode) {
				this.ErrLog("ShowAllPlayerCard not find:%s", btnPath);
				continue
			}
			for (let index2 = 0; index2 < UpCardType.length; index2++) {
				if (Math.floor(OutCardID / 100) != Math.floor(cardID / 100) && Math.floor(cardID / 100) == index2 && UpCardType[index2] == 1) {
					if (UpCardList[Math.floor(cardID / 100)]) {
						btnNode.y = this.InitBtnCardPosY;
					} else {
						UpCardList[Math.floor(cardID / 100)] = 1;
						btnNode.y = this.PenCardAddOffY;
					}
					break;
				}
			}
		}
	},
	//显示玩家所有手牌
	ShowAllPlayerCard: function (room) {
		var jin1 = this.RoomSet.get_jin1();
		var jin2 = this.RoomSet.get_jin2();
		this.card.active = 1;
		this.SwitchTouch(true);
		let setPos = room.GetClientPlayerSetPos();
		let shouCardList = setPos.GetSetPosProperty("shouCard");
		// let daList=setPos.GetSetPosProperty("daList");

		let count = shouCardList.length;
		for (let index = 0; index < count; index++) {
			let cardID = shouCardList[index];
			let btnPath = this.ComTool.StringAddNumSuffix("card/btn_", index + 1, 2);
			let btnNode = this.GetWndNode(btnPath);
			if (!btnNode) {
				this.ErrLog("ShowAllPlayerCard not find:%s", btnPath);
				continue
			}
			btnNode.active = 1;
			btnNode.y = this.InitBtnCardPosY;
			let cardNode = btnNode.getChildByName("card");
			btnNode.getChildByName('lock').active = false;
			btnNode.getChildByName('tip').active = false;
			let showcardnode = cardNode.getComponent(app.subGameName + "_UIMJCard01_Card");
			showcardnode.ShowCard(cardID, jin1, jin2);
			//显示头搭二搭被搭
			// let daNode = btnNode.getChildByName("da");
			// let dacardnode=daNode.getComponent(app.subGameName+"_UIMJCard01_Card");
			// dacardnode.ShowDa(cardID,daList);
			//显示头搭二搭被搭
		}
		//隐藏其他已经打出去的牌贴图
		for (let card_index = count + 1; card_index <= this.ShareDefine[this.GameTyepStringUp() + "RoomDealPerPosCardCount"]; card_index++) {
			let btnPath = this.ComTool.StringAddNumSuffix("card/btn_", card_index, 2);
			let btnNode = this.GetWndNode(btnPath);
			if (!btnNode) {
				this.ErrLog("ShowAllPlayerCard not find:%s", btnPath);
				continue
			}
			btnNode.active = 0;
			btnNode.y = this.InitBtnCardPosY;
		}
	},
	//显示玩家手牌
	ShowHandCard: function (room) {
		this.btn_in.active = 1;
		var jin1 = this.RoomSet.get_jin1();
		var jin2 = this.RoomSet.get_jin2();
		let setPos = room.GetClientPlayerSetPos();
		let handCard = setPos.GetSetPosProperty("handCard");
		this.btn_in.y = this.InitBtnCardPosY;
		if (handCard <= 0) {
			this.btn_in.getChildByName("card").getComponent(cc.Sprite).spriteFrame = '';
			this.btn_in.getChildByName("lock").active = false;
			this.btn_in.getChildByName('tip').active = false;
		}
		else {
			//进牌位
			this.SoundManager.PlaySound("mopai");
			let cardNode = this.btn_in.getChildByName("card");
			let handcardnode = cardNode.getComponent(app.subGameName + "_UIMJCard01_Card");
			handcardnode.ShowHandCard(handCard, jin1, jin2);
				}
	},
	//关闭出牌动作提示
	OnClosePosActionHelp: function () {
		this.sp_tishi.active = 0;
	},

	//如果是牌局初始化阶段
	OnRoomInit: function (room) {
		this.HideAllChild();
	},
	//如果是牌局开始阶段
	OnRoomPlaying: function (room) {
		let roomSet = room.GetRoomSet();
		let setState = roomSet.GetRoomSetProperty("state");

		this.HideAllChild();

		if (setState == this.ShareDefine.SetState_Init) {
			//add by xiaofu
			//
			//add by xiaofu
		}
		else if (setState == this.ShareDefine.SetState_Playing) {
			this.ShowHandCard(room);
			this.ShowAllPlayerCard(room);
			this.ShowDownCard(room);
			//可能重登了,需要显示出牌提示
			this.OnShowPosActionHelp();
		}
		else {
			/*let roomSetID = room.GetRoomProperty("setID");
			let playerReadyState = this.RoomMgr.GetEnterRoom().GetRoomPosMgr().GetPlayerReadyState(roomSetID);
			//可能重登了,需要根据客户端玩家准备状态显示card
			if(!playerReadyState){
				this.ShowDownCard(room);
				this.ShowDownAllCard(false);
			}*/
		}
	},
	//显示本家吃到的卡牌
	ShowDownCard: function () {
		this.downcard.active = 1;
		let UICard_Down = this.downcard.getComponent(app.subGameName + "_UIMJCard_Down");
		UICard_Down.ShowAllOutEatCard();
	},
	//房间结束,显示所有底牌
	OnRoomEnd: function (room) {
		this.HideAllChild();
	},

	//计时器回调
	OnUpdate: function () {

	},
	//摊牌
	ShowDownAllCard: function (setEnd) {
		if (setEnd == false) {
			setEnd = this.RoomSet.GetRoomSetProperty("setEnd");
		}
		let posResultList = setEnd["posResultList"];
		if (typeof(posResultList) == "undefined") {
			return;
		}
		this.SwitchTouch(false);
		this.btn_in.on(cc.Node.EventType.TOUCH_START, this.OnTouch, this);
		this.btn_in.on(cc.Node.EventType.TOUCH_END, this.OnTouch, this);
		this.btn_in.on(cc.Node.EventType.TOUCH_MOVE, this.OnTouch, this);
		this.btn_in.on(cc.Node.EventType.TOUCH_CANCEL, this.OnTouch, this);
		var jin1 = this.RoomSet.get_jin1();
		var jin2 = this.RoomSet.get_jin2();
		let RoomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
		let clientPos = RoomPosMgr.GetClientPos();
		let shouCardList = posResultList[clientPos].shouCard;
		let count = shouCardList.length;
		for (let index = 0; index < count; index++) {
			let cardID = shouCardList[index];
			let btnPath = this.ComTool.StringAddNumSuffix("card/btn_", index + 1, 2);
			let btnNode = this.GetWndNode(btnPath);
			if (!btnNode) {
				this.ErrLog("ShowAllPlayerCard not find:%s", btnPath);
				continue
			}
			btnNode.active = 1;
			btnNode.y = this.InitBtnCardPosY;
			btnNode.getChildByName('tip').active = false;
			let cardNode = btnNode.getChildByName("card");
			let showcardnode = cardNode.getComponent(app.subGameName + "_UIMJCard01_Card");
			showcardnode.ShowCard(cardID, jin1, jin2, true);
		}
		//隐藏其他已经打出去的牌贴图
		for (let card_index = count + 1; card_index <= this.ShareDefine[this.GameTyepStringUp() + "RoomDealPerPosCardCount"]; card_index++) {
			let btnPath = this.ComTool.StringAddNumSuffix("card/btn_", card_index, 2);
			let btnNode = this.GetWndNode(btnPath);
			if (!btnNode) {
				this.ErrLog("ShowAllPlayerCard not find:%s", btnPath);
				continue
			}
			btnNode.active = 0;
			btnNode.y = this.InitBtnCardPosY;
		}
		//显示手牌
		let handCard = posResultList[clientPos].handCard;
		this.btn_in.y = this.InitBtnCardPosY;
		this.btn_in.getChildByName('tip').active = false;
		if (handCard <= 0) {
			this.btn_in.getChildByName("card").getComponent(cc.Sprite).spriteFrame = '';
		}
		else {
			let cardNode = this.btn_in.getChildByName("card");
			let handcardnode = cardNode.getComponent(app.subGameName + "_UIMJCard01_Card");
			handcardnode.ShowHandCard(handCard, jin1, jin2, true);
		}
	},
	//发牌阶段
	OpenCardEffect: function (cardIDList) {
		var jin1 = this.RoomSet.get_jin1();
		var jin2 = this.RoomSet.get_jin2();
		let count = cardIDList.length;
		for (let index = 0; index < count; index++) {
			let cardID = cardIDList[index];
			let cardNode = this.allCardNodeList.shift();
			if (!cardNode) {
				this.ErrLog("OpenCardEffect allCardNodeList(%s) index(%s) not find cardNode", this.allCardNodeList.length, index, cardIDList);
				continue
			}
			cardNode.y = this.InitBtnCardPosY;
			let opcard = cardNode.getComponent(app.subGameName + "_UIMJCard01_Card");
			opcard.OpenCard(cardID, jin1, jin2);

		}
	},

	//发牌完整理牌阶段
	OpenCardEffect2: function () {
		var jin1 = this.RoomSet.get_jin1();
		var jin2 = this.RoomSet.get_jin2();
		app[app.subGameName + "_SoundManager"]().PlaySound("paizhengli");
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("OpenCardEffect2 not enter room");
			return
		}
		let setPos = room.GetClientPlayerSetPos();
		let huCard = setPos.GetSetPosProperty("huCard");
		let shouCard = setPos.GetSetPosProperty("shouCard");
		let cardIDList = shouCard.slice();
		let haveCount = shouCard.length;
		let handCard = setPos.GetSetPosProperty("handCard");
		for (let card_index = 1; card_index <= this.ShareDefine[this.GameTyepStringUp() + "RoomDealPerPosCardCount"]; card_index++) {
			let cardID = cardIDList[card_index - 1];
			let btnPath = this.ComTool.StringAddNumSuffix("card/btn_", card_index, 2);
			let btnNode = this.GetWndNode(btnPath);
			if (!btnNode) {
				this.ErrLog("OpenCardEffect2 not find:%s", btnPath);
				continue
			}
			btnNode.getChildByName('card').getComponent(app.subGameName + "_UIMJCard01_Card").OpenCard2(cardID, jin1, jin2);
		}
		if (handCard > 0) {
			haveCount += 1;
		}
		this.ShowHandCard(room);
		if (huCard.length) {
			this.FormManager.ShowForm("game/base/ui/majiang/" + app.subGameName + "_UIMJKeHu");
		}
		else {
			this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIMJKeHu");
		}
	},
	//获取最近打出的那张牌
	GetLastOpCard: function () {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("GetOpTypeList not enter room");
			return []
		}
		let roomSet = room.GetRoomSet();
		if (!roomSet) {
			this.ErrLog("GetOpTypeList not roomSet");
			return []
		}
		let setRound = roomSet.GetRoomSetProperty("setRound");
		let opPosList = setRound["opPosList"];
		//如果当前客户端玩家杆的类型
		let posCount = opPosList.length;
		let clientPos = room.GetRoomPosMgr().GetClientPos();
		let LastOpCard = 0;
		for (let index_pos = 0; index_pos < posCount; index_pos++) {
			let actionInfo = opPosList[index_pos];
			let waitOpPos = actionInfo["waitOpPos"];
			if (clientPos != waitOpPos) {
				continue
			}
			LastOpCard = actionInfo["LastOpCard"];
		}
		return LastOpCard
	},
	//获取本家当前出牌动作类型列表
	GetOpTypeList: function () {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("GetOpTypeList not enter room");
			return []
		}
		let roomSet = room.GetRoomSet();
		if (!roomSet) {
			this.ErrLog("GetOpTypeList not roomSet");
			return []
		}
		let setRound = roomSet.GetRoomSetProperty("setRound");
		let opPosList = setRound["opPosList"];
		//如果当前客户端玩家杆的类型
		let posCount = opPosList.length;
		let clientPos = room.GetRoomPosMgr().GetClientPos();
		let opList = [];
		for (let index_pos = 0; index_pos < posCount; index_pos++) {
			let actionInfo = opPosList[index_pos];
			let waitOpPos = actionInfo["waitOpPos"];
			if (clientPos != waitOpPos) {
				continue
			}
			opList = actionInfo["opList"];
		}
		return opList
	},
	haveHua: function () {
		let room = this.RoomMgr.GetEnterRoom();
		let setPos = room.GetClientPlayerSetPos();
		if (!setPos) {
			this.ErrLog("Click_btn_gang not find setPos");
			return
		}
		let handCard = setPos.GetSetPosProperty("handCard");
		if (handCard > 5000) {
			return true;
		}
		let shouCard = setPos.GetSetPosProperty("shouCard");
		for (let index = 0; index < shouCard.length; index++) {
			let cardID = shouCard[index];
			if (cardID > 5000) {
				return true;
			}
		}
		return false;
	},
	//---------获取函数--------------
	CheckCanTouch: function () {
		//如果还在发牌阶段不能出牌
		if (this.allCardNodeList.length)
			return false;

		//是否允许出牌
		let opTypeList = this.GetOpTypeList();
		if (!opTypeList.InArray(this.ShareDefine.OpType_Out)) {
			return false;
		}
		if (this.haveHua() == true) {
			return false;
		}
		//如果存在取消,需要取消才能打牌
		if (this.actionWndNameList.InArray("btn_cancel")) {
			return false;
		}

		return this.canTouch;
	},
	SwitchTouch: function (reg) {
		for (let i = 0; i < this.card.children.length; i++) {
			let cardBtn = this.card.children[i];
			if (reg) {
				cardBtn.on(cc.Node.EventType.TOUCH_START, this.OnTouch, this);
				cardBtn.on(cc.Node.EventType.TOUCH_END, this.OnTouch, this);
				cardBtn.on(cc.Node.EventType.TOUCH_MOVE, this.OnTouch, this);
				cardBtn.on(cc.Node.EventType.TOUCH_CANCEL, this.OnTouch, this);
			}
			else {
				cardBtn.off(cc.Node.EventType.TOUCH_START, this.OnTouch, this);
				cardBtn.off(cc.Node.EventType.TOUCH_END, this.OnTouch, this);
				cardBtn.off(cc.Node.EventType.TOUCH_MOVE, this.OnTouch, this);
				cardBtn.off(cc.Node.EventType.TOUCH_CANCEL, this.OnTouch, this);
			}
		}
		if (reg) {
			this.btn_in.on(cc.Node.EventType.TOUCH_START, this.OnTouch, this);
			this.btn_in.on(cc.Node.EventType.TOUCH_END, this.OnTouch, this);
			this.btn_in.on(cc.Node.EventType.TOUCH_MOVE, this.OnTouch, this);
			this.btn_in.on(cc.Node.EventType.TOUCH_CANCEL, this.OnTouch, this);
		}
		else {
			this.btn_in.off(cc.Node.EventType.TOUCH_START, this.OnTouch, this);
			this.btn_in.off(cc.Node.EventType.TOUCH_END, this.OnTouch, this);
			this.btn_in.off(cc.Node.EventType.TOUCH_MOVE, this.OnTouch, this);
			this.btn_in.off(cc.Node.EventType.TOUCH_CANCEL, this.OnTouch, this);
		}
	},
	OnTouch: function (event) {
		if (!this.CheckCanTouch()) {
			return;
		}
		let touchNode = event.target;
		let lock = touchNode.getChildByName('lock');
		if (lock) {
			if (lock.active == true) {
				return;
			}
		}

		if ('touchstart' == event.type) {
			if (this.chooseNode != event.target) {
				this.chooseNode = null;
			}
			let cards = this.card.children;
			for (let i = 0; i < cards.length; i++) {
				if (cards[i] == event.target)
					continue;
				cards[i].y = this.InitBtnCardPosY;
			}
			if (event.target != this.btn_in) {
				this.btn_in.y = this.InitBtnCardPosY;
			}
			this.touchStartY = event.getLocationY();
			console.log("touch touchStartY：" + this.touchStartY);
		}
		else if ('touchend' == event.type || 'touchcancel' == event.type) {
			let is3DShow = app.LocalDataManager().GetConfigProperty("SysSetting", app.subGameName + "_is3DShow");
			this.touchEndY = event.getLocationY();
			console.log("touch touchEndY:" + this.touchEndY);
			if ((this.touchEndY - this.touchStartY) > 50) {
				//直接出牌
				this.chooseNode = event.target;
				this.ChooseCardNode(event.target);
				this.chooseNode = null;
			} else if (this.touchEndY >= this.touchStartY) {
				//选中牌
				if (this.chooseNode == null) {
					this.chooseNode = event.target;
					event.target.y = this.ChooseCardAddOffY;
					let clickCardType = event.target.getChildByName("card").getComponent(app.subGameName + "_UIMJCard01_Card").GetCardID();
					let GetTingCardMap = this.GetTingCardMap();
					let CardType = Math.floor(clickCardType / 100);
					if (GetTingCardMap[CardType]) {
						this.ShowTingPai(GetTingCardMap[CardType]);
					} else {
						this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIMJHuPai");
						this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIMJWBHuPai");
					}
					event.target.y = this.ChooseCardAddOffY;
					if (is3DShow == 0) {
						this.FormManager.GetFormComponentByFormName("game/" + this.GameTyepStringUp() + "/ui/UI" + this.GameTyepStringUp() + "2DPlay").Evt_OutCardTip(clickCardType);
					} else if (is3DShow == 1) {
						this.FormManager.GetFormComponentByFormName("game/" + this.GameTyepStringUp() + "/ui/UI" + this.GameTyepStringUp() + "Play").Evt_OutCardTip(clickCardType);
					} else {
						this.FormManager.GetFormComponentByFormName("game/" + this.GameTyepStringUp() + "/ui/UI" + this.GameTyepStringUp() + "WBPlay").Evt_OutCardTip(clickCardType);
					}
				} else {
					this.chooseNode = event.target;
					event.target.y = this.ChooseCardAddOffY;
					this.ChooseCardNode(event.target);
					this.chooseNode = null;
					if (is3DShow == 0) {
						this.FormManager.GetFormComponentByFormName("game/" + this.GameTyepStringUp() + "/ui/UI" + this.GameTyepStringUp() + "2DPlay").Evt_OutCardTip(0);
					} else if (is3DShow == 1) {
						this.FormManager.GetFormComponentByFormName("game/" + this.GameTyepStringUp() + "/ui/UI" + this.GameTyepStringUp() + "Play").Evt_OutCardTip(0);
					} else {
						this.FormManager.GetFormComponentByFormName("game/" + this.GameTyepStringUp() + "/ui/UI" + this.GameTyepStringUp() + "WBPlay").Evt_OutCardTip(0);
					}
				}
			} else {
				this.chooseNode = null;
				event.target.y = this.InitBtnCardPosY;
			}
		}

		else if ('touchmove' == event.type) {
			if (this.chooseNode == null) {
				event.target.y = event.getLocationY() - this.touchStartY;
			} else {
				event.target.y = event.getLocationY() - this.touchStartY + this.ChooseCardAddOffY;
			}
		}

	},
	Click_btn_in: function () {
		this.ChooseCardNode(this.btn_in);
	},

	Click_card: function (btnName, btnNode) {
		this.ChooseCardNode(btnNode);
	},

	//如果取消胡
	Click_btn_cancel: function () {
		if (this.actionWndNameList.InArray("btn_cancel")) {
			this.actionWndNameList.Remove("btn_cancel");
			this.sp_tishi.active = 0;
			this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIChooseCard");
			this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIChooseChi");
		}
		else {
			this.ErrLog("Click_btn_cancel not find btn_cancel");
		}
	},
	//如果单游
	Click_btn_danyou: function () {
		this.sp_tishi.active = 0;
		let opList = this.GetOpTypeList();
		let opType = this.ShareDefine.OpType_DanYou;
		this.RoomMgr.SendPosAction(0, opType);
	},
	//如果双游
	Click_btn_shuangyou: function () {
		this.sp_tishi.active = 0;
		let opList = this.GetOpTypeList();
		let opType = this.ShareDefine.OpType_ShuangYou;
		this.RoomMgr.SendPosAction(0, opType);
	},
	//如果三游
	Click_btn_sanyou: function () {
		this.sp_tishi.active = 0;
		let opList = this.GetOpTypeList();
		let opType = this.ShareDefine.OpType_SanYou;
		this.RoomMgr.SendPosAction(0, opType);
	},
	//如果抢金
	Click_btn_qiangjin: function () {
		this.sp_tishi.active = 0;
		let opList = this.GetOpTypeList();
		let opType = this.ShareDefine.OpType_QiangJin;
		this.RoomMgr.SendPosAction(0, opType);
	},
	//如果三金倒
	Click_btn_sanjin: function () {
		this.sp_tishi.active = 0;
		let opList = this.GetOpTypeList();
		let opType = this.ShareDefine.OpType_SanJinDao;
		this.RoomMgr.SendPosAction(0, opType);
	},
	//如果四金倒
	Click_btn_sijin: function () {
		this.sp_tishi.active = 0;
		let opList = this.GetOpTypeList();
		let opType = this.ShareDefine.OpType_SiJinDao;
		this.RoomMgr.SendPosAction(0, opType);
	},
	//如果五金倒
	Click_btn_wujin: function () {
		this.sp_tishi.active = 0;
		let opList = this.GetOpTypeList();
		let opType = this.ShareDefine.OpType_WuJinDao;
		this.RoomMgr.SendPosAction(0, opType);
	},
	//如果六金倒
	Click_btn_liujin: function () {
		this.sp_tishi.active = 0;
		let opList = this.GetOpTypeList();
		let opType = this.ShareDefine.OpType_LiuJinDao;
		this.RoomMgr.SendPosAction(0, opType);
	},
	//如果过
	Click_btn_next: function () {
		this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIChooseChi");
		this.sp_tishi.active = 0;
		this.RoomMgr.SendPosAction(0, this.ShareDefine.OpType_Pass);
	},
	//如果过
	Click_btn_tianting: function () {
		this.sp_tishi.active = 0;
		this.RoomMgr.SendPosAction(0, this.ShareDefine.OpType_TianTing);
	},
	//抢金过
	Click_btn_sqpass: function () {
		app[app.subGameName + "Client"].OnEvent("EVT_ClosePosActionHelp", null);
		this.sp_tishi.active = 0;
		this.RoomMgr.SendSqPass(0, this.ShareDefine.OpType_SQPass);
	},

	//如果碰
	Click_btn_pen: function () {
		this.sp_tishi.active = 0;
		this.RoomMgr.SendPosAction(0, this.ShareDefine.OpType_Peng);
	},
	Click_btn_mo: function () {
		this.sp_tishi.active = 0;
		this.RoomMgr.SendPosAction(0, this.ShareDefine.OpType_Mo);
	},
	Click_btn_bumo: function () {
		this.sp_tishi.active = 0;
		this.RoomMgr.SendPosAction(0, this.ShareDefine.OpType_BuMo);
	},
	Click_btn_chi: function () {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("OnPosActionEnd not enter room");
			return
		}
		this.sp_tishi.active = 0;
		let roomSet = room.GetRoomSet();
		if (!roomSet) {
			this.ErrLog("GetOpTypeList not roomSet");
			return []
		}
		let chiList = this.GetOpChiList();
		console.log("Click_btn_chi chiList:", chiList);
		//获取上家打的最后一张牌
		let OutCardID = this.GetLastOpCard();
		if (chiList.length == 1) {
			this.RoomMgr.SendPosAction(chiList[0][0], this.ShareDefine.OpType_Chi);
			return;
		}
		this.FormManager.ShowForm("game/base/ui/majiang/" + app.subGameName + "_UIWBChooseChi", chiList, OutCardID);
	},
	//如果杆
	Click_btn_gang: function () {

		let room = this.RoomMgr.GetEnterRoom();
		let setPos = room.GetClientPlayerSetPos();
		if (!setPos) {
			this.ErrLog("Click_btn_gang not find setPos");
			return
		}
		let handCard = setPos.GetSetPosProperty("handCard");
		let shouCard = setPos.GetSetPosProperty("shouCard");
		let publicCardList = setPos.GetSetPosProperty("publicCardList");

		let cardTypeDict = {};

		//手上有的牌，加上手牌
		let haveCardList = [];
		for (let i = 0; i < shouCard.length; i++) {
			haveCardList.push(shouCard[i]);
		}
		if (handCard > 0) {
			haveCardList.push(handCard);
		}

		//手牌中的卡
		let count = haveCardList.length;
		for (let index = 0; index < count; index++) {
			let cardID = haveCardList[index];
			let cardType = Math.floor(cardID / 100);
			if (cardTypeDict.hasOwnProperty(cardType)) {
				cardTypeDict[cardType].push(cardID);
			}
			else {
				cardTypeDict[cardType] = [cardID];
			}
		}

		//碰吃到的卡牌
		let publicCardTypeDict = {};
		let publicCount = publicCardList.length;
		for (let index = 0; index < publicCount; index++) {
			let publicInfoList = publicCardList[index];
			if (publicInfoList[0] != this.ShareDefine.OpType_Peng) {
				continue
			}
			let cardID = publicInfoList[3];
			let cardType = Math.floor(cardID / 100);
			publicCardTypeDict[cardType] = 1;
		}

		let opList = this.GetOpTypeList();
		let gangArray = [];
		//如果是别人打出的牌我可以接杠
		this.sp_tishi.active = 0;
		if (opList.InArray(this.ShareDefine.OpType_JieGang)) {
			this.RoomMgr.SendPosAction(0, this.ShareDefine.OpType_JieGang);
			return;
		}
		if (opList.InArray(this.ShareDefine.OpType_Gang)) {
			let count = haveCardList.length;
			for (let index = 0; index < count; index++) {
				let cardID = haveCardList[index];
				let cardType = Math.floor(cardID / 100);
				if (publicCardTypeDict.hasOwnProperty(cardType)) {
					gangArray.push({'cardID': cardID, "OpType": this.ShareDefine.OpType_Gang});
				}
			}
		}
		if (opList.InArray(this.ShareDefine.OpType_AnGang)) {
			for (let cardType in cardTypeDict) {
				if (cardTypeDict[cardType].length == 4) {
					gangArray.push({'cardID': Math.floor(cardType + "01"), "OpType": this.ShareDefine.OpType_AnGang});
				}
			}
		}
		if (gangArray.length == 0) {
			this.ErrLog("Click_btn_gang not find gangType opList:", opList);
			return
		} else if (gangArray.length == 1) {
			this.RoomMgr.SendPosAction(gangArray[0].cardID, gangArray[0].OpType);
		} else {
			this.FormManager.ShowForm("game/base/ui/majiang/" + app.subGameName + "_UIChooseCard", gangArray);
		}
	},
	Click_btn_ting: function () {
		let room = this.RoomMgr.GetEnterRoom();
		let setPos = room.GetClientPlayerSetPos();
		let shouCard = setPos.GetSetPosProperty("shouCard");
		let handCard = setPos.GetSetPosProperty("handCard");
		let cardIDList = shouCard.slice();
		let tingList = this.GetTingList();
		for (var i = 0; tingList.length > i; i++) {
			for (var j = 0; cardIDList.length > j; j++) {
				if (cardIDList[j] == tingList[i]) {
					let btnPath = this.ComTool.StringAddNumSuffix("card/btn_", j + 1, 2);
					let btnNode = this.GetWndNode(btnPath);
					// btnNode.y = this.ChooseCardAddOffY;
					btnNode.getChildByName('tip').active = true;
				} else if (handCard == tingList[i]) {
					// this.btn_in.y = this.ChooseCardAddOffY;
					this.btn_in.getChildByName('tip').active = true;
				}
			}
		}
		this.Click_btn_cancel();
	},
	Click_btn_tingyou: function () {
		let room = this.RoomMgr.GetEnterRoom();
		let setPos = room.GetClientPlayerSetPos();
		let shouCard = setPos.GetSetPosProperty("shouCard");
		let handCard = setPos.GetSetPosProperty("handCard");
		let cardIDList = shouCard.slice();
		//单游或者双游能打出去的牌
		let tingYouList = this.GetYouJinList();
		//当听游牌是一对的时候
		var TingYouCardType = new Array();
		let TingYouCardTypeCount = 0;
		for (var i = 0; tingYouList.length > i; i++) {
			let cardType = Math.floor(tingYouList[i] / 100);
			if (!TingYouCardType[cardType]) {
				TingYouCardType[cardType] = true;
				TingYouCardTypeCount++;
			}
		}
		if (TingYouCardTypeCount >= 1) {
			this.Click_btn_cancel();
			this.RoomMgr.SendPosAction(tingYouList[0], this.ShareDefine.OpType_Out);
			return;
		}

		for (var i = 0; tingYouList.length > i; i++) {
			for (var j = 0; cardIDList.length > j; j++) {
				if (cardIDList[j] == tingYouList[i]) {
					let btnPath = this.ComTool.StringAddNumSuffix("card/btn_", j + 1, 2);
					let btnNode = this.GetWndNode(btnPath);
					// btnNode.y = this.ChooseCardAddOffY;
					btnNode.getChildByName("tip").active = true;
				} else if (handCard == tingYouList[i]) {
					// this.btn_in.y = this.ChooseCardAddOffY;
					this.btn_in.getChildByName("tip").active = true;
				}
			}
		}
		this.Click_btn_cancel();
	},
	OutJin: function () {
		let room = this.RoomMgr.GetEnterRoom();
		let setPos = room.GetClientPlayerSetPos();
		let roomSet = room.GetRoomSet();
		let jin = roomSet.get_jin1();
		let outCardList = setPos.GetSetPosProperty("outCard");
		var new_outCardList = new Array();
		let count = outCardList.length;
		var i = 0;
		for (let index = 0; index < count; index++) {
			let cardID = outCardList[index];
			if (cardID < 5000) {
				new_outCardList[i] = cardID;
				i++;
			}
		}
		let outjin = 0;
		let newCount = new_outCardList.length;
		if (Math.floor(new_outCardList[newCount - 1] / 100) == Math.floor(jin / 100)) {
			outjin++;
		} else {
			return outjin;
		}
		if (Math.floor(new_outCardList[newCount - 2] / 100) == Math.floor(jin / 100)) {
			outjin++;
		}
		return outjin;
	},
	/*
	*判断用户的牌是否可以游金
	 */
	isYouJin: function () {
		let room = this.RoomMgr.GetEnterRoom();
		let roomSet = room.GetRoomSet();
		let jin = roomSet.get_jin1();
		let setPos = room.GetClientPlayerSetPos();
		let shouCard = setPos.GetSetPosProperty("shouCard");
		let cardIDList = shouCard.slice();
		let haveJin = false;
		for (let i = 0; i < cardIDList.length; i++) {
			if (Math.floor(jin / 100) == Math.floor(cardIDList[i] / 100)) {
				haveJin = true;
				break;
			}
		}
		if (haveJin == false) {
			return false;
		}
		let roomPosMgr = room.GetRoomPosMgr();
		let clientPos = roomPosMgr.GetClientPos();
		let huCardTypeInfo = room.GetRoomSet().GetHuCardTypeInfo(clientPos);
		let cardTypeList = Object.keys(huCardTypeInfo);
		cardTypeList.SortList();
		let count = cardTypeList.length;
		if (count >= 30) {
			return true;
		}
		return false;
	},
	isCanOutJin: function () {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("GetOpTypeList not enter room");
			return []
		}
		let roomSet = room.GetRoomSet();
		if (!roomSet) {
			this.ErrLog("GetOpTypeList not roomSet");
			return []
		}
		let jin = roomSet.get_jin1();
		let youjinList = this.GetYouJinList();
		for (let i = 0; i < youjinList.length; i++) {
			if (Math.floor(jin / 100) == Math.floor(youjinList[i] / 100)) {
				return true;
			}
		}
		return false;
	},

	//获取本家游金牌
	GetYouJinList: function () {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("GetOpTypeList not enter room");
			return []
		}
		let roomSet = room.GetRoomSet();
		if (!roomSet) {
			this.ErrLog("GetOpTypeList not roomSet");
			return []
		}
		let jin = roomSet.get_jin1();
		let setRound = roomSet.GetRoomSetProperty("setRound");
		let opPosList = setRound["opPosList"];
		//如果当前客户端玩家杆的类型
		let posCount = opPosList.length;
		let clientPos = room.GetRoomPosMgr().GetClientPos();
		let youjinList = [];
		for (let index_pos = 0; index_pos < posCount; index_pos++) {
			let actionInfo = opPosList[index_pos];
			let waitOpPos = actionInfo["waitOpPos"];
			if (clientPos != waitOpPos) {
				continue
			}
			youjinList = actionInfo["tingYouList"] || [];
		}
		//检车听游金是否有金，如果有金，那就是双游或者三游
		let haveJinArray = [];
		for (let i = 0; i < youjinList.length; i++) {
			if (Math.floor(jin / 100) == Math.floor(youjinList[i] / 100)) {
				haveJinArray.push(youjinList[i]);
			}
		}
		if (haveJinArray.length > 0) {
			return haveJinArray;
		}
		return youjinList;
	},
	CloseSpTiShi: function () {
		this.sp_tishi.active = 0;
	},
	//取消选择出牌
	DeselectCard: function () {
		if (this.chooseNode) {
			this.chooseNode.y = this.InitBtnCardPosY;
			this.chooseNode = null;
		}
	},

	//点击出牌节点,部分麻将游戏会重写，需注意
	ChooseCardNode: function (clickNode) {
		//如果handcard是花，直接取消动作
		let room = this.RoomMgr.GetEnterRoom();
		let setPos = room.GetClientPlayerSetPos();
		let handCard = setPos.GetSetPosProperty("handCard");
		if (handCard > 5000) {
			//用户手中有花，等待服务端通知补花通知，不允许选择出牌
			return
		}
		//如果还在发牌阶段不能出牌
		if (this.allCardNodeList.length) {
			app[app.subGameName + "_SoundManager"]().PlaySound("wufachupai");
			this.Log("ChooseCardNode in doing allCardNodeList");
			return
		}

		//是否允许出牌
		let opTypeList = this.GetOpTypeList();
		if (!opTypeList.InArray(this.ShareDefine.OpType_Out)) {
			this.chooseNode = clickNode;
			this.chooseNode.y = this.InitBtnCardPosY;
			app[app.subGameName + "_SoundManager"]().PlaySound("wufachupai");
			return
		}

		//如果存在取消,需要取消才能打牌
		if (this.actionWndNameList.InArray("btn_cancel")) {
			this.Log("ChooseCardNode actionWndNameList find btn_cancel");
			app[app.subGameName + "_SoundManager"]().PlaySound("wufachupai");
			return
		}

		if (this.chooseNode) {
			//2次选中一样,打出去
			if (this.chooseNode == clickNode) {
				let cardID = this.chooseNode.getChildByName('card').getComponent(app.subGameName + "_UIMJCard01_Card").GetCardID();
				//预先打牌
				this.FormManager.GetFormComponentByFormName("game/" + this.GameTyepStringUp() + "/ui/UI" + this.GameTyepStringUp() + "Play").Pre_OutCard(cardID);
				this.chooseNode.active = 0;
				//预先打牌
				this.RoomMgr.SendPosAction(cardID, this.ShareDefine.OpType_Out);
				this.canTouch = false;
				let self = this;
				setTimeout(function () {
					self.canTouch = true;
				}, 2000);//防止刚打出去立马又touch了
			}
			//2次选中不一样,还原上次选中的坐标,记录新的选中
			else {
				this.chooseNode.y = this.InitBtnCardPosY;
				this.chooseNode = clickNode;
				this.chooseNode.y = this.ChooseCardAddOffY;
			}
		}
		else {
			this.chooseNode = clickNode;
			this.chooseNode.y = this.ChooseCardAddOffY;
		}
	},
	update(){
		let room = this.RoomMgr.GetEnterRoom();
		if (!room || !this.actionWndNameList) {
			return;
		}
		//判断是否可以听牌了
		let setPos = room.GetClientPlayerSetPos();
		if(!setPos) return
		if (this.actionWndNameList.indexOf("btn_danyou") >= 0 ||
			this.actionWndNameList.indexOf("btn_shuangyou") >= 0 ||
			this.actionWndNameList.indexOf("btn_sanyou") >= 0)
			{
				let youjinList = this.GetYouJinList()
				for (let index = 0; index < youjinList.length; index++) {
					if (youjinList[index] >= 1000) {
						youjinList[index] = Math.floor(youjinList[index]/100)
					}
				}
				let shouCard = setPos.GetSetPosProperty("shouCard");
				if(!shouCard || !shouCard.length) return
				let cardIDList = shouCard.slice();
				for (var j = 0; j < cardIDList.length; j++) {
					let btnPath = this.ComTool.StringAddNumSuffix("card/btn_", j+1, 2);
					let btnNode = this.GetWndNode(btnPath);
					if(!btnNode || !btnNode.getChildByName('you')) continue
					if(youjinList.indexOf(Math.floor(cardIDList[j]/100)) >= 0){
						btnNode.getChildByName('you').active=true;
					}
					else{
						btnNode.getChildByName('you').active=false;
					}
				}
				let handCard = setPos.GetSetPosProperty("handCard");
				if (handCard <= 0) {
					this.btn_in.getChildByName("you").active = false
				}
				else{
					if (youjinList.indexOf(Math.floor(handCard/100)) >= 0) {
						this.btn_in.getChildByName("you").active = true
					}
					else{
						this.btn_in.getChildByName("you").active = false
					}
				}
		}else{
			let shouCard = setPos.GetSetPosProperty("shouCard");
			let cardIDList = shouCard.slice();
			for (var j = 0; j < cardIDList.length; j++) {
				let btnPath = this.ComTool.StringAddNumSuffix("card/btn_", j+1, 2);
				let btnNode = this.GetWndNode(btnPath);
				if(!btnNode || !btnNode.getChildByName('you')) continue
				btnNode.getChildByName('you').active=false;
			}
		}
	}
});

module.exports = BaseMaJiangCard01Form;


