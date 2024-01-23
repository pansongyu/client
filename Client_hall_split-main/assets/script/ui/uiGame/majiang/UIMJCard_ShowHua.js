/*
 UICard01-04 set结束摊牌
 */

let app = require("app");

cc.Class({
    extends: require("BaseComponent"),

    properties: {},

    // use this for initialization
    OnLoad: function () {
        this.JS_Name = this.node.name + "_UIMJCard_ShowHua";
        this.ComTool = app.ComTool();
        this.SysDataManager = app.SysDataManager();
        this.IntegrateImage = this.SysDataManager.GetTableDict("IntegrateImage");
        this.ChildCount = 8;
    },
    //多花用参数传花数，默认8花
    ShowHuaList: function (cardIDList, imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (cardIDList) != "undefined") {
            count = cardIDList.length;
        }
        cardIDList.sort();
        for (let i = 0; i < this.node.children.length; i++) {
            this.node.children[i].active = false;
        }
        for (let index = 0; index < count; index++) {
            let cardID = cardIDList[index];
            let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
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
        for (let cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
            let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                this.SysLog("ShowAllDownCard not find childName:%s", childName);
                continue
            }
            childNode.active = 0;
        }
    },

    //多花用参数传花数，默认8花
    ShowHuaListByKSMJ: function (cardIDList, imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (cardIDList) != "undefined") {
            count = cardIDList.length;
        }
        cardIDList.sort();
        for (let i = 0; i < this.node.children.length; i++) {
            this.node.children[i].active = false;
        }
        for (let index = 0; index < count; index++) {
            let cardID = cardIDList[index];
            let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
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
        for (let cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
            let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                this.SysLog("ShowAllDownCard not find childName:%s", childName);
                continue
            }
            childNode.active = 0;
        }
    },

    ShowImageByKSMJ: function (childNode, imageString, cardID) {
        let childSprite = childNode.getComponent(cc.Sprite);
        if (!childSprite) {
            this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
            return
        }
        //取卡牌ID的前2位
        let imageName = [imageString, Math.floor(cardID / 100)].join("");
        let cardType = Math.floor(cardID / 100);
		let cards = [48, 59, 60, 61, 62];
		if (cards.indexOf(cardType) > -1) {
            imageName = [imageString, Math.floor(cardID / 10)].join("");
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
                })
                .catch(function (error) {
                    that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
                });
        }
    },

    // 中码牌
    ShowZhongMaList: function (cardIDList, imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (cardIDList) != "undefined") {
            count = cardIDList.length;
        }
        cardIDList.sort();
        for (let index = 0; index < count; index++) {
            let cardID = cardIDList[index];
            let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                this.SysLog("ShowAllDownCard not find childName:%s", childName);
                continue
            }
            childNode.active = 1;
            //显示扎码贴图
            let tmpCardID = Math.floor(cardID / 100);
            if (tmpCardID == 11 || tmpCardID == 15 || tmpCardID == 19 ||
                tmpCardID == 21 || tmpCardID == 25 || tmpCardID == 29 ||
                tmpCardID == 31 || tmpCardID == 35 || tmpCardID == 39 ||
                tmpCardID == 41 || tmpCardID == 45) {

                childNode.color = cc.color(255, 255, 0);
            }
            this.ShowImage(childNode, imageString, cardID);
        }
        //设置多余的卡牌位置空
        for (let cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
            let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                this.SysLog("ShowAllDownCard not find childName:%s", childName);
                continue
            }
            childNode.active = 0;
        }
    },
    //苏州麻将专用
    ShowSZMJFanCardList: function (cardIDList, zhongMaList, imageString = 'EatCard_Self_') {
        let ChildCount = 6;
        let count = 0;
        if (typeof (cardIDList) != "undefined") {
            count = cardIDList.length;
        }
        cardIDList.sort();
        for (let index = 0; index < count; index++) {
            let cardID = cardIDList[index];
            let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                this.SysLog("ShowAllDownCard not find childName:%s", childName);
                continue
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
        for (let cardIndex = count + 1; cardIndex <= ChildCount; cardIndex++) {
            let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                this.SysLog("ShowAllDownCard not find childName:%s", childName);
                continue;
            }
            childNode.active = 0;
        }
    },
    //高邮麻将使用，多花
    Show20HuaList: function (cardIDList, imageString = 'EatCard_Self_') {
        let ChildCount = 20;
        let count = 0;
        if (typeof (cardIDList) != "undefined") {
            count = cardIDList.length;
        }
        cardIDList.sort();
        for (let index = 0; index < count; index++) {
            let cardID = cardIDList[index];
            let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                this.SysLog("ShowAllDownCard not find childName:%s", childName);
                continue
            }
            childNode.active = 1;
            this.ShowImage(childNode, imageString, cardID);
        }

        //设置多余的卡牌位置空
        for (let cardIndex = count + 1; cardIndex <= ChildCount; cardIndex++) {
            let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                this.SysLog("ShowAllDownCard not find childName:%s", childName);
                continue;
            }
            childNode.active = 0;
        }
    },
    //兴化使用，多花
    Show24HuaList: function (cardIDList, imageString = 'EatCard_Self_') {
        let ChildCount = 24;
        let count = 0;
        if (typeof (cardIDList) != "undefined") {
            count = cardIDList.length;
        }
        cardIDList.sort();
        for (let index = 0; index < count; index++) {
            let cardID = cardIDList[index];
            let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                this.SysLog("ShowAllDownCard not find childName:%s", childName);
                continue
            }
            childNode.active = 1;
            this.ShowImage(childNode, imageString, cardID);
        }
        //设置多余的卡牌位置空
        for (let cardIndex = count + 1; cardIndex <= ChildCount; cardIndex++) {
            let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                this.SysLog("ShowAllDownCard not find childName:%s", childName);
                continue
            }
            childNode.active = 0;
        }
    },
    //福州使用，多花
    Show36HuaList: function (cardIDList, imageString = 'EatCard_Self_') {
        let ChildCount = 36;
        let count = 0;
        if (typeof (cardIDList) != "undefined") {
            count = cardIDList.length;
        }
        cardIDList.sort();
        for (let index = 0; index < count; index++) {
            let cardID = cardIDList[index];
            let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                this.SysLog("ShowAllDownCard not find childName:%s", childName);
                continue
            }
            childNode.active = 1;
            this.ShowImage(childNode, imageString, cardID);
        }
        //设置多余的卡牌位置空
        for (let cardIndex = count + 1; cardIndex <= ChildCount; cardIndex++) {
            let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                this.SysLog("ShowAllDownCard not find childName:%s", childName);
                continue
            }
            childNode.active = 0;
        }
    },
    //台湾麻将使用
    ShowHuaListByQiQiangYi: function (cardIDList, qiQiangYiCard, imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (cardIDList) != "undefined") {
            count = cardIDList.length;
        }
        cardIDList.sort();
        for (let index = 0; index < count; index++) {
            let cardID = cardIDList[index];
            let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                this.SysLog("ShowAllDownCard not find childName:%s", childName);
                continue
            }
            childNode.active = 1;
            this.ShowImage(childNode, imageString, cardID);
            this.ShowQiang(childNode, cardID, qiQiangYiCard);
        }
        //设置多余的卡牌位置空
        for (let cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
            let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                this.SysLog("ShowAllDownCard not find childName:%s", childName);
                continue
            }
            childNode.active = 0;
        }
    },
    //太仓麻将使用
    ShowBanGangMap: function (banGangList, jin1, jin2, imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (banGangList) != "undefined") {
            count = banGangList.length;
        }
        // banGangList.sort();
        for (let index = 0; index < count; index++) {
            let cardID = banGangList[index]["cardID"];
            let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                //this.ErrLog("ShowAllDownCard not find childName:%s", childName);
                continue;
            }
            childNode.active = 1;
            this.ShowImage(childNode, imageString, cardID);
            this.ShowBanGangJinImage(childNode, cardID, jin1, jin2);

        }
        //设置多余的卡牌位置空
        for (let cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
            let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                //this.ErrLog("ShowAllDownCard not find childName:%s", childName);
                continue
            }
            childNode.active = 0;
        }
    },
    ShowBanGangJinImage: function (childNode, cardID, jin1, jin2) {
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
    ShowQiang: function (childNode, cardID, qiQiangYiCard) {
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
    ShowImage: function (childNode, imageString, cardID) {
        let childSprite = childNode.getComponent(cc.Sprite);
        if (!childSprite) {
            this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
            return
        }
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
                })
                .catch(function (error) {
                    that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
                });
        }
    },
});
