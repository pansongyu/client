"use strict";
cc._RF.push(module, 'bc24fZGUBZO1YGVZv66Xxgf', 'npgzmj_winlost_child');
// script/ui/uiGame/npgzmj/npgzmj_winlost_child.js

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

    ShowPlayerData: function ShowPlayerData(setEnd, playerAll, index) {
        console.log("单局结算数据", setEnd, playerAll, index);
        var jin1 = setEnd.jin;
        var jin2 = 0;
        if (setEnd.jin2 > 0) {
            jin2 = setEnd.jin2;
        }
        var dPos = setEnd.dPos;
        var posResultList = setEnd["posResultList"];
        var posHuArray = new Array();
        var posCount = posResultList.length;
        for (var i = 0; i < posCount; i++) {
            var posInfo = posResultList[i];
            var pos = posInfo["pos"];
            var posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
            posHuArray[pos] = posHuType;
        }
        var PlayerInfo = playerAll[index];
        this.node.active = true;
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, setEnd);
        var huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
        this.ShowPlayerHuImg(huNode, posResultList[index]['huType']);

        if (dPos === index) {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
        } else {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
        }
        //显示头像，如果头像UI
        if (PlayerInfo["pid"] && PlayerInfo["iconUrl"]) {
            app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"], PlayerInfo["iconUrl"]);
        }
        var weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
    },

    UpdatePlayData: function UpdatePlayData(PlayerNode, HuList, PlayerInfo) {
        var jin1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var jin2 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
        var setEnd = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

        this.showLabelNum = 1;
        this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
        //显示比赛分
        if (typeof HuList.sportsPointTemp != "undefined") {
            if (HuList.sportsPointTemp > 0) {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：+" + HuList.sportsPointTemp);
            } else {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：" + HuList.sportsPointTemp);
            }
        } else if (typeof HuList.sportsPoint != "undefined") {
            if (HuList.sportsPoint > 0) {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：+" + HuList.sportsPoint);
            } else {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：" + HuList.sportsPoint);
            }
        }
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);

        var wanFa = setEnd.fanPai.wanFa;
        if (wanFa == 0) {
            // 扎码159
            this.ShowPlayerZhongMaCard(PlayerNode.getChildByName('zhongma'), HuList.maCardList);
        } else {
            // 扎码押注
            this.ShowPlayerYaZhuList(PlayerNode, HuList.yaZhuList);
        }
    },

    ShowPlayerZhongMaCard: function ShowPlayerZhongMaCard(ShowNode, maCardList) {
        this.node.getChildByName('zhongma').active = true;
        this.node.getChildByName('huacard').active = false;
        this.node.getChildByName('yazhu').active = false;

        if (maCardList.length == 0) {
            ShowNode.active = false;
            return;
        }
        ShowNode.active = 1;
        var UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowHua");
        UICard_ShowCard.ShowZhongMaList(maCardList);
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
    ClearYaZhuLabelShow: function ClearYaZhuLabelShow(yaZhuNode) {
        for (var i = 0; i < 4; i++) {
            yaZhuNode.getChildByName("label_" + i.toString()).getComponent(cc.Label).string = '';
        }
    },
    ShowPlayerYaZhuList: function ShowPlayerYaZhuList(PlayerNode, yaZhuList) {
        PlayerNode.getChildByName('zhongma').active = false;
        PlayerNode.getChildByName('huacard').active = false;

        var yaZhuNode = PlayerNode.getChildByName('yazhu');
        yaZhuNode.active = true;
        this.ClearYaZhuLabelShow(yaZhuNode);
        for (var idx = 0; idx < yaZhuList.length; idx++) {
            var yaZhuInfo = yaZhuList[idx];
            var lb = yaZhuNode.getChildByName("label_" + idx);
            lb.getComponent(cc.Label).string = yaZhuInfo.pName + ": " + yaZhuInfo.yaPoint;
        }
    },
    ShowPlayerRecord: function ShowPlayerRecord(ShowNode, huInfo) {
        // let absNum = Math.abs(huInfo["point"]);
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
    },
    LabelName: function LabelName(huType) {
        var LabelArray = [];
        LabelArray["ShouZhuaYi"] = "单吊";
        LabelArray["PPHu"] = "大对碰";
        LabelArray["DaSanYuan"] = "大三元";
        LabelArray["QDHu"] = "七小对";
        LabelArray["HDDHu"] = "豪华七对";
        LabelArray["TianHu"] = "天胡";
        LabelArray["DiHu"] = "地胡";
        LabelArray["QGH"] = "抢杠胡";
        LabelArray["JiePao"] = "接炮";
        LabelArray["DianGang"] = "点杠";
        LabelArray["DianPao"] = "点炮";
        LabelArray["ZiMo"] = "自摸";
        LabelArray["QYS"] = "清一色";
        LabelArray["QYSQG"] = "清一色抢杠";
        LabelArray["QYSDDP"] = "清一色大对碰";
        LabelArray["QYSQD"] = "清一色七对";
        LabelArray["QYSDD"] = "清一色单吊";
        LabelArray["QYSHDDHu"] = "清一色豪华七对";
        LabelArray["QYSDSY"] = "清一色大三元";
        LabelArray["zhongMaCount"] = "中码计数";
        LabelArray["AnGang"] = "暗杠";
        LabelArray["Gang"] = "接杠";
        LabelArray["JieGang"] = "加杠";
        LabelArray["QYSPPH"] = "清一色大对碰";

        if (!LabelArray.hasOwnProperty(huType)) {
            console.error("huType = " + huType + "is not exist!");
        }

        return LabelArray[huType];
    }
});

cc._RF.pop();