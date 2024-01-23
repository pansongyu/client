"use strict";
cc._RF.push(module, 'a396ddEeLhPeIscoZsth/XO', 'xmmj_winlost_child');
// script/ui/uiGame/xmmj/xmmj_winlost_child.js

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
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
        // this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'),HuList.huaList);
        this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacardscrollView'), HuList.huaList);
    },
    ShowPlayerHuaCard: function ShowPlayerHuaCard(huacardscrollView, hualist) {
        huacardscrollView.active = true;
        // if (hualist.length > 0) {
        //     this.huaNum.active = true;
        //     this.huaNum.getComponent(cc.Label).string = hualist.length + "个";
        // }
        // else {
        //     this.huaNum.active = false;
        //     this.huaNum.getComponent(cc.Label).string = "";
        // }
        var view = huacardscrollView.getChildByName("view");
        var ShowNode = view.getChildByName("huacard");
        var UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowHua");
        UICard_ShowCard.ShowHuaList(hualist);
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
        } else if (huType == this.ShareDefine.HuType_SanJinDao) {
            huNode.getComponent(cc.Label).string = '三金倒';
        } else if (huType == this.ShareDefine.HuType_DanYou) {
            huNode.getComponent(cc.Label).string = '单游';
        } else if (huType == this.ShareDefine.HuType_ShuangYou) {
            huNode.getComponent(cc.Label).string = '双游';
        } else if (huType == this.ShareDefine.HuType_SanYou) {
            huNode.getComponent(cc.Label).string = '三游';
        } else if (huType == this.ShareDefine.HuType_QiangJin) {
            huNode.getComponent(cc.Label).string = '抢金';
        } else if (huType == this.ShareDefine.HuType_TianHu) {
            huNode.getComponent(cc.Label).string = '天胡';
        } else if (huType == this.ShareDefine.HuType_DiHu) {
            huNode.getComponent(cc.Label).string = '地胡';
        } else if (huType == this.ShareDefine.HuType_SanJinYou) {
            huNode.getComponent(cc.Label).string = '三金游';
        } else if (huType == this.ShareDefine.HuType_DDHu) {
            huNode.getComponent(cc.Label).string = '对对胡';
        } else {
            huNode.getComponent(cc.Label).string = '';
        }
    },
    LabelName: function LabelName(huType) {
        var LabelArray = {
            DiFen: "底分",
            LianZhuang: "连庄",
            AnKe: "暗刻",
            PengPai: "碰牌",
            MingGang: "接杠 ",
            JieGang: "明杠",
            BuGang: "补杠",
            AnGang: "暗杠",
            BeiShu: "倍数",
            Hua: "花",
            Jin: "金",
            DanYou: "单游",
            ShuangYou: "双游",
            SanYou: "三游",
            TianHu: "天胡",
            SanJinDao: "三金倒",
            PingHu: "平胡",
            QGH: "抢杠胡",
            ZiMo: "自摸",
            QiangJin: "抢金"
        };
        return LabelArray[huType];
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
            if (huType == "DanYou" || huType == "ShuangYou" || huType == "SanYou" || huType == "TianHu" || huType == "SanJinDao" || huType == "PingHu" || huType == "QGH" || huType == "ZiMo" || huType == "QiangJin") {
                this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + "x" + huPoint);
            } else {
                this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + "： " + huPoint);
            }
            console.log("ShowPlayerJieSuan", huType, huPoint);
        }
    }
});

cc._RF.pop();