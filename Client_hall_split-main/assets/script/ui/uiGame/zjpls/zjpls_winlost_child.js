/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BasePoker_winlost_child"),

	properties: {
        cardPrefab:cc.Prefab,
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
        //this.node.getChildByName("lb_beiShu").active = true;
        //let beishu = this.node.getChildByName("lb_beiShu").getComponent(cc.Label);

        //beishu.string = player.doubleNum;

        //底分
        this.node.getChildByName("lb_difen").active = true;
        let difen = this.node.getChildByName("lb_difen").getComponent(cc.Label);
        difen.string = player.baseMark;


        //显示底牌
        let cardNode=this.node.getChildByName('card');
        let rankeds=setEnd.rankeds[index];
        let dunPos = rankeds.dunPos;
        let special = rankeds.special;
        if(special != -1){
            //显示特殊牌型
            let specialNode = cardNode.getChildByName('special_card');
            specialNode.active = true;
            let imagePath = "texture/game/zjpls/special/"+special;
            //加载图片精灵
            let that = this;
            cc.loader.loadRes(imagePath, cc.SpriteFrame, function (error, spriteFrame) {
                if(error){
                    that.ErrLog("ShowMap imagePath(%s) loader error:%s", imagePath, error);
                    return
                }
                specialNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }

        if(setEnd.zjid == player.pid){
            cardNode.getChildByName('zhuangjia').active = true;
        }
        let allCards = [];
        if(special == 85 || special == 95){
            let pokers = dunPos.first.concat(dunPos.second,dunPos.third);
            let tonghuas = this.SanTongHua(pokers);
            for(let i = 0; i < tonghuas.length; i++){
                for(let j = 0; j < tonghuas[i].length; j++){
                    allCards.push(tonghuas[i][j]);
                }
            }
        }else{
            allCards = dunPos.first.concat(dunPos.second,dunPos.third);
        }
        for(let j = 0; j < cardNode.children.length; j++){
            let child = cardNode.children[j];
            if(child.name == 'zhuangjia' || child.name == 'beishu' || child.name == 'special_card'){
                continue;
            } 
            if(!child.getChildByName("cardPrefab")){
                let card = cc.instantiate(this.cardPrefab);
                child.addChild(card);
                this.ShowCard(allCards[j], card);
            }else{
                let card = child.getChildByName("cardPrefab");
                this.ShowCard(allCards[j], card);
            }
        }        
    },
    ShowCard:function(cardType, node){
        let newPoker = this.PokerCard.SubCardValue(cardType);
        this.PokerCard.GetPokeCard(newPoker, node);
        node.getChildByName("poker_back").active = false;
    },

    SanTongHua:function(pokers){
        let gui = this.GetGuiPai(pokers);
        let tonghuas = [];
        for(let i = 0; i < pokers.length; i++){
            let poker = pokers[i];
            if(gui.indexOf(poker) != -1) continue;
            let tonghua = this.GetSameColor(pokers, poker);
            let bInList = this.CheckPokerInList(tonghuas, poker);
            if(tonghua.length >= 5 && !bInList){
                tonghuas[tonghuas.length] = tonghua;
            }
            else if(tonghua.length < 5 && !bInList){
                tonghuas[tonghuas.length] = tonghua;
            }
        }
        
        tonghuas.sort(function(a, b){
            return a.length - b.length;
        });

        let JoinGuiPia = function(tonghua, gui, len){
            if(tonghua.length == len) return;
            for(let i = 0; i < gui.length; i++){
                if(gui[i] == 'undefined') continue;
                tonghua.push(gui[i]);
                gui[i] = 'undefined';
                if(tonghua.length == len){
                    break;
                }
            }
        }

        if(gui.length){
            JoinGuiPia(tonghuas[0], gui, 3);
            JoinGuiPia(tonghuas[1], gui, 5);
            JoinGuiPia(tonghuas[2], gui, 5);
        }

        return tonghuas;
    },
    GetGuiPai:function(pokers){
        let guipai = [];
        for(let i = 0; i < pokers.length; i++){
            let poker = pokers[i];
            let newPoker = this.PokerCard.SubCardValue(poker);
            let ten = parseInt(newPoker,16);
            if(ten >= 65){
                guipai.push(poker);
            }
        }
        return guipai;
    },

    //获取同一花色
    GetSameColor:function(pokers, tagCard) { 
        let sameColorList = [];
        for (let i = 0; i < pokers.length; i++) {
            let poker = pokers[i];
            let pokerColor = this.GetCardColor(poker);
            let tagCardColor = this.GetCardColor(tagCard);

            if (pokerColor == tagCardColor){
                sameColorList[sameColorList.length] = poker;
            }
        }
        return sameColorList;
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
    CheckPokerInList:function(list, tagCard) { 
        if (list.length == 0) return false;
    
        let bInList = false;
        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            let pos = item.indexOf(tagCard);
          

            if (pos >= 0){
                bInList = true;
            }
        }
        return bInList
    },
});
