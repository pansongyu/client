(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/xlqmj/xlqmj_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '18598ywT9BOG6BN48YeY6G5', 'xlqmj_winlost_child', __filename);
// script/ui/uiGame/xlqmj/xlqmj_winlost_child.js

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
        } else {
            huNode.getComponent(cc.Label).string = '';
        }
    },
    LabelName: function LabelName(huType) {
        var LabelArray = [];
        LabelArray['PiHu'] = '屁胡';
        LabelArray['QYS'] = '清一色';
        LabelArray['HYS'] = '混一色';
        LabelArray['PPHu'] = '对对胡';
        LabelArray['HDD'] = '混对对';
        LabelArray['QDD'] = '清对对';
        LabelArray['DDHu'] = '7对';
        LabelArray['DZ'] = '大字';
        LabelArray['HDLY'] = '海底捞月';
        LabelArray['GSKH'] = '杠上开花';
        LabelArray['DDC'] = '大吊车';
        LabelArray['QGHu'] = '抢杠胡';
        LabelArray['Hua'] = '花数';
        LabelArray['QXD'] = '七小对';
        LabelArray['HQD'] = '混七对';
        LabelArray['QQD'] = '清七对';

        return LabelArray[huType];
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
        //# sourceMappingURL=xlqmj_winlost_child.js.map
        