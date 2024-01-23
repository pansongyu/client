(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/xcmj/xcmj_UIDuijuliushui.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2a9ecr1u5tDy58tLUFJReFY', 'xcmj_UIDuijuliushui', __filename);
// script/ui/uiGame/xcmj/xcmj_UIDuijuliushui.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),
    properties: {
        bg_num: [cc.SpriteFrame]
    },
    //初始化
    OnCreateInit: function OnCreateInit() {
        this.liushuiLayout = this.GetWndNode("img_dk/liushuiScrollView/view/content");
        this.demo = this.liushuiLayout.children[0];
    },
    OnShow: function OnShow(liuShuiList, huLuoBoMap) {
        console.log("liushuiScrollView", liuShuiList, huLuoBoMap);
        this.ShowItemDetail(liuShuiList);
        var luoBoLayout = this.GetWndNode("img_dk/luoboLayout");
        for (var i = 0; i < luoBoLayout.children.length; i++) {
            luoBoLayout.children[i].opacity = 0;
        }
        if (JSON.stringify(huLuoBoMap) != "{}") {
            this.ShowHuLuoBoMap(huLuoBoMap);
        }
    },
    ShowHuLuoBoMap: function ShowHuLuoBoMap(huLuoBoMap) {
        var luoBoLayout = this.GetWndNode("img_dk/luoboLayout");
        var imageString = "EatCard_Self_";
        var huLuoBoList = this.SetMapZhuanList(huLuoBoMap);
        for (var i = 0; i < huLuoBoList.length; i++) {
            var luoBoCard = luoBoLayout.children[i];
            if (!luoBoCard) {
                luoBoCard = cc.instantiate(luoBoLayout.children[0]);
                luoBoLayout.addChild(luoBoCard);
            }
            luoBoCard.opacity = 255;
            var huLuoBo = huLuoBoList[i];
            var cardType = huLuoBo["cardType"];
            var num = huLuoBo["num"];
            var cardCom = luoBoCard.getComponent("UIMJCard_Down");
            if (cardType > 0) {
                cardCom.ShowImage(luoBoCard, imageString, cardType + "01");
            }
            luoBoCard.getChildByName("lb_num").getComponent(cc.Label).string = num;
        }
    },
    ShowItemDetail: function ShowItemDetail(liuShuiList) {
        for (var i = 0; i < this.liushuiLayout.children.length; i++) {
            this.liushuiLayout.children[i].active = false;
        }
        for (var _i = 0; _i < liuShuiList.length; _i++) {
            var item = this.liushuiLayout.children[_i];
            if (!item) {
                item = cc.instantiate(this.demo);
                this.liushuiLayout.addChild(item);
            }
            item.active = true;
            var liuShui = liuShuiList[_i];
            var cardType = liuShui["cardType"];
            var duiXiangList = liuShui["duiXiangList"];
            var huTypeMap = liuShui["huTypeMap"];
            var luoBoPoint = liuShui["luoBoPoint"];
            var point = liuShui["point"];
            var yuPoint = liuShui["yuPoint"];
            this.ShowOpType(item.children[0], huTypeMap);
            this.ShowCard(item.children[0], cardType);
            this.ShowHuFen(item.children[0], point);
            this.ShowLuoBoFen(item.children[0], luoBoPoint);
            this.ShowYuFen(item.children[0], yuPoint);
            this.ShowDuiXiang(item.children[0], duiXiangList);
        }
    },
    ShowOpType: function ShowOpType(showNode, huTypeMap) {
        var strString = "";
        for (var key in huTypeMap) {
            var huTypeStr = this.GetHuTypeDict(key);
            var fanShu = huTypeMap[key];
            if (fanShu > 0) {
                huTypeStr = huTypeStr + ":" + fanShu;
            }
            strString += " " + huTypeStr;
        }
        showNode.getChildByName("lb_type").getComponent(cc.Label).string = strString;
    },
    ShowCard: function ShowCard(showNode, cardType) {
        if (cardType > 0) {
            showNode.getChildByName("card").opacity = 255;
            var imageString = "EatCard_Self_";
            var cardCom = showNode.getChildByName("card").getComponent("UIMJCard_Down");
            cardCom.ShowImage(showNode.getChildByName("card"), imageString, cardType + "01");
        } else {
            showNode.getChildByName("card").opacity = 0;
        }
    },
    ShowHuFen: function ShowHuFen(showNode, point) {
        showNode.getChildByName("lb_hufen").getComponent(cc.Label).string = point;
    },
    ShowLuoBoFen: function ShowLuoBoFen(showNode, luoBoPoint) {
        showNode.getChildByName("lb_luobofen").getComponent(cc.Label).string = luoBoPoint;
    },
    ShowYuFen: function ShowYuFen(showNode, yuPoint) {
        showNode.getChildByName("lb_yufen").getComponent(cc.Label).string = yuPoint;
    },
    ShowDuiXiang: function ShowDuiXiang(showNode, duiXiangList) {
        var duixiangLayout = showNode.getChildByName("duixiangLayout");
        for (var i = 0; i < duixiangLayout.children.length; i++) {
            duixiangLayout.children[i].opacity = 0;
        }
        for (var _i2 = 0; _i2 < duiXiangList.length; _i2++) {
            var duixiang = duixiangLayout.children[_i2];
            if (!duixiang) {
                duixiang = cc.instantiate(duixiangLayout.children[0]);
                duixiangLayout.addChild(duixiang);
            }
            duixiang.opacity = 255;
            var index = duiXiangList[_i2];
            duixiang.getComponent(cc.Sprite).spriteFrame = this.bg_num[index];
        }
    },
    GetHuTypeDict: function GetHuTypeDict(type) {
        var huTypeDict = {
            TianHu: "天胡",
            DiHu: "地胡",
            QDHu: "七对",
            QYS: "清一色",
            DD: "独占",
            MenQing: "门清",
            QGH: "抢杠胡",
            ZiMo: "自摸",
            PingHu: "小胡",
            DuanYao: "断幺",
            BianJiaDiao: "压档",
            Long: "通天",
            SiHuo: "四核",
            HeJueZhang: "绝张",
            PPHu: "碰碰胡",
            ChaJiao: "查大叫",
            AnGang: "暗杠",
            JieGang: "明杠",
            Gang: "碰杠",
            GSKH: "杠上开花",
            MaiMa: "翻晃",
            GangNum: "杠分",
            YiSeShuangLong: "双铺子",
            DianPao: "点炮",
            ZiMoJiaOne: "被自摸",
            BQGH: "被抢杠胡",
            JiePao: "接炮",
            AnGangNum: "被暗杠",
            JieGangNum: "被明杠",
            DianGang: "被碰杠"
        };
        return huTypeDict[type];
    },
    SetMapZhuanList: function SetMapZhuanList(huLuoBoMap) {
        var huLuoBoList = [];
        for (var key in huLuoBoMap) {
            var cardType = key;
            var num = huLuoBoMap[key];
            huLuoBoList.push({ "cardType": cardType, "num": num });
        }
        return huLuoBoList;
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
        //# sourceMappingURL=xcmj_UIDuijuliushui.js.map
        