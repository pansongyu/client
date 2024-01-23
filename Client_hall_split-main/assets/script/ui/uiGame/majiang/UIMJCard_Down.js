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
                let zhi = paiNode.getChildByName('zhi');
                if (zhi != null) {
                    zhi.active = false;
                }
                paiSprite.spriteFrame = null;
            }
        }
    },
    ShowDownCardByPZMJ: function (publicCardList, imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
            }
            //如果是坎牌,自己视角：暗明暗；别人视角：三暗
            if (opType == this.ShareDefine.OpType_KanPai) {
                cardIDList = [0, cardIDList[0], 0];
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
    GetSameCardTypes: function (cardIDList) {
        let sameValueList = {};
        for (let i = 0; i < cardIDList.length; i++) {
            let cardId = cardIDList[i];
            let cardType = Math.floor(cardId / 100);
            if (!sameValueList.hasOwnProperty(cardType)) {
                sameValueList[cardType] = [];
            }
            sameValueList[cardType].push(cardId);
        }
        return sameValueList;
    },
    // 吉安麻将
    ShowDownCardByJAMJ: function (publicCardList, posCount, jin1 = 0, jin2 = 0, imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //定位碰吃位置，上家下家还是对家
            let cardbgPos = -1;
            let cardIDPos = publicInfoList[1];
            let getCardID = publicInfoList[2];

            let nodeParentName = this.node.parent.name;
            if (nodeParentName.indexOf("1") > 0) {
            } else if (nodeParentName.indexOf("2") > 0) {
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
                let middleIndex = cardIDList.indexOf(getCardID);
                let middleCardID = cardIDList.splice(middleIndex, 1);
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
            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            if (cardIDList.length == 4 && cardbgPos == 1) {
                //如果是杠，牌还是对家的，那蒙版就贴在第4张
                cardbgPos = 3;
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
                if (posCount > 2) {
                    if (cardbgPos == cardIndex && cardbgPos > -1) {
                        childNode.color = cc.color(150, 150, 150);
                    } else {
                        childNode.color = cc.color(255, 255, 255);
                    }
                }
                if (childNode.getChildByName("da")) {
                    childNode.getChildByName("da").active = false;
                }
                this.ShowJinBgByJAMJ(cardID, childNode, jin1, jin2);
                this.ShowImage(childNode, imageString, cardID);
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
            if (childNode.getChildByName("da")) {
                childNode.getChildByName("da").active = false;
            }
            if (childNode.getChildByName("icon_fu")) {
                childNode.getChildByName("icon_fu").active = false;
            }
        }
    },
    ShowJinBgByJAMJ: function (cardID, childNode, jin1 = 0, jin2 = 0) {
        if (jin1 == 0) {
            if (this.RoomMgr == null) {
                return;
            }
            let room = this.RoomMgr.GetEnterRoom();
            if (!room) return;
            let roomSet = room.GetRoomSet();
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
    ShowTeShuDanDownCardByCCMJ: function (cardIDList, childNode, imageString = 'EatCard_Self_', jin1 = 0, jin2 = 0) {
        childNode.active = true;
        let sameCardTypes = this.GetSameCardTypes(cardIDList);
        let cardCount = Object.keys(sameCardTypes).length;
        let i = 1;
        for (let cardType in sameCardTypes) {
            if (sameCardTypes.hasOwnProperty(cardType)) {
                let cardList = sameCardTypes[cardType] || [];
                let count = cardList.length;
                let cardNode = childNode.getChildByName("card0" + i++);
                cardNode.getChildByName("lb_num").active = count > 1;
                cardNode.getChildByName("lb_num").getComponent(cc.Label).string = "x" + count;
                let cardID = Math.floor(cardType + "01");
                if (cardNode.getChildByName("da")) {
                    cardNode.getChildByName("da").active = false;
                }
                this.ShowJinBg(cardID, cardNode, jin1, jin2);
                this.ShowImage(cardNode, imageString, cardID);
            }
        }

        for (let cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
            let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
            let childPath = paiChildName;//[childName, paiChildName].join("/");
            if (cardIndex == 6) {
                childPath = [paiChildName, "cards"].join("/");
            }
            let cardNode = cc.find(childPath, childNode);
            if (!cardNode) {
                continue
            }
            cardNode.color = cc.color(255, 255, 255);
            // console.error("cardNode: ", cardNode.name)
            cardNode.active = false;
            let cardSprite = cardNode.getComponent(cc.Sprite);
            cardSprite.spriteFrame = null;
        }
    },
    // 长春麻将
    ShowDownCardByCCMJ: function (publicCardList, posCount, jin1 = 0, jin2 = 0, imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            // 长春特殊蛋处理
            if (opType == this.ShareDefine.OpType_TeShuDan) {
                let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
                let childNode = this.node.getChildByName(childName);
                if (!!childNode) {
                    this.ShowTeShuDanDownCardByCCMJ(cardIDList, childNode, imageString, jin1, jin2);
                }
                continue;
            }
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
            }

            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            let isNeedShowCard06 = false;
            childNode.active = true;
            let cardCount = cardIDList.length;
            for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                let cardID = cardIDList[cardIndex];
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                let childPath = [childName, paiChildName].join("/");
                // 长春特殊蛋处理(第四张牌校正)
                if (cardIndex == 3) {
                    paiChildName = this.ComTool.StringAddNumSuffix("card", 6, 2);
                    childPath = [childName, paiChildName, "cards"].join("/");
                    isNeedShowCard06 = true;
                }
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                this.ShowImage(childNode, imageString, cardID);
            }
            //设置多余的卡牌位置空
            let offset = 1;
            if (isNeedShowCard06) {
                offset = 0;
            }
            for (let cardIndex = cardCount + offset; cardIndex <= 6; cardIndex++) {
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (cardIndex == 6) {
                    if (isNeedShowCard06) {
                        continue;
                    }
                    childPath = [childName, paiChildName, "cards"].join("/");
                    childNode = cc.find(childPath, this.node);
                }
                if (!childNode) {
                    continue
                }
                childNode.active = false;
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
    ShowDownCard: function (publicCardList, imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
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
    ShowDownCardBySSE: function (publicCardList, imageString = 'Poker_') {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
            }
            if (opType == this.ShareDefine.OpType_TianGang) {
                cardIDList = [0, 0, 0, 0, cardIDList[3]];
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
                this.ShowImageBySSE(childNode, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (let cardIndex = cardCount + 1; cardIndex <= 5; cardIndex++) {
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
        for (let index = count + 1; index <= 8; index++) {
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = false;
        }
    },
    //诸暨麻将
    ShowDownCardBySXZJMJ: function (kexuanwanfa, publicCardList, jin1, jin2, imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            let actionCardID = publicInfoList[2];
            let carIDIndex = cardIDList.indexOf(actionCardID);
            cardIDList.splice(carIDIndex, 1);
            cardIDList.push(actionCardID);
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                if (kexuanwanfa.indexOf(2) > -1) {//暗杠可见

                } else {
                    cardIDList = [0, 0, 0, cardIDList[3]];
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
                this.ShowJinBg(cardID, childNode, jin1, jin2);
                this.ShowImage(childNode, imageString, cardID);
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
    // 内江麻将
    ShowDownCardBySCNJMJ: function (publicCardList, imageString = 'EatCard_Self_', gangMap, posResultInfo) {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }

        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            let cardId = cardIDList[0];
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
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
                childNode.getChildByName("bg_mask").active = (posResultInfo["ypdyList"] || []).indexOf(cardID) > -1;
                this.ShowImage(childNode, imageString, cardID);
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
                childNode.getChildByName("bg_mask").active = false;
            }

            let cardType = Math.floor(cardId / 100);
            let gangNumLists = gangMap && gangMap[cardType] || [];
            // gangNumLists = this.SwitchToTargetData(gangNumLists);
            childNode.getChildByName("lb_gangNum").getComponent(cc.Label).string = gangNumLists.join("");
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
    ShowDownCardByJinBg: function (publicCardList, jin1 = 0, jin2 = 0, imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
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
                this.ShowJinBg(cardID, childNode, jin1, jin2);
                this.ShowImage(childNode, imageString, cardID);
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
                childNode.color = cc.color(255, 255, 255);
                if (childNode.getChildByName("da")) {
                    childNode.getChildByName("da").active = false;
                }

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
    ShowDownCardByLKMJ: function (publicCardList, imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (publicInfoList.indexOf(5001) > -1) {
            } else {
                if (opType == this.ShareDefine.OpType_AnGang) {
                    cardIDList = [0, 0, 0, cardIDList[3]];
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
    ShowDownCardByJMSKMJ: function (publicCardList, jin1 = 0, jin2 = 0, imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
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
                this.ShowImage(childNode, imageString, cardID);
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
    ShowDownCardLLFYMJ: function (publicCardList, imageString = 'EatCard_Self_', liangPaiList, baoZhangList) {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
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
                childNode.getChildByName("da").active = false;
                childNode.getChildByName("kouting").active = false;
                this.ShowImage(childNode, imageString, cardID);
                if (liangPaiList.indexOf(cardID) > -1) {
                    childNode.getChildByName("da").active = true;
                }
                if (baoZhangList.indexOf(cardID) > -1) {
                    childNode.getChildByName("kouting").active = true;
                }
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
    //武汉麻将
    ShowDownCardByHBWHMJ: function (publicCardList, posCount, jin1 = 0, laiZiPiList = [], specialLaiZiPiList = [], imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //定位碰吃位置，上家下家还是对家
            let cardbgPos = -1;
            let cardIDPos = publicInfoList[1];
            let getCardID = publicInfoList[2];

            let nodeParentName = this.node.parent.name;
            if (nodeParentName.indexOf("1") > 0) {
            } else if (nodeParentName.indexOf("2") > 0) {
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
                let middleIndex = cardIDList.indexOf(getCardID);
                let middleCardID = cardIDList.splice(middleIndex, 1);
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
            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            if (cardIDList.length == 4 && cardbgPos == 1) {
                //如果是杠，牌还是对家的，那蒙版就贴在第4张
                cardbgPos = 3;
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
                if (posCount > 2) {
                    if (cardbgPos == cardIndex && cardbgPos > -1) {
                        childNode.color = cc.color(150, 150, 150);
                    } else {
                        childNode.color = cc.color(255, 255, 255);
                    }
                }
                if (childNode.getChildByName("da")) {
                    childNode.getChildByName("da").active = false;
                }
                this.ShowJinBgByHBWHMJ(cardID, childNode, jin1, laiZiPiList, specialLaiZiPiList);
                this.ShowImage(childNode, imageString, cardID);
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
    //景德镇麻将
    ShowDownCardByJDZMJ: function (publicCardList, posCount, jin1 = 0, jin2 = 0, imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //定位碰吃位置，上家下家还是对家
            let cardbgPos = -1;
            let cardIDPos = publicInfoList[1];
            let getCardID = publicInfoList[2];

            let nodeParentName = this.node.parent.name;
            if (nodeParentName.indexOf("1") > 0) {
            } else if (nodeParentName.indexOf("2") > 0) {
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
                let middleIndex = cardIDList.indexOf(getCardID);
                let middleCardID = cardIDList.splice(middleIndex, 1);
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
            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            if (cardIDList.length == 4 && cardbgPos == 1) {
                //如果是杠，牌还是对家的，那蒙版就贴在第4张
                cardbgPos = 3;
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
                if (posCount > 2) {
                    if (cardbgPos == cardIndex && cardbgPos > -1) {
                        childNode.color = cc.color(150, 150, 150);
                    } else {
                        childNode.color = cc.color(255, 255, 255);
                    }
                }
                if (childNode.getChildByName("da")) {
                    childNode.getChildByName("da").active = false;
                }
                this.ShowJinBg(cardID, childNode, jin1, jin2);
                this.ShowImage(childNode, imageString, cardID);
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
    //河南信阳麻将
    ShowDownCardByHnxymj: function (publicCardList, allKanList, imageString = "EatCard_Self_") {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
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
                this.ShowDownCardKan(childNode, allKanList.indexOf(cardID) > -1);
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
    //黎川麻将
    ShowDownCardByLCMJ: function (publicCardList, posCount, jin1 = 0, jin2 = 0, imageString = 'EatCard_Self_', notPointGangList = []) {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //定位碰吃位置，上家下家还是对家
            let cardbgPos = -1;
            let cardIDPos = publicInfoList[1];
            let getCardID = publicInfoList[2];

            let nodeParentName = this.node.parent.name;
            if (nodeParentName.indexOf("1") > 0) {
            } else if (nodeParentName.indexOf("2") > 0) {
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
                let middleIndex = cardIDList.indexOf(getCardID);
                let middleCardID = cardIDList.splice(middleIndex, 1);
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
            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            if (cardIDList.length == 4 && cardbgPos == 1) {
                //如果是杠，牌还是对家的，那蒙版就贴在第4张
                cardbgPos = 3;
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
                if (posCount > 2) {
                    if (cardbgPos == cardIndex && cardbgPos > -1) {
                        childNode.color = cc.color(150, 150, 150);
                    } else {
                        childNode.color = cc.color(255, 255, 255);
                    }
                }
                if (childNode.getChildByName("da")) {
                    childNode.getChildByName("da").active = false;
                }
                this.ShowJinBg(cardID, childNode, jin1, jin2);
                this.ShowImage(childNode, imageString, cardID);
                //不算分的杠置灰
                if (notPointGangList.indexOf(Math.floor(cardID / 100)) > -1) {
                    childNode.color = cc.color(125, 125, 125);
                } else {
                    childNode.color = cc.color(255, 255, 255);
                }
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
        }
        else {
            if (imageString == "EatCard_Self_") {
                imageName = "CardBack_Self";
            }
        }
        let imageInfo = this.IntegrateImage[imageName];
        if (!imageInfo) {
            this.ErrLog("ShowImage IntegrateImage.txt not find:%s", imageName);
            return
        }
        let imagePath = imageInfo["FilePath"];
        if (app['majiang_' + imageName]) {
            childSprite.spriteFrame = app['majiang_' + imageName];
        } else {
            let that = this;
            app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame)
                .then(function (spriteFrame) {
                    if (!spriteFrame) {
                        that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
                        return
                    }
                    childSprite.spriteFrame = spriteFrame;
                    app['majiang_' + imageName] = spriteFrame;
                })
                .catch(function (error) {
                        that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
                    }
                );
        }
    },
    ShowImageBySSE: function (childNode, imageString, cardID) {
        //显示贴图
        let childSprite = childNode.getComponent(cc.Sprite);
        if (!childSprite) {
            this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
            return
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
        let imageName = [imageString, Math.floor(cardID / 100)].join("");
        let imageInfo = this.IntegrateImage[imageName];
        if (!imageInfo) {
            this.ErrLog("ShowImage IntegrateImage.txt not find:%s", imageName);
            return
        }
        let imagePath = imageInfo["FilePath"];
        if (app['majiang_' + imageName]) {
            childSprite.spriteFrame = app['majiang_' + imageName];
        } else {
            let that = this;
            app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame)
                .then(function (spriteFrame) {
                    if (!spriteFrame) {
                        that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
                        return
                    }
                    childSprite.spriteFrame = spriteFrame;
                    app['majiang_' + imageName] = spriteFrame;
                })
                .catch(function (error) {
                        that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
                    }
                );
        }
    },
    ShowJinBg: function (cardID, childNode, jin1 = 0, jin2 = 0) {
        if (jin1 == 0) {
            if (this.RoomMgr == null) {
                return;
            }
            let room = this.RoomMgr.GetEnterRoom();
            if (!room) return;
            let roomSet = room.GetRoomSet();
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
    ShowJinBgByHBWHMJ: function (cardID, childNode, jin1 = 0, laiZiPiList = [], specialLaiZiPiList = []) {
        if (jin1 == 0) {
            if (this.RoomMgr == null) {
                return;
            }
            let room = this.RoomMgr.GetEnterRoom();
            if (!room) return;
            let roomSet = room.GetRoomSet();
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
    ShowJinBgByJMSKMJ: function (cardID, childNode, jin1 = 0, jin2 = 0) {
        if (jin1 == 0) {
            if (this.RoomMgr == null) {
                return;
            }
            let room = this.RoomMgr.GetEnterRoom();
            if (!room) return;
            let roomSet = room.GetRoomSet();
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
    ShowDownCardKan: function (childNode, isShow) {
        if (childNode.getChildByName("da")) {
            childNode.getChildByName("da").active = isShow;
        }
    }
});
