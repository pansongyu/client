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
		    Hu:"胡",
		    GangNum:"杠数量",
		    AnGangNum:"暗杠数量",
		    QDHu:"七对胡",
		    PPHu:"碰碰胡",
		    MenQing:"门清",
		    QYS:"清一色",
		    HYS:"混一色",
		    LuanFeng:"乱风",
		    PPHuQuanFeng:"碰碰胡全风",
		    QDHuQuanFeng:"七对胡全风",
		    DuDiao:"独钓",
		    BaHua:"八花",
		    PiaoHua:"飘花",
		    QGH:"抢杠胡",
		    GSKH:"杠上开花",
		    HDLY:"海底捞月",
		    Hua:"花",
	    };
	    return huTypeDict[huType];
    },
});
