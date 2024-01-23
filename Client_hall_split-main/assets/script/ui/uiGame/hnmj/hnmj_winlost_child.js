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
        else {
            this.huaNum.active = false;
            this.huaNum.getComponent(cc.Label).string = "";
        }
        let view = huacardscrollView.getChildByName("view");
        let ShowNode = view.getChildByName("huacard");
        let UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowHua");
        UICard_ShowCard.Show24HuaList(hualist);

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
            huNode.getComponent(cc.Label).string = '胡牌';
        } else if (huType == this.ShareDefine.HuType_QGH) {
            huNode.getComponent(cc.Label).string = '抢杠胡';
        } else if (huType == this.ShareDefine.HuType_GSKH) {
            huNode.getComponent(cc.Label).string = '杠开';
        } else if (huType == this.ShareDefine.HuType_GangChong) {
            huNode.getComponent(cc.Label).string = '杠冲';
        } else {
            huNode.getComponent(cc.Label).string = '';
        }
    },
    LabelName:function(huType){
        let huTypeDict = {};
        huTypeDict["DiFen"]="底分";
        huTypeDict["ZhuangXian"]="庄闲";
        huTypeDict["LianZhuang"]="连庄";
        huTypeDict["DianPao"]="点炮";
        huTypeDict["ZiMoFanBei"]="自摸翻倍";
        huTypeDict["ShangGa"]="上嘎";
        huTypeDict["BaoPai"]="包牌";
        huTypeDict["PingHu"]="平胡";
        huTypeDict["PPHu"]="碰碰胡";
        huTypeDict["QYS"]="清一色";
        huTypeDict["QiDui"]="七对";
        huTypeDict["HaoHuaQiDui"]="豪华七对";
        huTypeDict["SSY"]="十三幺";
        huTypeDict["LaiZi"]="癞子";
        huTypeDict["ZhiChiBuPeng"]="只吃不碰";
        huTypeDict["MenQing"]="门清";
        huTypeDict["YouYan"]="有眼";
        huTypeDict["JianKePai"]="箭刻牌";
        huTypeDict["FengKePai"]="风刻牌";
        huTypeDict["LingPai"]="令牌";
        huTypeDict["HYS"]="混一色";
        huTypeDict["FanHuaDuiWei"]="翻花对位";
        huTypeDict["GSKH"]="杠上开花";
        huTypeDict["HSTH"]="花上添花";
        huTypeDict["TianHu"]="天胡";
        huTypeDict["DiHu"]="地胡";
        huTypeDict["HuaHu"]="花胡";
        huTypeDict["HuaHuZiMoFanBei"]="花胡自摸翻倍";
        huTypeDict["ZhiGang"]="直杠";
        huTypeDict["XuGang"]="续杠";
        huTypeDict["AnGang"]="暗杠";
        huTypeDict["QiHuaGang"]="七花杠";
        huTypeDict["BaHuaGang"]="八花杠";
        huTypeDict["FengDing"]="封顶";
        return huTypeDict[huType];
    },
    ShowPlayerJieSuan:function(ShowNode,huInfoAll){
        let huInfo=false;
        if(huInfoAll['endPoint']){
            huInfo=huInfoAll['endPoint'];
        }else{
            huInfo=huInfoAll;
        }
        let huTypeMap = huInfo.huTypeMap;
        for (let huType in huTypeMap) {
            let huPoint = huTypeMap[huType];
            if(huType == "DDC" || huType == "GHKH" || huType == "QGH" || huType == "GangChong" || huType == "TianHu" || huType == "QDDZD" || huType == "TianTing" || huType == "LZ" || huType == "HZHF" || huType == "MHGK"){
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "x2");
            }else{
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint); 
            }
        }
    },
});
