/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseComponent"),

	properties: {},

	// use this for initialization
	OnLoad: function () {
		this.JS_Name = this.node.name + "_UIMJCard_Down";
		this.ShareDefine = app.ShareDefine();
		this.ChildCount = 5;
		this.PaiChildCount = 4;
		this.ComTool = app.ComTool();
		this.SysDataManager = app.SysDataManager();
		this.IntegrateImage = this.SysDataManager.GetTableDict("IntegrateImage");
		this.HideAllChild();
	},
	HideAllChild: function () {
		for (let index = 1; index <= this.ChildCount; index++) {
			let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				continue
			}
			childNode.active = false;
			for (let indexChild = 1; indexChild <= this.PaiChildCount; indexChild++) {
				let paiChildName = this.ComTool.StringAddNumSuffix("card", indexChild, 2);
				let paiNode = childNode.getChildByName(paiChildName);
				if (!paiNode) {
					this.ErrLog("HideAllChild(%s) not find:%s", childName, paiChildName);
					continue
				}
				let paiSprite = paiNode.getComponent(cc.Sprite);
				let da = paiNode.getChildByName('da');
				if (da != null) {
					da.active = false;
				}
				let zhi = paiNode.getChildByName('zhi');
				if (zhi != null) {
					zhi.active = false;
				}
				paiSprite.spriteFrame = null;
			}
		}
	},

	ShowDownCard: function (publicCardList, jin1, jin2, imageString = 'EatCard_Self_') {
		let count = 0;
		if (typeof(publicCardList) != "undefined") {
			count = publicCardList.length;
		}
		for (let index = 0; index < count; index++) {
			let publicInfoList = publicCardList[index];
			let cardIDList = publicInfoList.slice(3, publicInfoList.length);
			//操作类型
			let opType = publicInfoList[0];
			//如果是暗杠,前面3个盖牌，最后一个显示牌
			if (opType == this.ShareDefine.OpType_AnGang) {
				if (cardIDList.length = 4) {
					cardIDList = [0, 0, 0, cardIDList[0]];
				} else if (cardIDList.length = 3) {
					cardIDList = [0, cardIDList[0], 0];
				}
			}
			let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				continue
			}
			childNode.active = true;
			let cardCount = cardIDList.length;
			for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
				let cardID = cardIDList[cardIndex];
				let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
				let childPath = [childName, paiChildName].join("/");
				let childNode = cc.find(childPath, this.node);
				if (!childNode) {
					continue
				}
				this.ShowImage(childNode, imageString, cardID);
				this.ShowJinBg(cardID, childNode, jin1, jin2);
			}
			//设置多余的卡牌位置空
			for (let cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
				let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
				let childPath = [childName, paiChildName].join("/");
				let childNode = cc.find(childPath, this.node);
				if (!childNode) {
					continue
				}
				let cardSprite = childNode.getComponent(cc.Sprite);
				cardSprite.spriteFrame = null;

			}
		}

		//隐藏掉剩余的卡牌
		for (let index = count + 1; index <= this.ChildCount; index++) {
			let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				continue
			}
			childNode.active = false;
		}
	},
	Pos2Show: function (pos) {
		let RoomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
		let clientPos = RoomPosMgr.GetClientPos();
		let downPos = RoomPosMgr.GetClientDownPos();
		let facePos = RoomPosMgr.GetClientFacePos();
		let upPos = RoomPosMgr.GetClientUpPos();
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

	ShowTipOutCard: function (cardID) {
		let room = this.RoomMgr.GetEnterRoom();
		let roomSet = room.GetRoomSet();
		let jin1 = roomSet.get_jin1();
		let jin2 = roomSet.get_jin2();


		for (let index = 1; index <= this.ChildCount; index++) {
			let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowTipOutCard not find:%s", childName);
				continue
			}
			for (let paiIndex = 1; paiIndex <= this.PaiChildCount; paiIndex++) {
				let childName = this.ComTool.StringAddNumSuffix("card", paiIndex, 2);
				let paiNode = childNode.getChildByName(childName);
				if (!paiNode) {
					continue
				}
				if ((jin1 > 0 && paiNode.CardType == Math.floor(jin1 / 100)) || (jin2 > 0 && paiNode.CardType == Math.floor(jin2 / 100))) {
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
	ShowAllOutEatCard: function () {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("ShowAllOutEatCard not enter room");
			return
		}
		//UICard01
		let nodeParentName = this.node.parent.name;
		let roomPosMgr = room.GetRoomPosMgr();
		let pos = 0;
		//需要获取当前本家位置ID
		let imageString = "";
		if (nodeParentName.indexOf("Card01") >= 0) {
			pos = roomPosMgr.GetClientPos();
			if (this.is3DShow == 1) {
				imageString = "EatCard_Self_";
			} else if (this.is3DShow == 0) {
				imageString = "OutCard2D_Self_";
			}
		}
		else if (nodeParentName.indexOf("Card02") >= 0) {
			pos = roomPosMgr.GetClientDownPos();
			if (this.is3DShow == 1) {
				imageString = "EatCard_Down_";
			} else if (this.is3DShow == 0) {
				imageString = "OutCard2D_Down_";
			}
		}
		else if (nodeParentName.indexOf("Card03") >= 0) {
			pos = roomPosMgr.GetClientFacePos();
			if (this.is3DShow == 1) {
				imageString = "EatCard_Self_";
			} else if (this.is3DShow == 0) {
				imageString = "OutCard2D_Self_";
			}
		}
		else {
			pos = roomPosMgr.GetClientUpPos();
			if (this.is3DShow == 1) {
				imageString = "EatCard_Up_";
			} else if (this.is3DShow == 0) {
				imageString = "OutCard2D_Up_";
			}
		}
		let roomSet = room.GetRoomSet();
		let jin1 = roomSet.get_jin1();
		let jin2 = roomSet.get_jin2();
		let setPos = roomSet.GetSetPosByPos(pos);
		if (!setPos) {
			this.ErrLog("ShowEatCard(%s) not find:%s", nodeParentName, pos);
			return
		}
		let publicCardList = setPos.GetSetPosProperty("publicCardList");
		// let daList=setPos.GetSetPosProperty("daList");

		/*let touda=daList[0];
		let erda=daList[1];
		let beida=daList[2];*/

		this.Log("ShowEatCard pos(%s) publicCardList:", pos, publicCardList);
		let count = publicCardList.length;
		let benpos = roomPosMgr.GetClientPos();
		for (let index = 0; index < count; index++) {
			let publicInfoList = publicCardList[index];
			let cardIDList = publicInfoList.slice(3, publicInfoList.length);
			//操作类型
			let opType = publicInfoList[0];
			//定位碰吃位置，上家下家还是对家
			let cardbgPos = -1;
			let cardIDPos = publicInfoList[1];
			let getCardID = publicInfoList[2];
			if (opType == this.ShareDefine.OpType_Gang || opType == this.ShareDefine.OpType_JieGang) {
				//暗杠把牌移动到最顶端
				getCardID = publicInfoList[publicInfoList.length - 1];
			} else if (opType == this.ShareDefine.OpType_AnGang) {
				getCardID = 0;
			}
			let showPos = this.Pos2Show(cardIDPos);
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
			let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				this.ErrLog("ShowEatCard not find childName:%s", childName);
				continue
			}
			childNode.active = true;
			let cardCount = cardIDList.length;
			for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
				let cardID = cardIDList[cardIndex];
				let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
				let childPath = [childName, paiChildName].join("/");
				let childNode = cc.find(childPath, this.node);
				if (!childNode) {
					this.ErrLog("ShowEatCard not find childPath:%s", childPath);
					continue
				}
				childNode.CardType = Math.floor(cardID / 100);
				this.ShowJinBg(cardID, childNode, jin1, jin2);
				this.ShowImage(childNode, imageString, cardID);

				//显示头搭二搭被搭
				//二人不搞帖黑底
				if (roomPosMgr.GetRoomPlayerCount() > 2) {
					//if(cardID>0 && cardIndex==cardbgPos){
					if (cardID > 0 && cardID == getCardID) {
						//childNode.color=cc.color(255,180,200);
						let rotate = 'left';
						////本家情况
						if (cardbgPos == 0 && nodeParentName.indexOf("Card01") > 0) {
							rotate = 'left';  //本家碰上家
						} else if ((cardbgPos == 1 || cardbgPos == 3) && nodeParentName.indexOf("Card01") > 0) {
							rotate = 'up';  //本家碰对家
						} else if (cardbgPos == 2 && nodeParentName.indexOf("Card01") > 0) {
							rotate = 'right';  //本家碰下家
						}
						////本家情况
						////下家情况
						else if (cardbgPos == 0 && nodeParentName.indexOf("Card02") > 0) {
							rotate = 'down';  //下家碰上家
						} else if ((cardbgPos == 1 || cardbgPos == 3) && nodeParentName.indexOf("Card02") > 0) {
							rotate = 'left';  //下家碰对家
						} else if (cardbgPos == 2 && nodeParentName.indexOf("Card02") > 0) {
							rotate = 'up';  //本家碰下家
						}
						////下家情况
						////对家情况
						else if (cardbgPos == 0 && nodeParentName.indexOf("Card03") > 0) {
							rotate = 'right';  //对家家碰上家
						} else if ((cardbgPos == 1 || cardbgPos == 3) && nodeParentName.indexOf("Card03") > 0) {
							rotate = 'down';  //对家碰对家
						} else if (cardbgPos == 2 && nodeParentName.indexOf("Card03") > 0) {
							rotate = 'left';  //对家碰下家
						}
						////对家情况
						////上家情况
						else if (cardbgPos == 0 && nodeParentName.indexOf("Card04") > 0) {
							rotate = 'up';  //上家碰上家
						} else if ((cardbgPos == 1 || cardbgPos == 3) && nodeParentName.indexOf("Card04") > 0) {
							rotate = 'right';  //上家碰对家
						} else if (cardbgPos == 2 && nodeParentName.indexOf("Card04") > 0) {
							rotate = 'down';  //上家碰下家
						}
						let roateIcon = childNode.getChildByName('zhi');
						this.ShowZhi(roateIcon, rotate);
						//roateIcon.rotation=rotate;
						//roateIcon.active=true;
					} else {
						childNode.getChildByName('zhi').active = false;
						//childNode.color=cc.color(255,255,255);
					}
				} else {
					childNode.getChildByName('zhi').active = false;
					//childNode.color=cc.color(255,255,255);
				}
			}
			//设置多余的卡牌位置空
			for (let cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
				let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
				let childPath = [childName, paiChildName].join("/");
				let childNode = cc.find(childPath, this.node);
				if (!childNode) {
					this.ErrLog("ShowEatCard not find:%s", childPath);
					continue
				}
				let cardSprite = childNode.getComponent(cc.Sprite);
				cardSprite.spriteFrame = null;
				childNode.getChildByName('zhi').active = false;
				childNode.getChildByName('da').active = false;
			}
		}

		//隐藏掉剩余的卡牌
		for (let index = count + 1; index <= this.ChildCount; index++) {
			let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
			let childNode = this.node.getChildByName(childName);
			if (!childNode) {
				continue
			}
			childNode.active = false;
		}
	},
	ShowJinBg: function (cardID, childNode, jin1 = 0, jin2 = 0) {
		if (Math.floor(cardID / 100) == Math.floor(jin1 / 100) ||
			Math.floor(cardID / 100) == Math.floor(jin2 / 100)) {
			if (cardID != 0) {
				childNode.color = cc.color(255, 255, 0);
				childNode.getChildByName("da").active = true;
			}
		} else {
			childNode.color = cc.color(255, 255, 255);
			childNode.getChildByName("da").active = false;
		}
	},
	ShowZhi: function (childNode, zhi) {
		let imageName = "zhi_" + zhi;
		/*if(this.is3DShow==0){
			imageName = "zhibz_"+zhi;
		} else if(this.is3DShow==2){
			imageName = "zhijp_"+zhi;
		}*/
		let imageInfo = this.IntegrateImage[imageName];
		if (!imageInfo) {
			this.ErrLog("ShowImage IntegrateImage.txt not find:%s", imageName);
			return
		}
		let imagePath = imageInfo["FilePath"];
		let that = this;
		let childSprite = childNode.getComponent(cc.Sprite);
		childSprite.spriteFrame = null;
		app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame)
			.then(function (spriteFrame) {
				if (!spriteFrame) {
					that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
					return
				}
				childSprite.spriteFrame = spriteFrame;
			})
			.catch(function (error) {
					that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
				}
			);
		childNode.active = true;
	},
	ShowImage: function (childNode, imageString, cardID) {
		//显示贴图
		let childSprite = childNode.getComponent(cc.Sprite);
		if (!childSprite) {
			this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
			return
		}
		let imageName = "";
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
		let imageInfo = this.IntegrateImage[imageName];
		if (!imageInfo) {
			this.ErrLog("ShowImage IntegrateImage.txt not find:%s", imageString);
			return
		}
		let imagePath = imageInfo["FilePath"];
		let that = this;
		app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame)
			.then(function (spriteFrame) {
				if (!spriteFrame) {
					that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
					return
				}
				childSprite.spriteFrame = spriteFrame;
			})
			.catch(function (error) {
					that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
				}
			);
	},
});