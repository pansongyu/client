"use strict";
cc._RF.push(module, '45e1fbay6BLA607hMUyk0Hg', 'ndmj_winlost_child');
// script/ui/uiGame/ndmj/ndmj_winlost_child.js

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
        } else if (huType == this.ShareDefine.HuType_QGH) {
            huNode.getComponent(cc.Label).string = '抢杆胡';
        } else if (huType == this.ShareDefine.OpType_JinGang) {
            huNode.getComponent(cc.Label).string = '金杠';
        } else if (huType == this.ShareDefine.OpType_JinLong) {
            huNode.getComponent(cc.Label).string = '金龙';
        } else if (huType == this.ShareDefine.OpType_JinQue) {
            huNode.getComponent(cc.Label).string = '金雀';
        } else if (huType == this.ShareDefine.OpType_QingYiSe) {
            huNode.getComponent(cc.Label).string = '清一色';
        } else if (huType == this.ShareDefine.OpType_DDHu) {
            huNode.getComponent(cc.Label).string = '七对';
        } else if (huType == this.ShareDefine.OpType_DanDiao) {
            huNode.getComponent(cc.Label).string = '单吊';
        } else if (huType == this.ShareDefine.OpType_SanJinDao) {
            huNode.getComponent(cc.Label).string = '三金倒';
        } else if (huType == this.ShareDefine.OpType_SiJinDao) {
            huNode.getComponent(cc.Label).string = '四金倒';
        } else {
            huNode.getComponent(cc.Label).string = '';
        }
    },
    LabelName: function LabelName(huType) {
        var LabelArray = [];
        LabelArray['Hu'] = '平胡';
        LabelArray['JieGang'] = '明杠';
        LabelArray['Gang'] = '补杠';
        LabelArray['AnGang'] = '暗杠';
        LabelArray['QYS'] = '清一色';
        LabelArray['TianHu'] = '天胡';
        LabelArray['ZiMo'] = '自摸';
        LabelArray['QGH'] = '抢杠胡';
        LabelArray['JinGang'] = '金杠';
        LabelArray['JinLong'] = '金龙';
        LabelArray['JinQue'] = '金雀';
        LabelArray['SanJinDao'] = '三金到';
        LabelArray['Jin'] = '金番';
        LabelArray['DiHu'] = '地胡';
        LabelArray['DiFen'] = '底分';
        LabelArray['LianZhuang'] = '连庄';
        LabelArray['SiJinDao'] = '四金倒';
        LabelArray['DDHu'] = '对对胡';
        LabelArray['PaoHu'] = '炮胡';
        LabelArray['DD'] = '单吊';
        return LabelArray[huType];
    }
});

cc._RF.pop();