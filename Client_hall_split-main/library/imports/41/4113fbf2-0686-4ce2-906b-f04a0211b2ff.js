"use strict";
cc._RF.push(module, '4113fvyBoZM4pBr8EoCEbL/', 'thkb_winlost_child');
// script/ui/uiGame/thkb/thkb_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
    extends: require("BasePoker_winlost_child"),

    properties: {},

    // use this for initialization
    OnLoad: function OnLoad() {
        this.PokerCard = app.PokerCard();
    },
    ShowPlayerData: function ShowPlayerData(setEnd, playerAll, index) {
        var setStatus = setEnd["setStatus"];
        var posResultList = setEnd["posResultList"];
        var isInList = [];
        var player = posResultList[index];

        var pos = player.pos;
        var pid = player.pid;
        var point = player.point;
        var winPoint = player.winPoint;
        var roomPoint = player.roomPoint;
        var beiShu = player.beiShu;
        var prizePoint = player.prizePoint;
        // let liangCardList = player.liangCardList;
        var prizeCardList = [player["shouCard"]];
        var dPos = setEnd.dPos;
        var isDiZhu = player.isDiZhu;
        var jiZhao = player.jiZhao;

        //显示庄闲
        // this.node.getChildByName("user_info").getChildByName("zhuangjia").active = (player.pos == dPos);
        this.node.getChildByName("user_info").getChildByName("chong").active = isDiZhu;
        this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
        // this.node.getChildByName("user_info").getChildByName("xianjia").active = !(player.pos == dPos);
        this.node.getChildByName("user_info").getChildByName("xianjia").active = false;
        this.node.getChildByName("user_info").getChildByName("you").active = false;
        this.node.getChildByName("user_info").getChildByName("di").active = false;
        this.node.getChildByName("user_info").getChildByName("img_zhaodi").active = false;

        //玩家分数
        var winNode = this.node.getChildByName("lb_win_num");
        var loseNode = this.node.getChildByName("lb_lose_num");
        winNode.active = false;
        loseNode.active = false;
        // let liangCardLayout = this.node.getChildByName("liangCardLayout");
        this.node.getChildByName("manguan1").active = false;
        this.node.getChildByName("manguan2").active = false;
        /*if (manGuan > 0) {
         this.node.getChildByName("manguan" + manGuan).active = true;
         }*/

        var content = this.node.getChildByName('prizeCardList').getChildByName('view').getChildByName('content');
        var demoLayout = content.children[0];
        var demoCard = demoLayout.children[0];
        for (var i = 0; i < content.children.length; i++) {
            content.children[i].active = false;
            for (var j = 0; j < content.children[i].children.length; j++) {
                content.children[i].children[j].active = false;
            }
        }
        for (var _i = 0; _i < prizeCardList.length; _i++) {
            var prizeCard = prizeCardList[_i];
            var cardLayout = content.children[_i];
            if (!cardLayout) {
                cardLayout = cc.instantiate(demoLayout);
                content.addChild(cardLayout);
                cardLayout.active = false;
                cardLayout.children[0].active = false;
            }
            cardLayout.active = true;
            for (var _j = 0; _j < prizeCard.length; _j++) {
                var poker = prizeCard[_j];
                var cardNode = cardLayout.children[_j];
                if (!cardNode) {
                    cardNode = cc.instantiate(demoCard);
                    cardLayout.addChild(cardNode);
                    cardNode.active = false;
                }
                cardNode.active = true;
                if (_j == prizeCard.length - 1) {
                    this.ShowCard(poker, cardNode, prizeCard.length);
                } else {
                    this.ShowCard(poker, cardNode, 0);
                }
            }
        }
        var zhaoStr = "不";
        if (jiZhao > 0) {
            this.node.getChildByName("user_info").getChildByName("img_zhaodi").active = true;
            if (jiZhao == 0) {
                zhaoStr = "不招";
            } else {
                zhaoStr = jiZhao + "招";
            }
            this.node.getChildByName("user_info").getChildByName("img_zhaodi").getChildByName("lb_zhao").getComponent(cc.Label).string = zhaoStr;
        }
        /*let selfPid = app.HeroManager().GetHeroProperty("pid");
        if (selfPid == pid) {
            if (isInList.indexOf(pos) > -1) {
                this.node.getChildByName("user_info").getChildByName("you").active = true;
            } else {
                this.node.getChildByName("user_info").getChildByName("di").active = true;
            }
        } else {
            this.node.getChildByName("user_info").getChildByName("di").active = true;
        }*/
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
        var lb_roomPoint = this.node.getChildByName("lb_roomPoint");
        if (roomPoint > 0) {
            lb_roomPoint.getComponent(cc.Label).string = "+" + roomPoint;
        } else {
            lb_roomPoint.getComponent(cc.Label).string = roomPoint;
        }
        //奖分
        var lb_jiangPoint = this.node.getChildByName("lb_jiangPoint");
        if (beiShu > 0) {
            lb_jiangPoint.getComponent(cc.Label).string = "+" + prizePoint;
        } else {
            lb_jiangPoint.getComponent(cc.Label).string = prizePoint;
        }
        //倍数
        var lb_winPoint = this.node.getChildByName("lb_beiPoint");
        if (beiShu > 0) {
            lb_winPoint.getComponent(cc.Label).string = "+" + beiShu;
        } else {
            lb_winPoint.getComponent(cc.Label).string = beiShu;
        }
        //比赛分
        var lb_sportsPointTitle = this.node.getChildByName("lb_sportsPointTitle");
        if (player.sportsPoint) {
            if (player.sportsPoint > 0) {
                lb_sportsPointTitle.active = true;
                lb_sportsPointTitle.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = "+" + player.sportsPoint;
            } else {
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

        var playerInfo = null;
        for (var _i2 = 0; _i2 < playerAll.length; _i2++) {
            if (player.pid == playerAll[_i2].pid) {
                playerInfo = playerAll[_i2];
                break;
            }
        }

        var head = this.node.getChildByName("user_info").getChildByName("mask").getChildByName("head_img").getComponent("WeChatHeadImage");
        head.ShowHeroHead(playerInfo.pid);
        //玩家名字
        var playerName = "";
        playerName = playerInfo.name;
        if (playerName.length > 6) {
            playerName = playerName.substring(0, 6) + '...';
        }
        var name = this.node.getChildByName("user_info").getChildByName("lable_name").getComponent(cc.Label);
        name.string = playerName;

        var id = this.node.getChildByName("user_info").getChildByName("label_id").getComponent(cc.Label);
        id.string = "ID:" + app.ComTool().GetPid(playerInfo["pid"]);
    },
    ShowCard: function ShowCard(cardType, cardNode, sameCardNum) {
        this.PokerCard.GetPokeCard(cardType, cardNode);
        cardNode.active = true;
        cardNode.getChildByName("poker_back").active = false;
        //显示张数
        if (sameCardNum > 0) {
            cardNode.getChildByName("cardNum").getComponent(cc.Label).string = "x" + sameCardNum;
        } else {
            cardNode.getChildByName("cardNum").getComponent(cc.Label).string = "";
        }
    }
});

cc._RF.pop();