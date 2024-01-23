(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/smmj/smmj_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fa889I4qq9JMZEX6w23ZsPP', 'smmj_winlost_child', __filename);
// script/ui/uiGame/smmj/smmj_winlost_child.js

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
    LabelName: function LabelName(huType) {
        var _huTypeDict;

        var huTypeDict = (_huTypeDict = {
            FengQing: "风清",
            SanZha: " 三炸",
            ShuangZha: "双炸",
            ZhaQDHu: "炸七对",
            BanZi: " 搬子",
            PeiZi: "配子",
            PengBanZi: "碰搬子",
            AnGangPeiZi: " 暗杠配子",
            Gang: "补杠",
            AnGang: "暗杠",
            QYS: "清一色",
            TianHu: "天胡",
            QGH: "抢杠胡",
            DiHu: "地胡",
            JieGang: "明杠",
            HYS: "混一色",
            QDHu: "七对胡",
            DDHu: "对对胡",
            Hu: "胡",
            Long: "一条龙",
            HuPoint: "胡分",
            GSKH: "杠上开花",
            BQGH: "被抢杠胡",
            SanJinDao: "三金倒"
        }, _defineProperty(_huTypeDict, "JieGang", "接杠"), _defineProperty(_huTypeDict, "Gang", "补杠"), _defineProperty(_huTypeDict, "Jin", "金"), _defineProperty(_huTypeDict, "Hua", "花"), _defineProperty(_huTypeDict, "LianZhuang", "连庄"), _defineProperty(_huTypeDict, "ZiMo", "胡"), _defineProperty(_huTypeDict, "PingHu", "胡"), _defineProperty(_huTypeDict, "Difen", "底分"), _defineProperty(_huTypeDict, "JinLong", "金龙"), _defineProperty(_huTypeDict, "QingYiSe", "清一色"), _defineProperty(_huTypeDict, "WuShuiHu", "无水胡"), _defineProperty(_huTypeDict, "XianJin", "闲金"), _defineProperty(_huTypeDict, "SanJinDao", "三金倒"), _defineProperty(_huTypeDict, "JinKan", "金坎"), _defineProperty(_huTypeDict, "JinQue", "金雀"), _defineProperty(_huTypeDict, "DanYou", "闲金"), _huTypeDict);
        return huTypeDict[huType];
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=smmj_winlost_child.js.map
        