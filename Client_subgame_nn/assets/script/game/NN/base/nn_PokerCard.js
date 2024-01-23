var app = require("nn_app");

var PokerCard = app.BaseClass.extend({

	/**
	 * 构造函数
	 */
	Init: function () {
		this.JS_Name = "PokerCard";

		this.pokerDict = {};

		this.LOGIC_MASK_COLOR = 0xF0;
		this.LOGIC_MASK_VALUE = 0x0F;
		this.NNConst_BeiShu = [[0, 1, 1, 1, 1, 1, 1, 2, 2, 3, 4, 5, 6, 8], [0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 5, 6, 8]];//牌型倍数
		this.LoadAllPokerRes();
	},

	SubCardValue: function (poker) {
		let temp = "";
		if (poker.length > 4) {
			temp = poker;
			temp = temp.substring(0, temp.length - 1);
		}
		else {
			temp = poker;
		}

		return temp;
	},

	GetPokeCard: function (poker, cardNode, hideBg = false) {
		if (0 == poker)
			return;
		let type = "";
		let type_2 = "";
		let num = "";
		let cardColor = -1;
		let cardValue = -1;
		let isRed = true;

		cardColor = this.GetCardColor(poker);
		cardValue = this.GetCardValue(poker);

		if (cardColor != 64) {
			let numNode = cardNode.getChildByName("num");
			// if(0.5 == cardNode.anchorX && 0.5 == cardNode.anchorY){
			//     numNode.x = -35;
			//     numNode.y = 55;
			// }

			if (1 == cardValue)//服务端发过来的可能是1
				cardValue = 14;
			else if (15 == cardValue)//跑得快服务端发过来15转为2
				cardValue = 2;

			if (cardColor == 0) {
				type = 'bg_diamond1_1';
				type_2 = 'bg_diamond1_2';
				isRed = true;
			}
			else if (cardColor == 16) {
				type = 'bg_club1_1';
				type_2 = 'bg_club1_2';
				isRed = false;
			}
			else if (cardColor == 32) {
				type = 'bg_heart1_1';
				type_2 = 'bg_heart1_2';
				isRed = true;
			}
			else if (cardColor == 48) {
				type = 'bg_spade1_1';
				type_2 = 'bg_spade1_2';
				isRed = false;
			}

			// if(cardValue == 11){
			//     type = type + "_11";
			// }
			// else if(cardValue == 12){
			//     type = type + "_12";
			// }
			// else if(cardValue == 13){
			//     type = type + "_13";
			// }

			if (isRed) {
				num = "red_" + cardValue.toString();
			}
			else {
				num = "black_" + cardValue.toString();
			}
		} else {
			let numNode = cardNode.getChildByName("num");
			numNode.x = -44;
			numNode.y = 37;
			//大王
			if (cardValue == 1) {
				type = "icon_big_king";
				num = "icon_big_king_01";
			}
			//小王
			else if (cardValue == 2) {
				type = "icon_small_king";
				num = "icon_small_king_01";
			}
		}

		let numSp = cardNode.getChildByName("num").getComponent(cc.Sprite);
		let iconSp = cardNode.getChildByName("icon").getComponent(cc.Sprite);
		let icon1_Sp = cardNode.getChildByName("icon_1").getComponent(cc.Sprite);
		numSp.spriteFrame = this.pokerDict[num];
		iconSp.spriteFrame = this.pokerDict[type];
		icon1_Sp.spriteFrame = this.pokerDict[type_2];
		if (hideBg)
			cardNode.getChildByName("poker_back").active = false;
	},
	GetNNPokerTypeStr: function (curDataType) {
		let roomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
		let room = roomMgr.GetEnterRoom();

		curDataType = parseInt(curDataType);
		let data = {};
		data.typeStr = '';
		data.isBigCard = false;
		data.beiShu = 0;
		//倍数要按房间配置的
		let selectIndex = 0;//没房间配置默认选择0
		let specialCards = [];
		let selectDataList = [];
		if (room) {
			let roomCfg = room.GetRoomConfig();
			selectIndex = roomCfg.fanbeiguize;
			specialCards = roomCfg.teshupaixing;//特殊牌有没有选倍数
		}
		selectDataList = this.NNConst_BeiShu[selectIndex];

		let selectType1 = false;//五花牛
		let selectType2 = false;//炸弹牛
		let selectType3 = false;//五小牛
		for (let i = 0; i < specialCards.length; i++) {
			if (0 == specialCards[i])
				selectType1 = true;
			else if (1 == specialCards[i])
				selectType2 = true;
			else if (2 == specialCards[i])
				selectType3 = true;
		}

		if (0 == curDataType) {//没牛
			data.typeStr = '无马';
		}
		else if (curDataType >= 1 && curDataType < 10) {//牛1到牛9
			data.beiShu = selectDataList[curDataType];
			if (data.beiShu < 2)
				data.typeStr = '牛';
			else
				data.typeStr = '羊';
			switch (curDataType) {
				case 1:
					data.typeStr += '一';
					break;
				case 2:
					data.typeStr += '二';
					break;
				case 3:
					data.typeStr += '三';
					break;
				case 4:
					data.typeStr += '四';
					break;
				case 5:
					data.typeStr += '五';
					break;
				case 6:
					data.typeStr += '六';
					break;
				case 7: {
					if (data.beiShu < 2)
						data.typeStr += '七';
					else
						data.typeStr += '柒';
				}
					break;
				case 8:
					data.typeStr += '八';
					break;
				case 9:
					data.typeStr += '九';
					break;
			}
		}
		else if (10 == curDataType) {
			data.typeStr = '羊羊';
			data.isBigCard = true;
			data.beiShu = selectDataList[curDataType];
		}
		else if (101 == curDataType) {
			data.typeStr = '';
			data.isBigCard = true;
		}
		else if (102 == curDataType) {
			data.typeStr = '';
			data.isBigCard = true;
		}
		else if (103 == curDataType) {
			data.typeStr = '伍花羊';
			data.isBigCard = true;
			if (selectType1) {
				data.beiShu = selectDataList[11];
			}
		}
		else if (104 == curDataType) {
			data.typeStr = '炸弹羊';
			data.isBigCard = true;
			if (selectType2) {
				data.beiShu = selectDataList[12];
			}
		}
		else if (105 == curDataType) {
			data.typeStr = '伍小羊';
			data.isBigCard = true;
			if (selectType3) {
				data.beiShu = selectDataList[13];
			}
		}

		return data;
	},
	LoadAllPokerRes: function () {
		let self = this;
		if (!this.pokerDict) {
			return;
		}
		cc.loader.loadResDir("game/" + app.subGameName.toUpperCase() + "/texture/new_poker", cc.SpriteFrame, function (err, assets) {
			if (err) {
				cc.error(err);
				return;
			}
			for (let i = 0; i < assets.length; i++) {
				self.pokerDict[assets[i]._name] = assets[i];
			}
		});
	},
	NormalPokerSort: function (a, b) {
		let aValue = a & 0x0F;
		let bValue = b & 0x0F;
		return aValue - bValue;
	},
	NNPokerSort: function (pokers) {
		if (0 == pokers.length) {
			console.error("没有牌值pokers", pokers);
			return [];
		}
		let sortList = [];
		let fristIndex = 0;
		let secondIndex = 1;
		let threeIndex = 2;
		while (true) {
			if (this.CheckNiu(pokers[fristIndex], pokers[secondIndex], pokers[threeIndex])) {
				sortList.push(pokers[fristIndex]);
				sortList.push(pokers[secondIndex]);
				sortList.push(pokers[threeIndex]);
				for (let i = 0; i < pokers.length; i++) {
					if (i == fristIndex || i == secondIndex || i == threeIndex)
						continue;
					sortList.push(pokers[i]);
				}
				sortList = this.SortNiu(sortList);
				break;
			}
			else {
				threeIndex++;
				if (threeIndex >= pokers.length) {
					secondIndex++;
					if (secondIndex >= pokers.length - 1) {
						fristIndex++;
						secondIndex = fristIndex + 1;
						if (fristIndex >= pokers.length - 2) {
							//结束了
							return pokers;
						}
					}
					threeIndex = secondIndex + 1;
				}
			}
		}
		return sortList;
	},
	CheckNiu: function (fristValue, secondValue, threeValue) {//传3张检测
		let allValue = 0;
		let curValue1 = this.GetCardValue(fristValue);
		let curValue2 = this.GetCardValue(secondValue);
		let curValue3 = this.GetCardValue(threeValue);
		if (curValue1 > 10) {
			if (14 == curValue1)
				allValue += 1;
			else
				allValue += 10;
		}
		else
			allValue += curValue1;

		if (curValue2 > 10) {
			if (14 == curValue1)
				allValue += 1;
			else
				allValue += 10;
		}
		else
			allValue += curValue2;

		if (curValue3 > 10) {
			if (14 == curValue1)
				allValue += 1;
			else
				allValue += 10;
		}
		else
			allValue += curValue3;

		if (0 == allValue % 10)
			return true;

		return false;
	},
	CheckNiuEx: function (pokers) {
		let fristIndex = 0;
		let secondIndex = 1;
		let threeIndex = 2;
		while (true) {
			if (this.CheckNiu(pokers[fristIndex], pokers[secondIndex], pokers[threeIndex])) {
				return true;
			}
			else {
				threeIndex++;
				if (threeIndex >= pokers.length) {
					secondIndex++;
					if (secondIndex >= pokers.length - 1) {
						fristIndex++;
						secondIndex = fristIndex + 1;
						if (fristIndex >= pokers.length - 2) {
							//结束了
							return false;
						}
					}
					threeIndex = secondIndex + 1;
				}
			}
		}
	},
	SortNiu: function (pokers) {//特殊牌形排序下
		let tempSorts = [];
		tempSorts.push(pokers[0]);
		tempSorts.push(pokers[1]);
		tempSorts.push(pokers[2]);
		tempSorts.sort(this.sortFunAIsMin);

		let tempList = [];
		tempList.push(pokers[3]);
		tempList.push(pokers[4]);
		tempList.sort(this.sortFunAIsMin);
		for (let i = 0; i < tempList.length; i++)
			tempSorts.push(tempList[i]);

		return tempSorts;
	},
	sortFunAIsMin: function (a, b) {
		let valueA = a & 0x0F;
		let valueB = b & 0x0F;
		if (14 == valueA)
			return valueB - valueA;
		else
			return valueB - valueA;
	},
	//获取牌值
	GetCardValue: function (poker) {
		return poker & this.LOGIC_MASK_VALUE;
	},

	//获取花色
	GetCardColor: function (poker) {
		return poker & this.LOGIC_MASK_COLOR;
	},
	//牌型检测
	IsDuiZiByZJH: function (pokers) {
		let card0 = this.GetCardValue(pokers[0]);
		let card1 = this.GetCardValue(pokers[1]);
		let card2 = this.GetCardValue(pokers[2]);
		if (card0 == card1 || card1 == card2)
			return true;
		else
			return false;
	},
	IsShunZiByZJH: function (pokers) {
		let card0 = this.GetCardValue(pokers[0]);
		let card1 = this.GetCardValue(pokers[1]);
		let card2 = this.GetCardValue(pokers[2]);
		if (2 == card0 && 3 == card1 && 14 == card2)
			return true;
		else if (card0 + 1 == card1 && card1 + 1 == card2)
			return true;
		else
			return false;
	},
	IsTongHuaByZJH: function (pokers) {
		let color0 = this.GetCardColor(pokers[0]);
		let color1 = this.GetCardColor(pokers[1]);
		let color2 = this.GetCardColor(pokers[2]);
		if (color0 == color1 && color1 == color2)
			return true;
		else
			return false;
	},
	IsZhaDanByZJH: function (pokers) {
		let card0 = this.GetCardValue(pokers[0]);
		let card1 = this.GetCardValue(pokers[1]);
		let card2 = this.GetCardValue(pokers[2]);
		if (card0 == card1 && card1 == card2)
			return true;
		else
			return false;
	},
});

var g_PokerCard = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_PokerCard) {
		g_PokerCard = new PokerCard();
	}
	return g_PokerCard;
}