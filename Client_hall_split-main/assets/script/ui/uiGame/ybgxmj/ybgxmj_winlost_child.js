/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
    extends: require("BaseMJ_winlost_child"),

    properties: {},

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
        if (typeof(huType) == "undefined") {
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
    ShowPlayerData: function (setEnd, playerAll, index) {
        let jin1 = setEnd.jin1;
        let jin2 = setEnd.jin2;
        let dPos = setEnd.dPos;
        let posResultList = setEnd["posResultList"];
        let posHuArray = new Array();
        let posCount = posResultList.length;
        for (let i = 0; i < posCount; i++) {
            let posInfo = posResultList[i];
            let pos = posInfo["pos"];
            let posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
            posHuArray[pos] = posHuType;
        }
        let PlayerInfo = playerAll[index];
        this.node.active = true;
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2);
        let huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
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
        let weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
    },
    ShowPlayerJieSuan: function (ShowNode, huInfoAll) {
        let huInfo = huInfoAll['endPoint'];
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
        let huTypeList = huInfo.huTypeMap;
        for (let key in huTypeList) {
            this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(key) + ":" + huTypeList[key].toString());
        }
        // for (let huType in huInfo) {
        //     let huPoint = huInfo[huType];
        //     this.ShowLabelName(ShowNode.getChildByName('label_lists'),this.LabelName(huType)+"： "+huPoint);
        //     console.log("ShowPlayerJieSuan", huType, huPoint);
        // }
    },
    LabelName: function (huType) {
        let huTypeDict = {
            PingHu: "平胡",
            PPHu: "大对子",
            QD: "小七对",
            DiHu: "地胡",
            QYS: "清一色",
            JGD: "金钩钓",
            TianHu: "天胡",
            LQD: "龙七对",
            QDD: "清大对",
            QQD: "清七对",
            QLQD: "清龙七对",

            MengQing: "门清",
            Gui: "归",
            ZiMo: "自摸",
            GSKH: "杠上花",
            GSP: "杠上炮",
            JGP: "金钩炮",
            QiangGangHu: "抢杠胡",
            HDP: "海底炮",
            HDL: "海底捞",
            MQDDH: "门清对对胡",
            PiaoFen: "飘分",

            Piao: "飘",
            HuPoint: "胡分",
        };
        return huTypeDict[huType];
    },
});
