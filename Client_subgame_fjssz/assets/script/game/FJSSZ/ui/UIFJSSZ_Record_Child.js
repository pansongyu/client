var app = require("fjssz_app");
cc.Class({
    extends: require(app.subGameName + "_BaseComponent"),

    properties: {
        jushu: cc.Label,
        btn_down:cc.Node,
        cardPrefab:cc.Prefab,
        cardNode:cc.Node,
        icon_mapai:cc.SpriteFrame,
    },

    OnLoad:function() {
        this.PokerCard = app[app.subGameName + "_PokerCard"]();
        this.SSSRoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
        this.LogicGame = app[app.subGameName.toUpperCase() + "LogicGame"]();

        this.redColor = new cc.Color(181,104,48);
        this.greenColor = new cc.Color(59,138,133);
    },

    //显示
    showInfo:function() {
        this.jushu.string = (this.itmeId + 1).toString();

        let playerResults = this.data.posResultList;

        for(let idx = 0; idx < playerResults.length; idx++){
            let child = this.node.getChildByName("lb_chengji0" + (idx+1).toString());
            child.getComponent(cc.Label).string = playerResults[idx].shui;
            if (playerResults[idx].shui < 0 && child) {
                child.color = this.greenColor;
            }
            else if(playerResults[idx].shui >= 0 && child){
                child.color = this.redColor;
            }
        }
    },

    setItemData:function(idx,data){
        this.itmeId = idx;
        this.data = eval('(' + data.dataJsonRes + ')');
        this.data.posResultList.sort(this.sortFunByPos);
        this.data.rankeds.sort(this.sortFunByPos);
        this.showInfo();
    },

    sortFunByPos:function(a,b){
        return a.posIdx - b.posIdx;
    },

    hiedeAllPlayer:function(){
        for(let i = 0; i < 8; i++){
            let node = cc.find("cardNode/" + "player" + (i+1).toString(),this.node);
            node.active = false;
        }
    },

    callBackDown:function(event){
        if(this.btn_down.scaleY == -1){
            this.btn_down.scaleY = 1;
            this.node.height -= this.cardNode.height;
            this.cardNode.active = false;
        }
        else{
            this.btn_down.scaleY = -1;
            this.node.height += this.cardNode.height;
            this.cardNode.active = true;
            let rankeds = this.data.rankeds;
            //如果玩家查看牌型 显示牌型 否则不显示
            this.hiedeAllPlayer();
            for(let i = 0; i < rankeds.length; i++){
                let node = cc.find("cardNode/" + "player" + (i+1).toString(),this.node);
                node.active = true;
                let dunPos = rankeds[i].dunPos;
                let special = rankeds[i].special;
                if(special != -1){
                    //显示特殊牌型
                    let specialNode = node.getChildByName('special_card');
                    specialNode.active = true;
                    let imagePath = "texture/game/sss/special/special_" + special;
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
                if(this.data.zjid == rankeds[i].pid){
                    node.getChildByName('zhuangjia').active = true;
                    if(this.data.beishu != 0){
                        node.getChildByName('beishu').active = true;
                        node.getChildByName('beishu').getComponent(cc.Label).string = 'x'+this.data.beishu;
                    }
                }

                let allCards = [];
                if(special == 85 || special == 95){
                    let pokers = dunPos.first.concat(dunPos.second,dunPos.third);
                    let tonghuas = this.LogicGame.SanTongHua(pokers);
                    for(let i = 0; i < tonghuas.length; i++){
                        for(let j = 0; j < tonghuas[i].length; j++){
                            allCards.push(tonghuas[i][j]);
                        }
                    }
                }
                else{
                    allCards = dunPos.first.concat(dunPos.second,dunPos.third);
                }
                for(let j = 0; j < node.children.length; j++){
                    let child = node.children[j];
                    if(child.name == 'zhuangjia' ||
                        child.name == 'beishu' ||
                        child.name == 'special_card'){
                        continue;
                    } 
                    if(!child.getChildByName("cardPrefab")){
                        let card = cc.instantiate(this.cardPrefab);
                        child.addChild(card);
                        this.ShowCard(allCards[j], card);
                    }
                    else{
                        let card = child.getChildByName("cardPrefab");
                        this.ShowCard(allCards[j], card);
                    }
                }
            }
        }
    },
    ShowCard:function(cardType, node){
        let newPoker = this.PokerCard.SubCardValue(cardType);
        this.PokerCard.GetPokeCard(newPoker, node);
        
        node.getChildByName("poker_back").active = false;

        let room = this.SSSRoomMgr.GetEnterRoom();
        if(!room)  return;

        let child = node.getChildByName("icon_mapai");
        if(child){
            child.removeFromParent();
        }
        let maPaiValue = room.GetRoomSet().GetRoomSetProperty("mapai");
        if(newPoker == maPaiValue){
            let icon = new cc.Node();
            icon.name = "icon_mapai";
            let sp = icon.addComponent(cc.Sprite);
            sp.spriteFrame = this.icon_mapai;
            node.addChild(icon);
        }
    },
    
});

