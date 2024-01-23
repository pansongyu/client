/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
		GoCardPrefab: cc.Prefab,
		cardPrefab: cc.Prefab,
		SpriteMale: cc.SpriteFrame,
		SpriteFeMale: cc.SpriteFrame,
	},

	// use this for initialization
	OnLoad: function () {
		this.PokerCard = app.PokerCard();
		this.ComTool = app.ComTool();
		this.ShareDefine = app.ShareDefine();
		this.IntegrateImage = app.SysDataManager().GetTableDict("IntegrateImage");
	},
	ShowPlayerData: function (setEnd, playerAll, index) {
	    console.log("单局结算数据", setEnd, playerAll, index);
        let dPos = setEnd.dPos;
        let posResultList = setEnd["posResultList"];
        let PlayerInfo = playerAll[index];
        this.node.active = true;
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo);

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
	UpdatePlayData: function (PlayerNode, HuList, PlayerInfo) {
		this.ShowPlayerRecord(PlayerNode.getChildByName("record"), HuList);
		this.ShowPlayerInfo(PlayerNode.getChildByName("user_info"), PlayerInfo);
		this.ShowPlayerShowCard(PlayerNode.getChildByName("showcard"), HuList);
	},
	ShowPlayerRecord: function (ShowNode, huInfo) {
		ShowNode.active = true;
		//显示桌面分
		if(huInfo["tableScore"] > 0){
			ShowNode.getChildByName("lb_point").getComponent("cc.Label").string = "桌面分:+" + huInfo["tableScore"];
		}else{
			ShowNode.getChildByName("lb_point").getComponent("cc.Label").string = huInfo["tableScore"];
		}
		if (huInfo["point"] > 0) {
			ShowNode.getChildByName("lb_point").getComponent("cc.Label").string = "+" + huInfo["point"];
			ShowNode.getChildByName("lb_point").color = cc.color(19,111,20);
		} else {
			ShowNode.getChildByName("lb_point").getComponent("cc.Label").string = huInfo["point"];
			ShowNode.getChildByName("lb_point").color = cc.color(213,68,67);
		}
		//显示竞技点
		if (typeof(huInfo["sportsPoint"]) != "undefined") {
			if (huInfo["sportsPoint"] > 0) {
				ShowNode.getChildByName("lb_SportsPoint").getComponent(cc.Label).string = "比赛分：+" + huInfo["sportsPoint"];
			} else {
				ShowNode.getChildByName("lb_SportsPoint").getComponent(cc.Label).string = "比赛分：" + huInfo["sportsPoint"];
			}
			ShowNode.getChildByName("lb_SportsPoint").active = true;
		} else {
			ShowNode.getChildByName("lb_SportsPoint").getComponent(cc.Label).string = "";
			ShowNode.getChildByName("lb_SportsPoint").active = false;
		}
	},
	ShowPlayerInfo: function (ShowNode, PlayerInfo) {
		ShowNode.getChildByName("lable_name").getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"],PlayerInfo["name"]);
		ShowNode.getChildByName("label_id").getComponent("cc.Label").string = "ID:"+ this.ComTool.GetPid(PlayerInfo["pid"]);

		// if (PlayerInfo["sex"] == this.ShareDefine.HeroSex_Boy) {
		// 	ShowNode.getChildByName("sex").getComponent(cc.Sprite).SpriteFrame = this.SpriteMale;
		// } else if (PlayerInfo["sex"] == this.ShareDefine.HeroSex_Girl) {
		// 	ShowNode.getChildByName("sex").getComponent(cc.Sprite).SpriteFrame = this.SpriteFeMale;
		// }
	},
	ShowPlayerShowCard: function (ShowNode, huInfo) {
		let publicCardList = huInfo["publicCardList"];
		let publicCardNode = ShowNode.getChildByName("publicCardNode");
		publicCardNode.removeAllChildren();
		if(!publicCardList.length){
			publicCardNode.width = 0;
			publicCardNode.getComponent(cc.Layout).updateLayout();
		}
		
		//渲染扣到的牌
		for (let i = 0; i < publicCardList.length; i++) {
			let goCardNode = cc.instantiate(this.GoCardPrefab);
			let cardIDList = publicCardList[i];
			for (let j = 0; j < cardIDList.length; j++) {
				let cardNode = cc.instantiate(this.cardPrefab);
				let value = cardIDList[j];
				this.ShowMiniCard(value, cardNode);
				cardNode.active = true;
				goCardNode.getChildByName("layout").addChild(cardNode);
			}
			publicCardNode.addChild(goCardNode);
		}

		//渲染剩余手牌
		let shouCardList = huInfo["shouCard"];
		let shouCardNode = ShowNode.getChildByName("shouCardNode");
		shouCardNode.removeAllChildren();
		if(!shouCardNode.length){
			shouCardNode.width = 0;
			shouCardNode.getComponent(cc.Layout).updateLayout();
		}
		for (let i = 0; i < shouCardList.length; i++) {
			let cardNode = cc.instantiate(this.cardPrefab);
			let value = shouCardList[i];
			this.ShowMiniCard(value, cardNode, true);
			cardNode.active = true;
			shouCardNode.addChild(cardNode);
		}
		ShowNode.getComponent(cc.Layout).updateLayout();
	},
	//显示poker牌
	ShowMiniCard: function (cardType, cardNode, isBlack = false) {
		this.PokerCard.GetMiniPokeCard(cardType, cardNode);
		cardNode.active = true;
		cardNode.getChildByName("bg_black").active = isBlack;
	},
});