"use strict";
cc._RF.push(module, '8f5c1NoKYlJOIy+Kxk7+L8e', 'UIMJCard_ShowHua');
// script/ui/uiGame/majiang/UIMJCard_ShowHua.js

"use strict";

/*
 UICard01-04 set结束摊牌
 */

var app = require("app");

cc.Class({
    extends: require("BaseComponent"),

    properties: {},

    // use this for initialization
    OnLoad: function OnLoad() {
        this.JS_Name = this.node.name + "_UIMJCard_ShowHua";
        this.ComTool = app.ComTool();
        this.SysDataManager = app.SysDataManager();
        this.IntegrateImage = this.SysDataManager.GetTableDict("IntegrateImage");
        this.ChildCount = 8;
    },
    //多花用参数传花数，默认8花
    ShowHuaList: function ShowHuaList(cardIDList) {
        var imageString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'EatCard_Self_';

        var count = 0;
        if (typeof cardIDList != "undefined") {
            count = cardIDList.length;
        }
        cardIDList.sort();
        for (var i = 0; i < this.node.children.length; i++) {
            this.node.children[i].active = false;
        }
        for (var index = 0; index < count; index++) {
            var cardID = cardIDList[index];
            var childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
            var childNode = this.node.getChildByName(childName);
            if (!childNode) {
                this.SysLog("ShowAllDownCard not find childName:%s", childName);
                childNode = cc.instantiate(this.node.getChildByName("card01"));
                childNode.name = "card" + (index + 1);
                this.node.addChild(childNode);
                // continue;
            }
            childNode.active = true;
            this.ShowImage(childNode, imageString, cardID);
        }
        //设置多余的卡牌位置空
        for (var cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
            var _childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
            var _childNode = this.node.getChildByName(_childName);
            if (!_childNode) {
                this.SysLog("ShowAllDownCard not find childName:%s", _childName);
                continue;
            }
            _childNode.active = 0;
        }
    },

    //多花用参数传花数，默认8花
    ShowHuaListByKSMJ: function ShowHuaListByKSMJ(cardIDList) {
        var imageString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'EatCard_Self_';

        var count = 0;
        if (typeof cardIDList != "undefined") {
            count = cardIDList.length;
        }
        cardIDList.sort();
        for (var i = 0; i < this.node.children.length; i++) {
            this.node.children[i].active = false;
        }
        for (var index = 0; index < count; index++) {
            var cardID = cardIDList[index];
            var childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
            var childNode = this.node.getChildByName(childName);
            if (!childNode) {
                this.SysLog("ShowAllDownCard not find childName:%s", childName);
                childNode = cc.instantiate(this.node.getChildByName("card01"));
                childNode.name = "card" + (index + 1);
                this.node.addChild(childNode);
                // continue;
            }
            childNode.active = true;
            this.ShowImageByKSMJ(childNode, imageString, cardID);
        }
        //设置多余的卡牌位置空
        for (var cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
            var _childName2 = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
            var _childNode2 = this.node.getChildByName(_childName2);
            if (!_childNode2) {
                this.SysLog("ShowAllDownCard not find childName:%s", _childName2);
                continue;
            }
            _childNode2.active = 0;
        }
    },

    ShowImageByKSMJ: function ShowImageByKSMJ(childNode, imageString, cardID) {
        var childSprite = childNode.getComponent(cc.Sprite);
        if (!childSprite) {
            this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
            return;
        }
        //取卡牌ID的前2位
        var imageName = [imageString, Math.floor(cardID / 100)].join("");
        var cardType = Math.floor(cardID / 100);
        var cards = [48, 59, 60, 61, 62];
        if (cards.indexOf(cardType) > -1) {
            imageName = [imageString, Math.floor(cardID / 10)].join("");
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
            }).catch(function (error) {
                that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
            });
        }
    },

    // 中码牌
    ShowZhongMaList: function ShowZhongMaList(cardIDList) {
        var imageString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'EatCard_Self_';

        var count = 0;
        if (typeof cardIDList != "undefined") {
            count = cardIDList.length;
        }
        cardIDList.sort();
        for (var index = 0; index < count; index++) {
            var cardID = cardIDList[index];
            var childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
            var childNode = this.node.getChildByName(childName);
            if (!childNode) {
                this.SysLog("ShowAllDownCard not find childName:%s", childName);
                continue;
            }
            childNode.active = 1;
            //显示扎码贴图
            var tmpCardID = Math.floor(cardID / 100);
            if (tmpCardID == 11 || tmpCardID == 15 || tmpCardID == 19 || tmpCardID == 21 || tmpCardID == 25 || tmpCardID == 29 || tmpCardID == 31 || tmpCardID == 35 || tmpCardID == 39 || tmpCardID == 41 || tmpCardID == 45) {

                childNode.color = cc.color(255, 255, 0);
            }
            this.ShowImage(childNode, imageString, cardID);
        }
        //设置多余的卡牌位置空
        for (var cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
            var _childName3 = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
            var _childNode3 = this.node.getChildByName(_childName3);
            if (!_childNode3) {
                this.SysLog("ShowAllDownCard not find childName:%s", _childName3);
                continue;
            }
            _childNode3.active = 0;
        }
    },
    //苏州麻将专用
    ShowSZMJFanCardList: function ShowSZMJFanCardList(cardIDList, zhongMaList) {
        var imageString = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'EatCard_Self_';

        var ChildCount = 6;
        var count = 0;
        if (typeof cardIDList != "undefined") {
            count = cardIDList.length;
        }
        cardIDList.sort();
        for (var index = 0; index < count; index++) {
            var cardID = cardIDList[index];
            var childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
            var childNode = this.node.getChildByName(childName);
            if (!childNode) {
                this.SysLog("ShowAllDownCard not find childName:%s", childName);
                continue;
            }
            childNode.active = 1;
            this.ShowImage(childNode, imageString, cardID + "01");
            if (zhongMaList.indexOf(cardID) > -1) {
                childNode.color = cc.color(100, 100, 100);
            } else {
                childNode.color = cc.color(255, 255, 255);
            }
        }

        //设置多余的卡牌位置空
        for (var cardIndex = count + 1; cardIndex <= ChildCount; cardIndex++) {
            var _childName4 = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
            var _childNode4 = this.node.getChildByName(_childName4);
            if (!_childNode4) {
                this.SysLog("ShowAllDownCard not find childName:%s", _childName4);
                continue;
            }
            _childNode4.active = 0;
        }
    },
    //高邮麻将使用，多花
    Show20HuaList: function Show20HuaList(cardIDList) {
        var imageString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'EatCard_Self_';

        var ChildCount = 20;
        var count = 0;
        if (typeof cardIDList != "undefined") {
            count = cardIDList.length;
        }
        cardIDList.sort();
        for (var index = 0; index < count; index++) {
            var cardID = cardIDList[index];
            var childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
            var childNode = this.node.getChildByName(childName);
            if (!childNode) {
                this.SysLog("ShowAllDownCard not find childName:%s", childName);
                continue;
            }
            childNode.active = 1;
            this.ShowImage(childNode, imageString, cardID);
        }

        //设置多余的卡牌位置空
        for (var cardIndex = count + 1; cardIndex <= ChildCount; cardIndex++) {
            var _childName5 = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
            var _childNode5 = this.node.getChildByName(_childName5);
            if (!_childNode5) {
                this.SysLog("ShowAllDownCard not find childName:%s", _childName5);
                continue;
            }
            _childNode5.active = 0;
        }
    },
    //兴化使用，多花
    Show24HuaList: function Show24HuaList(cardIDList) {
        var imageString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'EatCard_Self_';

        var ChildCount = 24;
        var count = 0;
        if (typeof cardIDList != "undefined") {
            count = cardIDList.length;
        }
        cardIDList.sort();
        for (var index = 0; index < count; index++) {
            var cardID = cardIDList[index];
            var childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
            var childNode = this.node.getChildByName(childName);
            if (!childNode) {
                this.SysLog("ShowAllDownCard not find childName:%s", childName);
                continue;
            }
            childNode.active = 1;
            this.ShowImage(childNode, imageString, cardID);
        }
        //设置多余的卡牌位置空
        for (var cardIndex = count + 1; cardIndex <= ChildCount; cardIndex++) {
            var _childName6 = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
            var _childNode6 = this.node.getChildByName(_childName6);
            if (!_childNode6) {
                this.SysLog("ShowAllDownCard not find childName:%s", _childName6);
                continue;
            }
            _childNode6.active = 0;
        }
    },
    //福州使用，多花
    Show36HuaList: function Show36HuaList(cardIDList) {
        var imageString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'EatCard_Self_';

        var ChildCount = 36;
        var count = 0;
        if (typeof cardIDList != "undefined") {
            count = cardIDList.length;
        }
        cardIDList.sort();
        for (var index = 0; index < count; index++) {
            var cardID = cardIDList[index];
            var childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
            var childNode = this.node.getChildByName(childName);
            if (!childNode) {
                this.SysLog("ShowAllDownCard not find childName:%s", childName);
                continue;
            }
            childNode.active = 1;
            this.ShowImage(childNode, imageString, cardID);
        }
        //设置多余的卡牌位置空
        for (var cardIndex = count + 1; cardIndex <= ChildCount; cardIndex++) {
            var _childName7 = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
            var _childNode7 = this.node.getChildByName(_childName7);
            if (!_childNode7) {
                this.SysLog("ShowAllDownCard not find childName:%s", _childName7);
                continue;
            }
            _childNode7.active = 0;
        }
    },
    //台湾麻将使用
    ShowHuaListByQiQiangYi: function ShowHuaListByQiQiangYi(cardIDList, qiQiangYiCard) {
        var imageString = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'EatCard_Self_';

        var count = 0;
        if (typeof cardIDList != "undefined") {
            count = cardIDList.length;
        }
        cardIDList.sort();
        for (var index = 0; index < count; index++) {
            var cardID = cardIDList[index];
            var childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
            var childNode = this.node.getChildByName(childName);
            if (!childNode) {
                this.SysLog("ShowAllDownCard not find childName:%s", childName);
                continue;
            }
            childNode.active = 1;
            this.ShowImage(childNode, imageString, cardID);
            this.ShowQiang(childNode, cardID, qiQiangYiCard);
        }
        //设置多余的卡牌位置空
        for (var cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
            var _childName8 = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
            var _childNode8 = this.node.getChildByName(_childName8);
            if (!_childNode8) {
                this.SysLog("ShowAllDownCard not find childName:%s", _childName8);
                continue;
            }
            _childNode8.active = 0;
        }
    },
    //太仓麻将使用
    ShowBanGangMap: function ShowBanGangMap(banGangList, jin1, jin2) {
        var imageString = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'EatCard_Self_';

        var count = 0;
        if (typeof banGangList != "undefined") {
            count = banGangList.length;
        }
        // banGangList.sort();
        for (var index = 0; index < count; index++) {
            var cardID = banGangList[index]["cardID"];
            var childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
            var childNode = this.node.getChildByName(childName);
            if (!childNode) {
                //this.ErrLog("ShowAllDownCard not find childName:%s", childName);
                continue;
            }
            childNode.active = 1;
            this.ShowImage(childNode, imageString, cardID);
            this.ShowBanGangJinImage(childNode, cardID, jin1, jin2);
        }
        //设置多余的卡牌位置空
        for (var cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
            var _childName9 = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
            var _childNode9 = this.node.getChildByName(_childName9);
            if (!_childNode9) {
                //this.ErrLog("ShowAllDownCard not find childName:%s", childName);
                continue;
            }
            _childNode9.active = 0;
        }
    },
    ShowBanGangJinImage: function ShowBanGangJinImage(childNode, cardID, jin1, jin2) {
        if (Math.floor(cardID / 100) == Math.floor(jin1 / 100) || Math.floor(cardID / 100) == Math.floor(jin2 / 100)) {
            if (cardID != 0) {
                childNode.color = cc.color(255, 255, 0);
                childNode.children[0].active = true;
            } else {
                childNode.color = cc.color(255, 255, 255);
                childNode.children[0].active = false;
            }
        } else {
            childNode.color = cc.color(255, 255, 255);
            childNode.children[0].active = false;
        }
    },
    ShowQiang: function ShowQiang(childNode, cardID, qiQiangYiCard) {
        if (cardID == qiQiangYiCard) {
            if (cardID != 0) {
                // childNode.color = cc.color(255, 255, 0);
                childNode.children[0].active = true;
            } else {
                // childNode.color = cc.color(255, 255, 255);
                childNode.children[0].active = false;
            }
        } else {
            // childNode.color = cc.color(255, 255, 255);
            childNode.children[0].active = false;
        }
    },
    ShowImage: function ShowImage(childNode, imageString, cardID) {
        var childSprite = childNode.getComponent(cc.Sprite);
        if (!childSprite) {
            this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
            return;
        }
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
            }).catch(function (error) {
                that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
            });
        }
    }
});

cc._RF.pop();