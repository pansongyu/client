/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BasePoker_winlost_child"),

	properties: {

    },

	// use this for initialization
	OnLoad: function () {
        this.LOGIC_MASK_COLOR = 0xF0;
        this.LOGIC_MASK_VALUE = 0x0F;
        this.PokerCard = app.PokerCard();
	},
    ShowSpecData:function(setEnd,playerAll,index){
        let player = setEnd.posResultList[index];
        //倍数
        this.node.getChildByName("lb_beiShu").active = true;
        let beishu = this.node.getChildByName("lb_beiShu").getComponent(cc.Label);

        beishu.string = player.doubleNum;

        //底分
        this.node.getChildByName("lb_difen").active = true;
        let difen = this.node.getChildByName("lb_difen").getComponent(cc.Label);
        difen.string = player.baseMark;
        let cardNode = this.node.getChildByName("cardList");
        if (setEnd.rankeds[index]) {
            let dunPos = setEnd.rankeds[index]["dunPos"];
            let dunPai1 = cardNode.getChildByName("dunPai1");
            for (let i = 0; i < dunPai1.children.length; i++) {
                let card = dunPai1.children[i];
                this.ShowCard(dunPos["first"][i], card);
            }
            let dunPai2 = cardNode.getChildByName("dunPai2");
            for (let i = 0; i < dunPai2.children.length; i++) {
                let card = dunPai2.children[i];
                this.ShowCard(dunPos["second"][i], card);
            }
            let dunPai3 = cardNode.getChildByName("dunPai3");
            for (let i = 0; i < dunPai3.children.length; i++) {
                let card = dunPai3.children[i];
                this.ShowCard(dunPos["third"][i], card);
            }
            dunPai1.active=true;
            dunPai2.active=true;
            dunPai3.active=true;
        }else{
            let dunPai1 = cardNode.getChildByName("dunPai1");
            dunPai1.active=false;
            let dunPai2 = cardNode.getChildByName("dunPai2");
            dunPai2.active=false;
            let dunPai3 = cardNode.getChildByName("dunPai3");
            dunPai3.active=false;
        }
        
    },
    ShowCard: function (cardType, node) {
        // let newPoker = this.PokerCard.SubCardValue(cardType);
        this.GetPokeCard(cardType, node);
        if (cardType == 0) {
            node.getChildByName("poker_back").active = true;
        } else {
            node.getChildByName("poker_back").active = false;
        }
    },
    GetPokeCard: function (poker, cardNode, isShowIcon1 = true, isShowLandowner = false, hideBg = false) {
        if (0 == poker) {
            cardNode.getChildByName("poker_back").active = true;
            return;
        }
        let type = "";
        let type1 = "";
        let type2 = "";
        let num = "";
        let cardColor = this.GetCardColor(poker);
        let cardValue = this.GetCardValue(poker);
        let numNode = cardNode.getChildByName("num");
        numNode.active = true;
        if (cardColor == 0) {
            type = "bg_diamond1_";
            type1 = type + 1;
            type2 = type + 2;
            // if (cardValue > 10) {
            if (cardValue > 10 && cardValue < 14) {
                type2 = "bg_red_" + cardValue;
                // type1 = "";
                // type2 = "bg_diamond_" + cardValue;
            }
            num = "red_" + cardValue;
        } else if (cardColor == 16) {
            type = "bg_club1_";
            type1 = type + 1;
            type2 = type + 2;
            // if (cardValue > 10) {
            if (cardValue > 10 && cardValue < 14) {
                type2 = "bg_blue_" + cardValue;
                // type1 = "";
                // type2 = "bg_club_" + cardValue;
            }
            num = "black_" + cardValue;
        } else if (cardColor == 32) {
            type = "bg_heart1_";
            type1 = type + 1;
            type2 = type + 2;
            // if (cardValue > 10) {
            if (cardValue > 10 && cardValue < 14) {
                type2 = "bg_red_" + cardValue;
                // type1 = "";
                // type2 = "bg_heart_" + cardValue;
            }
            num = "red_" + cardValue;
        } else if (cardColor == 48) {
            type = "bg_spade1_";
            type1 = type + 1;
            type2 = type + 2;
            // if (cardValue > 10) {
            if (cardValue > 10 && cardValue < 14) {
                type2 = "bg_blue_" + cardValue;
                // type1 = "";
                // type2 = "bg_spade_" + cardValue;
            }
            num = "black_" + cardValue;
        } else if (cardColor == 64) {//双数小鬼   0x42-0x4e
            numNode.active = false;//2,3,4,5,6,7,8,9,a
            if (cardValue % 2 == 0) {//双数小鬼
                type1 = "icon_small_king_01";
                type2 = "icon_small_king";
            } else if (cardValue % 2 == 1) {//单数大鬼
                type1 = "icon_big_king_01";
                type2 = "icon_big_king";
            }
        }
        let numSp = cardNode.getChildByName("num").getComponent(cc.Sprite);
        let iconSp = cardNode.getChildByName("icon").getComponent(cc.Sprite);
        let icon1_Sp = cardNode.getChildByName("icon_1").getComponent(cc.Sprite);
        /*numSp.spriteFrame = this.pokerAtlas.getSpriteFrame(num);
        iconSp.spriteFrame = this.pokerAtlas.getSpriteFrame(type1);
        icon1_Sp.spriteFrame = this.pokerAtlas.getSpriteFrame(type2);*/
        numSp.spriteFrame = this.PokerCard.pokerDict[num];
        iconSp.spriteFrame = this.PokerCard.pokerDict[type1];
        icon1_Sp.spriteFrame = this.PokerCard.pokerDict[type2];
        if (hideBg) {
            cardNode.getChildByName("poker_back").active = false;
        }
    },
    //获取牌值
    GetCardValue:function(poker) { 
        let newPoker = this.PokerCard.SubCardValue(poker);
        if(newPoker == '0x41'){
            return 99;
        }
        else if(newPoker == '0x42'){
            return 100;
        }
        return newPoker&this.LOGIC_MASK_VALUE; 
    },
    
    //获取花色
    GetCardColor:function(poker) { 
        let newPoker = this.PokerCard.SubCardValue(poker);
        return newPoker&this.LOGIC_MASK_COLOR;
    },
    SubCardValue:function(poker){
        let temp = "";
        if(poker.length > 4){
            temp = poker;
            temp = temp.substring(0, temp.length - 1);
        }
        else{
            temp = poker;
        }

        return temp;
    },
});
