"use strict";
cc._RF.push(module, '149641rH8xMzpP7LlvlCLLs', 'tzkzmj_winlost_child');
// script/ui/uiGame/tzkzmj/tzkzmj_winlost_child.js

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

        this.showLabelNum = 1;
        this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
        //显示比赛分
        if (typeof HuList.sportsPoint != "undefined") {
            if (HuList.sportsPoint > 0) {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：+" + HuList.sportsPoint);
            } else {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：" + HuList.sportsPoint);
            }
        }
        this.huaNum.active = false;
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo, HuList);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
        // this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'),HuList.huaList);
        this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacardscrollView'), HuList.huaList);
    },
    ShowPlayerInfo: function ShowPlayerInfo(ShowNode, PlayerInfo, HuList) {
        ShowNode.getChildByName('lable_name').getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"], PlayerInfo["name"]);
        ShowNode.getChildByName('label_id').getComponent("cc.Label").string = "ID:" + this.ComTool.GetPid(PlayerInfo["pid"]);
        ShowNode.getChildByName('img_ting').active = HuList["isTing"];
        ShowNode.getChildByName('img_tianting').active = HuList["isTianTing"];

        //所属推广员ID
        if (ShowNode.getChildByName('label_upLevel')) {
            if (HuList["upLevelId"] > 0) {
                ShowNode.getChildByName('label_upLevel').getComponent("cc.Label").string = "所属推广员ID:" + HuList["upLevelId"];
            } else {
                ShowNode.getChildByName('label_upLevel').getComponent("cc.Label").string = "";
            }
        }
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
        UICard_ShowCard.Show24HuaList(hualist);
    },
    LabelName: function LabelName(huType) {
        var huTypeDict = {
            Hu: "胡",
            MQ: " 门清",
            DDH: " 对对胡",
            QYS: "清一色",
            AK: " 暗坎",
            YTL: " 一条龙",
            GK: " 杠开",
            GZ: " 拐之",
            CC: " 超长",
            CD: " 超短",
            ST: "四同",
            WH: "无花",
            ZT: "直听",
            JZ: "绝之",
            STY: "四拖一",
            CDi: "铲底",
            WZ: " 挖之",
            QGH: " 抢杠胡",
            GangChong: " 杠冲",
            HP: " 花牌",
            TYWS: " 同眼握手",
            KZ: " 卡子",
            ZM: " 自摸",
            JP: " 接炮",
            G: " 杠"
        };
        return huTypeDict[huType];
    },
    ShowPlayerJieSuan: function ShowPlayerJieSuan(ShowNode, huInfoAll) {
        var huInfo = false;
        if (huInfoAll['endPoint']) {
            huInfo = huInfoAll['endPoint'];
        } else {
            huInfo = huInfoAll;
        }
        var huTypeMap = huInfo.huTypeMap;
        for (var huType in huTypeMap) {
            var huPoint = huTypeMap[huType];
            if (huType == "MQ" || huType == "DDH" || huType == "YTL" || huType == "GK" || huType == "GZ" || huType == "CC" || huType == "CD" || huType == "WZ") {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint + "x2");
            } else if (huType == "QYS" || huType == "ST" || huType == "WH" ||
            // huType == "ZT" ||
            huType == "JZ" || huType == "STY" || huType == "CDi") {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint + "x4");
            } else if (huType == "ZT" || huType == "ZZH") {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint + "x8");
            } else if (huType == "AK") {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：x" + huPoint);
            } else {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
            }
        }
    }
});

cc._RF.pop();