"use strict";
cc._RF.push(module, '6007fjSaKdCKIFT3y4s1CaY', 'xplp_winlost_child');
// script/ui/uiGame/xplp/xplp_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
    extends: require("BaseMJ_winlost_child"),

    properties: {
        img_kuang: [cc.SpriteFrame]
    },

    // use this for initialization
    OnLoad: function OnLoad() {
        this.ComTool = app.ComTool();
        this.ShareDefine = app.ShareDefine();
        this.sp_in = this.node.getChildByName("showcard").getChildByName("sp_in");
        this.filePath = "texture/xplp/card";
        //添加吃牌 四色牌吃牌比较多
        var downcard = this.node.getChildByName("downcard");
        var downNode01 = downcard.getChildByName('down01');
        this.ChildCount = 20;
        this.PaiChildCount = 21;
        for (var _i = 6; _i <= this.ChildCount; _i++) {
            var downNode = cc.instantiate(downNode01);
            downNode.name = this.ComTool.StringAddNumSuffix("down", _i, 2);
            downcard.addChild(downNode);
        }
    },
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
    ShowPlayerShowCard: function ShowPlayerShowCard(showNode, cardIDList, handCard, jin1, jin2) {
        showNode.active = 1;
        var count = 0;
        if (typeof cardIDList != "undefined") {
            count = cardIDList.length;
        }
        if (count > 16) {
            showNode.getComponent(cc.Layout).spacingX = 10 - showNode.children.length;
        } else {
            showNode.getComponent(cc.Layout).spacingX = 0;
        }
        for (var index = 0; index < count; index++) {
            var cardID = cardIDList[index];
            var childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
            var childNode = showNode.getChildByName(childName);
            if (!childNode) {
                // this.ErrLog("ShowAllDownCard not find childName:%s", childName);
                // continue
                //牌不够，继续渲染
                childNode = cc.instantiate(this.sp_in);
                childNode.name = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
                showNode.addChild(childNode);
                showNode.getComponent(cc.Layout).spacingX = 10 - showNode.children.length;
            }
            childNode.active = 1;
            this.ShowImage(childNode, cardID);
        }
        //设置多余的卡牌位置空
        for (var cardIndex = count + 1; cardIndex <= showNode.children.length - 2; cardIndex++) {
            var _childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
            var _childNode = showNode.getChildByName(_childName);
            if (!_childNode) {
                continue;
            }
            _childNode.active = 0;
        }
        //进卡不能控制显影只能设置空图片
        if (handCard > 0 && handCard != 5000) {
            this.sp_in.active = 1;
            this.ShowImage(this.sp_in, handCard);
        } else {
            this.sp_in.getComponent(cc.Sprite).spriteFrame = "";
            this.sp_in.UserData = null;
        }
    },
    ShowPlayerDownCard: function ShowPlayerDownCard(showNode, publishcard) {
        var jin1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var jin2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        showNode.active = 1;
        var count = 0;
        if (typeof publishcard != "undefined") {
            count = publishcard.length;
        }
        for (var index = 0; index < count; index++) {
            var publicInfoList = publishcard[index];
            var cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            var opType = publicInfoList[0];
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[0]];
            }
            var childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            var childNode = showNode.getChildByName(childName);
            if (!childNode) {
                continue;
            }
            childNode.active = true;
            var cardCount = cardIDList.length;
            for (var cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                var cardID = cardIDList[cardIndex];
                var paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                var childPath = [childName, paiChildName].join("/");
                var _childNode2 = cc.find(childPath, showNode);
                if (!_childNode2) {
                    continue;
                }
                _childNode2.active = true;
                this.ShowImage(_childNode2, cardID);
            }
            //设置多余的卡牌位置空
            for (var _cardIndex = cardCount + 1; _cardIndex <= this.PaiChildCount; _cardIndex++) {
                var _paiChildName = this.ComTool.StringAddNumSuffix("card", _cardIndex, 2);
                var _childPath = [childName, _paiChildName].join("/");
                var _childNode3 = cc.find(_childPath, showNode);
                if (!_childNode3) {
                    continue;
                }
                _childNode3.active = false;
                var cardSprite = _childNode3.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;
            }
        }

        //隐藏掉剩余的卡牌
        for (var _index = count + 1; _index <= this.ChildCount; _index++) {
            var _childName2 = this.ComTool.StringAddNumSuffix("down", _index, 2);
            var _childNode4 = showNode.getChildByName(_childName2);
            if (!_childNode4) {
                continue;
            }
            _childNode4.active = false;
        }
    },
    ShowPlayerRecord: function ShowPlayerRecord(ShowNode, huInfo) {
        var absNum = Math.abs(huInfo["point"]);
        if (absNum > 10000) {
            var shortNum = (absNum / 10000).toFixed(2);
            if (huInfo["point"] > 0) {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '+' + shortNum + "万";
            } else {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '-' + shortNum + "万";
            }
        } else {
            if (huInfo["point"] > 0) {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '+' + huInfo["point"];
            } else {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = huInfo["point"];
            }
        }
        //显示比赛分
        if (typeof huInfo.sportsPointTemp != "undefined") {
            ShowNode.getChildByName('tip_sportspoint').active = true;
            if (huInfo.sportsPointTemp > 0) {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = "+" + huInfo.sportsPointTemp;
            } else {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = huInfo.sportsPointTemp;
            }
        } else if (typeof huInfo.sportsPoint != "undefined") {
            ShowNode.getChildByName('tip_sportspoint').active = true;
            if (huInfo.sportsPoint > 0) {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = "+" + huInfo.sportsPoint;
            } else {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = huInfo.sportsPoint;
            }
        } else {
            ShowNode.getChildByName('tip_sportspoint').active = false;
        }
    },
    ShowPlayerHuaCard: function ShowPlayerHuaCard(ShowNode, hualist) {},
    ShowImage: function ShowImage(childNode, cardID) {
        //显示贴图
        var childSprite = childNode.getComponent(cc.Sprite);
        if (!childSprite) {
            this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
            return;
        }
        app.ResManager().SetMJSpriteFrameToNode(this.filePath, Math.floor(cardID / 100), childNode, function () {});
    },
    LabelName: function LabelName(huType) {
        var LabelArray = [];
        return LabelArray[huType];
    }
});

cc._RF.pop();