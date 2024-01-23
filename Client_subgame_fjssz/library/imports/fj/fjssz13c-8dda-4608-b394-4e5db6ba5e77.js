"use strict";
cc._RF.push(module, 'fjssz13c-8dda-4608-b394-4e5db6ba5e77', 'UIFJSSZ_Record_Child');
// script/game/FJSSZ/ui/UIFJSSZ_Record_Child.js

"use strict";

var app = require("fjssz_app");
cc.Class({
    extends: require(app.subGameName + "_BaseComponent"),

    properties: {
        jushu: cc.Label,
        btn_down: cc.Node,
        cardPrefab: cc.Prefab,
        cardNode: cc.Node,
        icon_mapai: cc.SpriteFrame
    },

    OnLoad: function OnLoad() {
        this.PokerCard = app[app.subGameName + "_PokerCard"]();
        this.SSSRoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
        this.LogicGame = app[app.subGameName.toUpperCase() + "LogicGame"]();

        this.redColor = new cc.Color(181, 104, 48);
        this.greenColor = new cc.Color(59, 138, 133);
    },

    //显示
    showInfo: function showInfo() {
        this.jushu.string = (this.itmeId + 1).toString();

        var playerResults = this.data.posResultList;

        for (var idx = 0; idx < playerResults.length; idx++) {
            var child = this.node.getChildByName("lb_chengji0" + (idx + 1).toString());
            child.getComponent(cc.Label).string = playerResults[idx].shui;
            if (playerResults[idx].shui < 0 && child) {
                child.color = this.greenColor;
            } else if (playerResults[idx].shui >= 0 && child) {
                child.color = this.redColor;
            }
        }
    },

    setItemData: function setItemData(idx, data) {
        this.itmeId = idx;
        this.data = eval('(' + data.dataJsonRes + ')');
        this.data.posResultList.sort(this.sortFunByPos);
        this.data.rankeds.sort(this.sortFunByPos);
        this.showInfo();
    },

    sortFunByPos: function sortFunByPos(a, b) {
        return a.posIdx - b.posIdx;
    },

    hiedeAllPlayer: function hiedeAllPlayer() {
        for (var i = 0; i < 8; i++) {
            var node = cc.find("cardNode/" + "player" + (i + 1).toString(), this.node);
            node.active = false;
        }
    },

    callBackDown: function callBackDown(event) {
        var _this = this;

        if (this.btn_down.scaleY == -1) {
            this.btn_down.scaleY = 1;
            this.node.height -= this.cardNode.height;
            this.cardNode.active = false;
        } else {
            this.btn_down.scaleY = -1;
            this.node.height += this.cardNode.height;
            this.cardNode.active = true;
            var rankeds = this.data.rankeds;
            //如果玩家查看牌型 显示牌型 否则不显示
            this.hiedeAllPlayer();
            for (var i = 0; i < rankeds.length; i++) {
                var node = cc.find("cardNode/" + "player" + (i + 1).toString(), this.node);
                node.active = true;
                var dunPos = rankeds[i].dunPos;
                var special = rankeds[i].special;
                if (special != -1) {
                    (function () {
                        //显示特殊牌型
                        var specialNode = node.getChildByName('special_card');
                        specialNode.active = true;
                        var imagePath = "texture/game/sss/special/special_" + special;
                        //加载图片精灵
                        var that = _this;
                        cc.loader.loadRes(imagePath, cc.SpriteFrame, function (error, spriteFrame) {
                            if (error) {
                                that.ErrLog("ShowMap imagePath(%s) loader error:%s", imagePath, error);
                                return;
                            }
                            specialNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        });
                    })();
                }
                if (this.data.zjid == rankeds[i].pid) {
                    node.getChildByName('zhuangjia').active = true;
                    if (this.data.beishu != 0) {
                        node.getChildByName('beishu').active = true;
                        node.getChildByName('beishu').getComponent(cc.Label).string = 'x' + this.data.beishu;
                    }
                }

                var allCards = [];
                if (special == 85 || special == 95) {
                    var pokers = dunPos.first.concat(dunPos.second, dunPos.third);
                    var tonghuas = this.LogicGame.SanTongHua(pokers);
                    for (var _i = 0; _i < tonghuas.length; _i++) {
                        for (var j = 0; j < tonghuas[_i].length; j++) {
                            allCards.push(tonghuas[_i][j]);
                        }
                    }
                } else {
                    allCards = dunPos.first.concat(dunPos.second, dunPos.third);
                }
                for (var _j = 0; _j < node.children.length; _j++) {
                    var child = node.children[_j];
                    if (child.name == 'zhuangjia' || child.name == 'beishu' || child.name == 'special_card') {
                        continue;
                    }
                    if (!child.getChildByName("cardPrefab")) {
                        var card = cc.instantiate(this.cardPrefab);
                        child.addChild(card);
                        this.ShowCard(allCards[_j], card);
                    } else {
                        var _card = child.getChildByName("cardPrefab");
                        this.ShowCard(allCards[_j], _card);
                    }
                }
            }
        }
    },
    ShowCard: function ShowCard(cardType, node) {
        var newPoker = this.PokerCard.SubCardValue(cardType);
        this.PokerCard.GetPokeCard(newPoker, node);

        node.getChildByName("poker_back").active = false;

        var room = this.SSSRoomMgr.GetEnterRoom();
        if (!room) return;

        var child = node.getChildByName("icon_mapai");
        if (child) {
            child.removeFromParent();
        }
        var maPaiValue = room.GetRoomSet().GetRoomSetProperty("mapai");
        if (newPoker == maPaiValue) {
            var icon = new cc.Node();
            icon.name = "icon_mapai";
            var sp = icon.addComponent(cc.Sprite);
            sp.spriteFrame = this.icon_mapai;
            node.addChild(icon);
        }
    }

});

cc._RF.pop();