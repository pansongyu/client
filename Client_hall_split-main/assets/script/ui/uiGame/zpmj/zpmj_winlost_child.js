/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
        huaNum:cc.Node,
    },

	// use this for initialization
	OnLoad: function () {
		this.ComTool = app.ComTool();
        this.ShareDefine=app.ShareDefine();
	},
    UpdatePlayData:function(PlayerNode,HuList,PlayerInfo,jin1=0,jin2=0,maPaiLst = null){
        this.showLabelNum=1;
        this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
        //显示比赛分
        if (typeof(HuList.sportsPoint)!="undefined") {
            if (HuList.sportsPoint > 0) {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'),"比赛分：+"+HuList.sportsPoint);
            }else{
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'),"比赛分："+HuList.sportsPoint);
            }
        }
        this.huaNum.active = false;
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'),HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'),HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'),PlayerInfo);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'),HuList.publicCardList);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'),HuList.shouCard,HuList.handCard,jin1,jin2);
        // this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'),HuList.huaList);
        this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacardscrollView'),HuList.huaList);
    },
    ShowPlayerHuaCard: function (huacardscrollView, hualist) {
        huacardscrollView.active = true;
        if (hualist.length > 0) {
            this.huaNum.active = true;
            this.huaNum.getComponent(cc.Label).string = hualist.length + "个";
        }
        let view = huacardscrollView.getChildByName("view");
        let ShowNode = view.getChildByName("huacard");
        let UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowHua");
        UICard_ShowCard.ShowHuaList(hualist);

    },
    LabelName:function(huType){
        let huTypeDict = {
            TianTing:"天听",
            TianHu:"天胡",
            DaSanYuan:"大三元",
            XiaoSanYuan:"小三元",
            DaSiXi:"大四喜",
            XiaoSiXi:"小四喜",
            SanAnKe:"三暗刻",
            SiAnKe:"四暗刻",
            WuAnKe:"五暗刻",
            HYS:"混一色",
            HuaYS:"花一色",
            MenQianQing:"门前清",
            PPH:"碰碰胡",
            WuHuaWuZi: "无花无字",
            BaiLiu:"百六",
            DanTing:"单听",
            GSKH:"杠上开花",
            BHZM:"补花自摸",
            HDL:"海底捞月",
            QuanQiuR:"全求人",
            QGH:"抢杠胡",
            Hu:"自摸",
            AnKe:"暗刻",
            MingKe:"明刻",
            Hua:"花",
            Zhuang:"庄",
            LianZhuang:"连庄",
            Gang:"补杠",
            AnGang:"暗杠",
            JieGang:"接杠",
            PingHu:"平胡",
            QYS:"清一色",
            ZiPai:"字牌",
            TotalTai:"总台数",
            DiFen:"底分",
        };
        return huTypeDict[huType];
    },
    ShowPlayerJieSuan:function(ShowNode,huInfoAll){
        let huInfo=false;
        if(huInfoAll['endPoint']){
            huInfo=huInfoAll['endPoint'];
        }else{
            huInfo=huInfoAll;
        }
        let lianZhuang = ShowNode.getChildByName('lianzhuang').getComponent(cc.Label);
        let zhuang = ShowNode.getChildByName('zhuang').getComponent(cc.Label);
        let difen = ShowNode.getChildByName('difen').getComponent(cc.Label);
        let zongtaishu = ShowNode.getChildByName('zongtaishu').getComponent(cc.Label);
        lianZhuang.string = "";
        zhuang.string = "";
        difen.string = "";
        zongtaishu.string = "";
        ShowNode.getChildByName('huawin').getComponent(cc.Label).string = "";
        let huTypeMap = huInfo.huTypeMap;
        for (let huType in huTypeMap) {
            let huPoint = huTypeMap[huType];
            if (huType == "LianZhuang") {
                lianZhuang.string = "连庄" + huPoint;
            } else if (huType == "Zhuang") {
                zhuang.string = "庄" + huPoint;
            }  else if (huType == "DiFen") {
                difen.string = this.LabelName(huType) + huPoint;
            }   else if (huType == "TotalTai") {
                zongtaishu.string = this.LabelName(huType) + huPoint;
            } else {
                this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + huPoint);   
            }
        }
        if (huInfoAll["zhongMaCount"] > 0) {
            ShowNode.getChildByName('huawin').getComponent(cc.Label).string = "抓花赢"+huInfoAll["zhongMaCount"]+"个";
        }
    },
});
