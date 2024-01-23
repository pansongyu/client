/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
    extends: require("BasePoker_winlost_child"),

    properties: {},

    // use this for initialization
    OnLoad: function () {
        this.PokerCard = app.PokerCard();
    },
    ShowPlayerData: function (setEnd, playerAll, index) {
        let setStatus = setEnd["setStatus"];
        let posResultList = setEnd["posResultList"];
        let selfPid = app.HeroManager().GetHeroProperty("pid");
        let isInList = [];

        let mengPos = setEnd["mengPos"];
        let dPos = setEnd["dPos"];
        let daDuPos = setEnd["daDuPos"];


        isInList.push(mengPos);
        isInList.push(dPos);
        /*if (setStatus == 1) {//1v3
            for (let i = 0; i < posResultList.length; i++) {
                let posResult = posResultList[i];
                let pos = posResult["pos"];
                let pid = posResult["pid"];
                let partnerPosList = posResult["partnerPosList"];
                if (selfPid == pid) {
                    if (partnerPosList.length == 0) {
                        isInList.push(pos);
                        break;
                    } else {
                        isInList = isInList.concat(pos, partnerPosList[0], partnerPosList[1]);
                        break;
                    }
                }
            }
        } else if (setStatus == 2) {//2v2
            for (let i = 0; i < posResultList.length; i++) {
                let posResult = posResultList[i];
                let pos = posResult["pos"];
                let pid = posResult["pid"];
                let partnerPosList = posResult["partnerPosList"];
                if (selfPid == pid) {
                    isInList = isInList.concat(pos, partnerPosList[0]);
                    break;
                }
            }
        } else if (setStatus == 3) {//1v1
            if (posResultList.length == 2) {
                isInList = [0];
            } else if (posResultList.length == 3) {
                isInList = [0, 1];
            } else if (posResultList.length == 4) {
                isInList = [0, 2];
            }
        }*/
        let player = setEnd.posResultList[index];

        let pos = playerAll[index].pos;
        let pid = player.pid;
        let point = player.point;
        let winPoint = player.winPoint;
        let roomPoint = player.roomPoint;
        let count510KPoint = player.count510KPoint;
        let prizePoint = player.prizePoint;
        // let liangCardList = player.liangCardList;
        let prizeCardList = player["prizeCardList"];

        //显示庄闲
        // this.node.getChildByName("user_info").getChildByName("zhuangjia").active = (player.pos == dPos);
        this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
        // this.node.getChildByName("user_info").getChildByName("xianjia").active = !(player.pos == dPos);
        this.node.getChildByName("user_info").getChildByName("xianjia").active = false;
        this.node.getChildByName("user_info").getChildByName("you").active = false;
        this.node.getChildByName("user_info").getChildByName("di").active = false;
        console.log("pos", pos);
        if (isInList.indexOf(pos) > -1) {
            this.node.getChildByName("user_info").getChildByName("you").active = true;
        }else{
            this.node.getChildByName("user_info").getChildByName("you").active = false;
        }
        if(daDuPos>-1 && daDuPos==pos){
            this.node.getChildByName("user_info").getChildByName("di").active = true;
        }else{
            this.node.getChildByName("user_info").getChildByName("di").active = false;
        }
        //玩家分数
        let winNode = this.node.getChildByName("lb_win_num");
        let loseNode = this.node.getChildByName("lb_lose_num");
        winNode.active = false;
        loseNode.active = false;
        // let liangCardLayout = this.node.getChildByName("liangCardLayout");
        this.node.getChildByName("manguan1").active = false;
        this.node.getChildByName("manguan2").active = false;
        /*if (manGuan > 0) {
         this.node.getChildByName("manguan" + manGuan).active = true;
         }*/

        let content = this.node.getChildByName('prizeCardList').getChildByName('view').getChildByName('content');
        let demoLayout = content.children[0];
        let demoCard = demoLayout.children[0];
        for (let i = 0; i < content.children.length; i++) {
            content.children[i].active = false;
            for (let j = 0; j < content.children[i].children.length; j++) {
                content.children[i].children[j].active = false;
            }
        }
        for (let i = 0; i < prizeCardList.length; i++) {
            let prizeCard = prizeCardList[i];
            let cardLayout = content.children[i];
            if (!cardLayout) {
                cardLayout = cc.instantiate(demoLayout);
                content.addChild(cardLayout);
                cardLayout.active = false;
                cardLayout.children[0].active = false;
            }
            cardLayout.active = true;
            for (let j = 0; j < prizeCard.length; j++) {
                let poker = prizeCard[j];
                let cardNode = cardLayout.children[j];
                if (!cardNode) {
                    cardNode = cc.instantiate(demoCard);
                    cardLayout.addChild(cardNode);
                    cardNode.active = false;
                }
                cardNode.active = true;
                if (j == prizeCard.length - 1) {
                    this.ShowCard(poker, cardNode, prizeCard.length);
                } else {
                    this.ShowCard(poker, cardNode, 0);
                }
            }
        }
        /*for (let i = 0; i < liangCardLayout.children.length; i++) {
         liangCardLayout.children[i].active = false;
         }
         for (let i = 0; i < liangCardList.length; i++) {
         let cardType = liangCardList[i];
         let cardNode = liangCardLayout.children[i];
         if (!cardNode) {
         cardNode = cc.instantiate(liangCardLayout.children[0]);
         liangCardLayout.addChild(cardNode);
         }
         cardNode.active = true;
         this.PokerCard.GetPokeCard(cardType, cardNode);
         }*/

        if (point > 0) {
            winNode.active = true;
            winNode.getComponent(cc.Label).string = "+" + point;
            this.node.getChildByName("user_info").getChildByName("bg_win").active = true;
            this.node.getChildByName("user_info").getChildByName("bg_lost").active = false;
        } else {
            loseNode.active = true;
            loseNode.getComponent(cc.Label).string = point;
            this.node.getChildByName("user_info").getChildByName("bg_win").active = false;
            this.node.getChildByName("user_info").getChildByName("bg_lost").active = true;
        }
        //房间分
        let lb_roomPoint = this.node.getChildByName("lb_roomPoint");
        if (roomPoint > 0) {
            lb_roomPoint.getComponent(cc.Label).string = "+" + roomPoint;
        } else {
            lb_roomPoint.getComponent(cc.Label).string = roomPoint;
        }
        //奖分
        let lb_jiangPoint = this.node.getChildByName("lb_jiangPoint");
        if (prizePoint > 0) {
            lb_jiangPoint.getComponent(cc.Label).string = "+" + prizePoint;
        } else {
            lb_jiangPoint.getComponent(cc.Label).string = prizePoint;
        }
        //倍数
        let lb_winPoint = this.node.getChildByName("lb_beiPoint");
        if (count510KPoint > 0) {
            lb_winPoint.getComponent(cc.Label).string = "+" + count510KPoint;
        } else {
            lb_winPoint.getComponent(cc.Label).string = count510KPoint;
        }
        //比赛分
        let lb_sportsPointTitle = this.node.getChildByName("lb_sportsPointTitle");
        if (player.sportsPoint) {
            if (player.sportsPoint > 0) {
                lb_sportsPointTitle.active = true;
                lb_sportsPointTitle.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = "+" + player.sportsPoint;
            }
            else {
                lb_sportsPointTitle.active = true;
                lb_sportsPointTitle.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = player.sportsPoint;
            }
        } else {
            lb_sportsPointTitle.active = false;
        }

        //所属推广员ID
        if (player.upLevelId > 0) {
            this.node.getChildByName("user_info").getChildByName("label_upLevel").getComponent(cc.Label).string = "所属推广员ID：" + player.upLevelId;
        } else {
            this.node.getChildByName("user_info").getChildByName("label_upLevel").getComponent(cc.Label).string = "";
        }

        let playerInfo = null;
        for (let i = 0; i < playerAll.length; i++) {
            if (player.pid == playerAll[i].pid) {
                playerInfo = playerAll[i];
                break;
            }
        }

        let head = this.node.getChildByName("user_info").getChildByName("mask").getChildByName("head_img").getComponent("WeChatHeadImage");
        head.ShowHeroHead(playerInfo.pid);
        //玩家名字
        let playerName = "";
        playerName = playerInfo.name;
        if (playerName.length > 6) {
            playerName = playerName.substring(0, 6) + '...';
        }
        let name = this.node.getChildByName("user_info").getChildByName("lable_name").getComponent(cc.Label);
        name.string = playerName;

        let id = this.node.getChildByName("user_info").getChildByName("label_id").getComponent(cc.Label);
        id.string = "ID:" + app.ComTool().GetPid(playerInfo["pid"]);
    },
    ShowCard: function (cardType, cardNode, sameCardNum) {
        this.PokerCard.GetPokeCard(cardType, cardNode);
        cardNode.active = true;
        cardNode.getChildByName("poker_back").active = false;
        //显示张数
        if (sameCardNum > 0) {
            cardNode.getChildByName("cardNum").getComponent(cc.Label).string = "x" + sameCardNum;
        } else {
            cardNode.getChildByName("cardNum").getComponent(cc.Label).string = "";
        }
    },
})
;
