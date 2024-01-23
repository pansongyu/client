(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/glzp/glzp_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8da29IplaNEobnoQVterhRP', 'glzp_winlost_child', __filename);
// script/ui/uiGame/glzp/glzp_winlost_child.js

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
            "zi_fangda_19": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/red_10"
            },
            "zi_fangda_10": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_1"
            },
            "zi_fangda_11": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/red_2"
            },
            "zi_fangda_12": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_3"
            },
            "zi_fangda_13": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_4"
            },
            "zi_fangda_14": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_5"
            },
            "zi_fangda_15": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_6"
            },
            "zi_fangda_16": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/red_7"
            },
            "zi_fangda_17": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_8"
            },
            "zi_fangda_18": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_9"
            },

            "zi_fangda_29": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/red_10"
            },

            "zi_fangda_20": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_1"
            },
            "zi_fangda_21": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/red_2"
            },
            "zi_fangda_22": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_3"
            },
            "zi_fangda_23": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_4"
            },
            "zi_fangda_24": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_5"
            },
            "zi_fangda_25": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_6"
            },
            "zi_fangda_26": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/red_7"
            },
            "zi_fangda_27": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_8"
            },
            "zi_fangda_28": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_9"
            },

            "zi_fangda_51": {
                "FilePath": "ui/uiGame/hhhgw/zi/bg_gui"
            },
            "zi_fangda_bg": {
                "FilePath": "ui/uiGame/hhhgw/zi/img_pb"
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
    GetHuTypeDict: function GetHuTypeDict() {
        var huTypeDict = {};
        huTypeDict["huDuo"] = "胡舵";
        huTypeDict["fanXingType"] = "翻醒,0上下醒，1跟醒";
        huTypeDict["shangXingNum"] = "上";
        huTypeDict["zhongXingNum"] = "中";
        huTypeDict["xiaXingNum"] = "下";
        huTypeDict["DianPiao"] = "点炮";
        huTypeDict["ZiMo"] = "自摸";

        return huTypeDict;
    },

    PlayerData: function PlayerData(PlayerNode, result, pos) {
        PlayerNode.active = true;
        var huType = result.huType;
        if (huType != 0) {
            //显示胡牌分数
            var layout_huinfo = PlayerNode.getChildByName("layout_huinfo");
            var demo_huinfo = this.node.getChildByName("demo_huinfo");
            var huTypeMap = result.endPoint.huTypeMap;
            var huTypeDict = this.GetHuTypeDict();
            layout_huinfo.removeAllChildren();
            for (var _huType in huTypeMap) {
                var huPoint = huTypeMap[_huType];
                var lb_huInfo = cc.instantiate(demo_huinfo);
                var str = huTypeDict[_huType];
                if (_huType == "fanXingType") {
                    if (huPoint == 0) str = "上下醒";
                    if (huPoint == 1) str = "跟醒";
                }
                lb_huInfo.getComponent(cc.Label).string = str + "：" + huPoint;
                lb_huInfo.active = true;
                layout_huinfo.addChild(lb_huInfo);
            }
        } else {
            PlayerNode.getChildByName("layout_huinfo").removeAllChildren();
        }
        var point = result.point;
        var sportsPoint = result["sportsPoint"];
        var cardPublicMap = result.endPoint.publicCardList;
        var cardMap = result.endPoint.shouCardList;
        var huCard = result.handCard;
        var layoutyou = PlayerNode.getChildByName("layoutyou");
        layoutyou.removeAllChildren();
        var demo_you = this.node.getChildByName("demo_you");
        // demo_you.x = 0; demo_you.y = 0;
        //碰吃的牌
        for (var i = 0; i < cardPublicMap.length; i++) {
            var addYou = cc.instantiate(demo_you);
            layoutyou.addChild(addYou);
            var publicInfo = cardPublicMap[i];
            var publicInfoList = publicInfo["cardList"];
            var publicInfoValue = publicInfo["youNum"];

            var getCardID = publicInfoList[2];
            var cardIDList = publicInfoList.slice(1, publicInfoList.length);

            var opType = publicInfoList[0];
            if (opType == 0) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "提";
            } else if (opType == 1) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "跑";
            } else if (opType == 2) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "偎";
            } else if (opType == 3) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "连";
            } else if (opType == 4) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "坎";
            } else if (opType == 5) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "碰";
            } else if (opType == 6) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "对";
            } else if (opType == 7) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "绞";
            } else if (opType == 8) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "手";
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
                /*if(opType==this.ShareDefine.OpType_Chi && cardChild.cardID==getCardID){
                    cardChild.color=cc.color(180,180,180);
                }else{
                    cardChild.color=cc.color(255,255,255);
                }*/
                this.ShowOutCardImage(cardChild);
            }

            addYou.active = true;
        }
        //余下的牌
        for (var _i = 0; _i < cardMap.length; _i++) {
            var _addYou = cc.instantiate(demo_you);
            var _publicInfo = cardMap[_i];
            var _opType = _publicInfo["cardList"][0];
            var _publicInfoList = _publicInfo["cardList"].slice(1, _publicInfo["cardList"].length);
            var _publicInfoValue = _publicInfo["youNum"];
            var _cardIDList = _publicInfoList;
            if (_opType == 0) {
                _addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "提";
            } else if (_opType == 1) {
                _addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "跑";
            } else if (_opType == 2) {
                _addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "偎";
            } else if (_opType == 3) {
                _addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "连";
            } else if (_opType == 4) {
                _addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "坎";
            } else if (_opType == 5) {
                _addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "碰";
            } else if (_opType == 6) {
                _addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "对";
            } else if (_opType == 7) {
                _addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "绞";
            } else if (_opType == 8) {
                _addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "手";
            } else {
                _addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "";
            }
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
        //# sourceMappingURL=glzp_winlost_child.js.map
        