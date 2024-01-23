/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
    },
    // use this for initialization
    OnLoad: function () {
        this.ComTool = app.ComTool();
        this.IntegrateImage = app.SysDataManager().GetTableDict("IntegrateImage");
        this.ShareDefine=app.ShareDefine();
    },
    ShowPlayerData: function (setEnd, playerAll, index) {
        let jin1 = setEnd.jin;
        let jin2 = 0;
        if (setEnd.jin2 > 0) {
            jin2 = setEnd.jin2;
        }
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
        let zhuaNiaoList = setEnd["zhuaNiaoList"] || [];
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, zhuaNiaoList);
        let huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
        this.ShowPlayerHuImg(huNode, posResultList[index]['huType'], posResultList[index].isJiePao);

        if (dPos === index) {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
        } else {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
        }
        if (posResultList[index]['isTing']) {
            this.node.getChildByName("user_info").getChildByName("ting").active = true;
        } else {
            this.node.getChildByName("user_info").getChildByName("ting").active = false;
        }
        //显示头像，如果头像UI
        if (PlayerInfo["pid"] && PlayerInfo["iconUrl"]) {
            app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"], PlayerInfo["iconUrl"]);
        }
        let weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
    },
    UpdatePlayData:function(PlayerNode,HuList,PlayerInfo,jin1=0,jin2=0,zhuaNiaoList){
        this.MouseTypeDict = {
            0: "",
            1: "不碰",
            2: "大撇",
            3: "独刺",
            4: "独六",
        }
        this.showLabelNum=1;
        this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'),HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'),HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'),PlayerInfo);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'),HuList.publicCardList,jin1,jin2);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'),HuList.shouCard,HuList.handCard,jin1,jin2);
        // this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacardscrollView'),HuList.huaList);
        this.ShowPlayerHuaNum(PlayerNode.getChildByName('huanum'),HuList.huaNumber);
    },
    ShowPlayerHuaNum: function (huanum, huaNumber) {
        if(huaNumber == 0){
            huanum.getComponent(cc.Label).string = "";
        }else{
            huanum.getComponent(cc.Label).string = "风牌数:" + huaNumber;
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
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string =  "+" + huInfo.sportsPointTemp;
            } else {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string =  huInfo.sportsPointTemp;
            }
        }else if (typeof (huInfo.sportsPoint) != "undefined") {
            ShowNode.getChildByName('tip_sportspoint').active = true;
            if (huInfo.sportsPoint > 0) {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string =  "+" + huInfo.sportsPoint;
            } else {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string =  huInfo.sportsPoint;
            }
        }else{
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
    ShowPlayerJieSuan:function(ShowNode,huInfoAll){
        //下嘴
        let mouseTypeList = huInfoAll["mouseTypeList"];
        let mouseStr = "";
        let kgStr = " ";
        for (let i = 0; i < mouseTypeList.length; i++) {
            if(i == mouseTypeList.length - 1){
                kgStr = "";
            }
            mouseStr = mouseStr + this.MouseTypeDict[mouseTypeList[i]] + kgStr;
        }
        if(mouseStr != ""){
            this.ShowLabelName(ShowNode.getChildByName("label_lists"), "[" + mouseStr + "]");
        }

        let huInfo=huInfoAll['endPoint'].huTypeMap;
        // this.ClearLabelShow(ShowNode.getChildByName('label_lists'));
        for (let huType in huInfo) {
            let huPoint = huInfo[huType];
            if (this.IsShowMulti2(huType)) {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "x" + huPoint);
                // this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "*2");
            } else if(this.IsShowNum(huType)){
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType));
            }else {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
            }
            console.log("ShowPlayerJieSuan", huType, huPoint);
        }
    },
    //分数
    IsShowScore: function (huType) {
        let multi2 = [ 
        ];
        let isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },
    //个数
    IsShowNum: function (huType) {
        let multi2 = [
            "ZiMo", //  
            "FangTing", //
            "HaoHuaQiDui",  //
            "QiDui",    //
            "QingYiSe", //
            "NeiJue",   //
            "DaPengHu", //
        ];
        let isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },
    //倍数
    IsShowMulti2: function (huType) {
        let multi2 = [
            "HuPoint",  //
        ];
        let isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },
    LabelName:function(huType){
        let huTypeDict = {
            QGHu: "抢杠胡",
            GSKH: "杠上开花",
            ZiMo: "自摸",
            FangTing: "放听",
            DuZhang: "绝张",
            QiDui: "七对",
            QingYiSe: "清一色",
            NeiJue: "内绝",
            DaPengHu: "大碰胡",
            BuPeng: "不碰",
            DaPei: "大撇",
            DuCi: "独刺",
            DuLiu: "独六",
            HuPai: "胡牌",
            ZhuangJia: "庄家",
            FengPai: "风牌",
            JinFeng: "劲风",
            MingGang: "明杠",
            AnGang: "暗杠",
            HuPoint: "胡牌和",
        };
        return huTypeDict[huType];
    },
});
