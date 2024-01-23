var app = require("app");

var PokerCard = app.BaseClass.extend({

    /**
     * 构造函数
     */
    Init: function () {
        this.gameName = app["subGameName"];
        this.JS_Name = this.gameName + "_PokerCard";
        this.pokerList = [];

        this.LOGIC_MASK_COLOR = 0xF0;
        this.LOGIC_MASK_VALUE = 0x0F;


        this.LOGIC_MASK_XIAOWANG = 17;
        this.LOGIC_MASK_DAWANG = 18;
        this.LOGIC_MASK_LaiZi = 19;

        this.jiaoPai=0;

        this.NNConst_BeiShu = [[0, 1, 1, 1, 1, 1, 1, 2, 2, 3, 4, 5, 6, 8], [0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 5, 6, 8]];//牌型倍数
        this.LoadAllPokerRes();
    },

    SetJiaoPaiValue:function(value){
        this.jiaoPaiValue=this.GetCardValue(value);
        this.jiaoPaiColor=this.GetCardColor(value);
    },


    SubCardValue: function (poker) {
        let temp = "";
        if (poker.length > 4) {
            temp = poker;
            temp = temp.substring(0, temp.length - 1);
        } else {
            temp = poker;
        }

        return temp;
    },
    GetJiaoPai:function(poker,cardNode){
        let type = "";
        let type_2 = "";
        let type_3 = "";
        let num = "";
        let cardColor = -1;
        let cardValue = -1;
        cardColor = this.GetCardColor(poker);
        cardValue = this.GetCardValue(poker);
        if(cardColor == 64){
            //大小鬼还有癞子
            let numNode = cardNode.getChildByName("num");
            numNode.active = true;
            // numNode.x = -44;
            // numNode.y = 37;
            //大王
            if (cardValue == this.LOGIC_MASK_DAWANG) {
                type = "icon_small_king";
                type_2 = "icon_small_king";
                type_3 = 'icon_dzp';
                num = "";
            }
            //小王
            else if (cardValue == this.LOGIC_MASK_XIAOWANG) {
                type = "icon_small_king";
                type_2 = "icon_small_king";
                type_3 = 'icon_dzp';
                num = "";
            }
            //癞子
            else if (cardValue == this.LOGIC_MASK_LaiZi) {
                type = "bg_lz_1";
                type_2 = "bg_lz_1";
                type_3 = 'icon_dzp';
                num = "";
            }
        }else if (cardValue > 2) {
            let numNode = cardNode.getChildByName("num");
            numNode.active = true;
            if (15 == cardValue) {//跑得快服务端发过来15转为2
                cardValue = 2;
            }
            if (cardColor == 0) {
                type = 'bg_diamond1_1';
                type_2 = 'bg_diamond1_2';
                type_3 = 'icon_dzp';
                num = "red_" + cardValue;
            } else if (cardColor == 16) {
                type = 'bg_club1_1';
                type_2 = 'bg_club1_2';
                type_3 = 'icon_dzp';
                num = "black_" + cardValue;
            } else if (cardColor == 32) {
                type = 'bg_heart1_1';
                type_2 = 'bg_heart1_2';
                type_3 = 'icon_dzp';
                num = "red_" + cardValue;
            } else if (cardColor == 48) {
                type = 'bg_spade1_1';
                type_2 = 'bg_spade1_2';
                type_3 = 'icon_dzp';
                num = "black_" + cardValue;
            }
        }
        cardNode.getChildByName("num").getComponent(cc.Sprite).spriteFrame = '';
        for (let i = 0; i < this.pokerList.length; i++) {
            if (this.pokerList[i]._name == type_2) {
                cardNode.getChildByName("icon_1").getComponent(cc.Sprite).spriteFrame = this.pokerList[i];
                cardNode.getChildByName("icon_1").active = true;
            } else if (this.pokerList[i]._name == num) {
                cardNode.getChildByName("num").getComponent(cc.Sprite).spriteFrame = this.pokerList[i];
                cardNode.getChildByName("num").active = true;
            }
        }
    },
    GetPokeCard: function (poker, cardNode, sameCardNum, isShowIcon1 = true, isShowLandowner = false, hideBg = false, isRazz = false) {
        if (0 == poker)
            return;
        let type = "";
        let type_2 = "";
        let type_3 = "";
        let num = "";
        let cardColor = -1;
        let cardValue = -1;
        let isRed = true;
        cardNode.getChildByName("bg_poker").active = true;
        if (JSON.stringify(sameCardNum) != "{}") {
            /*cardNode.getChildByName("cardNum").color = cc.color(255, 255, 255);
            cardNode.getChildByName("cardNum").active = false;
            cardNode.getChildByName("cardNum").getComponent(cc.Label).string = "";*/
        }
        cardColor = this.GetCardColor(poker);
        cardValue = this.GetCardValue(poker);

       /* if(cardValue==this.jiaoPaiValue && cardColor==this.jiaoPaiColor){
            cardNode.getChildByName('img_jiao').active=true;
            cardNode.getChildByName("bg_poker").color = cc.color(255, 255, 0);
            cardNode.tagsJin=true;
        }else{
            cardNode.getChildByName('img_jiao').active=false;
            cardNode.getChildByName("bg_poker").color = cc.color(255, 255,255);
            cardNode.tagsJin=false;
        }*/


        if(cardColor == 64){
            //大小鬼还有癞子
            let numNode = cardNode.getChildByName("num");
            numNode.active = true;
            // numNode.x = -44;
            // numNode.y = 37;
            //大王
            if (cardValue == this.LOGIC_MASK_DAWANG) {
                type = "icon_big_king";
                type_2 = "icon_big_king_01";
                type_3 = 'icon_dzp';
                num = "";
            }
            //小王
            else if (cardValue == this.LOGIC_MASK_XIAOWANG) {
                type = "icon_small_king";
                type_2 = "icon_small_king_01";
                type_3 = 'icon_dzp';
                num = "";
            }
            //癞子
            else if (cardValue == this.LOGIC_MASK_LaiZi) {
                type = "bg_lz_1";
                type_2 = "bg_lz_2";
                type_3 = 'icon_dzp';
                num = "";
            }
        }else if (cardValue > 2) {
            let numNode = cardNode.getChildByName("num");
            numNode.active = true;
            if (15 == cardValue) {//跑得快服务端发过来15转为2
                cardValue = 2;
            }
            if (cardColor == 0) {
                type = 'bg_diamond1_1';
                type_2 = 'bg_diamond1_2';
                type_3 = 'icon_dzp';
                num = "red_" + cardValue;
            } else if (cardColor == 16) {
                type = 'bg_club1_1';
                type_2 = 'bg_club1_2';
                type_3 = 'icon_dzp';
                num = "black_" + cardValue;
            } else if (cardColor == 32) {
                type = 'bg_heart1_1';
                type_2 = 'bg_heart1_2';
                type_3 = 'icon_dzp';
                num = "red_" + cardValue;
            } else if (cardColor == 48) {
                type = 'bg_spade1_1';
                type_2 = 'bg_spade1_2';
                type_3 = 'icon_dzp';
                num = "black_" + cardValue;
            }

        }
        //如果是癞子牌,替换掉点数
        if (isRazz) {
            type = 'bg_lz_1';
            type_2 = "bg_lz_2";
        }
        cardNode.getChildByName("num").getComponent(cc.Sprite).spriteFrame = '';
        for (let i = 0; i < this.pokerList.length; i++) {
            if (this.pokerList[i]._name == type) {
                if (isShowIcon1 == false && (type == "icon_big_king" || type == "icon_small_king")) {
                    //大小王不在最后一根，不显示icon
                    cardNode.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = '';
                } else {
                    cardNode.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.pokerList[i];
                }
                cardNode.getChildByName("icon").active = true;
            } else if (this.pokerList[i]._name == type_2) {
                if (isShowIcon1 == true || type == "icon_big_king" || type == "icon_small_king") { //大小王必须显示icon_1
                    cardNode.getChildByName("icon_1").getComponent(cc.Sprite).spriteFrame = this.pokerList[i];
                } else {
                    cardNode.getChildByName("icon_1").getComponent(cc.Sprite).spriteFrame = '';
                }
                cardNode.getChildByName("icon_1").active = true;
            } else if (this.pokerList[i]._name == type_3 && cardNode.getChildByName("icon_2")) {
                if (isShowLandowner) {
                    cardNode.getChildByName("icon_2").active = true;
                } else {
                    cardNode.getChildByName("icon_2").active = false;
                }
            } else if (this.pokerList[i]._name == num) {
                cardNode.getChildByName("num").getComponent(cc.Sprite).spriteFrame = this.pokerList[i];
                cardNode.getChildByName("num").active = true;
            }
        }

        if (hideBg)
            cardNode.getChildByName("poker_back").active = false;
        if (cardValue < this.LOGIC_MASK_LaiZi) {
            if (JSON.stringify(sameCardNum) != "{}") {
                for (let key in sameCardNum) {
                    if (sameCardNum[key]["isShow"]) {
                        continue;
                    }
                    if (!sameCardNum[key]["isShow"] && key == cardValue) {
                        cardNode.getChildByName("cardNum").getComponent(cc.Label).string = sameCardNum[key]["num"];
                        cardNode.getChildByName("cardNum").active = true;
                        cardNode.getChildByName("cardNum").color = cc.color(34, 34, 253);
                        sameCardNum[key]["isShow"] = true;
                        break;
                    }
                }
            }
        }
    },
    GetSGPokerTypeStr: function (cards, cardType, bSpecialNum = false) {//specialNum 8点倍数
        if (3 != cards.length)
            return;
        let data = {};
        data.typeStr = '';
        data.isBigCard = false;
        data.beiShu = 0;
        data.useRedColor = true;
        if (0 == cardType) {
            let curValue = this.GetSGValue(cards);
            data.typeStr = curValue.toString();
            data.typeStr += '点';
            if (curValue < 8)
                data.beiShu = 1;
            else if (8 == curValue && !bSpecialNum)
                data.beiShu = 2;
            else
                data.beiShu = 3;

            data.useRedColor = false;
        } else if (101 == cardType ||
            102 == cardType) {
            if (101 == cardType)
                data.typeStr = '单公';
            else
                data.typeStr = '双公';

            let curValue = this.GetSGValue(cards);
            if (curValue < 8)
                data.beiShu = 1;
            else if (8 == curValue && !bSpecialNum)
                data.beiShu = 2;
            else
                data.beiShu = 3;
            // curValue += 97;//to a
            // data.typeStr += String.fromCharCode(curValue);
            // data.typeStr += '电';
            data.typeStr += curValue.toString();
            data.typeStr += '点';
            data.useRedColor = false;
        } else if (103 == cardType) {
            data.typeStr = '混三功';
            data.beiShu = 5;
            data.isBigCard = true;
        } else if (104 == cardType) {
            data.typeStr = '小三功';
            data.beiShu = 7;
            data.isBigCard = true;
        } else if (105 == cardType) {
            data.typeStr = '大三功';
            data.beiShu = 9;
            data.isBigCard = true;
        } else if (106 == cardType) {
            data.typeStr = '至尊';
            data.beiShu = 9;
            data.isBigCard = true;
        }
        return data;
    },
    GetSGValue: function (cards) {
        let value0 = this.GetCardValue(cards[0]);
        let value1 = this.GetCardValue(cards[1]);
        let value2 = this.GetCardValue(cards[2]);
        if (value0 >= 10)
            value0 = 10;
        if (value1 >= 10)
            value1 = 10;
        if (value2 >= 10)
            value2 = 10;
        let needValue = value0 + value1 + value2;
        needValue = needValue % 10;
        return needValue;
    },
    GetZJHPokerTypeStr: function (cardValues, cardType = -1) {//cardValues客户端自己算
        let data = {};
        data.typeStr = '';
        data.isBigCard = false;
        data.beiShu = 0;
        if (-1 != cardType) {
            if (0 == cardType)
                data.typeStr = '散排';
            else if (101 == cardType)//对子
                data.typeStr = '对子';
            else if (102 == cardType)//顺子
                data.typeStr = '顺子';
            else if (103 == cardType)//金华
                data.typeStr = '金花';
            else if (104 == cardType) {//顺金
                data.typeStr = '顺金';
                data.isBigCard = true;
            } else if (105 == cardType) {//豹子
                data.typeStr = '豹子';
                data.isBigCard = true;
            } else if (106 == cardType)//特殊
                data.typeStr = '散排';
            return data;
        }

        if (!cardValues || 3 != cardValues.length) {
            this.ErrLog('GetZJHPokerTypeStr Error');
            return;
        }
        cardValues.sort(this.NormalPokerSort);
        if (this.IsZhaDanByZJH(cardValues)) {
            data.typeStr = '豹子';
            data.isBigCard = true;
        } else if (this.IsTongHuaByZJH(cardValues)) {
            if (this.IsShunZiByZJH(cardValues)) {
                data.typeStr = '顺金';
                data.isBigCard = true;
            } else
                data.typeStr = '金花';
        } else if (this.IsShunZiByZJH(cardValues))
            data.typeStr = '顺子';
        else if (this.IsDuiZiByZJH(cardValues))
            data.typeStr = '对子';
        else
            data.typeStr = '散排';

        return data;
    },
    LoadAllPokerRes: function () {
         let self = this;
        if (0 != this.pokerList.length)
            return;
        cc.loader.loadResDir("texture/new_poker", cc.SpriteFrame, function (err, assets) {
            if (err) {
                cc.error(err);
                return;
            }
            for (let i = 0; i < assets.length; i++) {
                self.pokerList.push(assets[i]);
            }
        });
    },
    NormalPokerSort: function (a, b) {
        let aValue = a & 0x0F;
        let bValue = b & 0x0F;
        return aValue - bValue;
    },
    NNPokerSort: function (pokers) {
        if (0 == pokers.length)
            return [];
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
            } else {
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
        } else
            allValue += curValue1;

        if (curValue2 > 10) {
            if (14 == curValue1)
                allValue += 1;
            else
                allValue += 10;
        } else
            allValue += curValue2;

        if (curValue3 > 10) {
            if (14 == curValue1)
                allValue += 1;
            else
                allValue += 10;
        } else
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
            } else {
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
    GetCardValue:function(poker) {
        //大小王值最大
        if (poker == 65 || poker == 145 || poker == 225)
            return this.LOGIC_MASK_XIAOWANG;
        if (poker == 66 || poker == 146 || poker == 226)
            return this.LOGIC_MASK_DAWANG;
        return poker&this.LOGIC_MASK_VALUE;
    },

    //获取花色
    GetCardColor:function(poker) {
        let color = poker&this.LOGIC_MASK_COLOR;
        while(color >= 80){
            color -= 80;
        }
        return color;
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