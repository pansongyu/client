(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/xyxmj/xyxmj_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '60ed3+yAhZB/LeR5N7NU1dp', 'xyxmj_winlost_child', __filename);
// script/ui/uiGame/xyxmj/xyxmj_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
    extends: require("BaseMJ_winlost_child"),

    properties: {
        huaNum: cc.Node
    },

    // use this for initialization
    OnLoad: function OnLoad() {
        this.ComTool = app.ComTool();
        this.ShareDefine = app.ShareDefine();
    },
    UpdatePlayData: function UpdatePlayData(PlayerNode, HuList, PlayerInfo) {
        var jin1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var jin2 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
        var maPaiLst = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

        this.showLabelNum = 1;
        this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
        //显示比赛分
        if (typeof HuList.sportsPoint != "undefined") {
            if (HuList.sportsPoint > 0) {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：+" + HuList.sportsPoint);
            } else {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：" + HuList.sportsPoint);
            }
        }
        this.huaNum.active = false;
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
        // this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'),HuList.huaList);
        this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacardscrollView'), HuList.huaList);
    },
    ShowPlayerHuaCard: function ShowPlayerHuaCard(huacardscrollView, hualist) {
        huacardscrollView.active = true;
        if (hualist.length > 0) {
            this.huaNum.active = true;
            this.huaNum.getComponent(cc.Label).string = hualist.length + "个";
        } else {
            this.huaNum.active = false;
            this.huaNum.getComponent(cc.Label).string = "";
        }
        var view = huacardscrollView.getChildByName("view");
        var ShowNode = view.getChildByName("huacard");
        var UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowHua");
        UICard_ShowCard.Show24HuaList(hualist);
    },
    ShowPlayerHuImg: function ShowPlayerHuImg(huNode, huTypeName) {
        /*huLbIcon
        *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
        *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
        */
        var huType = this.ShareDefine.HuTypeStringDict[huTypeName];
        //默认颜色描边
        huNode.color = new cc.Color(252, 236, 117);
        huNode.getComponent(cc.LabelOutline).color = new cc.Color(163, 61, 8);
        huNode.getComponent(cc.LabelOutline).Width = 2;
        if (typeof huType == "undefined") {
            huNode.getComponent(cc.Label).string = '';
        } else if (huType == this.ShareDefine.HuType_DianPao) {
            huNode.getComponent(cc.Label).string = '点炮';
            huNode.color = new cc.Color(192, 221, 245);
            huNode.getComponent(cc.LabelOutline).color = new cc.Color(31, 55, 127);
            huNode.getComponent(cc.LabelOutline).Width = 2;
        } else if (huType == this.ShareDefine.HuType_JiePao) {
            huNode.getComponent(cc.Label).string = '接炮';
        } else if (huType == this.ShareDefine.HuType_ZiMo) {
            huNode.getComponent(cc.Label).string = '自摸';
        } else if (huType == this.ShareDefine.HuType_QGH) {
            huNode.getComponent(cc.Label).string = '抢杠胡';
        } else if (huType == this.ShareDefine.HuType_GSKH) {
            huNode.getComponent(cc.Label).string = '杠开';
        } else {
            huNode.getComponent(cc.Label).string = '';
        }
    },
    LabelName: function LabelName(huType) {
        var LabelArray = [];
        LabelArray['Hu'] = '自摸';
        LabelArray['PH'] = '平胡';
        LabelArray['SJD'] = '三金倒';
        LabelArray['TH'] = '天胡';
        LabelArray['DY'] = '游金';
        LabelArray['SANY'] = '三游';
        LabelArray['SY'] = '双游';
        LabelArray['AG'] = '暗杠';
        LabelArray['QYSSanY'] = '清一色三游';
        LabelArray['QYSSY'] = '清一色双游';
        LabelArray['QYSDY'] = '清一色单游';
        LabelArray['MG'] = '明杠';
        LabelArray['YJ'] = '幺九';
        LabelArray['QYS'] = '清一色';
        LabelArray['DH'] = '地胡';
        LabelArray['DDH'] = '对对胡';
        LabelArray['QJ'] = '抢金';
        LabelArray['MGH'] = '明杠胡';
        LabelArray['AGH'] = '暗杠胡';
        LabelArray['QGH'] = '抢杠胡';
        LabelArray['BD'] = '不搭';
        LabelArray['QYSTH'] = '清一色天胡';
        LabelArray['QYSDH'] = '清一色地胡';
        LabelArray['QYSMGH'] = '清一色明杠胡';
        return LabelArray[huType];
    },
    ShowPlayerJieSuan: function ShowPlayerJieSuan(ShowNode, huInfoAll) {
        var huInfo = false;
        if (huInfoAll['endPoint']) {
            huInfo = huInfoAll['endPoint'];
        } else {
            huInfo = huInfoAll;
        }
        var huTypeMap = huInfo.huTypeMap;
        for (var huType in huTypeMap) {
            var huPoint = huTypeMap[huType];
            this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
        }
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
        //# sourceMappingURL=xyxmj_winlost_child.js.map
        