"use strict";
cc._RF.push(module, '34659ZuRwNDVJmUQKSyydYw', 'bsmj_winlost_child');
// script/ui/uiGame/bsmj/bsmj_winlost_child.js

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

    ShowOtherScore: function ShowOtherScore() {
        var huTypeMap = this.posResultInfo["huTypeMap"];
        if (typeof huTypeMap == "undefined") {
            huTypeMap = this.posResultInfo["endPoint"]["huTypeMap"];
        }
        this.scores = this.node.getChildByName("scores");
        this.scores.getChildByName("lb_MaiMa").getComponent(cc.Label).string = "马分" + huTypeMap["MaiMa"];
        this.scores.getChildByName("lb_Gang").getComponent(cc.Label).string = "杠分" + huTypeMap["Gang"];
        this.scores.getChildByName("lb_huPoint").getComponent(cc.Label).string = "胡分" + huTypeMap["HuPoint"];
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
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo, HuList);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
        this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'), HuList.huaList);
        this.posResultInfo = HuList;
        this.ShowOtherScore();
        this.ShowHuBaoPosList(this.posResultInfo["huBaoPosList"]);
    },
    // 互包
    ShowHuBaoPosList: function ShowHuBaoPosList(huBaoPosList) {
        // let cfg = {};
        // cfg[EnumType.EnumRelativePosType.EnumRelativePos_SELF] = "本";
        // cfg[EnumType.EnumRelativePosType.EnumRelativePos_XIA] = "下";
        // cfg[EnumType.EnumRelativePosType.EnumRelativePos_DUI] = "对";
        // cfg[EnumType.EnumRelativePosType.EnumRelativePos_SHANG] = "上";

        // let huBaoList = this.node.getChildByName("huBaoList");
        // huBaoList.removeAllChildren();
        // let lb_huBao = this.node.getChildByName("lb_huBao");

        // this.playerCount = this.endInfo["posResultList"].length;
        // let clientPos = this.RoomPosMgr.GetClientPos();
        // for (let i = 0; i < huBaoPosList.length; i++) {
        // 	let posId = huBaoPosList[i];
        // 	let relativePos = this.RelativePosValue(clientPos, posId, this.playerCount);
        // 	let str = "互包" + cfg[relativePos] + "家";
        // 	let node = cc.instantiate(lb_huBao);
        // 	node.active = true;
        // 	node.getComponent(cc.Label).string = str;
        // 	huBaoList.addChild(node);
        // }
    },

    ShowPlayerJieSuan: function ShowPlayerJieSuan(ShowNode, huInfoAll) {
        // let huInfo = huInfoAll['endPoint'].huTypeMap;
        var huInfo = huInfoAll["huTypeMap"];
        if (typeof huInfo == "undefined") {
            huInfo = huInfoAll["endPoint"]["huTypeMap"];
        }
        for (var huType in huInfo) {
            if (huType == "MaiMa" || huType == "Gang" || huType == "HuPoint") {
                continue;
            }
            var huPoint = huInfo[huType];
            this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + "： " + huPoint);
            console.log("ShowPlayerJieSuan", huType, huPoint);
        }
    },

    RelativePosValue: function RelativePosValue(referencePos, posId, playerCount) {
        var downPos = -1; //下家
        var facePos = -1; //对家
        var upPos = -1; //上家
        if (playerCount == 2) {
            facePos = referencePos == 0 ? 1 : 0;
        } else if (playerCount == 3) {
            upPos = (referencePos + playerCount - 1) % playerCount;
            downPos = (referencePos + 1) % playerCount;
        } else {
            upPos = (referencePos + playerCount - 1) % playerCount;
            downPos = (referencePos + 1) % playerCount;
            facePos = (referencePos + 2) % playerCount;
        }
        if (posId == referencePos) return EnumType.EnumRelativePosType.EnumRelativePos_SELF;
        if (posId == downPos) return EnumType.EnumRelativePosType.EnumRelativePos_XIA;
        if (posId == facePos) return EnumType.EnumRelativePosType.EnumRelativePos_DUI;
        if (posId == upPos) return EnumType.EnumRelativePosType.EnumRelativePos_SHANG;

        return EnumType.EnumRelativePosType.EnumRelativePos_NONE;
    },

    LabelName: function LabelName(huType) {
        var LabelArray = this.GetHuTypeDict();
        return LabelArray[huType];
    },

    // GetHuTypeDict -start-
    GetHuTypeDict: function GetHuTypeDict() {
        var huTypeDict = {};
        huTypeDict["MenQing"] = "门清";
        huTypeDict["QDHu"] = "七小对";
        huTypeDict["HDDHu"] = "七大对";
        huTypeDict["CHDDHu"] = "豪华七大对";
        huTypeDict["CCHDDHu"] = "豪华七大对";
        huTypeDict["PPH"] = "碰碰胡";
        huTypeDict["GSKH"] = "杠开";
        huTypeDict["GSP"] = "杠后炮";
        huTypeDict["PingHu"] = "平胡";
        huTypeDict["QYS"] = "清一色";
        huTypeDict["QGH"] = "抢杠胡";
        huTypeDict["TianHu"] = "天胡";
        huTypeDict["DiHu"] = "地胡";
        huTypeDict["Long"] = "一条龙";
        huTypeDict["SSY"] = "十三幺";
        huTypeDict["QQR"] = "全求炮";
        huTypeDict["QuanQiuR"] = "全求人";
        huTypeDict["JiePao"] = "炮胡";
        huTypeDict["ZiMo"] = "自摸";
        huTypeDict["Gang"] = "杠分";
        huTypeDict["ZhongNiao"] = "中马";
        huTypeDict["JieGang"] = "直杠";
        huTypeDict["AnGang"] = "暗杠";
        huTypeDict["MaiMa"] = "马分";
        huTypeDict["HuPoint"] = "胡分";
        huTypeDict["GangPao"] = "碰杠";

        return huTypeDict;
    }
    // GetHuTypeDict -end-

});

cc._RF.pop();