"use strict";
cc._RF.push(module, '6db6d/aut9HCZwRgy3Q//oK', 'xlhzmj_UIDuijuliushui');
// script/ui/uiGame/xlhzmj/xlhzmj_UIDuijuliushui.js

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
            QDHu: "七对",
            HDDHu: "龙七对",
            QYSQD: "清七对",
            QYSHDDHu: "清龙七对",
            JYSPPH: "将对",
            QYSPPH: "清对",
            PPH: "对对胡",
            QYSYTL: "对对胡",
            QingYaoJiu: "清幺九",
            HunYaoJiu: "幺九",
            QYS: "清一色",
            BaoJiao: "报叫",
            GSKH: "杠上花",
            GSP: "杠上炮",
            PingHu: "推倒胡",
            TianHu: "天胡",
            DiHu: "地胡",
            GangPao: "带根",
            JieGang: "直杠",
            JieGangNum: "被直杠",
            Gang: "补杠",
            AnGang: "暗杠",
            AnGangNum: "被暗杠",
            GangNum: "被补杠",
            PeiZi: "反赔",
            ChaJiao: "查叫",
            Hua: "查花猪",
            FangGang: "退税",
            DD: "金钩钩",
            HDL: "妙手回春",
            HDLY: "海底捞月",
            BianZhang: "边张",
            KanZhang: "坎张",
            LaoShaoFu: "老少副",
            BQRen: "不求人",
            TuiBuDao: "推不倒",
            Long: "清龙",
            LuoHan18: "十八罗汉",
            JiuPengBaoDeng: "九蓬宝灯",
            LianQiDui: "连七对",
            DaYuWu: "大于五",
            XiaoYuWu: "小于五",
            QuanDa: "全大",
            QuanZhong: "全中",
            QuanXiao: "全小",
            QuanDaiWu: "全带五",
            QuanDaiYao: "全带幺",
            ShuangTongKe: "双同刻",
            ShuangAnKe: "双暗刻",
            SanGang: "三杠",
            QuanShuangKe: "全双刻",
            YiSeSanJieGao: "三节高",
            YiSeSiJieGao: "四节高",
            SanAnKe: "三暗刻",
            SiAnKe: "四暗刻",
            YiSeShuangLong: "一色双龙会",
            ZiMo: "自摸",
            QGH: "抢杠胡",
            DuanYao: "断幺九",
            MenQing: "门清",
            ZiMoJiaOne: "被自摸",
            DianPao: "点炮",
            JiePao: "接炮",
            BQGH: "被抢杠胡",
            HeJueZhang: "绝张",
            LvYiSe: "绿一色"
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