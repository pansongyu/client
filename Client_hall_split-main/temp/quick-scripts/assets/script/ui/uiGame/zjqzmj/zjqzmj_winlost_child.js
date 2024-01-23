(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/zjqzmj/zjqzmj_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '69ab2foy5hGmbTxfSmLxiHa', 'zjqzmj_winlost_child', __filename);
// script/ui/uiGame/zjqzmj/zjqzmj_winlost_child.js

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
            if (huPoint == 0) {
                this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType));
            } else {
                this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + "： " + huPoint);
            }
            console.log("ShowPlayerJieSuan", huType, huPoint);
        }
    },
    LabelName: function LabelName(huType) {
        var LabelArray = [];
        LabelArray["Hu"] = "屁胡";
        LabelArray["TianHu"] = "天胡";
        LabelArray["SSBK_Qing"] = "七风正不搭";
        LabelArray["SSBK"] = "正不搭";
        LabelArray["QYS"] = "清一色";
        LabelArray["PPHU"] = "大碰胡";
        LabelArray["HYS_PPHU"] = "混碰";
        LabelArray["QYS_PPHU"] = "清碰";

        LabelArray["HYS"] = "混一色";
        LabelArray["DDHU"] = "七对子";
        LabelArray["HYS_DDHU"] = "混七对";
        LabelArray["QYS_DDHU"] = "清七对";
        LabelArray["BFZ"] = "半风字";

        LabelArray["QFZ_PPHU"] = "全风字大碰胡";
        LabelArray["QFZ_DDHU"] = "全风字七对子";
        LabelArray["SanJinDao"] = "三财";
        LabelArray["QFD"] = "七风倒";
        LabelArray["QGH"] = "抢杠胡";
        LabelArray["GSKH"] = "杠上开花";
        LabelArray["HDLY"] = "海底捞月";

        LabelArray["DiHu"] = "地胡";
        LabelArray["DanDiao"] = "单吊";
        LabelArray["LiuJu"] = "流局";
        LabelArray["YCJY"] = "有财减一";
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
        //# sourceMappingURL=zjqzmj_winlost_child.js.map
        