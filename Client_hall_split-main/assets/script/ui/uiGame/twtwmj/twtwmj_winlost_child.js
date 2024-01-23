/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
		huaNum: cc.Node,
	},

	// use this for initialization
	OnLoad: function () {
		this.ComTool = app.ComTool();
		this.ShareDefine = app.ShareDefine();
	},
	LabelName: function (huType) {
		let huTypeDict = {
			"PiHu": "屁胡",
			"ZiMo": "自摸",
			"DiHu": "地和",
			"PingHu": "平和",
			"TianHu": "天和",
			"RenHu": "人和",
			"HDLYue": "海底捞月",
			"HDLYu": "海底捞鱼",
			"MengQing": "门清",
			"MengQingZiMo": "门清自摸",
			"QYS": "清一色",
			"HYS": "混一色",
			"ZYS": "字一色",
			"BaHua": "八仙过海",
			"PPHu": "碰碰胡",
			"GSKH": "杠上开花",
			"DT": "独听",
			"QuanQiu": "全求",
			"QGHu": "抢杠胡",
			"SanAnKe": "三暗刻",
			"SiAnKe": "四暗刻",
			"WuAnKe": "五暗刻",
			"BuQiu": "不求",
			"DaSiXi": "大四喜",
			"XiaoSiXi": "小四喜",
			"DaSanYuan": "大三元",
			"XiaoSanYuan": "小三元",
			"HuaGang": "花杠",
			"HuaPai": "花牌",
			"KaiMenXu": "开门序",
			"QuanXu": "圈序",
			"FengKan": "风字坎",
			"JianKan": "箭字坎",
			"QiQiangYi": "七抢一",
			"ZhuangJia": "庄家",
			"LianZhuang": "连庄",
			"DiFen": "底分",
		};
		return huTypeDict[huType];
	},
	UpdatePlayData: function (PlayerNode, HuList, PlayerInfo, jin1 = 0, jin2 = 0, maPaiLst = null) {
		this.showLabelNum = 1;
		this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
		//显示竞技点
		if (typeof(HuList.sportsPoint) != "undefined") {
			if (HuList.sportsPoint > 0) {
				this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：+" + HuList.sportsPoint);
			} else {
				this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：" + HuList.sportsPoint);
			}
		}
		this.huaNum.active = false;
		this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
		this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
		this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo);
		this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList);
		this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
		// this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'),HuList.huaList);
		this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacardscrollView'), HuList.huaList, HuList["qiQiangYiCard"]);
	},
	ShowPlayerJieSuan: function (ShowNode, huInfoAll) {
		let huInfo = false;
		if (huInfoAll['endPoint']) {
			huInfo = huInfoAll['endPoint'];
		} else {
			huInfo = huInfoAll;
		}
		let huTypeMap = huInfo.huTypeMap;
		for (let huType in huTypeMap) {
			let huPoint = huTypeMap[huType];
			this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + huPoint);
		}
	},
	ShowPlayerHuaCard: function (huacardscrollView, hualist, qiQiangYiCard) {
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
		UICard_ShowCard.ShowHuaListByQiQiangYi(hualist, qiQiangYiCard);
	},
	ShowLabelName: function (jiesuan, labelText) {
		if (this.showLabelNum > 18) {
			return;
		}
		jiesuan.getChildByName("label_" + this.showLabelNum.toString()).getComponent(cc.Label).string = labelText;
		this.showLabelNum = this.showLabelNum + 1;
	},
	ClearLabelShow: function (jiesuan) {
		for (let i = 1; i <= 18; i++) {
			jiesuan.getChildByName("label_" + i.toString()).getComponent(cc.Label).string = '';
		}
	},
});
