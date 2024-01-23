"use strict";
cc._RF.push(module, '2ec4cO3/tlO84sglbfuzkuD', 'twgz_winlost_child');
// script/ui/uiGame/twgz/twgz_winlost_child.js

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
        var teamType = setEnd["teamType"];
        var posResultList = setEnd["posResultList"];
        var isInList = [];
        if (teamType == 0) {
            isInList = [0, 2];
        } else if (teamType == 1) {
            for (var i = 0; i < posResultList.length; i++) {
                var posResult = posResultList[i];
                var _pos = posResult["pos"];
                var partnerPosList = posResult["partnerPosList"];
                isInList = isInList.concat(_pos, partnerPosList[0]);
                break;
            }
        } else if (teamType == 2) {
            for (var _i = 0; _i < posResultList.length; _i++) {
                var _posResult = posResultList[_i];
                var _partnerPosList = _posResult["partnerPosList"];
                if (_partnerPosList.length > 0) {
                    isInList = _partnerPosList;
                }
            }
        }
        var player = setEnd.posResultList[index];

        var pos = player.pos;
        var pid = player.pid;
        var point = player.point;
        var winPoint = player.winPoint;
        var roomPoint = player.roomPoint;
        var manGuan = player.manGuan;
        var liangCardList = player.liangCardList;

        var dPos = setEnd.dPos;

        //显示庄闲
        // this.node.getChildByName("user_info").getChildByName("zhuangjia").active = (player.pos == dPos);
        this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
        // this.node.getChildByName("user_info").getChildByName("xianjia").active = !(player.pos == dPos);
        this.node.getChildByName("user_info").getChildByName("xianjia").active = false;
        this.node.getChildByName("user_info").getChildByName("you").active = false;
        this.node.getChildByName("user_info").getChildByName("di").active = false;

        //玩家分数
        var winNode = this.node.getChildByName("lb_win_num");
        var loseNode = this.node.getChildByName("lb_lose_num");
        winNode.active = false;
        loseNode.active = false;
        var liangCardLayout = this.node.getChildByName("liangCardLayout");
        this.node.getChildByName("manguan1").active = false;
        this.node.getChildByName("manguan2").active = false;
        if (manGuan > 0) {
            this.node.getChildByName("manguan" + manGuan).active = true;
        }
        var selfPid = app.HeroManager().GetHeroProperty("pid");
        if (selfPid == pid) {
            if (isInList.indexOf(pos) > -1) {
                this.node.getChildByName("user_info").getChildByName("you").active = true;
            } else {
                this.node.getChildByName("user_info").getChildByName("di").active = true;
            }
        } else {
            this.node.getChildByName("user_info").getChildByName("di").active = true;
        }
        for (var _i2 = 0; _i2 < liangCardLayout.children.length; _i2++) {
            liangCardLayout.children[_i2].active = false;
        }
        for (var _i3 = 0; _i3 < liangCardList.length; _i3++) {
            var cardType = liangCardList[_i3];
            var cardNode = liangCardLayout.children[_i3];
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
        var lb_roomPoint = this.node.getChildByName("lb_roomPoint");
        if (roomPoint > 0) {
            lb_roomPoint.getComponent(cc.Label).string = "+" + roomPoint;
        } else {
            lb_roomPoint.getComponent(cc.Label).string = roomPoint;
        }
        //分值
        var lb_winPoint = this.node.getChildByName("lb_winPoint");
        if (winPoint > 0) {
            lb_winPoint.getComponent(cc.Label).string = "+" + winPoint;
        } else {
            lb_winPoint.getComponent(cc.Label).string = winPoint;
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
        for (var _i4 = 0; _i4 < playerAll.length; _i4++) {
            if (player.pid == playerAll[_i4].pid) {
                playerInfo = playerAll[_i4];
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
    }
});

cc._RF.pop();