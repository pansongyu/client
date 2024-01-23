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
	UpdatePlayData:function(PlayerNode,HuList,PlayerInfo,jin1=0,jin2=0,maPaiLst = null){
		this.showLabelNum=1;
		this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
		//显示竞技点
		if (typeof(HuList.sportsPoint)!="undefined") {
			if (HuList.sportsPoint > 0) {
				this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'),"比赛分：+"+HuList.sportsPoint);
			}else{
				this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'),"比赛分："+HuList.sportsPoint);
			}
		}
		this.huaNum.active = false;
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
			DiFen:"底分",
			SanJinDao: "三金倒",
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
			HuaGang:"花杠",
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
		let lianZhuang = ShowNode.getChildByName('lianzhuang').getComponent(cc.Label);
		let zhuang = ShowNode.getChildByName('zhuang').getComponent(cc.Label);
		let difen = ShowNode.getChildByName('difen').getComponent(cc.Label);
		lianZhuang.string = "";
		zhuang.string = "";
		difen.string = "";
		ShowNode.getChildByName('huawin').getComponent(cc.Label).string = "";
		let huTypeMap = huInfo["huTypeMap"];
		for (let huType in huTypeMap) {
			let huPoint = huTypeMap[huType];
			if(huType == "DiFen"){
				 difen.string = this.LabelName(huType) + huPoint;
			}else if(huType == "PiaoFen"){
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), "插" + huPoint + "码");
			}else if(huType == "AnGang" || huType == "JieGang" || huType == "Gang" || huType == "HuaGang"){
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "+" + huPoint + "分");
			}
			else{
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
			}
		}
	},
	ShowPlayerHuaCard: function (huacardscrollView, hualist) {
		huacardscrollView.active = true;
		if (hualist.length > 0) {
			this.huaNum.active = true;
			this.huaNum.getComponent(cc.Label).string = hualist.length + "个";
		} else {
			this.huaNum.active = false;
			this.huaNum.getComponent(cc.Label).string = "";
		}
		let view = huacardscrollView.getChildByName("view");
		let ShowNode = view.getChildByName("huacard");
		let UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowHua");
		UICard_ShowCard.ShowHuaList(hualist);

	},
});
