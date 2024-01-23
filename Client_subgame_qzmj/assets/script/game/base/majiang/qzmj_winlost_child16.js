/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("qzmj_app");

cc.Class({
	extends: require(app.subGameName + "_BaseComponent"),

	properties: {
		SpriteMale: cc.SpriteFrame,
		SpriteFeMale: cc.SpriteFrame,
		huaNum: cc.Node
	},

	// use this for initialization
	OnLoad: function () {
		this.ComTool = app[app.subGameName + "_ComTool"]();
		this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
	},
	ShowPlayerData: function (PlayerNode, HuList, PlayerInfo, jin1 = 0, jin2 = 0) {
		this.showLabelNum = 1;
		this.huaNum.active = false;
		this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
		this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
		this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo);
		this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList);
		this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
		this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacardscrollView'), HuList.huaList);
	},
	ShowPlayerRecord: function (ShowNode, huInfo) {
		let absNum = Math.abs(huInfo["point"]);
		ShowNode.getChildByName('lb_record_win').active = false;
		ShowNode.getChildByName('lb_record_lost').active = false;
		if (absNum > 10000) {
			let shortNum = (absNum / 10000).toFixed(2);
			if (huInfo["point"] > 0) {
				ShowNode.getChildByName('lb_record_win').getComponent("cc.Label").string = '+' + shortNum + "万";
				ShowNode.getChildByName('lb_record_win').active = true;
			} else {
				ShowNode.getChildByName('lb_record_lost').getComponent("cc.Label").string = '-' + shortNum + "万";
				ShowNode.getChildByName('lb_record_lost').active = true;
			}
		} else {
			if (huInfo["point"] > 0) {
				ShowNode.getChildByName('lb_record_win').getComponent("cc.Label").string = '+' + huInfo["point"];
				ShowNode.getChildByName('lb_record_win').active = true;
			} else {
				ShowNode.getChildByName('lb_record_lost').getComponent("cc.Label").string = huInfo["point"];
				ShowNode.getChildByName('lb_record_lost').active = true;
			}
		}
	},
	ShowPlayerInfo: function (ShowNode, PlayerInfo) {
		ShowNode.getChildByName('lable_name').getComponent("cc.Label").string = PlayerInfo["name"].substring(0, 9);
		// ShowNode.getChildByName('label_id').getComponent("cc.Label").string = this.ComTool.GetPid(PlayerInfo["pid"]);

		if (PlayerInfo['sex'] == this.ShareDefine.HeroSex_Boy) {
			ShowNode.getChildByName('sex').getComponent(cc.Sprite).SpriteFrame = this.SpriteMale;
		}
		else if (PlayerInfo['sex'] == this.ShareDefine.HeroSex_Girl) {
			ShowNode.getChildByName('sex').getComponent(cc.Sprite).SpriteFrame = this.SpriteFeMale;
		}
	},
	ShowPlayerJieSuan: function (ShowNode, huInfoAll) {
		let huInfo = false;
		if (huInfoAll['endPoint']) {
			huInfo = huInfoAll['endPoint'];
		} else {
			huInfo = huInfoAll;
		}
		this.ClearLabelShow(ShowNode.getChildByName("label_lists"));
		//显示比赛分
		if (typeof(huInfoAll.sportsPoint) != "undefined") {
			if (huInfoAll.sportsPoint > 0) {
				this.ShowLabelName(ShowNode.getChildByName('label_lists'), "比赛分：+" + huInfoAll.sportsPoint);
			} else {
				this.ShowLabelName(ShowNode.getChildByName('label_lists'), "比赛分：" + huInfoAll.sportsPoint);
			}
		}
		let lianZhuang = ShowNode.getChildByName("lianzhuang").getComponent(cc.Label);
		let zhuang = ShowNode.getChildByName("zhuang").getComponent(cc.Label);
		let difen = ShowNode.getChildByName('difen').getComponent(cc.Label);
		lianZhuang.string = "";
		zhuang.string = "";
		difen.string = "";
		let huTypeMap = huInfo.huTypeMap;
		for (let huType in huTypeMap) {
			let huPoint = huTypeMap[huType];
			if (huType == "LianZhuang") {
			    lianZhuang.string = this.LabelName(huType) + huPoint;
		    } else if (huType == "Zhuang") {
			    zhuang.string = "庄" + huPoint;
		    }  else if (huType == "DiFen") {
			    difen.string = this.LabelName(huType) + huPoint;
		    }else{
		    	this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType)+"：" + huPoint);
		    }
		}
	},
	LabelName:function(huType){
        let LabelArray=[];
        LabelArray["LianZhuang"]="连庄";
        LabelArray["DiFen"]="底分";
        LabelArray["Hu"]="屁胡";
        LabelArray["ZiMo"]="自摸";
        LabelArray["QGH"]="抢杠胡";
        LabelArray["SanJinDao"]="三金倒";
        LabelArray["TianHu"]="天胡";
        LabelArray["DanYou"]="游金";
        LabelArray["ShuangYou"]="双游";
        LabelArray["SanYou"]="三游";
        LabelArray["SanJinYou"]="三金游";
        LabelArray["QiangJin"]="抢金";
        LabelArray["TianTing"]="天听";
        LabelArray["PengFan"]="刻番";
        LabelArray["GangFan"]="杠番";
        LabelArray["HuaFan"]="花番";
        LabelArray["JinFan"]="金番";
        return LabelArray[huType];
    },
	ShowPlayerHuaCard: function (huacardscrollView, hualist) {
		huacardscrollView.active = true;
		if (hualist.length > 0) {
			this.huaNum.active = true;
			this.huaNum.getComponent(cc.Label).string = hualist.length + "个";
		}
		let view = huacardscrollView.getChildByName("view");
		let ShowNode = view.getChildByName("huacard");
		let UICard_ShowCard = ShowNode.getComponent(app.subGameName + "_UIMJCard_ShowHua");
		UICard_ShowCard.ShowHuaList(hualist);

	},
	ShowPlayerShowCard: function (ShowNode, cardIDList, handCard, jin1, jin2) {
		ShowNode.active = 1;
		let UICard_ShowCard = ShowNode.getComponent(app.subGameName + "_UIMJCard_ShowCard");
		UICard_ShowCard.ShowDownCard(cardIDList, handCard, jin1, jin2);
	},
	ShowPlayerDownCard: function (ShowNode, publishcard) {
		ShowNode.active = 1;
		let UICard_DownCard = ShowNode.getComponent(app.subGameName + "_UIMJCard_Down");
		UICard_DownCard.ShowDownCard(publishcard);
	},
	ShowLabelName: function (jiesuan, labelText) {
		if (this.showLabelNum > 8) {
			return;
		}
		jiesuan.getChildByName("label_" + this.showLabelNum.toString()).getComponent(cc.Label).string = labelText;
		this.showLabelNum = this.showLabelNum + 1;
	},
	ClearLabelShow: function (jiesuan) {
		for (let i = 1; i <= 8; i++) {
			jiesuan.getChildByName("label_" + i.toString()).getComponent(cc.Label).string = '';
		}
	},
});
