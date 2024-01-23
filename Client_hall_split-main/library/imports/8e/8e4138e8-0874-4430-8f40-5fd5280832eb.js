"use strict";
cc._RF.push(module, '8e413joCHREMI9AX9UoCDLr', 'zcmj_winlost_child');
// script/ui/uiGame/zcmj/zcmj_winlost_child.js

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
            huNode.getComponent(cc.Label).string = '点炮';
        } else if (huType == this.ShareDefine.HuType_JiePao) {
            huNode.getComponent(cc.Label).string = '接炮';
        } else if (huType == this.ShareDefine.HuType_ZiMo) {
            huNode.getComponent(cc.Label).string = '自摸';
        } else {
            huNode.getComponent(cc.Label).string = '';
        }
    },

    LabelName: function LabelName(huType) {
        return this.GetHuTypeDict()[huType];
    },

    // GetHuTypeDict -start-
    GetHuTypeDict: function GetHuTypeDict() {
        var huTypeDict = {};
        huTypeDict["MenQing"] = "门清";
        huTypeDict["ZiMo"] = "自摸加分";
        huTypeDict["QueMen"] = "缺门";
        huTypeDict["ChaJia"] = "掐张";
        huTypeDict["AnKa"] = "暗卡";
        huTypeDict["DDHu"] = "对对胡";
        huTypeDict["AnGang"] = "暗杠";
        huTypeDict["JieGang"] = "明杠";
        huTypeDict["Gang"] = "过路杠";
        huTypeDict["DianGang"] = "点杠";
        huTypeDict["HuaPai"] = "花牌";
        huTypeDict["XiaPao"] = "下跑";

        return huTypeDict;
    }
    // GetHuTypeDict -end-


});

cc._RF.pop();