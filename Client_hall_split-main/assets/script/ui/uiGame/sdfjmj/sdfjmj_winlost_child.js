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
        for (let huType in huInfo) {
            let huPoint = huInfo[huType];
            if(huType=="ZiMo"){
                continue;
            }
            this.ShowLabelName(ShowNode.getChildByName('label_lists'),this.LabelName(huType)+":"+huPoint);
        }
    },
    LabelName:function(huType){
	    let huTypeDict = {
		    LangPai:"浪牌",
            QuanYao:"全幺",
            QiZiQuan:"七字全",
            QuanZi:"全字",
            WuJingHu:"无精胡",
            JingHuanYuan:"精还原",
            WuDangDiHu:"无当地胡",
            WuDangTianHu:"无当天胡",
            PiaoJinFen:"飘精分",
            PiaoJinSize:"飘精数",
            WDGSKH:"无当杠上开花",
            MenQingPPHu:"门清碰碰胡",
            HeiYiSe:"黑一色",
            LvYiSe:"绿一色",
            XiaoYao:"小幺",
            DuanDuan:"断断",
            YBGao:"一板高,",
            EBGao:"二板高,",
            JJYao:"就就幺",
            WuZiJJYao:"无字就就幺",
            RPPeng:"软碰碰",
            SGYi:"四归一",
            SGEr:"四归二",
            LiangGeSGEr:"两个四归二",
            SGSan:"四归三",
            SGSi:"四归四",
            SBTong:"三版同",
            GLang:"国浪",
            SSLang:"十三浪",
            XBB:"小板板",
            DBB:"大板板",
            DXBB:"大小板板",
            LunHu:"轮胡",
            SBTongPPHu:"三板同碰碰胡",
            QDLunHuEBGao:"七对轮胡两板高",
            MGSKH:"杠上开花(明杠)",
            AGSKH:"杠上开花(暗杠)",
            SSSY:"下水十三幺",
            SSY:"十三幺",
            QQR:"全求人",
            PPHu:"碰碰胡",
            QDHu:"七对胡",
            PingHu:"平胡",
            HYS:"混一色",
            DDHu:"七对",
            DiHu:"地胡",
            QYS:"清一色",
            TianHu:"天胡",
            ZiMo:"自摸",
            QGH:"抢杠胡",
            Hu:"胡",
            MenQingSSY:"门清十三幺",
            JieJing:"接精分",
            PiaoFen:"飘分",
            MenQing:"门清",
            Long:"一条龙",
            HeiHuaSize:"黑花",
            HuPoint:"胡分",
            HongHuaSize:"红花",
            SSL:"十三烂",
            Gang:"杠",
            Hua:"花",
            WuDangDiDuan:"无当地断",
            WuDangTianDuan:"无当天断",
            DiDuan:"地断",
            TianDuan:"天断",
            KSBTong:"三碰碰",
	    };
        if(typeof(huTypeDict[huType])=="undefined"){
            console.log("huType undefined:"+huType);
        }
	    return huTypeDict[huType];
    },
});
