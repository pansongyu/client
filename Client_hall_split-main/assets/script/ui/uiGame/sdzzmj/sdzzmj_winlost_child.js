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
        this.IntegrateImage = app.SysDataManager().GetTableDict("IntegrateImage");
        this.ShareDefine = app.ShareDefine();
    },
    UpdatePlayData: function (PlayerNode, HuList, PlayerInfo, jin1 = 0, jin2 = 0, zhuaNiaoList) {
        this.showLabelNum = 1;
        this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo, HuList);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
        this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacardscrollView'), HuList.huaList);
    },
    ShowPlayerInfo: function (ShowNode, PlayerInfo, HuList) {
        ShowNode.getChildByName('lable_name').getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"],PlayerInfo["name"]);
        ShowNode.getChildByName('label_id').getComponent("cc.Label").string = "ID:" + this.ComTool.GetPid(PlayerInfo["pid"]);

        //所属推广员ID
        if(ShowNode.getChildByName('label_upLevel')){
            if(HuList["upLevelId"] > 0){
                ShowNode.getChildByName('label_upLevel').getComponent("cc.Label").string = "所属推广员ID:" + HuList["upLevelId"];
            }else{
                ShowNode.getChildByName('label_upLevel').getComponent("cc.Label").string = "";
            }
        }
        ShowNode.getChildByName('ting').active = false;
        ShowNode.getChildByName('minglou').active = false;
        let tingType = HuList["tingType"];
        if (tingType == 1) {
            ShowNode.getChildByName('ting').active = true;
        } else if (tingType == 2) {
            ShowNode.getChildByName('minglou').active = true;
        }
    },
    ShowPlayerHuaCard: function (huacardscrollView, hualist) {
        huacardscrollView.active = true;
        // if (hualist.length > 0) {
        //     this.huaNum.active = true;
        //     this.huaNum.getComponent(cc.Label).string = hualist.length + "个";
        // }
        // else {
        //     this.huaNum.active = false;
        //     this.huaNum.getComponent(cc.Label).string = "";
        // }
        let view = huacardscrollView.getChildByName("view");
        let ShowNode = view.getChildByName("huacard");
        let UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowHua");
        UICard_ShowCard.ShowHuaList(hualist);
    },
    ShowPlayerRecord: function (ShowNode, huInfo) {
        let absNum = Math.abs(huInfo["point"]);
        if (absNum > 10000) {
            let shortNum = (absNum / 10000).toFixed(2);
            if (huInfo["point"] > 0) {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '+' + shortNum + "万";
            } else {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '-' + shortNum + "万";
            }
        } else {
            if (huInfo["point"] > 0) {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '+' + huInfo["point"];
            } else {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = huInfo["point"];
            }
        }
        //显示比赛分
        if (typeof (huInfo.sportsPointTemp) != "undefined") {
            ShowNode.getChildByName('tip_sportspoint').active = true;
            if (huInfo.sportsPointTemp > 0) {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = "+" + huInfo.sportsPointTemp;
            } else {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = huInfo.sportsPointTemp;
            }
        } else if (typeof (huInfo.sportsPoint) != "undefined") {
            ShowNode.getChildByName('tip_sportspoint').active = true;
            if (huInfo.sportsPoint > 0) {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = "+" + huInfo.sportsPoint;
            } else {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = huInfo.sportsPoint;
            }
        } else {
            ShowNode.getChildByName('tip_sportspoint').active = false;
        }
    },
    ShowPlayerHuImg: function (huNode, huTypeName) {
        /*huLbIcon
         *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
         *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
         */
        let huType = this.ShareDefine.HuTypeStringDict[huTypeName];
        //默认颜色描边
        huNode.color = new cc.Color(252, 236, 117);
        huNode.getComponent(cc.LabelOutline).color = new cc.Color(163, 61, 8);
        huNode.getComponent(cc.LabelOutline).Width = 2;
        if (typeof (huType) == "undefined") {
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
    ShowPlayerJieSuan: function (ShowNode, huInfoAll) {
        let huInfo = huInfoAll['endPoint'].huTypeMap;
        // this.ClearLabelShow(ShowNode.getChildByName('label_lists'));
        for (let huType in huInfo) {
            let huPoint = huInfo[huType];
            if (this.IsShowMulti2(huType) || this.IsShowNum(huType)) {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "x" + huPoint);
                // this.ShowLabelName(ShowNode.getChildByName("label_lists"), huTypeDict[huType] + "*2");
            } else {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
            }
            console.log("ShowPlayerJieSuan", huType, huPoint);
        }
    },
    //分数
    IsShowScore: function (huType) {
        let multi2 = [];
        let isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },
    //个数
    IsShowNum: function (huType) {
        let multi2 = ["ChiSanKou","AnGang","Gang","JieGang","Peng","ZiGang","Piao","Pao","La"];
        let isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },
    //倍数
    IsShowMulti2: function (huType) {
        let multi2 = ["ZhuangFan","QingYiSe","DDC","Long","TianHu","QD","QSSL","HK","GK","GSHK","GSGK","QiangGangHu"];		// 显示倍数胡类型
        let isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },
    LabelName: function (huType) {
        let huTypeDict = {
            QiangGangHu: "抢杠胡",
            GSGK: "杠上杠开",
            GSHK: "杠上花开",
            GK: "杠开",
            HK: "花开",
            QSSL: "十三不靠",
            QD: "七对",
            TianHu: "天胡",
            Long: "一条龙",
            DDC: "大吊车",
            QingYiSe: "清一色",
            ZhuangFan: "庄翻",

            ChiSanKou: "吃三口",
            AnGang: "暗杠",
            Gang: "补杠",
            JieGang: "接杠",
            Peng: "字碰",
            ZiGang: "字杠",
            Piao: "漂",
            Pao: "跑",
            La: "拉",

            ChaoZhuang: "跟庄分",
            PaoFen: "跑分",
            LaZhuangFen: "拉庄分",
            GangPoint: "杠分",
            HuaPoint: "花分",
            HuPoint: "胡分"
        };
        return huTypeDict[huType];
    },
});
