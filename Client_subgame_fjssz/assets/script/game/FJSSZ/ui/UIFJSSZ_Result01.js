var app = require("fjssz_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
        btn_share:cc.Node,
        btn_exit:cc.Node,
        btn_xipai:cc.Node,
        btn_continue:cc.Node,
        sp_winLose:cc.Node,
        win:cc.SpriteFrame,
        lose:cc.SpriteFrame,
        ping:cc.SpriteFrame,
        result_Item1:cc.Prefab,
        icon_mapai:cc.SpriteFrame,
        layout:cc.Node,
    },

    OnCreateInit: function () {

        this.SSSRoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
        this.SSSRoomPosMgr = app[app.subGameName.toUpperCase() + "RoomPosMgr"]();
        this.SoundManager = app[app.subGameName + "_SoundManager"]();
        this.HeroManager = app[app.subGameName + "_HeroManager"]();
        this.SSSRoomSet = app[app.subGameName.toUpperCase() + "RoomPosSet"]();
        this.PokerCard = app[app.subGameName + "_PokerCard"]();
        this.ComTool = app[app.subGameName+"_ComTool"]();
        this.SDKManager = app[app.subGameName + "_SDKManager"]();
        this.LogicSSSGame = app[app.subGameName.toUpperCase() + "LogicGame"]();

        this.RegEvent("Event_XiPai", this.Event_XiPai);
    },

    showGameResult:function(){
        let allInfo = this.SSSRoomMgr.GetEnterRoom().GetRoomProperty("resultInfo");

        if(!app[app.subGameName + "_ShareDefine"]().isCoinRoom){
            this.btn_exit.active = false;
            this.btn_xipai.active = true;
            let isXiPai = this.SSSRoomSet.GetRoomSetProperty("isXiPai");
            if(isXiPai){
                this.btn_xipai.active = false;
            }
            else{
                this.btn_xipai.active = true;
            }
        }
        else{
            this.btn_exit.active = true;
            this.btn_xipai.active = false;
        }

        if(allInfo){
            //正常结算
            let allResultInfo = allInfo.sRankingResult.posResultList;
            let cardsInfo = allInfo.sRankingResult.rankeds;
            this.zjid = allInfo.sRankingResult.zjid;
            this.beishu = allInfo.sRankingResult.beishu;
            this.ShowResultNormal(allResultInfo, cardsInfo);
        }else{
            //中途退出然后进入结算
            let room = this.SSSRoomMgr.GetEnterRoom();
            //每局的水数
            let playerResult = room.GetRoomProperty("posResultList");
            let rankeds = room.GetRoomProperty('rankeds');
            this.zjid = room.GetRoomProperty('zjid');
            this.beishu = room.GetRoomProperty('beishu');
            this.ShowResultNormal(playerResult, rankeds);
        }
        
    },

    sortFun:function(a, b){
        return a.posIdx - b.posIdx;
    },

    ShowResultNormal:function(allResultInfo, cardsInfo){
        //先排序一下
        allResultInfo.sort(this.sortFun);

        for (let infoIdx = 0; infoIdx < allResultInfo.length; infoIdx++) {
            let data = allResultInfo[infoIdx];
            let hasCardsInfo = false;
            for (let a = 0; a < cardsInfo.length; a++) {
                if (data.pid == cardsInfo[a].pid) {
                    hasCardsInfo = true;
                    break;
                }
            }
            if (!hasCardsInfo) continue;
            
            //显示胜利或失败图片和音效
            if(data.pid == this.HeroManager.GetHeroID()){
                let imagePath = "";
                if(data.shui > 0){
                    this.sp_winLose.getComponent(cc.Sprite).spriteFrame = this.win;
                    this.SoundManager.PlaySound("sssResult_Win");
                }
                else if(data.shui == 0){
                    this.sp_winLose.getComponent(cc.Sprite).spriteFrame = this.ping;
                    this.SoundManager.PlaySound("sssResult_Ping");
                }else{
                    this.sp_winLose.getComponent(cc.Sprite).spriteFrame = this.lose;
                    this.SoundManager.PlaySound("sssResult_Lose");
                }
            }

            let path = "bg/layout" + "/result_Item" + infoIdx + "/vacancy";
            let vancacy = this.GetWndNode(path);
            vancacy.active = false;

            path = "bg/layout" + "/result_Item" + infoIdx + "/no_vacancy"
            let no_vacancy = this.GetWndNode(path);
            no_vacancy.active = true;

            //玩家水数
            let lb_path = "bg/layout" + "/result_Item" + infoIdx + "/no_vacancy/lb_win";
            let winNode = this.GetWndNode(lb_path);
            lb_path = "bg/layout" + "/result_Item" + infoIdx + "/no_vacancy/lb_lose";
            let loseNode = this.GetWndNode(lb_path);
            winNode.active = false;
            loseNode.active = false;

            let shui = data.shui;
            if(shui >= 0){
                winNode.active = true;
                winNode.getComponent(cc.Label).string = "+" + shui;
            }
            else{
                loseNode.active = true;
                loseNode.getComponent(cc.Label).string = shui;
            }

            //玩家头像
            let head_path = "bg/layout" + "/result_Item" + infoIdx + "/no_vacancy/touxiang/btn_head";
            let name_path = "bg/layout" + "/result_Item" + infoIdx + "/no_vacancy/lb_name";
            let id_path = "bg/layout" + "/result_Item" + infoIdx + "/no_vacancy/lb_id";
            let card_path = "bg/layout" + "/result_Item" + infoIdx + "/no_vacancy/cardNode";
            let special_path = "bg/layout" + "/result_Item" + infoIdx + "/no_vacancy/special_tag";
            let zhuangjia_path = "bg/layout" + "/result_Item" + infoIdx + "/no_vacancy/zhuangjia";
            let beishu_path = "bg/layout" + "/result_Item" + infoIdx + "/no_vacancy/beishu";

            //显示庄家
            let zj = this.GetWndNode(zhuangjia_path);
            let bs = this.GetWndNode(beishu_path);
            zj.active = false;
            bs.active = false;
            if(this.zjid == data.pid){
                zj.active = true;
                //显示倍数
                if(this.beishu != 0){
                    bs.active = true;
                    bs.getComponent(cc.Label).string = "x"+this.beishu;
                }
            }
            
            let head = this.GetWndNode(head_path).getComponent(app.subGameName + "_WeChatHeadImage");
            head.ShowHeroHead(data.pid);
            //玩家名字
            let playerInfo = this.SSSRoomPosMgr.GetPlayerInfoByPos(data.posIdx);
            
            let name = this.GetWndNode(name_path).getComponent(cc.Label);
            name.string = playerInfo["name"];

            let id = this.GetWndNode(id_path).getComponent(cc.Label);
            id.string = this.ComTool.GetPid(playerInfo["pid"]);

            let cards = this.GetWndNode(card_path);

            let dunPos = {};
            let sTag = -1;
            for(var cardIdx = 0;cardIdx<cardsInfo.length;cardIdx++){
                if(playerInfo.pid == cardsInfo[cardIdx].pid){
                    dunPos = cardsInfo[cardIdx].dunPos;
                    sTag = cardsInfo[cardIdx].special;
                    break;
                }
            }

            if(sTag != -1){
                //显示特殊牌型
                let special = this.GetWndNode(special_path);
                special.active = true;
                let imagePath = "texture/game/sss/special/special_" + sTag;
                //加载图片精灵
                let that = this;
                cc.loader.loadRes(imagePath, cc.SpriteFrame, function (error, spriteFrame) {
                    if(error){
                        that.ErrLog("ShowMap imagePath(%s) loader error:%s", imagePath, error);
                        return;
                    }
                    special.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                });
            }

            if(sTag == 85 || sTag == 95){
                let pokers = dunPos.first.concat(dunPos.second,dunPos.third);
                let tonghuas = this.LogicSSSGame.SanTongHua(pokers);
                dunPos.first = tonghuas[0];
                dunPos.second = tonghuas[1];
                dunPos.third = tonghuas[2];
            }
    
            this.ShowAllCard(dunPos, cards);
        }
    },

    ShowAllCard:function(dunPos, cards){
        for (let i = 0; i < dunPos.first.length; i++) {
            let cardNode = cards.getChildByName("dun_card"+(i+1).toString());
            this.ShowResultCard(dunPos.first[i], cardNode);
        }

        for (let i = 0; i < dunPos.second.length; i++) {
            let cardNode = cards.getChildByName("dun_card"+(i+4).toString());
            this.ShowResultCard(dunPos.second[i], cardNode);
        }

        for (let i = 0; i < dunPos.third.length; i++) {
            let cardNode = cards.getChildByName("dun_card"+(i+9).toString());
            this.ShowResultCard(dunPos.third[i], cardNode);
        }
    },

    OnShow:function(){
        this.FormManager.CloseForm("game/SSS/UISSS_CardType");
        this.FormManager.CloseForm("UIChat");
        this.btn_xipai.active = true;
        this.layout.removeAllChildren();
        this.playerCount = this.SSSRoomPosMgr.GetPosCount();
        for(let idx = 0; idx < 8; idx++){
            let item = cc.instantiate(this.result_Item1);
            item.name = "result_Item" + idx;
            item.getChildByName("vacancy").active = true;
            item.getChildByName("no_vacancy").active = false;
            this.layout.addChild(item);
        }
        this.showGameResult();
    },

    OnClick:function(btnName, btnNode){

        if(btnName == "btn_goon"){
            //this.CloseForm();
            if(app[app.subGameName + "_ShareDefine"]().isCoinRoom){
                app[app.subGameName + "_NetManager"]().SendPack('game.CGoldRoom', {practiceId:app[app.subGameName + "_ShareDefine"]().practiceId}, this.OnSuccess.bind(this),this.OnEnterRoomFailed.bind(this));
            }
            else{
                let room = this.SSSRoomMgr.GetEnterRoom();
                if(!room){
                    console.error("Click_btn_ready not enter room");
                    return
                }
                let roomID = room.GetRoomProperty("roomID");
                app[app.subGameName + "_GameManager"]().SendContinueGame(roomID);
            }
            //this.SSSRoomMgr.SendContinueGame(roomID);
        }
        else if(btnName == "btn_share"){
            this.SDKManager.ShareScreen();
        }
        else if(btnName == "btn_exit"){
            app[app.subGameName + "_FormManager"]().AddDefaultFormName("UIPractice");
            app[app.subGameName + "_SceneManager"]().LoadScene("mainScene");
        }
        else if(btnName == "btn_xipai"){
            let room = this.SSSRoomMgr.GetEnterRoom();
            if(!room)  return;
            let roomID = room.GetRoomProperty("roomID");
            let self = this;
            app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "XiPai", {"roomID":roomID});
        }
    },

    Event_XiPai:function(event){
        //this.btn_xipai.active = false;
    },

    ShowResultCard:function(cardType, node){
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

    OnSuccess:function(serverPack){
        let roomID = serverPack.roomID;
        app[app.subGameName + "_NetManager"]().SendPack('sss.CSSSGetRoomInfo', {"roomID":roomID});
    },

    OnEnterRoomFailed:function(serverPack){
        app[app.subGameName + "_SceneManager"]().LoadScene("mainScene");
    },
});
