var app = require("pdk_app");


var LogicPDKGame = app.BaseClass.extend({
    Init:function(){
        this.JS_Name = "Logic"+app.subGameName.toUpperCase()+"Game";

        this.ComTool = app[app.subGameName+"_ComTool"]();
        this.WeChatManager = app[app.subGameName+"_WeChatManager"]();
        this.PokerCard = app[app.subGameName+"_PokerCard"]();
        this.RoomSet = app[app.subGameName.toUpperCase()+"RoomSet"]();
        this.Room = app[app.subGameName.toUpperCase()+"Room"]();
        this.Define = app[app.subGameName.toUpperCase()+"Define"]();
        
        //手牌
        this.handCardList = [];
        //选中的牌
        this.selectCardList = [];
        //上一个玩家出牌的牌型
        this.lastCardType = 0;
        //上一个玩家出牌的牌值
        this.latCardList = [];

        this.Log("Init");

        this.pokerType = [
            0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0A,0x0B,0x0C,0x0D,0x0E,   //方块 2-A
            0x12,0x13,0x14,0x15,0x16,0x17,0x18,0x19,0x1A,0x1B,0x1C,0x1D,0x1E,   //梅花 2-A
            0x22,0x23,0x24,0x25,0x26,0x27,0x28,0x29,0x2A,0x2B,0x2C,0x2D,0x2E,   //红桃 2-A
            0x32,0x33,0x34,0x35,0x36,0x37,0x38,0x39,0x3A,0x3B,0x3C,0x3D,0x3E,   ];//黑桃 2-A

        this.LOGIC_MASK_COLOR = 0xF0;
        this.LOGIC_MASK_VALUE = 0x0F;
    },

    InitHandCard:function(){
        this.handCardList = [];
        this.selectCardList = [];
        this.lastCardType = 0;
        this.lastCardList = [];

        let handCard = this.RoomSet.GetHandCard();
        for(let i = 0; i < handCard.length; i++){
            let card = handCard[i];
            this.handCardList.push(card);
        }

        this.SortCardByMax(this.handCardList);
        this.TransformValueToC(this.handCardList);
    },

    //如果服务端发过来的牌值有重复，转换成唯一
    TransformValueToC:function(pokers){
        for(let i = 0; i < pokers.length; i++){
            let poker = pokers[i];
            let count = 0;
            for(let j = i; j < pokers.length; j++){
                if(poker == pokers[j]){
                    count++;
                }
                if(count >= 2){
                    pokers[j] = pokers[j]+500;
                    break;
                }
            }
        }
    },

    //还原客户端转过的牌值
    TransformValueToS:function(pokers){
        for(let i = 0; i < pokers.length; i++){
            if(pokers[i] > 500){
                pokers[i] = pokers[i] - 500;
            }
        }
    },

    SortCardByMax:function(pokers){
        let self = this;
        pokers.sort(function(a, b){
            //return (b&0x0F) - (a&0x0F);
            return self.GetCardValue(b) - self.GetCardValue(a);
        });
    },

    SortCardByMinEx:function(pokers){
        let self = this;
        pokers.sort(function(a, b){
            //return (a&0x0F) - (b&0x0F);
            return self.GetCardValue(a) - self.GetCardValue(b);
        });
    },

    SortCardByMin:function(pokers){
        let self = this;
        pokers.sort(function(a, b){
            let aValue = a[0];
            let bValue = b[0];
            //return (aValue&0x0F) - (bValue&0x0F);
            return self.GetCardValue(aValue) - self.GetCardValue(bValue);
        });
    },

    OutPokerCard:function(handCardList){
        this.handCardList = handCardList;
        this.SortCardByMax(this.handCardList);
        this.selectCardList = [];
        //删除handcardlist和selectCardList中的元素
        // for(let i = 0; i < cardList.length; i++){
        //     let value = cardList[i];
        //     let pos = this.handCardList.indexOf(value+500);
        //     if(pos != -1){
        //         this.handCardList.splice(pos,1);
        //     }
        //     else{
        //         let pos1 = this.handCardList.indexOf(value);
        //         if(pos1 != -1){
        //             this.handCardList.splice(pos1,1);
        //         }
        //     }

        //     let cardPos = this.selectCardList.indexOf(value);
        //     if(cardPos != -1){
        //         this.selectCardList.splice(cardPos,1);
        //     }
        // }
        console.log("selectCardList == "+this.selectCardList);
        app[app.subGameName + "Client"].OnEvent("HandCard");
    },

    GetHandCard:function(){
        return this.handCardList;
    },

    GetSelectCard:function(){
        return this.selectCardList;
    },

    ChangeSelectCard:function(cardList){
        this.selectCardList = [];
        this.selectCardList = cardList;
    },

    SetCardSelected:function(cardIdx){
        let cardType = this.handCardList[cardIdx -1];
        this.selectCardList.push(cardType);
        console.log("selectCardList == "+this.selectCardList);
    },

    DeleteCardSelected:function(cardIdx){
        let cardType = this.handCardList[cardIdx -1];
        let pos = this.selectCardList.indexOf(cardType)
        if (pos != -1){
            this.selectCardList.splice(pos, 1);
        }
        console.log("selectCardList111 == "+this.selectCardList);
    },

    SetCardData(opCardType, cardList){
        if(opCardType == 1 || !cardList.length){
            return;
        }

        if(this.lastCardType == 0 || opCardType == 11){
            this.lastCardType = opCardType;
        }
        
        console.log("this.lastCardTyp =="+this.lastCardType);
        this.lastCardList = cardList;
    },

    ClearCardData:function(){
        this.lastCardType = 0;
        this.lastCardList = [];
    },

    GetLastCardType:function(){
        return this.lastCardType;
    },

    //检查组合是否只有炸弹
    CheckOnlyBoom:function(list){
        for(let i = 0; i < list.length; i++){
            let item = list[i];
            let sameCard = this.GetSameValue(item, item[0]);
            if(sameCard.length != item.length)
                return false;
        }
        return true;
    },

    CheckOneCard:function(isSelectCard = true){
        let pokers = [];
        if(isSelectCard==false){
            pokers = this.handCardList;
        }else{
            pokers = this.selectCardList;
        }
        this.SortCardByMax(pokers);
        if(pokers.length != 1) return false;
        let lastCardValue = 0;
        let myCardValue = 0;

        lastCardValue = this.GetCardValue(this.lastCardList[0]);
        myCardValue = this.GetCardValue(pokers[0]);

        if(lastCardValue && lastCardValue != 0){
            if(this.lastCardList.length != pokers.length) return false;
            if(myCardValue > lastCardValue){
                return true;
            }
            return false;
        }

        return true;
    },

    CheckDuizi:function(isSelectCard = true){
        let pokers = [];
        if(isSelectCard==false){
            pokers = this.handCardList;
        }else{
            pokers = this.selectCardList;
        }
        this.SortCardByMax(pokers);
        if(pokers.length != 2) return false;

        let lastCardValue = 0;
        let myCardValue = 0;
        let bDui = false;

        lastCardValue = this.GetCardValue(this.lastCardList[0]);
        
        for(let i = 0; i < pokers.length; i++){
            let poker = pokers[i];
            let duizi = this.GetSameValue(pokers, poker);
            if(duizi.length == 2){
                myCardValue = this.GetCardValue(poker);
                bDui = true;
                break;
            }
        }

        if(lastCardValue && lastCardValue != 0){
            if(this.lastCardList.length != pokers.length) return false;
            
            if(myCardValue > lastCardValue){
                return true;
            }
            return false;
        }

        if(bDui)
            return true;
        return false;
    },

    CheckShunzi:function(isSelectCard = true){
        let pokers = [];
        if(isSelectCard==false){
            pokers = this.handCardList;
        }else{
            pokers = this.selectCardList;
        }
        this.SortCardByMax(pokers);
        if(pokers.length < 5) return false;

        let lastCardValue = 0;
        let myCardValue = 0;

        this.SortCardByMax(this.lastCardList);
        this.SortCardByMax(pokers);

        let lastValue = 0;
        for(let i = 0; i < pokers.length; i++){
            let poker = pokers[i];
            let nowValue = this.GetCardValue(poker);

            if(nowValue == 15){
                return false;
            }

            if(lastValue != 0){
                if(lastValue - nowValue != 1)
                    return false;
            }
            
            lastValue = nowValue;
        }

        lastCardValue = this.GetCardValue(this.lastCardList[0]);
        myCardValue = this.GetCardValue(pokers[0]);

        if(lastCardValue && lastCardValue != 0){
            if(this.lastCardList.length != pokers.length) return false;
            
            if(myCardValue > lastCardValue){
                return true;
            }
            return false;
        }

        return true;
    },

    //如果最后首发只有三带 可以不带牌出, isSelectCard如果为false那么就是判断所有手牌是否满足最后一手牌直接出
    CheckLastThree:function(tag, lastCard, isSelectCard = true){
        let pokers = [];
        if (isSelectCard) {
            pokers = this.selectCardList;
        }else{
            pokers = this.handCardList;
        }
        if(this.lastCardType == 0){
            if(pokers.length != lastCard ||
                this.handCardList.length != lastCard){
                return false;
            }
            
            let isCheck = false;
            for(let i = 0; i < pokers.length; i++){
                let poker = pokers[i];
                let samePoker = this.GetSameValue(pokers, poker);
                if(samePoker.length >= tag){
                    isCheck = true;
                    break;
                }
            }
            if(isCheck){
                return true;
            }
        }
        return false;
    },

    CheckSanDaiSiDai:function(tag, isSelectCard = true){ 
        if(tag == 5){
            if(!this.CheckLastThree(3, 3, isSelectCard) && this.lastCardType == 0){
                //没有三不带的玩法 不检测
                if(!this.Room.GetRoomWanfa(this.Define.SEVER_BUDAI3)) return false;
            }
        }
        else if(tag == 6){
            if(!this.CheckLastThree(3, 4, isSelectCard) && this.lastCardType == 0){
                 //没有三带一的玩法 不检测
                if(!this.Room.GetRoomWanfa(this.Define.SEVER_DAI31)) return false;
            }
        }
        else if(tag == 7){
            // //没有三带二的玩法 不检测
            if(!this.Room.GetRoomWanfa(this.Define.SEVER_DAI32)) return false;
        }
        else if(tag == 8){
            //没有四带一的玩法 不检测
            if(!this.Room.GetRoomWanfa(this.Define.SEVER_BMUSTBOMB)) return false;
            if(!this.CheckLastThree(4, 5, isSelectCard) && this.lastCardType == 0){
                if(!this.Room.GetRoomSiDai(0)) return false;
            }
        }
        else if(tag == 9){
            //没有四带二的玩法 不检测
            if(!this.Room.GetRoomWanfa(this.Define.SEVER_BMUSTBOMB)) return false;
            if(!this.CheckLastThree(4, 6, isSelectCard) && this.lastCardType == 0){
                if(!this.Room.GetRoomSiDai(1)) return false;
            }
        }
        else if(tag == 10){
            //没有四带三的玩法 不检测
            if(!this.Room.GetRoomWanfa(this.Define.SEVER_BMUSTBOMB)) return false;
            if(!this.Room.GetRoomWanfa(this.Define.SEVER_DAI43)){
                if(!this.Room.GetRoomSiDai(2)) return false;
            }
            
        }
        
        let pokers = [];
        if(isSelectCard==false){
            pokers = this.handCardList;
        }else{
            pokers = this.selectCardList;
        }
        this.SortCardByMax(pokers);
        let handPokers = this.handCardList;
        if(pokers.length < 3) return false;
        
        let lastCardValue = 0;
        let myCardValue = 0;
        let tempArrA = [];
        let tempArrB = [];

        for(let i=0; i < this.lastCardList.length; i++){
            let poker = this.lastCardList[i];
            let samePoker = this.GetSameValue(this.lastCardList, poker);
            if(tag >= 5 && tag <= 7){
                if(samePoker.length >= 3){
                    this.RegularCard(tempArrA, samePoker, 3);
                    //tempArrA = samePoker;
                    break;
                }
            }
            else if(tag >= 8 && tag <= 10){
                if(samePoker.length >= 4){
                    this.RegularCard(tempArrA, samePoker, 4);
                    //tempArrA = samePoker;
                    break;
                }
            }
        }

        for(let i=0; i < pokers.length; i++){
            let poker = pokers[i];
            let samePoker = this.GetSameValue(pokers, poker);
            if(tag >= 5 && tag <= 7){
                if(samePoker.length >= 3){
                    this.RegularCard(tempArrB, samePoker, 3);
                    //tempArrB = samePoker;
                    break;
                }
            }
            else if(tag >= 8 && tag <= 10){
                if(samePoker.length >= 4){
                    this.RegularCard(tempArrB, samePoker, 4);
                    //tempArrB = samePoker;
                    break;
                }
            }
        }
        if(tempArrA.length){
            lastCardValue = this.GetCardValue(tempArrA[0][0]);
        }
        
        if(tempArrB.length){
            myCardValue = this.GetCardValue(tempArrB[0][0]);
        }
        let daiCardList = this.GetDaiPaiList(pokers, tempArrB);
        if(lastCardValue && lastCardValue != 0){
            if(isSelectCard && this.lastCardList.length != pokers.length && handPokers.length > pokers.length && !this.CheckTagIsDuizi(daiCardList))
                return false;
            else{
                //如果牌值为A并且存在3A炸
                if(myCardValue == 14 && this.Room.GetRoomWanfa(this.Define.SEVER_AAA)){
                    //如果存在炸弹可拆玩法  可出
                    if(!this.Room.GetRoomWanfa(this.Define.SEVER_BMUSTBOMB)){
                        return false;
                    }
                }
            }
            //如果是用手牌来判断最后一手牌能不能出，则不能超过上把牌的长度
            if (!isSelectCard && pokers.length > this.lastCardList.length) {
                return false;
            }
            if(myCardValue > lastCardValue){
                if(tag == 6){//三带一玩法不判断带牌
                    return true;
                }else if(tag == 7){
                    return true;
                }else if(tag == 8 && this.lastCardList.length == pokers.length){//四带一并且长度相等可以压
                    return true;
                }else if(tag == 9 && this.lastCardList.length == pokers.length){//四带二并且长度相等可以压
                    return true;
                }else if(tag == 10 && this.lastCardList.length == pokers.length){//四带三并且长度相等可以压
                    return true;
                }else if(tag == 10 && pokers.length>=5 && this.handCardList.length == pokers.length){  //最后一首直接出
                    return true;
                }
            }
            return false;
        }
        if(tempArrB.length){
            if(tag == 5){
                if(pokers.length == 3){
                    return true;
                }
            }
            else if(tag == 6){
                if(pokers.length == 4){
                    return true;
                }
            }
            else if(tag == 7){
                //还需判断是否最后一手牌能出完
                if(pokers.length==5){
                    return true;
                }else if(pokers.length<=5){
                    //是不是最后一首，如果是。也可以出
                    if(this.handCardList.length<=5 && this.handCardList.length == pokers.length){
                        return true;
                    }
                }
            }
            else if(tag == 8){
                if(pokers.length == 5){
                    return true;
                }
            }
            else if(tag == 9){
                if(pokers.length == 6){
                    return true;
                }else if(pokers.length<6){
                    //是不是最后一首，如果是。也可以出
                    if(this.handCardList.length<6 && this.handCardList.length == pokers.length){
                        return true;
                    }
                }
            }
            else if(tag == 10){
                //还需判断是否最后一手牌能出完
                if( pokers.length == 7){
                    return true;
                }else if(pokers.length<7){
                    //是不是最后一首，如果是。也可以出
                    if(this.handCardList.length<7 && this.handCardList.length == pokers.length){
                        return true;
                    }
                }
            }
        }
        return false;
    },

    IsZhadan:function(pokers){
        let temp = [];
        for(let i=0; i < pokers.length; i++){
            let poker = pokers[i];
            let zhadan = this.GetSameValue(pokers, poker);
            if(zhadan.length >= 4){
                temp = zhadan;
                break;
            }
            //是否有3A炸玩法
            // if(this.Room.GetRoomWanfa(this.Define.PDK_WANFA_3AZHA)){
            if(this.Room.GetRoomWanfa(this.Define.SEVER_AAA)){
                if(zhadan.length == 3 && this.GetCardValue(zhadan[0]) == 14){
                    temp = zhadan;
                    break;
                }
            }
            if(this.Room.GetRoomWanfa(this.Define.SEVER_2A_22)){
                if(zhadan.length == 2 && this.GetCardValue(zhadan[0]) == 14){
                    temp = zhadan;
                    break;
                }
                if(zhadan.length == 2 && this.GetCardValue(zhadan[0]) == 15){
                    temp = zhadan;
                    break;
                }
            }
        }
        if(pokers.length){
            if(pokers.length - temp.length == 0){
                return true;
            }
        }
        return false;
    },
    
    CheckZhaDan:function(isSelectCard = true){
        let pokers = [];
        if(isSelectCard==false){
            pokers = this.handCardList;
        }else{
            pokers = this.selectCardList;
        }
        this.SortCardByMax(pokers);
        let lastCardValue = 0;
        let myCardValue = 0;

        if(this.IsZhadan(pokers)){
            return true;
        }
        if(this.IsZhadan(this.lastCardList)){
            lastCardValue = this.GetCardValue(this.lastCardList[0]);
        }

        if(this.IsZhadan(pokers)){
            if(lastCardValue == 0) return true;
            myCardValue = this.GetCardValue(pokers[0]);
        }
        else{
            return false;
        }
        
        //先比较牌值再比较张数
        if(myCardValue > lastCardValue){
            if(pokers.length >= this.lastCardList.length){
                return true;
            }
        }
        else if(myCardValue <= lastCardValue){
            if(pokers.length > this.lastCardList.length){
                return true;
            }
        }

        return false;
    },

    IsLianShun:function(pokers){
        if(pokers.length < 2) return false;
        
        this.SortCardByMin(pokers);

        let lastValue = 0;
        for(let i = 0; i < pokers.length; i++){
            let item = pokers[i];
            let nowValue = this.GetCardValue(item[0]);

            if(nowValue == 15){
                return false;
            }

            if(lastValue != 0){
                if((lastValue+1) != nowValue)
                    return false;
            }
            
            lastValue = nowValue;
        }

        return true;
    },

    //如果有超过tag只取tag数量的牌
    RegularCard:function(pokers, list, tag){
        let temp = [];
        for(let i = 0; i < list.length; i++){
            if(temp.length == tag) break;
            temp.push(list[i]);
        }
        //过滤掉可能相同的元素
        let haveSameArray=false;
        for(let i=0;i<pokers.length;i++){
            if(pokers[i].toString()==temp.toString()){
                haveSameArray=true;
                break;
            }
        }
        if(haveSameArray==false){
            pokers[pokers.length] = temp;
        }
    },

    GetDaiNum:function(){
        return this.daiNum;
    },
    
    CheckFeiJi:function(tag, isSelectCard = true){
        let handPokers = this.handCardList;
        let pokers = [];
        if(isSelectCard==false){
            pokers = this.handCardList;
        }else{
            pokers = this.selectCardList;
        }
        this.SortCardByMax(pokers);
        if(pokers.length < 6) return false;

        let lastCardValue = 0;
        let myCardValue = 0;
        let tempArrA = [];
        let tempArrB = [];

        for(let i = 0; i < this.lastCardList.length; i++){
            let poker = this.lastCardList[i];
            let santiao = this.GetSameValue(this.lastCardList, poker);
            let bInList = this.CheckPokerInListEx(tempArrA, poker);
            if(santiao.length >= tag && !bInList){
                this.RegularCard(tempArrA, santiao, tag);
            }
        }

        for(let i=0; i < pokers.length; i++){
            let poker = pokers[i];
            let santiao = this.GetSameValue(pokers, poker);
            let bInList = this.CheckPokerInListEx(tempArrB, poker);
            if(santiao.length >= tag && !bInList){
                this.RegularCard(tempArrB, santiao, tag);
            }
        }

        if(tempArrA.length){
            let realPlaneA = this.GetRealPlane(tempArrA)
            lastCardValue = this.GetCardValue(realPlaneA[0][0]);
        }
        
        if(tempArrB.length < 2) return false;
        
        this.SortCardByMin(tempArrB);

        let realPlane = this.GetRealPlane(tempArrB);

        if(!realPlane.length) return false;

        myCardValue = this.GetCardValue(realPlane[0][0]);
        //判断牌值是否大于上家
        if(lastCardValue && lastCardValue != 0 && myCardValue <= lastCardValue){
                return false;
        }
        let value = (pokers.length - realPlane.length * tag);
        this.daiNum = value;
        let daiPaiList = this.GetDaiPaiList(pokers, realPlane);
        if(tag == 3){
            if(this.Room.GetRoomWanfa(this.Define.SEVER_BUDAI3)){
                if(value == 0){
                    return true;
                }
            }
            // else if(this.Room.GetRoomWanfa(this.Define.SEVER_DAI31)){
            //     if(value == realPlane.length){
            //         return true;
            //     }
            //     else if (handPokers.length <= (realPlane.length * tag + realPlane.length)
            //         && handPokers.length == pokers.length) {
            //         //如果手牌少于需要带的牌数并且轮到本家出牌则返回true
            //         return true;
            //     }
            // }
            else if(true){//飞机三带二固定的
                if(realPlane.length==3 && value==1){
                    //三飞机带单根,可以组成  444,555 带 333,6
                    return true;
                }
                else if(value == realPlane.length * 2){
                    return true;
                }
                //lastCardValue == 0 && 
                else if (handPokers.length <= (realPlane.length * tag + realPlane.length * 2)
                    && handPokers.length == pokers.length) {
                    //如果手牌少于需要带的牌数并且轮到本家出牌则返回true
                    return true;
                }
            }
        }
        else if(tag == 4){
            if(this.Room.GetRoomSiDai(0)){
                if(value == realPlane.length){
                    return true;
                }
                else if (handPokers.length <= (realPlane.length * tag + realPlane.length)
                    && handPokers.length == pokers.length) {
                    //如果手牌少于需要带的牌数并且轮到本家出牌则返回true
                    return true;
                }
            }
            else if(this.Room.GetRoomSiDai(1)){
                if(value == realPlane.length * 2){
                    return true;
                }
                else if (handPokers.length <= (realPlane.length * tag + realPlane.length * 2)
                    && handPokers.length == pokers.length) {
                    //如果手牌少于需要带的牌数并且轮到本家出牌则返回true
                    return true;
                }
            }
            // else if(this.Room.GetRoomWanfa(this.Define.PDK_WANFA_4DAI3)){
            else if(this.Room.GetRoomSiDai(2)){
                if(value == realPlane.length * 3){
                    return true;
                }
                else if (handPokers.length <= (realPlane.length * tag + realPlane.length * 3)
                    && handPokers.length == pokers.length) {
                    //如果手牌少于需要带的牌数并且轮到本家出牌则返回true
                    return true;
                }
            }
        }
        
        return false;
    },

    CheckLianDui:function(isSelectCard = true){
        let pokers = [];
        if(isSelectCard==false){
            pokers = this.handCardList;
        }else{
            pokers = this.selectCardList;
        }
        this.SortCardByMax(pokers);
        if(pokers.length < 4) return false;
        if(pokers.length%2 == 1) return false;

        let lastCardValue = 0;
        let myCardValue = 0;
        let tempArrA = [];
        let tempArrB = [];

        for(let i = 0; i < this.lastCardList.length; i++){
            let poker = this.lastCardList[i];
            let duizi = this.GetSameValue(this.lastCardList, poker);
            let bInList = this.CheckPokerInList(tempArrA, poker);
            if(duizi.length == 2 && !bInList){
                tempArrA[tempArrA.length] = duizi;
            }
        }

        for(let i = 0; i < pokers.length; i++){
            let poker = pokers[i];
            let duizi = this.GetSameValue(pokers, poker);
            let bInList = this.CheckPokerInList(tempArrB, poker);
            if(duizi.length == 2 && !bInList){
                tempArrB[tempArrB.length] = duizi;
            }
        }

        if(tempArrB.length * 2 != pokers.length) return false;

        if(this.IsLianShun(tempArrA)){
            lastCardValue = this.GetCardValue(tempArrA[0][0]);
        }

        if(this.IsLianShun(tempArrB)){
            myCardValue = this.GetCardValue(tempArrB[0][0]);
        }
        else{
            return false;
        }
        
        if(lastCardValue && lastCardValue != 0){
            if((pokers.length - this.lastCardList.length) == 0){
                if(myCardValue > lastCardValue){
                    return true;
                }
            }
            return false;
        }
        return true;
    },

    //检查顺子是不是一条龙
    CheckDragon:function(){
        let pokers = this.lastCardList;
        if(pokers.length != 12) return false;

        this.SortCardByMinEx(pokers);

        let lastValue = 0;
        for(let i = 0; i < pokers.length; i++){
            let poker = pokers[i];
            let nowValue = this.GetCardValue(poker);
            if(nowValue == lastValue) return false;

            if(nowValue == 15) return false;

            if(lastValue != 0){
                if(nowValue - lastValue != 1)
                    return false;
            }

            lastValue = nowValue;
        }

        return true; 
    },
    IsHaveBoom:function(isSelectCard = false){
        let pokers = [];
        if(isSelectCard==false){
            pokers = this.handCardList;
        }else{
            pokers = this.selectCardList;
        }
        for(let i = 0; i < pokers.length; i++){
            let poker = pokers[i];
            let zhadan = this.GetSameValue(pokers, poker);
            if(zhadan.length >= 4){
                return true;
            }
            if(this.Room.GetRoomWanfa(this.Define.SEVER_AAA)){
                if(zhadan.length == 3 && this.GetCardValue(zhadan[0]) == 14){
                    return true;
                }
            }
            if(this.Room.GetRoomWanfa(this.Define.SEVER_2A_22)){
                if(zhadan.length == 2 && this.GetCardValue(zhadan[0]) == 14){
                    return true;
                }
                if(zhadan.length == 2 && this.GetCardValue(zhadan[0]) == 15){
                    return true;
                }
            }
        }
        return false;
    },
    IsDismantleBoom:function(){
        let pokers = this.handCardList;
        if(this.CheckZhaDan()){
            return false;
        }
        for(let i = 0; i < pokers.length; i++){
            let poker = pokers[i];
            if(this.selectCardList.indexOf(poker) != -1){
                let zhadan = this.GetSameValue(pokers, poker);
                if(zhadan.length >= 4){
                    return true;
                }
                // if(this.Room.GetRoomWanfa(this.Define.PDK_WANFA_3AZHA)){
                if(this.Room.GetRoomWanfa(this.Define.SEVER_AAA)){
                    if(zhadan.length == 3 && this.GetCardValue(zhadan[0]) == 14){
                        return true;
                    }
                }
                if(this.Room.GetRoomWanfa(this.Define.SEVER_2A_22)){
                    if(zhadan.length == 2 && this.GetCardValue(zhadan[0]) == 14){
                        return true;
                    }
                    if(zhadan.length == 2 && this.GetCardValue(zhadan[0]) == 15){
                        return true;
                    }
                }
            }
        }
        
        return false;
    },

    GetCardType:function(isSelectCard = true){
        //0:可以随便出牌 1:不出 2:单牌 3:对子 4:顺子 5:3不带 6:3带1 7:3带2 8:4带1 9:4带2 10:4带3 
        //11:炸弹 12:三带飞机 13:四带飞机 14:连对
        this.daiNum = 0;

        if(isSelectCard && !this.selectCardList.length){
            return 0;
        }
        
        let bCheck = false;

        if(this.CheckZhaDan(isSelectCard)){
            return 11;
        }
        
        if(this.lastCardType == 0){
            if(this.CheckOneCard(isSelectCard)){
                return 2;
            }
            else if(this.CheckDuizi(isSelectCard)){
                return 3;
            }
            else if(this.CheckShunzi(isSelectCard)){
                return 4;
            }
            else if(this.CheckSanDaiSiDai(10, isSelectCard) && this.Room.GetRoomWanfa(this.Define.SEVER_BMUSTBOMB)){
                return 10;
            }
            else if(this.CheckSanDaiSiDai(9, isSelectCard) && this.Room.GetRoomWanfa(this.Define.SEVER_BMUSTBOMB)){
                return 9;
            }
            else if(this.CheckSanDaiSiDai(8, isSelectCard) && this.Room.GetRoomWanfa(this.Define.SEVER_BMUSTBOMB)){
                return 8;
            }
            else if(this.CheckSanDaiSiDai(7, isSelectCard)){
                return 7;
            }
            /*else if(this.CheckSanDaiSiDai(6, isSelectCard)){
                return 6;
            }*/
            /*else if(this.CheckSanDaiSiDai(5, isSelectCard)){
                return 5;
            }*/
            else if(this.CheckFeiJi(3, isSelectCard)){
                return 12;
            }
            else if(this.CheckFeiJi(4, isSelectCard)){
                return 13;
            }
            else if(this.CheckLianDui(isSelectCard)){
                return 14;
            }
            else{
                return 0;
            }
        }
        else if(this.lastCardType == 2){
            if(this.CheckOneCard(isSelectCard)){
                bCheck = true;
            }
        }
        else if(this.lastCardType == 3){
            if(this.CheckDuizi(isSelectCard)){
                bCheck = true;
            }
        }
        else if(this.lastCardType == 4){
            if(this.CheckShunzi(isSelectCard)){
                bCheck = true;
            }
        }
        else if((this.lastCardType == 5) || (this.lastCardType == 6) || (this.lastCardType == 7) ||
                (this.lastCardType == 8) || (this.lastCardType == 9) || (this.lastCardType == 10)){
                if(this.CheckSanDaiSiDai(this.lastCardType, isSelectCard)){
                    bCheck = true;
                }
        }
        else if((this.lastCardType == 12)){
            if(this.CheckFeiJi(3, isSelectCard)){
                bCheck = true;
            }
        }
        else if(this.lastCardType == 13){
            if(this.CheckFeiJi(4, isSelectCard)){
                bCheck = true;
            }
        }
        else if(this.lastCardType == 14){
            if(this.CheckLianDui(isSelectCard)){
                bCheck = true;
            }
        }

        if(bCheck){
            return this.lastCardType;
        }

        return 0;
    },
    //0:可以随便出牌 1:不出 2:单牌 3:对子 4:顺子 5:3不带 6:3带1 7:3带2 8:4带1 9:4带2 10:4带3 
        //11:炸弹 12:三带飞机 13:四带飞机 14:连对
    GetTipCardSlCard:function(){
        let array = [];
        // if(this.lastCardType == 2){
        //     array = this.GetOneCard(true);
        // }
        // else if(this.lastCardType == 3){
        //     array = this.GetDuizi(true);
        // }
        // else 
        if(this.lastCardType == 2){
            array = this.GetOneCard(true);
        }
        else if(this.lastCardType == 3){
            array = this.GetDuizi(true);
        }
        else if(this.lastCardType == 4){
            array = this.GetShunzi(true);
        }
        else if(this.lastCardType == 5 || this.lastCardType == 6 ||this.lastCardType == 7){
            array = this.GetSanDai(true);                
        }
        else if((this.lastCardType == 8 || this.lastCardType == 9 ||this.lastCardType == 10) && this.Room.GetRoomWanfa(this.Define.SEVER_BMUSTBOMB)){
            array = this.GetSiDai(true);
        }
        else if(this.lastCardType == 11){
            array = this.GetZhaDan(true);
        }
        else if(this.lastCardType == 12){
            array = this.GetFeiJi(3,true);
        }
        else if(this.lastCardType == 13){
            array = this.GetFeiJi(4,true);
        }
        else if(this.lastCardType == 14){
            array = this.GetLianDui(true);
        }
        else if(this.lastCardType==0){
            //随意出牌
            array.push.apply(array, this.GetDuiziTip(true));
            array.push.apply(array, this.GetShunziTip(true));
            array.push.apply(array, this.GetSanDaiTip(7,true));
            array.push.apply(array, this.GetFeiJiTip(3,true));
            array.push.apply(array, this.GetFeiJiTip(4,true));
            if(this.Room.GetRoomWanfa(this.Define.SEVER_BMUSTBOMB)){
                array.push.apply(array, this.GetSiDaiTip(10,true));
            }
            array.push.apply(array, this.GetLianDuiTip(true));
        }
        if(array.length>0){
             array.sort(this.SortByLength);
        }
        return array;
    },
    SortByLength:function(a,b){
        if(a.length>b.length){
            return -1;
        }
        return 1;
    },
    GetTipCard:function(){
        let array = [];
        console.log("GetTipCard", this.lastCardType)
        if(this.lastCardType < 2){
            array = array.concat(this.GetZhaDanTip());
            array = array.concat(this.GetLianDui());
            array = array.concat(this.GetFeiJi(4));
            array = array.concat(this.GetFeiJi(3));
            array = array.concat(this.GetDuizi());
            array = array.concat(this.GetShunzi());
            array = array.concat(this.GetSanDaiTip(7));
            array = array.concat(this.GetSiDai());
            array = array.concat(this.GetOneCard());
            return array;
        }
        if(this.lastCardType == 2){
            array = this.GetOneCard();
        }
        else if(this.lastCardType == 3){
            array = this.GetDuizi();
        }
        else if(this.lastCardType == 4){
            array = this.GetShunzi();
        }
        else if(this.lastCardType == 5 || this.lastCardType == 6 ||this.lastCardType == 7){
            array = this.GetSanDai();                
        }
        else if(this.lastCardType == 8 || this.lastCardType == 9 ||this.lastCardType == 10){
            array = this.GetSiDai();
        }
        else if(this.lastCardType == 11){
            array = this.GetZhaDan();
        }
        else if(this.lastCardType == 12){
            array = this.GetFeiJi(3);
        }
        else if(this.lastCardType == 13){
            array = this.GetFeiJi(4);
        }
        else if(this.lastCardType == 14){
            array = this.GetLianDui();
        }
        return array;
    },

    CheckSelected:function(cardValue){
        if (-1 == this.selectCardList.indexOf(cardValue)){
            return false;
        }
        return true;
    },

    //0:可以随便出牌 1:不出 2:单牌 3:对子 4:顺子 5:3不带 6:3带1 7:3带2 8:4带1 9:4带2 10:4带3 
    //11:炸弹 12:三带飞机 13:四带飞机 14:连对
    GetZhaDanTip:function(isSelectCard=false){
        let pokers = [];
        if(isSelectCard==false){
             pokers = this.handCardList;
        }else{
             pokers = this.selectCardList;
        }
        let zhadans = [];
        
        for(let i = pokers.length - 1; i >= 0; i--){
            let poker = pokers[i];
            let zhadan = this.GetSameValue(pokers, poker);
            let bInList = this.CheckPokerInListEx(zhadans, poker);
            if(zhadan.length == 4 && !bInList){
                zhadans[zhadans.length] = zhadan;
            }
            if(this.Room.GetRoomWanfa(this.Define.SEVER_AAA)){
                if(zhadan.length == 3 && !bInList && this.GetCardValue(zhadan[0]) == 14){
                    zhadans[zhadans.length] = zhadan;
                }
            }
            if(this.Room.GetRoomWanfa(this.Define.SEVER_2A_22)){
                if(zhadan.length == 2 && !bInList && this.GetCardValue(zhadan[0]) == 14){
                    zhadans[zhadans.length] = zhadan;
                }
                if(zhadan.length == 2 && !bInList && this.GetCardValue(zhadan[0]) == 15){
                    zhadans[zhadans.length] = zhadan;
                }
            }
        }
        return zhadans;
    },
    GetZhaDan:function(){
        let pokers = this.handCardList;
        let zhadans = [];

        let lastCardValue = 0;
        lastCardValue = this.GetCardValue(this.lastCardList[0]);
        //存在3A炸玩法并且3A炸最大  直接提示
        if(this.Room.GetRoomWanfa(this.Define.SEVER_AAA) && this.Room.GetRoomWanfa(this.Define.SEVER_MAXAAA)){
            if(lastCardValue == 14){
                return zhadans;
            }
        }
        
        for(let i = pokers.length - 1; i >= 0; i--){
            let poker = pokers[i];
            let zhadan = this.GetSameValue(pokers, poker);
            let bInList = this.CheckPokerInListEx(zhadans, poker);
            if(zhadan.length > this.lastCardList.length && !bInList && zhadan.length >= 4){
                zhadans[zhadans.length] = zhadan;
            }
            else if(zhadan.length == this.lastCardList.length && !bInList && this.GetCardValue(zhadan[0]) > lastCardValue){
                zhadans[zhadans.length] = zhadan;
            }
            // if(this.Room.GetRoomWanfa(this.Define.PDK_WANFA_3AZHA)){
            if(this.Room.GetRoomWanfa(this.Define.SEVER_AAA)){
                //3A炸最大
                if(this.Room.GetRoomWanfa(this.Define.SEVER_MAXAAA)){
                    if(zhadan.length == 3 && !bInList && this.GetCardValue(zhadan[0]) == 14){
                        zhadans[zhadans.length] = zhadan;
                    }
                }
                //3A炸最小
                else{
                    if(lastCardValue == 0){
                        if(zhadan.length == 3 && !bInList && this.GetCardValue(zhadan[0]) == 14){
                            zhadans[zhadans.length] = zhadan;
                        }
                    }
                }
            }
            if(this.Room.GetRoomWanfa(this.Define.SEVER_2A_22)){
                if(lastCardValue == 0){
                    if(zhadan.length == 2 && !bInList && this.GetCardValue(zhadan[0]) == 14){
                        zhadans[zhadans.length] = zhadan;
                    }
                    if(zhadan.length == 2 && !bInList && this.GetCardValue(zhadan[0]) == 15){
                        zhadans[zhadans.length] = zhadan;
                    }
                }
                else
                {
                    if(zhadan.length == 2 && !bInList && this.GetCardValue(zhadan[0]) == 15 && 14 == lastCardValue){
                        zhadans[zhadans.length] = zhadan;
                        console.log
                    }
                }
            }
        }
        return zhadans;
    },

    GetZhaDanEx:function(array,isSelectCard=false){
        let pokers = [];
        if(isSelectCard==false){
            pokers = this.handCardList;
        }else{
            pokers = this.selectCardList;
        }
        let zhadans = [];
        let arrLen = array.length;//先记录下原来数组的长度，方便后续插入三A炸弹
        console.log("GetZhaDanEx", pokers)
        for(let i=0; i < pokers.length; i++){
            let poker = pokers[i];
            let zhadan = this.GetSameValue(pokers, poker);
            let bInList = this.CheckPokerInListEx(zhadans, poker);
            if(zhadan.length >= 4 && !bInList){
                zhadans[zhadans.length] = zhadan;
            }
            //是否有3A炸玩法
            // if(this.Room.GetRoomWanfa(this.Define.PDK_WANFA_3AZHA)){
            if(this.Room.GetRoomWanfa(this.Define.SEVER_AAA)){    
                if(zhadan.length == 3 && this.GetCardValue(zhadan[0]) == 14 && !bInList){
                    zhadans[zhadans.length] = zhadan;
                }
            }
            if(this.Room.GetRoomWanfa(this.Define.SEVER_2A_22)){    
                if(zhadan.length == 2 && this.GetCardValue(zhadan[0]) == 14 && !bInList){
                    zhadans[zhadans.length] = zhadan;
                }
                else if(zhadan.length == 2 && this.GetCardValue(zhadan[0]) == 15 && !bInList){
                    zhadans[zhadans.length] = zhadan;
                }
            }
        }
        for(let i = zhadans.length - 1; i >= 0; i--){
            let item = zhadans[i];
            //对炸弹进行排序，从最小炸弹开始，3A是最小的炸弹
            if (item.length == 3) {
                array.splice(arrLen,0,item);
            } else {
                array.push(item);
            }
            
        }
    },

    PushTipCard:function(pokers, samePoker, len){
        let temp = [];
        samePoker.reverse();
        for(let i = 0; i < len; i++){
            temp.push(samePoker[i]);
        }

        pokers.push(temp);
    },

    GetOneCard:function(isSelectCard=false){
        let pokers = [];
        if(isSelectCard==false){
            pokers = this.handCardList;
        }else{
            pokers = this.selectCardList;
        }
        let array = [];
        let chai = [];

        let lastCardValue = this.GetCardValue(this.lastCardList[0]);

        for(let i = pokers.length - 1; i >= 0; i--){
            let poker = pokers[i];
            let cardValue = this.GetCardValue(poker);
            if(cardValue <= lastCardValue) continue;
            let sameValue = this.GetSameValue(pokers, poker);
            let bInList = this.CheckPokerInListEx(chai, poker);
            if(sameValue.length == 1){
                this.PushTipCard(array, sameValue, 1);
            }
            else if(sameValue.length > 1 && !bInList){
                this.PushTipCard(chai, sameValue, 1);
            }
        }
        array.push.apply(array, chai);
        this.GetZhaDanEx(array,isSelectCard);
        return array;
    },

    GetDuiziTip:function(isSelectCard=false){
        let pokers = [];
        if(isSelectCard==false){
            pokers = this.handCardList;
        }else{
            pokers = this.selectCardList;
        }
        let duizis = [];
        let chai = [];
        for(let i = pokers.length - 1; i >= 0; i--){
            let poker = pokers[i];
            let cardValue = this.GetCardValue(poker);
            let duizi = this.GetSameValue(pokers, poker);
            let bInList = this.CheckPokerInListEx(duizis, poker);
            let bInListEx = this.CheckPokerInListEx(chai, poker);
            if(duizi.length == 2 && !bInList){
                this.PushTipCard(duizis, duizi, 2);
            }
            else if(duizi.length > 2 && !bInListEx){
                this.PushTipCard(chai, duizi, 2);
            }
        }
        duizis.push.apply(duizis, chai);
        return duizis;
    },
   
    GetDuizi:function(isSelectCard=false){
        let pokers = [];
        if(isSelectCard==false){
            pokers = this.handCardList;
        }else{
            pokers = this.selectCardList;
        }
        let duizis = [];
        let chai = [];
        // if(pokers.length < this.lastCardList.length) return [];

        let lastCardValue = this.GetCardValue(this.lastCardList[0]);

        for(let i = pokers.length - 1; i >= 0; i--){
            let poker = pokers[i];
            let cardValue = this.GetCardValue(poker);
            if(cardValue <= lastCardValue) continue;
            let duizi = this.GetSameValue(pokers, poker);
            let bInList = this.CheckPokerInListEx(duizis, poker);
            let bInListEx = this.CheckPokerInListEx(chai, poker);
            if(duizi.length == 2 && !bInList){
                this.PushTipCard(duizis, duizi, 2);
            }
            else if(duizi.length > 2 && !bInListEx){
                this.PushTipCard(chai, duizi, 2);
            }
        }
        duizis.push.apply(duizis, chai);
        this.GetZhaDanEx(duizis,isSelectCard);
        return duizis;
    },

    GetShunziTip:function(isSelectCard = false){
        let pokers = [];
        if(isSelectCard==false){
            pokers = this.handCardList;
        }else{
            pokers = this.selectCardList;
        }
        this.SortCardByMax(pokers);
        let array = [];
        for(let i = pokers.length - 1; i >= 0; i--){
            let lastValue = 0;
            let shunzi = [];
            shunzi.push(pokers[i]);
            for(let j = i; j >= 0; j--){
                let poker = pokers[j];
                let nowValue = this.GetCardValue(poker);
                if(nowValue == lastValue) continue;
                if(nowValue == 15){
                    break;
                }
                if(lastValue != 0){
                    if(nowValue - lastValue != 1){
                        break;
                    }
                    shunzi.push(poker);   
                }
                lastValue = nowValue;
                if(shunzi.length>=5){
                    array[array.length] = shunzi;
                }
            }
        }
        return array;
    },
    GetShunzi:function(isSelectCard = false){
        let pokers = [];
        if(isSelectCard==false){
            pokers = this.handCardList;
        }else{
            pokers = this.selectCardList;
        }
        this.SortCardByMax(pokers);
        let array = [];
        // if(pokers.length < this.lastCardList.length) return [];

        this.SortCardByMinEx(this.lastCardList);
        let lastCardValue = this.GetCardValue(this.lastCardList[0]);

        for(let i = pokers.length - 1; i >= 0; i--){
            let lastValue = 0;
            let shunzi = [];
            shunzi.push(pokers[i]);
            for(let j = i; j >= 0; j--){
                let poker = pokers[j];
                let nowValue = this.GetCardValue(poker);

                if(nowValue == lastValue) continue;

                if(nowValue <= lastCardValue){
                    break;
                }
                if(nowValue == 15){
                    break;
                }
                if(lastValue != 0){
                    if(nowValue - lastValue != 1)
                        break;
                    shunzi.push(poker);   
                }
                
                if(shunzi.length >= this.lastCardList.length){
                    array[array.length] = shunzi;
                    break;
                }
                lastValue = nowValue;
            }
        }
        this.GetZhaDanEx(array,isSelectCard);
        return array;
    },

    GetSanDaiTip:function(lastCardType,isSelectCard=false){
        let pokers = [];
        if(isSelectCard==false){
            pokers = this.handCardList;
        }else{
            pokers = this.selectCardList;
        }
        let santiaos = [];
        let chai = [];
        for(let i = 0; i < pokers.length; i++){
            let poker = pokers[i];
            let cardValue = this.GetCardValue(poker);
            let santiao = this.GetSameValue(pokers, poker);
            let bInList = this.CheckPokerInListEx(santiaos, poker);
            let bInListEx = this.CheckPokerInListEx(chai, poker);
            if(santiao.length == 3 && !bInList){
                this.PushTipCard(santiaos, santiao, 3);
            }
        }
        this.SortCardByMin(santiaos);
        this.SortCardByMin(chai);

        santiaos.push.apply(santiaos, chai);


        if(lastCardType == 6){
            this.GetOtherCard(santiaos, 1,isSelectCard,false);
        }else if(lastCardType == 7){
            this.GetOtherCard(santiaos, 2,isSelectCard,false); //不用对子
        }else if(lastCardType == 15){
            //获取其他牌一对
            this.GetOtherCardDui(santiaos, 2,isSelectCard);
        }
        return santiaos;
    },

    GetSanDai:function(isSelectCard=false){
        let pokers = [];
        if(isSelectCard==false){
            pokers = this.handCardList;
        }else{
            pokers = this.selectCardList;
        }
        let santiaos = [];
        let chai = [];
        // if(pokers.length < this.lastCardList.length) return [];

        let lastCardValue = 0;

        for(let i = 0; i < this.lastCardList.length; i++){
            let poker = this.lastCardList[i];
            let santiao = this.GetSameValue(this.lastCardList, poker);
            if(santiao.length >= 3){
                lastCardValue = this.GetCardValue(santiao[0]);
                break;
            }
        }
        for(let i = 0; i < pokers.length; i++){
            let poker = pokers[i];
            let cardValue = this.GetCardValue(poker);
            if(cardValue <= lastCardValue){
                continue;
            }
            let santiao = this.GetSameValue(pokers, poker);
            let bInList = this.CheckPokerInListEx(santiaos, poker);
            let bInListEx = this.CheckPokerInListEx(chai, poker);
            if(santiao.length == 3 && !bInList){
                if(this.GetCardValue(santiao[0]) == 14 && this.Room.GetRoomWanfa(this.Define.SEVER_AAA) && !this.Room.GetRoomWanfa(this.Define.SEVER_BMUSTBOMB)){
                    //3跟牌是A，选择了3A为炸，没选择炸弹可拆，则3A不加入提示牌
                    continue;
                }
                this.PushTipCard(santiaos, santiao, 3);
            }

            else if(santiao.length > 3 && !bInListEx){
                this.PushTipCard(chai, santiao, 3);
            }
        }

        this.SortCardByMin(santiaos);
        this.SortCardByMin(chai);

        santiaos.push.apply(santiaos, chai);

        if(this.lastCardType == 6){
            this.GetOtherCard(santiaos, 1,isSelectCard,false);
        }
        else if(this.lastCardType == 7){
            this.GetOtherCard(santiaos, 2,isSelectCard,false);
        }else if(this.lastCardType == 15){
            //获取其他牌一对
            this.GetOtherCardDui(santiaos, 2,isSelectCard);
        }

        this.GetZhaDanEx(santiaos,isSelectCard);
        return santiaos;
    },

    GetSiDaiTip:function(lastCardType,isSelectCard=false){
        let pokers = [];
        if(isSelectCard==false){
            pokers = this.handCardList;
        }else{
            pokers = this.selectCardList;
        }
        let zhadans = [];
        let chai = [];
        // if(pokers.length < this.lastCardList.length) return [];

        let lastCardValue = 0;

        for(let i = 0; i < this.lastCardList.length; i++){
            let poker = this.lastCardList[i];
            let zhadan = this.GetSameValue(this.lastCardList, poker);
            if(zhadan.length >= 4){
                lastCardValue = this.GetCardValue(zhadan[0]);
                break;
            }
        }

        for(let i = 0; i < pokers.length; i++){
            let poker = pokers[i];
            let cardValue = this.GetCardValue(poker);
            if(cardValue <= lastCardValue) continue;
            let zhadan = this.GetSameValue(pokers, poker);
            let bInList = this.CheckPokerInListEx(zhadans, poker);
            let bInListEx = this.CheckPokerInListEx(chai, poker);
            if(zhadan.length == 4 && !bInList){
                this.PushTipCard(zhadans, zhadan, 4);
            }
            else if(zhadan.length > 4 && !bInListEx){
                this.PushTipCard(chai, zhadan, 4);
            }
        }

        zhadans.push.apply(zhadans, chai);

        if(lastCardType == 8){
            this.GetOtherCard(zhadans, 1,isSelectCard);
        }
        else if(lastCardType == 9){
            this.GetOtherCard(zhadans, 2,isSelectCard);
        }
        else if(lastCardType == 10){
            this.GetOtherCard(zhadans, 3,isSelectCard);
        }
        return zhadans;
    },

    GetSiDai:function(isSelectCard=false){
        let pokers = [];
        if(isSelectCard==false){
            pokers = this.handCardList;
        }else{
            pokers = this.selectCardList;
        }
        let zhadans = [];
        let chai = [];
        // if(pokers.length < this.lastCardList.length) return [];

        let lastCardValue = 0;

        for(let i = 0; i < this.lastCardList.length; i++){
            let poker = this.lastCardList[i];
            let zhadan = this.GetSameValue(this.lastCardList, poker);
            if(zhadan.length >= 4){
                lastCardValue = this.GetCardValue(zhadan[0]);
                break;
            }
        }

        for(let i = 0; i < pokers.length; i++){
            let poker = pokers[i];
            let cardValue = this.GetCardValue(poker);
            if(cardValue <= lastCardValue) continue;
            let zhadan = this.GetSameValue(pokers, poker);
            let bInList = this.CheckPokerInListEx(zhadans, poker);
            let bInListEx = this.CheckPokerInListEx(chai, poker);
            if(zhadan.length == 4 && !bInList){
                this.PushTipCard(zhadans, zhadan, 4);
            }
            else if(zhadan.length > 4 && !bInListEx){
                this.PushTipCard(chai, zhadan, 4);
            }
        }

        zhadans.push.apply(zhadans, chai);

        if(this.lastCardType == 8){
            this.GetOtherCard(zhadans, 1,isSelectCard);
        }
        else if(this.lastCardType == 9){
            this.GetOtherCard(zhadans, 2,isSelectCard);
        }
        else if(this.lastCardType == 10){
            this.GetOtherCard(zhadans, 3,isSelectCard);
        }

        this.GetZhaDanEx(zhadans,isSelectCard);
        return zhadans;
    },

    //得到真正的飞机
    GetRealPlane:function(lists){
        let lastValue = 0;
        let realPlane = [];
        for(let i = 0; i < lists.length; i++){
            let item = lists[i];
            let nowValue = this.GetCardValue(item[0]);
            
            if(lastValue != 0){
                if((lastValue+1) != nowValue){
                    if(realPlane.length >= 2){
                        break;
                    }
                    realPlane.splice(0, realPlane.length);
                    realPlane[realPlane.length] = item;
                }
                else{
                    realPlane[realPlane.length] = item;
                }
            }
            else{
                realPlane[realPlane.length] = item;
            }

            lastValue = nowValue;
        }

        return realPlane;
    },
    GetFeiJiTip:function(tag,isSelectCard=false){
        let pokers = [];
        if(isSelectCard==false){
            pokers = this.handCardList;
        }else{
            pokers = this.selectCardList;
        }
        let tempArrB = [];
        for(let i=0; i < pokers.length; i++){
            let poker = pokers[i];
            let santiao = this.GetSameValue(pokers, poker);
            let bInList = this.CheckPokerInList(tempArrB, poker);
            if(santiao.length >= tag && !bInList){
                //tempArrB[tempArrB.length] = santiao;
                this.RegularCard(tempArrB, santiao, tag);
            }
        }
        if(tempArrB.length < 2){
            return [];
        }
        this.SortCardByMin(tempArrB);
        let temp = [];
        let tempT=[];
        let lastValue = 0;
        for(let i = 0; i < tempArrB.length; i++){
            let item = tempArrB[i];
            let nowValue = this.GetCardValue(item[0]);
            if(lastValue != 0){
                if((lastValue+1) != nowValue){
                    if(temp.length>0){
                        tempT.push(temp);
                    }
                    temp.splice(0, temp.length);
                    temp[temp.length] = item;
                }
                else{
                    temp[temp.length] = item;
                }
            }
            else{
                temp[temp.length] = item;
            }
            
            lastValue = nowValue;
        }
        if(temp.length>0){
            tempT.push(temp);
        }
        if(tempT.length>0){
            tempT.sort(this.SortByLength);
            temp=tempT[0];
        }
        //将真正的飞机合并成一个数组
        let realPlane = [];
        if(temp.length){
            let tp = [];
            for(let i = 0; i < temp.length; i++){
                let item = temp[i];
                for(let j = 0; j < item.length; j++){
                    tp.push(item[j]);
                }
            }
            realPlane[realPlane.length] = tp;
        }
        if(realPlane.length){
            // if(this.Room.GetRoomWanfa(this.Define.SEVER_DAI31)){
            //     this.GetOtherCard(realPlane, this.lastCardList.length - realPlane[0].length);
            // }
            // else if(this.Room.GetRoomWanfa(this.Define.SEVER_DAI32)){
            //     this.GetOtherCard(realPlane, this.lastCardList.length - realPlane[0].length);
            // }
            this.GetOtherCard(realPlane,(realPlane[0].length/3)*2,isSelectCard);
        }
        return realPlane;
    },
    GetFeiJi:function(tag,isSelectCard=false){
        let pokers = [];
        if(isSelectCard==false){
            pokers = this.handCardList;
        }else{
            pokers = this.selectCardList;
        }
        // if(pokers.length < this.lastCardList.length) return [];

        let lastCardValue = 0;
        let tempArrA = [];
        let tempArrB = [];

        for(let i = 0; i < this.lastCardList.length; i++){
            let poker = this.lastCardList[i];
            let santiao = this.GetSameValue(this.lastCardList, poker);
            let bInList = this.CheckPokerInList(tempArrA, poker);
            if(santiao.length >= tag && !bInList){
                //tempArrA[tempArrA.length] = santiao;
                this.RegularCard(tempArrA, santiao, tag);
            }
        }

        this.SortCardByMin(tempArrA);
        let realPlaneA = [];
        if(tempArrA.length){
            realPlaneA = this.GetRealPlane(tempArrA)
            lastCardValue = this.GetCardValue(realPlaneA[0][0]);
        }

        for(let i=0; i < pokers.length; i++){
            let poker = pokers[i];
            let santiao = this.GetSameValue(pokers, poker);
            let bInList = this.CheckPokerInList(tempArrB, poker);
            if(santiao.length >= tag && !bInList){
                //tempArrB[tempArrB.length] = santiao;
                this.RegularCard(tempArrB, santiao, tag);
            }
        }

        //如果第一次检测三条小于2对 肯定凑不成飞机
        if(tempArrB.length < 2){
            let zhadan = [];
            this.GetZhaDanEx(zhadan,isSelectCard);
            return zhadan;
        }
        
        this.SortCardByMin(tempArrB);

        //tempArrB里的三带或四带飞机找出来 去除不用的三条或四条
        let temp = [];
        let lastValue = 0;
        for(let i = 0; i < tempArrB.length; i++){
            if(this.GetCardValue(tempArrB[i][0]) <= lastCardValue) continue;
            if(temp.length == realPlaneA.length) break;

            let item = tempArrB[i];
            let nowValue = this.GetCardValue(item[0]);
            
            if(lastValue != 0){
                if((lastValue+1) != nowValue){
                    temp.splice(0, temp.length);
                    temp[temp.length] = item;
                }
                else{
                    temp[temp.length] = item;
                }
            }
            else{
                temp[temp.length] = item;
            }
            
            lastValue = nowValue;
        }
        //如果飞机数量不足 返回空
        if(temp.length < realPlaneA.length){
            let zhadan = [];
            this.GetZhaDanEx(zhadan,isSelectCard);
            return zhadan;
        }
        //将真正的飞机合并成一个数组
        let realPlane = [];
        if(temp.length){
            let tp = [];
            for(let i = 0; i < temp.length; i++){
                let item = temp[i];
                for(let j = 0; j < item.length; j++){
                    tp.push(item[j]);
                }
            }

            realPlane[realPlane.length] = tp;
        }
        
        if(realPlane.length){
            // if(this.Room.GetRoomWanfa(this.Define.SEVER_DAI31)){
            //     this.GetOtherCard(realPlane, this.lastCardList.length - realPlane[0].length);
            // }
            // else if(this.Room.GetRoomWanfa(this.Define.SEVER_DAI32)){
            //     this.GetOtherCard(realPlane, this.lastCardList.length - realPlane[0].length);
            // }
            this.GetOtherCard(realPlane, this.lastCardList.length - realPlane[0].length,isSelectCard);
        }
        
        this.GetZhaDanEx(realPlane,isSelectCard);
        return realPlane;
    },
    GetLianDuiTip:function(isSelectCard=false){
        let pokers = [];
        if(isSelectCard==false){
            pokers = this.handCardList;
        }else{
            pokers = this.selectCardList;
        }
        // if(pokers.length < this.lastCardList.length) return [];

        let tempArrB = [];

        
        for(let i = pokers.length - 1; i >= 0; i--){
            let poker = pokers[i];
            let duizi = this.GetSameValue(pokers, poker);
            let bInList = this.CheckPokerInListEx(tempArrB, poker);
            if(duizi.length >= 2 && !bInList){
                this.PushTipCard(tempArrB, duizi, 2);
            }
        }
        
        this.SortCardByMin(tempArrB);

        let temps = [];
        for(let i = 0; i < tempArrB.length; i++){
            let tp = [];
            tp.push.apply(tp, tempArrB[i]);
            let lastValue = 0;
            lastValue = this.GetCardValue(tempArrB[i][0]);
            for(let j = i+1; j < tempArrB.length; j++){
                let item = tempArrB[j];
                let nowValue = this.GetCardValue(item[0]);
            
                if(nowValue == 15){
                    break;
                }
    
                if((lastValue+1) != nowValue){
                    break;
                }
                tp.push.apply(tp, item);
                lastValue = nowValue;
                if(tp.length >= 4){
                    temps[temps.length] = tp;
                }
            }
        }
        return temps;
    },
    GetLianDui:function(isSelectCard=false){
        let pokers = [];
        if(isSelectCard==false){
            pokers = this.handCardList;
        }else{
            pokers = this.selectCardList;
        }
        // if(pokers.length < this.lastCardList.length) return [];

        let lastCardValue = 0;
        let tempArrA = [];
        let tempArrB = [];

        this.SortCardByMinEx(this.lastCardList);
        lastCardValue = this.GetCardValue(this.lastCardList[0]);
        tempArrA = this.lastCardList;
        
        for(let i = pokers.length - 1; i >= 0; i--){
            let poker = pokers[i];
            let duizi = this.GetSameValue(pokers, poker);
            let bInList = this.CheckPokerInListEx(tempArrB, poker);
            if(duizi.length >= 2 && !bInList){
                this.PushTipCard(tempArrB, duizi, 2);
            }
        }
        
        this.SortCardByMin(tempArrB);

        let temps = [];
        for(let i = 0; i < tempArrB.length; i++){
            let tp = [];
            if(this.GetCardValue(tempArrB[i][0]) <= lastCardValue) continue;
            tp.push.apply(tp, tempArrB[i]);
            let lastValue = 0;
            lastValue = this.GetCardValue(tempArrB[i][0]);
            for(let j = i+1; j < tempArrB.length; j++){
                let item = tempArrB[j];
                let nowValue = this.GetCardValue(item[0]);
            
                if(nowValue == 15){
                    break;
                }
    
                if((lastValue+1) != nowValue){
                    break;
                }

                tp.push.apply(tp, item);
                lastValue = nowValue;

                if(tp.length == tempArrA.length){
                    temps[temps.length] = tp;
                    break;
                }
            }
        }

        this.GetZhaDanEx(temps,isSelectCard);
        return temps;
    },

    GetOtherCard:function(list, tag,isSelectCard=false, needDuizi = false){
        if(!list.length) return;
        let pokers =[];
        if(isSelectCard==false){
            pokers = this.handCardList;
        }else{
            pokers = this.selectCardList;
        }
        let needPokersCount = 0;
        for (let i = 0; i < list.length; i++) {
            needPokersCount = list[i].length + tag;
        }
        let temp = [];
        let chai = [];
        for(let i = pokers.length -1; i >= 0; i--){
            let poker = pokers[i];
            let cards = this.GetSameValue(pokers, poker);
            let bInList = this.CheckPokerInListEx(temp, poker);
            let bInListEx = this.CheckPokerInListEx(chai, poker);
            if(cards.length == 1 && !bInList){
                this.PushTipCard(temp, cards, 1);
            }
            else if(cards.length >= 2 && !bInListEx){
                this.PushTipCard(chai, cards, 2);
            }
        }

        temp.push.apply(temp, chai);
        //先将list拷贝出来
        let tempList = [];
        tempList = list;
        //将获得的牌加入三条,四条或者飞机之中
        for(let i = 0; i < tempList.length; i++){
            let item = tempList[i];
            let len = item.length;
            if (!needDuizi) {
                for(let j = 0; j < temp.length; j++){
                    if(list[i].length - len == tag){
                        break;
                    }
                    let tp = temp[j];
                    for(let k = 0; k < tp.length; k++){
                        if(list[i].length - len == tag){
                            break;
                        }
                        if(item.indexOf(tp[k]) == -1){
                            //将获得的带牌加入list
                            list[i].push(tp[k]);
                        }
                    }
                }
            }
            else if(needDuizi){
                 //必须是对子
                for(let j = 0; j < chai.length; j++){
                    if(list[i].length - len == tag){
                        break;
                    }
                    let tp = chai[j];
                    for(let k = 0; k < tp.length; k++){
                        if(list[i].length - len == tag){
                            break;
                        }
                        if(item.indexOf(tp[k]) == -1){
                            //将获得的带牌加入list
                            list[i].push(tp[k]);
                        }
                    }
                }
            }
        }
         //如果需要带对的，如果没有对。不能出
        if (needDuizi && chai.length == 0){
            list.splice(0,list.length);
            return;
        }
        //判断下如果加入的牌还不够上家的牌型并且手上还有牌需要补充
        let curPokersCount = 0;
        for (let i = 0; i < list.length; i++) {
            curPokersCount = list[i].length;
            if(this.lastCardType == 7 && curPokersCount < 5 && this.handCardList.length>=5){
                list.splice(i,1);
            }
        }
        // if (curPokersCount < needPokersCount) {
        //     for (let i = 0; i < list.length; i++) {
        //         for (let j = 0; j < pokers.length; j++) {
        //             if (list[i].indexOf(pokers[j]) == -1) {
        //                 //将获得的带牌加入list
        //                 list[i].push(pokers[j]);
        //                 if (list[i].length == needPokersCount) {
        //                     break;
        //                 }
        //             }
        //         }
        //     }
        // }
    },

///////////////////////////common///////////////////////////////////////
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

    CheckPokerInListEx:function(list, tagCard){
        if (list.length == 0) return false;
        
        let bInList = false;
        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            let cardValue = this.GetCardValue(item[0]);
            let tagValue = this.GetCardValue(tagCard);

            if(cardValue == tagValue){
                bInList = true;
            }
        }
        return bInList;
    },
     CheckChaiInList:function(cards,list){
        if (cards.length == 0) return false;
        let bInList = false;
        for (let i = 0; i < cards.length; i++) {
            let item = cards[i];
            let pos = list.indexOf(item);
        
            if (pos >= 0){
                bInList = true;
            }
        }
        return bInList
    },
    //检测列表是否全是对子
    CheckTagIsDuizi:function(tagList){
        if (tagList.length < 2) return false;
        if (tagList.length%2 == 1) return false;

        let duiziNum = tagList.length/2;
        for (let j = 0; j < duiziNum; j++) {
            for(let i = 0; i < tagList.length; i++){
                let poker = tagList[i];
                let duizi = this.GetSameValue(tagList, poker);
                if(duizi.length == 2 || duizi.length == 4){
                    let pos1 = tagList.indexOf(duizi[0]);
                    tagList.splice(pos1, 1);
                    let pos2 = tagList.indexOf(duizi[1]);
                    tagList.splice(pos2, 1);
                    break;
                }
            }
        }
        if (tagList.length == 0)
            return true;
        else
            return false;
    },
     //获取带牌
    GetDaiPaiList:function(pokers, sameList) {
        let tempList = [];
        for (let i = 0; i < sameList.length; i++) {
            tempList.push.apply(tempList, sameList[i]);
        }
        let daiPaiList = [];
        for (let i = 0; i < pokers.length; i++) {
            let poker = pokers[i];
            let index = tempList.indexOf(poker);
            if(index == -1){
                daiPaiList.push(poker);
            }
        }
        return daiPaiList;
    },
    //获取同一牌值
    GetSameValue:function(pokers, tagCard) { 
        let sameValueList = [];
        let tagCardValue = this.GetCardValue(tagCard);
        for (let i = 0; i < pokers.length; i++) {
            let poker = pokers[i];
            let pokerValue = this.GetCardValue(poker);

            if (tagCardValue == pokerValue){
                sameValueList[sameValueList.length] = poker;
            }
        }
        return sameValueList
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
        let realPoker = 0;
        if(poker > 500){
            realPoker = poker - 500;
        }
        else{
            realPoker = poker;
        }
        return realPoker&this.LOGIC_MASK_VALUE;
    },

    //获取花色
    GetCardColor:function(poker) { 
        let realPoker = 0;
        if(poker > 500){
            realPoker = poker - 500;
        }
        else{
            realPoker = poker;
        }
        return realPoker&this.LOGIC_MASK_COLOR;
    },

    CheckSameValue:function(aCards,bCards){
        let bRet = false;
        for(let i = 0; i < aCards.length; i++){
            let poker = aCards[i];
            if(bCards.indexOf(poker) != -1){
                bRet = true;
                break;
            }
        }

        return bRet;
    }
});

var g_LogicPDKGame = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
    if(!g_LogicPDKGame){
        g_LogicPDKGame = new LogicPDKGame();
    }
    return g_LogicPDKGame;

}