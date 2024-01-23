"use strict";
cc._RF.push(module, 'b2db0RuDm1PAZpnwbCpzQZt', 'lgmj_winlost_child');
// script/ui/uiGame/lgmj/lgmj_winlost_child.js

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
    },
    ShowPlayerHuImg: function ShowPlayerHuImg(huNode, huTypeName) {
        /*huLbIcon
         *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
         *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
         */
        var huType = this.ShareDefine.HuTypeStringDict[huTypeName];
        if (typeof huType == "undefined") {
            huNode.getComponent(cc.Label).string = '';
        } else if (huType == this.ShareDefine.HuType_DianPao) {
            huNode.getComponent(cc.Label).string = '点泡';
        } else if (huType == this.ShareDefine.HuType_JiePao) {
            huNode.getComponent(cc.Label).string = '接炮';
        } else if (huType == this.ShareDefine.HuType_ZiMo) {
            huNode.getComponent(cc.Label).string = '自摸';
        } else {
            huNode.getComponent(cc.Label).string = '';
        }
    },
    ShowPlayerJieSuan: function ShowPlayerJieSuan(ShowNode, huInfoAll) {
        var huInfo = huInfoAll['endPoint'].huTypeMap;
        // let huInfo = huInfoAll["huTypeMap"];
        for (var huType in huInfo) {
            var huPoint = huInfo[huType];
            if (this.IsShowMulti2(huType)) {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "*" + huPoint);
            } else {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
            }
            console.log("ShowPlayerJieSuan", huType);
        }
    },
    ShowPlayerRecord: function ShowPlayerRecord(ShowNode, huInfo) {
        var absNum = Math.abs(huInfo["point"]);
        ShowNode.getChildByName('lb_record_win').active = false;
        ShowNode.getChildByName('lb_record_lost').active = false;
        if (absNum > 10000) {
            var shortNum = (absNum / 10000).toFixed(2);
            if (huInfo["point"] > 0) {
                ShowNode.getChildByName('lb_record_win').getComponent("cc.Label").string = '+' + shortNum + "万";
                ShowNode.getChildByName('lb_record_win').active = true;
            } else {
                ShowNode.getChildByName('lb_record_lost').getComponent("cc.Label").string = '-' + shortNum + "万";
                ShowNode.getChildByName('lb_record_lost').active = true;
            }
        } else {
            if (huInfo["point"] > 0) {
                ShowNode.getChildByName('lb_record_win').getComponent("cc.Label").string = '+' + huInfo["point"];
                ShowNode.getChildByName('lb_record_win').active = true;
            } else {
                ShowNode.getChildByName('lb_record_lost').getComponent("cc.Label").string = huInfo["point"];
                ShowNode.getChildByName('lb_record_lost').active = true;
            }
        }
        var isLaZi = huInfo["isLaZi"];
        var huShu = huInfo["huShu"];
        var taiShu = huInfo["taiShu"];
        ShowNode.getChildByName("lazi").active = isLaZi;
        ShowNode.getChildByName("hunum").getComponent("cc.Label").string = "胡数：" + huShu;
        ShowNode.getChildByName("tainum").getComponent("cc.Label").string = "台数：" + taiShu;
    },

    IsShowMulti2: function IsShowMulti2(huType) {
        var multi2 = [];
        var isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },

    LabelName: function LabelName(huType) {
        var huTypeDict = {
            XZ: "小子",
            DZ: "大子",
            DuiZ: "对子",
            HYS: "混一色",
            YTL: "一条龙",
            DDH: "对对胡",
            SH: "四花",
            ZH: "座花",
            KZ: "刻子",
            WW: "无万能牌",
            YL: "有两张万能牌",
            FB: "庄家翻倍",
            TH: "天胡",
            DH: "地胡",
            RH: "人胡",
            TTJ: "推土机",
            QYS: "清一色",
            DSX: "大四喜",
            XSX: "小四喜",
            SFDF: "四方大发",
            QLT: "清老头",
            HLT: "混老头",
            CSH: "财神会",
            BH: "补花",

            BDB: "八对半",
            PH: "屁胡",
            LZ: "辣子",
            HZFCZFKZ: "红中发财作风刻子",
            HP: "胡牌",
            SZJ: "顺子中间",
            SLB: "自摸两边",
            KeZ: "自摸刻子",
            PSZ: "炮胡中间"
        };
        if (!huTypeDict.hasOwnProperty(huType)) {
            console.error("huType = " + huType + "is not exist");
        }

        return huTypeDict[huType];
    }
});

cc._RF.pop();