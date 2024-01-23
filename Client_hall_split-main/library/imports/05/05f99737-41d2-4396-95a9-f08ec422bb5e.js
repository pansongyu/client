"use strict";
cc._RF.push(module, '05f99c3QdJDlpWp8I7EIrte', 'zjmj_winlost_child');
// script/ui/uiGame/zjmj/zjmj_winlost_child.js

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
        LabelArray['Hu'] = '胡';
        LabelArray['HuPoint'] = '胡分';
        LabelArray['Gang'] = '补杠';
        LabelArray['JieGang'] = '明杠';
        LabelArray['AnGang'] = '暗杠';
        LabelArray['TouDa'] = '头搭';
        LabelArray['ErDa'] = '二搭';
        LabelArray['PengDa'] = '碰后搭';
        LabelArray['Tong'] = '打同牌分';
        LabelArray['Gen'] = '跟牌';
        LabelArray['ShuangShai'] = '双骰';
        LabelArray['LianZhuang'] = '连庄';
        LabelArray['BQGH'] = '被抢杠胡扣分';
        LabelArray['TuoDa'] = '脱搭';
        LabelArray['PaoDa'] = '跑搭';
        LabelArray['TDPD'] = '脱搭跑搭';
        LabelArray['PDTD'] = '跑搭脱搭';
        LabelArray['ZiMo'] = '自摸';
        LabelArray['PingHu'] = '点炮胡';
        LabelArray['QGH'] = '抢杠胡';
        LabelArray['WeiPai'] = '喂牌';
        LabelArray['ZGKG'] = '直杠杠开';
        LabelArray['WGKG'] = '弯杠杠开';
        LabelArray['AGKG'] = '暗杠杠开';
        LabelArray['TD'] = '脱搭';
        LabelArray['PD'] = '跑搭';
        LabelArray['TDP'] = '脱搭跑搭';
        LabelArray['PDT'] = '跑搭脱搭';
        LabelArray['PaoHu'] = '炮胡';
        LabelArray['GK'] = '杠开';
        return LabelArray[huType];
    }
});

cc._RF.pop();