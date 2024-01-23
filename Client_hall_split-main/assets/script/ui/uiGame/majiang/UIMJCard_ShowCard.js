/*
 UICard01-04 set结束摊牌
 */

let app = require("app");

cc.Class({
	extends: require("BaseComponent"),

	properties: {
		sp_in: cc.Node,
	},

	// use this for initialization
	OnLoad: function () {
		this.JS_Name = this.node.name + "_UIMJCard_ShowCard";
		this.ComTool = app.ComTool();
		this.SysDataManager = app.SysDataManager();
		this.IntegrateImage = this.SysDataManager.GetTableDict("IntegrateImage");
		this.ChildCount = 16; //最多发16张牌
		this.HideAllChild();
	},

	HideAllChild: function () {
		for (let index = 1; index <= this.ChildCount; index++) {
			let childName = this.ComTool.StringAddNumSuffix("card", index, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				continue
			}
			let cardSprite = childNode.getComponent(cc.Sprite);
			cardSprite.spriteFrame = null;
		}
		this.sp_in.getComponent(cc.Sprite).spriteFrame = null;
	},
	ShowDownCard: function (cardIDList, handCard, jin1, jin2, imageString = "EatCard_Self_") {
		this.ShowDownImg(cardIDList, handCard, imageString, jin1, jin2);
	},
	ShowDownCardHuaJin: function (cardIDList, handCard,imageString = "EatCard_Self_") {
		this.ShowDownImgHuaJin(cardIDList, handCard, imageString);
	},
	ShowDownCardByCXYXMJ: function (cardIDList, huCardList, jin1, jin2, imageString = "EatCard_Self_") {
		this.ShowDownImgByCXYXMJ(cardIDList, huCardList, imageString, jin1, jin2);
	},
	//麻将
	ShowDownCardByJMSKMJ: function (cardIDList, handCard, jin1, jin2, imageString = "EatCard_Self_") {
		this.ShowDownImgByJMSKMJ(cardIDList, handCard, imageString, jin1, jin2);
	},
	//麻将
	ShowDownCardByLLFYMJ: function (cardIDList, handCard, liangPaiList, imageString = "EatCard_Self_") {
		this.ShowDownImgLLFYMJ(cardIDList, handCard, imageString, liangPaiList);
	},
	//武汉麻将
	ShowDownCardByHBWHMJ: function (cardIDList, handCard, jin1, laiZiPiList, specialLaiZiPiList, imageString = "EatCard_Self_") {
		this.ShowDownImgByHBWHMJ(cardIDList, handCard, imageString, jin1, laiZiPiList, specialLaiZiPiList);
	},
	//江都麻将
	ShowDownCardByJDMJ: function (cardIDList, handCard, jin1, jin2, imageString = "EatCard_Self_") {
		this.ShowDownImgByJDMJ(cardIDList, handCard, imageString, jin1, jin2);
	},
	ShowDownCardByJCMJ: function (cardIDList, handCard, jin1, jin2, imageString = "EatCard_Self_") {
		this.ShowDownImgByJCMJ(cardIDList, handCard, imageString, jin1, jin2);
	},
	ShowDownCardByNXKWMJ: function (cardIDList, huCardList, jin1, jin2, jinJin, imageString = "EatCard_Self_") {
		this.ShowDownImgByNXKWMJ(cardIDList, huCardList, imageString, jin1, jin2, jinJin);
	},
	ShowDownImgByNXKWMJ: function (cardIDList, huCardList, imageString, jin1 = 0, jin2 = 0, jinJin = 0) {
		let count = 0;
		if (typeof(cardIDList) != "undefined") {
			count = cardIDList.length;
		}
		for (let index = 0; index < count; index++) {
			let cardID = cardIDList[index];
			let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue
			}
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			this.ShowJinBgByNXKWMJ(cardID, childNode, jin1, jin2, jinJin);
			childNode.active = 1;
			this.ShowImage(childNode, imageString, cardID, jin1, jin2, jinJin);
		}
		//设置多余的卡牌位置空
		for (let cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				continue
			}
			childNode.active = 0;
		}

		//进卡不能控制显影只能设置空图片
		// if (handCard > 0 && handCard != 5000) {
		// 	this.sp_in.active = 1;
		// 	this.ShowJinBg(handCard, this.sp_in, jin1, jin2);
		// 	this.ShowImage(this.sp_in, imageString, handCard, jin1, jin2);
		// } else {
		// 	this.sp_in.getComponent(cc.Sprite).spriteFrame = "";
		// 	if (this.sp_in.getChildByName("da")) {
		// 		this.sp_in.getChildByName("da").active = false;
		// 	}
		// 	this.sp_in.UserData = null;
		// }
		this.sp_in.active = huCardList[0] > 0;
		if (huCardList[0] > 0) {
			this.ShowHuCardNodeByNXKWMJ(this.sp_in, huCardList[0], imageString, jin1, jin2, jinJin);
		}
		this.sp_in2 = this.node.getChildByName("sp_in2");
		this.sp_in2.active = huCardList[1] > 0;
		if (huCardList[1] > 0) {
			this.ShowHuCardNodeByNXKWMJ(this.sp_in2, huCardList[1], imageString, jin1, jin2, jinJin);
		}
	},
	ShowJinBgByNXKWMJ: function (cardID, childNode, jin1 = 0, jin2 = 0, jinJin) {
		if (jin1 == 0) {
			if (this.RoomMgr == null) {
				return;
			}
			let room = this.RoomMgr.GetEnterRoom();
			if (!room) return;
			let roomSet = room.GetRoomSet();
			if (roomSet) {
				jin1 = roomSet.get_jin1();
				jin2 = roomSet.get_jin2();
				jinJin = roomSet.get_jinJin();
			}
		}
		if (cardID > 0) {
			if (childNode.getChildByName('icon_chun')) {
				childNode.getChildByName('icon_chun').active = false;
			}
			if (childNode.getChildByName('icon_zheng')) {
				childNode.getChildByName('icon_zheng').active = false;
			}
			if (childNode.getChildByName('da')) {
				childNode.getChildByName('da').active = false;
			}
			if (Math.floor(cardID / 100) == Math.floor(jin1 / 100)) {
				childNode.color = cc.color(255, 255, 125);
				if (childNode.getChildByName('icon_chun')) {
					childNode.getChildByName('icon_chun').active = true;
				}
			} else if (Math.floor(cardID / 100) == Math.floor(jin2 / 100)) {
				childNode.color = cc.color(255, 255, 125);
				if (childNode.getChildByName('icon_chun')) {
					childNode.getChildByName('icon_chun').active = true;
				}
			} else if (Math.floor(cardID / 100) == Math.floor(jinJin / 100)) {
				childNode.color = cc.color(255, 255, 125);
				if (childNode.getChildByName('icon_zheng')) {
					childNode.getChildByName('icon_zheng').active = true;
				}
			}
			else {
				childNode.color = cc.color(255, 255, 255);
				if (childNode.getChildByName('da')) {
					childNode.getChildByName('da').active = false;
				}
			}
		} else {
			childNode.color = cc.color(255, 255, 255);
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
		}
	},
	ShowHuCardNodeByNXKWMJ: function (node, huCard, imageString, jin1, jin2, jinJin) {
		//进卡不能控制显影只能设置空图片
		if (node.getChildByName("da")) {
			node.getChildByName("da").active = false;
		}
		if (node.getChildByName("hu")) {
			node.getChildByName("hu").active = false;
		}
		if (node.getChildByName("icon_chun")) {
			node.getChildByName("icon_chun").active = false;
		}
		if (node.getChildByName("icon_zheng")) {
			node.getChildByName("icon_zheng").active = false;
		}

		if (huCard > 0 && huCard != 5000) {
			node.active = 1;
			this.ShowJinBgByNXKWMJ(huCard, node, jin1, jin2, jinJin);
			this.ShowImage(node, imageString, huCard, jin1, jin2);
		} else {
			if (node.getChildByName("hu")) {
				node.getChildByName("hu").active = false;
			}
			if (this.sp_in.getChildByName("da")) {
				this.sp_in.getChildByName("da").active = false;
			}
			node.getComponent(cc.Sprite).spriteFrame = "";
			node.UserData = null;
		}
	},
	// 金昌麻将
	ShowDownCardShuaiYaoCardByJCMJ: function (cardIDList, handCard, jin1, jin2, imageString = "EatCard_Self_", isLaiZi = false) {
		this.ShowDownImgShuaiYaoCardByJCMJ(cardIDList, imageString, jin1, jin2);
	},
	ShowDownImgByJCMJ: function (cardIDList, handCard = 0, imageString, jin1 = 0, jin2 = 0) {
		let count = 0;
		if (typeof(cardIDList) != "undefined") {
			count = cardIDList.length;
		}
		this.node.removeAllChildren();
		for (let index = 0; index < count; index++) {
			let cardID = cardIDList[index];
			let childNode = cc.instantiate(this.sp_in);
			this.node.addChild(childNode);
			childNode.active = 1;

			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			if (childNode.getChildByName("hu")) {
				childNode.getChildByName("hu").active = false;
			}

			this.ShowJinBg(cardID, childNode, jin1, jin2);
			this.ShowImage(childNode, imageString, cardID, jin1, jin2);
		}

		//进卡不能控制显影只能设置空图片
		if (handCard > 0 && handCard != 5000) {
			this.sp_in.active = 1;
			this.ShowJinBg(handCard, this.sp_in, jin1, jin2);
			this.ShowImage(this.sp_in, imageString, handCard, jin1, jin2);
		} else {
			this.sp_in.getComponent(cc.Sprite).spriteFrame = "";
			if (this.sp_in.getChildByName("da")) {
				this.sp_in.getChildByName("da").active = false;
			}
			this.sp_in.UserData = null;
		}

	},
	// 金昌麻将
	ShowDownImgShuaiYaoCardByJCMJ: function (cardIDList, imageString, jin1 = 0, jin2 = 0) {
		let count = 0;
		if (typeof(cardIDList) != "undefined") {
			count = cardIDList.length;
		}
		this.node.removeAllChildren();
		for (let index = 0; index < count; index++) {
			let cardID = cardIDList[index];
			let childNode = cc.instantiate(this.sp_in);
			this.node.addChild(childNode);
			childNode.active = 1;

			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			if (childNode.getChildByName("hu")) {
				childNode.getChildByName("hu").active = false;
			}
			this.ShowJinBg(cardID, childNode, jin1, jin2);
			this.ShowImage(childNode, imageString, cardID, jin1, jin2);
		}
	},
	ShowJinBgHuaJin: function (cardID, childNode) {
		if (cardID > 0) {
			if (Math.floor(cardID / 100) >=50) {
				childNode.color = cc.color(255, 255, 125);
				if (childNode.getChildByName("da")) {
					childNode.getChildByName("da").active = true;
				}
			} else {
				childNode.color = cc.color(255, 255, 255);
				if (childNode.getChildByName("da")) {
					childNode.getChildByName("da").active = false;
				}
			}
		} else {
			childNode.color = cc.color(255, 255, 255);
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
		}
	},
	ShowJinBg: function (cardID, childNode, jin1 = 0, jin2 = 0) {
		if (jin1 == 0) {
			if (this.RoomMgr == null) {
				return;
			}
			let room = this.RoomMgr.GetEnterRoom();
			if (!room) return;
			let roomSet = room.GetRoomSet();
			if (roomSet) {
				jin1 = roomSet.get_jin1();
				jin2 = roomSet.get_jin2();
			}
		}
		if (cardID > 0) {
			if (Math.floor(cardID / 100) == Math.floor(jin1 / 100) || Math.floor(cardID / 100) == Math.floor(jin2 / 100)) {
				childNode.color = cc.color(255, 255, 125);
				if (childNode.getChildByName("da")) {
					childNode.getChildByName("da").active = true;
				}
			} else {
				childNode.color = cc.color(255, 255, 255);
				if (childNode.getChildByName("da")) {
					childNode.getChildByName("da").active = false;
				}
			}
		} else {
			childNode.color = cc.color(255, 255, 255);
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
		}
	},
	ShowJinBgByHLDMJ: function (cardID, childNode, jin1 = 0, jin2 = 0, jinJin = 0) {
		if (cardID > 0) {
			if (Math.floor(cardID / 100) == Math.floor(jin1 / 100) || Math.floor(cardID / 100) == Math.floor(jin2 / 100) || Math.floor(cardID / 100) == Math.floor(jinJin / 100)) {
				childNode.color = cc.color(255, 255, 125);
				if (childNode.getChildByName("da")) {
					childNode.getChildByName("da").active = true;
				}
			} else {
				childNode.color = cc.color(255, 255, 255);
				if (childNode.getChildByName("da")) {
					childNode.getChildByName("da").active = false;
				}
			}
		} else {
			childNode.color = cc.color(255, 255, 255);
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
		}
	},
	ShowJinBgByJMSKMJ: function (cardID, childNode, jin1 = 0, jin2 = 0) {
		if (jin1 == 0) {
			if (this.RoomMgr == null) {
				return;
			}
			let room = this.RoomMgr.GetEnterRoom();
			if (!room) return;
			let roomSet = room.GetRoomSet();
			if (roomSet) {
				jin1 = roomSet.get_jin1();
				jin2 = roomSet.get_jin2();
			}
		}
		if (cardID > 0) {
			if (Math.floor(cardID / 100) == Math.floor(jin1 / 100)) {
				childNode.color = cc.color(255, 255, 125);
				if (childNode.getChildByName("da")) {
					childNode.getChildByName("da").active = true;
				}
				if (childNode.getChildByName("pi")) {
					childNode.getChildByName("pi").active = false;
				}
				if (childNode.getChildByName("pi2")) {
					childNode.getChildByName("pi2").active = false;
				}
			} else if (Math.floor(cardID / 100) == Math.floor(jin2 / 100)) {
				childNode.color = cc.color(255, 255, 255);
				if (childNode.getChildByName("da")) {
					childNode.getChildByName("da").active = false;
				}
				if (childNode.getChildByName("pi")) {
					childNode.getChildByName("pi").active = false;
				}
				if (childNode.getChildByName("pi2")) {
					childNode.getChildByName("pi2").active = false;
				}
			} if (Math.floor(cardID / 100) == 45 || Math.floor(cardID / 100) == 46) {
				childNode.color = cc.color(255, 255, 255);
				if (childNode.getChildByName("da")) {
					childNode.getChildByName("da").active = false;
				}
				if (childNode.getChildByName("pi")) {
					childNode.getChildByName("pi").active = false;
				}
				if (childNode.getChildByName("pi2")) {
					childNode.getChildByName("pi2").active = true;
				}
			} 
		} else {
			childNode.color = cc.color(255, 255, 255);
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			if (childNode.getChildByName("pi")) {
				childNode.getChildByName("pi").active = false;
			}
			if (childNode.getChildByName("pi2")) {
				childNode.getChildByName("pi2").active = false;
			}
		}
	},
	ShowJinBgByHBWHMJ: function (cardID, childNode, jin1 = 0, laiZiPiList = [], specialLaiZiPiList = []) {
		if (jin1 == 0) {
			if (this.RoomMgr == null) {
				return;
			}
			let room = this.RoomMgr.GetEnterRoom();
			if (!room) return;
			let roomSet = room.GetRoomSet();
			if (roomSet) {
				jin1 = roomSet.get_jin1();
				jin2 = roomSet.get_jin2();
			}
		}
		if (cardID > 0) {
			if (Math.floor(cardID / 100) == Math.floor(jin1 / 100)) {
				// childNode.color = cc.color(255, 255, 125);
				if (childNode.getChildByName("da")) {
					childNode.getChildByName("da").active = true;
				}
				if (childNode.getChildByName("pi")) {
					childNode.getChildByName("pi").active = false;
				}
				if (childNode.getChildByName("pi2")) {
					childNode.getChildByName("pi2").active = false;
				}
			} else if (laiZiPiList.indexOf(Math.floor(cardID / 100)) > -1) {
				// childNode.color = cc.color(255, 255, 255);
				if (childNode.getChildByName("da")) {
					childNode.getChildByName("da").active = false;
				}
				if (childNode.getChildByName("pi")) {
					childNode.getChildByName("pi").active = true;
				}
				if (childNode.getChildByName("pi2")) {
					childNode.getChildByName("pi2").active = false;
				}
			} else if (specialLaiZiPiList.indexOf(Math.floor(cardID / 100)) > -1) {
				// childNode.color = cc.color(255, 255, 255);
				if (childNode.getChildByName("da")) {
					childNode.getChildByName("da").active = false;
				}
				if (childNode.getChildByName("pi")) {
					childNode.getChildByName("pi").active = false;
				}
				if (childNode.getChildByName("pi2")) {
					childNode.getChildByName("pi2").active = true;
				}
			}
		} else {
			// childNode.color = cc.color(255, 255, 255);
			childNode.color = cc.color(255, 255, 255);
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			if (childNode.getChildByName("pi")) {
				childNode.getChildByName("pi").active = false;
			}
			if (childNode.getChildByName("pi2")) {
				childNode.getChildByName("pi2").active = false;
			}
		}

	},
	ShowDownImgHuaJin: function (cardIDList, handCard = 0, imageString) {
		let count = 0;
		if (typeof(cardIDList) != "undefined") {
			count = cardIDList.length;
		}
		for (let index = 0; index < count; index++) {
			let cardID = cardIDList[index];
			let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue
			}
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			this.ShowJinBgHuaJin(cardID, childNode);
			childNode.active = 1;
			this.ShowImage(childNode, imageString, cardID);
		}
		//设置多余的卡牌位置空
		for (let cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				continue
			}
			childNode.active = 0;
		}
		//进卡不能控制显影只能设置空图片
		if (handCard > 0 && handCard != 5000) {
			this.sp_in.active = 1;
			this.ShowJinBgHuaJin(handCard, this.sp_in);
			this.ShowImage(this.sp_in, imageString, handCard);
		} else {
			this.sp_in.getComponent(cc.Sprite).spriteFrame = "";
			if (this.sp_in.getChildByName("da")) {
				this.sp_in.getChildByName("da").active = false;
			}
			this.sp_in.UserData = null;
		}
	},
	ShowDownImg: function (cardIDList, handCard = 0, imageString, jin1 = 0, jin2 = 0) {
		let count = 0;
		if (typeof(cardIDList) != "undefined") {
			count = cardIDList.length;
		}
		for (let index = 0; index < count; index++) {
			let cardID = cardIDList[index];
			let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue
			}
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			this.ShowJinBg(cardID, childNode, jin1, jin2);
			childNode.active = 1;
			this.ShowImage(childNode, imageString, cardID, jin1, jin2);
		}
		//设置多余的卡牌位置空
		for (let cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				continue
			}
			childNode.active = 0;
		}
		//进卡不能控制显影只能设置空图片
		if (handCard > 0 && handCard != 5000) {
			this.sp_in.active = 1;
			this.ShowJinBg(handCard, this.sp_in, jin1, jin2);
			this.ShowImage(this.sp_in, imageString, handCard, jin1, jin2);
		} else {
			this.sp_in.getComponent(cc.Sprite).spriteFrame = "";
			if (this.sp_in.getChildByName("da")) {
				this.sp_in.getChildByName("da").active = false;
			}
			this.sp_in.UserData = null;
		}
	},
	ShowDownImgByCXYXMJ: function (cardIDList, huCardList = 0, imageString, jin1 = 0, jin2 = 0) {
		let count = 0;
		if (typeof(cardIDList) != "undefined") {
			count = cardIDList.length;
		}
		for (let index = 0; index < count; index++) {
			let cardID = cardIDList[index];
			let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue
			}
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			this.ShowJinBg(cardID, childNode, jin1, jin2);
			childNode.active = 1;
			this.ShowImage(childNode, imageString, cardID, jin1, jin2);
		}
		//设置多余的卡牌位置空
		for (let cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				continue
			}
			childNode.active = 0;
		}

		let sp_in2 = this.node.getChildByName("sp_in2")
		this.sp_in.active = 0;
		sp_in2.active = 0;
		this.sp_in.color = cc.color(255, 255, 255);
		sp_in2.color = cc.color(255, 255, 255);
		
		if (huCardList.length == 0) {
			return;
		}
		//进卡不能控制显影只能设置空图片
		if (huCardList[0] > 0 && huCardList[0] != 5000) {
			this.sp_in.active = 1;
			// this.ShowJinBg(handCard, this.sp_in, jin1, jin2);
			this.ShowImage(this.sp_in, imageString, huCardList[0], jin1, jin2);
			if(huCardList[0]%100 > 4){
				this.sp_in.color = cc.color(255, 255, 125);
			}
		} else {
			this.sp_in.getComponent(cc.Sprite).spriteFrame = "";
			if (this.sp_in.getChildByName("da")) {
				this.sp_in.getChildByName("da").active = false;
			}
			this.sp_in.UserData = null;
		}
		if(huCardList.length == 2){
			if (huCardList[1] > 0 && huCardList[1] != 5000) {
				sp_in2.active = 1;
				// this.ShowJinBg(handCard, this.sp_in, jin1, jin2);
				this.ShowImage(sp_in2, imageString, huCardList[1], jin1, jin2);
				if(huCardList[1]%100 > 4){
					sp_in2.color = cc.color(255, 255, 125);
				}
			} else {
				sp_in2.getComponent(cc.Sprite).spriteFrame = "";
				if (sp_in2.getChildByName("da")) {
					sp_in2.getChildByName("da").active = false;
				}
			}
		}
	},
	ShowDownImgByHLDMJ: function (cardIDList, handCard = 0, imageString, jin1 = 0, jin2 = 0, jinJin = 0) {
		let count = 0;
		if (typeof(cardIDList) != "undefined") {
			count = cardIDList.length;
		}
		for (let index = 0; index < count; index++) {
			let cardID = cardIDList[index];
			let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue
			}
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			this.ShowJinBgByHLDMJ(cardID, childNode, jin1, jin2, jinJin);
			childNode.active = 1;
			this.ShowImage(childNode, imageString, cardID, jin1, jin2);
		}
		//设置多余的卡牌位置空
		for (let cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				continue
			}
			childNode.active = 0;
		}
		//进卡不能控制显影只能设置空图片
		if (handCard > 0 && handCard != 5000) {
			this.sp_in.active = 1;
			this.ShowJinBgByHLDMJ(handCard, this.sp_in, jin1, jin2, jinJin);
			this.ShowImage(this.sp_in, imageString, handCard, jin1, jin2);
		} else {
			this.sp_in.getComponent(cc.Sprite).spriteFrame = "";
			if (this.sp_in.getChildByName("da")) {
				this.sp_in.getChildByName("da").active = false;
			}
			this.sp_in.UserData = null;
		}
	},
	ShowDownImgByJMSKMJ: function (cardIDList, handCard = 0, imageString, jin1 = 0, jin2 = 0) {
		let count = 0;
		if (typeof(cardIDList) != "undefined") {
			count = cardIDList.length;
		}
		for (let index = 0; index < count; index++) {
			let cardID = cardIDList[index];
			let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue
			}
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			if (childNode.getChildByName("pi")) {
				childNode.getChildByName("pi").active = false;
			}
			if (childNode.getChildByName("pi2")) {
				childNode.getChildByName("pi2").active = false;
			}
			this.ShowJinBgByJMSKMJ(cardID, childNode, jin1, jin2);
			childNode.active = 1;
			this.ShowImage(childNode, imageString, cardID, jin1, jin2);
		}
		//设置多余的卡牌位置空
		for (let cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				continue
			}
			childNode.active = 0;
		}
		//进卡不能控制显影只能设置空图片
		if (handCard > 0 && handCard != 5000) {
			this.sp_in.active = 1;
			this.ShowJinBgByJMSKMJ(handCard, this.sp_in, jin1, jin2);
			this.ShowImage(this.sp_in, imageString, handCard, jin1, jin2);
		} else {
			this.sp_in.getComponent(cc.Sprite).spriteFrame = "";
			if (this.sp_in.getChildByName("da")) {
				this.sp_in.getChildByName("da").active = false;
			}
			if (this.sp_in.getChildByName("pi")) {
				this.sp_in.getChildByName("pi").active = false;
			}
			if (this.sp_in.getChildByName("pi2")) {
				this.sp_in.getChildByName("pi2").active = false;
			}
			this.sp_in.UserData = null;
		}
	},
	ShowDownImgLLFYMJ: function (cardIDList, handCard = 0, imageString, liangPaiList, jin1 = 0, jin2 = 0) {
		let count = 0;
		if (typeof(cardIDList) != "undefined") {
			count = cardIDList.length;
		}
		for (let index = 0; index < count; index++) {
			let cardID = cardIDList[index];
			let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue
			}
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			this.ShowJinBg(cardID, childNode, jin1, jin2);
			childNode.active = 1;
			childNode.getChildByName("da").active = false;
			this.ShowImage(childNode, imageString, cardID, jin1, jin2);
			if (liangPaiList.indexOf(cardID) > -1) {
				childNode.getChildByName("da").active = true;
			}
		}
		//设置多余的卡牌位置空
		for (let cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				continue
			}
			childNode.active = 0;
		}
		//进卡不能控制显影只能设置空图片
		if (this.sp_in.getChildByName("da")) {
			this.sp_in.getChildByName("da").active = false;
		}
		if (handCard > 0 && handCard != 5000) {
			this.sp_in.active = 1;
			this.ShowJinBg(handCard, this.sp_in, jin1, jin2);
			this.ShowImage(this.sp_in, imageString, handCard, jin1, jin2);
			if (liangPaiList.indexOf(handCard) > -1) {
				this.sp_in.getChildByName("da").active = true;
			}
		} else {
			this.sp_in.getComponent(cc.Sprite).spriteFrame = "";
			this.sp_in.UserData = null;
		}

	},
	//武汉麻将
	ShowDownImgByHBWHMJ: function (cardIDList, handCard = 0, imageString, jin1 = 0, laiZiPiList = [], specialLaiZiPiList = []) {
		let count = 0;
		if (typeof(cardIDList) != "undefined") {
			count = cardIDList.length;
		}
		for (let index = 0; index < count; index++) {
			let cardID = cardIDList[index];
			let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue
			}
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			this.ShowJinBgByHBWHMJ(cardID, childNode, jin1, laiZiPiList, specialLaiZiPiList);
			childNode.active = 1;
			this.ShowImage(childNode, imageString, cardID);
		}
		//设置多余的卡牌位置空
		for (let cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				continue
			}
			childNode.active = 0;
		}
		//进卡不能控制显影只能设置空图片
		if (handCard > 0 && handCard != 5000) {
			this.sp_in.active = 1;
			this.ShowJinBgByHBWHMJ(handCard, this.sp_in, jin1, laiZiPiList, specialLaiZiPiList);
			this.ShowImage(this.sp_in, imageString, handCard);
		} else {
			this.sp_in.getComponent(cc.Sprite).spriteFrame = "";
			if (this.sp_in.getChildByName("da")) {
				this.sp_in.getChildByName("da").active = false;
			}
			this.sp_in.UserData = null;
		}

	},
	//江都麻将
	ShowDownImgByJDMJ: function (cardIDList, handCard = 0, imageString, jin1 = 0, jin2 = 0) {
		let count = 0;
		if (typeof(cardIDList) != "undefined") {
			count = cardIDList.length;
		}
		for (let index = 0; index < count; index++) {
			let cardID = cardIDList[index];
			let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue
			}
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			this.ShowJinBg(cardID, childNode, jin1, jin2);
			childNode.active = 1;
			this.ShowImageByJDMJ(childNode, imageString, cardID, jin1, jin2);
		}
		//设置多余的卡牌位置空
		for (let cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				continue
			}
			childNode.active = 0;
		}
		//进卡不能控制显影只能设置空图片
		if (handCard > 0 && handCard != 5000) {
			this.sp_in.active = 1;
			this.ShowJinBg(handCard, this.sp_in, jin1, jin2);
			this.ShowImage(this.sp_in, imageString, handCard, jin1, jin2);
		} else {
			this.sp_in.getComponent(cc.Sprite).spriteFrame = "";
			if (this.sp_in.getChildByName("da")) {
				this.sp_in.getChildByName("da").active = false;
			}
			this.sp_in.UserData = null;
		}

	},

	ShowDownCardByJAMJ: function (cardIDList, handCard, jin1, jin2, imageString = "EatCard_Self_") {
		this.ShowDownImgByJAMJ(cardIDList, handCard, imageString, jin1, jin2);
	},
	ShowDownCardByZJTZMJ: function (cardIDList, handCard, jin1, jin2, fengCardID, imageString = "EatCard_Self_") {
		this.ShowDownImgByZJTZMJ(cardIDList, handCard, imageString, jin1, jin2, fengCardID);
	},
	ShowDownCardBySSE: function (cardIDList, handCard, jin1, jin2, imageString = "Poker_") {
		this.ShowDownImgBySSE(cardIDList, handCard, imageString, jin1, jin2);
	},
	ShowDownCardByHLDMJ: function (cardIDList, handCard, jin1, jin2, jinJin, imageString = "EatCard_Self_") {
		this.ShowDownImgByHLDMJ(cardIDList, handCard, imageString, jin1, jin2, jinJin);
	},
	ShowJinBgByJAMJ: function (cardID, childNode, jin1 = 0, jin2 = 0) {
		if (jin1 == 0) {
			if (this.RoomMgr == null) {
				return;
			}
			let room = this.RoomMgr.GetEnterRoom();
			if (!room) return;
			let roomSet = room.GetRoomSet();
			if (roomSet) {
				jin1 = roomSet.get_jin1();
				jin2 = roomSet.get_jin2();
			}
		}
		if (childNode.getChildByName("da")) {
			childNode.getChildByName("da").active = false;
		}
		if (childNode.getChildByName("icon_fu")) {
			childNode.getChildByName("icon_fu").active = false;
		}
		if (cardID > 0) {
			if (Math.floor(cardID / 100) == Math.floor(jin1 / 100)) {
				childNode.color = cc.color(255, 255, 125);
				if (childNode.getChildByName("da")) {
					childNode.getChildByName("da").active = true;
				}
			} else if (Math.floor(cardID / 100) == Math.floor(jin2 / 100)) {
				childNode.color = cc.color(255, 255, 125);
				if (childNode.getChildByName("icon_fu")) {
					childNode.getChildByName("icon_fu").active = true;
				}
			} else {
				childNode.color = cc.color(255, 255, 255);
			}
		} else {
			childNode.color = cc.color(255, 255, 255);
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			if (childNode.getChildByName("icon_fu")) {
				childNode.getChildByName("icon_fu").active = false;
			}
		}
	},
	ShowJinBgByZJTZMJ: function (cardID, childNode, jin1 = 0, jin2 = 0, fengCardID) {
		if (jin1 == 0) {
			if (this.RoomMgr == null) {
				return;
			}
			let room = this.RoomMgr.GetEnterRoom();
			if (!room) return;
			let roomSet = room.GetRoomSet();
			if (roomSet) {
				jin1 = roomSet.get_jin1();
				jin2 = roomSet.get_jin2();
			}
		}
		if (childNode.getChildByName("da")) {
			childNode.getChildByName("da").active = false;
		}
		if (childNode.getChildByName("icon_feng")) {
			childNode.getChildByName("icon_feng").active = false;
		}
		if (cardID > 0) {
			if (Math.floor(cardID / 100) == Math.floor(jin1 / 100)) {
				childNode.color = cc.color(255, 255, 125);
				if (childNode.getChildByName("da")) {
					childNode.getChildByName("da").active = true;
				}
			} else if (Math.floor(cardID / 100) == Math.floor(fengCardID / 100)) {
				childNode.color = cc.color(255, 255, 125);
				if (childNode.getChildByName("icon_feng")) {
					childNode.getChildByName("icon_feng").active = true;
				}
			} else {
				childNode.color = cc.color(255, 255, 255);
			}
		} else {
			childNode.color = cc.color(255, 255, 255);
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			if (childNode.getChildByName("icon_feng")) {
				childNode.getChildByName("icon_feng").active = false;
			}
		}
	},
	ShowDownImgByJAMJ: function (cardIDList, handCard = 0, imageString, jin1 = 0, jin2 = 0) {
		let count = 0;
		if (typeof(cardIDList) != "undefined") {
			count = cardIDList.length;
		}
		for (let index = 0; index < count; index++) {
			let cardID = cardIDList[index];
			let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue
			}
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			this.ShowJinBgByJAMJ(cardID, childNode, jin1, jin2);
			childNode.active = 1;
			this.ShowImage(childNode, imageString, cardID, jin1, jin2);
		}
		//设置多余的卡牌位置空
		for (let cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				continue
			}
			childNode.active = 0;
		}
		//进卡不能控制显影只能设置空图片
		if (handCard > 0 && handCard != 5000) {
			this.sp_in.active = 1;
			this.ShowJinBgByJAMJ(handCard, this.sp_in, jin1, jin2);
			this.ShowImage(this.sp_in, imageString, handCard, jin1, jin2);
		} else {
			this.sp_in.getComponent(cc.Sprite).spriteFrame = "";
			if (this.sp_in.getChildByName("da")) {
				this.sp_in.getChildByName("da").active = false;
			}
			if (this.sp_in.getChildByName("icon_fu")) {
				this.sp_in.getChildByName("icon_fu").active = false;
			}
			this.sp_in.UserData = null;
		}

	},
	ShowDownImgByZJTZMJ: function (cardIDList, handCard = 0, imageString, jin1 = 0, jin2 = 0, fengCardID) {
		let count = 0;
		if (typeof(cardIDList) != "undefined") {
			count = cardIDList.length;
		}
		for (let index = 0; index < count; index++) {
			let cardID = cardIDList[index];
			let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue
			}
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			this.ShowJinBgByZJTZMJ(cardID, childNode, jin1, jin2, fengCardID);
			childNode.active = 1;
			this.ShowImage(childNode, imageString, cardID, jin1, jin2);
		}
		//设置多余的卡牌位置空
		for (let cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				continue
			}
			childNode.active = 0;
		}
		//进卡不能控制显影只能设置空图片
		if (handCard > 0 && handCard != 5000) {
			this.sp_in.active = 1;
			this.ShowJinBgByZJTZMJ(handCard, this.sp_in, jin1, jin2, fengCardID);
			this.ShowImage(this.sp_in, imageString, handCard, jin1, jin2);
		} else {
			this.sp_in.getComponent(cc.Sprite).spriteFrame = "";
			if (this.sp_in.getChildByName("da")) {
				this.sp_in.getChildByName("da").active = false;
			}
			if (this.sp_in.getChildByName("icon_feng")) {
				this.sp_in.getChildByName("icon_feng").active = false;
			}
			this.sp_in.UserData = null;
		}

	},
	//沙沙儿
	ShowDownImgBySSE: function (cardIDList, handCard = 0, imageString, jin1 = 0, jin2 = 0) {
		let count = 0;
		if (typeof(cardIDList) != "undefined") {
			count = cardIDList.length;
		}
		for (let index = 0; index < count; index++) {
			let cardID = cardIDList[index];
			let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue
			}
			childNode.active = 1;
			this.ShowImage(childNode, imageString, cardID, jin1, jin2);
		}
		//设置多余的卡牌位置空
		for (let cardIndex = count + 1; cardIndex <= 24; cardIndex++) {
			let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				continue
			}
			childNode.active = 0;
		}
		//进卡不能控制显影只能设置空图片
		if (handCard > 0 && handCard != 5000) {
			this.sp_in.active = 1;
			this.ShowImage(this.sp_in, imageString, handCard, jin1, jin2);
		} else {
			this.sp_in.getComponent(cc.Sprite).spriteFrame = "";
			this.sp_in.UserData = null;
		}

	},
	//河南许昌麻将
	ShowDownCardByHNXCMJ: function (cardIDList, handCard, jin1, jin2, imageString = "EatCard_Self_") {
		this.ShowDownImgByHNXCMJ(cardIDList, handCard, imageString, jin1, jin2);
	},
	ShowDownImgByHNXCMJ: function (cardIDList, handCard = 0, imageString, jin1 = 0, jin2 = 0) {
		let count = 0;
		if (typeof(cardIDList) != "undefined") {
			count = cardIDList.length;
		}
		for (let index = 0; index < count; index++) {
			let cardID = cardIDList[index];
			let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue
			}
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			this.ShowJinBgByHNXCMJ(cardID, childNode, jin1, jin2);
			childNode.active = 1;
			this.ShowImage(childNode, imageString, cardID, jin1, jin2);
		}
		//设置多余的卡牌位置空
		for (let cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				continue
			}
			childNode.active = 0;
		}
		//进卡不能控制显影只能设置空图片
		if (handCard > 0 && handCard != 5000) {
			this.sp_in.active = 1;
			this.ShowJinBg(handCard, this.sp_in, jin1, jin2);
			this.ShowImage(this.sp_in, imageString, handCard, jin1, jin2);
		} else {
			this.sp_in.getComponent(cc.Sprite).spriteFrame = "";
			this.sp_in.UserData = null;
		}

	},
	ShowJinBgByHNXCMJ: function (cardID, childNode, jin1 = 0, jin2 = 0) {
		if (jin1 == 0) {
			if (this.RoomMgr == null) {
				return;
			}
			let room = this.RoomMgr.GetEnterRoom();
			if (!room) return;
			let roomSet = room.GetRoomSet();
			if (roomSet) {
				jin1 = roomSet.get_jin1();
				jin2 = roomSet.get_jin2();
			}
		}
		if (cardID > 0) {
			// if (Math.floor(cardID / 100) == Math.floor(jin1 / 100) || Math.floor(cardID / 100) == Math.floor(jin2 / 100)) {
			if (Math.floor(cardID / 100) == Math.floor(jin1 / 100)) {
				childNode.color = cc.color(255, 255, 125);
				if (childNode.getChildByName("da")) {
					childNode.getChildByName("da").active = true;
				}
			} else {
				childNode.color = cc.color(255, 255, 255);
				if (childNode.getChildByName("da")) {
					childNode.getChildByName("da").active = false;
				}
			}
		} else {
			childNode.color = cc.color(255, 255, 255);
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
		}

	},
	//河南信阳麻将
	ShowShouCardByHnxymj: function (cardIDList, allKanList, handCard, imageString, jin1, jin2) {
		let count = 0;
		if (typeof(cardIDList) != "undefined") {
			count = cardIDList.length;
		}
		for (let index = 0; index < count; index++) {
			let cardID = cardIDList[index];
			let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue
			}
			this.ShowJinBg(cardID, childNode, jin1, jin2);
			childNode.active = 1;
			this.ShowImage(childNode, imageString, cardID, jin1, jin2);
			this.ShowDownCardKan(childNode, allKanList.indexOf(cardID) > -1);
		}
		//设置多余的卡牌位置空
		for (let cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				continue
			}
			childNode.active = 0;
		}
		//进卡不能控制显影只能设置空图片
		if (handCard > 0 && handCard != 5000) {
			this.sp_in.active = 1;
			this.ShowJinBg(handCard, this.sp_in, jin1, jin2);
			this.ShowImage(this.sp_in, imageString, handCard, jin1, jin2);
		} else {
			this.sp_in.getComponent(cc.Sprite).spriteFrame = "";
			this.sp_in.UserData = null;
		}
	},
	//-----------衡水麻将-------------------------
	NewTanPaiCard: function (shouCardList, kouPais) {
		let newCardList = new Array();
		for (let i = 0; i < shouCardList.length; i++) {
			if (kouPais.InArray(shouCardList[i])) {
				newCardList.push(shouCardList[i]);
			}
		}
		for (let i = 0; i < shouCardList.length; i++) {
			if (kouPais.InArray(shouCardList[i])) {
				continue;
			} else {
				newCardList.push(shouCardList[i]);
			}
		}
		return newCardList;
	},
	ShowShouCardByHsmj: function (cardIDList, koupais = [], handCard, imageString, jin1, jin2) {
		let count = 0;
		if (typeof(cardIDList) != "undefined") {
			count = cardIDList.length;
		}
		cardIDList = this.NewTanPaiCard(cardIDList, koupais);
		for (let index = 0; index < count; index++) {
			let cardID = cardIDList[index];
			let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue
			}
			this.ShowJinBg(cardID, childNode, jin1, jin2);
			childNode.active = 1;
			this.ShowImage(childNode, imageString, cardID, jin1, jin2);
			if (koupais.InArray(cardID)) {
				childNode.color = cc.color(180, 180, 180);
			} else {
				childNode.color = cc.color(255, 255, 255);
			}
		}
		//设置多余的卡牌位置空
		for (let cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				continue
			}
			childNode.active = 0;
		}
		//进卡不能控制显影只能设置空图片
		if (handCard > 0 && handCard != 5000) {
			this.sp_in.active = 1;
			this.ShowJinBg(handCard, this.sp_in, jin1, jin2);
			this.ShowImage(this.sp_in, imageString, handCard, jin1, jin2);
		} else {
			this.sp_in.getComponent(cc.Sprite).spriteFrame = "";
			this.sp_in.UserData = null;
		}
	},
	//-----------衡水麻将-------------------------

	ShowImage: function (childNode, imageString, cardID) {
		let childSprite = childNode.getComponent(cc.Sprite);
		if (!childSprite) {
			this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
			return
		}

		//取卡牌ID的前2位
		let imageName = [imageString, Math.floor(cardID / 100)].join("");
		let imageInfo = this.IntegrateImage[imageName];
		if (!imageInfo) {
			this.ErrLog("fuck ShowImage IntegrateImage.txt not find:%s", imageName);
			return
		}
		//图片没有变化
		if (childNode.UserData == imageName) {

			this.Log("UserData:%s", imageName);
			return
		}
		let imagePath = imageInfo["FilePath"];
		if (app['majiang_' + imageName]) {
			childSprite.spriteFrame = app['majiang_' + imageName];
			childNode.UserData = imageName;
		} else {
			let that = this;
			app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame)
				.then(function (spriteFrame) {
					if (!spriteFrame) {
						that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
						return
					}
					//记录精灵图片对象
					childSprite.spriteFrame = spriteFrame;
					childNode.UserData = imageName;
					app['majiang_' + imageName] = spriteFrame;
				})
				.catch(function (error) {
					that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
				});
		}
	},
	//江都麻将
	ShowImageByJDMJ: function (childNode, imageString, cardID) {
		let childSprite = childNode.getComponent(cc.Sprite);
		if (!childSprite) {
			this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
			return
		}

		if (5100 > cardID && 5500 < cardID) {
			cardID = 4900;
		}
		//取卡牌ID的前2位
		let imageName = [imageString, Math.floor(cardID / 100)].join("");
		let imageInfo = this.IntegrateImage[imageName];
		if (!imageInfo) {
			this.ErrLog("fuck ShowImage IntegrateImage.txt not find:%s", imageName);
			return;
		}
		//图片没有变化
		if (childNode.UserData == imageName) {
			this.Log("UserData:%s", imageName);
			return;
		}
		let imagePath = imageInfo["FilePath"];
		if (app['majiang_' + imageName]) {
			childSprite.spriteFrame = app['majiang_' + imageName];
			childNode.UserData = imageName;
		} else {
			let that = this;
			app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame)
				.then(function (spriteFrame) {
					if (!spriteFrame) {
						that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
						return
					}
					//记录精灵图片对象
					childSprite.spriteFrame = spriteFrame;
					childNode.UserData = imageName;
					app['majiang_' + imageName] = spriteFrame;
				})
				.catch(function (error) {
					that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
				});
		}
	},
	//河南信阳麻将
	ShowDownCardKan: function (childNode, isShow) {
		if (childNode.getChildByName("da")) {
			childNode.getChildByName("da").active = isShow;
		}
	}
});
