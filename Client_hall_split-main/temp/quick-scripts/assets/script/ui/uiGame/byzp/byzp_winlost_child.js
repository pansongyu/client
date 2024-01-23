(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/byzp/byzp_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0dd0epeyMFKvLxo7+xZNzRx', 'byzp_winlost_child', __filename);
// script/ui/uiGame/byzp/byzp_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
    extends: require("BaseMJ_winlost_child"),

    properties: {},

    // use this for initialization
    OnLoad: function OnLoad() {
        this.ComTool = app.ComTool();
        this.ShareDefine = app.ShareDefine();

        this.IntegrateImagePath = {
            "zi_fangda_10": {
                "Name": "zi_fangda_10",
                "FilePath": "ui/uiGame/byzp/zi/xiaoxue/red_10"
            },
            "zi_fangda_11": {
                "Name": "zi_fangda_11",
                "FilePath": "ui/uiGame/byzp/zi/xiaoxue/black_1"
            },
            "zi_fangda_12": {
                "Name": "zi_fangda_12",
                "FilePath": "ui/uiGame/byzp/zi/xiaoxue/red_2"
            },
            "zi_fangda_13": {
                "Name": "zi_fangda_13",
                "FilePath": "ui/uiGame/byzp/zi/xiaoxue/black_3"
            },
            "zi_fangda_14": {
                "Name": "zi_fangda_14",
                "FilePath": "ui/uiGame/byzp/zi/xiaoxue/black_4"
            },
            "zi_fangda_15": {
                "Name": "zi_fangda_15",
                "FilePath": "ui/uiGame/byzp/zi/xiaoxue/black_5"
            },
            "zi_fangda_16": {
                "Name": "zi_fangda_16",
                "FilePath": "ui/uiGame/byzp/zi/xiaoxue/black_6"
            },
            "zi_fangda_17": {
                "Name": "zi_fangda_17",
                "FilePath": "ui/uiGame/byzp/zi/xiaoxue/red_7"
            },
            "zi_fangda_18": {
                "Name": "zi_fangda_18",
                "FilePath": "ui/uiGame/byzp/zi/xiaoxue/black_8"
            },
            "zi_fangda_19": {
                "Name": "zi_fangda_19",
                "FilePath": "ui/uiGame/byzp/zi/xiaoxue/black_9"
            },
            "zi_fangda_20": {
                "Name": "zi_fangda_20",
                "FilePath": "ui/uiGame/byzp/zi/daxue/red_10"
            },
            "zi_fangda_21": {
                "Name": "zi_fangda_21",
                "FilePath": "ui/uiGame/byzp/zi/daxue/black_1"
            },
            "zi_fangda_22": {
                "Name": "zi_fangda_22",
                "FilePath": "ui/uiGame/byzp/zi/daxue/red_2"
            },
            "zi_fangda_23": {
                "Name": "zi_fangda_23",
                "FilePath": "ui/uiGame/byzp/zi/daxue/black_3"
            },
            "zi_fangda_24": {
                "Name": "zi_fangda_24",
                "FilePath": "ui/uiGame/byzp/zi/daxue/black_4"
            },
            "zi_fangda_25": {
                "Name": "zi_fangda_25",
                "FilePath": "ui/uiGame/byzp/zi/daxue/black_5"
            },
            "zi_fangda_26": {
                "Name": "zi_fangda_26",
                "FilePath": "ui/uiGame/byzp/zi/daxue/black_6"
            },
            "zi_fangda_27": {
                "Name": "zi_fangda_27",
                "FilePath": "ui/uiGame/byzp/zi/daxue/red_7"
            },
            "zi_fangda_28": {
                "Name": "zi_fangda_28",
                "FilePath": "ui/uiGame/byzp/zi/daxue/black_8"
            },
            "zi_fangda_29": {
                "Name": "zi_fangda_29",
                "FilePath": "ui/uiGame/byzp/zi/daxue/black_9"
            },
            "zi_fangda_51": {
                "Name": "zi_fangda_51",
                "FilePath": "ui/uiGame/byzp/zi/bg_gui"
            },
            "zi_fangda_bg": {
                "Name": "zi_fangda_bg",
                "FilePath": "ui/uiGame/byzp/zi/img_pb"
            }
        };
    },
    ShowPlayerData: function ShowPlayerData(setEnd, playerAll, index) {
        var dPos = setEnd.dPos;
        var posResultList = setEnd["posResultList"];
        this.node.active = true;
        if (dPos === index) {
            this.node.getChildByName("userinfo").getChildByName("tip_zhuang").active = true;
        } else {
            this.node.getChildByName("userinfo").getChildByName("tip_zhuang").active = false;
        }
        var PlayerInfo = playerAll[index];
        //显示头像，如果头像UI
        if (PlayerInfo["pid"] && PlayerInfo["iconUrl"]) {
            app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"], PlayerInfo["iconUrl"]);
        }
        var weChatHeadImage = this.node.getChildByName("userinfo").getChildByName("touxiang").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
        //显示名字跟pid
        this.node.getChildByName("userinfo").getChildByName("lb_name").getComponent(cc.Label).string = PlayerInfo.name;
        this.node.getChildByName("userinfo").getChildByName("lb_id").getComponent(cc.Label).string = PlayerInfo.pid;
        this.PlayerData(this.node, posResultList[index], index);
    },
    PlayerData: function PlayerData(PlayerNode, result, pos) {
        PlayerNode.active = true;
        var huTypeMap = result.endPoint.huTypeMap;
        var totalYouNum = result.endPoint.totalYouNum;
        var isZiMoMulti = result.endPoint.isZiMoMulti;
        var isDianPaoMulti = result.endPoint.isDianPaoMulti;
        var point = result.point;
        var sportsPoint = result["sportsPoint"];
        var cardPublicMap = result.endPoint.publicCardList;
        var cardMap = result.endPoint.shouCardList;
        var fanXingCard = this.GetFanXingCardID(result.endPoint.fanXingCard);
        var huCard = result.handCard;
        var layoutyou = PlayerNode.getChildByName("layoutyou");
        layoutyou.removeAllChildren();
        var demo_you = PlayerNode.getChildByName("demo_you");
        demo_you.x = 0;demo_you.y = 0;
        //显示分数Map
        PlayerNode.getChildByName("lb_hushuipai").getComponent(cc.Label).string = "";
        PlayerNode.getChildByName("lb_fanxing").getComponent(cc.Label).string = "";
        PlayerNode.getChildByName("lb_tun").getComponent(cc.Label).string = "";
        PlayerNode.getChildByName("lb_hu").getComponent(cc.Label).string = "";
        PlayerNode.getChildByName("lp_zongyou").getComponent(cc.Label).string = totalYouNum;
        for (var huType in huTypeMap) {
            if (huType == "FanXing") {
                PlayerNode.getChildByName("lb_fanxing").getComponent(cc.Label).string = "翻醒:" + huTypeMap[huType];
            } else if (huType == "Tun") {
                PlayerNode.getChildByName("lb_tun").getComponent(cc.Label).string = "囤:" + huTypeMap[huType];
            } else if (huType == "HuShuiPai") {
                PlayerNode.getChildByName("lb_hushuipai").getComponent(cc.Label).string = "胡水牌:" + huTypeMap[huType];
            } else if (huType == "ZiMo") {
                if (isZiMoMulti == false) {
                    PlayerNode.getChildByName("lb_hu").getComponent(cc.Label).string = "自摸:+" + huTypeMap[huType];
                } else {
                    PlayerNode.getChildByName("lb_hu").getComponent(cc.Label).string = "自摸:X" + huTypeMap[huType];
                }
            } else if (huType == "DianPao") {
                if (isDianPaoMulti == false) {
                    PlayerNode.getChildByName("lb_hu").getComponent(cc.Label).string = "点炮:+" + huTypeMap[huType];
                } else {
                    PlayerNode.getChildByName("lb_hu").getComponent(cc.Label).string = "点炮:X" + huTypeMap[huType];
                }
            }
        }
        //碰吃的牌
        for (var i = 0; i < cardPublicMap.length; i++) {
            var addYou = cc.instantiate(demo_you);
            layoutyou.addChild(addYou);
            var publicInfo = cardPublicMap[i];
            var publicInfoList = publicInfo["cardList"];
            var publicInfoValue = publicInfo["youNum"];
            var getCardID = publicInfoList[2];
            var cardIDList = publicInfoList.slice(3, publicInfoList.length);
            var opType = publicInfoList[0];
            if (opType == 104) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "喂";
            } else if (opType == 6) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "吃";
            } else if (opType == 2) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "碰";
            } else {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "";
            }
            addYou.getChildByName("lb_you").getComponent(cc.Label).string = publicInfoValue;

            var layoutpai = addYou.getChildByName("layoutpai");

            for (var k = 1; k <= 4; k++) {
                var cardChild = layoutpai.getChildByName("card" + k);
                if (typeof cardIDList[k - 1] == "undefined") {
                    if (cardChild) {
                        cardChild.active = false;
                    }
                    continue;
                }
                cardChild.cardID = cardIDList[k - 1];
                this.ShowOutCardImage(cardChild);
            }

            addYou.active = true;
        }
        //余下的牌
        for (var _i = 0; _i < cardMap.length; _i++) {
            var _addYou = cc.instantiate(demo_you);
            var _publicInfo = cardMap[_i];
            var _publicInfoList = _publicInfo["cardList"].slice(1, _publicInfo["cardList"].length);
            var _publicInfoValue = _publicInfo["youNum"];
            var _cardIDList = _publicInfoList;
            _addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "";
            _addYou.getChildByName("lb_you").getComponent(cc.Label).string = _publicInfoValue;
            var child = _addYou.getChildByName("layoutpai");
            for (var j = 1; j <= 4; j++) {
                var _cardChild = child.getChildByName("card" + j);
                if (typeof _cardIDList[j - 1] == "undefined") {
                    if (_cardChild) {
                        _cardChild.active = false;
                    }
                    continue;
                }
                _cardChild.cardID = _cardIDList[j - 1];
                this.ShowOutCardImage(_cardChild);
                //如果是胡的牌。显示胡牌
                if (huCard > 0 && huCard == _cardIDList[j - 1]) {
                    _cardChild.getChildByName("tip_hu").active = true;
                } else {
                    _cardChild.getChildByName("tip_hu").active = false;
                }
            }
            _addYou.active = true;
            layoutyou.addChild(_addYou);
        }
        //翻醒的牌
        var layout_xingpai = PlayerNode.getChildByName("layout_xingpai");
        layout_xingpai.removeAllChildren();
        if (fanXingCard.length > 0) {
            var demo_pai = PlayerNode.getChildByName("demo_pai");
            demo_pai.x = 0;demo_pai.y = 0;
            PlayerNode.getChildByName("tip_fanxing").active = true;
            for (var _i2 = 0; _i2 < 5; _i2++) {
                var _cardChild2 = layout_xingpai.getChildByName("card" + _i2);
                if (typeof fanXingCard[_i2] == "undefined") {
                    if (_cardChild2) {
                        _cardChild2.active = false;
                    }
                    continue;
                }
                if (_cardChild2) {
                    _cardChild2.active = true;
                    _cardChild2.cardID = fanXingCard[_i2];
                } else {
                    _cardChild2 = cc.instantiate(demo_pai);
                    _cardChild2.active = true;
                    _cardChild2.name = "card" + _i2;
                    _cardChild2.cardID = fanXingCard[_i2];
                    layout_xingpai.addChild(_cardChild2);
                }
                this.ShowOutCardImage(_cardChild2);
            }
        } else {
            PlayerNode.getChildByName("tip_fanxing").active = false;
        }
        //胡牌
        var hu_pai = PlayerNode.getChildByName("hu_pai");
        if (huCard > 0) {
            hu_pai.active = true;
            hu_pai.cardID = huCard;
            this.ShowOutCardImage(hu_pai);
        } else {
            hu_pai.active = false;
        }
        //显示总分
        var lb_winpoint = PlayerNode.getChildByName("lb_winpoint");
        var lb_lostpoint = PlayerNode.getChildByName("lb_lostpoint");
        if (point > 0) {
            lb_winpoint.active = true;
            lb_lostpoint.active = false;
            lb_winpoint.getComponent(cc.Label).string = "+" + point;
        } else {
            lb_winpoint.active = false;
            lb_lostpoint.active = true;
            lb_lostpoint.getComponent(cc.Label).string = point;
        }
        //比赛分
        var lb_sportsPoint = PlayerNode.getChildByName("lb_sportsPoint");
        if (typeof sportsPoint != "undefined") {
            lb_sportsPoint.active = true;
            lb_sportsPoint.getComponent(cc.Label).string = "比赛分:" + sportsPoint;
        } else {
            lb_sportsPoint.active = false;
        }
    },
    ShowOutCardImage: function ShowOutCardImage(childNode) {
        childNode.active = true;
        var imageName = ["zi_fangda_", Math.floor(childNode.cardID / 100)].join("");
        if (childNode.cardID == 0) {
            imageName = ["zi_fangda_bg"].join("");
        }
        var imageInfo = this.IntegrateImagePath[imageName];
        if (!imageInfo) {
            this.ErrLog("ShowOutCardImage IntegrateImage.txt not find:%s", imageName);
            return;
        }
        var imagePath = imageInfo["FilePath"];
        var that = this;
        childNode.getChildByName("hua").getComponent(cc.Sprite).spriteFrame = "";
        var childSprite = childNode.getChildByName("dian").getComponent(cc.Sprite);
        this.SpriteShow(childSprite, imagePath);
    },
    SpriteShow: function SpriteShow(childSprite, imagePath) {
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
    },
    GetFanXingCardID: function GetFanXingCardID(map) {
        var xingCardList = [];
        for (var key in map) {
            xingCardList.push(parseInt(key));
        }
        return xingCardList;
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=byzp_winlost_child.js.map
        