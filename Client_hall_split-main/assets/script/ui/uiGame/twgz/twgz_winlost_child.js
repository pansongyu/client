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
        let teamType = setEnd["teamType"];
        let posResultList = setEnd["posResultList"];
        let isInList = [];
        if (teamType == 0) {
            isInList = [0, 2];
        } else if (teamType == 1) {
            for (let i = 0; i < posResultList.length; i++) {
                let posResult = posResultList[i];
                let pos = posResult["pos"];
                let partnerPosList = posResult["partnerPosList"];
                isInList = isInList.concat(pos, partnerPosList[0]);
                break;
            }
        } else if (teamType == 2) {
            for (let i = 0; i < posResultList.length; i++) {
                let posResult = posResultList[i];
                let partnerPosList = posResult["partnerPosList"];
                if (partnerPosList.length > 0) {
                    isInList = partnerPosList;
                }
            }
        }
        let player = setEnd.posResultList[index];

        let pos = player.pos;
        let pid = player.pid;
        let point = player.point;
        let winPoint = player.winPoint;
        let roomPoint = player.roomPoint;
        let manGuan = player.manGuan;
        let liangCardList = player.liangCardList;

        let dPos = setEnd.dPos;

        //显示庄闲
        // this.node.getChildByName("user_info").getChildByName("zhuangjia").active = (player.pos == dPos);
        this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
        // this.node.getChildByName("user_info").getChildByName("xianjia").active = !(player.pos == dPos);
        this.node.getChildByName("user_info").getChildByName("xianjia").active = false;
        this.node.getChildByName("user_info").getChildByName("you").active = false;
        this.node.getChildByName("user_info").getChildByName("di").active = false;

        //玩家分数
        let winNode = this.node.getChildByName("lb_win_num");
        let loseNode = this.node.getChildByName("lb_lose_num");
        winNode.active = false;
        loseNode.active = false;
        let liangCardLayout = this.node.getChildByName("liangCardLayout");
        this.node.getChildByName("manguan1").active = false;
        this.node.getChildByName("manguan2").active = false;
        if (manGuan > 0) {
            this.node.getChildByName("manguan" + manGuan).active = true;
        }
        let selfPid = app.HeroManager().GetHeroProperty("pid");
        if (selfPid == pid) {
            if (isInList.indexOf(pos) > -1) {
                this.node.getChildByName("user_info").getChildByName("you").active = true;
            } else {
                this.node.getChildByName("user_info").getChildByName("di").active = true;
            }
        } else {
            this.node.getChildByName("user_info").getChildByName("di").active = true;
        }
        for (let i = 0; i < liangCardLayout.children.length; i++) {
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
        }

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
//分值
        let lb_winPoint = this.node.getChildByName("lb_winPoint");
        if (winPoint > 0) {
            lb_winPoint.getComponent(cc.Label).string = "+" + winPoint;
        } else {
            lb_winPoint.getComponent(cc.Label).string = winPoint;
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
    }
})
;
