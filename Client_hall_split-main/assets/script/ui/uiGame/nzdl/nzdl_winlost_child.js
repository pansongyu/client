/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
		cardPrefab: cc.Prefab,
		content: cc.Node,
		chutian: cc.Node,
		zhuangJia: cc.Node,
		lb_difen: cc.Label,
		lb_loufen: cc.Label,
		lbSportsPoint: cc.Label,
		sp_chunTian: [cc.SpriteFrame],
	},

	// use this for initialization
	OnLoad: function () {
		app["nzdl_PokerCard"] = require("nzdl_PokerCard").GetModel;
		this.ComTool = app.ComTool();
		this.ShareDefine = app.ShareDefine();
		this.PokerCard = app.nzdl_PokerCard();
	},
	ShowPlayerJieSuan() {

	},
	ShowPlayerHuaCard() {

	},
	ShowPlayerHuImg: function (huNode, huTypeName) {

	},

	onPlusScore(s) {
		if (s > 0) {
			return '+' + s;
		}
		return s;
	},
	ShowPlayerData: function (setEnd, playerAll, index) {
		console.log("ShowPlayerData", setEnd, playerAll, index);
		let dPos = setEnd["dPos"];
		let louFen = setEnd["louFen"];
		let diFen = setEnd["diFen"];
		let posResultList = setEnd["posResultList"];
		let posResult = posResultList[index];
		this.ShowPlayerItem(posResult);
		this.zhuangJia.active = dPos;
		this.lb_difen.string = "底分：" + diFen;
		this.lb_loufen.string = "搂分：" + louFen;
		if (typeof(posResult.sportsPoint) != "undefined") {
			this.lbSportsPoint.string = '比赛分:' + posResult.sportsPoint;
		} else {
			this.lbSportsPoint.string = '';
		}
		if (dPos === index) {
			this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
		} else {
			this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
		}
		let PlayerInfo = playerAll[index];
		//显示头像，如果头像UI
		if (PlayerInfo["pid"] && PlayerInfo["iconUrl"]) {
			app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"], PlayerInfo["iconUrl"]);
		}
		let weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
		weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
		this.UpdatePlayData(this.node, posResultList[index], PlayerInfo);
	},
	ShowPlayerItem: function (posResult) {
		let publicCardList = posResult["publicCardList"];
		let shouCard = posResult["shouCard"];
		let chunTian = posResult["chunTian"];
		let fanChunTian = posResult["fanChunTian"];
		this.ShowPlayerCard(publicCardList, shouCard);
		this.ShowChuntian(chunTian, fanChunTian);
	},
	ShowPlayerCard: function (publicCardList, shouCard) {
		let paiLayOut = this.content;
		paiLayOut.removeAllChildren();
		let kong = new cc.Node();
		kong.width = 170;
		kong.heig = 172;
		let cardNum = 0;
		let list = [];
		for (let i = 0; i < publicCardList.length; i++) {
			let cardList = publicCardList[i];
			for (let j = 0; j < cardList.length; j++) {
				let card = cardList[j];
				list.push(card);
				cardNum++;
				if (j == cardList.length - 1) {
					list.push(0);
					cardNum++;
				}
			}
		}
		for (let i = 0; i < list.length; i++) {
			let cardType = list[i];
			let paiNode = paiLayOut.children[i];
			if (cardType > 0) {
				if (!paiNode) {
					paiNode = cc.instantiate(this.cardPrefab);
					paiLayOut.addChild(paiNode);
				}
				this.ShowCard(cardType, paiNode);
			} else {
				let kongNode = cc.instantiate(kong);
				paiLayOut.addChild(kongNode);
			}
		}
		for (let k = cardNum; k < cardNum + shouCard.length; k++) {
			let paiNode = paiLayOut.children[k];
			if (!paiNode) {
				paiNode = cc.instantiate(this.cardPrefab);
				paiLayOut.addChild(paiNode);
			}
			let cardType = shouCard[k - cardNum];
			this.ShowCard(cardType, paiNode, 0, true);
		}
	},
	ShowChuntian: function (chunTian, fanChunTian) {
		let index = -1;
		if (chunTian) {
			index = 0;
		} else if (fanChunTian) {
			index = 1;
		}
		this.chutian.getComponent(cc.Sprite).spriteFrame = this.sp_chunTian[index];
	},
	ShowCard: function (cardType, cardNode, sameCardNum, isLastCard, isShowLandowner = false, hideBg = false, isRazz = false) {
		cardNode.active = true;
		if (cardType == 0) {
			cardNode.getChildByName("poker_back").active = true;
			return;
		} else {
			cardNode.getChildByName("poker_back").active = false;
		}
		this.PokerCard.GetPokeCard(cardType, cardNode, sameCardNum, isLastCard, isShowLandowner, hideBg, isRazz);
	},
	ClearLabelShow: function () {
		
	}
});
