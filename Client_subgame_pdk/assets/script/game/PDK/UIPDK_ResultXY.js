var app = require("pdk_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
        playerList:cc.Node,
        room_Id:cc.Label,
        lb_jushu:cc.Label,
        end_Time:cc.Label,
        cardPrefab:cc.Prefab,
        icon_winlost:[cc.SpriteFrame],
    },

    OnCreateInit: function () {
        this.RoomMgr = app[app.subGameName.toUpperCase()+"RoomMgr"]();
        this.Room = app[app.subGameName.toUpperCase()+"Room"]();
        this.RoomPosMgr = app[app.subGameName.toUpperCase()+"RoomPosMgr"]();
        this.SoundManager = app[app.subGameName+"_SoundManager"]();
        this.HeroManager = app[app.subGameName+"_HeroManager"]();
        this.RoomSet = app[app.subGameName.toUpperCase()+"RoomSet"]();
        this.ComTool = app[app.subGameName+"_ComTool"]();
        this.SDKManager = app[app.subGameName+"_SoundManager"]();
        this.Define = app[app.subGameName.toUpperCase()+"Define"]();
        this.PokerCard = app[app.subGameName.toLowerCase()+"_PokerCard"]();
    },

    OnShow:function(setEnd){
        this.FormManager.CloseForm(app.subGameName+"_UIChat");
        this.RoomMgr = app[app.subGameName.toUpperCase()+"RoomMgr"]();
        let roomEnd = this.RoomMgr.GetEnterRoom().GetRoomProperty("roomEnd");
        if(!roomEnd){
            //延迟自动继续
            this.RoomMgr.SendTimeOutContinue();
        }
        let juShu = this.Room.GetRoomConfig().setCount;
        let setID = this.RoomMgr.GetEnterRoom().GetRoomProperty("setID");
        if(roomEnd || (setID >= juShu && !app[app.subGameName+"_ShareDefine"]().isCoinRoom)){
            this.isEnd = true;
        }
        else{
            this.isEnd = false;
        }
        if(app[app.subGameName+"_ShareDefine"]().isCoinRoom){
            this.node.getChildByName('btn_out').active=true;
        }else{
            this.node.getChildByName('btn_out').active=false;
        }
        this.InitPlayer();
        this.ShowGameResult(setEnd);
        this.ShowCardList(setEnd.cardList);
        this.ShowLeftCardList(setEnd.privateList);
        this.ShowFeiPaiList(setEnd.feipaiList);
    },
    InitPlayer:function(){
        for (let i = 0; i < 3; i++) {
            let path = "playerList/player" + (i+1).toString();
            let playerNode = this.GetWndNode(path);
            playerNode.getChildByName('cardlist').removeAllChildren();
            playerNode.active=false;
        }
    },
    ShowGameResult:function(setEnd){
        let room = this.RoomMgr.GetEnterRoom();
        if(!room){
            this.ErrLog("Event_PosContinueGame not enter room");
            return
        }   
        let allPlayer = this.RoomPosMgr.GetRoomAllPlayerInfo();
        let key = this.RoomMgr.GetEnterRoom().GetRoomProperty("key");
        let setId = this.RoomMgr.GetEnterRoom().GetRoomProperty("setID");
        let playerList = [];
        for(let idx in allPlayer){
            playerList.push(allPlayer[idx]);
        }
        //先排序一下
        playerList.sort(function(a, b){
            return a.pos - b.pos;
        });
        this.playerList=playerList;
        for (let i = 0; i < playerList.length; i++) {
            let player = playerList[i];
            let path = "playerList/player" + (i+1).toString();
            let playerNode = this.GetWndNode(path);
            playerNode.active = true;
            if(player.pid == this.RoomMgr.GetEnterRoom().GetRoomProperty("ownerID")){
                playerNode.getChildByName("touxiang").getChildByName("fangzhu").active = true;
            }else{
                playerNode.getChildByName("touxiang").getChildByName("fangzhu").active = false;
            }
            let point=setEnd.pointList[i];
            if(player.pos == this.RoomPosMgr.GetClientPos()){
                if(point > 0){
                    this.node.getChildByName('lost_win').getComponent(cc.Sprite).spriteFrame=this.icon_winlost[0];
                    this.SoundManager.PlaySound("win");
                    this.SoundManager.PlaySound("sssResult_Win");
                }
                else{
                    this.node.getChildByName('lost_win').getComponent(cc.Sprite).spriteFrame=this.icon_winlost[1];
                    this.SoundManager.PlaySound("fail");
                    this.SoundManager.PlaySound("sssResult_Lose");
                }
                
            }
            if(typeof(setEnd['sportsPointList'])!="undefined"){
                if(setEnd.sportsPointList[i] >0){  
                    playerNode.getChildByName('lb_sportsPoint').getComponent(cc.Label).string = "比赛分：+" + setEnd.sportsPointList[i];
                }else{
                    playerNode.getChildByName('lb_sportsPoint').getComponent(cc.Label).string = "比赛分：" + setEnd.sportsPointList[i];
                }
            }else{
                playerNode.getChildByName('lb_sportsPoint').getComponent(cc.Label).string = "";
            }
            playerNode.getChildByName('lb_point').getComponent(cc.Label).string=setEnd.totalPointList[i];
            playerNode.getChildByName('lb_num').getComponent(cc.Label).string=setEnd.surplusCardList[i];
            playerNode.getChildByName('lb_zhadan').getComponent(cc.Label).string=setEnd.bombList[i];
            playerNode.getChildByName('lb_lose').getComponent(cc.Label).string=setEnd.lostCardList[i];
            
            let pointNode=null;
            let absNum=Math.abs(point);
            
            if(absNum>10000){
                let shortNum=(absNum/10000).toFixed(2);
                if(point > 0){
                    playerNode.getChildByName('lb_lose_num').active=false;
                    pointNode=playerNode.getChildByName('lb_win_num');
                    pointNode.getComponent(cc.Label).string='+'+shortNum+"万";
                }else{
                    playerNode.getChildByName('lb_win_num').active=false;
                    pointNode=playerNode.getChildByName('lb_lose_num');
                    pointNode.getComponent(cc.Label).string='-'+shortNum+"万";
                }
            }else{
                if(point > 0){
                    playerNode.getChildByName('lb_lose_num').active=false;
                    pointNode=playerNode.getChildByName('lb_win_num');
                    pointNode.getComponent(cc.Label).string="+"+point;
                }else{
                    playerNode.getChildByName('lb_win_num').active=false;
                    pointNode=playerNode.getChildByName('lb_lose_num');
                    pointNode.getComponent(cc.Label).string=point;
                }
            }

             //////////
            
            pointNode.active=true;
            let head = playerNode.getChildByName('touxiang').getChildByName('mask').getChildByName('head').getComponent(app.subGameName + "_WeChatHeadImage");
            head.ShowHeroHead(player.pid);
            //玩家名字
            let playerName = "";
            playerName = player.name;
            if(playerName.length > app[app.subGameName+"_ShareDefine"]().SubNameLen){
                playerName = playerName.substring(0, app[app.subGameName+"_ShareDefine"]().SubNameLen) + '...';
            }
            let name = playerNode.getChildByName("touxiang").getChildByName("lb_name").getComponent(cc.Label);
            name.string = playerName;
        }
        this.room_Id.string = "房间号:" + key;
        let current = room.GetRoomConfigByProperty("setCount");
        this.lb_jushu.string = app.i18n.t("UIWanFa_setCount", {"current": current, "setCount": setId});
        let sec = Math.round(setEnd.startTime/1000);
        this.end_Time.string = this.ComTool.GetDateYearMonthDayHourMinuteString(sec);
        //回放码
        this.node.getChildByName('backcode').getComponent(cc.Label).string="回放码："+setEnd.playBackCode;
    },
    ShowFeiPaiList:function(cardList){
        //清理当前的layout
        let layout=this.node.getChildByName('feipai');
        if (!cardList || cardList.length < 2) {
            layout.active = false
            this.node.getChildByName('fplb').active = false;
            return
        }
        layout.removeAllChildren()
        let cardDemo=this.node.getChildByName('cardPrefab');
        for(let j=0;j<cardList.length;j++){
            let isLastCard=(j == cardList.length-1);
            let addCard=cc.instantiate(cardDemo);
            addCard.active=true;
            this.ShowCard(cardList[j],addCard,isLastCard);
            layout.addChild(addCard);
        }
    },
    ShowLeftCardList:function(allcardList){
        //清理当前的layout
        let layoutDemo=this.node.getChildByName('chupai');
        let cardDemo=this.node.getChildByName('cardPrefab');
        for(let i=0;i<allcardList.length;i++){
            if(i == this.RoomPosMgr.GetClientPos()){
                this.node.getChildByName("bg").active = allcardList[i].length == 0
                this.node.getChildByName("bg2").active = allcardList[i].length == 0
                this.node.getChildByName("bg3").active = allcardList[i].length != 0
                this.node.getChildByName("bg4").active = allcardList[i].length != 0
            }
            if(allcardList[i].length==0){
                continue;
            }
            let addlayout = cc.instantiate(layoutDemo);
            let path = "playerList/player" + (i+1).toString();
            let playerNode = this.GetWndNode(path);
            addlayout.active=true;
            playerNode.getChildByName('cardlist').addChild(addlayout);
            let cardList=allcardList[i];
            for(let j=0;j<cardList.length;j++){
                let isLastCard=false;
                let addCard=cc.instantiate(cardDemo);
                addCard.active=true;
                if(j+1==cardList.length){
                    isLastCard=true;
                }
                this.ShowCard(cardList[j],addCard,isLastCard);
                addlayout.addChild(addCard);
            }
        } 
    },
    ShowCardList:function(allcardList){
        //清理当前的layout
        let layoutDemo=this.node.getChildByName('chupai');
        let cardDemo=this.node.getChildByName('cardPrefab');
        for(let i=0;i<allcardList.length;i++){
             let addlayout = cc.instantiate(layoutDemo);
             let pos=allcardList[i].pos;
             let path = "playerList/player" + (pos+1).toString();
             let playerNode = this.GetWndNode(path);
             addlayout.active=true;
             playerNode.getChildByName('cardlist').addChild(addlayout);

             let shou=i+1;
             let cardList=allcardList[i].cardList;
             for(let j=0;j<cardList.length;j++){
                let isLastCard=false;
                let addCard=cc.instantiate(cardDemo);
                addCard.active=true;
                if(j==0){
                    let jishou=addCard.getChildByName('shou');
                    jishou.active=true;
                    jishou.getChildByName('lb').getComponent(cc.Label).string=shou;
                }
                if(j+1==cardList.length){
                    isLastCard=true;
                }
                this.ShowCard(cardList[j],addCard,isLastCard);
                addlayout.addChild(addCard);
             }
        }
    },
    //显示poker
    ShowCard:function(cardType, cardNode, isLastCard){
        let realValue = 0;
        if(cardType > 500){
            realValue = cardType - 500;
        }
        else{
            realValue = cardType;
        }
        if (!isLastCard) {
            cardNode.getChildByName('icon_1').active = false;
        }else{
            cardNode.getChildByName('icon_1').active = true;
        }
        this.PokerCard.GetPokeCard(realValue, cardNode, isLastCard);
        cardNode.active = true;
        cardNode.getChildByName("bg_poker").active = true;
        cardNode.getChildByName("num").active = true;
        cardNode.getChildByName("icon").active = true;
        let room = this.RoomMgr.GetEnterRoom();
        if(!room || !cardNode.getChildByName("tag")) return
        let kexuanwanfa = room.GetRoomConfigByProperty('kexuanwanfa');
        if(!kexuanwanfa || !kexuanwanfa.length) return
        cardNode.getChildByName("tag").active = (realValue == 0x2A && kexuanwanfa.indexOf(24) > -1)
    },
    OnClick:function(btnName, btnNode){
        let is3DShow = app.LocalDataManager().GetConfigProperty("SysSetting", "is3DShow");
        let GameBg = app.LocalDataManager().GetConfigProperty("SysSetting", app.subGameName+"_GameBg");
        if(btnName == "btn_jixu"){
            if(!this.isEnd){
                if(app[app.subGameName+"_ShareDefine"]().isCoinRoom){
                    app[app.subGameName+"_NetManager"]().SendPack('game.CGoldRoom', {practiceId:app[app.subGameName+"_ShareDefine"]().practiceId}, this.OnSuccess.bind(this),this.OnEnterRoomFailed.bind(this));
                }
                else{
                    let room = this.RoomMgr.GetEnterRoom();
                    if(!room){
                        this.ErrLog("Click_btn_ready not enter room");
                        return
                    }
                    let roomID = room.GetRoomProperty("roomID");
                    app[app.subGameName+"_GameManager"]().SendContinueGame(roomID);
                }
            }
            else{
                if(GameBg == 1){
                    this.FormManager.ShowForm(app.subGameName + "_UIPublic_Record");
                }else if(GameBg == 2){
                    this.FormManager.ShowForm(app.subGameName + "_UILPPublic_Record");
                }else if(GameBg == 3){
                    this.FormManager.ShowForm(app.subGameName + "_UIPublic_Record");
                }else if(GameBg == 4){
                    this.FormManager.ShowForm(app.subGameName + "_UIXiuXPublic_Record");
                }
                
            }
            
        }
        else if(btnName == "btn_out"){
            app[app.subGameName+"_FormManager"]().AddDefaultFormName(app.subGameName+"_UIPractice");
            app[app.subGameName + "Client"].ExitGame();
        }
    },
    OnSuccess:function(serverPack){
        let roomID = serverPack.roomID;
        app[app.subGameName+"_NetManager"]().SendPack('pdk.CPDKGetRoomInfo', {"roomID":roomID});
    },
    OnEnterRoomFailed:function(serverPack){
        app[app.subGameName+"_SceneManager"]().LoadScene("mainScene");
    },
});
