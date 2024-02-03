"use strict";
cc._RF.push(module, 'typdk9c7-0c77-4310-a6bf-8af15c0c7630', 'LogicPDKGame');
// script/game/PDK/GameLogic/LogicPDKGame.js

"use strict";

var app = require("pdk_app");

var LogicPDKGame = app.BaseClass.extend({
    Init: function Init() {
        this.JS_Name = "Logic" + app.subGameName.toUpperCase() + "Game";

        this.ComTool = app[app.subGameName + "_ComTool"]();
        this.WeChatManager = app[app.subGameName + "_WeChatManager"]();
        this.PokerCard = app[app.subGameName + "_PokerCard"]();
        this.RoomSet = app[app.subGameName.toUpperCase() + "RoomSet"]();
        this.Room = app[app.subGameName.toUpperCase() + "Room"]();
        this.Define = app[app.subGameName.toUpperCase() + "Define"]();

        //手牌
        this.handCardList = [];
        //选中的牌
        this.selectCardList = [];
        //上一个玩家出牌的牌型
        this.lastCardType = 0;
        //上一个玩家出牌的牌值
        this.latCardList = [];

        this.Log("Init");

        this.pokerType = [0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, //方块 2-A
        0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, //梅花 2-A
        0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D, 0x2E, //红桃 2-A
        0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E]; //黑桃 2-A

        this.LOGIC_MASK_COLOR = 0xF0;
        this.LOGIC_MASK_VALUE = 0x0F;
    },

    InitHandCard: function InitHandCard() {
        this.handCardList = [];
        this.selectCardList = [];
        this.lastCardType = 0;
        this.lastCardList = [];

        var handCard = this.RoomSet.GetHandCard();
        for (var i = 0; i < handCard.length; i++) {
            var card = handCard[i];
            this.handCardList.push(card);
        }

        this.SortCardByMax(this.handCardList);
        this.TransformValueToC(this.handCardList);
    },

    //如果服务端发过来的牌值有重复，转换成唯一
    TransformValueToC: function TransformValueToC(pokers) {
        for (var i = 0; i < pokers.length; i++) {
            var poker = pokers[i];
            var count = 0;
            for (var j = i; j < pokers.length; j++) {
                if (poker == pokers[j]) {
                    count++;
                }
                if (count >= 2) {
                    pokers[j] = pokers[j] + 500;
                    break;
                }
            }
        }
    },

    //还原客户端转过的牌值
    TransformValueToS: function TransformValueToS(pokers) {
        for (var i = 0; i < pokers.length; i++) {
            if (pokers[i] > 500) {
                pokers[i] = pokers[i] - 500;
            }
        }
    },

    SortCardByMax: function SortCardByMax(pokers) {
        var self = this;
        pokers.sort(function (a, b) {
            //return (b&0x0F) - (a&0x0F);
            return self.GetCardValue(b) - self.GetCardValue(a);
        });
    },

    SortCardByMinEx: function SortCardByMinEx(pokers) {
        var self = this;
        pokers.sort(function (a, b) {
            //return (a&0x0F) - (b&0x0F);
            return self.GetCardValue(a) - self.GetCardValue(b);
        });
    },

    SortCardByMin: function SortCardByMin(pokers) {
        var self = this;
        pokers.sort(function (a, b) {
            var aValue = a[0];
            var bValue = b[0];
            //return (aValue&0x0F) - (bValue&0x0F);
            return self.GetCardValue(aValue) - self.GetCardValue(bValue);
        });
    },

    OutPokerCard: function OutPokerCard(handCardList) {
        this.handCardList = handCardList;
        this.SortCardByMax(this.handCardList);
        this.selectCardList = [];
        //删除handcardlist和selectCardList中的元素
        // for(let i = 0; i < cardList.length; i++){
        //     let value = cardList[i];
        //     let pos = this.handCardList.indexOf(value+500);
        //     if(pos != -1){
        //         this.handCardList.splice(pos,1);
        //     }
        //     else{
        //         let pos1 = this.handCardList.indexOf(value);
        //         if(pos1 != -1){
        //             this.handCardList.splice(pos1,1);
        //         }
        //     }

        //     let cardPos = this.selectCardList.indexOf(value);
        //     if(cardPos != -1){
        //         this.selectCardList.splice(cardPos,1);
        //     }
        // }
        console.log("selectCardList == " + this.selectCardList);
        app[app.subGameName + "Client"].OnEvent("HandCard");
    },

    GetHandCard: function GetHandCard() {
        return this.handCardList;
    },

    GetSelectCard: function GetSelectCard() {
        return this.selectCardList;
    },

    ChangeSelectCard: function ChangeSelectCard(cardList) {
        this.selectCardList = [];
        this.selectCardList = cardList;
    },

    SetCardSelected: function SetCardSelected(cardIdx) {
        var cardType = this.handCardList[cardIdx - 1];
        this.selectCardList.push(cardType);
        console.log("selectCardList == " + this.selectCardList);
    },

    DeleteCardSelected: function DeleteCardSelected(cardIdx) {
        var cardType = this.handCardList[cardIdx - 1];
        var pos = this.selectCardList.indexOf(cardType);
        if (pos != -1) {
            this.selectCardList.splice(pos, 1);
        }
        console.log("selectCardList111 == " + this.selectCardList);
    },

    SetCardData: function SetCardData(opCardType, cardList) {
        if (opCardType == 1 || !cardList.length) {
            return;
        }

        if (this.lastCardType == 0 || opCardType == 11) {
            this.lastCardType = opCardType;
        }

        console.log("this.lastCardTyp ==" + this.lastCardType);
        this.lastCardList = cardList;
    },


    ClearCardData: function ClearCardData() {
        this.lastCardType = 0;
        this.lastCardList = [];
    },

    GetLastCardType: function GetLastCardType() {
        return this.lastCardType;
    },

    //检查组合是否只有炸弹
    CheckOnlyBoom: function CheckOnlyBoom(list) {
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var sameCard = this.GetSameValue(item, item[0]);
            if (sameCard.length != item.length) return false;
        }
        return true;
    },

    CheckOneCard: function CheckOneCard() {
        var isSelectCard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        var pokers = [];
        if (isSelectCard == false) {
            pokers = this.handCardList;
        } else {
            pokers = this.selectCardList;
        }
        this.SortCardByMax(pokers);
        if (pokers.length != 1) return false;
        var lastCardValue = 0;
        var myCardValue = 0;

        lastCardValue = this.GetCardValue(this.lastCardList[0]);
        myCardValue = this.GetCardValue(pokers[0]);

        if (lastCardValue && lastCardValue != 0) {
            if (this.lastCardList.length != pokers.length) return false;
            if (myCardValue > lastCardValue) {
                return true;
            }
            return false;
        }

        return true;
    },

    CheckDuizi: function CheckDuizi() {
        var isSelectCard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        var pokers = [];
        if (isSelectCard == false) {
            pokers = this.handCardList;
        } else {
            pokers = this.selectCardList;
        }
        this.SortCardByMax(pokers);
        if (pokers.length != 2) return false;

        var lastCardValue = 0;
        var myCardValue = 0;
        var bDui = false;

        lastCardValue = this.GetCardValue(this.lastCardList[0]);

        for (var i = 0; i < pokers.length; i++) {
            var poker = pokers[i];
            var duizi = this.GetSameValue(pokers, poker);
            if (duizi.length == 2) {
                myCardValue = this.GetCardValue(poker);
                bDui = true;
                break;
            }
        }

        if (lastCardValue && lastCardValue != 0) {
            if (this.lastCardList.length != pokers.length) return false;

            if (myCardValue > lastCardValue) {
                return true;
            }
            return false;
        }

        if (bDui) return true;
        return false;
    },

    CheckShunzi: function CheckShunzi() {
        var isSelectCard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        var pokers = [];
        if (isSelectCard == false) {
            pokers = this.handCardList;
        } else {
            pokers = this.selectCardList;
        }
        this.SortCardByMax(pokers);
        if (pokers.length < 5) return false;

        var lastCardValue = 0;
        var myCardValue = 0;

        this.SortCardByMax(this.lastCardList);
        this.SortCardByMax(pokers);

        var lastValue = 0;
        for (var i = 0; i < pokers.length; i++) {
            var poker = pokers[i];
            var nowValue = this.GetCardValue(poker);

            if (nowValue == 15) {
                return false;
            }

            if (lastValue != 0) {
                if (lastValue - nowValue != 1) return false;
            }

            lastValue = nowValue;
        }

        lastCardValue = this.GetCardValue(this.lastCardList[0]);
        myCardValue = this.GetCardValue(pokers[0]);

        if (lastCardValue && lastCardValue != 0) {
            if (this.lastCardList.length != pokers.length) return false;

            if (myCardValue > lastCardValue) {
                return true;
            }
            return false;
        }

        return true;
    },

    //如果最后首发只有三带 可以不带牌出, isSelectCard如果为false那么就是判断所有手牌是否满足最后一手牌直接出
    CheckLastThree: function CheckLastThree(tag, lastCard) {
        var isSelectCard = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        var pokers = [];
        if (isSelectCard) {
            pokers = this.selectCardList;
        } else {
            pokers = this.handCardList;
        }
        if (this.lastCardType == 0) {
            if (pokers.length != lastCard || this.handCardList.length != lastCard) {
                return false;
            }

            var isCheck = false;
            for (var i = 0; i < pokers.length; i++) {
                var poker = pokers[i];
                var samePoker = this.GetSameValue(pokers, poker);
                if (samePoker.length >= tag) {
                    isCheck = true;
                    break;
                }
            }
            if (isCheck) {
                return true;
            }
        }
        return false;
    },

    CheckSanDaiSiDai: function CheckSanDaiSiDai(tag) {
        var isSelectCard = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        if (tag == 5) {
            if (!this.CheckLastThree(3, 3, isSelectCard) && this.lastCardType == 0) {
                //没有三不带的玩法 不检测
                if (!this.Room.GetRoomWanfa(this.Define.SEVER_BUDAI3)) return false;
            }
        } else if (tag == 6) {
            if (!this.CheckLastThree(3, 4, isSelectCard) && this.lastCardType == 0) {
                //没有三带一的玩法 不检测
                if (!this.Room.GetRoomWanfa(this.Define.SEVER_DAI31)) return false;
            }
        } else if (tag == 7) {
            // //没有三带二的玩法 不检测
            if (!this.Room.GetRoomWanfa(this.Define.SEVER_DAI32)) return false;
        } else if (tag == 8) {
            //没有四带一的玩法 不检测
            if (!this.Room.GetRoomWanfa(this.Define.SEVER_BMUSTBOMB)) return false;
            if (!this.CheckLastThree(4, 5, isSelectCard) && this.lastCardType == 0) {
                if (!this.Room.GetRoomSiDai(0)) return false;
            }
        } else if (tag == 9) {
            //没有四带二的玩法 不检测
            if (!this.Room.GetRoomWanfa(this.Define.SEVER_BMUSTBOMB)) return false;
            if (!this.CheckLastThree(4, 6, isSelectCard) && this.lastCardType == 0) {
                if (!this.Room.GetRoomSiDai(1)) return false;
            }
        } else if (tag == 10) {
            //没有四带三的玩法 不检测
            if (!this.Room.GetRoomWanfa(this.Define.SEVER_BMUSTBOMB)) return false;
            if (!this.Room.GetRoomWanfa(this.Define.SEVER_DAI43)) {
                if (!this.Room.GetRoomSiDai(2)) return false;
            }
        }

        var pokers = [];
        if (isSelectCard == false) {
            pokers = this.handCardList;
        } else {
            pokers = this.selectCardList;
        }
        this.SortCardByMax(pokers);
        var handPokers = this.handCardList;
        if (pokers.length < 3) return false;

        var lastCardValue = 0;
        var myCardValue = 0;
        var tempArrA = [];
        var tempArrB = [];

        for (var i = 0; i < this.lastCardList.length; i++) {
            var poker = this.lastCardList[i];
            var samePoker = this.GetSameValue(this.lastCardList, poker);
            if (tag >= 5 && tag <= 7) {
                if (samePoker.length >= 3) {
                    this.RegularCard(tempArrA, samePoker, 3);
                    //tempArrA = samePoker;
                    break;
                }
            } else if (tag >= 8 && tag <= 10) {
                if (samePoker.length >= 4) {
                    this.RegularCard(tempArrA, samePoker, 4);
                    //tempArrA = samePoker;
                    break;
                }
            }
        }

        for (var _i = 0; _i < pokers.length; _i++) {
            var _poker = pokers[_i];
            var _samePoker = this.GetSameValue(pokers, _poker);
            if (tag >= 5 && tag <= 7) {
                if (_samePoker.length >= 3) {
                    this.RegularCard(tempArrB, _samePoker, 3);
                    //tempArrB = samePoker;
                    break;
                }
            } else if (tag >= 8 && tag <= 10) {
                if (_samePoker.length >= 4) {
                    this.RegularCard(tempArrB, _samePoker, 4);
                    //tempArrB = samePoker;
                    break;
                }
            }
        }
        if (tempArrA.length) {
            lastCardValue = this.GetCardValue(tempArrA[0][0]);
        }

        if (tempArrB.length) {
            myCardValue = this.GetCardValue(tempArrB[0][0]);
        }
        var daiCardList = this.GetDaiPaiList(pokers, tempArrB);
        if (lastCardValue && lastCardValue != 0) {
            if (isSelectCard && this.lastCardList.length != pokers.length && handPokers.length > pokers.length && !this.CheckTagIsDuizi(daiCardList)) return false;else {
                //如果牌值为A并且存在3A炸
                if (myCardValue == 14 && this.Room.GetRoomWanfa(this.Define.SEVER_AAA)) {
                    //如果存在炸弹可拆玩法  可出
                    if (!this.Room.GetRoomWanfa(this.Define.SEVER_BMUSTBOMB)) {
                        return false;
                    }
                }
            }
            //如果是用手牌来判断最后一手牌能不能出，则不能超过上把牌的长度
            if (!isSelectCard && pokers.length > this.lastCardList.length) {
                return false;
            }
            if (myCardValue > lastCardValue) {
                if (tag == 6) {
                    //三带一玩法不判断带牌
                    return true;
                } else if (tag == 7) {
                    return true;
                } else if (tag == 8 && this.lastCardList.length == pokers.length) {
                    //四带一并且长度相等可以压
                    return true;
                } else if (tag == 9 && this.lastCardList.length == pokers.length) {
                    //四带二并且长度相等可以压
                    return true;
                } else if (tag == 10 && this.lastCardList.length == pokers.length) {
                    //四带三并且长度相等可以压
                    return true;
                } else if (tag == 10 && pokers.length >= 5 && this.handCardList.length == pokers.length) {
                    //最后一首直接出
                    return true;
                }
            }
            return false;
        }
        if (tempArrB.length) {
            if (tag == 5) {
                if (pokers.length == 3) {
                    return true;
                }
            } else if (tag == 6) {
                if (pokers.length == 4) {
                    return true;
                }
            } else if (tag == 7) {
                //还需判断是否最后一手牌能出完
                if (pokers.length == 5) {
                    return true;
                } else if (pokers.length <= 5) {
                    //是不是最后一首，如果是。也可以出
                    if (this.handCardList.length <= 5 && this.handCardList.length == pokers.length) {
                        return true;
                    }
                }
            } else if (tag == 8) {
                if (pokers.length == 5) {
                    return true;
                }
            } else if (tag == 9) {
                if (pokers.length == 6) {
                    return true;
                } else if (pokers.length < 6) {
                    //是不是最后一首，如果是。也可以出
                    if (this.handCardList.length < 6 && this.handCardList.length == pokers.length) {
                        return true;
                    }
                }
            } else if (tag == 10) {
                //还需判断是否最后一手牌能出完
                if (pokers.length == 7) {
                    return true;
                } else if (pokers.length < 7) {
                    //是不是最后一首，如果是。也可以出
                    if (this.handCardList.length < 7 && this.handCardList.length == pokers.length) {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    IsZhadan: function IsZhadan(pokers) {
        var temp = [];
        for (var i = 0; i < pokers.length; i++) {
            var poker = pokers[i];
            var zhadan = this.GetSameValue(pokers, poker);
            if (zhadan.length >= 4) {
                temp = zhadan;
                break;
            }
            //是否有3A炸玩法
            // if(this.Room.GetRoomWanfa(this.Define.PDK_WANFA_3AZHA)){
            if (this.Room.GetRoomWanfa(this.Define.SEVER_AAA)) {
                if (zhadan.length == 3 && this.GetCardValue(zhadan[0]) == 14) {
                    temp = zhadan;
                    break;
                }
            }
            if (this.Room.GetRoomWanfa(this.Define.SEVER_2A_22)) {
                if (zhadan.length == 2 && this.GetCardValue(zhadan[0]) == 14) {
                    temp = zhadan;
                    break;
                }
                if (zhadan.length == 2 && this.GetCardValue(zhadan[0]) == 15) {
                    temp = zhadan;
                    break;
                }
            }
        }
        if (pokers.length) {
            if (pokers.length - temp.length == 0) {
                return true;
            }
        }
        return false;
    },

    CheckZhaDan: function CheckZhaDan() {
        var isSelectCard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        var pokers = [];
        if (isSelectCard == false) {
            pokers = this.handCardList;
        } else {
            pokers = this.selectCardList;
        }
        this.SortCardByMax(pokers);
        var lastCardValue = 0;
        var myCardValue = 0;

        if (this.IsZhadan(pokers)) {
            return true;
        }
        if (this.IsZhadan(this.lastCardList)) {
            lastCardValue = this.GetCardValue(this.lastCardList[0]);
        }

        if (this.IsZhadan(pokers)) {
            if (lastCardValue == 0) return true;
            myCardValue = this.GetCardValue(pokers[0]);
        } else {
            return false;
        }

        //先比较牌值再比较张数
        if (myCardValue > lastCardValue) {
            if (pokers.length >= this.lastCardList.length) {
                return true;
            }
        } else if (myCardValue <= lastCardValue) {
            if (pokers.length > this.lastCardList.length) {
                return true;
            }
        }

        return false;
    },

    IsLianShun: function IsLianShun(pokers) {
        if (pokers.length < 2) return false;

        this.SortCardByMin(pokers);

        var lastValue = 0;
        for (var i = 0; i < pokers.length; i++) {
            var item = pokers[i];
            var nowValue = this.GetCardValue(item[0]);

            if (nowValue == 15) {
                return false;
            }

            if (lastValue != 0) {
                if (lastValue + 1 != nowValue) return false;
            }

            lastValue = nowValue;
        }

        return true;
    },

    //如果有超过tag只取tag数量的牌
    RegularCard: function RegularCard(pokers, list, tag) {
        var temp = [];
        for (var i = 0; i < list.length; i++) {
            if (temp.length == tag) break;
            temp.push(list[i]);
        }
        //过滤掉可能相同的元素
        var haveSameArray = false;
        for (var _i2 = 0; _i2 < pokers.length; _i2++) {
            if (pokers[_i2].toString() == temp.toString()) {
                haveSameArray = true;
                break;
            }
        }
        if (haveSameArray == false) {
            pokers[pokers.length] = temp;
        }
    },

    GetDaiNum: function GetDaiNum() {
        return this.daiNum;
    },

    CheckFeiJi: function CheckFeiJi(tag) {
        var isSelectCard = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var handPokers = this.handCardList;
        var pokers = [];
        if (isSelectCard == false) {
            pokers = this.handCardList;
        } else {
            pokers = this.selectCardList;
        }
        this.SortCardByMax(pokers);
        if (pokers.length < 6) return false;

        var lastCardValue = 0;
        var myCardValue = 0;
        var tempArrA = [];
        var tempArrB = [];

        for (var i = 0; i < this.lastCardList.length; i++) {
            var poker = this.lastCardList[i];
            var santiao = this.GetSameValue(this.lastCardList, poker);
            var bInList = this.CheckPokerInListEx(tempArrA, poker);
            if (santiao.length >= tag && !bInList) {
                this.RegularCard(tempArrA, santiao, tag);
            }
        }

        for (var _i3 = 0; _i3 < pokers.length; _i3++) {
            var _poker2 = pokers[_i3];
            var _santiao = this.GetSameValue(pokers, _poker2);
            var _bInList = this.CheckPokerInListEx(tempArrB, _poker2);
            if (_santiao.length >= tag && !_bInList) {
                this.RegularCard(tempArrB, _santiao, tag);
            }
        }

        if (tempArrA.length) {
            var realPlaneA = this.GetRealPlane(tempArrA);
            lastCardValue = this.GetCardValue(realPlaneA[0][0]);
        }

        if (tempArrB.length < 2) return false;

        this.SortCardByMin(tempArrB);

        var realPlane = this.GetRealPlane(tempArrB);

        if (!realPlane.length) return false;

        myCardValue = this.GetCardValue(realPlane[0][0]);
        //判断牌值是否大于上家
        if (lastCardValue && lastCardValue != 0 && myCardValue <= lastCardValue) {
            return false;
        }
        var value = pokers.length - realPlane.length * tag;
        this.daiNum = value;
        var daiPaiList = this.GetDaiPaiList(pokers, realPlane);
        if (tag == 3) {
            if (this.Room.GetRoomWanfa(this.Define.SEVER_BUDAI3)) {
                if (value == 0) {
                    return true;
                }
            }
            // else if(this.Room.GetRoomWanfa(this.Define.SEVER_DAI31)){
            //     if(value == realPlane.length){
            //         return true;
            //     }
            //     else if (handPokers.length <= (realPlane.length * tag + realPlane.length)
            //         && handPokers.length == pokers.length) {
            //         //如果手牌少于需要带的牌数并且轮到本家出牌则返回true
            //         return true;
            //     }
            // }
            else if (true) {
                    //飞机三带二固定的
                    if (realPlane.length == 3 && value == 1) {
                        //三飞机带单根,可以组成  444,555 带 333,6
                        return true;
                    } else if (value == realPlane.length * 2) {
                        return true;
                    }
                    //lastCardValue == 0 && 
                    else if (handPokers.length <= realPlane.length * tag + realPlane.length * 2 && handPokers.length == pokers.length) {
                            //如果手牌少于需要带的牌数并且轮到本家出牌则返回true
                            return true;
                        }
                }
        } else if (tag == 4) {
            if (this.Room.GetRoomSiDai(0)) {
                if (value == realPlane.length) {
                    return true;
                } else if (handPokers.length <= realPlane.length * tag + realPlane.length && handPokers.length == pokers.length) {
                    //如果手牌少于需要带的牌数并且轮到本家出牌则返回true
                    return true;
                }
            } else if (this.Room.GetRoomSiDai(1)) {
                if (value == realPlane.length * 2) {
                    return true;
                } else if (handPokers.length <= realPlane.length * tag + realPlane.length * 2 && handPokers.length == pokers.length) {
                    //如果手牌少于需要带的牌数并且轮到本家出牌则返回true
                    return true;
                }
            }
            // else if(this.Room.GetRoomWanfa(this.Define.PDK_WANFA_4DAI3)){
            else if (this.Room.GetRoomSiDai(2)) {
                    if (value == realPlane.length * 3) {
                        return true;
                    } else if (handPokers.length <= realPlane.length * tag + realPlane.length * 3 && handPokers.length == pokers.length) {
                        //如果手牌少于需要带的牌数并且轮到本家出牌则返回true
                        return true;
                    }
                }
        }

        return false;
    },

    CheckLianDui: function CheckLianDui() {
        var isSelectCard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        var pokers = [];
        if (isSelectCard == false) {
            pokers = this.handCardList;
        } else {
            pokers = this.selectCardList;
        }
        this.SortCardByMax(pokers);
        if (pokers.length < 4) return false;
        if (pokers.length % 2 == 1) return false;

        var lastCardValue = 0;
        var myCardValue = 0;
        var tempArrA = [];
        var tempArrB = [];

        for (var i = 0; i < this.lastCardList.length; i++) {
            var poker = this.lastCardList[i];
            var duizi = this.GetSameValue(this.lastCardList, poker);
            var bInList = this.CheckPokerInList(tempArrA, poker);
            if (duizi.length == 2 && !bInList) {
                tempArrA[tempArrA.length] = duizi;
            }
        }

        for (var _i4 = 0; _i4 < pokers.length; _i4++) {
            var _poker3 = pokers[_i4];
            var _duizi = this.GetSameValue(pokers, _poker3);
            var _bInList2 = this.CheckPokerInList(tempArrB, _poker3);
            if (_duizi.length == 2 && !_bInList2) {
                tempArrB[tempArrB.length] = _duizi;
            }
        }

        if (tempArrB.length * 2 != pokers.length) return false;

        if (this.IsLianShun(tempArrA)) {
            lastCardValue = this.GetCardValue(tempArrA[0][0]);
        }

        if (this.IsLianShun(tempArrB)) {
            myCardValue = this.GetCardValue(tempArrB[0][0]);
        } else {
            return false;
        }

        if (lastCardValue && lastCardValue != 0) {
            if (pokers.length - this.lastCardList.length == 0) {
                if (myCardValue > lastCardValue) {
                    return true;
                }
            }
            return false;
        }
        return true;
    },

    //检查顺子是不是一条龙
    CheckDragon: function CheckDragon() {
        var pokers = this.lastCardList;
        if (pokers.length != 12) return false;

        this.SortCardByMinEx(pokers);

        var lastValue = 0;
        for (var i = 0; i < pokers.length; i++) {
            var poker = pokers[i];
            var nowValue = this.GetCardValue(poker);
            if (nowValue == lastValue) return false;

            if (nowValue == 15) return false;

            if (lastValue != 0) {
                if (nowValue - lastValue != 1) return false;
            }

            lastValue = nowValue;
        }

        return true;
    },
    IsHaveBoom: function IsHaveBoom() {
        var isSelectCard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var pokers = [];
        if (isSelectCard == false) {
            pokers = this.handCardList;
        } else {
            pokers = this.selectCardList;
        }
        for (var i = 0; i < pokers.length; i++) {
            var poker = pokers[i];
            var zhadan = this.GetSameValue(pokers, poker);
            if (zhadan.length >= 4) {
                return true;
            }
            if (this.Room.GetRoomWanfa(this.Define.SEVER_AAA)) {
                if (zhadan.length == 3 && this.GetCardValue(zhadan[0]) == 14) {
                    return true;
                }
            }
            if (this.Room.GetRoomWanfa(this.Define.SEVER_2A_22)) {
                if (zhadan.length == 2 && this.GetCardValue(zhadan[0]) == 14) {
                    return true;
                }
                if (zhadan.length == 2 && this.GetCardValue(zhadan[0]) == 15) {
                    return true;
                }
            }
        }
        return false;
    },
    IsDismantleBoom: function IsDismantleBoom() {
        var pokers = this.handCardList;
        if (this.CheckZhaDan()) {
            return false;
        }
        for (var i = 0; i < pokers.length; i++) {
            var poker = pokers[i];
            if (this.selectCardList.indexOf(poker) != -1) {
                var zhadan = this.GetSameValue(pokers, poker);
                if (zhadan.length >= 4) {
                    return true;
                }
                // if(this.Room.GetRoomWanfa(this.Define.PDK_WANFA_3AZHA)){
                if (this.Room.GetRoomWanfa(this.Define.SEVER_AAA)) {
                    if (zhadan.length == 3 && this.GetCardValue(zhadan[0]) == 14) {
                        return true;
                    }
                }
                if (this.Room.GetRoomWanfa(this.Define.SEVER_2A_22)) {
                    if (zhadan.length == 2 && this.GetCardValue(zhadan[0]) == 14) {
                        return true;
                    }
                    if (zhadan.length == 2 && this.GetCardValue(zhadan[0]) == 15) {
                        return true;
                    }
                }
            }
        }

        return false;
    },

    GetCardType: function GetCardType() {
        var isSelectCard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        //0:可以随便出牌 1:不出 2:单牌 3:对子 4:顺子 5:3不带 6:3带1 7:3带2 8:4带1 9:4带2 10:4带3 
        //11:炸弹 12:三带飞机 13:四带飞机 14:连对
        this.daiNum = 0;

        if (isSelectCard && !this.selectCardList.length) {
            return 0;
        }

        var bCheck = false;

        if (this.CheckZhaDan(isSelectCard)) {
            return 11;
        }

        if (this.lastCardType == 0) {
            if (this.CheckOneCard(isSelectCard)) {
                return 2;
            } else if (this.CheckDuizi(isSelectCard)) {
                return 3;
            } else if (this.CheckShunzi(isSelectCard)) {
                return 4;
            } else if (this.CheckSanDaiSiDai(10, isSelectCard) && this.Room.GetRoomWanfa(this.Define.SEVER_BMUSTBOMB)) {
                return 10;
            } else if (this.CheckSanDaiSiDai(9, isSelectCard) && this.Room.GetRoomWanfa(this.Define.SEVER_BMUSTBOMB)) {
                return 9;
            } else if (this.CheckSanDaiSiDai(8, isSelectCard) && this.Room.GetRoomWanfa(this.Define.SEVER_BMUSTBOMB)) {
                return 8;
            } else if (this.CheckSanDaiSiDai(7, isSelectCard)) {
                return 7;
            }
            /*else if(this.CheckSanDaiSiDai(6, isSelectCard)){
                return 6;
            }*/
            /*else if(this.CheckSanDaiSiDai(5, isSelectCard)){
                return 5;
            }*/
            else if (this.CheckFeiJi(3, isSelectCard)) {
                    return 12;
                } else if (this.CheckFeiJi(4, isSelectCard)) {
                    return 13;
                } else if (this.CheckLianDui(isSelectCard)) {
                    return 14;
                } else {
                    return 0;
                }
        } else if (this.lastCardType == 2) {
            if (this.CheckOneCard(isSelectCard)) {
                bCheck = true;
            }
        } else if (this.lastCardType == 3) {
            if (this.CheckDuizi(isSelectCard)) {
                bCheck = true;
            }
        } else if (this.lastCardType == 4) {
            if (this.CheckShunzi(isSelectCard)) {
                bCheck = true;
            }
        } else if (this.lastCardType == 5 || this.lastCardType == 6 || this.lastCardType == 7 || this.lastCardType == 8 || this.lastCardType == 9 || this.lastCardType == 10) {
            if (this.CheckSanDaiSiDai(this.lastCardType, isSelectCard)) {
                bCheck = true;
            }
        } else if (this.lastCardType == 12) {
            if (this.CheckFeiJi(3, isSelectCard)) {
                bCheck = true;
            }
        } else if (this.lastCardType == 13) {
            if (this.CheckFeiJi(4, isSelectCard)) {
                bCheck = true;
            }
        } else if (this.lastCardType == 14) {
            if (this.CheckLianDui(isSelectCard)) {
                bCheck = true;
            }
        }

        if (bCheck) {
            return this.lastCardType;
        }

        return 0;
    },
    //0:可以随便出牌 1:不出 2:单牌 3:对子 4:顺子 5:3不带 6:3带1 7:3带2 8:4带1 9:4带2 10:4带3 
    //11:炸弹 12:三带飞机 13:四带飞机 14:连对
    GetTipCardSlCard: function GetTipCardSlCard() {
        var array = [];
        // if(this.lastCardType == 2){
        //     array = this.GetOneCard(true);
        // }
        // else if(this.lastCardType == 3){
        //     array = this.GetDuizi(true);
        // }
        // else 
        if (this.lastCardType == 2) {
            array = this.GetOneCard(true);
        } else if (this.lastCardType == 3) {
            array = this.GetDuizi(true);
        } else if (this.lastCardType == 4) {
            array = this.GetShunzi(true);
        } else if (this.lastCardType == 5 || this.lastCardType == 6 || this.lastCardType == 7) {
            array = this.GetSanDai(true);
        } else if ((this.lastCardType == 8 || this.lastCardType == 9 || this.lastCardType == 10) && this.Room.GetRoomWanfa(this.Define.SEVER_BMUSTBOMB)) {
            array = this.GetSiDai(true);
        } else if (this.lastCardType == 11) {
            array = this.GetZhaDan(true);
        } else if (this.lastCardType == 12) {
            array = this.GetFeiJi(3, true);
        } else if (this.lastCardType == 13) {
            array = this.GetFeiJi(4, true);
        } else if (this.lastCardType == 14) {
            array = this.GetLianDui(true);
        } else if (this.lastCardType == 0) {
            //随意出牌
            array.push.apply(array, this.GetDuiziTip(true));
            array.push.apply(array, this.GetShunziTip(true));
            array.push.apply(array, this.GetSanDaiTip(7, true));
            array.push.apply(array, this.GetFeiJiTip(3, true));
            array.push.apply(array, this.GetFeiJiTip(4, true));
            if (this.Room.GetRoomWanfa(this.Define.SEVER_BMUSTBOMB)) {
                array.push.apply(array, this.GetSiDaiTip(10, true));
            }
            array.push.apply(array, this.GetLianDuiTip(true));
        }
        if (array.length > 0) {
            array.sort(this.SortByLength);
        }
        return array;
    },
    SortByLength: function SortByLength(a, b) {
        if (a.length > b.length) {
            return -1;
        }
        return 1;
    },
    GetTipCard: function GetTipCard() {
        var array = [];
        console.log("GetTipCard", this.lastCardType);
        if (this.lastCardType < 2) {
            array = array.concat(this.GetZhaDanTip());
            array = array.concat(this.GetLianDui());
            array = array.concat(this.GetFeiJi(4));
            array = array.concat(this.GetFeiJi(3));
            array = array.concat(this.GetDuizi());
            array = array.concat(this.GetShunzi());
            array = array.concat(this.GetSanDaiTip(7));
            array = array.concat(this.GetSiDai());
            array = array.concat(this.GetOneCard());
            return array;
        }
        if (this.lastCardType == 2) {
            array = this.GetOneCard();
        } else if (this.lastCardType == 3) {
            array = this.GetDuizi();
        } else if (this.lastCardType == 4) {
            array = this.GetShunzi();
        } else if (this.lastCardType == 5 || this.lastCardType == 6 || this.lastCardType == 7) {
            array = this.GetSanDai();
        } else if (this.lastCardType == 8 || this.lastCardType == 9 || this.lastCardType == 10) {
            array = this.GetSiDai();
        } else if (this.lastCardType == 11) {
            array = this.GetZhaDan();
        } else if (this.lastCardType == 12) {
            array = this.GetFeiJi(3);
        } else if (this.lastCardType == 13) {
            array = this.GetFeiJi(4);
        } else if (this.lastCardType == 14) {
            array = this.GetLianDui();
        }
        return array;
    },

    CheckSelected: function CheckSelected(cardValue) {
        if (-1 == this.selectCardList.indexOf(cardValue)) {
            return false;
        }
        return true;
    },

    //0:可以随便出牌 1:不出 2:单牌 3:对子 4:顺子 5:3不带 6:3带1 7:3带2 8:4带1 9:4带2 10:4带3 
    //11:炸弹 12:三带飞机 13:四带飞机 14:连对
    GetZhaDanTip: function GetZhaDanTip() {
        var isSelectCard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var pokers = [];
        if (isSelectCard == false) {
            pokers = this.handCardList;
        } else {
            pokers = this.selectCardList;
        }
        var zhadans = [];

        for (var i = pokers.length - 1; i >= 0; i--) {
            var poker = pokers[i];
            var zhadan = this.GetSameValue(pokers, poker);
            var bInList = this.CheckPokerInListEx(zhadans, poker);
            if (zhadan.length == 4 && !bInList) {
                zhadans[zhadans.length] = zhadan;
            }
            if (this.Room.GetRoomWanfa(this.Define.SEVER_AAA)) {
                if (zhadan.length == 3 && !bInList && this.GetCardValue(zhadan[0]) == 14) {
                    zhadans[zhadans.length] = zhadan;
                }
            }
            if (this.Room.GetRoomWanfa(this.Define.SEVER_2A_22)) {
                if (zhadan.length == 2 && !bInList && this.GetCardValue(zhadan[0]) == 14) {
                    zhadans[zhadans.length] = zhadan;
                }
                if (zhadan.length == 2 && !bInList && this.GetCardValue(zhadan[0]) == 15) {
                    zhadans[zhadans.length] = zhadan;
                }
            }
        }
        return zhadans;
    },
    GetZhaDan: function GetZhaDan() {
        var pokers = this.handCardList;
        var zhadans = [];

        var lastCardValue = 0;
        lastCardValue = this.GetCardValue(this.lastCardList[0]);
        //存在3A炸玩法并且3A炸最大  直接提示
        if (this.Room.GetRoomWanfa(this.Define.SEVER_AAA) && this.Room.GetRoomWanfa(this.Define.SEVER_MAXAAA)) {
            if (lastCardValue == 14) {
                return zhadans;
            }
        }

        for (var i = pokers.length - 1; i >= 0; i--) {
            var poker = pokers[i];
            var zhadan = this.GetSameValue(pokers, poker);
            var bInList = this.CheckPokerInListEx(zhadans, poker);
            if (zhadan.length > this.lastCardList.length && !bInList && zhadan.length >= 4) {
                zhadans[zhadans.length] = zhadan;
            } else if (zhadan.length == this.lastCardList.length && !bInList && this.GetCardValue(zhadan[0]) > lastCardValue) {
                zhadans[zhadans.length] = zhadan;
            }
            // if(this.Room.GetRoomWanfa(this.Define.PDK_WANFA_3AZHA)){
            if (this.Room.GetRoomWanfa(this.Define.SEVER_AAA)) {
                //3A炸最大
                if (this.Room.GetRoomWanfa(this.Define.SEVER_MAXAAA)) {
                    if (zhadan.length == 3 && !bInList && this.GetCardValue(zhadan[0]) == 14) {
                        zhadans[zhadans.length] = zhadan;
                    }
                }
                //3A炸最小
                else {
                        if (lastCardValue == 0) {
                            if (zhadan.length == 3 && !bInList && this.GetCardValue(zhadan[0]) == 14) {
                                zhadans[zhadans.length] = zhadan;
                            }
                        }
                    }
            }
            if (this.Room.GetRoomWanfa(this.Define.SEVER_2A_22)) {
                if (lastCardValue == 0) {
                    if (zhadan.length == 2 && !bInList && this.GetCardValue(zhadan[0]) == 14) {
                        zhadans[zhadans.length] = zhadan;
                    }
                    if (zhadan.length == 2 && !bInList && this.GetCardValue(zhadan[0]) == 15) {
                        zhadans[zhadans.length] = zhadan;
                    }
                } else {
                    if (zhadan.length == 2 && !bInList && this.GetCardValue(zhadan[0]) == 15 && 14 == lastCardValue) {
                        zhadans[zhadans.length] = zhadan;
                        console.log;
                    }
                }
            }
        }
        return zhadans;
    },

    GetZhaDanEx: function GetZhaDanEx(array) {
        var isSelectCard = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var pokers = [];
        if (isSelectCard == false) {
            pokers = this.handCardList;
        } else {
            pokers = this.selectCardList;
        }
        var zhadans = [];
        var arrLen = array.length; //先记录下原来数组的长度，方便后续插入三A炸弹
        console.log("GetZhaDanEx", pokers);
        for (var i = 0; i < pokers.length; i++) {
            var poker = pokers[i];
            var zhadan = this.GetSameValue(pokers, poker);
            var bInList = this.CheckPokerInListEx(zhadans, poker);
            if (zhadan.length >= 4 && !bInList) {
                zhadans[zhadans.length] = zhadan;
            }
            //是否有3A炸玩法
            // if(this.Room.GetRoomWanfa(this.Define.PDK_WANFA_3AZHA)){
            if (this.Room.GetRoomWanfa(this.Define.SEVER_AAA)) {
                if (zhadan.length == 3 && this.GetCardValue(zhadan[0]) == 14 && !bInList) {
                    zhadans[zhadans.length] = zhadan;
                }
            }
            if (this.Room.GetRoomWanfa(this.Define.SEVER_2A_22)) {
                if (zhadan.length == 2 && this.GetCardValue(zhadan[0]) == 14 && !bInList) {
                    zhadans[zhadans.length] = zhadan;
                } else if (zhadan.length == 2 && this.GetCardValue(zhadan[0]) == 15 && !bInList) {
                    zhadans[zhadans.length] = zhadan;
                }
            }
        }
        for (var _i5 = zhadans.length - 1; _i5 >= 0; _i5--) {
            var item = zhadans[_i5];
            //对炸弹进行排序，从最小炸弹开始，3A是最小的炸弹
            if (item.length == 3) {
                array.splice(arrLen, 0, item);
            } else {
                array.push(item);
            }
        }
    },

    PushTipCard: function PushTipCard(pokers, samePoker, len) {
        var temp = [];
        samePoker.reverse();
        for (var i = 0; i < len; i++) {
            temp.push(samePoker[i]);
        }

        pokers.push(temp);
    },

    GetOneCard: function GetOneCard() {
        var isSelectCard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var pokers = [];
        if (isSelectCard == false) {
            pokers = this.handCardList;
        } else {
            pokers = this.selectCardList;
        }
        var array = [];
        var chai = [];

        var lastCardValue = this.GetCardValue(this.lastCardList[0]);

        for (var i = pokers.length - 1; i >= 0; i--) {
            var poker = pokers[i];
            var cardValue = this.GetCardValue(poker);
            if (cardValue <= lastCardValue) continue;
            var sameValue = this.GetSameValue(pokers, poker);
            var bInList = this.CheckPokerInListEx(chai, poker);
            if (sameValue.length == 1) {
                this.PushTipCard(array, sameValue, 1);
            } else if (sameValue.length > 1 && !bInList) {
                this.PushTipCard(chai, sameValue, 1);
            }
        }
        array.push.apply(array, chai);
        this.GetZhaDanEx(array, isSelectCard);
        return array;
    },

    GetDuiziTip: function GetDuiziTip() {
        var isSelectCard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var pokers = [];
        if (isSelectCard == false) {
            pokers = this.handCardList;
        } else {
            pokers = this.selectCardList;
        }
        var duizis = [];
        var chai = [];
        for (var i = pokers.length - 1; i >= 0; i--) {
            var poker = pokers[i];
            var cardValue = this.GetCardValue(poker);
            var duizi = this.GetSameValue(pokers, poker);
            var bInList = this.CheckPokerInListEx(duizis, poker);
            var bInListEx = this.CheckPokerInListEx(chai, poker);
            if (duizi.length == 2 && !bInList) {
                this.PushTipCard(duizis, duizi, 2);
            } else if (duizi.length > 2 && !bInListEx) {
                this.PushTipCard(chai, duizi, 2);
            }
        }
        duizis.push.apply(duizis, chai);
        return duizis;
    },

    GetDuizi: function GetDuizi() {
        var isSelectCard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var pokers = [];
        if (isSelectCard == false) {
            pokers = this.handCardList;
        } else {
            pokers = this.selectCardList;
        }
        var duizis = [];
        var chai = [];
        // if(pokers.length < this.lastCardList.length) return [];

        var lastCardValue = this.GetCardValue(this.lastCardList[0]);

        for (var i = pokers.length - 1; i >= 0; i--) {
            var poker = pokers[i];
            var cardValue = this.GetCardValue(poker);
            if (cardValue <= lastCardValue) continue;
            var duizi = this.GetSameValue(pokers, poker);
            var bInList = this.CheckPokerInListEx(duizis, poker);
            var bInListEx = this.CheckPokerInListEx(chai, poker);
            if (duizi.length == 2 && !bInList) {
                this.PushTipCard(duizis, duizi, 2);
            } else if (duizi.length > 2 && !bInListEx) {
                this.PushTipCard(chai, duizi, 2);
            }
        }
        duizis.push.apply(duizis, chai);
        this.GetZhaDanEx(duizis, isSelectCard);
        return duizis;
    },

    GetShunziTip: function GetShunziTip() {
        var isSelectCard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var pokers = [];
        if (isSelectCard == false) {
            pokers = this.handCardList;
        } else {
            pokers = this.selectCardList;
        }
        this.SortCardByMax(pokers);
        var array = [];
        for (var i = pokers.length - 1; i >= 0; i--) {
            var lastValue = 0;
            var shunzi = [];
            shunzi.push(pokers[i]);
            for (var j = i; j >= 0; j--) {
                var poker = pokers[j];
                var nowValue = this.GetCardValue(poker);
                if (nowValue == lastValue) continue;
                if (nowValue == 15) {
                    break;
                }
                if (lastValue != 0) {
                    if (nowValue - lastValue != 1) {
                        break;
                    }
                    shunzi.push(poker);
                }
                lastValue = nowValue;
                if (shunzi.length >= 5) {
                    array[array.length] = shunzi;
                }
            }
        }
        return array;
    },
    GetShunzi: function GetShunzi() {
        var isSelectCard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var pokers = [];
        if (isSelectCard == false) {
            pokers = this.handCardList;
        } else {
            pokers = this.selectCardList;
        }
        this.SortCardByMax(pokers);
        var array = [];
        // if(pokers.length < this.lastCardList.length) return [];

        this.SortCardByMinEx(this.lastCardList);
        var lastCardValue = this.GetCardValue(this.lastCardList[0]);

        for (var i = pokers.length - 1; i >= 0; i--) {
            var lastValue = 0;
            var shunzi = [];
            shunzi.push(pokers[i]);
            for (var j = i; j >= 0; j--) {
                var poker = pokers[j];
                var nowValue = this.GetCardValue(poker);

                if (nowValue == lastValue) continue;

                if (nowValue <= lastCardValue) {
                    break;
                }
                if (nowValue == 15) {
                    break;
                }
                if (lastValue != 0) {
                    if (nowValue - lastValue != 1) break;
                    shunzi.push(poker);
                }

                if (shunzi.length >= this.lastCardList.length) {
                    array[array.length] = shunzi;
                    break;
                }
                lastValue = nowValue;
            }
        }
        this.GetZhaDanEx(array, isSelectCard);
        return array;
    },

    GetSanDaiTip: function GetSanDaiTip(lastCardType) {
        var isSelectCard = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var pokers = [];
        if (isSelectCard == false) {
            pokers = this.handCardList;
        } else {
            pokers = this.selectCardList;
        }
        var santiaos = [];
        var chai = [];
        for (var i = 0; i < pokers.length; i++) {
            var poker = pokers[i];
            var cardValue = this.GetCardValue(poker);
            var santiao = this.GetSameValue(pokers, poker);
            var bInList = this.CheckPokerInListEx(santiaos, poker);
            var bInListEx = this.CheckPokerInListEx(chai, poker);
            if (santiao.length == 3 && !bInList) {
                this.PushTipCard(santiaos, santiao, 3);
            }
        }
        this.SortCardByMin(santiaos);
        this.SortCardByMin(chai);

        santiaos.push.apply(santiaos, chai);

        if (lastCardType == 6) {
            this.GetOtherCard(santiaos, 1, isSelectCard, false);
        } else if (lastCardType == 7) {
            this.GetOtherCard(santiaos, 2, isSelectCard, false); //不用对子
        } else if (lastCardType == 15) {
            //获取其他牌一对
            this.GetOtherCardDui(santiaos, 2, isSelectCard);
        }
        return santiaos;
    },

    GetSanDai: function GetSanDai() {
        var isSelectCard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var pokers = [];
        if (isSelectCard == false) {
            pokers = this.handCardList;
        } else {
            pokers = this.selectCardList;
        }
        var santiaos = [];
        var chai = [];
        // if(pokers.length < this.lastCardList.length) return [];

        var lastCardValue = 0;

        for (var i = 0; i < this.lastCardList.length; i++) {
            var poker = this.lastCardList[i];
            var santiao = this.GetSameValue(this.lastCardList, poker);
            if (santiao.length >= 3) {
                lastCardValue = this.GetCardValue(santiao[0]);
                break;
            }
        }
        for (var _i6 = 0; _i6 < pokers.length; _i6++) {
            var _poker4 = pokers[_i6];
            var cardValue = this.GetCardValue(_poker4);
            if (cardValue <= lastCardValue) {
                continue;
            }
            var _santiao2 = this.GetSameValue(pokers, _poker4);
            var bInList = this.CheckPokerInListEx(santiaos, _poker4);
            var bInListEx = this.CheckPokerInListEx(chai, _poker4);
            if (_santiao2.length == 3 && !bInList) {
                if (this.GetCardValue(_santiao2[0]) == 14 && this.Room.GetRoomWanfa(this.Define.SEVER_AAA) && !this.Room.GetRoomWanfa(this.Define.SEVER_BMUSTBOMB)) {
                    //3跟牌是A，选择了3A为炸，没选择炸弹可拆，则3A不加入提示牌
                    continue;
                }
                this.PushTipCard(santiaos, _santiao2, 3);
            } else if (_santiao2.length > 3 && !bInListEx) {
                this.PushTipCard(chai, _santiao2, 3);
            }
        }

        this.SortCardByMin(santiaos);
        this.SortCardByMin(chai);

        santiaos.push.apply(santiaos, chai);

        if (this.lastCardType == 6) {
            this.GetOtherCard(santiaos, 1, isSelectCard, false);
        } else if (this.lastCardType == 7) {
            this.GetOtherCard(santiaos, 2, isSelectCard, false);
        } else if (this.lastCardType == 15) {
            //获取其他牌一对
            this.GetOtherCardDui(santiaos, 2, isSelectCard);
        }

        this.GetZhaDanEx(santiaos, isSelectCard);
        return santiaos;
    },

    GetSiDaiTip: function GetSiDaiTip(lastCardType) {
        var isSelectCard = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var pokers = [];
        if (isSelectCard == false) {
            pokers = this.handCardList;
        } else {
            pokers = this.selectCardList;
        }
        var zhadans = [];
        var chai = [];
        // if(pokers.length < this.lastCardList.length) return [];

        var lastCardValue = 0;

        for (var i = 0; i < this.lastCardList.length; i++) {
            var poker = this.lastCardList[i];
            var zhadan = this.GetSameValue(this.lastCardList, poker);
            if (zhadan.length >= 4) {
                lastCardValue = this.GetCardValue(zhadan[0]);
                break;
            }
        }

        for (var _i7 = 0; _i7 < pokers.length; _i7++) {
            var _poker5 = pokers[_i7];
            var cardValue = this.GetCardValue(_poker5);
            if (cardValue <= lastCardValue) continue;
            var _zhadan = this.GetSameValue(pokers, _poker5);
            var bInList = this.CheckPokerInListEx(zhadans, _poker5);
            var bInListEx = this.CheckPokerInListEx(chai, _poker5);
            if (_zhadan.length == 4 && !bInList) {
                this.PushTipCard(zhadans, _zhadan, 4);
            } else if (_zhadan.length > 4 && !bInListEx) {
                this.PushTipCard(chai, _zhadan, 4);
            }
        }

        zhadans.push.apply(zhadans, chai);

        if (lastCardType == 8) {
            this.GetOtherCard(zhadans, 1, isSelectCard);
        } else if (lastCardType == 9) {
            this.GetOtherCard(zhadans, 2, isSelectCard);
        } else if (lastCardType == 10) {
            this.GetOtherCard(zhadans, 3, isSelectCard);
        }
        return zhadans;
    },

    GetSiDai: function GetSiDai() {
        var isSelectCard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var pokers = [];
        if (isSelectCard == false) {
            pokers = this.handCardList;
        } else {
            pokers = this.selectCardList;
        }
        var zhadans = [];
        var chai = [];
        // if(pokers.length < this.lastCardList.length) return [];

        var lastCardValue = 0;

        for (var i = 0; i < this.lastCardList.length; i++) {
            var poker = this.lastCardList[i];
            var zhadan = this.GetSameValue(this.lastCardList, poker);
            if (zhadan.length >= 4) {
                lastCardValue = this.GetCardValue(zhadan[0]);
                break;
            }
        }

        for (var _i8 = 0; _i8 < pokers.length; _i8++) {
            var _poker6 = pokers[_i8];
            var cardValue = this.GetCardValue(_poker6);
            if (cardValue <= lastCardValue) continue;
            var _zhadan2 = this.GetSameValue(pokers, _poker6);
            var bInList = this.CheckPokerInListEx(zhadans, _poker6);
            var bInListEx = this.CheckPokerInListEx(chai, _poker6);
            if (_zhadan2.length == 4 && !bInList) {
                this.PushTipCard(zhadans, _zhadan2, 4);
            } else if (_zhadan2.length > 4 && !bInListEx) {
                this.PushTipCard(chai, _zhadan2, 4);
            }
        }

        zhadans.push.apply(zhadans, chai);

        if (this.lastCardType == 8) {
            this.GetOtherCard(zhadans, 1, isSelectCard);
        } else if (this.lastCardType == 9) {
            this.GetOtherCard(zhadans, 2, isSelectCard);
        } else if (this.lastCardType == 10) {
            this.GetOtherCard(zhadans, 3, isSelectCard);
        }

        this.GetZhaDanEx(zhadans, isSelectCard);
        return zhadans;
    },

    //得到真正的飞机
    GetRealPlane: function GetRealPlane(lists) {
        var lastValue = 0;
        var realPlane = [];
        for (var i = 0; i < lists.length; i++) {
            var item = lists[i];
            var nowValue = this.GetCardValue(item[0]);

            if (lastValue != 0) {
                if (lastValue + 1 != nowValue) {
                    if (realPlane.length >= 2) {
                        break;
                    }
                    realPlane.splice(0, realPlane.length);
                    realPlane[realPlane.length] = item;
                } else {
                    realPlane[realPlane.length] = item;
                }
            } else {
                realPlane[realPlane.length] = item;
            }

            lastValue = nowValue;
        }

        return realPlane;
    },
    GetFeiJiTip: function GetFeiJiTip(tag) {
        var isSelectCard = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var pokers = [];
        if (isSelectCard == false) {
            pokers = this.handCardList;
        } else {
            pokers = this.selectCardList;
        }
        var tempArrB = [];
        for (var i = 0; i < pokers.length; i++) {
            var poker = pokers[i];
            var santiao = this.GetSameValue(pokers, poker);
            var bInList = this.CheckPokerInList(tempArrB, poker);
            if (santiao.length >= tag && !bInList) {
                //tempArrB[tempArrB.length] = santiao;
                this.RegularCard(tempArrB, santiao, tag);
            }
        }
        if (tempArrB.length < 2) {
            return [];
        }
        this.SortCardByMin(tempArrB);
        var temp = [];
        var tempT = [];
        var lastValue = 0;
        for (var _i9 = 0; _i9 < tempArrB.length; _i9++) {
            var item = tempArrB[_i9];
            var nowValue = this.GetCardValue(item[0]);
            if (lastValue != 0) {
                if (lastValue + 1 != nowValue) {
                    if (temp.length > 0) {
                        tempT.push(temp);
                    }
                    temp.splice(0, temp.length);
                    temp[temp.length] = item;
                } else {
                    temp[temp.length] = item;
                }
            } else {
                temp[temp.length] = item;
            }

            lastValue = nowValue;
        }
        if (temp.length > 0) {
            tempT.push(temp);
        }
        if (tempT.length > 0) {
            tempT.sort(this.SortByLength);
            temp = tempT[0];
        }
        //将真正的飞机合并成一个数组
        var realPlane = [];
        if (temp.length) {
            var tp = [];
            for (var _i10 = 0; _i10 < temp.length; _i10++) {
                var _item = temp[_i10];
                for (var j = 0; j < _item.length; j++) {
                    tp.push(_item[j]);
                }
            }
            realPlane[realPlane.length] = tp;
        }
        if (realPlane.length) {
            // if(this.Room.GetRoomWanfa(this.Define.SEVER_DAI31)){
            //     this.GetOtherCard(realPlane, this.lastCardList.length - realPlane[0].length);
            // }
            // else if(this.Room.GetRoomWanfa(this.Define.SEVER_DAI32)){
            //     this.GetOtherCard(realPlane, this.lastCardList.length - realPlane[0].length);
            // }
            this.GetOtherCard(realPlane, realPlane[0].length / 3 * 2, isSelectCard);
        }
        return realPlane;
    },
    GetFeiJi: function GetFeiJi(tag) {
        var isSelectCard = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var pokers = [];
        if (isSelectCard == false) {
            pokers = this.handCardList;
        } else {
            pokers = this.selectCardList;
        }
        // if(pokers.length < this.lastCardList.length) return [];

        var lastCardValue = 0;
        var tempArrA = [];
        var tempArrB = [];

        for (var i = 0; i < this.lastCardList.length; i++) {
            var poker = this.lastCardList[i];
            var santiao = this.GetSameValue(this.lastCardList, poker);
            var bInList = this.CheckPokerInList(tempArrA, poker);
            if (santiao.length >= tag && !bInList) {
                //tempArrA[tempArrA.length] = santiao;
                this.RegularCard(tempArrA, santiao, tag);
            }
        }

        this.SortCardByMin(tempArrA);
        var realPlaneA = [];
        if (tempArrA.length) {
            realPlaneA = this.GetRealPlane(tempArrA);
            lastCardValue = this.GetCardValue(realPlaneA[0][0]);
        }

        for (var _i11 = 0; _i11 < pokers.length; _i11++) {
            var _poker7 = pokers[_i11];
            var _santiao3 = this.GetSameValue(pokers, _poker7);
            var _bInList3 = this.CheckPokerInList(tempArrB, _poker7);
            if (_santiao3.length >= tag && !_bInList3) {
                //tempArrB[tempArrB.length] = santiao;
                this.RegularCard(tempArrB, _santiao3, tag);
            }
        }

        //如果第一次检测三条小于2对 肯定凑不成飞机
        if (tempArrB.length < 2) {
            var zhadan = [];
            this.GetZhaDanEx(zhadan, isSelectCard);
            return zhadan;
        }

        this.SortCardByMin(tempArrB);

        //tempArrB里的三带或四带飞机找出来 去除不用的三条或四条
        var temp = [];
        var lastValue = 0;
        for (var _i12 = 0; _i12 < tempArrB.length; _i12++) {
            if (this.GetCardValue(tempArrB[_i12][0]) <= lastCardValue) continue;
            if (temp.length == realPlaneA.length) break;

            var item = tempArrB[_i12];
            var nowValue = this.GetCardValue(item[0]);

            if (lastValue != 0) {
                if (lastValue + 1 != nowValue) {
                    temp.splice(0, temp.length);
                    temp[temp.length] = item;
                } else {
                    temp[temp.length] = item;
                }
            } else {
                temp[temp.length] = item;
            }

            lastValue = nowValue;
        }
        //如果飞机数量不足 返回空
        if (temp.length < realPlaneA.length) {
            var _zhadan3 = [];
            this.GetZhaDanEx(_zhadan3, isSelectCard);
            return _zhadan3;
        }
        //将真正的飞机合并成一个数组
        var realPlane = [];
        if (temp.length) {
            var tp = [];
            for (var _i13 = 0; _i13 < temp.length; _i13++) {
                var _item2 = temp[_i13];
                for (var j = 0; j < _item2.length; j++) {
                    tp.push(_item2[j]);
                }
            }

            realPlane[realPlane.length] = tp;
        }

        if (realPlane.length) {
            // if(this.Room.GetRoomWanfa(this.Define.SEVER_DAI31)){
            //     this.GetOtherCard(realPlane, this.lastCardList.length - realPlane[0].length);
            // }
            // else if(this.Room.GetRoomWanfa(this.Define.SEVER_DAI32)){
            //     this.GetOtherCard(realPlane, this.lastCardList.length - realPlane[0].length);
            // }
            this.GetOtherCard(realPlane, this.lastCardList.length - realPlane[0].length, isSelectCard);
        }

        this.GetZhaDanEx(realPlane, isSelectCard);
        return realPlane;
    },
    GetLianDuiTip: function GetLianDuiTip() {
        var isSelectCard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var pokers = [];
        if (isSelectCard == false) {
            pokers = this.handCardList;
        } else {
            pokers = this.selectCardList;
        }
        // if(pokers.length < this.lastCardList.length) return [];

        var tempArrB = [];

        for (var i = pokers.length - 1; i >= 0; i--) {
            var poker = pokers[i];
            var duizi = this.GetSameValue(pokers, poker);
            var bInList = this.CheckPokerInListEx(tempArrB, poker);
            if (duizi.length >= 2 && !bInList) {
                this.PushTipCard(tempArrB, duizi, 2);
            }
        }

        this.SortCardByMin(tempArrB);

        var temps = [];
        for (var _i14 = 0; _i14 < tempArrB.length; _i14++) {
            var tp = [];
            tp.push.apply(tp, tempArrB[_i14]);
            var lastValue = 0;
            lastValue = this.GetCardValue(tempArrB[_i14][0]);
            for (var j = _i14 + 1; j < tempArrB.length; j++) {
                var item = tempArrB[j];
                var nowValue = this.GetCardValue(item[0]);

                if (nowValue == 15) {
                    break;
                }

                if (lastValue + 1 != nowValue) {
                    break;
                }
                tp.push.apply(tp, item);
                lastValue = nowValue;
                if (tp.length >= 4) {
                    temps[temps.length] = tp;
                }
            }
        }
        return temps;
    },
    GetLianDui: function GetLianDui() {
        var isSelectCard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var pokers = [];
        if (isSelectCard == false) {
            pokers = this.handCardList;
        } else {
            pokers = this.selectCardList;
        }
        // if(pokers.length < this.lastCardList.length) return [];

        var lastCardValue = 0;
        var tempArrA = [];
        var tempArrB = [];

        this.SortCardByMinEx(this.lastCardList);
        lastCardValue = this.GetCardValue(this.lastCardList[0]);
        tempArrA = this.lastCardList;

        for (var i = pokers.length - 1; i >= 0; i--) {
            var poker = pokers[i];
            var duizi = this.GetSameValue(pokers, poker);
            var bInList = this.CheckPokerInListEx(tempArrB, poker);
            if (duizi.length >= 2 && !bInList) {
                this.PushTipCard(tempArrB, duizi, 2);
            }
        }

        this.SortCardByMin(tempArrB);

        var temps = [];
        for (var _i15 = 0; _i15 < tempArrB.length; _i15++) {
            var tp = [];
            if (this.GetCardValue(tempArrB[_i15][0]) <= lastCardValue) continue;
            tp.push.apply(tp, tempArrB[_i15]);
            var lastValue = 0;
            lastValue = this.GetCardValue(tempArrB[_i15][0]);
            for (var j = _i15 + 1; j < tempArrB.length; j++) {
                var item = tempArrB[j];
                var nowValue = this.GetCardValue(item[0]);

                if (nowValue == 15) {
                    break;
                }

                if (lastValue + 1 != nowValue) {
                    break;
                }

                tp.push.apply(tp, item);
                lastValue = nowValue;

                if (tp.length == tempArrA.length) {
                    temps[temps.length] = tp;
                    break;
                }
            }
        }

        this.GetZhaDanEx(temps, isSelectCard);
        return temps;
    },

    GetOtherCard: function GetOtherCard(list, tag) {
        var isSelectCard = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var needDuizi = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        if (!list.length) return;
        var pokers = [];
        if (isSelectCard == false) {
            pokers = this.handCardList;
        } else {
            pokers = this.selectCardList;
        }
        var needPokersCount = 0;
        for (var i = 0; i < list.length; i++) {
            needPokersCount = list[i].length + tag;
        }
        var temp = [];
        var chai = [];
        for (var _i16 = pokers.length - 1; _i16 >= 0; _i16--) {
            var poker = pokers[_i16];
            var cards = this.GetSameValue(pokers, poker);
            var bInList = this.CheckPokerInListEx(temp, poker);
            var bInListEx = this.CheckPokerInListEx(chai, poker);
            if (cards.length == 1 && !bInList) {
                this.PushTipCard(temp, cards, 1);
            } else if (cards.length >= 2 && !bInListEx) {
                this.PushTipCard(chai, cards, 2);
            }
        }

        temp.push.apply(temp, chai);
        //先将list拷贝出来
        var tempList = [];
        tempList = list;
        //将获得的牌加入三条,四条或者飞机之中
        for (var _i17 = 0; _i17 < tempList.length; _i17++) {
            var item = tempList[_i17];
            var len = item.length;
            if (!needDuizi) {
                for (var j = 0; j < temp.length; j++) {
                    if (list[_i17].length - len == tag) {
                        break;
                    }
                    var tp = temp[j];
                    for (var k = 0; k < tp.length; k++) {
                        if (list[_i17].length - len == tag) {
                            break;
                        }
                        if (item.indexOf(tp[k]) == -1) {
                            //将获得的带牌加入list
                            list[_i17].push(tp[k]);
                        }
                    }
                }
            } else if (needDuizi) {
                //必须是对子
                for (var _j = 0; _j < chai.length; _j++) {
                    if (list[_i17].length - len == tag) {
                        break;
                    }
                    var _tp = chai[_j];
                    for (var _k = 0; _k < _tp.length; _k++) {
                        if (list[_i17].length - len == tag) {
                            break;
                        }
                        if (item.indexOf(_tp[_k]) == -1) {
                            //将获得的带牌加入list
                            list[_i17].push(_tp[_k]);
                        }
                    }
                }
            }
        }
        //如果需要带对的，如果没有对。不能出
        if (needDuizi && chai.length == 0) {
            list.splice(0, list.length);
            return;
        }
        //判断下如果加入的牌还不够上家的牌型并且手上还有牌需要补充
        var curPokersCount = 0;
        for (var _i18 = 0; _i18 < list.length; _i18++) {
            curPokersCount = list[_i18].length;
            if (this.lastCardType == 7 && curPokersCount < 5 && this.handCardList.length >= 5) {
                list.splice(_i18, 1);
            }
        }
        // if (curPokersCount < needPokersCount) {
        //     for (let i = 0; i < list.length; i++) {
        //         for (let j = 0; j < pokers.length; j++) {
        //             if (list[i].indexOf(pokers[j]) == -1) {
        //                 //将获得的带牌加入list
        //                 list[i].push(pokers[j]);
        //                 if (list[i].length == needPokersCount) {
        //                     break;
        //                 }
        //             }
        //         }
        //     }
        // }
    },

    ///////////////////////////common///////////////////////////////////////
    CheckPokerInList: function CheckPokerInList(list, tagCard) {
        if (list.length == 0) return false;

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

    CheckPokerInListEx: function CheckPokerInListEx(list, tagCard) {
        if (list.length == 0) return false;

        var bInList = false;
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var cardValue = this.GetCardValue(item[0]);
            var tagValue = this.GetCardValue(tagCard);

            if (cardValue == tagValue) {
                bInList = true;
            }
        }
        return bInList;
    },
    CheckChaiInList: function CheckChaiInList(cards, list) {
        if (cards.length == 0) return false;
        var bInList = false;
        for (var i = 0; i < cards.length; i++) {
            var item = cards[i];
            var pos = list.indexOf(item);

            if (pos >= 0) {
                bInList = true;
            }
        }
        return bInList;
    },
    //检测列表是否全是对子
    CheckTagIsDuizi: function CheckTagIsDuizi(tagList) {
        if (tagList.length < 2) return false;
        if (tagList.length % 2 == 1) return false;

        var duiziNum = tagList.length / 2;
        for (var j = 0; j < duiziNum; j++) {
            for (var i = 0; i < tagList.length; i++) {
                var poker = tagList[i];
                var duizi = this.GetSameValue(tagList, poker);
                if (duizi.length == 2 || duizi.length == 4) {
                    var pos1 = tagList.indexOf(duizi[0]);
                    tagList.splice(pos1, 1);
                    var pos2 = tagList.indexOf(duizi[1]);
                    tagList.splice(pos2, 1);
                    break;
                }
            }
        }
        if (tagList.length == 0) return true;else return false;
    },
    //获取带牌
    GetDaiPaiList: function GetDaiPaiList(pokers, sameList) {
        var tempList = [];
        for (var i = 0; i < sameList.length; i++) {
            tempList.push.apply(tempList, sameList[i]);
        }
        var daiPaiList = [];
        for (var _i19 = 0; _i19 < pokers.length; _i19++) {
            var poker = pokers[_i19];
            var index = tempList.indexOf(poker);
            if (index == -1) {
                daiPaiList.push(poker);
            }
        }
        return daiPaiList;
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
        var realPoker = 0;
        if (poker > 500) {
            realPoker = poker - 500;
        } else {
            realPoker = poker;
        }
        return realPoker & this.LOGIC_MASK_VALUE;
    },

    //获取花色
    GetCardColor: function GetCardColor(poker) {
        var realPoker = 0;
        if (poker > 500) {
            realPoker = poker - 500;
        } else {
            realPoker = poker;
        }
        return realPoker & this.LOGIC_MASK_COLOR;
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
    }
});

var g_LogicPDKGame = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
    if (!g_LogicPDKGame) {
        g_LogicPDKGame = new LogicPDKGame();
    }
    return g_LogicPDKGame;
};

cc._RF.pop();