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
        this.ShareDefine=app.ShareDefine();
	},
  ShowPlayerHuImg:function(huNode,huTypeName){
        /*huLbIcon
        *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
        *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
        */
        let huType=this.ShareDefine.HuTypeStringDict[huTypeName];
        if(typeof(huType)=="undefined"){
            huNode.getComponent(cc.Label).string = '';
        }else if(huType == this.ShareDefine.HuType_DianPao){
            huNode.getComponent(cc.Label).string = '点泡';
        }else if(huType == this.ShareDefine.HuType_JiePao){
            huNode.getComponent(cc.Label).string = '接炮';
        }else if(huType == this.ShareDefine.HuType_ZiMo){
            huNode.getComponent(cc.Label).string = '自摸';
        }else if(huType == this.ShareDefine.HuType_QGH){
            huNode.getComponent(cc.Label).string = '抢杠胡';
        }else {
            huNode.getComponent(cc.Label).string = '';
        } 
  },
  LabelName:function(huType){
        let huTypeDict = {
            FengQing:"风清",
            SanZha:" 三炸",
            ShuangZha:"双炸",
            ZhaQDHu:"炸七对",
            BanZi:" 搬子",
            PeiZi:"配子",
            PengBanZi:"碰搬子",
            AnGangPeiZi:" 暗杠配子",
            Gang:"补杠",
            AnGang:"暗杠",
            QYS:"清一色",
            TianHu:"天胡",
            QGH:"抢杠胡",
            DiHu:"地胡",
            JieGang:"明杠",
            HYS:"混一色",
            QDHu:"七对胡",
            DDHu:"对对胡",
            Hu:"胡",
            Long:"一条龙",
            HuPoint:"胡分",
            GSKH:"杠上开花",
            BQGH:"被抢杠胡",
            SanJinDao:"三金倒",
            JieGang:"接杠",
            Gang:"补杠",
            Jin:"金",
            Hua:"花",
            LianZhuang:"连庄",
            ZiMo:"胡",
            PingHu:"胡",
            Difen:"底分",
            JinLong:"金龙",
            QingYiSe:"清一色",
            WuShuiHu:"无水胡",
            XianJin:"闲金",
            SanJinDao:"三金倒",
            JinKan:"金坎",
            JinQue:"金雀",
            DanYou:"闲金",
        };
        return huTypeDict[huType];
  },
});
