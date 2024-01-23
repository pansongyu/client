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
    LabelName:function(huType){
	    let LabelArray=[];
        LabelArray["Hua"]="花番";
        LabelArray["ZiMo"]="自摸";
        LabelArray["JieGang"]="接杠";
        LabelArray["AnGang"]="暗杠";
        LabelArray["Gang"]="补杠";
        LabelArray["GSKH"]="杠上开花";
        LabelArray["QGHu"]="抢杠胡";
        LabelArray["Hua"]="花数";
        LabelArray["SanJinDao"]="三金倒";
        LabelArray["DanYou"]="单游";
        LabelArray["ShuangYou"]="双游";
        LabelArray["SanYou"]="三游";
        LabelArray["SiJinDao"]="四金倒";
        LabelArray["WuJinDao"]="五金倒";
        LabelArray["LiuJinDao"]="六金倒";
        LabelArray["QiangJin"]="抢金";
        LabelArray["ShiSanYao"]="十三幺";
        LabelArray["DDHu"]="对对胡";
        LabelArray["TianHu"]="天胡";
        LabelArray["FenBing"]="分饼";
	    return LabelArray[huType];
    },
});
