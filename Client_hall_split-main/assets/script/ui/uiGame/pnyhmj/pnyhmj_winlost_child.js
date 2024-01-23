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
    ShowPlayerJieSuan:function(ShowNode,huInfoAll){
        let huInfo=huInfoAll['endPoint'].huTypeMap;

        var arr=[];
        for(var key in huInfo){
            arr.push(key)
        }
        arr = arr.sort();
        var newData={}
        for(var i in arr){
            var itemKey = arr[i]
            newData[itemKey] = huInfo[itemKey]
        }

        for (let huType in newData) {
            let huPoint = newData[huType];
            if(huType=="ZiMo"){
                continue;
            }
            this.ShowLabelName(ShowNode.getChildByName('label_lists'),this.LabelName(huType)+":"+huPoint);
        }
    },
    LabelName:function(huType){
	    let huTypeDict = {
		    PiaoJinFen:"飘精分",
		    Gang:"杠分",
		    Hua:"花分",
            HongHuaSize:"红花",
            HeiHuaSize:"黑花",
		    HuPoint:"胡分",
		    PiaoFen:"飘分",
		    PingHu:"平胡",
		    LangPai:"浪牌",
		    QuanYao:"全幺",
            MenQing:"门清",
            DianPao:"点炮",
            QGH:"抢杠胡",
            QiZiQuan:"七字全",
            QuanZi:"全字",
            WuJingHu:"无精胡",
            JingHuanYuan:"精还原",
            WuDangDiHu:"无当地胡",
            WuDangTianHu:"无当天胡",
            PPHu:"碰碰胡",
            MenQingPPHu:"门清碰碰胡",
            QDHu:"七对胡",
            QYS:"清一色",
            TianHu:"天胡",
            DiHu:"地胡",
            QuanQiuR:"全求人",
            MenQingPPHu:"门清碰碰胡",
            HYS:"混一色",
            GSKH:"杠上开花",
            GK:"杠上开花次数",
            WDGSKH:"无当杠上开花",

	    };
	    return huTypeDict[huType];
    },
});
