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
    ShowPlayerJieSuan:function(ShowNode,huInfoAll){
        let huInfo=huInfoAll['endPoint'].huTypeMap;

        let endPoint=huInfoAll['endPoint'];
        let isKou = endPoint['isKou'];
        let hu = huInfoAll['huType'];
        if((hu!="NotHu" || hu != "DianPao") && isKou){
            ShowNode.getChildByName('bg_kou').active = true;
        }else{
            ShowNode.getChildByName('bg_kou').active = false;
        }
        
        for (let huType in huInfo) {
            let huPoint = huInfo[huType];
            this.ShowLabelName(ShowNode.getChildByName('label_lists'),this.LabelName(huType)+"： "+huPoint);
            console.log("ShowPlayerJieSuan", huType, huPoint);
        }
    },
    LabelName:function(huType){
	    let LabelArray=[];
        LabelArray["PingHu"]="平胡";
        LabelArray["DaJia"]="大夹";
        LabelArray["XiaoJia"]="小夹";
        LabelArray["ShiYi"]="十一张";
        LabelArray["MQ"]="门清";
        LabelArray["Yao95"]="幺九独五";
        LabelArray["PengDao"]="一碰砸倒";
        LabelArray["SanPeng"]="三碰";
        LabelArray["SiGui"]="四归一";
        LabelArray["SSLi"]="卅卅哩";
        LabelArray["KuZi"]="苦子";
        LabelArray["FengGang"]="风x";
        LabelArray["Gang"]="杠";
        LabelArray["LiangFeng"]="亮风";
        LabelArray["KouPai"]="抠牌一嘴";
	    return LabelArray[huType];
    },
});
