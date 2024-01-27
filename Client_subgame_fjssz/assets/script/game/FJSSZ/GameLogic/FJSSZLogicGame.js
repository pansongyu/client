var app = require("fjssz_app");

var GQPLSLogicGame = app.BaseClass.extend({

	/*Init:function(){

        var DUN_TYPE  = {
            First,
            MIDDLE,
            END 
        }
        /*牌型大小：
        牌型大小顺序为：
        同花顺>铁支>葫芦>同花>顺子>三条>二对>一对>散牌（乌龙）
        牌面大小顺序为：
        A>K>Q>J>10>9>8>7>6>5>4>3>2
        特殊牌型大小顺序为：
        至尊清龙>一条龙>十二皇族>三同花顺>三分天下>全大>全小>凑一色>双怪冲三>四套三条>五对三条>六对半>三顺子>三同花
        至尊清龙：清一色的从1（A）－－－13（k）
        一条龙：从1（A）－－－13（k）
        十二皇族：12张都是10以上的牌
        三同花顺： 3 5 5都是同花顺
        三分天下：13张牌出现3副炸弹加一张杂牌（或称三套四梅、铁支）
        全大：十三张牌数字都为8—A
        全小：十三张牌数字都为2—8
        凑一色：十三牌都是方块、梅花或者黑桃、红心（指的在杂牌无任何特殊牌型出现的情况下）
        双怪冲三：指的是2对葫芦+1个对子+任意一张杂牌
        四套三条：指的是4套相同的三张牌+任意一张杂牌
        五对三条：指的是5个对子+三张相同的牌型（三张牌冲头）
        六对半：指的是6个对子+任意一张杂牌
        三顺子：指三敦水都是顺子牌（也成杂顺）
        三同花：指三敦水都是同一种花色牌（也成杂花）*/
	/**/


	Init: function () {
		this.JS_Name = app.subGameName + "LogicGame";

		this.ComTool = app[app.subGameName + "_ComTool"]();
		this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
		this.WeChatManager = app[app.subGameName + "_WeChatManager"]();
		this.PokerCard = app[app.subGameName + "_PokerCard"]();
		this.RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
		this.HUA_LEN = 4;

		this.pokerType = [
			0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E,   //方块 2-A
			0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E,   //梅花 2-A
			0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D, 0x2E,   //红桃 2-A
			0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E,];//黑桃 2-A

		this.LOGIC_MASK_COLOR = 0xF0;
		this.LOGIC_MASK_VALUE = 0x0F;
		this.wangPaiNum = 0;
		this.sortSize = 0;
		this.sortColor = 0;
		this.clearList = [];

		this.CARD_TYPE_WULONG = -1;
		this.CARD_TYPE_DUIZI = 0;
		this.CARD_TYPE_LIANGDUI = 1;
		this.CARD_TYPE_SANTIAO = 2;
		this.CARD_TYPE_ZHADAN_CHONGZHA = 2.1;
		this.CARD_TYPE_ZHADAN_SHUANGWANGCHONGTOU = 2.2;
		this.CARD_TYPE_ZHADAN_SANGUI = 2.3;
		this.CARD_TYPE_SHUNZI = 3;
		this.CARD_TYPE_TONGHUA = 4;
		this.CARD_TYPE_YIDUITONGHUA = 5;
		this.CARD_TYPE_LIANGDUITONGHUA = 6;
		this.CARD_TYPE_HULU = 7;
		this.CARD_TYPE_ZHADAN = 8;
		this.CARD_TYPE_TONGHUASHUN = 9;
		this.CARD_TYPE_WUTONG = 10;
		this.CARD_TYPE_LIUTONG = 11;
		this.CARD_TYPE_WUGUI = 12;

		this.guiClearCardDict = {
			0: [],
			2: [2, 3],
			3: [2, 3, 4],
			4: [2, 3, 4, 5],
			5: [2, 3, 4, 5, 6],
			6: [2, 3, 4, 5, 6, 7],
			7: [2, 3, 4, 5, 6, 7, 8],
			8: [2, 3, 4, 5, 6, 7, 8, 9],
			9: [2, 3, 4, 5, 6, 7, 8, 9, 10],
			10: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
			11: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
			12: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
			13: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
		};
		console.log("this.guiClearCardDict", this.guiClearCardDict);
	},
	SetSign: function (sign, num) {//1、经典场 2、王牌场 3、特殊王牌场
		this.sign = sign;
		if (this.sign == 2) {
			num = 2;
		} else if (this.sign == 1) {
			num = 0;
		}
		this.SetWangPaiNum(num);
	},
	SetWangPaiNum: function (num) {
		this.wangPaiNum = num;
		this.clearList = this.guiClearCardDict[this.wangPaiNum];
	},
	sortFun: function (a, b) {
		return a - b;
	},
	CheckCardType: function (cards) {
		if (this.IsWuGui(cards)) {
			return this.CARD_TYPE_WUGUI;
		} else if (this.IsLiuTong(cards)) {
			return this.CARD_TYPE_LIUTONG;
		} else if (this.IsWuTong(cards)) {
			return this.CARD_TYPE_WUTONG;
		} else if (this.IsTongHuaShun(cards)) {
			return this.CARD_TYPE_TONGHUASHUN;
		} else if (this.GetZhaDan(cards).length != 0) {
			if (this.IsChongZha(cards, true)) {
				return this.CARD_TYPE_ZHADAN
				return this.CARD_TYPE_ZHADAN_CHONGZHA;
			} else if (this.IsShuangWangChongTou(cards)) {
				return this.CARD_TYPE_SANTIAO
				return this.CARD_TYPE_ZHADAN_SHUANGWANGCHONGTOU;
			}
			return this.CARD_TYPE_ZHADAN;
		} else if (this.GetHulu(cards).length != 0) {
			return this.CARD_TYPE_HULU;
		} else if (this.GetLiangDuiTongHua(cards).length != 0) {
			return this.CARD_TYPE_LIANGDUITONGHUA;
		} else if (this.GetYiDuiTongHua(cards).length != 0) {
			return this.CARD_TYPE_YIDUITONGHUA;
		} else if (this.GetTonghuaEx(cards).length != 0) {
			return this.CARD_TYPE_TONGHUA;
		} else if (this.GetShunziEx(cards).length != 0) {
			return this.CARD_TYPE_SHUNZI;
		} else if (this.IsSanGui(cards)) {
			return this.CARD_TYPE_SANTIAO;
		} else if (this.IsShuangWangChongTou(cards)) {
			return this.CARD_TYPE_SANTIAO
			return this.CARD_TYPE_ZHADAN_SHUANGWANGCHONGTOU;
		} else if (this.IsChongZha(cards, true)) {
			return this.CARD_TYPE_ZHADAN
			return this.CARD_TYPE_ZHADAN_CHONGZHA;
		} else if (this.GetSanTiaoEx(cards, false).length != 0) {
			return this.CARD_TYPE_SANTIAO;
		} else if (this.GetLiangDui(cards).length != 0) {
			return this.CARD_TYPE_LIANGDUI;
		} else if (this.GetDuiZi(cards).length != 0) {
			return this.CARD_TYPE_DUIZI;
		} else {
			return this.CARD_TYPE_WULONG;
		}
	},
	/*
    *  [[{cardType:9, cardList:[]},{cardType:9, cardList:[]},{cardType:9, cardList:[]}],[],[],[],[]]
    */
	//获取5组最优牌型  (自动理牌功能)
	GetAllCardType: function (cards) {
		this.lastMaxCardType_1 = [];//纪录上一次最大的牌型
		this.lastMaxCardType_2 = [];
		this.lastMaxCardType_3 = [];
		let allCardType = [];
		for (let i = 0; i < 5; i++) {
			let curCardType = {};
			let curCardList = [];
			let curAllCards = this.copyArr(cards);
			if (this.GetWuGuis(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_WUGUI) &&
				curCardList.length < 2) {
				for (let a = 0; a < 1; a++) {
					let wugui = this.GetWuGuis(curAllCards)[0];
					if (wugui.length == 5) {
						curCardList.push({cardType: this.CARD_TYPE_WUGUI, cardList: wugui});
						//移除该牌型的牌，再继续获取第二组
						this.RemoveArrFormAll(curAllCards, wugui);
					} else {
						console.log("获取五鬼牌数不足", wugui);
					}
				}
			}
			if (this.GetLiuTongs(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_LIUTONG) &&
				curCardList.length < 2) {
				for (let a = 0; a < 1; a++) {
					let liutong = this.GetLiuTongs(curAllCards)[0];
					if (liutong.length == 5) {
						curCardList.push({cardType: this.CARD_TYPE_LIUTONG, cardList: liutong});
						//移除该牌型的牌，再继续获取第二组
						this.RemoveArrFormAll(curAllCards, liutong);
					} else {
						console.log("获取六同牌数不足", liutong);
					}
				}

			}
			if (this.GetWuTong(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_WUTONG) &&
				curCardList.length < 2) {
				for (let a = 0; a < 1; a++) {
					let wutong = this.GetWuTong(curAllCards)[0];
					if (wutong.length == 4 || wutong.length == 5) {
						curCardList.push({cardType: this.CARD_TYPE_WUTONG, cardList: wutong});
						//移除该牌型的牌，再继续获取第二组
						this.RemoveArrFormAll(curAllCards, wutong);
					} else {
						console.log("获取五同牌数不足", wutong);
					}
				}
			}
			if (this.GetTongHuaShunEx(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_TONGHUASHUN) &&
				curCardList.length < 2) {
				for (let a = 0; a < 1; a++) {
					let tongHuaShun = this.GetTongHuaShunEx(curAllCards)[0];
					if (tongHuaShun.length == 5) {
						curCardList.push({cardType: this.CARD_TYPE_TONGHUASHUN, cardList: tongHuaShun});
						//移除该牌型的牌，再继续获取第二组
						this.RemoveArrFormAll(curAllCards, tongHuaShun);
					} else {
						console.log("获取同花顺牌数不足", tongHuaShun);
					}
				}
			}
			if (this.GetZhaDan(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_ZHADAN) &&
				curCardList.length < 2) {
				for (let a = 0; a < 1; a++) {
					let zhaDan = this.GetZhaDan(curAllCards)[0];
					console.log("获取铁支牌型", zhaDan);
					if (zhaDan.length == 3 || zhaDan.length == 4) {
						curCardList.push({cardType: this.CARD_TYPE_ZHADAN, cardList: zhaDan});
						//移除该牌型的牌，再继续获取第二组
						this.RemoveArrFormAll(curAllCards, zhaDan);
					} else {
						console.log("获取铁支牌数不足", zhaDan);
					}
				}
			}
			if (this.GetHuluEx(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_HULU) &&
				curCardList.length < 2) {
				for (let a = 0; a < 1; a++) {
					let hulu = this.GetHuluEx(curAllCards)[0];
					if (hulu.length == 5) {
						curCardList.push({cardType: this.CARD_TYPE_HULU, cardList: hulu});
						//移除该牌型的牌，再继续获取第二组
						this.RemoveArrFormAll(curAllCards, hulu);
					} else {
						console.log("获取葫芦牌数不足", hulu);
					}
				}
			}
			if (this.GetTonghua(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_TONGHUA) &&
				curCardList.length < 2) {
				// lastMaxCardType.push(4);
				for (let a = 0; a < 1; a++) {
					let tonghua = this.GetTonghua(curAllCards)[0];
					if (tonghua.length == 5) {
						curCardList.push({cardType: this.CARD_TYPE_TONGHUA, cardList: tonghua});
						//移除该牌型的牌，再继续获取第二组
						this.RemoveArrFormAll(curAllCards, tonghua);
					} else {
						console.log("获取同花牌数不足", tonghua);
					}
				}
			}
			if (this.GetShunzi(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_SHUNZI) &&
				curCardList.length < 2) {
				// lastMaxCardType.push(3);
				for (let a = 0; a < 1; a++) {
					let shunzi = this.GetShunzi(curAllCards)[0];
					//如果是同花顺 continue
					if (this.IsTongHuaShun(shunzi)) {
						continue;
					}
					if (shunzi.length == 5) {
						curCardList.push({cardType: this.CARD_TYPE_SHUNZI, cardList: shunzi});
						//移除该牌型的牌，再继续获取第二组
						this.RemoveArrFormAll(curAllCards, shunzi);
					} else {
						console.log("获取顺子牌数不足", shunzi);
					}
				}
			}
			if (this.GetSanGui(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_ZHADAN_SANGUI)) {
				// lastMaxCardType.push(2);
				for (let a = 0; a < 1; a++) {
					let sangui = this.GetSanGui(curAllCards)[0];
					if (sangui.length == 3) {
						curCardList.push({cardType: this.CARD_TYPE_ZHADAN_SANGUI, cardList: sangui});
						//移除该牌型的牌，再继续获取第二组
						this.RemoveArrFormAll(curAllCards, sangui);
					} else {
						console.log("获取三鬼牌数不足", sangui);
					}
				}
			}
			if (this.GetShuangWangChongTou(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_ZHADAN_SHUANGWANGCHONGTOU)) {
				// lastMaxCardType.push(2);
				for (let a = 0; a < 1; a++) {
					let shuangwang = this.GetShuangWangChongTou(curAllCards)[0];
					if (shuangwang.length == 3) {
						curCardList.push({cardType: this.CARD_TYPE_ZHADAN_SHUANGWANGCHONGTOU, cardList: shuangwang});
						//移除该牌型的牌，再继续获取第二组
						this.RemoveArrFormAll(curAllCards, shuangwang);
					} else {
						console.log("获取双王冲头牌数不足", shuangwang);
					}
				}
			}
			if (this.GetChongZha(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_ZHADAN_CHONGZHA)) {
				// lastMaxCardType.push(2);
				for (let a = 0; a < 1; a++) {
					let chongzha = this.GetChongZha(curAllCards)[0];
					if (chongzha.length == 3) {
						curCardList.push({cardType: this.CARD_TYPE_ZHADAN_CHONGZHA, cardList: chongzha});
						//移除该牌型的牌，再继续获取第二组
						this.RemoveArrFormAll(curAllCards, chongzha);
					} else {
						console.log("获取冲炸牌数不足", chongzha);
					}
				}
			}
			if (this.GetSanTiao(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_SANTIAO)) {
				// lastMaxCardType.push(2);
				for (let a = 0; a < 1; a++) {
					let sanTiao = this.GetSanTiao(curAllCards)[0];
					console.log("获取三条牌型", sanTiao);
					curCardList.push({cardType: this.CARD_TYPE_SANTIAO, cardList: sanTiao});
					//移除该牌型的牌，再继续获取第二组
					this.RemoveArrFormAll(curAllCards, sanTiao);
				}
			}
			if (this.GetLiangDuiEX(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_LIANGDUI) &&
				curCardList.length < 2) {
				// lastMaxCardType.push(1);
				for (let a = 0; a < 1; a++) {
					let liangDui = this.GetLiangDuiEX(curAllCards)[0];
					console.log("获取两对牌型", liangDui);
					curCardList.push({cardType: this.CARD_TYPE_LIANGDUI, cardList: liangDui});
					//移除该牌型的牌，再继续获取第二组
					this.RemoveArrFormAll(curAllCards, liangDui);
				}
			}
			if (this.GetDuiZi(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_DUIZI)) {
				// lastMaxCardType.push(0);
				for (let a = 0; a < 1; a++) {
					let duiZi = this.GetDuiZi(curAllCards)[0];
					console.log("获取对子牌型", duiZi);
					curCardList.push({cardType: this.CARD_TYPE_DUIZI, cardList: duiZi});
					//移除该牌型的牌，再继续获取第二组
					this.RemoveArrFormAll(curAllCards, duiZi);
				}
			}
			//针对牌型，把需要带的牌补齐
			if (curAllCards.length > 0) {
				this.SortCardByMin(curAllCards);
				for (let i = 0; i < curCardList.length; i++) {
					let cardType_1 = curCardList[i].cardType;
					let cardList_1 = curCardList[i].cardList;
					if (cardType_1 == this.CARD_TYPE_WUTONG) {
						//含2或3的五同需要补一张单排
						if (cardList_1.length == 4) {
							if (curAllCards.length > 0) {
								let wutongbupais = this.GetSingleCardFormArr(curAllCards, 1, curCardList[i].cardList);
								curCardList[i].cardList = curCardList[i].cardList.concat(wutongbupais);
								this.RemoveArrFormAll(curAllCards, wutongbupais);
							} else {
								// console.log("炸弹没有牌可以补");
							}
						}
					}
					if (cardType_1 == this.CARD_TYPE_ZHADAN) {//222/333三张为炸弹补两根
						//炸弹需要补一张单排
						if (cardList_1.length == 4) {
							if (curAllCards.length > 0) {
								let zhadanbupais = this.GetSingleCardFormArr(curAllCards, 1, curCardList[i].cardList);
								curCardList[i].cardList = curCardList[i].cardList.concat(zhadanbupais);
								this.RemoveArrFormAll(curAllCards, zhadanbupais);
							} else {
								// console.log("炸弹没有牌可以补");
							}
						}
						//炸弹需要补一张单排
						if (cardList_1.length == 3) {
							if (curAllCards.length > 0) {
								let zhadanbupais = this.GetSingleCardFormArr(curAllCards, 2, curCardList[i].cardList);
								curCardList[i].cardList = curCardList[i].cardList.concat(zhadanbupais);
								this.RemoveArrFormAll(curAllCards, zhadanbupais);
							} else {
								// console.log("炸弹没有牌可以补");
							}
						}
					} else if (cardType_1 == 2 && i != 2) {
						//三条并且不是放在最后一组的需要补两张单牌,需要判断下不能补对子
						if (curAllCards.length >= 2) {
							let bupais = this.GetSingleCardFormArr(curAllCards, 2, curCardList[i].cardList);
							curCardList[i].cardList = curCardList[i].cardList.concat(bupais);
							this.RemoveArrFormAll(curAllCards, bupais);
						} else {
						}
					} else if (cardType_1 == 1) {
						//连对需要补一张单牌
						if (curAllCards.length >= 1) {
							let liangduibupais = this.GetSingleCardFormArr(curAllCards, 1, curCardList[i].cardList);
							curCardList[i].cardList = curCardList[i].cardList.concat(liangduibupais);
							this.RemoveArrFormAll(curAllCards, liangduibupais);
						} else {
							// console.log("连对没有牌可以补");
						}
					} else if (cardType_1 == 0 && i == 2) {
						//对子放在最后一组的需要补一张单牌
						if (curAllCards.length >= 1) {
							let duizibupais = this.GetSingleCardFormArr(curAllCards, 1, curCardList[i].cardList);
							curCardList[i].cardList = curCardList[i].cardList.concat(duizibupais);
							this.RemoveArrFormAll(curAllCards, duizibupais);
						} else {
							// console.log("对子没有牌可以补");
						}
					} else if (cardType_1 == 0 && i != 2) {
						//对子不是放在最后一组的需要补3张单牌
						if (curAllCards.length >= 3) {
							let bupais_3 = this.GetSingleCardFormArr(curAllCards, 3, curCardList[i].cardList);
							curCardList[i].cardList = curCardList[i].cardList.concat(bupais_3);
							this.RemoveArrFormAll(curAllCards, bupais_3);
						} else {
							// console.log("对子没有牌可以补");
						}
					}
				}
				this.SortCardByMax(curAllCards);
				if (curCardList.length == 1) {
					let cards_1 = this.GetSingleCardFormArr(curAllCards, 5, []);
					curCardList.push({cardType: this.CARD_TYPE_WULONG, cardList: cards_1});
					//移除该牌型的牌，再继续获取第二组
					this.RemoveArrFormAll(curAllCards, cards_1);

					let cards_2 = this.GetSingleCardFormArr(curAllCards, 3, []);
					curCardList.push({cardType: this.CARD_TYPE_WULONG, cardList: cards_2});
					//移除该牌型的牌，再继续获取第二组
					this.RemoveArrFormAll(curAllCards, cards_2);
				}
				if (curCardList.length == 2) {
					let cards_3 = this.GetSingleCardFormArr(curAllCards, 3, []);
					curCardList.push({cardType: this.CARD_TYPE_WULONG, cardList: cards_3});
					//移除该牌型的牌，再继续获取第二组
					this.RemoveArrFormAll(curAllCards, cards_3);
				}
			}
			//判断下后两组是否倒水
			if (curCardList.length == 3 && curAllCards.length == 0 &&
				this.CheckCardBigOrSmall(curCardList[1].cardList, curCardList[2].cardList) == 0 &&
				this.CheckCardBigOrSmall(curCardList[0].cardList, curCardList[1].cardList) == 0) {
				allCardType.push(curCardList);
			}
		}
		return allCardType;
	},

	//从数组中移除另一个数组的中所有值
	RemoveArrFormAll: function (targetArr, curArr) {
		for (let i = 0; i < curArr.length; i++) {
			let index = targetArr.indexOf(curArr[i]);
			if (index > -1) {
				targetArr.splice(index, 1);
			}
		}
	},

	//从剩余的牌中抽取指定几张单排来补, 并且牌值不能跟concatArr里的牌一样
	GetSingleCardFormArr: function (cardArr, cardNum, concatArr) {
		let singleCards = [];
		for (let i = 0; i < cardArr.length; i++) {
			let isInSingleCards = this.CheckSameValueInArr(singleCards, cardArr[i]);
			let isInConcatArr = this.CheckSameValueInArr(concatArr, cardArr[i]);
			if (!isInSingleCards && !isInConcatArr) {
				singleCards.push(cardArr[i]);
				if (singleCards.length == cardNum)
					return singleCards;
			}
		}
		return singleCards;
	},

	//检测下是否已经用过该牌型
	CheckUsedCardType: function (curCardList, cardType) {
		if (curCardList.length == 0) {
			//检测最大一组的牌型
			if (this.lastMaxCardType_1.indexOf(cardType) < 0) {
				this.lastMaxCardType_1.push(cardType);
				return true;
			}
		} else if (curCardList.length == 1) {
			//检测第二组的牌型
			if (this.lastMaxCardType_2.indexOf(cardType) < 0) {
				this.lastMaxCardType_2.push(cardType);
				return true;
			}
		} else if (curCardList.length == 2) {
			//检测第三组的牌型
			if (this.lastMaxCardType_3.indexOf(cardType) < 0) {
				this.lastMaxCardType_3.push(cardType);
				return true;
			}
		}
		return false;
	},

	CheckDuiziByGui: function (pokers, guiList, duizis) {
		let aList = [];
		for (let i = 0; i < pokers.length; i++) {
			if (guiList.indexOf(pokers[i]) != -1) {
				continue;
			}
			if (duizis[0]) {
				if (duizis[0].indexOf(pokers[i]) != -1) {
					continue;
				}
			}
			let obj = {};
			let value = this.GetCardValue(pokers[i]);
			obj.value = value;
			obj.valueX16 = pokers[i];
			aList.push(obj);
		}

		aList.sort(function (a, b) {
			return b.value - a.value;
		});

		if (aList.length && guiList.length) {
			let aDui = [];
			aDui.push(aList[0].valueX16);
			aDui.push(guiList[0]);
			duizis[duizis.length] = aDui;
		}
	},

	//return 0 aCards大 1相反 2一样大
	CheckCardBigOrSmall: function (aCards, bCards) {//必须满敦在比  dun1,dun2/ dun2,dun3/ dun1,dun3
		let tempSortAcards = [];
		let tempSortBcards = [];
		for (let i = 0; i < aCards.length; i++) {
			tempSortAcards.push(this.GetCardValue(aCards[i]));
		}
		for (let i = 0; i < bCards.length; i++) {
			tempSortBcards.push(this.GetCardValue(bCards[i]));
		}

		tempSortAcards.sort(this.sortFun);
		tempSortBcards.sort(this.sortFun);

		let aValue = -1;
		let bValue = -1;
		//先找出不带鬼的对子
		let duiziAs = this.GetNotGuiDuiZis(aCards);
		let duiziBs = this.GetNotGuiDuiZis(bCards);
		//先找出鬼牌
		let guiAs = this.GetGuiPai(aCards);
		let guiBs = this.GetGuiPai(bCards);

		////////////////////五鬼
		if (this.IsWuGui(aCards)) {
			if (this.IsWuGui(bCards)) {
				return 1;
			} else {
				return 0;
			}
		} else if (this.GetWuGuis(bCards).length != 0) {
			return 1;
		}
		////////////////////六同
		if (this.GetLiuTongs(aCards).length != 0) {
			if (this.GetLiuTongs(bCards).length != 0) {
				for (let i = 0; i < aCards.length; i++) {
					if (guiAs.indexOf(aCards[i]) != -1) {
						continue;
					}
					aValue = this.GetCardValue(aCards[i]);
					break;
				}
				for (let i = 0; i < bCards.length; i++) {
					if (guiBs.indexOf(bCards[i]) != -1) {
						continue;
					}
					bValue = this.GetCardValue(bCards[i]);
					break;
				}
				if (aValue > bValue) {
					return 0;
				} else if (aValue < bValue) {
					return 1;
				} else {
					if (aValue > bValue) {
						return 0;
					} else if (aValue < bValue) {
						return 1;
					} else {
						if (!guiAs.length && guiBs.length) {
							return 1;
						} else if (guiAs.length && !guiBs.length) {
							return 0;
						} else {
							return 2;
						}
					}
				}
			} else {
				return 0;
			}
		} else if (this.GetLiuTongs(bCards).length != 0) {
			return 1;
		}
		////////////////////五同
		if (this.GetWuTong(aCards).length != 0) {
			if (this.GetWuTong(bCards).length != 0) {
				for (let i = 0; i < aCards.length; i++) {
					if (guiAs.indexOf(aCards[i]) != -1) {
						continue;
					}
					aValue = this.GetCardValue(aCards[i]);
					break;
				}
				for (let i = 0; i < bCards.length; i++) {
					if (guiBs.indexOf(bCards[i]) != -1) {
						continue;
					}
					bValue = this.GetCardValue(bCards[i]);
					break;
				}
				if (aValue > bValue) {
					return 0;
				} else if (aValue < bValue) {
					return 1;
				} else {
					if (aValue > bValue) {
						return 0;
					} else if (aValue < bValue) {
						return 1;
					} else {
						if (!guiAs.length && guiBs.length) {
							return 1;
						} else if (guiAs.length && !guiBs.length) {
							return 0;
						} else {
							return 2;
						}
					}
				}
			} else {
				return 0;
			}
		} else if (this.GetWuTong(bCards).length != 0) {
			return 1;
		}
		////////////////////同花顺
		if (this.IsTongHuaShun(aCards)) {
			if (this.CheckCardType(bCards) > 9) {
				return 1;
			} else if (this.CheckCardType(bCards) == 9) {
				let aList = [];
				let bList = [];

				for (let i = 0; i < aCards.length; i++) {
					if (guiAs.indexOf(aCards[i]) != -1) {
						continue;
					}
					let value = this.GetCardValue(aCards[i]);
					aList.push(value);
				}

				for (let i = 0; i < bCards.length; i++) {
					if (guiBs.indexOf(bCards[i]) != -1) {
						continue;
					}
					let value = this.GetCardValue(bCards[i]);
					bList.push(value);
				}

				aList.sort(this.sortFun);
				bList.sort(this.sortFun);

				tempSortAcards = this.GetCompleteShun(aList);
				tempSortBcards = this.GetCompleteShun(bList);

				aValue = tempSortAcards[tempSortAcards.length - 1];
				bValue = tempSortBcards[tempSortBcards.length - 1];
				if (aValue > bValue) {
					return 0;
				} else if (aValue < bValue) {
					return 1;
				} else {//要判断下A
					if (14 == aValue && 14 == bValue) {
						aValue = tempSortAcards[tempSortAcards.length - 2];
						bValue = tempSortBcards[tempSortBcards.length - 2];
						if (aValue > bValue) {
							return 0;
						} else if (aValue < bValue) {
							return 1;
						} else {
							if (!guiAs.length && guiBs.length) {
								return 0;
							} else if (guiAs.length && !guiBs.length) {
								return 1;
							} else {
								return 2;
							}
						}
					} else {
						if (!guiAs.length && guiBs.length) {
							return 0;
						} else if (guiAs.length && !guiBs.length) {
							return 1;
						} else {
							return 2;
						}
					}
				}
			} else {
				return 0;
			}
		} else if (this.IsTongHuaShun(bCards)) {
			return 1;
		}

		////////////////////炸弹
		if (this.GetZhaDan(aCards).length != 0 && aCards.length == 5) {
			if (this.CheckCardType(bCards) > 8) {
				return 1;
			} else if (this.GetZhaDan(bCards).length != 0) {
				//0鬼加3张王牌或者4张正常牌
				//1张鬼加2张王牌或者3张正常牌
				//2张鬼加1张王牌或者2张正常牌
				//3张鬼加1张正常牌
				let aValue = this.GetValueByZhaDan(aCards);
				let bValue = this.GetValueByZhaDan(bCards);

				if (aValue > bValue) {
					return 0;
				} else if (aValue < bValue) {
					return 1;
				} else {
					if (!guiAs.length && guiBs.length) {
						return 1;
					} else if (guiAs.length && !guiBs.length) {
						return 0;
					} else {
						return 2;
					}
				}
			} else {
				return 0;
			}
		} else if (this.GetZhaDan(bCards).length != 0) {//
			let aCards1 = aCards.slice()
			let bCards1 = bCards.slice()
			if (this.IsChongZha(aCards1) && this.IsChongZha(bCards1)) {//如果中墩有冲炸牌型
				let a = aCards1.length == 3 ? this.IsSanChongZha(aCards1) : this.GetZhaDan(aCards1).length
				let b = bCards1.length == 3 ? this.IsSanChongZha(bCards1) : this.GetZhaDan(bCards1).length
				if (a > b && this.GetCardValue(aCards1[2]) > this.GetCardValue(bCards1[2])) {//头墩是3冲炸的时候中墩三墩不能为222炸弹
					return 0;
				}
			}
			return 1;
		}

		////////////////////葫芦
		if (this.GetHulu(aCards).length != 0) {
			if (this.CheckCardType(bCards) > this.CARD_TYPE_HULU) {
				return 1;
			} else if (this.CheckCardType(bCards) == this.CARD_TYPE_HULU) {
				if (guiAs.length && guiBs.length) {
					let aList = [];
					let bList = [];
					for (let i = 0; i < aCards.length; i++) {
						if (guiAs.indexOf(aCards[i]) != -1) {
							continue;
						}
						let value = this.GetCardValue(aCards[i]);
						aList.push(value);
					}
					for (let i = 0; i < bCards.length; i++) {
						if (guiBs.indexOf(bCards[i]) != -1) {
							continue;
						}
						let value = this.GetCardValue(bCards[i]);
						bList.push(value);
					}

					aList.sort(this.sortCardValue);
					bList.sort(this.sortCardValue);

					aValue = this.GetCardValue(aList[0]);
					bValue = this.GetCardValue(bList[0]);

					if (aValue > bValue) {
						return 0;
					} else if (aValue < bValue) {
						return 1;
					} else {
						return 2;
					}
				} else if (!guiAs.length && guiBs.length) {
					let bList = [];
					let tempASantiao = this.GetSanTiaoEx(aCards, false);
					for (let i = 0; i < bCards.length; i++) {
						if (guiBs.indexOf(bCards[i]) != -1) {
							continue;
						}
						let value = this.GetCardValue(bCards[i]);
						bList.push(value);
					}

					bList.sort(this.sortCardValue);

					aValue = this.GetCardValue(tempASantiao[0][0]);
					bValue = this.GetCardValue(bList[0]);
					if (aValue > bValue) {
						return 0;
					} else if (aValue < bValue) {
						return 1;
					} else {
						return 0;
					}
				} else if (guiAs.length && !guiBs.length) {
					let aList = [];
					let tempBSantiao = this.GetSanTiaoEx(bCards, false);
					for (let i = 0; i < aCards.length; i++) {
						if (guiAs.indexOf(aCards[i]) != -1) {
							continue;
						}
						let value = this.GetCardValue(aCards[i]);
						aList.push(value);
					}

					aList.sort(this.sortCardValue);

					aValue = this.GetCardValue(aList[0]);
					bValue = this.GetCardValue(tempBSantiao[0][0]);

					if (aValue > bValue) {
						return 0;
					} else if (aValue < bValue) {
						return 1;
					} else {
						return 1;
					}
				} else if (!guiAs.length && !guiBs.length) {
					let tempASantiao = this.GetNotGuiSanTiaos(aCards);
					let tempBSantiao = this.GetNotGuiSanTiaos(bCards);
					aValue = this.GetCardValue(tempASantiao[0][0]);
					bValue = this.GetCardValue(tempBSantiao[0][0]);
					if (aValue > bValue) {
						return 0;
					} else if (aValue < bValue) {
						return 1;
					} else {
						return 2;
					}
				}
			} else {
				return 0;
			}
		} else if (this.GetHulu(bCards).length != 0) {
			return 1;
		}
		////////////////////两对同花
		if (this.GetLiangDuiTongHua(aCards).length != 0) {
			if (this.CheckCardType(bCards) > 6) {
				return 1;
			} else if (this.CheckCardType(bCards) == 6) {
				let aList = [];
				let bList = [];

				for (let i = 0; i < aCards.length; i++) {
					if (guiAs.indexOf(aCards[i]) != -1) {
						continue;
					}
					let value = this.GetCardValue(aCards[i]);
					aList.push(value);
				}

				for (let i = 0; i < bCards.length; i++) {
					if (guiBs.indexOf(bCards[i]) != -1) {
						continue;
					}
					let value = this.GetCardValue(bCards[i]);
					bList.push(value);
				}

				aList.sort(this.sortCardValue);
				bList.sort(this.sortCardValue);

				let tempAList = [];
				let tempBList = [];

				for (let i in aList) {
					if (tempAList.indexOf(aList[i]) == -1) {
						tempAList.push(aList[i]);
					}
				}

				for (let i in bList) {
					if (tempBList.indexOf(bList[i]) == -1) {
						tempBList.push(bList[i]);
					}
				}

				aValue = this.GetCardValue(tempAList[0]);
				bValue = this.GetCardValue(tempBList[0]);

				if (aValue > bValue) {
					return 0;
				} else if (aValue < bValue) {
					return 1;
				} else {
					aValue = this.GetCardValue(tempAList[1]);
					bValue = this.GetCardValue(tempAList[1]);

					if (aValue > bValue) {
						return 0;
					} else if (aValue < bValue) {
						return 1;
					} else {
						aValue = this.GetCardValue(tempAList[2]);
						bValue = this.GetCardValue(tempAList[2]);
						if (aValue > bValue) {
							return 0;
						} else if (aValue < bValue) {
							return 1;
						} else {
							if (!guiAs.length && guiBs.length) {
								return 0;
							} else if (guiAs.length && !guiBs.length) {
								return 1;
							} else {
								return 2;
							}
						}
					}
				}
			} else {
				return 0;
			}
		} else if (this.GetLiangDuiTongHua(bCards).length != 0) {
			return 1;
		}

		////////////////////一对同花

		if (this.GetYiDuiTongHua(aCards).length != 0) {
			if (this.CheckCardType(bCards) > 5) {
				return 1;
			} else if (this.CheckCardType(bCards) == 5) {
				let tempA = -1;
				let tempB = -1;
				let duiAList = this.GetDuiZi(aCards);
				let duiBList = this.GetDuiZi(bCards);

				let tempAList = [];
				let tempBList = [];

				if (duiAList.length) {
					tempA = this.GetCardValue(duiAList[0][0]);
				}
				if (duiBList.length) {
					tempB = this.GetCardValue(duiBList[0][0]);
				}

				if (tempA == -1) {
					for (let i = 0; i < aCards.length; i++) {
						if (guiAs.indexOf(aCards[i]) != -1) {
							continue;
						}
						let value = this.GetCardValue(aCards[i]);
						tempAList.push(value);
					}
					tempAList.sort(this.sortCardValue);
					tempA = tempAList[0];
				}

				if (tempB == -1) {
					for (let i = 0; i < bCards.length; i++) {
						if (guiBs.indexOf(bCards[i]) != -1) {
							continue;
						}
						let value = this.GetCardValue(bCards[i]);
						tempBList.push(value);
					}
					tempBList.sort(this.sortCardValue);
					tempB = tempBList[0];
				}

				if (tempA > tempB) {
					return 0;
				} else if (tempA < tempB) {
					return 1;
				} else {
					//AB數組衹有三個元素
					let duiA = [];
					let duiB = [];
					for (let i = 0; i < aCards.length; i++) {
						if (guiAs.indexOf(aCards[i]) != -1) {
							continue;
						}
						let value = this.GetCardValue(aCards[i]);
						if (tempA == value) continue;
						duiA.push(value);
					}
					duiA.sort(this.sortCardValue);
					for (let i = 0; i < bCards.length; i++) {
						if (guiAs.indexOf(bCards[i]) != -1) {
							continue;
						}
						let value = this.GetCardValue(bCards[i]);
						if (tempB == value) {
							continue;
						}
						duiB.push(value);
					}
					duiB.sort(this.sortCardValue);

					for (let i = 0; i < duiA.length; i++) {
						aValue = duiA[i];
						bValue = duiB[i];
						if (aValue > bValue) {
							return 0;
						} else if (aValue < bValue) {
							return 1;
						} else {
							if (i == duiA.length - 1) {
								if (!guiAs.length && guiBs.length) {
									return 0;
								} else if (guiAs.length && !guiBs.length) {
									return 1;
								} else {
									return 2;
								}
							} else {
								continue;
							}
						}
					}
				}
			} else {
				return 0;
			}
		} else if (this.GetYiDuiTongHua(bCards).length != 0)
			return 1;

		////////////////////同花
		if (this.GetTonghuaEx(aCards).length != 0) {
			if (this.CheckCardType(bCards) > 4) {
				return 1;
			} else if (this.CheckCardType(bCards) == 4) {
				aValue = tempSortAcards[tempSortAcards.length - 1];
				bValue = tempSortBcards[tempSortBcards.length - 1];
				if (aValue > bValue) {
					return 0;
				} else if (aValue < bValue) {
					return 1;
				} else {
					let forLength = 0;
					if (tempSortAcards.length == tempSortBcards.length) {
						forLength = tempSortAcards.length;
					} else {
						forLength = tempSortAcards.length > tempSortBcards.length ? tempSortBcards.length : tempSortAcards.length;
					}
					for (let j = forLength; j > 0; j--) {
						aValue = tempSortAcards[j];
						bValue = tempSortBcards[j];
						if (aValue > bValue) {
							return 0;
						} else if (aValue < bValue) {
							return 1;
						} else {
							if (0 == j) {
								return 2;
							}
						}
					}
				}
			} else {
				return 0;
			}
		} else if (this.GetTonghuaEx(bCards).length != 0) {
			return 1;
		}

		////////////////////顺子
		if (this.GetShunziEx(aCards).length != 0) {
			if (this.CheckCardType(bCards) > 3)
				return 1;
			else if (this.CheckCardType(bCards) == 3) {
				let aList = [];
				let bList = [];

				for (let i = 0; i < aCards.length; i++) {
					if (guiAs.indexOf(aCards[i]) != -1) {
						continue;
					}
					let value = this.GetCardValue(aCards[i]);
					aList.push(value);
				}

				for (let i = 0; i < bCards.length; i++) {
					if (guiBs.indexOf(bCards[i]) != -1) {
						continue;
					}
					let value = this.GetCardValue(bCards[i]);
					bList.push(value);
				}

				aList.sort(this.sortFun);
				bList.sort(this.sortFun);

				tempSortAcards = this.GetCompleteShun(aList);
				tempSortBcards = this.GetCompleteShun(bList);

				aValue = tempSortAcards[tempSortAcards.length - 1];
				bValue = tempSortBcards[tempSortBcards.length - 1];
				if (aValue > bValue) {
					return 0;
				} else if (aValue < bValue) {
					return 1;
				} else {//要判断下A
					if (14 == aValue && 14 == bValue) {
						aValue = tempSortAcards[tempSortAcards.length - 2];
						bValue = tempSortBcards[tempSortBcards.length - 2];
						if (aValue > bValue) {
							return 0;
						} else if (aValue < bValue) {
							return 1;
						} else {
							if (!guiAs.length && guiBs.length) {
								return 0;
							} else if (guiAs.length && !guiBs.length) {
								return 1;
							} else {
								return 2;
							}
						}
					} else {
						if (!guiAs.length && guiBs.length) {
							return 0;
						} else if (guiAs.length && !guiBs.length) {
							return 1;
						} else {
							return 2;
						}
					}
				}
			} else {
				return 0;
			}
		} else if (this.GetShunziEx(bCards).length != 0) {
			return 1;
		}

		////////////////////三鬼，双王冲头，冲炸
		if (this.CheckTouDunByGui(aCards) > this.CARD_TYPE_SANTIAO) {//比三条大
			if (this.CheckCardType(bCards) >= this.CARD_TYPE_SHUNZI) {//大于等于顺子
				return 1;
			} else {
				return 0
			}
		}
		////////////////////三条
		if (this.GetSanTiaoEx(aCards).length != 0) {
			if (this.CheckCardType(bCards) > 2) {
				return 1;
			} else if (this.CheckCardType(bCards) == 2) {
				if (guiAs.length && guiBs.length) {
					let tempADuizi = this.GetDuiZi(aCards, false);
					let tempBDuizi = this.GetDuiZi(bCards, false);
					aValue = this.GetCardValue(tempADuizi[0][0]);
					bValue = this.GetCardValue(tempBDuizi[0][0]);
					if (aValue > bValue) {
						return 0;
					} else if (aValue < bValue) {
						return 1;
					} else {
						return 2;
					}
				} else if (!guiAs.length && guiBs.length) {
					let santiaoA = this.GetSanTiaoEx(aCards, false);
					aValue = this.GetCardValue(santiaoA[0]);

					if (guiBs.length == 1) {
						let duiizs = this.GetDuiZi(bCards, false);
						bValue = this.GetCardValue(duiizs[0][0]);
					} else if (guiBs.length == 2) {
						let bList = [];
						for (let i = 0; i < bCards.length; i++) {
							if (guiBs.indexOf(bCards[i]) != -1) {
								continue;
							}
							bList.push(bCards[i]);
						}
						bList.sort(this.sortCardValue);
						bValue = this.GetCardValue(bList[0]);
					}

					if (aValue > bValue) {
						return 0;
					} else if (aValue < bValue) {
						return 1;
					} else {
						return 0;
					}
				} else if (guiAs.length && !guiBs.length) {
					let santiaoB = this.GetSanTiaoEx(bCards, false);
					bValue = this.GetCardValue(santiaoB[0]);

					if (guiAs.length == 1) {
						let duiizs = this.GetDuiZi(aCards);
						aValue = this.GetCardValue(duiizs[0][0]);
					} else if (guiAs.length == 2) {
						let aList = [];
						for (let i = 0; i < aCards.length; i++) {
							if (guiAs.indexOf(aCards[i]) != -1) {
								continue;
							}
							aList.push(aCards[i]);
						}
						aList.sort(this.sortCardValue);
						aValue = this.GetCardValue(aList[0]);
					}

					if (aValue > bValue) {
						return 0;
					} else if (aValue < bValue) {
						return 1;
					} else {
						return 1;
					}
				} else if (!guiAs.length && !guiBs.length) {
					let santiaoA = this.GetSanTiaoEx(aCards, false);
					let santiaoB = this.GetSanTiaoEx(bCards, false);
					aValue = this.GetCardValue(santiaoA[0]);
					bValue = this.GetCardValue(santiaoB[0]);
					if (aCards.length < 3 && bCards.length == 5) {
						return 1;
					} else if (aValue > bValue) {
						return 0;
					} else {
						return 2;
					}
				}
			} else {
				return 0;
			}
		} else if (this.GetSanTiaoEx(bCards).length != 0) {
			return 1;
		}

		//根据鬼牌挑选最大的对子
		if (guiAs.length && !duiziAs.length) {//
			this.CheckDuiziByGui(aCards, guiAs, duiziAs);
		} else if (guiAs.length && duiziAs.length == 1) {
			this.CheckDuiziByGui(aCards, guiAs, duiziAs);
		}

		if (guiBs.length && !duiziBs.length) {
			this.CheckDuiziByGui(bCards, guiBs, duiziBs);
		} else if (guiBs.length && duiziBs.length == 1) {
			this.CheckDuiziByGui(bCards, guiBs, duiziBs);
		}

		////////////////////两对
		if (duiziAs.length == 2) {
			if (this.CheckCardType(bCards) > 1) {
				return 1;
			} else if (duiziBs.length == 2) {
				let tempSortDuiZiA = [];
				let tempSortDuiZiB = [];
				tempSortDuiZiA[0] = this.GetCardValue(duiziAs[0][0]);
				tempSortDuiZiA[1] = this.GetCardValue(duiziAs[1][0]);
				tempSortDuiZiB[0] = this.GetCardValue(duiziBs[0][0]);
				tempSortDuiZiB[1] = this.GetCardValue(duiziBs[1][0]);
				tempSortDuiZiA.sort(this.sortFun);
				tempSortDuiZiB.sort(this.sortFun);
				aValue = tempSortDuiZiA[0];
				bValue = tempSortDuiZiB[0];
				let aValueEx = tempSortDuiZiA[1];
				let bValueEx = tempSortDuiZiB[1];
				if (aValue == bValue && aValueEx == bValueEx) {//相同的两对
					let remainCardA = -1;
					let remainCardB = -1;
					for (let i = 0; i < 5; i++) {
						if (this.GetCardValue(aCards[i]) != tempSortDuiZiA[0] &&
							this.GetCardValue(aCards[i]) != tempSortDuiZiA[1])
							remainCardA = this.GetCardValue(aCards[i]);
						if (this.GetCardValue(bCards[i]) != tempSortDuiZiB[0] &&
							this.GetCardValue(bCards[i]) != tempSortDuiZiB[1])
							remainCardB = this.GetCardValue(bCards[i]);
					}
					if (remainCardA > remainCardB) {
						return 0;
					} else {
						return 1;
					}
				}
				if (aValueEx > bValueEx) {//取最大
					return 0;
				} else if (aValueEx == bValueEx) {
					if (aValue > bValue) {
						return 0;
					} else {
						return 1;
					}
				} else {
					return 1;
				}
			} else {
				return 0;
			}
		} else if (duiziBs.length == 2) {
			return 1;
		}

		////////////////////一对
		if (duiziAs.length == 1) {
			if (this.CheckCardType(bCards) > 0) {
				return 1;
			} else if (duiziBs.length == 1) {
				let tempA = -1;
				let tempB = -1;
				let duiAList = this.GetDuiZi(aCards);
				let duiBList = this.GetDuiZi(bCards);

				let tempAList = [];
				let tempBList = [];

				if (duiAList.length) {
					tempA = this.GetCardValue(duiAList[0][0]);
				}
				if (duiBList.length) {
					tempB = this.GetCardValue(duiBList[0][0]);
				}

				if (tempA == -1) {
					for (let i = 0; i < aCards.length; i++) {
						if (guiAs.indexOf(aCards[i]) != -1) {
							continue;
						}
						let value = this.GetCardValue(aCards[i]);
						tempAList.push(value);
					}
					tempAList.sort(this.sortCardValue);
					tempA = tempAList[0];
				}

				if (tempB == -1) {
					for (let i = 0; i < bCards.length; i++) {
						if (guiBs.indexOf(bCards[i]) != -1) {
							continue;
						}
						let value = this.GetCardValue(bCards[i]);
						tempBList.push(value);
					}
					tempBList.sort(this.sortCardValue);
					tempB = tempBList[0];
				}

				if (tempA > tempB) {
					return 0;
				} else if (tempA < tempB) {
					return 1;
				} else {
					//AB數組衹有三個元素或者一個元素
					let duiA = [];
					let duiB = [];
					for (let i = 0; i < aCards.length; i++) {
						if (guiAs.indexOf(aCards[i]) != -1) {
							continue;
						}
						let value = this.GetCardValue(aCards[i]);
						if (tempA == value) {
							continue;
						}
						duiA.push(value);
					}
					duiA.sort(this.sortCardValue);
					for (let i = 0; i < bCards.length; i++) {
						if (guiAs.indexOf(bCards[i]) != -1) {
							continue;
						}
						let value = this.GetCardValue(bCards[i]);
						if (tempB == value) {
							continue;
						}
						duiB.push(value);
					}
					duiB.sort(this.sortCardValue);

					if (duiA.length == 1) {
						aValue = duiA[0];
						bValue = duiB[0];
						if (aValue > bValue) {
							return 0;
						} else if (aValue < bValue) {
							return 1;
						} else {
							if (!guiAs.length && guiBs.length) {
								return 0;
							} else if (guiAs.length && !guiBs.length) {
								return 1;
							} else {
								return 2;
							}
						}
					} else {
						for (let i = 0; i < duiA.length; i++) {
							aValue = duiA[i];
							bValue = duiB[i];
							if (aValue > bValue) {
								return 0;
							} else if (aValue < bValue) {
								return 1;
							} else {
								if (i == duiA.length - 1) {
									if (!guiAs.length && guiBs.length) {
										return 0;
									} else if (guiAs.length && !guiBs.length) {
										return 1;
									} else {
										return 2;
									}
								} else {
									continue;
								}
							}
						}
					}
				}
			} else
				return 0;
		} else if (duiziBs.length == 1) {
			return 1;
		}

		////////////////////垃圾牌
		if (this.CheckCardType(bCards) >= 0) {
			// console.log("垃圾牌 ：副牌大");
			return 1;
		} else {
			// console.log("同样垃圾牌");
			aValue = tempSortAcards[tempSortAcards.length - 1];
			bValue = tempSortBcards[tempSortBcards.length - 1];
			if (aValue > bValue) {
				return 0;
			} else if (aValue < bValue) {
				return 1;
			} else {
				//可能有3张和5张的比
				let lastIndexA = tempSortAcards.length - 1;
				let lastIndexB = tempSortBcards.length - 1;
				for (let j = 5; j > 0; j--) {
					if (lastIndexA < 0 || lastIndexB < 0) {//如果3张或5张比下来都没结果就是相同大
						return 2;
					}
					aValue = tempSortAcards[lastIndexA];
					bValue = tempSortBcards[lastIndexB];
					if (aValue > bValue) {
						return 0;
					} else if (aValue < bValue) {
						return 1;
					} else {
						if (0 == j) {
							return 2;
						}
					}
					lastIndexA--;
					lastIndexB--;
				}
			}
		}
	},
	GetValueByZhaDan: function (cards) {
		let value = -1;
		let guiPai = this.GetGuiPai(cards);
		let wangPai = [];
		let wp = []
		let duiPai = [];
		cards = cards.slice()
		let clearList = this.guiClearCardDict[this.wangPaiNum];
		cards.sort(this.sortCardValue);
		for (let i = 0; i < cards.length; i++) {
			let poker = cards[i];
			let cardValue = this.GetCardValue(poker);
			let cardColor = this.GetCardColor(poker);
			if (clearList.indexOf(cardValue) > -1) {
				if(!wp[cardValue]) wp[cardValue] = []
				wp[cardValue].push(poker)
			} else {
				let duizis = [];
				let duizi = this.GetSameValue(cards, poker);
				let bInList = this.CheckPokerInList(duizis, poker);
				if (duizi.length >= 2 && !bInList) {
					duiPai = [].concat(duizi);
				}
			}
		}
		if (wp.length > 0) {
			wp.sort((a, b)=>{
				return b.length - a.length
			})
			wangPai = wp[0]
		}
		console.log("获取的牌数组", guiPai, wangPai, duiPai);
		if (guiPai.length + wangPai.length == 3) {
			value = this.GetCardValue(wangPai[0]);
		} else if (guiPai.length + duiPai.length == 4) {
			value = this.GetCardValue(duiPai[0]);
		} else {
			console.error("没能找出最大的炸弹", cards);
		}

		return value;
	},
	sortCardValue: function (a, b) {
		return b - a;
	},
	SortBySize: function (pokers) {
		if (this.sortSize == 0) {
			this.sortSize = 1;
			pokers.sort((a, b) => {
				return this.GetCardValue(a) - this.GetCardValue(b);
			});
		} else if (this.sortSize == 1) {
			this.sortSize = 0;
			pokers.sort((a, b) => {
				return this.GetCardValue(b) - this.GetCardValue(a);
			});
		}
	},
	SortByColor: function (pokers) {
		let GuiPai = [];
		let NewPai = [];
		let _t = this;
		for (let i = 0; i < pokers.length; i++) {
			let cardColor = this.GetCardColor(pokers[i]);
			if (cardColor == 64) {
				GuiPai.push(pokers[i]);
			} else {
				NewPai.push(pokers[i]);

			}
		}
		//先添加鬼牌在最左边start
		GuiPai.sort(function (a, b) {
			return (b & 0x0F) - (a & 0x0F);
		});
		let Sortpokers = [];
		for (let i = 0; i < GuiPai.length; i++) {
			Sortpokers.push(GuiPai[i]);
		}
		if (this.sortColor == 0) {
			this.sortColor = 1;
			NewPai.sort(function (a, b) {
				let aColor = _t.GetCardColor(a);
				let bColor = _t.GetCardColor(b);
				return aColor - bColor;
			});
			for (let i = 0; i < NewPai.length; i++) {
				Sortpokers.push(NewPai[i]);
			}
			return Sortpokers;
		}
		if (this.sortColor == 1) {
			this.sortColor = 0;
			NewPai.sort(function (a, b) {
				let aColor = _t.GetCardColor(a);
				let bColor = _t.GetCardColor(b);
				return bColor - aColor;
			});
			for (let i = 0; i < NewPai.length; i++) {
				Sortpokers.push(NewPai[i]);
			}
			return Sortpokers;
		}
	},

	GetCompleteShun: function (list) {
		let OverFive = false;
		for (let i = 0; i < list.length; i++) {
			if (list[i] == 14) {
				continue;
			}
			if (list[i] > 5) {
				OverFive = true;
			}
		}

		if (OverFive) {
			for (let i = 0; i < list.length - 1; i++) {
				let len = list[i + 1] - list[i];
				for (let j = 1; j < len; j++) {
					list.push(list[i] + j);
				}
			}

			list.sort(this.sortFun);//从小到大排序
			let value = list[list.length - 1];
			let addValue = 1;
			let len = list.length;

			for (let i = 1; i <= 5 - len; i++) {
				if (value == 14) {
					value = list[0];
					addValue = -1;
				}
				value = value + addValue;
				list.push(value);
			}
			list.sort(this.sortFun);//从小到大排序从小到大排序
		} else {
			list = [2, 3, 4, 5, 14];
		}
		return list;
	},

	GetGuiPai: function (pokers) {
		let guipai = [];
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			let color = this.GetCardColor(poker);
			if (color == 64) {
				guipai.push(poker);
			}
		}
		return guipai;
	},
	GetErPais: function (pokers, pnum) {
		let erList = [];
		let guipai = this.GetGuiPai(pokers);
		let clearList = this.guiClearCardDict[this.wangPaiNum];
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			if ((this.wangPaiNum == 2 || this.sign == 2)) {
				if (pnum == 2) {
					let duizi = this.GetSameValue(pokers, poker);
					let bInList = this.CheckPokerInList(erList, poker);

					let sanValue = this.GetCardValue(duizi[0]);
					if (sanValue == 2 && duizi.length >= 2 && !bInList) {
						this.PokerCombination(2, duizi, erList);
					}
				} else if (pnum == 3) {
					let santiao = this.GetSameValue(pokers, poker);
					let bInList = this.CheckPokerInList(erList, poker);

					let sanValue = this.GetCardValue(santiao[0]);
					if (sanValue == 2 && santiao.length >= 3 && !bInList) {
						this.PokerCombination(3, santiao, erList);
					}
				}
			} else if (this.wangPaiNum > 2) {
				if (pnum == 2) {
					let duizi = this.GetSameValue(pokers, poker);
					let bInList = this.CheckPokerInList(erList, poker);

					let sanValue = this.GetCardValue(duizi[0]);
					if (clearList.indexOf(sanValue) > -1) {
						if (duizi.length >= 2 && !bInList) {
							this.PokerCombination(2, duizi, erList);
						}
					}
				} else if (pnum == 3) {
					let santiao = this.GetSameValue(pokers, poker);
					let bInList = this.CheckPokerInList(erList, poker);

					let sanValue = this.GetCardValue(santiao[0]);
					if (clearList.indexOf(sanValue) > -1) {
						if (santiao.length >= 3 && !bInList) {
							this.PokerCombination(3, santiao, erList);
						}
					}
				}
			}
		}
		return erList;
	},
	GetSanPais: function (pokers, pnum) {
		let sanList = [];
		let guipai = this.GetGuiPai(pokers);
		let clearList = this.guiClearCardDict[this.wangPaiNum];
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			if ((this.wangPaiNum == 2 || this.sign == 2)) {
				if (pnum == 2) {
					let duizi = this.GetSameValue(pokers, poker);
					let bInList = this.CheckPokerInList(sanList, poker);

					let sanValue = this.GetCardValue(duizi[0]);
					if (sanValue == 3 && duizi.length >= 2 && !bInList) {
						this.PokerCombination(2, duizi, sanList);
					}
				} else if (pnum == 3) {
					let santiao = this.GetSameValue(pokers, poker);
					let bInList = this.CheckPokerInList(sanList, poker);

					let sanValue = this.GetCardValue(santiao[0]);
					if (sanValue == 3 && santiao.length >= 3 && !bInList) {
						this.PokerCombination(3, santiao, sanList);
					}
				}
			} else if (this.wangPaiNum > 2) {
				if (pnum == 2) {
					let duizi = this.GetSameValue(pokers, poker);
					let bInList = this.CheckPokerInList(sanList, poker);

					let sanValue = this.GetCardValue(duizi[0]);
					if (clearList.indexOf(sanValue) > -1) {
						if (duizi.length >= 2 && !bInList) {
							this.PokerCombination(2, duizi, sanList);
						}
					}
				} else if (pnum == 3) {
					let santiao = this.GetSameValue(pokers, poker);
					let bInList = this.CheckPokerInList(sanList, poker);

					let sanValue = this.GetCardValue(santiao[0]);
					if (clearList.indexOf(sanValue) > -1) {
						if (santiao.length >= 3 && !bInList) {
							this.PokerCombination(3, santiao, sanList);
						}
					}
				}
			}
		}
		return sanList;
	},
	GetClearPais: function (pokers, pnum) {
		let sanList = [];
		let guipai = this.GetGuiPai(pokers);
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}

			if (pnum == 4) {
				let zhadan = this.GetSameValue(pokers, poker);
				let bInList = this.CheckPokerInList(sanList, poker);

				let sanValue = this.GetCardValue(zhadan[0]);
				if ((this.wangPaiNum == 2 || this.sign == 2)) {
					if (sanValue == 3 && zhadan.length >= 4 && !bInList) {
						this.PokerCombination(4, zhadan, sanList);
					}
				} else if (this.wangPaiNum > 2) {
					let clearList = this.guiClearCardDict[this.wangPaiNum];
					if (clearList.indexOf(sanValue) > -1) {
						if (zhadan.length >= 4 && !bInList) {
							this.PokerCombination(4, zhadan, sanList);
						}
					}
				}
			}
		}
		return sanList;
	},
	//获取没有鬼牌没有2和3的单张 (五同使用)
	GetNotGuiOneCards: function (pokers) {
		let OneCards = [];
		let guipai = this.GetGuiPai(pokers);
		let clearList = this.guiClearCardDict[this.wangPaiNum];
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			if ((this.wangPaiNum == 2 || this.sign == 2) && guipai.length > 0) {//特殊王牌场不止2跟三
				let cardValue = this.GetCardValue(poker);
				if (cardValue == 2 || cardValue == 3) {
					continue;
				}
			} else if (this.wangPaiNum > 2) {
				let cardValue = this.GetCardValue(poker);
				if (clearList.indexOf(cardValue) > -1) {
					continue;
				}
			}

			let oneCard = this.GetSameValue(pokers, poker);
			let bInList = this.CheckPokerInList(OneCards, poker);
			if (oneCard.length >= 1 && !bInList) {
				OneCards.push(oneCard);
			}
		}
		return OneCards;
	},
	//获取没有鬼牌的对子
	GetNotGuiDuiZis: function (pokers) {
		let duizis = [];
		let guipai = this.GetGuiPai(pokers);
		let clearList = this.guiClearCardDict[this.wangPaiNum];
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}

			if (guipai.length > 0) {
				let cardValue = this.GetCardValue(poker);
				if (clearList.indexOf(cardValue) > -1) {
					continue;
				}
			}
			let duizi = this.GetSameValue(pokers, poker);
			let bInList = this.CheckPokerInList(duizis, poker);
			if (duizi.length >= 2 && !bInList) {
				this.PokerCombination(2, duizi, duizis);
			}
		}
		return duizis;
	},
	//获取没有鬼牌的三条
	GetNotGuiSanTiaos: function (pokers) {
		let guipai = this.GetGuiPai(pokers);
		let santiaos = [];
		let clearList = this.guiClearCardDict[this.wangPaiNum];
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			let cardValue = this.GetCardValue(poker);
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			if (clearList.indexOf(cardValue) > -1) {
				continue;
			}
			let santiao = this.GetSameValue(pokers, poker);
			let bInList = this.CheckPokerInList(santiaos, poker);

			if (santiao.length >= 3 && !bInList) {
				this.PokerCombination(3, santiao, santiaos);
			}
		}
		return santiaos;
	},
	//获取没有鬼牌的四张相同的牌
	GetNotGuiSiZhangs: function (pokers) {
		let guipai = this.GetGuiPai(pokers);
		let siZhangs = [];
		let clearList = this.guiClearCardDict[this.wangPaiNum];
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			// if (this.sign >= 2) {
			if ((this.wangPaiNum == 2 || this.sign == 2) && guipai.length > 0) {//特殊王牌场不止2跟三
				let cardValue = this.GetCardValue(poker);
				if (cardValue == 2 || cardValue == 3) {
					continue;
				}
			} else if (this.wangPaiNum > 2) {
				let cardValue = this.GetCardValue(poker);
				if (clearList.indexOf(cardValue) > -1) {
					continue;
				}
			}
			let siZhang = this.GetSameValue(pokers, poker);
			let bInList = this.CheckPokerInList(siZhangs, poker);
			if (siZhang.length == 4 && !bInList) {
				this.PokerCombination(4, siZhang, siZhangs);
			}
		}
		return siZhangs;
	},
	//服务端发过来 三同花 (三墩都是同花) 三顺子 六对半 一条龙 清龙 四套三条 三分天下 三同花顺 六同 七同 八同
	SanTongHua: function (pokers) {
		let gui = this.GetGuiPai(pokers);
		let tonghuas = [];
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			if (gui.indexOf(poker) != -1) {
				continue;
			}
			let tonghua = this.GetSameColor(pokers, poker);
			let bInList = this.CheckPokerInList(tonghuas, poker);
			if (tonghua.length >= 5 && !bInList) {
				tonghuas[tonghuas.length] = tonghua;
			} else if (tonghua.length < 5 && !bInList) {
				tonghuas[tonghuas.length] = tonghua;
			}
		}
		tonghuas.sort(function (a, b) {
			return a.length - b.length;
		});
		let JoinGuiPia = function (tonghua, gui, len) {
			if (tonghua.length == len) {
				return;
			}
			for (let i = 0; i < gui.length; i++) {
				if (gui[i] == 'undefined') {
					continue;
				}
				tonghua.push(gui[i]);
				gui[i] = 'undefined';
				if (tonghua.length == len) {
					break;
				}
			}
		};
		if (gui.length) {
			JoinGuiPia(tonghuas[0], gui, 3);
			JoinGuiPia(tonghuas[1], gui, 5);
			JoinGuiPia(tonghuas[2], gui, 5);
		}
		return tonghuas;
	},

	PokerCombination: function (index, list, lists) {
		let rs = [];
		if (index == 2) {
			for (let j = 0; j < list.length; j++) {
				for (let k = j; k < list.length; k++) {
					let map = {};
					map.key = list[j];
					if (k != j) {
						map.value = list[k];
						rs.push(map);
					}
				}
			}
		} else if (index == 3) {
			for (let j = 0; j < list.length; j++) {
				for (let k = j; k < list.length; k++) {
					let map = {};
					map.key = list[j];
					if (k != j && list[k + 1]) {
						map.value = list[k];
						map.x = list[k + 1];
						rs.push(map);
					}
				}
			}
		} else if (index == 4) {
			for (let j = 0; j < list.length; j++) {
				for (let k = j; k < list.length; k++) {
					let map = {};
					map.key = list[j];
					if (k != j && list[k + 2]) {
						map.value = list[k];
						map.x = list[k + 1];
						map.x1 = list[k + 2];
						rs.push(map);
					}
				}
			}
		} else if (index == 5) {
			for (let j = 0; j < list.length; j++) {
				for (let k = j; k < list.length; k++) {
					let map = {};
					map.key = list[j];
					if (k != j && list[k + 3]) {
						map.value = list[k];
						map.x = list[k + 1];
						map.x1 = list[k + 2];
						map.x2 = list[k + 3];
						rs.push(map);
					}
				}
			}
		}

		//将组合好的牌型放入lists
		for (let idx = 0; idx < rs.length; idx++) {
			let data = rs[idx];
			let temp = [];
			for (let i in data) {
				temp.push(data[i]);
			}
			lists[lists.length] = temp;
		}
	},
	IsShowDuiZiBtn: function (pokers) {
		let isShowBtn = false;
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			let duizis = [];
			let duizi = this.GetSameValue(pokers, poker);
			let bInList = this.CheckPokerInList(duizis, poker);
			if (duizi.length >= 2 && !bInList) {
				isShowBtn = true;
				break;
			}
		}
		return isShowBtn;
	},

	//获取对子 两张相同数字的牌 单纯的对子，不能有鬼牌，给两对按钮使用
	GetAllDuiZi: function (pokers) {
		let guipai = this.GetGuiPai(pokers);
		let duizis = [];

		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			let duizi = this.GetSameValue(pokers, poker);
			let bInList = this.CheckPokerInList(duizis, poker);
			if (duizi.length >= 2 && !bInList) {
				this.PokerCombination(2, duizi, duizis);
			}
		}
		return duizis;
	},
	//获取三条 三张相同数字的牌 单纯的三条，不能有鬼牌，给显示三条按钮使用
	GetAllSantiao: function (pokers) {
		let santiaos = [];
		let guipai = this.GetGuiPai(pokers);
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			let santiao = this.GetSameValue(pokers, poker);
			let bInList = this.CheckPokerInList(santiaos, poker);
			if (santiao.length >= 3 && !bInList) {
				this.PokerCombination(3, santiao, santiaos);
			}
		}
		return santiaos;
	},
	//获取对子 两张相同数字的牌
	GetDuiZi: function (pokers) {
		let guipai = this.GetGuiPai(pokers);
		let duizis = [];
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			if (guipai.indexOf(poker) > -1) {
				continue;
			}
			let duizi = this.GetSameValue(pokers, poker);
			let bInList = this.CheckPokerInList(duizis, poker);
			if (duizi.length >= 2 && !bInList) {
				this.PokerCombination(2, duizi, duizis);
			}
			for (let j = 0; j < guipai.length; j++) {
				let gui = guipai[j];
				let dui = [];
				dui.push(poker);
				dui.push(gui);
				this.PokerCombination(2, dui, duizis);
			}
		}
		return duizis;
	},
	//判断是否有两对
	GetLiangDui: function (pokers) {
		if (this.sign < 2) {
			let noGuiDuiZis = this.GetDuiZi(pokers);
			if (noGuiDuiZis.length >= 2) {//没有鬼牌的时候
				return pokers;
			}
		} else {
			//玩法中带鬼牌
			let allDuiZis = this.GetAllDuiZi(pokers);
			if (allDuiZis.length >= 2) {//没有鬼牌的时候
				return pokers;
			}
		}
		return [];
	},
	//两对 五张牌由两组两张数字相同的牌组成
	GetLiangDuiEX: function (pokers) {//如果有鬼组不成两对
		let liangduis = [];
		let noGuiDuiZis = this.GetAllDuiZi(pokers);
		if (noGuiDuiZis.length >= 2) {//没有鬼牌的时候
			for (let i = 0; i < noGuiDuiZis.length; i++) {
				let firstDui = noGuiDuiZis[i];
				let secondDui = [];
				for (let j = 1; j < noGuiDuiZis.length; j++) {
					secondDui = noGuiDuiZis[j];
					let bRet = this.CheckSameValue(firstDui, secondDui);
					if (!bRet) {
						let liangdui = firstDui.concat(secondDui);
						liangduis.push(liangdui);
					}
				}
			}
		}
		return liangduis;
	},
	IsShowSanTiaoBtn: function (pokers) {
		let isShowBtn = false;
		let guipai = this.GetGuiPai(pokers);
		let santiaos = [];
		let clearList = this.guiClearCardDict[this.wangPaiNum];
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			let cardValue = this.GetCardValue(poker);
			if (clearList.indexOf(cardValue) > -1) {
				continue;
			}
			let duizi = this.GetSameValue(pokers, poker);
			let bInList = this.CheckPokerInList(santiaos, poker);
			if (duizi.length + guipai.length >= 3 && !bInList) {
				isShowBtn = true;
				break;
			}
		}
		return isShowBtn;
	},
	// 三条 三张相同的牌
	GetSanTiao: function (pokers) {
		let guipai = this.GetGuiPai(pokers);
		let santiaos = this.GetNotGuiSanTiaos(pokers);
		//对子加1张鬼组成三条
		let duizis = this.GetNotGuiDuiZis(pokers);
		for (let i = 0; i < duizis.length; i++) {
			for (let j = 0; j < guipai.length; j++) {
				let duizi = this.copyArr(duizis[i]);
				let gui = guipai[j];
				if (duizi.indexOf(gui) != -1) {
					continue;
				} else {
					duizi.push(gui);
					santiaos[santiaos.length] = duizi;
				}
			}
		}
		//鬼对子加1张牌组成三条
		if (guipai.length >= 2) {
			let liangZhangGuis = [];
			this.PokerCombination(2, guipai, liangZhangGuis);
			let oneGuiCards = this.GetNotGuiOneCards(pokers);
			for (let i = 0; i < liangZhangGuis.length; i++) {
				for (let j = 0; j < oneGuiCards.length; j++) {
					let gDuiZi = this.copyArr(liangZhangGuis[i]);
					let gui = oneGuiCards[j][0];
					if (gDuiZi.indexOf(gui) != -1) {
						continue;
					} else {
						gDuiZi.push(gui);
						santiaos[santiaos.length] = gDuiZi;
					}
				}
			}
		}
		return santiaos;
	},

	GetSanTiaoEx: function (pokers, needCheckHuLu = true) {
		let santiaos = this.GetSanTiao(pokers);
		if (pokers.length == 3 && santiaos.length > 0) {
			let guipai = this.GetGuiPai(pokers);
			//判断为三鬼
			if (guipai.length == 3) {
				// return
			}
			//判断为冲炸

			//判断为双王冲头

		}
		if (santiaos.length > 0) {
			if (!needCheckHuLu) {
				return santiaos;
			}
			//判断下是不是葫芦，不能直接调用gethulu因为里面调用了这个函数会死循环
			let remianList = [];
			for (let i = 0; i < pokers.length; i++) {
				if (santiaos.indexOf(pokers[i]) != -1) {
					continue;
				}
				remianList.push(pokers[i]);
			}
			if (remianList.length == 2) {
				let duizi = this.GetSameValue(remianList, remianList[0]);
				if (duizi.length == 2) {
					return [];//是葫芦
				} else {
					return santiaos;//三条
				}
			} else {
				return santiaos;//三条
			}
		} else {
			return [];
		}
	},
	//获取三鬼
	GetSanGui: function (pokers) {
		let sanZhangGuis = [];
		let guipai = this.GetGuiPai(pokers);
		if (guipai >= 3) {
			this.PokerCombination(3, guipai, sanZhangGuis);
		}
		return sanZhangGuis;
	},
	//获取双王冲头
	GetShuangWangChongTou: function (pokers) {
		let shuangwangs = [];
		if (this.sign == 3 || this.sign == 1) {
			let guipai = this.GetGuiPai(pokers);
			if (guipai.length >= 2) {
				let liangZhangGuis = [];
				this.PokerCombination(2, guipai, liangZhangGuis);
				for (let i = 0; i < liangZhangGuis.length; i++) {
					for (let j = 0; j < pokers.length; j++) {
						let temp = this.copyArr(liangZhangGuis[i]);
						let poker = pokers[j];
						if (temp.indexOf(poker) != -1) {
							continue;
						}
						temp.push(poker);
						shuangwangs.push(temp);
					}
				}
			}
		}
		return shuangwangs;
	},
	//获取冲炸
	GetChongZha: function (pokers) {
		let chongzhas = [];
		let guipai = this.GetGuiPai(pokers);
		let clearList = this.guiClearCardDict[this.wangPaiNum];
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			let santiao = this.GetSameValue(pokers, poker);
			let bInList = this.CheckPokerInList(chongzhas, poker);
			let sanValue = this.GetCardValue(santiao[0]);
			if (clearList.indexOf(sanValue) > -1) {
				if (santiao.length >= 3 && !bInList) {
					this.PokerCombination(3, santiao, chongzhas);
				}
			}
		}
		return chongzhas;
	},
	// 顺子 五张连续的不同花色牌
	GetShunzi: function (pokers, isTongHuaShun = false) {//判断所有牌
		if (pokers.length < 5) {
			return [];
		}
		let clearList = this.guiClearCardDict[this.wangPaiNum];
		this.SortCardByMax(pokers);
		let guipai = this.GetGuiPai(pokers);
		let shunzis = [];
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			let shunzi = [];
			shunzi.push(poker);
			for (let j = i + 1; j < pokers.length; j++) {
				if (guipai.indexOf(pokers[j]) != -1) {
					continue;
				}
				shunzi = [];
				shunzi.push(pokers[i]);
				let ret = this.isSave(shunzi, pokers[j]);
				if (ret) {
					shunzi.push(pokers[j]);
					if (this.GetCardValue(shunzi[0]) == 14 && this.GetCardValue(shunzi[1]) <= 5) {
						if ((this.GetCardValue(shunzi[0]) - this.GetCardValue(pokers[j]) <= 4)) {
							let isSameColor = this.isSameColor([shunzi], [pokers[j]]);
							if (isSameColor) {//可能是同花顺，比铁支大
								shunzis.push(shunzi);
							}
						}
					}
				} else {
					continue;
				}
				for (let k = j + 1; k < pokers.length; k++) {
					if (guipai.indexOf(pokers[k]) != -1) {
						continue;
					}
					shunzi = [];
					shunzi.push(pokers[i]);
					shunzi.push(pokers[j]);
					let ret = this.isSave(shunzi, pokers[k]);
					if (ret) {
						shunzi.push(pokers[k]);
						shunzis.push(shunzi);
					} else {
						continue;
					}
					for (let x = k + 1; x < pokers.length; x++) {
						if (guipai.indexOf(pokers[x]) != -1) {
							continue;
						}
						shunzi = [];
						shunzi.push(pokers[i]);
						shunzi.push(pokers[j]);
						shunzi.push(pokers[k]);
						let ret = this.isSave(shunzi, pokers[x]);
						if (ret) {
							shunzi.push(pokers[x]);
							shunzis.push(shunzi);
						} else {
							continue;
						}
						for (let t = x + 1; t < pokers.length; t++) {
							if (guipai.indexOf(pokers[t]) != -1) {
								continue;
							}
							shunzi = [];
							shunzi.push(pokers[i]);
							shunzi.push(pokers[j]);
							shunzi.push(pokers[k]);
							shunzi.push(pokers[x]);
							let ret = this.isSave(shunzi, pokers[t]);
							if (ret) {
								shunzi.push(pokers[t]);
								shunzis.push(shunzi);
							}
						}
					}
				}
			}
		}

		let retShun = [];
		for (let i = 0; i < shunzis.length; i++) {
			let item = shunzis[i];
			if (item.length == 5) {
				retShun.push(item);
			}
		}
		//给3鬼用的顺子（判断同花顺用
		if (isTongHuaShun) {
			for (let i = 0; i < pokers.length; i++) {
				let poker = pokers[i];
				let cardValue1 = this.GetCardValue(poker);
				if (guipai.indexOf(poker) > -1) {
					continue;
				}
				if (this.clearList.indexOf(cardValue1) > -1) {
					continue;
				}
				let shunzi = [];
				shunzi.push(poker);
				for (let j = i + 1; j < pokers.length; j++) {
					let cardValue2 = this.GetCardValue(pokers[j]);
					if (guipai.indexOf(pokers[j]) > -1) {
						continue;
					}
					if (this.clearList.indexOf(cardValue2) > -1) {
						continue;
					}
					shunzi.push(pokers[j]);
					if ((this.GetCardValue(shunzi[0]) - this.GetCardValue(pokers[j]) <= 4)) {
						shunzis.push(shunzi);
						break;
					}
				}
			}
		}
		if (guipai.length >= 3) {//有可能同花顺
			let sanZhangGuis = [];
			this.PokerCombination(3, guipai, sanZhangGuis);
			for (let i = 0; i < sanZhangGuis.length; i++) {
				for (let j = 0; j < shunzis.length; j++) {
					let temp = this.copyArr(sanZhangGuis[i]);
					let shunzi = this.copyArr(shunzis[j]);
					if (shunzi.length == 2) {
						for (let k = 0; k < shunzi.length; k++) {
							let one = this.copyArr(shunzi[k]);
							if (temp.indexOf(one) != -1) {
								continue;
							}
							temp.push(one);
							if (temp.length == 5) {
								retShun.push(temp);
							}
						}
					}
				}
			}
		}
		let liangZhangGuis = [];
		if (guipai.length >= 2) {
			this.PokerCombination(2, guipai, liangZhangGuis);
			for (let i = 0; i < liangZhangGuis.length; i++) {
				for (let j = 0; j < shunzis.length; j++) {
					let gDuiZi = this.copyArr(liangZhangGuis[i]);
					let item = shunzis[j];
					if (item.length == 3) {
						for (let k = 0; k < item.length; k++) {
							let temp = item[k];
							let tempValue = this.GetCardValue(temp);
							if (gDuiZi.indexOf(temp) != -1) {
								continue;
							}
							if (!isTongHuaShun) {
								if (clearList.indexOf(tempValue) > -1) {
									continue;
								}
							}
							gDuiZi.push(temp);
							if (k == item.length - 1) {
								retShun.push(gDuiZi);
							}
						}
					}
				}
			}
		}
		if (guipai.length >= 1) {
			for (let i = 0; i < shunzis.length; i++) {
				for (let j = 0; j < guipai.length; j++) {
					let item = shunzis[i];
					if (item.length == 4) {
						let gDuiZi = this.copyArr(item);
						let gui = guipai[j];
						if (gDuiZi.indexOf(gui) != -1) {
							continue;
						} else {
							gDuiZi.push(gui);
							retShun.push(gDuiZi);
						}
					}
				}
			}
		}
		return retShun;
	},

	isSave: function (shunzi, poker) {
		let guipai = this.GetGuiPai(poker);

		if (guipai.length) {
			return false;
		}

		if (!this.isContain(shunzi, poker)) {
			return false;
		}

		if (shunzi.length == 1) {
			return true;
		}

		if (this.GetCardValue(shunzi[0]) == 14 && this.GetCardValue(shunzi[1]) <= 5) {
			return true;
		}

		let firstValue = this.GetCardValue(shunzi[0]);
		let lastValue = this.GetCardValue(poker);

		let value = firstValue - lastValue;
		if (value > 4) {
			return false;
		}
		return true;
	},

	isContain: function (shunzi, poker) {
		let temp = this.GetCardValue(poker);
		for (let i = 0; i < shunzi.length; i++) {
			let cardValue = this.GetCardValue(shunzi[i]);
			if (temp == cardValue) {
				return false;
			}
		}
		return true;
	},
	//判断是否为顺子
	GetShunziEx: function (pokers) {//只判断五张
		if (pokers.length != 5) {
			return [];
		}
		let shunzis = this.GetShunzi(pokers, true);
		return shunzis;
	},

	isSameColor: function (tonghuas, tonghua) {
		let bRet = false;
		if (tonghuas.length) {
			for (let idx = 0; idx < tonghuas.length; idx++) {
				let first = this.GetCardColor(tonghuas[idx][0]);
				let second = this.GetCardColor(tonghua[0]);
				if (first == second) {
					bRet = true;
					break;
				}
			}
		}
		return bRet;
	},
	//五张不连续的同花色牌
	GetTonghua: function (pokers) {
		let guipai = this.GetGuiPai(pokers);
		let tonghuas = [];
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			let tonghua = this.GetSameColor(pokers, poker);
			let same = this.isSameColor(tonghuas, tonghua);
			if (tonghua.length == 5 && !same) {
				tonghuas[tonghuas.length] = tonghua;
			} else if (tonghua.length > 5 && !same) {
				this.PokerCombination(5, tonghua, tonghuas);
			}
		}
		let paizu = [];
		if (guipai.length >= 1) {
			for (let i = 0; i < pokers.length; i++) {
				let poker = pokers[i];
				if (guipai.indexOf(poker) != -1) {
					continue;
				}
				let sameColor = this.GetSameColor(pokers, poker);
				let same = this.isSameColor(paizu, sameColor);
				if (sameColor.length >= 4 && !same) {
					this.PokerCombination(4, sameColor, paizu);
					for (let j = 0; j < paizu.length; j++) {
						for (let k = 0; k < guipai.length; k++) {
							let gDuiZi = this.copyArr(paizu[j]);
							let gui = guipai[k];
							if (gDuiZi.indexOf(gui) != -1) {
								continue;
							} else {
								gDuiZi.push(gui);
								tonghuas.push(gDuiZi);
							}
						}
					}
				}
			}
		}
		return tonghuas;
	},

	GetTonghuaEx: function (pokers) {
		if (pokers.length != 5) {
			return [];
		}
		let isSameColor = this.CheckSameColor(pokers);
		if (pokers.length == 5 && isSameColor) {
			return pokers;
		} else {
			return [];
		}
	},
	// 2张  一对同花
	GetYiDuiTongHua: function (pokers) {
		if (pokers.length != 5) {
			return [];
		}
		let guipai = this.GetGuiPai(pokers);
		let isSameColor = this.CheckSameColor(pokers);
		if (pokers.length == 5 && isSameColor) {
			let isYidui = false;
			for (let i = 0; i < pokers.length; i++) {
				let poker = pokers[i];
				if (guipai.indexOf(poker) != -1) {
					continue;
				}
				let duizi = this.GetSameValue(pokers, poker);
				if (duizi.length == 2) {
					isYidui = true;
					break;
				}
			}
			if (guipai.length == 1) {
				isYidui = true;
			}
			if (isYidui) {
				return pokers;
			} else {
				return [];
			}
		} else {
			return [];
		}
	},
	// 4张 2对同花 判断是否有两对同花
	GetLiangDuiTongHua: function (pokers) {
		if (pokers.length != 5) {
			return [];
		}
		let guipai = this.GetGuiPai(pokers);
		let isSameColor = this.CheckSameColor(pokers);
		let duizi = [];
		if (pokers.length == 5 && isSameColor) {
			if (!guipai.length) {
				let duizis = this.GetNotGuiDuiZis(pokers);
				if (duizis.length == 2) {
					return pokers;
				} else {
					return [];
				}
			} else if (guipai.length == 1) {
				for (let i = 0; i < pokers.length; i++) {
					let poker = pokers[i];
					if (guipai.indexOf(poker) != -1) {
						continue;
					}
					duizi = this.GetSameValue(pokers, poker);
					if (duizi.length == 2) {
						break;
					}
				}

				if (duizi.length == 2) {
					return pokers;
				} else {
					return [];
				}
			} else if (guipai.length > 1) {
				return pokers;
			}
		} else {
			return [];
		}
	},
	// 判断 是否为葫芦
	GetHulu: function (pokers) {
		let hulus = this.GetHuluEx(pokers);
		return hulus;
	},
	//葫芦 (5张 三条加一对，同牌型比三条)
	GetHuluEx: function (pokers) {
		//不含炸弹的葫芦 对子+三条
		let guipai = this.GetGuiPai(pokers);
		let duizis = this.GetAllDuiZi(pokers);
		this.SortCardArrByMin(duizis);
		let santiaos = this.GetNotGuiSanTiaos(pokers);
		this.SortCardArrByMax(santiaos);
		let hulus = [];
		for (let i = 0; i < duizis.length; i++) {
			let dui = duizis[i];
			for (let j = 0; j < santiaos.length; j++) {
				let san = santiaos[j];
				if (!this.CheckSameValue(dui, san)) {
					let hulu = dui.concat(san);
					hulus[hulus.length] = hulu;
				}
			}
		}
		//两对+1张鬼组成葫芦 (获取没有鬼牌的两对,没有特殊牌的对子)
		let liangduis = [];
		let noGuiDuiZis = this.GetNotGuiDuiZis(pokers);
		if (noGuiDuiZis.length >= 2) {//没有鬼牌的时候
			for (let i = 0; i < noGuiDuiZis.length; i++) {
				let firstDui = noGuiDuiZis[i];
				let secondDui = [];
				for (let j = 1; j < noGuiDuiZis.length; j++) {
					secondDui = noGuiDuiZis[j];
					let bRet = this.CheckSameValue(firstDui, secondDui);
					if (!bRet) {
						let liangdui = firstDui.concat(secondDui);
						liangduis.push(liangdui);
					}
				}
			}
		}
		if (guipai.length >= 1) {
			for (let i = 0; i < liangduis.length; i++) {
				for (let j = 0; j < guipai.length; j++) {
					let gDuiZi = this.copyArr(liangduis[i]);
					let gui = guipai[j];
					if (gDuiZi.indexOf(gui) != -1) {
						continue;
					}
					gDuiZi.push(gui);
					hulus.push(gDuiZi);
				}
			}
		}
		return hulus;
	},
	//铁支  炸弹 (4张相同的牌/带鬼牌的玩法222，333算炸)
	GetZhaDan: function (pokers) {
		let zhadans = [];
		if (this.sign < 2) {//经典模式
			if (pokers.length == 3) {
				return zhadans;
			}
		}
		let guipai = this.GetGuiPai(pokers);
		//4张相同的牌/带鬼牌的玩法222，333算炸
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			let cardValue = this.GetCardValue(poker);
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			let zhadan = this.GetSameValue(pokers, poker);
			let bInList = this.CheckPokerInList(zhadans, poker);
			if (this.clearList.indexOf(cardValue) > -1) {
				if (zhadan.length >= 3 && !bInList) {
					this.PokerCombination(3, zhadan, zhadans);
				}
				if (guipai.length > 1) {
					zhadans.push([poker, guipai[0], guipai[1]]);
				}
			} else {
				if (zhadan.length == 4 && !bInList) {
					this.PokerCombination(4, zhadan, zhadans);
				}
			}
		}
		//3张鬼+单牌=炸弹
		//2张鬼+对子=炸弹
		//1张鬼+三条=炸弹
		if (guipai.length >= 3) {
			let sanZhangGuis = [];
			this.PokerCombination(3, guipai, sanZhangGuis);
			let clearList = this.guiClearCardDict[this.wangPaiNum];
			for (let i = 0; i < sanZhangGuis.length; i++) {
				for (let j = 0; j < pokers.length; j++) {
					let temp = this.copyArr(sanZhangGuis[i]);
					let poker = pokers[j];
					let cardValue = this.GetCardValue(poker);
					if (guipai.indexOf(poker) != -1) {
						continue;
					}
					if (temp.indexOf(poker) != -1) {
						continue;
					}
					if (this.wangPaiNum == 2 || this.sign == 2) {
						if (cardValue == 2 || cardValue == 3) {
							continue;
						}
					} else if (this.wangPaiNum > 2) {
						if (clearList.indexOf(cardValue) > -1) {
							continue;
						}
					}

					temp.push(poker);
					zhadans.push(temp);
				}
			}
		}
		if (guipai.length >= 2) {
			let liangZhangGuis = [];
			this.PokerCombination(2, guipai, liangZhangGuis);
			let duizis = this.GetNotGuiDuiZis(pokers);
			for (let i = 0; i < liangZhangGuis.length; i++) {
				for (let j = 0; j < duizis.length; j++) {
					let temp = this.copyArr(liangZhangGuis[i]);
					let duizi = this.copyArr(duizis[j]);
					for (let k = 0; k < duizi.length; k++) {
						let poker = this.copyArr(duizi[k]);
						if (temp.indexOf(poker) != -1) {
							continue;
						}
						temp.push(poker);
						if (temp.length == 4) {
							zhadans.push(temp);
						}
					}
				}
			}

		}
		if (guipai.length >= 1) {
			let santiaos = this.GetNotGuiSanTiaos(pokers);
			for (let i = 0; i < santiaos.length; i++) {
				for (let j = 0; j < guipai.length; j++) {
					let santiao = this.copyArr(santiaos[i]);
					let gui = guipai[j];
					if (santiao.indexOf(gui) != -1) {
						continue;
					}
					santiao.push(gui);
					zhadans.push(santiao);
				}
			}
			let duiSans = this.GetSanPais(pokers, 2);
			for (let i = 0; i < duiSans.length; i++) {
				for (let j = 0; j < guipai.length; j++) {
					let zhadan = this.copyArr(duiSans[i]);
					let gui = guipai[j];
					if (zhadan.indexOf(gui) != -1) {
						continue;
					}
					zhadan.push(gui);
					zhadans.push(zhadan);
				}
			}
			let duiErs = this.GetErPais(pokers, 2);
			for (let i = 0; i < duiErs.length; i++) {
				for (let j = 0; j < guipai.length; j++) {
					let zhadan = this.copyArr(duiErs[i]);
					let gui = guipai[j];
					if (zhadan.indexOf(gui) != -1) {
						continue;
					}
					zhadan.push(gui);
					zhadans.push(zhadan);
				}
			}
		}
		return zhadans;
	},
	//同花顺 (同花色的五张连续牌)
	GetTongHuaShunEx: function (pokers) {
		this.SortCardByMax(pokers);
		let tonghuashuns = [];
		let cardsColorDict = {};
		let guipai = this.GetGuiPai(pokers);
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			let color = this.GetCardColor(poker);
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			if (!cardsColorDict[color]) {
				cardsColorDict[color] = [];
			}
			cardsColorDict[color].push(poker);
		}
		let shunzis = [];
		for (let key in cardsColorDict) {
			let cardsColor = cardsColorDict[key];
			for (let i = 0; i < cardsColor.length; i++) {
				let poker = cardsColor[i];
				let shunzi = [];
				shunzi.push(poker);
				for (let j = i + 1; j < cardsColor.length; j++) {
					shunzi = [];
					shunzi.push(cardsColor[i]);
					let ret = this.isSave(shunzi, cardsColor[j]);
					if (ret) {
						shunzi.push(pokers[j]);
						if (this.GetCardValue(shunzi[0]) == 14 && this.GetCardValue(shunzi[1]) <= 5) {
							if ((this.GetCardValue(shunzi[0]) - this.GetCardValue(pokers[j]) <= 4)) {
								let isSameColor = this.isSameColor([shunzi], [pokers[j]]);
								if (isSameColor) {//可能是同花顺，比铁支大
									shunzis.push(shunzi);
								}
							}
						}
					} else {
						continue;
					}
					for (let k = j + 1; k < cardsColor.length; k++) {
						shunzi = [];
						shunzi.push(cardsColor[i]);
						shunzi.push(cardsColor[j]);
						let ret = this.isSave(shunzi, cardsColor[k]);
						if (ret) {
							shunzi.push(cardsColor[k]);
							shunzis.push(shunzi);
						} else {
							continue;
						}
						for (let x = k + 1; x < cardsColor.length; x++) {
							shunzi = [];
							shunzi.push(cardsColor[i]);
							shunzi.push(cardsColor[j]);
							shunzi.push(cardsColor[k]);
							let ret = this.isSave(shunzi, cardsColor[x]);
							if (ret) {
								shunzi.push(cardsColor[x]);
								shunzis.push(shunzi);
							} else {
								continue;
							}
							for (let t = x + 1; t < cardsColor.length; t++) {
								shunzi = [];
								shunzi.push(cardsColor[i]);
								shunzi.push(cardsColor[j]);
								shunzi.push(cardsColor[k]);
								shunzi.push(cardsColor[x]);
								let ret = this.isSave(shunzi, cardsColor[t]);
								if (ret) {
									shunzi.push(cardsColor[t]);
									shunzis.push(shunzi);
								}
							}
						}
					}
				}
			}
		}
		for (let i = 0; i < shunzis.length; i++) {
			let item = shunzis[i];
			if (item.length == 5) {
				tonghuashuns.push(item);
			}
		}
		for (let key in cardsColorDict) {
			let cardsColor = cardsColorDict[key];
			for (let i = 0; i < cardsColor.length; i++) {
				let poker = cardsColor[i];
				let cardValue1 = this.GetCardValue(poker);
				if (this.clearList.indexOf(cardValue1) > -1) {
					continue;
				}
				let shunzi = [];
				shunzi.push(poker);
				//计算出能与3鬼凑成的同花顺
				for (let j = i + 1; j < cardsColor.length; j++) {
					let cardValue2 = this.GetCardValue(cardsColor[j]);
					if (this.clearList.indexOf(cardValue2) > -1) {
						continue;
					}
					shunzi.push(cardsColor[j]);
					if ((this.GetCardValue(shunzi[0]) - this.GetCardValue(cardsColor[j]) <= 4)) {
						shunzis.push(shunzi);
						break;
					}
				}
			}
		}
		if (guipai.length >= 3) {//有可能同花顺 3张普通牌
			let sanZhangGuis = [];
			this.PokerCombination(3, guipai, sanZhangGuis);
			for (let i = 0; i < sanZhangGuis.length; i++) {
				for (let j = 0; j < shunzis.length; j++) {
					let temp = this.copyArr(sanZhangGuis[i]);
					let shunzi = this.copyArr(shunzis[j]);
					if (shunzi.length == 2) {
						for (let k = 0; k < shunzi.length; k++) {
							let one = this.copyArr(shunzi[k]);
							if (temp.indexOf(one) != -1) {
								continue;
							}
							temp.push(one);
							if (temp.length == 5) {
								tonghuashuns.push(temp);
							}
						}
					}
				}
			}
		}
		let liangZhangGuis = [];
		if (guipai.length >= 2) {
			this.PokerCombination(2, guipai, liangZhangGuis);
			for (let i = 0; i < liangZhangGuis.length; i++) {
				for (let j = 0; j < shunzis.length; j++) {
					let gDuiZi = this.copyArr(liangZhangGuis[i]);
					let item = shunzis[j];
					if (item.length == 3) {
						for (let k = 0; k < item.length; k++) {
							let temp = item[k];
							if (gDuiZi.indexOf(temp) != -1) {
								continue;
							} else {
								gDuiZi.push(temp);
								if (gDuiZi.length == 5) {
									tonghuashuns.push(gDuiZi);
								}
							}
						}
					}
				}
			}
		}
		if (guipai.length >= 1) {
			for (let i = 0; i < shunzis.length; i++) {
				for (let j = 0; j < guipai.length; j++) {
					let item = shunzis[i];
					if (item.length == 4) {
						let gDuiZi = this.copyArr(item);
						let gui = guipai[j];
						if (gDuiZi.indexOf(gui) != -1) {
							continue;
						} else {
							gDuiZi.push(gui);
							tonghuashuns.push(gDuiZi);
						}
					}
				}
			}
		}
		return tonghuashuns;
	},
	//五同 (五张相同的牌) 222+王   333+王 22+王王 33+王王
	GetWuTong: function (pokers) {
		let guipai = this.GetGuiPai(pokers);
		let wutongs = [];
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			let cardValue = this.GetCardValue(poker);
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			let wutong = this.GetSameValue(pokers, poker);
			let bInList = this.CheckPokerInList(wutongs, poker);
			if (this.sign < 2) {
				if (wutong.length == 5 && !bInList) {
					this.PokerCombination(5, wutong, wutongs);
				} else if (wutong.length > 5 && !bInList) {
					this.PokerCombination(5, wutong, wutongs);
				}
			} else if (this.wangPaiNum == 2 || this.sign == 2) {
				if (cardValue == 2 && guipai.length > 2) {
					wutongs.push([poker, guipai[0], guipai[1], guipai[2]]);
				} else if (cardValue == 3 && guipai.length > 2) {
					wutongs.push([poker, guipai[0], guipai[1], guipai[2]]);
				}
			} else if (this.wangPaiNum > 2) {
				let clearList = this.guiClearCardDict[this.wangPaiNum];
				if (clearList.indexOf(cardValue) > -1) {
					if (guipai.length > 2) {
						wutongs.push([poker, guipai[0], guipai[1], guipai[2]]);
					}
				}
			}
		}
		//3333
		let sanWuTongs = this.GetClearPais(pokers, 4);
		for (let i = 0; i < sanWuTongs.length; i++) {
			let temp = this.copyArr(sanWuTongs[i]);
			wutongs.push(temp);
		}

		if (guipai.length >= 4) {
			let siZhangGuis = [];
			this.PokerCombination(4, guipai, siZhangGuis);
			let oneCards = this.GetNotGuiOneCards(pokers);
			for (let i = 0; i < siZhangGuis.length; i++) {
				for (let j = 0; j < oneCards.length; j++) {
					let temp = this.copyArr(siZhangGuis[i]);
					let poker = oneCards[j][0];
					if (temp.indexOf(poker) != -1) {
						continue;
					}
					temp.push(poker);
					wutongs.push(temp);
				}
			}
		}
		if (guipai.length >= 3) {
			let sanZhangGuis = [];
			this.PokerCombination(3, guipai, sanZhangGuis);
			let duizis = this.GetNotGuiDuiZis(pokers);
			for (let i = 0; i < duizis.length; i++) {
				for (let j = 0; j < sanZhangGuis.length; j++) {
					let temp = this.copyArr(duizis[i]);
					let sanZhangGui = sanZhangGuis[j];
					for (let k = 0; k < sanZhangGui.length; k++) {
						let gui = sanZhangGui[k];
						if (temp.indexOf(gui) != -1) {
							continue;
						}
						temp.push(gui);
						if (temp.length == 5) {
							wutongs.push(temp);
						}
					}
				}
			}
		}
		if (guipai.length >= 2) {
			let liangZhangGuis = [];
			this.PokerCombination(2, guipai, liangZhangGuis);
			let santiaos = this.GetNotGuiSanTiaos(pokers);
			for (let i = 0; i < santiaos.length; i++) {
				for (let j = 0; j < liangZhangGuis.length; j++) {
					let temp = this.copyArr(santiaos[i]);
					let liangZhangGui = liangZhangGuis[j];
					for (let k = 0; k < liangZhangGui.length; k++) {
						let gui = liangZhangGui[k];
						if (temp.indexOf(gui) != -1) {
							continue;
						}
						temp.push(gui);
						if (temp.length == 5) {
							wutongs.push(temp);
						}
					}
				}
			}
			//33+王王
			let sanLists = this.GetSanPais(pokers, 2);
			for (let i = 0; i < sanLists.length; i++) {
				for (let j = 0; j < liangZhangGuis.length; j++) {
					let temp = this.copyArr(sanLists[i]);
					let liangZhangGui = liangZhangGuis[j];
					for (let k = 0; k < liangZhangGui.length; k++) {
						let gui = liangZhangGui[k];
						if (temp.indexOf(gui) != -1) {
							continue;
						}
						temp.push(gui);
						if (temp.length == 4) {
							wutongs.push(temp);
						}
					}
				}
			}
			//22+王王
			let erLists = this.GetErPais(pokers, 2);
			for (let i = 0; i < erLists.length; i++) {
				for (let j = 0; j < liangZhangGuis.length; j++) {
					let temp = this.copyArr(erLists[i]);
					let liangZhangGui = liangZhangGuis[j];
					for (let k = 0; k < liangZhangGui.length; k++) {
						let gui = liangZhangGui[k];
						if (temp.indexOf(gui) != -1) {
							continue;
						}
						temp.push(gui);
						if (temp.length == 4) {
							wutongs.push(temp);
						}
					}
				}
			}
		}
		if (guipai.length >= 1) {
			let siZhangs = this.GetNotGuiSiZhangs(pokers, true);
			for (let i = 0; i < siZhangs.length; i++) {
				for (let j = 0; j < guipai.length; j++) {
					let temp = this.copyArr(siZhangs[i]);
					let gui = guipai[j];
					if (temp.indexOf(gui) != -1) {
						continue;
					}
					temp.push(gui);
					wutongs.push(temp);
				}
			}
			let erLists = this.GetErPais(pokers, 3);
			for (let i = 0; i < erLists.length; i++) {
				for (let j = 0; j < guipai.length; j++) {
					let temp = this.copyArr(erLists[i]);
					let gui = guipai[j];
					if (temp.indexOf(gui) != -1) {
						continue;
					}
					temp.push(gui);
					wutongs.push(temp);
				}
			}
			let sanLists = this.GetSanPais(pokers, 3);
			for (let i = 0; i < sanLists.length; i++) {
				for (let j = 0; j < guipai.length; j++) {
					let temp = this.copyArr(sanLists[i]);
					let gui = guipai[j];
					if (temp.indexOf(gui) != -1) {
						continue;
					}
					temp.push(gui);
					wutongs.push(temp);
				}
			}
		}

		// console.log('五同 :', wutongs);
		return wutongs;
	},
	//六同 (5张 因222、333与王组成的5张同点牌； 示例：222+王王、2222+王)
	GetLiuTongs: function (pokers) {
		let guipai = this.GetGuiPai(pokers);
		let zhangs = [];
		let liutongs = [];
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}

			let duizi = this.GetSameValue(pokers, poker);
			let bInList = this.CheckPokerInList(zhangs, poker);
			let value = this.GetCardValue(duizi[0]);
			if (this.clearList.indexOf(value) > -1) {
				zhangs.push([poker]);
				if (duizi.length == 2 && !bInList) {
					this.PokerCombination(2, duizi, zhangs);
				}
				if (duizi.length == 3 && !bInList) {
					this.PokerCombination(3, duizi, zhangs);
				}
				if (duizi.length == 4 && !bInList) {
					this.PokerCombination(4, duizi, zhangs);
				}
			}
		}
		if (guipai.length >= 4) {
			let siZhangGuis = [];
			this.PokerCombination(4, guipai, siZhangGuis);
			for (let i = 0; i < siZhangGuis.length; i++) {
				for (let j = 0; j < zhangs.length; j++) {
					let temp = this.copyArr(siZhangGuis[i]);
					let zhang = this.copyArr(zhangs[j]);
					if (zhang.length == 1) {
						for (let k = 0; k < zhang.length; k++) {
							let one = this.copyArr(zhang[k]);
							if (temp.indexOf(one) != -1) {
								continue;
							}
							temp.push(one);
							if (temp.length == 5) {
								liutongs.push(temp);
							}
						}
					}
				}
			}
		}
		if (guipai.length >= 3) {
			let sanZhangGuis = [];
			this.PokerCombination(3, guipai, sanZhangGuis);
			for (let i = 0; i < sanZhangGuis.length; i++) {
				for (let j = 0; j < zhangs.length; j++) {
					let temp = this.copyArr(sanZhangGuis[i]);
					let zhang = this.copyArr(zhangs[j]);
					if (zhang.length == 2) {
						for (let k = 0; k < zhang.length; k++) {
							let one = this.copyArr(zhang[k]);
							if (temp.indexOf(one) != -1) {
								continue;
							}
							temp.push(one);
							if (temp.length == 5) {
								liutongs.push(temp);
							}
						}
					}
				}
			}
		}
		if (guipai.length >= 2) {
			let liangZhangGuis = [];
			this.PokerCombination(2, guipai, liangZhangGuis);
			for (let i = 0; i < liangZhangGuis.length; i++) {
				for (let j = 0; j < zhangs.length; j++) {
					let temp = this.copyArr(liangZhangGuis[i]);
					let zhang = this.copyArr(zhangs[j]);
					if (zhang.length == 3) {
						for (let k = 0; k < zhang.length; k++) {
							let one = this.copyArr(zhang[k]);
							if (temp.indexOf(one) != -1) {
								continue;
							}
							temp.push(one);
							if (temp.length == 5) {
								liutongs.push(temp);
							}
						}
					}
				}
			}
		}
		if (guipai.length >= 1) {
			for (let i = 0; i < zhangs.length; i++) {
				let zhang = zhangs[i];
				if (zhang.length == 4) {
					for (let j = 0; j < guipai.length; j++) {
						let temp = this.copyArr(zhang);
						let gui = guipai[j];
						if (temp.indexOf(gui) != -1) {
							continue;
						}
						temp.push(gui);
						if (temp.length == 5) {
							liutongs.push(temp);
						}
					}
				}
			}
		}
		return liutongs;
	},
	//判断是否为同花顺
	IsTongHuaShun: function (pokers) {//只能是5张
		let isTongHuaShun = false;
		if (pokers.length == 5) {
			let tonghuas = this.GetTonghuaEx(pokers);
			if (5 == pokers.length && 5 == tonghuas.length) {
				if (this.GetShunziEx(tonghuas).length != 0) {
					isTongHuaShun = true;
				} else {
					isTongHuaShun = false;
				}
			} else {
				isTongHuaShun = false;
			}
			return isTongHuaShun;
		}
		return isTongHuaShun;
	},
	//判断是否为五同 王牌场及以上的4个2,4个3, 不为2/3：1张加铁支，2张加三条，3张加对子，4张加单张
	IsWuTong: function (pokers) {
		let isWuTong = false;
		let erList = [];
		let sanList = [];
		let clearListDict = {};
		let guipai = this.GetGuiPai(pokers);
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			let value = this.GetCardValue(poker);
			let color = this.GetCardColor(poker);
			if (color != 64) {//4个鬼+1张牌
				if (guipai.length == 4) {
					return true;
				}
			}
			let samePoker = this.GetSameValue(pokers, poker);
			if (value != 2 && value != 3 && samePoker.length >= 2 && samePoker.length + guipai.length == 5) {
				return true;
			}
			if (this.sign == 1) {//经典场相同的普通牌＋鬼牌可以组成五同
				if (samePoker.length + guipai.length == 5) {
					return true;
				}
			} else if (this.wangPaiNum == 2 || this.sign == 2) {
				if (value == 2) {
					erList.push(poker);
				}
				if (value == 3) {
					sanList.push(poker);
				}
			} else if (this.wangPaiNum > 2) {
				let clearList = this.guiClearCardDict[this.wangPaiNum];
				if (clearList.indexOf(value) > -1) {
					if (!clearListDict[value]) {
						clearListDict[value] = [];
					}
					clearListDict[value].push(poker);
				}

			}
		}
		if (this.wangPaiNum == 2 || this.sign == 2) {
			if (erList.length == 1 && erList.length + guipai.length == 4) {
				return true;
			}
			if (sanList.length == 1 && sanList.length + guipai.length == 4) {
				return true;
			}
			if (erList.length == 2 && erList.length + guipai.length == 4) {
				return true;
			}
			if (sanList.length == 2 && sanList.length + guipai.length == 4) {
				return true;
			}
			if (erList.length == 3 && erList.length + guipai.length == 4) {
				return true;
			}
			if (sanList.length == 3 && sanList.length + guipai.length == 4) {
				return true;
			}
			if (erList.length == 4 && erList.length + guipai.length == 4) {
				return true;
			}
			if (sanList.length == 4 && erList.length + guipai.length == 4) {
				return true;
			}
		} else if (this.wangPaiNum > 2) {
			for (let key in clearListDict) {
				let clearCardList = clearListDict[key];
				if (clearCardList.length == 1 && clearCardList.length + guipai.length == 4) {
					return true;
				}
				if (clearCardList.length == 2 && clearCardList.length + guipai.length == 4) {
					return true;
				}
				if (clearCardList.length == 3 && clearCardList.length + guipai.length == 4) {
					return true;
				}
				if (clearCardList.length == 4 && clearCardList.length + guipai.length == 4) {
					return true;
				}
			}
		}
		return isWuTong;
	},
	//判断是否有六同
	IsLiuTong: function (pokers) {
		let isLiuTong = false;
		if (pokers.length != 5) {
			return isLiuTong;
		}
		let erList = [];
		let sanList = [];
		let clearListDict = {};
		let guipai = this.GetGuiPai(pokers);
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			let value = this.GetCardValue(poker);
			if (this.wangPaiNum == 2 || this.sign == 2) {
				if (value == 2) {
					erList.push(poker);
				}
				if (value == 3) {
					sanList.push(poker);
				}
			} else if (this.wangPaiNum > 2) {
				let clearList = this.guiClearCardDict[this.wangPaiNum];
				if (clearList.indexOf(value) > -1) {
					if (!clearListDict[value]) {
						clearListDict[value] = [];
					}
					clearListDict[value].push(poker);
				}

			}
		}
		if (this.wangPaiNum == 2 || this.sign == 2) {
			if (erList.length >= 2 && guipai.length + erList.length >= 5) {
				isLiuTong = true;
			}
			if (sanList.length >= 2 && guipai.length + sanList.length >= 5) {
				isLiuTong = true;
			}
		} else if (this.wangPaiNum > 2) {
			for (let key in clearListDict) {
				let clearCardList = clearListDict[key];
				if (clearCardList.length >= 1 && guipai.length + clearCardList.length >= 5) {
					isLiuTong = true;
				}
			}
		}
		return isLiuTong;
	},
	//五鬼 (五张大小王鬼牌)
	GetWuGuis: function (pokers) {
		let wuguis = [];
		let guipai = this.GetGuiPai(pokers);
		if (guipai.length >= 5) {
			this.PokerCombination(5, guipai, wuguis);
		}
		return wuguis;
	},
	//判断是否有五鬼
	IsWuGui: function (pokers) {
		let isWuGui = false;
		let guipai = this.GetGuiPai(pokers);
		if (guipai.length >= 5) {
			isWuGui = true;
		}
		return isWuGui;
	},
	IsSanGui: function (pokers) {
		let isSanGui = false;
		if (pokers.length == 3) {
			let guipai = this.GetGuiPai(pokers);
			if (guipai.length == 3) {
				isSanGui = true;
			}
		}
		return isSanGui;
	},
	IsShuangWangChongTou: function (pokers) {
		let isShuangWangChongTou = false;
		if (this.sign == 3 || this.sign == 1) {//特殊王牌场 //经典场也可以
			if (pokers.length == 3) {
				let guipai = this.GetGuiPai(pokers);
				if (guipai.length == 2) {
					isShuangWangChongTou = true;
				}
			}
		}
		return isShuangWangChongTou;
	},
	IsChongZha: function (pokers, isTouDun = false) {
		let isChongZha = false;
		if (!isTouDun) {
			if (pokers.length >= 3) {
				let clearListDict = {};
				for (let i = 0; i < pokers.length; i++) {
					let poker = pokers[i];
					let cardValue = this.GetCardValue(poker);
					let clearList = this.guiClearCardDict[this.wangPaiNum];
					if (clearList.indexOf(cardValue) > -1) {
						if (!clearListDict[cardValue]) {
							clearListDict[cardValue] = [];
						}
						clearListDict[cardValue].push(poker);
					}
				}
				for (let key in clearListDict) {
					let clearCardList = clearListDict[key];
					if (clearCardList.length == 3) {
						isChongZha = true;
					}
				}
			}
		} else {
			if (pokers.length == 3) {
				let clearListDict = {};
				let guipai = this.GetGuiPai(pokers);
				for (let i = 0; i < pokers.length; i++) {
					let poker = pokers[i];
					let cardValue = this.GetCardValue(poker);
					let clearList = this.guiClearCardDict[this.wangPaiNum];
					if (clearList.indexOf(cardValue) > -1) {
						if (!clearListDict[cardValue]) {
							clearListDict[cardValue] = [];
						}
						clearListDict[cardValue].push(poker);
					}
				}
				for (let key in clearListDict) {
					let clearCardList = clearListDict[key];
					if (clearCardList.length == 3) {
						isChongZha = true;
					}
				
					if (guipai.length == 1 && guipai.length + clearCardList.length == 3) {
						isChongZha = true;
					}else if (guipai.length == 2 && guipai.length + clearCardList.length == 3) {
						isChongZha = true;
					}else if (this.sign == 2) {
						if (guipai.length != 3 && guipai.length + clearCardList.length == 3) {
							isChongZha = true;
						}
					}
				}
			}
		}
		return isChongZha;
	},
	//头墩3冲炸
	IsSanChongZha: function (pokers) {
		let chongZhaCard = 0;
		if (pokers.length == 3) {
			let clearListDict = {};
			for (let i = 0; i < pokers.length; i++) {
				let poker = pokers[i];
				let cardValue = this.GetCardValue(poker);
				let clearList = this.guiClearCardDict[this.wangPaiNum];
				if (clearList.indexOf(cardValue) > -1) {
					if (!clearListDict[cardValue]) {
						clearListDict[cardValue] = [];
					}
					clearListDict[cardValue].push(poker);
				}
			}
			for (let key in clearListDict) {
				let clearCardList = clearListDict[key];
				if (clearCardList.length == 3) {
					chongZhaCard = parseInt(key);
				}
			}
		}
		return chongZhaCard;
	},
	CheckTouDunByGui: function (pokers) {
		let isSanGui = this.CARD_TYPE_ZHADAN_SANGUI;
		let isShuangWangChongTou = this.CARD_TYPE_ZHADAN_SHUANGWANGCHONGTOU;
		let isChongZha = this.CARD_TYPE_ZHADAN_CHONGZHA;
		if (pokers.length == 3) {
			if (this.IsSanGui(pokers)) {
				return isSanGui;
			} else if (this.IsShuangWangChongTou(pokers)) {
				return isShuangWangChongTou;
			} else if (this.IsChongZha(pokers)) {
				return isChongZha;
			}
		}
		return this.CARD_TYPE_WULONG;
	},

///////////////////////////common///////////////////////////////////////
	//检查是否是同一花色
	CheckSameColor: function (pokers) {
		if (pokers.length == 0) {
			return false;
		}
		let guipai = this.GetGuiPai(pokers);
		if (guipai.length >= 4) {
			return true;
		}
		for (let i = 0; i < pokers.length; i++) {
			if (guipai.indexOf(pokers[i]) != -1) {
				continue;
			}
			let poker = pokers[i];
			let sameColor = this.GetSameColor(pokers, poker);
			if (guipai.length + sameColor.length == pokers.length) {
				return true;
			}
		}
		return false;
	},
	CheckPokerInList: function (list, tagCard) {
		if (list.length == 0) {
			return false;
		}

		let bInList = false;
		for (let i = 0; i < list.length; i++) {
			let item = list[i];
			let pos = item.indexOf(tagCard);
			if (pos >= 0) {
				bInList = true;
			}
		}
		return bInList
	},

	GetContinueValue: function (pokers, tagCard) {
		if (pokers.length == 0) {
			return;
		}
		let continueValueList = [];
		let tagCardValue = this.GetCardValue(tagCard);
		let continueTime = 1;

		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			let continueValue = this.GetCardValue(poker);

			if (tagCardValue + continueTime == continueValue) {
				continueValueList[continueValueList.length] = poker;
				continueTime++;
			}
		}
		return continueValueList;
	},
	//获取下一牌值
	GetNextValue: function (pokers, tagCard) {
		if (list.length == 0) return;
		let nextValueList = [];
		let tagCardValue = this.GetCardValue(tagCard);
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			let nextValue = this.GetCardValue(poker);

			if (tagCardValue + 1 == nextValue) {
				nextValueList[nextValueList.length] = poker;
			}
		}
		return nextValueList
	},
	//判断是否有一样的牌值
	CheckSameValueInArr: function (pokers, tagCard) {
		let tagCardValue = this.GetCardValue(tagCard);
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			let pokerValue = this.GetCardValue(poker);
			if (tagCardValue == pokerValue) {
				return true;
			}
		}
		return false;
	},
	//获取同一牌值
	GetSameValue: function (pokers, tagCard) {
		let sameValueList = [];
		let tagCardValue = this.GetCardValue(tagCard);
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			let pokerValue = this.GetCardValue(poker);

			if (tagCardValue == pokerValue) {
				sameValueList[sameValueList.length] = poker;
			}
		}
		return sameValueList
	},
	//获取同一花色
	GetSameColor: function (pokers, tagCard) {
		let sameColorList = [];
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			let pokerColor = this.GetCardColor(poker);
			let tagCardColor = this.GetCardColor(tagCard);
			if (pokerColor == tagCardColor) {
				sameColorList[sameColorList.length] = poker;
			}
		}
		return sameColorList;
	},
	//获取牌值
	GetCardValue: function (poker) {
		let newPoker = this.PokerCard.SubCardValue(poker);
		let color = this.GetCardColor(poker);
		let cardValue = newPoker & this.LOGIC_MASK_VALUE;
		if (64 == color) {
			if (cardValue % 2 == 0) {//小鬼
				return 99;
			} else if (cardValue % 2 == 1) {//单数大鬼
				return 100;
			}
		} else {
			return cardValue;
		}
	},

	//获取花色
	GetCardColor: function (poker) {
		let newPoker = this.PokerCard.SubCardValue(poker);
		return newPoker & this.LOGIC_MASK_COLOR;
	},

	GetSortCards: function (pokers) {
		if (!pokers.length) return;
		let guipai = this.GetGuiPai(pokers);
		let array = [];

		for (let idx = 0; idx < pokers.length; idx++) {
			let poker = pokers[idx];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			let data = {};
			data.cardValue = this.GetCardValue(poker);
			data.cardX16 = poker;
			array.push(data);
		}

		array.sort(function (a, b) {
			return b.cardValue - a.cardValue;
		});

		//鬼牌不进行排序 向前插入
		for (let i = 0; i < guipai.length; i++) {
			let data = {};
			data.cardValue = this.GetCardValue(guipai[i]);
			data.cardX16 = guipai[i];
			array.unshift(data);
		}
		return array;
	},

	CheckSameValue: function (aCards, bCards) {
		let bRet = false;
		for (let i = 0; i < aCards.length; i++) {
			let poker = aCards[i];
			if (bCards.indexOf(poker) != -1) {
				bRet = true;
				break;
			}
		}
		return bRet;
	},

	SortCardByMin: function (pokers) {
		let self = this;
		pokers.sort(function (a, b) {
			//return (a&0x0F) - (b&0x0F);
			return self.GetCardValue(a) - self.GetCardValue(b);
		});
	},
	SortCardByMax: function (pokers) {
		let self = this;
		pokers.sort(function (a, b) {
			//return (b&0x0F) - (a&0x0F);
			return self.GetCardValue(b) - self.GetCardValue(a);
		});
	},
	SortCardArrByMin: function (pokers) {
		let self = this;
		pokers.sort(function (a, b) {
			let aValue = a[0];
			let bValue = b[0];
			return self.GetCardValue(aValue) - self.GetCardValue(bValue);
		});
	},
	SortCardArrByMax: function (pokers) {
		let self = this;
		pokers.sort(function (a, b) {
			let aValue = a[0];
			let bValue = b[0];
			return self.GetCardValue(bValue) - self.GetCardValue(aValue);
		});
	},
	copyArr: function (arr) {
		let res = this.ComTool.DeepCopy(arr);
		return res;
	},
});

var g_GQPLSLogicGame = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_GQPLSLogicGame) {
		g_GQPLSLogicGame = new GQPLSLogicGame();
	}
	return g_GQPLSLogicGame;
};