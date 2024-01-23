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
        let LabelArray=[];
        LabelArray['GSKH']='杠上开花 ';
        LabelArray['HDLY']='海底捞月 ';
        LabelArray['PingHu']='平胡 ';
        LabelArray['TianHu']='天胡 ';
        LabelArray['DiHu']='地胡 ';
        LabelArray['SanCaiHu']='三财胡 ';
        LabelArray['ZYS']='字一色 ';
        LabelArray['NZYS']='字一色 ';
        LabelArray['QYS']='清一色 ';
        LabelArray['NQYS']='清一色 ';
        LabelArray['Hu8Hua']='八花胡 ';
        LabelArray['DiFen']='底胡 ';
        LabelArray['HYS']='混一色 ';
        LabelArray['PPHu']='对对胡 ';
        LabelArray['Zimo']='自摸 ';
        LabelArray['Jin']='金 ';
        LabelArray['Hua']='花 ';
        LabelArray['Zhuang']='庄家x ';
        return LabelArray[huType];
    },
    LabelCardName:function(card){
        let LabelCardArray=[];
        LabelCardArray['11']='一万 ';
        LabelCardArray['12']='二万 ';
        LabelCardArray['13']='三万 ';
        LabelCardArray['14']='四万 ';
        LabelCardArray['15']='五万 ';
        LabelCardArray['16']='六万 ';
        LabelCardArray['17']='七万 ';
        LabelCardArray['18']='八万 ';
        LabelCardArray['19']='九万 ';
        LabelCardArray['21']='一条 ';
        LabelCardArray['22']='二条 ';
        LabelCardArray['23']='三条 ';
        LabelCardArray['24']='四条 ';
        LabelCardArray['25']='五条 ';
        LabelCardArray['26']='六条 ';
        LabelCardArray['27']='七条 ';
        LabelCardArray['28']='八条 ';
        LabelCardArray['29']='九条 ';
        LabelCardArray['31']='一筒 ';
        LabelCardArray['32']='二筒 ';
        LabelCardArray['33']='三筒 ';
        LabelCardArray['34']='四筒 ';
        LabelCardArray['35']='五筒 ';
        LabelCardArray['36']='六筒 ';
        LabelCardArray['37']='七筒 ';
        LabelCardArray['38']='八筒 ';
        LabelCardArray['39']='九筒 ';
        LabelCardArray['41']='东风 ';
        LabelCardArray['42']='南风 ';
        LabelCardArray['43']='西风 ';
        LabelCardArray['44']='北风 ';
        LabelCardArray['45']='红中 ';
        LabelCardArray['46']='发财 ';
        LabelCardArray['47']='白板 ';
        LabelCardArray['51']='梅 ';
        LabelCardArray['52']='兰 ';
        LabelCardArray['53']='竹 ';
        LabelCardArray['54']='菊 ';
        LabelCardArray['55']='春 ';
        LabelCardArray['56']='夏 ';
        LabelCardArray['57']='秋 ';
        LabelCardArray['58']='冬 ';
        return LabelCardArray[card];
    },
    ShowPlayerJieSuan:function(ShowNode,huInfoAll){
        let huInfo=huInfoAll['endPoint'].huTypeMap;
        let totalHushu = huInfoAll['endPoint'].totalHushu;
        let unit = "";
        let lb_hu = "";
        let huNum = 0;
        let taiNum = 0;
        for(let i = 0;i<huInfo.length;i++){
            if(huInfo[i].unit == "HUSHU"){
                unit = "胡";
                huNum += huInfo[i].score;
            }else if(huInfo[i].unit == "TAISHU"){
                unit = "台";
                taiNum += huInfo[i].score;
            }
            let huType = huInfo[i].type;
            if(huType == "Card"){
                this.ShowLabelName(ShowNode.getChildByName('label_lists'),this.LabelCardName(huInfo[i].card) + huInfo[i].score + unit);
            }else if(huType == "Zhuang"){
                this.ShowLabelName(ShowNode.getChildByName('label_lists'),this.LabelName(huType) + huInfo[i].score);
            }else{
                this.ShowLabelName(ShowNode.getChildByName('label_lists'),this.LabelName(huType) + huInfo[i].score + unit);
            }
            
        }
        ShowNode.getChildByName("lb_taihufen").getComponent(cc.Label).string = taiNum + "台" + huNum + "胡" + "=" + totalHushu;
    },
});
