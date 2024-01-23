"use strict";
cc._RF.push(module, '8cc8dU49Z9OU7jrJTbRzkGg', 'ycmj_winlost_child');
// script/ui/uiGame/ycmj/ycmj_winlost_child.js

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
        var huInfo = huInfoAll['endPoint'];
        if (huInfo.anGangPoint > 0) {
            this.ShowLabelName(ShowNode.getChildByName('label_lists'), "暗杠：+" + huInfo.anGangPoint.toString());
        }
        if (huInfo.gangPoint > 0) {
            this.ShowLabelName(ShowNode.getChildByName('label_lists'), "补杠：+" + huInfo.gangPoint.toString());
        }
        if (huInfo.jieGangPoint > 0) {
            this.ShowLabelName(ShowNode.getChildByName('label_lists'), "明杠：+" + huInfo.jieGangPoint.toString());
        }
        if (huInfo.huPoint > 0) {
            this.ShowLabelName(ShowNode.getChildByName('label_lists'), "胡：+" + huInfo.huPoint.toString());
        }
        if (huInfo.piaoFenPoint > 0) {
            this.ShowLabelName(ShowNode.getChildByName('label_lists'), "漂分：+" + huInfo.piaoFenPoint.toString());
        }
        if (huInfo.shangHuoPoint > 0) {
            this.ShowLabelName(ShowNode.getChildByName('label_lists'), "买X" + huInfo.shangHuoPoint.toString());
        }
        var huTypeList = huInfo.huTypeList;
        for (var i = 0; i < huTypeList.length; i++) {
            this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huTypeList[i]));
        }
        // for (let huType in huInfo) {
        //     let huPoint = huInfo[huType];
        //     this.ShowLabelName(ShowNode.getChildByName('label_lists'),this.LabelName(huType)+"： "+huPoint);
        //     console.log("ShowPlayerJieSuan", huType, huPoint);
        // }
    },
    LabelName: function LabelName(huType) {
        var huTypeDict = {
            GenPai: "跟牌",
            Gang: "补杠",
            AnGang: "暗杠",
            JieGang: "直杠",
            HU: "平胡",
            DDHU: "七对",
            HDDHU: "豪华七小对",
            CHDDHU: "超级豪华对对胡",
            CCHDDHU: "超超级豪华对对胡",
            PPHU: "碰碰胡",
            SSL: "十三烂",
            QXSSL: "七星十三烂",
            MQ: " 门清",
            QYS: "清一色",
            ZYS: "字一色",
            TIANHU: "天胡",
            DIHU: " 地胡",
            QQR: "全求人",
            QGHU: "抢杠胡",
            GSKH: "杠上开花",
            GSP: "杠上炮"
        };
        return huTypeDict[huType];
    }
});

cc._RF.pop();