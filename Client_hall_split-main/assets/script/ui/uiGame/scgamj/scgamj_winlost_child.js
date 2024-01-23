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
        }else if(huType == this.ShareDefine.HuType_HuOne){
            huNode.getComponent(cc.Label).string = '接炮1';
        }else if(huType == this.ShareDefine.HuType_HuTwo){
            huNode.getComponent(cc.Label).string = '接炮2';
        }else if(huType == this.ShareDefine.HuType_HuThree){
            huNode.getComponent(cc.Label).string = '接炮3';
        }else if(huType == this.ShareDefine.HuType_HuFour){
            huNode.getComponent(cc.Label).string = '接炮4';
        }else if(huType == this.ShareDefine.HuType_HuFive){
            huNode.getComponent(cc.Label).string = '接炮5';
        }else if(huType == this.ShareDefine.HuType_ZiMoOne){
            huNode.getComponent(cc.Label).string = '自摸1';
        }else if(huType == this.ShareDefine.HuType_ZiMoTwo){
            huNode.getComponent(cc.Label).string = '自摸2';
        }else if(huType == this.ShareDefine.HuType_ZiMoThree){
            huNode.getComponent(cc.Label).string = '自摸3';
        }else if(huType == this.ShareDefine.HuType_ZiMoFour){
            huNode.getComponent(cc.Label).string = '自摸4';
        }else if(huType == this.ShareDefine.HuType_ZiMoFive){
            huNode.getComponent(cc.Label).string = '自摸5';
        }else {
            huNode.getComponent(cc.Label).string = '';
        } 
    },
    ShowPlayerData:function(setEnd,playerAll,index){
        let jin1=setEnd.jin1;
        let jin2=setEnd.jin2;
        let dPos=setEnd.dPos;
        let posResultList = setEnd["posResultList"];
        let posHuArray=new Array();
        let posCount = posResultList.length;
        for(let i=0; i<posCount; i++){
            let posInfo = posResultList[i];
            let pos = posInfo["pos"];
            let posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
            posHuArray[pos]=posHuType;
        }
        let PlayerInfo = playerAll[index];
        this.node.active = true;
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2);
        let huNode=this.node.getChildByName('jiesuan').getChildByName('hutype');
        this.ShowPlayerHuImg(huNode,posResultList[index]['huType']);

        if(dPos===index){
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
        }else{
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
        }
        //显示头像，如果头像UI
        if(PlayerInfo["pid"] && PlayerInfo["iconUrl"]){
            app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"],PlayerInfo["iconUrl"]);
        }
        let weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
    },
    LabelName:function(huType){
	    let huTypeDict = {};
        huTypeDict["GangFen"]="杠分";
        huTypeDict["PingHu"]="平胡";
        huTypeDict["QueYiMen"]="缺一门";
        huTypeDict["MenQing"]="门清";
        huTypeDict["KaZhang"]="卡张";
        huTypeDict["BianZhang"]="边张";
        huTypeDict["DanDiao"]="单钓";
        huTypeDict["KaXin5"]="卡心五";
        huTypeDict["DaDuiZi"]="大对子";
        huTypeDict["DaDuiZiJinGouGou"]="大对子金钩钓";
        huTypeDict["YiTiaoLong"]="一条龙";
        huTypeDict["HunQing"]="混清";
        huTypeDict["ChunQing"]="纯清";
        huTypeDict["AnQiDui"]="暗七对";
        huTypeDict["LongQiDui"]="龙七对";
        huTypeDict["XiaoBanZi"]="小板子";
        huTypeDict["DaBanZi"]="大板子";
        huTypeDict["NBanZi"]="N板子";
        huTypeDict["XiaoFeiJi"]="小飞机";
        huTypeDict["DaFeiJi"]="大飞机";
        huTypeDict["TeDaFeiJi"]="特大飞机";
        huTypeDict["ChaoDaFeiJi"]="超大飞机";
        huTypeDict["ZiPaiDaFeiJi"]="字牌大飞机";
        huTypeDict["ZiPaiTeDaFeiJi"]="字牌特大飞机";
        huTypeDict["ZiPaiChaoDaFeiJi"]="字牌超大飞机";
        huTypeDict["XiaoHuoJian"]="小火箭";
        huTypeDict["DaHuoJian"]="大火箭";
        huTypeDict["ZiPaiXiaoHuoJian"]="字牌小火箭";
        huTypeDict["ZiPaiDaHuoJian"]="字牌大火箭";
        huTypeDict["GSH"]="杠上花";
        huTypeDict["GSP"]="杠上炮";
        huTypeDict["HaiDiLao"]="海底捞";
        huTypeDict["HaiDiPao"]="海底炮";
        huTypeDict["Xiao3YuanHui"]="小三元汇";
        huTypeDict["Da3YuanHui"]="大三元汇";
        huTypeDict["LuoHan18"]="十八罗汉";
	    return huTypeDict[huType];
    },
});
