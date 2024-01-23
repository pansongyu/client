"use strict";
cc._RF.push(module, '648fcrqakRED6GfeIh8mN05', 'pysft_winlost_child');
// script/ui/uiGame/pysft/pysft_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
    extends: require("BaseMJ_winlost_child"),

    properties: {
        prefab_zhadan: cc.Prefab,
        prefab_card: cc.Prefab,
        lb1: cc.Label,
        lbSportsPoint: cc.Label
    },

    // use this for initialization
    OnLoad: function OnLoad() {
        this.ComTool = app.ComTool();
        this.ShareDefine = app.ShareDefine();
        this.PokerCard = require("jayxddz_PokerCard").GetModel();
        this.LOGIC_MASK_COLOR = 0xF0;
        this.LOGIC_MASK_VALUE = 0x0F;
    },
    ShowPlayerJieSuan: function ShowPlayerJieSuan() {},
    ShowPlayerHuaCard: function ShowPlayerHuaCard() {},

    ShowPlayerHuImg: function ShowPlayerHuImg(huNode, huTypeName) {
        /*huLbIcon
         *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
         *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
         */
        var huType = this.ShareDefine.HuTypeStringDict[huTypeName];
        if (typeof huType == "undefined") {
            huNode.getComponent(cc.Label).string = '';
        } else if (huType == this.ShareDefine.HuType_DianPao) {
            huNode.getComponent(cc.Label).string = '点泡';
        } else if (huType == this.ShareDefine.HuType_JiePao) {
            huNode.getComponent(cc.Label).string = '接炮';
        } else if (huType == this.ShareDefine.HuType_ZiMo) {
            huNode.getComponent(cc.Label).string = '自摸';
        } else if (huType == this.ShareDefine.HuType_QGH) {
            huNode.getComponent(cc.Label).string = '抢杠胡';
        } else {
            huNode.getComponent(cc.Label).string = '';
        }
    },

    onPlusScore: function onPlusScore(s) {
        if (s > 0) {
            return '+' + s;
        }
        return s;
    },


    ShowPlayerData: function ShowPlayerData(setEnd, playerAll, index) {
        var jin1 = setEnd.jin1;
        var jin2 = setEnd.jin2;
        var dPos = setEnd.dPos;
        var posResultList = setEnd["posResultList"];
        // console.error("posResultList", posResultList);
        var posHuArray = new Array();
        var posCount = posResultList.length;
        for (var i = 0; i < posCount; i++) {
            var posInfo = posResultList[i];
            var pos = posInfo["pos"];
            var posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
            posHuArray[pos] = posHuType;
        }
        var PlayerInfo = playerAll[index];
        this.node.active = true;
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2);
        var huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
        this.ShowPlayerHuImg(huNode, posResultList[index]['huType']);

        if (dPos === index) {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
        } else {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
        }
        //显示头像，如果头像UI
        if (PlayerInfo["pid"] && PlayerInfo["iconUrl"]) {
            app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"], PlayerInfo["iconUrl"]);
        }
        var weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);

        //
        var posEndList = posResultList[index];

        //显示头游
        var str = '';
        //输赢分
        // str += '捡分:';
        // str += this.onPlusScore(posEndList["count510KPoint"]) + '  ';

        // //赏数
        // str += '墩分:';
        // str += this.onPlusScore(posEndList["dunPoint"]) + '  ';

        // //赏数
        // str += '墩数:';
        // let boomRewardTotal = posEndList["boomRewardTotal"];
        // // let minBoomRewardTotal = posEndList["minBoomRewardTotal"];
        // // let subOne = posEndList["subOne"];
        // // let subTwo = posEndList["subTwo"];
        // // str += boomRewardTotal + "(" + subOne + "-" + subTwo + ")" + '  ';
        // str += boomRewardTotal + '  ';

        // str += '总分:';
        // str += this.onPlusScore(posEndList.point) + '  ';

        this.lb1.string = str;

        if (typeof posEndList.sportsPoint != "undefined") {
            this.lbSportsPoint.string = '比赛分:' + posEndList.sportsPoint;
        } else {
            this.lbSportsPoint.string = '';
        }
        // posEndList.dunCardList = [
        //     403
        // 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E,   //方块 2-A
        // 0x13, 0x14, 0x32, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E,   //梅花 2-A
        // 0x13, 0x14, 0x32, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E,   //梅花 2-A
        // 0x43,
        // 0x02,

        // 0x15, 0x15, 0x15, 0x15, 0x15, 0x15,
        // 0x041,
        // 146,
        // 0x042,
        // 0x02,
        // 0x12,
        // 0x22,
        // 0x32,
        // 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F,
        // 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F,
        // 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D, 0x2E, 0x2F,
        // 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E, 0x3F,
        // 0x0E,
        // 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E,   //方块 2-A
        // 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E,   //梅花 2-A
        // 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D, 0x2E,   //红桃 2-A
        // 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A,
        // 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A,
        // 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A,
        // 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A,
        // // 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E,

        // 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E,   //方块 2-A
        // 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E,   //梅花 2-A
        // 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D, 0x2E,   //红桃 2-A
        // 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A,
        // 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A,
        // 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A,
        // 67,
        // 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4A, 0x4B, 0x4C, 0x4D, 0x4E, 0x4F, //花王
        // 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9A, 0x9B, 0x9C, 0x9D, 0x9E, 0x9F //花王
        // ];
        // this.ShowCardList(this.node.getChildByName("cardList"), posEndList.dunCardList);
        // this.ShowCardList(this.node.getChildByName("cardList"), posEndList.shouCard);


        //
        // if (posEndList.totalPoint > 0) {
        //     PlayerNode.getChildByName('lb_zdf').getComponent(cc.Label).string = "+" + posEndList.totalPoint;
        // } else {
        //     PlayerNode.getChildByName('lb_zdf').getComponent(cc.Label).string = posEndList.totalPoint;
        // }

        //显示牌
        /*let prizeCardList = [];
         let zhaDanLayOut = this.node.getChildByName('zhadan');
         zhaDanLayOut.removeAllChildren();
         console.log('当前显示的玩家是', posEndList);
         let prizeCard = posEndList.prizeCardList;//[cardList:{}]
         for (let l = 0; l < prizeCard.length; l++) {
         prizeCardList.push(prizeCard[l]);
         this.createZhaDanNode(zhaDanLayOut, l);
         }
          for (let j = 0; j < zhaDanLayOut.children.length; j++) {
         let paiNode = zhaDanLayOut.getChildByName('zhadan' + j);
         if (prizeCardList[j]) {
         let pailist = prizeCardList[j].slice(2,prizeCardList[j].length);
         let zhashu = pailist.length;
         paiNode.getChildByName('lb_num').getComponent(cc.Label).string = 'x' + zhashu;
         let num = zhashu;
         this.createCardNode(paiNode, num);
         for (let k = 0; k < num; k++) {
         let cardNode = paiNode.getChildByName('layout').getChildByName('handCard' + (k + 1));
         let cardValue = pailist[k];
         if (cardValue) {
         let cardRealValue = this.PokerCard.GetCardValue(cardValue);
         let isRazz=false;
         if(cardRealValue==19){
         isRazz=true;
         cardValue=pailist[0];  //换成癞子显示
         }
         if (k + 1 == pailist.length) {
         this.ShowCard(cardValue, cardNode,num, true, false, false, isRazz);
         } else {
         this.ShowCard(cardValue, cardNode,0, false, false, false, isRazz);
         }
         cardNode.active = true;
         } else {
         cardNode.active = false;
         }
          }
         paiNode.active = true;
         } else {
         paiNode.active = false;
         }
          }*/
    },

    // ShowCardList: function (parent, allCardList) {
    //     let cardPrefabNode = this.node.getChildByName("cardPrefab");
    //     let shouCard = this.SortCardKeysFromBigToSmaleByZhangCount(allCardList);
    //     let sameValueObj = this.GetSameValueObj2(allCardList);
    //     console.error("shouCard: ", shouCard);
    //     console.error("sameValueObj: ", sameValueObj);
    //     parent.removeAllChildren();
    //     for (let i = 0; i < shouCard.length; i++) {
    //         let pokerValue = shouCard[i];
    //         let cardNode = cc.instantiate(cardPrefabNode);
    //         parent.addChild(cardNode);
    //         cardNode.pokerValue = pokerValue;
    //         cardNode.tags = pokerValue;
    //         cardNode.name = "handCard" + (i + 1);
    //         cardNode.active = true;
    //         let cardValue = this.GetCardValue(pokerValue, shouCard);
    //         let cardList = sameValueObj[cardValue];
    //         if (!cardList) {
    //             console.error("cardValue 不存在===========: ", cardValue, pokerValue);
    //             cardList = [];
    //         } else {
    //             console.error("cardValue ===========: ", cardValue, cardList);
    //         }
    //         let pokerNum = cardList.length > 3 ? cardList.length : 0;
    //         // 有花王牌面则显示花王
    //         // 有大王牌面则显示大王
    //         // 有小王牌面则显示大王
    //         if (cardValue == 17 && cardList.length >= 4) {
    //             if (this.HaveHuaWang(cardList)) {
    //                 pokerValue = 0x43;
    //             } else if (this.HaveBigWang(cardList)) {
    //                 pokerValue = 0x42;
    //             } else {
    //                 pokerValue = 0x41;
    //             }
    //         }

    //         if (i + 1 == shouCard.length) {
    //             this.ShowCard(pokerValue, cardNode, pokerNum, true, false, false, false, cardValue);
    //         } else {
    //             this.ShowCard(pokerValue, cardNode, pokerNum, false, false, false, false, cardValue);
    //         }
    //     }
    // },


    ShowCardList: function ShowCardList(parent, allCardList) {
        var cardPrefabNode = this.node.getChildByName("cardPrefab");
        parent.removeAllChildren();
        for (var i = 0; i < allCardList.length; i++) {
            var pokerValue = allCardList[i];
            var cardNode = cc.instantiate(cardPrefabNode);
            parent.addChild(cardNode);
            cardNode.pokerValue = pokerValue;
            cardNode.tags = pokerValue;
            cardNode.name = "handCard" + (i + 1);
            cardNode.active = true;
            if (i + 1 == allCardList.length) {
                this.ShowCard(pokerValue, cardNode, 0, true, false, false, false);
            } else {
                this.ShowCard(pokerValue, cardNode, 0, false, false, false, false);
            }
        }
    },

    SortCardKeysFromBigToSmaleByZhangCount: function SortCardKeysFromBigToSmaleByZhangCount(pokers) {
        var sameValueObj = this.GetSameValueObj2(pokers);
        var cardValues = Object.keys(sameValueObj);

        for (var idx = 0; idx < cardValues.length; idx++) {
            cardValues[idx] = Number(cardValues[idx]);
        }
        // this.SortCardByMax(cardValues);// 大到小
        this.SortZhangCountBigToSmale(cardValues, sameValueObj);

        var cards = [];
        for (var i = 0; i < cardValues.length; i++) {
            var cardValue = cardValues[i];
            var cardList = sameValueObj[cardValue];
            if (cardList.length < 4) {
                cards = cards.concat(cardList);
            } else {
                cards.push(cardList[0]);
            }
        }
        return cards;
    },

    SortZhangCountBigToSmale: function SortZhangCountBigToSmale(cardValues, sameValueObj) {
        cardValues.sort(function (a, b) {
            return sameValueObj[b].length - sameValueObj[a].length;
        });
    },

    GetSameValueObj2: function GetSameValueObj2(pokers) {
        var sameValueList = {};
        for (var i = 0; i < pokers.length; i++) {
            var poker = pokers[i];
            var pokerValue = this.GetCardValue(poker, pokers);
            // if (this.IsLaiZiCard(poker)) {
            //     // 除癞子牌和大小王
            //     continue;
            // }

            sameValueList[pokerValue] = sameValueList[pokerValue] || [];
            sameValueList[pokerValue].push(poker);
        }
        return sameValueList;
    },

    //获取牌值
    GetCardValue: function GetCardValue(poker, allCard) {
        // this.wanCards = this.GetWanCardPoker(allCard);
        // if (this.wanCards.length >= 4) {
        //     if (this.IsSmallPoker(poker) ||
        //         this.IsBigPoker(poker) ||
        //         this.IsHuaWang(poker)) {
        //         return 17;
        //     }
        // } else {
        //     if (this.IsSmallPoker(poker)) {
        //         return 17;
        //     }

        //     if (this.IsBigPoker(poker)) {
        //         return 18;
        //     }

        //     if (this.IsHuaWang(poker)) {
        //         return 18;
        //     }
        // }
        if (this.IsSmallPoker(poker)) {
            return 17;
        }

        if (this.IsBigPoker(poker)) {
            return 18;
        }

        if (this.IsHuaWang(poker)) {
            return 18;
        }

        poker = poker & this.LOGIC_MASK_VALUE;

        if (poker == 2) {
            return 15;
        }

        return poker;
    },

    GetRenderCardValue: function GetRenderCardValue(poker) {
        if (this.IsSmallPoker(poker)) {
            return 17;
        }

        if (this.IsBigPoker(poker)) {
            return 18;
        }

        if (this.IsHuaWang(poker)) {
            return 19;
        }

        // if (this.IsSmallPoker(poker) ||
        //     this.IsBigPoker(poker) ||
        //     this.IsHuaWang(poker)) {
        //     return 17;
        // }

        poker = poker & this.LOGIC_MASK_VALUE;

        if (poker == 2) {
            return 15;
        }

        return poker;
    },

    GetWanCardPoker: function GetWanCardPoker(pokers) {
        if (!pokers) {
            console.error("pokers: ", pokers);
        }
        var wanCards = [];
        for (var i = 0; i < pokers.length; i++) {
            var poker = pokers[i];
            if (this.IsSmallPoker(poker) || this.IsBigPoker(poker) || this.IsHuaWang(poker)) {
                wanCards.push(poker);
            }
        }
        return wanCards;
    },

    IsBigPoker: function IsBigPoker(poker) {
        poker = poker % 80;
        if (poker == 66) {
            return true;
        }
        return false;
    },

    IsSmallPoker: function IsSmallPoker(poker) {
        poker = poker % 80;
        if (poker == 65) {
            return true;
        }
        return false;
    },

    IsHuaWang: function IsHuaWang(poker) {
        var huaWans = [0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4A, 0x4B, 0x4C, 0x4D, 0x4E, 0x4F, //花王
        0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9A, 0x9B, 0x9C, 0x9D, 0x9E, 0x9F];
        var isFind = huaWans.indexOf(poker) > -1;
        return isFind;
    },

    HaveBigWang: function HaveBigWang(pokers) {
        for (var i = 0; i < pokers.length; i++) {
            var poker = pokers[i];
            if (this.IsBigPoker(poker)) {
                return true;
            }
        }
        return false;
    },

    HaveSmallWang: function HaveSmallWang(pokers) {
        for (var i = 0; i < pokers.length; i++) {
            var poker = pokers[i];
            if (this.IsSmallPoker(poker)) {
                return true;
            }
        }
        return false;
    },

    HaveHuaWang: function HaveHuaWang(pokers) {
        for (var i = 0; i < pokers.length; i++) {
            var poker = pokers[i];
            if (this.IsHuaWang(poker)) {
                return true;
            }
        }
        return false;
    },

    ShowCard: function ShowCard(cardType, cardNode, sameCardNum, isLastCard) {
        var isShowLandowner = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
        var hideBg = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
        var isRazz = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
        var cardValue = arguments[7];

        cardNode.active = true;
        if (cardType == 0) {
            cardNode.getChildByName("poker_back").active = true;
            return;
        } else {
            cardNode.getChildByName("poker_back").active = false;
        }
        this.PokerCard.GetPokeCard(cardType, cardNode, sameCardNum, isLastCard, isShowLandowner, hideBg, isRazz, cardValue);
    },

    createCardNode: function createCardNode(paiNode, num) {
        var layOutNode = paiNode.getChildByName('layout');
        layOutNode.removeAllChildren();
        for (var i = 1; i < num + 1; i++) {
            var card = cc.instantiate(this.prefab_card); //this# two
            card.name = "handCard" + i;
            layOutNode.addChild(card);
        }
    },

    createZhaDanNode: function createZhaDanNode(zhaDanLayOut, num) {
        //
        var card = cc.instantiate(this.prefab_zhadan); //this# one
        card.name = "zhadan" + num;
        zhaDanLayOut.addChild(card);
    },

    LabelName: function LabelName(huType) {
        var huTypeDict = {
            QDHu: "七对胡"
        };
        return huTypeDict[huType];
    }
});

cc._RF.pop();