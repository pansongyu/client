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
            huNode.getComponent(cc.Label).string = '点炮';
        } else if (huType == this.ShareDefine.HuType_JiePao) {
            huNode.getComponent(cc.Label).string = '接炮';
        } else if (huType == this.ShareDefine.HuType_ZiMo) {
            huNode.getComponent(cc.Label).string = '自摸';
        } else {
            huNode.getComponent(cc.Label).string = '';
        }
    },

    LabelName: function (huType) {
        return this.GetHuTypeDict()[huType];
    },

    // GetHuTypeDict -start-
    GetHuTypeDict: function () {
        let huTypeDict = {};
        huTypeDict["PingHu"] = "平胡";
        huTypeDict["MenQing"] = "门清";
        huTypeDict["QingYiSe"] = "清一色";
        huTypeDict["QiQiaoDui"] = "七巧对";
        huTypeDict["DaDduiPeng"] = "大对碰";
        huTypeDict["LongQiDui"] = "龙七对";
        huTypeDict["MenQingQingYiSe"] = "门清清一色";
        huTypeDict["QingYiSeDaDduiPeng"] = "清一色大对碰";
        huTypeDict["QingYiSeQiQiaoDui"] = "清一色七巧对";
        huTypeDict["QingYiSeLongQiDui"] = "清一色龙七对";
        huTypeDict["MenQingQingYiSeDaDduiPeng"] = "门清清一色大对碰";
        huTypeDict["AnGangShu"] = "暗杠数";
        huTypeDict["PengGangShu"] = "碰杠数";
        huTypeDict["ZhiGangShu"] = "直杠数";
        huTypeDict["DianGangShu"] = "点杠数";
        huTypeDict["Chui"] = "锤";
        huTypeDict["ZhongNiao"] = "中鸟";

        return huTypeDict;
    },
    // GetHuTypeDict -end-


});
