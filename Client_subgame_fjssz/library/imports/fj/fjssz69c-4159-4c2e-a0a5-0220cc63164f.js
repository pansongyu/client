"use strict";
cc._RF.push(module, 'fjssz69c-4159-4c2e-a0a5-0220cc63164f', 'FJSSZLogicGame');
// script/game/FJSSZ/GameLogic/FJSSZLogicGame.js

"use strict";

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

	Init: function Init() {
		this.JS_Name = app.subGameName + "LogicGame";

		this.ComTool = app[app.subGameName + "_ComTool"]();
		this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
		this.WeChatManager = app[app.subGameName + "_WeChatManager"]();
		this.PokerCard = app[app.subGameName + "_PokerCard"]();
		this.RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
		this.HUA_LEN = 4;

		this.pokerType = [0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, //方块 2-A
		0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, //梅花 2-A
		0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D, 0x2E, //红桃 2-A
		0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E]; //黑桃 2-A

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
			13: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
		};
		console.log("this.guiClearCardDict", this.guiClearCardDict);
	},
	SetSign: function SetSign(sign, num) {
		//1、经典场 2、王牌场 3、特殊王牌场
		this.sign = sign;
		if (this.sign == 2) {
			num = 2;
		} else if (this.sign == 1) {
			num = 0;
		}
		this.SetWangPaiNum(num);
	},
	SetWangPaiNum: function SetWangPaiNum(num) {
		this.wangPaiNum = num;
		this.clearList = this.guiClearCardDict[this.wangPaiNum];
	},
	sortFun: function sortFun(a, b) {
		return a - b;
	},
	CheckCardType: function CheckCardType(cards) {
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
				return this.CARD_TYPE_ZHADAN;
				return this.CARD_TYPE_ZHADAN_CHONGZHA;
			} else if (this.IsShuangWangChongTou(cards)) {
				return this.CARD_TYPE_SANTIAO;
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
			return this.CARD_TYPE_SANTIAO;
			return this.CARD_TYPE_ZHADAN_SHUANGWANGCHONGTOU;
		} else if (this.IsChongZha(cards, true)) {
			return this.CARD_TYPE_ZHADAN;
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
	GetAllCardType: function GetAllCardType(cards) {
		this.lastMaxCardType_1 = []; //纪录上一次最大的牌型
		this.lastMaxCardType_2 = [];
		this.lastMaxCardType_3 = [];
		var allCardType = [];
		for (var i = 0; i < 5; i++) {
			var curCardType = {};
			var curCardList = [];
			var curAllCards = this.copyArr(cards);
			if (this.GetWuGuis(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_WUGUI) && curCardList.length < 2) {
				for (var a = 0; a < 1; a++) {
					var wugui = this.GetWuGuis(curAllCards)[0];
					if (wugui.length == 5) {
						curCardList.push({ cardType: this.CARD_TYPE_WUGUI, cardList: wugui });
						//移除该牌型的牌，再继续获取第二组
						this.RemoveArrFormAll(curAllCards, wugui);
					} else {
						console.log("获取五鬼牌数不足", wugui);
					}
				}
			}
			if (this.GetLiuTongs(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_LIUTONG) && curCardList.length < 2) {
				for (var _a = 0; _a < 1; _a++) {
					var liutong = this.GetLiuTongs(curAllCards)[0];
					if (liutong.length == 5) {
						curCardList.push({ cardType: this.CARD_TYPE_LIUTONG, cardList: liutong });
						//移除该牌型的牌，再继续获取第二组
						this.RemoveArrFormAll(curAllCards, liutong);
					} else {
						console.log("获取六同牌数不足", liutong);
					}
				}
			}
			if (this.GetWuTong(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_WUTONG) && curCardList.length < 2) {
				for (var _a2 = 0; _a2 < 1; _a2++) {
					var wutong = this.GetWuTong(curAllCards)[0];
					if (wutong.length == 4 || wutong.length == 5) {
						curCardList.push({ cardType: this.CARD_TYPE_WUTONG, cardList: wutong });
						//移除该牌型的牌，再继续获取第二组
						this.RemoveArrFormAll(curAllCards, wutong);
					} else {
						console.log("获取五同牌数不足", wutong);
					}
				}
			}
			if (this.GetTongHuaShunEx(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_TONGHUASHUN) && curCardList.length < 2) {
				for (var _a3 = 0; _a3 < 1; _a3++) {
					var tongHuaShun = this.GetTongHuaShunEx(curAllCards)[0];
					if (tongHuaShun.length == 5) {
						curCardList.push({ cardType: this.CARD_TYPE_TONGHUASHUN, cardList: tongHuaShun });
						//移除该牌型的牌，再继续获取第二组
						this.RemoveArrFormAll(curAllCards, tongHuaShun);
					} else {
						console.log("获取同花顺牌数不足", tongHuaShun);
					}
				}
			}
			if (this.GetZhaDan(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_ZHADAN) && curCardList.length < 2) {
				for (var _a4 = 0; _a4 < 1; _a4++) {
					var zhaDan = this.GetZhaDan(curAllCards)[0];
					console.log("获取铁支牌型", zhaDan);
					if (zhaDan.length == 3 || zhaDan.length == 4) {
						curCardList.push({ cardType: this.CARD_TYPE_ZHADAN, cardList: zhaDan });
						//移除该牌型的牌，再继续获取第二组
						this.RemoveArrFormAll(curAllCards, zhaDan);
					} else {
						console.log("获取铁支牌数不足", zhaDan);
					}
				}
			}
			if (this.GetHuluEx(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_HULU) && curCardList.length < 2) {
				for (var _a5 = 0; _a5 < 1; _a5++) {
					var hulu = this.GetHuluEx(curAllCards)[0];
					if (hulu.length == 5) {
						curCardList.push({ cardType: this.CARD_TYPE_HULU, cardList: hulu });
						//移除该牌型的牌，再继续获取第二组
						this.RemoveArrFormAll(curAllCards, hulu);
					} else {
						console.log("获取葫芦牌数不足", hulu);
					}
				}
			}
			if (this.GetTonghua(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_TONGHUA) && curCardList.length < 2) {
				// lastMaxCardType.push(4);
				for (var _a6 = 0; _a6 < 1; _a6++) {
					var tonghua = this.GetTonghua(curAllCards)[0];
					if (tonghua.length == 5) {
						curCardList.push({ cardType: this.CARD_TYPE_TONGHUA, cardList: tonghua });
						//移除该牌型的牌，再继续获取第二组
						this.RemoveArrFormAll(curAllCards, tonghua);
					} else {
						console.log("获取同花牌数不足", tonghua);
					}
				}
			}
			if (this.GetShunzi(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_SHUNZI) && curCardList.length < 2) {
				// lastMaxCardType.push(3);
				for (var _a7 = 0; _a7 < 1; _a7++) {
					var shunzi = this.GetShunzi(curAllCards)[0];
					//如果是同花顺 continue
					if (this.IsTongHuaShun(shunzi)) {
						continue;
					}
					if (shunzi.length == 5) {
						curCardList.push({ cardType: this.CARD_TYPE_SHUNZI, cardList: shunzi });
						//移除该牌型的牌，再继续获取第二组
						this.RemoveArrFormAll(curAllCards, shunzi);
					} else {
						console.log("获取顺子牌数不足", shunzi);
					}
				}
			}
			if (this.GetSanGui(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_ZHADAN_SANGUI)) {
				// lastMaxCardType.push(2);
				for (var _a8 = 0; _a8 < 1; _a8++) {
					var sangui = this.GetSanGui(curAllCards)[0];
					if (sangui.length == 3) {
						curCardList.push({ cardType: this.CARD_TYPE_ZHADAN_SANGUI, cardList: sangui });
						//移除该牌型的牌，再继续获取第二组
						this.RemoveArrFormAll(curAllCards, sangui);
					} else {
						console.log("获取三鬼牌数不足", sangui);
					}
				}
			}
			if (this.GetShuangWangChongTou(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_ZHADAN_SHUANGWANGCHONGTOU)) {
				// lastMaxCardType.push(2);
				for (var _a9 = 0; _a9 < 1; _a9++) {
					var shuangwang = this.GetShuangWangChongTou(curAllCards)[0];
					if (shuangwang.length == 3) {
						curCardList.push({ cardType: this.CARD_TYPE_ZHADAN_SHUANGWANGCHONGTOU, cardList: shuangwang });
						//移除该牌型的牌，再继续获取第二组
						this.RemoveArrFormAll(curAllCards, shuangwang);
					} else {
						console.log("获取双王冲头牌数不足", shuangwang);
					}
				}
			}
			if (this.GetChongZha(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_ZHADAN_CHONGZHA)) {
				// lastMaxCardType.push(2);
				for (var _a10 = 0; _a10 < 1; _a10++) {
					var chongzha = this.GetChongZha(curAllCards)[0];
					if (chongzha.length == 3) {
						curCardList.push({ cardType: this.CARD_TYPE_ZHADAN_CHONGZHA, cardList: chongzha });
						//移除该牌型的牌，再继续获取第二组
						this.RemoveArrFormAll(curAllCards, chongzha);
					} else {
						console.log("获取冲炸牌数不足", chongzha);
					}
				}
			}
			if (this.GetSanTiao(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_SANTIAO)) {
				// lastMaxCardType.push(2);
				for (var _a11 = 0; _a11 < 1; _a11++) {
					var sanTiao = this.GetSanTiao(curAllCards)[0];
					console.log("获取三条牌型", sanTiao);
					curCardList.push({ cardType: this.CARD_TYPE_SANTIAO, cardList: sanTiao });
					//移除该牌型的牌，再继续获取第二组
					this.RemoveArrFormAll(curAllCards, sanTiao);
				}
			}
			if (this.GetLiangDuiEX(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_LIANGDUI) && curCardList.length < 2) {
				// lastMaxCardType.push(1);
				for (var _a12 = 0; _a12 < 1; _a12++) {
					var liangDui = this.GetLiangDuiEX(curAllCards)[0];
					console.log("获取两对牌型", liangDui);
					curCardList.push({ cardType: this.CARD_TYPE_LIANGDUI, cardList: liangDui });
					//移除该牌型的牌，再继续获取第二组
					this.RemoveArrFormAll(curAllCards, liangDui);
				}
			}
			if (this.GetDuiZi(curAllCards).length != 0 && this.CheckUsedCardType(curCardList, this.CARD_TYPE_DUIZI)) {
				// lastMaxCardType.push(0);
				for (var _a13 = 0; _a13 < 1; _a13++) {
					var duiZi = this.GetDuiZi(curAllCards)[0];
					console.log("获取对子牌型", duiZi);
					curCardList.push({ cardType: this.CARD_TYPE_DUIZI, cardList: duiZi });
					//移除该牌型的牌，再继续获取第二组
					this.RemoveArrFormAll(curAllCards, duiZi);
				}
			}
			//针对牌型，把需要带的牌补齐
			if (curAllCards.length > 0) {
				this.SortCardByMin(curAllCards);
				for (var _i = 0; _i < curCardList.length; _i++) {
					var cardType_1 = curCardList[_i].cardType;
					var cardList_1 = curCardList[_i].cardList;
					if (cardType_1 == this.CARD_TYPE_WUTONG) {
						//含2或3的五同需要补一张单排
						if (cardList_1.length == 4) {
							if (curAllCards.length > 0) {
								var wutongbupais = this.GetSingleCardFormArr(curAllCards, 1, curCardList[_i].cardList);
								curCardList[_i].cardList = curCardList[_i].cardList.concat(wutongbupais);
								this.RemoveArrFormAll(curAllCards, wutongbupais);
							} else {
								// console.log("炸弹没有牌可以补");
							}
						}
					}
					if (cardType_1 == this.CARD_TYPE_ZHADAN) {
						//222/333三张为炸弹补两根
						//炸弹需要补一张单排
						if (cardList_1.length == 4) {
							if (curAllCards.length > 0) {
								var zhadanbupais = this.GetSingleCardFormArr(curAllCards, 1, curCardList[_i].cardList);
								curCardList[_i].cardList = curCardList[_i].cardList.concat(zhadanbupais);
								this.RemoveArrFormAll(curAllCards, zhadanbupais);
							} else {
								// console.log("炸弹没有牌可以补");
							}
						}
						//炸弹需要补一张单排
						if (cardList_1.length == 3) {
							if (curAllCards.length > 0) {
								var _zhadanbupais = this.GetSingleCardFormArr(curAllCards, 2, curCardList[_i].cardList);
								curCardList[_i].cardList = curCardList[_i].cardList.concat(_zhadanbupais);
								this.RemoveArrFormAll(curAllCards, _zhadanbupais);
							} else {
								// console.log("炸弹没有牌可以补");
							}
						}
					} else if (cardType_1 == 2 && _i != 2) {
						//三条并且不是放在最后一组的需要补两张单牌,需要判断下不能补对子
						if (curAllCards.length >= 2) {
							var bupais = this.GetSingleCardFormArr(curAllCards, 2, curCardList[_i].cardList);
							curCardList[_i].cardList = curCardList[_i].cardList.concat(bupais);
							this.RemoveArrFormAll(curAllCards, bupais);
						} else {}
					} else if (cardType_1 == 1) {
						//连对需要补一张单牌
						if (curAllCards.length >= 1) {
							var liangduibupais = this.GetSingleCardFormArr(curAllCards, 1, curCardList[_i].cardList);
							curCardList[_i].cardList = curCardList[_i].cardList.concat(liangduibupais);
							this.RemoveArrFormAll(curAllCards, liangduibupais);
						} else {
							// console.log("连对没有牌可以补");
						}
					} else if (cardType_1 == 0 && _i == 2) {
						//对子放在最后一组的需要补一张单牌
						if (curAllCards.length >= 1) {
							var duizibupais = this.GetSingleCardFormArr(curAllCards, 1, curCardList[_i].cardList);
							curCardList[_i].cardList = curCardList[_i].cardList.concat(duizibupais);
							this.RemoveArrFormAll(curAllCards, duizibupais);
						} else {
							// console.log("对子没有牌可以补");
						}
					} else if (cardType_1 == 0 && _i != 2) {
						//对子不是放在最后一组的需要补3张单牌
						if (curAllCards.length >= 3) {
							var bupais_3 = this.GetSingleCardFormArr(curAllCards, 3, curCardList[_i].cardList);
							curCardList[_i].cardList = curCardList[_i].cardList.concat(bupais_3);
							this.RemoveArrFormAll(curAllCards, bupais_3);
						} else {
							// console.log("对子没有牌可以补");
						}
					}
				}
				this.SortCardByMax(curAllCards);
				if (curCardList.length == 1) {
					var cards_1 = this.GetSingleCardFormArr(curAllCards, 5, []);
					curCardList.push({ cardType: this.CARD_TYPE_WULONG, cardList: cards_1 });
					//移除该牌型的牌，再继续获取第二组
					this.RemoveArrFormAll(curAllCards, cards_1);

					var cards_2 = this.GetSingleCardFormArr(curAllCards, 3, []);
					curCardList.push({ cardType: this.CARD_TYPE_WULONG, cardList: cards_2 });
					//移除该牌型的牌，再继续获取第二组
					this.RemoveArrFormAll(curAllCards, cards_2);
				}
				if (curCardList.length == 2) {
					var cards_3 = this.GetSingleCardFormArr(curAllCards, 3, []);
					curCardList.push({ cardType: this.CARD_TYPE_WULONG, cardList: cards_3 });
					//移除该牌型的牌，再继续获取第二组
					this.RemoveArrFormAll(curAllCards, cards_3);
				}
			}
			//判断下后两组是否倒水
			if (curCardList.length == 3 && curAllCards.length == 0 && this.CheckCardBigOrSmall(curCardList[1].cardList, curCardList[2].cardList) == 0 && this.CheckCardBigOrSmall(curCardList[0].cardList, curCardList[1].cardList) == 0) {
				allCardType.push(curCardList);
			}
		}
		return allCardType;
	},

	//从数组中移除另一个数组的中所有值
	RemoveArrFormAll: function RemoveArrFormAll(targetArr, curArr) {
		for (var i = 0; i < curArr.length; i++) {
			var index = targetArr.indexOf(curArr[i]);
			if (index > -1) {
				targetArr.splice(index, 1);
			}
		}
	},

	//从剩余的牌中抽取指定几张单排来补, 并且牌值不能跟concatArr里的牌一样
	GetSingleCardFormArr: function GetSingleCardFormArr(cardArr, cardNum, concatArr) {
		var singleCards = [];
		for (var i = 0; i < cardArr.length; i++) {
			var isInSingleCards = this.CheckSameValueInArr(singleCards, cardArr[i]);
			var isInConcatArr = this.CheckSameValueInArr(concatArr, cardArr[i]);
			if (!isInSingleCards && !isInConcatArr) {
				singleCards.push(cardArr[i]);
				if (singleCards.length == cardNum) return singleCards;
			}
		}
		return singleCards;
	},

	//检测下是否已经用过该牌型
	CheckUsedCardType: function CheckUsedCardType(curCardList, cardType) {
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

	CheckDuiziByGui: function CheckDuiziByGui(pokers, guiList, duizis) {
		var aList = [];
		for (var i = 0; i < pokers.length; i++) {
			if (guiList.indexOf(pokers[i]) != -1) {
				continue;
			}
			if (duizis[0]) {
				if (duizis[0].indexOf(pokers[i]) != -1) {
					continue;
				}
			}
			var obj = {};
			var value = this.GetCardValue(pokers[i]);
			obj.value = value;
			obj.valueX16 = pokers[i];
			aList.push(obj);
		}

		aList.sort(function (a, b) {
			return b.value - a.value;
		});

		if (aList.length && guiList.length) {
			var aDui = [];
			aDui.push(aList[0].valueX16);
			aDui.push(guiList[0]);
			duizis[duizis.length] = aDui;
		}
	},

	//return 0 aCards大 1相反 2一样大
	CheckCardBigOrSmall: function CheckCardBigOrSmall(aCards, bCards) {
		//必须满敦在比  dun1,dun2/ dun2,dun3/ dun1,dun3
		var tempSortAcards = [];
		var tempSortBcards = [];
		for (var i = 0; i < aCards.length; i++) {
			tempSortAcards.push(this.GetCardValue(aCards[i]));
		}
		for (var _i2 = 0; _i2 < bCards.length; _i2++) {
			tempSortBcards.push(this.GetCardValue(bCards[_i2]));
		}

		tempSortAcards.sort(this.sortFun);
		tempSortBcards.sort(this.sortFun);

		var aValue = -1;
		var bValue = -1;
		//先找出不带鬼的对子
		var duiziAs = this.GetNotGuiDuiZis(aCards);
		var duiziBs = this.GetNotGuiDuiZis(bCards);
		//先找出鬼牌
		var guiAs = this.GetGuiPai(aCards);
		var guiBs = this.GetGuiPai(bCards);

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
				for (var _i3 = 0; _i3 < aCards.length; _i3++) {
					if (guiAs.indexOf(aCards[_i3]) != -1) {
						continue;
					}
					aValue = this.GetCardValue(aCards[_i3]);
					break;
				}
				for (var _i4 = 0; _i4 < bCards.length; _i4++) {
					if (guiBs.indexOf(bCards[_i4]) != -1) {
						continue;
					}
					bValue = this.GetCardValue(bCards[_i4]);
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
				for (var _i5 = 0; _i5 < aCards.length; _i5++) {
					if (guiAs.indexOf(aCards[_i5]) != -1) {
						continue;
					}
					aValue = this.GetCardValue(aCards[_i5]);
					break;
				}
				for (var _i6 = 0; _i6 < bCards.length; _i6++) {
					if (guiBs.indexOf(bCards[_i6]) != -1) {
						continue;
					}
					bValue = this.GetCardValue(bCards[_i6]);
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
				var aList = [];
				var bList = [];

				for (var _i7 = 0; _i7 < aCards.length; _i7++) {
					if (guiAs.indexOf(aCards[_i7]) != -1) {
						continue;
					}
					var value = this.GetCardValue(aCards[_i7]);
					aList.push(value);
				}

				for (var _i8 = 0; _i8 < bCards.length; _i8++) {
					if (guiBs.indexOf(bCards[_i8]) != -1) {
						continue;
					}
					var _value = this.GetCardValue(bCards[_i8]);
					bList.push(_value);
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
				} else {
					//要判断下A
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
				var _aValue = this.GetValueByZhaDan(aCards);
				var _bValue = this.GetValueByZhaDan(bCards);

				if (_aValue > _bValue) {
					return 0;
				} else if (_aValue < _bValue) {
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
		} else if (this.GetZhaDan(bCards).length != 0) {
			//
			var aCards1 = aCards.slice();
			var bCards1 = bCards.slice();
			if (this.IsChongZha(aCards1) && this.IsChongZha(bCards1)) {
				//如果中墩有冲炸牌型
				var a = aCards1.length == 3 ? this.IsSanChongZha(aCards1) : this.GetZhaDan(aCards1).length;
				var b = bCards1.length == 3 ? this.IsSanChongZha(bCards1) : this.GetZhaDan(bCards1).length;
				if (a > b && this.GetCardValue(aCards1[2]) > this.GetCardValue(bCards1[2])) {
					//头墩是3冲炸的时候中墩三墩不能为222炸弹
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
					var _aList = [];
					var _bList = [];
					for (var _i9 = 0; _i9 < aCards.length; _i9++) {
						if (guiAs.indexOf(aCards[_i9]) != -1) {
							continue;
						}
						var _value2 = this.GetCardValue(aCards[_i9]);
						_aList.push(_value2);
					}
					for (var _i10 = 0; _i10 < bCards.length; _i10++) {
						if (guiBs.indexOf(bCards[_i10]) != -1) {
							continue;
						}
						var _value3 = this.GetCardValue(bCards[_i10]);
						_bList.push(_value3);
					}

					_aList.sort(this.sortCardValue);
					_bList.sort(this.sortCardValue);

					aValue = this.GetCardValue(_aList[0]);
					bValue = this.GetCardValue(_bList[0]);

					if (aValue > bValue) {
						return 0;
					} else if (aValue < bValue) {
						return 1;
					} else {
						return 2;
					}
				} else if (!guiAs.length && guiBs.length) {
					var _bList2 = [];
					var tempASantiao = this.GetSanTiaoEx(aCards, false);
					for (var _i11 = 0; _i11 < bCards.length; _i11++) {
						if (guiBs.indexOf(bCards[_i11]) != -1) {
							continue;
						}
						var _value4 = this.GetCardValue(bCards[_i11]);
						_bList2.push(_value4);
					}

					_bList2.sort(this.sortCardValue);

					aValue = this.GetCardValue(tempASantiao[0][0]);
					bValue = this.GetCardValue(_bList2[0]);
					if (aValue > bValue) {
						return 0;
					} else if (aValue < bValue) {
						return 1;
					} else {
						return 0;
					}
				} else if (guiAs.length && !guiBs.length) {
					var _aList2 = [];
					var tempBSantiao = this.GetSanTiaoEx(bCards, false);
					for (var _i12 = 0; _i12 < aCards.length; _i12++) {
						if (guiAs.indexOf(aCards[_i12]) != -1) {
							continue;
						}
						var _value5 = this.GetCardValue(aCards[_i12]);
						_aList2.push(_value5);
					}

					_aList2.sort(this.sortCardValue);

					aValue = this.GetCardValue(_aList2[0]);
					bValue = this.GetCardValue(tempBSantiao[0][0]);

					if (aValue > bValue) {
						return 0;
					} else if (aValue < bValue) {
						return 1;
					} else {
						return 1;
					}
				} else if (!guiAs.length && !guiBs.length) {
					var _tempASantiao = this.GetNotGuiSanTiaos(aCards);
					var _tempBSantiao = this.GetNotGuiSanTiaos(bCards);
					aValue = this.GetCardValue(_tempASantiao[0][0]);
					bValue = this.GetCardValue(_tempBSantiao[0][0]);
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
				var _aList3 = [];
				var _bList3 = [];

				for (var _i13 = 0; _i13 < aCards.length; _i13++) {
					if (guiAs.indexOf(aCards[_i13]) != -1) {
						continue;
					}
					var _value6 = this.GetCardValue(aCards[_i13]);
					_aList3.push(_value6);
				}

				for (var _i14 = 0; _i14 < bCards.length; _i14++) {
					if (guiBs.indexOf(bCards[_i14]) != -1) {
						continue;
					}
					var _value7 = this.GetCardValue(bCards[_i14]);
					_bList3.push(_value7);
				}

				_aList3.sort(this.sortCardValue);
				_bList3.sort(this.sortCardValue);

				var tempAList = [];
				var tempBList = [];

				for (var _i15 in _aList3) {
					if (tempAList.indexOf(_aList3[_i15]) == -1) {
						tempAList.push(_aList3[_i15]);
					}
				}

				for (var _i16 in _bList3) {
					if (tempBList.indexOf(_bList3[_i16]) == -1) {
						tempBList.push(_bList3[_i16]);
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
				var tempA = -1;
				var tempB = -1;
				var duiAList = this.GetDuiZi(aCards);
				var duiBList = this.GetDuiZi(bCards);

				var _tempAList = [];
				var _tempBList = [];

				if (duiAList.length) {
					tempA = this.GetCardValue(duiAList[0][0]);
				}
				if (duiBList.length) {
					tempB = this.GetCardValue(duiBList[0][0]);
				}

				if (tempA == -1) {
					for (var _i17 = 0; _i17 < aCards.length; _i17++) {
						if (guiAs.indexOf(aCards[_i17]) != -1) {
							continue;
						}
						var _value8 = this.GetCardValue(aCards[_i17]);
						_tempAList.push(_value8);
					}
					_tempAList.sort(this.sortCardValue);
					tempA = _tempAList[0];
				}

				if (tempB == -1) {
					for (var _i18 = 0; _i18 < bCards.length; _i18++) {
						if (guiBs.indexOf(bCards[_i18]) != -1) {
							continue;
						}
						var _value9 = this.GetCardValue(bCards[_i18]);
						_tempBList.push(_value9);
					}
					_tempBList.sort(this.sortCardValue);
					tempB = _tempBList[0];
				}

				if (tempA > tempB) {
					return 0;
				} else if (tempA < tempB) {
					return 1;
				} else {
					//AB數組衹有三個元素
					var duiA = [];
					var duiB = [];
					for (var _i19 = 0; _i19 < aCards.length; _i19++) {
						if (guiAs.indexOf(aCards[_i19]) != -1) {
							continue;
						}
						var _value10 = this.GetCardValue(aCards[_i19]);
						if (tempA == _value10) continue;
						duiA.push(_value10);
					}
					duiA.sort(this.sortCardValue);
					for (var _i20 = 0; _i20 < bCards.length; _i20++) {
						if (guiAs.indexOf(bCards[_i20]) != -1) {
							continue;
						}
						var _value11 = this.GetCardValue(bCards[_i20]);
						if (tempB == _value11) {
							continue;
						}
						duiB.push(_value11);
					}
					duiB.sort(this.sortCardValue);

					for (var _i21 = 0; _i21 < duiA.length; _i21++) {
						aValue = duiA[_i21];
						bValue = duiB[_i21];
						if (aValue > bValue) {
							return 0;
						} else if (aValue < bValue) {
							return 1;
						} else {
							if (_i21 == duiA.length - 1) {
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
		} else if (this.GetYiDuiTongHua(bCards).length != 0) return 1;

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
					var forLength = 0;
					if (tempSortAcards.length == tempSortBcards.length) {
						forLength = tempSortAcards.length;
					} else {
						forLength = tempSortAcards.length > tempSortBcards.length ? tempSortBcards.length : tempSortAcards.length;
					}
					for (var j = forLength; j > 0; j--) {
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
			if (this.CheckCardType(bCards) > 3) return 1;else if (this.CheckCardType(bCards) == 3) {
				var _aList4 = [];
				var _bList4 = [];

				for (var _i22 = 0; _i22 < aCards.length; _i22++) {
					if (guiAs.indexOf(aCards[_i22]) != -1) {
						continue;
					}
					var _value12 = this.GetCardValue(aCards[_i22]);
					_aList4.push(_value12);
				}

				for (var _i23 = 0; _i23 < bCards.length; _i23++) {
					if (guiBs.indexOf(bCards[_i23]) != -1) {
						continue;
					}
					var _value13 = this.GetCardValue(bCards[_i23]);
					_bList4.push(_value13);
				}

				_aList4.sort(this.sortFun);
				_bList4.sort(this.sortFun);

				tempSortAcards = this.GetCompleteShun(_aList4);
				tempSortBcards = this.GetCompleteShun(_bList4);

				aValue = tempSortAcards[tempSortAcards.length - 1];
				bValue = tempSortBcards[tempSortBcards.length - 1];
				if (aValue > bValue) {
					return 0;
				} else if (aValue < bValue) {
					return 1;
				} else {
					//要判断下A
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
		if (this.CheckTouDunByGui(aCards) > this.CARD_TYPE_SANTIAO) {
			//比三条大
			if (this.CheckCardType(bCards) >= this.CARD_TYPE_SHUNZI) {
				//大于等于顺子
				return 1;
			} else {
				return 0;
			}
		}
		////////////////////三条
		if (this.GetSanTiaoEx(aCards).length != 0) {
			if (this.CheckCardType(bCards) > 2) {
				return 1;
			} else if (this.CheckCardType(bCards) == 2) {
				if (guiAs.length && guiBs.length) {
					var tempADuizi = this.GetDuiZi(aCards, false);
					var tempBDuizi = this.GetDuiZi(bCards, false);
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
					var santiaoA = this.GetSanTiaoEx(aCards, false);
					aValue = this.GetCardValue(santiaoA[0]);

					if (guiBs.length == 1) {
						var duiizs = this.GetDuiZi(bCards, false);
						bValue = this.GetCardValue(duiizs[0][0]);
					} else if (guiBs.length == 2) {
						var _bList5 = [];
						for (var _i24 = 0; _i24 < bCards.length; _i24++) {
							if (guiBs.indexOf(bCards[_i24]) != -1) {
								continue;
							}
							_bList5.push(bCards[_i24]);
						}
						_bList5.sort(this.sortCardValue);
						bValue = this.GetCardValue(_bList5[0]);
					}

					if (aValue > bValue) {
						return 0;
					} else if (aValue < bValue) {
						return 1;
					} else {
						return 0;
					}
				} else if (guiAs.length && !guiBs.length) {
					var santiaoB = this.GetSanTiaoEx(bCards, false);
					bValue = this.GetCardValue(santiaoB[0]);

					if (guiAs.length == 1) {
						var _duiizs = this.GetDuiZi(aCards);
						aValue = this.GetCardValue(_duiizs[0][0]);
					} else if (guiAs.length == 2) {
						var _aList5 = [];
						for (var _i25 = 0; _i25 < aCards.length; _i25++) {
							if (guiAs.indexOf(aCards[_i25]) != -1) {
								continue;
							}
							_aList5.push(aCards[_i25]);
						}
						_aList5.sort(this.sortCardValue);
						aValue = this.GetCardValue(_aList5[0]);
					}

					if (aValue > bValue) {
						return 0;
					} else if (aValue < bValue) {
						return 1;
					} else {
						return 1;
					}
				} else if (!guiAs.length && !guiBs.length) {
					var _santiaoA = this.GetSanTiaoEx(aCards, false);
					var _santiaoB = this.GetSanTiaoEx(bCards, false);
					aValue = this.GetCardValue(_santiaoA[0]);
					bValue = this.GetCardValue(_santiaoB[0]);
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
		if (guiAs.length && !duiziAs.length) {
			//
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
				var tempSortDuiZiA = [];
				var tempSortDuiZiB = [];
				tempSortDuiZiA[0] = this.GetCardValue(duiziAs[0][0]);
				tempSortDuiZiA[1] = this.GetCardValue(duiziAs[1][0]);
				tempSortDuiZiB[0] = this.GetCardValue(duiziBs[0][0]);
				tempSortDuiZiB[1] = this.GetCardValue(duiziBs[1][0]);
				tempSortDuiZiA.sort(this.sortFun);
				tempSortDuiZiB.sort(this.sortFun);
				aValue = tempSortDuiZiA[0];
				bValue = tempSortDuiZiB[0];
				var aValueEx = tempSortDuiZiA[1];
				var bValueEx = tempSortDuiZiB[1];
				if (aValue == bValue && aValueEx == bValueEx) {
					//相同的两对
					var remainCardA = -1;
					var remainCardB = -1;
					for (var _i26 = 0; _i26 < 5; _i26++) {
						if (this.GetCardValue(aCards[_i26]) != tempSortDuiZiA[0] && this.GetCardValue(aCards[_i26]) != tempSortDuiZiA[1]) remainCardA = this.GetCardValue(aCards[_i26]);
						if (this.GetCardValue(bCards[_i26]) != tempSortDuiZiB[0] && this.GetCardValue(bCards[_i26]) != tempSortDuiZiB[1]) remainCardB = this.GetCardValue(bCards[_i26]);
					}
					if (remainCardA > remainCardB) {
						return 0;
					} else {
						return 1;
					}
				}
				if (aValueEx > bValueEx) {
					//取最大
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
				var _tempA = -1;
				var _tempB = -1;
				var _duiAList = this.GetDuiZi(aCards);
				var _duiBList = this.GetDuiZi(bCards);

				var _tempAList2 = [];
				var _tempBList2 = [];

				if (_duiAList.length) {
					_tempA = this.GetCardValue(_duiAList[0][0]);
				}
				if (_duiBList.length) {
					_tempB = this.GetCardValue(_duiBList[0][0]);
				}

				if (_tempA == -1) {
					for (var _i27 = 0; _i27 < aCards.length; _i27++) {
						if (guiAs.indexOf(aCards[_i27]) != -1) {
							continue;
						}
						var _value14 = this.GetCardValue(aCards[_i27]);
						_tempAList2.push(_value14);
					}
					_tempAList2.sort(this.sortCardValue);
					_tempA = _tempAList2[0];
				}

				if (_tempB == -1) {
					for (var _i28 = 0; _i28 < bCards.length; _i28++) {
						if (guiBs.indexOf(bCards[_i28]) != -1) {
							continue;
						}
						var _value15 = this.GetCardValue(bCards[_i28]);
						_tempBList2.push(_value15);
					}
					_tempBList2.sort(this.sortCardValue);
					_tempB = _tempBList2[0];
				}

				if (_tempA > _tempB) {
					return 0;
				} else if (_tempA < _tempB) {
					return 1;
				} else {
					//AB數組衹有三個元素或者一個元素
					var _duiA = [];
					var _duiB = [];
					for (var _i29 = 0; _i29 < aCards.length; _i29++) {
						if (guiAs.indexOf(aCards[_i29]) != -1) {
							continue;
						}
						var _value16 = this.GetCardValue(aCards[_i29]);
						if (_tempA == _value16) {
							continue;
						}
						_duiA.push(_value16);
					}
					_duiA.sort(this.sortCardValue);
					for (var _i30 = 0; _i30 < bCards.length; _i30++) {
						if (guiAs.indexOf(bCards[_i30]) != -1) {
							continue;
						}
						var _value17 = this.GetCardValue(bCards[_i30]);
						if (_tempB == _value17) {
							continue;
						}
						_duiB.push(_value17);
					}
					_duiB.sort(this.sortCardValue);

					if (_duiA.length == 1) {
						aValue = _duiA[0];
						bValue = _duiB[0];
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
						for (var _i31 = 0; _i31 < _duiA.length; _i31++) {
							aValue = _duiA[_i31];
							bValue = _duiB[_i31];
							if (aValue > bValue) {
								return 0;
							} else if (aValue < bValue) {
								return 1;
							} else {
								if (_i31 == _duiA.length - 1) {
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
			} else return 0;
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
				var lastIndexA = tempSortAcards.length - 1;
				var lastIndexB = tempSortBcards.length - 1;
				for (var _j = 5; _j > 0; _j--) {
					if (lastIndexA < 0 || lastIndexB < 0) {
						//如果3张或5张比下来都没结果就是相同大
						return 2;
					}
					aValue = tempSortAcards[lastIndexA];
					bValue = tempSortBcards[lastIndexB];
					if (aValue > bValue) {
						return 0;
					} else if (aValue < bValue) {
						return 1;
					} else {
						if (0 == _j) {
							return 2;
						}
					}
					lastIndexA--;
					lastIndexB--;
				}
			}
		}
	},
	GetValueByZhaDan: function GetValueByZhaDan(cards) {
		var value = -1;
		var guiPai = this.GetGuiPai(cards);
		var wangPai = [];
		var wp = [];
		var duiPai = [];
		cards = cards.slice();
		var clearList = this.guiClearCardDict[this.wangPaiNum];
		cards.sort(this.sortCardValue);
		for (var i = 0; i < cards.length; i++) {
			var poker = cards[i];
			var cardValue = this.GetCardValue(poker);
			var cardColor = this.GetCardColor(poker);
			if (clearList.indexOf(cardValue) > -1) {
				if (!wp[cardValue]) wp[cardValue] = [];
				wp[cardValue].push(poker);
			} else {
				var duizis = [];
				var duizi = this.GetSameValue(cards, poker);
				var bInList = this.CheckPokerInList(duizis, poker);
				if (duizi.length >= 2 && !bInList) {
					duiPai = [].concat(duizi);
				}
			}
		}
		if (wp.length > 0) {
			wp.sort(function (a, b) {
				return b.length - a.length;
			});
			wangPai = wp[0];
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
	sortCardValue: function sortCardValue(a, b) {
		return b - a;
	},
	SortBySize: function SortBySize(pokers) {
		var _this = this;

		if (this.sortSize == 0) {
			this.sortSize = 1;
			pokers.sort(function (a, b) {
				return _this.GetCardValue(a) - _this.GetCardValue(b);
			});
		} else if (this.sortSize == 1) {
			this.sortSize = 0;
			pokers.sort(function (a, b) {
				return _this.GetCardValue(b) - _this.GetCardValue(a);
			});
		}
	},
	SortByColor: function SortByColor(pokers) {
		var GuiPai = [];
		var NewPai = [];
		var _t = this;
		for (var i = 0; i < pokers.length; i++) {
			var cardColor = this.GetCardColor(pokers[i]);
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
		var Sortpokers = [];
		for (var _i32 = 0; _i32 < GuiPai.length; _i32++) {
			Sortpokers.push(GuiPai[_i32]);
		}
		if (this.sortColor == 0) {
			this.sortColor = 1;
			NewPai.sort(function (a, b) {
				var aColor = _t.GetCardColor(a);
				var bColor = _t.GetCardColor(b);
				return aColor - bColor;
			});
			for (var _i33 = 0; _i33 < NewPai.length; _i33++) {
				Sortpokers.push(NewPai[_i33]);
			}
			return Sortpokers;
		}
		if (this.sortColor == 1) {
			this.sortColor = 0;
			NewPai.sort(function (a, b) {
				var aColor = _t.GetCardColor(a);
				var bColor = _t.GetCardColor(b);
				return bColor - aColor;
			});
			for (var _i34 = 0; _i34 < NewPai.length; _i34++) {
				Sortpokers.push(NewPai[_i34]);
			}
			return Sortpokers;
		}
	},

	GetCompleteShun: function GetCompleteShun(list) {
		var OverFive = false;
		for (var i = 0; i < list.length; i++) {
			if (list[i] == 14) {
				continue;
			}
			if (list[i] > 5) {
				OverFive = true;
			}
		}

		if (OverFive) {
			for (var _i35 = 0; _i35 < list.length - 1; _i35++) {
				var _len = list[_i35 + 1] - list[_i35];
				for (var j = 1; j < _len; j++) {
					list.push(list[_i35] + j);
				}
			}

			list.sort(this.sortFun); //从小到大排序
			var value = list[list.length - 1];
			var addValue = 1;
			var len = list.length;

			for (var _i36 = 1; _i36 <= 5 - len; _i36++) {
				if (value == 14) {
					value = list[0];
					addValue = -1;
				}
				value = value + addValue;
				list.push(value);
			}
			list.sort(this.sortFun); //从小到大排序从小到大排序
		} else {
			list = [2, 3, 4, 5, 14];
		}
		return list;
	},

	GetGuiPai: function GetGuiPai(pokers) {
		var guipai = [];
		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			var color = this.GetCardColor(poker);
			if (color == 64) {
				guipai.push(poker);
			}
		}
		return guipai;
	},
	GetErPais: function GetErPais(pokers, pnum) {
		var erList = [];
		var guipai = this.GetGuiPai(pokers);
		var clearList = this.guiClearCardDict[this.wangPaiNum];
		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			if (this.wangPaiNum == 2 || this.sign == 2) {
				if (pnum == 2) {
					var duizi = this.GetSameValue(pokers, poker);
					var bInList = this.CheckPokerInList(erList, poker);

					var sanValue = this.GetCardValue(duizi[0]);
					if (sanValue == 2 && duizi.length >= 2 && !bInList) {
						this.PokerCombination(2, duizi, erList);
					}
				} else if (pnum == 3) {
					var santiao = this.GetSameValue(pokers, poker);
					var _bInList = this.CheckPokerInList(erList, poker);

					var _sanValue = this.GetCardValue(santiao[0]);
					if (_sanValue == 2 && santiao.length >= 3 && !_bInList) {
						this.PokerCombination(3, santiao, erList);
					}
				}
			} else if (this.wangPaiNum > 2) {
				if (pnum == 2) {
					var _duizi = this.GetSameValue(pokers, poker);
					var _bInList2 = this.CheckPokerInList(erList, poker);

					var _sanValue2 = this.GetCardValue(_duizi[0]);
					if (clearList.indexOf(_sanValue2) > -1) {
						if (_duizi.length >= 2 && !_bInList2) {
							this.PokerCombination(2, _duizi, erList);
						}
					}
				} else if (pnum == 3) {
					var _santiao = this.GetSameValue(pokers, poker);
					var _bInList3 = this.CheckPokerInList(erList, poker);

					var _sanValue3 = this.GetCardValue(_santiao[0]);
					if (clearList.indexOf(_sanValue3) > -1) {
						if (_santiao.length >= 3 && !_bInList3) {
							this.PokerCombination(3, _santiao, erList);
						}
					}
				}
			}
		}
		return erList;
	},
	GetSanPais: function GetSanPais(pokers, pnum) {
		var sanList = [];
		var guipai = this.GetGuiPai(pokers);
		var clearList = this.guiClearCardDict[this.wangPaiNum];
		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			if (this.wangPaiNum == 2 || this.sign == 2) {
				if (pnum == 2) {
					var duizi = this.GetSameValue(pokers, poker);
					var bInList = this.CheckPokerInList(sanList, poker);

					var sanValue = this.GetCardValue(duizi[0]);
					if (sanValue == 3 && duizi.length >= 2 && !bInList) {
						this.PokerCombination(2, duizi, sanList);
					}
				} else if (pnum == 3) {
					var santiao = this.GetSameValue(pokers, poker);
					var _bInList4 = this.CheckPokerInList(sanList, poker);

					var _sanValue4 = this.GetCardValue(santiao[0]);
					if (_sanValue4 == 3 && santiao.length >= 3 && !_bInList4) {
						this.PokerCombination(3, santiao, sanList);
					}
				}
			} else if (this.wangPaiNum > 2) {
				if (pnum == 2) {
					var _duizi2 = this.GetSameValue(pokers, poker);
					var _bInList5 = this.CheckPokerInList(sanList, poker);

					var _sanValue5 = this.GetCardValue(_duizi2[0]);
					if (clearList.indexOf(_sanValue5) > -1) {
						if (_duizi2.length >= 2 && !_bInList5) {
							this.PokerCombination(2, _duizi2, sanList);
						}
					}
				} else if (pnum == 3) {
					var _santiao2 = this.GetSameValue(pokers, poker);
					var _bInList6 = this.CheckPokerInList(sanList, poker);

					var _sanValue6 = this.GetCardValue(_santiao2[0]);
					if (clearList.indexOf(_sanValue6) > -1) {
						if (_santiao2.length >= 3 && !_bInList6) {
							this.PokerCombination(3, _santiao2, sanList);
						}
					}
				}
			}
		}
		return sanList;
	},
	GetClearPais: function GetClearPais(pokers, pnum) {
		var sanList = [];
		var guipai = this.GetGuiPai(pokers);
		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}

			if (pnum == 4) {
				var zhadan = this.GetSameValue(pokers, poker);
				var bInList = this.CheckPokerInList(sanList, poker);

				var sanValue = this.GetCardValue(zhadan[0]);
				if (this.wangPaiNum == 2 || this.sign == 2) {
					if (sanValue == 3 && zhadan.length >= 4 && !bInList) {
						this.PokerCombination(4, zhadan, sanList);
					}
				} else if (this.wangPaiNum > 2) {
					var clearList = this.guiClearCardDict[this.wangPaiNum];
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
	GetNotGuiOneCards: function GetNotGuiOneCards(pokers) {
		var OneCards = [];
		var guipai = this.GetGuiPai(pokers);
		var clearList = this.guiClearCardDict[this.wangPaiNum];
		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			if ((this.wangPaiNum == 2 || this.sign == 2) && guipai.length > 0) {
				//特殊王牌场不止2跟三
				var cardValue = this.GetCardValue(poker);
				if (cardValue == 2 || cardValue == 3) {
					continue;
				}
			} else if (this.wangPaiNum > 2) {
				var _cardValue = this.GetCardValue(poker);
				if (clearList.indexOf(_cardValue) > -1) {
					continue;
				}
			}

			var oneCard = this.GetSameValue(pokers, poker);
			var bInList = this.CheckPokerInList(OneCards, poker);
			if (oneCard.length >= 1 && !bInList) {
				OneCards.push(oneCard);
			}
		}
		return OneCards;
	},
	//获取没有鬼牌的对子
	GetNotGuiDuiZis: function GetNotGuiDuiZis(pokers) {
		var duizis = [];
		var guipai = this.GetGuiPai(pokers);
		var clearList = this.guiClearCardDict[this.wangPaiNum];
		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}

			if (guipai.length > 0) {
				var cardValue = this.GetCardValue(poker);
				if (clearList.indexOf(cardValue) > -1) {
					continue;
				}
			}
			var duizi = this.GetSameValue(pokers, poker);
			var bInList = this.CheckPokerInList(duizis, poker);
			if (duizi.length >= 2 && !bInList) {
				this.PokerCombination(2, duizi, duizis);
			}
		}
		return duizis;
	},
	//获取没有鬼牌的三条
	GetNotGuiSanTiaos: function GetNotGuiSanTiaos(pokers) {
		var guipai = this.GetGuiPai(pokers);
		var santiaos = [];
		var clearList = this.guiClearCardDict[this.wangPaiNum];
		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			var cardValue = this.GetCardValue(poker);
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			if (clearList.indexOf(cardValue) > -1) {
				continue;
			}
			var santiao = this.GetSameValue(pokers, poker);
			var bInList = this.CheckPokerInList(santiaos, poker);

			if (santiao.length >= 3 && !bInList) {
				this.PokerCombination(3, santiao, santiaos);
			}
		}
		return santiaos;
	},
	//获取没有鬼牌的四张相同的牌
	GetNotGuiSiZhangs: function GetNotGuiSiZhangs(pokers) {
		var guipai = this.GetGuiPai(pokers);
		var siZhangs = [];
		var clearList = this.guiClearCardDict[this.wangPaiNum];
		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			// if (this.sign >= 2) {
			if ((this.wangPaiNum == 2 || this.sign == 2) && guipai.length > 0) {
				//特殊王牌场不止2跟三
				var cardValue = this.GetCardValue(poker);
				if (cardValue == 2 || cardValue == 3) {
					continue;
				}
			} else if (this.wangPaiNum > 2) {
				var _cardValue2 = this.GetCardValue(poker);
				if (clearList.indexOf(_cardValue2) > -1) {
					continue;
				}
			}
			var siZhang = this.GetSameValue(pokers, poker);
			var bInList = this.CheckPokerInList(siZhangs, poker);
			if (siZhang.length == 4 && !bInList) {
				this.PokerCombination(4, siZhang, siZhangs);
			}
		}
		return siZhangs;
	},
	//服务端发过来 三同花 (三墩都是同花) 三顺子 六对半 一条龙 清龙 四套三条 三分天下 三同花顺 六同 七同 八同
	SanTongHua: function SanTongHua(pokers) {
		var gui = this.GetGuiPai(pokers);
		var tonghuas = [];
		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			if (gui.indexOf(poker) != -1) {
				continue;
			}
			var tonghua = this.GetSameColor(pokers, poker);
			var bInList = this.CheckPokerInList(tonghuas, poker);
			if (tonghua.length >= 5 && !bInList) {
				tonghuas[tonghuas.length] = tonghua;
			} else if (tonghua.length < 5 && !bInList) {
				tonghuas[tonghuas.length] = tonghua;
			}
		}
		tonghuas.sort(function (a, b) {
			return a.length - b.length;
		});
		var JoinGuiPia = function JoinGuiPia(tonghua, gui, len) {
			if (tonghua.length == len) {
				return;
			}
			for (var _i37 = 0; _i37 < gui.length; _i37++) {
				if (gui[_i37] == 'undefined') {
					continue;
				}
				tonghua.push(gui[_i37]);
				gui[_i37] = 'undefined';
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

	PokerCombination: function PokerCombination(index, list, lists) {
		var rs = [];
		if (index == 2) {
			for (var j = 0; j < list.length; j++) {
				for (var k = j; k < list.length; k++) {
					var map = {};
					map.key = list[j];
					if (k != j) {
						map.value = list[k];
						rs.push(map);
					}
				}
			}
		} else if (index == 3) {
			for (var _j2 = 0; _j2 < list.length; _j2++) {
				for (var _k = _j2; _k < list.length; _k++) {
					var _map = {};
					_map.key = list[_j2];
					if (_k != _j2 && list[_k + 1]) {
						_map.value = list[_k];
						_map.x = list[_k + 1];
						rs.push(_map);
					}
				}
			}
		} else if (index == 4) {
			for (var _j3 = 0; _j3 < list.length; _j3++) {
				for (var _k2 = _j3; _k2 < list.length; _k2++) {
					var _map2 = {};
					_map2.key = list[_j3];
					if (_k2 != _j3 && list[_k2 + 2]) {
						_map2.value = list[_k2];
						_map2.x = list[_k2 + 1];
						_map2.x1 = list[_k2 + 2];
						rs.push(_map2);
					}
				}
			}
		} else if (index == 5) {
			for (var _j4 = 0; _j4 < list.length; _j4++) {
				for (var _k3 = _j4; _k3 < list.length; _k3++) {
					var _map3 = {};
					_map3.key = list[_j4];
					if (_k3 != _j4 && list[_k3 + 3]) {
						_map3.value = list[_k3];
						_map3.x = list[_k3 + 1];
						_map3.x1 = list[_k3 + 2];
						_map3.x2 = list[_k3 + 3];
						rs.push(_map3);
					}
				}
			}
		}

		//将组合好的牌型放入lists
		for (var idx = 0; idx < rs.length; idx++) {
			var data = rs[idx];
			var temp = [];
			for (var i in data) {
				temp.push(data[i]);
			}
			lists[lists.length] = temp;
		}
	},
	IsShowDuiZiBtn: function IsShowDuiZiBtn(pokers) {
		var isShowBtn = false;
		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			var duizis = [];
			var duizi = this.GetSameValue(pokers, poker);
			var bInList = this.CheckPokerInList(duizis, poker);
			if (duizi.length >= 2 && !bInList) {
				isShowBtn = true;
				break;
			}
		}
		return isShowBtn;
	},

	//获取对子 两张相同数字的牌 单纯的对子，不能有鬼牌，给两对按钮使用
	GetAllDuiZi: function GetAllDuiZi(pokers) {
		var guipai = this.GetGuiPai(pokers);
		var duizis = [];

		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			var duizi = this.GetSameValue(pokers, poker);
			var bInList = this.CheckPokerInList(duizis, poker);
			if (duizi.length >= 2 && !bInList) {
				this.PokerCombination(2, duizi, duizis);
			}
		}
		return duizis;
	},
	//获取三条 三张相同数字的牌 单纯的三条，不能有鬼牌，给显示三条按钮使用
	GetAllSantiao: function GetAllSantiao(pokers) {
		var santiaos = [];
		var guipai = this.GetGuiPai(pokers);
		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			var santiao = this.GetSameValue(pokers, poker);
			var bInList = this.CheckPokerInList(santiaos, poker);
			if (santiao.length >= 3 && !bInList) {
				this.PokerCombination(3, santiao, santiaos);
			}
		}
		return santiaos;
	},
	//获取对子 两张相同数字的牌
	GetDuiZi: function GetDuiZi(pokers) {
		var guipai = this.GetGuiPai(pokers);
		var duizis = [];
		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			if (guipai.indexOf(poker) > -1) {
				continue;
			}
			var duizi = this.GetSameValue(pokers, poker);
			var bInList = this.CheckPokerInList(duizis, poker);
			if (duizi.length >= 2 && !bInList) {
				this.PokerCombination(2, duizi, duizis);
			}
			for (var j = 0; j < guipai.length; j++) {
				var gui = guipai[j];
				var dui = [];
				dui.push(poker);
				dui.push(gui);
				this.PokerCombination(2, dui, duizis);
			}
		}
		return duizis;
	},
	//判断是否有两对
	GetLiangDui: function GetLiangDui(pokers) {
		if (this.sign < 2) {
			var noGuiDuiZis = this.GetDuiZi(pokers);
			if (noGuiDuiZis.length >= 2) {
				//没有鬼牌的时候
				return pokers;
			}
		} else {
			//玩法中带鬼牌
			var allDuiZis = this.GetAllDuiZi(pokers);
			if (allDuiZis.length >= 2) {
				//没有鬼牌的时候
				return pokers;
			}
		}
		return [];
	},
	//两对 五张牌由两组两张数字相同的牌组成
	GetLiangDuiEX: function GetLiangDuiEX(pokers) {
		//如果有鬼组不成两对
		var liangduis = [];
		var noGuiDuiZis = this.GetAllDuiZi(pokers);
		if (noGuiDuiZis.length >= 2) {
			//没有鬼牌的时候
			for (var i = 0; i < noGuiDuiZis.length; i++) {
				var firstDui = noGuiDuiZis[i];
				var secondDui = [];
				for (var j = 1; j < noGuiDuiZis.length; j++) {
					secondDui = noGuiDuiZis[j];
					var bRet = this.CheckSameValue(firstDui, secondDui);
					if (!bRet) {
						var liangdui = firstDui.concat(secondDui);
						liangduis.push(liangdui);
					}
				}
			}
		}
		return liangduis;
	},
	IsShowSanTiaoBtn: function IsShowSanTiaoBtn(pokers) {
		var isShowBtn = false;
		var guipai = this.GetGuiPai(pokers);
		var santiaos = [];
		var clearList = this.guiClearCardDict[this.wangPaiNum];
		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			var cardValue = this.GetCardValue(poker);
			if (clearList.indexOf(cardValue) > -1) {
				continue;
			}
			var duizi = this.GetSameValue(pokers, poker);
			var bInList = this.CheckPokerInList(santiaos, poker);
			if (duizi.length + guipai.length >= 3 && !bInList) {
				isShowBtn = true;
				break;
			}
		}
		return isShowBtn;
	},
	// 三条 三张相同的牌
	GetSanTiao: function GetSanTiao(pokers) {
		var guipai = this.GetGuiPai(pokers);
		var santiaos = this.GetNotGuiSanTiaos(pokers);
		//对子加1张鬼组成三条
		var duizis = this.GetNotGuiDuiZis(pokers);
		for (var i = 0; i < duizis.length; i++) {
			for (var j = 0; j < guipai.length; j++) {
				var duizi = this.copyArr(duizis[i]);
				var gui = guipai[j];
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
			var liangZhangGuis = [];
			this.PokerCombination(2, guipai, liangZhangGuis);
			var oneGuiCards = this.GetNotGuiOneCards(pokers);
			for (var _i38 = 0; _i38 < liangZhangGuis.length; _i38++) {
				for (var _j5 = 0; _j5 < oneGuiCards.length; _j5++) {
					var gDuiZi = this.copyArr(liangZhangGuis[_i38]);
					var _gui = oneGuiCards[_j5][0];
					if (gDuiZi.indexOf(_gui) != -1) {
						continue;
					} else {
						gDuiZi.push(_gui);
						santiaos[santiaos.length] = gDuiZi;
					}
				}
			}
		}
		return santiaos;
	},

	GetSanTiaoEx: function GetSanTiaoEx(pokers) {
		var needCheckHuLu = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

		var santiaos = this.GetSanTiao(pokers);
		if (pokers.length == 3 && santiaos.length > 0) {
			var guipai = this.GetGuiPai(pokers);
			//判断为三鬼
			if (guipai.length == 3) {}
			// return

			//判断为冲炸

			//判断为双王冲头
		}
		if (santiaos.length > 0) {
			if (!needCheckHuLu) {
				return santiaos;
			}
			//判断下是不是葫芦，不能直接调用gethulu因为里面调用了这个函数会死循环
			var remianList = [];
			for (var i = 0; i < pokers.length; i++) {
				if (santiaos.indexOf(pokers[i]) != -1) {
					continue;
				}
				remianList.push(pokers[i]);
			}
			if (remianList.length == 2) {
				var duizi = this.GetSameValue(remianList, remianList[0]);
				if (duizi.length == 2) {
					return []; //是葫芦
				} else {
					return santiaos; //三条
				}
			} else {
				return santiaos; //三条
			}
		} else {
			return [];
		}
	},
	//获取三鬼
	GetSanGui: function GetSanGui(pokers) {
		var sanZhangGuis = [];
		var guipai = this.GetGuiPai(pokers);
		if (guipai >= 3) {
			this.PokerCombination(3, guipai, sanZhangGuis);
		}
		return sanZhangGuis;
	},
	//获取双王冲头
	GetShuangWangChongTou: function GetShuangWangChongTou(pokers) {
		var shuangwangs = [];
		if (this.sign == 3 || this.sign == 1) {
			var guipai = this.GetGuiPai(pokers);
			if (guipai.length >= 2) {
				var liangZhangGuis = [];
				this.PokerCombination(2, guipai, liangZhangGuis);
				for (var i = 0; i < liangZhangGuis.length; i++) {
					for (var j = 0; j < pokers.length; j++) {
						var temp = this.copyArr(liangZhangGuis[i]);
						var poker = pokers[j];
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
	GetChongZha: function GetChongZha(pokers) {
		var chongzhas = [];
		var guipai = this.GetGuiPai(pokers);
		var clearList = this.guiClearCardDict[this.wangPaiNum];
		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			var santiao = this.GetSameValue(pokers, poker);
			var bInList = this.CheckPokerInList(chongzhas, poker);
			var sanValue = this.GetCardValue(santiao[0]);
			if (clearList.indexOf(sanValue) > -1) {
				if (santiao.length >= 3 && !bInList) {
					this.PokerCombination(3, santiao, chongzhas);
				}
			}
		}
		return chongzhas;
	},
	// 顺子 五张连续的不同花色牌
	GetShunzi: function GetShunzi(pokers) {
		var isTongHuaShun = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		//判断所有牌
		if (pokers.length < 5) {
			return [];
		}
		var clearList = this.guiClearCardDict[this.wangPaiNum];
		this.SortCardByMax(pokers);
		var guipai = this.GetGuiPai(pokers);
		var shunzis = [];
		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			var shunzi = [];
			shunzi.push(poker);
			for (var j = i + 1; j < pokers.length; j++) {
				if (guipai.indexOf(pokers[j]) != -1) {
					continue;
				}
				shunzi = [];
				shunzi.push(pokers[i]);
				var ret = this.isSave(shunzi, pokers[j]);
				if (ret) {
					shunzi.push(pokers[j]);
					if (this.GetCardValue(shunzi[0]) == 14 && this.GetCardValue(shunzi[1]) <= 5) {
						if (this.GetCardValue(shunzi[0]) - this.GetCardValue(pokers[j]) <= 4) {
							var isSameColor = this.isSameColor([shunzi], [pokers[j]]);
							if (isSameColor) {
								//可能是同花顺，比铁支大
								shunzis.push(shunzi);
							}
						}
					}
				} else {
					continue;
				}
				for (var k = j + 1; k < pokers.length; k++) {
					if (guipai.indexOf(pokers[k]) != -1) {
						continue;
					}
					shunzi = [];
					shunzi.push(pokers[i]);
					shunzi.push(pokers[j]);
					var _ret = this.isSave(shunzi, pokers[k]);
					if (_ret) {
						shunzi.push(pokers[k]);
						shunzis.push(shunzi);
					} else {
						continue;
					}
					for (var x = k + 1; x < pokers.length; x++) {
						if (guipai.indexOf(pokers[x]) != -1) {
							continue;
						}
						shunzi = [];
						shunzi.push(pokers[i]);
						shunzi.push(pokers[j]);
						shunzi.push(pokers[k]);
						var _ret2 = this.isSave(shunzi, pokers[x]);
						if (_ret2) {
							shunzi.push(pokers[x]);
							shunzis.push(shunzi);
						} else {
							continue;
						}
						for (var t = x + 1; t < pokers.length; t++) {
							if (guipai.indexOf(pokers[t]) != -1) {
								continue;
							}
							shunzi = [];
							shunzi.push(pokers[i]);
							shunzi.push(pokers[j]);
							shunzi.push(pokers[k]);
							shunzi.push(pokers[x]);
							var _ret3 = this.isSave(shunzi, pokers[t]);
							if (_ret3) {
								shunzi.push(pokers[t]);
								shunzis.push(shunzi);
							}
						}
					}
				}
			}
		}

		var retShun = [];
		for (var _i39 = 0; _i39 < shunzis.length; _i39++) {
			var item = shunzis[_i39];
			if (item.length == 5) {
				retShun.push(item);
			}
		}
		//给3鬼用的顺子（判断同花顺用
		if (isTongHuaShun) {
			for (var _i40 = 0; _i40 < pokers.length; _i40++) {
				var _poker = pokers[_i40];
				var cardValue1 = this.GetCardValue(_poker);
				if (guipai.indexOf(_poker) > -1) {
					continue;
				}
				if (this.clearList.indexOf(cardValue1) > -1) {
					continue;
				}
				var _shunzi = [];
				_shunzi.push(_poker);
				for (var _j6 = _i40 + 1; _j6 < pokers.length; _j6++) {
					var cardValue2 = this.GetCardValue(pokers[_j6]);
					if (guipai.indexOf(pokers[_j6]) > -1) {
						continue;
					}
					if (this.clearList.indexOf(cardValue2) > -1) {
						continue;
					}
					_shunzi.push(pokers[_j6]);
					if (this.GetCardValue(_shunzi[0]) - this.GetCardValue(pokers[_j6]) <= 4) {
						shunzis.push(_shunzi);
						break;
					}
				}
			}
		}
		if (guipai.length >= 3) {
			//有可能同花顺
			var sanZhangGuis = [];
			this.PokerCombination(3, guipai, sanZhangGuis);
			for (var _i41 = 0; _i41 < sanZhangGuis.length; _i41++) {
				for (var _j7 = 0; _j7 < shunzis.length; _j7++) {
					var temp = this.copyArr(sanZhangGuis[_i41]);
					var _shunzi2 = this.copyArr(shunzis[_j7]);
					if (_shunzi2.length == 2) {
						for (var _k4 = 0; _k4 < _shunzi2.length; _k4++) {
							var one = this.copyArr(_shunzi2[_k4]);
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
		var liangZhangGuis = [];
		if (guipai.length >= 2) {
			this.PokerCombination(2, guipai, liangZhangGuis);
			for (var _i42 = 0; _i42 < liangZhangGuis.length; _i42++) {
				for (var _j8 = 0; _j8 < shunzis.length; _j8++) {
					var gDuiZi = this.copyArr(liangZhangGuis[_i42]);
					var _item = shunzis[_j8];
					if (_item.length == 3) {
						for (var _k5 = 0; _k5 < _item.length; _k5++) {
							var _temp = _item[_k5];
							var tempValue = this.GetCardValue(_temp);
							if (gDuiZi.indexOf(_temp) != -1) {
								continue;
							}
							if (!isTongHuaShun) {
								if (clearList.indexOf(tempValue) > -1) {
									continue;
								}
							}
							gDuiZi.push(_temp);
							if (_k5 == _item.length - 1) {
								retShun.push(gDuiZi);
							}
						}
					}
				}
			}
		}
		if (guipai.length >= 1) {
			for (var _i43 = 0; _i43 < shunzis.length; _i43++) {
				for (var _j9 = 0; _j9 < guipai.length; _j9++) {
					var _item2 = shunzis[_i43];
					if (_item2.length == 4) {
						var _gDuiZi = this.copyArr(_item2);
						var gui = guipai[_j9];
						if (_gDuiZi.indexOf(gui) != -1) {
							continue;
						} else {
							_gDuiZi.push(gui);
							retShun.push(_gDuiZi);
						}
					}
				}
			}
		}
		return retShun;
	},

	isSave: function isSave(shunzi, poker) {
		var guipai = this.GetGuiPai(poker);

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

		var firstValue = this.GetCardValue(shunzi[0]);
		var lastValue = this.GetCardValue(poker);

		var value = firstValue - lastValue;
		if (value > 4) {
			return false;
		}
		return true;
	},

	isContain: function isContain(shunzi, poker) {
		var temp = this.GetCardValue(poker);
		for (var i = 0; i < shunzi.length; i++) {
			var cardValue = this.GetCardValue(shunzi[i]);
			if (temp == cardValue) {
				return false;
			}
		}
		return true;
	},
	//判断是否为顺子
	GetShunziEx: function GetShunziEx(pokers) {
		//只判断五张
		if (pokers.length != 5) {
			return [];
		}
		var shunzis = this.GetShunzi(pokers, true);
		return shunzis;
	},

	isSameColor: function isSameColor(tonghuas, tonghua) {
		var bRet = false;
		if (tonghuas.length) {
			for (var idx = 0; idx < tonghuas.length; idx++) {
				var first = this.GetCardColor(tonghuas[idx][0]);
				var second = this.GetCardColor(tonghua[0]);
				if (first == second) {
					bRet = true;
					break;
				}
			}
		}
		return bRet;
	},
	//五张不连续的同花色牌
	GetTonghua: function GetTonghua(pokers) {
		var guipai = this.GetGuiPai(pokers);
		var tonghuas = [];
		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			var tonghua = this.GetSameColor(pokers, poker);
			var same = this.isSameColor(tonghuas, tonghua);
			if (tonghua.length == 5 && !same) {
				tonghuas[tonghuas.length] = tonghua;
			} else if (tonghua.length > 5 && !same) {
				this.PokerCombination(5, tonghua, tonghuas);
			}
		}
		var paizu = [];
		if (guipai.length >= 1) {
			for (var _i44 = 0; _i44 < pokers.length; _i44++) {
				var _poker2 = pokers[_i44];
				if (guipai.indexOf(_poker2) != -1) {
					continue;
				}
				var sameColor = this.GetSameColor(pokers, _poker2);
				var _same = this.isSameColor(paizu, sameColor);
				if (sameColor.length >= 4 && !_same) {
					this.PokerCombination(4, sameColor, paizu);
					for (var j = 0; j < paizu.length; j++) {
						for (var k = 0; k < guipai.length; k++) {
							var gDuiZi = this.copyArr(paizu[j]);
							var gui = guipai[k];
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

	GetTonghuaEx: function GetTonghuaEx(pokers) {
		if (pokers.length != 5) {
			return [];
		}
		var isSameColor = this.CheckSameColor(pokers);
		if (pokers.length == 5 && isSameColor) {
			return pokers;
		} else {
			return [];
		}
	},
	// 2张  一对同花
	GetYiDuiTongHua: function GetYiDuiTongHua(pokers) {
		if (pokers.length != 5) {
			return [];
		}
		var guipai = this.GetGuiPai(pokers);
		var isSameColor = this.CheckSameColor(pokers);
		if (pokers.length == 5 && isSameColor) {
			var isYidui = false;
			for (var i = 0; i < pokers.length; i++) {
				var poker = pokers[i];
				if (guipai.indexOf(poker) != -1) {
					continue;
				}
				var duizi = this.GetSameValue(pokers, poker);
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
	GetLiangDuiTongHua: function GetLiangDuiTongHua(pokers) {
		if (pokers.length != 5) {
			return [];
		}
		var guipai = this.GetGuiPai(pokers);
		var isSameColor = this.CheckSameColor(pokers);
		var duizi = [];
		if (pokers.length == 5 && isSameColor) {
			if (!guipai.length) {
				var duizis = this.GetNotGuiDuiZis(pokers);
				if (duizis.length == 2) {
					return pokers;
				} else {
					return [];
				}
			} else if (guipai.length == 1) {
				for (var i = 0; i < pokers.length; i++) {
					var poker = pokers[i];
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
	GetHulu: function GetHulu(pokers) {
		var hulus = this.GetHuluEx(pokers);
		return hulus;
	},
	//葫芦 (5张 三条加一对，同牌型比三条)
	GetHuluEx: function GetHuluEx(pokers) {
		//不含炸弹的葫芦 对子+三条
		var guipai = this.GetGuiPai(pokers);
		var duizis = this.GetAllDuiZi(pokers);
		this.SortCardArrByMin(duizis);
		var santiaos = this.GetNotGuiSanTiaos(pokers);
		this.SortCardArrByMax(santiaos);
		var hulus = [];
		for (var i = 0; i < duizis.length; i++) {
			var dui = duizis[i];
			for (var j = 0; j < santiaos.length; j++) {
				var san = santiaos[j];
				if (!this.CheckSameValue(dui, san)) {
					var hulu = dui.concat(san);
					hulus[hulus.length] = hulu;
				}
			}
		}
		//两对+1张鬼组成葫芦 (获取没有鬼牌的两对,没有特殊牌的对子)
		var liangduis = [];
		var noGuiDuiZis = this.GetNotGuiDuiZis(pokers);
		if (noGuiDuiZis.length >= 2) {
			//没有鬼牌的时候
			for (var _i45 = 0; _i45 < noGuiDuiZis.length; _i45++) {
				var firstDui = noGuiDuiZis[_i45];
				var secondDui = [];
				for (var _j10 = 1; _j10 < noGuiDuiZis.length; _j10++) {
					secondDui = noGuiDuiZis[_j10];
					var bRet = this.CheckSameValue(firstDui, secondDui);
					if (!bRet) {
						var liangdui = firstDui.concat(secondDui);
						liangduis.push(liangdui);
					}
				}
			}
		}
		if (guipai.length >= 1) {
			for (var _i46 = 0; _i46 < liangduis.length; _i46++) {
				for (var _j11 = 0; _j11 < guipai.length; _j11++) {
					var gDuiZi = this.copyArr(liangduis[_i46]);
					var gui = guipai[_j11];
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
	GetZhaDan: function GetZhaDan(pokers) {
		var zhadans = [];
		if (this.sign < 2) {
			//经典模式
			if (pokers.length == 3) {
				return zhadans;
			}
		}
		var guipai = this.GetGuiPai(pokers);
		//4张相同的牌/带鬼牌的玩法222，333算炸
		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			var cardValue = this.GetCardValue(poker);
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			var zhadan = this.GetSameValue(pokers, poker);
			var bInList = this.CheckPokerInList(zhadans, poker);
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
			var sanZhangGuis = [];
			this.PokerCombination(3, guipai, sanZhangGuis);
			var clearList = this.guiClearCardDict[this.wangPaiNum];
			for (var _i47 = 0; _i47 < sanZhangGuis.length; _i47++) {
				for (var j = 0; j < pokers.length; j++) {
					var temp = this.copyArr(sanZhangGuis[_i47]);
					var _poker3 = pokers[j];
					var _cardValue3 = this.GetCardValue(_poker3);
					if (guipai.indexOf(_poker3) != -1) {
						continue;
					}
					if (temp.indexOf(_poker3) != -1) {
						continue;
					}
					if (this.wangPaiNum == 2 || this.sign == 2) {
						if (_cardValue3 == 2 || _cardValue3 == 3) {
							continue;
						}
					} else if (this.wangPaiNum > 2) {
						if (clearList.indexOf(_cardValue3) > -1) {
							continue;
						}
					}

					temp.push(_poker3);
					zhadans.push(temp);
				}
			}
		}
		if (guipai.length >= 2) {
			var liangZhangGuis = [];
			this.PokerCombination(2, guipai, liangZhangGuis);
			var duizis = this.GetNotGuiDuiZis(pokers);
			for (var _i48 = 0; _i48 < liangZhangGuis.length; _i48++) {
				for (var _j12 = 0; _j12 < duizis.length; _j12++) {
					var _temp2 = this.copyArr(liangZhangGuis[_i48]);
					var duizi = this.copyArr(duizis[_j12]);
					for (var k = 0; k < duizi.length; k++) {
						var _poker4 = this.copyArr(duizi[k]);
						if (_temp2.indexOf(_poker4) != -1) {
							continue;
						}
						_temp2.push(_poker4);
						if (_temp2.length == 4) {
							zhadans.push(_temp2);
						}
					}
				}
			}
		}
		if (guipai.length >= 1) {
			var santiaos = this.GetNotGuiSanTiaos(pokers);
			for (var _i49 = 0; _i49 < santiaos.length; _i49++) {
				for (var _j13 = 0; _j13 < guipai.length; _j13++) {
					var santiao = this.copyArr(santiaos[_i49]);
					var gui = guipai[_j13];
					if (santiao.indexOf(gui) != -1) {
						continue;
					}
					santiao.push(gui);
					zhadans.push(santiao);
				}
			}
			var duiSans = this.GetSanPais(pokers, 2);
			for (var _i50 = 0; _i50 < duiSans.length; _i50++) {
				for (var _j14 = 0; _j14 < guipai.length; _j14++) {
					var _zhadan = this.copyArr(duiSans[_i50]);
					var _gui2 = guipai[_j14];
					if (_zhadan.indexOf(_gui2) != -1) {
						continue;
					}
					_zhadan.push(_gui2);
					zhadans.push(_zhadan);
				}
			}
			var duiErs = this.GetErPais(pokers, 2);
			for (var _i51 = 0; _i51 < duiErs.length; _i51++) {
				for (var _j15 = 0; _j15 < guipai.length; _j15++) {
					var _zhadan2 = this.copyArr(duiErs[_i51]);
					var _gui3 = guipai[_j15];
					if (_zhadan2.indexOf(_gui3) != -1) {
						continue;
					}
					_zhadan2.push(_gui3);
					zhadans.push(_zhadan2);
				}
			}
		}
		return zhadans;
	},
	//同花顺 (同花色的五张连续牌)
	GetTongHuaShunEx: function GetTongHuaShunEx(pokers) {
		this.SortCardByMax(pokers);
		var tonghuashuns = [];
		var cardsColorDict = {};
		var guipai = this.GetGuiPai(pokers);
		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			var color = this.GetCardColor(poker);
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			if (!cardsColorDict[color]) {
				cardsColorDict[color] = [];
			}
			cardsColorDict[color].push(poker);
		}
		var shunzis = [];
		for (var key in cardsColorDict) {
			var cardsColor = cardsColorDict[key];
			for (var _i52 = 0; _i52 < cardsColor.length; _i52++) {
				var _poker5 = cardsColor[_i52];
				var shunzi = [];
				shunzi.push(_poker5);
				for (var j = _i52 + 1; j < cardsColor.length; j++) {
					shunzi = [];
					shunzi.push(cardsColor[_i52]);
					var ret = this.isSave(shunzi, cardsColor[j]);
					if (ret) {
						shunzi.push(pokers[j]);
						if (this.GetCardValue(shunzi[0]) == 14 && this.GetCardValue(shunzi[1]) <= 5) {
							if (this.GetCardValue(shunzi[0]) - this.GetCardValue(pokers[j]) <= 4) {
								var isSameColor = this.isSameColor([shunzi], [pokers[j]]);
								if (isSameColor) {
									//可能是同花顺，比铁支大
									shunzis.push(shunzi);
								}
							}
						}
					} else {
						continue;
					}
					for (var k = j + 1; k < cardsColor.length; k++) {
						shunzi = [];
						shunzi.push(cardsColor[_i52]);
						shunzi.push(cardsColor[j]);
						var _ret4 = this.isSave(shunzi, cardsColor[k]);
						if (_ret4) {
							shunzi.push(cardsColor[k]);
							shunzis.push(shunzi);
						} else {
							continue;
						}
						for (var x = k + 1; x < cardsColor.length; x++) {
							shunzi = [];
							shunzi.push(cardsColor[_i52]);
							shunzi.push(cardsColor[j]);
							shunzi.push(cardsColor[k]);
							var _ret5 = this.isSave(shunzi, cardsColor[x]);
							if (_ret5) {
								shunzi.push(cardsColor[x]);
								shunzis.push(shunzi);
							} else {
								continue;
							}
							for (var t = x + 1; t < cardsColor.length; t++) {
								shunzi = [];
								shunzi.push(cardsColor[_i52]);
								shunzi.push(cardsColor[j]);
								shunzi.push(cardsColor[k]);
								shunzi.push(cardsColor[x]);
								var _ret6 = this.isSave(shunzi, cardsColor[t]);
								if (_ret6) {
									shunzi.push(cardsColor[t]);
									shunzis.push(shunzi);
								}
							}
						}
					}
				}
			}
		}
		for (var _i53 = 0; _i53 < shunzis.length; _i53++) {
			var item = shunzis[_i53];
			if (item.length == 5) {
				tonghuashuns.push(item);
			}
		}
		for (var _key in cardsColorDict) {
			var _cardsColor = cardsColorDict[_key];
			for (var _i54 = 0; _i54 < _cardsColor.length; _i54++) {
				var _poker6 = _cardsColor[_i54];
				var cardValue1 = this.GetCardValue(_poker6);
				if (this.clearList.indexOf(cardValue1) > -1) {
					continue;
				}
				var _shunzi3 = [];
				_shunzi3.push(_poker6);
				//计算出能与3鬼凑成的同花顺
				for (var _j16 = _i54 + 1; _j16 < _cardsColor.length; _j16++) {
					var cardValue2 = this.GetCardValue(_cardsColor[_j16]);
					if (this.clearList.indexOf(cardValue2) > -1) {
						continue;
					}
					_shunzi3.push(_cardsColor[_j16]);
					if (this.GetCardValue(_shunzi3[0]) - this.GetCardValue(_cardsColor[_j16]) <= 4) {
						shunzis.push(_shunzi3);
						break;
					}
				}
			}
		}
		if (guipai.length >= 3) {
			//有可能同花顺 3张普通牌
			var sanZhangGuis = [];
			this.PokerCombination(3, guipai, sanZhangGuis);
			for (var _i55 = 0; _i55 < sanZhangGuis.length; _i55++) {
				for (var _j17 = 0; _j17 < shunzis.length; _j17++) {
					var temp = this.copyArr(sanZhangGuis[_i55]);
					var _shunzi4 = this.copyArr(shunzis[_j17]);
					if (_shunzi4.length == 2) {
						for (var _k6 = 0; _k6 < _shunzi4.length; _k6++) {
							var one = this.copyArr(_shunzi4[_k6]);
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
		var liangZhangGuis = [];
		if (guipai.length >= 2) {
			this.PokerCombination(2, guipai, liangZhangGuis);
			for (var _i56 = 0; _i56 < liangZhangGuis.length; _i56++) {
				for (var _j18 = 0; _j18 < shunzis.length; _j18++) {
					var gDuiZi = this.copyArr(liangZhangGuis[_i56]);
					var _item3 = shunzis[_j18];
					if (_item3.length == 3) {
						for (var _k7 = 0; _k7 < _item3.length; _k7++) {
							var _temp3 = _item3[_k7];
							if (gDuiZi.indexOf(_temp3) != -1) {
								continue;
							} else {
								gDuiZi.push(_temp3);
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
			for (var _i57 = 0; _i57 < shunzis.length; _i57++) {
				for (var _j19 = 0; _j19 < guipai.length; _j19++) {
					var _item4 = shunzis[_i57];
					if (_item4.length == 4) {
						var _gDuiZi2 = this.copyArr(_item4);
						var gui = guipai[_j19];
						if (_gDuiZi2.indexOf(gui) != -1) {
							continue;
						} else {
							_gDuiZi2.push(gui);
							tonghuashuns.push(_gDuiZi2);
						}
					}
				}
			}
		}
		return tonghuashuns;
	},
	//五同 (五张相同的牌) 222+王   333+王 22+王王 33+王王
	GetWuTong: function GetWuTong(pokers) {
		var guipai = this.GetGuiPai(pokers);
		var wutongs = [];
		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			var cardValue = this.GetCardValue(poker);
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			var wutong = this.GetSameValue(pokers, poker);
			var bInList = this.CheckPokerInList(wutongs, poker);
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
				var clearList = this.guiClearCardDict[this.wangPaiNum];
				if (clearList.indexOf(cardValue) > -1) {
					if (guipai.length > 2) {
						wutongs.push([poker, guipai[0], guipai[1], guipai[2]]);
					}
				}
			}
		}
		//3333
		var sanWuTongs = this.GetClearPais(pokers, 4);
		for (var _i58 = 0; _i58 < sanWuTongs.length; _i58++) {
			var temp = this.copyArr(sanWuTongs[_i58]);
			wutongs.push(temp);
		}

		if (guipai.length >= 4) {
			var siZhangGuis = [];
			this.PokerCombination(4, guipai, siZhangGuis);
			var oneCards = this.GetNotGuiOneCards(pokers);
			for (var _i59 = 0; _i59 < siZhangGuis.length; _i59++) {
				for (var j = 0; j < oneCards.length; j++) {
					var _temp4 = this.copyArr(siZhangGuis[_i59]);
					var _poker7 = oneCards[j][0];
					if (_temp4.indexOf(_poker7) != -1) {
						continue;
					}
					_temp4.push(_poker7);
					wutongs.push(_temp4);
				}
			}
		}
		if (guipai.length >= 3) {
			var sanZhangGuis = [];
			this.PokerCombination(3, guipai, sanZhangGuis);
			var duizis = this.GetNotGuiDuiZis(pokers);
			for (var _i60 = 0; _i60 < duizis.length; _i60++) {
				for (var _j20 = 0; _j20 < sanZhangGuis.length; _j20++) {
					var _temp5 = this.copyArr(duizis[_i60]);
					var sanZhangGui = sanZhangGuis[_j20];
					for (var k = 0; k < sanZhangGui.length; k++) {
						var gui = sanZhangGui[k];
						if (_temp5.indexOf(gui) != -1) {
							continue;
						}
						_temp5.push(gui);
						if (_temp5.length == 5) {
							wutongs.push(_temp5);
						}
					}
				}
			}
		}
		if (guipai.length >= 2) {
			var liangZhangGuis = [];
			this.PokerCombination(2, guipai, liangZhangGuis);
			var santiaos = this.GetNotGuiSanTiaos(pokers);
			for (var _i61 = 0; _i61 < santiaos.length; _i61++) {
				for (var _j21 = 0; _j21 < liangZhangGuis.length; _j21++) {
					var _temp6 = this.copyArr(santiaos[_i61]);
					var liangZhangGui = liangZhangGuis[_j21];
					for (var _k8 = 0; _k8 < liangZhangGui.length; _k8++) {
						var _gui4 = liangZhangGui[_k8];
						if (_temp6.indexOf(_gui4) != -1) {
							continue;
						}
						_temp6.push(_gui4);
						if (_temp6.length == 5) {
							wutongs.push(_temp6);
						}
					}
				}
			}
			//33+王王
			var sanLists = this.GetSanPais(pokers, 2);
			for (var _i62 = 0; _i62 < sanLists.length; _i62++) {
				for (var _j22 = 0; _j22 < liangZhangGuis.length; _j22++) {
					var _temp7 = this.copyArr(sanLists[_i62]);
					var _liangZhangGui = liangZhangGuis[_j22];
					for (var _k9 = 0; _k9 < _liangZhangGui.length; _k9++) {
						var _gui5 = _liangZhangGui[_k9];
						if (_temp7.indexOf(_gui5) != -1) {
							continue;
						}
						_temp7.push(_gui5);
						if (_temp7.length == 4) {
							wutongs.push(_temp7);
						}
					}
				}
			}
			//22+王王
			var erLists = this.GetErPais(pokers, 2);
			for (var _i63 = 0; _i63 < erLists.length; _i63++) {
				for (var _j23 = 0; _j23 < liangZhangGuis.length; _j23++) {
					var _temp8 = this.copyArr(erLists[_i63]);
					var _liangZhangGui2 = liangZhangGuis[_j23];
					for (var _k10 = 0; _k10 < _liangZhangGui2.length; _k10++) {
						var _gui6 = _liangZhangGui2[_k10];
						if (_temp8.indexOf(_gui6) != -1) {
							continue;
						}
						_temp8.push(_gui6);
						if (_temp8.length == 4) {
							wutongs.push(_temp8);
						}
					}
				}
			}
		}
		if (guipai.length >= 1) {
			var siZhangs = this.GetNotGuiSiZhangs(pokers, true);
			for (var _i64 = 0; _i64 < siZhangs.length; _i64++) {
				for (var _j24 = 0; _j24 < guipai.length; _j24++) {
					var _temp9 = this.copyArr(siZhangs[_i64]);
					var _gui7 = guipai[_j24];
					if (_temp9.indexOf(_gui7) != -1) {
						continue;
					}
					_temp9.push(_gui7);
					wutongs.push(_temp9);
				}
			}
			var _erLists = this.GetErPais(pokers, 3);
			for (var _i65 = 0; _i65 < _erLists.length; _i65++) {
				for (var _j25 = 0; _j25 < guipai.length; _j25++) {
					var _temp10 = this.copyArr(_erLists[_i65]);
					var _gui8 = guipai[_j25];
					if (_temp10.indexOf(_gui8) != -1) {
						continue;
					}
					_temp10.push(_gui8);
					wutongs.push(_temp10);
				}
			}
			var _sanLists = this.GetSanPais(pokers, 3);
			for (var _i66 = 0; _i66 < _sanLists.length; _i66++) {
				for (var _j26 = 0; _j26 < guipai.length; _j26++) {
					var _temp11 = this.copyArr(_sanLists[_i66]);
					var _gui9 = guipai[_j26];
					if (_temp11.indexOf(_gui9) != -1) {
						continue;
					}
					_temp11.push(_gui9);
					wutongs.push(_temp11);
				}
			}
		}

		// console.log('五同 :', wutongs);
		return wutongs;
	},
	//六同 (5张 因222、333与王组成的5张同点牌； 示例：222+王王、2222+王)
	GetLiuTongs: function GetLiuTongs(pokers) {
		var guipai = this.GetGuiPai(pokers);
		var zhangs = [];
		var liutongs = [];
		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}

			var duizi = this.GetSameValue(pokers, poker);
			var bInList = this.CheckPokerInList(zhangs, poker);
			var value = this.GetCardValue(duizi[0]);
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
			var siZhangGuis = [];
			this.PokerCombination(4, guipai, siZhangGuis);
			for (var _i67 = 0; _i67 < siZhangGuis.length; _i67++) {
				for (var j = 0; j < zhangs.length; j++) {
					var temp = this.copyArr(siZhangGuis[_i67]);
					var zhang = this.copyArr(zhangs[j]);
					if (zhang.length == 1) {
						for (var k = 0; k < zhang.length; k++) {
							var one = this.copyArr(zhang[k]);
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
			var sanZhangGuis = [];
			this.PokerCombination(3, guipai, sanZhangGuis);
			for (var _i68 = 0; _i68 < sanZhangGuis.length; _i68++) {
				for (var _j27 = 0; _j27 < zhangs.length; _j27++) {
					var _temp12 = this.copyArr(sanZhangGuis[_i68]);
					var _zhang = this.copyArr(zhangs[_j27]);
					if (_zhang.length == 2) {
						for (var _k11 = 0; _k11 < _zhang.length; _k11++) {
							var _one = this.copyArr(_zhang[_k11]);
							if (_temp12.indexOf(_one) != -1) {
								continue;
							}
							_temp12.push(_one);
							if (_temp12.length == 5) {
								liutongs.push(_temp12);
							}
						}
					}
				}
			}
		}
		if (guipai.length >= 2) {
			var liangZhangGuis = [];
			this.PokerCombination(2, guipai, liangZhangGuis);
			for (var _i69 = 0; _i69 < liangZhangGuis.length; _i69++) {
				for (var _j28 = 0; _j28 < zhangs.length; _j28++) {
					var _temp13 = this.copyArr(liangZhangGuis[_i69]);
					var _zhang2 = this.copyArr(zhangs[_j28]);
					if (_zhang2.length == 3) {
						for (var _k12 = 0; _k12 < _zhang2.length; _k12++) {
							var _one2 = this.copyArr(_zhang2[_k12]);
							if (_temp13.indexOf(_one2) != -1) {
								continue;
							}
							_temp13.push(_one2);
							if (_temp13.length == 5) {
								liutongs.push(_temp13);
							}
						}
					}
				}
			}
		}
		if (guipai.length >= 1) {
			for (var _i70 = 0; _i70 < zhangs.length; _i70++) {
				var _zhang3 = zhangs[_i70];
				if (_zhang3.length == 4) {
					for (var _j29 = 0; _j29 < guipai.length; _j29++) {
						var _temp14 = this.copyArr(_zhang3);
						var gui = guipai[_j29];
						if (_temp14.indexOf(gui) != -1) {
							continue;
						}
						_temp14.push(gui);
						if (_temp14.length == 5) {
							liutongs.push(_temp14);
						}
					}
				}
			}
		}
		return liutongs;
	},
	//判断是否为同花顺
	IsTongHuaShun: function IsTongHuaShun(pokers) {
		//只能是5张
		var isTongHuaShun = false;
		if (pokers.length == 5) {
			var tonghuas = this.GetTonghuaEx(pokers);
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
	IsWuTong: function IsWuTong(pokers) {
		var isWuTong = false;
		var erList = [];
		var sanList = [];
		var clearListDict = {};
		var guipai = this.GetGuiPai(pokers);
		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			var value = this.GetCardValue(poker);
			var color = this.GetCardColor(poker);
			if (color != 64) {
				//4个鬼+1张牌
				if (guipai.length == 4) {
					return true;
				}
			}
			var samePoker = this.GetSameValue(pokers, poker);
			if (value != 2 && value != 3 && samePoker.length >= 2 && samePoker.length + guipai.length == 5) {
				return true;
			}
			if (this.sign == 1) {
				//经典场相同的普通牌＋鬼牌可以组成五同
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
				var clearList = this.guiClearCardDict[this.wangPaiNum];
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
			for (var key in clearListDict) {
				var clearCardList = clearListDict[key];
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
	IsLiuTong: function IsLiuTong(pokers) {
		var isLiuTong = false;
		if (pokers.length != 5) {
			return isLiuTong;
		}
		var erList = [];
		var sanList = [];
		var clearListDict = {};
		var guipai = this.GetGuiPai(pokers);
		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			var value = this.GetCardValue(poker);
			if (this.wangPaiNum == 2 || this.sign == 2) {
				if (value == 2) {
					erList.push(poker);
				}
				if (value == 3) {
					sanList.push(poker);
				}
			} else if (this.wangPaiNum > 2) {
				var clearList = this.guiClearCardDict[this.wangPaiNum];
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
			for (var key in clearListDict) {
				var clearCardList = clearListDict[key];
				if (clearCardList.length >= 1 && guipai.length + clearCardList.length >= 5) {
					isLiuTong = true;
				}
			}
		}
		return isLiuTong;
	},
	//五鬼 (五张大小王鬼牌)
	GetWuGuis: function GetWuGuis(pokers) {
		var wuguis = [];
		var guipai = this.GetGuiPai(pokers);
		if (guipai.length >= 5) {
			this.PokerCombination(5, guipai, wuguis);
		}
		return wuguis;
	},
	//判断是否有五鬼
	IsWuGui: function IsWuGui(pokers) {
		var isWuGui = false;
		var guipai = this.GetGuiPai(pokers);
		if (guipai.length >= 5) {
			isWuGui = true;
		}
		return isWuGui;
	},
	IsSanGui: function IsSanGui(pokers) {
		var isSanGui = false;
		if (pokers.length == 3) {
			var guipai = this.GetGuiPai(pokers);
			if (guipai.length == 3) {
				isSanGui = true;
			}
		}
		return isSanGui;
	},
	IsShuangWangChongTou: function IsShuangWangChongTou(pokers) {
		var isShuangWangChongTou = false;
		if (this.sign == 3 || this.sign == 1) {
			//特殊王牌场 //经典场也可以
			if (pokers.length == 3) {
				var guipai = this.GetGuiPai(pokers);
				if (guipai.length == 2) {
					isShuangWangChongTou = true;
				}
			}
		}
		return isShuangWangChongTou;
	},
	IsChongZha: function IsChongZha(pokers) {
		var isTouDun = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		var isChongZha = false;
		if (!isTouDun) {
			if (pokers.length >= 3) {
				var clearListDict = {};
				for (var i = 0; i < pokers.length; i++) {
					var poker = pokers[i];
					var cardValue = this.GetCardValue(poker);
					var clearList = this.guiClearCardDict[this.wangPaiNum];
					if (clearList.indexOf(cardValue) > -1) {
						if (!clearListDict[cardValue]) {
							clearListDict[cardValue] = [];
						}
						clearListDict[cardValue].push(poker);
					}
				}
				for (var key in clearListDict) {
					var clearCardList = clearListDict[key];
					if (clearCardList.length == 3) {
						isChongZha = true;
					}
				}
			}
		} else {
			if (pokers.length == 3) {
				var _clearListDict = {};
				var guipai = this.GetGuiPai(pokers);
				for (var _i71 = 0; _i71 < pokers.length; _i71++) {
					var _poker8 = pokers[_i71];
					var _cardValue4 = this.GetCardValue(_poker8);
					var _clearList = this.guiClearCardDict[this.wangPaiNum];
					if (_clearList.indexOf(_cardValue4) > -1) {
						if (!_clearListDict[_cardValue4]) {
							_clearListDict[_cardValue4] = [];
						}
						_clearListDict[_cardValue4].push(_poker8);
					}
				}
				for (var _key2 in _clearListDict) {
					var _clearCardList = _clearListDict[_key2];
					if (_clearCardList.length == 3) {
						isChongZha = true;
					}

					if (guipai.length == 1 && guipai.length + _clearCardList.length == 3) {
						isChongZha = true;
					} else if (guipai.length == 2 && guipai.length + _clearCardList.length == 3) {
						isChongZha = true;
					} else if (this.sign == 2) {
						if (guipai.length != 3 && guipai.length + _clearCardList.length == 3) {
							isChongZha = true;
						}
					}
				}
			}
		}
		return isChongZha;
	},
	//头墩3冲炸
	IsSanChongZha: function IsSanChongZha(pokers) {
		var chongZhaCard = 0;
		if (pokers.length == 3) {
			var clearListDict = {};
			for (var i = 0; i < pokers.length; i++) {
				var poker = pokers[i];
				var cardValue = this.GetCardValue(poker);
				var clearList = this.guiClearCardDict[this.wangPaiNum];
				if (clearList.indexOf(cardValue) > -1) {
					if (!clearListDict[cardValue]) {
						clearListDict[cardValue] = [];
					}
					clearListDict[cardValue].push(poker);
				}
			}
			for (var key in clearListDict) {
				var clearCardList = clearListDict[key];
				if (clearCardList.length == 3) {
					chongZhaCard = parseInt(key);
				}
			}
		}
		return chongZhaCard;
	},
	CheckTouDunByGui: function CheckTouDunByGui(pokers) {
		var isSanGui = this.CARD_TYPE_ZHADAN_SANGUI;
		var isShuangWangChongTou = this.CARD_TYPE_ZHADAN_SHUANGWANGCHONGTOU;
		var isChongZha = this.CARD_TYPE_ZHADAN_CHONGZHA;
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
	CheckSameColor: function CheckSameColor(pokers) {
		if (pokers.length == 0) {
			return false;
		}
		var guipai = this.GetGuiPai(pokers);
		if (guipai.length >= 4) {
			return true;
		}
		for (var i = 0; i < pokers.length; i++) {
			if (guipai.indexOf(pokers[i]) != -1) {
				continue;
			}
			var poker = pokers[i];
			var sameColor = this.GetSameColor(pokers, poker);
			if (guipai.length + sameColor.length == pokers.length) {
				return true;
			}
		}
		return false;
	},
	CheckPokerInList: function CheckPokerInList(list, tagCard) {
		if (list.length == 0) {
			return false;
		}

		var bInList = false;
		for (var i = 0; i < list.length; i++) {
			var item = list[i];
			var pos = item.indexOf(tagCard);
			if (pos >= 0) {
				bInList = true;
			}
		}
		return bInList;
	},

	GetContinueValue: function GetContinueValue(pokers, tagCard) {
		if (pokers.length == 0) {
			return;
		}
		var continueValueList = [];
		var tagCardValue = this.GetCardValue(tagCard);
		var continueTime = 1;

		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			var continueValue = this.GetCardValue(poker);

			if (tagCardValue + continueTime == continueValue) {
				continueValueList[continueValueList.length] = poker;
				continueTime++;
			}
		}
		return continueValueList;
	},
	//获取下一牌值
	GetNextValue: function GetNextValue(pokers, tagCard) {
		if (list.length == 0) return;
		var nextValueList = [];
		var tagCardValue = this.GetCardValue(tagCard);
		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			var nextValue = this.GetCardValue(poker);

			if (tagCardValue + 1 == nextValue) {
				nextValueList[nextValueList.length] = poker;
			}
		}
		return nextValueList;
	},
	//判断是否有一样的牌值
	CheckSameValueInArr: function CheckSameValueInArr(pokers, tagCard) {
		var tagCardValue = this.GetCardValue(tagCard);
		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			var pokerValue = this.GetCardValue(poker);
			if (tagCardValue == pokerValue) {
				return true;
			}
		}
		return false;
	},
	//获取同一牌值
	GetSameValue: function GetSameValue(pokers, tagCard) {
		var sameValueList = [];
		var tagCardValue = this.GetCardValue(tagCard);
		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			var pokerValue = this.GetCardValue(poker);

			if (tagCardValue == pokerValue) {
				sameValueList[sameValueList.length] = poker;
			}
		}
		return sameValueList;
	},
	//获取同一花色
	GetSameColor: function GetSameColor(pokers, tagCard) {
		var sameColorList = [];
		for (var i = 0; i < pokers.length; i++) {
			var poker = pokers[i];
			var pokerColor = this.GetCardColor(poker);
			var tagCardColor = this.GetCardColor(tagCard);
			if (pokerColor == tagCardColor) {
				sameColorList[sameColorList.length] = poker;
			}
		}
		return sameColorList;
	},
	//获取牌值
	GetCardValue: function GetCardValue(poker) {
		var newPoker = this.PokerCard.SubCardValue(poker);
		var color = this.GetCardColor(poker);
		var cardValue = newPoker & this.LOGIC_MASK_VALUE;
		if (64 == color) {
			if (cardValue % 2 == 0) {
				//小鬼
				return 99;
			} else if (cardValue % 2 == 1) {
				//单数大鬼
				return 100;
			}
		} else {
			return cardValue;
		}
	},

	//获取花色
	GetCardColor: function GetCardColor(poker) {
		var newPoker = this.PokerCard.SubCardValue(poker);
		return newPoker & this.LOGIC_MASK_COLOR;
	},

	GetSortCards: function GetSortCards(pokers) {
		if (!pokers.length) return;
		var guipai = this.GetGuiPai(pokers);
		var array = [];

		for (var idx = 0; idx < pokers.length; idx++) {
			var poker = pokers[idx];
			if (guipai.indexOf(poker) != -1) {
				continue;
			}
			var data = {};
			data.cardValue = this.GetCardValue(poker);
			data.cardX16 = poker;
			array.push(data);
		}

		array.sort(function (a, b) {
			return b.cardValue - a.cardValue;
		});

		//鬼牌不进行排序 向前插入
		for (var i = 0; i < guipai.length; i++) {
			var _data = {};
			_data.cardValue = this.GetCardValue(guipai[i]);
			_data.cardX16 = guipai[i];
			array.unshift(_data);
		}
		return array;
	},

	CheckSameValue: function CheckSameValue(aCards, bCards) {
		var bRet = false;
		for (var i = 0; i < aCards.length; i++) {
			var poker = aCards[i];
			if (bCards.indexOf(poker) != -1) {
				bRet = true;
				break;
			}
		}
		return bRet;
	},

	SortCardByMin: function SortCardByMin(pokers) {
		var self = this;
		pokers.sort(function (a, b) {
			//return (a&0x0F) - (b&0x0F);
			return self.GetCardValue(a) - self.GetCardValue(b);
		});
	},
	SortCardByMax: function SortCardByMax(pokers) {
		var self = this;
		pokers.sort(function (a, b) {
			//return (b&0x0F) - (a&0x0F);
			return self.GetCardValue(b) - self.GetCardValue(a);
		});
	},
	SortCardArrByMin: function SortCardArrByMin(pokers) {
		var self = this;
		pokers.sort(function (a, b) {
			var aValue = a[0];
			var bValue = b[0];
			return self.GetCardValue(aValue) - self.GetCardValue(bValue);
		});
	},
	SortCardArrByMax: function SortCardArrByMax(pokers) {
		var self = this;
		pokers.sort(function (a, b) {
			var aValue = a[0];
			var bValue = b[0];
			return self.GetCardValue(bValue) - self.GetCardValue(aValue);
		});
	},
	copyArr: function copyArr(arr) {
		var res = this.ComTool.DeepCopy(arr);
		return res;
	}
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

cc._RF.pop();