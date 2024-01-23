(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/ygmj/ygmj_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8da35Nm+P5LUJhDwcGVfDwt', 'ygmj_winlost_child', __filename);
// script/ui/uiGame/ygmj/ygmj_winlost_child.js

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
        LabelArray['DGQD'] = '德国七对';
        LabelArray['DBQD'] = '带宝七对';
        LabelArray['DGQXSSL'] = '德国七星十三烂';
        LabelArray['DBQXSSL'] = '带宝七星十三烂';
        LabelArray['DGSSL'] = '德国十三烂';
        LabelArray['DBSSL'] = '带宝十三烂';
        LabelArray['PTDD'] = '普通单吊';
        LabelArray['DBPH'] = '带宝平胡';
        LabelArray['DGPH'] = '德国平胡';
        LabelArray['DDPPH'] = '德国单吊碰碰胡';
        LabelArray['BPDD'] = '宝牌单吊';
        LabelArray['DGPPH'] = '德国碰碰胡';
        LabelArray['DBPPH'] = '带宝碰碰胡';
        LabelArray['TIANHU'] = '天胡';
        LabelArray['DIHU'] = '地胡';
        LabelArray['GSKH'] = '杠上开花';
        LabelArray['QGH'] = '抢杠胡';
        LabelArray['FB'] = '飞宝';
        LabelArray['SBFL'] = '四宝飞龙';
        LabelArray['FaFen'] = '罚分';
        LabelArray['GF'] = '杠分';
        LabelArray['DBDDPPH'] = '带宝单吊碰碰胡';
        LabelArray['DBDD'] = '带宝单吊';
        return LabelArray[huType];
    },
    ShowPlayerJieSuan: function ShowPlayerJieSuan(ShowNode, huInfoAll) {
        var huInfo = huInfoAll['endPoint'].huTypeMap;
        for (var huType in huInfo) {
            var huPoint = huInfo[huType];
            var JB = huInfoAll['endPoint'].JB;
            if (huType == "FB" && typeof JB != "undefined") {
                this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + "： " + huPoint + "+" + JB);
            } else {
                this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + "： " + huPoint);
            }
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
        //# sourceMappingURL=ygmj_winlost_child.js.map
        