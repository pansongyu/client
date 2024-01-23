"use strict";
cc._RF.push(module, 'eab5bj4RNRB35OyC/npdN04', 'hnpdsmj_winlost_child');
// script/ui/uiGame/hnpdsmj/hnpdsmj_winlost_child.js

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
        this.IntegrateImage = app.SysDataManager().GetTableDict("IntegrateImage");
        this.ShareDefine = app.ShareDefine();
    },
    UpdatePlayData: function UpdatePlayData(PlayerNode, HuList, PlayerInfo) {
        var jin1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var jin2 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
        var zhuaNiaoList = arguments[5];

        this.showLabelNum = 1;
        this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo, HuList);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
        this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'), HuList.huaList);
    },
    ShowPlayerInfo: function ShowPlayerInfo(ShowNode, PlayerInfo, HuList) {
        ShowNode.getChildByName('lable_name').getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"], PlayerInfo["name"]);
        ShowNode.getChildByName('label_id').getComponent("cc.Label").string = "ID:" + this.ComTool.GetPid(PlayerInfo["pid"]);

        var isTing = HuList["isTing"];
        ShowNode.getChildByName('ting').active = isTing;
    },
    ShowPlayerRecord: function ShowPlayerRecord(ShowNode, huInfo) {
        //杠分
        if (huInfo["gangPoint"] > 0) {
            ShowNode.getChildByName('tip_gangpoint').getChildByName('lb_gangpoint').getComponent("cc.Label").string = '+' + huInfo["gangPoint"];
        } else {
            ShowNode.getChildByName('tip_gangpoint').getChildByName('lb_gangpoint').getComponent("cc.Label").string = '' + huInfo["gangPoint"];
        }
        var absNum = Math.abs(huInfo["point"]);
        if (absNum > 10000) {
            var shortNum = (absNum / 10000).toFixed(2);
            if (huInfo["point"] > 0) {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '+' + shortNum + "万";
            } else {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '-' + shortNum + "万";
            }
        } else {
            if (huInfo["point"] > 0) {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '+' + huInfo["point"];
            } else {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = huInfo["point"];
            }
        }
        //显示比赛分
        if (typeof huInfo.sportsPointTemp != "undefined") {
            ShowNode.getChildByName('tip_sportspoint').active = true;
            if (huInfo.sportsPointTemp > 0) {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = "+" + huInfo.sportsPointTemp;
            } else {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = huInfo.sportsPointTemp;
            }
        } else if (typeof huInfo.sportsPoint != "undefined") {
            ShowNode.getChildByName('tip_sportspoint').active = true;
            if (huInfo.sportsPoint > 0) {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = "+" + huInfo.sportsPoint;
            } else {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = huInfo.sportsPoint;
            }
        } else {
            ShowNode.getChildByName('tip_sportspoint').active = false;
        }
    },
    ShowPlayerHuImg: function ShowPlayerHuImg(huNode, huTypeName) {
        /*huLbIcon
        *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
        *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
        */
        var huType = this.ShareDefine.HuTypeStringDict[huTypeName];
        //默认颜色描边
        huNode.color = new cc.Color(252, 236, 117);
        huNode.getComponent(cc.LabelOutline).color = new cc.Color(163, 61, 8);
        huNode.getComponent(cc.LabelOutline).Width = 2;
        if (typeof huType == "undefined") {
            huNode.getComponent(cc.Label).string = '';
        } else if (huType == this.ShareDefine.HuType_DianPao) {
            huNode.getComponent(cc.Label).string = '点炮';
            huNode.color = new cc.Color(192, 221, 245);
            huNode.getComponent(cc.LabelOutline).color = new cc.Color(31, 55, 127);
            huNode.getComponent(cc.LabelOutline).Width = 2;
        } else if (huType == this.ShareDefine.HuType_JiePao) {
            huNode.getComponent(cc.Label).string = '接炮';
        } else if (huType == this.ShareDefine.HuType_ZiMo) {
            huNode.getComponent(cc.Label).string = '自摸';
        } else if (huType == this.ShareDefine.HuType_QGH) {
            huNode.getComponent(cc.Label).string = '抢杠胡';
        } else if (huType == this.ShareDefine.HuType_GSKH) {
            huNode.getComponent(cc.Label).string = '杠开';
        } else {
            huNode.getComponent(cc.Label).string = '';
        }
    },
    ShowPlayerJieSuan: function ShowPlayerJieSuan(ShowNode, huInfoAll) {
        var huInfo = huInfoAll['endPoint'].huTypeMap;
        // this.ClearLabelShow(ShowNode.getChildByName('label_lists'));
        for (var huType in huInfo) {
            var huPoint = huInfo[huType];
            if (this.IsShowNum(huType)) {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "x" + huPoint);
                // this.ShowLabelName(ShowNode.getChildByName("label_lists"), huTypeDict[huType] + "*2");
            } else if (this.IsShowScore(huType)) {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
            } else {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType));
                // this.ShowLabelName(ShowNode.getChildByName("label_lists"), huTypeDict[huType] + "：" + huPoint);
            }
            console.log("ShowPlayerJieSuan", huType, huPoint);
        }
    },
    //分数
    IsShowScore: function IsShowScore(huType) {
        var multi2 = ["Hu", // 
        "QYS", //  
        "ZYS", //      
        "HYS", //  
        "QD", //  
        "GSKH", // 
        "ZhuangJiaJiaDi"];
        var isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },
    //个数
    IsShowNum: function IsShowNum(huType) {
        var multi2 = ["AnGang", // 暗杠个数 
        "JieGang", // 明杠个数  
        "Gang", // 绕杠个数  
        "PaoTou", // 跑头个数  
        "PaoKou"];
        var isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },
    //倍数
    IsShowMulti2: function IsShowMulti2(huType) {
        var multi2 = ["AnGang"];
        var isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },
    LabelName: function LabelName(huType) {
        var huTypeDict = {
            Hu: "平胡",
            QYS: "黑子",
            ZYS: "黑子",
            HYS: "黑子",
            QD: "七对",
            GSKH: "杠上开花",
            AnGang: "暗杠",
            JieGang: "明杠",
            Gang: "绕杠",
            ZhuangJiaJiaDi: "庄家加底",
            PaoTou: "搁跑头",
            PaoKou: "搁跑扣"
        };
        return huTypeDict[huType];
    }
});

cc._RF.pop();