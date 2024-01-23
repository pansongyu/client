"use strict";
cc._RF.push(module, '3b45ce65yZBKKiwUutD+HUF', 'wxzmmj_winlost_child');
// script/ui/uiGame/wxzmmj/wxzmmj_winlost_child.js

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
        for (var huType in huInfo) {
            var huPoint = huInfo[huType];
            if (this.IsShowMulti2(huType)) {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "*2");
            } else {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
            }
            console.log("ShowPlayerJieSuan", huType);
        }
    },

    IsShowMulti2: function IsShowMulti2(huType) {
        var multi2 = [];
        var isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },

    LabelName: function LabelName(huType) {
        var huTypeDict = {};

        huTypeDict["PingHu"] = "平胡";
        huTypeDict["QYS"] = "清一色";
        huTypeDict["HYS"] = "混一色";
        huTypeDict["ZYS"] = "全风板";
        huTypeDict["QD"] = "七对子";
        huTypeDict["PPH"] = "碰碰胡";
        huTypeDict["MenQing"] = "门清";
        huTypeDict["HuaKai"] = "花开";
        huTypeDict["GangKai"] = "杠开";
        huTypeDict["QiangGangHu"] = "抢杠胡";
        huTypeDict["DDC"] = "大吊车";
        huTypeDict["HDL"] = "海底捞";
        huTypeDict["TianHu"] = "天胡";
        huTypeDict["PiaoFen"] = "飘分";
        huTypeDict["HuaFen"] = "花分";
        huTypeDict["GangFen"] = "杠分";
        huTypeDict["MaiMaFen"] = "买马分";

        if (!huTypeDict.hasOwnProperty(huType)) {
            console.error("huType = " + huType + "is not exist");
        }

        return huTypeDict[huType];
    }
});

cc._RF.pop();