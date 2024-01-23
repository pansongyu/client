/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
    extends: require("BaseComponent"),

    properties: {
        icon_fct: cc.SpriteFrame,
        icon_ct: cc.SpriteFrame,
    },

    // use this for initialization
    OnLoad: function () {

    },
    ShowPlayerData: function (setEnd, playerAll, index) {
        let player = setEnd.posResultList[index];

        let point = player.point;

        //玩家分数
        let winNode = this.node.getChildByName("lb_win_num");
        let loseNode = this.node.getChildByName("lb_lose_num");
        winNode.active = false;
        loseNode.active = false;

        if (point > 0) {
            winNode.active = true;
            winNode.getComponent(cc.Label).string = "+" + point;
        }
        else {
            loseNode.active = true;
            loseNode.getComponent(cc.Label).string = point;
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

        //打独成功
        this.node.getChildByName("lb_isdadu").active = player.shibushiduying;

        // 头游
        this.node.getChildByName("lb_touyou").active = true;

        let youNumCfg = {
            "NOT": "",
            "ONE": "头游",
            "TWO": "二游",
            "THREE": "三游",
            "FOUR": "四游"
        };

        if (youNumCfg.hasOwnProperty(player.endType)) {
            let str = youNumCfg[player.endType];
            let lb_touyou = this.node.getChildByName("lb_touyou").getComponent(cc.Label);
            lb_touyou.string = str;
        }

        let playerInfo = null;
        for (let i = 0; i < playerAll.length; i++) {
            if (player.pid == playerAll[i].pid) {
                playerInfo = playerAll[i];
                break;
            }
        }

        let icon_du = this.node.getChildByName("user_info").getChildByName("icon_du");
        icon_du.active = player.shibushidadu;

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
});
