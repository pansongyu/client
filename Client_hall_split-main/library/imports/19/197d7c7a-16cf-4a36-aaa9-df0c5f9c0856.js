"use strict";
cc._RF.push(module, '197d7x6Fs9KNqqp3wxfnAhW', 'lpmj_winlost_child');
// script/ui/uiGame/lpmj/lpmj_winlost_child.js

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
    LabelName: function LabelName(huType) {
        var LabelArray = [];
        LabelArray['SPHZ'] = '四牌黄庄';
        LabelArray['HZ'] = '黄庄';
        LabelArray['PingHu'] = '平胡';
        LabelArray['SSL'] = '十三烂';
        LabelArray['QSSL'] = '七星十三烂';
        LabelArray['DDHu'] = ' 对对胡';
        LabelArray['ZYS'] = '字一色';
        LabelArray['PPHu'] = '碰碰胡';
        LabelArray['HYS'] = '混一色';
        LabelArray['QYS'] = '清一色';
        LabelArray['TianHu'] = '天胡';
        LabelArray['QGH'] = '抢杠胡';
        LabelArray['FeiBao'] = '飞宝';
        LabelArray['SiBao'] = '四宝';
        LabelArray['DiHu'] = '地胡';
        LabelArray['GSKH'] = '杠上开花';

        return LabelArray[huType];
    }
});

cc._RF.pop();