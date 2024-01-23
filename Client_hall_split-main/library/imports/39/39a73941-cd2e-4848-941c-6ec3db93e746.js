"use strict";
cc._RF.push(module, '39a73lBzS5ISJQcbsPbk+dG', 'ytmj_UIMJCard_Down');
// script/ui/uiGame/ytmj/ytmj_UIMJCard_Down.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
	extends: require("BaseComponent"),

	properties: {},

	// use this for initialization
	OnLoad: function OnLoad() {
		this.JS_Name = this.node.name + "_UIMJCard_Down";
		this.ShareDefine = app.ShareDefine();
		this.ChildCount = 5;
		this.PaiChildCount = 4;
		this.ComTool = app.ComTool();
		this.SysDataManager = app.SysDataManager();
		this.IntegrateImage = this.SysDataManager.GetTableDict("IntegrateImage");
		this.HideAllChild();
	},
	HideAllChild: function HideAllChild() {
		for (var index = 1; index <= this.ChildCount; index++) {
			var childName = this.ComTool.StringAddNumSuffix("down", index, 2);
			var childNode = this.node.getChildByName(childName);
			if (!childNode) {
				continue;
			}
			childNode.active = false;
			for (var indexChild = 1; indexChild <= this.PaiChildCount; indexChild++) {
				var paiChildName = this.ComTool.StringAddNumSuffix("card", indexChild, 2);
				var paiNode = childNode.getChildByName(paiChildName);
				if (!paiNode) {
					this.ErrLog("HideAllChild(%s) not find:%s", childName, paiChildName);
					continue;
				}
				var paiSprite = paiNode.getComponent(cc.Sprite);
				var da = paiNode.getChildByName('da');
				if (da != null) {
					da.active = false;
				}
				var zhi = paiNode.getChildByName('zhi');
				if (zhi != null) {
					zhi.active = false;
				}
				paiSprite.spriteFrame = null;
			}
		}
	},

	ShowDownCard: function ShowDownCard(publicCardList, jin1, jin2) {
		var imageString = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'EatCard_Self_';

		var count = 0;
		if (typeof publicCardList != "undefined") {
			count = publicCardList.length;
		}
		for (var index = 0; index < count; index++) {
			var publicInfoList = publicCardList[index];
			var cardIDList = publicInfoList.slice(3, publicInfoList.length);
			//操作类型
			var opType = publicInfoList[0];
			//如果是暗杠,前面3个盖牌，最后一个显示牌
			if (opType == this.ShareDefine.OpType_AnGang) {
				if (cardIDList.length = 4) {
					cardIDList = [0, 0, 0, cardIDList[0]];
				} else if (cardIDList.length = 3) {
					cardIDList = [0, cardIDList[0], 0];
				}
			}
			var childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
			var childNode = this.node.getChildByName(childName);
			if (!childNode) {
				continue;
			}
			childNode.active = true;
			var cardCount = cardIDList.length;
			for (var cardIndex = 0; cardIndex < cardCount; cardIndex++) {
				var cardID = cardIDList[cardIndex];
				var paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
				var childPath = [childName, paiChildName].join("/");
				var _childNode = cc.find(childPath, this.node);
				if (!_childNode) {
					continue;
				}
				this.ShowImage(_childNode, imageString, cardID);
				this.ShowJinBg(cardID, _childNode, jin1, jin2);
			}
			//设置多余的卡牌位置空
			for (var _cardIndex = cardCount + 1; _cardIndex <= this.PaiChildCount; _cardIndex++) {
				var _paiChildName = this.ComTool.StringAddNumSuffix("card", _cardIndex, 2);
				var _childPath = [childName, _paiChildName].join("/");
				var _childNode2 = cc.find(_childPath, this.node);
				if (!_childNode2) {
					continue;
				}
				var cardSprite = _childNode2.getComponent(cc.Sprite);
				cardSprite.spriteFrame = null;
			}
		}

		//隐藏掉剩余的卡牌
		for (var _index = count + 1; _index <= this.ChildCount; _index++) {
			var _childName = this.ComTool.StringAddNumSuffix("down", _index, 2);
			var _childNode3 = this.node.getChildByName(_childName);
			if (!_childNode3) {
				continue;
			}
			_childNode3.active = false;
		}
	},
	Pos2Show: function Pos2Show(pos) {
		var RoomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
		var clientPos = RoomPosMgr.GetClientPos();
		var downPos = RoomPosMgr.GetClientDownPos();
		var facePos = RoomPosMgr.GetClientFacePos();
		var upPos = RoomPosMgr.GetClientUpPos();
		if (pos == clientPos) {
			return 1;
		} else if (pos == downPos) {
			return 2;
		} else if (pos == facePos) {
			return 3;
		} else if (pos == upPos) {
			return 4;
		}
		return -1;
	},

	ShowTipOutCard: function ShowTipOutCard(cardID) {
		var room = this.RoomMgr.GetEnterRoom();
		var roomSet = room.GetRoomSet();
		var jin1 = roomSet.get_jin1();
		var jin2 = roomSet.get_jin2();

		for (var index = 1; index <= this.ChildCount; index++) {
			var childName = this.ComTool.StringAddNumSuffix("down", index, 2);
			var childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowTipOutCard not find:%s", childName);
				continue;
			}
			for (var paiIndex = 1; paiIndex <= this.PaiChildCount; paiIndex++) {
				var _childName2 = this.ComTool.StringAddNumSuffix("card", paiIndex, 2);
				var paiNode = childNode.getChildByName(_childName2);
				if (!paiNode) {
					continue;
				}
				if (jin1 > 0 && paiNode.CardType == Math.floor(jin1 / 100) || jin2 > 0 && paiNode.CardType == Math.floor(jin2 / 100)) {
					if (paiNode.CardType != 0) {
						paiNode.color = cc.color(255, 255, 0);
					} else {
						paiNode.color = cc.color(255, 255, 255);
					}
				} else {
					if (Math.floor(cardID / 100) == paiNode.CardType) {
						paiNode.color = cc.color(0, 255, 0);
					} else {
						paiNode.color = cc.color(255, 255, 255);
					}
				}
			}
		}
	},

	//显示所有吃到的牌
	ShowAllOutEatCard: function ShowAllOutEatCard() {
		var room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("ShowAllOutEatCard not enter room");
			return;
		}
		//UICard01
		var nodeParentName = this.node.parent.name;
		var roomPosMgr = room.GetRoomPosMgr();
		var pos = 0;
		//需要获取当前本家位置ID
		var imageString = "";
		if (nodeParentName.indexOf("Card01") >= 0) {
			pos = roomPosMgr.GetClientPos();
			if (this.is3DShow == 1) {
				imageString = "EatCard_Self_";
			} else if (this.is3DShow == 0) {
				imageString = "OutCard2D_Self_";
			}
		} else if (nodeParentName.indexOf("Card02") >= 0) {
			pos = roomPosMgr.GetClientDownPos();
			if (this.is3DShow == 1) {
				imageString = "EatCard_Down_";
			} else if (this.is3DShow == 0) {
				imageString = "OutCard2D_Down_";
			}
		} else if (nodeParentName.indexOf("Card03") >= 0) {
			pos = roomPosMgr.GetClientFacePos();
			if (this.is3DShow == 1) {
				imageString = "EatCard_Self_";
			} else if (this.is3DShow == 0) {
				imageString = "OutCard2D_Self_";
			}
		} else {
			pos = roomPosMgr.GetClientUpPos();
			if (this.is3DShow == 1) {
				imageString = "EatCard_Up_";
			} else if (this.is3DShow == 0) {
				imageString = "OutCard2D_Up_";
			}
		}
		var roomSet = room.GetRoomSet();
		var jin1 = roomSet.get_jin1();
		var jin2 = roomSet.get_jin2();
		var setPos = roomSet.GetSetPosByPos(pos);
		if (!setPos) {
			this.ErrLog("ShowEatCard(%s) not find:%s", nodeParentName, pos);
			return;
		}
		var publicCardList = setPos.GetSetPosProperty("publicCardList");
		// let daList=setPos.GetSetPosProperty("daList");

		/*let touda=daList[0];
  let erda=daList[1];
  let beida=daList[2];*/

		this.Log("ShowEatCard pos(%s) publicCardList:", pos, publicCardList);
		var count = publicCardList.length;
		var benpos = roomPosMgr.GetClientPos();
		for (var index = 0; index < count; index++) {
			var publicInfoList = publicCardList[index];
			var cardIDList = publicInfoList.slice(3, publicInfoList.length);
			//操作类型
			var opType = publicInfoList[0];
			//定位碰吃位置，上家下家还是对家
			var cardbgPos = -1;
			var cardIDPos = publicInfoList[1];
			var getCardID = publicInfoList[2];
			if (opType == this.ShareDefine.OpType_Gang || opType == this.ShareDefine.OpType_JieGang) {
				//暗杠把牌移动到最顶端
				getCardID = publicInfoList[publicInfoList.length - 1];
			} else if (opType == this.ShareDefine.OpType_AnGang) {
				getCardID = 0;
			}
			var showPos = this.Pos2Show(cardIDPos);
			if (nodeParentName.indexOf("Card01") > 0) {
				if (showPos == 1) {
					cardIDPos = 0;
				} else if (showPos == 2) {
					cardIDPos = 3;
				} else if (showPos == 3) {
					cardIDPos = 2;
				} else if (showPos == 4) {
					cardIDPos = 1;
				}
			} else if (nodeParentName.indexOf("Card02") > 0) {
				if (showPos == 1) {
					cardIDPos = 1;
				} else if (showPos == 2) {
					cardIDPos = 0;
				} else if (showPos == 3) {
					cardIDPos = 3;
				} else if (showPos == 4) {
					cardIDPos = 2;
				}
			} else if (nodeParentName.indexOf("Card03") > 0) {
				if (showPos == 1) {
					cardIDPos = 2;
				} else if (showPos == 2) {
					cardIDPos = 1;
				} else if (showPos == 3) {
					cardIDPos = 0;
				} else if (showPos == 4) {
					cardIDPos = 3;
				}
			} else if (nodeParentName.indexOf("Card04")) {
				if (showPos == 1) {
					cardIDPos = 3;
				} else if (showPos == 2) {
					cardIDPos = 2;
				} else if (showPos == 3) {
					cardIDPos = 1;
				} else if (showPos == 4) {
					cardIDPos = 0;
				}
			}

			if (cardIDPos == 1) {
				cardbgPos = 0;
			} else if (cardIDPos == 2) {
				cardbgPos = 1;
			} else if (cardIDPos == 3) {
				cardbgPos = 2;
			}
			if (cardIDList.length == 4 && cardbgPos == 1) {
				//如果是杠，牌还是对家的，那蒙版就贴在第4张
				cardbgPos = 3;
			}
			//如果是暗杠,前面3个盖牌，最后一个显示牌
			if (opType == this.ShareDefine.OpType_AnGang) {
				// 暗杠改成所有人都可以看到第一張
				if (nodeParentName.indexOf("Card01") >= 0) {
					if (cardIDList.length == 4) {
						// cardIDList = [0,0,0,cardIDList[0]];
						cardIDList = [0, 0, 0, 0];
					} else if (cardIDList.length == 3) {
						cardIDList = [0, cardIDList[0], 0];
					}
				} else {
					cardIDList = [0, 0, 0, 0];
				}
			}
			var childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
			var childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowEatCard not find childName:%s", childName);
				continue;
			}
			childNode.active = true;
			var cardCount = cardIDList.length;
			for (var cardIndex = 0; cardIndex < cardCount; cardIndex++) {
				var cardID = cardIDList[cardIndex];
				var paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
				var childPath = [childName, paiChildName].join("/");
				var _childNode4 = cc.find(childPath, this.node);
				if (!_childNode4) {
					this.ErrLog("ShowEatCard not find childPath:%s", childPath);
					continue;
				}
				_childNode4.CardType = Math.floor(cardID / 100);
				this.ShowJinBg(cardID, _childNode4, jin1, jin2);
				this.ShowImage(_childNode4, imageString, cardID);

				//显示头搭二搭被搭
				//二人不搞帖黑底
				if (roomPosMgr.GetRoomPlayerCount() > 2) {
					//if(cardID>0 && cardIndex==cardbgPos){
					if (cardID > 0 && cardID == getCardID) {
						//childNode.color=cc.color(255,180,200);
						var rotate = 'left';
						////本家情况
						if (cardbgPos == 0 && nodeParentName.indexOf("Card01") > 0) {
							rotate = 'left'; //本家碰上家
						} else if ((cardbgPos == 1 || cardbgPos == 3) && nodeParentName.indexOf("Card01") > 0) {
							rotate = 'up'; //本家碰对家
						} else if (cardbgPos == 2 && nodeParentName.indexOf("Card01") > 0) {
							rotate = 'right'; //本家碰下家
						}
						////本家情况
						////下家情况
						else if (cardbgPos == 0 && nodeParentName.indexOf("Card02") > 0) {
								rotate = 'down'; //下家碰上家
							} else if ((cardbgPos == 1 || cardbgPos == 3) && nodeParentName.indexOf("Card02") > 0) {
								rotate = 'left'; //下家碰对家
							} else if (cardbgPos == 2 && nodeParentName.indexOf("Card02") > 0) {
								rotate = 'up'; //本家碰下家
							}
							////下家情况
							////对家情况
							else if (cardbgPos == 0 && nodeParentName.indexOf("Card03") > 0) {
									rotate = 'right'; //对家家碰上家
								} else if ((cardbgPos == 1 || cardbgPos == 3) && nodeParentName.indexOf("Card03") > 0) {
									rotate = 'down'; //对家碰对家
								} else if (cardbgPos == 2 && nodeParentName.indexOf("Card03") > 0) {
									rotate = 'left'; //对家碰下家
								}
								////对家情况
								////上家情况
								else if (cardbgPos == 0 && nodeParentName.indexOf("Card04") > 0) {
										rotate = 'up'; //上家碰上家
									} else if ((cardbgPos == 1 || cardbgPos == 3) && nodeParentName.indexOf("Card04") > 0) {
										rotate = 'right'; //上家碰对家
									} else if (cardbgPos == 2 && nodeParentName.indexOf("Card04") > 0) {
										rotate = 'down'; //上家碰下家
									}
						var roateIcon = _childNode4.getChildByName('zhi');
						this.ShowZhi(roateIcon, rotate);
						//roateIcon.rotation=rotate;
						//roateIcon.active=true;
					} else {
						_childNode4.getChildByName('zhi').active = false;
						//childNode.color=cc.color(255,255,255);
					}
				} else {
					_childNode4.getChildByName('zhi').active = false;
					//childNode.color=cc.color(255,255,255);
				}
			}
			//设置多余的卡牌位置空
			for (var _cardIndex2 = cardCount + 1; _cardIndex2 <= this.PaiChildCount; _cardIndex2++) {
				var _paiChildName2 = this.ComTool.StringAddNumSuffix("card", _cardIndex2, 2);
				var _childPath2 = [childName, _paiChildName2].join("/");
				var _childNode5 = cc.find(_childPath2, this.node);
				if (!_childNode5) {
					this.ErrLog("ShowEatCard not find:%s", _childPath2);
					continue;
				}
				var cardSprite = _childNode5.getComponent(cc.Sprite);
				cardSprite.spriteFrame = null;
				_childNode5.getChildByName('zhi').active = false;
				_childNode5.getChildByName('da').active = false;
			}
		}

		//隐藏掉剩余的卡牌
		for (var _index2 = count + 1; _index2 <= this.ChildCount; _index2++) {
			var _childName3 = this.ComTool.StringAddNumSuffix("down", _index2, 2);
			var _childNode6 = this.node.getChildByName(_childName3);
			if (!_childNode6) {
				continue;
			}
			_childNode6.active = false;
		}
	},
	ShowJinBg: function ShowJinBg(cardID, childNode) {
		var jin1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var jin2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

		if (Math.floor(cardID / 100) == Math.floor(jin1 / 100) || Math.floor(cardID / 100) == Math.floor(jin2 / 100)) {
			if (cardID != 0) {
				childNode.color = cc.color(255, 255, 0);
				childNode.getChildByName("da").active = true;
			}
		} else {
			childNode.color = cc.color(255, 255, 255);
			childNode.getChildByName("da").active = false;
		}
	},
	ShowZhi: function ShowZhi(childNode, zhi) {
		var imageName = "zhi_" + zhi;
		/*if(this.is3DShow==0){
  	imageName = "zhibz_"+zhi;
  } else if(this.is3DShow==2){
  	imageName = "zhijp_"+zhi;
  }*/
		var imageInfo = this.IntegrateImage[imageName];
		if (!imageInfo) {
			this.ErrLog("ShowImage IntegrateImage.txt not find:%s", imageName);
			return;
		}
		var imagePath = imageInfo["FilePath"];
		var that = this;
		var childSprite = childNode.getComponent(cc.Sprite);
		childSprite.spriteFrame = null;
		app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame).then(function (spriteFrame) {
			if (!spriteFrame) {
				that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
				return;
			}
			childSprite.spriteFrame = spriteFrame;
		}).catch(function (error) {
			that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
		});
		childNode.active = true;
	},
	ShowImage: function ShowImage(childNode, imageString, cardID) {
		//显示贴图
		var childSprite = childNode.getComponent(cc.Sprite);
		if (!childSprite) {
			this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
			return;
		}
		var imageName = "";
		if (cardID) {
			//取卡牌ID的前2位
			imageName = [imageString, Math.floor(cardID / 100)].join("");
		} else {
			if (imageString == "EatCard_Self_") {
				imageName = "CardBack_Self";
			} else if (imageString == "EatCard_Up_") {
				imageName = "CardBack_Up";
			} else if (imageString == "EatCard_Down_") {
				imageName = "CardBack_Down";
			} else if (imageString == "OutCard2D_Self_") {
				imageName = "OutCard2D_Self_50";
			} else if (imageString == "OutCard2D_Up_") {
				imageName = "OutCard2D_Up_50";
			} else if (imageString == "OutCard2D_Down_") {
				imageName = "OutCard2D_Down_50";
			}

			/*else if(imageString=="OutCardJP_Self_"){
   	imageName = "CardBackJP_Self";
   }else if(imageString=="EatCardJP_Self_"){
   	imageName = "CardBackJP_Self";
   }else if(imageString=="OutCardJP_Up_"){
   	imageName = "CardBackJP_Up";
   }else if(imageString=="OutCardJP_Down_"){
   	imageName = "CardBackJP_Down";
   }*/
		}
		var imageInfo = this.IntegrateImage[imageName];
		if (!imageInfo) {
			this.ErrLog("ShowImage IntegrateImage.txt not find:%s", imageString);
			return;
		}
		var imagePath = imageInfo["FilePath"];
		var that = this;
		app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame).then(function (spriteFrame) {
			if (!spriteFrame) {
				that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
				return;
			}
			childSprite.spriteFrame = spriteFrame;
		}).catch(function (error) {
			that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
		});
	}
});

cc._RF.pop();