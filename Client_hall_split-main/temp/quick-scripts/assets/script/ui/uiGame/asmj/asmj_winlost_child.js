(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/asmj/asmj_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd7fedwiJXFHf5wPZSK5nUJo', 'asmj_winlost_child', __filename);
// script/ui/uiGame/asmj/asmj_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
    extends: require("BaseMJ_winlost_child"),

    properties: {
        icon: [cc.SpriteFrame]
    },

    // use this for initialization
    OnLoad: function OnLoad() {
        this.ComTool = app.ComTool();
        this.ShareDefine = app.ShareDefine();
        this.SysDataManager = app.SysDataManager();
        this.IntegrateImage = this.SysDataManager.GetTableDict("IntegrateImage");
    },
    ShowPlayerHuImg: function ShowPlayerHuImg(huNode, huTypeName) {
        huNode.getComponent(cc.Label).string = this.HuName(huTypeName);
    },
    HuName: function HuName(huTypeName) {
        var huType = this.ShareDefine.HuTypeStringDict[huTypeName];
        if (typeof huType == "undefined") {
            return "";
        } else if (huType == this.ShareDefine.HuType_DianPao) {
            return "点炮";
        } else if (huType == this.ShareDefine.HuType_JiePao) {
            return "接炮";
        } else if (huType == this.ShareDefine.HuType_ZiMo) {
            return "自摸";
        } else if (huType == this.ShareDefine.HuType_QGH) {
            return "抢杠胡";
        } else if (huType == 173) {
            return "杠上炮";
        } else if (huType == 61) {
            return "杠上花";
        }
        return "";
    },
    ShowPlayerData: function ShowPlayerData(setEnd, playerAll, index) {
        var jin1 = setEnd.jin1;
        var jin2 = setEnd.jin2;
        var dPos = setEnd.dPos;
        var posResultList = setEnd["posResultList"];
        var posHuArray = new Array();
        var posCount = posResultList.length;
        for (var i = 0; i < posCount; i++) {
            var posInfo = posResultList[i];
            var pos = posInfo["pos"];
            var posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
            posHuArray[pos] = posHuType;
        }
        var PlayerInfo = playerAll[index];
        this.node.active = true;
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2);
        var huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
        this.ShowPlayerHuImg(huNode, posResultList[index]['huType']);
        var HuName = this.HuName(posResultList[index]['huType']);

        if (HuName != "" && HuName != "点炮") {
            this.node.getChildByName("user_info").getChildByName("jiaozui").active = false;
            this.node.getChildByName("user_info").getChildByName("weijiaozui").active = false;
        } else {
            if (posResultList[index].isJiaoZui) {
                this.node.getChildByName("user_info").getChildByName("jiaozui").active = true;
                this.node.getChildByName("user_info").getChildByName("weijiaozui").active = false;
            } else {
                this.node.getChildByName("user_info").getChildByName("jiaozui").active = false;
                this.node.getChildByName("user_info").getChildByName("weijiaozui").active = true;
            }
        }

        if (dPos === index) {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
        } else {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
        }

        this.node.getChildByName("user_info").getChildByName("baoting").active = posResultList[index].isBaoTing;

        //显示头像，如果头像UI
        if (PlayerInfo["pid"] && PlayerInfo["iconUrl"]) {
            app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"], PlayerInfo["iconUrl"]);
        }
        var weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
    },
    ShowPlayerJieSuan: function ShowPlayerJieSuan(ShowNode, huInfoAll) {
        var huInfo = false;
        if (huInfoAll["endPoint"]) {
            huInfo = huInfoAll["endPoint"];
        } else {
            huInfo = huInfoAll;
        }

        ShowNode.getChildByName("label_lists").removeAllChildren();
        var huTypeMap = huInfo.huTypeMap;
        var huTypeDict = {
            // PingHu: "平胡",
            // PPHu: "大对子",
            // DD: "单吊",
            // QYSDD: "清单吊",
            // QYSPPH: "清大对",
            // QYSHDDHu: "清龙背",
            // HDDHu: "龙七对",
            // QYSQD: "清七对",
            // QDHu: "七对",
            // TianTing: "天听",
            // DiHu: "地胡",
            // TianHu: "天胡",
            // YingHua:"硬胡",
            // AnGang:"闷豆",
            // Gang:"爬坡豆",
            // JieGang:"点豆",
            // BaoHu:"包牌",
            // ShaBao:"杀报",
            // Jin:"癞子鸡",
            // Zhuang:"庄",
            // ZiMo:"自摸",
            // QYS:"清一色",
            // JiePao:"接炮",
            // GSP:"杠上炮",
            // GSKH:"杠上花",
            // QGH:"抢杠胡",

            isJiaoZui: 0,
            ChongFengJi21: 1, //冲图标
            ChongFengJi38: 2, //冲8图标
            Ze21: 3, //责图标
            Ze38: 4, //责8图标

            JinJi21: 2101, //显示金色一条
            JinJi38: 3801, //显示金色八筒
            YinJi31: 3102, //显示银色一筒
            YinJi11: 1102, //显示银色一万
            YaoJi: 2100, //显示一条
            WuGuJi: 3800, //显示八筒

            BenJi: -1, //本鸡 去setPos_End取本鸡的牌值(cardType) benJ
            FanJi: -2, //翻鸡 去setPos_End取翻鸡的牌值(cardType) fanJi
            FanJi1: -3 //翻鸡1 去setPos_End取翻鸡1的牌值(cardType) fanJi1
        };
        huTypeDict["PingHu"] = "平胡";
        huTypeDict["DDZ"] = "大对子";
        huTypeDict["QD"] = "七对";
        huTypeDict["LQD"] = "龙七对";
        huTypeDict["QYS"] = "清一色";
        huTypeDict["QDD"] = "清大对";
        huTypeDict["QQD"] = "清七对";
        huTypeDict["QLD"] = "青龙对";
        huTypeDict["TianTing"] = "天听";
        huTypeDict["ShaBao"] = "杀报";
        huTypeDict["GSKH"] = "杠上开花";
        huTypeDict["QiangGangHu"] = "抢杠胡";
        huTypeDict["DiHu"] = "地胡";
        huTypeDict["TianHu"] = "天胡";
        huTypeDict["RePao"] = "热炮";
        huTypeDict["Zhuang"] = "庄";
        huTypeDict["ZMFB"] = "自摸翻倍";
        huTypeDict["YaoJi"] = "幺鸡";
        huTypeDict["ZhuoJiPai"] = "捉鸡牌";
        huTypeDict["ChongFengJi"] = "冲锋鸡";
        huTypeDict["ZeRenJi"] = "责任鸡";
        huTypeDict["WuGuJi"] = "乌骨鸡";
        huTypeDict["ShangXiaJi"] = "上下鸡";
        huTypeDict["JinJi"] = "金鸡";
        huTypeDict["YinJi"] = "银鸡";
        huTypeDict["ChongFengJinJi"] = "冲锋金鸡";
        huTypeDict["XingQiJi"] = "星期鸡";
        huTypeDict["BaoJi"] = "包鸡";
        huTypeDict["AnGang"] = "闷豆";
        huTypeDict["Gang"] = "爬坡豆";
        huTypeDict["JieGang"] = "点豆";
        huTypeDict["ChaJiao"] = "查叫";
        for (var huType in huTypeMap) {
            var huPoint = huTypeMap[huType];
            if (huPoint > 0) {
                huPoint = "+" + huPoint.toString();
            }
            if (typeof huTypeDict[huType] == "number") {
                if (huTypeDict[huType] < 0) {
                    //本鸡,翻鸡,翻鸡1
                    var dm1 = ShowNode.getChildByName('pai_demo');
                    var addNode1 = cc.instantiate(dm1);
                    var str = "";
                    var cardID = 0;
                    if (huType == "BenJi") {
                        cardID = huInfoAll["benJi"] * 100;
                    } else if (huType == "FanJi") {
                        cardID = huInfoAll["fanJi"] * 100;
                    } else if (huType == "FanJi1") {
                        cardID = huInfoAll["fanJi1"] * 100;
                    }
                    addNode1.active = true;
                    this.ShowImage(addNode1.getChildByName("icon"), cardID);
                    addNode1.getChildByName("lb").getComponent(cc.Label).string = str + ":" + huPoint;
                    addNode1.y = 0;
                    ShowNode.getChildByName("label_lists").addChild(addNode1);
                } else if (huTypeDict[huType] < 5) {
                    //显示图标
                    var dm2 = ShowNode.getChildByName('icon_demo');
                    var addNode2 = cc.instantiate(dm2);
                    addNode2.active = true;
                    addNode2.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.icon[huTypeDict[huType]];
                    addNode2.getChildByName("lb").getComponent(cc.Label).string = huPoint;
                    addNode2.y = 0;
                    ShowNode.getChildByName("label_lists").addChild(addNode2);
                } else if (huTypeDict[huType] > 1000) {
                    //显示麻将图标
                    var dm3 = ShowNode.getChildByName('pai_demo');
                    var addNode3 = cc.instantiate(dm3);
                    addNode3.active = true;
                    this.ShowImage(addNode3.getChildByName("icon"), huTypeDict[huType]);
                    if (huTypeDict[huType] % 1000 > 0) {
                        if (huTypeDict[huType] % 1000 == 1) {
                            //金色
                            addNode3.getChildByName("icon").color = cc.color(255, 255, 125);
                        } else if (huTypeDict[huType] % 1000 == 2) {
                            //银色
                            addNode3.getChildByName("icon").color = cc.color(150, 150, 150);
                        }
                    }
                    addNode3.y = 0;
                    addNode3.getChildByName("lb").getComponent(cc.Label).string = huPoint;
                    ShowNode.getChildByName("label_lists").addChild(addNode3);
                }
            } else {
                //显示普通
                var dm = ShowNode.getChildByName('lb_demo');
                var addNode = cc.instantiate(dm);
                addNode.active = true;
                addNode.getComponent(cc.Label).string = huTypeDict[huType] + ":" + huPoint;
                addNode.y = 0;
                ShowNode.getChildByName("label_lists").addChild(addNode);
            }
        }
    },

    ShowImage: function ShowImage(childNode, cardID) {
        //显示贴图
        var childSprite = childNode.getComponent(cc.Sprite);
        if (!childSprite) {
            console.error("ShowOutCard(%s) not find cc.Sprite", childNode.name);
            return;
        }
        var imageName = "";
        if (cardID) {
            //取卡牌ID的前2位
            imageName = ["EatCard_Self_", Math.floor(cardID / 100)].join("");
        }
        var imageInfo = this.IntegrateImage[imageName];
        if (!imageInfo) {
            console.error("ShowImage IntegrateImage.txt not find:%s", imageName);
            return;
        }
        var imagePath = imageInfo["FilePath"];
        var that = this;
        app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame).then(function (spriteFrame) {
            if (!spriteFrame) {
                console.error("OpenPoker(%s) load spriteFrame fail", imagePath);
                return;
            }
            childSprite.spriteFrame = spriteFrame;
        }).catch(function (error) {
            console.error("OpenPoker(%s) error:%s", imagePath, error.stack);
        });
    },
    ShowPlayerHuaCard: function ShowPlayerHuaCard() {
        return;
    },
    ClearLabelShow: function ClearLabelShow(jiesuan) {
        return;
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
        //# sourceMappingURL=asmj_winlost_child.js.map
        