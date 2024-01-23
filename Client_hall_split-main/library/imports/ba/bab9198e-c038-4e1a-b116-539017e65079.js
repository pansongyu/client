"use strict";
cc._RF.push(module, 'bab91mOwDhOGrEWU5AX5lB5', 'jnmj_winlost_child');
// script/ui/uiGame/jnmj/jnmj_winlost_child.js

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
        var LabelArray = {
            JieGang: "接杠",
            Gang: "杠",
            AnGang: "暗杠",
            PingHu: "平胡",
            TianHu: "天胡",
            PPHu: "碰碰胡",
            DDHu: "七小对",
            HDDHu: "豪华七小对",
            Long: "一条龙",
            SSY: "十三幺",
            GSKH: "杠上开花",
            MingLou: "明搂",
            ChengBao: "承包",
            Hua: "花数"
        };

        return LabelArray[huType];
    }

});

cc._RF.pop();