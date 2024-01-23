var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        handCards:cc.Node,
        control_list:cc.Node,
        boom_Ani:cc.Node,
        plane_Ani:cc.Node,
        cardPrefab:cc.Prefab,
    },

    OnCreateInit: function () {
        this.SysDataManager = app.SysDataManager();
        this.IntegrateImage = this.SysDataManager.GetTableDict("IntegrateImage");
        this.NetManager = app.NetManager();
        this.WeChatManager = app.WeChatManager();
        this.PDKDefine = app.PDKDefine();
        this.PokerCard = app.PokerCard();
        this.NetManager.RegNetPack("SPlayer_PlayBackData", this.OnPack_PlayBackData, this);
        this.boom_Ani.getComponent(cc.Animation).on('finished', this.OnAniPlayFinished, this);
        this.plane_Ani.getComponent(cc.Animation).on('finished', this.OnAniPlayFinished, this);
    	this.InitCard();
    },

    OnShow:function(playBackCode){
        this.HideAll();
        this.jin1=-1;
        this.jin2=-1;
        this.playerList=false;  //玩家列表
        this.playerCount=0;    //玩家个数
        this.playkey=0;       //回放帧
        this.playBack=false;  //回放日志
        this.NextPlayTime=0;   //下帧播放时间
        this.pause=false;      //暂停
        this.fadeOutTime=5;    //淡出时间
        this.dPos=-1;   //庄家
        this.minplay=0;  //快退最多能退到的帧数
        this.clientPos = 0;
        this.PlayBackList=new Array();
        console.log("UIPokerVideo playBackCode：",playBackCode);
    	this.NetManager.SendPack("game.CPlayerPlayBack", {"playBackCode":playBackCode,"chekcPlayBackCode":false},this.OnPack_VideoData.bind(this), this.OnVideoFailed.bind(this));
    },

    OnVideoFailed:function(serverPack){
        this.SetWndProperty("UIMessageNoExist", "active",true);
    },

    OnPack_PlayBackData:function(serverPack){
        let playBackNum=serverPack.playBackNum;
        let key=serverPack.id;
        this.PlayBackList[key]=serverPack.msg;
        if(this.PlayBackList.length==playBackNum){
            let PlayBackJson='';
            for(let i=0;i<playBackNum;i++){
                PlayBackJson+=this.PlayBackList[i];
            }
            let playBack=eval('(' + PlayBackJson + ')');
            this.playBack=playBack.playbackList;
            console.log("OnPack_PlayBackData mt this.playBack:",this.playBack);
            this.NextPlayTime=Math.round(new Date().getTime()/1000)-1;
            this.schedule(this.Play,0.5);
        }
    },

    OnPack_VideoData:function(serverPack){
    	this.playerList=this.Str2Json(serverPack.playerList);
    	this.dPos=serverPack.dPos;
    	this.playerCount=this.playerList.length;
    	let roomKey=serverPack.roomKey;
    	let setID=serverPack.setID;
    	let setAll=serverPack.setCount;
        this.SetRoomInfo(this.playerCount,roomKey,setID,setAll);
        //获取对局人数
        this.playerCount = this.playerList.length;
        this.isSelf = false;
        //先找出玩家自己的位置
        for(let i = 0; i < this.playerList.length; i++){
            if(app.HeroManager().GetHeroID() == this.playerList[i].pid){
                this.clientPos = this.playerList[i].pos;
                this.isSelf = true;
                break;
            }
        }
    	this.ShowPlayerInfo(this.playerList);
	},
	
	InitCard:function(){
		//玩家手牌
        this.handCards.active = false;
        for(let i = 0; i < this.PDKDefine.MaxHandCard; i++){
            let card = cc.instantiate(this.cardPrefab);
            card.active = false;
            card.name = "card_" + (i+1).toString();
            this.handCards.addChild(card);
        }

        //玩家打出去的牌
        for(let i = 0; i < this.PDKDefine.MaxPlayer; i++){
            let outCardList = this.node.getChildByName("outCardList"+i);
            outCardList.active = false;
            for(let j = 0; j < this.PDKDefine.MaxHandCard; j++){
                let card = cc.instantiate(this.cardPrefab);
                card.active = false;
                card.name = "card_" + (i+1).toString();
                outCardList.addChild(card);
            }
        }

        //玩家明牌的牌
        for(let i = 1; i < this.PDKDefine.MaxPlayer; i++){
            let openCardList = this.node.getChildByName("openCardList"+i);
            openCardList.active = false;
            for(let j = 0; j < this.PDKDefine.MaxHandCard; j++){
                let card = cc.instantiate(this.cardPrefab);
                card.active = false;
                card.name = "card_" + (i+1).toString();
                openCardList.addChild(card);
            }
        }
    },
    
	SetRoomInfo:function(playercount,roomKey,setID,setAll){
		this.SetWndProperty("room_data/label_player_num", "text",playercount+"人场");
		this.SetWndProperty("room_data/label_player_ju", "text","局数："+setID+"/"+setAll);
		this.SetWndProperty("room_data/label_player_roomkey", "text","房间号："+roomKey);
    },
    
    SetPlayInfo:function(){
        let playnow=this.playkey+1;
        let max=this.playBack.length;
        if(playnow>max){
            playnow=max;
        }
        if(playnow<0){
            playnow=0;
        }
        // this.SetWndProperty("playinfo", "text",playnow+"/"+max);
    },

    //服务端位置转客户端位置
	GetUIPosByDataPos:function(dataPos){
		let playerCount = this.playerList.length;
		let uiPos = (dataPos + (this.playerCount - this.clientPos)) % playerCount;
		return uiPos;
    },

    GetPlayerPos:function(dataPos){
        let uiPos = -1;
        if(this.isSelf){
            uiPos = this.GetUIPosByDataPos(dataPos);
        }
        else{
            uiPos =  dataPos;
        }

        return uiPos;
    },
    
    SetSeat01OutCardPos:function(dataPos, len){
        let uiPos = this.GetPlayerPos(dataPos);
        
        
        if(uiPos != 1) return;

        let node = this.node.getChildByName("outCardList1");
        let posX = 525 - 25 * len;
        node.x = posX;
    },

	ShowPlayerInfo(playerList){
		for(let i = 0; i < playerList.length; i++){
            let uiPos = this.GetPlayerPos(playerList[i].pos);
            let heroID = playerList[i].pid;
            let head = this.GetWndNode("sp_seat0"+uiPos+"/head");
            head.active = true;
            //显示用户头像
            head.getChildByName("touxiang").getChildByName("btn_head").getComponent("WeChatHeadImage").ShowHeroHead(heroID,playerList[i].headImageUrl);
            //显示用户名字
			let sp_info = head.getChildByName('touxiang').getChildByName('sp_info');
			sp_info.getChildByName('lb_name').getComponent("cc.Label").string = playerList[i].name;
		}
	},
	
    HideAll:function(){
        this.SetWndProperty("UIMessageNoExist", "active",false);
        this.SetWndProperty("playinfo", "text",'');
        for(let i = 0 ; i < 4; i++){
            let ShowNode = this.GetWndNode("sp_seat0"+i);
            if(i != 0){
                ShowNode.getChildByName('card').active=false;
                ShowNode.getChildByName('cardNum').active = false;
            }
            ShowNode.getChildByName('pass').active=false;
            ShowNode.getChildByName('head').active=false;
            ShowNode.getChildByName('head').getChildByName('touxiang').getChildByName('beishu').active=false;
        }
        this.HideAllOutCard();
        this.HideAllOpenCard();
        this.HideAllHandCard();
    },

    HideAllHandCard:function(){
        this.handCards.active = false;
        for(let i = 0; i < this.handCards.children.length; i++){
            let child = this.handCards.children[i];
            child.active = false;
        }
    },

    HideAllOutCard:function(){
        for(let i = 0; i < this.PDKDefine.MaxPlayer; i++){
            let outCard = this.node.getChildByName("outCardList" + i);
            outCard.active = false;
        }
    },

    HideAllOpenCard:function(){
        for(let i = 1; i < this.PDKDefine.MaxPlayer; i++){
            let openCardList = this.node.getChildByName("openCardList" + i);
            openCardList.active = false;
        }
    },

    HidePokerBack:function(){
        for(let i = 1; i < this.PDKDefine.MaxPlayer; i++){
            let poker_back = this.GetWndNode("sp_seat0"+i+"/card/poker_back");
            if(!poker_back.active){
                poker_back.active = true;
            }
        }
    },

	PlayData(){
        if(this.playkey == -1){
            this.playkey = 0;
        }
		let data=this.playBack[this.playkey];
		if(!data){
			return false;
		}
        this.SetPlayInfo();
		console.log("PlayForce data:",data);
		let type=data.name;
		let res=data.res;
		let waitSecond=0;//本帧播放时间
		if(type.indexOf("SPDK_SetStart")>=0){
            waitSecond=1;
            this.HideAllOutCard();
            this.PlaySetStart(res, data.setPosCard, "pdk");
        }
        else if(type.indexOf("SPDK_AddDouble")>=0){
            waitSecond=1;
            this.HideAllOutCard();
            this.PlayAddDouble(res);
        }
        else if(type.indexOf("SPDK_RobClose")>=0){
            waitSecond=1;
            this.HideAllOutCard();
            this.PlayRobClose(res);
        }
        else if(type.indexOf("SPDK_ChangeStatus")>=0){

        }
        else if(type.indexOf("SPDK_OpCard")>=0){
            waitSecond=1;
            this.PlayOpCard(res, data.setPosCard);
        }
        else if(type.indexOf("SPDK_SetEnd")>=0){
			waitSecond=4000000;
			this.PlayEnd(res);
        }
        else if(type.indexOf("SGDY_SetStart")>=0){
            waitSecond=1;
            this.HideAllOutCard();
            this.PlaySetStart(res, data.setPosCard, "gdy");
        }
        else if(type.indexOf("SGDY_ChangeStatus")>=0){

        }
        else if(type.indexOf("SGDY_OpCard")>=0){
            waitSecond=1;
            this.PlayOpCardGDY(res, data.setPosCard);
        }else if(type.indexOf("SGDY_PosOpCard")>=0){
            waitSecond=1;
            this.PlayOpCardGDY(res, data.setPosCard);
        }else if(type.indexOf("SGDY_PosGetCard")>=0){
            waitSecond=1;
            this.PlayOpCardGDY(res, data.setPosCard);
        }
        else if(type.indexOf("SGDY_SetEnd")>=0){
            waitSecond=4000000;
            this.PlayEnd(res);
        }else if(type.indexOf("SWSK_SetStart")>=0){
            waitSecond=1;
            this.HideAllOutCard();
            this.PlaySetStart(res, data.setPosCard, "wsk");
        }
        else if(type.indexOf("SWSK_ChangeStatus")>=0){

        }
        else if(type.indexOf("SWSK_ParnterCard")>=0){

        }
        else if (type.indexOf("SWSK_ShowParnter")>=0) {
            
        }
        else if(type.indexOf("SWSK_OpCard")>=0){
            waitSecond=1;
            this.PlayOpCard(res, data.setPosCard);
        }
        else if(type.indexOf("SWSK_SetEnd")>=0){
            waitSecond=4000000;
            this.PlayEnd(res);
        }
        else{
			console.log("Play type no play:",type);
			console.log("Play type no play data:",data);
			this.pause==true;
			return;
		}
		this.playkey+=1;
		this.NextPlayTime=Math.round(new Date().getTime()/1000)+waitSecond;
    },
    
	Play:function(){
		this.fadeOutTime=this.fadeOutTime-0.5;
		if(this.fadeOutTime<=0 && this.fadeOutTime>-2){
			this.HideControl();
		}
		let now=Math.round(new Date().getTime()/1000);
		if(this.NextPlayTime==0 || now<this.NextPlayTime){
			return
		}
		if(this.pause==true){
			return
		}
		this.PlayData();
    },
    
    PlayAddDouble:function(res){
        let uiPos = this.GetPlayerPos(res.pos);
        let node = this.GetWndNode("sp_seat0"+uiPos+"/head/touxiang/beishu");
        node.active = true;
        node.getComponent(cc.Label).string = 'x'+res.addDouble;
    },

    PlayRobClose:function(res){

    },
	
	PlayEnd:function(res){
        let data=res.setEnd;
        this.CloseForm();
    },

    ShowPass:function(dataPos){
        let uiPos = this.GetPlayerPos(dataPos);
        let node = this.GetWndNode("sp_seat0"+uiPos+"/pass");
        node.active = true;
    },
    
	PlayOpCard(res, setPosCard){
        let data = res;
        this.SetSeat01OutCardPos(data.pos, data.cardList.length);
        this.ShowOutCard(data.pos, data.cardList);
        this.HidePokerBack();
        if(!data.cardList.length && data.opCardType == 1){
            this.ShowPass(data.pos);
        }
        if(setPosCard){
            for(let i = 0; i < this.playerList.length; i++){
                let player = this.playerList[i];
                if(this.isSelf){
                    if(player.pos == this.clientPos){
                        this.ShowSelfCard(setPosCard[player.pos]);
                    }
                    else{
                        this.ShowOpenCardList(player.pos, setPosCard[player.pos]);
                    }
                }
                else{
                    if(player.pos == 0){
                        this.ShowSelfCard(setPosCard[player.pos]);
                    }
                    else{
                        this.ShowOpenCardList(player.pos, setPosCard[player.pos]);
                    }
                }
                
            }

            //显示动画特效
            if(data.opCardType == 11){
                //炸弹
                this.boom_Ani.active = true;
                this.SetAniPos(data.pos);
                this.boom_Ani.getComponent(cc.Animation).play("zhadan");
            }
            else if(data.opCardType == 12 || data.opCardType == 13){
                this.plane_Ani.active = true;
                this.plane_Ani.getComponent(cc.Animation).play("feiji");
            }
        }
    },

    PlayOpCardGDY:function(res, setPosCard){
        let data = res;
        // this.bg_dun.active = true;
        // if (data.curCardSize && data.curCardSize != null) {
        //     this.lb_allCardsNum.string = data.curCardSize;
        // }
        this.SetSeat01OutCardPos(data.pos, setPosCard[data.pos].curOutCards.length);
        this.ShowOutCard(data.pos, setPosCard[data.pos].curOutCards);
        this.HidePokerBack();
        if(data.opType && data.opType == "Pass"){
            this.ShowPass(data.pos);
        }
        if(setPosCard){
            for(let i = 0; i < this.playerList.length; i++){
                let player = this.playerList[i];
                if(this.isSelf){
                    if(player.pos == this.clientPos){
                        this.ShowSelfCard(setPosCard[player.pos].privateCards);
                    }
                    else{
                        this.ShowOpenCardList(player.pos, setPosCard[player.pos].privateCards);
                    }
                }
                else{
                    if(player.pos == 0){
                        this.ShowSelfCard(setPosCard[player.pos].privateCards);
                    }
                    else{
                        this.ShowOpenCardList(player.pos, setPosCard[player.pos].privateCards);
                    }
                }
                
            }

            //显示动画特效
            if(data.opCardType == 11){
                //炸弹
                this.boom_Ani.active = true;
                this.SetAniPos(data.pos);
                this.boom_Ani.getComponent(cc.Animation).play("zhadan");
            }
            else if(data.opCardType == 12 || data.opCardType == 13){
                this.plane_Ani.active = true;
                this.plane_Ani.getComponent(cc.Animation).play("feiji");
            }
        }
    },
    
    SetAniPos:function(dataPos){
        let uiPos = this.GetUIPosByDataPos(dataPos);
        if(uiPos == 1){
            this.boom_Ani.setPosition(cc.v2(232, 64));
        }
        else{
           let outCardList = this.node.getChildByName("outCardList"+uiPos);
           this.boom_Ani.setPosition(cc.v2(outCardList.x, outCardList.y));
        }
    },
    
	PlaySetStart:function(res, setPosCard, gameName){
        for(let i = 0; i < this.playerList.length; i++){
            let player = this.playerList[i];
            let uiPos = this.GetPlayerPos(player.pos);
            let cardList = setPosCard[player.pos];
            if (gameName == "gdy") {
                cardList = setPosCard[player.pos].privateCards;
            }
            if(uiPos == 0){
                if(cardList.length >= 24){
                    this.handCards.getComponent(cc.Layout).spacingX = -95;
                }
                else{
                    this.handCards.getComponent(cc.Layout).spacingX = -70;
                }
                this.ShowSelfCard(cardList);
            }
            else{
                this.ShowOpenCardList(player.pos, cardList);
                this.GetWndNode("sp_seat0"+uiPos+"/card").active = true;
                this.GetWndNode("sp_seat0"+uiPos+"/cardNum").active = true;
                this.GetWndNode("sp_seat0"+uiPos+"/cardNum").getComponent(cc.Label).string = cardList.length + '张';
            }
        }

        if(res.setInfo.firstOpCard != 0 && gameName == "pdk"){
            let uiOpPos = this.GetPlayerPos(res.setInfo.opPos);
            if(uiOpPos == 0) return;
            let cardNode = this.GetWndNode("sp_seat0"+uiOpPos+"/card");
            cardNode.getChildByName("poker_back").active = false;
            this.ShowCard(res.setInfo.firstOpCard, cardNode);
        }
    },

    ShowSelfCard:function(cardList){
        this.SortCardByMax(cardList);
        this.handCards.active = true;
        for(let i = 0; i < this.handCards.children.length; i++){
            let cardNode = this.handCards.children[i];
            let cardValue = cardList[i];
            if(cardValue){
                this.ShowCard(cardValue, cardNode);
            }
            else{
                cardNode.active = false;
            }
        }
    },

    ShowOutCard:function(dataPos, cardList){
        let uiPos = this.GetPlayerPos(dataPos);
        let pass = this.GetWndNode("sp_seat0"+uiPos+"/pass");
        pass.active = false;
        let outCardNodeList = this.node.getChildByName("outCardList"+uiPos);
        outCardNodeList.active = true;
        for(let i = 0; i < outCardNodeList.children.length; i++){
            let cardNode = outCardNodeList.children[i];
            let value = cardList[i];
            if(value){
                this.ShowCard(value, cardNode);
            }
            else{
                cardNode.active = false;
            }
        }
    },
    
    ShowOpenCardList:function(dataPos, cardList){
        let uiPos = this.GetPlayerPos(dataPos);
        if(uiPos == 0) return;
        this.SortCardByMax(cardList);
        let openCardList = this.node.getChildByName("openCardList" + uiPos);
        openCardList.active = true;
        for(let i = 0; i < openCardList.children.length; i++){
            let cardNode = openCardList.children[i];
            let value = cardList[i];
            if(value){
                this.ShowCard(value, cardNode);
            }
            else{
                cardNode.active = false;
            }
        }
        this.GetWndNode("sp_seat0"+uiPos+"/cardNum").getComponent(cc.Label).string = cardList.length + '张';
    },

    SortCardByMax:function(pokers){
        pokers.sort(function(a, b){
            return (b&0x0F) - (a&0x0F);
        });
    },
	
	OnAniPlayFinished:function(event){
        if(event.target.name == 'feiji'){
            this.plane_Ani.active = false;
        }
        else if(event.target.name == 'zhadan'){
            this.boom_Ani.active = false;
        }
    },
    
    OnClose:function(){
        
    },

    OnClick:function(btnName, btnNode){
    	this.fadeOutTime=5;
        if(btnName == "btn_return"){
            this.CloseForm();
        }else if(btnName=="btn_back"){
        	this.OnClickPause();
            if(this.minplay>=this.playkey){
                return;
            }
            this.playkey=this.playkey-2;  //扣一针,播放完一帧帧数会加一，所有要回到上一帧，帧数要-2
            this.PlayData();
        }else if(btnName=="btn_play"){
        	this.OnClickPlay();
        }else if(btnName=="btn_pause"){
        	this.OnClickPause();
        }else if(btnName=="btn_forward"){
        	this.OnClickPause();
        	this.PlayData();
        }
        else{
            this.ShowControl();
        }
    },

    OnClickPause:function(){
    	this.pause=true;
        this.control_list.getChildByName('btn_play').active=true;
        this.control_list.getChildByName('btn_pause').active=false;
    },

    OnClickPlay:function(){
    	this.pause=false;
        this.control_list.getChildByName('btn_play').active=false;
        this.control_list.getChildByName('btn_pause').active=true;
    },

    HideControl:function(){
    	var action = cc.fadeOut(2.0);
    	this.control_list.runAction(action);
    },

    ShowControl:function(){
    	var action = cc.fadeIn(0.5);
    	this.control_list.runAction(action);
    },

	//---------计时器，开局发牌逻辑--------------
	OnUpdate:function(){
		
    },
    
    //显示poker牌
    ShowCard:function(cardType, cardNode){
        this.PokerCard.GetPokeCard(cardType, cardNode);
        cardNode.active = true;
        cardNode.getChildByName("poker_back").active = false;
    },

	Str2Json:function(jsondata){
        if(jsondata===""){
            return false;
        }
        var json = JSON.parse(jsondata);
        return json;
    },

    
});