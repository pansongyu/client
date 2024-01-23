"use strict";
cc._RF.push(module, '7abdeYrEMZAuqqvkaMAVA2p', 'wzmj_winlost_child');
// script/ui/uiGame/wzmj/wzmj_winlost_child.js

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
    ShowPlayerRecord: function ShowPlayerRecord(ShowNode, huInfo) {
        var absNum = Math.abs(huInfo["point"]);
        ShowNode.getChildByName('lb_record_win').active = false;
        ShowNode.getChildByName('lb_record_lost').active = false;
        if (absNum > 10000) {
            var shortNum = (absNum / 10000).toFixed(2);
            if (huInfo["point"] > 0) {
                ShowNode.getChildByName('lb_record_win').getComponent("cc.Label").string = '+' + shortNum + "万";
                ShowNode.getChildByName('lb_record_win').active = true;
            } else {
                ShowNode.getChildByName('lb_record_lost').getComponent("cc.Label").string = '-' + shortNum + "万";
                ShowNode.getChildByName('lb_record_lost').active = true;
            }
        } else {
            if (huInfo["point"] > 0) {
                ShowNode.getChildByName('lb_record_win').getComponent("cc.Label").string = '+' + huInfo["point"];
                ShowNode.getChildByName('lb_record_win').active = true;
            } else {
                ShowNode.getChildByName('lb_record_lost').getComponent("cc.Label").string = huInfo["point"];
                ShowNode.getChildByName('lb_record_lost').active = true;
            }
        }
        //显示比赛分
        if (typeof huInfo.sportsPoint != "undefined") {
            ShowNode.getChildByName('lb_record_win').active = false;
            ShowNode.getChildByName('lb_record_lost').active = false;
            if (huInfo.sportsPoint > 0) {
                ShowNode.getChildByName('lb_record_win').getComponent("cc.Label").string = '比赛分：+' + huInfo["sportsPoint"];
                ShowNode.getChildByName('lb_record_win').active = true;
            } else {
                ShowNode.getChildByName('lb_record_lost').getComponent("cc.Label").string = '比赛分：' + huInfo["sportsPoint"];
                ShowNode.getChildByName('lb_record_lost').active = true;
            }
        }
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
            huNode.getComponent(cc.Label).string = '抢杆胡';
        } else {
            huNode.getComponent(cc.Label).string = '';
        }
    },
    LabelName: function LabelName(huType) {
        var LabelArray = [];
        LabelArray['JieGang'] = '接杠';
        LabelArray['Gang'] = '补杠';
        LabelArray['JieGang'] = '明杠';
        LabelArray['AnGang'] = '暗杠';
        LabelArray['Hu'] = '胡';
        LabelArray['GangNum'] = '补杠数量';
        LabelArray['AnGangNum'] = '暗杠数量';
        LabelArray['QDHu'] = '七对胡';
        LabelArray['PPHu'] = '碰碰胡';
        LabelArray['SSL'] = '十三烂';
        LabelArray['QSSL'] = '清十三烂';
        LabelArray['QYS'] = '清一色';
        LabelArray['ZYS'] = '字一色';
        LabelArray['ZiMo'] = '自摸';
        LabelArray['PingHu'] = '平胡';
        LabelArray['TianHu'] = '天胡';
        LabelArray['DiHu'] = '地胡';
        LabelArray['QGH'] = '抢杠胡';
        LabelArray['QQR'] = '全求人';
        LabelArray['ShangHuo'] = '上火';
        LabelArray['PiaoFen'] = '漂分';
        return LabelArray[huType];
    }
});

cc._RF.pop();