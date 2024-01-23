var app = require("app");

var ZGDSSPokerCard = app.BaseClass.extend({

	/**
	 * 构造函数
	 */
	Init: function () {
		this.JS_Name = this.gameName + "_PokerCard";
		this.pokerOutCardList=[];
		this.LOGIC_MASK_COLOR = 0xF0;
		this.LOGIC_MASK_VALUE = 0x0F;
		this.LoadAllPokerRes();
	},
	GetPokeCardMini: function (poker, cardNode, isHu = false) {
		if (0 == poker) {
			return;
		}
		let type = "";
		let num = "";
		let isGuiBian=false;
		if(poker<0){
			isGuiBian=true;
			poker=Math.abs(poker);
		}
		let cardColor = this.GetCardColor(poker);
		let cardValue = this.GetCardValue(poker);
		let numNode = cardNode.getChildByName("num");
		numNode.active = true;
		if (cardColor == 0) {//方块
			type = "bg_diamond";
			num = "red_" + cardValue;
		} else if (cardColor == 16) {//桃花
			type = "bg_club";
			num = "black_" + cardValue;
		} else if (cardColor == 32) {//红心
			type = "bg_heart";
			num = "red_" + cardValue;
		} else if (cardColor == 48) {//桃心
			type = "bg_spade";
			num = "black_" + cardValue;
		} else if (cardColor == 64) {
			numNode.active = false;
			type="bg_lz";
		}
		if(isGuiBian==true){
			num = "yellow_" + cardValue;
			type="bg_peng";
		}
		for(let i=0;i<this.pokerOutCardList.length;i++){
			if(this.pokerOutCardList[i]._name == type){
				cardNode.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.pokerOutCardList[i];
			}else if(this.pokerOutCardList[i]._name == num){
				cardNode.getChildByName("num").getComponent(cc.Sprite).spriteFrame = this.pokerOutCardList[i];
			}
		}
		cardNode.getChildByName("img_hupai").active = isHu;
	},
	
	LoadAllPokerRes: function () {
		let self = this;
        if(0 != this.pokerOutCardList.length)
            return;
       
        cc.loader.loadResDir("ui/uiGame/zgdss/poker/selfout",cc.SpriteFrame, function(err, assets){
            if(err){
                cc.error(err);
                return;
            }
            for(let i=0;i<assets.length;i++){
                self.pokerOutCardList.push(assets[i]);
            }
        });

       

        
	},
	//获取牌值
	GetCardValue: function (poker) {
		return poker & this.LOGIC_MASK_VALUE;
	},
	//获取牌类型
	GetCardType: function (poker) {
		return poker;
	},

	//获取花色
	GetCardColor: function (poker) {
		while (poker >= 256) {
			poker -= 256;
		}
		let color = poker & this.LOGIC_MASK_COLOR;
		return color;
	},
	//获取同一牌值
	GetSameValue: function (pokers, tagCard) {
		let sameValueList = [];
		let tagCardValue = this.GetCardValue(tagCard);
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			let pokerValue = this.GetCardValue(poker);

			if (tagCardValue == pokerValue) {
				sameValueList[sameValueList.length] = poker;
			}
		}
		return sameValueList
	},
	//获取同一牌类型
	GetSameType: function (pokers, tagCard) {
		let sameTypeList = [];
		let tagCardType = this.GetCardType(tagCard);
		for (let i = 0; i < pokers.length; i++) {
			let poker = pokers[i];
			let pokerType = this.GetCardType(poker);
			if (tagCardType == pokerType) {
				sameTypeList[sameTypeList.length] = poker;
			}
		}
		return sameTypeList
	},
	CheckPokerInListEx: function (list, tagCard) {
		if (list.length == 0) {
			return false;
		}
		let bInList = false;
		for (let i = 0; i < list.length; i++) {
			let item = list[i];
			let cardValue = this.GetCardValue(item[0]);
			let tagValue = this.GetCardValue(tagCard);

			if (cardValue == tagValue) {
				bInList = true;
			}
		}
		return bInList;
	},
	CheckPokerTypeInListEx: function (list, tagCard) {
		if (list.length == 0) {
			return false;
		}
		let bInList = false;
		for (let i = 0; i < list.length; i++) {
			let item = list[i];
			let cardType = this.GetCardType(item[0]);
			let tagType = this.GetCardType(tagCard);
			if (cardType == tagType) {
				bInList = true;
			}
		}
		return bInList;
	},
	PushTipCard: function (pokers, samePoker, len) {
		let temp = [];
		samePoker.reverse();
		for (let i = 0; i < len; i++) {
			temp.push(samePoker[i]);
		}
		pokers.push(temp);
	},
});

var g_ZGDSSPokerCard = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_ZGDSSPokerCard) {
		g_ZGDSSPokerCard = new ZGDSSPokerCard();
	}
	return g_ZGDSSPokerCard;
};