"use strict";
cc._RF.push(module, '75b3c6U3uhOfqOhe2jouCyp', 'pbyhmj_winlost_child');
// script/ui/uiGame/pbyhmj/pbyhmj_winlost_child.js

"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    ShowPlayerData: function ShowPlayerData(setEnd, playerAll, index) {
        var jin1 = setEnd.jin1;
        var jin2 = setEnd.jin2;
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
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2);
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
    ShowPlayerJieSuan: function ShowPlayerJieSuan(ShowNode, huInfoAll) {
        var huInfo = huInfoAll['endPoint'].huTypeMap;
        for (var huType in huInfo) {
            var huPoint = huInfo[huType];
            if (huType == "ZiMo") {
                continue;
            }
            this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + ":" + huPoint);
        }
    },
    LabelName: function LabelName(huType) {
        var _huTypeDict;

        var huTypeDict = (_huTypeDict = {
            PiaoJinFen: "飘精分",
            PiaoJinSize: "飘精数",
            Gang: "杠分",
            Hua: "花分",
            HongHuaSize: "红花",
            HeiHuaSize: "黑花"
        }, _defineProperty(_huTypeDict, "HongHuaSize", "红花"), _defineProperty(_huTypeDict, "HeiHuaSize", "黑花"), _defineProperty(_huTypeDict, "HongHuaSize", "红花"), _defineProperty(_huTypeDict, "HeiHuaSize", "黑花"), _defineProperty(_huTypeDict, "HuPoint", "胡分"), _defineProperty(_huTypeDict, "PiaoFen", "飘分"), _defineProperty(_huTypeDict, "PingHu", "平胡"), _defineProperty(_huTypeDict, "LangPai", "浪牌"), _defineProperty(_huTypeDict, "QuanYao", "全幺"), _defineProperty(_huTypeDict, "MenQing", "门清"), _defineProperty(_huTypeDict, "DianPao", "点炮"), _defineProperty(_huTypeDict, "QGH", "抢杠胡"), _defineProperty(_huTypeDict, "QiZiQuan", "七字全"), _defineProperty(_huTypeDict, "QuanZi", "全字"), _defineProperty(_huTypeDict, "WuJingHu", "无精胡"), _defineProperty(_huTypeDict, "JingHuanYuan", "精还原"), _defineProperty(_huTypeDict, "WuDangDiHu", "无当地胡"), _defineProperty(_huTypeDict, "PPHu", "碰碰胡"), _defineProperty(_huTypeDict, "MenQingPPHu", "门清碰碰胡"), _defineProperty(_huTypeDict, "QDHu", "七对胡"), _defineProperty(_huTypeDict, "QYS", "清一色"), _defineProperty(_huTypeDict, "TianHu", "天胡"), _defineProperty(_huTypeDict, "DiHu", "地胡"), _defineProperty(_huTypeDict, "WDGSKH", "无当杠上开花"), _defineProperty(_huTypeDict, "GSKH", "杠上开花"), _huTypeDict);
        return huTypeDict[huType];
    }
});

cc._RF.pop();