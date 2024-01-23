"use strict";
cc._RF.push(module, 'd652dOSWmZOH4LQ2s4QX+6Z', 'UIMJCard_ShowCard');
// script/ui/uiGame/majiang/UIMJCard_ShowCard.js

"use strict";

/*
 UICard01-04 set结束摊牌
 */

var app = require("app");

cc.Class({
	extends: require("BaseComponent"),

	properties: {
		sp_in: cc.Node
	},

	// use this for initialization
	OnLoad: function OnLoad() {
		this.JS_Name = this.node.name + "_UIMJCard_ShowCard";
		this.ComTool = app.ComTool();
		this.SysDataManager = app.SysDataManager();
		this.IntegrateImage = this.SysDataManager.GetTableDict("IntegrateImage");
		this.ChildCount = 16; //最多发16张牌
		this.HideAllChild();
	},

	HideAllChild: function HideAllChild() {
		for (var index = 1; index <= this.ChildCount; index++) {
			var childName = this.ComTool.StringAddNumSuffix("card", index, 2);
			var childNode = this.node.getChildByName(childName);
			if (!childNode) {
				continue;
			}
			var cardSprite = childNode.getComponent(cc.Sprite);
			cardSprite.spriteFrame = null;
		}
		this.sp_in.getComponent(cc.Sprite).spriteFrame = null;
	},
	ShowDownCard: function ShowDownCard(cardIDList, handCard, jin1, jin2) {
		var imageString = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "EatCard_Self_";

		this.ShowDownImg(cardIDList, handCard, imageString, jin1, jin2);
	},
	ShowDownCardHuaJin: function ShowDownCardHuaJin(cardIDList, handCard) {
		var imageString = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "EatCard_Self_";

		this.ShowDownImgHuaJin(cardIDList, handCard, imageString);
	},
	ShowDownCardByCXYXMJ: function ShowDownCardByCXYXMJ(cardIDList, huCardList, jin1, jin2) {
		var imageString = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "EatCard_Self_";

		this.ShowDownImgByCXYXMJ(cardIDList, huCardList, imageString, jin1, jin2);
	},
	//麻将
	ShowDownCardByJMSKMJ: function ShowDownCardByJMSKMJ(cardIDList, handCard, jin1, jin2) {
		var imageString = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "EatCard_Self_";

		this.ShowDownImgByJMSKMJ(cardIDList, handCard, imageString, jin1, jin2);
	},
	//麻将
	ShowDownCardByLLFYMJ: function ShowDownCardByLLFYMJ(cardIDList, handCard, liangPaiList) {
		var imageString = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "EatCard_Self_";

		this.ShowDownImgLLFYMJ(cardIDList, handCard, imageString, liangPaiList);
	},
	//武汉麻将
	ShowDownCardByHBWHMJ: function ShowDownCardByHBWHMJ(cardIDList, handCard, jin1, laiZiPiList, specialLaiZiPiList) {
		var imageString = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "EatCard_Self_";

		this.ShowDownImgByHBWHMJ(cardIDList, handCard, imageString, jin1, laiZiPiList, specialLaiZiPiList);
	},
	//江都麻将
	ShowDownCardByJDMJ: function ShowDownCardByJDMJ(cardIDList, handCard, jin1, jin2) {
		var imageString = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "EatCard_Self_";

		this.ShowDownImgByJDMJ(cardIDList, handCard, imageString, jin1, jin2);
	},
	ShowDownCardByJCMJ: function ShowDownCardByJCMJ(cardIDList, handCard, jin1, jin2) {
		var imageString = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "EatCard_Self_";

		this.ShowDownImgByJCMJ(cardIDList, handCard, imageString, jin1, jin2);
	},
	ShowDownCardByNXKWMJ: function ShowDownCardByNXKWMJ(cardIDList, huCardList, jin1, jin2, jinJin) {
		var imageString = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "EatCard_Self_";

		this.ShowDownImgByNXKWMJ(cardIDList, huCardList, imageString, jin1, jin2, jinJin);
	},
	ShowDownImgByNXKWMJ: function ShowDownImgByNXKWMJ(cardIDList, huCardList, imageString) {
		var jin1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
		var jin2 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
		var jinJin = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

		var count = 0;
		if (typeof cardIDList != "undefined") {
			count = cardIDList.length;
		}
		for (var index = 0; index < count; index++) {
			var cardID = cardIDList[index];
			var childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			var childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue;
			}
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			this.ShowJinBgByNXKWMJ(cardID, childNode, jin1, jin2, jinJin);
			childNode.active = 1;
			this.ShowImage(childNode, imageString, cardID, jin1, jin2, jinJin);
		}
		//设置多余的卡牌位置空
		for (var cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			var _childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			var _childNode = this.node.getChildByName(_childName);
			if (!_childNode) {
				continue;
			}
			_childNode.active = 0;
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
	ShowJinBgByNXKWMJ: function ShowJinBgByNXKWMJ(cardID, childNode) {
		var jin1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var jin2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
		var jinJin = arguments[4];

		if (jin1 == 0) {
			if (this.RoomMgr == null) {
				return;
			}
			var room = this.RoomMgr.GetEnterRoom();
			if (!room) return;
			var roomSet = room.GetRoomSet();
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
			} else {
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
	ShowHuCardNodeByNXKWMJ: function ShowHuCardNodeByNXKWMJ(node, huCard, imageString, jin1, jin2, jinJin) {
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
	ShowDownCardShuaiYaoCardByJCMJ: function ShowDownCardShuaiYaoCardByJCMJ(cardIDList, handCard, jin1, jin2) {
		var imageString = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "EatCard_Self_";
		var isLaiZi = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

		this.ShowDownImgShuaiYaoCardByJCMJ(cardIDList, imageString, jin1, jin2);
	},
	ShowDownImgByJCMJ: function ShowDownImgByJCMJ(cardIDList) {
		var handCard = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
		var imageString = arguments[2];
		var jin1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
		var jin2 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

		var count = 0;
		if (typeof cardIDList != "undefined") {
			count = cardIDList.length;
		}
		this.node.removeAllChildren();
		for (var index = 0; index < count; index++) {
			var cardID = cardIDList[index];
			var childNode = cc.instantiate(this.sp_in);
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
	ShowDownImgShuaiYaoCardByJCMJ: function ShowDownImgShuaiYaoCardByJCMJ(cardIDList, imageString) {
		var jin1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var jin2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

		var count = 0;
		if (typeof cardIDList != "undefined") {
			count = cardIDList.length;
		}
		this.node.removeAllChildren();
		for (var index = 0; index < count; index++) {
			var cardID = cardIDList[index];
			var childNode = cc.instantiate(this.sp_in);
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
	ShowJinBgHuaJin: function ShowJinBgHuaJin(cardID, childNode) {
		if (cardID > 0) {
			if (Math.floor(cardID / 100) >= 50) {
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
	ShowJinBg: function ShowJinBg(cardID, childNode) {
		var jin1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var jin2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

		if (jin1 == 0) {
			if (this.RoomMgr == null) {
				return;
			}
			var room = this.RoomMgr.GetEnterRoom();
			if (!room) return;
			var roomSet = room.GetRoomSet();
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
	ShowJinBgByHLDMJ: function ShowJinBgByHLDMJ(cardID, childNode) {
		var jin1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var jin2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
		var jinJin = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

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
	ShowJinBgByJMSKMJ: function ShowJinBgByJMSKMJ(cardID, childNode) {
		var jin1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var jin2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

		if (jin1 == 0) {
			if (this.RoomMgr == null) {
				return;
			}
			var room = this.RoomMgr.GetEnterRoom();
			if (!room) return;
			var roomSet = room.GetRoomSet();
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
			}if (Math.floor(cardID / 100) == 45 || Math.floor(cardID / 100) == 46) {
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
	ShowJinBgByHBWHMJ: function ShowJinBgByHBWHMJ(cardID, childNode) {
		var jin1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var laiZiPiList = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
		var specialLaiZiPiList = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

		if (jin1 == 0) {
			if (this.RoomMgr == null) {
				return;
			}
			var room = this.RoomMgr.GetEnterRoom();
			if (!room) return;
			var roomSet = room.GetRoomSet();
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
	ShowDownImgHuaJin: function ShowDownImgHuaJin(cardIDList) {
		var handCard = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
		var imageString = arguments[2];

		var count = 0;
		if (typeof cardIDList != "undefined") {
			count = cardIDList.length;
		}
		for (var index = 0; index < count; index++) {
			var cardID = cardIDList[index];
			var childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			var childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue;
			}
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			this.ShowJinBgHuaJin(cardID, childNode);
			childNode.active = 1;
			this.ShowImage(childNode, imageString, cardID);
		}
		//设置多余的卡牌位置空
		for (var cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			var _childName2 = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			var _childNode2 = this.node.getChildByName(_childName2);
			if (!_childNode2) {
				continue;
			}
			_childNode2.active = 0;
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
	ShowDownImg: function ShowDownImg(cardIDList) {
		var handCard = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
		var imageString = arguments[2];
		var jin1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
		var jin2 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

		var count = 0;
		if (typeof cardIDList != "undefined") {
			count = cardIDList.length;
		}
		for (var index = 0; index < count; index++) {
			var cardID = cardIDList[index];
			var childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			var childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue;
			}
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			this.ShowJinBg(cardID, childNode, jin1, jin2);
			childNode.active = 1;
			this.ShowImage(childNode, imageString, cardID, jin1, jin2);
		}
		//设置多余的卡牌位置空
		for (var cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			var _childName3 = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			var _childNode3 = this.node.getChildByName(_childName3);
			if (!_childNode3) {
				continue;
			}
			_childNode3.active = 0;
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
	ShowDownImgByCXYXMJ: function ShowDownImgByCXYXMJ(cardIDList) {
		var huCardList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
		var imageString = arguments[2];
		var jin1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
		var jin2 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

		var count = 0;
		if (typeof cardIDList != "undefined") {
			count = cardIDList.length;
		}
		for (var index = 0; index < count; index++) {
			var cardID = cardIDList[index];
			var childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			var childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue;
			}
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			this.ShowJinBg(cardID, childNode, jin1, jin2);
			childNode.active = 1;
			this.ShowImage(childNode, imageString, cardID, jin1, jin2);
		}
		//设置多余的卡牌位置空
		for (var cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			var _childName4 = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			var _childNode4 = this.node.getChildByName(_childName4);
			if (!_childNode4) {
				continue;
			}
			_childNode4.active = 0;
		}

		var sp_in2 = this.node.getChildByName("sp_in2");
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
			if (huCardList[0] % 100 > 4) {
				this.sp_in.color = cc.color(255, 255, 125);
			}
		} else {
			this.sp_in.getComponent(cc.Sprite).spriteFrame = "";
			if (this.sp_in.getChildByName("da")) {
				this.sp_in.getChildByName("da").active = false;
			}
			this.sp_in.UserData = null;
		}
		if (huCardList.length == 2) {
			if (huCardList[1] > 0 && huCardList[1] != 5000) {
				sp_in2.active = 1;
				// this.ShowJinBg(handCard, this.sp_in, jin1, jin2);
				this.ShowImage(sp_in2, imageString, huCardList[1], jin1, jin2);
				if (huCardList[1] % 100 > 4) {
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
	ShowDownImgByHLDMJ: function ShowDownImgByHLDMJ(cardIDList) {
		var handCard = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
		var imageString = arguments[2];
		var jin1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
		var jin2 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
		var jinJin = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

		var count = 0;
		if (typeof cardIDList != "undefined") {
			count = cardIDList.length;
		}
		for (var index = 0; index < count; index++) {
			var cardID = cardIDList[index];
			var childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			var childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue;
			}
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			this.ShowJinBgByHLDMJ(cardID, childNode, jin1, jin2, jinJin);
			childNode.active = 1;
			this.ShowImage(childNode, imageString, cardID, jin1, jin2);
		}
		//设置多余的卡牌位置空
		for (var cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			var _childName5 = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			var _childNode5 = this.node.getChildByName(_childName5);
			if (!_childNode5) {
				continue;
			}
			_childNode5.active = 0;
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
	ShowDownImgByJMSKMJ: function ShowDownImgByJMSKMJ(cardIDList) {
		var handCard = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
		var imageString = arguments[2];
		var jin1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
		var jin2 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

		var count = 0;
		if (typeof cardIDList != "undefined") {
			count = cardIDList.length;
		}
		for (var index = 0; index < count; index++) {
			var cardID = cardIDList[index];
			var childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			var childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue;
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
		for (var cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			var _childName6 = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			var _childNode6 = this.node.getChildByName(_childName6);
			if (!_childNode6) {
				continue;
			}
			_childNode6.active = 0;
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
	ShowDownImgLLFYMJ: function ShowDownImgLLFYMJ(cardIDList) {
		var handCard = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
		var imageString = arguments[2];
		var liangPaiList = arguments[3];
		var jin1 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
		var jin2 = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

		var count = 0;
		if (typeof cardIDList != "undefined") {
			count = cardIDList.length;
		}
		for (var index = 0; index < count; index++) {
			var cardID = cardIDList[index];
			var childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			var childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue;
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
		for (var cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			var _childName7 = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			var _childNode7 = this.node.getChildByName(_childName7);
			if (!_childNode7) {
				continue;
			}
			_childNode7.active = 0;
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
	ShowDownImgByHBWHMJ: function ShowDownImgByHBWHMJ(cardIDList) {
		var handCard = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
		var imageString = arguments[2];
		var jin1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
		var laiZiPiList = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
		var specialLaiZiPiList = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];

		var count = 0;
		if (typeof cardIDList != "undefined") {
			count = cardIDList.length;
		}
		for (var index = 0; index < count; index++) {
			var cardID = cardIDList[index];
			var childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			var childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue;
			}
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			this.ShowJinBgByHBWHMJ(cardID, childNode, jin1, laiZiPiList, specialLaiZiPiList);
			childNode.active = 1;
			this.ShowImage(childNode, imageString, cardID);
		}
		//设置多余的卡牌位置空
		for (var cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			var _childName8 = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			var _childNode8 = this.node.getChildByName(_childName8);
			if (!_childNode8) {
				continue;
			}
			_childNode8.active = 0;
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
	ShowDownImgByJDMJ: function ShowDownImgByJDMJ(cardIDList) {
		var handCard = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
		var imageString = arguments[2];
		var jin1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
		var jin2 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

		var count = 0;
		if (typeof cardIDList != "undefined") {
			count = cardIDList.length;
		}
		for (var index = 0; index < count; index++) {
			var cardID = cardIDList[index];
			var childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			var childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue;
			}
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			this.ShowJinBg(cardID, childNode, jin1, jin2);
			childNode.active = 1;
			this.ShowImageByJDMJ(childNode, imageString, cardID, jin1, jin2);
		}
		//设置多余的卡牌位置空
		for (var cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			var _childName9 = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			var _childNode9 = this.node.getChildByName(_childName9);
			if (!_childNode9) {
				continue;
			}
			_childNode9.active = 0;
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

	ShowDownCardByJAMJ: function ShowDownCardByJAMJ(cardIDList, handCard, jin1, jin2) {
		var imageString = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "EatCard_Self_";

		this.ShowDownImgByJAMJ(cardIDList, handCard, imageString, jin1, jin2);
	},
	ShowDownCardByZJTZMJ: function ShowDownCardByZJTZMJ(cardIDList, handCard, jin1, jin2, fengCardID) {
		var imageString = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "EatCard_Self_";

		this.ShowDownImgByZJTZMJ(cardIDList, handCard, imageString, jin1, jin2, fengCardID);
	},
	ShowDownCardBySSE: function ShowDownCardBySSE(cardIDList, handCard, jin1, jin2) {
		var imageString = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "Poker_";

		this.ShowDownImgBySSE(cardIDList, handCard, imageString, jin1, jin2);
	},
	ShowDownCardByHLDMJ: function ShowDownCardByHLDMJ(cardIDList, handCard, jin1, jin2, jinJin) {
		var imageString = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "EatCard_Self_";

		this.ShowDownImgByHLDMJ(cardIDList, handCard, imageString, jin1, jin2, jinJin);
	},
	ShowJinBgByJAMJ: function ShowJinBgByJAMJ(cardID, childNode) {
		var jin1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var jin2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

		if (jin1 == 0) {
			if (this.RoomMgr == null) {
				return;
			}
			var room = this.RoomMgr.GetEnterRoom();
			if (!room) return;
			var roomSet = room.GetRoomSet();
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
	ShowJinBgByZJTZMJ: function ShowJinBgByZJTZMJ(cardID, childNode) {
		var jin1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var jin2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
		var fengCardID = arguments[4];

		if (jin1 == 0) {
			if (this.RoomMgr == null) {
				return;
			}
			var room = this.RoomMgr.GetEnterRoom();
			if (!room) return;
			var roomSet = room.GetRoomSet();
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
	ShowDownImgByJAMJ: function ShowDownImgByJAMJ(cardIDList) {
		var handCard = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
		var imageString = arguments[2];
		var jin1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
		var jin2 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

		var count = 0;
		if (typeof cardIDList != "undefined") {
			count = cardIDList.length;
		}
		for (var index = 0; index < count; index++) {
			var cardID = cardIDList[index];
			var childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			var childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue;
			}
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			this.ShowJinBgByJAMJ(cardID, childNode, jin1, jin2);
			childNode.active = 1;
			this.ShowImage(childNode, imageString, cardID, jin1, jin2);
		}
		//设置多余的卡牌位置空
		for (var cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			var _childName10 = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			var _childNode10 = this.node.getChildByName(_childName10);
			if (!_childNode10) {
				continue;
			}
			_childNode10.active = 0;
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
	ShowDownImgByZJTZMJ: function ShowDownImgByZJTZMJ(cardIDList) {
		var handCard = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
		var imageString = arguments[2];
		var jin1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
		var jin2 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
		var fengCardID = arguments[5];

		var count = 0;
		if (typeof cardIDList != "undefined") {
			count = cardIDList.length;
		}
		for (var index = 0; index < count; index++) {
			var cardID = cardIDList[index];
			var childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			var childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue;
			}
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			this.ShowJinBgByZJTZMJ(cardID, childNode, jin1, jin2, fengCardID);
			childNode.active = 1;
			this.ShowImage(childNode, imageString, cardID, jin1, jin2);
		}
		//设置多余的卡牌位置空
		for (var cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			var _childName11 = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			var _childNode11 = this.node.getChildByName(_childName11);
			if (!_childNode11) {
				continue;
			}
			_childNode11.active = 0;
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
	ShowDownImgBySSE: function ShowDownImgBySSE(cardIDList) {
		var handCard = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
		var imageString = arguments[2];
		var jin1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
		var jin2 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

		var count = 0;
		if (typeof cardIDList != "undefined") {
			count = cardIDList.length;
		}
		for (var index = 0; index < count; index++) {
			var cardID = cardIDList[index];
			var childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			var childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue;
			}
			childNode.active = 1;
			this.ShowImage(childNode, imageString, cardID, jin1, jin2);
		}
		//设置多余的卡牌位置空
		for (var cardIndex = count + 1; cardIndex <= 24; cardIndex++) {
			var _childName12 = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			var _childNode12 = this.node.getChildByName(_childName12);
			if (!_childNode12) {
				continue;
			}
			_childNode12.active = 0;
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
	ShowDownCardByHNXCMJ: function ShowDownCardByHNXCMJ(cardIDList, handCard, jin1, jin2) {
		var imageString = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "EatCard_Self_";

		this.ShowDownImgByHNXCMJ(cardIDList, handCard, imageString, jin1, jin2);
	},
	ShowDownImgByHNXCMJ: function ShowDownImgByHNXCMJ(cardIDList) {
		var handCard = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
		var imageString = arguments[2];
		var jin1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
		var jin2 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

		var count = 0;
		if (typeof cardIDList != "undefined") {
			count = cardIDList.length;
		}
		for (var index = 0; index < count; index++) {
			var cardID = cardIDList[index];
			var childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			var childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue;
			}
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
			this.ShowJinBgByHNXCMJ(cardID, childNode, jin1, jin2);
			childNode.active = 1;
			this.ShowImage(childNode, imageString, cardID, jin1, jin2);
		}
		//设置多余的卡牌位置空
		for (var cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			var _childName13 = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			var _childNode13 = this.node.getChildByName(_childName13);
			if (!_childNode13) {
				continue;
			}
			_childNode13.active = 0;
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
	ShowJinBgByHNXCMJ: function ShowJinBgByHNXCMJ(cardID, childNode) {
		var jin1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var jin2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

		if (jin1 == 0) {
			if (this.RoomMgr == null) {
				return;
			}
			var room = this.RoomMgr.GetEnterRoom();
			if (!room) return;
			var roomSet = room.GetRoomSet();
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
	ShowShouCardByHnxymj: function ShowShouCardByHnxymj(cardIDList, allKanList, handCard, imageString, jin1, jin2) {
		var count = 0;
		if (typeof cardIDList != "undefined") {
			count = cardIDList.length;
		}
		for (var index = 0; index < count; index++) {
			var cardID = cardIDList[index];
			var childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			var childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue;
			}
			this.ShowJinBg(cardID, childNode, jin1, jin2);
			childNode.active = 1;
			this.ShowImage(childNode, imageString, cardID, jin1, jin2);
			this.ShowDownCardKan(childNode, allKanList.indexOf(cardID) > -1);
		}
		//设置多余的卡牌位置空
		for (var cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			var _childName14 = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			var _childNode14 = this.node.getChildByName(_childName14);
			if (!_childNode14) {
				continue;
			}
			_childNode14.active = 0;
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
	NewTanPaiCard: function NewTanPaiCard(shouCardList, kouPais) {
		var newCardList = new Array();
		for (var i = 0; i < shouCardList.length; i++) {
			if (kouPais.InArray(shouCardList[i])) {
				newCardList.push(shouCardList[i]);
			}
		}
		for (var _i = 0; _i < shouCardList.length; _i++) {
			if (kouPais.InArray(shouCardList[_i])) {
				continue;
			} else {
				newCardList.push(shouCardList[_i]);
			}
		}
		return newCardList;
	},
	ShowShouCardByHsmj: function ShowShouCardByHsmj(cardIDList) {
		var koupais = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
		var handCard = arguments[2];
		var imageString = arguments[3];
		var jin1 = arguments[4];
		var jin2 = arguments[5];

		var count = 0;
		if (typeof cardIDList != "undefined") {
			count = cardIDList.length;
		}
		cardIDList = this.NewTanPaiCard(cardIDList, koupais);
		for (var index = 0; index < count; index++) {
			var cardID = cardIDList[index];
			var childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			var childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue;
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
		for (var cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
			var _childName15 = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			var _childNode15 = this.node.getChildByName(_childName15);
			if (!_childNode15) {
				continue;
			}
			_childNode15.active = 0;
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

	ShowImage: function ShowImage(childNode, imageString, cardID) {
		var childSprite = childNode.getComponent(cc.Sprite);
		if (!childSprite) {
			this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
			return;
		}

		//取卡牌ID的前2位
		var imageName = [imageString, Math.floor(cardID / 100)].join("");
		var imageInfo = this.IntegrateImage[imageName];
		if (!imageInfo) {
			this.ErrLog("fuck ShowImage IntegrateImage.txt not find:%s", imageName);
			return;
		}
		//图片没有变化
		if (childNode.UserData == imageName) {

			this.Log("UserData:%s", imageName);
			return;
		}
		var imagePath = imageInfo["FilePath"];
		if (app['majiang_' + imageName]) {
			childSprite.spriteFrame = app['majiang_' + imageName];
			childNode.UserData = imageName;
		} else {
			var that = this;
			app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame).then(function (spriteFrame) {
				if (!spriteFrame) {
					that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
					return;
				}
				//记录精灵图片对象
				childSprite.spriteFrame = spriteFrame;
				childNode.UserData = imageName;
				app['majiang_' + imageName] = spriteFrame;
			}).catch(function (error) {
				that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
			});
		}
	},
	//江都麻将
	ShowImageByJDMJ: function ShowImageByJDMJ(childNode, imageString, cardID) {
		var childSprite = childNode.getComponent(cc.Sprite);
		if (!childSprite) {
			this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
			return;
		}

		if (5100 > cardID && 5500 < cardID) {
			cardID = 4900;
		}
		//取卡牌ID的前2位
		var imageName = [imageString, Math.floor(cardID / 100)].join("");
		var imageInfo = this.IntegrateImage[imageName];
		if (!imageInfo) {
			this.ErrLog("fuck ShowImage IntegrateImage.txt not find:%s", imageName);
			return;
		}
		//图片没有变化
		if (childNode.UserData == imageName) {
			this.Log("UserData:%s", imageName);
			return;
		}
		var imagePath = imageInfo["FilePath"];
		if (app['majiang_' + imageName]) {
			childSprite.spriteFrame = app['majiang_' + imageName];
			childNode.UserData = imageName;
		} else {
			var that = this;
			app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame).then(function (spriteFrame) {
				if (!spriteFrame) {
					that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
					return;
				}
				//记录精灵图片对象
				childSprite.spriteFrame = spriteFrame;
				childNode.UserData = imageName;
				app['majiang_' + imageName] = spriteFrame;
			}).catch(function (error) {
				that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
			});
		}
	},
	//河南信阳麻将
	ShowDownCardKan: function ShowDownCardKan(childNode, isShow) {
		if (childNode.getChildByName("da")) {
			childNode.getChildByName("da").active = isShow;
		}
	}
});

cc._RF.pop();