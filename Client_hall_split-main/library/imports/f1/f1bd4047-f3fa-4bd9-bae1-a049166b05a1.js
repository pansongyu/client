"use strict";
cc._RF.push(module, 'f1bd4BH8/pL2brhoEkWawWh', 'fzmj_winlost_child');
// script/ui/uiGame/fzmj/fzmj_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
    extends: require("BaseMJ_winlost_child"),

    properties: {
        huaNum: cc.Node
    },
    // use this for initialization
    OnLoad: function OnLoad() {
        this.ComTool = app.ComTool();
        this.ShareDefine = app.ShareDefine();
    },
    UpdatePlayData: function UpdatePlayData(PlayerNode, HuList, PlayerInfo) {
        var jin1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var jin2 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
        var maPaiLst = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

        this.HuList = HuList;
        this.showLabelNum = 1;
        this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
        //显示比赛分
        if (typeof HuList.sportsPointTemp != "undefined") {
            if (HuList.sportsPointTemp > 0) {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：+" + HuList.sportsPointTemp);
            } else {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：" + HuList.sportsPointTemp);
            }
        } else if (typeof HuList.sportsPoint != "undefined") {
            if (HuList.sportsPoint > 0) {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：+" + HuList.sportsPoint);
            } else {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：" + HuList.sportsPoint);
            }
        }
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
        this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacardscrollView'), HuList.huaList);
    },
    ShowPlayerHuaCard: function ShowPlayerHuaCard(huacardscrollView, hualist) {
        huacardscrollView.active = true;
        if (hualist.length > 0) {
            this.huaNum.active = true;
            this.huaNum.getComponent(cc.Label).string = hualist.length + "个";
        } else {
            this.huaNum.active = false;
            this.huaNum.getComponent(cc.Label).string = "";
        }
        var view = huacardscrollView.getChildByName("view");
        var ShowNode = view.getChildByName("huacard");
        var UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowHua");
        UICard_ShowCard.Show36HuaList(hualist);
    },
    LabelName: function LabelName(huType) {
        var LabelArray = {
            Hua: "花番",
            AnGang: "暗杠",
            Gang: "杠",
            JieGang: "接杠",
            Jin: "金番",
            Peng: "碰",
            SC_Ke: "刻",
            Zhuang: "庄",
            LianZhuang: "连庄",
            Xian: "闲",
            dianGang: "点杠",
            DiFen: "底分",
            Hu: "胡",
            TianHu: "天胡",
            FHZ: "红中",
            fa: "发财",
            skf: "三吃翻",
            chiJin: "吃金翻",
            huFan: "胡翻",
            QYS: "清一色",
            HYS: "混一色",
            JinLong: "金龙",
            JinQue: "金雀",
            YiZhangHua: "一张花",
            WHuaWGang: "无花无杠",
            QiangJin: "抢金",
            SanJinDao: "三金倒",
            PingHu: "平胡",
            ZiMo: "自摸"
        };
        return LabelArray[huType];
    }
});

cc._RF.pop();