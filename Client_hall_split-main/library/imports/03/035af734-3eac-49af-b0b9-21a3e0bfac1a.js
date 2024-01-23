"use strict";
cc._RF.push(module, '035afc0PqxJr7C5IaPgv6wa', 'ychp_winlost_child');
// script/ui/uiGame/ychp/ychp_winlost_child.js

"use strict";

var _cc$Class;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class((_cc$Class = {
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
        this.wanfa = setEnd["peiZhi"]["wanfa"];
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
        huTypeDict["Not"] = "ot(0),";
        huTypeDict["PH"] = "屁胡";
        huTypeDict["TH"] = "台胡";
        huTypeDict["THF"] = "台胡翻";
        huTypeDict["QH"] = "清胡";
        huTypeDict["KH"] = "枯胡";
        huTypeDict["HH"] = "黑胡";
        huTypeDict["PPH"] = "碰碰胡";
        huTypeDict["ZM"] = "自摸";
        huTypeDict["MK"] = "毛坎";
        huTypeDict["HS"] = "胡数";

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
                // if (huType == "fanXingType") {
                //     if (huPoint == 0) str = "上下醒";
                //     if (huPoint == 1) str = "跟醒";
                // }
                lb_huInfo.getComponent(cc.Label).string = str + "：" + huPoint;
                lb_huInfo.active = true;
                layout_huinfo.addChild(lb_huInfo);
            }
        } else {
            PlayerNode.getChildByName("layout_huinfo").removeAllChildren();
        }
        var point = result.point;
        var sportsPoint = result["sportsPoint"];
        // let cardPublicMap = result.endPoint.publicCardList;
        var cardPublicMap = result.paiXiList;
        var cardMap = result.endPoint.shouCardList;
        var huCard = result.handCard;
        // let layoutyou = PlayerNode.getChildByName("layoutyou");
        // layoutyou.removeAllChildren();
        // let demo_you = this.node.getChildByName("demo_you");
        this.ShowPengCardList(PlayerNode, result);
        this.ShowHuCard(PlayerNode, result.huCard);
        // this.ShowHuTypeInfo(PlayerNode, result);
        this.ShowJingList(PlayerNode, result["jingList"]);
        // demo_you.x = 0; demo_you.y = 0;
        //碰吃的牌
        // for (let i = 0; i < cardPublicMap.length; i++) {
        //     let addYou = cc.instantiate(demo_you);
        //     layoutyou.addChild(addYou);
        //     let publicInfo = cardPublicMap[i];
        //     let publicInfoList = publicInfo["cardList"];
        //     let publicInfoValue = publicInfo["youNum"];

        //     let getCardID = publicInfoList[2];
        //     let cardIDList = publicInfoList.slice(1, publicInfoList.length);

        //     let opType = publicInfoList[0];
        //     if (opType == 0) {
        //         addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "提";
        //     } else if (opType == 1) {
        //         addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "跑";
        //     } else if (opType == 2) {
        //         addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "偎";
        //     } else if (opType == 3) {
        //         addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "连";
        //     } else if (opType == 4) {
        //         addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "坎";
        //     } else if (opType == 5) {
        //         addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "碰";
        //     } else if (opType == 6) {
        //         addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "对";
        //     } else if (opType == 7) {
        //         addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "绞";
        //     } else if (opType == 8) {
        //         addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "手";
        //     } else {
        //         addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "";
        //     }
        //     addYou.getChildByName("lb_you").getComponent(cc.Label).string = publicInfoValue;

        //     let layoutpai = addYou.getChildByName("layoutpai");

        //     for (let k = 1; k <= 4; k++) {
        //         let cardChild = layoutpai.getChildByName("card" + k);
        //         if (typeof (cardIDList[k - 1]) == "undefined") {
        //             if (cardChild) {
        //                 cardChild.active = false;
        //             }
        //             continue;
        //         }
        //         cardChild.cardID = cardIDList[k - 1];
        //         /*if(opType==this.ShareDefine.OpType_Chi && cardChild.cardID==getCardID){
        //             cardChild.color=cc.color(180,180,180);
        //         }else{
        //             cardChild.color=cc.color(255,255,255);
        //         }*/
        //         this.ShowOutCardImage(cardChild);
        //     }

        //     addYou.active = true;
        // }
        // //余下的牌
        // for (let i = 0; i < cardMap.length; i++) {
        //     let addYou = cc.instantiate(demo_you);
        //     let publicInfo = cardMap[i];
        //     let opType = publicInfo["cardList"][0];
        //     let publicInfoList = publicInfo["cardList"].slice(1, publicInfo["cardList"].length);
        //     let publicInfoValue = publicInfo["youNum"];
        //     let cardIDList = publicInfoList;
        //     if (opType == 0) {
        //         addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "提";
        //     } else if (opType == 1) {
        //         addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "跑";
        //     } else if (opType == 2) {
        //         addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "偎";
        //     } else if (opType == 3) {
        //         addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "连";
        //     } else if (opType == 4) {
        //         addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "坎";
        //     } else if (opType == 5) {
        //         addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "碰";
        //     } else if (opType == 6) {
        //         addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "对";
        //     } else if (opType == 7) {
        //         addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "绞";
        //     } else if (opType == 8) {
        //         addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "手";
        //     } else {
        //         addYou.getChildByName("lb_optype").getComponent(cc.Label).string = "";
        //     }
        //     addYou.getChildByName("lb_you").getComponent(cc.Label).string = publicInfoValue;
        //     let child = addYou.getChildByName("layoutpai");

        //     for (let j = 1; j <= 4; j++) {
        //         let cardChild = child.getChildByName("card" + j);
        //         if (typeof (cardIDList[j - 1]) == "undefined") {
        //             if (cardChild) {
        //                 cardChild.active = false;
        //             }
        //             continue;
        //         }
        //         cardChild.cardID = cardIDList[j - 1];
        //         this.ShowOutCardImage(cardChild);
        //         //如果是胡的牌。显示胡牌
        //         if (huCard > 0 && huCard == cardIDList[j - 1]) {
        //             cardChild.getChildByName("tip_hu").active = true;
        //         } else {
        //             cardChild.getChildByName("tip_hu").active = false;
        //         }
        //     }
        //     addYou.active = true;
        //     layoutyou.addChild(addYou);
        // }
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
    ShowHuCard: function ShowHuCard(playerNode, huCard) {
        var huNode = playerNode.getChildByName("huCardNode").getChildByName("huCard");
        if (!huNode) return;
        if (huCard <= 0) {
            huNode.active = false;
            return;
        }

        huNode.cardID = huCard;
        this.ShowOutCardImage(huNode);
    },
    ShowPengCardList: function ShowPengCardList(playerNode, posResultInfo) {
        var pengItem = playerNode.getChildByName("pengItem");
        var parent = playerNode.getChildByName("pengCardLists");
        parent.removeAllChildren();

        var types = this.GetOpTypeDict();
        var paiXiList = posResultInfo["paiXiList"];
        for (var i = 0; i < paiXiList.length; i++) {
            var paiXiInfo = paiXiList[i];
            var node = cc.instantiate(pengItem);
            node.active = true;
            parent.addChild(node);

            node.getChildByName("lb_cardType").getComponent(cc.Label).string = types[paiXiInfo.paiXing];
            node.getChildByName("lb_huShu").getComponent(cc.Label).string = paiXiInfo.huShu;

            var cardIDList = paiXiInfo.paiList;
            var cardNodes = node.getChildByName("cardList");
            for (var k = 1; k <= 5; k++) {
                var cardChild = cardNodes.getChildByName("card" + k);
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
        }
    }
}, _defineProperty(_cc$Class, "ShowHuCard", function ShowHuCard(playerNode, huCard) {
    var huNode = playerNode.getChildByName("huCardNode").getChildByName("huCard");
    if (!huNode) return;
    if (huCard <= 0) return;

    huNode.cardID = huCard;
    this.ShowOutCardImage(huNode);
}), _defineProperty(_cc$Class, "ShowJingList", function ShowJingList(playerNode, jingList) {
    var jingListParent = playerNode.getChildByName("jinCardNodeList").getChildByName("cardList");
    var cardItem = playerNode.getChildByName("jinCardNodeList").getChildByName("card1");
    jingListParent.removeAllChildren();
    for (var i = 0; i < jingList.length; i++) {
        var cardID = jingList[i];
        var node = cc.instantiate(cardItem);
        jingListParent.addChild(node);
        node.cardID = cardID;
        this.ShowOutCardImage(node);
    }
}), _defineProperty(_cc$Class, "GetOpTypeDict", function GetOpTypeDict() {
    var huTypeDict = {};

    huTypeDict["Not"] = "";
    huTypeDict["juZi"] = "句子";
    huTypeDict["kou"] = "口";
    huTypeDict["peng"] = "碰";
    huTypeDict["kan"] = "坎";
    huTypeDict["tongYiGe"] = "统一个";
    huTypeDict["zhao"] = "招";
    huTypeDict["fan"] = "泛";
    huTypeDict["tongShangDing"] = "统上顶";
    huTypeDict["ganTa"] = "赶踏";
    huTypeDict["duiZi"] = "对子";

    return huTypeDict;
}), _defineProperty(_cc$Class, "IsHuaJing", function IsHuaJing(cardId) {
    var cardIds = this.GetHuaJingCardTypeCfg();
    // let cardType = Math.floor(cardId / 100);
    return cardIds.indexOf(cardId) > -1;
}), _defineProperty(_cc$Class, "GetHuaJingCardTypeCfg", function GetHuaJingCardTypeCfg() {
    if (this.wanfa == 0) {
        // 乙、三、五、七、九
        return [1101, 1102, 1301, 1302, 1501, 1502, 1701, 1702, 1901, 1902];
    } else {
        return [1301, 1302, 1501, 1502, 1701, 1702];
    }
}), _defineProperty(_cc$Class, "ShowOutCardImage", function ShowOutCardImage(childNode) {
    childNode.active = true;
    var imagePath = "ui/uiGame/ychp/cards/out/" + Math.floor(childNode.cardID / 100);
    var that = this;
    var childSprite = childNode.getComponent(cc.Sprite);
    if (this.IsHuaJing(childNode.cardID)) {
        childNode.getChildByName("img_huaJing").active = true;
    } else {
        childNode.getChildByName("img_huaJing").active = false;
    }
    this.SpriteShow(childSprite, imagePath);
}), _defineProperty(_cc$Class, "SpriteShow", function SpriteShow(childSprite, imagePath) {
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
}), _defineProperty(_cc$Class, "GetFanXingCardID", function GetFanXingCardID(map) {
    var xingCardList = [];
    for (var key in map) {
        xingCardList.push(parseInt(key));
    }
    return xingCardList;
}), _cc$Class));

cc._RF.pop();