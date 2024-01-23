"use strict";
cc._RF.push(module, '9c90dJMeH1Nu6rMQ0rNGh5U', 'UIMJCard_Down');
// script/ui/uiGame/majiang/UIMJCard_Down.js

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
                var zhi = paiNode.getChildByName('zhi');
                if (zhi != null) {
                    zhi.active = false;
                }
                paiSprite.spriteFrame = null;
            }
        }
    },
    ShowDownCardByPZMJ: function ShowDownCardByPZMJ(publicCardList) {
        var imageString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'EatCard_Self_';

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
                cardIDList = [0, 0, 0, cardIDList[3]];
            }
            //如果是坎牌,自己视角：暗明暗；别人视角：三暗
            if (opType == this.ShareDefine.OpType_KanPai) {
                cardIDList = [0, cardIDList[0], 0];
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
    GetSameCardTypes: function GetSameCardTypes(cardIDList) {
        var sameValueList = {};
        for (var i = 0; i < cardIDList.length; i++) {
            var cardId = cardIDList[i];
            var cardType = Math.floor(cardId / 100);
            if (!sameValueList.hasOwnProperty(cardType)) {
                sameValueList[cardType] = [];
            }
            sameValueList[cardType].push(cardId);
        }
        return sameValueList;
    },
    // 吉安麻将
    ShowDownCardByJAMJ: function ShowDownCardByJAMJ(publicCardList, posCount) {
        var jin1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var jin2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var imageString = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'EatCard_Self_';

        var count = 0;
        if (typeof publicCardList != "undefined") {
            count = publicCardList.length;
        }
        for (var index = 0; index < count; index++) {
            var publicInfoList = publicCardList[index];
            var cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            var opType = publicInfoList[0];
            //定位碰吃位置，上家下家还是对家
            var cardbgPos = -1;
            var cardIDPos = publicInfoList[1];
            var getCardID = publicInfoList[2];

            var nodeParentName = this.node.parent.name;
            if (nodeParentName.indexOf("1") > 0) {} else if (nodeParentName.indexOf("2") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 3;
                } else if (cardIDPos == 1) {
                    // cardIDPos = 0;
                } else if (cardIDPos == 2) {
                    cardIDPos = 1;
                } else if (cardIDPos == 3) {
                    cardIDPos = 2;
                }
            } else if (nodeParentName.indexOf("3") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 2;
                } else if (cardIDPos == 1) {
                    cardIDPos = 3;
                } else if (cardIDPos == 2) {
                    // cardIDPos = 0;
                } else if (cardIDPos == 3) {
                    cardIDPos = 1;
                }
            } else if (nodeParentName.indexOf("4") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 1;
                } else if (cardIDPos == 1) {
                    cardIDPos = 2;
                } else if (cardIDPos == 2) {
                    cardIDPos = 3;
                } else if (cardIDPos == 3) {
                    // cardIDPos = 0;
                }
            }
            if (cardIDPos == 1) {
                cardbgPos = 0;
            } else if (cardIDPos == 2) {
                cardbgPos = 1;
            } else if (cardIDPos == 3) {
                cardbgPos = 2;
            }

            if (opType == this.ShareDefine.OpType_Chi) {
                var middleIndex = cardIDList.indexOf(getCardID);
                var middleCardID = cardIDList.splice(middleIndex, 1);
                cardIDList.splice(0, 0, middleCardID);
            }

            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
                //暗杠自己摸得杠，不标记
                cardbgPos = -1;
                getCardID == -1;
            }
            if (opType == this.ShareDefine.OpType_MingGang) {
                //明杠自己摸得杠，不标记
                cardbgPos = -1;
                getCardID == -1;
            }
            var childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            var childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue;
            }
            if (cardIDList.length == 4 && cardbgPos == 1) {
                //如果是杠，牌还是对家的，那蒙版就贴在第4张
                cardbgPos = 3;
            }
            childNode.active = true;
            var cardCount = cardIDList.length;
            for (var cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                var cardID = cardIDList[cardIndex];
                var paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                var childPath = [childName, paiChildName].join("/");
                var _childNode4 = cc.find(childPath, this.node);
                if (!_childNode4) {
                    continue;
                }
                if (posCount > 2) {
                    if (cardbgPos == cardIndex && cardbgPos > -1) {
                        _childNode4.color = cc.color(150, 150, 150);
                    } else {
                        _childNode4.color = cc.color(255, 255, 255);
                    }
                }
                if (_childNode4.getChildByName("da")) {
                    _childNode4.getChildByName("da").active = false;
                }
                this.ShowJinBgByJAMJ(cardID, _childNode4, jin1, jin2);
                this.ShowImage(_childNode4, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (var _cardIndex2 = cardCount + 1; _cardIndex2 <= this.PaiChildCount; _cardIndex2++) {
                var _paiChildName2 = this.ComTool.StringAddNumSuffix("card", _cardIndex2, 2);
                var _childPath2 = [childName, _paiChildName2].join("/");
                var _childNode5 = cc.find(_childPath2, this.node);
                if (!_childNode5) {
                    continue;
                }
                var cardSprite = _childNode5.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;
            }
        }

        //隐藏掉剩余的卡牌
        for (var _index2 = count + 1; _index2 <= this.ChildCount; _index2++) {
            var _childName2 = this.ComTool.StringAddNumSuffix("down", _index2, 2);
            var _childNode6 = this.node.getChildByName(_childName2);
            if (!_childNode6) {
                continue;
            }
            _childNode6.active = false;
            if (_childNode6.getChildByName("da")) {
                _childNode6.getChildByName("da").active = false;
            }
            if (_childNode6.getChildByName("icon_fu")) {
                _childNode6.getChildByName("icon_fu").active = false;
            }
        }
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
    // 特殊蛋(长春麻将)
    ShowTeShuDanDownCardByCCMJ: function ShowTeShuDanDownCardByCCMJ(cardIDList, childNode) {
        var imageString = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'EatCard_Self_';
        var jin1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var jin2 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

        childNode.active = true;
        var sameCardTypes = this.GetSameCardTypes(cardIDList);
        var cardCount = Object.keys(sameCardTypes).length;
        var i = 1;
        for (var cardType in sameCardTypes) {
            if (sameCardTypes.hasOwnProperty(cardType)) {
                var cardList = sameCardTypes[cardType] || [];
                var count = cardList.length;
                var cardNode = childNode.getChildByName("card0" + i++);
                cardNode.getChildByName("lb_num").active = count > 1;
                cardNode.getChildByName("lb_num").getComponent(cc.Label).string = "x" + count;
                var cardID = Math.floor(cardType + "01");
                if (cardNode.getChildByName("da")) {
                    cardNode.getChildByName("da").active = false;
                }
                this.ShowJinBg(cardID, cardNode, jin1, jin2);
                this.ShowImage(cardNode, imageString, cardID);
            }
        }

        for (var cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
            var paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
            var childPath = paiChildName; //[childName, paiChildName].join("/");
            if (cardIndex == 6) {
                childPath = [paiChildName, "cards"].join("/");
            }
            var _cardNode = cc.find(childPath, childNode);
            if (!_cardNode) {
                continue;
            }
            _cardNode.color = cc.color(255, 255, 255);
            // console.error("cardNode: ", cardNode.name)
            _cardNode.active = false;
            var cardSprite = _cardNode.getComponent(cc.Sprite);
            cardSprite.spriteFrame = null;
        }
    },
    // 长春麻将
    ShowDownCardByCCMJ: function ShowDownCardByCCMJ(publicCardList, posCount) {
        var jin1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var jin2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var imageString = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'EatCard_Self_';

        var count = 0;
        if (typeof publicCardList != "undefined") {
            count = publicCardList.length;
        }
        for (var index = 0; index < count; index++) {
            var publicInfoList = publicCardList[index];
            var cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            var opType = publicInfoList[0];
            // 长春特殊蛋处理
            if (opType == this.ShareDefine.OpType_TeShuDan) {
                var _childName3 = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
                var _childNode7 = this.node.getChildByName(_childName3);
                if (!!_childNode7) {
                    this.ShowTeShuDanDownCardByCCMJ(cardIDList, _childNode7, imageString, jin1, jin2);
                }
                continue;
            }
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
            }

            var childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            var childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue;
            }
            var isNeedShowCard06 = false;
            childNode.active = true;
            var cardCount = cardIDList.length;
            for (var cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                var cardID = cardIDList[cardIndex];
                var paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                var childPath = [childName, paiChildName].join("/");
                // 长春特殊蛋处理(第四张牌校正)
                if (cardIndex == 3) {
                    paiChildName = this.ComTool.StringAddNumSuffix("card", 6, 2);
                    childPath = [childName, paiChildName, "cards"].join("/");
                    isNeedShowCard06 = true;
                }
                var _childNode8 = cc.find(childPath, this.node);
                if (!_childNode8) {
                    continue;
                }
                this.ShowImage(_childNode8, imageString, cardID);
            }
            //设置多余的卡牌位置空
            var offset = 1;
            if (isNeedShowCard06) {
                offset = 0;
            }
            for (var _cardIndex3 = cardCount + offset; _cardIndex3 <= 6; _cardIndex3++) {
                var _paiChildName3 = this.ComTool.StringAddNumSuffix("card", _cardIndex3, 2);
                var _childPath3 = [childName, _paiChildName3].join("/");
                var _childNode9 = cc.find(_childPath3, this.node);
                if (_cardIndex3 == 6) {
                    if (isNeedShowCard06) {
                        continue;
                    }
                    _childPath3 = [childName, _paiChildName3, "cards"].join("/");
                    _childNode9 = cc.find(_childPath3, this.node);
                }
                if (!_childNode9) {
                    continue;
                }
                _childNode9.active = false;
                var cardSprite = _childNode9.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;
            }
        }

        //隐藏掉剩余的卡牌
        for (var _index3 = count + 1; _index3 <= this.ChildCount; _index3++) {
            var _childName4 = this.ComTool.StringAddNumSuffix("down", _index3, 2);
            var _childNode10 = this.node.getChildByName(_childName4);
            if (!_childNode10) {
                continue;
            }
            _childNode10.active = false;
        }
    },
    ShowDownCard: function ShowDownCard(publicCardList) {
        var imageString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'EatCard_Self_';

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
                cardIDList = [0, 0, 0, cardIDList[3]];
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
                var _childNode11 = cc.find(childPath, this.node);
                if (!_childNode11) {
                    continue;
                }
                this.ShowImage(_childNode11, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (var _cardIndex4 = cardCount + 1; _cardIndex4 <= this.PaiChildCount; _cardIndex4++) {
                var _paiChildName4 = this.ComTool.StringAddNumSuffix("card", _cardIndex4, 2);
                var _childPath4 = [childName, _paiChildName4].join("/");
                var _childNode12 = cc.find(_childPath4, this.node);
                if (!_childNode12) {
                    continue;
                }
                var cardSprite = _childNode12.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;
            }
        }

        //隐藏掉剩余的卡牌
        for (var _index4 = count + 1; _index4 <= this.ChildCount; _index4++) {
            var _childName5 = this.ComTool.StringAddNumSuffix("down", _index4, 2);
            var _childNode13 = this.node.getChildByName(_childName5);
            if (!_childNode13) {
                continue;
            }
            _childNode13.active = false;
        }
    },
    ShowDownCardBySSE: function ShowDownCardBySSE(publicCardList) {
        var imageString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Poker_';

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
                cardIDList = [0, 0, 0, cardIDList[3]];
            }
            if (opType == this.ShareDefine.OpType_TianGang) {
                cardIDList = [0, 0, 0, 0, cardIDList[3]];
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
                var _childNode14 = cc.find(childPath, this.node);
                if (!_childNode14) {
                    continue;
                }
                this.ShowImageBySSE(_childNode14, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (var _cardIndex5 = cardCount + 1; _cardIndex5 <= 5; _cardIndex5++) {
                var _paiChildName5 = this.ComTool.StringAddNumSuffix("card", _cardIndex5, 2);
                var _childPath5 = [childName, _paiChildName5].join("/");
                var _childNode15 = cc.find(_childPath5, this.node);
                if (!_childNode15) {
                    continue;
                }
                var cardSprite = _childNode15.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;
            }
        }

        //隐藏掉剩余的卡牌
        for (var _index5 = count + 1; _index5 <= 8; _index5++) {
            var _childName6 = this.ComTool.StringAddNumSuffix("down", _index5, 2);
            var _childNode16 = this.node.getChildByName(_childName6);
            if (!_childNode16) {
                continue;
            }
            _childNode16.active = false;
        }
    },
    //诸暨麻将
    ShowDownCardBySXZJMJ: function ShowDownCardBySXZJMJ(kexuanwanfa, publicCardList, jin1, jin2) {
        var imageString = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'EatCard_Self_';

        var count = 0;
        if (typeof publicCardList != "undefined") {
            count = publicCardList.length;
        }
        for (var index = 0; index < count; index++) {
            var publicInfoList = publicCardList[index];
            var cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            var opType = publicInfoList[0];
            var actionCardID = publicInfoList[2];
            var carIDIndex = cardIDList.indexOf(actionCardID);
            cardIDList.splice(carIDIndex, 1);
            cardIDList.push(actionCardID);
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                if (kexuanwanfa.indexOf(2) > -1) {//暗杠可见

                } else {
                    cardIDList = [0, 0, 0, cardIDList[3]];
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
                var _childNode17 = cc.find(childPath, this.node);
                if (!_childNode17) {
                    continue;
                }
                this.ShowJinBg(cardID, _childNode17, jin1, jin2);
                this.ShowImage(_childNode17, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (var _cardIndex6 = cardCount + 1; _cardIndex6 <= this.PaiChildCount; _cardIndex6++) {
                var _paiChildName6 = this.ComTool.StringAddNumSuffix("card", _cardIndex6, 2);
                var _childPath6 = [childName, _paiChildName6].join("/");
                var _childNode18 = cc.find(_childPath6, this.node);
                if (!_childNode18) {
                    continue;
                }
                var cardSprite = _childNode18.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;
            }
        }

        //隐藏掉剩余的卡牌
        for (var _index6 = count + 1; _index6 <= this.ChildCount; _index6++) {
            var _childName7 = this.ComTool.StringAddNumSuffix("down", _index6, 2);
            var _childNode19 = this.node.getChildByName(_childName7);
            if (!_childNode19) {
                continue;
            }
            _childNode19.active = false;
        }
    },
    // 内江麻将
    ShowDownCardBySCNJMJ: function ShowDownCardBySCNJMJ(publicCardList) {
        var imageString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'EatCard_Self_';
        var gangMap = arguments[2];
        var posResultInfo = arguments[3];

        var count = 0;
        if (typeof publicCardList != "undefined") {
            count = publicCardList.length;
        }

        for (var index = 0; index < count; index++) {
            var publicInfoList = publicCardList[index];
            var cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            var opType = publicInfoList[0];
            var cardId = cardIDList[0];
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
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
                var _childNode20 = cc.find(childPath, this.node);
                if (!_childNode20) {
                    continue;
                }
                _childNode20.getChildByName("bg_mask").active = (posResultInfo["ypdyList"] || []).indexOf(cardID) > -1;
                this.ShowImage(_childNode20, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (var _cardIndex7 = cardCount + 1; _cardIndex7 <= this.PaiChildCount; _cardIndex7++) {
                var _paiChildName7 = this.ComTool.StringAddNumSuffix("card", _cardIndex7, 2);
                var _childPath7 = [childName, _paiChildName7].join("/");
                var _childNode21 = cc.find(_childPath7, this.node);
                if (!_childNode21) {
                    continue;
                }
                var cardSprite = _childNode21.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;
                _childNode21.getChildByName("bg_mask").active = false;
            }

            var cardType = Math.floor(cardId / 100);
            var gangNumLists = gangMap && gangMap[cardType] || [];
            // gangNumLists = this.SwitchToTargetData(gangNumLists);
            childNode.getChildByName("lb_gangNum").getComponent(cc.Label).string = gangNumLists.join("");
        }

        //隐藏掉剩余的卡牌
        for (var _index7 = count + 1; _index7 <= this.ChildCount; _index7++) {
            var _childName8 = this.ComTool.StringAddNumSuffix("down", _index7, 2);
            var _childNode22 = this.node.getChildByName(_childName8);
            if (!_childNode22) {
                continue;
            }
            _childNode22.active = false;
        }
    },
    ShowDownCardByJinBg: function ShowDownCardByJinBg(publicCardList) {
        var jin1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var jin2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
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
                cardIDList = [0, 0, 0, cardIDList[3]];
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
                var _childNode23 = cc.find(childPath, this.node);
                if (!_childNode23) {
                    continue;
                }
                this.ShowJinBg(cardID, _childNode23, jin1, jin2);
                this.ShowImage(_childNode23, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (var _cardIndex8 = cardCount + 1; _cardIndex8 <= this.PaiChildCount; _cardIndex8++) {
                var _paiChildName8 = this.ComTool.StringAddNumSuffix("card", _cardIndex8, 2);
                var _childPath8 = [childName, _paiChildName8].join("/");
                var _childNode24 = cc.find(_childPath8, this.node);
                if (!_childNode24) {
                    continue;
                }
                var cardSprite = _childNode24.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;
                _childNode24.color = cc.color(255, 255, 255);
                if (_childNode24.getChildByName("da")) {
                    _childNode24.getChildByName("da").active = false;
                }
            }
        }

        //隐藏掉剩余的卡牌
        for (var _index8 = count + 1; _index8 <= this.ChildCount; _index8++) {
            var _childName9 = this.ComTool.StringAddNumSuffix("down", _index8, 2);
            var _childNode25 = this.node.getChildByName(_childName9);
            if (!_childNode25) {
                continue;
            }
            _childNode25.active = false;
        }
    },
    ShowDownCardByLKMJ: function ShowDownCardByLKMJ(publicCardList) {
        var imageString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'EatCard_Self_';

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
            if (publicInfoList.indexOf(5001) > -1) {} else {
                if (opType == this.ShareDefine.OpType_AnGang) {
                    cardIDList = [0, 0, 0, cardIDList[3]];
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
                var _childNode26 = cc.find(childPath, this.node);
                if (!_childNode26) {
                    continue;
                }
                this.ShowImage(_childNode26, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (var _cardIndex9 = cardCount + 1; _cardIndex9 <= this.PaiChildCount; _cardIndex9++) {
                var _paiChildName9 = this.ComTool.StringAddNumSuffix("card", _cardIndex9, 2);
                var _childPath9 = [childName, _paiChildName9].join("/");
                var _childNode27 = cc.find(_childPath9, this.node);
                if (!_childNode27) {
                    continue;
                }
                var cardSprite = _childNode27.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;
            }
        }

        //隐藏掉剩余的卡牌
        for (var _index9 = count + 1; _index9 <= this.ChildCount; _index9++) {
            var _childName10 = this.ComTool.StringAddNumSuffix("down", _index9, 2);
            var _childNode28 = this.node.getChildByName(_childName10);
            if (!_childNode28) {
                continue;
            }
            _childNode28.active = false;
        }
    },
    ShowDownCardByJMSKMJ: function ShowDownCardByJMSKMJ(publicCardList) {
        var jin1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var jin2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
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
                cardIDList = [0, 0, 0, cardIDList[3]];
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
                var _childNode29 = cc.find(childPath, this.node);
                if (!_childNode29) {
                    continue;
                }
                if (_childNode29.getChildByName("da")) {
                    _childNode29.getChildByName("da").active = false;
                }
                if (_childNode29.getChildByName("pi")) {
                    _childNode29.getChildByName("pi").active = false;
                }
                if (_childNode29.getChildByName("pi2")) {
                    _childNode29.getChildByName("pi2").active = false;
                }
                this.ShowJinBgByJMSKMJ(cardID, _childNode29, jin1, jin2);
                this.ShowImage(_childNode29, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (var _cardIndex10 = cardCount + 1; _cardIndex10 <= this.PaiChildCount; _cardIndex10++) {
                var _paiChildName10 = this.ComTool.StringAddNumSuffix("card", _cardIndex10, 2);
                var _childPath10 = [childName, _paiChildName10].join("/");
                var _childNode30 = cc.find(_childPath10, this.node);
                if (!_childNode30) {
                    continue;
                }
                var cardSprite = _childNode30.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;
                if (_childNode30.getChildByName("da")) {
                    _childNode30.getChildByName("da").active = false;
                }
                if (_childNode30.getChildByName("pi")) {
                    _childNode30.getChildByName("pi").active = false;
                }
                if (_childNode30.getChildByName("pi2")) {
                    _childNode30.getChildByName("pi2").active = false;
                }
            }
        }

        //隐藏掉剩余的卡牌
        for (var _index10 = count + 1; _index10 <= this.ChildCount; _index10++) {
            var _childName11 = this.ComTool.StringAddNumSuffix("down", _index10, 2);
            var _childNode31 = this.node.getChildByName(_childName11);
            if (!_childNode31) {
                continue;
            }
            _childNode31.active = false;
        }
    },
    ShowDownCardLLFYMJ: function ShowDownCardLLFYMJ(publicCardList) {
        var imageString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'EatCard_Self_';
        var liangPaiList = arguments[2];
        var baoZhangList = arguments[3];

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
                cardIDList = [0, 0, 0, cardIDList[3]];
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
                var _childNode32 = cc.find(childPath, this.node);
                if (!_childNode32) {
                    continue;
                }
                _childNode32.getChildByName("da").active = false;
                _childNode32.getChildByName("kouting").active = false;
                this.ShowImage(_childNode32, imageString, cardID);
                if (liangPaiList.indexOf(cardID) > -1) {
                    _childNode32.getChildByName("da").active = true;
                }
                if (baoZhangList.indexOf(cardID) > -1) {
                    _childNode32.getChildByName("kouting").active = true;
                }
            }
            //设置多余的卡牌位置空
            for (var _cardIndex11 = cardCount + 1; _cardIndex11 <= this.PaiChildCount; _cardIndex11++) {
                var _paiChildName11 = this.ComTool.StringAddNumSuffix("card", _cardIndex11, 2);
                var _childPath11 = [childName, _paiChildName11].join("/");
                var _childNode33 = cc.find(_childPath11, this.node);
                if (!_childNode33) {
                    continue;
                }
                var cardSprite = _childNode33.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;
            }
        }

        //隐藏掉剩余的卡牌
        for (var _index11 = count + 1; _index11 <= this.ChildCount; _index11++) {
            var _childName12 = this.ComTool.StringAddNumSuffix("down", _index11, 2);
            var _childNode34 = this.node.getChildByName(_childName12);
            if (!_childNode34) {
                continue;
            }
            _childNode34.active = false;
        }
    },
    //武汉麻将
    ShowDownCardByHBWHMJ: function ShowDownCardByHBWHMJ(publicCardList, posCount) {
        var jin1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var laiZiPiList = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
        var specialLaiZiPiList = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
        var imageString = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'EatCard_Self_';

        var count = 0;
        if (typeof publicCardList != "undefined") {
            count = publicCardList.length;
        }
        for (var index = 0; index < count; index++) {
            var publicInfoList = publicCardList[index];
            var cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            var opType = publicInfoList[0];
            //定位碰吃位置，上家下家还是对家
            var cardbgPos = -1;
            var cardIDPos = publicInfoList[1];
            var getCardID = publicInfoList[2];

            var nodeParentName = this.node.parent.name;
            if (nodeParentName.indexOf("1") > 0) {} else if (nodeParentName.indexOf("2") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 3;
                } else if (cardIDPos == 1) {
                    // cardIDPos = 0;
                } else if (cardIDPos == 2) {
                    cardIDPos = 1;
                } else if (cardIDPos == 3) {
                    cardIDPos = 2;
                }
            } else if (nodeParentName.indexOf("3") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 2;
                } else if (cardIDPos == 1) {
                    cardIDPos = 3;
                } else if (cardIDPos == 2) {
                    // cardIDPos = 0;
                } else if (cardIDPos == 3) {
                    cardIDPos = 1;
                }
            } else if (nodeParentName.indexOf("4") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 1;
                } else if (cardIDPos == 1) {
                    cardIDPos = 2;
                } else if (cardIDPos == 2) {
                    cardIDPos = 3;
                } else if (cardIDPos == 3) {
                    // cardIDPos = 0;
                }
            }
            if (cardIDPos == 1) {
                cardbgPos = 0;
            } else if (cardIDPos == 2) {
                cardbgPos = 1;
            } else if (cardIDPos == 3) {
                cardbgPos = 2;
            }

            if (opType == this.ShareDefine.OpType_Chi) {
                var middleIndex = cardIDList.indexOf(getCardID);
                var middleCardID = cardIDList.splice(middleIndex, 1);
                cardIDList.splice(0, 0, middleCardID);
            }

            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
                //暗杠自己摸得杠，不标记
                cardbgPos = -1;
                getCardID == -1;
            }
            if (opType == this.ShareDefine.OpType_MingGang) {
                //明杠自己摸得杠，不标记
                cardbgPos = -1;
                getCardID == -1;
            }
            var childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            var childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue;
            }
            if (cardIDList.length == 4 && cardbgPos == 1) {
                //如果是杠，牌还是对家的，那蒙版就贴在第4张
                cardbgPos = 3;
            }
            childNode.active = true;
            var cardCount = cardIDList.length;
            for (var cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                var cardID = cardIDList[cardIndex];
                var paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                var childPath = [childName, paiChildName].join("/");
                var _childNode35 = cc.find(childPath, this.node);
                if (!_childNode35) {
                    continue;
                }
                if (posCount > 2) {
                    if (cardbgPos == cardIndex && cardbgPos > -1) {
                        _childNode35.color = cc.color(150, 150, 150);
                    } else {
                        _childNode35.color = cc.color(255, 255, 255);
                    }
                }
                if (_childNode35.getChildByName("da")) {
                    _childNode35.getChildByName("da").active = false;
                }
                this.ShowJinBgByHBWHMJ(cardID, _childNode35, jin1, laiZiPiList, specialLaiZiPiList);
                this.ShowImage(_childNode35, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (var _cardIndex12 = cardCount + 1; _cardIndex12 <= this.PaiChildCount; _cardIndex12++) {
                var _paiChildName12 = this.ComTool.StringAddNumSuffix("card", _cardIndex12, 2);
                var _childPath12 = [childName, _paiChildName12].join("/");
                var _childNode36 = cc.find(_childPath12, this.node);
                if (!_childNode36) {
                    continue;
                }
                var cardSprite = _childNode36.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;
            }
        }

        //隐藏掉剩余的卡牌
        for (var _index12 = count + 1; _index12 <= this.ChildCount; _index12++) {
            var _childName13 = this.ComTool.StringAddNumSuffix("down", _index12, 2);
            var _childNode37 = this.node.getChildByName(_childName13);
            if (!_childNode37) {
                continue;
            }
            _childNode37.active = false;
        }
    },
    //景德镇麻将
    ShowDownCardByJDZMJ: function ShowDownCardByJDZMJ(publicCardList, posCount) {
        var jin1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var jin2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var imageString = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'EatCard_Self_';

        var count = 0;
        if (typeof publicCardList != "undefined") {
            count = publicCardList.length;
        }
        for (var index = 0; index < count; index++) {
            var publicInfoList = publicCardList[index];
            var cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            var opType = publicInfoList[0];
            //定位碰吃位置，上家下家还是对家
            var cardbgPos = -1;
            var cardIDPos = publicInfoList[1];
            var getCardID = publicInfoList[2];

            var nodeParentName = this.node.parent.name;
            if (nodeParentName.indexOf("1") > 0) {} else if (nodeParentName.indexOf("2") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 3;
                } else if (cardIDPos == 1) {
                    // cardIDPos = 0;
                } else if (cardIDPos == 2) {
                    cardIDPos = 1;
                } else if (cardIDPos == 3) {
                    cardIDPos = 2;
                }
            } else if (nodeParentName.indexOf("3") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 2;
                } else if (cardIDPos == 1) {
                    cardIDPos = 3;
                } else if (cardIDPos == 2) {
                    // cardIDPos = 0;
                } else if (cardIDPos == 3) {
                    cardIDPos = 1;
                }
            } else if (nodeParentName.indexOf("4") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 1;
                } else if (cardIDPos == 1) {
                    cardIDPos = 2;
                } else if (cardIDPos == 2) {
                    cardIDPos = 3;
                } else if (cardIDPos == 3) {
                    // cardIDPos = 0;
                }
            }
            if (cardIDPos == 1) {
                cardbgPos = 0;
            } else if (cardIDPos == 2) {
                cardbgPos = 1;
            } else if (cardIDPos == 3) {
                cardbgPos = 2;
            }

            if (opType == this.ShareDefine.OpType_Chi) {
                var middleIndex = cardIDList.indexOf(getCardID);
                var middleCardID = cardIDList.splice(middleIndex, 1);
                cardIDList.splice(0, 0, middleCardID);
            }

            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
                //暗杠自己摸得杠，不标记
                cardbgPos = -1;
                getCardID == -1;
            }
            if (opType == this.ShareDefine.OpType_MingGang) {
                //明杠自己摸得杠，不标记
                cardbgPos = -1;
                getCardID == -1;
            }
            var childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            var childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue;
            }
            if (cardIDList.length == 4 && cardbgPos == 1) {
                //如果是杠，牌还是对家的，那蒙版就贴在第4张
                cardbgPos = 3;
            }
            childNode.active = true;
            var cardCount = cardIDList.length;
            for (var cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                var cardID = cardIDList[cardIndex];
                var paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                var childPath = [childName, paiChildName].join("/");
                var _childNode38 = cc.find(childPath, this.node);
                if (!_childNode38) {
                    continue;
                }
                if (posCount > 2) {
                    if (cardbgPos == cardIndex && cardbgPos > -1) {
                        _childNode38.color = cc.color(150, 150, 150);
                    } else {
                        _childNode38.color = cc.color(255, 255, 255);
                    }
                }
                if (_childNode38.getChildByName("da")) {
                    _childNode38.getChildByName("da").active = false;
                }
                this.ShowJinBg(cardID, _childNode38, jin1, jin2);
                this.ShowImage(_childNode38, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (var _cardIndex13 = cardCount + 1; _cardIndex13 <= this.PaiChildCount; _cardIndex13++) {
                var _paiChildName13 = this.ComTool.StringAddNumSuffix("card", _cardIndex13, 2);
                var _childPath13 = [childName, _paiChildName13].join("/");
                var _childNode39 = cc.find(_childPath13, this.node);
                if (!_childNode39) {
                    continue;
                }
                var cardSprite = _childNode39.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;
            }
        }

        //隐藏掉剩余的卡牌
        for (var _index13 = count + 1; _index13 <= this.ChildCount; _index13++) {
            var _childName14 = this.ComTool.StringAddNumSuffix("down", _index13, 2);
            var _childNode40 = this.node.getChildByName(_childName14);
            if (!_childNode40) {
                continue;
            }
            _childNode40.active = false;
        }
    },
    //河南信阳麻将
    ShowDownCardByHnxymj: function ShowDownCardByHnxymj(publicCardList, allKanList) {
        var imageString = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "EatCard_Self_";

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
                cardIDList = [0, 0, 0, cardIDList[3]];
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
                var _childNode41 = cc.find(childPath, this.node);
                if (!_childNode41) {
                    continue;
                }
                this.ShowImage(_childNode41, imageString, cardID);
                this.ShowDownCardKan(_childNode41, allKanList.indexOf(cardID) > -1);
            }
            //设置多余的卡牌位置空
            for (var _cardIndex14 = cardCount + 1; _cardIndex14 <= this.PaiChildCount; _cardIndex14++) {
                var _paiChildName14 = this.ComTool.StringAddNumSuffix("card", _cardIndex14, 2);
                var _childPath14 = [childName, _paiChildName14].join("/");
                var _childNode42 = cc.find(_childPath14, this.node);
                if (!_childNode42) {
                    continue;
                }
                var cardSprite = _childNode42.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;
            }
        }

        //隐藏掉剩余的卡牌
        for (var _index14 = count + 1; _index14 <= this.ChildCount; _index14++) {
            var _childName15 = this.ComTool.StringAddNumSuffix("down", _index14, 2);
            var _childNode43 = this.node.getChildByName(_childName15);
            if (!_childNode43) {
                continue;
            }
            _childNode43.active = false;
        }
    },
    //黎川麻将
    ShowDownCardByLCMJ: function ShowDownCardByLCMJ(publicCardList, posCount) {
        var jin1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var jin2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var imageString = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'EatCard_Self_';
        var notPointGangList = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];

        var count = 0;
        if (typeof publicCardList != "undefined") {
            count = publicCardList.length;
        }
        for (var index = 0; index < count; index++) {
            var publicInfoList = publicCardList[index];
            var cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            var opType = publicInfoList[0];
            //定位碰吃位置，上家下家还是对家
            var cardbgPos = -1;
            var cardIDPos = publicInfoList[1];
            var getCardID = publicInfoList[2];

            var nodeParentName = this.node.parent.name;
            if (nodeParentName.indexOf("1") > 0) {} else if (nodeParentName.indexOf("2") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 3;
                } else if (cardIDPos == 1) {
                    // cardIDPos = 0;
                } else if (cardIDPos == 2) {
                    cardIDPos = 1;
                } else if (cardIDPos == 3) {
                    cardIDPos = 2;
                }
            } else if (nodeParentName.indexOf("3") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 2;
                } else if (cardIDPos == 1) {
                    cardIDPos = 3;
                } else if (cardIDPos == 2) {
                    // cardIDPos = 0;
                } else if (cardIDPos == 3) {
                    cardIDPos = 1;
                }
            } else if (nodeParentName.indexOf("4") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 1;
                } else if (cardIDPos == 1) {
                    cardIDPos = 2;
                } else if (cardIDPos == 2) {
                    cardIDPos = 3;
                } else if (cardIDPos == 3) {
                    // cardIDPos = 0;
                }
            }
            if (cardIDPos == 1) {
                cardbgPos = 0;
            } else if (cardIDPos == 2) {
                cardbgPos = 1;
            } else if (cardIDPos == 3) {
                cardbgPos = 2;
            }

            if (opType == this.ShareDefine.OpType_Chi) {
                var middleIndex = cardIDList.indexOf(getCardID);
                var middleCardID = cardIDList.splice(middleIndex, 1);
                cardIDList.splice(0, 0, middleCardID);
            }

            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
                //暗杠自己摸得杠，不标记
                cardbgPos = -1;
                getCardID == -1;
            }
            if (opType == this.ShareDefine.OpType_MingGang) {
                //明杠自己摸得杠，不标记
                cardbgPos = -1;
                getCardID == -1;
            }
            var childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            var childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue;
            }
            if (cardIDList.length == 4 && cardbgPos == 1) {
                //如果是杠，牌还是对家的，那蒙版就贴在第4张
                cardbgPos = 3;
            }
            childNode.active = true;
            var cardCount = cardIDList.length;
            for (var cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                var cardID = cardIDList[cardIndex];
                var paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                var childPath = [childName, paiChildName].join("/");
                var _childNode44 = cc.find(childPath, this.node);
                if (!_childNode44) {
                    continue;
                }
                if (posCount > 2) {
                    if (cardbgPos == cardIndex && cardbgPos > -1) {
                        _childNode44.color = cc.color(150, 150, 150);
                    } else {
                        _childNode44.color = cc.color(255, 255, 255);
                    }
                }
                if (_childNode44.getChildByName("da")) {
                    _childNode44.getChildByName("da").active = false;
                }
                this.ShowJinBg(cardID, _childNode44, jin1, jin2);
                this.ShowImage(_childNode44, imageString, cardID);
                //不算分的杠置灰
                if (notPointGangList.indexOf(Math.floor(cardID / 100)) > -1) {
                    _childNode44.color = cc.color(125, 125, 125);
                } else {
                    _childNode44.color = cc.color(255, 255, 255);
                }
            }
            //设置多余的卡牌位置空
            for (var _cardIndex15 = cardCount + 1; _cardIndex15 <= this.PaiChildCount; _cardIndex15++) {
                var _paiChildName15 = this.ComTool.StringAddNumSuffix("card", _cardIndex15, 2);
                var _childPath15 = [childName, _paiChildName15].join("/");
                var _childNode45 = cc.find(_childPath15, this.node);
                if (!_childNode45) {
                    continue;
                }
                var cardSprite = _childNode45.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;
            }
        }

        //隐藏掉剩余的卡牌
        for (var _index15 = count + 1; _index15 <= this.ChildCount; _index15++) {
            var _childName16 = this.ComTool.StringAddNumSuffix("down", _index15, 2);
            var _childNode46 = this.node.getChildByName(_childName16);
            if (!_childNode46) {
                continue;
            }
            _childNode46.active = false;
        }
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
            }
        }
        var imageInfo = this.IntegrateImage[imageName];
        if (!imageInfo) {
            this.ErrLog("ShowImage IntegrateImage.txt not find:%s", imageName);
            return;
        }
        var imagePath = imageInfo["FilePath"];
        if (app['majiang_' + imageName]) {
            childSprite.spriteFrame = app['majiang_' + imageName];
        } else {
            var that = this;
            app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame).then(function (spriteFrame) {
                if (!spriteFrame) {
                    that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
                    return;
                }
                childSprite.spriteFrame = spriteFrame;
                app['majiang_' + imageName] = spriteFrame;
            }).catch(function (error) {
                that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
            });
        }
    },
    ShowImageBySSE: function ShowImageBySSE(childNode, imageString, cardID) {
        //显示贴图
        var childSprite = childNode.getComponent(cc.Sprite);
        if (!childSprite) {
            this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
            return;
        }
        // if (cardID) {
        //     //取卡牌ID的前2位
        //     imageName = [imageString, Math.floor(cardID / 100)].join("");
        // }
        // else {
        //     if (imageString == "") {
        //         imageName = "CardBack_Self";
        //     }
        // }
        //取卡牌ID的前2位
        var imageName = [imageString, Math.floor(cardID / 100)].join("");
        var imageInfo = this.IntegrateImage[imageName];
        if (!imageInfo) {
            this.ErrLog("ShowImage IntegrateImage.txt not find:%s", imageName);
            return;
        }
        var imagePath = imageInfo["FilePath"];
        if (app['majiang_' + imageName]) {
            childSprite.spriteFrame = app['majiang_' + imageName];
        } else {
            var that = this;
            app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame).then(function (spriteFrame) {
                if (!spriteFrame) {
                    that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
                    return;
                }
                childSprite.spriteFrame = spriteFrame;
                app['majiang_' + imageName] = spriteFrame;
            }).catch(function (error) {
                that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
            });
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
            }
            if (Math.floor(cardID / 100) == 45 || Math.floor(cardID / 100) == 46) {
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
    //河南信阳麻将
    ShowDownCardKan: function ShowDownCardKan(childNode, isShow) {
        if (childNode.getChildByName("da")) {
            childNode.getChildByName("da").active = isShow;
        }
    }
});

cc._RF.pop();