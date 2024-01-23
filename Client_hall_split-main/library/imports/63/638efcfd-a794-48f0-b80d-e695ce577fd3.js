"use strict";
cc._RF.push(module, '638efz9p5RI8LgN5pXOV3/T', 'hamj_winlost_child');
// script/ui/uiGame/hamj/hamj_winlost_child.js

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

    // Hua:"花数",
    // QYS:"清一色",
    // HYS:"混一色",
    // DDCHYS:"混一色独吊",
    // DDC:"大吊车",
    // DDHu: "对对胡",
    // DDH: "对对胡",
    // QD: "七对",
    // DMQ: "大门清",
    // XMQ: "小门清",
    // HYSXMQ: "混一色小门清",
    // DDCXMQ: "小门清独吊",
    // ZQJB: "真七假八",
    // SSY: "十三幺",
    // ZYS: "字一色",
    // // TH: "天胡",
    // TianHu: "天胡",
    // PingHu: "平胡",
    // PPHu: "碰碰胡",
    // DD: "独吊",

    LabelName: function LabelName(huType) {
        var LabelArray = [];
        LabelArray['Hua'] = '花数';
        LabelArray['QYS'] = '清一色';
        LabelArray['HYS'] = '混一色';
        LabelArray['DDCHYS'] = '混一色独吊';
        LabelArray['DDC'] = '大吊车';
        LabelArray['DDH'] = ' 对对胡';
        LabelArray['DDHu'] = ' 对对胡';
        LabelArray['QD'] = '七对';
        LabelArray['DMQ'] = '大门清';
        LabelArray['XMQ'] = '小门清';
        LabelArray['HYSXMQ'] = '混一色小门清';
        LabelArray['DDCXMQ'] = '小门清独吊';
        LabelArray['ZQJB'] = '真七假八';
        LabelArray['SSY'] = '十三幺';
        LabelArray['ZYS'] = '字一色';
        LabelArray['TianHu'] = '天胡';
        LabelArray['PingHu'] = '平胡';
        LabelArray['PPHu'] = '碰碰胡';
        LabelArray['DD'] = '独吊';

        return LabelArray[huType];
    }
    // LabelName:function(huType){
    //     let LabelArray=[];
    //     LabelArray['SPHZ']='四牌黄庄';
    //     LabelArray['HZ']='黄庄';
    //     LabelArray['PingHu']='平胡';
    //     LabelArray['SSL']='十三烂';
    //     LabelArray['QSSL']='七星十三烂';
    //     LabelArray['DDHu']=' 对对胡';
    //     LabelArray['ZYS']='字一色';
    //     LabelArray['PPHu']='碰碰胡';
    //     LabelArray['HYS']='混一色';
    //     LabelArray['QYS']='清一色';
    //     LabelArray['TianHu']='天胡';
    //     LabelArray['QGH']='抢杠胡';
    //     LabelArray['FeiBao']='飞宝';
    //     LabelArray['SiBao']='四宝';
    //     LabelArray['DiHu']='地胡';
    //     LabelArray['GSKH']='杠上开花';

    //     return LabelArray[huType];
    // },
});

cc._RF.pop();