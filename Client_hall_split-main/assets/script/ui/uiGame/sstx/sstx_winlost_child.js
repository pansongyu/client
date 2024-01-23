/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BasePoker_winlost_child"),

	properties: {
        dudiyou_icon: [cc.SpriteFrame],
        icon_you: [cc.SpriteFrame],
    },

	// use this for initialization
	OnLoad: function () {

	},
	ShowPlayerData:function(setEnd,playerAll,index){
        let player = setEnd.posResultList[index];

        let point  = player.point;
        let roomPoint = player.roomPoint;
        let ranksScore = player.winLosePoint/*ranksScore*/;

        let dPos = setEnd.dPos;

        //显示庄
        this.node.getChildByName("user_info").getChildByName("zhuangjia").active = (player.pos == dPos);

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
        if (ranksScore > 0) {
            this.node.getChildByName("user_info").getChildByName("bg_win").active = true;
            this.node.getChildByName("user_info").getChildByName("bg_lost").active = false;
        } else if(ranksScore < 0){
            this.node.getChildByName("user_info").getChildByName("bg_win").active = false;
            this.node.getChildByName("user_info").getChildByName("bg_lost").active = true;
        } else {
            this.node.getChildByName("user_info").getChildByName("bg_win").active = false;
            this.node.getChildByName("user_info").getChildByName("bg_lost").active = false;
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

        //显示敌友
        let ranksType = player.ranksType;
        if(ranksType == 0){
            this.node.getChildByName("user_info").getChildByName('img_du').getComponent(cc.Sprite).spriteFrame = "";
        }else{
            this.node.getChildByName("user_info").getChildByName('img_du').getComponent(cc.Sprite).spriteFrame = this.dudiyou_icon[ranksType - 1];
        }

        //倍数
        let difen = setEnd.difen;
        let lb_difen = this.node.getChildByName("lb_difen");
        let multiple = {};
        multiple[0] = "1";
        multiple[1] = "5";
        multiple[2] = "10";
        lb_difen.getComponent(cc.Label).string = multiple[difen];

        //显示抓分
        let ranksTypeMap = setEnd.ranksTypeMap;
        let lb_zhuafen = this.node.getChildByName("lb_zhuafen");
        if(ranksTypeMap[ranksType] > 0){
            lb_zhuafen.getComponent(cc.Label).string = "+" + ranksTypeMap[ranksType];
        }else{
            lb_zhuafen.getComponent(cc.Label).string = ranksTypeMap[ranksType];
        }

        //显示拖三憋三
        let threePoint = player.threePoint;
        let lb_threepoint = this.node.getChildByName("lb_threepoint");
        let lb_threepointTitle = lb_threepoint.getChildByName("lb_threepointTitle");
        if(threePoint > 0){
            lb_threepoint.getComponent(cc.Label).string = "+" + threePoint;
            lb_threepointTitle.getComponent(cc.Label).string = "拖三:";
        }else if(threePoint < 0){
            lb_threepoint.getComponent(cc.Label).string =  threePoint;
            lb_threepointTitle.getComponent(cc.Label).string = "憋三:";
        }else{
            lb_threepoint.getComponent(cc.Label).string = "";
            lb_threepointTitle.getComponent(cc.Label).string = "";
        }
        

        //房间分
        let lb_roomPoint = this.node.getChildByName("lb_roomPoint");
        if(roomPoint > 0){
            lb_roomPoint.getComponent(cc.Label).string = "+" + roomPoint;
        }
        else{
            lb_roomPoint.getComponent(cc.Label).string = roomPoint;
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
    },
});
