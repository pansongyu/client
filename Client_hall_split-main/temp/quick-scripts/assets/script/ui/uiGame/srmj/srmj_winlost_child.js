(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/srmj/srmj_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'dc242vmJilP/LVbiavcy0ig', 'srmj_winlost_child', __filename);
// script/ui/uiGame/srmj/srmj_winlost_child.js

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
        var huInfo = huInfoAll['huTypeMap'];
        // let huInfo = huInfoAll['endPoint'].huTypeMap;
        for (var huType in huInfo) {
            var huPoint = huInfo[huType];
            if (this.IsShowMulti(huType)) {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "*" + huPoint);
            } else {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
            }
            console.log("ShowPlayerJieSuan", huType);
        }
    },

    IsShowMulti: function IsShowMulti(huType) {
        var multi2 = [
            // "GSKH",     // "杠上开花";
            // "HYS",      // "混一色";
            // "QYS",      // "清一色";
            // "ZYS",      // "字一色";
            // "BD",       // "宝吊";
            // "BHY",      // "宝还原";
            // "DD",       // "单吊";
            // "MenQing",  // "门清";
            // "FeiBao",
        ];
        var isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },

    LabelName: function LabelName(huType) {
        var huTypeDict = {};

        huTypeDict["QSSL"] = "七星十三浪";
        huTypeDict["SSL"] = "十三浪";
        huTypeDict["SSY"] = "九幺";
        huTypeDict["HHJY"] = "豪华九幺";
        huTypeDict["QXJY"] = "七星九幺";
        huTypeDict["QYS"] = "清一色";
        huTypeDict["HYS"] = "混一色";
        huTypeDict["ZYS"] = "字一色";
        huTypeDict["DDHu"] = "七小对";
        huTypeDict["HDDHu"] = "豪华七对";
        huTypeDict["PPHu"] = "碰破胡";
        huTypeDict["DD"] = "单吊";
        huTypeDict["TianHu"] = "天胡";
        huTypeDict["DiHu"] = "地胡";
        huTypeDict["ZiMo"] = "自摸";
        huTypeDict["DianPao"] = "点炮";
        huTypeDict["JiePao"] = "接炮";
        huTypeDict["BDBHY"] = "宝吊宝还原";
        huTypeDict["BHY"] = "宝还原";
        huTypeDict["BD"] = "宝吊";
        huTypeDict["AnGang"] = "暗杠";
        huTypeDict["Gang"] = "补杠";
        huTypeDict["JieGang"] = "明杠";
        huTypeDict["PPHu"] = "碰碰胡";
        huTypeDict["MenQing"] = "门清";
        huTypeDict["FB"] = "飞宝";
        huTypeDict["SiBao"] = "四宝飞龙";
        huTypeDict["GSKH"] = "杠上开花";
        huTypeDict["GB"] = "杠宝";
        huTypeDict["FeiBao"] = "飞宝";
        huTypeDict["JYSPPH"] = "碰碰胡九幺";
        huTypeDict["CCHDDHu"] = "七对九幺";
        huTypeDict["DianGang"] = "点杠";
        huTypeDict["JieGang"] = "接杠";
        huTypeDict["QGH"] = "抢杠胡";
        huTypeDict["PingHu"] = "平胡";
        huTypeDict["WuJingHu"] = "无宝";

        if (!huTypeDict.hasOwnProperty(huType)) {
            console.error("huType = " + huType + " is not exist");
        }

        return huTypeDict[huType];
    }
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
        //# sourceMappingURL=srmj_winlost_child.js.map
        