var app = require("app");
cc.Class({
    extends: require("BaseForm"),
    properties: {
        bg_num: [cc.SpriteFrame],
    },
    //初始化
    OnCreateInit: function () {
        this.liushuiLayout = this.GetWndNode("img_dk/liushuiScrollView/view/content");
        this.demo = this.liushuiLayout.children[0];
    },
    OnShow: function (liuShuiList, huLuoBoMap) {
        console.log("liushuiScrollView", liuShuiList, huLuoBoMap);
        this.ShowItemDetail(liuShuiList);
        let luoBoLayout = this.GetWndNode("img_dk/luoboLayout");
        for (let i = 0; i < luoBoLayout.children.length; i++) {
            luoBoLayout.children[i].opacity = 0;
        }
        if (JSON.stringify(huLuoBoMap) != "{}") {
            this.ShowHuLuoBoMap(huLuoBoMap);
        }
    },
    ShowHuLuoBoMap: function (huLuoBoMap) {
        let luoBoLayout = this.GetWndNode("img_dk/luoboLayout");
        let imageString = "EatCard_Self_";
        let huLuoBoList = this.SetMapZhuanList(huLuoBoMap);
        for (let i = 0; i < huLuoBoList.length; i++) {
            let luoBoCard = luoBoLayout.children[i];
            if (!luoBoCard) {
                luoBoCard = cc.instantiate(luoBoLayout.children[0]);
                luoBoLayout.addChild(luoBoCard);
            }
            luoBoCard.opacity = 255;
            let huLuoBo = huLuoBoList[i];
            let cardType = huLuoBo["cardType"];
            let num = huLuoBo["num"];
            let cardCom = luoBoCard.getComponent("UIMJCard_Down");
            if (cardType > 0) {
                cardCom.ShowImage(luoBoCard, imageString, cardType + "01");
            }
            luoBoCard.getChildByName("lb_num").getComponent(cc.Label).string = num;
        }
    },
    ShowItemDetail: function (liuShuiList) {
        for (let i = 0; i < this.liushuiLayout.children.length; i++) {
            this.liushuiLayout.children[i].active = false;
        }
        for (let i = 0; i < liuShuiList.length; i++) {
            let item = this.liushuiLayout.children[i];
            if (!item) {
                item = cc.instantiate(this.demo);
                this.liushuiLayout.addChild(item);
            }
            item.active = true;
            let liuShui = liuShuiList[i];
            let cardType = liuShui["cardType"];
            let duiXiangList = liuShui["duiXiangList"];
            let huTypeMap = liuShui["huTypeMap"];
            let luoBoPoint = liuShui["luoBoPoint"];
            let point = liuShui["point"];
            let yuPoint = liuShui["yuPoint"];
            this.ShowOpType(item.children[0], huTypeMap);
            this.ShowCard(item.children[0], cardType);
            this.ShowHuFen(item.children[0], point);
            this.ShowLuoBoFen(item.children[0], luoBoPoint);
            this.ShowYuFen(item.children[0], yuPoint);
            this.ShowDuiXiang(item.children[0], duiXiangList);
        }
    },
    ShowOpType: function (showNode, huTypeMap) {
        let strString = "";
        for (let key in huTypeMap) {
            let huTypeStr = this.GetHuTypeDict(key);
            let fanShu = huTypeMap[key];
            if (fanShu > 0) {
                huTypeStr = huTypeStr + ":" + fanShu;
            }
            strString += " " + huTypeStr;
        }
        showNode.getChildByName("lb_type").getComponent(cc.Label).string = strString;
    },
    ShowCard: function (showNode, cardType) {
        if (cardType > 0) {
            showNode.getChildByName("card").opacity = 255;
            let imageString = "EatCard_Self_";
            let cardCom = showNode.getChildByName("card").getComponent("UIMJCard_Down");
            cardCom.ShowImage(showNode.getChildByName("card"), imageString, cardType + "01");
        } else {
            showNode.getChildByName("card").opacity = 0;
        }
    },
    ShowHuFen: function (showNode, point) {
        showNode.getChildByName("lb_hufen").getComponent(cc.Label).string = point;
    },
    ShowLuoBoFen: function (showNode, luoBoPoint) {
        showNode.getChildByName("lb_luobofen").getComponent(cc.Label).string = luoBoPoint;
    },
    ShowYuFen: function (showNode, yuPoint) {
        showNode.getChildByName("lb_yufen").getComponent(cc.Label).string = yuPoint;
    },
    ShowDuiXiang: function (showNode, duiXiangList) {
        let duixiangLayout = showNode.getChildByName("duixiangLayout");
        for (let i = 0; i < duixiangLayout.children.length; i++) {
            duixiangLayout.children[i].opacity = 0;
        }
        for (let i = 0; i < duiXiangList.length; i++) {
            let duixiang = duixiangLayout.children[i];
            if (!duixiang) {
                duixiang = cc.instantiate(duixiangLayout.children[0]);
                duixiangLayout.addChild(duixiang);
            }
            duixiang.opacity = 255;
            let index = duiXiangList[i];
            duixiang.getComponent(cc.Sprite).spriteFrame = this.bg_num[index];
        }
    },
    GetHuTypeDict: function (type) {
        let huTypeDict = {
            TianHu:"天胡",
            DiHu:"地胡",
            QDHu:"七对",
            QYS:"清一色",
            DD:"独占",
            MenQing:"门清",
            QGH:"抢杠胡",
            ZiMo:"自摸",
            PingHu:"小胡",
            DuanYao:"断幺",
            BianJiaDiao:"压档",
            Long:"通天",
            SiHuo:"四核",
            HeJueZhang:"绝张",
            PPHu:"碰碰胡",
            ChaJiao:"查大叫",
            AnGang:"暗杠",
            JieGang:"明杠",
            Gang:"碰杠",
            GSKH:"杠上开花",
            MaiMa:"翻晃",
            GangNum:"杠分",
            YiSeShuangLong:"双铺子",
            DianPao:"点炮",
            ZiMoJiaOne:"被自摸",
            BQGH:"被抢杠胡",
            JiePao:"接炮",
            AnGangNum:"被暗杠",
            JieGangNum:"被明杠",
            DianGang:"被碰杠",
        };
        return huTypeDict[type];
    },
    SetMapZhuanList: function (huLuoBoMap) {
        let huLuoBoList = [];
        for (let key in huLuoBoMap) {
            let cardType = key;
            let num = huLuoBoMap[key];
            huLuoBoList.push({"cardType": cardType, "num": num});
        }
        return huLuoBoList;
    },
});