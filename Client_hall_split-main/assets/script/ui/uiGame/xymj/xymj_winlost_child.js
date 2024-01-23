/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
		huaNum:cc.Node,
	},

	// use this for initialization
	OnLoad: function () {
		this.ComTool = app.ComTool();
		this.ShareDefine = app.ShareDefine();
	},
	ShowPlayerHuImg: function (huNode, huTypeName) {
		/*huLbIcon
		*  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
		*  13：双游，14：天胡，15：五金，16：自摸 17:接炮
		*/
		let huType = this.ShareDefine.HuTypeStringDict[huTypeName];
		if (typeof(huType) == "undefined") {
			huNode.getComponent(cc.Label).string = '';
		} else if (huType == this.ShareDefine.HuType_DianPao) {
			huNode.getComponent(cc.Label).string = '点泡';
		} else if (huType == this.ShareDefine.HuType_JiePao) {
			huNode.getComponent(cc.Label).string = '接炮';
		} else if (huType == this.ShareDefine.HuType_ZiMo) {
			huNode.getComponent(cc.Label).string = '自摸';
		} else if (huType == this.ShareDefine.HuType_QGH) {
			huNode.getComponent(cc.Label).string = '抢杠胡';
		} else {
			huNode.getComponent(cc.Label).string = '';
		}
	},
	ShowPlayerData: function (setEnd, playerAll, index) {
		let jin1 = setEnd.jin1;
		let jin2 = setEnd.jin2;
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
		this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2);
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
	UpdatePlayData:function(PlayerNode,HuList,PlayerInfo,jin1=0,jin2=0,maPaiLst = null){
		this.showLabelNum=1;
		this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
		//显示比赛分
		if (typeof(HuList.sportsPoint)!="undefined") {
			if (HuList.sportsPoint > 0) {
				this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'),"比赛分：+"+HuList.sportsPoint);
			}else{
				this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'),"比赛分："+HuList.sportsPoint);
			}
		}
		// this.huaNum.active = false;
		this.ShowPlayerRecord(PlayerNode.getChildByName('record'),HuList);
		this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'),HuList);
		this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'),PlayerInfo);
		this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'),HuList.publicCardList);
		this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'),HuList.shouCard,HuList.handCard,jin1,jin2);
		// this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'),HuList.huaList);
		this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacardscrollView'),HuList.huaList);
	},
	LabelName: function (huType) {
		let huTypeDict = {
			Zhuang: "庄",
			LianZhuang: "连庄",
			SanJinDao: "三金倒",
			SiJinDao: "四金倒",
			QiangJin: "抢金",
			TianHu: "天胡",
			ShuangYou: "双游",
			SanYou: "三游",
			SanJinYou: "三金游",
			DanYou: "单游",
			Hu: "胡",
			AnGang: "暗杠",
			JieGang: "接杠",
			Gang: "补杠",
			PingHu: "平胡",
		};
		return huTypeDict[huType];
	},
	ShowPlayerJieSuan: function (ShowNode, huInfoAll) {
		let huInfo = false;
		if (huInfoAll['endPoint']) {
			huInfo = huInfoAll['endPoint'];
		} else {
			huInfo = huInfoAll;
		}
		// let lianZhuang = ShowNode.getChildByName('lianzhuang').getComponent(cc.Label);
		// let zhuang = ShowNode.getChildByName('zhuang').getComponent(cc.Label);
		// lianZhuang.string = "";
		// zhuang.string = "";
		// ShowNode.getChildByName('huawin').getComponent(cc.Label).string = "";
		let huTypeMap = huInfo["huTypeMap"];
		for (let huType in huTypeMap) {
			let huPoint = huTypeMap[huType];
			// if (huType == "LianZhuang") {
			// 	lianZhuang.string = "连庄" + huPoint;
			// } else if (huType == "Zhuang") {
			// 	zhuang.string = "庄" + huPoint;
			// } else {
			// 	this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + huPoint);
			// }
			this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + huPoint);
		}
	},
	ShowPlayerHuaCard: function (huacardscrollView, hualist) {
		huacardscrollView.active = true;
		// if (hualist.length > 0) {
		// 	this.huaNum.active = true;
		// 	this.huaNum.getComponent(cc.Label).string = hualist.length + "个";
		// } else {
		// 	this.huaNum.active = false;
		// 	this.huaNum.getComponent(cc.Label).string = "";
		// }
		let view = huacardscrollView.getChildByName("view");
		let ShowNode = view.getChildByName("huacard");
		let UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowHua");
		UICard_ShowCard.ShowHuaList(hualist);

	},
});
