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
    UpdatePlayData: function (PlayerNode, HuList, PlayerInfo, jin1 = 0, jin2 = 0, maPaiLst = null) {
        this.showLabelNum = 1;
        this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
        //显示比赛分
        if (typeof (HuList.sportsPointTemp) != "undefined") {
            if (HuList.sportsPointTemp > 0) {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：+" + HuList.sportsPointTemp);
            } else {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：" + HuList.sportsPointTemp);
            }
        }else if (typeof (HuList.sportsPoint) != "undefined") {
            if (HuList.sportsPoint > 0) {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：+" + HuList.sportsPoint);
            } else {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：" + HuList.sportsPoint);
            }
        }
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
        // this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'), HuList.huaList);
        this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacardscrollView'),HuList.huaList);
    },
    ShowPlayerHuaCard: function (huacardscrollView, hualist) {
        huacardscrollView.active = true;
        // if (hualist.length > 0) {
        //     this.huaNum.active = true;
        //     this.huaNum.getComponent(cc.Label).string = hualist.length + "个";
        // }
        let view = huacardscrollView.getChildByName("view");
        let ShowNode = view.getChildByName("huacard");
        let UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowHua");
        UICard_ShowCard.ShowHuaList(hualist);

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
        }else {
            huNode.getComponent(cc.Label).string = '';
        } 
    },
    LabelName:function(huType){
        let LabelArray=[];
        LabelArray['PiHu']='屁胡';
        LabelArray['QYS']='清一色';
        LabelArray['HYS']='混一色';
        LabelArray['PPHu']='对对胡';
        LabelArray['HDD']='混对对';
        LabelArray['QDD']='清对对';
        LabelArray['DZ']='大字';
        LabelArray['HDLY']='海底捞月';
        LabelArray['GSKH']='杠上开花';
        LabelArray['DDC']='大吊车';
        LabelArray['QGHu']='抢杠胡';
        LabelArray['Hua']='花数';
        return LabelArray[huType];
    },
});
