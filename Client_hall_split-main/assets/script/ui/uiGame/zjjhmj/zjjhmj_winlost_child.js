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
        this.SysDataManager = app.SysDataManager();
        this.IntegrateImage = this.SysDataManager.GetTableDict("IntegrateImage");
	},
    ShowPlayerData: function (setEnd, playerAll, index) {
        console.log("单局结算数据", setEnd, playerAll, index);
        let jin1 = setEnd.jin;
        let jin2 = 0;
        if (setEnd.jin2 > 0) {
            jin2 = setEnd.jin2;
        }
        let dPos = setEnd.dPos;
        let posResultList = setEnd["posResultList"];
        let posHuArray = new Array();
        let posCount = posResultList.length;
        for (let i = 0; i < posCount; i++) {
            let posInfo = posResultList[i];
            let pos = posInfo["pos"];
            let posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
            posHuArray[pos] = posHuType;
        }
        let PlayerInfo = playerAll[index];
        this.node.active = true;
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, setEnd.zhuaNiaoList);
        let huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
        this.ShowPlayerHuImg(huNode, posResultList[index]['huType']);

        if (dPos === index) {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
        } else {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
        }
        //显示头像，如果头像UI
        if (PlayerInfo["pid"] && PlayerInfo["iconUrl"]) {
            app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"], PlayerInfo["iconUrl"]);
        }
        let weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
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
        LabelArray['DDHu']="对对胡";
        LabelArray['DaDuiPeng']="碰碰胡";
        LabelArray['HHDDHu']="豪华对对胡";
        LabelArray['QingYiSe']="清一色";
        LabelArray['QiaoXiang']="敲响";
        LabelArray['LuanFeng']="乱风";
        LabelArray['CS_Tou']="财神头";
        LabelArray['SC_Ke']="三财一刻";
        LabelArray['Not_Jin']="无财";
        LabelArray['Cai_Gui1']="财归一";
        LabelArray['Cai_Gui2']="财归二";
        LabelArray['Cai_Gui3']="财归三";
        LabelArray['SSBK']="十三不靠";
        LabelArray['SSBK_Qing']="十三不靠清七风";
        LabelArray['Hu']="胡";
        LabelArray['QQR']="全求人";
        LabelArray['GangBao']="杠爆";
        LabelArray['GSKH']="杠上开花";
        LabelArray['HDLY']="海底捞月";
        LabelArray['DiHu']="地胡";
        LabelArray['TianHu']="天胡";
        LabelArray['QGH']="抢杠胡";
        LabelArray['EvenDpos']="连庄";
        LabelArray['PingHu']="平胡";
        LabelArray['QingQiDui']="清七对";
        LabelArray['QiDuiZi']="七对子";
        LabelArray['QiDuiZiBaoTou']="七对子爆头";
        LabelArray['ZhaDan']="炸弹";
        LabelArray['DiFen']="底分";
        return LabelArray[huType];
  },
});
