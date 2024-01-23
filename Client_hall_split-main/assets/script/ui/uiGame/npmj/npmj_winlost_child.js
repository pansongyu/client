/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
    extends: require("BaseMJ_winlost_child"),

    properties: {
    },

    // use this for initialization
    OnLoad: function () {
        this.ComTool = app.ComTool();
        this.ShareDefine = app.ShareDefine();
    },
    ShowPlayerHuImg: function (huNode, huTypeName) {
        /*huLbIcon
        *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
        *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
        */
        let huType = this.ShareDefine.HuTypeStringDict[huTypeName];
        if (typeof (huType) == "undefined") {
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
    LabelName: function (huType) {
        let LabelArray = {};

        LabelArray["DDHu"] = "七小对";
        LabelArray["QDHu"] = "七大对";
        LabelArray["QYS"] = "清一色";
        LabelArray["DD"] = "单吊";
        LabelArray["TianHu"] = "天胡";
        LabelArray["DiHu"] = "地胡";
        LabelArray["ZiMo"] = "自摸";
        LabelArray["DianPao"] = "点炮";
        LabelArray["JiePao"] = "接炮";
        LabelArray["AnGang"] = "暗杠";
        LabelArray["Gang"] = "补杠";
        LabelArray["JieGang"] = "明杠";
        LabelArray["FB"] = "分饼";
        LabelArray["HDLY"] = "海底捞月";
        LabelArray["QGH"] = "抢杠胡";

        if (!LabelArray.hasOwnProperty(huType)) {
            console.error("huType = " + huType + "is not exist");
        }

        return LabelArray[huType];
    },
});
