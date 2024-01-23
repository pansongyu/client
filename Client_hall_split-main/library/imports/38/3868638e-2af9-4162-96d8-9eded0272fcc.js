"use strict";
cc._RF.push(module, '38686OOKvlBYpbYnt7QJy/M', 'hbyxmj_winlost_child');
// script/ui/uiGame/hbyxmj/hbyxmj_winlost_child.js

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
    ShowPlayerJieSuan: function ShowPlayerJieSuan(ShowNode, huInfoAll) {
        var huInfo = huInfoAll['endPoint'].huTypeMap;
        for (var huType in huInfo) {
            var huPoint = huInfo[huType];
            var str = this.LabelName(huType) + "： " + huPoint;
            if ("ChiLiang" == huType) {
                str = this.LabelName(huType).replace("#", huPoint + "");
            }

            this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + "： " + huPoint);
            console.log("ShowPlayerJieSuan", huType, huPoint);
        }
    },
    LabelName: function LabelName(huType) {
        var LabelArray = {
            Hu: "平胡",
            PH: "屁胡",
            QD: " 七对",
            GP: "杠牌",
            QJQD: "清金七对",
            HDLY: "海底捞月",
            GSKH: "杠上开花",
            QGH: "抢杠胡",
            QYS: "清一色",
            PPH: " 碰碰胡",
            JYS: " 将一色",
            MZ: "门子",
            LZFB: "亮中发白",
            DLZ: "打赖子",
            CPG3: "吃碰杠三手以上",
            ChiLiang: "亮#手",
            HHDDHu: "豪华七对",
            TWOHHDDHu: "超豪华七对",
            THREEHHDDHu: "超超豪华七对",
            SSKFF: "三四口翻番",
            YH: "硬胡",
            GLZ: "杠癩子",
            PLZ: "碰癩子",
            MG: "明杠",
            AG: "暗杠"

        };

        return LabelArray[huType];
    }
    //   LabelName:function(huType){
    //         let LabelArray=[];
    //         LabelArray['Hu']='胡';
    //         LabelArray['DGQD']='德国七对';
    //         LabelArray['DBQD']='带宝七对';
    //         LabelArray['DGQXSSL']='德国七星十三烂';
    //         LabelArray['DBQXSSL']='带宝七星十三烂';
    //         LabelArray['DGSSL']='德国十三烂';
    //         LabelArray['DBSSL']='带宝十三烂';
    //         LabelArray['PTDD']='普通单吊';
    //         LabelArray['DBPH']='带宝平胡';
    //         LabelArray['DGPH']='德国平胡';
    //         LabelArray['DDPPH']='单吊碰碰胡';
    //         LabelArray['BPDD']='宝牌单吊';
    //         LabelArray['DGPPH']='德国碰碰胡';
    //         LabelArray['DBPPH']='带宝碰碰胡';
    //         LabelArray['TIANHU']='天胡';
    //         LabelArray['DIHU']='地胡';
    //         LabelArray['GSKH']='杠上开花';
    //         LabelArray['QGH']='抢杠胡';
    //         LabelArray['FB']='飞宝';
    //         LabelArray['SBFL']='四宝飞龙';
    //         return LabelArray[huType];
    //   },
});

cc._RF.pop();