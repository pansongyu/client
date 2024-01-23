(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/ksmj/ksmj_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3c97bfCOHxO2Ikw/RnGRjVh', 'ksmj_winlost_child', __filename);
// script/ui/uiGame/ksmj/ksmj_winlost_child.js

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
        this.ShowPlayerHuaCard(PlayerNode.getChildByName('scrollview').getChildByName('view').getChildByName('huacard'), HuList.huaList);
    },

    ShowPlayerHuaCard: function ShowPlayerHuaCard(ShowNode, hualist) {
        if (hualist.length == 0) {
            ShowNode.active = false;
            return;
        }
        ShowNode.active = 1;
        var UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowHua");
        UICard_ShowCard.ShowHuaListByKSMJ(hualist);
    },

    // ShowPlayerShowCard: function (ShowNode, cardIDList, handCard, jin1, jin2) {
    //     ShowNode.active = 1;
    //     let UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowCard");
    //     UICard_ShowCard.ShowDownCardByKSMJ(cardIDList, handCard, jin1, jin2);
    // },

    LabelName: function LabelName(huType) {
        var huTypeDict = {};
        huTypeDict["HYS"] = "混一色";
        huTypeDict["QYS"] = "清一色";
        huTypeDict["DDH"] = "对对胡";
        huTypeDict["GK"] = "杠开";
        huTypeDict["DDC"] = "大吊车";
        huTypeDict["HDLY"] = "海底捞月";
        huTypeDict["MQ"] = "门清";
        huTypeDict["HG"] = "花杠";
        huTypeDict["GF"] = "杠分";
        huTypeDict["HS"] = "花数";
        huTypeDict["WHG"] = "无花果";

        return huTypeDict[huType];
    }

    // LabelName:function(huType){
    //     let LabelArray=[];
    //     LabelArray["Hua"]="花番";
    //     LabelArray["ZiMo"]="自摸";
    //     LabelArray["JieGang"]="接杠";
    //     LabelArray["AnGang"]="暗杠";
    //     LabelArray["Gang"]="补杠";
    //     LabelArray["GSKH"]="杠上开花";
    //     LabelArray["QGHu"]="抢杠胡";
    //     LabelArray["Hua"]="花数";
    //     LabelArray["SanJinDao"]="三金倒";
    //     LabelArray["DanYou"]="单游";
    //     LabelArray["ShuangYou"]="双游";
    //     LabelArray["SanYou"]="三游";
    //     LabelArray["SiJinDao"]="四金倒";
    //     LabelArray["WuJinDao"]="五金倒";
    //     LabelArray["LiuJinDao"]="六金倒";
    //     LabelArray["QiangJin"]="抢金";
    //     LabelArray["ShiSanYao"]="十三幺";
    //     LabelArray["DDHu"]="对对胡";
    //     LabelArray["TianHu"]="天胡";
    //     LabelArray["FenBing"]="分饼";
    //     return LabelArray[huType];
    // },
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
        //# sourceMappingURL=ksmj_winlost_child.js.map
        