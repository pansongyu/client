/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BasePoker_winlost_child"),

	properties: {
        icon_nhWinLost: [cc.SpriteFrame],
        icon_you: [cc.SpriteFrame],

    },

	// use this for initialization
	OnLoad: function () {

	},
    ShowPlayerData:function(setEnd,playerAll,index){
        let player = setEnd.posResultList[index];

        let point  = player.point;

        //玩家分数
        let winNode = this.node.getChildByName("lb_win_num");
        let loseNode = this.node.getChildByName("lb_lose_num");
        winNode.active = false;
        loseNode.active = false;

        if(point > 0){
            winNode.active = true;
            winNode.getComponent(cc.Label).string = "+" + point;
        }
        else{
            loseNode.active = true;
            loseNode.getComponent(cc.Label).string = point;
        }

        //比赛分
        let lb_sportsPointTitle = this.node.getChildByName("lb_sportsPointTitle");
        if (player.sportsPoint) {
            if(player.sportsPoint > 0){
                lb_sportsPointTitle.active = true;
                lb_sportsPointTitle.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = "+" + player.sportsPoint;
            }
            else{
                lb_sportsPointTitle.active = true;
                lb_sportsPointTitle.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = player.sportsPoint;
            }
        }else{
            lb_sportsPointTitle.active = false;
        }

        let playerInfo = null;
        for(let i = 0;i < playerAll.length;i++){
            if(player.pid == playerAll[i].pid){
                playerInfo = playerAll[i];
                break;
            }
        }

        //显示游数
        let endType = player.endType;//游数  0为默认值
        let finishOrder = 0;
        if (endType == "ONE") {
            finishOrder = 1;
        } else if (endType == "TWO") {
            finishOrder = 2;
        } else if (endType == "THREE") {
            finishOrder = 3;
        } else if (endType == "FOUR") {
            finishOrder = 4;
        } else {
            finishOrder = -1;
        }
        if (finishOrder > 0) {
            this.node.getChildByName("user_info").getChildByName('you').getComponent(cc.Sprite).spriteFrame = this.icon_you[finishOrder - 1];
        } else {
            this.node.getChildByName("user_info").getChildByName('you').getComponent(cc.Sprite).spriteFrame = "";
        }

        
        let head = this.node.getChildByName("user_info").getChildByName("mask").getChildByName("head_img").getComponent("WeChatHeadImage");
        head.ShowHeroHead(playerInfo.pid);
        //玩家名字
        let playerName = "";
        playerName = playerInfo.name;
        if(playerName.length > 6){
            playerName = playerName.substring(0, 6) + '...';
        }
        let name = this.node.getChildByName("user_info").getChildByName("lable_name").getComponent(cc.Label);
        name.string = playerName;

        let id = this.node.getChildByName("user_info").getChildByName("label_id").getComponent(cc.Label);
        id.string = "ID:" + app.ComTool().GetPid(playerInfo["pid"]);


        //显示黑牛玩家
        let img_hnwj = this.node.getChildByName("user_info").getChildByName("img_hnwj");
        img_hnwj.active = player["outNiuGuiPai"].length > 0;
        //显示黑牛输赢
        let img_hnwinlost = this.node.getChildByName("user_info").getChildByName("img_hnwinlost");
        if(player["outNiuGuiPai"].length > 0){
            if(point > 0){
                img_hnwinlost.getComponent(cc.Sprite).spriteFrame = this.icon_nhWinLost[0];
            }else if(point < 0){
                img_hnwinlost.getComponent(cc.Sprite).spriteFrame = this.icon_nhWinLost[1];
            }else{
                img_hnwinlost.getComponent(cc.Sprite).spriteFrame = "";
            }
        }else{
            img_hnwinlost.getComponent(cc.Sprite).spriteFrame = "";
        }
    },
});
