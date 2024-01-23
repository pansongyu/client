"use strict";
cc._RF.push(module, '8347eqrgYtO+IvzXozaV6eR', 'za16mj_winlost_child');
// script/ui/uiGame/za16mj/za16mj_winlost_child.js

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
        } else if (huType == this.ShareDefine.HuType_QGH) {
            huNode.getComponent(cc.Label).string = '抢杠胡';
        } else {
            huNode.getComponent(cc.Label).string = '';
        }
    },
    LabelName: function LabelName(huType) {
        var LabelArray = [];
        LabelArray['PH'] = "平胡";
        LabelArray['ZM'] = "自摸";
        LabelArray['AG'] = "暗杠";
        LabelArray['MG'] = "明杠";
        LabelArray['QGH'] = "抢杠胡";
        LabelArray['HDLY'] = "海底捞月";
        LabelArray['QQR'] = "全求人";
        LabelArray['MQ'] = "门清";
        LabelArray['HYS'] = "混一色";
        LabelArray['DDH'] = "对对胡";
        LabelArray['QYS'] = "清一色";
        LabelArray['HYJ'] = "混幺九";
        LabelArray['GSKH'] = "杠上开花";
        LabelArray['TianHu'] = "天胡";
        LabelArray['DiHu'] = "地胡";
        LabelArray['TianTing'] = "天听";
        LabelArray['XSY'] = "小三元";
        LabelArray['DSY'] = "大三元";
        LabelArray['XSX'] = "小四喜";
        LabelArray['DSX'] = "大四喜";
        LabelArray['SanAK'] = "三暗刻";
        LabelArray['SiAK'] = "四暗刻";
        LabelArray['WAK'] = "五暗刻";
        LabelArray['ZP'] = "字牌";
        LabelArray['LZ'] = "连庄";
        LabelArray['CT'] = "插台分";
        LabelArray['DF'] = "底分";
        LabelArray['GSGSKH'] = "杠上杠开花";
        LabelArray['ZJ'] = "庄家";
        return LabelArray[huType];
    }
});

cc._RF.pop();